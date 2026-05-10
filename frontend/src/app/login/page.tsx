'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Loader2, Shield, Lock, Globe } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, portal: 'developer' }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#020202] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative w-full max-w-md z-10">
        {/* Header Logo Area */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex relative group">
            <div className="absolute -inset-4 bg-blue-600/20 rounded-full blur-xl group-hover:bg-blue-600/30 transition-all duration-500" />
            <div className="relative h-20 w-20 flex items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-white/10">
              <Code size={40} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-black uppercase tracking-tight text-white leading-none">
            Secure <span className="text-blue-500">Sandbox</span>
          </h1>
          <p className="mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Developer Portal &bull; v2.0</p>
        </div>

        <div className="glass-dark rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-black border border-white/5 relative overflow-hidden animate-in fade-in zoom-in duration-700">
          {/* Form Content */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Authentication ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-blue-500 transition-colors">
                    <Globe size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-white/5 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="Enter email or UID"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Security Token</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border border-white/5 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 animate-in shake duration-500">
                <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-blue-500 active:scale-[0.97] disabled:opacity-50 shadow-[0_20px_50px_rgba(37,99,235,0.3)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="mx-auto animate-spin" size={18} />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Initialize Session <span className="opacity-50 text-lg leading-none">→</span>
                </span>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10">
              <Shield size={12} className="text-blue-500" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.1em]">End-to-End Encrypted Tunnel</span>
            </div>
            <p className="text-[10px] font-medium text-gray-600">Unauthorized access is strictly prohibited.</p>
          </div>
        </div>
        
        {/* Admin Link Overlay */}
        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          Administrative staff? <button onClick={() => router.push('/admin/login')} className="text-blue-500 font-black uppercase tracking-widest hover:text-blue-400 ml-1">Login Here</button>
        </p>
      </div>
    </div>
  );
}
