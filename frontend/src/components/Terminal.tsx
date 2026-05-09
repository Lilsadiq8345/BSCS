'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play } from 'lucide-react';

interface TerminalProps {
  onRunCommand: (command: string) => void;
  output: string;
  loading: boolean;
}

export default function Terminal({ onRunCommand, output, loading }: TerminalProps) {
  const [command, setCommand] = useState('');
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !loading) {
      onRunCommand(command.trim());
      setCommand('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-t border-gray-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-900">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <TerminalIcon size={14} />
          <span className="font-mono">Terminal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap">
        {output || 'No output to show. Type a command to get started.'}
        <div ref={outputEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-2 bg-[#0a0a0a] flex items-center gap-2">
        <span className="text-green-500 font-mono ml-2">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={loading}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white font-mono text-sm outline-none"
          placeholder="npm test, node app.js..."
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !command.trim()}
          className="p-1.5 rounded-lg bg-blue-600/20 text-blue-500 hover:bg-blue-600/30 disabled:opacity-50 transition-all"
        >
          <Play size={14} />
        </button>
      </form>
    </div>
  );
}
