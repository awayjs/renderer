"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleScaleState_1 = require("../../animators/states/ParticleScaleState");
/**
 * A particle animation node used to control the scale variation of a particle over time.
 */
var ParticleScaleNode = (function (_super) {
    __extends(ParticleScaleNode, _super);
    /**
     * Creates a new <code>ParticleScaleNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of animation independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the animation cycle. Defaults to false.
     * @param    [optional] minScale        Defines the default min scale transform of the node, when in global mode. Defaults to 1.
     * @param    [optional] maxScale        Defines the default max color transform of the node, when in global mode. Defaults to 1.
     * @param    [optional] cycleDuration   Defines the default duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the default phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    function ParticleScaleNode(mode, usesCycle, usesPhase, minScale, maxScale, cycleDuration, cyclePhase) {
        if (minScale === void 0) { minScale = 1; }
        if (maxScale === void 0) { maxScale = 1; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        _super.call(this, "ParticleScale", mode, (usesCycle && usesPhase) ? 4 : ((usesCycle || usesPhase) ? 3 : 2), 3);
        this._pStateClass = ParticleScaleState_1.ParticleScaleState;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iMinScale = minScale;
        this._iMaxScale = maxScale;
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
    }
    /**
     * @inheritDoc
     */
    ParticleScaleNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        var temp = registerCache.getFreeVertexSingleTemp();
        var scaleRegister = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleScaleState_1.ParticleScaleState.SCALE_INDEX, scaleRegister.index);
        if (this._iUsesCycle) {
            code += "mul " + temp + "," + animationRegisterData.vertexTime + "," + scaleRegister + ".z\n";
            if (this._iUsesPhase)
                code += "add " + temp + "," + temp + "," + scaleRegister + ".w\n";
            code += "sin " + temp + "," + temp + "\n";
        }
        code += "mul " + temp + "," + scaleRegister + ".y," + ((this._iUsesCycle) ? temp : animationRegisterData.vertexLife) + "\n";
        code += "add " + temp + "," + scaleRegister + ".x," + temp + "\n";
        code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleScaleNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleScaleNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var scale = param[ParticleScaleNode.SCALE_VECTOR3D];
        if (!scale)
            throw (new Error("there is no " + ParticleScaleNode.SCALE_VECTOR3D + " in param!"));
        if (this._iUsesCycle) {
            this._pOneData[0] = (scale.x + scale.y) / 2;
            this._pOneData[1] = Math.abs(scale.x - scale.y) / 2;
            if (scale.z <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            this._pOneData[2] = Math.PI * 2 / scale.z;
            if (this._iUsesPhase)
                this._pOneData[3] = scale.w * Math.PI / 180;
        }
        else {
            this._pOneData[0] = scale.x;
            this._pOneData[1] = scale.y - scale.x;
        }
    };
    /**
     * Reference for scale node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> representing the min scale (x), max scale(y), optional cycle speed (z) and phase offset (w) applied to the particle.
     */
    ParticleScaleNode.SCALE_VECTOR3D = "ScaleVector3D";
    return ParticleScaleNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleScaleNode = ParticleScaleNode;
