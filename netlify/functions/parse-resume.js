// Mock resume parser API for Netlify Functions
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Método no permitido" })
    };
  }

  try {
    // For a real implementation, you would:
    // 1. Parse the multipart/form-data to get the PDF file
    // 2. Extract text from the PDF
    // 3. Use OpenAI API to analyze the text
    // 4. Return structured data
    
    // For this mock implementation, we'll just return a sample response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
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
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: "Error al procesar el currículum: " + error.message 
      })
    };
  }
}; 