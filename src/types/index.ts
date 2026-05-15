export type ShapeType = 'rect' | 'circle' | 'line' | 'ellipse' | 'polygon' | 'text' | 'image';

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
}

export interface RectShape extends BaseShape {
  type: 'rect';
  width: number;
  height: number;
  borderRadius: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
}

export interface LineShape extends BaseShape {
  type: 'line';
  points: number[];
}

export interface PolygonShape extends BaseShape {
  type: 'polygon';
  points: number[];
}

export interface TextShape extends BaseShape {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
}

export interface ImageShape extends BaseShape {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type Shape = RectShape | CircleShape | EllipseShape | LineShape | PolygonShape | TextShape | ImageShape;

export interface ProjectState {
  shapes: Shape[];
  selectedId: string | null;
}
