'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileTree from '@/components/FileTree';
import Editor from '@/components/Editor';
import { Loader2, Code, Shield, ChevronLeft, Menu, X } from 'lucide-react';

export default function AdminCodeViewerPage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const fetchProjectInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjectInfo(await res.json());
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
      router.push('/admin/login');
      return;
    }
    fetchFiles();
    fetchProjectInfo().finally(() => setLoading(false));
  }, [fetchFiles, fetchProjectInfo, router]);

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

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse text-gray-500">Initializing Audit Suite...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      {/* HEADER */}
      <header className="h-14 border-b border-gray-900 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 z-40">
        <div className="flex items-center gap-2 lg:gap-6">
          <button 
            onClick={() => router.push('/admin/projects')}
            className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-gray-800"
            title="Back to Projects"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="h-6 w-[1px] bg-gray-800 hidden sm:block" />

          <button 
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
          
          <div className="flex flex-col min-w-0">
            <h1 className="text-[10px] lg:text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 truncate">
              <Shield size={16} className="text-blue-500 flex-shrink-0" />
              <span className="truncate">{projectInfo?.name}</span>
            </h1>
            <p className="text-[8px] lg:text-[10px] font-black text-gray-500 tracking-tighter uppercase">Audit Suite &bull; Read-Only</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Inspection Mode</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR */}
        <aside className={`
          ${isSidebarVisible ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'}
          absolute lg:relative z-30 lg:z-10 h-full border-r border-gray-900 bg-[#0a0a0a] overflow-y-auto transition-all duration-300 ease-in-out scrollbar-hide
        `}>
          <div className="w-72">
            <FileTree 
              files={files} 
              onSelect={(path) => {
                handleFileSelect(path);
                if (window.innerWidth < 1024) setIsSidebarVisible(false);
              }} 
              onCreateFile={() => {}}
              onCreateFolder={() => {}}
              onDelete={() => {}}
              onRefresh={fetchFiles}
              selectedPath={selectedFile || ''} 
              readOnly={true}
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

        {/* MAIN VIEWER */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
          {/* Viewer Header */}
          <div className="h-10 border-b border-gray-900 bg-[#0a0a0a] flex items-center justify-between px-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <Code size={14} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                {selectedFile || 'Select a file to inspect'}
              </span>
            </div>
            <div className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest border border-yellow-500/20">
              Audit Only
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 overflow-hidden relative group">
            {selectedFile ? (
              <Editor 
                content={fileContent} 
                language={selectedFile.split('.').pop() || 'typescript'} 
                onChange={() => {}}
                onSave={() => {}}
                readOnly={true}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <div className="relative">
                  <Shield size={64} className="text-blue-500" />
                  <Code size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Ready for Inspection</p>
                <p className="mt-2 text-[9px] text-gray-500 max-w-xs text-center leading-relaxed hidden sm:block">Select any file from the explorer to view its source code in the secure audit sandbox.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
