///<reference path="../_definitions.ts"/>

module away.prefabs
{
	import SubGeometryBase			= away.base.SubGeometryBase;
	import TriangleSubGeometry		= away.base.TriangleSubGeometry;
	import LineSubGeometry			= away.base.LineSubGeometry;

	/**
	 * A Cylinder primitive mesh.
	 */
	export class PrimitiveCylinderPrefab extends away.prefabs.PrimitivePrefabBase implements away.library.IAsset
	{
		public _pBottomRadius:number;
		public _pSegmentsW:number;
		public _pSegmentsH:number;

		private _topRadius:number;
		private _height:number;

		private _topClosed:boolean;
		private _bottomClosed:boolean;
		private _surfaceClosed:boolean;
		private _yUp:boolean;
		private _numVertices:number = 0;

		/**
		 * The radius of the top end of the cylinder.
		 */
		public get topRadius():number
		{
			return this._topRadius;
		}

		public set topRadius(value:number)
		{
			this._topRadius = value;
			this._pInvalidateGeometry();
		}

		/**
		 * The radius of the bottom end of the cylinder.
		 */
		public get bottomRadius():number
		{
			return this._pBottomRadius;
		}

		public set bottomRadius(value:number)
		{
			this._pBottomRadius = value;
			this._pInvalidateGeometry();
		}

		/**
		 * The radius of the top end of the cylinder.
		 */
		public get height():number
		{
			return this._height;
		}

		public set height(value:number)
		{
			this._height = value;
			this._pInvalidateGeometry();
		}

		/**
		 * Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
		 */
		public get segmentsW():number
		{
			return this._pSegmentsW;
		}

		public set segmentsW(value:number)
		{
			this.setSegmentsW(value);
		}

		public setSegmentsW(value:number)
		{
			this._pSegmentsW = value;
			this._pInvalidateGeometry();
			this._pInvalidateUVs();
		}

		/**
		 * Defines the number of vertical segments that make up the cylinder. Defaults to 1.
		 */
		public get segmentsH():number
		{
			return this._pSegmentsH;
		}

		public set segmentsH(value:number)
		{

			this.setSegmentsH(value)

		}

		public setSegmentsH(value:number)
		{
			this._pSegmentsH = value;
			this._pInvalidateGeometry();
			this._pInvalidateUVs();

		}

		/**
		 * Defines whether the top end of the cylinder is closed (true) or open.
		 */
		public get topClosed():boolean
		{
			return this._topClosed;
		}

		public set topClosed(value:boolean)
		{
			this._topClosed = value;
			this._pInvalidateGeometry();
		}

		/**
		 * Defines whether the bottom end of the cylinder is closed (true) or open.
		 */
		public get bottomClosed():boolean
		{
			return this._bottomClosed;
		}

		public set bottomClosed(value:boolean)
		{
			this._bottomClosed = value;
			this._pInvalidateGeometry();
		}

