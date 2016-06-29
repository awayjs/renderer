"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LineElements_1 = require("@awayjs/display/lib/graphics/LineElements");
var DefaultMaterialManager_1 = require("@awayjs/display/lib/managers/DefaultMaterialManager");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
/**
 * @class away.pool.GL_LineSegmentRenderable
 */
var GL_LineSegmentRenderable = (function (_super) {
    __extends(GL_LineSegmentRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param graphic
     * @param level
     * @param dataOffset
     */
    function GL_LineSegmentRenderable(lineSegment, renderer) {
        _super.call(this, lineSegment, renderer);
        this._lineSegment = lineSegment;
    }
    GL_LineSegmentRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._lineSegment = null;
    };
    /**
     * //TODO
     *
     * @returns {base.LineElements}
     * @protected
     */
    GL_LineSegmentRenderable.prototype._pGetElements = function () {
        var elements = GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] || (GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] = new LineElements_1.LineElements());
        var start = this._lineSegment.startPostion;
        var end = this._lineSegment.endPosition;
        var positions = new Float32Array(6);
        var thickness = new Float32Array(1);
        positions[0] = start.x;
        positions[1] = start.y;
        positions[2] = start.z;
        positions[3] = end.x;
        positions[4] = end.y;
        positions[5] = end.z;
        thickness[0] = this._lineSegment.thickness;
        elements.setPositions(positions);
        elements.setThickness(thickness);
        return this._stage.getAbstraction(elements);
    };
    GL_LineSegmentRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._lineSegment.material || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultMaterial(this.renderable));
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubSpriteRenderable}
     * @private
     */
    GL_LineSegmentRenderable.prototype._pGetOverflowRenderable = function (indexOffset) {
        return new GL_LineSegmentRenderable(this.renderable, this._renderer);
    };
    GL_LineSegmentRenderable._lineGraphics = new Object();
    return GL_LineSegmentRenderable;
}(GL_RenderableBase_1.GL_RenderableBase));
exports.GL_LineSegmentRenderable = GL_LineSegmentRenderable;
