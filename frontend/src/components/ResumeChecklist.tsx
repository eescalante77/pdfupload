import React from 'react';
import styled from 'styled-components';
import { ResumeData } from '../types';

interface ResumeChecklistProps {
  resumeData: ResumeData;
}

const ResumeChecklist: React.FC<ResumeChecklistProps> = ({ resumeData }) => {
  // Check if name is present
  const hasName = !!resumeData.personalDetails.name;
  
  // Check if education is present
  const hasEducation = resumeData.education && resumeData.education.length > 0;
  
  // Check if work experience is present
  const hasWorkExperience = resumeData.workExperience && resumeData.workExperience.length > 0;
  
  // Calculate completeness percentage
  const totalChecks = 3;
  const passedChecks = [hasName, hasEducation, hasWorkExperience].filter(Boolean).length;
  const completenessPercentage = Math.round((passedChecks / totalChecks) * 100);
  
  return (
    <ChecklistContainer>
      <ChecklistHeader>
        <h3>Lista de Verificación del Currículum</h3>
        <CompletionBadge percentage={completenessPercentage}>
          {completenessPercentage}%
        </CompletionBadge>
      </ChecklistHeader>
      
      <ChecklistItem passed={hasName}>
        <CheckIcon passed={hasName}>{hasName ? '✓' : '✗'}</CheckIcon>
        <span>Nombre</span>
      </ChecklistItem>
      
      <ChecklistItem passed={hasEducation}>
        <CheckIcon passed={hasEducation}>{hasEducation ? '✓' : '✗'}</CheckIcon>
        <span>Educación</span>
      </ChecklistItem>
      
      <ChecklistItem passed={hasWorkExperience}>
        <CheckIcon passed={hasWorkExperience}>{hasWorkExperience ? '✓' : '✗'}</CheckIcon>
        <span>Experiencia Laboral</span>
      </ChecklistItem>
      
      <ChecklistSummary>
        {completenessPercentage === 100 ? (
          <SummaryMessage success>
            ¡Tu currículum contiene toda la información esencial!
          </SummaryMessage>
        ) : (
          <SummaryMessage success={false}>
            Tu currículum está incompleto. Considera añadir la información que falta.
          </SummaryMessage>
        )}
      </ChecklistSummary>
    </ChecklistContainer>
  );
};

const ChecklistContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 800px;
`;

const ChecklistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    margin: 0;
    color: #2c3e50;
  }
`;

interface CompletionBadgeProps {
  percentage: number;
}

const CompletionBadge = styled.div<CompletionBadgeProps>`
  background-color: ${props => {
    if (props.percentage >= 100) return '#2ecc71';
    if (props.percentage >= 66) return '#f39c12';
    return '#e74c3c';
  }};
  color: white;
  font-weight: bold;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

interface ChecklistItemProps {
  passed: boolean;
}

const ChecklistItem = styled.div<ChecklistItemProps>`
  display: flex;
  align-items: center;
  margin: 0.8rem 0;
  padding: 0.8rem;
  background-color: ${props => props.passed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

interface CheckIconProps {
  passed: boolean;
}

const CheckIcon = styled.span<CheckIconProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.passed ? '#2ecc71' : '#e74c3c'};
  color: white;
  font-weight: bold;
  margin-right: 0.8rem;
  font-size: 0.8rem;
`;

const ChecklistSummary = styled.div`
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #f0f0f0;
`;

interface SummaryMessageProps {
  success: boolean;
}

const SummaryMessage = styled.p<SummaryMessageProps>`
  margin: 0;
  color: ${props => props.success ? '#2ecc71' : '#e74c3c'};
  font-weight: 600;
  text-align: center;
`;

export default ResumeChecklist; 