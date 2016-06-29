import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleRotationalVelocityState } from "../../animators/states/ParticleRotationalVelocityState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to set the starting rotational velocity of a particle.
 */
export declare class ParticleRotationalVelocityNode extends ParticleNodeBase {
    /** @private */
    _iRotationalVelocity: Vector3D;
    /**
     * Reference for rotational velocity node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
     */
    static ROTATIONALVELOCITY_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleRotationalVelocityNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     */
    constructor(mode: number, rotationalVelocity?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleRotationalVelocityState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
