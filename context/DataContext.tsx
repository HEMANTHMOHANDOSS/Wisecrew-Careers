
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, ApplicationRecord, ApplicationFormData } from '../types';
import { JOBS } from '../constants';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
  linkedInUrl: string;
  portfolioUrl: string;
  resume?: File | null;
}

interface DataContextType {
  jobs: Job[];
  applications: ApplicationRecord[];
  currentUser: UserProfile | null;
  login: (refId: string, email: string) => boolean;
  logout: () => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addApplication: (app: ApplicationRecord) => void;
  updateApplication: (app: ApplicationRecord) => void;
}

const DataContext = createContext<DataContextType>({
  jobs: [],
  applications: [],
  currentUser: null,
  login: () => false,
  logout: () => {},
  addJob: () => {},
  updateJob: () => {},
  deleteJob: () => {},
  addApplication: () => {},
  updateApplication: () => {}
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from local storage or initialize
    const storedJobs = localStorage.getItem('wisecrew_jobs');
    const storedApps = localStorage.getItem('wisecrew_applications');
    const storedUser = localStorage.getItem('wisecrew_user');

    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      setJobs(JOBS);
      localStorage.setItem('wisecrew_jobs', JSON.stringify(JOBS));
    }

    if (storedApps) {
      setApplications(JSON.parse(storedApps));
    } else {
      setApplications([]);
    }

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wisecrew_jobs', JSON.stringify(jobs));
    }
  }, [jobs, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wisecrew_applications', JSON.stringify(applications));
    }
  }, [applications, isInitialized]);

  const login = (refId: string, email: string): boolean => {
    // Find application matching credentials
    const app = applications.find(a => a.referenceId === refId && a.email.toLowerCase() === email.toLowerCase());
    if (app && app.formData) {
      const profile: UserProfile = {
        name: app.formData.fullName,
        email: app.formData.email,
        phone: app.formData.phone,
        location: app.formData.location,
        skills: app.formData.skills,
        linkedInUrl: app.formData.linkedInUrl,
        portfolioUrl: app.formData.portfolioUrl,
        resume: app.formData.resume
      };
      setCurrentUser(profile);
      localStorage.setItem('wisecrew_user', JSON.stringify(profile));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wisecrew_user');
  };

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
  };

  const updateJob = (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const addApplication = (app: ApplicationRecord) => {
    const newApp = {
      ...app,
      schedule: {
        round1: { status: 'Pending' as const },
        round2: { status: 'Pending' as const },
        round3: { status: 'Pending' as const }
      }
    };
    setApplications(prev => [newApp, ...prev]);
    
    // Auto-update profile on new application if logged in
    if (currentUser) {
       // logic to keep profile fresh could go here
    }
  };

  const updateApplication = (updatedApp: ApplicationRecord) => {
    setApplications(prev => prev.map(a => a.referenceId === updatedApp.referenceId ? updatedApp : a));
  };

  return (
    <DataContext.Provider value={{ jobs, applications, currentUser, login, logout, addJob, updateJob, deleteJob, addApplication, updateApplication }}>
      {children}
    </DataContext.Provider>
  );
};
