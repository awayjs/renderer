///<reference path="../_definitions.ts"/>

module away.primitives
{

	/**
	 * A Capsule primitive mesh.
	 */
	export class CapsuleGeometry extends away.primitives.PrimitiveBase
	{
		private _radius:number;
		private _height:number;
		private _segmentsW:number;
		private _segmentsH:number;
		private _yUp:boolean;

		/**
		 * Creates a new Capsule object.
		 * @param radius The radius of the capsule.
		 * @param height The height of the capsule.
		 * @param segmentsW Defines the number of horizontal segments that make up the capsule. Defaults to 16.
		 * @param segmentsH Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven value.
		 * @param yUp Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		constructor(radius:number = 50, height:number = 100, segmentsW:number = 16, segmentsH:number = 15, yUp:boolean = true)
		{
			super();

			this._radius = radius;
			this._height = height;
			this._segmentsW = segmentsW;
			this._segmentsH = (segmentsH%2 == 0)? segmentsH + 1 : segmentsH;
			this._yUp = yUp;
		}

		/**
		 * @inheritDoc
		 */
		public pBuildGeometry(target:away.base.CompactSubGeometry)
		{
			var data:number[];
			var indices:number[] /*uint*/;
			var i:number;
			var j:number;
			var triIndex:number = 0;
			var numVerts:number = (this._segmentsH + 1)*(this._segmentsW + 1);
			var stride:number = target.vertexStride;
			var skip:number = stride - 9;
			var index:number = 0;
			var startIndex:number;
			var comp1:number, comp2:number, t1:number, t2:number;

			if (numVerts == target.numVertices) {
				data = target.vertexData;

				if (target.indexData) {

					indices = target.indexData


				} else {
					indices = new Array<number>((this._segmentsH - 1)*this._segmentsW*6);
				}


			} else {

				data = new Array<number>(numVerts*stride);
				indices = new Array<number>((this._segmentsH - 1)*this._segmentsW*6);
				this.pInvalidateUVs();

			}

			for (j = 0; j <= this._segmentsH; ++j) {

				var horangle:number = Math.PI*j/this._segmentsH;
				var z:number = -this._radius*Math.cos(horangle);
				var ringradius:number = this._radius*Math.sin(horangle);

				startIndex = index;

				for (i = 0; i <= this._segmentsW; ++i) {
					var verangle:number = 2*Math.PI*i/this._segmentsW;
					var x:number = ringradius*Math.cos(verangle);
					var offset:number = j > this._segmentsH/2? this._height/2 : -this._height/2;
					var y:number = ringradius*Math.sin(verangle);
					var normLen:number = 1/Math.sqrt(x*x + y*y + z*z);
					var tanLen:number = Math.sqrt(y*y + x*x);

					if (this._yUp) {
						t1 = 0;
						t2 = tanLen > .007? x/tanLen : 0;
						comp1 = -z;
						comp2 = y;

					} else {
						t1 = tanLen > .007? x/tanLen : 0;
						t2 = 0;
						comp1 = y;
						comp2 = z;
					}

					if (i == this._segmentsW) {

						data[index++] = data[startIndex];
						data[index++] = data[startIndex + 1];
						data[index++] = data[startIndex + 2];
						data[index++] = (data[startIndex + 3] + (x*normLen))*.5;
						data[index++] = (data[startIndex + 4] + ( comp1*normLen))*.5;
						data[index++] = (data[startIndex + 5] + (comp2*normLen))*.5;
						data[index++] = (data[startIndex + 6] + (tanLen > .007? -y/tanLen : 1))*.5;
						data[index++] = (data[startIndex + 7] + t1)*.5;
						data[index++] = (data[startIndex + 8] + t2)*.5;

					} else {
						// vertex
						data[index++] = x;
						data[index++] = (this._yUp)? comp1 - offset : comp1;
						data[index++] = (this._yUp)? comp2 : comp2 + offset;
						// normal
						data[index++] = x*normLen;
						data[index++] = comp1*normLen;
						data[index++] = comp2*normLen;
						// tangent
						data[index++] = tanLen > .007? -y/tanLen : 1;
						data[index++] = t1;
						data[index++] = t2;
					}

					if (i > 0 && j > 0) {
						var a:number = (this._segmentsW + 1)*j + i;
						var b:number = (this._segmentsW + 1)*j + i - 1;
						var c:number = (this._segmentsW + 1)*(j - 1) + i - 1;
						var d:number = (this._segmentsW + 1)*(j - 1) + i;

						if (j == this._segmentsH) {
							data[index - 9] = data[startIndex];
							data[index - 8] = data[startIndex + 1];
							data[index - 7] = data[startIndex + 2];

							indices[triIndex++] = a;
							indices[triIndex++] = c;
							indices[triIndex++] = d;

						} else if (j == 1) {
							indices[triIndex++] = a;
							indices[triIndex++] = b;
							indices[triIndex++] = c;

						} else {
							indices[triIndex++] = a;
							indices[triIndex++] = b;
							indices[triIndex++] = c;
							indices[triIndex++] = a;
							indices[triIndex++] = c;
							indices[triIndex++] = d;
						}
					}

					index += skip;
				}
			}

			target.updateData(data);
			target.updateIndexData(indices);
		}

		/**
		 * @inheritDoc
		 */
		public pBuildUVs(target:away.base.CompactSubGeometry)
		{
			var i:number;
			var j:number;
			var index:number;
			var data:number[];
			var stride:number = target.UVStride;
			var UVlen:number = (this._segmentsH + 1)*(this._segmentsW + 1)*stride;
			var skip:number = stride - 2;

			if (target.UVData && UVlen == target.UVData.length) {
				data = target.UVData;
			} else {
				data = new Array<number>(UVlen);
				this.pInvalidateGeometry();
			}

			index = target.UVOffset;

			for (j = 0; j <= this._segmentsH; ++j) {
				for (i = 0; i <= this._segmentsW; ++i) {
					data[index++] = ( i/this._segmentsW )*target.scaleU;
					data[index++] = ( j/this._segmentsH )*target.scaleV;
					index += skip;
				}
			}

			target.updateData(data);
		}

		/**
		 * The radius of the capsule.
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
		 * The height of the capsule.
		 */
		public get height():number
		{
			return this._height;
		}

		public set height(value:number)
		{
			this._height = value;
			this.pInvalidateGeometry();
		}

		/**
		 * Defines the number of horizontal segments that make up the capsule. Defaults to 16.
		 */
		public get segmentsW():number
		{
			return this._segmentsW;
		}

		public set segmentsW(value:number)
		{
			this._segmentsW = value;
			this.pInvalidateGeometry();
			this.pInvalidateUVs();
		}

		/**
		 * Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven.
		 */
		public get segmentsH():number
		{
			return this._segmentsH;
		}

		public set segmentsH(value:number)
		{
			this._segmentsH = (value%2 == 0)? value + 1 : value;
			this.pInvalidateGeometry();
			this.pInvalidateUVs();
		}

		/**
		 * Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		public get yUp():boolean
		{
			return this._yUp;
		}

		public set yUp(value:boolean)
		{
			this._yUp = value;
			this.pInvalidateGeometry();
		}
	}
}
