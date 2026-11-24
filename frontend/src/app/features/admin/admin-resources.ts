import { AdminCollection } from '../../core/models/portfolio.models';

export type AdminFieldType =
  'text' | 'url' | 'textarea' | 'number' | 'checkbox' | 'date' | 'select' | 'list';

export interface AdminField {
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  options?: readonly string[];
}

export interface AdminResourceConfig {
  collection: AdminCollection;
  title: string;
  description: string;
  fields: readonly AdminField[];
  summaryFields: readonly AdminField[];
  canCreate: boolean;
}

const skillCategories = [
  'Frontend',
  'Backend',
  'Database',
  'Programming Languages',
  'Tools & Technologies',
] as const;

export const adminResources: Record<AdminCollection, AdminResourceConfig> = {
  projects: {
    collection: 'projects',
    title: 'Projects',
    description: 'Manage the project details shown on the public portfolio.',
    canCreate: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'text', required: true },
      { key: 'summary', label: 'Summary', type: 'textarea', required: true },
      { key: 'overview', label: 'Overview', type: 'textarea' },
      { key: 'problem', label: 'Problem', type: 'textarea' },
      { key: 'solution', label: 'Solution', type: 'textarea' },
      { key: 'features', label: 'Key features (one per line)', type: 'list' },
      { key: 'technologies', label: 'Technologies (one per line)', type: 'list' },
      { key: 'screenshots', label: 'Screenshot paths (one per line)', type: 'list' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { key: 'liveDemoUrl', label: 'Live demo URL', type: 'url' },
      { key: 'featured', label: 'Featured project', type: 'checkbox' },
    ],
    summaryFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'featured', label: 'Featured', type: 'checkbox' },
    ],
  },
  skills: {
    collection: 'skills',
    title: 'Skills',
    description: 'Manage the skills and proficiency levels displayed publicly.',
    canCreate: true,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: skillCategories,
      },
      { key: 'proficiency', label: 'Proficiency (0–100)', type: 'number' },
      { key: 'featured', label: 'Featured skill', type: 'checkbox' },
    ],
    summaryFields: [
      { key: 'name', label: 'Skill', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'proficiency', label: 'Proficiency', type: 'number' },
      { key: 'featured', label: 'Featured', type: 'checkbox' },
    ],
  },
  experiences: {
    collection: 'experiences',
    title: 'Experience',
    description: 'Add only verified work, internship, or training history.',
    canCreate: true,
    fields: [
      { key: 'organization', label: 'Organization', type: 'text', required: true },
      { key: 'title', label: 'Role or title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'startDate', label: 'Start date', type: 'date', required: true },
      { key: 'endDate', label: 'End date', type: 'date' },
      { key: 'isCurrent', label: 'Current position', type: 'checkbox' },
    ],
    summaryFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'organization', label: 'Organization', type: 'text' },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'endDate', label: 'End date', type: 'date' },
      { key: 'isCurrent', label: 'Current', type: 'checkbox' },
    ],
  },
  education: {
    collection: 'education',
    title: 'Education',
    description: 'Manage education records shown on the About page.',
    canCreate: true,
    fields: [
      { key: 'institution', label: 'Institution', type: 'text', required: true },
      { key: 'degree', label: 'Degree', type: 'text', required: true },
      { key: 'fieldOfStudy', label: 'Field of study', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'endDate', label: 'End date', type: 'date' },
    ],
    summaryFields: [
      { key: 'degree', label: 'Degree', type: 'text' },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'fieldOfStudy', label: 'Field', type: 'text' },
    ],
  },
  certifications: {
    collection: 'certifications',
    title: 'Certifications',
    description: 'Manage verified certifications and credential links.',
    canCreate: true,
    fields: [
      { key: 'name', label: 'Certification', type: 'text', required: true },
      { key: 'issuer', label: 'Issuer', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'issuedAt', label: 'Issue date', type: 'date' },
      { key: 'credentialUrl', label: 'Credential URL', type: 'url' },
    ],
    summaryFields: [
      { key: 'name', label: 'Certification', type: 'text' },
      { key: 'issuer', label: 'Issuer', type: 'text' },
      { key: 'issuedAt', label: 'Issue date', type: 'date' },
    ],
  },
  messages: {
    collection: 'messages',
    title: 'Messages',
    description: 'Review contact messages and update their read status.',
    canCreate: false,
    fields: [{ key: 'isRead', label: 'Message has been read', type: 'checkbox' }],
    summaryFields: [
      { key: 'name', label: 'From', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' },
      { key: 'isRead', label: 'Read', type: 'checkbox' },
    ],
  },
  settings: {
    collection: 'settings',
    title: 'Website settings',
    description: 'Manage key-value settings used by the portfolio.',
    canCreate: true,
    fields: [
      { key: 'key', label: 'Setting key', type: 'text', required: true },
      { key: 'value', label: 'Setting value', type: 'textarea', required: true },
    ],
    summaryFields: [
      { key: 'key', label: 'Key', type: 'text' },
      { key: 'value', label: 'Value', type: 'textarea' },
    ],
  },
};

export function isAdminCollection(value: string): value is AdminCollection {
  return Object.prototype.hasOwnProperty.call(adminResources, value);
}
