///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
	 */
	export class SpecularFresnelMethod extends SpecularCompositeMethod
	{
		private _dataReg:ShaderRegisterElement;
		private _incidentLight:boolean;
		private _fresnelPower:number = 5;
		private _normalReflectance:number = .028; // default value for skin

		/**
		 * Creates a new SpecularFresnelMethod object.
		 * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
		 * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
		 */
		constructor(basedOnSurface:boolean = true, baseMethod:SpecularBasicMethod = null)
		{
			// may want to offer diff speculars
			super(null, baseMethod);

			this.baseMethod._iModulateMethod = (vo:MethodVO, target:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.modulateSpecular(vo, target, regCache, sharedRegisters);
				
			this._incidentLight = !basedOnSurface;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{

			var index:number = vo.secondaryFragmentConstantsIndex;
			vo.fragmentData[index + 2] = 1;
			vo.fragmentData[index + 3] = 0;
		}

		/**
		 * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
		 */
		public get basedOnSurface():boolean
		{
			return !this._incidentLight;
		}

		public set basedOnSurface(value:boolean)
		{
			if (this._incidentLight != value)
				return;

			this._incidentLight = !value;

			this.iInvalidateShaderProgram();
		}

		/**
		 * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
		 */
		public get fresnelPower():number
		{
			return this._fresnelPower;
		}

		public set fresnelPower(value:number)
		{
			this._fresnelPower = value;
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
		 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
		 */
		public get normalReflectance():number
		{
			return this._normalReflectance;
		}

		public set normalReflectance(value:number)
		{
			this._normalReflectance = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			super.iActivate(vo, stageGL);
			var fragmentData:Array<number> = vo.fragmentData;

			var index:number = vo.secondaryFragmentConstantsIndex;
			fragmentData[index] = this._normalReflectance;
			fragmentData[index + 1] = this._fresnelPower;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			this._dataReg = regCache.getFreeFragmentConstant();

			console.log('SpecularFresnelMethod', 'iGetFragmentPreLightingCode', this._dataReg);

			vo.secondaryFragmentConstantsIndex = this._dataReg.index*4;
			return super.iGetFragmentPreLightingCode(vo, regCache);
		}

		/**
		 * Applies the fresnel effect to the specular strength.
		 *
		 * @param vo The MethodVO object containing the method data for the currently compiled material pass.
		 * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
		 * @param regCache The register cache used for the shader compilation.
		 * @param sharedRegisters The shared registers created by the compiler.
		 * @return The AGAL fragment code for the method.
		 */
		private modulateSpecular(vo:MethodVO, target:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string;

			code = "dp3 " + target + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight? target + ".xyz\n":sharedRegisters.normalFragment + ".xyz\n") +   // dot(V, H)
				"sub " + target + ".y, " + this._dataReg + ".z, " + target + ".y\n" +             // base = 1-dot(V, H)
				"pow " + target + ".x, " + target + ".y, " + this._dataReg + ".y\n" +             // exp = pow(base, 5)
				"sub " + target + ".y, " + this._dataReg + ".z, " + target + ".y\n" +             // 1 - exp
				"mul " + target + ".y, " + this._dataReg + ".x, " + target + ".y\n" +             // f0*(1 - exp)
				"add " + target + ".y, " + target + ".x, " + target + ".y\n" +          // exp + f0*(1 - exp)
				"mul " + target + ".w, " + target + ".w, " + target + ".y\n";


			console.log('SpecularFresnelMethod', 'modulateSpecular', code);

			return code;
		}

	}
}
