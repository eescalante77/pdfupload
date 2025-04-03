import React from 'react';
import { FileUpload, ResumeDisplay, ResumeChecklist } from './components';
import useResumeUpload from './hooks/useResumeUpload';
import './App.css';

const App: React.FC = () => {
  const { uploadResume, resumeData, isLoading, error, errorType } = useResumeUpload();

  const handleFileUpload = async (file: File) => {
    await uploadResume(file);
  };

  const renderErrorIcon = () => {
    switch (errorType) {
      case 'not-pdf':
        return '📄❌';
      case 'not-resume':
        return '📝❌';
      case 'server':
        return '🖥️❌';
      default:
        return '⚠️';
    }
  };

  const renderErrorTitle = () => {
    switch (errorType) {
      case 'not-pdf':
        return 'Formato de Archivo Incorrecto';
      case 'not-resume':
        return 'No Es Un Currículum';
      case 'server':
        return 'Error de Conexión';
      default:
        return 'Atención';
    }
  };

  const renderErrorHelp = () => {
    switch (errorType) {
      case 'not-pdf':
        return 'Este analizador solo puede procesar archivos PDF. Por favor, convierte tu documento a formato PDF e inténtalo de nuevo.';
      case 'not-resume':
        return 'Asegúrate de que el documento contiene información típica de un currículum como experiencia laboral, educación y habilidades. Algunos documentos PDF no son reconocidos como currículums por nuestro sistema.';
      case 'server':
        return 'Parece que hay un problema de conexión con nuestro servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.';
      default:
        return 'Si el problema persiste, prueba con otro documento o vuelve más tarde.';
    }
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
          <div className={`error-container error-${errorType}`}>
            <div className="error-icon">{renderErrorIcon()}</div>
            <h3>{renderErrorTitle()}</h3>
            <p>{error}</p>
            <p className="error-help">{renderErrorHelp()}</p>
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