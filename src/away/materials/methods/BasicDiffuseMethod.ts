///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.arcane;
	//import away3d.managers.Stage3DProxy;
	//import away3d.materials.compilation.ShaderRegisterCache;
	//import away3d.materials.compilation.ShaderRegisterElement;
	//import away3d.textures.Texture2DBase;
	
	//use namespace arcane;
	
	/**
	 * BasicDiffuseMethod provides the default shading method for Lambert (dot3) diffuse lighting.
	 */
	export class BasicDiffuseMethod extends away.materials.LightingMethodBase
	{
		private _useAmbientTexture:boolean;
		
		private _useTexture:boolean;
		private _totalLightColorReg:away.materials.ShaderRegisterElement;
		
		// TODO: are these registers at all necessary to be members?
		private _diffuseInputRegister:away.materials.ShaderRegisterElement;
		
		private _texture:away.textures.Texture2DBase;
		private _diffuseColor:number = 0xffffff;
		private _diffuseR:number = 1;
        private _diffuseG:number = 1;
        private _diffuseB:number = 1;
        private _diffuseA:number = 1;

		private _shadowRegister:away.materials.ShaderRegisterElement;
		
		private _alphaThreshold:number = 0;
		private _isFirstLight:boolean;
		
		/**
		 * Creates a new BasicDiffuseMethod object.
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
		
		public iInitVO(vo:away.materials.MethodVO)
		{

			vo.needsUV = this._useTexture;
			vo.needsNormals = vo.numLights > 0;

		}

		/**
		 * Forces the creation of the texture.
		 * @param stage3DProxy The Stage3DProxy used by the renderer
		 */
		public generateMip(stage3DProxy:away.managers.Stage3DProxy)
		{
			if (this._useTexture)
				this._texture.getTextureForStage3D(stage3DProxy);
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

            // TODO: Check - TRICKY
            away.Debug.throwPIR( 'BasicDiffuseMethod' , 'set texture' , 'TRICKY - Odd boolean assignment - needs testing' );

            //var v : any = value;
            var b : boolean =  ( value != null );
            //var b : boolean = <boolean> value;

			if ( b != this._useTexture ||
				(value && this._texture && (value.hasMipMaps != this._texture.hasMipMaps || value.format != this._texture.format))) {

				this.iInvalidateShaderProgram();

			}
			
			this._useTexture = b;
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
				value = 0;
			else if (value > 1)
				value = 1;
			if (value == this._alphaThreshold)
				return;
			
			if (value == 0 || this._alphaThreshold == 0)
				this.iInvalidateShaderProgram();//invalidateShaderProgram();
			
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
		public copyFrom(method:away.materials.ShadingMethodBase)
		{

            var m : any = method;

			var diff:BasicDiffuseMethod = <BasicDiffuseMethod> m;

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

			this._shadowRegister = null;
            this._totalLightColorReg = null;
            this._diffuseInputRegister = null;
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

            //TODO: AGAL <> GLSL

            //*
			code += "dp3 " + t + ".x, " + lightDirReg.toString() + ", " + this._sharedRegisters.normalFragment.toString() + "\n" +
				"max " + t.toString() + ".w, " + t.toString() + ".x, " + this._sharedRegisters.commons.toString() + ".y\n";
			
			if (vo.useLightFallOff)
            {

                code += "mul " + t.toString() + ".w, " + t.toString() + ".w, " + lightDirReg.toString() + ".w\n";

            }

			
			if (this._iModulateMethod != null)
            {

                code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);

            }

			
			code += "mul " + t.toString() + ", " + t.toString() + ".w, " + lightColReg.toString() + "\n";
			
			if (!this._isFirstLight) {
				code += "add " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + t.toString() + "\n";
				regCache.removeFragmentTempUsage(t);
			}
			//*/
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

            // TODO: AGAL <> GLSL


			code += "tex " + t.toString() + ", " + this._sharedRegisters.normalFragment.toString() + ", " + cubeMapReg.toString() + " <cube,linear,miplinear>\n" +
				"mul " + t.toString() + ".xyz, " + t.toString() + ".xyz, " + weightRegister + "\n";
			
			if (this._iModulateMethod!= null)
            {

                code += this._iModulateMethod(vo, t, regCache, this._sharedRegisters);

            }

			
			if (!this._isFirstLight)
            {

				code += "add " + this._totalLightColorReg + ".xyz, " + this._totalLightColorReg + ", " + t.toString() + "\n";
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
			var albedo:away.materials.ShaderRegisterElement;
			var cutOffReg:away.materials.ShaderRegisterElement;
			
			// incorporate input from ambient
			if (vo.numLights > 0)
            {

				if (this._shadowRegister)
					code += this.pApplyShadow(vo, regCache);

				albedo = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(albedo, 1);

			}
            else
            {

                albedo = targetReg;

            }

			
			if (this._useTexture)
            {

				this._diffuseInputRegister = regCache.getFreeTextureReg();

				vo.texturesIndex = this._diffuseInputRegister.index;


				code += this.pGetTex2DSampleCode(vo, albedo, this._diffuseInputRegister, this._texture);

				if (this._alphaThreshold > 0)
                {

                    //TODO: AGAL <> GLSL

					cutOffReg = regCache.getFreeFragmentConstant();
					vo.fragmentConstantsIndex = cutOffReg.index*4;

					code += "sub " + albedo.toString() + ".w, " + albedo.toString() + ".w, " + cutOffReg.toString() + ".x\n" +
						"kil " + albedo.toString() + ".w\n" +
						"add " + albedo.toString() + ".w, " + albedo.toString() + ".w, " + cutOffReg.toString() + ".x\n";

				}

			}
            else
            {

                //TODO: AGAL <> GLSL

				this._diffuseInputRegister = regCache.getFreeFragmentConstant();

				vo.fragmentConstantsIndex = this._diffuseInputRegister.index*4;

				code += "mov " + albedo.toString() + ", " + this._diffuseInputRegister.toString() + "\n";


			}
			
			if (vo.numLights == 0)
				return code;

            //TODO: AGAL <> GLSL
			code += "sat " + this._totalLightColorReg.toString() + ", " + this._totalLightColorReg.toString() + "\n";
			
			if (this._useAmbientTexture)
            {

                //TODO: AGAL <> GLSL

				code += "mul " + albedo.toString() + ".xyz, " + albedo.toString() + ", " + this._totalLightColorReg.toString() + "\n" +
					"mul " + this._totalLightColorReg.toString() + ".xyz, " + targetReg.toString() + ", " + this._totalLightColorReg.toString() + "\n" +
					"sub " + targetReg.toString() + ".xyz, " + targetReg.toString() + ", " + this._totalLightColorReg.toString() + "\n" +
					"add " + targetReg.toString() + ".xyz, " + albedo.toString() + ", " + targetReg.toString() + "\n";


			}
            else
            {

                //TODO: AGAL <> GLSL

				code += "add " + targetReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + targetReg.toString() + "\n";

				if (this._useTexture)
                {

					code += "mul " + targetReg.toString() + ".xyz, " + albedo.toString() + ", " + targetReg.toString() + "\n" +
						"mov " + targetReg + ".w, " + albedo + ".w\n";

				}
                else
                {

					code += "mul " + targetReg.toString() + ".xyz, " + this._diffuseInputRegister.toString() + ", " + targetReg.toString() + "\n" +
						"mov " + targetReg.toString() + ".w, " + this._diffuseInputRegister.toString() + ".w\n";

				}

			}
			
			regCache.removeFragmentTempUsage(this._totalLightColorReg);
			regCache.removeFragmentTempUsage(albedo);
			
			return code;
		}

		/**
		 * Generate the code that applies the calculated shadow to the diffuse light
		 * @param vo The MethodVO object for which the compilation is currently happening.
		 * @param regCache The register cache the compiler is currently using for the register management.
		 */
		public pApplyShadow(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{

            //TODO: AGAL <> GLSL
			return "mul " + this._totalLightColorReg.toString() + ".xyz, " + this._totalLightColorReg.toString() + ", " + this._shadowRegister.toString() + ".w\n";

		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy)
		{
			if (this._useTexture)
            {

                //away.Debug.throwPIR( 'BasicDiffuseMethod' , 'iActivate' , 'Context3D.setGLSLTextureAt - params not matching');
				stage3DProxy._iContext3D.setTextureAt(vo.texturesIndex, this._texture.getTextureForStage3D(stage3DProxy));

				if (this._alphaThreshold > 0)
					vo.fragmentData[vo.fragmentConstantsIndex] = this._alphaThreshold;


			}
            else
            {

				var index:number = vo.fragmentConstantsIndex;
				var data:number[] = vo.fragmentData;
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
		public set iShadowRegister(value:away.materials.ShaderRegisterElement)
		{
			this._shadowRegister = value;
		}
	}
}
