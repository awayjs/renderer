import { ShaderRegisterElement } from "../shaders/ShaderRegisterElement";
/**
 * ShaderRegister Cache provides the usage management system for all registers during shading compilers.
 */
export declare class ShaderRegisterCache {
    private _fragmentTempCache;
    private _vertexTempCache;
    private _varyingCache;
    private _fragmentConstantsCache;
    private _vertexConstantsCache;
    private _textureCache;
    private _vertexAttributesCache;
    private _fragmentOutputRegister;
    private _vertexOutputRegister;
    private _numUsedVertexConstants;
    private _numUsedFragmentConstants;
    private _numUsedStreams;
    private _numUsedTextures;
    private _numUsedVaryings;
    private _profile;
    /**
     * Create a new ShaderRegisterCache object.
     *
     * @param profile The compatibility profile used by the renderer.
     */
    constructor(profile: string);
    /**
     * Resets all registers.
     */
    reset(): void;
    /**
     * Disposes all resources used.
     */
    dispose(): void;
    /**
     * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    addFragmentTempUsages(register: ShaderRegisterElement, usageCount: number): void;
    /**
     * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    removeFragmentTempUsage(register: ShaderRegisterElement): void;
    /**
     * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
     * until removeUsage has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    addVertexTempUsages(register: ShaderRegisterElement, usageCount: number): void;
    /**
     * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    removeVertexTempUsage(register: ShaderRegisterElement): void;
    /**
     * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     */
    getFreeFragmentVectorTemp(): ShaderRegisterElement;
    /**
     * Retrieve a single component from a fragment temporary register that's still available.
     */
    getFreeFragmentSingleTemp(): ShaderRegisterElement;
    /**
     * Retrieve an available varying register
     */
    getFreeVarying(): ShaderRegisterElement;
    /**
     * Retrieve an available fragment constant register
     */
    getFreeFragmentConstant(): ShaderRegisterElement;
    /**
     * Retrieve an available vertex constant register
     */
    getFreeVertexConstant(): ShaderRegisterElement;
    /**
     * Retrieve an entire vertex temporary register that's still available.
     */
    getFreeVertexVectorTemp(): ShaderRegisterElement;
    /**
     * Retrieve a single component from a vertex temporary register that's still available.
     */
    getFreeVertexSingleTemp(): ShaderRegisterElement;
    /**
     * Retrieve an available vertex attribute register
     */
    getFreeVertexAttribute(): ShaderRegisterElement;
    /**
     * Retrieve an available texture register
     */
    getFreeTextureReg(): ShaderRegisterElement;
    /**
     * The fragment output register.
     */
    readonly fragmentOutputRegister: ShaderRegisterElement;
    /**
     * The amount of used vertex constant registers.
     */
    readonly numUsedVertexConstants: number;
    /**
     * The amount of used fragment constant registers.
     */
    readonly numUsedFragmentConstants: number;
    /**
     * The amount of used vertex streams.
     */
    readonly numUsedStreams: number;
    /**
     * The amount of used texture slots.
     */
    readonly numUsedTextures: number;
    /**
     * The amount of used varying registers.
     */
    readonly numUsedVaryings: number;
}
