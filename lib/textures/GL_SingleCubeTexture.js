"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GL_TextureBase_1 = require("../textures/GL_TextureBase");
/**
 *
 * @class away.pool.TextureDataBase
 */
var GL_SingleCubeTexture = (function (_super) {
    __extends(GL_SingleCubeTexture, _super);
    function GL_SingleCubeTexture(singleCubeTexture, shader) {
        _super.call(this, singleCubeTexture, shader);
        this._singleCubeTexture = singleCubeTexture;
    }
    GL_SingleCubeTexture.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._singleCubeTexture = null;
    };
    GL_SingleCubeTexture.prototype._iIncludeDependencies = function (includeInput) {
        if (includeInput === void 0) { includeInput = true; }
        if (includeInput)
            this._shader.usesPositionFragment = true;
    };
    /**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The direction vector with which to sample the cube map.
     * @returns {string}
     * @private
     */
    GL_SingleCubeTexture.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        var format = ""; //this.getFormatString(this._singleCubeTexture.imageCube);
        var filter = "linear,miplinear";
        this._imageIndex = this._shader.getImageIndex(this._singleCubeTexture, 0);
        var textureReg = this.getTextureReg(this._imageIndex, regCache, sharedReg);
        this._textureIndex = textureReg.index;
        return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <cube," + format + filter + ">\n";
    };
    GL_SingleCubeTexture.prototype.activate = function (render) {
        var sampler = render.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        if (render.images[this._imageIndex])
            render.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
    };
    GL_SingleCubeTexture.prototype._setRenderState = function (renderable) {
        var sampler = renderable.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        if (renderable.images[this._imageIndex] && sampler)
            renderable.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
    };
    return GL_SingleCubeTexture;
}(GL_TextureBase_1.GL_TextureBase));
exports.GL_SingleCubeTexture = GL_SingleCubeTexture;
