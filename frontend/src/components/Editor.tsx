'use client';

import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  content: string;
  language: string;
  onChange: (value: string | undefined) => void;
  onSave: () => void;
}

export default function Editor({ content, language, onChange, onSave }: EditorProps) {
  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <MonacoEditor
        height="100%"
        language={language || 'typescript'}
        theme="vs-dark"
        value={content}
        onChange={onChange}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            onSave();
          });

          // Disable standard copy/paste behavior as much as possible
          editor.onKeyDown((e) => {
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === monaco.KeyCode.KeyC || e.keyCode === monaco.KeyCode.KeyV)) {
              e.preventDefault();
              e.stopPropagation();
              alert('Copy/Paste is disabled for security reasons.');
            }
          });
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          contextmenu: false, // Disable right-click menu
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
