import React, { useState, useRef, useCallback } from 'react';

interface InvoiceUploadProps {
  onInvoiceData: (file: File) => Promise<void>;
  onError: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ onInvoiceData }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    onInvoiceData(file);
  }, [onInvoiceData]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, [processFile]);
  
  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  const handleResetFile = useCallback(() => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  return (
    <div className="upload-container">
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
        <div className="upload-icon">📄</div>
        <div className="upload-text">
          {fileName ? (
            <span className="file-name">{fileName}</span>
          ) : (
            <>
              <p>Arrastra y suelta tu factura (PDF) aquí, o</p>
              <button className="upload-button" onClick={handleButtonClick}>
                Subir archivos
              </button>
            </>
          )}
        </div>
        {fileName && (
          <button className="reset-button" onClick={handleResetFile}>
            Subir otro archivo
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceUpload; 