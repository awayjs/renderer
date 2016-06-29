"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractionBase_1 = require("@awayjs/core/lib/library/AbstractionBase");
var SurfaceEvent_1 = require("@awayjs/display/lib/events/SurfaceEvent");
var MaterialBase_1 = require("@awayjs/display/lib/materials/MaterialBase");
var DefaultMaterialManager_1 = require("@awayjs/display/lib/managers/DefaultMaterialManager");
var PassEvent_1 = require("../events/PassEvent");
/**
 *
 * @class away.pool.Passes
 */
var GL_SurfaceBase = (function (_super) {
    __extends(GL_SurfaceBase, _super);
    function GL_SurfaceBase(surface, elementsClass, renderPool) {
        var _this = this;
        _super.call(this, surface, renderPool);
        this.usages = 0;
        this._forceSeparateMVP = false;
        this._usesAnimation = true;
        this._invalidAnimation = true;
        this._invalidRender = true;
        this._invalidImages = true;
        this._passes = new Array();
        this._imageIndices = new Object();
        this._pRequiresBlending = false;
        this.images = new Array();
        this.samplers = new Array();
        this._onInvalidateAnimationDelegate = function (event) { return _this.onInvalidateAnimation(event); };
        this._onInvalidatePassesDelegate = function (event) { return _this.onInvalidatePasses(event); };
        this.surfaceID = surface.id;
        this._surface = surface;
        this._elementsClass = elementsClass;
        this._stage = renderPool.stage;
        this._surface.addEventListener(SurfaceEvent_1.SurfaceEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
        this._surface.addEventListener(SurfaceEvent_1.SurfaceEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);
        this._onPassInvalidateDelegate = function (event) { return _this.onPassInvalidate(event); };
    }
    Object.defineProperty(GL_SurfaceBase.prototype, "requiresBlending", {
        /**
         * Indicates whether or not the renderable requires alpha blending during rendering.
         */
        get: function () {
            return this._pRequiresBlending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SurfaceBase.prototype, "renderOrderId", {
        get: function () {
            if (this._invalidAnimation)
                this._updateAnimation();
            return this._renderOrderId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SurfaceBase.prototype, "passes", {
        get: function () {
            if (this._invalidAnimation)
                this._updateAnimation();
            return this._passes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SurfaceBase.prototype, "surface", {
        get: function () {
            return this._surface;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SurfaceBase.prototype, "numImages", {
        get: function () {
            if (this._invalidImages)
                this._updateImages();
            return this._numImages;
        },
        enumerable: true,
        configurable: true
    });
    GL_SurfaceBase.prototype._iIncludeDependencies = function (shader) {
        this._elementsClass._iIncludeDependencies(shader);
        shader.alphaThreshold = this._surface.alphaThreshold;
        shader.useImageRect = this._surface.imageRect;
        shader.usesCurves = this._surface.curves;
        if (this._surface instanceof MaterialBase_1.MaterialBase) {
            var material = this._surface;
            shader.useAlphaPremultiplied = material.alphaPremultiplied;
            shader.useBothSides = material.bothSides;
            shader.usesUVTransform = material.animateUVs;
            shader.usesColorTransform = material.useColorTransform;
        }
    };
    GL_SurfaceBase.prototype.getImageIndex = function (texture, index) {
        if (index === void 0) { index = 0; }
        if (this._invalidImages)
            this._updateImages();
        return this._imageIndices[texture.id][index];
    };
    /**
     *
     */
    GL_SurfaceBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._surface = null;
        this._elementsClass = null;
        this._stage = null;
        var len = this._passes.length;
        for (var i = 0; i < len; i++) {
            this._passes[i].removeEventListener(PassEvent_1.PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
            this._passes[i].dispose();
        }
        this._passes = null;
    };
    /**
     *
     */
    GL_SurfaceBase.prototype.onInvalidate = function (event) {
        _super.prototype.onInvalidate.call(this, event);
        this._invalidRender = true;
        this._invalidAnimation = true;
    };
    /**
     *
     */
    GL_SurfaceBase.prototype.onInvalidatePasses = function (event) {
        var len = this._passes.length;
        for (var i = 0; i < len; i++)
            this._passes[i].invalidate();
        this._invalidAnimation = true;
        this._invalidImages = true;
    };
    /**
     *
     */
    GL_SurfaceBase.prototype.onInvalidateAnimation = function (event) {
        this._invalidAnimation = true;
    };
    /**
     *
     * @param surface
     */
    GL_SurfaceBase.prototype._updateAnimation = function () {
        if (this._invalidRender)
            this._pUpdateRender();
        this._invalidAnimation = false;
        var usesAnimation = this._getEnabledGPUAnimation();
        var renderOrderId = 0;
        var mult = 1;
        var shader;
        var len = this._passes.length;
        for (var i = 0; i < len; i++) {
            shader = this._passes[i].shader;
            shader.usesAnimation = usesAnimation;
            renderOrderId += shader.programData.id * mult;
            mult *= 1000;
        }
        if (this._usesAnimation != usesAnimation) {
            this._usesAnimation = usesAnimation;
            var renderables = this._surface.iOwners;
            var numOwners = renderables.length;
            for (var j = 0; j < numOwners; j++)
                renderables[j].invalidateElements();
        }
        this._renderOrderId = renderOrderId;
    };
    GL_SurfaceBase.prototype._updateImages = function () {
        this._invalidImages = false;
        var numTextures = this._surface.getNumTextures();
        var texture;
        var numImages;
        var images;
        var image;
        var sampler;
        var index = 0;
        for (var i = 0; i < numTextures; i++) {
            texture = this._surface.getTextureAt(i);
            numImages = texture.getNumImages();
            images = this._imageIndices[texture.id] = new Array();
            for (var j = 0; j < numImages; j++) {
                image = texture.getImageAt(j) || (this._surface.style ? this._surface.style.getImageAt(texture, j) : null) || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultImage2D();
                this.images[index] = this._stage.getAbstraction(image);
                sampler = texture.getSamplerAt(j) || (this._surface.style ? this._surface.style.getSamplerAt(texture, j) : null) || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultSampler();
                this.samplers[index] = this._stage.getAbstraction(sampler);
                images[j] = index++;
            }
        }
        this._numImages = index;
    };
    /**
     * Performs any processing that needs to occur before any of its passes are used.
     *
     * @private
     */
    GL_SurfaceBase.prototype._pUpdateRender = function () {
        this._invalidRender = false;
        //overrride to update shader object properties
    };
    /**
     * Removes a pass from the surface.
     * @param pass The pass to be removed.
     */
    GL_SurfaceBase.prototype._pRemovePass = function (pass) {
        pass.removeEventListener(PassEvent_1.PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.splice(this._passes.indexOf(pass), 1);
    };
    /**
     * Removes all passes from the surface
     */
    GL_SurfaceBase.prototype._pClearPasses = function () {
        var len = this._passes.length;
        for (var i = 0; i < len; ++i)
            this._passes[i].removeEventListener(PassEvent_1.PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.length = 0;
    };
    /**
     * Adds a pass to the surface
     * @param pass
     */
    GL_SurfaceBase.prototype._pAddPass = function (pass) {
        this._passes.push(pass);
        pass.addEventListener(PassEvent_1.PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
    };
    /**
     * Listener for when a pass's shader code changes. It recalculates the render order id.
     */
    GL_SurfaceBase.prototype.onPassInvalidate = function (event) {
        this._invalidAnimation = true;
    };
    /**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
    GL_SurfaceBase.prototype._getEnabledGPUAnimation = function () {
        if (this._surface.animationSet) {
            this._surface.animationSet.resetGPUCompatibility();
            var renderables = this._surface.iOwners;
            var numOwners = renderables.length;
            var len = this._passes.length;
            var shader;
            for (var i = 0; i < len; i++) {
                shader = this._passes[i].shader;
                shader.usesAnimation = false;
                for (var j = 0; j < numOwners; j++)
                    if (renderables[j].animator)
                        renderables[j].animator.testGPUCompatibility(shader);
            }
            return !this._surface.animationSet.usesCPU;
        }
        return false;
    };
    return GL_SurfaceBase;
}(AbstractionBase_1.AbstractionBase));
exports.GL_SurfaceBase = GL_SurfaceBase;
