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

			this._pointLightRegisters = new Array<away.materials.ShaderRegisterElement>(this._pNumPointLights*3);//Vector.<ShaderRegisterElement>(_numPointLights*3, true);
			this._dirLightRegisters = new Array<away.materials.ShaderRegisterElement>(this._pNumDirectionalLights*3);//Vector.<ShaderRegisterElement>(_numDirectionalLights*3, true);


		}

		/**
		 * @inheritDoc
		 */
		public pCalculateDependencies()
		{

			super.pCalculateDependencies();
			this._pDependencyCounter.addWorldSpaceDependencies(true);

		}

		/**
		 * @inheritDoc
		 */
		public pCompileNormalCode()
		{
			var normalMatrix:away.materials.ShaderRegisterElement[] = new Array<away.materials.ShaderRegisterElement>(3);//Vector.<ShaderRegisterElement> = new Vector.<ShaderRegisterElement>(3, true);

			this._pSharedRegisters.normalFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
			this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.normalFragment, this._pDependencyCounter.normalDependencies);

			if (this._pMethodSetup._iNormalMethod.iHasOutput && !this._pMethodSetup._iNormalMethod.iTangentSpace) {

				this._pVertexCode += this._pMethodSetup._iNormalMethod.iGetVertexCode(this._pMethodSetup._iNormalMethodVO, this._pRegisterCache);
				this._pFragmentCode += this._pMethodSetup._iNormalMethod.iGetFragmentCode(this._pMethodSetup._iNormalMethodVO, this._pRegisterCache, this._pSharedRegisters.normalFragment);

				return;

			}

			this._pSharedRegisters.normalVarying = this._pRegisterCache.getFreeVarying();

			normalMatrix[0] = this._pRegisterCache.getFreeVertexConstant();
			normalMatrix[1] = this._pRegisterCache.getFreeVertexConstant();
			normalMatrix[2] = this._pRegisterCache.getFreeVertexConstant();

			this._pRegisterCache.getFreeVertexConstant();
			this._pSceneNormalMatrixIndex = normalMatrix[0].index*4;

			if (this._pMethodSetup._iNormalMethod.iHasOutput) {

				// tangent stream required
				this.compileTangentVertexCode(normalMatrix);
				this.compileTangentNormalMapFragmentCode();

			} else {
				// TODO: AGAL <> GLSL

				//*
				this._pVertexCode += "m33 " + this._pSharedRegisters.normalVarying + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" + "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.animatedNormal + ".w	\n";

				this._pFragmentCode += "nrm " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalVarying + "\n" + "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w		\n";

				if (this._pDependencyCounter.tangentDependencies > 0) {

					this._pSharedRegisters.tangentInput = this._pRegisterCache.getFreeVertexAttribute();
					this._pTangentBufferIndex = this._pSharedRegisters.tangentInput.index;
					this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();

					this._pVertexCode += "mov " + this._pSharedRegisters.tangentVarying + ", " + this._pSharedRegisters.tangentInput + "\n";
				}
				//*/
			}

			this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedNormal);

		}

		/**
		 * @inheritDoc
		 */
		public pCreateNormalRegisters()
		{
			if (this._pDependencyCounter.normalDependencies > 0) {

				this._pSharedRegisters.normalInput = this._pRegisterCache.getFreeVertexAttribute();
				this._pNormalBufferIndex = this._pSharedRegisters.normalInput.index;
				this._pSharedRegisters.animatedNormal = this._pRegisterCache.getFreeVertexVectorTemp();
				this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedNormal, 1);
				this._pAnimatableAttributes.push(this._pSharedRegisters.normalInput.toString());
				this._pAnimationTargetRegisters.push(this._pSharedRegisters.animatedNormal.toString());

			}

			if (this._pMethodSetup._iNormalMethod.iHasOutput) {

				this._pSharedRegisters.tangentInput = this._pRegisterCache.getFreeVertexAttribute();
				this._pTangentBufferIndex = this._pSharedRegisters.tangentInput.index;

				this._pSharedRegisters.animatedTangent = this._pRegisterCache.getFreeVertexVectorTemp();
				this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedTangent, 1);

				this._pAnimatableAttributes.push(this._pSharedRegisters.tangentInput.toString());
				this._pAnimationTargetRegisters.push(this._pSharedRegisters.animatedTangent.toString());

			}
		}

		/**
		 * Compiles the vertex shader code for tangent-space normal maps.
		 * @param matrix The register containing the scene transformation matrix for normals.
		 */
		private compileTangentVertexCode(matrix:away.materials.ShaderRegisterElement[])//Vector.<ShaderRegisterElement>)
		{
			this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
			this._pSharedRegisters.bitangentVarying = this._pRegisterCache.getFreeVarying();
			var temp:away.materials.ShaderRegisterElement = this._pRegisterCache.getFreeVertexVectorTemp();

			//TODO: AGAL <> GLSL

			this._pVertexCode += "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + matrix[0] + "\n" + "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + temp + "\n";

			this._pVertexCode += "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + matrix[0] + "\n" + "nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + temp + "\n";


			this._pVertexCode += "mov " + this._pSharedRegisters.tangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".x  \n" + "mov " + this._pSharedRegisters.tangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".x  \n" + "mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".y  \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".y  \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" + "mov " + this._pSharedRegisters.normalVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".z  \n" + "mov " + this._pSharedRegisters.normalVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".z  \n" + "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" + "crs " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n" + "mov " + this._pSharedRegisters.tangentVarying + ".y, " + temp + ".x    \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".y, " + temp + ".y  \n" + "mov " + this._pSharedRegisters.normalVarying + ".y, " + temp + ".z    \n";

			this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedTangent);

		}

		/**
		 * Compiles the fragment shader code for tangent-space normal maps.
		 */
		private compileTangentNormalMapFragmentCode()
		{
			var t:away.materials.ShaderRegisterElement;
			var b:away.materials.ShaderRegisterElement;
			var n:away.materials.ShaderRegisterElement;

			t = this._pRegisterCache.getFreeFragmentVectorTemp();
			this._pRegisterCache.addFragmentTempUsages(t, 1);
			b = this._pRegisterCache.getFreeFragmentVectorTemp();
			this._pRegisterCache.addFragmentTempUsages(b, 1);
			n = this._pRegisterCache.getFreeFragmentVectorTemp();
			this._pRegisterCache.addFragmentTempUsages(n, 1);


			//TODO: AGAL <> GLSL

			this._pFragmentCode += "nrm " + t + ".xyz, " + this._pSharedRegisters.tangentVarying + "\n" + "mov " + t + ".w, " + this._pSharedRegisters.tangentVarying + ".w	\n" + "nrm " + b + ".xyz, " + this._pSharedRegisters.bitangentVarying + "\n" + "nrm " + n + ".xyz, " + this._pSharedRegisters.normalVarying + "\n";

			var temp:ShaderRegisterElement = this._pRegisterCache.getFreeFragmentVectorTemp();


			this._pRegisterCache.addFragmentTempUsages(temp, 1);

			//TODO: AGAL <> GLSL

			this._pFragmentCode += this._pMethodSetup._iNormalMethod.iGetFragmentCode(this._pMethodSetup._iNormalMethodVO, this._pRegisterCache, temp) + "m33 " + this._pSharedRegisters.normalFragment + ".xyz, " + temp + ", " + t + "	\n" + "mov " + this._pSharedRegisters.normalFragment + ".w,   " + this._pSharedRegisters.normalVarying + ".w			\n";


			this._pRegisterCache.removeFragmentTempUsage(temp);

			if (this._pMethodSetup._iNormalMethodVO.needsView) {

				this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.viewDirFragment);

			}

			if (this._pMethodSetup._iNormalMethodVO.needsGlobalVertexPos || this._pMethodSetup._iNormalMethodVO.needsGlobalFragmentPos) {

				this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.globalPositionVertex);

			}

			this._pRegisterCache.removeFragmentTempUsage(b);
			this._pRegisterCache.removeFragmentTempUsage(t);
			this._pRegisterCache.removeFragmentTempUsage(n);

		}

		/**
		 * @inheritDoc
		 */
		public pCompileViewDirCode()
		{
			var cameraPositionReg:away.materials.ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();

			this._pSharedRegisters.viewDirVarying = this._pRegisterCache.getFreeVarying();
			this._pSharedRegisters.viewDirFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
			this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.viewDirFragment, this._pDependencyCounter.viewDirDependencies);

			this._pCameraPositionIndex = cameraPositionReg.index*4;

			//TODO: AGAL <> GLSL

			this._pVertexCode += "sub " + this._pSharedRegisters.viewDirVarying + ", " + cameraPositionReg + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
			this._pFragmentCode += "nrm " + this._pSharedRegisters.viewDirFragment + ".xyz, " + this._pSharedRegisters.viewDirVarying + "\n" + "mov " + this._pSharedRegisters.viewDirFragment + ".w,   " + this._pSharedRegisters.viewDirVarying + ".w 		\n";

			this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.globalPositionVertex);
		}

		/**
		 * @inheritDoc
		 */
		public pCompileLightingCode()
		{
			var shadowReg:away.materials.ShaderRegisterElement;

			this._pSharedRegisters.shadedTarget = this._pRegisterCache.getFreeFragmentVectorTemp();
			this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.shadedTarget, 1);


			this._pVertexCode += this._pMethodSetup._iDiffuseMethod.iGetVertexCode(this._pMethodSetup._iDiffuseMethodVO, this._pRegisterCache);
			this._pFragmentCode += this._pMethodSetup._iDiffuseMethod.iGetFragmentPreLightingCode(this._pMethodSetup._iDiffuseMethodVO, this._pRegisterCache);


			if (this._usingSpecularMethod) {

				this._pVertexCode += this._pMethodSetup._iSpecularMethod.iGetVertexCode(this._pMethodSetup._iSpecularMethodVO, this._pRegisterCache);
				this._pFragmentCode += this._pMethodSetup._iSpecularMethod.iGetFragmentPreLightingCode(this._pMethodSetup._iSpecularMethodVO, this._pRegisterCache);

			}

			if (this.pUsesLights()) {

				this.initLightRegisters();
				this.compileDirectionalLightCode();
				this.compilePointLightCode();

			}

			if (this.pUsesProbes()) {

				this.compileLightProbeCode();

			}


			// only need to create and reserve _shadedTargetReg here, no earlier?
			this._pVertexCode += this._pMethodSetup._iAmbientMethod.iGetVertexCode(this._pMethodSetup._iAmbientMethodVO, this._pRegisterCache);
			this._pFragmentCode += this._pMethodSetup._iAmbientMethod.iGetFragmentCode(this._pMethodSetup._iAmbientMethodVO, this._pRegisterCache, this._pSharedRegisters.shadedTarget);

			if (this._pMethodSetup._iAmbientMethodVO.needsNormals) {

				this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.normalFragment);

			}

			if (this._pMethodSetup._iAmbientMethodVO.needsView) {

				this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.viewDirFragment);

			}


			if (this._pMethodSetup._iShadowMethod) {

				this._pVertexCode += this._pMethodSetup._iShadowMethod.iGetVertexCode(this._pMethodSetup._iShadowMethodVO, this._pRegisterCache);

				// using normal to contain shadow data if available is perhaps risky :s
				// todo: improve compilation with lifetime analysis so this isn't necessary?

				if (this._pDependencyCounter.normalDependencies == 0) {

					shadowReg = this._pRegisterCache.getFreeFragmentVectorTemp();
					this._pRegisterCache.addFragmentTempUsages(shadowReg, 1);

				} else {

					shadowReg = this._pSharedRegisters.normalFragment;

				}


				this._pMethodSetup._iDiffuseMethod.iShadowRegister = shadowReg;
				this._pFragmentCode += this._pMethodSetup._iShadowMethod.iGetFragmentCode(this._pMethodSetup._iShadowMethodVO, this._pRegisterCache, shadowReg);

			}

			this._pFragmentCode += this._pMethodSetup._iDiffuseMethod.iGetFragmentPostLightingCode(this._pMethodSetup._iDiffuseMethodVO, this._pRegisterCache, this._pSharedRegisters.shadedTarget);

			if (this._pAlphaPremultiplied) {

				//TODO: AGAL <> GLSL

				this._pFragmentCode += "add " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.commons + ".z\n" + "div " + this._pSharedRegisters.shadedTarget + ".xyz, " + this._pSharedRegisters.shadedTarget + ", " + this._pSharedRegisters.shadedTarget + ".w\n" + "sub " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.commons + ".z\n" + "sat " + this._pSharedRegisters.shadedTarget + ".xyz, " + this._pSharedRegisters.shadedTarget + "\n";

			}

			// resolve other dependencies as well?
			if (this._pMethodSetup._iDiffuseMethodVO.needsNormals) {

				this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.normalFragment);

			}

			if (this._pMethodSetup._iDiffuseMethodVO.needsView) {

				this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.viewDirFragment);

			}


			if (this._usingSpecularMethod) {

				this._pMethodSetup._iSpecularMethod.iShadowRegister = shadowReg;
				this._pFragmentCode += this._pMethodSetup._iSpecularMethod.iGetFragmentPostLightingCode(this._pMethodSetup._iSpecularMethodVO, this._pRegisterCache, this._pSharedRegisters.shadedTarget);

				if (this._pMethodSetup._iSpecularMethodVO.needsNormals) {

					this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.normalFragment);

				}

				if (this._pMethodSetup._iSpecularMethodVO.needsView) {

					this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.viewDirFragment);

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

			for (i = 0; i < len; ++i) {

				this._dirLightRegisters[i] = this._pRegisterCache.getFreeFragmentConstant();

				if (this._pLightFragmentConstantIndex == -1) {

					this._pLightFragmentConstantIndex = this._dirLightRegisters[i].index*4;

				}

			}

			len = this._pointLightRegisters.length;

			for (i = 0; i < len; ++i) {

				this._pointLightRegisters[i] = this._pRegisterCache.getFreeFragmentConstant();

				if (this._pLightFragmentConstantIndex == -1) {

					this._pLightFragmentConstantIndex = this._pointLightRegisters[i].index*4;

				}

			}
		}

		private compileDirectionalLightCode()
		{
			var diffuseColorReg:ShaderRegisterElement;
			var specularColorReg:ShaderRegisterElement;
			var lightDirReg:ShaderRegisterElement;
			var regIndex:number = 0;
			var addSpec:boolean = this._usingSpecularMethod && this.pUsesLightsForSpecular();
			var addDiff:boolean = this.pUsesLightsForDiffuse();

			if (!(addSpec || addDiff)) {

				return;

			}


			for (var i:number = 0; i < this._pNumDirectionalLights; ++i) {

				lightDirReg = this._dirLightRegisters[regIndex++];

				diffuseColorReg = this._dirLightRegisters[regIndex++];

				specularColorReg = this._dirLightRegisters[regIndex++];

				if (addDiff) {

					this._pFragmentCode += this._pMethodSetup._iDiffuseMethod.iGetFragmentCodePerLight(this._pMethodSetup._iDiffuseMethodVO, lightDirReg, diffuseColorReg, this._pRegisterCache);

				}

				if (addSpec) {

					this._pFragmentCode += this._pMethodSetup._iSpecularMethod.iGetFragmentCodePerLight(this._pMethodSetup._iSpecularMethodVO, lightDirReg, specularColorReg, this._pRegisterCache);

				}

			}
		}

		private compilePointLightCode()
		{
			var diffuseColorReg:ShaderRegisterElement;
			var specularColorReg:ShaderRegisterElement;
			var lightPosReg:ShaderRegisterElement;
			var lightDirReg:ShaderRegisterElement;
			var regIndex:number = 0;
			var addSpec:boolean = this._usingSpecularMethod && this.pUsesLightsForSpecular();

			var addDiff:boolean = this.pUsesLightsForDiffuse();


			if (!(addSpec || addDiff)) {

				return;

			}


			for (var i:number = 0; i < this._pNumPointLights; ++i) {
				lightPosReg = this._pointLightRegisters[regIndex++];
				diffuseColorReg = this._pointLightRegisters[regIndex++];
				specularColorReg = this._pointLightRegisters[regIndex++];
				lightDirReg = this._pRegisterCache.getFreeFragmentVectorTemp();
				this._pRegisterCache.addFragmentTempUsages(lightDirReg, 1);

				// calculate attenuation
				this._pFragmentCode += "sub " + lightDirReg + ", " + lightPosReg + ", " + this._pSharedRegisters.globalPositionVarying + "\n" + // attenuate
					"dp3 " + lightDirReg + ".w, " + lightDirReg + ", " + lightDirReg + "\n" + // w = d - radis
					"sub " + lightDirReg + ".w, " + lightDirReg + ".w, " + diffuseColorReg + ".w\n" + // w = (d - radius)/(max-min)
					"mul " + lightDirReg + ".w, " + lightDirReg + ".w, " + specularColorReg + ".w\n" + // w = clamp(w, 0, 1)
					"sat " + lightDirReg + ".w, " + lightDirReg + ".w\n" + // w = 1-w
					"sub " + lightDirReg + ".w, " + lightPosReg + ".w, " + lightDirReg + ".w\n" + // normalize
					"nrm " + lightDirReg + ".xyz, " + lightDirReg + "\n";

				if (this._pLightFragmentConstantIndex == -1) {

					this._pLightFragmentConstantIndex = lightPosReg.index*4;

				}


				if (addDiff) {

					this._pFragmentCode += this._pMethodSetup._iDiffuseMethod.iGetFragmentCodePerLight(this._pMethodSetup._iDiffuseMethodVO, lightDirReg, diffuseColorReg, this._pRegisterCache);

				}


				if (addSpec) {

					this._pFragmentCode += this._pMethodSetup._iSpecularMethod.iGetFragmentCodePerLight(this._pMethodSetup._iSpecularMethodVO, lightDirReg, specularColorReg, this._pRegisterCache);

				}


				this._pRegisterCache.removeFragmentTempUsage(lightDirReg);

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

			if (!(addSpec || addDiff)) {

				return;

			}


			if (addDiff) {

				this._pLightProbeDiffuseIndices = new Array<number>();//Vector.<uint>();

			}

			if (addSpec) {

				this._pLightProbeSpecularIndices = new Array<number>();//Vector.<uint>();

			}


			for (i = 0; i < this._pNumProbeRegisters; ++i) {

				weightRegisters[i] = this._pRegisterCache.getFreeFragmentConstant();
				if (i == 0) {

					this._pProbeWeightsIndex = weightRegisters[i].index*4;

				}

			}

			for (i = 0; i < this._pNumLightProbes; ++i) {

				weightReg = weightRegisters[Math.floor(i/4)].toString() + weightComponents[i%4];

				if (addDiff) {

					texReg = this._pRegisterCache.getFreeTextureReg();
					this._pLightProbeDiffuseIndices[i] = texReg.index;
					this._pFragmentCode += this._pMethodSetup._iDiffuseMethod.iGetFragmentCodePerProbe(this._pMethodSetup._iDiffuseMethodVO, texReg, weightReg, this._pRegisterCache);

				}

				if (addSpec) {

					texReg = this._pRegisterCache.getFreeTextureReg();
					this._pLightProbeSpecularIndices[i] = texReg.index;
					this._pFragmentCode += this._pMethodSetup._iSpecularMethod.iGetFragmentCodePerProbe(this._pMethodSetup._iSpecularMethodVO, texReg, weightReg, this._pRegisterCache);

				}
			}
		}
	}
}
