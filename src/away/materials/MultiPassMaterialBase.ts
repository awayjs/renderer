///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * MultiPassMaterialBase forms an abstract base class for the default multi-pass materials provided by Away3D,
	 * using material methods to define their appearance.
	 */
	export class MultiPassMaterialBase extends away.materials.MaterialBase
	{
		private _casterLightPass:away.materials.ShadowCasterPass;
		private _nonCasterLightPasses:Array<away.materials.LightingPass>;
		public _pEffectsPass:away.materials.SuperShaderPass;

		private _alphaThreshold:number = 0;
		private _specularLightSources:number = 0x01;
		private _diffuseLightSources:number = 0x03;

		private _ambientMethod:BasicAmbientMethod = new away.materials.BasicAmbientMethod();
		private _shadowMethod:ShadowMapMethodBase;
		private _diffuseMethod:BasicDiffuseMethod = new away.materials.BasicDiffuseMethod();
		private _normalMethod:BasicNormalMethod = new away.materials.BasicNormalMethod();
		private _specularMethod:BasicSpecularMethod = new away.materials.BasicSpecularMethod();

		private _screenPassesInvalid:boolean = true;
		private _enableLightFallOff:boolean = true;

		/**
		 * Creates a new MultiPassMaterialBase object.
		 */
		constructor()
		{
			super();
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

			if (this._enableLightFallOff != value)
				this.pInvalidateScreenPasses();
			this._enableLightFallOff = value;

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
			this._alphaThreshold = value;
			this._diffuseMethod.alphaThreshold = value;
			this._pDepthPass.alphaThreshold = value;
			this._pDistancePass.alphaThreshold = value;
		}

		/**
		 * @inheritDoc
		 */
		public set depthCompareMode(value:string)
		{
			super.setDepthCompareMode(value);
			this.pInvalidateScreenPasses();
		}

		/**
		 * @inheritDoc
		 */
		public set blendMode(value:string)
		{
			super.setBlendMode(value);
			this.pInvalidateScreenPasses();
		}

		/**
		 * @inheritDoc
		 */
		public iActivateForDepth(stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D, distanceBased:boolean = false)
		{
			if (distanceBased) {
				this._pDistancePass.alphaMask = this._diffuseMethod.texture;

			} else {
				this._pDepthPass.alphaMask = this._diffuseMethod.texture;
			}

			super.iActivateForDepth(stageGLProxy, camera, distanceBased);
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
		 * @inheritDoc
		 */
		public set lightPicker(value:LightPickerBase)
		{
			if (this._pLightPicker)
				this._pLightPicker.removeEventListener(away.events.Event.CHANGE, this.onLightsChange, this);

			super.setLightPicker(value);

			if (this._pLightPicker)
				this._pLightPicker.addEventListener(away.events.Event.CHANGE, this.onLightsChange, this);
			this.pInvalidateScreenPasses();
		}

		/**
		 * @inheritDoc
		 */
		public get requiresBlending():boolean
		{
			return false;
		}

		/**
		 * The method that provides the ambient lighting contribution. Defaults to BasicAmbientMethod.
		 */
		public get ambientMethod():away.materials.BasicAmbientMethod
		{
			return this._ambientMethod;
		}

		public set ambientMethod(value:away.materials.BasicAmbientMethod)
		{
			value.copyFrom(this._ambientMethod);
			this._ambientMethod = value;
			this.pInvalidateScreenPasses();
		}

		/**
		 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
		 */
		public get shadowMethod():away.materials.ShadowMapMethodBase
		{
			return this._shadowMethod;
		}

		public set shadowMethod(value:away.materials.ShadowMapMethodBase)
		{
			if (value && this._shadowMethod)
				value.copyFrom(this._shadowMethod);
			this._shadowMethod = value;
			this.pInvalidateScreenPasses();
		}

		/**
		 * The method that provides the diffuse lighting contribution. Defaults to BasicDiffuseMethod.
		 */
		public get diffuseMethod():away.materials.BasicDiffuseMethod
		{
			return this._diffuseMethod;
		}

		public set diffuseMethod(value:away.materials.BasicDiffuseMethod)
		{
			value.copyFrom(this._diffuseMethod);
			this._diffuseMethod = value;
			this.pInvalidateScreenPasses();
		}

		/**
		 * The method that provides the specular lighting contribution. Defaults to BasicSpecularMethod.
		 */
		public get specularMethod():away.materials.BasicSpecularMethod
		{
			return this._specularMethod;
		}

		public set specularMethod(value:away.materials.BasicSpecularMethod)
		{
			if (value && this._specularMethod)
				value.copyFrom(this._specularMethod);
			this._specularMethod = value;
			this.pInvalidateScreenPasses();
		}

		/**
		 * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
		 */
		public get normalMethod():away.materials.BasicNormalMethod
		{
			return this._normalMethod;
		}

		public set normalMethod(value:away.materials.BasicNormalMethod)
		{
			value.copyFrom(this._normalMethod);
			this._normalMethod = value;
			this.pInvalidateScreenPasses();
		}

		/**
		 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
		 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
		 * methods added prior.
		 */
		public addMethod(method:away.materials.EffectMethodBase)
		{

			if (this._pEffectsPass == null) {
				this._pEffectsPass = new away.materials.SuperShaderPass(this);

			}

			this._pEffectsPass.addMethod(method);
			this.pInvalidateScreenPasses();
		}

		/**
		 * The number of "effect" methods added to the material.
		 */
		public get numMethods():number
		{
			return this._pEffectsPass? this._pEffectsPass.numMethods : 0;
		}

		/**
		 * Queries whether a given effect method was added to the material.
		 *
		 * @param method The method to be queried.
		 * @return true if the method was added to the material, false otherwise.
		 */
		public hasMethod(method:EffectMethodBase):boolean
		{
			return this._pEffectsPass? this._pEffectsPass.hasMethod(method) : false;
		}

		/**
		 * Returns the method added at the given index.
		 * @param index The index of the method to retrieve.
		 * @return The method at the given index.
		 */
		public getMethodAt(index:number):EffectMethodBase
		{
			return this._pEffectsPass.getMethodAt(index);
		}

		/**
		 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
		 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
		 * etc. The method will be applied to the result of the methods with a lower index.
		 */
		public addMethodAt(method:EffectMethodBase, index:number)
		{

			if (this._pEffectsPass == null) {
				this._pEffectsPass = new away.materials.SuperShaderPass(this);

			}

			this._pEffectsPass.addMethodAt(method, index);
			this.pInvalidateScreenPasses();

		}

		/**
		 * Removes an effect method from the material.
		 * @param method The method to be removed.
		 */
		public removeMethod(method:EffectMethodBase)
		{
			if (this._pEffectsPass)
				return;
			this._pEffectsPass.removeMethod(method);

			// reconsider
			if (this._pEffectsPass.numMethods == 0)
				this.pInvalidateScreenPasses();
		}

		/**
		 * @inheritDoc
		 */
		public set mipmap(value:boolean)
		{
			if (this._pMipmap == value)
				return;

			super.setMipMap(value);

		}

		/**
		 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
		 * tangent-space normal maps, but others could expect object-space maps.
		 */
		public get normalMap():away.textures.Texture2DBase
		{
			return this._normalMethod.normalMap;
		}

		public set normalMap(value:away.textures.Texture2DBase)
		{
			this._normalMethod.normalMap = value;
		}

		/**
		 * A specular map that defines the strength of specular reflections for each texel in the red channel,
		 * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
		 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
		 */
		public get specularMap():away.textures.Texture2DBase
		{
			return this._specularMethod.texture;
		}

		public set specularMap(value:away.textures.Texture2DBase)
		{
			if (this._specularMethod)
				this._specularMethod.texture = value; else
				throw new Error("No specular method was set to assign the specularGlossMap to");
		}

		/**
		 * The glossiness of the material (sharpness of the specular highlight).
		 */
		public get gloss():number
		{
			return this._specularMethod? this._specularMethod.gloss : 0;
		}

		public set gloss(value:number)
		{
			if (this._specularMethod)
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
			return this._specularMethod? this._specularMethod.specular : 0;
		}

		public set specular(value:number)
		{
			if (this._specularMethod)
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
		 * @inheritDoc
		 */
		public iUpdateMaterial(context:away.displayGL.ContextGL)
		{
			var passesInvalid:boolean;

			if (this._screenPassesInvalid) {
				this.pUpdateScreenPasses();
				passesInvalid = true;
			}

			if (passesInvalid || this.isAnyScreenPassInvalid()) {
				this.pClearPasses();

				this.addChildPassesFor(this._casterLightPass);

				if (this._nonCasterLightPasses) {
					for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i)
						this.addChildPassesFor(this._nonCasterLightPasses[i]);
				}

				this.addChildPassesFor(this._pEffectsPass);

				this.addScreenPass(this._casterLightPass);

				if (this._nonCasterLightPasses) {

					for (i = 0; i < this._nonCasterLightPasses.length; ++i) {
						this.addScreenPass(this._nonCasterLightPasses[i]);
					}

				}

				this.addScreenPass(this._pEffectsPass);
			}
		}

		/**
		 * Adds a compiled pass that renders to the screen.
		 * @param pass The pass to be added.
		 */
		private addScreenPass(pass:away.materials.CompiledPass)
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
			if ((this._casterLightPass && this._casterLightPass._iPassesDirty) || (this._pEffectsPass && this._pEffectsPass._iPassesDirty)) {

				return true;

			}

			if (this._nonCasterLightPasses) {
				for (var i:number = 0; i < this._nonCasterLightPasses.length; ++i) {
					if (this._nonCasterLightPasses[i]._iPassesDirty)
						return true;
				}
			}

			return false;
		}

		/**
		 * Adds any additional passes on which the given pass is dependent.
		 * @param pass The pass that my need additional passes.
		 */
		private addChildPassesFor(pass:away.materials.CompiledPass)
		{
			if (!pass)
				return;

			if (pass._iPasses) {
				var len:number = pass._iPasses.length;

				for (var i:number = 0; i < len; ++i) {
					this.pAddPass(pass._iPasses[i]);
				}
			}
		}

		/**
		 * @inheritDoc
		 */
		public iActivatePass(index:number, stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D)
		{
			if (index == 0) {
				stageGLProxy._iContextGL.setBlendFactors(away.displayGL.ContextGLBlendFactor.ONE, away.displayGL.ContextGLBlendFactor.ZERO);
			}
			super.iActivatePass(index, stageGLProxy, camera);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(stageGLProxy:away.managers.StageGLProxy)
		{
			super.iDeactivate(stageGLProxy);
			stageGLProxy._iContextGL.setBlendFactors(away.displayGL.ContextGLBlendFactor.ONE, away.displayGL.ContextGLBlendFactor.ZERO);
		}

		/**
		 * Updates screen passes when they were found to be invalid.
		 */
		public pUpdateScreenPasses()
		{
			this.initPasses();
			this.setBlendAndCompareModes();

			this._screenPassesInvalid = false;
		}

		/**
		 * Initializes all the passes and their dependent passes.
		 */
		private initPasses()
		{
			// let the effects pass handle everything if there are no lights,
			// or when there are effect methods applied after shading.
			if (this.numLights == 0 || this.numMethods > 0) {
				this.initEffectsPass();
			} else if (this._pEffectsPass && this.numMethods == 0) {
				this.removeEffectsPass();
			}

			// only use a caster light pass if shadows need to be rendered
			if (this._shadowMethod) {
				this.initCasterLightPass();
			} else {
				this.removeCasterLightPass();
			}

			// only use non caster light passes if there are lights that don't cast
			if (this.numNonCasters > 0)
				this.initNonCasterLightPasses(); else
				this.removeNonCasterLightPasses();
		}

		/**
		 * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
		 */
		private setBlendAndCompareModes()
		{
			var forceSeparateMVP:boolean = <boolean> ( this._casterLightPass || this._pEffectsPass);

			// caster light pass is always first if it exists, hence it uses normal blending
			if (this._casterLightPass) {
				this._casterLightPass.setBlendMode(away.display.BlendMode.NORMAL);
				this._casterLightPass.depthCompareMode = this._pDepthCompareMode;
				this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
			}

			if (this._nonCasterLightPasses) {
				var firstAdditiveIndex:number = 0;

				// if there's no caster light pass, the first non caster light pass will be the first
				// and should use normal blending
				if (!this._casterLightPass) {
					this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
					this._nonCasterLightPasses[0].setBlendMode(away.display.BlendMode.NORMAL);
					this._nonCasterLightPasses[0].depthCompareMode = this._pDepthCompareMode;
					firstAdditiveIndex = 1;
				}

				// all lighting passes following the first light pass should use additive blending
				for (var i:number = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
					this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
					this._nonCasterLightPasses[i].setBlendMode(away.display.BlendMode.ADD);
					this._nonCasterLightPasses[i].depthCompareMode = away.displayGL.ContextGLCompareMode.LESS_EQUAL;
				}
			}

			if (this._casterLightPass || this._nonCasterLightPasses) {

				// there are light passes, so this should be blended in
				if (this._pEffectsPass) {
					this._pEffectsPass.iIgnoreLights = true;
					this._pEffectsPass.depthCompareMode = away.displayGL.ContextGLCompareMode.LESS_EQUAL;
					this._pEffectsPass.setBlendMode(away.display.BlendMode.LAYER);
					this._pEffectsPass.forceSeparateMVP = forceSeparateMVP;
				}

			} else if (this._pEffectsPass) {
				// effects pass is the only pass, so it should just blend normally
				this._pEffectsPass.iIgnoreLights = false;
				this._pEffectsPass.depthCompareMode = this._pDepthCompareMode;

				this.depthCompareMode

				this._pEffectsPass.setBlendMode(away.display.BlendMode.NORMAL);
				this._pEffectsPass.forceSeparateMVP = false;
			}
		}

		private initCasterLightPass()
		{

			if (this._casterLightPass == null) {

				this._casterLightPass = new away.materials.ShadowCasterPass(this);

			}

			this._casterLightPass.diffuseMethod = null;
			this._casterLightPass.ambientMethod = null;
			this._casterLightPass.normalMethod = null;
			this._casterLightPass.specularMethod = null;
			this._casterLightPass.shadowMethod = null;
			this._casterLightPass.enableLightFallOff = this._enableLightFallOff;
			this._casterLightPass.lightPicker = new away.materials.StaticLightPicker([this._shadowMethod.castingLight]);
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
			if (!this._casterLightPass)
				return;
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

			this._nonCasterLightPasses = new Array<away.materials.LightingPass>();

			while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
				pass = new LightingPass(this);
				pass.enableLightFallOff = this._enableLightFallOff;
				pass.includeCasters = this._shadowMethod == null;
				pass.directionalLightsOffset = dirLightOffset;
				pass.pointLightsOffset = pointLightOffset;
				pass.lightProbesOffset = probeOffset;
				pass.diffuseMethod = null;
				pass.ambientMethod = null;
				pass.normalMethod = null;
				pass.specularMethod = null;
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
			if (this._pEffectsPass.diffuseMethod != this._diffuseMethod)
				this._pEffectsPass.diffuseMethod.dispose();

			this.pRemovePass(this._pEffectsPass);
			this._pEffectsPass.dispose();
			this._pEffectsPass = null;
		}

		private initEffectsPass():SuperShaderPass
		{

			if (this._pEffectsPass == null) {

				this._pEffectsPass = new away.materials.SuperShaderPass(this);

			}

			this._pEffectsPass.enableLightFallOff = this._enableLightFallOff;
			if (this.numLights == 0) {
				this._pEffectsPass.diffuseMethod = null;
				this._pEffectsPass.diffuseMethod = this._diffuseMethod;

			} else {
				this._pEffectsPass.diffuseMethod = null;
				this._pEffectsPass.diffuseMethod = new away.materials.BasicDiffuseMethod();
				this._pEffectsPass.diffuseMethod.diffuseColor = 0x000000;
				this._pEffectsPass.diffuseMethod.diffuseAlpha = 0;
			}

			this._pEffectsPass.preserveAlpha = false;
			this._pEffectsPass.normalMethod = null;
			this._pEffectsPass.normalMethod = this._normalMethod;

			return this._pEffectsPass;
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

		/**
		 * Flags that the screen passes have become invalid.
		 */
		public pInvalidateScreenPasses()
		{
			this._screenPassesInvalid = true;
		}

		/**
		 * Called when the light picker's configuration changed.
		 */
		private onLightsChange(event:away.events.Event)
		{
			this.pInvalidateScreenPasses();
		}

	}

}
