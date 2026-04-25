export type DocStatus = 'Active' | 'Draft' | 'Under Review' | 'Obsolete' | 'Archived';
export type DocCategory =
  | 'SOP'
  | 'Policy'
  | 'Form'
  | 'Template'
  | 'Work Instruction'
  | 'Technical Spec'
  | 'Quality Record'
  | 'Training Material';

export interface Document {
  id: string;
  docNumber: string;
  title: string;
  category: DocCategory;
  status: DocStatus;
  version: string;
  owner: string;
  department: string;
  effectiveDate: string;
  reviewDate: string;
  description: string;
  tags: string[];
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX';
  fileSize: string;
  approvedBy: string;
  revisionHistory: Revision[];
  relatedDocuments: string[];
}

export interface Revision {
  version: string;
  date: string;
  author: string;
  summary: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  department: string;
  avatar: string;
}

export interface Notification {
  id: string;
  type: 'review_due' | 'new_document' | 'update' | 'approval';
  message: string;
  docId?: string;
  read: boolean;
  date: string;
}

export type SortField = 'title' | 'docNumber' | 'effectiveDate' | 'reviewDate' | 'status';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  search: string;
  category: DocCategory | '';
  status: DocStatus | '';
  department: string;
  owner: string;
}
