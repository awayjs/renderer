///<reference path="../_definitions.ts"/>

module away.prefabs
{
	import SubGeometryBase			= away.base.SubGeometryBase;
	import TriangleSubGeometry		= away.base.TriangleSubGeometry;
	import LineSubGeometry			= away.base.LineSubGeometry;

	/**
	 * A Plane primitive mesh.
	 */
	export class PrimitivePlanePrefab extends away.prefabs.PrimitivePrefabBase implements away.library.IAsset
	{
		private _segmentsW:number;
		private _segmentsH:number;
		private _yUp:boolean;
		private _width:number;
		private _height:number;
		private _doubleSided:boolean;

		/**
		 * Creates a new Plane object.
		 * @param width The width of the plane.
		 * @param height The height of the plane.
		 * @param segmentsW The number of segments that make up the plane along the X-axis.
		 * @param segmentsH The number of segments that make up the plane along the Y or Z-axis.
		 * @param yUp Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false).
		 * @param doubleSided Defines whether the plane will be visible from both sides, with correct vertex normals.
		 */
		constructor(width:number = 100, height:number = 100, segmentsW:number = 1, segmentsH:number = 1, yUp:boolean = true, doubleSided:boolean = false)
		{

			super();

			this._segmentsW = segmentsW;
			this._segmentsH = segmentsH;
			this._yUp = yUp;
			this._width = width;
			this._height = height;
			this._doubleSided = doubleSided;

		}

		/**
		 * The number of segments that make up the plane along the X-axis. Defaults to 1.
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
		 * The number of segments that make up the plane along the Y or Z-axis, depending on whether yUp is true or
		 * false, respectively. Defaults to 1.
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
		 *  Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false). Defaults to true.
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
		 * Defines whether the plane will be visible from both sides, with correct vertex normals (as opposed to bothSides on Material). Defaults to false.
		 */
		public get doubleSided():boolean
		{
			return this._doubleSided;
		}

		public set doubleSided(value:boolean)
		{
			this._doubleSided = value;

			this._pInvalidateGeometry();
		}

