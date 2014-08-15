///<reference path="../../_definitions.ts"/>

module away.materials
{
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import CubeTextureBase							= away.textures.CubeTextureBase;

	/**
	 * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
	 * approximate global lighting rather than lights.
	 */
	export class AmbientEnvMapMethod extends AmbientBasicMethod
	{
		private _cubeTexture:CubeTextureBase;
		
		/**
		 * Creates a new <code>AmbientEnvMapMethod</code> object.
		 *
		 * @param envMap The cube environment map to use for the ambient lighting.
		 */
		constructor(envMap:CubeTextureBase)
		{
			super();
			this._cubeTexture = envMap;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(shaderObject:ShaderObjectBase, methodVO:MethodVO)
		{
			super.iInitVO(shaderObject, methodVO);

			methodVO.needsNormals = true;
		}
		
		/**
		 * The cube environment map to use for the diffuse lighting.
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
		public iActivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:away.base.Stage)
		{
			super.iActivate(shaderObject, methodVO, stage);

			(<IContextStageGL> stage.context).activateCubeTexture(methodVO.texturesIndex, this._cubeTexture);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string = "";
			var ambientInputRegister:ShaderRegisterElement;
			var cubeMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			methodVO.texturesIndex = cubeMapReg.index;
			
			code += ShaderCompilerHelper.getTexCubeSampleCode(targetReg, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, sharedRegisters.normalFragment);

			ambientInputRegister = regCache.getFreeFragmentConstant();
			methodVO.fragmentConstantsIndex = ambientInputRegister.index;
			
			code += "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + ambientInputRegister + ".xyz\n";
			
			return code;
		}
	}
}
