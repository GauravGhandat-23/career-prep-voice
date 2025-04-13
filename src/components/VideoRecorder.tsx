
import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Circle, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface VideoRecorderProps {
  onRecordingComplete: (url: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onRecordingComplete,
  onRecordingStateChange 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordingData, setRecordingData] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleVideo = async () => {
    if (isVideoEnabled) {
      // Turn off video
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsVideoEnabled(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsVideoEnabled(true);
      
      toast({
        title: "Camera enabled",
        description: "Your camera and microphone are now active."
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow access to your camera and microphone.",
        variant: "destructive"
      });
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingData(url);
        onRecordingComplete(url);
      };
      
      // Set to record data every 1 second (to enable live recording)
      mediaRecorder.start(1000);
      setIsRecording(true);
      setElapsedTime(0);
      
      // Notify parent component of recording state change
      if (onRecordingStateChange) {
        onRecordingStateChange(true);
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Your interview is now being recorded live."
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    
    // Notify parent component of recording state change
    if (onRecordingStateChange) {
      onRecordingStateChange(false);
    }
    
    toast({
      title: "Recording stopped",
      description: "Your interview recording has been saved."
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    return () => {
      // Clean up on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
        {isVideoEnabled ? (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <VideoOff className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {isRecording && (
          <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-md">
            <Circle className="h-3 w-3 text-red-500 animate-pulse mr-2" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        )}

        {isRecording && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md">
            <span className="text-xs">Live Recording</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        {isVideoEnabled && (
          isRecording ? (
            <Button
              variant="destructive"
              onClick={stopRecording}
              className="flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>Stop Recording</span>
            </Button>
          ) : (
            <Button
              onClick={startRecording}
              className="flex items-center space-x-2"
            >
              <Circle className="h-4 w-4 text-red-500" />
              <span>Start Recording</span>
            </Button>
          )
        )}
      </div>
      
      {recordingData && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Preview Recording</h3>
          <video 
            src={recordingData} 
            controls 
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
