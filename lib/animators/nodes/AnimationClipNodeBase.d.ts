import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
/**
 * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
 */
export declare class AnimationClipNodeBase extends AnimationNodeBase {
    _pLooping: boolean;
    _pTotalDuration: number;
    _pLastFrame: number;
    _pStitchDirty: boolean;
    _pStitchFinalFrame: boolean;
    _pNumFrames: number;
    _pDurations: Array<number>;
    _pTotalDelta: Vector3D;
    fixedFrameRate: boolean;
    /**
     * Determines whether the contents of the animation node have looping characteristics enabled.
     */
    looping: boolean;
    /**
     * Defines if looping content blends the final frame of animation data with the first (true) or works on the
     * assumption that both first and last frames are identical (false). Defaults to false.
     */
    stitchFinalFrame: boolean;
    readonly totalDuration: number;
    readonly totalDelta: Vector3D;
    readonly lastFrame: number;
    /**
     * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
     */
    readonly durations: Array<number>;
    /**
     * Creates a new <code>AnimationClipNodeBase</code> object.
     */
    constructor();
    /**
     * Updates the node's final frame stitch state.
     *
     * @see #stitchFinalFrame
     */
    _pUpdateStitch(): void;
}
