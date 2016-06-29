"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathConsts_1 = require("@awayjs/core/lib/geom/MathConsts");
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleFollowState = (function (_super) {
    __extends(ParticleFollowState, _super);
    function ParticleFollowState(animator, particleFollowNode) {
        _super.call(this, animator, particleFollowNode, true);
        this._targetPos = new Vector3D_1.Vector3D();
        this._targetEuler = new Vector3D_1.Vector3D();
        //temporary vector3D for calculation
        this._temp = new Vector3D_1.Vector3D();
        this._particleFollowNode = particleFollowNode;
        this._smooth = particleFollowNode._iSmooth;
    }
    Object.defineProperty(ParticleFollowState.prototype, "followTarget", {
        get: function () {
            return this._followTarget;
        },
        set: function (value) {
            this._followTarget = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleFollowState.prototype, "smooth", {
        get: function () {
            return this._smooth;
        },
        set: function (value) {
            this._smooth = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleFollowState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._followTarget) {
            if (this._particleFollowNode._iUsesPosition) {
                this._targetPos.x = this._followTarget.transform.position.x / renderable.sourceEntity.scaleX;
                this._targetPos.y = this._followTarget.transform.position.y / renderable.sourceEntity.scaleY;
                this._targetPos.z = this._followTarget.transform.position.z / renderable.sourceEntity.scaleZ;
            }
            if (this._particleFollowNode._iUsesRotation) {
                this._targetEuler.x = this._followTarget.rotationX;
                this._targetEuler.y = this._followTarget.rotationY;
                this._targetEuler.z = this._followTarget.rotationZ;
                this._targetEuler.scaleBy(MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
            }
        }
        //initialization
        if (!this._prePos)
            this._prePos = this._targetPos.clone();
        if (!this._preEuler)
            this._preEuler = this._targetEuler.clone();
        var currentTime = this._pTime / 1000;
        var previousTime = animationElements.previousTime;
        var deltaTime = currentTime - previousTime;
        var needProcess = previousTime != currentTime;
        if (this._particleFollowNode._iUsesPosition && this._particleFollowNode._iUsesRotation) {
            if (needProcess)
                this.processPositionAndRotation(currentTime, deltaTime, animationElements);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
        }
        else if (this._particleFollowNode._iUsesPosition) {
            if (needProcess)
                this.processPosition(currentTime, deltaTime, animationElements);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
        }
        else if (this._particleFollowNode._iUsesRotation) {
            if (needProcess)
                this.precessRotation(currentTime, deltaTime, animationElements);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
        }
        this._prePos.copyFrom(this._targetPos);
        this._targetEuler.copyFrom(this._targetEuler);
        animationElements.previousTime = currentTime;
    };
    ParticleFollowState.prototype.processPosition = function (currentTime, deltaTime, animationElements) {
        var data = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
        var changed = false;
        var len = data.length;
        var interpolatedPos;
        var posVelocity;
        if (this._smooth) {
            posVelocity = this._prePos.subtract(this._targetPos);
            posVelocity.scaleBy(1 / deltaTime);
        }
        else
            interpolatedPos = this._targetPos;
        for (var i = 0; i < len; i++) {
            var k = (currentTime - data[i].startTime) / data[i].totalTime;
            var t = (k - Math.floor(k)) * data[i].totalTime;
            if (t - deltaTime <= 0) {
                var inc = data[i].startVertexIndex * animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                if (this._smooth) {
                    this._temp.copyFrom(posVelocity);
                    this._temp.scaleBy(t);
                    interpolatedPos = this._targetPos.add(this._temp);
                }
                if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z) {
                    changed = true;
                    for (var j = 0; j < data[i].numVertices; j++) {
                        vertexData[inc++] = interpolatedPos.x;
                        vertexData[inc++] = interpolatedPos.y;
                        vertexData[inc++] = interpolatedPos.z;
                    }
                }
            }
        }
        if (changed)
            animationElements.invalidateBuffer();
    };
    ParticleFollowState.prototype.precessRotation = function (currentTime, deltaTime, animationElements) {
        var data = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
        var changed = false;
        var len = data.length;
        var interpolatedRotation;
        var rotationVelocity;
        if (this._smooth) {
            rotationVelocity = this._preEuler.subtract(this._targetEuler);
            rotationVelocity.scaleBy(1 / deltaTime);
        }
        else
            interpolatedRotation = this._targetEuler;
        for (var i = 0; i < len; i++) {
            var k = (currentTime - data[i].startTime) / data[i].totalTime;
            var t = (k - Math.floor(k)) * data[i].totalTime;
            if (t - deltaTime <= 0) {
                var inc = data[i].startVertexIndex * animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                if (this._smooth) {
                    this._temp.copyFrom(rotationVelocity);
                    this._temp.scaleBy(t);
                    interpolatedRotation = this._targetEuler.add(this._temp);
                }
                if (vertexData[inc] != interpolatedRotation.x || vertexData[inc + 1] != interpolatedRotation.y || vertexData[inc + 2] != interpolatedRotation.z) {
                    changed = true;
                    for (var j = 0; j < data[i].numVertices; j++) {
                        vertexData[inc++] = interpolatedRotation.x;
                        vertexData[inc++] = interpolatedRotation.y;
                        vertexData[inc++] = interpolatedRotation.z;
                    }
                }
            }
        }
        if (changed)
            animationElements.invalidateBuffer();
    };
    ParticleFollowState.prototype.processPositionAndRotation = function (currentTime, deltaTime, animationElements) {
        var data = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
        var changed = false;
        var len = data.length;
        var interpolatedPos;
        var interpolatedRotation;
        var posVelocity;
        var rotationVelocity;
        if (this._smooth) {
            posVelocity = this._prePos.subtract(this._targetPos);
            posVelocity.scaleBy(1 / deltaTime);
            rotationVelocity = this._preEuler.subtract(this._targetEuler);
            rotationVelocity.scaleBy(1 / deltaTime);
        }
        else {
            interpolatedPos = this._targetPos;
            interpolatedRotation = this._targetEuler;
        }
        for (var i = 0; i < len; i++) {
            var k = (currentTime - data[i].startTime) / data[i].totalTime;
            var t = (k - Math.floor(k)) * data[i].totalTime;
            if (t - deltaTime <= 0) {
                var inc = data[i].startVertexIndex * animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                if (this._smooth) {
                    this._temp.copyFrom(posVelocity);
                    this._temp.scaleBy(t);
                    interpolatedPos = this._targetPos.add(this._temp);
                    this._temp.copyFrom(rotationVelocity);
                    this._temp.scaleBy(t);
                    interpolatedRotation = this._targetEuler.add(this._temp);
                }
                if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z || vertexData[inc + 3] != interpolatedRotation.x || vertexData[inc + 4] != interpolatedRotation.y || vertexData[inc + 5] != interpolatedRotation.z) {
                    changed = true;
                    for (var j = 0; j < data[i].numVertices; j++) {
                        vertexData[inc++] = interpolatedPos.x;
                        vertexData[inc++] = interpolatedPos.y;
                        vertexData[inc++] = interpolatedPos.z;
                        vertexData[inc++] = interpolatedRotation.x;
                        vertexData[inc++] = interpolatedRotation.y;
                        vertexData[inc++] = interpolatedRotation.z;
                    }
                }
            }
        }
        if (changed)
            animationElements.invalidateBuffer();
    };
    /** @private */
    ParticleFollowState.FOLLOW_POSITION_INDEX = 0;
    /** @private */
    ParticleFollowState.FOLLOW_ROTATION_INDEX = 1;
    return ParticleFollowState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleFollowState = ParticleFollowState;
