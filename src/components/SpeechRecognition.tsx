
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
      // Fix: Check for both standard and webkit prefixed API
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event: any) => {
        console.log('Speech recognition result received', event);
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
          
        console.log('Transcript:', transcript);
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
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      return recognitionInstance;
    } catch (error) {
      console.error('Speech recognition setup failed:', error);
      toast({
        title: "Feature not available",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return null;
    }
  }, [onTranscript]);

  useEffect(() => {
    // Initialize speech recognition on component mount
    const recognitionInstance = setupSpeechRecognition();
    
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [setupSpeechRecognition]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      const newRecognition = setupSpeechRecognition();
      if (newRecognition) {
        try {
          newRecognition.start();
        } catch (error) {
          console.error('Error starting recognition:', error);
        }
      }
      return;
    }
    
    if (isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
        // If an error occurs when stopping, reset the recognition instance
        setRecognition(null);
        setIsListening(false);
      }
    } else {
      try {
        // Some browsers require recreating the recognition instance
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive"
        });
        
        // Try to recreate the recognition instance
        const newRecognition = setupSpeechRecognition();
        if (newRecognition) {
          try {
            newRecognition.start();
          } catch (innerError) {
            console.error('Error starting new recognition instance:', innerError);
          }
        }
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
      aria-label={isListening ? "Stop listening" : "Start listening"}
      title={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
    </Button>
  );
};

export default SpeechRecognition;
