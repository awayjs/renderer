/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>

module away.display3D
{
	export class IndexBuffer3D
	{
		private _gl:WebGLRenderingContext;
		private _numIndices:number;
		private _buffer: WebGLBuffer;
		
		constructor(gl:WebGLRenderingContext, numIndices:number)
		{
			this._gl = gl;
			this._numIndices = numIndices;
		}
		
		public get numIndices():number
		{
			return 3;
		}
	}
}