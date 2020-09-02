import { Point } from 'pixi.js';

export function randomPointInCircle(radius: number, cx = 0, cy = 0): Point {
    const randomR = radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const x = cx + randomR * Math.cos(theta);
    const y = cy + randomR * Math.sin(theta);
    return new Point(x, y);
}

export function distance(p0: Point, p1: Point): number {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
}
