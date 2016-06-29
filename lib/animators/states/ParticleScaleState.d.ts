import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleScaleNode } from "../../animators/nodes/ParticleScaleNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleScaleState extends ParticleStateBase {
    /** @private */
    static SCALE_INDEX: number;
    private _particleScaleNode;
    private _usesCycle;
    private _usesPhase;
    private _minScale;
    private _maxScale;
    private _cycleDuration;
    private _cyclePhase;
    private _scaleData;
    /**
     * Defines the end scale of the state, when in global mode. Defaults to 1.
     */
    minScale: number;
    /**
     * Defines the end scale of the state, when in global mode. Defaults to 1.
     */
    maxScale: number;
    /**
     * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     */
    cycleDuration: number;
    /**
     * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    cyclePhase: number;
    constructor(animator: ParticleAnimator, particleScaleNode: ParticleScaleNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateScaleData();
}
