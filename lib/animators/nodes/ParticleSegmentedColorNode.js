"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleSegmentedColorState_1 = require("../../animators/states/ParticleSegmentedColorState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 *
 */
var ParticleSegmentedColorNode = (function (_super) {
    __extends(ParticleSegmentedColorNode, _super);
    function ParticleSegmentedColorNode(usesMultiplier, usesOffset, numSegmentPoint, startColor, endColor, segmentPoints) {
        //because of the stage3d register limitation, it only support the global mode
        _super.call(this, "ParticleSegmentedColor", ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL, 0, ParticleAnimationSet_1.ParticleAnimationSet.COLOR_PRIORITY);
        this._pStateClass = ParticleSegmentedColorState_1.ParticleSegmentedColorState;
        if (numSegmentPoint > 4)
            throw (new Error("the numSegmentPoint must be less or equal 4"));
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iNumSegmentPoint = numSegmentPoint;
        this._iStartColor = startColor;
        this._iEndColor = endColor;
        this._iSegmentPoints = segmentPoints;
    }
    /**
     * @inheritDoc
     */
    ParticleSegmentedColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        if (this._iUsesMultiplier)
            particleAnimationSet.hasColorMulNode = true;
        if (this._iUsesOffset)
            particleAnimationSet.hasColorAddNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleSegmentedColorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        if (shader.usesFragmentAnimation) {
            var accMultiplierColor;
            //var accOffsetColor:ShaderRegisterElement;
            if (this._iUsesMultiplier) {
                accMultiplierColor = registerCache.getFreeVertexVectorTemp();
                registerCache.addVertexTempUsages(accMultiplierColor, 1);
            }
            var tempColor = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(tempColor, 1);
            var temp = registerCache.getFreeVertexVectorTemp();
            var accTime = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 0);
            var tempTime = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 1);
            if (this._iUsesMultiplier)
                registerCache.removeVertexTempUsage(accMultiplierColor);
            registerCache.removeVertexTempUsage(tempColor);
            //for saving all the life values (at most 4)
            var lifeTimeRegister = registerCache.getFreeVertexConstant();
            animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState_1.ParticleSegmentedColorState.TIME_DATA_INDEX, lifeTimeRegister.index);
            var i;
            var startMulValue;
            var deltaMulValues;
            if (this._iUsesMultiplier) {
                startMulValue = registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState_1.ParticleSegmentedColorState.START_MULTIPLIER_INDEX, startMulValue.index);
                deltaMulValues = new Array();
                for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                    deltaMulValues.push(registerCache.getFreeVertexConstant());
            }
            var startOffsetValue;
            var deltaOffsetValues;
            if (this._iUsesOffset) {
                startOffsetValue = registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState_1.ParticleSegmentedColorState.START_OFFSET_INDEX, startOffsetValue.index);
                deltaOffsetValues = new Array();
                for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                    deltaOffsetValues.push(registerCache.getFreeVertexConstant());
            }
            if (this._iUsesMultiplier)
                code += "mov " + accMultiplierColor + "," + startMulValue + "\n";
            if (this._iUsesOffset)
                code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + startOffsetValue + "\n";
            for (i = 0; i < this._iNumSegmentPoint; i++) {
                switch (i) {
                    case 0:
                        code += "min " + tempTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
                        break;
                    case 1:
                        code += "sub " + accTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".y\n";
                        break;
                    case 2:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".z\n";
                        break;
                    case 3:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".w\n";
                        break;
                }
                if (this._iUsesMultiplier) {
                    code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[i] + "\n";
                    code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                }
                if (this._iUsesOffset) {
                    code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[i] + "\n";
                    code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + tempColor + "\n";
                }
            }
            //for the last segment:
            if (this._iNumSegmentPoint == 0)
                tempTime = animationRegisterData.vertexLife;
            else {
                switch (this._iNumSegmentPoint) {
                    case 1:
                        code += "sub " + accTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
                        break;
                    case 2:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                        break;
                    case 3:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                        break;
                    case 4:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".w\n";
                        break;
                }
                code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
            }
            if (this._iUsesMultiplier) {
                code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[this._iNumSegmentPoint] + "\n";
                code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                code += "mul " + animationRegisterData.colorMulTarget + "," + animationRegisterData.colorMulTarget + "," + accMultiplierColor + "\n";
            }
            if (this._iUsesOffset) {
                code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[this._iNumSegmentPoint] + "\n";
                code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + tempColor + "\n";
            }
        }
        return code;
    };
    return ParticleSegmentedColorNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleSegmentedColorNode = ParticleSegmentedColorNode;
