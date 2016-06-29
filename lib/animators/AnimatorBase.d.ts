import { AssetBase } from "@awayjs/core/lib/library/AssetBase";
import { IAnimationSet } from "@awayjs/display/lib/animators/IAnimationSet";
import { IAnimator } from "@awayjs/display/lib/animators/IAnimator";
import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { ElementsBase } from "@awayjs/display/lib/graphics/ElementsBase";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Sprite } from "@awayjs/display/lib/display/Sprite";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { IAnimationState } from "../animators/states/IAnimationState";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderBase } from "../shaders/ShaderBase";
/**
 * Dispatched when playback of an animation inside the animator object starts.
 *
 * @eventType away3d.events.AnimatorEvent
 */
/**
 * Dispatched when playback of an animation inside the animator object stops.
 *
 * @eventType away3d.events.AnimatorEvent
 */
/**
 * Dispatched when playback of an animation reaches the end of an animation.
 *
 * @eventType away3d.events.AnimatorEvent
 */
/**
 * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
 *
 * @see away.animators.AnimationSetBase
 */
export declare class AnimatorBase extends AssetBase implements IAnimator {
    static assetType: string;
    private _broadcaster;
    private _isPlaying;
    private _autoUpdate;
    private _startEvent;
    private _stopEvent;
    private _cycleEvent;
    private _time;
    private _playbackSpeed;
    _pAnimationSet: IAnimationSet;
    _pOwners: Array<Sprite>;
    _pActiveNode: AnimationNodeBase;
    _pActiveState: IAnimationState;
    _pActiveAnimationName: string;
    _pAbsoluteTime: number;
    private _animationStates;
    /**
     * Enables translation of the animated sprite from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
     *
     * @see away.animators.IAnimationState#positionDelta
     */
    updatePosition: boolean;
    getAnimationState(node: AnimationNodeBase): IAnimationState;
    getAnimationStateByName(name: string): IAnimationState;
    /**
     * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
     *
     * @see #time
     * @see #playbackSpeed
     */
    readonly absoluteTime: number;
    /**
     * Returns the animation data set in use by the animator.
     */
    readonly animationSet: IAnimationSet;
    /**
     * Returns the current active animation state.
     */
    readonly activeState: IAnimationState;
    /**
     * Returns the current active animation node.
     */
    readonly activeAnimation: AnimationNodeBase;
    /**
     * Returns the current active animation node.
     */
    readonly activeAnimationName: string;
    /**
     * Determines whether the animators internal update mechanisms are active. Used in cases
     * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
     * Defaults to true.
     *
     * @see #time
     * @see #update()
     */
    autoUpdate: boolean;
    /**
     * Gets and sets the internal time clock of the animator.
     */
    time: number;
    /**
     * Sets the animation phase of the current active state's animation clip(s).
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    phase(value: number): void;
    /**
     * Creates a new <code>AnimatorBase</code> object.
     *
     * @param animationSet The animation data set to be used by the animator object.
     */
    constructor(animationSet: IAnimationSet);
    /**
     * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
     */
    playbackSpeed: number;
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * Resumes the automatic playback clock controling the active state of the animator.
     */
    start(): void;
    /**
     * Pauses the automatic playback clock of the animator, in case manual updates are required via the
     * <code>time</code> property or <code>update()</code> method.
     *
     * @see #time
     * @see #update()
     */
    stop(): void;
    /**
     * Provides a way to manually update the active state of the animator when automatic
     * updates are disabled.
     *
     * @see #stop()
     * @see #autoUpdate
     */
    update(time: number): void;
    reset(name: string, offset?: number): void;
    /**
     * Used by the sprite object to which the animator is applied, registers the owner for internal use.
     *
     * @private
     */
    addOwner(sprite: Sprite): void;
    /**
     * Used by the sprite object from which the animator is removed, unregisters the owner for internal use.
     *
     * @private
     */
    removeOwner(sprite: Sprite): void;
    /**
     * Internal abstract method called when the time delta property of the animator's contents requires updating.
     *
     * @private
     */
    _pUpdateDeltaTime(dt: number): void;
    /**
     * Enter frame event handler for automatically updating the active state of the animator.
     */
    private onEnterFrame(event?);
    private applyPositionDelta();
    /**
     *  for internal use.
     *
     * @private
     */
    dispatchCycleEvent(): void;
    /**
     * @inheritDoc
     */
    clone(): AnimatorBase;
    /**
     * @inheritDoc
     */
    dispose(): void;
    invalidateElements(): void;
    /**
     * @inheritDoc
     */
    testGPUCompatibility(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    readonly assetType: string;
    getRenderableElements(renderable: GL_RenderableBase, sourceElements: ElementsBase): ElementsBase;
}
