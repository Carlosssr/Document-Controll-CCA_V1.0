import { useApp } from '../context/AppContext';

const ROLE_STYLES: Record<string, string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Editor: 'bg-blue-100 text-blue-700',
  Viewer: 'bg-gray-100 text-gray-600',
};

export default function Users() {
  const { users, documents } = useApp();

  const docsByOwner = documents.reduce<Record<string, number>>((acc, d) => {
    acc[d.owner] = (acc[d.owner] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{users.length} users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['User', 'Email', 'Department', 'Role', 'Documents Owned'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {user.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                <td className="px-5 py-3.5 text-gray-600">{user.department}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{docsByOwner[user.name] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
