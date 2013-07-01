/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
///<reference path="def/webgl.d.ts"/>
///<reference path="away/Config.ts"/>
///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/geom/Rectangle.ts" />
///<reference path="away/events/EventDispatcher.ts" />

class Away extends away.events.EventDispatcher
{
	private _canvas:HTMLCanvasElement;
	private _gl:WebGLRenderingContext;
	private _config:away.Config;
	
	
	constructor(config:away.Config)
	{
		super();
		
		this.configure( config );
		
		// test
		this._gl.viewport.width = this._canvas.width;
		this._gl.viewport.height = this._canvas.height;
		
		this._gl.clearColor(1.0, 0.0, 0.0, 1.0);
		this._gl.enable(this._gl.DEPTH_TEST);
		
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
	}
	
	private initialize()
	{
		// TODO
	}
	
	public configure(config: away.Config)
	{
		if( !config.Z_INTERNAL_canvas )
		{
			config.Z_INTERNAL_canvas = document.createElement( "canvas" );
		}
		
		var canvas:HTMLCanvasElement = config.Z_INTERNAL_canvas;
		
		var gl:WebGLRenderingContext;
		try
		{
			gl = <WebGLRenderingContext> canvas.getContext("experimental-webgl") || <WebGLRenderingContext> canvas.getContext("webgl");
			
			this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_SUCCESS ) );
		}
		catch(e)
		{
			this.dispatchEvent( new away.events.AwayEvent( away.events.AwayEvent.INITIALIZE_FAILED, e ) );
		}
		
		if (!gl) {
			alert("WebGL is not available.");
		}
		
		this._config = config;
		this._gl = gl;
		this._canvas = canvas;
	}
	
	public get canvas():HTMLCanvasElement
	{
		return this._canvas;
	}
	
	public get gl():WebGLRenderingContext
	{
		return this._gl;
	}
}
