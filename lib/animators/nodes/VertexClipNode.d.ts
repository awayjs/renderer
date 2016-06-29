import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Graphics } from "@awayjs/display/lib/graphics/Graphics";
import { AnimationClipNodeBase } from "../../animators/nodes/AnimationClipNodeBase";
/**
 * A vertex animation node containing time-based animation data as individual geometry obejcts.
 */
export declare class VertexClipNode extends AnimationClipNodeBase {
    private _frames;
    private _translations;
    /**
     * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
     */
    readonly frames: Array<Graphics>;
    /**
     * Creates a new <code>VertexClipNode</code> object.
     */
    constructor();
    /**
     * Adds a geometry object to the internal timeline of the animation node.
     *
     * @param geometry The geometry object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     * @param translation The absolute translation of the frame, used in root delta calculations for sprite movement.
     */
    addFrame(geometry: Graphics, duration: number, translation?: Vector3D): void;
    /**
     * @inheritDoc
     */
    _pUpdateStitch(): void;
}
