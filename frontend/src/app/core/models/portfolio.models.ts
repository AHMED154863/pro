export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Profile {
  _id?: string;
  name: string;
  professionalTitle: string;
  professionalSummary?: string;
  education?: string;
  careerJourney?: string;
  professionalGoals?: string;
  email?: string;
  linkedInUrl?: string;
  githubUsername?: string;
  profileImagePath?: string;
  cvPath?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  overview?: string;
  problem?: string;
  solution?: string;
  features: string[];
  technologies: string[];
  screenshots: string[];
  category?: string;
  featured: boolean;
  githubUrl?: string;
  liveDemoUrl?: string;
}

export type SkillCategory =
  'Frontend' | 'Backend' | 'Database' | 'Programming Languages' | 'Tools & Technologies';

export interface Skill {
  _id: string;
  name: string;
  category: SkillCategory;
  proficiency?: number;
  featured: boolean;
}

export interface Experience {
  _id: string;
  organization: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  _id: string;
  name: string;
  issuer: string;
  description?: string;
  issuedAt?: string;
  credentialUrl?: string;
}

export interface Setting {
  _id: string;
  key: string;
  value: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SubmittedContactMessage extends ContactMessage {
  _id: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AdminCollection =
  'projects' | 'skills' | 'experiences' | 'education' | 'certifications' | 'messages' | 'settings';

export type AdminRecord =
  Project | Skill | Experience | Education | Certification | SubmittedContactMessage | Setting;

export type AdminRecordValue = string | number | boolean | string[] | null;
export type AdminFieldValue = AdminRecordValue;
export type AdminRecordInput = Record<string, AdminRecordValue>;

export interface AdminRecentActivity {
  id: string;
  type: string;
  title: string;
  occurredAt: string;
}

export interface AdminDashboard {
  totalProjects: number;
  totalSkills: number;
  totalMessages: number;
  unreadMessages: number;
  recentActivities: AdminRecentActivity[];
}

export type RemoteState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string };
