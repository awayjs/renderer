"use strict";
/**
 * ...
 */
var AnimationElements = (function () {
    function AnimationElements() {
        this._pVertexBuffer = new Array(8);
        this._pBufferContext = new Array(8);
        this._pBufferDirty = new Array(8);
        this.numProcessedVertices = 0;
        this.previousTime = Number.NEGATIVE_INFINITY;
        this.animationParticles = new Array();
        for (var i = 0; i < 8; i++)
            this._pBufferDirty[i] = true;
        this._iUniqueId = AnimationElements.SUBGEOM_ID_COUNT++;
    }
    AnimationElements.prototype.createVertexData = function (numVertices, totalLenOfOneVertex) {
        this._numVertices = numVertices;
        this._totalLenOfOneVertex = totalLenOfOneVertex;
        this._pVertexData = new Array(numVertices * totalLenOfOneVertex);
    };
    AnimationElements.prototype.activateVertexBuffer = function (index, bufferOffset, stage, format) {
        var contextIndex = stage.stageIndex;
        var context = stage.context;
        var buffer = this._pVertexBuffer[contextIndex];
        if (!buffer || this._pBufferContext[contextIndex] != context) {
            buffer = this._pVertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, this._totalLenOfOneVertex * 4);
            this._pBufferContext[contextIndex] = context;
            this._pBufferDirty[contextIndex] = true;
        }
        if (this._pBufferDirty[contextIndex]) {
            buffer.uploadFromArray(this._pVertexData, 0, this._numVertices);
            this._pBufferDirty[contextIndex] = false;
        }
        context.setVertexBufferAt(index, buffer, bufferOffset * 4, format);
    };
    AnimationElements.prototype.dispose = function () {
        while (this._pVertexBuffer.length) {
            var vertexBuffer = this._pVertexBuffer.pop();
            if (vertexBuffer)
                vertexBuffer.dispose();
        }
    };
    AnimationElements.prototype.invalidateBuffer = function () {
        for (var i = 0; i < 8; i++)
            this._pBufferDirty[i] = true;
    };
    Object.defineProperty(AnimationElements.prototype, "vertexData", {
        get: function () {
            return this._pVertexData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationElements.prototype, "numVertices", {
        get: function () {
            return this._numVertices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationElements.prototype, "totalLenOfOneVertex", {
        get: function () {
            return this._totalLenOfOneVertex;
        },
        enumerable: true,
        configurable: true
    });
    AnimationElements.SUBGEOM_ID_COUNT = 0;
    return AnimationElements;
}());
exports.AnimationElements = AnimationElements;
