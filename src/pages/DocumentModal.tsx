import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Document, DocCategory, DocStatus } from '../types';

const CATEGORIES: DocCategory[] = [
  'SOP', 'Policy', 'Form', 'Template', 'Work Instruction',
  'Technical Spec', 'Quality Record', 'Training Material',
];
const STATUSES: DocStatus[] = ['Active', 'Draft', 'Under Review', 'Obsolete', 'Archived'];
const FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'PPTX'] as const;

interface Props {
  onClose: () => void;
  existing?: Document;
}

function field(
  label: string,
  el: React.ReactNode,
  required = false
) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {el}
    </div>
  );
}

const inputCls =
  'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500';

export default function DocumentModal({ onClose, existing }: Props) {
  const { addDocument, updateDocument, currentUser } = useApp();

  const [form, setForm] = useState<Partial<Document>>(
    existing ?? {
      category: 'SOP',
      status: 'Draft',
      fileType: 'PDF',
      version: '1.0',
      owner: currentUser.name,
      department: currentUser.department,
      tags: [],
      revisionHistory: [],
      relatedDocuments: [],
    }
  );
  const [tagsInput, setTagsInput] = useState((existing?.tags ?? []).join(', '));
  const [error, setError] = useState('');

  function patch(partial: Partial<Document>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function handleSubmit() {
    if (!form.docNumber?.trim() || !form.title?.trim()) {
      setError('Document Number and Title are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const doc: Document = {
      id: existing?.id ?? `doc-${Date.now()}`,
      docNumber: form.docNumber!.trim(),
      title: form.title!.trim(),
      category: form.category as DocCategory,
      status: form.status as DocStatus,
      version: form.version ?? '1.0',
      owner: form.owner ?? currentUser.name,
      department: form.department ?? currentUser.department,
      effectiveDate: form.effectiveDate ?? '',
      reviewDate: form.reviewDate ?? '',
      description: form.description ?? '',
      tags,
      fileType: form.fileType as Document['fileType'],
      fileSize: form.fileSize ?? 'Unknown',
      approvedBy: form.approvedBy ?? '',
      revisionHistory: form.revisionHistory ?? [],
      relatedDocuments: form.relatedDocuments ?? [],
    };

    if (existing) {
      updateDocument(doc);
    } else {
      addDocument(doc);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {existing ? 'Edit Document' : 'Add New Document'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {field(
              'Document Number',
              <input
                className={inputCls}
                placeholder="e.g. SOP-QA-006"
                value={form.docNumber ?? ''}
                onChange={(e) => patch({ docNumber: e.target.value })}
              />,
              true
            )}
            {field(
              'Version',
              <input
                className={inputCls}
                placeholder="1.0"
                value={form.version ?? ''}
                onChange={(e) => patch({ version: e.target.value })}
              />
            )}
          </div>

          {field(
            'Title',
            <input
              className={inputCls}
              placeholder="Document title"
              value={form.title ?? ''}
              onChange={(e) => patch({ title: e.target.value })}
            />,
            true
          )}

          <div className="grid grid-cols-2 gap-4">
            {field(
              'Category',
              <select
                className={inputCls}
                value={form.category ?? 'SOP'}
                onChange={(e) => patch({ category: e.target.value as DocCategory })}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            )}
            {field(
              'Status',
              <select
                className={inputCls}
                value={form.status ?? 'Draft'}
                onChange={(e) => patch({ status: e.target.value as DocStatus })}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field(
              'Owner',
              <input
                className={inputCls}
                value={form.owner ?? ''}
                onChange={(e) => patch({ owner: e.target.value })}
              />
            )}
            {field(
              'Department',
              <input
                className={inputCls}
                value={form.department ?? ''}
                onChange={(e) => patch({ department: e.target.value })}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field(
              'Effective Date',
              <input
                type="date"
                className={inputCls}
                value={form.effectiveDate ?? ''}
                onChange={(e) => patch({ effectiveDate: e.target.value })}
              />
            )}
            {field(
              'Review Date',
              <input
                type="date"
                className={inputCls}
                value={form.reviewDate ?? ''}
                onChange={(e) => patch({ reviewDate: e.target.value })}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field(
              'File Type',
              <select
                className={inputCls}
                value={form.fileType ?? 'PDF'}
                onChange={(e) => patch({ fileType: e.target.value as Document['fileType'] })}
              >
                {FILE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            )}
            {field(
              'Approved By',
              <input
                className={inputCls}
                value={form.approvedBy ?? ''}
                onChange={(e) => patch({ approvedBy: e.target.value })}
              />
            )}
          </div>

          {field(
            'Description',
            <textarea
              className={`${inputCls} min-h-[72px] resize-y`}
              value={form.description ?? ''}
              onChange={(e) => patch({ description: e.target.value })}
            />
          )}

          {field(
            'Tags (comma-separated)',
            <input
              className={inputCls}
              placeholder="e.g. quality, audit, compliance"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
          >
            {existing ? 'Save Changes' : 'Add Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
