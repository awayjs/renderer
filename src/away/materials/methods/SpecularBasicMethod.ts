///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away.*;
	//import away.managers.*;
	//import away.materials.compilation.*;
	//import away.textures.*;

	//use namespace arcane;

	/**
	 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
	 * version of Phong specularity).
	 */
	export class SpecularBasicMethod extends LightingMethodBase
	{
		public _pUseTexture:boolean;
		public _pTotalLightColorReg:ShaderRegisterElement;
		public _pSpecularTextureRegister:ShaderRegisterElement;
		public _pSpecularTexData:ShaderRegisterElement;
		public _pSpecularDataRegister:ShaderRegisterElement;

		private _texture:away.textures.Texture2DBase;

		private _gloss:number = 50;
		private _specular:number = 1;
		private _specularColor:number = 0xffffff;
		public _iSpecularR:number = 1;
		public _iSpecularG:number = 1;
		public _iSpecularB:number = 1;
		private _shadowRegister:ShaderRegisterElement;
		public _pIsFirstLight:boolean;

		/**
		 * Creates a new SpecularBasicMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsUV = this._pUseTexture;
			vo.needsNormals = vo.numLights > 0;
			vo.needsView = vo.numLights > 0;
		}

		/**
		 * The sharpness of the specular highlight.
		 */
		public get gloss():number
		{
			return this._gloss;
		}

		public set gloss(value:number)
		{
			this._gloss = value;
		}

		/**
		 * The overall strength of the specular highlights.
		 */
		public get specular():number
		{
			return this._specular;
		}

		public set specular(value:number)
		{
			if (value == this._specular)
				return;

			this._specular = value;
			this.updateSpecular();
		}

		/**
		 * The colour of the specular reflection of the surface.
		 */
		public get specularColor():number
		{
			return this._specularColor;
		}

		public set specularColor(value:number)
		{
			if (this._specularColor == value)
				return;

			// specular is now either enabled or disabled
			if (this._specularColor == 0 || value == 0)
				this.iInvalidateShaderProgram();

			this._specularColor = value;
			this.updateSpecular();
		}

		/**
		 * The bitmapData that encodes the specular highlight strength per texel in the red channel, and the sharpness
		 * in the green channel. You can use SpecularBitmapTexture if you want to easily set specular and gloss maps
		 * from grayscale images, but prepared images are preferred.
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
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{

			var m:any = method;
			var bsm:SpecularBasicMethod = <SpecularBasicMethod> method;

			var spec:SpecularBasicMethod = bsm;//SpecularBasicMethod(method);
			this.texture = spec.texture;
			this.specular = spec.specular;
			this.specularColor = spec.specularColor;
			this.gloss = spec.gloss;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._shadowRegister = null;
			this._pTotalLightColorReg = null;
			this._pSpecularTextureRegister = null;
			this._pSpecularTexData = null;
			this._pSpecularDataRegister = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var code:string = "";

			this._pIsFirstLight = true;

			if (vo.numLights > 0) {

				this._pSpecularDataRegister = regCache.getFreeFragmentConstant();
				vo.fragmentConstantsIndex = this._pSpecularDataRegister.index*4;

				if (this._pUseTexture) {

					this._pSpecularTexData = regCache.getFreeFragmentVectorTemp();
					regCache.addFragmentTempUsages(this._pSpecularTexData, 1);
					this._pSpecularTextureRegister = regCache.getFreeTextureReg();
					vo.texturesIndex = this._pSpecularTextureRegister.index;
					code = this.pGetTex2DSampleCode(vo, this._pSpecularTexData, this._pSpecularTextureRegister, this._texture);

				} else {

					this._pSpecularTextureRegister = null;
				}


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

			if (this._pIsFirstLight) {

				t = this._pTotalLightColorReg;

			} else {

				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);

			}

			var viewDirReg:ShaderRegisterElement = this._sharedRegisters.viewDirFragment;
			var normalReg:ShaderRegisterElement = this._sharedRegisters.normalFragment;

			// blinn-phong half vector model

			//TODO: AGAL <> GLSL

			code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" + "nrm " + t + ".xyz, " + t + "\n" + "dp3 " + t + ".w, " + normalReg + ", " + t + "\n" + "sat " + t + ".w, " + t + ".w\n";


			if (this._pUseTexture) {

				//TODO: AGAL <> GLSL

				// apply gloss modulation from texture
				code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";


			} else {

				//TODO: AGAL <> GLSL

				code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";


			}


			// attenuate
			if (vo.useLightFallOff) {

				//TODO: AGAL <> GLSL
				code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";


			}


			if (this._iModulateMethod != null)
				code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);


			//TODO: AGAL <> GLSL
			code += "mul " + t + ".xyz, " + lightColReg + ", " + t + ".w\n";

			if (!this._pIsFirstLight) {
				//TODO: AGAL <> GLSL
				code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";

				regCache.removeFragmentTempUsage(t);

			}

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

			var normalReg:ShaderRegisterElement = this._sharedRegisters.normalFragment;
			var viewDirReg:ShaderRegisterElement = this._sharedRegisters.viewDirFragment;

			//TODO: AGAL <> GLSL

			code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" + "add " + t + ".w, " + t + ".w, " + t + ".w\n" + "mul " + t + ", " + t + ".w, " + normalReg + "\n" + "sub " + t + ", " + t + ", " + viewDirReg + "\n" + "tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + (vo.useSmoothTextures? "linear":"nearest") + ",miplinear>\n" + "mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";


			if (this._iModulateMethod != null)
				code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);

			/*
			 if (this._iModulateMethod!= null)
			 {

			 //TODO: AGAL <> GLSL
			 code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);

			 }
			 */

			if (!this._pIsFirstLight) {

				//TODO: AGAL <> GLSL
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

			if (vo.numLights == 0)
				return code;

			if (this._shadowRegister) {

				//TODO: AGAL <> GLSL
				code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._shadowRegister + ".w\n";

			}


			if (this._pUseTexture) {

				// apply strength modulation from texture

				//TODO: AGAL <> GLSL
				code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularTexData + ".x\n";

				regCache.removeFragmentTempUsage(this._pSpecularTexData);


			}

			// apply material's specular reflection

			//TODO: AGAL <> GLSL

			code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularDataRegister + "\n" + "add " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n";

			regCache.removeFragmentTempUsage(this._pTotalLightColorReg);

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			//var context:ContextGL = stageGL._contextGL;

			if (vo.numLights == 0)
				return;

			if (this._pUseTexture) {

				stageGL.contextGL.setSamplerStateAt(vo.texturesIndex, vo.repeatTextures? away.stagegl.ContextGLWrapMode.REPEAT:away.stagegl.ContextGLWrapMode.CLAMP, vo.useSmoothTextures? away.stagegl.ContextGLTextureFilter.LINEAR:away.stagegl.ContextGLTextureFilter.NEAREST, vo.useMipmapping? away.stagegl.ContextGLMipFilter.MIPLINEAR:away.stagegl.ContextGLMipFilter.MIPNONE);
				this._texture.activateTextureForStage(vo.texturesIndex, stageGL);

			}

			var index:number = vo.fragmentConstantsIndex;
			var data:Array<number> = vo.fragmentData;
			data[index] = this._iSpecularR;
			data[index + 1] = this._iSpecularG;
			data[index + 2] = this._iSpecularB;
			data[index + 3] = this._gloss;
		}

		/**
		 * Updates the specular color data used by the render state.
		 */
		private updateSpecular()
		{
			this._iSpecularR = (( this._specularColor >> 16) & 0xff)/0xff*this._specular;
			this._iSpecularG = (( this._specularColor >> 8) & 0xff)/0xff*this._specular;
			this._iSpecularB = ( this._specularColor & 0xff)/0xff*this._specular;
		}

		/**
		 * Set internally by the compiler, so the method knows the register containing the shadow calculation.
		 */
		public set iShadowRegister(shadowReg:ShaderRegisterElement)
		{

			this._shadowRegister = shadowReg;

		}

		public setIShadowRegister(shadowReg:ShaderRegisterElement)
		{

			this._shadowRegister = shadowReg;

		}


	}
}
