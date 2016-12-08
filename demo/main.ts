import { Shape, ShapeIndex, DebugRenderer } from '../build/index.js';
import Vector2 from 'vector2';

// Redundant points are removed when the Shape is constructed.
let points = [
    new Vector2(-20, 10),
    new Vector2( 20, 10),
    new Vector2( 30, 10),
    new Vector2( 30, 10),
    new Vector2( 30, 20),
    new Vector2( 30, 30),
    new Vector2( 20, 30),
    new Vector2(-20, 30),
];

let shape = new Shape(points);

let sample = 20;
let offset = new Vector2(10, 10);
let si = new ShapeIndex(shape, sample, {offset});

let canvas = document.getElementById('canvas');
let renderer = new DebugRenderer(si, canvas, 5);
renderer.draw();

let idx = 0;
setInterval(() => {
    renderer.draw();

    if (idx > si.index.length-1) idx = 0;
    let cell = si.index[idx];
    idx++;

    renderer.drawLookup(cell.center);
}, 500);
