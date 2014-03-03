///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{
	/**
	 * @class away.traverse.EntityCollector
	 */
	export class RenderableCollectorBase implements ICollector
	{
		public scene:away.containers.Scene;

		public _pSkybox:away.pool.RenderableBase;
		public _pEntityHead:away.pool.EntityListItem;
		public _pEntityListItemPool:away.pool.EntityListItemPool;
		public _pCamera:away.entities.Camera;
		private _customCullPlanes:away.geom.Plane3D[];
		private _cullPlanes:away.geom.Plane3D[];
		private _numCullPlanes:number = 0;

		constructor()
		{
			this._pEntityListItemPool = new away.pool.EntityListItemPool();
		}

		/**
		 *
		 */
		public get camera():away.entities.Camera
		{
			return this._pCamera;
		}

		public set camera(value:away.entities.Camera)
		{
			this._pCamera = value;
			this._cullPlanes = this._pCamera.frustumPlanes;
		}

		/**
		 *
		 */
		public get cullPlanes():away.geom.Plane3D[]
		{
			return this._customCullPlanes;
		}

		public set cullPlanes(value:away.geom.Plane3D[])
		{
			this._customCullPlanes = value;
		}

		/**
		 *
		 */
		public get entityHead():away.pool.EntityListItem
		{
			return this._pEntityHead;
		}

		/**
		 *
		 */
		public clear()
		{
			this._cullPlanes = this._customCullPlanes? this._customCullPlanes : ( this._pCamera? this._pCamera.frustumPlanes : null );
			this._numCullPlanes = this._cullPlanes? this._cullPlanes.length : 0;
			this._pEntityHead = null;
			this._pEntityListItemPool.freeAll();
		}

		/**
		 *
		 * @param node
		 * @returns {boolean}
		 */
		public enterNode(node:away.partition.NodeBase):boolean
		{
			var enter:boolean = this.scene._iCollectionMark != node._iCollectionMark && node.isInFrustum(this._cullPlanes, this._numCullPlanes);

			node._iCollectionMark = this.scene._iCollectionMark;

			return enter;
		}

		/**
		 *
		 * @param entity
		 */
		public applyEntity(entity:away.entities.IEntity)
		{
			var item:away.pool.EntityListItem = this._pEntityListItemPool.getItem();
			item.entity = entity;

			item.next = this._pEntityHead;
			this._pEntityHead = item;
		}
	}
}