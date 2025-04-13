
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useInterview } from '@/context/InterviewContext';

const FeedbackDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentSession } = useInterview();
  const [feedback, setFeedback] = useState({
    overallScore: 75,
    strengths: [
      'Good communication skills',
      'Structured answers using the STAR method',
      'Demonstrated relevant experience',
    ],
    improvements: [
      'Could provide more specific examples',
      'Avoid technical jargon without explanation',
      'Consider preparing more concise responses',
    ],
    detailedFeedback: `Overall, you did well in this mock interview. Your answers were generally structured and relevant to the questions asked. 

Your strongest point was how you related your experience to the role requirements. The specific example about [project/situation] was particularly effective.

To improve, focus on providing more quantifiable results when discussing your achievements. Additionally, try to keep your answers more concise while still being comprehensive.`,
  });
  
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!currentSession) {
      navigate('/');
      return;
    }
    
    // Animate the progress bar
    const timer = setTimeout(() => setProgress(feedback.overallScore), 500);
    return () => clearTimeout(timer);
  }, [currentSession, navigate, feedback.overallScore]);

  const startNewInterview = () => {
    navigate('/');
  };

  if (!currentSession) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-accent/50 rounded-t-lg">
          <CardTitle className="text-2xl">Interview Feedback</CardTitle>
          <CardDescription>
            {`${currentSession.role.name} position in ${currentSession.industry.name}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Overall Performance</span>
              <span className="font-medium">{feedback.overallScore}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-lg text-green-600">Strengths</h3>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-2 p-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-lg text-amber-600">Areas to Improve</h3>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mr-2 p-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3V6M6 9H6.01M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium text-lg mb-2">Detailed Feedback</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
              {feedback.detailedFeedback}
            </div>
          </div>
          
          {currentSession.recordingUrl && (
            <div>
              <h3 className="font-medium text-lg mb-2">Your Recording</h3>
              <video 
                src={currentSession.recordingUrl} 
                controls 
                className="w-full rounded-lg"
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center p-6">
          <Button onClick={startNewInterview}>Start New Interview</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedbackDashboard;
