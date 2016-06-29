"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SkeletonBinaryLERPNode_1 = require("../../animators/nodes/SkeletonBinaryLERPNode");
var CrossfadeTransitionState_1 = require("../../animators/transitions/CrossfadeTransitionState");
/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var CrossfadeTransitionNode = (function (_super) {
    __extends(CrossfadeTransitionNode, _super);
    /**
     * Creates a new <code>CrossfadeTransitionNode</code> object.
     */
    function CrossfadeTransitionNode() {
        _super.call(this);
        this._pStateClass = CrossfadeTransitionState_1.CrossfadeTransitionState;
    }
    return CrossfadeTransitionNode;
}(SkeletonBinaryLERPNode_1.SkeletonBinaryLERPNode));
exports.CrossfadeTransitionNode = CrossfadeTransitionNode;
