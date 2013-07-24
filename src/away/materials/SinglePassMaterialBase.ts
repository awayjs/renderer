///<reference path="../_definitions.ts"/>

module away.materials
{

	/**
	 * SinglePassMaterialBase forms an abstract base class for the default single-pass materials provided by Away3D,
	 * using material methods to define their appearance.
	 */
	export class SinglePassMaterialBase extends away.materials.MaterialBase
	{
		public _pScreenPass:away.materials.SuperShaderPass;
		private _alphaBlending:boolean;
		
		/**
		 * Creates a new SinglePassMaterialBase object.
		 */
		constructor()
		{
			super();

            this.pAddPass( this._pScreenPass = new away.materials.SuperShaderPass(this) );
		}
		
		/**
		 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
		 * compatibility for constrained mode.
		 */
		public get enableLightFallOff():boolean
		{
			return this._pScreenPass.enableLightFallOff;
		}
		
		public set enableLightFallOff(value:boolean)
		{
            this._pScreenPass.enableLightFallOff = value;
		}
		
		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
		public get alphaThreshold():number
		{

			return this._pScreenPass.diffuseMethod.alphaThreshold;

		}
		
		public set alphaThreshold(value:number)
		{



            this._pScreenPass.diffuseMethod.alphaThreshold = value;

            this._pDepthPass.alphaThreshold = value;
            this._pDistancePass.alphaThreshold = value;


		}

		/**
		 * @inheritDoc
		 */
		public set blendMode(value:string)
		{

            super.setBlendMode( value );
			this._pScreenPass.setBlendMode( ( this._pBlendMode == away.display.BlendMode.NORMAL ) && this.requiresBlending?  away.display.BlendMode.LAYER : this._pBlendMode);

		}

