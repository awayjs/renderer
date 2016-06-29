import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleOrbitState } from "../../animators/states/ParticleOrbitState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the position of a particle over time around a circular orbit.
 */
export declare class ParticleOrbitNode extends ParticleNodeBase {
    /** @private */
    _iUsesEulers: boolean;
    /** @private */
    _iUsesCycle: boolean;
    /** @private */
    _iUsesPhase: boolean;
    /** @private */
    _iRadius: number;
    /** @private */
    _iCycleDuration: number;
    /** @private */
    _iCyclePhase: number;
    /** @private */
    _iEulers: Vector3D;
    /**
     * Reference for orbit node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the radius (x), cycle speed (y) and cycle phase (z) of the motion on the particle.
     */
    static ORBIT_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleOrbitNode</code> object.
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesEulers      Defines whether the node uses the <code>eulers</code> property in the shader to calculate a rotation on the orbit. Defaults to true.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the orbit independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
     * @param    [optional] radius          Defines the radius of the orbit when in global mode. Defaults to 100.
     * @param    [optional] cycleDuration   Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     * @param    [optional] eulers          Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
     */
    constructor(mode: number, usesEulers?: boolean, usesCycle?: boolean, usesPhase?: boolean, radius?: number, cycleDuration?: number, cyclePhase?: number, eulers?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleOrbitState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
