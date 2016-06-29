"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimatorBase_1 = require("../animators/AnimatorBase");
var AnimationElements_1 = require("../animators/data/AnimationElements");
var ParticlePropertiesMode_1 = require("../animators/data/ParticlePropertiesMode");
/**
 * Provides an interface for assigning paricle-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent sprite is particle geometry
 *
 * @see away.base.ParticleGraphics
 */
var ParticleAnimator = (function (_super) {
    __extends(ParticleAnimator, _super);
    /**
     * Creates a new <code>ParticleAnimator</code> object.
     *
     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
     */
    function ParticleAnimator(particleAnimationSet) {
        _super.call(this, particleAnimationSet);
        this._animationParticleStates = new Array();
        this._animatorParticleStates = new Array();
        this._timeParticleStates = new Array();
        this._totalLenOfOneVertex = 0;
        this._animatorSubGeometries = new Object();
        this._particleAnimationSet = particleAnimationSet;
        var state;
        var node;
        for (var i = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
            node = this._particleAnimationSet.particleNodes[i];
            state = this.getAnimationState(node);
            if (node.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_DYNAMIC) {
                this._animatorParticleStates.push(state);
                node._iDataOffset = this._totalLenOfOneVertex;
                this._totalLenOfOneVertex += node.dataLength;
            }
            else {
                this._animationParticleStates.push(state);
            }
            if (state.needUpdateTime)
                this._timeParticleStates.push(state);
        }
    }
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.clone = function () {
        return new ParticleAnimator(this._particleAnimationSet);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.setRenderState = function (shader, renderable, stage, camera) {
        var animationRegisterData = this._particleAnimationSet._iAnimationRegisterData;
        var graphic = renderable.graphic;
        if (!graphic)
            throw (new Error("Must be graphic"));
        //process animation sub geometries
        var animationElements = this._particleAnimationSet.getAnimationElements(graphic);
        var i;
        for (i = 0; i < this._animationParticleStates.length; i++)
            this._animationParticleStates[i].setRenderState(shader, renderable, animationElements, animationRegisterData, camera, stage);
        //process animator subgeometries
        var animatorElements = this.getAnimatorElements(graphic);
        for (i = 0; i < this._animatorParticleStates.length; i++)
            this._animatorParticleStates[i].setRenderState(shader, renderable, animatorElements, animationRegisterData, camera, stage);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.testGPUCompatibility = function (shader) {
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.start = function () {
        _super.prototype.start.call(this);
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype._pUpdateDeltaTime = function (dt) {
        this._pAbsoluteTime += dt;
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].update(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.resetTime = function (offset) {
        if (offset === void 0) { offset = 0; }
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
        this.update(this.time);
    };
    ParticleAnimator.prototype.dispose = function () {
        for (var key in this._animatorSubGeometries)
            this._animatorSubGeometries[key].dispose();
    };
    ParticleAnimator.prototype.getAnimatorElements = function (graphic) {
        if (!this._animatorParticleStates.length)
            return;
        var elements = graphic.elements;
        var animatorElements = this._animatorSubGeometries[elements.id] = new AnimationElements_1.AnimationElements();
        //create the vertexData vector that will be used for local state data
        animatorElements.createVertexData(elements.numVertices, this._totalLenOfOneVertex);
        //pass the particles data to the animator elements
        animatorElements.animationParticles = this._particleAnimationSet.getAnimationElements(graphic).animationParticles;
    };
    return ParticleAnimator;
}(AnimatorBase_1.AnimatorBase));
exports.ParticleAnimator = ParticleAnimator;
