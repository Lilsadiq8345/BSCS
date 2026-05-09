'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, History, Settings, LogOut, Code, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Audit Logs', icon: History, href: '/admin/logs' },
    { name: 'System Stats', icon: Activity, href: '/admin/metrics' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-900 bg-black/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600">
            <Code size={20} />
          </div>
          <span className="font-bold tracking-tighter text-xl">ADMIN HUB</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-black to-blue-900/10">
        {children}
      </main>
    </div>
  );
}
