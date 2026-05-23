import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, Newspaper, Settings, LogOut, Menu, X, Package } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/berita', icon: Newspaper, label: 'Manajemen Berita' },
  { to: '/admin/produk', icon: Package, label: 'Manajemen Produk' },
  { to: '/admin/pengaturan', icon: Settings, label: 'Pengaturan' },
];

export function AdminLayout({ children, title }) {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex flex-col h-full' : 'hidden lg:flex flex-col h-screen sticky top-0'} w-64 bg-white border-r border-gray-200`}>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-bumdes-700 rounded-xl flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-jakarta font-bold text-sm text-bumdes-800">BUMDes Mitra Sejahtera</p>
            <p className="text-xs text-bumdes-600">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(item => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`admin-nav-item ${location.pathname === item.to ? 'active' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-bumdes-100 rounded-full flex items-center justify-center text-bumdes-700 font-bold text-sm">
            {session?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{session?.name}</p>
            <p className="text-xs text-gray-500">{session?.username}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="w-5 h-5" /> Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
          <Sidebar mobile />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500 hover:text-gray-700" aria-label="Toggle sidebar">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="font-jakarta font-bold text-lg text-gray-800">{title}</h1>
          </div>
          <Link to="/" target="_blank" rel="noopener noreferrer"
            className="text-sm text-bumdes-600 hover:text-bumdes-800 transition-colors hidden sm:inline-flex items-center gap-1">
            Lihat Website →
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
