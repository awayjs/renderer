import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleRotateToPositionState } from "../../animators/states/ParticleRotateToPositionState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the rotation of a particle to face to a position
 */
export declare class ParticleRotateToPositionNode extends ParticleNodeBase {
    /** @private */
    _iPosition: Vector3D;
    /**
     * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the position that the particle must face.
     */
    static POSITION_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleRotateToPositionNode</code>
     */
    constructor(mode: number, position?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleRotateToPositionState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
