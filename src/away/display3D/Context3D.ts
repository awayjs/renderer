/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
///<reference path="VertexBuffer3D.ts"/>
///<reference path="IndexBuffer3D.ts"/>
///<reference path="Program3D.ts"/>
///<reference path="../geom/Matrix3D.ts"/>
///<reference path="Context3DTextureFormat.ts"/>
///<reference path="Texture.ts"/>
///<reference path="Context3DTriangleFace.ts"/>

module away.display3D
{
	
	export class Context3D
	{
		
		private _gl:WebGLRenderingContext;
		
		private _drawing:boolean;
		private _blendEnabled:boolean;
		private _blendSourceFactor:number;
		private _blendDestinationFactor:number;
		private _currentProgram:WebGLProgram;
		
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
			if (!this._drawing) 
			{
				this.updateBlendStatus();
				this._drawing = true;
			}
			this._gl.clearColor( red, green, blue, alpha );
			this._gl.clearDepth( depth );
			this._gl.clearStencil( stencil );
			this._gl.clear( mask );
		}
		
		public configureBackBuffer( width:number, height:number, antiAlias:number, enableDepthAndStencil:boolean = true )
		{
			if( enableDepthAndStencil )
			{
				this._gl.enable( this._gl.DEPTH_STENCIL );
				this._gl.enable( this._gl.DEPTH_TEST );
			}
			//TODO add antialias (seems to be a webgl bug)
			//TODO set webgl dimensions
			this._gl.viewport.width = width;
			this._gl.viewport.height = height;
		}
		
		public drawTriangles( indexBuffer:IndexBuffer3D, firstIndex:number = 0, numTriangles:number = -1 )
		{
			if ( !this._drawing ) 
			{
				throw "Need to clear before drawing if the buffer has not been cleared since the last present() call.";
			}
			var numIndices:number = 0;
			
			if (numTriangles == -1) 
			{
				numIndices = indexBuffer.numIndices;
			}
			else 
			{
				numIndices = numTriangles * 3;
			}
			
			this._gl.drawElements( this._gl.TRIANGLES, numIndices, this._gl.UNSIGNED_SHORT, firstIndex );
		}
		
		/*
		public setProgramConstantsFromMatrix(programType:string, firstRegister:number, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false )
		{
			
		}
		
		public setProgramConstantsFromVector(programType:string, firstRegister:number, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false )
		{
			
		}*/
		
		public present()
		{
			this._drawing = false;
			this._gl.useProgram( null );
		}
		
		public setCulling( triangleFaceToCull:string ) 
		{
			if( triangleFaceToCull == Context3DTriangleFace.NONE )
			{
				this._gl.disable( this._gl.CULL_FACE );
			}
			else
			{
				this._gl.enable( this._gl.CULL_FACE );
				switch( triangleFaceToCull )
				{
					case Context3DTriangleFace.FRONT:
							this._gl.cullFace( this._gl.FRONT );
						break
					case Context3DTriangleFace.BACK:
							this._gl.cullFace( this._gl.BACK );
						break;
					case Context3DTriangleFace.FRONT_AND_BACK:
						this._gl.cullFace( this._gl.FRONT_AND_BACK );
						break;
					default:
						throw "unknown Context3DTriangleFace type"; // TODO error
				}
			}
		}
		
		public setColorMask( red:boolean, green:boolean, blue:boolean, alpha:boolean ) 
		{
			this._gl.colorMask( red, green, blue, alpha );
		}
		
		public createIndexBuffer3D( numIndices:number): away.display3D.IndexBuffer3D
		{
			return new away.display3D.IndexBuffer3D( this._gl, numIndices );
		}
		
		public createVertexBuffer( numVertices:number, data32PerVertex:number ): away.display3D.VertexBuffer3D
		{
			return new away.display3D.VertexBuffer3D( this._gl, numVertices, data32PerVertex );
		}
		
		public createProgram(): away.display3D.Program3D
		{
			return new away.display3D.Program3D( this._gl );
		}
		
		public createTexture( width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0 ): away.display3D.Texture
		{
			return new away.display3D.Texture( this._gl, width, height );
		}
		
		public setProgram( program3D:away.display3D.Program3D )
		{
			program3D.focusProgram();
		}
		
		private updateBlendStatus() 
		{
			if ( this._blendEnabled ) 
			{
				this._gl.enable( this._gl.BLEND );
				this._gl.blendEquation( this._gl.FUNC_ADD );
				this._gl.blendFunc( this._blendSourceFactor, this._blendDestinationFactor );
			}
			else
			{
				this._gl.disable( this._gl.BLEND );
			}
		}
	}
}