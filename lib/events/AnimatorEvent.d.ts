import { EventBase } from "@awayjs/core/lib/events/EventBase";
import { AnimatorBase } from "../animators/AnimatorBase";
/**
 * Dispatched to notify changes in an animator's state.
 */
export declare class AnimatorEvent extends EventBase {
    /**
     * Defines the value of the type property of a start event object.
     */
    static START: string;
    /**
     * Defines the value of the type property of a stop event object.
     */
    static STOP: string;
    /**
     * Defines the value of the type property of a cycle complete event object.
     */
    static CYCLE_COMPLETE: string;
    private _animator;
    /**
     * Create a new <code>AnimatorEvent</code> object.
     *
     * @param type The event type.
     * @param animator The animator object that is the subject of this event.
     */
    constructor(type: string, animator: AnimatorBase);
    readonly animator: AnimatorBase;
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current event object.
     */
    clone(): AnimatorEvent;
}
