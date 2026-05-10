'use client';

import { useEffect, useState } from 'react';
import { Activity, Cpu, Database, HardDrive, Server, ShieldCheck, Users } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/monitoring/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { name: 'Active Containers', value: stats?.activeContainers || 0, icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'System Load', value: stats?.systemLoad || '0%', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Memory Usage', value: stats?.memoryUsage || '0 GB', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Storage', value: stats?.storage || 'Unknown', icon: HardDrive, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-2">Real-time health monitoring of the code server cluster.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="glass p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Live</span>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{card.name}</h3>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Container List */}
      <div className="glass rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-900 flex justify-between items-center">
          <h2 className="text-lg font-bold">Active Sandboxes</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/admin/projects'}
              className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
            >
              Manage & Inspect Workspaces →
            </button>
            <div className="flex items-center gap-2 text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <ShieldCheck size={14} />
              <span className="font-bold uppercase tracking-widest">Isolated System</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Container ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">CPU Usage</th>
                <th className="px-6 py-4">Memory</th>
                <th className="px-6 py-4">Network</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {stats?.containerStats?.map((c: any) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-400">{c.id.slice(0, 12)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                      Running
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{c.cpu.toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm font-mono">{(c.memory / 1024 / 1024).toFixed(1)} MB</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Encrypted Tunnel</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic">
                    No active developer containers detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
