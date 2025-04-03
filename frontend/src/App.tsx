import React, { useState } from 'react';
import { 
  FileUpload, 
  ResumeDisplay, 
  ResumeChecklist, 
  Navigation, 
  InvoiceUpload,
  InvoiceDisplay 
} from './components';
import useResumeUpload from './hooks/useResumeUpload';
import useInvoiceUpload from './hooks/useInvoiceUpload';
import './App.css';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('resume');
  const { 
    handleFileUpload: handleResumeUpload, 
    isLoading: isResumeLoading, 
    error: resumeError, 
    errorType: resumeErrorType, 
    resumeData 
  } = useResumeUpload();

  const {
    handleFileUpload: handleInvoiceUpload,
    isLoading: isInvoiceLoading,
    error: invoiceError,
    errorType: invoiceErrorType,
    invoiceData
  } = useInvoiceUpload();

  return (
    <div className="App">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'resume' ? (
        <>
          <h1>Analizador de Currículum</h1>
          <FileUpload
            onResumeData={handleResumeUpload}
            onError={() => {}}
            setIsLoading={() => {}}
          />
          {resumeError && (
            <div className={`error-container error-${resumeErrorType}`}>
              {resumeError}
            </div>
          )}
          {isResumeLoading && <div className="loading">Analizando el documento...</div>}
          {resumeData && (
            <>
              <ResumeDisplay resumeData={resumeData} />
              <ResumeChecklist resumeData={resumeData} />
            </>
          )}
        </>
      ) : (
        <>
          <h1>Analizador de Facturas</h1>
          <InvoiceUpload
            onInvoiceData={handleInvoiceUpload}
            onError={() => {}}
            setIsLoading={() => {}}
          />
          {invoiceError && (
            <div className={`error-container error-${invoiceErrorType}`}>
              {invoiceError}
            </div>
          )}
          {isInvoiceLoading && <div className="loading">Analizando la factura...</div>}
          {invoiceData && <InvoiceDisplay invoiceData={invoiceData} />}
        </>
      )}
    </div>
  );
};

export default App; 