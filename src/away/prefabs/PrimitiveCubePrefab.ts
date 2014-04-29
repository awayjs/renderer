///<reference path="../_definitions.ts"/>

module away.prefabs
{
	import SubGeometryBase			= away.base.SubGeometryBase;
	import TriangleSubGeometry		= away.base.TriangleSubGeometry;
	import LineSubGeometry			= away.base.LineSubGeometry;

	/**
	 * A Cube primitive prefab.
	 */
	export class PrimitiveCubePrefab extends away.prefabs.PrimitivePrefabBase implements away.library.IAsset
	{
		private _width:number;
		private _height:number;
		private _depth:number;
		private _tile6:boolean;

		private _segmentsW:number;
		private _segmentsH:number;
		private _segmentsD:number;

		/**
		 * Creates a new Cube object.
		 * @param width The size of the cube along its X-axis.
		 * @param height The size of the cube along its Y-axis.
		 * @param depth The size of the cube along its Z-axis.
		 * @param segmentsW The number of segments that make up the cube along the X-axis.
		 * @param segmentsH The number of segments that make up the cube along the Y-axis.
		 * @param segmentsD The number of segments that make up the cube along the Z-axis.
		 * @param tile6 The type of uv mapping to use. When true, a texture will be subdivided in a 2x3 grid, each used for a single face. When false, the entire image is mapped on each face.
		 */
		constructor(width:number = 100, height:number = 100, depth:number = 100, segmentsW:number = 1, segmentsH:number = 1, segmentsD:number = 1, tile6:boolean = true)
		{
			super();

			this._width = width;
			this._height = height;
			this._depth = depth;
			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;
			this._segmentsD = segmentsD;
			this._tile6 = tile6;
		}

		/**
		 * The size of the cube along its X-axis.
		 */
		public get width():number
		{
			return this._width;
		}

		public set width(value:number)
		{
			this._width = value;

			this._pInvalidateGeometry();
		}

		/**
		 * The size of the cube along its Y-axis.
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
		 * The size of the cube along its Z-axis.
		 */
		public get depth():number
		{
			return this._depth;
		}

		public set depth(value:number)
		{
			this._depth = value;

			this._pInvalidateGeometry();
		}

		/**
		 * The type of uv mapping to use. When false, the entire image is mapped on each face.
		 * When true, a texture will be subdivided in a 3x2 grid, each used for a single face.
		 * Reading the tiles from left to right, top to bottom they represent the faces of the
		 * cube in the following order: bottom, top, back, left, front, right. This creates
		 * several shared edges (between the top, front, left and right faces) which simplifies
		 * texture painting.
		 */
		public get tile6():boolean
		{
			return this._tile6;
		}

		public set tile6(value:boolean)
		{
			this._tile6 = value;

			this._pInvalidateGeometry();
		}

		/**
		 * The number of segments that make up the cube along the X-axis. Defaults to 1.
		 */
		public get segmentsW():number
		{
			return this._segmentsW;
		}

		public set segmentsW(value:number)
		{
			this._segmentsW = value;

			this._pInvalidateGeometry();
			this._pInvalidateUVs();
		}

		/**
		 * The number of segments that make up the cube along the Y-axis. Defaults to 1.
		 */
		public get segmentsH():number
		{
			return this._segmentsH;
		}

		public set segmentsH(value:number)
		{
			this._segmentsH = value;

			this._pInvalidateGeometry();
			this._pInvalidateUVs();
		}

		/**
		 * The number of segments that make up the cube along the Z-axis. Defaults to 1.
		 */
		public get segmentsD():number
		{
			return this._segmentsD;
		}

