'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderKey, Plus, Trash2, Edit2, Shield, Loader2, X, ExternalLink } from 'lucide-react';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hostPath, setHostPath] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setHostPath('./projects/');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description || '');
    setHostPath(project.hostPath);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, description, hostPath }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save workspace');
      }

      await fetchProjects();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workspace? This will remove all developer assignments to this project.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete workspace');
      
      await fetchProjects();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black uppercase tracking-tight text-white">
            Workspace <span className="text-blue-500">Management</span>
          </h1>
          <p className="text-gray-500 text-xs lg:text-sm mt-2 font-medium max-w-xl leading-relaxed">
            Provision and oversee secure project environments. Each workspace is isolated and audited for security compliance.
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-[0_10px_40px_rgba(37,99,235,0.3)] active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>New Workspace</span>
        </button>
      </div>

      <div className="glass rounded-2xl border border-gray-800 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Workspace Name</th>
                <th className="px-6 py-4">Host Path</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{project.name}</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">{project.description || 'No description'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 w-max">
                      <FolderKey size={12} />
                      {project.hostPath}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                      <Shield size={12} />
                      Secured
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        className="p-1.5 hover:bg-green-500/10 rounded-lg text-gray-500 hover:text-green-500 transition-colors"
                        title="View Codebase"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => openEditModal(project)}
                        className="p-1.5 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No workspaces found. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl glass border border-gray-800 bg-gray-950 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white">{editingId ? 'Edit Workspace' : 'Create Workspace'}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Configure secure project directory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Project Apollo"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Host Directory Path</label>
                <input
                  type="text"
                  required
                  value={hostPath}
                  onChange={(e) => setHostPath(e.target.value)}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-sm font-mono text-blue-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="./projects/apollo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Task Instructions for Developer (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Describe exactly what the developer needs to do..."
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
                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Save Changes' : 'Provision Workspace')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
