
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useInterview } from '@/context/InterviewContext';
import SpeechRecognition from './SpeechRecognition';
import VideoRecorder from './VideoRecorder';
import { speak, cancelSpeech } from '@/utils/textToSpeech';

const InterviewSession: React.FC = () => {
  const navigate = useNavigate();
  const { currentSession, addMessage, endCurrentSession, apiKeySettings, saveRecording } = useInterview();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLiveRecording, setIsLiveRecording] = useState(false);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!currentSession) {
      navigate('/');
      return;
    }
    
    scrollToBottom();
  }, [currentSession, navigate]);

  useEffect(() => {
    scrollToBottom();
    
    // Speak the last AI message if it exists
    if (currentSession?.messages.length) {
      const lastMessage = currentSession.messages[currentSession.messages.length - 1];
      if (lastMessage.role === 'assistant') {
        speak(lastMessage.content);
      }
    }
  }, [currentSession?.messages]);

  // Stop speaking when the component unmounts
  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  const handleTranscript = (transcript: string) => {
    setInputValue(transcript);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;
    
    if (!apiKeySettings.groqApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your GROQ API key in settings.",
        variant: "destructive"
      });
      return;
    }

    // Cancel any ongoing speech before sending a new message
    cancelSpeech();
    
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to GROQ
      const lastMessages = currentSession.messages.slice(-5);
      
      // Preparation for the actual API call when the user adds their key
      const prompt = JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an AI interviewer for a ${currentSession.role.name} role in the ${currentSession.industry.name} industry. Ask relevant interview questions one at a time. After the candidate responds to each question, provide brief feedback before asking the next question. Keep your responses concise and professional.`
          },
          ...lastMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 800,
      });

      // For now, simulate a response since we don't have the actual API key
      setTimeout(() => {
        let aiResponse = "";
        
        if (lastMessages.length === 2) {
          // First question after introduction
          aiResponse = `Great to meet you! Let's start with a common question: Can you tell me about your background and experience that's relevant to this ${currentSession.role.name} role?`;
        } else if (inputValue.toLowerCase().includes("thank") || inputValue.toLowerCase().includes("bye")) {
          // Closing the interview
          aiResponse = `Thank you for participating in this mock interview. You've done well overall. To improve, consider structuring your answers using the STAR method (Situation, Task, Action, Result) and providing more specific examples. Would you like to end the interview now?`;
        } else {
          // Random questions based on role
          const feedbacks = [
            "That's a good answer. I appreciate your detailed example.",
            "Nice response. Consider adding more specific metrics next time.",
            "Good points. Try to focus more on your direct contributions.",
            "Interesting perspective. Can you elaborate more on the results?",
          ];
          
          const questions = [
            `Describe a challenging project you worked on and how you overcame obstacles.`,
            `How do you stay updated with the latest trends in ${currentSession.industry.name}?`,
            `Tell me about a time when you had to work under tight deadlines.`,
            `How do you handle conflicts within a team?`,
            `What's your approach to problem-solving in your role?`,
          ];
          
          const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
          const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
          
          aiResponse = `${randomFeedback} \n\nNext question: ${randomQuestion}`;
        }

        addMessage(aiResponse, 'assistant');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please check your API key and try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleEndInterview = () => {
    // Stop any ongoing speech when ending the interview
    cancelSpeech();
    endCurrentSession();
    navigate('/results');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRecordingComplete = (url: string) => {
    saveRecording(url);
  };

  const handleLiveRecordingToggle = (isRecording: boolean) => {
    setIsLiveRecording(isRecording);
  };

  if (!currentSession) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:flex-row animate-fade-in">
      <div className="md:w-2/3 flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {currentSession.messages.map((message) => (
            message.role !== 'system' && (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="space-y-1">
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type your response..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-grow"
            />
            <SpeechRecognition 
              onTranscript={handleTranscript}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleEndInterview}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              End Interview
            </Button>
          </div>
        </div>
      </div>
      
      <Separator orientation="vertical" className="hidden md:block" />
      
      <div className="md:w-1/3 p-4 border-t md:border-t-0 md:border-l">
        <h2 className="text-lg font-medium mb-4">Live Interview Recording</h2>
        <VideoRecorder 
          onRecordingComplete={handleRecordingComplete} 
          onRecordingStateChange={handleLiveRecordingToggle}
        />
      </div>
    </div>
  );
};

export default InterviewSession;
