import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Rocket, HelpCircle } from 'lucide-react';
import { Button, GlassCard, Badge } from '../components/GlassUI';
import { useNavigate } from 'react-router-dom';

export const Internships: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Rocket, title: "Real Projects", desc: "Work on live client projects, not just coffee runs." },
    { icon: Users, title: "Mentorship", desc: "1-on-1 guidance from senior developers and designers." },
    { icon: BookOpen, title: "Learning", desc: "Weekly workshops and access to premium courses." },
  ];

  const faqs = [
    { q: "Is this a paid internship?", a: "Yes, all our internships come with a competitive stipend." },
    { q: "Can I convert to full-time?", a: "Absolutely! Over 60% of our interns join us full-time." },
    { q: "Do you offer remote internships?", a: "Yes, we support remote internships for most roles." },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge variant="green">Early Talent Program</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6" style={{ color: 'var(--text-primary)' }}>Start Your Career <br /><span className="text-blue-400">The Right Way</span></h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Wisecrew's internship program is designed to bridge the gap between academic theory and industry reality.
          </p>
          <Button onClick={() => navigate('/jobs')}>View Open Internships</Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {benefits.map((b, i) => (
            <GlassCard key={i} className="p-6 text-center" hoverEffect>
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <b.icon size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{b.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{b.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HelpCircle className="text-violet-400" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <GlassCard key={i} className="p-6">
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};