///<reference path="../_definitions.ts"/>

module away.render
{

	/**
	 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
	 * materials assigned to them.
	 */
	export class DefaultRenderer extends away.render.RendererBase
	{
		private static RTT_PASSES    : number = 1;
		private static SCREEN_PASSES : number = 2;
		private static ALL_PASSES    : number = 3;

		private _activeMaterial     : away.materials.MaterialBase;
		private _pDistanceRenderer  : away.render.DepthRenderer;
		private _pDepthRenderer     : away.render.DepthRenderer;
		private _skyboxProjection   : away.geom.Matrix3D = new away.geom.Matrix3D();
		
		/**
		 * Creates a new DefaultRenderer object.
		 * @param antiAlias The amount of anti-aliasing to use.
		 * @param renderMode The render mode to use.
		 */
		constructor()
		{
			super();

			this._pDepthRenderer = new away.render.DepthRenderer();
            this._pDistanceRenderer = new away.render.DepthRenderer(false, true);

		}
		
		public set iStage3DProxy(value:away.managers.Stage3DProxy)
		{

			super.iSetStage3DProxy(value );
			this._pDistanceRenderer.iStage3DProxy = this._pDepthRenderer.iStage3DProxy = value;

		}

        public pExecuteRender(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{

			this.updateLights(entityCollector);
			
			// otherwise RTT will interfere with other RTTs

			if (target)
            {

				this.drawRenderables(entityCollector.opaqueRenderableHead, entityCollector, DefaultRenderer.RTT_PASSES);
                this.drawRenderables(entityCollector.blendedRenderableHead, entityCollector, DefaultRenderer.RTT_PASSES);

			}
			
			super.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);
		}
		
		private updateLights(entityCollector:away.traverse.EntityCollector)
		{
			var dirLights:away.lights.DirectionalLight[] = entityCollector.directionalLights;
			var pointLights:away.lights.PointLight[] = entityCollector.pointLights;
			var len:number, i:number;
			var light:away.lights.LightBase;
			var shadowMapper:away.lights.ShadowMapperBase;
			
			len = dirLights.length;
            
			for (i = 0; i < len; ++i) 
            {
                
				light = dirLights[i];
                
				shadowMapper = light.shadowMapper;
                
				if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid ))
                {

                    shadowMapper.iRenderDepthMap( this._pStage3DProxy, entityCollector, this._pDepthRenderer);
                    
                }
					
			}
			
			len = pointLights.length;
            
