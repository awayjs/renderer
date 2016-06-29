import { IAsset } from "@awayjs/core/lib/library/IAsset";
import { AssetBase } from "@awayjs/core/lib/library/AssetBase";
import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
 *
 * @see away.animators.AnimatorBase
 */
export declare class AnimationSetBase extends AssetBase implements IAsset {
    static assetType: string;
    private _usesCPU;
    private _animations;
    private _animationNames;
    private _animationDictionary;
    constructor();
    /**
     * Retrieves a temporary GPU register that's still free.
     *
     * @param exclude An array of non-free temporary registers.
     * @param excludeAnother An additional register that's not free.
     * @return A temporary register that can be used.
     */
    _pFindTempReg(exclude: Array<string>, excludeAnother?: string): string;
    /**
     * Indicates whether the properties of the animation data contained within the set combined with
     * the vertex registers already in use on shading materials allows the animation data to utilise
     * GPU calls.
     */
    readonly usesCPU: boolean;
    /**
     * Called by the material to reset the GPU indicator before testing whether register space in the shader
     * is available for running GPU-based animation code.
     *
     * @private
     */
    resetGPUCompatibility(): void;
    cancelGPUCompatibility(): void;
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
    /**
     * @inheritDoc
     */
    readonly assetType: string;
    /**
     * Returns a vector of animation state objects that make up the contents of the animation data set.
     */
    readonly animations: Array<AnimationNodeBase>;
    /**
     * Returns a vector of animation state objects that make up the contents of the animation data set.
     */
    readonly animationNames: Array<string>;
    /**
     * Check to determine whether a state is registered in the animation set under the given name.
     *
     * @param stateName The name of the animation state object to be checked.
     */
    hasAnimation(name: string): boolean;
    /**
     * Retrieves the animation state object registered in the animation data set under the given name.
     *
     * @param stateName The name of the animation state object to be retrieved.
     */
    getAnimation(name: string): AnimationNodeBase;
    /**
     * Adds an animation state object to the aniamtion data set under the given name.
     *
     * @param stateName The name under which the animation state object will be stored.
     * @param animationState The animation state object to be staored in the set.
     */
    addAnimation(node: AnimationNodeBase): void;
    /**
     * Cleans up any resources used by the current object.
     */
    dispose(): void;
}
