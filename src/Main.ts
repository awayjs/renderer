/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="def/webgl.d.ts"/>
///<reference path="Away.ts" />
///<reference path="away/Config.ts" />

class Main extends away.events.EventDispatcher
{
	
	private _away:Away;
	
	constructor(config:away.Config)
	{
		super();
		
		this._away = new Away(config);
		
		/*
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
		
		this._away = new Away(config, canvas, gl);
		*/
	}
	
	public get away():Away
	{
		return this._away;
	}
}