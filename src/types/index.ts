export type ShapeType = 'rect' | 'circle' | 'line' | 'ellipse' | 'polygon' | 'arc' | 'text' | 'image';

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
  width: number; // For pygame.draw width param: 0 = filled
}

export interface RectShape extends BaseShape {
  type: 'rect';
  rectWidth: number;
  rectHeight: number;
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
  isFinished: boolean;
}

export interface ArcShape extends BaseShape {
  type: 'arc';
  arcWidth: number;
  arcHeight: number;
  startAngle: number;
  stopAngle: number;
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
  imgWidth: number;
  imgHeight: number;
}

export type Shape = RectShape | CircleShape | EllipseShape | LineShape | PolygonShape | ArcShape | TextShape | ImageShape;

export interface ProjectSettings {
  screenWidth: number;
  screenHeight: number;
  snapSize: number;
}

export interface ProjectState {
  shapes: Shape[];
  selectedId: string | null;
  settings: ProjectSettings;
}
