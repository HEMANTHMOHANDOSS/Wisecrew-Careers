import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, Plus, Search, 
  Edit, Trash2, Eye, LogOut, CheckCircle, AlertTriangle, ChevronDown, Calendar, Send, Clock, Settings
} from 'lucide-react';
import { Button, GlassCard, Input, Select, Badge, Modal, useToast, TextArea, TableSkeleton } from '../components/GlassUI';
import { useData } from '../context/DataContext';
import { Job, JobType, JobLevel, Department, ApplicationRecord, ApplicationStatus } from '../types';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@wisecrew.in' && password === 'admin123') {
      setIsAuthenticated(true);
      showToast('Welcome back, Admin!', 'success');
    } else {
      setLoginError('Invalid credentials. Try admin@wisecrew.in / admin123');
      showToast('Authentication failed', 'error');
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (loginError) setLoginError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Admin Portal</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to manage jobs and applications</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={handleInputChange(setEmail)} 
              placeholder="admin@wisecrew.in"
              error={loginError}
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={handleInputChange(setPassword)} 
              placeholder="admin123"
              error={loginError}
            />
            <Button className="w-full" type="submit">Sign In</Button>
          </form>
          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
            Demo Mode: Use provided credentials
          </p>
        </GlassCard>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
};

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { jobs, applications } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'settings'>('overview');

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-500' },
    { label: 'Active Roles', value: jobs.filter(j => j.isActive).length, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Internships', value: jobs.filter(j => j.type === JobType.INTERNSHIP).length, icon: Users, color: 'text-violet-500' },
    { label: 'Total Applications', value: applications.length, icon: Users, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <GlassCard className="w-full md:w-64 flex flex-col p-4 h-fit md:h-[calc(100vh-8rem)] md:sticky md:top-24">
        <div className="mb-8 px-2">
          <h2 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'jobs', label: 'Jobs Management', icon: Briefcase },
            { id: 'applications', label: 'Applications', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </GlassCard>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Overview</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {stats.map((stat, i) => (
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
          </div>
        )}

        {activeTab === 'jobs' && <JobsManager />}
        {activeTab === 'applications' && <ApplicationsManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
};

const SettingsManager: React.FC = () => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'Wisecrew Careers',
        supportEmail: 'careers@wisecrew.in',
        primaryColor: '#3b82f6',
        enableChatbot: true,
        enableDarkModeToggle: true,
        maintenanceMode: false
    });

    useEffect(() => {
        const stored = localStorage.getItem('wisecrew_settings');
        if (stored) setSettings(JSON.parse(stored));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('wisecrew_settings', JSON.stringify(settings));
            setIsLoading(false);
            showToast('Settings saved successfully', 'success');
        }, 800);
    };

    const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
        <div className="flex items-center justify-between p-4 rounded-xl border transition-colors" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
            <button 
                onClick={onChange}
                className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Site Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings className="text-blue-500" size={20} />
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>General Configuration</h3>
                    </div>
                    <Input label="Site Name" name="siteName" value={settings.siteName} onChange={handleChange} />
                    <Input label="Support Email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} />
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Primary Accent Color</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                name="primaryColor" 
                                value={settings.primaryColor} 
                                onChange={handleChange} 
                                className="h-10 w-20 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{settings.primaryColor}</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-orange-500" size={20} />
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Feature Flags</h3>
                    </div>
                    <Toggle 
                        label="Enable AI Chatbot" 
                        checked={settings.enableChatbot} 
                        onChange={() => handleToggle('enableChatbot')} 
                    />
                    <Toggle 
                        label="Show Dark Mode Toggle" 
                        checked={settings.enableDarkModeToggle} 
                        onChange={() => handleToggle('enableDarkModeToggle')} 
                    />
                    <Toggle 
                        label="Maintenance Mode" 
                        checked={settings.maintenanceMode} 
                        onChange={() => handleToggle('maintenanceMode')} 
                    />
                    {settings.maintenanceMode && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                            Warning: Enabling Maintenance Mode will prevent candidates from accessing the public portal.
                        </div>
                    )}
                </GlassCard>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="min-w-[150px]">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};

