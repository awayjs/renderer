"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleSpriteSheetState_1 = require("../../animators/states/ParticleSpriteSheetState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used when a spritesheet texture is required to animate the particle.
 * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
 */
var ParticleSpriteSheetNode = (function (_super) {
    __extends(ParticleSpriteSheetNode, _super);
    /**
     * Creates a new <code>ParticleSpriteSheetNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] numColumns      Defines the number of columns in the spritesheet, when in global mode. Defaults to 1.
     * @param    [optional] numRows         Defines the number of rows in the spritesheet, when in global mode. Defaults to 1.
     * @param    [optional] cycleDuration   Defines the default cycle duration in seconds, when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the default cycle phase, when in global mode. Defaults to 0.
     * @param    [optional] totalFrames     Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows.
     * @param    [optional] looping         Defines whether the spritesheet animation is set to loop indefinitely. Defaults to true.
     */
    function ParticleSpriteSheetNode(mode, usesCycle, usesPhase, numColumns, numRows, cycleDuration, cyclePhase, totalFrames) {
        if (numColumns === void 0) { numColumns = 1; }
        if (numRows === void 0) { numRows = 1; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        if (totalFrames === void 0) { totalFrames = Number.MAX_VALUE; }
        _super.call(this, "ParticleSpriteSheet", mode, usesCycle ? (usesPhase ? 3 : 2) : 1, ParticleAnimationSet_1.ParticleAnimationSet.POST_PRIORITY + 1);
        this._pStateClass = ParticleSpriteSheetState_1.ParticleSpriteSheetState;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iNumColumns = numColumns;
        this._iNumRows = numRows;
        this._iCyclePhase = cyclePhase;
        this._iCycleDuration = cycleDuration;
        this._iTotalFrames = Math.min(totalFrames, numColumns * numRows);
    }
    Object.defineProperty(ParticleSpriteSheetNode.prototype, "numColumns", {
        /**
         * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
         */
        get: function () {
            return this._iNumColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSpriteSheetNode.prototype, "numRows", {
        /**
         * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
         */
        get: function () {
            return this._iNumRows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSpriteSheetNode.prototype, "totalFrames", {
        /**
         * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
         */
        get: function () {
            return this._iTotalFrames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype.getAGALUVCode = function (shader, animationSet, registerCache, animationRegisterData) {
        //get 2 vc
        var uvParamConst1 = registerCache.getFreeVertexConstant();
        var uvParamConst2 = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleSpriteSheetState_1.ParticleSpriteSheetState.UV_INDEX_0, uvParamConst1.index);
        animationRegisterData.setRegisterIndex(this, ParticleSpriteSheetState_1.ParticleSpriteSheetState.UV_INDEX_1, uvParamConst2.index);
        var uTotal = new ShaderRegisterElement_1.ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 0);
        var uStep = new ShaderRegisterElement_1.ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 1);
        var vStep = new ShaderRegisterElement_1.ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 2);
        var uSpeed = new ShaderRegisterElement_1.ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 0);
        var cycle = new ShaderRegisterElement_1.ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 1);
        var phaseTime = new ShaderRegisterElement_1.ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 2);
        var temp = registerCache.getFreeVertexVectorTemp();
        var time = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 0);
        var vOffset = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 1);
        temp = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 2);
        var temp2 = new ShaderRegisterElement_1.ShaderRegisterElement(temp.regName, temp.index, 3);
        var u = new ShaderRegisterElement_1.ShaderRegisterElement(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, 0);
        var v = new ShaderRegisterElement_1.ShaderRegisterElement(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, 1);
        var code = "";
        //scale uv
        code += "mul " + u + "," + u + "," + uStep + "\n";
        if (this._iNumRows > 1)
            code += "mul " + v + "," + v + "," + vStep + "\n";
        if (this._iUsesCycle) {
            if (this._iUsesPhase)
                code += "add " + time + "," + animationRegisterData.vertexTime + "," + phaseTime + "\n";
            else
                code += "mov " + time + "," + animationRegisterData.vertexTime + "\n";
            code += "div " + time + "," + time + "," + cycle + "\n";
            code += "frc " + time + "," + time + "\n";
            code += "mul " + time + "," + time + "," + cycle + "\n";
            code += "mul " + temp + "," + time + "," + uSpeed + "\n";
        }
        else
            code += "mul " + temp.toString() + "," + animationRegisterData.vertexLife + "," + uTotal + "\n";
        if (this._iNumRows > 1) {
            code += "frc " + temp2 + "," + temp + "\n";
            code += "sub " + vOffset + "," + temp + "," + temp2 + "\n";
            code += "mul " + vOffset + "," + vOffset + "," + vStep + "\n";
            code += "add " + v + "," + v + "," + vOffset + "\n";
        }
        code += "div " + temp2 + "," + temp + "," + uStep + "\n";
        code += "frc " + temp + "," + temp2 + "\n";
        code += "sub " + temp2 + "," + temp2 + "," + temp + "\n";
        code += "mul " + temp + "," + temp2 + "," + uStep + "\n";
        if (this._iNumRows > 1)
            code += "frc " + temp + "," + temp + "\n";
        code += "add " + u + "," + u + "," + temp + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.hasUVNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        if (this._iUsesCycle) {
            var uvCycle = param[ParticleSpriteSheetNode.UV_VECTOR3D];
            if (!uvCycle)
                throw (new Error("there is no " + ParticleSpriteSheetNode.UV_VECTOR3D + " in param!"));
            if (uvCycle.x <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            var uTotal = this._iTotalFrames / this._iNumColumns;
            this._pOneData[0] = uTotal / uvCycle.x;
            this._pOneData[1] = uvCycle.x;
            if (this._iUsesPhase)
                this._pOneData[2] = uvCycle.y;
        }
    };
    /**
     * Reference for spritesheet node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
     */
    ParticleSpriteSheetNode.UV_VECTOR3D = "UVVector3D";
    return ParticleSpriteSheetNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleSpriteSheetNode = ParticleSpriteSheetNode;
