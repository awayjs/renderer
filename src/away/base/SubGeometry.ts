///<reference path="../_definitions.ts"/>
/**
 * @module away.base
 */
module away.base
{
	//import away3d.arcane;
	//import away3d.managers.Stage3DProxy;
	
	//import flash.display3D.Context3D;
	//import flash.display3D.Context3DVertexBufferFormat;
	//import flash.display3D.VertexBuffer3D;
	//import flash.geom.Matrix3D;
	
	//use namespace arcane;
	
    /**
	 * The SubGeometry class is a collections of geometric data that describes a triangle mesh. It is owned by a
	 * Geometry instance, and wrapped by a SubMesh in the scene graph.
	 * Several SubGeometries are grouped so they can be rendered with different materials, but still represent a single
	 * object.
	 *
	 * @see away3d.core.base.Geometry
	 * @see away3d.core.base.SubMesh
     *
     * @class away.base.SubGeometry
	 */
	export class SubGeometry extends away.base.SubGeometryBase implements away.base.ISubGeometry
	{
		// raw data:
		private _uvs:number[];
		private _secondaryUvs:number[];
		private _vertexNormals:number[];
		private _vertexTangents:number[];
		
		private _verticesInvalid:boolean[] = new Array<boolean>( 8 );//= new Vector.<Boolean>(8, true);
		private _uvsInvalid:boolean[] = new Array<boolean>( 8 );//new Vector.<Boolean>(8, true);
		private _secondaryUvsInvalid:boolean[] = new Array<boolean>( 8 );//= new Vector.<Boolean>(8, true);
		private _normalsInvalid:boolean[] = new Array<boolean>( 8 );//= new Vector.<Boolean>(8, true);
		private _tangentsInvalid:boolean[] = new Array<boolean>( 8 );//= new Vector.<Boolean>(8, true);
		
		// buffers:
		private _vertexBuffer:away.display3D.VertexBuffer3D[] = new Array<away.display3D.VertexBuffer3D>( 8 );//Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8);
		private _uvBuffer:away.display3D.VertexBuffer3D[] = new Array<away.display3D.VertexBuffer3D>( 8 );//:Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8);
		private _secondaryUvBuffer:away.display3D.VertexBuffer3D[] = new Array<away.display3D.VertexBuffer3D>( 8 );//:Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8);
		private _vertexNormalBuffer:away.display3D.VertexBuffer3D[] = new Array<away.display3D.VertexBuffer3D>( 8 );//:Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8);
		private _vertexTangentBuffer:away.display3D.VertexBuffer3D[] = new Array<away.display3D.VertexBuffer3D>( 8 );//:Vector.<VertexBuffer3D> = new Vector.<VertexBuffer3D>(8);

		// buffer dirty flags, per context:
		private _vertexBufferContext:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//:Vector.<Context3D> = new Vector.<Context3D>(8);
		private _uvBufferContext:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//:Vector.<Context3D> = new Vector.<Context3D>(8);
		private _secondaryUvBufferContext:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//:Vector.<Context3D> = new Vector.<Context3D>(8);
		private _vertexNormalBufferContext:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//:Vector.<Context3D> = new Vector.<Context3D>(8);
		private _vertexTangentBufferContext:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//:Vector.<Context3D> = new Vector.<Context3D>(8);
		
		private _numVertices:number;
		
		/**
		 * Creates a new SubGeometry object.
		 */
		constructor()
		{
            super();
		}
		
		/**
		 * The total amount of vertices in the SubGeometry.
		 */
		public get numVertices():number
		{
			return this._numVertices;
		}
		
		/**
		 * @inheritDoc
		 */
		public activateVertexBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;

			if (!this._vertexBuffer[contextIndex] || this._vertexBufferContext[contextIndex] != context)
            {
                this._vertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 3);
                this._vertexBufferContext[contextIndex] = context;
                this._verticesInvalid[contextIndex] = true;

			}

			if (this._verticesInvalid[contextIndex])
            {
                this._vertexBuffer[contextIndex].uploadFromArray(this._vertexData, 0, this._numVertices);
                this._verticesInvalid[contextIndex] = false;
			}
			
