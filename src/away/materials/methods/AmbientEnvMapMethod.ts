///<reference path="../../_definitions.ts"/>

module away.materials
{
	import IContextStageGL							= away.stagegl.IContextStageGL;

	/**
	 * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
	 * approximate global lighting rather than lights.
	 */
	export class AmbientEnvMapMethod extends AmbientBasicMethod
	{
		private _cubeTexture:away.textures.CubeTextureBase;
		
		/**
		 * Creates a new <code>AmbientEnvMapMethod</code> object.
		 *
		 * @param envMap The cube environment map to use for the ambient lighting.
		 */
		constructor(envMap:away.textures.CubeTextureBase)
		{
			super();
			this._cubeTexture = envMap;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			super.iInitVO(vo);
			vo.needsNormals = true;
		}
		
		/**
		 * The cube environment map to use for the diffuse lighting.
		 */
		public get envMap():away.textures.CubeTextureBase
		{
			return this._cubeTexture;
		}
		
		public set envMap(value:away.textures.CubeTextureBase)
		{
			this._cubeTexture = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:away.base.Stage)
		{
			super.iActivate(vo, stage);

			(<IContextStageGL> stage.context).activateCubeTexture(vo.texturesIndex, this._cubeTexture);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = "";
			var cubeMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			vo.texturesIndex = cubeMapReg.index;
			
			code += this.pGetTexCubeSampleCode(vo, targetReg, cubeMapReg, this._cubeTexture, this._sharedRegisters.normalFragment);
			
			this._pAmbientInputRegister = regCache.getFreeFragmentConstant();
			vo.fragmentConstantsIndex = this._pAmbientInputRegister.index;
			
			code += "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + this._pAmbientInputRegister + ".xyz\n";
			
			return code;
		}
	}
}
