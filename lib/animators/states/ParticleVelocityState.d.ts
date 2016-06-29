import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleVelocityNode } from "../../animators/nodes/ParticleVelocityNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleVelocityState extends ParticleStateBase {
    /** @private */
    static VELOCITY_INDEX: number;
    private _particleVelocityNode;
    private _velocity;
    /**
     * Defines the default velocity vector of the state, used when in global mode.
     */
    velocity: Vector3D;
    /**
     *
     */
    getVelocities(): Array<Vector3D>;
    setVelocities(value: Array<Vector3D>): void;
    constructor(animator: ParticleAnimator, particleVelocityNode: ParticleVelocityNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
}
