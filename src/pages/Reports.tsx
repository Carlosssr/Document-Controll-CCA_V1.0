import { useApp } from '../context/AppContext';
import type { DocCategory, DocStatus } from '../types';

const STATUS_COLORS: Record<DocStatus, string> = {
  Active: 'bg-green-500',
  Draft: 'bg-yellow-400',
  'Under Review': 'bg-blue-500',
  Obsolete: 'bg-red-400',
  Archived: 'bg-gray-400',
};

const CATEGORY_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-rose-500',
];

export default function Reports() {
  const { documents } = useApp();

  const byStatus = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  const byCategory = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] ?? 0) + 1;
    return acc;
  }, {});

  const byDept = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.department] = (acc[d.department] ?? 0) + 1;
    return acc;
  }, {});

  const total = documents.length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Overview across {total} documents</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* By Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">By Status</h2>
          <div className="space-y-3">
            {(Object.entries(byStatus) as [DocStatus, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{status}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {count}{' '}
                      <span className="text-xs text-gray-400 font-normal">
                        ({Math.round((count / total) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">By Category</h2>
          <div className="space-y-3">
            {(Object.entries(byCategory) as [DocCategory, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count], i) => (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{cat}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {count}{' '}
                      <span className="text-xs text-gray-400 font-normal">
                        ({Math.round((count / total) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">By Department</h2>
          <div className="space-y-3">
            {Object.entries(byDept)
              .sort(([, a], [, b]) => b - a)
              .map(([dept, count], i) => (
                <div key={dept}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{dept}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {count}{' '}
                      <span className="text-xs text-gray-400 font-normal">
                        ({Math.round((count / total) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[(i + 3) % CATEGORY_COLORS.length]}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Expiry table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Documents by Review Status</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Doc No.', 'Title', 'Owner', 'Review Date', 'Days Until Review'].map((h) => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents
              .filter((d) => d.reviewDate && d.status === 'Active')
              .sort(
                (a, b) =>
                  new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime()
              )
              .map((doc) => {
                const days = Math.ceil(
                  (new Date(doc.reviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{doc.docNumber}</td>
                    <td className="px-5 py-3 text-gray-800">{doc.title}</td>
                    <td className="px-5 py-3 text-gray-500">{doc.owner}</td>
                    <td className="px-5 py-3 text-gray-500">{doc.reviewDate}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-sm font-semibold ${
                          days < 0
                            ? 'text-red-600'
                            : days <= 30
                            ? 'text-orange-500'
                            : days <= 90
                            ? 'text-yellow-500'
                            : 'text-green-600'
                        }`}
                      >
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
