'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileTree from '@/components/FileTree';
import Editor from '@/components/Editor';
import Terminal from '@/components/Terminal';
import { Loader2, Code, Shield, BookOpen, X, Menu, ChevronRight } from 'lucide-react';

export default function WorkspacePage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        setIsAdmin(user.role === 'ADMIN');
      }
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  }, []);

  const fetchProjectInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const info = await res.json();
        setProjectInfo(info);
        if (info.description) {
          setIsBriefOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch project info', err);
    }
  }, [projectId]);

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
    fetchFiles();
    fetchUserProfile();
    fetchProjectInfo().finally(() => setLoading(false));
  }, [fetchFiles, fetchProjectInfo, fetchUserProfile, router]);

  const handleFileSelect = async (path: string) => {
    const token = localStorage.getItem('token');
    setSelectedFile(path);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/read?path=${encodeURIComponent(path)}`, {
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
    if (!selectedFile || isAdmin) return;
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

  const handleCreateFile = async (name: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ path: name }),
      });
      if (res.ok) {
        fetchFiles();
        setTerminalOutput((prev) => prev + `\n[System] Created file: ${name}`);
      }
    } catch (err) {
      console.error('Failed to create file', err);
    }
  };

  const handleCreateFolder = async (name: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/mkdir`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ path: name }),
      });
      if (res.ok) {
        fetchFiles();
        setTerminalOutput((prev) => prev + `\n[System] Created folder: ${name}`);
      }
    } catch (err) {
      console.error('Failed to create folder', err);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/files/${projectId}/delete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ path }),
      });
      if (res.ok) {
        fetchFiles();
        if (selectedFile === path) {
          setSelectedFile(null);
          setFileContent('');
        }
        setTerminalOutput((prev) => prev + `\n[System] Deleted: ${path}`);
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleRunCommand = async (command: string) => {
    if (isAdmin) return;
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
      const data = await res.json();
      if (res.ok) {
        setTerminalOutput((prev) => prev + `\n${data.output || 'Done.'}`);
      } else {
        setTerminalOutput((prev) => prev + `\nError: ${data.message || 'Execution failed'}`);
      }
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
      <header className="flex h-14 items-center justify-between border-b border-gray-900 bg-black/80 backdrop-blur-md px-4 lg:px-6 z-20">
        <div className="flex items-center gap-2 lg:gap-6">
          <button 
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all mr-1"
          >
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/projects')}>
            <div className="p-1.5 lg:p-2 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-110">
              <Code size={18} />
            </div>
            <span className="text-[10px] lg:text-sm font-black tracking-[0.2em] uppercase">Code Server</span>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-gray-800 mx-2" />

          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active:</span>
            <span className="text-xs text-blue-400 font-mono font-medium truncate max-w-[150px]">{selectedFile || 'None'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/5 border border-green-500/20 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-green-500/80">Container: Excellent</span>
            </div>

            <button
              onClick={() => setIsBriefOpen(true)}
              className="flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-lg group"
            >
              <BookOpen size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 hidden sm:inline">Brief</span>
            </button>
          </div>

          <div className="h-6 w-[1px] bg-gray-800 mx-1 lg:mx-2" />

          <div className="flex items-center gap-2 lg:gap-3 pl-1">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white leading-none">Developer</span>
              <span className="text-[8px] lg:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Session: 02h 45m</span>
            </div>
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800 flex items-center justify-center shadow-lg">
              <Shield size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          ${isSidebarVisible ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
          absolute lg:relative z-30 lg:z-10 h-full border-r border-gray-900 bg-[#0a0a0a] overflow-y-auto transition-all duration-300 ease-in-out scrollbar-hide
        `}>
          <div className="w-64">
            <FileTree 
              files={files} 
              onSelect={(path) => {
                handleFileSelect(path);
                if (window.innerWidth < 1024) setIsSidebarVisible(false);
              }}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDelete={handleDelete}
              onRefresh={fetchFiles}
              selectedPath={selectedFile || ''} 
              readOnly={isAdmin}
            />
          </div>
        </aside>

        {/* MOBILE OVERLAY */}
        {isSidebarVisible && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden top-14"
            onClick={() => setIsSidebarVisible(false)}
          />
        )}

        {/* Editor & Terminal Section */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#0f0f0f]">
          {/* Editor Header */}
          <div className="h-10 border-b border-gray-900 bg-[#0a0a0a] flex items-center justify-between px-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <Code size={14} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                {selectedFile || 'No file selected'}
              </span>
              {isAdmin && (
                <span className="ml-2 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest border border-yellow-500/20">
                  Read Only
                </span>
              )}
            </div>
            {!isAdmin && selectedFile && (
              <button 
                onClick={handleSave}
                className="px-3 py-1 rounded bg-blue-600 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              >
                Save
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden relative">
            {selectedFile ? (
              <Editor 
                content={fileContent} 
                language={selectedFile.split('.').pop() || 'typescript'}
                onChange={(val) => setFileContent(val || '')}
                onSave={handleSave}
                readOnly={isAdmin}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center opacity-20">
                <Code size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select a file to begin</p>
              </div>
            )}
          </div>
          
          <div className="h-48 lg:h-64 border-t border-gray-900">
            <Terminal 
              onRunCommand={handleRunCommand} 
              output={terminalOutput} 
              loading={running} 
              readOnly={isAdmin}
            />
          </div>
        </main>
      </div>

      {/* PROJECT BRIEF MODAL */}
      {isBriefOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 scale-in-center animate-in zoom-in duration-300 text-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
            <button onClick={() => setIsBriefOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
              <X size={20} />
            </button>
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30">
                  <BookOpen size={24} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">{projectInfo?.name}</h2>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">Active Task Brief &bull; v1.0 Secure Sandbox</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <ChevronRight size={14} className="text-blue-500" />
                    Task Instructions
                  </h3>
                  <div className="text-gray-300 leading-relaxed font-medium">
                    {projectInfo?.description || 'No instructions provided for this project.'}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button onClick={() => setIsBriefOpen(false)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95">
                    Start Coding
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Secure Environment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
