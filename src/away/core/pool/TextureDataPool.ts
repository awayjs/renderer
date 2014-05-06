///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.TextureDataPool
	 */
	export class TextureDataPool
	{
		private _pool:Object = new Object();
		private _stage:away.base.IStage;

		/**
		 * //TODO
		 *
		 * @param textureDataClass
		 */
		constructor(stage:away.base.IStage)
		{
			this._stage = stage;
		}

		/**
		 * //TODO
		 *
		 * @param materialOwner
		 * @returns ITexture
		 */
		public getItem(textureProxy:away.textures.TextureProxyBase):TextureData
		{
			return (this._pool[textureProxy.id] || (this._pool[textureProxy.id] = textureProxy._iAddTextureData(new TextureData(this._stage, textureProxy))))
		}

		/**
		 * //TODO
		 *
		 * @param materialOwner
		 */
		public disposeItem(textureProxy:away.textures.TextureProxyBase)
		{
			textureProxy._iRemoveTextureData(this._pool[textureProxy.id]);

			this._pool[textureProxy.id] = null;
		}
	}
}