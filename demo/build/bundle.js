/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var index_js_1 = __webpack_require__(1);
	var vector2_1 = __webpack_require__(3);
	// Redundant points are removed when the Shape is constructed.
	var points = [
	    new vector2_1.default(-20, 10),
	    new vector2_1.default(20, 10),
	    new vector2_1.default(30, 10),
	    new vector2_1.default(30, 10),
	    new vector2_1.default(30, 20),
	    new vector2_1.default(30, 30),
	    new vector2_1.default(20, 30),
	    new vector2_1.default(-20, 30),
	];
	var shape = new index_js_1.Shape(points);
	var sample = 20;
	var offset = new vector2_1.default(10, 10);
	var si = new index_js_1.ShapeIndex(shape, sample, { offset: offset });
	var canvas = document.getElementById('canvas');
	var renderer = new index_js_1.DebugRenderer(si, canvas, 5);
	renderer.draw();
	var idx = 0;
	setInterval(function () {
	    renderer.draw();
	    if (idx > si.index.length - 1)
	        idx = 0;
	    var cell = si.index[idx];
	    idx++;
	    renderer.drawLookup(cell.center);
	}, 500);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Shape_1 = __webpack_require__(2);
	exports.Shape = Shape_1.Shape;
	exports.ShapeSide = Shape_1.ShapeSide;
	exports.ShapeCorner = Shape_1.ShapeCorner;
	var ShapeIndex_1 = __webpack_require__(4);
	exports.ShapeIndex = ShapeIndex_1.ShapeIndex;
	var ShapeUtils_1 = __webpack_require__(5);
	exports.ShapeUtils = ShapeUtils_1.ShapeUtils;
	var DebugRenderer_1 = __webpack_require__(6);
	exports.DebugRenderer = DebugRenderer_1.DebugRenderer;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var vector2_1 = __webpack_require__(3);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function _frac0(f) {
	    return f % 1;
	}
	function _frac1(f) {
	    return 1 - f + Math.floor(f);
	}
	/**
	  * *Keep in mind that Vector2 is **not an immutable class**. It is also assumed that your **positive y axis points down***.
	  */
	var Vector2 = (function () {
	    function Vector2(x, y) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        this._v = [x, y];
	    }
	    Object.defineProperty(Vector2.prototype, "x", {
	        get: function () {
	            return this._v[0];
	        },
	        set: function (x) { this._v[0] = x; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Vector2.prototype, "y", {
	        get: function () {
	            return this._v[1];
	        },
	        set: function (y) { this._v[1] = y; },
	        enumerable: true,
	        configurable: true
	    });
	    Vector2.prototype.set = function (x, y) {
	        this._v[0] = x;
	        this._v[1] = y;
	        return this;
	    };
	    /**
	      * Read data from another vector into this vector.
	      */
	    Vector2.prototype.read = function (v) {
	        this._v[0] = v.x;
	        this._v[1] = v.y;
	        return this;
	    };
	    /**
	      * Reverse the X and Y values.
	      */
	    Vector2.prototype.reverse = function () {
	        this._v.reverse();
	        return this;
	    };
	    /**
	      * Equivalent to rotating the vector 180 degrees.
	      */
	    Vector2.prototype.flip = function () {
	        this._v[0] = -this._v[0];
	        this._v[1] = -this._v[1];
	        return this;
	    };
	    /**
	      * Create a new vector initialized with the values of this vector.
	      */
	    Vector2.prototype.clone = function () {
	        return new Vector2(this._v[0], this._v[1]);
	    };
	    Vector2.prototype.add = function (vector) {
	        this.addX(vector._v[0]);
	        this.addY(vector._v[1]);
	        return this;
	    };
	    Vector2.prototype.addX = function (x) {
	        this._v[0] += x;
	        return this;
	    };
	    Vector2.prototype.addY = function (y) {
	        this._v[1] += y;
	        return this;
	    };
	    Vector2.prototype.subtract = function (vector) {
	        this._v[0] -= vector._v[0];
	        this._v[1] -= vector._v[1];
	        return this;
	    };
	    /**
	      * Alias for `subtract()`.
	      */
	    Vector2.prototype.sub = function (vector) {
	        return this.subtract(vector);
	    };
	    Vector2.prototype.multiply = function (scale) {
	        this._v[0] *= scale;
	        this._v[1] *= scale;
	        return this;
	    };
	    /**
	      * Alias for `multiply()`.
	      */
	    Vector2.prototype.mul = function (scale) {
	        return this.multiply(scale);
	    };
	    /**
	      * Alias for `multiply()`.
	      */
	    Vector2.prototype.mult = function (scale) {
	        return this.multiply(scale);
	    };
	    Vector2.prototype.divide = function (scale) {
	        this._v[0] /= scale;
	        this._v[1] /= scale;
	        return this;
	    };
	    /**
	      * Alias for `divide()`.
	      */
	    Vector2.prototype.div = function (scale) {
	        return this.divide(scale);
	    };
	    Vector2.prototype.isEqualTo = function (vector) {
	        return (this._v[0] == vector._v[0] && this._v[1] == vector._v[1]);
	    };
	    /**
	      * Alias for `isEqualTo()`.
	      */
	    Vector2.prototype.eql = function (vector) {
	        return this.isEqualTo(vector);
	    };
	    Vector2.prototype.setLength = function (scale) {
	        return this.normalize().multiply(scale);
	    };
	    Vector2.prototype.getLength = function () {
	        return Math.sqrt(Math.pow(this._v[0], 2) + Math.pow(this._v[1], 2));
	    };
	    Vector2.prototype.normalize = function () {
	        return this.div(this.getLength());
	    };
	    Vector2.prototype.distance = function (vector) {
	        return vector.clone().subtract(this).getLength();
	    };
	    Vector2.prototype.angle = function () {
	        return Math.atan2(this._v[0], this._v[1]) * (180 / Math.PI);
	    };
	    Vector2.prototype.round = function () {
	        this._v[0] = Math.round(this._v[0]);
	        this._v[1] = Math.round(this._v[1]);
	        return this;
	    };
	    /**
	      * Rotate the given vector around the origin `[0, 0]`.
	      */
	    Vector2.prototype.rotate = function (degrees, round) {
	        round = round || 1;
	        var theta = (Math.PI / 180) * degrees;
	        var cs = Math.cos(theta);
	        var sn = Math.sin(theta);
	        var px = this._v[0] * cs - this._v[1] * sn;
	        var py = this._v[0] * sn + this._v[1] * cs;
	        this._v[0] = px;
	        this._v[1] = py;
	        return this;
	    };
	    /**
	      * Faster than calling `rotate(90)`.
	      */
	    Vector2.prototype.rotate90 = function () {
	        var ox = this._v[0];
	        this._v[0] = -this._v[1];
	        this._v[1] = ox;
	        return this;
	    };
	    /**
	      * Alias to `rotate90`
	      */
	    Vector2.prototype.rotate90C = function () {
	        return this.rotate90();
	    };
	    /**
	      * Same as `rotate90()` but instead rotates counter-clockwise.
	      */
	    Vector2.prototype.rotate90CC = function () {
	        var ox = this._v[0];
	        this._v[0] = this._v[1];
	        this._v[1] = -ox;
	        return this;
	    };
	    /**
	      * Faster than calling `rotate(180)` or `rotate90()` twice.
	      */
	    Vector2.prototype.rotate180 = function () {
	        return this.flip();
	    };
	    Vector2.prototype.cross = function (v2) {
	        var v1 = this;
	        return v1.x * v2.y - v1.y * v2.x;
	    };
	    Vector2.prototype.vectorTo = function (v) {
	        var vc = v.clone();
	        return vc.subtract(this);
	    };
	    /**
	      * Determine if the point lies within the given rectangle.
	      */
	    Vector2.prototype.inRect = function (topLeft, bottomRight) {
	        return ((this.x >= topLeft.x) && (this.x <= bottomRight.x) && (this.y >= topLeft.y) && (this.y <= bottomRight.y));
	    };
	    /**
	      * Determine if the point lies within the given triangle.
	      */
	    Vector2.prototype.inTriangle = function (v1, v2, v3) {
	        var sign1 = Vector2.areaTriangle(this, v1, v2) < 0;
	        var sign2 = Vector2.areaTriangle(this, v2, v3) < 0;
	        var sign3 = Vector2.areaTriangle(this, v3, v1) < 0;
	        return ((sign1 == sign2) && (sign2 == sign3));
	    };
	    Vector2.prototype.centerBetween = function (v2) {
	        var v1 = this;
	        var center = new Vector2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
	        return center;
	    };
	    /**
	      * Returns a new array `[x, y]`.
	      */
	    Vector2.prototype.toArray = function () {
	        return this._v.slice();
	    };
	    Vector2.prototype.log = function () {
	        console.log(this._v[0], this._v[1]);
	    };
	    /**
	      * Use the 1/2 determinant method to find the area of a triangle.
	      */
	    Vector2.areaTriangle = function (p1, p2, p3) {
	        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
	    };
	    /**
	      * Returns the point of intersection between 2 line segments.
	      * Returns `undefined` if no intersection is found.
	      */
	    Vector2.segmentsIntersection = function (p, p2, q, q2) {
	        // TODO: Perhaps check in advance that points don't overlap on the opposite segment.
	        var r = p2.clone().subtract(p);
	        var s = q2.clone().subtract(q);
	        var uNumerator = q.clone().subtract(p).cross(r);
	        var denominator = r.clone().cross(s);
	        if (uNumerator == 0 && denominator == 0) {
	            // They are collinear
	            return;
	        }
	        if (denominator == 0) {
	            // lines are parallel
	            return;
	        }
	        var t = q.clone().subtract(p).cross(s) / denominator;
	        var u = uNumerator / denominator;
	        if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
	            var intersectionPoint = p.clone().add(r.clone().multiply(t));
	            return intersectionPoint;
	        }
	    };
	    /**
	      * Casts a ray from `v1` towards `v2` in an infinite 2d grid space. Returns an array of grid spaces the ray intersects between `v1` and `v2`.
	      */
	    Vector2.castBetween = function (v1, v2, width) {
	        if (width === void 0) { width = 1; }
	        var cellsCrossed = [];
	        v1 = v1.clone().div(width);
	        v2 = v2.clone().div(width);
	        var tDeltaX, tMaxX;
	        var dx = Math.sign(v2.x - v1.x);
	        if (dx !== 0)
	            tDeltaX = Math.min(dx / (v2.x - v1.x), 10000000);
	        else
	            tDeltaX = 10000000;
	        if (dx >= 0)
	            tMaxX = tDeltaX * _frac1(v1.x);
	        else
	            tMaxX = tDeltaX * _frac0(v1.x);
	        var tDeltaY, tMaxY;
	        var dy = Math.sign(v2.y - v1.y);
	        if (dy !== 0)
	            tDeltaY = Math.min(dy / (v2.y - v1.y), 10000000);
	        else
	            tDeltaY = 10000000;
	        if (dy >= 0)
	            tMaxY = tDeltaY * _frac1(v1.y);
	        else
	            tMaxY = tDeltaY * _frac0(v1.y);
	        var destX = Math.floor(v2.x);
	        var destY = Math.floor(v2.y);
	        var x = v1.x;
	        var y = v1.y;
	        while (true) {
	            var fx = Math.floor(x);
	            var fy = Math.floor(y);
	            cellsCrossed.push(new Vector2(fx, fy));
	            if (destX === fx && destY === fy)
	                break;
	            if (tMaxX < tMaxY) {
	                tMaxX = tMaxX + (tDeltaX);
	                x = x + dx;
	            }
	            else {
	                tMaxY = tMaxY + (tDeltaY);
	                y = y + dy;
	            }
	        }
	        return cellsCrossed;
	    };
	    return Vector2;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Vector2;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vector2_1 = __webpack_require__(3);
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vector2_1 = __webpack_require__(3);
	var Shape_1 = __webpack_require__(2);
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vector2_1 = __webpack_require__(3);
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


/***/ }
/******/ ]);