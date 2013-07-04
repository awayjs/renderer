/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>

module away.display3D
{
	export class IndexBuffer3D
	{
		
		private _numIndices:number;
		private _buffer: WebGLBuffer;
		
		constructor( numIndices:number )
		{
			this._buffer = GL.createBuffer();
			this._numIndices = numIndices;
		}
		
		public upload( data:number[], startOffset:number, count:number )
		{
			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, this._buffer );
			
			// TODO hack Float32Array to shorts implement ByteArray class
			// TODO add index offsets
			GL.bufferData( GL.ELEMENT_ARRAY_BUFFER, new Float32Array( data), GL.STATIC_DRAW );
		}
		
		public dispose()
		{
			GL.deleteBuffer( this._buffer );
		}
		
		public get numIndices():number
		{
			return this._numIndices;
		}
	}
}