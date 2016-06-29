"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("@awayjs/display/lib/animators/nodes/AnimationNodeBase");
var SkeletonNaryLERPState_1 = require("../../animators/states/SkeletonNaryLERPState");
/**
 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var SkeletonNaryLERPNode = (function (_super) {
    __extends(SkeletonNaryLERPNode, _super);
    /**
     * Creates a new <code>SkeletonNaryLERPNode</code> object.
     */
    function SkeletonNaryLERPNode() {
        _super.call(this);
        this._iInputs = new Array();
        this._pStateClass = SkeletonNaryLERPState_1.SkeletonNaryLERPState;
    }
    Object.defineProperty(SkeletonNaryLERPNode.prototype, "numInputs", {
        get: function () {
            return this._numInputs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an integer representing the input index of the given skeleton animation node.
     *
     * @param input The skeleton animation node for with the input index is requested.
     */
    SkeletonNaryLERPNode.prototype.getInputIndex = function (input) {
        return this._iInputs.indexOf(input);
    };
    /**
     * Returns the skeleton animation node object that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node is requested.
     */
    SkeletonNaryLERPNode.prototype.getInputAt = function (index) {
        return this._iInputs[index];
    };
    /**
     * Adds a new skeleton animation node input to the animation node.
     */
    SkeletonNaryLERPNode.prototype.addInput = function (input) {
        this._iInputs[this._numInputs++] = input;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonNaryLERPNode;
}(AnimationNodeBase_1.AnimationNodeBase));
exports.SkeletonNaryLERPNode = SkeletonNaryLERPNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonNaryLERPNode;
