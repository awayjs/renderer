/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
///<reference path="TextureBase.ts"/>

module away.display3D
{
	export class Texture extends TextureBase
	{
		
		private _width:number;
		private _height:number;
		
		constructor( gl:WebGLRenderingContext, width:number, height:number )
		{
			super( gl );
			this._width = width;
			this._height = height;
			
			//this.gl.bindTexture( this.gl.TEXTURE_2D, this.glTexture );
			//this.gl.texImage2D( this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
		}
		
		// TODO uploads
		
		public get width():number
		{
			return this._width;
		}
		
		public get height():number
		{
			return this._height;
		}
	}
}