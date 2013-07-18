/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>



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
			
			this._gl.bindTexture( this._gl.TEXTURE_2D, this.glTexture );
			this._gl.texImage2D( this._gl.TEXTURE_2D, 0, this._gl.RGBA, width, height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
		}
		
		public get width():number
		{
			return this._width;
		}
		
		public get height():number
		{
			return this._height;
		}
		
		public uploadFromHTMLImageElement( image:HTMLImageElement, miplevel:number = 0 )
		{
			this._gl.texImage2D( this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
		}
		
		public uploadFromBitmapData( data:away.display.BitmapData, miplevel:number = 0 )
		{
			this._gl.texImage2D( this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
		}
	}
}