import { IAnimationSet } from "@awayjs/display/lib/animators/IAnimationSet";
import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { Graphic } from "@awayjs/display/lib/graphics/Graphic";
import { Graphics } from "@awayjs/display/lib/graphics/Graphics";
import { AnimationSetBase } from "../animators/AnimationSetBase";
import { AnimationRegisterData } from "../animators/data/AnimationRegisterData";
import { AnimationElements } from "../animators/data/AnimationElements";
import { ParticleNodeBase } from "../animators/nodes/ParticleNodeBase";
import { ShaderBase } from "../shaders/ShaderBase";
import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../shaders/ShaderRegisterData";
/**
 * The animation data set used by particle-based animators, containing particle animation data.
 *
 * @see away.animators.ParticleAnimator
 */
export declare class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet {
    /** @private */
    _iAnimationRegisterData: AnimationRegisterData;
    private _timeNode;
    /**
     * Property used by particle nodes that require compilers at the end of the shader
     */
    static POST_PRIORITY: number;
    /**
     * Property used by particle nodes that require color compilers
     */
    static COLOR_PRIORITY: number;
    private _animationElements;
    private _particleNodes;
    private _localDynamicNodes;
    private _localStaticNodes;
    private _totalLenOfOneVertex;
    hasUVNode: boolean;
    needVelocity: boolean;
    hasBillboard: boolean;
    hasColorMulNode: boolean;
    hasColorAddNode: boolean;
    /**
     * Initialiser function for static particle properties. Needs to reference a with the following format
     *
     * <code>
     * initParticleFunc(prop:ParticleProperties)
     * {
     * 		//code for settings local properties
     * }
     * </code>
     *
     * Aside from setting any properties required in particle animation nodes using local static properties, the initParticleFunc function
     * is required to time node requirements as they may be needed. These properties on the ParticleProperties object can include
     * <code>startTime</code>, <code>duration</code> and <code>delay</code>. The use of these properties is determined by the setting
     * arguments passed in the constructor of the particle animation set. By default, only the <code>startTime</code> property is required.
     */
    initParticleFunc: Function;
    /**
     * Initialiser function scope for static particle properties
     */
    initParticleScope: Object;
    /**
     *
     */
    shareAnimationGraphics: boolean;
    /**
     * Creates a new <code>ParticleAnimationSet</code>
     *
     * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
     * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
     * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
     */
    constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
    /**
     * Returns a vector of the particle animation nodes contained within the set.
     */
    readonly particleNodes: Array<ParticleNodeBase>;
    /**
     * @inheritDoc
     */
    addAnimation(node: AnimationNodeBase): void;
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    getAGALUVCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    /**
     * @inheritDoc
     */
    getAGALFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, shadedTarget: ShaderRegisterElement): string;
    /**
     * @inheritDoc
     */
    doneAGALCode(shader: ShaderBase): void;
    /**
     * @inheritDoc
     */
    readonly usesCPU: boolean;
    /**
     * @inheritDoc
     */
    cancelGPUCompatibility(): void;
    dispose(): void;
    getAnimationElements(graphic: Graphic): AnimationElements;
    /** @private */
    _iGenerateAnimationElements(graphics: Graphics): void;
}
