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
	export class RenderTextureData extends TextureDataBase implements ITextureData
	{
		/**
		 *
		 */
		public static id:string = "rendertexture";

		private _textureProxy:away.textures.RenderTexture;

		constructor(stageGL:away.base.StageGL, textureProxy:away.textures.RenderTexture)
		{
			super(stageGL);

			this._textureProxy = textureProxy;
		}

		public _pCreateTexture()
		{
			this._pTexture = this._pStageGL.contextGL.createTexture(this._textureProxy.width, this._textureProxy.height, away.gl.ContextGLTextureFormat.BGRA, true);
		}

		public _pUpdateContent()
		{
			// fake data, to complete texture for sampling
			(<away.gl.Texture> this._pTexture).generateFromRenderBuffer();
		}
	}
}
