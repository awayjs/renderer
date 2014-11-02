var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShadingMethodEvent = require("awayjs-renderergl/lib/events/ShadingMethodEvent");
var MethodVO = require("awayjs-renderergl/lib/materials/compilation/MethodVO");
var ShaderLightingObject = require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
var ShaderObjectBase = require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
var EffectColorTransformMethod = require("awayjs-renderergl/lib/materials/methods/EffectColorTransformMethod");
var MaterialPassBase = require("awayjs-renderergl/lib/materials/passes/MaterialPassBase");
var MaterialPassMode = require("awayjs-renderergl/lib/materials/passes/MaterialPassMode");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var TriangleMethodPass = (function (_super) {
    __extends(TriangleMethodPass, _super);
    /**
     * Creates a new CompiledPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function TriangleMethodPass(passMode) {
        var _this = this;
        if (passMode === void 0) { passMode = 0x03; }
        _super.call(this, passMode);
        this._iMethodVOs = new Array();
        this._numEffectDependencies = 0;
        this._onShaderInvalidatedDelegate = function (event) { return _this.onShaderInvalidated(event); };
    }
    /**
     * Factory method to create a concrete shader object for this pass.
     *
     * @param profile The compatibility profile used by the renderer.
     */
    TriangleMethodPass.prototype.createShaderObject = function (profile) {
        if (this._pLightPicker && (this.passMode & MaterialPassMode.LIGHTING))
            return new ShaderLightingObject(profile);
        return new ShaderObjectBase(profile);
    };
    /**
     * Initializes the unchanging constant data for this material.
     */
    TriangleMethodPass.prototype._iInitConstantData = function (shaderObject) {
        _super.prototype._iInitConstantData.call(this, shaderObject);
        //Updates method constants if they have changed.
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            this._iMethodVOs[i].method.iInitConstants(shaderObject, this._iMethodVOs[i]);
    };
    Object.defineProperty(TriangleMethodPass.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this.colorTransformMethod ? this.colorTransformMethod.colorTransform : null;
        },
        set: function (value) {
            if (value) {
                if (this.colorTransformMethod == null)
                    this.colorTransformMethod = new EffectColorTransformMethod();
                this.colorTransformMethod.colorTransform = value;
            }
            else if (!value) {
                if (this.colorTransformMethod)
                    this.colorTransformMethod = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodPass.prototype, "colorTransformMethod", {
        /**
         * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this._iColorTransformMethodVO ? this._iColorTransformMethodVO.method : null;
        },
        set: function (value) {
            if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.method == value)
                return;
            if (this._iColorTransformMethodVO) {
                this._removeDependency(this._iColorTransformMethodVO);
                this._iColorTransformMethodVO = null;
            }
            if (value) {
                this._iColorTransformMethodVO = new MethodVO(value);
                this._addDependency(this._iColorTransformMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    TriangleMethodPass.prototype._removeDependency = function (methodVO, effectsDependency) {
        if (effectsDependency === void 0) { effectsDependency = false; }
        var index = this._iMethodVOs.indexOf(methodVO);
        if (!effectsDependency)
            this._numEffectDependencies--;
        methodVO.method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
        this._iMethodVOs.splice(index, 1);
        this._pInvalidatePass();
    };
    TriangleMethodPass.prototype._addDependency = function (methodVO, effectsDependency, index) {
        if (effectsDependency === void 0) { effectsDependency = false; }
        if (index === void 0) { index = -1; }
        methodVO.method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
        if (effectsDependency) {
            if (index != -1)
                this._iMethodVOs.splice(index + this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
            else
                this._iMethodVOs.push(methodVO);
            this._numEffectDependencies++;
        }
        else {
            this._iMethodVOs.splice(this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
        }
        this._pInvalidatePass();
    };
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    TriangleMethodPass.prototype.addEffectMethod = function (method) {
        this._addDependency(new MethodVO(method), true);
    };
    Object.defineProperty(TriangleMethodPass.prototype, "numEffectMethods", {
        /**
         * The number of "effect" methods added to the material.
         */
        get: function () {
            return this._numEffectDependencies;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Queries whether a given effects method was added to the material.
     *
     * @param method The method to be queried.
     * @return true if the method was added to the material, false otherwise.
     */
    TriangleMethodPass.prototype.hasEffectMethod = function (method) {
        return this.getDependencyForMethod(method) != null;
    };
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    TriangleMethodPass.prototype.getEffectMethodAt = function (index) {
        if (index < 0 || index > this._numEffectDependencies - 1)
            return null;
        return this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies].method;
    };
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    TriangleMethodPass.prototype.addEffectMethodAt = function (method, index) {
        this._addDependency(new MethodVO(method), true, index);
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    TriangleMethodPass.prototype.removeEffectMethod = function (method) {
        var methodVO = this.getDependencyForMethod(method);
        if (methodVO != null)
            this._removeDependency(methodVO, true);
    };
    TriangleMethodPass.prototype.getDependencyForMethod = function (method) {
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i)
            if (this._iMethodVOs[i].method == method)
                return this._iMethodVOs[i];
        return null;
    };
    Object.defineProperty(TriangleMethodPass.prototype, "normalMethod", {
        /**
         * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
         */
        get: function () {
            return this._iNormalMethodVO ? this._iNormalMethodVO.method : null;
        },
        set: function (value) {
            if (this._iNormalMethodVO && this._iNormalMethodVO.method == value)
                return;
            if (this._iNormalMethodVO) {
                this._removeDependency(this._iNormalMethodVO);
                this._iNormalMethodVO = null;
            }
            if (value) {
                this._iNormalMethodVO = new MethodVO(value);
                this._addDependency(this._iNormalMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodPass.prototype, "ambientMethod", {
        /**
         * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
         */
        get: function () {
            return this._iAmbientMethodVO ? this._iAmbientMethodVO.method : null;
        },
        set: function (value) {
            if (this._iAmbientMethodVO && this._iAmbientMethodVO.method == value)
                return;
            if (this._iAmbientMethodVO) {
                this._removeDependency(this._iAmbientMethodVO);
                this._iAmbientMethodVO = null;
            }
            if (value) {
                this._iAmbientMethodVO = new MethodVO(value);
                this._addDependency(this._iAmbientMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodPass.prototype, "shadowMethod", {
        /**
         * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
         */
        get: function () {
            return this._iShadowMethodVO ? this._iShadowMethodVO.method : null;
        },
        set: function (value) {
            if (this._iShadowMethodVO && this._iShadowMethodVO.method == value)
                return;
            if (this._iShadowMethodVO) {
                this._removeDependency(this._iShadowMethodVO);
                this._iShadowMethodVO = null;
            }
            if (value) {
                this._iShadowMethodVO = new MethodVO(value);
                this._addDependency(this._iShadowMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodPass.prototype, "diffuseMethod", {
        /**
         * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
         */
        get: function () {
            return this._iDiffuseMethodVO ? this._iDiffuseMethodVO.method : null;
        },
        set: function (value) {
            if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.method == value)
                return;
            if (this._iDiffuseMethodVO) {
                this._removeDependency(this._iDiffuseMethodVO);
                this._iDiffuseMethodVO = null;
            }
            if (value) {
                this._iDiffuseMethodVO = new MethodVO(value);
                this._addDependency(this._iDiffuseMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodPass.prototype, "specularMethod", {
        /**
         * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
         */
        get: function () {
            return this._iSpecularMethodVO ? this._iSpecularMethodVO.method : null;
        },
        set: function (value) {
            if (this._iSpecularMethodVO && this._iSpecularMethodVO.method == value)
                return;
            if (this._iSpecularMethodVO) {
                this._removeDependency(this._iSpecularMethodVO);
                this._iSpecularMethodVO = null;
            }
            if (value) {
                this._iSpecularMethodVO = new MethodVO(value);
                this._addDependency(this._iSpecularMethodVO);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        while (this._iMethodVOs.length)
            this._removeDependency(this._iMethodVOs[0]);
        this._iMethodVOs = null;
    };
    /**
     * Called when any method's shader code is invalidated.
     */
    TriangleMethodPass.prototype.onShaderInvalidated = function (event) {
        this._pInvalidatePass();
    };
    // RENDER LOOP
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype._iActivate = function (pass, renderer, camera) {
        _super.prototype._iActivate.call(this, pass, renderer, camera);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iActivate(pass.shaderObject, methodVO, renderer.stage);
        }
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    TriangleMethodPass.prototype.setRenderState = function (pass, renderable, stage, camera, viewProjection) {
        _super.prototype.setRenderState.call(this, pass, renderable, stage, camera, viewProjection);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iSetRenderState(pass.shaderObject, methodVO, renderable, stage, camera);
        }
    };
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype._iDeactivate = function (pass, renderer) {
        _super.prototype._iDeactivate.call(this, pass, renderer);
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod)
                methodVO.method.iDeactivate(pass.shaderObject, methodVO, renderer.stage);
        }
    };
    TriangleMethodPass.prototype._iIncludeDependencies = function (shaderObject) {
        var i;
        var len = this._iMethodVOs.length;
        for (i = 0; i < len; ++i)
            this.setupAndCountDependencies(shaderObject, this._iMethodVOs[i]);
        for (i = 0; i < len; ++i)
            this._iMethodVOs[i].useMethod = this._iMethodVOs[i].method.iIsUsed(shaderObject);
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
    };
    /**
     * Counts the dependencies for a given method.
     * @param method The method to count the dependencies for.
     * @param methodVO The method's data for this material.
     */
    TriangleMethodPass.prototype.setupAndCountDependencies = function (shaderObject, methodVO) {
        methodVO.reset();
        methodVO.method.iInitVO(shaderObject, methodVO);
        if (methodVO.needsProjection)
            shaderObject.projectionDependencies++;
        if (methodVO.needsGlobalVertexPos) {
            shaderObject.globalPosDependencies++;
            if (methodVO.needsGlobalFragmentPos)
                shaderObject.usesGlobalPosFragment = true;
        }
        else if (methodVO.needsGlobalFragmentPos) {
            shaderObject.globalPosDependencies++;
            shaderObject.usesGlobalPosFragment = true;
        }
        if (methodVO.needsNormals)
            shaderObject.normalDependencies++;
        if (methodVO.needsTangents)
            shaderObject.tangentDependencies++;
        if (methodVO.needsView)
            shaderObject.viewDirDependencies++;
        if (methodVO.needsUV)
            shaderObject.uvDependencies++;
        if (methodVO.needsSecondaryUV)
            shaderObject.secondaryUVDependencies++;
    };
    TriangleMethodPass.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
            code += this._iAmbientMethodVO.method.iGetVertexCode(shaderObject, this._iAmbientMethodVO, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetVertexCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetVertexCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    TriangleMethodPass.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod) {
            code += this._iAmbientMethodVO.method.iGetFragmentCode(shaderObject, this._iAmbientMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            if (this._iAmbientMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iAmbientMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
            code += this._iDiffuseMethodVO.method.iGetFragmentPreLightingCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
            code += this._iSpecularMethodVO.method.iGetFragmentPreLightingCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);
        return code;
    };
    TriangleMethodPass.prototype._iGetPerLightDiffuseFragmentCode = function (shaderObject, lightDirReg, diffuseColorReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerLight(shaderObject, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPerLightSpecularFragmentCode = function (shaderObject, lightDirReg, specularColorReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerLight(shaderObject, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPerProbeDiffuseFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iDiffuseMethodVO.method.iGetFragmentCodePerProbe(shaderObject, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPerProbeSpecularFragmentCode = function (shaderObject, texReg, weightReg, registerCache, sharedRegisters) {
        return this._iSpecularMethodVO.method.iGetFragmentCodePerProbe(shaderObject, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetPostLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetVertexCode(shaderObject, this._iShadowMethodVO, registerCache, sharedRegisters);
        return code;
    };
    TriangleMethodPass.prototype._iGetPostLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        if (shaderObject.useAlphaPremultiplied && this._pEnableBlending) {
            code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" + "div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" + "sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" + "sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
        }
        if (this._iShadowMethodVO)
            code += this._iShadowMethodVO.method.iGetFragmentCode(shaderObject, this._iShadowMethodVO, sharedRegisters.shadowTarget, registerCache, sharedRegisters);
        if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod) {
            code += this._iDiffuseMethodVO.method.iGetFragmentPostLightingCode(shaderObject, this._iDiffuseMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            // resolve other dependencies as well?
            if (this._iDiffuseMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iDiffuseMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod) {
            code += this._iSpecularMethodVO.method.iGetFragmentPostLightingCode(shaderObject, this._iSpecularMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
            if (this._iSpecularMethodVO.needsNormals)
                registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
            if (this._iSpecularMethodVO.needsView)
                registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        }
        if (this._iShadowMethodVO)
            registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);
        return code;
    };
    /**
     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
     * dependencies exist.
     */
    TriangleMethodPass.prototype._pUsesTangentSpace = function (shaderObject) {
        if (shaderObject.usesProbes)
            return false;
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = 0; i < len; ++i) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod && !methodVO.method.iUsesTangentSpace())
                return false;
        }
        return true;
    };
    /**
     * Indicates whether or not normals are output in tangent space.
     */
    TriangleMethodPass.prototype._pOutputsTangentNormals = function (shaderObject) {
        return this._iNormalMethodVO.method.iOutputsTangentNormals();
    };
    /**
     * Indicates whether or not normals are output by the pass.
     */
    TriangleMethodPass.prototype._pOutputsNormals = function (shaderObject) {
        return this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
    };
    TriangleMethodPass.prototype._iGetNormalVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return this._iNormalMethodVO.method.iGetVertexCode(shaderObject, this._iNormalMethodVO, registerCache, sharedRegisters);
    };
    TriangleMethodPass.prototype._iGetNormalFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = this._iNormalMethodVO.method.iGetFragmentCode(shaderObject, this._iNormalMethodVO, sharedRegisters.normalFragment, registerCache, sharedRegisters);
        if (this._iNormalMethodVO.needsView)
            registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
        if (this._iNormalMethodVO.needsGlobalFragmentPos || this._iNormalMethodVO.needsGlobalVertexPos)
            registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);
        return code;
    };
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype._iGetVertexCode = function (shaderObject, regCache, sharedReg) {
        var code = "";
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = len - this._numEffectDependencies; i < len; i++) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod) {
                code += methodVO.method.iGetVertexCode(shaderObject, methodVO, regCache, sharedReg);
                if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos)
                    regCache.removeVertexTempUsage(sharedReg.globalPositionVertex);
            }
        }
        if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
            code += this._iColorTransformMethodVO.method.iGetVertexCode(shaderObject, this._iColorTransformMethodVO, regCache, sharedReg);
        return code;
    };
    /**
     * @inheritDoc
     */
    TriangleMethodPass.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
        var code = "";
        var alphaReg;
        if (this.preserveAlpha && this._numEffectDependencies > 0) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }
        var methodVO;
        var len = this._iMethodVOs.length;
        for (var i = len - this._numEffectDependencies; i < len; i++) {
            methodVO = this._iMethodVOs[i];
            if (methodVO.useMethod) {
                code += methodVO.method.iGetFragmentCode(shaderObject, methodVO, sharedReg.shadedTarget, regCache, sharedReg);
                if (methodVO.needsNormals)
                    regCache.removeFragmentTempUsage(sharedReg.normalFragment);
                if (methodVO.needsView)
                    regCache.removeFragmentTempUsage(sharedReg.viewDirFragment);
            }
        }
        if (this.preserveAlpha && this._numEffectDependencies > 0) {
            code += "mov " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }
        if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
            code += this._iColorTransformMethodVO.method.iGetFragmentCode(shaderObject, this._iColorTransformMethodVO, sharedReg.shadedTarget, regCache, sharedReg);
        return code;
    };
    /**
     * Indicates whether the shader uses any shadows.
     */
    TriangleMethodPass.prototype._iUsesShadows = function () {
        return Boolean(this._iShadowMethodVO || this.lightPicker.castingDirectionalLights.length > 0 || this.lightPicker.castingPointLights.length > 0);
    };
    /**
     * Indicates whether the shader uses any specular component.
     */
    TriangleMethodPass.prototype._iUsesSpecular = function () {
        return Boolean(this._iSpecularMethodVO);
    };
    return TriangleMethodPass;
})(MaterialPassBase);
module.exports = TriangleMethodPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvcGFzc2VzL3RyaWFuZ2xlbWV0aG9kcGFzcy50cyJdLCJuYW1lcyI6WyJUcmlhbmdsZU1ldGhvZFBhc3MiLCJUcmlhbmdsZU1ldGhvZFBhc3MuY29uc3RydWN0b3IiLCJUcmlhbmdsZU1ldGhvZFBhc3MuY3JlYXRlU2hhZGVyT2JqZWN0IiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pSW5pdENvbnN0YW50RGF0YSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5jb2xvclRyYW5zZm9ybSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5jb2xvclRyYW5zZm9ybU1ldGhvZCIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5fcmVtb3ZlRGVwZW5kZW5jeSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5fYWRkRGVwZW5kZW5jeSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5hZGRFZmZlY3RNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MubnVtRWZmZWN0TWV0aG9kcyIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5oYXNFZmZlY3RNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MuZ2V0RWZmZWN0TWV0aG9kQXQiLCJUcmlhbmdsZU1ldGhvZFBhc3MuYWRkRWZmZWN0TWV0aG9kQXQiLCJUcmlhbmdsZU1ldGhvZFBhc3MucmVtb3ZlRWZmZWN0TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RQYXNzLmdldERlcGVuZGVuY3lGb3JNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3Mubm9ybWFsTWV0aG9kIiwiVHJpYW5nbGVNZXRob2RQYXNzLmFtYmllbnRNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3Muc2hhZG93TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RQYXNzLmRpZmZ1c2VNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3Muc3BlY3VsYXJNZXRob2QiLCJUcmlhbmdsZU1ldGhvZFBhc3MuZGlzcG9zZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5vblNoYWRlckludmFsaWRhdGVkIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pQWN0aXZhdGUiLCJUcmlhbmdsZU1ldGhvZFBhc3Muc2V0UmVuZGVyU3RhdGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lEZWFjdGl2YXRlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pSW5jbHVkZURlcGVuZGVuY2llcyIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5zZXR1cEFuZENvdW50RGVwZW5kZW5jaWVzIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UHJlTGlnaHRpbmdWZXJ0ZXhDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UHJlTGlnaHRpbmdGcmFnbWVudENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodERpZmZ1c2VGcmFnbWVudENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXRQZXJMaWdodFNwZWN1bGFyRnJhZ21lbnRDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVEaWZmdXNlRnJhZ21lbnRDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0UGVyUHJvYmVTcGVjdWxhckZyYWdtZW50Q29kZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faUdldFBvc3RMaWdodGluZ1ZlcnRleENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXRQb3N0TGlnaHRpbmdGcmFnbWVudENvZGUiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX3BVc2VzVGFuZ2VudFNwYWNlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9wT3V0cHV0c1RhbmdlbnROb3JtYWxzIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9wT3V0cHV0c05vcm1hbHMiLCJUcmlhbmdsZU1ldGhvZFBhc3MuX2lHZXROb3JtYWxWZXJ0ZXhDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0Tm9ybWFsRnJhZ21lbnRDb2RlIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pR2V0VmVydGV4Q29kZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faUdldEZyYWdtZW50Q29kZSIsIlRyaWFuZ2xlTWV0aG9kUGFzcy5faVVzZXNTaGFkb3dzIiwiVHJpYW5nbGVNZXRob2RQYXNzLl9pVXNlc1NwZWN1bGFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFlQSxJQUFPLGtCQUFrQixXQUFjLGlEQUFpRCxDQUFDLENBQUM7QUFDMUYsSUFBTyxRQUFRLFdBQWlCLHNEQUFzRCxDQUFDLENBQUM7QUFDeEYsSUFBTyxvQkFBb0IsV0FBYyxrRUFBa0UsQ0FBQyxDQUFDO0FBQzdHLElBQU8sZ0JBQWdCLFdBQWUsOERBQThELENBQUMsQ0FBQztBQU10RyxJQUFPLDBCQUEwQixXQUFZLG9FQUFvRSxDQUFDLENBQUM7QUFPbkgsSUFBTyxnQkFBZ0IsV0FBZSx5REFBeUQsQ0FBQyxDQUFDO0FBQ2pHLElBQU8sZ0JBQWdCLFdBQWUseURBQXlELENBQUMsQ0FBQztBQUdqRyxBQUlBOzs7R0FERztJQUNHLGtCQUFrQjtJQUFTQSxVQUEzQkEsa0JBQWtCQSxVQUF5QkE7SUFjaERBOzs7O09BSUdBO0lBQ0hBLFNBbkJLQSxrQkFBa0JBLENBbUJYQSxRQUFzQkE7UUFuQm5DQyxpQkF3ckJDQTtRQXJxQllBLHdCQUFzQkEsR0FBdEJBLGVBQXNCQTtRQUVqQ0Esa0JBQU1BLFFBQVFBLENBQUNBLENBQUNBO1FBYlZBLGdCQUFXQSxHQUFtQkEsSUFBSUEsS0FBS0EsRUFBWUEsQ0FBQ0E7UUFFcERBLDJCQUFzQkEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFheENBLElBQUlBLENBQUNBLDRCQUE0QkEsR0FBR0EsVUFBQ0EsS0FBd0JBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBL0JBLENBQStCQSxDQUFDQTtJQUNuR0EsQ0FBQ0E7SUFFREQ7Ozs7T0FJR0E7SUFDSUEsK0NBQWtCQSxHQUF6QkEsVUFBMEJBLE9BQWNBO1FBRXZDRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxnQkFBZ0JBLENBQUNB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QUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHdCQUF3QkEsSUFBSUEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUM1RUEsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFlBQVlBLEVBQUVBLElBQUlBLENBQUNBLHdCQUF3QkEsRUFBRUEsU0FBU0EsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFekpBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBQ0R6Qzs7T0FFR0E7SUFDSUEsMENBQWFBLEdBQXBCQTtRQUVDMEMsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSx3QkFBd0JBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDakpBLENBQUNBO0lBRUQxQzs7T0FFR0E7SUFDSUEsMkNBQWNBLEdBQXJCQTtRQUVDMkMsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFDRjNDLHlCQUFDQTtBQUFEQSxDQXhyQkEsQUF3ckJDQSxFQXhyQmdDLGdCQUFnQixFQXdyQmhEO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9wYXNzZXMvVHJpYW5nbGVNZXRob2RQYXNzLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Db2xvclRyYW5zZm9ybVwiKTtcbmltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeFwiKTtcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgTWF0ZXJpYWxQYXNzRGF0YVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9NYXRlcmlhbFBhc3NEYXRhXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFNoYWRpbmdNZXRob2RFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9TaGFkaW5nTWV0aG9kRXZlbnRcIik7XG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyTGlnaHRpbmdPYmplY3RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyTGlnaHRpbmdPYmplY3RcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvQW1iaWVudEJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IERpZmZ1c2VCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0TWV0aG9kQmFzZVwiKTtcbmltcG9ydCBMaWdodGluZ01ldGhvZEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9MaWdodGluZ01ldGhvZEJhc2VcIik7XG5pbXBvcnQgTm9ybWFsQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9Ob3JtYWxCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dNYXBNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93TWFwTWV0aG9kQmFzZVwiKTtcbmltcG9ydCBTcGVjdWxhckJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBJTGlnaHRpbmdQYXNzU3RhZ2VHTFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9wYXNzZXMvSUxpZ2h0aW5nUGFzc1N0YWdlR0xcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9NYXRlcmlhbFBhc3NCYXNlXCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc01vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9wYXNzZXMvTWF0ZXJpYWxQYXNzTW9kZVwiKTtcbmltcG9ydCBSZW5kZXJlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcmVuZGVyL1JlbmRlcmVyQmFzZVwiKTtcblxuLyoqXG4gKiBDb21waWxlZFBhc3MgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgY29tcGlsZWQgcGFzcyBtYXRlcmlhbHMgcHJvdmlkZWQgYnkgQXdheTNELFxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cbiAqL1xuY2xhc3MgVHJpYW5nbGVNZXRob2RQYXNzIGV4dGVuZHMgTWF0ZXJpYWxQYXNzQmFzZSBpbXBsZW1lbnRzIElMaWdodGluZ1Bhc3NTdGFnZUdMXG57XG5cdHB1YmxpYyBfaUNvbG9yVHJhbnNmb3JtTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU5vcm1hbE1ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lBbWJpZW50TWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNoYWRvd01ldGhvZFZPOk1ldGhvZFZPO1xuXHRwdWJsaWMgX2lEaWZmdXNlTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaVNwZWN1bGFyTWV0aG9kVk86TWV0aG9kVk87XG5cdHB1YmxpYyBfaU1ldGhvZFZPczpBcnJheTxNZXRob2RWTz4gPSBuZXcgQXJyYXk8TWV0aG9kVk8+KCk7XG5cblx0cHVibGljIF9udW1FZmZlY3REZXBlbmRlbmNpZXM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGU6KGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudCkgPT4gdm9pZDtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBDb21waWxlZFBhc3Mgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gbWF0ZXJpYWwgVGhlIG1hdGVyaWFsIHRvIHdoaWNoIHRoaXMgcGFzcyBiZWxvbmdzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IocGFzc01vZGU6bnVtYmVyID0gMHgwMylcblx0e1xuXHRcdHN1cGVyKHBhc3NNb2RlKTtcblxuXHRcdHRoaXMuX29uU2hhZGVySW52YWxpZGF0ZWREZWxlZ2F0ZSA9IChldmVudDpTaGFkaW5nTWV0aG9kRXZlbnQpID0+IHRoaXMub25TaGFkZXJJbnZhbGlkYXRlZChldmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGEgY29uY3JldGUgc2hhZGVyIG9iamVjdCBmb3IgdGhpcyBwYXNzLlxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvZmlsZSBUaGUgY29tcGF0aWJpbGl0eSBwcm9maWxlIHVzZWQgYnkgdGhlIHJlbmRlcmVyLlxuXHQgKi9cblx0cHVibGljIGNyZWF0ZVNoYWRlck9iamVjdChwcm9maWxlOnN0cmluZyk6U2hhZGVyT2JqZWN0QmFzZVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BMaWdodFBpY2tlciAmJiAodGhpcy5wYXNzTW9kZSAmIE1hdGVyaWFsUGFzc01vZGUuTElHSFRJTkcpKVxuXHRcdFx0cmV0dXJuIG5ldyBTaGFkZXJMaWdodGluZ09iamVjdChwcm9maWxlKTtcblxuXHRcdHJldHVybiBuZXcgU2hhZGVyT2JqZWN0QmFzZShwcm9maWxlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplcyB0aGUgdW5jaGFuZ2luZyBjb25zdGFudCBkYXRhIGZvciB0aGlzIG1hdGVyaWFsLlxuXHQgKi9cblx0cHVibGljIF9pSW5pdENvbnN0YW50RGF0YShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHN1cGVyLl9pSW5pdENvbnN0YW50RGF0YShzaGFkZXJPYmplY3QpO1xuXG5cdFx0Ly9VcGRhdGVzIG1ldGhvZCBjb25zdGFudHMgaWYgdGhleSBoYXZlIGNoYW5nZWQuXG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdHRoaXMuX2lNZXRob2RWT3NbaV0ubWV0aG9kLmlJbml0Q29uc3RhbnRzKHNoYWRlck9iamVjdCwgdGhpcy5faU1ldGhvZFZPc1tpXSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIENvbG9yVHJhbnNmb3JtIG9iamVjdCB0byB0cmFuc2Zvcm0gdGhlIGNvbG91ciBvZiB0aGUgbWF0ZXJpYWwgd2l0aC4gRGVmYXVsdHMgdG8gbnVsbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgY29sb3JUcmFuc2Zvcm0oKTpDb2xvclRyYW5zZm9ybVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2Q/IHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QuY29sb3JUcmFuc2Zvcm0gOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBjb2xvclRyYW5zZm9ybSh2YWx1ZTpDb2xvclRyYW5zZm9ybSlcblx0e1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QgPT0gbnVsbClcblx0XHRcdFx0dGhpcy5jb2xvclRyYW5zZm9ybU1ldGhvZCA9IG5ldyBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZCgpO1xuXG5cdFx0XHR0aGlzLmNvbG9yVHJhbnNmb3JtTWV0aG9kLmNvbG9yVHJhbnNmb3JtID0gdmFsdWU7XG5cblx0XHR9IGVsc2UgaWYgKCF2YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QpXG5cdFx0XHRcdHRoaXMuY29sb3JUcmFuc2Zvcm1NZXRob2QgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Qgb2JqZWN0IHRvIHRyYW5zZm9ybSB0aGUgY29sb3VyIG9mIHRoZSBtYXRlcmlhbCB3aXRoLiBEZWZhdWx0cyB0byBudWxsLlxuXHQgKi9cblx0cHVibGljIGdldCBjb2xvclRyYW5zZm9ybU1ldGhvZCgpOkVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8/IDxFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZD4gdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgY29sb3JUcmFuc2Zvcm1NZXRob2QodmFsdWU6RWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8gJiYgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3JlbW92ZURlcGVuZGVuY3kobWV0aG9kVk86TWV0aG9kVk8sIGVmZmVjdHNEZXBlbmRlbmN5OmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmluZGV4T2YobWV0aG9kVk8pO1xuXG5cdFx0aWYgKCFlZmZlY3RzRGVwZW5kZW5jeSlcblx0XHRcdHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcy0tO1xuXG5cdFx0bWV0aG9kVk8ubWV0aG9kLnJlbW92ZUV2ZW50TGlzdGVuZXIoU2hhZGluZ01ldGhvZEV2ZW50LlNIQURFUl9JTlZBTElEQVRFRCwgdGhpcy5fb25TaGFkZXJJbnZhbGlkYXRlZERlbGVnYXRlKTtcblx0XHR0aGlzLl9pTWV0aG9kVk9zLnNwbGljZShpbmRleCwgMSk7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3MoKTtcblx0fVxuXG5cdHByaXZhdGUgX2FkZERlcGVuZGVuY3kobWV0aG9kVk86TWV0aG9kVk8sIGVmZmVjdHNEZXBlbmRlbmN5OmJvb2xlYW4gPSBmYWxzZSwgaW5kZXg6bnVtYmVyID0gLTEpXG5cdHtcblx0XHRtZXRob2RWTy5tZXRob2QuYWRkRXZlbnRMaXN0ZW5lcihTaGFkaW5nTWV0aG9kRXZlbnQuU0hBREVSX0lOVkFMSURBVEVELCB0aGlzLl9vblNoYWRlckludmFsaWRhdGVkRGVsZWdhdGUpO1xuXG5cdFx0aWYgKGVmZmVjdHNEZXBlbmRlbmN5KSB7XG5cdFx0XHRpZiAoaW5kZXggIT0gLTEpXG5cdFx0XHRcdHRoaXMuX2lNZXRob2RWT3Muc3BsaWNlKGluZGV4ICsgdGhpcy5faU1ldGhvZFZPcy5sZW5ndGggLSB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMsIDAsIG1ldGhvZFZPKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy5faU1ldGhvZFZPcy5wdXNoKG1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcysrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9pTWV0aG9kVk9zLnNwbGljZSh0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcywgMCwgbWV0aG9kVk8pO1xuXHRcdH1cblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGVuZHMgYW4gXCJlZmZlY3RcIiBzaGFkaW5nIG1ldGhvZCB0byB0aGUgc2hhZGVyLiBFZmZlY3QgbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZ1xuXHQgKiBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsIGV0Yy4gVGhlIG1ldGhvZCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlc3VsdCBvZiB0aGVcblx0ICogbWV0aG9kcyBhZGRlZCBwcmlvci5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXG5cdHtcblx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KG5ldyBNZXRob2RWTyhtZXRob2QpLCB0cnVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbnVtYmVyIG9mIFwiZWZmZWN0XCIgbWV0aG9kcyBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bUVmZmVjdE1ldGhvZHMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXM7XG5cdH1cblxuXHQvKipcblx0ICogUXVlcmllcyB3aGV0aGVyIGEgZ2l2ZW4gZWZmZWN0cyBtZXRob2Qgd2FzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbC5cblx0ICpcblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHF1ZXJpZWQuXG5cdCAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgbWV0aG9kIHdhcyBhZGRlZCB0byB0aGUgbWF0ZXJpYWwsIGZhbHNlIG90aGVyd2lzZS5cblx0ICovXG5cdHB1YmxpYyBoYXNFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldERlcGVuZGVuY3lGb3JNZXRob2QobWV0aG9kKSAhPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG1ldGhvZCBhZGRlZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG1ldGhvZCB0byByZXRyaWV2ZS5cblx0ICogQHJldHVybiBUaGUgbWV0aG9kIGF0IHRoZSBnaXZlbiBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBnZXRFZmZlY3RNZXRob2RBdChpbmRleDpudW1iZXIpOkVmZmVjdE1ldGhvZEJhc2Vcblx0e1xuXHRcdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgLSAxKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gPEVmZmVjdE1ldGhvZEJhc2U+IHRoaXMuX2lNZXRob2RWT3NbaW5kZXggKyB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aCAtIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llc10ubWV0aG9kO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYW4gZWZmZWN0IG1ldGhvZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IGFtb25nc3QgdGhlIG1ldGhvZHMgYWxyZWFkeSBhZGRlZCB0byB0aGUgbWF0ZXJpYWwuIEVmZmVjdFxuXHQgKiBtZXRob2RzIGFyZSB0aG9zZSB0aGF0IGRvIG5vdCBpbmZsdWVuY2UgdGhlIGxpZ2h0aW5nIGJ1dCBtb2R1bGF0ZSB0aGUgc2hhZGVkIGNvbG91ciwgdXNlZCBmb3IgZm9nLCBvdXRsaW5lcyxcblx0ICogZXRjLiBUaGUgbWV0aG9kIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2RzIHdpdGggYSBsb3dlciBpbmRleC5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2RBdChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSwgaW5kZXg6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fYWRkRGVwZW5kZW5jeShuZXcgTWV0aG9kVk8obWV0aG9kKSwgdHJ1ZSwgaW5kZXgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYW4gZWZmZWN0IG1ldGhvZCBmcm9tIHRoZSBtYXRlcmlhbC5cblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKVxuXHR7XG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPID0gdGhpcy5nZXREZXBlbmRlbmN5Rm9yTWV0aG9kKG1ldGhvZCk7XG5cblx0XHRpZiAobWV0aG9kVk8gIT0gbnVsbClcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kobWV0aG9kVk8sIHRydWUpO1xuXHR9XG5cblxuXHRwcml2YXRlIGdldERlcGVuZGVuY3lGb3JNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpOk1ldGhvZFZPXG5cdHtcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0aWYgKHRoaXMuX2lNZXRob2RWT3NbaV0ubWV0aG9kID09IG1ldGhvZClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2lNZXRob2RWT3NbaV07XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIHBlci1waXhlbCBub3JtYWxzLiBEZWZhdWx0cyB0byBOb3JtYWxCYXNpY01ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgbm9ybWFsTWV0aG9kKCk6Tm9ybWFsQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8/IDxOb3JtYWxCYXNpY01ldGhvZD4gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IG5vcm1hbE1ldGhvZCh2YWx1ZTpOb3JtYWxCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8gJiYgdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9pTm9ybWFsTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faU5vcm1hbE1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lOb3JtYWxNZXRob2RWTyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9pTm9ybWFsTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pTm9ybWFsTWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHRoYXQgcHJvdmlkZXMgdGhlIGFtYmllbnQgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBBbWJpZW50QmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFtYmllbnRNZXRob2QoKTpBbWJpZW50QmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPPyA8QW1iaWVudEJhc2ljTWV0aG9kPiB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZCA6IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFtYmllbnRNZXRob2QodmFsdWU6QW1iaWVudEJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gJiYgdGhpcy5faUFtYmllbnRNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTykge1xuXHRcdFx0dGhpcy5fcmVtb3ZlRGVwZW5kZW5jeSh0aGlzLl9pQW1iaWVudE1ldGhvZFZPKTtcblx0XHRcdHRoaXMuX2lBbWJpZW50TWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faUFtYmllbnRNZXRob2RWTyA9IG5ldyBNZXRob2RWTyh2YWx1ZSk7XG5cdFx0XHR0aGlzLl9hZGREZXBlbmRlbmN5KHRoaXMuX2lBbWJpZW50TWV0aG9kVk8pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIHNoYWRvd3MgY2FzdCBvbiB0aGlzIHN1cmZhY2UsIG9yIG51bGwgaWYgbm8gc2hhZG93cyBhcmUgdG8gYmUgcmVuZGVyZWQuIERlZmF1bHRzIHRvIG51bGwuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNoYWRvd01ldGhvZCgpOlNoYWRvd01hcE1ldGhvZEJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pU2hhZG93TWV0aG9kVk8/IDxTaGFkb3dNYXBNZXRob2RCYXNlPiB0aGlzLl9pU2hhZG93TWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2hhZG93TWV0aG9kKHZhbHVlOlNoYWRvd01hcE1ldGhvZEJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPICYmIHRoaXMuX2lTaGFkb3dNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPKSB7XG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lTaGFkb3dNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pU2hhZG93TWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faVNoYWRvd01ldGhvZFZPID0gbmV3IE1ldGhvZFZPKHZhbHVlKTtcblx0XHRcdHRoaXMuX2FkZERlcGVuZGVuY3kodGhpcy5faVNoYWRvd01ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBkaWZmdXNlIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gRGlmZnVzZUJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBkaWZmdXNlTWV0aG9kKCk6RGlmZnVzZUJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faURpZmZ1c2VNZXRob2RWTz8gPERpZmZ1c2VCYXNpY01ldGhvZD4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QgOiBudWxsO1xuXHR9XG5cblx0cHVibGljIHNldCBkaWZmdXNlTWV0aG9kKHZhbHVlOkRpZmZ1c2VCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPICYmIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faURpZmZ1c2VNZXRob2RWTyk7XG5cdFx0XHR0aGlzLl9pRGlmZnVzZU1ldGhvZFZPID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBzcGVjdWxhciBsaWdodGluZyBjb250cmlidXRpb24uIERlZmF1bHRzIHRvIFNwZWN1bGFyQmFzaWNNZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNwZWN1bGFyTWV0aG9kKCk6U3BlY3VsYXJCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPPyA8U3BlY3VsYXJCYXNpY01ldGhvZD4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kIDogbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJNZXRob2QodmFsdWU6U3BlY3VsYXJCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyAmJiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pIHtcblx0XHRcdHRoaXMuX3JlbW92ZURlcGVuZGVuY3kodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8pO1xuXHRcdFx0dGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gPSBuZXcgTWV0aG9kVk8odmFsdWUpO1xuXHRcdFx0dGhpcy5fYWRkRGVwZW5kZW5jeSh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRzdXBlci5kaXNwb3NlKCk7XG5cblx0XHR3aGlsZSAodGhpcy5faU1ldGhvZFZPcy5sZW5ndGgpXG5cdFx0XHR0aGlzLl9yZW1vdmVEZXBlbmRlbmN5KHRoaXMuX2lNZXRob2RWT3NbMF0pO1xuXG5cdFx0dGhpcy5faU1ldGhvZFZPcyA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gYW55IG1ldGhvZCdzIHNoYWRlciBjb2RlIGlzIGludmFsaWRhdGVkLlxuXHQgKi9cblx0cHJpdmF0ZSBvblNoYWRlckludmFsaWRhdGVkKGV2ZW50OlNoYWRpbmdNZXRob2RFdmVudClcblx0e1xuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzcygpO1xuXHR9XG5cblx0Ly8gUkVOREVSIExPT1BcblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUFjdGl2YXRlKHBhc3M6TWF0ZXJpYWxQYXNzRGF0YSwgcmVuZGVyZXI6UmVuZGVyZXJCYXNlLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0c3VwZXIuX2lBY3RpdmF0ZShwYXNzLCByZW5kZXJlciwgY2FtZXJhKTtcblxuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRtZXRob2RWTyA9IHRoaXMuX2lNZXRob2RWT3NbaV07XG5cdFx0XHRpZiAobWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0XHRtZXRob2RWTy5tZXRob2QuaUFjdGl2YXRlKHBhc3Muc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgcmVuZGVyZXIuc3RhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVuZGVyYWJsZVxuXHQgKiBAcGFyYW0gc3RhZ2Vcblx0ICogQHBhcmFtIGNhbWVyYVxuXHQgKi9cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHBhc3M6TWF0ZXJpYWxQYXNzRGF0YSwgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEsIHZpZXdQcm9qZWN0aW9uOk1hdHJpeDNEKVxuXHR7XG5cdFx0c3VwZXIuc2V0UmVuZGVyU3RhdGUocGFzcywgcmVuZGVyYWJsZSwgc3RhZ2UsIGNhbWVyYSwgdmlld1Byb2plY3Rpb24pO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRcdG1ldGhvZFZPLm1ldGhvZC5pU2V0UmVuZGVyU3RhdGUocGFzcy5zaGFkZXJPYmplY3QsIG1ldGhvZFZPLCByZW5kZXJhYmxlLCBzdGFnZSwgY2FtZXJhKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaURlYWN0aXZhdGUocGFzczpNYXRlcmlhbFBhc3NEYXRhLCByZW5kZXJlcjpSZW5kZXJlckJhc2UpXG5cdHtcblx0XHRzdXBlci5faURlYWN0aXZhdGUocGFzcywgcmVuZGVyZXIpO1xuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRcdG1ldGhvZFZPLm1ldGhvZC5pRGVhY3RpdmF0ZShwYXNzLnNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlbmRlcmVyLnN0YWdlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgX2lJbmNsdWRlRGVwZW5kZW5jaWVzKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdClcblx0e1xuXHRcdHZhciBpOm51bWJlcjtcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdHRoaXMuc2V0dXBBbmRDb3VudERlcGVuZGVuY2llcyhzaGFkZXJPYmplY3QsIHRoaXMuX2lNZXRob2RWT3NbaV0pO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0dGhpcy5faU1ldGhvZFZPc1tpXS51c2VNZXRob2QgPSB0aGlzLl9pTWV0aG9kVk9zW2ldLm1ldGhvZC5pSXNVc2VkKHNoYWRlck9iamVjdCk7XG5cblx0XHRzdXBlci5faUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0KTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIENvdW50cyB0aGUgZGVwZW5kZW5jaWVzIGZvciBhIGdpdmVuIG1ldGhvZC5cblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGNvdW50IHRoZSBkZXBlbmRlbmNpZXMgZm9yLlxuXHQgKiBAcGFyYW0gbWV0aG9kVk8gVGhlIG1ldGhvZCdzIGRhdGEgZm9yIHRoaXMgbWF0ZXJpYWwuXG5cdCAqL1xuXHRwcml2YXRlIHNldHVwQW5kQ291bnREZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0bWV0aG9kVk8ucmVzZXQoKTtcblxuXHRcdG1ldGhvZFZPLm1ldGhvZC5pSW5pdFZPKHNoYWRlck9iamVjdCwgbWV0aG9kVk8pO1xuXG5cdFx0aWYgKG1ldGhvZFZPLm5lZWRzUHJvamVjdGlvbilcblx0XHRcdHNoYWRlck9iamVjdC5wcm9qZWN0aW9uRGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNHbG9iYWxWZXJ0ZXhQb3MpIHtcblxuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xuXG5cdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNHbG9iYWxGcmFnbWVudFBvcylcblx0XHRcdFx0c2hhZGVyT2JqZWN0LnVzZXNHbG9iYWxQb3NGcmFnbWVudCA9IHRydWU7XG5cblx0XHR9IGVsc2UgaWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsRnJhZ21lbnRQb3MpIHtcblx0XHRcdHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMrKztcblx0XHRcdHNoYWRlck9iamVjdC51c2VzR2xvYmFsUG9zRnJhZ21lbnQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc05vcm1hbHMpXG5cdFx0XHRzaGFkZXJPYmplY3Qubm9ybWFsRGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNUYW5nZW50cylcblx0XHRcdHNoYWRlck9iamVjdC50YW5nZW50RGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0c2hhZGVyT2JqZWN0LnZpZXdEaXJEZXBlbmRlbmNpZXMrKztcblxuXHRcdGlmIChtZXRob2RWTy5uZWVkc1VWKVxuXHRcdFx0c2hhZGVyT2JqZWN0LnV2RGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAobWV0aG9kVk8ubmVlZHNTZWNvbmRhcnlVVilcblx0XHRcdHNoYWRlck9iamVjdC5zZWNvbmRhcnlVVkRlcGVuZGVuY2llcysrO1xuXHR9XG5cblx0cHVibGljIF9pR2V0UHJlTGlnaHRpbmdWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPICYmIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPICYmIHRoaXMuX2lTcGVjdWxhck1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFByZUxpZ2h0aW5nRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmICh0aGlzLl9pQW1iaWVudE1ldGhvZFZPICYmIHRoaXMuX2lBbWJpZW50TWV0aG9kVk8udXNlTWV0aG9kKSB7XG5cdFx0XHRjb2RlICs9IHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW1iaWVudE1ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0XHRpZiAodGhpcy5faUFtYmllbnRNZXRob2RWTy5uZWVkc05vcm1hbHMpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50KTtcblxuXHRcdFx0aWYgKHRoaXMuX2lBbWJpZW50TWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPICYmIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8udXNlTWV0aG9kKVxuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSg8U2hhZGVyTGlnaHRpbmdPYmplY3Q+IHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyAmJiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9ICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudFByZUxpZ2h0aW5nQ29kZSg8U2hhZGVyTGlnaHRpbmdPYmplY3Q+IHNoYWRlck9iamVjdCwgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldFBlckxpZ2h0RGlmZnVzZUZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIGxpZ2h0RGlyUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgZGlmZnVzZUNvbG9yUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudENvZGVQZXJMaWdodChzaGFkZXJPYmplY3QsIHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8sIGxpZ2h0RGlyUmVnLCBkaWZmdXNlQ29sb3JSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJMaWdodFNwZWN1bGFyRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbGlnaHREaXJSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBzcGVjdWxhckNvbG9yUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRDb2RlUGVyTGlnaHQoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgbGlnaHREaXJSZWcsIHNwZWN1bGFyQ29sb3JSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJQcm9iZURpZmZ1c2VGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCB0ZXhSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB3ZWlnaHRSZWc6c3RyaW5nLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm1ldGhvZCkuaUdldEZyYWdtZW50Q29kZVBlclByb2JlKHNoYWRlck9iamVjdCwgdGhpcy5faURpZmZ1c2VNZXRob2RWTywgdGV4UmVnLCB3ZWlnaHRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQZXJQcm9iZVNwZWN1bGFyRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgdGV4UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgd2VpZ2h0UmVnOnN0cmluZywgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8ubWV0aG9kKS5pR2V0RnJhZ21lbnRDb2RlUGVyUHJvYmUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgdGV4UmVnLCB3ZWlnaHRSZWcsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQb3N0TGlnaHRpbmdWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pU2hhZG93TWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faVNoYWRvd01ldGhvZFZPLCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRQb3N0TGlnaHRpbmdGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmIChzaGFkZXJPYmplY3QudXNlQWxwaGFQcmVtdWx0aXBsaWVkICYmIHRoaXMuX3BFbmFibGVCbGVuZGluZykge1xuXHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi53LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIi53LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5jb21tb25zICsgXCIuelxcblwiICtcblx0XHRcdFx0XCJkaXYgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy5zaGFkZWRUYXJnZXQgKyBcIiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIud1xcblwiICtcblx0XHRcdFx0XCJzdWIgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCIudywgXCIgKyBzaGFyZWRSZWdpc3RlcnMuY29tbW9ucyArIFwiLnpcXG5cIiArXG5cdFx0XHRcdFwic2F0IFwiICsgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCArIFwiLnh5eiwgXCIgKyBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0ICsgXCJcXG5cIjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faVNoYWRvd01ldGhvZFZPKVxuXHRcdFx0Y29kZSArPSB0aGlzLl9pU2hhZG93TWV0aG9kVk8ubWV0aG9kLmlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU2hhZG93TWV0aG9kVk8sIHNoYXJlZFJlZ2lzdGVycy5zaGFkb3dUYXJnZXQsIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cblx0XHRpZiAodGhpcy5faURpZmZ1c2VNZXRob2RWTyAmJiB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0Y29kZSArPSAoPExpZ2h0aW5nTWV0aG9kQmFzZT4gdGhpcy5faURpZmZ1c2VNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLCBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0XHQvLyByZXNvbHZlIG90aGVyIGRlcGVuZGVuY2llcyBhcyB3ZWxsP1xuXHRcdFx0aWYgKHRoaXMuX2lEaWZmdXNlTWV0aG9kVk8ubmVlZHNOb3JtYWxzKVxuXHRcdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5ub3JtYWxGcmFnbWVudCk7XG5cblx0XHRcdGlmICh0aGlzLl9pRGlmZnVzZU1ldGhvZFZPLm5lZWRzVmlldylcblx0XHRcdFx0cmVnaXN0ZXJDYWNoZS5yZW1vdmVGcmFnbWVudFRlbXBVc2FnZShzaGFyZWRSZWdpc3RlcnMudmlld0RpckZyYWdtZW50KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5faVNwZWN1bGFyTWV0aG9kVk8gJiYgdGhpcy5faVNwZWN1bGFyTWV0aG9kVk8udXNlTWV0aG9kKSB7XG5cdFx0XHRjb2RlICs9ICg8TGlnaHRpbmdNZXRob2RCYXNlPiB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5tZXRob2QpLmlHZXRGcmFnbWVudFBvc3RMaWdodGluZ0NvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pU3BlY3VsYXJNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLnNoYWRlZFRhcmdldCwgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0XHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5uZWVkc05vcm1hbHMpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50KTtcblx0XHRcdGlmICh0aGlzLl9pU3BlY3VsYXJNZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJGcmFnbWVudCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lTaGFkb3dNZXRob2RWTylcblx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnaXN0ZXJzLnNoYWRvd1RhcmdldCk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgYWxsb3dlZCBpbiB0YW5nZW50IHNwYWNlLiBUaGlzIGlzIG9ubHkgdGhlIGNhc2UgaWYgbm8gb2JqZWN0LXNwYWNlXG5cdCAqIGRlcGVuZGVuY2llcyBleGlzdC5cblx0ICovXG5cdHB1YmxpYyBfcFVzZXNUYW5nZW50U3BhY2Uoc2hhZGVyT2JqZWN0OlNoYWRlckxpZ2h0aW5nT2JqZWN0KTpib29sZWFuXG5cdHtcblx0XHRpZiAoc2hhZGVyT2JqZWN0LnVzZXNQcm9iZXMpXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR2YXIgbWV0aG9kVk86TWV0aG9kVk87XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9pTWV0aG9kVk9zLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0bWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZCAmJiAhbWV0aG9kVk8ubWV0aG9kLmlVc2VzVGFuZ2VudFNwYWNlKCkpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3Qgbm9ybWFscyBhcmUgb3V0cHV0IGluIHRhbmdlbnQgc3BhY2UuXG5cdCAqL1xuXHRwdWJsaWMgX3BPdXRwdXRzVGFuZ2VudE5vcm1hbHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiAoPE5vcm1hbEJhc2ljTWV0aG9kPiB0aGlzLl9pTm9ybWFsTWV0aG9kVk8ubWV0aG9kKS5pT3V0cHV0c1RhbmdlbnROb3JtYWxzKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IG5vcm1hbHMgYXJlIG91dHB1dCBieSB0aGUgcGFzcy5cblx0ICovXG5cdHB1YmxpYyBfcE91dHB1dHNOb3JtYWxzKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faU5vcm1hbE1ldGhvZFZPICYmIHRoaXMuX2lOb3JtYWxNZXRob2RWTy51c2VNZXRob2Q7XG5cdH1cblxuXG5cdHB1YmxpYyBfaUdldE5vcm1hbFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faU5vcm1hbE1ldGhvZFZPLm1ldGhvZC5pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lOb3JtYWxNZXRob2RWTywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblx0fVxuXG5cdHB1YmxpYyBfaUdldE5vcm1hbEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IHRoaXMuX2lOb3JtYWxNZXRob2RWTy5tZXRob2QuaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lOb3JtYWxNZXRob2RWTywgc2hhcmVkUmVnaXN0ZXJzLm5vcm1hbEZyYWdtZW50LCByZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnMpO1xuXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTy5uZWVkc1ZpZXcpXG5cdFx0XHRyZWdpc3RlckNhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyRnJhZ21lbnQpO1xuXG5cdFx0aWYgKHRoaXMuX2lOb3JtYWxNZXRob2RWTy5uZWVkc0dsb2JhbEZyYWdtZW50UG9zIHx8IHRoaXMuX2lOb3JtYWxNZXRob2RWTy5uZWVkc0dsb2JhbFZlcnRleFBvcylcblx0XHRcdHJlZ2lzdGVyQ2FjaGUucmVtb3ZlVmVydGV4VGVtcFVzYWdlKHNoYXJlZFJlZ2lzdGVycy5nbG9iYWxQb3NpdGlvblZlcnRleCk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXHRcdHZhciBtZXRob2RWTzpNZXRob2RWTztcblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX2lNZXRob2RWT3MubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gbGVuIC0gdGhpcy5fbnVtRWZmZWN0RGVwZW5kZW5jaWVzOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdG1ldGhvZFZPID0gdGhpcy5faU1ldGhvZFZPc1tpXTtcblx0XHRcdGlmIChtZXRob2RWTy51c2VNZXRob2QpIHtcblx0XHRcdFx0Y29kZSArPSBtZXRob2RWTy5tZXRob2QuaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgcmVnQ2FjaGUsIHNoYXJlZFJlZyk7XG5cblx0XHRcdFx0aWYgKG1ldGhvZFZPLm5lZWRzR2xvYmFsVmVydGV4UG9zIHx8IG1ldGhvZFZPLm5lZWRzR2xvYmFsRnJhZ21lbnRQb3MpXG5cdFx0XHRcdFx0cmVnQ2FjaGUucmVtb3ZlVmVydGV4VGVtcFVzYWdlKHNoYXJlZFJlZy5nbG9iYWxQb3NpdGlvblZlcnRleCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPICYmIHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLnVzZU1ldGhvZClcblx0XHRcdGNvZGUgKz0gdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8ubWV0aG9kLmlHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8sIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXHRcdHZhciBhbHBoYVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQ7XG5cblx0XHRpZiAodGhpcy5wcmVzZXJ2ZUFscGhhICYmIHRoaXMuX251bUVmZmVjdERlcGVuZGVuY2llcyA+IDApIHtcblx0XHRcdGFscGhhUmVnID0gcmVnQ2FjaGUuZ2V0RnJlZUZyYWdtZW50U2luZ2xlVGVtcCgpO1xuXHRcdFx0cmVnQ2FjaGUuYWRkRnJhZ21lbnRUZW1wVXNhZ2VzKGFscGhhUmVnLCAxKTtcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyBhbHBoYVJlZyArIFwiLCBcIiArIHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQgKyBcIi53XFxuXCI7XG5cdFx0fVxuXG5cdFx0dmFyIG1ldGhvZFZPOk1ldGhvZFZPO1xuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5faU1ldGhvZFZPcy5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSBsZW4gLSB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXM7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0bWV0aG9kVk8gPSB0aGlzLl9pTWV0aG9kVk9zW2ldO1xuXHRcdFx0aWYgKG1ldGhvZFZPLnVzZU1ldGhvZCkge1xuXHRcdFx0XHRjb2RlICs9IG1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQsIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xuXG5cdFx0XHRcdGlmIChtZXRob2RWTy5uZWVkc05vcm1hbHMpXG5cdFx0XHRcdFx0cmVnQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2Uoc2hhcmVkUmVnLm5vcm1hbEZyYWdtZW50KTtcblxuXHRcdFx0XHRpZiAobWV0aG9kVk8ubmVlZHNWaWV3KVxuXHRcdFx0XHRcdHJlZ0NhY2hlLnJlbW92ZUZyYWdtZW50VGVtcFVzYWdlKHNoYXJlZFJlZy52aWV3RGlyRnJhZ21lbnQpO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJlc2VydmVBbHBoYSAmJiB0aGlzLl9udW1FZmZlY3REZXBlbmRlbmNpZXMgPiAwKSB7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgc2hhcmVkUmVnLnNoYWRlZFRhcmdldCArIFwiLncsIFwiICsgYWxwaGFSZWcgKyBcIlxcblwiO1xuXHRcdFx0cmVnQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2UoYWxwaGFSZWcpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTyAmJiB0aGlzLl9pQ29sb3JUcmFuc2Zvcm1NZXRob2RWTy51c2VNZXRob2QpXG5cdFx0XHRjb2RlICs9IHRoaXMuX2lDb2xvclRyYW5zZm9ybU1ldGhvZFZPLm1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUNvbG9yVHJhbnNmb3JtTWV0aG9kVk8sIHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQsIHJlZ0NhY2hlLCBzaGFyZWRSZWcpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzaGFkZXIgdXNlcyBhbnkgc2hhZG93cy5cblx0ICovXG5cdHB1YmxpYyBfaVVzZXNTaGFkb3dzKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5faVNoYWRvd01ldGhvZFZPIHx8IHRoaXMubGlnaHRQaWNrZXIuY2FzdGluZ0RpcmVjdGlvbmFsTGlnaHRzLmxlbmd0aCA+IDAgfHwgdGhpcy5saWdodFBpY2tlci5jYXN0aW5nUG9pbnRMaWdodHMubGVuZ3RoID4gMCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNoYWRlciB1c2VzIGFueSBzcGVjdWxhciBjb21wb25lbnQuXG5cdCAqL1xuXHRwdWJsaWMgX2lVc2VzU3BlY3VsYXIoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9pU3BlY3VsYXJNZXRob2RWTyk7XG5cdH1cbn1cblxuZXhwb3J0ID0gVHJpYW5nbGVNZXRob2RQYXNzOyJdfQ==