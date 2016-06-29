import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleOscillatorState } from "../../animators/states/ParticleOscillatorState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the position of a particle over time using simple harmonic motion.
 */
export declare class ParticleOscillatorNode extends ParticleNodeBase {
    /** @private */
    _iOscillator: Vector3D;
    /**
     * Reference for ocsillator node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the axis (x,y,z) and cycle speed (w) of the motion on the particle.
     */
    static OSCILLATOR_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleOscillatorNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
     */
    constructor(mode: number, oscillator?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleOscillatorState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