			for (i = 0; i < len; ++i) 
            {
                
				light = pointLights[i];
                
				shadowMapper = light.shadowMapper;
                
				if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
                {

                    shadowMapper.iRenderDepthMap(this._pStage3DProxy, entityCollector, this._pDistanceRenderer);
                    
                }
					
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public pDraw(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase)
		{

			this._pContext.setBlendFactors(away.display3D.Context3DBlendFactor.ONE, away.display3D.Context3DBlendFactor.ZERO);

			if (entityCollector.skyBox)
            {
				if (this._activeMaterial)
                {

                    this._activeMaterial.iDeactivate(this._pStage3DProxy);

                }

				this._activeMaterial = null;
				
				this._pContext.setDepthTest(false, away.display3D.Context3DCompareMode.ALWAYS);
				this.drawSkyBox(entityCollector);

			}
			
			this._pContext.setDepthTest(true, away.display3D.Context3DCompareMode.LESS_EQUAL);
			
			var which:number = target? DefaultRenderer.SCREEN_PASSES : DefaultRenderer.ALL_PASSES;

			this.drawRenderables(entityCollector.opaqueRenderableHead, entityCollector, which);
            this.drawRenderables(entityCollector.blendedRenderableHead, entityCollector, which);
			
			this._pContext.setDepthTest(false, away.display3D.Context3DCompareMode.LESS_EQUAL);
			
			if (this._activeMaterial)
            {

                this._activeMaterial.iDeactivate(this._pStage3DProxy);

            }

			
			this._activeMaterial = null;

		}
		
		/**
		 * Draw the skybox if present.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawSkyBox(entityCollector:away.traverse.EntityCollector)
		{
			var skyBox:away.base.IRenderable = entityCollector.skyBox;

			var material:away.materials.MaterialBase = skyBox.material;

			var camera:away.cameras.Camera3D = entityCollector.camera;
			
			this.updateSkyBoxProjection(camera);
			
			material.iActivatePass(0, this._pStage3DProxy, camera);
			material.iRenderPass(0, skyBox, this._pStage3DProxy, entityCollector, this._skyboxProjection);
			material.iDeactivatePass(0, this._pStage3DProxy);

		}
		
		private updateSkyBoxProjection(camera:away.cameras.Camera3D)
		{

			var near:away.geom.Vector3D = new away.geom.Vector3D();

			this._skyboxProjection.copyFrom(this._pRttViewProjectionMatrix);
            this._skyboxProjection.copyRowTo(2, near);

			var camPos:away.geom.Vector3D = camera.scenePosition;
			
			var cx:number = near.x;
			var cy:number = near.y;
			var cz:number = near.z;
			var cw:number = -(near.x*camPos.x + near.y*camPos.y + near.z*camPos.z + Math.sqrt(cx*cx + cy*cy + cz*cz));

			var signX:number = cx >= 0? 1 : -1;
			var signY:number = cy >= 0? 1 : -1;

			var p:away.geom.Vector3D = new away.geom.Vector3D(signX, signY, 1, 1);

			var inverse:away.geom.Matrix3D = this._skyboxProjection.clone();
			    inverse.invert();

			var q:away.geom.Vector3D = inverse.transformVector(p);

			this._skyboxProjection.copyRowTo(3, p);

			var a:number = (q.x*p.x + q.y*p.y + q.z*p.z + q.w*p.w)/(cx*q.x + cy*q.y + cz*q.z + cw*q.w);

			this._skyboxProjection.copyRowFrom(2, new away.geom.Vector3D(cx*a, cy*a, cz*a, cw*a));
		
		}
		
		/**
		 * Draw a list of renderables.
		 * @param renderables The renderables to draw.
		 * @param entityCollector The EntityCollector containing all potentially visible information.
		 */
		private drawRenderables(item:away.data.RenderableListItem, entityCollector:away.traverse.EntityCollector, which:number)
		{
			var numPasses:number;
			var j:number;
			var camera:away.cameras.Camera3D = entityCollector.camera;
			var item2:away.data.RenderableListItem;
			
			while (item)
            {

                console.log( 'DefaultRenderer' , 'drawRenderables' , item );
				this._activeMaterial = item.renderable.material;

				this._activeMaterial.iUpdateMaterial( this._pContext);

				numPasses = this._activeMaterial._iNumPasses;

				j = 0;
				
				do
                {

					item2 = item;

					var rttMask:number = this._activeMaterial.iPassRendersToTexture(j)? 1 : 2;
					
					if ((rttMask & which) != 0)
                    {
						this._activeMaterial.iActivatePass(j, this._pStage3DProxy, camera);

						do {
							this._activeMaterial.iRenderPass(j, item2.renderable, this._pStage3DProxy, entityCollector, this._pRttViewProjectionMatrix);

							item2 = item2.next;

						} while (item2 && item2.renderable.material == this._activeMaterial);

						this._activeMaterial.iDeactivatePass(j, this._pStage3DProxy);

					}
                    else
                    {

						do{

                            item2 = item2.next;

                        }
						while (item2 && item2.renderable.material == this._activeMaterial);

					}
					
				} while (++j < numPasses);
				
				item = item2;
			}
		}
		
		public iDispose()
		{
			super.iDispose();

			this._pDepthRenderer.iDispose();
            this._pDistanceRenderer.iDispose();
            this._pDepthRenderer = null;
            this._pDistanceRenderer = null;

		}
	}
}
