import IMaterialPassData			= require("awayjs-display/lib/pool/IMaterialPassData");

import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import MaterialPassDataPool			= require("awayjs-renderergl/lib/pool/MaterialPassDataPool");
import MaterialGLBase				= require("awayjs-renderergl/lib/materials/MaterialGLBase");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");

/**
 *
 * @class away.pool.MaterialPassData
 */
class MaterialPassData implements IMaterialPassData
{
	private _pool:MaterialPassDataPool;

	public material:MaterialGLBase;

	public shaderObject:ShaderObjectBase;

	public materialPass:MaterialPassGLBase;

	public programData:ProgramData;

	public shadedTarget:string;

	public vertexCode:string;

	public postAnimationFragmentCode:string;

	public fragmentCode:string;

	public animationVertexCode:string = "";

	public animationFragmentCode:string = "";

	public key:string;

	public invalid:boolean;

	public usesAnimation:boolean;

	constructor(pool:MaterialPassDataPool, material:MaterialGLBase, materialPass:MaterialPassGLBase)
	{
		this._pool = pool;
		this.material = material;
		this.materialPass = materialPass;
	}

	/**
	 *
	 */
	public dispose()
	{
		this._pool.disposeItem(this.materialPass);

		this.shaderObject.dispose();
		this.shaderObject = null;

		this.programData.dispose();
		this.programData = null;
	}

	/**
	 *
	 */
	public invalidate()
	{
		this.invalid = true;
	}
}

export = MaterialPassData;