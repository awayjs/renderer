import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { AnimatorBase } from "../animators/AnimatorBase";
import { ParticleAnimationSet } from "../animators/ParticleAnimationSet";
import { ShaderBase } from "../shaders/ShaderBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
/**
 * Provides an interface for assigning paricle-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent sprite is particle geometry
 *
 * @see away.base.ParticleGraphics
 */
export declare class ParticleAnimator extends AnimatorBase {
    private _particleAnimationSet;
    private _animationParticleStates;
    private _animatorParticleStates;
    private _timeParticleStates;
    private _totalLenOfOneVertex;
    private _animatorSubGeometries;
    /**
     * Creates a new <code>ParticleAnimator</code> object.
     *
     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
     */
    constructor(particleAnimationSet: ParticleAnimationSet);
    /**
     * @inheritDoc
     */
    clone(): AnimatorBase;
    /**
     * @inheritDoc
     */
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    /**
     * @inheritDoc
     */
    testGPUCompatibility(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    start(): void;
    /**
     * @inheritDoc
     */
    _pUpdateDeltaTime(dt: number): void;
    /**
     * @inheritDoc
     */
    resetTime(offset?: number): void;
    dispose(): void;
    private getAnimatorElements(graphic);
}
