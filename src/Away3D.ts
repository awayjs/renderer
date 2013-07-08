/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="def/webgl.d.ts"/>

///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/events/EventDispatcher.ts" />

///<reference path="away/display3D/Context3D.ts" />
///<reference path="away/display3D/Context3DTextureFormat.ts" />
///<reference path="away/display3D/Context3DVertexBufferFormat.ts" />
///<reference path="away/display3D/IndexBuffer3D.ts" />
///<reference path="away/display3D/Program3D.ts" />
///<reference path="away/display3D/Stage3D.ts" />
///<reference path="away/display3D/Texture.ts" />
///<reference path="away/display3D/VertexBuffer3D.ts" />

///<reference path="away/utils/PerspectiveMatrix3D.ts" />

///<reference path="away/net/IMGLoader.ts" />
///<reference path="away/net/URLRequest.ts" />

var GL:WebGLRenderingContext = null;

class Away3D extends away.events.EventDispatcher
{
	
	private _stage3D:away.display3D.Stage3D;

    private _image:HTMLImageElement;

	
	constructor(canvas:HTMLCanvasElement = null)
	{
		super();
		
		if( !canvas )
		{
			canvas = document.createElement( "canvas" );
			document.body.appendChild( canvas );
		}
		
		this._stage3D = new away.display3D.Stage3D( canvas );
		this.loadResources();
	}
	
	private loadResources()
	{
		var urlRequest:away.net.URLRequest = new away.net.URLRequest( "130909wall_big.png" );
		var imgLoader:away.net.IMGLoader = new away.net.IMGLoader();
		imgLoader.addEventListener( away.events.Event.COMPLETE, this.imageCompleteHandler, this );
		imgLoader.load( urlRequest );
	}
	
	private imageCompleteHandler(e)
	{
        var imageLoader : away.net.IMGLoader = <away.net.IMGLoader> e.target
		this._image = imageLoader.image;
		console.log( "Image data " + this._image );
		this._stage3D.addEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
		this._stage3D.requestContext();
	}
	
	private onContext3DCreateHandler( e )
	{
		this._stage3D.removeEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
		
		// test
		var stage3D: away.display3D.Stage3D = <away.display3D.Stage3D> e.target;
		var context3D: away.display3D.Context3D = stage3D.context3D;
		
		var texture:away.display3D.Texture = context3D.createTexture( 512, 512, away.display3D.Context3DTextureFormat.BGRA, true );
		
		context3D.configureBackBuffer( 800, 600, 0, true );
		context3D.setColorMask( true, true, true, true ); 
		
		var vertices:number[] = [
							-1.0, -1.0,  0.0,
							 1.0, -1.0,  0.0,
							 1.0,  1.0,  0.0,
							-1.0,  1.0,  0.0
							];
		
		var uvCoords:number[] = [
								 0, 0, 
								 1, 0,
								 1, 1,
								 0, 1
								];
		
		var indices:number[] = [
							0, 1, 2,
							0, 2, 3
							]
		
		var vBuffer: away.display3D.VertexBuffer3D = context3D.createVertexBuffer( 4, 3 );
		vBuffer.upload( vertices, 0, 4 );
		
		var tCoordBuffer: away.display3D.VertexBuffer3D = context3D.createVertexBuffer( 4, 2 );
		tCoordBuffer.upload( uvCoords, 0, 4 );
		
		var iBuffer: away.display3D.IndexBuffer3D = context3D.createIndexBuffer( 6 );
		iBuffer.upload( indices, 0, 6 );
		
		var program:away.display3D.Program3D = context3D.createProgram();
		
		var vProgram:string = "uniform mat4 mvMatrix;\n" +
							  "uniform mat4 pMatrix;\n" +
							  "attribute vec2 aTextureCoord;\n" +
							  "attribute vec3 aVertexPosition;\n" +
							  "varying vec2 vTextureCoord;\n" +
							  
							  "void main() {\n" +
							  "		gl_Position = pMatrix * mvMatrix * vec4(aVertexPosition, 1.0);\n" +
							  "		vTextureCoord = aTextureCoord;\n" +
							  "}\n";
		
		var fProgram:string = "varying highp vec2 vTextureCoord;\n" +
							  "uniform sampler2D uSampler;\n" +
							  
							  "void main() {\n" +
							  "		gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
							  "}\n";
		
		program.upload( vProgram, fProgram );
		context3D.setProgram( program );
		
		var pMatrix: away.utils.PerspectiveMatrix3D = new away.utils.PerspectiveMatrix3D();
		pMatrix.perspectiveFieldOfViewLH( 90, 800/600, 0.1, 1000 );
		
		var mvMatrix:away.geom.Matrix3D = new away.geom.Matrix3D();
		mvMatrix.appendRotation( 25, new away.geom.Vector3D( 1, 0, 0 ) );
		mvMatrix.appendTranslation( 0, 0, 2 );
		
		context3D.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3 );
		context3D.setGLSLVertexBufferAt( "aTextureCoord", tCoordBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_2 );
		
		context3D.setGLSLProgramConstantsFromMatrix( "pMatrix", pMatrix, true );
		context3D.setGLSLProgramConstantsFromMatrix( "mvMatrix", mvMatrix, true );
		
		context3D.setGLSLTextureAt( "uSampler", texture, 0 );
		
		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this._image );
		
		context3D.clear( 0.9, 0.6, 0.3, 1 );
		context3D.drawTriangles( iBuffer, 0, 2 );
		context3D.present();
		
	}

}