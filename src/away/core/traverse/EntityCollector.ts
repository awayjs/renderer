///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{
	/**
	 * @class away.traverse.EntityCollector
	 */
	export class EntityCollector extends RenderableCollectorBase
	{
		public _pSkybox:away.pool.RenderableBase;
		public _pLights:Array<away.lights.LightBase>;
		private _directionalLights:Array<away.lights.DirectionalLight>;
		private _pointLights:Array<away.lights.PointLight>;
		private _lightProbes:Array<away.lights.LightProbe>;

		public _pOpaqueRenderableHead:away.pool.RenderableBase;
		public _pBlendedRenderableHead:away.pool.RenderableBase;

		public _pNumLights:number = 0;
		public _pNumTriangles:number = 0;
		public _pNumEntities:number = 0;
		public _pNumInteractiveEntities:number = 0;
		private _numDirectionalLights:number = 0;
		private _numPointLights:number = 0;
		private _numLightProbes:number = 0;

		/**
		 *
		 */
		public get directionalLights():Array<away.lights.DirectionalLight>
		{
			return this._directionalLights;
		}

		/**
		 *
		 */
		public get blendedRenderableHead():away.pool.RenderableBase
		{
			return this._pBlendedRenderableHead;
		}

		/**
		 *
		 */
		public get lightProbes():Array<away.lights.LightProbe>
		{
			return this._lightProbes;
		}

		/**
		 *
		 */
		public get lights():Array<away.lights.LightBase>
		{
			return this._pLights;
		}

		/**
		 *
		 */
		public get numEntities():number
		{
			return this._pNumEntities;
		}

		/**
		 *
		 */
		public get numInteractiveEntities():number
		{
			return this._pNumInteractiveEntities;
		}

		/**
		 *
		 */
		public get numTriangles():number
		{
			return this._pNumTriangles;
		}

		/**
		 *
		 */
		public get opaqueRenderableHead():away.pool.RenderableBase
		{
			return this._pOpaqueRenderableHead;
		}

		/**
		 *
		 */
		public get pointLights():Array<away.lights.PointLight>
		{
			return this._pointLights;
		}

		/**
		 *
		 */
		public get skyBox():away.pool.RenderableBase
		{
			return this._pSkybox;
		}

		constructor()
		{
			super();

			this._pLights = new Array<away.lights.LightBase>();
			this._directionalLights = new Array<away.lights.DirectionalLight>();
			this._pointLights = new Array<away.lights.PointLight>();
			this._lightProbes = new Array<away.lights.LightProbe>();
		}

		/**
		 *
		 */
		public applyEntity(entity:away.entities.IEntity)
		{
			super.applyEntity(entity);

			this._pNumEntities++;

			if (entity._iIsMouseEnabled())
				this._pNumInteractiveEntities++;
		}

		public sortRenderables()
		{
			this._pOpaqueRenderableHead = <away.pool.RenderableBase> this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
			this._pBlendedRenderableHead = <away.pool.RenderableBase> this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
		}

		/**
		 *
		 */
		public clear()
		{
			super.clear();

			this._pBlendedRenderableHead = null;
			this._pOpaqueRenderableHead = null;
			this._pNumTriangles = this._pNumEntities = this._pNumInteractiveEntities = 0;
			this._pSkybox = null;

			if (this._pNumLights > 0)
				this._pLights.length = this._pNumLights = 0;

			if (this._numDirectionalLights > 0)
				this._directionalLights.length = this._numDirectionalLights = 0;

			if (this._numPointLights > 0)
				this._pointLights.length = this._numPointLights = 0;

			if (this._numLightProbes > 0)
				this._lightProbes.length = this._numLightProbes = 0;
		}

		/**
		 *
		 * @param renderable
		 * @protected
		 */
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
			if (entity.assetType === away.library.AssetType.BILLBOARD) {
				this.pApplyBillboard(<away.entities.Billboard> entity);
			} else if (entity.assetType === away.library.AssetType.MESH) {
				this.pApplyMesh(<away.entities.Mesh> entity);
			} else if (entity.assetType === away.library.AssetType.LIGHT) {
				this._pLights[ this._pNumLights++ ] = <away.lights.LightBase> entity;

				if (entity instanceof away.lights.DirectionalLight)
					this._directionalLights[ this._numDirectionalLights++ ] = <away.lights.DirectionalLight> entity;
				else if (entity instanceof away.lights.PointLight)
					this._pointLights[ this._numPointLights++ ] = <away.lights.PointLight> entity;
				else if (entity instanceof away.lights.LightProbe)
					this._lightProbes[ this._numLightProbes++ ] = <away.lights.LightProbe> entity;
			} else if (entity.assetType === away.library.AssetType.SKYBOX) {
				this.pApplySkybox(<away.entities.Skybox> entity)
			} else if (entity.assetType === away.library.AssetType.SEGMENT_SET) {
				this.pApplySegmentSet(<away.entities.SegmentSet> entity)
			}
		}
	}
}