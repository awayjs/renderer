///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.arcane;
	//import away3d.materials.LightSources;
	//import away3d.materials.methods.EffectMethodBase;
	//import away3d.materials.methods.MethodVO;
	//import away3d.materials.methods.MethodVOSet;
	//import away3d.materials.methods.ShaderMethodSetup;
	//import away3d.materials.methods.ShadingMethodBase;

	/**
	 * ShaderCompiler is an abstract base class for shader compilers that use modular shader methods to assemble a
	 * material. Concrete subclasses are used by the default materials.
	 *
	 * @see away3d.materials.methods.ShadingMethodBase
	 */
	export class ShaderCompiler
	{
        public _sharedRegisters:away.materials.ShaderRegisterData;// PROTECTED
        public _registerCache:away.materials.ShaderRegisterCache;// PROTECTED
		public _dependencyCounter:away.materials.MethodDependencyCounter; // PROTECTED
        public _methodSetup:away.materials.ShaderMethodSetup;// PROTECTED

		private _smooth:boolean;
		private _repeat:boolean;
		private _mipmap:boolean;
		private _enableLightFallOff:boolean;
		private _preserveAlpha:boolean = true;
		private _animateUVs:boolean;
		public _alphaPremultiplied:boolean; // PROTECTED
		private _vertexConstantData:number[];
		private _fragmentConstantData:number[];

		public _vertexCode:string;
        public _fragmentCode:string;
		private _fragmentLightCode:string;
		private _fragmentPostLightCode:string;
		private _commonsDataIndex:number = -1;

		public _animatableAttributes:string[]; // PROTECTED
		public _animationTargetRegisters:string[]; // PROTECTED

		public _lightProbeDiffuseIndices:number[] /*uint*/;
        public _lightProbeSpecularIndices:number[] /*uint*/;
		private _uvBufferIndex:number = -1;
		private _uvTransformIndex:number = -1;
		private _secondaryUVBufferIndex:number = -1;
		public  _normalBufferIndex:number = -1; // PROTECTED
		public _tangentBufferIndex:number = -1; // PROTECTED
		public _lightFragmentConstantIndex:number = -1; //PROTECTED
		private _sceneMatrixIndex:number = -1;
		public _sceneNormalMatrixIndex:number = -1; //PROTECTED
		public _cameraPositionIndex:number = -1; // PROTECTED
		public _probeWeightsIndex:number = -1; // PROTECTED

		private _specularLightSources:number;
		private _diffuseLightSources:number;

		public _numLights:number;  // PROTECTED
		public _numLightProbes:number; // PROTECTED
		public _numPointLights:number; // PROTECTED
		public _numDirectionalLights:number; // PROTECTED

		public _numProbeRegisters:number; // PROTECTED
		private _combinedLightSources:number;

		public _usingSpecularMethod:boolean;

		private _needUVAnimation:boolean;
		private _UVTarget:string;
		private _UVSource:string;

		private _profile:string;

		private _forceSeperateMVP:boolean;

		/**
		 * Creates a new ShaderCompiler object.
		 * @param profile The compatibility profile of the renderer.
		 */
		constructor(profile:string)
		{
			this._sharedRegisters = new away.materials.ShaderRegisterData();
            this._dependencyCounter = new away.materials.MethodDependencyCounter();
            this._profile = profile;
            this.initRegisterCache(profile);
		}

		/**
		 * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
		 * compatibility for constrained mode.
		 */
		public get enableLightFallOff():boolean
		{
			return this._enableLightFallOff;
		}

		public set enableLightFallOff(value:boolean)
		{
            this._enableLightFallOff = value;
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
            this._registerCache = new away.materials.ShaderRegisterCache(profile);
            this._registerCache.vertexAttributesOffset = 1;
            this._registerCache.reset();
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
			return this._alphaPremultiplied;
		}

		public set alphaPremultiplied(value:boolean)
		{
            this._alphaPremultiplied = value;
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
			return this._methodSetup;
		}

		public set methodSetup(value:away.materials.ShaderMethodSetup)
		{
            this._methodSetup = value;
		}

		/**
		 * Compiles the code after all setup on the compiler has finished.
		 */
		public compile()
		{
			this.pInitRegisterIndices();
			this.pInitLightData();

			this._animatableAttributes = new Array<string>( "va0" );//Vector.<String>(["va0"]);
            this._animationTargetRegisters = new Array<string>( "vt0" );//Vector.<String>(["vt0"]);
            this._vertexCode = "";
            this._fragmentCode = "";

            this._sharedRegisters.localPosition = this._registerCache.getFreeVertexVectorTemp();
            this._registerCache.addVertexTempUsages( this._sharedRegisters.localPosition, 1);

            this.createCommons();
            this.pCalculateDependencies();
            this.updateMethodRegisters();

			for (var i:number = 0; i < 4; ++i)
                this._registerCache.getFreeVertexConstant();

            this.pCreateNormalRegisters();

			if (this._dependencyCounter.globalPosDependencies > 0 || this._forceSeperateMVP)
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
			if (this._dependencyCounter.uvDependencies > 0)
                this.compileUVCode();

			if (this._dependencyCounter.secondaryUVDependencies > 0)
                this.compileSecondaryUVCode();

			if (this._dependencyCounter.normalDependencies > 0)
                this.pCompileNormalCode();

			if (this._dependencyCounter.viewDirDependencies > 0)
                this.pCompileViewDirCode();

            this.pCompileLightingCode();
            this._fragmentLightCode = this._fragmentCode;
            this._fragmentCode = "";
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
			var uvAttributeReg:ShaderRegisterElement = this._registerCache.getFreeVertexAttribute();
			this._uvBufferIndex = uvAttributeReg.index;

			var varying:ShaderRegisterElement = this._registerCache.getFreeVarying();

			this._sharedRegisters.uvVarying = varying;

			if (this.animateUVs)
            {

				// a, b, 0, tx
				// c, d, 0, ty
				var uvTransform1:ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
				var uvTransform2:ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
                this._uvTransformIndex = uvTransform1.index*4;

                // TODO: AGAL <> GLSL

                this._vertexCode += "dp4 " + varying + ".x, " + uvAttributeReg + ", " + uvTransform1 + "\n" +
					"dp4 " + varying + ".y, " + uvAttributeReg + ", " + uvTransform2 + "\n" +
					"mov " + varying + ".zw, " + uvAttributeReg + ".zw \n";

			} else {
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

			var uvAttributeReg:ShaderRegisterElement = this._registerCache.getFreeVertexAttribute();
            this._secondaryUVBufferIndex = uvAttributeReg.index;
            this._sharedRegisters.secondaryUVVarying = this._registerCache.getFreeVarying();
            this._vertexCode += "mov " + this._sharedRegisters.secondaryUVVarying + ", " + uvAttributeReg + "\n";
		}

		/**
		 * Compile the world-space position.
		 */
		public pCompileGlobalPositionCode()
		{

            // TODO: AGAL <> GLSL

			this._sharedRegisters.globalPositionVertex = this._registerCache.getFreeVertexVectorTemp();
            this._registerCache.addVertexTempUsages(this._sharedRegisters.globalPositionVertex, this._dependencyCounter.globalPosDependencies);
			var positionMatrixReg:ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
            this._registerCache.getFreeVertexConstant();
            this._registerCache.getFreeVertexConstant();
            this._registerCache.getFreeVertexConstant();
            this._sceneMatrixIndex = positionMatrixReg.index*4;

            this._vertexCode += "m44 " + this._sharedRegisters.globalPositionVertex + ", " + this._sharedRegisters.localPosition + ", " + positionMatrixReg + "\n";

			if (this._dependencyCounter.usesGlobalPosFragment)
            {

                this._sharedRegisters.globalPositionVarying = this._registerCache.getFreeVarying();
                this._vertexCode += "mov " + this._sharedRegisters.globalPositionVarying + ", " + this._sharedRegisters.globalPositionVertex + "\n";

			}
		}

		/**
		 * Get the projection coordinates.
		 */
		private compileProjectionCode()
		{
			var pos:string = this._dependencyCounter.globalPosDependencies > 0 || this._forceSeperateMVP? this._sharedRegisters.globalPositionVertex.toString() : this._animationTargetRegisters[0];
			var code:string;

            // TODO: AGAL <> GLSL

			if (this._dependencyCounter.projectionDependencies > 0)
            {

                this._sharedRegisters.projectionFragment = this._registerCache.getFreeVarying();

				code = "m44 vt5, " + pos + ", vc0		\n" +
					"mov " + this._sharedRegisters.projectionFragment + ", vt5\n" +
					"mov op, vt5\n";
			}
            else
            {

                code = "m44 op, " + pos + ", vc0		\n";

            }


            this._vertexCode += code;

		}

		/**
		 * Assign the final output colour the the output register.
		 */
		private compileFragmentOutput()
		{
            // TODO: AGAL <> GLSL

			this._fragmentCode += "mov " + this._registerCache.fragmentOutputRegister + ", " + this._sharedRegisters.shadedTarget + "\n";
            this._registerCache.removeFragmentTempUsage(this._sharedRegisters.shadedTarget);
		}

		/**
		 * Reset all the indices to "unused".
		 */
		public pInitRegisterIndices()
		{
			this._commonsDataIndex = -1;
            this._cameraPositionIndex = -1;
            this._uvBufferIndex = -1;
            this._uvTransformIndex = -1;
            this._secondaryUVBufferIndex = -1;
            this._normalBufferIndex = -1;
            this._tangentBufferIndex = -1;
            this._lightFragmentConstantIndex = -1;
            this._sceneMatrixIndex = -1;
            this._sceneNormalMatrixIndex = -1;
            this._probeWeightsIndex = -1;

		}

		/**
		 * Prepares the setup for the light code.
		 */
		public pInitLightData()
		{
            this._numLights = this._numPointLights + this._numDirectionalLights;
            this._numProbeRegisters = Math.ceil(this._numLightProbes/4);


			if (this._methodSetup._iSpecularMethod)
            {

                this._combinedLightSources = this._specularLightSources | this._diffuseLightSources;

            }
			else
            {

                this._combinedLightSources = this._diffuseLightSources;

            }

            this._usingSpecularMethod = Boolean(this._methodSetup._iSpecularMethod && (
                this.pUsesLightsForSpecular() ||
                this.pUsesProbesForSpecular()));

		}

		/**
		 * Create the commonly shared constant register.
		 */
		private createCommons()
		{
			this._sharedRegisters.commons = this._registerCache.getFreeFragmentConstant();
            this._commonsDataIndex = this._sharedRegisters.commons.index*4;
		}

		/**
		 * Figure out which named registers are required, and how often.
		 */
		public pCalculateDependencies()
		{
            this._dependencyCounter.reset();



			var methods:away.materials.MethodVOSet[] = this._methodSetup._iMethods;//Vector.<MethodVOSet>
			var len:number;

			this.setupAndCountMethodDependencies(this._methodSetup._iDiffuseMethod, this._methodSetup._iDiffuseMethodVO);


			if (this._methodSetup._iShadowMethod)
				this.setupAndCountMethodDependencies(this._methodSetup._iShadowMethod, this._methodSetup._iShadowMethodVO);


			this.setupAndCountMethodDependencies(this._methodSetup._iAmbientMethod, this._methodSetup._iAmbientMethodVO);

			if (this._usingSpecularMethod)
				this.setupAndCountMethodDependencies(this._methodSetup._iSpecularMethod, this._methodSetup._iSpecularMethodVO);

			if (this._methodSetup._iColorTransformMethod)
				this.setupAndCountMethodDependencies(this._methodSetup._iColorTransformMethod, this._methodSetup._iColorTransformMethodVO);

			len = methods.length;

			for (var i:number = 0; i < len; ++i)
				this.setupAndCountMethodDependencies(methods[i].method, methods[i].data);

			if (this.usesNormals)
				this.setupAndCountMethodDependencies(this._methodSetup._iNormalMethod, this._methodSetup._iNormalMethodVO);

			// todo: add spotlights to count check
			this._dependencyCounter.setPositionedLights(this._numPointLights, this._combinedLightSources);

		}

		/**
		 * Counts the dependencies for a given method.
		 * @param method The method to count the dependencies for.
		 * @param methodVO The method's data for this material.
		 */
		private setupAndCountMethodDependencies(method:away.materials.ShadingMethodBase, methodVO:away.materials.MethodVO)
		{
			this.setupMethod(method, methodVO);
			this._dependencyCounter.includeMethodVO(methodVO);
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
			methodVO.useLightFallOff = this._enableLightFallOff && this._profile != "baselineConstrained";
			methodVO.numLights = this._numLights + this._numLightProbes;

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
			this._methodSetup._iNormalMethod._sharedRegisters = this._sharedRegisters;
            this._methodSetup._iDiffuseMethod._sharedRegisters = this._sharedRegisters;

			if (this._methodSetup._iShadowMethod)
                this._methodSetup._iShadowMethod._sharedRegisters = this._sharedRegisters;

            this._methodSetup._iAmbientMethod._sharedRegisters = this._sharedRegisters;

			if (this._methodSetup._iSpecularMethod)
                this._methodSetup._iSpecularMethod._sharedRegisters = this._sharedRegisters;

			if (this._methodSetup._iColorTransformMethod)
                this._methodSetup._iColorTransformMethod._sharedRegisters = this._sharedRegisters;


            var methods : away.materials.MethodVOSet[] = this._methodSetup._iMethods;//var methods:Vector.<MethodVOSet> = _methodSetup._methods;

			var len:number = methods.length;

			for (var i:number = 0; i < len; ++i)
            {

                methods[i].method.iSharedRegisters = this._sharedRegisters;

            }


		}

		/**
		 * The amount of vertex constants used by the material. Any animation code to be added can append its vertex
		 * constant data after this.
		 */
		public get numUsedVertexConstants():number
		{
			return this._registerCache.numUsedVertexConstants;
		}

		/**
		 * The amount of fragment constants used by the material. Any animation code to be added can append its vertex
		 * constant data after this.
		 */
		public get numUsedFragmentConstants():number
		{
			return this._registerCache.numUsedFragmentConstants;
		}

		/**
		 * The amount of vertex attribute streams used by the material. Any animation code to be added can add its
		 * streams after this. Also used to automatically disable attribute slots on pass deactivation.
		 */
		public get numUsedStreams():number
		{
			return this._registerCache.numUsedStreams;
		}

		/**
		 * The amount of textures used by the material. Used to automatically disable texture slots on pass deactivation.
		 */
		public get numUsedTextures():number
		{
			return this._registerCache.numUsedTextures;
		}

		/**
		 * Number of used varyings. Any animation code to be added can add its used varyings after this.
		 */
		public get numUsedVaryings():number
		{
			return this._registerCache.numUsedVaryings;
		}

		/**
		 * Indicates whether lights are used for specular reflections.
		 */
		public pUsesLightsForSpecular():boolean
		{
			return this._numLights > 0 && ( this._specularLightSources & away.materials.LightSources.LIGHTS) != 0;
		}

		/**
		 * Indicates whether lights are used for diffuse reflections.
		 */
		public pUsesLightsForDiffuse():boolean
		{
			return this._numLights > 0 && ( this._diffuseLightSources & away.materials.LightSources.LIGHTS) != 0;
		}

		/**
		 * Disposes all resources used by the compiler.
		 */
		public dispose()
		{
			this.cleanUpMethods();
			this._registerCache.dispose();
			this._registerCache = null;
			this._sharedRegisters = null;
		}

		/**
		 * Clean up method's compilation data after compilation finished.
		 */
		private cleanUpMethods()
		{
			if (this._methodSetup._iNormalMethod)
                this._methodSetup._iNormalMethod.iCleanCompilationData();

			if (this._methodSetup._iDiffuseMethod)
                this._methodSetup._iDiffuseMethod.iCleanCompilationData();

			if (this._methodSetup._iAmbientMethod)
                this._methodSetup._iAmbientMethod.iCleanCompilationData();

			if (this._methodSetup._iSpecularMethod)
                this._methodSetup._iSpecularMethod.iCleanCompilationData();

			if (this._methodSetup._iShadowMethod)
                this._methodSetup._iShadowMethod.iCleanCompilationData();

			if (this._methodSetup._iColorTransformMethod)
                this._methodSetup._iColorTransformMethod.iCleanCompilationData();

            var methods:away.materials.MethodVOSet[]= this._methodSetup._iMethods;//var methods:Vector.<MethodVOSet> = _methodSetup._methods;

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
			return this._numLightProbes > 0 && (this._specularLightSources & away.materials.LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether light probes are being used for diffuse reflections.
		 */
		public pUsesProbesForDiffuse():boolean
		{
			return this._numLightProbes > 0 && (this._diffuseLightSources & away.materials.LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether any light probes are used.
		 */
		public pUsesProbes():boolean
		{
			return this._numLightProbes > 0 && ((this._diffuseLightSources | this._specularLightSources) & away.materials.LightSources.PROBES) != 0;
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
			return this._normalBufferIndex;
		}

		/**
		 * The index for the vertex tangent attribute stream.
		 */
		public get tangentBufferIndex():number
		{
			return this._tangentBufferIndex;
		}

		/**
		 * The first index for the fragment constants containing the light data.
		 */
		public get lightFragmentConstantIndex():number
		{
			return this._lightFragmentConstantIndex;
		}

		/**
		 * The index of the vertex constant containing the camera position.
		 */
		public get cameraPositionIndex():number
		{
			return this._cameraPositionIndex;
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
			return this._sceneNormalMatrixIndex;
		}

		/**
		 * The index of the fragment constant containing the weights for the light probes.
		 */
		public get probeWeightsIndex():number
		{
			return this._probeWeightsIndex;
		}

		/**
		 * The generated vertex code.
		 */
		public get vertexCode():string
		{
			return this._vertexCode;
		}

		/**
		 * The generated fragment code.
		 */
		public get fragmentCode():string
		{
			return this._fragmentCode;
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
			return this._sharedRegisters.shadedTarget.toString();
		}

		/**
		 * The amount of point lights that need to be supported.
		 */
		public get numPointLights():number
		{
			return this._numPointLights;
		}

		public set numPointLights(numPointLights:number)
		{
            this._numPointLights = numPointLights;
		}

		/**
		 * The amount of directional lights that need to be supported.
		 */
		public get numDirectionalLights():number
		{
			return this._numDirectionalLights;
		}

		public set numDirectionalLights(value:number)
		{
            this._numDirectionalLights = value;
		}

		/**
		 * The amount of light probes that need to be supported.
		 */
		public get numLightProbes():number
		{
			return this._numLightProbes;
		}

		public set numLightProbes(value:number)
		{
            this._numLightProbes = value;
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
			return this._animatableAttributes;
		}

		/**
		 * The target registers for animated properties, written to by the animators.
		 */
		public get animationTargetRegisters():string[]
		{
			return this._animationTargetRegisters;
		}

		/**
		 * Indicates whether the compiled shader uses normals.
		 */
		public get usesNormals():boolean
		{
			return this._dependencyCounter.normalDependencies > 0 && this._methodSetup._iNormalMethod.iHasOutput;
		}

		/**
		 * Indicates whether the compiled shader uses lights.
		 */
		public pUsesLights():boolean
		{
			return this._numLights > 0 && (this._combinedLightSources & away.materials.LightSources.LIGHTS) != 0;
		}

		/**
		 * Compiles the code for the methods.
		 */
		public pCompileMethods()
		{
            var methods:away.materials.MethodVOSet[] = this._methodSetup._iMethods;//var methods:Vector.<MethodVOSet> = this._methodSetup._iMethods;

			var numMethods:number = methods.length;
			var method:EffectMethodBase;
			var data:MethodVO;
			var alphaReg:ShaderRegisterElement;

            // TODO: AGAL <> GLSL

			if (this._preserveAlpha)
            {
				alphaReg = this._registerCache.getFreeFragmentSingleTemp();
                this._registerCache.addFragmentTempUsages(alphaReg, 1);
                this._fragmentCode += "mov " + alphaReg + ", " + this._sharedRegisters.shadedTarget + ".w\n";
			}

			for (var i:number = 0; i < numMethods; ++i)
            {

				method = methods[i].method;
				data = methods[i].data;

				this._vertexCode += method.iGetVertexCode( data, this._registerCache);

				if (data.needsGlobalVertexPos || data.needsGlobalFragmentPos)
                    this._registerCache.removeVertexTempUsage(this._sharedRegisters.globalPositionVertex);

                this._fragmentCode += method.iGetFragmentCode(data, this._registerCache, this._sharedRegisters.shadedTarget);

				if (data.needsNormals)
					this._registerCache.removeFragmentTempUsage(this._sharedRegisters.normalFragment);

				if (data.needsView)
                    this._registerCache.removeFragmentTempUsage(this._sharedRegisters.viewDirFragment);
			}

			if (this._preserveAlpha)
            {

                this._fragmentCode += "mov " + this._sharedRegisters.shadedTarget + ".w, " + alphaReg + "\n";

                this._registerCache.removeFragmentTempUsage(alphaReg);

			}

			if (this._methodSetup._iColorTransformMethod)
            {

                this._vertexCode += this._methodSetup._iColorTransformMethod.iGetVertexCode(this._methodSetup._iColorTransformMethodVO, this._registerCache);
                this._fragmentCode += this._methodSetup._iColorTransformMethod.iGetFragmentCode(this._methodSetup._iColorTransformMethodVO, this._registerCache, this._sharedRegisters.shadedTarget);

			}
		}

		/**
		 * Indices for the light probe diffuse textures.
		 */
		public get lightProbeDiffuseIndices():number[] /*uint*/
		{
			return this._lightProbeDiffuseIndices;
		}

		/**
		 * Indices for the light probe specular textures.
		 */
		public get lightProbeSpecularIndices():number[] /*uint*/
		{
			return this._lightProbeSpecularIndices;
		}
	}
}
