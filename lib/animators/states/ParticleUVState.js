"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleUVState = (function (_super) {
    __extends(ParticleUVState, _super);
    function ParticleUVState(animator, particleUVNode) {
        _super.call(this, animator, particleUVNode);
        this._particleUVNode = particleUVNode;
    }
    ParticleUVState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (!shader.usesUVTransform) {
            var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleUVState.UV_INDEX);
            var data = this._particleUVNode._iUvData;
            shader.setVertexConst(index, data.x, data.y);
        }
    };
    /** @private */
    ParticleUVState.UV_INDEX = 0;
    return ParticleUVState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleUVState = ParticleUVState;
