///<reference path="../_definitions.ts"/>

module away.primitives
{
	//TODO - convert to geometry primitive

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
		 * The orientaion in which the polygon lies. Defaults to <code>ORIENTATION_XZ</code>.
		 */
		public get orientation():string
		{
			return this._orientation;
		}

		public set orientation(value:string)
		{
			if (this._orientation == value)
				return;

			this._orientation = value;

			this.pInvalidateGeometry();
		}

		/**
		 * The radius of the regular polygon. Defaults to 100.
		 */
		public get radius():number
		{
			return this._radius;
		}

		public set radius(value:number)
		{
			if (this._radius == value)
				return;

			this._radius = value;

			this.pInvalidateGeometry();
		}

		/**
		 * The number of sides to the regular polygon. Defaults to 16.
		 */
		public get sides():number
		{
			return this._sides;
		}

		public set sides(value:number)
		{
			if (this._sides == value)
				return;

			this._sides = value;

			this.removeAllSegments();
			this.pInvalidateGeometry();
		}

		/**
		 * Creates a new WireframeRegularPolygon object.
		 *
		 * @param radius The radius of the polygon. Defaults to 50.
		 * @param sides The number of sides on the polygon. Defaults to 16.
		 * @param color The colour of the wireframe lines.  Defaults to <code>0xFFFFFF</code>.
		 * @param thickness The thickness of the wireframe lines.  Defaults to 1.
		 * @param orientation The orientaion in which the plane lies. Defaults to <code>ORIENTATION_YZ</code>.
		 */
		constructor(radius:number = 50, sides:number = 16, color:number = 0xFFFFFF, thickness:number = 1, orientation:string = "xz")
		{
			super(color, thickness);

			this._radius = radius;
			this._sides = sides;
			this._orientation = orientation;
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

			if (this._orientation == WireframeRegularPolygon.ORIENTATION_XY) {
				v0.z = 0;
				v1.z = 0;

				for (s = 0; s < this._sides; ++s) {
					v0.x = this._radius*Math.cos(2*Math.PI*s/this._sides);
					v0.y = this._radius*Math.sin(2*Math.PI*s/this._sides);
					v1.x = this._radius*Math.cos(2*Math.PI*(s + 1)/this._sides);
					v1.y = this._radius*Math.sin(2*Math.PI*(s + 1)/this._sides);
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			} else if (this._orientation == WireframeRegularPolygon.ORIENTATION_XZ) {

				v0.y = 0;
				v1.y = 0;

				for (s = 0; s < this._sides; ++s) {
					v0.x = this._radius*Math.cos(2*Math.PI*s/this._sides);
					v0.z = this._radius*Math.sin(2*Math.PI*s/this._sides);
					v1.x = this._radius*Math.cos(2*Math.PI*(s + 1)/this._sides);
					v1.z = this._radius*Math.sin(2*Math.PI*(s + 1)/this._sides);
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			} else if (this._orientation == WireframeRegularPolygon.ORIENTATION_YZ) {
				v0.x = 0;
				v1.x = 0;

				for (s = 0; s < this._sides; ++s) {
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
