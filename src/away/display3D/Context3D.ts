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
		
		constructor( canvas: HTMLCanvasElement )
		{
			try
			{
				GL = <WebGLRenderingContext> canvas.getContext("experimental-webgl");
				if( !GL )
				{
					GL = <WebGLRenderingContext> canvas.getContext("webgl");
				}
			}
			catch(e)
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
			}
			
			if( GL )
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
			}
			else
			{
				//this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
				alert("WebGL is not available.");
			}
			
		}
		
		public clear( red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1,
					  depth:number = 1, stencil:number = 0, mask:number = Context3DClearMask.ALL )
		{
			Debug.log( "===== clear =====" );
            Debug.log( "\tred: " + red );
            Debug.log( "\tgreen: " + green );
            Debug.log( "\tblue: " + blue );
            Debug.log( "\talpha: " + alpha );
            Debug.log( "\tdepth: " + depth );
            Debug.log( "\tstencil: " + stencil );
            Debug.log( "\tmask: " + mask );

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
			Debug.log( "===== configureBackBuffer =====" );
            Debug.log( "\twidth: " + width );
            Debug.log( "\theight: " + height );
            Debug.log( "\tantiAlias: " + antiAlias );
            Debug.log( "\tenableDepthAndStencil: " + enableDepthAndStencil );
			
			if( enableDepthAndStencil )
			{
				GL.enable( GL.STENCIL_TEST );
				GL.enable( GL.DEPTH_TEST );
			}
			// TODO add antialias (seems to be a webgl bug)
			// TODO set webgl / canvas dimensions
			GL.viewport.width = width;
			GL.viewport.height = height;
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
            Debug.log( "===== createIndexBuffer =====" );
            Debug.log( "\tnumIndices: " + numIndices );
			var indexBuffer:IndexBuffer3D = new away.display3D.IndexBuffer3D( numIndices );
			this._indexBufferList.push( indexBuffer );
			return indexBuffer;
		}
		
		public createProgram(): Program3D
		{
            Debug.log( "===== createProgram =====" );
			var program:Program3D = new away.display3D.Program3D();
			this._programList.push( program );
			return program;
		}
		
		public createTexture( width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0 ): Texture
		{
            Debug.log( "===== createTexture =====" );
            Debug.log( "\twidth: " + width );
            Debug.log( "\theight: " + height );
            Debug.log( "\tformat: " + format );
            Debug.log( "\toptimizeForRenderToTexture: " + optimizeForRenderToTexture );
            Debug.log( "\tstreamingLevels: " + streamingLevels );
			
			var texture: Texture = new away.display3D.Texture( width, height );
			this._textureList.push( texture );
			return texture;
		}
		
		public createVertexBuffer( numVertices:number, data32PerVertex:number ): away.display3D.VertexBuffer3D
		{
            Debug.log( "===== createVertexBuffer =====" );
            Debug.log( "\tnumVertices: " + numVertices );
            Debug.log( "\tdata32PerVertex: " + data32PerVertex );
			var vertexBuffer:VertexBuffer3D = new away.display3D.VertexBuffer3D( numVertices, data32PerVertex );
			this._vertexBufferList.push( vertexBuffer );
			return vertexBuffer;
		}
		
		public dispose()
		{
            Debug.log( "===== dispose =====" );
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
            Debug.log( "===== drawTriangles =====" );
            Debug.log( "\tfirstIndex: " + firstIndex );
            Debug.log( "\tnumTriangles: " + numTriangles );
			
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
			
			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer );
			GL.drawElements( GL.TRIANGLES, numIndices, GL.UNSIGNED_SHORT, firstIndex );
		}
		
		public present()
		{
            Debug.log( "===== present =====" );
			this._drawing = false;
			GL.useProgram( null );
		}
		
		
		//TODO Context3DBlendFactor
		public setBlendFactors( sourceFactor:number, destinationFactor:number ) 
		{
            Debug.log( "===== setBlendFactors =====" );
            Debug.log( "\tsourceFactor: " + sourceFactor );
            Debug.log( "\tdestinationFactor: " + destinationFactor );
			this._blendEnabled = true;
			this._blendSourceFactor = sourceFactor;
			this._blendDestinationFactor = destinationFactor;
			
			this.updateBlendStatus();
		}
		
		public setColorMask( red:boolean, green:boolean, blue:boolean, alpha:boolean ) 
		{
            Debug.log( "===== setColorMask =====" );
			GL.colorMask( red, green, blue, alpha );
		}
		
		public setCulling( triangleFaceToCull:string ) 
		{
            Debug.log( "===== setCulling =====" );
            Debug.log( "\ttriangleFaceToCull: " + triangleFaceToCull );
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
						throw "Unknown Context3DTriangleFace type."; // TODO error
				}
			}
		}
		
		// TODO Context3DCompareMode
		public setDepthTest( depthMask:boolean, passCompareMode:number ) 
		{
            Debug.log( "===== setDepthTest =====" );
            Debug.log( "\tdepthMask: " + depthMask );
            Debug.log( "\tpassCompareMode: " + passCompareMode );
			GL.depthFunc( passCompareMode );
			GL.depthMask( depthMask );
		}
		
		public setProgram( program3D:away.display3D.Program3D )
		{
            Debug.log( "===== setProgram =====" );
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
            Debug.log( "===== setGLSLProgramConstantsFromMatrix =====" );
            Debug.log( "\tlocationName: " + locationName );
            Debug.log( "\tmatrix: " + matrix.rawData );
            Debug.log( "\ttransposedMatrix: " + transposedMatrix );
			
			var location:WebGLUniformLocation = GL.getUniformLocation( this._currentProgram.glProgram, locationName );
			GL.uniformMatrix4fv( location, !transposedMatrix, new Float32Array( matrix.rawData ) );
		}
		
		public setGLSLProgramConstantsFromVector4( locationName:string, data:number[], startIndex:number = 0 ) 
		{
            Debug.log( "===== setGLSLProgramConstantsFromVector4 =====" );
            Debug.log( "\tlocationName: " + locationName );
            Debug.log( "\tdata: " + data );
            Debug.log( "\tstartIndex: " + startIndex );
			var location:WebGLUniformLocation = GL.getUniformLocation( this._currentProgram.glProgram, locationName );
			GL.uniform4f( location, data[startIndex], data[startIndex+1], data[startIndex+2], data[startIndex+3] );
		}
		
		public setScissorRectangle( rectangle:away.geom.Rectangle ) 
		{
            Debug.log( "===== setScissorRectangle =====" );
            Debug.log( "\trectangle: " + rectangle );
			GL.scissor( rectangle.x, rectangle.y, rectangle.width, rectangle.height );
		}
		
		public setGLSLTextureAt( locationName:string, texture:TextureBase, textureIndex:number )
		{
			var location:WebGLUniformLocation = GL.getUniformLocation( this._currentProgram.glProgram, locationName );
            switch( textureIndex )
			{
                case 0: 
						GL.activeTexture( GL.TEXTURE0 );
					break;
                case 1:
						GL.activeTexture( GL.TEXTURE1 );
					break;
                case 2:
						GL.activeTexture( GL.TEXTURE2 );
					break;
                case 3:
						GL.activeTexture( GL.TEXTURE3 );
					break;
                case 4:
						GL.activeTexture( GL.TEXTURE4 );
					break;
                case 5:
						GL.activeTexture( GL.TEXTURE5 );
					break;
                case 6:
						GL.activeTexture( GL.TEXTURE6 );
					break;
                case 7:
						GL.activeTexture( GL.TEXTURE7 );
					break;
                default:
					throw "Texture " + textureIndex + " is out of bounds.";
            }
			
			GL.bindTexture( GL.TEXTURE_2D, texture.glTexture );
			GL.uniform1i( location, textureIndex );
			
			// TODO create something like setSamplerStateAt(.... 
			GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE );
			GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE );
			GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR );
			GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR );
        }
		
		public setVertexBufferAt( index:number, buffer:VertexBuffer3D, bufferOffset:number = 0, format:Context3DVertexBufferFormat = null ) 
		{
            Debug.log( "===== setVertexBufferAt =====" );
            Debug.log( "\tindex: " + index );
            Debug.log( "\tbufferOffset: " + bufferOffset );
            Debug.log( "\tformat: " + format );
			
			var locationName = "va" + index;
			this.setGLSLVertexBufferAt( locationName, buffer, bufferOffset, format );
		}
		
		public setGLSLVertexBufferAt( locationName, buffer:VertexBuffer3D, bufferOffset:number = 0, format:Context3DVertexBufferFormat = null ) 
		{
            Debug.log( "===== setGLSLVertexBufferAt =====" );
            Debug.log( "\tbuffer.length: " + buffer.numVertices );
            Debug.log( "\tbuffer.data32PerVertex: " + buffer.data32PerVertex );
            Debug.log( "\tlocationName: " + locationName );
            Debug.log( "\tbufferOffset: " + bufferOffset );
			
			var location:number = GL.getAttribLocation( this._currentProgram.glProgram, locationName );
			
			GL.bindBuffer( GL.ARRAY_BUFFER, buffer.glBuffer );
			
			var dimension:number;
			var type:number = GL.FLOAT;
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
			
			GL.enableVertexAttribArray( location );
			GL.vertexAttribPointer( location, dimension, type, false, buffer.data32PerVertex * numBytes, bufferOffset * numBytes );
		}
		
		private updateBlendStatus() 
		{
            Debug.log( "===== updateBlendStatus =====" );
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