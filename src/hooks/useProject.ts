import { useState, useCallback } from 'react';
import type { Shape, ShapeType, ProjectSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useProject = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProjectSettings>({
    screenWidth: 500,
    screenHeight: 500,
    snapSize: 25,
  });
  const [history, setHistory] = useState<Shape[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newShapes);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addShape = (type: ShapeType, x: number, y: number): string => {
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
      strokeWidth: 2,
      width: 0, // Filled by default
      opacity: 1,
      visible: true,
    };

    switch (type) {
      case 'rect':
        newShape = { ...base, rectWidth: 1, rectHeight: 1, borderRadius: 0 };
        break;
      case 'circle':
        newShape = { ...base, radius: 1 };
        break;
      case 'ellipse':
        newShape = { ...base, radiusX: 1, radiusY: 1 };
        break;
      case 'line':
        newShape = { ...base, points: [0, 0, 0, 0], width: 2 }; // Lines can't be filled
        break;
      case 'polygon':
        newShape = { ...base, points: [0, 0], isFinished: false };
        break;
      case 'arc':
        newShape = { ...base, arcWidth: 1, arcHeight: 1, startAngle: 0, stopAngle: Math.PI, width: 2 };
        break;
      case 'text':
        newShape = { ...base, text: 'Hello Pygame', fontSize: 24, fontFamily: 'Arial', fontStyle: 'normal' };
        break;
      default:
        return id;
    }

    const updatedShapes = [...shapes, newShape];
    setShapes(updatedShapes);
    setSelectedId(id);
    return id;
  };

  const finishDrawing = () => {
    saveToHistory(shapes);
  };

  const updateShape = (id: string, attrs: Partial<Shape>, skipHistory = false) => {
    setShapes(prev => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...attrs } : s)) as Shape[];
      if (!skipHistory) saveToHistory(next);
      return next;
    });
  };

  const deleteShape = (id: string) => {
    const updatedShapes = shapes.filter((s) => s.id !== id);
    setShapes(updatedShapes);
    setSelectedId(null);
    saveToHistory(updatedShapes);
  };

  const updateSettings = (newSettings: Partial<ProjectSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
    settings,
    setSelectedId,
    addShape,
    updateShape,
    deleteShape,
    updateSettings,
    undo,
    redo,
    finishDrawing,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
