///<reference path="../../_definitions.ts"/>

module away.materials
{

    /**
     * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
     * using material methods to define their appearance.
     */
    export class CompiledPass extends away.materials.MaterialPassBase
    {
        public _iPasses:away.materials.MaterialPassBase[];//Vector.<MaterialPassBase>;
        public _iPassesDirty:boolean;

        public _pSpecularLightSources:number = 0x01;
        public _pDiffuseLightSources:number = 0x03;

        private _vertexCode:string;
        private _fragmentLightCode:string;
        private _framentPostLightCode:string;

        public _pVertexConstantData:number[] = new Array<number>();//Vector.<Number>();
        public _pFragmentConstantData:number[] = new Array<number>();//new Vector.<Number>();
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
        private _lightProbeDiffuseIndices:number[] /*uint*/;
        public _pLightProbeSpecularIndices:number[] /*uint*/;

        public _pAmbientLightR:number;
        public _pAmbientLightG:number;
        public _pAmbientLightB:number;

        private _compiler:away.materials.ShaderCompiler;

        public _pMethodSetup:away.materials.ShaderMethodSetup;

        private _usingSpecularMethod:boolean;
        private _usesNormals:boolean;
        public _preserveAlpha:boolean = true;
        private _animateUVs:boolean;

        public _pNumPointLights:number;
        public _pNumDirectionalLights:number;
        public _pNumLightProbes:number;

        private _enableLightFallOff:boolean = true;

        private _forceSeparateMVP:boolean;