			context.setVertexBufferAt(index, this._vertexBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
        {
            var contextIndex:number = stage3DProxy._iStage3DIndex;
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (this._autoGenerateUVs && this._uvsDirty)
            {
                this._uvs = this.pUpdateDummyUVs(this._uvs);
            }

			
			if (!this._uvBuffer[contextIndex] || this._uvBufferContext[contextIndex] != context)
            {
                this._uvBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 2);
                this._uvBufferContext[contextIndex] = context;
                this._uvsInvalid[contextIndex] = true;
			}

			if (this._uvsInvalid[contextIndex])
            {
                this._uvBuffer[contextIndex].uploadFromArray(this._uvs, 0, this._numVertices);
                this._uvsInvalid[contextIndex] = false;
			}
			
			context.setVertexBufferAt(index, this._uvBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_2);
		}
		
		/**
		 * @inheritDoc
		 */
		public activateSecondaryUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
        {
            var contextIndex:number = stage3DProxy._iStage3DIndex;
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (!this._secondaryUvBuffer[contextIndex] || this._secondaryUvBufferContext[contextIndex] != context)
            {
                this._secondaryUvBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 2);
                this._secondaryUvBufferContext[contextIndex] = context;
                this._secondaryUvsInvalid[contextIndex] = true;
			}

			if (this._secondaryUvsInvalid[contextIndex])
            {
                this._secondaryUvBuffer[contextIndex].uploadFromArray(this._secondaryUvs, 0, this._numVertices);
                this._secondaryUvsInvalid[contextIndex] = false;
			}
			
