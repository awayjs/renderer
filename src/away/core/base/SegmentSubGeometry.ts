///<reference path="../../_definitions.ts"/>

/**
 * @module away.base
 */
module away.base
{
	/**
	 * The SubGeometry class is a collections of geometric data that describes a triangle mesh. It is owned by a
	 * Geometry instance, and wrapped by a SubMesh in the scene graph.
	 * Several SubGeometries are grouped so they can be rendered with different materials, but still represent a single
	 * object.
	 *
	 * @see away.base.Geometry
	 * @see away.base.SubMesh
	 *
	 * @class away.base.SubGeometry
	 */
	export class SegmentSubGeometry extends SubGeometryBase implements ISubGeometry
	{
		private _activeSubSet:SubSet;

		// raw data:
		private _verticesInvalid:boolean[] = new Array<boolean>(8);
		// buffers:
		private _vertexBuffer:away.gl.VertexBuffer[] = new Array<away.gl.VertexBuffer>(8);

		// buffer dirty flags, per context:
		private _vertexBufferContext:away.gl.ContextGL[] = new Array<away.gl.ContextGL>(8);

		private _numVertices:number;

		private LIMIT:number = 3*0xFFFF;
		private _subSets:SubSet[];
		private _subSetCount:number;
		public _pSegments:Object; //Dictionary
		private _indexSegments:number = 0;
		private _hasData:boolean;

		public get hasData():boolean
		{
			return this._hasData;
		}

		public get numTriangles():number
		{
			return this._numIndices/3;
		}

		/**
		 *
		 */
		public get segmentCount():number
		{
			return this._indexSegments;
		}

		/**
		 *
		 */
		public get iSubSetCount():number
		{
			return this._subSetCount;
		}

