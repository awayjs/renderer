import ShadingMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadingMethodBase");

/**
 * MethodVO contains data for a given shader object for the use within a single material.
 * This allows shader methods to be shared across materials while their non-public state differs.
 */
class MethodVO
{
	public useMethod:boolean = true;

	public method:ShadingMethodBase;

	// public register indices
	public texturesIndex:number;
	public secondaryTexturesIndex:number; // sometimes needed for composites
	public vertexConstantsIndex:number;
	public secondaryVertexConstantsIndex:number; // sometimes needed for composites
	public fragmentConstantsIndex:number;
	public secondaryFragmentConstantsIndex:number; // sometimes needed for composites

	// internal stuff for the material to know before assembling code
	public needsProjection:boolean;
	public needsView:boolean;
	public needsNormals:boolean;
	public needsTangents:boolean;
	public needsUV:boolean;
	public needsSecondaryUV:boolean;
	public needsGlobalVertexPos:boolean;
	public needsGlobalFragmentPos:boolean;

	public usesTexture:boolean;

	/**
	 * Creates a new MethodVO object.
	 */
	constructor(method:ShadingMethodBase)
	{
		this.method = method;
	}

	/**
	 * Resets the values of the value object to their "unused" state.
	 */
	public reset()
	{
		this.method.iReset();

		this.texturesIndex = -1;
		this.vertexConstantsIndex = -1;
		this.fragmentConstantsIndex = -1;

		this.needsProjection = false;
		this.needsView = false;
		this.needsNormals = false;
		this.needsTangents = false;
		this.needsUV = false;
		this.needsSecondaryUV = false;
		this.needsGlobalVertexPos = false;
		this.needsGlobalFragmentPos = false;
	}
}

export = MethodVO;