		/**
		 * Defines whether the cylinder poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		public get yUp():boolean
		{
			return this._yUp;
		}

		public set yUp(value:boolean)
		{
			this._yUp = value;
			this._pInvalidateGeometry();
		}

		/**
		 * Creates a new Cylinder object.
		 * @param topRadius The radius of the top end of the cylinder.
		 * @param bottomRadius The radius of the bottom end of the cylinder
		 * @param height The radius of the bottom end of the cylinder
		 * @param segmentsW Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
		 * @param segmentsH Defines the number of vertical segments that make up the cylinder. Defaults to 1.
		 * @param topClosed Defines whether the top end of the cylinder is closed (true) or open.
		 * @param bottomClosed Defines whether the bottom end of the cylinder is closed (true) or open.
		 * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		constructor(topRadius:number = 50, bottomRadius:number = 50, height:number = 100, segmentsW:number = 16, segmentsH:number = 1, topClosed:boolean = true, bottomClosed:boolean = true, surfaceClosed:boolean = true, yUp:boolean = true)
		{
			super();

			this._topRadius = topRadius;
			this._pBottomRadius = bottomRadius;
			this._height = height;
			this._pSegmentsW = segmentsW;
			this._pSegmentsH = segmentsH;
			this._topClosed = topClosed;
			this._bottomClosed = bottomClosed;
			this._surfaceClosed = surfaceClosed;
			this._yUp = yUp;
		}


		/**
		 * @inheritDoc
		 */
		public _pBuildGeometry(target:SubGeometryBase, geometryType:string)
		{
			var indices:Array<number> /*uint*/;
			var positions:Array<number>;
			var normals:Array<number>;
			var tangents:Array<number>;

			var i:number;
			var j:number;
			var x:number;
			var y:number;
			var z:number;
			var vidx:number;
			var fidx:number;

			var radius:number;
			var revolutionAngle:number;

			var dr:number;
			var latNormElev:number;
			var latNormBase:number;
			var numIndices:number = 0;

			var comp1:number;
			var comp2:number;
			var startIndex:number = 0;
			var nextVertexIndex:number = 0;

			var t1:number;
			var t2:number;

			// reset utility variables
			this._numVertices = 0;

			// evaluate revolution steps
			var revolutionAngleDelta:number = 2*Math.PI/this._pSegmentsW;

			if (geometryType == "triangleSubGeometry") {

				var triangleGeometry:TriangleSubGeometry = <TriangleSubGeometry> target;

				// evaluate target number of vertices, triangles and indices
				if (this._surfaceClosed) {
					this._numVertices += (this._pSegmentsH + 1)*(this._pSegmentsW + 1); // segmentsH + 1 because of closure, segmentsW + 1 because of UV unwrapping
					numIndices += this._pSegmentsH*this._pSegmentsW*6; // each level has segmentW quads, each of 2 triangles
				}
				if (this._topClosed) {
					this._numVertices += 2*(this._pSegmentsW + 1); // segmentsW + 1 because of unwrapping
					numIndices += this._pSegmentsW*3; // one triangle for each segment
				}
				if (this._bottomClosed) {
					this._numVertices += 2*(this._pSegmentsW + 1);
					numIndices += this._pSegmentsW*3;
				}

				// need to initialize raw arrays or can be reused?
				if (this._numVertices == triangleGeometry.numVertices) {
					indices = triangleGeometry.indices;
					positions = triangleGeometry.positions;
					normals = triangleGeometry.vertexNormals;
					tangents = triangleGeometry.vertexTangents;
				} else {
					indices = new Array<number>(numIndices)
					positions = new Array<number>(this._numVertices*3);
					normals = new Array<number>(this._numVertices*3);
					tangents = new Array<number>(this._numVertices*3);

					this._pInvalidateUVs();
				}

				vidx = 0;
				fidx = 0;

				// top
				if (this._topClosed && this._topRadius > 0) {

					z = -0.5*this._height;

					for (i = 0; i <= this._pSegmentsW; ++i) {
						// central vertex
						if (this._yUp) {
							t1 = 1;
							t2 = 0;
							comp1 = -z;
							comp2 = 0;

						} else {
							t1 = 0;
							t2 = -1;
							comp1 = 0;
							comp2 = z;
						}

						positions[vidx] = 0;
						positions[vidx + 1] = comp1;
						positions[vidx + 2] = comp2;
						normals[vidx] = 0;
						normals[vidx + 1] = t1;
						normals[vidx + 2] = t2;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						// revolution vertex
						revolutionAngle = i*revolutionAngleDelta;
						x = this._topRadius*Math.cos(revolutionAngle);
						y = this._topRadius*Math.sin(revolutionAngle);

						if (this._yUp) {
							comp1 = -z;
							comp2 = y;
						} else {
							comp1 = y;
							comp2 = z;
						}

						if (i == this._pSegmentsW) {
							positions[vidx] = positions[startIndex + 3];
							positions[vidx + 1] = positions[startIndex + 4];
							positions[vidx + 2] = positions[startIndex + 5];

						} else {
							positions[vidx] = x;
							positions[vidx + 1] = comp1;
							positions[vidx + 2] = comp2;
						}

						normals[vidx] = 0;
						normals[vidx + 1] = t1;
						normals[vidx + 2] = t2;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						if (i > 0) {
							// add triangle
							indices[fidx++] = nextVertexIndex;
							indices[fidx++] = nextVertexIndex + 1;
							indices[fidx++] = nextVertexIndex + 2;

							nextVertexIndex += 2;
						}
					}

					nextVertexIndex += 2;
				}

				// bottom
				if (this._bottomClosed && this._pBottomRadius > 0) {

					z = 0.5*this._height;

					startIndex = nextVertexIndex*3;

					for (i = 0; i <= this._pSegmentsW; ++i) {
						if (this._yUp) {
							t1 = -1;
							t2 = 0;
							comp1 = -z;
							comp2 = 0;
						} else {
							t1 = 0;
							t2 = 1;
							comp1 = 0;
							comp2 = z;
						}

						positions[vidx] = 0;
						positions[vidx + 1] = comp1;
						positions[vidx + 2] = comp2;
						normals[vidx] = 0;
						normals[vidx + 1] = t1;
						normals[vidx + 2] = t2;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						// revolution vertex
						revolutionAngle = i*revolutionAngleDelta;
						x = this._pBottomRadius*Math.cos(revolutionAngle);
						y = this._pBottomRadius*Math.sin(revolutionAngle);

						if (this._yUp) {
							comp1 = -z;
							comp2 = y;
						} else {
							comp1 = y;
							comp2 = z;
						}

						if (i == this._pSegmentsW) {
							positions[vidx] = positions[startIndex + 3];
							positions[vidx + 1] = positions[startIndex + 4];
							positions[vidx + 2] = positions[startIndex + 5];
						} else {
							positions[vidx] = x;
							positions[vidx + 1] = comp1;
							positions[vidx + 2] = comp2;
						}

						normals[vidx] = 0;
						normals[vidx + 1] = t1;
						normals[vidx + 2] = t2;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						if (i > 0) {
							// add triangle
							indices[fidx++] = nextVertexIndex;
							indices[fidx++] = nextVertexIndex + 2;
							indices[fidx++] = nextVertexIndex + 1;

							nextVertexIndex += 2;
						}
					}

					nextVertexIndex += 2;
				}

				// The normals on the lateral surface all have the same incline, i.e.
				// the "elevation" component (Y or Z depending on yUp) is constant.
				// Same principle goes for the "base" of these vectors, which will be
				// calculated such that a vector [base,elev] will be a unit vector.
				dr = (this._pBottomRadius - this._topRadius);
				latNormElev = dr/this._height;
				latNormBase = (latNormElev == 0)? 1 : this._height/dr;

				// lateral surface
				if (this._surfaceClosed) {
					var a:number;
					var b:number;
					var c:number;
					var d:number;
					var na0:number, na1:number, naComp1:number, naComp2:number;

					for (j = 0; j <= this._pSegmentsH; ++j) {
						radius = this._topRadius - ((j/this._pSegmentsH)*(this._topRadius - this._pBottomRadius));
						z = -(this._height/2) + (j/this._pSegmentsH*this._height);

						startIndex = nextVertexIndex*3;

						for (i = 0; i <= this._pSegmentsW; ++i) {
							// revolution vertex
							revolutionAngle = i*revolutionAngleDelta;
							x = radius*Math.cos(revolutionAngle);
							y = radius*Math.sin(revolutionAngle);
							na0 = latNormBase*Math.cos(revolutionAngle);
							na1 = latNormBase*Math.sin(revolutionAngle);

							if (this._yUp) {
								t1 = 0;
								t2 = -na0;
								comp1 = -z;
								comp2 = y;
								naComp1 = latNormElev;
								naComp2 = na1;

							} else {
								t1 = -na0;
								t2 = 0;
								comp1 = y;
								comp2 = z;
								naComp1 = na1;
								naComp2 = latNormElev;
							}

							if (i == this._pSegmentsW) {
								positions[vidx] = positions[startIndex];
								positions[vidx + 1] = positions[startIndex + 1];
								positions[vidx + 2] = positions[startIndex + 2];
								normals[vidx] = na0;
								normals[vidx + 1] = latNormElev;
								normals[vidx + 2] = na1;
								tangents[vidx] = na1;
								tangents[vidx + 1] = t1;
								tangents[vidx + 2] = t2;
							} else {
								positions[vidx] = x;
								positions[vidx + 1] = comp1;
								positions[vidx + 2] = comp2;
								normals[vidx] = na0;
								normals[vidx + 1] = naComp1;
								normals[vidx + 2] = naComp2;
								tangents[vidx] = -na1;
								tangents[vidx + 1] = t1;
								tangents[vidx + 2] = t2;
							}
							vidx += 3;

							// close triangle
							if (i > 0 && j > 0) {
								a = nextVertexIndex; // current
								b = nextVertexIndex - 1; // previous
								c = b - this._pSegmentsW - 1; // previous of last level
								d = a - this._pSegmentsW - 1; // current of last level

								indices[fidx++] = a;
								indices[fidx++] = b;
								indices[fidx++] = c;

								indices[fidx++] = a;
								indices[fidx++] = c;
								indices[fidx++] = d;
							}

							nextVertexIndex++;
						}
					}
				}

				// build real data from raw data
				triangleGeometry.updateIndices(indices);

				triangleGeometry.updatePositions(positions);
				triangleGeometry.updateVertexNormals(normals);
				triangleGeometry.updateVertexTangents(tangents);

			} else if (geometryType == "lineSubGeometry") {
				var lineGeometry:LineSubGeometry = <LineSubGeometry> target;

				var numSegments:number = (this._pSegmentsH + 1)*(this._pSegmentsW) + this._pSegmentsW;
				var startPositions:Array<number>;
				var endPositions:Array<number>;
				var thickness:Array<number>;

				if (lineGeometry.indices != null && numSegments == lineGeometry.numSegments) {
					startPositions = lineGeometry.startPositions;
					endPositions = lineGeometry.endPositions;
					thickness = lineGeometry.thickness;
				} else {
					startPositions = new Array<number>(numSegments*3);
					endPositions = new Array<number>(numSegments*3);
					thickness = new Array<number>(numSegments);
				}

				vidx = 0;

				fidx = 0;

				//horizonal lines

				for (j = 0; j <= this._pSegmentsH; ++j) {
					radius = this._topRadius - ((j/this._pSegmentsH)*(this._topRadius - this._pBottomRadius));
					z = this._height*(j/this._pSegmentsH - 0.5);

					for (i = 0; i <= this._pSegmentsW; ++i) {
						// revolution vertex
						revolutionAngle = i*revolutionAngleDelta;
						x = radius*Math.cos(revolutionAngle);
						y = radius*Math.sin(revolutionAngle);

						if (this._yUp) {
							comp1 = -z;
							comp2 = y;
						} else {
							comp1 = y;
							comp2 = z;
						}

						if (i > 0) {
							endPositions[vidx] = x;
							endPositions[vidx + 1] = comp1;
							endPositions[vidx + 2] = comp2;

							thickness[fidx++] = 1;

							vidx += 3;

							//vertical lines
							startPositions[vidx] = endPositions[vidx - this._pSegmentsW*6];
							startPositions[vidx + 1] = endPositions[vidx + 1 - this._pSegmentsW*6];
							startPositions[vidx + 2] = endPositions[vidx + 2 - this._pSegmentsW*6];

							endPositions[vidx] = x;
							endPositions[vidx + 1] = comp1;
							endPositions[vidx + 2] = comp2;

							thickness[fidx++] = 1;

							vidx += 3;
						}

						if (i < this._pSegmentsW) {
							startPositions[vidx] = x;
							startPositions[vidx + 1] = comp1;
							startPositions[vidx + 2] = comp2;
						}
					}
				}

				// build real data from raw data
				lineGeometry.updatePositions(startPositions, endPositions);
				lineGeometry.updateThickness(thickness);
			}
		}

