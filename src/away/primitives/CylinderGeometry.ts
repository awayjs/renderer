///<reference path="../_definitions.ts"/>

module away.primitives
{

	/**
	 * A Cylinder primitive mesh.
	 */
	export class CylinderGeometry extends away.primitives.PrimitiveBase
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
		private _rawData:number[];
		private _rawIndices:number[] /*uint*/;
		private _nextVertexIndex:number;
		private _currentIndex:number = 0;
		private _currentTriangleIndex:number;
		private _numVertices:number = 0;
		private _stride:number;
		private _vertexOffset:number;
		
		private addVertex(px:number, py:number, pz:number, nx:number, ny:number, nz:number, tx:number, ty:number, tz:number)
		{
			var compVertInd:number = this._vertexOffset + this._nextVertexIndex*this._stride; // current component vertex index
            this._rawData[compVertInd++] = px;
            this._rawData[compVertInd++] = py;
            this._rawData[compVertInd++] = pz;
            this._rawData[compVertInd++] = nx;
            this._rawData[compVertInd++] = ny;
            this._rawData[compVertInd++] = nz;
            this._rawData[compVertInd++] = tx;
            this._rawData[compVertInd++] = ty;
            this._rawData[compVertInd++] = tz;
            this._nextVertexIndex++;
		}
		
		private addTriangleClockWise(cwVertexIndex0:number, cwVertexIndex1:number, cwVertexIndex2:number)
		{
            this._rawIndices[this._currentIndex++] = cwVertexIndex0;
            this._rawIndices[this._currentIndex++] = cwVertexIndex1;
            this._rawIndices[this._currentIndex++] = cwVertexIndex2;
            this._currentTriangleIndex++;
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildGeometry(target:away.base.CompactSubGeometry)
		{
			var i:number;
            var j:number;
			var x:number;
            var y:number;
            var z:number;
            var radius:number;
            var revolutionAngle:number;

			var dr:number;
            var latNormElev:number;
            var latNormBase:number;
			var numTriangles:number = 0;
			
			var comp1:number;
            var comp2:number;
			var startIndex:number = 0;

			var t1:number;
            var t2:number;
			
			this._stride = target.vertexStride;
            this._vertexOffset = target.vertexOffset;
			
			// reset utility variables
            this._numVertices = 0;
            this._nextVertexIndex = 0;
            this._currentIndex = 0;
            this._currentTriangleIndex = 0;
			
			// evaluate target number of vertices, triangles and indices
			if (this._surfaceClosed)
            {
                this._numVertices += (this._pSegmentsH + 1)*(this._pSegmentsW + 1); // segmentsH + 1 because of closure, segmentsW + 1 because of UV unwrapping
				numTriangles += this._pSegmentsH*this._pSegmentsW*2; // each level has segmentW quads, each of 2 triangles
			}
			if (this._topClosed)
            {
                this._numVertices += 2*(this._pSegmentsW + 1); // segmentsW + 1 because of unwrapping
				numTriangles += this._pSegmentsW; // one triangle for each segment
			}
			if (this._bottomClosed)
            {
                this._numVertices += 2*(this._pSegmentsW + 1);
				numTriangles += this._pSegmentsW;
			}
			
			// need to initialize raw arrays or can be reused?
			if (this._numVertices == target.numVertices)
            {
                this._rawData = target.vertexData;

                if ( target.indexData )
                {
                    this._rawIndices = target.indexData
                }
                else
                {
                    this._rawIndices =  new Array<number>(numTriangles*3);
                }

			}
            else
            {
				var numVertComponents:number = this._numVertices*this._stride;
                this._rawData = new Array<number>(numVertComponents);
                this._rawIndices = new Array<number>(numTriangles*3);
			}
			
			// evaluate revolution steps
			var revolutionAngleDelta:number = 2*Math.PI/this._pSegmentsW;
			
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

                    this.addVertex(0, comp1, comp2, 0, t1, t2, 1, 0, 0);
					
					// revolution vertex
					revolutionAngle = i*revolutionAngleDelta;
					x = this._topRadius*Math.cos(revolutionAngle);
					y = this._topRadius*Math.sin(revolutionAngle);
					
					if (this._yUp)
                    {
						comp1 = -z;
						comp2 = y;
					}
                    else
                    {
						comp1 = y;
						comp2 = z;
					}
					
					if (i == this._pSegmentsW)
                        this.addVertex(this._rawData[startIndex + this._stride], this._rawData[startIndex + this._stride + 1], this._rawData[startIndex + this._stride + 2], 0, t1, t2, 1, 0, 0);
					else
                        this.addVertex(x, comp1, comp2, 0, t1, t2, 1, 0, 0);
					
					if (i > 0) // add triangle
						this.addTriangleClockWise(this._nextVertexIndex - 1, this._nextVertexIndex - 3, this._nextVertexIndex - 2);
				}
			}
			
