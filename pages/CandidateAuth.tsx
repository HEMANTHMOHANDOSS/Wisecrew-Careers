
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Input, Button, useToast } from '../components/GlassUI';
import { useData } from '../context/DataContext';
import { UserCircle, ArrowRight } from 'lucide-react';
import { BackgroundShapes } from '../components/Enhancements';

export const CandidateAuth: React.FC = () => {
  const [refId, setRefId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(refId, email);
      if (success) {
        showToast('Login Successful!', 'success');
        navigate('/dashboard');
      } else {
        showToast('Invalid Reference ID or Email. Try again.', 'error');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundShapes />
      <div className="max-w-md w-full relative z-10">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
              <UserCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Candidate Portal</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Enter your Application Reference ID and Email to access your profile, tests, and schedule.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Reference ID" 
              placeholder="e.g. WCR-2025-1234" 
              value={refId} 
              onChange={(e) => setRefId(e.target.value)}
              required
            />
            <Input 
              label="Registered Email" 
              type="email"
              placeholder="john@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Access Portal'} <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an ID? Apply for a job first to create your profile.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
