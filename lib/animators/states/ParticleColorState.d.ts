import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleColorNode } from "../../animators/nodes/ParticleColorNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 * @author ...
 */
export declare class ParticleColorState extends ParticleStateBase {
    /** @private */
    static START_MULTIPLIER_INDEX: number;
    /** @private */
    static DELTA_MULTIPLIER_INDEX: number;
    /** @private */
    static START_OFFSET_INDEX: number;
    /** @private */
    static DELTA_OFFSET_INDEX: number;
    /** @private */
    static CYCLE_INDEX: number;
    private _particleColorNode;
    private _usesMultiplier;
    private _usesOffset;
    private _usesCycle;
    private _usesPhase;
    private _startColor;
    private _endColor;
    private _cycleDuration;
    private _cyclePhase;
    private _cycleData;
    private _startMultiplierData;
    private _deltaMultiplierData;
    private _startOffsetData;
    private _deltaOffsetData;
    /**
     * Defines the start color transform of the state, when in global mode.
     */
    startColor: ColorTransform;
    /**
     * Defines the end color transform of the state, when in global mode.
     */
    endColor: ColorTransform;
    /**
     * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     */
    cycleDuration: number;
    /**
     * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    cyclePhase: number;
    constructor(animator: ParticleAnimator, particleColorNode: ParticleColorNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateColorData();
}
