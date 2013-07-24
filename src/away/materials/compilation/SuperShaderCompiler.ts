///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import away3d.arcane;

	/**
	 * SuperShaderCompiler is a compiler that generates shaders that perform both lighting and "effects" through methods.
	 * This is used by the single-pass materials.
	 */
	export class SuperShaderCompiler extends away.materials.ShaderCompiler
	{
		public _pointLightRegisters:away.materials.ShaderRegisterElement[];//Vector.<ShaderRegisterElement>;
		public _dirLightRegisters:away.materials.ShaderRegisterElement[];//Vector.<ShaderRegisterElement>;

		/**
		 * Creates a new SuperShaderCompiler object.
		 * @param profile The compatibility profile used by the renderer.
		 */
		constructor(profile:string)
		{
			super(profile);
		}

		/**
		 * @inheritDoc
		 */
		public pInitLightData()
		{
			super.pInitLightData();
			
			this._pointLightRegisters = new Array<away.materials.ShaderRegisterElement>(this._numPointLights*3);//Vector.<ShaderRegisterElement>(_numPointLights*3, true);
            this._dirLightRegisters = new Array<away.materials.ShaderRegisterElement>(this._numDirectionalLights*3);//Vector.<ShaderRegisterElement>(_numDirectionalLights*3, true);


		}

		/**
		 * @inheritDoc
		 */
		public pCalculateDependencies()
		{

			super.pCalculateDependencies();
			this._dependencyCounter.addWorldSpaceDependencies(true);

		}

		/**
		 * @inheritDoc
		 */
		public pCompileNormalCode()
		{
			var normalMatrix:away.materials.ShaderRegisterElement[] = new Array<away.materials.ShaderRegisterElement>(3);//Vector.<ShaderRegisterElement> = new Vector.<ShaderRegisterElement>(3, true);
			
			this._sharedRegisters.normalFragment = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(this._sharedRegisters.normalFragment, this._dependencyCounter.normalDependencies);

			if (this._methodSetup._iNormalMethod.iHasOutput && !this._methodSetup._iNormalMethod.iTangentSpace)
            {

                this._vertexCode += this._methodSetup._iNormalMethod.iGetVertexCode(this._methodSetup._iNormalMethodVO, this._registerCache);
                this._fragmentCode += this._methodSetup._iNormalMethod.iGetFragmentCode(this._methodSetup._iNormalMethodVO, this._registerCache, this._sharedRegisters.normalFragment);

				return;

			}
			
			this._sharedRegisters.normalVarying = this._registerCache.getFreeVarying();
			
			normalMatrix[0] = this._registerCache.getFreeVertexConstant();
			normalMatrix[1] = this._registerCache.getFreeVertexConstant();
			normalMatrix[2] = this._registerCache.getFreeVertexConstant();

			this._registerCache.getFreeVertexConstant();
			this._sceneNormalMatrixIndex = normalMatrix[0].index*4;
			
			if (this._methodSetup._iNormalMethod.iHasOutput)
            {

				// tangent stream required
				this.compileTangentVertexCode(normalMatrix);
                this.compileTangentNormalMapFragmentCode();

			}
            else
            {
                // TODO: AGAL <> GLSL

                /*
				this._vertexCode += "m33 " + this._sharedRegisters.normalVarying + ".xyz, " + this._sharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" +
					"mov " + this._sharedRegisters.normalVarying + ".w, " + this._sharedRegisters.animatedNormal + ".w	\n";

                this._fragmentCode += "nrm " + this._sharedRegisters.normalFragment + ".xyz, " + this._sharedRegisters.normalVarying + "\n" +
					"mov " + this._sharedRegisters.normalFragment + ".w, " + this._sharedRegisters.normalVarying + ".w		\n";
				
				if (this._dependencyCounter.tangentDependencies > 0) {
                    this._sharedRegisters.tangentInput = this._registerCache.getFreeVertexAttribute();
                    this._tangentBufferIndex = this._sharedRegisters.tangentInput.index;
                    this._sharedRegisters.tangentVarying = this._registerCache.getFreeVarying();
                    this._vertexCode += "mov " + this._sharedRegisters.tangentVarying + ", " + this._sharedRegisters.tangentInput + "\n";
				}
				*/
			}
			
			this._registerCache.removeVertexTempUsage(this._sharedRegisters.animatedNormal);
		}

		/**
		 * @inheritDoc
		 */
		public pCreateNormalRegisters()
		{
			if (this._dependencyCounter.normalDependencies > 0)
            {

                this._sharedRegisters.normalInput = this._registerCache.getFreeVertexAttribute();
                this._normalBufferIndex = this._sharedRegisters.normalInput.index;
                this._sharedRegisters.animatedNormal = this._registerCache.getFreeVertexVectorTemp();
                this._registerCache.addVertexTempUsages(this._sharedRegisters.animatedNormal, 1);
                this._animatableAttributes.push(this._sharedRegisters.normalInput.toString());
                this._animationTargetRegisters.push(this._sharedRegisters.animatedNormal.toString());

			}
			
			if (this._methodSetup._iNormalMethod.iHasOutput)
            {

                this._sharedRegisters.tangentInput = this._registerCache.getFreeVertexAttribute();
                this._tangentBufferIndex = this._sharedRegisters.tangentInput.index;

                this._sharedRegisters.animatedTangent = this._registerCache.getFreeVertexVectorTemp();
                this._registerCache.addVertexTempUsages(this._sharedRegisters.animatedTangent, 1);

                this._animatableAttributes.push(this._sharedRegisters.tangentInput.toString());
                this._animationTargetRegisters.push(this._sharedRegisters.animatedTangent.toString());

			}
		}

		/**
		 * Compiles the vertex shader code for tangent-space normal maps.
		 * @param matrix The register containing the scene transformation matrix for normals.
		 */
		private compileTangentVertexCode(matrix:away.materials.ShaderRegisterElement[])//Vector.<ShaderRegisterElement>)
		{
			this._sharedRegisters.tangentVarying = this._registerCache.getFreeVarying();
            this._sharedRegisters.bitangentVarying = this._registerCache.getFreeVarying();

            //TODO: AGAL <> GLSL
            /*
			this._vertexCode += "m33 " + this._sharedRegisters.animatedNormal + ".xyz, " + this._sharedRegisters.animatedNormal + ", " + matrix[0] + "\n" +
				"nrm " + this._sharedRegisters.animatedNormal + ".xyz, " + this._sharedRegisters.animatedNormal + "\n";
			
			this._vertexCode += "m33 " + this._sharedRegisters.animatedTangent + ".xyz, " + this._sharedRegisters.animatedTangent + ", " + matrix[0] + "\n" +
				"nrm " + this._sharedRegisters.animatedTangent + ".xyz, " + this._sharedRegisters.animatedTangent + "\n";
			
			var bitanTemp:away.materials.ShaderRegisterElement = this._registerCache.getFreeVertexVectorTemp();
			this._vertexCode += "mov " + this._sharedRegisters.tangentVarying + ".x, " + this._sharedRegisters.animatedTangent + ".x  \n" +
				"mov " + this._sharedRegisters.tangentVarying + ".z, " + this._sharedRegisters.animatedNormal + ".x  \n" +
				"mov " + this._sharedRegisters.tangentVarying + ".w, " + this._sharedRegisters.normalInput + ".w  \n" +
				"mov " + this._sharedRegisters.bitangentVarying + ".x, " + this._sharedRegisters.animatedTangent + ".y  \n" +
				"mov " + this._sharedRegisters.bitangentVarying + ".z, " + this._sharedRegisters.animatedNormal + ".y  \n" +
				"mov " + this._sharedRegisters.bitangentVarying + ".w, " + this._sharedRegisters.normalInput + ".w  \n" +
				"mov " + this._sharedRegisters.normalVarying + ".x, " + this._sharedRegisters.animatedTangent + ".z  \n" +
				"mov " + this._sharedRegisters.normalVarying + ".z, " + this._sharedRegisters.animatedNormal + ".z  \n" +
				"mov " + this._sharedRegisters.normalVarying + ".w, " + this._sharedRegisters.normalInput + ".w  \n" +
				"crs " + bitanTemp + ".xyz, " + this._sharedRegisters.animatedNormal + ", " + this._sharedRegisters.animatedTangent + "\n" +
				"mov " +this. _sharedRegisters.tangentVarying + ".y, " + bitanTemp + ".x    \n" +
				"mov " + this._sharedRegisters.bitangentVarying + ".y, " + bitanTemp + ".y  \n" +
				"mov " + this._sharedRegisters.normalVarying + ".y, " + bitanTemp + ".z    \n";
            */
            this._registerCache.removeVertexTempUsage(this._sharedRegisters.animatedTangent);

		}

		/**
		 * Compiles the fragment shader code for tangent-space normal maps.
		 */
		private compileTangentNormalMapFragmentCode()
		{
			var t:away.materials.ShaderRegisterElement;
			var b:away.materials.ShaderRegisterElement;
			var n:away.materials.ShaderRegisterElement;
			
			t = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(t, 1);
			b = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(b, 1);
			n = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(n, 1);


            //TODO: AGAL <> GLSL

            /*
            this._fragmentCode += "nrm " + t + ".xyz, " + this._sharedRegisters.tangentVarying + "\n" +
				"mov " + t + ".w, " + this._sharedRegisters.tangentVarying + ".w	\n" +
				"nrm " + b + ".xyz, " + this._sharedRegisters.bitangentVarying + "\n" +
				"nrm " + n + ".xyz, " + this._sharedRegisters.normalVarying + "\n";
			*/
			var temp:ShaderRegisterElement = this._registerCache.getFreeFragmentVectorTemp();



            this._registerCache.addFragmentTempUsages(temp, 1);

            //TODO: AGAL <> GLSL
            /*
            this._fragmentCode += this._methodSetup._iNormalMethod.iGetFragmentCode(this._methodSetup._iNormalMethodVO, this._registerCache, temp) +
				"m33 " + this._sharedRegisters.normalFragment + ".xyz, " + temp + ", " + t + "	\n" +
				"mov " + this._sharedRegisters.normalFragment + ".w,   " + this._sharedRegisters.normalVarying + ".w			\n";
            */

            this._registerCache.removeFragmentTempUsage(temp);
			
			if (this._methodSetup._iNormalMethodVO.needsView)
            {

                this._registerCache.removeFragmentTempUsage(this._sharedRegisters.viewDirFragment);

            }

			if (this._methodSetup._iNormalMethodVO.needsGlobalVertexPos || this._methodSetup._iNormalMethodVO.needsGlobalFragmentPos)
            {

                this._registerCache.removeVertexTempUsage(this._sharedRegisters.globalPositionVertex);

            }

            this._registerCache.removeFragmentTempUsage(b);
            this._registerCache.removeFragmentTempUsage(t);
            this._registerCache.removeFragmentTempUsage(n);

		}

		/**
		 * @inheritDoc
		 */
		public pCompileViewDirCode()
		{
			var cameraPositionReg:away.materials.ShaderRegisterElement = this._registerCache.getFreeVertexConstant();

			this._sharedRegisters.viewDirVarying = this._registerCache.getFreeVarying();
            this._sharedRegisters.viewDirFragment = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(this._sharedRegisters.viewDirFragment, this._dependencyCounter.viewDirDependencies);

            this._cameraPositionIndex = cameraPositionReg.index*4;

            //TODO: AGAL <> GLSL
            /*
            this._vertexCode += "sub " + this._sharedRegisters.viewDirVarying + ", " + cameraPositionReg + ", " + this._sharedRegisters.globalPositionVertex + "\n";
            this._fragmentCode += "nrm " + this._sharedRegisters.viewDirFragment + ".xyz, " + this._sharedRegisters.viewDirVarying + "\n" +
				"mov " + this._sharedRegisters.viewDirFragment + ".w,   " + this._sharedRegisters.viewDirVarying + ".w 		\n";
            */
            this._registerCache.removeVertexTempUsage(this._sharedRegisters.globalPositionVertex);
		}

		/**
		 * @inheritDoc
		 */
		public pCompileLightingCode()
		{
			var shadowReg:away.materials.ShaderRegisterElement;
			
			this._sharedRegisters.shadedTarget = this._registerCache.getFreeFragmentVectorTemp();
            this._registerCache.addFragmentTempUsages(this._sharedRegisters.shadedTarget, 1);


            this._vertexCode += this._methodSetup._iDiffuseMethod.iGetVertexCode(this._methodSetup._iDiffuseMethodVO, this._registerCache);
            this._fragmentCode += this._methodSetup._iDiffuseMethod.iGetFragmentPreLightingCode(this._methodSetup._iDiffuseMethodVO, this._registerCache);

			
			if (this._usingSpecularMethod)
            {

                this._vertexCode += this._methodSetup._iSpecularMethod.iGetVertexCode(this._methodSetup._iSpecularMethodVO, this._registerCache);
                this._fragmentCode += this._methodSetup._iSpecularMethod.iGetFragmentPreLightingCode(this._methodSetup._iSpecularMethodVO, this._registerCache);

			}

			if (this.pUsesLights())
            {

                this.initLightRegisters();
                this.compileDirectionalLightCode();
                this.compilePointLightCode();

			}

			if (this.pUsesProbes())
            {

                this.compileLightProbeCode();

            }

			
			// only need to create and reserve _shadedTargetReg here, no earlier?
			this._vertexCode += this._methodSetup._iAmbientMethod.iGetVertexCode(this._methodSetup._iAmbientMethodVO, this._registerCache);
            this._fragmentCode += this._methodSetup._iAmbientMethod.iGetFragmentCode(this._methodSetup._iAmbientMethodVO, this._registerCache, this._sharedRegisters.shadedTarget);

			if (this._methodSetup._iAmbientMethodVO.needsNormals)
            {

                this._registerCache.removeFragmentTempUsage(this._sharedRegisters.normalFragment);

            }

			if (this._methodSetup._iAmbientMethodVO.needsView)
            {

                this._registerCache.removeFragmentTempUsage(this._sharedRegisters.viewDirFragment);

            }

			
			if (this._methodSetup._iShadowMethod)
            {

				this._vertexCode += this._methodSetup._iShadowMethod.iGetVertexCode(this._methodSetup._iShadowMethodVO, this._registerCache);

				// using normal to contain shadow data if available is perhaps risky :s
				// todo: improve compilation with lifetime analysis so this isn't necessary?

				if (this._dependencyCounter.normalDependencies == 0)
                {

					shadowReg = this._registerCache.getFreeFragmentVectorTemp();
					this._registerCache.addFragmentTempUsages(shadowReg, 1);

				}
                else
                {

                    shadowReg = this._sharedRegisters.normalFragment;

                }

				
				this._methodSetup._iDiffuseMethod.iShadowRegister = shadowReg;
				this._fragmentCode += this._methodSetup._iShadowMethod.iGetFragmentCode(this._methodSetup._iShadowMethodVO, this._registerCache, shadowReg);

			}

			this._fragmentCode += this._methodSetup._iDiffuseMethod.iGetFragmentPostLightingCode(this._methodSetup._iDiffuseMethodVO, this._registerCache, this._sharedRegisters.shadedTarget);

			if (this._alphaPremultiplied)
            {

                //TODO: AGAL <> GLSL
                /*
				this._fragmentCode += "add " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.commons + ".z\n" +
					"div " + this._sharedRegisters.shadedTarget + ".xyz, " + this._sharedRegisters.shadedTarget + ", " + this._sharedRegisters.shadedTarget + ".w\n" +
					"sub " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.commons + ".z\n" +
					"sat " + this._sharedRegisters.shadedTarget + ".xyz, " + this._sharedRegisters.shadedTarget + "\n";
                */
			}
			
			// resolve other dependencies as well?
			if (this._methodSetup._iDiffuseMethodVO.needsNormals)
            {

                this._registerCache.removeFragmentTempUsage(this._sharedRegisters.normalFragment);

            }

			if (this._methodSetup._iDiffuseMethodVO.needsView)
            {

                this._registerCache.removeFragmentTempUsage(this._sharedRegisters.viewDirFragment);

            }

			
			if (this._usingSpecularMethod)
            {

                this._methodSetup._iSpecularMethod.iShadowRegister = shadowReg;
                this._fragmentCode += this._methodSetup._iSpecularMethod.iGetFragmentPostLightingCode(this._methodSetup._iSpecularMethodVO, this._registerCache, this._sharedRegisters.shadedTarget);

				if (this._methodSetup._iSpecularMethodVO.needsNormals)
                {

                    this._registerCache.removeFragmentTempUsage(this._sharedRegisters.normalFragment);

                }

				if (this._methodSetup._iSpecularMethodVO.needsView)
                {

                    this._registerCache.removeFragmentTempUsage(this._sharedRegisters.viewDirFragment);

                }

			}
		}

		/**
		 * Initializes the registers containing the lighting data.
		 */
		private initLightRegisters()
		{
			// init these first so we're sure they're in sequence
			var i:number, len:number;
			
			len = this._dirLightRegisters.length;

			for (i = 0; i < len; ++i)
            {

				this._dirLightRegisters[i] = this._registerCache.getFreeFragmentConstant();

				if (this._lightFragmentConstantIndex == -1)
                {

                    this._lightFragmentConstantIndex = this._dirLightRegisters[i].index*4;

                }

			}
			
			len = this._pointLightRegisters.length;

			for (i = 0; i < len; ++i)
            {

				this._pointLightRegisters[i] = this._registerCache.getFreeFragmentConstant();

				if (this._lightFragmentConstantIndex == -1)
                {

                    this._lightFragmentConstantIndex = this._pointLightRegisters[i].index*4;

                }

			}
		}

		private compileDirectionalLightCode()
		{
			var diffuseColorReg:ShaderRegisterElement;
			var specularColorReg:ShaderRegisterElement;
			var lightDirReg:ShaderRegisterElement;
			var regIndex:number;
			var addSpec:boolean = this._usingSpecularMethod && this.pUsesLightsForSpecular();
			var addDiff:boolean = this.pUsesLightsForDiffuse();

			if (!(addSpec || addDiff))
            {

                return;

            }

			
			for (var i:number = 0; i < this._numDirectionalLights; ++i)
            {

				lightDirReg = this._dirLightRegisters[regIndex++];

				diffuseColorReg = this._dirLightRegisters[regIndex++];

				specularColorReg = this._dirLightRegisters[regIndex++];

				if (addDiff)
                {

                    this._fragmentCode += this._methodSetup._iDiffuseMethod.iGetFragmentCodePerLight(this._methodSetup._iDiffuseMethodVO, lightDirReg, diffuseColorReg, this._registerCache);

                }

				if (addSpec)
                {

                    this._fragmentCode += this._methodSetup._iSpecularMethod.iGetFragmentCodePerLight(this._methodSetup._iSpecularMethodVO, lightDirReg, specularColorReg, this._registerCache);

                }

			}
		}
		
		private compilePointLightCode()
		{
			var diffuseColorReg:ShaderRegisterElement;
			var specularColorReg:ShaderRegisterElement;
			var lightPosReg:ShaderRegisterElement;
			var lightDirReg:ShaderRegisterElement;
			var regIndex:number;
			var addSpec:boolean = this._usingSpecularMethod && this.pUsesLightsForSpecular();

			var addDiff:boolean = this.pUsesLightsForDiffuse();

			
			if (!(addSpec || addDiff))
            {

                return;

            }

			
			for (var i:number = 0; i < this._numPointLights; ++i)
            {
				lightPosReg = this._pointLightRegisters[regIndex++];
				diffuseColorReg = this._pointLightRegisters[regIndex++];
				specularColorReg = this._pointLightRegisters[regIndex++];
				lightDirReg = this._registerCache.getFreeFragmentVectorTemp();
                this._registerCache.addFragmentTempUsages(lightDirReg, 1);
				
				// calculate attenuation
                this._fragmentCode += "sub " + lightDirReg + ", " + lightPosReg + ", " + this._sharedRegisters.globalPositionVarying + "\n" +
					// attenuate
					"dp3 " + lightDirReg + ".w, " + lightDirReg + ", " + lightDirReg + "\n" +
					// w = d - radis
					"sub " + lightDirReg + ".w, " + lightDirReg + ".w, " + diffuseColorReg + ".w\n" +
					// w = (d - radius)/(max-min)
					"mul " + lightDirReg + ".w, " + lightDirReg + ".w, " + specularColorReg + ".w\n" +
					// w = clamp(w, 0, 1)
					"sat " + lightDirReg + ".w, " + lightDirReg + ".w\n" +
					// w = 1-w
					"sub " + lightDirReg + ".w, " + lightPosReg + ".w, " + lightDirReg + ".w\n" +
					// normalize
					"nrm " + lightDirReg + ".xyz, " + lightDirReg + "\n";
				
				if (this._lightFragmentConstantIndex == -1)
                {

                    this._lightFragmentConstantIndex = lightPosReg.index*4;

                }

				
				if (addDiff)
                {

                    this._fragmentCode += this._methodSetup._iDiffuseMethod.iGetFragmentCodePerLight(this._methodSetup._iDiffuseMethodVO, lightDirReg, diffuseColorReg, this._registerCache);

                }

				
				if (addSpec)
                {

                    this._fragmentCode += this._methodSetup._iSpecularMethod.iGetFragmentCodePerLight(this._methodSetup._iSpecularMethodVO, lightDirReg, specularColorReg, this._registerCache);

                }

				
				this._registerCache.removeFragmentTempUsage(lightDirReg);

			}
		}
		
		private compileLightProbeCode()
		{
			var weightReg:string;
			var weightComponents = [ ".x", ".y", ".z", ".w" ];
			var weightRegisters:away.materials.ShaderRegisterElement[] = new Array<away.materials.ShaderRegisterElement>();//Vector.<ShaderRegisterElement> = new Vector.<ShaderRegisterElement>();
			var i:number;
			var texReg:ShaderRegisterElement;
			var addSpec:boolean = this._usingSpecularMethod && this.pUsesProbesForSpecular();
			var addDiff:boolean = this.pUsesProbesForDiffuse();
			
			if (!(addSpec || addDiff))
            {

                return;

            }

			
			if (addDiff)
            {

                this._lightProbeDiffuseIndices = new Array<number>();//Vector.<uint>();

            }

			if (addSpec)
            {

                this._lightProbeSpecularIndices = new Array<number>();//Vector.<uint>();

            }

			
			for (i = 0; i < this._numProbeRegisters; ++i)
            {

				weightRegisters[i] = this._registerCache.getFreeFragmentConstant();
				if (i == 0)
                {

                    this._probeWeightsIndex = weightRegisters[i].index*4;

                }

			}
			
			for (i = 0; i < this._numLightProbes; ++i)
            {

				weightReg = weightRegisters[Math.floor(i/4)].toString() + weightComponents[i%4];
				
				if (addDiff)
                {

					texReg = this._registerCache.getFreeTextureReg();
                    this._lightProbeDiffuseIndices[i] = texReg.index;
                    this._fragmentCode += this._methodSetup._iDiffuseMethod.iGetFragmentCodePerProbe(this._methodSetup._iDiffuseMethodVO, texReg, weightReg, this._registerCache);

				}
				
				if (addSpec)
                {

					texReg = this._registerCache.getFreeTextureReg();
                    this._lightProbeSpecularIndices[i] = texReg.index;
                    this._fragmentCode += this._methodSetup._iSpecularMethod.iGetFragmentCodePerProbe(this._methodSetup._iSpecularMethodVO, texReg, weightReg, this._registerCache);

				}
			}
		}
	}
}
