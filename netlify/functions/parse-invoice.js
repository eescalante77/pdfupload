const formidable = require('formidable');
const fs = require('fs');

function parseFormData(event) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    
    form.parse(event, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    const files = await parseFormData(event);
    const file = files.file;

    // Check if file exists
    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'No se ha proporcionado ningún archivo',
          type: 'generic'
        }),
      };
    }

    // Get the file name from content-disposition header
    const contentDisposition = event.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : file.name;

    // Check if file is PDF
    if (!file.mimetype || file.mimetype !== 'application/pdf') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `El archivo "${fileName}" no es un PDF. Por favor, sube únicamente archivos PDF.`,
          type: 'not-pdf'
        }),
      };
    }

    // Simulate invoice parsing with random success/failure
    const random = Math.random();
    
    if (random < 0.1) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `El archivo "${fileName}" no parece ser una factura válida. Asegúrate de que el documento contiene información típica de una factura.`,
          type: 'not-invoice'
        }),
      };
    }

    // Return sample invoice data
    return {
      statusCode: 200,
      body: JSON.stringify({
        invoiceNumber: 'FAC-2024-001',
        date: '2024-03-20',
        vendor: 'Empresa Ejemplo S.L.',
        total: 1234.56,
        items: [
          {
            description: 'Servicio de Consultoría',
            quantity: 10,
            price: 100.00,
            total: 1000.00
          },
          {
            description: 'Material de Oficina',
            quantity: 5,
            price: 46.91,
            total: 234.56
          }
        ]
      }),
    };
  } catch (error) {
    console.error('Error processing invoice:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error al procesar la factura',
        type: 'server'
      }),
    };
  }
}; 