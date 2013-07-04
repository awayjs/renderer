/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../def/webgl.d.ts"/>
///<reference path="Context3DClearMask.ts"/>
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
		
		private _drawing:boolean;
		private _blendEnabled:boolean;
		private _blendSourceFactor:number;
		private _blendDestinationFactor:number;
		private _currentProgram:WebGLProgram;
		
		constructor( canvas: HTMLCanvasElement )
		{
			try
			{
				GL = <WebGLRenderingContext> canvas.getContext("experimental-webgl") || <WebGLRenderingContext> canvas.getContext("webgl");
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
			}
			catch(e)
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
			}
			
			if (!GL) {
				alert("WebGL is not available.");
			}
			
		}
		
		public clear( red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1,
					  depth:number = 1, stencil:number = 0, mask:number = Context3DClearMask.ALL )
		{
			if (!this._drawing) 
			{
				this.updateBlendStatus();
				this._drawing = true;
			}
			GL.clearColor( red, green, blue, alpha );
			GL.clearDepth( depth );
			GL.clearStencil( stencil );
			GL.clear( mask );
		}
		
		public configureBackBuffer( width:number, height:number, antiAlias:number, enableDepthAndStencil:boolean = true )
		{
			if( enableDepthAndStencil )
			{
				GL.enable( GL.DEPTH_STENCIL );
				GL.enable( GL.DEPTH_TEST );
			}
			//TODO add antialias (seems to be a webgl bug)
			//TODO set webgl dimensions
			GL.viewport.width = width;
			GL.viewport.height = height;
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
			
			GL.drawElements( GL.TRIANGLES, numIndices, GL.UNSIGNED_SHORT, firstIndex );
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
			GL.useProgram( null );
		}
		
		public setCulling( triangleFaceToCull:string ) 
		{
			if( triangleFaceToCull == Context3DTriangleFace.NONE )
			{
				GL.disable( GL.CULL_FACE );
			}
			else
			{
				GL.enable( GL.CULL_FACE );
				switch( triangleFaceToCull )
				{
					case Context3DTriangleFace.FRONT:
							GL.cullFace( GL.FRONT );
						break
					case Context3DTriangleFace.BACK:
							GL.cullFace( GL.BACK );
						break;
					case Context3DTriangleFace.FRONT_AND_BACK:
							GL.cullFace( GL.FRONT_AND_BACK );
						break;
					default:
						throw "unknown Context3DTriangleFace type"; // TODO error
				}
			}
		}
		
		public setColorMask( red:boolean, green:boolean, blue:boolean, alpha:boolean ) 
		{
			GL.colorMask( red, green, blue, alpha );
		}
		
		public createIndexBuffer3D( numIndices:number): away.display3D.IndexBuffer3D
		{
			return new away.display3D.IndexBuffer3D( numIndices );
		}
		
		public createVertexBuffer( numVertices:number, data32PerVertex:number ): away.display3D.VertexBuffer3D
		{
			return new away.display3D.VertexBuffer3D( numVertices, data32PerVertex );
		}
		
		public createProgram(): away.display3D.Program3D
		{
			return new away.display3D.Program3D();
		}
		
		public createTexture( width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0 ): away.display3D.Texture
		{
			return new away.display3D.Texture( width, height );
		}
		
		public setProgram( program3D:away.display3D.Program3D )
		{
			//TODO decide on construction/reference resposibilities
			program3D.focusProgram();
		}
		
		private updateBlendStatus() 
		{
			if ( this._blendEnabled ) 
			{
				GL.enable( GL.BLEND );
				GL.blendEquation( GL.FUNC_ADD );
				GL.blendFunc( this._blendSourceFactor, this._blendDestinationFactor );
			}
			else
			{
				GL.disable( GL.BLEND );
			}
		}
	}
}