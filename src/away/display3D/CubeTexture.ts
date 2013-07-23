/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	
	export class CubeTexture extends away.display3D.TextureBase
	{
		private _size:number;
		
		constructor( gl:WebGLRenderingContext, size:number )
		{
			super( gl );
			this._size = size;
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
 