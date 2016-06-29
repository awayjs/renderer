"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticlePositionState_1 = require("../../animators/states/ParticlePositionState");
/**
 * A particle animation node used to set the starting position of a particle.
 */
var ParticlePositionNode = (function (_super) {
    __extends(ParticlePositionNode, _super);
    /**
     * Creates a new <code>ParticlePositionNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
     */
    function ParticlePositionNode(mode, position) {
        if (position === void 0) { position = null; }
        _super.call(this, "ParticlePosition", mode, 3);
        this._pStateClass = ParticlePositionState_1.ParticlePositionState;
        this._iPosition = position || new Vector3D_1.Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var positionAttribute = (this._pMode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticlePositionState_1.ParticlePositionState.POSITION_INDEX, positionAttribute.index);
        return "add " + animationRegisterData.positionTarget + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
    };
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var offset = param[ParticlePositionNode.POSITION_VECTOR3D];
        if (!offset)
            throw (new Error("there is no " + ParticlePositionNode.POSITION_VECTOR3D + " in param!"));
        this._pOneData[0] = offset.x;
        this._pOneData[1] = offset.y;
        this._pOneData[2] = offset.z;
    };
    /**
     * Reference for position node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing position of the particle.
     */
    ParticlePositionNode.POSITION_VECTOR3D = "PositionVector3D";
    return ParticlePositionNode;
}(ParticleNodeBase_1.ParticleNodeBase));
exports.ParticlePositionNode = ParticlePositionNode;
