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
		private _tetrahedronDepth:number;
		private _tetrahedronHeight:number;
		private _tetrahedronWidth:number;

		/**
		 * The orientation in which the plane lies. Defaults to <code>ORIENTATION_XZ</code>.
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
		 * The size of the tetrahedron along its Z-axis. Defaults to 100.
		 */
		public get tetrahedronDepth():number
		{
			return this._tetrahedronDepth;
		}

		public set tetrahedronDepth(value:number)
		{
			if (this._tetrahedronDepth == value)
				return;

			this._tetrahedronDepth == value

			this.pInvalidateGeometry();
		}

		/**
		 * The size of the tetrahedron along its Y-axis. Defaults to 100.
		 */
		public get tetrahedronHeight():number
		{
			return this._tetrahedronHeight;
		}

		public set tetrahedronHeight(value:number)
		{
			if (this._tetrahedronHeight == value)
				return;

			this._tetrahedronHeight == value

			this.pInvalidateGeometry();
		}

		/**
		 * The size of the tetrahedron along its X-axis. Defaults to 100.
		 */
		public get tetrahedronWidth():number
		{
			return this._tetrahedronWidth;
		}

		public set tetrahedronWidth(value:number)
		{
			if (this._tetrahedronWidth == value)
				return;

			this._tetrahedronWidth == value

			this.pInvalidateGeometry();
		}

		/**
		 * Creates a new WireframeTetrahedron object.
		 *
		 * @param tetrahedronWidth The size of the tetrahedron along its X-axis. Defaults to 100.
		 * @param tetrahedronHeight The size of the tetranhedron along its Y-axis. Defaults to 100.
		 * @param tetrahedronDepth The size of the tetranhedron along its Z-axis. Defaults to 100.
		 * @param color The color of the wireframe lines. Defaults to <code>0xFFFFFF</code>.
		 * @param thickness The thickness of the wireframe lines. Defaults to <code>ORIENTATION_XZ</code>.
		 */
		constructor(tetrahedronWidth:number = 100, tetrahedronHeight:number = 100, tetrahedronDepth:number = 100, color:number = 0xffffff, thickness:number = 1, orientation:string = "xz")
		{
			super(color, thickness);

			this._orientation = orientation;

			this._tetrahedronHeight = tetrahedronHeight;
			this._tetrahedronWidth = tetrahedronWidth;
			this._tetrahedronDepth = tetrahedronDepth;
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

			var hw:number = this._tetrahedronWidth/2;
			var hd:number = this._tetrahedronDepth/2;

			switch (this._orientation) {
				case WireframeTetrahedron.ORIENTATION_XY:

					bv0 = new away.geom.Vector3D(-hw, hd, 0);
					bv1 = new away.geom.Vector3D(hw, hd, 0);
					bv2 = new away.geom.Vector3D(hw, -hd, 0);
					bv3 = new away.geom.Vector3D(-hw, -hd, 0);
					top = new away.geom.Vector3D(0, 0, this._tetrahedronHeight);
					break;
				case WireframeTetrahedron.ORIENTATION_XZ:
					bv0 = new away.geom.Vector3D(-hw, 0, hd);
					bv1 = new away.geom.Vector3D(hw, 0, hd);
					bv2 = new away.geom.Vector3D(hw, 0, -hd);
					bv3 = new away.geom.Vector3D(-hw, 0, -hd);
					top = new away.geom.Vector3D(0, this._tetrahedronHeight, 0);
					break;
				case WireframeTetrahedron.ORIENTATION_YZ:
					bv0 = new away.geom.Vector3D(0, -hw, hd);
					bv1 = new away.geom.Vector3D(0, hw, hd);
					bv2 = new away.geom.Vector3D(0, hw, -hd);
					bv3 = new away.geom.Vector3D(0, -hw, -hd);
					top = new away.geom.Vector3D(this._tetrahedronHeight, 0, 0);
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
