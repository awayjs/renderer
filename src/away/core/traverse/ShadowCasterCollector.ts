///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{
	/**
	 * @class away.traverse.ShadowCasterCollector
	 */
	export class ShadowCasterCollector extends EntityCollector
	{
		constructor()
		{
			super();
		}

		/**
		 *
		 */
		public enterNode(node:away.partition.NodeBase):boolean
		{
			var enter:boolean = this.scene._iCollectionMark != node._iCollectionMark && node.isCastingShadow();

			if (!enter) {
				node._iCollectionMark = this.scene._iCollectionMark

				return false;
			}

			return super.enterNode(node);
		}
		public pApplyRenderable(renderable:away.pool.RenderableBase)
		{
			var material:away.materials.MaterialBase = <away.materials.MaterialBase> renderable.materialOwner.material;
			var entity:away.entities.IEntity = renderable.sourceEntity;
			var position:away.geom.Vector3D = entity.scenePosition;

			if (material) {
				//set ids for faster referencing
				renderable.materialId = material._iMaterialId;
				renderable.renderOrderId = material._iRenderOrderId;
				renderable.cascaded = false;

				// project onto camera's z-axis
				position = this._iEntryPoint.subtract(position);
				renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);

				//store reference to scene transform
				renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);

				if (material.requiresBlending) {
					renderable.next = this._pBlendedRenderableHead;
					this._pBlendedRenderableHead = renderable;
				} else {
					renderable.next = this._pOpaqueRenderableHead;
					this._pOpaqueRenderableHead = renderable;
				}
			}

			this._pNumTriangles += renderable.subGeometry.numTriangles;
		}

		/**
		 *
		 * @param entity
		 */
		public pFindRenderable(entity:away.entities.IEntity)
		{
			if (entity.assetType == away.library.AssetType.BILLBOARD) {
				this.pApplyBillboard(<away.entities.Billboard> entity);
			} else if (entity.assetType == away.library.AssetType.MESH) {
				this.pApplyMesh(<away.entities.Mesh> entity);
			}
		}
	}
}