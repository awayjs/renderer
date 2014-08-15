///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import Texture2DBase							= away.textures.Texture2DBase;

	/**
	 * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
	 * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
	 * than the whole pixel colour.
	 */
	export class EffectLightMapMethod extends EffectMethodBase
	{
		/**
		 * Indicates the light map should be multiplied with the calculated shading result.
		 */
		public static MULTIPLY:string = "multiply";

		/**
		 * Indicates the light map should be added into the calculated shading result.
		 */
		public static ADD:string = "add";
		
		private _texture:Texture2DBase;
		
		private _blendMode:string;
		private _useSecondaryUV:boolean;

		/**
		 * Creates a new EffectLightMapMethod object.
		 *
		 * @param texture The texture containing the light map.
		 * @param blendMode The blend mode with which the light map should be applied to the lighting result.
		 * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
		 */
		constructor(texture:Texture2DBase, blendMode:string = "multiply", useSecondaryUV:boolean = false)
		{
			super();
			this._useSecondaryUV = useSecondaryUV;
			this._texture = texture;
			this.blendMode = blendMode;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
		{
			methodVO.needsUV = !this._useSecondaryUV;
			methodVO.needsSecondaryUV = this._useSecondaryUV;
		}

		/**
		 * The blend mode with which the light map should be applied to the lighting result.
		 *
		 * @see EffectLightMapMethod.ADD
		 * @see EffectLightMapMethod.MULTIPLY
		 */
		public get blendMode():string
		{
			return this._blendMode;
		}
		
		public set blendMode(value:string)
		{
			if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
				throw new Error("Unknown blendmode!");
			if (this._blendMode == value)
				return;
			this._blendMode = value;
			this.iInvalidateShaderProgram();
		}

		/**
		 * The texture containing the light map.
		 */
		public get texture():Texture2DBase
		{
			return this._texture;
		}
		
		public set texture(value:Texture2DBase)
		{
			if (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)
				this.iInvalidateShaderProgram();
			this._texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
		{
			(<IContextStageGL> stage.context).activateTexture(methodVO.texturesIndex, this._texture);

			super.iActivate(shaderObject, methodVO, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string;
			var lightMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
			var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			methodVO.texturesIndex = lightMapReg.index;

			code = ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, this._useSecondaryUV? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

			switch (this._blendMode) {
				case EffectLightMapMethod.MULTIPLY:
					code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
					break;
				case EffectLightMapMethod.ADD:
					code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
					break;
			}
			
			return code;
		}
	}
}
