///<reference path="../_definitions.ts"/>
module away.primitives
{
	//TODO - convert to geometry primitive

	/**
	 * A WireframePlane primitive mesh.
	 */
	export class WireframePlane extends away.primitives.WireframePrimitiveBase
	{
		public static ORIENTATION_YZ:string = "yz";
		public static ORIENTATION_XY:string = "xy";
		public static ORIENTATION_XZ:string = "xz";

		private _planeHeight:number;
		private _planeWidth:number;
		private _orientation:string;
		private _segmentsW:number;
		private _segmentsH:number;

		/**
		 * The size of the plane along its Y-axis. Defaults to 100.
		 */
		public get planeHeight():number
		{
			return this._planeHeight;
		}

		public set planeHeight(value:number)
		{
			if (this._planeHeight == value)
				return;

			this._planeHeight == value

			this.pInvalidateGeometry();
		}

		/**
		 * The size of the plane along its X-axis. Defaults to 100.
		 */
		public get planeWidth():number
		{
			return this._planeWidth;
		}

		public set planeWidth(value:number)
		{
			if (this._planeWidth == value)
				return;

			this._planeWidth == value

			this.pInvalidateGeometry();
		}

		/**
		 * The orientaion in which the plane lies. Defaults to <code>ORIENTATION_XZ</code>.
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
		 * The number of segments that make up the plane along the Y-axis. Defaults to 10.
		 */
		public get segmentsH():number
		{
			return this._segmentsH;
		}

		public set segmentsH(value:number)
		{
			if (this._segmentsH == value)
				return;
			
			this._segmentsH = value;
			
			this.removeAllSegments();
			this.pInvalidateGeometry();
		}

		/**
		 * The number of segments that make up the plane along the X-axis. Defaults to 10.
		 */
		public get segmentsW():number
		{
			return this._segmentsW;
		}

		public set segmentsW(value:number)
		{
			if (this._segmentsW == value)
				return;
			
			this._segmentsW = value;
			
			this.removeAllSegments();
			this.pInvalidateGeometry();
		}

		/**
		 * Creates a new WireframePlane object.
		 *
		 * @param planeWidth The size of the plane along its X-axis. Defaults to 100.
		 * @param planeHeight The size of the plane along its Y-axis. Defaults to 100.
		 * @param segmentsW The number of segments that make up the plane along the X-axis. Defaults to 10.
		 * @param segmentsH The number of segments that make up the plane along the Y-axis. Defaults to 10.
		 * @param color The colour of the wireframe lines. Defaults to 0xFFFFFF.
		 * @param thickness The thickness of the wireframe lines. Defaults to 1.
		 * @param orientation The orientaion in which the plane lies. Defaults to <code>ORIENTATION_XZ</code>.
		 */
		constructor(planeWidth:number = 100, planeHeight:number = 100, segmentsW:number = 10, segmentsH:number = 10, color:number = 0xFFFFFF, thickness:number = 1, orientation:string = "xz")
		{
			super(color, thickness);

			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;
			this._orientation = orientation;

			this._planeWidth = planeWidth;
			this._planeHeight = planeHeight;
		}

		/**
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{
			var v0:away.geom.Vector3D = new away.geom.Vector3D();
			var v1:away.geom.Vector3D = new away.geom.Vector3D();
			var hw:number =this._planeWidth/2;
			var hh:number = this._planeHeight/2;
			var index:number = 0;
			var ws:number, hs:number;

			if (this._orientation == WireframePlane.ORIENTATION_XY) {

				v0.y = hh;
				v0.z = 0;
				v1.y = -hh;
				v1.z = 0;

				for (ws = 0; ws <= this._segmentsW; ++ws) {
					v0.x = v1.x = this._planeWidth*ws/this._segmentsW - hw;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}

				v0.x = -hw;
				v1.x = hw;

				for (hs = 0; hs <= this._segmentsH; ++hs) {
					v0.y = v1.y = this._planeHeight*hs/this._segmentsH - hh;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			} else if (this._orientation == WireframePlane.ORIENTATION_XZ) {
				v0.z = hh;
				v0.y = 0;
				v1.z = -hh;
				v1.y = 0;

				for (ws = 0; ws <= this._segmentsW; ++ws) {
					v0.x = v1.x = this._planeWidth*ws/this._segmentsW - hw;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}

				v0.x = -hw;
				v1.x = hw;

				for (hs = 0; hs <= this._segmentsH; ++hs) {
					v0.z = v1.z = this._planeHeight*hs/this._segmentsH - hh;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			} else if (this._orientation == WireframePlane.ORIENTATION_YZ) {
				v0.y = hh;
				v0.x = 0;
				v1.y = -hh;
				v1.x = 0;

				for (ws = 0; ws <= this._segmentsW; ++ws) {
					v0.z = v1.z = this._planeWidth*ws/this._segmentsW - hw;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}

				v0.z = hw;
				v1.z = -hw;

				for (hs = 0; hs <= this._segmentsH; ++hs) {
					v0.y = v1.y = this._planeHeight*hs/this._segmentsH - hh;
					this.pUpdateOrAddSegment(index++, v0, v1);
				}
			}
		}
	}
}
