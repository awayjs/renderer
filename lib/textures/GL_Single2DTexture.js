"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MappingMode_1 = require("@awayjs/display/lib/textures/MappingMode");
var GL_TextureBase_1 = require("../textures/GL_TextureBase");
/**
 *
 * @class away.pool.GL_Single2DTexture
 */
var GL_Single2DTexture = (function (_super) {
    __extends(GL_Single2DTexture, _super);
    function GL_Single2DTexture(single2DTexture, shader) {
        _super.call(this, single2DTexture, shader);
        this._single2DTexture = single2DTexture;
    }
    GL_Single2DTexture.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._single2DTexture = null;
    };
    /**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The uv coordinate vector with which to sample the texture map.
     * @returns {string}
     * @private
     */
    GL_Single2DTexture.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        var code = "";
        var wrap = "wrap";
        var format = ""; //this.getFormatString(this._single2DTexture.image2D);
        var filter = "linear,miplinear";
        var temp;
        //modify depending on mapping mode
        if (this._single2DTexture.mappingMode == MappingMode_1.MappingMode.RADIAL_GRADIENT) {
            temp = regCache.getFreeFragmentVectorTemp();
            code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
            code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
            code += "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n";
            code += "sub " + temp + ".y, " + temp + ".y, " + temp + ".y\n";
            code += "sqt " + temp + ".x, " + temp + ".x, " + temp + ".x\n";
            inputReg = temp;
        }
        //handles texture atlasing
        if (this._shader.useImageRect) {
            var samplerReg = regCache.getFreeFragmentConstant();
            this._samplerIndex = samplerReg.index * 4;
            temp = regCache.getFreeFragmentVectorTemp();
            code += "mul " + temp + ", " + inputReg + ", " + samplerReg + ".xy\n";
            code += "add " + temp + ", " + temp + ", " + samplerReg + ".zw\n";
            inputReg = temp;
        }
        this._imageIndex = this._shader.getImageIndex(this._single2DTexture, 0);
        var textureReg = this.getTextureReg(this._imageIndex, regCache, sharedReg);
        this._textureIndex = textureReg.index;
        code += "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <2d," + filter + "," + format + wrap + ">\n";
        return code;
    };
    GL_Single2DTexture.prototype.activate = function (render) {
        var sampler = render.samplers[this._imageIndex];
        sampler.activate(this._textureIndex);
        var image = render.images[this._imageIndex];
        image.activate(this._textureIndex, sampler._sampler.mipmap);
        if (this._shader.useImageRect) {
            var index = this._samplerIndex;
            var data = this._shader.fragmentConstantData;
            if (!sampler._sampler.imageRect) {
                data[index] = 1;
                data[index + 1] = 1;
                data[index + 2] = 0;
                data[index + 3] = 0;
            }
            else {
                data[index] = sampler._sampler.imageRect.width;
                data[index + 1] = sampler._sampler.imageRect.height;
                data[index + 2] = sampler._sampler.imageRect.x;
                data[index + 3] = sampler._sampler.imageRect.y;
            }
        }
    };
    GL_Single2DTexture.prototype._setRenderState = function (renderable) {
        var sampler = renderable.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        var image = renderable.images[this._imageIndex];
        if (image)
            image.activate(this._textureIndex, sampler._sampler.mipmap);
        if (this._shader.useImageRect && sampler) {
            var index = this._samplerIndex;
            var data = this._shader.fragmentConstantData;
            if (!sampler._sampler.imageRect) {
                data[index] = 1;
                data[index + 1] = 1;
                data[index + 2] = 0;
                data[index + 3] = 0;
            }
            else {
                data[index] = sampler._sampler.imageRect.width;
                data[index + 1] = sampler._sampler.imageRect.height;
                data[index + 2] = sampler._sampler.imageRect.x;
                data[index + 3] = sampler._sampler.imageRect.y;
            }
        }
    };
    return GL_Single2DTexture;
}(GL_TextureBase_1.GL_TextureBase));
exports.GL_Single2DTexture = GL_Single2DTexture;