		/**
		 * @inheritDoc
		 */
		public set depthCompareMode(value:string)
		{

			this._pDepthCompareMode = value;
			this._pScreenPass.depthCompareMode = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivateForDepth(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D, distanceBased:boolean = false)
		{

			if (distanceBased){

                this._pDistancePass.alphaMask = this._pScreenPass.diffuseMethod.texture;

            }
			else
            {

                this._pDepthPass.alphaMask = this._pScreenPass.diffuseMethod.texture;

            }

			super.iActivateForDepth(stage3DProxy, camera, distanceBased);

		}

		/**
		 * Define which light source types to use for specular reflections. This allows choosing between regular lights
		 * and/or light probes for specular reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get specularLightSources():number
		{
			return this._pScreenPass.specularLightSources;
		}
		
		public set specularLightSources(value:number)
		{
			this._pScreenPass.specularLightSources = value;
		}

		/**
		 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
		 * and/or light probes for diffuse reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get diffuseLightSources():number
		{
			return this._pScreenPass.diffuseLightSources;
		}
		
		public set diffuseLightSources(value:number)
		{
            this._pScreenPass.diffuseLightSources = value;
		}

		/**
		 * @inheritDoc
		 */
		public get requiresBlending():boolean
		{
			return super.getRequiresBlending() || this._alphaBlending || ( this._pScreenPass.colorTransform && this._pScreenPass.colorTransform.alphaMultiplier < 1);
		}

		/**
		 * The ColorTransform object to transform the colour of the material with. Defaults to null.
		 */
		public get colorTransform():away.geom.ColorTransform
		{
			return this._pScreenPass.colorTransform;
		}

        public set colorTransform(value:away.geom.ColorTransform)
        {
            this.setColorTransform( value )
        }

        public setColorTransform(value:away.geom.ColorTransform)
        {
            this._pScreenPass.colorTransform = value;
        }

		/**
		 * The method that provides the ambient lighting contribution. Defaults to BasicAmbientMethod.
		 */

		public get ambientMethod():BasicAmbientMethod
		{
			return this._pScreenPass.ambientMethod;
		}
		
		public set ambientMethod(value:BasicAmbientMethod)
		{
			this._pScreenPass.ambientMethod = value;
		}

		/**
		 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
		 */
		public get shadowMethod():ShadowMapMethodBase
		{
			return this._pScreenPass.shadowMethod;
		}
		
		public set shadowMethod(value:ShadowMapMethodBase)
		{
			this._pScreenPass.shadowMethod = value;
		}

		/**
		 * The method that provides the diffuse lighting contribution. Defaults to BasicDiffuseMethod.
		 */

		public get diffuseMethod():BasicDiffuseMethod
		{
			return this._pScreenPass.diffuseMethod;
		}
		
		public set diffuseMethod(value:BasicDiffuseMethod)
		{
			this._pScreenPass.diffuseMethod = value;
		}

		/**
		 * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
		 */

		public get normalMethod():BasicNormalMethod
		{
			return this._pScreenPass.normalMethod;
		}
		
		public set normalMethod(value:BasicNormalMethod)
		{
			this._pScreenPass.normalMethod = value;
		}

		/**
		 * The method that provides the specular lighting contribution. Defaults to BasicSpecularMethod.
		 */

		public get specularMethod():BasicSpecularMethod
		{
			return this._pScreenPass.specularMethod;
		}
		
		public set specularMethod(value:BasicSpecularMethod)
		{
			this._pScreenPass.specularMethod = value;
		}

		/**
		 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
		 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
		 * methods added prior.
		 */
		public addMethod(method:away.materials.EffectMethodBase)
		{
			this._pScreenPass.addMethod(method);
		}

		/**
		 * The number of "effect" methods added to the material.
		 */

		public get numMethods():number
		{
			return this._pScreenPass.numMethods;
		}

		/**
		 * Queries whether a given effect method was added to the material.
		 *
		 * @param method The method to be queried.
		 * @return true if the method was added to the material, false otherwise.
		 */
		public hasMethod(method:away.materials.EffectMethodBase):boolean
		{
			return this._pScreenPass.hasMethod(method);
		}

		/**
		 * Returns the method added at the given index.
		 * @param index The index of the method to retrieve.
		 * @return The method at the given index.
		 */
		public getMethodAt(index:number):away.materials.EffectMethodBase
		{
			return this._pScreenPass.getMethodAt(index);
		}

		/**
		 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
		 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
		 * etc. The method will be applied to the result of the methods with a lower index.
		 */
		public addMethodAt(method:away.materials.EffectMethodBase, index:number)
		{
			this._pScreenPass.addMethodAt(method, index);
		}

		/**
		 * Removes an effect method from the material.
		 * @param method The method to be removed.
		 */
		public removeMethod(method:away.materials.EffectMethodBase)
		{
			this._pScreenPass.removeMethod(method);
		}
		
		/**
		 * @inheritDoc
		 */
		public set mipmap(value:boolean)
		{
			if (this._pMipmap == value)
				return;

			this.setMipMap( value );
		}

		/**
		 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
		 * tangent-space normal maps, but others could expect object-space maps.
		 */
		public get normalMap():away.textures.Texture2DBase
		{
			return this._pScreenPass.normalMap;
		}
		
		public set normalMap(value:away.textures.Texture2DBase)
		{
			this._pScreenPass.normalMap = value;
		}
		
		/**
		 * A specular map that defines the strength of specular reflections for each texel in the red channel,
		 * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
		 * specular and gloss maps from grayscale images, but correctly authored images are preferred.
		 */

		public get specularMap():away.textures.Texture2DBase
		{
			return this._pScreenPass.specularMethod.texture;
		}
		
		public set specularMap(value:away.textures.Texture2DBase)
		{
			if (this._pScreenPass.specularMethod)
            {

                this._pScreenPass.specularMethod.texture = value;
            }
			else
            {

                throw new away.errors.Error("No specular method was set to assign the specularGlossMap to");

            }

		}

		/**
		 * The glossiness of the material (sharpness of the specular highlight).
		 */

		public get gloss():number
		{
			return this._pScreenPass.specularMethod? this._pScreenPass.specularMethod.gloss : 0;
		}
		
		public set gloss(value:number)
		{
			if (this._pScreenPass.specularMethod)
                this._pScreenPass.specularMethod.gloss = value;
		}

		/**
		 * The strength of the ambient reflection.
		 */

		public get ambient():number
		{
			return this._pScreenPass.ambientMethod.ambient;
		}
		
		public set ambient(value:number)
		{
            this._pScreenPass.ambientMethod.ambient = value;
		}

		/**
		 * The overall strength of the specular reflection.
		 */

		public get specular():number
		{
			return this._pScreenPass.specularMethod? this._pScreenPass.specularMethod.specular : 0;
		}
		
		public set specular(value:number)
		{
			if (this._pScreenPass.specularMethod)
                this._pScreenPass.specularMethod.specular = value;
		}

		/**
		 * The colour of the ambient reflection.
		 */

		public get ambientColor():number
		{
			return this._pScreenPass.ambientMethod.ambientColor;
		}
		
		public set ambientColor(value:number)
		{
            this._pScreenPass.ambientMethod.ambientColor = value;
		}

		/**
		 * The colour of the specular reflection.
		 */

		public get specularColor():number
		{
			return this._pScreenPass.specularMethod.specularColor;
		}
		
		public set specularColor(value:number)
		{
			this._pScreenPass.specularMethod.specularColor = value;
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

			this._alphaBlending = value;
			this._pScreenPass.setBlendMode(this.getBlendMode() == away.display.BlendMode.NORMAL && this.requiresBlending? away.display.BlendMode.LAYER : this.getBlendMode() );
			this._pScreenPass.preserveAlpha = this.requiresBlending;

		}
		
		/**
		 * @inheritDoc
		 */
		public iUpdateMaterial(context:away.display3D.Context3D)
		{
			if (this._pScreenPass._iPassesDirty)
            {

                this.pClearPasses();

				if (this._pScreenPass._iPasses)
                {

					var len:number = this._pScreenPass._iPasses.length;

					for (var i:number = 0; i < len; ++i)
                    {

                        this.pAddPass(this._pScreenPass._iPasses[i]);

                    }

				}
				
				this.pAddPass(this._pScreenPass);
				this._pScreenPass._iPassesDirty = false;
			}
		}

		/**
		 * @inheritDoc
		 */
		public set lightPicker(value:away.materials.LightPickerBase)
		{

			super.setLightPicker( value );
			this._pScreenPass.lightPicker = value;
		}
	}
}
