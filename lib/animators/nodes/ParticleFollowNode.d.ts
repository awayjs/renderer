import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleFollowState } from "../../animators/states/ParticleFollowState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to create a follow behaviour on a particle system.
 */
export declare class ParticleFollowNode extends ParticleNodeBase {
    /** @private */
    _iUsesPosition: boolean;
    /** @private */
    _iUsesRotation: boolean;
    /** @private */
    _iSmooth: boolean;
    /**
     * Creates a new <code>ParticleFollowNode</code>
     *
     * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
     * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
     * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
     */
    constructor(usesPosition?: boolean, usesRotation?: boolean, smooth?: boolean);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleFollowState;
}
