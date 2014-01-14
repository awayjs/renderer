///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * MaterialBase forms an abstract base class for any material.
	 * A material consists of several passes, each of which constitutes at least one render call. Several passes could
	 * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
	 * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
	 * subsurface scattering, or rendering a depth map for specialized self-shadowing).
	 *
	 * Away3D provides default materials trough SinglePassMaterialBase and MultiPassMaterialBase, which use modular
	 * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
	 * shaders, or entire new material frameworks.
	 */
	export class MaterialBase extends away.library.NamedAssetBase implements away.library.IAsset
	{
		/**
		 * A counter used to assign unique ids per material, which is used to sort per material while rendering.
		 * This reduces state changes.
		 */
		private static MATERIAL_ID_COUNT:number = 0;

		/**
		 * An object to contain any extra data.
		 */
		public extra:Object;

		/**
		 * A value that can be used by materials that only work with a given type of renderer. The renderer can test the
		 * classification to choose which render path to use. For example, a deferred material could set this value so
		 * that the deferred renderer knows not to take the forward rendering path.
		 *
		 * @private
		 */
		public _iClassification:string;//Arcane

		/**
		 * An id for this material used to sort the renderables by material, which reduces render state changes across
		 * materials using the same Program.
		 *
		 * @private
		 */
		public _iUniqueId:number;//Arcane

		/**
		 * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
		 *
		 * @private
		 */
		public _iRenderOrderId:number = 0;//Arcane

		/**
		 * The same as _renderOrderId, but applied to the depth shader passes.
		 *
		 * @private
		 */
		public _iDepthPassId:number;//Arcane

		private _bothSides:boolean = false; // update
		private _animationSet:away.animators.IAnimationSet;

		/**
		 * A list of material owners, renderables or custom Entities.
		 */


		private _owners:away.base.IMaterialOwner[];//:Vector.<IMaterialOwner>;

		private _alphaPremultiplied:boolean;

		public _pBlendMode:string = away.display.BlendMode.NORMAL;

		private _numPasses:number = 0;
		private _passes:away.materials.MaterialPassBase[];//Vector.<MaterialPassBase>;

		public _pMipmap:boolean = true;
		private _smooth:boolean = true;
		private _repeat:boolean = false; // Update

		public _pDepthPass:away.materials.DepthMapPass;
		public _pDistancePass:away.materials.DistanceMapPass;
		public _pLightPicker:away.materials.LightPickerBase;

		private _distanceBasedDepthRender:boolean;
		public _pDepthCompareMode:string = away.displayGL.ContextGLCompareMode.LESS_EQUAL;

		/**
		 * Creates a new MaterialBase object.
		 */
		constructor()
		{

			super();

			this._owners = new Array< away.base.IMaterialOwner>();
			this._passes = new Array<away.materials.MaterialPassBase>();
			this._pDepthPass = new away.materials.DepthMapPass();
			this._pDistancePass = new away.materials.DistanceMapPass();

			this._pDepthPass.addEventListener(away.events.Event.CHANGE, this.onDepthPassChange, this);
			this._pDistancePass.addEventListener(away.events.Event.CHANGE, this.onDistancePassChange, this);

			this.alphaPremultiplied = false; //TODO: work out why this is different for WebGL

			this._iUniqueId = away.materials.MaterialBase.MATERIAL_ID_COUNT++;

		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return away.library.AssetType.MATERIAL;
		}

		/**
		 * The light picker used by the material to provide lights to the material if it supports lighting.
		 *
		 * @see away3d.materials.lightpickers.LightPickerBase
		 * @see away3d.materials.lightpickers.StaticLightPicker
		 */
		public get lightPicker():away.materials.LightPickerBase
		{
			return this._pLightPicker;
		}

		public set lightPicker(value:away.materials.LightPickerBase)
		{

			this.setLightPicker(value);

		}

		public setLightPicker(value:away.materials.LightPickerBase)
		{

			if (value != this._pLightPicker) {

				this._pLightPicker = value;
				var len:number = this._passes.length;

				for (var i:number = 0; i < len; ++i) {

					this._passes[i].lightPicker = this._pLightPicker;

				}

			}

		}

		/**
		 * Indicates whether or not any used textures should use mipmapping. Defaults to true.
		 */
		public get mipmap():boolean
		{
			return this._pMipmap;
		}

		public set mipmap(value:boolean)
		{

			this.setMipMap(value);

		}

		public setMipMap(value:boolean)
		{

			this._pMipmap = value;

			for (var i:number = 0; i < this._numPasses; ++i) {

				this._passes[i].mipmap = value;

			}

		}

		/**
		 * Indicates whether or not any used textures should use smoothing.
		 */
		public get smooth():boolean
		{
			return this._smooth;
		}

		public set smooth(value:boolean)
		{
			this._smooth = value;

			for (var i:number = 0; i < this._numPasses; ++i) {

				this._passes[i].smooth = value;

			}


		}

		/**
		 * The depth compare mode used to render the renderables using this material.
		 *
		 * @see flash.displayGL.ContextGLCompareMode
		 */

		public get depthCompareMode():string
		{
			return this._pDepthCompareMode;
		}

		public set depthCompareMode(value:string)
		{
			this.setDepthCompareMode(value);
		}

		public setDepthCompareMode(value:string)
		{
			this._pDepthCompareMode = value;
		}

		/**
		 * Indicates whether or not any used textures should be tiled. If set to false, texture samples are clamped to
		 * the texture's borders when the uv coordinates are outside the [0, 1] interval.
		 */
		public get repeat():boolean
		{
			return this._repeat;
		}

		public set repeat(value:boolean)
		{
			this._repeat = value;


			for (var i:number = 0; i < this._numPasses; ++i) {

				this._passes[i].repeat = value;

			}

		}

		/**
		 * Cleans up resources owned by the material, including passes. Textures are not owned by the material since they
		 * could be used by other materials and will not be disposed.
		 */
		public dispose()
		{
			var i:number;

			for (i = 0; i < this._numPasses; ++i) {
				this._passes[i].dispose();
			}

			this._pDepthPass.dispose();
			this._pDistancePass.dispose();

			this._pDepthPass.removeEventListener(away.events.Event.CHANGE, this.onDepthPassChange, this);
			this._pDistancePass.removeEventListener(away.events.Event.CHANGE, this.onDistancePassChange, this);

		}

		/**
		 * Defines whether or not the material should cull triangles facing away from the camera.
		 */
		public get bothSides():boolean
		{
			return this._bothSides;
		}

		public set bothSides(value:boolean)
		{
			this._bothSides = value;


			for (var i:number = 0; i < this._numPasses; ++i) {

				this._passes[i].bothSides = value;

			}

			this._pDepthPass.bothSides = value;
			this._pDistancePass.bothSides = value;

		}

		/**
		 * The blend mode to use when drawing this renderable. The following blend modes are supported:
		 * <ul>
		 * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
		 * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
		 * <li>BlendMode.MULTIPLY</li>
		 * <li>BlendMode.ADD</li>
		 * <li>BlendMode.ALPHA</li>
		 * </ul>
		 */
		public get blendMode():string
		{
			return this.getBlendMode();
		}

		public getBlendMode():string
		{
			return this._pBlendMode;
		}

		public set blendMode(value:string)
		{
			this.setBlendMode(value);
		}

		public setBlendMode(value:string)
		{

			this._pBlendMode = value;

		}

		/**
		 * Indicates whether visible textures (or other pixels) used by this material have
		 * already been premultiplied. Toggle this if you are seeing black halos around your
		 * blended alpha edges.
		 */
		public get alphaPremultiplied():boolean
		{
			return this._alphaPremultiplied;
		}

		public set alphaPremultiplied(value:boolean)
		{
			this._alphaPremultiplied = value;

			for (var i:number = 0; i < this._numPasses; ++i) {
				this._passes[i].alphaPremultiplied = value;
			}

		}

		/**
		 * Indicates whether or not the material requires alpha blending during rendering.
		 */
		public get requiresBlending():boolean
		{

			return this.getRequiresBlending();

		}

		public getRequiresBlending():boolean
		{

			return this._pBlendMode != away.display.BlendMode.NORMAL;

		}

		/**
		 * An id for this material used to sort the renderables by material, which reduces render state changes across
		 * materials using the same Program.
		 */
		public get uniqueId():number
		{
			return this._iUniqueId;
		}

		/**
		 * The amount of passes used by the material.
		 *
		 * @private
		 */
		public get _iNumPasses():number // ARCANE
		{
			return this._numPasses;
		}

		/**
		 * Indicates that the depth pass uses transparency testing to discard pixels.
		 *
		 * @private
		 */

		public iHasDepthAlphaThreshold():boolean
		{

			return this._pDepthPass.alphaThreshold > 0;

		}

		/**
		 * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
		 * depth or distances (fe: shadow maps, depth pre-pass).
		 *
		 * @param stageGLProxy The StageGLProxy used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
		 * is required for shadow cube maps.
		 *
		 * @private
		 */
		public iActivateForDepth(stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D, distanceBased:boolean = false) // ARCANE
		{


			this._distanceBasedDepthRender = distanceBased;

			if (distanceBased) {

				this._pDistancePass.iActivate(stageGLProxy, camera);

			} else {

				this._pDepthPass.iActivate(stageGLProxy, camera);

			}

		}

		/**
		 * Clears the render state for the depth pass.
		 *
		 * @param stageGLProxy The StageGLProxy used for rendering.
		 *
		 * @private
		 */
		public iDeactivateForDepth(stageGLProxy:away.managers.StageGLProxy)
		{


			if (this._distanceBasedDepthRender) {

				this._pDistancePass.iDeactivate(stageGLProxy);

			} else {

				this._pDepthPass.iDeactivate(stageGLProxy);

			}


		}

		/**
		 * Renders a renderable using the depth pass.
		 *
		 * @param renderable The IRenderable instance that needs to be rendered.
		 * @param stageGLProxy The StageGLProxy used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
		 * camera.viewProjection as it includes the scaling factors when rendering to textures.
		 *
		 * @private
		 */
		public iRenderDepth(renderable:away.base.IRenderable, stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D) // ARCANE
		{

			if (this._distanceBasedDepthRender) {

				if (renderable.animator) {

					this._pDistancePass.iUpdateAnimationState(renderable, stageGLProxy, camera);

				}


				this._pDistancePass.iRender(renderable, stageGLProxy, camera, viewProjection);

			} else {
				if (renderable.animator) {

					this._pDepthPass.iUpdateAnimationState(renderable, stageGLProxy, camera);

				}


				this._pDepthPass.iRender(renderable, stageGLProxy, camera, viewProjection);

			}


		}

		//*/
		/**
		 * Indicates whether or not the pass with the given index renders to texture or not.
		 * @param index The index of the pass.
		 * @return True if the pass renders to texture, false otherwise.
		 *
		 * @private
		 */

		public iPassRendersToTexture(index:number):boolean
		{

			return this._passes[index].renderToTexture;

		}

		/**
		 * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
		 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
		 * @param index The index of the pass to activate.
		 * @param stageGLProxy The StageGLProxy object which is currently used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @private
		 */

		public iActivatePass(index:number, stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D) // ARCANE
		{
			this._passes[index].iActivate(stageGLProxy, camera);

		}

		/**
		 * Clears the render state for a pass. This needs to be called before activating another pass.
		 * @param index The index of the pass to deactivate.
		 * @param stageGLProxy The StageGLProxy used for rendering
		 *
		 * @private
		 */

		public iDeactivatePass(index:number, stageGLProxy:away.managers.StageGLProxy) // ARCANE
		{
			this._passes[index].iDeactivate(stageGLProxy);
		}

		/**
		 * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
		 * @param index The index of the pass used to render the renderable.
		 * @param renderable The IRenderable object to draw.
		 * @param stageGLProxy The StageGLProxy object used for rendering.
		 * @param entityCollector The EntityCollector object that contains the visible scene data.
		 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
		 * camera.viewProjection as it includes the scaling factors when rendering to textures.
		 */
		public iRenderPass(index:number, renderable:away.base.IRenderable, stageGLProxy:away.managers.StageGLProxy, entityCollector:away.traverse.EntityCollector, viewProjection:away.geom.Matrix3D)
		{
			if (this._pLightPicker) {

				this._pLightPicker.collectLights(renderable, entityCollector);

			}

			var pass:away.materials.MaterialPassBase = this._passes[index];

			if (renderable.animator) {

				pass.iUpdateAnimationState(renderable, stageGLProxy, entityCollector.camera);

			}


			pass.iRender(renderable, stageGLProxy, entityCollector.camera, viewProjection);

		}

		//
		// MATERIAL MANAGEMENT
		//
		/**
		 * Mark an IMaterialOwner as owner of this material.
		 * Assures we're not using the same material across renderables with different animations, since the
		 * Programs depend on animation. This method needs to be called when a material is assigned.
		 *
		 * @param owner The IMaterialOwner that had this material assigned
		 *
		 * @private
		 */

		public iAddOwner(owner:away.base.IMaterialOwner) // ARCANE
		{
			this._owners.push(owner);

			if (owner.animator) {

				if (this._animationSet && owner.animator.animationSet != this._animationSet) {

					throw new Error("A Material instance cannot be shared across renderables with different animator libraries");

				} else {

					if (this._animationSet != owner.animator.animationSet) {

						this._animationSet = owner.animator.animationSet;

						for (var i:number = 0; i < this._numPasses; ++i) {

							this._passes[i].animationSet = this._animationSet;

						}

						this._pDepthPass.animationSet = this._animationSet;
						this._pDistancePass.animationSet = this._animationSet;

						this.iInvalidatePasses(null);//this.invalidatePasses(null);

					}
				}
			}
		}

		//*/
		/**
		 * Removes an IMaterialOwner as owner.
		 * @param owner
		 * @private
		 */

		public iRemoveOwner(owner:away.base.IMaterialOwner) // ARCANE
		{
			this._owners.splice(this._owners.indexOf(owner), 1);

			if (this._owners.length == 0) {
				this._animationSet = null;

				for (var i:number = 0; i < this._numPasses; ++i) {

					this._passes[i].animationSet = this._animationSet;

				}

				this._pDepthPass.animationSet = this._animationSet;
				this._pDistancePass.animationSet = this._animationSet;
				this.iInvalidatePasses(null);
			}
		}

		//*/
		/**
		 * A list of the IMaterialOwners that use this material
		 *
		 * @private
		 */
		public get iOwners():away.base.IMaterialOwner[]//Vector.<IMaterialOwner> // ARCANE
		{
			return this._owners;
		}

		/**
		 * Performs any processing that needs to occur before any of its passes are used.
		 *
		 * @private
		 */
		public iUpdateMaterial(context:away.displayGL.ContextGL) // ARCANE
		{
			//throw new away.errors.AbstractMethodError();
		}

		/**
		 * Deactivates the last pass of the material.
		 *
		 * @private
		 */
		public iDeactivate(stageGLProxy:away.managers.StageGLProxy) // ARCANE
		{

			this._passes[this._numPasses - 1].iDeactivate(stageGLProxy);

		}

		/**
		 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
		 * @param triggerPass The pass triggering the invalidation, if any. This is passed to prevent invalidating the
		 * triggering pass, which would result in an infinite loop.
		 *
		 * @private
		 */

		public iInvalidatePasses(triggerPass:MaterialPassBase)
		{
			var owner:away.base.IMaterialOwner;

			var l:number;
			var c:number;

			this._pDepthPass.iInvalidateShaderProgram();
			this._pDistancePass.iInvalidateShaderProgram();

			// test if the depth and distance passes support animating the animation set in the vertex shader
			// if any object using this material fails to support accelerated animations for any of the passes,
			// we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)

			if (this._animationSet) {

				this._animationSet.resetGPUCompatibility();

				l = this._owners.length;

				for (c = 0; c < l; c++) {

					owner = this._owners[c];

					if (owner.animator) {

						owner.animator.testGPUCompatibility(this._pDepthPass);
						owner.animator.testGPUCompatibility(this._pDistancePass);

					}

				}

			}

			for (var i:number = 0; i < this._numPasses; ++i) {
				// only invalidate the pass if it wasn't the triggering pass
				if (this._passes[i] != triggerPass) {

					this._passes[i].iInvalidateShaderProgram(false);

				}


				// test if animation will be able to run on gpu BEFORE compiling materials
				// test if the pass supports animating the animation set in the vertex shader
				// if any object using this material fails to support accelerated animations for any of the passes,
				// we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
				if (this._animationSet) {


					l = this._owners.length;

					for (c = 0; c < l; c++) {

						owner = this._owners[c];

						if (owner.animator) {

							owner.animator.testGPUCompatibility(this._passes[i]);

						}

					}

				}
			}
		}

		/**
		 * Removes a pass from the material.
		 * @param pass The pass to be removed.
		 */

		public pRemovePass(pass:MaterialPassBase) // protected
		{
			this._passes.splice(this._passes.indexOf(pass), 1);
			--this._numPasses;
		}

		/**
		 * Removes all passes from the material
		 */

		public pClearPasses()
		{
			for (var i:number = 0; i < this._numPasses; ++i) {

				this._passes[i].removeEventListener(away.events.Event.CHANGE, this.onPassChange, this);

			}


			this._passes.length = 0;
			this._numPasses = 0;
		}

		/**
		 * Adds a pass to the material
		 * @param pass
		 */

		public pAddPass(pass:MaterialPassBase)
		{
			this._passes[this._numPasses++] = pass;
			pass.animationSet = this._animationSet;
			pass.alphaPremultiplied = this._alphaPremultiplied;
			pass.mipmap = this._pMipmap;
			pass.smooth = this._smooth;
			pass.repeat = this._repeat;
			pass.lightPicker = this._pLightPicker;
			pass.bothSides = this._bothSides;
			pass.addEventListener(away.events.Event.CHANGE, this.onPassChange, this);
			this.iInvalidatePasses(null);

		}

		/**
		 * Listener for when a pass's shader code changes. It recalculates the render order id.
		 */

		private onPassChange(event:away.events.Event)
		{
			var mult:number = 1;
			var ids:number[];////Vector.<int>;
			var len:number;

			this._iRenderOrderId = 0;

			for (var i:number = 0; i < this._numPasses; ++i) {

				ids = this._passes[i]._iProgramids;
				len = ids.length;

				for (var j:number = 0; j < len; ++j) {

					if (ids[j] != -1) {

						this._iRenderOrderId += mult*ids[j];
						j = len;

					}

				}

				mult *= 1000;
			}
		}

		/**
		 * Listener for when the distance pass's shader code changes. It recalculates the depth pass id.
		 */
		private onDistancePassChange(event:away.events.Event)
		{

			var ids:number[] = this._pDistancePass._iProgramids;
			var len:number = ids.length;

			this._iDepthPassId = 0;

			for (var j:number = 0; j < len; ++j) {
				if (ids[j] != -1) {

					this._iDepthPassId += ids[j];
					j = len;

				}

			}


		}

		/**
		 * Listener for when the depth pass's shader code changes. It recalculates the depth pass id.
		 */

		private onDepthPassChange(event:away.events.Event)
		{

			var ids:number[] = this._pDepthPass._iProgramids;
			var len:number = ids.length;

			this._iDepthPassId = 0;

			for (var j:number = 0; j < len; ++j) {

				if (ids[j] != -1) {

					this._iDepthPassId += ids[j];
					j = len;

				}

			}


		}

	}
}
