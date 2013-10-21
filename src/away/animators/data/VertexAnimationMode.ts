///<reference path="../../_definitions.ts"/>

module away.animators
{

    /**
     * Options for setting the animation mode of a vertex animator object.
     *
     * @see away.animators.VertexAnimator
     */
    export class VertexAnimationMode
    {
        /**
         * Animation mode that adds all outputs from active vertex animation state to form the current vertex animation pose.
         */
        public static ADDITIVE:String = "additive";

        /**
         * Animation mode that picks the output from a single vertex animation state to form the current vertex animation pose.
         */
        public static ABSOLUTE:String = "absolute";
    }
}
