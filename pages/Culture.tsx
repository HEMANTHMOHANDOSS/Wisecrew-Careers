import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassUI';
import { VALUES } from '../constants';

export const Culture: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Life at Wisecrew</h1>
           <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>More than just a workplace. A community of creators.</p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
           {VALUES.map((val, i) => (
             <GlassCard key={i} className="p-8 flex items-start gap-4">
                <div className="mt-1">
                   <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                      {val.title[0]}
                   </div>
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{val.title}</h3>
                   <p style={{ color: 'var(--text-secondary)' }}>{val.description}</p>
                </div>
             </GlassCard>
           ))}
        </div>

        {/* Gallery Placeholder */}
        <div className="mb-20">
           <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Our Moments</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-96">
              <div className="col-span-2 row-span-2 bg-slate-800 rounded-2xl overflow-hidden relative group">
                 <img src="https://picsum.photos/800/800?random=1" alt="Team Work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">Annual Hackathon 2023</p>
                 </div>
              </div>
              <div className="col-span-1 bg-slate-800 rounded-2xl overflow-hidden relative group">
                 <img src="https://picsum.photos/400/400?random=2" alt="Team Lunch" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              </div>
              <div className="col-span-1 bg-slate-800 rounded-2xl overflow-hidden relative group">
                 <img src="https://picsum.photos/400/400?random=3" alt="Office Dog" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              </div>
              <div className="col-span-2 bg-slate-800 rounded-2xl overflow-hidden relative group">
                 <img src="https://picsum.photos/800/400?random=4" alt="Celebration" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              </div>
           </div>
        </div>

        {/* Testimonials */}
        <div>
           <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>What the Team Says</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                 <GlassCard key={i} className="p-6">
                    <p className="italic mb-6" style={{ color: 'var(--text-secondary)' }}>
                       "Working at Wisecrew has been the highlight of my career. The autonomy and trust given to engineers is unmatched."
                    </p>
                    <div className="flex items-center gap-3">
                       <img src={`https://picsum.photos/50/50?random=${10+i}`} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20" />
                       <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Alex Johnson</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Senior Engineer</p>
                       </div>
                    </div>
                 </GlassCard>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};