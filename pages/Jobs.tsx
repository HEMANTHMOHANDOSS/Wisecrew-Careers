
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Filter, Plus, ArrowRightLeft } from 'lucide-react';
import { Button, GlassCard, Select, Badge, JobCardSkeleton, Modal, useToast } from '../components/GlassUI';
import { Department, JobType, Job } from '../types';
import { useData } from '../context/DataContext';

export const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { jobs } = useData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Compare Feature
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const activeJobs = useMemo(() => jobs.filter(j => j.isActive), [jobs]);

  const filteredJobs = useMemo(() => {
    return activeJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                            job.description.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter ? job.department === deptFilter : true;
      const matchesType = typeFilter ? job.type === typeFilter : true;
      return matchesSearch && matchesDept && matchesType;
    });
  }, [search, deptFilter, typeFilter, activeJobs]);

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(item => item !== id));
    } else {
      if (compareList.length >= 2) {
        showToast("You can only compare 2 roles at a time.", 'error');
        return;
      }
      setCompareList(prev => [...prev, id]);
      showToast("Added to comparison", 'success');
    }
  };

  const getCompareJobs = () => jobs.filter(j => compareList.includes(j.id));

  const clearFilters = () => {
    setSearch('');
    setDeptFilter('');
    setTypeFilter('');
    showToast('Filters cleared', 'info');
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Open Positions</h1>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Find the perfect role for you. We are looking for passionate individuals to join our team.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
                <input 
                   type="text" 
                   placeholder="Search by role or keyword..." 
                   className="w-full border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                   style={{ 
                     backgroundColor: 'var(--input-bg)',
                     borderColor: 'var(--border-subtle)',
                     color: 'var(--text-primary)'
                   }}
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select 
                options={Object.values(Department)} 
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                placeholder="All Departments"
              />
              <Select 
                options={Object.values(JobType)} 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="All Types"
              />
            </div>
          </GlassCard>
        </div>

        {/* Comparison Bar (Sticky Bottom) */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div 
              initial={{ y: 100 }} 
              animate={{ y: 0 }} 
              exit={{ y: 100 }}
              className="fixed bottom-24 md:bottom-8 left-0 right-0 z-40 px-4"
            >
              <GlassCard className="max-w-xl mx-auto p-4 flex items-center justify-between border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{compareList.length} role(s) selected</div>
                <div className="flex gap-2">
                   <Button size="sm" variant="ghost" onClick={() => setCompareList([])}>Clear</Button>
                   <Button size="sm" onClick={() => setIsCompareModalOpen(true)} disabled={compareList.length < 2}>Compare Now</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
               Array.from({ length: 4 }).map((_, index) => (
                 <motion.div key={`skeleton-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                   <JobCardSkeleton />
                 </motion.div>
               ))
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <GlassCard 
                  key={job.id} 
                  hoverEffect 
                  className="p-6 md:p-8 flex flex-col items-start text-left group cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="w-full flex justify-between items-start mb-4">
                    <Badge variant="blue">{job.department}</Badge>
                    <div className="flex items-center gap-3">
                       <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{job.postedDate}</span>
                       <button 
                         onClick={(e) => toggleCompare(e, job.id)}
                         className={`p-1.5 rounded-lg transition-colors border`}
                         style={{ 
                            borderColor: compareList.includes(job.id) ? 'transparent' : 'var(--border-subtle)',
                            backgroundColor: compareList.includes(job.id) ? '#3b82f6' : 'transparent',
                            color: compareList.includes(job.id) ? 'white' : 'var(--text-muted)'
                         }}
                         title="Add to Compare"
                       >
                         {compareList.includes(job.id) ? <ArrowRightLeft size={14} /> : <Plus size={14} />}
                       </button>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                  <p className="text-sm mb-6 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{job.shortDescription}</p>

                  <div className="flex flex-wrap gap-4 mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1"><MapPin size={14} className="text-blue-500" /> {job.location}</div>
                    <div className="flex items-center gap-1"><Clock size={14} className="text-violet-500" /> {job.type}</div>
                    <div className="flex items-center gap-1"><Briefcase size={14} className="text-emerald-500" /> {job.level}</div>
                  </div>

                  <div className="mt-auto w-full flex gap-4">
                    <Button variant="outline" className="flex-1" size="sm">View Details</Button>
                    <Button className="flex-1" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>Apply Now</Button>
                  </div>
                </GlassCard>
              ))
            ) : (
               <motion.div className="col-span-full py-20 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-surface)' }}><Filter size={32} style={{ color: 'var(--text-muted)' }} /></div>
                 <h3 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>No jobs found</h3>
                 <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
                 <Button variant="ghost" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compare Modal */}
        <Modal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} title="Compare Roles">
           <div className="grid grid-cols-2 divide-x min-w-[600px] overflow-x-auto" style={{ borderColor: 'var(--border-subtle)' }}>
              {getCompareJobs().map(job => (
                 <div key={job.id} className="p-6 space-y-6">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                    <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Location</p><p style={{ color: 'var(--text-secondary)' }}>{job.location}</p></div>
                    <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Type</p><p style={{ color: 'var(--text-secondary)' }}>{job.type}</p></div>
                    <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Level</p><p style={{ color: 'var(--text-secondary)' }}>{job.level}</p></div>
                    <div><p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Department</p><p style={{ color: 'var(--text-secondary)' }}>{job.department}</p></div>
                    <div>
                       <p className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Requirements</p>
                       <ul className="text-sm space-y-1 list-disc pl-4" style={{ color: 'var(--text-secondary)' }}>
                          {job.requirements.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
                       </ul>
                    </div>
                    <Button className="w-full" onClick={() => { setIsCompareModalOpen(false); navigate(`/jobs/${job.id}`); }}>View</Button>
                 </div>
              ))}
           </div>
        </Modal>

      </div>
    </div>
  );
};
