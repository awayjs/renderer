"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GL_SurfacePassBase_1 = require("../surfaces/GL_SurfacePassBase");
var ShaderBase_1 = require("../shaders/ShaderBase");
/**
 * GL_DepthSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var GL_DepthSurface = (function (_super) {
    __extends(GL_DepthSurface, _super);
    /**
     *
     * @param pool
     * @param surface
     * @param elementsClass
     * @param stage
     */
    function GL_DepthSurface(surface, elementsClass, renderPool) {
        _super.call(this, surface, elementsClass, renderPool);
        this._shader = new ShaderBase_1.ShaderBase(elementsClass, this, this._stage);
        this._pAddPass(this);
    }
    GL_DepthSurface.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._surface.getTextureAt(0) ? this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
    };
    GL_DepthSurface.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.projectionDependencies++;
        if (shader.alphaThreshold > 0)
            shader.uvDependencies++;
    };
    GL_DepthSurface.prototype._iInitConstantData = function (shader) {
        _super.prototype._iInitConstantData.call(this, shader);
        var index = this._fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = 1.0;
        data[index + 1] = 255.0;
        data[index + 2] = 65025.0;
        data[index + 3] = 16581375.0;
        data[index + 4] = 1.0 / 255.0;
        data[index + 5] = 1.0 / 255.0;
        data[index + 6] = 1.0 / 255.0;
        data[index + 7] = 0.0;
    };
    /**
     * @inheritDoc
     */
    GL_DepthSurface.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var targetReg = sharedRegisters.shadedTarget;
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        code += "div " + temp1 + ", " + sharedRegisters.projectionFragment + ", " + sharedRegisters.projectionFragment + ".w\n" +
            "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
            "frc " + temp1 + ", " + temp1 + "\n" +
            "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        //codeF += "mov ft1.w, fc1.w	\n" +
        //    "mov ft0.w, fc0.x	\n";
        if (this._textureVO && shader.alphaThreshold > 0) {
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
                "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        registerCache.removeFragmentTempUsage(temp1);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    /**
     * @inheritDoc
     */
    GL_DepthSurface.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        if (this._textureVO && this._shader.alphaThreshold > 0) {
            this._textureVO.activate(this);
            this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = this._shader.alphaThreshold;
        }
    };
    return GL_DepthSurface;
}(GL_SurfacePassBase_1.GL_SurfacePassBase));
exports.GL_DepthSurface = GL_DepthSurface;
