"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DefaultMaterialManager_1 = require("@awayjs/display/lib/managers/DefaultMaterialManager");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
/**
 * @class away.pool.GL_GraphicRenderable
 */
var GL_GraphicRenderable = (function (_super) {
    __extends(GL_GraphicRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param graphic
     * @param level
     * @param indexOffset
     */
    function GL_GraphicRenderable(graphic, renderer) {
        _super.call(this, graphic, renderer);
        this.graphic = graphic;
    }
    GL_GraphicRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.graphic = null;
    };
    /**
     *
     * @returns {ElementsBase}
     * @protected
     */
    GL_GraphicRenderable.prototype._pGetElements = function () {
        this._offset = this.graphic.offset;
        this._count = this.graphic.count;
        return this._stage.getAbstraction((this.renderable.animator) ? this.renderable.animator.getRenderableElements(this, this.graphic.elements) : this.graphic.elements);
    };
    GL_GraphicRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this.graphic.material || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultMaterial(this.renderable));
    };
    return GL_GraphicRenderable;
}(GL_RenderableBase_1.GL_RenderableBase));
exports.GL_GraphicRenderable = GL_GraphicRenderable;
