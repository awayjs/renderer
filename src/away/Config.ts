/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="geom/Rectangle.ts"/>
module away
{
	export class Config
	{
		private _canvas					: HTMLCanvasElement;
		private _alpha                	: number;
        private _premultipliedAlpha   	: number;
        private _antialias            	: boolean;
        private _stencil              	: boolean;
        private _preserveDrawingBuffer	: boolean;
		
		constructor(
			canvas = null,
			alpha = 1,
			premultipliedAlpha = 1,
			antialias = true,
			stencil = true,
			preserveDrawingBuffer = true
		)
		{
			this._canvas = canvas;
			this._alpha = alpha,
			this._premultipliedAlpha = premultipliedAlpha,
			this._antialias = antialias,
			this._stencil = stencil,
			this._preserveDrawingBuffer = preserveDrawingBuffer
		}
		
		public get Z_INTERNAL_canvas():HTMLCanvasElement
		{
			return this._canvas;
		}
		
		public set Z_INTERNAL_canvas(value:HTMLCanvasElement)
		{
			this._canvas = value;
		}
		
	}
	
}