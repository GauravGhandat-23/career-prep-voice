
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useInterview } from '@/context/InterviewContext';
import { Industry, Role } from '../types';

const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const { industries, rolesByIndustry, startNewSession, apiKeySettings } = useInterview();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleIndustryChange = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId) || null;
    setSelectedIndustry(industry);
    setSelectedRole(null);
  };

  const handleRoleChange = (roleId: string) => {
    if (!selectedIndustry) return;
    
    const role = rolesByIndustry[selectedIndustry.id].find(r => r.id === roleId) || null;
    setSelectedRole(role);
  };

  const startInterview = () => {
    if (!selectedIndustry || !selectedRole) {
      toast({
        title: "Selection required",
        description: "Please select both an industry and a role.",
        variant: "destructive"
      });
      return;
    }
    
    if (!apiKeySettings.groqApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your GROQ API key in settings before starting an interview.",
        variant: "destructive"
      });
      return;
    }
    
    startNewSession(selectedIndustry, selectedRole);
    navigate('/interview');
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Set Up Your Interview</CardTitle>
        <CardDescription>
          Choose your industry and role for a personalized mock interview experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Industry</label>
          <Select onValueChange={handleIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select 
            onValueChange={handleRoleChange}
            disabled={!selectedIndustry}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedIndustry ? "Select a role" : "Select an industry first"} />
            </SelectTrigger>
            <SelectContent>
              {selectedIndustry && rolesByIndustry[selectedIndustry.id].map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={startInterview} 
          disabled={!selectedIndustry || !selectedRole}
          className="w-full"
        >
          Start Interview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewSetup;
