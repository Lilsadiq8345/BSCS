'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Plus, LogOut, Code } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-900 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="text-blue-500" />
            <span className="text-xl font-bold tracking-tight">Code Server</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">Your Projects</h2>
            <p className="text-gray-400 mt-2">Select a workspace to start coding.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass h-48 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Folder className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400">No projects assigned yet.</p>
            <p className="text-sm text-gray-500 mt-2">Contact your administrator to get access.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="glass group rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition-all hover:bg-white/[0.05]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <Folder />
                  </div>
                  <span className="text-xs font-mono text-gray-500">ID: {project.id.slice(0, 8)}</span>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {project.description || 'Secure development environment.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
