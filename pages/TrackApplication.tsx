
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button, GlassCard, Input } from '../components/GlassUI';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { useData } from '../context/DataContext';

const STATUS_STEPS: ApplicationStatus[] = [
  'Received',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Final Review',
  'Offer Sent'
];

export const TrackApplication: React.FC = () => {
  const { applications } = useData();
  const [refId, setRefId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplicationRecord | null>(null);
  const [error, setError] = useState('');

  const handleTrack = () => {
    if (!refId || !email) {
      setError('Please enter both Reference ID and Email.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    // Simulate Network Delay
    setTimeout(() => {
      const found = applications.find(a => a.referenceId === refId && a.email.toLowerCase() === email.toLowerCase());
      
      if (found) {
        setResult(found);
      } else {
        setError("We couldn't find your application. Please re-check your Reference ID and Email.");
      }
      setLoading(false);
    }, 1500);
  };

  const getCurrentStepIndex = (status: string) => {
    if (status === 'Rejected') return 1; // Stop at review
    if (status === 'On Hold') return 1; // Treat as Under Review visually
    return STATUS_STEPS.indexOf(status as ApplicationStatus);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Track Application</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your details to see the current status of your application.</p>
        </div>

        <GlassCard className="p-8 max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input 
              label="Reference ID" 
              placeholder="WCR-2025-XXXX" 
              value={refId} 
              onChange={e => setRefId(e.target.value)} 
            />
            <Input 
              label="Email Address" 
              placeholder="john@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <Button onClick={handleTrack} disabled={loading} className="w-full">
            {loading ? 'Searching...' : 'Track Status'}
          </Button>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg flex items-center gap-2 text-sm"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
        </GlassCard>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Status Header */}
              <GlassCard className="p-6 border-blue-500/30">
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                     <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Application for</p>
                     <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{result.jobTitle}</h2>
                     <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Applicant: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{result.applicantName}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 font-mono text-sm mb-2 border border-blue-500/30">
                      {result.referenceId}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last Updated: {result.lastUpdated}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Timeline */}
              <GlassCard className="p-8 overflow-x-auto">
                 <h3 className="font-bold text-lg mb-8" style={{ color: 'var(--text-primary)' }}>Application Timeline</h3>
                 <div className="flex items-center min-w-[600px] relative">
                    {/* Line */}
                    <div className="absolute left-0 right-0 top-6 h-1 z-0" style={{ backgroundColor: 'var(--border-subtle)' }} />
                    
                    {STATUS_STEPS.map((step, i) => {
                       const currentIdx = getCurrentStepIndex(result.status);
                       const isCompleted = i <= currentIdx;
                       const isCurrent = i === currentIdx;
                       
                       return (
                         <div key={i} className="flex-1 relative z-10 flex flex-col items-center text-center">
                            <div 
                              className={`
                                w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500
                                ${isCompleted ? 'bg-slate-900 border-green-500 text-green-500' : 'bg-slate-900 text-gray-700'}
                                ${isCurrent ? 'shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-110' : ''}
                              `}
                              style={!isCompleted ? { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' } : {}}
                            >
                              {isCompleted ? <CheckCircle size={20} /> : <Clock size={20} />}
                            </div>
                            <p className={`mt-4 text-sm font-medium ${isCurrent ? '' : ''}`} style={{ color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</p>
                         </div>
                       );
                    })}
                 </div>
                 
                 {result.status === 'Rejected' && (
                   <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                     <p className="text-red-400">Application Status: <strong>Not Selected</strong></p>
                     <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Thank you for your interest. We encourage you to apply for other roles in the future.</p>
                   </div>
                 )}
                 {result.status === 'On Hold' && (
                   <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                     <p className="text-yellow-400">Application Status: <strong>On Hold</strong></p>
                     <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your application is currently on hold. We will update you as soon as the position re-opens or we move forward.</p>
                   </div>
                 )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};