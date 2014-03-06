///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
	 */
	export class DiffuseCelMethod extends DiffuseCompositeMethod
	{
		private _levels:number /*uint*/;
		private _dataReg:ShaderRegisterElement;
		private _smoothness:number = .1;
		
		/**
		 * Creates a new DiffuseCelMethod object.
		 * @param levels The amount of shadow gradations.
		 * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
		 */
		constructor(levels:number /*uint*/ = 3, baseMethod:DiffuseBasicMethod = null)
		{
			super(null, baseMethod);

			this.baseMethod._iModulateMethod = (vo:MethodVO, target:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.clampDiffuse(vo, target, regCache, sharedRegisters);

			this._levels = levels;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			var data:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			super.iInitConstants(vo);
			data[index + 1] = 1;
			data[index + 2] = 0;
		}

		/**
		 * The amount of shadow gradations.
		 */
		public get levels():number /*uint*/
		{
			return this._levels;
		}
		
		public set levels(value:number /*uint*/)
		{
			this._levels = value;
		}
		
		/**
		 * The smoothness of the edge between 2 shading levels.
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
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._dataReg = null;
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
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			super.iActivate(vo, stageGL);
			var data:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			data[index] = this._levels;
			data[index + 3] = this._smoothness;
		}
		
		/**
		 * Snaps the diffuse shading of the wrapped method to one of the levels.
		 * @param vo The MethodVO used to compile the current shader.
		 * @param t The register containing the diffuse strength in the "w" component.
		 * @param regCache The register cache used for the shader compilation.
		 * @param sharedRegisters The shared register data for this shader.
		 * @return The AGAL fragment code for the method.
		 */
		private clampDiffuse(vo:MethodVO, t:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			return "mul " + t + ".w, " + t + ".w, " + this._dataReg + ".x\n" +
				"frc " + t + ".z, " + t + ".w\n" +
				"sub " + t + ".y, " + t + ".w, " + t + ".z\n" +
				"mov " + t + ".x, " + this._dataReg + ".x\n" +
				"sub " + t + ".x, " + t + ".x, " + this._dataReg + ".y\n" +
				"rcp " + t + ".x," + t + ".x\n" +
				"mul " + t + ".w, " + t + ".y, " + t + ".x\n" +
				
				// previous clamped strength
				"sub " + t + ".y, " + t + ".w, " + t + ".x\n" +
				
				// fract/epsilon (so 0 - epsilon will become 0 - 1)
				"div " + t + ".z, " + t + ".z, " + this._dataReg + ".w\n" +
				"sat " + t + ".z, " + t + ".z\n" +
				
				"mul " + t + ".w, " + t + ".w, " + t + ".z\n" +
				// 1-z
				"sub " + t + ".z, " + this._dataReg + ".y, " + t + ".z\n" +
				"mul " + t + ".y, " + t + ".y, " + t + ".z\n" +
				"add " + t + ".w, " + t + ".w, " + t + ".y\n" +
				"sat " + t + ".w, " + t + ".w\n";
		}
	}
}
