import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Ellipse, Text, Transformer } from 'react-konva';
import type { Shape } from '../types';

interface CanvasProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, attrs: Partial<Shape>) => void;
}

const Canvas: React.FC<CanvasProps> = ({ shapes, selectedId, onSelect, onUpdate }) => {
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (selectedId) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne('#' + selectedId);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedId, shapes]);

  const handleMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      onSelect(null);
      return;
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-hidden relative">
      <Stage
        width={window.innerWidth - 64 - 300} // Subtracting toolbar and properties panel widths
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        ref={stageRef}
      >
        <Layer>
          {shapes.map((shape) => {
            const commonProps = {
              key: shape.id,
              id: shape.id,
              x: shape.x,
              y: shape.y,
              rotation: shape.rotation,
              fill: shape.fill,
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
              opacity: shape.opacity,
              draggable: true,
              onClick: () => onSelect(shape.id),
              onDragEnd: (e: any) => {
                onUpdate(shape.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                });
              },
              onTransformEnd: (e: any) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.scaleX(1);
                node.scaleY(1);

                const updates: any = {
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                };

                if (shape.type === 'rect') {
                  updates.width = Math.max(5, node.width() * scaleX);
                  updates.height = Math.max(5, node.height() * scaleY);
                } else if (shape.type === 'circle') {
                  updates.radius = Math.max(5, node.radius() * scaleX);
                } else if (shape.type === 'ellipse') {
                  updates.radiusX = Math.max(5, node.radiusX() * scaleX);
                  updates.radiusY = Math.max(5, node.radiusY() * scaleY);
                }

                onUpdate(shape.id, updates);
              },
            };

            switch (shape.type) {
              case 'rect':
                return <Rect {...commonProps} width={shape.width} height={shape.height} cornerRadius={shape.borderRadius} />;
              case 'circle':
                return <Circle {...commonProps} radius={shape.radius} />;
              case 'ellipse':
                return <Ellipse {...commonProps} radiusX={shape.radiusX} radiusY={shape.radiusY} />;
              case 'line':
                return <Line {...commonProps} points={shape.points} />;
              case 'text':
                return (
                  <Text
                    {...commonProps}
                    text={shape.text}
                    fontSize={shape.fontSize}
                    fontFamily={shape.fontFamily}
                    fontStyle={shape.fontStyle}
                  />
                );
              default:
                return null;
            }
          })}
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
