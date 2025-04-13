
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Home, 
  BarChart
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useInterview } from '@/context/InterviewContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { apiKeySettings, setApiKeySettings } = useInterview();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKeySettings.groqApiKey);

  const saveSettings = () => {
    setApiKeySettings(prev => ({
      ...prev,
      groqApiKey: tempApiKey
    }));
    setIsSettingsOpen(false);
    toast({
      title: "Settings saved",
      description: "Your API key has been updated.",
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="bg-primary rounded-full p-2 mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="white"/>
                <path d="M18 12C18 12.7956 17.8311 13.5587 17.5 14.2612C16.434 16.3412 14.3622 17.7754 12 17.7754C9.63783 17.7754 7.56596 16.3412 6.5 14.2612C6.16889 13.5587 6 12.7956 6 12C6 11.2044 6.16889 10.4413 6.5 9.73878C7.56596 7.65877 9.63783 6.22461 12 6.22461C14.3622 6.22461 16.434 7.65877 17.5 9.73878C17.8311 10.4413 18 11.2044 18 12Z" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">InterviewPal</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-accent text-primary' : 'text-gray-500 hover:text-primary'}`}>
              <span className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Home
              </span>
            </Link>
            <Link to="/results" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/results' ? 'bg-accent text-primary' : 'text-gray-500 hover:text-primary'}`}>
              <span className="flex items-center">
                <BarChart className="w-4 h-4 mr-1" />
                Results
              </span>
            </Link>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="text-gray-500 hover:text-primary hover:bg-accent"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Settings</DialogTitle>
            <DialogDescription>
              Configure your API keys for the interview assistant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groq-api-key">GROQ API Key</Label>
              <Input 
                id="groq-api-key" 
                placeholder="Enter your GROQ API key" 
                value={tempApiKey} 
                onChange={(e) => setTempApiKey(e.target.value)} 
                type="password"
              />
              <p className="text-sm text-muted-foreground">
                You can get a GROQ API key from <a href="https://console.groq.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">console.groq.com</a>
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
