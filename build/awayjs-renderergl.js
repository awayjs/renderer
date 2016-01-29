require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"awayjs-renderergl/lib/DefaultRenderer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BitmapImage2D = require("awayjs-core/lib/image/BitmapImage2D");
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLClearMask = require("awayjs-stagegl/lib/base/ContextGLClearMask");
var RendererBase = require("awayjs-renderergl/lib/RendererBase");
var DepthRenderer = require("awayjs-renderergl/lib/DepthRenderer");
var DistanceRenderer = require("awayjs-renderergl/lib/DistanceRenderer");
var Filter3DRenderer = require("awayjs-renderergl/lib/Filter3DRenderer");
var RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
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
        this._skyboxProjection = new Matrix3D();
        this._antiAlias = 0;
        if (stage)
            this._shareContext = true;
        this._pRttBufferManager = RTTBufferManager.getInstance(this._pStage);
        this._pDepthRenderer = new DepthRenderer(this._pStage);
        this._pDistanceRenderer = new DistanceRenderer(this._pStage);
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
                this._pFilter3DRenderer = new Filter3DRenderer(this._pStage);
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
    DefaultRenderer.prototype.render = function (entityCollector) {
        _super.prototype.render.call(this, entityCollector);
        if (!this._pStage.recoverFromDisposal()) {
            this._pBackBufferInvalid = true;
            return;
        }
        if (this._pBackBufferInvalid)
            this.pUpdateBackBuffer();
        if (this._shareContext && this._pContext)
            this._pContext.clear(0, 0, 0, 1, 1, 0, ContextGLClearMask.DEPTH);
        if (this._pFilter3DRenderer) {
            this.textureRatioX = this._pRttBufferManager.textureRatioX;
            this.textureRatioY = this._pRttBufferManager.textureRatioY;
        }
        else {
            this.textureRatioX = 1;
            this.textureRatioY = 1;
        }
        if (this._pRequireDepthRender)
            this.pRenderSceneDepthToTexture(entityCollector);
        if (this._depthPrepass)
            this.pRenderDepthPrepass(entityCollector);
        if (this._pFilter3DRenderer && this._pContext) {
            this._iRender(entityCollector, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
            this._pFilter3DRenderer.render(this._pStage, entityCollector.camera, this._pDepthRender);
        }
        else {
            if (this._shareContext)
                this._iRender(entityCollector, null, this._pScissorRect);
            else
                this._iRender(entityCollector);
        }
        if (!this._shareContext && this._pContext)
            this._pContext.present();
        // register that a view has been rendered
        this._pStage.bufferClear = false;
    };
    DefaultRenderer.prototype.pExecuteRender = function (entityCollector, target, scissorRect, surfaceSelector) {
        if (target === void 0) { target = null; }
        if (scissorRect === void 0) { scissorRect = null; }
        if (surfaceSelector === void 0) { surfaceSelector = 0; }
        this.updateLights(entityCollector);
        _super.prototype.pExecuteRender.call(this, entityCollector, target, scissorRect, surfaceSelector);
    };
    DefaultRenderer.prototype.updateLights = function (entityCollector) {
        var dirLights = entityCollector.directionalLights;
        var pointLights = entityCollector.pointLights;
        var len, i;
        var light;
        var shadowMapper;
        len = dirLights.length;
        for (i = 0; i < len; ++i) {
            light = dirLights[i];
            shadowMapper = light.shadowMapper;
            if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
                shadowMapper.iRenderDepthMap(entityCollector, this._pDepthRenderer);
        }
        len = pointLights.length;
        for (i = 0; i < len; ++i) {
            light = pointLights[i];
            shadowMapper = light.shadowMapper;
            if (light.castsShadows && (shadowMapper.autoUpdateShadows || shadowMapper._iShadowsInvalid))
                shadowMapper.iRenderDepthMap(entityCollector, this._pDistanceRenderer);
        }
    };
    /**
     * @inheritDoc
     */
    DefaultRenderer.prototype.pDraw = function (entityCollector) {
        if (entityCollector.skyBox) {
            this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);
            this.drawSkybox(entityCollector);
        }
        _super.prototype.pDraw.call(this, entityCollector);
    };
    /**
     * Draw the skybox if present.
     *
     * @param entityCollector The EntityCollector containing all potentially visible information.
     */
    DefaultRenderer.prototype.drawSkybox = function (entityCollector) {
        var renderable = this.getAbstraction(entityCollector.skyBox);
        var camera = entityCollector.camera;
        this.updateSkyboxProjection(camera);
        var render = this.getRenderPool(renderable.renderableOwner).getAbstraction(renderable.render.renderOwner);
        var pass = render.passes[0];
        this.activatePass(renderable, pass, camera);
        renderable._iRender(pass, camera, this._skyboxProjection);
        this.deactivatePass(renderable, pass);
    };
    DefaultRenderer.prototype.updateSkyboxProjection = function (camera) {
        var near = new Vector3D();
        this._skyboxProjection.copyFrom(this._pRttViewProjectionMatrix);
        this._skyboxProjection.copyRowTo(2, near);
        var camPos = camera.scenePosition;
        var cx = near.x;
        var cy = near.y;
        var cz = near.z;
        var cw = -(near.x * camPos.x + near.y * camPos.y + near.z * camPos.z + Math.sqrt(cx * cx + cy * cy + cz * cz));
        var signX = cx >= 0 ? 1 : -1;
        var signY = cy >= 0 ? 1 : -1;
        var p = new Vector3D(signX, signY, 1, 1);
        var inverse = this._skyboxProjection.clone();
        inverse.invert();
        var q = inverse.transformVector(p);
        this._skyboxProjection.copyRowTo(3, p);
        var a = (q.x * p.x + q.y * p.y + q.z * p.z + q.w * p.w) / (cx * q.x + cy * q.y + cz * q.z + cw * q.w);
        this._skyboxProjection.copyRowFrom(2, new Vector3D(cx * a, cy * a, cz * a, cw * a));
    };
    DefaultRenderer.prototype.dispose = function () {
        if (!this._shareContext)
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
    DefaultRenderer.prototype.pRenderDepthPrepass = function (entityCollector) {
        this._pDepthRenderer.disableColor = true;
        if (this._pFilter3DRenderer) {
            this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
            this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
            this._pDepthRenderer._iRender(entityCollector, this._pFilter3DRenderer.getMainInputTexture(this._pStage), this._pRttBufferManager.renderToTextureRect);
        }
        else {
            this._pDepthRenderer.textureRatioX = 1;
            this._pDepthRenderer.textureRatioY = 1;
            this._pDepthRenderer._iRender(entityCollector);
        }
        this._pDepthRenderer.disableColor = false;
    };
    /**
     *
     */
    DefaultRenderer.prototype.pRenderSceneDepthToTexture = function (entityCollector) {
        if (this._pDepthTextureInvalid || !this._pDepthRender)
            this.initDepthTexture(this._pStage.context);
        this._pDepthRenderer.textureRatioX = this._pRttBufferManager.textureRatioX;
        this._pDepthRenderer.textureRatioY = this._pRttBufferManager.textureRatioY;
        this._pDepthRenderer._iRender(entityCollector, this._pDepthRender);
    };
    /**
     * Updates the backbuffer dimensions.
     */
    DefaultRenderer.prototype.pUpdateBackBuffer = function () {
        // No reason trying to configure back buffer if there is no context available.
        // Doing this anyway (and relying on _stage to cache width/height for
        // context does get available) means usesSoftwareRendering won't be reliable.
        if (this._pStage.context && !this._shareContext) {
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
        this._pDepthRender = new BitmapImage2D(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
    };
    return DefaultRenderer;
})(RendererBase);
module.exports = DefaultRenderer;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-core/lib/image/BitmapImage2D":undefined,"awayjs-renderergl/lib/DepthRenderer":"awayjs-renderergl/lib/DepthRenderer","awayjs-renderergl/lib/DistanceRenderer":"awayjs-renderergl/lib/DistanceRenderer","awayjs-renderergl/lib/Filter3DRenderer":"awayjs-renderergl/lib/Filter3DRenderer","awayjs-renderergl/lib/RendererBase":"awayjs-renderergl/lib/RendererBase","awayjs-renderergl/lib/managers/RTTBufferManager":"awayjs-renderergl/lib/managers/RTTBufferManager","awayjs-stagegl/lib/base/ContextGLClearMask":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-renderergl/lib/DepthRenderer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RendererBase = require("awayjs-renderergl/lib/RendererBase");
var DepthRender = require("awayjs-renderergl/lib/render/DepthRender");
/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
var DepthRenderer = (function (_super) {
    __extends(DepthRenderer, _super);
    /**
     * Creates a new DepthRenderer object.
     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
     */
    function DepthRenderer(stage) {
        if (stage === void 0) { stage = null; }
        _super.call(this, stage, DepthRender);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    return DepthRenderer;
})(RendererBase);
module.exports = DepthRenderer;

},{"awayjs-renderergl/lib/RendererBase":"awayjs-renderergl/lib/RendererBase","awayjs-renderergl/lib/render/DepthRender":"awayjs-renderergl/lib/render/DepthRender"}],"awayjs-renderergl/lib/DistanceRenderer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RendererBase = require("awayjs-renderergl/lib/RendererBase");
var DistanceRender = require("awayjs-renderergl/lib/render/DistanceRender");
/**
 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DistanceRenderer
 */
var DistanceRenderer = (function (_super) {
    __extends(DistanceRenderer, _super);
    /**
     * Creates a new DistanceRenderer object.
     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
     */
    function DistanceRenderer(stage) {
        if (stage === void 0) { stage = null; }
        _super.call(this, stage, DistanceRender);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    return DistanceRenderer;
})(RendererBase);
module.exports = DistanceRenderer;

},{"awayjs-renderergl/lib/RendererBase":"awayjs-renderergl/lib/RendererBase","awayjs-renderergl/lib/render/DistanceRender":"awayjs-renderergl/lib/render/DistanceRender"}],"awayjs-renderergl/lib/Filter3DRenderer":[function(require,module,exports){
var ContextGLDrawMode = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var RTTEvent = require("awayjs-renderergl/lib/events/RTTEvent");
var RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
/**
 * @class away.render.Filter3DRenderer
 */
var Filter3DRenderer = (function () {
    function Filter3DRenderer(stage) {
        var _this = this;
        this._filterSizesInvalid = true;
        this._onRTTResizeDelegate = function (event) { return _this.onRTTResize(event); };
        this._stage = stage;
        this._rttManager = RTTBufferManager.getInstance(stage);
        this._rttManager.addEventListener(RTTEvent.RESIZE, this._onRTTResizeDelegate);
    }
    Filter3DRenderer.prototype.onRTTResize = function (event) {
        this._filterSizesInvalid = true;
    };
    Object.defineProperty(Filter3DRenderer.prototype, "requireDepthRender", {
        get: function () {
            return this._requireDepthRender;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DRenderer.prototype.getMainInputTexture = function (stage) {
        if (this._filterTasksInvalid)
            this.updateFilterTasks(stage);
        return this._mainInputTexture;
    };
    Object.defineProperty(Filter3DRenderer.prototype, "filters", {
        get: function () {
            return this._filters;
        },
        set: function (value) {
            this._filters = value;
            this._filterTasksInvalid = true;
            this._requireDepthRender = false;
            if (!this._filters)
                return;
            for (var i = 0; i < this._filters.length; ++i)
                if (this._filters[i].requireDepthRender)
                    this._requireDepthRender = true;
            this._filterSizesInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DRenderer.prototype.updateFilterTasks = function (stage) {
        var len;
        if (this._filterSizesInvalid)
            this.updateFilterSizes();
        if (!this._filters) {
            this._tasks = null;
            return;
        }
        this._tasks = new Array();
        len = this._filters.length - 1;
        var filter;
        for (var i = 0; i <= len; ++i) {
            // make sure all internal tasks are linked together
            filter = this._filters[i];
            filter.setRenderTargets(i == len ? null : this._filters[i + 1].getMainInputTexture(stage), stage);
            this._tasks = this._tasks.concat(filter.tasks);
        }
        this._mainInputTexture = this._filters[0].getMainInputTexture(stage);
    };
    Filter3DRenderer.prototype.render = function (stage, camera, depthTexture) {
        var len;
        var i;
        var task;
        var context = stage.context;
        var indexBuffer = this._rttManager.indexBuffer;
        var vertexBuffer = this._rttManager.renderToTextureVertexBuffer;
        if (!this._filters)
            return;
        if (this._filterSizesInvalid)
            this.updateFilterSizes();
        if (this._filterTasksInvalid)
            this.updateFilterTasks(stage);
        len = this._filters.length;
        for (i = 0; i < len; ++i)
            this._filters[i].update(stage, camera);
        len = this._tasks.length;
        if (len > 1) {
            context.setProgram(this._tasks[0].getProgram(stage));
            context.setVertexBufferAt(0, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
            context.setVertexBufferAt(1, vertexBuffer, 8, ContextGLVertexBufferFormat.FLOAT_2);
        }
        for (i = 0; i < len; ++i) {
            task = this._tasks[i];
            stage.setRenderTarget(task.target);
            context.setProgram(task.getProgram(stage));
            stage.getAbstraction(task.getMainInputTexture(stage)).activate(0, false);
            if (!task.target) {
                stage.scissorRect = null;
                vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
                context.setVertexBufferAt(0, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
                context.setVertexBufferAt(1, vertexBuffer, 8, ContextGLVertexBufferFormat.FLOAT_2);
            }
            context.clear(0.0, 0.0, 0.0, 0.0);
            task.activate(stage, camera, depthTexture);
            context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
            context.drawIndices(ContextGLDrawMode.TRIANGLES, indexBuffer, 0, 6);
            task.deactivate(stage);
        }
        context.setTextureAt(0, null);
        context.setVertexBufferAt(0, null);
        context.setVertexBufferAt(1, null);
    };
    Filter3DRenderer.prototype.updateFilterSizes = function () {
        for (var i = 0; i < this._filters.length; ++i) {
            this._filters[i].textureWidth = this._rttManager.textureWidth;
            this._filters[i].textureHeight = this._rttManager.textureHeight;
        }
        this._filterSizesInvalid = true;
    };
    Filter3DRenderer.prototype.dispose = function () {
        this._rttManager.removeEventListener(RTTEvent.RESIZE, this._onRTTResizeDelegate);
        this._rttManager = null;
        this._stage = null;
    };
    return Filter3DRenderer;
})();
module.exports = Filter3DRenderer;

},{"awayjs-renderergl/lib/events/RTTEvent":"awayjs-renderergl/lib/events/RTTEvent","awayjs-renderergl/lib/managers/RTTBufferManager":"awayjs-renderergl/lib/managers/RTTBufferManager","awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/RendererBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Point = require("awayjs-core/lib/geom/Point");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var RendererEvent = require("awayjs-display/lib/events/RendererEvent");
var EntityCollector = require("awayjs-display/lib/traverse/EntityCollector");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var StageEvent = require("awayjs-stagegl/lib/events/StageEvent");
var StageManager = require("awayjs-stagegl/lib/managers/StageManager");
var RenderPool = require("awayjs-renderergl/lib/render/RenderPool");
var RenderableMergeSort = require("awayjs-renderergl/lib/sort/RenderableMergeSort");
/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
var RendererBase = (function (_super) {
    __extends(RendererBase, _super);
    /**
     * Creates a new RendererBase object.
     */
    function RendererBase(stage, renderClass, forceSoftware, profile, mode) {
        var _this = this;
        if (stage === void 0) { stage = null; }
        if (renderClass === void 0) { renderClass = null; }
        if (forceSoftware === void 0) { forceSoftware = false; }
        if (profile === void 0) { profile = "baseline"; }
        if (mode === void 0) { mode = "auto"; }
        _super.call(this);
        this._objectPools = new Object();
        this._abstractionPool = new Object();
        this._activeMasksConfig = new Array();
        this._registeredMasks = new Array();
        this._numUsedStreams = 0;
        this._numUsedTextures = 0;
        this._viewPort = new Rectangle();
        this._pBackBufferInvalid = true;
        this._pDepthTextureInvalid = true;
        this._depthPrepass = false;
        this._backgroundR = 0;
        this._backgroundG = 0;
        this._backgroundB = 0;
        this._backgroundAlpha = 1;
        this.textureRatioX = 1;
        this.textureRatioY = 1;
        this._pRttViewProjectionMatrix = new Matrix3D();
        this._localPos = new Point();
        this._globalPos = new Point();
        this._pScissorRect = new Rectangle();
        this._pNumElements = 0;
        this._disableColor = false;
        this._renderBlended = true;
        this._onViewportUpdatedDelegate = function (event) { return _this.onViewportUpdated(event); };
        this._onContextUpdateDelegate = function (event) { return _this.onContextUpdate(event); };
        //default sorting algorithm
        this.renderableSorter = new RenderableMergeSort();
        //set stage
        this._pStage = stage || StageManager.getInstance().getFreeStage(forceSoftware, profile, mode);
        this._pStage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.addEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
        /*
         if (_backgroundImageRenderer)
         _backgroundImageRenderer.stage = value;
         */
        if (this._pStage.context)
            this._pContext = this._pStage.context;
        for (var i in RendererBase._abstractionClassPool)
            this._objectPools[i] = new RenderPool(RendererBase._abstractionClassPool[i], this._pStage, renderClass);
    }
    Object.defineProperty(RendererBase.prototype, "renderBlended", {
        get: function () {
            return this._renderBlended;
        },
        set: function (value) {
            this._renderBlended = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "disableColor", {
        get: function () {
            return this._disableColor;
        },
        set: function (value) {
            this._disableColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "numElements", {
        /**
         *
         */
        get: function () {
            return this._pNumElements;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "viewPort", {
        /**
         * A viewPort rectangle equivalent of the Stage size and position.
         */
        get: function () {
            return this._viewPort;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "scissorRect", {
        /**
         * A scissor rectangle equivalent of the view size and position.
         */
        get: function () {
            return this._pScissorRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "x", {
        /**
         *
         */
        get: function () {
            return this._localPos.x;
        },
        set: function (value) {
            if (this.x == value)
                return;
            this._globalPos.x = this._localPos.x = value;
            this.updateGlobalPos();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "y", {
        /**
         *
         */
        get: function () {
            return this._localPos.y;
        },
        set: function (value) {
            if (this.y == value)
                return;
            this._globalPos.y = this._localPos.y = value;
            this.updateGlobalPos();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "width", {
        /**
         *
         */
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width == value)
                return;
            this._width = value;
            this._pScissorRect.width = value;
            if (this._pRttBufferManager)
                this._pRttBufferManager.viewWidth = value;
            this._pBackBufferInvalid = true;
            this._pDepthTextureInvalid = true;
            this.notifyScissorUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "height", {
        /**
         *
         */
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height == value)
                return;
            this._height = value;
            this._pScissorRect.height = value;
            if (this._pRttBufferManager)
                this._pRttBufferManager.viewHeight = value;
            this._pBackBufferInvalid = true;
            this._pDepthTextureInvalid = true;
            this.notifyScissorUpdate();
        },
        enumerable: true,
        configurable: true
    });
    RendererBase.prototype.getAbstraction = function (renderableOwner) {
        return (this._abstractionPool[renderableOwner.id] || (this._abstractionPool[renderableOwner.id] = new RendererBase._abstractionClassPool[renderableOwner.assetType](renderableOwner, this)));
    };
    /**
     *
     * @param image
     */
    RendererBase.prototype.clearAbstraction = function (renderableOwner) {
        this._abstractionPool[renderableOwner.id] = null;
    };
    /**
     * //TODO
     *
     * @param renderableClass
     * @returns RenderPool
     */
    RendererBase.prototype.getRenderPool = function (renderableOwner) {
        return this._objectPools[renderableOwner.assetType];
    };
    /**
     *
     * @param imageObjectClass
     */
    RendererBase.registerAbstraction = function (renderable, assetClass) {
        RendererBase._abstractionClassPool[assetClass.assetType] = renderable;
    };
    RendererBase.prototype.activatePass = function (renderable, pass, camera) {
        for (var i = pass.shader.numUsedStreams; i < this._numUsedStreams; i++)
            this._pContext.setVertexBufferAt(i, null);
        for (var i = pass.shader.numUsedTextures; i < this._numUsedTextures; i++)
            this._pContext.setTextureAt(i, null);
        //check program data is uploaded
        var programData = pass.shader.programData;
        if (!programData.program) {
            programData.program = this._pContext.createProgram();
            var vertexByteCode = (new AGALMiniAssembler().assemble("part vertex 1\n" + programData.vertexString + "endpart"))['vertex'].data;
            var fragmentByteCode = (new AGALMiniAssembler().assemble("part fragment 1\n" + programData.fragmentString + "endpart"))['fragment'].data;
            programData.program.upload(vertexByteCode, fragmentByteCode);
        }
        //set program data
        this._pContext.setProgram(programData.program);
        //activate shader object through renderable
        renderable._iActivate(pass, camera);
    };
    RendererBase.prototype.deactivatePass = function (renderable, pass) {
        //deactivate shader object
        renderable._iDeactivate(pass);
        this._numUsedStreams = pass.shader.numUsedStreams;
        this._numUsedTextures = pass.shader.numUsedTextures;
    };
    RendererBase.prototype._iCreateEntityCollector = function () {
        return new EntityCollector();
    };
    Object.defineProperty(RendererBase.prototype, "_iBackgroundR", {
        /**
         * The background color's red component, used when clearing.
         *
         * @private
         */
        get: function () {
            return this._backgroundR;
        },
        set: function (value) {
            if (this._backgroundR == value)
                return;
            this._backgroundR = value;
            this._pBackBufferInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "_iBackgroundG", {
        /**
         * The background color's green component, used when clearing.
         *
         * @private
         */
        get: function () {
            return this._backgroundG;
        },
        set: function (value) {
            if (this._backgroundG == value)
                return;
            this._backgroundG = value;
            this._pBackBufferInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "_iBackgroundB", {
        /**
         * The background color's blue component, used when clearing.
         *
         * @private
         */
        get: function () {
            return this._backgroundB;
        },
        set: function (value) {
            if (this._backgroundB == value)
                return;
            this._backgroundB = value;
            this._pBackBufferInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "context", {
        get: function () {
            return this._pContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "stage", {
        /**
         * The Stage that will provide the ContextGL used for rendering.
         */
        get: function () {
            return this._pStage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererBase.prototype, "shareContext", {
        /**
         * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
         * to share the same ContextGL object.
         */
        get: function () {
            return this._shareContext;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Disposes the resources used by the RendererBase.
     */
    RendererBase.prototype.dispose = function () {
        for (var id in this._abstractionPool)
            this._abstractionPool[id].clear();
        this._abstractionPool = null;
        this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
        this._pStage = null;
        this._pContext = null;
        /*
         if (_backgroundImageRenderer) {
         _backgroundImageRenderer.dispose();
         _backgroundImageRenderer = null;
         }
         */
    };
    RendererBase.prototype.render = function (entityCollector) {
        this._viewportDirty = false;
        this._scissorDirty = false;
    };
    /**
     * Renders the potentially visible geometry to the back buffer or texture.
     * @param entityCollector The EntityCollector object containing the potentially visible geometry.
     * @param target An option target texture to render to.
     * @param surfaceSelector The index of a CubeTexture's face to render to.
     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
     */
    RendererBase.prototype._iRender = function (entityCollector, target, scissorRect, surfaceSelector) {
        if (target === void 0) { target = null; }
        if (scissorRect === void 0) { scissorRect = null; }
        if (surfaceSelector === void 0) { surfaceSelector = 0; }
        //TODO refactor setTarget so that rendertextures are created before this check
        if (!this._pStage || !this._pContext)
            return;
        this._pRttViewProjectionMatrix.copyFrom(entityCollector.camera.viewProjection);
        this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);
        this.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);
        for (var i = 0; i < 8; ++i) {
            this._pContext.setVertexBufferAt(i, null);
            this._pContext.setTextureAt(i, null);
        }
    };
    RendererBase.prototype._iRenderCascades = function (entityCollector, target, numCascades, scissorRects, cameras) {
        this._applyCollector(entityCollector);
        this._pStage.setRenderTarget(target, true, 0);
        this._pContext.clear(1, 1, 1, 1, 1, 0);
        this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
        this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);
        var head = this._pOpaqueRenderableHead;
        var first = true;
        for (var i = numCascades - 1; i >= 0; --i) {
            this._pStage.scissorRect = scissorRects[i];
            //this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
            first = false;
        }
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);
        this._pStage.scissorRect = null;
    };
    RendererBase.prototype._applyCollector = function (entityCollector) {
        //reset head values
        this._pBlendedRenderableHead = null;
        this._pOpaqueRenderableHead = null;
        this._pNumElements = 0;
        //grab entity head
        var item = entityCollector.entityHead;
        //set temp values for entry point and camera forward vector
        this._pCamera = entityCollector.camera;
        this._iEntryPoint = this._pCamera.scenePosition;
        this._pCameraForward = this._pCamera.transform.forwardVector;
        while (item) {
            item.entity._applyRenderer(this);
            item = item.next;
        }
        //sort the resulting renderables
        if (this.renderableSorter) {
            this._pOpaqueRenderableHead = this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
            this._pBlendedRenderableHead = this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
        }
    };
    /**
     * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
     *
     * @param entityCollector The EntityCollector object containing the potentially visible geometry.
     * @param target An option target texture to render to.
     * @param surfaceSelector The index of a CubeTexture's face to render to.
     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
     */
    RendererBase.prototype.pExecuteRender = function (entityCollector, target, scissorRect, surfaceSelector) {
        if (target === void 0) { target = null; }
        if (scissorRect === void 0) { scissorRect = null; }
        if (surfaceSelector === void 0) { surfaceSelector = 0; }
        this._pStage.setRenderTarget(target, true, surfaceSelector);
        if ((target || !this._shareContext) && !this._depthPrepass)
            this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);
        this._pStage.scissorRect = scissorRect;
        /*
         if (_backgroundImageRenderer)
         _backgroundImageRenderer.render();
         */
        this._applyCollector(entityCollector);
        this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
        this.pDraw(entityCollector);
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        //this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie
        if (!this._shareContext) {
            if (this._snapshotRequired && this._snapshotBitmapImage2D) {
                this._pContext.drawToBitmapImage2D(this._snapshotBitmapImage2D);
                this._snapshotRequired = false;
            }
        }
        this._pStage.scissorRect = null;
    };
    /*
     * Will draw the renderer's output on next render to the provided bitmap data.
     * */
    RendererBase.prototype.queueSnapshot = function (bmd) {
        this._snapshotRequired = true;
        this._snapshotBitmapImage2D = bmd;
    };
    /**
     * Performs the actual drawing of geometry to the target.
     * @param entityCollector The EntityCollector object containing the potentially visible geometry.
     */
    RendererBase.prototype.pDraw = function (entityCollector) {
        this._pContext.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
        if (this._disableColor)
            this._pContext.setColorMask(false, false, false, false);
        this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);
        if (this._renderBlended)
            this.drawRenderables(this._pBlendedRenderableHead, entityCollector);
        if (this._disableColor)
            this._pContext.setColorMask(true, true, true, true);
    };
    //private drawCascadeRenderables(renderable:RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
    //{
    //	var renderable2:RenderableBase;
    //	var render:RenderBase;
    //	var pass:IPass;
    //
    //	while (renderable) {
    //		renderable2 = renderable;
    //		render = renderable.render;
    //		pass = render.passes[0] //assuming only one pass per material
    //
    //		this.activatePass(renderable, pass, camera);
    //
    //		do {
    //			// if completely in front, it will fall in a different cascade
    //			// do not use near and far planes
    //			if (!cullPlanes || renderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
    //				renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
    //			} else {
    //				renderable2.cascaded = true;
    //			}
    //
    //			renderable2 = renderable2.next;
    //
    //		} while (renderable2 && renderable2.render == render && !renderable2.cascaded);
    //
    //		this.deactivatePass(renderable, pass);
    //
    //		renderable = renderable2;
    //	}
    //}
    /**
     * Draw a list of renderables.
     *
     * @param renderables The renderables to draw.
     * @param entityCollector The EntityCollector containing all potentially visible information.
     */
    RendererBase.prototype.drawRenderables = function (renderable, entityCollector) {
        var i;
        var len;
        var renderable2;
        var render;
        var passes;
        var pass;
        var camera = entityCollector.camera;
        this._pContext.setStencilActions("frontAndBack", "always", "keep", "keep", "keep");
        this._registeredMasks.length = 0;
        var gl = this._pContext["_gl"];
        if (gl) {
            gl.disable(gl.STENCIL_TEST);
        }
        this._maskConfig = 0;
        while (renderable) {
            render = renderable.render;
            passes = render.passes;
            // otherwise this would result in depth rendered anyway because fragment shader kil is ignored
            if (this._disableColor && render._renderOwner.alphaThreshold != 0) {
                renderable2 = renderable;
                do {
                    renderable2 = renderable2.next;
                } while (renderable2 && renderable2.render == render);
            }
            else {
                if (this._activeMasksDirty || this._checkMasksConfig(renderable.masksConfig)) {
                    this._activeMasksConfig = renderable.masksConfig;
                    if (!this._activeMasksConfig.length) {
                        // disable stencil
                        if (gl) {
                            gl.disable(gl.STENCIL_TEST);
                            gl.stencilFunc(gl.ALWAYS, 0, 0xff);
                            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                        }
                    }
                    else {
                        this._renderMasks(renderable.sourceEntity._iAssignedMasks());
                    }
                    this._activeMasksDirty = false;
                }
                //iterate through each shader object
                len = passes.length;
                for (i = 0; i < len; i++) {
                    renderable2 = renderable;
                    pass = passes[i];
                    this.activatePass(renderable, pass, camera);
                    do {
                        if (renderable2.maskId !== -1) {
                            if (i == 0)
                                this._registerMask(renderable2);
                        }
                        else {
                            renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
                        }
                        renderable2 = renderable2.next;
                    } while (renderable2 && renderable2.render == render && !(this._activeMasksDirty = this._checkMasksConfig(renderable2.masksConfig)));
                    this.deactivatePass(renderable, pass);
                }
            }
            renderable = renderable2;
        }
    };
    /**
     * Assign the context once retrieved
     */
    RendererBase.prototype.onContextUpdate = function (event) {
        this._pContext = this._pStage.context;
    };
    Object.defineProperty(RendererBase.prototype, "_iBackgroundAlpha", {
        get: function () {
            return this._backgroundAlpha;
        },
        set: function (value) {
            if (this._backgroundAlpha == value)
                return;
            this._backgroundAlpha = value;
            this._pBackBufferInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    /*
     public get iBackground():Texture2DBase
     {
     return this._background;
     }
     */
    /*
     public set iBackground(value:Texture2DBase)
     {
     if (this._backgroundImageRenderer && !value) {
     this._backgroundImageRenderer.dispose();
     this._backgroundImageRenderer = null;
     }

     if (!this._backgroundImageRenderer && value)
     {

     this._backgroundImageRenderer = new BackgroundImageRenderer(this._pStage);

     }


     this._background = value;

     if (this._backgroundImageRenderer)
     this._backgroundImageRenderer.texture = value;
     }
     */
    /*
     public get backgroundImageRenderer():BackgroundImageRenderer
     {
     return _backgroundImageRenderer;
     }
     */
    /**
     * @private
     */
    RendererBase.prototype.notifyScissorUpdate = function () {
        if (this._scissorDirty)
            return;
        this._scissorDirty = true;
        if (!this._scissorUpdated)
            this._scissorUpdated = new RendererEvent(RendererEvent.SCISSOR_UPDATED);
        this.dispatchEvent(this._scissorUpdated);
    };
    /**
     * @private
     */
    RendererBase.prototype.notifyViewportUpdate = function () {
        if (this._viewportDirty)
            return;
        this._viewportDirty = true;
        if (!this._viewPortUpdated)
            this._viewPortUpdated = new RendererEvent(RendererEvent.VIEWPORT_UPDATED);
        this.dispatchEvent(this._viewPortUpdated);
    };
    /**
     *
     */
    RendererBase.prototype.onViewportUpdated = function (event) {
        this._viewPort = this._pStage.viewPort;
        //TODO stop firing viewport updated for every stagegl viewport change
        if (this._shareContext) {
            this._pScissorRect.x = this._globalPos.x - this._pStage.x;
            this._pScissorRect.y = this._globalPos.y - this._pStage.y;
            this.notifyScissorUpdate();
        }
        this.notifyViewportUpdate();
    };
    /**
     *
     */
    RendererBase.prototype.updateGlobalPos = function () {
        if (this._shareContext) {
            this._pScissorRect.x = this._globalPos.x - this._viewPort.x;
            this._pScissorRect.y = this._globalPos.y - this._viewPort.y;
        }
        else {
            this._pScissorRect.x = 0;
            this._pScissorRect.y = 0;
            this._viewPort.x = this._globalPos.x;
            this._viewPort.y = this._globalPos.y;
        }
        this.notifyScissorUpdate();
    };
    RendererBase.prototype._iApplyRenderableOwner = function (renderableOwner) {
        var renderable = this.getAbstraction(renderableOwner);
        var render = renderable.render;
        //set local vars for faster referencing
        renderable.renderId = render.renderId;
        renderable.renderOrderId = render.renderOrderId;
        renderable.cascaded = false;
        var entity = renderable.sourceEntity;
        var position = entity.scenePosition;
        // project onto camera's z-axis
        position = this._iEntryPoint.subtract(position);
        renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);
        renderable.maskId = entity._iAssignedMaskId();
        renderable.masksConfig = entity._iMasksConfig();
        //store reference to scene transform
        renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);
        if (render.requiresBlending) {
            renderable.next = this._pBlendedRenderableHead;
            this._pBlendedRenderableHead = renderable;
        }
        else {
            renderable.next = this._pOpaqueRenderableHead;
            this._pOpaqueRenderableHead = renderable;
        }
        this._pNumElements += renderable.subGeometryVO.subGeometry.numElements;
    };
    RendererBase.prototype._registerMask = function (obj) {
        //console.log("registerMask");
        this._registeredMasks.push(obj);
    };
    RendererBase.prototype._renderMasks = function (masks) {
        var gl = this._pContext["_gl"];
        //var oldRenderTarget = this._stage.renderTarget;
        //this._stage.setRenderTarget(this._image);
        //this._stage.clear();
        this._pContext.setColorMask(false, false, false, false);
        // TODO: Could we create masks within masks by providing a previous configID, and supply "clear/keep" on stencil fail
        //context.setStencilActions("frontAndBack", "always", "set", "set", "set");
        gl.enable(gl.STENCIL_TEST);
        this._maskConfig++;
        gl.stencilFunc(gl.ALWAYS, this._maskConfig, 0xff);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
        var numLayers = masks.length;
        var numRenderables = this._registeredMasks.length;
        var renderable;
        var children;
        var numChildren;
        var mask;
        for (var i = 0; i < numLayers; ++i) {
            if (i != 0) {
                gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
                gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
                this._maskConfig++;
            }
            children = masks[i];
            numChildren = children.length;
            for (var j = 0; j < numChildren; ++j) {
                mask = children[j];
                for (var k = 0; k < numRenderables; ++k) {
                    renderable = this._registeredMasks[k];
                    //console.log("testing for " + mask["hierarchicalMaskID"] + ", " + mask.name);
                    if (renderable.maskId == mask.id) {
                        //console.log("Rendering hierarchicalMaskID " + mask["hierarchicalMaskID"]);
                        this._drawMask(renderable);
                    }
                }
            }
        }
        gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        this._pContext.setColorMask(true, true, true, true);
        //this._stage.setRenderTarget(oldRenderTarget);
    };
    RendererBase.prototype._drawMask = function (renderable) {
        var render = renderable.render;
        var passes = render.passes;
        var len = passes.length;
        var pass = passes[len - 1];
        this.activatePass(renderable, pass, this._pCamera);
        // only render last pass for now
        renderable._iRender(pass, this._pCamera, this._pRttViewProjectionMatrix);
        this.deactivatePass(renderable, pass);
    };
    RendererBase.prototype._checkMasksConfig = function (masksConfig) {
        if (this._activeMasksConfig.length != masksConfig.length)
            return true;
        var numLayers = masksConfig.length;
        var numChildren;
        var childConfig;
        var activeNumChildren;
        var activeChildConfig;
        for (var i = 0; i < numLayers; i++) {
            childConfig = masksConfig[i];
            numChildren = childConfig.length;
            activeChildConfig = this._activeMasksConfig[i];
            activeNumChildren = activeChildConfig.length;
            if (activeNumChildren != numChildren)
                return true;
            for (var j = 0; j < numChildren; j++) {
                if (activeChildConfig[j] != childConfig[j])
                    return true;
            }
        }
        return false;
    };
    RendererBase._abstractionClassPool = new Object();
    return RendererBase;
})(EventDispatcher);
module.exports = RendererBase;

},{"awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-display/lib/events/RendererEvent":undefined,"awayjs-display/lib/traverse/EntityCollector":undefined,"awayjs-renderergl/lib/render/RenderPool":"awayjs-renderergl/lib/render/RenderPool","awayjs-renderergl/lib/sort/RenderableMergeSort":"awayjs-renderergl/lib/sort/RenderableMergeSort","awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/events/StageEvent":undefined,"awayjs-stagegl/lib/managers/StageManager":undefined}],"awayjs-renderergl/lib/RendererGL":[function(require,module,exports){
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var Skybox = require("awayjs-display/lib/entities/Skybox");
var Billboard = require("awayjs-display/lib/entities/Billboard");
var LineSegment = require("awayjs-display/lib/entities/LineSegment");
var CurveSubMesh = require("awayjs-display/lib/base/CurveSubMesh");
var CurveSubGeometry = require("awayjs-display/lib/base/CurveSubGeometry");
var LineSubMesh = require("awayjs-display/lib/base/LineSubMesh");
var LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
var TriangleSubMesh = require("awayjs-display/lib/base/TriangleSubMesh");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var Single2DTexture = require("awayjs-display/lib/textures/Single2DTexture");
var SingleCubeTexture = require("awayjs-display/lib/textures/SingleCubeTexture");
var Stage = require("awayjs-stagegl/lib/base/Stage");
var RendererBase = require("awayjs-renderergl/lib/RendererBase");
var RenderPool = require("awayjs-renderergl/lib/render/RenderPool");
var BasicMaterialRender = require("awayjs-renderergl/lib/render/BasicMaterialRender");
var SkyboxRender = require("awayjs-renderergl/lib/render/SkyboxRender");
var BillboardRenderable = require("awayjs-renderergl/lib/renderables/BillboardRenderable");
var LineSegmentRenderable = require("awayjs-renderergl/lib/renderables/LineSegmentRenderable");
var LineSubMeshRenderable = require("awayjs-renderergl/lib/renderables/LineSubMeshRenderable");
var TriangleSubMeshRenderable = require("awayjs-renderergl/lib/renderables/TriangleSubMeshRenderable");
var CurveSubMeshRenderable = require("awayjs-renderergl/lib/renderables/CurveSubMeshRenderable");
var SkyboxRenderable = require("awayjs-renderergl/lib/renderables/SkyboxRenderable");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
var CurveSubGeometryVO = require("awayjs-renderergl/lib/vos/CurveSubGeometryVO");
var LineSubGeometryVO = require("awayjs-renderergl/lib/vos/LineSubGeometryVO");
var TriangleSubGeometryVO = require("awayjs-renderergl/lib/vos/TriangleSubGeometryVO");
var Single2DTextureVO = require("awayjs-renderergl/lib/vos/Single2DTextureVO");
var SingleCubeTextureVO = require("awayjs-renderergl/lib/vos/SingleCubeTextureVO");
Stage.registerAbstraction(CurveSubGeometryVO, CurveSubGeometry);
Stage.registerAbstraction(LineSubGeometryVO, LineSubGeometry);
Stage.registerAbstraction(TriangleSubGeometryVO, TriangleSubGeometry);
RenderPool.registerAbstraction(BasicMaterialRender, BasicMaterial);
RenderPool.registerAbstraction(SkyboxRender, Skybox);
ShaderBase.registerAbstraction(Single2DTextureVO, Single2DTexture);
ShaderBase.registerAbstraction(SingleCubeTextureVO, SingleCubeTexture);
RendererBase.registerAbstraction(BillboardRenderable, Billboard);
RendererBase.registerAbstraction(LineSegmentRenderable, LineSegment);
RendererBase.registerAbstraction(TriangleSubMeshRenderable, TriangleSubMesh);
RendererBase.registerAbstraction(LineSubMeshRenderable, LineSubMesh);
RendererBase.registerAbstraction(CurveSubMeshRenderable, CurveSubMesh);
RendererBase.registerAbstraction(SkyboxRenderable, Skybox);
/**
 *
 * static shim
 */
var renderergl = (function () {
    function renderergl() {
    }
    renderergl.addDefaults = function () {
        RenderPool.registerAbstraction(BasicMaterialRender, BasicMaterial);
        RenderPool.registerAbstraction(SkyboxRender, Skybox);
    };
    renderergl.test = 0;
    renderergl.main = renderergl.addDefaults();
    return renderergl;
})();
module.exports = renderergl;

},{"awayjs-display/lib/base/CurveSubGeometry":undefined,"awayjs-display/lib/base/CurveSubMesh":undefined,"awayjs-display/lib/base/LineSubGeometry":undefined,"awayjs-display/lib/base/LineSubMesh":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-display/lib/base/TriangleSubMesh":undefined,"awayjs-display/lib/entities/Billboard":undefined,"awayjs-display/lib/entities/LineSegment":undefined,"awayjs-display/lib/entities/Skybox":undefined,"awayjs-display/lib/materials/BasicMaterial":undefined,"awayjs-display/lib/textures/Single2DTexture":undefined,"awayjs-display/lib/textures/SingleCubeTexture":undefined,"awayjs-renderergl/lib/RendererBase":"awayjs-renderergl/lib/RendererBase","awayjs-renderergl/lib/render/BasicMaterialRender":"awayjs-renderergl/lib/render/BasicMaterialRender","awayjs-renderergl/lib/render/RenderPool":"awayjs-renderergl/lib/render/RenderPool","awayjs-renderergl/lib/render/SkyboxRender":"awayjs-renderergl/lib/render/SkyboxRender","awayjs-renderergl/lib/renderables/BillboardRenderable":"awayjs-renderergl/lib/renderables/BillboardRenderable","awayjs-renderergl/lib/renderables/CurveSubMeshRenderable":"awayjs-renderergl/lib/renderables/CurveSubMeshRenderable","awayjs-renderergl/lib/renderables/LineSegmentRenderable":"awayjs-renderergl/lib/renderables/LineSegmentRenderable","awayjs-renderergl/lib/renderables/LineSubMeshRenderable":"awayjs-renderergl/lib/renderables/LineSubMeshRenderable","awayjs-renderergl/lib/renderables/SkyboxRenderable":"awayjs-renderergl/lib/renderables/SkyboxRenderable","awayjs-renderergl/lib/renderables/TriangleSubMeshRenderable":"awayjs-renderergl/lib/renderables/TriangleSubMeshRenderable","awayjs-renderergl/lib/shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","awayjs-renderergl/lib/vos/CurveSubGeometryVO":"awayjs-renderergl/lib/vos/CurveSubGeometryVO","awayjs-renderergl/lib/vos/LineSubGeometryVO":"awayjs-renderergl/lib/vos/LineSubGeometryVO","awayjs-renderergl/lib/vos/Single2DTextureVO":"awayjs-renderergl/lib/vos/Single2DTextureVO","awayjs-renderergl/lib/vos/SingleCubeTextureVO":"awayjs-renderergl/lib/vos/SingleCubeTextureVO","awayjs-renderergl/lib/vos/TriangleSubGeometryVO":"awayjs-renderergl/lib/vos/TriangleSubGeometryVO","awayjs-stagegl/lib/base/Stage":undefined}],"awayjs-renderergl/lib/animators/AnimationSetBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AnimationSetError = require("awayjs-renderergl/lib/errors/AnimationSetError");
/**
 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
 *
 * @see away.animators.AnimatorBase
 */
var AnimationSetBase = (function (_super) {
    __extends(AnimationSetBase, _super);
    function AnimationSetBase() {
        _super.call(this);
        this._animations = new Array();
        this._animationNames = new Array();
        this._animationDictionary = new Object();
    }
    /**
     * Retrieves a temporary GPU register that's still free.
     *
     * @param exclude An array of non-free temporary registers.
     * @param excludeAnother An additional register that's not free.
     * @return A temporary register that can be used.
     */
    AnimationSetBase.prototype._pFindTempReg = function (exclude, excludeAnother) {
        if (excludeAnother === void 0) { excludeAnother = null; }
        var i = 0;
        var reg;
        while (true) {
            reg = "vt" + i;
            if (exclude.indexOf(reg) == -1 && excludeAnother != reg)
                return reg;
            ++i;
        }
        // can't be reached
        return null;
    };
    Object.defineProperty(AnimationSetBase.prototype, "usesCPU", {
        /**
         * Indicates whether the properties of the animation data contained within the set combined with
         * the vertex registers already in use on shading materials allows the animation data to utilise
         * GPU calls.
         */
        get: function () {
            return this._usesCPU;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called by the material to reset the GPU indicator before testing whether register space in the shader
     * is available for running GPU-based animation code.
     *
     * @private
     */
    AnimationSetBase.prototype.resetGPUCompatibility = function () {
        this._usesCPU = false;
    };
    AnimationSetBase.prototype.cancelGPUCompatibility = function () {
        this._usesCPU = true;
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALVertexCode = function (shader) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.activate = function (shader, stage) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.deactivate = function (shader, stage) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALFragmentCode = function (shader, shadedTarget) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALUVCode = function (shader) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.doneAGALCode = function (shader) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(AnimationSetBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AnimationSetBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationSetBase.prototype, "animations", {
        /**
         * Returns a vector of animation state objects that make up the contents of the animation data set.
         */
        get: function () {
            return this._animations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationSetBase.prototype, "animationNames", {
        /**
         * Returns a vector of animation state objects that make up the contents of the animation data set.
         */
        get: function () {
            return this._animationNames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check to determine whether a state is registered in the animation set under the given name.
     *
     * @param stateName The name of the animation state object to be checked.
     */
    AnimationSetBase.prototype.hasAnimation = function (name) {
        return this._animationDictionary[name] != null;
    };
    /**
     * Retrieves the animation state object registered in the animation data set under the given name.
     *
     * @param stateName The name of the animation state object to be retrieved.
     */
    AnimationSetBase.prototype.getAnimation = function (name) {
        return this._animationDictionary[name];
    };
    /**
     * Adds an animation state object to the aniamtion data set under the given name.
     *
     * @param stateName The name under which the animation state object will be stored.
     * @param animationState The animation state object to be staored in the set.
     */
    AnimationSetBase.prototype.addAnimation = function (node) {
        if (this._animationDictionary[node.name])
            throw new AnimationSetError("root node name '" + node.name + "' already exists in the set");
        this._animationDictionary[node.name] = node;
        this._animations.push(node);
        this._animationNames.push(node.name);
    };
    /**
     * Cleans up any resources used by the current object.
     */
    AnimationSetBase.prototype.dispose = function () {
    };
    AnimationSetBase.assetType = "[asset AnimationSet]";
    return AnimationSetBase;
})(AssetBase);
module.exports = AnimationSetBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined,"awayjs-renderergl/lib/errors/AnimationSetError":"awayjs-renderergl/lib/errors/AnimationSetError"}],"awayjs-renderergl/lib/animators/AnimatorBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var getTimer = require("awayjs-core/lib/utils/getTimer");
var AnimatorEvent = require("awayjs-renderergl/lib/events/AnimatorEvent");
/**
 * Dispatched when playback of an animation inside the animator object starts.
 *
 * @eventType away3d.events.AnimatorEvent
 */
//[Event(name="start", type="away3d.events.AnimatorEvent")]
/**
 * Dispatched when playback of an animation inside the animator object stops.
 *
 * @eventType away3d.events.AnimatorEvent
 */
//[Event(name="stop", type="away3d.events.AnimatorEvent")]
/**
 * Dispatched when playback of an animation reaches the end of an animation.
 *
 * @eventType away3d.events.AnimatorEvent
 */
//[Event(name="cycle_complete", type="away3d.events.AnimatorEvent")]
/**
 * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
 *
 * @see away.animators.AnimationSetBase
 */
var AnimatorBase = (function (_super) {
    __extends(AnimatorBase, _super);
    /**
     * Creates a new <code>AnimatorBase</code> object.
     *
     * @param animationSet The animation data set to be used by the animator object.
     */
    function AnimatorBase(animationSet) {
        _super.call(this);
        this._autoUpdate = true;
        this._time = 0;
        this._playbackSpeed = 1;
        this._pOwners = new Array();
        this._pAbsoluteTime = 0;
        this._animationStates = new Object();
        /**
         * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
         *
         * @see away.animators.IAnimationState#positionDelta
         */
        this.updatePosition = true;
        this._pAnimationSet = animationSet;
        this._broadcaster = new RequestAnimationFrame(this.onEnterFrame, this);
    }
    AnimatorBase.prototype.getAnimationState = function (node) {
        var className = node.stateClass;
        var uID = node.id;
        if (this._animationStates[uID] == null)
            this._animationStates[uID] = new className(this, node);
        return this._animationStates[uID];
    };
    AnimatorBase.prototype.getAnimationStateByName = function (name) {
        return this.getAnimationState(this._pAnimationSet.getAnimation(name));
    };
    Object.defineProperty(AnimatorBase.prototype, "absoluteTime", {
        /**
         * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
         *
         * @see #time
         * @see #playbackSpeed
         */
        get: function () {
            return this._pAbsoluteTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "animationSet", {
        /**
         * Returns the animation data set in use by the animator.
         */
        get: function () {
            return this._pAnimationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "activeState", {
        /**
         * Returns the current active animation state.
         */
        get: function () {
            return this._pActiveState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "activeAnimation", {
        /**
         * Returns the current active animation node.
         */
        get: function () {
            return this._pAnimationSet.getAnimation(this._pActiveAnimationName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "activeAnimationName", {
        /**
         * Returns the current active animation node.
         */
        get: function () {
            return this._pActiveAnimationName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "autoUpdate", {
        /**
         * Determines whether the animators internal update mechanisms are active. Used in cases
         * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
         * Defaults to true.
         *
         * @see #time
         * @see #update()
         */
        get: function () {
            return this._autoUpdate;
        },
        set: function (value) {
            if (this._autoUpdate == value)
                return;
            this._autoUpdate = value;
            if (this._autoUpdate)
                this.start();
            else
                this.stop();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "time", {
        /**
         * Gets and sets the internal time clock of the animator.
         */
        get: function () {
            return this._time;
        },
        set: function (value /*int*/) {
            if (this._time == value)
                return;
            this.update(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the animation phase of the current active state's animation clip(s).
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    AnimatorBase.prototype.phase = function (value) {
        this._pActiveState.phase(value);
    };
    Object.defineProperty(AnimatorBase.prototype, "playbackSpeed", {
        /**
         * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
         */
        get: function () {
            return this._playbackSpeed;
        },
        set: function (value) {
            this._playbackSpeed = value;
        },
        enumerable: true,
        configurable: true
    });
    AnimatorBase.prototype.setRenderState = function (shader, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        throw new AbstractMethodError();
    };
    /**
     * Resumes the automatic playback clock controling the active state of the animator.
     */
    AnimatorBase.prototype.start = function () {
        if (this._isPlaying || !this._autoUpdate)
            return;
        this._time = this._pAbsoluteTime = getTimer();
        this._isPlaying = true;
        this._broadcaster.start();
        if (!this.hasEventListener(AnimatorEvent.START))
            return;
        if (this._startEvent == null)
            this._startEvent = new AnimatorEvent(AnimatorEvent.START, this);
        this.dispatchEvent(this._startEvent);
    };
    /**
     * Pauses the automatic playback clock of the animator, in case manual updates are required via the
     * <code>time</code> property or <code>update()</code> method.
     *
     * @see #time
     * @see #update()
     */
    AnimatorBase.prototype.stop = function () {
        if (!this._isPlaying)
            return;
        this._isPlaying = false;
        this._broadcaster.stop();
        if (!this.hasEventListener(AnimatorEvent.STOP))
            return;
        if (this._stopEvent == null)
            this._stopEvent = new AnimatorEvent(AnimatorEvent.STOP, this);
        this.dispatchEvent(this._stopEvent);
    };
    /**
     * Provides a way to manually update the active state of the animator when automatic
     * updates are disabled.
     *
     * @see #stop()
     * @see #autoUpdate
     */
    AnimatorBase.prototype.update = function (time /*int*/) {
        var dt = (time - this._time) * this.playbackSpeed;
        this._pUpdateDeltaTime(dt);
        this._time = time;
    };
    AnimatorBase.prototype.reset = function (name, offset) {
        if (offset === void 0) { offset = 0; }
        this.getAnimationState(this._pAnimationSet.getAnimation(name)).offset(offset + this._pAbsoluteTime);
    };
    /**
     * Used by the mesh object to which the animator is applied, registers the owner for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.addOwner = function (mesh) {
        this._pOwners.push(mesh);
    };
    /**
     * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.removeOwner = function (mesh) {
        this._pOwners.splice(this._pOwners.indexOf(mesh), 1);
    };
    /**
     * Internal abstract method called when the time delta property of the animator's contents requires updating.
     *
     * @private
     */
    AnimatorBase.prototype._pUpdateDeltaTime = function (dt) {
        this._pAbsoluteTime += dt;
        this._pActiveState.update(this._pAbsoluteTime);
        if (this.updatePosition)
            this.applyPositionDelta();
    };
    /**
     * Enter frame event handler for automatically updating the active state of the animator.
     */
    AnimatorBase.prototype.onEnterFrame = function (event) {
        if (event === void 0) { event = null; }
        this.update(getTimer());
    };
    AnimatorBase.prototype.applyPositionDelta = function () {
        var delta = this._pActiveState.positionDelta;
        var dist = delta.length;
        var len /*uint*/;
        if (dist > 0) {
            len = this._pOwners.length;
            for (var i = 0; i < len; ++i)
                this._pOwners[i].transform.translateLocal(delta, dist);
        }
    };
    /**
     *  for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.dispatchCycleEvent = function () {
        if (this.hasEventListener(AnimatorEvent.CYCLE_COMPLETE)) {
            if (this._cycleEvent == null)
                this._cycleEvent = new AnimatorEvent(AnimatorEvent.CYCLE_COMPLETE, this);
            this.dispatchEvent(this._cycleEvent);
        }
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.clone = function () {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.dispose = function () {
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.testGPUCompatibility = function (shader) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(AnimatorBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AnimatorBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    AnimatorBase.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        //nothing to do here
        return sourceSubGeometry;
    };
    AnimatorBase.assetType = "[asset Animator]";
    return AnimatorBase;
})(AssetBase);
module.exports = AnimatorBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined,"awayjs-core/lib/utils/RequestAnimationFrame":undefined,"awayjs-core/lib/utils/getTimer":undefined,"awayjs-renderergl/lib/events/AnimatorEvent":"awayjs-renderergl/lib/events/AnimatorEvent"}],"awayjs-renderergl/lib/animators/ParticleAnimationSet":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
var AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
var AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
var ParticleAnimationData = require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
var ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleTimeNode = require("awayjs-renderergl/lib/animators/nodes/ParticleTimeNode");
/**
 * The animation data set used by particle-based animators, containing particle animation data.
 *
 * @see away.animators.ParticleAnimator
 */
var ParticleAnimationSet = (function (_super) {
    __extends(ParticleAnimationSet, _super);
    /**
     * Creates a new <code>ParticleAnimationSet</code>
     *
     * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
     * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
     * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
     */
    function ParticleAnimationSet(usesDuration, usesLooping, usesDelay) {
        if (usesDuration === void 0) { usesDuration = false; }
        if (usesLooping === void 0) { usesLooping = false; }
        if (usesDelay === void 0) { usesDelay = false; }
        _super.call(this);
        this._animationSubGeometries = new Object();
        this._particleNodes = new Array();
        this._localDynamicNodes = new Array();
        this._localStaticNodes = new Array();
        this._totalLenOfOneVertex = 0;
        //automatically add a particle time node to the set
        this.addAnimation(this._timeNode = new ParticleTimeNode(usesDuration, usesLooping, usesDelay));
    }
    Object.defineProperty(ParticleAnimationSet.prototype, "particleNodes", {
        /**
         * Returns a vector of the particle animation nodes contained within the set.
         */
        get: function () {
            return this._particleNodes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.addAnimation = function (node) {
        var i /*int*/;
        var n = node;
        n._iProcessAnimationSetting(this);
        if (n.mode == ParticlePropertiesMode.LOCAL_STATIC) {
            n._iDataOffset = this._totalLenOfOneVertex;
            this._totalLenOfOneVertex += n.dataLength;
            this._localStaticNodes.push(n);
        }
        else if (n.mode == ParticlePropertiesMode.LOCAL_DYNAMIC)
            this._localDynamicNodes.push(n);
        for (i = this._particleNodes.length - 1; i >= 0; i--) {
            if (this._particleNodes[i].priority <= n.priority)
                break;
        }
        this._particleNodes.splice(i + 1, 0, n);
        _super.prototype.addAnimation.call(this, node);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.activate = function (shader, stage) {
        //			this._iAnimationRegisterCache = pass.animationRegisterCache;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.deactivate = function (shader, stage) {
        //			var context:IContextGL = <IContextGL> stage.context;
        //			var offset:number /*int*/ = this._iAnimationRegisterCache.vertexAttributesOffset;
        //			var used:number /*int*/ = this._iAnimationRegisterCache.numUsedStreams;
        //			for (var i:number /*int*/ = offset; i < used; i++)
        //				context.setVertexBufferAt(i, null);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALVertexCode = function (shader) {
        //grab animationRegisterCache from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterCache = shader.animationRegisterCache;
        if (this._iAnimationRegisterCache == null)
            this._iAnimationRegisterCache = shader.animationRegisterCache = new AnimationRegisterCache(shader.profile);
        //reset animationRegisterCache
        this._iAnimationRegisterCache.vertexConstantOffset = shader.numUsedVertexConstants;
        this._iAnimationRegisterCache.vertexAttributesOffset = shader.numUsedStreams;
        this._iAnimationRegisterCache.varyingsOffset = shader.numUsedVaryings;
        this._iAnimationRegisterCache.fragmentConstantOffset = shader.numUsedFragmentConstants;
        this._iAnimationRegisterCache.hasUVNode = this.hasUVNode;
        this._iAnimationRegisterCache.needVelocity = this.needVelocity;
        this._iAnimationRegisterCache.hasBillboard = this.hasBillboard;
        this._iAnimationRegisterCache.sourceRegisters = shader.animatableAttributes;
        this._iAnimationRegisterCache.targetRegisters = shader.animationTargetRegisters;
        this._iAnimationRegisterCache.needFragmentAnimation = shader.usesFragmentAnimation;
        this._iAnimationRegisterCache.needUVAnimation = !shader.usesUVTransform;
        this._iAnimationRegisterCache.hasColorAddNode = this.hasColorAddNode;
        this._iAnimationRegisterCache.hasColorMulNode = this.hasColorMulNode;
        this._iAnimationRegisterCache.reset();
        var code = "";
        code += this._iAnimationRegisterCache.getInitCode();
        var node;
        var i /*int*/;
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority < ParticleAnimationSet.POST_PRIORITY)
                code += node.getAGALVertexCode(shader, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.getCombinationCode();
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shader, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.initColorRegisters();
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shader, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.getColorPassCode();
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALUVCode = function (shader) {
        var code = "";
        if (this.hasUVNode) {
            this._iAnimationRegisterCache.setUVSourceAndTarget(shader.uvSource, shader.uvTarget);
            code += "mov " + this._iAnimationRegisterCache.uvTarget + ".xy," + this._iAnimationRegisterCache.uvAttribute.toString() + "\n";
            var node;
            for (var i = 0; i < this._particleNodes.length; i++)
                node = this._particleNodes[i];
            code += node.getAGALUVCode(shader, this._iAnimationRegisterCache);
            code += "mov " + this._iAnimationRegisterCache.uvVar.toString() + "," + this._iAnimationRegisterCache.uvTarget + ".xy\n";
        }
        else
            code += "mov " + shader.uvTarget + "," + shader.uvSource + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALFragmentCode = function (shader, shadedTarget) {
        return this._iAnimationRegisterCache.getColorCombinationCode(shadedTarget);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.doneAGALCode = function (shader) {
        this._iAnimationRegisterCache.setDataLength();
        //set vertexZeroConst,vertexOneConst,vertexTwoConst
        this._iAnimationRegisterCache.setVertexConst(this._iAnimationRegisterCache.vertexZeroConst.index, 0, 1, 2, 0);
    };
    Object.defineProperty(ParticleAnimationSet.prototype, "usesCPU", {
        /**
         * @inheritDoc
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.cancelGPUCompatibility = function () {
    };
    ParticleAnimationSet.prototype.dispose = function () {
        for (var key in this._animationSubGeometries)
            this._animationSubGeometries[key].dispose();
        _super.prototype.dispose.call(this);
    };
    ParticleAnimationSet.prototype.getAnimationSubGeometry = function (subMesh) {
        var mesh = subMesh.parentMesh;
        var animationSubGeometry = (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
        if (animationSubGeometry)
            return animationSubGeometry;
        this._iGenerateAnimationSubGeometries(mesh);
        return (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
    };
    /** @private */
    ParticleAnimationSet.prototype._iGenerateAnimationSubGeometries = function (mesh) {
        if (this.initParticleFunc == null)
            throw (new Error("no initParticleFunc set"));
        var geometry = mesh.geometry;
        if (!geometry)
            throw (new Error("Particle animation can only be performed on a ParticleGeometry object"));
        var i /*int*/, j /*int*/, k /*int*/;
        var animationSubGeometry;
        var newAnimationSubGeometry = false;
        var subGeometry;
        var subMesh;
        var localNode;
        for (i = 0; i < mesh.subMeshes.length; i++) {
            subMesh = mesh.subMeshes[i];
            subGeometry = subMesh.subGeometry;
            if (mesh.shareAnimationGeometry) {
                animationSubGeometry = this._animationSubGeometries[subGeometry.id];
                if (animationSubGeometry)
                    continue;
            }
            animationSubGeometry = new AnimationSubGeometry();
            if (mesh.shareAnimationGeometry)
                this._animationSubGeometries[subGeometry.id] = animationSubGeometry;
            else
                this._animationSubGeometries[subMesh.id] = animationSubGeometry;
            newAnimationSubGeometry = true;
            //create the vertexData vector that will be used for local node data
            animationSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
        }
        if (!newAnimationSubGeometry)
            return;
        var particles = geometry.particles;
        var particlesLength = particles.length;
        var numParticles = geometry.numParticles;
        var particleProperties = new ParticleProperties();
        var particle;
        var oneDataLen /*int*/;
        var oneDataOffset /*int*/;
        var counterForVertex /*int*/;
        var counterForOneData /*int*/;
        var oneData;
        var numVertices /*uint*/;
        var vertexData;
        var vertexLength /*uint*/;
        var startingOffset /*uint*/;
        var vertexOffset /*uint*/;
        //default values for particle param
        particleProperties.total = numParticles;
        particleProperties.startTime = 0;
        particleProperties.duration = 1000;
        particleProperties.delay = 0.1;
        i = 0;
        j = 0;
        while (i < numParticles) {
            particleProperties.index = i;
            //call the init on the particle parameters
            this.initParticleFunc.call(this.initParticleScope, particleProperties);
            for (k = 0; k < this._localStaticNodes.length; k++)
                this._localStaticNodes[k]._iGeneratePropertyOfOneParticle(particleProperties);
            while (j < particlesLength && (particle = particles[j]).particleIndex == i) {
                for (k = 0; k < mesh.subMeshes.length; k++) {
                    subMesh = mesh.subMeshes[k];
                    if (subMesh.subGeometry == particle.subGeometry) {
                        animationSubGeometry = (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
                        break;
                    }
                }
                numVertices = particle.numVertices;
                vertexData = animationSubGeometry.vertexData;
                vertexLength = numVertices * this._totalLenOfOneVertex;
                startingOffset = animationSubGeometry.numProcessedVertices * this._totalLenOfOneVertex;
                for (k = 0; k < this._localStaticNodes.length; k++) {
                    localNode = this._localStaticNodes[k];
                    oneData = localNode.oneData;
                    oneDataLen = localNode.dataLength;
                    oneDataOffset = startingOffset + localNode._iDataOffset;
                    for (counterForVertex = 0; counterForVertex < vertexLength; counterForVertex += this._totalLenOfOneVertex) {
                        vertexOffset = oneDataOffset + counterForVertex;
                        for (counterForOneData = 0; counterForOneData < oneDataLen; counterForOneData++)
                            vertexData[vertexOffset + counterForOneData] = oneData[counterForOneData];
                    }
                }
                //store particle properties if they need to be retreived for dynamic local nodes
                if (this._localDynamicNodes.length)
                    animationSubGeometry.animationParticles.push(new ParticleAnimationData(i, particleProperties.startTime, particleProperties.duration, particleProperties.delay, particle));
                animationSubGeometry.numProcessedVertices += numVertices;
                //next index
                j++;
            }
            //next particle
            i++;
        }
    };
    /**
     * Property used by particle nodes that require compilers at the end of the shader
     */
    ParticleAnimationSet.POST_PRIORITY = 9;
    /**
     * Property used by particle nodes that require color compilers
     */
    ParticleAnimationSet.COLOR_PRIORITY = 18;
    return ParticleAnimationSet;
})(AnimationSetBase);
module.exports = ParticleAnimationSet;

},{"awayjs-renderergl/lib/animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase","awayjs-renderergl/lib/animators/data/AnimationRegisterCache":"awayjs-renderergl/lib/animators/data/AnimationRegisterCache","awayjs-renderergl/lib/animators/data/AnimationSubGeometry":"awayjs-renderergl/lib/animators/data/AnimationSubGeometry","awayjs-renderergl/lib/animators/data/ParticleAnimationData":"awayjs-renderergl/lib/animators/data/ParticleAnimationData","awayjs-renderergl/lib/animators/data/ParticleProperties":"awayjs-renderergl/lib/animators/data/ParticleProperties","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleTimeNode":"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode"}],"awayjs-renderergl/lib/animators/ParticleAnimator":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
var AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
/**
 * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent mesh is particle geometry
 *
 * @see away.base.ParticleGeometry
 */
var ParticleAnimator = (function (_super) {
    __extends(ParticleAnimator, _super);
    /**
     * Creates a new <code>ParticleAnimator</code> object.
     *
     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
     */
    function ParticleAnimator(particleAnimationSet) {
        _super.call(this, particleAnimationSet);
        this._animationParticleStates = new Array();
        this._animatorParticleStates = new Array();
        this._timeParticleStates = new Array();
        this._totalLenOfOneVertex = 0;
        this._animatorSubGeometries = new Object();
        this._particleAnimationSet = particleAnimationSet;
        var state;
        var node;
        for (var i = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
            node = this._particleAnimationSet.particleNodes[i];
            state = this.getAnimationState(node);
            if (node.mode == ParticlePropertiesMode.LOCAL_DYNAMIC) {
                this._animatorParticleStates.push(state);
                node._iDataOffset = this._totalLenOfOneVertex;
                this._totalLenOfOneVertex += node.dataLength;
            }
            else {
                this._animationParticleStates.push(state);
            }
            if (state.needUpdateTime)
                this._timeParticleStates.push(state);
        }
    }
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.clone = function () {
        return new ParticleAnimator(this._particleAnimationSet);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.setRenderState = function (shader, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        var animationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;
        var subMesh = renderable.subMesh;
        var state;
        var i;
        if (!subMesh)
            throw (new Error("Must be subMesh"));
        //process animation sub geometries
        var animationSubGeometry = this._particleAnimationSet.getAnimationSubGeometry(subMesh);
        for (i = 0; i < this._animationParticleStates.length; i++)
            this._animationParticleStates[i].setRenderState(stage, renderable, animationSubGeometry, animationRegisterCache, camera);
        //process animator subgeometries
        var animatorSubGeometry = this.getAnimatorSubGeometry(subMesh);
        for (i = 0; i < this._animatorParticleStates.length; i++)
            this._animatorParticleStates[i].setRenderState(stage, renderable, animatorSubGeometry, animationRegisterCache, camera);
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);
        if (animationRegisterCache.numFragmentConstant > 0)
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.testGPUCompatibility = function (shader) {
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.start = function () {
        _super.prototype.start.call(this);
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype._pUpdateDeltaTime = function (dt) {
        this._pAbsoluteTime += dt;
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].update(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.resetTime = function (offset) {
        if (offset === void 0) { offset = 0; }
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
        this.update(this.time);
    };
    ParticleAnimator.prototype.dispose = function () {
        for (var key in this._animatorSubGeometries)
            this._animatorSubGeometries[key].dispose();
    };
    ParticleAnimator.prototype.getAnimatorSubGeometry = function (subMesh) {
        if (!this._animatorParticleStates.length)
            return;
        var subGeometry = subMesh.subGeometry;
        var animatorSubGeometry = this._animatorSubGeometries[subGeometry.id] = new AnimationSubGeometry();
        //create the vertexData vector that will be used for local state data
        animatorSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
        //pass the particles data to the animator subGeometry
        animatorSubGeometry.animationParticles = this._particleAnimationSet.getAnimationSubGeometry(subMesh).animationParticles;
    };
    return ParticleAnimator;
})(AnimatorBase);
module.exports = ParticleAnimator;

},{"awayjs-renderergl/lib/animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","awayjs-renderergl/lib/animators/data/AnimationSubGeometry":"awayjs-renderergl/lib/animators/data/AnimationSubGeometry","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/animators/SkeletonAnimationSet":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
/**
 * The animation data set used by skeleton-based animators, containing skeleton animation data.
 *
 * @see away.animators.SkeletonAnimator
 */
var SkeletonAnimationSet = (function (_super) {
    __extends(SkeletonAnimationSet, _super);
    /**
     * Creates a new <code>SkeletonAnimationSet</code> object.
     *
     * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
     */
    function SkeletonAnimationSet(jointsPerVertex) {
        if (jointsPerVertex === void 0) { jointsPerVertex = 4; }
        _super.call(this);
        this._jointsPerVertex = jointsPerVertex;
    }
    Object.defineProperty(SkeletonAnimationSet.prototype, "jointsPerVertex", {
        /**
         * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
         * maximum allowed value is 4.
         */
        get: function () {
            return this._jointsPerVertex;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALVertexCode = function (shader) {
        var len = shader.animatableAttributes.length;
        var indexOffset0 = shader.numUsedVertexConstants;
        var indexOffset1 = indexOffset0 + 1;
        var indexOffset2 = indexOffset0 + 2;
        var indexStream = "va" + shader.numUsedStreams;
        var weightStream = "va" + (shader.numUsedStreams + 1);
        var indices = [indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w"];
        var weights = [weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w"];
        var temp1 = this._pFindTempReg(shader.animationTargetRegisters);
        var temp2 = this._pFindTempReg(shader.animationTargetRegisters, temp1);
        var dot = "dp4";
        var code = "";
        for (var i = 0; i < len; ++i) {
            var src = shader.animatableAttributes[i];
            for (var j = 0; j < this._jointsPerVertex; ++j) {
                code += dot + " " + temp1 + ".x, " + src + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" + dot + " " + temp1 + ".y, " + src + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" + dot + " " + temp1 + ".z, " + src + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" + "mov " + temp1 + ".w, " + src + ".w\n" + "mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight
                // add or mov to target. Need to write to a temp reg first, because an output can be a target
                if (j == 0)
                    code += "mov " + temp2 + ", " + temp1 + "\n";
                else
                    code += "add " + temp2 + ", " + temp2 + ", " + temp1 + "\n";
            }
            // switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
            dot = "dp3";
            code += "mov " + shader.animationTargetRegisters[i] + ", " + temp2 + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.activate = function (shader, stage) {
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.deactivate = function (shader, stage) {
        //			var streamOffset:number /*uint*/ = pass.numUsedStreams;
        //			var context:IContextGL = <IContextGL> stage.context;
        //			context.setVertexBufferAt(streamOffset, null);
        //			context.setVertexBufferAt(streamOffset + 1, null);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALFragmentCode = function (shader, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALUVCode = function (shader) {
        return "mov " + shader.uvTarget + "," + shader.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.doneAGALCode = function (shader) {
    };
    return SkeletonAnimationSet;
})(AnimationSetBase);
module.exports = SkeletonAnimationSet;

},{"awayjs-renderergl/lib/animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase"}],"awayjs-renderergl/lib/animators/SkeletonAnimator":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateEvent = require("awayjs-renderergl/lib/events/AnimationStateEvent");
/**
 * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
var SkeletonAnimator = (function (_super) {
    __extends(SkeletonAnimator, _super);
    /**
     * Creates a new <code>SkeletonAnimator</code> object.
     *
     * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
     * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
     * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
     */
    function SkeletonAnimator(animationSet, skeleton, forceCPU) {
        var _this = this;
        if (forceCPU === void 0) { forceCPU = false; }
        _super.call(this, animationSet);
        this._globalPose = new SkeletonPose();
        this._morphedSubGeometry = new Object();
        this._morphedSubGeometryDirty = new Object();
        this._skeleton = skeleton;
        this._forceCPU = forceCPU;
        this._jointsPerVertex = animationSet.jointsPerVertex;
        this._numJoints = this._skeleton.numJoints;
        this._globalMatrices = new Float32Array(this._numJoints * 12);
        var j = 0;
        for (var i = 0; i < this._numJoints; ++i) {
            this._globalMatrices[j++] = 1;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 1;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 1;
            this._globalMatrices[j++] = 0;
        }
        this._onTransitionCompleteDelegate = function (event) { return _this.onTransitionComplete(event); };
        this._onIndicesUpdateDelegate = function (event) { return _this.onIndicesUpdate(event); };
        this._onVerticesUpdateDelegate = function (event) { return _this.onVerticesUpdate(event); };
    }
    Object.defineProperty(SkeletonAnimator.prototype, "globalMatrices", {
        /**
         * returns the calculated global matrices of the current skeleton pose.
         *
         * @see #globalPose
         */
        get: function () {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();
            return this._globalMatrices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "globalPose", {
        /**
         * returns the current skeleton pose output from the animator.
         *
         * @see away.animators.data.SkeletonPose
         */
        get: function () {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();
            return this._globalPose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "skeleton", {
        /**
         * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
         * skinned geoemtry to which skeleon animator is applied.
         */
        get: function () {
            return this._skeleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "forceCPU", {
        /**
         * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
         * Defaults to false.
         */
        get: function () {
            return this._forceCPU;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "useCondensedIndices", {
        /**
         * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
         * by condensing the number of joint index values required per mesh. Only applicable to
         * skeleton animations that utilise more than one mesh object. Defaults to false.
         */
        get: function () {
            return this._useCondensedIndices;
        },
        set: function (value) {
            this._useCondensedIndices = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.clone = function () {
        /* The cast to SkeletonAnimationSet should never fail, as _animationSet can only be set
         through the constructor, which will only accept a SkeletonAnimationSet. */
        return new SkeletonAnimator(this._pAnimationSet, this._skeleton, this._forceCPU);
    };
    /**
     * Plays an animation state registered with the given name in the animation data set.
     *
     * @param name The data set name of the animation state to be played.
     * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
     * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
     */
    SkeletonAnimator.prototype.play = function (name, transition, offset) {
        if (transition === void 0) { transition = null; }
        if (offset === void 0) { offset = NaN; }
        if (this._pActiveAnimationName == name)
            return;
        this._pActiveAnimationName = name;
        if (!this._pAnimationSet.hasAnimation(name))
            throw new Error("Animation root node " + name + " not found!");
        if (transition && this._pActiveNode) {
            //setup the transition
            this._pActiveNode = transition.getAnimationNode(this, this._pActiveNode, this._pAnimationSet.getAnimation(name), this._pAbsoluteTime);
            this._pActiveNode.addEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
        }
        else
            this._pActiveNode = this._pAnimationSet.getAnimation(name);
        this._pActiveState = this.getAnimationState(this._pActiveNode);
        if (this.updatePosition) {
            //update straight away to reset position deltas
            this._pActiveState.update(this._pAbsoluteTime);
            this._pActiveState.positionDelta;
        }
        this._activeSkeletonState = this._pActiveState;
        this.start();
        //apply a time offset if specified
        if (!isNaN(offset))
            this.reset(name, offset);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.setRenderState = function (shader, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        // do on request of globalProperties
        if (this._globalPropertiesDirty)
            this.updateGlobalProperties();
        var subGeometry = renderable.subMesh.subGeometry;
        subGeometry.useCondensedIndices = this._useCondensedIndices;
        if (this._useCondensedIndices) {
            // using a condensed data set
            this.updateCondensedMatrices(subGeometry.condensedIndexLookUp);
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._condensedMatrices, this._condensedMatrices.length / 4);
        }
        else {
            if (this._pAnimationSet.usesCPU) {
                if (this._morphedSubGeometryDirty[subGeometry.id])
                    this.morphSubGeometry(renderable, subGeometry);
                return;
            }
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._globalMatrices, this._numJoints * 3);
        }
        shader.jointIndexIndex = vertexStreamOffset++;
        shader.jointWeightIndex = vertexStreamOffset++;
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.testGPUCompatibility = function (shader) {
        if (!this._useCondensedIndices && (this._forceCPU || this._jointsPerVertex > 4 || shader.numUsedVertexConstants + this._numJoints * 3 > 128))
            this._pAnimationSet.cancelGPUCompatibility();
    };
    /**
     * Applies the calculated time delta to the active animation state node or state transition object.
     */
    SkeletonAnimator.prototype._pUpdateDeltaTime = function (dt) {
        _super.prototype._pUpdateDeltaTime.call(this, dt);
        //invalidate pose matrices
        this._globalPropertiesDirty = true;
        //trigger geometry invalidation if using CPU animation
        if (this._pAnimationSet.usesCPU)
            for (var key in this._morphedSubGeometryDirty)
                this._morphedSubGeometryDirty[key] = true;
    };
    SkeletonAnimator.prototype.updateCondensedMatrices = function (condensedIndexLookUp) {
        var j = 0, k = 0;
        var len = condensedIndexLookUp.length;
        var srcIndex /*uint*/;
        this._condensedMatrices = new Float32Array(len * 12);
        for (var i = 0; i < len; i++) {
            srcIndex = condensedIndexLookUp[i] * 12; //12 required for the three 4-component vectors that store the matrix
            k = 12;
            while (k--)
                this._condensedMatrices[j++] = this._globalMatrices[srcIndex++];
        }
    };
    SkeletonAnimator.prototype.updateGlobalProperties = function () {
        this._globalPropertiesDirty = false;
        //get global pose
        this.localToGlobalPose(this._activeSkeletonState.getSkeletonPose(this._skeleton), this._globalPose, this._skeleton);
        // convert pose to matrix
        var mtxOffset = 0;
        var globalPoses = this._globalPose.jointPoses;
        var raw;
        var ox, oy, oz, ow;
        var xy2, xz2, xw2;
        var yz2, yw2, zw2;
        var n11, n12, n13;
        var n21, n22, n23;
        var n31, n32, n33;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
        var joints = this._skeleton.joints;
        var pose;
        var quat;
        var vec;
        var t;
        for (var i = 0; i < this._numJoints; ++i) {
            pose = globalPoses[i];
            quat = pose.orientation;
            vec = pose.translation;
            ox = quat.x;
            oy = quat.y;
            oz = quat.z;
            ow = quat.w;
            xy2 = (t = 2.0 * ox) * oy;
            xz2 = t * oz;
            xw2 = t * ow;
            yz2 = (t = 2.0 * oy) * oz;
            yw2 = t * ow;
            zw2 = 2.0 * oz * ow;
            yz2 = 2.0 * oy * oz;
            yw2 = 2.0 * oy * ow;
            zw2 = 2.0 * oz * ow;
            ox *= ox;
            oy *= oy;
            oz *= oz;
            ow *= ow;
            n11 = (t = ox - oy) - oz + ow;
            n12 = xy2 - zw2;
            n13 = xz2 + yw2;
            n21 = xy2 + zw2;
            n22 = -t - oz + ow;
            n23 = yz2 - xw2;
            n31 = xz2 - yw2;
            n32 = yz2 + xw2;
            n33 = -ox - oy + oz + ow;
            // prepend inverse bind pose
            raw = joints[i].inverseBindPose;
            m11 = raw[0];
            m12 = raw[4];
            m13 = raw[8];
            m14 = raw[12];
            m21 = raw[1];
            m22 = raw[5];
            m23 = raw[9];
            m24 = raw[13];
            m31 = raw[2];
            m32 = raw[6];
            m33 = raw[10];
            m34 = raw[14];
            this._globalMatrices[mtxOffset] = n11 * m11 + n12 * m21 + n13 * m31;
            this._globalMatrices[mtxOffset + 1] = n11 * m12 + n12 * m22 + n13 * m32;
            this._globalMatrices[mtxOffset + 2] = n11 * m13 + n12 * m23 + n13 * m33;
            this._globalMatrices[mtxOffset + 3] = n11 * m14 + n12 * m24 + n13 * m34 + vec.x;
            this._globalMatrices[mtxOffset + 4] = n21 * m11 + n22 * m21 + n23 * m31;
            this._globalMatrices[mtxOffset + 5] = n21 * m12 + n22 * m22 + n23 * m32;
            this._globalMatrices[mtxOffset + 6] = n21 * m13 + n22 * m23 + n23 * m33;
            this._globalMatrices[mtxOffset + 7] = n21 * m14 + n22 * m24 + n23 * m34 + vec.y;
            this._globalMatrices[mtxOffset + 8] = n31 * m11 + n32 * m21 + n33 * m31;
            this._globalMatrices[mtxOffset + 9] = n31 * m12 + n32 * m22 + n33 * m32;
            this._globalMatrices[mtxOffset + 10] = n31 * m13 + n32 * m23 + n33 * m33;
            this._globalMatrices[mtxOffset + 11] = n31 * m14 + n32 * m24 + n33 * m34 + vec.z;
            mtxOffset = mtxOffset + 12;
        }
    };
    SkeletonAnimator.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        this._morphedSubGeometryDirty[sourceSubGeometry.id] = true;
        //early out for GPU animations
        if (!this._pAnimationSet.usesCPU)
            return sourceSubGeometry;
        var targetSubGeometry;
        if (!(targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id])) {
            //not yet stored
            targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id] = sourceSubGeometry.clone();
            //turn off auto calculations on the morphed geometry
            targetSubGeometry.autoDeriveNormals = false;
            targetSubGeometry.autoDeriveTangents = false;
            targetSubGeometry.autoDeriveUVs = false;
            //add event listeners for any changes in UV values on the source geometry
            sourceSubGeometry.addEventListener(SubGeometryEvent.INVALIDATE_INDICES, this._onIndicesUpdateDelegate);
            sourceSubGeometry.addEventListener(SubGeometryEvent.INVALIDATE_VERTICES, this._onVerticesUpdateDelegate);
        }
        return targetSubGeometry;
    };
    /**
     * If the animation can't be performed on GPU, transform vertices manually
     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
     * @param pass The material pass for which we need to transform the vertices
     */
    SkeletonAnimator.prototype.morphSubGeometry = function (renderable, sourceSubGeometry) {
        this._morphedSubGeometryDirty[sourceSubGeometry.id] = false;
        var numVertices = sourceSubGeometry.numVertices;
        var sourcePositions = sourceSubGeometry.positions.get(numVertices);
        var sourceNormals = sourceSubGeometry.normals.get(numVertices);
        var sourceTangents = sourceSubGeometry.tangents.get(numVertices);
        var jointIndices = sourceSubGeometry.jointIndices.get(numVertices);
        var jointWeights = sourceSubGeometry.jointWeights.get(numVertices);
        var targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id];
        var targetPositions = targetSubGeometry.positions.get(numVertices);
        var targetNormals = targetSubGeometry.normals.get(numVertices);
        var targetTangents = targetSubGeometry.tangents.get(numVertices);
        var index = 0;
        var j = 0;
        var k /*uint*/;
        var vx, vy, vz;
        var nx, ny, nz;
        var tx, ty, tz;
        var len = sourcePositions.length;
        var weight;
        var vertX, vertY, vertZ;
        var normX, normY, normZ;
        var tangX, tangY, tangZ;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
        while (index < len) {
            vertX = sourcePositions[index];
            vertY = sourcePositions[index + 1];
            vertZ = sourcePositions[index + 2];
            normX = sourceNormals[index];
            normY = sourceNormals[index + 1];
            normZ = sourceNormals[index + 2];
            tangX = sourceTangents[index];
            tangY = sourceTangents[index + 1];
            tangZ = sourceTangents[index + 2];
            vx = 0;
            vy = 0;
            vz = 0;
            nx = 0;
            ny = 0;
            nz = 0;
            tx = 0;
            ty = 0;
            tz = 0;
            k = 0;
            while (k < this._jointsPerVertex) {
                weight = jointWeights[j];
                if (weight > 0) {
                    // implicit /3*12 (/3 because indices are multiplied by 3 for gpu matrix access, *12 because it's the matrix size)
                    var mtxOffset = jointIndices[j++] << 2;
                    m11 = this._globalMatrices[mtxOffset];
                    m12 = this._globalMatrices[mtxOffset + 1];
                    m13 = this._globalMatrices[mtxOffset + 2];
                    m14 = this._globalMatrices[mtxOffset + 3];
                    m21 = this._globalMatrices[mtxOffset + 4];
                    m22 = this._globalMatrices[mtxOffset + 5];
                    m23 = this._globalMatrices[mtxOffset + 6];
                    m24 = this._globalMatrices[mtxOffset + 7];
                    m31 = this._globalMatrices[mtxOffset + 8];
                    m32 = this._globalMatrices[mtxOffset + 9];
                    m33 = this._globalMatrices[mtxOffset + 10];
                    m34 = this._globalMatrices[mtxOffset + 11];
                    vx += weight * (m11 * vertX + m12 * vertY + m13 * vertZ + m14);
                    vy += weight * (m21 * vertX + m22 * vertY + m23 * vertZ + m24);
                    vz += weight * (m31 * vertX + m32 * vertY + m33 * vertZ + m34);
                    nx += weight * (m11 * normX + m12 * normY + m13 * normZ);
                    ny += weight * (m21 * normX + m22 * normY + m23 * normZ);
                    nz += weight * (m31 * normX + m32 * normY + m33 * normZ);
                    tx += weight * (m11 * tangX + m12 * tangY + m13 * tangZ);
                    ty += weight * (m21 * tangX + m22 * tangY + m23 * tangZ);
                    tz += weight * (m31 * tangX + m32 * tangY + m33 * tangZ);
                    ++k;
                }
                else {
                    j += (this._jointsPerVertex - k);
                    k = this._jointsPerVertex;
                }
            }
            targetPositions[index] = vx;
            targetPositions[index + 1] = vy;
            targetPositions[index + 2] = vz;
            targetNormals[index] = nx;
            targetNormals[index + 1] = ny;
            targetNormals[index + 2] = nz;
            targetTangents[index] = tx;
            targetTangents[index + 1] = ty;
            targetTangents[index + 2] = tz;
            index += 3;
        }
        targetSubGeometry.setPositions(targetPositions);
        targetSubGeometry.setNormals(targetNormals);
        targetSubGeometry.setTangents(targetTangents);
    };
    /**
     * Converts a local hierarchical skeleton pose to a global pose
     * @param targetPose The SkeletonPose object that will contain the global pose.
     * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
     */
    SkeletonAnimator.prototype.localToGlobalPose = function (sourcePose, targetPose, skeleton) {
        var globalPoses = targetPose.jointPoses;
        var globalJointPose;
        var joints = skeleton.joints;
        var len = sourcePose.numJointPoses;
        var jointPoses = sourcePose.jointPoses;
        var parentIndex /*int*/;
        var joint;
        var parentPose;
        var pose;
        var or;
        var tr;
        var t;
        var q;
        var x1, y1, z1, w1;
        var x2, y2, z2, w2;
        var x3, y3, z3;
        // :s
        if (globalPoses.length != len)
            globalPoses.length = len;
        for (var i = 0; i < len; ++i) {
            globalJointPose = globalPoses[i];
            if (globalJointPose == null)
                globalJointPose = globalPoses[i] = new JointPose();
            joint = joints[i];
            parentIndex = joint.parentIndex;
            pose = jointPoses[i];
            q = globalJointPose.orientation;
            t = globalJointPose.translation;
            if (parentIndex < 0) {
                tr = pose.translation;
                or = pose.orientation;
                q.x = or.x;
                q.y = or.y;
                q.z = or.z;
                q.w = or.w;
                t.x = tr.x;
                t.y = tr.y;
                t.z = tr.z;
            }
            else {
                // append parent pose
                parentPose = globalPoses[parentIndex];
                // rotate point
                or = parentPose.orientation;
                tr = pose.translation;
                x2 = or.x;
                y2 = or.y;
                z2 = or.z;
                w2 = or.w;
                x3 = tr.x;
                y3 = tr.y;
                z3 = tr.z;
                w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                x1 = w2 * x3 + y2 * z3 - z2 * y3;
                y1 = w2 * y3 - x2 * z3 + z2 * x3;
                z1 = w2 * z3 + x2 * y3 - y2 * x3;
                // append parent translation
                tr = parentPose.translation;
                t.x = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr.x;
                t.y = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr.y;
                t.z = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr.z;
                // append parent orientation
                x1 = or.x;
                y1 = or.y;
                z1 = or.z;
                w1 = or.w;
                or = pose.orientation;
                x2 = or.x;
                y2 = or.y;
                z2 = or.z;
                w2 = or.w;
                q.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                q.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                q.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                q.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            }
        }
    };
    SkeletonAnimator.prototype.onTransitionComplete = function (event) {
        if (event.type == AnimationStateEvent.TRANSITION_COMPLETE) {
            event.animationNode.removeEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            //if this is the current active state transition, revert control to the active node
            if (this._pActiveState == event.animationState) {
                this._pActiveNode = this._pAnimationSet.getAnimation(this._pActiveAnimationName);
                this._pActiveState = this.getAnimationState(this._pActiveNode);
                this._activeSkeletonState = this._pActiveState;
            }
        }
    };
    SkeletonAnimator.prototype.onIndicesUpdate = function (event) {
        var subGeometry = event.target;
        this._morphedSubGeometry[subGeometry.id].setIndices(subGeometry.indices);
    };
    SkeletonAnimator.prototype.onVerticesUpdate = function (event) {
        var subGeometry = event.target;
        var morphGeometry = this._morphedSubGeometry[subGeometry.id];
        switch (event.attributesView) {
            case subGeometry.uvs:
                morphGeometry.setUVs(subGeometry.uvs.get(subGeometry.numVertices));
                break;
            case subGeometry.secondaryUVs:
                morphGeometry.setSecondaryUVs(subGeometry.secondaryUVs.get(subGeometry.numVertices));
                break;
        }
    };
    return SkeletonAnimator;
})(AnimatorBase);
module.exports = SkeletonAnimator;

},{"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-renderergl/lib/animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-renderergl/lib/animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","awayjs-renderergl/lib/events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/animators/VertexAnimationSet":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
var VertexAnimationMode = require("awayjs-renderergl/lib/animators/data/VertexAnimationMode");
/**
 * The animation data set used by vertex-based animators, containing vertex animation state data.
 *
 * @see VertexAnimator
 */
var VertexAnimationSet = (function (_super) {
    __extends(VertexAnimationSet, _super);
    /**
     * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
     */
    //		public get useNormals():boolean
    //		{
    //			return this._uploadNormals;
    //		}
    /**
     * Creates a new <code>VertexAnimationSet</code> object.
     *
     * @param numPoses The number of poses made available at once to the GPU animation code.
     * @param blendMode Optional value for setting the animation mode of the vertex animator object.
     *
     * @see away3d.animators.data.VertexAnimationMode
     */
    function VertexAnimationSet(numPoses, blendMode) {
        if (numPoses === void 0) { numPoses = 2; }
        if (blendMode === void 0) { blendMode = "absolute"; }
        _super.call(this);
        this._numPoses = numPoses;
        this._blendMode = blendMode;
    }
    Object.defineProperty(VertexAnimationSet.prototype, "numPoses", {
        /**
         * Returns the number of poses made available at once to the GPU animation code.
         */
        get: function () {
            return this._numPoses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexAnimationSet.prototype, "blendMode", {
        /**
         * Returns the active blend mode of the vertex animator object.
         */
        get: function () {
            return this._blendMode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALVertexCode = function (shader) {
        if (this._blendMode == VertexAnimationMode.ABSOLUTE)
            return this.getAbsoluteAGALCode(shader);
        else
            return this.getAdditiveAGALCode(shader);
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.activate = function (shader, stage) {
        //			var uID:number = pass._iUniqueId;
        //			this._uploadNormals = <boolean> this._useNormals[uID];
        //			this._uploadTangents = <boolean> this._useTangents[uID];
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.deactivate = function (shader, stage) {
        //			var uID:number = pass._iUniqueId;
        //			var index:number /*uint*/ = this._streamIndices[uID];
        //			var context:IContextGL = <IContextGL> stage.context;
        //			context.setVertexBufferAt(index, null);
        //			if (this._uploadNormals)
        //				context.setVertexBufferAt(index + 1, null);
        //			if (this._uploadTangents)
        //				context.setVertexBufferAt(index + 2, null);
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALFragmentCode = function (shader, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALUVCode = function (shader) {
        return "mov " + shader.uvTarget + "," + shader.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.doneAGALCode = function (shader) {
    };
    /**
     * Generates the vertex AGAL code for absolute blending.
     */
    VertexAnimationSet.prototype.getAbsoluteAGALCode = function (shader) {
        var code = "";
        var temp1 = this._pFindTempReg(shader.animationTargetRegisters);
        var temp2 = this._pFindTempReg(shader.animationTargetRegisters, temp1);
        var regs = new Array("x", "y", "z", "w");
        var len = shader.animatableAttributes.length;
        var constantReg = "vc" + shader.numUsedVertexConstants;
        if (len > 2)
            len = 2;
        var streamIndex = shader.numUsedStreams;
        for (var i = 0; i < len; ++i) {
            code += "mul " + temp1 + ", " + shader.animatableAttributes[i] + ", " + constantReg + "." + regs[0] + "\n";
            for (var j = 1; j < this._numPoses; ++j) {
                code += "mul " + temp2 + ", va" + streamIndex + ", " + constantReg + "." + regs[j] + "\n";
                if (j < this._numPoses - 1)
                    code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";
                ++streamIndex;
            }
            code += "add " + shader.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
        }
        // add code for bitangents if tangents are used
        if (shader.tangentDependencies > 0 || shader.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + shader.animatableAttributes[2] + ", " + shader.animationTargetRegisters[1] + "\n" + "mul " + temp1 + ", " + shader.animationTargetRegisters[1] + ", " + temp1 + ".x\n" + "sub " + shader.animationTargetRegisters[2] + ", " + shader.animationTargetRegisters[2] + ", " + temp1 + "\n";
        }
        return code;
    };
    /**
     * Generates the vertex AGAL code for additive blending.
     */
    VertexAnimationSet.prototype.getAdditiveAGALCode = function (shader) {
        var code = "";
        var len = shader.animatableAttributes.length;
        var regs = ["x", "y", "z", "w"];
        var temp1 = this._pFindTempReg(shader.animationTargetRegisters);
        var k /*uint*/;
        var streamIndex = shader.numUsedStreams;
        if (len > 2)
            len = 2;
        code += "mov  " + shader.animationTargetRegisters[0] + ", " + shader.animatableAttributes[0] + "\n";
        if (shader.normalDependencies > 0)
            code += "mov " + shader.animationTargetRegisters[1] + ", " + shader.animatableAttributes[1] + "\n";
        for (var i = 0; i < len; ++i) {
            for (var j = 0; j < this._numPoses; ++j) {
                code += "mul " + temp1 + ", va" + (streamIndex + k) + ", vc" + shader.numUsedVertexConstants + "." + regs[j] + "\n" + "add " + shader.animationTargetRegisters[i] + ", " + shader.animationTargetRegisters[i] + ", " + temp1 + "\n";
                k++;
            }
        }
        if (shader.tangentDependencies > 0 || shader.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + shader.animatableAttributes[2] + ", " + shader.animationTargetRegisters[1] + "\n" + "mul " + temp1 + ", " + shader.animationTargetRegisters[1] + ", " + temp1 + ".x\n" + "sub " + shader.animationTargetRegisters[2] + ", " + shader.animatableAttributes[2] + ", " + temp1 + "\n";
        }
        return code;
    };
    return VertexAnimationSet;
})(AnimationSetBase);
module.exports = VertexAnimationSet;

},{"awayjs-renderergl/lib/animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase","awayjs-renderergl/lib/animators/data/VertexAnimationMode":"awayjs-renderergl/lib/animators/data/VertexAnimationMode"}],"awayjs-renderergl/lib/animators/VertexAnimator":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
var VertexAnimationMode = require("awayjs-renderergl/lib/animators/data/VertexAnimationMode");
/**
 * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
var VertexAnimator = (function (_super) {
    __extends(VertexAnimator, _super);
    /**
     * Creates a new <code>VertexAnimator</code> object.
     *
     * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
     */
    function VertexAnimator(vertexAnimationSet) {
        _super.call(this, vertexAnimationSet);
        this._poses = new Array();
        this._weights = new Float32Array([1, 0, 0, 0]);
        this._vertexAnimationSet = vertexAnimationSet;
        this._numPoses = vertexAnimationSet.numPoses;
        this._blendMode = vertexAnimationSet.blendMode;
    }
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype.clone = function () {
        return new VertexAnimator(this._vertexAnimationSet);
    };
    /**
     * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
     * @param sequenceName The name of the clip to be played.
     */
    VertexAnimator.prototype.play = function (name, transition, offset) {
        if (transition === void 0) { transition = null; }
        if (offset === void 0) { offset = NaN; }
        if (this._pActiveAnimationName == name)
            return;
        this._pActiveAnimationName = name;
        //TODO: implement transitions in vertex animator
        if (!this._pAnimationSet.hasAnimation(name))
            throw new Error("Animation root node " + name + " not found!");
        this._pActiveNode = this._pAnimationSet.getAnimation(name);
        this._pActiveState = this.getAnimationState(this._pActiveNode);
        if (this.updatePosition) {
            //update straight away to reset position deltas
            this._pActiveState.update(this._pAbsoluteTime);
            this._pActiveState.positionDelta;
        }
        this._activeVertexState = this._pActiveState;
        this.start();
        //apply a time offset if specified
        if (!isNaN(offset))
            this.reset(name, offset);
    };
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype._pUpdateDeltaTime = function (dt) {
        _super.prototype._pUpdateDeltaTime.call(this, dt);
        var geometryFlag = false;
        if (this._poses[0] != this._activeVertexState.currentGeometry) {
            this._poses[0] = this._activeVertexState.currentGeometry;
            geometryFlag = true;
        }
        if (this._poses[1] != this._activeVertexState.nextGeometry) {
            this._poses[1] = this._activeVertexState.nextGeometry;
            geometryFlag = true;
        }
        this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);
        if (geometryFlag) {
            //invalidate meshes
            var mesh;
            var len = this._pOwners.length;
            for (var i = 0; i < len; i++) {
                mesh = this._pOwners[i];
                mesh._iInvalidateRenderableGeometries();
            }
        }
    };
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype.setRenderState = function (shader, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        // todo: add code for when running on cpu
        // this type of animation can only be SubMesh
        var subMesh = renderable.subMesh;
        var subGeom = subMesh.subGeometry;
        // if no poses defined, set temp data
        if (!this._poses.length) {
            this.setNullPose(shader, subGeom, stage, vertexConstantOffset, vertexStreamOffset);
            return;
        }
        var i /*uint*/;
        var len = this._numPoses;
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);
        if (this._blendMode == VertexAnimationMode.ABSOLUTE)
            i = 1;
        else
            i = 0;
        var subGeometryVO;
        for (; i < len; ++i) {
            subGeom = this._poses[i].subGeometries[subMesh._iIndex] || subMesh.subGeometry;
            subGeometryVO = stage.getAbstraction(subGeom);
            subGeometryVO._indexMappings = stage.getAbstraction(subMesh.subGeometry).getIndexMappings();
            subGeometryVO.activateVertexBufferVO(vertexStreamOffset++, subGeom.positions);
            if (shader.normalDependencies > 0)
                subGeometryVO.activateVertexBufferVO(vertexStreamOffset++, subGeom.normals);
        }
    };
    VertexAnimator.prototype.setNullPose = function (shader, subGeometry, stage, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);
        var subGeometryVO = stage.getAbstraction(subGeometry);
        if (this._blendMode == VertexAnimationMode.ABSOLUTE) {
            var len = this._numPoses;
            for (var i = 1; i < len; ++i) {
                subGeometryVO.activateVertexBufferVO(vertexStreamOffset++, subGeometry.positions);
                if (shader.normalDependencies > 0)
                    subGeometryVO.activateVertexBufferVO(vertexStreamOffset++, subGeometry.normals);
            }
        }
        // todo: set temp data for additive?
    };
    /**
     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
     * Needs to be called if gpu code is potentially required.
     */
    VertexAnimator.prototype.testGPUCompatibility = function (shader) {
    };
    VertexAnimator.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        if (this._blendMode == VertexAnimationMode.ABSOLUTE && this._poses.length)
            return this._poses[0].subGeometries[renderable.subMesh._iIndex] || sourceSubGeometry;
        //nothing to do here
        return sourceSubGeometry;
    };
    return VertexAnimator;
})(AnimatorBase);
module.exports = VertexAnimator;

},{"awayjs-renderergl/lib/animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","awayjs-renderergl/lib/animators/data/VertexAnimationMode":"awayjs-renderergl/lib/animators/data/VertexAnimationMode","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/animators/data/AnimationRegisterCache":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
/**
 * ...
 */
var AnimationRegisterCache = (function (_super) {
    __extends(AnimationRegisterCache, _super);
    function AnimationRegisterCache(profile) {
        _super.call(this, profile);
        this.indexDictionary = new Object();
    }
    AnimationRegisterCache.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.rotationRegisters = new Array();
        this.positionAttribute = this.getRegisterFromString(this.sourceRegisters[0]);
        this.scaleAndRotateTarget = this.getRegisterFromString(this.targetRegisters[0]);
        this.addVertexTempUsages(this.scaleAndRotateTarget, 1);
        for (var i = 1; i < this.targetRegisters.length; i++) {
            this.rotationRegisters.push(this.getRegisterFromString(this.targetRegisters[i]));
            this.addVertexTempUsages(this.rotationRegisters[i - 1], 1);
        }
        this.scaleAndRotateTarget = new ShaderRegisterElement(this.scaleAndRotateTarget.regName, this.scaleAndRotateTarget.index); //only use xyz, w is used as vertexLife
        //allot const register
        this.vertexZeroConst = this.getFreeVertexConstant();
        this.vertexZeroConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 0);
        this.vertexOneConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 1);
        this.vertexTwoConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 2);
        //allot temp register
        this.positionTarget = this.getFreeVertexVectorTemp();
        this.addVertexTempUsages(this.positionTarget, 1);
        this.positionTarget = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
        if (this.needVelocity) {
            this.velocityTarget = this.getFreeVertexVectorTemp();
            this.addVertexTempUsages(this.velocityTarget, 1);
            this.velocityTarget = new ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index);
            this.vertexTime = new ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index, 3);
            this.vertexLife = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index, 3);
        }
        else {
            var tempTime = this.getFreeVertexVectorTemp();
            this.addVertexTempUsages(tempTime, 1);
            this.vertexTime = new ShaderRegisterElement(tempTime.regName, tempTime.index, 0);
            this.vertexLife = new ShaderRegisterElement(tempTime.regName, tempTime.index, 1);
        }
    };
    AnimationRegisterCache.prototype.setUVSourceAndTarget = function (UVAttribute, UVVaring) {
        this.uvVar = this.getRegisterFromString(UVVaring);
        this.uvAttribute = this.getRegisterFromString(UVAttribute);
        //uv action is processed after normal actions,so use offsetTarget as uvTarget
        this.uvTarget = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
    };
    AnimationRegisterCache.prototype.setRegisterIndex = function (node, parameterIndex /*int*/, registerIndex /*int*/) {
        //8 should be enough for any node.
        var t = this.indexDictionary[node.id];
        if (t == null)
            t = this.indexDictionary[node.id] = new Array(8);
        t[parameterIndex] = registerIndex;
    };
    AnimationRegisterCache.prototype.getRegisterIndex = function (node, parameterIndex /*int*/) {
        return this.indexDictionary[node.id][parameterIndex];
    };
    AnimationRegisterCache.prototype.getInitCode = function () {
        var len = this.sourceRegisters.length;
        var code = "";
        for (var i = 0; i < len; i++)
            code += "mov " + this.targetRegisters[i] + "," + this.sourceRegisters[i] + "\n";
        code += "mov " + this.positionTarget + ".xyz," + this.vertexZeroConst.toString() + "\n";
        if (this.needVelocity)
            code += "mov " + this.velocityTarget + ".xyz," + this.vertexZeroConst.toString() + "\n";
        return code;
    };
    AnimationRegisterCache.prototype.getCombinationCode = function () {
        return "add " + this.scaleAndRotateTarget + ".xyz," + this.scaleAndRotateTarget + ".xyz," + this.positionTarget + ".xyz\n";
    };
    AnimationRegisterCache.prototype.initColorRegisters = function () {
        var code = "";
        if (this.hasColorMulNode) {
            this.colorMulTarget = this.getFreeVertexVectorTemp();
            this.addVertexTempUsages(this.colorMulTarget, 1);
            this.colorMulVary = this.getFreeVarying();
            code += "mov " + this.colorMulTarget + "," + this.vertexOneConst + "\n";
        }
        if (this.hasColorAddNode) {
            this.colorAddTarget = this.getFreeVertexVectorTemp();
            this.addVertexTempUsages(this.colorAddTarget, 1);
            this.colorAddVary = this.getFreeVarying();
            code += "mov " + this.colorAddTarget + "," + this.vertexZeroConst + "\n";
        }
        return code;
    };
    AnimationRegisterCache.prototype.getColorPassCode = function () {
        var code = "";
        if (this.needFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
            if (this.hasColorMulNode)
                code += "mov " + this.colorMulVary + "," + this.colorMulTarget + "\n";
            if (this.hasColorAddNode)
                code += "mov " + this.colorAddVary + "," + this.colorAddTarget + "\n";
        }
        return code;
    };
    AnimationRegisterCache.prototype.getColorCombinationCode = function (shadedTarget) {
        var code = "";
        if (this.needFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
            var colorTarget = this.getRegisterFromString(shadedTarget);
            this.addFragmentTempUsages(colorTarget, 1);
            if (this.hasColorMulNode)
                code += "mul " + colorTarget + "," + colorTarget + "," + this.colorMulVary + "\n";
            if (this.hasColorAddNode)
                code += "add " + colorTarget + "," + colorTarget + "," + this.colorAddVary + "\n";
        }
        return code;
    };
    AnimationRegisterCache.prototype.getRegisterFromString = function (code) {
        var temp = code.split(/(\d+)/);
        return new ShaderRegisterElement(temp[0], parseInt(temp[1]));
    };
    Object.defineProperty(AnimationRegisterCache.prototype, "numVertexConstant", {
        get: function () {
            return this._numVertexConstant;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationRegisterCache.prototype, "numFragmentConstant", {
        get: function () {
            return this._numFragmentConstant;
        },
        enumerable: true,
        configurable: true
    });
    AnimationRegisterCache.prototype.setDataLength = function () {
        this._numVertexConstant = this.numUsedVertexConstants - this.vertexConstantOffset;
        this._numFragmentConstant = this.numUsedFragmentConstants - this.fragmentConstantOffset;
        this.vertexConstantData = new Float32Array(this._numVertexConstant * 4);
        this.fragmentConstantData = new Float32Array(this._numFragmentConstant * 4);
    };
    AnimationRegisterCache.prototype.setVertexConst = function (index /*int*/, x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        var _index = (index - this.vertexConstantOffset) * 4;
        this.vertexConstantData[_index++] = x;
        this.vertexConstantData[_index++] = y;
        this.vertexConstantData[_index++] = z;
        this.vertexConstantData[_index] = w;
    };
    AnimationRegisterCache.prototype.setVertexConstFromArray = function (index /*int*/, data) {
        var _index = (index - this.vertexConstantOffset) * 4;
        for (var i = 0; i < data.length; i++)
            this.vertexConstantData[_index++] = data[i];
    };
    AnimationRegisterCache.prototype.setVertexConstFromMatrix = function (index /*int*/, matrix) {
        var rawData = matrix.rawData;
        var _index = (index - this.vertexConstantOffset) * 4;
        this.vertexConstantData[_index++] = rawData[0];
        this.vertexConstantData[_index++] = rawData[4];
        this.vertexConstantData[_index++] = rawData[8];
        this.vertexConstantData[_index++] = rawData[12];
        this.vertexConstantData[_index++] = rawData[1];
        this.vertexConstantData[_index++] = rawData[5];
        this.vertexConstantData[_index++] = rawData[9];
        this.vertexConstantData[_index++] = rawData[13];
        this.vertexConstantData[_index++] = rawData[2];
        this.vertexConstantData[_index++] = rawData[6];
        this.vertexConstantData[_index++] = rawData[10];
        this.vertexConstantData[_index++] = rawData[14];
        this.vertexConstantData[_index++] = rawData[3];
        this.vertexConstantData[_index++] = rawData[7];
        this.vertexConstantData[_index++] = rawData[11];
        this.vertexConstantData[_index] = rawData[15];
    };
    AnimationRegisterCache.prototype.setFragmentConst = function (index /*int*/, x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        var _index = (index - this.fragmentConstantOffset) * 4;
        this.fragmentConstantData[_index++] = x;
        this.fragmentConstantData[_index++] = y;
        this.fragmentConstantData[_index++] = z;
        this.fragmentConstantData[_index] = w;
    };
    return AnimationRegisterCache;
})(ShaderRegisterCache);
module.exports = AnimationRegisterCache;

},{"awayjs-renderergl/lib/shaders/ShaderRegisterCache":"awayjs-renderergl/lib/shaders/ShaderRegisterCache","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/data/AnimationSubGeometry":[function(require,module,exports){
/**
 * ...
 */
var AnimationSubGeometry = (function () {
    function AnimationSubGeometry() {
        this._pVertexBuffer = new Array(8);
        this._pBufferContext = new Array(8);
        this._pBufferDirty = new Array(8);
        this.numProcessedVertices = 0;
        this.previousTime = Number.NEGATIVE_INFINITY;
        this.animationParticles = new Array();
        for (var i = 0; i < 8; i++)
            this._pBufferDirty[i] = true;
        this._iUniqueId = AnimationSubGeometry.SUBGEOM_ID_COUNT++;
    }
    AnimationSubGeometry.prototype.createVertexData = function (numVertices /*uint*/, totalLenOfOneVertex /*uint*/) {
        this._numVertices = numVertices;
        this._totalLenOfOneVertex = totalLenOfOneVertex;
        this._pVertexData = new Array(numVertices * totalLenOfOneVertex);
    };
    AnimationSubGeometry.prototype.activateVertexBuffer = function (index /*int*/, bufferOffset /*int*/, stage, format) {
        var contextIndex = stage.stageIndex;
        var context = stage.context;
        var buffer = this._pVertexBuffer[contextIndex];
        if (!buffer || this._pBufferContext[contextIndex] != context) {
            buffer = this._pVertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, this._totalLenOfOneVertex * 4);
            this._pBufferContext[contextIndex] = context;
            this._pBufferDirty[contextIndex] = true;
        }
        if (this._pBufferDirty[contextIndex]) {
            buffer.uploadFromArray(this._pVertexData, 0, this._numVertices);
            this._pBufferDirty[contextIndex] = false;
        }
        context.setVertexBufferAt(index, buffer, bufferOffset * 4, format);
    };
    AnimationSubGeometry.prototype.dispose = function () {
        while (this._pVertexBuffer.length) {
            var vertexBuffer = this._pVertexBuffer.pop();
            if (vertexBuffer)
                vertexBuffer.dispose();
        }
    };
    AnimationSubGeometry.prototype.invalidateBuffer = function () {
        for (var i = 0; i < 8; i++)
            this._pBufferDirty[i] = true;
    };
    Object.defineProperty(AnimationSubGeometry.prototype, "vertexData", {
        get: function () {
            return this._pVertexData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationSubGeometry.prototype, "numVertices", {
        get: function () {
            return this._numVertices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationSubGeometry.prototype, "totalLenOfOneVertex", {
        get: function () {
            return this._totalLenOfOneVertex;
        },
        enumerable: true,
        configurable: true
    });
    AnimationSubGeometry.SUBGEOM_ID_COUNT = 0;
    return AnimationSubGeometry;
})();
module.exports = AnimationSubGeometry;

},{}],"awayjs-renderergl/lib/animators/data/ColorSegmentPoint":[function(require,module,exports){
var ColorSegmentPoint = (function () {
    function ColorSegmentPoint(life, color) {
        //0<life<1
        if (life <= 0 || life >= 1)
            throw (new Error("life exceeds range (0,1)"));
        this._life = life;
        this._color = color;
    }
    Object.defineProperty(ColorSegmentPoint.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSegmentPoint.prototype, "life", {
        get: function () {
            return this._life;
        },
        enumerable: true,
        configurable: true
    });
    return ColorSegmentPoint;
})();
module.exports = ColorSegmentPoint;

},{}],"awayjs-renderergl/lib/animators/data/JointPose":[function(require,module,exports){
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Quaternion = require("awayjs-core/lib/geom/Quaternion");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 * Contains transformation data for a skeleton joint, used for skeleton animation.
 *
 * @see away.animation.Skeleton
 * @see away.animation.SkeletonJoint
 *
 * todo: support (uniform) scale
 */
var JointPose = (function () {
    function JointPose() {
        /**
         * The rotation of the pose stored as a quaternion
         */
        this.orientation = new Quaternion();
        /**
         * The translation of the pose
         */
        this.translation = new Vector3D();
    }
    /**
     * Converts the transformation to a Matrix3D representation.
     *
     * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
     * @return The transformation matrix of the pose.
     */
    JointPose.prototype.toMatrix3D = function (target) {
        if (target === void 0) { target = null; }
        if (target == null)
            target = new Matrix3D();
        this.orientation.toMatrix3D(target);
        target.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
        return target;
    };
    /**
     * Copies the transformation data from a source pose object into the existing pose object.
     *
     * @param pose The source pose to copy from.
     */
    JointPose.prototype.copyFrom = function (pose) {
        var or = pose.orientation;
        var tr = pose.translation;
        this.orientation.x = or.x;
        this.orientation.y = or.y;
        this.orientation.z = or.z;
        this.orientation.w = or.w;
        this.translation.x = tr.x;
        this.translation.y = tr.y;
        this.translation.z = tr.z;
    };
    return JointPose;
})();
module.exports = JointPose;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Quaternion":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/data/ParticleAnimationData":[function(require,module,exports){
/**
 * ...
 */
var ParticleAnimationData = (function () {
    function ParticleAnimationData(index /*uint*/, startTime, duration, delay, particle) {
        this.index = index;
        this.startTime = startTime;
        this.totalTime = duration + delay;
        this.duration = duration;
        this.delay = delay;
        this.startVertexIndex = particle.startVertexIndex;
        this.numVertices = particle.numVertices;
    }
    return ParticleAnimationData;
})();
module.exports = ParticleAnimationData;

},{}],"awayjs-renderergl/lib/animators/data/ParticleData":[function(require,module,exports){
var ParticleData = (function () {
    function ParticleData() {
    }
    return ParticleData;
})();
module.exports = ParticleData;

},{}],"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":[function(require,module,exports){
/**
 * Options for setting the properties mode of a particle animation node.
 */
var ParticlePropertiesMode = (function () {
    function ParticlePropertiesMode() {
    }
    /**
     * Mode that defines the particle node as acting on global properties (ie. the properties set in the node constructor or the corresponding animation state).
     */
    ParticlePropertiesMode.GLOBAL = 0;
    /**
     * Mode that defines the particle node as acting on local static properties (ie. the properties of particles set in the initialising on the animation set).
     */
    ParticlePropertiesMode.LOCAL_STATIC = 1;
    /**
     * Mode that defines the particle node as acting on local dynamic properties (ie. the properties of the particles set in the corresponding animation state).
     */
    ParticlePropertiesMode.LOCAL_DYNAMIC = 2;
    return ParticlePropertiesMode;
})();
module.exports = ParticlePropertiesMode;

},{}],"awayjs-renderergl/lib/animators/data/ParticleProperties":[function(require,module,exports){
/**
 * Dynamic class for holding the local properties of a particle, used for processing the static properties
 * of particles in the particle animation set before beginning upload to the GPU.
 */
var ParticleProperties = (function () {
    function ParticleProperties() {
    }
    return ParticleProperties;
})();
module.exports = ParticleProperties;

},{}],"awayjs-renderergl/lib/animators/data/SkeletonJoint":[function(require,module,exports){
/**
 * A value obect representing a single joint in a skeleton object.
 *
 * @see away.animators.Skeleton
 */
var SkeletonJoint = (function () {
    /**
     * Creates a new <code>SkeletonJoint</code> object
     */
    function SkeletonJoint() {
        /**
         * The index of the parent joint in the skeleton's joints vector.
         *
         * @see away.animators.Skeleton#joints
         */
        this.parentIndex = -1;
    }
    return SkeletonJoint;
})();
module.exports = SkeletonJoint;

},{}],"awayjs-renderergl/lib/animators/data/SkeletonPose":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
/**
 * A collection of pose objects, determining the pose for an entire skeleton.
 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
 * clips are added to any animator with a valid skeleton)
 *
 * @see away.animators.Skeleton
 * @see away.animators.JointPose
 */
var SkeletonPose = (function (_super) {
    __extends(SkeletonPose, _super);
    /**
     * Creates a new <code>SkeletonPose</code> object.
     */
    function SkeletonPose() {
        _super.call(this);
        this.jointPoses = new Array();
    }
    Object.defineProperty(SkeletonPose.prototype, "numJointPoses", {
        /**
         * The total number of joint poses in the skeleton pose.
         */
        get: function () {
            return this.jointPoses.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonPose.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return SkeletonPose.assetType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the joint pose object with the given joint name, otherwise returns a null object.
     *
     * @param jointName The name of the joint object whose pose is to be found.
     * @return The pose object with the given joint name.
     */
    SkeletonPose.prototype.jointPoseFromName = function (jointName) {
        var jointPoseIndex = this.jointPoseIndexFromName(jointName);
        if (jointPoseIndex != -1)
            return this.jointPoses[jointPoseIndex];
        else
            return null;
    };
    /**
     * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
     *
     * @param The name of the joint object whose pose is to be found.
     * @return The index of the pose object in the jointPoses Array
     *
     * @see #jointPoses
     */
    SkeletonPose.prototype.jointPoseIndexFromName = function (jointName) {
        // this is implemented as a linear search, rather than a possibly
        // more optimal method (Dictionary lookup, for example) because:
        // a) it is assumed that it will be called once for each joint
        // b) it is assumed that it will be called only during load, and not during main loop
        // c) maintaining a dictionary (for safety) would dictate an interface to access JointPoses,
        //    rather than direct array access.  this would be sub-optimal.
        var jointPoseIndex /*int*/;
        var jointPose;
        for (var i /*uint*/; i < this.jointPoses.length; i++) {
            jointPose = this.jointPoses[i];
            if (jointPose.name == jointName)
                return jointPoseIndex;
            jointPoseIndex++;
        }
        return -1;
    };
    /**
     * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
     *
     * @return SkeletonPose
     */
    SkeletonPose.prototype.clone = function () {
        var clone = new SkeletonPose();
        var numJointPoses = this.jointPoses.length;
        for (var i = 0; i < numJointPoses; i++) {
            var cloneJointPose = new JointPose();
            var thisJointPose = this.jointPoses[i];
            cloneJointPose.name = thisJointPose.name;
            cloneJointPose.copyFrom(thisJointPose);
            clone.jointPoses[i] = cloneJointPose;
        }
        return clone;
    };
    /**
     * @inheritDoc
     */
    SkeletonPose.prototype.dispose = function () {
        this.jointPoses.length = 0;
    };
    SkeletonPose.assetType = "[asset SkeletonPose]";
    return SkeletonPose;
})(AssetBase);
module.exports = SkeletonPose;

},{"awayjs-core/lib/library/AssetBase":undefined,"awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose"}],"awayjs-renderergl/lib/animators/data/Skeleton":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetBase = require("awayjs-core/lib/library/AssetBase");
/**
 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
 *
 * @see away.animators.SkeletonJoint
 */
var Skeleton = (function (_super) {
    __extends(Skeleton, _super);
    /**
     * Creates a new <code>Skeleton</code> object
     */
    function Skeleton() {
        _super.call(this);
        // in the long run, it might be a better idea to not store Joint objects, but keep all data in Vectors, that we can upload easily?
        this.joints = new Array();
    }
    Object.defineProperty(Skeleton.prototype, "numJoints", {
        /**
         * The total number of joints in the skeleton.
         */
        get: function () {
            return this.joints.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
     *
     * @param jointName The name of the joint object to be found.
     * @return The joint object with the given name.
     *
     * @see #joints
     */
    Skeleton.prototype.jointFromName = function (jointName) {
        var jointIndex = this.jointIndexFromName(jointName);
        if (jointIndex != -1)
            return this.joints[jointIndex];
        else
            return null;
    };
    /**
     * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
     *
     * @param jointName The name of the joint object to be found.
     * @return The index of the joint object in the joints Array
     *
     * @see #joints
     */
    Skeleton.prototype.jointIndexFromName = function (jointName) {
        // this is implemented as a linear search, rather than a possibly
        // more optimal method (Dictionary lookup, for example) because:
        // a) it is assumed that it will be called once for each joint
        // b) it is assumed that it will be called only during load, and not during main loop
        // c) maintaining a dictionary (for safety) would dictate an interface to access SkeletonJoints,
        //    rather than direct array access.  this would be sub-optimal.
        var jointIndex /*int*/;
        var joint;
        for (var i /*int*/; i < this.joints.length; i++) {
            joint = this.joints[i];
            if (joint.name == jointName)
                return jointIndex;
            jointIndex++;
        }
        return -1;
    };
    /**
     * @inheritDoc
     */
    Skeleton.prototype.dispose = function () {
        this.joints.length = 0;
    };
    Object.defineProperty(Skeleton.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return Skeleton.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Skeleton.assetType = "[asset Skeleton]";
    return Skeleton;
})(AssetBase);
module.exports = Skeleton;

},{"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-renderergl/lib/animators/data/VertexAnimationMode":[function(require,module,exports){
/**
 * Options for setting the animation mode of a vertex animator object.
 *
 * @see away.animators.VertexAnimator
 */
var VertexAnimationMode = (function () {
    function VertexAnimationMode() {
    }
    /**
     * Animation mode that adds all outputs from active vertex animation state to form the current vertex animation pose.
     */
    VertexAnimationMode.ADDITIVE = "additive";
    /**
     * Animation mode that picks the output from a single vertex animation state to form the current vertex animation pose.
     */
    VertexAnimationMode.ABSOLUTE = "absolute";
    return VertexAnimationMode;
})();
module.exports = VertexAnimationMode;

},{}],"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
/**
 * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
 */
var AnimationClipNodeBase = (function (_super) {
    __extends(AnimationClipNodeBase, _super);
    /**
     * Creates a new <code>AnimationClipNodeBase</code> object.
     */
    function AnimationClipNodeBase() {
        _super.call(this);
        this._pLooping = true;
        this._pTotalDuration = 0;
        this._pStitchDirty = true;
        this._pStitchFinalFrame = false;
        this._pNumFrames = 0;
        this._pDurations = new Array();
        /*uint*/
        this._pTotalDelta = new Vector3D();
        this.fixedFrameRate = true;
    }
    Object.defineProperty(AnimationClipNodeBase.prototype, "looping", {
        /**
         * Determines whether the contents of the animation node have looping characteristics enabled.
         */
        get: function () {
            return this._pLooping;
        },
        set: function (value) {
            if (this._pLooping == value)
                return;
            this._pLooping = value;
            this._pStitchDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "stitchFinalFrame", {
        /**
         * Defines if looping content blends the final frame of animation data with the first (true) or works on the
         * assumption that both first and last frames are identical (false). Defaults to false.
         */
        get: function () {
            return this._pStitchFinalFrame;
        },
        set: function (value) {
            if (this._pStitchFinalFrame == value)
                return;
            this._pStitchFinalFrame = value;
            this._pStitchDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "totalDuration", {
        get: function () {
            if (this._pStitchDirty)
                this._pUpdateStitch();
            return this._pTotalDuration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "totalDelta", {
        get: function () {
            if (this._pStitchDirty)
                this._pUpdateStitch();
            return this._pTotalDelta;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "lastFrame", {
        get: function () {
            if (this._pStitchDirty)
                this._pUpdateStitch();
            return this._pLastFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipNodeBase.prototype, "durations", {
        /**
         * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
         */
        get: function () {
            return this._pDurations;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the node's final frame stitch state.
     *
     * @see #stitchFinalFrame
     */
    AnimationClipNodeBase.prototype._pUpdateStitch = function () {
        this._pStitchDirty = false;
        this._pLastFrame = (this._pStitchFinalFrame) ? this._pNumFrames : this._pNumFrames - 1;
        this._pTotalDuration = 0;
        this._pTotalDelta.x = 0;
        this._pTotalDelta.y = 0;
        this._pTotalDelta.z = 0;
    };
    return AnimationClipNodeBase;
})(AnimationNodeBase);
module.exports = AnimationClipNodeBase;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleAccelerationState = require("awayjs-renderergl/lib/animators/states/ParticleAccelerationState");
/**
 * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
 */
var ParticleAccelerationNode = (function (_super) {
    __extends(ParticleAccelerationNode, _super);
    /**
     * Creates a new <code>ParticleAccelerationNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
     */
    function ParticleAccelerationNode(mode /*uint*/, acceleration) {
        if (acceleration === void 0) { acceleration = null; }
        _super.call(this, "ParticleAcceleration", mode, 3);
        this._pStateClass = ParticleAccelerationState;
        this._acceleration = acceleration || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype.pGetAGALVertexCode = function (shader, animationRegisterCache) {
        var accelerationValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleAccelerationState.ACCELERATION_INDEX, accelerationValue.index);
        var temp = animationRegisterCache.getFreeVertexVectorTemp();
        animationRegisterCache.addVertexTempUsages(temp, 1);
        var code = "mul " + temp + "," + animationRegisterCache.vertexTime + "," + accelerationValue + "\n";
        if (animationRegisterCache.needVelocity) {
            var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
            code += "mul " + temp2 + "," + temp + "," + animationRegisterCache.vertexTwoConst + "\n";
            code += "add " + animationRegisterCache.velocityTarget + ".xyz," + temp2 + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
        }
        animationRegisterCache.removeVertexTempUsage(temp);
        code += "mul " + temp + "," + temp + "," + animationRegisterCache.vertexTime + "\n";
        code += "add " + animationRegisterCache.positionTarget + ".xyz," + temp + "," + animationRegisterCache.positionTarget + ".xyz\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var tempAcceleration = param[ParticleAccelerationNode.ACCELERATION_VECTOR3D];
        if (!tempAcceleration)
            throw new Error("there is no " + ParticleAccelerationNode.ACCELERATION_VECTOR3D + " in param!");
        this._pOneData[0] = tempAcceleration.x / 2;
        this._pOneData[1] = tempAcceleration.y / 2;
        this._pOneData[2] = tempAcceleration.z / 2;
    };
    /**
     * Reference for acceleration node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the direction of acceleration on the particle.
     */
    ParticleAccelerationNode.ACCELERATION_VECTOR3D = "AccelerationVector3D";
    return ParticleAccelerationNode;
})(ParticleNodeBase);
module.exports = ParticleAccelerationNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleAccelerationState":"awayjs-renderergl/lib/animators/states/ParticleAccelerationState"}],"awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleBezierCurveState = require("awayjs-renderergl/lib/animators/states/ParticleBezierCurveState");
/**
 * A particle animation node used to control the position of a particle over time along a bezier curve.
 */
var ParticleBezierCurveNode = (function (_super) {
    __extends(ParticleBezierCurveNode, _super);
    /**
     * Creates a new <code>ParticleBezierCurveNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
     * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
     */
    function ParticleBezierCurveNode(mode /*uint*/, controlPoint, endPoint) {
        if (controlPoint === void 0) { controlPoint = null; }
        if (endPoint === void 0) { endPoint = null; }
        _super.call(this, "ParticleBezierCurve", mode, 6);
        this._pStateClass = ParticleBezierCurveState;
        this._iControlPoint = controlPoint || new Vector3D();
        this._iEndPoint = endPoint || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var controlValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleBezierCurveState.BEZIER_CONTROL_INDEX, controlValue.index);
        var endValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleBezierCurveState.BEZIER_END_INDEX, endValue.index);
        var temp = animationRegisterCache.getFreeVertexVectorTemp();
        var rev_time = new ShaderRegisterElement(temp.regName, temp.index, 0);
        var time_2 = new ShaderRegisterElement(temp.regName, temp.index, 1);
        var time_temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
        animationRegisterCache.addVertexTempUsages(temp, 1);
        var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
        var distance = new ShaderRegisterElement(temp2.regName, temp2.index);
        animationRegisterCache.removeVertexTempUsage(temp);
        var code = "";
        code += "sub " + rev_time + "," + animationRegisterCache.vertexOneConst + "," + animationRegisterCache.vertexLife + "\n";
        code += "mul " + time_2 + "," + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexLife + "\n";
        code += "mul " + time_temp + "," + animationRegisterCache.vertexLife + "," + rev_time + "\n";
        code += "mul " + time_temp + "," + time_temp + "," + animationRegisterCache.vertexTwoConst + "\n";
        code += "mul " + distance + ".xyz," + time_temp + "," + controlValue + "\n";
        code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
        code += "mul " + distance + ".xyz," + time_2 + "," + endValue + "\n";
        code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
        if (animationRegisterCache.needVelocity) {
            code += "mul " + time_2 + "," + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexTwoConst + "\n";
            code += "sub " + time_temp + "," + animationRegisterCache.vertexOneConst + "," + time_2 + "\n";
            code += "mul " + time_temp + "," + animationRegisterCache.vertexTwoConst + "," + time_temp + "\n";
            code += "mul " + distance + ".xyz," + controlValue + "," + time_temp + "\n";
            code += "add " + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
            code += "mul " + distance + ".xyz," + endValue + "," + time_2 + "\n";
            code += "add " + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var bezierControl = param[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D];
        if (!bezierControl)
            throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D + " in param!");
        var bezierEnd = param[ParticleBezierCurveNode.BEZIER_END_VECTOR3D];
        if (!bezierEnd)
            throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_END_VECTOR3D + " in param!");
        this._pOneData[0] = bezierControl.x;
        this._pOneData[1] = bezierControl.y;
        this._pOneData[2] = bezierControl.z;
        this._pOneData[3] = bezierEnd.x;
        this._pOneData[4] = bezierEnd.y;
        this._pOneData[5] = bezierEnd.z;
    };
    /**
     * Reference for bezier curve node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the control point position (0, 1, 2) of the curve.
     */
    ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D = "BezierControlVector3D";
    /**
     * Reference for bezier curve node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the end point position (0, 1, 2) of the curve.
     */
    ParticleBezierCurveNode.BEZIER_END_VECTOR3D = "BezierEndVector3D";
    return ParticleBezierCurveNode;
})(ParticleNodeBase);
module.exports = ParticleBezierCurveNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleBezierCurveState":"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleBillboardState = require("awayjs-renderergl/lib/animators/states/ParticleBillboardState");
/**
 * A particle animation node that controls the rotation of a particle to always face the camera.
 */
var ParticleBillboardNode = (function (_super) {
    __extends(ParticleBillboardNode, _super);
    /**
     * Creates a new <code>ParticleBillboardNode</code>
     */
    function ParticleBillboardNode(billboardAxis) {
        if (billboardAxis === void 0) { billboardAxis = null; }
        _super.call(this, "ParticleBillboard", ParticlePropertiesMode.GLOBAL, 0, 4);
        this._pStateClass = ParticleBillboardState;
        this._iBillboardAxis = billboardAxis;
    }
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var rotationMatrixRegister = animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.setRegisterIndex(this, ParticleBillboardState.MATRIX_INDEX, rotationMatrixRegister.index);
        animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.getFreeVertexConstant();
        var temp = animationRegisterCache.getFreeVertexVectorTemp();
        var code = "m33 " + temp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + "," + rotationMatrixRegister + "\n" + "mov " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";
        var shaderRegisterElement;
        for (var i = 0; i < animationRegisterCache.rotationRegisters.length; i++) {
            shaderRegisterElement = animationRegisterCache.rotationRegisters[i];
            code += "m33 " + temp + ".xyz," + shaderRegisterElement + "," + rotationMatrixRegister + "\n" + "mov " + shaderRegisterElement + ".xyz," + shaderRegisterElement + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.hasBillboard = true;
    };
    return ParticleBillboardNode;
})(ParticleNodeBase);
module.exports = ParticleBillboardNode;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleBillboardState":"awayjs-renderergl/lib/animators/states/ParticleBillboardState"}],"awayjs-renderergl/lib/animators/nodes/ParticleColorNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleColorState = require("awayjs-renderergl/lib/animators/states/ParticleColorState");
/**
 * A particle animation node used to control the color variation of a particle over time.
 */
var ParticleColorNode = (function (_super) {
    __extends(ParticleColorNode, _super);
    /**
     * Creates a new <code>ParticleColorNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesMultiplier  Defines whether the node uses multiplier data in the shader for its color transformations. Defaults to true.
     * @param    [optional] usesOffset      Defines whether the node uses offset data in the shader for its color transformations. Defaults to true.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the animation independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
     * @param    [optional] startColor      Defines the default start color transform of the node, when in global mode.
     * @param    [optional] endColor        Defines the default end color transform of the node, when in global mode.
     * @param    [optional] cycleDuration   Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    function ParticleColorNode(mode /*uint*/, usesMultiplier, usesOffset, usesCycle, usesPhase, startColor, endColor, cycleDuration, cyclePhase) {
        if (usesMultiplier === void 0) { usesMultiplier = true; }
        if (usesOffset === void 0) { usesOffset = true; }
        if (usesCycle === void 0) { usesCycle = false; }
        if (usesPhase === void 0) { usesPhase = false; }
        if (startColor === void 0) { startColor = null; }
        if (endColor === void 0) { endColor = null; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        _super.call(this, "ParticleColor", mode, (usesMultiplier && usesOffset) ? 16 : 8, ParticleAnimationSet.COLOR_PRIORITY);
        this._pStateClass = ParticleColorState;
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iStartColor = startColor || new ColorTransform();
        this._iEndColor = endColor || new ColorTransform();
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
    }
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var code = "";
        if (animationRegisterCache.needFragmentAnimation) {
            var temp = animationRegisterCache.getFreeVertexVectorTemp();
            if (this._iUsesCycle) {
                var cycleConst = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleColorState.CYCLE_INDEX, cycleConst.index);
                animationRegisterCache.addVertexTempUsages(temp, 1);
                var sin = animationRegisterCache.getFreeVertexSingleTemp();
                animationRegisterCache.removeVertexTempUsage(temp);
                code += "mul " + sin + "," + animationRegisterCache.vertexTime + "," + cycleConst + ".x\n";
                if (this._iUsesPhase)
                    code += "add " + sin + "," + sin + "," + cycleConst + ".y\n";
                code += "sin " + sin + "," + sin + "\n";
            }
            if (this._iUsesMultiplier) {
                var startMultiplierValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                var deltaMultiplierValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleColorState.START_MULTIPLIER_INDEX, startMultiplierValue.index);
                animationRegisterCache.setRegisterIndex(this, ParticleColorState.DELTA_MULTIPLIER_INDEX, deltaMultiplierValue.index);
                code += "mul " + temp + "," + deltaMultiplierValue + "," + (this._iUsesCycle ? sin : animationRegisterCache.vertexLife) + "\n";
                code += "add " + temp + "," + temp + "," + startMultiplierValue + "\n";
                code += "mul " + animationRegisterCache.colorMulTarget + "," + temp + "," + animationRegisterCache.colorMulTarget + "\n";
            }
            if (this._iUsesOffset) {
                var startOffsetValue = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC) ? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
                var deltaOffsetValue = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC) ? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleColorState.START_OFFSET_INDEX, startOffsetValue.index);
                animationRegisterCache.setRegisterIndex(this, ParticleColorState.DELTA_OFFSET_INDEX, deltaOffsetValue.index);
                code += "mul " + temp + "," + deltaOffsetValue + "," + (this._iUsesCycle ? sin : animationRegisterCache.vertexLife) + "\n";
                code += "add " + temp + "," + temp + "," + startOffsetValue + "\n";
                code += "add " + animationRegisterCache.colorAddTarget + "," + temp + "," + animationRegisterCache.colorAddTarget + "\n";
            }
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        if (this._iUsesMultiplier)
            particleAnimationSet.hasColorMulNode = true;
        if (this._iUsesOffset)
            particleAnimationSet.hasColorAddNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var startColor = param[ParticleColorNode.COLOR_START_COLORTRANSFORM];
        if (!startColor)
            throw (new Error("there is no " + ParticleColorNode.COLOR_START_COLORTRANSFORM + " in param!"));
        var endColor = param[ParticleColorNode.COLOR_END_COLORTRANSFORM];
        if (!endColor)
            throw (new Error("there is no " + ParticleColorNode.COLOR_END_COLORTRANSFORM + " in param!"));
        var i = 0;
        if (!this._iUsesCycle) {
            //multiplier
            if (this._iUsesMultiplier) {
                this._pOneData[i++] = startColor.redMultiplier;
                this._pOneData[i++] = startColor.greenMultiplier;
                this._pOneData[i++] = startColor.blueMultiplier;
                this._pOneData[i++] = startColor.alphaMultiplier;
                this._pOneData[i++] = endColor.redMultiplier - startColor.redMultiplier;
                this._pOneData[i++] = endColor.greenMultiplier - startColor.greenMultiplier;
                this._pOneData[i++] = endColor.blueMultiplier - startColor.blueMultiplier;
                this._pOneData[i++] = endColor.alphaMultiplier - startColor.alphaMultiplier;
            }
            //offset
            if (this._iUsesOffset) {
                this._pOneData[i++] = startColor.redOffset / 255;
                this._pOneData[i++] = startColor.greenOffset / 255;
                this._pOneData[i++] = startColor.blueOffset / 255;
                this._pOneData[i++] = startColor.alphaOffset / 255;
                this._pOneData[i++] = (endColor.redOffset - startColor.redOffset) / 255;
                this._pOneData[i++] = (endColor.greenOffset - startColor.greenOffset) / 255;
                this._pOneData[i++] = (endColor.blueOffset - startColor.blueOffset) / 255;
                this._pOneData[i++] = (endColor.alphaOffset - startColor.alphaOffset) / 255;
            }
        }
        else {
            //multiplier
            if (this._iUsesMultiplier) {
                this._pOneData[i++] = (startColor.redMultiplier + endColor.redMultiplier) / 2;
                this._pOneData[i++] = (startColor.greenMultiplier + endColor.greenMultiplier) / 2;
                this._pOneData[i++] = (startColor.blueMultiplier + endColor.blueMultiplier) / 2;
                this._pOneData[i++] = (startColor.alphaMultiplier + endColor.alphaMultiplier) / 2;
                this._pOneData[i++] = (startColor.redMultiplier - endColor.redMultiplier) / 2;
                this._pOneData[i++] = (startColor.greenMultiplier - endColor.greenMultiplier) / 2;
                this._pOneData[i++] = (startColor.blueMultiplier - endColor.blueMultiplier) / 2;
                this._pOneData[i++] = (startColor.alphaMultiplier - endColor.alphaMultiplier) / 2;
            }
            //offset
            if (this._iUsesOffset) {
                this._pOneData[i++] = (startColor.redOffset + endColor.redOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.greenOffset + endColor.greenOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.blueOffset + endColor.blueOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.alphaOffset + endColor.alphaOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.redOffset - endColor.redOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.greenOffset - endColor.greenOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.blueOffset - endColor.blueOffset) / (255 * 2);
                this._pOneData[i++] = (startColor.alphaOffset - endColor.alphaOffset) / (255 * 2);
            }
        }
    };
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the start color transform applied to the particle.
     */
    ParticleColorNode.COLOR_START_COLORTRANSFORM = "ColorStartColorTransform";
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the end color transform applied to the particle.
     */
    ParticleColorNode.COLOR_END_COLORTRANSFORM = "ColorEndColorTransform";
    return ParticleColorNode;
})(ParticleNodeBase);
module.exports = ParticleColorNode;

},{"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-renderergl/lib/animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleColorState":"awayjs-renderergl/lib/animators/states/ParticleColorState"}],"awayjs-renderergl/lib/animators/nodes/ParticleFollowNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleFollowState = require("awayjs-renderergl/lib/animators/states/ParticleFollowState");
/**
 * A particle animation node used to create a follow behaviour on a particle system.
 */
var ParticleFollowNode = (function (_super) {
    __extends(ParticleFollowNode, _super);
    /**
     * Creates a new <code>ParticleFollowNode</code>
     *
     * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
     * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
     * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
     */
    function ParticleFollowNode(usesPosition, usesRotation, smooth) {
        if (usesPosition === void 0) { usesPosition = true; }
        if (usesRotation === void 0) { usesRotation = true; }
        if (smooth === void 0) { smooth = false; }
        _super.call(this, "ParticleFollow", ParticlePropertiesMode.LOCAL_DYNAMIC, (usesPosition && usesRotation) ? 6 : 3, ParticleAnimationSet.POST_PRIORITY);
        this._pStateClass = ParticleFollowState;
        this._iUsesPosition = usesPosition;
        this._iUsesRotation = usesRotation;
        this._iSmooth = smooth;
    }
    /**
     * @inheritDoc
     */
    ParticleFollowNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        //TODO: use Quaternion to implement this function
        var code = "";
        if (this._iUsesRotation) {
            var rotationAttribute = animationRegisterCache.getFreeVertexAttribute();
            animationRegisterCache.setRegisterIndex(this, ParticleFollowState.FOLLOW_ROTATION_INDEX, rotationAttribute.index);
            var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp1, 1);
            var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp2, 1);
            var temp3 = animationRegisterCache.getFreeVertexVectorTemp();
            var temp4;
            if (animationRegisterCache.hasBillboard) {
                animationRegisterCache.addVertexTempUsages(temp3, 1);
                temp4 = animationRegisterCache.getFreeVertexVectorTemp();
            }
            animationRegisterCache.removeVertexTempUsage(temp1);
            animationRegisterCache.removeVertexTempUsage(temp2);
            if (animationRegisterCache.hasBillboard)
                animationRegisterCache.removeVertexTempUsage(temp3);
            var len = animationRegisterCache.rotationRegisters.length;
            var i /*int*/;
            //x axis
            code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + animationRegisterCache.vertexOneConst + "\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "sin " + temp3 + ".y," + rotationAttribute + ".x\n";
            code += "cos " + temp3 + ".z," + rotationAttribute + ".x\n";
            code += "mov " + temp2 + ".x," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".y," + temp3 + ".z\n";
            code += "neg " + temp2 + ".z," + temp3 + ".y\n";
            if (animationRegisterCache.hasBillboard)
                code += "m33 " + temp4 + ".xyz," + animationRegisterCache.positionTarget + ".xyz," + temp1 + "\n";
            else {
                code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
            }
            //y axis
            code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "cos " + temp1 + ".x," + rotationAttribute + ".y\n";
            code += "sin " + temp1 + ".z," + rotationAttribute + ".y\n";
            code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".y," + animationRegisterCache.vertexOneConst + "\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "neg " + temp3 + ".x," + temp1 + ".z\n";
            code += "mov " + temp3 + ".z," + temp1 + ".x\n";
            if (animationRegisterCache.hasBillboard)
                code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
            else {
                code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
            }
            //z axis
            code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "sin " + temp2 + ".x," + rotationAttribute + ".z\n";
            code += "cos " + temp2 + ".y," + rotationAttribute + ".z\n";
            code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp2 + ".y\n";
            code += "neg " + temp1 + ".y," + temp2 + ".x\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
            if (animationRegisterCache.hasBillboard) {
                code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
                code += "sub " + temp4 + ".xyz," + temp4 + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp4 + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
            }
            else {
                code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
            }
        }
        if (this._iUsesPosition) {
            var positionAttribute = animationRegisterCache.getFreeVertexAttribute();
            animationRegisterCache.setRegisterIndex(this, ParticleFollowState.FOLLOW_POSITION_INDEX, positionAttribute.index);
            code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + positionAttribute + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleFollowNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return ParticleFollowNode;
})(ParticleNodeBase);
module.exports = ParticleFollowNode;

},{"awayjs-renderergl/lib/animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleFollowState":"awayjs-renderergl/lib/animators/states/ParticleFollowState"}],"awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleInitialColorState = require("awayjs-renderergl/lib/animators/states/ParticleInitialColorState");
/**
 *
 */
var ParticleInitialColorNode = (function (_super) {
    __extends(ParticleInitialColorNode, _super);
    function ParticleInitialColorNode(mode /*uint*/, usesMultiplier, usesOffset, initialColor) {
        if (usesMultiplier === void 0) { usesMultiplier = true; }
        if (usesOffset === void 0) { usesOffset = false; }
        if (initialColor === void 0) { initialColor = null; }
        _super.call(this, "ParticleInitialColor", mode, (usesMultiplier && usesOffset) ? 8 : 4, ParticleAnimationSet.COLOR_PRIORITY);
        this._pStateClass = ParticleInitialColorState;
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iInitialColor = initialColor || new ColorTransform();
    }
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var code = "";
        if (animationRegisterCache.needFragmentAnimation) {
            if (this._iUsesMultiplier) {
                var multiplierValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleInitialColorState.MULTIPLIER_INDEX, multiplierValue.index);
                code += "mul " + animationRegisterCache.colorMulTarget + "," + multiplierValue + "," + animationRegisterCache.colorMulTarget + "\n";
            }
            if (this._iUsesOffset) {
                var offsetValue = (this._pMode == ParticlePropertiesMode.LOCAL_STATIC) ? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleInitialColorState.OFFSET_INDEX, offsetValue.index);
                code += "add " + animationRegisterCache.colorAddTarget + "," + offsetValue + "," + animationRegisterCache.colorAddTarget + "\n";
            }
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        if (this._iUsesMultiplier)
            particleAnimationSet.hasColorMulNode = true;
        if (this._iUsesOffset)
            particleAnimationSet.hasColorAddNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var initialColor = param[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM];
        if (!initialColor)
            throw (new Error("there is no " + ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM + " in param!"));
        var i = 0;
        //multiplier
        if (this._iUsesMultiplier) {
            this._pOneData[i++] = initialColor.redMultiplier;
            this._pOneData[i++] = initialColor.greenMultiplier;
            this._pOneData[i++] = initialColor.blueMultiplier;
            this._pOneData[i++] = initialColor.alphaMultiplier;
        }
        //offset
        if (this._iUsesOffset) {
            this._pOneData[i++] = initialColor.redOffset / 255;
            this._pOneData[i++] = initialColor.greenOffset / 255;
            this._pOneData[i++] = initialColor.blueOffset / 255;
            this._pOneData[i++] = initialColor.alphaOffset / 255;
        }
    };
    /**
     * Reference for color node properties on a single particle (when in local property mode).
     * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
     */
    ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM = "ColorInitialColorTransform";
    return ParticleInitialColorNode;
})(ParticleNodeBase);
module.exports = ParticleInitialColorNode;

},{"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-renderergl/lib/animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleInitialColorState":"awayjs-renderergl/lib/animators/states/ParticleInitialColorState"}],"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
/**
 * Provides an abstract base class for particle animation nodes.
 */
var ParticleNodeBase = (function (_super) {
    __extends(ParticleNodeBase, _super);
    /**
     * Creates a new <code>ParticleNodeBase</code> object.
     *
     * @param               name            Defines the generic name of the particle animation node.
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
     * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
     */
    function ParticleNodeBase(name, mode /*uint*/, dataLength /*uint*/, priority) {
        if (priority === void 0) { priority = 1; }
        _super.call(this);
        this._pDataLength = 3;
        name = name + ParticleNodeBase.MODES[mode];
        this.name = name;
        this._pMode = mode;
        this._priority = priority;
        this._pDataLength = dataLength;
        this._pOneData = new Array(this._pDataLength);
    }
    Object.defineProperty(ParticleNodeBase.prototype, "mode", {
        /**
         * Returns the property mode of the particle animation node. Typically set in the node constructor
         *
         * @see away.animators.ParticlePropertiesMode
         */
        get: function () {
            return this._pMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleNodeBase.prototype, "priority", {
        /**
         * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
         *
         * @see away.animators.ParticleAnimationSet
         * @see #getAGALVertexCode
         */
        get: function () {
            return this._priority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleNodeBase.prototype, "dataLength", {
        /**
         * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
         *
         * @see away.animators.ParticleAnimationSet
         * @see #getAGALVertexCode
         */
        get: function () {
            return this._pDataLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleNodeBase.prototype, "oneData", {
        /**
         * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
         *
         * @see away.animators.ParticleAnimationSet
         * @see #generatePropertyOfOneParticle
         */
        get: function () {
            return this._pOneData;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the AGAL code of the particle animation node for use in the vertex shader.
     */
    ParticleNodeBase.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader.
     */
    ParticleNodeBase.prototype.getAGALFragmentCode = function (shader, animationRegisterCache) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
     */
    ParticleNodeBase.prototype.getAGALUVCode = function (shader, animationRegisterCache) {
        return "";
    };
    /**
     * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
     *
     * @see away.animators.ParticleAnimationSet#initParticleFunc
     */
    ParticleNodeBase.prototype._iGeneratePropertyOfOneParticle = function (param) {
    };
    /**
     * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
     */
    ParticleNodeBase.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
    };
    //modes alias
    ParticleNodeBase.GLOBAL = 'Global';
    ParticleNodeBase.LOCAL_STATIC = 'LocalStatic';
    ParticleNodeBase.LOCAL_DYNAMIC = 'LocalDynamic';
    //modes list
    ParticleNodeBase.MODES = {
        0: ParticleNodeBase.GLOBAL,
        1: ParticleNodeBase.LOCAL_STATIC,
        2: ParticleNodeBase.LOCAL_DYNAMIC
    };
    return ParticleNodeBase;
})(AnimationNodeBase);
module.exports = ParticleNodeBase;

},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleOrbitState = require("awayjs-renderergl/lib/animators/states/ParticleOrbitState");
/**
 * A particle animation node used to control the position of a particle over time around a circular orbit.
 */
var ParticleOrbitNode = (function (_super) {
    __extends(ParticleOrbitNode, _super);
    /**
     * Creates a new <code>ParticleOrbitNode</code> object.
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesEulers      Defines whether the node uses the <code>eulers</code> property in the shader to calculate a rotation on the orbit. Defaults to true.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the orbit independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
     * @param    [optional] radius          Defines the radius of the orbit when in global mode. Defaults to 100.
     * @param    [optional] cycleDuration   Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     * @param    [optional] eulers          Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
     */
    function ParticleOrbitNode(mode /*uint*/, usesEulers, usesCycle, usesPhase, radius, cycleDuration, cyclePhase, eulers) {
        if (usesEulers === void 0) { usesEulers = true; }
        if (usesCycle === void 0) { usesCycle = false; }
        if (usesPhase === void 0) { usesPhase = false; }
        if (radius === void 0) { radius = 100; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        if (eulers === void 0) { eulers = null; }
        var len = 3;
        if (usesPhase)
            len++;
        _super.call(this, "ParticleOrbit", mode, len);
        this._pStateClass = ParticleOrbitState;
        this._iUsesEulers = usesEulers;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iRadius = radius;
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
        this._iEulers = eulers || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var orbitRegister = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleOrbitState.ORBIT_INDEX, orbitRegister.index);
        var eulersMatrixRegister = animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.setRegisterIndex(this, ParticleOrbitState.EULERS_INDEX, eulersMatrixRegister.index);
        animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.getFreeVertexConstant();
        var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
        animationRegisterCache.addVertexTempUsages(temp1, 1);
        var distance = new ShaderRegisterElement(temp1.regName, temp1.index);
        var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
        var cos = new ShaderRegisterElement(temp2.regName, temp2.index, 0);
        var sin = new ShaderRegisterElement(temp2.regName, temp2.index, 1);
        var degree = new ShaderRegisterElement(temp2.regName, temp2.index, 2);
        animationRegisterCache.removeVertexTempUsage(temp1);
        var code = "";
        if (this._iUsesCycle) {
            code += "mul " + degree + "," + animationRegisterCache.vertexTime + "," + orbitRegister + ".y\n";
            if (this._iUsesPhase)
                code += "add " + degree + "," + degree + "," + orbitRegister + ".w\n";
        }
        else
            code += "mul " + degree + "," + animationRegisterCache.vertexLife + "," + orbitRegister + ".y\n";
        code += "cos " + cos + "," + degree + "\n";
        code += "sin " + sin + "," + degree + "\n";
        code += "mul " + distance + ".x," + cos + "," + orbitRegister + ".x\n";
        code += "mul " + distance + ".y," + sin + "," + orbitRegister + ".x\n";
        code += "mov " + distance + ".wz" + animationRegisterCache.vertexZeroConst + "\n";
        if (this._iUsesEulers)
            code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
        code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
        if (animationRegisterCache.needVelocity) {
            code += "neg " + distance + ".x," + sin + "\n";
            code += "mov " + distance + ".y," + cos + "\n";
            code += "mov " + distance + ".zw," + animationRegisterCache.vertexZeroConst + "\n";
            if (this._iUsesEulers)
                code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
            code += "mul " + distance + "," + distance + "," + orbitRegister + ".z\n";
            code += "div " + distance + "," + distance + "," + orbitRegister + ".y\n";
            if (!this._iUsesCycle)
                code += "div " + distance + "," + distance + "," + animationRegisterCache.vertexLife + "\n";
            code += "add " + animationRegisterCache.velocityTarget + ".xyz," + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        //Vector3D.x is radius, Vector3D.y is cycle duration, Vector3D.z is phase
        var orbit = param[ParticleOrbitNode.ORBIT_VECTOR3D];
        if (!orbit)
            throw new Error("there is no " + ParticleOrbitNode.ORBIT_VECTOR3D + " in param!");
        this._pOneData[0] = orbit.x;
        if (this._iUsesCycle && orbit.y <= 0)
            throw (new Error("the cycle duration must be greater than zero"));
        this._pOneData[1] = Math.PI * 2 / (!this._iUsesCycle ? 1 : orbit.y);
        this._pOneData[2] = orbit.x * Math.PI * 2;
        if (this._iUsesPhase)
            this._pOneData[3] = orbit.z * Math.PI / 180;
    };
    /**
     * Reference for orbit node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the radius (x), cycle speed (y) and cycle phase (z) of the motion on the particle.
     */
    ParticleOrbitNode.ORBIT_VECTOR3D = "OrbitVector3D";
    return ParticleOrbitNode;
})(ParticleNodeBase);
module.exports = ParticleOrbitNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleOrbitState":"awayjs-renderergl/lib/animators/states/ParticleOrbitState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleOscillatorState = require("awayjs-renderergl/lib/animators/states/ParticleOscillatorState");
/**
 * A particle animation node used to control the position of a particle over time using simple harmonic motion.
 */
var ParticleOscillatorNode = (function (_super) {
    __extends(ParticleOscillatorNode, _super);
    /**
     * Creates a new <code>ParticleOscillatorNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
     */
    function ParticleOscillatorNode(mode /*uint*/, oscillator) {
        if (oscillator === void 0) { oscillator = null; }
        _super.call(this, "ParticleOscillator", mode, 4);
        this._pStateClass = ParticleOscillatorState;
        this._iOscillator = oscillator || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var oscillatorRegister = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleOscillatorState.OSCILLATOR_INDEX, oscillatorRegister.index);
        var temp = animationRegisterCache.getFreeVertexVectorTemp();
        var dgree = new ShaderRegisterElement(temp.regName, temp.index, 0);
        var sin = new ShaderRegisterElement(temp.regName, temp.index, 1);
        var cos = new ShaderRegisterElement(temp.regName, temp.index, 2);
        animationRegisterCache.addVertexTempUsages(temp, 1);
        var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
        var distance = new ShaderRegisterElement(temp2.regName, temp2.index);
        animationRegisterCache.removeVertexTempUsage(temp);
        var code = "";
        code += "mul " + dgree + "," + animationRegisterCache.vertexTime + "," + oscillatorRegister + ".w\n";
        code += "sin " + sin + "," + dgree + "\n";
        code += "mul " + distance + ".xyz," + sin + "," + oscillatorRegister + ".xyz\n";
        code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
        if (animationRegisterCache.needVelocity) {
            code += "cos " + cos + "," + dgree + "\n";
            code += "mul " + distance + ".xyz," + cos + "," + oscillatorRegister + ".xyz\n";
            code += "add " + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        //(Vector3D.x,Vector3D.y,Vector3D.z) is oscillator axis, Vector3D.w is oscillator cycle duration
        var drift = param[ParticleOscillatorNode.OSCILLATOR_VECTOR3D];
        if (!drift)
            throw (new Error("there is no " + ParticleOscillatorNode.OSCILLATOR_VECTOR3D + " in param!"));
        this._pOneData[0] = drift.x;
        this._pOneData[1] = drift.y;
        this._pOneData[2] = drift.z;
        if (drift.w <= 0)
            throw (new Error("the cycle duration must greater than zero"));
        this._pOneData[3] = Math.PI * 2 / drift.w;
    };
    /**
     * Reference for ocsillator node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the axis (x,y,z) and cycle speed (w) of the motion on the particle.
     */
    ParticleOscillatorNode.OSCILLATOR_VECTOR3D = "OscillatorVector3D";
    return ParticleOscillatorNode;
})(ParticleNodeBase);
module.exports = ParticleOscillatorNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleOscillatorState":"awayjs-renderergl/lib/animators/states/ParticleOscillatorState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticlePositionNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticlePositionState = require("awayjs-renderergl/lib/animators/states/ParticlePositionState");
/**
 * A particle animation node used to set the starting position of a particle.
 */
var ParticlePositionNode = (function (_super) {
    __extends(ParticlePositionNode, _super);
    /**
     * Creates a new <code>ParticlePositionNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
     */
    function ParticlePositionNode(mode /*uint*/, position) {
        if (position === void 0) { position = null; }
        _super.call(this, "ParticlePosition", mode, 3);
        this._pStateClass = ParticlePositionState;
        this._iPosition = position || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var positionAttribute = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticlePositionState.POSITION_INDEX, positionAttribute.index);
        return "add " + animationRegisterCache.positionTarget + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
    };
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var offset = param[ParticlePositionNode.POSITION_VECTOR3D];
        if (!offset)
            throw (new Error("there is no " + ParticlePositionNode.POSITION_VECTOR3D + " in param!"));
        this._pOneData[0] = offset.x;
        this._pOneData[1] = offset.y;
        this._pOneData[2] = offset.z;
    };
    /**
     * Reference for position node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing position of the particle.
     */
    ParticlePositionNode.POSITION_VECTOR3D = "PositionVector3D";
    return ParticlePositionNode;
})(ParticleNodeBase);
module.exports = ParticlePositionNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticlePositionState":"awayjs-renderergl/lib/animators/states/ParticlePositionState"}],"awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleRotateToHeadingState = require("awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState");
/**
 * A particle animation node used to control the rotation of a particle to match its heading vector.
 */
var ParticleRotateToHeadingNode = (function (_super) {
    __extends(ParticleRotateToHeadingNode, _super);
    /**
     * Creates a new <code>ParticleBillboardNode</code>
     */
    function ParticleRotateToHeadingNode() {
        _super.call(this, "ParticleRotateToHeading", ParticlePropertiesMode.GLOBAL, 0, 3);
        this._pStateClass = ParticleRotateToHeadingState;
    }
    /**
     * @inheritDoc
     */
    ParticleRotateToHeadingNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var code = "";
        var len = animationRegisterCache.rotationRegisters.length;
        var i /*int*/;
        if (animationRegisterCache.hasBillboard) {
            var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp1, 1);
            var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp2, 1);
            var temp3 = animationRegisterCache.getFreeVertexVectorTemp();
            var rotationMatrixRegister = animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.setRegisterIndex(this, ParticleRotateToHeadingState.MATRIX_INDEX, rotationMatrixRegister.index);
            animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.removeVertexTempUsage(temp1);
            animationRegisterCache.removeVertexTempUsage(temp2);
            //process the velocity
            code += "m33 " + temp1 + ".xyz," + animationRegisterCache.velocityTarget + ".xyz," + rotationMatrixRegister + "\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
            code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";
            //temp3.x=cos,temp3.y=sin
            //only process z axis
            code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".x," + temp3 + ".y\n";
            code += "mov " + temp2 + ".y," + temp3 + ".x\n";
            code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp3 + ".x\n";
            code += "neg " + temp1 + ".y," + temp3 + ".y\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
            code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
            for (i = 0; i < len; i++)
                code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
        }
        else {
            var nrmVel = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(nrmVel, 1);
            var xAxis = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(xAxis, 1);
            var R = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(R, 1);
            var R_rev = animationRegisterCache.getFreeVertexVectorTemp();
            var cos = new ShaderRegisterElement(R.regName, R.index, 3);
            var sin = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);
            var cos2 = new ShaderRegisterElement(nrmVel.regName, nrmVel.index, 3);
            var tempSingle = sin;
            animationRegisterCache.removeVertexTempUsage(nrmVel);
            animationRegisterCache.removeVertexTempUsage(xAxis);
            animationRegisterCache.removeVertexTempUsage(R);
            code += "mov " + xAxis + ".x," + animationRegisterCache.vertexOneConst + "\n";
            code += "mov " + xAxis + ".yz," + animationRegisterCache.vertexZeroConst + "\n";
            code += "nrm " + nrmVel + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
            code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
            code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
            //use R as temp to judge if nrm is (0,0,0).
            //if nrm is (0,0,0) ,change it to (0,0,1).
            code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
            code += "sge " + R + ".x," + animationRegisterCache.vertexZeroConst + "," + R + ".x\n";
            code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";
            code += "add " + tempSingle + "," + cos2 + "," + animationRegisterCache.vertexOneConst + "\n";
            code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
            code += "sqt " + cos + "," + tempSingle + "\n";
            code += "sub " + tempSingle + "," + animationRegisterCache.vertexOneConst + "," + cos2 + "\n";
            code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
            code += "sqt " + sin + "," + tempSingle + "\n";
            code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            //use cos as R.w
            code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
            //use cos as R_rev.w
            //nrmVel and xAxis are used as temp register
            code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
            //use cos as R.w
            code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
            code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
            code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
            code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
            //code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," +R_rev + ".w\n";
            code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
            code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
            code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
            for (i = 0; i < len; i++) {
                //just repeat the calculate above
                //because of the limited registers, no need to optimise
                code += "mov " + xAxis + ".x," + animationRegisterCache.vertexOneConst + "\n";
                code += "mov " + xAxis + ".yz," + animationRegisterCache.vertexZeroConst + "\n";
                code += "nrm " + nrmVel + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
                code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                code += "sge " + R + ".x," + animationRegisterCache.vertexZeroConst + "," + R + ".x\n";
                code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";
                code += "add " + tempSingle + "," + cos2 + "," + animationRegisterCache.vertexOneConst + "\n";
                code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
                code += "sqt " + cos + "," + tempSingle + "\n";
                code += "sub " + tempSingle + "," + animationRegisterCache.vertexOneConst + "," + cos2 + "\n";
                code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
                code += "sqt " + sin + "," + tempSingle + "\n";
                code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
                code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
                code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
                code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
                code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
                code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
                code += "add " + animationRegisterCache.rotationRegisters[i] + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
            }
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleRotateToHeadingNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleRotateToHeadingNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.needVelocity = true;
    };
    return ParticleRotateToHeadingNode;
})(ParticleNodeBase);
module.exports = ParticleRotateToHeadingNode;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState":"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleRotateToPositionState = require("awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState");
/**
 * A particle animation node used to control the rotation of a particle to face to a position
 */
var ParticleRotateToPositionNode = (function (_super) {
    __extends(ParticleRotateToPositionNode, _super);
    /**
     * Creates a new <code>ParticleRotateToPositionNode</code>
     */
    function ParticleRotateToPositionNode(mode /*uint*/, position) {
        if (position === void 0) { position = null; }
        _super.call(this, "ParticleRotateToPosition", mode, 3, 3);
        this._pStateClass = ParticleRotateToPositionState;
        this._iPosition = position || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleRotateToPositionNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var positionAttribute = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleRotateToPositionState.POSITION_INDEX, positionAttribute.index);
        var code = "";
        var len = animationRegisterCache.rotationRegisters.length;
        var i /*int*/;
        if (animationRegisterCache.hasBillboard) {
            var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp1, 1);
            var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp2, 1);
            var temp3 = animationRegisterCache.getFreeVertexVectorTemp();
            var rotationMatrixRegister = animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.setRegisterIndex(this, ParticleRotateToPositionState.MATRIX_INDEX, rotationMatrixRegister.index);
            animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.removeVertexTempUsage(temp1);
            animationRegisterCache.removeVertexTempUsage(temp2);
            //process the position
            code += "sub " + temp1 + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
            code += "m33 " + temp1 + ".xyz," + temp1 + ".xyz," + rotationMatrixRegister + "\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
            code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";
            //temp3.x=cos,temp3.y=sin
            //only process z axis
            code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".x," + temp3 + ".y\n";
            code += "mov " + temp2 + ".y," + temp3 + ".x\n";
            code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp3 + ".x\n";
            code += "neg " + temp1 + ".y," + temp3 + ".y\n";
            code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
            code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
            for (i = 0; i < len; i++)
                code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
        }
        else {
            var nrmDirection = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(nrmDirection, 1);
            var temp = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(temp, 1);
            var cos = new ShaderRegisterElement(temp.regName, temp.index, 0);
            var sin = new ShaderRegisterElement(temp.regName, temp.index, 1);
            var o_temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
            var tempSingle = new ShaderRegisterElement(temp.regName, temp.index, 3);
            var R = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(R, 1);
            animationRegisterCache.removeVertexTempUsage(nrmDirection);
            animationRegisterCache.removeVertexTempUsage(temp);
            animationRegisterCache.removeVertexTempUsage(R);
            code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
            code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
            code += "mov " + sin + "," + nrmDirection + ".y\n";
            code += "mul " + cos + "," + sin + "," + sin + "\n";
            code += "sub " + cos + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
            code += "sqt " + cos + "," + cos + "\n";
            code += "mul " + R + ".x," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".y\n";
            code += "mul " + R + ".y," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
            code += "mul " + R + ".z," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".y\n";
            code += "mul " + R + ".w," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
            code += "sub " + animationRegisterCache.scaleAndRotateTarget + ".y," + R + ".x," + R + ".y\n";
            code += "add " + animationRegisterCache.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";
            code += "abs " + R + ".y," + nrmDirection + ".y\n";
            code += "sge " + R + ".z," + R + ".y," + animationRegisterCache.vertexOneConst + "\n";
            code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
            //judgu if nrmDirection=(0,1,0);
            code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
            code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
            code += "sge " + tempSingle + "," + animationRegisterCache.vertexZeroConst + "," + sin + "\n";
            code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
            code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
            code += "sub " + sin + "," + animationRegisterCache.vertexOneConst + "," + tempSingle + "\n";
            code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
            code += "mov " + cos + "," + nrmDirection + ".z\n";
            code += "neg " + cos + "," + cos + "\n";
            code += "sub " + o_temp + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
            code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
            code += "add " + cos + "," + cos + "," + o_temp + "\n";
            code += "mul " + R + ".x," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".x\n";
            code += "mul " + R + ".y," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
            code += "mul " + R + ".z," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".x\n";
            code += "mul " + R + ".w," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
            code += "sub " + animationRegisterCache.scaleAndRotateTarget + ".x," + R + ".x," + R + ".y\n";
            code += "add " + animationRegisterCache.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";
            for (i = 0; i < len; i++) {
                //just repeat the calculate above
                //because of the limited registers, no need to optimise
                code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                code += "mov " + sin + "," + nrmDirection + ".y\n";
                code += "mul " + cos + "," + sin + "," + sin + "\n";
                code += "sub " + cos + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
                code += "sqt " + cos + "," + cos + "\n";
                code += "mul " + R + ".x," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".y\n";
                code += "mul " + R + ".y," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                code += "mul " + R + ".z," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".y\n";
                code += "mul " + R + ".w," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                code += "sub " + animationRegisterCache.rotationRegisters[i] + ".y," + R + ".x," + R + ".y\n";
                code += "add " + animationRegisterCache.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
                code += "abs " + R + ".y," + nrmDirection + ".y\n";
                code += "sge " + R + ".z," + R + ".y," + animationRegisterCache.vertexOneConst + "\n";
                code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
                code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
                code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                code += "sge " + tempSingle + "," + animationRegisterCache.vertexZeroConst + "," + sin + "\n";
                code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
                code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                code += "sub " + sin + "," + animationRegisterCache.vertexOneConst + "," + tempSingle + "\n";
                code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
                code += "mov " + cos + "," + nrmDirection + ".z\n";
                code += "neg " + cos + "," + cos + "\n";
                code += "sub " + o_temp + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
                code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
                code += "add " + cos + "," + cos + "," + o_temp + "\n";
                code += "mul " + R + ".x," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".x\n";
                code += "mul " + R + ".y," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                code += "mul " + R + ".z," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".x\n";
                code += "mul " + R + ".w," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                code += "sub " + animationRegisterCache.rotationRegisters[i] + ".x," + R + ".x," + R + ".y\n";
                code += "add " + animationRegisterCache.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
            }
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleRotateToPositionNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleRotateToPositionNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var offset = param[ParticleRotateToPositionNode.POSITION_VECTOR3D];
        if (!offset)
            throw (new Error("there is no " + ParticleRotateToPositionNode.POSITION_VECTOR3D + " in param!"));
        this._pOneData[0] = offset.x;
        this._pOneData[1] = offset.y;
        this._pOneData[2] = offset.z;
    };
    /**
     * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the position that the particle must face.
     */
    ParticleRotateToPositionNode.POSITION_VECTOR3D = "RotateToPositionVector3D";
    return ParticleRotateToPositionNode;
})(ParticleNodeBase);
module.exports = ParticleRotateToPositionNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState":"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleRotationalVelocityState = require("awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState");
/**
 * A particle animation node used to set the starting rotational velocity of a particle.
 */
var ParticleRotationalVelocityNode = (function (_super) {
    __extends(ParticleRotationalVelocityNode, _super);
    /**
     * Creates a new <code>ParticleRotationalVelocityNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     */
    function ParticleRotationalVelocityNode(mode /*uint*/, rotationalVelocity) {
        if (rotationalVelocity === void 0) { rotationalVelocity = null; }
        _super.call(this, "ParticleRotationalVelocity", mode, 4);
        this._pStateClass = ParticleRotationalVelocityState;
        this._iRotationalVelocity = rotationalVelocity || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var rotationRegister = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX, rotationRegister.index);
        var nrmVel = animationRegisterCache.getFreeVertexVectorTemp();
        animationRegisterCache.addVertexTempUsages(nrmVel, 1);
        var xAxis = animationRegisterCache.getFreeVertexVectorTemp();
        animationRegisterCache.addVertexTempUsages(xAxis, 1);
        var temp = animationRegisterCache.getFreeVertexVectorTemp();
        animationRegisterCache.addVertexTempUsages(temp, 1);
        var Rtemp = new ShaderRegisterElement(temp.regName, temp.index);
        var R_rev = animationRegisterCache.getFreeVertexVectorTemp();
        R_rev = new ShaderRegisterElement(R_rev.regName, R_rev.index);
        var cos = new ShaderRegisterElement(Rtemp.regName, Rtemp.index, 3);
        var sin = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);
        animationRegisterCache.removeVertexTempUsage(nrmVel);
        animationRegisterCache.removeVertexTempUsage(xAxis);
        animationRegisterCache.removeVertexTempUsage(temp);
        var code = "";
        code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
        code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";
        code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";
        code += "sin " + sin + "," + cos + "\n";
        code += "cos " + cos + "," + cos + "\n";
        code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
        code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
        code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
        //nrmVel and xAxis are used as temp register
        code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
        code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
        code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
        code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
        code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
        code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
        //use cos as R_rev.w
        code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
        code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
        code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        var len = animationRegisterCache.rotationRegisters.length;
        for (var i = 0; i < len; i++) {
            code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
            code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";
            code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";
            code += "sin " + sin + "," + cos + "\n";
            code += "cos " + cos + "," + cos + "\n";
            code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
            code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.rotationRegisters[i] + "\n";
            code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterCache.rotationRegisters[i] + "\n";
            code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
            code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
            code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
            code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
            code += "add " + animationRegisterCache.rotationRegisters[i] + "," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        //(Vector3d.x,Vector3d.y,Vector3d.z) is rotation axis,Vector3d.w is cycle duration
        var rotate = param[ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D];
        if (!rotate)
            throw (new Error("there is no " + ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D + " in param!"));
        if (rotate.length <= 0)
            rotate.z = 1; //set the default direction
        else
            rotate.normalize();
        this._pOneData[0] = rotate.x;
        this._pOneData[1] = rotate.y;
        this._pOneData[2] = rotate.z;
        if (rotate.w <= 0)
            throw (new Error("the cycle duration must greater than zero"));
        // it's used as angle/2 in agal
        this._pOneData[3] = Math.PI / rotate.w;
    };
    /**
     * Reference for rotational velocity node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
     */
    ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D = "RotationalVelocityVector3D";
    return ParticleRotationalVelocityNode;
})(ParticleNodeBase);
module.exports = ParticleRotationalVelocityNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState":"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleScaleNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleScaleState = require("awayjs-renderergl/lib/animators/states/ParticleScaleState");
/**
 * A particle animation node used to control the scale variation of a particle over time.
 */
var ParticleScaleNode = (function (_super) {
    __extends(ParticleScaleNode, _super);
    /**
     * Creates a new <code>ParticleScaleNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of animation independent of particle duration. Defaults to false.
     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the animation cycle. Defaults to false.
     * @param    [optional] minScale        Defines the default min scale transform of the node, when in global mode. Defaults to 1.
     * @param    [optional] maxScale        Defines the default max color transform of the node, when in global mode. Defaults to 1.
     * @param    [optional] cycleDuration   Defines the default duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the default phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
     */
    function ParticleScaleNode(mode /*uint*/, usesCycle, usesPhase, minScale, maxScale, cycleDuration, cyclePhase) {
        if (minScale === void 0) { minScale = 1; }
        if (maxScale === void 0) { maxScale = 1; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        _super.call(this, "ParticleScale", mode, (usesCycle && usesPhase) ? 4 : ((usesCycle || usesPhase) ? 3 : 2), 3);
        this._pStateClass = ParticleScaleState;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iMinScale = minScale;
        this._iMaxScale = maxScale;
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
    }
    /**
     * @inheritDoc
     */
    ParticleScaleNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var code = "";
        var temp = animationRegisterCache.getFreeVertexSingleTemp();
        var scaleRegister = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleScaleState.SCALE_INDEX, scaleRegister.index);
        if (this._iUsesCycle) {
            code += "mul " + temp + "," + animationRegisterCache.vertexTime + "," + scaleRegister + ".z\n";
            if (this._iUsesPhase)
                code += "add " + temp + "," + temp + "," + scaleRegister + ".w\n";
            code += "sin " + temp + "," + temp + "\n";
        }
        code += "mul " + temp + "," + scaleRegister + ".y," + ((this._iUsesCycle) ? temp : animationRegisterCache.vertexLife) + "\n";
        code += "add " + temp + "," + scaleRegister + ".x," + temp + "\n";
        code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleScaleNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleScaleNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var scale = param[ParticleScaleNode.SCALE_VECTOR3D];
        if (!scale)
            throw (new Error("there is no " + ParticleScaleNode.SCALE_VECTOR3D + " in param!"));
        if (this._iUsesCycle) {
            this._pOneData[0] = (scale.x + scale.y) / 2;
            this._pOneData[1] = Math.abs(scale.x - scale.y) / 2;
            if (scale.z <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            this._pOneData[2] = Math.PI * 2 / scale.z;
            if (this._iUsesPhase)
                this._pOneData[3] = scale.w * Math.PI / 180;
        }
        else {
            this._pOneData[0] = scale.x;
            this._pOneData[1] = scale.y - scale.x;
        }
    };
    /**
     * Reference for scale node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> representing the min scale (x), max scale(y), optional cycle speed (z) and phase offset (w) applied to the particle.
     */
    ParticleScaleNode.SCALE_VECTOR3D = "ScaleVector3D";
    return ParticleScaleNode;
})(ParticleNodeBase);
module.exports = ParticleScaleNode;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleScaleState":"awayjs-renderergl/lib/animators/states/ParticleScaleState"}],"awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleSegmentedColorState = require("awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState");
/**
 *
 */
var ParticleSegmentedColorNode = (function (_super) {
    __extends(ParticleSegmentedColorNode, _super);
    function ParticleSegmentedColorNode(usesMultiplier, usesOffset, numSegmentPoint /*int*/, startColor, endColor, segmentPoints) {
        //because of the stage3d register limitation, it only support the global mode
        _super.call(this, "ParticleSegmentedColor", ParticlePropertiesMode.GLOBAL, 0, ParticleAnimationSet.COLOR_PRIORITY);
        this._pStateClass = ParticleSegmentedColorState;
        if (numSegmentPoint > 4)
            throw (new Error("the numSegmentPoint must be less or equal 4"));
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iNumSegmentPoint = numSegmentPoint;
        this._iStartColor = startColor;
        this._iEndColor = endColor;
        this._iSegmentPoints = segmentPoints;
    }
    /**
     * @inheritDoc
     */
    ParticleSegmentedColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        if (this._iUsesMultiplier)
            particleAnimationSet.hasColorMulNode = true;
        if (this._iUsesOffset)
            particleAnimationSet.hasColorAddNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleSegmentedColorNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var code = "";
        if (animationRegisterCache.needFragmentAnimation) {
            var accMultiplierColor;
            //var accOffsetColor:ShaderRegisterElement;
            if (this._iUsesMultiplier) {
                accMultiplierColor = animationRegisterCache.getFreeVertexVectorTemp();
                animationRegisterCache.addVertexTempUsages(accMultiplierColor, 1);
            }
            var tempColor = animationRegisterCache.getFreeVertexVectorTemp();
            animationRegisterCache.addVertexTempUsages(tempColor, 1);
            var temp = animationRegisterCache.getFreeVertexVectorTemp();
            var accTime = new ShaderRegisterElement(temp.regName, temp.index, 0);
            var tempTime = new ShaderRegisterElement(temp.regName, temp.index, 1);
            if (this._iUsesMultiplier)
                animationRegisterCache.removeVertexTempUsage(accMultiplierColor);
            animationRegisterCache.removeVertexTempUsage(tempColor);
            //for saving all the life values (at most 4)
            var lifeTimeRegister = animationRegisterCache.getFreeVertexConstant();
            animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorState.TIME_DATA_INDEX, lifeTimeRegister.index);
            var i /*int*/;
            var startMulValue;
            var deltaMulValues;
            if (this._iUsesMultiplier) {
                startMulValue = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorState.START_MULTIPLIER_INDEX, startMulValue.index);
                deltaMulValues = new Array();
                for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                    deltaMulValues.push(animationRegisterCache.getFreeVertexConstant());
            }
            var startOffsetValue;
            var deltaOffsetValues;
            if (this._iUsesOffset) {
                startOffsetValue = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorState.START_OFFSET_INDEX, startOffsetValue.index);
                deltaOffsetValues = new Array();
                for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                    deltaOffsetValues.push(animationRegisterCache.getFreeVertexConstant());
            }
            if (this._iUsesMultiplier)
                code += "mov " + accMultiplierColor + "," + startMulValue + "\n";
            if (this._iUsesOffset)
                code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + startOffsetValue + "\n";
            for (i = 0; i < this._iNumSegmentPoint; i++) {
                switch (i) {
                    case 0:
                        code += "min " + tempTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
                        break;
                    case 1:
                        code += "sub " + accTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".y\n";
                        break;
                    case 2:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".z\n";
                        break;
                    case 3:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".w\n";
                        break;
                }
                if (this._iUsesMultiplier) {
                    code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[i] + "\n";
                    code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                }
                if (this._iUsesOffset) {
                    code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[i] + "\n";
                    code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + tempColor + "\n";
                }
            }
            //for the last segment:
            if (this._iNumSegmentPoint == 0)
                tempTime = animationRegisterCache.vertexLife;
            else {
                switch (this._iNumSegmentPoint) {
                    case 1:
                        code += "sub " + accTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
                        break;
                    case 2:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                        break;
                    case 3:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                        break;
                    case 4:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".w\n";
                        break;
                }
                code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
            }
            if (this._iUsesMultiplier) {
                code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[this._iNumSegmentPoint] + "\n";
                code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                code += "mul " + animationRegisterCache.colorMulTarget + "," + animationRegisterCache.colorMulTarget + "," + accMultiplierColor + "\n";
            }
            if (this._iUsesOffset) {
                code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[this._iNumSegmentPoint] + "\n";
                code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + tempColor + "\n";
            }
        }
        return code;
    };
    return ParticleSegmentedColorNode;
})(ParticleNodeBase);
module.exports = ParticleSegmentedColorNode;

},{"awayjs-renderergl/lib/animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState":"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleSpriteSheetState = require("awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState");
/**
 * A particle animation node used when a spritesheet texture is required to animate the particle.
 * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
 */
var ParticleSpriteSheetNode = (function (_super) {
    __extends(ParticleSpriteSheetNode, _super);
    /**
     * Creates a new <code>ParticleSpriteSheetNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] numColumns      Defines the number of columns in the spritesheet, when in global mode. Defaults to 1.
     * @param    [optional] numRows         Defines the number of rows in the spritesheet, when in global mode. Defaults to 1.
     * @param    [optional] cycleDuration   Defines the default cycle duration in seconds, when in global mode. Defaults to 1.
     * @param    [optional] cyclePhase      Defines the default cycle phase, when in global mode. Defaults to 0.
     * @param    [optional] totalFrames     Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows.
     * @param    [optional] looping         Defines whether the spritesheet animation is set to loop indefinitely. Defaults to true.
     */
    function ParticleSpriteSheetNode(mode /*uint*/, usesCycle, usesPhase, numColumns, numRows, cycleDuration, cyclePhase, totalFrames) {
        if (numColumns === void 0) { numColumns = 1; }
        if (numRows === void 0) { numRows = 1; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        if (totalFrames === void 0) { totalFrames = Number.MAX_VALUE; }
        _super.call(this, "ParticleSpriteSheet", mode, usesCycle ? (usesPhase ? 3 : 2) : 1, ParticleAnimationSet.POST_PRIORITY + 1);
        this._pStateClass = ParticleSpriteSheetState;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iNumColumns = numColumns;
        this._iNumRows = numRows;
        this._iCyclePhase = cyclePhase;
        this._iCycleDuration = cycleDuration;
        this._iTotalFrames = Math.min(totalFrames, numColumns * numRows);
    }
    Object.defineProperty(ParticleSpriteSheetNode.prototype, "numColumns", {
        /**
         * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
         */
        get: function () {
            return this._iNumColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSpriteSheetNode.prototype, "numRows", {
        /**
         * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
         */
        get: function () {
            return this._iNumRows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSpriteSheetNode.prototype, "totalFrames", {
        /**
         * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
         */
        get: function () {
            return this._iTotalFrames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype.getAGALUVCode = function (shader, animationRegisterCache) {
        //get 2 vc
        var uvParamConst1 = animationRegisterCache.getFreeVertexConstant();
        var uvParamConst2 = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleSpriteSheetState.UV_INDEX_0, uvParamConst1.index);
        animationRegisterCache.setRegisterIndex(this, ParticleSpriteSheetState.UV_INDEX_1, uvParamConst2.index);
        var uTotal = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 0);
        var uStep = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 1);
        var vStep = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 2);
        var uSpeed = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 0);
        var cycle = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 1);
        var phaseTime = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 2);
        var temp = animationRegisterCache.getFreeVertexVectorTemp();
        var time = new ShaderRegisterElement(temp.regName, temp.index, 0);
        var vOffset = new ShaderRegisterElement(temp.regName, temp.index, 1);
        temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
        var temp2 = new ShaderRegisterElement(temp.regName, temp.index, 3);
        var u = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, 0);
        var v = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, 1);
        var code = "";
        //scale uv
        code += "mul " + u + "," + u + "," + uStep + "\n";
        if (this._iNumRows > 1)
            code += "mul " + v + "," + v + "," + vStep + "\n";
        if (this._iUsesCycle) {
            if (this._iUsesPhase)
                code += "add " + time + "," + animationRegisterCache.vertexTime + "," + phaseTime + "\n";
            else
                code += "mov " + time + "," + animationRegisterCache.vertexTime + "\n";
            code += "div " + time + "," + time + "," + cycle + "\n";
            code += "frc " + time + "," + time + "\n";
            code += "mul " + time + "," + time + "," + cycle + "\n";
            code += "mul " + temp + "," + time + "," + uSpeed + "\n";
        }
        else
            code += "mul " + temp.toString() + "," + animationRegisterCache.vertexLife + "," + uTotal + "\n";
        if (this._iNumRows > 1) {
            code += "frc " + temp2 + "," + temp + "\n";
            code += "sub " + vOffset + "," + temp + "," + temp2 + "\n";
            code += "mul " + vOffset + "," + vOffset + "," + vStep + "\n";
            code += "add " + v + "," + v + "," + vOffset + "\n";
        }
        code += "div " + temp2 + "," + temp + "," + uStep + "\n";
        code += "frc " + temp + "," + temp2 + "\n";
        code += "sub " + temp2 + "," + temp2 + "," + temp + "\n";
        code += "mul " + temp + "," + temp2 + "," + uStep + "\n";
        if (this._iNumRows > 1)
            code += "frc " + temp + "," + temp + "\n";
        code += "add " + u + "," + u + "," + temp + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.hasUVNode = true;
    };
    /**
     * @inheritDoc
     */
    ParticleSpriteSheetNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        if (this._iUsesCycle) {
            var uvCycle = param[ParticleSpriteSheetNode.UV_VECTOR3D];
            if (!uvCycle)
                throw (new Error("there is no " + ParticleSpriteSheetNode.UV_VECTOR3D + " in param!"));
            if (uvCycle.x <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            var uTotal = this._iTotalFrames / this._iNumColumns;
            this._pOneData[0] = uTotal / uvCycle.x;
            this._pOneData[1] = uvCycle.x;
            if (this._iUsesPhase)
                this._pOneData[2] = uvCycle.y;
        }
    };
    /**
     * Reference for spritesheet node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
     */
    ParticleSpriteSheetNode.UV_VECTOR3D = "UVVector3D";
    return ParticleSpriteSheetNode;
})(ParticleNodeBase);
module.exports = ParticleSpriteSheetNode;

},{"awayjs-renderergl/lib/animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState":"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleTimeState = require("awayjs-renderergl/lib/animators/states/ParticleTimeState");
/**
 * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
 */
var ParticleTimeNode = (function (_super) {
    __extends(ParticleTimeNode, _super);
    /**
     * Creates a new <code>ParticleTimeNode</code>
     *
     * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
     * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
     * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
     */
    function ParticleTimeNode(usesDuration, usesLooping, usesDelay) {
        if (usesDuration === void 0) { usesDuration = false; }
        if (usesLooping === void 0) { usesLooping = false; }
        if (usesDelay === void 0) { usesDelay = false; }
        this._pStateClass = ParticleTimeState;
        this._iUsesDuration = usesDuration;
        this._iUsesLooping = usesLooping;
        this._iUsesDelay = usesDelay;
        _super.call(this, "ParticleTime", ParticlePropertiesMode.LOCAL_STATIC, 4, 0);
    }
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var timeStreamRegister = animationRegisterCache.getFreeVertexAttribute(); //timeStreamRegister.x is start，timeStreamRegister.y is during time
        animationRegisterCache.setRegisterIndex(this, ParticleTimeState.TIME_STREAM_INDEX, timeStreamRegister.index);
        var timeConst = animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.setRegisterIndex(this, ParticleTimeState.TIME_CONSTANT_INDEX, timeConst.index);
        var code = "";
        code += "sub " + animationRegisterCache.vertexTime + "," + timeConst + "," + timeStreamRegister + ".x\n";
        //if time=0,set the position to zero.
        var temp = animationRegisterCache.getFreeVertexSingleTemp();
        code += "sge " + temp + "," + animationRegisterCache.vertexTime + "," + animationRegisterCache.vertexZeroConst + "\n";
        code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";
        if (this._iUsesDuration) {
            if (this._iUsesLooping) {
                var div = animationRegisterCache.getFreeVertexSingleTemp();
                if (this._iUsesDelay) {
                    code += "div " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".z\n";
                    code += "frc " + div + "," + div + "\n";
                    code += "mul " + animationRegisterCache.vertexTime + "," + div + "," + timeStreamRegister + ".z\n";
                    code += "slt " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".y\n";
                    code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + div + "\n";
                }
                else {
                    code += "mul " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".w\n";
                    code += "frc " + div + "," + div + "\n";
                    code += "mul " + animationRegisterCache.vertexTime + "," + div + "," + timeStreamRegister + ".y\n";
                }
            }
            else {
                var sge = animationRegisterCache.getFreeVertexSingleTemp();
                code += "sge " + sge + "," + timeStreamRegister + ".y," + animationRegisterCache.vertexTime + "\n";
                code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + sge + "\n";
            }
        }
        code += "mul " + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        this._pOneData[0] = param.startTime;
        this._pOneData[1] = param.duration;
        this._pOneData[2] = param.delay + param.duration;
        this._pOneData[3] = 1 / param.duration;
    };
    return ParticleTimeNode;
})(ParticleNodeBase);
module.exports = ParticleTimeNode;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleTimeState":"awayjs-renderergl/lib/animators/states/ParticleTimeState"}],"awayjs-renderergl/lib/animators/nodes/ParticleUVNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleUVState = require("awayjs-renderergl/lib/animators/states/ParticleUVState");
/**
 * A particle animation node used to control the UV offset and scale of a particle over time.
 */
var ParticleUVNode = (function (_super) {
    __extends(ParticleUVNode, _super);
    /**
     * Creates a new <code>ParticleTimeNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] cycle           Defines whether the time track is in loop mode. Defaults to false.
     * @param    [optional] scale           Defines whether the time track is in loop mode. Defaults to false.
     * @param    [optional] axis            Defines whether the time track is in loop mode. Defaults to false.
     */
    function ParticleUVNode(mode /*uint*/, cycle, scale, axis) {
        if (cycle === void 0) { cycle = 1; }
        if (scale === void 0) { scale = 1; }
        if (axis === void 0) { axis = "x"; }
        //because of the stage3d register limitation, it only support the global mode
        _super.call(this, "ParticleUV", ParticlePropertiesMode.GLOBAL, 4, ParticleAnimationSet.POST_PRIORITY + 1);
        this._pStateClass = ParticleUVState;
        this._cycle = cycle;
        this._scale = scale;
        this._axis = axis;
        this.updateUVData();
    }
    Object.defineProperty(ParticleUVNode.prototype, "cycle", {
        /**
         *
         */
        get: function () {
            return this._cycle;
        },
        set: function (value) {
            this._cycle = value;
            this.updateUVData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleUVNode.prototype, "scale", {
        /**
         *
         */
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
            this.updateUVData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleUVNode.prototype, "axis", {
        /**
         *
         */
        get: function () {
            return this._axis;
        },
        set: function (value) {
            this._axis = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleUVNode.prototype.getAGALUVCode = function (shader, animationRegisterCache) {
        var code = "";
        var uvConst = animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.setRegisterIndex(this, ParticleUVState.UV_INDEX, uvConst.index);
        var axisIndex = this._axis == "x" ? 0 : (this._axis == "y" ? 1 : 2);
        var target = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, axisIndex);
        var sin = animationRegisterCache.getFreeVertexSingleTemp();
        if (this._scale != 1)
            code += "mul " + target + "," + target + "," + uvConst + ".y\n";
        code += "mul " + sin + "," + animationRegisterCache.vertexTime + "," + uvConst + ".x\n";
        code += "sin " + sin + "," + sin + "\n";
        code += "add " + target + "," + target + "," + sin + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleUVNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    ParticleUVNode.prototype.updateUVData = function () {
        this._iUvData = new Vector3D(Math.PI * 2 / this._cycle, this._scale, 0, 0);
    };
    /**
     * @inheritDoc
     */
    ParticleUVNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.hasUVNode = true;
    };
    /**
     *
     */
    ParticleUVNode.U_AXIS = "x";
    /**
     *
     */
    ParticleUVNode.V_AXIS = "y";
    return ParticleUVNode;
})(ParticleNodeBase);
module.exports = ParticleUVNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleUVState":"awayjs-renderergl/lib/animators/states/ParticleUVState","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleVelocityState = require("awayjs-renderergl/lib/animators/states/ParticleVelocityState");
/**
 * A particle animation node used to set the starting velocity of a particle.
 */
var ParticleVelocityNode = (function (_super) {
    __extends(ParticleVelocityNode, _super);
    /**
     * Creates a new <code>ParticleVelocityNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
     */
    function ParticleVelocityNode(mode /*uint*/, velocity) {
        if (velocity === void 0) { velocity = null; }
        _super.call(this, "ParticleVelocity", mode, 3);
        this._pStateClass = ParticleVelocityState;
        this._iVelocity = velocity || new Vector3D();
    }
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype.getAGALVertexCode = function (shader, animationRegisterCache) {
        var velocityValue = (this._pMode == ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
        animationRegisterCache.setRegisterIndex(this, ParticleVelocityState.VELOCITY_INDEX, velocityValue.index);
        var distance = animationRegisterCache.getFreeVertexVectorTemp();
        var code = "";
        code += "mul " + distance + "," + animationRegisterCache.vertexTime + "," + velocityValue + "\n";
        code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + "," + animationRegisterCache.positionTarget + ".xyz\n";
        if (animationRegisterCache.needVelocity)
            code += "add " + animationRegisterCache.velocityTarget + ".xyz," + velocityValue + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
        var _tempVelocity = param[ParticleVelocityNode.VELOCITY_VECTOR3D];
        if (!_tempVelocity)
            throw new Error("there is no " + ParticleVelocityNode.VELOCITY_VECTOR3D + " in param!");
        this._pOneData[0] = _tempVelocity.x;
        this._pOneData[1] = _tempVelocity.y;
        this._pOneData[2] = _tempVelocity.z;
    };
    /**
     * Reference for velocity node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
     */
    ParticleVelocityNode.VELOCITY_VECTOR3D = "VelocityVector3D";
    return ParticleVelocityNode;
})(ParticleNodeBase);
module.exports = ParticleVelocityNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","awayjs-renderergl/lib/animators/states/ParticleVelocityState":"awayjs-renderergl/lib/animators/states/ParticleVelocityState"}],"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonBinaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var SkeletonBinaryLERPNode = (function (_super) {
    __extends(SkeletonBinaryLERPNode, _super);
    /**
     * Creates a new <code>SkeletonBinaryLERPNode</code> object.
     */
    function SkeletonBinaryLERPNode() {
        _super.call(this);
        this._pStateClass = SkeletonBinaryLERPState;
    }
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonBinaryLERPNode;
})(AnimationNodeBase);
module.exports = SkeletonBinaryLERPNode;

},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState"}],"awayjs-renderergl/lib/animators/nodes/SkeletonClipNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
var SkeletonClipState = require("awayjs-renderergl/lib/animators/states/SkeletonClipState");
/**
 * A skeleton animation node containing time-based animation data as individual skeleton poses.
 */
var SkeletonClipNode = (function (_super) {
    __extends(SkeletonClipNode, _super);
    /**
     * Creates a new <code>SkeletonClipNode</code> object.
     */
    function SkeletonClipNode() {
        _super.call(this);
        this._frames = new Array();
        /**
         * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
         * of the output skeleton pose. Defaults to false.
         */
        this.highQuality = false;
        this._pStateClass = SkeletonClipState;
    }
    Object.defineProperty(SkeletonClipNode.prototype, "frames", {
        /**
         * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
         */
        get: function () {
            return this._frames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a skeleton pose frame to the internal timeline of the animation node.
     *
     * @param skeletonPose The skeleton pose object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     */
    SkeletonClipNode.prototype.addFrame = function (skeletonPose, duration /*number /*uint*/) {
        this._frames.push(skeletonPose);
        this._pDurations.push(duration);
        this._pNumFrames = this._pDurations.length;
        this._pStitchDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonClipNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    SkeletonClipNode.prototype._pUpdateStitch = function () {
        _super.prototype._pUpdateStitch.call(this);
        var i = this._pNumFrames - 1;
        var p1, p2, delta;
        while (i--) {
            this._pTotalDuration += this._pDurations[i];
            p1 = this._frames[i].jointPoses[0].translation;
            p2 = this._frames[i + 1].jointPoses[0].translation;
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
        if (this._pStitchFinalFrame || !this._pLooping) {
            this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
            p1 = this._frames[0].jointPoses[0].translation;
            p2 = this._frames[1].jointPoses[0].translation;
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
    };
    return SkeletonClipNode;
})(AnimationClipNodeBase);
module.exports = SkeletonClipNode;

},{"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase":"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase","awayjs-renderergl/lib/animators/states/SkeletonClipState":"awayjs-renderergl/lib/animators/states/SkeletonClipState"}],"awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonDifferenceState = require("awayjs-renderergl/lib/animators/states/SkeletonDifferenceState");
/**
 * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
 */
var SkeletonDifferenceNode = (function (_super) {
    __extends(SkeletonDifferenceNode, _super);
    /**
     * Creates a new <code>SkeletonAdditiveNode</code> object.
     */
    function SkeletonDifferenceNode() {
        _super.call(this);
        this._pStateClass = SkeletonDifferenceState;
    }
    /**
     * @inheritDoc
     */
    SkeletonDifferenceNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonDifferenceNode;
})(AnimationNodeBase);
module.exports = SkeletonDifferenceNode;

},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState":"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState"}],"awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonDirectionalState = require("awayjs-renderergl/lib/animators/states/SkeletonDirectionalState");
/**
 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
 */
var SkeletonDirectionalNode = (function (_super) {
    __extends(SkeletonDirectionalNode, _super);
    function SkeletonDirectionalNode() {
        _super.call(this);
        this._pStateClass = SkeletonDirectionalState;
    }
    /**
     * @inheritDoc
     */
    SkeletonDirectionalNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonDirectionalNode;
})(AnimationNodeBase);
module.exports = SkeletonDirectionalNode;

},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState":"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState"}],"awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonNaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState");
/**
 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var SkeletonNaryLERPNode = (function (_super) {
    __extends(SkeletonNaryLERPNode, _super);
    /**
     * Creates a new <code>SkeletonNaryLERPNode</code> object.
     */
    function SkeletonNaryLERPNode() {
        _super.call(this);
        this._iInputs = new Array();
        this._pStateClass = SkeletonNaryLERPState;
    }
    Object.defineProperty(SkeletonNaryLERPNode.prototype, "numInputs", {
        get: function () {
            return this._numInputs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an integer representing the input index of the given skeleton animation node.
     *
     * @param input The skeleton animation node for with the input index is requested.
     */
    SkeletonNaryLERPNode.prototype.getInputIndex = function (input) {
        return this._iInputs.indexOf(input);
    };
    /**
     * Returns the skeleton animation node object that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node is requested.
     */
    SkeletonNaryLERPNode.prototype.getInputAt = function (index /*uint*/) {
        return this._iInputs[index];
    };
    /**
     * Adds a new skeleton animation node input to the animation node.
     */
    SkeletonNaryLERPNode.prototype.addInput = function (input) {
        this._iInputs[this._numInputs++] = input;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonNaryLERPNode;
})(AnimationNodeBase);
module.exports = SkeletonNaryLERPNode;

},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState"}],"awayjs-renderergl/lib/animators/nodes/VertexClipNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
var VertexClipState = require("awayjs-renderergl/lib/animators/states/VertexClipState");
/**
 * A vertex animation node containing time-based animation data as individual geometry obejcts.
 */
var VertexClipNode = (function (_super) {
    __extends(VertexClipNode, _super);
    /**
     * Creates a new <code>VertexClipNode</code> object.
     */
    function VertexClipNode() {
        _super.call(this);
        this._frames = new Array();
        this._translations = new Array();
        this._pStateClass = VertexClipState;
    }
    Object.defineProperty(VertexClipNode.prototype, "frames", {
        /**
         * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
         */
        get: function () {
            return this._frames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a geometry object to the internal timeline of the animation node.
     *
     * @param geometry The geometry object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
     */
    VertexClipNode.prototype.addFrame = function (geometry, duration /*uint*/, translation) {
        if (translation === void 0) { translation = null; }
        this._frames.push(geometry);
        this._pDurations.push(duration);
        this._translations.push(translation || new Vector3D());
        this._pNumFrames = this._pDurations.length;
        this._pStitchDirty = true;
    };
    /**
     * @inheritDoc
     */
    VertexClipNode.prototype._pUpdateStitch = function () {
        _super.prototype._pUpdateStitch.call(this);
        var i = this._pNumFrames - 1;
        var p1, p2, delta;
        while (i--) {
            this._pTotalDuration += this._pDurations[i];
            p1 = this._translations[i];
            p2 = this._translations[i + 1];
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
        if (this._pNumFrames > 1 && (this._pStitchFinalFrame || !this._pLooping)) {
            this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
            p1 = this._translations[0];
            p2 = this._translations[1];
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
    };
    return VertexClipNode;
})(AnimationClipNodeBase);
module.exports = VertexClipNode;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase":"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase","awayjs-renderergl/lib/animators/states/VertexClipState":"awayjs-renderergl/lib/animators/states/VertexClipState"}],"awayjs-renderergl/lib/animators/states/AnimationClipState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
var AnimationStateEvent = require("awayjs-renderergl/lib/events/AnimationStateEvent");
/**
 *
 */
var AnimationClipState = (function (_super) {
    __extends(AnimationClipState, _super);
    function AnimationClipState(animator, animationClipNode) {
        _super.call(this, animator, animationClipNode);
        this._pFramesDirty = true;
        this._animationClipNode = animationClipNode;
    }
    Object.defineProperty(AnimationClipState.prototype, "blendWeight", {
        /**
         * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
         * between the current frame (0) and next frame (1) of the animation.
         *
         * @see #currentFrame
         * @see #nextFrame
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pBlendWeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipState.prototype, "currentFrame", {
        /**
         * Returns the current frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pCurrentFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipState.prototype, "nextFrame", {
        /**
         * Returns the next frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pNextFrame;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype.update = function (time /*int*/) {
        if (!this._animationClipNode.looping) {
            if (time > this._pStartTime + this._animationClipNode.totalDuration)
                time = this._pStartTime + this._animationClipNode.totalDuration;
            else if (time < this._pStartTime)
                time = this._pStartTime;
        }
        if (this._pTime == time - this._pStartTime)
            return;
        this._pUpdateTime(time);
    };
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype.phase = function (value) {
        var time = value * this._animationClipNode.totalDuration + this._pStartTime;
        if (this._pTime == time - this._pStartTime)
            return;
        this._pUpdateTime(time);
    };
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype._pUpdateTime = function (time /*int*/) {
        this._pFramesDirty = true;
        this._pTimeDir = (time - this._pStartTime > this._pTime) ? 1 : -1;
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
     *
     * @see #currentFrame
     * @see #nextFrame
     * @see #blendWeight
     */
    AnimationClipState.prototype._pUpdateFrames = function () {
        this._pFramesDirty = false;
        var looping = this._animationClipNode.looping;
        var totalDuration = this._animationClipNode.totalDuration;
        var lastFrame = this._animationClipNode.lastFrame;
        var time = this._pTime;
        //trace("time", time, totalDuration)
        if (looping && (time >= totalDuration || time < 0)) {
            time %= totalDuration;
            if (time < 0)
                time += totalDuration;
        }
        if (!looping && time >= totalDuration) {
            this.notifyPlaybackComplete();
            this._pCurrentFrame = lastFrame;
            this._pNextFrame = lastFrame;
            this._pBlendWeight = 0;
        }
        else if (!looping && time <= 0) {
            this._pCurrentFrame = 0;
            this._pNextFrame = 0;
            this._pBlendWeight = 0;
        }
        else if (this._animationClipNode.fixedFrameRate) {
            var t = time / totalDuration * lastFrame;
            this._pCurrentFrame = Math.floor(t);
            this._pBlendWeight = t - this._pCurrentFrame;
            this._pNextFrame = this._pCurrentFrame + 1;
        }
        else {
            this._pCurrentFrame = 0;
            this._pNextFrame = 0;
            var dur = 0, frameTime /*uint*/;
            var durations = this._animationClipNode.durations;
            do {
                frameTime = dur;
                dur += durations[this._pNextFrame];
                this._pCurrentFrame = this._pNextFrame++;
            } while (time > dur);
            if (this._pCurrentFrame == lastFrame) {
                this._pCurrentFrame = 0;
                this._pNextFrame = 1;
            }
            this._pBlendWeight = (time - frameTime) / durations[this._pCurrentFrame];
        }
    };
    AnimationClipState.prototype.notifyPlaybackComplete = function () {
        if (this._animationStatePlaybackComplete == null)
            this._animationStatePlaybackComplete = new AnimationStateEvent(AnimationStateEvent.PLAYBACK_COMPLETE, this._pAnimator, this, this._animationClipNode);
        this._animationClipNode.dispatchEvent(this._animationStatePlaybackComplete);
    };
    return AnimationClipState;
})(AnimationStateBase);
module.exports = AnimationClipState;

},{"awayjs-renderergl/lib/animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase","awayjs-renderergl/lib/events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent"}],"awayjs-renderergl/lib/animators/states/AnimationStateBase":[function(require,module,exports){
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 *
 */
var AnimationStateBase = (function () {
    function AnimationStateBase(animator, animationNode) {
        this._pRootDelta = new Vector3D();
        this._pPositionDeltaDirty = true;
        this._pStartTime = 0;
        this._pAnimator = animator;
        this._pAnimationNode = animationNode;
    }
    Object.defineProperty(AnimationStateBase.prototype, "positionDelta", {
        /**
         * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
         */
        get: function () {
            if (this._pPositionDeltaDirty) {
                this._pUpdatePositionDelta();
            }
            return this._pRootDelta;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the start time of the node to a  new value.
     *
     * @param startTime The absolute start time (in milliseconds) of the node's starting time.
     */
    AnimationStateBase.prototype.offset = function (startTime) {
        this._pStartTime = startTime;
        this._pPositionDeltaDirty = true;
    };
    /**
     * Updates the configuration of the node to its current state.
     *
     * @param time The absolute time (in milliseconds) of the animator's play head position.
     *
     * @see AnimatorBase#update()
     */
    AnimationStateBase.prototype.update = function (time) {
        if (this._pTime == time - this._pStartTime) {
            return;
        }
        this._pUpdateTime(time);
    };
    /**
     * Sets the animation phase of the node.
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    AnimationStateBase.prototype.phase = function (value) {
    };
    /**
     * Updates the node's internal playhead position.
     *
     * @param time The local time (in milliseconds) of the node's playhead position.
     */
    AnimationStateBase.prototype._pUpdateTime = function (time) {
        this._pTime = time - this._pStartTime;
        this._pPositionDeltaDirty = true;
    };
    /**
     * Updates the node's root delta position
     */
    AnimationStateBase.prototype._pUpdatePositionDelta = function () {
    };
    return AnimationStateBase;
})();
module.exports = AnimationStateBase;

},{"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/states/IAnimationState":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/animators/states/ISkeletonAnimationState":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/animators/states/IVertexAnimationState":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/animators/states/ParticleAccelerationState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleAccelerationState = (function (_super) {
    __extends(ParticleAccelerationState, _super);
    function ParticleAccelerationState(animator, particleAccelerationNode) {
        _super.call(this, animator, particleAccelerationNode);
        this._particleAccelerationNode = particleAccelerationNode;
        this._acceleration = this._particleAccelerationNode._acceleration;
        this.updateAccelerationData();
    }
    Object.defineProperty(ParticleAccelerationState.prototype, "acceleration", {
        /**
         * Defines the acceleration vector of the state, used when in global mode.
         */
        get: function () {
            return this._acceleration;
        },
        set: function (value) {
            this._acceleration.x = value.x;
            this._acceleration.y = value.y;
            this._acceleration.z = value.z;
            this.updateAccelerationData();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleAccelerationState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleAccelerationState.ACCELERATION_INDEX);
        if (this._particleAccelerationNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
            animationSubGeometry.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
        else
            animationRegisterCache.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
    };
    ParticleAccelerationState.prototype.updateAccelerationData = function () {
        if (this._particleAccelerationNode.mode == ParticlePropertiesMode.GLOBAL)
            this._halfAcceleration = new Vector3D(this._acceleration.x / 2, this._acceleration.y / 2, this._acceleration.z / 2);
    };
    /** @private */
    ParticleAccelerationState.ACCELERATION_INDEX = 0;
    return ParticleAccelerationState;
})(ParticleStateBase);
module.exports = ParticleAccelerationState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleBezierCurveState = (function (_super) {
    __extends(ParticleBezierCurveState, _super);
    function ParticleBezierCurveState(animator, particleBezierCurveNode) {
        _super.call(this, animator, particleBezierCurveNode);
        this._particleBezierCurveNode = particleBezierCurveNode;
        this._controlPoint = this._particleBezierCurveNode._iControlPoint;
        this._endPoint = this._particleBezierCurveNode._iEndPoint;
    }
    Object.defineProperty(ParticleBezierCurveState.prototype, "controlPoint", {
        /**
         * Defines the default control point of the node, used when in global mode.
         */
        get: function () {
            return this._controlPoint;
        },
        set: function (value) {
            this._controlPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleBezierCurveState.prototype, "endPoint", {
        /**
         * Defines the default end point of the node, used when in global mode.
         */
        get: function () {
            return this._endPoint;
        },
        set: function (value) {
            this._endPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    ParticleBezierCurveState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var controlIndex = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_CONTROL_INDEX);
        var endIndex = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_END_INDEX);
        if (this._particleBezierCurveNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
            animationSubGeometry.activateVertexBuffer(controlIndex, this._particleBezierCurveNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
            animationSubGeometry.activateVertexBuffer(endIndex, this._particleBezierCurveNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
        }
        else {
            animationRegisterCache.setVertexConst(controlIndex, this._controlPoint.x, this._controlPoint.y, this._controlPoint.z);
            animationRegisterCache.setVertexConst(endIndex, this._endPoint.x, this._endPoint.y, this._endPoint.z);
        }
    };
    /** @private */
    ParticleBezierCurveState.BEZIER_CONTROL_INDEX = 0;
    /** @private */
    ParticleBezierCurveState.BEZIER_END_INDEX = 1;
    return ParticleBezierCurveState;
})(ParticleStateBase);
module.exports = ParticleBezierCurveState;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleBillboardState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MathConsts = require("awayjs-core/lib/geom/MathConsts");
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Orientation3D = require("awayjs-core/lib/geom/Orientation3D");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleBillboardState = (function (_super) {
    __extends(ParticleBillboardState, _super);
    /**
     *
     */
    function ParticleBillboardState(animator, particleNode) {
        _super.call(this, animator, particleNode);
        this._matrix = new Matrix3D;
        this._billboardAxis = particleNode._iBillboardAxis;
    }
    ParticleBillboardState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var comps;
        if (this._billboardAxis) {
            var pos = renderable.sourceEntity.sceneTransform.position;
            var look = camera.sceneTransform.position.subtract(pos);
            var right = look.crossProduct(this._billboardAxis);
            right.normalize();
            look = this.billboardAxis.crossProduct(right);
            look.normalize();
            //create a quick inverse projection matrix
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);
            this._matrix.copyColumnFrom(0, right);
            this._matrix.copyColumnFrom(1, this.billboardAxis);
            this._matrix.copyColumnFrom(2, look);
            this._matrix.copyColumnFrom(3, pos);
            this._matrix.appendRotation(-comps[1].w * MathConsts.RADIANS_TO_DEGREES, comps[1]);
        }
        else {
            //create a quick inverse projection matrix
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            //decompose using axis angle rotations
            comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);
            //recreate the matrix with just the rotation data
            this._matrix.identity();
            this._matrix.appendRotation(-comps[1].w * MathConsts.RADIANS_TO_DEGREES, comps[1]);
        }
        //set a new matrix transform constant
        animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleBillboardState.MATRIX_INDEX), this._matrix);
    };
    Object.defineProperty(ParticleBillboardState.prototype, "billboardAxis", {
        /**
         * Defines the billboard axis.
         */
        get: function () {
            return this.billboardAxis;
        },
        set: function (value) {
            this.billboardAxis = value ? value.clone() : null;
            if (this.billboardAxis)
                this.billboardAxis.normalize();
        },
        enumerable: true,
        configurable: true
    });
    /** @private */
    ParticleBillboardState.MATRIX_INDEX = 0;
    return ParticleBillboardState;
})(ParticleStateBase);
module.exports = ParticleBillboardState;

},{"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Orientation3D":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleColorState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 * @author ...
 */
var ParticleColorState = (function (_super) {
    __extends(ParticleColorState, _super);
    function ParticleColorState(animator, particleColorNode) {
        _super.call(this, animator, particleColorNode);
        this._particleColorNode = particleColorNode;
        this._usesMultiplier = this._particleColorNode._iUsesMultiplier;
        this._usesOffset = this._particleColorNode._iUsesOffset;
        this._usesCycle = this._particleColorNode._iUsesCycle;
        this._usesPhase = this._particleColorNode._iUsesPhase;
        this._startColor = this._particleColorNode._iStartColor;
        this._endColor = this._particleColorNode._iEndColor;
        this._cycleDuration = this._particleColorNode._iCycleDuration;
        this._cyclePhase = this._particleColorNode._iCyclePhase;
        this.updateColorData();
    }
    Object.defineProperty(ParticleColorState.prototype, "startColor", {
        /**
         * Defines the start color transform of the state, when in global mode.
         */
        get: function () {
            return this._startColor;
        },
        set: function (value) {
            this._startColor = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleColorState.prototype, "endColor", {
        /**
         * Defines the end color transform of the state, when in global mode.
         */
        get: function () {
            return this._endColor;
        },
        set: function (value) {
            this._endColor = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleColorState.prototype, "cycleDuration", {
        /**
         * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleColorState.prototype, "cyclePhase", {
        /**
         * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleColorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (animationRegisterCache.needFragmentAnimation) {
            var dataOffset = this._particleColorNode._iDataOffset;
            if (this._usesCycle)
                animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.CYCLE_INDEX), this._cycleData.x, this._cycleData.y, this._cycleData.z, this._cycleData.w);
            if (this._usesMultiplier) {
                if (this._particleColorNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    dataOffset += 4;
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    dataOffset += 4;
                }
                else {
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_MULTIPLIER_INDEX), this._startMultiplierData.x, this._startMultiplierData.y, this._startMultiplierData.z, this._startMultiplierData.w);
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_MULTIPLIER_INDEX), this._deltaMultiplierData.x, this._deltaMultiplierData.y, this._deltaMultiplierData.z, this._deltaMultiplierData.w);
                }
            }
            if (this._usesOffset) {
                if (this._particleColorNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    dataOffset += 4;
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    dataOffset += 4;
                }
                else {
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_OFFSET_INDEX), this._startOffsetData.x, this._startOffsetData.y, this._startOffsetData.z, this._startOffsetData.w);
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_OFFSET_INDEX), this._deltaOffsetData.x, this._deltaOffsetData.y, this._deltaOffsetData.z, this._deltaOffsetData.w);
                }
            }
        }
    };
    ParticleColorState.prototype.updateColorData = function () {
        if (this._usesCycle) {
            if (this._cycleDuration <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            this._cycleData = new Vector3D(Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180, 0, 0);
        }
        if (this._particleColorNode.mode == ParticlePropertiesMode.GLOBAL) {
            if (this._usesCycle) {
                if (this._usesMultiplier) {
                    this._startMultiplierData = new Vector3D((this._startColor.redMultiplier + this._endColor.redMultiplier) / 2, (this._startColor.greenMultiplier + this._endColor.greenMultiplier) / 2, (this._startColor.blueMultiplier + this._endColor.blueMultiplier) / 2, (this._startColor.alphaMultiplier + this._endColor.alphaMultiplier) / 2);
                    this._deltaMultiplierData = new Vector3D((this._endColor.redMultiplier - this._startColor.redMultiplier) / 2, (this._endColor.greenMultiplier - this._startColor.greenMultiplier) / 2, (this._endColor.blueMultiplier - this._startColor.blueMultiplier) / 2, (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier) / 2);
                }
                if (this._usesOffset) {
                    this._startOffsetData = new Vector3D((this._startColor.redOffset + this._endColor.redOffset) / (255 * 2), (this._startColor.greenOffset + this._endColor.greenOffset) / (255 * 2), (this._startColor.blueOffset + this._endColor.blueOffset) / (255 * 2), (this._startColor.alphaOffset + this._endColor.alphaOffset) / (255 * 2));
                    this._deltaOffsetData = new Vector3D((this._endColor.redOffset - this._startColor.redOffset) / (255 * 2), (this._endColor.greenOffset - this._startColor.greenOffset) / (255 * 2), (this._endColor.blueOffset - this._startColor.blueOffset) / (255 * 2), (this._endColor.alphaOffset - this._startColor.alphaOffset) / (255 * 2));
                }
            }
            else {
                if (this._usesMultiplier) {
                    this._startMultiplierData = new Vector3D(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
                    this._deltaMultiplierData = new Vector3D((this._endColor.redMultiplier - this._startColor.redMultiplier), (this._endColor.greenMultiplier - this._startColor.greenMultiplier), (this._endColor.blueMultiplier - this._startColor.blueMultiplier), (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier));
                }
                if (this._usesOffset) {
                    this._startOffsetData = new Vector3D(this._startColor.redOffset / 255, this._startColor.greenOffset / 255, this._startColor.blueOffset / 255, this._startColor.alphaOffset / 255);
                    this._deltaOffsetData = new Vector3D((this._endColor.redOffset - this._startColor.redOffset) / 255, (this._endColor.greenOffset - this._startColor.greenOffset) / 255, (this._endColor.blueOffset - this._startColor.blueOffset) / 255, (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255);
                }
            }
        }
    };
    /** @private */
    ParticleColorState.START_MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleColorState.DELTA_MULTIPLIER_INDEX = 1;
    /** @private */
    ParticleColorState.START_OFFSET_INDEX = 2;
    /** @private */
    ParticleColorState.DELTA_OFFSET_INDEX = 3;
    /** @private */
    ParticleColorState.CYCLE_INDEX = 4;
    return ParticleColorState;
})(ParticleStateBase);
module.exports = ParticleColorState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleFollowState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MathConsts = require("awayjs-core/lib/geom/MathConsts");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleFollowState = (function (_super) {
    __extends(ParticleFollowState, _super);
    function ParticleFollowState(animator, particleFollowNode) {
        _super.call(this, animator, particleFollowNode, true);
        this._targetPos = new Vector3D();
        this._targetEuler = new Vector3D();
        //temporary vector3D for calculation
        this._temp = new Vector3D();
        this._particleFollowNode = particleFollowNode;
        this._smooth = particleFollowNode._iSmooth;
    }
    Object.defineProperty(ParticleFollowState.prototype, "followTarget", {
        get: function () {
            return this._followTarget;
        },
        set: function (value) {
            this._followTarget = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleFollowState.prototype, "smooth", {
        get: function () {
            return this._smooth;
        },
        set: function (value) {
            this._smooth = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleFollowState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (this._followTarget) {
            if (this._particleFollowNode._iUsesPosition) {
                this._targetPos.x = this._followTarget.transform.position.x / renderable.sourceEntity.scaleX;
                this._targetPos.y = this._followTarget.transform.position.y / renderable.sourceEntity.scaleY;
                this._targetPos.z = this._followTarget.transform.position.z / renderable.sourceEntity.scaleZ;
            }
            if (this._particleFollowNode._iUsesRotation) {
                this._targetEuler.x = this._followTarget.rotationX;
                this._targetEuler.y = this._followTarget.rotationY;
                this._targetEuler.z = this._followTarget.rotationZ;
                this._targetEuler.scaleBy(MathConsts.DEGREES_TO_RADIANS);
            }
        }
        //initialization
        if (!this._prePos)
            this._prePos = this._targetPos.clone();
        if (!this._preEuler)
            this._preEuler = this._targetEuler.clone();
        var currentTime = this._pTime / 1000;
        var previousTime = animationSubGeometry.previousTime;
        var deltaTime = currentTime - previousTime;
        var needProcess = previousTime != currentTime;
        if (this._particleFollowNode._iUsesPosition && this._particleFollowNode._iUsesRotation) {
            if (needProcess)
                this.processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);
            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
        }
        else if (this._particleFollowNode._iUsesPosition) {
            if (needProcess)
                this.processPosition(currentTime, deltaTime, animationSubGeometry);
            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
        }
        else if (this._particleFollowNode._iUsesRotation) {
            if (needProcess)
                this.precessRotation(currentTime, deltaTime, animationSubGeometry);
            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
        }
        this._prePos.copyFrom(this._targetPos);
        this._targetEuler.copyFrom(this._targetEuler);
        animationSubGeometry.previousTime = currentTime;
    };
    ParticleFollowState.prototype.processPosition = function (currentTime, deltaTime, animationSubGeometry) {
        var data = animationSubGeometry.animationParticles;
        var vertexData = animationSubGeometry.vertexData;
        var changed = false;
        var len = data.length;
        var interpolatedPos;
        var posVelocity;
        if (this._smooth) {
            posVelocity = this._prePos.subtract(this._targetPos);
            posVelocity.scaleBy(1 / deltaTime);
        }
        else
            interpolatedPos = this._targetPos;
        for (var i = 0; i < len; i++) {
            var k = (currentTime - data[i].startTime) / data[i].totalTime;
            var t = (k - Math.floor(k)) * data[i].totalTime;
            if (t - deltaTime <= 0) {
                var inc = data[i].startVertexIndex * animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                if (this._smooth) {
                    this._temp.copyFrom(posVelocity);
                    this._temp.scaleBy(t);
                    interpolatedPos = this._targetPos.add(this._temp);
                }
                if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z) {
                    changed = true;
                    for (var j = 0; j < data[i].numVertices; j++) {
                        vertexData[inc++] = interpolatedPos.x;
                        vertexData[inc++] = interpolatedPos.y;
                        vertexData[inc++] = interpolatedPos.z;
                    }
                }
            }
        }
        if (changed)
            animationSubGeometry.invalidateBuffer();
    };
    ParticleFollowState.prototype.precessRotation = function (currentTime, deltaTime, animationSubGeometry) {
        var data = animationSubGeometry.animationParticles;
        var vertexData = animationSubGeometry.vertexData;
        var changed = false;
        var len = data.length;
        var interpolatedRotation;
        var rotationVelocity;
        if (this._smooth) {
            rotationVelocity = this._preEuler.subtract(this._targetEuler);
            rotationVelocity.scaleBy(1 / deltaTime);
        }
        else
            interpolatedRotation = this._targetEuler;
        for (var i = 0; i < len; i++) {
            var k = (currentTime - data[i].startTime) / data[i].totalTime;
            var t = (k - Math.floor(k)) * data[i].totalTime;
            if (t - deltaTime <= 0) {
                var inc = data[i].startVertexIndex * animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                if (this._smooth) {
                    this._temp.copyFrom(rotationVelocity);
                    this._temp.scaleBy(t);
                    interpolatedRotation = this._targetEuler.add(this._temp);
                }
                if (vertexData[inc] != interpolatedRotation.x || vertexData[inc + 1] != interpolatedRotation.y || vertexData[inc + 2] != interpolatedRotation.z) {
                    changed = true;
                    for (var j = 0; j < data[i].numVertices; j++) {
                        vertexData[inc++] = interpolatedRotation.x;
                        vertexData[inc++] = interpolatedRotation.y;
                        vertexData[inc++] = interpolatedRotation.z;
                    }
                }
            }
        }
        if (changed)
            animationSubGeometry.invalidateBuffer();
    };
    ParticleFollowState.prototype.processPositionAndRotation = function (currentTime, deltaTime, animationSubGeometry) {
        var data = animationSubGeometry.animationParticles;
        var vertexData = animationSubGeometry.vertexData;
        var changed = false;
        var len = data.length;
        var interpolatedPos;
        var interpolatedRotation;
        var posVelocity;
        var rotationVelocity;
        if (this._smooth) {
            posVelocity = this._prePos.subtract(this._targetPos);
            posVelocity.scaleBy(1 / deltaTime);
            rotationVelocity = this._preEuler.subtract(this._targetEuler);
            rotationVelocity.scaleBy(1 / deltaTime);
        }
        else {
            interpolatedPos = this._targetPos;
            interpolatedRotation = this._targetEuler;
        }
        for (var i = 0; i < len; i++) {
            var k = (currentTime - data[i].startTime) / data[i].totalTime;
            var t = (k - Math.floor(k)) * data[i].totalTime;
            if (t - deltaTime <= 0) {
                var inc = data[i].startVertexIndex * animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                if (this._smooth) {
                    this._temp.copyFrom(posVelocity);
                    this._temp.scaleBy(t);
                    interpolatedPos = this._targetPos.add(this._temp);
                    this._temp.copyFrom(rotationVelocity);
                    this._temp.scaleBy(t);
                    interpolatedRotation = this._targetEuler.add(this._temp);
                }
                if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z || vertexData[inc + 3] != interpolatedRotation.x || vertexData[inc + 4] != interpolatedRotation.y || vertexData[inc + 5] != interpolatedRotation.z) {
                    changed = true;
                    for (var j = 0; j < data[i].numVertices; j++) {
                        vertexData[inc++] = interpolatedPos.x;
                        vertexData[inc++] = interpolatedPos.y;
                        vertexData[inc++] = interpolatedPos.z;
                        vertexData[inc++] = interpolatedRotation.x;
                        vertexData[inc++] = interpolatedRotation.y;
                        vertexData[inc++] = interpolatedRotation.z;
                    }
                }
            }
        }
        if (changed)
            animationSubGeometry.invalidateBuffer();
    };
    /** @private */
    ParticleFollowState.FOLLOW_POSITION_INDEX = 0;
    /** @private */
    ParticleFollowState.FOLLOW_ROTATION_INDEX = 1;
    return ParticleFollowState;
})(ParticleStateBase);
module.exports = ParticleFollowState;

},{"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleInitialColorState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
*
*/
var ParticleInitialColorState = (function (_super) {
    __extends(ParticleInitialColorState, _super);
    function ParticleInitialColorState(animator, particleInitialColorNode) {
        _super.call(this, animator, particleInitialColorNode);
        this._particleInitialColorNode = particleInitialColorNode;
        this._usesMultiplier = particleInitialColorNode._iUsesMultiplier;
        this._usesOffset = particleInitialColorNode._iUsesOffset;
        this._initialColor = particleInitialColorNode._iInitialColor;
        this.updateColorData();
    }
    Object.defineProperty(ParticleInitialColorState.prototype, "initialColor", {
        /**
         * Defines the initial color transform of the state, when in global mode.
         */
        get: function () {
            return this._initialColor;
        },
        set: function (value) {
            this._initialColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleInitialColorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        // TODO: not used
        renderable = renderable;
        camera = camera;
        if (animationRegisterCache.needFragmentAnimation) {
            if (this._particleInitialColorNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
                var dataOffset = this._particleInitialColorNode._iDataOffset;
                if (this._usesMultiplier) {
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    dataOffset += 4;
                }
                if (this._usesOffset)
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
            }
            else {
                if (this._usesMultiplier)
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), this._multiplierData.x, this._multiplierData.y, this._multiplierData.z, this._multiplierData.w);
                if (this._usesOffset)
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), this._offsetData.x, this._offsetData.y, this._offsetData.z, this._offsetData.w);
            }
        }
    };
    ParticleInitialColorState.prototype.updateColorData = function () {
        if (this._particleInitialColorNode.mode == ParticlePropertiesMode.GLOBAL) {
            if (this._usesMultiplier)
                this._multiplierData = new Vector3D(this._initialColor.redMultiplier, this._initialColor.greenMultiplier, this._initialColor.blueMultiplier, this._initialColor.alphaMultiplier);
            if (this._usesOffset)
                this._offsetData = new Vector3D(this._initialColor.redOffset / 255, this._initialColor.greenOffset / 255, this._initialColor.blueOffset / 255, this._initialColor.alphaOffset / 255);
        }
    };
    /** @private */
    ParticleInitialColorState.MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleInitialColorState.OFFSET_INDEX = 1;
    return ParticleInitialColorState;
})(ParticleStateBase);
module.exports = ParticleInitialColorState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleOrbitState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleOrbitState = (function (_super) {
    __extends(ParticleOrbitState, _super);
    function ParticleOrbitState(animator, particleOrbitNode) {
        _super.call(this, animator, particleOrbitNode);
        this._particleOrbitNode = particleOrbitNode;
        this._usesEulers = this._particleOrbitNode._iUsesEulers;
        this._usesCycle = this._particleOrbitNode._iUsesCycle;
        this._usesPhase = this._particleOrbitNode._iUsesPhase;
        this._eulers = this._particleOrbitNode._iEulers;
        this._radius = this._particleOrbitNode._iRadius;
        this._cycleDuration = this._particleOrbitNode._iCycleDuration;
        this._cyclePhase = this._particleOrbitNode._iCyclePhase;
        this.updateOrbitData();
    }
    Object.defineProperty(ParticleOrbitState.prototype, "radius", {
        /**
         * Defines the radius of the orbit when in global mode. Defaults to 100.
         */
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleOrbitState.prototype, "cycleDuration", {
        /**
         * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleOrbitState.prototype, "cyclePhase", {
        /**
         * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleOrbitState.prototype, "eulers", {
        /**
         * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
         */
        get: function () {
            return this._eulers;
        },
        set: function (value) {
            this._eulers = value;
            this.updateOrbitData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleOrbitState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.ORBIT_INDEX);
        if (this._particleOrbitNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
            if (this._usesPhase)
                animationSubGeometry.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
            else
                animationSubGeometry.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
        }
        else
            animationRegisterCache.setVertexConst(index, this._orbitData.x, this._orbitData.y, this._orbitData.z, this._orbitData.w);
        if (this._usesEulers)
            animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.EULERS_INDEX), this._eulersMatrix);
    };
    ParticleOrbitState.prototype.updateOrbitData = function () {
        if (this._usesEulers) {
            this._eulersMatrix = new Matrix3D();
            this._eulersMatrix.appendRotation(this._eulers.x, Vector3D.X_AXIS);
            this._eulersMatrix.appendRotation(this._eulers.y, Vector3D.Y_AXIS);
            this._eulersMatrix.appendRotation(this._eulers.z, Vector3D.Z_AXIS);
        }
        if (this._particleOrbitNode.mode == ParticlePropertiesMode.GLOBAL) {
            this._orbitData = new Vector3D(this._radius, 0, this._radius * Math.PI * 2, this._cyclePhase * Math.PI / 180);
            if (this._usesCycle) {
                if (this._cycleDuration <= 0)
                    throw (new Error("the cycle duration must be greater than zero"));
                this._orbitData.y = Math.PI * 2 / this._cycleDuration;
            }
            else
                this._orbitData.y = Math.PI * 2;
        }
    };
    /** @private */
    ParticleOrbitState.ORBIT_INDEX = 0;
    /** @private */
    ParticleOrbitState.EULERS_INDEX = 1;
    return ParticleOrbitState;
})(ParticleStateBase);
module.exports = ParticleOrbitState;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleOscillatorState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleOscillatorState = (function (_super) {
    __extends(ParticleOscillatorState, _super);
    function ParticleOscillatorState(animator, particleOscillatorNode) {
        _super.call(this, animator, particleOscillatorNode);
        this._particleOscillatorNode = particleOscillatorNode;
        this._oscillator = this._particleOscillatorNode._iOscillator;
        this.updateOscillatorData();
    }
    Object.defineProperty(ParticleOscillatorState.prototype, "oscillator", {
        /**
         * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
         */
        get: function () {
            return this._oscillator;
        },
        set: function (value) {
            this._oscillator = value;
            this.updateOscillatorData();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleOscillatorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleOscillatorState.OSCILLATOR_INDEX);
        if (this._particleOscillatorNode.mode == ParticlePropertiesMode.LOCAL_STATIC)
            animationSubGeometry.activateVertexBuffer(index, this._particleOscillatorNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
        else
            animationRegisterCache.setVertexConst(index, this._oscillatorData.x, this._oscillatorData.y, this._oscillatorData.z, this._oscillatorData.w);
    };
    ParticleOscillatorState.prototype.updateOscillatorData = function () {
        if (this._particleOscillatorNode.mode == ParticlePropertiesMode.GLOBAL) {
            if (this._oscillator.w <= 0)
                throw (new Error("the cycle duration must greater than zero"));
            if (this._oscillatorData == null)
                this._oscillatorData = new Vector3D();
            this._oscillatorData.x = this._oscillator.x;
            this._oscillatorData.y = this._oscillator.y;
            this._oscillatorData.z = this._oscillator.z;
            this._oscillatorData.w = Math.PI * 2 / this._oscillator.w;
        }
    };
    /** @private */
    ParticleOscillatorState.OSCILLATOR_INDEX = 0;
    return ParticleOscillatorState;
})(ParticleStateBase);
module.exports = ParticleOscillatorState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticlePositionState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 * @author ...
 */
var ParticlePositionState = (function (_super) {
    __extends(ParticlePositionState, _super);
    function ParticlePositionState(animator, particlePositionNode) {
        _super.call(this, animator, particlePositionNode);
        this._particlePositionNode = particlePositionNode;
        this._position = this._particlePositionNode._iPosition;
    }
    Object.defineProperty(ParticlePositionState.prototype, "position", {
        /**
         * Defines the position of the particle when in global mode. Defaults to 0,0,0.
         */
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticlePositionState.prototype.getPositions = function () {
        return this._pDynamicProperties;
    };
    ParticlePositionState.prototype.setPositions = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    /**
     * @inheritDoc
     */
    ParticlePositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (this._particlePositionNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
            this._pUpdateDynamicProperties(animationSubGeometry);
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);
        if (this._particlePositionNode.mode == ParticlePropertiesMode.GLOBAL)
            animationRegisterCache.setVertexConst(index, this._position.x, this._position.y, this._position.z);
        else
            animationSubGeometry.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticlePositionState.POSITION_INDEX = 0;
    return ParticlePositionState;
})(ParticleStateBase);
module.exports = ParticlePositionState;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToHeadingState = (function (_super) {
    __extends(ParticleRotateToHeadingState, _super);
    function ParticleRotateToHeadingState(animator, particleNode) {
        _super.call(this, animator, particleNode);
        this._matrix = new Matrix3D();
    }
    ParticleRotateToHeadingState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (animationRegisterCache.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingState.MATRIX_INDEX), this._matrix);
        }
    };
    /** @private */
    ParticleRotateToHeadingState.MATRIX_INDEX = 0;
    return ParticleRotateToHeadingState;
})(ParticleStateBase);
module.exports = ParticleRotateToHeadingState;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToPositionState = (function (_super) {
    __extends(ParticleRotateToPositionState, _super);
    function ParticleRotateToPositionState(animator, particleRotateToPositionNode) {
        _super.call(this, animator, particleRotateToPositionNode);
        this._matrix = new Matrix3D();
        this._particleRotateToPositionNode = particleRotateToPositionNode;
        this._position = this._particleRotateToPositionNode._iPosition;
    }
    Object.defineProperty(ParticleRotateToPositionState.prototype, "position", {
        /**
         * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
         */
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    ParticleRotateToPositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.POSITION_INDEX);
        if (animationRegisterCache.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
        }
        if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode.GLOBAL) {
            this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
            animationRegisterCache.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
        }
        else
            animationSubGeometry.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticleRotateToPositionState.MATRIX_INDEX = 0;
    /** @private */
    ParticleRotateToPositionState.POSITION_INDEX = 1;
    return ParticleRotateToPositionState;
})(ParticleStateBase);
module.exports = ParticleRotateToPositionState;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotationalVelocityState = (function (_super) {
    __extends(ParticleRotationalVelocityState, _super);
    function ParticleRotationalVelocityState(animator, particleRotationNode) {
        _super.call(this, animator, particleRotationNode);
        this._particleRotationalVelocityNode = particleRotationNode;
        this._rotationalVelocity = this._particleRotationalVelocityNode._iRotationalVelocity;
        this.updateRotationalVelocityData();
    }
    Object.defineProperty(ParticleRotationalVelocityState.prototype, "rotationalVelocity", {
        /**
         * Defines the default rotationalVelocity of the state, used when in global mode.
         */
        get: function () {
            return this._rotationalVelocity;
        },
        set: function (value) {
            this._rotationalVelocity = value;
            this.updateRotationalVelocityData();
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticleRotationalVelocityState.prototype.getRotationalVelocities = function () {
        return this._pDynamicProperties;
    };
    ParticleRotationalVelocityState.prototype.setRotationalVelocities = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
            this._pUpdateDynamicProperties(animationSubGeometry);
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX);
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
            animationRegisterCache.setVertexConst(index, this._rotationalVelocityData.x, this._rotationalVelocityData.y, this._rotationalVelocityData.z, this._rotationalVelocityData.w);
        else
            animationSubGeometry.activateVertexBuffer(index, this._particleRotationalVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
    };
    ParticleRotationalVelocityState.prototype.updateRotationalVelocityData = function () {
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode.GLOBAL) {
            if (this._rotationalVelocity.w <= 0)
                throw (new Error("the cycle duration must greater than zero"));
            var rotation = this._rotationalVelocity.clone();
            if (rotation.length <= 0)
                rotation.z = 1; //set the default direction
            else
                rotation.normalize();
            // w is used as angle/2 in agal
            this._rotationalVelocityData = new Vector3D(rotation.x, rotation.y, rotation.z, Math.PI / rotation.w);
        }
    };
    /** @private */
    ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX = 0;
    return ParticleRotationalVelocityState;
})(ParticleStateBase);
module.exports = ParticleRotationalVelocityState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleScaleState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleScaleState = (function (_super) {
    __extends(ParticleScaleState, _super);
    function ParticleScaleState(animator, particleScaleNode) {
        _super.call(this, animator, particleScaleNode);
        this._particleScaleNode = particleScaleNode;
        this._usesCycle = this._particleScaleNode._iUsesCycle;
        this._usesPhase = this._particleScaleNode._iUsesPhase;
        this._minScale = this._particleScaleNode._iMinScale;
        this._maxScale = this._particleScaleNode._iMaxScale;
        this._cycleDuration = this._particleScaleNode._iCycleDuration;
        this._cyclePhase = this._particleScaleNode._iCyclePhase;
        this.updateScaleData();
    }
    Object.defineProperty(ParticleScaleState.prototype, "minScale", {
        /**
         * Defines the end scale of the state, when in global mode. Defaults to 1.
         */
        get: function () {
            return this._minScale;
        },
        set: function (value) {
            this._minScale = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleScaleState.prototype, "maxScale", {
        /**
         * Defines the end scale of the state, when in global mode. Defaults to 1.
         */
        get: function () {
            return this._maxScale;
        },
        set: function (value) {
            this._maxScale = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleScaleState.prototype, "cycleDuration", {
        /**
         * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleScaleState.prototype, "cyclePhase", {
        /**
         * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateScaleData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleScaleState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleScaleState.SCALE_INDEX);
        if (this._particleScaleNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
            if (this._usesCycle) {
                if (this._usesPhase)
                    animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                else
                    animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
            }
            else
                animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_2);
        }
        else
            animationRegisterCache.setVertexConst(index, this._scaleData.x, this._scaleData.y, this._scaleData.z, this._scaleData.w);
    };
    ParticleScaleState.prototype.updateScaleData = function () {
        if (this._particleScaleNode.mode == ParticlePropertiesMode.GLOBAL) {
            if (this._usesCycle) {
                if (this._cycleDuration <= 0)
                    throw (new Error("the cycle duration must be greater than zero"));
                this._scaleData = new Vector3D((this._minScale + this._maxScale) / 2, Math.abs(this._minScale - this._maxScale) / 2, Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180);
            }
            else
                this._scaleData = new Vector3D(this._minScale, this._maxScale - this._minScale, 0, 0);
        }
    };
    /** @private */
    ParticleScaleState.SCALE_INDEX = 0;
    return ParticleScaleState;
})(ParticleStateBase);
module.exports = ParticleScaleState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 *
 */
var ParticleSegmentedColorState = (function (_super) {
    __extends(ParticleSegmentedColorState, _super);
    function ParticleSegmentedColorState(animator, particleSegmentedColorNode) {
        _super.call(this, animator, particleSegmentedColorNode);
        this._usesMultiplier = particleSegmentedColorNode._iUsesMultiplier;
        this._usesOffset = particleSegmentedColorNode._iUsesOffset;
        this._startColor = particleSegmentedColorNode._iStartColor;
        this._endColor = particleSegmentedColorNode._iEndColor;
        this._segmentPoints = particleSegmentedColorNode._iSegmentPoints;
        this._numSegmentPoint = particleSegmentedColorNode._iNumSegmentPoint;
        this.updateColorData();
    }
    Object.defineProperty(ParticleSegmentedColorState.prototype, "startColor", {
        /**
         * Defines the start color transform of the state, when in global mode.
         */
        get: function () {
            return this._startColor;
        },
        set: function (value) {
            this._startColor = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "endColor", {
        /**
         * Defines the end color transform of the state, when in global mode.
         */
        get: function () {
            return this._endColor;
        },
        set: function (value) {
            this._endColor = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "numSegmentPoint", {
        /**
         * Defines the number of segments.
         */
        get: function () {
            return this._numSegmentPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "segmentPoints", {
        /**
         * Defines the key points of color
         */
        get: function () {
            return this._segmentPoints;
        },
        set: function (value) {
            this._segmentPoints = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "usesMultiplier", {
        get: function () {
            return this._usesMultiplier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "usesOffset", {
        get: function () {
            return this._usesOffset;
        },
        enumerable: true,
        configurable: true
    });
    ParticleSegmentedColorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (animationRegisterCache.needFragmentAnimation) {
            if (this._numSegmentPoint > 0)
                animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.TIME_DATA_INDEX), this._timeLifeData[0], this._timeLifeData[1], this._timeLifeData[2], this._timeLifeData[3]);
            if (this._usesMultiplier)
                animationRegisterCache.setVertexConstFromArray(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_MULTIPLIER_INDEX), this._multiplierData);
            if (this._usesOffset)
                animationRegisterCache.setVertexConstFromArray(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_OFFSET_INDEX), this._offsetData);
        }
    };
    ParticleSegmentedColorState.prototype.updateColorData = function () {
        this._timeLifeData = new Array();
        this._multiplierData = new Array();
        this._offsetData = new Array();
        var i /*int*/;
        for (i = 0; i < this._numSegmentPoint; i++) {
            if (i == 0)
                this._timeLifeData.push(this._segmentPoints[i].life);
            else
                this._timeLifeData.push(this._segmentPoints[i].life - this._segmentPoints[i - 1].life);
        }
        if (this._numSegmentPoint == 0)
            this._timeLifeData.push(1);
        else
            this._timeLifeData.push(1 - this._segmentPoints[i - 1].life);
        if (this._usesMultiplier) {
            this._multiplierData.push(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
            for (i = 0; i < this._numSegmentPoint; i++) {
                if (i == 0)
                    this._multiplierData.push((this._segmentPoints[i].color.redMultiplier - this._startColor.redMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.greenMultiplier - this._startColor.greenMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.blueMultiplier - this._startColor.blueMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.alphaMultiplier - this._startColor.alphaMultiplier) / this._timeLifeData[i]);
                else
                    this._multiplierData.push((this._segmentPoints[i].color.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i]);
            }
            if (this._numSegmentPoint == 0)
                this._multiplierData.push(this._endColor.redMultiplier - this._startColor.redMultiplier, this._endColor.greenMultiplier - this._startColor.greenMultiplier, this._endColor.blueMultiplier - this._startColor.blueMultiplier, this._endColor.alphaMultiplier - this._startColor.alphaMultiplier);
            else
                this._multiplierData.push((this._endColor.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i], (this._endColor.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i], (this._endColor.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i], (this._endColor.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i]);
        }
        if (this._usesOffset) {
            this._offsetData.push(this._startColor.redOffset / 255, this._startColor.greenOffset / 255, this._startColor.blueOffset / 255, this._startColor.alphaOffset / 255);
            for (i = 0; i < this._numSegmentPoint; i++) {
                if (i == 0)
                    this._offsetData.push((this._segmentPoints[i].color.redOffset - this._startColor.redOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.greenOffset - this._startColor.greenOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.blueOffset - this._startColor.blueOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.alphaOffset - this._startColor.alphaOffset) / this._timeLifeData[i] / 255);
                else
                    this._offsetData.push((this._segmentPoints[i].color.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255);
            }
            if (this._numSegmentPoint == 0)
                this._offsetData.push((this._endColor.redOffset - this._startColor.redOffset) / 255, (this._endColor.greenOffset - this._startColor.greenOffset) / 255, (this._endColor.blueOffset - this._startColor.blueOffset) / 255, (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255);
            else
                this._offsetData.push((this._endColor.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255, (this._endColor.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255, (this._endColor.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255, (this._endColor.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255);
        }
        //cut off the data
        this._timeLifeData.length = 4;
    };
    /** @private */
    ParticleSegmentedColorState.START_MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleSegmentedColorState.START_OFFSET_INDEX = 1;
    /** @private */
    ParticleSegmentedColorState.TIME_DATA_INDEX = 2;
    return ParticleSegmentedColorState;
})(ParticleStateBase);
module.exports = ParticleSegmentedColorState;

},{"awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleSpriteSheetState = (function (_super) {
    __extends(ParticleSpriteSheetState, _super);
    function ParticleSpriteSheetState(animator, particleSpriteSheetNode) {
        _super.call(this, animator, particleSpriteSheetNode);
        this._particleSpriteSheetNode = particleSpriteSheetNode;
        this._usesCycle = this._particleSpriteSheetNode._iUsesCycle;
        this._usesPhase = this._particleSpriteSheetNode._iUsesCycle;
        this._totalFrames = this._particleSpriteSheetNode._iTotalFrames;
        this._numColumns = this._particleSpriteSheetNode._iNumColumns;
        this._numRows = this._particleSpriteSheetNode._iNumRows;
        this._cycleDuration = this._particleSpriteSheetNode._iCycleDuration;
        this._cyclePhase = this._particleSpriteSheetNode._iCyclePhase;
        this.updateSpriteSheetData();
    }
    Object.defineProperty(ParticleSpriteSheetState.prototype, "cyclePhase", {
        /**
         * Defines the cycle phase, when in global mode. Defaults to zero.
         */
        get: function () {
            return this._cyclePhase;
        },
        set: function (value) {
            this._cyclePhase = value;
            this.updateSpriteSheetData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSpriteSheetState.prototype, "cycleDuration", {
        /**
         * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
         */
        get: function () {
            return this._cycleDuration;
        },
        set: function (value) {
            this._cycleDuration = value;
            this.updateSpriteSheetData();
        },
        enumerable: true,
        configurable: true
    });
    ParticleSpriteSheetState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (animationRegisterCache.needUVAnimation) {
            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_0), this._spriteSheetData[0], this._spriteSheetData[1], this._spriteSheetData[2], this._spriteSheetData[3]);
            if (this._usesCycle) {
                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_1);
                if (this._particleSpriteSheetNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
                    if (this._usesPhase)
                        animationSubGeometry.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                    else
                        animationSubGeometry.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_2);
                }
                else
                    animationRegisterCache.setVertexConst(index, this._spriteSheetData[4], this._spriteSheetData[5]);
            }
        }
    };
    ParticleSpriteSheetState.prototype.updateSpriteSheetData = function () {
        this._spriteSheetData = new Array(8);
        var uTotal = this._totalFrames / this._numColumns;
        this._spriteSheetData[0] = uTotal;
        this._spriteSheetData[1] = 1 / this._numColumns;
        this._spriteSheetData[2] = 1 / this._numRows;
        if (this._usesCycle) {
            if (this._cycleDuration <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            this._spriteSheetData[4] = uTotal / this._cycleDuration;
            this._spriteSheetData[5] = this._cycleDuration;
            if (this._usesPhase)
                this._spriteSheetData[6] = this._cyclePhase;
        }
    };
    /** @private */
    ParticleSpriteSheetState.UV_INDEX_0 = 0;
    /** @private */
    ParticleSpriteSheetState.UV_INDEX_1 = 1;
    return ParticleSpriteSheetState;
})(ParticleStateBase);
module.exports = ParticleSpriteSheetState;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleStateBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 * ...
 */
var ParticleStateBase = (function (_super) {
    __extends(ParticleStateBase, _super);
    function ParticleStateBase(animator, particleNode, needUpdateTime) {
        if (needUpdateTime === void 0) { needUpdateTime = false; }
        _super.call(this, animator, particleNode);
        this._pDynamicProperties = new Array();
        this._pDynamicPropertiesDirty = new Object();
        this._particleNode = particleNode;
        this._pNeedUpdateTime = needUpdateTime;
    }
    Object.defineProperty(ParticleStateBase.prototype, "needUpdateTime", {
        get: function () {
            return this._pNeedUpdateTime;
        },
        enumerable: true,
        configurable: true
    });
    ParticleStateBase.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
    };
    ParticleStateBase.prototype._pUpdateDynamicProperties = function (animationSubGeometry) {
        this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId] = true;
        var animationParticles = animationSubGeometry.animationParticles;
        var vertexData = animationSubGeometry.vertexData;
        var totalLenOfOneVertex = animationSubGeometry.totalLenOfOneVertex;
        var dataLength = this._particleNode.dataLength;
        var dataOffset = this._particleNode._iDataOffset;
        var vertexLength /*uint*/;
        //			var particleOffset:number /*uint*/;
        var startingOffset /*uint*/;
        var vertexOffset /*uint*/;
        var data;
        var animationParticle;
        //			var numParticles:number /*uint*/ = _positions.length/dataLength;
        var numParticles = this._pDynamicProperties.length;
        var i = 0;
        var j = 0;
        var k = 0;
        while (i < numParticles) {
            while (j < numParticles && (animationParticle = animationParticles[j]).index == i) {
                data = this._pDynamicProperties[i];
                vertexLength = animationParticle.numVertices * totalLenOfOneVertex;
                startingOffset = animationParticle.startVertexIndex * totalLenOfOneVertex + dataOffset;
                for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                    vertexOffset = startingOffset + k;
                    for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                        vertexOffset = startingOffset + k;
                        vertexData[vertexOffset++] = data.x;
                        vertexData[vertexOffset++] = data.y;
                        vertexData[vertexOffset++] = data.z;
                        if (dataLength == 4)
                            vertexData[vertexOffset++] = data.w;
                    }
                }
                j++;
            }
            i++;
        }
        animationSubGeometry.invalidateBuffer();
    };
    return ParticleStateBase;
})(AnimationStateBase);
module.exports = ParticleStateBase;

},{"awayjs-renderergl/lib/animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleTimeState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleTimeState = (function (_super) {
    __extends(ParticleTimeState, _super);
    function ParticleTimeState(animator, particleTimeNode) {
        _super.call(this, animator, particleTimeNode, true);
        this._particleTimeNode = particleTimeNode;
    }
    ParticleTimeState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
        var particleTime = this._pTime / 1000;
        animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
    };
    /** @private */
    ParticleTimeState.TIME_STREAM_INDEX = 0;
    /** @private */
    ParticleTimeState.TIME_CONSTANT_INDEX = 1;
    return ParticleTimeState;
})(ParticleStateBase);
module.exports = ParticleTimeState;

},{"awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleUVState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleUVState = (function (_super) {
    __extends(ParticleUVState, _super);
    function ParticleUVState(animator, particleUVNode) {
        _super.call(this, animator, particleUVNode);
        this._particleUVNode = particleUVNode;
    }
    ParticleUVState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (animationRegisterCache.needUVAnimation) {
            var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleUVState.UV_INDEX);
            var data = this._particleUVNode._iUvData;
            animationRegisterCache.setVertexConst(index, data.x, data.y);
        }
    };
    /** @private */
    ParticleUVState.UV_INDEX = 0;
    return ParticleUVState;
})(ParticleStateBase);
module.exports = ParticleUVState;

},{"awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleVelocityState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleVelocityState = (function (_super) {
    __extends(ParticleVelocityState, _super);
    function ParticleVelocityState(animator, particleVelocityNode) {
        _super.call(this, animator, particleVelocityNode);
        this._particleVelocityNode = particleVelocityNode;
        this._velocity = this._particleVelocityNode._iVelocity;
    }
    Object.defineProperty(ParticleVelocityState.prototype, "velocity", {
        /**
         * Defines the default velocity vector of the state, used when in global mode.
         */
        get: function () {
            return this._velocity;
        },
        set: function (value) {
            this._velocity = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticleVelocityState.prototype.getVelocities = function () {
        return this._pDynamicProperties;
    };
    ParticleVelocityState.prototype.setVelocities = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    ParticleVelocityState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (this._particleVelocityNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
            this._pUpdateDynamicProperties(animationSubGeometry);
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleVelocityState.VELOCITY_INDEX);
        if (this._particleVelocityNode.mode == ParticlePropertiesMode.GLOBAL)
            animationRegisterCache.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
        else
            animationSubGeometry.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticleVelocityState.VELOCITY_INDEX = 0;
    return ParticleVelocityState;
})(ParticleStateBase);
module.exports = ParticleVelocityState;

},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","awayjs-renderergl/lib/animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonBinaryLERPState = (function (_super) {
    __extends(SkeletonBinaryLERPState, _super);
    function SkeletonBinaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._inputA = animator.getAnimationState(this._skeletonAnimationNode.inputA);
        this._inputB = animator.getAnimationState(this._skeletonAnimationNode.inputB);
    }
    Object.defineProperty(SkeletonBinaryLERPState.prototype, "blendWeight", {
        /**
         * Defines a fractional value between 0 and 1 representing the blending ratio between inputA (0) and inputB (1),
         * used to produce the skeleton pose output.
         *
         * @see inputA
         * @see inputB
         */
        get: function () {
            return this._blendWeight;
        },
        set: function (value) {
            this._blendWeight = value;
            this._pPositionDeltaDirty = true;
            this._skeletonPoseDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._inputA.phase(value);
        this._inputB.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPState.prototype._pUpdateTime = function (time /*int*/) {
        this._skeletonPoseDirty = true;
        this._inputA.update(time);
        this._inputB.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonBinaryLERPState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var deltA = this._inputA.positionDelta;
        var deltB = this._inputB.positionDelta;
        this._pRootDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
        this._pRootDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
        this._pRootDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
    };
    /**
     * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonBinaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var poses1 = this._inputA.getSkeletonPose(skeleton).jointPoses;
        var poses2 = this._inputB.getSkeletonPose(skeleton).jointPoses;
        var pose1, pose2;
        var p1, p2;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose();
            pose1 = poses1[i];
            pose2 = poses2[i];
            p1 = pose1.translation;
            p2 = pose2.translation;
            endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);
            tr = endPose.translation;
            tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
            tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
            tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
        }
    };
    return SkeletonBinaryLERPState;
})(AnimationStateBase);
module.exports = SkeletonBinaryLERPState;

},{"awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-renderergl/lib/animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","awayjs-renderergl/lib/animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/SkeletonClipState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
/**
 *
 */
var SkeletonClipState = (function (_super) {
    __extends(SkeletonClipState, _super);
    function SkeletonClipState(animator, skeletonClipNode) {
        _super.call(this, animator, skeletonClipNode);
        this._rootPos = new Vector3D();
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonClipNode = skeletonClipNode;
        this._frames = this._skeletonClipNode.frames;
    }
    Object.defineProperty(SkeletonClipState.prototype, "currentPose", {
        /**
         * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._currentPose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonClipState.prototype, "nextPose", {
        /**
         * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._nextPose;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonClipState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonClipState.prototype._pUpdateTime = function (time /*int*/) {
        this._skeletonPoseDirty = true;
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * @inheritDoc
     */
    SkeletonClipState.prototype._pUpdateFrames = function () {
        _super.prototype._pUpdateFrames.call(this);
        this._currentPose = this._frames[this._pCurrentFrame];
        if (this._skeletonClipNode.looping && this._pNextFrame >= this._skeletonClipNode.lastFrame) {
            this._nextPose = this._frames[0];
            this._pAnimator.dispatchCycleEvent();
        }
        else
            this._nextPose = this._frames[this._pNextFrame];
    };
    /**
     * Updates the output skeleton pose of the node based on the internal playhead position.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonClipState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        if (!this._skeletonClipNode.totalDuration)
            return;
        if (this._pFramesDirty)
            this._pUpdateFrames();
        var currentPose = this._currentPose.jointPoses;
        var nextPose = this._nextPose.jointPoses;
        var numJoints = skeleton.numJoints;
        var p1, p2;
        var pose1, pose2;
        var endPoses = this._skeletonPose.jointPoses;
        var endPose;
        var tr;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        if ((numJoints != currentPose.length) || (numJoints != nextPose.length))
            throw new Error("joint counts don't match!");
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose();
            pose1 = currentPose[i];
            pose2 = nextPose[i];
            p1 = pose1.translation;
            p2 = pose2.translation;
            if (this._skeletonClipNode.highQuality)
                endPose.orientation.slerp(pose1.orientation, pose2.orientation, this._pBlendWeight);
            else
                endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._pBlendWeight);
            if (i > 0) {
                tr = endPose.translation;
                tr.x = p1.x + this._pBlendWeight * (p2.x - p1.x);
                tr.y = p1.y + this._pBlendWeight * (p2.y - p1.y);
                tr.z = p1.z + this._pBlendWeight * (p2.z - p1.z);
            }
        }
    };
    /**
     * @inheritDoc
     */
    SkeletonClipState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        if (this._pFramesDirty)
            this._pUpdateFrames();
        var p1, p2, p3;
        var totalDelta = this._skeletonClipNode.totalDelta;
        // jumping back, need to reset position
        if ((this._pTimeDir > 0 && this._pNextFrame < this._pOldFrame) || (this._pTimeDir < 0 && this._pNextFrame > this._pOldFrame)) {
            this._rootPos.x -= totalDelta.x * this._pTimeDir;
            this._rootPos.y -= totalDelta.y * this._pTimeDir;
            this._rootPos.z -= totalDelta.z * this._pTimeDir;
        }
        var dx = this._rootPos.x;
        var dy = this._rootPos.y;
        var dz = this._rootPos.z;
        if (this._skeletonClipNode.stitchFinalFrame && this._pNextFrame == this._skeletonClipNode.lastFrame) {
            p1 = this._frames[0].jointPoses[0].translation;
            p2 = this._frames[1].jointPoses[0].translation;
            p3 = this._currentPose.jointPoses[0].translation;
            this._rootPos.x = p3.x + p1.x + this._pBlendWeight * (p2.x - p1.x);
            this._rootPos.y = p3.y + p1.y + this._pBlendWeight * (p2.y - p1.y);
            this._rootPos.z = p3.z + p1.z + this._pBlendWeight * (p2.z - p1.z);
        }
        else {
            p1 = this._currentPose.jointPoses[0].translation;
            p2 = this._frames[this._pNextFrame].jointPoses[0].translation; //cover the instances where we wrap the pose but still want the final frame translation values
            this._rootPos.x = p1.x + this._pBlendWeight * (p2.x - p1.x);
            this._rootPos.y = p1.y + this._pBlendWeight * (p2.y - p1.y);
            this._rootPos.z = p1.z + this._pBlendWeight * (p2.z - p1.z);
        }
        this._pRootDelta.x = this._rootPos.x - dx;
        this._pRootDelta.y = this._rootPos.y - dy;
        this._pRootDelta.z = this._rootPos.z - dz;
        this._pOldFrame = this._pNextFrame;
    };
    return SkeletonClipState;
})(AnimationClipState);
module.exports = SkeletonClipState;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-renderergl/lib/animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","awayjs-renderergl/lib/animators/states/AnimationClipState":"awayjs-renderergl/lib/animators/states/AnimationClipState"}],"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Quaternion = require("awayjs-core/lib/geom/Quaternion");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDifferenceState = (function (_super) {
    __extends(SkeletonDifferenceState, _super);
    function SkeletonDifferenceState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._baseInput = animator.getAnimationState(this._skeletonAnimationNode.baseInput);
        this._differenceInput = animator.getAnimationState(this._skeletonAnimationNode.differenceInput);
    }
    Object.defineProperty(SkeletonDifferenceState.prototype, "blendWeight", {
        /**
         * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
         * used to produce the skeleton pose output.
         *
         * @see #baseInput
         * @see #differenceInput
         */
        get: function () {
            return this._blendWeight;
        },
        set: function (value) {
            this._blendWeight = value;
            this._pPositionDeltaDirty = true;
            this._skeletonPoseDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._baseInput.phase(value);
        this._baseInput.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype._pUpdateTime = function (time /*int*/) {
        this._skeletonPoseDirty = true;
        this._baseInput.update(time);
        this._differenceInput.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonDifferenceState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var deltA = this._baseInput.positionDelta;
        var deltB = this._differenceInput.positionDelta;
        this.positionDelta.x = deltA.x + this._blendWeight * deltB.x;
        this.positionDelta.y = deltA.y + this._blendWeight * deltB.y;
        this.positionDelta.z = deltA.z + this._blendWeight * deltB.z;
    };
    /**
     * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonDifferenceState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var basePoses = this._baseInput.getSkeletonPose(skeleton).jointPoses;
        var diffPoses = this._differenceInput.getSkeletonPose(skeleton).jointPoses;
        var base, diff;
        var basePos, diffPos;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose();
            base = basePoses[i];
            diff = diffPoses[i];
            basePos = base.translation;
            diffPos = diff.translation;
            SkeletonDifferenceState._tempQuat.multiply(diff.orientation, base.orientation);
            endPose.orientation.lerp(base.orientation, SkeletonDifferenceState._tempQuat, this._blendWeight);
            tr = endPose.translation;
            tr.x = basePos.x + this._blendWeight * diffPos.x;
            tr.y = basePos.y + this._blendWeight * diffPos.y;
            tr.z = basePos.z + this._blendWeight * diffPos.z;
        }
    };
    SkeletonDifferenceState._tempQuat = new Quaternion();
    return SkeletonDifferenceState;
})(AnimationStateBase);
module.exports = SkeletonDifferenceState;

},{"awayjs-core/lib/geom/Quaternion":undefined,"awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-renderergl/lib/animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","awayjs-renderergl/lib/animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDirectionalState = (function (_super) {
    __extends(SkeletonDirectionalState, _super);
    function SkeletonDirectionalState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeight = 0;
        this._direction = 0;
        this._blendDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._forward = animator.getAnimationState(this._skeletonAnimationNode.forward);
        this._backward = animator.getAnimationState(this._skeletonAnimationNode.backward);
        this._left = animator.getAnimationState(this._skeletonAnimationNode.left);
        this._right = animator.getAnimationState(this._skeletonAnimationNode.right);
    }
    Object.defineProperty(SkeletonDirectionalState.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        /**
         * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
         * used to produce the skeleton pose output.
         */
        set: function (value) {
            if (this._direction == value)
                return;
            this._direction = value;
            this._blendDirty = true;
            this._skeletonPoseDirty = true;
            this._pPositionDeltaDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype.phase = function (value) {
        if (this._blendDirty)
            this.updateBlend();
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._inputA.phase(value);
        this._inputB.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype._pUdateTime = function (time /*int*/) {
        if (this._blendDirty)
            this.updateBlend();
        this._skeletonPoseDirty = true;
        this._inputA.update(time);
        this._inputB.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonDirectionalState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        if (this._blendDirty)
            this.updateBlend();
        var deltA = this._inputA.positionDelta;
        var deltB = this._inputB.positionDelta;
        this.positionDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
        this.positionDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
        this.positionDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
    };
    /**
     * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonDirectionalState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        if (this._blendDirty)
            this.updateBlend();
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var poses1 = this._inputA.getSkeletonPose(skeleton).jointPoses;
        var poses2 = this._inputB.getSkeletonPose(skeleton).jointPoses;
        var pose1, pose2;
        var p1, p2;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose();
            pose1 = poses1[i];
            pose2 = poses2[i];
            p1 = pose1.translation;
            p2 = pose2.translation;
            endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);
            tr = endPose.translation;
            tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
            tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
            tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
        }
    };
    /**
     * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
     *
     * @private
     */
    SkeletonDirectionalState.prototype.updateBlend = function () {
        this._blendDirty = false;
        if (this._direction < 0 || this._direction > 360) {
            this._direction %= 360;
            if (this._direction < 0)
                this._direction += 360;
        }
        if (this._direction < 90) {
            this._inputA = this._forward;
            this._inputB = this._right;
            this._blendWeight = this._direction / 90;
        }
        else if (this._direction < 180) {
            this._inputA = this._right;
            this._inputB = this._backward;
            this._blendWeight = (this._direction - 90) / 90;
        }
        else if (this._direction < 270) {
            this._inputA = this._backward;
            this._inputB = this._left;
            this._blendWeight = (this._direction - 180) / 90;
        }
        else {
            this._inputA = this._left;
            this._inputB = this._forward;
            this._blendWeight = (this._direction - 270) / 90;
        }
    };
    return SkeletonDirectionalState;
})(AnimationStateBase);
module.exports = SkeletonDirectionalState;

},{"awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-renderergl/lib/animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","awayjs-renderergl/lib/animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonNaryLERPState = (function (_super) {
    __extends(SkeletonNaryLERPState, _super);
    function SkeletonNaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeights = new Array();
        this._inputs = new Array();
        this._skeletonAnimationNode = skeletonAnimationNode;
        var i = this._skeletonAnimationNode.numInputs;
        while (i--)
            this._inputs[i] = animator.getAnimationState(this._skeletonAnimationNode._iInputs[i]);
    }
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(value);
        }
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUdateTime = function (time /*int*/) {
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(time);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonNaryLERPState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node blend weight is requested.
     */
    SkeletonNaryLERPState.prototype.getBlendWeightAt = function (index /*uint*/) {
        return this._blendWeights[index];
    };
    /**
     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index on which the skeleton animation node blend weight is to be set.
     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
     */
    SkeletonNaryLERPState.prototype.setBlendWeightAt = function (index /*uint*/, blendWeight) {
        this._blendWeights[index] = blendWeight;
        this._pPositionDeltaDirty = true;
        this._skeletonPoseDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var delta;
        var weight;
        this.positionDelta.x = 0;
        this.positionDelta.y = 0;
        this.positionDelta.z = 0;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (weight) {
                delta = this._inputs[j].positionDelta;
                this.positionDelta.x += weight * delta.x;
                this.positionDelta.y += weight * delta.y;
                this.positionDelta.z += weight * delta.z;
            }
        }
    };
    /**
     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonNaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var weight;
        var endPoses = this._skeletonPose.jointPoses;
        var poses;
        var endPose, pose;
        var endTr, tr;
        var endQuat, q;
        var firstPose;
        var i /*uint*/;
        var w0, x0, y0, z0;
        var w1, x1, y1, z1;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (!weight)
                continue;
            poses = this._inputs[j].getSkeletonPose(skeleton).jointPoses;
            if (!firstPose) {
                firstPose = poses;
                for (i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];
                    if (endPose == null)
                        endPose = endPoses[i] = new JointPose();
                    pose = poses[i];
                    q = pose.orientation;
                    tr = pose.translation;
                    endQuat = endPose.orientation;
                    endQuat.x = weight * q.x;
                    endQuat.y = weight * q.y;
                    endQuat.z = weight * q.z;
                    endQuat.w = weight * q.w;
                    endTr = endPose.translation;
                    endTr.x = weight * tr.x;
                    endTr.y = weight * tr.y;
                    endTr.z = weight * tr.z;
                }
            }
            else {
                for (i = 0; i < skeleton.numJoints; ++i) {
                    endPose = endPoses[i];
                    pose = poses[i];
                    q = firstPose[i].orientation;
                    x0 = q.x;
                    y0 = q.y;
                    z0 = q.z;
                    w0 = q.w;
                    q = pose.orientation;
                    tr = pose.translation;
                    x1 = q.x;
                    y1 = q.y;
                    z1 = q.z;
                    w1 = q.w;
                    // find shortest direction
                    if (x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1 < 0) {
                        x1 = -x1;
                        y1 = -y1;
                        z1 = -z1;
                        w1 = -w1;
                    }
                    endQuat = endPose.orientation;
                    endQuat.x += weight * x1;
                    endQuat.y += weight * y1;
                    endQuat.z += weight * z1;
                    endQuat.w += weight * w1;
                    endTr = endPose.translation;
                    endTr.x += weight * tr.x;
                    endTr.y += weight * tr.y;
                    endTr.z += weight * tr.z;
                }
            }
        }
        for (i = 0; i < skeleton.numJoints; ++i)
            endPoses[i].orientation.normalize();
    };
    return SkeletonNaryLERPState;
})(AnimationStateBase);
module.exports = SkeletonNaryLERPState;

},{"awayjs-renderergl/lib/animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-renderergl/lib/animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","awayjs-renderergl/lib/animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/VertexClipState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
/**
 *
 */
var VertexClipState = (function (_super) {
    __extends(VertexClipState, _super);
    function VertexClipState(animator, vertexClipNode) {
        _super.call(this, animator, vertexClipNode);
        this._vertexClipNode = vertexClipNode;
        this._frames = this._vertexClipNode.frames;
    }
    Object.defineProperty(VertexClipState.prototype, "currentGeometry", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._currentGeometry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexClipState.prototype, "nextGeometry", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._nextGeometry;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdateFrames = function () {
        _super.prototype._pUpdateFrames.call(this);
        this._currentGeometry = this._frames[this._pCurrentFrame];
        if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
            this._nextGeometry = this._frames[0];
            this._pAnimator.dispatchCycleEvent();
        }
        else
            this._nextGeometry = this._frames[this._pNextFrame];
    };
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdatePositionDelta = function () {
        //TODO:implement positiondelta functionality for vertex animations
    };
    return VertexClipState;
})(AnimationClipState);
module.exports = VertexClipState;

},{"awayjs-renderergl/lib/animators/states/AnimationClipState":"awayjs-renderergl/lib/animators/states/AnimationClipState"}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SkeletonBinaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
var CrossfadeTransitionState = require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState");
/**
 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
 */
var CrossfadeTransitionNode = (function (_super) {
    __extends(CrossfadeTransitionNode, _super);
    /**
     * Creates a new <code>CrossfadeTransitionNode</code> object.
     */
    function CrossfadeTransitionNode() {
        _super.call(this);
        this._pStateClass = CrossfadeTransitionState;
    }
    return CrossfadeTransitionNode;
})(SkeletonBinaryLERPNode);
module.exports = CrossfadeTransitionNode;

},{"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode":"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode","awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState"}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SkeletonBinaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
var AnimationStateEvent = require("awayjs-renderergl/lib/events/AnimationStateEvent");
/**
 *
 */
var CrossfadeTransitionState = (function (_super) {
    __extends(CrossfadeTransitionState, _super);
    function CrossfadeTransitionState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._crossfadeTransitionNode = skeletonAnimationNode;
    }
    /**
     * @inheritDoc
     */
    CrossfadeTransitionState.prototype._pUpdateTime = function (time /*int*/) {
        this.blendWeight = Math.abs(time - this._crossfadeTransitionNode.startBlend) / (1000 * this._crossfadeTransitionNode.blendSpeed);
        if (this.blendWeight >= 1) {
            this.blendWeight = 1;
            if (this._animationStateTransitionComplete == null)
                this._animationStateTransitionComplete = new AnimationStateEvent(AnimationStateEvent.TRANSITION_COMPLETE, this._pAnimator, this, this._crossfadeTransitionNode);
            this._crossfadeTransitionNode.dispatchEvent(this._animationStateTransitionComplete);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    return CrossfadeTransitionState;
})(SkeletonBinaryLERPState);
module.exports = CrossfadeTransitionState;

},{"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState","awayjs-renderergl/lib/events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent"}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransition":[function(require,module,exports){
var CrossfadeTransitionNode = require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode");
/**
 *
 */
var CrossfadeTransition = (function () {
    function CrossfadeTransition(blendSpeed) {
        this.blendSpeed = 0.5;
        this.blendSpeed = blendSpeed;
    }
    CrossfadeTransition.prototype.getAnimationNode = function (animator, startNode, endNode, startBlend /*int*/) {
        var crossFadeTransitionNode = new CrossfadeTransitionNode();
        crossFadeTransitionNode.inputA = startNode;
        crossFadeTransitionNode.inputB = endNode;
        crossFadeTransitionNode.blendSpeed = this.blendSpeed;
        crossFadeTransitionNode.startBlend = startBlend;
        return crossFadeTransitionNode;
    };
    return CrossfadeTransition;
})();
module.exports = CrossfadeTransition;

},{"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode"}],"awayjs-renderergl/lib/animators/transitions/IAnimationTransition":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/base/ParticleGeometry":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Geometry = require("awayjs-display/lib/base/Geometry");
/**
 * @class away.base.ParticleGeometry
 */
var ParticleGeometry = (function (_super) {
    __extends(ParticleGeometry, _super);
    function ParticleGeometry() {
        _super.apply(this, arguments);
    }
    return ParticleGeometry;
})(Geometry);
module.exports = ParticleGeometry;

},{"awayjs-display/lib/base/Geometry":undefined}],"awayjs-renderergl/lib/errors/AnimationSetError":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorBase = require("awayjs-core/lib/errors/ErrorBase");
var AnimationSetError = (function (_super) {
    __extends(AnimationSetError, _super);
    function AnimationSetError(message) {
        _super.call(this, message);
    }
    return AnimationSetError;
})(ErrorBase);
module.exports = AnimationSetError;

},{"awayjs-core/lib/errors/ErrorBase":undefined}],"awayjs-renderergl/lib/events/AnimationStateEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventBase = require("awayjs-core/lib/events/EventBase");
/**
 * Dispatched to notify changes in an animation state's state.
 */
var AnimationStateEvent = (function (_super) {
    __extends(AnimationStateEvent, _super);
    /**
     * Create a new <code>AnimatonStateEvent</code>
     *
     * @param type The event type.
     * @param animator The animation state object that is the subject of this event.
     * @param animationNode The animation node inside the animation state from which the event originated.
     */
    function AnimationStateEvent(type, animator, animationState, animationNode) {
        _super.call(this, type);
        this._animator = animator;
        this._animationState = animationState;
        this._animationNode = animationNode;
    }
    Object.defineProperty(AnimationStateEvent.prototype, "animator", {
        /**
         * The animator object that is the subject of this event.
         */
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationStateEvent.prototype, "animationState", {
        /**
         * The animation state object that is the subject of this event.
         */
        get: function () {
            return this._animationState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationStateEvent.prototype, "animationNode", {
        /**
         * The animation node inside the animation state from which the event originated.
         */
        get: function () {
            return this._animationNode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    AnimationStateEvent.prototype.clone = function () {
        return new AnimationStateEvent(this.type, this._animator, this._animationState, this._animationNode);
    };
    /**
     * Dispatched when a non-looping clip node inside an animation state reaches the end of its timeline.
     */
    AnimationStateEvent.PLAYBACK_COMPLETE = "playbackComplete";
    AnimationStateEvent.TRANSITION_COMPLETE = "transitionComplete";
    return AnimationStateEvent;
})(EventBase);
module.exports = AnimationStateEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/AnimatorEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventBase = require("awayjs-core/lib/events/EventBase");
/**
 * Dispatched to notify changes in an animator's state.
 */
var AnimatorEvent = (function (_super) {
    __extends(AnimatorEvent, _super);
    /**
     * Create a new <code>AnimatorEvent</code> object.
     *
     * @param type The event type.
     * @param animator The animator object that is the subject of this event.
     */
    function AnimatorEvent(type, animator) {
        _super.call(this, type);
        this._animator = animator;
    }
    Object.defineProperty(AnimatorEvent.prototype, "animator", {
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current event object.
     */
    AnimatorEvent.prototype.clone = function () {
        return new AnimatorEvent(this.type, this._animator);
    };
    /**
     * Defines the value of the type property of a start event object.
     */
    AnimatorEvent.START = "animatorStart";
    /**
     * Defines the value of the type property of a stop event object.
     */
    AnimatorEvent.STOP = "animatorStop";
    /**
     * Defines the value of the type property of a cycle complete event object.
     */
    AnimatorEvent.CYCLE_COMPLETE = "animatorCycleComplete";
    return AnimatorEvent;
})(EventBase);
module.exports = AnimatorEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/PassEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventBase = require("awayjs-core/lib/events/EventBase");
var PassEvent = (function (_super) {
    __extends(PassEvent, _super);
    function PassEvent(type, pass) {
        _super.call(this, type);
        this._pass = pass;
    }
    Object.defineProperty(PassEvent.prototype, "pass", {
        /**
         *
         */
        get: function () {
            return this._pass;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    PassEvent.prototype.clone = function () {
        return new PassEvent(this.type, this._pass);
    };
    /**
     *
     */
    PassEvent.INVALIDATE = "invalidatePass";
    return PassEvent;
})(EventBase);
module.exports = PassEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/RTTEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventBase = require("awayjs-core/lib/events/EventBase");
var RTTEvent = (function (_super) {
    __extends(RTTEvent, _super);
    function RTTEvent(type, rttManager) {
        _super.call(this, type);
        this._rttManager = rttManager;
    }
    Object.defineProperty(RTTEvent.prototype, "rttManager", {
        /**
         *
         */
        get: function () {
            return this._rttManager;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    RTTEvent.prototype.clone = function () {
        return new RTTEvent(this.type, this._rttManager);
    };
    /**
     *
     */
    RTTEvent.RESIZE = "rttManagerResize";
    return RTTEvent;
})(EventBase);
module.exports = RTTEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/ShadingMethodEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventBase = require("awayjs-core/lib/events/EventBase");
var ShadingMethodEvent = (function (_super) {
    __extends(ShadingMethodEvent, _super);
    function ShadingMethodEvent(type) {
        _super.call(this, type);
    }
    ShadingMethodEvent.SHADER_INVALIDATED = "ShaderInvalidated";
    return ShadingMethodEvent;
})(EventBase);
module.exports = ShadingMethodEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/filters/BlurFilter3D":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Filter3DHBlurTask = require("awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask");
var Filter3DVBlurTask = require("awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask");
var Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
var BlurFilter3D = (function (_super) {
    __extends(BlurFilter3D, _super);
    /**
     * Creates a new BlurFilter3D object
     * @param blurX The amount of horizontal blur to apply
     * @param blurY The amount of vertical blur to apply
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function BlurFilter3D(blurX, blurY, stepSize) {
        if (blurX === void 0) { blurX = 3; }
        if (blurY === void 0) { blurY = 3; }
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._hBlurTask = new Filter3DHBlurTask(blurX, stepSize);
        this._vBlurTask = new Filter3DVBlurTask(blurY, stepSize);
        this.addTask(this._hBlurTask);
        this.addTask(this._vBlurTask);
    }
    Object.defineProperty(BlurFilter3D.prototype, "blurX", {
        get: function () {
            return this._hBlurTask.amount;
        },
        set: function (value) {
            this._hBlurTask.amount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter3D.prototype, "blurY", {
        get: function () {
            return this._vBlurTask.amount;
        },
        set: function (value) {
            this._vBlurTask.amount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter3D.prototype, "stepSize", {
        /**
         * The distance between two blur samples. Set to -1 to autodetect with acceptable quality (default value).
         * Higher values provide better performance at the cost of reduces quality.
         */
        get: function () {
            return this._hBlurTask.stepSize;
        },
        set: function (value) {
            this._hBlurTask.stepSize = value;
            this._vBlurTask.stepSize = value;
        },
        enumerable: true,
        configurable: true
    });
    BlurFilter3D.prototype.setRenderTargets = function (mainTarget, stage) {
        this._hBlurTask.target = this._vBlurTask.getMainInputTexture(stage);
        _super.prototype.setRenderTargets.call(this, mainTarget, stage);
    };
    return BlurFilter3D;
})(Filter3DBase);
module.exports = BlurFilter3D;

},{"awayjs-renderergl/lib/filters/Filter3DBase":"awayjs-renderergl/lib/filters/Filter3DBase","awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask":"awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask","awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask":"awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask"}],"awayjs-renderergl/lib/filters/CompositeFilter3D":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Filter3DCompositeTask = require("awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask");
var Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
var CompositeFilter3D = (function (_super) {
    __extends(CompositeFilter3D, _super);
    /**
     * Creates a new CompositeFilter3D object
     * @param blurX The amount of horizontal blur to apply
     * @param blurY The amount of vertical blur to apply
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function CompositeFilter3D(blendMode, exposure) {
        if (exposure === void 0) { exposure = 1; }
        _super.call(this);
        this._compositeTask = new Filter3DCompositeTask(blendMode, exposure);
        this.addTask(this._compositeTask);
    }
    Object.defineProperty(CompositeFilter3D.prototype, "exposure", {
        get: function () {
            return this._compositeTask.exposure;
        },
        set: function (value) {
            this._compositeTask.exposure = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompositeFilter3D.prototype, "overlayTexture", {
        get: function () {
            return this._compositeTask.overlayTexture;
        },
        set: function (value) {
            this._compositeTask.overlayTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    return CompositeFilter3D;
})(Filter3DBase);
module.exports = CompositeFilter3D;

},{"awayjs-renderergl/lib/filters/Filter3DBase":"awayjs-renderergl/lib/filters/Filter3DBase","awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask":"awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask"}],"awayjs-renderergl/lib/filters/Filter3DBase":[function(require,module,exports){
var Filter3DBase = (function () {
    function Filter3DBase() {
        this._tasks = new Array();
    }
    Object.defineProperty(Filter3DBase.prototype, "requireDepthRender", {
        get: function () {
            return this._requireDepthRender;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DBase.prototype.addTask = function (filter) {
        this._tasks.push(filter);
        if (this._requireDepthRender == null)
            this._requireDepthRender = filter.requireDepthRender;
    };
    Object.defineProperty(Filter3DBase.prototype, "tasks", {
        get: function () {
            return this._tasks;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DBase.prototype.getMainInputTexture = function (stage) {
        return this._tasks[0].getMainInputTexture(stage);
    };
    Object.defineProperty(Filter3DBase.prototype, "textureWidth", {
        get: function () {
            return this._textureWidth;
        },
        set: function (value) {
            this._textureWidth = value;
            for (var i = 0; i < this._tasks.length; ++i)
                this._tasks[i].textureWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DBase.prototype, "textureHeight", {
        get: function () {
            return this._textureHeight;
        },
        set: function (value) {
            this._textureHeight = value;
            for (var i = 0; i < this._tasks.length; ++i)
                this._tasks[i].textureHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    // link up the filters correctly with the next filter
    Filter3DBase.prototype.setRenderTargets = function (mainTarget, stage) {
        this._tasks[this._tasks.length - 1].target = mainTarget;
    };
    Filter3DBase.prototype.dispose = function () {
        for (var i = 0; i < this._tasks.length; ++i)
            this._tasks[i].dispose();
    };
    Filter3DBase.prototype.update = function (stage, camera) {
    };
    return Filter3DBase;
})();
module.exports = Filter3DBase;

},{}],"awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
var Filter3DCompositeTask = (function (_super) {
    __extends(Filter3DCompositeTask, _super);
    function Filter3DCompositeTask(blendMode, exposure) {
        if (exposure === void 0) { exposure = 1; }
        _super.call(this);
        this._data = new Float32Array([exposure, 0.5, 2.0, -1, 0.0, 0.0, 0.0, 0.0]);
        this._blendMode = blendMode;
    }
    Object.defineProperty(Filter3DCompositeTask.prototype, "overlayTexture", {
        get: function () {
            return this._overlayTexture;
        },
        set: function (value) {
            this._overlayTexture = value;
            this._overlayWidth = this._overlayTexture.width;
            this._overlayHeight = this._overlayTexture.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DCompositeTask.prototype, "exposure", {
        get: function () {
            return this._data[0];
        },
        set: function (value) {
            this._data[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DCompositeTask.prototype.getFragmentCode = function () {
        var code;
        var op;
        code = "tex ft0, v0, fs0 <2d,linear,clamp>\n" + "mul ft1, v0, fc1.zw\n" + "add ft1, ft1, fc1.xy\n" + "tex ft1, ft1, fs1 <2d,linear,clamp>\n" + "mul ft1, ft1, fc0.xxx\n" + "add ft1, ft1, fc0.xxx\n";
        switch (this._blendMode) {
            case "multiply":
                code += "mul oc, ft0, ft1\n";
                break;
            case "add":
                code += "add oc, ft0, ft1\n";
                break;
            case "subtract":
                code += "sub oc, ft0, ft1\n";
                break;
            case "overlay":
                code += "sge ft2, ft0, fc0.yyy\n"; // t2 = (blend >= 0.5)? 1 : 0
                code += "sub ft0, ft2, ft0\n"; // base = (1 : 0 - base)
                code += "sub ft1, ft1, ft2\n"; // blend = (blend - 1 : 0)
                code += "mul ft1, ft1, ft0\n"; // blend = blend * base
                code += "sub ft3, ft2, fc0.yyy\n"; // t3 = (blend >= 0.5)? 0.5 : -0.5
                code += "div ft1, ft1, ft3\n"; // blend = blend / ( 0.5 : -0.5)
                code += "add oc, ft1, ft2\n";
                break;
            case "normal":
                // for debugging purposes
                code += "mov oc, ft0\n";
                break;
            default:
                throw new Error("Unknown blend mode");
        }
        return code;
    };
    Filter3DCompositeTask.prototype.activate = function (stage, camera3D, depthTexture) {
        this._data[4] = -0.5 * (this._scaledTextureWidth - this._overlayWidth) / this._overlayWidth;
        this._data[5] = -0.5 * (this._scaledTextureHeight - this._overlayHeight) / this._overlayHeight;
        this._data[6] = this._scaledTextureWidth / this._overlayWidth;
        this._data[7] = this._scaledTextureHeight / this._overlayHeight;
        var context = stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._data, 2);
        stage.getAbstraction(this._overlayTexture).activate(1, false);
    };
    Filter3DCompositeTask.prototype.deactivate = function (stage) {
        stage.context.setTextureAt(1, null);
    };
    return Filter3DCompositeTask;
})(Filter3DTaskBase);
module.exports = Filter3DCompositeTask;

},{"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DFXAATask":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
var Filter3DFXAATask = (function (_super) {
    __extends(Filter3DFXAATask, _super);
    /**
     *
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function Filter3DFXAATask(amount, stepSize) {
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._stepSize = 1;
        this._data = new Float32Array(16);
        //luma
        this._data.set([0.299, 0.587, 0.114, 1], 0); //0.212, 0.716, 0.072
        //helpers
        this._data.set([0.25, 0.5, 0.75, 8], 4);
        //settings (screen x, screen y, ...)
        this._data.set([1 / 1024, 1 / 1024, 1 / 128, 1 / 8], 8);
        //deltas
        this._data.set([1.0 / 3.0 - 0.5, 2.0 / 3.0 - 0.5, 0.0 / 3.0 - 0.5, 3.0 / 3.0 - 0.5], 12);
        this.stepSize = stepSize;
    }
    Object.defineProperty(Filter3DFXAATask.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (value) {
            if (this._amount == value)
                return;
            this._amount = value;
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DFXAATask.prototype, "stepSize", {
        get: function () {
            return this._stepSize;
        },
        set: function (value) {
            if (this._stepSize == value)
                return;
            this._stepSize = value;
            this.calculateStepSize();
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Filter3DFXAATask.prototype.getFragmentCode = function () {
        var uv_in = "v0";
        var w = "fc2.z"; //	1.75
        var lum = "fc0"; //	0.299, 0.587, 0.114
        var s = "fc2.w"; //	1/16
        var div = "fc1.w"; //	4.3
        var pix = "fc2.xy";
        var dx = "fc2.x";
        var dy = "fc2.y";
        var mOne = "fc3.w";
        var mul = "fc3.x";
        var delta1 = "fc4.x"; //1.0/3.0 - 0.5
        var delta2 = "fc4.y"; //2.0/3.0 - 0.5
        var delta3 = "fc4.z"; //0.0/3.0 - 0.5
        var delta4 = "fc4.w"; //3.0/3.0 - 0.5
        var _0 = "fc3.x";
        var _025 = "fc1.x";
        var _05 = "fc1.y";
        var _075 = "fc1.z";
        var _1 = "fc0.w";
        var uv = "ft0.xy";
        var uvx = "ft0.x";
        var uvy = "ft0.y";
        var TL = "ft2.x";
        var TR = "ft2.y";
        var BL = "ft2.z";
        var BR = "ft2.w";
        var M = "ft3.x";
        var tempf1 = "ft3.y";
        var tempf2 = "ft3.z";
        var tempf3 = "ft3.w";
        var tex = "ft1";
        var dir = "ft4";
        var dirx = "ft4.x";
        var diry = "ft4.y";
        var dirxy = "ft4.xy";
        var dirReduce = "ft5.x";
        var inverseDirAdjustment = "ft5.y";
        var result1 = "ft6";
        var result2 = "ft7";
        var fxaaReduceMin = "fc2.x"; //1/128
        var fxaaReduceMul = "fc2.y"; //1/8
        var fxaaSpanMax = "fc1.w"; //8
        var lumaMin = "ft5.x";
        var lumaMax = "ft5.y";
        var sample = "fs0";
        var temp = tex;
        var tempxy = temp + ".xy";
        var code = new Array();
        //lumas
        code.push(tex, tex, uv_in, sample, "2d", "wrap", "linear", "\n");
        code.push("dp3", M, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("sub", uv, uv, pix, "\n");
        code.push("tex", tex, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("dp3", TL, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("add", uv, uv, pix, "\n");
        code.push("tex", tex, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("dp3", BR, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("sub", uvy, uvy, dy, "\n");
        code.push("add", uvx, uvx, dx, "\n");
        code.push("tex", tex, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("dp3", TR, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("add", uvy, uvy, dy, "\n");
        code.push("sub", uvx, uvx, dx, "\n");
        code.push("tex", tex, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("dp3", BL, tex, lum, "\n");
        //dir
        code.push("add", tempf1, TL, TR, "\n");
        code.push("add", tempf2, BL, BR, "\n");
        code.push("sub", dirx, tempf1, tempf2, "\n");
        code.push("neg", dirx, dirx, "\n");
        code.push("add", tempf1, TL, BL, "\n");
        code.push("add", tempf2, TR, BR, "\n");
        code.push("sub", diry, tempf1, tempf2, "\n");
        code.push("add", tempf1, tempf1, tempf2, "\n");
        code.push("mul", tempf1, tempf1, fxaaReduceMul, "\n");
        code.push("mul", tempf1, tempf1, _025, "\n");
        code.push("max", dirReduce, tempf1, fxaaReduceMin, "\n");
        code.push("abs", tempf1, dirx, "\n");
        code.push("abs", tempf2, diry, "\n");
        code.push("min", tempf1, tempf1, tempf2, "\n");
        code.push("add", tempf1, tempf1, dirReduce, "\n");
        code.push("rcp", inverseDirAdjustment, tempf1, "\n");
        code.push("mul", tempf1, dirx, inverseDirAdjustment, "\n");
        code.push("mov", tempf2, fxaaSpanMax, "\n");
        code.push("neg", tempf2, tempf2, "\n");
        code.push("max", tempf1, tempf1, tempf2, "\n");
        code.push("min", tempf1, fxaaSpanMax, tempf1, "\n");
        code.push("mul", dirx, tempf1, dx, "\n");
        code.push("mul", tempf1, diry, inverseDirAdjustment, "\n");
        code.push("mov", tempf2, fxaaSpanMax, "\n");
        code.push("neg", tempf2, tempf2, "\n");
        code.push("max", tempf1, tempf1, tempf2, "\n");
        code.push("min", tempf1, fxaaSpanMax, tempf1, "\n");
        code.push("mul", diry, tempf1, dy, "\n");
        code.push("mul", tempxy, dirxy, delta1, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", result1, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("mul", tempxy, dirxy, delta2, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", tex, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("add", result1, result1, tex, "\n");
        code.push("mul", result1, result1, _05, "\n");
        code.push("mul", tempxy, dirxy, delta3, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", result2, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("mul", tempxy, dirxy, delta4, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", tex, uv, sample, "2d", "wrap", "linear", "\n");
        code.push("add", result2, result2, tex, "\n");
        code.push("mul", result2, result2, _025, "\n");
        code.push("mul", tex, result1, _05, "\n");
        code.push("add", result2, result2, tex, "\n");
        code.push("min", tempf1, BL, BR, "\n");
        code.push("min", tempf2, TL, TR, "\n");
        code.push("min", tempf1, tempf1, tempf2, "\n");
        code.push("min", lumaMin, tempf1, M, "\n");
        code.push("max", tempf1, BL, BR, "\n");
        code.push("max", tempf2, TL, TR, "\n");
        code.push("max", tempf1, tempf1, tempf2, "\n");
        code.push("max", lumaMax, tempf1, M, "\n");
        code.push("dp3", tempf1, lum, result2, "\n");
        code.push("slt", tempf2, tempf1, lumaMin, "\n");
        code.push("sge", tempf3, tempf1, lumaMax, "\n");
        code.push("mul", tempf2, tempf2, tempf3, "\n");
        code.push("mul", result1, result1, tempf2, "\n");
        code.push("sub", tempf2, _1, tempf2, "\n");
        code.push("mul", result2, result2, tempf2, "\n");
        code.push("add", "oc", result1, result2, "\n");
        //this._data[2] = 1/numSamples;
        return code.join(" ");
    };
    Filter3DFXAATask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._data, 1);
    };
    Filter3DFXAATask.prototype.updateTextures = function (stage) {
        _super.prototype.updateTextures.call(this, stage);
        this.updateBlurData();
    };
    Filter3DFXAATask.prototype.updateBlurData = function () {
        // todo: must be normalized using view size ratio instead of texture
        var invH = 1 / this._textureHeight;
        this._data[0] = this._amount * .5 * invH;
        this._data[1] = this._realStepSize * invH;
    };
    Filter3DFXAATask.prototype.calculateStepSize = function () {
        this._realStepSize = 1; //this._stepSize > 0? this._stepSize : this._amount > Filter3DVBlurTask.MAX_AUTO_SAMPLES? this._amount/Filter3DVBlurTask.MAX_AUTO_SAMPLES : 1;
    };
    //TODO - remove blur variables and create setters/getters for FXAA
    Filter3DFXAATask.MAX_AUTO_SAMPLES = 15;
    return Filter3DFXAATask;
})(Filter3DTaskBase);
module.exports = Filter3DFXAATask;

},{"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
var Filter3DHBlurTask = (function (_super) {
    __extends(Filter3DHBlurTask, _super);
    /**
     * Creates a new Filter3DHDepthOfFFieldTask
     * @param amount The maximum amount of blur to apply in pixels at the most out-of-focus areas
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function Filter3DHBlurTask(amount, stepSize) {
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._stepSize = 1;
        this._amount = amount;
        this._data = new Float32Array([0, 0, 0, 1]);
        this.stepSize = stepSize;
    }
    Object.defineProperty(Filter3DHBlurTask.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (value) {
            if (this._amount == value)
                return;
            this._amount = value;
            this.invalidateProgram();
            this.updateBlurData();
            this.calculateStepSize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DHBlurTask.prototype, "stepSize", {
        get: function () {
            return this._stepSize;
        },
        set: function (value) {
            if (this._stepSize == value)
                return;
            this._stepSize = value;
            this.calculateStepSize();
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Filter3DHBlurTask.prototype.getFragmentCode = function () {
        var code;
        var numSamples = 1;
        code = "mov ft0, v0	\n" + "sub ft0.x, v0.x, fc0.x\n";
        code += "tex ft1, ft0, fs0 <2d,linear,clamp>\n";
        for (var x = this._realStepSize; x <= this._amount; x += this._realStepSize) {
            code += "add ft0.x, ft0.x, fc0.y\n" + "tex ft2, ft0, fs0 <2d,linear,clamp>\n" + "add ft1, ft1, ft2\n";
            ++numSamples;
        }
        code += "mul oc, ft1, fc0.z\n";
        this._data[2] = 1 / numSamples;
        return code;
    };
    Filter3DHBlurTask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._data, 1);
    };
    Filter3DHBlurTask.prototype.updateTextures = function (stage) {
        _super.prototype.updateTextures.call(this, stage);
        this.updateBlurData();
    };
    Filter3DHBlurTask.prototype.updateBlurData = function () {
        // todo: must be normalized using view size ratio instead of texture
        var invW = 1 / this._textureWidth;
        this._data[0] = this._amount * .5 * invW;
        this._data[1] = this._realStepSize * invW;
    };
    Filter3DHBlurTask.prototype.calculateStepSize = function () {
        this._realStepSize = this._stepSize > 0 ? this._stepSize : this._amount > Filter3DHBlurTask.MAX_AUTO_SAMPLES ? this._amount / Filter3DHBlurTask.MAX_AUTO_SAMPLES : 1;
    };
    Filter3DHBlurTask.MAX_AUTO_SAMPLES = 15;
    return Filter3DHBlurTask;
})(Filter3DTaskBase);
module.exports = Filter3DHBlurTask;

},{"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":[function(require,module,exports){
var Image2D = require("awayjs-core/lib/image/Image2D");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var Filter3DTaskBase = (function () {
    function Filter3DTaskBase(requireDepthRender) {
        if (requireDepthRender === void 0) { requireDepthRender = false; }
        this._scaledTextureWidth = -1;
        this._scaledTextureHeight = -1;
        this._textureWidth = -1;
        this._textureHeight = -1;
        this._textureDimensionsInvalid = true;
        this._program3DInvalid = true;
        this._textureScale = 0;
        this._requireDepthRender = requireDepthRender;
    }
    Object.defineProperty(Filter3DTaskBase.prototype, "textureScale", {
        /**
         * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
         */
        get: function () {
            return this._textureScale;
        },
        set: function (value) {
            if (this._textureScale == value)
                return;
            this._textureScale = value;
            this._scaledTextureWidth = this._textureWidth >> this._textureScale;
            this._scaledTextureHeight = this._textureHeight >> this._textureScale;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this._target = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "textureWidth", {
        get: function () {
            return this._textureWidth;
        },
        set: function (value) {
            if (this._textureWidth == value)
                return;
            this._textureWidth = value;
            this._scaledTextureWidth = this._textureWidth >> this._textureScale;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "textureHeight", {
        get: function () {
            return this._textureHeight;
        },
        set: function (value) {
            if (this._textureHeight == value)
                return;
            this._textureHeight = value;
            this._scaledTextureHeight = this._textureHeight >> this._textureScale;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DTaskBase.prototype.getMainInputTexture = function (stage) {
        if (this._textureDimensionsInvalid)
            this.updateTextures(stage);
        return this._mainInputTexture;
    };
    Filter3DTaskBase.prototype.dispose = function () {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        if (this._program3D)
            this._program3D.dispose();
    };
    Filter3DTaskBase.prototype.invalidateProgram = function () {
        this._program3DInvalid = true;
    };
    Filter3DTaskBase.prototype.updateProgram = function (stage) {
        if (this._program3D)
            this._program3D.dispose();
        this._program3D = stage.context.createProgram();
        var vertexByteCode = (new AGALMiniAssembler().assemble("part vertex 1\n" + this.getVertexCode() + "endpart"))['vertex'].data;
        var fragmentByteCode = (new AGALMiniAssembler().assemble("part fragment 1\n" + this.getFragmentCode() + "endpart"))['fragment'].data;
        this._program3D.upload(vertexByteCode, fragmentByteCode);
        this._program3DInvalid = false;
    };
    Filter3DTaskBase.prototype.getVertexCode = function () {
        return "mov op, va0\n" + "mov v0, va1\n";
    };
    Filter3DTaskBase.prototype.getFragmentCode = function () {
        throw new AbstractMethodError();
        return null;
    };
    Filter3DTaskBase.prototype.updateTextures = function (stage) {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        this._mainInputTexture = new Image2D(this._scaledTextureWidth, this._scaledTextureHeight);
        this._textureDimensionsInvalid = false;
    };
    Filter3DTaskBase.prototype.getProgram = function (stage) {
        if (this._program3DInvalid)
            this.updateProgram(stage);
        return this._program3D;
    };
    Filter3DTaskBase.prototype.activate = function (stage, camera, depthTexture) {
    };
    Filter3DTaskBase.prototype.deactivate = function (stage) {
    };
    Object.defineProperty(Filter3DTaskBase.prototype, "requireDepthRender", {
        get: function () {
            return this._requireDepthRender;
        },
        enumerable: true,
        configurable: true
    });
    return Filter3DTaskBase;
})();
module.exports = Filter3DTaskBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/image/Image2D":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
var Filter3DVBlurTask = (function (_super) {
    __extends(Filter3DVBlurTask, _super);
    /**
     *
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function Filter3DVBlurTask(amount, stepSize) {
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._stepSize = 1;
        this._amount = amount;
        this._data = new Float32Array([0, 0, 0, 1]);
        this.stepSize = stepSize;
    }
    Object.defineProperty(Filter3DVBlurTask.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (value) {
            if (this._amount == value)
                return;
            this._amount = value;
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DVBlurTask.prototype, "stepSize", {
        get: function () {
            return this._stepSize;
        },
        set: function (value) {
            if (this._stepSize == value)
                return;
            this._stepSize = value;
            this.calculateStepSize();
            this.invalidateProgram();
            this.updateBlurData();
        },
        enumerable: true,
        configurable: true
    });
    Filter3DVBlurTask.prototype.getFragmentCode = function () {
        var code;
        var numSamples = 1;
        code = "mov ft0, v0	\n" + "sub ft0.y, v0.y, fc0.x\n";
        code += "tex ft1, ft0, fs0 <2d,linear,clamp>\n";
        for (var x = this._realStepSize; x <= this._amount; x += this._realStepSize) {
            code += "add ft0.y, ft0.y, fc0.y\n";
            code += "tex ft2, ft0, fs0 <2d,linear,clamp>\n" + "add ft1, ft1, ft2\n";
            ++numSamples;
        }
        code += "mul oc, ft1, fc0.z\n";
        this._data[2] = 1 / numSamples;
        return code;
    };
    Filter3DVBlurTask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._data, 1);
    };
    Filter3DVBlurTask.prototype.updateTextures = function (stage) {
        _super.prototype.updateTextures.call(this, stage);
        this.updateBlurData();
    };
    Filter3DVBlurTask.prototype.updateBlurData = function () {
        // todo: must be normalized using view size ratio instead of texture
        var invH = 1 / this._textureHeight;
        this._data[0] = this._amount * .5 * invH;
        this._data[1] = this._realStepSize * invH;
    };
    Filter3DVBlurTask.prototype.calculateStepSize = function () {
        this._realStepSize = this._stepSize > 0 ? this._stepSize : this._amount > Filter3DVBlurTask.MAX_AUTO_SAMPLES ? this._amount / Filter3DVBlurTask.MAX_AUTO_SAMPLES : 1;
    };
    Filter3DVBlurTask.MAX_AUTO_SAMPLES = 15;
    return Filter3DVBlurTask;
})(Filter3DTaskBase);
module.exports = Filter3DVBlurTask;

},{"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/managers/RTTBufferManager":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var ImageUtils = require("awayjs-core/lib/utils/ImageUtils");
var RTTEvent = require("awayjs-renderergl/lib/events/RTTEvent");
var RTTBufferManager = (function (_super) {
    __extends(RTTBufferManager, _super);
    function RTTBufferManager(stage) {
        _super.call(this);
        this._viewWidth = -1;
        this._viewHeight = -1;
        this._textureWidth = -1;
        this._textureHeight = -1;
        this._buffersInvalid = true;
        this._renderToTextureRect = new Rectangle();
        this._stage = stage;
    }
    RTTBufferManager.getInstance = function (stage) {
        if (!stage)
            throw new Error("stage key cannot be null!");
        if (RTTBufferManager._instances == null)
            RTTBufferManager._instances = new Array();
        var rttBufferManager = RTTBufferManager.getRTTBufferManagerFromStage(stage);
        if (rttBufferManager == null) {
            rttBufferManager = new RTTBufferManager(stage);
            var vo = new RTTBufferManagerVO();
            vo.stage3d = stage;
            vo.rttbfm = rttBufferManager;
            RTTBufferManager._instances.push(vo);
        }
        return rttBufferManager;
    };
    RTTBufferManager.getRTTBufferManagerFromStage = function (stage) {
        var l = RTTBufferManager._instances.length;
        var r;
        for (var c = 0; c < l; c++) {
            r = RTTBufferManager._instances[c];
            if (r.stage3d === stage)
                return r.rttbfm;
        }
        return null;
    };
    RTTBufferManager.deleteRTTBufferManager = function (stage) {
        var l = RTTBufferManager._instances.length;
        var r;
        for (var c = 0; c < l; c++) {
            r = RTTBufferManager._instances[c];
            if (r.stage3d === stage) {
                RTTBufferManager._instances.splice(c, 1);
                return;
            }
        }
    };
    Object.defineProperty(RTTBufferManager.prototype, "textureRatioX", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._textureRatioX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "textureRatioY", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._textureRatioY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "viewWidth", {
        get: function () {
            return this._viewWidth;
        },
        set: function (value) {
            if (value == this._viewWidth)
                return;
            this._viewWidth = value;
            this._buffersInvalid = true;
            this._textureWidth = ImageUtils.getBestPowerOf2(this._viewWidth);
            if (this._textureWidth > this._viewWidth) {
                this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth) * .5);
                this._renderToTextureRect.width = this._viewWidth;
            }
            else {
                this._renderToTextureRect.x = 0;
                this._renderToTextureRect.width = this._textureWidth;
            }
            this.dispatchEvent(new RTTEvent(RTTEvent.RESIZE, this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "viewHeight", {
        get: function () {
            return this._viewHeight;
        },
        set: function (value) {
            if (value == this._viewHeight)
                return;
            this._viewHeight = value;
            this._buffersInvalid = true;
            this._textureHeight = ImageUtils.getBestPowerOf2(this._viewHeight);
            if (this._textureHeight > this._viewHeight) {
                this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight) * .5);
                this._renderToTextureRect.height = this._viewHeight;
            }
            else {
                this._renderToTextureRect.y = 0;
                this._renderToTextureRect.height = this._textureHeight;
            }
            this.dispatchEvent(new RTTEvent(RTTEvent.RESIZE, this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "renderToTextureVertexBuffer", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._renderToTextureVertexBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "renderToScreenVertexBuffer", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._renderToScreenVertexBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "indexBuffer", {
        get: function () {
            return this._indexBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "renderToTextureRect", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._renderToTextureRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "textureWidth", {
        get: function () {
            return this._textureWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "textureHeight", {
        get: function () {
            return this._textureHeight;
        },
        enumerable: true,
        configurable: true
    });
    RTTBufferManager.prototype.dispose = function () {
        RTTBufferManager.deleteRTTBufferManager(this._stage);
        if (this._indexBuffer) {
            this._indexBuffer.dispose();
            this._renderToScreenVertexBuffer.dispose();
            this._renderToTextureVertexBuffer.dispose();
            this._renderToScreenVertexBuffer = null;
            this._renderToTextureVertexBuffer = null;
            this._indexBuffer = null;
        }
    };
    // todo: place all this in a separate model, since it's used all over the place
    // maybe it even has a place in the core (together with screenRect etc)?
    // needs to be stored per view of course
    RTTBufferManager.prototype.updateRTTBuffers = function () {
        var context = this._stage.context;
        var textureVerts;
        var screenVerts;
        var x;
        var y;
        if (this._renderToTextureVertexBuffer == null)
            this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 20);
        if (this._renderToScreenVertexBuffer == null)
            this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 20);
        if (!this._indexBuffer) {
            this._indexBuffer = context.createIndexBuffer(6);
            this._indexBuffer.uploadFromArray([2, 1, 0, 3, 2, 0], 0, 6);
        }
        this._textureRatioX = x = Math.min(this._viewWidth / this._textureWidth, 1);
        this._textureRatioY = y = Math.min(this._viewHeight / this._textureHeight, 1);
        var u1 = (1 - x) * .5;
        var u2 = (x + 1) * .5;
        var v1 = (1 - y) * .5;
        var v2 = (y + 1) * .5;
        // last element contains indices for data per vertex that can be passed to the vertex shader if necessary (ie: frustum corners for deferred rendering)
        textureVerts = [-x, -y, u1, v1, 0, x, -y, u2, v1, 1, x, y, u2, v2, 2, -x, y, u1, v2, 3];
        screenVerts = [-1, -1, u1, v1, 0, 1, -1, u2, v1, 1, 1, 1, u2, v2, 2, -1, 1, u1, v2, 3];
        this._renderToTextureVertexBuffer.uploadFromArray(textureVerts, 0, 4);
        this._renderToScreenVertexBuffer.uploadFromArray(screenVerts, 0, 4);
        this._buffersInvalid = false;
    };
    return RTTBufferManager;
})(EventDispatcher);
var RTTBufferManagerVO = (function () {
    function RTTBufferManagerVO() {
    }
    return RTTBufferManagerVO;
})();
module.exports = RTTBufferManager;

},{"awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/utils/ImageUtils":undefined,"awayjs-renderergl/lib/events/RTTEvent":"awayjs-renderergl/lib/events/RTTEvent"}],"awayjs-renderergl/lib/pick/ShaderPicker":[function(require,module,exports){
var Debug = require("awayjs-core/lib/utils/Debug");
var BitmapImage2D = require("awayjs-core/lib/image/BitmapImage2D");
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var Point = require("awayjs-core/lib/geom/Point");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLDrawMode = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLClearMask = require("awayjs-stagegl/lib/base/ContextGLClearMask");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var ContextGLTriangleFace = require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
/**
 * Picks a 3d object from a view or scene by performing a separate render pass on the scene around the area being picked using key color values,
 * then reading back the color value of the pixel in the render representing the picking ray. Requires multiple passes and readbacks for retriving details
 * on an entity that has its shaderPickingDetails property set to true.
 *
 * A read-back operation from any GPU is not a very efficient process, and the amount of processing used can vary significantly between different hardware.
 *
 * @see away.entities.Entity#shaderPickingDetails
 *
 * @class away.pick.ShaderPicker
 */
var ShaderPicker = (function () {
    /**
     * Creates a new <code>ShaderPicker</code> object.
     *
     * @param shaderPickingDetails Determines whether the picker includes a second pass to calculate extra
     * properties such as uv and normal coordinates.
     */
    function ShaderPicker(shaderPickingDetails) {
        if (shaderPickingDetails === void 0) { shaderPickingDetails = false; }
        this._onlyMouseEnabled = true;
        this._interactives = new Array();
        this._localHitPosition = new Vector3D();
        this._hitUV = new Point();
        this._localHitNormal = new Vector3D();
        this._rayPos = new Vector3D();
        this._rayDir = new Vector3D();
        this._shaderPickingDetails = shaderPickingDetails;
        this._id = new Float32Array(4);
        this._viewportData = new Float32Array(4); // first 2 contain scale, last 2 translation
        this._boundOffsetScale = new Float32Array(8); // first 2 contain scale, last 2 translation
        this._boundOffsetScale[3] = 0;
        this._boundOffsetScale[7] = 1;
    }
    Object.defineProperty(ShaderPicker.prototype, "onlyMouseEnabled", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._onlyMouseEnabled;
        },
        set: function (value) {
            this._onlyMouseEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShaderPicker.prototype.getViewCollision = function (x, y, view) {
        var collector = view.iEntityCollector;
        this._stage = view.renderer.stage;
        if (!this._stage)
            return null;
        this._context = this._stage.context;
        this._viewportData[0] = view.width;
        this._viewportData[1] = view.height;
        this._viewportData[2] = -(this._projX = 2 * x / view.width - 1);
        this._viewportData[3] = this._projY = 2 * y / view.height - 1;
        // _potentialFound will be set to true if any object is actually rendered
        this._potentialFound = false;
        //reset head values
        this._blendedRenderableHead = null;
        this._opaqueRenderableHead = null;
        this.pDraw(collector, null);
        // clear buffers
        this._context.setVertexBufferAt(0, null);
        if (!this._context || !this._potentialFound)
            return null;
        if (!this._bitmapImage2D)
            this._bitmapImage2D = new BitmapImage2D(1, 1, false, 0);
        this._context.drawToBitmapImage2D(this._bitmapImage2D);
        this._hitColor = this._bitmapImage2D.getPixel(0, 0);
        if (!this._hitColor) {
            this._context.present();
            return null;
        }
        this._hitRenderable = this._interactives[this._hitColor - 1];
        this._hitEntity = this._hitRenderable.sourceEntity;
        if (this._onlyMouseEnabled && !this._hitEntity._iIsMouseEnabled())
            return null;
        var _collisionVO = this._hitEntity._iPickingCollisionVO;
        if (this._shaderPickingDetails) {
            this.getHitDetails(view.camera);
            _collisionVO.localPosition = this._localHitPosition;
            _collisionVO.localNormal = this._localHitNormal;
            _collisionVO.uv = this._hitUV;
            _collisionVO.index = this._faceIndex;
        }
        else {
            _collisionVO.localPosition = null;
            _collisionVO.localNormal = null;
            _collisionVO.uv = null;
            _collisionVO.index = 0;
        }
        return _collisionVO;
    };
    //*/
    /**
     * @inheritDoc
     */
    ShaderPicker.prototype.getSceneCollision = function (position, direction, scene) {
        return null;
    };
    /**
     * @inheritDoc
     */
    ShaderPicker.prototype.pDraw = function (entityCollector, target) {
        var camera = entityCollector.camera;
        this._context.clear(0, 0, 0, 1);
        this._stage.scissorRect = ShaderPicker.MOUSE_SCISSOR_RECT;
        this._interactives.length = this._interactiveId = 0;
        if (!this._objectProgram)
            this.initObjectProgram();
        this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
        this._context.setDepthTest(true, ContextGLCompareMode.LESS);
        this._context.setProgram(this._objectProgram);
        this._context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._viewportData, 1);
        //this.drawRenderables(entityCollector.opaqueRenderableHead, camera);
        //this.drawRenderables(entityCollector.blendedRenderableHead, camera);
        //TODO: reimplement ShaderPicker inheriting from RendererBase
    };
    /**
     * Draw a list of renderables.
     * @param renderables The renderables to draw.
     * @param camera The camera for which to render.
     */
    ShaderPicker.prototype.drawRenderables = function (renderable, camera) {
        var matrix = Matrix3DUtils.CALCULATION_MATRIX;
        var viewProjection = camera.viewProjection;
        while (renderable) {
            // it's possible that the renderable was already removed from the scene
            if (!renderable.sourceEntity.scene || !renderable.sourceEntity._iIsMouseEnabled()) {
                renderable = renderable.next;
                continue;
            }
            this._potentialFound = true;
            this._context.setCulling(renderable.render.renderOwner.bothSides ? ContextGLTriangleFace.NONE : ContextGLTriangleFace.BACK, camera.projection.coordinateSystem);
            this._interactives[this._interactiveId++] = renderable;
            // color code so that reading from bitmapdata will contain the correct value
            this._id[1] = (this._interactiveId >> 8) / 255; // on green channel
            this._id[2] = (this._interactiveId & 0xff) / 255; // on blue channel
            matrix.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
            matrix.append(viewProjection);
            this._context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
            this._context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._id, 1);
            var subGeometryVO = this._hitRenderable.subGeometryVO;
            subGeometryVO.activateVertexBufferVO(0, subGeometryVO.subGeometry.positions);
            subGeometryVO.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, 0, subGeometryVO.numIndices);
            renderable = renderable.next;
        }
    };
    ShaderPicker.prototype.updateRay = function (camera) {
        this._rayPos = camera.scenePosition;
        this._rayDir = camera.getRay(this._projX, this._projY, 1);
        this._rayDir.normalize();
    };
    /**
     * Creates the Program that color-codes objects.
     */
    ShaderPicker.prototype.initObjectProgram = function () {
        var vertexCode;
        var fragmentCode;
        this._objectProgram = this._context.createProgram();
        vertexCode = "m44 vt0, va0, vc0			\n" + "mul vt1.xy, vt0.w, vc4.zw	\n" + "add vt0.xy, vt0.xy, vt1.xy	\n" + "mul vt0.xy, vt0.xy, vc4.xy	\n" + "mov op, vt0	\n";
        fragmentCode = "mov oc, fc0"; // write identifier
        Debug.throwPIR('ShaderPicker', 'initTriangleProgram', 'Dependency: initObjectProgram');
        //_objectProgram.upload(new AGALMiniAssembler().assemble(ContextGLProgramType.VERTEX, vertexCode),new AGALMiniAssembler().assemble(ContextGLProgramType.FRAGMENT, fragmentCode));
    };
    /**
     * Creates the Program that renders positions.
     */
    ShaderPicker.prototype.initTriangleProgram = function () {
        var vertexCode;
        var fragmentCode;
        this._triangleProgram = this._context.createProgram();
        // todo: add animation code
        vertexCode = "add vt0, va0, vc5 			\n" + "mul vt0, vt0, vc6 			\n" + "mov v0, vt0				\n" + "m44 vt0, va0, vc0			\n" + "mul vt1.xy, vt0.w, vc4.zw	\n" + "add vt0.xy, vt0.xy, vt1.xy	\n" + "mul vt0.xy, vt0.xy, vc4.xy	\n" + "mov op, vt0	\n";
        fragmentCode = "mov oc, v0"; // write identifier
        var vertexByteCode = (new AGALMiniAssembler().assemble("part vertex 1\n" + vertexCode + "endpart"))['vertex'].data;
        var fragmentByteCode = (new AGALMiniAssembler().assemble("part fragment 1\n" + fragmentCode + "endpart"))['fragment'].data;
        this._triangleProgram.upload(vertexByteCode, fragmentByteCode);
    };
    /**
     * Gets more detailed information about the hir position, if required.
     * @param camera The camera used to view the hit object.
     */
    ShaderPicker.prototype.getHitDetails = function (camera) {
        this.getApproximatePosition(camera);
        this.getPreciseDetails(camera);
    };
    /**
     * Finds a first-guess approximate position about the hit position.
     *
     * @param camera The camera used to view the hit object.
     */
    ShaderPicker.prototype.getApproximatePosition = function (camera) {
        var bounds = this._hitRenderable.sourceEntity.getBox();
        var col;
        var scX, scY, scZ;
        var offsX, offsY, offsZ;
        var localViewProjection = Matrix3DUtils.CALCULATION_MATRIX;
        localViewProjection.copyFrom(this._hitRenderable.sourceEntity.getRenderSceneTransform(camera));
        localViewProjection.append(camera.viewProjection);
        if (!this._triangleProgram) {
            this.initTriangleProgram();
        }
        this._boundOffsetScale[4] = 1 / (scX = bounds.width);
        this._boundOffsetScale[5] = 1 / (scY = bounds.height);
        this._boundOffsetScale[6] = 1 / (scZ = bounds.depth);
        this._boundOffsetScale[0] = offsX = -bounds.x;
        this._boundOffsetScale[1] = offsY = -bounds.y;
        this._boundOffsetScale[2] = offsZ = -bounds.z;
        this._context.setProgram(this._triangleProgram);
        this._context.clear(0, 0, 0, 0, 1, 0, ContextGLClearMask.DEPTH);
        this._context.setScissorRectangle(ShaderPicker.MOUSE_SCISSOR_RECT);
        this._context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, localViewProjection, true);
        this._context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, this._boundOffsetScale, 2);
        var subGeometryVO = this._hitRenderable.subGeometryVO;
        subGeometryVO.activateVertexBufferVO(0, subGeometryVO.subGeometry.positions);
        subGeometryVO.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, 0, subGeometryVO.numIndices);
        this._context.drawToBitmapImage2D(this._bitmapImage2D);
        col = this._bitmapImage2D.getPixel(0, 0);
        this._localHitPosition.x = ((col >> 16) & 0xff) * scX / 255 - offsX;
        this._localHitPosition.y = ((col >> 8) & 0xff) * scY / 255 - offsY;
        this._localHitPosition.z = (col & 0xff) * scZ / 255 - offsZ;
    };
    /**
     * Use the approximate position info to find the face under the mouse position from which we can derive the precise
     * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
     * @param camera The camera used to view the hit object.
     */
    ShaderPicker.prototype.getPreciseDetails = function (camera) {
        var len = indices.length;
        var x1, y1, z1;
        var x2, y2, z2;
        var x3, y3, z3;
        var i = 0, j = 1, k = 2;
        var t1, t2, t3;
        var v0x, v0y, v0z;
        var v1x, v1y, v1z;
        var v2x, v2y, v2z;
        var ni1, ni2, ni3;
        var n1, n2, n3, nLength;
        var dot00, dot01, dot02, dot11, dot12;
        var s, t, invDenom;
        var x = this._localHitPosition.x, y = this._localHitPosition.y, z = this._localHitPosition.z;
        var u, v;
        var ui1, ui2, ui3;
        var s0x, s0y, s0z;
        var s1x, s1y, s1z;
        var nl;
        var subGeom = this._hitRenderable._pGetSubGeometry();
        var indices = subGeom.indices.get(subGeom.numElements);
        var positions = subGeom.positions.get(subGeom.numVertices);
        var posDim = subGeom.positions.dimensions;
        var uvs = subGeom.uvs.get(subGeom.numVertices);
        var uvDim = subGeom.uvs.dimensions;
        var normals = subGeom.normals.get(subGeom.numVertices);
        var normalDim = subGeom.normals.dimensions;
        this.updateRay(camera);
        while (i < len) {
            t1 = indices[i] * posDim;
            t2 = indices[j] * posDim;
            t3 = indices[k] * posDim;
            x1 = positions[t1];
            y1 = positions[t1 + 1];
            z1 = positions[t1 + 2];
            x2 = positions[t2];
            y2 = positions[t2 + 1];
            z2 = positions[t2 + 2];
            x3 = positions[t3];
            y3 = positions[t3 + 1];
            z3 = positions[t3 + 2];
            // if within bounds
            if (!((x < x1 && x < x2 && x < x3) || (y < y1 && y < y2 && y < y3) || (z < z1 && z < z2 && z < z3) || (x > x1 && x > x2 && x > x3) || (y > y1 && y > y2 && y > y3) || (z > z1 && z > z2 && z > z3))) {
                // calculate barycentric coords for approximated position
                v0x = x3 - x1;
                v0y = y3 - y1;
                v0z = z3 - z1;
                v1x = x2 - x1;
                v1y = y2 - y1;
                v1z = z2 - z1;
                v2x = x - x1;
                v2y = y - y1;
                v2z = z - z1;
                dot00 = v0x * v0x + v0y * v0y + v0z * v0z;
                dot01 = v0x * v1x + v0y * v1y + v0z * v1z;
                dot02 = v0x * v2x + v0y * v2y + v0z * v2z;
                dot11 = v1x * v1x + v1y * v1y + v1z * v1z;
                dot12 = v1x * v2x + v1y * v2y + v1z * v2z;
                invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
                s = (dot11 * dot02 - dot01 * dot12) * invDenom;
                t = (dot00 * dot12 - dot01 * dot02) * invDenom;
                // if inside the current triangle, fetch details hit information
                if (s >= 0 && t >= 0 && (s + t) <= 1) {
                    ni1 = indices[i] * normalDim;
                    ni2 = indices[j] * normalDim;
                    ni3 = indices[k] * normalDim;
                    n1 = indices[ni1] + indices[ni2] + indices[ni3];
                    n2 = indices[ni1 + 1] + indices[ni2 + 1] + indices[ni3 + 1];
                    n3 = indices[ni1 + 2] + indices[ni2 + 2] + indices[ni3 + 2];
                    nLength = Math.sqrt(n1 * n1 + n2 * n2 + n3 * n3);
                    n1 /= nLength;
                    n2 /= nLength;
                    n3 /= nLength;
                    // this is def the triangle, now calculate precise coords
                    this.getPrecisePosition(this._hitRenderable.sourceEntity.inverseSceneTransform, n1, n2, n3, x1, y1, z1);
                    v2x = this._localHitPosition.x - x1;
                    v2y = this._localHitPosition.y - y1;
                    v2z = this._localHitPosition.z - z1;
                    s0x = x2 - x1; // s0 = p1 - p0
                    s0y = y2 - y1;
                    s0z = z2 - z1;
                    s1x = x3 - x1; // s1 = p2 - p0
                    s1y = y3 - y1;
                    s1z = z3 - z1;
                    this._localHitNormal.x = s0y * s1z - s0z * s1y; // n = s0 x s1
                    this._localHitNormal.y = s0z * s1x - s0x * s1z;
                    this._localHitNormal.z = s0x * s1y - s0y * s1x;
                    nl = 1 / Math.sqrt(this._localHitNormal.x * this._localHitNormal.x + this._localHitNormal.y * this._localHitNormal.y + this._localHitNormal.z * this._localHitNormal.z); // normalize n
                    this._localHitNormal.x *= nl;
                    this._localHitNormal.y *= nl;
                    this._localHitNormal.z *= nl;
                    dot02 = v0x * v2x + v0y * v2y + v0z * v2z;
                    dot12 = v1x * v2x + v1y * v2y + v1z * v2z;
                    s = (dot11 * dot02 - dot01 * dot12) * invDenom;
                    t = (dot00 * dot12 - dot01 * dot02) * invDenom;
                    ui1 = indices[i] * uvDim;
                    ui2 = indices[j] * uvDim;
                    ui3 = indices[k] * uvDim;
                    u = uvs[ui1];
                    v = uvs[ui1 + 1];
                    this._hitUV.x = u + t * (uvs[ui2] - u) + s * (uvs[ui3] - u);
                    this._hitUV.y = v + t * (uvs[ui2 + 1] - v) + s * (uvs[ui3 + 1] - v);
                    this._faceIndex = i;
                    //TODO add back subGeometryIndex value
                    //this._subGeometryIndex = away.utils.GeometryUtils.getMeshSubGeometryIndex(subGeom);
                    return;
                }
            }
            i += 3;
            j += 3;
            k += 3;
        }
    };
    /**
     * Finds the precise hit position by unprojecting the screen coordinate back unto the hit face's plane and
     * calculating the intersection point.
     * @param camera The camera used to render the object.
     * @param invSceneTransform The inverse scene transformation of the hit object.
     * @param nx The x-coordinate of the face's plane normal.
     * @param ny The y-coordinate of the face plane normal.
     * @param nz The z-coordinate of the face plane normal.
     * @param px The x-coordinate of a point on the face's plane (ie a face vertex)
     * @param py The y-coordinate of a point on the face's plane (ie a face vertex)
     * @param pz The z-coordinate of a point on the face's plane (ie a face vertex)
     */
    ShaderPicker.prototype.getPrecisePosition = function (invSceneTransform, nx, ny, nz, px, py, pz) {
        // calculate screen ray and find exact intersection position with triangle
        var rx, ry, rz;
        var ox, oy, oz;
        var t;
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        var cx = this._rayPos.x, cy = this._rayPos.y, cz = this._rayPos.z;
        // unprojected projection point, gives ray dir in cam space
        ox = this._rayDir.x;
        oy = this._rayDir.y;
        oz = this._rayDir.z;
        // transform ray dir and origin (cam pos) to object space
        //invSceneTransform.copyRawDataTo( raw  );
        invSceneTransform.copyRawDataTo(raw);
        rx = raw[0] * ox + raw[4] * oy + raw[8] * oz;
        ry = raw[1] * ox + raw[5] * oy + raw[9] * oz;
        rz = raw[2] * ox + raw[6] * oy + raw[10] * oz;
        ox = raw[0] * cx + raw[4] * cy + raw[8] * cz + raw[12];
        oy = raw[1] * cx + raw[5] * cy + raw[9] * cz + raw[13];
        oz = raw[2] * cx + raw[6] * cy + raw[10] * cz + raw[14];
        t = ((px - ox) * nx + (py - oy) * ny + (pz - oz) * nz) / (rx * nx + ry * ny + rz * nz);
        this._localHitPosition.x = ox + rx * t;
        this._localHitPosition.y = oy + ry * t;
        this._localHitPosition.z = oz + rz * t;
    };
    ShaderPicker.prototype.dispose = function () {
        this._bitmapImage2D.dispose();
        if (this._triangleProgram)
            this._triangleProgram.dispose();
        if (this._objectProgram)
            this._objectProgram.dispose();
        this._triangleProgram = null;
        this._objectProgram = null;
        this._bitmapImage2D = null;
        this._hitRenderable = null;
        this._hitEntity = null;
    };
    ShaderPicker.MOUSE_SCISSOR_RECT = new Rectangle(0, 0, 1, 1);
    return ShaderPicker;
})();
module.exports = ShaderPicker;

},{"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-core/lib/image/BitmapImage2D":undefined,"awayjs-core/lib/utils/Debug":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLClearMask":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined,"awayjs-stagegl/lib/base/ContextGLTriangleFace":undefined}],"awayjs-renderergl/lib/render/BasicMaterialRender":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-core/lib/image/BlendMode");
var BasicMaterialPass = require("awayjs-renderergl/lib/render/passes/BasicMaterialPass");
var RenderBase = require("awayjs-renderergl/lib/render/RenderBase");
/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var BasicMaterialRender = (function (_super) {
    __extends(BasicMaterialRender, _super);
    function BasicMaterialRender(material, renderableClass, renderPool) {
        _super.call(this, material, renderableClass, renderPool);
        this._material = material;
        this._pAddPass(this._pass = new BasicMaterialPass(this, material, renderableClass, this._stage));
    }
    BasicMaterialRender.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._material = null;
    };
    /**
     * @inheritDoc
     */
    BasicMaterialRender.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
        this._pass.preserveAlpha = this._material.preserveAlpha; //this._pRequiresBlending;
        this._pass.shader.setBlendMode((this._renderOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._material.blendMode);
        //this._pass.forceSeparateMVP = false;
    };
    return BasicMaterialRender;
})(RenderBase);
module.exports = BasicMaterialRender;

},{"awayjs-core/lib/image/BlendMode":undefined,"awayjs-renderergl/lib/render/RenderBase":"awayjs-renderergl/lib/render/RenderBase","awayjs-renderergl/lib/render/passes/BasicMaterialPass":"awayjs-renderergl/lib/render/passes/BasicMaterialPass"}],"awayjs-renderergl/lib/render/DepthRender":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RenderPassBase = require("awayjs-renderergl/lib/render/RenderPassBase");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
/**
 * DepthRender forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var DepthRender = (function (_super) {
    __extends(DepthRender, _super);
    /**
     *
     * @param pool
     * @param renderOwner
     * @param renderableClass
     * @param stage
     */
    function DepthRender(renderOwner, renderableClass, renderPool) {
        _super.call(this, renderOwner, renderableClass, renderPool);
        this._shader = new ShaderBase(renderableClass, this, this._stage);
        this._pAddPass(this);
    }
    DepthRender.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._renderOwner.getTextureAt(0) ? this._shader.getAbstraction(this._renderOwner.getTextureAt(0)) : null;
    };
    DepthRender.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.projectionDependencies++;
        if (shader.alphaThreshold > 0)
            shader.uvDependencies++;
    };
    DepthRender.prototype._iInitConstantData = function (shader) {
        _super.prototype._iInitConstantData.call(this, shader);
        var index = this._fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = 1.0;
        data[index + 1] = 255.0;
        data[index + 2] = 65025.0;
        data[index + 3] = 16581375.0;
        data[index + 4] = 1.0 / 255.0;
        data[index + 5] = 1.0 / 255.0;
        data[index + 6] = 1.0 / 255.0;
        data[index + 7] = 0.0;
    };
    /**
     * @inheritDoc
     */
    DepthRender.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var targetReg = sharedRegisters.shadedTarget;
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        code += "div " + temp1 + ", " + sharedRegisters.projectionFragment + ", " + sharedRegisters.projectionFragment + ".w\n" + "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" + "frc " + temp1 + ", " + temp1 + "\n" + "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        //codeF += "mov ft1.w, fc1.w	\n" +
        //    "mov ft0.w, fc0.x	\n";
        if (this._textureVO && shader.alphaThreshold > 0) {
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" + "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        registerCache.removeFragmentTempUsage(temp1);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    /**
     * @inheritDoc
     */
    DepthRender.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        if (this._textureVO && this._shader.alphaThreshold > 0) {
            this._textureVO.activate(this);
            this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = this._shader.alphaThreshold;
        }
    };
    return DepthRender;
})(RenderPassBase);
module.exports = DepthRender;

},{"awayjs-renderergl/lib/render/RenderPassBase":"awayjs-renderergl/lib/render/RenderPassBase","awayjs-renderergl/lib/shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase"}],"awayjs-renderergl/lib/render/DistanceRender":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RenderPassBase = require("awayjs-renderergl/lib/render/RenderPassBase");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
/**
 * DistanceRender is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
var DistanceRender = (function (_super) {
    __extends(DistanceRender, _super);
    /**
     * Creates a new DistanceRender object.
     *
     * @param material The material to which this pass belongs.
     */
    function DistanceRender(renderOwner, renderableClass, renderPool) {
        _super.call(this, renderOwner, renderableClass, renderPool);
        this._shader = new ShaderBase(renderableClass, this, this._stage);
        this._pAddPass(this);
    }
    DistanceRender.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._renderOwner.getTextureAt(0) ? this._shader.getAbstraction(this._renderOwner.getTextureAt(0)) : null;
    };
    /**
     * Initializes the unchanging constant data for this material.
     */
    DistanceRender.prototype._iInitConstantData = function (shader) {
        _super.prototype._iInitConstantData.call(this, shader);
        var index = this._fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index + 4] = 1.0 / 255.0;
        data[index + 5] = 1.0 / 255.0;
        data[index + 6] = 1.0 / 255.0;
        data[index + 7] = 0.0;
    };
    DistanceRender.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.projectionDependencies++;
        shader.viewDirDependencies++;
        if (shader.alphaThreshold > 0)
            shader.uvDependencies++;
        if (shader.viewDirDependencies > 0)
            shader.globalPosDependencies++;
    };
    /**
     * @inheritDoc
     */
    DistanceRender.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code;
        var targetReg = sharedRegisters.shadedTarget;
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // squared distance to view
        code = "dp3 " + temp1 + ".z, " + sharedRegisters.viewDirVarying + ".xyz, " + sharedRegisters.viewDirVarying + ".xyz\n" + "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" + "frc " + temp1 + ", " + temp1 + "\n" + "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        if (this._textureVO && shader.alphaThreshold > 0) {
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" + "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    DistanceRender.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        var f = camera.projection.far;
        f = 1 / (2 * f * f);
        // sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
        var index = this._fragmentConstantsIndex;
        var data = this._shader.fragmentConstantData;
        data[index] = 1.0 * f;
        data[index + 1] = 255.0 * f;
        data[index + 2] = 65025.0 * f;
        data[index + 3] = 16581375.0 * f;
        if (this._textureVO && this._shader.alphaThreshold > 0) {
            this._textureVO.activate(this);
            data[index + 8] = this._shader.alphaThreshold;
        }
    };
    return DistanceRender;
})(RenderPassBase);
module.exports = DistanceRender;

},{"awayjs-renderergl/lib/render/RenderPassBase":"awayjs-renderergl/lib/render/RenderPassBase","awayjs-renderergl/lib/shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase"}],"awayjs-renderergl/lib/render/IRenderClass":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/render/RenderBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
var RenderOwnerEvent = require("awayjs-display/lib/events/RenderOwnerEvent");
var MaterialBase = require("awayjs-display/lib/materials/MaterialBase");
var DefaultMaterialManager = require("awayjs-display/lib/managers/DefaultMaterialManager");
var PassEvent = require("awayjs-renderergl/lib/events/PassEvent");
/**
 *
 * @class away.pool.Passes
 */
var RenderBase = (function (_super) {
    __extends(RenderBase, _super);
    function RenderBase(renderOwner, renderableClass, renderPool) {
        var _this = this;
        _super.call(this, renderOwner, renderPool);
        this.usages = 0;
        this._forceSeparateMVP = false;
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
        this.renderId = renderOwner.id;
        this._renderOwner = renderOwner;
        this._renderableClass = renderableClass;
        this._stage = renderPool.stage;
        this._renderOwner.addEventListener(RenderOwnerEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
        this._renderOwner.addEventListener(RenderOwnerEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);
        this._onPassInvalidateDelegate = function (event) { return _this.onPassInvalidate(event); };
    }
    Object.defineProperty(RenderBase.prototype, "requiresBlending", {
        /**
         * Indicates whether or not the renderable requires alpha blending during rendering.
         */
        get: function () {
            return this._pRequiresBlending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderBase.prototype, "renderOrderId", {
        get: function () {
            if (this._invalidAnimation)
                this._updateAnimation();
            return this._renderOrderId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderBase.prototype, "passes", {
        get: function () {
            if (this._invalidAnimation)
                this._updateAnimation();
            return this._passes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderBase.prototype, "renderOwner", {
        get: function () {
            return this._renderOwner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderBase.prototype, "numImages", {
        get: function () {
            if (this._invalidImages)
                this._updateImages();
            return this._numImages;
        },
        enumerable: true,
        configurable: true
    });
    RenderBase.prototype._iIncludeDependencies = function (shader) {
        this._renderableClass._iIncludeDependencies(shader);
        shader.alphaThreshold = this._renderOwner.alphaThreshold;
        shader.useImageRect = this._renderOwner.imageRect;
        //shader.useUVBuffer = this._renderOwner.uvBuffer;
        if (this._renderOwner instanceof MaterialBase) {
            var material = this._renderOwner;
            shader.useAlphaPremultiplied = material.alphaPremultiplied;
            shader.useBothSides = material.bothSides;
            shader.usesUVTransform = material.animateUVs;
            shader.usesColorTransform = material.useColorTransform;
        }
    };
    RenderBase.prototype.getImageIndex = function (texture, index) {
        if (index === void 0) { index = 0; }
        if (this._invalidImages)
            this._updateImages();
        return this._imageIndices[texture.id][index];
    };
    /**
     *
     */
    RenderBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._renderOwner = null;
        this._renderableClass = null;
        this._stage = null;
        var len = this._passes.length;
        for (var i = 0; i < len; i++) {
            this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
            this._passes[i].dispose();
        }
        this._passes = null;
    };
    /**
     *
     */
    RenderBase.prototype.onInvalidate = function (event) {
        _super.prototype.onInvalidate.call(this, event);
        this._invalidRender = true;
        this._invalidAnimation = true;
    };
    /**
     *
     */
    RenderBase.prototype.onInvalidatePasses = function (event) {
        var len = this._passes.length;
        for (var i = 0; i < len; i++)
            this._passes[i].invalidate();
        this._invalidAnimation = true;
        this._invalidImages = true;
    };
    /**
     *
     */
    RenderBase.prototype.onInvalidateAnimation = function (event) {
        this._invalidAnimation = true;
    };
    /**
     *
     * @param renderOwner
     */
    RenderBase.prototype._updateAnimation = function () {
        if (this._invalidRender)
            this._pUpdateRender();
        this._invalidAnimation = false;
        var enabledGPUAnimation = this._getEnabledGPUAnimation();
        var renderOrderId = 0;
        var mult = 1;
        var shader;
        var len = this._passes.length;
        for (var i = 0; i < len; i++) {
            shader = this._passes[i].shader;
            if (shader.usesAnimation != enabledGPUAnimation) {
                shader.usesAnimation = enabledGPUAnimation;
                shader.invalidateProgram();
            }
            renderOrderId += shader.programData.id * mult;
            mult *= 1000;
        }
        this._renderOrderId = renderOrderId;
    };
    RenderBase.prototype._updateImages = function () {
        this._invalidImages = false;
        var numTextures = this._renderOwner.getNumTextures();
        var texture;
        var numImages;
        var images;
        var image;
        var sampler;
        var index = 0;
        for (var i = 0; i < numTextures; i++) {
            texture = this._renderOwner.getTextureAt(i);
            numImages = texture.getNumImages();
            images = this._imageIndices[texture.id] = new Array();
            for (var j = 0; j < numImages; j++) {
                image = texture.getImageAt(j) || (this._renderOwner.style ? this._renderOwner.style.getImageAt(texture, j) : null) || DefaultMaterialManager.getDefaultImage2D();
                this.images[index] = this._stage.getAbstraction(image);
                sampler = texture.getSamplerAt(j) || (this._renderOwner.style ? this._renderOwner.style.getSamplerAt(texture, j) : null) || DefaultMaterialManager.getDefaultSampler();
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
    RenderBase.prototype._pUpdateRender = function () {
        this._invalidRender = false;
        //overrride to update shader object properties
    };
    /**
     * Removes a pass from the renderOwner.
     * @param pass The pass to be removed.
     */
    RenderBase.prototype._pRemovePass = function (pass) {
        pass.removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.splice(this._passes.indexOf(pass), 1);
    };
    /**
     * Removes all passes from the renderOwner
     */
    RenderBase.prototype._pClearPasses = function () {
        var len = this._passes.length;
        for (var i = 0; i < len; ++i)
            this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.length = 0;
    };
    /**
     * Adds a pass to the renderOwner
     * @param pass
     */
    RenderBase.prototype._pAddPass = function (pass) {
        this._passes.push(pass);
        pass.addEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
    };
    /**
     * Listener for when a pass's shader code changes. It recalculates the render order id.
     */
    RenderBase.prototype.onPassInvalidate = function (event) {
        this._invalidAnimation = true;
    };
    /**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
    RenderBase.prototype._getEnabledGPUAnimation = function () {
        if (this._renderOwner.animationSet) {
            this._renderOwner.animationSet.resetGPUCompatibility();
            var owners = this._renderOwner.iOwners;
            var numOwners = owners.length;
            var len = this._passes.length;
            for (var i = 0; i < len; i++)
                for (var j = 0; j < numOwners; j++)
                    if (owners[j].animator)
                        owners[j].animator.testGPUCompatibility(this._passes[i].shader);
            return !this._renderOwner.animationSet.usesCPU;
        }
        return false;
    };
    return RenderBase;
})(AbstractionBase);
module.exports = RenderBase;

},{"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-display/lib/events/RenderOwnerEvent":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined,"awayjs-display/lib/materials/MaterialBase":undefined,"awayjs-renderergl/lib/events/PassEvent":"awayjs-renderergl/lib/events/PassEvent"}],"awayjs-renderergl/lib/render/RenderPassBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PassEvent = require("awayjs-renderergl/lib/events/PassEvent");
var RenderBase = require("awayjs-renderergl/lib/render/RenderBase");
/**
 * RenderPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var RenderPassBase = (function (_super) {
    __extends(RenderPassBase, _super);
    function RenderPassBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(RenderPassBase.prototype, "shader", {
        get: function () {
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderPassBase.prototype, "animationSet", {
        get: function () {
            return this._renderOwner.animationSet;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    RenderPassBase.prototype.invalidate = function () {
        this._shader.invalidateShader();
        this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
    };
    RenderPassBase.prototype.dispose = function () {
        if (this._shader) {
            this._shader.dispose();
            this._shader = null;
        }
    };
    /**
     * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
     * @param pass The pass used to render the renderable.
     * @param renderable The IRenderable object to draw.
     * @param stage The Stage object used for rendering.
     * @param entityCollector The EntityCollector object that contains the visible scene data.
     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
     * camera.viewProjection as it includes the scaling factors when rendering to textures.
     *
     * @internal
     */
    RenderPassBase.prototype._iRender = function (renderable, camera, viewProjection) {
        this._shader._iRender(renderable, camera, viewProjection);
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    RenderPassBase.prototype._iActivate = function (camera) {
        this._shader._iActivate(camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    RenderPassBase.prototype._iDeactivate = function () {
        this._shader._iDeactivate();
    };
    RenderPassBase.prototype._iInitConstantData = function (shader) {
    };
    RenderPassBase.prototype._iGetPreLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetPreLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetNormalVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    RenderPassBase.prototype._iGetNormalFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    return RenderPassBase;
})(RenderBase);
module.exports = RenderPassBase;

},{"awayjs-renderergl/lib/events/PassEvent":"awayjs-renderergl/lib/events/PassEvent","awayjs-renderergl/lib/render/RenderBase":"awayjs-renderergl/lib/render/RenderBase"}],"awayjs-renderergl/lib/render/RenderPool":[function(require,module,exports){
/**
 * @class away.pool.RenderPool
 */
var RenderPool = (function () {
    /**
     * //TODO
     *
     * @param renderClass
     */
    function RenderPool(renderableClass, stage, renderClass) {
        if (renderClass === void 0) { renderClass = null; }
        this._pool = new Object();
        this._renderableClass = renderableClass;
        this._stage = stage;
        this._renderClass = renderClass;
    }
    Object.defineProperty(RenderPool.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * //TODO
     *
     * @param renderableOwner
     * @returns IRenderable
     */
    RenderPool.prototype.getAbstraction = function (renderOwner) {
        return (this._pool[renderOwner.id] || (this._pool[renderOwner.id] = new (this._renderClass || RenderPool._abstractionPool[renderOwner.assetType])(renderOwner, this._renderableClass, this)));
    };
    /**
     * //TODO
     *
     * @param renderableOwner
     */
    RenderPool.prototype.clearAbstraction = function (renderOwner) {
        delete this._pool[renderOwner.id];
    };
    /**
     *
     * @param imageObjectClass
     */
    RenderPool.registerAbstraction = function (renderClass, assetClass) {
        RenderPool._abstractionPool[assetClass.assetType] = renderClass;
    };
    /**
     *
     * @param subGeometry
     */
    RenderPool.getClass = function (renderOwner) {
        return RenderPool._abstractionPool[renderOwner.assetType];
    };
    RenderPool._abstractionPool = new Object();
    return RenderPool;
})();
module.exports = RenderPool;

},{}],"awayjs-renderergl/lib/render/SkyboxRender":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var BlendMode = require("awayjs-core/lib/image/BlendMode");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var RenderPassBase = require("awayjs-renderergl/lib/render/RenderPassBase");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
/**
 * SkyboxRender forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var SkyboxRender = (function (_super) {
    __extends(SkyboxRender, _super);
    function SkyboxRender(skybox, renderableClass, renderPool) {
        _super.call(this, skybox, renderableClass, renderPool);
        this._skybox = skybox;
        this._shader = new ShaderBase(renderableClass, this, this._stage);
        this._texture = this._shader.getAbstraction(this._skybox.texture);
        this._pAddPass(this);
    }
    SkyboxRender.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._skybox.texture));
        this._texture = null;
        this._skybox = null;
    };
    /**
     * @inheritDoc
     */
    SkyboxRender.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this._pRequiresBlending = (this._renderOwner.blendMode != BlendMode.NORMAL);
        this.shader.setBlendMode((this._renderOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._renderOwner.blendMode);
    };
    SkyboxRender.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.usesLocalPosFragment = true;
    };
    /**
     * @inheritDoc
     */
    SkyboxRender.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return this._texture._iGetFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters, sharedRegisters.localPositionVarying);
    };
    SkyboxRender.prototype._iRender = function (renderable, camera, viewProjection) {
        _super.prototype._iRender.call(this, renderable, camera, viewProjection);
        this._texture._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    SkyboxRender.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        this._stage.context.setDepthTest(false, ContextGLCompareMode.LESS);
        this._texture.activate(this);
    };
    return SkyboxRender;
})(RenderPassBase);
module.exports = SkyboxRender;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/image/BlendMode":undefined,"awayjs-renderergl/lib/render/RenderPassBase":"awayjs-renderergl/lib/render/RenderPassBase","awayjs-renderergl/lib/shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-renderergl/lib/render/passes/BasicMaterialPass":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
var PassBase = require("awayjs-renderergl/lib/render/passes/PassBase");
/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var BasicMaterialPass = (function (_super) {
    __extends(BasicMaterialPass, _super);
    function BasicMaterialPass(render, renderOwner, renderableClass, stage) {
        _super.call(this, render, renderOwner, renderableClass, stage);
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._diffuseA = 1;
        this._shader = new ShaderBase(renderableClass, this, this._stage);
        this.invalidate();
    }
    BasicMaterialPass.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        if (this._textureVO != null)
            shader.uvDependencies++;
    };
    BasicMaterialPass.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._renderOwner.getTextureAt(0) ? this._shader.getAbstraction(this._renderOwner.getTextureAt(0)) : null;
    };
    BasicMaterialPass.prototype.dispose = function () {
        if (this._textureVO) {
            this._textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._renderOwner.getTextureAt(0)));
            this._textureVO = null;
        }
        _super.prototype.dispose.call(this);
    };
    /**
     * @inheritDoc
     */
    BasicMaterialPass.prototype._iGetFragmentCode = function (shader, regCache, sharedReg) {
        var code = "";
        var alphaReg;
        if (this.preserveAlpha) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }
        var targetReg = sharedReg.shadedTarget;
        if (this._textureVO != null) {
            code += this._textureVO._iGetFragmentCode(targetReg, regCache, sharedReg, sharedReg.uvVarying);
            if (shader.alphaThreshold > 0) {
                var cutOffReg = regCache.getFreeFragmentConstant();
                this._fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else if (shader.colorBufferIndex != -1) {
            code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
        }
        else {
            var diffuseInputReg = regCache.getFreeFragmentConstant();
            this._fragmentConstantsIndex = diffuseInputReg.index * 4;
            code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
        }
        if (this.preserveAlpha) {
            code += "mul " + sharedReg.shadedTarget + ".w, " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }
        return code;
    };
    BasicMaterialPass.prototype._iRender = function (renderable, camera, viewProjection) {
        _super.prototype._iRender.call(this, renderable, camera, viewProjection);
        if (this._textureVO != null)
            this._textureVO._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    BasicMaterialPass.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        if (this._textureVO != null) {
            this._textureVO.activate(this._render);
            if (this._shader.alphaThreshold > 0)
                this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
        }
        else if (this._shader.colorBufferIndex == -1) {
            var index = this._fragmentConstantsIndex;
            var data = this._shader.fragmentConstantData;
            data[index] = this._diffuseR;
            data[index + 1] = this._diffuseG;
            data[index + 2] = this._diffuseB;
            data[index + 3] = this._diffuseA;
        }
    };
    return BasicMaterialPass;
})(PassBase);
module.exports = BasicMaterialPass;

},{"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-renderergl/lib/render/passes/PassBase":"awayjs-renderergl/lib/render/passes/PassBase","awayjs-renderergl/lib/shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase"}],"awayjs-renderergl/lib/render/passes/ILightingPass":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/render/passes/IPass":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/render/passes/PassBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var PassEvent = require("awayjs-renderergl/lib/events/PassEvent");
/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var PassBase = (function (_super) {
    __extends(PassBase, _super);
    /**
     * Creates a new PassBase object.
     */
    function PassBase(render, renderOwner, renderableClass, stage) {
        _super.call(this);
        this._preserveAlpha = true;
        this._forceSeparateMVP = false;
        this._render = render;
        this._renderOwner = renderOwner;
        this._renderableClass = renderableClass;
        this._stage = stage;
    }
    Object.defineProperty(PassBase.prototype, "shader", {
        get: function () {
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassBase.prototype, "animationSet", {
        get: function () {
            return this._renderOwner.animationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassBase.prototype, "preserveAlpha", {
        /**
         * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
         */
        get: function () {
            return this._preserveAlpha;
        },
        set: function (value) {
            if (this._preserveAlpha == value)
                return;
            this._preserveAlpha = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassBase.prototype, "forceSeparateMVP", {
        /**
         * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
         * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
         * projection code.
         */
        get: function () {
            return this._forceSeparateMVP;
        },
        set: function (value) {
            if (this._forceSeparateMVP == value)
                return;
            this._forceSeparateMVP = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    PassBase.prototype.getImageIndex = function (texture, index) {
        if (index === void 0) { index = 0; }
        return this._render.getImageIndex(texture, index);
    };
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    PassBase.prototype.invalidate = function () {
        this._shader.invalidateShader();
        this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
    };
    /**
     * Cleans up any resources used by the current object.
     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
     */
    PassBase.prototype.dispose = function () {
        this._render = null;
        this._renderOwner = null;
        this._renderableClass = null;
        this._stage = null;
        if (this._shader) {
            this._shader.dispose();
            this._shader = null;
        }
    };
    /**
     * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
     * @param pass The pass used to render the renderable.
     * @param renderable The IRenderable object to draw.
     * @param stage The Stage object used for rendering.
     * @param entityCollector The EntityCollector object that contains the visible scene data.
     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
     * camera.viewProjection as it includes the scaling factors when rendering to textures.
     *
     * @internal
     */
    PassBase.prototype._iRender = function (renderable, camera, viewProjection) {
        this._shader._iRender(renderable, camera, viewProjection);
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    PassBase.prototype._iActivate = function (camera) {
        this._shader._iActivate(camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    PassBase.prototype._iDeactivate = function () {
        this._shader._iDeactivate();
    };
    PassBase.prototype._iIncludeDependencies = function (shader) {
        this._render._iIncludeDependencies(shader);
        if (this._forceSeparateMVP)
            shader.globalPosDependencies++;
    };
    PassBase.prototype._iInitConstantData = function (shader) {
    };
    PassBase.prototype._iGetPreLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetPreLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetNormalVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    PassBase.prototype._iGetNormalFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    return PassBase;
})(EventDispatcher);
module.exports = PassBase;

},{"awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-renderergl/lib/events/PassEvent":"awayjs-renderergl/lib/events/PassEvent"}],"awayjs-renderergl/lib/renderables/BillboardRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AttributesBuffer = require("awayjs-core/lib/attributes/AttributesBuffer");
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var DefaultMaterialManager = require("awayjs-display/lib/managers/DefaultMaterialManager");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/renderables/RenderableBase");
/**
 * @class away.pool.RenderableListItem
 */
var BillboardRenderable = (function (_super) {
    __extends(BillboardRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param billboard
     */
    function BillboardRenderable(billboard, renderer) {
        _super.call(this, billboard, billboard, billboard.material, renderer);
        this._billboard = billboard;
    }
    BillboardRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._billboard = null;
    };
    /**
     * //TODO
     *
     * @returns {away.base.TriangleSubGeometry}
     */
    BillboardRenderable.prototype._pGetSubGeometry = function () {
        var texture = this._billboard.material.getTextureAt(0);
        var id = -1;
        if (texture)
            id = ((this.renderableOwner.style ? this.renderableOwner.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager.getDefaultSampler()).id;
        var geometry = BillboardRenderable._samplerGeometry[id];
        var width = this._billboard.billboardWidth;
        var height = this._billboard.billboardHeight;
        var billboardRect = this._billboard.billboardRect;
        if (!geometry) {
            geometry = BillboardRenderable._samplerGeometry[id] = new TriangleSubGeometry(new AttributesBuffer(11, 4));
            geometry.autoDeriveNormals = false;
            geometry.autoDeriveTangents = false;
            geometry.setIndices(Array(0, 1, 2, 0, 2, 3));
            geometry.setPositions(Array(-billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
            geometry.setNormals(Array(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
            geometry.setTangents(Array(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
            geometry.setUVs(Array(0, 0, 1, 0, 1, 1, 0, 1));
        }
        else {
            geometry.setPositions(Array(-billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
        }
        return geometry;
    };
    BillboardRenderable.prototype._pGetRenderOwner = function () {
        return this._billboard.material;
    };
    BillboardRenderable._iIncludeDependencies = function (shader) {
    };
    BillboardRenderable._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    BillboardRenderable._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    BillboardRenderable.prototype._setRenderState = function (pass, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, pass, camera, viewProjection);
        var shader = pass.shader;
        if (shader.sceneMatrixIndex >= 0) {
            this.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils.CALCULATION_MATRIX;
            matrix3D.copyFrom(this.sourceEntity.getRenderSceneTransform(camera));
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shader.vertexConstantData, shader.numUsedVertexConstants);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shader.fragmentConstantData, shader.numUsedFragmentConstants);
    };
    BillboardRenderable._samplerGeometry = new Object();
    BillboardRenderable.vertexAttributesOffset = 1;
    return BillboardRenderable;
})(RenderableBase);
module.exports = BillboardRenderable;

},{"awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined,"awayjs-renderergl/lib/renderables/RenderableBase":"awayjs-renderergl/lib/renderables/RenderableBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/renderables/CurveSubMeshRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/renderables/RenderableBase");
/**
 * @class away.pool.TriangleSubMeshRenderable
 */
var CurveSubMeshRenderable = (function (_super) {
    __extends(CurveSubMeshRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param subMesh
     * @param level
     * @param indexOffset
     */
    function CurveSubMeshRenderable(subMesh, renderer) {
        _super.call(this, subMesh, subMesh.parentMesh, subMesh.material, renderer);
        this.subMesh = subMesh;
    }
    CurveSubMeshRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.subMesh = null;
    };
    /**
     *
     * @returns {SubGeometryBase}
     * @protected
     */
    CurveSubMeshRenderable.prototype._pGetSubGeometry = function () {
        return (this.subMesh.animator) ? this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry) : this.subMesh.subGeometry;
    };
    CurveSubMeshRenderable.prototype._pGetRenderOwner = function () {
        return this.subMesh.material;
    };
    CurveSubMeshRenderable._iIncludeDependencies = function (shader) {
        shader.usesLocalPosFragment = true;
    };
    CurveSubMeshRenderable._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ".xyw, " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov v2 va1 \n" + "mov op, " + temp + "\n";
        }
        else {
            code += "mov v2 va1 \n";
            code += "m44 op, " + position + ".xyw, " + viewMatrixReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    CurveSubMeshRenderable._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var sd = shader._stage.context.standardDerivatives;
        var pos = sharedRegisters.localPositionVarying;
        var out = sharedRegisters.shadedTarget;
        var curve = "v2";
        var curvex = "v2.x";
        var curvey = "v2.y";
        var curvez = pos + ".z";
        //get some free registers
        var free = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(free, 1);
        var free1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(free1, 1);
        var free2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(free2, 1);
        //distance from curve
        var d = free + ".x";
        var dx = free + ".y";
        var dy = free + ".z";
        var t = free + ".w";
        var d2 = free1 + ".x";
        var fixa = free1 + ".y";
        var fixb = free1 + ".z";
        var constantsReg = registerCache.getFreeFragmentConstant();
        var _aa = constantsReg + ".z";
        var _0 = constantsReg + ".x";
        var _1 = constantsReg + ".y";
        var nl = "\n";
        var code = new Array();
        //distance from curve
        code.push("mul", d, curvex, curvex, nl);
        code.push("sub", d, d, curvey, nl);
        code.push("mul", d, d, curvez, nl); //flipper
        //kill based on distance from curve
        code.push("kil", d, nl);
        var applyAA = false;
        if (applyAA && sd) {
            //derivatives
            code.push("ddx", dx, d, nl);
            code.push("ddy", dy, d, nl);
            //AA
            code.push("mul", dx, dx, dx, nl);
            code.push("mul", dy, dy, dy, nl);
            code.push("add", t, dx, dy, nl);
            code.push("sqt", t, t, nl);
            code.push("mul", t, t, _aa, nl);
            code.push("div", d, d, t, nl);
            /*
                        //code.push("sge", fixa, curvex, _1, nl);
                        code.push("slt", fixb, curvex, _1, nl);
                        code.push("sub", fixa, _1, fixb, nl);
                        //code.push("sub", fixb, _1, fixa, nl);
            
                        code.push("mul", d, d, fixb, nl);
            
            */
            //			code.push("abs", d, d, nl);
            code.push("max", d, d, _0, nl);
            code.push("min", d, d, _1, nl);
            code.push("mov", out + ".w", d, nl);
        }
        code.push("mov", out + ".w", _1, nl);
        return code.join(" ");
    };
    /**
     * @inheritDoc
     */
    CurveSubMeshRenderable.prototype._iActivate = function (pass, camera) {
        _super.prototype._iActivate.call(this, pass, camera);
        var context = this._stage.context;
        var data = pass.shader.fragmentConstantData;
        data[0] = CurveSubMeshRenderable._constants[0];
        data[1] = CurveSubMeshRenderable._constants[1];
        data[2] = CurveSubMeshRenderable._constants[2];
        data[3] = CurveSubMeshRenderable._constants[3];
    };
    /**
     * @inheritDoc
     */
    CurveSubMeshRenderable.prototype._setRenderState = function (pass, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, pass, camera, viewProjection);
        var shader = pass.shader;
        if (shader.sceneMatrixIndex >= 0) {
            this.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils.CALCULATION_MATRIX;
            matrix3D.copyFrom(this.sourceEntity.getRenderSceneTransform(camera));
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shader.vertexConstantData, shader.numUsedVertexConstants);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shader.fragmentConstantData, shader.numUsedFragmentConstants);
    };
    CurveSubMeshRenderable._constants = new Float32Array([0, 1, 1, 0.5]);
    CurveSubMeshRenderable.vertexAttributesOffset = 2;
    return CurveSubMeshRenderable;
})(RenderableBase);
module.exports = CurveSubMeshRenderable;

},{"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-renderergl/lib/renderables/RenderableBase":"awayjs-renderergl/lib/renderables/RenderableBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/renderables/IRenderableClass":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/renderables/LineSegmentRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/renderables/RenderableBase");
/**
 * @class away.pool.LineSubMeshRenderable
 */
var LineSegmentRenderable = (function (_super) {
    __extends(LineSegmentRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param subMesh
     * @param level
     * @param dataOffset
     */
    function LineSegmentRenderable(lineSegment, renderer) {
        _super.call(this, lineSegment, lineSegment, lineSegment.material, renderer);
        this._constants = new Float32Array([0, 0, 0, 0]);
        this._thickness = 1.25;
        this._lineSegment = lineSegment;
        this._calcMatrix = new Matrix3D();
        this._constants[1] = 1 / 255;
    }
    LineSegmentRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._lineSegment = null;
    };
    /**
     * //TODO
     *
     * @returns {base.LineSubGeometry}
     * @protected
     */
    LineSegmentRenderable.prototype._pGetSubGeometry = function () {
        var geometry = LineSegmentRenderable._lineGeometry[this._lineSegment.id] || (LineSegmentRenderable._lineGeometry[this._lineSegment.id] = new LineSubGeometry());
        var start = this._lineSegment.startPostion;
        var end = this._lineSegment.endPosition;
        var positions;
        var thickness;
        //if (geometry.indices != null) {
        //	positions = <Float32Array> geometry.positions.get(geometry.numVertices);
        //	thickness = geometry.thickness.get(geometry.numVertices);
        //} else {
        positions = new Float32Array(6);
        thickness = new Float32Array(1);
        //}
        positions[0] = start.x;
        positions[1] = start.y;
        positions[2] = start.z;
        positions[3] = end.x;
        positions[4] = end.y;
        positions[5] = end.z;
        thickness[0] = this._lineSegment.thickness;
        geometry.setPositions(positions);
        geometry.setThickness(thickness);
        return geometry;
    };
    LineSegmentRenderable.prototype._pGetRenderOwner = function () {
        return this._lineSegment.material;
    };
    LineSegmentRenderable._iIncludeDependencies = function (shader) {
        shader.colorDependencies++;
    };
    /**
     * @inheritDoc
     */
    LineSegmentRenderable._iGetVertexCode = function (shader, regCache, sharedReg) {
        return "m44 vt0, va0, vc8			\n" + "m44 vt1, va1, vc8			\n" + "sub vt2, vt1, vt0 			\n" + "slt vt5.x, vt0.z, vc7.z			\n" + "sub vt5.y, vc5.x, vt5.x			\n" + "add vt4.x, vt0.z, vc7.z			\n" + "sub vt4.y, vt0.z, vt1.z			\n" + "seq vt4.z, vt4.y vc6.x			\n" + "add vt4.y, vt4.y, vt4.z			\n" + "div vt4.z, vt4.x, vt4.y			\n" + "mul vt4.xyz, vt4.zzz, vt2.xyz	\n" + "add vt3.xyz, vt0.xyz, vt4.xyz	\n" + "mov vt3.w, vc5.x			\n" + "mul vt0, vt0, vt5.yyyy			\n" + "mul vt3, vt3, vt5.xxxx			\n" + "add vt0, vt0, vt3				\n" + "sub vt2, vt1, vt0 			\n" + "nrm vt2.xyz, vt2.xyz			\n" + "nrm vt5.xyz, vt0.xyz			\n" + "mov vt5.w, vc5.x				\n" + "crs vt3.xyz, vt2, vt5			\n" + "nrm vt3.xyz, vt3.xyz			\n" + "mul vt3.xyz, vt3.xyz, va2.xxx	\n" + "mov vt3.w, vc5.x			\n" + "dp3 vt4.x, vt0, vc6			\n" + "mul vt4.x, vt4.x, vc7.x			\n" + "mul vt3.xyz, vt3.xyz, vt4.xxx	\n" + "add vt0.xyz, vt0.xyz, vt3.xyz	\n" + "m44 op, vt0, vc0			\n"; // transform Q0 to clip space
    };
    LineSegmentRenderable._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    LineSegmentRenderable.prototype._iActivate = function (pass, camera) {
        _super.prototype._iActivate.call(this, pass, camera);
        this._constants[0] = this._thickness / ((this._stage.scissorRect) ? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));
        // value to convert distance from camera to model length per pixel width
        this._constants[2] = camera.projection.near;
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, LineSegmentRenderable.pONE_VECTOR, 1);
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 6, LineSegmentRenderable.pFRONT_VECTOR, 1);
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 7, this._constants, 1);
        // projection matrix
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, camera.projection.matrix, true);
    };
    /**
     * @inheritDoc
     */
    LineSegmentRenderable.prototype._setRenderState = function (pass, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, pass, camera, viewProjection);
        var context = this._stage.context;
        this._calcMatrix.copyFrom(this.sourceEntity.sceneTransform);
        this._calcMatrix.append(camera.inverseSceneTransform);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 8, this._calcMatrix, true);
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderableOwner
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubMeshRenderable}
     * @private
     */
    LineSegmentRenderable.prototype._pGetOverflowRenderable = function (indexOffset) {
        return new LineSegmentRenderable(this.renderableOwner, this._renderer);
    };
    LineSegmentRenderable._lineGeometry = new Object();
    LineSegmentRenderable.pONE_VECTOR = new Float32Array([1, 1, 1, 1]);
    LineSegmentRenderable.pFRONT_VECTOR = new Float32Array([0, 0, -1, 0]);
    LineSegmentRenderable.vertexAttributesOffset = 3;
    return LineSegmentRenderable;
})(RenderableBase);
module.exports = LineSegmentRenderable;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-display/lib/base/LineSubGeometry":undefined,"awayjs-renderergl/lib/renderables/RenderableBase":"awayjs-renderergl/lib/renderables/RenderableBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/renderables/LineSubMeshRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/renderables/RenderableBase");
/**
 * @class away.pool.LineSubMeshRenderable
 */
var LineSubMeshRenderable = (function (_super) {
    __extends(LineSubMeshRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param subMesh
     * @param level
     * @param dataOffset
     */
    function LineSubMeshRenderable(subMesh, renderer) {
        _super.call(this, subMesh, subMesh.parentMesh, subMesh.material, renderer);
        this._constants = new Float32Array([0, 0, 0, 0]);
        this._thickness = 1.25;
        this.subMesh = subMesh;
        this._calcMatrix = new Matrix3D();
        this._constants[1] = 1 / 255;
    }
    LineSubMeshRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.subMesh = null;
    };
    /**
     * //TODO
     *
     * @returns {base.LineSubGeometry}
     * @protected
     */
    LineSubMeshRenderable.prototype._pGetSubGeometry = function () {
        return this.subMesh.subGeometry;
    };
    LineSubMeshRenderable.prototype._pGetRenderOwner = function () {
        return this.subMesh.material;
    };
    LineSubMeshRenderable._iIncludeDependencies = function (shader) {
        shader.colorDependencies++;
    };
    /**
     * @inheritDoc
     */
    LineSubMeshRenderable._iGetVertexCode = function (shader, regCache, sharedReg) {
        return "m44 vt0, va0, vc8			\n" + "m44 vt1, va1, vc8			\n" + "sub vt2, vt1, vt0 			\n" + "slt vt5.x, vt0.z, vc7.z			\n" + "sub vt5.y, vc5.x, vt5.x			\n" + "add vt4.x, vt0.z, vc7.z			\n" + "sub vt4.y, vt0.z, vt1.z			\n" + "seq vt4.z, vt4.y vc6.x			\n" + "add vt4.y, vt4.y, vt4.z			\n" + "div vt4.z, vt4.x, vt4.y			\n" + "mul vt4.xyz, vt4.zzz, vt2.xyz	\n" + "add vt3.xyz, vt0.xyz, vt4.xyz	\n" + "mov vt3.w, vc5.x			\n" + "mul vt0, vt0, vt5.yyyy			\n" + "mul vt3, vt3, vt5.xxxx			\n" + "add vt0, vt0, vt3				\n" + "sub vt2, vt1, vt0 			\n" + "nrm vt2.xyz, vt2.xyz			\n" + "nrm vt5.xyz, vt0.xyz			\n" + "mov vt5.w, vc5.x				\n" + "crs vt3.xyz, vt2, vt5			\n" + "nrm vt3.xyz, vt3.xyz			\n" + "mul vt3.xyz, vt3.xyz, va2.xxx	\n" + "mov vt3.w, vc5.x			\n" + "dp3 vt4.x, vt0, vc6			\n" + "mul vt4.x, vt4.x, vc7.x			\n" + "mul vt3.xyz, vt3.xyz, vt4.xxx	\n" + "add vt0.xyz, vt0.xyz, vt3.xyz	\n" + "m44 op, vt0, vc0			\n"; // transform Q0 to clip space
    };
    LineSubMeshRenderable._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    LineSubMeshRenderable.prototype._iActivate = function (pass, camera) {
        _super.prototype._iActivate.call(this, pass, camera);
        this._constants[0] = this._thickness / ((this._stage.scissorRect) ? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));
        // value to convert distance from camera to model length per pixel width
        this._constants[2] = camera.projection.near;
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, LineSubMeshRenderable.pONE_VECTOR, 1);
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 6, LineSubMeshRenderable.pFRONT_VECTOR, 1);
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 7, this._constants, 1);
        // projection matrix
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, camera.projection.matrix, true);
    };
    /**
     * @inheritDoc
     */
    LineSubMeshRenderable.prototype._setRenderState = function (pass, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, pass, camera, viewProjection);
        var context = this._stage.context;
        this._calcMatrix.copyFrom(this.sourceEntity.sceneTransform);
        this._calcMatrix.append(camera.inverseSceneTransform);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 8, this._calcMatrix, true);
    };
    LineSubMeshRenderable.pONE_VECTOR = new Float32Array([1, 1, 1, 1]);
    LineSubMeshRenderable.pFRONT_VECTOR = new Float32Array([0, 0, -1, 0]);
    LineSubMeshRenderable.vertexAttributesOffset = 3;
    return LineSubMeshRenderable;
})(RenderableBase);
module.exports = LineSubMeshRenderable;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-renderergl/lib/renderables/RenderableBase":"awayjs-renderergl/lib/renderables/RenderableBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/renderables/RenderableBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
var RenderableOwnerEvent = require("awayjs-display/lib/events/RenderableOwnerEvent");
var DefaultMaterialManager = require("awayjs-display/lib/managers/DefaultMaterialManager");
/**
 * @class RenderableListItem
 */
var RenderableBase = (function (_super) {
    __extends(RenderableBase, _super);
    /**
     *
     * @param renderableOwner
     * @param sourceEntity
     * @param renderOwner
     * @param renderer
     */
    function RenderableBase(renderableOwner, sourceEntity, renderOwner, renderer) {
        var _this = this;
        _super.call(this, renderableOwner, renderer);
        this._geometryDirty = true;
        this._renderOwnerDirty = true;
        this.images = new Array();
        this.samplers = new Array();
        this._onRenderOwnerUpdatedDelegate = function (event) { return _this._onRenderOwnerUpdated(event); };
        this._onInvalidateGeometryDelegate = function (event) { return _this.onInvalidateGeometry(event); };
        //store a reference to the pool for later disposal
        this._renderer = renderer;
        this._stage = renderer.stage;
        this.sourceEntity = sourceEntity;
        this.renderableOwner = renderableOwner;
        this.renderableOwner.addEventListener(RenderableOwnerEvent.INVALIDATE_RENDER_OWNER, this._onRenderOwnerUpdatedDelegate);
        this.renderableOwner.addEventListener(RenderableOwnerEvent.INVALIDATE_GEOMETRY, this._onInvalidateGeometryDelegate);
    }
    Object.defineProperty(RenderableBase.prototype, "subGeometryVO", {
        get: function () {
            if (this._geometryDirty)
                this._updateGeometry();
            return this._subGeometryVO;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderableBase.prototype, "render", {
        get: function () {
            if (this._renderOwnerDirty)
                this._updateRenderOwner();
            return this._render;
        },
        enumerable: true,
        configurable: true
    });
    RenderableBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.next = null;
        this.masksConfig = null;
        this.renderSceneTransform = null;
        this._renderer.clearAbstraction(this.renderableOwner);
        this._renderer = null;
        this._stage = null;
        this.sourceEntity = null;
        this.renderableOwner.removeEventListener(RenderableOwnerEvent.INVALIDATE_RENDER_OWNER, this._onRenderOwnerUpdatedDelegate);
        this.renderableOwner = null;
        this._render.usages--;
        if (!this._render.usages)
            this._render.onClear(new AssetEvent(AssetEvent.CLEAR, this._render.renderOwner));
        this._render = null;
        if (this._subGeometryVO) {
            this._subGeometryVO.usages--;
            if (!this._subGeometryVO.usages)
                this._subGeometryVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._subGeometry));
            this._subGeometryVO = null;
        }
    };
    RenderableBase.prototype.onInvalidateGeometry = function (event) {
        this._geometryDirty = true;
    };
    RenderableBase.prototype._onRenderOwnerUpdated = function (event) {
        this._renderOwnerDirty = true;
    };
    RenderableBase.prototype._pGetSubGeometry = function () {
        throw new AbstractMethodError();
    };
    RenderableBase.prototype._pGetRenderOwner = function () {
        throw new AbstractMethodError();
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    RenderableBase.prototype._iActivate = function (pass, camera) {
        pass._iActivate(camera);
    };
    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    RenderableBase.prototype._iRender = function (pass, camera, viewProjection) {
        this._setRenderState(pass, camera, viewProjection);
        if (this._geometryDirty)
            this._updateGeometry();
        this._subGeometryVO._iRender(pass.shader);
    };
    RenderableBase.prototype._setRenderState = function (pass, camera, viewProjection) {
        pass._iRender(this, camera, viewProjection);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    RenderableBase.prototype._iDeactivate = function (pass) {
        pass._iDeactivate();
    };
    /**
     * //TODO
     *
     * @private
     */
    RenderableBase.prototype._updateGeometry = function () {
        if (this._subGeometryVO) {
            this._subGeometryVO.usages--;
            if (!this._subGeometryVO.usages)
                this._subGeometryVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._subGeometry));
        }
        this._subGeometry = this._pGetSubGeometry();
        this._subGeometryVO = this._stage.getAbstraction(this._subGeometry);
        this._subGeometryVO.usages++;
        this._geometryDirty = false;
    };
    RenderableBase.prototype._updateRenderOwner = function () {
        var renderOwner = this._pGetRenderOwner() || DefaultMaterialManager.getDefaultMaterial(this.renderableOwner);
        var render = this._renderer.getRenderPool(this.renderableOwner).getAbstraction(renderOwner);
        if (this._render != render) {
            if (this._render) {
                this._render.usages--;
                //dispose current render object
                if (!this._render.usages)
                    this._render.onClear(new AssetEvent(AssetEvent.CLEAR, this._render.renderOwner));
            }
            this._render = render;
            this._render.usages++;
        }
        //create a cache of image & sampler objects for the renderable
        var numImages = render.numImages;
        this.images.length = numImages;
        this.samplers.length = numImages;
        var numTextures = renderOwner.getNumTextures();
        var texture;
        var numImages;
        var image;
        var sampler;
        var index;
        for (var i = 0; i < numTextures; i++) {
            texture = renderOwner.getTextureAt(i);
            numImages = texture.getNumImages();
            for (var j = 0; j < numImages; j++) {
                index = render.getImageIndex(texture, j);
                image = this.renderableOwner.style ? this.renderableOwner.style.getImageAt(texture, j) : null;
                this.images[index] = image ? this._stage.getAbstraction(image) : null;
                sampler = this.renderableOwner.style ? this.renderableOwner.style.getSamplerAt(texture, j) : null;
                this.samplers[index] = sampler ? this._stage.getAbstraction(sampler) : null;
            }
        }
    };
    return RenderableBase;
})(AbstractionBase);
module.exports = RenderableBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-display/lib/events/RenderableOwnerEvent":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined}],"awayjs-renderergl/lib/renderables/SkyboxRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AttributesBuffer = require("awayjs-core/lib/attributes/AttributesBuffer");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/renderables/RenderableBase");
/**
 * @class away.pool.SkyboxRenderable
 */
var SkyboxRenderable = (function (_super) {
    __extends(SkyboxRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param skybox
     */
    function SkyboxRenderable(skybox, renderer) {
        _super.call(this, skybox, skybox, skybox, renderer);
        this._skybox = skybox;
        this._vertexArray = new Float32Array([0, 0, 0, 0, 1, 1, 1, 1]);
    }
    /**
     * //TODO
     *
     * @returns {away.base.TriangleSubGeometry}
     * @private
     */
    SkyboxRenderable.prototype._pGetSubGeometry = function () {
        var geometry = SkyboxRenderable._geometry;
        if (!geometry) {
            geometry = SkyboxRenderable._geometry = new TriangleSubGeometry(new AttributesBuffer(11, 4));
            geometry.autoDeriveNormals = false;
            geometry.autoDeriveTangents = false;
            geometry.setIndices(Array(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
            geometry.setPositions(Array(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
        }
        return geometry;
    };
    SkyboxRenderable.prototype._pGetRenderOwner = function () {
        return this._skybox;
    };
    SkyboxRenderable._iIncludeDependencies = function (shader) {
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderable._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        return "mul vt0, va0, vc5\n" + "add vt0, vt0, vc4\n" + "m44 op, vt0, vc0\n";
    };
    SkyboxRenderable._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderable.prototype._setRenderState = function (pass, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, pass, camera, viewProjection);
        var context = this._stage.context;
        var pos = camera.scenePosition;
        this._vertexArray[0] = pos.x;
        this._vertexArray[1] = pos.y;
        this._vertexArray[2] = pos.z;
        this._vertexArray[4] = this._vertexArray[5] = this._vertexArray[6] = camera.projection.far / Math.sqrt(3);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexArray, 2);
    };
    SkyboxRenderable.vertexAttributesOffset = 1;
    return SkyboxRenderable;
})(RenderableBase);
module.exports = SkyboxRenderable;

},{"awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/renderables/RenderableBase":"awayjs-renderergl/lib/renderables/RenderableBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/renderables/TriangleSubMeshRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/renderables/RenderableBase");
/**
 * @class away.pool.TriangleSubMeshRenderable
 */
var TriangleSubMeshRenderable = (function (_super) {
    __extends(TriangleSubMeshRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param subMesh
     * @param level
     * @param indexOffset
     */
    function TriangleSubMeshRenderable(subMesh, renderer) {
        _super.call(this, subMesh, subMesh.parentMesh, subMesh.material, renderer);
        this.subMesh = subMesh;
    }
    TriangleSubMeshRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.subMesh = null;
    };
    /**
     *
     * @returns {SubGeometryBase}
     * @protected
     */
    TriangleSubMeshRenderable.prototype._pGetSubGeometry = function () {
        return (this.subMesh.animator) ? this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry) : this.subMesh.subGeometry;
    };
    TriangleSubMeshRenderable.prototype._pGetRenderOwner = function () {
        return this.subMesh.material;
    };
    TriangleSubMeshRenderable._iIncludeDependencies = function (shader) {
    };
    TriangleSubMeshRenderable._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    TriangleSubMeshRenderable._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * @inheritDoc
     */
    TriangleSubMeshRenderable.prototype._setRenderState = function (pass, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, pass, camera, viewProjection);
        var shader = pass.shader;
        if (shader.sceneMatrixIndex >= 0) {
            this.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils.CALCULATION_MATRIX;
            matrix3D.copyFrom(this.sourceEntity.getRenderSceneTransform(camera));
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shader.vertexConstantData, shader.numUsedVertexConstants);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shader.fragmentConstantData, shader.numUsedFragmentConstants);
    };
    TriangleSubMeshRenderable.vertexAttributesOffset = 1;
    return TriangleSubMeshRenderable;
})(RenderableBase);
module.exports = TriangleSubMeshRenderable;

},{"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-renderergl/lib/renderables/RenderableBase":"awayjs-renderergl/lib/renderables/RenderableBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/shaders/LightingShader":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LightSources = require("awayjs-display/lib/materials/LightSources");
var ContextGLProfile = require("awayjs-stagegl/lib/base/ContextGLProfile");
var ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
var LightingCompiler = require("awayjs-renderergl/lib/shaders/compilers/LightingCompiler");
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
    function LightingShader(renderableClass, lightingPass, stage) {
        _super.call(this, renderableClass, lightingPass, stage);
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
        this.usesLightFallOff = this._lightingPass.enableLightFallOff && this.profile != ContextGLProfile.BASELINE_CONSTRAINED;
        this.usesCommonData = this.usesLightFallOff;
        this.numLights = numAllLights + numLightProbes;
        this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources.LIGHTS) != 0;
        this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources.PROBES) != 0;
        this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources.LIGHTS) != 0;
        this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources.PROBES) != 0;
        this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources.LIGHTS) != 0;
        this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources.PROBES) != 0;
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
    LightingShader.prototype.createCompiler = function (renderableClass, pass) {
        return new LightingCompiler(renderableClass, pass, this);
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    LightingShader.prototype._iRender = function (renderable, camera, viewProjection) {
        _super.prototype._iRender.call(this, renderable, camera, viewProjection);
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
})(ShaderBase);
module.exports = LightingShader;

},{"awayjs-display/lib/materials/LightSources":undefined,"awayjs-renderergl/lib/shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","awayjs-renderergl/lib/shaders/compilers/LightingCompiler":"awayjs-renderergl/lib/shaders/compilers/LightingCompiler","awayjs-stagegl/lib/base/ContextGLProfile":undefined}],"awayjs-renderergl/lib/shaders/RegisterPool":[function(require,module,exports){
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
/**
 * RegisterPool is used by the shader compilers process to keep track of which registers of a certain type are
 * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
 * or single components (x, y, z, w) of a single register.
 * It is used by ShaderRegisterCache to track usages of individual register types.
 *
 * @see away.materials.ShaderRegisterCache
 */
var RegisterPool = (function () {
    /**
     * Creates a new RegisterPool object.
     * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
     * @param regCount The amount of available registers of this type.
     * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
     */
    function RegisterPool(regName, regCount, persistent) {
        if (persistent === void 0) { persistent = true; }
        this._regName = regName;
        this._regCount = regCount;
        this._persistent = persistent;
        this.initRegisters(regName, regCount);
    }
    /**
     * Retrieve an entire vector register that's still available.
     */
    RegisterPool.prototype.requestFreeVectorReg = function () {
        for (var i = 0; i < this._regCount; ++i) {
            if (!this.isRegisterUsed(i)) {
                if (this._persistent)
                    this._usedVectorCount[i]++;
                return this._vectorRegisters[i];
            }
        }
        throw new Error("Register overflow!");
    };
    /**
     * Retrieve a single vector component that's still available.
     */
    RegisterPool.prototype.requestFreeRegComponent = function () {
        for (var i = 0; i < this._regCount; ++i) {
            if (this._usedVectorCount[i] > 0)
                continue;
            for (var j = 0; j < 4; ++j) {
                if (this._usedSingleCount[j][i] == 0) {
                    if (this._persistent)
                        this._usedSingleCount[j][i]++;
                    return this._registerComponents[j][i];
                }
            }
        }
        throw new Error("Register overflow!");
    };
    /**
     * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    RegisterPool.prototype.addUsage = function (register, usageCount) {
        if (register._component > -1)
            this._usedSingleCount[register._component][register.index] += usageCount;
        else
            this._usedVectorCount[register.index] += usageCount;
    };
    /**
     * Removes a usage from a register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    RegisterPool.prototype.removeUsage = function (register) {
        if (register._component > -1) {
            if (--this._usedSingleCount[register._component][register.index] < 0)
                throw new Error("More usages removed than exist!");
        }
        else {
            if (--this._usedVectorCount[register.index] < 0)
                throw new Error("More usages removed than exist!");
        }
    };
    /**
     * Disposes any resources used by the current RegisterPool object.
     */
    RegisterPool.prototype.dispose = function () {
        this._vectorRegisters = null;
        this._registerComponents = null;
        this._usedSingleCount = null;
        this._usedVectorCount = null;
    };
    /**
     * Indicates whether or not any registers are in use.
     */
    RegisterPool.prototype.hasRegisteredRegs = function () {
        for (var i = 0; i < this._regCount; ++i)
            if (this.isRegisterUsed(i))
                return true;
        return false;
    };
    /**
     * Initializes all registers.
     */
    RegisterPool.prototype.initRegisters = function (regName, regCount) {
        var hash = RegisterPool._initPool(regName, regCount);
        this._vectorRegisters = RegisterPool._regPool[hash];
        this._registerComponents = RegisterPool._regCompsPool[hash];
        this._usedVectorCount = this._initArray(Array(regCount), 0);
        this._usedSingleCount = new Array(4);
        this._usedSingleCount[0] = this._initArray(new Array(regCount), 0);
        this._usedSingleCount[1] = this._initArray(new Array(regCount), 0);
        this._usedSingleCount[2] = this._initArray(new Array(regCount), 0);
        this._usedSingleCount[3] = this._initArray(new Array(regCount), 0);
    };
    RegisterPool._initPool = function (regName, regCount) {
        var hash = regName + regCount;
        if (RegisterPool._regPool[hash] != undefined)
            return hash;
        var vectorRegisters = new Array(regCount);
        RegisterPool._regPool[hash] = vectorRegisters;
        var registerComponents = [
            [],
            [],
            [],
            []
        ];
        RegisterPool._regCompsPool[hash] = registerComponents;
        for (var i = 0; i < regCount; ++i) {
            vectorRegisters[i] = new ShaderRegisterElement(regName, i);
            for (var j = 0; j < 4; ++j)
                registerComponents[j][i] = new ShaderRegisterElement(regName, i, j);
        }
        return hash;
    };
    /**
     * Check if the temp register is either used for single or vector use
     */
    RegisterPool.prototype.isRegisterUsed = function (index) {
        if (this._usedVectorCount[index] > 0)
            return true;
        for (var i = 0; i < 4; ++i)
            if (this._usedSingleCount[i][index] > 0)
                return true;
        return false;
    };
    RegisterPool.prototype._initArray = function (a, val) {
        var l = a.length;
        for (var c = 0; c < l; c++)
            a[c] = val;
        return a;
    };
    RegisterPool._regPool = new Object();
    RegisterPool._regCompsPool = new Object();
    return RegisterPool;
})();
module.exports = RegisterPool;

},{"awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/shaders/ShaderBase":[function(require,module,exports){
var BlendMode = require("awayjs-core/lib/image/BlendMode");
var ArgumentError = require("awayjs-core/lib/errors/ArgumentError");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLTriangleFace = require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
var CompilerBase = require("awayjs-renderergl/lib/shaders/compilers/CompilerBase");
/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
var ShaderBase = (function () {
    /**
     * Creates a new MethodCompilerVO object.
     */
    function ShaderBase(renderableClass, pass, stage) {
        this._abstractionPool = new Object();
        this._blendFactorSource = ContextGLBlendFactor.ONE;
        this._blendFactorDest = ContextGLBlendFactor.ZERO;
        this._invalidShader = true;
        this._invalidProgram = true;
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        this.usesBlending = false;
        this.useImageRect = false;
        /**
         *
         */
        this.usesUVBuffer = false;
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        this.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        /**
         * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
         */
        this.writeDepth = true;
        this._defaultCulling = ContextGLTriangleFace.BACK;
        this._pInverseSceneMatrix = new Float32Array(16);
        //set ambient values to default
        this.ambientR = 0xFF;
        this.ambientG = 0xFF;
        this.ambientB = 0xFF;
        /**
         * Indicates whether there are any dependencies on the world-space position vector.
         */
        this.usesGlobalPosFragment = false;
        /**
         * Indicates whether there are any dependencies on the local position vector.
         */
        this.usesLocalPosFragment = false;
        /**
         *
         */
        this.imageIndices = new Array();
        this._renderableClass = renderableClass;
        this._pass = pass;
        this._stage = stage;
        this.profile = this._stage.profile;
    }
    Object.defineProperty(ShaderBase.prototype, "programData", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._programData;
        },
        enumerable: true,
        configurable: true
    });
    ShaderBase.prototype.getAbstraction = function (texture) {
        return (this._abstractionPool[texture.id] || (this._abstractionPool[texture.id] = new ShaderBase._abstractionClassPool[texture.assetType](texture, this)));
    };
    /**
     *
     * @param image
     */
    ShaderBase.prototype.clearAbstraction = function (renderableOwner) {
        this._abstractionPool[renderableOwner.id] = null;
    };
    /**
     *
     * @param imageObjectClass
     */
    ShaderBase.registerAbstraction = function (texture, assetClass) {
        ShaderBase._abstractionClassPool[assetClass.assetType] = texture;
    };
    ShaderBase.prototype.getImageIndex = function (texture, index) {
        if (index === void 0) { index = 0; }
        return this._pass.getImageIndex(texture, index);
    };
    ShaderBase.prototype._iIncludeDependencies = function () {
        this._pass._iIncludeDependencies(this);
    };
    /**
     * Factory method to create a concrete compiler object for this object
     *
     * @param renderableClass
     * @param pass
     * @param stage
     * @returns {CompilerBase}
     */
    ShaderBase.prototype.createCompiler = function (renderableClass, pass) {
        return new CompilerBase(renderableClass, pass, this);
    };
    /**
     * Clears dependency counts for all registers. Called when recompiling a pass.
     */
    ShaderBase.prototype.reset = function () {
        this.projectionDependencies = 0;
        this.normalDependencies = 0;
        this.colorDependencies = 0;
        this.viewDirDependencies = 0;
        this.uvDependencies = 0;
        this.secondaryUVDependencies = 0;
        this.globalPosDependencies = 0;
        this.tangentDependencies = 0;
        this.usesCommonData = false;
        this.usesGlobalPosFragment = false;
        this.usesLocalPosFragment = false;
        this.usesFragmentAnimation = false;
        this.usesTangentSpace = false;
        this.outputsNormals = false;
        this.outputsTangentNormals = false;
    };
    ShaderBase.prototype.pInitRegisterIndices = function () {
        this.commonsDataIndex = -1;
        this.cameraPositionIndex = -1;
        this.uvBufferIndex = -1;
        this.uvTransformIndex = -1;
        this.colorTransformIndex = -1;
        this.secondaryUVBufferIndex = -1;
        this.normalBufferIndex = -1;
        this.colorBufferIndex = -1;
        this.tangentBufferIndex = -1;
        this.sceneMatrixIndex = -1;
        this.sceneNormalMatrixIndex = -1;
        this.jointIndexIndex = -1;
        this.jointWeightIndex = -1;
        this.imageIndices.length = 0;
    };
    /**
     * Initializes the unchanging constant data for this shader object.
     */
    ShaderBase.prototype.initConstantData = function (registerCache, animatableAttributes, animationTargetRegisters, uvSource, uvTarget) {
        //Updates the amount of used register indices.
        this.numUsedVertexConstants = registerCache.numUsedVertexConstants;
        this.numUsedFragmentConstants = registerCache.numUsedFragmentConstants;
        this.numUsedStreams = registerCache.numUsedStreams;
        this.numUsedTextures = registerCache.numUsedTextures;
        this.numUsedVaryings = registerCache.numUsedVaryings;
        this.numUsedFragmentConstants = registerCache.numUsedFragmentConstants;
        this.animatableAttributes = animatableAttributes;
        this.animationTargetRegisters = animationTargetRegisters;
        this.uvSource = uvSource;
        this.uvTarget = uvTarget;
        this.vertexConstantData = new Float32Array(this.numUsedVertexConstants * 4);
        this.fragmentConstantData = new Float32Array(this.numUsedFragmentConstants * 4);
        //Initializes commonly required constant values.
        if (this.commonsDataIndex >= 0) {
            this.fragmentConstantData[this.commonsDataIndex] = .5;
            this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
            this.fragmentConstantData[this.commonsDataIndex + 2] = 1 / 255;
            this.fragmentConstantData[this.commonsDataIndex + 3] = 1;
        }
        //Initializes the default UV transformation matrix.
        if (this.uvTransformIndex >= 0) {
            this.vertexConstantData[this.uvTransformIndex] = 1;
            this.vertexConstantData[this.uvTransformIndex + 1] = 0;
            this.vertexConstantData[this.uvTransformIndex + 2] = 0;
            this.vertexConstantData[this.uvTransformIndex + 3] = 0;
            this.vertexConstantData[this.uvTransformIndex + 4] = 0;
            this.vertexConstantData[this.uvTransformIndex + 5] = 1;
            this.vertexConstantData[this.uvTransformIndex + 6] = 0;
            this.vertexConstantData[this.uvTransformIndex + 7] = 0;
        }
        //Initializes the default colorTransform.
        if (this.colorTransformIndex >= 0) {
            this.fragmentConstantData[this.colorTransformIndex] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 1] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 2] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 3] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 4] = 0;
            this.fragmentConstantData[this.colorTransformIndex + 5] = 0;
            this.fragmentConstantData[this.colorTransformIndex + 6] = 0;
            this.fragmentConstantData[this.colorTransformIndex + 7] = 0;
        }
        if (this.cameraPositionIndex >= 0)
            this.vertexConstantData[this.cameraPositionIndex + 3] = 1;
    };
    /**
     * The blend mode to use when drawing this renderable. The following blend modes are supported:
     * <ul>
     * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
     * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
     * <li>BlendMode.MULTIPLY</li>
     * <li>BlendMode.ADD</li>
     * <li>BlendMode.ALPHA</li>
     * </ul>
     */
    ShaderBase.prototype.setBlendMode = function (value) {
        switch (value) {
            case BlendMode.NORMAL:
                this._blendFactorSource = ContextGLBlendFactor.ONE;
                this._blendFactorDest = ContextGLBlendFactor.ZERO;
                this.usesBlending = false;
                break;
            case BlendMode.LAYER:
                this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                this.usesBlending = true;
                break;
            case BlendMode.MULTIPLY:
                this._blendFactorSource = ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
                this.usesBlending = true;
                break;
            case BlendMode.ADD:
                this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor.ONE;
                this.usesBlending = true;
                break;
            case BlendMode.ALPHA:
                this._blendFactorSource = ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
                this.usesBlending = true;
                break;
            default:
                throw new ArgumentError("Unsupported blend mode!");
        }
    };
    /**
     * @inheritDoc
     */
    ShaderBase.prototype._iActivate = function (camera) {
        if (this.usesAnimation)
            this._pass.animationSet.activate(this, this._stage);
        this._stage.context.setCulling(this.useBothSides ? ContextGLTriangleFace.NONE : this._defaultCulling, camera.projection.coordinateSystem);
        if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
            var pos = camera.scenePosition;
            this.vertexConstantData[this.cameraPositionIndex] = pos.x;
            this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
            this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
        }
        this._stage.context.setDepthTest((this.writeDepth && !this.usesBlending), this.depthCompareMode);
        if (this.usesBlending)
            this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
    };
    /**
     * @inheritDoc
     */
    ShaderBase.prototype._iDeactivate = function () {
        if (this.usesAnimation)
            this._pass.animationSet.deactivate(this, this._stage);
        //For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
        this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    ShaderBase.prototype._iRender = function (renderable, camera, viewProjection) {
        if (renderable.renderableOwner.animator)
            renderable.renderableOwner.animator.setRenderState(this, renderable, this._stage, camera, this.numUsedVertexConstants, this.numUsedStreams);
        if (this.usesUVTransform) {
            var uvTransform = renderable.renderableOwner.uvTransform;
            if (uvTransform) {
                this.vertexConstantData[this.uvTransformIndex] = uvTransform.a;
                this.vertexConstantData[this.uvTransformIndex + 1] = uvTransform.b;
                this.vertexConstantData[this.uvTransformIndex + 3] = uvTransform.tx;
                this.vertexConstantData[this.uvTransformIndex + 4] = uvTransform.c;
                this.vertexConstantData[this.uvTransformIndex + 5] = uvTransform.d;
                this.vertexConstantData[this.uvTransformIndex + 7] = uvTransform.ty;
            }
            else {
                this.vertexConstantData[this.uvTransformIndex] = 1;
                this.vertexConstantData[this.uvTransformIndex + 1] = 0;
                this.vertexConstantData[this.uvTransformIndex + 3] = 0;
                this.vertexConstantData[this.uvTransformIndex + 4] = 0;
                this.vertexConstantData[this.uvTransformIndex + 5] = 1;
                this.vertexConstantData[this.uvTransformIndex + 7] = 0;
            }
        }
        if (this.usesColorTransform) {
            var colorTransform = renderable.sourceEntity._iAssignedColorTransform();
            if (colorTransform) {
                this.fragmentConstantData[this.colorTransformIndex] = colorTransform.redMultiplier;
                this.fragmentConstantData[this.colorTransformIndex + 1] = colorTransform.greenMultiplier;
                this.fragmentConstantData[this.colorTransformIndex + 2] = colorTransform.blueMultiplier;
                this.fragmentConstantData[this.colorTransformIndex + 3] = colorTransform.alphaMultiplier;
                this.fragmentConstantData[this.colorTransformIndex + 4] = colorTransform.redOffset / 255;
                this.fragmentConstantData[this.colorTransformIndex + 5] = colorTransform.greenOffset / 255;
                this.fragmentConstantData[this.colorTransformIndex + 6] = colorTransform.blueOffset / 255;
                this.fragmentConstantData[this.colorTransformIndex + 7] = colorTransform.alphaOffset / 255;
            }
            else {
                this.fragmentConstantData[this.colorTransformIndex] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 1] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 2] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 3] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 4] = 0;
                this.fragmentConstantData[this.colorTransformIndex + 5] = 0;
                this.fragmentConstantData[this.colorTransformIndex + 6] = 0;
                this.fragmentConstantData[this.colorTransformIndex + 7] = 0;
            }
        }
        if (this.sceneNormalMatrixIndex >= 0)
            renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this.vertexConstantData, this.sceneNormalMatrixIndex, false);
        if (this.usesTangentSpace && this.cameraPositionIndex >= 0) {
            renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this._pInverseSceneMatrix);
            var pos = camera.scenePosition;
            var x = pos.x;
            var y = pos.y;
            var z = pos.z;
            this.vertexConstantData[this.cameraPositionIndex] = this._pInverseSceneMatrix[0] * x + this._pInverseSceneMatrix[4] * y + this._pInverseSceneMatrix[8] * z + this._pInverseSceneMatrix[12];
            this.vertexConstantData[this.cameraPositionIndex + 1] = this._pInverseSceneMatrix[1] * x + this._pInverseSceneMatrix[5] * y + this._pInverseSceneMatrix[9] * z + this._pInverseSceneMatrix[13];
            this.vertexConstantData[this.cameraPositionIndex + 2] = this._pInverseSceneMatrix[2] * x + this._pInverseSceneMatrix[6] * y + this._pInverseSceneMatrix[10] * z + this._pInverseSceneMatrix[14];
        }
    };
    ShaderBase.prototype.invalidateProgram = function () {
        this._invalidProgram = true;
    };
    ShaderBase.prototype.invalidateShader = function () {
        this._invalidShader = true;
        this._invalidProgram = true;
    };
    ShaderBase.prototype.dispose = function () {
        this._programData.dispose();
        this._programData = null;
    };
    ShaderBase.prototype._updateProgram = function () {
        this._invalidProgram = false;
        var compiler;
        if (this._invalidShader) {
            this._invalidShader = false;
            compiler = this.createCompiler(this._renderableClass, this._pass);
            compiler.compile();
        }
        this._calcAnimationCode(compiler.shadedTarget);
        var programData = this._stage.getProgramData(this._animationVertexCode + compiler.vertexCode, compiler.fragmentCode + this._animationFragmentCode + compiler.postAnimationFragmentCode);
        //check program data hasn't changed, keep count of program usages
        if (this._programData != programData) {
            if (this._programData)
                this._programData.dispose();
            this._programData = programData;
            programData.usages++;
        }
    };
    ShaderBase.prototype._calcAnimationCode = function (shadedTarget) {
        //reset code
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        //check to see if GPU animation is used
        if (this.usesAnimation) {
            var animationSet = this._pass.animationSet;
            this._animationVertexCode += animationSet.getAGALVertexCode(this);
            if (this.uvDependencies > 0 && !this.usesUVTransform)
                this._animationVertexCode += animationSet.getAGALUVCode(this);
            if (this.usesFragmentAnimation)
                this._animationFragmentCode += animationSet.getAGALFragmentCode(this, shadedTarget);
            animationSet.doneAGALCode(this);
        }
        else {
            // simply write attributes to targets, do not animate them
            // projection will pick up on targets[0] to do the projection
            var len = this.animatableAttributes.length;
            for (var i = 0; i < len; ++i)
                this._animationVertexCode += "mov " + this.animationTargetRegisters[i] + ", " + this.animatableAttributes[i] + "\n";
            if (this.uvDependencies > 0 && !this.usesUVTransform)
                this._animationVertexCode += "mov " + this.uvTarget + "," + this.uvSource + "\n";
        }
    };
    ShaderBase._abstractionClassPool = new Object();
    return ShaderBase;
})();
module.exports = ShaderBase;

},{"awayjs-core/lib/errors/ArgumentError":undefined,"awayjs-core/lib/image/BlendMode":undefined,"awayjs-renderergl/lib/shaders/compilers/CompilerBase":"awayjs-renderergl/lib/shaders/compilers/CompilerBase","awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLTriangleFace":undefined}],"awayjs-renderergl/lib/shaders/ShaderRegisterCache":[function(require,module,exports){
var RegisterPool = require("awayjs-renderergl/lib/shaders/RegisterPool");
var ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
/**
 * ShaderRegister Cache provides the usage management system for all registers during shading compilers.
 */
var ShaderRegisterCache = (function () {
    /**
     * Create a new ShaderRegisterCache object.
     *
     * @param profile The compatibility profile used by the renderer.
     */
    function ShaderRegisterCache(profile) {
        this._numUsedVertexConstants = 0;
        this._numUsedFragmentConstants = 0;
        this._numUsedStreams = 0;
        this._numUsedTextures = 0;
        this._numUsedVaryings = 0;
        this._profile = profile;
    }
    /**
     * Resets all registers.
     */
    ShaderRegisterCache.prototype.reset = function () {
        this._fragmentTempCache = new RegisterPool("ft", 8, false);
        this._vertexTempCache = new RegisterPool("vt", 8, false);
        this._varyingCache = new RegisterPool("v", 8);
        this._textureCache = new RegisterPool("fs", 8);
        this._vertexAttributesCache = new RegisterPool("va", 8);
        this._fragmentConstantsCache = new RegisterPool("fc", 28);
        this._vertexConstantsCache = new RegisterPool("vc", 128);
        this._fragmentOutputRegister = new ShaderRegisterElement("oc", -1);
        this._vertexOutputRegister = new ShaderRegisterElement("op", -1);
        this._numUsedVertexConstants = 0;
        this._numUsedStreams = 0;
        this._numUsedTextures = 0;
        this._numUsedVaryings = 0;
        this._numUsedFragmentConstants = 0;
        var i;
        for (i = 0; i < this._vertexAttributesOffset; ++i)
            this.getFreeVertexAttribute();
        for (i = 0; i < this._vertexConstantOffset; ++i)
            this.getFreeVertexConstant();
        for (i = 0; i < this._varyingsOffset; ++i)
            this.getFreeVarying();
        for (i = 0; i < this._fragmentConstantOffset; ++i)
            this.getFreeFragmentConstant();
    };
    /**
     * Disposes all resources used.
     */
    ShaderRegisterCache.prototype.dispose = function () {
        this._fragmentTempCache.dispose();
        this._vertexTempCache.dispose();
        this._varyingCache.dispose();
        this._fragmentConstantsCache.dispose();
        this._vertexAttributesCache.dispose();
        this._fragmentTempCache = null;
        this._vertexTempCache = null;
        this._varyingCache = null;
        this._fragmentConstantsCache = null;
        this._vertexAttributesCache = null;
        this._fragmentOutputRegister = null;
        this._vertexOutputRegister = null;
    };
    /**
     * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    ShaderRegisterCache.prototype.addFragmentTempUsages = function (register, usageCount) {
        this._fragmentTempCache.addUsage(register, usageCount);
    };
    /**
     * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    ShaderRegisterCache.prototype.removeFragmentTempUsage = function (register) {
        this._fragmentTempCache.removeUsage(register);
    };
    /**
     * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
     * until removeUsage has been called usageCount times again.
     * @param register The register to mark as used.
     * @param usageCount The amount of usages to add.
     */
    ShaderRegisterCache.prototype.addVertexTempUsages = function (register, usageCount) {
        this._vertexTempCache.addUsage(register, usageCount);
    };
    /**
     * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
     * @param register The register for which to remove a usage.
     */
    ShaderRegisterCache.prototype.removeVertexTempUsage = function (register) {
        this._vertexTempCache.removeUsage(register);
    };
    /**
     * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
     * has been called usageCount times again.
     */
    ShaderRegisterCache.prototype.getFreeFragmentVectorTemp = function () {
        return this._fragmentTempCache.requestFreeVectorReg();
    };
    /**
     * Retrieve a single component from a fragment temporary register that's still available.
     */
    ShaderRegisterCache.prototype.getFreeFragmentSingleTemp = function () {
        return this._fragmentTempCache.requestFreeRegComponent();
    };
    /**
     * Retrieve an available varying register
     */
    ShaderRegisterCache.prototype.getFreeVarying = function () {
        ++this._numUsedVaryings;
        return this._varyingCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an available fragment constant register
     */
    ShaderRegisterCache.prototype.getFreeFragmentConstant = function () {
        ++this._numUsedFragmentConstants;
        return this._fragmentConstantsCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an available vertex constant register
     */
    ShaderRegisterCache.prototype.getFreeVertexConstant = function () {
        ++this._numUsedVertexConstants;
        return this._vertexConstantsCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an entire vertex temporary register that's still available.
     */
    ShaderRegisterCache.prototype.getFreeVertexVectorTemp = function () {
        return this._vertexTempCache.requestFreeVectorReg();
    };
    /**
     * Retrieve a single component from a vertex temporary register that's still available.
     */
    ShaderRegisterCache.prototype.getFreeVertexSingleTemp = function () {
        return this._vertexTempCache.requestFreeRegComponent();
    };
    /**
     * Retrieve an available vertex attribute register
     */
    ShaderRegisterCache.prototype.getFreeVertexAttribute = function () {
        ++this._numUsedStreams;
        return this._vertexAttributesCache.requestFreeVectorReg();
    };
    /**
     * Retrieve an available texture register
     */
    ShaderRegisterCache.prototype.getFreeTextureReg = function () {
        ++this._numUsedTextures;
        return this._textureCache.requestFreeVectorReg();
    };
    Object.defineProperty(ShaderRegisterCache.prototype, "vertexConstantOffset", {
        /**
         * Indicates the start index from which to retrieve vertex constants.
         */
        get: function () {
            return this._vertexConstantOffset;
        },
        set: function (vertexConstantOffset) {
            this._vertexConstantOffset = vertexConstantOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "vertexAttributesOffset", {
        /**
         * Indicates the start index from which to retrieve vertex attributes.
         */
        get: function () {
            return this._vertexAttributesOffset;
        },
        set: function (value) {
            this._vertexAttributesOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "varyingsOffset", {
        /**
         * Indicates the start index from which to retrieve varying registers.
         */
        get: function () {
            return this._varyingsOffset;
        },
        set: function (value) {
            this._varyingsOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "fragmentConstantOffset", {
        /**
         * Indicates the start index from which to retrieve fragment constants.
         */
        get: function () {
            return this._fragmentConstantOffset;
        },
        set: function (value) {
            this._fragmentConstantOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "fragmentOutputRegister", {
        /**
         * The fragment output register.
         */
        get: function () {
            return this._fragmentOutputRegister;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedVertexConstants", {
        /**
         * The amount of used vertex constant registers.
         */
        get: function () {
            return this._numUsedVertexConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedFragmentConstants", {
        /**
         * The amount of used fragment constant registers.
         */
        get: function () {
            return this._numUsedFragmentConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedStreams", {
        /**
         * The amount of used vertex streams.
         */
        get: function () {
            return this._numUsedStreams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedTextures", {
        /**
         * The amount of used texture slots.
         */
        get: function () {
            return this._numUsedTextures;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterCache.prototype, "numUsedVaryings", {
        /**
         * The amount of used varying registers.
         */
        get: function () {
            return this._numUsedVaryings;
        },
        enumerable: true,
        configurable: true
    });
    return ShaderRegisterCache;
})();
module.exports = ShaderRegisterCache;

},{"awayjs-renderergl/lib/shaders/RegisterPool":"awayjs-renderergl/lib/shaders/RegisterPool","awayjs-renderergl/lib/shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/shaders/ShaderRegisterData":[function(require,module,exports){
/**
 * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
 */
var ShaderRegisterData = (function () {
    function ShaderRegisterData() {
        this.textures = Array();
    }
    return ShaderRegisterData;
})();
module.exports = ShaderRegisterData;

},{}],"awayjs-renderergl/lib/shaders/ShaderRegisterElement":[function(require,module,exports){
/**
 * A single register element (an entire register or a single register's component) used by the RegisterPool.
 */
var ShaderRegisterElement = (function () {
    /**
     * Creates a new ShaderRegisterElement object.
     *
     * @param regName The name of the register.
     * @param index The index of the register.
     * @param component The register's component, if not the entire register is represented.
     */
    function ShaderRegisterElement(regName, index, component) {
        if (component === void 0) { component = -1; }
        this._component = component;
        this._regName = regName;
        this._index = index;
        this._toStr = this._regName;
        if (this._index >= 0)
            this._toStr += this._index;
        if (component > -1)
            this._toStr += "." + ShaderRegisterElement.COMPONENTS[component];
    }
    /**
     * Converts the register or the components AGAL string representation.
     */
    ShaderRegisterElement.prototype.toString = function () {
        return this._toStr;
    };
    Object.defineProperty(ShaderRegisterElement.prototype, "regName", {
        /**
         * The register's name.
         */
        get: function () {
            return this._regName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderRegisterElement.prototype, "index", {
        /**
         * The register's index.
         */
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    ShaderRegisterElement.COMPONENTS = ["x", "y", "z", "w"];
    return ShaderRegisterElement;
})();
module.exports = ShaderRegisterElement;

},{}],"awayjs-renderergl/lib/shaders/compilers/CompilerBase":[function(require,module,exports){
var ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
var ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
/**
 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
var CompilerBase = (function () {
    /**
     * Creates a new CompilerBase object.
     * @param profile The compatibility profile of the renderer.
     */
    function CompilerBase(renderableClass, pass, shader) {
        this._pVertexCode = ''; // Changed to emtpy string- AwayTS
        this._pFragmentCode = ''; // Changed to emtpy string - AwayTS
        this._pPostAnimationFragmentCode = ''; // Changed to emtpy string - AwayTS
        this._pRenderableClass = renderableClass;
        this._pRenderPass = pass;
        this._pShader = shader;
        this._pSharedRegisters = new ShaderRegisterData();
        this._pRegisterCache = new ShaderRegisterCache(shader.profile);
        this._pRegisterCache.vertexAttributesOffset = renderableClass.vertexAttributesOffset;
        this._pRegisterCache.reset();
    }
    /**
     * Compiles the code after all setup on the compiler has finished.
     */
    CompilerBase.prototype.compile = function () {
        this._pShader.reset();
        this._pShader._iIncludeDependencies();
        this.pInitRegisterIndices();
        this.pCompileDependencies();
        //compile custom vertex & fragment codes
        this._pVertexCode += this._pRenderPass._iGetVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
        this._pPostAnimationFragmentCode += this._pRenderPass._iGetFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
        if (this._pShader.usesColorTransform)
            this.compileColorTransformCode();
        else
            this._pShader.colorTransformIndex = -1;
        //assign the final output color to the output register
        this._pPostAnimationFragmentCode += "mov " + this._pRegisterCache.fragmentOutputRegister + ", " + this._pSharedRegisters.shadedTarget + "\n";
        this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.shadedTarget);
        //initialise the required shader constants
        this._pShader.initConstantData(this._pRegisterCache, this._pAnimatableAttributes, this._pAnimationTargetRegisters, this._uvSource, this._uvTarget);
        this._pRenderPass._iInitConstantData(this._pShader);
    };
    /**
     * Calculate the transformed colours
     */
    CompilerBase.prototype.compileColorTransformCode = function () {
        // rm, gm, bm, am - multiplier
        // ro, go, bo, ao - offset
        var ct1 = this._pRegisterCache.getFreeFragmentConstant();
        var ct2 = this._pRegisterCache.getFreeFragmentConstant();
        this._pShader.colorTransformIndex = ct1.index * 4;
        this._pPostAnimationFragmentCode += "mul " + this._pSharedRegisters.shadedTarget + ", " + this._pSharedRegisters.shadedTarget + ", " + ct1 + "\n";
        this._pPostAnimationFragmentCode += "add " + this._pSharedRegisters.shadedTarget + ", " + this._pSharedRegisters.shadedTarget + ", " + ct2 + "\n";
    };
    /**
     * Compile the code for the methods.
     */
    CompilerBase.prototype.pCompileDependencies = function () {
        this._pSharedRegisters.shadedTarget = this._pRegisterCache.getFreeFragmentVectorTemp();
        this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.shadedTarget, 1);
        //compile the world-space position if required
        if (this._pShader.globalPosDependencies > 0)
            this.compileGlobalPositionCode();
        //compile the local-space position if required
        if (this._pShader.usesLocalPosFragment)
            this.compileLocalPositionCode();
        //Calculate the (possibly animated) UV coordinates.
        if (this._pShader.uvDependencies > 0)
            this.compileUVCode();
        if (this._pShader.secondaryUVDependencies > 0)
            this.compileSecondaryUVCode();
        if (this._pShader.normalDependencies > 0)
            this.compileNormalCode();
        if (this._pShader.viewDirDependencies > 0)
            this.compileViewDirCode();
        //collect code from material
        this._pVertexCode += this._pRenderableClass._iGetVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._pRenderableClass._iGetFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
        //collect code from pass
        this._pVertexCode += this._pRenderPass._iGetPreLightingVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._pRenderPass._iGetPreLightingFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
    };
    CompilerBase.prototype.compileGlobalPositionCode = function () {
        this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.globalPositionVertex = this._pRegisterCache.getFreeVertexVectorTemp(), this._pShader.globalPosDependencies);
        var sceneMatrixReg = this._pRegisterCache.getFreeVertexConstant();
        this._pRegisterCache.getFreeVertexConstant();
        this._pRegisterCache.getFreeVertexConstant();
        this._pRegisterCache.getFreeVertexConstant();
        this._pShader.sceneMatrixIndex = sceneMatrixReg.index * 4;
        this._pVertexCode += "m44 " + this._pSharedRegisters.globalPositionVertex + ", " + this._pSharedRegisters.localPosition + ", " + sceneMatrixReg + "\n";
        if (this._pShader.usesGlobalPosFragment) {
            this._pSharedRegisters.globalPositionVarying = this._pRegisterCache.getFreeVarying();
            this._pVertexCode += "mov " + this._pSharedRegisters.globalPositionVarying + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
        }
    };
    CompilerBase.prototype.compileLocalPositionCode = function () {
        this._pSharedRegisters.localPositionVarying = this._pRegisterCache.getFreeVarying();
        this._pVertexCode += "mov " + this._pSharedRegisters.localPositionVarying + ", " + this._pSharedRegisters.localPosition + "\n";
    };
    /**
     * Calculate the (possibly animated) UV coordinates.
     */
    CompilerBase.prototype.compileUVCode = function () {
        var uvAttributeReg = this._pRegisterCache.getFreeVertexAttribute();
        this._pShader.uvBufferIndex = uvAttributeReg.index;
        var varying = this._pSharedRegisters.uvVarying = this._pRegisterCache.getFreeVarying();
        if (this._pShader.usesUVTransform) {
            // a, b, 0, tx
            // c, d, 0, ty
            var uvTransform1 = this._pRegisterCache.getFreeVertexConstant();
            var uvTransform2 = this._pRegisterCache.getFreeVertexConstant();
            this._pShader.uvTransformIndex = uvTransform1.index * 4;
            this._pVertexCode += "dp4 " + varying + ".x, " + uvAttributeReg + ", " + uvTransform1 + "\n" + "dp4 " + varying + ".y, " + uvAttributeReg + ", " + uvTransform2 + "\n" + "mov " + varying + ".zw, " + uvAttributeReg + ".zw \n";
        }
        else {
            this._pShader.uvTransformIndex = -1;
            this._uvTarget = varying.toString();
            this._uvSource = uvAttributeReg.toString();
        }
    };
    /**
     * Provide the secondary UV coordinates.
     */
    CompilerBase.prototype.compileSecondaryUVCode = function () {
        var uvAttributeReg = this._pRegisterCache.getFreeVertexAttribute();
        this._pShader.secondaryUVBufferIndex = uvAttributeReg.index;
        this._pSharedRegisters.secondaryUVVarying = this._pRegisterCache.getFreeVarying();
        this._pVertexCode += "mov " + this._pSharedRegisters.secondaryUVVarying + ", " + uvAttributeReg + "\n";
    };
    /**
     * Calculate the view direction.
     */
    CompilerBase.prototype.compileViewDirCode = function () {
        var cameraPositionReg = this._pRegisterCache.getFreeVertexConstant();
        this._pSharedRegisters.viewDirVarying = this._pRegisterCache.getFreeVarying();
        this._pSharedRegisters.viewDirFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
        this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.viewDirFragment, this._pShader.viewDirDependencies);
        this._pShader.cameraPositionIndex = cameraPositionReg.index * 4;
        if (this._pShader.usesTangentSpace) {
            var temp = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pVertexCode += "sub " + temp + ", " + cameraPositionReg + ", " + this._pSharedRegisters.localPosition + "\n" + "m33 " + this._pSharedRegisters.viewDirVarying + ".xyz, " + temp + ", " + this._pSharedRegisters.animatedTangent + "\n" + "mov " + this._pSharedRegisters.viewDirVarying + ".w, " + this._pSharedRegisters.localPosition + ".w\n";
        }
        else {
            this._pVertexCode += "sub " + this._pSharedRegisters.viewDirVarying + ", " + cameraPositionReg + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
            this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.globalPositionVertex);
        }
        //TODO is this required in all cases? (re: distancemappass)
        this._pFragmentCode += "nrm " + this._pSharedRegisters.viewDirFragment + ".xyz, " + this._pSharedRegisters.viewDirVarying + "\n" + "mov " + this._pSharedRegisters.viewDirFragment + ".w,   " + this._pSharedRegisters.viewDirVarying + ".w\n";
    };
    /**
     * Calculate the normal.
     */
    CompilerBase.prototype.compileNormalCode = function () {
        this._pSharedRegisters.normalFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
        this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.normalFragment, this._pShader.normalDependencies);
        //simple normal aquisition if no tangent space is being used
        if (this._pShader.outputsNormals && !this._pShader.outputsTangentNormals) {
            this._pVertexCode += this._pRenderPass._iGetNormalVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
            this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
            return;
        }
        var normalMatrix;
        if (!this._pShader.outputsNormals || !this._pShader.usesTangentSpace) {
            normalMatrix = new Array(3);
            normalMatrix[0] = this._pRegisterCache.getFreeVertexConstant();
            normalMatrix[1] = this._pRegisterCache.getFreeVertexConstant();
            normalMatrix[2] = this._pRegisterCache.getFreeVertexConstant();
            this._pRegisterCache.getFreeVertexConstant();
            this._pShader.sceneNormalMatrixIndex = normalMatrix[0].index * 4;
            this._pSharedRegisters.normalVarying = this._pRegisterCache.getFreeVarying();
        }
        if (this._pShader.outputsNormals) {
            if (this._pShader.usesTangentSpace) {
                // normalize normal + tangent vector and generate (approximated) bitangent used in m33 operation for view
                this._pVertexCode += "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + this._pSharedRegisters.animatedNormal + "\n" + "nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + this._pSharedRegisters.animatedTangent + "\n" + "crs " + this._pSharedRegisters.bitangent + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n";
                this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
            }
            else {
                //Compiles the vertex shader code for tangent-space normal maps.
                this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
                this._pSharedRegisters.bitangentVarying = this._pRegisterCache.getFreeVarying();
                var temp = this._pRegisterCache.getFreeVertexVectorTemp();
                this._pVertexCode += "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" + "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + temp + "\n" + "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" + "nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + temp + "\n" + "mov " + this._pSharedRegisters.tangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".x  \n" + "mov " + this._pSharedRegisters.tangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".x  \n" + "mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".y  \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".y  \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" + "mov " + this._pSharedRegisters.normalVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".z  \n" + "mov " + this._pSharedRegisters.normalVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".z  \n" + "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" + "crs " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n" + "mov " + this._pSharedRegisters.tangentVarying + ".y, " + temp + ".x    \n" + "mov " + this._pSharedRegisters.bitangentVarying + ".y, " + temp + ".y  \n" + "mov " + this._pSharedRegisters.normalVarying + ".y, " + temp + ".z    \n";
                this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedTangent);
                //Compiles the fragment shader code for tangent-space normal maps.
                var t;
                var b;
                var n;
                t = this._pRegisterCache.getFreeFragmentVectorTemp();
                this._pRegisterCache.addFragmentTempUsages(t, 1);
                b = this._pRegisterCache.getFreeFragmentVectorTemp();
                this._pRegisterCache.addFragmentTempUsages(b, 1);
                n = this._pRegisterCache.getFreeFragmentVectorTemp();
                this._pRegisterCache.addFragmentTempUsages(n, 1);
                this._pFragmentCode += "nrm " + t + ".xyz, " + this._pSharedRegisters.tangentVarying + "\n" + "mov " + t + ".w, " + this._pSharedRegisters.tangentVarying + ".w	\n" + "nrm " + b + ".xyz, " + this._pSharedRegisters.bitangentVarying + "\n" + "nrm " + n + ".xyz, " + this._pSharedRegisters.normalVarying + "\n";
                //compile custom fragment code for normal calcs
                this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters) + "m33 " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalFragment + ", " + t + "\n" + "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";
                this._pRegisterCache.removeFragmentTempUsage(b);
                this._pRegisterCache.removeFragmentTempUsage(t);
                this._pRegisterCache.removeFragmentTempUsage(n);
            }
        }
        else {
            // no output, world space is enough
            this._pVertexCode += "m33 " + this._pSharedRegisters.normalVarying + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" + "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.animatedNormal + ".w\n";
            this._pFragmentCode += "nrm " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalVarying + "\n" + "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";
            if (this._pShader.tangentDependencies > 0) {
                this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "m33 " + this._pSharedRegisters.tangentVarying + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" + "mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.animatedTangent + ".w\n";
            }
        }
        if (!this._pShader.usesTangentSpace)
            this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedNormal);
    };
    /**
     * Reset all the indices to "unused".
     */
    CompilerBase.prototype.pInitRegisterIndices = function () {
        this._pShader.pInitRegisterIndices();
        this._pAnimatableAttributes = new Array("va0");
        this._pAnimationTargetRegisters = new Array("vt0");
        this._pVertexCode = "";
        this._pFragmentCode = "";
        this._pPostAnimationFragmentCode = "";
        this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.localPosition = this._pRegisterCache.getFreeVertexVectorTemp(), 1);
        //create commonly shared constant registers
        if (this._pShader.usesCommonData || this._pShader.normalDependencies > 0) {
            this._pSharedRegisters.commons = this._pRegisterCache.getFreeFragmentConstant();
            this._pShader.commonsDataIndex = this._pSharedRegisters.commons.index * 4;
        }
        //Creates the registers to contain the tangent data.
        // need to be created FIRST and in this order (for when using tangent space)
        if (this._pShader.tangentDependencies > 0 || this._pShader.outputsNormals) {
            this._pSharedRegisters.tangentInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShader.tangentBufferIndex = this._pSharedRegisters.tangentInput.index;
            this._pSharedRegisters.animatedTangent = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedTangent, 1);
            if (this._pShader.usesTangentSpace) {
                this._pSharedRegisters.bitangent = this._pRegisterCache.getFreeVertexVectorTemp();
                this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.bitangent, 1);
            }
            this._pAnimatableAttributes.push(this._pSharedRegisters.tangentInput.toString());
            this._pAnimationTargetRegisters.push(this._pSharedRegisters.animatedTangent.toString());
        }
        if (this._pShader.normalDependencies > 0) {
            this._pSharedRegisters.normalInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShader.normalBufferIndex = this._pSharedRegisters.normalInput.index;
            this._pSharedRegisters.animatedNormal = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedNormal, 1);
            this._pAnimatableAttributes.push(this._pSharedRegisters.normalInput.toString());
            this._pAnimationTargetRegisters.push(this._pSharedRegisters.animatedNormal.toString());
        }
        if (this._pShader.colorDependencies > 0) {
            this._pSharedRegisters.colorInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShader.colorBufferIndex = this._pSharedRegisters.colorInput.index;
            this._pSharedRegisters.colorVarying = this._pRegisterCache.getFreeVarying();
            this._pVertexCode += "mov " + this._pSharedRegisters.colorVarying + ", " + this._pSharedRegisters.colorInput + "\n";
        }
    };
    /**
     * Disposes all resources used by the compiler.
     */
    CompilerBase.prototype.dispose = function () {
        this._pRegisterCache.dispose();
        this._pRegisterCache = null;
        this._pSharedRegisters = null;
    };
    Object.defineProperty(CompilerBase.prototype, "vertexCode", {
        /**
         * The generated vertex code.
         */
        get: function () {
            return this._pVertexCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompilerBase.prototype, "fragmentCode", {
        /**
         * The generated fragment code.
         */
        get: function () {
            return this._pFragmentCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompilerBase.prototype, "postAnimationFragmentCode", {
        /**
         * The generated fragment code.
         */
        get: function () {
            return this._pPostAnimationFragmentCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompilerBase.prototype, "shadedTarget", {
        /**
         * The register name containing the final shaded colour.
         */
        get: function () {
            return this._pSharedRegisters.shadedTarget.toString();
        },
        enumerable: true,
        configurable: true
    });
    return CompilerBase;
})();
module.exports = CompilerBase;

},{"awayjs-renderergl/lib/shaders/ShaderRegisterCache":"awayjs-renderergl/lib/shaders/ShaderRegisterCache","awayjs-renderergl/lib/shaders/ShaderRegisterData":"awayjs-renderergl/lib/shaders/ShaderRegisterData"}],"awayjs-renderergl/lib/shaders/compilers/LightingCompiler":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CompilerBase = require("awayjs-renderergl/lib/shaders/compilers/CompilerBase");
/**
 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
var LightingCompiler = (function (_super) {
    __extends(LightingCompiler, _super);
    /**
     * Creates a new CompilerBase object.
     * @param profile The compatibility profile of the renderer.
     */
    function LightingCompiler(renderableClass, lightingPass, shaderLightingObject) {
        _super.call(this, renderableClass, lightingPass, shaderLightingObject);
        this._shaderLightingObject = shaderLightingObject;
        this._lightingPass = lightingPass;
    }
    /**
     * Compile the code for the methods.
     */
    LightingCompiler.prototype.pCompileDependencies = function () {
        _super.prototype.pCompileDependencies.call(this);
        //compile the lighting code
        if (this._shaderLightingObject.usesShadows)
            this.pCompileShadowCode();
        if (this._shaderLightingObject.usesLights) {
            this.initLightRegisters();
            this.compileLightCode();
        }
        if (this._shaderLightingObject.usesProbes)
            this.compileLightProbeCode();
        this._pVertexCode += this._lightingPass._iGetPostLightingVertexCode(this._shaderLightingObject, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._lightingPass._iGetPostLightingFragmentCode(this._shaderLightingObject, this._pRegisterCache, this._pSharedRegisters);
    };
    /**
     * Provides the code to provide shadow mapping.
     */
    LightingCompiler.prototype.pCompileShadowCode = function () {
        if (this._shaderLightingObject.normalDependencies > 0) {
            this._pSharedRegisters.shadowTarget = this._pSharedRegisters.normalFragment;
        }
        else {
            this._pSharedRegisters.shadowTarget = this._pRegisterCache.getFreeFragmentVectorTemp();
            this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.shadowTarget, 1);
        }
    };
    /**
     * Initializes constant registers to contain light data.
     */
    LightingCompiler.prototype.initLightRegisters = function () {
        // init these first so we're sure they're in sequence
        var i, len;
        if (this._dirLightVertexConstants) {
            len = this._dirLightVertexConstants.length;
            for (i = 0; i < len; ++i) {
                this._dirLightVertexConstants[i] = this._pRegisterCache.getFreeVertexConstant();
                if (this._shaderLightingObject.lightVertexConstantIndex == -1)
                    this._shaderLightingObject.lightVertexConstantIndex = this._dirLightVertexConstants[i].index * 4;
            }
        }
        if (this._pointLightVertexConstants) {
            len = this._pointLightVertexConstants.length;
            for (i = 0; i < len; ++i) {
                this._pointLightVertexConstants[i] = this._pRegisterCache.getFreeVertexConstant();
                if (this._shaderLightingObject.lightVertexConstantIndex == -1)
                    this._shaderLightingObject.lightVertexConstantIndex = this._pointLightVertexConstants[i].index * 4;
            }
        }
        len = this._dirLightFragmentConstants.length;
        for (i = 0; i < len; ++i) {
            this._dirLightFragmentConstants[i] = this._pRegisterCache.getFreeFragmentConstant();
            if (this._shaderLightingObject.lightFragmentConstantIndex == -1)
                this._shaderLightingObject.lightFragmentConstantIndex = this._dirLightFragmentConstants[i].index * 4;
        }
        len = this._pointLightFragmentConstants.length;
        for (i = 0; i < len; ++i) {
            this._pointLightFragmentConstants[i] = this._pRegisterCache.getFreeFragmentConstant();
            if (this._shaderLightingObject.lightFragmentConstantIndex == -1)
                this._shaderLightingObject.lightFragmentConstantIndex = this._pointLightFragmentConstants[i].index * 4;
        }
    };
    /**
     * Compiles the shading code for directional and point lights.
     */
    LightingCompiler.prototype.compileLightCode = function () {
        var diffuseColorReg;
        var specularColorReg;
        var lightPosReg;
        var lightDirReg;
        var vertexRegIndex = 0;
        var fragmentRegIndex = 0;
        var addSpec = this._shaderLightingObject.usesLightsForSpecular;
        var addDiff = this._shaderLightingObject.usesLightsForDiffuse;
        for (var i = 0; i < this._shaderLightingObject.numDirectionalLights; ++i) {
            if (this._shaderLightingObject.usesTangentSpace) {
                lightDirReg = this._dirLightVertexConstants[vertexRegIndex++];
                var lightVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "m33 " + lightVarying + ".xyz, " + lightDirReg + ", " + this._pSharedRegisters.animatedTangent + "\n" + "mov " + lightVarying + ".w, " + lightDirReg + ".w\n";
                lightDirReg = this._pRegisterCache.getFreeFragmentVectorTemp();
                this._pRegisterCache.addVertexTempUsages(lightDirReg, 1);
                this._pFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" + "mov " + lightDirReg + ".w, " + lightVarying + ".w\n";
            }
            else {
                lightDirReg = this._dirLightFragmentConstants[fragmentRegIndex++];
            }
            diffuseColorReg = this._dirLightFragmentConstants[fragmentRegIndex++];
            specularColorReg = this._dirLightFragmentConstants[fragmentRegIndex++];
            if (addDiff)
                this._pFragmentCode += this._lightingPass._iGetPerLightDiffuseFragmentCode(this._shaderLightingObject, lightDirReg, diffuseColorReg, this._pRegisterCache, this._pSharedRegisters);
            if (addSpec)
                this._pFragmentCode += this._lightingPass._iGetPerLightSpecularFragmentCode(this._shaderLightingObject, lightDirReg, specularColorReg, this._pRegisterCache, this._pSharedRegisters);
            if (this._shaderLightingObject.usesTangentSpace)
                this._pRegisterCache.removeVertexTempUsage(lightDirReg);
        }
        vertexRegIndex = 0;
        fragmentRegIndex = 0;
        for (var i = 0; i < this._shaderLightingObject.numPointLights; ++i) {
            if (this._shaderLightingObject.usesTangentSpace || !this._shaderLightingObject.usesGlobalPosFragment)
                lightPosReg = this._pointLightVertexConstants[vertexRegIndex++];
            else
                lightPosReg = this._pointLightFragmentConstants[fragmentRegIndex++];
            diffuseColorReg = this._pointLightFragmentConstants[fragmentRegIndex++];
            specularColorReg = this._pointLightFragmentConstants[fragmentRegIndex++];
            lightDirReg = this._pRegisterCache.getFreeFragmentVectorTemp();
            this._pRegisterCache.addFragmentTempUsages(lightDirReg, 1);
            var lightVarying;
            if (this._shaderLightingObject.usesTangentSpace) {
                lightVarying = this._pRegisterCache.getFreeVarying();
                var temp = this._pRegisterCache.getFreeVertexVectorTemp();
                this._pVertexCode += "sub " + temp + ", " + lightPosReg + ", " + this._pSharedRegisters.localPosition + "\n" + "m33 " + lightVarying + ".xyz, " + temp + ", " + this._pSharedRegisters.animatedTangent + "\n" + "mov " + lightVarying + ".w, " + this._pSharedRegisters.localPosition + ".w\n";
            }
            else if (!this._shaderLightingObject.usesGlobalPosFragment) {
                lightVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "sub " + lightVarying + ", " + lightPosReg + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
            }
            else {
                lightVarying = lightDirReg;
                this._pFragmentCode += "sub " + lightDirReg + ", " + lightPosReg + ", " + this._pSharedRegisters.globalPositionVarying + "\n";
            }
            if (this._shaderLightingObject.usesLightFallOff) {
                // calculate attenuation
                this._pFragmentCode += "dp3 " + lightDirReg + ".w, " + lightVarying + ", " + lightVarying + "\n" + "sub " + lightDirReg + ".w, " + lightDirReg + ".w, " + diffuseColorReg + ".w\n" + "mul " + lightDirReg + ".w, " + lightDirReg + ".w, " + specularColorReg + ".w\n" + "sat " + lightDirReg + ".w, " + lightDirReg + ".w\n" + "sub " + lightDirReg + ".w, " + this._pSharedRegisters.commons + ".w, " + lightDirReg + ".w\n" + "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n";
            }
            else {
                this._pFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" + "mov " + lightDirReg + ".w, " + lightVarying + ".w\n";
            }
            if (this._shaderLightingObject.lightFragmentConstantIndex == -1)
                this._shaderLightingObject.lightFragmentConstantIndex = lightPosReg.index * 4;
            if (addDiff)
                this._pFragmentCode += this._lightingPass._iGetPerLightDiffuseFragmentCode(this._shaderLightingObject, lightDirReg, diffuseColorReg, this._pRegisterCache, this._pSharedRegisters);
            if (addSpec)
                this._pFragmentCode += this._lightingPass._iGetPerLightSpecularFragmentCode(this._shaderLightingObject, lightDirReg, specularColorReg, this._pRegisterCache, this._pSharedRegisters);
            this._pRegisterCache.removeFragmentTempUsage(lightDirReg);
        }
    };
    /**
     * Compiles shading code for light probes.
     */
    LightingCompiler.prototype.compileLightProbeCode = function () {
        var weightReg;
        var weightComponents = [".x", ".y", ".z", ".w"];
        var weightRegisters = new Array();
        var i;
        var texReg;
        var addSpec = this._shaderLightingObject.usesProbesForSpecular;
        var addDiff = this._shaderLightingObject.usesProbesForDiffuse;
        if (addDiff)
            this._shaderLightingObject.lightProbeDiffuseIndices = new Array();
        if (addSpec)
            this._shaderLightingObject.lightProbeSpecularIndices = new Array();
        for (i = 0; i < this._pNumProbeRegisters; ++i) {
            weightRegisters[i] = this._pRegisterCache.getFreeFragmentConstant();
            if (i == 0)
                this._shaderLightingObject.probeWeightsIndex = weightRegisters[i].index * 4;
        }
        for (i = 0; i < this._shaderLightingObject.numLightProbes; ++i) {
            weightReg = weightRegisters[Math.floor(i / 4)].toString() + weightComponents[i % 4];
            if (addDiff) {
                texReg = this._pRegisterCache.getFreeTextureReg();
                this._shaderLightingObject.lightProbeDiffuseIndices[i] = texReg.index;
                this._pFragmentCode += this._lightingPass._iGetPerProbeDiffuseFragmentCode(this._shaderLightingObject, texReg, weightReg, this._pRegisterCache, this._pSharedRegisters);
            }
            if (addSpec) {
                texReg = this._pRegisterCache.getFreeTextureReg();
                this._shaderLightingObject.lightProbeSpecularIndices[i] = texReg.index;
                this._pFragmentCode += this._lightingPass._iGetPerProbeSpecularFragmentCode(this._shaderLightingObject, texReg, weightReg, this._pRegisterCache, this._pSharedRegisters);
            }
        }
    };
    /**
     * Reset all the indices to "unused".
     */
    LightingCompiler.prototype.pInitRegisterIndices = function () {
        _super.prototype.pInitRegisterIndices.call(this);
        this._shaderLightingObject.lightVertexConstantIndex = -1;
        this._shaderLightingObject.lightFragmentConstantIndex = -1;
        this._shaderLightingObject.probeWeightsIndex = -1;
        this._pNumProbeRegisters = Math.ceil(this._shaderLightingObject.numLightProbes / 4);
        //init light data
        if (this._shaderLightingObject.usesTangentSpace || !this._shaderLightingObject.usesGlobalPosFragment) {
            this._pointLightVertexConstants = new Array(this._shaderLightingObject.numPointLights);
            this._pointLightFragmentConstants = new Array(this._shaderLightingObject.numPointLights * 2);
        }
        else {
            this._pointLightFragmentConstants = new Array(this._shaderLightingObject.numPointLights * 3);
        }
        if (this._shaderLightingObject.usesTangentSpace) {
            this._dirLightVertexConstants = new Array(this._shaderLightingObject.numDirectionalLights);
            this._dirLightFragmentConstants = new Array(this._shaderLightingObject.numDirectionalLights * 2);
        }
        else {
            this._dirLightFragmentConstants = new Array(this._shaderLightingObject.numDirectionalLights * 3);
        }
    };
    return LightingCompiler;
})(CompilerBase);
module.exports = LightingCompiler;

},{"awayjs-renderergl/lib/shaders/compilers/CompilerBase":"awayjs-renderergl/lib/shaders/compilers/CompilerBase"}],"awayjs-renderergl/lib/sort/IEntitySorter":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/sort/RenderableMergeSort":[function(require,module,exports){
/**
 * @class away.sort.RenderableMergeSort
 */
var RenderableMergeSort = (function () {
    function RenderableMergeSort() {
    }
    RenderableMergeSort.prototype.sortBlendedRenderables = function (head) {
        var headB;
        var fast;
        var slow;
        if (!head || !head.next) {
            return head;
        }
        // split in two sublists
        slow = head;
        fast = head.next;
        while (fast) {
            fast = fast.next;
            if (fast) {
                slow = slow.next;
                fast = fast.next;
            }
        }
        headB = slow.next;
        slow.next = null;
        // recurse
        head = this.sortBlendedRenderables(head);
        headB = this.sortBlendedRenderables(headB);
        // merge sublists while respecting order
        var result;
        var curr;
        var l;
        if (!head)
            return headB;
        if (!headB)
            return head;
        while (head && headB) {
            if (head.zIndex < headB.zIndex) {
                l = head;
                head = head.next;
            }
            else {
                l = headB;
                headB = headB.next;
            }
            if (!result)
                result = l;
            else
                curr.next = l;
            curr = l;
        }
        if (head)
            curr.next = head;
        else if (headB)
            curr.next = headB;
        return result;
    };
    RenderableMergeSort.prototype.sortOpaqueRenderables = function (head) {
        var headB;
        var fast, slow;
        if (!head || !head.next) {
            return head;
        }
        // split in two sublists
        slow = head;
        fast = head.next;
        while (fast) {
            fast = fast.next;
            if (fast) {
                slow = slow.next;
                fast = fast.next;
            }
        }
        headB = slow.next;
        slow.next = null;
        // recurse
        head = this.sortOpaqueRenderables(head);
        headB = this.sortOpaqueRenderables(headB);
        // merge sublists while respecting order
        var result;
        var curr;
        var l;
        var cmp = 0;
        if (!head)
            return headB;
        if (!headB)
            return head;
        while (head && headB && head != null && headB != null) {
            // first sort per render order id (reduces program3D switches),
            // then on render object id (reduces setting props),
            // then on zIndex (reduces overdraw)
            var aid = head.renderOrderId;
            var bid = headB.renderOrderId;
            if (aid == bid) {
                var ma = head.renderId;
                var mb = headB.renderId;
                if (ma == mb) {
                    if (head.zIndex < headB.zIndex)
                        cmp = 1;
                    else
                        cmp = -1;
                }
                else if (ma > mb) {
                    cmp = 1;
                }
                else {
                    cmp = -1;
                }
            }
            else if (aid > bid) {
                cmp = 1;
            }
            else {
                cmp = -1;
            }
            if (cmp < 0) {
                l = head;
                head = head.next;
            }
            else {
                l = headB;
                headB = headB.next;
            }
            if (!result) {
                result = l;
                curr = l;
            }
            else {
                curr.next = l;
                curr = l;
            }
        }
        if (head)
            curr.next = head;
        else if (headB)
            curr.next = headB;
        return result;
    };
    return RenderableMergeSort;
})();
module.exports = RenderableMergeSort;

},{}],"awayjs-renderergl/lib/sort/RenderableNullSort":[function(require,module,exports){
/**
 * @class away.sort.NullSort
 */
var RenderableNullSort = (function () {
    function RenderableNullSort() {
    }
    RenderableNullSort.prototype.sortBlendedRenderables = function (head) {
        return head;
    };
    RenderableNullSort.prototype.sortOpaqueRenderables = function (head) {
        return head;
    };
    return RenderableNullSort;
})();
module.exports = RenderableNullSort;

},{}],"awayjs-renderergl/lib/tools/commands/Merge":[function(require,module,exports){
var AttributesBuffer = require("awayjs-core/lib/attributes/AttributesBuffer");
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var Geometry = require("awayjs-display/lib/base/Geometry");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var Mesh = require("awayjs-display/lib/entities/Mesh");
/**
 *  Class Merge merges two or more static meshes into one.<code>Merge</code>
 */
var Merge = (function () {
    /**
     * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier mesh material information or keeps its source material(s). Defaults to false.
     * If false and receiver object has multiple materials, the last material found in receiver submeshes is applied to the merged submesh(es).
     * @param    disposeSources  [optional]    Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
     * If true, only receiver geometry and resulting mesh are kept in  memory.
     * @param    objectSpace     [optional]    Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
     */
    function Merge(keepMaterial, disposeSources, objectSpace) {
        if (keepMaterial === void 0) { keepMaterial = false; }
        if (disposeSources === void 0) { disposeSources = false; }
        if (objectSpace === void 0) { objectSpace = false; }
        this._keepMaterial = keepMaterial;
        this._disposeSources = disposeSources;
        this._objectSpace = objectSpace;
    }
    Object.defineProperty(Merge.prototype, "disposeSources", {
        get: function () {
            return this._disposeSources;
        },
        /**
         * Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
         */
        set: function (b) {
            this._disposeSources = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Merge.prototype, "keepMaterial", {
        get: function () {
            return this._keepMaterial;
        },
        /**
         * Determines if the material source(s) used for the merging are disposed. Defaults to false.
         */
        set: function (b) {
            this._keepMaterial = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Merge.prototype, "objectSpace", {
        get: function () {
            return this._objectSpace;
        },
        /**
         * Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
         */
        set: function (b) {
            this._objectSpace = b;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Merges all the children of a container into a single Mesh. If no Mesh object is found, method returns the receiver without modification.
     *
     * @param    receiver           The Mesh to receive the merged contents of the container.
     * @param    objectContainer    The DisplayObjectContainer holding the meshes to be mergd.
     *
     * @return The merged Mesh instance.
     */
    Merge.prototype.applyToContainer = function (receiver, objectContainer) {
        this.reset();
        //collect container meshes
        this.parseContainer(receiver, objectContainer);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    /**
     * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
     *
     * @param    receiver    The Mesh to receive the merged contents of the meshes.
     * @param    meshes      A series of Meshes to be merged with the reciever mesh.
     */
    Merge.prototype.applyToMeshes = function (receiver, meshes) {
        this.reset();
        if (!meshes.length)
            return;
        for (var i = 0; i < meshes.length; i++)
            if (meshes[i] != receiver)
                this.collect(meshes[i], this._disposeSources);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    /**
     *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
     *
     * @param    receiver    The Mesh to receive the merged contents of both meshes.
     * @param    mesh        The Mesh to be merged with the receiver mesh
     */
    Merge.prototype.apply = function (receiver, mesh) {
        this.reset();
        //collect mesh
        this.collect(mesh, this._disposeSources);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    Merge.prototype.reset = function () {
        this._toDispose = new Array();
        this._geomVOs = new Array();
    };
    Merge.prototype.merge = function (destMesh, dispose) {
        var i /*uint*/;
        var subIdx /*uint*/;
        var oldGeom;
        var destGeom;
        var useSubMaterials;
        oldGeom = destMesh.geometry;
        destGeom = destMesh.geometry = new Geometry();
        subIdx = destMesh.subMeshes.length;
        // Only apply materials directly to sub-meshes if necessary,
        // i.e. if there is more than one material available.
        useSubMaterials = (this._geomVOs.length > 1);
        for (i = 0; i < this._geomVOs.length; i++) {
            var s /*uint*/;
            var data;
            var sub = new TriangleSubGeometry(new AttributesBuffer());
            sub.autoDeriveNormals = false;
            sub.autoDeriveTangents = false;
            data = this._geomVOs[i];
            sub.setIndices(data.indices);
            sub.setPositions(data.vertices);
            sub.setNormals(data.normals);
            sub.setTangents(data.tangents);
            sub.setUVs(data.uvs);
            destGeom.addSubGeometry(sub);
            if (this._keepMaterial && useSubMaterials)
                destMesh.subMeshes[subIdx].material = data.material;
        }
        if (this._keepMaterial && !useSubMaterials && this._geomVOs.length)
            destMesh.material = this._geomVOs[0].material;
        if (dispose) {
            var m;
            var len = this._toDispose.length;
            for (var i; i < len; i++) {
                m = this._toDispose[i];
                m.geometry.dispose();
                m.dispose();
            }
            //dispose of the original receiver geometry
            oldGeom.dispose();
        }
        this._toDispose = null;
    };
    Merge.prototype.collect = function (mesh, dispose) {
        if (mesh.geometry) {
            var subIdx /*uint*/;
            var subGeometries = mesh.geometry.subGeometries;
            var calc /*uint*/;
            for (subIdx = 0; subIdx < subGeometries.length; subIdx++) {
                var i /*uint*/;
                var len /*uint*/;
                var iIdx /*uint*/, vIdx /*uint*/, nIdx /*uint*/, tIdx /*uint*/, uIdx /*uint*/;
                var indexOffset /*uint*/;
                var subGeom;
                var vo;
                var vertices;
                var normals;
                var tangents;
                var ind, pd, nd, td, ud;
                subGeom = subGeometries[subIdx];
                pd = subGeom.positions.get(subGeom.numVertices);
                nd = subGeom.normals.get(subGeom.numVertices);
                td = subGeom.tangents.get(subGeom.numVertices);
                ud = subGeom.uvs.get(subGeom.numVertices);
                // Get (or create) a VO for this material
                vo = this.getSubGeomData(mesh.subMeshes[subIdx].material || mesh.material);
                // Vertices and normals are copied to temporary vectors, to be transformed
                // before concatenated onto those of the data. This is unnecessary if no
                // transformation will be performed, i.e. for object space merging.
                vertices = (this._objectSpace) ? vo.vertices : new Array();
                normals = (this._objectSpace) ? vo.normals : new Array();
                tangents = (this._objectSpace) ? vo.tangents : new Array();
                // Copy over vertex attributes
                vIdx = vertices.length;
                nIdx = normals.length;
                tIdx = tangents.length;
                uIdx = vo.uvs.length;
                len = subGeom.numVertices;
                for (i = 0; i < len; i++) {
                    calc = i * 3;
                    // Position
                    vertices[vIdx++] = pd[calc];
                    vertices[vIdx++] = pd[calc + 1];
                    vertices[vIdx++] = pd[calc + 2];
                    // Normal
                    normals[nIdx++] = nd[calc];
                    normals[nIdx++] = nd[calc + 1];
                    normals[nIdx++] = nd[calc + 2];
                    // Tangent
                    tangents[tIdx++] = td[calc];
                    tangents[tIdx++] = td[calc + 1];
                    tangents[tIdx++] = td[calc + 2];
                    // UV
                    vo.uvs[uIdx++] = ud[i * 2];
                    vo.uvs[uIdx++] = ud[i * 2 + 1];
                }
                // Copy over triangle indices
                indexOffset = (!this._objectSpace) ? vo.vertices.length / 3 : 0;
                iIdx = vo.indices.length;
                len = subGeom.numElements;
                ind = subGeom.indices.get(len);
                for (i = 0; i < len; i++) {
                    calc = i * 3;
                    vo.indices[iIdx++] = ind[calc] + indexOffset;
                    vo.indices[iIdx++] = ind[calc + 1] + indexOffset;
                    vo.indices[iIdx++] = ind[calc + 2] + indexOffset;
                }
                if (!this._objectSpace) {
                    mesh.sceneTransform.transformVectors(vertices, vertices);
                    Matrix3DUtils.deltaTransformVectors(mesh.sceneTransform, normals, normals);
                    Matrix3DUtils.deltaTransformVectors(mesh.sceneTransform, tangents, tangents);
                    // Copy vertex data from temporary (transformed) vectors
                    vIdx = vo.vertices.length;
                    nIdx = vo.normals.length;
                    tIdx = vo.tangents.length;
                    len = vertices.length;
                    for (i = 0; i < len; i++) {
                        vo.vertices[vIdx++] = vertices[i];
                        vo.normals[nIdx++] = normals[i];
                        vo.tangents[tIdx++] = tangents[i];
                    }
                }
            }
            if (dispose)
                this._toDispose.push(mesh);
        }
    };
    Merge.prototype.getSubGeomData = function (material) {
        var data;
        if (this._keepMaterial) {
            var i /*uint*/;
            var len /*uint*/;
            len = this._geomVOs.length;
            for (i = 0; i < len; i++) {
                if (this._geomVOs[i].material == material) {
                    data = this._geomVOs[i];
                    break;
                }
            }
        }
        else if (this._geomVOs.length) {
            // If materials are not to be kept, all data can be
            // put into a single VO, so return that one.
            data = this._geomVOs[0];
        }
        // No data (for this material) found, create new.
        if (!data) {
            data = new GeometryVO();
            data.vertices = new Array();
            data.normals = new Array();
            data.tangents = new Array();
            data.uvs = new Array();
            data.indices = new Array();
            data.material = material;
            this._geomVOs.push(data);
        }
        return data;
    };
    Merge.prototype.parseContainer = function (receiver, object) {
        var child;
        var i /*uint*/;
        if (object instanceof Mesh && object != receiver)
            this.collect(object, this._disposeSources);
        for (i = 0; i < object.numChildren; ++i) {
            child = object.getChildAt(i);
            this.parseContainer(receiver, child);
        }
    };
    return Merge;
})();
var GeometryVO = (function () {
    function GeometryVO() {
    }
    return GeometryVO;
})();
module.exports = Merge;

},{"awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-display/lib/base/Geometry":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-display/lib/entities/Mesh":undefined}],"awayjs-renderergl/lib/tools/data/ParticleGeometryTransform":[function(require,module,exports){
/**
 * ...
 */
var ParticleGeometryTransform = (function () {
    function ParticleGeometryTransform() {
    }
    Object.defineProperty(ParticleGeometryTransform.prototype, "vertexTransform", {
        get: function () {
            return this._defaultVertexTransform;
        },
        set: function (value) {
            this._defaultVertexTransform = value;
            this._defaultInvVertexTransform = value.clone();
            this._defaultInvVertexTransform.invert();
            this._defaultInvVertexTransform.transpose();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGeometryTransform.prototype, "UVTransform", {
        get: function () {
            return this._defaultUVTransform;
        },
        set: function (value) {
            this._defaultUVTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGeometryTransform.prototype, "invVertexTransform", {
        get: function () {
            return this._defaultInvVertexTransform;
        },
        enumerable: true,
        configurable: true
    });
    return ParticleGeometryTransform;
})();
module.exports = ParticleGeometryTransform;

},{}],"awayjs-renderergl/lib/utils/ParticleGeometryHelper":[function(require,module,exports){
var AttributesBuffer = require("awayjs-core/lib/attributes/AttributesBuffer");
var Point = require("awayjs-core/lib/geom/Point");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ParticleData = require("awayjs-renderergl/lib/animators/data/ParticleData");
var ParticleGeometry = require("awayjs-renderergl/lib/base/ParticleGeometry");
/**
 * ...
 */
var ParticleGeometryHelper = (function () {
    function ParticleGeometryHelper() {
    }
    ParticleGeometryHelper.generateGeometry = function (geometries, transforms) {
        if (transforms === void 0) { transforms = null; }
        var indicesVector = new Array() /*uint*/;
        var positionsVector = new Array();
        var normalsVector = new Array();
        var tangentsVector = new Array();
        var uvsVector = new Array();
        var vertexCounters = new Array() /*uint*/;
        var particles = new Array();
        var subGeometries = new Array();
        var numParticles = geometries.length;
        var sourceSubGeometries;
        var sourceSubGeometry;
        var numSubGeometries /*uint*/;
        var indices /*uint*/;
        var positions;
        var normals;
        var tangents;
        var uvs;
        var vertexCounter /*uint*/;
        var subGeometry;
        var i /*int*/;
        var j /*int*/;
        var sub2SubMap = new Array() /*int*/;
        var tempVertex = new Vector3D;
        var tempNormal = new Vector3D;
        var tempTangents = new Vector3D;
        var tempUV = new Point;
        for (i = 0; i < numParticles; i++) {
            sourceSubGeometries = geometries[i].subGeometries;
            numSubGeometries = sourceSubGeometries.length;
            for (var srcIndex = 0; srcIndex < numSubGeometries; srcIndex++) {
                //create a different particle subgeometry group for each source subgeometry in a particle.
                if (sub2SubMap.length <= srcIndex) {
                    sub2SubMap.push(subGeometries.length);
                    indicesVector.push(new Array());
                    positionsVector.push(new Array());
                    normalsVector.push(new Array());
                    tangentsVector.push(new Array());
                    uvsVector.push(new Array());
                    subGeometries.push(new TriangleSubGeometry(new AttributesBuffer()));
                    vertexCounters.push(0);
                }
                sourceSubGeometry = sourceSubGeometries[srcIndex];
                //add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
                if (sourceSubGeometry.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGeometryHelper.MAX_VERTEX) {
                    //update submap and add new subgeom vectors
                    sub2SubMap[srcIndex] = subGeometries.length;
                    indicesVector.push(new Array());
                    positionsVector.push(new Array());
                    normalsVector.push(new Array());
                    tangentsVector.push(new Array());
                    uvsVector.push(new Array());
                    subGeometries.push(new TriangleSubGeometry(new AttributesBuffer()));
                    vertexCounters.push(0);
                }
                j = sub2SubMap[srcIndex];
                //select the correct vector
                indices = indicesVector[j];
                positions = positionsVector[j];
                normals = normalsVector[j];
                tangents = tangentsVector[j];
                uvs = uvsVector[j];
                vertexCounter = vertexCounters[j];
                subGeometry = subGeometries[j];
                var particleData = new ParticleData();
                particleData.numVertices = sourceSubGeometry.numVertices;
                particleData.startVertexIndex = vertexCounter;
                particleData.particleIndex = i;
                particleData.subGeometry = subGeometry;
                particles.push(particleData);
                vertexCounters[j] += sourceSubGeometry.numVertices;
                var k /*int*/;
                var tempLen /*int*/;
                var compact = sourceSubGeometry;
                var product /*uint*/;
                var sourcePositions;
                var sourceNormals;
                var sourceTangents;
                var sourceUVs;
                if (compact) {
                    tempLen = compact.numVertices;
                    sourcePositions = compact.positions.get(tempLen);
                    sourceNormals = compact.normals.get(tempLen);
                    sourceTangents = compact.tangents.get(tempLen);
                    sourceUVs = compact.uvs.get(tempLen);
                    if (transforms) {
                        var particleGeometryTransform = transforms[i];
                        var vertexTransform = particleGeometryTransform.vertexTransform;
                        var invVertexTransform = particleGeometryTransform.invVertexTransform;
                        var UVTransform = particleGeometryTransform.UVTransform;
                        for (k = 0; k < tempLen; k++) {
                            /*
                             * 0 - 2: vertex position X, Y, Z
                             * 3 - 5: normal X, Y, Z
                             * 6 - 8: tangent X, Y, Z
                             * 9 - 10: U V
                             * 11 - 12: Secondary U V*/
                            product = k * 3;
                            tempVertex.x = sourcePositions[product];
                            tempVertex.y = sourcePositions[product + 1];
                            tempVertex.z = sourcePositions[product + 2];
                            tempNormal.x = sourceNormals[product];
                            tempNormal.y = sourceNormals[product + 1];
                            tempNormal.z = sourceNormals[product + 2];
                            tempTangents.x = sourceTangents[product];
                            tempTangents.y = sourceTangents[product + 1];
                            tempTangents.z = sourceTangents[product + 2];
                            tempUV.x = sourceUVs[k * 2];
                            tempUV.y = sourceUVs[k * 2 + 1];
                            if (vertexTransform) {
                                tempVertex = vertexTransform.transformVector(tempVertex);
                                tempNormal = invVertexTransform.deltaTransformVector(tempNormal);
                                tempTangents = invVertexTransform.deltaTransformVector(tempNormal);
                            }
                            if (UVTransform)
                                tempUV = UVTransform.transformPoint(tempUV);
                            //this is faster than that only push one data
                            positions.push(tempVertex.x, tempVertex.y, tempVertex.z);
                            normals.push(tempNormal.x, tempNormal.y, tempNormal.z);
                            tangents.push(tempTangents.x, tempTangents.y, tempTangents.z);
                            uvs.push(tempUV.x, tempUV.y);
                        }
                    }
                    else {
                        for (k = 0; k < tempLen; k++) {
                            product = k * 3;
                            //this is faster than that only push one data
                            positions.push(sourcePositions[product], sourcePositions[product + 1], sourcePositions[product + 2]);
                            normals.push(sourceNormals[product], sourceNormals[product + 1], sourceNormals[product + 2]);
                            tangents.push(sourceTangents[product], sourceTangents[product + 1], sourceTangents[product + 2]);
                            uvs.push(sourceUVs[k * 2], sourceUVs[k * 2 + 1]);
                        }
                    }
                }
                else {
                }
                tempLen = sourceSubGeometry.numElements;
                var sourceIndices = sourceSubGeometry.indices.get(tempLen);
                for (k = 0; k < tempLen; k++) {
                    product = k * 3;
                    indices.push(sourceIndices[product] + vertexCounter, sourceIndices[product + 1] + vertexCounter, sourceIndices[product + 2] + vertexCounter);
                }
            }
        }
        var particleGeometry = new ParticleGeometry();
        particleGeometry.particles = particles;
        particleGeometry.numParticles = numParticles;
        numParticles = subGeometries.length;
        for (i = 0; i < numParticles; i++) {
            subGeometry = subGeometries[i];
            subGeometry.autoDeriveNormals = false;
            subGeometry.autoDeriveTangents = false;
            subGeometry.setIndices(indicesVector[i]);
            subGeometry.setPositions(positionsVector[i]);
            subGeometry.setNormals(normalsVector[i]);
            subGeometry.setTangents(tangentsVector[i]);
            subGeometry.setUVs(uvsVector[i]);
            particleGeometry.addSubGeometry(subGeometry);
        }
        return particleGeometry;
    };
    ParticleGeometryHelper.MAX_VERTEX = 65535;
    return ParticleGeometryHelper;
})();
module.exports = ParticleGeometryHelper;

},{"awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/animators/data/ParticleData":"awayjs-renderergl/lib/animators/data/ParticleData","awayjs-renderergl/lib/base/ParticleGeometry":"awayjs-renderergl/lib/base/ParticleGeometry"}],"awayjs-renderergl/lib/utils/PerspectiveMatrix3D":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
/**
 *
 */
var PerspectiveMatrix3D = (function (_super) {
    __extends(PerspectiveMatrix3D, _super);
    function PerspectiveMatrix3D(v) {
        if (v === void 0) { v = null; }
        _super.call(this, v);
    }
    PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
        var yScale = 1 / Math.tan(fieldOfViewY / 2);
        var xScale = yScale / aspectRatio;
        this.rawData[0] = xScale;
        this.rawData[1] = 0.0;
        this.rawData[2] = 0.0;
        this.rawData[3] = 0.0;
        this.rawData[4] = 0.0;
        this.rawData[5] = yScale;
        this.rawData[6] = 0.0;
        this.rawData[7] = 0.0;
        this.rawData[8] = 0.0;
        this.rawData[9] = 0.0;
        this.rawData[10] = zFar / (zFar - zNear);
        this.rawData[11] = 1.0;
        this.rawData[12] = 0.0;
        this.rawData[13] = 0.0;
        this.rawData[14] = (zNear * zFar) / (zNear - zFar);
        this.rawData[15] = 0.0;
    };
    return PerspectiveMatrix3D;
})(Matrix3D);
module.exports = PerspectiveMatrix3D;

},{"awayjs-core/lib/geom/Matrix3D":undefined}],"awayjs-renderergl/lib/vos/CurveSubGeometryVO":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLDrawMode = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var SubGeometryVOBase = require("awayjs-renderergl/lib/vos/SubGeometryVOBase");
/**
 *
 * @class away.pool.CurveSubGeometryVO
 */
var CurveSubGeometryVO = (function (_super) {
    __extends(CurveSubGeometryVO, _super);
    function CurveSubGeometryVO(curveSubGeometry, stage) {
        _super.call(this, curveSubGeometry, stage);
        this._curveSubGeometry = curveSubGeometry;
    }
    CurveSubGeometryVO.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._curveSubGeometry.positions));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._curveSubGeometry.curves));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._curveSubGeometry.uvs));
        this._curveSubGeometry = null;
    };
    CurveSubGeometryVO.prototype._render = function (shader) {
        if (shader.uvBufferIndex >= 0)
            this.activateVertexBufferVO(shader.uvBufferIndex, this._curveSubGeometry.uvs);
        this.activateVertexBufferVO(0, this._curveSubGeometry.positions);
        this.activateVertexBufferVO(1, this._curveSubGeometry.curves);
        _super.prototype._render.call(this, shader);
    };
    CurveSubGeometryVO.prototype._drawElements = function (firstIndex, numIndices) {
        this.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, firstIndex, numIndices);
    };
    CurveSubGeometryVO.prototype._drawArrays = function (firstVertex, numVertices) {
        this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderableOwner
     * @param level
     * @param indexOffset
     * @returns {away.pool.CurveSubMeshRenderable}
     * @protected
     */
    CurveSubGeometryVO.prototype._pGetOverflowSubGeometry = function () {
        return new CurveSubGeometryVO(this._curveSubGeometry, this._stage);
    };
    return CurveSubGeometryVO;
})(SubGeometryVOBase);
module.exports = CurveSubGeometryVO;

},{"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-renderergl/lib/vos/SubGeometryVOBase":"awayjs-renderergl/lib/vos/SubGeometryVOBase","awayjs-stagegl/lib/base/ContextGLDrawMode":undefined}],"awayjs-renderergl/lib/vos/ITextureVOClass":[function(require,module,exports){

},{}],"awayjs-renderergl/lib/vos/LineSubGeometryVO":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLDrawMode = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var SubGeometryVOBase = require("awayjs-renderergl/lib/vos/SubGeometryVOBase");
/**
 *
 * @class away.pool.LineSubGeometryVO
 */
var LineSubGeometryVO = (function (_super) {
    __extends(LineSubGeometryVO, _super);
    function LineSubGeometryVO(lineSubGeometry, stage) {
        _super.call(this, lineSubGeometry, stage);
        this._lineSubGeometry = lineSubGeometry;
    }
    LineSubGeometryVO.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._lineSubGeometry.positions));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._lineSubGeometry.thickness));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._lineSubGeometry.colors));
        this._lineSubGeometry = null;
    };
    LineSubGeometryVO.prototype._render = function (shader) {
        if (shader.colorBufferIndex >= 0)
            this.activateVertexBufferVO(shader.colorBufferIndex, this._lineSubGeometry.colors);
        this.activateVertexBufferVO(0, this._lineSubGeometry.positions, 3);
        this.activateVertexBufferVO(1, this._lineSubGeometry.positions, 3, 12);
        this.activateVertexBufferVO(2, this._lineSubGeometry.thickness);
        _super.prototype._render.call(this, shader);
    };
    LineSubGeometryVO.prototype._drawElements = function (firstIndex, numIndices) {
        this.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, 0, numIndices);
    };
    LineSubGeometryVO.prototype._drawArrays = function (firstVertex, numVertices) {
        this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderableOwner
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubMeshRenderable}
     * @protected
     */
    LineSubGeometryVO.prototype._pGetOverflowSubGeometry = function () {
        return new LineSubGeometryVO(this._lineSubGeometry, this._stage);
    };
    return LineSubGeometryVO;
})(SubGeometryVOBase);
module.exports = LineSubGeometryVO;

},{"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-renderergl/lib/vos/SubGeometryVOBase":"awayjs-renderergl/lib/vos/SubGeometryVOBase","awayjs-stagegl/lib/base/ContextGLDrawMode":undefined}],"awayjs-renderergl/lib/vos/Single2DTextureVO":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MappingMode = require("awayjs-display/lib/textures/MappingMode");
var TextureVOBase = require("awayjs-renderergl/lib/vos/TextureVOBase");
/**
 *
 * @class away.pool.Single2DTextureVO
 */
var Single2DTextureVO = (function (_super) {
    __extends(Single2DTextureVO, _super);
    function Single2DTextureVO(single2DTexture, shader) {
        _super.call(this, single2DTexture, shader);
        this._single2DTexture = single2DTexture;
    }
    Single2DTextureVO.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._single2DTexture = null;
    };
    /**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The uv coordinate vector with which to sample the texture map.
     * @returns {string}
     * @private
     */
    Single2DTextureVO.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        var code = "";
        var wrap = "wrap";
        var format = ""; //this.getFormatString(this._single2DTexture.image2D);
        var filter = "linear,miplinear";
        var temp;
        //modify depending on mapping mode
        if (this._single2DTexture.mappingMode == MappingMode.RADIAL_GRADIENT) {
            temp = regCache.getFreeFragmentVectorTemp();
            code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
            code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
            code += "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n";
            code += "sub " + temp + ".y, " + temp + ".y, " + temp + ".y\n";
            code += "sqt " + temp + ".x, " + temp + ".x, " + temp + ".x\n";
            inputReg = temp;
        }
        //handles texture atlasing
        if (this._shader.useImageRect) {
            var samplerReg = regCache.getFreeFragmentConstant();
            this._samplerIndex = samplerReg.index * 4;
            temp = regCache.getFreeFragmentVectorTemp();
            code += "mul " + temp + ", " + inputReg + ", " + samplerReg + ".xy\n";
            code += "add " + temp + ", " + temp + ", " + samplerReg + ".zw\n";
            inputReg = temp;
        }
        this._imageIndex = this._shader.getImageIndex(this._single2DTexture, 0);
        var textureReg = this.getTextureReg(this._imageIndex, regCache, sharedReg);
        this._textureIndex = textureReg.index;
        code += "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <2d," + filter + "," + format + wrap + ">\n";
        return code;
    };
    Single2DTextureVO.prototype.activate = function (render) {
        var sampler = render.samplers[this._imageIndex];
        sampler.activate(this._textureIndex);
        var image = render.images[this._imageIndex];
        image.activate(this._textureIndex, sampler._sampler.mipmap);
        if (this._shader.useImageRect) {
            var index = this._samplerIndex;
            var data = this._shader.fragmentConstantData;
            if (!sampler._sampler.imageRect) {
                data[index] = 1;
                data[index + 1] = 1;
                data[index + 2] = 0;
                data[index + 3] = 0;
            }
            else {
                var renderImage = image._asset;
                data[index] = sampler._sampler.imageRect.width;
                data[index + 1] = sampler._sampler.imageRect.height;
                data[index + 2] = sampler._sampler.imageRect.x;
                data[index + 3] = sampler._sampler.imageRect.y;
            }
        }
    };
    Single2DTextureVO.prototype._setRenderState = function (renderable) {
        var sampler = renderable.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        var image = renderable.images[this._imageIndex];
        if (image)
            image.activate(this._textureIndex, sampler._sampler.mipmap);
        if (this._shader.useImageRect && sampler) {
            var index = this._samplerIndex;
            var data = this._shader.fragmentConstantData;
            if (!sampler._sampler.imageRect) {
                data[index] = 1;
                data[index + 1] = 1;
                data[index + 2] = 0;
                data[index + 3] = 0;
            }
            else {
                var renderableImage = (image ? image._asset : renderable.render.images[this._imageIndex]._asset);
                data[index] = sampler._sampler.imageRect.width;
                data[index + 1] = sampler._sampler.imageRect.height;
                data[index + 2] = sampler._sampler.imageRect.x;
                data[index + 3] = sampler._sampler.imageRect.y;
            }
        }
    };
    return Single2DTextureVO;
})(TextureVOBase);
module.exports = Single2DTextureVO;

},{"awayjs-display/lib/textures/MappingMode":undefined,"awayjs-renderergl/lib/vos/TextureVOBase":"awayjs-renderergl/lib/vos/TextureVOBase"}],"awayjs-renderergl/lib/vos/SingleCubeTextureVO":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TextureVOBase = require("awayjs-renderergl/lib/vos/TextureVOBase");
/**
 *
 * @class away.pool.TextureDataBase
 */
var SingleCubeTextureVO = (function (_super) {
    __extends(SingleCubeTextureVO, _super);
    function SingleCubeTextureVO(singleCubeTexture, shader) {
        _super.call(this, singleCubeTexture, shader);
        this._singleCubeTexture = singleCubeTexture;
    }
    SingleCubeTextureVO.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._singleCubeTexture = null;
    };
    SingleCubeTextureVO.prototype._iIncludeDependencies = function (includeInput) {
        if (includeInput === void 0) { includeInput = true; }
        if (includeInput)
            this._shader.usesLocalPosFragment = true;
    };
    /**
     *
     * @param shader
     * @param regCache
     * @param targetReg The register in which to store the sampled colour.
     * @param uvReg The direction vector with which to sample the cube map.
     * @returns {string}
     * @private
     */
    SingleCubeTextureVO.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        var format = ""; //this.getFormatString(this._singleCubeTexture.imageCube);
        var filter = "linear,miplinear";
        this._imageIndex = this._shader.getImageIndex(this._singleCubeTexture, 0);
        var textureReg = this.getTextureReg(this._imageIndex, regCache, sharedReg);
        this._textureIndex = textureReg.index;
        return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <cube," + format + filter + ">\n";
    };
    SingleCubeTextureVO.prototype.activate = function (render) {
        var sampler = render.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        if (render.images[this._imageIndex])
            render.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
    };
    SingleCubeTextureVO.prototype._setRenderState = function (renderable) {
        var sampler = renderable.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        if (renderable.images[this._imageIndex] && sampler)
            renderable.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
    };
    return SingleCubeTextureVO;
})(TextureVOBase);
module.exports = SingleCubeTextureVO;

},{"awayjs-renderergl/lib/vos/TextureVOBase":"awayjs-renderergl/lib/vos/TextureVOBase"}],"awayjs-renderergl/lib/vos/SubGeometryVOBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var SubGeometryUtils = require("awayjs-display/lib/utils/SubGeometryUtils");
/**
 *
 * @class away.pool.SubGeometryVOBaseBase
 */
var SubGeometryVOBase = (function (_super) {
    __extends(SubGeometryVOBase, _super);
    function SubGeometryVOBase(subGeometry, stage) {
        var _this = this;
        _super.call(this, subGeometry, stage);
        this.usages = 0;
        this._vertices = new Object();
        this._verticesUpdated = new Object();
        this._indexMappings = Array();
        this._numIndices = 0;
        this._subGeometry = subGeometry;
        this._stage = stage;
        this._onInvalidateIndicesDelegate = function (event) { return _this._onInvalidateIndices(event); };
        this._onClearIndicesDelegate = function (event) { return _this._onClearIndices(event); };
        this._onInvalidateVerticesDelegate = function (event) { return _this._onInvalidateVertices(event); };
        this._onClearVerticesDelegate = function (event) { return _this._onClearVertices(event); };
        this._subGeometry.addEventListener(SubGeometryEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
        this._subGeometry.addEventListener(SubGeometryEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);
        this._subGeometry.addEventListener(SubGeometryEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
        this._subGeometry.addEventListener(SubGeometryEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
    }
    Object.defineProperty(SubGeometryVOBase.prototype, "subGeometry", {
        get: function () {
            return this._subGeometry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubGeometryVOBase.prototype, "numIndices", {
        /**
         *
         */
        get: function () {
            return this._numIndices;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    SubGeometryVOBase.prototype.getIndexMappings = function () {
        if (!this._indicesUpdated)
            this._updateIndices();
        return this._indexMappings;
    };
    /**
     *
     */
    SubGeometryVOBase.prototype.getIndexBufferVO = function () {
        if (!this._indicesUpdated)
            this._updateIndices();
        return this._indices;
    };
    /**
     *
     */
    SubGeometryVOBase.prototype.getVertexBufferVO = function (attributesView) {
        //first check if indices need updating which may affect vertices
        if (!this._indicesUpdated)
            this._updateIndices();
        var bufferId = attributesView.buffer.id;
        if (!this._verticesUpdated[bufferId])
            this._updateVertices(attributesView);
        return this._vertices[bufferId];
    };
    /**
     *
     */
    SubGeometryVOBase.prototype.activateVertexBufferVO = function (index, attributesView, dimensions, offset) {
        if (dimensions === void 0) { dimensions = 0; }
        if (offset === void 0) { offset = 0; }
        this.getVertexBufferVO(attributesView).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset);
    };
    /**
     *
     */
    SubGeometryVOBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._subGeometry.removeEventListener(SubGeometryEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
        this._subGeometry.removeEventListener(SubGeometryEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);
        this._subGeometry.removeEventListener(SubGeometryEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
        this._subGeometry.removeEventListener(SubGeometryEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
        this._onClearIndices(new SubGeometryEvent(SubGeometryEvent.CLEAR_INDICES, this._subGeometry.indices));
        this._subGeometry = null;
        if (this._overflow) {
            this._overflow.onClear(event);
            this._overflow = null;
        }
    };
    SubGeometryVOBase.prototype._iGetFragmentCode = function (shader, targetReg, regCache, inputReg) {
        if (inputReg === void 0) { inputReg = null; }
        throw new AbstractMethodError();
    };
    SubGeometryVOBase.prototype._iRender = function (shader) {
        if (!this._verticesUpdated)
            this._updateIndices();
        this._render(shader);
        if (this._overflow)
            this._overflow._iRender(shader);
    };
    SubGeometryVOBase.prototype._render = function (shader) {
        if (this._indices)
            this._drawElements(0, this._numIndices);
        else
            this._drawArrays(0, this._numVertices);
    };
    SubGeometryVOBase.prototype._drawElements = function (firstIndex, numIndices) {
        throw new AbstractMethodError();
    };
    SubGeometryVOBase.prototype._drawArrays = function (firstVertex, numVertices) {
        throw new AbstractMethodError();
    };
    /**
     * //TODO
     *
     * @private
     */
    SubGeometryVOBase.prototype._updateIndices = function (indexOffset) {
        if (indexOffset === void 0) { indexOffset = 0; }
        var indices = this._subGeometry.indices;
        if (indices) {
            this._indices = this._pool.getAbstraction(SubGeometryUtils.getSubIndices(indices, this._subGeometry.numVertices, this._indexMappings, indexOffset));
            this._numIndices = this._indices._attributesBuffer.count * indices.dimensions;
        }
        else {
            this._indices = null;
            this._numIndices = 0;
            this._indexMappings = Array();
        }
        indexOffset += this._numIndices;
        //check if there is more to split
        if (indices && indexOffset < indices.count * this._subGeometry.indices.dimensions) {
            if (!this._overflow)
                this._overflow = this._pGetOverflowSubGeometry();
            this._overflow._updateIndices(indexOffset);
        }
        else if (this._overflow) {
            this._overflow.onClear(new AssetEvent(AssetEvent.CLEAR, this._subGeometry));
            this._overflow = null;
        }
        this._indicesUpdated = true;
        //invalidate vertices if index mappings exist
        if (this._indexMappings.length)
            for (var key in this._verticesUpdated)
                this._verticesUpdated[key] = false;
    };
    /**
     * //TODO
     *
     * @param attributesView
     * @private
     */
    SubGeometryVOBase.prototype._updateVertices = function (attributesView) {
        this._numVertices = attributesView.count;
        var bufferId = attributesView.buffer.id;
        this._vertices[bufferId] = this._pool.getAbstraction(SubGeometryUtils.getSubVertices(attributesView.buffer, this._indexMappings));
        this._verticesUpdated[bufferId] = true;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    SubGeometryVOBase.prototype._onInvalidateIndices = function (event) {
        if (!event.attributesView)
            return;
        this._indicesUpdated = false;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    SubGeometryVOBase.prototype._onClearIndices = function (event) {
        if (!event.attributesView)
            return;
        this._indices.onClear(new AssetEvent(AssetEvent.CLEAR, event.attributesView));
        this._indices = null;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    SubGeometryVOBase.prototype._onInvalidateVertices = function (event) {
        if (!event.attributesView)
            return;
        var bufferId = event.attributesView.buffer.id;
        this._verticesUpdated[bufferId] = false;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    SubGeometryVOBase.prototype._onClearVertices = function (event) {
        if (!event.attributesView)
            return;
        var bufferId = event.attributesView.buffer.id;
        if (this._vertices[bufferId]) {
            this._vertices[bufferId].onClear(new AssetEvent(AssetEvent.CLEAR, event.attributesView));
            delete this._vertices[bufferId];
        }
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderableOwner
     * @param level
     * @param indexOffset
     * @returns {away.pool.TriangleSubMeshRenderable}
     * @protected
     */
    SubGeometryVOBase.prototype._pGetOverflowSubGeometry = function () {
        throw new AbstractMethodError();
    };
    return SubGeometryVOBase;
})(AbstractionBase);
module.exports = SubGeometryVOBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-display/lib/utils/SubGeometryUtils":undefined}],"awayjs-renderergl/lib/vos/TextureVOBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
var ContextGLTextureFormat = require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
/**
 *
 * @class away.pool.TextureVOBaseBase
 */
var TextureVOBase = (function (_super) {
    __extends(TextureVOBase, _super);
    function TextureVOBase(texture, shader) {
        _super.call(this, texture, shader);
        this._texture = texture;
        this._shader = shader;
        this._stage = shader._stage;
    }
    /**
     *
     */
    TextureVOBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._texture = null;
        this._shader = null;
        this._stage = null;
    };
    TextureVOBase.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        if (inputReg === void 0) { inputReg = null; }
        throw new AbstractMethodError();
    };
    TextureVOBase.prototype._setRenderState = function (renderable) {
        //overidden for state logic
    };
    TextureVOBase.prototype.activate = function (render) {
        //overridden for activation logic
    };
    TextureVOBase.prototype.getTextureReg = function (imageIndex, regCache, sharedReg) {
        var index = this._shader.imageIndices.indexOf(imageIndex); //todo: collapse the index based on duplicate image objects to save registrations
        if (index == -1) {
            var textureReg = regCache.getFreeTextureReg();
            sharedReg.textures.push(textureReg);
            this._shader.imageIndices.push(imageIndex);
            return textureReg;
        }
        return sharedReg.textures[index];
    };
    TextureVOBase.prototype.getFormatString = function (image) {
        switch (image.format) {
            case ContextGLTextureFormat.COMPRESSED:
                return "dxt1,";
                break;
            case ContextGLTextureFormat.COMPRESSED_ALPHA:
                return "dxt5,";
                break;
            default:
                return "";
        }
    };
    return TextureVOBase;
})(AbstractionBase);
module.exports = TextureVOBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFormat":undefined}],"awayjs-renderergl/lib/vos/TriangleSubGeometryVO":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLDrawMode = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var SubGeometryVOBase = require("awayjs-renderergl/lib/vos/SubGeometryVOBase");
/**
 *
 * @class away.pool.TriangleSubGeometryVO
 */
var TriangleSubGeometryVO = (function (_super) {
    __extends(TriangleSubGeometryVO, _super);
    function TriangleSubGeometryVO(triangleSubGeometry, stage) {
        _super.call(this, triangleSubGeometry, stage);
        this._triangleSubGeometry = triangleSubGeometry;
    }
    TriangleSubGeometryVO.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.positions));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.normals));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.tangents));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.uvs));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.secondaryUVs));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.jointIndices));
        this._onClearVertices(new SubGeometryEvent(SubGeometryEvent.CLEAR_VERTICES, this._triangleSubGeometry.jointWeights));
        this._triangleSubGeometry = null;
    };
    TriangleSubGeometryVO.prototype._render = function (shader) {
        //TODO: find a better way to update a concatenated buffer when autoderiving
        if (shader.normalBufferIndex >= 0 && this._triangleSubGeometry.autoDeriveNormals)
            this._triangleSubGeometry.normals;
        if (shader.tangentBufferIndex >= 0 && this._triangleSubGeometry.autoDeriveTangents)
            this._triangleSubGeometry.tangents;
        if (shader.uvBufferIndex >= 0)
            this.activateVertexBufferVO(shader.uvBufferIndex, this._triangleSubGeometry.uvs);
        if (shader.secondaryUVBufferIndex >= 0)
            this.activateVertexBufferVO(shader.secondaryUVBufferIndex, this._triangleSubGeometry.secondaryUVs);
        if (shader.normalBufferIndex >= 0)
            this.activateVertexBufferVO(shader.normalBufferIndex, this._triangleSubGeometry.normals);
        if (shader.tangentBufferIndex >= 0)
            this.activateVertexBufferVO(shader.tangentBufferIndex, this._triangleSubGeometry.tangents);
        if (shader.jointIndexIndex >= 0)
            this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleSubGeometry.jointIndices);
        if (shader.jointWeightIndex >= 0)
            this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleSubGeometry.jointWeights);
        this.activateVertexBufferVO(0, this._triangleSubGeometry.positions);
        _super.prototype._render.call(this, shader);
    };
    TriangleSubGeometryVO.prototype._drawElements = function (firstIndex, numIndices) {
        this.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, firstIndex, numIndices);
    };
    TriangleSubGeometryVO.prototype._drawArrays = function (firstVertex, numVertices) {
        this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderableOwner
     * @param level
     * @param indexOffset
     * @returns {away.pool.TriangleSubMeshRenderable}
     * @protected
     */
    TriangleSubGeometryVO.prototype._pGetOverflowSubGeometry = function () {
        return new TriangleSubGeometryVO(this._triangleSubGeometry, this._stage);
    };
    return TriangleSubGeometryVO;
})(SubGeometryVOBase);
module.exports = TriangleSubGeometryVO;

},{"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-renderergl/lib/vos/SubGeometryVOBase":"awayjs-renderergl/lib/vos/SubGeometryVOBase","awayjs-stagegl/lib/base/ContextGLDrawMode":undefined}]},{},["awayjs-renderergl/lib/RendererGL"])


//# sourceMappingURL=awayjs-renderergl.js.map