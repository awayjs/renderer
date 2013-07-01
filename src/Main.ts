/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
 ///<reference path="def/webgl.d.ts"/>
 ///<reference path="App.ts" />
class Main
{
	
	private _app:App;
	
	constructor(canvasElement: HTMLCanvasElement = null) 
	{
		
		var canvas: HTMLCanvasElement = canvasElement || document.createElement("canvas");
		
		var gl:WebGLRenderingContext;
		try
		{
			gl = <WebGLRenderingContext> canvas.getContext("experimental-webgl");
		}
		catch(e)
		{
			alert("An error occured. " + e);
		}
		
		if (!gl) {
			alert("WebGL is not available.");
		}
		
		this._app = new App(canvas, gl);
	}
}