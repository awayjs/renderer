/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	export class Texture extends TextureBase
	{
		
		public textureType:string = "texture2d";
		
		private _width:number;
		private _height:number;
		
		private _glTexture:WebGLTexture;
		
		constructor( gl:WebGLRenderingContext, width:number, height:number )
		{
			super( gl );
			this._width = width;
			this._height = height;
			
			this._glTexture = this._gl.createTexture();
		}
		
		public dispose()
		{
			this._gl.deleteTexture( this._glTexture );
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
			this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
			this._gl.texImage2D( this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );
		}
		
		public uploadFromBitmapData( data:away.display.BitmapData, miplevel:number = 0 )
		{
			this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
			this._gl.texImage2D( this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );
		}
		
		public get glTexture(): WebGLTexture
		{
			return this._glTexture;
		}
		
	}
}