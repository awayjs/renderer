"use strict";
/**
 * ...
 */
var ParticleAnimationData = (function () {
    function ParticleAnimationData(index, startTime, duration, delay, particle) {
        this.index = index;
        this.startTime = startTime;
        this.totalTime = duration + delay;
        this.duration = duration;
        this.delay = delay;
        this.startVertexIndex = particle.startVertexIndex;
        this.numVertices = particle.numVertices;
    }
    return ParticleAnimationData;
}());
exports.ParticleAnimationData = ParticleAnimationData;
