
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Briefcase, CheckCircle, Zap, Star, Heart, Download, Share2, AlertCircle } from 'lucide-react';
import { Button, GlassCard, Badge, Skeleton, useToast } from '../components/GlassUI';
import { ApplicationModal } from '../components/ApplicationForm';
import { RecommendedRoles } from '../components/Enhancements';
import { useData } from '../context/DataContext';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { jobs } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isSaved, setIsSaved] = useState(false);
  
  const job = jobs.find(j => j.id === id && j.isActive);

  useEffect(() => {
    // Check local storage for saved job
    const saved = JSON.parse(localStorage.getItem('wisecrew_saved_jobs') || '[]');
    setIsSaved(saved.includes(id));
  }, [id]);

  const toggleSave = () => {
    const saved = JSON.parse(localStorage.getItem('wisecrew_saved_jobs') || '[]');
    let newSaved;
    if (isSaved) {
      newSaved = saved.filter((i: string) => i !== id);
      showToast("Job removed from saved items.");
    } else {
      newSaved = [...saved, id];
      showToast("Job saved successfully!", 'success');
    }
    localStorage.setItem('wisecrew_saved_jobs', JSON.stringify(newSaved));
    setIsSaved(!isSaved);
  };

  const handleDownload = () => {
    showToast("Downloading Job Description PDF...", 'info');
    setTimeout(() => showToast("Download Complete!", 'success'), 1500);
  };

  const tabs = [
    { id: 'about', label: 'About the Role' },
    { id: 'responsibilities', label: 'Responsibilities' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'perks', label: 'Perks & Benefits' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -160; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isLoading || !job) return;

    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -50% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    tabs.forEach(tab => {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading, job]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="mb-8"><Skeleton className="h-6 w-32" /></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
               <div className="space-y-4">
                 <Skeleton className="h-12 w-3/4 rounded-lg" />
                 <div className="flex gap-3">
                   <Skeleton className="h-8 w-24 rounded-full" />
                   <Skeleton className="h-8 w-24 rounded-full" />
                 </div>
               </div>
               <GlassCard className="p-8">
                  <Skeleton className="h-7 w-40 mb-6" />
                  <div className="space-y-3 mb-8"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-11/12" /></div>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>
               </GlassCard>
             </div>
             <div className="lg:col-span-1">
                <GlassCard className="p-6 h-96"><Skeleton className="h-full w-full" /></GlassCard>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Job Not Found</h2>
        <Button onClick={() => navigate('/jobs')}>Back to Careers</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-6 pl-0 hover:bg-transparent hover:text-blue-400">
           <ArrowLeft size={18} className="mr-2" /> Back to Jobs
        </Button>

        {/* Header Block */}
        <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
            <div className="space-y-4">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {job.title}
                </motion.h1>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 items-center">
                  <Badge variant="blue">{job.department}</Badge>
                  <Badge variant="purple">{job.type}</Badge>
                  <Badge variant="green">{job.level}</Badge>
                  {job.isUnpaid && (
                     <Badge variant="orange" className="border-orange-500/30 text-orange-500 bg-orange-500/10">Unpaid Internship</Badge>
                  )}
                </motion.div>
            </div>
            <div className="flex gap-3">
               <button onClick={toggleSave} className={`p-3 rounded-xl border transition-all ${isSaved ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-transparent text-gray-400 hover:text-pink-500'}`} style={{ borderColor: isSaved ? '#ec4899' : 'var(--border-subtle)' }}>
                  <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
               </button>
               <button className="p-3 rounded-xl border transition-all hover:text-blue-400" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <Share2 size={20} />
               </button>
            </div>
        </div>

        {/* Sticky Sub-navigation */}
        <div className="sticky top-20 z-40 backdrop-blur-xl border-y mb-8 -mx-4 px-4 md:px-0 md:mx-0 md:bg-transparent md:border-y-0 md:backdrop-blur-none" style={{ borderColor: 'var(--border-subtle)' }}>
          <GlassCard className="rounded-none md:rounded-xl border-x-0 md:border-x border-y-0 md:border-y p-2 flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors duration-300`}
                style={{ color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-lg" style={{ backgroundColor: 'var(--border-subtle)' }} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             {job.isUnpaid && (
                <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-start gap-3">
                   <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                   <div>
                      <h4 className="text-orange-500 font-bold text-sm">Important Note</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                         This is an <strong>unpaid internship</strong>. No stipend is provided. You will receive an Internship Completion Certificate and real-time mentoring from industry experts upon successful completion.
                      </p>
                   </div>
                </div>
             )}

             <div id="about" className="scroll-mt-40">
               <GlassCard className="p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Star size={20} className="text-blue-400" /> About the Role</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{job.description}</p>
               </GlassCard>
             </div>

             <div id="responsibilities" className="scroll-mt-40">
               <GlassCard className="p-8">
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Zap size={20} className="text-yellow-400" /> Responsibilities</h4>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start group" style={{ color: 'var(--text-secondary)' }}>
                        <div className="min-w-[6px] h-[6px] rounded-full bg-blue-500 mt-2.5 mr-3 group-hover:scale-125 transition-transform" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
               </GlassCard>
             </div>

             <div id="requirements" className="scroll-mt-40">
               <GlassCard className="p-8">
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><CheckCircle size={20} className="text-green-400" /> Requirements</h4>
                  <ul className="space-y-3">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="flex items-start group" style={{ color: 'var(--text-secondary)' }}>
                        <div className="min-w-[6px] h-[6px] rounded-full bg-violet-500 mt-2.5 mr-3 group-hover:scale-125 transition-transform" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
               </GlassCard>
             </div>
             
             {/* Recommended Roles */}
             <RecommendedRoles currentJob={job} allJobs={jobs.filter(j => j.isActive)} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-40 space-y-6">
                <GlassCard className="p-6 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                   <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Job Overview</h3>
                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-blue-400" size={20} />
                        <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Location</p><p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{job.location}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-violet-400" size={20} />
                        <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Type</p><p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{job.type}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-emerald-400" size={20} />
                        <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Department</p><p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{job.department}</p></div>
                      </div>
                   </div>

                   <Button className="w-full justify-center mb-3" size="lg" onClick={() => navigate('/internship-apply')}>Apply for this Job</Button>
                   <Button variant="outline" className="w-full justify-center" size="sm" onClick={handleDownload}><Download size={16} className="mr-2" /> Download JD</Button>
                </GlassCard>

                <div id="perks" className="scroll-mt-40">
                  <GlassCard className="p-6">
                    <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Perks & Benefits</h4>
                    <ul className="space-y-3">
                      {job.perks.map((perk, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-muted)' }}><span className="text-blue-400 mt-0.5">✦</span> {perk}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
             </div>
          </div>
        </div>
      </div>
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialJobId={job.id} />
    </div>
  );
};
