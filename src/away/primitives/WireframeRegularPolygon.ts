///<reference path="../_definitions.ts"/>

module away.primitives
{
	//import flash.geom.Vector3D;
	
	/**
	 * A WireframeRegularPolygon primitive mesh.
	 */
	export class WireframeRegularPolygon extends away.primitives.WireframePrimitiveBase
	{
		public static ORIENTATION_YZ:string = "yz";
		public static ORIENTATION_XY:string = "xy";
		public static ORIENTATION_XZ:string = "xz";
		
		private _radius:number;
		private _sides:number;
		private _orientation:string;
		
		/**
		 * Creates a new WireframeRegularPolygon object.
		 * @param radius The radius of the polygon.
		 * @param sides The number of sides on the polygon.
		 * @param color The colour of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 * @param orientation The orientaion in which the plane lies.
		 */
		constructor(radius:number, sides:number, color:number = 0xFFFFFF, thickness:number = 1, orientation:string = "yz")
		{
			super(color, thickness);
			
			this._radius = radius;
            this._sides = sides;
            this._orientation = orientation;
		}
		
		/**
		 * The orientaion in which the polygon lies.
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
		 * The radius of the regular polygon.
		 */
		public get radius():number
		{
			return this._radius;
		}
		
		public set radius(value:number)
		{
            this._radius = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * The number of sides to the regular polygon.
		 */
		public get sides():number
		{
			return this._sides;
		}
		
		public set sides(value:number)
		{
            this._sides = value;
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
			var index:number = 0;
			var s:number;
			
			if (this._orientation == WireframeRegularPolygon.ORIENTATION_XY)
            {
				v0.z = 0;
				v1.z = 0;
				
				for (s = 0; s < this._sides; ++s)
                {
					v0.x = this._radius*Math.cos(2*Math.PI*s/this._sides);
					v0.y = this._radius*Math.sin(2*Math.PI*s/this._sides);
					v1.x = this._radius*Math.cos(2*Math.PI*(s + 1)/this._sides);
					v1.y = this._radius*Math.sin(2*Math.PI*(s + 1)/this._sides);
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
			else if (this._orientation == WireframeRegularPolygon.ORIENTATION_XZ)
            {

				v0.y = 0;
				v1.y = 0;
				
				for (s = 0; s < this._sides; ++s)
                {
					v0.x = this._radius*Math.cos(2*Math.PI*s/this._sides);
					v0.z = this._radius*Math.sin(2*Math.PI*s/this._sides);
					v1.x = this._radius*Math.cos(2*Math.PI*(s + 1)/this._sides);
					v1.z = this._radius*Math.sin(2*Math.PI*(s + 1)/this._sides);
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
			else if (this._orientation == WireframeRegularPolygon.ORIENTATION_YZ)
            {
				v0.x = 0;
				v1.x = 0;
				
				for (s = 0; s < this._sides; ++s)
                {
					v0.z = this._radius*Math.cos(2*Math.PI*s/this._sides);
					v0.y = this._radius*Math.sin(2*Math.PI*s/this._sides);
					v1.z = this._radius*Math.cos(2*Math.PI*(s + 1)/this._sides);
					v1.y = this._radius*Math.sin(2*Math.PI*(s + 1)/this._sides);
                    this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
		}
	
	}
}
