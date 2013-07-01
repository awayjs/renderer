/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
module away.geom
{
	export class Rectangle
	{
		private _x: number;
		private _y: number;
		private _width:number;
		private _height:number;
		
		constructor( x:number = 0, y:number = 0, width:number = 0, height:number = 0 )
		{
			this._x = x;
			this._y = y;
			this._width = width;
			this._height = height;
		}
	}
}