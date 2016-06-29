import { ColorTransform } from "@awayjs/core/lib/geom/ColorTransform";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ColorSegmentPoint } from "../../animators/data/ColorSegmentPoint";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 *
 */
export declare class ParticleSegmentedColorNode extends ParticleNodeBase {
    /** @private */
    _iUsesMultiplier: boolean;
    /** @private */
    _iUsesOffset: boolean;
    /** @private */
    _iStartColor: ColorTransform;
    /** @private */
    _iEndColor: ColorTransform;
    /** @private */
    _iNumSegmentPoint: number;
    /** @private */
    _iSegmentPoints: Array<ColorSegmentPoint>;
    constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: ColorTransform, endColor: ColorTransform, segmentPoints: Array<ColorSegmentPoint>);
    /**
     * @inheritDoc
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
}
