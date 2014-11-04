import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import MaterialGLBase				= require("awayjs-renderergl/lib/materials/MaterialGLBase");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");

/**
 * @class away.pool.MaterialPassDataPool
 */
class MaterialPassDataPool
{
	private _pool:Object = new Object();
	private _material:MaterialGLBase;

	/**
	 * //TODO
	 *
	 * @param textureDataClass
	 */
	constructor(material:MaterialGLBase)
	{
		this._material = material;
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 * @returns ITexture
	 */
	public getItem(materialPass:MaterialPassGLBase):MaterialPassData
	{
		return (this._pool[materialPass.id] || (this._pool[materialPass.id] = this._material._iAddMaterialPassData(materialPass._iAddMaterialPassData(new MaterialPassData(this, this._material, materialPass)))));
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(materialPass:MaterialPassGLBase)
	{
		materialPass._iRemoveMaterialPassData(this._pool[materialPass.id]);

		delete this._pool[materialPass.id];
	}

	public disposePool()
	{
		for (var id in this._pool)
			(<MaterialPassData> this._pool[id]).materialPass._iRemoveMaterialPassData(this._pool[id]);

		delete this._pool;
	}
}

export = MaterialPassDataPool;