import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 *
 */
export declare class ParticleInitialColorNode extends ParticleNodeBase {
    /** @private */
    _iUsesMultiplier: boolean;
    /** @private */
    _iUsesOffset: boolean;
    /** @private */
    _iInitialColor: ColorTransform;
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
     */
    static COLOR_INITIAL_COLORTRANSFORM: string;
    constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, initialColor?: ColorTransform);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
