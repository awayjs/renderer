///<reference path="../_definitions.ts"/>

module away.primitives
{
	//import away3d.arcane;
	//import away3d.core.base.CompactSubGeometry;
	
	//use namespace arcane;
	
	/**
	 * A UV Cylinder primitive mesh.
	 */
	export class TorusGeometry extends away.primitives.PrimitiveBase
	{
		private _radius:number;
		private _tubeRadius:number;
		private _segmentsR:number;
		private _segmentsT:number;
		private _yUp:boolean;
		private _rawVertexData:number[];
		private _rawIndices:number[] /*uint*/;
		private _nextVertexIndex:number;
		private _currentIndex:number;
		private _currentTriangleIndex:number;
		private _numVertices:number;
		private _vertexStride:number;
		private _vertexOffset:number;
		
		private addVertex(px:number, py:number, pz:number, nx:number, ny:number, nz:number, tx:number, ty:number, tz:number)
		{
			var compVertInd:number = this._vertexOffset + this._nextVertexIndex*this._vertexStride; // current component vertex index
            this._rawVertexData[compVertInd++] = px;
            this._rawVertexData[compVertInd++] = py;
            this._rawVertexData[compVertInd++] = pz;
            this._rawVertexData[compVertInd++] = nx;
            this._rawVertexData[compVertInd++] = ny;
            this._rawVertexData[compVertInd++] = nz;
            this._rawVertexData[compVertInd++] = tx;
            this._rawVertexData[compVertInd++] = ty;
            this._rawVertexData[compVertInd] = tz;
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
			var i:number, j:number;
			var x:number, y:number, z:number, nx:number, ny:number, nz:number, revolutionAngleR:number, revolutionAngleT:number;
			var numTriangles:number;
			// reset utility variables
			this._numVertices = 0;
            this._nextVertexIndex = 0;
            this._currentIndex = 0;
            this._currentTriangleIndex = 0;
            this._vertexStride = target.vertexStride;
            this._vertexOffset = target.vertexOffset;
			
			// evaluate target number of vertices, triangles and indices
            this._numVertices = (this._segmentsT + 1)*(this._segmentsR + 1); // segmentsT + 1 because of closure, segmentsR + 1 because of closure
			numTriangles = this._segmentsT*this._segmentsR*2; // each level has segmentR quads, each of 2 triangles
			
			// need to initialize raw arrays or can be reused?
			if (this._numVertices == target.numVertices)
            {
                this._rawVertexData = target.vertexData;

                if ( target.indexData == null )
                {

                    this._rawIndices = new Array<number>( numTriangles * 3 );

                }
                else
                {

                    this._rawIndices = target.indexData;

                }


			}
            else
            {

				var numVertComponents:number = this._numVertices*this._vertexStride;
                this._rawVertexData = new Array<number>(numVertComponents);
                this._rawIndices = new Array<number>(numTriangles*3);

                this.pInvalidateUVs();

			}
			
			// evaluate revolution steps
			var revolutionAngleDeltaR:number = 2*Math.PI/this._segmentsR;
			var revolutionAngleDeltaT:number = 2*Math.PI/this._segmentsT;
			
			var comp1:number, comp2:number;
			var t1:number, t2:number, n1:number, n2:number;
			var startIndex:number;
			
			// surface
			var a:number, b:number, c:number, d:number, length:number;
			
			for (j = 0; j <= this._segmentsT; ++j)
            {
				
				startIndex = this._vertexOffset + this._nextVertexIndex * this._vertexStride;
				
				for (i = 0; i <= this._segmentsR; ++i)
                {

					// revolution vertex
					revolutionAngleR = i*revolutionAngleDeltaR;
					revolutionAngleT = j*revolutionAngleDeltaT;
					
					length = Math.cos(revolutionAngleT);
					nx = length*Math.cos(revolutionAngleR);
					ny = length*Math.sin(revolutionAngleR);
					nz = Math.sin(revolutionAngleT);
					
					x = this._radius*Math.cos(revolutionAngleR) + this._tubeRadius*nx;
					y = this._radius*Math.sin(revolutionAngleR) + this._tubeRadius*ny;
					z = (j == this._segmentsT)? 0 : this._tubeRadius*nz;
					
					if (this._yUp)
                    {

						n1 = -nz;
						n2 = ny;
						t1 = 0;
						t2 = (length? nx/length : x/this._radius);
						comp1 = -z;
						comp2 = y;
						
					}
                    else
                    {
						n1 = ny;
						n2 = nz;
						t1 = (length? nx/length : x/this._radius);
						t2 = 0;
						comp1 = y;
						comp2 = z;
					}
					
					if (i == this._segmentsR)
                    {
						this.addVertex(x, this._rawVertexData[startIndex + 1], this._rawVertexData[startIndex + 2],
							nx, n1, n2,
							-(length? ny/length : y/this._radius), t1, t2);
					}
                    else
                    {
						this.addVertex(x, comp1, comp2,
							nx, n1, n2,
							-(length? ny/length : y/this._radius), t1, t2);
					}
					
					// close triangle
					if (i > 0 && j > 0)
                    {
						a = this._nextVertexIndex - 1; // current
						b = this._nextVertexIndex - 2; // previous
						c = b - this._segmentsR - 1; // previous of last level
						d = a - this._segmentsR - 1; // current of last level
                        this.addTriangleClockWise(a, b, c);
                        this.addTriangleClockWise(a, c, d);
					}
				}
			}
			
			// build real data from raw data
			target.updateData(this._rawVertexData);
			target.updateIndexData(this._rawIndices);
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildUVs(target:away.base.CompactSubGeometry)
		{

			var i:number, j:number;
			var data:number[];
			var stride:number = target.UVStride;
			var offset:number = target.UVOffset;
			var skip:number = target.UVStride - 2;
			
			// evaluate num uvs
			var numUvs:number = this._numVertices*stride;
			
			// need to initialize raw array or can be reused?
			if (target.UVData && numUvs == target.UVData.length)
            {

                data = target.UVData;

            }
			else
            {

				data = new Array<number>( numUvs );
				this.pInvalidateGeometry();//invalidateGeometry();

			}
			
			// current uv component index
			var currentUvCompIndex:number = offset;
			
			// surface
			for (j = 0; j <= this._segmentsT; ++j)
            {

				for (i = 0; i <= this._segmentsR; ++i)
                {
					// revolution vertex
					data[currentUvCompIndex++] = ( i/this._segmentsR )*target.scaleU;
					data[currentUvCompIndex++] = ( j/this._segmentsT )*target.scaleV;
					currentUvCompIndex += skip;
				}

			}
			
			// build real data from raw data
			target.updateData(data);
		}
		
		/**
		 * The radius of the torus.
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
		 * The radius of the inner tube of the torus.
		 */
		public get tubeRadius():number
		{
			return this._tubeRadius;
		}
		
		public set tubeRadius(value:number)
		{
            this._tubeRadius = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * Defines the number of horizontal segments that make up the torus. Defaults to 16.
		 */
		public get segmentsR():number
		{
			return this._segmentsR;
		}
		
		public set segmentsR(value:number)
		{
            this._segmentsR = value;
            this.pInvalidateGeometry();
            this.pInvalidateUVs();
		}
		
		/**
		 * Defines the number of vertical segments that make up the torus. Defaults to 8.
		 */
		public get segmentsT():number
		{
			return this._segmentsT;
		}
		
		public set segmentsT(value:number)
		{
            this._segmentsT = value;
            this.pInvalidateGeometry();
			this.pInvalidateUVs();
		}
		
		/**
		 * Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
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
		 * Creates a new <code>Torus</code> object.
		 * @param radius The radius of the torus.
		 * @param tuebRadius The radius of the inner tube of the torus.
		 * @param segmentsR Defines the number of horizontal segments that make up the torus.
		 * @param segmentsT Defines the number of vertical segments that make up the torus.
		 * @param yUp Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		constructor(radius:number = 50, tubeRadius:number = 50, segmentsR:number = 16, segmentsT:number = 8, yUp:boolean = true)
		{
			super();

            this._radius = radius;
            this._tubeRadius = tubeRadius;
            this._segmentsR = segmentsR;
            this._segmentsT = segmentsT;
			this._yUp = yUp;
		}
	}
}
