import React from 'react';
import FileUpload from './components/FileUpload';
import ResumeDisplay from './components/ResumeDisplay';
import ResumeChecklist from './components/ResumeChecklist';
import useResumeUpload from './hooks/useResumeUpload';
import './App.css';

const App: React.FC = () => {
  const { uploadResume, resumeData, isLoading, error } = useResumeUpload();

  const handleFileUpload = async (file: File) => {
    await uploadResume(file);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Analizador de Currículum</h1>
        <p>Sube tu currículum para extraer información clave</p>
      </header>
      
      <main>
        <FileUpload 
          onResumeData={handleFileUpload}
          onError={() => {}} // Errors are handled by the hook now
          setIsLoading={() => {}} // Loading state is handled by the hook now
        />
        
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Analizando tu currículum...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}
        
        {resumeData && (
          <>
            <ResumeChecklist resumeData={resumeData} />
            <ResumeDisplay resumeData={resumeData} />
          </>
        )}
      </main>
      
      <footer>
        <p>© 2025 Aplicación de Análisis de Currículum</p>
      </footer>
    </div>
  );
};

export default App; 