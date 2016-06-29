"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleVelocityState_1 = require("../../animators/states/ParticleVelocityState");
/**
 * A particle animation node used to set the starting velocity of a particle.
 */
var ParticleVelocityNode = (function (_super) {
    __extends(ParticleVelocityNode, _super);
    /**
     * Creates a new <code>ParticleVelocityNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
     */
    function ParticleVelocityNode(mode, velocity) {
        if (velocity === void 0) { velocity = null; }
        _super.call(this, "ParticleVelocity", mode, 3);
        this._pStateClass = ParticleVelocityState_1.ParticleVelocityState;
        this._iVelocity = velocity || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var velocityValue = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleVelocityState_1.ParticleVelocityState.VELOCITY_INDEX, velocityValue.index);
        var distance = registerCache.getFreeVertexVectorTemp();
        var code = "";
        code += "mul " + distance + "," + animationRegisterData.vertexTime + "," + velocityValue + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + "," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity)
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + velocityValue + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var _tempVelocity = param[ParticleVelocityNode.VELOCITY_VECTOR3D];
        if (!_tempVelocity)
            throw new Error("there is no " + ParticleVelocityNode.VELOCITY_VECTOR3D + " in param!");
        this._pOneData[0] = _tempVelocity.x;
        this._pOneData[1] = _tempVelocity.y;
        this._pOneData[2] = _tempVelocity.z;
    };
    /**
     * Reference for velocity node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
     */
    ParticleVelocityNode.VELOCITY_VECTOR3D = "VelocityVector3D";
    return ParticleVelocityNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticleVelocityNode = ParticleVelocityNode;
