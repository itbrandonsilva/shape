"use strict";
var vector2_1 = require('vector2');
var ShapeIndex = (function () {
    function ShapeIndex(shape, sample, opts) {
        if (opts === void 0) { opts = {}; }
        this.shape = shape;
        this.sample = sample;
        this.index = [];
        this.offset = opts.offset || new vector2_1.default(0, 0);
        this.buildIndex();
    }
    ShapeIndex.prototype.rebuildIndex = function () {
        this.buildIndex();
    };
    ShapeIndex.prototype._createEmptyCell = function (index, center) {
        return { points: [], sides: [], index: index, center: center };
    };
    ShapeIndex.prototype.buildIndex = function () {
        var _this = this;
        this.index.length = 0;
        this.indexOffsetX = -this.shape.minX;
        this.indexOffsetY = -this.shape.minY;
        this.width = Math.ceil((this.shape.width + this.offset.x) / this.sample) + 1;
        this.height = Math.ceil((this.shape.height + this.offset.y) / this.sample) + 1;
        var index = 0;
        for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
                this.index.push(this._createEmptyCell(index++, new vector2_1.default(this.shape.minX + (this.sample * x) + this.sample / 2, this.shape.minY + (this.sample * y) + this.sample / 2)));
            }
        }
        this.shape.points.forEach(function (point) {
            var v = new vector2_1.default(point.x + _this.offset.x, point.y + _this.offset.y);
            var cell = _this.getCellAt(v);
            cell.points.push(point);
        });
        this.shape.sides.forEach(function (side) {
            side.points.forEach(function (point) {
                var cell = _this.getCellAt(point);
                cell.sides.push(side);
            });
        });
    };
    ShapeIndex.prototype.getIndexOfCell = function (v) {
        var x = Math.floor((v.x + this.indexOffsetX) / this.sample);
        var y = Math.floor((v.y + this.indexOffsetY) / this.sample);
        return (this.width * y) + x;
    };
    ShapeIndex.prototype.getCellAt = function (v) {
        return this.index[this.getIndexOfCell(v)];
    };
    return ShapeIndex;
}());
exports.ShapeIndex = ShapeIndex;
