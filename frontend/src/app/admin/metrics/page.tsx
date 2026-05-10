'use client';

import { useEffect, useState } from 'react';
import { Activity, Server, Cpu, HardDrive, Box, RefreshCcw } from 'lucide-react';

interface Stats {
  activeContainers: number;
  systemLoad: string;
  memoryUsage: string;
  storage: string;
  containerStats: {
    id: string;
    name: string;
    cpu: string | number;
    memory: number;
    memoryLimit: number;
  }[];
}

export default function AdminMetricsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/monitoring/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to fetch metrics');
      
      const data = await res.json();
      setStats(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStats();

    if (!isLive) return;

    const interval = setInterval(() => {
      fetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const cards = [
    { name: 'Active Sandboxes', value: stats?.activeContainers || 0, icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Host System Load', value: stats?.systemLoad || '0%', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Host Memory Usage', value: stats?.memoryUsage || '0 GB', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Host Storage Used', value: stats?.storage || 'Unknown', icon: HardDrive, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">System Metrics</h1>
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors ${isLive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isLive ? 'Live' : 'Paused'}
            </div>
          </div>
          <p className="text-gray-500 mt-2">Real-time telemetry of the physical host and isolated sandbox containers.</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-gray-500 font-mono">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-700 transition-all text-white border border-gray-700"
          >
            <RefreshCcw size={14} className={isLive ? 'animate-spin' : ''} />
            {isLive ? 'Pause Polling' : 'Resume Polling'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm">
          Failed to fetch live telemetry: {error}
        </div>
      )}

      {/* HOST METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="glass rounded-2xl border border-gray-800 p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.name}</p>
              <p className="text-2xl font-black mt-1 font-mono">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTAINER METRICS TABLE */}
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <Server size={18} className="text-blue-500" /> 
          Active Developer Sandboxes
        </h2>
        <div className="glass rounded-2xl border border-gray-800 overflow-hidden relative z-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-6 py-4">Container Name / ID</th>
                  <th className="px-6 py-4">CPU Usage</th>
                  <th className="px-6 py-4">Memory Usage</th>
                  <th className="px-6 py-4">Memory Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {stats?.containerStats?.map((container) => (
                  <tr key={container.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-blue-400">{container.name.replace(/^\//, '')}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5">{container.id.slice(0, 12)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {container.cpu}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {(container.memory / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">
                      {(container.memoryLimit / 1024 / 1024).toFixed(2)} MB
                    </td>
                  </tr>
                ))}
                {(!stats?.containerStats || stats.containerStats.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No developer sandboxes are currently running.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
