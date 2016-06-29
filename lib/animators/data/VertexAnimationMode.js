"use strict";
/**
 * Options for setting the animation mode of a vertex animator object.
 *
 * @see away.animators.VertexAnimator
 */
var VertexAnimationMode = (function () {
    function VertexAnimationMode() {
    }
    /**
     * Animation mode that adds all outputs from active vertex animation state to form the current vertex animation pose.
     */
    VertexAnimationMode.ADDITIVE = "additive";
    /**
     * Animation mode that picks the output from a single vertex animation state to form the current vertex animation pose.
     */
    VertexAnimationMode.ABSOLUTE = "absolute";
    return VertexAnimationMode;
}());
exports.VertexAnimationMode = VertexAnimationMode;
