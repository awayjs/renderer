///<reference path="../../src/away/_definitions.ts" />

module scene
{
	export class AGALTextureTorus extends away.events.EventDispatcher
	{
		
		private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
		private _stage3D:away.display.Stage3D;
		private _image:HTMLImageElement;
		private _context3D:away.display3D.AGLSLContext3D;
		
		private _iBuffer:away.display3D.IndexBuffer3D;
		private _matrix:away.utils.PerspectiveMatrix3D;
		private _program:away.display3D.Program3D;
		
		private _vBuffer:away.display3D.VertexBuffer3D;
		
		private _geometry:away.base.Geometry;
		
		private _stage:away.display.Stage;
		
		constructor( )
		{
			super();
			
			if( !document )
			{
				throw "The document root object must be avaiable";
			}
			this._stage = new away.display.Stage( 800, 600 );
			
			this._stage.stage3Ds[0].addEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
			this._stage.stage3Ds[0].requestContext( true );
		}
		
		public get stage():away.display.Stage
		{
			return this._stage;
		}
		
		private onContext3DCreateHandler( e )
		{
			this._stage.stage3Ds[0].removeEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
			
			var stage3D: away.display.Stage3D = <away.display.Stage3D> e.target;
			this._context3D = stage3D.context3D;
			
			this._context3D.configureBackBuffer( 800, 600, 0, true );
			this._context3D.setColorMask( true, true, true, true ); 
			
			this._geometry = new away.base.Geometry();
			
			var torus: away.primitives.TorusGeometry = new away.primitives.TorusGeometry( 1, 0.5, 32, 16, false );
			torus.iValidate();
			
			var vertices:number[] = torus.getSubGeometries()[0].vertexData;
			var indices:number[] = torus.getSubGeometries()[0].indexData;
			
			var stride:number = 13;
			var numVertices: number = vertices.length / stride;
			this._vBuffer = this._context3D.createVertexBuffer( numVertices, stride );
			this._vBuffer.uploadFromArray( vertices, 0, numVertices );
			
			var numIndices:number = indices.length;
			this._iBuffer = this._context3D.createIndexBuffer( numIndices );
			this._iBuffer.uploadFromArray( indices, 0, numIndices );
			
			this._program = this._context3D.createProgram();
			
			var vProgram:string = "m44 op, va0, vc0  \n" +
								  "mov v0, va1       \n";
			
			var fProgram:string = "mov oc, v0 \n";
			
			var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
			var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
			
			var compVProgram:string = vertCompiler.compile( away.display3D.Context3DProgramType.VERTEX, vProgram );
			var compFProgram:string = fragCompiler.compile( away.display3D.Context3DProgramType.FRAGMENT, fProgram );
			
			console.log( "=== compVProgram ===" );
			console.log( compVProgram );
			
			console.log( "\n" );
			
			console.log( "=== compFProgram ===" );
			console.log( compFProgram );
			
			this._program.upload( compVProgram, compFProgram );
			this._context3D.setProgram( this._program );
			
			this._matrix = new away.utils.PerspectiveMatrix3D();
			this._matrix.perspectiveFieldOfViewLH( 85, 800/600, 0.1, 1000 );
			
			this._context3D.setVertexBufferAt( 0, this._vBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3 );
			this._context3D.setVertexBufferAt( 1, this._vBuffer, 6, away.display3D.Context3DVertexBufferFormat.FLOAT_3 ); // test varying interpolation with normal channel as some colors
			
			//this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
			//this._requestAnimationFrameTimer.start();
			
			this.tick( 0 );
		}
		
		private tick( dt:number )
		{
			this._context3D.setProgram( this._program );
			this._context3D.setProgramConstantsFromMatrix( away.display3D.Context3DProgramType.VERTEX, 0, this._matrix, true );
			
			this._context3D.clear( 0.16, 0.16, 0.16, 1 );
			this._context3D.drawTriangles( this._iBuffer, 0, this._iBuffer.numIndices/3 );
			this._context3D.present();
			
			//this._requestAnimationFrameTimer.stop();
		}
	}
}