			context.setVertexBufferAt(index, this._secondaryUvBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_2);
		}
		
		/**
		 * Retrieves the VertexBuffer3D object that contains vertex normals.
		 * @param context The Context3D for which we request the buffer
		 * @return The VertexBuffer3D object that contains vertex normals.
		 */
		public activateVertexNormalBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
        {
            var contextIndex:number = stage3DProxy._iStage3DIndex;
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (this._autoDeriveVertexNormals && this._vertexNormalsDirty)
            {
                this._vertexNormals = this.pUpdateVertexNormals(this._vertexNormals);
            }

			if (!this._vertexNormalBuffer[contextIndex] || this._vertexNormalBufferContext[contextIndex] != context)
            {
                this._vertexNormalBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 3);
                this._vertexNormalBufferContext[contextIndex] = context;
                this._normalsInvalid[contextIndex] = true;
			}

			if (this._normalsInvalid[contextIndex])
            {
                this._vertexNormalBuffer[contextIndex].uploadFromArray(this._vertexNormals, 0, this._numVertices);
                this._normalsInvalid[contextIndex] = false;
			}
			
			context.setVertexBufferAt(index, this._vertexNormalBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
		}
		
		/**
		 * Retrieves the VertexBuffer3D object that contains vertex tangents.
		 * @param context The Context3D for which we request the buffer
		 * @return The VertexBuffer3D object that contains vertex tangents.
		 */
		public activateVertexTangentBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
        {
            var contextIndex:number = stage3DProxy._iStage3DIndex;
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			
			if (this._vertexTangentsDirty)
            {
                this._vertexTangents = this.pUpdateVertexTangents(this._vertexTangents);
            }

			if (!this._vertexTangentBuffer[contextIndex] || this._vertexTangentBufferContext[contextIndex] != context)
            {
                this._vertexTangentBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, 3);
                this._vertexTangentBufferContext[contextIndex] = context;
                this._tangentsInvalid[contextIndex] = true;
			}

			if (this._tangentsInvalid[contextIndex])
            {
                this._vertexTangentBuffer[contextIndex].uploadFromArray( this._vertexTangents, 0, this._numVertices);
                this._tangentsInvalid[contextIndex] = false;
			}

			context.setVertexBufferAt(index, this._vertexTangentBuffer[contextIndex], 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
		}
		
		public applyTransformation(transform:away.geom.Matrix3D)
		{
			super.applyTransformation(transform);
            this.pInvalidateBuffers(this._verticesInvalid);
            this.pInvalidateBuffers(this._normalsInvalid);
            this.pInvalidateBuffers(this._tangentsInvalid);
		}
		
		/**
		 * Clones the current object
		 * @return An exact duplicate of the current object.
		 */
		public clone():away.base.ISubGeometry
		{
			var clone:away.base.SubGeometry = new away.base.SubGeometry();
			    clone.updateVertexData(this._vertexData.concat());
			    clone.updateUVData(this._uvs.concat());
			    clone.updateIndexData(this._indices.concat());

			if (this._secondaryUvs)
            {
                clone.updateSecondaryUVData(this._secondaryUvs.concat());
            }

			if (!this._autoDeriveVertexNormals)
            {
                clone.updateVertexNormalData(this._vertexNormals.concat());
            }

			if (!this._autoDeriveVertexTangents)
            {
                clone.updateVertexTangentData(this._vertexTangents.concat());
            }

			return clone;
		}
		
		/**
		 * @inheritDoc
		 */
		public scale(scale:number)
		{
			super.scale(scale);
            this.pInvalidateBuffers( this._verticesInvalid );
		}
		
		/**
		 * @inheritDoc
		 */
		public scaleUV(scaleU:number = 1, scaleV:number = 1)
		{
			super.scaleUV(scaleU, scaleV);
			this.pInvalidateBuffers(this._uvsInvalid);
		}
		
		/**
		 * Clears all resources used by the SubGeometry object.
		 */
		public dispose()
		{
			super.dispose();
			this.pDisposeAllVertexBuffers();
            this._vertexBuffer = null;
            this._vertexNormalBuffer = null;
            this._uvBuffer = null;
            this._secondaryUvBuffer = null;
            this._vertexTangentBuffer = null;
            this._indexBuffer = null;
            this._uvs = null;
            this._secondaryUvs = null;
            this._vertexNormals = null;
            this._vertexTangents = null;
            this._vertexBufferContext = null;
            this._uvBufferContext = null;
            this._secondaryUvBufferContext = null;
            this._vertexNormalBufferContext = null;
            this._vertexTangentBufferContext = null;
		}
		
		public pDisposeAllVertexBuffers()
		{
            this.pDisposeVertexBuffers(this._vertexBuffer);
            this.pDisposeVertexBuffers(this._vertexNormalBuffer);
            this.pDisposeVertexBuffers(this._uvBuffer);
            this.pDisposeVertexBuffers(this._secondaryUvBuffer);
            this.pDisposeVertexBuffers(this._vertexTangentBuffer);
		}
		
		/**
		 * The raw vertex position data.
		 */
		public get vertexData():number[]
		{
			return this._vertexData;
		}
		
		public get vertexPositionData():number[]
		{
			return this._vertexData;
		}
		
		/**
		 * Updates the vertex data of the SubGeometry.
		 * @param vertices The new vertex data to upload.
		 */
		public updateVertexData(vertices:number[])
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
			this._vertexData = vertices;
			var numVertices:number = vertices.length/3;

			if (numVertices != this._numVertices)
            {
                this.pDisposeAllVertexBuffers();
            }

			this._numVertices = numVertices;
			this.pInvalidateBuffers( this._verticesInvalid );
			this.pInvalidateBounds();//invalidateBounds();
		}
		
		/**
		 * The raw texture coordinate data.
		 */
		public get UVData():number[]
		{
			if (this._uvsDirty && this._autoGenerateUVs)
            {
                this._uvs = this.pUpdateDummyUVs( this._uvs );
            }

			return this._uvs;
		}
		
		public get secondaryUVData():number[]
		{
			return this._secondaryUvs;
		}
		
		/**
		 * Updates the uv coordinates of the SubGeometry.
		 * @param uvs The uv coordinates to upload.
		 */
		public updateUVData(uvs:number[])
		{
			// normals don't get dirty from this
			if (this._autoDeriveVertexTangents)
            {
                this._vertexTangentsDirty = true;
            }

			this._faceTangentsDirty = true;
			this._uvs = uvs;
			this.pInvalidateBuffers( this._uvsInvalid );
		}
		
		public updateSecondaryUVData(uvs:number[])
		{
			this._secondaryUvs = uvs;
            this.pInvalidateBuffers( this._secondaryUvsInvalid );
		}
		
		/**
		 * The raw vertex normal data.
		 */
		public get vertexNormalData():number[]
		{
			if ( this._autoDeriveVertexNormals && this._vertexNormalsDirty)
            {
                this._vertexNormals = this.pUpdateVertexNormals(this._vertexNormals);
            }

			return this._vertexNormals;
		}
		
		/**
		 * Updates the vertex normals of the SubGeometry. When updating the vertex normals like this,
		 * autoDeriveVertexNormals will be set to false and vertex normals will no longer be calculated automatically.
		 * @param vertexNormals The vertex normals to upload.
		 */
		public updateVertexNormalData(vertexNormals:number[])
		{
			this._vertexNormalsDirty = false;
			this._autoDeriveVertexNormals = (vertexNormals == null);
			this._vertexNormals = vertexNormals;
			this.pInvalidateBuffers( this._normalsInvalid );
		}
		
		/**
		 * The raw vertex tangent data.
		 *
		 * @private
		 */
		public get vertexTangentData():number[]
		{
			if (this._autoDeriveVertexTangents && this._vertexTangentsDirty)
            {
                this._vertexTangents = this.pUpdateVertexTangents( this._vertexTangents );
            }

			return this._vertexTangents;
		}
		
		/**
		 * Updates the vertex tangents of the SubGeometry. When updating the vertex tangents like this,
		 * autoDeriveVertexTangents will be set to false and vertex tangents will no longer be calculated automatically.
		 * @param vertexTangents The vertex tangents to upload.
		 */
		public updateVertexTangentData(vertexTangents:number[])
		{
			this._vertexTangentsDirty = false;
			this._autoDeriveVertexTangents = (vertexTangents == null);
			this._vertexTangents = vertexTangents;
            this.pInvalidateBuffers( this._tangentsInvalid );
		}
		
		public fromVectors(vertices:number[], uvs:number[], normals:number[], tangents:number[])
		{
			this.updateVertexData(vertices);
			this.updateUVData(uvs);
			this.updateVertexNormalData(normals);
			this.updateVertexTangentData(tangents);
		}
		
		public pUpdateVertexNormals(target:number[]):number[]
		{
			this.pInvalidateBuffers( this._normalsInvalid );
			return super.pUpdateVertexNormals(target);

		}
		
		public pUpdateVertexTangents(target:number[]):number[]
		{
			if (this._vertexNormalsDirty)
            {
                this._vertexNormals = this.pUpdateVertexNormals( this._vertexNormals);
            }

			this.pInvalidateBuffers(this._tangentsInvalid);
			return super.pUpdateVertexTangents(target);
		}
		
		public pUpdateDummyUVs(target:number[]):number[]
		{
			this.pInvalidateBuffers(this._uvsInvalid);
			return super.pUpdateDummyUVs( target );
		}
		
		public pDisposeForStage3D(stage3DProxy:away.managers.Stage3DProxy)
		{
			var index:number = stage3DProxy._iStage3DIndex;
			if (this._vertexBuffer[index])
            {
                this._vertexBuffer[index].dispose();
                this._vertexBuffer[index] = null;
			}
			if (this._uvBuffer[index])
            {
                this._uvBuffer[index].dispose();
                this._uvBuffer[index] = null;
			}
			if (this._secondaryUvBuffer[index])
            {
                this._secondaryUvBuffer[index].dispose();
                this._secondaryUvBuffer[index] = null;
			}
			if (this._vertexNormalBuffer[index])
            {
                this._vertexNormalBuffer[index].dispose();
                this._vertexNormalBuffer[index] = null;
			}
			if (this._vertexTangentBuffer[index])
            {
                this._vertexTangentBuffer[index].dispose();
                this._vertexTangentBuffer[index] = null;
			}
			if (this._indexBuffer[index])
            {
                this._indexBuffer[index].dispose();
                this._indexBuffer[index] = null;
			}
		}
		
		public get vertexStride():number
		{
			return 3;
		}
		
		public get vertexTangentStride():number
		{
			return 3;
		}
		
		public get vertexNormalStride():number
		{
			return 3;
		}
		
		public get UVStride():number
		{
			return 2;
		}
		
		public get secondaryUVStride():number
		{
			return 2;
		}
		
		public get vertexOffset():number
		{
			return 0;
		}
		
		public get vertexNormalOffset():number
		{
			return 0;
		}
		
		public get vertexTangentOffset():number
		{
			return 0;
		}
		
		public get UVOffset():number
		{
			return 0;
		}
		
		public get secondaryUVOffset():number
		{
			return 0;
		}
		
		public cloneWithSeperateBuffers():away.base.SubGeometry
		{
            var obj : any = this.clone();
			return <away.base.SubGeometry> obj;
		}
	}
}
