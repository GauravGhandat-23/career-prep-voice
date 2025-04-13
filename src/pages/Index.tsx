
import React from 'react';
import Header from '@/components/Header';
import InterviewSetup from '@/components/InterviewSetup';
import { Button } from '@/components/ui/button';
import { Mic, Video, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ace Your Next Interview with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Practice interviews with our AI interviewer. Get real-time feedback and improve your skills.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm hover-scale">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Speech Recognition</h3>
                <p className="text-gray-500 text-sm">
                  Answer questions by speaking naturally, just like in a real interview.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover-scale">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Video Recording</h3>
                <p className="text-gray-500 text-sm">
                  Record yourself to review your body language and presentation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover-scale">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Detailed Feedback</h3>
                <p className="text-gray-500 text-sm">
                  Get personalized feedback to improve your interview performance.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Start Your Mock Interview</h2>
            <InterviewSetup />
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 InterviewPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
