import { useState } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import CodePreview from './components/CodePreview';
import { useProject } from './hooks/useProject';

function App() {
  const {
    shapes,
    selectedId,
    setSelectedId,
    addShape,
    updateShape,
    deleteShape,
    undo,
    redo,
    canUndo,
    canRedo
  } = useProject();

  const [showCode, setShowCode] = useState(false);

  const handleAddShape = (type: any) => {
    addShape(type, 150, 150);
  };

  const selectedShape = shapes.find(s => s.id === selectedId) || null;

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden select-none">
      <Toolbar 
        onAddShape={handleAddShape}
        onUndo={undo}
        onRedo={redo}
        onDelete={() => selectedId && deleteShape(selectedId)}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={!!selectedId}
      />
      
      <main className="flex-1 flex flex-col relative">
        <header className="h-12 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-900 shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">P</div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Pygame Designer
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCode(true)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Export Code
            </button>
          </div>
        </header>

        <Canvas 
          shapes={shapes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateShape}
        />
      </main>

      <aside className="w-[300px] border-l border-slate-800 bg-slate-900 flex flex-col shadow-2xl z-20">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30">
          <h2 className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Properties</h2>
        </div>
        <PropertiesPanel 
          selectedShape={selectedShape}
          onUpdate={updateShape}
        />
      </aside>

      {showCode && (
        <CodePreview 
          shapes={shapes}
          onClose={() => setShowCode(false)}
        />
      )}
    </div>
  );
}

export default App;