		/**
		 * The width of the plane.
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
		 * The height of the plane.
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
		 * @inheritDoc
		 */
		public _pBuildGeometry(target:SubGeometryBase, geometryType:string)
		{
			var indices:Array<number> /*uint*/;
			var x:number, y:number;
			var numIndices:number;
			var base:number;
			var tw:number = this._segmentsW + 1;
			var numVertices:number;

			var vidx:number, fidx:number; // indices

			var xi:number;
			var yi:number;

			if (geometryType == "triangleSubGeometry") {

				var triangleGeometry:TriangleSubGeometry = <TriangleSubGeometry> target;

				var numVertices:number = (this._segmentsH + 1)*tw;
				var positions:Array<number>;
				var normals:Array<number>;
				var tangents:Array<number>;

				if (this._doubleSided)
					numVertices *= 2;

				numIndices = this._segmentsH*this._segmentsW*6;

				if (this._doubleSided)
					numIndices *= 2;

				if (triangleGeometry.indices != null && numIndices == triangleGeometry.indices.length) {
					indices = triangleGeometry.indices;
				} else {
					indices = new Array<number>(numIndices);

					this._pInvalidateUVs();
				}

				if (numVertices == triangleGeometry.numVertices) {
					positions = triangleGeometry.positions;
					normals = triangleGeometry.vertexNormals;
					tangents = triangleGeometry.vertexTangents;
				} else {
					positions = new Array<number>(numVertices*3);
					normals = new Array<number>(numVertices*3);
					tangents = new Array<number>(numVertices*3);

					this._pInvalidateUVs();
				}

				fidx = 0;

				vidx = 0;

				for (yi = 0; yi <= this._segmentsH; ++yi) {

					for (xi = 0; xi <= this._segmentsW; ++xi) {
						x = (xi/this._segmentsW - .5)*this._width;
						y = (yi/this._segmentsH - .5)*this._height;

						positions[vidx] = x;
						if (this._yUp) {
							positions[vidx + 1] = 0;
							positions[vidx + 2] = y;
						} else {
							positions[vidx + 1] = y;
							positions[vidx + 2] = 0;
						}

						normals[vidx] = 0;

						if (this._yUp) {
							normals[vidx + 1] = 1;
							normals[vidx + 2] = 0;
						} else {
							normals[vidx + 1] = 0;
							normals[vidx + 2] = -1;
						}

						tangents[vidx] = 1;
						tangents[vidx + 1] = 0;
						tangents[vidx + 2] = 0;

						vidx += 3;

						// add vertex with same position, but with inverted normal & tangent
						if (this._doubleSided) {

							for (var i:number = vidx; i < vidx + 3; ++i) {
								positions[i] = positions[i - 3];
								normals[i] = -normals[i - 3];
								tangents[i] = -tangents[i - 3];
							}

							vidx += 3;

						}

						if (xi != this._segmentsW && yi != this._segmentsH) {

							base = xi + yi*tw;
							var mult:number = this._doubleSided? 2 : 1;

							indices[fidx++] = base*mult;
							indices[fidx++] = (base + tw)*mult;
							indices[fidx++] = (base + tw + 1)*mult;
							indices[fidx++] = base*mult;
							indices[fidx++] = (base + tw + 1)*mult;
							indices[fidx++] = (base + 1)*mult;

							if (this._doubleSided) {

								indices[fidx++] = (base + tw + 1)*mult + 1;
								indices[fidx++] = (base + tw)*mult + 1;
								indices[fidx++] = base*mult + 1;
								indices[fidx++] = (base + 1)*mult + 1;
								indices[fidx++] = (base + tw + 1)*mult + 1;
								indices[fidx++] = base*mult + 1;

							}
						}
					}
				}

				triangleGeometry.updateIndices(indices);

				triangleGeometry.updatePositions(positions);
				triangleGeometry.updateVertexNormals(normals);
				triangleGeometry.updateVertexTangents(tangents);

			} else if (geometryType == "lineSubGeometry") {
				var lineGeometry:LineSubGeometry = <LineSubGeometry> target;

				var numSegments:number = (this._segmentsH + 1) + tw;
				var startPositions:Array<number>;
				var endPositions:Array<number>;
				var thickness:Array<number>;

				var hw:number = this._width/2;
				var hh:number = this._height/2;


				if (lineGeometry.indices != null && numSegments == lineGeometry.numSegments) {
					startPositions = lineGeometry.startPositions;
					endPositions = lineGeometry.endPositions;
					thickness = lineGeometry.thickness;
				} else {
					startPositions = new Array<number>(numSegments*3);
					endPositions = new Array<number>(numSegments*3);
					thickness = new Array<number>(numSegments);
				}

				fidx = 0;

				vidx = 0;

				for (yi = 0; yi <= this._segmentsH; ++yi) {
					startPositions[vidx] = -hw;
					startPositions[vidx + 1] = 0;
					startPositions[vidx + 2] = yi*this._height - hh;

					endPositions[vidx] = hw;
					endPositions[vidx + 1] = 0;
					endPositions[vidx + 2] = yi*this._height - hh;

					thickness[fidx++] = 1;

					vidx += 3;
				}


				for (xi = 0; xi <= this._segmentsW; ++xi) {
					startPositions[vidx] = xi*this._width - hw;
					startPositions[vidx + 1] = 0;
					startPositions[vidx + 2] = -hh;

					endPositions[vidx] = xi*this._width - hw;
					endPositions[vidx + 1] = 0;
					endPositions[vidx + 2] = hh;

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
			var uvs:Array<number>;
			var numVertices:number;

			if (geometryType == "triangleSubGeometry") {

				numVertices = ( this._segmentsH + 1 )*( this._segmentsW + 1 );

				if (this._doubleSided)
					numVertices *= 2;

				var triangleGeometry:TriangleSubGeometry = <TriangleSubGeometry> target;

				if (triangleGeometry.uvs && numVertices == triangleGeometry.numVertices) {
					uvs = triangleGeometry.uvs;
				} else {
					uvs = new Array<number>(numVertices*2);
					this._pInvalidateGeometry()
				}

				var index:number = 0;

				for (var yi:number = 0; yi <= this._segmentsH; ++yi) {

					for (var xi:number = 0; xi <= this._segmentsW; ++xi) {
						uvs[index] = (xi/this._segmentsW)*triangleGeometry.scaleU;
						uvs[index + 1] = (1 - yi/this._segmentsH)*triangleGeometry.scaleV;
						index += 2;

						if (this._doubleSided) {
							uvs[index] = (xi/this._segmentsW)*triangleGeometry.scaleU;
							uvs[index+1] = (1 - yi/this._segmentsH)*triangleGeometry.scaleV;
							index += 2;
						}
					}
				}

				triangleGeometry.updateUVs(uvs);


			} else if (geometryType == "lineSubGeometry") {
				//nothing to do here
			}
		}
	}
}
