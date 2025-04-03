// Mock resume parser API for Netlify Functions
exports.handler = async function(event, context) {
  // Add CORS headers for browser security
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: "Método no permitido" 
      })
    };
  }

  try {
    // Get the file name from the form data if available
    let fileName = "documento";
    try {
      const contentType = event.headers['content-type'] || '';
      // Try to extract the filename from the content-disposition header if available
      const contentDisposition = event.headers['content-disposition'] || '';
      const fileNameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    } catch (e) {
      console.error('Error extracting filename:', e);
    }

    // Basic content-type validation (in a real implementation we'd parse the multipart form)
    const contentType = event.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: `FORMATO INCORRECTO: El archivo "${fileName}" no es un PDF. Por favor, sube únicamente archivos PDF.`,
          errorType: "not-pdf"
        })
      };
    }

    // Simulate different error scenarios based on randomness for demonstration
    const randomValue = Math.random();
    
    // Simulate non-PDF document error (10% chance)
    if (randomValue < 0.1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: `FORMATO INCORRECTO: El archivo "${fileName}" no es un PDF válido. Por favor, sube únicamente archivos PDF.`,
          errorType: "not-pdf"
        })
      };
    }
    
    // Simulate non-resume document error (10% chance)
    if (randomValue >= 0.1 && randomValue < 0.2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: `DOCUMENTO NO VÁLIDO: El archivo "${fileName}" no parece ser un currículum. Por favor sube un currículum válido que incluya tu experiencia, educación y habilidades.`,
          errorType: "not-resume"
        })
      };
    }

    // For the successful case, return sample data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Currículum analizado con éxito (demostración)",
        resumeData: {
          personalDetails: {
            name: "Juan Ejemplo",
            contact: {
              email: "juan.ejemplo@correo.com",
              mobile: "123-456-7890",
              linkedin: "linkedin.com/in/juan-ejemplo"
            }
          },
          workExperience: [
            "Desarrollador Web Senior en TechCorp (2020-Presente)",
            "Desarrollador Frontend en WebSolutions (2018-2020)",
            "Pasante de Desarrollo en StartupXYZ (2017-2018)"
          ],
          education: [
            "Universidad Tecnológica - Licenciatura en Informática (2014-2018)",
            "Instituto Técnico Superior - Técnico en Programación (2012-2014)"
          ],
          skills: [
            "JavaScript", "React", "Node.js", "TypeScript", "HTML/CSS", 
            "Git", "MongoDB", "Express", "RESTful APIs", "Responsive Design"
          ],
          additionalSections: [
            "Idiomas: Español (nativo), Inglés (avanzado)",
            "Certificaciones: AWS Certified Developer, MongoDB Certified Developer"
          ]
        }
      })
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: "Ocurrió un problema al procesar tu currículum. Por favor intenta de nuevo.",
        errorType: "generic"
      })
    };
  }
}; 