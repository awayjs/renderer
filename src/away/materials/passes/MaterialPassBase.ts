///<reference path="../../_definitions.ts"/>

module away.materials
{
	import AnimationRegisterCache		= away.animators.AnimationRegisterCache;
	import AnimationSetBase				= away.animators.AnimationSetBase;
	import AnimatorBase					= away.animators.AnimatorBase;
	import Stage						= away.base.Stage;
	import BlendMode					= away.base.BlendMode;
	import Camera						= away.entities.Camera;
	import AbstractMethodError			= away.errors.AbstractMethodError;
	import ArgumentError				= away.errors.ArgumentError;
	import Event						= away.events.Event;
	import Rectangle					= away.geom.Rectangle;
	import Matrix3D						= away.geom.Matrix3D;
	import AGALProgramCache				= away.managers.AGALProgramCache;
	import RenderableBase				= away.pool.RenderableBase;
	import IContextStageGL				= away.stagegl.IContextStageGL;
	import ContextGLBlendFactor			= away.stagegl.ContextGLBlendFactor;
	import ContextGLCompareMode			= away.stagegl.ContextGLCompareMode;
	import ContextGLTriangleFace		= away.stagegl.ContextGLTriangleFace;
	import IProgram						= away.stagegl.IProgram;
	import TextureProxyBase				= away.textures.TextureProxyBase;

	/**
	 * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
	 * a render call per required renderable.
	 */
	export class MaterialPassBase extends away.events.EventDispatcher implements IMaterialPass
	{
		public static MATERIALPASS_ID_COUNT:number = 0;

		public _iPasses:Array<IMaterialPass>;
		
		/**
		 * An id for this material pass, used to identify material passes when using animation sets.
		 *
		 * @private
		 */
		public _iUniqueId:number;

		private _material:MaterialBase;
		private _animationSet:AnimationSetBase;

		public _iPrograms:Array<IProgram> = new Array<IProgram>(8);
		public _iProgramids:Array<number> = new Array<number>(-1, -1, -1, -1, -1, -1, -1, -1);
		private _contextGLs:Array<IContextStageGL> = new Array<IContextStageGL>(8);

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
		private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

		private _blendFactorSource:string = ContextGLBlendFactor.ONE;
		private _blendFactorDest:string = ContextGLBlendFactor.ZERO;

		public _pEnableBlending:boolean = false;

		public _pBothSides:boolean;

		public  _pLightPicker:LightPickerBase;

		// TODO: AGAL conversion
		public _pAnimatableAttributes:Array<string> = new Array<string>("va0");

		// TODO: AGAL conversion
		public _pAnimationTargetRegisters:Array<string> = new Array<string>("vt0");

		// TODO: AGAL conversion
		public _pShadedTarget:string = "ft0";

		// keep track of previously rendered usage for faster cleanup of old vertex buffer streams and textures
		private static _previousUsedStreams:Array<number> = new Array<number>(0, 0, 0, 0, 0, 0, 0, 0);
		private static _previousUsedTexs:Array<number> = new Array<number>(0, 0, 0, 0, 0, 0, 0, 0);
		private _defaultCulling:string = ContextGLTriangleFace.BACK;

		private _renderToTexture:boolean;

		// render state mementos for render-to-texture passes
		private _oldTarget:TextureProxyBase;
		private _oldSurface:number;
		private _oldDepthStencil:boolean;
		private _oldRect:Rectangle;

		public  _pAlphaPremultiplied:boolean = false;
		public _pNeedFragmentAnimation:boolean;
		public  _pNeedUVAnimation:boolean;
		public _pUVTarget:string;
		public _pUVSource:string;

		private _writeDepth:boolean = true;
		private _onLightsChangeDelegate:(event:Event) => void;

		public animationRegisterCache:AnimationRegisterCache;

		/**
		 * Creates a new MaterialPassBase object.
		 */
		constructor()
		{
			super();

			this._onLightsChangeDelegate = (event:Event) => this.onLightsChange(event);
			
			this._pNumUsedStreams = 1;
			this._pNumUsedVertexConstants = 5;

			this._iUniqueId = MaterialPassBase.MATERIALPASS_ID_COUNT++;
		}

		/**
		 * The material to which this pass belongs.
		 */
		public get material():MaterialBase
		{
			return this._material;
		}

