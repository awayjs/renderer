"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotationalVelocityState = (function (_super) {
    __extends(ParticleRotationalVelocityState, _super);
    function ParticleRotationalVelocityState(animator, particleRotationNode) {
        _super.call(this, animator, particleRotationNode);
        this._particleRotationalVelocityNode = particleRotationNode;
        this._rotationalVelocity = this._particleRotationalVelocityNode._iRotationalVelocity;
        this.updateRotationalVelocityData();
    }
    Object.defineProperty(ParticleRotationalVelocityState.prototype, "rotationalVelocity", {
        /**
         * Defines the default rotationalVelocity of the state, used when in global mode.
         */
        get: function () {
            return this._rotationalVelocity;
        },
        set: function (value) {
            this._rotationalVelocity = value;
            this.updateRotationalVelocityData();
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticleRotationalVelocityState.prototype.getRotationalVelocities = function () {
        return this._pDynamicProperties;
    };
    ParticleRotationalVelocityState.prototype.setRotationalVelocities = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
            this._pUpdateDynamicProperties(animationElements);
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX);
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL)
            shader.setVertexConst(index, this._rotationalVelocityData.x, this._rotationalVelocityData.y, this._rotationalVelocityData.z, this._rotationalVelocityData.w);
        else
            animationElements.activateVertexBuffer(index, this._particleRotationalVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
    };
    ParticleRotationalVelocityState.prototype.updateRotationalVelocityData = function () {
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) {
            if (this._rotationalVelocity.w <= 0)
                throw (new Error("the cycle duration must greater than zero"));
            var rotation = this._rotationalVelocity.clone();
            if (rotation.length <= 0)
                rotation.z = 1; //set the default direction
            else
                rotation.normalize();
            // w is used as angle/2 in agal
            this._rotationalVelocityData = new Vector3D_1.Vector3D(rotation.x, rotation.y, rotation.z, Math.PI / rotation.w);
        }
    };
    /** @private */
    ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX = 0;
    return ParticleRotationalVelocityState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleRotationalVelocityState = ParticleRotationalVelocityState;
