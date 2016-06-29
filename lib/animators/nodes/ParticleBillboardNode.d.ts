import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleBillboardState } from "../../animators/states/ParticleBillboardState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node that controls the rotation of a particle to always face the camera.
 */
export declare class ParticleBillboardNode extends ParticleNodeBase {
    /** @private */
    _iBillboardAxis: Vector3D;
    /**
     * Creates a new <code>ParticleBillboardNode</code>
     */
    constructor(billboardAxis?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleBillboardState;
    /**
     * @inheritDoc
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
}
