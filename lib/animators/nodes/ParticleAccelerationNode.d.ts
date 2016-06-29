import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleAccelerationState } from "../../animators/states/ParticleAccelerationState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
 */
export declare class ParticleAccelerationNode extends ParticleNodeBase {
    /** @private */
    _acceleration: Vector3D;
    /**
     * Reference for acceleration node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the direction of acceleration on the particle.
     */
    static ACCELERATION_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleAccelerationNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
     */
    constructor(mode: number, acceleration?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleAccelerationState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
