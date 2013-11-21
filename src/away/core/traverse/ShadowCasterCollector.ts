///<reference path="../../_definitions.ts"/>

module away.traverse
{
	export class ShadowCasterCollector extends away.traverse.EntityCollector
	{
		constructor()
		{
			super();
		}

		//@override
		public applyRenderable(renderable:away.base.IRenderable)
		{
			// the test for material is temporary, you SHOULD be hammered with errors if you try to render anything without a material
			var material:away.materials.MaterialBase = renderable.material;
			var entity:away.entities.Entity = renderable.sourceEntity;
			if (material) {
				var item:away.data.RenderableListItem = this._pRenderableListItemPool.getItem();
				item.renderable = renderable;
				item.next = this._pOpaqueRenderableHead;
				item.cascaded = false;
				var dx:number = this._iEntryPoint.x - entity.x;
				var dy:number = this._iEntryPoint.y - entity.y;
				var dz:number = this._iEntryPoint.z - entity.z;
				item.zIndex = dx*this._pCameraForward.x + dy*this._pCameraForward.y + dz*this._pCameraForward.z;
				item.renderSceneTransform = renderable.getRenderSceneTransform(this._pCamera);
				item.renderOrderId = material._iDepthPassId;
				this._pOpaqueRenderableHead = item;
			}
		}

		//@override
		public applyUnknownLight(light:away.lights.LightBase)
		{
		}

		//@override

		public applyDirectionalLight(light:away.lights.DirectionalLight)
		{
		}

		//@override
		public applyPointLight(light:away.lights.PointLight)
		{
		}

		//@override

		public applyLightProbe(light:away.lights.LightProbe)
		{
		}

		//@override
		public applySkyBox(renderable:away.base.IRenderable)
		{
		}


		//@override
		public enterNode(node:away.partition.NodeBase):boolean
		{
			var enter:boolean = away.traverse.PartitionTraverser._iCollectionMark != node._iCollectionMark && node.isCastingShadow();

			if (!enter) {
				node._iCollectionMark = away.traverse.PartitionTraverser._iCollectionMark

				return false;
			}

			return super.enterNode(node);
		}
	}
}