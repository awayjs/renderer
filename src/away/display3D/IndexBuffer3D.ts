/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	export class IndexBuffer3D
	{
		
		private _gl:WebGLRenderingContext;
		private _numIndices:number;
		private _buffer: WebGLBuffer;
		
		constructor( gl:WebGLRenderingContext, numIndices:number )
		{
			this._gl = gl;
			this._buffer = this._gl.createBuffer();
			this._numIndices = numIndices;
		}
		
		public uploadFromArray( data:number[], startOffset:number, count:number ):void
		{
			this._gl.bindBuffer( this._gl.ELEMENT_ARRAY_BUFFER, this._buffer );
			
			// TODO add index offsets
			this._gl.bufferData( this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( data ), this._gl.STATIC_DRAW );
		}
		
		public dispose():void
		{
			this._gl.deleteBuffer( this._buffer );
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