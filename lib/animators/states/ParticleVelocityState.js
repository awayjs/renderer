"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleVelocityState = (function (_super) {
    __extends(ParticleVelocityState, _super);
    function ParticleVelocityState(animator, particleVelocityNode) {
        _super.call(this, animator, particleVelocityNode);
        this._particleVelocityNode = particleVelocityNode;
        this._velocity = this._particleVelocityNode._iVelocity;
    }
    Object.defineProperty(ParticleVelocityState.prototype, "velocity", {
        /**
         * Defines the default velocity vector of the state, used when in global mode.
         */
        get: function () {
            return this._velocity;
        },
        set: function (value) {
            this._velocity = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticleVelocityState.prototype.getVelocities = function () {
        return this._pDynamicProperties;
    };
    ParticleVelocityState.prototype.setVelocities = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    ParticleVelocityState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._particleVelocityNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
            this._pUpdateDynamicProperties(animationElements);
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleVelocityState.VELOCITY_INDEX);
        if (this._particleVelocityNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL)
            shader.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
        else
            animationElements.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticleVelocityState.VELOCITY_INDEX = 0;
    return ParticleVelocityState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleVelocityState = ParticleVelocityState;
