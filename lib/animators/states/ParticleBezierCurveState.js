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
var ParticleBezierCurveState = (function (_super) {
    __extends(ParticleBezierCurveState, _super);
    function ParticleBezierCurveState(animator, particleBezierCurveNode) {
        _super.call(this, animator, particleBezierCurveNode);
        this._particleBezierCurveNode = particleBezierCurveNode;
        this._controlPoint = this._particleBezierCurveNode._iControlPoint;
        this._endPoint = this._particleBezierCurveNode._iEndPoint;
    }
    Object.defineProperty(ParticleBezierCurveState.prototype, "controlPoint", {
        /**
         * Defines the default control point of the node, used when in global mode.
         */
        get: function () {
            return this._controlPoint;
        },
        set: function (value) {
            this._controlPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleBezierCurveState.prototype, "endPoint", {
        /**
         * Defines the default end point of the node, used when in global mode.
         */
        get: function () {
            return this._endPoint;
        },
        set: function (value) {
            this._endPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    ParticleBezierCurveState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var controlIndex = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_CONTROL_INDEX);
        var endIndex = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_END_INDEX);
        if (this._particleBezierCurveNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) {
            animationElements.activateVertexBuffer(controlIndex, this._particleBezierCurveNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
            animationElements.activateVertexBuffer(endIndex, this._particleBezierCurveNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
        }
        else {
            shader.setVertexConst(controlIndex, this._controlPoint.x, this._controlPoint.y, this._controlPoint.z);
            shader.setVertexConst(endIndex, this._endPoint.x, this._endPoint.y, this._endPoint.z);
        }
    };
    /** @private */
    ParticleBezierCurveState.BEZIER_CONTROL_INDEX = 0;
    /** @private */
    ParticleBezierCurveState.BEZIER_END_INDEX = 1;
    return ParticleBezierCurveState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleBezierCurveState = ParticleBezierCurveState;
