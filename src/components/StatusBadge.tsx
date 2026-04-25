import type { DocStatus } from '../types';

const STATUS_STYLES: Record<DocStatus, string> = {
  Active: 'bg-green-100 text-green-800',
  Draft: 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-blue-100 text-blue-800',
  Obsolete: 'bg-red-100 text-red-800',
  Archived: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}
