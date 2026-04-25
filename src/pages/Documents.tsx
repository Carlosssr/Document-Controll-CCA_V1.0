import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import FileTypeBadge from '../components/FileTypeBadge';
import type { SortField, DocCategory, DocStatus } from '../types';
import { DEPARTMENTS } from '../data/seedUsers';
import DocumentModal from './DocumentModal';

const CATEGORIES: DocCategory[] = [
  'SOP', 'Policy', 'Form', 'Template', 'Work Instruction',
  'Technical Spec', 'Quality Record', 'Training Material',
];
const STATUSES: DocStatus[] = ['Active', 'Draft', 'Under Review', 'Obsolete', 'Archived'];

function SortIcon({ field, active, dir }: { field: string; active: string; dir: 'asc' | 'desc' }) {
  if (field !== active) return <ChevronsUpDown size={13} className="text-gray-300" />;
  return dir === 'asc' ? (
    <ChevronUp size={13} className="text-brand-600" />
  ) : (
    <ChevronDown size={13} className="text-brand-600" />
  );
}

export default function Documents() {
  const { filteredDocuments, filters, setFilters, sortField, sortDir, setSort } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.category || filters.status || filters.department || filters.owner;

  function clearFilters() {
    setFilters({ category: '', status: '', department: '', owner: '' });
  }

  const cols: { label: string; field?: SortField; width?: string }[] = [
    { label: 'Doc No.', field: 'docNumber', width: 'w-28' },
    { label: 'Title', field: 'title' },
    { label: 'Category' },
    { label: 'Status', field: 'status', width: 'w-32' },
    { label: 'Owner' },
    { label: 'Department' },
    { label: 'Effective Date', field: 'effectiveDate', width: 'w-32' },
    { label: 'Review Date', field: 'reviewDate', width: 'w-28' },
    { label: 'Ver.' },
    { label: 'Type' },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search title, number, owner, tags…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-brand-50 border-brand-300 text-brand-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter size={14} />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <X size={13} />
            Clear
          </button>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
        >
          <Plus size={15} />
          New Document
        </button>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-gray-200">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value as DocCategory | '' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as DocStatus | '' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ department: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Owner</label>
            <input
              type="text"
              placeholder="Filter by owner…"
              value={filters.owner}
              onChange={(e) => setFilters({ owner: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-gray-500">
        {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              {cols.map(({ label, field, width }) => (
                <th
                  key={label}
                  className={`text-left px-4 py-3 text-xs font-medium text-gray-500 ${width ?? ''} ${
                    field ? 'cursor-pointer hover:text-gray-900 select-none' : ''
                  }`}
                  onClick={field ? () => setSort(field) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {field && <SortIcon field={field} active={sortField} dir={sortDir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="text-center py-12 text-sm text-gray-400">
                  No documents match your filters.
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{doc.docNumber}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="text-brand-700 hover:underline font-medium line-clamp-2"
                    >
                      {doc.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{doc.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{doc.owner}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{doc.department}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {doc.effectiveDate || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {doc.reviewDate || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{doc.version}</td>
                  <td className="px-4 py-3">
                    <FileTypeBadge type={doc.fileType} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <DocumentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