		/**
		 * Creates a new SubGeometry object.
		 */
		constructor()
		{
			super();

			this._subSetCount = 0;
			this._subSets = [];
			this.addSubSet();

			this._pSegments = new Object();
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
		public activateVertexBuffer(index:number, stageGL:away.base.StageGL)
		{
			var subSet:SubSet = this._subSets[index];

			this._activeSubSet = subSet;
			this._numIndices = subSet.numIndices;

			var vertexBuffer:away.gl.VertexBuffer = subSet.vertexBuffer;

			if (subSet.vertexContextGL != stageGL.contextGL || subSet.vertexBufferDirty) {
				subSet.vertexBuffer = stageGL.contextGL.createVertexBuffer(subSet.numVertices, 11);
				subSet.vertexBuffer.uploadFromArray(subSet.vertices, 0, subSet.numVertices);
				subSet.vertexBufferDirty = false;
				subSet.vertexContextGL = stageGL.contextGL;
			}

			var context3d:away.gl.ContextGL = stageGL.contextGL;
			context3d.setVertexBufferAt(0, vertexBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3);
			context3d.setVertexBufferAt(1, vertexBuffer, 3, away.gl.ContextGLVertexBufferFormat.FLOAT_3);
			context3d.setVertexBufferAt(2, vertexBuffer, 6, away.gl.ContextGLVertexBufferFormat.FLOAT_1);
			context3d.setVertexBufferAt(3, vertexBuffer, 7, away.gl.ContextGLVertexBufferFormat.FLOAT_4);
		}

		/**
		 * @inheritDoc
		 */
		public activateUVBuffer(index:number, stageGL:away.base.StageGL)
		{

		}

		/**
		 * @inheritDoc
		 */
		public activateSecondaryUVBuffer(index:number, stageGL:away.base.StageGL)
		{

		}

		/**
		 * Retrieves the VertexBuffer object that contains vertex normals.
		 * @param context The ContextGL for which we request the buffer
		 * @return The VertexBuffer object that contains vertex normals.
		 */
		public activateVertexNormalBuffer(index:number, stageGL:away.base.StageGL)
		{

		}

		/**
		 * Retrieves the VertexBuffer object that contains vertex tangents.
		 * @param context The ContextGL for which we request the buffer
		 * @return The VertexBuffer object that contains vertex tangents.
		 */
		public activateVertexTangentBuffer(index:number, stageGL:away.base.StageGL)
		{

		}

		public getIndexBuffer(stageGL:away.base.StageGL):away.gl.IndexBuffer
		{
			if (this._activeSubSet.indexContextGL != stageGL.contextGL || this._activeSubSet.indexBufferDirty) {
				this._activeSubSet.indexBuffer = stageGL.contextGL.createIndexBuffer(this._activeSubSet.numIndices);
				this._activeSubSet.indexBuffer.uploadFromArray(this._activeSubSet.indices, 0, this._activeSubSet.numIndices);
				this._activeSubSet.indexBufferDirty = false;
				this._activeSubSet.indexContextGL = stageGL.contextGL;
			}

			return this._activeSubSet.indexBuffer;
		}

		public applyTransformation(transform:away.geom.Matrix3D)
		{
			super.applyTransformation(transform);
			this.pInvalidateBuffers(this._verticesInvalid);
		}

		/**
		 * Clones the current object
		 * @return An exact duplicate of the current object.
		 */
		public clone():ISubGeometry
		{
			var clone:SegmentSubGeometry = new SegmentSubGeometry();
			clone.updateVertexData(this._vertexData.concat());
			clone.updateIndexData(this._indices.concat());

			return clone;
		}

		/**
		 * @inheritDoc
		 */
		public scale(scale:number)
		{
			super.scale(scale);
			this.pInvalidateBuffers(this._verticesInvalid);
		}

		/**
		 * Clears all resources used by the SubGeometry object.
		 */
		public dispose()
		{
			super.dispose();
			this.pDisposeAllVertexBuffers();
			this._vertexBuffer = null;
			this._indexBuffer = null;
			this._vertexBufferContext = null;

			this.removeAllSegments();

			this._pSegments = null

			var subSet:SubSet = this._subSets[0];
			subSet.vertices = null;
			subSet.indices = null;
			this._subSets = null;
		}

		public pDisposeAllVertexBuffers()
		{
			this.pDisposeVertexBuffers(this._vertexBuffer);
		}

		/**
		 * The raw vertex position data.
		 */
		public get vertexData():Array<number>
		{
			return this._vertexData;
		}

		public get vertexPositionData():Array<number>
		{
			return this._vertexData;
		}

		/**
		 * Updates the vertex data of the SubGeometry.
		 * @param vertices The new vertex data to upload.
		 */
		public updateVertexData(vertices:Array<number>)
		{
			if (this._autoDeriveVertexNormals) {
				this._vertexNormalsDirty = true;
			}

			if (this._autoDeriveVertexTangents) {
				this._vertexTangentsDirty = true;
			}

			this._faceNormalsDirty = true;
			this._vertexData = vertices;
			var numVertices:number = vertices.length/3;

			if (numVertices != this._numVertices) {
				this.pDisposeAllVertexBuffers();
			}

			this._numVertices = numVertices;
			this.pInvalidateBuffers(this._verticesInvalid);
			this.pInvalidateBounds();//invalidateBounds();
		}

		public fromVectors(vertices:Array<number>, uvs:Array<number>, normals:Array<number>, tangents:Array<number>)
		{
			this.updateVertexData(vertices);
		}

		public pDisposeForStageGL(stageGL:away.base.StageGL)
		{
			var index:number = stageGL._iStageGLIndex;
			if (this._vertexBuffer[index]) {
				this._vertexBuffer[index].dispose();
				this._vertexBuffer[index] = null;
			}
			if (this._indexBuffer[index]) {
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

		public cloneWithSeperateBuffers():SubGeometry
		{
			var obj:any = this.clone();
			return <SubGeometry> obj;
		}

		/**
		 * //TODO
		 *
		 * @param segment
		 */
		public addSegment(segment:away.base.Segment)
		{
			segment.iSegmentsBase = this;

			this._hasData = true;

			var subSetIndex:number = this._subSets.length - 1;
			var subSet:SubSet = this._subSets[subSetIndex];

			if (subSet.vertices.length + 44 > this.LIMIT) {
				subSet = this.addSubSet();
				subSetIndex++;
			}

			segment.iIndex = subSet.vertices.length;
			segment.iSubSetIndex = subSetIndex;

			this.iUpdateSegment(segment);

			var index:number = subSet.lineCount << 2;

			subSet.indices.push(index, index + 1, index + 2, index + 3, index + 2, index + 1);
			subSet.numVertices = subSet.vertices.length/11;
			subSet.numIndices = subSet.indices.length;
			subSet.lineCount++;

			var segRef:SegRef = new SegRef();
			segRef.index = index;
			segRef.subSetIndex = subSetIndex;
			segRef.segment = segment;

			this._pSegments[this._indexSegments] = segRef;

			this._indexSegments++;
		}

		/**
		 * //TODO
		 *
		 * @param index
		 * @returns {*}
		 */
		public getSegment(index:number):away.base.Segment
		{
			if (index > this._indexSegments - 1)
				return null;

			return this._pSegments[index].segment;
		}

		/**
		 * //TODO
		 *
		 * @param index
		 * @param dispose
		 */
		public removeSegmentByIndex(index:number, dispose:boolean = false)
		{
			var segRef:SegRef;
			if (index >= this._indexSegments)
				return;

			if (this._pSegments[index])
				segRef = this._pSegments[index];
			else
				return;

			var subSet:SubSet;
			if (!this._subSets[segRef.subSetIndex])
				return;

			var subSetIndex:number = segRef.subSetIndex;
			subSet = this._subSets[segRef.subSetIndex];

			var segment:away.base.Segment = segRef.segment;
			var indices:Array<number> = subSet.indices;

			var ind:number = index*6;
			for (var i:number = ind; i < indices.length; ++i) {
				indices[i] -= 4;
			}
			subSet.indices.splice(index*6, 6);
			subSet.vertices.splice(index*44, 44);
			subSet.numVertices = subSet.vertices.length/11;
			subSet.numIndices = indices.length;
			subSet.vertexBufferDirty = true;
			subSet.indexBufferDirty = true;
			subSet.lineCount--;

			if (dispose) {
				segment.dispose();
				segment = null;
			} else {
				segment.iIndex = -1;
				segment.iSegmentsBase = null;
			}

			if (subSet.lineCount == 0) {

				if (subSetIndex == 0) {
					this._hasData = false;
				} else {
					subSet.dispose();
					this._subSets[subSetIndex] = null;
					this._subSets.splice(subSetIndex, 1);
				}
			}

			this.reOrderIndices(subSetIndex, index);

			segRef = null;
			this._pSegments[this._indexSegments] = null;
			this._indexSegments--;
		}


		/**
		 * //TODO
		 */
		public removeAllSegments()
		{
			var subSet:SubSet;
			for (var i:number = 0; i < this._subSetCount; ++i) {
				subSet = this._subSets[i];
				subSet.vertices = null;
				subSet.indices = null;
				if (subSet.vertexBuffer)
					subSet.vertexBuffer.dispose();

				if (subSet.indexBuffer)
					subSet.indexBuffer.dispose();

				subSet = null;
			}

			for (var segRef in this._pSegments)
				segRef = null;

			this._pSegments = null; //WHY?
			this._subSetCount = 0;
			this._activeSubSet = null;
			this._indexSegments = 0;
			this._subSets = [];
			this._pSegments = new Object();

			this.addSubSet();

			this._hasData = false;
		}

		/**
		 * //TODO
		 *
		 * @param segment
		 * @param dispose
		 */
		public removeSegment(segment:away.base.Segment, dispose:boolean = false)
		{
			if (segment.iIndex == -1)
				return;

			this.removeSegmentByIndex(segment.iIndex/44);
		}


		/**
		 * //TODO
		 *
		 * @protected
		 */
		public updateBounds(bounds:away.bounds.BoundingVolumeBase)
		{
			var subSet:SubSet;
			var len:number;
			var v:number;
			var index:number;

			var minX:number = Infinity;
			var minY:number = Infinity;
			var minZ:number = Infinity;
			var maxX:number = -Infinity;
			var maxY:number = -Infinity;
			var maxZ:number = -Infinity;
			var vertices:Array<number>;

			for (var i:number = 0; i < this._subSetCount; ++i) {
				subSet = this._subSets[i];
				index = 0;
				vertices = subSet.vertices;
				len = vertices.length;

				if (len == 0)
					continue;

				while (index < len) {
					v = vertices[index++];
					if (v < minX)
						minX = v; else if (v > maxX)
						maxX = v;

					v = vertices[index++];
					if (v < minY)
						minY = v; else if (v > maxY)
						maxY = v;

					v = vertices[index++];
					if (v < minZ)
						minZ = v; else if (v > maxZ)
						maxZ = v;

					index += 8;
				}
			}

			if (minX != Infinity) {
				bounds.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
			} else {
				var min:number = .5;
				bounds.fromExtremes(-min, -min, -min, min, min, min);
			}
		}

		public _iSetColor(color:number)
		{
			for (var segRef in this._pSegments)
				segRef.segment.startColor = segRef.segment.endColor = color;
		}

		public _iSetThickness(thickness:number)
		{
			for (var segRef in this._pSegments)
				segRef.segment.thickness = segRef.segment.thickness = thickness;
		}

		/**
		 * //TODO
		 *
		 * @param segment
		 *
		 * @internal
		 */
		public iUpdateSegment(segment:away.base.Segment)
		{
			var start:away.geom.Vector3D = segment._pStart;
			var end:away.geom.Vector3D = segment._pEnd;
			var startX:number = start.x, startY:number = start.y, startZ:number = start.z;
			var endX:number = end.x, endY:number = end.y, endZ:number = end.z;
			var startR:number = segment._pStartR, startG:number = segment._pStartG, startB:number = segment._pStartB;
			var endR:number = segment._pEndR, endG:number = segment._pEndG, endB:number = segment._pEndB;
			var index:number = segment.iIndex;
			var t:number = segment.thickness;

			var subSet:SubSet = this._subSets[segment.iSubSetIndex];
			var vertices:Array<number> = subSet.vertices;

			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = t;
			vertices[index++] = startR;
			vertices[index++] = startG;
			vertices[index++] = startB;
			vertices[index++] = 1;

			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = -t;
			vertices[index++] = endR;
			vertices[index++] = endG;
			vertices[index++] = endB;
			vertices[index++] = 1;

			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = -t;
			vertices[index++] = startR;
			vertices[index++] = startG;
			vertices[index++] = startB;
			vertices[index++] = 1;

			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = t;
			vertices[index++] = endR;
			vertices[index++] = endG;
			vertices[index++] = endB;
			vertices[index++] = 1;

			subSet.vertexBufferDirty = true;
		}

		/**
		 * //TODO
		 * @returns {SubSet}
		 *
		 * @private
		 */
		private addSubSet():SubSet
		{
			var subSet:SubSet = new SubSet();
			this._subSets.push(subSet);

			subSet.vertices = [];
			subSet.numVertices = 0;
			subSet.indices = [];
			subSet.numIndices = 0;
			subSet.vertexBufferDirty = true;
			subSet.indexBufferDirty = true;
			subSet.lineCount = 0;

			this._subSetCount++;

			return subSet;
		}

		/**
		 * //TODO
		 * @param subSetIndex
		 * @param index
		 *
		 * @private
		 */
		private reOrderIndices(subSetIndex:number, index:number)
		{
			var segRef:SegRef;

			for (var i:number = index; i < this._indexSegments - 1; ++i) {
				segRef = this._pSegments[i + 1];
				segRef.index = i;
				if (segRef.subSetIndex == subSetIndex)
					segRef.segment.iIndex -= 44;

				this._pSegments[i] = segRef;
			}
		}
	}


	class SegRef
	{
		public index:number;
		public subSetIndex:number;
		public segment:away.base.Segment;
	}

	class SubSet
	{
		public vertices:Array<number>;
		public numVertices:number;

		public indices:Array<number>;
		public numIndices:number;

		public vertexBufferDirty:boolean;
		public indexBufferDirty:boolean;

		public vertexContextGL:away.gl.ContextGL;
		public indexContextGL:away.gl.ContextGL;

		public vertexBuffer:away.gl.VertexBuffer;
		public indexBuffer:away.gl.IndexBuffer;
		public lineCount:number;

		public dispose()
		{
			this.vertices = null;
			if (this.vertexBuffer)
				this.vertexBuffer.dispose();

			if (this.indexBuffer)
				this.indexBuffer.dispose();
		}
	}
}
