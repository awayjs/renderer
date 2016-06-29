"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LightSources_1 = require("@awayjs/display/lib/materials/LightSources");
var ContextGLProfile_1 = require("@awayjs/stage/lib/base/ContextGLProfile");
var ShaderBase_1 = require("../shaders/ShaderBase");
var LightingCompiler_1 = require("../shaders/compilers/LightingCompiler");
/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
var LightingShader = (function (_super) {
    __extends(LightingShader, _super);
    /**
     * Creates a new MethodCompilerVO object.
     */
    function LightingShader(elementsClass, lightingPass, stage) {
        _super.call(this, elementsClass, lightingPass, stage);
        this._includeCasters = true;
        this._lightingPass = lightingPass;
    }
    LightingShader.prototype._iIncludeDependencies = function () {
        this.numPointLights = this._lightingPass.numPointLights;
        this.numDirectionalLights = this._lightingPass.numDirectionalLights;
        this.numLightProbes = this._lightingPass.numLightProbes;
        var numAllLights = this._lightingPass.numPointLights + this._lightingPass.numDirectionalLights;
        var numLightProbes = this._lightingPass.numLightProbes;
        var diffuseLightSources = this._lightingPass._iUsesDiffuse(this) ? this._lightingPass.diffuseLightSources : 0x00;
        var specularLightSources = this._lightingPass._iUsesSpecular(this) ? this._lightingPass.specularLightSources : 0x00;
        var combinedLightSources = diffuseLightSources | specularLightSources;
        this.usesLightFallOff = this._lightingPass.enableLightFallOff && this.profile != ContextGLProfile_1.ContextGLProfile.BASELINE_CONSTRAINED;
        this.usesCommonData = this.usesLightFallOff;
        this.numLights = numAllLights + numLightProbes;
        this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources_1.LightSources.LIGHTS) != 0;
        this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources_1.LightSources.PROBES) != 0;
        this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources_1.LightSources.LIGHTS) != 0;
        this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources_1.LightSources.PROBES) != 0;
        this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources_1.LightSources.LIGHTS) != 0;
        this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources_1.LightSources.PROBES) != 0;
        this.usesShadows = this._lightingPass._iUsesShadows(this);
        //IMPORTANT this must occur after shader lighting initialisation above
        _super.prototype._iIncludeDependencies.call(this);
    };
    /**
     * Factory method to create a concrete compiler object for this object
     *
     * @param materialPassVO
     * @returns {away.materials.LightingCompiler}
     */
    LightingShader.prototype.createCompiler = function (elementsClass, pass) {
        return new LightingCompiler_1.LightingCompiler(elementsClass, pass, this);
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    LightingShader.prototype._setRenderState = function (renderable, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, camera, viewProjection);
        if (this._lightingPass.lightPicker)
            this._lightingPass.lightPicker.collectLights(renderable.sourceEntity);
        if (this.usesLights)
            this.updateLights();
        if (this.usesProbes)
            this.updateProbes();
    };
    /**
     * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
     */
    LightingShader.prototype.updateLights = function () {
        var dirLight;
        var pointLight;
        var i = 0;
        var k = 0;
        var len;
        var dirPos;
        var total = 0;
        var numLightTypes = this.usesShadows ? 2 : 1;
        var l;
        var offset;
        this.ambientR = this.ambientG = this.ambientB = 0;
        l = this.lightVertexConstantIndex;
        k = this.lightFragmentConstantIndex;
        var cast = 0;
        var dirLights = this._lightingPass.lightPicker.directionalLights;
        offset = this._lightingPass.directionalLightsOffset;
        len = this._lightingPass.lightPicker.directionalLights.length;
        if (offset > len) {
            cast = 1;
            offset -= len;
        }
        for (; cast < numLightTypes; ++cast) {
            if (cast)
                dirLights = this._lightingPass.lightPicker.castingDirectionalLights;
            len = dirLights.length;
            if (len > this.numDirectionalLights)
                len = this.numDirectionalLights;
            for (i = 0; i < len; ++i) {
                dirLight = dirLights[offset + i];
                dirPos = dirLight.sceneDirection;
                this.ambientR += dirLight._iAmbientR;
                this.ambientG += dirLight._iAmbientG;
                this.ambientB += dirLight._iAmbientB;
                if (this.usesTangentSpace) {
                    var x = -dirPos.x;
                    var y = -dirPos.y;
                    var z = -dirPos.z;
                    this.vertexConstantData[l++] = this._pInverseSceneMatrix[0] * x + this._pInverseSceneMatrix[4] * y + this._pInverseSceneMatrix[8] * z;
                    this.vertexConstantData[l++] = this._pInverseSceneMatrix[1] * x + this._pInverseSceneMatrix[5] * y + this._pInverseSceneMatrix[9] * z;
                    this.vertexConstantData[l++] = this._pInverseSceneMatrix[2] * x + this._pInverseSceneMatrix[6] * y + this._pInverseSceneMatrix[10] * z;
                    this.vertexConstantData[l++] = 1;
                }
                else {
                    this.fragmentConstantData[k++] = -dirPos.x;
                    this.fragmentConstantData[k++] = -dirPos.y;
                    this.fragmentConstantData[k++] = -dirPos.z;
                    this.fragmentConstantData[k++] = 1;
                }
                this.fragmentConstantData[k++] = dirLight._iDiffuseR;
                this.fragmentConstantData[k++] = dirLight._iDiffuseG;
                this.fragmentConstantData[k++] = dirLight._iDiffuseB;
                this.fragmentConstantData[k++] = 1;
                this.fragmentConstantData[k++] = dirLight._iSpecularR;
                this.fragmentConstantData[k++] = dirLight._iSpecularG;
                this.fragmentConstantData[k++] = dirLight._iSpecularB;
                this.fragmentConstantData[k++] = 1;
                if (++total == this.numDirectionalLights) {
                    // break loop
                    i = len;
                    cast = numLightTypes;
                }
            }
        }
        // more directional supported than currently picked, need to clamp all to 0
        if (this.numDirectionalLights > total) {
            i = k + (this.numDirectionalLights - total) * 12;
            while (k < i)
                this.fragmentConstantData[k++] = 0;
        }
        total = 0;
        var pointLights = this._lightingPass.lightPicker.pointLights;
        offset = this._lightingPass.pointLightsOffset;
        len = this._lightingPass.lightPicker.pointLights.length;
        if (offset > len) {
            cast = 1;
            offset -= len;
        }
        else {
            cast = 0;
        }
        for (; cast < numLightTypes; ++cast) {
            if (cast)
                pointLights = this._lightingPass.lightPicker.castingPointLights;
            len = pointLights.length;
            for (i = 0; i < len; ++i) {
                pointLight = pointLights[offset + i];
                dirPos = pointLight.scenePosition;
                this.ambientR += pointLight._iAmbientR;
                this.ambientG += pointLight._iAmbientG;
                this.ambientB += pointLight._iAmbientB;
                if (this.usesTangentSpace) {
                    x = dirPos.x;
                    y = dirPos.y;
                    z = dirPos.z;
                    this.vertexConstantData[l++] = this._pInverseSceneMatrix[0] * x + this._pInverseSceneMatrix[4] * y + this._pInverseSceneMatrix[8] * z + this._pInverseSceneMatrix[12];
                    this.vertexConstantData[l++] = this._pInverseSceneMatrix[1] * x + this._pInverseSceneMatrix[5] * y + this._pInverseSceneMatrix[9] * z + this._pInverseSceneMatrix[13];
                    this.vertexConstantData[l++] = this._pInverseSceneMatrix[2] * x + this._pInverseSceneMatrix[6] * y + this._pInverseSceneMatrix[10] * z + this._pInverseSceneMatrix[14];
                    this.vertexConstantData[l++] = 1;
                }
                else if (!this.usesGlobalPosFragment) {
                    this.vertexConstantData[l++] = dirPos.x;
                    this.vertexConstantData[l++] = dirPos.y;
                    this.vertexConstantData[l++] = dirPos.z;
                    this.vertexConstantData[l++] = 1;
                }
                else {
                    this.fragmentConstantData[k++] = dirPos.x;
                    this.fragmentConstantData[k++] = dirPos.y;
                    this.fragmentConstantData[k++] = dirPos.z;
                    this.fragmentConstantData[k++] = 1;
                }
                this.fragmentConstantData[k++] = pointLight._iDiffuseR;
                this.fragmentConstantData[k++] = pointLight._iDiffuseG;
                this.fragmentConstantData[k++] = pointLight._iDiffuseB;
                var radius = pointLight._pRadius;
                this.fragmentConstantData[k++] = radius * radius;
                this.fragmentConstantData[k++] = pointLight._iSpecularR;
                this.fragmentConstantData[k++] = pointLight._iSpecularG;
                this.fragmentConstantData[k++] = pointLight._iSpecularB;
                this.fragmentConstantData[k++] = pointLight._pFallOffFactor;
                if (++total == this.numPointLights) {
                    // break loop
                    i = len;
                    cast = numLightTypes;
                }
            }
        }
        // more directional supported than currently picked, need to clamp all to 0
        if (this.numPointLights > total) {
            i = k + (total - this.numPointLights) * 12;
            for (; k < i; ++k)
                this.fragmentConstantData[k] = 0;
        }
    };
    /**
     * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
     */
    LightingShader.prototype.updateProbes = function () {
        var probe;
        var lightProbes = this._lightingPass.lightPicker.lightProbes;
        var weights = this._lightingPass.lightPicker.lightProbeWeights;
        var len = lightProbes.length - this._lightingPass.lightProbesOffset;
        var addDiff = this.usesProbesForDiffuse;
        var addSpec = this.usesProbesForSpecular;
        if (!(addDiff || addSpec))
            return;
        if (len > this.numLightProbes)
            len = this.numLightProbes;
        for (var i = 0; i < len; ++i) {
            probe = lightProbes[this._lightingPass.lightProbesOffset + i];
            if (addDiff)
                this._stage.getAbstraction(probe.diffuseMap).activate(this.lightProbeDiffuseIndices[i], probe.diffuseSampler.mipmap);
            if (addSpec)
                this._stage.getAbstraction(probe.specularMap).activate(this.lightProbeSpecularIndices[i], probe.diffuseSampler.mipmap);
        }
        for (i = 0; i < len; ++i)
            this.fragmentConstantData[this.probeWeightsIndex + i] = weights[this._lightingPass.lightProbesOffset + i];
    };
    return LightingShader;
}(ShaderBase_1.ShaderBase));
exports.LightingShader = LightingShader;
