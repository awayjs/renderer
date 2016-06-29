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
var ParticleSpriteSheetState = (function (_super) {
    __extends(ParticleSpriteSheetState, _super);
    function ParticleSpriteSheetState(animator, particleSpriteSheetNode) {
        _super.call(this, animator, particleSpriteSheetNode);
        this._particleSpriteSheetNode = particleSpriteSheetNode;
        this._usesCycle = this._particleSpriteSheetNode._iUsesCycle;
        this._usesPhase = this._particleSpriteSheetNode._iUsesCycle;
        this._totalFrames = this._particleSpriteSheetNode._iTotalFrames;
        this._numColumns = this._particleSpriteSheetNode._iNumColumns;
        this._numRows = this._particleSpriteSheetNode._iNumRows;
        this._cycleDuration = this._particleSpriteSheetNode._iCycleDuration;
        this._cyclePhase = this._particleSpriteSheetNode._iCyclePhase;
        this.updateSpriteSheetData();
    }
    Object.defineProperty(ParticleSpriteSheetState.prototype, "cyclePhase", {
        /**
         * Defines the cycle phase, when in global mode. Defaults to zero.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateSpriteSheetData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSpriteSheetState.prototype, "cycleDuration", {
        /**
         * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateSpriteSheetData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleSpriteSheetState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (!shader.usesUVTransform) {
            shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_0), this._spriteSheetData[0], this._spriteSheetData[1], this._spriteSheetData[2], this._spriteSheetData[3]);
            if (this._usesCycle) {
                var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_1);
                if (this._particleSpriteSheetNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) {
                    if (this._usesPhase)
                        animationElements.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
                    else
                        animationElements.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_2);
                }
                else
                    shader.setVertexConst(index, this._spriteSheetData[4], this._spriteSheetData[5]);
            }
        }
    };
    ParticleSpriteSheetState.prototype.updateSpriteSheetData = function () {
        this._spriteSheetData = new Array(8);
        var uTotal = this._totalFrames / this._numColumns;
        this._spriteSheetData[0] = uTotal;
        this._spriteSheetData[1] = 1 / this._numColumns;
        this._spriteSheetData[2] = 1 / this._numRows;
        if (this._usesCycle) {
            if (this._cycleDuration <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            this._spriteSheetData[4] = uTotal / this._cycleDuration;
            this._spriteSheetData[5] = this._cycleDuration;
            if (this._usesPhase)
                this._spriteSheetData[6] = this._cyclePhase;
        }
    };
    /** @private */
    ParticleSpriteSheetState.UV_INDEX_0 = 0;
    /** @private */
    ParticleSpriteSheetState.UV_INDEX_1 = 1;
    return ParticleSpriteSheetState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleSpriteSheetState = ParticleSpriteSheetState;
