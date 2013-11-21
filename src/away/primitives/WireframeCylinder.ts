///<reference path="../_definitions.ts"/>

module away.primitives
{
	//import flash.geom.Vector3D;

	/**
	 * Generates a wireframd cylinder primitive.
	 */
	export class WireframeCylinder extends away.primitives.WireframePrimitiveBase
	{
		private static TWO_PI:number = 2*Math.PI;

		private _topRadius:number;
		private _bottomRadius:number;
		private _height:number;
		private _segmentsW:number;
		private _segmentsH:number;

		/**
		 * Creates a new WireframeCylinder instance
		 * @param topRadius Top radius of the cylinder
		 * @param bottomRadius Bottom radius of the cylinder
		 * @param height The height of the cylinder
		 * @param segmentsW Number of radial segments
		 * @param segmentsH Number of vertical segments
		 * @param color The color of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 */
			constructor(topRadius:number = 50, bottomRadius:number = 50, height:number = 100, segmentsW:number = 16, segmentsH:number = 1, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);
			this._topRadius = topRadius;
			this._bottomRadius = bottomRadius;
			this._height = height;
			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;
		}

		public pBuildGeometry()
		{

			var i:number, j:number;
			var radius:number = this._topRadius;
			var revolutionAngle:number;
			var revolutionAngleDelta:number = WireframeCylinder.TWO_PI/this._segmentsW;
			var nextVertexIndex:number = 0;
			var x:number, y:number, z:number;

			var lastLayer:Array<Array<away.geom.Vector3D>> = new Array<Array<away.geom.Vector3D>>(this._segmentsH + 1);

			for (j = 0; j <= this._segmentsH; ++j) {
				lastLayer[j] = new Array<away.geom.Vector3D>(this._segmentsW + 1);

				radius = this._topRadius - ((j/this._segmentsH)*(this._topRadius - this._bottomRadius));
				z = -(this._height/2) + (j/this._segmentsH*this._height);

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

		/**
		 * Top radius of the cylinder
		 */
		public get topRadius():number
		{
			return this._topRadius;
		}

		public set topRadius(value:number)
		{
			this._topRadius = value;
			this.pInvalidateGeometry();
		}

		/**
		 * Bottom radius of the cylinder
		 */
		public get bottomRadius():number
		{
			return this._bottomRadius;
		}

		public set bottomRadius(value:number)
		{
			this._bottomRadius = value;
			this.pInvalidateGeometry();
		}

		/**
		 * The height of the cylinder
		 */
		public get height():number
		{
			return this._height;
		}

		public set height(value:number)
		{
			if (this.height <= 0)
				throw new Error('Height must be a value greater than zero.');

			this._height = value;
			this.pInvalidateGeometry();
		}
	}
}
