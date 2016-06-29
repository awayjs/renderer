"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("@awayjs/display/lib/animators/nodes/AnimationNodeBase");
var SkeletonDirectionalState_1 = require("../../animators/states/SkeletonDirectionalState");
/**
 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
 */
var SkeletonDirectionalNode = (function (_super) {
    __extends(SkeletonDirectionalNode, _super);
    function SkeletonDirectionalNode() {
        _super.call(this);
        this._pStateClass = SkeletonDirectionalState_1.SkeletonDirectionalState;
    }
    /**
     * @inheritDoc
     */
    SkeletonDirectionalNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonDirectionalNode;
}(AnimationNodeBase_1.AnimationNodeBase));
exports.SkeletonDirectionalNode = SkeletonDirectionalNode;
