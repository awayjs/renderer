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
*
*/
var ParticleInitialColorState = (function (_super) {
    __extends(ParticleInitialColorState, _super);
    function ParticleInitialColorState(animator, particleInitialColorNode) {
        _super.call(this, animator, particleInitialColorNode);
        this._particleInitialColorNode = particleInitialColorNode;
        this._usesMultiplier = particleInitialColorNode._iUsesMultiplier;
        this._usesOffset = particleInitialColorNode._iUsesOffset;
        this._initialColor = particleInitialColorNode._iInitialColor;
        this.updateColorData();
    }
    Object.defineProperty(ParticleInitialColorState.prototype, "initialColor", {
        /**
         * Defines the initial color transform of the state, when in global mode.
         */
        get: function () {
            return this._initialColor;
        },
        set: function (value) {
            this._initialColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleInitialColorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (shader.usesFragmentAnimation) {
            var index;
            if (this._particleInitialColorNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) {
                var dataOffset = this._particleInitialColorNode._iDataOffset;
                if (this._usesMultiplier) {
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
                    dataOffset += 4;
                }
                if (this._usesOffset)
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
            }
            else {
                if (this._usesMultiplier)
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), this._multiplierData.x, this._multiplierData.y, this._multiplierData.z, this._multiplierData.w);
                if (this._usesOffset)
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), this._offsetData.x, this._offsetData.y, this._offsetData.z, this._offsetData.w);
            }
        }
    };
    ParticleInitialColorState.prototype.updateColorData = function () {
        if (this._particleInitialColorNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) {
            if (this._usesMultiplier)
                this._multiplierData = new Vector3D_1.Vector3D(this._initialColor.redMultiplier, this._initialColor.greenMultiplier, this._initialColor.blueMultiplier, this._initialColor.alphaMultiplier);
            if (this._usesOffset)
                this._offsetData = new Vector3D_1.Vector3D(this._initialColor.redOffset / 255, this._initialColor.greenOffset / 255, this._initialColor.blueOffset / 255, this._initialColor.alphaOffset / 255);
        }
    };
    /** @private */
    ParticleInitialColorState.MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleInitialColorState.OFFSET_INDEX = 1;
    return ParticleInitialColorState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleInitialColorState = ParticleInitialColorState;
