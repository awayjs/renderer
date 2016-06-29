import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ColorSegmentPoint } from "../../animators/data/ColorSegmentPoint";
import { ParticleSegmentedColorNode } from "../../animators/nodes/ParticleSegmentedColorNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 *
 */
export declare class ParticleSegmentedColorState extends ParticleStateBase {
    /** @private */
    static START_MULTIPLIER_INDEX: number;
    /** @private */
    static START_OFFSET_INDEX: number;
    /** @private */
    static TIME_DATA_INDEX: number;
    private _usesMultiplier;
    private _usesOffset;
    private _startColor;
    private _endColor;
    private _segmentPoints;
    private _numSegmentPoint;
    private _timeLifeData;
    private _multiplierData;
    private _offsetData;
    /**
     * Defines the start color transform of the state, when in global mode.
     */
    startColor: ColorTransform;
    /**
     * Defines the end color transform of the state, when in global mode.
     */
    endColor: ColorTransform;
    /**
     * Defines the number of segments.
     */
    readonly numSegmentPoint: number;
    /**
     * Defines the key points of color
     */
    segmentPoints: Array<ColorSegmentPoint>;
    readonly usesMultiplier: boolean;
    readonly usesOffset: boolean;
    constructor(animator: ParticleAnimator, particleSegmentedColorNode: ParticleSegmentedColorNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateColorData();
}
