
export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
  FREELANCE = 'Freelance'
}

export enum JobLevel {
  INTERN = 'Intern',
  JUNIOR = 'Junior',
  MID = 'Mid-Level',
  SENIOR = 'Senior',
  LEAD = 'Lead'
}

export enum Department {
  ENGINEERING = 'Engineering',
  DESIGN = 'Design',
  MARKETING = 'Marketing',
  PRODUCT = 'Product',
  SALES = 'Sales',
  OPERATIONS = 'Operations',
  SUPPORT = 'Customer Support'
}

export interface Job {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: JobType;
  level: JobLevel;
  shortDescription: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  postedDate: string;
  isActive: boolean;
  isUnpaid?: boolean;
  hiringSteps?: string[];
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobId: string;
  jobType: string;
  experienceYears: string;
  skills: string;
  portfolioUrl: string;
  linkedInUrl: string;
  coverLetter: string;
  resume: File | null;
  education?: string;
}

export type ApplicationStatus = 
  | 'Received'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Final Review'
  | 'Offer Sent'
  | 'Rejected'
  | 'On Hold';

export interface TestConfig {
  domain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  questionCount: number;
}

export interface RoundDetails {
  status: 'Pending' | 'Scheduled' | 'Completed';
  scheduledDate?: string;
  link?: string;
  score?: string;
  feedback?: string;
  config?: TestConfig; // For AI generation
}

export interface ApplicationSchedule {
  round1: RoundDetails; // MCQ
  round2: RoundDetails; // Coding
  round3: RoundDetails; // Video Interview
}

export interface ApplicationRecord {
  referenceId: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone?: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  formData?: ApplicationFormData;
  notes?: string;
  schedule?: ApplicationSchedule;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: { linkedin?: string; twitter?: string };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

export interface Assessment {
  id: string;
  title: string;
  type: 'MCQ' | 'Coding' | 'Interview' | 'Guide';
  description: string;
  duration?: string;
  questions?: number;
  icon: any;
}
