///<reference path="../../_definitions.ts"/>

/**
 * @module away.render
 */
module away.render
{
	/**
	 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
	 *
	 * @class away.render.DepthRenderer
	 */
	export class DepthRenderer extends RendererBase
	{
		private _activeMaterial:away.materials.MaterialBase;
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

		public iRenderCascades(entityCollector:away.traverse.ShadowCasterCollector, target:away.gl.TextureBase, numCascades:number, scissorRects:Array<away.geom.Rectangle>, cameras:Array<away.entities.Camera>)
		{
			this._pRenderTarget = target;
			this._pRenderTargetSurface = 0;

			entityCollector.sortRenderables();

			this._pStageGL.setRenderTarget(target, true, 0);
			this._pContext.clear(1, 1, 1, 1, 1, 0);

			this._pContext.setBlendFactors(away.gl.ContextGLBlendFactor.ONE, away.gl.ContextGLBlendFactor.ZERO);
			this._pContext.setDepthTest(true, away.gl.ContextGLCompareMode.LESS);

			var head:away.pool.RenderableBase = entityCollector.opaqueRenderableHead;

			var first:boolean = true;

			for (var i:number = numCascades - 1; i >= 0; --i) {
				this._pStageGL.scissorRect = scissorRects[i];
				this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
				first = false;
			}

			if (this._activeMaterial)
				this._activeMaterial.iDeactivateForDepth(this._pStageGL);

			this._activeMaterial = null;

			//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
			this._pContext.setDepthTest(false, away.gl.ContextGLCompareMode.LESS_EQUAL);

			this._pStageGL.scissorRect = null;

		}

		private drawCascadeRenderables(renderable:away.pool.RenderableBase, camera:away.entities.Camera, cullPlanes:away.geom.Plane3D[])
		{
			var material:away.materials.MaterialBase;

			while (renderable) {

				if (renderable.cascaded) {
					renderable = renderable.next;
					continue;
				}

				var entity:away.entities.IEntity = renderable.sourceEntity;


				// if completely in front, it will fall in a different cascade
				// do not use near and far planes

				if (!cullPlanes || entity.worldBounds.isInFrustum(cullPlanes, 4)) {

					material = <away.materials.MaterialBase> renderable.materialOwner.material;

					if (this._activeMaterial != material) {
						if (this._activeMaterial)
							this._activeMaterial.iDeactivateForDepth(this._pStageGL);

						this._activeMaterial = material;
						this._activeMaterial.iActivateForDepth(this._pStageGL, camera, false);
					}

					this._activeMaterial.iRenderDepth(renderable, this._pStageGL, camera, camera.viewProjection);
				} else {
					renderable.cascaded = true;
				}

				renderable = renderable.next;
			}
		}

		/**
		 * @inheritDoc
		 */
		public pDraw(entityCollector:away.traverse.EntityCollector, target:away.gl.TextureBase)
		{
			this._pContext.setBlendFactors(away.gl.ContextGLBlendFactor.ONE, away.gl.ContextGLBlendFactor.ZERO);

			this._pContext.setDepthTest(true, away.gl.ContextGLCompareMode.LESS);

			this.drawRenderables(entityCollector.opaqueRenderableHead, entityCollector);

			if (this._disableColor)
				this._pContext.setColorMask(false, false, false, false);

			if (this._renderBlended)
				this.drawRenderables(entityCollector.blendedRenderableHead, entityCollector);

			if (this._activeMaterial)
				this._activeMaterial.iDeactivateForDepth(this._pStageGL);

			if (this._disableColor)
				this._pContext.setColorMask(true, true, true, true);

			this._activeMaterial = null;

		}

		/**
		 * Draw a list of renderables.
		 * @param renderables The renderables to draw.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawRenderables(renderable:away.pool.RenderableBase, entityCollector:away.traverse.EntityCollector)
		{
			var camera:away.entities.Camera = entityCollector.camera;
			var renderable2:away.pool.RenderableBase;

			while (renderable) {
				this._activeMaterial = <away.materials.MaterialBase> renderable.materialOwner.material;

				// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
				if (this._disableColor && this._activeMaterial.iHasDepthAlphaThreshold()) {
					renderable2 = renderable;
					// fast forward
					do {
						renderable2 = renderable2.next;

					} while (renderable2 && renderable2.materialOwner.material == this._activeMaterial);
				} else {
					this._activeMaterial.iActivateForDepth(this._pStageGL, camera, this._distanceBased);
					renderable2 = renderable;
					do {
						this._activeMaterial.iRenderDepth(renderable2, this._pStageGL, camera, this._pRttViewProjectionMatrix);
						renderable2 = renderable2.next;

					} while (renderable2 && renderable2.materialOwner.material == this._activeMaterial);

					this._activeMaterial.iDeactivateForDepth(this._pStageGL);
				}

				renderable = renderable2;
			}
		}
	}
}
