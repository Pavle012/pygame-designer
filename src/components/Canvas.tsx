import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Ellipse, Text, Transformer, Arc } from 'react-konva';
import type { Shape, ShapeType, ProjectSettings, PolygonShape } from '../types';

interface CanvasProps {
  shapes: Shape[];
  selectedId: string | null;
  activeTool: ShapeType | 'select';
  settings: ProjectSettings;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, attrs: Partial<Shape>, skipHistory?: boolean) => void;
  onAdd: (type: ShapeType, x: number, y: number) => string;
  onFinishDrawing: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  shapes, 
  selectedId, 
  activeTool, 
  settings,
  onSelect, 
  onUpdate, 
  onAdd,
  onFinishDrawing 
}) => {
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShapeId, setNewShapeId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId && activeTool === 'select') {
      const stage = stageRef.current;
      const selectedNode = stage.findOne('#' + selectedId);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedId, shapes, activeTool]);

  const snap = (val: number) => {
    if (settings.snapSize <= 0) return val;
    return Math.round(val / settings.snapSize) * settings.snapSize;
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const snappedX = snap(pos.x);
    const snappedY = snap(pos.y);

    if (activeTool === 'select') {
      if (e.target === e.target.getStage()) {
        onSelect(null);
      }
      return;
    }

    if (activeTool === 'polygon') {
      if (!isDrawing) {
        const id = onAdd('polygon', snappedX, snappedY);
        setNewShapeId(id);
        setIsDrawing(true);
      } else if (newShapeId) {
        const poly = shapes.find(s => s.id === newShapeId) as PolygonShape;
        if (poly) {
          const newPoints = [...poly.points, snappedX - poly.x, snappedY - poly.y];
          onUpdate(newShapeId, { points: newPoints }, true);
        }
      }
      return;
    }

    const id = onAdd(activeTool as ShapeType, snappedX, snappedY);
    setNewShapeId(id);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !newShapeId || activeTool === 'polygon') return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const shape = shapes.find(s => s.id === newShapeId);
    if (!shape) return;

    const snappedX = snap(pos.x);
    const snappedY = snap(pos.y);

    const updates: any = {};
    if (shape.type === 'rect') {
      updates.rectWidth = snappedX - shape.x;
      updates.rectHeight = snappedY - shape.y;
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(Math.pow(snappedX - shape.x, 2) + Math.pow(snappedY - shape.y, 2));
      updates.radius = snap(radius);
    } else if (shape.type === 'ellipse') {
      updates.radiusX = Math.abs(snappedX - shape.x);
      updates.radiusY = Math.abs(snappedY - shape.y);
    } else if (shape.type === 'line') {
      updates.points = [0, 0, snappedX - shape.x, snappedY - shape.y];
    } else if (shape.type === 'arc') {
      updates.arcWidth = Math.abs(snappedX - shape.x) * 2;
      updates.arcHeight = Math.abs(snappedY - shape.y) * 2;
    }

    onUpdate(newShapeId, updates, true);
  };

  const handleMouseUp = () => {
    if (isDrawing && activeTool !== 'polygon') {
      setIsDrawing(false);
      setNewShapeId(null);
      onFinishDrawing();
    }
  };

  const renderGrid = () => {
    const lines = [];
    const step = settings.snapSize;
    if (step <= 5) return null;

    for (let i = 0; i <= settings.screenWidth; i += step) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, settings.screenHeight]}
          stroke="#1e293b"
          strokeWidth={1}
          listening={false}
        />
      );
    }
    for (let i = 0; i <= settings.screenHeight; i += step) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, settings.screenWidth, i]}
          stroke="#1e293b"
          strokeWidth={1}
          listening={false}
        />
      );
    }
    return lines;
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto relative cursor-crosshair flex items-center justify-center p-10">
      {isDrawing && activeTool === 'polygon' && (
        <button 
          onClick={() => {
            if (newShapeId) {
              onUpdate(newShapeId, { isFinished: true } as any);
              setIsDrawing(false);
              setNewShapeId(null);
              onFinishDrawing();
            }
          }}
          className="absolute top-4 right-4 z-30 px-4 py-2 bg-green-600 text-white rounded font-bold shadow-lg hover:bg-green-700 transition-colors"
        >
          Finish Polygon
        </button>
      )}
      <div 
        className="bg-slate-900 shadow-2xl overflow-hidden"
        style={{ width: settings.screenWidth, height: settings.screenHeight }}
      >
        <Stage
          width={settings.screenWidth}
          height={settings.screenHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {renderGrid()}
            {shapes.map((shape) => {
              const isSelected = shape.id === selectedId;
              const isFilled = shape.width === 0;
              const commonProps = {
                key: shape.id,
                id: shape.id,
                x: shape.x,
                y: shape.y,
                rotation: shape.rotation,
                fill: isFilled ? shape.fill : undefined,
                stroke: shape.fill, // Pygame 'color' param is used for both fill/stroke
                strokeWidth: isFilled ? 0 : shape.width || 2,
                opacity: shape.opacity,
                draggable: activeTool === 'select' && isSelected,
                onClick: () => activeTool === 'select' && onSelect(shape.id),
                onDragMove: (e: any) => {
                   if (settings.snapSize > 0) {
                     e.target.x(snap(e.target.x()));
                     e.target.y(snap(e.target.y()));
                   }
                },
                onDragEnd: (e: any) => {
                  onUpdate(shape.id, {
                    x: snap(e.target.x()),
                    y: snap(e.target.y()),
                  });
                },
                onTransformEnd: (e: any) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  node.scaleX(1);
                  node.scaleY(1);
                  const updates: any = {
                    x: snap(node.x()),
                    y: snap(node.y()),
                    rotation: node.rotation(),
                  };
                  if (shape.type === 'rect') {
                    updates.rectWidth = snap(node.width() * scaleX);
                    updates.rectHeight = snap(node.height() * scaleY);
                  } else if (shape.type === 'circle') {
                    updates.radius = snap(node.radius() * scaleX);
                  } else if (shape.type === 'ellipse') {
                    updates.radiusX = snap(node.radiusX() * scaleX);
                    updates.radiusY = snap(node.radiusY() * scaleY);
                  }
                  onUpdate(shape.id, updates);
                },
              };

              switch (shape.type) {
                case 'rect':
                  return <Rect {...commonProps} width={shape.rectWidth} height={shape.rectHeight} cornerRadius={shape.borderRadius} />;
                case 'circle':
                  return <Circle {...commonProps} radius={shape.radius} />;
                case 'ellipse':
                  return <Ellipse {...commonProps} radiusX={shape.radiusX} radiusY={shape.radiusY} />;
                case 'line':
                  return <Line {...commonProps} points={shape.points} strokeWidth={shape.width || 2} />;
                case 'polygon':
                  return <Line {...commonProps} points={shape.points} closed={(shape as any).isFinished} />;
                case 'arc':
                  return (
                    <Arc
                      {...commonProps}
                      innerRadius={(shape as any).arcWidth / 2 - (shape.width || 2)}
                      outerRadius={(shape as any).arcWidth / 2}
                      angle={((shape.stopAngle - shape.startAngle) * 180) / Math.PI}
                      rotation={shape.rotation + (shape.startAngle * 180) / Math.PI}
                    />
                  );
                case 'text':
                  return (
                    <Text
                      {...commonProps}
                      text={shape.text}
                      fontSize={shape.fontSize}
                      fontFamily={shape.fontFamily}
                      fontStyle={shape.fontStyle}
                      strokeWidth={0}
                    />
                  );
                default:
                  return null;
              }
            })}
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
