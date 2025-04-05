import React from 'react';

export interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="nav-container">
      <button
        className={activeTab === 'resume' ? 'active' : ''}
        onClick={() => onTabChange('resume')}
      >
        Resumes
      </button>
      <button
        className={activeTab === 'invoice' ? 'active' : ''}
        onClick={() => onTabChange('invoice')}
      >
        Facturas
      </button>
    </div>
  );
};

export default Navigation; 