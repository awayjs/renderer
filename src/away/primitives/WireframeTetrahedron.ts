///<reference path="../_definitions.ts" />
module away.primitives
{
	//TODO - convert to geometry primitive

	/**
	 * A WireframeTetrahedron primitive mesh
	 */
	export class WireframeTetrahedron extends away.primitives.WireframePrimitiveBase
	{

		public static ORIENTATION_YZ:string = "yz";
		public static ORIENTATION_XY:string = "xy";
		public static ORIENTATION_XZ:string = "xz";

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

			this._orientation = orientation;

			this.width = width;
			this.height = height;
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
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{

			var bv0:away.geom.Vector3D;
			var bv1:away.geom.Vector3D;
			var bv2:away.geom.Vector3D;
			var bv3:away.geom.Vector3D;
			var top:away.geom.Vector3D;

			var hw:number = 0.5;

			switch (this._orientation) {
				case WireframeTetrahedron.ORIENTATION_XY:

					bv0 = new away.geom.Vector3D(-hw, hw, 0);
					bv1 = new away.geom.Vector3D(hw, hw, 0);
					bv2 = new away.geom.Vector3D(hw, -hw, 0);
					bv3 = new away.geom.Vector3D(-hw, -hw, 0);
					top = new away.geom.Vector3D(0, 0, 1);
					break;
				case WireframeTetrahedron.ORIENTATION_XZ:
					bv0 = new away.geom.Vector3D(-hw, 0, hw);
					bv1 = new away.geom.Vector3D(hw, 0, hw);
					bv2 = new away.geom.Vector3D(hw, 0, -hw);
					bv3 = new away.geom.Vector3D(-hw, 0, -hw);
					top = new away.geom.Vector3D(0, 1, 0);
					break;
				case WireframeTetrahedron.ORIENTATION_YZ:
					bv0 = new away.geom.Vector3D(0, -hw, hw);
					bv1 = new away.geom.Vector3D(0, hw, hw);
					bv2 = new away.geom.Vector3D(0, hw, -hw);
					bv3 = new away.geom.Vector3D(0, -hw, -hw);
					top = new away.geom.Vector3D(1, 0, 0);
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
