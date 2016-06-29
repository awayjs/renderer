import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleSpriteSheetState } from "../../animators/states/ParticleSpriteSheetState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used when a spritesheet texture is required to animate the particle.
 * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
 */
export declare class ParticleSpriteSheetNode extends ParticleNodeBase {
    /** @private */
    _iUsesCycle: boolean;
    /** @private */
    _iUsesPhase: boolean;
    /** @private */
    _iTotalFrames: number;
    /** @private */
    _iNumColumns: number;
    /** @private */
    _iNumRows: number;
    /** @private */
    _iCycleDuration: number;
    /** @private */
    _iCyclePhase: number;
    /**
     * Reference for spritesheet node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
     */
    static UV_VECTOR3D: string;
    /**
     * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
     */
    readonly numColumns: number;
    /**
     * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
     */
    readonly numRows: number;
    /**
     * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
     */
    readonly totalFrames: number;
    /**
     * Creates a new <code>ParticleSpriteSheetNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] numColumns      Defines the number of columns in the spritesheet, when in global mode. Defaults to 1.
     * @param    [optional] numRows         Defines the number of rows in the spritesheet, when in global mode. Defaults to 1.
     * @param    [optional] cycleDuration   Defines the default cycle duration in seconds, when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the default cycle phase, when in global mode. Defaults to 0.
     * @param    [optional] totalFrames     Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows.
     * @param    [optional] looping         Defines whether the spritesheet animation is set to loop indefinitely. Defaults to true.
     */
    constructor(mode: number, usesCycle: boolean, usesPhase: boolean, numColumns?: number, numRows?: number, cycleDuration?: number, cyclePhase?: number, totalFrames?: number);
    /**
     * @inheritDoc
     */
    getAGALUVCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleSpriteSheetState;
    /**
     * @inheritDoc
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
