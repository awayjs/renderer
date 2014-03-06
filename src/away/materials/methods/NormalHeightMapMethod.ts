///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
	 */
	export class NormalHeightMapMethod extends NormalBasicMethod
	{
		private _worldXYRatio:number;
		private _worldXZRatio:number;

		/**
		 * Creates a new NormalHeightMapMethod method.
		 *
		 * @param heightMap The texture containing the height data. 0 means low, 1 means high.
		 * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
		 * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
		 * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
		 */
		constructor(heightMap:away.textures.Texture2DBase, worldWidth:number, worldHeight:number, worldDepth:number)
		{
			super();

			this.normalMap = heightMap;
			this._worldXYRatio = worldWidth/worldHeight;
			this._worldXZRatio = worldDepth/worldHeight;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			var index:number /*int*/ = vo.fragmentConstantsIndex;
			var data:Array<number> = vo.fragmentData;
			data[index] = 1/this.normalMap.width;
			data[index + 1] = 1/this.normalMap.height;
			data[index + 2] = 0;
			data[index + 3] = 1;
			data[index + 4] = this._worldXYRatio;
			data[index + 5] = this._worldXZRatio;
		}

		/**
		 * @inheritDoc
		 */
		public get tangentSpace():boolean
		{
			return false;
		}

		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{
			super.copyFrom(method);

			this._worldXYRatio = (<NormalHeightMapMethod> method)._worldXYRatio;
			this._worldXZRatio = (<NormalHeightMapMethod> method)._worldXZRatio;
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
			vo.texturesIndex = this._pNormalTextureRegister.index;
			vo.fragmentConstantsIndex = dataReg.index*4;
			
			return this.pGetTex2DSampleCode(vo, targetReg, this._pNormalTextureRegister, this.normalMap, this._sharedRegisters.uvVarying, "clamp") +
				
				"add " + temp + ", " + this._sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" +
				this.pGetTex2DSampleCode(vo, temp, this._pNormalTextureRegister, this.normalMap, temp, "clamp") +
				"sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" +
				
				"add " + temp + ", " + this._sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" +
				this.pGetTex2DSampleCode(vo, temp, this._pNormalTextureRegister, this.normalMap, temp, "clamp") +
				"sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" +
				
				"mov " + targetReg + ".y, " + dataReg + ".w\n" +
				"mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" +
				"nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";
		}
	}
}
