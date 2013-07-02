/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
///<reference path="VertexBuffer3D.ts"/>
///<reference path="IndexBuffer3D.ts"/>

module away.display3d
{
	
	export class Context3D
	{
		
		private _gl:WebGLRenderingContext;
		
		constructor( canvas: HTMLCanvasElement )
		{
			try
			{
				this._gl = <WebGLRenderingContext> canvas.getContext("experimental-webgl") || <WebGLRenderingContext> canvas.getContext("webgl");
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
			}
			catch(e)
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
			}
			
			if (!this._gl) {
				alert("WebGL is not available.");
			}
			
		}
		
		public clear( red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1,
					  depth:number = 1, stencil:number = 0, mask:number = 0xffffffff )
		{
			this._gl.clearColor( red, green, blue, alpha ); 
		}
		
		public present()
		{
			// test
			this._gl.enable(this._gl.DEPTH_TEST);
			this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
		}
		
		public createIndexBuffer3D( numIndices:number): away.display3D.IndexBuffer3D
		{
			return new away.display3D.IndexBuffer3D( this._gl, numIndices );
		}
		
		public createVertexBuffer( numVertices:number, data32PerVertex:number ): away.display3D.VertexBuffer3D
		{
			return new away.display3D.VertexBuffer3D( this._gl, numVertices, data32PerVertex );
		}
		
	}
}