/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	export class TextureBase
	{
		
		private _glTexture: WebGLTexture;
		
		constructor()
		{
			this._glTexture = GL.createTexture();
		}
		
		public dispose()
		{
			GL.deleteTexture( this._glTexture );
		}
		
		public get glTexture(): WebGLTexture
		{
			return this._glTexture;
		}
	}
}