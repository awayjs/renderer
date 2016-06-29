import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { IAnimationState } from "../../animators/states/IAnimationState";
/**
 *
 */
export declare class AnimationStateBase implements IAnimationState {
    _pAnimationNode: AnimationNodeBase;
    _pRootDelta: Vector3D;
    _pPositionDeltaDirty: boolean;
    _pTime: number;
    _pStartTime: number;
    _pAnimator: AnimatorBase;
    /**
     * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
     */
    readonly positionDelta: Vector3D;
    constructor(animator: AnimatorBase, animationNode: AnimationNodeBase);
    /**
     * Resets the start time of the node to a  new value.
     *
     * @param startTime The absolute start time (in milliseconds) of the node's starting time.
     */
    offset(startTime: number): void;
    /**
     * Updates the configuration of the node to its current state.
     *
     * @param time The absolute time (in milliseconds) of the animator's play head position.
     *
     * @see AnimatorBase#update()
     */
    update(time: number): void;
    /**
     * Sets the animation phase of the node.
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    phase(value: number): void;
    /**
     * Updates the node's internal playhead position.
     *
     * @param time The local time (in milliseconds) of the node's playhead position.
     */
    _pUpdateTime(time: number): void;
    /**
     * Updates the node's root delta position
     */
    _pUpdatePositionDelta(): void;
}
