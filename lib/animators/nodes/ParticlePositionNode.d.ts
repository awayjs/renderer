import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticlePositionState } from "../../animators/states/ParticlePositionState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to set the starting position of a particle.
 */
export declare class ParticlePositionNode extends ParticleNodeBase {
    /** @private */
    _iPosition: Vector3D;
    /**
     * Reference for position node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing position of the particle.
     */
    static POSITION_VECTOR3D: string;
    /**
     * Creates a new <code>ParticlePositionNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
     */
    constructor(mode: number, position?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticlePositionState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
