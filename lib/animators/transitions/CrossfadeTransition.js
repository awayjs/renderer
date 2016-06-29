"use strict";
var CrossfadeTransitionNode_1 = require("../../animators/transitions/CrossfadeTransitionNode");
/**
 *
 */
var CrossfadeTransition = (function () {
    function CrossfadeTransition(blendSpeed) {
        this.blendSpeed = 0.5;
        this.blendSpeed = blendSpeed;
    }
    CrossfadeTransition.prototype.getAnimationNode = function (animator, startNode, endNode, startBlend) {
        var crossFadeTransitionNode = new CrossfadeTransitionNode_1.CrossfadeTransitionNode();
        crossFadeTransitionNode.inputA = startNode;
        crossFadeTransitionNode.inputB = endNode;
        crossFadeTransitionNode.blendSpeed = this.blendSpeed;
        crossFadeTransitionNode.startBlend = startBlend;
        return crossFadeTransitionNode;
    };
    return CrossfadeTransition;
}());
exports.CrossfadeTransition = CrossfadeTransition;
