
import React from 'react';
import { motion } from 'framer-motion';
import { AssessmentCard, GlassCard, Badge, Button, useToast } from '../components/GlassUI';
import { ASSESSMENTS } from '../constants';
import { Brain, Award, Target, BookOpen } from 'lucide-react';

export const Assessments: React.FC = () => {
  const { showToast } = useToast();

  const handleStart = (title: string) => {
    showToast(`Starting ${title}... This is a demo.`, 'info');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="purple" className="mb-4">Skill Validation</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Assessments & Skill Tests</h1>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Prove your expertise and get fast-tracked. Our assessments are designed to evaluate real-world skills.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Assessments Taken', value: '1,200+', icon: Brain, color: 'text-blue-500' },
            { label: 'Certified Candidates', value: '450+', icon: Award, color: 'text-yellow-500' },
            { label: 'Hiring Success Rate', value: '85%', icon: Target, color: 'text-green-500' }
          ].map((stat, i) => (
             <GlassCard key={i} className="p-6 flex items-center gap-4">
               <div className={`p-3 rounded-full bg-white/5 ${stat.color}`}>
                 <stat.icon size={24} />
               </div>
               <div>
                 <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                 <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
               </div>
             </GlassCard>
          ))}
        </div>

        {/* Assessment Grid */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
           <BookOpen className="text-blue-400" /> Available Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSESSMENTS.map((assessment, i) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <AssessmentCard assessment={assessment} onClick={() => handleStart(assessment.title)} />
            </motion.div>
          ))}
        </div>
        
        {/* Info Box */}
        <div className="mt-16">
           <GlassCard className="p-8 text-center bg-gradient-to-r from-blue-900/20 to-violet-900/20">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Why take an assessment?</h3>
              <p className="max-w-2xl mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
                 Candidates who complete a skill test are 3x more likely to be shortlisted for an interview. It's the best way to showcase your abilities beyond a resume.
              </p>
              <Button onClick={() => handleStart('General Assessment')}>Take a General Quiz</Button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};
