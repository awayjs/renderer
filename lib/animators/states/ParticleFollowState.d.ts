import { DisplayObject } from "@awayjs/display/lib/display/DisplayObject";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleFollowNode } from "../../animators/nodes/ParticleFollowNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleFollowState extends ParticleStateBase {
    /** @private */
    static FOLLOW_POSITION_INDEX: number;
    /** @private */
    static FOLLOW_ROTATION_INDEX: number;
    private _particleFollowNode;
    private _followTarget;
    private _targetPos;
    private _targetEuler;
    private _prePos;
    private _preEuler;
    private _smooth;
    private _temp;
    constructor(animator: ParticleAnimator, particleFollowNode: ParticleFollowNode);
    followTarget: DisplayObject;
    smooth: boolean;
    /**
     * @inheritDoc
     */
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private processPosition(currentTime, deltaTime, animationElements);
    private precessRotation(currentTime, deltaTime, animationElements);
    private processPositionAndRotation(currentTime, deltaTime, animationElements);
}
