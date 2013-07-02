/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="../../def/webgl.d.ts"/>

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
			this._numVertices = numVertices;
			this._data32PerVertex = data32PerVertex;
			
			this._buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer); // TODO ELEMENT_ARRAY_BUFFER VBOs
		}
		
		public upload( vertices:number[], startVertex:number, numVertices:number)
		{
			var gl: WebGLRenderingContext = this._gl;
			
			gl.bufferData(
					gl.ARRAY_BUFFER, 
					new Float32Array(vertices), 
					gl.STATIC_DRAW
				);
		}
		
		public get numVertices():number
		{
			return this._numVertices;
		}
		
		public get data32PerVertex():number
		{
			return this._data32PerVertex;
		}
	}
}