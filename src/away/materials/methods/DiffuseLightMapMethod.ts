///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
	 * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
	 * than only the diffuse lighting value.
	 */
	export class DiffuseLightMapMethod extends DiffuseCompositeMethod
	{
		/**
		 * Indicates the light map should be multiplied with the calculated shading result.
		 * This can be used to add pre-calculated shadows or occlusion.
		 */
		public static MULTIPLY:string = "multiply";

		/**
		 * Indicates the light map should be added into the calculated shading result.
		 * This can be used to add pre-calculated lighting or global illumination.
		 */
		public static ADD:string = "add";
		
		private _lightMapTexture:away.textures.Texture2DBase;
		private _blendMode:string;
		private _useSecondaryUV:boolean;

		/**
		 * Creates a new DiffuseLightMapMethod method.
		 *
		 * @param lightMap The texture containing the light map.
		 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
		 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
		 * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
		 */
		constructor(lightMap:away.textures.Texture2DBase, blendMode:string = "multiply", useSecondaryUV:boolean = false, baseMethod:DiffuseBasicMethod = null)
		{
			super(null, baseMethod);

			this._useSecondaryUV = useSecondaryUV;
			this._lightMapTexture = lightMap;
			this.blendMode = blendMode;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsSecondaryUV = this._useSecondaryUV;
			vo.needsUV = !this._useSecondaryUV;
		}

		/**
		 * The blend mode with which the light map should be applied to the lighting result.
		 *
		 * @see DiffuseLightMapMethod.ADD
		 * @see DiffuseLightMapMethod.MULTIPLY
		 */
		public get blendMode():string
		{
			return this._blendMode;
		}
		
		public set blendMode(value:string)
		{
			if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
				throw new Error("Unknown blendmode!");
			if (this._blendMode == value)
				return;
			this._blendMode = value;
			this.iInvalidateShaderProgram();
		}

		/**
		 * The texture containing the light map data.
		 */
		public get lightMapTexture():away.textures.Texture2DBase
		{
			return this._lightMapTexture;
		}
		
		public set lightMapTexture(value:away.textures.Texture2DBase)
		{
			this._lightMapTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			stageGL.contextGL.setTextureAt(vo.secondaryTexturesIndex, this._lightMapTexture.getTextureForStageGL(stageGL));
			super.iActivate(vo, stageGL);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string;
			var lightMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			vo.secondaryTexturesIndex = lightMapReg.index;
			
			code = this.pGetTex2DSampleCode(vo, temp, lightMapReg, this._lightMapTexture, this._sharedRegisters.secondaryUVVarying);
			
			switch (this._blendMode) {
				case DiffuseLightMapMethod.MULTIPLY:
					code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
					break;
				case DiffuseLightMapMethod.ADD:
					code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
					break;
			}
			
			code += super.iGetFragmentPostLightingCode(vo, regCache, targetReg);
			
			return code;
		}
	}
}
