var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var TriangleMaterialBase = require("awayjs-renderergl/lib/materials/TriangleMaterialBase");
var TriangleMaterialMode = require("awayjs-renderergl/lib/materials/TriangleMaterialMode");
var AmbientBasicMethod = require("awayjs-renderergl/lib/materials/methods/AmbientBasicMethod");
var DiffuseBasicMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseBasicMethod");
var NormalBasicMethod = require("awayjs-renderergl/lib/materials/methods/NormalBasicMethod");
var SpecularBasicMethod = require("awayjs-renderergl/lib/materials/methods/SpecularBasicMethod");
var MaterialPassMode = require("awayjs-renderergl/lib/materials/passes/MaterialPassMode");
var TriangleMethodPass = require("awayjs-renderergl/lib/materials/passes/TriangleMethodPass");
/**
 * TriangleMethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var TriangleMethodMaterial = (function (_super) {
    __extends(TriangleMethodMaterial, _super);
    function TriangleMethodMaterial(textureColor, smoothAlpha, repeat, mipmap) {
        if (textureColor === void 0) { textureColor = null; }
        if (smoothAlpha === void 0) { smoothAlpha = null; }
        if (repeat === void 0) { repeat = false; }
        if (mipmap === void 0) { mipmap = false; }
        _super.call(this);
        this._alphaBlending = false;
        this._alpha = 1;
        this._ambientMethod = new AmbientBasicMethod();
        this._diffuseMethod = new DiffuseBasicMethod();
        this._normalMethod = new NormalBasicMethod();
        this._specularMethod = new SpecularBasicMethod();
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._materialMode = TriangleMaterialMode.SINGLE_PASS;
        if (textureColor instanceof Texture2DBase) {
            this.texture = textureColor;
            this.smooth = (smoothAlpha == null) ? true : false;
            this.repeat = repeat;
            this.mipmap = mipmap;
        }
        else {
            this.color = (textureColor == null) ? 0xFFFFFF : Number(textureColor);
            this.alpha = (smoothAlpha == null) ? 1 : Number(smoothAlpha);
        }
    }
    Object.defineProperty(TriangleMethodMaterial.prototype, "materialMode", {
        get: function () {
            return this._materialMode;
        },
        set: function (value) {
            if (this._materialMode == value)
                return;
            this._materialMode = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "depthCompareMode", {
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        get: function () {
            return this._depthCompareMode;
        },
        set: function (value) {
            if (this._depthCompareMode == value)
                return;
            this._depthCompareMode = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "alpha", {
        /**
         * The alpha of the surface.
         */
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            if (this._alpha == value)
                return;
            this._alpha = value;
            if (this._colorTransform == null)
                this._colorTransform = new ColorTransform();
            this._colorTransform.alphaMultiplier = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this._screenPass.colorTransform;
        },
        set: function (value) {
            this._screenPass.colorTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "diffuseTexture", {
        /**
         * The texture object to use for the ambient colour.
         */
        get: function () {
            return this._diffuseMethod.texture;
        },
        set: function (value) {
            this._diffuseMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "ambientMethod", {
        /**
         * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
         */
        get: function () {
            return this._ambientMethod;
        },
        set: function (value) {
            if (this._ambientMethod == value)
                return;
            if (value && this._ambientMethod)
                value.copyFrom(this._ambientMethod);
            this._ambientMethod = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "shadowMethod", {
        /**
         * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
         */
        get: function () {
            return this._shadowMethod;
        },
        set: function (value) {
            if (this._shadowMethod == value)
                return;
            if (value && this._shadowMethod)
                value.copyFrom(this._shadowMethod);
            this._shadowMethod = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "diffuseMethod", {
        /**
         * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
         */
        get: function () {
            return this._diffuseMethod;
        },
        set: function (value) {
            if (this._diffuseMethod == value)
                return;
            if (value && this._diffuseMethod)
                value.copyFrom(this._diffuseMethod);
            this._diffuseMethod = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "specularMethod", {
        /**
         * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
         */
        get: function () {
            return this._specularMethod;
        },
        set: function (value) {
            if (this._specularMethod == value)
                return;
            if (value && this._specularMethod)
                value.copyFrom(this._specularMethod);
            this._specularMethod = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "normalMethod", {
        /**
         * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
         */
        get: function () {
            return this._normalMethod;
        },
        set: function (value) {
            if (this._normalMethod == value)
                return;
            if (value && this._normalMethod)
                value.copyFrom(this._normalMethod);
            this._normalMethod = value;
            this._pInvalidateScreenPasses();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
     * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
     * methods added prior.
     */
    TriangleMethodMaterial.prototype.addEffectMethod = function (method) {
        if (this._screenPass == null)
            this._screenPass = new TriangleMethodPass();
        this._screenPass.addEffectMethod(method);
        this._pInvalidateScreenPasses();
    };
    Object.defineProperty(TriangleMethodMaterial.prototype, "numEffectMethods", {
        /**
         * The number of "effect" methods added to the material.
         */
        get: function () {
            return this._screenPass ? this._screenPass.numEffectMethods : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Queries whether a given effect method was added to the material.
     *
     * @param method The method to be queried.
     * @return true if the method was added to the material, false otherwise.
     */
    TriangleMethodMaterial.prototype.hasEffectMethod = function (method) {
        return this._screenPass ? this._screenPass.hasEffectMethod(method) : false;
    };
    /**
     * Returns the method added at the given index.
     * @param index The index of the method to retrieve.
     * @return The method at the given index.
     */
    TriangleMethodMaterial.prototype.getEffectMethodAt = function (index) {
        if (this._screenPass == null)
            return null;
        return this._screenPass.getEffectMethodAt(index);
    };
    /**
     * Adds an effect method at the specified index amongst the methods already added to the material. Effect
     * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
     * etc. The method will be applied to the result of the methods with a lower index.
     */
    TriangleMethodMaterial.prototype.addEffectMethodAt = function (method, index) {
        if (this._screenPass == null)
            this._screenPass = new TriangleMethodPass();
        this._screenPass.addEffectMethodAt(method, index);
        this._pInvalidatePasses();
    };
    /**
     * Removes an effect method from the material.
     * @param method The method to be removed.
     */
    TriangleMethodMaterial.prototype.removeEffectMethod = function (method) {
        if (this._screenPass == null)
            return;
        this._screenPass.removeEffectMethod(method);
        // reconsider
        if (this._screenPass.numEffectMethods == 0)
            this._pInvalidatePasses();
    };
    Object.defineProperty(TriangleMethodMaterial.prototype, "normalMap", {
        /**
         * The normal map to modulate the direction of the surface for each texel. The default normal method expects
         * tangent-space normal maps, but others could expect object-space maps.
         */
        get: function () {
            return this._normalMethod.normalMap;
        },
        set: function (value) {
            this._normalMethod.normalMap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "specularMap", {
        /**
         * A specular map that defines the strength of specular reflections for each texel in the red channel,
         * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
         * specular and gloss maps from grayscale images, but correctly authored images are preferred.
         */
        get: function () {
            return this._specularMethod.texture;
        },
        set: function (value) {
            this._specularMethod.texture = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "gloss", {
        /**
         * The glossiness of the material (sharpness of the specular highlight).
         */
        get: function () {
            return this._specularMethod.gloss;
        },
        set: function (value) {
            this._specularMethod.gloss = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "ambient", {
        /**
         * The strength of the ambient reflection.
         */
        get: function () {
            return this._ambientMethod.ambient;
        },
        set: function (value) {
            this._ambientMethod.ambient = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "specular", {
        /**
         * The overall strength of the specular reflection.
         */
        get: function () {
            return this._specularMethod.specular;
        },
        set: function (value) {
            this._specularMethod.specular = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "ambientColor", {
        /**
         * The colour of the ambient reflection.
         */
        get: function () {
            return this._diffuseMethod.ambientColor;
        },
        set: function (value) {
            this._diffuseMethod.ambientColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "diffuseColor", {
        /**
         * The colour of the diffuse reflection.
         */
        get: function () {
            return this._diffuseMethod.diffuseColor;
        },
        set: function (value) {
            this._diffuseMethod.diffuseColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "specularColor", {
        /**
         * The colour of the specular reflection.
         */
        get: function () {
            return this._specularMethod.specularColor;
        },
        set: function (value) {
            this._specularMethod.specularColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "alphaBlending", {
        /**
         * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
         * example when using textures of foliage, consider using alphaThreshold instead.
         */
        get: function () {
            return this._alphaBlending;
        },
        set: function (value) {
            if (this._alphaBlending == value)
                return;
            this._alphaBlending = value;
            this._pInvalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    TriangleMethodMaterial.prototype._iUpdateMaterial = function () {
        if (this._pScreenPassesInvalid) {
            //Updates screen passes when they were found to be invalid.
            this._pScreenPassesInvalid = false;
            this.initPasses();
            this.setBlendAndCompareModes();
            this._pClearScreenPasses();
            if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
                if (this._casterLightPass)
                    this._pAddScreenPass(this._casterLightPass);
                if (this._nonCasterLightPasses)
                    for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
                        this._pAddScreenPass(this._nonCasterLightPasses[i]);
            }
            if (this._screenPass)
                this._pAddScreenPass(this._screenPass);
        }
    };
    /**
     * Initializes all the passes and their dependent passes.
     */
    TriangleMethodMaterial.prototype.initPasses = function () {
        // let the effects pass handle everything if there are no lights, when there are effect methods applied
        // after shading, or when the material mode is single pass.
        if (this.numLights == 0 || this.numEffectMethods > 0 || this._materialMode == TriangleMaterialMode.SINGLE_PASS)
            this.initEffectPass();
        else if (this._screenPass)
            this.removeEffectPass();
        // only use a caster light pass if shadows need to be rendered
        if (this._shadowMethod && this._materialMode == TriangleMaterialMode.MULTI_PASS)
            this.initCasterLightPass();
        else if (this._casterLightPass)
            this.removeCasterLightPass();
        // only use non caster light passes if there are lights that don't cast
        if (this.numNonCasters > 0 && this._materialMode == TriangleMaterialMode.MULTI_PASS)
            this.initNonCasterLightPasses();
        else if (this._nonCasterLightPasses)
            this.removeNonCasterLightPasses();
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    TriangleMethodMaterial.prototype.setBlendAndCompareModes = function () {
        var forceSeparateMVP = Boolean(this._casterLightPass || this._screenPass);
        // caster light pass is always first if it exists, hence it uses normal blending
        if (this._casterLightPass) {
            this._casterLightPass.forceSeparateMVP = forceSeparateMVP;
            this._casterLightPass.setBlendMode(BlendMode.NORMAL);
            this._casterLightPass.depthCompareMode = this._depthCompareMode;
        }
        if (this._nonCasterLightPasses) {
            var firstAdditiveIndex = 0;
            // if there's no caster light pass, the first non caster light pass will be the first
            // and should use normal blending
            if (!this._casterLightPass) {
                this._nonCasterLightPasses[0].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[0].setBlendMode(BlendMode.NORMAL);
                this._nonCasterLightPasses[0].depthCompareMode = this._depthCompareMode;
                firstAdditiveIndex = 1;
            }
            for (var i = firstAdditiveIndex; i < this._nonCasterLightPasses.length; ++i) {
                this._nonCasterLightPasses[i].forceSeparateMVP = forceSeparateMVP;
                this._nonCasterLightPasses[i].setBlendMode(BlendMode.ADD);
                this._nonCasterLightPasses[i].depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
            }
        }
        if (this._casterLightPass || this._nonCasterLightPasses) {
            //cannot be blended by blendmode property if multipass enabled
            this._pRequiresBlending = false;
            // there are light passes, so this should be blended in
            if (this._screenPass) {
                this._screenPass.passMode = MaterialPassMode.EFFECTS;
                this._screenPass.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
                this._screenPass.setBlendMode(BlendMode.LAYER);
                this._screenPass.forceSeparateMVP = forceSeparateMVP;
            }
        }
        else if (this._screenPass) {
            this._pRequiresBlending = (this._pBlendMode != BlendMode.NORMAL || this._alphaBlending || (this._colorTransform && this._colorTransform.alphaMultiplier < 1));
            // effects pass is the only pass, so it should just blend normally
            this._screenPass.passMode = MaterialPassMode.SUPER_SHADER;
            this._screenPass.depthCompareMode = this._depthCompareMode;
            this._screenPass.preserveAlpha = this._pRequiresBlending;
            this._screenPass.colorTransform = this._colorTransform;
            this._screenPass.setBlendMode((this._pBlendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._pBlendMode);
            this._screenPass.forceSeparateMVP = false;
        }
    };
    TriangleMethodMaterial.prototype.initCasterLightPass = function () {
        if (this._casterLightPass == null)
            this._casterLightPass = new TriangleMethodPass(MaterialPassMode.LIGHTING);
        this._casterLightPass.lightPicker = new StaticLightPicker([this._shadowMethod.castingLight]);
        this._casterLightPass.shadowMethod = this._shadowMethod;
        this._casterLightPass.diffuseMethod = this._diffuseMethod;
        this._casterLightPass.ambientMethod = this._ambientMethod;
        this._casterLightPass.normalMethod = this._normalMethod;
        this._casterLightPass.specularMethod = this._specularMethod;
    };
    TriangleMethodMaterial.prototype.removeCasterLightPass = function () {
        this._casterLightPass.dispose();
        this._pRemoveScreenPass(this._casterLightPass);
        this._casterLightPass = null;
    };
    TriangleMethodMaterial.prototype.initNonCasterLightPasses = function () {
        this.removeNonCasterLightPasses();
        var pass;
        var numDirLights = this._pLightPicker.numDirectionalLights;
        var numPointLights = this._pLightPicker.numPointLights;
        var numLightProbes = this._pLightPicker.numLightProbes;
        var dirLightOffset = 0;
        var pointLightOffset = 0;
        var probeOffset = 0;
        if (!this._casterLightPass) {
            numDirLights += this._pLightPicker.numCastingDirectionalLights;
            numPointLights += this._pLightPicker.numCastingPointLights;
        }
        this._nonCasterLightPasses = new Array();
        while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
            pass = new TriangleMethodPass(MaterialPassMode.LIGHTING);
            pass.includeCasters = this._shadowMethod == null;
            pass.directionalLightsOffset = dirLightOffset;
            pass.pointLightsOffset = pointLightOffset;
            pass.lightProbesOffset = probeOffset;
            pass.lightPicker = this._pLightPicker;
            pass.diffuseMethod = this._diffuseMethod;
            pass.ambientMethod = this._ambientMethod;
            pass.normalMethod = this._normalMethod;
            pass.specularMethod = this._specularMethod;
            this._nonCasterLightPasses.push(pass);
            dirLightOffset += pass.iNumDirectionalLights;
            pointLightOffset += pass.iNumPointLights;
            probeOffset += pass.iNumLightProbes;
        }
    };
    TriangleMethodMaterial.prototype.removeNonCasterLightPasses = function () {
        if (!this._nonCasterLightPasses)
            return;
        for (var i = 0; i < this._nonCasterLightPasses.length; ++i)
            this._pRemoveScreenPass(this._nonCasterLightPasses[i]);
        this._nonCasterLightPasses = null;
    };
    TriangleMethodMaterial.prototype.removeEffectPass = function () {
        if (this._screenPass.ambientMethod != this._ambientMethod)
            this._screenPass.ambientMethod.dispose();
        if (this._screenPass.diffuseMethod != this._diffuseMethod)
            this._screenPass.diffuseMethod.dispose();
        if (this._screenPass.specularMethod != this._specularMethod)
            this._screenPass.specularMethod.dispose();
        if (this._screenPass.normalMethod != this._normalMethod)
            this._screenPass.normalMethod.dispose();
        this._pRemoveScreenPass(this._screenPass);
        this._screenPass = null;
    };
    TriangleMethodMaterial.prototype.initEffectPass = function () {
        if (this._screenPass == null)
            this._screenPass = new TriangleMethodPass();
        if (this._materialMode == TriangleMaterialMode.SINGLE_PASS) {
            this._screenPass.ambientMethod = this._ambientMethod;
            this._screenPass.diffuseMethod = this._diffuseMethod;
            this._screenPass.specularMethod = this._specularMethod;
            this._screenPass.normalMethod = this._normalMethod;
            this._screenPass.shadowMethod = this._shadowMethod;
        }
        else if (this._materialMode == TriangleMaterialMode.MULTI_PASS) {
            if (this.numLights == 0) {
                this._screenPass.ambientMethod = this._ambientMethod;
            }
            else {
                this._screenPass.ambientMethod = null;
            }
            this._screenPass.preserveAlpha = false;
            this._screenPass.normalMethod = this._normalMethod;
        }
    };
    Object.defineProperty(TriangleMethodMaterial.prototype, "numLights", {
        /**
         * The maximum total number of lights provided by the light picker.
         */
        get: function () {
            return this._pLightPicker ? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights + this._pLightPicker.numCastingDirectionalLights + this._pLightPicker.numCastingPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleMethodMaterial.prototype, "numNonCasters", {
        /**
         * The amount of lights that don't cast shadows.
         */
        get: function () {
            return this._pLightPicker ? this._pLightPicker.numLightProbes + this._pLightPicker.numDirectionalLights + this._pLightPicker.numPointLights : 0;
        },
        enumerable: true,
        configurable: true
    });
    return TriangleMethodMaterial;
})(TriangleMaterialBase);
module.exports = TriangleMethodMaterial;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvdHJpYW5nbGVtZXRob2RtYXRlcmlhbC50cyJdLCJuYW1lcyI6WyJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5jb25zdHJ1Y3RvciIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwubWF0ZXJpYWxNb2RlIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5kZXB0aENvbXBhcmVNb2RlIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5hbHBoYSIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuY29sb3JUcmFuc2Zvcm0iLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5hbWJpZW50TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5zaGFkb3dNZXRob2QiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VNZXRob2QiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnNwZWN1bGFyTWV0aG9kIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5ub3JtYWxNZXRob2QiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmFkZEVmZmVjdE1ldGhvZCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwubnVtRWZmZWN0TWV0aG9kcyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuaGFzRWZmZWN0TWV0aG9kIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5nZXRFZmZlY3RNZXRob2RBdCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuYWRkRWZmZWN0TWV0aG9kQXQiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnJlbW92ZUVmZmVjdE1ldGhvZCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwubm9ybWFsTWFwIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5zcGVjdWxhck1hcCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuZ2xvc3MiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmFtYmllbnQiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnNwZWN1bGFyIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5hbWJpZW50Q29sb3IiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmRpZmZ1c2VDb2xvciIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuc3BlY3VsYXJDb2xvciIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuYWxwaGFCbGVuZGluZyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuX2lVcGRhdGVNYXRlcmlhbCIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuaW5pdFBhc3NlcyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuc2V0QmxlbmRBbmRDb21wYXJlTW9kZXMiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmluaXRDYXN0ZXJMaWdodFBhc3MiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLnJlbW92ZUNhc3RlckxpZ2h0UGFzcyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuaW5pdE5vbkNhc3RlckxpZ2h0UGFzc2VzIiwiVHJpYW5nbGVNZXRob2RNYXRlcmlhbC5yZW1vdmVOb25DYXN0ZXJMaWdodFBhc3NlcyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwucmVtb3ZlRWZmZWN0UGFzcyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwuaW5pdEVmZmVjdFBhc3MiLCJUcmlhbmdsZU1ldGhvZE1hdGVyaWFsLm51bUxpZ2h0cyIsIlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwubnVtTm9uQ2FzdGVycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxjQUFjLFdBQWMscUNBQXFDLENBQUMsQ0FBQztBQUMxRSxJQUFPLGFBQWEsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBRTVFLElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFFcEUsSUFBTyxpQkFBaUIsV0FBYSw2REFBNkQsQ0FBQyxDQUFDO0FBR3BHLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENB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QSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNyREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7UUFDakVBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaENBLElBQUlBLGtCQUFrQkEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7WUFFbENBLEFBRUFBLHFGQUZxRkE7WUFDckZBLGlDQUFpQ0E7WUFDakNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGdCQUFnQkEsR0FBR0EsZ0JBQWdCQSxDQUFDQTtnQkFDbEVBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzdEQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtnQkFDeEVBLGtCQUFrQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBO1lBR0RBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLGtCQUFrQkEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDcEZBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxnQkFBZ0JBLENBQUNBO2dCQUNsRUEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxD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LEdBQUdBLENBQUNBLENBQUNBO1FBQzVPQSxDQUFDQTs7O09BQUFwQztJQUtEQSxzQkFBWUEsaURBQWFBO1FBSHpCQTs7V0FFR0E7YUFDSEE7WUFFQ3FDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLEdBQUVBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLG9CQUFvQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEpBLENBQUNBOzs7T0FBQXJDO0lBQ0ZBLDZCQUFDQTtBQUFEQSxDQTdxQkEsQUE2cUJDQSxFQTdxQm9DLG9CQUFvQixFQTZxQnhEO0FBRUQsQUFBZ0MsaUJBQXZCLHNCQUFzQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9UcmlhbmdsZU1ldGhvZE1hdGVyaWFsLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vQ29sb3JUcmFuc2Zvcm1cIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5cbmltcG9ydCBCbGVuZE1vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvQmxlbmRNb2RlXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgU3RhdGljTGlnaHRQaWNrZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9TdGF0aWNMaWdodFBpY2tlclwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcblxuaW1wb3J0IFRyaWFuZ2xlTWF0ZXJpYWxCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBUcmlhbmdsZU1hdGVyaWFsTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNYXRlcmlhbE1vZGVcIik7XG5pbXBvcnQgQW1iaWVudEJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0FtYmllbnRCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlQmFzaWNNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdE1ldGhvZEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xuaW1wb3J0IE5vcm1hbEJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL05vcm1hbEJhc2ljTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd01hcE1ldGhvZEJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93TWFwTWV0aG9kQmFzZVwiKTtcbmltcG9ydCBTcGVjdWxhckJhc2ljTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9wYXNzZXMvTWF0ZXJpYWxQYXNzTW9kZVwiKTtcbmltcG9ydCBUcmlhbmdsZU1ldGhvZFBhc3NcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9UcmlhbmdsZU1ldGhvZFBhc3NcIik7XG5cbi8qKlxuICogVHJpYW5nbGVNZXRob2RNYXRlcmlhbCBmb3JtcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciB0aGUgZGVmYXVsdCBzaGFkZWQgbWF0ZXJpYWxzIHByb3ZpZGVkIGJ5IFN0YWdlLFxuICogdXNpbmcgbWF0ZXJpYWwgbWV0aG9kcyB0byBkZWZpbmUgdGhlaXIgYXBwZWFyYW5jZS5cbiAqL1xuY2xhc3MgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCBleHRlbmRzIFRyaWFuZ2xlTWF0ZXJpYWxCYXNlXG57XG5cdHByaXZhdGUgX2FscGhhQmxlbmRpbmc6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9hbHBoYTpudW1iZXIgPSAxO1xuXHRwcml2YXRlIF9jb2xvclRyYW5zZm9ybTpDb2xvclRyYW5zZm9ybTtcblx0cHJpdmF0ZSBfbWF0ZXJpYWxNb2RlOnN0cmluZztcblx0cHJpdmF0ZSBfY2FzdGVyTGlnaHRQYXNzOlRyaWFuZ2xlTWV0aG9kUGFzcztcblx0cHJpdmF0ZSBfbm9uQ2FzdGVyTGlnaHRQYXNzZXM6QXJyYXk8VHJpYW5nbGVNZXRob2RQYXNzPjtcblx0cHJpdmF0ZSBfc2NyZWVuUGFzczpUcmlhbmdsZU1ldGhvZFBhc3M7XG5cblx0cHJpdmF0ZSBfYW1iaWVudE1ldGhvZDpBbWJpZW50QmFzaWNNZXRob2QgPSBuZXcgQW1iaWVudEJhc2ljTWV0aG9kKCk7XG5cdHByaXZhdGUgX3NoYWRvd01ldGhvZDpTaGFkb3dNYXBNZXRob2RCYXNlO1xuXHRwcml2YXRlIF9kaWZmdXNlTWV0aG9kOkRpZmZ1c2VCYXNpY01ldGhvZCA9IG5ldyBEaWZmdXNlQmFzaWNNZXRob2QoKTtcblx0cHJpdmF0ZSBfbm9ybWFsTWV0aG9kOk5vcm1hbEJhc2ljTWV0aG9kID0gbmV3IE5vcm1hbEJhc2ljTWV0aG9kKCk7XG5cdHByaXZhdGUgX3NwZWN1bGFyTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBuZXcgU3BlY3VsYXJCYXNpY01ldGhvZCgpO1xuXG5cblx0cHJpdmF0ZSBfZGVwdGhDb21wYXJlTW9kZTpzdHJpbmcgPSBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSB1c2VkIGZvciB0aGUgbWF0ZXJpYWwncyBhbGJlZG8gY29sb3IuXG5cdCAqIEBwYXJhbSBzbW9vdGggSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRleHR1cmUgc2hvdWxkIGJlIGZpbHRlcmVkIHdoZW4gc2FtcGxlZC4gRGVmYXVsdHMgdG8gdHJ1ZS5cblx0ICogQHBhcmFtIHJlcGVhdCBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGV4dHVyZSBzaG91bGQgYmUgdGlsZWQgd2hlbiBzYW1wbGVkLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICogQHBhcmFtIG1pcG1hcCBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgYW55IHVzZWQgdGV4dHVyZXMgc2hvdWxkIHVzZSBtaXBtYXBwaW5nLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHRleHR1cmU/OlRleHR1cmUyREJhc2UsIHNtb290aD86Ym9vbGVhbiwgcmVwZWF0Pzpib29sZWFuLCBtaXBtYXA/OmJvb2xlYW4pO1xuXHRjb25zdHJ1Y3Rvcihjb2xvcj86bnVtYmVyLCBhbHBoYT86bnVtYmVyKTtcblx0Y29uc3RydWN0b3IodGV4dHVyZUNvbG9yOmFueSA9IG51bGwsIHNtb290aEFscGhhOmFueSA9IG51bGwsIHJlcGVhdDpib29sZWFuID0gZmFsc2UsIG1pcG1hcDpib29sZWFuID0gZmFsc2UpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fbWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuU0lOR0xFX1BBU1M7XG5cblx0XHRpZiAodGV4dHVyZUNvbG9yIGluc3RhbmNlb2YgVGV4dHVyZTJEQmFzZSkge1xuXHRcdFx0dGhpcy50ZXh0dXJlID0gPFRleHR1cmUyREJhc2U+IHRleHR1cmVDb2xvcjtcblxuXHRcdFx0dGhpcy5zbW9vdGggPSAoc21vb3RoQWxwaGEgPT0gbnVsbCk/IHRydWUgOiBmYWxzZTtcblx0XHRcdHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuXHRcdFx0dGhpcy5taXBtYXAgPSBtaXBtYXA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29sb3IgPSAodGV4dHVyZUNvbG9yID09IG51bGwpPyAweEZGRkZGRiA6IE51bWJlcih0ZXh0dXJlQ29sb3IpO1xuXHRcdFx0dGhpcy5hbHBoYSA9IChzbW9vdGhBbHBoYSA9PSBudWxsKT8gMSA6IE51bWJlcihzbW9vdGhBbHBoYSk7XG5cdFx0fVxuXHR9XG5cblxuXHRwdWJsaWMgZ2V0IG1hdGVyaWFsTW9kZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX21hdGVyaWFsTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbWF0ZXJpYWxNb2RlKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdGlmICh0aGlzLl9tYXRlcmlhbE1vZGUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9tYXRlcmlhbE1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGRlcHRoIGNvbXBhcmUgbW9kZSB1c2VkIHRvIHJlbmRlciB0aGUgcmVuZGVyYWJsZXMgdXNpbmcgdGhpcyBtYXRlcmlhbC5cblx0ICpcblx0ICogQHNlZSBhd2F5LnN0YWdlZ2wuQ29udGV4dEdMQ29tcGFyZU1vZGVcblx0ICovXG5cblx0cHVibGljIGdldCBkZXB0aENvbXBhcmVNb2RlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGVwdGhDb21wYXJlTW9kZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGVwdGhDb21wYXJlTW9kZSh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHRpZiAodGhpcy5fZGVwdGhDb21wYXJlTW9kZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2RlcHRoQ29tcGFyZU1vZGUgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFscGhhIG9mIHRoZSBzdXJmYWNlLlxuXHQgKi9cblx0cHVibGljIGdldCBhbHBoYSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FscGhhO1xuXHR9XG5cblx0cHVibGljIHNldCBhbHBoYSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodmFsdWUgPiAxKVxuXHRcdFx0dmFsdWUgPSAxO1xuXHRcdGVsc2UgaWYgKHZhbHVlIDwgMClcblx0XHRcdHZhbHVlID0gMDtcblxuXHRcdGlmICh0aGlzLl9hbHBoYSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2FscGhhID0gdmFsdWU7XG5cblx0XHRpZiAodGhpcy5fY29sb3JUcmFuc2Zvcm0gPT0gbnVsbClcblx0XHRcdHRoaXMuX2NvbG9yVHJhbnNmb3JtID0gbmV3IENvbG9yVHJhbnNmb3JtKCk7XG5cblx0XHR0aGlzLl9jb2xvclRyYW5zZm9ybS5hbHBoYU11bHRpcGxpZXIgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIENvbG9yVHJhbnNmb3JtIG9iamVjdCB0byB0cmFuc2Zvcm0gdGhlIGNvbG91ciBvZiB0aGUgbWF0ZXJpYWwgd2l0aC4gRGVmYXVsdHMgdG8gbnVsbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgY29sb3JUcmFuc2Zvcm0oKTpDb2xvclRyYW5zZm9ybVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NjcmVlblBhc3MuY29sb3JUcmFuc2Zvcm07XG5cdH1cblxuXHRwdWJsaWMgc2V0IGNvbG9yVHJhbnNmb3JtKHZhbHVlOkNvbG9yVHJhbnNmb3JtKVxuXHR7XG5cdFx0dGhpcy5fc2NyZWVuUGFzcy5jb2xvclRyYW5zZm9ybSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0ZXh0dXJlIG9iamVjdCB0byB1c2UgZm9yIHRoZSBhbWJpZW50IGNvbG91ci5cblx0ICovXG5cdHB1YmxpYyBnZXQgZGlmZnVzZVRleHR1cmUoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGlmZnVzZU1ldGhvZC50ZXh0dXJlO1xuXHR9XG5cblx0cHVibGljIHNldCBkaWZmdXNlVGV4dHVyZSh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHR7XG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZC50ZXh0dXJlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBhbWJpZW50IGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gQW1iaWVudEJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBhbWJpZW50TWV0aG9kKCk6QW1iaWVudEJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYW1iaWVudE1ldGhvZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYW1iaWVudE1ldGhvZCh2YWx1ZTpBbWJpZW50QmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5fYW1iaWVudE1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9hbWJpZW50TWV0aG9kKVxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fYW1iaWVudE1ldGhvZCk7XG5cblx0XHR0aGlzLl9hbWJpZW50TWV0aG9kID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVNjcmVlblBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgc2hhZG93cyBjYXN0IG9uIHRoaXMgc3VyZmFjZSwgb3IgbnVsbCBpZiBubyBzaGFkb3dzIGFyZSB0byBiZSByZW5kZXJlZC4gRGVmYXVsdHMgdG8gbnVsbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2hhZG93TWV0aG9kKCk6U2hhZG93TWFwTWV0aG9kQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NoYWRvd01ldGhvZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2hhZG93TWV0aG9kKHZhbHVlOlNoYWRvd01hcE1ldGhvZEJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5fc2hhZG93TWV0aG9kID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHZhbHVlICYmIHRoaXMuX3NoYWRvd01ldGhvZClcblx0XHRcdHZhbHVlLmNvcHlGcm9tKHRoaXMuX3NoYWRvd01ldGhvZCk7XG5cblx0XHR0aGlzLl9zaGFkb3dNZXRob2QgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BJbnZhbGlkYXRlU2NyZWVuUGFzc2VzKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBkaWZmdXNlIGxpZ2h0aW5nIGNvbnRyaWJ1dGlvbi4gRGVmYXVsdHMgdG8gRGlmZnVzZUJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBkaWZmdXNlTWV0aG9kKCk6RGlmZnVzZUJhc2ljTWV0aG9kXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGlmZnVzZU1ldGhvZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGlmZnVzZU1ldGhvZCh2YWx1ZTpEaWZmdXNlQmFzaWNNZXRob2QpXG5cdHtcblx0XHRpZiAodGhpcy5fZGlmZnVzZU1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9kaWZmdXNlTWV0aG9kKVxuXHRcdFx0dmFsdWUuY29weUZyb20odGhpcy5fZGlmZnVzZU1ldGhvZCk7XG5cblx0XHR0aGlzLl9kaWZmdXNlTWV0aG9kID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVNjcmVlblBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdGhhdCBwcm92aWRlcyB0aGUgc3BlY3VsYXIgbGlnaHRpbmcgY29udHJpYnV0aW9uLiBEZWZhdWx0cyB0byBTcGVjdWxhckJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhck1ldGhvZCgpOlNwZWN1bGFyQmFzaWNNZXRob2Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJNZXRob2QodmFsdWU6U3BlY3VsYXJCYXNpY01ldGhvZClcblx0e1xuXHRcdGlmICh0aGlzLl9zcGVjdWxhck1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9zcGVjdWxhck1ldGhvZClcblx0XHRcdHZhbHVlLmNvcHlGcm9tKHRoaXMuX3NwZWN1bGFyTWV0aG9kKTtcblxuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVNjcmVlblBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgdXNlZCB0byBnZW5lcmF0ZSB0aGUgcGVyLXBpeGVsIG5vcm1hbHMuIERlZmF1bHRzIHRvIE5vcm1hbEJhc2ljTWV0aG9kLlxuXHQgKi9cblx0cHVibGljIGdldCBub3JtYWxNZXRob2QoKTpOb3JtYWxCYXNpY01ldGhvZFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX25vcm1hbE1ldGhvZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgbm9ybWFsTWV0aG9kKHZhbHVlOk5vcm1hbEJhc2ljTWV0aG9kKVxuXHR7XG5cdFx0aWYgKHRoaXMuX25vcm1hbE1ldGhvZCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh2YWx1ZSAmJiB0aGlzLl9ub3JtYWxNZXRob2QpXG5cdFx0XHR2YWx1ZS5jb3B5RnJvbSh0aGlzLl9ub3JtYWxNZXRob2QpO1xuXG5cdFx0dGhpcy5fbm9ybWFsTWV0aG9kID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVNjcmVlblBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGVuZHMgYW4gXCJlZmZlY3RcIiBzaGFkaW5nIG1ldGhvZCB0byB0aGUgc2hhZGVyLiBFZmZlY3QgbWV0aG9kcyBhcmUgdGhvc2UgdGhhdCBkbyBub3QgaW5mbHVlbmNlIHRoZSBsaWdodGluZ1xuXHQgKiBidXQgbW9kdWxhdGUgdGhlIHNoYWRlZCBjb2xvdXIsIHVzZWQgZm9yIGZvZywgb3V0bGluZXMsIGV0Yy4gVGhlIG1ldGhvZCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHJlc3VsdCBvZiB0aGVcblx0ICogbWV0aG9kcyBhZGRlZCBwcmlvci5cblx0ICovXG5cdHB1YmxpYyBhZGRFZmZlY3RNZXRob2QobWV0aG9kOkVmZmVjdE1ldGhvZEJhc2UpXG5cdHtcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcyA9PSBudWxsKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcyA9IG5ldyBUcmlhbmdsZU1ldGhvZFBhc3MoKTtcblxuXHRcdHRoaXMuX3NjcmVlblBhc3MuYWRkRWZmZWN0TWV0aG9kKG1ldGhvZCk7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVNjcmVlblBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBudW1iZXIgb2YgXCJlZmZlY3RcIiBtZXRob2RzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbC5cblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtRWZmZWN0TWV0aG9kcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NjcmVlblBhc3M/IHRoaXMuX3NjcmVlblBhc3MubnVtRWZmZWN0TWV0aG9kcyA6IDA7XG5cdH1cblxuXHQvKipcblx0ICogUXVlcmllcyB3aGV0aGVyIGEgZ2l2ZW4gZWZmZWN0IG1ldGhvZCB3YXMgYWRkZWQgdG8gdGhlIG1hdGVyaWFsLlxuXHQgKlxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gYmUgcXVlcmllZC5cblx0ICogQHJldHVybiB0cnVlIGlmIHRoZSBtZXRob2Qgd2FzIGFkZGVkIHRvIHRoZSBtYXRlcmlhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQgKi9cblx0cHVibGljIGhhc0VmZmVjdE1ldGhvZChtZXRob2Q6RWZmZWN0TWV0aG9kQmFzZSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NjcmVlblBhc3M/IHRoaXMuX3NjcmVlblBhc3MuaGFzRWZmZWN0TWV0aG9kKG1ldGhvZCkgOiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBtZXRob2QgYWRkZWQgYXQgdGhlIGdpdmVuIGluZGV4LlxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBtZXRob2QgdG8gcmV0cmlldmUuXG5cdCAqIEByZXR1cm4gVGhlIG1ldGhvZCBhdCB0aGUgZ2l2ZW4gaW5kZXguXG5cdCAqL1xuXHRwdWJsaWMgZ2V0RWZmZWN0TWV0aG9kQXQoaW5kZXg6bnVtYmVyKTpFZmZlY3RNZXRob2RCYXNlXG5cdHtcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcyA9PSBudWxsKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gdGhpcy5fc2NyZWVuUGFzcy5nZXRFZmZlY3RNZXRob2RBdChpbmRleCk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhbiBlZmZlY3QgbWV0aG9kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggYW1vbmdzdCB0aGUgbWV0aG9kcyBhbHJlYWR5IGFkZGVkIHRvIHRoZSBtYXRlcmlhbC4gRWZmZWN0XG5cdCAqIG1ldGhvZHMgYXJlIHRob3NlIHRoYXQgZG8gbm90IGluZmx1ZW5jZSB0aGUgbGlnaHRpbmcgYnV0IG1vZHVsYXRlIHRoZSBzaGFkZWQgY29sb3VyLCB1c2VkIGZvciBmb2csIG91dGxpbmVzLFxuXHQgKiBldGMuIFRoZSBtZXRob2Qgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSByZXN1bHQgb2YgdGhlIG1ldGhvZHMgd2l0aCBhIGxvd2VyIGluZGV4LlxuXHQgKi9cblx0cHVibGljIGFkZEVmZmVjdE1ldGhvZEF0KG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlLCBpbmRleDpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcyA9PSBudWxsKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcyA9IG5ldyBUcmlhbmdsZU1ldGhvZFBhc3MoKTtcblxuXHRcdHRoaXMuX3NjcmVlblBhc3MuYWRkRWZmZWN0TWV0aG9kQXQobWV0aG9kLCBpbmRleCk7XG5cblx0XHR0aGlzLl9wSW52YWxpZGF0ZVBhc3NlcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYW4gZWZmZWN0IG1ldGhvZCBmcm9tIHRoZSBtYXRlcmlhbC5cblx0ICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlRWZmZWN0TWV0aG9kKG1ldGhvZDpFZmZlY3RNZXRob2RCYXNlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NjcmVlblBhc3MgPT0gbnVsbClcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3NjcmVlblBhc3MucmVtb3ZlRWZmZWN0TWV0aG9kKG1ldGhvZCk7XG5cblx0XHQvLyByZWNvbnNpZGVyXG5cdFx0aWYgKHRoaXMuX3NjcmVlblBhc3MubnVtRWZmZWN0TWV0aG9kcyA9PSAwKVxuXHRcdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgbm9ybWFsIG1hcCB0byBtb2R1bGF0ZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBzdXJmYWNlIGZvciBlYWNoIHRleGVsLiBUaGUgZGVmYXVsdCBub3JtYWwgbWV0aG9kIGV4cGVjdHNcblx0ICogdGFuZ2VudC1zcGFjZSBub3JtYWwgbWFwcywgYnV0IG90aGVycyBjb3VsZCBleHBlY3Qgb2JqZWN0LXNwYWNlIG1hcHMuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5vcm1hbE1hcCgpOlRleHR1cmUyREJhc2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9ub3JtYWxNZXRob2Qubm9ybWFsTWFwO1xuXHR9XG5cblx0cHVibGljIHNldCBub3JtYWxNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX25vcm1hbE1ldGhvZC5ub3JtYWxNYXAgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNwZWN1bGFyIG1hcCB0aGF0IGRlZmluZXMgdGhlIHN0cmVuZ3RoIG9mIHNwZWN1bGFyIHJlZmxlY3Rpb25zIGZvciBlYWNoIHRleGVsIGluIHRoZSByZWQgY2hhbm5lbCxcblx0ICogYW5kIHRoZSBnbG9zcyBmYWN0b3IgaW4gdGhlIGdyZWVuIGNoYW5uZWwuIFlvdSBjYW4gdXNlIFNwZWN1bGFyQml0bWFwVGV4dHVyZSBpZiB5b3Ugd2FudCB0byBlYXNpbHkgc2V0XG5cdCAqIHNwZWN1bGFyIGFuZCBnbG9zcyBtYXBzIGZyb20gZ3JheXNjYWxlIGltYWdlcywgYnV0IGNvcnJlY3RseSBhdXRob3JlZCBpbWFnZXMgYXJlIHByZWZlcnJlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJNYXAoKTpUZXh0dXJlMkRCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc3BlY3VsYXJNZXRob2QudGV4dHVyZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJNYXAodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0e1xuXHRcdHRoaXMuX3NwZWN1bGFyTWV0aG9kLnRleHR1cmUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZ2xvc3NpbmVzcyBvZiB0aGUgbWF0ZXJpYWwgKHNoYXJwbmVzcyBvZiB0aGUgc3BlY3VsYXIgaGlnaGxpZ2h0KS5cblx0ICovXG5cdHB1YmxpYyBnZXQgZ2xvc3MoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC5nbG9zcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgZ2xvc3ModmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2QuZ2xvc3MgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc3RyZW5ndGggb2YgdGhlIGFtYmllbnQgcmVmbGVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgYW1iaWVudCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FtYmllbnRNZXRob2QuYW1iaWVudDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgYW1iaWVudCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9hbWJpZW50TWV0aG9kLmFtYmllbnQgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgb3ZlcmFsbCBzdHJlbmd0aCBvZiB0aGUgc3BlY3VsYXIgcmVmbGVjdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc3BlY3VsYXJNZXRob2Quc3BlY3VsYXIgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBhbWJpZW50IHJlZmxlY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFtYmllbnRDb2xvcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2QuYW1iaWVudENvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBhbWJpZW50Q29sb3IodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZC5hbWJpZW50Q29sb3IgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBkaWZmdXNlIHJlZmxlY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRpZmZ1c2VDb2xvcigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2RpZmZ1c2VNZXRob2QuZGlmZnVzZUNvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBkaWZmdXNlQ29sb3IodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fZGlmZnVzZU1ldGhvZC5kaWZmdXNlQ29sb3IgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY29sb3VyIG9mIHRoZSBzcGVjdWxhciByZWZsZWN0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBzcGVjdWxhckNvbG9yKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc3BlY3VsYXJNZXRob2Quc3BlY3VsYXJDb2xvcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJDb2xvcih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zcGVjdWxhck1ldGhvZC5zcGVjdWxhckNvbG9yID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBtYXRlcmlhbCBoYXMgdHJhbnNwYXJlbmN5LiBJZiBiaW5hcnkgdHJhbnNwYXJlbmN5IGlzIHN1ZmZpY2llbnQsIGZvclxuXHQgKiBleGFtcGxlIHdoZW4gdXNpbmcgdGV4dHVyZXMgb2YgZm9saWFnZSwgY29uc2lkZXIgdXNpbmcgYWxwaGFUaHJlc2hvbGQgaW5zdGVhZC5cblx0ICovXG5cblx0cHVibGljIGdldCBhbHBoYUJsZW5kaW5nKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2FscGhhQmxlbmRpbmc7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGFscGhhQmxlbmRpbmcodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9hbHBoYUJsZW5kaW5nID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYWxwaGFCbGVuZGluZyA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEludmFsaWRhdGVQYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pVXBkYXRlTWF0ZXJpYWwoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BTY3JlZW5QYXNzZXNJbnZhbGlkKSB7XG5cdFx0XHQvL1VwZGF0ZXMgc2NyZWVuIHBhc3NlcyB3aGVuIHRoZXkgd2VyZSBmb3VuZCB0byBiZSBpbnZhbGlkLlxuXHRcdFx0dGhpcy5fcFNjcmVlblBhc3Nlc0ludmFsaWQgPSBmYWxzZTtcblxuXHRcdFx0dGhpcy5pbml0UGFzc2VzKCk7XG5cblx0XHRcdHRoaXMuc2V0QmxlbmRBbmRDb21wYXJlTW9kZXMoKTtcblxuXHRcdFx0dGhpcy5fcENsZWFyU2NyZWVuUGFzc2VzKCk7XG5cblx0XHRcdGlmICh0aGlzLl9tYXRlcmlhbE1vZGUgPT0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUykge1xuXHRcdFx0XHRpZiAodGhpcy5fY2FzdGVyTGlnaHRQYXNzKVxuXHRcdFx0XHRcdHRoaXMuX3BBZGRTY3JlZW5QYXNzKHRoaXMuX2Nhc3RlckxpZ2h0UGFzcyk7XG5cblx0XHRcdFx0aWYgKHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzKVxuXHRcdFx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzLmxlbmd0aDsgKytpKVxuXHRcdFx0XHRcdFx0dGhpcy5fcEFkZFNjcmVlblBhc3ModGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXNbaV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcylcblx0XHRcdFx0dGhpcy5fcEFkZFNjcmVlblBhc3ModGhpcy5fc2NyZWVuUGFzcyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIGFsbCB0aGUgcGFzc2VzIGFuZCB0aGVpciBkZXBlbmRlbnQgcGFzc2VzLlxuXHQgKi9cblx0cHJpdmF0ZSBpbml0UGFzc2VzKClcblx0e1xuXHRcdC8vIGxldCB0aGUgZWZmZWN0cyBwYXNzIGhhbmRsZSBldmVyeXRoaW5nIGlmIHRoZXJlIGFyZSBubyBsaWdodHMsIHdoZW4gdGhlcmUgYXJlIGVmZmVjdCBtZXRob2RzIGFwcGxpZWRcblx0XHQvLyBhZnRlciBzaGFkaW5nLCBvciB3aGVuIHRoZSBtYXRlcmlhbCBtb2RlIGlzIHNpbmdsZSBwYXNzLlxuXHRcdGlmICh0aGlzLm51bUxpZ2h0cyA9PSAwIHx8IHRoaXMubnVtRWZmZWN0TWV0aG9kcyA+IDAgfHwgdGhpcy5fbWF0ZXJpYWxNb2RlID09IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLlNJTkdMRV9QQVNTKVxuXHRcdFx0dGhpcy5pbml0RWZmZWN0UGFzcygpO1xuXHRcdGVsc2UgaWYgKHRoaXMuX3NjcmVlblBhc3MpXG5cdFx0XHR0aGlzLnJlbW92ZUVmZmVjdFBhc3MoKTtcblxuXHRcdC8vIG9ubHkgdXNlIGEgY2FzdGVyIGxpZ2h0IHBhc3MgaWYgc2hhZG93cyBuZWVkIHRvIGJlIHJlbmRlcmVkXG5cdFx0aWYgKHRoaXMuX3NoYWRvd01ldGhvZCAmJiB0aGlzLl9tYXRlcmlhbE1vZGUgPT0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUylcblx0XHRcdHRoaXMuaW5pdENhc3RlckxpZ2h0UGFzcygpO1xuXHRcdGVsc2UgaWYgKHRoaXMuX2Nhc3RlckxpZ2h0UGFzcylcblx0XHRcdHRoaXMucmVtb3ZlQ2FzdGVyTGlnaHRQYXNzKCk7XG5cblx0XHQvLyBvbmx5IHVzZSBub24gY2FzdGVyIGxpZ2h0IHBhc3NlcyBpZiB0aGVyZSBhcmUgbGlnaHRzIHRoYXQgZG9uJ3QgY2FzdFxuXHRcdGlmICh0aGlzLm51bU5vbkNhc3RlcnMgPiAwICYmIHRoaXMuX21hdGVyaWFsTW9kZSA9PSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTKVxuXHRcdFx0dGhpcy5pbml0Tm9uQ2FzdGVyTGlnaHRQYXNzZXMoKTtcblx0XHRlbHNlIGlmICh0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlcylcblx0XHRcdHRoaXMucmVtb3ZlTm9uQ2FzdGVyTGlnaHRQYXNzZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHVwIHRoZSB2YXJpb3VzIGJsZW5kaW5nIG1vZGVzIGZvciBhbGwgc2NyZWVuIHBhc3NlcywgYmFzZWQgb24gd2hldGhlciBvciBub3QgdGhlcmUgYXJlIHByZXZpb3VzIHBhc3Nlcy5cblx0ICovXG5cdHByaXZhdGUgc2V0QmxlbmRBbmRDb21wYXJlTW9kZXMoKVxuXHR7XG5cdFx0dmFyIGZvcmNlU2VwYXJhdGVNVlA6Ym9vbGVhbiA9IEJvb2xlYW4odGhpcy5fY2FzdGVyTGlnaHRQYXNzIHx8IHRoaXMuX3NjcmVlblBhc3MpO1xuXG5cdFx0Ly8gY2FzdGVyIGxpZ2h0IHBhc3MgaXMgYWx3YXlzIGZpcnN0IGlmIGl0IGV4aXN0cywgaGVuY2UgaXQgdXNlcyBub3JtYWwgYmxlbmRpbmdcblx0XHRpZiAodGhpcy5fY2FzdGVyTGlnaHRQYXNzKSB7XG5cdFx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MuZm9yY2VTZXBhcmF0ZU1WUCA9IGZvcmNlU2VwYXJhdGVNVlA7XG5cdFx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3Muc2V0QmxlbmRNb2RlKEJsZW5kTW9kZS5OT1JNQUwpO1xuXHRcdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzLmRlcHRoQ29tcGFyZU1vZGUgPSB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlcykge1xuXHRcdFx0dmFyIGZpcnN0QWRkaXRpdmVJbmRleDpudW1iZXIgPSAwO1xuXG5cdFx0XHQvLyBpZiB0aGVyZSdzIG5vIGNhc3RlciBsaWdodCBwYXNzLCB0aGUgZmlyc3Qgbm9uIGNhc3RlciBsaWdodCBwYXNzIHdpbGwgYmUgdGhlIGZpcnN0XG5cdFx0XHQvLyBhbmQgc2hvdWxkIHVzZSBub3JtYWwgYmxlbmRpbmdcblx0XHRcdGlmICghdGhpcy5fY2FzdGVyTGlnaHRQYXNzKSB7XG5cdFx0XHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzWzBdLmZvcmNlU2VwYXJhdGVNVlAgPSBmb3JjZVNlcGFyYXRlTVZQO1xuXHRcdFx0XHR0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlc1swXS5zZXRCbGVuZE1vZGUoQmxlbmRNb2RlLk5PUk1BTCk7XG5cdFx0XHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzWzBdLmRlcHRoQ29tcGFyZU1vZGUgPSB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHRcdFx0XHRmaXJzdEFkZGl0aXZlSW5kZXggPSAxO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhbGwgbGlnaHRpbmcgcGFzc2VzIGZvbGxvd2luZyB0aGUgZmlyc3QgbGlnaHQgcGFzcyBzaG91bGQgdXNlIGFkZGl0aXZlIGJsZW5kaW5nXG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciA9IGZpcnN0QWRkaXRpdmVJbmRleDsgaSA8IHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzW2ldLmZvcmNlU2VwYXJhdGVNVlAgPSBmb3JjZVNlcGFyYXRlTVZQO1xuXHRcdFx0XHR0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlc1tpXS5zZXRCbGVuZE1vZGUoQmxlbmRNb2RlLkFERCk7XG5cdFx0XHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzW2ldLmRlcHRoQ29tcGFyZU1vZGUgPSBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9jYXN0ZXJMaWdodFBhc3MgfHwgdGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMpIHtcblx0XHRcdC8vY2Fubm90IGJlIGJsZW5kZWQgYnkgYmxlbmRtb2RlIHByb3BlcnR5IGlmIG11bHRpcGFzcyBlbmFibGVkXG5cdFx0XHR0aGlzLl9wUmVxdWlyZXNCbGVuZGluZyA9IGZhbHNlO1xuXG5cdFx0XHQvLyB0aGVyZSBhcmUgbGlnaHQgcGFzc2VzLCBzbyB0aGlzIHNob3VsZCBiZSBibGVuZGVkIGluXG5cdFx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcykge1xuXHRcdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnBhc3NNb2RlID0gTWF0ZXJpYWxQYXNzTW9kZS5FRkZFQ1RTO1xuXHRcdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmRlcHRoQ29tcGFyZU1vZGUgPSBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMO1xuXHRcdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnNldEJsZW5kTW9kZShCbGVuZE1vZGUuTEFZRVIpO1xuXHRcdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmZvcmNlU2VwYXJhdGVNVlAgPSBmb3JjZVNlcGFyYXRlTVZQO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmICh0aGlzLl9zY3JlZW5QYXNzKSB7XG5cdFx0XHR0aGlzLl9wUmVxdWlyZXNCbGVuZGluZyA9ICh0aGlzLl9wQmxlbmRNb2RlICE9IEJsZW5kTW9kZS5OT1JNQUwgfHwgdGhpcy5fYWxwaGFCbGVuZGluZyB8fCAodGhpcy5fY29sb3JUcmFuc2Zvcm0gJiYgdGhpcy5fY29sb3JUcmFuc2Zvcm0uYWxwaGFNdWx0aXBsaWVyIDwgMSkpO1xuXHRcdFx0Ly8gZWZmZWN0cyBwYXNzIGlzIHRoZSBvbmx5IHBhc3MsIHNvIGl0IHNob3VsZCBqdXN0IGJsZW5kIG5vcm1hbGx5XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnBhc3NNb2RlID0gTWF0ZXJpYWxQYXNzTW9kZS5TVVBFUl9TSEFERVI7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmRlcHRoQ29tcGFyZU1vZGUgPSB0aGlzLl9kZXB0aENvbXBhcmVNb2RlO1xuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5wcmVzZXJ2ZUFscGhhID0gdGhpcy5fcFJlcXVpcmVzQmxlbmRpbmc7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmNvbG9yVHJhbnNmb3JtID0gdGhpcy5fY29sb3JUcmFuc2Zvcm07XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnNldEJsZW5kTW9kZSgodGhpcy5fcEJsZW5kTW9kZSA9PSBCbGVuZE1vZGUuTk9STUFMICYmIHRoaXMuX3BSZXF1aXJlc0JsZW5kaW5nKT8gQmxlbmRNb2RlLkxBWUVSIDogdGhpcy5fcEJsZW5kTW9kZSk7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmZvcmNlU2VwYXJhdGVNVlAgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGluaXRDYXN0ZXJMaWdodFBhc3MoKVxuXHR7XG5cblx0XHRpZiAodGhpcy5fY2FzdGVyTGlnaHRQYXNzID09IG51bGwpXG5cdFx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MgPSBuZXcgVHJpYW5nbGVNZXRob2RQYXNzKE1hdGVyaWFsUGFzc01vZGUuTElHSFRJTkcpO1xuXG5cdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzLmxpZ2h0UGlja2VyID0gbmV3IFN0YXRpY0xpZ2h0UGlja2VyKFt0aGlzLl9zaGFkb3dNZXRob2QuY2FzdGluZ0xpZ2h0XSk7XG5cdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzLnNoYWRvd01ldGhvZCA9IHRoaXMuX3NoYWRvd01ldGhvZDtcblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MuZGlmZnVzZU1ldGhvZCA9IHRoaXMuX2RpZmZ1c2VNZXRob2Q7XG5cdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzLmFtYmllbnRNZXRob2QgPSB0aGlzLl9hbWJpZW50TWV0aG9kO1xuXHRcdHRoaXMuX2Nhc3RlckxpZ2h0UGFzcy5ub3JtYWxNZXRob2QgPSB0aGlzLl9ub3JtYWxNZXRob2Q7XG5cdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzLnNwZWN1bGFyTWV0aG9kID0gdGhpcy5fc3BlY3VsYXJNZXRob2Q7XG5cdH1cblxuXHRwcml2YXRlIHJlbW92ZUNhc3RlckxpZ2h0UGFzcygpXG5cdHtcblx0XHR0aGlzLl9jYXN0ZXJMaWdodFBhc3MuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX3BSZW1vdmVTY3JlZW5QYXNzKHRoaXMuX2Nhc3RlckxpZ2h0UGFzcyk7XG5cdFx0dGhpcy5fY2FzdGVyTGlnaHRQYXNzID0gbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgaW5pdE5vbkNhc3RlckxpZ2h0UGFzc2VzKClcblx0e1xuXHRcdHRoaXMucmVtb3ZlTm9uQ2FzdGVyTGlnaHRQYXNzZXMoKTtcblx0XHR2YXIgcGFzczpUcmlhbmdsZU1ldGhvZFBhc3M7XG5cdFx0dmFyIG51bURpckxpZ2h0czpudW1iZXIgPSB0aGlzLl9wTGlnaHRQaWNrZXIubnVtRGlyZWN0aW9uYWxMaWdodHM7XG5cdFx0dmFyIG51bVBvaW50TGlnaHRzOm51bWJlciA9IHRoaXMuX3BMaWdodFBpY2tlci5udW1Qb2ludExpZ2h0cztcblx0XHR2YXIgbnVtTGlnaHRQcm9iZXM6bnVtYmVyID0gdGhpcy5fcExpZ2h0UGlja2VyLm51bUxpZ2h0UHJvYmVzO1xuXHRcdHZhciBkaXJMaWdodE9mZnNldDpudW1iZXIgPSAwO1xuXHRcdHZhciBwb2ludExpZ2h0T2Zmc2V0Om51bWJlciA9IDA7XG5cdFx0dmFyIHByb2JlT2Zmc2V0Om51bWJlciA9IDA7XG5cblx0XHRpZiAoIXRoaXMuX2Nhc3RlckxpZ2h0UGFzcykge1xuXHRcdFx0bnVtRGlyTGlnaHRzICs9IHRoaXMuX3BMaWdodFBpY2tlci5udW1DYXN0aW5nRGlyZWN0aW9uYWxMaWdodHM7XG5cdFx0XHRudW1Qb2ludExpZ2h0cyArPSB0aGlzLl9wTGlnaHRQaWNrZXIubnVtQ2FzdGluZ1BvaW50TGlnaHRzO1xuXHRcdH1cblxuXHRcdHRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzID0gbmV3IEFycmF5PFRyaWFuZ2xlTWV0aG9kUGFzcz4oKTtcblxuXHRcdHdoaWxlIChkaXJMaWdodE9mZnNldCA8IG51bURpckxpZ2h0cyB8fCBwb2ludExpZ2h0T2Zmc2V0IDwgbnVtUG9pbnRMaWdodHMgfHwgcHJvYmVPZmZzZXQgPCBudW1MaWdodFByb2Jlcykge1xuXHRcdFx0cGFzcyA9IG5ldyBUcmlhbmdsZU1ldGhvZFBhc3MoTWF0ZXJpYWxQYXNzTW9kZS5MSUdIVElORyk7XG5cdFx0XHRwYXNzLmluY2x1ZGVDYXN0ZXJzID0gdGhpcy5fc2hhZG93TWV0aG9kID09IG51bGw7XG5cdFx0XHRwYXNzLmRpcmVjdGlvbmFsTGlnaHRzT2Zmc2V0ID0gZGlyTGlnaHRPZmZzZXQ7XG5cdFx0XHRwYXNzLnBvaW50TGlnaHRzT2Zmc2V0ID0gcG9pbnRMaWdodE9mZnNldDtcblx0XHRcdHBhc3MubGlnaHRQcm9iZXNPZmZzZXQgPSBwcm9iZU9mZnNldDtcblx0XHRcdHBhc3MubGlnaHRQaWNrZXIgPSB0aGlzLl9wTGlnaHRQaWNrZXI7XG5cdFx0XHRwYXNzLmRpZmZ1c2VNZXRob2QgPSB0aGlzLl9kaWZmdXNlTWV0aG9kO1xuXHRcdFx0cGFzcy5hbWJpZW50TWV0aG9kID0gdGhpcy5fYW1iaWVudE1ldGhvZDtcblx0XHRcdHBhc3Mubm9ybWFsTWV0aG9kID0gdGhpcy5fbm9ybWFsTWV0aG9kO1xuXHRcdFx0cGFzcy5zcGVjdWxhck1ldGhvZCA9IHRoaXMuX3NwZWN1bGFyTWV0aG9kO1xuXHRcdFx0dGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMucHVzaChwYXNzKTtcblxuXHRcdFx0ZGlyTGlnaHRPZmZzZXQgKz0gcGFzcy5pTnVtRGlyZWN0aW9uYWxMaWdodHM7XG5cdFx0XHRwb2ludExpZ2h0T2Zmc2V0ICs9IHBhc3MuaU51bVBvaW50TGlnaHRzO1xuXHRcdFx0cHJvYmVPZmZzZXQgKz0gcGFzcy5pTnVtTGlnaHRQcm9iZXM7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSByZW1vdmVOb25DYXN0ZXJMaWdodFBhc3NlcygpXG5cdHtcblx0XHRpZiAoIXRoaXMuX25vbkNhc3RlckxpZ2h0UGFzc2VzKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fbm9uQ2FzdGVyTGlnaHRQYXNzZXMubGVuZ3RoOyArK2kpXG5cdFx0XHR0aGlzLl9wUmVtb3ZlU2NyZWVuUGFzcyh0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3Nlc1tpXSk7XG5cblx0XHR0aGlzLl9ub25DYXN0ZXJMaWdodFBhc3NlcyA9IG51bGw7XG5cdH1cblxuXHRwcml2YXRlIHJlbW92ZUVmZmVjdFBhc3MoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NjcmVlblBhc3MuYW1iaWVudE1ldGhvZCAhPSB0aGlzLl9hbWJpZW50TWV0aG9kKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5hbWJpZW50TWV0aG9kLmRpc3Bvc2UoKTtcblxuXHRcdGlmICh0aGlzLl9zY3JlZW5QYXNzLmRpZmZ1c2VNZXRob2QgIT0gdGhpcy5fZGlmZnVzZU1ldGhvZClcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MuZGlmZnVzZU1ldGhvZC5kaXNwb3NlKCk7XG5cblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcy5zcGVjdWxhck1ldGhvZCAhPSB0aGlzLl9zcGVjdWxhck1ldGhvZClcblx0XHRcdHRoaXMuX3NjcmVlblBhc3Muc3BlY3VsYXJNZXRob2QuZGlzcG9zZSgpO1xuXG5cdFx0aWYgKHRoaXMuX3NjcmVlblBhc3Mubm9ybWFsTWV0aG9kICE9IHRoaXMuX25vcm1hbE1ldGhvZClcblx0XHRcdHRoaXMuX3NjcmVlblBhc3Mubm9ybWFsTWV0aG9kLmRpc3Bvc2UoKTtcblxuXHRcdHRoaXMuX3BSZW1vdmVTY3JlZW5QYXNzKHRoaXMuX3NjcmVlblBhc3MpO1xuXHRcdHRoaXMuX3NjcmVlblBhc3MgPSBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0RWZmZWN0UGFzcygpXG5cdHtcblx0XHRpZiAodGhpcy5fc2NyZWVuUGFzcyA9PSBudWxsKVxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcyA9IG5ldyBUcmlhbmdsZU1ldGhvZFBhc3MoKTtcblxuXHRcdGlmICh0aGlzLl9tYXRlcmlhbE1vZGUgPT0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuU0lOR0xFX1BBU1MpIHtcblx0XHRcdHRoaXMuX3NjcmVlblBhc3MuYW1iaWVudE1ldGhvZCA9IHRoaXMuX2FtYmllbnRNZXRob2Q7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmRpZmZ1c2VNZXRob2QgPSB0aGlzLl9kaWZmdXNlTWV0aG9kO1xuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5zcGVjdWxhck1ldGhvZCA9IHRoaXMuX3NwZWN1bGFyTWV0aG9kO1xuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5ub3JtYWxNZXRob2QgPSB0aGlzLl9ub3JtYWxNZXRob2Q7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLnNoYWRvd01ldGhvZCA9IHRoaXMuX3NoYWRvd01ldGhvZDtcblx0XHR9IGVsc2UgaWYgKHRoaXMuX21hdGVyaWFsTW9kZSA9PSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTKSB7XG5cdFx0XHRpZiAodGhpcy5udW1MaWdodHMgPT0gMCkge1xuXHRcdFx0XHR0aGlzLl9zY3JlZW5QYXNzLmFtYmllbnRNZXRob2QgPSB0aGlzLl9hbWJpZW50TWV0aG9kO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5hbWJpZW50TWV0aG9kID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fc2NyZWVuUGFzcy5wcmVzZXJ2ZUFscGhhID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9zY3JlZW5QYXNzLm5vcm1hbE1ldGhvZCA9IHRoaXMuX25vcm1hbE1ldGhvZDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG1heGltdW0gdG90YWwgbnVtYmVyIG9mIGxpZ2h0cyBwcm92aWRlZCBieSB0aGUgbGlnaHQgcGlja2VyLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXQgbnVtTGlnaHRzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcExpZ2h0UGlja2VyPyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtTGlnaHRQcm9iZXMgKyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtRGlyZWN0aW9uYWxMaWdodHMgKyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtUG9pbnRMaWdodHMgKyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtQ2FzdGluZ0RpcmVjdGlvbmFsTGlnaHRzICsgdGhpcy5fcExpZ2h0UGlja2VyLm51bUNhc3RpbmdQb2ludExpZ2h0cyA6IDA7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiBsaWdodHMgdGhhdCBkb24ndCBjYXN0IHNoYWRvd3MuXG5cdCAqL1xuXHRwcml2YXRlIGdldCBudW1Ob25DYXN0ZXJzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcExpZ2h0UGlja2VyPyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtTGlnaHRQcm9iZXMgKyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtRGlyZWN0aW9uYWxMaWdodHMgKyB0aGlzLl9wTGlnaHRQaWNrZXIubnVtUG9pbnRMaWdodHMgOiAwO1xuXHR9XG59XG5cbmV4cG9ydCA9IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7Il19