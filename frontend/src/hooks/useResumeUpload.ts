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
  errorType: 'none' | 'not-pdf' | 'not-resume' | 'server' | 'generic';
}

const useResumeUpload = (): UseResumeUploadReturn => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'none' | 'not-pdf' | 'not-resume' | 'server' | 'generic'>('none');

  const uploadResume = useCallback(async (file: File) => {
    if (!file) {
      setError('Por favor selecciona un archivo para subir.');
      setErrorType('generic');
      return;
    }

    console.log('Tipo de archivo:', file.type);
    
    // Clear previous errors
    setError(null);
    setErrorType('none');
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      setError(`FORMATO INCORRECTO: El archivo "${file.name}" no es un PDF. Por favor, sube únicamente archivos PDF.`);
      setErrorType('not-pdf');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsLoading(true);
    
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
          setError(`DOCUMENTO NO VÁLIDO: El archivo "${file.name}" no parece ser un currículum. Por favor, sube un documento que contenga la información típica de un currículum.`);
          setErrorType('not-resume');
        } else {
          setError(response.data.message || 'No se pudo analizar el documento.');
          setErrorType('generic');
        }
      }
    } catch (error: any) {
      console.error('Detalles del error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code outside 2xx range
        console.error('Error de respuesta del servidor:', error.response.data);
        
        // Check for specific error messages
        const errorMessage = error.response.data.message || '';
        
        if (errorMessage.includes('PDF') || errorMessage.includes('formato PDF')) {
          setError(`FORMATO INCORRECTO: El archivo "${file.name}" no es un PDF válido. Por favor, sube únicamente archivos PDF correctamente formateados.`);
          setErrorType('not-pdf');
        } else if (errorMessage.includes('no parece ser un currículum')) {
          setError(`DOCUMENTO NO VÁLIDO: El archivo "${file.name}" no contiene la estructura de un currículum. Asegúrate de que el documento incluya secciones como experiencia laboral, educación y habilidades.`);
          setErrorType('not-resume');
        } else {
          setError('Hubo un problema al procesar tu documento. Asegúrate de que es un currículum en formato PDF válido.');
          setErrorType('generic');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No se recibió respuesta:', error.request);
        setError('No se pudo conectar con el servidor. Por favor intenta de nuevo más tarde.');
        setErrorType('server');
      } else {
        // Something happened in setting up the request
        console.error('Error en la configuración de la solicitud:', error.message);
        setError('Ocurrió un error al subir el archivo. Por favor intenta de nuevo.');
        setErrorType('generic');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadResume,
    resumeData,
    isLoading,
    error,
    errorType
  };
};

export default useResumeUpload; 