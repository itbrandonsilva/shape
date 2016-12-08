"use strict";
var vector2_1 = require('vector2');
var Shape_1 = require('./Shape');
/**
  * Houses static utility methods that utilize the `Shape` class.
  */
var ShapeUtils = (function () {
    function ShapeUtils() {
    }
    /**
      * `map` is expected to be a linear array of `Cell`s representing a 2d grid of aligned squares. `Cell` evaluates to type `any`. Returns an array of extracted `Shape`s.
      */
    ShapeUtils.extractShapesFrom2d = function (args) {
        var map = args.map;
        var isCellSolid = args.isCellSolid;
        var width = args.width;
        var height = map.length / width;
        var offset = args.offset || 0;
        var scale = args.scale || 1;
        var hEdges = [];
        var vEdges = [];
        for (var i = 0; i < height + 1; ++i) {
            hEdges.push([]);
            if (i < height)
                vEdges.push([]);
        }
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                var isSolid = isCellSolid(map[y * width + x]);
                if (isSolid)
                    continue;
                // top
                if (isCellSolid(map[(y - 1) * width + x]))
                    hEdges[y][x] = {};
                // bottom
                if (isCellSolid(map[(y + 1) * width + x]))
                    hEdges[y + 1][x] = {};
                // left
                if (isCellSolid(map[y * width + (x - 1)]))
                    vEdges[y][x] = {};
                // right 
                if (isCellSolid(map[y * width + (x + 1)]))
                    vEdges[y][x + 1] = {};
            }
        }
        function trace(corners) {
            var next = corners[corners.length - 1];
            var previous = corners[corners.length - 2] || next.clone().subtract(new vector2_1.default(1, 0));
            var direction = next.clone().subtract(previous).flip().rotate90C();
            var row;
            var edge;
            var anglesSearched = 0;
            while (anglesSearched < 4) {
                if (direction.x) {
                    row = hEdges[next.y];
                    if (!row) {
                        anglesSearched++;
                        direction.rotate90C();
                        continue;
                    }
                    edge = row[next.x + Math.min(0, direction.x)];
                    if (edge && !edge.processed) {
                        corners.push(new vector2_1.default(next.x + direction.x, next.y));
                        edge.processed = true;
                        return trace(corners);
                    }
                    else {
                        anglesSearched++;
                        direction.rotate90C();
                        continue;
                    }
                }
                else {
                    row = vEdges[next.y + Math.min(0, direction.y)];
                    if (!row) {
                        anglesSearched++;
                        direction.rotate90C();
                        continue;
                    }
                    edge = row[next.x];
                    if (edge && !edge.processed) {
                        corners.push(new vector2_1.default(next.x, next.y + direction.y));
                        edge.processed = true;
                        return trace(corners);
                    }
                    else {
                        anglesSearched++;
                        direction.rotate90C();
                        continue;
                    }
                }
            }
        }
        var finalShapes = [];
        for (var y = 0; y < height - 1; ++y) {
            for (var x = 0; x < width; ++x) {
                var vEdge = vEdges[y][x];
                if (vEdge && !vEdge.processed) {
                    var corners = [];
                    corners.push(new vector2_1.default(x, y));
                    trace(corners);
                    var shape = new Shape_1.Shape(corners, scale, offset);
                    finalShapes.push(shape);
                }
            }
        }
        return finalShapes;
    };
    return ShapeUtils;
}());
exports.ShapeUtils = ShapeUtils;
