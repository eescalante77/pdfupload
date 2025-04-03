import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

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
    <UploadContainer>
      <DropZone
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        isDragging={isDragging}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
        <UploadIcon>📄</UploadIcon>
        <UploadText>
          {fileName ? (
            <FileName>{fileName}</FileName>
          ) : (
            <>
              <MainText>Arrastra y suelta tu factura (PDF) aquí, o</MainText>
              <BrowseButton onClick={handleButtonClick}>
                Subir archivos
              </BrowseButton>
            </>
          )}
        </UploadText>
        {fileName && (
          <ResetButton onClick={handleResetFile}>
            Subir otro archivo
          </ResetButton>
        )}
      </DropZone>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 20px;
`;

const DropZone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#4a90e2' : '#ccc'};
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  background-color: ${props => props.isDragging ? 'rgba(74, 144, 226, 0.1)' : '#fafafa'};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 500px;

  &:hover {
    border-color: #4a90e2;
    background-color: rgba(74, 144, 226, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const UploadText = styled.div`
  margin: 15px 0;
`;

const MainText = styled.p`
  margin: 0;
  color: #666;
`;

const BrowseButton = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }
`;

const FileName = styled.span`
  color: #4a90e2;
  font-weight: 500;
`;

const ResetButton = styled.button`
  background-color: transparent;
  color: #666;
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    border-color: #999;
  }
`;

export default InvoiceUpload; 