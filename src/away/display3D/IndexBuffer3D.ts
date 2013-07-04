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
			this._numIndices = numIndices;
		}
		
		public get numIndices():number
		{
			return 3;
		}
	}
}