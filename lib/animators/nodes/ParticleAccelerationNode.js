"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleAccelerationState_1 = require("../../animators/states/ParticleAccelerationState");
/**
 * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
 */
var ParticleAccelerationNode = (function (_super) {
    __extends(ParticleAccelerationNode, _super);
    /**
     * Creates a new <code>ParticleAccelerationNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
     */
    function ParticleAccelerationNode(mode, acceleration) {
        if (acceleration === void 0) { acceleration = null; }
        _super.call(this, "ParticleAcceleration", mode, 3);
        this._pStateClass = ParticleAccelerationState_1.ParticleAccelerationState;
        this._acceleration = acceleration || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var accelerationValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleAccelerationState_1.ParticleAccelerationState.ACCELERATION_INDEX, accelerationValue.index);
        var temp = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp, 1);
        var code = "mul " + temp + "," + animationRegisterData.vertexTime + "," + accelerationValue + "\n";
        if (animationSet.needVelocity) {
            var temp2 = registerCache.getFreeVertexVectorTemp();
            code += "mul " + temp2 + "," + temp + "," + animationRegisterData.vertexTwoConst + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + temp2 + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
        }
        registerCache.removeVertexTempUsage(temp);
        code += "mul " + temp + "," + temp + "," + animationRegisterData.vertexTime + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + temp + "," + animationRegisterData.positionTarget + ".xyz\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var tempAcceleration = param[ParticleAccelerationNode.ACCELERATION_VECTOR3D];
        if (!tempAcceleration)
            throw new Error("there is no " + ParticleAccelerationNode.ACCELERATION_VECTOR3D + " in param!");
        this._pOneData[0] = tempAcceleration.x / 2;
        this._pOneData[1] = tempAcceleration.y / 2;
        this._pOneData[2] = tempAcceleration.z / 2;
    };
    /**
     * Reference for acceleration node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the direction of acceleration on the particle.
     */
    ParticleAccelerationNode.ACCELERATION_VECTOR3D = "AccelerationVector3D";
    return ParticleAccelerationNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleAccelerationNode = ParticleAccelerationNode;
