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
      
      <div className="content-container">
        {activeTab === 'resume' ? (
          <>
            <h1>Analizador de Currículum</h1>
            <div className="upload-container">
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
            </div>
            {resumeData && (
              <div className="resume-display">
                <ResumeDisplay resumeData={resumeData} />
                <ResumeChecklist resumeData={resumeData} />
              </div>
            )}
          </>
        ) : (
          <>
            <h1>Analizador de Facturas</h1>
            <div className="upload-container">
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
            </div>
            {invoiceData && (
              <div className="invoice-display">
                <InvoiceDisplay invoiceData={invoiceData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App; 