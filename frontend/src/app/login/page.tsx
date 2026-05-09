'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Loader2, Shield } from 'lucide-react';

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
        body: JSON.stringify({ email, password }),
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#050505]">
      <div className="relative group">
        {/* Animated Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative glass w-full max-w-md rounded-2xl p-8 shadow-2xl bg-black/80">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
              <Code size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-[0.2em]">Developer Login</h1>
            <p className="mt-2 text-xs text-gray-500 uppercase tracking-widest font-medium">Secure Access Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">IP Address / Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="192.168.1.1 / dev@server.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 ml-1">Security Token / Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 p-3.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-0 focus:ring-offset-0" />
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Remember Me</span>
              </label>
              <a href="#" className="text-[10px] text-blue-500 uppercase tracking-wider font-bold hover:text-blue-400">Forgot Password?</a>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-center text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-blue-600 p-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_15px_rgba(37,99,235,0.3)]"
            >
              {loading ? (
                <Loader2 className="mx-auto animate-spin" size={16} />
              ) : (
                'Log In →'
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-900 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10">
              <Shield size={10} className="text-blue-500" />
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">AES-256 Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
