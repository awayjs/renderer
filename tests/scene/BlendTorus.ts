///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />

module scene
{
	export class BlendTorus extends away.events.EventDispatcher
	{
		
		private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
		private _image:HTMLImageElement;
		private _stageGL:away.base.StageGL;
		private _contextGL:away.gl.ContextGL;

		private _iBuffer:away.gl.IndexBuffer;
		private _normalMatrix:away.geom.Matrix3D;
		private _mvMatrix:away.geom.Matrix3D;
		private _pMatrix:away.utils.PerspectiveMatrix3D;
		private _texture:away.gl.Texture;
		private _program:away.gl.Program;

		constructor( )
		{
			super();

			if( !document )
			{
				throw "The document root object must be avaiable";
			}

			this.loadResources();
		}

		private loadResources()
		{
			var urlRequest:away.net.URLRequest = new away.net.URLRequest( "130909wall_big.png" );
			var urlLoader:away.net.URLLoader = new away.net.URLLoader();
			urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
			urlLoader.addEventListener( away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler) );
			urlLoader.load( urlRequest );
		}

		private imageCompleteHandler(e)
		{
			var imageLoader:away.net.URLLoader = <away.net.URLLoader> e.target
			this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
			this._image.onload = (event) => this.onLoadComplete(event);
		}

