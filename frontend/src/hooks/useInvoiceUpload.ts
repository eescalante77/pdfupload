import { useState } from 'react';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  total: number;
  vendor: string;
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

export interface UseInvoiceUploadReturn {
  handleFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  errorType: 'not-pdf' | 'not-invoice' | 'server' | 'generic' | null;
  invoiceData: InvoiceData | null;
}

const useInvoiceUpload = (): UseInvoiceUploadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'not-pdf' | 'not-invoice' | 'server' | 'generic' | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setInvoiceData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/.netlify/functions/parse-invoice', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al procesar la factura');
        setErrorType(data.type || 'generic');
        return;
      }

      setInvoiceData(data);
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
    invoiceData,
  };
};

export default useInvoiceUpload;

// Add empty export to make this a module
export {}; 