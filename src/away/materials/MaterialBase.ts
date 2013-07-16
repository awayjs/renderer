

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
		 * materials using the same Program3D.
		 *
		 * @private
		 */
		public _iUniqueId:number;//Arcane

		/**
		 * An id for this material used to sort the renderables by shader program, which reduces Program3D state changes.
		 *
		 * @private
		 */
		public _iRenderOrderId:number;//Arcane

		/**
		 * The same as _renderOrderId, but applied to the depth shader passes.
		 *
		 * @private
		 */
		public _iDepthPassId:number;//Arcane

		private _bothSides:boolean;
		//private _animationSet:IAnimationSet; // TODO: IAnimationSet - Implement & integrate

		/**
		 * A list of material owners, renderables or custom Entities.
		 */


		private _owners : away.base.IMaterialOwner[];//:Vector.<IMaterialOwner>;
		
		private _alphaPremultiplied:boolean;
		
		private _blendMode:string = away.display.BlendMode.NORMAL;
		
		private _numPasses:number;
		//private _passes:Vector.<MaterialPassBase>; // TODO: MaterialPassBase - Implement & integrate
		
		private _mipmap:boolean = true;
		private _smooth:boolean = true;
		private _repeat:boolean;
		
		//private _depthPass:DepthMapPass; // TODO: DepthMapPass - Implement & integrate
		//private _distancePass:DistanceMapPass; // TODO: DistanceMapPass - Implement & integrate
		//private _lightPicker:LightPickerBase; // TODO: LightPickerBase - Implement & integrate

		private _distanceBasedDepthRender:boolean;
		//private var _depthCompareMode:string = Context3DCompareMode.LESS_EQUAL; TODO: Context3DCompareMode - Implement & integrate
		
		/**
		 * Creates a new MaterialBase object.
		 */
		constructor()
		{

            super();

			this._owners = new Array< away.base.IMaterialOwner>();//Vector.<IMaterialOwner>();
			//_passes = new Vector.<MaterialPassBase>(); // TODO: MaterialPassBase - Implement & integrate
			//_depthPass = new DepthMapPass();// TODO: DepthMapPass - Implement & integrate
			//_distancePass = new DistanceMapPass();// TODO: DistanceMapPass - Implement & integrate
			//_depthPass.addEventListener(Event.CHANGE, onDepthPassChange);// TODO: DepthMapPass - Implement & integrate
			//_distancePass.addEventListener(Event.CHANGE, onDistancePassChange);// TODO: DistanceMapPass - Implement & integrate
			
			// Default to considering pre-multiplied textures while blending
			this.alphaPremultiplied= true;
			
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
        // TODO: LightPickerBase - Implement & integrate
        /*
		public get lightPicker():LightPickerBase
		{
			return _lightPicker;
		}
		*/
        // TODO: LightPickerBase - Implement & integrate
        /*
		public set lightPicker(value:LightPickerBase)
		{
			if (value != _lightPicker) {
				_lightPicker = value;
				var len:number = _passes.length;
				for (var i:number = 0; i < len; ++i)
					_passes[i].lightPicker = _lightPicker;
			}
		}
		*/
		/**
		 * Indicates whether or not any used textures should use mipmapping. Defaults to true.
		 */
		public get mipmap():boolean
		{
			return this._mipmap;
		}

		public set mipmap(value:boolean)
		{
			this._mipmap = value;

            throw new away.errors.PartialImplementationError( 'MaterialPassBase' );
            // TODO: MaterialPassBase - Implement & integrate
            /*
			for (var i:number = 0; i < this._numPasses; ++i)
            {

                this._passes[i].mipmap = value;

            }
			*/
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

            throw new away.errors.PartialImplementationError( 'MaterialPassBase' );
            // TODO: MaterialPassBase - Implement & integrate
            /*
			for (var i:number = 0; i < _numPasses; ++i)
            {

                this._passes[i].smooth = value;

            }
			*/

		}

		/**
		 * The depth compare mode used to render the renderables using this material.
		 *
		 * @see flash.display3D.Context3DCompareMode
		 */
        // TODO: Context3DCompareMode - Implement & integrate
        /*
		public get depthCompareMode():string
		{
			return this._depthCompareMode;
		}
		*/
        // TODO: Context3DCompareMode - Implement & integrate
        /*
		public set depthCompareMode(value:string)
		{
			_depthCompareMode = value;
		}
		*/
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

            throw new away.errors.PartialImplementationError( 'MaterialPassBase' );
            // TODO: MaterialPassBase - Implement & integrate
            /*
			for (var i:number = 0; i < _numPasses; ++i)
            {

                _passes[i].repeat = value;

            }
			*/
		}
		
		/**
		 * Cleans up resources owned by the material, including passes. Textures are not owned by the material since they
		 * could be used by other materials and will not be disposed.
		 */
		public dispose()
		{
			var i:number;

            throw new away.errors.PartialImplementationError( 'DepthMapPass , DistanceMapPass' );

            // TODO: MaterialPassBase - Implement & integrate
            /*
			for (i = 0; i < _numPasses; ++i)
            {
                _passes[i].dispose();
            }
			*/

            // TODO: DepthMapPass - Implement & integrate
            // TODO: DistanceMapPass - Implement & integrate

            /*
			this._depthPass.dispose();
            this._distancePass.dispose();//
            this._depthPass.removeEventListener(away.events.Event.CHANGE, this.onDepthPassChange);
            this._distancePass.removeEventListener(away.events.Event.CHANGE, this.onDistancePassChange);
            */
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

            // TODO: DepthMapPass - Implement & integrate
            // TODO: DistanceMapPass - Implement & integrate

            throw new away.errors.PartialImplementationError( 'DepthMapPass , DistanceMapPass' );

            /*
			for (var i:number = 0; i < _numPasses; ++i)
            {

                this._passes[i].bothSides = value;

            }

            this._depthPass.bothSides = value;
            this._distancePass.bothSides = value;
            */

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
			return this._blendMode;
		}
		
		public set blendMode(value:string)
		{
            this._blendMode = value;
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

            throw new away.errors.PartialImplementationError( 'MaterialPassBase' );

            // TODO: MaterialPassBase - Implement & integrate

            /*
			for (var i:number = 0; i < _numPasses; ++i)
            {
                this._passes[i].alphaPremultiplied = value;
            }
            */
		}
		
		/**
		 * Indicates whether or not the material requires alpha blending during rendering.
		 */
		public get requiresBlending():boolean
		{
			return this._blendMode != away.display.BlendMode.NORMAL;
		}

		/**
		 * An id for this material used to sort the renderables by material, which reduces render state changes across
		 * materials using the same Program3D.
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
        // TODO: DepthMapPass - Implement & integrate
        /*
		public _iHasDepthAlphaThreshold():boolean
		{

			return this._depthPass.alphaThreshold > 0;

		}
        */
		/**
		 * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
		 * depth or distances (fe: shadow maps, depth pre-pass).
		 *
		 * @param stage3DProxy The Stage3DProxy used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
		 * is required for shadow cube maps.
		 *
		 * @private
		 */
        // TODO: Stage3DProxy / Camera3D / DepthMapPass / DistanceMapPass - Implement & integrate
        /*
		public _iActivateForDepth(stage3DProxy:Stage3DProxy, camera:Camera3D, distanceBased:boolean = false) // ARCANE
		{
			this._distanceBasedDepthRender = distanceBased;

			if (distanceBased)
            {

                this._distancePass.activate(stage3DProxy, camera);

            }
			else
            {

                this._depthPass.activate(stage3DProxy, camera);

            }

		}
        //*/
		/**
		 * Clears the render state for the depth pass.
		 *
		 * @param stage3DProxy The Stage3DProxy used for rendering.
		 *
		 * @private
		 */
        //TODO: Stage3DProxy / DepthMapPass / DistanceMapPass - Implement & integrate
        /*
		public _iDeactivateForDepth(stage3DProxy:Stage3DProxy)
		{
			if (_distanceBasedDepthRender)
				_distancePass.deactivate(stage3DProxy);
			else
				_depthPass.deactivate(stage3DProxy);
		}
        */
		/**
		 * Renders a renderable using the depth pass.
		 *
		 * @param renderable The IRenderable instance that needs to be rendered.
		 * @param stage3DProxy The Stage3DProxy used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
		 * camera.viewProjection as it includes the scaling factors when rendering to textures.
		 *
		 * @private
		 */
        //TODO: Stage3DProxy / DepthMapPass / DistanceMapPass / IAnimationSet - Implement & integrate
        /*
		public _iRenderDepth(renderable:IRenderable, stage3DProxy:Stage3DProxy, camera:Camera3D, viewProjection:Matrix3D) // ARCANE
		{
			if (_distanceBasedDepthRender) {
				if (renderable.animator)
					_distancePass.updateAnimationState(renderable, stage3DProxy, camera);
				_distancePass.render(renderable, stage3DProxy, camera, viewProjection);
			} else {
				if (renderable.animator)
					_depthPass.updateAnimationState(renderable, stage3DProxy, camera);
				_depthPass.render(renderable, stage3DProxy, camera, viewProjection);
			}
		}
        */
		/**
		 * Indicates whether or not the pass with the given index renders to texture or not.
		 * @param index The index of the pass.
		 * @return True if the pass renders to texture, false otherwise.
		 *
		 * @private
		 */
        //TODO: MaterialPassBase - Implement & integrate
        /*
		public _iPassRendersToTexture(index:number):boolean
		{
			return _passes[index].renderToTexture;
		}
		*/
		/**
		 * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
		 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
		 * @param index The index of the pass to activate.
		 * @param stage3DProxy The Stage3DProxy object which is currently used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @private
		 */
        //TODO: MaterialPassBase - Implement & integrate
        /*
		public _iActivatePass(index:number, stage3DProxy:Stage3DProxy, camera:Camera3D) // ARCANE
		{
			this._passes[index].activate(stage3DProxy, camera);
		}
        */

		/**
		 * Clears the render state for a pass. This needs to be called before activating another pass.
		 * @param index The index of the pass to deactivate.
		 * @param stage3DProxy The Stage3DProxy used for rendering
		 *
		 * @private
		 */
        //TODO: MaterialPassBase - Implement & integrate
        /*
		public _iDeactivatePass(index:number, stage3DProxy:Stage3DProxy) // ARCANE
		{
			_passes[index].deactivate(stage3DProxy);
		}
        */
		/**
		 * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
		 * @param index The index of the pass used to render the renderable.
		 * @param renderable The IRenderable object to draw.
		 * @param stage3DProxy The Stage3DProxy object used for rendering.
		 * @param entityCollector The EntityCollector object that contains the visible scene data.
		 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
		 * camera.viewProjection as it includes the scaling factors when rendering to textures.
		 */
        //TODO: MaterialPassBase / Stage3DProxy / EntityCollector / IAnimationSet - Implement & integrate
        /*
		arcane function renderPass(index:number, renderable:IRenderable, stage3DProxy:Stage3DProxy, entityCollector:EntityCollector, viewProjection:Matrix3D)
		{
			if (_lightPicker)
				_lightPicker.collectLights(renderable, entityCollector);
			
			var pass:MaterialPassBase = _passes[index];
			
			if (renderable.animator)
				pass.updateAnimationState(renderable, stage3DProxy, entityCollector.camera);
			
			pass.render(renderable, stage3DProxy, entityCollector.camera, viewProjection);
		}
         */
		//
		// MATERIAL MANAGEMENT
		//
		/**
		 * Mark an IMaterialOwner as owner of this material.
		 * Assures we're not using the same material across renderables with different animations, since the
		 * Program3Ds depend on animation. This method needs to be called when a material is assigned.
		 *
		 * @param owner The IMaterialOwner that had this material assigned
		 *
		 * @private
		 */
        /* TODO: IAnimationSet - implement and integrate
		public _iAddOwner(owner:away.base.IMaterialOwner) // ARCANE
		{
			_owners.push(owner);
			
			if (owner.animator) {
				if (_animationSet && owner.animator.animationSet != _animationSet)
					throw new Error("A Material instance cannot be shared across renderables with different animator libraries");
				else {
					if (_animationSet != owner.animator.animationSet) {
						_animationSet = owner.animator.animationSet;
						for (var i:number = 0; i < _numPasses; ++i)
							_passes[i].animationSet = _animationSet;
						_depthPass.animationSet = _animationSet;
						_distancePass.animationSet = _animationSet;
						invalidatePasses(null);
					}
				}
			}
		}
		*/
		/**
		 * Removes an IMaterialOwner as owner.
		 * @param owner
		 * @private
		 */
        /* TODO: IAnimationSet - implement and integrate
		public _iRemoveOwner(owner:away.base.IMaterialOwner) // ARCANE
		{
			_owners.splice(_owners.indexOf(owner), 1);
			if (_owners.length == 0) {
				_animationSet = null;
				for (var i:number = 0; i < _numPasses; ++i)
					_passes[i].animationSet = _animationSet;
				_depthPass.animationSet = _animationSet;
				_distancePass.animationSet = _animationSet;
				invalidatePasses(null);
			}
		}
		*/
		/**
		 * A list of the IMaterialOwners that use this material
		 *
		 * @private
		 */
		public get _iOwners():away.base.IMaterialOwner[]//Vector.<IMaterialOwner> // ARCANE
		{
			return this._owners;
		}
		
		/**
		 * Performs any processing that needs to occur before any of its passes are used.
		 *
		 * @private
		 */
		public _iUpdateMaterial(context:away.display3D.Context3D) // ARCANE
		{
		    throw new away.errors.AbstractMethodError();
		}
		
		/**
		 * Deactivates the last pass of the material.
		 *
		 * @private
		 */
        /* TODO: Stage3DProxy / MaterialPassBase - Imeplement & Integrate
		public _iDeactivate(stage3DProxy:Stage3DProxy) // ARCANE
		{
			_passes[_numPasses - 1].deactivate(stage3DProxy);
		}
		*/
		/**
		 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
		 * @param triggerPass The pass triggering the invalidation, if any. This is passed to prevent invalidating the
		 * triggering pass, which would result in an infinite loop.
		 *
		 * @private
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		arcane function invalidatePasses(triggerPass:MaterialPassBase)
		{
			var owner:IMaterialOwner;
			
			_depthPass.invalidateShaderProgram();
			_distancePass.invalidateShaderProgram();

			// test if the depth and distance passes support animating the animation set in the vertex shader
			// if any object using this material fails to support accelerated animations for any of the passes,
			// we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
			if (_animationSet) {
				_animationSet.resetGPUCompatibility();
				for each (owner in _owners) {
					if (owner.animator) {
						owner.animator.testGPUCompatibility(_depthPass);
						owner.animator.testGPUCompatibility(_distancePass);
					}
				}
			}
			
			for (var i:number = 0; i < _numPasses; ++i) {
				// only invalidate the pass if it wasn't the triggering pass
				if (_passes[i] != triggerPass)
					_passes[i].invalidateShaderProgram(false);

				// test if animation will be able to run on gpu BEFORE compiling materials
				// test if the pass supports animating the animation set in the vertex shader
				// if any object using this material fails to support accelerated animations for any of the passes,
				// we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
				if (_animationSet) {
					for each (owner in _owners) {
						if (owner.animator)
							owner.animator.testGPUCompatibility(_passes[i]);
					}
				}
			}
		}
        */
		/**
		 * Removes a pass from the material.
		 * @param pass The pass to be removed.
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		public _pRemovePass(pass:MaterialPassBase) // protected
		{
			_passes.splice(_passes.indexOf(pass), 1);
			--_numPasses;
		}
		*/
		/**
		 * Removes all passes from the material
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		public _pClearPasses()
		{
			for (var i:number = 0; i < _numPasses; ++i)
				_passes[i].removeEventListener(Event.CHANGE, onPassChange);
			
			_passes.length = 0;
			_numPasses = 0;
		}
		*/
		/**
		 * Adds a pass to the material
		 * @param pass
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		public _pAddPass(pass:MaterialPassBase)
		{
			_passes[_numPasses++] = pass;
			pass.animationSet = _animationSet;
			pass.alphaPremultiplied = _alphaPremultiplied;
			pass.mipmap = _mipmap;
			pass.smooth = _smooth;
			pass.repeat = _repeat;
			pass.lightPicker = _lightPicker;
			pass.bothSides = _bothSides;
			pass.addEventListener(Event.CHANGE, onPassChange);
			invalidatePasses(null);
		}
        */
		/**
		 * Listener for when a pass's shader code changes. It recalculates the render order id.
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		private onPassChange(event:Event)
		{
			var mult:number = 1;
			var ids:Vector.<int>;
			var len:number;
			
			_renderOrderId = 0;
			
			for (var i:number = 0; i < _numPasses; ++i) {
				ids = _passes[i]._program3Dids;
				len = ids.length;
				for (var j:number = 0; j < len; ++j) {
					if (ids[j] != -1) {
						_renderOrderId += mult*ids[j];
						j = len;
					}
				}
				mult *= 1000;
			}
		}
        */
		/**
		 * Listener for when the distance pass's shader code changes. It recalculates the depth pass id.
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		private onDistancePassChange(event:Event)
		{
			var ids:Vector.<int> = _distancePass._program3Dids;
			var len:number = ids.length;
			
			_depthPassId = 0;
			
			for (var j:number = 0; j < len; ++j) {
				if (ids[j] != -1) {
					_depthPassId += ids[j];
					j = len;
				}
			}
		}
        */
		/**
		 * Listener for when the depth pass's shader code changes. It recalculates the depth pass id.
		 */
        /* TODO: MaterialPassBase - Implement & integrate
		private onDepthPassChange(event:Event)
		{
			var ids:Vector.<int> = _depthPass._program3Dids;
			var len:number = ids.length;
			
			_depthPassId = 0;
			
			for (var j:number = 0; j < len; ++j) {
				if (ids[j] != -1) {
					_depthPassId += ids[j];
					j = len;
				}
			}
		}
		*/
	}
}
