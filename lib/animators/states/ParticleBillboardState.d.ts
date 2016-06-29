import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleBillboardNode } from "../../animators/nodes/ParticleBillboardNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleBillboardState extends ParticleStateBase {
    /** @private */
    static MATRIX_INDEX: number;
    private _matrix;
    private _billboardAxis;
    /**
     *
     */
    constructor(animator: ParticleAnimator, particleNode: ParticleBillboardNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    /**
     * Defines the billboard axis.
     */
    billboardAxis: Vector3D;
}
