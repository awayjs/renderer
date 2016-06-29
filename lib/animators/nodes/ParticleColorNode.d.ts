import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleColorState } from "../../animators/states/ParticleColorState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the color variation of a particle over time.
 */
export declare class ParticleColorNode extends ParticleNodeBase {
    /** @private */
    _iUsesMultiplier: boolean;
    /** @private */
    _iUsesOffset: boolean;
    /** @private */
    _iUsesCycle: boolean;
    /** @private */
    _iUsesPhase: boolean;
    /** @private */
    _iStartColor: ColorTransform;
    /** @private */
    _iEndColor: ColorTransform;
    /** @private */
    _iCycleDuration: number;
    /** @private */
    _iCyclePhase: number;
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the start color transform applied to the particle.
     */
    static COLOR_START_COLORTRANSFORM: string;
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the end color transform applied to the particle.
     */
    static COLOR_END_COLORTRANSFORM: string;
    /**
     * Creates a new <code>ParticleColorNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesMultiplier  Defines whether the node uses multiplier data in the shader for its color transformations. Defaults to true.
     * @param    [optional] usesOffset      Defines whether the node uses offset data in the shader for its color transformations. Defaults to true.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the animation independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
     * @param    [optional] startColor      Defines the default start color transform of the node, when in global mode.
     * @param    [optional] endColor        Defines the default end color transform of the node, when in global mode.
     * @param    [optional] cycleDuration   Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, usesCycle?: boolean, usesPhase?: boolean, startColor?: ColorTransform, endColor?: ColorTransform, cycleDuration?: number, cyclePhase?: number);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleColorState;
    /**
     * @inheritDoc
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
