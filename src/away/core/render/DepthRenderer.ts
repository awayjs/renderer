///<reference path="../../_definitions.ts"/>

/**
 * @module away.render
 */
module away.render
{
	import IEntity						= away.entities.IEntity;
	import Camera						= away.entities.Camera;
	import Plane3D						= away.geom.Plane3D;
	import Rectangle					= away.geom.Rectangle;
	import ShadowMaterialBase			= away.materials.ShadowMaterialBase;
	import RenderableBase				= away.pool.RenderableBase;
	import ContextGLBlendFactor			= away.stagegl.ContextGLBlendFactor;
	import ContextGLCompareMode			= away.stagegl.ContextGLCompareMode;
	import TextureProxyBase				= away.textures.TextureProxyBase;
	import EntityCollector				= away.traverse.EntityCollector;
	import ShadowCasterCollector		= away.traverse.ShadowCasterCollector;

	/**
	 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
	 *
	 * @class away.render.DepthRenderer
	 */
	export class DepthRenderer extends RendererBase
	{
		private _activeMaterial:ShadowMaterialBase;
		private _renderBlended:boolean;
		private _distanceBased:boolean;
		private _disableColor:boolean;

		/**
		 * Creates a new DepthRenderer object.
		 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
		 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
		 */
		constructor(renderBlended:boolean = false, distanceBased:boolean = false)
		{
			super();

			this._renderBlended = renderBlended;
			this._distanceBased = distanceBased;
			this._iBackgroundR = 1;
			this._iBackgroundG = 1;
			this._iBackgroundB = 1;

		}

		public get disableColor():boolean
		{
			return this._disableColor;
		}

		public set disableColor(value:boolean)
		{
			this._disableColor = value;
		}

		public _iRenderCascades(entityCollector:ShadowCasterCollector, target:TextureProxyBase, numCascades:number, scissorRects:Array<Rectangle>, cameras:Array<Camera>)
		{
			this.pCollectRenderables(entityCollector);

			this._pContext.setRenderTarget(target, true, 0);
			this._pContext.clear(1, 1, 1, 1, 1, 0);

			this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
			this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

			var head:away.pool.RenderableBase = this._pOpaqueRenderableHead;

			var first:boolean = true;

			for (var i:number = numCascades - 1; i >= 0; --i) {
				this._pStage.scissorRect = scissorRects[i];
				this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
				first = false;
			}

			if (this._activeMaterial)
				this._activeMaterial.iDeactivateForDepth(this._pStage);

			this._activeMaterial = null;

			//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
			this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

			this._pStage.scissorRect = null;

		}

		private drawCascadeRenderables(renderable:RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
		{
			var material:ShadowMaterialBase;

			while (renderable) {

				if (renderable.cascaded) {
					renderable = renderable.next;
					continue;
				}

				var entity:IEntity = renderable.sourceEntity;


				// if completely in front, it will fall in a different cascade
				// do not use near and far planes

				if (!cullPlanes || entity.worldBounds.isInFrustum(cullPlanes, 4)) {

					material = <ShadowMaterialBase> renderable.materialOwner.material;

					if (this._activeMaterial != material) {
						if (this._activeMaterial)
							this._activeMaterial.iDeactivateForDepth(this._pStage);

						this._activeMaterial = material;
						this._activeMaterial.iActivateForDepth(this._pStage, camera, false);
					}

					this._activeMaterial.iRenderDepth(renderable, this._pStage, camera, camera.viewProjection);
				} else {
					renderable.cascaded = true;
				}

				renderable = renderable.next;
			}
		}

		/**
		 * @inheritDoc
		 */
		public pDraw(entityCollector:EntityCollector, target:TextureProxyBase)
		{
			this.pCollectRenderables(entityCollector);

			this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

			this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

			this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);

			if (this._disableColor)
				this._pContext.setColorMask(false, false, false, false);

			if (this._renderBlended)
				this.drawRenderables(this._pBlendedRenderableHead, entityCollector);

			if (this._activeMaterial)
				this._activeMaterial.iDeactivateForDepth(this._pStage);

			if (this._disableColor)
				this._pContext.setColorMask(true, true, true, true);

			this._activeMaterial = null;

		}

		/**
		 * Draw a list of renderables.
		 * @param renderables The renderables to draw.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawRenderables(renderable:RenderableBase, entityCollector:EntityCollector)
		{
			var camera:Camera = entityCollector.camera;
			var renderable2:RenderableBase;

			while (renderable) {
				this._activeMaterial = <ShadowMaterialBase> renderable.materialOwner.material;

				// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
				if (this._disableColor && this._activeMaterial.iHasDepthAlphaThreshold()) {
					renderable2 = renderable;
					// fast forward
					do {
						renderable2 = renderable2.next;

					} while (renderable2 && renderable2.materialOwner.material == this._activeMaterial);
				} else {
					this._activeMaterial.iActivateForDepth(this._pStage, camera, this._distanceBased);
					renderable2 = renderable;
					do {
						this._activeMaterial.iRenderDepth(renderable2, this._pStage, camera, this._pRttViewProjectionMatrix);
						renderable2 = renderable2.next;

					} while (renderable2 && renderable2.materialOwner.material == this._activeMaterial);

					this._activeMaterial.iDeactivateForDepth(this._pStage);
				}

				renderable = renderable2;
			}
		}
	}
}