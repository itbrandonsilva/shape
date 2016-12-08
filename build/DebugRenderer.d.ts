import { ShapeSide, ShapeIndex } from './index';
import Vector2 from 'vector2';
export declare class DebugRenderer {
    shapeIndex: ShapeIndex;
    element: any;
    scale: number;
    ctx: any;
    sample: number;
    constructor(shapeIndex: ShapeIndex, element: any, scale?: number);
    clear(): void;
    draw(): void;
    drawLookup(v: Vector2, color?: string): void;
    drawSide(side: ShapeSide, color?: string): void;
}
