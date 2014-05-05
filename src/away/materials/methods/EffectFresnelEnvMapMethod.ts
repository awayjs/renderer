///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
	 * stronger as the viewing angle becomes more grazing.
	 */
	export class EffectFresnelEnvMapMethod extends EffectMethodBase
	{
		private _cubeTexture:away.textures.CubeTextureBase;
		private _fresnelPower:number = 5;
		private _normalReflectance:number = 0;
		private _alpha:number;
		private _mask:away.textures.Texture2DBase;

		/**
		 * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
		 *
		 * @param envMap The environment map containing the reflected scene.
		 * @param alpha The reflectivity of the material.
		 */
		constructor(envMap:away.textures.CubeTextureBase, alpha:number = 1)
		{
			super();

			this._cubeTexture = envMap;
			this._alpha = alpha;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsNormals = true;
			vo.needsView = true;
			vo.needsUV = this._mask != null;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			vo.fragmentData[vo.fragmentConstantsIndex + 3] = 1;
		}

		/**
		 * An optional texture to modulate the reflectivity of the surface.
		 */
		public get mask():away.textures.Texture2DBase
		{
			return this._mask;
		}
		
		public set mask(value:away.textures.Texture2DBase)
		{
			if (Boolean(value) != Boolean(this._mask) ||
				(value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format))) {
				this.iInvalidateShaderProgram();
			}
			this._mask = value;
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
		 * The cubic environment map containing the reflected scene.
		 */
		public get envMap():away.textures.CubeTextureBase
		{
			return this._cubeTexture;
		}
		
		public set envMap(value:away.textures.CubeTextureBase)
		{
			this._cubeTexture = value;
		}

		/**
		 * The reflectivity of the surface.
		 */
		public get alpha():number
		{
			return this._alpha;
		}
		
		public set alpha(value:number)
		{
			this._alpha = value;
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
			var data:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.fragmentConstantsIndex;
			data[index] = this._alpha;
			data[index + 1] = this._normalReflectance;
			data[index + 2] = this._fresnelPower;
			this._cubeTexture.activateTextureForStage(vo.texturesIndex, stageGL);
			if (this._mask)
				this._mask.activateTextureForStage(vo.texturesIndex + 1, stageGL);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var dataRegister:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var code:string = "";
			var cubeMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			var viewDirReg:ShaderRegisterElement = this._sharedRegisters.viewDirFragment;
			var normalReg:ShaderRegisterElement = this._sharedRegisters.normalFragment;
			
			vo.texturesIndex = cubeMapReg.index;
			vo.fragmentConstantsIndex = dataRegister.index*4;
			
			regCache.addFragmentTempUsages(temp, 1);
			var temp2:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			
			// r = V - 2(V.N)*N
			code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz		\n" +
				"add " + temp + ".w, " + temp + ".w, " + temp + ".w											\n" +
				"mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w						\n" +
				"sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz					\n" +
				this.pGetTexCubeSampleCode(vo, temp, cubeMapReg, this._cubeTexture, temp) +
				"sub " + temp2 + ".w, " + temp + ".w, fc0.x									\n" +               	// -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "											\n";
			
			// calculate fresnel term
			code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" +   // dot(V, H)
				"sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +             // base = 1-dot(V, H)
				
				"pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" +             // exp = pow(base, 5)
				
				"sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" +             // 1 - exp
				"mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" +             // f0*(1 - exp)
				"add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" +          // exp + f0*(1 - exp)
				
				// total alpha
				"mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";
			
			if (this._mask) {
				var maskReg:ShaderRegisterElement = regCache.getFreeTextureReg();
				code += this.pGetTex2DSampleCode(vo, temp2, maskReg, this._mask, this._sharedRegisters.uvVarying) +
					"mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
			}
			
			// blend
			code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w						\n" +
				"add " + targetReg + ", " + targetReg + ", " + temp + "						\n";
			
			regCache.removeFragmentTempUsage(temp);
			
			return code;
		}
	}
}
