///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 *
	 * @class away.pool.TextureDataBase
	 */
	export class TextureData implements ITextureData
	{
		public stageGL:away.base.IStage;

		public texture:away.gl.TextureBase;

		public textureProxy:away.textures.TextureProxyBase;

		public invalid:boolean;

		constructor(stageGL:away.base.IStage, textureProxy:away.textures.TextureProxyBase)
		{
			this.stageGL = stageGL;
			this.textureProxy = textureProxy;
		}

		/**
		 *
		 */
		public dispose()
		{
			this.texture.dispose();
			this.texture = null;
		}

		/**
		 *
		 */
		public invalidate()
		{
			this.invalid = true;
		}
	}
}
