///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.arcane;
	//import away3d.cameras.Camera3D;
	//import away3d.core.base.IRenderable;
	//import away3d.managers.StageGLProxy;
	//import away3d.lights.DirectionalLight;
	//import away3d.lights.LightProbe;
	//import away3d.lights.PointLight;
	//import away3d.materials.LightSources;
	//import away3d.materials.MaterialBase;
	//import away3d.materials.compilation.LightingShaderCompiler;
	//import away3d.materials.compilation.ShaderCompiler;

	//import flash.displayGL.ContextGL;
	//import flash.geom.Matrix3D;
	//import flash.geom.Vector3D;

	//use namespace arcane;

	/**
	 * LightingPass is a shader pass that uses shader methods to compile a complete program. It only includes the lighting
	 * methods. It's used by multipass materials to accumulate lighting passes.
	 *
	 * @see away3d.materials.MultiPassMaterialBase
	 */

	export class LightingPass extends CompiledPass
	{
		private _includeCasters:boolean = true;
		private _tangentSpace:boolean;
		private _lightVertexConstantIndex:number;
		private _inverseSceneMatrix:number[] = new Array<number>();

		private _directionalLightsOffset:number;
		private _pointLightsOffset:number;
		private _lightProbesOffset:number;
		private _maxLights:number = 3;

		/**
		 * Creates a new LightingPass objects.
		 *
		 * @param material The material to which this pass belongs.
		 */
		constructor(material:MaterialBase)
		{
			super(material);
		}

		/**
		 * Indicates the offset in the light picker's directional light vector for which to start including lights.
		 * This needs to be set before the light picker is assigned.
		 */
		public get directionalLightsOffset():number
		{
			return this._directionalLightsOffset;
		}

		public set directionalLightsOffset(value:number)
		{
			this._directionalLightsOffset = value;
		}

		/**
		 * Indicates the offset in the light picker's point light vector for which to start including lights.
		 * This needs to be set before the light picker is assigned.
		 */
		public get pointLightsOffset():number
		{
			return this._pointLightsOffset;
		}

		public set pointLightsOffset(value:number)
		{
			this._pointLightsOffset = value;
		}

		/**
		 * Indicates the offset in the light picker's light probes vector for which to start including lights.
		 * This needs to be set before the light picker is assigned.
		 */
		public get lightProbesOffset():number
		{
			return this._lightProbesOffset;
		}

		public set lightProbesOffset(value:number)
		{
			this._lightProbesOffset = value;
		}

		/**
		 * @inheritDoc
		 */
		public pCreateCompiler(profile:string):ShaderCompiler
		{
			this._maxLights = profile == "baselineConstrained"? 1 : 3;
			return new LightingShaderCompiler(profile);
		}

		/**
		 * Indicates whether or not shadow casting lights need to be included.
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
			this.iInvalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateLights()
		{
			super.pUpdateLights();
			var numDirectionalLightsOld:number = this._pNumDirectionalLights;
			var numPointLightsOld:number = this._pNumPointLights;
			var numLightProbesOld:number = this._pNumLightProbes;

			if (this._pLightPicker) {
				this._pNumDirectionalLights = this.calculateNumDirectionalLights(this._pLightPicker.numDirectionalLights);
				this._pNumPointLights = this.calculateNumPointLights(this._pLightPicker.numPointLights);
				this._pNumLightProbes = this.calculateNumProbes(this._pLightPicker.numLightProbes);

				if (this._includeCasters) {
					this._pNumDirectionalLights += this._pLightPicker.numCastingDirectionalLights;
					this._pNumPointLights += this._pLightPicker.numCastingPointLights;
				}

			} else {
				this._pNumDirectionalLights = 0;
				this._pNumPointLights = 0;
				this._pNumLightProbes = 0;
			}

			if (numDirectionalLightsOld != this._pNumDirectionalLights || numPointLightsOld != this._pNumPointLights || numLightProbesOld != this._pNumLightProbes)
				this.iInvalidateShaderProgram();
		}

		/**
		 * Calculates the amount of directional lights this material will support.
		 * @param numDirectionalLights The maximum amount of directional lights to support.
		 * @return The amount of directional lights this material will support, bounded by the amount necessary.
		 */
		private calculateNumDirectionalLights(numDirectionalLights:number):number
		{
			return Math.min(numDirectionalLights - this._directionalLightsOffset, this._maxLights);
		}

		/**
		 * Calculates the amount of point lights this material will support.
		 * @param numDirectionalLights The maximum amount of point lights to support.
		 * @return The amount of point lights this material will support, bounded by the amount necessary.
		 */
		private calculateNumPointLights(numPointLights:number):number
		{
			var numFree:number = this._maxLights - this._pNumDirectionalLights;
			return Math.min(numPointLights - this._pointLightsOffset, numFree);
		}

		/**
		 * Calculates the amount of light probes this material will support.
		 * @param numDirectionalLights The maximum amount of light probes to support.
		 * @return The amount of light probes this material will support, bounded by the amount necessary.
		 */
		private calculateNumProbes(numLightProbes:number):number
		{
			var numChannels:number = 0;
			if ((this._pSpecularLightSources & LightSources.PROBES) != 0) {
				++numChannels;
			}
			if ((this._pDiffuseLightSources & LightSources.PROBES) != 0)
				++numChannels;


			// 4 channels available
			return Math.min(numLightProbes - this._lightProbesOffset, (4/numChannels) | 0);
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateShaderProperties()
		{
			super.pUpdateShaderProperties();

			var compilerV:LightingShaderCompiler = <LightingShaderCompiler> this._pCompiler;
			this._tangentSpace = compilerV.tangentSpace;

		}

		/**
		 * @inheritDoc
		 */
		public pUpdateRegisterIndices()
		{
			super.pUpdateRegisterIndices();

			var compilerV:LightingShaderCompiler = <LightingShaderCompiler> this._pCompiler;
			this._lightVertexConstantIndex = compilerV.lightVertexConstantIndex;

		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.base.IRenderable, stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D)
		{
			renderable.inverseSceneTransform.copyRawDataTo(this._inverseSceneMatrix);

			if (this._tangentSpace && this._pCameraPositionIndex >= 0) {
				var pos:away.geom.Vector3D = camera.scenePosition;
				var x:number = pos.x;
				var y:number = pos.y;
				var z:number = pos.z;

				this._pVertexConstantData[this._pCameraPositionIndex] = this._inverseSceneMatrix[0]*x + this._inverseSceneMatrix[4]*y + this._inverseSceneMatrix[8]*z + this._inverseSceneMatrix[12];
				this._pVertexConstantData[this._pCameraPositionIndex + 1] = this._inverseSceneMatrix[1]*x + this._inverseSceneMatrix[5]*y + this._inverseSceneMatrix[9]*z + this._inverseSceneMatrix[13];
				this._pVertexConstantData[this._pCameraPositionIndex + 2] = this._inverseSceneMatrix[2]*x + this._inverseSceneMatrix[6]*y + this._inverseSceneMatrix[10]*z + this._inverseSceneMatrix[14];
			}

			super.iRender(renderable, stageGLProxy, camera, viewProjection);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D)
		{
			super.iActivate(stageGLProxy, camera);

			if (!this._tangentSpace && this._pCameraPositionIndex >= 0) {
				var pos:away.geom.Vector3D = camera.scenePosition;

				this._pVertexConstantData[this._pCameraPositionIndex] = pos.x;
				this._pVertexConstantData[this._pCameraPositionIndex + 1] = pos.y;
				this._pVertexConstantData[this._pCameraPositionIndex + 2] = pos.z;
			}
		}

		/**
		 * Indicates whether any light probes are used to contribute to the specular shading.
		 */
		private usesProbesForSpecular():boolean
		{
			return this._pNumLightProbes > 0 && (this._pSpecularLightSources & LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether any light probes are used to contribute to the diffuse shading.
		 */
		private usesProbesForDiffuse():boolean
		{
			return this._pNumLightProbes > 0 && (this._pDiffuseLightSources & LightSources.PROBES) != 0;
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateLightConstants()
		{
			var dirLight:away.lights.DirectionalLight;
			var pointLight:away.lights.PointLight;
			var i:number = 0;
			var k:number = 0;
			var len:number;
			var dirPos:away.geom.Vector3D;
			var total:number = 0;
			var numLightTypes:number = this._includeCasters? 2 : 1;
			var l:number;
			var offset:number;

			l = this._lightVertexConstantIndex;
			k = this._pLightFragmentConstantIndex;

			var cast:number = 0;
			var dirLights:Array<away.lights.DirectionalLight> = this._pLightPicker.directionalLights;
			offset = this._directionalLightsOffset;
			len = this._pLightPicker.directionalLights.length;

			if (offset > len) {
				cast = 1;
				offset -= len;
			}

			for (; cast < numLightTypes; ++cast) {
				if (cast)
					dirLights = this._pLightPicker.castingDirectionalLights;
				len = dirLights.length;
				if (len > this._pNumDirectionalLights)
					len = this._pNumDirectionalLights;

				for (i = 0; i < len; ++i) {
					dirLight = dirLights[offset + i];
					dirPos = dirLight.sceneDirection;

					this._pAmbientLightR += dirLight._iAmbientR;
					this._pAmbientLightG += dirLight._iAmbientG;
					this._pAmbientLightB += dirLight._iAmbientB;

					if (this._tangentSpace) {
						var x:number = -dirPos.x;
						var y:number = -dirPos.y;
						var z:number = -dirPos.z;

						this._pVertexConstantData[l++] = this._inverseSceneMatrix[0]*x + this._inverseSceneMatrix[4]*y + this._inverseSceneMatrix[8]*z;
						this._pVertexConstantData[l++] = this._inverseSceneMatrix[1]*x + this._inverseSceneMatrix[5]*y + this._inverseSceneMatrix[9]*z;
						this._pVertexConstantData[l++] = this._inverseSceneMatrix[2]*x + this._inverseSceneMatrix[6]*y + this._inverseSceneMatrix[10]*z;
						this._pVertexConstantData[l++] = 1;
					} else {
						this._pFragmentConstantData[k++] = -dirPos.x;
						this._pFragmentConstantData[k++] = -dirPos.y;
						this._pFragmentConstantData[k++] = -dirPos.z;
						this._pFragmentConstantData[k++] = 1;
					}

					this._pFragmentConstantData[k++] = dirLight._iDiffuseR;
					this._pFragmentConstantData[k++] = dirLight._iDiffuseG;
					this._pFragmentConstantData[k++] = dirLight._iDiffuseB;
					this._pFragmentConstantData[k++] = 1;

					this._pFragmentConstantData[k++] = dirLight._iSpecularR;
					this._pFragmentConstantData[k++] = dirLight._iSpecularG;
					this._pFragmentConstantData[k++] = dirLight._iSpecularB;
					this._pFragmentConstantData[k++] = 1;

					if (++total == this._pNumDirectionalLights) {
						// break loop
						i = len;
						cast = numLightTypes;
					}
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

			var pointLights:Array<away.lights.PointLight> = this._pLightPicker.pointLights;
			offset = this._pointLightsOffset;
			len = this._pLightPicker.pointLights.length;

			if (offset > len) {
				cast = 1;
				offset -= len;
			} else {
				cast = 0;
			}

			for (; cast < numLightTypes; ++cast) {
				if (cast) {
					pointLights = this._pLightPicker.castingPointLights;
				}

				len = pointLights.length;

				for (i = 0; i < len; ++i) {
					pointLight = pointLights[offset + i];
					dirPos = pointLight.scenePosition;

					this._pAmbientLightR += pointLight._iAmbientR;
					this._pAmbientLightG += pointLight._iAmbientG;
					this._pAmbientLightB += pointLight._iAmbientB;

					if (this._tangentSpace) {
						x = dirPos.x;
						y = dirPos.y;
						z = dirPos.z;

						this._pVertexConstantData[l++] = this._inverseSceneMatrix[0]*x + this._inverseSceneMatrix[4]*y + this._inverseSceneMatrix[8]*z + this._inverseSceneMatrix[12];
						this._pVertexConstantData[l++] = this._inverseSceneMatrix[1]*x + this._inverseSceneMatrix[5]*y + this._inverseSceneMatrix[9]*z + this._inverseSceneMatrix[13];
						this._pVertexConstantData[l++] = this._inverseSceneMatrix[2]*x + this._inverseSceneMatrix[6]*y + this._inverseSceneMatrix[10]*z + this._inverseSceneMatrix[14];
					} else {

						this._pVertexConstantData[l++] = dirPos.x;
						this._pVertexConstantData[l++] = dirPos.y;
						this._pVertexConstantData[l++] = dirPos.z;

					}
					this._pVertexConstantData[l++] = 1;

					this._pFragmentConstantData[k++] = pointLight._iDiffuseR;
					this._pFragmentConstantData[k++] = pointLight._iDiffuseG;
					this._pFragmentConstantData[k++] = pointLight._iDiffuseB;

					var radius:number = pointLight._pRadius;
					this._pFragmentConstantData[k++] = radius*radius;

					this._pFragmentConstantData[k++] = pointLight._iSpecularR;
					this._pFragmentConstantData[k++] = pointLight._iSpecularG;
					this._pFragmentConstantData[k++] = pointLight._iSpecularB;
					this._pFragmentConstantData[k++] = pointLight._pFallOffFactor;

					if (++total == this._pNumPointLights) {
						// break loop
						i = len;
						cast = numLightTypes;
					}
				}
			}

			// more directional supported than currently picked, need to clamp all to 0
			if (this._pNumPointLights > total) {
				i = k + (total - this._pNumPointLights)*12;
				for (; k < i; ++k) {
					this._pFragmentConstantData[k] = 0;

				}
			}
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateProbes(stageGLProxy:away.managers.StageGLProxy)
		{
			var context:away.displayGL.ContextGL = stageGLProxy._iContextGL;
			var probe:away.lights.LightProbe;
			var lightProbes:Array<away.lights.LightProbe> = this._pLightPicker.lightProbes;
			var weights:number[] = this._pLightPicker.lightProbeWeights;
			var len:number = lightProbes.length - this._lightProbesOffset;
			var addDiff:boolean = this.usesProbesForDiffuse();
			var addSpec:boolean = <boolean> (this._pMethodSetup._iSpecularMethod && this.usesProbesForSpecular());

			if (!(addDiff || addSpec))
				return;

			if (len > this._pNumLightProbes) {
				len = this._pNumLightProbes;
			}

			for (var i:number = 0; i < len; ++i) {
				probe = lightProbes[ this._lightProbesOffset + i];

				if (addDiff) {
					context.setTextureAt(this._pLightProbeDiffuseIndices[i], probe.diffuseMap.getTextureForStageGL(stageGLProxy));
				}
				if (addSpec) {
					context.setTextureAt(this._pLightProbeSpecularIndices[i], probe.specularMap.getTextureForStageGL(stageGLProxy));
				}
			}

			for (i = 0; i < len; ++i)
				this._pFragmentConstantData[this._pProbeWeightsIndex + i] = weights[this._lightProbesOffset + i];
		}
	}
}
