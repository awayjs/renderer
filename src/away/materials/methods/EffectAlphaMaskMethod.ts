///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import Texture2DBase							= away.textures.Texture2DBase;

	/**
	 * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
	 * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
	 * etc).
	 */
	export class EffectAlphaMaskMethod extends EffectMethodBase
	{
		private _texture:Texture2DBase;
		private _useSecondaryUV:boolean;

		/**
		 * Creates a new EffectAlphaMaskMethod object.
		 * 
		 * @param texture The texture to use as the alpha mask.
		 * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
		 */
		constructor(texture:Texture2DBase, useSecondaryUV:boolean = false)
		{
			super();
			
			this._texture = texture;
			this._useSecondaryUV = useSecondaryUV;
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
		 * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
		 * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
		 * transparency over a tiled water surface.
		 */
		public get useSecondaryUV():boolean
		{
			return this._useSecondaryUV;
		}
		
		public set useSecondaryUV(value:boolean)
		{
			if (this._useSecondaryUV == value)
				return;
			this._useSecondaryUV = value;
			this.iInvalidateShaderProgram();
		}

		/**
		 * The texture to use as the alpha mask.
		 */
		public get texture():Texture2DBase
		{
			return this._texture;
		}
		
		public set texture(value:Texture2DBase)
		{
			this._texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:Stage)
		{
			(<IContextStageGL> stage.context).activateTexture(vo.texturesIndex, this._texture);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var textureReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var uvReg:ShaderRegisterElement = this._useSecondaryUV? this._sharedRegisters.secondaryUVVarying:this._sharedRegisters.uvVarying;
			vo.texturesIndex = textureReg.index;
			
			return this.pGetTex2DSampleCode(vo, temp, textureReg, this._texture, uvReg) +
				"mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
		}
	}
}
