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
var ParticleOscillatorState = (function (_super) {
    __extends(ParticleOscillatorState, _super);
    function ParticleOscillatorState(animator, particleOscillatorNode) {
        _super.call(this, animator, particleOscillatorNode);
        this._particleOscillatorNode = particleOscillatorNode;
        this._oscillator = this._particleOscillatorNode._iOscillator;
        this.updateOscillatorData();
    }
    Object.defineProperty(ParticleOscillatorState.prototype, "oscillator", {
        /**
         * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
         */
        get: function () {
            return this._oscillator;
        },
        set: function (value) {
            this._oscillator = value;
            this.updateOscillatorData();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleOscillatorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOscillatorState.OSCILLATOR_INDEX);
        if (this._particleOscillatorNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC)
            animationElements.activateVertexBuffer(index, this._particleOscillatorNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
        else
            shader.setVertexConst(index, this._oscillatorData.x, this._oscillatorData.y, this._oscillatorData.z, this._oscillatorData.w);
    };
    ParticleOscillatorState.prototype.updateOscillatorData = function () {
        if (this._particleOscillatorNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) {
            if (this._oscillator.w <= 0)
                throw (new Error("the cycle duration must greater than zero"));
            if (this._oscillatorData == null)
                this._oscillatorData = new Vector3D_1.Vector3D();
            this._oscillatorData.x = this._oscillator.x;
            this._oscillatorData.y = this._oscillator.y;
            this._oscillatorData.z = this._oscillator.z;
            this._oscillatorData.w = Math.PI * 2 / this._oscillator.w;
        }
    };
    /** @private */
    ParticleOscillatorState.OSCILLATOR_INDEX = 0;
    return ParticleOscillatorState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleOscillatorState = ParticleOscillatorState;
