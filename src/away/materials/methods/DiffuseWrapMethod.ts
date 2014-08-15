///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;

	/**
	 * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
	 * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
	 */
	export class DiffuseWrapMethod extends DiffuseBasicMethod
	{
		private _wrapDataRegister:ShaderRegisterElement;
		private _wrapFactor:number;
		
		/**
		 * Creates a new DiffuseWrapMethod object.
		 * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
		 */
		constructor(wrapFactor:number = .5)
		{
			super();

			this.wrapFactor = wrapFactor;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();

			this._wrapDataRegister = null;
		}

		/**
		 * A factor to indicate the amount by which the light is allowed to wrap.
		 */
		public get wrapFactor():number
		{
			return this._wrapFactor;
		}
		
		public set wrapFactor(value:number)
		{
			this._wrapFactor = value;
			this._wrapFactor = 1/(value + 1);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string = super.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
			this._pIsFirstLight = true;
			this._wrapDataRegister = registerCache.getFreeFragmentConstant();
			methodVO.secondaryFragmentConstantsIndex = this._wrapDataRegister.index*4;
			
			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string = "";
			var t:ShaderRegisterElement;
			
			// write in temporary if not first light, so we can add to total diffuse colour
			if (this._pIsFirstLight) {
				t = this._pTotalLightColorReg;
			} else {
				t = registerCache.getFreeFragmentVectorTemp();
				registerCache.addFragmentTempUsages(t, 1);
			}
			
			code += "dp3 " + t + ".x, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" +
				"add " + t + ".y, " + t + ".x, " + this._wrapDataRegister + ".x\n" +
				"mul " + t + ".y, " + t + ".y, " + this._wrapDataRegister + ".y\n" +
				"sat " + t + ".w, " + t + ".y\n" +
				"mul " + t + ".xz, " + t + ".w, " + lightDirReg + ".wz\n";
			
			if (this._iModulateMethod != null)
				code += this._iModulateMethod(shaderObject, methodVO, lightDirReg, registerCache, sharedRegisters);
			
			code += "mul " + t + ", " + t + ".x, " + lightColReg + "\n";
			
			if (!this._pIsFirstLight) {
				code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
				registerCache.removeFragmentTempUsage(t);
			}
			
			this._pIsFirstLight = false;
			
			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
		{
			super.iActivate(shaderObject, methodVO, stage);

			var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index] = this._wrapFactor;
			data[index + 1] = 1/(this._wrapFactor + 1);
		}
	}
}
