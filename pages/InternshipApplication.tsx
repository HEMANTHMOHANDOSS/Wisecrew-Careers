
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { Button, Input, Select, GlassCard, useToast, TextArea } from '../components/GlassUI';
import { ApplicationFormData, ApplicationRecord, JobType } from '../types';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export const InternshipApplication: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, addApplication } = useData();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter only internship roles
  const internshipRoles = jobs.filter(j => j.type === JobType.INTERNSHIP && j.isActive);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobId: '',
    jobType: 'Internship',
    experienceYears: '0', // Default for interns
    skills: '',
    education: '',
    portfolioUrl: '',
    linkedInUrl: '',
    coverLetter: '', // "Why do you want this internship?"
    resume: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.jobId || !formData.resume) {
      showToast("Please fill in all required fields and upload resume.", 'error');
      return;
    }

    setIsSubmitting(true);

    // Generate Reference ID
    const refId = `WCR-INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const jobTitle = jobs.find(j => j.id === formData.jobId)?.title || 'Internship Program';

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newApp: ApplicationRecord = {
      referenceId: refId,
      jobId: formData.jobId,
      jobTitle: jobTitle,
      applicantName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      status: 'Received',
      appliedDate: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString(),
      formData: formData
    };

    addApplication(newApp);
    setReferenceId(refId);
    setIsSuccess(true);
    setIsSubmitting(false);
    showToast("Application submitted successfully!", 'success');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <GlassCard className="max-w-2xl w-full p-10 text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-24 h-24 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 mx-auto"
          >
            <CheckCircle size={48} />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Application Received!</h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Thanks for applying to the <strong>Wisecrew Internship Program</strong>. We have sent a confirmation email to {formData.email}.
          </p>
          
          <div className="border rounded-xl p-6 mb-8 max-w-sm mx-auto bg-white/5 border-white/10">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Reference ID</p>
            <div className="text-3xl font-mono font-bold text-blue-400 select-all" onClick={() => { navigator.clipboard.writeText(referenceId); showToast('Copied!', 'info')}}>
               {referenceId}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Keep this safe for tracking.</p>
          </div>

          <div className="flex justify-center gap-4">
             <Button onClick={() => navigate('/')} variant="outline">Back Home</Button>
             <Button onClick={() => navigate('/track')}>Track Status</Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/internships')} className="mb-6 pl-0">
           <ArrowLeft size={18} className="mr-2" /> Back to Internships
        </Button>
        
        <div className="text-center mb-10">
           <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Internship Application</h1>
           <p style={{ color: 'var(--text-secondary)' }}>Join our Early Talent Program and kickstart your career.</p>
        </div>

        <GlassCard className="p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                 <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required />
                 <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Select Internship Role</label>
                    <select 
                      name="jobId" 
                      value={formData.jobId} 
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)'
                      }}
                    >
                       <option value="" style={{ backgroundColor: 'var(--bg-elevated)' }}>Select a role...</option>
                       {internshipRoles.map(job => (
                         <option key={job.id} value={job.id} style={{ backgroundColor: 'var(--bg-elevated)' }}>{job.title}</option>
                       ))}
                       <option value="general-intern" style={{ backgroundColor: 'var(--bg-elevated)' }}>General Internship Application</option>
                    </select>
                 </div>
              </div>

              <Input label="Current Education (Degree/Year)" name="education" value={formData.education} onChange={handleInputChange} placeholder="e.g. B.Tech CS, 3rd Year" required />

              <TextArea label="Key Skills" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="Java, Python, Design..." />

              <TextArea 
                label="Why do you want this internship?" 
                name="coverLetter" 
                value={formData.coverLetter} 
                onChange={handleInputChange} 
                rows={4}
                required
                placeholder="Tell us about your motivation and what you hope to learn."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Portfolio / GitHub URL" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://" />
                 <Input label="LinkedIn URL" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleInputChange} placeholder="https://" />
              </div>

              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border-subtle)' }} onClick={() => fileInputRef.current?.click()}>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   className="hidden" 
                   accept=".pdf,.doc,.docx" 
                 />
                 <Upload size={32} className="mx-auto text-blue-400 mb-3" />
                 <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                   {formData.resume ? formData.resume.name : 'Upload Resume (Required)'}
                 </p>
                 <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PDF up to 5MB</p>
              </div>

              <div className="pt-4">
                 <Button type="submit" className="w-full py-4 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Application...' : 'Submit Internship Application'}
                 </Button>
              </div>
           </form>
        </GlassCard>
      </div>
    </div>
  );
};
