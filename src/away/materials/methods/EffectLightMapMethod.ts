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
		public iInitVO(vo:MethodVO)
		{
			vo.needsUV = !this._useSecondaryUV;
			vo.needsSecondaryUV = this._useSecondaryUV;
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
		public iActivate(vo:MethodVO, stage:away.base.Stage)
		{
			(<IContextStageGL> stage.context).activateTexture(vo.texturesIndex, this._texture);

			super.iActivate(vo, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string;
			var lightMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			vo.texturesIndex = lightMapReg.index;
			
			code = this.pGetTex2DSampleCode(vo, temp, lightMapReg, this._texture, this._useSecondaryUV? this._sharedRegisters.secondaryUVVarying:this._sharedRegisters.uvVarying);
			
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
