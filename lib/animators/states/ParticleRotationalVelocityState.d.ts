import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleRotationalVelocityNode } from "../../animators/nodes/ParticleRotationalVelocityNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleRotationalVelocityState extends ParticleStateBase {
    /** @private */
    static ROTATIONALVELOCITY_INDEX: number;
    private _particleRotationalVelocityNode;
    private _rotationalVelocityData;
    private _rotationalVelocity;
    /**
     * Defines the default rotationalVelocity of the state, used when in global mode.
     */
    rotationalVelocity: Vector3D;
    /**
     *
     */
    getRotationalVelocities(): Array<Vector3D>;
    setRotationalVelocities(value: Array<Vector3D>): void;
    constructor(animator: ParticleAnimator, particleRotationNode: ParticleRotationalVelocityNode);
    /**
     * @inheritDoc
     */
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateRotationalVelocityData();
}
