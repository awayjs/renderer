///<reference path="../_definitions.ts"/>
module away.primitives
{
	//import flash.geom.Vector3D;
	
	/**
	 * A WireframePlane primitive mesh.
	 */
	export class WireframePlane extends away.primitives.WireframePrimitiveBase
	{
		public static ORIENTATION_YZ:string = "yz";
		public static ORIENTATION_XY:string = "xy";
		public static ORIENTATION_XZ:string = "xz";
		
		private _width:number;
		private _height:number;
		private _segmentsW:number;
		private _segmentsH:number;
		private _orientation:string;
		
		/**
		 * Creates a new WireframePlane object.
		 * @param width The size of the cube along its X-axis.
		 * @param height The size of the cube along its Y-axis.
		 * @param segmentsW The number of segments that make up the cube along the X-axis.
		 * @param segmentsH The number of segments that make up the cube along the Y-axis.
		 * @param color The colour of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 * @param orientation The orientaion in which the plane lies.
		 */
		constructor(width:number, height:number, segmentsW:number = 10, segmentsH:number = 10, color:number = 0xFFFFFF, thickness:number = 1, orientation:string = "yz")
		{
			super(color, thickness);
			
			this._width = width;
            this._height = height;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this._orientation = orientation;
		}
		
		/**
		 * The orientaion in which the plane lies.
		 */
		public get orientation():string
		{
			return this._orientation;
		}
		
		public set orientation(value:string)
		{
            this._orientation = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * The size of the cube along its X-axis.
		 */
		public get width():number
		{
			return this._width;
		}
		
		public set width(value:number)
		{
            this._width = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * The size of the cube along its Y-axis.
		 */
		public get height():number
		{
			return this._height;
		}
		
		public set height(value:number)
		{
			if (value <= 0)
				throw new Error("Value needs to be greater than 0");
            this._height = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * The number of segments that make up the plane along the X-axis.
		 */
		public get segmentsW():number
		{
			return this._segmentsW;
		}
		
		public set segmentsW(value:number)
		{
            this._segmentsW = value;
            this.removeAllSegments();
            this.pInvalidateGeometry();
		}
		
		/**
		 * The number of segments that make up the plane along the Y-axis.
		 */
		public get segmentsH():number
		{
			return this._segmentsH;
		}
		
		public set segmentsH(value:number)
		{
            this._segmentsH = value;
            this.removeAllSegments();
            this.pInvalidateGeometry();
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{
			var v0:away.geom.Vector3D = new away.geom.Vector3D();
			var v1:away.geom.Vector3D = new away.geom.Vector3D();
			var hw:number = this._width*.5;
			var hh:number = this._height*.5;
			var index:number = 0;
			var ws:number, hs:number;
			
			if ( this._orientation == WireframePlane.ORIENTATION_XY)
            {

				v0.y = hh;
				v0.z = 0;
				v1.y = -hh;
				v1.z = 0;
				
				for (ws = 0; ws <= this._segmentsW; ++ws)
                {
					v0.x = v1.x = (ws/this._segmentsW - .5)*this._width;
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
				
				v0.x = -hw;
				v1.x = hw;
				
				for (hs = 0; hs <= this._segmentsH; ++hs)
                {
					v0.y = v1.y = (hs/this._segmentsH - .5)*this._height;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
			else if (this._orientation == WireframePlane.ORIENTATION_XZ)
            {
				v0.z = hh;
				v0.y = 0;
				v1.z = -hh;
				v1.y = 0;
				
				for (ws = 0; ws <= this._segmentsW; ++ws)
                {
					v0.x = v1.x = (ws/this._segmentsW - .5)*this._width;
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
				
				v0.x = -hw;
				v1.x = hw;
				
				for (hs = 0; hs <= this._segmentsH; ++hs)
                {
					v0.z = v1.z = (hs/this._segmentsH - .5)*this._height;
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
			else if (this._orientation == WireframePlane.ORIENTATION_YZ)
            {
				v0.y = hh;
				v0.x = 0;
				v1.y = -hh;
				v1.x = 0;
				
				for (ws = 0; ws <= this._segmentsW; ++ws)
                {
					v0.z = v1.z = (ws/this._segmentsW - .5)*this._width;
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
				
				v0.z = hw;
				v1.z = -hw;
				
				for (hs = 0; hs <= this._segmentsH; ++hs)
                {
					v0.y = v1.y = (hs/this._segmentsH - .5)*this._height;
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
		}
	
	}
}