		public set segmentsD(value:number)
		{
			this._segmentsD = value;

			this._pInvalidateGeometry();
			this._pInvalidateUVs();
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

			var tl:number, tr:number, bl:number, br:number;
			var i:number, j:number, inc:number = 0;

			var vidx:number, fidx:number; // indices
			var hw:number, hh:number, hd:number; // halves
			var dw:number, dh:number, dd:number; // deltas

			var outer_pos:number;
			var numIndices:number;
			var numVertices:number;

			// half cube dimensions
			hw = this._width/2;
			hh = this._height/2;
			hd = this._depth/2;

			if (geometryType == "triangleSubGeometry") {

				var triangleGeometry:TriangleSubGeometry = <TriangleSubGeometry> target;

				numVertices = ((this._segmentsW + 1)*(this._segmentsH + 1) + (this._segmentsW + 1)*(this._segmentsD + 1) + (this._segmentsH + 1)*(this._segmentsD + 1))*2;

				numIndices = ((this._segmentsW*this._segmentsH + this._segmentsW*this._segmentsD + this._segmentsH*this._segmentsD)*12);

				if (numVertices == triangleGeometry.numVertices && triangleGeometry.indices != null) {
					indices = triangleGeometry.indices;
					positions = triangleGeometry.positions;
					normals = triangleGeometry.vertexNormals;
					tangents = triangleGeometry.vertexTangents;
				} else {
					indices = new Array<number>(numIndices);
					positions = new Array<number>(numVertices*3);
					normals = new Array<number>(numVertices*3);
					tangents = new Array<number>(numVertices*3);

					this._pInvalidateUVs();
				}

				vidx = 0;
				fidx = 0;

				// Segment dimensions
				dw = this._width/this._segmentsW;
				dh = this._height/this._segmentsH;
				dd = this._depth/this._segmentsD;

				for (i = 0; i <= this._segmentsW; i++) {
					outer_pos = -hw + i*dw;

					for (j = 0; j <= this._segmentsH; j++) {
						// front
						positions[vidx] = outer_pos;
						positions[vidx + 1] = -hh + j*dh;
						positions[vidx + 2] = -hd;
						normals[vidx] = 0;
						normals[vidx + 1] = 0;
						normals[vidx + 2] = -1;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						// back
						positions[vidx] = outer_pos;
						positions[vidx + 1] = -hh + j*dh;
						positions[vidx + 2] = hd;
						normals[vidx] = 0;
						normals[vidx + 1] = 0;
						normals[vidx + 2] = 1;
						tangents[vidx] = -1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						if (i && j) {
							tl = 2*((i - 1)*(this._segmentsH + 1) + (j - 1));
							tr = 2*(i*(this._segmentsH + 1) + (j - 1));
							bl = tl + 2;
							br = tr + 2;

							indices[fidx++] = tl;
							indices[fidx++] = bl;
							indices[fidx++] = br;
							indices[fidx++] = tl;
							indices[fidx++] = br;
							indices[fidx++] = tr;
							indices[fidx++] = tr + 1;
							indices[fidx++] = br + 1;
							indices[fidx++] = bl + 1;
							indices[fidx++] = tr + 1;
							indices[fidx++] = bl + 1;
							indices[fidx++] = tl + 1;
						}
					}
				}

				inc += 2*(this._segmentsW + 1)*(this._segmentsH + 1);

				for (i = 0; i <= this._segmentsW; i++) {
					outer_pos = -hw + i*dw;

					for (j = 0; j <= this._segmentsD; j++) {
						// top
						positions[vidx] = outer_pos;
						positions[vidx + 1] = hh;
						positions[vidx + 2] = -hd + j*dd;
						normals[vidx] = 0;
						normals[vidx + 1] = 1;
						normals[vidx + 2] = 0;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						// bottom
						positions[vidx] = outer_pos;
						positions[vidx + 1] = -hh;
						positions[vidx + 2] = -hd + j*dd;
						normals[vidx] = 0;
						normals[vidx + 1] = -1;
						normals[vidx + 2] = 0;
						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;
						vidx += 3;

						if (i && j) {
							tl = inc + 2*((i - 1)*(this._segmentsD + 1) + (j - 1));
							tr = inc + 2*(i*(this._segmentsD + 1) + (j - 1));
							bl = tl + 2;
							br = tr + 2;

							indices[fidx++] = tl;
							indices[fidx++] = bl;
							indices[fidx++] = br;
							indices[fidx++] = tl;
							indices[fidx++] = br;
							indices[fidx++] = tr;
							indices[fidx++] = tr + 1;
							indices[fidx++] = br + 1;
							indices[fidx++] = bl + 1;
							indices[fidx++] = tr + 1;
							indices[fidx++] = bl + 1;
							indices[fidx++] = tl + 1;
						}
					}
				}

				inc += 2*(this._segmentsW + 1)*(this._segmentsD + 1);

				for (i = 0; i <= this._segmentsD; i++) {
					outer_pos = hd - i*dd;

					for (j = 0; j <= this._segmentsH; j++) {
						// left
						positions[vidx] = -hw;
						positions[vidx+1] = -hh + j*dh;
						positions[vidx+2] = outer_pos;
						normals[vidx] = -1;
						normals[vidx+1] = 0;
						normals[vidx+2] = 0;
						tangents[vidx] = 0;
						tangents[vidx+1] = 0;
						tangents[vidx+2] = -1;
						vidx += 3;

						// right
						positions[vidx] = hw;
						positions[vidx+1] = -hh + j*dh;
						positions[vidx+2] = outer_pos;
						normals[vidx] = 1;
						normals[vidx+1] = 0;
						normals[vidx+2] = 0;
						tangents[vidx] = 0;
						tangents[vidx+1] = 0;
						tangents[vidx+2] = 1;
						vidx += 3;

						if (i && j) {
							tl = inc + 2*((i - 1)*(this._segmentsH + 1) + (j - 1));
							tr = inc + 2*(i*(this._segmentsH + 1) + (j - 1));
							bl = tl + 2;
							br = tr + 2;

							indices[fidx++] = tl;
							indices[fidx++] = bl;
							indices[fidx++] = br;
							indices[fidx++] = tl;
							indices[fidx++] = br;
							indices[fidx++] = tr;
							indices[fidx++] = tr + 1;
							indices[fidx++] = br + 1;
							indices[fidx++] = bl + 1;
							indices[fidx++] = tr + 1;
							indices[fidx++] = bl + 1;
							indices[fidx++] = tl + 1;
						}
					}
				}

				triangleGeometry.updateIndices(indices);

				triangleGeometry.updatePositions(positions);
				triangleGeometry.updateVertexNormals(normals);
				triangleGeometry.updateVertexTangents(tangents);

			} else if (geometryType == "lineSubGeometry") {
				var lineGeometry:LineSubGeometry = <LineSubGeometry> target;

				var numSegments:number = this._segmentsH*4 +  this._segmentsW*4 + this._segmentsD*4;
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

				//front/back face
				for (i = 0; i < this._segmentsH; ++i) {
					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = i*this._height/this._segmentsH - hh;
					startPositions[vidx + 2] = -hd;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = i*this._height/this._segmentsH - hh
					endPositions[vidx + 2] = -hd;

					thickness[fidx++] = 1;

					vidx += 3;

					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = hh - i*this._height/this._segmentsH;
					startPositions[vidx + 2] = hd;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = hh - i*this._height/this._segmentsH;
					endPositions[vidx + 2] = hd;

					thickness[fidx++] = 1;

					vidx += 3;
				}

				for (i = 0; i < this._segmentsW; ++i) {
					startPositions[vidx] = i*this._width/this._segmentsW - hw;
					startPositions[vidx + 1] = -hh;
					startPositions[vidx + 2] = -hd;

					endPositions[vidx] = i*this._width/this._segmentsW - hw;
					endPositions[vidx + 1] = hh;
					endPositions[vidx + 2] = -hd;

					thickness[fidx++] = 1;

					vidx += 3;

					startPositions[vidx] = hw - i*this._width/this._segmentsW;
					startPositions[vidx + 1] = -hh;
					startPositions[vidx + 2] = hd;

					endPositions[vidx] = hw - i*this._width/this._segmentsW;
					endPositions[vidx + 1] = hh;
					endPositions[vidx + 2] = hd;

					thickness[fidx++] = 1;

					vidx += 3;
				}

				//left/right face
				for (i = 0; i < this._segmentsH; ++i) {
					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = i*this._height/this._segmentsH - hh;
					startPositions[vidx + 2] = -hd;

					endPositions[vidx] = -hw;
					endPositions[vidx + 1] = i*this._height/this._segmentsH - hh
					endPositions[vidx + 2] = hd;

					thickness[fidx++] = 1;

					vidx += 3;

					startPositions[vidx] = hw;
					startPositions[vidx + 1] = hh - i*this._height/this._segmentsH;
					startPositions[vidx + 2] = -hd;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = hh - i*this._height/this._segmentsH;
					endPositions[vidx + 2] = hd;

					thickness[fidx++] = 1;

					vidx += 3;
				}

				for (i = 0; i < this._segmentsD; ++i) {
					startPositions[vidx] = hw
					startPositions[vidx + 1] = -hh;
					startPositions[vidx + 2] = i*this._depth/this._segmentsD - hd;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = hh;
					endPositions[vidx + 2] = i*this._depth/this._segmentsD - hd;

					thickness[fidx++] = 1;

					vidx += 3;

					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = -hh;
					startPositions[vidx + 2] = hd - i*this._depth/this._segmentsD;

					endPositions[vidx] = -hw;
					endPositions[vidx + 1] = hh;
					endPositions[vidx + 2] = hd - i*this._depth/this._segmentsD;

					thickness[fidx++] = 1;

					vidx += 3;
				}


				//top/bottom face
				for (i = 0; i < this._segmentsD; ++i) {
					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = -hh;
					startPositions[vidx + 2] = hd - i*this._depth/this._segmentsD;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = -hh;
					endPositions[vidx + 2] = hd - i*this._depth/this._segmentsD;

					thickness[fidx++] = 1;

					vidx += 3;

					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = hh;
					startPositions[vidx + 2] = i*this._depth/this._segmentsD - hd;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = hh;
					endPositions[vidx + 2] = i*this._depth/this._segmentsD - hd;

					thickness[fidx++] = 1;

					vidx += 3;
				}

				for (i = 0; i < this._segmentsW; ++i) {
					startPositions[vidx] = hw - i*this._width/this._segmentsW;
					startPositions[vidx + 1] = -hh;
					startPositions[vidx + 2] = -hd;

					endPositions[vidx] = hw - i*this._width/this._segmentsW;
					endPositions[vidx + 1] = -hh;
					endPositions[vidx + 2] = hd;

					thickness[fidx++] = 1;

					vidx += 3;

					startPositions[vidx] = i*this._width/this._segmentsW - hw;
					startPositions[vidx + 1] = hh;
					startPositions[vidx + 2] = -hd;

					endPositions[vidx] = i*this._width/this._segmentsW - hw;
					endPositions[vidx + 1] = hh;
					endPositions[vidx + 2] = hd;

					thickness[fidx++] = 1;

					vidx += 3;
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
			var i:number, j:number, index:number;
			var uvs:Array<number>;

			var u_tile_dim:number, v_tile_dim:number;
			var u_tile_step:number, v_tile_step:number;
			var tl0u:number, tl0v:number;
			var tl1u:number, tl1v:number;
			var du:number, dv:number;
			var numVertices:number;

			if (geometryType == "triangleSubGeometry") {

				numVertices = ((this._segmentsW + 1)*(this._segmentsH + 1) + (this._segmentsW + 1)*(this._segmentsD + 1) + (this._segmentsH + 1)*(this._segmentsD + 1))*2;

				var triangleGeometry:TriangleSubGeometry = <TriangleSubGeometry> target;

				if (numVertices == triangleGeometry.numVertices && triangleGeometry.uvs != null) {
					uvs = triangleGeometry.uvs;
				} else {
					uvs = new Array<number>(numVertices*2);
				}

				if (this._tile6) {
					u_tile_dim = u_tile_step = 1/3;
					v_tile_dim = v_tile_step = 1/2;
				} else {
					u_tile_dim = v_tile_dim = 1;
					u_tile_step = v_tile_step = 0;
				}

				// Create planes two and two, the same way that they were
				// constructed in the buildGeometry() function. First calculate
				// the top-left UV coordinate for both planes, and then loop
				// over the points, calculating the UVs from these numbers.

				// When tile6 is true, the layout is as follows:
				//       .-----.-----.-----. (1,1)
				//       | Bot |  T  | Bak |
				//       |-----+-----+-----|
				//       |  L  |  F  |  R  |
				// (0,0)'-----'-----'-----'

				index = 0;

				// FRONT / BACK
				tl0u = 1*u_tile_step;
				tl0v = 1*v_tile_step;
				tl1u = 2*u_tile_step;
				tl1v = 0*v_tile_step;
				du = u_tile_dim/this._segmentsW;
				dv = v_tile_dim/this._segmentsH;
				for (i = 0; i <= this._segmentsW; i++) {
					for (j = 0; j <= this._segmentsH; j++) {
						uvs[index++] = ( tl0u + i*du )*triangleGeometry.scaleU;
						uvs[index++] = ( tl0v + (v_tile_dim - j*dv))*triangleGeometry.scaleV;

						uvs[index++] = ( tl1u + (u_tile_dim - i*du))*triangleGeometry.scaleU;
						uvs[index++] = ( tl1v + (v_tile_dim - j*dv))*triangleGeometry.scaleV;
					}
				}

				// TOP / BOTTOM
				tl0u = 1*u_tile_step;
				tl0v = 0*v_tile_step;
				tl1u = 0*u_tile_step;
				tl1v = 0*v_tile_step;
				du = u_tile_dim/this._segmentsW;
				dv = v_tile_dim/this._segmentsD;
				for (i = 0; i <= this._segmentsW; i++) {
					for (j = 0; j <= this._segmentsD; j++) {
						uvs[index++] = ( tl0u + i*du)*triangleGeometry.scaleU;
						uvs[index++] = ( tl0v + (v_tile_dim - j*dv))*triangleGeometry.scaleV;

						uvs[index++] = ( tl1u + i*du)*triangleGeometry.scaleU;
						uvs[index++] = ( tl1v + j*dv)*triangleGeometry.scaleV;
					}
				}

				// LEFT / RIGHT
				tl0u = 0*u_tile_step;
				tl0v = 1*v_tile_step;
				tl1u = 2*u_tile_step;
				tl1v = 1*v_tile_step;
				du = u_tile_dim/this._segmentsD;
				dv = v_tile_dim/this._segmentsH;
				for (i = 0; i <= this._segmentsD; i++) {
					for (j = 0; j <= this._segmentsH; j++) {
						uvs[index++] = ( tl0u + i*du)*triangleGeometry.scaleU;
						uvs[index++] = ( tl0v + (v_tile_dim - j*dv))*triangleGeometry.scaleV;

						uvs[index++] = ( tl1u + (u_tile_dim - i*du))*triangleGeometry.scaleU;
						uvs[index++] = ( tl1v + (v_tile_dim - j*dv))*triangleGeometry.scaleV;
					}
				}

				triangleGeometry.updateUVs(uvs);

			} else if (geometryType == "lineSubGeometry") {
				//nothing to do here
			}
		}
	}
}
