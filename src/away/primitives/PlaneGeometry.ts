///<reference path="../_definitions.ts"/>

module away.primitives
{
	/**
	 * A Plane primitive mesh.
	 */
	export class PlaneGeometry extends away.primitives.PrimitiveBase
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

            this.pInvalidateGeometry();
            this.pInvalidateUVs();

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

            this.pInvalidateGeometry();
            this.pInvalidateUVs();

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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();//invalidateGeometry();
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildGeometry(target:away.base.CompactSubGeometry)
		{
			var data:number[];
			var indices:number[] /*uint*/;
			var x:number, y:number;
			var numIndices:number;
			var base:number;
			var tw:number = this._segmentsW + 1;
			var numVertices:number = (this._segmentsH + 1)*tw;
			var stride:number = target.vertexStride;
			var skip:number = stride - 9;

			if (this._doubleSided)
				numVertices *= 2;
			
			numIndices = this._segmentsH*this._segmentsW*6;

			if (this._doubleSided)
				numIndices <<= 1;
			
			if (numVertices == target.numVertices)
            {

                data = target.vertexData;

                if ( indices == null )
                {
                    indices = new Array<number>( numIndices );
                }
                else
                {
                    indices = target.indexData;
                }
			}
            else
            {
				data = new Array<number>( numVertices*stride );//new Vector.<Number>(numVertices*stride, true);
				indices = new Array<number>( numIndices );//new Vector.<uint>(numIndices, true);

                this.pInvalidateUVs();//invalidateUVs();
			}
			
			numIndices = 0;

			var index:number = target.vertexOffset;

			for (var yi:number = 0; yi <= this._segmentsH; ++yi)
            {

				for (var xi:number = 0; xi <= this._segmentsW; ++xi)
                {
					x = (xi/this._segmentsW - .5)*this._width;
					y = (yi/this._segmentsH - .5)*this._height;
					
					data[index++] = x;
					if (this._yUp)
                    {
						data[index++] = 0;
						data[index++] = y;
					}
                    else
                    {
						data[index++] = y;
						data[index++] = 0;
					}
					
					data[index++] = 0;

					if (this._yUp)
                    {
						data[index++] = 1;
						data[index++] = 0;
					}
                    else
                    {
						data[index++] = 0;
						data[index++] = -1;
					}
					
					data[index++] = 1;
					data[index++] = 0;
					data[index++] = 0;
					
					index += skip;
					
					// add vertex with same position, but with inverted normal & tangent
					if (this._doubleSided)
                    {

						for (var i:number = 0; i < 3; ++i)
                        {
							data[index] = data[index - stride];
							++index;
						}

						for (i = 0; i < 3; ++i)
                        {
							data[index] = -data[index - stride];
							++index;
						}

						for (i = 0; i < 3; ++i)
                        {
							data[index] = -data[index - stride];
							++index;
						}

						index += skip;

					}
					
					if (xi != this._segmentsW && yi != this._segmentsH)
                    {

						base = xi + yi*tw;
						var mult:number = this._doubleSided? 2 : 1;
						
						indices[numIndices++] = base*mult;
						indices[numIndices++] = (base + tw)*mult;
						indices[numIndices++] = (base + tw + 1)*mult;
						indices[numIndices++] = base*mult;
						indices[numIndices++] = (base + tw + 1)*mult;
						indices[numIndices++] = (base + 1)*mult;
						
						if (this._doubleSided)
                        {

							indices[numIndices++] = (base + tw + 1)*mult + 1;
							indices[numIndices++] = (base + tw)*mult + 1;
							indices[numIndices++] = base*mult + 1;
							indices[numIndices++] = (base + 1)*mult + 1;
							indices[numIndices++] = (base + tw + 1)*mult + 1;
							indices[numIndices++] = base*mult + 1;

						}
					}
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
			var data:number[];
			var stride:number = target.UVStride;
			var numUvs:number = ( this._segmentsH + 1 )*( this._segmentsW + 1 ) * stride;
			var skip:number = stride - 2;
			
			if (this._doubleSided)
            {
                numUvs *= 2;
            }

			
			if (target.UVData && numUvs == target.UVData.length)
            {
                data = target.UVData;
            }
			else
            {
				data = new Array<number>( numUvs );//Vector.<Number>(numUvs, true);
                this.pInvalidateGeometry()
			}
			
			var index:number = target.UVOffset;
			
			for (var yi:number = 0; yi <= this._segmentsH; ++yi)
            {

				for (var xi:number = 0; xi <= this._segmentsW; ++xi)
                {
					data[index++] = (1 - (xi/this._segmentsW)*target.scaleU );
					data[index++] = (1 - yi/this._segmentsH)*target.scaleV;
					index += skip;
					
					if (this._doubleSided)
                    {
						data[index++] = (1 - (xi/this._segmentsW)*target.scaleU ) ;
						data[index++] = ( 1 - yi/this._segmentsH)*target.scaleV;
						index += skip;
					}
				}
			}
			
			target.updateData(data);
		}
	}
}
