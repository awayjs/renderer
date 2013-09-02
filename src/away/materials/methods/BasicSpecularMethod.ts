///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.*;
	//import away3d.managers.*;
	//import away3d.materials.compilation.*;
	//import away3d.textures.*;
	
	//use namespace arcane;
	
	/**
	 * BasicSpecularMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
	 * version of Phong specularity).
	 */
	export class BasicSpecularMethod extends away.materials.LightingMethodBase
	{
		private _useTexture:boolean;
		private _totalLightColorReg:away.materials.ShaderRegisterElement;
		private _specularTextureRegister:away.materials.ShaderRegisterElement;
		private _specularTexData:away.materials.ShaderRegisterElement;
		private _specularDataRegister:away.materials.ShaderRegisterElement;
		
		private _texture:away.textures.Texture2DBase;
		
		private _gloss:number = 50;
		private _specular:number = 1;
		private _specularColor:number = 0xffffff;
		public _iSpecularR:number = 1;
        public _iSpecularG:number = 1;
        public _iSpecularB:number = 1;
		private _shadowRegister:away.materials.ShaderRegisterElement;
		private _isFirstLight:boolean;
		
		/**
		 * Creates a new BasicSpecularMethod object.
		 */
		constructor()
		{
			super();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:away.materials.MethodVO)
		{
			vo.needsUV = this._useTexture;
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

            var b : boolean =  ( value != null );

			if ( b != this._useTexture ||
				(value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) {
				this.iInvalidateShaderProgram();
			}
			this._useTexture = b;//Boolean(value);
			this._texture = value;

		}
		
		/**
		 * @inheritDoc
		 */
		public copyFrom(method:ShadingMethodBase)
		{

            var m : any = method;
            var bsm : BasicSpecularMethod = <BasicSpecularMethod> method;

			var spec:BasicSpecularMethod = bsm;//BasicSpecularMethod(method);
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
            this._totalLightColorReg = null;
            this._specularTextureRegister = null;
            this._specularTexData = null;
            this._specularDataRegister = null;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			var code:string = "";
			
			this._isFirstLight = true;
			
			if (vo.numLights > 0)
            {

				this._specularDataRegister = regCache.getFreeFragmentConstant();
				vo.fragmentConstantsIndex = this._specularDataRegister.index*4;
				
				if (this._useTexture)
                {

					this._specularTexData = regCache.getFreeFragmentVectorTemp();
					regCache.addFragmentTempUsages(this._specularTexData, 1);
					this._specularTextureRegister = regCache.getFreeTextureReg();
					vo.texturesIndex = this._specularTextureRegister.index;
					code = this.pGetTex2DSampleCode( vo, this._specularTexData, this._specularTextureRegister, this._texture );

				}
                else
                {

                    this._specularTextureRegister = null;
                }

				
				this._totalLightColorReg = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(this._totalLightColorReg, 1);
			}
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:away.materials.MethodVO, lightDirReg:away.materials.ShaderRegisterElement, lightColReg:away.materials.ShaderRegisterElement, regCache:away.materials.ShaderRegisterCache):string
		{
			var code:string = "";
			var t:away.materials.ShaderRegisterElement;
			
			if (this._isFirstLight)
            {

                t = this._totalLightColorReg;

            }
			else
            {

				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);

			}
			
			var viewDirReg:ShaderRegisterElement = this._sharedRegisters.viewDirFragment;
			var normalReg:ShaderRegisterElement = this._sharedRegisters.normalFragment;
			
			// blinn-phong half vector model

            //TODO: AGAL <> GLSL

			code += "add " + t.toString() + ", " + lightDirReg.toString() + ", " + viewDirReg.toString() + "\n" +
				"nrm " + t.toString() + ".xyz, " + t.toString() + "\n" +
				"dp3 " + t.toString() + ".w, " + normalReg.toString() + ", " + t.toString() + "\n" +
				"sat " + t.toString() + ".w, " + t.toString() + ".w\n";


			if (this._useTexture)
            {

                //TODO: AGAL <> GLSL

				// apply gloss modulation from texture
				code += "mul " + this._specularTexData.toString() + ".w, " + this._specularTexData.toString() + ".y, " + this._specularDataRegister.toString() + ".w\n" +
					"pow " + t + ".w, " + t + ".w, " + this._specularTexData.toString() + ".w\n";


			}
            else
            {

                //TODO: AGAL <> GLSL

                code += "pow " + t.toString() + ".w, " + t.toString() + ".w, " + this._specularDataRegister.toString() + ".w\n";


            }

			
			// attenuate
			if (vo.useLightFallOff)
            {

                //TODO: AGAL <> GLSL
                code += "mul " + t.toString() + ".w, " + t.toString() + ".w, " + lightDirReg.toString() + ".w\n";


            }

			
			if (this._iModulateMethod != null)
            {

                //TODO: AGAL <> GLSL
                code += this._iModulateMethod (vo, t, regCache, this._sharedRegisters);

            }


            //TODO: AGAL <> GLSL
			code += "mul " + t.toString() + ".xyz, " + lightColReg.toString() + ", " + t.toString() + ".w\n";
			
			if (! this._isFirstLight)
            {
                //TODO: AGAL <> GLSL
				code += "add " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + t.toString() + "\n";

				regCache.removeFragmentTempUsage(t);

			}
			
			this._isFirstLight = false;
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerProbe(vo:away.materials.MethodVO, cubeMapReg:away.materials.ShaderRegisterElement, weightRegister:string, regCache:away.materials.ShaderRegisterCache):string
		{
			var code:string = "";
			var t:away.materials.ShaderRegisterElement;
			
			// write in temporary if not first light, so we can add to total diffuse colour
			if (this._isFirstLight)
            {

                t = this._totalLightColorReg;

            }
			else
            {

				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);

			}
			
			var normalReg:away.materials.ShaderRegisterElement = this._sharedRegisters.normalFragment;
			var viewDirReg:away.materials.ShaderRegisterElement = this._sharedRegisters.viewDirFragment;

            //TODO: AGAL <> GLSL

			code += "dp3 " + t.toString() + ".w, " + normalReg.toString() + ", " + viewDirReg.toString() + "\n" +
				"add " + t.toString() + ".w, " + t.toString() + ".w, " + t.toString() + ".w\n" +
				"mul " + t.toString() + ", " + t.toString() + ".w, " + normalReg.toString() + "\n" +
				"sub " + t.toString() + ", " + t.toString() + ", " + viewDirReg.toString() + "\n" +
				"tex " + t.toString() + ", " + t.toString() + ", " + cubeMapReg.toString() + " <cube," + (vo.useSmoothTextures? "linear" : "nearest") + ",miplinear>\n" +
				"mul " + t.toString() + ".xyz, " + t.toString() + ", " + weightRegister.toString() + "\n";


			if (this._iModulateMethod!= null)
            {

                //TODO: AGAL <> GLSL
                code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);

            }

			
			if (!this._isFirstLight)
            {

                //TODO: AGAL <> GLSL
				code += "add " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + t.toString() + "\n";

				regCache.removeFragmentTempUsage(t);

			}
			
			this._isFirstLight = false;
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			var code:string = "";
			
			if (vo.numLights == 0)
				return code;
			
			if (this._shadowRegister)
            {

                //TODO: AGAL <> GLSL
                code += "mul " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + this._shadowRegister.toString() + ".w\n";

            }

			
			if (this._useTexture)
            {

				// apply strength modulation from texture

                //TODO: AGAL <> GLSL
				code += "mul " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + this._specularTexData.toString() + ".x\n";

				regCache.removeFragmentTempUsage(this._specularTexData);


			}
			
			// apply material's specular reflection

            //TODO: AGAL <> GLSL

			code += "mul " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + this._specularDataRegister.toString() + "\n" +
				"add " + targetReg.toString() + ".xyz, " + targetReg.toString() + ", " + this._totalLightColorReg.toString() + "\n";

			regCache.removeFragmentTempUsage( this._totalLightColorReg );
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy)
		{
			//var context : Context3D = stage3DProxy._context3D;
			
			if (vo.numLights == 0)
				return;
			
			if (this._useTexture)
            {

               stage3DProxy._iContext3D.setSamplerStateAt( vo.texturesIndex ,
                    vo.repeatTextures ?  away.display3D.Context3DWrapMode.REPEAT :  away.display3D.Context3DWrapMode.CLAMP,
                    vo.useSmoothTextures ? away.display3D.Context3DTextureFilter.LINEAR : away.display3D.Context3DTextureFilter.NEAREST ,
                    vo.useMipmapping ? away.display3D.Context3DMipFilter.MIPLINEAR : away.display3D.Context3DMipFilter.MIPNONE );
               stage3DProxy._iContext3D.setTextureAt(vo.texturesIndex, this._texture.getTextureForStage3D(stage3DProxy));

            }

			var index:number = vo.fragmentConstantsIndex;
			var data:number[] = vo.fragmentData;
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
		public set iShadowRegister(shadowReg:away.materials.ShaderRegisterElement)
		{

			this._shadowRegister = shadowReg;

		}
        
	}
}