			// bottom
			if (this._bottomClosed && this._pBottomRadius > 0)
            {
				
				z = 0.5*this._height;
				
				startIndex = this._vertexOffset + this._nextVertexIndex*this._stride;
				
				for (i = 0; i <= this._pSegmentsW; ++i)
                {
					if (this._yUp)
                    {
						t1 = -1;
						t2 = 0;
						comp1 = -z;
						comp2 = 0;
					}
                    else
                    {
						t1 = 0;
						t2 = 1;
						comp1 = 0;
						comp2 = z;
					}

                    this.addVertex(0, comp1, comp2, 0, t1, t2, 1, 0, 0);
					
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
					
					if (i == this._pSegmentsW)
                        this.addVertex(x, this._rawData[startIndex + 1], this._rawData[startIndex + 2], 0, t1, t2, 1, 0, 0);
					else
                        this.addVertex(x, comp1, comp2, 0, t1, t2, 1, 0, 0);
					
					if (i > 0) // add triangle
                        this.addTriangleClockWise(this._nextVertexIndex - 2, this._nextVertexIndex - 3, this._nextVertexIndex - 1);
				}
			}
			
			// The normals on the lateral surface all have the same incline, i.e.
			// the "elevation" component (Y or Z depending on yUp) is constant.
			// Same principle goes for the "base" of these vectors, which will be
			// calculated such that a vector [base,elev] will be a unit vector.
			dr = (this._pBottomRadius - this._topRadius);
			latNormElev = dr/this._height;
			latNormBase = (latNormElev == 0)? 1 : this._height/dr;
			
			// lateral surface
			if (this._surfaceClosed)
            {
				var a:number;
                var b:number;
                var c:number;
                var d:number;
				var na0:number, na1:number, naComp1:number, naComp2:number;
				
				for (j = 0; j <= this._pSegmentsH; ++j)
                {
					radius = this._topRadius - ((j/this._pSegmentsH)*(this._topRadius - this._pBottomRadius));
					z = -(this._height/2) + (j/this._pSegmentsH*this._height);
					
					startIndex = this._vertexOffset + this._nextVertexIndex*this._stride;
					
					for (i = 0; i <= this._pSegmentsW; ++i)
                    {
						// revolution vertex
						revolutionAngle = i*revolutionAngleDelta;
						x = radius*Math.cos(revolutionAngle);
						y = radius*Math.sin(revolutionAngle);
						na0 = latNormBase*Math.cos(revolutionAngle);
						na1 = latNormBase*Math.sin(revolutionAngle);
						
						if (this._yUp)
                        {
							t1 = 0;
							t2 = -na0;
							comp1 = -z;
							comp2 = y;
							naComp1 = latNormElev;
							naComp2 = na1;
							
						}
                        else
                        {
							t1 = -na0;
							t2 = 0;
							comp1 = y;
							comp2 = z;
							naComp1 = na1;
							naComp2 = latNormElev;
						}
						
						if (i == this._pSegmentsW)
                        {
                            this.addVertex( this._rawData[startIndex], this._rawData[startIndex + 1], this._rawData[startIndex + 2],
								            na0, latNormElev, na1,
								            na1, t1, t2);
						}
                        else
                        {
                            this.addVertex( x, comp1, comp2,
								            na0, naComp1, naComp2,
								            -na1, t1, t2);
						}
						
						// close triangle
						if (i > 0 && j > 0) {
							a = this._nextVertexIndex - 1; // current
							b = this._nextVertexIndex - 2; // previous
							c = b - this._pSegmentsW - 1; // previous of last level
							d = a - this._pSegmentsW - 1; // current of last level
                            this.addTriangleClockWise(a, b, c);
                            this.addTriangleClockWise(a, c, d);
						}
					}
				}
			}
			
