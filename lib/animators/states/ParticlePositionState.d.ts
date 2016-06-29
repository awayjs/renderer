import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticlePositionNode } from "../../animators/nodes/ParticlePositionNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 * @author ...
 */
export declare class ParticlePositionState extends ParticleStateBase {
    /** @private */
    static POSITION_INDEX: number;
    private _particlePositionNode;
    private _position;
    /**
     * Defines the position of the particle when in global mode. Defaults to 0,0,0.
     */
    position: Vector3D;
    /**
     *
     */
    getPositions(): Array<Vector3D>;
    setPositions(value: Array<Vector3D>): void;
    constructor(animator: ParticleAnimator, particlePositionNode: ParticlePositionNode);
    /**
     * @inheritDoc
     */
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
}
