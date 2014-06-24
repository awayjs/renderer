///<reference path="../_definitions.ts"/>

module away.materials
{
	import Stage						= away.base.Stage;
	import Camera						= away.entities.Camera;
	import ColorTransform				= away.geom.ColorTransform;
	import ContextGLBlendFactor			= away.stagegl.ContextGLBlendFactor;
	import ContextGLCompareMode			= away.stagegl.ContextGLCompareMode;
	import IContextStageGL				= away.stagegl.IContextStageGL;
	import Texture2DBase				= away.textures.Texture2DBase;

	/**
	 * TriangleMaterial forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	export class TriangleMaterial extends ShadowMaterialBase
	{
		private _animateUVs:boolean = false;
		private _alphaBlending:boolean = false;
		private _alpha:number = 1;
		private _colorTransform:ColorTransform;
		private _materialMode:string;
		private _casterLightPass:ShadowCasterPass;
		private _nonCasterLightPasses:Array<LightingPass>;
		private _screenPass:SuperShaderPass;

		private _alphaThreshold:number = 0;
		private _specularLightSources:number = 0x01;
		private _diffuseLightSources:number = 0x03;

		private _ambientMethod:AmbientBasicMethod = new AmbientBasicMethod();
		private _shadowMethod:ShadowMapMethodBase;
		private _diffuseMethod:DiffuseBasicMethod = new DiffuseBasicMethod();
		private _normalMethod:NormalBasicMethod = new NormalBasicMethod();
		private _specularMethod:SpecularBasicMethod = new SpecularBasicMethod();

		private _enableLightFallOff:boolean = true;

		private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;
		
		/**
		 * Creates a new TriangleMaterial object.
		 *
		 * @param texture The texture used for the material's albedo color.
		 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
		 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
		 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
		 */
		constructor(texture?:Texture2DBase, smooth?:boolean, repeat?:boolean, mipmap?:boolean);
		constructor(color?:number, alpha?:number);
		constructor(textureColor:any = null, smoothAlpha:any = null, repeat:boolean = false, mipmap:boolean = false)
		{
			super();

			this._materialMode = TriangleMaterialMode.SINGLE_PASS;

			if (textureColor instanceof Texture2DBase) {
				this.texture = <Texture2DBase> textureColor;

				this.smooth = (smoothAlpha == null)? true : false;
				this.repeat = repeat;
				this.mipmap = mipmap;
			} else {
				this.color = textureColor? Number(textureColor) : 0xCCCCCC;
				this.alpha = (smoothAlpha == null)? 1 : Number(smoothAlpha);
			}
		}


		public get materialMode():string
		{
			return this._materialMode;
		}

