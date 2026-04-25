import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Document, User, Notification, FilterState, SortField, SortDir } from '../types';
import { seedDocuments } from '../data/seedDocuments';
import { seedUsers } from '../data/seedUsers';

interface AppContextType {
  documents: Document[];
  users: User[];
  currentUser: User;
  notifications: Notification[];
  filters: FilterState;
  sortField: SortField;
  sortDir: SortDir;
  setFilters: (f: Partial<FilterState>) => void;
  setSort: (field: SortField) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  filteredDocuments: Document[];
  unreadCount: number;
}

const defaultFilters: FilterState = {
  search: '',
  category: '',
  status: '',
  department: '',
  owner: '',
};

const AppContext = createContext<AppContextType | null>(null);

function buildNotifications(docs: Document[]): Notification[] {
  const notes: Notification[] = [];
  const today = new Date();

  docs.forEach((doc) => {
    if (!doc.reviewDate) return;
    const review = new Date(doc.reviewDate);
    const diffDays = Math.ceil((review.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 30 && diffDays >= 0 && doc.status === 'Active') {
      notes.push({
        id: `notif-review-${doc.id}`,
        type: 'review_due',
        message: `${doc.docNumber} "${doc.title}" is due for review in ${diffDays} day${diffDays !== 1 ? 's' : ''}.`,
        docId: doc.id,
        read: false,
        date: new Date().toISOString(),
      });
    }
  });

  notes.push({
    id: 'notif-welcome',
    type: 'new_document',
    message: 'Welcome to CCA Document Control Center.',
    read: false,
    date: new Date().toISOString(),
  });

  return notes;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const stored = localStorage.getItem('dcc_documents');
    return stored ? JSON.parse(stored) : seedDocuments;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    buildNotifications(documents)
  );
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [sortField, setSortField] = useState<SortField>('docNumber');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const currentUser = seedUsers[0]; // Admin: Carlos Rivera

  useEffect(() => {
    localStorage.setItem('dcc_documents', JSON.stringify(documents));
  }, [documents]);

  function setFilters(partial: Partial<FilterState>) {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }

  function setSort(field: SortField) {
    setSortDir((prev) => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
  }

  function addDocument(doc: Document) {
    setDocuments((prev) => [doc, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-new-${doc.id}`,
        type: 'new_document',
        message: `New document added: ${doc.docNumber} "${doc.title}".`,
        docId: doc.id,
        read: false,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function updateDocument(updated: Document) {
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  function deleteDocument(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function clearAllNotifications() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filteredDocuments = documents
    .filter((doc) => {
      const q = filters.search.toLowerCase();
      if (
        q &&
        !doc.title.toLowerCase().includes(q) &&
        !doc.docNumber.toLowerCase().includes(q) &&
        !doc.owner.toLowerCase().includes(q) &&
        !doc.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      if (filters.category && doc.category !== filters.category) return false;
      if (filters.status && doc.status !== filters.status) return false;
      if (filters.department && doc.department !== filters.department) return false;
      if (filters.owner && doc.owner !== filters.owner) return false;
      return true;
    })
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      const av = a[sortField] ?? '';
      const bv = b[sortField] ?? '';
      return av < bv ? -mult : av > bv ? mult : 0;
    });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        documents,
        users: seedUsers,
        currentUser,
        notifications,
        filters,
        sortField,
        sortDir,
        setFilters,
        setSort,
        addDocument,
        updateDocument,
        deleteDocument,
        markNotificationRead,
        clearAllNotifications,
        filteredDocuments,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