		/**
		 * @inheritDoc
		 */
		public _pBuildUVs(target:SubGeometryBase, geometryType:string)
		{
			var i:number;
			var j:number;
			var x:number;
			var y:number;
			var revolutionAngle:number;
			var uvs:Array<number>;

			if (geometryType == "triangleSubGeometry") {

				var triangleGeometry:TriangleSubGeometry = <TriangleSubGeometry> target;

				// need to initialize raw array or can be reused?
				if (triangleGeometry.uvs && this._numVertices == triangleGeometry.numVertices) {
					uvs = triangleGeometry.uvs;
				} else {
					uvs = new Array<number>(this._numVertices*2);
				}

				// evaluate revolution steps
				var revolutionAngleDelta:number = 2*Math.PI/this._pSegmentsW;

				// current uv component index
				var index:number = 0;

				// top
				if (this._topClosed) {
					for (i = 0; i <= this._pSegmentsW; ++i) {

						revolutionAngle = i*revolutionAngleDelta;
						x = 0.5 + 0.5* -Math.cos(revolutionAngle);
						y = 0.5 + 0.5*Math.sin(revolutionAngle);

						uvs[index++] = 0.5*triangleGeometry.scaleU; // central vertex
						uvs[index++] = 0.5*triangleGeometry.scaleV;

						uvs[index++] = x*triangleGeometry.scaleU; // revolution vertex
						uvs[index++] = y*triangleGeometry.scaleV;
					}
				}

				// bottom
				if (this._bottomClosed) {
					for (i = 0; i <= this._pSegmentsW; ++i) {

						revolutionAngle = i*revolutionAngleDelta;
						x = 0.5 + 0.5*Math.cos(revolutionAngle);
						y = 0.5 + 0.5*Math.sin(revolutionAngle);

						uvs[index++] = 0.5*triangleGeometry.scaleU; // central vertex
						uvs[index++] = 0.5*triangleGeometry.scaleV;

						uvs[index++] = x*triangleGeometry.scaleU; // revolution vertex
						uvs[index++] = y*triangleGeometry.scaleV;
					}
				}

				// lateral surface
				if (this._surfaceClosed) {
					for (j = 0; j <= this._pSegmentsH; ++j) {
						for (i = 0; i <= this._pSegmentsW; ++i) {
							// revolution vertex
							uvs[index++] = ( i/this._pSegmentsW )*triangleGeometry.scaleU;
							uvs[index++] = ( j/this._pSegmentsH )*triangleGeometry.scaleV;
						}
					}
				}

				// build real data from raw data
				triangleGeometry.updateUVs(uvs);

			} else if (geometryType == "lineSubGeometry") {
				//nothing to do here
			}
		}
	}
}
