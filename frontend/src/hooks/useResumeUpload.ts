import { useState, useCallback } from 'react';
import axios from 'axios';
import { ResumeData, APIResponse } from '../types';

// Use environment variable with fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface UseResumeUploadReturn {
  uploadResume: (file: File) => Promise<void>;
  resumeData: ResumeData | null;
  isLoading: boolean;
  error: string | null;
}

const useResumeUpload = (): UseResumeUploadReturn => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadResume = useCallback(async (file: File) => {
    if (!file) {
      setError('No se seleccionó ningún archivo');
      return;
    }

    console.log('Tipo de archivo:', file.type);
    
    if (file.type !== 'application/pdf') {
      setError(`Por favor, sube un archivo PDF. Tipo de archivo recibido: ${file.type}`);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsLoading(true);
    setError(null);
    
    try {
      const apiEndpoint = `${API_URL}/api/parse-resume`;
      console.log(`Realizando solicitud API a ${apiEndpoint}`);
      
      const response = await axios.post<APIResponse>(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta de la API:', response.data);

      if (response.data.success && response.data.resumeData) {
        setResumeData(response.data.resumeData);
      } else {
        setError(response.data.message || 'No se pudo analizar el currículum');
      }
    } catch (error: any) {
      console.error('Detalles del error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error de respuesta del servidor:', error.response.data);
        console.error('Código de estado:', error.response.status);
        setError(`Error del servidor (${error.response.status}): ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No se recibió respuesta:', error.request);
        setError('No se recibió respuesta del servidor. Por favor, verifica que el servidor backend esté funcionando.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error en la configuración de la solicitud:', error.message);
        setError(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadResume,
    resumeData,
    isLoading,
    error
  };
};

export default useResumeUpload; 