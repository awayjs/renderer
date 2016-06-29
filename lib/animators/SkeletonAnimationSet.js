"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationSetBase_1 = require("../animators/AnimationSetBase");
/**
 * The animation data set used by skeleton-based animators, containing skeleton animation data.
 *
 * @see away.animators.SkeletonAnimator
 */
var SkeletonAnimationSet = (function (_super) {
    __extends(SkeletonAnimationSet, _super);
    /**
     * Creates a new <code>SkeletonAnimationSet</code> object.
     *
     * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
     */
    function SkeletonAnimationSet(jointsPerVertex) {
        if (jointsPerVertex === void 0) { jointsPerVertex = 4; }
        _super.call(this);
        this._jointsPerVertex = jointsPerVertex;
    }
    Object.defineProperty(SkeletonAnimationSet.prototype, "jointsPerVertex", {
        /**
         * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
         * maximum allowed value is 4.
         */
        get: function () {
            return this._jointsPerVertex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimationSet.prototype, "matricesIndex", {
        get: function () {
            return this._matricesIndex;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        this._matricesIndex = registerCache.numUsedVertexConstants;
        var indexOffset0 = this._matricesIndex;
        var indexOffset1 = this._matricesIndex + 1;
        var indexOffset2 = this._matricesIndex + 2;
        var indexStream = registerCache.getFreeVertexAttribute();
        shader.jointIndexIndex = indexStream.index;
        var weightStream = registerCache.getFreeVertexAttribute();
        shader.jointWeightIndex = weightStream.index;
        var indices = [indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w"];
        var weights = [weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w"];
        var temp1 = registerCache.getFreeVertexVectorTemp();
        var dot = "dp4";
        var code = "";
        var len = sharedRegisters.animatableAttributes.length;
        for (var i = 0; i < len; ++i) {
            var source = sharedRegisters.animatableAttributes[i];
            var target = sharedRegisters.animationTargetRegisters[i];
            for (var j = 0; j < this._jointsPerVertex; ++j) {
                registerCache.getFreeVertexConstant();
                registerCache.getFreeVertexConstant();
                registerCache.getFreeVertexConstant();
                code += dot + " " + temp1 + ".x, " + source + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" +
                    dot + " " + temp1 + ".y, " + source + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" +
                    dot + " " + temp1 + ".z, " + source + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" +
                    "mov " + temp1 + ".w, " + source + ".w\n" +
                    "mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight
                // add or mov to target. Need to write to a temp reg first, because an output can be a target
                if (j == 0)
                    code += "mov " + target + ", " + temp1 + "\n";
                else
                    code += "add " + target + ", " + target + ", " + temp1 + "\n";
            }
            // switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
            dot = "dp3";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        return "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.doneAGALCode = function (shader) {
    };
    return SkeletonAnimationSet;
}(AnimationSetBase_1.AnimationSetBase));
exports.SkeletonAnimationSet = SkeletonAnimationSet;
