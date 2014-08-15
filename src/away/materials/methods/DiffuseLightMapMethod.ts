///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import Texture2DBase							= away.textures.Texture2DBase;

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
		
		private _lightMapTexture:Texture2DBase;
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
		constructor(lightMap:Texture2DBase, blendMode:string = "multiply", useSecondaryUV:boolean = false, baseMethod:DiffuseBasicMethod = null)
		{
			super(null, baseMethod);

			this._useSecondaryUV = useSecondaryUV;
			this._lightMapTexture = lightMap;
			this.blendMode = blendMode;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
		{
			methodVO.needsSecondaryUV = this._useSecondaryUV;
			methodVO.needsUV = !this._useSecondaryUV;
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
		public get lightMapTexture():Texture2DBase
		{
			return this._lightMapTexture;
		}
		
		public set lightMapTexture(value:Texture2DBase)
		{
			this._lightMapTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
		{
			(<IContextStageGL> stage.context).activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture);

			super.iActivate(shaderObject, methodVO, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string;
			var lightMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
			var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			methodVO.secondaryTexturesIndex = lightMapReg.index;
			
			code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._lightMapTexture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.secondaryUVVarying);
			
			switch (this._blendMode) {
				case DiffuseLightMapMethod.MULTIPLY:
					code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
					break;
				case DiffuseLightMapMethod.ADD:
					code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
					break;
			}
			
			code += super.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
			
			return code;
		}
	}
}
