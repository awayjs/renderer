import ContextGLBase				= require("awayjs-stagegl/lib/base/ContextGLBase");

import MaterialData					= require("awayjs-renderergl/lib/pool/MaterialData");
import StageGLMaterialBase			= require("awayjs-renderergl/lib/materials/StageGLMaterialBase");

/**
 * @class away.pool.MaterialDataPool
 */
class MaterialDataPool
{
	private _pool:Object = new Object();

	/**
	 * //TODO
	 *
	 * @param textureDataClass
	 */
	constructor()
	{
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 * @returns ITexture
	 */
	public getItem(material:StageGLMaterialBase):MaterialData
	{
		return (this._pool[material.id] || (this._pool[material.id] = material._iAddMaterialData(new MaterialData(this, material))))
	}

	/**
	 * //TODO
	 *
	 * @param materialOwner
	 */
	public disposeItem(material:StageGLMaterialBase)
	{
		material._iRemoveMaterialData(this._pool[material.id]);

		this._pool[material.id] = null;
	}
}

export = MaterialDataPool;