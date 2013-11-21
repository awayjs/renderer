///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * SuperShaderPass is a shader pass that uses shader methods to compile a complete program. It includes all methods
	 * associated with a material.
	 *
	 * @see away3d.materials.methods.ShadingMethodBase
	 */
	export class SuperShaderPass extends away.materials.CompiledPass
	{
		private _includeCasters:boolean = true;
		private _ignoreLights:boolean;

		/**
		 * Creates a new SuperShaderPass objects.
		 *
		 * @param material The material to which this material belongs.
		 */
			constructor(material:away.materials.MaterialBase)
		{
			super(material);
			this._pNeedFragmentAnimation = true;
		}

		/**
		 * @inheritDoc
		 */
		public pCreateCompiler(profile:string):away.materials.ShaderCompiler
		{
			return new away.materials.SuperShaderCompiler(profile);
		}

		/**
		 * Indicates whether lights that cast shadows should be included in the pass.
		 */
		public get includeCasters():boolean
		{
			return this._includeCasters;
		}

		public set includeCasters(value:boolean)
		{
			if (this._includeCasters == value)
				return;
			this._includeCasters = value;
			this.iInvalidateShaderProgram();//invalidateShaderProgram();
		}

		/**
		 * The ColorTransform object to transform the colour of the material with. Defaults to null.
		 */
		public get colorTransform():away.geom.ColorTransform
		{


			return this._pMethodSetup._iColorTransformMethod? this._pMethodSetup._iColorTransformMethod.colorTransform : null;
		}

		public set colorTransform(value:away.geom.ColorTransform)
		{
			if (value) {

				//colorTransformMethod ||= new away.geom.ColorTransform();
				if (this.colorTransformMethod == null) {


					this.colorTransformMethod = new away.materials.ColorTransformMethod();

				}

				this._pMethodSetup._iColorTransformMethod.colorTransform = value;

			} else if (!value) {

				if (this._pMethodSetup._iColorTransformMethod) {

					this.colorTransformMethod = null;

				}

				this.colorTransformMethod = this._pMethodSetup._iColorTransformMethod = null;
			}
		}

		/**
		 * The ColorTransformMethod object to transform the colour of the material with. Defaults to null.
		 */
		public get colorTransformMethod():away.materials.ColorTransformMethod
		{

			return this._pMethodSetup._iColorTransformMethod;
		}

		public set colorTransformMethod(value:away.materials.ColorTransformMethod)
		{
			this._pMethodSetup.iColorTransformMethod = value;
		}

		/**
		 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
		 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
		 * methods added prior.
		 */
		public addMethod(method:away.materials.EffectMethodBase)
		{
			this._pMethodSetup.addMethod(method);
		}

		/**
		 * The number of "effect" methods added to the material.
		 */
		public get numMethods():number
		{
			return this._pMethodSetup.numMethods;
		}

		/**
		 * Queries whether a given effect method was added to the material.
		 *
		 * @param method The method to be queried.
		 * @return true if the method was added to the material, false otherwise.
		 */
		public hasMethod(method:away.materials.EffectMethodBase):boolean
		{
			return this._pMethodSetup.hasMethod(method);
		}

		/**
		 * Returns the method added at the given index.
		 * @param index The index of the method to retrieve.
		 * @return The method at the given index.
		 */
		public getMethodAt(index:number):away.materials.EffectMethodBase
		{
			return this._pMethodSetup.getMethodAt(index);
		}

		/**
		 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
		 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
		 * etc. The method will be applied to the result of the methods with a lower index.
		 */
		public addMethodAt(method:away.materials.EffectMethodBase, index:number)
		{
			this._pMethodSetup.addMethodAt(method, index);
		}

		/**
		 * Removes an effect method from the material.
		 * @param method The method to be removed.
		 */
		public removeMethod(method:away.materials.EffectMethodBase)
		{
			this._pMethodSetup.removeMethod(method);
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateLights()
		{

			if (this._pLightPicker && !this._ignoreLights) {

				this._pNumPointLights = this._pLightPicker.numPointLights;
				this._pNumDirectionalLights = this._pLightPicker.numDirectionalLights;
				this._pNumLightProbes = this._pLightPicker.numLightProbes;

				if (this._includeCasters) {
					this._pNumPointLights += this._pLightPicker.numCastingPointLights;
					this._pNumDirectionalLights += this._pLightPicker.numCastingDirectionalLights;
				}

			} else {
				this._pNumPointLights = 0;
				this._pNumDirectionalLights = 0;
				this._pNumLightProbes = 0;
			}

			this.iInvalidateShaderProgram();//invalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
		{
			super.iActivate(stage3DProxy, camera);

			if (this._pMethodSetup._iColorTransformMethod)
				this._pMethodSetup._iColorTransformMethod.iActivate(this._pMethodSetup._iColorTransformMethodVO, stage3DProxy);

			var methods:away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;
			var len:number = methods.length;

			for (var i:number = 0; i < len; ++i) {

				var aset:away.materials.MethodVOSet = methods[i];
				aset.method.iActivate(aset.data, stage3DProxy);

			}


			if (this._pCameraPositionIndex >= 0) {

				var pos:away.geom.Vector3D = camera.scenePosition;

				this._pVertexConstantData[this._pCameraPositionIndex] = pos.x;
				this._pVertexConstantData[this._pCameraPositionIndex + 1] = pos.y;
				this._pVertexConstantData[this._pCameraPositionIndex + 2] = pos.z;

			}
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(stage3DProxy:away.managers.Stage3DProxy)
		{
			super.iDeactivate(stage3DProxy);

			if (this._pMethodSetup._iColorTransformMethod) {

				this._pMethodSetup._iColorTransformMethod.iDeactivate(this._pMethodSetup._iColorTransformMethodVO, stage3DProxy);

			}

			var aset:away.materials.MethodVOSet;
			var methods:away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;
			var len:number = methods.length;

			for (var i:number = 0; i < len; ++i) {
				aset = methods[i];
				aset.method.iDeactivate(aset.data, stage3DProxy);
			}

		}

		/**
		 * @inheritDoc
		 */
		public pAddPassesFromMethods()
		{
			super.pAddPassesFromMethods();

			if (this._pMethodSetup._iColorTransformMethod) {

				this.pAddPasses(this._pMethodSetup._iColorTransformMethod.passes);

			}
			var methods:away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;

			for (var i:number = 0; i < methods.length; ++i) {

				this.pAddPasses(methods[i].method.passes);

			}


		}

		/**
		 * Indicates whether any light probes are used to contribute to the specular shading.
		 */
		private usesProbesForSpecular():boolean
		{

			return this._pNumLightProbes > 0 && (this._pSpecularLightSources & away.materials.LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether any light probes are used to contribute to the diffuse shading.
		 */
		private usesProbesForDiffuse():boolean
		{

			return this._pNumLightProbes > 0 && (this._pDiffuseLightSources & away.materials.LightSources.PROBES) != 0;

		}

		/**
		 * @inheritDoc
		 */
		public pUpdateMethodConstants()
		{

			super.pUpdateMethodConstants();

			if (this._pMethodSetup._iColorTransformMethod) {

				this._pMethodSetup._iColorTransformMethod.iInitConstants(this._pMethodSetup._iColorTransformMethodVO);

			}

			var methods:away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;
			var len:number = methods.length;

			for (var i:number = 0; i < len; ++i) {

				methods[i].method.iInitConstants(methods[i].data);

			}


		}

		/**
		 * @inheritDoc
		 */
		public pUpdateLightConstants()
		{

			// first dirs, then points
			var dirLight:away.lights.DirectionalLight;

			var pointLight:away.lights.PointLight;

			var i:number, k:number;

			var len:number;

			var dirPos:away.geom.Vector3D;

			var total:number = 0;

			var numLightTypes:number = this._includeCasters? 2 : 1;

			k = this._pLightFragmentConstantIndex;

			for (var cast:number = 0; cast < numLightTypes; ++cast) {

				var dirLights:away.lights.DirectionalLight[] = cast? this._pLightPicker.castingDirectionalLights : this._pLightPicker.directionalLights;
				len = dirLights.length;
				total += len;

				for (i = 0; i < len; ++i) {

					dirLight = dirLights[i];
					dirPos = dirLight.sceneDirection;

					this._pAmbientLightR += dirLight._iAmbientR;
					this._pAmbientLightG += dirLight._iAmbientG;
					this._pAmbientLightB += dirLight._iAmbientB;

					this._pFragmentConstantData[k++] = -dirPos.x;
					this._pFragmentConstantData[k++] = -dirPos.y;
					this._pFragmentConstantData[k++] = -dirPos.z;
					this._pFragmentConstantData[k++] = 1;

					this._pFragmentConstantData[k++] = dirLight._iDiffuseR;
					this._pFragmentConstantData[k++] = dirLight._iDiffuseG;
					this._pFragmentConstantData[k++] = dirLight._iDiffuseB;
					this._pFragmentConstantData[k++] = 1;

					this._pFragmentConstantData[k++] = dirLight._iSpecularR;
					this._pFragmentConstantData[k++] = dirLight._iSpecularG;
					this._pFragmentConstantData[k++] = dirLight._iSpecularB;
					this._pFragmentConstantData[k++] = 1;
				}
			}

			// more directional supported than currently picked, need to clamp all to 0
			if (this._pNumDirectionalLights > total) {
				i = k + (this._pNumDirectionalLights - total)*12;

				while (k < i) {

					this._pFragmentConstantData[k++] = 0;

				}

			}

			total = 0;
			for (cast = 0; cast < numLightTypes; ++cast) {

				var pointLights:away.lights.PointLight[] = cast? this._pLightPicker.castingPointLights : this._pLightPicker.pointLights;

				len = pointLights.length;

				for (i = 0; i < len; ++i) {
					pointLight = pointLights[i];
					dirPos = pointLight.scenePosition;

					this._pAmbientLightR += pointLight._iAmbientR;
					this._pAmbientLightG += pointLight._iAmbientG;
					this._pAmbientLightB += pointLight._iAmbientB;

					this._pFragmentConstantData[k++] = dirPos.x;
					this._pFragmentConstantData[k++] = dirPos.y;
					this._pFragmentConstantData[k++] = dirPos.z;
					this._pFragmentConstantData[k++] = 1;

					this._pFragmentConstantData[k++] = pointLight._iDiffuseR;
					this._pFragmentConstantData[k++] = pointLight._iDiffuseG;
					this._pFragmentConstantData[k++] = pointLight._iDiffuseB;
					this._pFragmentConstantData[k++] = pointLight._pRadius*pointLight._pRadius;

					this._pFragmentConstantData[k++] = pointLight._iSpecularR;
					this._pFragmentConstantData[k++] = pointLight._iSpecularG;
					this._pFragmentConstantData[k++] = pointLight._iSpecularB;
					this._pFragmentConstantData[k++] = pointLight._pFallOffFactor;
				}
			}

			// more directional supported than currently picked, need to clamp all to 0
			if (this._pNumPointLights > total) {

				i = k + (total - this._pNumPointLights )*12;

				for (; k < i; ++k) {

					this._pFragmentConstantData[k] = 0;

				}

			}

		}

		/**
		 * @inheritDoc
		 */
		public pUpdateProbes(stage3DProxy:away.managers.Stage3DProxy)
		{

			var probe:away.lights.LightProbe;
			var lightProbes:away.lights.LightProbe[] = this._pLightPicker.lightProbes;
			var weights:number[] = this._pLightPicker.lightProbeWeights;
			var len:number = lightProbes.length;
			var addDiff:boolean = this.usesProbesForDiffuse();
			var addSpec:boolean = <boolean> (this._pMethodSetup._iSpecularMethod && this.usesProbesForSpecular());
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;

			if (!(addDiff || addSpec)) {

				return;

			}

			for (var i:number = 0; i < len; ++i) {

				probe = lightProbes[i];

				//away.Debug.throwPIR( 'SuperShaderPass' , 'pUpdateProbes' , 'context.setGLSLTextureAt - Parameters not matching');

				if (addDiff) {

					context.setTextureAt(this._pLightProbeSpecularIndices[i], probe.diffuseMap.getTextureForStage3D(stage3DProxy));//<------ TODO: implement

				}

				if (addSpec) {

					context.setTextureAt(this._pLightProbeSpecularIndices[i], probe.specularMap.getTextureForStage3D(stage3DProxy));//<------ TODO: implement

				}

			}

			this._pFragmentConstantData[this._pProbeWeightsIndex] = weights[0];
			this._pFragmentConstantData[this._pProbeWeightsIndex + 1] = weights[1];
			this._pFragmentConstantData[this._pProbeWeightsIndex + 2] = weights[2];
			this._pFragmentConstantData[this._pProbeWeightsIndex + 3] = weights[3];

		}

		/**
		 * Indicates whether lights should be ignored in this pass. This is used when only effect methods are rendered in
		 * a multipass material.
		 */
		public set iIgnoreLights(ignoreLights:boolean)
		{
			this._ignoreLights = ignoreLights;
		}

		public get iIgnoreLights():boolean
		{
			return this._ignoreLights;
		}
	}
}
