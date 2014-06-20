///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import CubeTextureBase							= away.textures.CubeTextureBase;
	import Texture2DBase							= away.textures.Texture2DBase;

	/**
	 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
	 */
	export class EffectEnvMapMethod extends EffectMethodBase
	{
		private _cubeTexture:CubeTextureBase;
		private _alpha:number;
		private _mask:Texture2DBase;

		/**
		 * Creates an EffectEnvMapMethod object.
		 * @param envMap The environment map containing the reflected scene.
		 * @param alpha The reflectivity of the surface.
		 */
		constructor(envMap:CubeTextureBase, alpha:number = 1)
		{
			super();
			this._cubeTexture = envMap;
			this._alpha = alpha;

		}

		/**
		 * An optional texture to modulate the reflectivity of the surface.
		 */
		public get mask():Texture2DBase
		{
			return this._mask;
		}

		public set mask(value:Texture2DBase)
		{
			if (value != this._mask || (value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format)))
				this.iInvalidateShaderProgram();

			this._mask = value;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsNormals = true;
			vo.needsView = true;
			vo.needsUV = this._mask != null;
		}

		/**
		 * The cubic environment map containing the reflected scene.
		 */
		public get envMap():CubeTextureBase
		{
			return this._cubeTexture;
		}

		public set envMap(value:CubeTextureBase)
		{
			this._cubeTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
		}

		/**
		 * The reflectivity of the surface.
		 */
		public get alpha():number
		{
			return this._alpha;
		}

		public set alpha(value:number)
		{
			this._alpha = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:away.base.Stage)
		{
			vo.fragmentData[vo.fragmentConstantsIndex] = this._alpha;

			(<IContextStageGL> stage.context).activateCubeTexture(vo.texturesIndex, this._cubeTexture);
			if (this._mask)
				(<IContextStageGL> stage.context).activateTexture(vo.texturesIndex + 1, this._mask);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var dataRegister:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var code:string = "";
			var cubeMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();

			vo.texturesIndex = cubeMapReg.index;
			vo.fragmentConstantsIndex = dataRegister.index*4;

			regCache.addFragmentTempUsages(temp, 1);
			var temp2:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

			// r = I - 2(I.N)*N
			code += "dp3 " + temp + ".w, " + this._sharedRegisters.viewDirFragment + ".xyz, " + this._sharedRegisters.normalFragment + ".xyz\n" +
					"add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" +
					"mul " + temp + ".xyz, " + this._sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" +
					"sub " + temp + ".xyz, " + temp + ".xyz, " + this._sharedRegisters.viewDirFragment + ".xyz\n" +
			this.pGetTexCubeSampleCode(vo, temp, cubeMapReg, this._cubeTexture, temp) +
					"sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + // -.5
					"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
					"sub " + temp + ", " + temp + ", " + targetReg + "\n";

			if (this._mask)
				code += this.pGetTex2DSampleCode(vo, temp2, regCache.getFreeTextureReg(), this._mask, this._sharedRegisters.uvVarying) + "mul " + temp + ", " + temp2 + ", " + temp + "\n";

			code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" +
					"add " + targetReg + ", " + targetReg + ", " + temp + "\n";

			regCache.removeFragmentTempUsage(temp);

			return code;
		}
	}
}
