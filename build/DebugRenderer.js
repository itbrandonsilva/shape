"use strict";
var vector2_1 = require('vector2');
var GLOBAL_OFFSET = 20;
var DebugRenderer = (function () {
    function DebugRenderer(shapeIndex, element, scale) {
        if (scale === void 0) { scale = 1; }
        this.shapeIndex = shapeIndex;
        this.element = element;
        this.scale = scale;
        this.ctx = element.getContext('2d');
        this.sample = shapeIndex.sample * scale;
    }
    DebugRenderer.prototype.clear = function () {
        this.ctx.fillStyle = '#e1e1e1';
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);
    };
    DebugRenderer.prototype.draw = function () {
        var _this = this;
        var shapeIndex = this.shapeIndex;
        var sample = this.sample;
        this.clear();
        for (var x = 0; x < shapeIndex.width; ++x) {
            for (var y = 0; y < shapeIndex.height; ++y) {
                this.ctx.strokeStyle = 'green';
                this.ctx.strokeRect(GLOBAL_OFFSET + (x * sample), GLOBAL_OFFSET + (y * sample), sample, sample);
            }
        }
        shapeIndex.index.forEach(function (cell) {
            cell.sides.forEach(function (side) { return _this.drawSide(side); });
        });
    };
    DebugRenderer.prototype.drawLookup = function (v, color) {
        var _this = this;
        if (color === void 0) { color = 'yellow'; }
        var si = this.shapeIndex;
        var diffX = v.x - si.shape.minX;
        var diffY = v.y - si.shape.minY;
        var markerX = GLOBAL_OFFSET + ((v.x + si.indexOffsetX) * this.scale);
        var markerY = GLOBAL_OFFSET + ((v.y + si.indexOffsetY) * this.scale);
        this.ctx.beginPath();
        this.ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        var cell = this.shapeIndex.getCellAt(v);
        if (cell)
            cell.sides.forEach(function (side) { return _this.drawSide(side, color); });
    };
    DebugRenderer.prototype.drawSide = function (side, color) {
        if (color === void 0) { color = 'red'; }
        var ctx = this.ctx;
        ctx.strokeStyle = color;
        var si = this.shapeIndex;
        var shape = si.shape;
        var v1 = side.points[0].clone();
        var v2 = side.points[1].clone();
        v1.add(new vector2_1.default(si.offset.x + si.indexOffsetX, si.offset.y + si.indexOffsetY));
        v2.add(new vector2_1.default(si.offset.x + si.indexOffsetX, si.offset.y + si.indexOffsetY));
        ctx.beginPath();
        ctx.moveTo(GLOBAL_OFFSET + (v1.x * this.scale), GLOBAL_OFFSET + (v1.y * this.scale));
        ctx.lineTo(GLOBAL_OFFSET + (v2.x * this.scale), GLOBAL_OFFSET + (v2.y * this.scale));
        ctx.stroke();
    };
    return DebugRenderer;
}());
exports.DebugRenderer = DebugRenderer;
