const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Check if pdf-parse is installed
try {
  console.log('PDF-Parse version:', require('pdf-parse/package.json').version);
} catch (error) {
  console.error('Error checking pdf-parse version:', error.message);
}

// Path to a sample PDF file (you'll need to create this or use an existing one)
const samplePdfPath = path.join(__dirname, 'sample.pdf');

async function testPdfParse() {
  try {
    console.log('Testing PDF parsing...');
    
    // Check if sample PDF exists
    if (!fs.existsSync(samplePdfPath)) {
      console.log('Sample PDF not found at:', samplePdfPath);
      console.log('Please create a sample.pdf file in the backend directory to test.');
      return;
    }
    
    console.log('Reading PDF file:', samplePdfPath);
    const dataBuffer = fs.readFileSync(samplePdfPath);
    
    console.log('Parsing PDF...');
    const data = await pdfParse(dataBuffer);
    
    console.log('PDF parsing successful!');
    console.log('Extracted text (first 100 chars):', data.text.substring(0, 100) + '...');
  } catch (error) {
    console.error('Error parsing PDF:');
    console.error(error.message);
    console.error(error.stack);
  }
}

testPdfParse(); 