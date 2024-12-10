import React from 'react';
import Editor from '@monaco-editor/react';
import { ProgrammingLanguage } from '../types/quiz';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: ProgrammingLanguage;
}

export function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  return (
    <div className="h-[400px] w-full border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}