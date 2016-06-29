import { AnimatorBase } from "../../animators/AnimatorBase";
import { AnimationClipNodeBase } from "../../animators/nodes/AnimationClipNodeBase";
import { AnimationStateBase } from "../../animators/states/AnimationStateBase";
/**
 *
 */
export declare class AnimationClipState extends AnimationStateBase {
    private _animationClipNode;
    private _animationStatePlaybackComplete;
    _pBlendWeight: number;
    _pCurrentFrame: number;
    _pNextFrame: number;
    _pOldFrame: number;
    _pTimeDir: number;
    _pFramesDirty: boolean;
    /**
     * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
     * between the current frame (0) and next frame (1) of the animation.
     *
     * @see #currentFrame
     * @see #nextFrame
     */
    readonly blendWeight: number;
    /**
     * Returns the current frame of animation in the clip based on the internal playhead position.
     */
    readonly currentFrame: number;
    /**
     * Returns the next frame of animation in the clip based on the internal playhead position.
     */
    readonly nextFrame: number;
    constructor(animator: AnimatorBase, animationClipNode: AnimationClipNodeBase);
    /**
     * @inheritDoc
     */
    update(time: number): void;
    /**
     * @inheritDoc
     */
    phase(value: number): void;
    /**
     * @inheritDoc
     */
    _pUpdateTime(time: number): void;
    /**
     * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
     *
     * @see #currentFrame
     * @see #nextFrame
     * @see #blendWeight
     */
    _pUpdateFrames(): void;
    private notifyPlaybackComplete();
}
