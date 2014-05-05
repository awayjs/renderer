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
	export class BitmapTextureData extends TextureDataBase implements ITextureData
	{
		/**
		 *
		 */
		public static id:string = "bitmaptexture";

		private _textureProxy:away.textures.BitmapTexture;

		constructor(stageGL:away.base.StageGL, textureProxy:away.textures.BitmapTexture)
		{
			super(stageGL);

			this._textureProxy = textureProxy;
		}

		public _pCreateTexture()
		{
			this._pTexture = this._pStageGL.contextGL.createTexture(this._textureProxy.width, this._textureProxy.height, away.gl.ContextGLTextureFormat.BGRA, false);
		}

		public _pUpdateContent()
		{
			if (this._textureProxy.generateMipmaps) {
				var mipmapData:Array<away.base.BitmapData> = this._textureProxy._iGetMipmapData();
				var len:number = mipmapData.length;
				for (var i:number = 0; i < len; i++)
					(<away.gl.Texture> this._pTexture).uploadFromBitmapData(mipmapData[i], i);
			} else {
				(<away.gl.Texture> this._pTexture).uploadFromBitmapData(this._textureProxy.bitmapData, 0);
			}
		}
	}
}
