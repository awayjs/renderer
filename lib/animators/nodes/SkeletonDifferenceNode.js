"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("@awayjs/display/lib/animators/nodes/AnimationNodeBase");
var SkeletonDifferenceState_1 = require("../../animators/states/SkeletonDifferenceState");
/**
 * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
 */
var SkeletonDifferenceNode = (function (_super) {
    __extends(SkeletonDifferenceNode, _super);
    /**
     * Creates a new <code>SkeletonAdditiveNode</code> object.
     */
    function SkeletonDifferenceNode() {
        _super.call(this);
        this._pStateClass = SkeletonDifferenceState_1.SkeletonDifferenceState;
    }
    /**
     * @inheritDoc
     */
    SkeletonDifferenceNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonDifferenceNode;
}(AnimationNodeBase_1.AnimationNodeBase));
exports.SkeletonDifferenceNode = SkeletonDifferenceNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonDifferenceNode;
