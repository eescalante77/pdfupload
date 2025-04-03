import React from 'react';
import styled from 'styled-components';

export interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <NavContainer>
      <NavTab
        active={activeTab === 'resume'}
        onClick={() => onTabChange('resume')}
      >
        Resumes
      </NavTab>
      <NavTab
        active={activeTab === 'invoice'}
        onClick={() => onTabChange('invoice')}
      >
        Facturas
      </NavTab>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 20px;
`;

const NavTab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#4a90e2' : '#666'};
  background-color: ${props => props.active ? '#e3f2fd' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#e3f2fd' : '#f0f0f0'};
    color: #4a90e2;
  }
`;

export default Navigation; 