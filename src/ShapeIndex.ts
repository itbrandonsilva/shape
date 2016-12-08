import { Shape, ShapeCorner, ShapeSide } from './Shape';
import Vector2 from 'vector2';

export type ShapeIndexCell = {
    points: ShapeCorner[];
    sides: ShapeSide[];
    index: number;
    center: Vector2;
};

export type ShapeIndexOpts = {
    offset?: Vector2;
};

export class ShapeIndex {
    index: ShapeIndexCell[] = [];
    width: number;
    height: number;
    offset: Vector2;

    indexOffsetX: number;
    indexOffsetY: number;

    constructor(public shape: Shape, public sample: number, opts: ShapeIndexOpts = {}) {
        this.offset = opts.offset || new Vector2(0, 0);
        this.buildIndex();
    }

    rebuildIndex() {
        this.buildIndex();
    }

    _createEmptyCell(index: number, center: Vector2): ShapeIndexCell {
        return {points: [], sides: [], index, center};
    }

    buildIndex() {
        this.index.length = 0;

        this.indexOffsetX = -this.shape.minX;
        this.indexOffsetY = -this.shape.minY;

        this.width  = Math.ceil((this.shape.width + this.offset.x)/this.sample)+1;
        this.height = Math.ceil((this.shape.height + this.offset.y)/this.sample)+1;

        let index = 0;
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.index.push(this._createEmptyCell(index++, new Vector2(this.shape.minX + (this.sample * x) + this.sample/2, this.shape.minY + (this.sample * y) + this.sample/2)));
            }
        }

        this.shape.points.forEach(point => {
            let v = new Vector2(point.x + this.offset.x, point.y + this.offset.y);
            let cell = this.getCellAt(v);
            cell.points.push(point);
        });

        this.shape.sides.forEach(side => {
            side.points.forEach(point => {
                let cell = this.getCellAt(point);
                cell.sides.push(side);
            });
        });
    }

    getIndexOfCell(v: Vector2): number {
        let x = Math.floor((v.x + this.indexOffsetX)/this.sample);
        let y = Math.floor((v.y + this.indexOffsetY)/this.sample);
        return (this.width*y)+x;
    }

    getCellAt(v: Vector2): ShapeIndexCell {
        return this.index[this.getIndexOfCell(v)];
    }

    /* TODO: Needs to be updated
    clipSegment(v1: Vector2, v2: Vector2, tolerance: number = 0) {
        [v1, v2].forEach(v => {
            if (v.x < 0) {
                let intersection = Vector2.segmentsIntersection(v1, v2, new Vector2(0, 0), new Vector2(0, this.shape.height));
                if (intersection) v.read(intersection);
            } else if (v.x > this.width) {
                let intersection = Vector2.segmentsIntersection(v1, v2, new Vector2(this.shape.width, 0), new Vector2(this.shape.width, this.shape.height));
                if (intersection) v.read(intersection);
            }

            if (v.y < 0) {
                let intersection = Vector2.segmentsIntersection(v1, v2, new Vector2(0, 0), new Vector2(this.shape.width, 0));
                if (intersection) v.read(intersection);
            } else if (v.y > this.height) {
                let intersection = Vector2.segmentsIntersection(v1, v2, new Vector2(0, this.shape.height), new Vector2(this.shape.width, this.shape.height));
                if (intersection) v.read(intersection);
            }
        });
    }
    */
}
