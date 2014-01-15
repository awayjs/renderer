///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />

class RotatingBluePlane extends away.events.EventDispatcher
{
	
	private _requestAnimationFrameTimer:away.utils.RequestAnimationFrame;
	private _stageGL:away.display.StageGL;
    private _image:HTMLImageElement;
	private _contextGL:away.displayGL.ContextGL;
	
	private _iBuffer:away.displayGL.IndexBuffer;
	private _mvMatrix:away.geom.Matrix3D;
	private _pMatrix:away.utils.PerspectiveMatrix3D;
	private _texture:away.displayGL.Texture;
	private _program:away.displayGL.Program;
	
	private _geometry:away.base.Geometry;
	
	private _stage:away.display.Stage;
	
	constructor( stage:away.display.Stage )
	{
		super();
		
		if( !document )
		{
			throw "The document root object must be avaiable";
		}
		this._stage = new away.display.Stage( 800, 600 );
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
		imgLoader.addEventListener( away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler) );
		imgLoader.load( urlRequest );
	}
	
	private imageCompleteHandler(e)
	{
        var imageLoader:away.net.IMGLoader = <away.net.IMGLoader> e.target
		this._image = imageLoader.image;
		
		this._stage.stageGLs[0].addEventListener( away.events.Event.CONTEXTGL_CREATE, away.utils.Delegate.create(this, this.onContextGLCreateHandler) );
		this._stage.stageGLs[0].requestContext();
	}
	
	private onContextGLCreateHandler( e )
	{
		this._stage.stageGLs[0].removeEventListener( away.events.Event.CONTEXTGL_CREATE, away.utils.Delegate.create(this, this.onContextGLCreateHandler) );
		
		var stageGL: away.display.StageGL = <away.display.StageGL> e.target;
		this._contextGL = stageGL.contextGL;
		
		this._texture = this._contextGL.createTexture( 512, 512, away.displayGL.ContextGLTextureFormat.BGRA, true );
		// this._texture.uploadFromHTMLImageElement( this._image );
		
		var bitmapData: away.display.BitmapData = new away.display.BitmapData( 512, 512, true, 0x02C3D4 );
		this._texture.uploadFromBitmapData( bitmapData );
		
		this._contextGL.configureBackBuffer( 800, 600, 0, true );
		this._contextGL.setColorMask( true, true, true, true ); 
		
		this._geometry = new away.base.Geometry();
		
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
		
		var vBuffer: away.displayGL.VertexBuffer = this._contextGL.createVertexBuffer( 4, 3 );
		vBuffer.uploadFromArray( vertices, 0, 4 );
		
		var tCoordBuffer: away.displayGL.VertexBuffer = this._contextGL.createVertexBuffer( 4, 2 );
		tCoordBuffer.uploadFromArray( uvCoords, 0, 4 );
		
		this._iBuffer = this._contextGL.createIndexBuffer( 6 );
		this._iBuffer.uploadFromArray( indices, 0, 6 );
		
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
		this._mvMatrix.appendTranslation( 0, 0, 3 );
		
		this._contextGL.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.displayGL.ContextGLVertexBufferFormat.FLOAT_3 );
		this._contextGL.setGLSLVertexBufferAt( "aTextureCoord", tCoordBuffer, 0, away.displayGL.ContextGLVertexBufferFormat.FLOAT_2 );
		
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
		this._contextGL.drawTriangles( this._iBuffer, 0, 2 );
		this._contextGL.present();
	}
}