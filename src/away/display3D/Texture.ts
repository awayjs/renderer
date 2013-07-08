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
		
		constructor( width:number, height:number )
		{
			super( );
			this._width = width;
			this._height = height;
			
			GL.bindTexture( GL.TEXTURE_2D, this.glTexture );
			GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null );
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
			GL.texImage2D( GL.TEXTURE_2D, miplevel, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image );
		}
	}
}