/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
///<reference path="def/webgl.d.ts"/>
///<reference path="away/Config.ts"/>
///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/geom/Rectangle.ts" />
///<reference path="away/events/EventDispatcher.ts" />

class Away3D extends away.events.EventDispatcher
{
	
	private _config:away.Config;
	private _canvas:HTMLCanvasElement;
	private _gl:WebGLRenderingContext;
	
	constructor(config:away.Config = null, canvas:HTMLCanvasElement = null)
	{
		super();
		
		if( !config )
		{
			this._config = new away.Config();
		}
		else
		{
			this._config = config;
		}
		
		if( !canvas )
		{
			this._canvas = document.createElement( "canvas" );
			document.body.appendChild( this._canvas );
		}
		else
		{
			this._canvas = canvas;
		}
		
		this.configure(this._config);
		
		// test
		this._gl.clearColor(1.0, 0.0, 0.0, 1.0);
		this._gl.enable(this._gl.DEPTH_TEST);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
	}
	
	private createConfig()
	{
		this._config = new away.Config();
	}
	
	private createContext()
	{
		
		var gl:WebGLRenderingContext;
		try
		{
			gl = <WebGLRenderingContext> this._canvas.getContext("experimental-webgl") || <WebGLRenderingContext> this._canvas.getContext("webgl");
			this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
		}
		catch(e)
		{
			this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
		}
		
		if (!gl) {
			alert("WebGL is not available.");
		}
		
		this._gl = gl;
	}
	
	private createCanvas()
	{
		this._canvas = document.createElement( "canvas" );
		document.body.appendChild( this._canvas );
	}
	
	public configure(config:away.Config)
	{
		this._config = config;
		
		if( !this._canvas )
		{
			this.createCanvas();
		}
		
		if( !this._gl )
		{
			this.createContext();
		}
		
		this._gl.viewport.width = this._canvas.width;
		this._gl.viewport.height = this._canvas.height;
		/*
		this._gl.alpha = config.alpha;
		this._gl.premultipliedAlpha = config.premultipliedAlpha;
		this._gl.antialias = config.antialias;
		this._gl.stencil = config.stencil;
		this._gl.preserveDrawingBuffer = config.preserveDrawingBuffer;
		*/
	}
	
	public get canvas():HTMLCanvasElement
	{
		return this._canvas;
	}
	
	public get gl():WebGLRenderingContext
	{
		return this._gl;
	}
	
	public get config():away.Config
	{
		return this._config;
	}
}
