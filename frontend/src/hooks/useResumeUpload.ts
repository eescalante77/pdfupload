import { useState } from 'react';
import { ResumeData } from '../types';

const useResumeUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'not-pdf' | 'not-resume' | 'server' | 'generic' | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setResumeData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/.netlify/functions/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al procesar el archivo');
        setErrorType(data.type || 'generic');
        return;
      }

      setResumeData(data);
    } catch (err) {
      setError('Error de conexión al servidor');
      setErrorType('server');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFileUpload,
    isLoading,
    error,
    errorType,
    resumeData,
  };
};

export default useResumeUpload;

// Add empty export to make this a module
export {}; 