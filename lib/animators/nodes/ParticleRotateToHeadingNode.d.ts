import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleRotateToHeadingState } from "../../animators/states/ParticleRotateToHeadingState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the rotation of a particle to match its heading vector.
 */
export declare class ParticleRotateToHeadingNode extends ParticleNodeBase {
    /**
     * Creates a new <code>ParticleBillboardNode</code>
     */
    constructor();
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleRotateToHeadingState;
    /**
     * @inheritDoc
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
}