			// build real data from raw data
			target.updateData(this._rawData);
			target.updateIndexData(this._rawIndices);
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildUVs(target:away.base.CompactSubGeometry)
		{
			var i:number;
            var j:number;
			var x:number;
            var y:number;
            var revolutionAngle:number;
			var stride:number = target.UVStride;
			var skip:number = stride - 2;
			var UVData:number[];
			
			// evaluate num uvs
			var numUvs:number = this._numVertices*stride;
			
			// need to initialize raw array or can be reused?
			if (target.UVData && numUvs == target.UVData.length)
            {
				UVData = target.UVData;
            }
			else
            {
				UVData = new Array<number>(numUvs);
				this.pInvalidateGeometry();
			}
			
			// evaluate revolution steps
			var revolutionAngleDelta:number = 2*Math.PI/this._pSegmentsW;
			
			// current uv component index
			var currentUvCompIndex:number = target.UVOffset;
			
			// top
			if (this._topClosed)
            {
				for (i = 0; i <= this._pSegmentsW; ++i)
                {
					
					revolutionAngle = i*revolutionAngleDelta;
					x = 0.5 + 0.5* -Math.cos(revolutionAngle);
					y = 0.5 + 0.5*Math.sin(revolutionAngle);
					
					UVData[currentUvCompIndex++] = 0.5*target.scaleU; // central vertex
					UVData[currentUvCompIndex++] = 0.5*target.scaleV;
					currentUvCompIndex += skip;
					UVData[currentUvCompIndex++] = x*target.scaleU; // revolution vertex
					UVData[currentUvCompIndex++] = y*target.scaleV;
					currentUvCompIndex += skip;
				}
			}
			
			// bottom
			if (this._bottomClosed)
            {
				for (i = 0; i <= this._pSegmentsW; ++i)
                {
					
					revolutionAngle = i*revolutionAngleDelta;
					x = 0.5 + 0.5*Math.cos(revolutionAngle);
					y = 0.5 + 0.5*Math.sin(revolutionAngle);
					
					UVData[currentUvCompIndex++] = 0.5*target.scaleU; // central vertex
					UVData[currentUvCompIndex++] = 0.5*target.scaleV;
					currentUvCompIndex += skip;
					UVData[currentUvCompIndex++] = x*target.scaleU; // revolution vertex
					UVData[currentUvCompIndex++] = y*target.scaleV;
					currentUvCompIndex += skip;
				}
			}
			
			// lateral surface
			if (this._surfaceClosed)
            {
				for (j = 0; j <= this._pSegmentsH; ++j)
                {
					for (i = 0; i <= this._pSegmentsW; ++i)
                    {
						// revolution vertex
						UVData[currentUvCompIndex++] = 1 - ( ( i/this._pSegmentsW )*target.scaleU ) ;
						UVData[currentUvCompIndex++] = ( j/this._pSegmentsH )*target.scaleV;
						currentUvCompIndex += skip;
					}
				}
			}
			
			// build real data from raw data
			target.updateData(UVData);
		}
		
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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();
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
            this.setSegmentsW( value );
        }

        public setSegmentsW(value:number)
        {
            this._pSegmentsW = value;
            this.pInvalidateGeometry();
            this.pInvalidateUVs();
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

            this.setSegmentsH( value )

        }

        public setSegmentsH(value:number)
        {
            this._pSegmentsH = value;
            this.pInvalidateGeometry();
            this.pInvalidateUVs();

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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();
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
            this.pInvalidateGeometry();
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
	}
}
