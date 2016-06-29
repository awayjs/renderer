import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleInitialColorNode } from "../../animators/nodes/ParticleInitialColorNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
*
*/
export declare class ParticleInitialColorState extends ParticleStateBase {
    /** @private */
    static MULTIPLIER_INDEX: number;
    /** @private */
    static OFFSET_INDEX: number;
    private _particleInitialColorNode;
    private _usesMultiplier;
    private _usesOffset;
    private _initialColor;
    private _multiplierData;
    private _offsetData;
    constructor(animator: ParticleAnimator, particleInitialColorNode: ParticleInitialColorNode);
    /**
     * Defines the initial color transform of the state, when in global mode.
     */
    initialColor: ColorTransform;
    /**
     * @inheritDoc
     */
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateColorData();
}
