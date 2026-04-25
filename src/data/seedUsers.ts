import type { User } from '../types';

export const seedUsers: User[] = [
  {
    id: 'user-001',
    name: 'Carlos Rivera',
    email: 'c.rivera@cca.com',
    role: 'Admin',
    department: 'Quality Assurance',
    avatar: 'CR',
  },
  {
    id: 'user-002',
    name: 'Maria Santos',
    email: 'm.santos@cca.com',
    role: 'Editor',
    department: 'Quality Assurance',
    avatar: 'MS',
  },
  {
    id: 'user-003',
    name: 'Linda Cruz',
    email: 'l.cruz@cca.com',
    role: 'Editor',
    department: 'Human Resources',
    avatar: 'LC',
  },
  {
    id: 'user-004',
    name: 'Roberto Mendez',
    email: 'r.mendez@cca.com',
    role: 'Editor',
    department: 'Information Technology',
    avatar: 'RM',
  },
  {
    id: 'user-005',
    name: 'Patricia Lim',
    email: 'p.lim@cca.com',
    role: 'Editor',
    department: 'Finance',
    avatar: 'PL',
  },
  {
    id: 'user-006',
    name: 'James Villanueva',
    email: 'j.villanueva@cca.com',
    role: 'Editor',
    department: 'Operations',
    avatar: 'JV',
  },
  {
    id: 'user-007',
    name: 'Miguel Torres',
    email: 'm.torres@cca.com',
    role: 'Editor',
    department: 'Engineering',
    avatar: 'MT',
  },
  {
    id: 'user-008',
    name: 'David Reyes',
    email: 'd.reyes@cca.com',
    role: 'Admin',
    department: 'Management',
    avatar: 'DR',
  },
];

export const DEPARTMENTS = [
  'Quality Assurance',
  'Human Resources',
  'Information Technology',
  'Finance',
  'Operations',
  'Engineering',
  'Management',
];
