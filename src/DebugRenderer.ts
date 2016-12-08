import { ShapeSide, ShapeIndex } from './index';
import Vector2 from 'vector2';

const GLOBAL_OFFSET = 20;

export class DebugRenderer {
    ctx: any;
    sample: number;

    constructor(public shapeIndex: ShapeIndex, public element: any, public scale: number = 1) {
        this.ctx = element.getContext('2d');
        this.sample = shapeIndex.sample * scale;
    }

    clear() {
        this.ctx.fillStyle = '#e1e1e1';
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);
    }

    draw() {
        let shapeIndex = this.shapeIndex;
        let sample = this.sample;

        this.clear();
        for (let x = 0; x < shapeIndex.width; ++x) {
            for (let y = 0; y < shapeIndex.height; ++y) {
                this.ctx.strokeStyle = 'green';
                this.ctx.strokeRect(GLOBAL_OFFSET + (x * sample), GLOBAL_OFFSET + (y * sample), sample, sample);
            }
        }

        shapeIndex.index.forEach(cell => {
            cell.sides.forEach(side => this.drawSide(side));
        });
    }

    drawLookup(v: Vector2, color: string = 'yellow') {
        let si = this.shapeIndex;

        let diffX = v.x - si.shape.minX;
        let diffY = v.y - si.shape.minY;

        let markerX = GLOBAL_OFFSET + ((v.x + si.indexOffsetX) * this.scale);
        let markerY = GLOBAL_OFFSET + ((v.y + si.indexOffsetY) * this.scale);

        this.ctx.beginPath();
        this.ctx.arc(markerX, markerY, 5, 0, 2*Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        let cell = this.shapeIndex.getCellAt(v);
        if (cell) cell.sides.forEach(side => this.drawSide(side, color));
    }

    drawSide(side: ShapeSide, color: string = 'red') {
        let ctx = this.ctx;
        ctx.strokeStyle = color;

        let si = this.shapeIndex;
        let shape = si.shape;

        let v1 = side.points[0].clone();
        let v2 = side.points[1].clone();

        v1.add(new Vector2(si.offset.x + si.indexOffsetX, si.offset.y + si.indexOffsetY));
        v2.add(new Vector2(si.offset.x + si.indexOffsetX, si.offset.y + si.indexOffsetY));

        ctx.beginPath();
        ctx.moveTo(GLOBAL_OFFSET + (v1.x * this.scale), GLOBAL_OFFSET + (v1.y * this.scale));
        ctx.lineTo(GLOBAL_OFFSET + (v2.x * this.scale), GLOBAL_OFFSET + (v2.y * this.scale));
        ctx.stroke();
    }
}
