"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToHeadingState = (function (_super) {
    __extends(ParticleRotateToHeadingState, _super);
    function ParticleRotateToHeadingState(animator, particleNode) {
        _super.call(this, animator, particleNode);
        this._matrix = new Matrix3D_1.Matrix3D();
    }
    ParticleRotateToHeadingState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._pParticleAnimator.animationSet.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingState.MATRIX_INDEX), this._matrix);
        }
    };
    /** @private */
    ParticleRotateToHeadingState.MATRIX_INDEX = 0;
    return ParticleRotateToHeadingState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleRotateToHeadingState = ParticleRotateToHeadingState;
