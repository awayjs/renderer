"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("@awayjs/core/lib/errors/AbstractMethodError");
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var AbstractionBase_1 = require("@awayjs/core/lib/library/AbstractionBase");
var RenderableEvent_1 = require("@awayjs/display/lib/events/RenderableEvent");
/**
 * @class RenderableListItem
 */
var GL_RenderableBase = (function (_super) {
    __extends(GL_RenderableBase, _super);
    /**
     *
     * @param renderable
     * @param sourceEntity
     * @param surface
     * @param renderer
     */
    function GL_RenderableBase(renderable, renderer) {
        var _this = this;
        _super.call(this, renderable, renderer);
        this._count = 0;
        this._offset = 0;
        this._elementsDirty = true;
        this._surfaceDirty = true;
        this.images = new Array();
        this.samplers = new Array();
        this._onInvalidateSurfaceDelegate = function (event) { return _this._onInvalidateSurface(event); };
        this._onInvalidateElementsDelegate = function (event) { return _this.onInvalidateElements(event); };
        //store a reference to the pool for later disposal
        this._renderer = renderer;
        this._stage = renderer.stage;
        this.renderable = renderable;
        this.renderable.addEventListener(RenderableEvent_1.RenderableEvent.INVALIDATE_SURFACE, this._onInvalidateSurfaceDelegate);
        this.renderable.addEventListener(RenderableEvent_1.RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
    }
    Object.defineProperty(GL_RenderableBase.prototype, "elementsGL", {
        get: function () {
            if (this._elementsDirty)
                this._updateElements();
            return this._elementsGL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_RenderableBase.prototype, "surfaceGL", {
        get: function () {
            if (this._surfaceDirty)
                this._updateSurface();
            return this._surfaceGL;
        },
        enumerable: true,
        configurable: true
    });
    GL_RenderableBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.next = null;
        this.masksConfig = null;
        this.renderSceneTransform = null;
        this._renderer = null;
        this._stage = null;
        this.sourceEntity = null;
        this.renderable.removeEventListener(RenderableEvent_1.RenderableEvent.INVALIDATE_SURFACE, this._onInvalidateSurfaceDelegate);
        this.renderable.removeEventListener(RenderableEvent_1.RenderableEvent.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.renderable = null;
        this._surfaceGL.usages--;
        if (!this._surfaceGL.usages)
            this._surfaceGL.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._surfaceGL.surface));
        this._surfaceGL = null;
        this._elementsGL = null;
    };
    GL_RenderableBase.prototype.onInvalidateElements = function (event) {
        this._elementsDirty = true;
    };
    GL_RenderableBase.prototype._onInvalidateSurface = function (event) {
        this._surfaceDirty = true;
    };
    GL_RenderableBase.prototype._pGetElements = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    GL_RenderableBase.prototype._pGetSurface = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    GL_RenderableBase.prototype._iRender = function (pass, camera, viewProjection) {
        this._setRenderState(pass, camera, viewProjection);
        this._elementsGL.draw(this, pass.shader, camera, viewProjection, this._count, this._offset);
    };
    GL_RenderableBase.prototype._setRenderState = function (pass, camera, viewProjection) {
        if (this._elementsDirty)
            this._updateElements();
        pass._setRenderState(this, camera, viewProjection);
        if (pass.shader.activeElements != this._elementsGL) {
            pass.shader.activeElements = this._elementsGL;
            this._elementsGL._setRenderState(this, pass.shader, camera, viewProjection);
        }
    };
    /**
     * //TODO
     *
     * @private
     */
    GL_RenderableBase.prototype._updateElements = function () {
        this._elementsGL = this._pGetElements();
        this._elementsDirty = false;
    };
    GL_RenderableBase.prototype._updateSurface = function () {
        var surfaceGL = this._pGetSurface();
        if (this._surfaceGL != surfaceGL) {
            if (this._surfaceGL) {
                this._surfaceGL.usages--;
                //dispose current surfaceGL object
                if (!this._surfaceGL.usages)
                    this._surfaceGL.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._surfaceGL.surface));
            }
            this._surfaceGL = surfaceGL;
            this._surfaceGL.usages++;
        }
        //create a cache of image & sampler objects for the renderable
        var numImages = surfaceGL.numImages;
        this.images.length = numImages;
        this.samplers.length = numImages;
        this.uvMatrix = this.renderable.style ? this.renderable.style.uvMatrix : this._surfaceGL.surface.style ? this._surfaceGL.surface.style.uvMatrix : null;
        var numTextures = this._surfaceGL.surface.getNumTextures();
        var texture;
        var numImages;
        var image;
        var sampler;
        var index;
        for (var i = 0; i < numTextures; i++) {
            texture = this._surfaceGL.surface.getTextureAt(i);
            numImages = texture.getNumImages();
            for (var j = 0; j < numImages; j++) {
                index = surfaceGL.getImageIndex(texture, j);
                image = this.renderable.style ? this.renderable.style.getImageAt(texture, j) : null;
                this.images[index] = image ? this._stage.getAbstraction(image) : null;
                sampler = this.renderable.style ? this.renderable.style.getSamplerAt(texture, j) : null;
                this.samplers[index] = sampler ? this._stage.getAbstraction(sampler) : null;
            }
        }
        this._surfaceDirty = false;
    };
    return GL_RenderableBase;
}(AbstractionBase_1.AbstractionBase));
exports.GL_RenderableBase = GL_RenderableBase;
