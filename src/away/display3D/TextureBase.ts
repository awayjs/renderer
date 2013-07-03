/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>

module away.display3D
{
	export class TextureBase
	{
		private _gl:WebGLRenderingContext;
		private _glTexture: WebGLTexture;
		
		constructor(gl:WebGLRenderingContext)
		{
			this._gl = gl;
			this._glTexture = this._gl.createTexture();
		}
		
		public dispose()
		{
			this._gl.deleteTexture( this._glTexture );
		}
		
		public get gl(): WebGLRenderingContext
		{
			return this._gl;
		}
		
		public get glTexture(): WebGLTexture
		{
			return this._glTexture;
		}
		
	}
}