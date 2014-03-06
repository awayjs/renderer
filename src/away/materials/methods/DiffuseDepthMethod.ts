///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * DiffuseDepthMethod provides a debug method to visualise depth maps
	 */
	export class DiffuseDepthMethod extends DiffuseBasicMethod
	{
		/**
		 * Creates a new DiffuseBasicMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			var data:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.fragmentConstantsIndex;
			data[index] = 1.0;
			data[index + 1] = 1/255.0;
			data[index + 2] = 1/65025.0;
			data[index + 3] = 1/16581375.0;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = "";
			var temp:ShaderRegisterElement;
			var decReg:ShaderRegisterElement;
			
			if (!this._pUseTexture)
				throw new Error("DiffuseDepthMethod requires texture!");
			
			// incorporate input from ambient
			if (vo.numLights > 0) {
				if (this._pShadowRegister)
					code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + this._pShadowRegister + ".w\n";
				code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" +
					"sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
				regCache.removeFragmentTempUsage(this._pTotalLightColorReg);
			}
			
			temp = vo.numLights > 0? regCache.getFreeFragmentVectorTemp():targetReg;
			
			this._pDiffuseInputRegister = regCache.getFreeTextureReg();
			vo.texturesIndex = this._pDiffuseInputRegister.index;
			decReg = regCache.getFreeFragmentConstant();
			vo.fragmentConstantsIndex = decReg.index*4;
			code += this.pGetTex2DSampleCode(vo, temp, this._pDiffuseInputRegister, this.texture) +
				"dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" +
				"mov " + temp + ".yz, " + temp + ".xx			\n" +
				"mov " + temp + ".w, " + decReg + ".x\n" +
				"sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";
			
			if (vo.numLights == 0)
				return code;
			
			code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" +
				"mov " + targetReg + ".w, " + temp + ".w\n";
			
			return code;
		}
	}
}
