"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColorTransform_1 = require("@awayjs/core/lib/geom/ColorTransform");
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleInitialColorState_1 = require("../../animators/states/ParticleInitialColorState");
/**
 *
 */
var ParticleInitialColorNode = (function (_super) {
    __extends(ParticleInitialColorNode, _super);
    function ParticleInitialColorNode(mode, usesMultiplier, usesOffset, initialColor) {
        if (usesMultiplier === void 0) { usesMultiplier = true; }
        if (usesOffset === void 0) { usesOffset = false; }
        if (initialColor === void 0) { initialColor = null; }
        _super.call(this, "ParticleInitialColor", mode, (usesMultiplier && usesOffset) ? 8 : 4, ParticleAnimationSet_1.ParticleAnimationSet.COLOR_PRIORITY);
        this._pStateClass = ParticleInitialColorState_1.ParticleInitialColorState;
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iInitialColor = initialColor || new ColorTransform_1.ColorTransform();
    }
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        if (shader.usesFragmentAnimation) {
            if (this._iUsesMultiplier) {
                var multiplierValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
                animationRegisterData.setRegisterIndex(this, ParticleInitialColorState_1.ParticleInitialColorState.MULTIPLIER_INDEX, multiplierValue.index);
                code += "mul " + animationRegisterData.colorMulTarget + "," + multiplierValue + "," + animationRegisterData.colorMulTarget + "\n";
            }
            if (this._iUsesOffset) {
                var offsetValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) ? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleInitialColorState_1.ParticleInitialColorState.OFFSET_INDEX, offsetValue.index);
                code += "add " + animationRegisterData.colorAddTarget + "," + offsetValue + "," + animationRegisterData.colorAddTarget + "\n";
            }
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        if (this._iUsesMultiplier)
            particleAnimationSet.hasColorMulNode = true;
        if (this._iUsesOffset)
            particleAnimationSet.hasColorAddNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var initialColor = param[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM];
        if (!initialColor)
            throw (new Error("there is no " + ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM + " in param!"));
        var i = 0;
        //multiplier
        if (this._iUsesMultiplier) {
            this._pOneData[i++] = initialColor.redMultiplier;
            this._pOneData[i++] = initialColor.greenMultiplier;
            this._pOneData[i++] = initialColor.blueMultiplier;
            this._pOneData[i++] = initialColor.alphaMultiplier;
        }
        //offset
        if (this._iUsesOffset) {
            this._pOneData[i++] = initialColor.redOffset / 255;
            this._pOneData[i++] = initialColor.greenOffset / 255;
            this._pOneData[i++] = initialColor.blueOffset / 255;
            this._pOneData[i++] = initialColor.alphaOffset / 255;
        }
    };
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
     */
    ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM = "ColorInitialColorTransform";
    return ParticleInitialColorNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleInitialColorNode = ParticleInitialColorNode;
