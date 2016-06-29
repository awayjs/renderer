"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlendMode_1 = require("@awayjs/core/lib/image/BlendMode");
var BasicMaterialPass_1 = require("../surfaces/passes/BasicMaterialPass");
var GL_SurfaceBase_1 = require("../surfaces/GL_SurfaceBase");
/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var GL_BasicMaterialSurface = (function (_super) {
    __extends(GL_BasicMaterialSurface, _super);
    function GL_BasicMaterialSurface(material, elementsClass, renderPool) {
        _super.call(this, material, elementsClass, renderPool);
        this._material = material;
        this._pAddPass(this._pass = new BasicMaterialPass_1.BasicMaterialPass(this, material, elementsClass, this._stage));
    }
    GL_BasicMaterialSurface.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._material = null;
    };
    /**
     * @inheritDoc
     */
    GL_BasicMaterialSurface.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this._pRequiresBlending = (this._material.blendMode != BlendMode_1.BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
        this._pass.preserveAlpha = this._material.preserveAlpha; //this._pRequiresBlending;
        this._pass.shader.setBlendMode((this._surface.blendMode == BlendMode_1.BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode_1.BlendMode.LAYER : this._material.blendMode);
        //this._pass.forceSeparateMVP = false;
    };
    return GL_BasicMaterialSurface;
}(GL_SurfaceBase_1.GL_SurfaceBase));
exports.GL_BasicMaterialSurface = GL_BasicMaterialSurface;
