/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	
	export class Context3D
	{
		
		private _drawing:boolean;
		private _blendEnabled:boolean;
		private _blendSourceFactor:number;
		private _blendDestinationFactor:number;
		private _currentProgram:Program3D;
		
		private _indexBufferList: IndexBuffer3D[] = [];
		private _vertexBufferList: VertexBuffer3D[] = [];
		private _textureList: Texture[] = [];
		private _programList: Program3D[] = [];
		
		private _gl: WebGLRenderingContext;
		
		constructor( canvas: HTMLCanvasElement )
		{
			try
			{
				this._gl = <WebGLRenderingContext> canvas.getContext("experimental-webgl");
				if( !this._gl )
				{
					this._gl = <WebGLRenderingContext> canvas.getContext("webgl");
				}
			}
			catch(e)
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
			}
			
			if( this._gl )
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
			}
			else
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
				alert("WebGL is not available.");
			}
			
		}
		
		public gl(): WebGLRenderingContext
		{
			return this._gl;
		}
		
		public clear( red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1,
					  depth:number = 1, stencil:number = 0, mask:number = Context3DClearMask.ALL )
		{
			away.Debug.log( "===== clear =====" );
            away.Debug.log( "\tred: " + red );
            away.Debug.log( "\tgreen: " + green );
            away.Debug.log( "\tblue: " + blue );
            away.Debug.log( "\talpha: " + alpha );
            away.Debug.log( "\tdepth: " + depth );
            away.Debug.log( "\tstencil: " + stencil );
            away.Debug.log( "\tmask: " + mask );

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
            away.Debug.log( "===== configureBackBuffer =====" );
            away.Debug.log( "\twidth: " + width );
            away.Debug.log( "\theight: " + height );
            away.Debug.log( "\tantiAlias: " + antiAlias );
            away.Debug.log( "\tenableDepthAndStencil: " + enableDepthAndStencil );
			
			if( enableDepthAndStencil )
			{
				this._gl.enable( this._gl.STENCIL_TEST );
				this._gl.enable( this._gl.DEPTH_TEST );
			}
			// TODO add antialias (seems to be a webgl bug)
			// TODO set webgl / canvas dimensions
			this._gl.viewport.width = width;
			this._gl.viewport.height = height;
		}
		
		/*
		public function createCubeTexture( size:number, format:Context3DTextureFormat, optimizeForRenderToTexture:boolean, streamingLevels:number = 0 ):CubeTexture 
		{
             var texture: Texture = new away.display3D.CubeTexture( );
             this._textureList.push( texture );
             return texture;
		}*/
		
		public createIndexBuffer( numIndices:number ): away.display3D.IndexBuffer3D
		{
            away.Debug.log( "===== createIndexBuffer =====" );
            away.Debug.log( "\tnumIndices: " + numIndices );
			var indexBuffer:IndexBuffer3D = new away.display3D.IndexBuffer3D( this._gl, numIndices );
			this._indexBufferList.push( indexBuffer );
			return indexBuffer;
		}
		
		public createProgram(): Program3D
		{
            away.Debug.log( "===== createProgram =====" );
			var program:Program3D = new away.display3D.Program3D( this._gl );
			this._programList.push( program );
			return program;
		}
		
		public createTexture( width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0 ): Texture
		{
            away.Debug.log( "===== createTexture =====" );
            away.Debug.log( "\twidth: " + width );
            away.Debug.log( "\theight: " + height );
            away.Debug.log( "\tformat: " + format );
            away.Debug.log( "\toptimizeForRenderToTexture: " + optimizeForRenderToTexture );
            away.Debug.log( "\tstreamingLevels: " + streamingLevels );
			
			var texture: Texture = new away.display3D.Texture( this._gl, width, height );
			this._textureList.push( texture );
			return texture;
		}
		
		public createVertexBuffer( numVertices:number, data32PerVertex:number ): away.display3D.VertexBuffer3D
		{
            away.Debug.log( "===== createVertexBuffer =====" );
            away.Debug.log( "\tnumVertices: " + numVertices );
            away.Debug.log( "\tdata32PerVertex: " + data32PerVertex );
			var vertexBuffer:VertexBuffer3D = new away.display3D.VertexBuffer3D( this._gl, numVertices, data32PerVertex );
			this._vertexBufferList.push( vertexBuffer );
			return vertexBuffer;
		}
		
		public dispose()
		{
            away.Debug.log( "===== dispose =====" );
			var i:number;
			for( i = 0; i < this._indexBufferList.length; ++i )
			{
				this._indexBufferList[i].dispose();
			}
			this._indexBufferList = null;
			
			for( i = 0; i < this._vertexBufferList.length; ++i )
			{
				this._vertexBufferList[i].dispose();
			}
			this._vertexBufferList = null;
			
			for( i = 0; i < this._textureList.length; ++i )
			{
				this._textureList[i].dispose();
			}
			this._textureList = null;
			
			for( i = 0; i < this._programList.length; ++i )
			{
				this._programList[i].dispose();
			}
			this._programList = null;
		}
		
		/*
		public function drawToBitmapData(destination:BitmapData) 
		{
		  // TODO
		}
		*/
		
		public drawTriangles( indexBuffer:IndexBuffer3D, firstIndex:number = 0, numTriangles:number = -1 )
		{
            away.Debug.log( "===== drawTriangles =====" );
            away.Debug.log( "\tfirstIndex: " + firstIndex );
            away.Debug.log( "\tnumTriangles: " + numTriangles );
			
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
			
			this._gl.bindBuffer( this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer );
			this._gl.drawElements( this._gl.TRIANGLES, numIndices, this._gl.UNSIGNED_SHORT, firstIndex );
		}
		
		public present()
		{
            away.Debug.log( "===== present =====" );
			this._drawing = false;
			this._gl.useProgram( null );
		}
		
		
		//TODO Context3DBlendFactor
		public setBlendFactors( sourceFactor:number, destinationFactor:number ) 
		{
            away.Debug.log( "===== setBlendFactors =====" );
            away.Debug.log( "\tsourceFactor: " + sourceFactor );
            away.Debug.log( "\tdestinationFactor: " + destinationFactor );
			this._blendEnabled = true;
			this._blendSourceFactor = sourceFactor;
			this._blendDestinationFactor = destinationFactor;
			
			this.updateBlendStatus();
		}
		
		public setColorMask( red:boolean, green:boolean, blue:boolean, alpha:boolean ) 
		{
            away.Debug.log( "===== setColorMask =====" );
			this._gl.colorMask( red, green, blue, alpha );
		}
		
		public setCulling( triangleFaceToCull:string ) 
		{
            away.Debug.log( "===== setCulling =====" );
            away.Debug.log( "\ttriangleFaceToCull: " + triangleFaceToCull );
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
						throw "Unknown Context3DTriangleFace type."; // TODO error
				}
			}
		}
		
		// TODO Context3DCompareMode
		public setDepthTest( depthMask:boolean, passCompareMode:number ) 
		{
            away.Debug.log( "===== setDepthTest =====" );
            away.Debug.log( "\tdepthMask: " + depthMask );
            away.Debug.log( "\tpassCompareMode: " + passCompareMode );
			this._gl.depthFunc( passCompareMode );
			this._gl.depthMask( depthMask );
		}
		
		public setProgram( program3D:away.display3D.Program3D )
		{
            away.Debug.log( "===== setProgram =====" );
			//TODO decide on construction/reference resposibilities
			this._currentProgram = program3D;
			program3D.focusProgram();
		}
		
		private getUniformLocationNameFromAgalRegisterIndex( programType:Context3DProgramType, firstRegister:number ):string
		{
			switch( programType)
			{
				case Context3DProgramType.VERTEX:
					return "vc";
					break;
				case Context3DProgramType.FRAGMENT:
					return "fc";
					break;
				default:
					throw "Program Type " + programType + " not supported";
			}
		}
		
		/*
		public setProgramConstantsFromByteArray
		*/
		
		public setProgramConstantsFromMatrix( programType:string, firstRegister:number, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false )
		{
			var locationName = this.getUniformLocationNameFromAgalRegisterIndex( programType, firstRegister );
			this.setGLSLProgramConstantsFromMatrix( locationName, matrix, transposedMatrix );
		}
		
		/*
		public setProgramConstantsFromVector(programType:string, firstRegister:number, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false )
		{

		}*/
		
		/*
		public setGLSLProgramConstantsFromByteArray
		
		*/
		
		public setGLSLProgramConstantsFromMatrix( locationName:string, matrix:away.geom.Matrix3D, transposedMatrix:boolean = false) 
		{
            away.Debug.log( "===== setGLSLProgramConstantsFromMatrix =====" );
            away.Debug.log( "\tlocationName: " + locationName );
            away.Debug.log( "\tmatrix: " + matrix.rawData );
            away.Debug.log( "\ttransposedMatrix: " + transposedMatrix );
			
			var location:WebGLUniformLocation = this._gl.getUniformLocation( this._currentProgram.glProgram, locationName );
			this._gl.uniformMatrix4fv( location, !transposedMatrix, new Float32Array( matrix.rawData ) );
		}
		
		public setGLSLProgramConstantsFromVector4( locationName:string, data:number[], startIndex:number = 0 ) 
		{
            away.Debug.log( "===== setGLSLProgramConstantsFromVector4 =====" );
            away.Debug.log( "\tlocationName: " + locationName );
            away.Debug.log( "\tdata: " + data );
            away.Debug.log( "\tstartIndex: " + startIndex );
			var location:WebGLUniformLocation = this._gl.getUniformLocation( this._currentProgram.glProgram, locationName );
			this._gl.uniform4f( location, data[startIndex], data[startIndex+1], data[startIndex+2], data[startIndex+3] );
		}
		
		public setScissorRectangle( rectangle:away.geom.Rectangle ) 
		{
            away.Debug.log( "===== setScissorRectangle =====" );
            away.Debug.log( "\trectangle: " + rectangle );
			this._gl.scissor( rectangle.x, rectangle.y, rectangle.width, rectangle.height );
		}
		
		public setGLSLTextureAt( locationName:string, texture:TextureBase, textureIndex:number )
		{
			var location:WebGLUniformLocation = this._gl.getUniformLocation( this._currentProgram.glProgram, locationName );
            switch( textureIndex )
			{
                case 0: 
						this._gl.activeTexture( this._gl.TEXTURE0 );
					break;
                case 1:
						this._gl.activeTexture( this._gl.TEXTURE1 );
					break;
                case 2:
						this._gl.activeTexture( this._gl.TEXTURE2 );
					break;
                case 3:
						this._gl.activeTexture( this._gl.TEXTURE3 );
					break;
                case 4:
						this._gl.activeTexture( this._gl.TEXTURE4 );
					break;
                case 5:
						this._gl.activeTexture( this._gl.TEXTURE5 );
					break;
                case 6:
						this._gl.activeTexture( this._gl.TEXTURE6 );
					break;
                case 7:
						this._gl.activeTexture( this._gl.TEXTURE7 );
					break;
                default:
					throw "Texture " + textureIndex + " is out of bounds.";
            }
			
			this._gl.bindTexture( this._gl.TEXTURE_2D, texture.glTexture );
			this._gl.uniform1i( location, textureIndex );
			
			// TODO create something like setSamplerStateAt(.... 
			this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE );
			this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE );
			this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR );
			this._gl.texParameteri( this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR );
        }
		
		public setVertexBufferAt( index:number, buffer:VertexBuffer3D, bufferOffset:number = 0, format:string = null )
		{
            away.Debug.log( "===== setVertexBufferAt =====" );
            away.Debug.log( "\tindex: " + index );
            away.Debug.log( "\tbufferOffset: " + bufferOffset );
            away.Debug.log( "\tformat: " + format );
			
			var locationName = "va" + index;
			this.setGLSLVertexBufferAt( locationName, buffer, bufferOffset, format );
		}
		
		public setGLSLVertexBufferAt( locationName, buffer:VertexBuffer3D, bufferOffset:number = 0, format:string = null )
		{
            away.Debug.log( "===== setGLSLVertexBufferAt =====" );
            away.Debug.log( "\tbuffer.length: " + buffer.numVertices );
            away.Debug.log( "\tbuffer.data32PerVertex: " + buffer.data32PerVertex );
            away.Debug.log( "\tlocationName: " + locationName );
            away.Debug.log( "\tbufferOffset: " + bufferOffset );
			
			var location:number = this._gl.getAttribLocation( this._currentProgram.glProgram, locationName );
			
			this._gl.bindBuffer( this._gl.ARRAY_BUFFER, buffer.glBuffer );
			
			var dimension:number;
			var type:number = this._gl.FLOAT;
			var numBytes:number = 4;
			
			switch( format )
			{
				case Context3DVertexBufferFormat.BYTES_4:
						dimension = 4;
					break;
				case Context3DVertexBufferFormat.FLOAT_1:
						dimension = 1;
					break;
				case Context3DVertexBufferFormat.FLOAT_2:
						dimension = 2;
					break;
				case Context3DVertexBufferFormat.FLOAT_3:
						dimension = 3;
					break;
				case Context3DVertexBufferFormat.FLOAT_4:
						dimension = 4;
					break;
				default:
					throw "Buffer format " + format + " is not supported.";
			}
			
			this._gl.enableVertexAttribArray( location );
			this._gl.vertexAttribPointer( location, dimension, type, false, buffer.data32PerVertex * numBytes, bufferOffset * numBytes );
		}
		
		private updateBlendStatus() 
		{
            away.Debug.log( "===== updateBlendStatus =====" );
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