		private onLoadComplete(event)
		{
			this._stageGL = new away.base.StageGL(document.createElement("canvas"), 0, null);
			this._stageGL.addEventListener( away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler) );
			this._stageGL.requestContext();
		}

		private onContextGLCreateHandler( e )
		{
			this._stageGL.removeEventListener( away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler) );
			this._stageGL.width = 800;
			this._stageGL.height = 600;

			document.body.appendChild(this._stageGL.canvas);

			this._contextGL = this._stageGL.contextGL;

			//this._texture = this._contextGL.createTexture( 512, 512, away.gl.ContextGLTextureFormat.BGRA, true );
			//this._texture.uploadFromHTMLImageElement( this._image );

			//var bitmapData: away.display.BitmapData = new away.display.BitmapData( 512, 512, true, 0x02CGL4 );
			//this._texture.uploadFromBitmapData( bitmapData );

			this._contextGL.configureBackBuffer( 800, 600, 0, true );
			this._contextGL.setColorMask( true, true, true, true );

			var torus: away.primitives.TorusGeometry = new away.primitives.TorusGeometry( 1, 0.5, 32, 16, false );
			torus.iValidate();

			var vertices:number[] = torus.getSubGeometries()[0].vertexData;
			var indices:number[] = torus.getSubGeometries()[0].indexData;

			/**
			  * Updates the vertex data. All vertex properties are contained in a single Vector, and the order is as follows:
			  * 0 - 2: vertex position X, Y, Z
			  * 3 - 5: normal X, Y, Z
			  * 6 - 8: tangent X, Y, Z
			  * 9 - 10: U V
			  * 11 - 12: Secondary U V
			  */
			var stride:number = 13;
			var numVertices: number = vertices.length / stride;
			var vBuffer: away.gl.VertexBuffer = this._contextGL.createVertexBuffer( numVertices, stride );
			vBuffer.uploadFromArray( vertices, 0, numVertices );

			var numIndices:number = indices.length;
			this._iBuffer = this._contextGL.createIndexBuffer( numIndices );
			this._iBuffer.uploadFromArray( indices, 0, numIndices );

			this._program = this._contextGL.createProgram();

			var vProgram:string = 	"attribute vec3 aVertexPosition;\n" +
									"attribute vec3 aVertexNormal;\n" +

									"uniform mat4 uMVMatrix;\n" +
									"uniform mat4 uPMatrix;\n" +
									"uniform mat4 uNMatrix;\n" +

									"varying vec3 vNormal;\n" +
									"varying vec3 vEyeVec;\n" +

									"void main(void) {\n" +
									"	vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
									"	vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));\n" +
									"	vEyeVec = -vec3(vertex.xyz);\n" +
									"	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
									"}\n";

			var fProgram:string = 	"precision mediump float;\n"+

									"uniform vec4 uShininess;\n"+
									"uniform vec4 uLightDirection;\n"+
									"uniform vec4 uLightAmbient;\n"+
									"uniform vec4 uLightDiffuse; \n"+
									"uniform vec4 uLightSpecular;\n"+
									"uniform vec4 uMaterialAmbient;\n"+
									"uniform vec4 uMaterialDiffuse;\n"+
									"uniform vec4 uMaterialSpecular; \n"+

									"varying vec3 vNormal; \n"+
									"varying vec3 vEyeVec; \n"+

									"void main(void) { \n"+
									"	vec3 L = normalize(uLightDirection.xyz);\n"+
									"	vec3 N = normalize(vNormal); \n"+
									"	float lambertTerm = dot(N,-L); \n"+
									"	vec4 Ia = uLightAmbient * uMaterialAmbient; \n"+
									"	vec4 Id = vec4(0.0,0.0,0.0,1.0); \n"+
									"	vec4 Is = vec4(0.0,0.0,0.0,1.0); \n"+

									"	if(lambertTerm > 0.0) //only if lambertTerm is positive \n"+
									"	{ \n"+
									"		Id = uLightDiffuse * uMaterialDiffuse * lambertTerm; \n"+
									"		vec3 E = normalize(vEyeVec); \n"+
									"		vec3 R = reflect(L, N); \n"+
									"		float specular = pow( max(dot(R, E), 0.0), uShininess.x ); \n"+
									"		Is = uLightSpecular * uMaterialSpecular * specular; \n"+
									"	}\n"+

									"	vec4 finalColor = Ia + Id + Is;\n"+
									"	finalColor.a = 1.0;\n"+
									"	gl_FragColor = finalColor;\n"+
									"}\n";

			this._program.upload( vProgram, fProgram );
			this._contextGL.setProgram( this._program );

			this._pMatrix = new away.utils.PerspectiveMatrix3D();
			this._pMatrix.perspectiveFieldOfViewLH( 45, 800/600, 0.1, 1000 );

			this._mvMatrix = new away.geom.Matrix3D();
			//this._mvMatrix.appendTranslation( 0, 0, 7 );

			this._normalMatrix = this._mvMatrix.clone();
			this._normalMatrix.invert();
			this._normalMatrix.transpose();

			this._contextGL.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3 );
			this._contextGL.setGLSLVertexBufferAt( "aVertexNormal", vBuffer, 3, away.gl.ContextGLVertexBufferFormat.FLOAT_3 )

			this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
			this._requestAnimationFrameTimer.start();

			this._eyeMat = new away.geom.Matrix3D();
		}
		private  _eyeMat: away.geom.Matrix3D;
		private tick( dt:number )
		{
			this._mvMatrix.appendRotation( dt * 0.05, new away.geom.Vector3D( 0, 1, 0 ) );
			this._mvMatrix.position = new away.geom.Vector3D( 0, 0, 5 );

			this._contextGL.setProgram( this._program );
			this._contextGL.setBlendFactors( away.gl.ContextGLBlendFactor.ONE_MINUS_SOURCE_COLOR, away.gl.ContextGLBlendFactor.ONE );
			this._eyeMat.appendRotation( -(dt * 0.05), new away.geom.Vector3D( 0, 1, 0 ) );
			
			var eyeVec:away.geom.Vector3D = this._eyeMat.transformVector( new away.geom.Vector3D( 0, 0, 5 ) );
			
			this._contextGL.setGLSLProgramConstantsFromMatrix( "uNMatrix", this._normalMatrix, true );
			this._contextGL.setGLSLProgramConstantsFromMatrix( "uMVMatrix", this._mvMatrix, true );
			this._contextGL.setGLSLProgramConstantsFromMatrix( "uPMatrix", this._pMatrix, true );
			this._contextGL.setGLSLProgramConstantsFromArray( "uShininess", [10.0, 0.0, 0.0, 0.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uLightDirection", [eyeVec.x,eyeVec.y, eyeVec.z, 0.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uLightAmbient", [1.0, 1.0, 1.0, 1.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uLightDiffuse", [0.8, 0.8, 0.8, 1.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uLightSpecular", [1.0, 1.0, 1.0, 1.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uMaterialAmbient", [0.0, 0.0, 0.0, 1.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uMaterialDiffuse", [0.3, 0.6, 0.9, 1.0] , 0 );
			this._contextGL.setGLSLProgramConstantsFromArray( "uMaterialSpecular", [1.0, 1.0, 1.0, 1.0] , 0 );
			
			this._contextGL.clear( 0.16, 0.16, 0.16, 1 );
			this._contextGL.drawTriangles( this._iBuffer, 0, this._iBuffer.numIndices/3 );
			this._contextGL.present();
		}
	}
}