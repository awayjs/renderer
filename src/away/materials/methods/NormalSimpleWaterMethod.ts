///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import Texture2DBase							= away.textures.Texture2DBase;

	/**
	 * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
	 */
	export class NormalSimpleWaterMethod extends NormalBasicMethod
	{
		private _texture2:Texture2DBase;
		private _normalTextureRegister2:ShaderRegisterElement;
		private _useSecondNormalMap:boolean = false;
		private _water1OffsetX:number = 0;
		private _water1OffsetY:number = 0;
		private _water2OffsetX:number = 0;
		private _water2OffsetY:number = 0;

		/**
		 * Creates a new NormalSimpleWaterMethod object.
		 * @param waveMap1 A normal map containing one layer of a wave structure.
		 * @param waveMap2 A normal map containing a second layer of a wave structure.
		 */
		constructor(waveMap1:Texture2DBase, waveMap2:Texture2DBase)
		{
			super();
			this.normalMap = waveMap1;
			this.secondaryNormalMap = waveMap2;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			var index:number = vo.fragmentConstantsIndex;
			vo.fragmentData[index] = .5;
			vo.fragmentData[index + 1] = 0;
			vo.fragmentData[index + 2] = 0;
			vo.fragmentData[index + 3] = 1;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			super.iInitVO(vo);

			this._useSecondNormalMap = this.normalMap != this.secondaryNormalMap;
		}

		/**
		 * The translation of the first wave layer along the X-axis.
		 */
		public get water1OffsetX():number
		{
			return this._water1OffsetX;
		}

		public set water1OffsetX(value:number)
		{
			this._water1OffsetX = value;
		}

		/**
		 * The translation of the first wave layer along the Y-axis.
		 */
		public get water1OffsetY():number
		{
			return this._water1OffsetY;
		}

		public set water1OffsetY(value:number)
		{
			this._water1OffsetY = value;
		}

		/**
		 * The translation of the second wave layer along the X-axis.
		 */
		public get water2OffsetX():number
		{
			return this._water2OffsetX;
		}

		public set water2OffsetX(value:number)
		{
			this._water2OffsetX = value;
		}

		/**
		 * The translation of the second wave layer along the Y-axis.
		 */
		public get water2OffsetY():number
		{
			return this._water2OffsetY;
		}

		public set water2OffsetY(value:number)
		{
			this._water2OffsetY = value;
		}

		/**
		 * A second normal map that will be combined with the first to create a wave-like animation pattern.
		 */
		public get secondaryNormalMap():Texture2DBase
		{
			return this._texture2;
		}

		public set secondaryNormalMap(value:Texture2DBase)
		{
			this._texture2 = value;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._normalTextureRegister2 = null;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			super.dispose();
			this._texture2 = null;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:Stage)
		{
			super.iActivate(vo, stage);

			var data:Array<number> = vo.fragmentData;
			var index:number = vo.fragmentConstantsIndex;

			data[index + 4] = this._water1OffsetX;
			data[index + 5] = this._water1OffsetY;
			data[index + 6] = this._water2OffsetX;
			data[index + 7] = this._water2OffsetY;

			//if (this._useSecondNormalMap >= 0)
			if (this._useSecondNormalMap)
				(<IContextStageGL> stage.context).activateTexture(vo.texturesIndex + 1, this._texture2);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var dataReg2:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			this._pNormalTextureRegister = regCache.getFreeTextureReg();
			this._normalTextureRegister2 = this._useSecondNormalMap? regCache.getFreeTextureReg():this._pNormalTextureRegister;
			vo.texturesIndex = this._pNormalTextureRegister.index;

			vo.fragmentConstantsIndex = dataReg.index*4;

			return "add " + temp + ", " + this._sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n" +
				this.pGetTex2DSampleCode(vo, targetReg, this._pNormalTextureRegister, this.normalMap, temp) +
				"add " + temp + ", " + this._sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n" +
				this.pGetTex2DSampleCode(vo, temp, this._normalTextureRegister2, this._texture2, temp) +
				"add " + targetReg + ", " + targetReg + ", " + temp + "		\n" +
				"mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" +
				"sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + this._sharedRegisters.commons + ".xxx	\n" +
				"nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
		}
	}
}
