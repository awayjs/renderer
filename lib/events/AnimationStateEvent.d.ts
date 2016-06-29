import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { EventBase } from "@awayjs/core/lib/events/EventBase";
import { AnimatorBase } from "../animators/AnimatorBase";
import { IAnimationState } from "../animators/states/IAnimationState";
/**
 * Dispatched to notify changes in an animation state's state.
 */
export declare class AnimationStateEvent extends EventBase {
    /**
     * Dispatched when a non-looping clip node inside an animation state reaches the end of its timeline.
     */
    static PLAYBACK_COMPLETE: string;
    static TRANSITION_COMPLETE: string;
    private _animator;
    private _animationState;
    private _animationNode;
    /**
     * Create a new <code>AnimatonStateEvent</code>
     *
     * @param type The event type.
     * @param animator The animation state object that is the subject of this event.
     * @param animationNode The animation node inside the animation state from which the event originated.
     */
    constructor(type: string, animator: AnimatorBase, animationState: IAnimationState, animationNode: AnimationNodeBase);
    /**
     * The animator object that is the subject of this event.
     */
    readonly animator: AnimatorBase;
    /**
     * The animation state object that is the subject of this event.
     */
    readonly animationState: IAnimationState;
    /**
     * The animation node inside the animation state from which the event originated.
     */
    readonly animationNode: AnimationNodeBase;
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    clone(): AnimationStateEvent;
}
