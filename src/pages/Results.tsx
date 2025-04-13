
import React from 'react';
import Header from '@/components/Header';
import FeedbackDashboard from '@/components/FeedbackDashboard';

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow py-8">
        <FeedbackDashboard />
      </div>
    </div>
  );
};

export default Results;
