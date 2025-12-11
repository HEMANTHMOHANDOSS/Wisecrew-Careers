
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, ChevronRight, ChevronLeft, Briefcase, User, FileText, Mail } from 'lucide-react';
import { Button, Input, Select, GlassCard, useToast, TextArea } from './GlassUI';
import { ApplicationFormData, ApplicationRecord } from '../types';
import { useData } from '../context/DataContext';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJobId?: string;
}

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Position', icon: Briefcase },
  { id: 3, title: 'Experience', icon: FileText },
  { id: 4, title: 'Resume', icon: Upload },
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, initialJobId }) => {
  const { jobs, addApplication, currentUser } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobId: initialJobId || '',
    jobType: 'Job',
    experienceYears: '',
    skills: '',
    portfolioUrl: '',
    linkedInUrl: '',
    coverLetter: '',
    resume: null
  });

  // Pre-fill if user logged in
  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location,
        skills: currentUser.skills,
        linkedInUrl: currentUser.linkedInUrl,
        portfolioUrl: currentUser.portfolioUrl,
        resume: currentUser.resume || null
      }));
    }
  }, [currentUser, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
      if (errors.resume) {
          setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.resume;
              return newErrors;
          });
      }
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
        if (!formData.fullName) newErrors.fullName = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone is required";
        if (!formData.location) newErrors.location = "Location is required";
    }
    if (step === 2) {
        if (!formData.jobType) newErrors.jobType = "Job Type is required";
        if (!formData.jobId) newErrors.jobId = "Please select a role";
    }
    if (step === 3) {
        if (!formData.experienceYears) newErrors.experienceYears = "Experience is required";
        if (!formData.skills) newErrors.skills = "Skills are required";
    }
    if (step === 4) {
         if (!formData.resume && !currentUser?.resume) newErrors.resume = "Resume upload is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      showToast("Please fix the errors before proceeding.", 'error');
    }
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(4)) {
        showToast("Please upload your resume", 'error');
        return;
    }
    
    setIsSubmitting(true);

    // Generate Reference ID
    const refId = `WCR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const jobTitle = jobs.find(j => j.id === formData.jobId)?.title || 'General Application';

    // Simulate API call & Save
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
        formData: formData,
        schedule: { round1: { status: 'Pending' }, round2: { status: 'Pending' }, round3: { status: 'Pending' } }
    };

    addApplication(newApp);

    setReferenceId(refId);
    setIsSubmitting(false);
    setIsSuccess(true);
    showToast("Application submitted successfully!", 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-xl font-bold">
            {isSuccess ? 'Application Sent!' : 'Join the Crew'}
          </h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={24} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex-1 overflow-y-auto p-8 text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 mx-auto"
            >
              <CheckCircle size={40} />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Thank You, {formData.fullName}!</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Your application for <span className="text-blue-500 font-medium">{jobs.find(j => j.id === formData.jobId)?.title}</span> has been received.
            </p>

            <div className="border rounded-xl p-6 mb-8 max-w-sm mx-auto" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
               <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Your Reference ID</p>
               <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 select-all cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { navigator.clipboard.writeText(referenceId); showToast('Copied to clipboard', 'info')}}>
                  {referenceId}
               </div>
               <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Use this to track your status.</p>
            </div>

            {/* Simulated Email */}
            <div className="rounded-lg p-4 text-left border mb-8 opacity-80 max-w-md mx-auto" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
               <div className="flex items-center gap-2 border-b pb-2 mb-2" style={{ borderColor: 'var(--border-subtle)' }}>
                 <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                 <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Email Preview</span>
               </div>
               <p className="text-sm font-bold mb-1">Subject: Wisecrew – Your Application Reference ID</p>
               <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                 Hi {formData.fullName}, thanks for applying. Your Ref ID is <strong>{referenceId}</strong>. 
                 You can track your application status on our career portal anytime.
               </p>
            </div>

            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 pb-2">
              <div className="flex justify-between mb-2">
                {steps.map((step, idx) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                            <motion.div 
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative
                                    ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[var(--bg-elevated)]' : ''}
                                `}
                                style={{
                                    backgroundColor: isCompleted || isActive ? '#2563eb' : 'var(--bg-surface)',
                                    borderColor: isCompleted || isActive ? '#2563eb' : 'var(--border-subtle)',
                                    borderWidth: '1px',
                                    color: isCompleted || isActive ? 'white' : 'var(--text-muted)'
                                }}
                                initial={false}
                                animate={{ scale: isActive ? 1.1 : 1 }}
                            >
                                {isCompleted ? <CheckCircle size={14} /> : step.id}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                                )}
                            </motion.div>
                            <span 
                                className="text-[10px] mt-2 uppercase tracking-wider font-medium transition-colors" 
                                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                            >
                                {step.title}
                            </span>
                        </div>
                    );
                })}
              </div>
              
              {/* Progress Bar Container */}
              <div className="relative w-full h-1 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        label="Full Name" 
                        placeholder="John Doe" 
                        autoFocus
                        error={errors.fullName} 
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            label="Email Address" 
                            type="email" 
                            placeholder="john@example.com"
                            error={errors.email}
                        />
                        <Input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            label="Phone Number" 
                            placeholder="+91 98765 43210"
                            error={errors.phone}
                        />
                      </div>
                      <Input 
                        name="location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        label="Current Location" 
                        placeholder="Chennai, India"
                        error={errors.location}
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                       <Select 
                          label="Applying For"
                          options={["Job Opening", "Internship Program", "Freelance Gig"]}
                          name="jobType"
                          value={formData.jobType}
                          onChange={handleInputChange}
                          error={errors.jobType}
                       />
                       <div className="relative">
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Select Role</label>
                          <select 
                            name="jobId" 
                            value={formData.jobId} 
                            onChange={handleInputChange}
                            className={`w-full rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.jobId ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                            style={{
                                backgroundColor: 'var(--input-bg)',
                                borderColor: errors.jobId ? '#ef4444' : 'var(--input-border)',
                                borderWidth: '1px',
                                color: 'var(--text-primary)'
                            }}
                          >
                             <option value="" style={{ backgroundColor: 'var(--bg-elevated)' }}>Select a role...</option>
                             {jobs.filter(j => j.isActive).map(job => (
                               <option key={job.id} value={job.id} style={{ backgroundColor: 'var(--bg-elevated)' }}>{job.title}</option>
                             ))}
                             <option value="general" style={{ backgroundColor: 'var(--bg-elevated)' }}>General Application</option>
                          </select>
                          {errors.jobId && <p className="text-xs text-red-500 mt-1">{errors.jobId}</p>}
                       </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            name="experienceYears" 
                            value={formData.experienceYears} 
                            onChange={handleInputChange} 
                            label="Years of Experience" 
                            placeholder="e.g. 3 years"
                            error={errors.experienceYears}
                        />
                        <Input 
                            name="portfolioUrl" 
                            value={formData.portfolioUrl} 
                            onChange={handleInputChange} 
                            label="Portfolio URL" 
                            placeholder="https://" 
                        />
                      </div>
                      <Input 
                        name="linkedInUrl" 
                        value={formData.linkedInUrl} 
                        onChange={handleInputChange} 
                        label="LinkedIn / GitHub URL" 
                        placeholder="https://linkedin.com/in/..." 
                      />
                      <div>
                        <TextArea 
                          label="Key Skills"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="min-h-[80px]"
                          placeholder="React, Node.js, Figma..."
                        />
                        {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                       <div>
                        <TextArea 
                          label="Why Wisecrew?"
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          className="min-h-[100px]"
                          placeholder="Tell us a bit about yourself and why you'd be a great fit."
                        />
                      </div>

                      <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${errors.resume ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        style={{ 
                            borderColor: errors.resume ? '#ef4444' : 'var(--border-subtle)', 
                            backgroundColor: errors.resume ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-surface)' 
                        }} 
                        onClick={() => fileInputRef.current?.click()}
                      >
                         <input 
                           type="file" 
                           ref={fileInputRef} 
                           onChange={handleFileChange} 
                           className="hidden" 
                           accept=".pdf,.doc,.docx" 
                         />
                         <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${errors.resume ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-400'}`}>
                           <Upload size={24} />
                         </div>
                         <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                           {formData.resume ? formData.resume.name : 'Upload your Resume'}
                         </p>
                         <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>PDF, DOCX up to 5MB</p>
                         {errors.resume && <p className="text-xs text-red-500 mt-2 font-medium">{errors.resume}</p>}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 border-t flex justify-between" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}>
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 1}
                className={currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}
              >
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next Step <ChevronRight size={18} className="ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
