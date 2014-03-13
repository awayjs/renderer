///<reference path="../_definitions.ts"/>

module away.primitives
{
	//TODO - convert to geometry primitive

	/**
	 * Generates a wireframeCone primitive.
	 */
	export class WireframeCone extends away.primitives.WireframePrimitiveBase
	{
		private static TWO_PI:number = 2*Math.PI;

		private _radius:number;
		private _coneHeight:number;
		private _segmentsH:number;
		private _segmentsW:number;

		/**
		 * Bottom radius of the cone. Defaults to 50.
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
		 * The size of the cone along its Y-axis. Defaults to 100.
		 */
		public get coneHeight():number
		{
			return this._coneHeight;
		}

		public set coneHeight(value:number)
		{
			if (this._coneHeight == value)
				return;

			this._coneHeight == value

			this.pInvalidateGeometry();
		}

		/**
		 * Defines the number of vertical segments that make up the cone. Defaults to 1.
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

			this.pInvalidateGeometry();
		}

		/**
		 * Defines the number of horizontal segments that make up the cone. Defaults to 16.
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

			this.pInvalidateGeometry();
		}

		/**
		 * Creates a new WireframeCone instance
		 *
		 * @param topRadius Top radius of the cone. Defaults to 50.
		 * @param radius Bottom radius of the cone. Defaults to 50.
		 * @param coneHeight The height of the cone. Defaults to 100.
		 * @param segmentsW Number of radial segments. Defaults to 16.
		 * @param segmentsH Number of vertical segments. Defaults to 1.
		 * @param color The color of the wireframe lines. Defaults to <code>0xFFFFFF</code>.
		 * @param thickness The thickness of the wireframe lines. Defaults to 1.
		 */
		constructor(radius:number = 50, coneHeight:number = 100, segmentsW:number = 16, segmentsH:number = 1, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);
			this._radius = radius;
			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;

			this._coneHeight = coneHeight;
		}

		public pBuildGeometry()
		{

			var i:number, j:number;
			var radius:number;
			var revolutionAngle:number;
			var revolutionAngleDelta:number = WireframeCone.TWO_PI/this._segmentsW;
			var nextVertexIndex:number = 0;
			var x:number, y:number, z:number;

			var lastLayer:away.geom.Vector3D[][] = new Array<Array<away.geom.Vector3D>>(this._segmentsH + 1);

			for (j = 0; j <= this._segmentsH; ++j) {
				lastLayer[j] = new Array<away.geom.Vector3D>(this._segmentsW + 1);

				radius = ((j/this._segmentsH)*this._radius);
				z = this._coneHeight*(j/this._segmentsH - 0.5);

				var previousV:away.geom.Vector3D = null;

				for (i = 0; i <= this._segmentsW; ++i) {
					// revolution vertex
					revolutionAngle = i*revolutionAngleDelta;
					x = radius*Math.cos(revolutionAngle);
					y = radius*Math.sin(revolutionAngle);
					var vertex:away.geom.Vector3D;
					if (previousV) {
						vertex = new away.geom.Vector3D(x, -z, y);
						this.pUpdateOrAddSegment(nextVertexIndex++, vertex, previousV);
						previousV = vertex;
					} else
						previousV = new away.geom.Vector3D(x, -z, y);

					if (j > 0) {
						this.pUpdateOrAddSegment(nextVertexIndex++, vertex, lastLayer[j - 1][i]);
					}
					lastLayer[j][i] = previousV;
				}
			}
		}
	}
}
