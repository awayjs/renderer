"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TriangleElements_1 = require("@awayjs/display/lib/graphics/TriangleElements");
var AnimatorBase_1 = require("../animators/AnimatorBase");
var VertexAnimationMode_1 = require("../animators/data/VertexAnimationMode");
/**
 * Provides an interface for assigning vertex-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
var VertexAnimator = (function (_super) {
    __extends(VertexAnimator, _super);
    /**
     * Creates a new <code>VertexAnimator</code> object.
     *
     * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
     */
    function VertexAnimator(vertexAnimationSet) {
        _super.call(this, vertexAnimationSet);
        this._poses = new Array();
        this._weights = new Float32Array([1, 0, 0, 0]);
        this._vertexAnimationSet = vertexAnimationSet;
    }
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype.clone = function () {
        return new VertexAnimator(this._vertexAnimationSet);
    };
    /**
     * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
     * @param sequenceName The name of the clip to be played.
     */
    VertexAnimator.prototype.play = function (name, transition, offset) {
        if (transition === void 0) { transition = null; }
        if (offset === void 0) { offset = NaN; }
        if (this._pActiveAnimationName == name)
            return;
        this._pActiveAnimationName = name;
        //TODO: implement transitions in vertex animator
        if (!this._pAnimationSet.hasAnimation(name))
            throw new Error("Animation root node " + name + " not found!");
        this._pActiveNode = this._pAnimationSet.getAnimation(name);
        this._pActiveState = this.getAnimationState(this._pActiveNode);
        if (this.updatePosition) {
            //update straight away to reset position deltas
            this._pActiveState.update(this._pAbsoluteTime);
            this._pActiveState.positionDelta;
        }
        this._activeVertexState = this._pActiveState;
        this.start();
        //apply a time offset if specified
        if (!isNaN(offset))
            this.reset(name, offset);
    };
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype._pUpdateDeltaTime = function (dt) {
        _super.prototype._pUpdateDeltaTime.call(this, dt);
        var geometryFlag = false;
        if (this._poses[0] != this._activeVertexState.currentGraphics) {
            this._poses[0] = this._activeVertexState.currentGraphics;
            geometryFlag = true;
        }
        if (this._poses[1] != this._activeVertexState.nextGraphics)
            this._poses[1] = this._activeVertexState.nextGraphics;
        this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);
        if (geometryFlag)
            this.invalidateElements();
    };
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype.setRenderState = function (shader, renderable, stage, camera) {
        // todo: add code for when running on cpu
        // this type of animation can only be SubSprite
        var graphic = renderable.graphic;
        var elements = graphic.elements;
        // if no poses defined, set temp data
        if (!this._poses.length) {
            this.setNullPose(shader, elements, stage);
            return;
        }
        var animationRegisterData = shader.animationRegisterData;
        var i;
        var len = this._vertexAnimationSet.numPoses;
        shader.setVertexConstFromArray(animationRegisterData.weightsIndex, this._weights);
        if (this._vertexAnimationSet.blendMode == VertexAnimationMode_1.VertexAnimationMode.ABSOLUTE)
            i = 1;
        else
            i = 0;
        var elementsGL;
        var k = 0;
        for (; i < len; ++i) {
            elements = this._poses[i].getGraphicAt(graphic._iIndex).elements || graphic.elements;
            elementsGL = stage.getAbstraction(elements);
            elementsGL._indexMappings = stage.getAbstraction(graphic.elements).getIndexMappings();
            if (elements.isAsset(TriangleElements_1.TriangleElements)) {
                elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.positions);
                if (shader.normalDependencies > 0)
                    elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.normals);
            }
        }
    };
    VertexAnimator.prototype.setNullPose = function (shader, elements, stage) {
        var animationRegisterData = shader.animationRegisterData;
        shader.setVertexConstFromArray(animationRegisterData.weightsIndex, this._weights);
        var elementsGL = stage.getAbstraction(elements);
        var k = 0;
        if (this._vertexAnimationSet.blendMode == VertexAnimationMode_1.VertexAnimationMode.ABSOLUTE) {
            var len = this._vertexAnimationSet.numPoses;
            for (var i = 1; i < len; ++i) {
                if (elements.isAsset(TriangleElements_1.TriangleElements)) {
                    elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.positions);
                    if (shader.normalDependencies > 0)
                        elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.normals);
                }
            }
        }
        // todo: set temp data for additive?
    };
    /**
     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
     * Needs to be called if gpu code is potentially required.
     */
    VertexAnimator.prototype.testGPUCompatibility = function (shader) {
    };
    VertexAnimator.prototype.getRenderableElements = function (renderable, sourceElements) {
        if (this._vertexAnimationSet.blendMode == VertexAnimationMode_1.VertexAnimationMode.ABSOLUTE && this._poses.length)
            return this._poses[0].getGraphicAt(renderable.graphic._iIndex).elements || sourceElements;
        //nothing to do here
        return sourceElements;
    };
    return VertexAnimator;
}(AnimatorBase_1.AnimatorBase));
exports.VertexAnimator = VertexAnimator;
