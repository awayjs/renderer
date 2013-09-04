///<reference path="../_definitions.ts"/>
module away.primitives
{
	//import away3d.arcane;
	//import away3d.core.base.CompactSubGeometry;

	/**
	 * A UV Sphere primitive mesh.
	 */
	export class SphereGeometry extends away.primitives.PrimitiveBase
	{
		private _radius:number;
		private _segmentsW:number;
		private _segmentsH:number;
		private _yUp:boolean;
		
		/**
		 * Creates a new Sphere object.
		 * @param radius The radius of the sphere.
		 * @param segmentsW Defines the number of horizontal segments that make up the sphere.
		 * @param segmentsH Defines the number of vertical segments that make up the sphere.
		 * @param yUp Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
		 */
		constructor(radius:number = 50, segmentsW:number = 16, segmentsH:number = 12, yUp:boolean = true)
		{
			super();
			
			this._radius = radius;
            this._segmentsW = segmentsW;
            this._segmentsH = segmentsH;
            this._yUp = yUp;
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildGeometry(target:away.base.CompactSubGeometry)
		{
			var vertices:number[];
			var indices:number[] /*uint*/;
			var i:number;
            var j:number;
            var triIndex:number = 0;
			var numVerts:number = (this._segmentsH + 1)*(this._segmentsW + 1);
			var stride:number = target.vertexStride;
			var skip:number = stride - 9;
			
			if (numVerts == target.numVertices)
            {
				vertices = target.vertexData;


                if ( target.indexData )
                {

                    indices = target.indexData;

                }
                else
                {
                    indices = new Array<number>((this._segmentsH - 1)*this._segmentsW*6 );
                }


			}
            else
            {
				vertices = new Array<number>(numVerts*stride);
				indices = new Array<number>((this._segmentsH - 1)*this._segmentsW*6);
				this.pInvalidateGeometry();
			}
			
			var startIndex:number;
			var index:number = target.vertexOffset;
			var comp1:number;
            var comp2:number;
            var t1:number;
            var t2:number;
			
			for (j = 0; j <= this._segmentsH; ++j)
            {
				
				startIndex = index;
				
				var horangle:number = Math.PI*j/this._segmentsH;
				var z:number = -this._radius*Math.cos(horangle);
				var ringradius:number = this._radius*Math.sin(horangle);
				
				for (i = 0; i <= this._segmentsW; ++i)
                {
					var verangle:number = 2*Math.PI*i/this._segmentsW;
					var x:number = ringradius*Math.cos(verangle);
					var y:number = ringradius*Math.sin(verangle);
					var normLen:number = 1/Math.sqrt(x*x + y*y + z*z);
					var tanLen:number = Math.sqrt(y*y + x*x);
					
					if (this._yUp)
                    {

						t1 = 0;
						t2 = tanLen > .007? x/tanLen : 0;
						comp1 = -z;
						comp2 = y;
						
					}
                    else
                    {
						t1 = tanLen > .007? x/tanLen : 0;
						t2 = 0;
						comp1 = y;
						comp2 = z;
					}
					
					if (i == this._segmentsW) {
						vertices[index++] = vertices[startIndex];
						vertices[index++] = vertices[startIndex + 1];
						vertices[index++] = vertices[startIndex + 2];
						vertices[index++] = vertices[startIndex + 3] + (x*normLen)*.5;
						vertices[index++] = vertices[startIndex + 4] + ( comp1*normLen)*.5;
						vertices[index++] = vertices[startIndex + 5] + (comp2*normLen)*.5;
						vertices[index++] = tanLen > .007? -y/tanLen : 1;
						vertices[index++] = t1;
						vertices[index++] = t2;
						
					}
                    else
                    {

						vertices[index++] = x;
						vertices[index++] = comp1;
						vertices[index++] = comp2;
						vertices[index++] = x*normLen;
						vertices[index++] = comp1*normLen;
						vertices[index++] = comp2*normLen;
						vertices[index++] = tanLen > .007? -y/tanLen : 1;
						vertices[index++] = t1;
						vertices[index++] = t2;
					}
					
					if (i > 0 && j > 0)
                    {

						var a:number = (this._segmentsW + 1)*j + i;
						var b:number = (this._segmentsW + 1)*j + i - 1;
						var c:number = (this._segmentsW + 1)*(j - 1) + i - 1;
						var d:number = (this._segmentsW + 1)*(j - 1) + i;
						
						if (j == this._segmentsH)
                        {

							vertices[index - 9] = vertices[startIndex];
							vertices[index - 8] = vertices[startIndex + 1];
							vertices[index - 7] = vertices[startIndex + 2];
							
							indices[triIndex++] = a;
							indices[triIndex++] = c;
							indices[triIndex++] = d;
							
						}
                        else if (j == 1)
                        {

							indices[triIndex++] = a;
							indices[triIndex++] = b;
							indices[triIndex++] = c;
							
						}
                        else
                        {
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
			
			target.updateData(vertices);
			target.updateIndexData(indices);
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildUVs(target:away.base.CompactSubGeometry)
		{
			var i:number, j:number;
			var stride:number = target.UVStride;
			var numUvs:number = (this._segmentsH + 1)*(this._segmentsW + 1)*stride;
			var data:number[];
			var skip:number = stride - 2;
			
			if (target.UVData && numUvs == target.UVData.length)
				data = target.UVData;
			else {
				data = new Array<number>(numUvs);
                this.pInvalidateGeometry();
			}
			
			var index:number = target.UVOffset;
			for (j = 0; j <= this._segmentsH; ++j)
            {
				for (i = 0; i <= this._segmentsW; ++i)
                {
					data[index++] = ( i/this._segmentsW )*target.scaleU ;
					data[index++] = ( j/this._segmentsH )*target.scaleV;
					index += skip;
				}
			}
			
			target.updateData(data);
		}
		
		/**
		 * The radius of the sphere.
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
		 * Defines the number of horizontal segments that make up the sphere. Defaults to 16.
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
		 * Defines the number of vertical segments that make up the sphere. Defaults to 12.
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
		 * Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
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
