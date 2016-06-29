"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesBuffer_1 = require("@awayjs/core/lib/attributes/AttributesBuffer");
var TriangleElements_1 = require("@awayjs/display/lib/graphics/TriangleElements");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
var GL_SkyboxElements_1 = require("../elements/GL_SkyboxElements");
/**
 * @class away.pool.GL_SkyboxRenderable
 */
var GL_SkyboxRenderable = (function (_super) {
    __extends(GL_SkyboxRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param skybox
     */
    function GL_SkyboxRenderable(skybox, renderer) {
        _super.call(this, skybox, renderer);
        this._skybox = skybox;
    }
    /**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     * @private
     */
    GL_SkyboxRenderable.prototype._pGetElements = function () {
        var elementsGL = GL_SkyboxRenderable._elementsGL;
        if (!elementsGL) {
            var elements = new TriangleElements_1.TriangleElements(new AttributesBuffer_1.AttributesBuffer(11, 4));
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            elements.setIndices(Array(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
            elements.setPositions(Array(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
            elementsGL = GL_SkyboxRenderable._elementsGL = new GL_SkyboxElements_1.GL_SkyboxElements(elements, this._stage);
        }
        return elementsGL;
    };
    GL_SkyboxRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._skybox);
    };
    GL_SkyboxRenderable._iIncludeDependencies = function (shader) {
    };
    return GL_SkyboxRenderable;
}(GL_RenderableBase_1.GL_RenderableBase));
exports.GL_SkyboxRenderable = GL_SkyboxRenderable;
