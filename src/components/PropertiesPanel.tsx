import React from 'react';
import type { Shape } from '../types';

interface PropertiesPanelProps {
  selectedShape: Shape | null;
  onUpdate: (id: string, attrs: Partial<Shape>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedShape, onUpdate }) => {
  if (!selectedShape) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-slate-500 text-center">
        <p className="text-sm">Select a shape to edit its properties</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    
    if (type === 'number') {
      val = parseFloat(value);
    }

    onUpdate(selectedShape.id, { [name]: val });
  };

  return (
    <div className="p-4 flex flex-col gap-6 overflow-y-auto h-full">
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">General</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">X Position</label>
            <input
              type="number"
              name="x"
              value={Math.round(selectedShape.x)}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Y Position</label>
            <input
              type="number"
              name="y"
              value={Math.round(selectedShape.y)}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Rotation</label>
            <input
              type="number"
              name="rotation"
              value={Math.round(selectedShape.rotation)}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Opacity</label>
            <input
              type="number"
              name="opacity"
              min="0"
              max="1"
              step="0.1"
              value={selectedShape.opacity}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Style</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Fill Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                name="fill"
                value={selectedShape.fill}
                onChange={handleChange}
                className="w-10 h-8 bg-transparent border-none cursor-pointer"
              />
              <span className="text-xs font-mono uppercase text-slate-400">{selectedShape.fill}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Stroke Width</label>
            <input
              type="number"
              name="strokeWidth"
              min="0"
              value={selectedShape.strokeWidth}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {selectedShape.type === 'rect' && (
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Rectangle</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Width</label>
              <input
                type="number"
                name="width"
                value={Math.round(selectedShape.width)}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Height</label>
              <input
                type="number"
                name="height"
                value={Math.round(selectedShape.height)}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>
      )}

      {selectedShape.type === 'text' && (
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Text</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Content</label>
              <input
                type="text"
                name="text"
                value={selectedShape.text}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={selectedShape.fontSize}
                onChange={handleChange}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertiesPanel;
