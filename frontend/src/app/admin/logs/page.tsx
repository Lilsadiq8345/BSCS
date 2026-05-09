'use client';

import { useEffect, useState } from 'react';
import { History, Search, Filter, Shield } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setLogs(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Audit Logs</h1>
          <p className="text-gray-500 mt-2">Comprehensive history of all developer actions and system modifications.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search user or action..." 
              className="bg-black/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Resource</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-500">{log.user?.email[0].toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium">{log.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      log.action.includes('DELETE') ? 'bg-red-500/10 text-red-500' : 
                      log.action.includes('POST') ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    {log.target || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400">View JSON</button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic">
                    No activity logs found. All systems quiet.
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
