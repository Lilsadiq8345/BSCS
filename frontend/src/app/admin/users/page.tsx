'use client';

import { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Shield, FolderKey } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setUsers(await res.json());
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">Manage developer access, roles, and project assignments.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)]">
          <UserPlus size={16} />
          Create Developer
        </button>
      </div>

      <div className="glass rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Developer</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Assignments</th>
                <th className="px-6 py-4">Security Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{user.email}</span>
                      <span className="text-[10px] text-gray-500 font-mono">UID: {user.id.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                      user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <FolderKey size={14} className="text-gray-600" />
                      {user.projects?.length || 0} Workspaces
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                      <Shield size={12} />
                      Verified
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
