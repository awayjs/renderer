import { Stage } from "@awayjs/stage/lib/base/Stage";
import { INode } from "@awayjs/display/lib/partition/INode";
import { RendererBase } from "./RendererBase";
/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
export declare class DistanceRenderer extends RendererBase {
    /**
     * Creates a new DistanceRenderer object.
     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
     */
    constructor(stage?: Stage);
    /**
     *
     */
    enterNode(node: INode): boolean;
}
