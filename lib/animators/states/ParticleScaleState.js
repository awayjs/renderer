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
var ParticleScaleState = (function (_super) {
    __extends(ParticleScaleState, _super);
    function ParticleScaleState(animator, particleScaleNode) {
        _super.call(this, animator, particleScaleNode);
        this._particleScaleNode = particleScaleNode;
        this._usesCycle = this._particleScaleNode._iUsesCycle;
        this._usesPhase = this._particleScaleNode._iUsesPhase;
        this._minScale = this._particleScaleNode._iMinScale;
        this._maxScale = this._particleScaleNode._iMaxScale;
        this._cycleDuration = this._particleScaleNode._iCycleDuration;
        this._cyclePhase = this._particleScaleNode._iCyclePhase;
        this.updateScaleData();
    }
    Object.defineProperty(ParticleScaleState.prototype, "minScale", {
        /**
         * Defines the end scale of the state, when in global mode. Defaults to 1.
         */
        get: function () {
            return this._minScale;
        },
        set: function (value) {
            this._minScale = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleScaleState.prototype, "maxScale", {
        /**
         * Defines the end scale of the state, when in global mode. Defaults to 1.
         */
        get: function () {
            return this._maxScale;
        },
        set: function (value) {
            this._maxScale = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleScaleState.prototype, "cycleDuration", {
        /**
         * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleScaleState.prototype, "cyclePhase", {
        /**
         * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleScaleState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleScaleState.SCALE_INDEX);
        if (this._particleScaleNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) {
            if (this._usesCycle) {
                if (this._usesPhase)
                    animationElements.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
                else
                    animationElements.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
            }
            else
                animationElements.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_2);
        }
        else
            shader.setVertexConst(index, this._scaleData.x, this._scaleData.y, this._scaleData.z, this._scaleData.w);
    };
    ParticleScaleState.prototype.updateScaleData = function () {
        if (this._particleScaleNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) {
            if (this._usesCycle) {
                if (this._cycleDuration <= 0)
                    throw (new Error("the cycle duration must be greater than zero"));
                this._scaleData = new Vector3D_1.Vector3D((this._minScale + this._maxScale) / 2, Math.abs(this._minScale - this._maxScale) / 2, Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180);
            }
            else
                this._scaleData = new Vector3D_1.Vector3D(this._minScale, this._maxScale - this._minScale, 0, 0);
        }
    };
    /** @private */
    ParticleScaleState.SCALE_INDEX = 0;
    return ParticleScaleState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleScaleState = ParticleScaleState;
