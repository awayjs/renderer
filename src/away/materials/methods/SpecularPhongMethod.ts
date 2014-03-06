///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * SpecularPhongMethod provides a specular method that provides Phong highlights.
	 */
	export class SpecularPhongMethod extends SpecularBasicMethod
	{
		/**
		 * Creates a new SpecularPhongMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var t:ShaderRegisterElement;

			if (this._pIsFirstLight) {
				t = this._pTotalLightColorReg;
			} else {
				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);
			}

			var viewDirReg:ShaderRegisterElement = this._sharedRegisters.viewDirFragment;
			var normalReg:ShaderRegisterElement = this._sharedRegisters.normalFragment;

			// phong model
			code += "dp3 " + t + ".w, " + lightDirReg + ", " + normalReg + "\n" + // sca1 = light.normal

				//find the reflected light vector R
				"add " + t + ".w, " + t + ".w, " + t + ".w\n" + // sca1 = sca1*2
				"mul " + t + ".xyz, " + normalReg + ", " + t + ".w\n" + // vec1 = normal*sca1
				"sub " + t + ".xyz, " + t + ", " + lightDirReg + "\n" + // vec1 = vec1 - light (light vector is negative)

				//smooth the edge as incidence angle approaches 90
				"add " + t + ".w, " + t + ".w, " + this._sharedRegisters.commons + ".w\n" + // sca1 = sca1 + smoothtep;
				"sat " + t + ".w, " + t + ".w\n" + // sca1 range 0 - 1
				"mul " + t + ".xyz, " + t + ", " + t + ".w\n" + // vec1 = vec1*sca1

				//find the dot product between R and V
				"dp3 " + t + ".w, " + t + ", " + viewDirReg + "\n" + // sca1 = vec1.view
				"sat " + t + ".w, " + t + ".w\n";

			if (this._pUseTexture) {
				// apply gloss modulation from texture
				code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
			} else
				code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";

			// attenuate
			if (vo.useLightFallOff)
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

