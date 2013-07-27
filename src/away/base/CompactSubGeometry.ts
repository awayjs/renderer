///<reference path="../_definitions.ts"/>
module away.base
{

	export class CompactSubGeometry extends away.base.SubGeometryBase implements away.base.ISubGeometry
	{
		private _vertexDataInvalid:boolean[] = Array<boolean>( 8 );//new Vector.<Boolean>(8, true);
		private _vertexBuffer:away.display3D.VertexBuffer3D[] = new Array<away.display3D.VertexBuffer3D>( 8 );//Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8);
		private _bufferContext:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//Vector.<Context3D> = new Vector.<Context3D>(8);
		private _numVertices:number;
		private _contextIndex:number;
		private _activeBuffer:away.display3D.VertexBuffer3D;
		private _activeContext:away.display3D.Context3D;
		private _activeDataInvalid:boolean;
		private _isolatedVertexPositionData:number[];
		private _isolatedVertexPositionDataDirty:boolean;
		
		constructor()
		{
            super();

			this._autoDeriveVertexNormals = false;
            this._autoDeriveVertexTangents = false;
		}
		
		public get numVertices():number
		{
			return this._numVertices;
		}
		
		/**
		 * Updates the vertex data. All vertex properties are contained in a single Vector, and the order is as follows:
		 * 0 - 2: vertex position X, Y, Z
		 * 3 - 5: normal X, Y, Z
		 * 6 - 8: tangent X, Y, Z
		 * 9 - 10: U V
		 * 11 - 12: Secondary U V
		 */
		public updateData(data:number[])
		{
			if (this._autoDeriveVertexNormals)
            {

                this._vertexNormalsDirty = true;

            }

			if (this._autoDeriveVertexTangents)
            {

                this._vertexTangentsDirty = true;

            }

			
			this._faceNormalsDirty = true;
            this._faceTangentsDirty = true;
            this._isolatedVertexPositionDataDirty = true;

            this._vertexData = data;
			var numVertices:number = this._vertexData.length/13;

			if (numVertices != this._numVertices)
            {

                this.pDisposeVertexBuffers(this._vertexBuffer);

            }

			this._numVertices = numVertices;
			
			if (this._numVertices == 0)
            {

                throw new Error("Bad data: geometry can't have zero triangles");

            }

			this.pInvalidateBuffers( this._vertexDataInvalid );
            this.pInvalidateBounds();

		}
		
		public activateVertexBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (contextIndex != this._contextIndex)
            {

                this.pUpdateActiveBuffer(contextIndex);

            }

			if (!this._activeBuffer || this._activeContext != context)
            {

                this.pCreateBuffer(contextIndex, context);

            }

			if ( this._activeDataInvalid )
            {

                this.pUploadData(contextIndex);

            }

			context.setVertexBufferAt(index, this._activeBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);

		}
		
		public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (this._uvsDirty && this._autoGenerateUVs)
            {

				this._vertexData = this.pUpdateDummyUVs( this._vertexData);

                this.pInvalidateBuffers( this._vertexDataInvalid );
			}
			
			if (contextIndex != this._contextIndex)
            {

                this.pUpdateActiveBuffer( contextIndex );

            }

			
			if (!this._activeBuffer || this._activeContext != context)
            {

                this.pCreateBuffer( contextIndex , context );

            }

