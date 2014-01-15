///<reference path="../../_definitions.ts"/>

module away.materials
{


	/**
	 * ShadowCasterPass is a shader pass that uses shader methods to compile a complete program. It only draws the lighting
	 * contribution for a single shadow-casting light.
	 *
	 * @see away3d.materials.methods.ShadingMethodBase
	 */

	export class ShadowCasterPass extends CompiledPass
	{
		private _tangentSpace:boolean;
		private _lightVertexConstantIndex:number;
		private _inverseSceneMatrix:number[] = new Array<number>();

		/**
		 * Creates a new ShadowCasterPass objects.
		 *
		 * @param material The material to which this pass belongs.
		 */
		constructor(material:MaterialBase)
		{
			super(material);
		}

		/**
		 * @inheritDoc
		 */
		public pCreateCompiler(profile:string):ShaderCompiler
		{
			return new LightingShaderCompiler(profile);
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateLights()
		{
			super.pUpdateLights();

			var numPointLights:number = 0;
			var numDirectionalLights:number = 0;

			if (this._pLightPicker) {

				numPointLights = this._pLightPicker.numCastingPointLights > 0? 1 : 0;
				numDirectionalLights = this._pLightPicker.numCastingDirectionalLights > 0? 1 : 0;

			} else {
				numPointLights = 0;
				numDirectionalLights = 0;
			}

			this._pNumLightProbes = 0;

			if (numPointLights + numDirectionalLights > 1) {
				throw new Error("Must have exactly one light!");
			}

			if (numPointLights != this._pNumPointLights || numDirectionalLights != this._pNumDirectionalLights) {
				this._pNumPointLights = numPointLights;
				this._pNumDirectionalLights = numDirectionalLights;
				this.iInvalidateShaderProgram();
			}
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateShaderProperties()
		{
			super.pUpdateShaderProperties();

			var c:LightingShaderCompiler = <LightingShaderCompiler> this._pCompiler;
			this._tangentSpace = c.tangentSpace;

		}

		/**
		 * @inheritDoc
		 */
		public pUpdateRegisterIndices()
		{
			super.pUpdateRegisterIndices();

			var c:LightingShaderCompiler = <LightingShaderCompiler> this._pCompiler;

			this._lightVertexConstantIndex = c.lightVertexConstantIndex;

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
		 * @inheritDoc
		 */
		public pUpdateLightConstants()
		{
			// first dirs, then points
			var dirLight:away.lights.DirectionalLight;
			var pointLight:away.lights.PointLight;
			var k:number = 0;
			var l:number = 0;
			var dirPos:away.geom.Vector3D;

			l = this._lightVertexConstantIndex;
			k = this._pLightFragmentConstantIndex;

			if (this._pNumDirectionalLights > 0) {

				dirLight = this._pLightPicker.castingDirectionalLights[0];
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

				return;
			}

			if (this._pNumPointLights > 0) {
				pointLight = this._pLightPicker.castingPointLights[0];

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
				this._pFragmentConstantData[k++] = pointLight._pRadius*pointLight._pRadius;

				this._pFragmentConstantData[k++] = pointLight._iSpecularR;
				this._pFragmentConstantData[k++] = pointLight._iSpecularG;
				this._pFragmentConstantData[k++] = pointLight._iSpecularB;
				this._pFragmentConstantData[k++] = pointLight._pFallOffFactor;
			}
		}

		/**
		 * @inheritDoc
		 */
		public pUsesProbes():boolean
		{
			return false;
		}

		/**
		 * @inheritDoc
		 */
		public pUsesLights():boolean
		{
			return true;
		}

		/**
		 * @inheritDoc
		 */
		public pUpdateProbes(stageGLProxy:away.managers.StageGLProxy)
		{
		}
	}
}
