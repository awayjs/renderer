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
var ParticleAccelerationState = (function (_super) {
    __extends(ParticleAccelerationState, _super);
    function ParticleAccelerationState(animator, particleAccelerationNode) {
        _super.call(this, animator, particleAccelerationNode);
        this._particleAccelerationNode = particleAccelerationNode;
        this._acceleration = this._particleAccelerationNode._acceleration;
        this.updateAccelerationData();
    }
    Object.defineProperty(ParticleAccelerationState.prototype, "acceleration", {
        /**
         * Defines the acceleration vector of the state, used when in global mode.
         */
        get: function () {
            return this._acceleration;
        },
        set: function (value) {
            this._acceleration.x = value.x;
            this._acceleration.y = value.y;
            this._acceleration.z = value.z;
            this.updateAccelerationData();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleAccelerationState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleAccelerationState.ACCELERATION_INDEX);
        if (this._particleAccelerationNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC)
            animationElements.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
        else
            shader.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
    };
    ParticleAccelerationState.prototype.updateAccelerationData = function () {
        if (this._particleAccelerationNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL)
            this._halfAcceleration = new Vector3D_1.Vector3D(this._acceleration.x / 2, this._acceleration.y / 2, this._acceleration.z / 2);
    };
    /** @private */
    ParticleAccelerationState.ACCELERATION_INDEX = 0;
    return ParticleAccelerationState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleAccelerationState = ParticleAccelerationState;
