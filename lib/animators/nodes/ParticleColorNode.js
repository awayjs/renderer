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
var ParticleColorState_1 = require("../../animators/states/ParticleColorState");
/**
 * A particle animation node used to control the color variation of a particle over time.
 */
var ParticleColorNode = (function (_super) {
    __extends(ParticleColorNode, _super);
    /**
     * Creates a new <code>ParticleColorNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesMultiplier  Defines whether the node uses multiplier data in the shader for its color transformations. Defaults to true.
     * @param    [optional] usesOffset      Defines whether the node uses offset data in the shader for its color transformations. Defaults to true.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the animation independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
     * @param    [optional] startColor      Defines the default start color transform of the node, when in global mode.
     * @param    [optional] endColor        Defines the default end color transform of the node, when in global mode.
     * @param    [optional] cycleDuration   Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    function ParticleColorNode(mode, usesMultiplier, usesOffset, usesCycle, usesPhase, startColor, endColor, cycleDuration, cyclePhase) {
        if (usesMultiplier === void 0) { usesMultiplier = true; }
        if (usesOffset === void 0) { usesOffset = true; }
        if (usesCycle === void 0) { usesCycle = false; }
        if (usesPhase === void 0) { usesPhase = false; }
        if (startColor === void 0) { startColor = null; }
        if (endColor === void 0) { endColor = null; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        _super.call(this, "ParticleColor", mode, (usesMultiplier && usesOffset) ? 16 : 8, ParticleAnimationSet_1.ParticleAnimationSet.COLOR_PRIORITY);
        this._pStateClass = ParticleColorState_1.ParticleColorState;
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iStartColor = startColor || new ColorTransform_1.ColorTransform();
        this._iEndColor = endColor || new ColorTransform_1.ColorTransform();
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
    }
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        if (shader.usesFragmentAnimation) {
            var temp = registerCache.getFreeVertexVectorTemp();
            if (this._iUsesCycle) {
                var cycleConst = registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.ParticleColorState.CYCLE_INDEX, cycleConst.index);
                registerCache.addVertexTempUsages(temp, 1);
                var sin = registerCache.getFreeVertexSingleTemp();
                registerCache.removeVertexTempUsage(temp);
                code += "mul " + sin + "," + animationRegisterData.vertexTime + "," + cycleConst + ".x\n";
                if (this._iUsesPhase)
                    code += "add " + sin + "," + sin + "," + cycleConst + ".y\n";
                code += "sin " + sin + "," + sin + "\n";
            }
            if (this._iUsesMultiplier) {
                var startMultiplierValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
                var deltaMultiplierValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.ParticleColorState.START_MULTIPLIER_INDEX, startMultiplierValue.index);
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.ParticleColorState.DELTA_MULTIPLIER_INDEX, deltaMultiplierValue.index);
                code += "mul " + temp + "," + deltaMultiplierValue + "," + (this._iUsesCycle ? sin : animationRegisterData.vertexLife) + "\n";
                code += "add " + temp + "," + temp + "," + startMultiplierValue + "\n";
                code += "mul " + animationRegisterData.colorMulTarget + "," + temp + "," + animationRegisterData.colorMulTarget + "\n";
            }
            if (this._iUsesOffset) {
                var startOffsetValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) ? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
                var deltaOffsetValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) ? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.ParticleColorState.START_OFFSET_INDEX, startOffsetValue.index);
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.ParticleColorState.DELTA_OFFSET_INDEX, deltaOffsetValue.index);
                code += "mul " + temp + "," + deltaOffsetValue + "," + (this._iUsesCycle ? sin : animationRegisterData.vertexLife) + "\n";
                code += "add " + temp + "," + temp + "," + startOffsetValue + "\n";
                code += "add " + animationRegisterData.colorAddTarget + "," + temp + "," + animationRegisterData.colorAddTarget + "\n";
            }
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        if (this._iUsesMultiplier)
            particleAnimationSet.hasColorMulNode = true;
        if (this._iUsesOffset)
            particleAnimationSet.hasColorAddNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var startColor = param[ParticleColorNode.COLOR_START_COLORTRANSFORM];
        if (!startColor)
            throw (new Error("there is no " + ParticleColorNode.COLOR_START_COLORTRANSFORM + " in param!"));
        var endColor = param[ParticleColorNode.COLOR_END_COLORTRANSFORM];
        if (!endColor)
            throw (new Error("there is no " + ParticleColorNode.COLOR_END_COLORTRANSFORM + " in param!"));
        var i = 0;
        if (!this._iUsesCycle) {
            //multiplier
            if (this._iUsesMultiplier) {
                this._pOneData[i++] = startColor.redMultiplier;
                this._pOneData[i++] = startColor.greenMultiplier;
                this._pOneData[i++] = startColor.blueMultiplier;
                this._pOneData[i++] = startColor.alphaMultiplier;
                this._pOneData[i++] = endColor.redMultiplier - startColor.redMultiplier;
                this._pOneData[i++] = endColor.greenMultiplier - startColor.greenMultiplier;
                this._pOneData[i++] = endColor.blueMultiplier - startColor.blueMultiplier;
                this._pOneData[i++] = endColor.alphaMultiplier - startColor.alphaMultiplier;
            }
            //offset
            if (this._iUsesOffset) {
                this._pOneData[i++] = startColor.redOffset / 255;
                this._pOneData[i++] = startColor.greenOffset / 255;
                this._pOneData[i++] = startColor.blueOffset / 255;
                this._pOneData[i++] = startColor.alphaOffset / 255;
                this._pOneData[i++] = (endColor.redOffset - startColor.redOffset) / 255;
                this._pOneData[i++] = (endColor.greenOffset - startColor.greenOffset) / 255;
                this._pOneData[i++] = (endColor.blueOffset - startColor.blueOffset) / 255;
                this._pOneData[i++] = (endColor.alphaOffset - startColor.alphaOffset) / 255;
            }
        }
        else {
            //multiplier
            if (this._iUsesMultiplier) {
                this._pOneData[i++] = (startColor.redMultiplier + endColor.redMultiplier) / 2;
                this._pOneData[i++] = (startColor.greenMultiplier + endColor.greenMultiplier) / 2;
                this._pOneData[i++] = (startColor.blueMultiplier + endColor.blueMultiplier) / 2;
                this._pOneData[i++] = (startColor.alphaMultiplier + endColor.alphaMultiplier) / 2;
                this._pOneData[i++] = (startColor.redMultiplier - endColor.redMultiplier) / 2;
                this._pOneData[i++] = (startColor.greenMultiplier - endColor.greenMultiplier) / 2;
                this._pOneData[i++] = (startColor.blueMultiplier - endColor.blueMultiplier) / 2;
                this._pOneData[i++] = (startColor.alphaMultiplier - endColor.alphaMultiplier) / 2;
            }
            //offset
            if (this._iUsesOffset) {
                this._pOneData[i++] = (startColor.redOffset + endColor.redOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.greenOffset + endColor.greenOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.blueOffset + endColor.blueOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.alphaOffset + endColor.alphaOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.redOffset - endColor.redOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.greenOffset - endColor.greenOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.blueOffset - endColor.blueOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.alphaOffset - endColor.alphaOffset) / (255 * 2);
            }
        }
    };
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the start color transform applied to the particle.
     */
    ParticleColorNode.COLOR_START_COLORTRANSFORM = "ColorStartColorTransform";
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the end color transform applied to the particle.
     */
    ParticleColorNode.COLOR_END_COLORTRANSFORM = "ColorEndColorTransform";
    return ParticleColorNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleColorNode = ParticleColorNode;
