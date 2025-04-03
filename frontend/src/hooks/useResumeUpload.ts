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
      setError('Por favor selecciona un archivo para subir.');
      return;
    }

    console.log('Tipo de archivo:', file.type);
    
    if (file.type !== 'application/pdf') {
      setError(`El archivo debe estar en formato PDF. Por favor sube un archivo PDF válido.`);
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
        // Handle specific API error message about non-resume documents
        if (response.data.message && response.data.message.includes('no parece ser un currículum')) {
          setError('El documento subido no parece ser un currículum. Por favor sube un currículum válido.');
        } else {
          setError(response.data.message || 'No se pudo analizar el documento.');
        }
      }
    } catch (error: any) {
      console.error('Detalles del error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code outside 2xx range
        console.error('Error de respuesta del servidor:', error.response.data);
        
        // Check for specific error messages about document format
        if (error.response.data.message && error.response.data.message.includes('no parece ser un currículum')) {
          setError('El documento subido no parece ser un currículum. Por favor sube un currículum válido.');
        } else {
          setError('Hubo un problema al procesar tu documento. Asegúrate de que es un currículum en formato PDF válido.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No se recibió respuesta:', error.request);
        setError('No se pudo conectar con el servidor. Por favor intenta de nuevo más tarde.');
      } else {
        // Something happened in setting up the request
        console.error('Error en la configuración de la solicitud:', error.message);
        setError('Ocurrió un error al subir el archivo. Por favor intenta de nuevo.');
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