			if (this._activeDataInvalid)
            {

                this.pUploadData( contextIndex );

            }

			
			context.setVertexBufferAt(index, this._activeBuffer, 9, away.display3D.Context3DVertexBufferFormat.FLOAT_2);

		}
		
		public activateSecondaryUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (contextIndex != this._contextIndex)
            {

                this.pUpdateActiveBuffer( contextIndex );

            }

			if (!this._activeBuffer || this._activeContext != context)
            {

                this.pCreateBuffer( contextIndex , context );

            }

			if ( this._activeDataInvalid )
            {

                this.pUploadData( contextIndex );

            }

			
			context.setVertexBufferAt(index, this._activeBuffer, 11, away.display3D.Context3DVertexBufferFormat.FLOAT_2);

		}
		
		public pUploadData(contextIndex:number)
		{

			this._activeBuffer.uploadFromArray(this._vertexData, 0, this._numVertices);
			this._vertexDataInvalid[contextIndex] = this._activeDataInvalid = false;
		}
		
		public activateVertexNormalBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (contextIndex != this._contextIndex)
            {

                this.pUpdateActiveBuffer( contextIndex );

            }

			
			if (!this._activeBuffer || this._activeContext != context)
            {

                this.pCreateBuffer( contextIndex , context );
            }

			if (this._activeDataInvalid)
            {

                this.pUploadData(contextIndex);

            }

			context.setVertexBufferAt(index, this._activeBuffer, 3, away.display3D.Context3DVertexBufferFormat.FLOAT_3);

		}
		
		public activateVertexTangentBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (contextIndex != this._contextIndex)
            {

                this.pUpdateActiveBuffer( contextIndex );

            }

			if (!this._activeBuffer || this._activeContext != context)
            {

                this.pCreateBuffer( contextIndex , context );

            }

			if ( this._activeDataInvalid )
            {
                this.pUploadData(contextIndex);

            }

			
			context.setVertexBufferAt(index, this._activeBuffer, 6, away.display3D.Context3DVertexBufferFormat.FLOAT_3);

		}
		
		public pCreateBuffer(contextIndex:number, context:away.display3D.Context3D)
		{
			this._vertexBuffer[contextIndex] = this._activeBuffer = context.createVertexBuffer(this._numVertices, 13);
			this._bufferContext[contextIndex] = this._activeContext = context;
			this._vertexDataInvalid[contextIndex] = this._activeDataInvalid = true;

		}
		
		public pUpdateActiveBuffer(contextIndex:number)
		{
			this._contextIndex = contextIndex;
            this._activeDataInvalid = this._vertexDataInvalid[contextIndex];
            this._activeBuffer = this._vertexBuffer[contextIndex];
            this._activeContext = this._bufferContext[contextIndex];
		}
		
		public get vertexData():number[]
		{
			if ( this._autoDeriveVertexNormals && this._vertexNormalsDirty)
            {

                this._vertexData = this.pUpdateVertexNormals(this._vertexData);

            }

			if (this._autoDeriveVertexTangents && this._vertexTangentsDirty)
            {

                this._vertexData = this.pUpdateVertexTangents(this._vertexData);

            }

			if (this._uvsDirty && this._autoGenerateUVs)
            {

                this._vertexData = this.pUpdateDummyUVs( this._vertexData );

            }

			return this._vertexData;
		}
		
		public pUpdateVertexNormals(target:number[]):number[]
		{

            this.pInvalidateBuffers( this._vertexDataInvalid);
			return super.pUpdateVertexNormals(target);

		}
		
		public pUpdateVertexTangents(target:number[]):number[]
		{
			if (this._vertexNormalsDirty)
            {

                this._vertexData = this.pUpdateVertexNormals( this._vertexData );

            }

			this.pInvalidateBuffers( this._vertexDataInvalid);

			return super.pUpdateVertexTangents(target);

		}
		
		public get vertexNormalData():number[]
		{
			if ( this._autoDeriveVertexNormals && this._vertexNormalsDirty)
            {


                this._vertexData = this.pUpdateVertexNormals(this._vertexData);

            }

			return this._vertexData;

		}
		
		public get vertexTangentData():number[]
		{
			if ( this._autoDeriveVertexTangents && this._vertexTangentsDirty)
            {

                this._vertexData = this.pUpdateVertexTangents( this._vertexData );

            }

			return this._vertexData;
		}
		
		public get UVData():number[]
		{
			if ( this._uvsDirty && this._autoGenerateUVs) {


				this._vertexData = this.pUpdateDummyUVs(this._vertexData);
				this.pInvalidateBuffers( this._vertexDataInvalid );

			}

			return this._vertexData;
		}
		
		public applyTransformation(transform:away.geom.Matrix3D)
		{

			super.applyTransformation(transform);
			this.pInvalidateBuffers( this._vertexDataInvalid );

		}
		
		public scale(scale:number)
		{
			super.scale(scale);
			this.pInvalidateBuffers(this._vertexDataInvalid);
		}
		
		public clone():away.base.ISubGeometry
		{
			var clone:away.base.CompactSubGeometry = new away.base.CompactSubGeometry();

			    clone._autoDeriveVertexNormals = this._autoDeriveVertexNormals;
			    clone._autoDeriveVertexTangents = this._autoDeriveVertexTangents;

                clone.updateData(this._vertexData.concat());
			    clone.updateIndexData(this._indices.concat());

			return clone;
		}
		
		public scaleUV(scaleU:number = 1, scaleV:number = 1)
		{

			super.scaleUV(scaleU, scaleV);

			this.pInvalidateBuffers( this._vertexDataInvalid );

		}
		
		public get vertexStride():number
		{
			return 13;
		}
		
		public get vertexNormalStride():number
		{
			return 13;
		}
		
		public get vertexTangentStride():number
		{
			return 13;
		}
		
		public get UVStride():number
		{
			return 13;
		}
		
		public get secondaryUVStride():number
		{
			return 13;
		}
		
		public get vertexOffset():number
		{
			return 0;
		}
		
		public get vertexNormalOffset():number
		{
			return 3;
		}
		
		public get vertexTangentOffset():number
		{
			return 6;
		}
		
		public get UVOffset():number
		{
			return 9;
		}
		
		public get secondaryUVOffset():number
		{
			return 11;
		}
		
		public dispose()
		{
			super.dispose();
			this.pDisposeVertexBuffers(this._vertexBuffer);
			this._vertexBuffer = null;
		}
		
		public pDisposeVertexBuffers(buffers:away.display3D.VertexBuffer3D[] )
		{

			super.pDisposeVertexBuffers(buffers);
			this._activeBuffer = null;

		}
		
		public pInvalidateBuffers(invalid:boolean[])
		{
			super.pInvalidateBuffers(invalid);
			this._activeDataInvalid = true;

		}

		public cloneWithSeperateBuffers():away.base.SubGeometry
		{
			var clone:away.base.SubGeometry = new away.base.SubGeometry();

			clone.updateVertexData(this._isolatedVertexPositionData? this._isolatedVertexPositionData : this._isolatedVertexPositionData = this.stripBuffer(0, 3));
			clone.autoDeriveVertexNormals = this._autoDeriveVertexNormals;
			clone.autoDeriveVertexTangents = this._autoDeriveVertexTangents;

			if (!this._autoDeriveVertexNormals)
            {

                clone.updateVertexNormalData(this.stripBuffer(3, 3));

            }

			if (!this._autoDeriveVertexTangents)
            {

                clone.updateVertexTangentData(this.stripBuffer(6, 3));

            }

			clone.updateUVData(this.stripBuffer(9, 2));
			clone.updateSecondaryUVData(this.stripBuffer(11, 2));
			clone.updateIndexData(this.indexData.concat());

			return clone;

		}

        public get vertexPositionData():number[]
        {
            if (this._isolatedVertexPositionDataDirty || !this._isolatedVertexPositionData)
            {

                this._isolatedVertexPositionData = this.stripBuffer(0, 3);
                this._isolatedVertexPositionDataDirty = false;

            }

            return this._isolatedVertexPositionData;

        }

        public get strippedUVData():number[]
        {
            return this.stripBuffer(9, 2);
        }
		
		/**
		 * Isolate and returns a Vector.Number of a specific buffer type
		 *
		 * - stripBuffer(0, 3), return only the vertices
		 * - stripBuffer(3, 3): return only the normals
		 * - stripBuffer(6, 3): return only the tangents
		 * - stripBuffer(9, 2): return only the uv's
		 * - stripBuffer(11, 2): return only the secondary uv's
		 */
		public stripBuffer(offset:number, numEntries:number):number[]
		{
			var data:number[] = new Array<number>( this._numVertices*numEntries );// Vector.<Number>(_numVertices*numEntries);
			var i:number = 0;
            var j:number = offset;
			var skip:number = 13 - numEntries;
			
			for (var v:number = 0; v < this._numVertices; ++v)
            {

				for (var k:number = 0; k < numEntries; ++k)
                {

                    data[i++] = this._vertexData[j++];

                }

				j += skip;

			}
			
			return data;

		}
		
		public fromVectors(verts:number[], uvs:number[], normals:number[], tangents:number[])
		{
			var vertLen:number = verts.length/3*13;
			
			var index:number = 0;
			var v:number = 0;
			var n:number = 0;
			var t:number = 0;
			var u:number = 0;
			
			var data:number[] = new Array<number>( vertLen );//Vector.<Number>(vertLen, true);
			
			while (index < vertLen)
            {

				data[index++] = verts[v++];
				data[index++] = verts[v++];
				data[index++] = verts[v++];
				
				if (normals && normals.length)
                {

					data[index++] = normals[n++];
					data[index++] = normals[n++];
					data[index++] = normals[n++];

				}
                else
                {

					data[index++] = 0;
					data[index++] = 0;
					data[index++] = 0;

				}
				
				if (tangents && tangents.length)
                {

					data[index++] = tangents[t++];
					data[index++] = tangents[t++];
					data[index++] = tangents[t++];

				}
                else
                {

					data[index++] = 0;
					data[index++] = 0;
					data[index++] = 0;

				}
				
				if (uvs && uvs.length)
                {
					data[index++] = uvs[u];
					data[index++] = uvs[u + 1];
					// use same secondary uvs as primary
					data[index++] = uvs[u++];
					data[index++] = uvs[u++];

				}
                else
                {

					data[index++] = 0;
					data[index++] = 0;
					data[index++] = 0;
					data[index++] = 0;

				}
			}
			
			this.autoDeriveVertexNormals = !(normals && normals.length);
            this.autoDeriveVertexTangents = !(tangents && tangents.length);
            this.autoGenerateDummyUVs = !(uvs && uvs.length);
            this.updateData(data);

		}
	}
}
