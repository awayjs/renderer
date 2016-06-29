"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("@awayjs/core/lib/errors/AbstractMethodError");
var AbstractionBase_1 = require("@awayjs/core/lib/library/AbstractionBase");
var ContextGLTextureFormat_1 = require("@awayjs/stage/lib/base/ContextGLTextureFormat");
/**
 *
 * @class away.pool.GL_TextureBaseBase
 */
var GL_TextureBase = (function (_super) {
    __extends(GL_TextureBase, _super);
    function GL_TextureBase(texture, shader) {
        _super.call(this, texture, shader);
        this._texture = texture;
        this._shader = shader;
        this._stage = shader._stage;
    }
    /**
     *
     */
    GL_TextureBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._texture = null;
        this._shader = null;
        this._stage = null;
    };
    GL_TextureBase.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        if (inputReg === void 0) { inputReg = null; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    GL_TextureBase.prototype._setRenderState = function (renderable) {
        //overidden for state logic
    };
    GL_TextureBase.prototype.activate = function (render) {
        //overridden for activation logic
    };
    GL_TextureBase.prototype.getTextureReg = function (imageIndex, regCache, sharedReg) {
        var index = this._shader.imageIndices.indexOf(imageIndex); //todo: collapse the index based on duplicate image objects to save registrations
        if (index == -1) {
            var textureReg = regCache.getFreeTextureReg();
            sharedReg.textures.push(textureReg);
            this._shader.imageIndices.push(imageIndex);
            return textureReg;
        }
        return sharedReg.textures[index];
    };
    GL_TextureBase.prototype.getFormatString = function (image) {
        switch (image.format) {
            case ContextGLTextureFormat_1.ContextGLTextureFormat.COMPRESSED:
                return "dxt1,";
            case ContextGLTextureFormat_1.ContextGLTextureFormat.COMPRESSED_ALPHA:
                return "dxt5,";
            default:
                return "";
        }
    };
    return GL_TextureBase;
}(AbstractionBase_1.AbstractionBase));
exports.GL_TextureBase = GL_TextureBase;
