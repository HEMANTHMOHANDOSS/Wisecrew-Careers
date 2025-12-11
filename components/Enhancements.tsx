
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Check, User, MapPin, Briefcase, HelpCircle, X } from 'lucide-react';
import { Button, GlassCard, Badge, useToast, Modal } from './GlassUI';
import { QUIZ_QUESTIONS, TEAM_MEMBERS } from '../constants';
import { Job } from '../types';

// --- Background Shapes ---
export const BackgroundShapes: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] animate-pulse-glow" />
    <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] animate-float" />
    <div className="absolute top-[40%] right-[30%] w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] animate-spin-slow" />
  </div>
);

// --- Chatbot ---
export const CareerAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; from: 'bot' | 'user' }[]>([
    { text: "Hi! I'm your Career Assistant. How can I help you today?", from: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, from: 'user' }]);
    setInput('');
    
    // Simulate thinking
    setTimeout(() => {
       const responses = [
         "That's a great question! Our team is currently offline, but if you leave your email in the application form, we'll get back to you.",
         "You can filter jobs by department and location on the Open Positions page.",
         "We offer flexible remote and hybrid work options for most engineering roles.",
         "Check out our Culture page to see what it's like to work at Wisecrew!",
         "Please verify your Reference ID on the Track Application page for status updates."
       ];
       const randomResponse = responses[Math.floor(Math.random() * responses.length)];
       setMessages(prev => [...prev, { text: randomResponse, from: 'bot' }]);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-24 md:bottom-8 right-4 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all group"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse-glow" />
              <MessageCircle size={28} className="text-blue-500 relative z-10" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-8 right-4 w-[calc(100vw-2rem)] md:w-96 h-[500px] max-h-[80vh] z-50 backdrop-blur-xl border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-violet-600/10" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
                        <MessageCircle size={20} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full" style={{ borderColor: 'var(--bg-elevated)' }}></div>
                </div>
                <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Career Assistant</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
              {messages.map((msg, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.from === 'user' 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                            : 'border rounded-tl-none'
                    }`}
                    style={msg.from !== 'user' ? {
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    } : {}}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Career Quiz ---
export const CareerQuizModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({ eng: 0, des: 0, mkt: 0 });
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [value]: prev[value] + 1 }));
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      // Determine result
      const max = Object.entries(answers).reduce((a, b) => a[1] > b[1] ? a : b);
      const roles = { eng: 'Engineering', des: 'Design', mkt: 'Marketing' };
      setResult(roles[max[0] as keyof typeof roles] || 'Operations');
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers({ eng: 0, des: 0, mkt: 0 });
    setResult(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Career Pathfinder Quiz">
      <div className="p-6">
        {!result ? (
          <div>
             <div className="mb-6">
               <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
               <h3 className="text-xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{QUIZ_QUESTIONS[currentQ].question}</h3>
             </div>
             <div className="space-y-3">
               {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                 <button
                   key={i}
                   onClick={() => handleAnswer(opt.value)}
                   className="w-full text-left p-4 rounded-xl border hover:bg-blue-500/20 hover:border-blue-500/40 transition-all"
                   style={{
                     backgroundColor: 'var(--bg-surface)',
                     borderColor: 'var(--border-subtle)',
                     color: 'var(--text-secondary)'
                   }}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 text-3xl">
              🎯
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>We Recommend: {result}</h3>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Based on your answers, you'd be a great fit for our {result} team.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => { onClose(); reset(); }} variant="secondary">Close</Button>
              <Button onClick={() => { window.location.href = '#/jobs'; onClose(); }}>View Open Roles</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// --- Hiring Timeline ---
export const HiringTimeline: React.FC = () => {
  const steps = [
    { title: 'Application', desc: 'Submit your resume' },
    { title: 'Screening', desc: 'HR Review' },
    { title: 'Skill Test', desc: 'Technical assessment' },
    { title: 'Interview', desc: 'Team fit & deep dive' },
    { title: 'Offer', desc: 'Welcome aboard!' },
  ];

  return (
    <div className="relative py-12">
      <div className="absolute top-1/2 left-0 right-0 h-1 hidden md:block" style={{ backgroundColor: 'var(--border-subtle)', transform: 'translateY(-50%)' }} />
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold mb-4 shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
                 style={{ 
                     backgroundColor: 'var(--bg-elevated)', 
                     borderColor: '#2563eb', // Blue-600 border for visibility
                     color: 'var(--text-primary)' 
                 }}>
              {i + 1}
            </div>
            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{step.title}</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Team Flip Cards ---
export const TeamSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {TEAM_MEMBERS.map((member) => (
        <div key={member.id} className="group h-80 w-full perspective-1000 cursor-pointer">
          <div className="relative w-full h-full text-center transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
               <img src={member.image} alt={member.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-blue-400">{member.role}</p>
               </div>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 p-6 flex flex-col items-center justify-center border" style={{ borderColor: 'var(--border-subtle)' }}>
               <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
               <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{member.bio}"</p>
               <Button size="sm" variant="outline">View Profile</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Recommended Roles ---
export const RecommendedRoles: React.FC<{ currentJob: Job; allJobs: Job[] }> = ({ currentJob, allJobs }) => {
  const recommended = allJobs
    .filter(j => j.id !== currentJob.id && j.department === currentJob.department)
    .slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Briefcase className="text-blue-400"/> Similar Roles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {recommended.map(job => (
           <GlassCard key={job.id} hoverEffect className="p-4" onClick={() => window.location.href = `#/jobs/${job.id}`}>
             <Badge variant="blue" className="mb-2 inline-block">{job.department}</Badge>
             <h4 className="font-bold text-lg mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>{job.title}</h4>
             <div className="flex items-center text-xs gap-2 mb-3" style={{ color: 'var(--text-muted)' }}>
               <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
             </div>
             <div className="text-blue-400 text-sm font-medium flex items-center gap-1">View <span className="text-lg">→</span></div>
           </GlassCard>
         ))}
      </div>
    </div>
  );
};
