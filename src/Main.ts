/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="def/webgl.d.ts"/>
///<reference path="App.ts" />
///<reference path="away/events/EventDispatcher.ts" />
///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/geom/Rectangle.ts" />
///<reference path="away/Config.ts" />

class Main extends away.events.EventDispatcher
{
	
	private _app:App;
	
	constructor(config:away.Config)
	{
		super();
		
		if( !config.Z_INTERNAL_canvas )
		{
			config.Z_INTERNAL_canvas = document.createElement( "canvas" );
		}
		
		var canvas:HTMLCanvasElement = config.Z_INTERNAL_canvas;
		canvas.style.width = viewport.width + "px";
		canvas.style.height = viewport.height + "px";
		
		var viewport:away.geom.Rectangle = config.Z_INTERNAL_viewport;
		
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
		
		this._app = new App(canvas, gl);
	}
	
	public get app():App
	{
		return this._app;
	}
}