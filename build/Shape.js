"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vector2_1 = require('vector2');
var ShapeSide = (function () {
    function ShapeSide(v1, v2) {
        this.index = null;
        this.points = [v1, v2];
        this.normal = v2.clone().subtract(v1).normalize().rotate(-90);
    }
    return ShapeSide;
}());
exports.ShapeSide = ShapeSide;
var ShapeCorner = (function (_super) {
    __extends(ShapeCorner, _super);
    function ShapeCorner(x, y) {
        _super.call(this, x, y);
        this.sides = [];
        this.normal = null;
        this.index = null;
    }
    ShapeCorner.prototype.shallowClone = function () {
        var v = this.clone();
        var c = new ShapeCorner(v.x, v.y);
        c.normal = this.normal.clone();
        return c;
    };
    ShapeCorner.prototype.generateNormal = function () {
        var normal = new vector2_1.default(0, 0);
        this.sides.forEach(function (side) { return normal.add(side.normal); });
        normal.div(2).normalize();
        this.normal = normal;
    };
    return ShapeCorner;
}(vector2_1.default));
exports.ShapeCorner = ShapeCorner;
var Shape = (function () {
    function Shape(points, scale, offset) {
        if (scale === void 0) { scale = 1; }
        if (offset === void 0) { offset = 0; }
        this.scale = scale;
        this.offset = offset;
        this.points = [];
        this.sides = [];
        var minX;
        var minY;
        var maxX;
        var maxY;
        this.points = points.map(function (point, idx) {
            var corner = new ShapeCorner(point.x, point.y);
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
        this.width = maxX - minX;
        this.height = maxY - minY;
        this.minX = minX;
        this.minY = minY;
        this.simplify();
        this.generateSides();
    }
    // Reduce straight edges of multiple segments into single segments
    Shape.prototype.simplify = function () {
        var newPoints = [];
        var direction;
        var nextCandidate;
        this.points.push(this.points[0]);
        this.points.forEach(function (corner, idx) {
            if (newPoints.length === 0)
                return newPoints.push(corner);
            var previousCorner = newPoints[newPoints.length - 1];
            var newDirection = corner.clone().sub(previousCorner).normalize();
            if (direction && newDirection.eql(direction)) {
                nextCandidate = corner;
            }
            else {
                if (direction) {
                    newPoints.push(nextCandidate);
                    direction = corner.clone().sub(nextCandidate).normalize();
                }
                else
                    direction = newDirection;
                nextCandidate = corner;
            }
        });
        this.points = newPoints;
    };
    Shape.prototype.generateSides = function () {
        var _this = this;
        this.sides.length = 0;
        this.points.forEach(function (point) { return point.sides.length = 0; });
        this.points.forEach(function (point, idx) {
            var nextPoint = _this.points[(idx + 1) % _this.points.length];
            var side = new ShapeSide(point, nextPoint);
            point.sides.push(side);
            nextPoint.sides.push(side);
            _this.sides.push(side);
        });
        this.points.forEach(function (point) { return point.generateNormal(); });
    };
    return Shape;
}());
exports.Shape = Shape;
