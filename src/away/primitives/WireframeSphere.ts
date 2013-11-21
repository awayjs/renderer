///<reference path="../_definitions.ts" />

module away.primitives
{

	/**
	 * A WireframeSphere primitive mesh
	 */
	export class WireframeSphere extends away.primitives.WireframePrimitiveBase
	{
		private _segmentsW:number;
		private _segmentsH:number;
		private _radius:number;

		/**
		 * Creates a new WireframeSphere object.
		 * @param radius The radius of the sphere.
		 * @param segmentsW Defines the number of horizontal segments that make up the sphere.
		 * @param segmentsH Defines the number of vertical segments that make up the sphere.
		 * @param color The colour of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 */
			constructor(radius:number = 50, segmentsW:number = 16, segmentsH:number = 12, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);

			this._radius = radius;
			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;
		}

		/**
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{
			var vertices:number[] = new Array<number>();
			var v0:away.geom.Vector3D = new away.geom.Vector3D();
			var v1:away.geom.Vector3D = new away.geom.Vector3D();
			var i:number, j:number;
			var numVerts:number = 0;
			var index:number = 0;

			for (j = 0; j <= this._segmentsH; ++j) {
				var horangle:number = Math.PI*j/this._segmentsH;
				var z:number = -this._radius*Math.cos(horangle);
				var ringradius:number = this._radius*Math.sin(horangle);

				for (i = 0; i <= this._segmentsW; ++i) {
					var verangle:number = 2*Math.PI*i/this._segmentsW;
					var x:number = ringradius*Math.cos(verangle);
					var y:number = ringradius*Math.sin(verangle);
					vertices[numVerts++] = x;
					vertices[numVerts++] = -z;
					vertices[numVerts++] = y;
				}
			}

			for (j = 1; j <= this._segmentsH; ++j) {
				for (i = 1; i <= this._segmentsW; ++i) {
					var a:number = ((this._segmentsW + 1)*j + i)*3;
					var b:number = ((this._segmentsW + 1)*j + i - 1)*3;
					var c:number = ((this._segmentsW + 1)*(j - 1) + i - 1)*3;
					var d:number = ((this._segmentsW + 1)*(j - 1) + i)*3;

					if (j == this._segmentsH) {
						v0.x = vertices[c];
						v0.y = vertices[c + 1];
						v0.z = vertices[c + 2];
						v1.x = vertices[d];
						v1.y = vertices[d + 1];
						v1.z = vertices[d + 2];
						this.pUpdateOrAddSegment(index++, v0, v1);
						v0.x = vertices[a];
						v0.y = vertices[a + 1];
						v0.z = vertices[a + 2];
						this.pUpdateOrAddSegment(index++, v0, v1);
					} else if (j == 1) {
						v1.x = vertices[b];
						v1.y = vertices[b + 1];
						v1.z = vertices[b + 2];
						v0.x = vertices[c];
						v0.y = vertices[c + 1];
						v0.z = vertices[c + 2];
						this.pUpdateOrAddSegment(index++, v0, v1);
					} else {
						v1.x = vertices[b];
						v1.y = vertices[b + 1];
						v1.z = vertices[b + 2];
						v0.x = vertices[c];
						v0.y = vertices[c + 1];
						v0.z = vertices[c + 2];
						this.pUpdateOrAddSegment(index++, v0, v1);
						v1.x = vertices[d];
						v1.y = vertices[d + 1];
						v1.z = vertices[d + 2];
						this.pUpdateOrAddSegment(index++, v0, v1);
					}
				}
			}
		}
	}
}
