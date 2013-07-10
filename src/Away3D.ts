/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="def/webgl.d.ts"/>

///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/events/EventDispatcher.ts" />

///<reference path="away/display/Stage.ts" />
///<reference path="away/display/Stage3D.ts" />

///<reference path="away/display3D/Context3D.ts" />
///<reference path="away/display3D/Context3DTextureFormat.ts" />
///<reference path="away/display3D/Context3DVertexBufferFormat.ts" />
///<reference path="away/display3D/IndexBuffer3D.ts" />
///<reference path="away/display3D/Program3D.ts" />
///<reference path="away/display3D/Texture.ts" />
///<reference path="away/display3D/VertexBuffer3D.ts" />

///<reference path="away/utils/PerspectiveMatrix3D.ts" />
///<reference path="away/utils/RequestAnimationFrame.ts" />

///<reference path="away/net/IMGLoader.ts" />
///<reference path="away/net/URLRequest.ts" />

var GL:WebGLRenderingContext = null;

class Away3D extends away.events.EventDispatcher
{
	
	private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
	private _stage3D:away.display.Stage3D;
    private _image:HTMLImageElement;
	private _context3D:away.display3D.Context3D;
	
	private _iBuffer:away.display3D.IndexBuffer3D;
	private _mvMatrix:away.geom.Matrix3D;
	private _pMatrix:away.utils.PerspectiveMatrix3D;
	private _texture:away.display3D.Texture;
	private _program:away.display3D.Program3D;
	
	private _stage:away.display.Stage;
	
	constructor( stage:away.display.Stage )
	{
		super();
		
		if( !document )
		{
			throw "The document root object must be avaiable";
		}
		
		this._stage = new away.display.Stage( 640, 480 );
		
		this.loadResources();
	}
	
	public get stage():away.display.Stage
	{
		return this._stage;
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
        var imageLoader:away.net.IMGLoader = <away.net.IMGLoader> e.target
		this._image = imageLoader.image;
		
		this._stage.stage3Ds[0].addEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
		this._stage.stage3Ds[0].requestContext();
	}
	
	private onContext3DCreateHandler( e )
	{
		this._stage.stage3Ds[0].removeEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
		
		var stage3D: away.display.Stage3D = <away.display.Stage3D> e.target;
		this._context3D = stage3D.context3D;
		
		this._texture = this._context3D.createTexture( 512, 512, away.display3D.Context3DTextureFormat.BGRA, true );
		this._texture.uploadFromHTMLImageElement( this._image );
		
		this._context3D.configureBackBuffer( 800, 600, 0, true );
		this._context3D.setColorMask( true, true, true, true ); 
		
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
		
		var vBuffer: away.display3D.VertexBuffer3D = this._context3D.createVertexBuffer( 4, 3 );
		vBuffer.upload( vertices, 0, 4 );
		
		var tCoordBuffer: away.display3D.VertexBuffer3D = this._context3D.createVertexBuffer( 4, 2 );
		tCoordBuffer.upload( uvCoords, 0, 4 );
		
		this._iBuffer = this._context3D.createIndexBuffer( 6 );
		this._iBuffer.upload( indices, 0, 6 );
		
		this._program = this._context3D.createProgram();
		
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
		this._context3D.setProgram( this._program );
		
		this._pMatrix = new away.utils.PerspectiveMatrix3D();
		this._pMatrix.perspectiveFieldOfViewLH( 45, 800/600, 0.1, 1000 );
		
		this._mvMatrix = new away.geom.Matrix3D();
		this._mvMatrix.appendTranslation( 0, 0, 4 );
		
		this._context3D.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3 );
		this._context3D.setGLSLVertexBufferAt( "aTextureCoord", tCoordBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_2 );
		
		this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
        this._requestAnimationFrameTimer.start();
	}
	
	private tick( dt:number )
	{
		this._mvMatrix.appendRotation( dt * 0.1, new away.geom.Vector3D( 0, 1, 0 ) );
		this._context3D.setProgram( this._program );
		this._context3D.setGLSLProgramConstantsFromMatrix( "pMatrix", this._pMatrix, true );
		this._context3D.setGLSLProgramConstantsFromMatrix( "mvMatrix", this._mvMatrix, true );
		
		this._context3D.setGLSLTextureAt( "uSampler", this._texture, 0 );
		
		this._context3D.clear( 0.1, 0.2, 0.3, 1 );
		this._context3D.drawTriangles( this._iBuffer, 0, 2 );
		this._context3D.present();
	}
}