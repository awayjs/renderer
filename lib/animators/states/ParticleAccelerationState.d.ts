import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleAccelerationNode } from "../../animators/nodes/ParticleAccelerationNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleAccelerationState extends ParticleStateBase {
    /** @private */
    static ACCELERATION_INDEX: number;
    private _particleAccelerationNode;
    private _acceleration;
    private _halfAcceleration;
    /**
     * Defines the acceleration vector of the state, used when in global mode.
     */
    acceleration: Vector3D;
    constructor(animator: ParticleAnimator, particleAccelerationNode: ParticleAccelerationNode);
    /**
     * @inheritDoc
     */
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateAccelerationData();
}
