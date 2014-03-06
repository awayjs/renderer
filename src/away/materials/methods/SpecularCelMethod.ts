///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
	 */
	export class SpecularCelMethod extends SpecularCompositeMethod
	{
		private _dataReg:ShaderRegisterElement;
		private _smoothness:number = .1;
		private _specularCutOff:number = .1;
		
		/**
		 * Creates a new SpecularCelMethod object.
		 * @param specularCutOff The threshold at which the specular highlight should be shown.
		 * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
		 */
		constructor(specularCutOff:number = .5, baseMethod:SpecularBasicMethod = null)
		{
			super(null, baseMethod);

			baseMethod._iModulateMethod = (vo:MethodVO, target:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampSpecular(vo, target, regCache, sharedRegisters);

			this._specularCutOff = specularCutOff;
		}
		
		/**
		 * The smoothness of the highlight edge.
		 */
		public get smoothness():number
		{
			return this._smoothness;
		}
		
		public set smoothness(value:number)
		{
			this._smoothness = value;
		}
		
		/**
		 * The threshold at which the specular highlight should be shown.
		 */
		public get specularCutOff():number
		{
			return this._specularCutOff;
		}
		
		public set specularCutOff(value:number)
		{
			this._specularCutOff = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			super.iActivate(vo, stageGL);
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			var data:Array<number> = vo.fragmentData;
			data[index] = this._smoothness;
			data[index + 1] = this._specularCutOff;
		}
		
		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._dataReg = null;
		}
		
		/**
		 * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
		 * @param vo The MethodVO used to compile the current shader.
		 * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
		 * @param regCache The register cache used for the shader compilation.
		 * @param sharedRegisters The shared register data for this shader.
		 * @return The AGAL fragment code for the method.
		 */
		private clampSpecular(methodVO:MethodVO, target:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			methodVO = methodVO;
			regCache = regCache;
			sharedRegisters = sharedRegisters;
			return "sub " + target + ".y, " + target + ".w, " + this._dataReg + ".y\n" + // x - cutoff
				"div " + target + ".y, " + target + ".y, " + this._dataReg + ".x\n" + // (x - cutoff)/epsilon
				"sat " + target + ".y, " + target + ".y\n" +
				"sge " + target + ".w, " + target + ".w, " + this._dataReg + ".y\n" +
				"mul " + target + ".w, " + target + ".w, " + target + ".y\n";
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			this._dataReg = regCache.getFreeFragmentConstant();
			vo.secondaryFragmentConstantsIndex = this._dataReg.index*4;
			return super.iGetFragmentPreLightingCode(vo, regCache);
		}
	}
}
