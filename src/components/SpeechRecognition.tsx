
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface SpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ onTranscript, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const setupSpeechRecognition = useCallback(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
          
        onTranscript(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Speech recognition error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } catch (error) {
      console.error('Speech recognition setup failed:', error);
      toast({
        title: "Feature not available",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
    }
  }, [onTranscript]);

  useEffect(() => {
    setupSpeechRecognition();
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [setupSpeechRecognition, recognition]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      setupSpeechRecognition();
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [recognition, isListening, setupSpeechRecognition]);

  return (
    <Button 
      variant={isListening ? "default" : "outline"} 
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={isListening ? "bg-primary text-white" : ""}
    >
      {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
    </Button>
  );
};

export default SpeechRecognition;
