"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GL_SurfacePassBase_1 = require("../surfaces/GL_SurfacePassBase");
var ShaderBase_1 = require("../shaders/ShaderBase");
/**
 * DistanceRender is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
var GL_DistanceSurface = (function (_super) {
    __extends(GL_DistanceSurface, _super);
    /**
     * Creates a new DistanceRender object.
     *
     * @param material The material to which this pass belongs.
     */
    function GL_DistanceSurface(surface, elementsClass, renderPool) {
        _super.call(this, surface, elementsClass, renderPool);
        this._shader = new ShaderBase_1.ShaderBase(elementsClass, this, this._stage);
        this._pAddPass(this);
    }
    GL_DistanceSurface.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._surface.getTextureAt(0) ? this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
    };
    /**
     * Initializes the unchanging constant data for this material.
     */
    GL_DistanceSurface.prototype._iInitConstantData = function (shader) {
        _super.prototype._iInitConstantData.call(this, shader);
        var index = this._fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index + 4] = 1.0 / 255.0;
        data[index + 5] = 1.0 / 255.0;
        data[index + 6] = 1.0 / 255.0;
        data[index + 7] = 0.0;
    };
    GL_DistanceSurface.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.projectionDependencies++;
        shader.viewDirDependencies++;
        if (shader.alphaThreshold > 0)
            shader.uvDependencies++;
        if (shader.viewDirDependencies > 0)
            shader.globalPosDependencies++;
    };
    /**
     * @inheritDoc
     */
    GL_DistanceSurface.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code;
        var targetReg = sharedRegisters.shadedTarget;
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // squared distance to view
        code = "dp3 " + temp1 + ".z, " + sharedRegisters.viewDirVarying + ".xyz, " + sharedRegisters.viewDirVarying + ".xyz\n" +
            "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
            "frc " + temp1 + ", " + temp1 + "\n" +
            "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        if (this._textureVO && shader.alphaThreshold > 0) {
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
                "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    GL_DistanceSurface.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        var f = camera.projection.far;
        f = 1 / (2 * f * f);
        // sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
        var index = this._fragmentConstantsIndex;
        var data = this._shader.fragmentConstantData;
        data[index] = 1.0 * f;
        data[index + 1] = 255.0 * f;
        data[index + 2] = 65025.0 * f;
        data[index + 3] = 16581375.0 * f;
        if (this._textureVO && this._shader.alphaThreshold > 0) {
            this._textureVO.activate(this);
            data[index + 8] = this._shader.alphaThreshold;
        }
    };
    return GL_DistanceSurface;
}(GL_SurfacePassBase_1.GL_SurfacePassBase));
exports.GL_DistanceSurface = GL_DistanceSurface;
