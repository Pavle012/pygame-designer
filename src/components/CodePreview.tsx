import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { Shape, ProjectSettings } from '../types';
import { generatePygameCode } from '../utils/codeGen';
import type { CodeGenOptions } from '../utils/codeGen';

interface CodePreviewProps {
  shapes: Shape[];
  settings: ProjectSettings;
  onClose: () => void;
}

const CodePreview: React.FC<CodePreviewProps> = ({ shapes, settings, onClose }) => {
  const [options, setOptions] = useState<CodeGenOptions>({
    importAlias: 'pg',
    fullScript: true,
    pygamebg: false,
  });
  const [copied, setCopied] = useState(false);

  const code = generatePygameCode(shapes, settings, options);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-blue-400">Generated Pygame Code</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-6 p-4 bg-slate-800/50 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Import:</label>
            <select
              value={options.importAlias}
              onChange={(e) => setOptions({ ...options, importAlias: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="pygame">import pygame</option>
              <option value="pg">import pygame as pg</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fullScript"
              checked={options.fullScript}
              onChange={(e) => setOptions({ ...options, fullScript: e.target.checked })}
              className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="fullScript" className="text-xs text-slate-300 font-medium uppercase tracking-wider cursor-pointer">
              Full Script
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pygamebg"
              checked={options.pygamebg}
              onChange={(e) => setOptions({ ...options, pygamebg: e.target.checked })}
              className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="pygamebg" className="text-xs text-slate-300 font-medium uppercase tracking-wider cursor-pointer">
              pygamebg
            </label>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <pre className="p-6 overflow-auto h-full font-mono text-sm text-slate-300 leading-relaxed bg-slate-950">
            <code>{code}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-all text-xs font-medium"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
