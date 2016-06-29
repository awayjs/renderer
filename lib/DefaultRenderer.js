"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BitmapImage2D_1 = require("@awayjs/core/lib/image/BitmapImage2D");
var ContextGLClearMask_1 = require("@awayjs/stage/lib/base/ContextGLClearMask");
var RendererBase_1 = require("./RendererBase");
var DepthRenderer_1 = require("./DepthRenderer");
var DistanceRenderer_1 = require("./DistanceRenderer");
var Filter3DRenderer_1 = require("./Filter3DRenderer");
var RTTBufferManager_1 = require("./managers/RTTBufferManager");
/**
 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
 * materials assigned to them.
 *
 * @class away.render.DefaultRenderer
 */
var DefaultRenderer = (function (_super) {
    __extends(DefaultRenderer, _super);
    /**
     * Creates a new DefaultRenderer object.
     *
     * @param antiAlias The amount of anti-aliasing to use.
     * @param renderMode The render mode to use.
     */
    function DefaultRenderer(stage, forceSoftware, profile, mode) {
        if (stage === void 0) { stage = null; }
        if (forceSoftware === void 0) { forceSoftware = false; }
        if (profile === void 0) { profile = "baseline"; }
        if (mode === void 0) { mode = "auto"; }
        _super.call(this, stage, null, forceSoftware, profile, mode);
        this._antiAlias = 0;
        this._directionalLights = new Array();
        this._pointLights = new Array();
        this._lightProbes = new Array();
        if (stage)
            this.shareContext = true;
        this._pRttBufferManager = RTTBufferManager_1.RTTBufferManager.getInstance(this._pStage);
        this._pDepthRenderer = new DepthRenderer_1.DepthRenderer(this._pStage);
        this._pDistanceRenderer = new DistanceRenderer_1.DistanceRenderer(this._pStage);
        if (this._width == 0)
            this.width = window.innerWidth;
        else
            this._pRttBufferManager.viewWidth = this._width;
        if (this._height == 0)
            this.height = window.innerHeight;
        else
            this._pRttBufferManager.viewHeight = this._height;
    }
    Object.defineProperty(DefaultRenderer.prototype, "antiAlias", {
        get: function () {
            return this._antiAlias;
        },
        set: function (value) {
            if (this._antiAlias == value)
                return;
            this._antiAlias = value;
            this._pBackBufferInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultRenderer.prototype, "depthPrepass", {
        /**
         *
         */
        get: function () {
            return this._depthPrepass;
        },
        set: function (value) {
            this._depthPrepass = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultRenderer.prototype, "filters3d", {
        /**
         *
         * @returns {*}
         */
        get: function () {
            return this._pFilter3DRenderer ? this._pFilter3DRenderer.filters : null;
        },
        set: function (value) {
            if (value && value.length == 0)
                value = null;
            if (this._pFilter3DRenderer && !value) {
                this._pFilter3DRenderer.dispose();
                this._pFilter3DRenderer = null;
            }
            else if (!this._pFilter3DRenderer && value) {
                this._pFilter3DRenderer = new Filter3DRenderer_1.Filter3DRenderer(this._pStage);
                this._pFilter3DRenderer.filters = value;
            }
            if (this._pFilter3DRenderer) {
                this._pFilter3DRenderer.filters = value;
                this._pRequireDepthRender = this._pFilter3DRenderer.requireDepthRender;
            }
            else {
                this._pRequireDepthRender = false;
                if (this._pDepthRender) {
                    this._pDepthRender.dispose();
                    this._pDepthRender = null;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    DefaultRenderer.prototype.enterNode = function (node) {
        var enter = _super.prototype.enterNode.call(this, node);
        if (enter && node.debugVisible)
            this.applyEntity(node.bounds.boundsPrimitive);
        return enter;
    };
    DefaultRenderer.prototype.render = function (camera, scene) {
        _super.prototype.render.call(this, camera, scene);
        if (!this._pStage.recoverFromDisposal()) {
            this._pBackBufferInvalid = true;
            return;
        }
        if (this._pBackBufferInvalid)
            this.pUpdateBackBuffer();
        if (this.shareContext && this._pContext)
            this._pContext.clear(0, 0, 0, 1, 1, 0, ContextGLClearMask_1.ContextGLClearMask.DEPTH);
        if (this._pFilter3DRenderer) {
            this.textureRatioX = this._pRttBufferManager.textureRatioX;
            this.textureRatioY = this._pRttBufferManager.textureRatioY;
        }
        else {
            this.textureRatioX = 1;
            this.textureRatioY = 1;
        }
        if (this._pRequireDepthRender)
            this.pRenderSceneDepthToTexture(camera, scene);
        if (this._depthPrepass)
            this.pRenderDepthPrepass(camera, scene);
        //reset lights
        this._directionalLights.length = 0;
        this._pointLights.length = 0;
        this._lightProbes.length = 0;
        if (this._pFilter3DRenderer && this._pContext) {
            this._iRender(camera, scene, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
            this._pFilter3DRenderer.render(this._pStage, camera, this._pDepthRender);
        }
        else {
            if (this.shareContext)
                this._iRender(camera, scene, null, this._pScissorRect);
            else
                this._iRender(camera, scene);
        }
        if (!this.shareContext && this._pContext)
            this._pContext.present();
        // register that a view has been rendered
        this._pStage.bufferClear = false;
    };
    DefaultRenderer.prototype.pExecuteRender = function (camera, target, scissorRect, surfaceSelector) {
        if (target === void 0) { target = null; }
        if (scissorRect === void 0) { scissorRect = null; }
        if (surfaceSelector === void 0) { surfaceSelector = 0; }
        this.updateLights(camera);
        _super.prototype.pExecuteRender.call(this, camera, target, scissorRect, surfaceSelector);
    };
    DefaultRenderer.prototype.updateLights = function (camera) {
        var len, i;
        var light;
        var shadowMapper;
        len = this._directionalLights.length;
        for (i = 0; i < len; ++i) {
            light = this._directionalLights[i];
            shadowMapper = light.shadowMapper;
            if (light.shadowsEnabled && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
                shadowMapper.iRenderDepthMap(camera, light.scene, this._pDepthRenderer);
        }
        len = this._pointLights.length;
        for (i = 0; i < len; ++i) {
            light = this._pointLights[i];
            shadowMapper = light.shadowMapper;
            if (light.shadowsEnabled && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
                shadowMapper.iRenderDepthMap(camera, light.scene, this._pDistanceRenderer);
        }
    };
    /**
     *
     * @param entity
     */
    DefaultRenderer.prototype.applyDirectionalLight = function (entity) {
        this._directionalLights.push(entity);
    };
    /**
     *
     * @param entity
     */
    DefaultRenderer.prototype.applyLightProbe = function (entity) {
        this._lightProbes.push(entity);
    };
    /**
     *
     * @param entity
     */
    DefaultRenderer.prototype.applyPointLight = function (entity) {
        this._pointLights.push(entity);
    };
    DefaultRenderer.prototype.dispose = function () {
        if (!this.shareContext)
            this._pStage.dispose();
        this._pRttBufferManager.dispose();
        this._pRttBufferManager = null;
        this._pDepthRenderer.dispose();
        this._pDistanceRenderer.dispose();
        this._pDepthRenderer = null;
        this._pDistanceRenderer = null;
        this._pDepthRender = null;
        _super.prototype.dispose.call(this);
    };
    /**
     *
     */
    DefaultRenderer.prototype.pRenderDepthPrepass = function (camera, scene) {
        this._pDepthRenderer.disableColor = true;
        if (this._pFilter3DRenderer) {
            this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
            this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
            this._pDepthRenderer._iRender(camera, scene, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
        }
        else {
            this._pDepthRenderer.textureRatioX = 1;
            this._pDepthRenderer.textureRatioY = 1;
            this._pDepthRenderer._iRender(camera, scene);
        }
        this._pDepthRenderer.disableColor = false;
    };
    /**
     *
     */
    DefaultRenderer.prototype.pRenderSceneDepthToTexture = function (camera, scene) {
        if (this._pDepthTextureInvalid || !this._pDepthRender)
            this.initDepthTexture(this._pStage.context);
        this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
        this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
        this._pDepthRenderer._iRender(camera, scene, this._pDepthRender);
    };
    /**
     * Updates the backbuffer dimensions.
     */
    DefaultRenderer.prototype.pUpdateBackBuffer = function () {
        // No reason trying to configure back buffer if there is no context available.
        // Doing this anyway (and relying on _stage to cache width/height for
        // context does get available) means usesSoftwareRendering won't be reliable.
        if (this._pStage.context && !this.shareContext) {
            if (this._width && this._height) {
                this._pStage.configureBackBuffer(this._width, this._height, this._antiAlias, true);
                this._pBackBufferInvalid = false;
            }
        }
    };
    /**
     *
     */
    DefaultRenderer.prototype.initDepthTexture = function (context) {
        this._pDepthTextureInvalid = false;
        if (this._pDepthRender)
            this._pDepthRender.dispose();
        this._pDepthRender = new BitmapImage2D_1.BitmapImage2D(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
    };
    return DefaultRenderer;
}(RendererBase_1.RendererBase));
exports.DefaultRenderer = DefaultRenderer;
