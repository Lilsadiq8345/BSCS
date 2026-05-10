'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, History, Settings, LogOut, Code, Activity, FolderKey, Menu, X as CloseIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/projects');
      return;
    }
    setUser(parsedUser);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { name: 'Workspaces', icon: FolderKey, href: '/admin/projects' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Audit Logs', icon: History, href: '/admin/logs' },
    { name: 'System Stats', icon: Activity, href: '/admin/metrics' },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* MOBILE HEADER */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-xl border-b border-gray-900 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-600">
            <Code size={18} />
          </div>
          <span className="font-black tracking-tighter text-lg uppercase tracking-widest">BSCS</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
        >
          {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-900 bg-black/80 backdrop-blur-2xl flex flex-col transition-all duration-500 ease-in-out
        lg:static lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Code size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight text-xl uppercase tracking-[0.1em]">Admin Hub</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Security Suite</span>
          </div>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                pathname === item.href
                  ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] scale-[1.02]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <item.icon size={20} className={pathname === item.href ? 'text-white' : 'group-hover:text-blue-500 transition-colors'} />
              <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-900/50 bg-black/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-gradient-to-br from-[#050505] via-[#050505] to-blue-950/20 pt-24 lg:pt-12 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
