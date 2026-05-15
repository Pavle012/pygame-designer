import { useState, useCallback } from 'react';
import type { Shape, ShapeType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useProject = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newShapes);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addShape = (type: ShapeType, x: number, y: number) => {
    const id = uuidv4();
    let newShape: Shape;

    const base: any = {
      id,
      type,
      x,
      y,
      rotation: 0,
      fill: '#3b82f6',
      stroke: '#ffffff',
      strokeWidth: 0,
      opacity: 1,
      visible: true,
    };

    switch (type) {
      case 'rect':
        newShape = { ...base, width: 100, height: 100, borderRadius: 0 };
        break;
      case 'circle':
        newShape = { ...base, radius: 50 };
        break;
      case 'ellipse':
        newShape = { ...base, radiusX: 50, radiusY: 30 };
        break;
      case 'line':
        newShape = { ...base, points: [0, 0, 100, 100] };
        break;
      case 'text':
        newShape = { ...base, text: 'Hello Pygame', fontSize: 24, fontFamily: 'Arial', fontStyle: 'normal' };
        break;
      default:
        return;
    }

    const updatedShapes = [...shapes, newShape];
    setShapes(updatedShapes);
    setSelectedId(id);
    saveToHistory(updatedShapes);
  };

  const updateShape = (id: string, attrs: Partial<Shape>) => {
    const updatedShapes = shapes.map((s) => (s.id === id ? { ...s, ...attrs } : s)) as Shape[];
    setShapes(updatedShapes);
    saveToHistory(updatedShapes);
  };

  const deleteShape = (id: string) => {
    const updatedShapes = shapes.filter((s) => s.id !== id);
    setShapes(updatedShapes);
    setSelectedId(null);
    saveToHistory(updatedShapes);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setShapes(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setShapes(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  return {
    shapes,
    selectedId,
    setSelectedId,
    addShape,
    updateShape,
    deleteShape,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
