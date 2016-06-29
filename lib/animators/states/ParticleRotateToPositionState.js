"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToPositionState = (function (_super) {
    __extends(ParticleRotateToPositionState, _super);
    function ParticleRotateToPositionState(animator, particleRotateToPositionNode) {
        _super.call(this, animator, particleRotateToPositionNode);
        this._matrix = new Matrix3D_1.Matrix3D();
        this._particleRotateToPositionNode = particleRotateToPositionNode;
        this._position = this._particleRotateToPositionNode._iPosition;
    }
    Object.defineProperty(ParticleRotateToPositionState.prototype, "position", {
        /**
         * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
         */
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    ParticleRotateToPositionState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.POSITION_INDEX);
        if (this._pParticleAnimator.animationSet.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
        }
        if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) {
            this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
            shader.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
        }
        else
            animationElements.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticleRotateToPositionState.MATRIX_INDEX = 0;
    /** @private */
    ParticleRotateToPositionState.POSITION_INDEX = 1;
    return ParticleRotateToPositionState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleRotateToPositionState = ParticleRotateToPositionState;
