'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileTree from '@/components/FileTree';
import Editor from '@/components/Editor';
import Terminal from '@/components/Terminal';
import { Loader2, Code, Shield } from 'lucide-react';

export default function WorkspacePage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [running, setRunning] = useState(false);

  const fetchFiles = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFiles(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  }, [projectId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchFiles().finally(() => setLoading(false));
  }, [fetchFiles, router]);

  const handleFileSelect = async (path: string) => {
    const token = localStorage.getItem('token');
    setSelectedFile(path);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/read?path=${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { content } = await res.json();
        setFileContent(content);
      }
    } catch (err) {
      console.error('Failed to read file', err);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/write`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ path: selectedFile, content: fileContent }),
      });
      setTerminalOutput((prev) => prev + `\n[System] Saved ${selectedFile}`);
    } catch (err) {
      console.error('Failed to save file', err);
    }
  };

  const handleRunCommand = async (command: string) => {
    setRunning(true);
    setTerminalOutput((prev) => prev + `\n$ ${command}`);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/commands/${projectId}/run`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ command }),
      });
      const { output } = await res.json();
      setTerminalOutput((prev) => prev + `\n${output}`);
    } catch (err: any) {
      setTerminalOutput((prev) => prev + `\nError: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#050505] text-white overflow-hidden">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-gray-900 bg-black/80 backdrop-blur-md px-6 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/projects')}>
            <div className="p-2 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-110">
              <Code size={18} />
            </div>
            <span className="text-sm font-black tracking-[0.2em] uppercase">Code Server</span>
          </div>
          
          <div className="h-6 w-[1px] bg-gray-800 mx-2" />
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active File:</span>
            <span className="text-xs text-blue-400 font-mono font-medium">{selectedFile || 'None'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badges */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/5 border border-green-500/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-green-500/80">Container Health: Excellent</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <Shield size={12} className="text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/80">Encrypted AES-256</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-gray-800 mx-2" />

          {/* User Session */}
          <div className="flex items-center gap-3 pl-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">Developer</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Session: 02h 45m</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800 flex items-center justify-center shadow-lg">
              <Shield size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-900 bg-[#0a0a0a] overflow-y-auto">
          <FileTree 
            files={files} 
            onSelect={handleFileSelect} 
            selectedPath={selectedFile || ''} 
          />
        </aside>

        {/* Editor & Terminal Section */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {selectedFile ? (
              <Editor 
                content={fileContent} 
                language={selectedFile.split('.').pop() || 'typescript'}
                onChange={(val) => setFileContent(val || '')}
                onSave={handleSave}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600 bg-[#1e1e1e]">
                <div className="text-center">
                  <Code size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Select a file to start editing</p>
                  <p className="text-xs mt-2">Ctrl+S to save</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-64">
            <Terminal 
              onRunCommand={handleRunCommand} 
              output={terminalOutput} 
              loading={running} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}
