import {RegisterPool}					from "../shaders/RegisterPool";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";

/**
 * ShaderRegister Cache provides the usage management system for all registers during shading compilers.
 */
export class ShaderRegisterCache
{
	private _fragmentTempCache:RegisterPool;
	private _vertexTempCache:RegisterPool;
	private _varyingCache:RegisterPool;
	private _fragmentConstantsCache:RegisterPool;
	private _vertexConstantsCache:RegisterPool;
	private _textureCache:RegisterPool;
	private _vertexAttributesCache:RegisterPool;

	private _fragmentOutputRegister:ShaderRegisterElement;
	private _vertexOutputRegister:ShaderRegisterElement;
	private _numUsedVertexConstants:number = 0;
	private _numUsedFragmentConstants:number = 0;
	private _numUsedStreams:number = 0;
	private _numUsedTextures:number = 0;
	private _numUsedVaryings:number = 0;
	private _profile:string;

	/**
	 * Create a new ShaderRegisterCache object.
	 *
	 * @param profile The compatibility profile used by the renderer.
	 */
	constructor(profile:string)
	{
		this._profile = profile;
		
		this.reset();
	}

	/**
	 * Resets all registers.
	 */
	public reset():void
	{
		this._fragmentTempCache = new RegisterPool("ft", 8, false);
		this._vertexTempCache = new RegisterPool("vt", 8, false);
		this._varyingCache = new RegisterPool("v", 8);
		this._textureCache = new RegisterPool("fs", 8);
		this._vertexAttributesCache = new RegisterPool("va", 8);
		this._fragmentConstantsCache = new RegisterPool("fc", 28);
		this._vertexConstantsCache = new RegisterPool("vc", 128);
		this._fragmentOutputRegister = new ShaderRegisterElement("oc", -1);
		this._vertexOutputRegister = new ShaderRegisterElement("op", -1);
		this._numUsedVertexConstants = 0;
		this._numUsedStreams = 0;
		this._numUsedTextures = 0;
		this._numUsedVaryings = 0;
		this._numUsedFragmentConstants = 0;
	}

	/**
	 * Disposes all resources used.
	 */
	public dispose():void
	{
		this._fragmentTempCache.dispose();
		this._vertexTempCache.dispose();
		this._varyingCache.dispose();
		this._fragmentConstantsCache.dispose();
		this._vertexAttributesCache.dispose();

		this._fragmentTempCache = null;
		this._vertexTempCache = null;
		this._varyingCache = null;
		this._fragmentConstantsCache = null;
		this._vertexAttributesCache = null;
		this._fragmentOutputRegister = null;
		this._vertexOutputRegister = null;
	}

	/**
	 * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
	 * has been called usageCount times again.
	 * @param register The register to mark as used.
	 * @param usageCount The amount of usages to add.
	 */
	public addFragmentTempUsages(register:ShaderRegisterElement, usageCount:number):void
	{
		this._fragmentTempCache.addUsage(register, usageCount);
	}

	/**
	 * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
	 * @param register The register for which to remove a usage.
	 */
	public removeFragmentTempUsage(register:ShaderRegisterElement):void
	{
		this._fragmentTempCache.removeUsage(register);
	}

	/**
	 * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
	 * until removeUsage has been called usageCount times again.
	 * @param register The register to mark as used.
	 * @param usageCount The amount of usages to add.
	 */
	public addVertexTempUsages(register:ShaderRegisterElement, usageCount:number):void
	{
		this._vertexTempCache.addUsage(register, usageCount);
	}

	/**
	 * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
	 * @param register The register for which to remove a usage.
	 */
	public removeVertexTempUsage(register:ShaderRegisterElement):void
	{
		this._vertexTempCache.removeUsage(register);
	}

	/**
	 * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
	 * has been called usageCount times again.
	 */
	public getFreeFragmentVectorTemp():ShaderRegisterElement
	{
		return this._fragmentTempCache.requestFreeVectorReg();
	}

	/**
	 * Retrieve a single component from a fragment temporary register that's still available.
	 */
	public getFreeFragmentSingleTemp():ShaderRegisterElement
	{
		return this._fragmentTempCache.requestFreeRegComponent();
	}

	/**
	 * Retrieve an available varying register
	 */
	public getFreeVarying():ShaderRegisterElement
	{
		++this._numUsedVaryings;
		return this._varyingCache.requestFreeVectorReg();
	}

	/**
	 * Retrieve an available fragment constant register
	 */
	public getFreeFragmentConstant():ShaderRegisterElement
	{
		++this._numUsedFragmentConstants;
		return this._fragmentConstantsCache.requestFreeVectorReg();
	}

	/**
	 * Retrieve an available vertex constant register
	 */
	public getFreeVertexConstant():ShaderRegisterElement
	{
		++this._numUsedVertexConstants;
		return this._vertexConstantsCache.requestFreeVectorReg();
	}

	/**
	 * Retrieve an entire vertex temporary register that's still available.
	 */
	public getFreeVertexVectorTemp():ShaderRegisterElement
	{
		return this._vertexTempCache.requestFreeVectorReg();
	}

	/**
	 * Retrieve a single component from a vertex temporary register that's still available.
	 */
	public getFreeVertexSingleTemp():ShaderRegisterElement
	{
		return this._vertexTempCache.requestFreeRegComponent();
	}

	/**
	 * Retrieve an available vertex attribute register
	 */
	public getFreeVertexAttribute():ShaderRegisterElement
	{
		++this._numUsedStreams;
		return this._vertexAttributesCache.requestFreeVectorReg();
	}

	/**
	 * Retrieve an available texture register
	 */
	public getFreeTextureReg():ShaderRegisterElement
	{
		++this._numUsedTextures;
		return this._textureCache.requestFreeVectorReg();
	}

	/**
	 * The fragment output register.
	 */
	public get fragmentOutputRegister():ShaderRegisterElement
	{
		return this._fragmentOutputRegister;
	}

	/**
	 * The amount of used vertex constant registers.
	 */
	public get numUsedVertexConstants():number
	{
		return this._numUsedVertexConstants;
	}

	/**
	 * The amount of used fragment constant registers.
	 */
	public get numUsedFragmentConstants():number
	{
		return this._numUsedFragmentConstants;
	}

	/**
	 * The amount of used vertex streams.
	 */
	public get numUsedStreams():number
	{
		return this._numUsedStreams;
	}

	/**
	 * The amount of used texture slots.
	 */
	public get numUsedTextures():number
	{
		return this._numUsedTextures;
	}

	/**
	 * The amount of used varying registers.
	 */
	public get numUsedVaryings():number
	{
		return this._numUsedVaryings;
	}
}