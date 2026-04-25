import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title }: { title: string }) {
  const { currentUser, notifications, unreadCount, markNotificationRead, clearAllNotifications } =
    useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 flex-shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.docId) {
                          navigate(`/documents/${n.docId}`);
                          setShowNotifs(false);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        n.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                        )}
                        <p className={`text-xs text-gray-700 leading-relaxed ${n.read ? 'ml-4' : ''}`}>
                          {n.message}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-gray-100">
          <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
            {currentUser.avatar}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{currentUser.role}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
