"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("@awayjs/display/lib/animators/nodes/AnimationNodeBase");
var SkeletonBinaryLERPState_1 = require("../../animators/states/SkeletonBinaryLERPState");
/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var SkeletonBinaryLERPNode = (function (_super) {
    __extends(SkeletonBinaryLERPNode, _super);
    /**
     * Creates a new <code>SkeletonBinaryLERPNode</code> object.
     */
    function SkeletonBinaryLERPNode() {
        _super.call(this);
        this._pStateClass = SkeletonBinaryLERPState_1.SkeletonBinaryLERPState;
    }
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonBinaryLERPNode;
}(AnimationNodeBase_1.AnimationNodeBase));
exports.SkeletonBinaryLERPNode = SkeletonBinaryLERPNode;
