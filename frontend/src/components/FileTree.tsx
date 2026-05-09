'use client';

import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

interface FileEntry {
  name: string;
  isDirectory: boolean;
  path: string;
}

interface FileTreeProps {
  files: FileEntry[];
  onSelect: (path: string) => void;
  selectedPath: string;
}

export default function FileTree({ files, onSelect, selectedPath }: FileTreeProps) {
  return (
    <div className="flex flex-col gap-1 p-2 text-sm text-gray-400">
      <div className="px-2 py-1 uppercase text-xs font-bold tracking-widest text-gray-600 mb-2">
        Explorer
      </div>
      {files.map((file) => (
        <div
          key={file.path}
          onClick={() => onSelect(file.path)}
          className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors ${
            selectedPath === file.path ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5'
          }`}
        >
          {file.isDirectory ? (
            <Folder size={16} className="text-blue-500" />
          ) : (
            <File size={16} className="text-gray-500" />
          )}
          <span className="truncate">{file.name}</span>
        </div>
      ))}
    </div>
  );
}