        /**
         * Creates a new CompiledPass object.
         * @param material The material to which this pass belongs.
         */
            constructor(material:away.materials.MaterialBase)
        {

            super();
            //away.Debug.throwPIR( "away.materials.CompiledaPass" , 'normalMethod' , 'implement dependency: BasicNormalMethod, BasicAmbientMethod, BasicDiffuseMethod, BasicSpecularMethod');

            this._pMaterial = material;

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
            {

                this.iInvalidateShaderProgram( true );//this.invalidateShaderProgram(true);

            }

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
        public iUpdateProgram(stage3DProxy:away.managers.Stage3DProxy)
        {
            this.reset(stage3DProxy.profile);
            super.iUpdateProgram(stage3DProxy);
        }

        /**
         * Resets the compilation state.
         *
         * @param profile The compatibility profile used by the renderer.
         */
        private reset(profile:string)
        {
            this.iInitCompiler( profile);

            this.pUpdateShaderProperties();//this.updateShaderProperties();
            this.initConstantData();

            this.pCleanUp();//this.cleanUp();
        }

        /**
         * Updates the amount of used register indices.
         */
        private updateUsedOffsets()
        {
            this._pNumUsedVertexConstants= this._compiler.numUsedVertexConstants;
            this._pNumUsedFragmentConstants = this._compiler.numUsedFragmentConstants;
            this._pNumUsedStreams= this._compiler.numUsedStreams;
            this._pNumUsedTextures = this._compiler.numUsedTextures;
            this._pNumUsedVaryings = this._compiler.numUsedVaryings;
            this._pNumUsedFragmentConstants = this._compiler.numUsedFragmentConstants;
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
            {

                this.pInitUVTransformData();//this.initUVTransformData();
            }

            if (this._pCameraPositionIndex >= 0)
            {

                this._pVertexConstantData[this._pCameraPositionIndex + 3] = 1;

            }

            this.pUpdateMethodConstants();//this.updateMethodConstants();

        }

        /**
         * Initializes the compiler for this pass.
         * @param profile The compatibility profile used by the renderer.
         */
        public iInitCompiler(profile:string)
        {
            this._compiler = this.pCreateCompiler(profile);
            this._compiler.forceSeperateMVP = this._forceSeparateMVP;
            this._compiler.numPointLights = this._pNumPointLights;
            this._compiler.numDirectionalLights = this._pNumDirectionalLights;
            this._compiler.numLightProbes =this. _pNumLightProbes;
            this._compiler.methodSetup = this._pMethodSetup;
            this._compiler.diffuseLightSources = this._pDiffuseLightSources;
            this._compiler.specularLightSources = this._pSpecularLightSources;
            this._compiler.setTextureSampling(this._pSmooth, this._pRepeat, this._pMipmap);
            this._compiler.setConstantDataBuffers(this._pVertexConstantData, this._pFragmentConstantData);
            this._compiler.animateUVs = this._animateUVs;
            this._compiler.alphaPremultiplied = this._pAlphaPremultiplied && this._pEnableBlending;
            this._compiler.preserveAlpha = this._preserveAlpha && this._pEnableBlending;
            this._compiler.enableLightFallOff = this._enableLightFallOff;
            this._compiler.compile();
        }

        /**
         * Factory method to create a concrete compiler object for this pass.
         * @param profile The compatibility profile used by the renderer.
         */
        public pCreateCompiler(profile:string):away.materials.ShaderCompiler
        {
            throw new away.errors.AbstractMethodError();
        }

        /**
         * Copies the shader's properties from the compiler.
         */
        public pUpdateShaderProperties()
        {
            this._pAnimatableAttributes = this._compiler.animatableAttributes;
            this._pAnimationTargetRegisters = this._compiler.animationTargetRegisters;
            this._vertexCode = this._compiler.vertexCode;
            this._fragmentLightCode = this._compiler.fragmentLightCode;
            this._framentPostLightCode = this._compiler.fragmentPostLightCode;
            this._pShadedTarget = this._compiler.shadedTarget;
            this._usingSpecularMethod = this._compiler.usingSpecularMethod;
            this._usesNormals = this._compiler.usesNormals;
            this._pNeedUVAnimation = this._compiler.needUVAnimation;
            this._pUVSource = this._compiler.UVSource;
            this._pUVTarget = this._compiler.UVTarget;

            this.pUpdateRegisterIndices();
            this.updateUsedOffsets();
        }

        /**
         * Updates the indices for various registers.
         */
        public pUpdateRegisterIndices()
        {
            this._uvBufferIndex = this._compiler.uvBufferIndex;
            this._uvTransformIndex = this._compiler.uvTransformIndex;
            this._secondaryUVBufferIndex = this._compiler.secondaryUVBufferIndex;
            this._normalBufferIndex = this._compiler.normalBufferIndex;
            this._tangentBufferIndex = this._compiler.tangentBufferIndex;
            this._pLightFragmentConstantIndex = this._compiler.lightFragmentConstantIndex;
            this._pCameraPositionIndex = this._compiler.cameraPositionIndex;
            this._commonsDataIndex = this._compiler.commonsDataIndex;
            this._sceneMatrixIndex = this._compiler.sceneMatrixIndex;
            this._sceneNormalMatrixIndex = this._compiler.sceneNormalMatrixIndex;
            this._pProbeWeightsIndex = this._compiler.probeWeightsIndex;
            this._lightProbeDiffuseIndices = this._compiler.lightProbeDiffuseIndices;
            this._pLightProbeSpecularIndices = this._compiler.lightProbeSpecularIndices;
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
            {

                return;

            }

            this._preserveAlpha = value;
            this.iInvalidateShaderProgram();//invalidateShaderProgram();

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

            if ((value && ! this._animateUVs) || (!value && this._animateUVs))
            {

                this.iInvalidateShaderProgram();

            }

        }

        /**
         * @inheritDoc
         */
        public set mipmap(value:boolean)
        {
            if (this._pMipmap == value)
                return;

            super.setMipMap( value ); //super.mipmap = value;
        }

        /**
         * The normal map to modulate the direction of the surface for each texel. The default normal method expects
         * tangent-space normal maps, but others could expect object-space maps.
         */
        public get normalMap():away.textures.Texture2DBase
        {
            return this._pMethodSetup._iNormalMethod.normalMap;
        }

        public set normalMap(value:away.textures.Texture2DBase)
        {

            this._pMethodSetup._iNormalMethod.normalMap = value;
        }

        /**
         * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
         */

        public get normalMethod():away.materials.BasicNormalMethod
        {
            return this._pMethodSetup.normalMethod;
        }

        public set normalMethod(value:away.materials.BasicNormalMethod)
        {
            this._pMethodSetup.normalMethod = value;
        }

        /**
         * The method that provides the ambient lighting contribution. Defaults to BasicAmbientMethod.
         */

        public get ambientMethod():away.materials.BasicAmbientMethod
        {
            return this._pMethodSetup.ambientMethod;
        }

        public set ambientMethod(value:away.materials.BasicAmbientMethod)
        {
            this._pMethodSetup.ambientMethod = value;
        }

        /**
         * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
         */

        public get shadowMethod():away.materials.ShadowMapMethodBase
        {
            return this._pMethodSetup.shadowMethod;
        }

        public set shadowMethod(value:away.materials.ShadowMapMethodBase)
        {
            this._pMethodSetup.shadowMethod = value;
        }

        /**
         * The method that provides the diffuse lighting contribution. Defaults to BasicDiffuseMethod.
         */
        public get diffuseMethod():away.materials.BasicDiffuseMethod
        {
            return this._pMethodSetup.diffuseMethod;
        }

        public set diffuseMethod(value:away.materials.BasicDiffuseMethod)
        {
            this._pMethodSetup.diffuseMethod = value;
        }

        /**
         * The method that provides the specular lighting contribution. Defaults to BasicSpecularMethod.
         */

        public get specularMethod():away.materials.BasicSpecularMethod
        {
            return this._pMethodSetup.specularMethod;
        }

        public set specularMethod(value:away.materials.BasicSpecularMethod)
        {
            this._pMethodSetup.specularMethod = value;
        }

        /**
         * Initializes the pass.
         */
        private init()
        {
            this._pMethodSetup = new away.materials.ShaderMethodSetup();

            this._pMethodSetup.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
        }

        /**
         * @inheritDoc
         */
        public dispose()
        {
            super.dispose();
            this._pMethodSetup.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
            this._pMethodSetup.dispose();
            this._pMethodSetup = null;
        }

        /**
         * @inheritDoc
         */
        public iInvalidateShaderProgram(updateMaterial:boolean = true)
        {
            var oldPasses : away.materials.MaterialPassBase[];//:Vector.<MaterialPassBase> = _passes;
            this._iPasses = new Array<away.materials.MaterialPassBase>();//= new Vector.<MaterialPassBase>();

            if (this._pMethodSetup)
            {

                this.pAddPassesFromMethods();//this.addPassesFromMethods();

            }


            if (!oldPasses || this._iPasses.length != oldPasses.length)
            {

                this._iPassesDirty = true;
                return;

            }

            for (var i:number = 0; i < this._iPasses.length; ++i)
            {
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
        public pAddPasses(passes:away.materials.MaterialPassBase[] ) //Vector.<MaterialPassBase>)
        {
            if (!passes)
            {

                return;

            }



            var len:number = passes.length;

            for (var i:number = 0; i < len; ++i)
            {

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
            this._compiler.dispose();
            this._compiler = null;

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
        public pUpdateProbes(stage3DProxy:away.managers.Stage3DProxy)
        {

        }

        /**
         * Called when any method's shader code is invalidated.
         */
        private onShaderInvalidated(event:away.events.ShadingMethodEvent)
        {
            this.iInvalidateShaderProgram();//invalidateShaderProgram();
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
            //TODO: AGAL <> GLSL conversion
            return this._fragmentLightCode + animatorCode + this._framentPostLightCode;

        }

        // RENDER LOOP

        /**
         * @inheritDoc
         */
        public iActivate(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
        {
            super.iActivate(stage3DProxy, camera);

            if (this._usesNormals)
            {

                this._pMethodSetup._iNormalMethod.iActivate(this._pMethodSetup._iNormalMethodVO, stage3DProxy);

            }

            this._pMethodSetup._iAmbientMethod.iActivate(this._pMethodSetup._iAmbientMethodVO, stage3DProxy);

            if (this._pMethodSetup._iShadowMethod)
            {

                this._pMethodSetup._iShadowMethod.iActivate(this._pMethodSetup._iShadowMethodVO, stage3DProxy);

            }

            this._pMethodSetup._iDiffuseMethod.iActivate(this._pMethodSetup._iDiffuseMethodVO, stage3DProxy);

            if (this._usingSpecularMethod)
            {

                this._pMethodSetup._iSpecularMethod.iActivate(this._pMethodSetup._iSpecularMethodVO, stage3DProxy);

            }

        }

        /**
         * @inheritDoc
         */
        public iRender(renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D)
        {
            var i:number;
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
            if (this._uvBufferIndex >= 0)
                renderable.activateUVBuffer(this._uvBufferIndex, stage3DProxy);

            if (this._secondaryUVBufferIndex >= 0)
                renderable.activateSecondaryUVBuffer(this._secondaryUVBufferIndex, stage3DProxy);

            if (this._normalBufferIndex >= 0)
                renderable.activateVertexNormalBuffer(this._normalBufferIndex, stage3DProxy);

            if (this._tangentBufferIndex >= 0)
                renderable.activateVertexTangentBuffer(this._tangentBufferIndex, stage3DProxy);


            if (this._animateUVs) {
                var uvTransform:away.geom.Matrix = renderable.uvTransform;

                if (uvTransform)
                {
                    this._pVertexConstantData[this._uvTransformIndex] = uvTransform.a;
                    this._pVertexConstantData[this._uvTransformIndex + 1] = uvTransform.b;
                    this._pVertexConstantData[this._uvTransformIndex + 3] = uvTransform.tx;
                    this._pVertexConstantData[this._uvTransformIndex + 4] = uvTransform.c;
                    this._pVertexConstantData[this._uvTransformIndex + 5] = uvTransform.d;
                    this._pVertexConstantData[this._uvTransformIndex + 7] = uvTransform.ty;
                }
                else
                {
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
            {

                this.pUpdateLightConstants();//this.updateLightConstants();

            }

            if (this.pUsesProbes())
            {

                this.pUpdateProbes(stage3DProxy);//this.updateProbes(stage3DProxy);

            }


            if (this._sceneMatrixIndex >= 0)
            {

                //renderable.getRenderSceneTransform(camera).copyRawDataTo( this._pVertexConstantData, this._sceneMatrixIndex, true);
                this._pVertexConstantData = renderable.getRenderSceneTransform(camera).copyRawDataTo( this._sceneMatrixIndex, true);
                //viewProjection.copyRawDataTo( this._pVertexConstantData, 0, true);
                this._pVertexConstantData = viewProjection.copyRawDataTo( 0, true);


            }
            else
            {
                var matrix3D:away.geom.Matrix3D = away.math.Matrix3DUtils.CALCULATION_MATRIX;

                matrix3D.copyFrom(renderable.getRenderSceneTransform(camera));
                matrix3D.append(viewProjection);

                //matrix3D.copyRawDataTo( this._pVertexConstantData, 0, true);
                this._pVertexConstantData = matrix3D.copyRawDataTo( 0, true);

            }

            if ( this._sceneNormalMatrixIndex >= 0){

                //renderable.inverseSceneTransform.copyRawDataTo(this._pVertexConstantData, this._sceneNormalMatrixIndex, false);
                this._pVertexConstantData = renderable.inverseSceneTransform.copyRawDataTo(this._sceneNormalMatrixIndex, false);

            }


            if (this._usesNormals)
            {

                this._pMethodSetup._iNormalMethod.iSetRenderState( this._pMethodSetup._iNormalMethodVO, renderable, stage3DProxy, camera);

            }

            //away.Debug.throwPIR( 'away.materials.CompiledPass' , 'iRender' , 'implement dependency: BasicAmbientMethod');

            var ambientMethod:away.materials.BasicAmbientMethod = this._pMethodSetup._iAmbientMethod;
            ambientMethod._iLightAmbientR = this._pAmbientLightR;
            ambientMethod._iLightAmbientG = this._pAmbientLightG;
            ambientMethod._iLightAmbientB = this._pAmbientLightB;
            ambientMethod.iSetRenderState(this._pMethodSetup._iAmbientMethodVO, renderable, stage3DProxy, camera);


            if (this._pMethodSetup._iShadowMethod)
                this._pMethodSetup._iShadowMethod.iSetRenderState(this._pMethodSetup._iShadowMethodVO, renderable, stage3DProxy, camera);

            this._pMethodSetup._iDiffuseMethod.iSetRenderState(this._pMethodSetup._iDiffuseMethodVO, renderable, stage3DProxy, camera);


            if (this._usingSpecularMethod)
                this._pMethodSetup._iSpecularMethod.iSetRenderState(this._pMethodSetup._iSpecularMethodVO, renderable, stage3DProxy, camera);

            if (this._pMethodSetup._iColorTransformMethod)
                this._pMethodSetup._iColorTransformMethod.iSetRenderState(this._pMethodSetup._iColorTransformMethodVO, renderable, stage3DProxy, camera);


            //away.Debug.throwPIR( 'away.materials.CompiledPass' , 'iRender' , 'implement dependency: MethodVOSet');

            //Vector.<MethodVOSet>
            var methods: away.materials.MethodVOSet[] = this._pMethodSetup._iMethods;
            var len:number = methods.length;

            for (i = 0; i < len; ++i)
            {

                var aset:MethodVOSet = methods[i];

                aset.method.iSetRenderState(aset.data, renderable, stage3DProxy, camera);

            }

            context.setProgramConstantsFromArray(away.display3D.Context3DProgramType.VERTEX, 0, this._pVertexConstantData, this._pNumUsedVertexConstants);
            context.setProgramConstantsFromArray(away.display3D.Context3DProgramType.FRAGMENT, 0, this._pFragmentConstantData, this._pNumUsedFragmentConstants);

            renderable.activateVertexBuffer(0, stage3DProxy);
            context.drawTriangles(renderable.getIndexBuffer(stage3DProxy), 0, renderable.numTriangles);
        }

        /**
         * Indicates whether the shader uses any light probes.
         */
        public pUsesProbes():boolean
        {
            return this._pNumLightProbes > 0 && (( this._pDiffuseLightSources | this._pSpecularLightSources) & away.materials.LightSources.PROBES) != 0;
        }

        /**
         * Indicates whether the shader uses any lights.
         */
        public pUsesLights():boolean
        {
            return ( this._pNumPointLights > 0 || this._pNumDirectionalLights > 0) && ((this._pDiffuseLightSources | this._pSpecularLightSources) & away.materials.LightSources.LIGHTS) != 0;
        }

        /**
         * @inheritDoc
         */
        public iDeactivate(stage3DProxy:away.managers.Stage3DProxy)
        {
            super.iDeactivate(stage3DProxy);

            if (this._usesNormals)
            {

                this._pMethodSetup._iNormalMethod.iDeactivate(this._pMethodSetup._iNormalMethodVO, stage3DProxy);

            }

            this._pMethodSetup._iAmbientMethod.iDeactivate( this._pMethodSetup._iAmbientMethodVO, stage3DProxy);

            if ( this._pMethodSetup._iShadowMethod)
            {

                this._pMethodSetup._iShadowMethod.iDeactivate(this._pMethodSetup._iShadowMethodVO, stage3DProxy);

            }

            this._pMethodSetup._iDiffuseMethod.iDeactivate(this._pMethodSetup._iDiffuseMethodVO, stage3DProxy);

            if (this._usingSpecularMethod)
            {

                this._pMethodSetup._iSpecularMethod.iDeactivate(this._pMethodSetup._iSpecularMethodVO, stage3DProxy);

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

// Fix for BOM issue
