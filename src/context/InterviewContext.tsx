
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InterviewSession, Industry, Role, Message, ApiKeySettings } from '../types';

interface InterviewContextType {
  apiKeySettings: ApiKeySettings;
  setApiKeySettings: React.Dispatch<React.SetStateAction<ApiKeySettings>>;
  currentSession: InterviewSession | null;
  startNewSession: (industry: Industry, role: Role) => void;
  addMessage: (content: string, role: 'system' | 'user' | 'assistant') => void;
  endCurrentSession: () => void;
  saveRecording: (url: string) => void;
  allSessions: InterviewSession[];
  industries: Industry[];
  rolesByIndustry: Record<string, Role[]>;
}

const defaultIndustries: Industry[] = [
  { id: 'tech', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'marketing', name: 'Marketing' },
];

const defaultRolesByIndustry: Record<string, Role[]> = {
  tech: [
    { id: 'swe', name: 'Software Engineer', industry: 'tech' },
    { id: 'pm', name: 'Product Manager', industry: 'tech' },
    { id: 'data', name: 'Data Scientist', industry: 'tech' },
    { id: 'ux', name: 'UX Designer', industry: 'tech' },
  ],
  finance: [
    { id: 'analyst', name: 'Financial Analyst', industry: 'finance' },
    { id: 'advisor', name: 'Financial Advisor', industry: 'finance' },
    { id: 'accountant', name: 'Accountant', industry: 'finance' },
  ],
  healthcare: [
    { id: 'nurse', name: 'Nurse', industry: 'healthcare' },
    { id: 'doctor', name: 'Physician', industry: 'healthcare' },
    { id: 'therapist', name: 'Therapist', industry: 'healthcare' },
  ],
  education: [
    { id: 'teacher', name: 'Teacher', industry: 'education' },
    { id: 'professor', name: 'Professor', industry: 'education' },
    { id: 'counselor', name: 'School Counselor', industry: 'education' },
  ],
  marketing: [
    { id: 'manager', name: 'Marketing Manager', industry: 'marketing' },
    { id: 'specialist', name: 'Digital Marketing Specialist', industry: 'marketing' },
    { id: 'content', name: 'Content Strategist', industry: 'marketing' },
  ],
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKeySettings, setApiKeySettings] = useState<ApiKeySettings>({ groqApiKey: '' });
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [allSessions, setAllSessions] = useState<InterviewSession[]>([]);

  const startNewSession = (industry: Industry, role: Role) => {
    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      industry,
      role,
      questions: [],
      messages: [
        {
          id: `message-${Date.now()}`,
          role: 'system',
          content: `You are an AI interviewer for a ${role.name} role in the ${industry.name} industry. Ask relevant interview questions one at a time. After the candidate responds to each question, provide brief feedback before asking the next question.`,
          timestamp: new Date(),
        },
        {
          id: `message-${Date.now() + 1}`,
          role: 'assistant',
          content: `Hello! I'll be conducting your mock interview for the ${role.name} position today. Let's get started with the first question.`,
          timestamp: new Date(),
        },
      ],
      startTime: new Date(),
    };
    setCurrentSession(newSession);
    setAllSessions((prev) => [...prev, newSession]);
  };

  const addMessage = (content: string, role: 'system' | 'user' | 'assistant') => {
    if (!currentSession) return;
    
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
    };
    
    setCurrentSession((prev) => {
      if (!prev) return null;
      const updatedSession = {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
      
      // Update in allSessions too
      setAllSessions(sessions => 
        sessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        )
      );
      
      return updatedSession;
    });
  };

  const endCurrentSession = () => {
    if (!currentSession) return;
    
    setCurrentSession((prev) => {
      if (!prev) return null;
      const updatedSession = {
        ...prev,
        endTime: new Date(),
      };
      
      // Update in allSessions too
      setAllSessions(sessions => 
        sessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        )
      );
      
      return updatedSession;
    });
  };
  
  const saveRecording = (url: string) => {
    if (!currentSession) return;
    
    setCurrentSession((prev) => {
      if (!prev) return null;
      const updatedSession = {
        ...prev,
        recordingUrl: url,
      };
      
      // Update in allSessions too
      setAllSessions(sessions => 
        sessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        )
      );
      
      return updatedSession;
    });
  };

  const value = {
    apiKeySettings,
    setApiKeySettings,
    currentSession,
    startNewSession,
    addMessage,
    endCurrentSession,
    saveRecording,
    allSessions,
    industries: defaultIndustries,
    rolesByIndustry: defaultRolesByIndustry,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
