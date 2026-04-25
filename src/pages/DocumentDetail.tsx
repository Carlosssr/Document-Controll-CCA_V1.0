import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Tag, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import FileTypeBadge from '../components/FileTypeBadge';
import DocumentModal from './DocumentModal';

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const { documents, deleteDocument } = useApp();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);

  const doc = documents.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Document not found.</p>
        <Link to="/documents" className="mt-4 inline-block text-sm text-brand-600 hover:underline">
          Back to Documents
        </Link>
      </div>
    );
  }

  function handleDelete() {
    if (confirm(`Delete "${doc!.title}"? This cannot be undone.`)) {
      deleteDocument(doc!.id);
      navigate('/documents');
    }
  }

  const relatedDocs = doc.relatedDocuments
    .map((rid) => documents.find((d) => d.id === rid))
    .filter(Boolean) as typeof documents;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/documents"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={15} />
          Documents
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {doc.docNumber}
              </span>
              <FileTypeBadge type={doc.fileType} />
              <StatusBadge status={doc.status} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{doc.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{doc.category}</p>
          </div>
          <div className="text-right flex-shrink-0 text-sm text-gray-500 space-y-0.5">
            <p>Version <strong className="text-gray-800">{doc.version}</strong></p>
            <p>{doc.fileSize}</p>
          </div>
        </div>

        {doc.description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {doc.description}
          </p>
        )}

        {doc.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Tag size={13} className="text-gray-400" />
            {doc.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Owner', value: doc.owner },
          { label: 'Department', value: doc.department },
          { label: 'Approved By', value: doc.approvedBy || '—' },
          { label: 'Effective Date', value: doc.effectiveDate || '—' },
          { label: 'Review Date', value: doc.reviewDate || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Revision History */}
      {doc.revisionHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Revision History</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Version', 'Date', 'Author', 'Summary'].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doc.revisionHistory.map((r) => (
                <tr key={r.version}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{r.version}</td>
                  <td className="px-5 py-3 text-gray-600">{r.date}</td>
                  <td className="px-5 py-3 text-gray-600">{r.author}</td>
                  <td className="px-5 py-3 text-gray-500">{r.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Related Documents */}
      {relatedDocs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Related Documents</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {relatedDocs.map((rd) => (
              <Link
                key={rd.id}
                to={`/documents/${rd.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="font-mono text-xs text-gray-500 mr-2">{rd.docNumber}</span>
                  <span className="text-sm text-gray-800">{rd.title}</span>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {showEdit && <DocumentModal onClose={() => setShowEdit(false)} existing={doc} />}
    </div>
  );
}
