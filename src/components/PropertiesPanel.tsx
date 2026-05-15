import React from 'react';
import type { Shape, ProjectSettings } from '../types';

interface PropertiesPanelProps {
  selectedShape: Shape | null;
  settings: ProjectSettings;
  onUpdate: (id: string, attrs: Partial<Shape>) => void;
  onUpdateSettings: (settings: Partial<ProjectSettings>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedShape, 
  settings, 
  onUpdate, 
  onUpdateSettings 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedShape) return;
    const { name, value, type } = e.target;
    let val: any = value;
    
    if (type === 'number') {
      val = parseFloat(value);
    }

    onUpdate(selectedShape.id, { [name]: val });
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateSettings({ [name]: parseInt(value) || 0 });
  };

  return (
    <div className="p-4 flex flex-col gap-6 overflow-y-auto h-full">
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Project Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Width</label>
            <input
              type="number"
              name="screenWidth"
              value={settings.screenWidth}
              onChange={handleSettingsChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Height</label>
            <input
              type="number"
              name="screenHeight"
              value={settings.screenHeight}
              onChange={handleSettingsChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs text-slate-400">Snap Size (px)</label>
            <input
              type="number"
              name="snapSize"
              value={settings.snapSize}
              onChange={handleSettingsChange}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {selectedShape ? (
        <>
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Shape: {selectedShape.type}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">X</label>
                <input
                  type="number"
                  name="x"
                  value={Math.round(selectedShape.x)}
                  onChange={handleChange}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Y</label>
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
                <label className="text-xs text-slate-400">Color</label>
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
                <label className="text-xs text-slate-400">Width (Pygame Draw Param)</label>
                <input
                  type="number"
                  name="width"
                  min="0"
                  value={selectedShape.width}
                  onChange={handleChange}
                  placeholder="0 = filled"
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 italic">0 = filled, &gt;0 = outline</p>
              </div>
            </div>
          </section>

          {selectedShape.type === 'rect' && (
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Width</label>
                  <input
                    type="number"
                    name="rectWidth"
                    value={Math.round(selectedShape.rectWidth)}
                    onChange={handleChange}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Height</label>
                  <input
                    type="number"
                    name="rectHeight"
                    value={Math.round(selectedShape.rectHeight)}
                    onChange={handleChange}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="p-4 flex flex-col items-center justify-center h-full text-slate-500 text-center mt-10">
          <p className="text-sm">Select a shape to edit its specific properties</p>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
