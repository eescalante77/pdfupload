export interface ContactInfo {
  mobile?: string;
  email?: string;
  linkedin?: string;
  company?: string;
  [key: string]: string | undefined;
}

export interface ResumeData {
  personalDetails: {
    name: string;
    contact: string | ContactInfo;
  };
  workExperience: string[];
  education: string[];
  skills: string[];
  additionalSections?: string[];
}

export interface APIResponse {
  success: boolean;
  message: string;
  resumeData?: ResumeData;
} 