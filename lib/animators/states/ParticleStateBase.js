"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 * ...
 */
var ParticleStateBase = (function (_super) {
    __extends(ParticleStateBase, _super);
    function ParticleStateBase(animator, particleNode, needUpdateTime) {
        if (needUpdateTime === void 0) { needUpdateTime = false; }
        _super.call(this, animator, particleNode);
        this._pDynamicProperties = new Array();
        this._pDynamicPropertiesDirty = new Object();
        this._pParticleAnimator = animator;
        this._particleNode = particleNode;
        this._pNeedUpdateTime = needUpdateTime;
    }
    Object.defineProperty(ParticleStateBase.prototype, "needUpdateTime", {
        get: function () {
            return this._pNeedUpdateTime;
        },
        enumerable: true,
        configurable: true
    });
    ParticleStateBase.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
    };
    ParticleStateBase.prototype._pUpdateDynamicProperties = function (animationElements) {
        this._pDynamicPropertiesDirty[animationElements._iUniqueId] = true;
        var animationParticles = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
        var totalLenOfOneVertex = animationElements.totalLenOfOneVertex;
        var dataLength = this._particleNode.dataLength;
        var dataOffset = this._particleNode._iDataOffset;
        var vertexLength;
        //			var particleOffset:number;
        var startingOffset;
        var vertexOffset;
        var data;
        var animationParticle;
        //			var numParticles:number = _positions.length/dataLength;
        var numParticles = this._pDynamicProperties.length;
        var i = 0;
        var j = 0;
        var k = 0;
        //loop through all particles
        while (i < numParticles) {
            //loop through each particle data for the current particle
            while (j < numParticles && (animationParticle = animationParticles[j]).index == i) {
                data = this._pDynamicProperties[i];
                vertexLength = animationParticle.numVertices * totalLenOfOneVertex;
                startingOffset = animationParticle.startVertexIndex * totalLenOfOneVertex + dataOffset;
                //loop through each vertex in the particle data
                for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                    vertexOffset = startingOffset + k;
                    //						particleOffset = i * dataLength;
                    //loop through all vertex data for the current particle data
                    for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                        vertexOffset = startingOffset + k;
                        vertexData[vertexOffset++] = data.x;
                        vertexData[vertexOffset++] = data.y;
                        vertexData[vertexOffset++] = data.z;
                        if (dataLength == 4)
                            vertexData[vertexOffset++] = data.w;
                    }
                }
                j++;
            }
            i++;
        }
        animationElements.invalidateBuffer();
    };
    return ParticleStateBase;
}(AnimationStateBase_1.AnimationStateBase));
exports.ParticleStateBase = ParticleStateBase;
