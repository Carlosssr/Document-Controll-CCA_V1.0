import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Settings,
  BookOpen,
} from 'lucide-react';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-200">
        <BookOpen className="text-brand-600" size={22} />
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">CCA</p>
          <p className="text-[11px] text-gray-500 leading-tight">Document Control</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-[11px] text-gray-400 text-center">v1.0 · CCA © 2025</p>
      </div>
    </aside>
  );
}
