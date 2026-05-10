'use client';

import { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Shield, FolderKey, X, Loader2, Plus } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProjects(await res.json());
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchProjects()]).finally(() => setLoading(false));
  }, []);

  const handleCreateDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create developer');
      }

      await fetchUsers(); // Refresh the list
      setIsCreateModalOpen(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedProjectId) return;
    
    setActionLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/${selectedProjectId}/assign/${selectedUserId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to assign workspace');
      }

      await fetchUsers(); // Refresh to show new assignment count
      setIsAssignModalOpen(false);
      setSelectedProjectId('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsAssignModalOpen(true);
    setError('');
  };

  return (
    <div className="space-y-6 lg:space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black uppercase tracking-tight text-white">
            User <span className="text-blue-500">Management</span>
          </h1>
          <p className="text-gray-500 text-xs lg:text-sm mt-2 font-medium max-w-xl leading-relaxed">
            Administrate developer access, credentials, and security clearance. Monitor active sessions and project assignments.
          </p>
        </div>
        <button 
          onClick={() => { setIsCreateModalOpen(true); setError(''); }}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-[0_10px_40px_rgba(37,99,235,0.3)] active:scale-95 group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          <span>Add Developer</span>
        </button>
      </div>

      <div className="glass rounded-2xl border border-gray-800 overflow-hidden relative z-0">
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
                      {user.role === 'DEVELOPER' && (!user.projects || user.projects.length === 0) && (
                        <button 
                          onClick={() => openAssignModal(user.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors border border-gray-700 hover:border-gray-600 text-white"
                        >
                          <Plus size={12} /> Assign Workspace
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DEVELOPER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl glass border border-gray-800 bg-gray-950 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white">Create Developer</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Provision a new secure account</p>
            </div>

            <form onSubmit={handleCreateDeveloper} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="dev@codeserver.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-[10px] text-center font-bold text-red-500 uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full flex justify-center items-center py-3 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-blue-500 transition-all disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'Provision Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN WORKSPACE MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl glass border border-gray-800 bg-gray-950 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsAssignModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white">Assign Workspace</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Grant access to a secure folder</p>
            </div>

            <form onSubmit={handleAssignWorkspace} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Select Project Workspace</label>
                <select
                  required
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="" disabled>-- Select a Workspace --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.hostPath})</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-[10px] text-center font-bold text-red-500 uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={actionLoading || !selectedProjectId}
                className="w-full flex justify-center items-center py-3 rounded-xl bg-green-600 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-green-500 transition-all disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'Grant Access'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
