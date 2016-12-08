import Vector2 from 'vector2';
import { Shape } from './Shape';

interface Edge {
    processed?: boolean;
}

export interface IAExtractShapesFrom2d {
    map: Array<Cell>;
    isCellSolid: (cell: Cell) => boolean;
    width: number;
    offset?: number;
    scale?: number;
}

// tiles: Array<Cell>, isCellSolid: (cell: Cell) => boolean, width: number, offset: number = 0, scale: number = 1

export type Cell = any;

/**
  * Houses static utility methods that utilize the `Shape` class.
  */
export class ShapeUtils {
    /**
      * `map` is expected to be a linear array of `Cell`s representing a 2d grid of aligned squares. `Cell` evaluates to type `any`. Returns an array of extracted `Shape`s.
      */
    static extractShapesFrom2d(args: IAExtractShapesFrom2d): Array<Shape> {
        const map = args.map;
        const isCellSolid = args.isCellSolid;
        const width = args.width;
        const height = map.length/width;
        const offset = args.offset || 0;
        const scale = args.scale || 1;

        let hEdges: Array<Array<Edge>> = [];
        let vEdges: Array<Array<Edge>> = [];
        for (let i = 0; i < height+1; ++i) {
            hEdges.push([]);
            if (i < height) vEdges.push([]);
        }

        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                let isSolid = isCellSolid(map[y*width+x]);
                if ( isSolid ) continue;

                // top
                if ( isCellSolid(map[(y-1)*width+x]) ) hEdges[y][x] = {};
                // bottom
                if ( isCellSolid(map[(y+1)*width+x]) ) hEdges[y+1][x] = {};
                // left
                if ( isCellSolid(map[y*width+(x-1)]) ) vEdges[y][x] = {};
                // right 
                if ( isCellSolid(map[y*width+(x+1)]) ) vEdges[y][x+1] = {};
            }
        }

        function trace(corners: Array<Vector2>): void {
            let next = corners[corners.length-1];
            let previous = corners[corners.length-2] || next.clone().subtract(new Vector2(1, 0));
            let direction = next.clone().subtract(previous).flip().rotate90C();

            let row;
            let edge;
            let anglesSearched = 0;
            while (anglesSearched < 4) {
                if (direction.x) {
                    row = hEdges[next.y];
                    if ( ! row ) { anglesSearched++; direction.rotate90C(); continue; }
                    edge = row[next.x + Math.min(0, direction.x)];
                    if (edge && !edge.processed) { corners.push(new Vector2(next.x+direction.x, next.y)); edge.processed = true; return trace(corners); }
                    else { anglesSearched++; direction.rotate90C(); continue; }
                } else {
                    row = vEdges[next.y + Math.min(0, direction.y)];
                    if ( ! row ) { anglesSearched++; direction.rotate90C(); continue; }
                    edge = row[next.x];
                    if (edge && !edge.processed) { corners.push(new Vector2(next.x, next.y+direction.y)); edge.processed = true; return trace(corners); }
                    else { anglesSearched++; direction.rotate90C(); continue; }
                }
            }
        }


        let finalShapes: Array<Shape> = [];

        for (let y = 0; y < height-1; ++y) {
            for (let x = 0; x < width; ++x) {
                let vEdge = vEdges[y][x];
                if (vEdge && !vEdge.processed) {
                    let corners: Array<Vector2> = [];
                    corners.push(new Vector2(x, y));
                    trace(corners);
                    let shape = new Shape(corners, scale, offset);
                    finalShapes.push(shape);
                }
            }
        }

        return finalShapes;
    }
}
