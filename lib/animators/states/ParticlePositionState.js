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
 * @author ...
 */
var ParticlePositionState = (function (_super) {
    __extends(ParticlePositionState, _super);
    function ParticlePositionState(animator, particlePositionNode) {
        _super.call(this, animator, particlePositionNode);
        this._particlePositionNode = particlePositionNode;
        this._position = this._particlePositionNode._iPosition;
    }
    Object.defineProperty(ParticlePositionState.prototype, "position", {
        /**
         * Defines the position of the particle when in global mode. Defaults to 0,0,0.
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
    /**
     *
     */
    ParticlePositionState.prototype.getPositions = function () {
        return this._pDynamicProperties;
    };
    ParticlePositionState.prototype.setPositions = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    /**
     * @inheritDoc
     */
    ParticlePositionState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._particlePositionNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
            this._pUpdateDynamicProperties(animationElements);
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);
        if (this._particlePositionNode.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.GLOBAL)
            shader.setVertexConst(index, this._position.x, this._position.y, this._position.z);
        else
            animationElements.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticlePositionState.POSITION_INDEX = 0;
    return ParticlePositionState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticlePositionState = ParticlePositionState;
