///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away.arcane;
	//import away.base.StageGL;
	//import away.materials.compilation.ShaderRegisterCache;
	//import away.materials.compilation.ShaderRegisterElement;
	//import away.textures.Texture2DBase;

	//use namespace arcane;

	/**
	 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
	 */
	export class DiffuseBasicMethod extends LightingMethodBase
	{
		private _useAmbientTexture:boolean;

		public _pUseTexture:boolean;
		public _pTotalLightColorReg:ShaderRegisterElement;
		public _pDiffuseInputRegister:ShaderRegisterElement;

		private _texture:away.textures.Texture2DBase;
		private _diffuseColor:number = 0xffffff;
		private _diffuseR:number = 1;
		private _diffuseG:number = 1;
		private _diffuseB:number = 1;
		private _diffuseA:number = 1;

		public _pShadowRegister:ShaderRegisterElement;

		private _alphaThreshold:number = 0;
		public _pIsFirstLight:boolean;

		/**
		 * Creates a new DiffuseBasicMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * Set internally if the ambient method uses a texture.
		 */
		public get iUseAmbientTexture():boolean
		{
			return this._useAmbientTexture;
		}

		public set iUseAmbientTexture(value:boolean)
		{
			if (this._useAmbientTexture == value)
				return;

			this._useAmbientTexture = value;

			this.iInvalidateShaderProgram();

		}

		public iInitVO(vo:MethodVO)
		{

			vo.needsUV = this._pUseTexture;
			vo.needsNormals = vo.numLights > 0;

		}

		/**
		 * Forces the creation of the texture.
		 * @param stageGL The StageGL used by the renderer
		 */
		public generateMip(stageGL:away.base.StageGL)
		{
			if (this._pUseTexture)
				this._texture.activateTextureForStage(0, stageGL);
		}

		/**
		 * The alpha component of the diffuse reflection.
		 */
		public get diffuseAlpha():number
		{
			return this._diffuseA;
		}

		public set diffuseAlpha(value:number)
		{
			this._diffuseA = value;
		}

		/**
		 * The color of the diffuse reflection when not using a texture.
		 */
		public get diffuseColor():number
		{
			return this._diffuseColor;
		}

		public set diffuseColor(diffuseColor:number)
		{
			this._diffuseColor = diffuseColor;
			this.updateDiffuse();

		}

		/**
		 * The bitmapData to use to define the diffuse reflection color per texel.
		 */
		public get texture():away.textures.Texture2DBase
		{
			return this._texture;
		}

		public set texture(value:away.textures.Texture2DBase)
		{

			var b:boolean = ( value != null );

			if (b != this._pUseTexture || (value && this._texture && (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format))) {

				this.iInvalidateShaderProgram();

			}

			this._pUseTexture = b;
			this._texture = value;

		}

		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
		public get alphaThreshold():number
		{
			return this._alphaThreshold;
		}

		public set alphaThreshold(value:number)
		{
			if (value < 0)
				value = 0; else if (value > 1)
				value = 1;
			if (value == this._alphaThreshold)
				return;

			if (value == 0 || this._alphaThreshold == 0)
				this.iInvalidateShaderProgram();

			this._alphaThreshold = value;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			this._texture = null;
		}

		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{

			var m:any = method;

			var diff:DiffuseBasicMethod = <DiffuseBasicMethod> m;

			this.alphaThreshold = diff.alphaThreshold;
			this.texture = diff.texture;
			this.iUseAmbientTexture = diff.iUseAmbientTexture;
			this.diffuseAlpha = diff.diffuseAlpha;
			this.diffuseColor = diff.diffuseColor;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();

			this._pShadowRegister = null;
			this._pTotalLightColorReg = null;
			this._pDiffuseInputRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var code:string = "";

			this._pIsFirstLight = true;

			if (vo.numLights > 0) {
				this._pTotalLightColorReg = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);
			}

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var t:ShaderRegisterElement;

			// write in temporary if not first light, so we can add to total diffuse colour
			if (this._pIsFirstLight) {
				t = this._pTotalLightColorReg;
			} else {

				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);

			}

			//TODO: AGAL <> GLSL

			//*
			code += "dp3 " + t + ".x, " + lightDirReg + ", " + this._sharedRegisters.normalFragment + "\n" + "max " + t + ".w, " + t + ".x, " + this._sharedRegisters.commons + ".y\n";

			if (vo.useLightFallOff) {

				code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

			}


			if (this._iModulateMethod != null)
				code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);


			code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";

			if (!this._pIsFirstLight) {
				code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
				regCache.removeFragmentTempUsage(t);
			}
			//*/
			this._pIsFirstLight = false;

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerProbe(vo:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var t:ShaderRegisterElement;

			// write in temporary if not first light, so we can add to total diffuse colour
			if (this._pIsFirstLight) {

				t = this._pTotalLightColorReg;

			} else {

				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);

			}

			// TODO: AGAL <> GLSL


			code += "tex " + t + ", " + this._sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" + "mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";

			if (this._iModulateMethod != null)
				code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);


			if (!this._pIsFirstLight) {

				code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
				regCache.removeFragmentTempUsage(t);

			}

			this._pIsFirstLight = false;

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = "";
			var albedo:ShaderRegisterElement;
			var cutOffReg:ShaderRegisterElement;

			// incorporate input from ambient
			if (vo.numLights > 0) {

				if (this._pShadowRegister)
					code += this.pApplyShadow(vo, regCache);

				albedo = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(albedo, 1);

			} else {

				albedo = targetReg;

			}


			if (this._pUseTexture) {

				this._pDiffuseInputRegister = regCache.getFreeTextureReg();

				vo.texturesIndex = this._pDiffuseInputRegister.index;


				code += this.pGetTex2DSampleCode(vo, albedo, this._pDiffuseInputRegister, this._texture);

				if (this._alphaThreshold > 0) {

					//TODO: AGAL <> GLSL

					cutOffReg = regCache.getFreeFragmentConstant();
					vo.fragmentConstantsIndex = cutOffReg.index*4;

					code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" + "kil " + albedo + ".w\n" + "add " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n";

				}

			} else {

				//TODO: AGAL <> GLSL

				this._pDiffuseInputRegister = regCache.getFreeFragmentConstant();

				vo.fragmentConstantsIndex = this._pDiffuseInputRegister.index*4;

				code += "mov " + albedo + ", " + this._pDiffuseInputRegister + "\n";


			}

			if (vo.numLights == 0)
				return code;

			//TODO: AGAL <> GLSL
			code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n";

			if (this._useAmbientTexture) {

				//TODO: AGAL <> GLSL

				code += "mul " + albedo + ".xyz, " + albedo + ", " + this._pTotalLightColorReg + "\n" + "mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + "sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" + "add " + targetReg + ".xyz, " + albedo + ", " + targetReg + "\n";


			} else {

				//TODO: AGAL <> GLSL

				code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ", " + targetReg + "\n";

				if (this._pUseTexture) {

					code += "mul " + targetReg + ".xyz, " + albedo + ", " + targetReg + "\n" + "mov " + targetReg + ".w, " + albedo + ".w\n";

				} else {

					code += "mul " + targetReg + ".xyz, " + this._pDiffuseInputRegister + ", " + targetReg + "\n" + "mov " + targetReg + ".w, " + this._pDiffuseInputRegister + ".w\n";

				}

			}

			regCache.removeFragmentTempUsage(this._pTotalLightColorReg);
			regCache.removeFragmentTempUsage(albedo);

			return code;
		}

		/**
		 * Generate the code that applies the calculated shadow to the diffuse light
		 * @param vo The MethodVO object for which the compilation is currently happening.
		 * @param regCache The register cache the compiler is currently using for the register management.
		 */
		public pApplyShadow(vo:MethodVO, regCache:ShaderRegisterCache):string
		{

			//TODO: AGAL <> GLSL
			return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pShadowRegister + ".w\n";

		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			if (this._pUseTexture) {
				stageGL.contextGL.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.gl.ContextGLWrapMode.REPEAT:away.gl.ContextGLWrapMode.CLAMP, vo.useSmoothTextures? away.gl.ContextGLTextureFilter.LINEAR:away.gl.ContextGLTextureFilter.NEAREST, vo.useMipmapping? away.gl.ContextGLMipFilter.MIPLINEAR:away.gl.ContextGLMipFilter.MIPNONE);

				this._texture.activateTextureForStage(vo.texturesIndex, stageGL);

				if (this._alphaThreshold > 0)
					vo.fragmentData[vo.fragmentConstantsIndex] = this._alphaThreshold;

			} else {

				var index:number = vo.fragmentConstantsIndex;
				var data:Array<number> = vo.fragmentData;
				data[index] = this._diffuseR;
				data[index + 1] = this._diffuseG;
				data[index + 2] = this._diffuseB;
				data[index + 3] = this._diffuseA;

			}
		}

		/**
		 * Updates the diffuse color data used by the render state.
		 */
		private updateDiffuse()
		{
			this._diffuseR = ((this._diffuseColor >> 16) & 0xff)/0xff;
			this._diffuseG = ((this._diffuseColor >> 8) & 0xff)/0xff;
			this._diffuseB = (this._diffuseColor & 0xff)/0xff;
		}

		/**
		 * Set internally by the compiler, so the method knows the register containing the shadow calculation.
		 */
		public set iShadowRegister(value:ShaderRegisterElement)
		{
			this._pShadowRegister = value;
		}

		public setIShadowRegister(value:ShaderRegisterElement)
		{
			this._pShadowRegister = value;
		}
	}
}
