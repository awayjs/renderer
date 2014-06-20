///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import DirectionalLight							= away.entities.DirectionalLight;

	/**
	 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
	 */
	export class ShadowSoftMethod extends ShadowMethodBase
	{
		private _range:number = 1;
		private _numSamples:number /*int*/;
		private _offsets:Array<number>;

		/**
		 * Creates a new DiffuseBasicMethod object.
		 *
		 * @param castingLight The light casting the shadows
		 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
		 */
		constructor(castingLight:DirectionalLight, numSamples:number /*int*/ = 5, range:number = 1)
		{
			super(castingLight);

			this.numSamples = numSamples;
			this.range = range;
		}

		/**
		 * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
		 * complexity of the shader.
		 */
		public get numSamples():number /*int*/
		{
			return this._numSamples;
		}

		public set numSamples(value:number /*int*/)
		{
			this._numSamples = value;
			if (this._numSamples < 1)
				this._numSamples = 1; else if (this._numSamples > 32)
				this._numSamples = 32;

			this._offsets = away.geom.PoissonLookup.getDistribution(this._numSamples);
			this.iInvalidateShaderProgram();
		}

		/**
		 * The range in the shadow map in which to distribute the samples.
		 */
		public get range():number
		{
			return this._range;
		}

		public set range(value:number)
		{
			this._range = value;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			super.iInitConstants(vo);

			vo.fragmentData[vo.fragmentConstantsIndex + 8] = 1/this._numSamples;
			vo.fragmentData[vo.fragmentConstantsIndex + 9] = 0;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:Stage)
		{
			super.iActivate(vo, stage);
			var texRange:number = .5*this._range/this._pCastingLight.shadowMapper.depthMapSize;
			var data:Array<number> = vo.fragmentData;
			var index:number /*uint*/ = vo.fragmentConstantsIndex + 10;
			var len:number /*uint*/ = this._numSamples << 1;

			for (var i:number /*int*/ = 0; i < len; ++i)
				data[index + i] = this._offsets[i]*texRange;
		}

		/**
		 * @inheritDoc
		 */
		public _pGetPlanarFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			// todo: move some things to super
			var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
			var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

			vo.fragmentConstantsIndex = decReg.index*4;
			vo.texturesIndex = depthMapRegister.index;

			return this.getSampleCode(regCache, depthMapRegister, decReg, targetReg, customDataReg);
		}

		/**
		 * Adds the code for another tap to the shader code.
		 * @param uv The uv register for the tap.
		 * @param texture The texture register containing the depth map.
		 * @param decode The register containing the depth map decoding data.
		 * @param target The target register to add the tap comparison result.
		 * @param regCache The register cache managing the registers.
		 * @return
		 */
		private addSample(uv:ShaderRegisterElement, texture:ShaderRegisterElement, decode:ShaderRegisterElement, target:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			return "tex " + temp + ", " + uv + ", " + texture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decode + "\n" + "slt " + uv + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
				"add " + target + ".w, " + target + ".w, " + uv + ".w\n";
		}

		/**
		 * @inheritDoc
		 */
		public iActivateForCascade(vo:MethodVO, stage:Stage)
		{
			super.iActivate(vo, stage);
			var texRange:number = this._range/this._pCastingLight.shadowMapper.depthMapSize;
			var data:Array<number> = vo.fragmentData;
			var index:number /*uint*/ = vo.secondaryFragmentConstantsIndex;
			var len:number /*uint*/ = this._numSamples << 1;
			data[index] = 1/this._numSamples;
			data[index + 1] = 0;
			index += 2;

			for (var i:number /*int*/ = 0; i < len; ++i)
				data[index + i] = this._offsets[i]*texRange;

			if (len%4 == 0) {
				data[index + len] = 0;
				data[index + len + 1] = 0;
			}
		}

		/**
		 * @inheritDoc
		 */
		public _iGetCascadeFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement):string
		{
			this._pDepthMapCoordReg = depthProjection;

			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			vo.secondaryFragmentConstantsIndex = dataReg.index*4;

			return this.getSampleCode(regCache, depthTexture, decodeRegister, targetRegister, dataReg);
		}

		/**
		 * Get the actual shader code for shadow mapping
		 * @param regCache The register cache managing the registers.
		 * @param depthTexture The texture register containing the depth map.
		 * @param decodeRegister The register containing the depth map decoding data.
		 * @param targetReg The target register to add the shadow coverage.
		 * @param dataReg The register containing additional data.
		 */
		private getSampleCode(regCache:ShaderRegisterCache, depthTexture:ShaderRegisterElement, decodeRegister:ShaderRegisterElement, targetRegister:ShaderRegisterElement, dataReg:ShaderRegisterElement):string
		{
			var uvReg:ShaderRegisterElement;
			var code:string;
			var offsets:Array<string> = new Array<string>(dataReg + ".zw");
			uvReg = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(uvReg, 1);

			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

			var numRegs:number /*int*/ = this._numSamples >> 1;
			for (var i:number /*int*/ = 0; i < numRegs; ++i) {
				var reg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
				offsets.push(reg + ".xy");
				offsets.push(reg + ".zw");
			}

			for (i = 0; i < this._numSamples; ++i) {
				if (i == 0) {
					code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n";
					code += "tex " + temp + ", " + uvReg + ", " + depthTexture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
				} else {
					code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n";
					code += this.addSample(uvReg, depthTexture, decodeRegister, targetRegister, regCache);
				}
			}

			regCache.removeFragmentTempUsage(uvReg);
			code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average
			return code;
		}
	}
}
