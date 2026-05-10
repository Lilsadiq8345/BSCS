import { useState } from 'react';
import { Folder, File, Plus, FolderPlus, Trash2, X, Check, RefreshCw, ChevronRight, ChevronDown } from 'lucide-react';

interface FileEntry {
  name: string;
  isDirectory: boolean;
  path: string;
}

interface FileTreeProps {
  files: FileEntry[];
  onSelect: (path: string) => void;
  onCreateFile: (path: string) => void;
  onCreateFolder: (path: string) => void;
  onDelete: (path: string) => void;
  onRefresh: () => void;
  selectedPath: string;
  readOnly?: boolean;
}

export default function FileTree({
  files,
  onSelect,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onRefresh,
  selectedPath,
  readOnly = false
}: FileTreeProps) {
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || readOnly) return;

    const finalPath = activeFolder
      ? `${activeFolder}/${newItemName.trim()}`
      : newItemName.trim();

    if (isCreating === 'file') onCreateFile(finalPath);
    else if (isCreating === 'folder') onCreateFolder(finalPath);

    setIsCreating(null);
    setNewItemName('');
  };

  const handleFolderClick = (path: string) => {
    setActiveFolder(activeFolder === path ? null : path);
  };

  return (
    <div className="flex flex-col h-full text-sm text-gray-400">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-900/50 bg-black/20">
        <div className="flex flex-col">
          <span className="uppercase text-[10px] font-black tracking-[0.2em] text-gray-500">Explorer</span>
          {activeFolder && (
            <span className="text-[9px] text-blue-500 font-bold truncate max-w-[100px]">
              in: {activeFolder.split('/').pop()}
            </span>
          )}
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCreating('file')}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
              title="New File"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => setIsCreating('folder')}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
              title="New Folder"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {!readOnly && isCreating && (
          <form onSubmit={handleCreateSubmit} className="flex items-center gap-2 px-2 py-1.5 bg-blue-500/5 border border-blue-500/20 rounded-lg mb-2">
            {isCreating === 'file' ? <File size={14} className="text-gray-500" /> : <Folder size={14} className="text-blue-500" />}
            <input
              autoFocus
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-white outline-none"
              placeholder={isCreating === 'file' ? "filename.js" : "folder..."}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setIsCreating(null)}
            />
            <button type="submit" className="text-green-500 hover:text-green-400"><Check size={14} /></button>
            <button type="button" onClick={() => setIsCreating(null)} className="text-red-500 hover:text-red-400"><X size={14} /></button>
          </form>
        )}

        {files.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center py-10 opacity-20">
            <File size={32} />
            <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">Empty Workspace</span>
          </div>
        )}

        {files.map((file) => {
          const depth = file.path.split('/').length - 1;
          return (
            <div
              key={file.path}
              className={`group flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${selectedPath === file.path ? 'bg-blue-500/10 text-blue-400 shadow-[inset_0_0_10px_rgba(37,99,235,0.05)]' :
                  activeFolder === file.path ? 'bg-white/5 text-white' : 'hover:bg-white/5'
                }`}
              style={{ paddingLeft: `${(depth * 12) + 8}px` }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => file.isDirectory ? handleFolderClick(file.path) : onSelect(file.path)}>
                {file.isDirectory ? (
                  <>
                    {activeFolder === file.path ? <ChevronDown size={12} className="text-gray-600" /> : <ChevronRight size={12} className="text-gray-600" />}
                    <Folder size={14} className={activeFolder === file.path ? "text-blue-400" : "text-blue-500/70"} />
                  </>
                ) : (
                  <File size={14} className="text-gray-500/70 ml-3" />
                )}
                <span className={`truncate ${file.isDirectory ? 'font-bold text-[11px] uppercase tracking-wider' : 'font-medium'}`}>
                  {file.name}
                </span>
              </div>

              {!readOnly && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(file.path); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
