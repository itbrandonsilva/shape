"use strict";

const shape = require('../build/index.js');
const Shape = shape.Shape;
const ShapeIndex = shape.ShapeIndex;
const Vector2 = require('vector2').default;
const chai = require('chai');
chai.should();

describe('ShapeIndex', function () {
    let shape;
    let points;
    beforeEach(function () {
        points = [
            new Vector2(10, 10),
            new Vector2(30, 10),
            new Vector2(30, 30),
            new Vector2(10, 30),
        ];
        shape = new Shape(points);
    });

    describe('constructor', function () {
        let shapeIndex;
        it('can construct', function () {
            shapeIndex = new ShapeIndex(shape, 20, {offset: new Vector2(10, 10)});
            shapeIndex.should.not.be.undefined;
        });
        it('declares grid width and height', function () {
            shapeIndex.width.should.equal(3);
            shapeIndex.height.should.equal(3);
        });
        it('indexes properly', function () {
            shapeIndex.index.length.should.equal(9);
            shapeIndex.index[0].points[0].eql(points[0]).should.be.true;
            shapeIndex.index[1].points[0].eql(points[1]).should.be.true;
            shapeIndex.index[3].points[0].eql(points[3]).should.be.true;
            shapeIndex.index[4].points[0].eql(points[2]).should.be.true;
        });
        //it('can be queries', function () {
        //    let cell = shapeIndex.getCellAt(new Vector2(7, 7));
        //    cell.points[0].eql(points[0]).should.be.true;
        //});
    });
});
