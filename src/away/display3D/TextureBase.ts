/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	export class TextureBase
	{
		public _gl:WebGLRenderingContext;
		private _glTexture: WebGLTexture;
		
		constructor( gl:WebGLRenderingContext )
		{
			this._gl = gl;
			this._glTexture = this._gl.createTexture();
		}
		
		public dispose()
		{
			this._gl.deleteTexture( this._glTexture );
		}
		
		public get glTexture(): WebGLTexture
		{
			return this._glTexture;
		}
	}
}