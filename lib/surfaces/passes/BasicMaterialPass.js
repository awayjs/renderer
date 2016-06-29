"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var ShaderBase_1 = require("../../shaders/ShaderBase");
var PassBase_1 = require("../../surfaces/passes/PassBase");
/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var BasicMaterialPass = (function (_super) {
    __extends(BasicMaterialPass, _super);
    function BasicMaterialPass(render, surface, elementsClass, stage) {
        _super.call(this, render, surface, elementsClass, stage);
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._diffuseA = 1;
        this._shader = new ShaderBase_1.ShaderBase(elementsClass, this, this._stage);
        this.invalidate();
    }
    BasicMaterialPass.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        if (this._textureVO != null)
            shader.uvDependencies++;
    };
    BasicMaterialPass.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._surface.getTextureAt(0) ? this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
    };
    BasicMaterialPass.prototype.dispose = function () {
        if (this._textureVO) {
            this._textureVO.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._surface.getTextureAt(0)));
            this._textureVO = null;
        }
        _super.prototype.dispose.call(this);
    };
    /**
     * @inheritDoc
     */
    BasicMaterialPass.prototype._iGetFragmentCode = function (shader, regCache, sharedReg) {
        var code = "";
        var alphaReg;
        if (this.preserveAlpha) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }
        var targetReg = sharedReg.shadedTarget;
        if (this._textureVO != null) {
            code += this._textureVO._iGetFragmentCode(targetReg, regCache, sharedReg, sharedReg.uvVarying);
            if (shader.alphaThreshold > 0) {
                var cutOffReg = regCache.getFreeFragmentConstant();
                this._fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else if (shader.colorBufferIndex != -1) {
            code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
        }
        else {
            var diffuseInputReg = regCache.getFreeFragmentConstant();
            this._fragmentConstantsIndex = diffuseInputReg.index * 4;
            code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
        }
        if (this.preserveAlpha) {
            code += "mul " + sharedReg.shadedTarget + ".w, " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }
        return code;
    };
    BasicMaterialPass.prototype._setRenderState = function (renderable, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, camera, viewProjection);
        if (this._textureVO != null)
            this._textureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    BasicMaterialPass.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        if (this._textureVO != null) {
            this._textureVO.activate(this._render);
            if (this._shader.alphaThreshold > 0)
                this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
        }
        else if (this._shader.colorBufferIndex == -1) {
            var index = this._fragmentConstantsIndex;
            var data = this._shader.fragmentConstantData;
            data[index] = this._diffuseR;
            data[index + 1] = this._diffuseG;
            data[index + 2] = this._diffuseB;
            data[index + 3] = this._diffuseA;
        }
    };
    return BasicMaterialPass;
}(PassBase_1.PassBase));
exports.BasicMaterialPass = BasicMaterialPass;
