
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, ApplicationRecord } from '../types';
import { useToast } from '../components/GlassUI';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
  linkedInUrl: string;
  portfolioUrl: string;
  resume?: any;
}

interface DataContextType {
  jobs: Job[];
  applications: ApplicationRecord[];
  currentUser: UserProfile | null;
  login: (refId: string, email: string) => Promise<boolean>;
  logout: () => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addApplication: (formData: any) => Promise<string | null>;
  updateApplication: (app: ApplicationRecord) => Promise<void>;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType>({
  jobs: [],
  applications: [],
  currentUser: null,
  login: async () => false,
  logout: () => {},
  addJob: () => {},
  updateJob: () => {},
  deleteJob: () => {},
  addApplication: async () => null,
  updateApplication: async () => {},
  refreshData: () => {}
});

export const useData = () => useContext(DataContext);

const API_URL = 'http://localhost:5000/api';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { showToast } = useToast();

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchApplications = async () => {
    // Only fetch if admin (simplification)
    try {
      const res = await fetch(`${API_URL}/admin/applications`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      // console.error("Failed to fetch applications (likely not admin)");
    }
  };

  useEffect(() => {
    fetchJobs();
    const storedUser = localStorage.getItem('wisecrew_user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const login = async (refId: string, email: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/candidate/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId: refId, email })
      });
      
      const data = await res.json();
      
      if (data.success) {
        const user = data.candidate;
        setCurrentUser(user);
        localStorage.setItem('wisecrew_user', JSON.stringify(user));
        
        // Load candidate's apps
        const dashRes = await fetch(`${API_URL}/candidate/dashboard?email=${email}`);
        const dashData = await dashRes.json();
        setApplications(dashData.applications); // Set local app state for dashboard
        
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wisecrew_user');
  };

  // --- Job Management (Admin) ---
  const addJob = (job: Job) => {
    // Implement API call
    setJobs(prev => [...prev, job]); 
  };
  const updateJob = (job: Job) => { /* API Call */ };
  const deleteJob = (id: string) => { /* API Call */ };

  // --- Application ---
  const addApplication = async (formData: any): Promise<string | null> => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if(key === 'resume') data.append('resume', formData[key]);
        else data.append(key, formData[key]);
      });
      // Add job title for display
      const job = jobs.find(j => j.id === formData.jobId);
      data.append('jobTitle', job ? job.title : 'General Application');

      const res = await fetch(`${API_URL}/apply`, {
        method: 'POST',
        body: data
      });
      
      const result = await res.json();
      if (result.success) {
        return result.referenceId;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateApplication = async (updatedApp: ApplicationRecord) => {
    try {
        await fetch(`${API_URL}/admin/application/${updatedApp.referenceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: updatedApp.status,
                schedule: updatedApp.schedule
            })
        });
        
        // Update local state
        setApplications(prev => prev.map(a => a.referenceId === updatedApp.referenceId ? updatedApp : a));
    } catch (err) {
        console.error(err);
        showToast("Failed to update application", 'error');
    }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, applications, currentUser, login, logout, 
      addJob, updateJob, deleteJob, addApplication, updateApplication,
      refreshData: fetchApplications
    }}>
      {children}
    </DataContext.Provider>
  );
};
