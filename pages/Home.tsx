import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Cpu, Layers, Zap } from 'lucide-react';
import { Button, GlassCard, Badge } from '../components/GlassUI';
import { VALUES, BLOG_POSTS } from '../constants';
import { HiringTimeline, BackgroundShapes, CareerQuizModal } from '../components/Enhancements';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const stats = [
    { label: "Projects Delivered", value: "150+" },
    { label: "Happy Clients", value: "80+" },
    { label: "Team Members", value: "45" },
  ];

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <BackgroundShapes />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border backdrop-blur-md mb-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
              <span className="text-blue-400 font-medium text-sm">🚀 Hiring Top Talent</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">Digital Career</span>
            </h1>
            <p className="text-xl mb-8 leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Join Wisecrew Solutions, where code meets creativity. We are looking for dreamers and doers to craft next-gen digital experiences.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate('/jobs')}>
                View Open Roles <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setIsQuizOpen(true)}>
                Take Career Quiz
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-[500px]"
          >
             <GlassCard className="absolute top-10 left-10 w-64 p-6 z-20 animate-float" style={{ animationDelay: '0s' }}>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                   <Code size={20} />
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Modern Tech Stack</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>React, Node, AI, & Cloud Native.</p>
             </GlassCard>

             <GlassCard className="absolute bottom-20 right-10 w-72 p-6 z-30 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                   <Layers size={20} />
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Design Driven</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pixel perfect implementation with glassmorphic aesthetics.</p>
             </GlassCard>

             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full border border-white/5" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y backdrop-blur-sm" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-8">
           {stats.map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="text-center"
             >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-gray-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Hiring Timeline */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Hiring Process</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Transparent, fast, and respectful of your time.</p>
           </div>
           <HiringTimeline />
        </div>
      </section>

      {/* Culture Teaser */}
      <section className="py-24 px-4 relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Why Wisecrew?</h2>
               <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>We don't just build software; we build careers. Here is what drives us forward every single day.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val, idx) => (
                <GlassCard key={idx} hoverEffect className="p-8 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-blue-500 mb-6">
                     <Cpu size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{val.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{val.description}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/culture">
                <Button variant="secondary">
                   See Life at Wisecrew <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
         </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 px-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
         <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>Latest Insights</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {BLOG_POSTS.map(post => (
               <GlassCard key={post.id} hoverEffect className="group cursor-pointer">
                 <div className="h-48 w-full overflow-hidden">
                   <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
                 <div className="p-6">
                   <Badge variant="purple" className="mb-3">{post.category}</Badge>
                   <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                   <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                   <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.readTime}</p>
                 </div>
               </GlassCard>
             ))}
           </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <GlassCard className="max-w-5xl mx-auto p-12 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 z-0" />
           <div className="relative z-10">
             <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Ready to make an impact?</h2>
             <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
               We are always looking for exceptional talent to join our growing team. Find your role today.
             </p>
             <Button size="lg" onClick={() => navigate('/jobs')}>
               Browse Openings
             </Button>
           </div>
        </GlassCard>
      </section>

      <CareerQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};