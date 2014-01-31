///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />

module scene
{

    export class RotatingTorus extends away.events.EventDispatcher
    {

        private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
        private _image:HTMLImageElement;
		private _stageGL:away.base.StageGL
        private _contextGL:away.gl.ContextGL;

        private _iBuffer:away.gl.IndexBuffer;
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
            var urlRequest:away.net.URLRequest = new away.net.URLRequest( "assets/130909wall_big.png" );
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

            this._texture = this._contextGL.createTexture( 512, 512, away.gl.ContextGLTextureFormat.BGRA, true );
            // this._texture.uploadFromHTMLImageElement( this._image );

            var bitmapData: away.base.BitmapData = new away.base.BitmapData( 512, 512, true, 0x02C3D4 );
            this._texture.uploadFromBitmapData( bitmapData );

            this._contextGL.configureBackBuffer( 800, 600, 0, true );
            this._contextGL.setColorMask( true, true, true, true );

            var torus: away.primitives.TorusGeometry = new away.primitives.TorusGeometry( 1, 0.5, 16, 8, false );
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

            var vProgram:string = "uniform mat4 mvMatrix;\n" +
                                  "uniform mat4 pMatrix;\n" +
                                  "attribute vec2 aTextureCoord;\n" +
                                  "attribute vec3 aVertexPosition;\n" +
                                  "varying vec2 vTextureCoord;\n" +

                                  "void main() {\n" +
                                  "		gl_Position = pMatrix * mvMatrix * vec4(aVertexPosition, 1.0);\n" +
                                  "		vTextureCoord = aTextureCoord;\n" +
                                  "}\n";

            var fProgram:string = "varying mediump vec2 vTextureCoord;\n" +
                                  "uniform sampler2D uSampler;\n" +

                                  "void main() {\n" +
                                  "		gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
                                  "}\n";

            this._program.upload( vProgram, fProgram );
            this._contextGL.setProgram( this._program );

            this._pMatrix = new away.utils.PerspectiveMatrix3D();
            this._pMatrix.perspectiveFieldOfViewLH( 45, 800/600, 0.1, 1000 );

            this._mvMatrix = new away.geom.Matrix3D();
            this._mvMatrix.appendTranslation( 0, 0, 5 );

            this._contextGL.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3 );
            this._contextGL.setGLSLVertexBufferAt( "aTextureCoord", vBuffer, 9, away.gl.ContextGLVertexBufferFormat.FLOAT_2 );

            this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
            this._requestAnimationFrameTimer.start();
        }

        private tick( dt:number )
        {
            this._mvMatrix.appendRotation( dt * 0.1, new away.geom.Vector3D( 0, 1, 0 ) );
            this._contextGL.setProgram( this._program );
            this._contextGL.setGLSLProgramConstantsFromMatrix( "pMatrix", this._pMatrix, true );
            this._contextGL.setGLSLProgramConstantsFromMatrix( "mvMatrix", this._mvMatrix, true );

            this._contextGL.setGLSLTextureAt( "uSampler", this._texture, 0 );

            this._contextGL.clear( 0.16, 0.16, 0.16, 1 );
            this._contextGL.drawTriangles( this._iBuffer, 0, this._iBuffer.numIndices/3 );
            this._contextGL.present();
        }
    }

}