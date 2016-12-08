import { Shape, ShapeCorner, ShapeSide } from './Shape';
import Vector2 from 'vector2';
export declare type ShapeIndexCell = {
    points: ShapeCorner[];
    sides: ShapeSide[];
    index: number;
    center: Vector2;
};
export declare type ShapeIndexOpts = {
    offset?: Vector2;
};
export declare class ShapeIndex {
    shape: Shape;
    sample: number;
    index: ShapeIndexCell[];
    width: number;
    height: number;
    offset: Vector2;
    indexOffsetX: number;
    indexOffsetY: number;
    constructor(shape: Shape, sample: number, opts?: ShapeIndexOpts);
    rebuildIndex(): void;
    _createEmptyCell(index: number, center: Vector2): ShapeIndexCell;
    buildIndex(): void;
    getIndexOfCell(v: Vector2): number;
    getCellAt(v: Vector2): ShapeIndexCell;
}
