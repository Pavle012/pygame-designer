import React from 'react';
import { 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Image as ImageIcon, 
  MousePointer2,
  Undo2,
  Redo2,
  Trash2,
  Box
} from 'lucide-react';
import type { ShapeType } from '../types';

interface ToolbarProps {
  activeTool: ShapeType | 'select';
  onSetTool: (tool: ShapeType | 'select') => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool,
  onSetTool,
  onUndo, 
  onRedo, 
  onDelete,
  canUndo,
  canRedo,
  hasSelection
}) => {
  const tools = [
    { type: 'rect' as ShapeType, icon: <Square size={20} />, label: 'Rectangle' },
    { type: 'circle' as ShapeType, icon: <Circle size={20} />, label: 'Circle' },
    { type: 'ellipse' as ShapeType, icon: <Box size={20} />, label: 'Ellipse' },
    { type: 'line' as ShapeType, icon: <Minus size={20} />, label: 'Line' },
    { type: 'polygon' as ShapeType, icon: <Box size={20} className="rotate-45" />, label: 'Polygon' },
    { type: 'arc' as ShapeType, icon: <Circle size={20} className="opacity-50" />, label: 'Arc' },
    { type: 'text' as ShapeType, icon: <Type size={20} />, label: 'Text' },
    { type: 'image' as ShapeType, icon: <ImageIcon size={20} />, label: 'Image' },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-900 border-r border-slate-800 h-full w-16 items-center">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => onSetTool('select')}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${activeTool === 'select' ? 'text-blue-400 bg-slate-800' : 'text-slate-500'}`} 
          title="Select"
        >
          <MousePointer2 size={20} />
        </button>
      </div>
      
      <div className="w-8 h-px bg-slate-800" />
      
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => onSetTool(tool.type)}
            className={`p-2 rounded hover:bg-slate-800 transition-colors ${activeTool === tool.type ? 'text-blue-400 bg-slate-800' : 'text-slate-300'}`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-8 h-px bg-slate-800" />

      <div className="flex flex-col gap-2">
        <button 
          onClick={onUndo} 
          disabled={!canUndo}
          className="p-2 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30"
          title="Undo"
        >
          <Undo2 size={20} />
        </button>
        <button 
          onClick={onRedo} 
          disabled={!canRedo}
          className="p-2 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30"
          title="Redo"
        >
          <Redo2 size={20} />
        </button>
        <button 
          onClick={onDelete} 
          disabled={!hasSelection}
          className="p-2 rounded hover:bg-slate-800 text-red-400 disabled:opacity-30"
          title="Delete"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
