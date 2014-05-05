///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
	 * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
	 * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
	 * scattered light within the skin attributing to the final colour)
	 */
	export class DiffuseGradientMethod extends DiffuseBasicMethod
	{
		private _gradientTextureRegister:ShaderRegisterElement;
		private _gradient:away.textures.Texture2DBase;
		
		/**
		 * Creates a new DiffuseGradientMethod object.
		 * @param gradient A texture that contains the light colour based on the angle. This can be used to change
		 * the light colour due to subsurface scattering when the surface faces away from the light.
		 */
		constructor(gradient:away.textures.Texture2DBase)
		{
			super();

			this._gradient = gradient;
		}

		/**
		 * A texture that contains the light colour based on the angle. This can be used to change the light colour
		 * due to subsurface scattering when the surface faces away from the light.
		 */
		public get gradient():away.textures.Texture2DBase
		{
			return this._gradient;
		}
		
		public set gradient(value:away.textures.Texture2DBase)
		{
			if (value.hasMipmaps != this._gradient.hasMipmaps || value.format != this._gradient.format)
				this.iInvalidateShaderProgram();
			this._gradient = value;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._gradientTextureRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var code:string = super.iGetFragmentPreLightingCode(vo, regCache);
			this._pIsFirstLight = true;
			
			if (vo.numLights > 0) {
				this._gradientTextureRegister = regCache.getFreeTextureReg();
				vo.secondaryTexturesIndex = this._gradientTextureRegister.index;
			}
			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var t:ShaderRegisterElement;
			
			// write in temporary if not first light, so we can add to total diffuse colour
			if (this._pIsFirstLight)
				t = this._pTotalLightColorReg;
			else {
				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);
			}
			
			code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + this._sharedRegisters.normalFragment + ".xyz\n" +
				"mul " + t + ".w, " + t + ".w, " + this._sharedRegisters.commons + ".x\n" +
				"add " + t + ".w, " + t + ".w, " + this._sharedRegisters.commons + ".x\n" +
				"mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";
			
			if (this._iModulateMethod != null)
				code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);
			
			code += this.pGetTex2DSampleCode(vo, t, this._gradientTextureRegister, this._gradient, t, "clamp") +
				//					"mul " + t + ".xyz, " + t + ".xyz, " + t + ".w\n" +
				"mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";
			
			if (!this._pIsFirstLight) {
				code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
				regCache.removeFragmentTempUsage(t);
			}
			
			this._pIsFirstLight = false;
			
			return code;
		}

		/**
		 * @inheritDoc
		 */
		public pApplyShadow(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var t:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			
			return "mov " + t + ", " + this._pShadowRegister + ".wwww\n" +
				this.pGetTex2DSampleCode(vo, t, this._gradientTextureRegister, this._gradient, t, "clamp") +
				"mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			super.iActivate(vo, stageGL);
			this._gradient.activateTextureForStage(vo.secondaryTexturesIndex, stageGL);
		}
	}
}