		public set materialMode(value:string)
		{
			if (this._materialMode == value)
				return;

			this._materialMode = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
		 */
		public get animateUVs():boolean
		{
			return this._animateUVs;
		}

		public set animateUVs(value:boolean)
		{
			this._animateUVs = value;

			this.pInvalidateScreenPasses();
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
			if (this._depthCompareMode == value)
				return;

			this._depthCompareMode = value;

			this.pInvalidateScreenPasses();
		}
		
		/**
		 * The alpha of the surface.
		 */
		public get alpha():number
		{
			return this._alpha;
		}

		public set alpha(value:number)
		{
			if (value > 1)
				value = 1;
			else if (value < 0)
				value = 0;

			if (this._alpha == value)
				return;

			this._alpha = value;

			if (this._colorTransform == null)
				this._colorTransform = new ColorTransform();

			this._colorTransform.alphaMultiplier = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * The ColorTransform object to transform the colour of the material with. Defaults to null.
		 */
		public get colorTransform():ColorTransform
		{
			return this._screenPass.colorTransform;
		}

		public set colorTransform(value:ColorTransform)
		{
			this._screenPass.colorTransform = value;
		}

		/**
		 * The diffuse reflectivity color of the surface.
		 */
		public get color():number
		{
			return this._diffuseMethod.diffuseColor;
		}

		public set color(value:number)
		{
			this._diffuseMethod.diffuseColor = value;
		}

		/**
		 * The texture object to use for the albedo colour.
		 */
		public get texture():Texture2DBase
		{
			return this._diffuseMethod.texture;
		}

		public set texture(value:Texture2DBase)
		{
			this._diffuseMethod.texture = value;

			if (value) {
				this._pHeight = value.height;
				this._pWidth = value.width;
			}
		}

		/**
		 * The texture object to use for the ambient colour.
		 */
		public get ambientTexture():Texture2DBase
		{
			return this.ambientMethod.texture;
		}

		public set ambientTexture(value:Texture2DBase)
		{
			this._ambientMethod.texture = value;

			this._diffuseMethod.iUseAmbientTexture = (value != null);
		}

		/**
		 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
		 * compatibility for constrained mode.
		 */
		public get enableLightFallOff():boolean
		{
			return this._enableLightFallOff;
		}

		public set enableLightFallOff(value:boolean)
		{
			if (this._enableLightFallOff == value)
				return;

			this._enableLightFallOff = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
		public get alphaThreshold():number
		{
			return this._alphaThreshold;
		}

		public set alphaThreshold(value:number)
		{
			if (this._alphaThreshold == value)
				return;

			this._alphaThreshold = value;

			this._diffuseMethod.alphaThreshold = value;
			this._pDepthPass.alphaThreshold = value;
			this._pDistancePass.alphaThreshold = value;
		}

		/**
		 * Define which light source types to use for specular reflections. This allows choosing between regular lights
		 * and/or light probes for specular reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get specularLightSources():number
		{
			return this._specularLightSources;
		}

		public set specularLightSources(value:number)
		{
			this._specularLightSources = value;
		}

		/**
		 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
		 * and/or light probes for diffuse reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get diffuseLightSources():number
		{
			return this._diffuseLightSources;
		}

		public set diffuseLightSources(value:number)
		{
			this._diffuseLightSources = value;
		}

		/**
		 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
		 */
		public get ambientMethod():AmbientBasicMethod
		{
			return this._ambientMethod;
		}

		public set ambientMethod(value:AmbientBasicMethod)
		{
			if (this._ambientMethod == value)
				return;

			if (value && this._ambientMethod)
				value.copyFrom(this._ambientMethod);

			this._ambientMethod = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
		 */
		public get shadowMethod():ShadowMapMethodBase
		{
			return this._shadowMethod;
		}

		public set shadowMethod(value:ShadowMapMethodBase)
		{
			if (this._shadowMethod == value)
				return;

			if (value && this._shadowMethod)
				value.copyFrom(this._shadowMethod);

			this._shadowMethod = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
		 */
		public get diffuseMethod():DiffuseBasicMethod
		{
			return this._diffuseMethod;
		}

		public set diffuseMethod(value:DiffuseBasicMethod)
		{
			if (this._diffuseMethod == value)
				return;

			if (value && this._diffuseMethod)
				value.copyFrom(this._diffuseMethod);

			this._diffuseMethod = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
		 */
		public get specularMethod():SpecularBasicMethod
		{
			return this._specularMethod;
		}

		public set specularMethod(value:SpecularBasicMethod)
		{
			if (this._specularMethod == value)
				return;

			if (value && this._specularMethod)
				value.copyFrom(this._specularMethod);

			this._specularMethod = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
		 */
		public get normalMethod():NormalBasicMethod
		{
			return this._normalMethod;
		}

		public set normalMethod(value:NormalBasicMethod)
		{
			if (this._normalMethod == value)
				return;

			if (value && this._normalMethod)
				value.copyFrom(this._normalMethod);

			this._normalMethod = value;

			this.pInvalidateScreenPasses();
		}

		/**
		 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
		 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
		 * methods added prior.
		 */
		public addEffectMethod(method:EffectMethodBase)
		{
			if (this._screenPass == null)
				this._screenPass = new SuperShaderPass(this);

			this._screenPass.addMethod(method);

			this.pInvalidateScreenPasses();
		}

		/**
		 * The number of "effect" methods added to the material.
		 */
		public get numEffectMethods():number
		{
			return this._screenPass? this._screenPass.numMethods : 0;
		}

		/**
		 * Queries whether a given effect method was added to the material.
		 *
		 * @param method The method to be queried.
		 * @return true if the method was added to the material, false otherwise.
		 */
		public hasEffectMethod(method:EffectMethodBase):boolean
		{
			return this._screenPass? this._screenPass.hasMethod(method) : false;
		}

		/**
		 * Returns the method added at the given index.
		 * @param index The index of the method to retrieve.
		 * @return The method at the given index.
		 */
		public getEffectMethodAt(index:number):EffectMethodBase
		{
			if (this._screenPass == null)
				return null;

			return this._screenPass.getMethodAt(index);
		}

		/**
		 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
		 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
		 * etc. The method will be applied to the result of the methods with a lower index.
		 */
		public addEffectMethodAt(method:EffectMethodBase, index:number)
		{
			if (this._screenPass == null)
				this._screenPass = new SuperShaderPass(this);

			this._screenPass.addMethodAt(method, index);

			this.pInvalidateScreenPasses();
		}

		/**
		 * Removes an effect method from the material.
		 * @param method The method to be removed.
		 */
		public removeEffectMethod(method:EffectMethodBase)
		{
			if (this._screenPass == null)
				return;

			this._screenPass.removeMethod(method);

			// reconsider
			if (this._screenPass.numMethods == 0)
				this.pInvalidateScreenPasses();
		}

		/**
		 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
		 * tangent-space normal maps, but others could expect object-space maps.
		 */
		public get normalMap():Texture2DBase
		{
			return this._normalMethod.normalMap;
		}

		public set normalMap(value:Texture2DBase)
		{
			this._normalMethod.normalMap = value;
		}

		/**
		 * A specular map that defines the strength of specular reflections for each texel in the red channel,
		 * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
		 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
		 */
		public get specularMap():Texture2DBase
		{
			return this._specularMethod.texture;
		}

		public set specularMap(value:Texture2DBase)
		{
			this._specularMethod.texture = value;
		}

		/**
		 * The glossiness of the material (sharpness of the specular highlight).
		 */
		public get gloss():number
		{
			return this._specularMethod.gloss;
		}

		public set gloss(value:number)
		{
			this._specularMethod.gloss = value;
		}

		/**
		 * The strength of the ambient reflection.
		 */
		public get ambient():number
		{
			return this._ambientMethod.ambient;
		}

		public set ambient(value:number)
		{
			this._ambientMethod.ambient = value;
		}

		/**
		 * The overall strength of the specular reflection.
		 */
		public get specular():number
		{
			return this._specularMethod.specular;
		}

		public set specular(value:number)
		{
			this._specularMethod.specular = value;
		}

		/**
		 * The colour of the ambient reflection.
		 */
		public get ambientColor():number
		{
			return this._ambientMethod.ambientColor;
		}

		public set ambientColor(value:number)
		{
			this._ambientMethod.ambientColor = value;
		}

		/**
		 * The colour of the specular reflection.
		 */
		public get specularColor():number
		{
			return this._specularMethod.specularColor;
		}

		public set specularColor(value:number)
		{
			this._specularMethod.specularColor = value;
		}

		/**
		 * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
		 * example when using textures of foliage, consider using alphaThreshold instead.
		 */

		public get alphaBlending():boolean
		{
			return this._alphaBlending;
		}

		public set alphaBlending(value:boolean)
		{
			if (this._alphaBlending == value)
				return;

			this._alphaBlending = value;

			this.pInvalidateScreenPasses();
		}


		/**
		 * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
		 * depth or distances (fe: shadow maps, depth pre-pass).
		 *
		 * @param stage The Stage used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
		 * is required for shadow cube maps.
		 *
		 * @internal
		 */
		public iActivateForDepth(stage:Stage, camera:Camera, distanceBased:boolean = false) // ARCANE
		{
			if (distanceBased)
				this._pDistancePass.alphaMask = this._diffuseMethod.texture;
			else
				this._pDepthPass.alphaMask = this._diffuseMethod.texture;

			super.iActivateForDepth(stage, camera, distanceBased)
		}

		/**
		 * @inheritDoc
		 */
		public iUpdateMaterial()
		{
			var passesInvalid:boolean;

			if (this._pScreenPassesInvalid) {
				this.pUpdateScreenPasses();
				passesInvalid = true;
			}

			if (passesInvalid || this.isAnyScreenPassInvalid()) {
				this.pClearPasses();

				this.pAddDepthPasses();

				if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
					this.pAddChildPassesFor(this._casterLightPass);

					if (this._nonCasterLightPasses)
						for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
							this.pAddChildPassesFor(this._nonCasterLightPasses[i]);
				}

				this.pAddChildPassesFor(this._screenPass);

				if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
					this.addScreenPass(this._casterLightPass);

					if (this._nonCasterLightPasses)
						for (i = 0; i < this._nonCasterLightPasses.length; ++i)
							this.addScreenPass(this._nonCasterLightPasses[i]);
				}

				this.addScreenPass(this._screenPass);
			}
		}

		/**
		 * Adds a compiled pass that renders to the screen.
		 * @param pass The pass to be added.
		 */
		private addScreenPass(pass:CompiledPass)
		{
			if (pass) {
				this.pAddPass(pass);
				pass._iPassesDirty = false;
			}
		}

		/**
		 * Tests if any pass that renders to the screen is invalid. This would trigger a new setup of the multiple passes.
		 * @return
		 */
		private isAnyScreenPassInvalid():boolean
		{
			if ((this._casterLightPass && this._casterLightPass._iPassesDirty) || (this._screenPass && this._screenPass._iPassesDirty))
				return true;

			if (this._nonCasterLightPasses)
				for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
					if (this._nonCasterLightPasses[i]._iPassesDirty)
						return true;

			return false;
		}

		/**
		 * @inheritDoc
		 */
		public iActivatePass(index:number, stage:Stage, camera:Camera)
		{
			if (index == 0)
				(<IContextStageGL> stage.context).setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

			super.iActivatePass(index, stage, camera);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(stage:Stage)
		{
			super.iDeactivate(stage);

			(<IContextStageGL> stage.context).setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		}

		/**
		 * Updates screen passes when they were found to be invalid.
		 */
		public pUpdateScreenPasses()
		{
			this.initPasses();

			this.setBlendAndCompareModes();

			this._pScreenPassesInvalid = false;
		}

		/**
		 * Initializes all the passes and their dependent passes.
		 */
		private initPasses()
		{
			// let the effects pass handle everything if there are no lights, when there are effect methods applied
			// after shading, or when the material mode is single pass.
			if (this.numLights == 0 || this.numEffectMethods > 0 || this._materialMode == TriangleMaterialMode.SINGLE_PASS)
				this.initEffectsPass();
			else if (this._screenPass)
				this.removeEffectsPass();

			// only use a caster light pass if shadows need to be rendered
			if (this._shadowMethod && this._materialMode == TriangleMaterialMode.MULTI_PASS)
				this.initCasterLightPass();
			else if (this._casterLightPass)
				this.removeCasterLightPass();

			// only use non caster light passes if there are lights that don't cast
			if (this.numNonCasters > 0 && this._materialMode == TriangleMaterialMode.MULTI_PASS)
				this.initNonCasterLightPasses();
			else if (this._nonCasterLightPasses)
				this.removeNonCasterLightPasses();
		}

		/**
		 * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
		 */
		private setBlendAndCompareModes()
		{
			var forceSeparateMVP:boolean = <boolean> ( this._casterLightPass || this._screenPass);

			// caster light pass is always first if it exists, hence it uses normal blending
			if (this._casterLightPass) {
				this._casterLightPass.setBlendMode(away.base.BlendMode.NORMAL);
				this._casterLightPass.depthCompareMode = this._depthCompareMode;
				this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
			}

			if (this._nonCasterLightPasses) {
				var firstAdditiveIndex:number = 0;

				// if there's no caster light pass, the first non caster light pass will be the first
				// and should use normal blending
				if (!this._casterLightPass) {
					this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
					this._nonCasterLightPasses[0].setBlendMode(away.base.BlendMode.NORMAL);
					this._nonCasterLightPasses[0].depthCompareMode = this._depthCompareMode;
					firstAdditiveIndex = 1;
				}

				// all lighting passes following the first light pass should use additive blending
				for (var i:number = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
					this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
					this._nonCasterLightPasses[i].setBlendMode(away.base.BlendMode.ADD);
					this._nonCasterLightPasses[i].depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
				}
			}

			if (this._casterLightPass || this._nonCasterLightPasses) {
				//cannot be blended by blendmode property if multipass enabled
				this._pRequiresBlending = false;

				// there are light passes, so this should be blended in
				if (this._screenPass) {
					this._screenPass.iIgnoreLights = true;
					this._screenPass.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
					this._screenPass.setBlendMode(away.base.BlendMode.LAYER);
					this._screenPass.forceSeparateMVP = forceSeparateMVP;
				}

			} else if (this._screenPass) {
				this._pRequiresBlending = (this._pBlendMode != away.base.BlendMode.NORMAL || this._alphaBlending || (this._colorTransform && this._colorTransform.alphaMultiplier < 1));
				// effects pass is the only pass, so it should just blend normally
				this._screenPass.iIgnoreLights = false;
				this._screenPass.depthCompareMode = this._depthCompareMode;
				this._screenPass.preserveAlpha = this._pRequiresBlending;
				this._screenPass.colorTransform = this._colorTransform;
				this._screenPass.setBlendMode((this._pBlendMode == away.base.BlendMode.NORMAL && this._pRequiresBlending)? away.base.BlendMode.LAYER : this._pBlendMode);
				this._screenPass.forceSeparateMVP = false;
			}
		}

		private initCasterLightPass()
		{

			if (this._casterLightPass == null)
				this._casterLightPass = new ShadowCasterPass(this);

			this._casterLightPass.enableLightFallOff = this._enableLightFallOff;
			this._casterLightPass.animateUVs = this._animateUVs;
			this._casterLightPass.lightPicker = new StaticLightPicker([this._shadowMethod.castingLight]);
			this._casterLightPass.shadowMethod = this._shadowMethod;
			this._casterLightPass.diffuseMethod = this._diffuseMethod;
			this._casterLightPass.ambientMethod = this._ambientMethod;
			this._casterLightPass.normalMethod = this._normalMethod;
			this._casterLightPass.specularMethod = this._specularMethod;
			this._casterLightPass.diffuseLightSources = this._diffuseLightSources;
			this._casterLightPass.specularLightSources = this._specularLightSources;
		}

		private removeCasterLightPass()
		{
			this._casterLightPass.dispose();
			this.pRemovePass(this._casterLightPass);
			this._casterLightPass = null;
		}

		private initNonCasterLightPasses()
		{
			this.removeNonCasterLightPasses();
			var pass:LightingPass;
			var numDirLights:number = this._pLightPicker.numDirectionalLights;
			var numPointLights:number = this._pLightPicker.numPointLights;
			var numLightProbes:number = this._pLightPicker.numLightProbes;
			var dirLightOffset:number = 0;
			var pointLightOffset:number = 0;
			var probeOffset:number = 0;

			if (!this._casterLightPass) {
				numDirLights += this._pLightPicker.numCastingDirectionalLights;
				numPointLights += this._pLightPicker.numCastingPointLights;
			}

			this._nonCasterLightPasses = new Array<LightingPass>();

			while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
				pass = new LightingPass(this);
				pass.enableLightFallOff = this._enableLightFallOff;
				pass.animateUVs = this._animateUVs;
				pass.includeCasters = this._shadowMethod == null;
				pass.directionalLightsOffset = dirLightOffset;
				pass.pointLightsOffset = pointLightOffset;
				pass.lightProbesOffset = probeOffset;
				pass.lightPicker = this._pLightPicker;
				pass.diffuseMethod = this._diffuseMethod;
				pass.ambientMethod = this._ambientMethod;
				pass.normalMethod = this._normalMethod;
				pass.specularMethod = this._specularMethod;
				pass.diffuseLightSources = this._diffuseLightSources;
				pass.specularLightSources = this._specularLightSources;
				this._nonCasterLightPasses.push(pass);

				dirLightOffset += pass.iNumDirectionalLights;
				pointLightOffset += pass.iNumPointLights;
				probeOffset += pass.iNumLightProbes;
			}
		}

		private removeNonCasterLightPasses()
		{
			if (!this._nonCasterLightPasses)
				return;

			for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i) {
				this.pRemovePass(this._nonCasterLightPasses[i]);
				this._nonCasterLightPasses[i].dispose();
			}

			this._nonCasterLightPasses = null;
		}

		private removeEffectsPass()
		{
			if (this._screenPass.ambientMethod != this._ambientMethod)
				this._screenPass.ambientMethod.dispose();

			if (this._screenPass.diffuseMethod != this._diffuseMethod)
				this._screenPass.diffuseMethod.dispose();

			if (this._screenPass.specularMethod != this._specularMethod)
				this._screenPass.specularMethod.dispose();

			if (this._screenPass.normalMethod != this._normalMethod)
				this._screenPass.normalMethod.dispose();

			this.pRemovePass(this._screenPass);

			this._screenPass.dispose();
			this._screenPass = null;
		}

		private initEffectsPass()
		{
			if (this._screenPass == null)
				this._screenPass = new SuperShaderPass(this);

			this._screenPass.enableLightFallOff = this._enableLightFallOff;
			this._screenPass.animateUVs = this._animateUVs;

			if (this._materialMode == TriangleMaterialMode.SINGLE_PASS) {
				this._screenPass.ambientMethod = this._ambientMethod;
				this._screenPass.diffuseMethod = this._diffuseMethod;
				this._screenPass.specularMethod = this._specularMethod;
				this._screenPass.normalMethod = this._normalMethod;
				this._screenPass.shadowMethod = this._shadowMethod;
			} else if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
				if (this.numLights == 0) {
					this._screenPass.diffuseMethod = this._diffuseMethod;
				} else {
					this._screenPass.diffuseMethod = new DiffuseBasicMethod();
					this._screenPass.diffuseMethod.diffuseColor = 0x000000;
					this._screenPass.diffuseMethod.diffuseAlpha = 0;
				}

				this._screenPass.preserveAlpha = false;
				this._screenPass.normalMethod = this._normalMethod;
			}
		}

		/**
		 * The maximum total number of lights provided by the light picker.
		 */
		private get numLights():number
		{
			return this._pLightPicker? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights + this._pLightPicker.numCastingDirectionalLights + this._pLightPicker.numCastingPointLights : 0;
		}

		/**
		 * The amount of lights that don't cast shadows.
		 */
		private get numNonCasters():number
		{
			return this._pLightPicker? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights : 0;
		}
	}
}
