///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * ShaderCompiler is an abstract base class for shader compilers that use modular shader methods to assemble a
	 * material. Concrete subclasses are used by the default materials.
	 *
	 * @see away3d.materials.methods.ShadingMethodBase
	 */
	export class ShaderCompiler
	{
        public _pSharedRegisters:away.materials.ShaderRegisterData;// PROTECTED
        public _pRegisterCache:away.materials.ShaderRegisterCache;// PROTECTED
		public _pDependencyCounter:away.materials.MethodDependencyCounter; // PROTECTED
        public _pMethodSetup:away.materials.ShaderMethodSetup;// PROTECTED

		private _smooth:boolean;
		private _repeat:boolean;
		private _mipmap:boolean;
		public _pEnableLightFallOff:boolean;
		private _preserveAlpha:boolean = true;
		private _animateUVs:boolean;
		public _pAlphaPremultiplied:boolean; // PROTECTED
		private _vertexConstantData:number[];
		private _fragmentConstantData:number[];

		public _pVertexCode:string = ''; // Changed to emtpy string- AwayTS
        public _pFragmentCode:string = '';// Changed to emtpy string - AwayTS
		private _fragmentLightCode:string;
		private _fragmentPostLightCode:string;
		private _commonsDataIndex:number = -1;

		public _pAnimatableAttributes:string[]; // PROTECTED
		public _pAnimationTargetRegisters:string[]; // PROTECTED

		public _pLightProbeDiffuseIndices:number[] /*uint*/;
        public _pLightProbeSpecularIndices:number[] /*uint*/;
		private _uvBufferIndex:number = -1;
		private _uvTransformIndex:number = -1;
		private _secondaryUVBufferIndex:number = -1;
		public  _pNormalBufferIndex:number = -1; // PROTECTED
		public _pTangentBufferIndex:number = -1; // PROTECTED
		public _pLightFragmentConstantIndex:number = -1; //PROTECTED
		private _sceneMatrixIndex:number = -1;
		public _pSceneNormalMatrixIndex:number = -1; //PROTECTED
		public _pCameraPositionIndex:number = -1; // PROTECTED
		public _pProbeWeightsIndex:number = -1; // PROTECTED

		private _specularLightSources:number;
		private _diffuseLightSources:number;

		public _pNumLights:number;  // PROTECTED
		public _pNumLightProbes:number; // PROTECTED
		public _pNumPointLights:number; // PROTECTED
		public _pNumDirectionalLights:number; // PROTECTED

		public _pNumProbeRegisters:number; // PROTECTED
		private _combinedLightSources:number;

		public _usingSpecularMethod:boolean;

		private _needUVAnimation:boolean;
		private _UVTarget:string;
		private _UVSource:string;

		public _pProfile:string;

		private _forceSeperateMVP:boolean;

		/**
		 * Creates a new ShaderCompiler object.
		 * @param profile The compatibility profile of the renderer.
		 */
		constructor(profile:string)
		{
			this._pSharedRegisters = new away.materials.ShaderRegisterData();
            this._pDependencyCounter = new away.materials.MethodDependencyCounter();
            this._pProfile = profile;
            this.initRegisterCache(profile);
		}

		/**
		 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
		 * compatibility for constrained mode.
		 */
		public get enableLightFallOff():boolean
		{
			return this._pEnableLightFallOff;
		}

		public set enableLightFallOff(value:boolean)
		{
            this._pEnableLightFallOff = value;
		}

		/**
		 * Indicates whether the compiled code needs UV animation.
		 */
		public get needUVAnimation():boolean
		{
			return this._needUVAnimation;
		}

		/**
		 * The target register to place the animated UV coordinate.
		 */
		public get UVTarget():string
		{
			return this._UVTarget;
		}

		/**
		 * The souce register providing the UV coordinate to animate.
		 */
		public get UVSource():string
		{
			return this._UVSource;
		}

		/**
		 * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
		 * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
		 * projection code.
		 */
		public get forceSeperateMVP():boolean
		{
			return this._forceSeperateMVP;
		}

		public set forceSeperateMVP(value:boolean)
		{
            this._forceSeperateMVP = value;
		}

		/**
		 * Initialized the register cache.
		 * @param profile The compatibility profile of the renderer.
		 */
		private initRegisterCache(profile:string)
		{
            this._pRegisterCache = new away.materials.ShaderRegisterCache(profile);
            this._pRegisterCache.vertexAttributesOffset = 1;
            this._pRegisterCache.reset();
		}

		/**
		 * Indicate whether UV coordinates need to be animated using the renderable's transformUV matrix.
		 */
		public get animateUVs():boolean
		{
			return this._animateUVs;
		}

		public set animateUVs(value:boolean)
		{
            this._animateUVs = value;
		}

		/**
		 * Indicates whether visible textures (or other pixels) used by this material have
		 * already been premultiplied.
		 */
		public get alphaPremultiplied():boolean
		{
			return this._pAlphaPremultiplied;
		}

		public set alphaPremultiplied(value:boolean)
		{
            this._pAlphaPremultiplied = value;
		}

		/**
		 * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
		 */
		public get preserveAlpha():boolean
		{
			return this._preserveAlpha;
		}

		public set preserveAlpha(value:boolean)
		{
            this._preserveAlpha = value;
		}

		/**
		 * Sets the default texture sampling properties.
		 * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
		 * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to true.
		 * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to true.
		 */
		public setTextureSampling(smooth:boolean, repeat:boolean, mipmap:boolean)
		{
            this._smooth = smooth;
            this._repeat = repeat;
            this._mipmap = mipmap;
		}

		/**
		 * Sets the constant buffers allocated by the material. This allows setting constant data during compilation.
		 * @param vertexConstantData The vertex constant data buffer.
		 * @param fragmentConstantData The fragment constant data buffer.
		 */
		public setConstantDataBuffers(vertexConstantData:number[], fragmentConstantData:number[])
		{
            this._vertexConstantData = vertexConstantData;
            this._fragmentConstantData = fragmentConstantData;
		}

		/**
		 * The shader method setup object containing the method configuration and their value objects for the material being compiled.
		 */
		public get methodSetup():away.materials.ShaderMethodSetup
		{
			return this._pMethodSetup;
		}

		public set methodSetup(value:away.materials.ShaderMethodSetup)
		{
            this._pMethodSetup = value;
		}

		/**
		 * Compiles the code after all setup on the compiler has finished.
		 */
		public compile()
		{
			this.pInitRegisterIndices();
			this.pInitLightData();

			this._pAnimatableAttributes = new Array<string>( "va0" );//Vector.<String>(["va0"]);
            this._pAnimationTargetRegisters = new Array<string>( "vt0" );//Vector.<String>(["vt0"]);
            this._pVertexCode = "";
            this._pFragmentCode = "";

            this._pSharedRegisters.localPosition = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages( this._pSharedRegisters.localPosition, 1);

            this.createCommons();
            this.pCalculateDependencies();
            this.updateMethodRegisters();

			for (var i:number = 0; i < 4; ++i)
                this._pRegisterCache.getFreeVertexConstant();

            this.pCreateNormalRegisters();

			if (this._pDependencyCounter.globalPosDependencies > 0 || this._forceSeperateMVP)
                this.pCompileGlobalPositionCode();

            this.compileProjectionCode();
            this.pCompileMethodsCode();
            this.compileFragmentOutput();
            this._fragmentPostLightCode = this.fragmentCode;
		}

		/**
		 * Creates the registers to contain the normal data.
		 */
		public pCreateNormalRegisters()
		{

		}

		/**
		 * Compile the code for the methods.
		 */
		public pCompileMethodsCode()
		{
			if (this._pDependencyCounter.uvDependencies > 0)
                this.compileUVCode();

			if (this._pDependencyCounter.secondaryUVDependencies > 0)
                this.compileSecondaryUVCode();

			if (this._pDependencyCounter.normalDependencies > 0)
                this.pCompileNormalCode();

			if (this._pDependencyCounter.viewDirDependencies > 0)
                this.pCompileViewDirCode();

            this.pCompileLightingCode();
            this._fragmentLightCode = this._pFragmentCode;
            this._pFragmentCode = "";
            this.pCompileMethods();
		}

		/**
		 * Compile the lighting code.
		 */
		public pCompileLightingCode()
		{

		}

		/**
		 * Calculate the view direction.
		 */
		public pCompileViewDirCode()
		{

		}

		/**
		 * Calculate the normal.
		 */
		public pCompileNormalCode()
		{

		}

		/**
		 * Calculate the (possibly animated) UV coordinates.
		 */
		private compileUVCode()
		{
			var uvAttributeReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexAttribute();
			this._uvBufferIndex = uvAttributeReg.index;

			var varying:ShaderRegisterElement = this._pRegisterCache.getFreeVarying();

			this._pSharedRegisters.uvVarying = varying;

			if (this.animateUVs)
            {

				// a, b, 0, tx
				// c, d, 0, ty
				var uvTransform1:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
				var uvTransform2:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
                this._uvTransformIndex = uvTransform1.index*4;

                // TODO: AGAL <> GLSL

                this._pVertexCode += "dp4 " + varying.toString() + ".x, " + uvAttributeReg.toString() + ", " + uvTransform1.toString() + "\n" +
					"dp4 " + varying.toString() + ".y, " + uvAttributeReg.toString() + ", " + uvTransform2.toString() + "\n" +
					"mov " + varying.toString() + ".zw, " + uvAttributeReg.toString() + ".zw \n";

			}
            else
            {

				this._uvTransformIndex = -1;
                this._needUVAnimation = true;
                this._UVTarget = varying.toString();
                this._UVSource = uvAttributeReg.toString();

			}
		}

		/**
		 * Provide the secondary UV coordinates.
		 */
		private compileSecondaryUVCode()
		{
            // TODO: AGAL <> GLSL

			var uvAttributeReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexAttribute();
            this._secondaryUVBufferIndex = uvAttributeReg.index;
            this._pSharedRegisters.secondaryUVVarying = this._pRegisterCache.getFreeVarying();
            this._pVertexCode += "mov " + this._pSharedRegisters.secondaryUVVarying.toString() + ", " + uvAttributeReg.toString() + "\n";
		}

		/**
		 * Compile the world-space position.
		 */
		public pCompileGlobalPositionCode()
		{

            // TODO: AGAL <> GLSL

			this._pSharedRegisters.globalPositionVertex = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.globalPositionVertex, this._pDependencyCounter.globalPosDependencies);
			var positionMatrixReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
            this._pRegisterCache.getFreeVertexConstant();
            this._pRegisterCache.getFreeVertexConstant();
            this._pRegisterCache.getFreeVertexConstant();
            this._sceneMatrixIndex = positionMatrixReg.index*4;

            this._pVertexCode += "m44 " + this._pSharedRegisters.globalPositionVertex.toString() + ", " + this._pSharedRegisters.localPosition.toString() + ", " + positionMatrixReg.toString() + "\n";

			if (this._pDependencyCounter.usesGlobalPosFragment)
            {

                this._pSharedRegisters.globalPositionVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "mov " + this._pSharedRegisters.globalPositionVarying.toString() + ", " + this._pSharedRegisters.globalPositionVertex.toString() + "\n";

			}
		}

		/**
		 * Get the projection coordinates.
		 */
		private compileProjectionCode()
		{
			var pos:string = this._pDependencyCounter.globalPosDependencies > 0 || this._forceSeperateMVP? this._pSharedRegisters.globalPositionVertex.toString() : this._pAnimationTargetRegisters[0];
			var code:string;

            // TODO: AGAL <> GLSL

			if (this._pDependencyCounter.projectionDependencies > 0)
            {

                this._pSharedRegisters.projectionFragment = this._pRegisterCache.getFreeVarying();

				code = "m44 vt5, " + pos + ", vc0		\n" +
					"mov " + this._pSharedRegisters.projectionFragment.toString() + ", vt5\n" +
					"mov op, vt5\n";
			}
            else
            {

                code = "m44 op, " + pos + ", vc0		\n";

            }


            this._pVertexCode += code;

		}

		/**
		 * Assign the final output colour the the output register.
		 */
		private compileFragmentOutput()
		{
            // TODO: AGAL <> GLSL

			this._pFragmentCode += "mov " + this._pRegisterCache.fragmentOutputRegister.toString() + ", " + this._pSharedRegisters.shadedTarget.toString() + "\n";
            this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.shadedTarget);
		}

		/**
		 * Reset all the indices to "unused".
		 */
		public pInitRegisterIndices()
		{
			this._commonsDataIndex = -1;
            this._pCameraPositionIndex = -1;
            this._uvBufferIndex = -1;
            this._uvTransformIndex = -1;
            this._secondaryUVBufferIndex = -1;
            this._pNormalBufferIndex = -1;
            this._pTangentBufferIndex = -1;
            this._pLightFragmentConstantIndex = -1;
            this._sceneMatrixIndex = -1;
            this._pSceneNormalMatrixIndex = -1;
            this._pProbeWeightsIndex = -1;

		}

		/**
		 * Prepares the setup for the light code.
		 */
		public pInitLightData()
		{
            this._pNumLights = this._pNumPointLights + this._pNumDirectionalLights;
            this._pNumProbeRegisters = Math.ceil(this._pNumLightProbes/4);


			if (this._pMethodSetup._iSpecularMethod)
            {

                this._combinedLightSources = this._specularLightSources | this._diffuseLightSources;

            }
			else
            {

                this._combinedLightSources = this._diffuseLightSources;

            }

            this._usingSpecularMethod = Boolean(this._pMethodSetup._iSpecularMethod && (
                this.pUsesLightsForSpecular() ||
                this.pUsesProbesForSpecular()));

		}

		/**
		 * Create the commonly shared constant register.
		 */
		private createCommons()
		{
			this._pSharedRegisters.commons = this._pRegisterCache.getFreeFragmentConstant();
            this._commonsDataIndex = this._pSharedRegisters.commons.index*4;
		}

		/**
		 * Figure out which named registers are required, and how often.
		 */
		public pCalculateDependencies()
		{
            this._pDependencyCounter.reset();



			var methods:away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;//Vector.<MethodVOSet>
			var len:number;

			this.setupAndCountMethodDependencies(this._pMethodSetup._iDiffuseMethod, this._pMethodSetup._iDiffuseMethodVO);


			if (this._pMethodSetup._iShadowMethod)
				this.setupAndCountMethodDependencies(this._pMethodSetup._iShadowMethod, this._pMethodSetup._iShadowMethodVO);


			this.setupAndCountMethodDependencies(this._pMethodSetup._iAmbientMethod, this._pMethodSetup._iAmbientMethodVO);

			if (this._usingSpecularMethod)
				this.setupAndCountMethodDependencies(this._pMethodSetup._iSpecularMethod, this._pMethodSetup._iSpecularMethodVO);

			if (this._pMethodSetup._iColorTransformMethod)
				this.setupAndCountMethodDependencies(this._pMethodSetup._iColorTransformMethod, this._pMethodSetup._iColorTransformMethodVO);

			len = methods.length;

			for (var i:number = 0; i < len; ++i)
				this.setupAndCountMethodDependencies(methods[i].method, methods[i].data);

			if (this.usesNormals)
				this.setupAndCountMethodDependencies(this._pMethodSetup._iNormalMethod, this._pMethodSetup._iNormalMethodVO);

			// todo: add spotlights to count check
			this._pDependencyCounter.setPositionedLights(this._pNumPointLights, this._combinedLightSources);

		}

		/**
		 * Counts the dependencies for a given method.
		 * @param method The method to count the dependencies for.
		 * @param methodVO The method's data for this material.
		 */
		private setupAndCountMethodDependencies(method:away.materials.ShadingMethodBase, methodVO:away.materials.MethodVO)
		{
			this.setupMethod(method, methodVO);
			this._pDependencyCounter.includeMethodVO(methodVO);
		}

		/**
		 * Assigns all prerequisite data for the methods, so we can calculate dependencies for them.
		 */
		private setupMethod(method:away.materials.ShadingMethodBase, methodVO:away.materials.MethodVO)
		{
			method.iReset();
			methodVO.reset();

			methodVO.vertexData = this._vertexConstantData;
			methodVO.fragmentData = this._fragmentConstantData;
			methodVO.useSmoothTextures = this._smooth;
			methodVO.repeatTextures = this._repeat;
			methodVO.useMipmapping = this._mipmap;
			methodVO.useLightFallOff = this._pEnableLightFallOff && this._pProfile != "baselineConstrained";
			methodVO.numLights = this._pNumLights + this._pNumLightProbes;

			method.iInitVO(methodVO);
		}

		/**
		 * The index for the common data register.
		 */
		public get commonsDataIndex():number
		{
			return this._commonsDataIndex;
		}

		/**
		 * Assigns the shared register data to all methods.
		 */
		private updateMethodRegisters()
		{
			this._pMethodSetup._iNormalMethod._sharedRegisters= this._pSharedRegisters;
            this._pMethodSetup._iDiffuseMethod._sharedRegisters = this._pSharedRegisters;

			if (this._pMethodSetup._iShadowMethod)
                this._pMethodSetup._iShadowMethod._sharedRegisters = this._pSharedRegisters;

            this._pMethodSetup._iAmbientMethod._sharedRegisters = this._pSharedRegisters;

			if (this._pMethodSetup._iSpecularMethod)
                this._pMethodSetup._iSpecularMethod._sharedRegisters = this._pSharedRegisters;

			if (this._pMethodSetup._iColorTransformMethod)
                this._pMethodSetup._iColorTransformMethod._sharedRegisters = this._pSharedRegisters;


            var methods : away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;//var methods:Vector.<MethodVOSet> = _pMethodSetup._methods;

			var len:number = methods.length;

			for (var i:number = 0; i < len; ++i)
            {

                methods[i].method.iSharedRegisters = this._pSharedRegisters;

            }


		}

		/**
		 * The amount of vertex constants used by the material. Any animation code to be added can append its vertex
		 * constant data after this.
		 */
		public get numUsedVertexConstants():number
		{
			return this._pRegisterCache.numUsedVertexConstants;
		}

		/**
		 * The amount of fragment constants used by the material. Any animation code to be added can append its vertex
		 * constant data after this.
		 */
		public get numUsedFragmentConstants():number
		{
			return this._pRegisterCache.numUsedFragmentConstants;
		}

		/**
		 * The amount of vertex attribute streams used by the material. Any animation code to be added can add its
		 * streams after this. Also used to automatically disable attribute slots on pass deactivation.
		 */
		public get numUsedStreams():number
		{
			return this._pRegisterCache.numUsedStreams;
		}

		/**
		 * The amount of textures used by the material. Used to automatically disable texture slots on pass deactivation.
		 */
		public get numUsedTextures():number
		{
			return this._pRegisterCache.numUsedTextures;
		}

		/**
		 * Number of used varyings. Any animation code to be added can add its used varyings after this.
		 */
		public get numUsedVaryings():number
		{
			return this._pRegisterCache.numUsedVaryings;
		}

		/**
		 * Indicates whether lights are used for specular reflections.
		 */
		public pUsesLightsForSpecular():boolean
		{
			return this._pNumLights > 0 && ( this._specularLightSources & away.materials.LightSources.LIGHTS) != 0;
		}

		/**
		 * Indicates whether lights are used for diffuse reflections.
		 */
		public pUsesLightsForDiffuse():boolean
		{
			return this._pNumLights > 0 && ( this._diffuseLightSources & away.materials.LightSources.LIGHTS) != 0;
		}

		/**
		 * Disposes all resources used by the compiler.
		 */
		public dispose()
		{
			this.cleanUpMethods();
			this._pRegisterCache.dispose();
			this._pRegisterCache = null;
			this._pSharedRegisters = null;
		}

		/**
		 * Clean up method's compilation data after compilation finished.
		 */
		private cleanUpMethods()
		{
			if (this._pMethodSetup._iNormalMethod)
                this._pMethodSetup._iNormalMethod.iCleanCompilationData();

			if (this._pMethodSetup._iDiffuseMethod)
                this._pMethodSetup._iDiffuseMethod.iCleanCompilationData();

			if (this._pMethodSetup._iAmbientMethod)
                this._pMethodSetup._iAmbientMethod.iCleanCompilationData();

			if (this._pMethodSetup._iSpecularMethod)
                this._pMethodSetup._iSpecularMethod.iCleanCompilationData();

			if (this._pMethodSetup._iShadowMethod)
                this._pMethodSetup._iShadowMethod.iCleanCompilationData();

			if (this._pMethodSetup._iColorTransformMethod)
                this._pMethodSetup._iColorTransformMethod.iCleanCompilationData();

            var methods:away.materials.MethodVOSet[]= this._pMethodSetup._iMethods;//var methods:Vector.<MethodVOSet> = _pMethodSetup._methods;

			var len:number = methods.length;

			for (var i:number = 0; i < len; ++i)
            {

                methods[i].method.iCleanCompilationData();

            }

		}

		/**
		 * Define which light source types to use for specular reflections. This allows choosing between regular lights
		 * and/or light probes for specular reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get specularLightSources():number
		{
			return this._specularLightSources;
		}

		public set specularLightSources(value:number)
		{
            this._specularLightSources = value;
		}

		/**
		 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
		 * and/or light probes for diffuse reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get diffuseLightSources():number
		{
			return this._diffuseLightSources;
		}

		public set diffuseLightSources(value:number)
		{
			this._diffuseLightSources = value;
		}

		/**
		 * Indicates whether light probes are being used for specular reflections.
		 */
		public pUsesProbesForSpecular():boolean
		{
			return this._pNumLightProbes > 0 && (this._specularLightSources & away.materials.LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether light probes are being used for diffuse reflections.
		 */
		public pUsesProbesForDiffuse():boolean
		{
			return this._pNumLightProbes > 0 && (this._diffuseLightSources & away.materials.LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether any light probes are used.
		 */
		public pUsesProbes():boolean
		{
			return this._pNumLightProbes > 0 && ((this._diffuseLightSources | this._specularLightSources) & away.materials.LightSources.PROBES) != 0;
		}

		/**
		 * The index for the UV vertex attribute stream.
		 */
		public get uvBufferIndex():number
		{
			return this._uvBufferIndex;
		}

		/**
		 * The index for the UV transformation matrix vertex constant.
		 */
		public get uvTransformIndex():number
		{
			return this._uvTransformIndex;
		}

		/**
		 * The index for the secondary UV vertex attribute stream.
		 */
		public get secondaryUVBufferIndex():number
		{
			return this._secondaryUVBufferIndex;
		}

		/**
		 * The index for the vertex normal attribute stream.
		 */
		public get normalBufferIndex():number
		{
			return this._pNormalBufferIndex;
		}

		/**
		 * The index for the vertex tangent attribute stream.
		 */
		public get tangentBufferIndex():number
		{
			return this._pTangentBufferIndex;
		}

		/**
		 * The first index for the fragment constants containing the light data.
		 */
		public get lightFragmentConstantIndex():number
		{
			return this._pLightFragmentConstantIndex;
		}

		/**
		 * The index of the vertex constant containing the camera position.
		 */
		public get cameraPositionIndex():number
		{
			return this._pCameraPositionIndex;
		}

		/**
		 * The index of the vertex constant containing the scene matrix.
		 */
		public get sceneMatrixIndex():number
		{
			return this._sceneMatrixIndex;
		}

		/**
		 * The index of the vertex constant containing the uniform scene matrix (the inverse transpose).
		 */
		public get sceneNormalMatrixIndex():number
		{
			return this._pSceneNormalMatrixIndex;
		}

		/**
		 * The index of the fragment constant containing the weights for the light probes.
		 */
		public get probeWeightsIndex():number
		{
			return this._pProbeWeightsIndex;
		}

		/**
		 * The generated vertex code.
		 */
		public get vertexCode():string
		{
			return this._pVertexCode;
		}

		/**
		 * The generated fragment code.
		 */
		public get fragmentCode():string
		{
			return this._pFragmentCode;
		}

		/**
		 * The code containing the lighting calculations.
		 */
		public get fragmentLightCode():string
		{
			return this._fragmentLightCode;
		}

		/**
		 * The code containing the post-lighting calculations.
		 */
		public get fragmentPostLightCode():string
		{
			return this._fragmentPostLightCode;
		}

		/**
		 * The register name containing the final shaded colour.
		 */
		public get shadedTarget():string
		{
			return this._pSharedRegisters.shadedTarget.toString();
		}

		/**
		 * The amount of point lights that need to be supported.
		 */
		public get numPointLights():number
		{
			return this._pNumPointLights;
		}

		public set numPointLights(numPointLights:number)
		{
            this._pNumPointLights = numPointLights;
		}

		/**
		 * The amount of directional lights that need to be supported.
		 */
		public get numDirectionalLights():number
		{
			return this._pNumDirectionalLights;
		}

		public set numDirectionalLights(value:number)
		{
            this._pNumDirectionalLights = value;
		}

		/**
		 * The amount of light probes that need to be supported.
		 */
		public get numLightProbes():number
		{
			return this._pNumLightProbes;
		}

		public set numLightProbes(value:number)
		{
            this._pNumLightProbes = value;
		}

		/**
		 * Indicates whether the specular method is used.
		 */
		public get usingSpecularMethod():boolean
		{
			return this._usingSpecularMethod;
		}

		/**
		 * The attributes that need to be animated by animators.
		 */
		public get animatableAttributes():string[]
		{
			return this._pAnimatableAttributes;
		}

		/**
		 * The target registers for animated properties, written to by the animators.
		 */
		public get animationTargetRegisters():string[]
		{
			return this._pAnimationTargetRegisters;
		}

		/**
		 * Indicates whether the compiled shader uses normals.
		 */
		public get usesNormals():boolean
		{
			return this._pDependencyCounter.normalDependencies > 0 && this._pMethodSetup._iNormalMethod.iHasOutput;
		}

		/**
		 * Indicates whether the compiled shader uses lights.
		 */
		public pUsesLights():boolean
		{
			return this._pNumLights > 0 && (this._combinedLightSources & away.materials.LightSources.LIGHTS) != 0;
		}

		/**
		 * Compiles the code for the methods.
		 */
		public pCompileMethods()
		{
            var methods:away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;//var methods:Vector.<MethodVOSet> = this._pMethodSetup._iMethods;

			var numMethods:number = methods.length;
			var method:EffectMethodBase;
			var data:MethodVO;
			var alphaReg:ShaderRegisterElement;

            // TODO: AGAL <> GLSL

			if (this._preserveAlpha)
            {
				alphaReg = this._pRegisterCache.getFreeFragmentSingleTemp();
                this._pRegisterCache.addFragmentTempUsages(alphaReg, 1);
                this._pFragmentCode += "mov " + alphaReg.toString() + ", " + this._pSharedRegisters.shadedTarget.toString() + ".w\n";
			}

			for (var i:number = 0; i < numMethods; ++i)
            {

				method = methods[i].method;
				data = methods[i].data;

				this._pVertexCode += method.iGetVertexCode( data, this._pRegisterCache);

				if (data.needsGlobalVertexPos || data.needsGlobalFragmentPos)
                    this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.globalPositionVertex);

                this._pFragmentCode += method.iGetFragmentCode(data, this._pRegisterCache, this._pSharedRegisters.shadedTarget);

				if (data.needsNormals)
					this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.normalFragment);

				if (data.needsView)
                    this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.viewDirFragment);
			}

			if (this._preserveAlpha)
            {

                this._pFragmentCode += "mov " + this._pSharedRegisters.shadedTarget.toString() + ".w, " + alphaReg.toString() + "\n";

                this._pRegisterCache.removeFragmentTempUsage(alphaReg);

			}

			if (this._pMethodSetup._iColorTransformMethod)
            {

                this._pVertexCode += this._pMethodSetup._iColorTransformMethod.iGetVertexCode(this._pMethodSetup._iColorTransformMethodVO, this._pRegisterCache);
                this._pFragmentCode += this._pMethodSetup._iColorTransformMethod.iGetFragmentCode(this._pMethodSetup._iColorTransformMethodVO, this._pRegisterCache, this._pSharedRegisters.shadedTarget);

			}
		}

		/**
		 * Indices for the light probe diffuse textures.
		 */
		public get lightProbeDiffuseIndices():number[] /*uint*/
		{
			return this._pLightProbeDiffuseIndices;
		}

		/**
		 * Indices for the light probe specular textures.
		 */
		public get lightProbeSpecularIndices():number[] /*uint*/
		{
			return this._pLightProbeSpecularIndices;
		}
	}
}
