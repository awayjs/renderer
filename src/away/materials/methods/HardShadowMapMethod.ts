///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * HardShadowMapMethod provides the cheapest shadow map method by using a single tap without any filtering.
	 */
	export class HardShadowMapMethod extends SimpleShadowMapMethodBase
	{
		/**
		 * Creates a new HardShadowMapMethod object.
		 */
		constructor(castingLight:away.lights.LightBase)
		{
			super(castingLight);
		}

		/**
		 * @inheritDoc
		 */
		public _pGetPlanarFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
			var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			// needs to be reserved anyway. DO NOT REMOVE
			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			// TODO not used
			dataReg = dataReg;
			var depthCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var code:string = "";

			vo.fragmentConstantsIndex = decReg.index*4;
			vo.texturesIndex = depthMapRegister.index;

			code += "tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n"; // 0 if in shadow

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public _pGetPointFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
			var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var epsReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var posReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var depthSampleCol:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(depthSampleCol, 1);
			var lightDir:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var code:string = "";

			vo.fragmentConstantsIndex = decReg.index*4;
			vo.texturesIndex = depthMapRegister.index;

			code += "sub " + lightDir + ", " + this._sharedRegisters.globalPositionVarying + ", " + posReg + "\n" + "dp3 " + lightDir + ".w, " + lightDir + ".xyz, " + lightDir + ".xyz\n" + "mul " + lightDir + ".w, " + lightDir + ".w, " + posReg + ".w\n" + "nrm " + lightDir + ".xyz, " + lightDir + ".xyz\n" +

				"tex " + depthSampleCol + ", " + lightDir + ", " + depthMapRegister + " <cube, nearest, clamp>\n" + "dp4 " + depthSampleCol + ".z, " + depthSampleCol + ", " + decReg + "\n" + "add " + targetReg + ".w, " + lightDir + ".w, " + epsReg + ".x\n" +    // offset by epsilon

				"slt " + targetReg + ".w, " + targetReg + ".w, " + depthSampleCol + ".z\n"; // 0 if in shadow

			regCache.removeFragmentTempUsage(depthSampleCol);

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public _iGetCascadeFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement):string
		{
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			return "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + depthProjection + ".z, " + temp + ".z\n"; // 0 if in shadow
		}

		/**
		 * @inheritDoc
		 */
		public iActivateForCascade(vo:MethodVO, stageGLProxy:away.managers.StageGLProxy):void
		{
		}
	}
}