const JobsManager: React.FC = () => {
  const { jobs, addJob, updateJob, deleteJob } = useData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial fetch
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteJob(deleteId);
      showToast('Job deleted successfully', 'success');
      setDeleteId(null);
    }
  };

  const toggleStatus = (job: Job) => {
    updateJob({ ...job, isActive: !job.isActive });
    showToast(`Job marked as ${!job.isActive ? 'Active' : 'Inactive'}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Jobs Management</h2>
        <Button onClick={() => { setEditingJob(null); setIsModalOpen(true); }}>
          <Plus size={18} className="mr-2" /> Add New Job
        </Button>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input 
               type="text" 
               placeholder="Search jobs..." 
               className="w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
               style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Job Title</th>
                  <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Department</th>
                  <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Type</th>
                  <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Posted</th>
                  <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Hiring Process</th>
                  <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Status</th>
                  <th className="py-4 px-4 font-semibold text-sm text-right" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id} className="border-b group hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="py-4 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{job.title}</td>
                    <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>{job.department}</td>
                    <td className="py-4 px-4"><Badge variant="blue">{job.type}</Badge></td>
                    <td className="py-4 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{job.postedDate}</td>
                    <td className="py-4 px-4 text-xs max-w-[200px] truncate" style={{ color: 'var(--text-muted)' }}>{job.hiringSteps?.join(', ')}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleStatus(job)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Toggle Status">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(job)} className="p-2 hover:bg-white/10 rounded-lg text-yellow-400" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <JobFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingJob} 
        onSubmit={(data) => {
          if (editingJob) {
            updateJob({ ...editingJob, ...data });
            showToast('Job updated successfully', 'success');
          } else {
            addJob({ ...data, id: Date.now().toString(), postedDate: new Date().toISOString().split('T')[0], isActive: true } as Job);
            showToast('Job created successfully', 'success');
          }
          setIsModalOpen(false);
        }}
      />
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion">
        <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Delete Job?</h3>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this job? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete Job</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

const JobFormModal: React.FC<{ isOpen: boolean; onClose: () => void; initialData: Job | null; onSubmit: (data: any) => void }> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Job>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        department: Department.ENGINEERING,
        type: JobType.FULL_TIME,
        level: JobLevel.JUNIOR,
        location: '',
        shortDescription: '',
        description: '',
        responsibilities: [],
        requirements: [],
        perks: [],
        hiringSteps: []
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleArrayChange = (name: string, value: string) => {
     setFormData({ ...formData, [name]: value.split('\n').filter(Boolean) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Job' : 'Add New Job'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Input label="Job Title" name="title" value={formData.title || ''} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
           <Select label="Department" name="department" options={Object.values(Department)} value={formData.department} onChange={handleChange} />
           <Select label="Type" name="type" options={Object.values(JobType)} value={formData.type} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <Select label="Level" name="level" options={Object.values(JobLevel)} value={formData.level} onChange={handleChange} />
           <Input label="Location" name="location" value={formData.location || ''} onChange={handleChange} required />
        </div>
        <TextArea label="Short Description" name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} rows={2} required />
        <TextArea label="Full Description" name="description" value={formData.description || ''} onChange={handleChange} rows={4} required />
        
        <TextArea label="Responsibilities (One per line)" name="responsibilities" value={formData.responsibilities?.join('\n') || ''} onChange={(e) => handleArrayChange('responsibilities', e.target.value)} rows={3} />
        
        <TextArea label="Hiring Process Steps (One per line)" name="hiringSteps" value={formData.hiringSteps?.join('\n') || ''} onChange={(e) => handleArrayChange('hiringSteps', e.target.value)} rows={3} />
        
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{initialData ? 'Update Job' : 'Create Job'}</Button>
        </div>
      </form>
    </Modal>
  );
};

const ApplicationsManager: React.FC = () => {
  const { applications, updateApplication } = useData();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [activeScheduleRound, setActiveScheduleRound] = useState<'round1' | 'round2' | 'round3' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Note Saving State
  const [note, setNote] = useState('');
  const [isNoteSaving, setIsNoteSaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const statusOptions: ApplicationStatus[] = [
    'Received', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Offer Sent', 'Rejected', 'On Hold'
  ];

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(search.toLowerCase()) || 
                          app.referenceId.toLowerCase().includes(search.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (selectedApp) {
        const updated = { ...selectedApp, status: newStatus, lastUpdated: new Date().toLocaleDateString() };
        updateApplication(updated);
        setSelectedApp(updated);
        showToast('Application status updated successfully', 'success');
    }
  };

  const handleSaveNote = () => {
    if (selectedApp) {
        setIsNoteSaving(true);
        // Simulate network delay
        setTimeout(() => {
            const updated = { ...selectedApp, notes: note };
            updateApplication(updated);
            setSelectedApp(null); // Close modal
            setIsNoteSaving(false);
            showToast('Application updated successfully', 'success');
        }, 1000);
    }
  };

  useEffect(() => {
      if(selectedApp) {
          setNote(selectedApp.notes || '');
      }
  }, [selectedApp]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Applications</h2>

      <GlassCard className="p-6">
         <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
                <input 
                   type="text" 
                   placeholder="Search applications..." 
                   className="w-full border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                   style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Select 
                placeholder="Filter by Status" 
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48"
            />
         </div>

         {isLoading ? (
            <TableSkeleton rows={8} />
         ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Ref ID</th>
                    <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Candidate</th>
                    <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Job Title</th>
                    <th className="py-4 px-4 font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Status</th>
                    <th className="py-4 px-4 font-semibold text-sm text-right" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map(app => (
                    <tr key={app.referenceId} className="border-b group hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                      <td className="py-4 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{app.referenceId}</td>
                      <td className="py-4 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{app.applicantName}</td>
                      <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>{app.jobTitle}</td>
                      <td className="py-4 px-4"><Badge variant={app.status === 'Rejected' ? 'red' : app.status === 'Offer Sent' ? 'green' : 'blue'}>{app.status}</Badge></td>
                      <td className="py-4 px-4 text-right">
                        <Button size="sm" variant="secondary" onClick={() => setSelectedApp(app)}>
                           View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         )}
      </GlassCard>

      <Modal isOpen={!!selectedApp && !activeScheduleRound} onClose={() => setSelectedApp(null)} title="Application Details">
         {selectedApp && (
            <div className="p-6 space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedApp.applicantName}</h2>
                      <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{selectedApp.referenceId}</p>
                      <p className="text-blue-400 font-medium mt-1">{selectedApp.jobTitle}</p>
                  </div>
                  <div className="relative">
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                        className="appearance-none pl-4 pr-10 py-2 rounded-full text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-500/10 text-gray-500 border-gray-500/20"
                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                      >
                         {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
               </div>

               {/* Schedule Actions */}
               {selectedApp.status !== 'Rejected' && (
                   <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                       <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Calendar size={18}/> Assign Tests & Schedule Interviews</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           <Button 
                              size="sm" 
                              variant={selectedApp.schedule?.round1?.status === 'Scheduled' ? 'outline' : 'secondary'} 
                              onClick={() => setActiveScheduleRound('round1')}
                              className="relative"
                           >
                              Round 1: MCQ
                              {selectedApp.schedule?.round1?.status === 'Scheduled' && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 -mt-1 -mr-1"></span>}
                           </Button>
                           <Button 
                              size="sm" 
                              variant={selectedApp.schedule?.round2?.status === 'Scheduled' ? 'outline' : 'secondary'} 
                              onClick={() => setActiveScheduleRound('round2')}
                              className="relative"
                           >
                              Round 2: Coding
                              {selectedApp.schedule?.round2?.status === 'Scheduled' && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 -mt-1 -mr-1"></span>}
                           </Button>
                           <Button 
                              size="sm" 
                              variant={selectedApp.schedule?.round3?.status === 'Scheduled' ? 'outline' : 'secondary'} 
                              onClick={() => setActiveScheduleRound('round3')}
                              className="relative"
                           >
                              Round 3: Video
                              {selectedApp.schedule?.round3?.status === 'Scheduled' && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 -mt-1 -mr-1"></span>}
                           </Button>
                       </div>
                   </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                     <h4 className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Contact Info</h4>
                     <p style={{ color: 'var(--text-primary)' }}>{selectedApp.email}</p>
                     <p style={{ color: 'var(--text-secondary)' }}>{selectedApp.phone}</p>
                     <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{selectedApp.formData?.location}</p>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                     <h4 className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Links</h4>
                     <div className="flex flex-col gap-2 mt-2">
                        {selectedApp.formData?.linkedInUrl ? <a href={selectedApp.formData.linkedInUrl} target="_blank" className="text-blue-400 text-sm hover:underline flex items-center gap-1">LinkedIn ↗</a> : <span className="text-gray-500 text-xs">No LinkedIn</span>}
                        {selectedApp.formData?.portfolioUrl ? <a href={selectedApp.formData.portfolioUrl} target="_blank" className="text-blue-400 text-sm hover:underline flex items-center gap-1">Portfolio ↗</a> : <span className="text-gray-500 text-xs">No Portfolio</span>}
                     </div>
                  </div>
               </div>
               
               <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                   <h4 className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Experience & Skills</h4>
                   <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Experience: {selectedApp.formData?.experienceYears} Years</p>
                   <div className="flex flex-wrap gap-2">
                       {selectedApp.formData?.skills.split(',').map((skill, i) => (
                           <Badge key={i} variant="default">{skill.trim()}</Badge>
                       ))}
                   </div>
               </div>
               
               {selectedApp.formData?.coverLetter && (
                    <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                        <h4 className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Cover Letter / Why Join?</h4>
                        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>"{selectedApp.formData.coverLetter}"</p>
                    </div>
               )}

               <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Internal HR Notes</h4>
                  <TextArea 
                    placeholder="Add notes about this candidate..." 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px] mb-3"
                  />
                  <div className="flex justify-end">
                      <Button onClick={handleSaveNote} disabled={isNoteSaving}>
                          {isNoteSaving ? 'Saving...' : 'Save Note'}
                      </Button>
                  </div>
               </div>
            </div>
         )}
      </Modal>

      {/* Schedule Modal */}
      {activeScheduleRound && selectedApp && (
          <ScheduleRoundModal 
            app={selectedApp}
            initialRound={activeScheduleRound} 
            onClose={() => setActiveScheduleRound(null)} 
            onSave={(updatedApp) => {
                updateApplication(updatedApp);
                setSelectedApp(updatedApp);
                setActiveScheduleRound(null);
            }}
          />
      )}
    </div>
  );
};

interface ScheduleRoundModalProps {
  app: ApplicationRecord;
  initialRound: 'round1' | 'round2' | 'round3';
  onClose: () => void;
  onSave: (app: ApplicationRecord) => void;
}

const ScheduleRoundModal: React.FC<ScheduleRoundModalProps> = ({ app, initialRound, onClose, onSave }) => {
    const { showToast } = useToast();
    const [roundType, setRoundType] = useState(initialRound);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('10:00');
    
    // AI Config
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [domain, setDomain] = useState('Frontend');
    const [topics, setTopics] = useState('React, JavaScript');
    const [qCount, setQCount] = useState('15');

    useEffect(() => {
        setRoundType(initialRound);
    }, [initialRound]);

    const handleSchedule = () => {
        if (!date || !time) return showToast('Please select date and time', 'error');

        const scheduledDate = `${date} ${time}`;
        
        // Use existing schedule or initialize empty one
        const currentSchedule = app.schedule || { 
            round1: { status: 'Pending' }, 
            round2: { status: 'Pending' }, 
            round3: { status: 'Pending' } 
        };

        const newSchedule = { ...currentSchedule };

        // Define test link based on round type
        let link = '';
        if (roundType === 'round1') link = `/test/mcq/${app.referenceId}`;
        else if (roundType === 'round2') link = `/test/coding/${app.referenceId}`;
        else link = `/test/interview/${app.referenceId}`;

        // @ts-ignore
        newSchedule[roundType] = {
            status: 'Scheduled',
            scheduledDate,
            link: link,
            config: {
                difficulty,
                domain,
                topic: topics,
                questionCount: parseInt(qCount)
            }
        };

        const updatedApp: ApplicationRecord = {
            ...app,
            status: 'Interview Scheduled' as ApplicationStatus, // Auto-update status
            lastUpdated: new Date().toLocaleDateString(),
            schedule: newSchedule as any
        };

        onSave(updatedApp);
        showToast(`Test Assigned! Email sent to ${app.email}.`, 'success');
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Assign Test / Schedule Interview">
            <div className="p-6 space-y-4">
                <Select 
                    label="Assessment Type" 
                    options={['Round 1: MCQ Assessment', 'Round 2: Coding Assessment', 'Round 3: Virtual Interview']} 
                    value={roundType === 'round1' ? 'Round 1: MCQ Assessment' : roundType === 'round2' ? 'Round 2: Coding Assessment' : 'Round 3: Virtual Interview'}
                    onChange={(e) => {
                        const val = e.target.value;
                        if(val.includes('Round 1')) setRoundType('round1');
                        else if(val.includes('Round 2')) setRoundType('round2');
                        else setRoundType('round3');
                    }}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                         <Clock size={16} className="text-blue-400" />
                         <h4 className="font-bold text-sm text-blue-400">
                             {roundType === 'round3' ? 'Interview Panel Config' : 'AI Test Configuration'}
                         </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <Select label="Difficulty" options={['Easy', 'Medium', 'Hard']} value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} />
                        <Select label="Domain" options={['Frontend', 'Backend', 'Fullstack', 'Design', 'General']} value={domain} onChange={(e) => setDomain(e.target.value)} />
                    </div>
                    <Input label="Topics (for AI Generation)" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="e.g. React, Algorithms, System Design" />
                    
                    {roundType !== 'round3' && (
                        <Input label="Number of Questions" type="number" value={qCount} onChange={(e) => setQCount(e.target.value)} className="mt-3" />
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSchedule}><Send size={16} className="mr-2"/> Confirm & Send Link</Button>
                </div>
            </div>
        </Modal>
    );
};