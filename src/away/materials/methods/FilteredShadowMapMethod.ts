///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * DitheredShadowMapMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
	 * results of neighbouring pixels.
	 */
	export class FilteredShadowMapMethod extends away.materials.SimpleShadowMapMethodBase
	{
		/**
		 * Creates a new BasicDiffuseMethod object.
		 *
		 * @param castingLight The light casting the shadow
		 */
			constructor(castingLight:away.lights.DirectionalLight)
		{
			super(castingLight);
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO):void
		{
			super.iInitConstants(vo);

			var fragmentData:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.fragmentConstantsIndex;
			fragmentData[index + 8] = .5;
			var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
			fragmentData[index + 9] = size;
			fragmentData[index + 10] = 1/size;
		}

		/**
		 * @inheritDoc
		 */
		public _pGetPlanarFragmentCode(vo:MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			var depthMapRegister:away.materials.ShaderRegisterElement = regCache.getFreeTextureReg();
			var decReg:away.materials.ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var dataReg:away.materials.ShaderRegisterElement = regCache.getFreeFragmentConstant();
			// TODO: not used
			dataReg = dataReg;
			var customDataReg:away.materials.ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var depthCol:away.materials.ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var uvReg:away.materials.ShaderRegisterElement;
			var code:string = "";
			vo.fragmentConstantsIndex = decReg.index*4;

			regCache.addFragmentTempUsages(depthCol, 1);

			uvReg = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(uvReg, 1);

			code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" +

				"tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

				"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + 	// (1, 0)
				"tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

				"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

				"mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" + "add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" +	// (0, 1)
				"tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

				"add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" +	// (1, 1)
				"tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" +   // 0 if in shadow

				// recalculate fraction, since we ran out of registers :(
				"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" +

				"mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";

			regCache.removeFragmentTempUsage(depthCol);
			regCache.removeFragmentTempUsage(uvReg);

			vo.texturesIndex = depthMapRegister.index;

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivateForCascade(vo:MethodVO, stage3DProxy:away.managers.Stage3DProxy):void
		{
			var size:number /*int*/ = this.castingLight.shadowMapper.depthMapSize;
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			var data:Array<number> = vo.fragmentData;
			data[index] = size;
			data[index + 1] = 1/size;
		}

		/**
		 * @inheritDoc
		 */
		public _iGetCascadeFragmentCode(vo:MethodVO, regCache:away.materials.ShaderRegisterCache, decodeRegister:away.materials.ShaderRegisterElement, depthTexture:away.materials.ShaderRegisterElement, depthProjection:away.materials.ShaderRegisterElement, targetRegister:away.materials.ShaderRegisterElement):string
		{
			var code:string;
			var dataReg:away.materials.ShaderRegisterElement = regCache.getFreeFragmentConstant();
			vo.secondaryFragmentConstantsIndex = dataReg.index*4;
			var temp:away.materials.ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(temp, 1);
			var predicate:away.materials.ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(predicate, 1);

			code = "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" +

				"add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" +

				"add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" +

				"sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" +

				"mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" + "frc " + temp + ".xy, " + temp + ".xy\n" +

				// some strange register juggling to prevent agal bugging out
				"sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" + "mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" +

				"add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" +

				"sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" + "mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" + "add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";

			regCache.removeFragmentTempUsage(temp);
			regCache.removeFragmentTempUsage(predicate);
			return code;
		}
	}
}
