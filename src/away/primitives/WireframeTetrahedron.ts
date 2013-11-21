///<reference path="../_definitions.ts" />
module away.primitives
{
	//import flash.geom.Vector3D;

	//import away3d.primitives.WireframePrimitiveBase;

	/**
	 * A WireframeTetrahedron primitive mesh
	 */
	export class WireframeTetrahedron extends away.primitives.WireframePrimitiveBase
	{

		public static ORIENTATION_YZ:string = "yz";
		public static ORIENTATION_XY:string = "xy";
		public static ORIENTATION_XZ:string = "xz";

		private _width:number;
		private _height:number;
		private _orientation:string;

		/**
		 * Creates a new WireframeTetrahedron object.
		 * @param width The size of the tetrahedron buttom size.
		 * @param height The size of the tetranhedron height.
		 * @param color The color of the wireframe lines.
		 * @param thickness The thickness of the wireframe lines.
		 */
			constructor(width:number, height:number, color:number = 0xffffff, thickness:number = 1, orientation:string = "yz")
		{
			super(color, thickness);

			this._width = width;
			this._height = height;

			this._orientation = orientation;
		}

		/**
		 * The orientation in which the plane lies
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
		 * The size of the tetrahedron bottom.
		 */
		public get width():number
		{
			return this._width;
		}

		public set width(value:number)
		{
			if (value <= 0)
				throw new Error("Value needs to be greater than 0");
			this._width = value;
			this.pInvalidateGeometry();
		}

		/**
		 * The size of the tetrahedron height.
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
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{

			var bv0:away.geom.Vector3D;
			var bv1:away.geom.Vector3D;
			var bv2:away.geom.Vector3D;
			var bv3:away.geom.Vector3D;
			var top:away.geom.Vector3D;

			var hw:number = this._width*0.5;

			switch (this._orientation) {
				case WireframeTetrahedron.ORIENTATION_XY:

					bv0 = new away.geom.Vector3D(-hw, hw, 0);
					bv1 = new away.geom.Vector3D(hw, hw, 0);
					bv2 = new away.geom.Vector3D(hw, -hw, 0);
					bv3 = new away.geom.Vector3D(-hw, -hw, 0);
					top = new away.geom.Vector3D(0, 0, this._height);
					break;
				case WireframeTetrahedron.ORIENTATION_XZ:
					bv0 = new away.geom.Vector3D(-hw, 0, hw);
					bv1 = new away.geom.Vector3D(hw, 0, hw);
					bv2 = new away.geom.Vector3D(hw, 0, -hw);
					bv3 = new away.geom.Vector3D(-hw, 0, -hw);
					top = new away.geom.Vector3D(0, this._height, 0);
					break;
				case WireframeTetrahedron.ORIENTATION_YZ:
					bv0 = new away.geom.Vector3D(0, -hw, hw);
					bv1 = new away.geom.Vector3D(0, hw, hw);
					bv2 = new away.geom.Vector3D(0, hw, -hw);
					bv3 = new away.geom.Vector3D(0, -hw, -hw);
					top = new away.geom.Vector3D(this._height, 0, 0);
					break;
			}
			//bottom
			this.pUpdateOrAddSegment(0, bv0, bv1);
			this.pUpdateOrAddSegment(1, bv1, bv2);
			this.pUpdateOrAddSegment(2, bv2, bv3);
			this.pUpdateOrAddSegment(3, bv3, bv0);
			//bottom to top
			this.pUpdateOrAddSegment(4, bv0, top);
			this.pUpdateOrAddSegment(5, bv1, top);
			this.pUpdateOrAddSegment(6, bv2, top);
			this.pUpdateOrAddSegment(7, bv3, top);
		}
	}
}
