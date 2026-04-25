import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export default function Settings() {
  const { currentUser, documents } = useApp();
  const [saved, setSaved] = useState(false);

  function handleReset() {
    if (confirm('Reset all document data to defaults? This will reload the page.')) {
      localStorage.removeItem('dcc_documents');
      window.location.reload();
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Current Session</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-lg">
            {currentUser.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentUser.role} · {currentUser.department}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">System Information</h2>
        <dl className="space-y-2 text-sm">
          {[
            ['Version', '1.0.0'],
            ['Total Documents', String(documents.length)],
            ['Storage', 'Browser LocalStorage'],
            ['Last Updated', new Date().toLocaleDateString()],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-gray-500">{k}</dt>
              <dd className="font-medium text-gray-800">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              const data = JSON.stringify(documents, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `dcc-export-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 w-fit"
          >
            {saved ? <Check size={14} className="text-green-600" /> : null}
            Export Documents as JSON
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 w-fit"
          >
            Reset to Default Data
          </button>
        </div>
      </div>
    </div>
  );
}
