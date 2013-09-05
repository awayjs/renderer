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
			
			this._gl.bindTexture( this._gl.TEXTURE_CUBE_MAP, this.glTexture );
			this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this._gl.RGBA, this.size, this.size, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
			this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this._gl.RGBA, this.size, this.size, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
			this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this._gl.RGBA, this.size, this.size, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
			this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this._gl.RGBA, this.size, this.size, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
			this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this._gl.RGBA, this.size, this.size, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
			this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this._gl.RGBA, this.size, this.size, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );
		}
		
		public uploadFromHTMLImageElement( image:HTMLImageElement, side:number, miplevel:number = 0 )
		{
			switch( side )
			{
				case 0:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
					break;
				case 1:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
					break;
				case 2:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
					break;
				case 3:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
					break;
				case 4:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
					break;
				case 5:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
					break;
				default :
					throw "unknown side type";
			}
		}
		
		public uploadFromBitmapData( data:away.display.BitmapData, side:number, miplevel:number = 0 )
		{
			switch( side )
			{
				case 0:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
					break;
				case 1:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_X, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
					break;
				case 2:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
					break;
				case 3:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
					break;
				case 4:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_POSITIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
					break;
				case 5:
						this._gl.texImage2D( this._gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
					break;
				default :
					throw "unknown side type";
			}
		}
		
		public get size():number
		{
			return this._size;
		}
	}
}
 