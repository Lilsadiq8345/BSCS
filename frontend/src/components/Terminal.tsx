'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Square, ChevronRight, ShieldCheck } from 'lucide-react';

interface TerminalProps {
  onRunCommand: (command: string) => void;
  output: string;
  loading: boolean;
  readOnly?: boolean;
}

export default function Terminal({ onRunCommand, output, loading, readOnly = false }: TerminalProps) {
  const [command, setCommand] = useState('');
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !loading && !readOnly) {
      onRunCommand(command.trim());
      setCommand('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border-t border-gray-900 shadow-2xl overflow-hidden font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>
          <div className="h-4 w-[1px] bg-gray-800 mx-1" />
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <TerminalIcon size={12} className="text-blue-500/70" />
            <span>Bash v5.2 — {readOnly ? 'Audit View' : 'Secure Shell'}</span>
          </div>
        </div>

        {readOnly ? (
          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">
            <ShieldCheck size={10} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500">Inspector Mode</span>
          </div>
        ) : (
          loading && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Running...</span>
              <Square size={10} className="text-blue-500 animate-spin" />
            </div>
          )
        )}
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed scrollbar-hide">
        <div className="space-y-1.5">
          {output.split('\n').map((line, i) => {
            if (line.startsWith('$ ')) {
              return (
                <div key={i} className="flex items-center gap-2 mt-4 first:mt-0">
                  <span className="text-green-500 font-black">➜</span>
                  <span className="text-blue-400 font-bold">~/workspace</span>
                  <span className="text-white">{line.slice(2)}</span>
                </div>
              );
            }
            if (line.startsWith('[System]')) {
              return <div key={i} className="text-yellow-500/80 italic text-[11px] py-1">{line}</div>;
            }
            if (line.startsWith('Error:')) {
              return <div key={i} className="text-red-400 bg-red-400/5 px-2 py-1 rounded border border-red-400/10 my-1">{line}</div>;
            }
            return <div key={i} className="text-gray-400/90 pl-6">{line || '\u00A0'}</div>;
          })}
        </div>
        <div ref={outputEndRef} />
      </div>

      {/* Input Area (Only if not readOnly) */}
      {!readOnly && (
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-black/60 border-t border-gray-900/50 flex items-center gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
            <span className="text-green-500 text-xs font-black">➜</span>
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-tighter">WS</span>
          </div>

          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white font-mono text-sm outline-none placeholder:text-gray-700"
            placeholder="Type command (npm, node, ls)..."
            autoFocus
          />

          <button
            type="submit"
            disabled={loading || !command.trim()}
            className="group flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:bg-gray-800 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Execute</span>
            <Play size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      )}
    </div>
  );
}
