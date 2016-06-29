import { IAnimationSet } from "@awayjs/display/lib/animators/IAnimationSet";
import { AnimationSetBase } from "../animators/AnimationSetBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 * The animation data set used by vertex-based animators, containing vertex animation state data.
 *
 * @see VertexAnimator
 */
export declare class VertexAnimationSet extends AnimationSetBase implements IAnimationSet {
    private _iAnimationRegisterData;
    private _numPoses;
    private _blendMode;
    /**
     * Returns the number of poses made available at once to the GPU animation code.
     */
    readonly numPoses: number;
    /**
     * Returns the active blend mode of the vertex animator object.
     */
    readonly blendMode: string;
    /**
     * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
     */
    /**
     * Creates a new <code>VertexAnimationSet</code> object.
     *
     * @param numPoses The number of poses made available at once to the GPU animation code.
     * @param blendMode Optional value for setting the animation mode of the vertex animator object.
     *
     * @see away3d.animators.data.VertexAnimationMode
     */
    constructor(numPoses?: number, blendMode?: string);
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
     * Generates the vertex AGAL code for absolute blending.
     */
    private getAbsoluteAGALCode(shader, registerCache, sharedRegisters);
    /**
     * Generates the vertex AGAL code for additive blending.
     */
    private getAdditiveAGALCode(shader, registerCache, sharedRegisters);
}
