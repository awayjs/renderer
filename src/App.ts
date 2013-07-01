/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
///<reference path="def/webgl.d.ts"/>
class App
{
	private _canvas:HTMLCanvasElement;
	private _gl:WebGLRenderingContext;

	constructor(canvas:any, gl:WebGLRenderingContext)
	{
		this._gl = gl;
		this._canvas = canvas;
		
		// test
		gl.viewport.width = canvas.width;
		gl.viewport.height = canvas.height;
		
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	
}
