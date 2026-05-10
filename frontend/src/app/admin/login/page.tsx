'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Key, Terminal, Lock } from 'lucide-react';

export default function AdminLoginPage() {
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
        body: JSON.stringify({ email, password, portal: 'admin' }),
      });

      if (!res.ok) throw new Error('Invalid credentials or access denied.');

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#050000] overflow-hidden">
      {/* Red Pulse Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[150px] animate-pulse" />
      
      {/* Scanner Line Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 pointer-events-none" style={{ backgroundSize: '100% 4px, 3px 100%' }} />

      <div className="relative w-full max-w-md z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex relative group">
            <div className="absolute -inset-6 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/30 transition-all duration-700" />
            <div className="relative h-20 w-20 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-red-600 to-rose-900 shadow-2xl shadow-red-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Shield size={40} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-8 text-4xl font-black uppercase tracking-tighter text-white leading-none">
            Admin <span className="text-red-500 underline decoration-red-500/30 underline-offset-8">Hub</span>
          </h1>
          <p className="mt-4 text-[10px] font-black text-red-500/60 uppercase tracking-[0.5em]">Command & Control Center</p>
        </div>

        <div className="glass-dark rounded-[3rem] p-8 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-red-500/10 relative overflow-hidden animate-in fade-in zoom-in duration-700">
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Administrator Identity</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-red-500 transition-colors">
                    <Terminal size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-white/5 bg-white/[0.02] py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-800 focus:border-red-500/50 focus:bg-white/[0.04] focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                    placeholder="root@codeserver.internal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Master Override Token</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-red-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border border-white/5 bg-white/[0.02] py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-800 focus:border-red-500/50 focus:bg-white/[0.04] focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
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
              className="relative w-full overflow-hidden rounded-2xl bg-red-600 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-red-500 active:scale-[0.97] disabled:opacity-50 shadow-[0_20px_50px_rgba(220,38,38,0.2)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="mx-auto animate-spin" size={18} />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Authorize Access <Shield size={14} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10">
              <Key size={12} className="text-red-500" />
              <span className="text-[9px] font-black text-red-500/60 uppercase tracking-[0.2em]">Security Clearance Level 5</span>
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-gray-700">
          SYSTEM IP LOGGED: 127.0.0.1 &bull; BSCS-CORE-v2
        </p>
      </div>
    </div>
  );
}
