import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleBezierCurveNode } from "../../animators/nodes/ParticleBezierCurveNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleBezierCurveState extends ParticleStateBase {
    /** @private */
    static BEZIER_CONTROL_INDEX: number;
    /** @private */
    static BEZIER_END_INDEX: number;
    private _particleBezierCurveNode;
    private _controlPoint;
    private _endPoint;
    /**
     * Defines the default control point of the node, used when in global mode.
     */
    controlPoint: Vector3D;
    /**
     * Defines the default end point of the node, used when in global mode.
     */
    endPoint: Vector3D;
    constructor(animator: ParticleAnimator, particleBezierCurveNode: ParticleBezierCurveNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
}
