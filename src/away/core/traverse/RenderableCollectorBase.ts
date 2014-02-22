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

		public _iEntryPoint:away.geom.Vector3D;

		public _pSkybox:away.pool.RenderableBase;
		public _pEntityHead:away.pool.EntityListItem;
		public _pEntityListItemPool:away.pool.EntityListItemPool;
		public _pBillboardRenderablePool:away.pool.BillboardRenderablePool;
		public _pSegmentSetRenderablePool:away.pool.SegmentSetRenderablePool;
		public _pSkyboxRenderablePool:away.pool.SkyboxRenderablePool;
		public _pSubMeshRenderablePool:away.pool.SubMeshRenderablePool;
		public _pCamera:away.entities.Camera;
		public _pCameraForward:away.geom.Vector3D;
		private _customCullPlanes:away.geom.Plane3D[];
		private _cullPlanes:away.geom.Plane3D[];
		private _numCullPlanes:number = 0;

		/**
		 *
		 */
		public renderableSorter:away.sort.IEntitySorter;

		constructor()
		{
			this._pEntityListItemPool = new away.pool.EntityListItemPool();
			this._pBillboardRenderablePool = new away.pool.BillboardRenderablePool();
			this._pSegmentSetRenderablePool = new away.pool.SegmentSetRenderablePool();
			this._pSkyboxRenderablePool = new away.pool.SkyboxRenderablePool();
			this._pSubMeshRenderablePool = new away.pool.SubMeshRenderablePool();

			//default sorting algorithm
			this.renderableSorter = new away.sort.RenderableMergeSort();
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
			this._iEntryPoint = this._pCamera.scenePosition;
			this._pCameraForward = this._pCamera.transform.forwardVector;
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

		public get entryPoint():away.geom.Vector3D
		{
			return this._iEntryPoint;
		}

		/**
		 *
		 */
		public clear()
		{
			this._iEntryPoint = this._pCamera.scenePosition;
			this._pCameraForward = this._pCamera.transform.forwardVector;
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

			this.pFindRenderable(entity);
		}

		public sortRenderables()
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 *
		 * @param billboard
		 * @protected
		 */
		public pApplyBillboard(billboard:away.entities.Billboard)
		{
			this.pApplyRenderable(this._pBillboardRenderablePool.getItem(billboard));
		}


		/**
		 *
		 * @param mesh
		 * @protected
		 */
		public pApplyMesh(mesh:away.entities.Mesh)
		{
			var subMesh:away.base.SubMesh;
			var renderable:away.pool.SubMeshRenderable;

			var len:number /*uint*/ = mesh.subMeshes.length;
			for (var i:number /*uint*/ = 0; i < len; i++)
				this.pApplyRenderable(this._pSubMeshRenderablePool.getItem(mesh.subMeshes[i]));
		}

		/**
		 *
		 * @param renderable
		 * @protected
		 */
		public pApplyRenderable(renderable:away.pool.RenderableBase)
		{
			throw new away.errors.AbstractMethodError();
		}

		public pApplySkybox(skybox:away.entities.Skybox)
		{
			this.pApplyRenderable(this._pSkyboxRenderablePool.getItem(skybox));
		}


		public pApplySegmentSet(segmentSet:away.entities.SegmentSet)
		{
			this.pApplyRenderable(this._pSegmentSetRenderablePool.getItem(segmentSet));
		}

		/**
		 *
		 * @param entity
		 */
		public pFindRenderable(entity:away.entities.IEntity)
		{
			throw new away.errors.AbstractMethodError();
		}


		/**
		 * //TODO
		 *
		 * @param entity
		 * @param shortestCollisionDistance
		 * @param findClosest
		 * @returns {boolean}
		 *
		 * @internal
		 */
		public _iCollidesBefore(entity:away.entities.IEntity, shortestCollisionDistance:number, findClosest:boolean):boolean
		{
			var pickingCollider:away.pick.PickingColliderBase = <away.pick.PickingColliderBase> entity.pickingCollider;
			var pickingCollisionVO:away.pick.PickingCollisionVO = entity._iPickingCollisionVO;

			pickingCollider.setLocalRay(entity._iPickingCollisionVO.localRayPosition, entity._iPickingCollisionVO.localRayDirection);
			pickingCollisionVO.materialOwner = null;

			if (entity.assetType === away.library.AssetType.BILLBOARD) {
				return this.testBillBoard(<away.entities.Billboard> entity, pickingCollider, pickingCollisionVO, shortestCollisionDistance, findClosest);
			} else if (entity.assetType === away.library.AssetType.MESH) {
				return this.testMesh(<away.entities.Mesh> entity, pickingCollider, pickingCollisionVO, shortestCollisionDistance, findClosest);
			}

			return false;
		}

		private testBillBoard(billboard:away.entities.Billboard, pickingCollider:away.pick.PickingColliderBase, pickingCollisionVO:away.pick.PickingCollisionVO, shortestCollisionDistance:number, findClosest:boolean):boolean
		{
			if (pickingCollider.testRenderableCollision(this._pBillboardRenderablePool.getItem(billboard), pickingCollisionVO, shortestCollisionDistance)) {
				shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;

				pickingCollisionVO.materialOwner = billboard;

				return true;
			}

			return false;
		}

		public testMesh(mesh:away.entities.Mesh, pickingCollider:away.pick.PickingColliderBase, pickingCollisionVO:away.pick.PickingCollisionVO, shortestCollisionDistance:number, findClosest:boolean):boolean
		{
			var subMesh:away.base.SubMesh;
			var renderable:away.pool.RenderableBase;

			var len:number = mesh.subMeshes.length;
			for (var i:number = 0; i < len; ++i) {
				subMesh = mesh.subMeshes[i];
				renderable = this._pSubMeshRenderablePool.getItem(subMesh);


				if (pickingCollider.testRenderableCollision(renderable, pickingCollisionVO, shortestCollisionDistance)) {
					shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;

					pickingCollisionVO.materialOwner = subMesh;

					if (!findClosest)
						return true;
				}
			}

			return pickingCollisionVO.materialOwner != null;
		}
	}
}