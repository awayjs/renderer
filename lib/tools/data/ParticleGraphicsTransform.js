"use strict";
/**
 * ...
 */
var ParticleGraphicsTransform = (function () {
    function ParticleGraphicsTransform() {
    }
    Object.defineProperty(ParticleGraphicsTransform.prototype, "vertexTransform", {
        get: function () {
            return this._defaultVertexTransform;
        },
        set: function (value) {
            this._defaultVertexTransform = value;
            this._defaultInvVertexTransform = value.clone();
            this._defaultInvVertexTransform.invert();
            this._defaultInvVertexTransform.transpose();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGraphicsTransform.prototype, "UVTransform", {
        get: function () {
            return this._defaultUVTransform;
        },
        set: function (value) {
            this._defaultUVTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGraphicsTransform.prototype, "invVertexTransform", {
        get: function () {
            return this._defaultInvVertexTransform;
        },
        enumerable: true,
        configurable: true
    });
    return ParticleGraphicsTransform;
}());
exports.ParticleGraphicsTransform = ParticleGraphicsTransform;
