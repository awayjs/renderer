import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleRotateToPositionNode } from "../../animators/nodes/ParticleRotateToPositionNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleRotateToPositionState extends ParticleStateBase {
    /** @private */
    static MATRIX_INDEX: number;
    /** @private */
    static POSITION_INDEX: number;
    private _particleRotateToPositionNode;
    private _position;
    private _matrix;
    private _offset;
    /**
     * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
     */
    position: Vector3D;
    constructor(animator: ParticleAnimator, particleRotateToPositionNode: ParticleRotateToPositionNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
}
