///<reference path="../../_definitions.ts"/>
module away.render
{

	/**
	 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
	 */
	export class DepthRenderer extends away.render.RendererBase
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
            this.iBackgroundR = 1;
            this.iBackgroundG = 1;
            this.iBackgroundB = 1;

		}
		
		public get disableColor():boolean
		{
			return this._disableColor;
		}
		
		public set disableColor(value:boolean)
		{
            this._disableColor = value;
		}
		
		public iRenderCascades(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase, numCascades:number, scissorRects:away.geom.Rectangle[], cameras:away.cameras.Camera3D[])
		{

			this._pRenderTarget = target;
			this._pRenderTargetSurface = 0;

			this._pRenderableSorter.sort(entityCollector);

			this._pStage3DProxy.setRenderTarget(target, true, 0);
			this._pContext.clear(1, 1, 1, 1, 1, 0);

			this._pContext.setBlendFactors(away.display3D.Context3DBlendFactor.ONE, away.display3D.Context3DBlendFactor.ZERO);
			this._pContext.setDepthTest(true, away.display3D.Context3DCompareMode.LESS);
			
			var head:away.data.RenderableListItem = entityCollector.opaqueRenderableHead;

			var first:boolean = true;

			for (var i:number = numCascades - 1; i >= 0; --i)
            {
				this._pStage3DProxy.scissorRect = scissorRects[i];
				this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
				first = false;
			}
			
			if (this._activeMaterial)
            {

                this._activeMaterial.iDeactivateForDepth(this._pStage3DProxy);

            }

			
			this._activeMaterial = null;
			
			//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
			this._pContext.setDepthTest(false, away.display3D.Context3DCompareMode.LESS_EQUAL);
			
			this._pStage3DProxy.scissorRect = null;

		}
		
		private drawCascadeRenderables(item:away.data.RenderableListItem, camera:away.cameras.Camera3D, cullPlanes:away.math.Plane3D[])
		{
			var material:away.materials.MaterialBase;
			
			while (item)
            {

				if (item.cascaded)
                {

					item = item.next;
					continue;

				}
				
				var renderable:away.base.IRenderable = item.renderable;

				var entity:away.entities.Entity = renderable.sourceEntity;

				
				// if completely in front, it will fall in a different cascade
				// do not use near and far planes

				if (!cullPlanes || entity.worldBounds.isInFrustum(cullPlanes, 4))
                {

					material = renderable.material;

					if (this._activeMaterial != material)
                    {
						if (this._activeMaterial)
                        {

                            this._activeMaterial.iDeactivateForDepth(this._pStage3DProxy);

                        }

                        this._activeMaterial = material;
                        this._activeMaterial.iActivateForDepth(this._pStage3DProxy, camera, false);
					}

                    this._activeMaterial.iRenderDepth(renderable, this._pStage3DProxy, camera, camera.viewProjection);

				}
                else
                {

                    item.cascaded = true;
                    
                }

				
				item = item.next;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public pDraw(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase)
		{

			this._pContext.setBlendFactors(away.display3D.Context3DBlendFactor.ONE, away.display3D.Context3DBlendFactor.ZERO);

            this._pContext.setDepthTest(true, away.display3D.Context3DCompareMode.LESS);

            this.drawRenderables(entityCollector.opaqueRenderableHead, entityCollector);
			
			if (this._disableColor)
                this._pContext.setColorMask(false, false, false, false);
			
			if (this._renderBlended)
                this.drawRenderables(entityCollector.blendedRenderableHead, entityCollector);
			
			if (this._activeMaterial)
                this._activeMaterial.iDeactivateForDepth(this._pStage3DProxy);
			
			if (this._disableColor)
                this._pContext.setColorMask(true, true, true, true);

            this._activeMaterial = null;

		}
		
		/**
		 * Draw a list of renderables.
		 * @param renderables The renderables to draw.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawRenderables(item:away.data.RenderableListItem, entityCollector:away.traverse.EntityCollector)
		{
			var camera:away.cameras.Camera3D = entityCollector.camera;
			var item2:away.data.RenderableListItem;
			
			while (item)
            {

				this._activeMaterial = item.renderable.material;
				
				// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
				if (this._disableColor && this._activeMaterial.iHasDepthAlphaThreshold())
                {

					item2 = item;
					// fast forward
					do{

                        item2 = item2.next;

                    } while (item2 && item2.renderable.material == this._activeMaterial);

				}
                else
                {
					this._activeMaterial.iActivateForDepth(this._pStage3DProxy, camera, this._distanceBased);
					item2 = item;
					do {

                        this._activeMaterial.iRenderDepth(item2.renderable, this._pStage3DProxy, camera, this._pRttViewProjectionMatrix);
						item2 = item2.next;

					} while (item2 && item2.renderable.material == this._activeMaterial);

					this._activeMaterial.iDeactivateForDepth(this._pStage3DProxy);

				}

				item = item2;

			}
		}
	}
}
