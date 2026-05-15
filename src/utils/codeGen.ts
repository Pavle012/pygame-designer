import type { Shape } from '../types';

export interface CodeGenOptions {
  importAlias: string; // 'pygame' or 'pg'
  fullScript: boolean;
  pygamebg: boolean;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : '(255, 255, 255)';
};

export const generatePygameCode = (shapes: Shape[], options: CodeGenOptions): string => {
  const { importAlias, fullScript, pygamebg } = options;
  const pg = importAlias;

  let lines: string[] = [];

  if (fullScript) {
    lines.push(`import pygame${importAlias === 'pg' ? ' as pg' : ''}`);
    if (pygamebg) lines.push('import pygamebg');
    lines.push('');
    lines.push(`${pg}.init()`);
    lines.push('screen = screen = pygame.display.set_mode((800, 600))');
    lines.push('clock = pygame.time.Clock()');
    lines.push('running = True');
    lines.push('');
    lines.push('while running:');
    lines.push('    for event in pygame.event.get():');
    lines.push('        if event.type == pygame.QUIT:');
    lines.push('            running = False');
    lines.push('');
    lines.push('    screen.fill((30, 30, 30))');
    lines.push('');
  }

  const indent = fullScript ? '    ' : '';

  shapes.forEach((shape) => {
    if (!shape.visible) return;

    const color = hexToRgb(shape.fill);
    const strokeWidth = shape.strokeWidth || 0;

    switch (shape.type) {
      case 'rect':
        lines.push(`${indent}${pg}.draw.rect(screen, ${color}, (${Math.round(shape.x)}, ${Math.round(shape.y)}, ${Math.round(shape.width)}, ${Math.round(shape.height)}), ${strokeWidth})`);
        break;
      case 'circle':
        lines.push(`${indent}${pg}.draw.circle(screen, ${color}, (${Math.round(shape.x)}, ${Math.round(shape.y)}), ${Math.round(shape.radius)}, ${strokeWidth})`);
        break;
      case 'ellipse':
        lines.push(`${indent}${pg}.draw.ellipse(screen, ${color}, (${Math.round(shape.x - shape.radiusX)}, ${Math.round(shape.y - shape.radiusY)}, ${Math.round(shape.radiusX * 2)}, ${Math.round(shape.radiusY * 2)}), ${strokeWidth})`);
        break;
      case 'line':
        const x1 = Math.round(shape.x + shape.points[0]);
        const y1 = Math.round(shape.y + shape.points[1]);
        const x2 = Math.round(shape.x + shape.points[2]);
        const y2 = Math.round(shape.y + shape.points[3]);
        lines.push(`${indent}${pg}.draw.line(screen, ${color}, (${x1}, ${y1}), (${x2}, ${y2}), ${strokeWidth || 1})`);
        break;
      case 'text':
        lines.push(`${indent}# Text rendering requires font initialization`);
        lines.push(`${indent}font = ${pg}.font.SysFont("${shape.fontFamily}", ${shape.fontSize})`);
        lines.push(`${indent}img = font.render("${shape.text}", True, ${color})`);
        lines.push(`${indent}screen.blit(img, (${Math.round(shape.x)}, ${Math.round(shape.y)}))`);
        break;
    }
  });

  if (fullScript) {
    lines.push('');
    lines.push('    pygame.display.flip()');
    lines.push('    clock.tick(60)');
    lines.push('');
    lines.push('pygame.quit()');
  }

  return lines.join('\n');
};
