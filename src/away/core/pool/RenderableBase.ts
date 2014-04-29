///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	import SubGeometryEvent				= away.events.SubGeometryEvent;

	/**
	 * @class away.pool.RenderableListItem
	 */
	export class RenderableBase implements IRenderable
	{
		private _onIndicesUpdatedDelegate:(event:SubGeometryEvent) => void;
		private _onVerticesUpdatedDelegate:(event:SubGeometryEvent) => void;

		private _subGeometry:away.base.SubGeometryBase;
		private _geometryDirty:boolean = true;
		private _indexData:away.gl.IndexData;
		private _indexDataDirty:boolean;
		private _vertexData:Object = new Object();
		public _pVertexDataDirty:Object = new Object();
		private _vertexOffset:Object = new Object();

		private _level:number;
		private _indexOffset:number;
		private _overflow:RenderableBase;
		private _numTriangles:number;
		private _concatenateArrays:boolean;


		public JOINT_INDEX_FORMAT:string;
		public JOINT_WEIGHT_FORMAT:string;

		/**
		 *
		 */
		public _pool:RenderablePool;

		/**
		 *
		 */
		public get overflow():RenderableBase
		{
			if (this._geometryDirty)
				this._updateGeometry();

			return this._overflow;
		}

		/**
		 *
		 */
		public get numTriangles():number
		{
			return this._numTriangles;
		}

		/**
		 *
		 */
		public next:RenderableBase;

		/**
		 *
		 */
		public materialId:number;

		/**
		 *
		 */
		public renderOrderId:number;

		/**
		 *
		 */
		public zIndex:number;

		/**
		 *
		 */
		public cascaded:boolean;

		/**
		 *
		 */
		public renderSceneTransform:away.geom.Matrix3D;

		/**
		 *
		 */
		public sourceEntity:away.entities.IEntity;

		/**
		 *
		 */
		public materialOwner:away.base.IMaterialOwner;

		/**
		 *
		 */
		public material:away.materials.MaterialBase;

		/**
		 *
		 */
		public getIndexData():away.gl.IndexData
		{
			if (this._indexDataDirty)
				this._updateIndexData();

			return this._indexData;
		}

		/**
		 *
		 */
		public getVertexData(dataType:string):away.gl.VertexData
		{
			if (this._pVertexDataDirty[dataType])
				this._updateVertexData(dataType);

			return this._vertexData[this._concatenateArrays? away.base.TriangleSubGeometry.VERTEX_DATA : dataType]
		}

		/**
		 *
		 */
		public getVertexOffset(dataType:string):number
		{
			if (this._pVertexDataDirty[dataType])
				this._updateVertexData(dataType);

			return this._vertexOffset[dataType];
		}

		/**
		 *
		 * @param sourceEntity
		 * @param materialOwner
		 * @param subGeometry
		 * @param animationSubGeometry
		 */
		constructor(pool:RenderablePool, sourceEntity:away.entities.IEntity, materialOwner:away.base.IMaterialOwner, level:number = 0, indexOffset:number = 0)
		{
			this._onIndicesUpdatedDelegate = (event:SubGeometryEvent) => this._onIndicesUpdated(event);
			this._onVerticesUpdatedDelegate = (event:SubGeometryEvent) => this._onVerticesUpdated(event);

			//store a reference to the pool for later disposal
			this._pool = pool;
			
			//reference to level of overflow
			this._level = level;

			//reference to the offset on indices (if this is an overflow renderable)
			this._indexOffset = indexOffset;

			this.sourceEntity = sourceEntity;
			this.materialOwner = materialOwner;
		}

		public dispose()
		{
			this._pool.disposeItem(this.materialOwner);

			this._indexData.dispose();
			this._indexData = null;

			for (var dataType in this._vertexData) {
				(<away.gl.VertexData> this._vertexData[dataType]).dispose();
				this._vertexData[dataType] = null;
			}

			if (this._overflow) {
				this._overflow.dispose();
				this._overflow = null;
			}
		}

		public invalidateGeometry()
		{
			this._geometryDirty = true;

			if (this._overflow)
				this._overflow.invalidateGeometry();
		}

		/**
		 *
		 */
		public invalidateIndexData()
		{
			this._indexDataDirty = true;

			if (this._overflow)
				this._overflow.invalidateIndexData();

			if (this._indexData)
				this._indexData.invalidateData();
		}

		/**
		 * //TODO
		 *
		 * @param dataType
		 */
		public invalidateVertexData(dataType:string)
		{
			this._pVertexDataDirty[dataType] = true;

			if (this._overflow)
				this._overflow.invalidateVertexData(dataType);

			if (this._concatenateArrays)
				dataType = away.base.TriangleSubGeometry.VERTEX_DATA;

			if (this._vertexData[dataType])
				(<away.gl.VertexData> this._vertexData[dataType]).invalidateData();
		}

		public _pGetSubGeometry():away.base.SubGeometryBase
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * //TODO
		 *
		 * @param subGeometry
		 * @param offset
		 * @internal
		 */
		public _iFillIndexData(subGeometry:away.base.SubGeometryBase, indexOffset:number)
		{
			this._constructIndices(subGeometry, indexOffset);

			indexOffset = this._indexData.offset;

			//check if there is more to split
			if (indexOffset < subGeometry.indices.length) {
				if (!this._overflow)
					this._overflow = this._pGetOverflowRenderable(this._pool, this.materialOwner, indexOffset, this._level + 1);
				else
					this._overflow._iFillIndexData(subGeometry, indexOffset);
			} else if (this._overflow) {
				this._overflow.dispose();
				this._overflow = null;
			}
		}

		/**
		 * //TODO
		 *
		 * @param subGeometry
		 * @param dataType
		 * @internal
		 */
		public _iFillVertexData(subGeometry:away.base.SubGeometryBase, dataType:string)
		{
			this._vertexOffset[dataType] = subGeometry.getOffset(dataType);

			this._constructVertices(subGeometry, this._concatenateArrays? away.base.TriangleSubGeometry.VERTEX_DATA : dataType, this.getIndexData().originalIndices, this.getIndexData().indexMappings);

			if (this._overflow)
				this._overflow._iFillVertexData(subGeometry, dataType);
		}

		public _pGetOverflowRenderable(pool:RenderablePool, materialOwner:away.base.IMaterialOwner, level:number, indexOffset:number):RenderableBase
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * //TODO
		 *
		 * @param subGeometry
		 * @param offset
		 * @private
		 */
		private _constructIndices(subGeometry:away.base.SubGeometryBase, offset:number)
		{
			if (!this._indexData)
				this._indexData = away.gl.IndexDataPool.getItem(subGeometry.id, this._level);

			this._indexData.updateData(offset, subGeometry.indices, subGeometry.numVertices);

			this._numTriangles = this._indexData.data.length/3;
		}

		/**
		 * //TODO
		 *
		 * @param subGeometry
		 * @param dataType
		 * @param originalIndices
		 * @param indexMappings
		 * @private
		 */
		private _constructVertices(subGeometry:away.base.SubGeometryBase, dataType:string, originalIndices:Array<number> = null, indexMappings:Array<number> = null)
		{
			if (!this._vertexData[dataType])
				this._vertexData[dataType] = away.gl.VertexDataPool.getItem(subGeometry.id, this._level, dataType);

			this._vertexData[dataType].updateData(subGeometry[dataType], subGeometry.getStride(dataType), originalIndices, indexMappings);
		}

		/**
		 * //TODO
		 *
		 * @private
		 */
		private _updateGeometry()
		{
			if (this._subGeometry && this._level == 0) {
				this._subGeometry.removeEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
				this._subGeometry.removeEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
			}

			this._subGeometry = this._pGetSubGeometry();

			this._concatenateArrays = this._subGeometry.concatenateArrays;
			
			if (this._subGeometry && this._level == 0) {
				this._subGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
				this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
			}

			//dispose
			if (this._indexData) {
				this._indexData.dispose();
				this._indexData = null;
			}

			for (var dataType in this._vertexData) {
				(<away.gl.VertexData> this._vertexData[dataType]).dispose();
				this._vertexData[dataType] = null;
			}

			this._geometryDirty = false;

			//invalidate indices
			this._indexDataDirty = true;

			//specific vertex data types have to be invalidated in the specific renderable
		}

		/**
		 * //TODO
		 *
		 * @private
		 */
		private _updateIndexData()
		{
			this._iFillIndexData(this._subGeometry, this._indexOffset);

			this._indexDataDirty = false;
		}

		/**
		 * //TODO
		 *
		 * @param dataType
		 * @private
		 */
		private _updateVertexData(dataType:string)
		{
			this._iFillVertexData(this._subGeometry, dataType);

			this._pVertexDataDirty[dataType] = false;
		}

		/**
		 * //TODO
		 *
		 * @param event
		 * @private
		 */
		private _onIndicesUpdated(event:SubGeometryEvent)
		{
			this.invalidateIndexData();
		}

		/**
		 * //TODO
		 *
		 * @param event
		 * @private
		 */
		private _onVerticesUpdated(event:SubGeometryEvent)
		{
			this._concatenateArrays = (<away.base.SubGeometryBase> event.target).concatenateArrays;

			this.invalidateVertexData(event.dataType);
		}
	}
}