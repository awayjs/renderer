"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleTimeState = (function (_super) {
    __extends(ParticleTimeState, _super);
    function ParticleTimeState(animator, particleTimeNode) {
        _super.call(this, animator, particleTimeNode, true);
        this._particleTimeNode = particleTimeNode;
    }
    ParticleTimeState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
        var particleTime = this._pTime / 1000;
        shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
    };
    /** @private */
    ParticleTimeState.TIME_STREAM_INDEX = 0;
    /** @private */
    ParticleTimeState.TIME_CONSTANT_INDEX = 1;
    return ParticleTimeState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleTimeState = ParticleTimeState;
