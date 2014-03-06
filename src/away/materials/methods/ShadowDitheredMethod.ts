///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
	 */
	export class ShadowDitheredMethod extends ShadowMethodBase
	{
		private static _grainTexture:away.textures.BitmapTexture;
		private static _grainUsages:number /*int*/;
		private static _grainBitmapData:away.base.BitmapData;
		private _depthMapSize:number /*int*/;
		private _range:number;
		private _numSamples:number /*int*/;

		/**
		 * Creates a new ShadowDitheredMethod object.
		 * @param castingLight The light casting the shadows
		 * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
		 */
		constructor(castingLight:away.lights.DirectionalLight, numSamples:number /*int*/ = 4, range:number = 1)
		{
			super(castingLight);

			this._depthMapSize = this._pCastingLight.shadowMapper.depthMapSize;

			this.numSamples = numSamples;
			this.range = range;

			++ShadowDitheredMethod._grainUsages;

			if (!ShadowDitheredMethod._grainTexture)
				this.initGrainTexture();
		}

		/**
		 * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
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
				this._numSamples = 1; else if (this._numSamples > 24)
				this._numSamples = 24;
			this.iInvalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			super.iInitVO(vo);
			vo.needsProjection = true;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			super.iInitConstants(vo);

			var fragmentData:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.fragmentConstantsIndex;
			fragmentData[index + 8] = 1/this._numSamples;
		}

		/**
		 * The range in the shadow map in which to distribute the samples.
		 */
		public get range():number
		{
			return this._range*2;
		}

		public set range(value:number)
		{
			this._range = value/2;
		}

		/**
		 * Creates a texture containing the dithering noise texture.
		 */
		private initGrainTexture()
		{
			ShadowDitheredMethod._grainBitmapData = new away.base.BitmapData(64, 64, false);
			var vec:Array<number> /*uint*/ = new Array<number>();
			var len:number /*uint*/ = 4096;
			var step:number = 1/(this._depthMapSize*this._range);
			var r:number, g:number;

			for (var i:number /*uint*/ = 0; i < len; ++i) {
				r = 2*(Math.random() - .5);
				g = 2*(Math.random() - .5);
				if (r < 0)
					r -= step; else
					r += step;
				if (g < 0)
					g -= step; else
					g += step;
				if (r > 1)
					r = 1; else if (r < -1)
					r = -1;
				if (g > 1)
					g = 1; else if (g < -1)
					g = -1;
				vec[i] = (Math.floor((r*.5 + .5)*0xff) << 16) | (Math.floor((g*.5 + .5)*0xff) << 8);
			}

			ShadowDitheredMethod._grainBitmapData.setVector(ShadowDitheredMethod._grainBitmapData.rect, vec);
			ShadowDitheredMethod._grainTexture = new away.textures.BitmapTexture(ShadowDitheredMethod._grainBitmapData);
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			if (--ShadowDitheredMethod._grainUsages == 0) {
				ShadowDitheredMethod._grainTexture.dispose();
				ShadowDitheredMethod._grainBitmapData.dispose();
				ShadowDitheredMethod._grainTexture = null;
			}
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			super.iActivate(vo, stageGL);
			var data:Array<number> = vo.fragmentData;
			var index:number /*uint*/ = vo.fragmentConstantsIndex;
			data[index + 9] = (stageGL.width - 1)/63;
			data[index + 10] = (stageGL.height - 1)/63;
			data[index + 11] = 2*this._range/this._depthMapSize;
			stageGL.contextGL.setTextureAt(vo.texturesIndex + 1, ShadowDitheredMethod._grainTexture.getTextureForStageGL(stageGL));
		}

		/**
		 * @inheritDoc
		 */
		public _pGetPlanarFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
			var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var customDataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

			vo.fragmentConstantsIndex = decReg.index*4;
			vo.texturesIndex = depthMapRegister.index;

			return this.getSampleCode(regCache, customDataReg, depthMapRegister, decReg, targetReg);
		}

		/**
		 * Get the actual shader code for shadow mapping
		 * @param regCache The register cache managing the registers.
		 * @param depthMapRegister The texture register containing the depth map.
		 * @param decReg The register containing the depth map decoding data.
		 * @param targetReg The target register to add the shadow coverage.
		 */
		private getSampleCode(regCache:ShaderRegisterCache, customDataReg:ShaderRegisterElement, depthMapRegister:ShaderRegisterElement, decReg:ShaderRegisterElement, targetReg:ShaderRegisterElement):string
		{
			var code:string = "";
			var grainRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
			var uvReg:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var numSamples:number /*int*/ = this._numSamples;
			regCache.addFragmentTempUsages(uvReg, 1);

			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

			var projectionReg:ShaderRegisterElement = this._sharedRegisters.projectionFragment;

			code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" + "mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";

			while (numSamples > 0) {
				if (numSamples == this._numSamples)
					code += "tex " + uvReg + ", " + uvReg + ", " + grainRegister + " <2d,nearest,repeat,mipnone>\n"; else
					code += "tex " + uvReg + ", " + uvReg + ".zwxy, " + grainRegister + " <2d,nearest,repeat,mipnone>\n";

				// keep grain in uvReg.zw
				code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" + // uv-.5
					"mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)

				// first sample

				if (numSamples == this._numSamples) {
					// first sample
					code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._pDepthMapCoordReg + ".xy\n" + "tex " + temp + ", " + uvReg + ", " + depthMapRegister + " <2d,nearest,clamp,mipnone>\n" + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
				} else
					code += this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

				if (numSamples > 4) {
					code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				if (numSamples > 1) {
					code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				if (numSamples > 5) {
					code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				if (numSamples > 2) {
					code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz

					code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._pDepthMapCoordReg + ".xy\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				if (numSamples > 6) {
					code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				if (numSamples > 3) {
					code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				if (numSamples > 7) {
					code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
				}

				numSamples -= 8;
			}

			regCache.removeFragmentTempUsage(uvReg);
			code += "mul " + targetReg + ".w, " + targetReg + ".w, " + customDataReg + ".x\n"; // average
			return code;
		}

		/**
		 * Adds the code for another tap to the shader code.
		 * @param uvReg The uv register for the tap.
		 * @param depthMapRegister The texture register containing the depth map.
		 * @param decReg The register containing the depth map decoding data.
		 * @param targetReg The target register to add the tap comparison result.
		 * @param regCache The register cache managing the registers.
		 * @return
		 */
		private addSample(uvReg:ShaderRegisterElement, depthMapRegister:ShaderRegisterElement, decReg:ShaderRegisterElement, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			return "tex " + temp + ", " + uvReg + ", " + depthMapRegister + " <2d,nearest,clamp,mipnone>\n" + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + temp + ".z, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + // 0 if in shadow
				"add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
		}

		/**
		 * @inheritDoc
		 */
		public iActivateForCascade(vo:MethodVO, stageGL:away.base.StageGL)
		{
			var data:Array<number> = vo.fragmentData;
			var index:number /*uint*/ = vo.secondaryFragmentConstantsIndex;
			data[index] = 1/this._numSamples;
			data[index + 1] = (stageGL.width - 1)/63;
			data[index + 2] = (stageGL.height - 1)/63;
			data[index + 3] = 2*this._range/this._depthMapSize;
			stageGL.contextGL.setTextureAt(vo.texturesIndex + 1, ShadowDitheredMethod._grainTexture.getTextureForStageGL(stageGL));
		}

		/**
		 * @inheritDoc
		 */
		public _iGetCascadeFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement):string
		{
			this._pDepthMapCoordReg = depthProjection;

			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			vo.secondaryFragmentConstantsIndex = dataReg.index*4;

			return this.getSampleCode(regCache, dataReg, depthTexture, decodeRegister, targetRegister);
		}
	}
}
