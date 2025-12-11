
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, FileText, CheckCircle, Clock, Play, Video, Code } from 'lucide-react';
import { GlassCard, Button, Badge } from '../components/GlassUI';
import { useData } from '../context/DataContext';
import { ApplicationRecord } from '../types';

export const CandidateDashboard: React.FC = () => {
  const { currentUser, applications } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const myApplications = applications.filter(app => app.email.toLowerCase() === currentUser.email.toLowerCase());

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                {currentUser.name[0]}
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome, {currentUser.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{currentUser.email} • {currentUser.location}</p>
                <div className="flex gap-2 justify-center md:justify-start mt-4">
                    <Button size="sm" variant="outline" onClick={() => navigate('/jobs')}>Apply for new Role</Button>
                    <Button size="sm" variant="secondary">Edit Profile</Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content: Applications & Tests */}
            <div className="lg:col-span-2 space-y-8">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Briefcase className="text-blue-400" size={20} /> My Applications
                </h2>

                {myApplications.length === 0 ? (
                    <GlassCard className="p-8 text-center">
                        <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
                        <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
                    </GlassCard>
                ) : (
                    myApplications.map(app => (
                        <ApplicationCard key={app.referenceId} app={app} navigate={navigate} />
                    ))
                )}
                
                {/* Mock Tests Section */}
                <h2 className="text-xl font-bold flex items-center gap-2 mt-12" style={{ color: 'var(--text-primary)' }}>
                    <FileText className="text-violet-400" size={20} /> Practice Zone
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><FileText size={20}/></div>
                            <Badge variant="blue">Practice</Badge>
                        </div>
                        <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Mock MCQ Test</h3>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Sharpen your fundamentals with 15 random questions.</p>
                        <Button className="w-full" size="sm" onClick={() => navigate('/test/mock/practice')}>Start Mock Test</Button>
                    </GlassCard>
                    
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400"><Code size={20}/></div>
                            <Badge variant="purple">Practice</Badge>
                        </div>
                        <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Mock Coding</h3>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Try a sample algorithmic problem in our editor.</p>
                        <Button className="w-full" size="sm" onClick={() => navigate('/test/coding/mock')}>Start Coding</Button>
                    </GlassCard>
                </div>
            </div>

            {/* Sidebar */}
            <div>
                 <GlassCard className="p-6 sticky top-24">
                     <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Profile Summary</h3>
                     <div className="space-y-4 text-sm">
                         <div>
                             <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Skills</p>
                             <p style={{ color: 'var(--text-primary)' }}>{currentUser.skills || 'Not added'}</p>
                         </div>
                         <div>
                             <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Resume</p>
                             <p style={{ color: 'var(--text-primary)' }}>{currentUser.resume ? 'Uploaded' : 'Missing'}</p>
                         </div>
                         <div>
                             <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Links</p>
                             <div className="flex gap-2 mt-1">
                                {currentUser.linkedInUrl && <a href={currentUser.linkedInUrl} target="_blank" className="text-blue-400 hover:underline">LinkedIn</a>}
                                {currentUser.portfolioUrl && <a href={currentUser.portfolioUrl} target="_blank" className="text-blue-400 hover:underline">Portfolio</a>}
                             </div>
                         </div>
                     </div>
                 </GlassCard>
            </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationCard: React.FC<{ app: ApplicationRecord; navigate: any }> = ({ app, navigate }) => {
    // Helper to determine if a test button should be shown
    const getAction = () => {
        if (!app.schedule) return null;
        
        if (app.schedule.round1?.status === 'Scheduled') {
            return (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-blue-400">Round 1: MCQ Assessment</p>
                        <p className="text-xs text-gray-400">Scheduled: {app.schedule.round1.scheduledDate}</p>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/test/mcq/${app.referenceId}`)}>Take Test <Play size={14} className="ml-1" /></Button>
                </div>
            );
        }
        if (app.schedule.round2?.status === 'Scheduled') {
            return (
                 <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-violet-400">Round 2: Coding Assessment</p>
                         <p className="text-xs text-gray-400">Scheduled: {app.schedule.round2.scheduledDate}</p>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/test/coding/${app.referenceId}`)}>Start Coding <Code size={14} className="ml-1" /></Button>
                </div>
            );
        }
        if (app.schedule.round3?.status === 'Scheduled') {
            return (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-green-400">Round 3: Virtual Interview</p>
                        <p className="text-xs text-gray-400">Scheduled: {app.schedule.round3.scheduledDate}</p>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/test/interview/${app.referenceId}`)}>Join Room <Video size={14} className="ml-1" /></Button>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{app.jobTitle}</h3>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Ref: {app.referenceId}</p>
                </div>
                <Badge variant={app.status === 'Rejected' ? 'red' : 'green'}>{app.status}</Badge>
            </div>
            
            <div className="flex gap-4 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-1"><Clock size={14}/> Applied: {app.appliedDate}</div>
                {app.status === 'Rejected' && <div className="text-red-400">Application Closed</div>}
            </div>

            {/* Test Actions */}
            {getAction()}

        </GlassCard>
    );
};
