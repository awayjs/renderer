///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />

module scene
{
	export class AGALTextureTorus extends away.events.EventDispatcher
	{
		
		private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
		private _stageGL:away.base.StageGL;
		private _image:HTMLImageElement;
		private _contextGL:away.gl.ContextGL;
		
		private _iBuffer:away.gl.IndexBuffer;
		private _matrix:away.utils.PerspectiveMatrix3D;
		private _program:away.gl.Program;
		
		private _vBuffer:away.gl.VertexBuffer;
		
		private _geometry:away.base.Geometry;

		constructor( )
		{
			super();
			
			if( !document )
			{
				throw "The document root object must be avaiable";
			}

			this._stageGL = new away.base.StageGL(document.createElement("canvas"), 0, null);
			this._stageGL.addEventListener( away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler) );
			this._stageGL.requestContext( true );
		}
		
		private onContextGLCreateHandler( e )
		{
			this._stageGL.removeEventListener( away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler) );
			this._stageGL.width = 800;
			this._stageGL.height = 600;

			document.body.appendChild(this._stageGL.canvas);

			this._contextGL = this._stageGL.contextGL;
			
			this._contextGL.configureBackBuffer( 800, 600, 0, true );
			this._contextGL.setColorMask( true, true, true, true );
			
			this._geometry = new away.base.Geometry();
			
			var torus: away.primitives.TorusGeometry = new away.primitives.TorusGeometry( 1, 0.5, 32, 16, false );
			torus.iValidate();
			
			var vertices:number[] = torus.getSubGeometries()[0].vertexData;
			var indices:number[] = torus.getSubGeometries()[0].indexData;
			
			var stride:number = 13;
			var numVertices: number = vertices.length / stride;
			this._vBuffer = this._contextGL.createVertexBuffer( numVertices, stride );
			this._vBuffer.uploadFromArray( vertices, 0, numVertices );
			
			var numIndices:number = indices.length;
			this._iBuffer = this._contextGL.createIndexBuffer( numIndices );
			this._iBuffer.uploadFromArray( indices, 0, numIndices );
			
			this._program = this._contextGL.createProgram();
			
			var vProgram:string = "m44 op, va0, vc0  \n" +
								  "mov v0, va1       \n";
			
			var fProgram:string = "mov oc, v0 \n";
			
			var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
			var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
			
			var compVProgram:string = vertCompiler.compile( away.gl.ContextGLProgramType.VERTEX, vProgram );
			var compFProgram:string = fragCompiler.compile( away.gl.ContextGLProgramType.FRAGMENT, fProgram );
			
			console.log( "=== compVProgram ===" );
			console.log( compVProgram );
			
			console.log( "\n" );
			
			console.log( "=== compFProgram ===" );
			console.log( compFProgram );
			
			this._program.upload( compVProgram, compFProgram );
			this._contextGL.setProgram( this._program );
			
			this._matrix = new away.utils.PerspectiveMatrix3D();
			this._matrix.perspectiveFieldOfViewLH( 85, 800/600, 0.1, 1000 );
			
			this._contextGL.setVertexBufferAt( 0, this._vBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3 );
			this._contextGL.setVertexBufferAt( 1, this._vBuffer, 6, away.gl.ContextGLVertexBufferFormat.FLOAT_3 ); // test varying interpolation with normal channel as some colors
			
			//this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
			//this._requestAnimationFrameTimer.start();
			
			this.tick( 0 );
		}
		
		private tick( dt:number )
		{
			this._contextGL.setProgram( this._program );
			this._contextGL.setProgramConstantsFromMatrix( away.gl.ContextGLProgramType.VERTEX, 0, this._matrix, true );
			
			this._contextGL.clear( 0.16, 0.16, 0.16, 1 );
			this._contextGL.drawTriangles( this._iBuffer, 0, this._iBuffer.numIndices/3 );
			this._contextGL.present();
			
			//this._requestAnimationFrameTimer.stop();
		}
	}
}