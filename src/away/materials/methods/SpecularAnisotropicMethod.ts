///<reference path="../../_definitions.ts"/>

/**
 *
 */
module away.materials
{
	/**
	 * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
	 * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
	 * The tangent vectors are used as the surface groove directions.
	 */
	export class SpecularAnisotropicMethod extends SpecularBasicMethod
	{
		/**
		 * Creates a new SpecularAnisotropicMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsTangents = true;
			vo.needsView = true;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var t:ShaderRegisterElement;
			
			if (this._pIsFirstLight)
				t = this._pTotalLightColorReg;
			else {
				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);
			}
			
			// (sin(l,t) * sin(v,t) - cos(l,t)*cos(v,t)) ^ k
			
			code += "nrm " + t + ".xyz, " + this._sharedRegisters.tangentVarying + ".xyz\n" +
				"dp3 " + t + ".w, " + t + ".xyz, " + lightDirReg + ".xyz\n" +
				"dp3 " + t + ".z, " + t + ".xyz, " + this._sharedRegisters.viewDirFragment + ".xyz\n";
			
			// (sin(t.w) * sin(t.z) - cos(t.w)*cos(t.z)) ^ k
			code += "sin " + t + ".x, " + t + ".w\n" +
				"sin " + t + ".y, " + t + ".z\n" +
				// (t.x * t.y - cos(t.w)*cos(t.z)) ^ k
				"mul " + t + ".x, " + t + ".x, " + t + ".y\n" +
				// (t.x - cos(t.w)*cos(t.z)) ^ k
				"cos " + t + ".z, " + t + ".z\n" +
				"cos " + t + ".w, " + t + ".w\n" +
				// (t.x - t.w*t.z) ^ k
				"mul " + t + ".w, " + t + ".w, " + t + ".z\n" +
				// (t.x - t.w) ^ k
				"sub " + t + ".w, " + t + ".x, " + t + ".w\n";
			
			if (this._pUseTexture) {
				// apply gloss modulation from texture
				code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" +
					"pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
			} else
				code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
			
			// attenuate
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";
			
			if (this._iModulateMethod != null)
				code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);
			
			code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";
			
			if (!this._pIsFirstLight) {
				code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
				regCache.removeFragmentTempUsage(t);
			}
			
			this._pIsFirstLight = false;
			
			return code;
		}
	}
}
