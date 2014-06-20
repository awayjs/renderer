///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import SubGeometry								= away.base.TriangleSubGeometry;
	import Camera									= away.entities.Camera;
	import AbstractMethodError						= away.errors.AbstractMethodError;
	import ShadingMethodEvent						= away.events.ShadingMethodEvent;
	import Matrix									= away.geom.Matrix;
	import Matrix3D									= away.geom.Matrix3D;
	import Matrix3DUtils							= away.geom.Matrix3DUtils;
	import RenderableBase							= away.pool.RenderableBase;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import Texture2DBase							= away.textures.Texture2DBase;

	/**
	 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
	 * using material methods to define their appearance.
	 */
	export class CompiledPass extends MaterialPassBase
	{
		public _iPassesDirty:boolean;

		public _pSpecularLightSources:number = 0x01;
		public _pDiffuseLightSources:number = 0x03;

		private _vertexCode:string;
		private _fragmentLightCode:string;
		private _framentPostLightCode:string;

		public _pVertexConstantData:Array<number> = new Array<number>();
		public _pFragmentConstantData:Array<number> = new Array<number>();
		private _commonsDataIndex:number;
		public _pProbeWeightsIndex:number;
		private _uvBufferIndex:number;
		private _secondaryUVBufferIndex:number;
		private _normalBufferIndex:number;
		private _tangentBufferIndex:number;
		private _sceneMatrixIndex:number;
		private _sceneNormalMatrixIndex:number;
		public _pLightFragmentConstantIndex:number;
		public _pCameraPositionIndex:number;
		private _uvTransformIndex:number;
		public _pLightProbeDiffuseIndices:Array<number> /*uint*/;
		public _pLightProbeSpecularIndices:Array<number> /*uint*/;

		public _pAmbientLightR:number;
		public _pAmbientLightG:number;
		public _pAmbientLightB:number;

		public _pCompiler:ShaderCompiler;

		public _pMethodSetup:ShaderMethodSetup;

		private _usingSpecularMethod:boolean;
		private _usesNormals:boolean;
		public _preserveAlpha:boolean = true;
		private _animateUVs:boolean = false;

		public _pNumPointLights:number = 0;
		public _pNumDirectionalLights:number = 0;
		public _pNumLightProbes:number = 0;

		private _enableLightFallOff:boolean = true;

		private _forceSeparateMVP:boolean = false;

		private _onShaderInvalidatedDelegate:(event:ShadingMethodEvent) => void;

		/**
		 * Creates a new CompiledPass object.
		 *
		 * @param material The material to which this pass belongs.
		 */
		constructor(material:MaterialBase)
		{
			super();

			this.material = material;

			this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);

			this.init();
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
			if (value != this._enableLightFallOff)
				this.iInvalidateShaderProgram(true);

			this._enableLightFallOff = value;
		}

		/**
		 * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
		 * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
		 * projection code.
		 */
		public get forceSeparateMVP():boolean
		{
			return this._forceSeparateMVP;
		}

		public set forceSeparateMVP(value:boolean)
		{
			this._forceSeparateMVP = value;
		}

		/**
		 * The amount of point lights that need to be supported.
		 */
		public get iNumPointLights():number
		{
			return this._pNumPointLights;
		}

		/**
		 * The amount of directional lights that need to be supported.
		 */
		public get iNumDirectionalLights():number
		{
			return this._pNumDirectionalLights;
		}

		/**
		 * The amount of light probes that need to be supported.
		 */
		public get iNumLightProbes():number
		{
			return this._pNumLightProbes;
		}

		/**
		 * @inheritDoc
		 */
		public iUpdateProgram(stage:Stage)
		{
			this.reset(stage.profile);
			super.iUpdateProgram(stage);
		}

		/**
		 * Resets the compilation state.
		 *
		 * @param profile The compatibility profile used by the renderer.
		 */
		private reset(profile:string)
		{
			this.iInitCompiler(profile);

			this.pUpdateShaderProperties();
			this.initConstantData();

			this.pCleanUp();
		}

		/**
		 * Updates the amount of used register indices.
		 */
		private updateUsedOffsets()
		{
			this._pNumUsedVertexConstants = this._pCompiler.numUsedVertexConstants;
			this._pNumUsedFragmentConstants = this._pCompiler.numUsedFragmentConstants;
			this._pNumUsedStreams = this._pCompiler.numUsedStreams;
			this._pNumUsedTextures = this._pCompiler.numUsedTextures;
			this._pNumUsedVaryings = this._pCompiler.numUsedVaryings;
			this._pNumUsedFragmentConstants = this._pCompiler.numUsedFragmentConstants;
		}

		/**
		 * Initializes the unchanging constant data for this material.
		 */
		private initConstantData()
		{
			this._pVertexConstantData.length = this._pNumUsedVertexConstants*4;
			this._pFragmentConstantData.length = this._pNumUsedFragmentConstants*4;

			this.pInitCommonsData();//this.initCommonsData();

			if (this._uvTransformIndex >= 0)
				this.pInitUVTransformData();

			if (this._pCameraPositionIndex >= 0)
				this._pVertexConstantData[this._pCameraPositionIndex + 3] = 1;

			this.pUpdateMethodConstants();
		}

		/**
		 * Initializes the compiler for this pass.
		 * @param profile The compatibility profile used by the renderer.
		 */
		public iInitCompiler(profile:string)
		{
			this._pCompiler = this.pCreateCompiler(profile);
			this._pCompiler.forceSeperateMVP = this._forceSeparateMVP;
			this._pCompiler.numPointLights = this._pNumPointLights;
			this._pCompiler.numDirectionalLights = this._pNumDirectionalLights;
			this._pCompiler.numLightProbes = this._pNumLightProbes;
			this._pCompiler.methodSetup = this._pMethodSetup;
			this._pCompiler.diffuseLightSources = this._pDiffuseLightSources;
			this._pCompiler.specularLightSources = this._pSpecularLightSources;
			this._pCompiler.setTextureSampling(this._pSmooth, this._pRepeat, this._pMipmap);
			this._pCompiler.setConstantDataBuffers(this._pVertexConstantData, this._pFragmentConstantData);
			this._pCompiler.animateUVs = this._animateUVs;
			this._pCompiler.alphaPremultiplied = this._pAlphaPremultiplied && this._pEnableBlending;
			this._pCompiler.preserveAlpha = this._preserveAlpha && this._pEnableBlending;
			this._pCompiler.enableLightFallOff = this._enableLightFallOff;
			this._pCompiler.compile();
		}

		/**
		 * Factory method to create a concrete compiler object for this pass.
		 * @param profile The compatibility profile used by the renderer.
		 */
		public pCreateCompiler(profile:string):ShaderCompiler
		{
			throw new AbstractMethodError();
		}

		/**
		 * Copies the shader's properties from the compiler.
		 */
		public pUpdateShaderProperties()
		{
			this._pAnimatableAttributes = this._pCompiler.animatableAttributes;
			this._pAnimationTargetRegisters = this._pCompiler.animationTargetRegisters;
			this._vertexCode = this._pCompiler.vertexCode;
			this._fragmentLightCode = this._pCompiler.fragmentLightCode;
			this._framentPostLightCode = this._pCompiler.fragmentPostLightCode;
			this._pShadedTarget = this._pCompiler.shadedTarget;
			this._usingSpecularMethod = this._pCompiler.usingSpecularMethod;
			this._usesNormals = this._pCompiler.usesNormals;
			this._pNeedUVAnimation = this._pCompiler.needUVAnimation;
			this._pUVSource = this._pCompiler.UVSource;
			this._pUVTarget = this._pCompiler.UVTarget;

			this.pUpdateRegisterIndices();
			this.updateUsedOffsets();
		}

		/**
		 * Updates the indices for various registers.
		 */
		public pUpdateRegisterIndices()
		{
			this._uvBufferIndex = this._pCompiler.uvBufferIndex;
			this._uvTransformIndex = this._pCompiler.uvTransformIndex;
			this._secondaryUVBufferIndex = this._pCompiler.secondaryUVBufferIndex;
			this._normalBufferIndex = this._pCompiler.normalBufferIndex;
			this._tangentBufferIndex = this._pCompiler.tangentBufferIndex;
			this._pLightFragmentConstantIndex = this._pCompiler.lightFragmentConstantIndex;
			this._pCameraPositionIndex = this._pCompiler.cameraPositionIndex;
			this._commonsDataIndex = this._pCompiler.commonsDataIndex;
			this._sceneMatrixIndex = this._pCompiler.sceneMatrixIndex;
			this._sceneNormalMatrixIndex = this._pCompiler.sceneNormalMatrixIndex;
			this._pProbeWeightsIndex = this._pCompiler.probeWeightsIndex;
			this._pLightProbeDiffuseIndices = this._pCompiler.lightProbeDiffuseIndices;
			this._pLightProbeSpecularIndices = this._pCompiler.lightProbeSpecularIndices;
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
			if (this._preserveAlpha == value)
				return;

			this._preserveAlpha = value;

			this.iInvalidateShaderProgram();
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

			if ((value && !this._animateUVs) || (!value && this._animateUVs))
				this.iInvalidateShaderProgram();
		}

		/**
		 * The normal map to modulate the direction of the surface for each texel. The default normal method expects
		 * tangent-space normal maps, but others could expect object-space maps.
		 */
		public get normalMap():Texture2DBase
		{
			return this._pMethodSetup._iNormalMethod.normalMap;
		}

		public set normalMap(value:Texture2DBase)
		{
			this._pMethodSetup._iNormalMethod.normalMap = value;
		}

		/**
		 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
		 */
		public get normalMethod():NormalBasicMethod
		{
			return this._pMethodSetup.normalMethod;
		}

		public set normalMethod(value:NormalBasicMethod)
		{
			this._pMethodSetup.normalMethod = value;
		}

		/**
		 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
		 */
		public get ambientMethod():AmbientBasicMethod
		{
			return this._pMethodSetup.ambientMethod;
		}

		public set ambientMethod(value:AmbientBasicMethod)
		{
			this._pMethodSetup.ambientMethod = value;
		}

		/**
		 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
		 */
		public get shadowMethod():ShadowMapMethodBase
		{
			return this._pMethodSetup.shadowMethod;
		}

		public set shadowMethod(value:ShadowMapMethodBase)
		{
			this._pMethodSetup.shadowMethod = value;
		}

		/**
		 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
		 */
		public get diffuseMethod():DiffuseBasicMethod
		{
			return this._pMethodSetup.diffuseMethod;
		}

		public set diffuseMethod(value:DiffuseBasicMethod)
		{
			this._pMethodSetup.diffuseMethod = value;
		}

		/**
		 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
		 */
		public get specularMethod():SpecularBasicMethod
		{
			return this._pMethodSetup.specularMethod;
		}

		public set specularMethod(value:SpecularBasicMethod)
		{
			this._pMethodSetup.specularMethod = value;
		}

		/**
		 * Initializes the pass.
		 */
		private init()
		{
			this._pMethodSetup = new ShaderMethodSetup();

			this._pMethodSetup.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			super.dispose();

			this._pMethodSetup.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this._pMethodSetup.dispose();
			this._pMethodSetup = null;
		}

		/**
		 * @inheritDoc
		 */
		public iInvalidateShaderProgram(updateMaterial:boolean = true)
		{
			var oldPasses:Array<IMaterialPass> = this._iPasses;
			this._iPasses = new Array<MaterialPassBase>();

			if (this._pMethodSetup)
				this.pAddPassesFromMethods();

			if (!oldPasses || this._iPasses.length != oldPasses.length) {
				this._iPassesDirty = true;
				return;
			}

			for (var i:number = 0; i < this._iPasses.length; ++i) {
				if (this._iPasses[i] != oldPasses[i]) {
					this._iPassesDirty = true;
					return;
				}
			}

			super.iInvalidateShaderProgram(updateMaterial);
		}

		/**
		 * Adds any possible passes needed by the used methods.
		 */
		public pAddPassesFromMethods()
		{
			if (this._pMethodSetup._iNormalMethod && this._pMethodSetup._iNormalMethod.iHasOutput)
				this.pAddPasses(this._pMethodSetup._iNormalMethod.passes);

			if (this._pMethodSetup._iAmbientMethod)
				this.pAddPasses(this._pMethodSetup._iAmbientMethod.passes);

			if (this._pMethodSetup._iShadowMethod)
				this.pAddPasses(this._pMethodSetup._iShadowMethod.passes);

			if (this._pMethodSetup._iDiffuseMethod)
				this.pAddPasses(this._pMethodSetup._iDiffuseMethod.passes);

			if (this._pMethodSetup._iSpecularMethod)
				this.pAddPasses(this._pMethodSetup._iSpecularMethod.passes);
		}

		/**
		 * Adds internal passes to the material.
		 *
		 * @param passes The passes to add.
		 */
		public pAddPasses(passes:Array<MaterialPassBase>)
		{
			if (!passes)
				return;

			var len:number = passes.length;

			for (var i:number = 0; i < len; ++i) {
				passes[i].material = this.material;
				passes[i].lightPicker = this._pLightPicker;
				this._iPasses.push(passes[i]);
			}
		}

		/**
		 * Initializes the default UV transformation matrix.
		 */
		public pInitUVTransformData()
		{
			this._pVertexConstantData[this._uvTransformIndex] = 1;
			this._pVertexConstantData[this._uvTransformIndex + 1] = 0;
			this._pVertexConstantData[this._uvTransformIndex + 2] = 0;
			this._pVertexConstantData[this._uvTransformIndex + 3] = 0;
			this._pVertexConstantData[this._uvTransformIndex + 4] = 0;
			this._pVertexConstantData[this._uvTransformIndex + 5] = 1;
			this._pVertexConstantData[this._uvTransformIndex + 6] = 0;
			this._pVertexConstantData[this._uvTransformIndex + 7] = 0;
		}

		/**
		 * Initializes commonly required constant values.
		 */
		public pInitCommonsData()
		{
			this._pFragmentConstantData[this._commonsDataIndex] = .5;
			this._pFragmentConstantData[this._commonsDataIndex + 1] = 0;
			this._pFragmentConstantData[this._commonsDataIndex + 2] = 1/255;
			this._pFragmentConstantData[this._commonsDataIndex + 3] = 1;
		}

		/**
		 * Cleans up the after compiling.
		 */
		public pCleanUp()
		{
			this._pCompiler.dispose();
			this._pCompiler = null;
		}

		/**
		 * Updates method constants if they have changed.
		 */
		public pUpdateMethodConstants()
		{
			if (this._pMethodSetup._iNormalMethod)
				this._pMethodSetup._iNormalMethod.iInitConstants(this._pMethodSetup._iNormalMethodVO);

			if (this._pMethodSetup._iDiffuseMethod)
				this._pMethodSetup._iDiffuseMethod.iInitConstants(this._pMethodSetup._iDiffuseMethodVO);

			if (this._pMethodSetup._iAmbientMethod)
				this._pMethodSetup._iAmbientMethod.iInitConstants(this._pMethodSetup._iAmbientMethodVO);

			if (this._usingSpecularMethod)
				this._pMethodSetup._iSpecularMethod.iInitConstants(this._pMethodSetup._iSpecularMethodVO);

			if (this._pMethodSetup._iShadowMethod)
				this._pMethodSetup._iShadowMethod.iInitConstants(this._pMethodSetup._iShadowMethodVO);
		}

		/**
		 * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
		 */
		public pUpdateLightConstants()
		{
			// up to subclasses to optionally implement
		}

		/**
		 * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
		 */
		public pUpdateProbes(stage:Stage)
		{
			// up to subclasses to optionally implement
		}

		/**
		 * Called when any method's shader code is invalidated.
		 */
		private onShaderInvalidated(event:ShadingMethodEvent)
		{
			this.iInvalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			return this._vertexCode;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animatorCode:string):string
		{
			return this._fragmentLightCode + animatorCode + this._framentPostLightCode;
		}

		// RENDER LOOP

		/**
		 * @inheritDoc
		 */
		public iActivate(stage:Stage, camera:Camera)
		{
			super.iActivate(stage, camera);

			if (this._usesNormals)
				this._pMethodSetup._iNormalMethod.iActivate(this._pMethodSetup._iNormalMethodVO, stage);

			this._pMethodSetup._iAmbientMethod.iActivate(this._pMethodSetup._iAmbientMethodVO, stage);

			if (this._pMethodSetup._iShadowMethod)
				this._pMethodSetup._iShadowMethod.iActivate(this._pMethodSetup._iShadowMethodVO, stage);

			this._pMethodSetup._iDiffuseMethod.iActivate(this._pMethodSetup._iDiffuseMethodVO, stage);

			if (this._usingSpecularMethod)
				this._pMethodSetup._iSpecularMethod.iActivate(this._pMethodSetup._iSpecularMethodVO, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
		{
			var i:number;
			var context:IContextStageGL = <IContextStageGL> stage.context;

			if (this._uvBufferIndex >= 0)
				context.activateBuffer(this._uvBufferIndex, renderable.getVertexData(SubGeometry.UV_DATA), renderable.getVertexOffset(SubGeometry.UV_DATA), SubGeometry.UV_FORMAT);

			if (this._secondaryUVBufferIndex >= 0)
				context.activateBuffer(this._secondaryUVBufferIndex, renderable.getVertexData(SubGeometry.SECONDARY_UV_DATA), renderable.getVertexOffset(SubGeometry.SECONDARY_UV_DATA), SubGeometry.SECONDARY_UV_FORMAT);

			if (this._normalBufferIndex >= 0)
				context.activateBuffer(this._normalBufferIndex, renderable.getVertexData(SubGeometry.NORMAL_DATA), renderable.getVertexOffset(SubGeometry.NORMAL_DATA), SubGeometry.NORMAL_FORMAT);


			if (this._tangentBufferIndex >= 0)
				context.activateBuffer(this._tangentBufferIndex, renderable.getVertexData(SubGeometry.TANGENT_DATA), renderable.getVertexOffset(SubGeometry.TANGENT_DATA), SubGeometry.TANGENT_FORMAT);

			if (this._animateUVs) {
				var uvTransform:Matrix = renderable.materialOwner.uvTransform.matrix;

				if (uvTransform) {
					this._pVertexConstantData[this._uvTransformIndex] = uvTransform.a;
					this._pVertexConstantData[this._uvTransformIndex + 1] = uvTransform.b;
					this._pVertexConstantData[this._uvTransformIndex + 3] = uvTransform.tx;
					this._pVertexConstantData[this._uvTransformIndex + 4] = uvTransform.c;
					this._pVertexConstantData[this._uvTransformIndex + 5] = uvTransform.d;
					this._pVertexConstantData[this._uvTransformIndex + 7] = uvTransform.ty;
				} else {
					this._pVertexConstantData[this._uvTransformIndex] = 1;
					this._pVertexConstantData[this._uvTransformIndex + 1] = 0;
					this._pVertexConstantData[this._uvTransformIndex + 3] = 0;
					this._pVertexConstantData[this._uvTransformIndex + 4] = 0;
					this._pVertexConstantData[this._uvTransformIndex + 5] = 1;
					this._pVertexConstantData[this._uvTransformIndex + 7] = 0;
				}
			}

			this._pAmbientLightR = this._pAmbientLightG = this._pAmbientLightB = 0;

			if (this.pUsesLights())
				this.pUpdateLightConstants();

			if (this.pUsesProbes())
				this.pUpdateProbes(stage);

			if (this._sceneMatrixIndex >= 0) {
				renderable.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(this._pVertexConstantData, this._sceneMatrixIndex, true);
				viewProjection.copyRawDataTo(this._pVertexConstantData, 0, true);
			} else {
				var matrix3D:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;

				matrix3D.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
				matrix3D.append(viewProjection);

				matrix3D.copyRawDataTo(this._pVertexConstantData, 0, true);
			}

			if (this._sceneNormalMatrixIndex >= 0)
				renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this._pVertexConstantData, this._sceneNormalMatrixIndex, false);

			if (this._usesNormals)
				this._pMethodSetup._iNormalMethod.iSetRenderState(this._pMethodSetup._iNormalMethodVO, renderable, stage, camera);

			var ambientMethod:AmbientBasicMethod = this._pMethodSetup._iAmbientMethod;
			ambientMethod._iLightAmbientR = this._pAmbientLightR;
			ambientMethod._iLightAmbientG = this._pAmbientLightG;
			ambientMethod._iLightAmbientB = this._pAmbientLightB;
			ambientMethod.iSetRenderState(this._pMethodSetup._iAmbientMethodVO, renderable, stage, camera);

			if (this._pMethodSetup._iShadowMethod)
				this._pMethodSetup._iShadowMethod.iSetRenderState(this._pMethodSetup._iShadowMethodVO, renderable, stage, camera);

			this._pMethodSetup._iDiffuseMethod.iSetRenderState(this._pMethodSetup._iDiffuseMethodVO, renderable, stage, camera);

			if (this._usingSpecularMethod)
				this._pMethodSetup._iSpecularMethod.iSetRenderState(this._pMethodSetup._iSpecularMethodVO, renderable, stage, camera);

			if (this._pMethodSetup._iColorTransformMethod)
				this._pMethodSetup._iColorTransformMethod.iSetRenderState(this._pMethodSetup._iColorTransformMethodVO, renderable, stage, camera);

			var methods:Array<MethodVOSet> = this._pMethodSetup._iMethods;
			var len:number = methods.length;

			for (i = 0; i < len; ++i) {
				var aset:MethodVOSet = methods[i];
				aset.method.iSetRenderState(aset.data, renderable, stage, camera);
			}

			context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.VERTEX, 0, this._pVertexConstantData, this._pNumUsedVertexConstants);
			context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.FRAGMENT, 0, this._pFragmentConstantData, this._pNumUsedFragmentConstants);

			context.activateBuffer(0, renderable.getVertexData(SubGeometry.POSITION_DATA), renderable.getVertexOffset(SubGeometry.POSITION_DATA), SubGeometry.POSITION_FORMAT);
			context.drawTriangles(context.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
		}

		/**
		 * Indicates whether the shader uses any light probes.
		 */
		public pUsesProbes():boolean
		{
			return this._pNumLightProbes > 0 && (( this._pDiffuseLightSources | this._pSpecularLightSources) & LightSources.PROBES) != 0;
		}

		/**
		 * Indicates whether the shader uses any lights.
		 */
		public pUsesLights():boolean
		{
			return ( this._pNumPointLights > 0 || this._pNumDirectionalLights > 0) && ((this._pDiffuseLightSources | this._pSpecularLightSources) & LightSources.LIGHTS) != 0;
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(stage:Stage)
		{
			super.iDeactivate(stage);

			if (this._usesNormals)
				this._pMethodSetup._iNormalMethod.iDeactivate(this._pMethodSetup._iNormalMethodVO, stage);

			this._pMethodSetup._iAmbientMethod.iDeactivate(this._pMethodSetup._iAmbientMethodVO, stage);

			if (this._pMethodSetup._iShadowMethod)
				this._pMethodSetup._iShadowMethod.iDeactivate(this._pMethodSetup._iShadowMethodVO, stage);

			this._pMethodSetup._iDiffuseMethod.iDeactivate(this._pMethodSetup._iDiffuseMethodVO, stage);

			if (this._usingSpecularMethod)
				this._pMethodSetup._iSpecularMethod.iDeactivate(this._pMethodSetup._iSpecularMethodVO, stage);
		}

		/**
		 * Define which light source types to use for specular reflections. This allows choosing between regular lights
		 * and/or light probes for specular reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get specularLightSources():number
		{
			return this._pSpecularLightSources;
		}

		public set specularLightSources(value:number)
		{
			this._pSpecularLightSources = value;
		}

		/**
		 * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
		 * and/or light probes for diffuse reflections.
		 *
		 * @see away3d.materials.LightSources
		 */
		public get diffuseLightSources():number
		{
			return this._pDiffuseLightSources;
		}

		public set diffuseLightSources(value:number)
		{
			this._pDiffuseLightSources = value;
		}
	}
}