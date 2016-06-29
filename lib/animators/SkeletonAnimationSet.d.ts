import { IAnimationSet } from "@awayjs/display/lib/animators/IAnimationSet";
import { AnimationSetBase } from "../animators/AnimationSetBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 * The animation data set used by skeleton-based animators, containing skeleton animation data.
 *
 * @see away.animators.SkeletonAnimator
 */
export declare class SkeletonAnimationSet extends AnimationSetBase implements IAnimationSet {
    private _jointsPerVertex;
    private _matricesIndex;
    /**
     * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
     * maximum allowed value is 4.
     */
    readonly jointsPerVertex: number;
    readonly matricesIndex: number;
    /**
     * Creates a new <code>SkeletonAnimationSet</code> object.
     *
     * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
     */
    constructor(jointsPerVertex?: number);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    getAGALFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, shadedTarget: ShaderRegisterElement): string;
    /**
     * @inheritDoc
     */
    getAGALUVCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    doneAGALCode(shader: ShaderBase): void;
}
