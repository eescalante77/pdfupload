const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is a PDF
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('El archivo debe estar en formato PDF. Por favor sube un archivo PDF válido.'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter
});

// Error handler for multer file uploads
const uploadHandler = (req, res, next) => {
  const multerUpload = upload.single('resume');
  
  multerUpload(req, res, (err) => {
    if (err) {
      // Handle different types of upload errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.' 
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error al subir el archivo.' 
      });
    }
    
    // No file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se seleccionó ningún archivo para subir.' 
      });
    }
    
    next();
  });
};

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    console.log('Reading PDF file from:', filePath);
    const dataBuffer = fs.readFileSync(filePath);
    console.log('File read successfully, buffer size:', dataBuffer.length);
    
    console.log('Starting PDF parsing...');
    const data = await pdfParse(dataBuffer);
    console.log('PDF parsing successful, extracted text length:', data.text.length);
    
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Helper function to verify if text is a resume
async function isResume(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente de IA que puede identificar si un documento es un currículum vitae. Responde únicamente con "true" o "false".'
        },
        {
          role: 'user',
          content: `¿El siguiente texto proviene de un currículum o CV? Por favor, analiza el contenido y la estructura. Responde únicamente con "true" si es un currículum, o "false" si no lo es.\n\n${text.substring(0, 4000)}`
        }
      ],
      temperature: 0.1,
      max_tokens: 5,
    });

    const result = response.choices[0].message.content.trim().toLowerCase();
    return result === 'true';
  } catch (error) {
    console.error('Error verifying if text is a resume:', error);
    throw new Error('No se pudo verificar si el documento es un currículum');
  }
}

// Helper function to extract resume information
async function extractResumeInfo(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto analista de currículums. Extrae información clave del currículum en un formato estructurado.'
        },
        {
          role: 'user',
          content: `Extrae la siguiente información de este texto de currículum y devuélvela como un objeto JSON con estas claves: 
          "personalDetails" (que contiene los campos "name" y "contact" - el campo contact debe ser un objeto con claves como "email", "phone", "mobile", "linkedin", etc.), 
          "workExperience" (array de strings), 
          "education" (array de strings), 
          "skills" (array de strings), 
          "additionalSections" (array opcional de strings).
          
          Ejemplo del formato adecuado para el campo contact:
          "contact": {
            "email": "juan@ejemplo.com",
            "mobile": "123-456-7890",
            "linkedin": "linkedin.com/in/juan-perez"
          }
          
          Texto del currículum:
          ${text.substring(0, 10000)}`
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error extracting information from resume:', error);
    throw new Error('No se pudo extraer información del currículum');
  }
}

// Route to handle resume uploads and parsing
app.post('/api/parse-resume', uploadHandler, async (req, res) => {
  try {
    console.log('File uploaded successfully:', req.file.originalname);
    console.log('File path:', req.file.path);
    console.log('File size:', req.file.size);
    console.log('File mimetype:', req.file.mimetype);

    // Extract text from PDF
    const filePath = req.file.path;
    console.log('Attempting to extract text from PDF...');
    const pdfText = await extractTextFromPDF(filePath);
    console.log('Text extraction successful, text length:', pdfText.length);

    // Verify if it's a resume
    const resumeVerified = await isResume(pdfText);
    if (!resumeVerified) {
      // Clean up - remove the file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        success: false, 
        message: 'El documento subido no parece ser un currículum. Por favor sube un currículum válido que incluya tu experiencia, educación y habilidades.' 
      });
    }

    // Extract resume information
    const resumeData = await extractResumeInfo(pdfText);

    // Clean up - remove the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Currículum analizado con éxito',
      resumeData
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Clean up in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.message.includes('PDF')) {
      return res.status(400).json({
        success: false,
        message: 'Hubo un problema al leer el archivo PDF. Asegúrate de que es un PDF válido y no está dañado.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ocurrió un problema al procesar tu currículum. Por favor intenta de nuevo.'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 