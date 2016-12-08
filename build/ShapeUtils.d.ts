import { Shape } from './Shape';
export interface IAExtractShapesFrom2d {
    map: Array<Cell>;
    isCellSolid: (cell: Cell) => boolean;
    width: number;
    offset?: number;
    scale?: number;
}
export declare type Cell = any;
/**
  * Houses static utility methods that utilize the `Shape` class.
  */
export declare class ShapeUtils {
    /**
      * `map` is expected to be a linear array of `Cell`s representing a 2d grid of aligned squares. `Cell` evaluates to type `any`. Returns an array of extracted `Shape`s.
      */
    static extractShapesFrom2d(args: IAExtractShapesFrom2d): Array<Shape>;
}
