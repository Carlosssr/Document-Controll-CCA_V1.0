import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import FileTypeBadge from '../components/FileTypeBadge';

export default function Dashboard() {
  const { documents, users } = useApp();

  const total = documents.length;
  const active = documents.filter((d) => d.status === 'Active').length;
  const drafts = documents.filter((d) => d.status === 'Draft').length;
  const underReview = documents.filter((d) => d.status === 'Under Review').length;

  const today = new Date();
  const upcomingReviews = documents.filter((d) => {
    if (!d.reviewDate || d.status !== 'Active') return false;
    const diff = (new Date(d.reviewDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 60;
  });

  const recentDocs = [...documents].slice(0, 5);

  const byDept = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.department] = (acc[d.department] ?? 0) + 1;
    return acc;
  }, {});
  const topDepts = Object.entries(byDept)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Documents" value={total} icon={FileText} color="text-brand-600" />
        <StatCard label="Active" value={active} icon={CheckCircle} color="text-green-600" />
        <StatCard label="Drafts" value={drafts} icon={Clock} color="text-yellow-600" />
        <StatCard label="Under Review" value={underReview} icon={AlertCircle} color="text-blue-600" />
        <StatCard label="Users" value={users.length} icon={Users} color="text-purple-600" />
        <StatCard
          label="Due Reviews (60d)"
          value={upcomingReviews.length}
          icon={TrendingUp}
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Documents</h2>
            <Link to="/documents" className="text-xs text-brand-600 hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                to={`/documents/${doc.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-500">{doc.docNumber}</span>
                    <FileTypeBadge type={doc.fileType} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{doc.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.department} · {doc.owner}</p>
                </div>
                <StatusBadge status={doc.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-5">
          {/* Upcoming Reviews */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Upcoming Reviews{' '}
                <span className="text-gray-400 font-normal">(next 60 days)</span>
              </h2>
            </div>
            {upcomingReviews.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No upcoming reviews</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcomingReviews.slice(0, 5).map((doc) => {
                  const days = Math.ceil(
                    (new Date(doc.reviewDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <Link
                      key={doc.id}
                      to={`/documents/${doc.id}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                    >
                      <div className="min-w-0 mr-2">
                        <p className="text-xs font-mono text-gray-500">{doc.docNumber}</p>
                        <p className="text-sm text-gray-800 truncate">{doc.title}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold flex-shrink-0 ${
                          days <= 7
                            ? 'text-red-600'
                            : days <= 30
                            ? 'text-orange-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {days}d
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* By Department */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Documents by Department</h2>
            </div>
            <div className="px-5 py-3 space-y-2.5">
              {topDepts.map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">{dept}</span>
                    <span className="text-xs font-semibold text-gray-800">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
