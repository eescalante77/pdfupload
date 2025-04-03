import React from 'react';
import styled from 'styled-components';
import { ResumeData } from '../types';

interface ResumeDisplayProps {
  resumeData: ResumeData;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData }) => {
  // Function to render contact information properly
  const renderContactInfo = (contact: any) => {
    if (typeof contact === 'string') {
      return contact;
    }
    
    if (typeof contact === 'object' && contact !== null) {
      return (
        <ContactInfoContainer>
          {contact.mobile && <ContactItem><strong>Móvil:</strong> {contact.mobile}</ContactItem>}
          {contact.email && <ContactItem><strong>Email:</strong> {contact.email}</ContactItem>}
          {contact.linkedin && <ContactItem><strong>LinkedIn:</strong> {contact.linkedin}</ContactItem>}
          {contact.company && <ContactItem><strong>Empresa:</strong> {contact.company}</ContactItem>}
          {Object.entries(contact)
            .filter(([key]) => !['mobile', 'email', 'linkedin', 'company'].includes(key))
            .map(([key, value]) => (
              <ContactItem key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value as string}</ContactItem>
            ))
          }
        </ContactInfoContainer>
      );
    }
    
    return 'No hay información de contacto disponible';
  };
  
  return (
    <ResumeContainer>
      <h2>Resultados del Análisis del Currículum</h2>
      
      <Section>
        <SectionTitle>Datos Personales</SectionTitle>
        <SectionContent>
          <p><strong>Nombre:</strong> {resumeData.personalDetails.name}</p>
          <ContactInfo>
            <strong>Contacto:</strong> {renderContactInfo(resumeData.personalDetails.contact)}
          </ContactInfo>
        </SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>Experiencia Laboral</SectionTitle>
        <SectionContent>
          {resumeData.workExperience.length > 0 ? (
            <ul>
              {resumeData.workExperience.map((exp, index) => (
                <li key={index}>{exp}</li>
              ))}
            </ul>
          ) : (
            <p>No se encontró experiencia laboral</p>
          )}
        </SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>Educación</SectionTitle>
        <SectionContent>
          {resumeData.education.length > 0 ? (
            <ul>
              {resumeData.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron detalles de educación</p>
          )}
        </SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>Habilidades</SectionTitle>
        <SectionContent>
          {resumeData.skills.length > 0 ? (
            <SkillsContainer>
              {resumeData.skills.map((skill, index) => (
                <SkillTag key={index}>{skill}</SkillTag>
              ))}
            </SkillsContainer>
          ) : (
            <p>No se encontraron habilidades</p>
          )}
        </SectionContent>
      </Section>
      
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <Section>
          <SectionTitle>Información Adicional</SectionTitle>
          <SectionContent>
            <ul>
              {resumeData.additionalSections.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </SectionContent>
        </Section>
      )}
    </ResumeContainer>
  );
};

const ResumeContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 1rem 0;
  
  h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #3498db;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eaeaea;
`;

const SectionContent = styled.div`
  padding: 0.5rem 0;
  
  ul {
    list-style-position: inside;
    padding-left: 1rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
  }
  
  p {
    margin-bottom: 0.5rem;
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 0.5rem;
`;

const ContactInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.3rem;
  margin-left: 1rem;
`;

const ContactItem = styled.div`
  font-size: 0.95rem;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  background-color: #f0f9ff;
  color: #3498db;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid #d6eaf8;
`;

export default ResumeDisplay; 