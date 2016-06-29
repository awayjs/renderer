"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesBuffer_1 = require("@awayjs/core/lib/attributes/AttributesBuffer");
var TriangleElements_1 = require("@awayjs/display/lib/graphics/TriangleElements");
var DefaultMaterialManager_1 = require("@awayjs/display/lib/managers/DefaultMaterialManager");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
/**
 * @class away.pool.RenderableListItem
 */
var GL_BillboardRenderable = (function (_super) {
    __extends(GL_BillboardRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param billboard
     */
    function GL_BillboardRenderable(billboard, renderer) {
        _super.call(this, billboard, renderer);
        this._billboard = billboard;
    }
    GL_BillboardRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._billboard = null;
    };
    /**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     */
    GL_BillboardRenderable.prototype._pGetElements = function () {
        var texture = this._billboard.material.getTextureAt(0);
        var id = -1;
        if (texture)
            id = ((this.renderable.style ? this.renderable.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultSampler()).id;
        this._id = id;
        var elements = GL_BillboardRenderable._samplerElements[id];
        var width = this._billboard.billboardWidth;
        var height = this._billboard.billboardHeight;
        var billboardRect = this._billboard.billboardRect;
        if (!elements) {
            elements = GL_BillboardRenderable._samplerElements[id] = new TriangleElements_1.TriangleElements(new AttributesBuffer_1.AttributesBuffer(11, 4));
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            elements.setIndices(Array(0, 1, 2, 0, 2, 3));
            elements.setPositions(Array(-billboardRect.x, -billboardRect.y, 0, width - billboardRect.x, -billboardRect.y, 0, width - billboardRect.x, height - billboardRect.y, 0, -billboardRect.x, height - billboardRect.y, 0));
            elements.setNormals(Array(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
            elements.setTangents(Array(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
            elements.setUVs(Array(0, 0, 1, 0, 1, 1, 0, 1));
        }
        else {
            elements.setPositions(Array(-billboardRect.x, -billboardRect.y, 0, width - billboardRect.x, -billboardRect.y, 0, width - billboardRect.x, height - billboardRect.y, 0, -billboardRect.x, height - billboardRect.y, 0));
        }
        return this._stage.getAbstraction(elements);
    };
    GL_BillboardRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._billboard.material || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultMaterial(this.renderable));
    };
    GL_BillboardRenderable._samplerElements = new Object();
    return GL_BillboardRenderable;
}(GL_RenderableBase_1.GL_RenderableBase));
exports.GL_BillboardRenderable = GL_BillboardRenderable;
