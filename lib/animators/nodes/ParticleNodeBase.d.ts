import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * Provides an abstract base class for particle animation nodes.
 */
export declare class ParticleNodeBase extends AnimationNodeBase {
    private _priority;
    _pMode: number;
    _pDataLength: number;
    _pOneData: Array<number>;
    _iDataOffset: number;
    private static GLOBAL;
    private static LOCAL_STATIC;
    private static LOCAL_DYNAMIC;
    private static MODES;
    /**
     * Returns the property mode of the particle animation node. Typically set in the node constructor
     *
     * @see away.animators.ParticlePropertiesMode
     */
    readonly mode: number;
    /**
     * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
     *
     * @see away.animators.ParticleAnimationSet
     * @see #getAGALVertexCode
     */
    readonly priority: number;
    /**
     * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
     *
     * @see away.animators.ParticleAnimationSet
     * @see #getAGALVertexCode
     */
    readonly dataLength: number;
    /**
     * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
     *
     * @see away.animators.ParticleAnimationSet
     * @see #generatePropertyOfOneParticle
     */
    readonly oneData: Array<number>;
    /**
     * Creates a new <code>ParticleNodeBase</code> object.
     *
     * @param               name            Defines the generic name of the particle animation node.
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
     * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
     */
    constructor(name: string, mode: number, dataLength: number, priority?: number);
    /**
     * Returns the AGAL code of the particle animation node for use in the vertex shader.
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader.
     */
    getAGALFragmentCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
     */
    getAGALUVCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
     *
     * @see away.animators.ParticleAnimationSet#initParticleFunc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    /**
     * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
     */
    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
}
