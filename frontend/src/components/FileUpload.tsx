import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface FileUploadProps {
  onResumeData: (file: File) => Promise<void>;
  onError: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onResumeData }) => {
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
    onResumeData(file);
  }, [onResumeData]);
  
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
              <MainText>Arrastra y suelta tu currículum (PDF) aquí, o</MainText>
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
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

interface DropZoneProps {
  isDragging: boolean;
}

const DropZone = styled.div<DropZoneProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${props => props.isDragging ? '#f0f9ff' : 'white'};
  border: 2px dashed ${props => props.isDragging ? '#3498db' : '#e1e1e1'};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3498db;
    background-color: #f0f9ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MainText = styled.p`
  margin-bottom: 1rem;
  color: #555;
`;

const BrowseButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const FileName = styled.p`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0.5rem 0;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  padding: 0.6rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  
  &:hover {
    color: #2980b9;
  }
`;

export default FileUpload; 