"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var BlendMode_1 = require("@awayjs/core/lib/image/BlendMode");
var ContextGLCompareMode_1 = require("@awayjs/stage/lib/base/ContextGLCompareMode");
var GL_SurfacePassBase_1 = require("../surfaces/GL_SurfacePassBase");
var ShaderBase_1 = require("../shaders/ShaderBase");
/**
 * GL_SkyboxSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var GL_SkyboxSurface = (function (_super) {
    __extends(GL_SkyboxSurface, _super);
    function GL_SkyboxSurface(skybox, elementsClass, renderPool) {
        _super.call(this, skybox, elementsClass, renderPool);
        this._skybox = skybox;
        this._shader = new ShaderBase_1.ShaderBase(elementsClass, this, this._stage);
        this._texture = this._shader.getAbstraction(this._skybox.texture);
        this._pAddPass(this);
    }
    GL_SkyboxSurface.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._texture.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._skybox.texture));
        this._texture = null;
        this._skybox = null;
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxSurface.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this._pRequiresBlending = (this._surface.blendMode != BlendMode_1.BlendMode.NORMAL);
        this.shader.setBlendMode((this._surface.blendMode == BlendMode_1.BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode_1.BlendMode.LAYER : this._surface.blendMode);
    };
    GL_SkyboxSurface.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.usesPositionFragment = true;
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxSurface.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return this._texture._iGetFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters, sharedRegisters.positionVarying);
    };
    GL_SkyboxSurface.prototype._setRenderState = function (renderable, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, camera, viewProjection);
        this._texture._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxSurface.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        this._stage.context.setDepthTest(false, ContextGLCompareMode_1.ContextGLCompareMode.LESS);
        this._texture.activate(this);
    };
    return GL_SkyboxSurface;
}(GL_SurfacePassBase_1.GL_SurfacePassBase));
exports.GL_SkyboxSurface = GL_SkyboxSurface;
