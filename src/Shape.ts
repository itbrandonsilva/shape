import Vector2 from 'vector2';

export class ShapeSide {
    points: ShapeCorner[];
    normal: Vector2;
    index: number = null;

    constructor(v1: ShapeCorner, v2: ShapeCorner) {
        this.points = [v1, v2];
        this.normal = v2.clone().subtract(v1).normalize().rotate(-90);
    }
}

export class ShapeCorner extends Vector2 {
    sides: ShapeSide[] = [];
    normal: Vector2 = null;
    index: number = null;

    constructor(x, y) {
        super(x, y);
    }

    shallowClone(): ShapeCorner {
        let v = this.clone();
        let c = new ShapeCorner(v.x, v.y);
        c.normal = this.normal.clone();
        return c;
    }

    generateNormal() {
        let normal = new Vector2(0, 0);
        this.sides.forEach(side => normal.add(side.normal));
        normal.div(2).normalize();
        this.normal = normal;
    }
}

export class Shape {
    points: ShapeCorner[] = [];
    sides: ShapeSide[] = [];
    margin: number;
    scaledFrom: Shape;
    width: number;
    height: number;
    minX: number;
    minY: number;

    constructor(points: Vector2[], public scale: number = 1, public offset: number = 0) {
        let minX;
        let minY;
        let maxX;
        let maxY;

        this.points = points.map((point, idx) => {
            let corner = new ShapeCorner(point.x, point.y);
            corner.index = idx;

            corner.x *= scale;
            corner.y *= scale;

            minX = Math.min(corner.x, minX || corner.x);
            minY = Math.min(corner.y, minY || corner.y);
            maxX = Math.max(corner.x, maxX || corner.x);
            maxY = Math.max(corner.y, maxY || corner.y);

            corner.x += offset;
            corner.y += offset;

            return corner;
        });

        this.width  = maxX - minX;
        this.height = maxY - minY;
        this.minX = minX;
        this.minY = minY;

        this.simplify();
        this.generateSides();
    }

    // Reduce straight edges of multiple segments into single segments
    simplify() {
        let newPoints = [];
        let direction;
        let nextCandidate;

        this.points.push(this.points[0]);
        this.points.forEach((corner, idx) => {
            if (newPoints.length === 0) return newPoints.push(corner);

            let previousCorner = newPoints[newPoints.length-1];
            let newDirection = corner.clone().sub(previousCorner).normalize();

            if (direction && newDirection.eql(direction)) {
                nextCandidate = corner;
            } else {
                if (direction) {
                    newPoints.push(nextCandidate);
                    direction = corner.clone().sub(nextCandidate).normalize();
                } else direction = newDirection;
                nextCandidate = corner;
            }
        });

        this.points = newPoints;
    }

    generateSides() {
        this.sides.length = 0;
        this.points.forEach(point => point.sides.length = 0);

        this.points.forEach((point, idx) => {
            let nextPoint = this.points[ (idx+1)%this.points.length ];
            let side = new ShapeSide(point, nextPoint);

            point.sides.push(side);
            nextPoint.sides.push(side);
            this.sides.push(side);
        });

        this.points.forEach(point => point.generateNormal());
    }

    /* TODO: Update or remove
    inflateShape(margin: number): Shape {
        if (this.scaledFrom) throw new Error('This shape is a result of a previous expansion.');

        let expandedShape = new Shape(this.points.map(corner => {
            //let cloned = _.cloneWith(corner, (value: ShapeCorner, key) => {
            //    if (key === 'normal') return value.clone();
            //    return value;
            //});

            //let cloned = _.clone(corner);
            //cloned.normal = corner.normal.clone();

            let cloned = corner.shallowClone();

            let vector = new Vector2(cloned.x, cloned.y);
            vector.add(cloned.normal.mult(this.scale * margin).clone());

            cloned.x = vector.x;
            cloned.y = vector.y;

            return cloned;
        }));

        expandedShape.scale = this.scale;
        expandedShape.scaledFrom = this;
        expandedShape.margin = margin;

        return expandedShape;
    }
    */
}
