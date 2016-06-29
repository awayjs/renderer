import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleVelocityState } from "../../animators/states/ParticleVelocityState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to set the starting velocity of a particle.
 */
export declare class ParticleVelocityNode extends ParticleNodeBase {
    /** @private */
    _iVelocity: Vector3D;
    /**
     * Reference for velocity node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
     */
    static VELOCITY_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleVelocityNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
     */
    constructor(mode: number, velocity?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleVelocityState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
