
export interface Industry {
  id: string;
  name: string;
  icon?: string;
}

export interface Role {
  id: string;
  name: string;
  industry: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  context?: string;
}

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InterviewSession {
  id: string;
  industry: Industry;
  role: Role;
  questions: InterviewQuestion[];
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  feedback?: InterviewFeedback;
  recordingUrl?: string;
}

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}

export interface ApiKeySettings {
  groqApiKey: string;
}

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
