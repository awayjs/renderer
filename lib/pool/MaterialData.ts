import IMaterialData				= require("awayjs-display/lib/pool/IMaterialData");

import MaterialGLBase				= require("awayjs-renderergl/lib/materials/MaterialGLBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
import ShaderCompilerBase			= require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
import MaterialDataPool				= require("awayjs-renderergl/lib/pool/MaterialDataPool");
import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import MaterialPassDataPool			= require("awayjs-renderergl/lib/pool/MaterialPassDataPool");

/**
 *
 * @class away.pool.MaterialData
 */
class MaterialData implements IMaterialData
{
	private _pool:MaterialDataPool;

	private _materialPassDataPool:MaterialPassDataPool;

	private _passes:Array<MaterialPassData>;

	public material:MaterialGLBase;

	public renderOrderId:number;

	public invalidAnimation:boolean = true;

	constructor(pool:MaterialDataPool, material:MaterialGLBase)
	{
		this._pool = pool;
		this.material = material;

		this._materialPassDataPool = new MaterialPassDataPool(material);
	}

	public getMaterialPass(materialPass:MaterialPassGLBase, profile:string):MaterialPassData
	{
		var materialPassData:MaterialPassData = this._materialPassDataPool.getItem(materialPass);

		if (!materialPassData.shaderObject) {
			materialPassData.shaderObject = materialPass.createShaderObject(profile);
			materialPassData.invalid = true;
		}

		if (materialPassData.invalid) {
			materialPassData.invalid = false;
			var compiler:ShaderCompilerBase = materialPassData.shaderObject.createCompiler(this.material, materialPass);
			compiler.compile();

			materialPassData.shadedTarget = compiler.shadedTarget;
			materialPassData.vertexCode = compiler.vertexCode;
			materialPassData.fragmentCode = compiler.fragmentCode;
			materialPassData.postAnimationFragmentCode = compiler.postAnimationFragmentCode;
			materialPassData.key = "";
		}

		return materialPassData;
	}

	public getMaterialPasses(profile:string):Array<MaterialPassData>
	{
		if (this._passes == null) {
			var passes:Array<MaterialPassGLBase> = <Array<MaterialPassGLBase>> this.material._iScreenPasses;
			var numPasses:number = passes.length;

			//reset the material passes in MaterialData
			this._passes = new Array<MaterialPassData>(numPasses);

			//get the shader object for each screen pass and store
			for (var i:number = 0; i < numPasses; i++)
				this._passes[i] = this.getMaterialPass(passes[i], profile);
		}

		return this._passes;
	}

	/**
	 *
	 */
	public dispose()
	{
		this._materialPassDataPool.disposePool();

		this._materialPassDataPool = null;

		this._pool.disposeItem(this.material);

		this._passes = null;
	}

	/**
	 *
	 */
	public invalidateMaterial()
	{
		this._passes = null;

		this.invalidateAnimation();
	}

	/**
	 *
	 */
	public invalidateAnimation()
	{
		this.invalidAnimation = true;
	}
}

export = MaterialData;