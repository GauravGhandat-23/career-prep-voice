
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useInterview } from '@/context/InterviewContext';
import { Industry, Role } from '../types';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const { industries, rolesByIndustry, startNewSession, apiKeySettings } = useInterview();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandKey, setCommandKey] = useState(0); // Key to force re-render when needed
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]); // Initialize with empty array
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]); // Initialize with empty array

  // Update availableRoles when industry changes
  useEffect(() => {
    if (selectedIndustry && rolesByIndustry[selectedIndustry.id]) {
      setAvailableRoles(rolesByIndustry[selectedIndustry.id]);
    } else {
      setAvailableRoles([]);
    }
  }, [selectedIndustry, rolesByIndustry]);

  // Update filteredRoles when availableRoles or searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredRoles(
        availableRoles.filter(role => 
          role.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRoles(availableRoles);
    }
  }, [availableRoles, searchQuery]);

  const handleIndustryChange = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId) || null;
    setSelectedIndustry(industry);
    setSelectedRole(null);
    setSearchQuery('');
    // Force re-render of Command component when industry changes
    setCommandKey(prev => prev + 1);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setSearchQuery('');
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
          <div className="relative">
            {/* Using key to force re-render when industry changes */}
            <Command key={commandKey} className="rounded-lg border shadow-md">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput 
                  placeholder={selectedIndustry ? "Search for a role..." : "Select an industry first"}
                  disabled={!selectedIndustry}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none"
                />
              </div>
              <CommandList>
                <CommandEmpty>No roles found.</CommandEmpty>
                <CommandGroup className="overflow-hidden overflow-y-auto max-h-52">
                  {filteredRoles.map((role) => (
                    <CommandItem 
                      key={role.id} 
                      onSelect={() => handleRoleSelect(role)}
                      className={`cursor-pointer ${selectedRole?.id === role.id ? 'bg-accent text-accent-foreground' : ''}`}
                    >
                      {role.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
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
