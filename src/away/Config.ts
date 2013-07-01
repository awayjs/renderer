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
		private _viewport				: away.geom.Rectangle;
		private _alpha                	: number;
        private _premultipliedAlpha   	: number;
        private _antialias            	: boolean;
        private _stencil              	: boolean;
        private _preserveDrawingBuffer	: boolean;
		
		constructor(
			canvas = null,
			viewport:away.geom.Rectangle = new away.geom.Rectangle( 0, 0, 800, 600),
			alpha = 1,
			premultipliedAlpha = 1,
			antialias = true,
			stencil = true,
			preserveDrawingBuffer = true
		)
		{
			this._canvas = canvas;
			this._viewport = viewport;
			this._alpha = alpha,
			this._premultipliedAlpha = premultipliedAlpha,
			this._antialias = antialias,
			this._stencil = stencil,
			this._preserveDrawingBuffer = preserveDrawingBuffer
		}
		
		public get Z_INTERNAL_viewport():away.geom.Rectangle
		{
			return this._viewport;
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