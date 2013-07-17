/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

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
		
		public uploadFromArray( data:number[], startOffset:number, count:number ):void
		{
			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, this._buffer );
			
			// TODO add index offsets
			GL.bufferData( GL.ELEMENT_ARRAY_BUFFER, new Uint16Array( data ), GL.STATIC_DRAW );
		}
		
		public dispose():void
		{
			GL.deleteBuffer( this._buffer );
		}
		
		public get numIndices():number
		{
			return this._numIndices;
		}
		
		public get glBuffer():WebGLBuffer
		{
			return this._buffer;
		}
	}
}