		public set material(value:MaterialBase)
		{
			this._material = value;
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
			if (this._pMipmap == value)
				return;

			this._pMipmap = value;

			this.iInvalidateShaderProgram();
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
				return;

			this._pSmooth = value;

			this.iInvalidateShaderProgram();
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
				return;

			this._pRepeat = value;

			this.iInvalidateShaderProgram();
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
		 * @see away.stagegl.ContextGLCompareMode
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
		public get animationSet():AnimationSetBase
		{
			return this._animationSet;
		}

		public set animationSet(value:AnimationSetBase)
		{
			if (this._animationSet == value)
				return;

			this._animationSet = value;

			this.iInvalidateShaderProgram();
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
				this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);

			for (var i:number = 0; i < 8; ++i) {
				if (this._iPrograms[i]) {
					away.managers.AGALProgramCache.getInstanceFromIndex(i).freeProgram(this._iProgramids[i]);
					this._iPrograms[i] = null;
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

		/**
		 * Indicates whether the pass requires any fragment animation code.
		 */
		public get needFragmentAnimation():boolean
		{
			return this._pNeedFragmentAnimation;
		}

		/**
		 * Indicates whether the pass requires any UV animation code.
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
		public iUpdateAnimationState(renderable:RenderableBase, stage:Stage, camera:Camera)
		{
			(<AnimatorBase> renderable.materialOwner.animator).setRenderState(stage, renderable, this._pNumUsedVertexConstants, this._pNumUsedStreams, camera);
		}

		/**
		 * Renders an object to the current render target.
		 *
		 * @private
		 */
		public iRender(renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
		{
			throw new AbstractMethodError();
		}

		/**
		 * Returns the vertex AGAL code for the material.
		 */
		public iGetVertexCode():string
		{
			throw new AbstractMethodError();
		}

		/**
		 * Returns the fragment AGAL code for the material.
		 */
		public iGetFragmentCode(fragmentAnimatorCode:string):string
		{
			throw new AbstractMethodError();
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
			switch (value) {

				case BlendMode.NORMAL:

					this._blendFactorSource = ContextGLBlendFactor.ONE;
					this._blendFactorDest = ContextGLBlendFactor.ZERO;
					this._pEnableBlending = false;

					break;

				case BlendMode.LAYER:

					this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
					this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
					this._pEnableBlending = true;

					break;

				case BlendMode.MULTIPLY:

					this._blendFactorSource = ContextGLBlendFactor.ZERO;
					this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
					this._pEnableBlending = true;

					break;

				case BlendMode.ADD:

					this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
					this._blendFactorDest = ContextGLBlendFactor.ONE;
					this._pEnableBlending = true;

					break;

				case BlendMode.ALPHA:

					this._blendFactorSource = ContextGLBlendFactor.ZERO;
					this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
					this._pEnableBlending = true;

					break;

				default:

					throw new ArgumentError("Unsupported blend mode!");

			}
		}

		/**
		 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
		 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
		 * @param stage The Stage object which is currently used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @private
		 */
		public iActivate(stage:Stage, camera:Camera)
		{
			var contextIndex:number = stage._iStageIndex;
			var context:IContextStageGL = <IContextStageGL> stage.context;

			context.setDepthTest(( this._writeDepth && !this._pEnableBlending ), this._depthCompareMode);

			if (this._pEnableBlending)
				context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);

			if (this._contextGLs[contextIndex] != context || !this._iPrograms[contextIndex]) {

				this._contextGLs[contextIndex] = context;

				this.iUpdateProgram(stage);
				this.dispatchEvent(new Event(Event.CHANGE));

			}

			var prevUsed:number = MaterialPassBase._previousUsedStreams[contextIndex];
			var i:number;

			for (i = this._pNumUsedStreams; i < prevUsed; ++i)
				context.setVertexBufferAt(i, null);

			prevUsed = MaterialPassBase._previousUsedTexs[contextIndex];

			for (i = this._pNumUsedTextures; i < prevUsed; ++i)
				context.setTextureAt(i, null);

			if (this._animationSet && !this._animationSet.usesCPU)
				this._animationSet.activate(stage, this);

			context.setProgram(this._iPrograms[contextIndex]);

			context.setCulling(this._pBothSides? ContextGLTriangleFace.NONE : this._defaultCulling, camera.projection.coordinateSystem);

			if (this._renderToTexture) {
				this._oldTarget = stage.renderTarget;
				this._oldSurface = stage.renderSurfaceSelector;
				this._oldDepthStencil = stage.enableDepthAndStencil;
				this._oldRect = stage.scissorRect;
			}
		}

		/**
		 * Clears the render state for the pass. This needs to be called before activating another pass.
		 * @param stage The Stage used for rendering
		 *
		 * @private
		 */
		public iDeactivate(stage:Stage)
		{
			var index:number = stage._iStageIndex;
			MaterialPassBase._previousUsedStreams[index] = this._pNumUsedStreams;
			MaterialPassBase._previousUsedTexs[index] = this._pNumUsedTextures;

			if (this._animationSet && !this._animationSet.usesCPU)
				this._animationSet.deactivate(stage, this);

			if (this._renderToTexture) {
				// kindly restore state
				(<IContextStageGL> stage.context).setRenderTarget(this._oldTarget, this._oldDepthStencil, this._oldSurface);
				stage.scissorRect = this._oldRect;
			}

			(<IContextStageGL> stage.context).setDepthTest(true, ContextGLCompareMode.LESS_EQUAL); // TODO : imeplement
		}

		/**
		 * Marks the shader program as invalid, so it will be recompiled before the next render.
		 *
		 * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
		 */
		public iInvalidateShaderProgram(updateMaterial:boolean = true)
		{
			for (var i:number = 0; i < 8; ++i)
				this._iPrograms[i] = null;

			if (this._material && updateMaterial)
				this._material.iInvalidatePasses(this);
		}

		/**
		 * Compiles the shader program.
		 * @param polyOffsetReg An optional register that contains an amount by which to inflate the model (used in single object depth map rendering).
		 */
		public iUpdateProgram(stage:Stage)
		{
			var animatorCode:string = "";
			var UVAnimatorCode:string = "";
			var fragmentAnimatorCode:string = "";
			var vertexCode:string = this.iGetVertexCode();//getVertexCode();

			if (this._animationSet && !this._animationSet.usesCPU) {

				animatorCode = this._animationSet.getAGALVertexCode(this, this._pAnimatableAttributes, this._pAnimationTargetRegisters, stage.profile);

				if (this._pNeedFragmentAnimation)
					fragmentAnimatorCode = this._animationSet.getAGALFragmentCode(this, this._pShadedTarget, stage.profile);

				if (this._pNeedUVAnimation)
					UVAnimatorCode = this._animationSet.getAGALUVCode(this, this._pUVSource, this._pUVTarget);

				this._animationSet.doneAGALCode(this);

			} else {
				var len:number = this._pAnimatableAttributes.length;

				// simply write attributes to targets, do not animate them
				// projection will pick up on targets[0] to do the projection
				for (var i:number = 0; i < len; ++i)
					animatorCode += "mov " + this._pAnimationTargetRegisters[i] + ", " + this._pAnimatableAttributes[i] + "\n";

				if (this._pNeedUVAnimation)
					UVAnimatorCode = "mov " + this._pUVTarget + "," + this._pUVSource + "\n";
			}

			vertexCode = animatorCode + UVAnimatorCode + vertexCode;

			var fragmentCode:string = this.iGetFragmentCode(fragmentAnimatorCode);

			if (Debug.ENABLE_LOG) {
				Debug.log("Compiling AGAL Code:");
				Debug.log("--------------------");
				Debug.log(vertexCode);
				Debug.log("--------------------");
				Debug.log(fragmentCode);
			}

			AGALProgramCache.getInstance(stage).setProgram(this._iProgramids, this._iPrograms, vertexCode, fragmentCode);
		}

		/**
		 * The light picker used by the material to provide lights to the material if it supports lighting.
		 *
		 * @see away.materials.LightPickerBase
		 * @see away.materials.StaticLightPicker
		 */
		public get lightPicker():LightPickerBase
		{
			return this._pLightPicker;
		}

		public set lightPicker(value:LightPickerBase)
		{
			if (this._pLightPicker)
				this._pLightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);

			this._pLightPicker = value;

			if (this._pLightPicker)
				this._pLightPicker.addEventListener(Event.CHANGE, this._onLightsChangeDelegate);

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
			if (this._pAlphaPremultiplied == value)
				return;

			this._pAlphaPremultiplied = value;

			this.iInvalidateShaderProgram(false);
		}
	}
}