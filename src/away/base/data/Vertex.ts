///<reference path="../../_definitions.ts"/>

module away.base
{
	
	/**
	 * Vertex value object.
	 */
	export class Vertex
	{
		private _x:number;
		private _y:number;
		private _z:number;
		private _index:number;
		
		/**
		 * Creates a new <code>Vertex</code> value object.
		 *
		 * @param    x            [optional]    The x value. Defaults to 0.
		 * @param    y            [optional]    The y value. Defaults to 0.
		 * @param    z            [optional]    The z value. Defaults to 0.
		 * @param    index        [optional]    The index value. Defaults is NaN.
		 */
		constructor(x:number = 0, y:number = 0, z:number = 0, index:number = 0)
		{
			this._x = x;
            this._y = y;
            this._z = z;
            this._index = index;
		}
		
		/**
		 * To define/store the index of value object
		 * @param    ind        The index
		 */
		public set index(ind:number)
		{
            this._index = ind;
		}
		
		public get index():number
		{
			return this._index;
		}
		
		/**
		 * To define/store the x value of the value object
		 * @param    value        The x value
		 */
		public get x():number
		{
			return this._x;
		}
		
		public set x(value:number)
		{
            this._x = value;
		}
		
		/**
		 * To define/store the y value of the value object
		 * @param    value        The y value
		 */
		public get y():number
		{
			return this._y;
		}
		
		public set y(value:number)
		{
            this._y = value;
		}
		
		/**
		 * To define/store the z value of the value object
		 * @param    value        The z value
		 */
		public get z():number
		{
			return this._z;
		}
		
		public set z(value:number)
		{
            this._z = value;
		}
		
		/**
		 * returns a new Vertex value Object
		 */
		public clone():Vertex
		{
			return new Vertex(this._x, this._y, this._z);
		}
		
		/**
		 * returns the value object as a string for trace/debug purpose
		 */
		public toString():string
		{
			return this._x + "," + this._y + "," + this._z;
		}
	
	}
}
