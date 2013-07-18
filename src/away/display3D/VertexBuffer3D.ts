/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	
	export class VertexBuffer3D
	{
		
		private _gl:WebGLRenderingContext;
		private _numVertices:number;
		private _data32PerVertex:number;
		private _buffer: WebGLBuffer;
	
		constructor( gl:WebGLRenderingContext, numVertices:number, data32PerVertex:number )
		{
			this._gl = gl;
			this._buffer = this._gl.createBuffer();
			this._numVertices = numVertices;
			this._data32PerVertex = data32PerVertex;
		}
		
		public uploadFromArray( vertices:number[], startVertex:number, numVertices:number )
		{
			this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._buffer );
			console.log( "** WARNING upload not fully implemented, startVertex & numVertices not considered." );
			// TODO add offsets , startVertex, numVertices * this._data32PerVertex
			this._gl.bufferData( this._gl.ARRAY_BUFFER, new Float32Array( vertices ), this._gl.STATIC_DRAW );
		}
		
		public get numVertices():number
		{
			return this._numVertices;
		}
		
		public get data32PerVertex():number
		{
			return this._data32PerVertex;
		}
		
		public get glBuffer():WebGLBuffer
		{
			return this._buffer;
		}
		
		public dispose()
		{
			this._gl.deleteBuffer( this._buffer );
		}
	}
}