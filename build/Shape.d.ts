import Vector2 from 'vector2';
export declare class ShapeSide {
    points: ShapeCorner[];
    normal: Vector2;
    index: number;
    constructor(v1: ShapeCorner, v2: ShapeCorner);
}
export declare class ShapeCorner extends Vector2 {
    sides: ShapeSide[];
    normal: Vector2;
    index: number;
    constructor(x: any, y: any);
    shallowClone(): ShapeCorner;
    generateNormal(): void;
}
export declare class Shape {
    scale: number;
    offset: number;
    points: ShapeCorner[];
    sides: ShapeSide[];
    margin: number;
    scaledFrom: Shape;
    width: number;
    height: number;
    minX: number;
    minY: number;
    constructor(points: Vector2[], scale?: number, offset?: number);
    simplify(): void;
    generateSides(): void;
}
