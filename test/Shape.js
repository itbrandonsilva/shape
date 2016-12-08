"use strict";

const shape = require('../build/index.js');
const Shape = shape.Shape;
const Vector2 = require('vector2').default;
const chai = require('chai');
chai.should();


describe('Shape', function () {
    let points;
    beforeEach(function () {
        points = [
            new Vector2(10, 10),
            new Vector2(30, 10),
            new Vector2(30, 30),
            new Vector2(30, 50),
            new Vector2(10, 50),
        ];
    });

    describe('constructor', function () {
        let shape;
        it('can be constructed', function () {
            shape = new Shape(points, 2, 10);
            shape.should.not.be.undefined;
        });
        it('calculates width and height', function () {
            shape.width.should.equal(40);
            shape.height.should.equal(80);
        });
        it('removes redundant verts along straight edges', function () {
            shape.points.length.should.equal(4);
        });
        it('scales then offsets based on params', function () {
            shape.points[0].eql(new Vector2(30, 30)).should.be.true;
        });
    });
});
