///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.animators.data.AnimationRegisterCache;
	//import away3d.animators.IAnimationSet;
	//import away3d.arcane;
	//import away3d.cameras.Camera3D;
	//import away3d.core.base.IRenderable;
	//import away3d.managers.AGALProgram3DCache;
	//import away3d.managers.Stage3DProxy;
	//import away3d.debug.Debug;
	//import away3d.errors.AbstractMethodError;
	//import away3d.materials.MaterialBase;
	//import away3d.materials.lightpickers.LightPickerBase;
	
	//import flash.display.BlendMode;
	//import flash.display3D.Context3D;
	//import flash.display3D.Context3DBlendFactor;
	//import flash.display3D.Context3DCompareMode;
	//import flash.display3D.Context3DTriangleFace;
	//import flash.display3D.Program3D;
	//import flash.display3D.textures.TextureBase;
	//import flash.events.Event;
	//import flash.events.EventDispatcher;
	//import flash.geom.Matrix3D;
	//import flash.geom.Rectangle;
	
	//use namespace arcane;
	
	/**
	 * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
	 * a render call per required renderable.
	 */
	export class MaterialPassBase extends away.events.EventDispatcher
	{
        public _pMaterial:away.materials.MaterialBase;
		private _animationSet:away.animators.IAnimationSet;

        public _iProgram3Ds:away.display3D.Program3D[] = new Array<away.display3D.Program3D>( 8 ) //Vector.<Program3D> = new Vector.<Program3D>(8);
        public _iProgram3Dids:number[] = new Array<number>(-1, -1, -1, -1, -1, -1, -1, -1);//Vector.<int> = Vector.<int>([-1, -1, -1, -1, -1, -1, -1, -1]);
		private _context3Ds:away.display3D.Context3D[] = new Array<away.display3D.Context3D>( 8 );//Vector.<Context3D> = new Vector.<Context3D>(8);
		
		// agal props. these NEED to be set by subclasses!
		// todo: can we perhaps figure these out manually by checking read operations in the bytecode, so other sources can be safely updated?
        public _pNumUsedStreams:number;
        public _pNumUsedTextures:number;
        public _pNumUsedVertexConstants:number;
        public _pNumUsedFragmentConstants:number;
        public _pNumUsedVaryings:number;

        public _pSmooth:boolean = true;
        public _pRepeat:boolean = false;
        public _pMipmap:boolean = true;
		private _depthCompareMode:string = away.display3D.Context3DCompareMode.LESS_EQUAL;
		
		private _blendFactorSource:string = away.display3D.Context3DBlendFactor.ONE;
		private _blendFactorDest:string = away.display3D.Context3DBlendFactor.ZERO;

        public _pEnableBlending:boolean;
		
		public _pBothSides:boolean;
		
		public  _pLightPicker:away.materials.LightPickerBase;

        // TODO: AGAL conversion
        public _pAnimatableAttributes:string[] = new Array<string>( "va0");

        // TODO: AGAL conversion
        public _pAnimationTargetRegisters:string[] = new Array<string>( "vt0" );

        // TODO: AGAL conversion
        public _pShadedTarget:string = "ft0";
		
		// keep track of previously rendered usage for faster cleanup of old vertex buffer streams and textures
		private static _previousUsedStreams:number[] = new Array<number>(0, 0, 0, 0, 0, 0, 0, 0);//Vector.<int> = Vector.<int>([0, 0, 0, 0, 0, 0, 0, 0]);
		private static _previousUsedTexs:number[] = new Array<number>(0, 0, 0, 0, 0, 0, 0, 0);//Vector.<int> = Vector.<int>([0, 0, 0, 0, 0, 0, 0, 0]);
		private _defaultCulling:string = away.display3D.Context3DTriangleFace.BACK;
		
		private _renderToTexture:boolean;
		
		// render state mementos for render-to-texture passes
		private _oldTarget:away.display3D.TextureBase;
		private _oldSurface:number;
		private _oldDepthStencil:boolean;
		private _oldRect:away.geom.Rectangle;

        public  _pAlphaPremultiplied:boolean;
        public _pNeedFragmentAnimation:boolean;
        public  _pNeedUVAnimation:boolean;
        public _pUVTarget:string;
        public _pUVSource:string;
		
		private _writeDepth:boolean = true;
		
		//public animationRegisterCache:AnimationRegisterCache; TODO: implement dependency AnimationRegisterCache
		
		/**
		 * Creates a new MaterialPassBase object.
		 *
		 * @param renderToTexture Indicates whether this pass is a render-to-texture pass.
		 */
		constructor(renderToTexture:boolean = false)
		{

            super();

			this._renderToTexture = renderToTexture;
            this._pNumUsedStreams = 1;
            this._pNumUsedVertexConstants = 5;

		}
		
		/**
		 * The material to which this pass belongs.
		 */
		public get material():away.materials.MaterialBase
		{
			return this._pMaterial;
		}
		
		public set material(value:away.materials.MaterialBase)
		{
			this._pMaterial = value;
		}
		
		/**
		 * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
		 */
		public get writeDepth():boolean
		{
			return this._writeDepth;
		}
		
		public set writeDepth(value:boolean)
		{
			this._writeDepth = value;
		}
		
		/**
		 * Defines whether any used textures should use mipmapping.
		 */
		public get mipmap():boolean
		{
			return this._pMipmap;
		}
		
		public set mipmap(value:boolean)
		{

            this.setMipMap( value );

		}

        public setMipMap( value : boolean ) : void
        {

            if (this._pMipmap == value)
            {

                return;

            }

            this._pMipmap = value;
            this.iInvalidateShaderProgram( );

        }
		/**
		 * Defines whether smoothing should be applied to any used textures.
		 */
		public get smooth():boolean
		{
			return this._pSmooth;
		}
		
		public set smooth(value:boolean)
		{
			if (this._pSmooth == value)
            {

                return;

            }

			this._pSmooth = value;
            this.iInvalidateShaderProgram( );
		}
		
		/**
		 * Defines whether textures should be tiled.
		 */
		public get repeat():boolean
		{
			return this._pRepeat;
		}
		
		public set repeat(value:boolean)
		{
			if (this._pRepeat == value)
            {

                return;

            }

			this._pRepeat = value;
            this.iInvalidateShaderProgram( );
		}
		
		/**
		 * Defines whether or not the material should perform backface culling.
		 */
		public get bothSides():boolean
		{
			return this._pBothSides;
		}
		
		public set bothSides(value:boolean)
		{
            this._pBothSides = value;
		}

		/**
		 * The depth compare mode used to render the renderables using this material.
		 *
		 * @see flash.display3D.Context3DCompareMode
		 */
		public get depthCompareMode():string
		{
			return this._depthCompareMode;
		}
		
		public set depthCompareMode(value:string)
		{
            this._depthCompareMode = value;
		}

		/**
		 * Returns the animation data set adding animations to the material.
		 */
		public get animationSet():away.animators.IAnimationSet
		{
			return this._animationSet;
		}
		
		public set animationSet(value:away.animators.IAnimationSet)
		{
			if (this._animationSet == value)
            {

                return;

            }

			
			this._animationSet = value;

            this.iInvalidateShaderProgram( );
		}
		
		/**
		 * Specifies whether this pass renders to texture
		 */
		public get renderToTexture():boolean
		{
			return this._renderToTexture;
		}
		
		/**
		 * Cleans up any resources used by the current object.
		 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
		 */
		public dispose()
		{
			if (this._pLightPicker)
            {

                this._pLightPicker.removeEventListener(away.events.Event.CHANGE, this.onLightsChange , this );

            }

			
			for (var i:number = 0; i < 8; ++i)
            {

				if (this._iProgram3Ds[i])
                {

                    away.Debug.throwPIR( 'away.materials.MaterialPassBase' , 'dispose' , 'required dependency: AGALProgram3DCache');
					//AGALProgram3DCache.getInstanceFromIndex(i).freeProgram3D(_program3Dids[i]);
					this._iProgram3Ds[i] = null;

				}
			}
		}
		
		/**
		 * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
		 */
		public get numUsedStreams():number
		{
			return this._pNumUsedStreams;
		}
		
		/**
		 * The amount of used vertex constants in the vertex code. Used by the animation code generation to know from which index on registers are available.
		 */
		public get numUsedVertexConstants():number
		{
			return this._pNumUsedVertexConstants;
		}
		
		public get numUsedVaryings():number
		{
			return this._pNumUsedVaryings;
		}

		/**
		 * The amount of used fragment constants in the fragment code. Used by the animation code generation to know from which index on registers are available.
		 */
		public get numUsedFragmentConstants():number
		{
			return this._pNumUsedFragmentConstants;
		}
		
		public get needFragmentAnimation():boolean
		{
			return this._pNeedFragmentAnimation;
		}

		/**
		 * Indicates whether the pass requires any UV animatin code.
		 */
		public get needUVAnimation():boolean
		{
			return this._pNeedUVAnimation;
		}
		
		/**
		 * Sets up the animation state. This needs to be called before render()
		 *
		 * @private
		 */
		public iUpdateAnimationState(renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
		{
			renderable.animator.setRenderState(stage3DProxy, renderable, this._pNumUsedVertexConstants, this._pNumUsedStreams, camera);
		}
		
		/**
		 * Renders an object to the current render target.
		 *
		 * @private
		 */
		public iRender(renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D)
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * Returns the vertex AGAL code for the material.
		 */
		public iGetVertexCode():string
		{
            throw new away.errors.AbstractMethodError();
		}

		/**
		 * Returns the fragment AGAL code for the material.
		 */
		public iGetFragmentCode(fragmentAnimatorCode:string):string
		{
            throw new away.errors.AbstractMethodError();
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
		public setBlendMode(value:string)
		{
			switch (value)
            {

				case away.display.BlendMode.NORMAL:

					this._blendFactorSource = away.display3D.Context3DBlendFactor.ONE;
					this._blendFactorDest = away.display3D.Context3DBlendFactor.ZERO;
					this._pEnableBlending = false;

					break;

				case away.display.BlendMode.LAYER:

					this._blendFactorSource = away.display3D.Context3DBlendFactor.SOURCE_ALPHA;
                    this._blendFactorDest = away.display3D.Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                    this._pEnableBlending = true;

					break;

				case away.display.BlendMode.MULTIPLY:

					this._blendFactorSource = away.display3D.Context3DBlendFactor.ZERO;
                    this._blendFactorDest = away.display3D.Context3DBlendFactor.SOURCE_COLOR;
                    this._pEnableBlending = true;

					break;

				case away.display.BlendMode.ADD:

					this._blendFactorSource = away.display3D.Context3DBlendFactor.SOURCE_ALPHA;
                    this._blendFactorDest =  away.display3D.Context3DBlendFactor.ONE;
                    this._pEnableBlending = true;

					break;

				case away.display.BlendMode.ALPHA:

					this._blendFactorSource = away.display3D.Context3DBlendFactor.ZERO;
					this._blendFactorDest = away.display3D.Context3DBlendFactor.SOURCE_ALPHA;
					this._pEnableBlending = true;

					break;

				default:

					throw new away.errors.ArgumentError("Unsupported blend mode!");

			}
		}

		/**
		 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
		 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
		 * @param stage3DProxy The Stage3DProxy object which is currently used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @private
		 */
		public iActivate(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
		{
			var contextIndex:number = stage3DProxy._iStage3DIndex;//_stage3DIndex;
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;

            away.Debug.throwPIR( 'MaterialPassBase' , 'iActivate' , 'context.setDepthTest - not matching params' );
			//context.setDepthTest( ( this._writeDepth && ! this._pEnableBlending ) , this._depthCompareMode);//<--------  TODO : implement

			if (this._pEnableBlending)
            {

                away.Debug.throwPIR( 'MaterialPassBase' , 'iActivate' , 'context.setBlendFactors - not matching params' );
                //context.setBlendFactors( this._blendFactorSource, this._blendFactorDest);//<--------  TODO : implement

            }

			if ( this._context3Ds[contextIndex] != context || ! this._iProgram3Ds[contextIndex])
            {

				this._context3Ds[contextIndex] = context;

                this.iUpdateProgram( stage3DProxy );
				this.dispatchEvent(new away.events.Event(away.events.Event.CHANGE));

			}

			var prevUsed:number = MaterialPassBase._previousUsedStreams[contextIndex];
			var i:number;

			for (i = this._pNumUsedStreams; i < prevUsed; ++i)
            {

                context.setVertexBufferAt(i, null);

            }

			
			prevUsed = MaterialPassBase._previousUsedTexs[contextIndex];
			
			for (i = this._pNumUsedTextures; i < prevUsed; ++i)
            {

                away.Debug.throwPIR( 'away.materials.MaterialPassBase' , 'iActivate' , 'required dependency: Context3D.setTextureAt');
                //context.setTextureAt(i, null);

            }

			
			if ( this._animationSet && ! this._animationSet.usesCPU)
            {

                this._animationSet.activate(stage3DProxy, this);

            }


			context.setProgram(this._iProgram3Ds[contextIndex]);
			
			context.setCulling(this._pBothSides? away.display3D.Context3DTriangleFace.NONE : this._defaultCulling);
			
			if (this._renderToTexture)
            {
				this._oldTarget = stage3DProxy.renderTarget;
                this._oldSurface = stage3DProxy.renderSurfaceSelector;
                this._oldDepthStencil = stage3DProxy.enableDepthAndStencil;
                this._oldRect = stage3DProxy.scissorRect;
			}
		}

		/**
		 * Clears the render state for the pass. This needs to be called before activating another pass.
		 * @param stage3DProxy The Stage3DProxy used for rendering
		 *
		 * @private
		 */
		public iDeactivate(stage3DProxy:away.managers.Stage3DProxy)
		{

			var index:number = stage3DProxy._iStage3DIndex;//_stage3DIndex;
			MaterialPassBase._previousUsedStreams[index] = this._pNumUsedStreams;
            MaterialPassBase._previousUsedTexs[index] = this._pNumUsedTextures;
			
			if (this._animationSet && !this._animationSet.usesCPU)
            {

                this._animationSet.deactivate(stage3DProxy, this);

            }

			
			if ( this._renderToTexture)
            {

				// kindly restore state
				stage3DProxy.setRenderTarget(this._oldTarget, this._oldDepthStencil, this._oldSurface);
				stage3DProxy.scissorRect = this._oldRect;

			}

            away.Debug.throwPIR( 'MaterialPassBase' , 'iDeactivate' , 'stage3DProxy._iContext3D.setDepthTest - parameters not matching');
			//stage3DProxy._iContext3D.setDepthTest(true, away.display3D.Context3DCompareMode.LESS_EQUAL); // TODO : imeplement
		}
		
		/**
		 * Marks the shader program as invalid, so it will be recompiled before the next render.
		 *
		 * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
		 */
		public iInvalidateShaderProgram(updateMaterial:boolean = true)
		{
			for (var i:number = 0; i < 8; ++i)
            {

                this._iProgram3Ds[i] = null;

            }

			
			if (this._pMaterial && updateMaterial)
            {

                away.Debug.throwPIR( 'away.materials.MaterialPassBase' , 'iInvalidateShaderProgram' , 'required dependency: MaterialBase.invalidatePasses');
                //this._pMaterial.invalidatePasses(this);

            }

		}
		
		/**
		 * Compiles the shader program.
		 * @param polyOffsetReg An optional register that contains an amount by which to inflate the model (used in single object depth map rendering).
		 */
		public iUpdateProgram(stage3DProxy:away.managers.Stage3DProxy)
		{
			var animatorCode:string = "";
			var UVAnimatorCode:string = "";
			var fragmentAnimatorCode:string = "";
			var vertexCode:string = this.iGetVertexCode();//getVertexCode();
			
			if ( this._animationSet && ! this._animationSet.usesCPU)
            {

				animatorCode = this._animationSet.getAGALVertexCode(this, this._pAnimatableAttributes, this._pAnimationTargetRegisters, stage3DProxy.profile);

				if (this._pNeedFragmentAnimation)
                {

                    fragmentAnimatorCode = this._animationSet.getAGALFragmentCode(this, this._pShadedTarget, stage3DProxy.profile);

                }

				if ( this._pNeedUVAnimation)
                {

                    UVAnimatorCode = this._animationSet.getAGALUVCode(this, this._pUVSource, this._pUVTarget);

                }

				this._animationSet.doneAGALCode(this);

			}
            else
            {
				var len:number = this._pAnimatableAttributes.length;
				
				// simply write attributes to targets, do not animate them
				// projection will pick up on targets[0] to do the projection
				for (var i:number = 0; i < len; ++i)
                {
                    // TODO: AGAL <> GLSL conversion:
                    away.Debug.throwPIR( 'away.materials.MaterialPassBase' , 'iUpdateProgram' , 'AGAL <> GLSL Conversion');
                    //animatorCode += "mov " + _animationTargetRegisters[i] + ", " + _animatableAttributes[i] + "\n";

                }

				if (this._pNeedUVAnimation)
                {

                    away.Debug.throwPIR( 'away.materials.MaterialPassBase' , 'iUpdateProgram' , 'AGAL <> GLSL Conversion');
                    // TODO: AGAL <> GLSL conversion
                    //UVAnimatorCode = "mov " + _UVTarget + "," + _UVSource + "\n";

                }

			}
			
			vertexCode = animatorCode + UVAnimatorCode + vertexCode;
			
			var fragmentCode:string = this.iGetFragmentCode( fragmentAnimatorCode );

            /*
			if (this.Debug.active) {
				trace("Compiling AGAL Code:");
				trace("--------------------");
				trace(vertexCode);
				trace("--------------------");
				trace(fragmentCode);
			}
			*/

            away.Debug.throwPIR( 'away.materials.MaterialPassBase' , 'dispose' , 'required dependency: AGALProgram3DCache');
			//AGALProgram3DCache.getInstance(stage3DProxy).setProgram3D(this, vertexCode, fragmentCode);

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
			if ( this._pLightPicker)
            {

                this._pLightPicker.removeEventListener(away.events.Event.CHANGE, this.onLightsChange , this );

            }

			this._pLightPicker = value;

			if (this._pLightPicker)
            {

                this._pLightPicker.addEventListener(away.events.Event.CHANGE, this.onLightsChange , this );

            }

            this.pUpdateLights();

		}

		/**
		 * Called when the light picker's configuration changes.
		 */
		private onLightsChange(event:Event)
		{
            this.pUpdateLights();

		}

		/**
		 * Implemented by subclasses if the pass uses lights to update the shader.
		 */
		public pUpdateLights()
		{
		
		}

		/**
		 * Indicates whether visible textures (or other pixels) used by this material have
		 * already been premultiplied. Toggle this if you are seeing black halos around your
		 * blended alpha edges.
		 */
		public get alphaPremultiplied():boolean
		{
			return this._pAlphaPremultiplied;
		}
		
		public set alphaPremultiplied(value:boolean)
		{
            this._pAlphaPremultiplied = value;
            this.iInvalidateShaderProgram( false );
		}
	}
}
