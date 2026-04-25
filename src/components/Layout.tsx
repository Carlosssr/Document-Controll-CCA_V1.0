import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/documents': 'Documents',
  '/users': 'Users',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Layout() {
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const title = PAGE_TITLES[base] ?? 'Document Control Center';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
