import { SkeletonBinaryLERPNode } from "../../animators/nodes/SkeletonBinaryLERPNode";
/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
export declare class CrossfadeTransitionNode extends SkeletonBinaryLERPNode {
    blendSpeed: number;
    startBlend: number;
    /**
     * Creates a new <code>CrossfadeTransitionNode</code> object.
     */
    constructor();
}
