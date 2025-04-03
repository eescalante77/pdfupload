# Resume Parser

A web application that allows users to upload résumés (CVs) in PDF format and extracts key information using OpenAI's GPT-4o-mini model. The application provides structured data about the résumé including personal details, work experience, education, skills, and more.

## Features

- PDF résumé upload and parsing
- OpenAI-powered text extraction and analysis
- Verification that uploaded document is actually a résumé
- Structured display of résumé information
- Completeness checklist that verifies essential résumé components
- Fully translated Spanish interface

## Tech Stack

### Frontend
- React with TypeScript
- Styled-components for styling
- Axios for API requests

### Backend
- Node.js with Express
- Multer for file uploads
- pdf-parse for PDF text extraction
- OpenAI API for text analysis

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/eescalante77/pdfupload.git
   cd pdfupload
   ```

2. Install dependencies for root, frontend, and backend:
   ```bash
   npm run install-all
   ```
   
   Or install them separately:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

Start both frontend and backend with a single command:
```bash
npm run dev
```

Or start them separately:
```bash
# Start backend (from the root directory)
npm run start-backend

# Start frontend (from the root directory)
npm run start-frontend
```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:5000.

## Usage

1. Open the application in your browser (http://localhost:3000)
2. Upload a PDF résumé using the upload area (drag and drop or click to browse)
3. Wait for the AI to process the résumé
4. View the extracted information and completeness checklist

## Resume Completeness Checklist

The application includes a checklist that verifies if your résumé contains:
- Name
- Education information
- Work experience

This helps users identify if their résumé is missing essential information.

## API Endpoints

### `POST /api/parse-resume`
Uploads and parses a résumé PDF file.

**Request:**
- Content-Type: multipart/form-data
- Body: Form data with a 'resume' field containing the PDF file

**Response:**
```json
{
  "success": true,
  "message": "Currículum analizado con éxito",
  "resumeData": {
    "personalDetails": {
      "name": "John Doe",
      "contact": {
        "email": "john@example.com",
        "mobile": "123-456-7890"
      }
    },
    "workExperience": ["Experience 1", "Experience 2"],
    "education": ["Education 1", "Education 2"],
    "skills": ["Skill 1", "Skill 2", "Skill 3"]
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 