"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleOrbitState = (function (_super) {
    __extends(ParticleOrbitState, _super);
    function ParticleOrbitState(animator, particleOrbitNode) {
        _super.call(this, animator, particleOrbitNode);
        this._particleOrbitNode = particleOrbitNode;
        this._usesEulers = this._particleOrbitNode._iUsesEulers;
        this._usesCycle = this._particleOrbitNode._iUsesCycle;
        this._usesPhase = this._particleOrbitNode._iUsesPhase;
        this._eulers = this._particleOrbitNode._iEulers;
        this._radius = this._particleOrbitNode._iRadius;
        this._cycleDuration = this._particleOrbitNode._iCycleDuration;
        this._cyclePhase = this._particleOrbitNode._iCyclePhase;
        this.updateOrbitData();
    }
    Object.defineProperty(ParticleOrbitState.prototype, "radius", {
        /**
         * Defines the radius of the orbit when in global mode. Defaults to 100.
         */
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleOrbitState.prototype, "cycleDuration", {
        /**
         * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleOrbitState.prototype, "cyclePhase", {
        /**
         * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleOrbitState.prototype, "eulers", {
        /**
         * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
         */
        get: function () {
            return this._eulers;
        },
        set: function (value) {
            this._eulers = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleOrbitState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.ORBIT_INDEX);
        if (this._particleOrbitNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) {
            if (this._usesPhase)
                animationElements.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_4);
            else
                animationElements.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
        }
        else
            shader.setVertexConst(index, this._orbitData.x, this._orbitData.y, this._orbitData.z, this._orbitData.w);
        if (this._usesEulers)
            shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.EULERS_INDEX), this._eulersMatrix);
    };
    ParticleOrbitState.prototype.updateOrbitData = function () {
        if (this._usesEulers) {
            this._eulersMatrix = new Matrix3D_1.Matrix3D();
            this._eulersMatrix.appendRotation(this._eulers.x, Vector3D_1.Vector3D.X_AXIS);
            this._eulersMatrix.appendRotation(this._eulers.y, Vector3D_1.Vector3D.Y_AXIS);
            this._eulersMatrix.appendRotation(this._eulers.z, Vector3D_1.Vector3D.Z_AXIS);
        }
        if (this._particleOrbitNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL) {
            this._orbitData = new Vector3D_1.Vector3D(this._radius, 0, this._radius * Math.PI * 2, this._cyclePhase * Math.PI / 180);
            if (this._usesCycle) {
                if (this._cycleDuration <= 0)
                    throw (new Error("the cycle duration must be greater than zero"));
                this._orbitData.y = Math.PI * 2 / this._cycleDuration;
            }
            else
                this._orbitData.y = Math.PI * 2;
        }
    };
    /** @private */
    ParticleOrbitState.ORBIT_INDEX = 0;
    /** @private */
    ParticleOrbitState.EULERS_INDEX = 1;
    return ParticleOrbitState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleOrbitState = ParticleOrbitState;
