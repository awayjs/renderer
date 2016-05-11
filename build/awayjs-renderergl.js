require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var animators = require("./lib/animators");
exports.animators = animators;
var elements = require("./lib/elements");
exports.elements = elements;
var errors = require("./lib/errors");
exports.errors = errors;
var events = require("./lib/events");
exports.events = events;
var filters = require("./lib/filters");
exports.filters = filters;
var managers = require("./lib/managers");
exports.managers = managers;
var renderables = require("./lib/renderables");
exports.renderables = renderables;
var shaders = require("./lib/shaders");
exports.shaders = shaders;
var sort = require("./lib/sort");
exports.sort = sort;
var surfaces = require("./lib/surfaces");
exports.surfaces = surfaces;
var textures = require("./lib/textures");
exports.textures = textures;
var tools = require("./lib/tools");
exports.tools = tools;
var utils = require("./lib/utils");
exports.utils = utils;
var DefaultRenderer_1 = require("./lib/DefaultRenderer");
exports.DefaultRenderer = DefaultRenderer_1.default;
var DepthRenderer_1 = require("./lib/DepthRenderer");
exports.DepthRenderer = DepthRenderer_1.default;
var DistanceRenderer_1 = require("./lib/DistanceRenderer");
exports.DistanceRenderer = DistanceRenderer_1.default;
var Filter3DRenderer_1 = require("./lib/Filter3DRenderer");
exports.Filter3DRenderer = Filter3DRenderer_1.default;
var RendererBase_1 = require("./lib/RendererBase");
exports.RendererBase = RendererBase_1.default;
var BasicMaterial_1 = require("awayjs-display/lib/materials/BasicMaterial");
var Skybox_1 = require("awayjs-display/lib/display/Skybox");
var Billboard_1 = require("awayjs-display/lib/display/Billboard");
var LineSegment_1 = require("awayjs-display/lib/display/LineSegment");
var LineElements_1 = require("awayjs-display/lib/graphics/LineElements");
var TriangleElements_1 = require("awayjs-display/lib/graphics/TriangleElements");
var Graphic_1 = require("awayjs-display/lib/graphics/Graphic");
var Single2DTexture_1 = require("awayjs-display/lib/textures/Single2DTexture");
var SingleCubeTexture_1 = require("awayjs-display/lib/textures/SingleCubeTexture");
var Stage_1 = require("awayjs-stagegl/lib/base/Stage");
surfaces.SurfacePool.registerAbstraction(surfaces.GL_BasicMaterialSurface, BasicMaterial_1.default);
surfaces.SurfacePool.registerAbstraction(surfaces.GL_SkyboxSurface, Skybox_1.default);
Stage_1.default.registerAbstraction(elements.GL_LineElements, LineElements_1.default);
Stage_1.default.registerAbstraction(elements.GL_TriangleElements, TriangleElements_1.default);
shaders.ShaderBase.registerAbstraction(textures.GL_Single2DTexture, Single2DTexture_1.default);
shaders.ShaderBase.registerAbstraction(textures.GL_SingleCubeTexture, SingleCubeTexture_1.default);
RendererBase_1.default.registerAbstraction(renderables.GL_BillboardRenderable, Billboard_1.default);
RendererBase_1.default.registerAbstraction(renderables.GL_LineSegmentRenderable, LineSegment_1.default);
RendererBase_1.default.registerAbstraction(renderables.GL_GraphicRenderable, Graphic_1.default);
RendererBase_1.default.registerAbstraction(renderables.GL_SkyboxRenderable, Skybox_1.default);

},{"./lib/DefaultRenderer":"awayjs-renderergl/lib/DefaultRenderer","./lib/DepthRenderer":"awayjs-renderergl/lib/DepthRenderer","./lib/DistanceRenderer":"awayjs-renderergl/lib/DistanceRenderer","./lib/Filter3DRenderer":"awayjs-renderergl/lib/Filter3DRenderer","./lib/RendererBase":"awayjs-renderergl/lib/RendererBase","./lib/animators":"awayjs-renderergl/lib/animators","./lib/elements":"awayjs-renderergl/lib/elements","./lib/errors":"awayjs-renderergl/lib/errors","./lib/events":"awayjs-renderergl/lib/events","./lib/filters":"awayjs-renderergl/lib/filters","./lib/managers":"awayjs-renderergl/lib/managers","./lib/renderables":"awayjs-renderergl/lib/renderables","./lib/shaders":"awayjs-renderergl/lib/shaders","./lib/sort":"awayjs-renderergl/lib/sort","./lib/surfaces":"awayjs-renderergl/lib/surfaces","./lib/textures":"awayjs-renderergl/lib/textures","./lib/tools":"awayjs-renderergl/lib/tools","./lib/utils":"awayjs-renderergl/lib/utils","awayjs-display/lib/display/Billboard":undefined,"awayjs-display/lib/display/LineSegment":undefined,"awayjs-display/lib/display/Skybox":undefined,"awayjs-display/lib/graphics/Graphic":undefined,"awayjs-display/lib/graphics/LineElements":undefined,"awayjs-display/lib/graphics/TriangleElements":undefined,"awayjs-display/lib/materials/BasicMaterial":undefined,"awayjs-display/lib/textures/Single2DTexture":undefined,"awayjs-display/lib/textures/SingleCubeTexture":undefined,"awayjs-stagegl/lib/base/Stage":undefined}],"awayjs-renderergl/lib/DefaultRenderer":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BitmapImage2D_1 = require("awayjs-core/lib/image/BitmapImage2D");
var ContextGLClearMask_1 = require("awayjs-stagegl/lib/base/ContextGLClearMask");
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
        this._pRttBufferManager = RTTBufferManager_1.default.getInstance(this._pStage);
        this._pDepthRenderer = new DepthRenderer_1.default(this._pStage);
        this._pDistanceRenderer = new DistanceRenderer_1.default(this._pStage);
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
                this._pFilter3DRenderer = new Filter3DRenderer_1.default(this._pStage);
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
            this._pContext.clear(0, 0, 0, 1, 1, 0, ContextGLClearMask_1.default.DEPTH);
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
        this._pDepthRender = new BitmapImage2D_1.default(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
    };
    return DefaultRenderer;
}(RendererBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DefaultRenderer;

},{"./DepthRenderer":"awayjs-renderergl/lib/DepthRenderer","./DistanceRenderer":"awayjs-renderergl/lib/DistanceRenderer","./Filter3DRenderer":"awayjs-renderergl/lib/Filter3DRenderer","./RendererBase":"awayjs-renderergl/lib/RendererBase","./managers/RTTBufferManager":"awayjs-renderergl/lib/managers/RTTBufferManager","awayjs-core/lib/image/BitmapImage2D":undefined,"awayjs-stagegl/lib/base/ContextGLClearMask":undefined}],"awayjs-renderergl/lib/DepthRenderer":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RendererBase_1 = require("./RendererBase");
var GL_DepthSurface_1 = require("./surfaces/GL_DepthSurface");
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
        _super.call(this, stage, GL_DepthSurface_1.default);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    /**
     *
     */
    DepthRenderer.prototype.enterNode = function (node) {
        var enter = node._iCollectionMark != RendererBase_1.default._iCollectionMark && node.isCastingShadow();
        if (!enter) {
            node._iCollectionMark = RendererBase_1.default._iCollectionMark;
            return false;
        }
        return _super.prototype.enterNode.call(this, node);
    };
    return DepthRenderer;
}(RendererBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DepthRenderer;

},{"./RendererBase":"awayjs-renderergl/lib/RendererBase","./surfaces/GL_DepthSurface":"awayjs-renderergl/lib/surfaces/GL_DepthSurface"}],"awayjs-renderergl/lib/DistanceRenderer":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RendererBase_1 = require("./RendererBase");
var GL_DistanceSurface_1 = require("./surfaces/GL_DistanceSurface");
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
        _super.call(this, stage, GL_DistanceSurface_1.default);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    /**
     *
     */
    DistanceRenderer.prototype.enterNode = function (node) {
        var enter = node._iCollectionMark != RendererBase_1.default._iCollectionMark && node.isCastingShadow();
        if (!enter) {
            node._iCollectionMark = RendererBase_1.default._iCollectionMark;
            return false;
        }
        return _super.prototype.enterNode.call(this, node);
    };
    return DistanceRenderer;
}(RendererBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DistanceRenderer;

},{"./RendererBase":"awayjs-renderergl/lib/RendererBase","./surfaces/GL_DistanceSurface":"awayjs-renderergl/lib/surfaces/GL_DistanceSurface"}],"awayjs-renderergl/lib/Filter3DRenderer":[function(require,module,exports){
"use strict";
var ContextGLDrawMode_1 = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLBlendFactor_1 = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var RTTEvent_1 = require("./events/RTTEvent");
var RTTBufferManager_1 = require("./managers/RTTBufferManager");
/**
 * @class away.render.Filter3DRenderer
 */
var Filter3DRenderer = (function () {
    function Filter3DRenderer(stage) {
        var _this = this;
        this._filterSizesInvalid = true;
        this._onRTTResizeDelegate = function (event) { return _this.onRTTResize(event); };
        this._stage = stage;
        this._rttManager = RTTBufferManager_1.default.getInstance(stage);
        this._rttManager.addEventListener(RTTEvent_1.default.RESIZE, this._onRTTResizeDelegate);
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
            context.setVertexBufferAt(this._tasks[0]._positionIndex, vertexBuffer, 0, ContextGLVertexBufferFormat_1.default.FLOAT_2);
            context.setVertexBufferAt(this._tasks[0]._uvIndex, vertexBuffer, 8, ContextGLVertexBufferFormat_1.default.FLOAT_2);
        }
        for (i = 0; i < len; ++i) {
            task = this._tasks[i];
            stage.setRenderTarget(task.target);
            context.setProgram(task.getProgram(stage));
            stage.getAbstraction(task.getMainInputTexture(stage)).activate(task._inputTextureIndex, false);
            if (!task.target) {
                stage.scissorRect = null;
                vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
                context.setVertexBufferAt(task._positionIndex, vertexBuffer, 0, ContextGLVertexBufferFormat_1.default.FLOAT_2);
                context.setVertexBufferAt(task._uvIndex, vertexBuffer, 8, ContextGLVertexBufferFormat_1.default.FLOAT_2);
            }
            context.clear(0.0, 0.0, 0.0, 0.0);
            task.activate(stage, camera, depthTexture);
            context.setBlendFactors(ContextGLBlendFactor_1.default.ONE, ContextGLBlendFactor_1.default.ZERO);
            context.drawIndices(ContextGLDrawMode_1.default.TRIANGLES, indexBuffer, 0, 6);
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
            this._filters[i].rttManager = this._rttManager;
        }
        this._filterSizesInvalid = true;
    };
    Filter3DRenderer.prototype.dispose = function () {
        this._rttManager.removeEventListener(RTTEvent_1.default.RESIZE, this._onRTTResizeDelegate);
        this._rttManager = null;
        this._stage = null;
    };
    return Filter3DRenderer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DRenderer;

},{"./events/RTTEvent":"awayjs-renderergl/lib/events/RTTEvent","./managers/RTTBufferManager":"awayjs-renderergl/lib/managers/RTTBufferManager","awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/RendererBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var Point_1 = require("awayjs-core/lib/geom/Point");
var Rectangle_1 = require("awayjs-core/lib/geom/Rectangle");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var EventDispatcher_1 = require("awayjs-core/lib/events/EventDispatcher");
var RendererEvent_1 = require("awayjs-display/lib/events/RendererEvent");
var AGALMiniAssembler_1 = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLBlendFactor_1 = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode_1 = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var StageEvent_1 = require("awayjs-stagegl/lib/events/StageEvent");
var StageManager_1 = require("awayjs-stagegl/lib/managers/StageManager");
var SurfacePool_1 = require("./surfaces/SurfacePool");
var RenderableMergeSort_1 = require("./sort/RenderableMergeSort");
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
    function RendererBase(stage, surfaceClassGL, forceSoftware, profile, mode) {
        var _this = this;
        if (stage === void 0) { stage = null; }
        if (surfaceClassGL === void 0) { surfaceClassGL = null; }
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
        this._cameraForward = new Vector3D_1.default();
        this._viewPort = new Rectangle_1.default();
        this._pBackBufferInvalid = true;
        this._pDepthTextureInvalid = true;
        this._depthPrepass = false;
        this._backgroundR = 0;
        this._backgroundG = 0;
        this._backgroundB = 0;
        this._backgroundAlpha = 1;
        this.textureRatioX = 1;
        this.textureRatioY = 1;
        this._pRttViewProjectionMatrix = new Matrix3D_1.default();
        this._localPos = new Point_1.default();
        this._globalPos = new Point_1.default();
        this._pScissorRect = new Rectangle_1.default();
        this._pNumElements = 0;
        this._disableColor = false;
        this._renderBlended = true;
        this._numCullPlanes = 0;
        this._onViewportUpdatedDelegate = function (event) { return _this.onViewportUpdated(event); };
        this._onContextUpdateDelegate = function (event) { return _this.onContextUpdate(event); };
        //default sorting algorithm
        this.renderableSorter = new RenderableMergeSort_1.default();
        //set stage
        this._pStage = stage || StageManager_1.default.getInstance().getFreeStage(forceSoftware, profile, mode);
        this._pStage.addEventListener(StageEvent_1.default.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.addEventListener(StageEvent_1.default.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.addEventListener(StageEvent_1.default.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
        this._surfaceClassGL = surfaceClassGL;
        /*
         if (_backgroundImageRenderer)
         _backgroundImageRenderer.stage = value;
         */
        if (this._pStage.context)
            this._pContext = this._pStage.context;
    }
    Object.defineProperty(RendererBase.prototype, "cullPlanes", {
        /**
         *
         */
        get: function () {
            return this._customCullPlanes;
        },
        set: function (value) {
            this._customCullPlanes = value;
        },
        enumerable: true,
        configurable: true
    });
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
    RendererBase.prototype.getAbstraction = function (renderable) {
        return this._abstractionPool[renderable.id] || (this._abstractionPool[renderable.id] = new RendererBase._abstractionClassPool[renderable.assetType](renderable, this));
    };
    /**
     *
     * @param image
     */
    RendererBase.prototype.clearAbstraction = function (renderable) {
        this._abstractionPool[renderable.id] = null;
    };
    /**
     * //TODO
     *
     * @param elementsClass
     * @returns SurfacePool
     */
    RendererBase.prototype.getSurfacePool = function (elements) {
        return this._objectPools[elements.elementsType] || (this._objectPools[elements.elementsType] = new SurfacePool_1.default(elements.elementsClass, this._pStage, this._surfaceClassGL));
    };
    /**
     *
     * @param imageObjectClass
     */
    RendererBase.registerAbstraction = function (renderableClass, assetClass) {
        RendererBase._abstractionClassPool[assetClass.assetType] = renderableClass;
    };
    RendererBase.prototype.activatePass = function (pass, camera) {
        //clear unused vertex streams
        var i;
        for (i = pass.shader.numUsedStreams; i < this._numUsedStreams; i++)
            this._pContext.setVertexBufferAt(i, null);
        //clear unused texture streams
        for (i = pass.shader.numUsedTextures; i < this._numUsedTextures; i++)
            this._pContext.setTextureAt(i, null);
        //check program data is uploaded
        var programData = pass.shader.programData;
        if (!programData.program) {
            programData.program = this._pContext.createProgram();
            var vertexByteCode = (new AGALMiniAssembler_1.default().assemble("part vertex 1\n" + programData.vertexString + "endpart"))['vertex'].data;
            var fragmentByteCode = (new AGALMiniAssembler_1.default().assemble("part fragment 1\n" + programData.fragmentString + "endpart"))['fragment'].data;
            programData.program.upload(vertexByteCode, fragmentByteCode);
        }
        //set program data
        this._pContext.setProgram(programData.program);
        //activate shader object through pass
        pass._iActivate(camera);
    };
    RendererBase.prototype.deactivatePass = function (pass) {
        //deactivate shader object through pass
        pass._iDeactivate();
        this._numUsedStreams = pass.shader.numUsedStreams;
        this._numUsedTextures = pass.shader.numUsedTextures;
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
    /**
     * Disposes the resources used by the RendererBase.
     */
    RendererBase.prototype.dispose = function () {
        for (var id in this._abstractionPool)
            this._abstractionPool[id].clear();
        this._abstractionPool = null;
        this._pStage.removeEventListener(StageEvent_1.default.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent_1.default.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent_1.default.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
        this._pStage = null;
        this._pContext = null;
        /*
         if (_backgroundImageRenderer) {
         _backgroundImageRenderer.dispose();
         _backgroundImageRenderer = null;
         }
         */
    };
    RendererBase.prototype.render = function (camera, scene) {
        this._viewportDirty = false;
        this._scissorDirty = false;
    };
    /**
     * Renders the potentially visible geometry to the back buffer or texture.
     * @param target An option target texture to render to.
     * @param surfaceSelector The index of a CubeTexture's face to render to.
     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
     */
    RendererBase.prototype._iRender = function (camera, scene, target, scissorRect, surfaceSelector) {
        if (target === void 0) { target = null; }
        if (scissorRect === void 0) { scissorRect = null; }
        if (surfaceSelector === void 0) { surfaceSelector = 0; }
        //TODO refactor setTarget so that rendertextures are created before this check
        if (!this._pStage || !this._pContext)
            return;
        //reset head values
        this._pBlendedRenderableHead = null;
        this._pOpaqueRenderableHead = null;
        this._pNumElements = 0;
        this._cullPlanes = this._customCullPlanes ? this._customCullPlanes : camera.frustumPlanes;
        this._numCullPlanes = this._cullPlanes ? this._cullPlanes.length : 0;
        this._cameraPosition = camera.scenePosition;
        this._cameraTransform = camera.sceneTransform;
        this._cameraForward = Matrix3DUtils_1.default.getForward(camera.sceneTransform, this._cameraForward);
        RendererBase._iCollectionMark++;
        scene.traversePartitions(this);
        //sort the resulting renderables
        if (this.renderableSorter) {
            this._pOpaqueRenderableHead = this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
            this._pBlendedRenderableHead = this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
        }
        this._pRttViewProjectionMatrix.copyFrom(camera.viewProjection);
        this._pRttViewProjectionMatrix.appendScale(this.textureRatioX, this.textureRatioY, 1);
        this.pExecuteRender(camera, target, scissorRect, surfaceSelector);
        // generate mip maps on target (if target exists) //TODO
        //if (target)
        //	(<Texture>target).generateMipmaps();
        // clear buffers
        for (var i = 0; i < 8; ++i) {
            this._pContext.setVertexBufferAt(i, null);
            this._pContext.setTextureAt(i, null);
        }
    };
    RendererBase.prototype._iRenderCascades = function (camera, scene, target, numCascades, scissorRects, cameras) {
        this._pStage.setRenderTarget(target, true, 0);
        this._pContext.clear(1, 1, 1, 1, 1, 0);
        this._pContext.setBlendFactors(ContextGLBlendFactor_1.default.ONE, ContextGLBlendFactor_1.default.ZERO);
        this._pContext.setDepthTest(true, ContextGLCompareMode_1.default.LESS);
        var head = this._pOpaqueRenderableHead;
        var first = true;
        //TODO cascades must have separate collectors, rather than separate draw commands
        for (var i = numCascades - 1; i >= 0; --i) {
            this._pStage.scissorRect = scissorRects[i];
            //this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
            first = false;
        }
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        this._pContext.setDepthTest(false, ContextGLCompareMode_1.default.LESS_EQUAL);
        this._pStage.scissorRect = null;
    };
    /**
     * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
     *
     * @param target An option target texture to render to.
     * @param surfaceSelector The index of a CubeTexture's face to render to.
     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
     */
    RendererBase.prototype.pExecuteRender = function (camera, target, scissorRect, surfaceSelector) {
        if (target === void 0) { target = null; }
        if (scissorRect === void 0) { scissorRect = null; }
        if (surfaceSelector === void 0) { surfaceSelector = 0; }
        this._pStage.setRenderTarget(target, true, surfaceSelector);
        if ((target || !this.shareContext) && !this._depthPrepass)
            this._pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);
        this._pStage.scissorRect = scissorRect;
        /*
         if (_backgroundImageRenderer)
         _backgroundImageRenderer.render();
         */
        this._pContext.setBlendFactors(ContextGLBlendFactor_1.default.ONE, ContextGLBlendFactor_1.default.ZERO);
        this.pDraw(camera);
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        //this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie
        if (!this.shareContext) {
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
     */
    RendererBase.prototype.pDraw = function (camera) {
        this._pContext.setDepthTest(true, ContextGLCompareMode_1.default.LESS_EQUAL);
        if (this._disableColor)
            this._pContext.setColorMask(false, false, false, false);
        this.drawRenderables(camera, this._pOpaqueRenderableHead);
        if (this._renderBlended)
            this.drawRenderables(camera, this._pBlendedRenderableHead);
        if (this._disableColor)
            this._pContext.setColorMask(true, true, true, true);
    };
    //private drawCascadeRenderables(renderableGL:GL_RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
    //{
    //	var renderableGL2:GL_RenderableBase;
    //	var render:GL_SurfaceBase;
    //	var pass:IPass;
    //
    //	while (renderableGL) {
    //		renderableGL2 = renderableGL;
    //		render = renderableGL.render;
    //		pass = render.passes[0] //assuming only one pass per material
    //
    //		this.activatePass(renderableGL, pass, camera);
    //
    //		do {
    //			// if completely in front, it will fall in a different cascade
    //			// do not use near and far planes
    //			if (!cullPlanes || renderableGL2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
    //				renderableGL2._iRender(pass, camera, this._pRttViewProjectionMatrix);
    //			} else {
    //				renderableGL2.cascaded = true;
    //			}
    //
    //			renderableGL2 = renderableGL2.next;
    //
    //		} while (renderableGL2 && renderableGL2.render == render && !renderableGL2.cascaded);
    //
    //		this.deactivatePass(renderableGL, pass);
    //
    //		renderableGL = renderableGL2;
    //	}
    //}
    /**
     * Draw a list of renderables.
     *
     * @param renderables The renderables to draw.
     */
    RendererBase.prototype.drawRenderables = function (camera, renderableGL) {
        var i;
        var len;
        var renderableGL2;
        var surfaceGL;
        var passes;
        var pass;
        this._pContext.setStencilActions("frontAndBack", "always", "keep", "keep", "keep");
        this._registeredMasks.length = 0;
        var gl = this._pContext["_gl"];
        if (gl) {
            gl.disable(gl.STENCIL_TEST);
        }
        this._maskConfig = 0;
        while (renderableGL) {
            surfaceGL = renderableGL.surfaceGL;
            passes = surfaceGL.passes;
            // otherwise this would result in depth rendered anyway because fragment shader kil is ignored
            if (this._disableColor && surfaceGL._surface.alphaThreshold != 0) {
                renderableGL2 = renderableGL;
                // fast forward
                do {
                    renderableGL2 = renderableGL2.next;
                } while (renderableGL2 && renderableGL2.surfaceGL == surfaceGL);
            }
            else {
                if (this._activeMasksDirty || this._checkMasksConfig(renderableGL.masksConfig)) {
                    this._activeMasksConfig = renderableGL.masksConfig;
                    if (!this._activeMasksConfig.length) {
                        // disable stencil
                        if (gl) {
                            gl.disable(gl.STENCIL_TEST);
                            gl.stencilFunc(gl.ALWAYS, 0, 0xff);
                            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                        }
                    }
                    else {
                        this._renderMasks(camera, renderableGL.sourceEntity._iAssignedMasks());
                    }
                    this._activeMasksDirty = false;
                }
                //iterate through each shader object
                len = passes.length;
                for (i = 0; i < len; i++) {
                    renderableGL2 = renderableGL;
                    pass = passes[i];
                    this.activatePass(pass, camera);
                    do {
                        if (renderableGL2.maskId !== -1) {
                            if (i == 0)
                                this._registerMask(renderableGL2);
                        }
                        else {
                            renderableGL2._iRender(pass, camera, this._pRttViewProjectionMatrix);
                        }
                        renderableGL2 = renderableGL2.next;
                    } while (renderableGL2 && renderableGL2.surfaceGL == surfaceGL && !(this._activeMasksDirty = this._checkMasksConfig(renderableGL2.masksConfig)));
                    this.deactivatePass(pass);
                }
            }
            renderableGL = renderableGL2;
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
            this._scissorUpdated = new RendererEvent_1.default(RendererEvent_1.default.SCISSOR_UPDATED);
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
            this._viewPortUpdated = new RendererEvent_1.default(RendererEvent_1.default.VIEWPORT_UPDATED);
        this.dispatchEvent(this._viewPortUpdated);
    };
    /**
     *
     */
    RendererBase.prototype.onViewportUpdated = function (event) {
        this._viewPort = this._pStage.viewPort;
        //TODO stop firing viewport updated for every stagegl viewport change
        if (this.shareContext) {
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
        if (this.shareContext) {
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
    /**
     *
     * @param node
     * @returns {boolean}
     */
    RendererBase.prototype.enterNode = function (node) {
        var enter = node._iCollectionMark != RendererBase._iCollectionMark && node.isRenderable() && node.isInFrustum(this._cullPlanes, this._numCullPlanes);
        node._iCollectionMark = RendererBase._iCollectionMark;
        return enter;
    };
    RendererBase.prototype.applyEntity = function (entity) {
        this._sourceEntity = entity;
        // project onto camera's z-axis
        this._zIndex = entity.zOffset + this._cameraPosition.subtract(entity.scenePosition).dotProduct(this._cameraForward);
        //save sceneTransform
        this._renderSceneTransform = entity.getRenderSceneTransform(this._cameraTransform);
        //collect renderables
        entity._acceptTraverser(this);
    };
    RendererBase.prototype.applyRenderable = function (renderable) {
        var renderableGL = this.getAbstraction(renderable);
        var surfaceGL = renderableGL.surfaceGL;
        //set local vars for faster referencing
        renderableGL.surfaceID = surfaceGL.surfaceID;
        renderableGL.renderOrderId = surfaceGL.renderOrderId;
        renderableGL.cascaded = false;
        renderableGL.sourceEntity = this._sourceEntity;
        renderableGL.zIndex = this._zIndex;
        renderableGL.maskId = this._sourceEntity._iAssignedMaskId();
        renderableGL.masksConfig = this._sourceEntity._iMasksConfig();
        //store reference to scene transform
        renderableGL.renderSceneTransform = this._renderSceneTransform;
        if (surfaceGL.requiresBlending) {
            renderableGL.next = this._pBlendedRenderableHead;
            this._pBlendedRenderableHead = renderableGL;
        }
        else {
            renderableGL.next = this._pOpaqueRenderableHead;
            this._pOpaqueRenderableHead = renderableGL;
        }
        this._pNumElements += renderableGL.elementsGL.elements.numElements;
    };
    /**
     *
     * @param entity
     */
    RendererBase.prototype.applyDirectionalLight = function (entity) {
        //don't do anything here
    };
    /**
     *
     * @param entity
     */
    RendererBase.prototype.applyLightProbe = function (entity) {
        //don't do anything here
    };
    /**
     *
     * @param entity
     */
    RendererBase.prototype.applyPointLight = function (entity) {
        //don't do anything here
    };
    /**
     *
     * @param entity
     */
    RendererBase.prototype.applySkybox = function (entity) {
        //don't do anything here
    };
    RendererBase.prototype._registerMask = function (obj) {
        //console.log("registerMask");
        this._registeredMasks.push(obj);
    };
    RendererBase.prototype._renderMasks = function (camera, masks) {
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
        var renderableGL;
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
                    renderableGL = this._registeredMasks[k];
                    //console.log("testing for " + mask["hierarchicalMaskID"] + ", " + mask.name);
                    if (renderableGL.maskId == mask.id) {
                        //console.log("Rendering hierarchicalMaskID " + mask["hierarchicalMaskID"]);
                        this._drawMask(camera, renderableGL);
                    }
                }
            }
        }
        gl.stencilFunc(gl.EQUAL, this._maskConfig, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        this._pContext.setColorMask(true, true, true, true);
        //this._stage.setRenderTarget(oldRenderTarget);
    };
    RendererBase.prototype._drawMask = function (camera, renderableGL) {
        var surfaceGL = renderableGL.surfaceGL;
        var passes = surfaceGL.passes;
        var len = passes.length;
        var pass = passes[len - 1];
        this.activatePass(pass, camera);
        // only render last pass for now
        renderableGL._iRender(pass, camera, this._pRttViewProjectionMatrix);
        this.deactivatePass(pass);
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
    RendererBase._iCollectionMark = 0;
    RendererBase._abstractionClassPool = new Object();
    return RendererBase;
}(EventDispatcher_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RendererBase;

},{"./sort/RenderableMergeSort":"awayjs-renderergl/lib/sort/RenderableMergeSort","./surfaces/SurfacePool":"awayjs-renderergl/lib/surfaces/SurfacePool","awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/events/RendererEvent":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/events/StageEvent":undefined,"awayjs-stagegl/lib/managers/StageManager":undefined}],"awayjs-renderergl/lib/animators/AnimationSetBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AnimationSetError_1 = require("../errors/AnimationSetError");
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
    AnimationSetBase.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        throw new AbstractMethodError_1.default();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        throw new AbstractMethodError_1.default();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        throw new AbstractMethodError_1.default();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.doneAGALCode = function (shader) {
        throw new AbstractMethodError_1.default();
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
            throw new AnimationSetError_1.default("root node name '" + node.name + "' already exists in the set");
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
}(AssetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationSetBase;

},{"../errors/AnimationSetError":"awayjs-renderergl/lib/errors/AnimationSetError","awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-renderergl/lib/animators/AnimatorBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var getTimer_1 = require("awayjs-core/lib/utils/getTimer");
var AnimatorEvent_1 = require("../events/AnimatorEvent");
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
         * Enables translation of the animated sprite from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
         *
         * @see away.animators.IAnimationState#positionDelta
         */
        this.updatePosition = true;
        this._pAnimationSet = animationSet;
        this._broadcaster = new RequestAnimationFrame_1.default(this.onEnterFrame, this);
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
        set: function (value) {
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
    AnimatorBase.prototype.setRenderState = function (shader, renderable, stage, camera) {
        throw new AbstractMethodError_1.default();
    };
    /**
     * Resumes the automatic playback clock controling the active state of the animator.
     */
    AnimatorBase.prototype.start = function () {
        if (this._isPlaying || !this._autoUpdate)
            return;
        this._time = this._pAbsoluteTime = getTimer_1.default();
        this._isPlaying = true;
        this._broadcaster.start();
        if (!this.hasEventListener(AnimatorEvent_1.default.START))
            return;
        if (this._startEvent == null)
            this._startEvent = new AnimatorEvent_1.default(AnimatorEvent_1.default.START, this);
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
        if (!this.hasEventListener(AnimatorEvent_1.default.STOP))
            return;
        if (this._stopEvent == null)
            this._stopEvent = new AnimatorEvent_1.default(AnimatorEvent_1.default.STOP, this);
        this.dispatchEvent(this._stopEvent);
    };
    /**
     * Provides a way to manually update the active state of the animator when automatic
     * updates are disabled.
     *
     * @see #stop()
     * @see #autoUpdate
     */
    AnimatorBase.prototype.update = function (time) {
        var dt = (time - this._time) * this.playbackSpeed;
        this._pUpdateDeltaTime(dt);
        this._time = time;
    };
    AnimatorBase.prototype.reset = function (name, offset) {
        if (offset === void 0) { offset = 0; }
        this.getAnimationState(this._pAnimationSet.getAnimation(name)).offset(offset + this._pAbsoluteTime);
    };
    /**
     * Used by the sprite object to which the animator is applied, registers the owner for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.addOwner = function (sprite) {
        this._pOwners.push(sprite);
    };
    /**
     * Used by the sprite object from which the animator is removed, unregisters the owner for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.removeOwner = function (sprite) {
        this._pOwners.splice(this._pOwners.indexOf(sprite), 1);
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
        this.update(getTimer_1.default());
    };
    AnimatorBase.prototype.applyPositionDelta = function () {
        var delta = this._pActiveState.positionDelta;
        var dist = delta.length;
        var len;
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
        if (this.hasEventListener(AnimatorEvent_1.default.CYCLE_COMPLETE)) {
            if (this._cycleEvent == null)
                this._cycleEvent = new AnimatorEvent_1.default(AnimatorEvent_1.default.CYCLE_COMPLETE, this);
            this.dispatchEvent(this._cycleEvent);
        }
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.clone = function () {
        throw new AbstractMethodError_1.default();
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.dispose = function () {
    };
    AnimatorBase.prototype.invalidateElements = function () {
        var sprite;
        var len = this._pOwners.length;
        for (var i = 0; i < len; i++) {
            sprite = this._pOwners[i];
            sprite.graphics.invalidateElements();
        }
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.testGPUCompatibility = function (shader) {
        throw new AbstractMethodError_1.default();
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
    AnimatorBase.prototype.getRenderableElements = function (renderable, sourceElements) {
        //nothing to do here
        return sourceElements;
    };
    AnimatorBase.assetType = "[asset Animator]";
    return AnimatorBase;
}(AssetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimatorBase;

},{"../events/AnimatorEvent":"awayjs-renderergl/lib/events/AnimatorEvent","awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined,"awayjs-core/lib/utils/RequestAnimationFrame":undefined,"awayjs-core/lib/utils/getTimer":undefined}],"awayjs-renderergl/lib/animators/ParticleAnimationSet":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationSetBase_1 = require("../animators/AnimationSetBase");
var AnimationRegisterData_1 = require("../animators/data/AnimationRegisterData");
var AnimationElements_1 = require("../animators/data/AnimationElements");
var ParticleAnimationData_1 = require("../animators/data/ParticleAnimationData");
var ParticleProperties_1 = require("../animators/data/ParticleProperties");
var ParticlePropertiesMode_1 = require("../animators/data/ParticlePropertiesMode");
var ParticleTimeNode_1 = require("../animators/nodes/ParticleTimeNode");
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
        this._animationElements = new Object();
        this._particleNodes = new Array();
        this._localDynamicNodes = new Array();
        this._localStaticNodes = new Array();
        this._totalLenOfOneVertex = 0;
        /**
         *
         */
        this.shareAnimationGraphics = true;
        //automatically add a particle time node to the set
        this.addAnimation(this._timeNode = new ParticleTimeNode_1.default(usesDuration, usesLooping, usesDelay));
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
        var i;
        var n = node;
        n._iProcessAnimationSetting(this);
        if (n.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
            n._iDataOffset = this._totalLenOfOneVertex;
            this._totalLenOfOneVertex += n.dataLength;
            this._localStaticNodes.push(n);
        }
        else if (n.mode == ParticlePropertiesMode_1.default.LOCAL_DYNAMIC)
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
    ParticleAnimationSet.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        //grab animationRegisterData from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterData = shader.animationRegisterData;
        if (this._iAnimationRegisterData == null)
            this._iAnimationRegisterData = shader.animationRegisterData = new AnimationRegisterData_1.default();
        //reset animationRegisterData
        this._iAnimationRegisterData.reset(registerCache, sharedRegisters, this.needVelocity);
        var code = "";
        var len = sharedRegisters.animatableAttributes.length;
        for (var i = 0; i < len; i++)
            code += "mov " + sharedRegisters.animationTargetRegisters[i] + "," + sharedRegisters.animatableAttributes[i] + "\n";
        code += "mov " + this._iAnimationRegisterData.positionTarget + ".xyz," + this._iAnimationRegisterData.vertexZeroConst + "\n";
        if (this.needVelocity)
            code += "mov " + this._iAnimationRegisterData.velocityTarget + ".xyz," + this._iAnimationRegisterData.vertexZeroConst + "\n";
        var node;
        var i;
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority < ParticleAnimationSet.POST_PRIORITY)
                code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
        }
        code += "add " + this._iAnimationRegisterData.scaleAndRotateTarget + ".xyz," + this._iAnimationRegisterData.scaleAndRotateTarget + ".xyz," + this._iAnimationRegisterData.positionTarget + ".xyz\n";
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
        }
        if (this.hasColorMulNode) {
            this._iAnimationRegisterData.colorMulTarget = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(this._iAnimationRegisterData.colorMulTarget, 1);
            this._iAnimationRegisterData.colorMulVary = registerCache.getFreeVarying();
            code += "mov " + this._iAnimationRegisterData.colorMulTarget + "," + this._iAnimationRegisterData.vertexOneConst + "\n";
        }
        if (this.hasColorAddNode) {
            this._iAnimationRegisterData.colorAddTarget = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(this._iAnimationRegisterData.colorAddTarget, 1);
            this._iAnimationRegisterData.colorAddVary = registerCache.getFreeVarying();
            code += "mov " + this._iAnimationRegisterData.colorAddTarget + "," + this._iAnimationRegisterData.vertexZeroConst + "\n";
        }
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
        }
        if (shader.usesFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
            if (this.hasColorMulNode)
                code += "mov " + this._iAnimationRegisterData.colorMulVary + "," + this._iAnimationRegisterData.colorMulTarget + "\n";
            if (this.hasColorAddNode)
                code += "mov " + this._iAnimationRegisterData.colorAddVary + "," + this._iAnimationRegisterData.colorAddTarget + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        if (this.hasUVNode) {
            this._iAnimationRegisterData.setUVSourceAndTarget(sharedRegisters);
            code += "mov " + this._iAnimationRegisterData.uvTarget + ".xy," + this._iAnimationRegisterData.uvAttribute.toString() + "\n";
            var node;
            for (var i = 0; i < this._particleNodes.length; i++)
                node = this._particleNodes[i];
            code += node.getAGALUVCode(shader, this, registerCache, this._iAnimationRegisterData);
            code += "mov " + this._iAnimationRegisterData.uvVar + "," + this._iAnimationRegisterData.uvTarget + ".xy\n";
        }
        else
            code += "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        var code = "";
        if (shader.usesFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
            if (this.hasColorMulNode)
                code += "mul " + shadedTarget + "," + shadedTarget + "," + this._iAnimationRegisterData.colorMulVary + "\n";
            if (this.hasColorAddNode)
                code += "add " + shadedTarget + "," + shadedTarget + "," + this._iAnimationRegisterData.colorAddVary + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.doneAGALCode = function (shader) {
        //set vertexZeroConst,vertexOneConst,vertexTwoConst
        shader.setVertexConst(this._iAnimationRegisterData.vertexZeroConst.index, 0, 1, 2, 0);
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
        for (var key in this._animationElements)
            this._animationElements[key].dispose();
        _super.prototype.dispose.call(this);
    };
    ParticleAnimationSet.prototype.getAnimationElements = function (graphic) {
        var animationElements = (this.shareAnimationGraphics) ? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
        if (animationElements)
            return animationElements;
        this._iGenerateAnimationElements(graphic.parent);
        return (this.shareAnimationGraphics) ? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
    };
    /** @private */
    ParticleAnimationSet.prototype._iGenerateAnimationElements = function (graphics) {
        if (this.initParticleFunc == null)
            throw (new Error("no initParticleFunc set"));
        var i, j, k;
        var animationElements;
        var newAnimationElements = false;
        var elements;
        var graphic;
        var localNode;
        for (i = 0; i < graphics.count; i++) {
            graphic = graphics.getGraphicAt(i);
            elements = graphic.elements;
            if (this.shareAnimationGraphics) {
                animationElements = this._animationElements[elements.id];
                if (animationElements)
                    continue;
            }
            animationElements = new AnimationElements_1.default();
            if (this.shareAnimationGraphics)
                this._animationElements[elements.id] = animationElements;
            else
                this._animationElements[graphic.id] = animationElements;
            newAnimationElements = true;
            //create the vertexData vector that will be used for local node data
            animationElements.createVertexData(elements.numVertices, this._totalLenOfOneVertex);
        }
        if (!newAnimationElements)
            return;
        var particles = graphics.particles;
        var particlesLength = particles.length;
        var numParticles = graphics.numParticles;
        var particleProperties = new ParticleProperties_1.default();
        var particle;
        var oneDataLen;
        var oneDataOffset;
        var counterForVertex;
        var counterForOneData;
        var oneData;
        var numVertices;
        var vertexData;
        var vertexLength;
        var startingOffset;
        var vertexOffset;
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
            //create the next set of node properties for the particle
            for (k = 0; k < this._localStaticNodes.length; k++)
                this._localStaticNodes[k]._iGeneratePropertyOfOneParticle(particleProperties);
            //loop through all particle data for the curent particle
            while (j < particlesLength && (particle = particles[j]).particleIndex == i) {
                //find the target animationElements
                for (k = 0; k < graphics.count; k++) {
                    graphic = graphics.getGraphicAt(k);
                    if (graphic.elements == particle.elements) {
                        animationElements = (this.shareAnimationGraphics) ? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
                        break;
                    }
                }
                numVertices = particle.numVertices;
                vertexData = animationElements.vertexData;
                vertexLength = numVertices * this._totalLenOfOneVertex;
                startingOffset = animationElements.numProcessedVertices * this._totalLenOfOneVertex;
                //loop through each static local node in the animation set
                for (k = 0; k < this._localStaticNodes.length; k++) {
                    localNode = this._localStaticNodes[k];
                    oneData = localNode.oneData;
                    oneDataLen = localNode.dataLength;
                    oneDataOffset = startingOffset + localNode._iDataOffset;
                    //loop through each vertex set in the vertex data
                    for (counterForVertex = 0; counterForVertex < vertexLength; counterForVertex += this._totalLenOfOneVertex) {
                        vertexOffset = oneDataOffset + counterForVertex;
                        //add the data for the local node to the vertex data
                        for (counterForOneData = 0; counterForOneData < oneDataLen; counterForOneData++)
                            vertexData[vertexOffset + counterForOneData] = oneData[counterForOneData];
                    }
                }
                //store particle properties if they need to be retreived for dynamic local nodes
                if (this._localDynamicNodes.length)
                    animationElements.animationParticles.push(new ParticleAnimationData_1.default(i, particleProperties.startTime, particleProperties.duration, particleProperties.delay, particle));
                animationElements.numProcessedVertices += numVertices;
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
}(AnimationSetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleAnimationSet;

},{"../animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase","../animators/data/AnimationElements":"awayjs-renderergl/lib/animators/data/AnimationElements","../animators/data/AnimationRegisterData":"awayjs-renderergl/lib/animators/data/AnimationRegisterData","../animators/data/ParticleAnimationData":"awayjs-renderergl/lib/animators/data/ParticleAnimationData","../animators/data/ParticleProperties":"awayjs-renderergl/lib/animators/data/ParticleProperties","../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../animators/nodes/ParticleTimeNode":"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode"}],"awayjs-renderergl/lib/animators/ParticleAnimator":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimatorBase_1 = require("../animators/AnimatorBase");
var AnimationElements_1 = require("../animators/data/AnimationElements");
var ParticlePropertiesMode_1 = require("../animators/data/ParticlePropertiesMode");
/**
 * Provides an interface for assigning paricle-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent sprite is particle geometry
 *
 * @see away.base.ParticleGraphics
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
            if (node.mode == ParticlePropertiesMode_1.default.LOCAL_DYNAMIC) {
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
    ParticleAnimator.prototype.setRenderState = function (shader, renderable, stage, camera) {
        var animationRegisterData = this._particleAnimationSet._iAnimationRegisterData;
        var graphic = renderable.graphic;
        if (!graphic)
            throw (new Error("Must be graphic"));
        //process animation sub geometries
        var animationElements = this._particleAnimationSet.getAnimationElements(graphic);
        var i;
        for (i = 0; i < this._animationParticleStates.length; i++)
            this._animationParticleStates[i].setRenderState(shader, renderable, animationElements, animationRegisterData, camera, stage);
        //process animator subgeometries
        var animatorElements = this.getAnimatorElements(graphic);
        for (i = 0; i < this._animatorParticleStates.length; i++)
            this._animatorParticleStates[i].setRenderState(shader, renderable, animatorElements, animationRegisterData, camera, stage);
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
    ParticleAnimator.prototype.getAnimatorElements = function (graphic) {
        if (!this._animatorParticleStates.length)
            return;
        var elements = graphic.elements;
        var animatorElements = this._animatorSubGeometries[elements.id] = new AnimationElements_1.default();
        //create the vertexData vector that will be used for local state data
        animatorElements.createVertexData(elements.numVertices, this._totalLenOfOneVertex);
        //pass the particles data to the animator elements
        animatorElements.animationParticles = this._particleAnimationSet.getAnimationElements(graphic).animationParticles;
    };
    return ParticleAnimator;
}(AnimatorBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleAnimator;

},{"../animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","../animators/data/AnimationElements":"awayjs-renderergl/lib/animators/data/AnimationElements","../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode"}],"awayjs-renderergl/lib/animators/SkeletonAnimationSet":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationSetBase_1 = require("../animators/AnimationSetBase");
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
    Object.defineProperty(SkeletonAnimationSet.prototype, "matricesIndex", {
        get: function () {
            return this._matricesIndex;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        this._matricesIndex = registerCache.numUsedVertexConstants;
        var indexOffset0 = this._matricesIndex;
        var indexOffset1 = this._matricesIndex + 1;
        var indexOffset2 = this._matricesIndex + 2;
        var indexStream = registerCache.getFreeVertexAttribute();
        shader.jointIndexIndex = indexStream.index;
        var weightStream = registerCache.getFreeVertexAttribute();
        shader.jointWeightIndex = weightStream.index;
        var indices = [indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w"];
        var weights = [weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w"];
        var temp1 = registerCache.getFreeVertexVectorTemp();
        var dot = "dp4";
        var code = "";
        var len = sharedRegisters.animatableAttributes.length;
        for (var i = 0; i < len; ++i) {
            var source = sharedRegisters.animatableAttributes[i];
            var target = sharedRegisters.animationTargetRegisters[i];
            for (var j = 0; j < this._jointsPerVertex; ++j) {
                registerCache.getFreeVertexConstant();
                registerCache.getFreeVertexConstant();
                registerCache.getFreeVertexConstant();
                code += dot + " " + temp1 + ".x, " + source + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" +
                    dot + " " + temp1 + ".y, " + source + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" +
                    dot + " " + temp1 + ".z, " + source + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" +
                    "mov " + temp1 + ".w, " + source + ".w\n" +
                    "mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight
                // add or mov to target. Need to write to a temp reg first, because an output can be a target
                if (j == 0)
                    code += "mov " + target + ", " + temp1 + "\n";
                else
                    code += "add " + target + ", " + target + ", " + temp1 + "\n";
            }
            // switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
            dot = "dp3";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        return "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.doneAGALCode = function (shader) {
    };
    return SkeletonAnimationSet;
}(AnimationSetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonAnimationSet;

},{"../animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase"}],"awayjs-renderergl/lib/animators/SkeletonAnimator":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsEvent_1 = require("awayjs-display/lib/events/ElementsEvent");
var AnimatorBase_1 = require("../animators/AnimatorBase");
var JointPose_1 = require("../animators/data/JointPose");
var SkeletonPose_1 = require("../animators/data/SkeletonPose");
var AnimationStateEvent_1 = require("../events/AnimationStateEvent");
/**
 * Provides an interface for assigning skeleton-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
var SkeletonAnimator = (function (_super) {
    __extends(SkeletonAnimator, _super);
    /**
     * Creates a new <code>SkeletonAnimator</code> object.
     *
     * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
     * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned sprite data.
     * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
     */
    function SkeletonAnimator(animationSet, skeleton, forceCPU) {
        var _this = this;
        if (forceCPU === void 0) { forceCPU = false; }
        _super.call(this, animationSet);
        this._globalPose = new SkeletonPose_1.default();
        this._morphedElements = new Object();
        this._morphedElementsDirty = new Object();
        this._skeletonAnimationSet = animationSet;
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
         * by condensing the number of joint index values required per sprite. Only applicable to
         * skeleton animations that utilise more than one sprite object. Defaults to false.
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
        return new SkeletonAnimator(this._skeletonAnimationSet, this._skeleton, this._forceCPU);
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
            this._pActiveNode.addEventListener(AnimationStateEvent_1.default.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
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
    SkeletonAnimator.prototype.setRenderState = function (shader, renderable, stage, camera) {
        // do on request of globalProperties
        if (this._globalPropertiesDirty)
            this.updateGlobalProperties();
        var elements = renderable.graphic.elements;
        elements.useCondensedIndices = this._useCondensedIndices;
        if (this._useCondensedIndices) {
            // using a condensed data set
            this.updateCondensedMatrices(elements.condensedIndexLookUp);
            shader.setVertexConstFromArray(this._skeletonAnimationSet.matricesIndex, this._condensedMatrices);
        }
        else {
            if (this._pAnimationSet.usesCPU) {
                if (this._morphedElementsDirty[elements.id])
                    this.morphElements(renderable, elements);
                return;
            }
            shader.setVertexConstFromArray(this._skeletonAnimationSet.matricesIndex, this._globalMatrices);
        }
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
            this.invalidateElements();
    };
    SkeletonAnimator.prototype.updateCondensedMatrices = function (condensedIndexLookUp) {
        var j = 0, k = 0;
        var len = condensedIndexLookUp.length;
        var srcIndex;
        this._condensedMatrices = new Float32Array(len * 12);
        for (var i = 0; i < len; i++) {
            srcIndex = condensedIndexLookUp[i] * 12; //12 required for the three 4-component vectors that store the matrix
            k = 12;
            // copy into condensed
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
    SkeletonAnimator.prototype.getRenderableElements = function (renderable, sourceElements) {
        this._morphedElementsDirty[sourceElements.id] = true;
        //early out for GPU animations
        if (!this._pAnimationSet.usesCPU)
            return sourceElements;
        var targetElements;
        if (!(targetElements = this._morphedElements[sourceElements.id])) {
            //not yet stored
            sourceElements.normals;
            sourceElements.tangents;
            targetElements = this._morphedElements[sourceElements.id] = sourceElements.clone();
            //turn off auto calculations on the morphed geometry
            targetElements.autoDeriveNormals = false;
            targetElements.autoDeriveTangents = false;
            //add event listeners for any changes in UV values on the source geometry
            sourceElements.addEventListener(ElementsEvent_1.default.INVALIDATE_INDICES, this._onIndicesUpdateDelegate);
            sourceElements.addEventListener(ElementsEvent_1.default.INVALIDATE_VERTICES, this._onVerticesUpdateDelegate);
        }
        return targetElements;
    };
    /**
     * If the animation can't be performed on GPU, transform vertices manually
     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
     * @param pass The material pass for which we need to transform the vertices
     */
    SkeletonAnimator.prototype.morphElements = function (renderable, sourceElements) {
        this._morphedElementsDirty[sourceElements.id] = false;
        var numVertices = sourceElements.numVertices;
        var sourcePositions = sourceElements.positions.get(numVertices);
        var sourceNormals = sourceElements.normals.get(numVertices);
        var sourceTangents = sourceElements.tangents.get(numVertices);
        var posDim = sourceElements.positions.dimensions;
        var jointIndices = sourceElements.jointIndices.get(numVertices);
        var jointWeights = sourceElements.jointWeights.get(numVertices);
        var targetElements = this._morphedElements[sourceElements.id];
        var targetPositions = targetElements.positions.get(numVertices);
        var targetNormals = targetElements.normals.get(numVertices);
        var targetTangents = targetElements.tangents.get(numVertices);
        var index = 0;
        var i0 = 0;
        var i1 = 0;
        var j = 0;
        var k;
        var vx, vy, vz;
        var nx, ny, nz;
        var tx, ty, tz;
        var weight;
        var vertX, vertY, vertZ;
        var normX, normY, normZ;
        var tangX, tangY, tangZ;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
        while (index < numVertices) {
            i0 = index * posDim;
            vertX = sourcePositions[i0];
            vertY = sourcePositions[i0 + 1];
            vertZ = (posDim == 3) ? sourcePositions[i0 + 2] : 0;
            i1 = index * 3;
            normX = sourceNormals[i1];
            normY = sourceNormals[i1 + 1];
            normZ = sourceNormals[i1 + 2];
            tangX = sourceTangents[i1];
            tangY = sourceTangents[i1 + 1];
            tangZ = sourceTangents[i1 + 2];
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
            targetPositions[i0] = vx;
            targetPositions[i0 + 1] = vy;
            if (posDim == 3)
                targetPositions[i0 + 2] = vz;
            targetNormals[i1] = nx;
            targetNormals[i1 + 1] = ny;
            targetNormals[i1 + 2] = nz;
            targetTangents[i1] = tx;
            targetTangents[i1 + 1] = ty;
            targetTangents[i1 + 2] = tz;
            index++;
        }
        targetElements.setPositions(targetPositions);
        targetElements.setNormals(targetNormals);
        targetElements.setTangents(targetTangents);
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
        var parentIndex;
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
                globalJointPose = globalPoses[i] = new JointPose_1.default();
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
        if (event.type == AnimationStateEvent_1.default.TRANSITION_COMPLETE) {
            event.animationNode.removeEventListener(AnimationStateEvent_1.default.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            //if this is the current active state transition, revert control to the active node
            if (this._pActiveState == event.animationState) {
                this._pActiveNode = this._pAnimationSet.getAnimation(this._pActiveAnimationName);
                this._pActiveState = this.getAnimationState(this._pActiveNode);
                this._activeSkeletonState = this._pActiveState;
            }
        }
    };
    SkeletonAnimator.prototype.onIndicesUpdate = function (event) {
        var elements = event.target;
        this._morphedElements[elements.id].setIndices(elements.indices);
    };
    SkeletonAnimator.prototype.onVerticesUpdate = function (event) {
        var elements = event.target;
        var morphGraphics = this._morphedElements[elements.id];
        switch (event.attributesView) {
            case elements.uvs:
                morphGraphics.setUVs(elements.uvs.get(elements.numVertices));
                break;
            case elements.getCustomAtributes("secondaryUVs"):
                morphGraphics.setCustomAttributes("secondaryUVs", elements.getCustomAtributes("secondaryUVs").get(elements.numVertices));
                break;
        }
    };
    return SkeletonAnimator;
}(AnimatorBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonAnimator;

},{"../animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","../animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","../events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent","awayjs-display/lib/events/ElementsEvent":undefined}],"awayjs-renderergl/lib/animators/VertexAnimationSet":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationSetBase_1 = require("../animators/AnimationSetBase");
var AnimationRegisterData_1 = require("../animators/data/AnimationRegisterData");
var VertexAnimationMode_1 = require("../animators/data/VertexAnimationMode");
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
    VertexAnimationSet.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        //grab animationRegisterData from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterData = shader.animationRegisterData;
        if (this._iAnimationRegisterData == null)
            this._iAnimationRegisterData = shader.animationRegisterData = new AnimationRegisterData_1.default();
        if (this._blendMode == VertexAnimationMode_1.default.ABSOLUTE)
            return this.getAbsoluteAGALCode(shader, registerCache, sharedRegisters);
        else
            return this.getAdditiveAGALCode(shader, registerCache, sharedRegisters);
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        return "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.doneAGALCode = function (shader) {
    };
    /**
     * Generates the vertex AGAL code for absolute blending.
     */
    VertexAnimationSet.prototype.getAbsoluteAGALCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var temp1 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var regs = new Array(".x", ".y", ".z", ".w");
        var len = sharedRegisters.animatableAttributes.length;
        var constantReg = registerCache.getFreeVertexConstant();
        this._iAnimationRegisterData.weightsIndex = constantReg.index;
        this._iAnimationRegisterData.poseIndices = new Array(this._numPoses);
        var poseInput;
        var k = 0;
        if (len > 2)
            len = 2;
        for (var i = 0; i < len; ++i) {
            code += "mul " + temp1 + ", " + sharedRegisters.animatableAttributes[i] + ", " + constantReg + regs[0] + "\n";
            for (var j = 1; j < this._numPoses; ++j) {
                poseInput = registerCache.getFreeVertexAttribute();
                this._iAnimationRegisterData.poseIndices[k++] = poseInput.index;
                code += "mul " + temp2 + ", " + poseInput + ", " + constantReg + regs[j] + "\n";
                if (j < this._numPoses - 1)
                    code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";
            }
            code += "add " + sharedRegisters.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
        }
        // add code for bitangents if tangents are used
        if (shader.tangentDependencies > 0 || shader.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + sharedRegisters.animatableAttributes[2] + ", " + sharedRegisters.animationTargetRegisters[1] + "\n" +
                "mul " + temp1 + ", " + sharedRegisters.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
                "sub " + sharedRegisters.animationTargetRegisters[2] + ", " + sharedRegisters.animationTargetRegisters[2] + ", " + temp1 + "\n";
        }
        //
        // // simply write attributes to targets, do not animate them
        // // projection will pick up on targets[0] to do the projection
        // var len:number = sharedRegisters.animatableAttributes.length;
        // for (var i:number = 0; i < len; ++i)
        // 	code += "mov " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animatableAttributes[i] + "\n";
        return code;
    };
    /**
     * Generates the vertex AGAL code for additive blending.
     */
    VertexAnimationSet.prototype.getAdditiveAGALCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var len = sharedRegisters.animatableAttributes.length;
        var regs = [".x", ".y", ".z", ".w"];
        var temp1 = registerCache.getFreeVertexVectorTemp();
        var constantReg = registerCache.getFreeVertexConstant();
        this._iAnimationRegisterData.weightsIndex = constantReg.index;
        this._iAnimationRegisterData.poseIndices = new Array(this._numPoses);
        var poseInput;
        var k = 0;
        if (len > 2)
            len = 2;
        code += "mov  " + sharedRegisters.animationTargetRegisters[0] + ", " + sharedRegisters.animatableAttributes[0] + "\n";
        if (shader.normalDependencies > 0)
            code += "mov " + sharedRegisters.animationTargetRegisters[1] + ", " + sharedRegisters.animatableAttributes[1] + "\n";
        for (var i = 0; i < len; ++i) {
            for (var j = 0; j < this._numPoses; ++j) {
                poseInput = registerCache.getFreeVertexAttribute();
                this._iAnimationRegisterData.poseIndices[k++] = poseInput.index;
                code += "mul " + temp1 + ", " + poseInput + ", " + constantReg + regs[j] + "\n" +
                    "add " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animationTargetRegisters[i] + ", " + temp1 + "\n";
            }
        }
        if (shader.tangentDependencies > 0 || shader.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + sharedRegisters.animatableAttributes[2] + ", " + sharedRegisters.animationTargetRegisters[1] + "\n" +
                "mul " + temp1 + ", " + sharedRegisters.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
                "sub " + sharedRegisters.animationTargetRegisters[2] + ", " + sharedRegisters.animatableAttributes[2] + ", " + temp1 + "\n";
        }
        return code;
    };
    return VertexAnimationSet;
}(AnimationSetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VertexAnimationSet;

},{"../animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase","../animators/data/AnimationRegisterData":"awayjs-renderergl/lib/animators/data/AnimationRegisterData","../animators/data/VertexAnimationMode":"awayjs-renderergl/lib/animators/data/VertexAnimationMode"}],"awayjs-renderergl/lib/animators/VertexAnimator":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TriangleElements_1 = require("awayjs-display/lib/graphics/TriangleElements");
var AnimatorBase_1 = require("../animators/AnimatorBase");
var VertexAnimationMode_1 = require("../animators/data/VertexAnimationMode");
/**
 * Provides an interface for assigning vertex-based animation data sets to sprite-based entity objects
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
        if (this._poses[0] != this._activeVertexState.currentGraphics) {
            this._poses[0] = this._activeVertexState.currentGraphics;
            geometryFlag = true;
        }
        if (this._poses[1] != this._activeVertexState.nextGraphics)
            this._poses[1] = this._activeVertexState.nextGraphics;
        this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);
        if (geometryFlag)
            this.invalidateElements();
    };
    /**
     * @inheritDoc
     */
    VertexAnimator.prototype.setRenderState = function (shader, renderable, stage, camera) {
        // todo: add code for when running on cpu
        // this type of animation can only be SubSprite
        var graphic = renderable.graphic;
        var elements = graphic.elements;
        // if no poses defined, set temp data
        if (!this._poses.length) {
            this.setNullPose(shader, elements, stage);
            return;
        }
        var animationRegisterData = shader.animationRegisterData;
        var i;
        var len = this._vertexAnimationSet.numPoses;
        shader.setVertexConstFromArray(animationRegisterData.weightsIndex, this._weights);
        if (this._vertexAnimationSet.blendMode == VertexAnimationMode_1.default.ABSOLUTE)
            i = 1;
        else
            i = 0;
        var elementsGL;
        var k = 0;
        for (; i < len; ++i) {
            elements = this._poses[i].getGraphicAt(graphic._iIndex).elements || graphic.elements;
            elementsGL = stage.getAbstraction(elements);
            elementsGL._indexMappings = stage.getAbstraction(graphic.elements).getIndexMappings();
            if (elements.isAsset(TriangleElements_1.default)) {
                elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.positions);
                if (shader.normalDependencies > 0)
                    elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.normals);
            }
        }
    };
    VertexAnimator.prototype.setNullPose = function (shader, elements, stage) {
        var animationRegisterData = shader.animationRegisterData;
        shader.setVertexConstFromArray(animationRegisterData.weightsIndex, this._weights);
        var elementsGL = stage.getAbstraction(elements);
        var k = 0;
        if (this._vertexAnimationSet.blendMode == VertexAnimationMode_1.default.ABSOLUTE) {
            var len = this._vertexAnimationSet.numPoses;
            for (var i = 1; i < len; ++i) {
                if (elements.isAsset(TriangleElements_1.default)) {
                    elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.positions);
                    if (shader.normalDependencies > 0)
                        elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], elements.normals);
                }
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
    VertexAnimator.prototype.getRenderableElements = function (renderable, sourceElements) {
        if (this._vertexAnimationSet.blendMode == VertexAnimationMode_1.default.ABSOLUTE && this._poses.length)
            return this._poses[0].getGraphicAt(renderable.graphic._iIndex).elements || sourceElements;
        //nothing to do here
        return sourceElements;
    };
    return VertexAnimator;
}(AnimatorBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VertexAnimator;

},{"../animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","../animators/data/VertexAnimationMode":"awayjs-renderergl/lib/animators/data/VertexAnimationMode","awayjs-display/lib/graphics/TriangleElements":undefined}],"awayjs-renderergl/lib/animators/data/AnimationElements":[function(require,module,exports){
"use strict";
/**
 * ...
 */
var AnimationElements = (function () {
    function AnimationElements() {
        this._pVertexBuffer = new Array(8);
        this._pBufferContext = new Array(8);
        this._pBufferDirty = new Array(8);
        this.numProcessedVertices = 0;
        this.previousTime = Number.NEGATIVE_INFINITY;
        this.animationParticles = new Array();
        for (var i = 0; i < 8; i++)
            this._pBufferDirty[i] = true;
        this._iUniqueId = AnimationElements.SUBGEOM_ID_COUNT++;
    }
    AnimationElements.prototype.createVertexData = function (numVertices, totalLenOfOneVertex) {
        this._numVertices = numVertices;
        this._totalLenOfOneVertex = totalLenOfOneVertex;
        this._pVertexData = new Array(numVertices * totalLenOfOneVertex);
    };
    AnimationElements.prototype.activateVertexBuffer = function (index, bufferOffset, stage, format) {
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
    AnimationElements.prototype.dispose = function () {
        while (this._pVertexBuffer.length) {
            var vertexBuffer = this._pVertexBuffer.pop();
            if (vertexBuffer)
                vertexBuffer.dispose();
        }
    };
    AnimationElements.prototype.invalidateBuffer = function () {
        for (var i = 0; i < 8; i++)
            this._pBufferDirty[i] = true;
    };
    Object.defineProperty(AnimationElements.prototype, "vertexData", {
        get: function () {
            return this._pVertexData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationElements.prototype, "numVertices", {
        get: function () {
            return this._numVertices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationElements.prototype, "totalLenOfOneVertex", {
        get: function () {
            return this._totalLenOfOneVertex;
        },
        enumerable: true,
        configurable: true
    });
    AnimationElements.SUBGEOM_ID_COUNT = 0;
    return AnimationElements;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationElements;

},{}],"awayjs-renderergl/lib/animators/data/AnimationRegisterData":[function(require,module,exports){
"use strict";
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * ...
 */
var AnimationRegisterData = (function () {
    function AnimationRegisterData() {
        this.indexDictionary = new Object();
    }
    AnimationRegisterData.prototype.reset = function (registerCache, sharedRegisters, needVelocity) {
        this.rotationRegisters = new Array();
        this.positionAttribute = sharedRegisters.animatableAttributes[0];
        this.scaleAndRotateTarget = sharedRegisters.animationTargetRegisters[0];
        for (var i = 1; i < sharedRegisters.animationTargetRegisters.length; i++)
            this.rotationRegisters.push(sharedRegisters.animationTargetRegisters[i]);
        //allot const register
        this.vertexZeroConst = registerCache.getFreeVertexConstant();
        this.vertexZeroConst = new ShaderRegisterElement_1.default(this.vertexZeroConst.regName, this.vertexZeroConst.index, 0);
        this.vertexOneConst = new ShaderRegisterElement_1.default(this.vertexZeroConst.regName, this.vertexZeroConst.index, 1);
        this.vertexTwoConst = new ShaderRegisterElement_1.default(this.vertexZeroConst.regName, this.vertexZeroConst.index, 2);
        //allot temp register
        this.positionTarget = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(this.positionTarget, 1);
        this.positionTarget = new ShaderRegisterElement_1.default(this.positionTarget.regName, this.positionTarget.index);
        if (needVelocity) {
            this.velocityTarget = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(this.velocityTarget, 1);
            this.velocityTarget = new ShaderRegisterElement_1.default(this.velocityTarget.regName, this.velocityTarget.index);
            this.vertexTime = new ShaderRegisterElement_1.default(this.velocityTarget.regName, this.velocityTarget.index, 3);
            this.vertexLife = new ShaderRegisterElement_1.default(this.positionTarget.regName, this.positionTarget.index, 3);
        }
        else {
            var tempTime = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(tempTime, 1);
            this.vertexTime = new ShaderRegisterElement_1.default(tempTime.regName, tempTime.index, 0);
            this.vertexLife = new ShaderRegisterElement_1.default(tempTime.regName, tempTime.index, 1);
        }
    };
    AnimationRegisterData.prototype.setUVSourceAndTarget = function (sharedRegisters) {
        this.uvVar = sharedRegisters.uvTarget;
        this.uvAttribute = sharedRegisters.uvSource;
        //uv action is processed after normal actions,so use offsetTarget as uvTarget
        this.uvTarget = new ShaderRegisterElement_1.default(this.positionTarget.regName, this.positionTarget.index);
    };
    AnimationRegisterData.prototype.setRegisterIndex = function (node, parameterIndex, registerIndex) {
        //8 should be enough for any node.
        var t = this.indexDictionary[node.id];
        if (t == null)
            t = this.indexDictionary[node.id] = new Array(8);
        t[parameterIndex] = registerIndex;
    };
    AnimationRegisterData.prototype.getRegisterIndex = function (node, parameterIndex) {
        return this.indexDictionary[node.id][parameterIndex];
    };
    return AnimationRegisterData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationRegisterData;

},{"../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/data/ColorSegmentPoint":[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorSegmentPoint;

},{}],"awayjs-renderergl/lib/animators/data/JointPose":[function(require,module,exports){
"use strict";
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Quaternion_1 = require("awayjs-core/lib/geom/Quaternion");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
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
        this.orientation = new Quaternion_1.default();
        /**
         * The translation of the pose
         */
        this.translation = new Vector3D_1.default();
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
            target = new Matrix3D_1.default();
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JointPose;

},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Quaternion":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/data/ParticleAnimationData":[function(require,module,exports){
"use strict";
/**
 * ...
 */
var ParticleAnimationData = (function () {
    function ParticleAnimationData(index, startTime, duration, delay, particle) {
        this.index = index;
        this.startTime = startTime;
        this.totalTime = duration + delay;
        this.duration = duration;
        this.delay = delay;
        this.startVertexIndex = particle.startVertexIndex;
        this.numVertices = particle.numVertices;
    }
    return ParticleAnimationData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleAnimationData;

},{}],"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticlePropertiesMode;

},{}],"awayjs-renderergl/lib/animators/data/ParticleProperties":[function(require,module,exports){
"use strict";
/**
 * Dynamic class for holding the local properties of a particle, used for processing the static properties
 * of particles in the particle animation set before beginning upload to the GPU.
 */
var ParticleProperties = (function () {
    function ParticleProperties() {
    }
    return ParticleProperties;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleProperties;

},{}],"awayjs-renderergl/lib/animators/data/SkeletonJoint":[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonJoint;

},{}],"awayjs-renderergl/lib/animators/data/SkeletonPose":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var JointPose_1 = require("../../animators/data/JointPose");
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
        var jointPoseIndex;
        var jointPose;
        for (var i; i < this.jointPoses.length; i++) {
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
            var cloneJointPose = new JointPose_1.default();
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
}(AssetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonPose;

},{"../../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","awayjs-core/lib/library/AssetBase":undefined}],"awayjs-renderergl/lib/animators/data/Skeleton":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
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
        var jointIndex;
        var joint;
        for (var i; i < this.joints.length; i++) {
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
}(AssetBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Skeleton;

},{"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-renderergl/lib/animators/data/VertexAnimationMode":[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VertexAnimationMode;

},{}],"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var AnimationNodeBase_1 = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
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
        this._pTotalDelta = new Vector3D_1.default();
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
}(AnimationNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationClipNodeBase;

},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleAccelerationState_1 = require("../../animators/states/ParticleAccelerationState");
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
    function ParticleAccelerationNode(mode, acceleration) {
        if (acceleration === void 0) { acceleration = null; }
        _super.call(this, "ParticleAcceleration", mode, 3);
        this._pStateClass = ParticleAccelerationState_1.default;
        this._acceleration = acceleration || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleAccelerationNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var accelerationValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleAccelerationState_1.default.ACCELERATION_INDEX, accelerationValue.index);
        var temp = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp, 1);
        var code = "mul " + temp + "," + animationRegisterData.vertexTime + "," + accelerationValue + "\n";
        if (animationSet.needVelocity) {
            var temp2 = registerCache.getFreeVertexVectorTemp();
            code += "mul " + temp2 + "," + temp + "," + animationRegisterData.vertexTwoConst + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + temp2 + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
        }
        registerCache.removeVertexTempUsage(temp);
        code += "mul " + temp + "," + temp + "," + animationRegisterData.vertexTime + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + temp + "," + animationRegisterData.positionTarget + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleAccelerationNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleAccelerationState":"awayjs-renderergl/lib/animators/states/ParticleAccelerationState","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleBezierCurveState_1 = require("../../animators/states/ParticleBezierCurveState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
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
    function ParticleBezierCurveNode(mode, controlPoint, endPoint) {
        if (controlPoint === void 0) { controlPoint = null; }
        if (endPoint === void 0) { endPoint = null; }
        _super.call(this, "ParticleBezierCurve", mode, 6);
        this._pStateClass = ParticleBezierCurveState_1.default;
        this._iControlPoint = controlPoint || new Vector3D_1.default();
        this._iEndPoint = endPoint || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleBezierCurveNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var controlValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleBezierCurveState_1.default.BEZIER_CONTROL_INDEX, controlValue.index);
        var endValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleBezierCurveState_1.default.BEZIER_END_INDEX, endValue.index);
        var temp = registerCache.getFreeVertexVectorTemp();
        var rev_time = new ShaderRegisterElement_1.default(temp.regName, temp.index, 0);
        var time_2 = new ShaderRegisterElement_1.default(temp.regName, temp.index, 1);
        var time_temp = new ShaderRegisterElement_1.default(temp.regName, temp.index, 2);
        registerCache.addVertexTempUsages(temp, 1);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var distance = new ShaderRegisterElement_1.default(temp2.regName, temp2.index);
        registerCache.removeVertexTempUsage(temp);
        var code = "";
        code += "sub " + rev_time + "," + animationRegisterData.vertexOneConst + "," + animationRegisterData.vertexLife + "\n";
        code += "mul " + time_2 + "," + animationRegisterData.vertexLife + "," + animationRegisterData.vertexLife + "\n";
        code += "mul " + time_temp + "," + animationRegisterData.vertexLife + "," + rev_time + "\n";
        code += "mul " + time_temp + "," + time_temp + "," + animationRegisterData.vertexTwoConst + "\n";
        code += "mul " + distance + ".xyz," + time_temp + "," + controlValue + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        code += "mul " + distance + ".xyz," + time_2 + "," + endValue + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity) {
            code += "mul " + time_2 + "," + animationRegisterData.vertexLife + "," + animationRegisterData.vertexTwoConst + "\n";
            code += "sub " + time_temp + "," + animationRegisterData.vertexOneConst + "," + time_2 + "\n";
            code += "mul " + time_temp + "," + animationRegisterData.vertexTwoConst + "," + time_temp + "\n";
            code += "mul " + distance + ".xyz," + controlValue + "," + time_temp + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
            code += "mul " + distance + ".xyz," + endValue + "," + time_2 + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleBezierCurveNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleBezierCurveState":"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleBillboardState_1 = require("../../animators/states/ParticleBillboardState");
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
        _super.call(this, "ParticleBillboard", ParticlePropertiesMode_1.default.GLOBAL, 0, 4);
        this._pStateClass = ParticleBillboardState_1.default;
        this._iBillboardAxis = billboardAxis;
    }
    /**
     * @inheritDoc
     */
    ParticleBillboardNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var rotationMatrixRegister = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleBillboardState_1.default.MATRIX_INDEX, rotationMatrixRegister.index);
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        var temp = registerCache.getFreeVertexVectorTemp();
        var code = "m33 " + temp + ".xyz," + animationRegisterData.scaleAndRotateTarget + "," + rotationMatrixRegister + "\n" +
            "mov " + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
        var shaderRegisterElement;
        for (var i = 0; i < animationRegisterData.rotationRegisters.length; i++) {
            shaderRegisterElement = animationRegisterData.rotationRegisters[i];
            code += "m33 " + temp + ".xyz," + shaderRegisterElement + "," + rotationMatrixRegister + "\n" +
                "mov " + shaderRegisterElement + ".xyz," + shaderRegisterElement + "\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleBillboardNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleBillboardState":"awayjs-renderergl/lib/animators/states/ParticleBillboardState"}],"awayjs-renderergl/lib/animators/nodes/ParticleColorNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColorTransform_1 = require("awayjs-core/lib/geom/ColorTransform");
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleColorState_1 = require("../../animators/states/ParticleColorState");
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
    function ParticleColorNode(mode, usesMultiplier, usesOffset, usesCycle, usesPhase, startColor, endColor, cycleDuration, cyclePhase) {
        if (usesMultiplier === void 0) { usesMultiplier = true; }
        if (usesOffset === void 0) { usesOffset = true; }
        if (usesCycle === void 0) { usesCycle = false; }
        if (usesPhase === void 0) { usesPhase = false; }
        if (startColor === void 0) { startColor = null; }
        if (endColor === void 0) { endColor = null; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        _super.call(this, "ParticleColor", mode, (usesMultiplier && usesOffset) ? 16 : 8, ParticleAnimationSet_1.default.COLOR_PRIORITY);
        this._pStateClass = ParticleColorState_1.default;
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iStartColor = startColor || new ColorTransform_1.default();
        this._iEndColor = endColor || new ColorTransform_1.default();
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
    }
    /**
     * @inheritDoc
     */
    ParticleColorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        if (shader.usesFragmentAnimation) {
            var temp = registerCache.getFreeVertexVectorTemp();
            if (this._iUsesCycle) {
                var cycleConst = registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.default.CYCLE_INDEX, cycleConst.index);
                registerCache.addVertexTempUsages(temp, 1);
                var sin = registerCache.getFreeVertexSingleTemp();
                registerCache.removeVertexTempUsage(temp);
                code += "mul " + sin + "," + animationRegisterData.vertexTime + "," + cycleConst + ".x\n";
                if (this._iUsesPhase)
                    code += "add " + sin + "," + sin + "," + cycleConst + ".y\n";
                code += "sin " + sin + "," + sin + "\n";
            }
            if (this._iUsesMultiplier) {
                var startMultiplierValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
                var deltaMultiplierValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.default.START_MULTIPLIER_INDEX, startMultiplierValue.index);
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.default.DELTA_MULTIPLIER_INDEX, deltaMultiplierValue.index);
                code += "mul " + temp + "," + deltaMultiplierValue + "," + (this._iUsesCycle ? sin : animationRegisterData.vertexLife) + "\n";
                code += "add " + temp + "," + temp + "," + startMultiplierValue + "\n";
                code += "mul " + animationRegisterData.colorMulTarget + "," + temp + "," + animationRegisterData.colorMulTarget + "\n";
            }
            if (this._iUsesOffset) {
                var startOffsetValue = (this._pMode == ParticlePropertiesMode_1.default.LOCAL_STATIC) ? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
                var deltaOffsetValue = (this._pMode == ParticlePropertiesMode_1.default.LOCAL_STATIC) ? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.default.START_OFFSET_INDEX, startOffsetValue.index);
                animationRegisterData.setRegisterIndex(this, ParticleColorState_1.default.DELTA_OFFSET_INDEX, deltaOffsetValue.index);
                code += "mul " + temp + "," + deltaOffsetValue + "," + (this._iUsesCycle ? sin : animationRegisterData.vertexLife) + "\n";
                code += "add " + temp + "," + temp + "," + startOffsetValue + "\n";
                code += "add " + animationRegisterData.colorAddTarget + "," + temp + "," + animationRegisterData.colorAddTarget + "\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleColorNode;

},{"../../animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleColorState":"awayjs-renderergl/lib/animators/states/ParticleColorState","awayjs-core/lib/geom/ColorTransform":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleFollowNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleFollowState_1 = require("../../animators/states/ParticleFollowState");
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
        _super.call(this, "ParticleFollow", ParticlePropertiesMode_1.default.LOCAL_DYNAMIC, (usesPosition && usesRotation) ? 6 : 3, ParticleAnimationSet_1.default.POST_PRIORITY);
        this._pStateClass = ParticleFollowState_1.default;
        this._iUsesPosition = usesPosition;
        this._iUsesRotation = usesRotation;
        this._iSmooth = smooth;
    }
    /**
     * @inheritDoc
     */
    ParticleFollowNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        //TODO: use Quaternion to implement this function
        var code = "";
        if (this._iUsesRotation) {
            var rotationAttribute = registerCache.getFreeVertexAttribute();
            animationRegisterData.setRegisterIndex(this, ParticleFollowState_1.default.FOLLOW_ROTATION_INDEX, rotationAttribute.index);
            var temp1 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp1, 1);
            var temp2 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp2, 1);
            var temp3 = registerCache.getFreeVertexVectorTemp();
            var temp4;
            if (animationSet.hasBillboard) {
                registerCache.addVertexTempUsages(temp3, 1);
                temp4 = registerCache.getFreeVertexVectorTemp();
            }
            registerCache.removeVertexTempUsage(temp1);
            registerCache.removeVertexTempUsage(temp2);
            if (animationSet.hasBillboard)
                registerCache.removeVertexTempUsage(temp3);
            var len = animationRegisterData.rotationRegisters.length;
            var i;
            //x axis
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + animationRegisterData.vertexOneConst + "\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "sin " + temp3 + ".y," + rotationAttribute + ".x\n";
            code += "cos " + temp3 + ".z," + rotationAttribute + ".x\n";
            code += "mov " + temp2 + ".x," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".y," + temp3 + ".z\n";
            code += "neg " + temp2 + ".z," + temp3 + ".y\n";
            if (animationSet.hasBillboard)
                code += "m33 " + temp4 + ".xyz," + animationRegisterData.positionTarget + ".xyz," + temp1 + "\n";
            else {
                code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
            }
            //y axis
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "cos " + temp1 + ".x," + rotationAttribute + ".y\n";
            code += "sin " + temp1 + ".z," + rotationAttribute + ".y\n";
            code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".y," + animationRegisterData.vertexOneConst + "\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "neg " + temp3 + ".x," + temp1 + ".z\n";
            code += "mov " + temp3 + ".z," + temp1 + ".x\n";
            if (animationSet.hasBillboard)
                code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
            else {
                code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
            }
            //z axis
            code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "sin " + temp2 + ".x," + rotationAttribute + ".z\n";
            code += "cos " + temp2 + ".y," + rotationAttribute + ".z\n";
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp2 + ".y\n";
            code += "neg " + temp1 + ".y," + temp2 + ".x\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";
            if (animationSet.hasBillboard) {
                code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
                code += "sub " + temp4 + ".xyz," + temp4 + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
                code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp4 + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
            }
            else {
                code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                for (i = 0; i < len; i++)
                    code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
            }
        }
        if (this._iUsesPosition) {
            var positionAttribute = registerCache.getFreeVertexAttribute();
            animationRegisterData.setRegisterIndex(this, ParticleFollowState_1.default.FOLLOW_POSITION_INDEX, positionAttribute.index);
            code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + positionAttribute + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleFollowNode;

},{"../../animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleFollowState":"awayjs-renderergl/lib/animators/states/ParticleFollowState"}],"awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColorTransform_1 = require("awayjs-core/lib/geom/ColorTransform");
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleInitialColorState_1 = require("../../animators/states/ParticleInitialColorState");
/**
 *
 */
var ParticleInitialColorNode = (function (_super) {
    __extends(ParticleInitialColorNode, _super);
    function ParticleInitialColorNode(mode, usesMultiplier, usesOffset, initialColor) {
        if (usesMultiplier === void 0) { usesMultiplier = true; }
        if (usesOffset === void 0) { usesOffset = false; }
        if (initialColor === void 0) { initialColor = null; }
        _super.call(this, "ParticleInitialColor", mode, (usesMultiplier && usesOffset) ? 8 : 4, ParticleAnimationSet_1.default.COLOR_PRIORITY);
        this._pStateClass = ParticleInitialColorState_1.default;
        this._iUsesMultiplier = usesMultiplier;
        this._iUsesOffset = usesOffset;
        this._iInitialColor = initialColor || new ColorTransform_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleInitialColorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        if (shader.usesFragmentAnimation) {
            if (this._iUsesMultiplier) {
                var multiplierValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
                animationRegisterData.setRegisterIndex(this, ParticleInitialColorState_1.default.MULTIPLIER_INDEX, multiplierValue.index);
                code += "mul " + animationRegisterData.colorMulTarget + "," + multiplierValue + "," + animationRegisterData.colorMulTarget + "\n";
            }
            if (this._iUsesOffset) {
                var offsetValue = (this._pMode == ParticlePropertiesMode_1.default.LOCAL_STATIC) ? registerCache.getFreeVertexAttribute() : registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleInitialColorState_1.default.OFFSET_INDEX, offsetValue.index);
                code += "add " + animationRegisterData.colorAddTarget + "," + offsetValue + "," + animationRegisterData.colorAddTarget + "\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleInitialColorNode;

},{"../../animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleInitialColorState":"awayjs-renderergl/lib/animators/states/ParticleInitialColorState","awayjs-core/lib/geom/ColorTransform":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
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
    function ParticleNodeBase(name, mode, dataLength, priority) {
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
    ParticleNodeBase.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader.
     */
    ParticleNodeBase.prototype.getAGALFragmentCode = function (shader, animationSet, registerCache, animationRegisterData) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
     */
    ParticleNodeBase.prototype.getAGALUVCode = function (shader, animationSet, registerCache, animationRegisterData) {
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
}(AnimationNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleNodeBase;

},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleOrbitState_1 = require("../../animators/states/ParticleOrbitState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
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
    function ParticleOrbitNode(mode, usesEulers, usesCycle, usesPhase, radius, cycleDuration, cyclePhase, eulers) {
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
        this._pStateClass = ParticleOrbitState_1.default;
        this._iUsesEulers = usesEulers;
        this._iUsesCycle = usesCycle;
        this._iUsesPhase = usesPhase;
        this._iRadius = radius;
        this._iCycleDuration = cycleDuration;
        this._iCyclePhase = cyclePhase;
        this._iEulers = eulers || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleOrbitNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var orbitRegister = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleOrbitState_1.default.ORBIT_INDEX, orbitRegister.index);
        var eulersMatrixRegister = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleOrbitState_1.default.EULERS_INDEX, eulersMatrixRegister.index);
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        var temp1 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp1, 1);
        var distance = new ShaderRegisterElement_1.default(temp1.regName, temp1.index);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var cos = new ShaderRegisterElement_1.default(temp2.regName, temp2.index, 0);
        var sin = new ShaderRegisterElement_1.default(temp2.regName, temp2.index, 1);
        var degree = new ShaderRegisterElement_1.default(temp2.regName, temp2.index, 2);
        registerCache.removeVertexTempUsage(temp1);
        var code = "";
        if (this._iUsesCycle) {
            code += "mul " + degree + "," + animationRegisterData.vertexTime + "," + orbitRegister + ".y\n";
            if (this._iUsesPhase)
                code += "add " + degree + "," + degree + "," + orbitRegister + ".w\n";
        }
        else
            code += "mul " + degree + "," + animationRegisterData.vertexLife + "," + orbitRegister + ".y\n";
        code += "cos " + cos + "," + degree + "\n";
        code += "sin " + sin + "," + degree + "\n";
        code += "mul " + distance + ".x," + cos + "," + orbitRegister + ".x\n";
        code += "mul " + distance + ".y," + sin + "," + orbitRegister + ".x\n";
        code += "mov " + distance + ".wz" + animationRegisterData.vertexZeroConst + "\n";
        if (this._iUsesEulers)
            code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity) {
            code += "neg " + distance + ".x," + sin + "\n";
            code += "mov " + distance + ".y," + cos + "\n";
            code += "mov " + distance + ".zw," + animationRegisterData.vertexZeroConst + "\n";
            if (this._iUsesEulers)
                code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
            code += "mul " + distance + "," + distance + "," + orbitRegister + ".z\n";
            code += "div " + distance + "," + distance + "," + orbitRegister + ".y\n";
            if (!this._iUsesCycle)
                code += "div " + distance + "," + distance + "," + animationRegisterData.vertexLife + "\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleOrbitNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleOrbitState":"awayjs-renderergl/lib/animators/states/ParticleOrbitState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleOscillatorState_1 = require("../../animators/states/ParticleOscillatorState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
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
    function ParticleOscillatorNode(mode, oscillator) {
        if (oscillator === void 0) { oscillator = null; }
        _super.call(this, "ParticleOscillator", mode, 4);
        this._pStateClass = ParticleOscillatorState_1.default;
        this._iOscillator = oscillator || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleOscillatorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var oscillatorRegister = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleOscillatorState_1.default.OSCILLATOR_INDEX, oscillatorRegister.index);
        var temp = registerCache.getFreeVertexVectorTemp();
        var dgree = new ShaderRegisterElement_1.default(temp.regName, temp.index, 0);
        var sin = new ShaderRegisterElement_1.default(temp.regName, temp.index, 1);
        var cos = new ShaderRegisterElement_1.default(temp.regName, temp.index, 2);
        registerCache.addVertexTempUsages(temp, 1);
        var temp2 = registerCache.getFreeVertexVectorTemp();
        var distance = new ShaderRegisterElement_1.default(temp2.regName, temp2.index);
        registerCache.removeVertexTempUsage(temp);
        var code = "";
        code += "mul " + dgree + "," + animationRegisterData.vertexTime + "," + oscillatorRegister + ".w\n";
        code += "sin " + sin + "," + dgree + "\n";
        code += "mul " + distance + ".xyz," + sin + "," + oscillatorRegister + ".xyz\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity) {
            code += "cos " + cos + "," + dgree + "\n";
            code += "mul " + distance + ".xyz," + cos + "," + oscillatorRegister + ".xyz\n";
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleOscillatorNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleOscillatorState":"awayjs-renderergl/lib/animators/states/ParticleOscillatorState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticlePositionNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticlePositionState_1 = require("../../animators/states/ParticlePositionState");
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
    function ParticlePositionNode(mode, position) {
        if (position === void 0) { position = null; }
        _super.call(this, "ParticlePosition", mode, 3);
        this._pStateClass = ParticlePositionState_1.default;
        this._iPosition = position || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticlePositionNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var positionAttribute = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticlePositionState_1.default.POSITION_INDEX, positionAttribute.index);
        return "add " + animationRegisterData.positionTarget + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticlePositionNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticlePositionState":"awayjs-renderergl/lib/animators/states/ParticlePositionState","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleRotateToHeadingState_1 = require("../../animators/states/ParticleRotateToHeadingState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used to control the rotation of a particle to match its heading vector.
 */
var ParticleRotateToHeadingNode = (function (_super) {
    __extends(ParticleRotateToHeadingNode, _super);
    /**
     * Creates a new <code>ParticleBillboardNode</code>
     */
    function ParticleRotateToHeadingNode() {
        _super.call(this, "ParticleRotateToHeading", ParticlePropertiesMode_1.default.GLOBAL, 0, 3);
        this._pStateClass = ParticleRotateToHeadingState_1.default;
    }
    /**
     * @inheritDoc
     */
    ParticleRotateToHeadingNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        var len = animationRegisterData.rotationRegisters.length;
        var i;
        if (animationSet.hasBillboard) {
            var temp1 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp1, 1);
            var temp2 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp2, 1);
            var temp3 = registerCache.getFreeVertexVectorTemp();
            var rotationMatrixRegister = registerCache.getFreeVertexConstant();
            animationRegisterData.setRegisterIndex(this, ParticleRotateToHeadingState_1.default.MATRIX_INDEX, rotationMatrixRegister.index);
            registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
            registerCache.removeVertexTempUsage(temp1);
            registerCache.removeVertexTempUsage(temp2);
            //process the velocity
            code += "m33 " + temp1 + ".xyz," + animationRegisterData.velocityTarget + ".xyz," + rotationMatrixRegister + "\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
            code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";
            //temp3.x=cos,temp3.y=sin
            //only process z axis
            code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".x," + temp3 + ".y\n";
            code += "mov " + temp2 + ".y," + temp3 + ".x\n";
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp3 + ".x\n";
            code += "neg " + temp1 + ".y," + temp3 + ".y\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";
            code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
            for (i = 0; i < len; i++)
                code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
        }
        else {
            var nrmVel = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(nrmVel, 1);
            var xAxis = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(xAxis, 1);
            var R = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(R, 1);
            var R_rev = registerCache.getFreeVertexVectorTemp();
            var cos = new ShaderRegisterElement_1.default(R.regName, R.index, 3);
            var sin = new ShaderRegisterElement_1.default(R_rev.regName, R_rev.index, 3);
            var cos2 = new ShaderRegisterElement_1.default(nrmVel.regName, nrmVel.index, 3);
            var tempSingle = sin;
            registerCache.removeVertexTempUsage(nrmVel);
            registerCache.removeVertexTempUsage(xAxis);
            registerCache.removeVertexTempUsage(R);
            code += "mov " + xAxis + ".x," + animationRegisterData.vertexOneConst + "\n";
            code += "mov " + xAxis + ".yz," + animationRegisterData.vertexZeroConst + "\n";
            code += "nrm " + nrmVel + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
            code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
            code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
            //use R as temp to judge if nrm is (0,0,0).
            //if nrm is (0,0,0) ,change it to (0,0,1).
            code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
            code += "sge " + R + ".x," + animationRegisterData.vertexZeroConst + "," + R + ".x\n";
            code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";
            code += "add " + tempSingle + "," + cos2 + "," + animationRegisterData.vertexOneConst + "\n";
            code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
            code += "sqt " + cos + "," + tempSingle + "\n";
            code += "sub " + tempSingle + "," + animationRegisterData.vertexOneConst + "," + cos2 + "\n";
            code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
            code += "sqt " + sin + "," + tempSingle + "\n";
            code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            //use cos as R.w
            code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
            //use cos as R_rev.w
            //nrmVel and xAxis are used as temp register
            code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
            //use cos as R.w
            code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
            code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
            code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
            code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
            //code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," +R_rev + ".w\n";
            code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
            code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
            code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
            for (i = 0; i < len; i++) {
                //just repeat the calculate above
                //because of the limited registers, no need to optimise
                code += "mov " + xAxis + ".x," + animationRegisterData.vertexOneConst + "\n";
                code += "mov " + xAxis + ".yz," + animationRegisterData.vertexZeroConst + "\n";
                code += "nrm " + nrmVel + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
                code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
                code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                code += "sge " + R + ".x," + animationRegisterData.vertexZeroConst + "," + R + ".x\n";
                code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";
                code += "add " + tempSingle + "," + cos2 + "," + animationRegisterData.vertexOneConst + "\n";
                code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
                code += "sqt " + cos + "," + tempSingle + "\n";
                code += "sub " + tempSingle + "," + animationRegisterData.vertexOneConst + "," + cos2 + "\n";
                code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
                code += "sqt " + sin + "," + tempSingle + "\n";
                code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
                code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
                code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
                code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
                code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
                code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
                code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
                code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
                code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
                code += "add " + animationRegisterData.rotationRegisters[i] + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleRotateToHeadingNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleRotateToHeadingState":"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleRotateToPositionState_1 = require("../../animators/states/ParticleRotateToPositionState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 * A particle animation node used to control the rotation of a particle to face to a position
 */
var ParticleRotateToPositionNode = (function (_super) {
    __extends(ParticleRotateToPositionNode, _super);
    /**
     * Creates a new <code>ParticleRotateToPositionNode</code>
     */
    function ParticleRotateToPositionNode(mode, position) {
        if (position === void 0) { position = null; }
        _super.call(this, "ParticleRotateToPosition", mode, 3, 3);
        this._pStateClass = ParticleRotateToPositionState_1.default;
        this._iPosition = position || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleRotateToPositionNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var positionAttribute = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleRotateToPositionState_1.default.POSITION_INDEX, positionAttribute.index);
        var code = "";
        var len = animationRegisterData.rotationRegisters.length;
        var i;
        if (animationSet.hasBillboard) {
            var temp1 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp1, 1);
            var temp2 = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp2, 1);
            var temp3 = registerCache.getFreeVertexVectorTemp();
            var rotationMatrixRegister = registerCache.getFreeVertexConstant();
            animationRegisterData.setRegisterIndex(this, ParticleRotateToPositionState_1.default.MATRIX_INDEX, rotationMatrixRegister.index);
            registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
            registerCache.getFreeVertexConstant();
            registerCache.removeVertexTempUsage(temp1);
            registerCache.removeVertexTempUsage(temp2);
            //process the position
            code += "sub " + temp1 + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
            code += "m33 " + temp1 + ".xyz," + temp1 + ".xyz," + rotationMatrixRegister + "\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
            code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";
            //temp3.x=cos,temp3.y=sin
            //only process z axis
            code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp2 + ".x," + temp3 + ".y\n";
            code += "mov " + temp2 + ".y," + temp3 + ".x\n";
            code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp1 + ".x," + temp3 + ".x\n";
            code += "neg " + temp1 + ".y," + temp3 + ".y\n";
            code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
            code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";
            code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
            for (i = 0; i < len; i++)
                code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
        }
        else {
            var nrmDirection = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(nrmDirection, 1);
            var temp = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(temp, 1);
            var cos = new ShaderRegisterElement_1.default(temp.regName, temp.index, 0);
            var sin = new ShaderRegisterElement_1.default(temp.regName, temp.index, 1);
            var o_temp = new ShaderRegisterElement_1.default(temp.regName, temp.index, 2);
            var tempSingle = new ShaderRegisterElement_1.default(temp.regName, temp.index, 3);
            var R = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(R, 1);
            registerCache.removeVertexTempUsage(nrmDirection);
            registerCache.removeVertexTempUsage(temp);
            registerCache.removeVertexTempUsage(R);
            code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
            code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
            code += "mov " + sin + "," + nrmDirection + ".y\n";
            code += "mul " + cos + "," + sin + "," + sin + "\n";
            code += "sub " + cos + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
            code += "sqt " + cos + "," + cos + "\n";
            code += "mul " + R + ".x," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".y\n";
            code += "mul " + R + ".y," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";
            code += "mul " + R + ".z," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".y\n";
            code += "mul " + R + ".w," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";
            code += "sub " + animationRegisterData.scaleAndRotateTarget + ".y," + R + ".x," + R + ".y\n";
            code += "add " + animationRegisterData.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";
            code += "abs " + R + ".y," + nrmDirection + ".y\n";
            code += "sge " + R + ".z," + R + ".y," + animationRegisterData.vertexOneConst + "\n";
            code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
            //judgu if nrmDirection=(0,1,0);
            code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
            code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
            code += "sge " + tempSingle + "," + animationRegisterData.vertexZeroConst + "," + sin + "\n";
            code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
            code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
            code += "sub " + sin + "," + animationRegisterData.vertexOneConst + "," + tempSingle + "\n";
            code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
            code += "mov " + cos + "," + nrmDirection + ".z\n";
            code += "neg " + cos + "," + cos + "\n";
            code += "sub " + o_temp + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
            code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
            code += "add " + cos + "," + cos + "," + o_temp + "\n";
            code += "mul " + R + ".x," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".x\n";
            code += "mul " + R + ".y," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";
            code += "mul " + R + ".z," + sin + "," + animationRegisterData.scaleAndRotateTarget + ".x\n";
            code += "mul " + R + ".w," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".z\n";
            code += "sub " + animationRegisterData.scaleAndRotateTarget + ".x," + R + ".x," + R + ".y\n";
            code += "add " + animationRegisterData.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";
            for (i = 0; i < len; i++) {
                //just repeat the calculate above
                //because of the limited registers, no need to optimise
                code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
                code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                code += "mov " + sin + "," + nrmDirection + ".y\n";
                code += "mul " + cos + "," + sin + "," + sin + "\n";
                code += "sub " + cos + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
                code += "sqt " + cos + "," + cos + "\n";
                code += "mul " + R + ".x," + cos + "," + animationRegisterData.rotationRegisters[i] + ".y\n";
                code += "mul " + R + ".y," + sin + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
                code += "mul " + R + ".z," + sin + "," + animationRegisterData.rotationRegisters[i] + ".y\n";
                code += "mul " + R + ".w," + cos + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
                code += "sub " + animationRegisterData.rotationRegisters[i] + ".y," + R + ".x," + R + ".y\n";
                code += "add " + animationRegisterData.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
                code += "abs " + R + ".y," + nrmDirection + ".y\n";
                code += "sge " + R + ".z," + R + ".y," + animationRegisterData.vertexOneConst + "\n";
                code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
                code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
                code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                code += "sge " + tempSingle + "," + animationRegisterData.vertexZeroConst + "," + sin + "\n";
                code += "mov " + nrmDirection + ".y," + animationRegisterData.vertexZeroConst + "\n";
                code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                code += "sub " + sin + "," + animationRegisterData.vertexOneConst + "," + tempSingle + "\n";
                code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
                code += "mov " + cos + "," + nrmDirection + ".z\n";
                code += "neg " + cos + "," + cos + "\n";
                code += "sub " + o_temp + "," + animationRegisterData.vertexOneConst + "," + cos + "\n";
                code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
                code += "add " + cos + "," + cos + "," + o_temp + "\n";
                code += "mul " + R + ".x," + cos + "," + animationRegisterData.rotationRegisters[i] + ".x\n";
                code += "mul " + R + ".y," + sin + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
                code += "mul " + R + ".z," + sin + "," + animationRegisterData.rotationRegisters[i] + ".x\n";
                code += "mul " + R + ".w," + cos + "," + animationRegisterData.rotationRegisters[i] + ".z\n";
                code += "sub " + animationRegisterData.rotationRegisters[i] + ".x," + R + ".x," + R + ".y\n";
                code += "add " + animationRegisterData.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleRotateToPositionNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleRotateToPositionState":"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleRotationalVelocityState_1 = require("../../animators/states/ParticleRotationalVelocityState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
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
    function ParticleRotationalVelocityNode(mode, rotationalVelocity) {
        if (rotationalVelocity === void 0) { rotationalVelocity = null; }
        _super.call(this, "ParticleRotationalVelocity", mode, 4);
        this._pStateClass = ParticleRotationalVelocityState_1.default;
        this._iRotationalVelocity = rotationalVelocity || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleRotationalVelocityNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var rotationRegister = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleRotationalVelocityState_1.default.ROTATIONALVELOCITY_INDEX, rotationRegister.index);
        var nrmVel = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(nrmVel, 1);
        var xAxis = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(xAxis, 1);
        var temp = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(temp, 1);
        var Rtemp = new ShaderRegisterElement_1.default(temp.regName, temp.index);
        var R_rev = registerCache.getFreeVertexVectorTemp();
        R_rev = new ShaderRegisterElement_1.default(R_rev.regName, R_rev.index);
        var cos = new ShaderRegisterElement_1.default(Rtemp.regName, Rtemp.index, 3);
        var sin = new ShaderRegisterElement_1.default(R_rev.regName, R_rev.index, 3);
        registerCache.removeVertexTempUsage(nrmVel);
        registerCache.removeVertexTempUsage(xAxis);
        registerCache.removeVertexTempUsage(temp);
        var code = "";
        code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
        code += "mov " + nrmVel + ".w," + animationRegisterData.vertexZeroConst + "\n";
        code += "mul " + cos + "," + animationRegisterData.vertexTime + "," + rotationRegister + ".w\n";
        code += "sin " + sin + "," + cos + "\n";
        code += "cos " + cos + "," + cos + "\n";
        code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
        code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
        code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
        //nrmVel and xAxis are used as temp register
        code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
        code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
        code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
        code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
        //use cos as R_rev.w
        code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
        code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
        code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
        var len = animationRegisterData.rotationRegisters.length;
        for (var i = 0; i < len; i++) {
            code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
            code += "mov " + nrmVel + ".w," + animationRegisterData.vertexZeroConst + "\n";
            code += "mul " + cos + "," + animationRegisterData.vertexTime + "," + rotationRegister + ".w\n";
            code += "sin " + sin + "," + cos + "\n";
            code += "cos " + cos + "," + cos + "\n";
            code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
            code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
            code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.rotationRegisters[i] + "\n";
            code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
            code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterData.rotationRegisters[i] + "\n";
            code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
            code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
            code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
            code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
            code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
            code += "add " + animationRegisterData.rotationRegisters[i] + "," + Rtemp + ".xyz," + xAxis + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleRotationalVelocityNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleRotationalVelocityState":"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleScaleNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleScaleState_1 = require("../../animators/states/ParticleScaleState");
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
    function ParticleScaleNode(mode, usesCycle, usesPhase, minScale, maxScale, cycleDuration, cyclePhase) {
        if (minScale === void 0) { minScale = 1; }
        if (maxScale === void 0) { maxScale = 1; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        _super.call(this, "ParticleScale", mode, (usesCycle && usesPhase) ? 4 : ((usesCycle || usesPhase) ? 3 : 2), 3);
        this._pStateClass = ParticleScaleState_1.default;
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
    ParticleScaleNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        var temp = registerCache.getFreeVertexSingleTemp();
        var scaleRegister = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleScaleState_1.default.SCALE_INDEX, scaleRegister.index);
        if (this._iUsesCycle) {
            code += "mul " + temp + "," + animationRegisterData.vertexTime + "," + scaleRegister + ".z\n";
            if (this._iUsesPhase)
                code += "add " + temp + "," + temp + "," + scaleRegister + ".w\n";
            code += "sin " + temp + "," + temp + "\n";
        }
        code += "mul " + temp + "," + scaleRegister + ".y," + ((this._iUsesCycle) ? temp : animationRegisterData.vertexLife) + "\n";
        code += "add " + temp + "," + scaleRegister + ".x," + temp + "\n";
        code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleScaleNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleScaleState":"awayjs-renderergl/lib/animators/states/ParticleScaleState"}],"awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleSegmentedColorState_1 = require("../../animators/states/ParticleSegmentedColorState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
/**
 *
 */
var ParticleSegmentedColorNode = (function (_super) {
    __extends(ParticleSegmentedColorNode, _super);
    function ParticleSegmentedColorNode(usesMultiplier, usesOffset, numSegmentPoint, startColor, endColor, segmentPoints) {
        //because of the stage3d register limitation, it only support the global mode
        _super.call(this, "ParticleSegmentedColor", ParticlePropertiesMode_1.default.GLOBAL, 0, ParticleAnimationSet_1.default.COLOR_PRIORITY);
        this._pStateClass = ParticleSegmentedColorState_1.default;
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
    ParticleSegmentedColorNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        if (shader.usesFragmentAnimation) {
            var accMultiplierColor;
            //var accOffsetColor:ShaderRegisterElement;
            if (this._iUsesMultiplier) {
                accMultiplierColor = registerCache.getFreeVertexVectorTemp();
                registerCache.addVertexTempUsages(accMultiplierColor, 1);
            }
            var tempColor = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(tempColor, 1);
            var temp = registerCache.getFreeVertexVectorTemp();
            var accTime = new ShaderRegisterElement_1.default(temp.regName, temp.index, 0);
            var tempTime = new ShaderRegisterElement_1.default(temp.regName, temp.index, 1);
            if (this._iUsesMultiplier)
                registerCache.removeVertexTempUsage(accMultiplierColor);
            registerCache.removeVertexTempUsage(tempColor);
            //for saving all the life values (at most 4)
            var lifeTimeRegister = registerCache.getFreeVertexConstant();
            animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState_1.default.TIME_DATA_INDEX, lifeTimeRegister.index);
            var i;
            var startMulValue;
            var deltaMulValues;
            if (this._iUsesMultiplier) {
                startMulValue = registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState_1.default.START_MULTIPLIER_INDEX, startMulValue.index);
                deltaMulValues = new Array();
                for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                    deltaMulValues.push(registerCache.getFreeVertexConstant());
            }
            var startOffsetValue;
            var deltaOffsetValues;
            if (this._iUsesOffset) {
                startOffsetValue = registerCache.getFreeVertexConstant();
                animationRegisterData.setRegisterIndex(this, ParticleSegmentedColorState_1.default.START_OFFSET_INDEX, startOffsetValue.index);
                deltaOffsetValues = new Array();
                for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                    deltaOffsetValues.push(registerCache.getFreeVertexConstant());
            }
            if (this._iUsesMultiplier)
                code += "mov " + accMultiplierColor + "," + startMulValue + "\n";
            if (this._iUsesOffset)
                code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + startOffsetValue + "\n";
            for (i = 0; i < this._iNumSegmentPoint; i++) {
                switch (i) {
                    case 0:
                        code += "min " + tempTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
                        break;
                    case 1:
                        code += "sub " + accTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".y\n";
                        break;
                    case 2:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".z\n";
                        break;
                    case 3:
                        code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
                        code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".w\n";
                        break;
                }
                if (this._iUsesMultiplier) {
                    code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[i] + "\n";
                    code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                }
                if (this._iUsesOffset) {
                    code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[i] + "\n";
                    code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + tempColor + "\n";
                }
            }
            //for the last segment:
            if (this._iNumSegmentPoint == 0)
                tempTime = animationRegisterData.vertexLife;
            else {
                switch (this._iNumSegmentPoint) {
                    case 1:
                        code += "sub " + accTime + "," + animationRegisterData.vertexLife + "," + lifeTimeRegister + ".x\n";
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
                code += "max " + tempTime + "," + accTime + "," + animationRegisterData.vertexZeroConst + "\n";
            }
            if (this._iUsesMultiplier) {
                code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[this._iNumSegmentPoint] + "\n";
                code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                code += "mul " + animationRegisterData.colorMulTarget + "," + animationRegisterData.colorMulTarget + "," + accMultiplierColor + "\n";
            }
            if (this._iUsesOffset) {
                code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[this._iNumSegmentPoint] + "\n";
                code += "add " + animationRegisterData.colorAddTarget + "," + animationRegisterData.colorAddTarget + "," + tempColor + "\n";
            }
        }
        return code;
    };
    return ParticleSegmentedColorNode;
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleSegmentedColorNode;

},{"../../animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleSegmentedColorState":"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleSpriteSheetState_1 = require("../../animators/states/ParticleSpriteSheetState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
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
    function ParticleSpriteSheetNode(mode, usesCycle, usesPhase, numColumns, numRows, cycleDuration, cyclePhase, totalFrames) {
        if (numColumns === void 0) { numColumns = 1; }
        if (numRows === void 0) { numRows = 1; }
        if (cycleDuration === void 0) { cycleDuration = 1; }
        if (cyclePhase === void 0) { cyclePhase = 0; }
        if (totalFrames === void 0) { totalFrames = Number.MAX_VALUE; }
        _super.call(this, "ParticleSpriteSheet", mode, usesCycle ? (usesPhase ? 3 : 2) : 1, ParticleAnimationSet_1.default.POST_PRIORITY + 1);
        this._pStateClass = ParticleSpriteSheetState_1.default;
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
    ParticleSpriteSheetNode.prototype.getAGALUVCode = function (shader, animationSet, registerCache, animationRegisterData) {
        //get 2 vc
        var uvParamConst1 = registerCache.getFreeVertexConstant();
        var uvParamConst2 = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleSpriteSheetState_1.default.UV_INDEX_0, uvParamConst1.index);
        animationRegisterData.setRegisterIndex(this, ParticleSpriteSheetState_1.default.UV_INDEX_1, uvParamConst2.index);
        var uTotal = new ShaderRegisterElement_1.default(uvParamConst1.regName, uvParamConst1.index, 0);
        var uStep = new ShaderRegisterElement_1.default(uvParamConst1.regName, uvParamConst1.index, 1);
        var vStep = new ShaderRegisterElement_1.default(uvParamConst1.regName, uvParamConst1.index, 2);
        var uSpeed = new ShaderRegisterElement_1.default(uvParamConst2.regName, uvParamConst2.index, 0);
        var cycle = new ShaderRegisterElement_1.default(uvParamConst2.regName, uvParamConst2.index, 1);
        var phaseTime = new ShaderRegisterElement_1.default(uvParamConst2.regName, uvParamConst2.index, 2);
        var temp = registerCache.getFreeVertexVectorTemp();
        var time = new ShaderRegisterElement_1.default(temp.regName, temp.index, 0);
        var vOffset = new ShaderRegisterElement_1.default(temp.regName, temp.index, 1);
        temp = new ShaderRegisterElement_1.default(temp.regName, temp.index, 2);
        var temp2 = new ShaderRegisterElement_1.default(temp.regName, temp.index, 3);
        var u = new ShaderRegisterElement_1.default(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, 0);
        var v = new ShaderRegisterElement_1.default(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, 1);
        var code = "";
        //scale uv
        code += "mul " + u + "," + u + "," + uStep + "\n";
        if (this._iNumRows > 1)
            code += "mul " + v + "," + v + "," + vStep + "\n";
        if (this._iUsesCycle) {
            if (this._iUsesPhase)
                code += "add " + time + "," + animationRegisterData.vertexTime + "," + phaseTime + "\n";
            else
                code += "mov " + time + "," + animationRegisterData.vertexTime + "\n";
            code += "div " + time + "," + time + "," + cycle + "\n";
            code += "frc " + time + "," + time + "\n";
            code += "mul " + time + "," + time + "," + cycle + "\n";
            code += "mul " + temp + "," + time + "," + uSpeed + "\n";
        }
        else
            code += "mul " + temp.toString() + "," + animationRegisterData.vertexLife + "," + uTotal + "\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleSpriteSheetNode;

},{"../../animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleSpriteSheetState":"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleTimeState_1 = require("../../animators/states/ParticleTimeState");
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
        _super.call(this, "ParticleTime", ParticlePropertiesMode_1.default.LOCAL_STATIC, 4, 0);
        this._pStateClass = ParticleTimeState_1.default;
        this._iUsesDuration = usesDuration;
        this._iUsesLooping = usesLooping;
        this._iUsesDelay = usesDelay;
    }
    /**
     * @inheritDoc
     */
    ParticleTimeNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var timeStreamRegister = registerCache.getFreeVertexAttribute(); //timeStreamRegister.x is start，timeStreamRegister.y is during time
        animationRegisterData.setRegisterIndex(this, ParticleTimeState_1.default.TIME_STREAM_INDEX, timeStreamRegister.index);
        var timeConst = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleTimeState_1.default.TIME_CONSTANT_INDEX, timeConst.index);
        var code = "";
        code += "sub " + animationRegisterData.vertexTime + "," + timeConst + "," + timeStreamRegister + ".x\n";
        //if time=0,set the position to zero.
        var temp = registerCache.getFreeVertexSingleTemp();
        code += "sge " + temp + "," + animationRegisterData.vertexTime + "," + animationRegisterData.vertexZeroConst + "\n";
        code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp + "\n";
        if (this._iUsesDuration) {
            if (this._iUsesLooping) {
                var div = registerCache.getFreeVertexSingleTemp();
                if (this._iUsesDelay) {
                    code += "div " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".z\n";
                    code += "frc " + div + "," + div + "\n";
                    code += "mul " + animationRegisterData.vertexTime + "," + div + "," + timeStreamRegister + ".z\n";
                    code += "slt " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".y\n";
                    code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + div + "\n";
                }
                else {
                    code += "mul " + div + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".w\n";
                    code += "frc " + div + "," + div + "\n";
                    code += "mul " + animationRegisterData.vertexTime + "," + div + "," + timeStreamRegister + ".y\n";
                }
            }
            else {
                var sge = registerCache.getFreeVertexSingleTemp();
                code += "sge " + sge + "," + timeStreamRegister + ".y," + animationRegisterData.vertexTime + "\n";
                code += "mul " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + sge + "\n";
            }
        }
        code += "mul " + animationRegisterData.vertexLife + "," + animationRegisterData.vertexTime + "," + timeStreamRegister + ".w\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleTimeNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleTimeState":"awayjs-renderergl/lib/animators/states/ParticleTimeState"}],"awayjs-renderergl/lib/animators/nodes/ParticleUVNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticleAnimationSet_1 = require("../../animators/ParticleAnimationSet");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleUVState_1 = require("../../animators/states/ParticleUVState");
var ShaderRegisterElement_1 = require("../../shaders/ShaderRegisterElement");
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
    function ParticleUVNode(mode, cycle, scale, axis) {
        if (cycle === void 0) { cycle = 1; }
        if (scale === void 0) { scale = 1; }
        if (axis === void 0) { axis = "x"; }
        //because of the stage3d register limitation, it only support the global mode
        _super.call(this, "ParticleUV", ParticlePropertiesMode_1.default.GLOBAL, 4, ParticleAnimationSet_1.default.POST_PRIORITY + 1);
        this._pStateClass = ParticleUVState_1.default;
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
    ParticleUVNode.prototype.getAGALUVCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var code = "";
        var uvConst = registerCache.getFreeVertexConstant();
        animationRegisterData.setRegisterIndex(this, ParticleUVState_1.default.UV_INDEX, uvConst.index);
        var axisIndex = this._axis == "x" ? 0 : (this._axis == "y" ? 1 : 2);
        var target = new ShaderRegisterElement_1.default(animationRegisterData.uvTarget.regName, animationRegisterData.uvTarget.index, axisIndex);
        var sin = registerCache.getFreeVertexSingleTemp();
        if (this._scale != 1)
            code += "mul " + target + "," + target + "," + uvConst + ".y\n";
        code += "mul " + sin + "," + animationRegisterData.vertexTime + "," + uvConst + ".x\n";
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
        this._iUvData = new Vector3D_1.default(Math.PI * 2 / this._cycle, this._scale, 0, 0);
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleUVNode;

},{"../../animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleUVState":"awayjs-renderergl/lib/animators/states/ParticleUVState","../../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleNodeBase_1 = require("../../animators/nodes/ParticleNodeBase");
var ParticleVelocityState_1 = require("../../animators/states/ParticleVelocityState");
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
    function ParticleVelocityNode(mode, velocity) {
        if (velocity === void 0) { velocity = null; }
        _super.call(this, "ParticleVelocity", mode, 3);
        this._pStateClass = ParticleVelocityState_1.default;
        this._iVelocity = velocity || new Vector3D_1.default();
    }
    /**
     * @inheritDoc
     */
    ParticleVelocityNode.prototype.getAGALVertexCode = function (shader, animationSet, registerCache, animationRegisterData) {
        var velocityValue = (this._pMode == ParticlePropertiesMode_1.default.GLOBAL) ? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
        animationRegisterData.setRegisterIndex(this, ParticleVelocityState_1.default.VELOCITY_INDEX, velocityValue.index);
        var distance = registerCache.getFreeVertexVectorTemp();
        var code = "";
        code += "mul " + distance + "," + animationRegisterData.vertexTime + "," + velocityValue + "\n";
        code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + "," + animationRegisterData.positionTarget + ".xyz\n";
        if (animationSet.needVelocity)
            code += "add " + animationRegisterData.velocityTarget + ".xyz," + velocityValue + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
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
}(ParticleNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleVelocityNode;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","../../animators/states/ParticleVelocityState":"awayjs-renderergl/lib/animators/states/ParticleVelocityState","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonBinaryLERPState_1 = require("../../animators/states/SkeletonBinaryLERPState");
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
        this._pStateClass = SkeletonBinaryLERPState_1.default;
    }
    /**
     * @inheritDoc
     */
    SkeletonBinaryLERPNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonBinaryLERPNode;
}(AnimationNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonBinaryLERPNode;

},{"../../animators/states/SkeletonBinaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState","awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonClipNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationClipNodeBase_1 = require("../../animators/nodes/AnimationClipNodeBase");
var SkeletonClipState_1 = require("../../animators/states/SkeletonClipState");
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
        this._pStateClass = SkeletonClipState_1.default;
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
    SkeletonClipNode.prototype.addFrame = function (skeletonPose, duration) {
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
}(AnimationClipNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonClipNode;

},{"../../animators/nodes/AnimationClipNodeBase":"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase","../../animators/states/SkeletonClipState":"awayjs-renderergl/lib/animators/states/SkeletonClipState"}],"awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonDifferenceState_1 = require("../../animators/states/SkeletonDifferenceState");
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
        this._pStateClass = SkeletonDifferenceState_1.default;
    }
    /**
     * @inheritDoc
     */
    SkeletonDifferenceNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonDifferenceNode;
}(AnimationNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonDifferenceNode;

},{"../../animators/states/SkeletonDifferenceState":"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState","awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonDirectionalState_1 = require("../../animators/states/SkeletonDirectionalState");
/**
 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
 */
var SkeletonDirectionalNode = (function (_super) {
    __extends(SkeletonDirectionalNode, _super);
    function SkeletonDirectionalNode() {
        _super.call(this);
        this._pStateClass = SkeletonDirectionalState_1.default;
    }
    /**
     * @inheritDoc
     */
    SkeletonDirectionalNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    return SkeletonDirectionalNode;
}(AnimationNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonDirectionalNode;

},{"../../animators/states/SkeletonDirectionalState":"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState","awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationNodeBase_1 = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
var SkeletonNaryLERPState_1 = require("../../animators/states/SkeletonNaryLERPState");
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
        this._pStateClass = SkeletonNaryLERPState_1.default;
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
    SkeletonNaryLERPNode.prototype.getInputAt = function (index) {
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
}(AnimationNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonNaryLERPNode;

},{"../../animators/states/SkeletonNaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState","awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined}],"awayjs-renderergl/lib/animators/nodes/VertexClipNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var AnimationClipNodeBase_1 = require("../../animators/nodes/AnimationClipNodeBase");
var VertexClipState_1 = require("../../animators/states/VertexClipState");
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
        this._pStateClass = VertexClipState_1.default;
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
     * @param translation The absolute translation of the frame, used in root delta calculations for sprite movement.
     */
    VertexClipNode.prototype.addFrame = function (geometry, duration, translation) {
        if (translation === void 0) { translation = null; }
        this._frames.push(geometry);
        this._pDurations.push(duration);
        this._translations.push(translation || new Vector3D_1.default());
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
}(AnimationClipNodeBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VertexClipNode;

},{"../../animators/nodes/AnimationClipNodeBase":"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase","../../animators/states/VertexClipState":"awayjs-renderergl/lib/animators/states/VertexClipState","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/states/AnimationClipState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
var AnimationStateEvent_1 = require("../../events/AnimationStateEvent");
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
    AnimationClipState.prototype.update = function (time) {
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
    AnimationClipState.prototype._pUpdateTime = function (time) {
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
            var dur = 0, frameTime;
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
            this._animationStatePlaybackComplete = new AnimationStateEvent_1.default(AnimationStateEvent_1.default.PLAYBACK_COMPLETE, this._pAnimator, this, this._animationClipNode);
        this._animationClipNode.dispatchEvent(this._animationStatePlaybackComplete);
    };
    return AnimationClipState;
}(AnimationStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationClipState;

},{"../../animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase","../../events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent"}],"awayjs-renderergl/lib/animators/states/AnimationStateBase":[function(require,module,exports){
"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
/**
 *
 */
var AnimationStateBase = (function () {
    function AnimationStateBase(animator, animationNode) {
        this._pRootDelta = new Vector3D_1.default();
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationStateBase;

},{"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/states/IAnimationState":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/animators/states/ISkeletonAnimationState":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/animators/states/IVertexAnimationState":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/animators/states/ParticleAccelerationState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleAccelerationState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleAccelerationState.ACCELERATION_INDEX);
        if (this._particleAccelerationNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC)
            animationElements.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
        else
            shader.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
    };
    ParticleAccelerationState.prototype.updateAccelerationData = function () {
        if (this._particleAccelerationNode.mode == ParticlePropertiesMode_1.default.GLOBAL)
            this._halfAcceleration = new Vector3D_1.default(this._acceleration.x / 2, this._acceleration.y / 2, this._acceleration.z / 2);
    };
    /** @private */
    ParticleAccelerationState.ACCELERATION_INDEX = 0;
    return ParticleAccelerationState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleAccelerationState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleBezierCurveState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var controlIndex = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_CONTROL_INDEX);
        var endIndex = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_END_INDEX);
        if (this._particleBezierCurveNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
            animationElements.activateVertexBuffer(controlIndex, this._particleBezierCurveNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
            animationElements.activateVertexBuffer(endIndex, this._particleBezierCurveNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
        }
        else {
            shader.setVertexConst(controlIndex, this._controlPoint.x, this._controlPoint.y, this._controlPoint.z);
            shader.setVertexConst(endIndex, this._endPoint.x, this._endPoint.y, this._endPoint.z);
        }
    };
    /** @private */
    ParticleBezierCurveState.BEZIER_CONTROL_INDEX = 0;
    /** @private */
    ParticleBezierCurveState.BEZIER_END_INDEX = 1;
    return ParticleBezierCurveState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleBezierCurveState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleBillboardState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Orientation3D_1 = require("awayjs-core/lib/geom/Orientation3D");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
        this._matrix = new Matrix3D_1.default;
        this._billboardAxis = particleNode._iBillboardAxis;
    }
    ParticleBillboardState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
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
            comps = this._matrix.decompose(Orientation3D_1.default.AXIS_ANGLE);
            this._matrix.copyColumnFrom(0, right);
            this._matrix.copyColumnFrom(1, this.billboardAxis);
            this._matrix.copyColumnFrom(2, look);
            this._matrix.copyColumnFrom(3, pos);
            this._matrix.appendRotation(-comps[1].w * MathConsts_1.default.RADIANS_TO_DEGREES, comps[1]);
        }
        else {
            //create a quick inverse projection matrix
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            //decompose using axis angle rotations
            comps = this._matrix.decompose(Orientation3D_1.default.AXIS_ANGLE);
            //recreate the matrix with just the rotation data
            this._matrix.identity();
            this._matrix.appendRotation(-comps[1].w * MathConsts_1.default.RADIANS_TO_DEGREES, comps[1]);
        }
        //set a new matrix transform constant
        shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBillboardState.MATRIX_INDEX), this._matrix);
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
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleBillboardState;

},{"../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Orientation3D":undefined}],"awayjs-renderergl/lib/animators/states/ParticleColorState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleColorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (shader.usesFragmentAnimation) {
            var dataOffset = this._particleColorNode._iDataOffset;
            var index;
            if (this._usesCycle)
                shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.CYCLE_INDEX), this._cycleData.x, this._cycleData.y, this._cycleData.z, this._cycleData.w);
            if (this._usesMultiplier) {
                if (this._particleColorNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
                    dataOffset += 4;
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
                    dataOffset += 4;
                }
                else {
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_MULTIPLIER_INDEX), this._startMultiplierData.x, this._startMultiplierData.y, this._startMultiplierData.z, this._startMultiplierData.w);
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_MULTIPLIER_INDEX), this._deltaMultiplierData.x, this._deltaMultiplierData.y, this._deltaMultiplierData.z, this._deltaMultiplierData.w);
                }
            }
            if (this._usesOffset) {
                if (this._particleColorNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
                    dataOffset += 4;
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
                }
                else {
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.START_OFFSET_INDEX), this._startOffsetData.x, this._startOffsetData.y, this._startOffsetData.z, this._startOffsetData.w);
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleColorState.DELTA_OFFSET_INDEX), this._deltaOffsetData.x, this._deltaOffsetData.y, this._deltaOffsetData.z, this._deltaOffsetData.w);
                }
            }
        }
    };
    ParticleColorState.prototype.updateColorData = function () {
        if (this._usesCycle) {
            if (this._cycleDuration <= 0)
                throw (new Error("the cycle duration must be greater than zero"));
            this._cycleData = new Vector3D_1.default(Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180, 0, 0);
        }
        if (this._particleColorNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            if (this._usesCycle) {
                if (this._usesMultiplier) {
                    this._startMultiplierData = new Vector3D_1.default((this._startColor.redMultiplier + this._endColor.redMultiplier) / 2, (this._startColor.greenMultiplier + this._endColor.greenMultiplier) / 2, (this._startColor.blueMultiplier + this._endColor.blueMultiplier) / 2, (this._startColor.alphaMultiplier + this._endColor.alphaMultiplier) / 2);
                    this._deltaMultiplierData = new Vector3D_1.default((this._endColor.redMultiplier - this._startColor.redMultiplier) / 2, (this._endColor.greenMultiplier - this._startColor.greenMultiplier) / 2, (this._endColor.blueMultiplier - this._startColor.blueMultiplier) / 2, (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier) / 2);
                }
                if (this._usesOffset) {
                    this._startOffsetData = new Vector3D_1.default((this._startColor.redOffset + this._endColor.redOffset) / (255 * 2), (this._startColor.greenOffset + this._endColor.greenOffset) / (255 * 2), (this._startColor.blueOffset + this._endColor.blueOffset) / (255 * 2), (this._startColor.alphaOffset + this._endColor.alphaOffset) / (255 * 2));
                    this._deltaOffsetData = new Vector3D_1.default((this._endColor.redOffset - this._startColor.redOffset) / (255 * 2), (this._endColor.greenOffset - this._startColor.greenOffset) / (255 * 2), (this._endColor.blueOffset - this._startColor.blueOffset) / (255 * 2), (this._endColor.alphaOffset - this._startColor.alphaOffset) / (255 * 2));
                }
            }
            else {
                if (this._usesMultiplier) {
                    this._startMultiplierData = new Vector3D_1.default(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
                    this._deltaMultiplierData = new Vector3D_1.default((this._endColor.redMultiplier - this._startColor.redMultiplier), (this._endColor.greenMultiplier - this._startColor.greenMultiplier), (this._endColor.blueMultiplier - this._startColor.blueMultiplier), (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier));
                }
                if (this._usesOffset) {
                    this._startOffsetData = new Vector3D_1.default(this._startColor.redOffset / 255, this._startColor.greenOffset / 255, this._startColor.blueOffset / 255, this._startColor.alphaOffset / 255);
                    this._deltaOffsetData = new Vector3D_1.default((this._endColor.redOffset - this._startColor.redOffset) / 255, (this._endColor.greenOffset - this._startColor.greenOffset) / 255, (this._endColor.blueOffset - this._startColor.blueOffset) / 255, (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255);
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
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleColorState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleFollowState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleFollowState = (function (_super) {
    __extends(ParticleFollowState, _super);
    function ParticleFollowState(animator, particleFollowNode) {
        _super.call(this, animator, particleFollowNode, true);
        this._targetPos = new Vector3D_1.default();
        this._targetEuler = new Vector3D_1.default();
        //temporary vector3D for calculation
        this._temp = new Vector3D_1.default();
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
    ParticleFollowState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
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
                this._targetEuler.scaleBy(MathConsts_1.default.DEGREES_TO_RADIANS);
            }
        }
        //initialization
        if (!this._prePos)
            this._prePos = this._targetPos.clone();
        if (!this._preEuler)
            this._preEuler = this._targetEuler.clone();
        var currentTime = this._pTime / 1000;
        var previousTime = animationElements.previousTime;
        var deltaTime = currentTime - previousTime;
        var needProcess = previousTime != currentTime;
        if (this._particleFollowNode._iUsesPosition && this._particleFollowNode._iUsesRotation) {
            if (needProcess)
                this.processPositionAndRotation(currentTime, deltaTime, animationElements);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
        }
        else if (this._particleFollowNode._iUsesPosition) {
            if (needProcess)
                this.processPosition(currentTime, deltaTime, animationElements);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
        }
        else if (this._particleFollowNode._iUsesRotation) {
            if (needProcess)
                this.precessRotation(currentTime, deltaTime, animationElements);
            animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleFollowState.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
        }
        this._prePos.copyFrom(this._targetPos);
        this._targetEuler.copyFrom(this._targetEuler);
        animationElements.previousTime = currentTime;
    };
    ParticleFollowState.prototype.processPosition = function (currentTime, deltaTime, animationElements) {
        var data = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
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
                var inc = data[i].startVertexIndex * animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
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
            animationElements.invalidateBuffer();
    };
    ParticleFollowState.prototype.precessRotation = function (currentTime, deltaTime, animationElements) {
        var data = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
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
                var inc = data[i].startVertexIndex * animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
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
            animationElements.invalidateBuffer();
    };
    ParticleFollowState.prototype.processPositionAndRotation = function (currentTime, deltaTime, animationElements) {
        var data = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
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
                var inc = data[i].startVertexIndex * animationElements.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
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
            animationElements.invalidateBuffer();
    };
    /** @private */
    ParticleFollowState.FOLLOW_POSITION_INDEX = 0;
    /** @private */
    ParticleFollowState.FOLLOW_ROTATION_INDEX = 1;
    return ParticleFollowState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleFollowState;

},{"../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleInitialColorState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleInitialColorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (shader.usesFragmentAnimation) {
            var index;
            if (this._particleInitialColorNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
                var dataOffset = this._particleInitialColorNode._iDataOffset;
                if (this._usesMultiplier) {
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
                    dataOffset += 4;
                }
                if (this._usesOffset)
                    animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
            }
            else {
                if (this._usesMultiplier)
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.MULTIPLIER_INDEX), this._multiplierData.x, this._multiplierData.y, this._multiplierData.z, this._multiplierData.w);
                if (this._usesOffset)
                    shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleInitialColorState.OFFSET_INDEX), this._offsetData.x, this._offsetData.y, this._offsetData.z, this._offsetData.w);
            }
        }
    };
    ParticleInitialColorState.prototype.updateColorData = function () {
        if (this._particleInitialColorNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            if (this._usesMultiplier)
                this._multiplierData = new Vector3D_1.default(this._initialColor.redMultiplier, this._initialColor.greenMultiplier, this._initialColor.blueMultiplier, this._initialColor.alphaMultiplier);
            if (this._usesOffset)
                this._offsetData = new Vector3D_1.default(this._initialColor.redOffset / 255, this._initialColor.greenOffset / 255, this._initialColor.blueOffset / 255, this._initialColor.alphaOffset / 255);
        }
    };
    /** @private */
    ParticleInitialColorState.MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleInitialColorState.OFFSET_INDEX = 1;
    return ParticleInitialColorState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleInitialColorState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleOrbitState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleOrbitState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.ORBIT_INDEX);
        if (this._particleOrbitNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
            if (this._usesPhase)
                animationElements.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
            else
                animationElements.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
        }
        else
            shader.setVertexConst(index, this._orbitData.x, this._orbitData.y, this._orbitData.z, this._orbitData.w);
        if (this._usesEulers)
            shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOrbitState.EULERS_INDEX), this._eulersMatrix);
    };
    ParticleOrbitState.prototype.updateOrbitData = function () {
        if (this._usesEulers) {
            this._eulersMatrix = new Matrix3D_1.default();
            this._eulersMatrix.appendRotation(this._eulers.x, Vector3D_1.default.X_AXIS);
            this._eulersMatrix.appendRotation(this._eulers.y, Vector3D_1.default.Y_AXIS);
            this._eulersMatrix.appendRotation(this._eulers.z, Vector3D_1.default.Z_AXIS);
        }
        if (this._particleOrbitNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            this._orbitData = new Vector3D_1.default(this._radius, 0, this._radius * Math.PI * 2, this._cyclePhase * Math.PI / 180);
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
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleOrbitState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleOscillatorState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleOscillatorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleOscillatorState.OSCILLATOR_INDEX);
        if (this._particleOscillatorNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC)
            animationElements.activateVertexBuffer(index, this._particleOscillatorNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
        else
            shader.setVertexConst(index, this._oscillatorData.x, this._oscillatorData.y, this._oscillatorData.z, this._oscillatorData.w);
    };
    ParticleOscillatorState.prototype.updateOscillatorData = function () {
        if (this._particleOscillatorNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            if (this._oscillator.w <= 0)
                throw (new Error("the cycle duration must greater than zero"));
            if (this._oscillatorData == null)
                this._oscillatorData = new Vector3D_1.default();
            this._oscillatorData.x = this._oscillator.x;
            this._oscillatorData.y = this._oscillator.y;
            this._oscillatorData.z = this._oscillator.z;
            this._oscillatorData.w = Math.PI * 2 / this._oscillator.w;
        }
    };
    /** @private */
    ParticleOscillatorState.OSCILLATOR_INDEX = 0;
    return ParticleOscillatorState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleOscillatorState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticlePositionState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticlePositionState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._particlePositionNode.mode == ParticlePropertiesMode_1.default.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
            this._pUpdateDynamicProperties(animationElements);
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);
        if (this._particlePositionNode.mode == ParticlePropertiesMode_1.default.GLOBAL)
            shader.setVertexConst(index, this._position.x, this._position.y, this._position.z);
        else
            animationElements.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
    };
    /** @private */
    ParticlePositionState.POSITION_INDEX = 0;
    return ParticlePositionState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticlePositionState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToHeadingState = (function (_super) {
    __extends(ParticleRotateToHeadingState, _super);
    function ParticleRotateToHeadingState(animator, particleNode) {
        _super.call(this, animator, particleNode);
        this._matrix = new Matrix3D_1.default();
    }
    ParticleRotateToHeadingState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._pParticleAnimator.animationSet.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToHeadingState.MATRIX_INDEX), this._matrix);
        }
    };
    /** @private */
    ParticleRotateToHeadingState.MATRIX_INDEX = 0;
    return ParticleRotateToHeadingState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleRotateToHeadingState;

},{"../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Matrix3D":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToPositionState = (function (_super) {
    __extends(ParticleRotateToPositionState, _super);
    function ParticleRotateToPositionState(animator, particleRotateToPositionNode) {
        _super.call(this, animator, particleRotateToPositionNode);
        this._matrix = new Matrix3D_1.default();
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
    ParticleRotateToPositionState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.POSITION_INDEX);
        if (this._pParticleAnimator.animationSet.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
        }
        if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
            shader.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
        }
        else
            animationElements.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
    };
    /** @private */
    ParticleRotateToPositionState.MATRIX_INDEX = 0;
    /** @private */
    ParticleRotateToPositionState.POSITION_INDEX = 1;
    return ParticleRotateToPositionState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleRotateToPositionState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleRotationalVelocityState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode_1.default.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
            this._pUpdateDynamicProperties(animationElements);
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX);
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode_1.default.GLOBAL)
            shader.setVertexConst(index, this._rotationalVelocityData.x, this._rotationalVelocityData.y, this._rotationalVelocityData.z, this._rotationalVelocityData.w);
        else
            animationElements.activateVertexBuffer(index, this._particleRotationalVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
    };
    ParticleRotationalVelocityState.prototype.updateRotationalVelocityData = function () {
        if (this._particleRotationalVelocityNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            if (this._rotationalVelocity.w <= 0)
                throw (new Error("the cycle duration must greater than zero"));
            var rotation = this._rotationalVelocity.clone();
            if (rotation.length <= 0)
                rotation.z = 1; //set the default direction
            else
                rotation.normalize();
            // w is used as angle/2 in agal
            this._rotationalVelocityData = new Vector3D_1.default(rotation.x, rotation.y, rotation.z, Math.PI / rotation.w);
        }
    };
    /** @private */
    ParticleRotationalVelocityState.ROTATIONALVELOCITY_INDEX = 0;
    return ParticleRotationalVelocityState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleRotationalVelocityState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleScaleState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleScaleState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleScaleState.SCALE_INDEX);
        if (this._particleScaleNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
            if (this._usesCycle) {
                if (this._usesPhase)
                    animationElements.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
                else
                    animationElements.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
            }
            else
                animationElements.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_2);
        }
        else
            shader.setVertexConst(index, this._scaleData.x, this._scaleData.y, this._scaleData.z, this._scaleData.w);
    };
    ParticleScaleState.prototype.updateScaleData = function () {
        if (this._particleScaleNode.mode == ParticlePropertiesMode_1.default.GLOBAL) {
            if (this._usesCycle) {
                if (this._cycleDuration <= 0)
                    throw (new Error("the cycle duration must be greater than zero"));
                this._scaleData = new Vector3D_1.default((this._minScale + this._maxScale) / 2, Math.abs(this._minScale - this._maxScale) / 2, Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180);
            }
            else
                this._scaleData = new Vector3D_1.default(this._minScale, this._maxScale - this._minScale, 0, 0);
        }
    };
    /** @private */
    ParticleScaleState.SCALE_INDEX = 0;
    return ParticleScaleState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleScaleState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleSegmentedColorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (shader.usesFragmentAnimation) {
            if (this._numSegmentPoint > 0)
                shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.TIME_DATA_INDEX), this._timeLifeData[0], this._timeLifeData[1], this._timeLifeData[2], this._timeLifeData[3]);
            if (this._usesMultiplier)
                shader.setVertexConstFromArray(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_MULTIPLIER_INDEX), this._multiplierData);
            if (this._usesOffset)
                shader.setVertexConstFromArray(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_OFFSET_INDEX), this._offsetData);
        }
    };
    ParticleSegmentedColorState.prototype.updateColorData = function () {
        this._timeLifeData = new Float32Array(4);
        this._multiplierData = new Float32Array(4 * (this._numSegmentPoint + 1));
        this._offsetData = new Float32Array(4 * (this._numSegmentPoint + 1));
        //cut off the time data
        var i;
        var j = 0;
        var count = this._numSegmentPoint > 3 ? 3 : this._numSegmentPoint;
        for (i = 0; i < count; i++) {
            if (i == 0)
                this._timeLifeData[j++] = this._segmentPoints[i].life;
            else
                this._timeLifeData[j++] = this._segmentPoints[i].life - this._segmentPoints[i - 1].life;
        }
        i = count;
        if (this._numSegmentPoint == 0)
            this._timeLifeData[j++] = 1;
        else
            this._timeLifeData[j++] = 1 - this._segmentPoints[i - 1].life;
        if (this._usesMultiplier) {
            j = 0;
            this._multiplierData[j++] = this._startColor.redMultiplier;
            this._multiplierData[j++] = this._startColor.greenMultiplier;
            this._multiplierData[j++] = this._startColor.blueMultiplier;
            this._multiplierData[j++] = this._startColor.alphaMultiplier;
            for (i = 0; i < this._numSegmentPoint; i++) {
                if (i == 0) {
                    this._multiplierData[j++] = (this._segmentPoints[i].color.redMultiplier - this._startColor.redMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.greenMultiplier - this._startColor.greenMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.blueMultiplier - this._startColor.blueMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.alphaMultiplier - this._startColor.alphaMultiplier) / this._timeLifeData[i];
                }
                else {
                    this._multiplierData[j++] = (this._segmentPoints[i].color.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i];
                }
            }
            i = this._numSegmentPoint;
            if (this._numSegmentPoint == 0) {
                this._multiplierData[j++] = this._endColor.redMultiplier - this._startColor.redMultiplier;
                this._multiplierData[j++] = this._endColor.greenMultiplier - this._startColor.greenMultiplier;
                this._multiplierData[j++] = this._endColor.blueMultiplier - this._startColor.blueMultiplier;
                this._multiplierData[j++] = this._endColor.alphaMultiplier - this._startColor.alphaMultiplier;
            }
            else {
                this._multiplierData[j++] = (this._endColor.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i];
                this._multiplierData[j++] = (this._endColor.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i];
                this._multiplierData[j++] = (this._endColor.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i];
                this._multiplierData[j++] = (this._endColor.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i];
            }
        }
        if (this._usesOffset) {
            j = 0;
            this._offsetData[j++] = this._startColor.redOffset / 255;
            this._offsetData[j++] = this._startColor.greenOffset / 255;
            this._offsetData[j++] = this._startColor.blueOffset / 255;
            this._offsetData[j++] = this._startColor.alphaOffset / 255;
            for (i = 0; i < this._numSegmentPoint; i++) {
                if (i == 0) {
                    this._offsetData[j++] = (this._segmentPoints[i].color.redOffset - this._startColor.redOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.greenOffset - this._startColor.greenOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.blueOffset - this._startColor.blueOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.alphaOffset - this._startColor.alphaOffset) / this._timeLifeData[i] / 255;
                }
                else {
                    this._offsetData[j++] = (this._segmentPoints[i].color.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255;
                }
            }
            i = this._numSegmentPoint;
            if (this._numSegmentPoint == 0) {
                this._offsetData[j++] = (this._endColor.redOffset - this._startColor.redOffset) / 255;
                this._offsetData[j++] = (this._endColor.greenOffset - this._startColor.greenOffset) / 255;
                this._offsetData[j++] = (this._endColor.blueOffset - this._startColor.blueOffset) / 255;
                this._offsetData[j++] = (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255;
            }
            else {
                this._offsetData[i] = (this._endColor.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255;
                this._offsetData[j++] = (this._endColor.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255;
                this._offsetData[j++] = (this._endColor.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255;
                this._offsetData[j++] = (this._endColor.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255;
            }
        }
    };
    /** @private */
    ParticleSegmentedColorState.START_MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleSegmentedColorState.START_OFFSET_INDEX = 1;
    /** @private */
    ParticleSegmentedColorState.TIME_DATA_INDEX = 2;
    return ParticleSegmentedColorState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleSegmentedColorState;

},{"../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleSpriteSheetState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (!shader.usesUVTransform) {
            shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_0), this._spriteSheetData[0], this._spriteSheetData[1], this._spriteSheetData[2], this._spriteSheetData[3]);
            if (this._usesCycle) {
                var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_1);
                if (this._particleSpriteSheetNode.mode == ParticlePropertiesMode_1.default.LOCAL_STATIC) {
                    if (this._usesPhase)
                        animationElements.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
                    else
                        animationElements.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_2);
                }
                else
                    shader.setVertexConst(index, this._spriteSheetData[4], this._spriteSheetData[5]);
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
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleSpriteSheetState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleStateBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
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
        this._pParticleAnimator = animator;
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
    ParticleStateBase.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
    };
    ParticleStateBase.prototype._pUpdateDynamicProperties = function (animationElements) {
        this._pDynamicPropertiesDirty[animationElements._iUniqueId] = true;
        var animationParticles = animationElements.animationParticles;
        var vertexData = animationElements.vertexData;
        var totalLenOfOneVertex = animationElements.totalLenOfOneVertex;
        var dataLength = this._particleNode.dataLength;
        var dataOffset = this._particleNode._iDataOffset;
        var vertexLength;
        //			var particleOffset:number;
        var startingOffset;
        var vertexOffset;
        var data;
        var animationParticle;
        //			var numParticles:number = _positions.length/dataLength;
        var numParticles = this._pDynamicProperties.length;
        var i = 0;
        var j = 0;
        var k = 0;
        //loop through all particles
        while (i < numParticles) {
            //loop through each particle data for the current particle
            while (j < numParticles && (animationParticle = animationParticles[j]).index == i) {
                data = this._pDynamicProperties[i];
                vertexLength = animationParticle.numVertices * totalLenOfOneVertex;
                startingOffset = animationParticle.startVertexIndex * totalLenOfOneVertex + dataOffset;
                //loop through each vertex in the particle data
                for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                    vertexOffset = startingOffset + k;
                    //						particleOffset = i * dataLength;
                    //loop through all vertex data for the current particle data
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
        animationElements.invalidateBuffer();
    };
    return ParticleStateBase;
}(AnimationStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleStateBase;

},{"../../animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleTimeState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleTimeState = (function (_super) {
    __extends(ParticleTimeState, _super);
    function ParticleTimeState(animator, particleTimeNode) {
        _super.call(this, animator, particleTimeNode, true);
        this._particleTimeNode = particleTimeNode;
    }
    ParticleTimeState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        animationElements.activateVertexBuffer(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_4);
        var particleTime = this._pTime / 1000;
        shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
    };
    /** @private */
    ParticleTimeState.TIME_STREAM_INDEX = 0;
    /** @private */
    ParticleTimeState.TIME_CONSTANT_INDEX = 1;
    return ParticleTimeState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleTimeState;

},{"../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleUVState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleUVState = (function (_super) {
    __extends(ParticleUVState, _super);
    function ParticleUVState(animator, particleUVNode) {
        _super.call(this, animator, particleUVNode);
        this._particleUVNode = particleUVNode;
    }
    ParticleUVState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (!shader.usesUVTransform) {
            var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleUVState.UV_INDEX);
            var data = this._particleUVNode._iUvData;
            shader.setVertexConst(index, data.x, data.y);
        }
    };
    /** @private */
    ParticleUVState.UV_INDEX = 0;
    return ParticleUVState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleUVState;

},{"../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase"}],"awayjs-renderergl/lib/animators/states/ParticleVelocityState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLVertexBufferFormat_1 = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode_1 = require("../../animators/data/ParticlePropertiesMode");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
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
    ParticleVelocityState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (this._particleVelocityNode.mode == ParticlePropertiesMode_1.default.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
            this._pUpdateDynamicProperties(animationElements);
        var index = animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleVelocityState.VELOCITY_INDEX);
        if (this._particleVelocityNode.mode == ParticlePropertiesMode_1.default.GLOBAL)
            shader.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
        else
            animationElements.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat_1.default.FLOAT_3);
    };
    /** @private */
    ParticleVelocityState.VELOCITY_INDEX = 0;
    return ParticleVelocityState;
}(ParticleStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleVelocityState;

},{"../../animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","../../animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonBinaryLERPState = (function (_super) {
    __extends(SkeletonBinaryLERPState, _super);
    function SkeletonBinaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose_1.default();
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
    SkeletonBinaryLERPState.prototype._pUpdateTime = function (time) {
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
                endPose = endPoses[i] = new JointPose_1.default();
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
}(AnimationStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonBinaryLERPState;

},{"../../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","../../animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","../../animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/SkeletonClipState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationClipState_1 = require("../../animators/states/AnimationClipState");
/**
 *
 */
var SkeletonClipState = (function (_super) {
    __extends(SkeletonClipState, _super);
    function SkeletonClipState(animator, skeletonClipNode) {
        _super.call(this, animator, skeletonClipNode);
        this._rootPos = new Vector3D_1.default();
        this._skeletonPose = new SkeletonPose_1.default();
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
    SkeletonClipState.prototype._pUpdateTime = function (time) {
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
                endPose = endPoses[i] = new JointPose_1.default();
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
}(AnimationClipState_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonClipState;

},{"../../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","../../animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","../../animators/states/AnimationClipState":"awayjs-renderergl/lib/animators/states/AnimationClipState","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Quaternion_1 = require("awayjs-core/lib/geom/Quaternion");
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDifferenceState = (function (_super) {
    __extends(SkeletonDifferenceState, _super);
    function SkeletonDifferenceState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose_1.default();
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
    SkeletonDifferenceState.prototype._pUpdateTime = function (time) {
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
                endPose = endPoses[i] = new JointPose_1.default();
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
    SkeletonDifferenceState._tempQuat = new Quaternion_1.default();
    return SkeletonDifferenceState;
}(AnimationStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonDifferenceState;

},{"../../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","../../animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","../../animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase","awayjs-core/lib/geom/Quaternion":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDirectionalState = (function (_super) {
    __extends(SkeletonDirectionalState, _super);
    function SkeletonDirectionalState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose_1.default();
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
    SkeletonDirectionalState.prototype._pUdateTime = function (time) {
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
                endPose = endPoses[i] = new JointPose_1.default();
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
}(AnimationStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonDirectionalState;

},{"../../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","../../animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","../../animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JointPose_1 = require("../../animators/data/JointPose");
var SkeletonPose_1 = require("../../animators/data/SkeletonPose");
var AnimationStateBase_1 = require("../../animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonNaryLERPState = (function (_super) {
    __extends(SkeletonNaryLERPState, _super);
    function SkeletonNaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose_1.default();
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
    SkeletonNaryLERPState.prototype._pUdateTime = function (time) {
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
    SkeletonNaryLERPState.prototype.getBlendWeightAt = function (index) {
        return this._blendWeights[index];
    };
    /**
     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index on which the skeleton animation node blend weight is to be set.
     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
     */
    SkeletonNaryLERPState.prototype.setBlendWeightAt = function (index, blendWeight) {
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
        var i;
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
                        endPose = endPoses[i] = new JointPose_1.default();
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
}(AnimationStateBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkeletonNaryLERPState;

},{"../../animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","../../animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","../../animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase"}],"awayjs-renderergl/lib/animators/states/VertexClipState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationClipState_1 = require("../../animators/states/AnimationClipState");
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
    Object.defineProperty(VertexClipState.prototype, "currentGraphics", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._currentGraphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexClipState.prototype, "nextGraphics", {
        /**
         * @inheritDoc
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._nextGraphics;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdateFrames = function () {
        _super.prototype._pUpdateFrames.call(this);
        this._currentGraphics = this._frames[this._pCurrentFrame];
        if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
            this._nextGraphics = this._frames[0];
            this._pAnimator.dispatchCycleEvent();
        }
        else
            this._nextGraphics = this._frames[this._pNextFrame];
    };
    /**
     * @inheritDoc
     */
    VertexClipState.prototype._pUpdatePositionDelta = function () {
        //TODO:implement positiondelta functionality for vertex animations
    };
    return VertexClipState;
}(AnimationClipState_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VertexClipState;

},{"../../animators/states/AnimationClipState":"awayjs-renderergl/lib/animators/states/AnimationClipState"}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SkeletonBinaryLERPNode_1 = require("../../animators/nodes/SkeletonBinaryLERPNode");
var CrossfadeTransitionState_1 = require("../../animators/transitions/CrossfadeTransitionState");
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
        this._pStateClass = CrossfadeTransitionState_1.default;
    }
    return CrossfadeTransitionNode;
}(SkeletonBinaryLERPNode_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrossfadeTransitionNode;

},{"../../animators/nodes/SkeletonBinaryLERPNode":"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode","../../animators/transitions/CrossfadeTransitionState":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState"}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SkeletonBinaryLERPState_1 = require("../../animators/states/SkeletonBinaryLERPState");
var AnimationStateEvent_1 = require("../../animators/../events/AnimationStateEvent");
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
    CrossfadeTransitionState.prototype._pUpdateTime = function (time) {
        this.blendWeight = Math.abs(time - this._crossfadeTransitionNode.startBlend) / (1000 * this._crossfadeTransitionNode.blendSpeed);
        if (this.blendWeight >= 1) {
            this.blendWeight = 1;
            if (this._animationStateTransitionComplete == null)
                this._animationStateTransitionComplete = new AnimationStateEvent_1.default(AnimationStateEvent_1.default.TRANSITION_COMPLETE, this._pAnimator, this, this._crossfadeTransitionNode);
            this._crossfadeTransitionNode.dispatchEvent(this._animationStateTransitionComplete);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    return CrossfadeTransitionState;
}(SkeletonBinaryLERPState_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrossfadeTransitionState;

},{"../../animators/../events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent","../../animators/states/SkeletonBinaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState"}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransition":[function(require,module,exports){
"use strict";
var CrossfadeTransitionNode_1 = require("../../animators/transitions/CrossfadeTransitionNode");
/**
 *
 */
var CrossfadeTransition = (function () {
    function CrossfadeTransition(blendSpeed) {
        this.blendSpeed = 0.5;
        this.blendSpeed = blendSpeed;
    }
    CrossfadeTransition.prototype.getAnimationNode = function (animator, startNode, endNode, startBlend) {
        var crossFadeTransitionNode = new CrossfadeTransitionNode_1.default();
        crossFadeTransitionNode.inputA = startNode;
        crossFadeTransitionNode.inputB = endNode;
        crossFadeTransitionNode.blendSpeed = this.blendSpeed;
        crossFadeTransitionNode.startBlend = startBlend;
        return crossFadeTransitionNode;
    };
    return CrossfadeTransition;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrossfadeTransition;

},{"../../animators/transitions/CrossfadeTransitionNode":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode"}],"awayjs-renderergl/lib/animators/transitions/IAnimationTransition":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/animators":[function(require,module,exports){
"use strict";
var AnimationElements_1 = require("./animators/data/AnimationElements");
exports.AnimationElements = AnimationElements_1.default;
var AnimationRegisterData_1 = require("./animators/data/AnimationRegisterData");
exports.AnimationRegisterData = AnimationRegisterData_1.default;
var ColorSegmentPoint_1 = require("./animators/data/ColorSegmentPoint");
exports.ColorSegmentPoint = ColorSegmentPoint_1.default;
var JointPose_1 = require("./animators/data/JointPose");
exports.JointPose = JointPose_1.default;
var ParticleAnimationData_1 = require("./animators/data/ParticleAnimationData");
exports.ParticleAnimationData = ParticleAnimationData_1.default;
var ParticleProperties_1 = require("./animators/data/ParticleProperties");
exports.ParticleProperties = ParticleProperties_1.default;
var ParticlePropertiesMode_1 = require("./animators/data/ParticlePropertiesMode");
exports.ParticlePropertiesMode = ParticlePropertiesMode_1.default;
var Skeleton_1 = require("./animators/data/Skeleton");
exports.Skeleton = Skeleton_1.default;
var SkeletonJoint_1 = require("./animators/data/SkeletonJoint");
exports.SkeletonJoint = SkeletonJoint_1.default;
var SkeletonPose_1 = require("./animators/data/SkeletonPose");
exports.SkeletonPose = SkeletonPose_1.default;
var VertexAnimationMode_1 = require("./animators/data/VertexAnimationMode");
exports.VertexAnimationMode = VertexAnimationMode_1.default;
var AnimationClipNodeBase_1 = require("./animators/nodes/AnimationClipNodeBase");
exports.AnimationClipNodeBase = AnimationClipNodeBase_1.default;
var ParticleAccelerationNode_1 = require("./animators/nodes/ParticleAccelerationNode");
exports.ParticleAccelerationNode = ParticleAccelerationNode_1.default;
var ParticleBezierCurveNode_1 = require("./animators/nodes/ParticleBezierCurveNode");
exports.ParticleBezierCurveNode = ParticleBezierCurveNode_1.default;
var ParticleBillboardNode_1 = require("./animators/nodes/ParticleBillboardNode");
exports.ParticleBillboardNode = ParticleBillboardNode_1.default;
var ParticleColorNode_1 = require("./animators/nodes/ParticleColorNode");
exports.ParticleColorNode = ParticleColorNode_1.default;
var ParticleFollowNode_1 = require("./animators/nodes/ParticleFollowNode");
exports.ParticleFollowNode = ParticleFollowNode_1.default;
var ParticleInitialColorNode_1 = require("./animators/nodes/ParticleInitialColorNode");
exports.ParticleInitialColorNode = ParticleInitialColorNode_1.default;
var ParticleNodeBase_1 = require("./animators/nodes/ParticleNodeBase");
exports.ParticleNodeBase = ParticleNodeBase_1.default;
var ParticleOrbitNode_1 = require("./animators/nodes/ParticleOrbitNode");
exports.ParticleOrbitNode = ParticleOrbitNode_1.default;
var ParticleOscillatorNode_1 = require("./animators/nodes/ParticleOscillatorNode");
exports.ParticleOscillatorNode = ParticleOscillatorNode_1.default;
var ParticlePositionNode_1 = require("./animators/nodes/ParticlePositionNode");
exports.ParticlePositionNode = ParticlePositionNode_1.default;
var ParticleRotateToHeadingNode_1 = require("./animators/nodes/ParticleRotateToHeadingNode");
exports.ParticleRotateToHeadingNode = ParticleRotateToHeadingNode_1.default;
var ParticleRotateToPositionNode_1 = require("./animators/nodes/ParticleRotateToPositionNode");
exports.ParticleRotateToPositionNode = ParticleRotateToPositionNode_1.default;
var ParticleRotationalVelocityNode_1 = require("./animators/nodes/ParticleRotationalVelocityNode");
exports.ParticleRotationalVelocityNode = ParticleRotationalVelocityNode_1.default;
var ParticleScaleNode_1 = require("./animators/nodes/ParticleScaleNode");
exports.ParticleScaleNode = ParticleScaleNode_1.default;
var ParticleSegmentedColorNode_1 = require("./animators/nodes/ParticleSegmentedColorNode");
exports.ParticleSegmentedColorNode = ParticleSegmentedColorNode_1.default;
var ParticleSpriteSheetNode_1 = require("./animators/nodes/ParticleSpriteSheetNode");
exports.ParticleSpriteSheetNode = ParticleSpriteSheetNode_1.default;
var ParticleTimeNode_1 = require("./animators/nodes/ParticleTimeNode");
exports.ParticleTimeNode = ParticleTimeNode_1.default;
var ParticleUVNode_1 = require("./animators/nodes/ParticleUVNode");
exports.ParticleUVNode = ParticleUVNode_1.default;
var ParticleVelocityNode_1 = require("./animators/nodes/ParticleVelocityNode");
exports.ParticleVelocityNode = ParticleVelocityNode_1.default;
var SkeletonBinaryLERPNode_1 = require("./animators/nodes/SkeletonBinaryLERPNode");
exports.SkeletonBinaryLERPNode = SkeletonBinaryLERPNode_1.default;
var SkeletonClipNode_1 = require("./animators/nodes/SkeletonClipNode");
exports.SkeletonClipNode = SkeletonClipNode_1.default;
var SkeletonDifferenceNode_1 = require("./animators/nodes/SkeletonDifferenceNode");
exports.SkeletonDifferenceNode = SkeletonDifferenceNode_1.default;
var SkeletonDirectionalNode_1 = require("./animators/nodes/SkeletonDirectionalNode");
exports.SkeletonDirectionalNode = SkeletonDirectionalNode_1.default;
var SkeletonNaryLERPNode_1 = require("./animators/nodes/SkeletonNaryLERPNode");
exports.SkeletonNaryLERPNode = SkeletonNaryLERPNode_1.default;
var VertexClipNode_1 = require("./animators/nodes/VertexClipNode");
exports.VertexClipNode = VertexClipNode_1.default;
var AnimationClipState_1 = require("./animators/states/AnimationClipState");
exports.AnimationClipState = AnimationClipState_1.default;
var AnimationStateBase_1 = require("./animators/states/AnimationStateBase");
exports.AnimationStateBase = AnimationStateBase_1.default;
var ParticleAccelerationState_1 = require("./animators/states/ParticleAccelerationState");
exports.ParticleAccelerationState = ParticleAccelerationState_1.default;
var ParticleBezierCurveState_1 = require("./animators/states/ParticleBezierCurveState");
exports.ParticleBezierCurveState = ParticleBezierCurveState_1.default;
var ParticleBillboardState_1 = require("./animators/states/ParticleBillboardState");
exports.ParticleBillboardState = ParticleBillboardState_1.default;
var ParticleColorState_1 = require("./animators/states/ParticleColorState");
exports.ParticleColorState = ParticleColorState_1.default;
var ParticleFollowState_1 = require("./animators/states/ParticleFollowState");
exports.ParticleFollowState = ParticleFollowState_1.default;
var ParticleInitialColorState_1 = require("./animators/states/ParticleInitialColorState");
exports.ParticleInitialColorState = ParticleInitialColorState_1.default;
var ParticleStateBase_1 = require("./animators/states/ParticleStateBase");
exports.ParticleStateBase = ParticleStateBase_1.default;
var ParticleOrbitState_1 = require("./animators/states/ParticleOrbitState");
exports.ParticleOrbitState = ParticleOrbitState_1.default;
var ParticleOscillatorState_1 = require("./animators/states/ParticleOscillatorState");
exports.ParticleOscillatorState = ParticleOscillatorState_1.default;
var ParticlePositionState_1 = require("./animators/states/ParticlePositionState");
exports.ParticlePositionState = ParticlePositionState_1.default;
var ParticleRotateToHeadingState_1 = require("./animators/states/ParticleRotateToHeadingState");
exports.ParticleRotateToHeadingState = ParticleRotateToHeadingState_1.default;
var ParticleRotateToPositionState_1 = require("./animators/states/ParticleRotateToPositionState");
exports.ParticleRotateToPositionState = ParticleRotateToPositionState_1.default;
var ParticleRotationalVelocityState_1 = require("./animators/states/ParticleRotationalVelocityState");
exports.ParticleRotationalVelocityState = ParticleRotationalVelocityState_1.default;
var ParticleScaleState_1 = require("./animators/states/ParticleScaleState");
exports.ParticleScaleState = ParticleScaleState_1.default;
var ParticleSegmentedColorState_1 = require("./animators/states/ParticleSegmentedColorState");
exports.ParticleSegmentedColorState = ParticleSegmentedColorState_1.default;
var ParticleSpriteSheetState_1 = require("./animators/states/ParticleSpriteSheetState");
exports.ParticleSpriteSheetState = ParticleSpriteSheetState_1.default;
var ParticleTimeState_1 = require("./animators/states/ParticleTimeState");
exports.ParticleTimeState = ParticleTimeState_1.default;
var ParticleUVState_1 = require("./animators/states/ParticleUVState");
exports.ParticleUVState = ParticleUVState_1.default;
var ParticleVelocityState_1 = require("./animators/states/ParticleVelocityState");
exports.ParticleVelocityState = ParticleVelocityState_1.default;
var SkeletonBinaryLERPState_1 = require("./animators/states/SkeletonBinaryLERPState");
exports.SkeletonBinaryLERPState = SkeletonBinaryLERPState_1.default;
var SkeletonClipState_1 = require("./animators/states/SkeletonClipState");
exports.SkeletonClipState = SkeletonClipState_1.default;
var SkeletonDifferenceState_1 = require("./animators/states/SkeletonDifferenceState");
exports.SkeletonDifferenceState = SkeletonDifferenceState_1.default;
var SkeletonDirectionalState_1 = require("./animators/states/SkeletonDirectionalState");
exports.SkeletonDirectionalState = SkeletonDirectionalState_1.default;
var SkeletonNaryLERPState_1 = require("./animators/states/SkeletonNaryLERPState");
exports.SkeletonNaryLERPState = SkeletonNaryLERPState_1.default;
var VertexClipState_1 = require("./animators/states/VertexClipState");
exports.VertexClipState = VertexClipState_1.default;
var CrossfadeTransition_1 = require("./animators/transitions/CrossfadeTransition");
exports.CrossfadeTransition = CrossfadeTransition_1.default;
var CrossfadeTransitionNode_1 = require("./animators/transitions/CrossfadeTransitionNode");
exports.CrossfadeTransitionNode = CrossfadeTransitionNode_1.default;
var CrossfadeTransitionState_1 = require("./animators/transitions/CrossfadeTransitionState");
exports.CrossfadeTransitionState = CrossfadeTransitionState_1.default;
var AnimationSetBase_1 = require("./animators/AnimationSetBase");
exports.AnimationSetBase = AnimationSetBase_1.default;
var AnimatorBase_1 = require("./animators/AnimatorBase");
exports.AnimatorBase = AnimatorBase_1.default;
var ParticleAnimationSet_1 = require("./animators/ParticleAnimationSet");
exports.ParticleAnimationSet = ParticleAnimationSet_1.default;
var ParticleAnimator_1 = require("./animators/ParticleAnimator");
exports.ParticleAnimator = ParticleAnimator_1.default;
var SkeletonAnimationSet_1 = require("./animators/SkeletonAnimationSet");
exports.SkeletonAnimationSet = SkeletonAnimationSet_1.default;
var SkeletonAnimator_1 = require("./animators/SkeletonAnimator");
exports.SkeletonAnimator = SkeletonAnimator_1.default;
var VertexAnimationSet_1 = require("./animators/VertexAnimationSet");
exports.VertexAnimationSet = VertexAnimationSet_1.default;
var VertexAnimator_1 = require("./animators/VertexAnimator");
exports.VertexAnimator = VertexAnimator_1.default;

},{"./animators/AnimationSetBase":"awayjs-renderergl/lib/animators/AnimationSetBase","./animators/AnimatorBase":"awayjs-renderergl/lib/animators/AnimatorBase","./animators/ParticleAnimationSet":"awayjs-renderergl/lib/animators/ParticleAnimationSet","./animators/ParticleAnimator":"awayjs-renderergl/lib/animators/ParticleAnimator","./animators/SkeletonAnimationSet":"awayjs-renderergl/lib/animators/SkeletonAnimationSet","./animators/SkeletonAnimator":"awayjs-renderergl/lib/animators/SkeletonAnimator","./animators/VertexAnimationSet":"awayjs-renderergl/lib/animators/VertexAnimationSet","./animators/VertexAnimator":"awayjs-renderergl/lib/animators/VertexAnimator","./animators/data/AnimationElements":"awayjs-renderergl/lib/animators/data/AnimationElements","./animators/data/AnimationRegisterData":"awayjs-renderergl/lib/animators/data/AnimationRegisterData","./animators/data/ColorSegmentPoint":"awayjs-renderergl/lib/animators/data/ColorSegmentPoint","./animators/data/JointPose":"awayjs-renderergl/lib/animators/data/JointPose","./animators/data/ParticleAnimationData":"awayjs-renderergl/lib/animators/data/ParticleAnimationData","./animators/data/ParticleProperties":"awayjs-renderergl/lib/animators/data/ParticleProperties","./animators/data/ParticlePropertiesMode":"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode","./animators/data/Skeleton":"awayjs-renderergl/lib/animators/data/Skeleton","./animators/data/SkeletonJoint":"awayjs-renderergl/lib/animators/data/SkeletonJoint","./animators/data/SkeletonPose":"awayjs-renderergl/lib/animators/data/SkeletonPose","./animators/data/VertexAnimationMode":"awayjs-renderergl/lib/animators/data/VertexAnimationMode","./animators/nodes/AnimationClipNodeBase":"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase","./animators/nodes/ParticleAccelerationNode":"awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode","./animators/nodes/ParticleBezierCurveNode":"awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode","./animators/nodes/ParticleBillboardNode":"awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode","./animators/nodes/ParticleColorNode":"awayjs-renderergl/lib/animators/nodes/ParticleColorNode","./animators/nodes/ParticleFollowNode":"awayjs-renderergl/lib/animators/nodes/ParticleFollowNode","./animators/nodes/ParticleInitialColorNode":"awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode","./animators/nodes/ParticleNodeBase":"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase","./animators/nodes/ParticleOrbitNode":"awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode","./animators/nodes/ParticleOscillatorNode":"awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode","./animators/nodes/ParticlePositionNode":"awayjs-renderergl/lib/animators/nodes/ParticlePositionNode","./animators/nodes/ParticleRotateToHeadingNode":"awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode","./animators/nodes/ParticleRotateToPositionNode":"awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode","./animators/nodes/ParticleRotationalVelocityNode":"awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode","./animators/nodes/ParticleScaleNode":"awayjs-renderergl/lib/animators/nodes/ParticleScaleNode","./animators/nodes/ParticleSegmentedColorNode":"awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode","./animators/nodes/ParticleSpriteSheetNode":"awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode","./animators/nodes/ParticleTimeNode":"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode","./animators/nodes/ParticleUVNode":"awayjs-renderergl/lib/animators/nodes/ParticleUVNode","./animators/nodes/ParticleVelocityNode":"awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode","./animators/nodes/SkeletonBinaryLERPNode":"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode","./animators/nodes/SkeletonClipNode":"awayjs-renderergl/lib/animators/nodes/SkeletonClipNode","./animators/nodes/SkeletonDifferenceNode":"awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode","./animators/nodes/SkeletonDirectionalNode":"awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode","./animators/nodes/SkeletonNaryLERPNode":"awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode","./animators/nodes/VertexClipNode":"awayjs-renderergl/lib/animators/nodes/VertexClipNode","./animators/states/AnimationClipState":"awayjs-renderergl/lib/animators/states/AnimationClipState","./animators/states/AnimationStateBase":"awayjs-renderergl/lib/animators/states/AnimationStateBase","./animators/states/ParticleAccelerationState":"awayjs-renderergl/lib/animators/states/ParticleAccelerationState","./animators/states/ParticleBezierCurveState":"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState","./animators/states/ParticleBillboardState":"awayjs-renderergl/lib/animators/states/ParticleBillboardState","./animators/states/ParticleColorState":"awayjs-renderergl/lib/animators/states/ParticleColorState","./animators/states/ParticleFollowState":"awayjs-renderergl/lib/animators/states/ParticleFollowState","./animators/states/ParticleInitialColorState":"awayjs-renderergl/lib/animators/states/ParticleInitialColorState","./animators/states/ParticleOrbitState":"awayjs-renderergl/lib/animators/states/ParticleOrbitState","./animators/states/ParticleOscillatorState":"awayjs-renderergl/lib/animators/states/ParticleOscillatorState","./animators/states/ParticlePositionState":"awayjs-renderergl/lib/animators/states/ParticlePositionState","./animators/states/ParticleRotateToHeadingState":"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState","./animators/states/ParticleRotateToPositionState":"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState","./animators/states/ParticleRotationalVelocityState":"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState","./animators/states/ParticleScaleState":"awayjs-renderergl/lib/animators/states/ParticleScaleState","./animators/states/ParticleSegmentedColorState":"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState","./animators/states/ParticleSpriteSheetState":"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState","./animators/states/ParticleStateBase":"awayjs-renderergl/lib/animators/states/ParticleStateBase","./animators/states/ParticleTimeState":"awayjs-renderergl/lib/animators/states/ParticleTimeState","./animators/states/ParticleUVState":"awayjs-renderergl/lib/animators/states/ParticleUVState","./animators/states/ParticleVelocityState":"awayjs-renderergl/lib/animators/states/ParticleVelocityState","./animators/states/SkeletonBinaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState","./animators/states/SkeletonClipState":"awayjs-renderergl/lib/animators/states/SkeletonClipState","./animators/states/SkeletonDifferenceState":"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState","./animators/states/SkeletonDirectionalState":"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState","./animators/states/SkeletonNaryLERPState":"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState","./animators/states/VertexClipState":"awayjs-renderergl/lib/animators/states/VertexClipState","./animators/transitions/CrossfadeTransition":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransition","./animators/transitions/CrossfadeTransitionNode":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode","./animators/transitions/CrossfadeTransitionState":"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState"}],"awayjs-renderergl/lib/elements/GL_ElementsBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractionBase_1 = require("awayjs-core/lib/library/AbstractionBase");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var ElementsEvent_1 = require("awayjs-display/lib/events/ElementsEvent");
var ElementsUtils_1 = require("awayjs-display/lib/utils/ElementsUtils");
/**
 *
 * @class away.pool.GL_ElementsBaseBase
 */
var GL_ElementsBase = (function (_super) {
    __extends(GL_ElementsBase, _super);
    function GL_ElementsBase(elements, stage) {
        var _this = this;
        _super.call(this, elements, stage);
        this.usages = 0;
        this._vertices = new Object();
        this._verticesUpdated = new Object();
        this._indexMappings = Array();
        this._numIndices = 0;
        this._elements = elements;
        this._stage = stage;
        this._onInvalidateIndicesDelegate = function (event) { return _this._onInvalidateIndices(event); };
        this._onClearIndicesDelegate = function (event) { return _this._onClearIndices(event); };
        this._onInvalidateVerticesDelegate = function (event) { return _this._onInvalidateVertices(event); };
        this._onClearVerticesDelegate = function (event) { return _this._onClearVertices(event); };
        this._elements.addEventListener(ElementsEvent_1.default.CLEAR_INDICES, this._onClearIndicesDelegate);
        this._elements.addEventListener(ElementsEvent_1.default.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);
        this._elements.addEventListener(ElementsEvent_1.default.CLEAR_VERTICES, this._onClearVerticesDelegate);
        this._elements.addEventListener(ElementsEvent_1.default.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
    }
    Object.defineProperty(GL_ElementsBase.prototype, "elementsType", {
        get: function () {
            throw new AbstractMethodError_1.default();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "elementsClass", {
        get: function () {
            throw new AbstractMethodError_1.default();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "numIndices", {
        /**
         *
         */
        get: function () {
            return this._numIndices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "numVertices", {
        /**
         *
         */
        get: function () {
            return this._numVertices;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    GL_ElementsBase.prototype.getIndexMappings = function () {
        if (!this._indicesUpdated)
            this._updateIndices();
        return this._indexMappings;
    };
    /**
     *
     */
    GL_ElementsBase.prototype.getIndexBufferGL = function () {
        if (!this._indicesUpdated)
            this._updateIndices();
        return this._indices;
    };
    /**
     *
     */
    GL_ElementsBase.prototype.getVertexBufferGL = function (attributesView) {
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
    GL_ElementsBase.prototype.activateVertexBufferVO = function (index, attributesView, dimensions, offset) {
        if (dimensions === void 0) { dimensions = 0; }
        if (offset === void 0) { offset = 0; }
        this.getVertexBufferGL(attributesView).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset, attributesView.unsigned);
    };
    /**
     *
     */
    GL_ElementsBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._elements.removeEventListener(ElementsEvent_1.default.CLEAR_INDICES, this._onClearIndicesDelegate);
        this._elements.removeEventListener(ElementsEvent_1.default.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);
        this._elements.removeEventListener(ElementsEvent_1.default.CLEAR_VERTICES, this._onClearVerticesDelegate);
        this._elements.removeEventListener(ElementsEvent_1.default.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
        this._elements = null;
        if (this._overflow) {
            this._overflow.onClear(event);
            this._overflow = null;
        }
    };
    GL_ElementsBase.prototype._setRenderState = function (renderable, shader, camera, viewProjection) {
        if (!this._verticesUpdated)
            this._updateIndices();
        //TODO replace overflow system with something sensible
        //this._render(renderable, camera, viewProjection);
        //
        // if (this._overflow)
        // 	this._overflow._iRender(renderable, camera, viewProjection);
    };
    GL_ElementsBase.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        throw new AbstractMethodError_1.default();
    };
    /**
     * //TODO
     *
     * @private
     */
    GL_ElementsBase.prototype._updateIndices = function (indexOffset) {
        if (indexOffset === void 0) { indexOffset = 0; }
        var indices = this._elements.indices;
        if (indices) {
            this._indices = this._stage.getAbstraction(ElementsUtils_1.default.getSubIndices(indices, this._elements.numVertices, this._indexMappings, indexOffset));
            this._numIndices = this._indices._attributesBuffer.count * indices.dimensions;
        }
        else {
            this._indices = null;
            this._numIndices = 0;
            this._indexMappings = Array();
        }
        indexOffset += this._numIndices;
        //check if there is more to split
        if (indices && indexOffset < indices.count * this._elements.indices.dimensions) {
            if (!this._overflow)
                this._overflow = this._pGetOverflowElements();
            this._overflow._updateIndices(indexOffset);
        }
        else if (this._overflow) {
            this._overflow.onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, this._elements));
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
    GL_ElementsBase.prototype._updateVertices = function (attributesView) {
        this._numVertices = this._elements.numVertices;
        var bufferId = attributesView.buffer.id;
        this._vertices[bufferId] = this._stage.getAbstraction(ElementsUtils_1.default.getSubVertices(attributesView.buffer, this._indexMappings));
        this._verticesUpdated[bufferId] = true;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    GL_ElementsBase.prototype._onInvalidateIndices = function (event) {
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
    GL_ElementsBase.prototype._onClearIndices = function (event) {
        if (!event.attributesView)
            return;
        this._indices.onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, event.attributesView));
        this._indices = null;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    GL_ElementsBase.prototype._onInvalidateVertices = function (event) {
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
    GL_ElementsBase.prototype._onClearVertices = function (event) {
        if (!event.attributesView)
            return;
        var bufferId = event.attributesView.buffer.id;
        if (this._vertices[bufferId]) {
            this._vertices[bufferId].onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, event.attributesView));
            delete this._vertices[bufferId];
            delete this._verticesUpdated[bufferId];
        }
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.GL_GraphicRenderable}
     * @protected
     */
    GL_ElementsBase.prototype._pGetOverflowElements = function () {
        throw new AbstractMethodError_1.default();
    };
    return GL_ElementsBase;
}(AbstractionBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_ElementsBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-display/lib/events/ElementsEvent":undefined,"awayjs-display/lib/utils/ElementsUtils":undefined}],"awayjs-renderergl/lib/elements/GL_LineElements":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var ContextGLDrawMode_1 = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var GL_ElementsBase_1 = require("../elements/GL_ElementsBase");
/**
 *
 * @class away.pool.GL_LineElements
 */
var GL_LineElements = (function (_super) {
    __extends(GL_LineElements, _super);
    function GL_LineElements(lineElements, stage) {
        _super.call(this, lineElements, stage);
        this._calcMatrix = new Matrix3D_1.default();
        this._thickness = 1.25;
        this._lineElements = lineElements;
    }
    Object.defineProperty(GL_LineElements.prototype, "elementsType", {
        get: function () {
            return GL_LineElements.elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_LineElements.prototype, "elementsClass", {
        get: function () {
            return GL_LineElements;
        },
        enumerable: true,
        configurable: true
    });
    GL_LineElements._iIncludeDependencies = function (shader) {
        shader.colorDependencies++;
    };
    GL_LineElements._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        //get the projection coordinates
        var position0 = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
        var position1 = registerCache.getFreeVertexAttribute();
        var thickness = registerCache.getFreeVertexAttribute();
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        registerCache.getFreeVertexConstant(); // not used
        var constOne = registerCache.getFreeVertexConstant();
        var constNegOne = registerCache.getFreeVertexConstant();
        var misc = registerCache.getFreeVertexConstant();
        var sceneMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.sceneMatrixIndex = sceneMatrixReg.index * 4;
        var q0 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(q0, 1);
        var q1 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(q1, 1);
        var l = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(l, 1);
        var behind = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(behind, 1);
        var qclipped = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(qclipped, 1);
        var offset = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(offset, 1);
        return "m44 " + q0 + ", " + position0 + ", " + sceneMatrixReg + "			\n" +
            "m44 " + q1 + ", " + position1 + ", " + sceneMatrixReg + "			\n" +
            "sub " + l + ", " + q1 + ", " + q0 + " 			\n" +
            // test if behind camera near plane
            // if 0 - Q0.z < Camera.near then the point needs to be clipped
            "slt " + behind + ".x, " + q0 + ".z, " + misc + ".z			\n" +
            "sub " + behind + ".y, " + constOne + ".x, " + behind + ".x			\n" +
            // p = point on the plane (0,0,-near)
            // n = plane normal (0,0,-1)
            // D = Q1 - Q0
            // t = ( dot( n, ( p - Q0 ) ) / ( dot( n, d )
            // solve for t where line crosses Camera.near
            "add " + offset + ".x, " + q0 + ".z, " + misc + ".z			\n" +
            "sub " + offset + ".y, " + q0 + ".z, " + q1 + ".z			\n" +
            // fix divide by zero for horizontal lines
            "seq " + offset + ".z, " + offset + ".y " + constNegOne + ".x			\n" +
            "add " + offset + ".y, " + offset + ".y, " + offset + ".z			\n" +
            "div " + offset + ".z, " + offset + ".x, " + offset + ".y			\n" +
            "mul " + offset + ".xyz, " + offset + ".zzz, " + l + ".xyz	\n" +
            "add " + qclipped + ".xyz, " + q0 + ".xyz, " + offset + ".xyz	\n" +
            "mov " + qclipped + ".w, " + constOne + ".x			\n" +
            // If necessary, replace Q0 with new Qclipped
            "mul " + q0 + ", " + q0 + ", " + behind + ".yyyy			\n" +
            "mul " + qclipped + ", " + qclipped + ", " + behind + ".xxxx			\n" +
            "add " + q0 + ", " + q0 + ", " + qclipped + "				\n" +
            // calculate side vector for line
            "nrm " + l + ".xyz, " + l + ".xyz			\n" +
            "nrm " + behind + ".xyz, " + q0 + ".xyz			\n" +
            "mov " + behind + ".w, " + constOne + ".x				\n" +
            "crs " + qclipped + ".xyz, " + l + ", " + behind + "			\n" +
            "nrm " + qclipped + ".xyz, " + qclipped + ".xyz			\n" +
            // face the side vector properly for the given point
            "mul " + qclipped + ".xyz, " + qclipped + ".xyz, " + thickness + ".xxx	\n" +
            "mov " + qclipped + ".w, " + constOne + ".x			\n" +
            // calculate the amount required to move at the point's distance to correspond to the line's pixel width
            // scale the side vector by that amount
            "dp3 " + offset + ".x, " + q0 + ", " + constNegOne + "			\n" +
            "mul " + offset + ".x, " + offset + ".x, " + misc + ".x			\n" +
            "mul " + qclipped + ".xyz, " + qclipped + ".xyz, " + offset + ".xxx	\n" +
            // add scaled side vector to Q0 and transform to clip space
            "add " + q0 + ".xyz, " + q0 + ".xyz, " + qclipped + ".xyz	\n" +
            "m44 op, " + q0 + ", " + viewMatrixReg + "			\n"; // transform Q0 to clip space
    };
    GL_LineElements._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_LineElements.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._lineElements = null;
    };
    GL_LineElements.prototype._setRenderState = function (renderable, shader, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, shader, camera, viewProjection);
        if (shader.colorBufferIndex >= 0)
            this.activateVertexBufferVO(shader.colorBufferIndex, this._lineElements.colors);
        this.activateVertexBufferVO(0, this._lineElements.positions, 3);
        this.activateVertexBufferVO(2, this._lineElements.positions, 3, 12);
        this.activateVertexBufferVO(3, this._lineElements.thickness);
        shader.vertexConstantData[4 + 16] = 1;
        shader.vertexConstantData[5 + 16] = 1;
        shader.vertexConstantData[6 + 16] = 1;
        shader.vertexConstantData[7 + 16] = 1;
        shader.vertexConstantData[10 + 16] = -1;
        shader.vertexConstantData[12 + 16] = this._thickness / ((this._stage.scissorRect) ? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));
        shader.vertexConstantData[13 + 16] = 1 / 255;
        shader.vertexConstantData[14 + 16] = camera.projection.near;
        var context = this._stage.context;
    };
    GL_LineElements.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        var context = this._stage.context;
        // projection matrix
        camera.projection.matrix.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        this._calcMatrix.copyFrom(renderable.sourceEntity.sceneTransform);
        this._calcMatrix.append(camera.inverseSceneTransform);
        this._calcMatrix.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
        context.setProgramConstantsFromArray(ContextGLProgramType_1.default.VERTEX, shader.vertexConstantData);
        if (this._indices)
            this.getIndexBufferGL().draw(ContextGLDrawMode_1.default.TRIANGLES, 0, this.numIndices);
        else
            this._stage.context.drawVertices(ContextGLDrawMode_1.default.TRIANGLES, offset, count || this.numVertices);
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubSpriteRenderable}
     * @protected
     */
    GL_LineElements.prototype._pGetOverflowElements = function () {
        return new GL_LineElements(this._lineElements, this._stage);
    };
    GL_LineElements.elementsType = "[elements Line]";
    return GL_LineElements;
}(GL_ElementsBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_LineElements;

},{"../elements/GL_ElementsBase":"awayjs-renderergl/lib/elements/GL_ElementsBase","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/elements/GL_SkyboxElements":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ContextGLDrawMode_1 = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var GL_TriangleElements_1 = require("../elements/GL_TriangleElements");
/**
 *
 * @class away.pool.GL_SkyboxElements
 */
var GL_SkyboxElements = (function (_super) {
    __extends(GL_SkyboxElements, _super);
    function GL_SkyboxElements() {
        _super.apply(this, arguments);
        this._skyboxProjection = new Matrix3D_1.default();
    }
    Object.defineProperty(GL_SkyboxElements.prototype, "elementsType", {
        get: function () {
            return GL_SkyboxElements.elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SkyboxElements.prototype, "elementsClass", {
        get: function () {
            return GL_SkyboxElements;
        },
        enumerable: true,
        configurable: true
    });
    GL_SkyboxElements._iIncludeDependencies = function (shader) {
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxElements._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        var scenePosition = registerCache.getFreeVertexConstant();
        shader.scenePositionIndex = scenePosition.index * 4;
        var skyboxScale = registerCache.getFreeVertexConstant();
        var temp = registerCache.getFreeVertexVectorTemp();
        code += "mul " + temp + ", " + position + ", " + skyboxScale + "\n" +
            "add " + temp + ", " + temp + ", " + scenePosition + "\n";
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            code += "m44 " + temp + ", " + temp + ", " + viewMatrixReg + "\n" +
                "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
                "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + temp + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    GL_SkyboxElements._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SkyboxElements.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        var index = shader.scenePositionIndex;
        var pos = camera.scenePosition;
        shader.vertexConstantData[index++] = 2 * pos.x;
        shader.vertexConstantData[index++] = 2 * pos.y;
        shader.vertexConstantData[index++] = 2 * pos.z;
        shader.vertexConstantData[index++] = 1;
        shader.vertexConstantData[index++] = shader.vertexConstantData[index++] = shader.vertexConstantData[index++] = camera.projection.far / Math.sqrt(3);
        shader.vertexConstantData[index] = 1;
        var near = new Vector3D_1.default();
        this._skyboxProjection.copyFrom(viewProjection);
        this._skyboxProjection.copyRowTo(2, near);
        var camPos = camera.scenePosition;
        var cx = near.x;
        var cy = near.y;
        var cz = near.z;
        var cw = -(near.x * camPos.x + near.y * camPos.y + near.z * camPos.z + Math.sqrt(cx * cx + cy * cy + cz * cz));
        var signX = cx >= 0 ? 1 : -1;
        var signY = cy >= 0 ? 1 : -1;
        var p = new Vector3D_1.default(signX, signY, 1, 1);
        var inverse = this._skyboxProjection.clone();
        inverse.invert();
        var q = inverse.transformVector(p);
        this._skyboxProjection.copyRowTo(3, p);
        var a = (q.x * p.x + q.y * p.y + q.z * p.z + q.w * p.w) / (cx * q.x + cy * q.y + cz * q.z + cw * q.w);
        this._skyboxProjection.copyRowFrom(2, new Vector3D_1.default(cx * a, cy * a, cz * a, cw * a));
        //set constants
        if (shader.sceneMatrixIndex >= 0) {
            renderable.renderSceneTransform.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            this._skyboxProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            this._skyboxProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType_1.default.VERTEX, shader.vertexConstantData);
        context.setProgramConstantsFromArray(ContextGLProgramType_1.default.FRAGMENT, shader.fragmentConstantData);
        if (this._indices)
            this.getIndexBufferGL().draw(ContextGLDrawMode_1.default.TRIANGLES, 0, this.numIndices);
        else
            this._stage.context.drawVertices(ContextGLDrawMode_1.default.TRIANGLES, offset, count || this.numVertices);
    };
    GL_SkyboxElements.elementsType = "[elements Skybox]";
    return GL_SkyboxElements;
}(GL_TriangleElements_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_SkyboxElements;

},{"../elements/GL_TriangleElements":"awayjs-renderergl/lib/elements/GL_TriangleElements","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/elements/GL_TriangleElements":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var ContextGLDrawMode_1 = require("awayjs-stagegl/lib/base/ContextGLDrawMode");
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var GL_ElementsBase_1 = require("../elements/GL_ElementsBase");
/**
 *
 * @class away.pool.GL_TriangleElements
 */
var GL_TriangleElements = (function (_super) {
    __extends(GL_TriangleElements, _super);
    function GL_TriangleElements(triangleElements, stage) {
        _super.call(this, triangleElements, stage);
        this._triangleElements = triangleElements;
    }
    Object.defineProperty(GL_TriangleElements.prototype, "elementsType", {
        get: function () {
            return GL_TriangleElements.elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_TriangleElements.prototype, "elementsClass", {
        get: function () {
            return GL_TriangleElements;
        },
        enumerable: true,
        configurable: true
    });
    GL_TriangleElements._iIncludeDependencies = function (shader) {
    };
    GL_TriangleElements._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" +
                "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
                "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    GL_TriangleElements._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_TriangleElements.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._triangleElements = null;
    };
    GL_TriangleElements.prototype._setRenderState = function (renderable, shader, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, shader, camera, viewProjection);
        //set buffers
        //TODO: find a better way to update a concatenated buffer when autoderiving
        if (shader.normalIndex >= 0 && this._triangleElements.autoDeriveNormals)
            this._triangleElements.normals;
        if (shader.tangentIndex >= 0 && this._triangleElements.autoDeriveTangents)
            this._triangleElements.tangents;
        if (shader.curvesIndex >= 0)
            this.activateVertexBufferVO(shader.curvesIndex, this._triangleElements.getCustomAtributes("curves"));
        if (shader.uvIndex >= 0)
            this.activateVertexBufferVO(shader.uvIndex, this._triangleElements.uvs || this._triangleElements.positions);
        if (shader.secondaryUVIndex >= 0)
            this.activateVertexBufferVO(shader.secondaryUVIndex, this._triangleElements.getCustomAtributes("secondaryUVs") || this._triangleElements.uvs || this._triangleElements.positions);
        if (shader.normalIndex >= 0)
            this.activateVertexBufferVO(shader.normalIndex, this._triangleElements.normals);
        if (shader.tangentIndex >= 0)
            this.activateVertexBufferVO(shader.tangentIndex, this._triangleElements.tangents);
        if (shader.jointIndexIndex >= 0)
            this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointIndices);
        if (shader.jointWeightIndex >= 0)
            this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointWeights);
        this.activateVertexBufferVO(0, this._triangleElements.positions);
    };
    GL_TriangleElements.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        //set constants
        if (shader.sceneMatrixIndex >= 0) {
            renderable.renderSceneTransform.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils_1.default.CALCULATION_MATRIX;
            matrix3D.copyFrom(renderable.renderSceneTransform);
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType_1.default.VERTEX, shader.vertexConstantData);
        context.setProgramConstantsFromArray(ContextGLProgramType_1.default.FRAGMENT, shader.fragmentConstantData);
        if (this._indices)
            this.getIndexBufferGL().draw(ContextGLDrawMode_1.default.TRIANGLES, 0, this.numIndices);
        else
            this._stage.context.drawVertices(ContextGLDrawMode_1.default.TRIANGLES, offset, count || this.numVertices);
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.GL_GraphicRenderable}
     * @protected
     */
    GL_TriangleElements.prototype._pGetOverflowElements = function () {
        return new GL_TriangleElements(this._triangleElements, this._stage);
    };
    GL_TriangleElements.elementsType = "[elements Triangle]";
    return GL_TriangleElements;
}(GL_ElementsBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_TriangleElements;

},{"../elements/GL_ElementsBase":"awayjs-renderergl/lib/elements/GL_ElementsBase","awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-stagegl/lib/base/ContextGLDrawMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/elements/IElementsClassGL":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/elements":[function(require,module,exports){
"use strict";
var GL_ElementsBase_1 = require("./elements/GL_ElementsBase");
exports.GL_ElementsBase = GL_ElementsBase_1.default;
var GL_LineElements_1 = require("./elements/GL_LineElements");
exports.GL_LineElements = GL_LineElements_1.default;
var GL_SkyboxElements_1 = require("./elements/GL_SkyboxElements");
exports.GL_SkyboxElements = GL_SkyboxElements_1.default;
var GL_TriangleElements_1 = require("./elements/GL_TriangleElements");
exports.GL_TriangleElements = GL_TriangleElements_1.default;

},{"./elements/GL_ElementsBase":"awayjs-renderergl/lib/elements/GL_ElementsBase","./elements/GL_LineElements":"awayjs-renderergl/lib/elements/GL_LineElements","./elements/GL_SkyboxElements":"awayjs-renderergl/lib/elements/GL_SkyboxElements","./elements/GL_TriangleElements":"awayjs-renderergl/lib/elements/GL_TriangleElements"}],"awayjs-renderergl/lib/errors/AnimationSetError":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ErrorBase_1 = require("awayjs-core/lib/errors/ErrorBase");
var AnimationSetError = (function (_super) {
    __extends(AnimationSetError, _super);
    function AnimationSetError(message) {
        _super.call(this, message);
    }
    return AnimationSetError;
}(ErrorBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationSetError;

},{"awayjs-core/lib/errors/ErrorBase":undefined}],"awayjs-renderergl/lib/errors":[function(require,module,exports){
"use strict";
var AnimationSetError_1 = require("./errors/AnimationSetError");
exports.AnimationSetError = AnimationSetError_1.default;

},{"./errors/AnimationSetError":"awayjs-renderergl/lib/errors/AnimationSetError"}],"awayjs-renderergl/lib/events/AnimationStateEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
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
}(EventBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimationStateEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/AnimatorEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
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
}(EventBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimatorEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/PassEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
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
}(EventBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PassEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/RTTEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
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
}(EventBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RTTEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events/ShadingMethodEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var ShadingMethodEvent = (function (_super) {
    __extends(ShadingMethodEvent, _super);
    function ShadingMethodEvent(type) {
        _super.call(this, type);
    }
    ShadingMethodEvent.SHADER_INVALIDATED = "ShaderInvalidated";
    return ShadingMethodEvent;
}(EventBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShadingMethodEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-renderergl/lib/events":[function(require,module,exports){
"use strict";
var AnimationStateEvent_1 = require("./events/AnimationStateEvent");
exports.AnimationStateEvent = AnimationStateEvent_1.default;
var AnimatorEvent_1 = require("./events/AnimatorEvent");
exports.AnimatorEvent = AnimatorEvent_1.default;
var PassEvent_1 = require("./events/PassEvent");
exports.PassEvent = PassEvent_1.default;
var RTTEvent_1 = require("./events/RTTEvent");
exports.RTTEvent = RTTEvent_1.default;
var ShadingMethodEvent_1 = require("./events/ShadingMethodEvent");
exports.ShadingMethodEvent = ShadingMethodEvent_1.default;

},{"./events/AnimationStateEvent":"awayjs-renderergl/lib/events/AnimationStateEvent","./events/AnimatorEvent":"awayjs-renderergl/lib/events/AnimatorEvent","./events/PassEvent":"awayjs-renderergl/lib/events/PassEvent","./events/RTTEvent":"awayjs-renderergl/lib/events/RTTEvent","./events/ShadingMethodEvent":"awayjs-renderergl/lib/events/ShadingMethodEvent"}],"awayjs-renderergl/lib/filters/BlurFilter3D":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filter3DHBlurTask_1 = require("../filters/tasks/Filter3DHBlurTask");
var Filter3DVBlurTask_1 = require("../filters/tasks/Filter3DVBlurTask");
var Filter3DBase_1 = require("../filters/Filter3DBase");
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
        this._hBlurTask = new Filter3DHBlurTask_1.default(blurX, stepSize);
        this._vBlurTask = new Filter3DVBlurTask_1.default(blurY, stepSize);
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
}(Filter3DBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlurFilter3D;

},{"../filters/Filter3DBase":"awayjs-renderergl/lib/filters/Filter3DBase","../filters/tasks/Filter3DHBlurTask":"awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask","../filters/tasks/Filter3DVBlurTask":"awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask"}],"awayjs-renderergl/lib/filters/CompositeFilter3D":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filter3DCompositeTask_1 = require("../filters/tasks/Filter3DCompositeTask");
var Filter3DBase_1 = require("../filters/Filter3DBase");
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
        this._compositeTask = new Filter3DCompositeTask_1.default(blendMode, exposure);
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
}(Filter3DBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompositeFilter3D;

},{"../filters/Filter3DBase":"awayjs-renderergl/lib/filters/Filter3DBase","../filters/tasks/Filter3DCompositeTask":"awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask"}],"awayjs-renderergl/lib/filters/FXAAFilter3D":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filter3DFXAATask_1 = require("../filters/tasks/Filter3DFXAATask");
var Filter3DBase_1 = require("../filters/Filter3DBase");
var FXAAFilter3D = (function (_super) {
    __extends(FXAAFilter3D, _super);
    /**
     * Creates a new FXAAFilter3D object
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function FXAAFilter3D(amount, stepSize) {
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._fxaaTask = new Filter3DFXAATask_1.default(amount, stepSize);
        this.addTask(this._fxaaTask);
    }
    Object.defineProperty(FXAAFilter3D.prototype, "amount", {
        get: function () {
            return this._fxaaTask.amount;
        },
        set: function (value) {
            this._fxaaTask.amount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FXAAFilter3D.prototype, "stepSize", {
        get: function () {
            return this._fxaaTask.stepSize;
        },
        set: function (value) {
            this._fxaaTask.stepSize = value;
        },
        enumerable: true,
        configurable: true
    });
    return FXAAFilter3D;
}(Filter3DBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FXAAFilter3D;

},{"../filters/Filter3DBase":"awayjs-renderergl/lib/filters/Filter3DBase","../filters/tasks/Filter3DFXAATask":"awayjs-renderergl/lib/filters/tasks/Filter3DFXAATask"}],"awayjs-renderergl/lib/filters/Filter3DBase":[function(require,module,exports){
"use strict";
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
    Object.defineProperty(Filter3DBase.prototype, "rttManager", {
        get: function () {
            return this._rttManager;
        },
        set: function (value) {
            this._rttManager = value;
            for (var i = 0; i < this._tasks.length; ++i)
                this._tasks[i].rttManager = value;
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DBase;

},{}],"awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
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
        var temp1 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp2, 1);
        var temp3 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp3, 1);
        var temp4 = this._registerCache.getFreeFragmentVectorTemp();
        this._registerCache.addFragmentTempUsages(temp4, 1);
        var inputTexture = this._registerCache.getFreeTextureReg();
        this._inputTextureIndex = inputTexture.index;
        var overlayTexture = this._registerCache.getFreeTextureReg();
        this._overlayTextureIndex = overlayTexture.index;
        var exposure = this._registerCache.getFreeFragmentConstant();
        this._exposureIndex = exposure.index * 4;
        var scaling = this._registerCache.getFreeFragmentConstant();
        this._scalingIndex = scaling.index * 4;
        var code;
        code = "tex " + temp1 + ", " + this._uvVarying + ", " + inputTexture + " <2d,linear,clamp>\n" +
            "mul " + temp2 + ", " + this._uvVarying + ", " + scaling + ".zw\n" +
            "add " + temp2 + ", " + temp2 + ", " + scaling + ".xy\n" +
            "tex " + temp2 + ", " + temp2 + ", " + overlayTexture + " <2d,linear,clamp>\n" +
            "mul " + temp2 + ", " + temp2 + ", " + exposure + ".xxx\n" +
            "add " + temp2 + ", " + temp2 + ", " + exposure + ".xxx\n";
        switch (this._blendMode) {
            case "multiply":
                code += "mul oc, " + temp1 + ", " + temp2 + "\n";
                break;
            case "add":
                code += "add oc, " + temp1 + ", " + temp2 + "\n";
                break;
            case "subtract":
                code += "sub oc, " + temp1 + ", " + temp2 + "\n";
                break;
            case "overlay":
                code += "sge " + temp3 + ", " + temp1 + ", " + exposure + ".yyy\n"; // t2 = (blend >= 0.5)? 1 : 0
                code += "sub " + temp1 + ", " + temp3 + ", " + temp1 + "\n"; // base = (1 : 0 - base)
                code += "sub " + temp2 + ", " + temp2 + ", " + temp3 + "\n"; // blend = (blend - 1 : 0)
                code += "mul " + temp2 + ", " + temp2 + ", " + temp1 + "\n"; // blend = blend * base
                code += "sub " + temp4 + ", " + temp3 + ", " + exposure + ".yyy\n"; // t3 = (blend >= 0.5)? 0.5 : -0.5
                code += "div " + temp2 + ", " + temp2 + ", " + temp4 + "\n"; // blend = blend / ( 0.5 : -0.5)
                code += "add oc, " + temp2 + ", " + temp3 + "\n";
                break;
            case "normal":
                // for debugging purposes
                code += "mov oc, " + temp1 + "\n";
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
        context.setProgramConstantsFromArray(ContextGLProgramType_1.default.FRAGMENT, this._data);
        stage.getAbstraction(this._overlayTexture).activate(this._overlayTextureIndex, false);
    };
    Filter3DCompositeTask.prototype.deactivate = function (stage) {
        stage.context.setTextureAt(1, null);
    };
    return Filter3DCompositeTask;
}(Filter3DTaskBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DCompositeTask;

},{"../../filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DFXAATask":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
var Filter3DFXAATask = (function (_super) {
    __extends(Filter3DFXAATask, _super);
    /**
     *
     * @param amount
     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
     */
    function Filter3DFXAATask(amount, stepSize) {
        if (amount === void 0) { amount = 1; }
        if (stepSize === void 0) { stepSize = -1; }
        _super.call(this);
        this._stepSize = 1;
        this._data = new Float32Array(20);
        //luma
        this._data.set([0.299, 0.587, 0.114, 0], 0); //0.212, 0.716, 0.072
        //helpers
        this._data.set([0.25, 0.5, 0.75, 1], 4);
        //settings (screen x, screen y, ...)
        this._data.set([1 / 1024, 1 / 1024, -1, 1], 8);
        //deltas
        this._data.set([1 / 128, 1 / 8, 8, 0], 12);
        //deltas
        this._data.set([1.0 / 3.0 - 0.5, 2.0 / 3.0 - 0.5, 0.0 / 3.0 - 0.5, 3.0 / 3.0 - 0.5], 16);
        this.amount = amount;
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
        var lum = "fc0"; //	0.299, 0.587, 0.114
        var _0 = "fc0.w";
        var _025 = "fc1.x";
        var _05 = "fc1.y";
        var _075 = "fc1.z";
        var _1 = "fc1.w";
        var pix = "fc2.xy";
        var dx = "fc2.x"; // 1/1024
        var dy = "fc2.y"; // 1/1024
        var mOne = "fc2.z"; // -1.0
        var mul = "fc2.w"; // 1.0  -- one for now
        var fxaaReduceMin = "fc3.x"; //1/128
        var fxaaReduceMul = "fc3.y"; //1/8
        var fxaaSpanMax = "fc3.z"; //8
        var delta1 = "fc4.x"; //1.0/3.0 - 0.5
        var delta2 = "fc4.y"; //2.0/3.0 - 0.5
        var delta3 = "fc4.z"; //0.0/3.0 - 0.5
        var delta4 = "fc4.w"; //3.0/3.0 - 0.5
        var uv_in = "v0";
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
        var lumaMin = "ft5.x";
        var lumaMax = "ft5.y";
        var sample = "fs0";
        var temp = tex;
        var tempxy = temp + ".xy";
        var code = new Array();
        //lumas
        code.push("tex", tex, uv_in, sample, "<2d wrap linear>", "\n");
        code.push("dp3", M, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("sub", uv, uv, pix, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", TL, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("add", uv, uv, pix, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", BR, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("sub", uvy, uvy, dy, "\n");
        code.push("add", uvx, uvx, dx, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("dp3", TR, tex, lum, "\n");
        code.push("mov", uv, uv_in, "\n");
        code.push("add", uvy, uvy, dy, "\n");
        code.push("sub", uvx, uvx, dx, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
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
        code.push("tex", result1, uv, sample, "<2d wrap linear>", "\n");
        code.push("mul", tempxy, dirxy, delta2, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
        code.push("add", result1, result1, tex, "\n");
        code.push("mul", result1, result1, _05, "\n");
        code.push("mul", tempxy, dirxy, delta3, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", result2, uv, sample, "<2d wrap linear>", "\n");
        code.push("mul", tempxy, dirxy, delta4, "\n");
        code.push("add", uv, uv_in, tempxy, "\n");
        code.push("tex", tex, uv, sample, "<2d wrap linear>", "\n");
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
        stage.context.setProgramConstantsFromArray(ContextGLProgramType_1.default.FRAGMENT, this._data);
    };
    Filter3DFXAATask.prototype.updateTextures = function (stage) {
        _super.prototype.updateTextures.call(this, stage);
        this.updateBlurData();
    };
    Filter3DFXAATask.prototype.updateBlurData = function () {
        // todo: must be normalized using view size ratio instead of texture
        if (this._rttManager) {
            this._data[8] = 1 / this._textureWidth;
            this._data[9] = 1 / this._textureHeight;
        }
    };
    Filter3DFXAATask.prototype.calculateStepSize = function () {
        this._realStepSize = 1; //this._stepSize > 0? this._stepSize : this._amount > Filter3DVBlurTask.MAX_AUTO_SAMPLES? this._amount/Filter3DVBlurTask.MAX_AUTO_SAMPLES : 1;
    };
    //TODO - remove blur variables and create setters/getters for FXAA
    Filter3DFXAATask.MAX_AUTO_SAMPLES = 15;
    return Filter3DFXAATask;
}(Filter3DTaskBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DFXAATask;

},{"../../filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
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
        code = "mov ft0, v0	\n" +
            "sub ft0.x, v0.x, fc0.x\n";
        code += "tex ft1, ft0, fs0 <2d,linear,clamp>\n";
        for (var x = this._realStepSize; x <= this._amount; x += this._realStepSize) {
            code += "add ft0.x, ft0.x, fc0.y\n" +
                "tex ft2, ft0, fs0 <2d,linear,clamp>\n" +
                "add ft1, ft1, ft2\n";
            ++numSamples;
        }
        code += "mul oc, ft1, fc0.z\n";
        this._data[2] = 1 / numSamples;
        return code;
    };
    Filter3DHBlurTask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType_1.default.FRAGMENT, this._data);
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
}(Filter3DTaskBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DHBlurTask;

},{"../../filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":[function(require,module,exports){
"use strict";
var Image2D_1 = require("awayjs-core/lib/image/Image2D");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AGALMiniAssembler_1 = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ShaderRegisterCache_1 = require("../../shaders/ShaderRegisterCache");
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
        this._registerCache = new ShaderRegisterCache_1.default("baseline");
    }
    ;
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
    Object.defineProperty(Filter3DTaskBase.prototype, "rttManager", {
        get: function () {
            return this._rttManager;
        },
        set: function (value) {
            if (this._rttManager == value)
                return;
            this._rttManager = value;
            this._textureDimensionsInvalid = true;
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
        this._registerCache.reset();
        var vertexByteCode = (new AGALMiniAssembler_1.default().assemble("part vertex 1\n" + this.getVertexCode() + "endpart"))['vertex'].data;
        var fragmentByteCode = (new AGALMiniAssembler_1.default().assemble("part fragment 1\n" + this.getFragmentCode() + "endpart"))['fragment'].data;
        this._program3D.upload(vertexByteCode, fragmentByteCode);
        this._program3DInvalid = false;
    };
    Filter3DTaskBase.prototype.getVertexCode = function () {
        var position = this._registerCache.getFreeVertexAttribute();
        this._positionIndex = position.index;
        var uv = this._registerCache.getFreeVertexAttribute();
        this._uvIndex = uv.index;
        this._uvVarying = this._registerCache.getFreeVarying();
        var code;
        code = "mov op, " + position + "\n" +
            "mov " + this._uvVarying + ", " + uv + "\n";
        return code;
    };
    Filter3DTaskBase.prototype.getFragmentCode = function () {
        throw new AbstractMethodError_1.default();
    };
    Filter3DTaskBase.prototype.updateTextures = function (stage) {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        this._mainInputTexture = new Image2D_1.default(this._scaledTextureWidth, this._scaledTextureHeight);
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DTaskBase;

},{"../../shaders/ShaderRegisterCache":"awayjs-renderergl/lib/shaders/ShaderRegisterCache","awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/image/Image2D":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined}],"awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextGLProgramType_1 = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var Filter3DTaskBase_1 = require("../../filters/tasks/Filter3DTaskBase");
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
        code = "mov ft0, v0	\n" +
            "sub ft0.y, v0.y, fc0.x\n";
        code += "tex ft1, ft0, fs0 <2d,linear,clamp>\n";
        for (var x = this._realStepSize; x <= this._amount; x += this._realStepSize) {
            code += "add ft0.y, ft0.y, fc0.y\n";
            code += "tex ft2, ft0, fs0 <2d,linear,clamp>\n" +
                "add ft1, ft1, ft2\n";
            ++numSamples;
        }
        code += "mul oc, ft1, fc0.z\n";
        this._data[2] = 1 / numSamples;
        return code;
    };
    Filter3DVBlurTask.prototype.activate = function (stage, camera3D, depthTexture) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType_1.default.FRAGMENT, this._data);
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
}(Filter3DTaskBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Filter3DVBlurTask;

},{"../../filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/filters":[function(require,module,exports){
"use strict";
var Filter3DCompositeTask_1 = require("./filters/tasks/Filter3DCompositeTask");
exports.Filter3DCompositeTask = Filter3DCompositeTask_1.default;
var Filter3DFXAATask_1 = require("./filters/tasks/Filter3DFXAATask");
exports.Filter3DFXAATask = Filter3DFXAATask_1.default;
var Filter3DHBlurTask_1 = require("./filters/tasks/Filter3DHBlurTask");
exports.Filter3DHBlurTask = Filter3DHBlurTask_1.default;
var Filter3DTaskBase_1 = require("./filters/tasks/Filter3DTaskBase");
exports.Filter3DTaskBase = Filter3DTaskBase_1.default;
var Filter3DVBlurTask_1 = require("./filters/tasks/Filter3DVBlurTask");
exports.Filter3DVBlurTask = Filter3DVBlurTask_1.default;
var BlurFilter3D_1 = require("./filters/BlurFilter3D");
exports.BlurFilter3D = BlurFilter3D_1.default;
var CompositeFilter3D_1 = require("./filters/CompositeFilter3D");
exports.CompositeFilter3D = CompositeFilter3D_1.default;
var Filter3DBase_1 = require("./filters/Filter3DBase");
exports.Filter3DBase = Filter3DBase_1.default;
var FXAAFilter3D_1 = require("./filters/FXAAFilter3D");
exports.FXAAFilter3D = FXAAFilter3D_1.default;

},{"./filters/BlurFilter3D":"awayjs-renderergl/lib/filters/BlurFilter3D","./filters/CompositeFilter3D":"awayjs-renderergl/lib/filters/CompositeFilter3D","./filters/FXAAFilter3D":"awayjs-renderergl/lib/filters/FXAAFilter3D","./filters/Filter3DBase":"awayjs-renderergl/lib/filters/Filter3DBase","./filters/tasks/Filter3DCompositeTask":"awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask","./filters/tasks/Filter3DFXAATask":"awayjs-renderergl/lib/filters/tasks/Filter3DFXAATask","./filters/tasks/Filter3DHBlurTask":"awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask","./filters/tasks/Filter3DTaskBase":"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase","./filters/tasks/Filter3DVBlurTask":"awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask"}],"awayjs-renderergl/lib/managers/RTTBufferManager":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rectangle_1 = require("awayjs-core/lib/geom/Rectangle");
var EventDispatcher_1 = require("awayjs-core/lib/events/EventDispatcher");
var ImageUtils_1 = require("awayjs-core/lib/utils/ImageUtils");
var RTTEvent_1 = require("../events/RTTEvent");
var RTTBufferManager = (function (_super) {
    __extends(RTTBufferManager, _super);
    function RTTBufferManager(stage) {
        _super.call(this);
        this._viewWidth = -1;
        this._viewHeight = -1;
        this._textureWidth = -1;
        this._textureHeight = -1;
        this._buffersInvalid = true;
        this._renderToTextureRect = new Rectangle_1.default();
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
            this._textureWidth = ImageUtils_1.default.getBestPowerOf2(this._viewWidth);
            if (this._textureWidth > this._viewWidth) {
                this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth) * .5);
                this._renderToTextureRect.width = this._viewWidth;
            }
            else {
                this._renderToTextureRect.x = 0;
                this._renderToTextureRect.width = this._textureWidth;
            }
            this.dispatchEvent(new RTTEvent_1.default(RTTEvent_1.default.RESIZE, this));
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
            this._textureHeight = ImageUtils_1.default.getBestPowerOf2(this._viewHeight);
            if (this._textureHeight > this._viewHeight) {
                this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight) * .5);
                this._renderToTextureRect.height = this._viewHeight;
            }
            else {
                this._renderToTextureRect.y = 0;
                this._renderToTextureRect.height = this._textureHeight;
            }
            this.dispatchEvent(new RTTEvent_1.default(RTTEvent_1.default.RESIZE, this));
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
}(EventDispatcher_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RTTBufferManager;
var RTTBufferManagerVO = (function () {
    function RTTBufferManagerVO() {
    }
    return RTTBufferManagerVO;
}());

},{"../events/RTTEvent":"awayjs-renderergl/lib/events/RTTEvent","awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/utils/ImageUtils":undefined}],"awayjs-renderergl/lib/managers":[function(require,module,exports){
"use strict";
var RTTBufferManager_1 = require("./managers/RTTBufferManager");
exports.RTTBufferManager = RTTBufferManager_1.default;

},{"./managers/RTTBufferManager":"awayjs-renderergl/lib/managers/RTTBufferManager"}],"awayjs-renderergl/lib/renderables/GL_BillboardRenderable":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesBuffer_1 = require("awayjs-core/lib/attributes/AttributesBuffer");
var TriangleElements_1 = require("awayjs-display/lib/graphics/TriangleElements");
var DefaultMaterialManager_1 = require("awayjs-display/lib/managers/DefaultMaterialManager");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
/**
 * @class away.pool.RenderableListItem
 */
var GL_Billboard = (function (_super) {
    __extends(GL_Billboard, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param billboard
     */
    function GL_Billboard(billboard, renderer) {
        _super.call(this, billboard, renderer);
        this._billboard = billboard;
    }
    GL_Billboard.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._billboard = null;
    };
    /**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     */
    GL_Billboard.prototype._pGetElements = function () {
        var texture = this._billboard.material.getTextureAt(0);
        var id = -1;
        if (texture)
            id = ((this.renderable.style ? this.renderable.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager_1.default.getDefaultSampler()).id;
        this._id = id;
        var elements = GL_Billboard._samplerElements[id];
        var width = this._billboard.billboardWidth;
        var height = this._billboard.billboardHeight;
        var billboardRect = this._billboard.billboardRect;
        if (!elements) {
            elements = GL_Billboard._samplerElements[id] = new TriangleElements_1.default(new AttributesBuffer_1.default(11, 4));
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            elements.setIndices(Array(0, 1, 2, 0, 2, 3));
            elements.setPositions(Array(-billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
            elements.setNormals(Array(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
            elements.setTangents(Array(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
            elements.setUVs(Array(0, 0, 1, 0, 1, 1, 0, 1));
        }
        else {
            elements.setPositions(Array(-billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, height - billboardRect.y, 0, width - billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
        }
        return this._stage.getAbstraction(elements);
    };
    GL_Billboard.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._billboard.material || DefaultMaterialManager_1.default.getDefaultMaterial(this.renderable));
    };
    GL_Billboard._samplerElements = new Object();
    return GL_Billboard;
}(GL_RenderableBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_Billboard;

},{"../renderables/GL_RenderableBase":"awayjs-renderergl/lib/renderables/GL_RenderableBase","awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-display/lib/graphics/TriangleElements":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined}],"awayjs-renderergl/lib/renderables/GL_GraphicRenderable":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DefaultMaterialManager_1 = require("awayjs-display/lib/managers/DefaultMaterialManager");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
/**
 * @class away.pool.GL_GraphicRenderable
 */
var GL_GraphicRenderable = (function (_super) {
    __extends(GL_GraphicRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param graphic
     * @param level
     * @param indexOffset
     */
    function GL_GraphicRenderable(graphic, renderer) {
        _super.call(this, graphic, renderer);
        this.graphic = graphic;
    }
    GL_GraphicRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.graphic = null;
    };
    /**
     *
     * @returns {ElementsBase}
     * @protected
     */
    GL_GraphicRenderable.prototype._pGetElements = function () {
        this._offset = this.graphic.offset;
        this._count = this.graphic.count;
        return this._stage.getAbstraction((this.renderable.animator) ? this.renderable.animator.getRenderableElements(this, this.graphic.elements) : this.graphic.elements);
    };
    GL_GraphicRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this.graphic.material || DefaultMaterialManager_1.default.getDefaultMaterial(this.renderable));
    };
    return GL_GraphicRenderable;
}(GL_RenderableBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_GraphicRenderable;

},{"../renderables/GL_RenderableBase":"awayjs-renderergl/lib/renderables/GL_RenderableBase","awayjs-display/lib/managers/DefaultMaterialManager":undefined}],"awayjs-renderergl/lib/renderables/GL_LineSegmentRenderable":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LineElements_1 = require("awayjs-display/lib/graphics/LineElements");
var DefaultMaterialManager_1 = require("awayjs-display/lib/managers/DefaultMaterialManager");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
/**
 * @class away.pool.GL_LineSegmentRenderable
 */
var GL_LineSegmentRenderable = (function (_super) {
    __extends(GL_LineSegmentRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param graphic
     * @param level
     * @param dataOffset
     */
    function GL_LineSegmentRenderable(lineSegment, renderer) {
        _super.call(this, lineSegment, renderer);
        this._lineSegment = lineSegment;
    }
    GL_LineSegmentRenderable.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._lineSegment = null;
    };
    /**
     * //TODO
     *
     * @returns {base.LineElements}
     * @protected
     */
    GL_LineSegmentRenderable.prototype._pGetElements = function () {
        var elements = GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] || (GL_LineSegmentRenderable._lineGraphics[this._lineSegment.id] = new LineElements_1.default());
        var start = this._lineSegment.startPostion;
        var end = this._lineSegment.endPosition;
        var positions = new Float32Array(6);
        var thickness = new Float32Array(1);
        positions[0] = start.x;
        positions[1] = start.y;
        positions[2] = start.z;
        positions[3] = end.x;
        positions[4] = end.y;
        positions[5] = end.z;
        thickness[0] = this._lineSegment.thickness;
        elements.setPositions(positions);
        elements.setThickness(thickness);
        return this._stage.getAbstraction(elements);
    };
    GL_LineSegmentRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._lineSegment.material || DefaultMaterialManager_1.default.getDefaultMaterial(this.renderable));
    };
    /**
     * //TODO
     *
     * @param pool
     * @param renderable
     * @param level
     * @param indexOffset
     * @returns {away.pool.LineSubSpriteRenderable}
     * @private
     */
    GL_LineSegmentRenderable.prototype._pGetOverflowRenderable = function (indexOffset) {
        return new GL_LineSegmentRenderable(this.renderable, this._renderer);
    };
    GL_LineSegmentRenderable._lineGraphics = new Object();
    return GL_LineSegmentRenderable;
}(GL_RenderableBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_LineSegmentRenderable;

},{"../renderables/GL_RenderableBase":"awayjs-renderergl/lib/renderables/GL_RenderableBase","awayjs-display/lib/graphics/LineElements":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined}],"awayjs-renderergl/lib/renderables/GL_RenderableBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var AbstractionBase_1 = require("awayjs-core/lib/library/AbstractionBase");
var RenderableEvent_1 = require("awayjs-display/lib/events/RenderableEvent");
/**
 * @class RenderableListItem
 */
var GL_RenderableBase = (function (_super) {
    __extends(GL_RenderableBase, _super);
    /**
     *
     * @param renderable
     * @param sourceEntity
     * @param surface
     * @param renderer
     */
    function GL_RenderableBase(renderable, renderer) {
        var _this = this;
        _super.call(this, renderable, renderer);
        this._count = 0;
        this._offset = 0;
        this._elementsDirty = true;
        this._surfaceDirty = true;
        this.images = new Array();
        this.samplers = new Array();
        this._onInvalidateSurfaceDelegate = function (event) { return _this._onInvalidateSurface(event); };
        this._onInvalidateElementsDelegate = function (event) { return _this.onInvalidateElements(event); };
        //store a reference to the pool for later disposal
        this._renderer = renderer;
        this._stage = renderer.stage;
        this.renderable = renderable;
        this.renderable.addEventListener(RenderableEvent_1.default.INVALIDATE_SURFACE, this._onInvalidateSurfaceDelegate);
        this.renderable.addEventListener(RenderableEvent_1.default.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
    }
    Object.defineProperty(GL_RenderableBase.prototype, "elementsGL", {
        get: function () {
            if (this._elementsDirty)
                this._updateElements();
            return this._elementsGL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_RenderableBase.prototype, "surfaceGL", {
        get: function () {
            if (this._surfaceDirty)
                this._updateSurface();
            return this._surfaceGL;
        },
        enumerable: true,
        configurable: true
    });
    GL_RenderableBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this.next = null;
        this.masksConfig = null;
        this.renderSceneTransform = null;
        this._renderer = null;
        this._stage = null;
        this.sourceEntity = null;
        this.renderable.removeEventListener(RenderableEvent_1.default.INVALIDATE_SURFACE, this._onInvalidateSurfaceDelegate);
        this.renderable.removeEventListener(RenderableEvent_1.default.INVALIDATE_ELEMENTS, this._onInvalidateElementsDelegate);
        this.renderable = null;
        this._surfaceGL.usages--;
        if (!this._surfaceGL.usages)
            this._surfaceGL.onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, this._surfaceGL.surface));
        this._surfaceGL = null;
        this._elementsGL = null;
    };
    GL_RenderableBase.prototype.onInvalidateElements = function (event) {
        this._elementsDirty = true;
    };
    GL_RenderableBase.prototype._onInvalidateSurface = function (event) {
        this._surfaceDirty = true;
    };
    GL_RenderableBase.prototype._pGetElements = function () {
        throw new AbstractMethodError_1.default();
    };
    GL_RenderableBase.prototype._pGetSurface = function () {
        throw new AbstractMethodError_1.default();
    };
    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    GL_RenderableBase.prototype._iRender = function (pass, camera, viewProjection) {
        this._setRenderState(pass, camera, viewProjection);
        this._elementsGL.draw(this, pass.shader, camera, viewProjection, this._count, this._offset);
    };
    GL_RenderableBase.prototype._setRenderState = function (pass, camera, viewProjection) {
        if (this._elementsDirty)
            this._updateElements();
        pass._setRenderState(this, camera, viewProjection);
        if (pass.shader.activeElements != this._elementsGL) {
            pass.shader.activeElements = this._elementsGL;
            this._elementsGL._setRenderState(this, pass.shader, camera, viewProjection);
        }
    };
    /**
     * //TODO
     *
     * @private
     */
    GL_RenderableBase.prototype._updateElements = function () {
        this._elementsGL = this._pGetElements();
        this._elementsDirty = false;
    };
    GL_RenderableBase.prototype._updateSurface = function () {
        var surfaceGL = this._pGetSurface();
        if (this._surfaceGL != surfaceGL) {
            if (this._surfaceGL) {
                this._surfaceGL.usages--;
                //dispose current surfaceGL object
                if (!this._surfaceGL.usages)
                    this._surfaceGL.onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, this._surfaceGL.surface));
            }
            this._surfaceGL = surfaceGL;
            this._surfaceGL.usages++;
        }
        //create a cache of image & sampler objects for the renderable
        var numImages = surfaceGL.numImages;
        this.images.length = numImages;
        this.samplers.length = numImages;
        this.uvMatrix = this.renderable.style ? this.renderable.style.uvMatrix : this._surfaceGL.surface.style ? this._surfaceGL.surface.style.uvMatrix : null;
        var numTextures = this._surfaceGL.surface.getNumTextures();
        var texture;
        var numImages;
        var image;
        var sampler;
        var index;
        for (var i = 0; i < numTextures; i++) {
            texture = this._surfaceGL.surface.getTextureAt(i);
            numImages = texture.getNumImages();
            for (var j = 0; j < numImages; j++) {
                index = surfaceGL.getImageIndex(texture, j);
                image = this.renderable.style ? this.renderable.style.getImageAt(texture, j) : null;
                this.images[index] = image ? this._stage.getAbstraction(image) : null;
                sampler = this.renderable.style ? this.renderable.style.getSamplerAt(texture, j) : null;
                this.samplers[index] = sampler ? this._stage.getAbstraction(sampler) : null;
            }
        }
        this._surfaceDirty = false;
    };
    return GL_RenderableBase;
}(AbstractionBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_RenderableBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-display/lib/events/RenderableEvent":undefined}],"awayjs-renderergl/lib/renderables/GL_SkyboxRenderable":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesBuffer_1 = require("awayjs-core/lib/attributes/AttributesBuffer");
var TriangleElements_1 = require("awayjs-display/lib/graphics/TriangleElements");
var GL_RenderableBase_1 = require("../renderables/GL_RenderableBase");
var GL_SkyboxElements_1 = require("../elements/GL_SkyboxElements");
/**
 * @class away.pool.GL_SkyboxRenderable
 */
var GL_SkyboxRenderable = (function (_super) {
    __extends(GL_SkyboxRenderable, _super);
    /**
     * //TODO
     *
     * @param pool
     * @param skybox
     */
    function GL_SkyboxRenderable(skybox, renderer) {
        _super.call(this, skybox, renderer);
        this._skybox = skybox;
    }
    /**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     * @private
     */
    GL_SkyboxRenderable.prototype._pGetElements = function () {
        var elementsGL = GL_SkyboxRenderable._elementsGL;
        if (!elementsGL) {
            var elements = new TriangleElements_1.default(new AttributesBuffer_1.default(11, 4));
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            elements.setIndices(Array(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
            elements.setPositions(Array(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
            elementsGL = GL_SkyboxRenderable._elementsGL = new GL_SkyboxElements_1.default(elements, this._stage);
        }
        return elementsGL;
    };
    GL_SkyboxRenderable.prototype._pGetSurface = function () {
        return this._renderer.getSurfacePool(this.elementsGL).getAbstraction(this._skybox);
    };
    GL_SkyboxRenderable._iIncludeDependencies = function (shader) {
    };
    return GL_SkyboxRenderable;
}(GL_RenderableBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_SkyboxRenderable;

},{"../elements/GL_SkyboxElements":"awayjs-renderergl/lib/elements/GL_SkyboxElements","../renderables/GL_RenderableBase":"awayjs-renderergl/lib/renderables/GL_RenderableBase","awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-display/lib/graphics/TriangleElements":undefined}],"awayjs-renderergl/lib/renderables":[function(require,module,exports){
"use strict";
var GL_BillboardRenderable_1 = require("./renderables/GL_BillboardRenderable");
exports.GL_BillboardRenderable = GL_BillboardRenderable_1.default;
var GL_GraphicRenderable_1 = require("./renderables/GL_GraphicRenderable");
exports.GL_GraphicRenderable = GL_GraphicRenderable_1.default;
var GL_LineSegmentRenderable_1 = require("./renderables/GL_LineSegmentRenderable");
exports.GL_LineSegmentRenderable = GL_LineSegmentRenderable_1.default;
var GL_RenderableBase_1 = require("./renderables/GL_RenderableBase");
exports.GL_RenderableBase = GL_RenderableBase_1.default;
var GL_SkyboxRenderable_1 = require("./renderables/GL_SkyboxRenderable");
exports.GL_SkyboxRenderable = GL_SkyboxRenderable_1.default;

},{"./renderables/GL_BillboardRenderable":"awayjs-renderergl/lib/renderables/GL_BillboardRenderable","./renderables/GL_GraphicRenderable":"awayjs-renderergl/lib/renderables/GL_GraphicRenderable","./renderables/GL_LineSegmentRenderable":"awayjs-renderergl/lib/renderables/GL_LineSegmentRenderable","./renderables/GL_RenderableBase":"awayjs-renderergl/lib/renderables/GL_RenderableBase","./renderables/GL_SkyboxRenderable":"awayjs-renderergl/lib/renderables/GL_SkyboxRenderable"}],"awayjs-renderergl/lib/shaders/LightingShader":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LightSources_1 = require("awayjs-display/lib/materials/LightSources");
var ContextGLProfile_1 = require("awayjs-stagegl/lib/base/ContextGLProfile");
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
        this.usesLightFallOff = this._lightingPass.enableLightFallOff && this.profile != ContextGLProfile_1.default.BASELINE_CONSTRAINED;
        this.usesCommonData = this.usesLightFallOff;
        this.numLights = numAllLights + numLightProbes;
        this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources_1.default.LIGHTS) != 0;
        this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources_1.default.PROBES) != 0;
        this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources_1.default.LIGHTS) != 0;
        this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources_1.default.PROBES) != 0;
        this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources_1.default.LIGHTS) != 0;
        this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources_1.default.PROBES) != 0;
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
        return new LightingCompiler_1.default(elementsClass, pass, this);
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
}(ShaderBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LightingShader;

},{"../shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","../shaders/compilers/LightingCompiler":"awayjs-renderergl/lib/shaders/compilers/LightingCompiler","awayjs-display/lib/materials/LightSources":undefined,"awayjs-stagegl/lib/base/ContextGLProfile":undefined}],"awayjs-renderergl/lib/shaders/RegisterPool":[function(require,module,exports){
"use strict";
var ShaderRegisterElement_1 = require("../shaders/ShaderRegisterElement");
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
            vectorRegisters[i] = new ShaderRegisterElement_1.default(regName, i);
            for (var j = 0; j < 4; ++j)
                registerComponents[j][i] = new ShaderRegisterElement_1.default(regName, i, j);
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPool;

},{"../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/shaders/ShaderBase":[function(require,module,exports){
"use strict";
var BlendMode_1 = require("awayjs-core/lib/image/BlendMode");
var ArgumentError_1 = require("awayjs-core/lib/errors/ArgumentError");
var ContextGLBlendFactor_1 = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode_1 = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLTriangleFace_1 = require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
var CompilerBase_1 = require("../shaders/compilers/CompilerBase");
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
    function ShaderBase(elementsClass, pass, stage) {
        this._abstractionPool = new Object();
        this._blendFactorSource = ContextGLBlendFactor_1.default.ONE;
        this._blendFactorDest = ContextGLBlendFactor_1.default.ZERO;
        this._invalidProgram = true;
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        this.usesBlending = false;
        this.useImageRect = false;
        this.usesCurves = false;
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        this.depthCompareMode = ContextGLCompareMode_1.default.LESS_EQUAL;
        /**
         * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
         */
        this.writeDepth = true;
        this._defaultCulling = ContextGLTriangleFace_1.default.BACK;
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
        this.usesPositionFragment = false;
        /**
         *
         */
        this.imageIndices = new Array();
        this._elementsClass = elementsClass;
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
    Object.defineProperty(ShaderBase.prototype, "usesAnimation", {
        get: function () {
            return this._usesAnimation;
        },
        set: function (value) {
            if (this._usesAnimation == value)
                return;
            this._usesAnimation = value;
            this.invalidateProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedVertexConstants", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedVertexConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedFragmentConstants", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedFragmentConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedStreams", {
        /**
         * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
         */
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedStreams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedTextures", {
        /**
         *
         */
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedTextures;
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
    ShaderBase.prototype.clearAbstraction = function (texture) {
        this._abstractionPool[texture.id] = null;
    };
    /**
     *
     * @param imageObjectClass
     */
    ShaderBase.registerAbstraction = function (gl_assetClass, assetClass) {
        ShaderBase._abstractionClassPool[assetClass.assetType] = gl_assetClass;
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
     * @param elementsClass
     * @param pass
     * @param stage
     * @returns {CompilerBase}
     */
    ShaderBase.prototype.createCompiler = function (elementsClass, pass) {
        return new CompilerBase_1.default(elementsClass, pass, this);
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
        this.usesPositionFragment = false;
        this.usesFragmentAnimation = false;
        this.usesTangentSpace = false;
        this.outputsNormals = false;
        this.outputsTangentNormals = false;
    };
    ShaderBase.prototype.pInitRegisterIndices = function () {
        this.commonsDataIndex = -1;
        this.cameraPositionIndex = -1;
        this.curvesIndex = -1;
        this.uvIndex = -1;
        this.uvMatrixIndex = -1;
        this.colorTransformIndex = -1;
        this.secondaryUVIndex = -1;
        this.normalIndex = -1;
        this.colorBufferIndex = -1;
        this.tangentIndex = -1;
        this.sceneMatrixIndex = -1;
        this.sceneNormalMatrixIndex = -1;
        this.jointIndexIndex = -1;
        this.jointWeightIndex = -1;
        this.imageIndices.length = 0;
    };
    /**
     * Initializes the unchanging constant data for this shader object.
     */
    ShaderBase.prototype.initConstantData = function (registerCache) {
        //Updates the amount of used register indices.
        this._numUsedVertexConstants = registerCache.numUsedVertexConstants;
        this._numUsedFragmentConstants = registerCache.numUsedFragmentConstants;
        this._numUsedStreams = registerCache.numUsedStreams;
        this._numUsedTextures = registerCache.numUsedTextures;
        this.vertexConstantData = new Float32Array(registerCache.numUsedVertexConstants * 4);
        this.fragmentConstantData = new Float32Array(registerCache.numUsedFragmentConstants * 4);
        //Initializes commonly required constant values.
        if (this.commonsDataIndex >= 0) {
            this.fragmentConstantData[this.commonsDataIndex] = .5;
            this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
            this.fragmentConstantData[this.commonsDataIndex + 2] = 1 / 255;
            this.fragmentConstantData[this.commonsDataIndex + 3] = 1;
        }
        //Initializes the default UV transformation matrix.
        if (this.uvMatrixIndex >= 0) {
            this.vertexConstantData[this.uvMatrixIndex] = 1;
            this.vertexConstantData[this.uvMatrixIndex + 1] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 2] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 3] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 4] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 5] = 1;
            this.vertexConstantData[this.uvMatrixIndex + 6] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 7] = 0;
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
        // init constant data in pass
        this._pass._iInitConstantData(this);
        //init constant data in animation
        if (this.usesAnimation)
            this._pass.animationSet.doneAGALCode(this);
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
            case BlendMode_1.default.NORMAL:
                this._blendFactorSource = ContextGLBlendFactor_1.default.ONE;
                this._blendFactorDest = ContextGLBlendFactor_1.default.ZERO;
                this.usesBlending = false;
                break;
            case BlendMode_1.default.LAYER:
                this._blendFactorSource = ContextGLBlendFactor_1.default.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor_1.default.ONE_MINUS_SOURCE_ALPHA;
                this.usesBlending = true;
                break;
            case BlendMode_1.default.MULTIPLY:
                this._blendFactorSource = ContextGLBlendFactor_1.default.ZERO;
                this._blendFactorDest = ContextGLBlendFactor_1.default.SOURCE_COLOR;
                this.usesBlending = true;
                break;
            case BlendMode_1.default.ADD:
                this._blendFactorSource = ContextGLBlendFactor_1.default.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor_1.default.ONE;
                this.usesBlending = true;
                break;
            case BlendMode_1.default.ALPHA:
                this._blendFactorSource = ContextGLBlendFactor_1.default.ZERO;
                this._blendFactorDest = ContextGLBlendFactor_1.default.SOURCE_ALPHA;
                this.usesBlending = true;
                break;
            default:
                throw new ArgumentError_1.default("Unsupported blend mode!");
        }
    };
    /**
     * @inheritDoc
     */
    ShaderBase.prototype._iActivate = function (camera) {
        this._stage.context.setCulling(this.useBothSides ? ContextGLTriangleFace_1.default.NONE : this._defaultCulling, camera.projection.coordinateSystem);
        if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
            var pos = camera.scenePosition;
            this.vertexConstantData[this.cameraPositionIndex] = pos.x;
            this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
            this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
        }
        this._stage.context.setDepthTest((this.writeDepth && !this.usesBlending), this.depthCompareMode);
        if (this.usesBlending)
            this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
        this.activeElements = null;
    };
    /**
     * @inheritDoc
     */
    ShaderBase.prototype._iDeactivate = function () {
        //For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
        this._stage.context.setDepthTest(true, ContextGLCompareMode_1.default.LESS_EQUAL);
        this.activeElements = null;
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    ShaderBase.prototype._setRenderState = function (renderable, camera, viewProjection) {
        if (renderable.renderable.animator)
            renderable.renderable.animator.setRenderState(this, renderable, this._stage, camera);
        if (this.usesUVTransform) {
            var uvMatrix = renderable.uvMatrix;
            if (uvMatrix) {
                this.vertexConstantData[this.uvMatrixIndex] = uvMatrix.a;
                this.vertexConstantData[this.uvMatrixIndex + 1] = uvMatrix.b;
                this.vertexConstantData[this.uvMatrixIndex + 3] = uvMatrix.tx;
                this.vertexConstantData[this.uvMatrixIndex + 4] = uvMatrix.c;
                this.vertexConstantData[this.uvMatrixIndex + 5] = uvMatrix.d;
                this.vertexConstantData[this.uvMatrixIndex + 7] = uvMatrix.ty;
            }
            else {
                this.vertexConstantData[this.uvMatrixIndex] = 1;
                this.vertexConstantData[this.uvMatrixIndex + 1] = 0;
                this.vertexConstantData[this.uvMatrixIndex + 3] = 0;
                this.vertexConstantData[this.uvMatrixIndex + 4] = 0;
                this.vertexConstantData[this.uvMatrixIndex + 5] = 1;
                this.vertexConstantData[this.uvMatrixIndex + 7] = 0;
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
    ShaderBase.prototype.dispose = function () {
        this._programData.dispose();
        this._programData = null;
    };
    ShaderBase.prototype._updateProgram = function () {
        this._invalidProgram = false;
        var compiler = this.createCompiler(this._elementsClass, this._pass);
        compiler.compile();
        this._calcAnimationCode(compiler._pRegisterCache, compiler.shadedTarget, compiler._pSharedRegisters);
        //initialise the required shader constants
        this.initConstantData(compiler._pRegisterCache);
        var programData = this._stage.getProgramData(this._animationVertexCode + compiler.vertexCode, compiler.fragmentCode + this._animationFragmentCode + compiler.postAnimationFragmentCode);
        //check program data hasn't changed, keep count of program usages
        if (this._programData != programData) {
            if (this._programData)
                this._programData.dispose();
            this._programData = programData;
            programData.usages++;
        }
    };
    ShaderBase.prototype._calcAnimationCode = function (registerCache, shadedTarget, sharedRegisters) {
        //reset code
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        //check to see if GPU animation is used
        if (this.usesAnimation) {
            var animationSet = this._pass.animationSet;
            this._animationVertexCode += animationSet.getAGALVertexCode(this, registerCache, sharedRegisters);
            if (this.uvDependencies > 0 && !this.usesUVTransform)
                this._animationVertexCode += animationSet.getAGALUVCode(this, registerCache, sharedRegisters);
            if (this.usesFragmentAnimation)
                this._animationFragmentCode += animationSet.getAGALFragmentCode(this, registerCache, shadedTarget);
        }
        else {
            // simply write attributes to targets, do not animate them
            // projection will pick up on targets[0] to do the projection
            var len = sharedRegisters.animatableAttributes.length;
            for (var i = 0; i < len; ++i)
                this._animationVertexCode += "mov " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animatableAttributes[i] + "\n";
            if (this.uvDependencies > 0 && !this.usesUVTransform)
                this._animationVertexCode += "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
        }
    };
    ShaderBase.prototype.setVertexConst = function (index, x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        index *= 4;
        this.vertexConstantData[index++] = x;
        this.vertexConstantData[index++] = y;
        this.vertexConstantData[index++] = z;
        this.vertexConstantData[index] = w;
    };
    ShaderBase.prototype.setVertexConstFromArray = function (index, data) {
        index *= 4;
        for (var i = 0; i < data.length; i++)
            this.vertexConstantData[index++] = data[i];
    };
    ShaderBase.prototype.setVertexConstFromMatrix = function (index, matrix) {
        index *= 4;
        var rawData = matrix.rawData;
        this.vertexConstantData[index++] = rawData[0];
        this.vertexConstantData[index++] = rawData[4];
        this.vertexConstantData[index++] = rawData[8];
        this.vertexConstantData[index++] = rawData[12];
        this.vertexConstantData[index++] = rawData[1];
        this.vertexConstantData[index++] = rawData[5];
        this.vertexConstantData[index++] = rawData[9];
        this.vertexConstantData[index++] = rawData[13];
        this.vertexConstantData[index++] = rawData[2];
        this.vertexConstantData[index++] = rawData[6];
        this.vertexConstantData[index++] = rawData[10];
        this.vertexConstantData[index++] = rawData[14];
        this.vertexConstantData[index++] = rawData[3];
        this.vertexConstantData[index++] = rawData[7];
        this.vertexConstantData[index++] = rawData[11];
        this.vertexConstantData[index] = rawData[15];
    };
    ShaderBase.prototype.setFragmentConst = function (index, x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        index *= 4;
        this.fragmentConstantData[index++] = x;
        this.fragmentConstantData[index++] = y;
        this.fragmentConstantData[index++] = z;
        this.fragmentConstantData[index] = w;
    };
    ShaderBase._abstractionClassPool = new Object();
    return ShaderBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShaderBase;

},{"../shaders/compilers/CompilerBase":"awayjs-renderergl/lib/shaders/compilers/CompilerBase","awayjs-core/lib/errors/ArgumentError":undefined,"awayjs-core/lib/image/BlendMode":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLTriangleFace":undefined}],"awayjs-renderergl/lib/shaders/ShaderRegisterCache":[function(require,module,exports){
"use strict";
var RegisterPool_1 = require("../shaders/RegisterPool");
var ShaderRegisterElement_1 = require("../shaders/ShaderRegisterElement");
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
        this.reset();
    }
    /**
     * Resets all registers.
     */
    ShaderRegisterCache.prototype.reset = function () {
        this._fragmentTempCache = new RegisterPool_1.default("ft", 8, false);
        this._vertexTempCache = new RegisterPool_1.default("vt", 8, false);
        this._varyingCache = new RegisterPool_1.default("v", 8);
        this._textureCache = new RegisterPool_1.default("fs", 8);
        this._vertexAttributesCache = new RegisterPool_1.default("va", 8);
        this._fragmentConstantsCache = new RegisterPool_1.default("fc", 28);
        this._vertexConstantsCache = new RegisterPool_1.default("vc", 128);
        this._fragmentOutputRegister = new ShaderRegisterElement_1.default("oc", -1);
        this._vertexOutputRegister = new ShaderRegisterElement_1.default("op", -1);
        this._numUsedVertexConstants = 0;
        this._numUsedStreams = 0;
        this._numUsedTextures = 0;
        this._numUsedVaryings = 0;
        this._numUsedFragmentConstants = 0;
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShaderRegisterCache;

},{"../shaders/RegisterPool":"awayjs-renderergl/lib/shaders/RegisterPool","../shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement"}],"awayjs-renderergl/lib/shaders/ShaderRegisterData":[function(require,module,exports){
"use strict";
/**
 * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
 */
var ShaderRegisterData = (function () {
    function ShaderRegisterData() {
        this.textures = new Array();
        this.animatableAttributes = new Array();
        this.animationTargetRegisters = new Array();
    }
    return ShaderRegisterData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShaderRegisterData;

},{}],"awayjs-renderergl/lib/shaders/ShaderRegisterElement":[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShaderRegisterElement;

},{}],"awayjs-renderergl/lib/shaders/compilers/CompilerBase":[function(require,module,exports){
"use strict";
var ShaderRegisterCache_1 = require("../../shaders/ShaderRegisterCache");
var ShaderRegisterData_1 = require("../../shaders/ShaderRegisterData");
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
    function CompilerBase(elementsClass, pass, shader) {
        this._pVertexCode = ''; // Changed to emtpy string- AwayTS
        this._pFragmentCode = ''; // Changed to emtpy string - AwayTS
        this._pPostAnimationFragmentCode = ''; // Changed to emtpy string - AwayTS
        this._pElementsClass = elementsClass;
        this._pRenderPass = pass;
        this._pShader = shader;
        this._pSharedRegisters = new ShaderRegisterData_1.default();
        this._pRegisterCache = new ShaderRegisterCache_1.default(shader.profile);
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
        if (this._pShader.usesPositionFragment)
            this.compilePositionCode();
        if (this._pShader.usesCurves)
            this.compileCurvesCode();
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
        this._pVertexCode += this._pElementsClass._iGetVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._pElementsClass._iGetFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
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
        this._pVertexCode += "m44 " + this._pSharedRegisters.globalPositionVertex + ", " + this._pSharedRegisters.animatedPosition + ", " + sceneMatrixReg + "\n";
        if (this._pShader.usesGlobalPosFragment) {
            this._pSharedRegisters.globalPositionVarying = this._pRegisterCache.getFreeVarying();
            this._pVertexCode += "mov " + this._pSharedRegisters.globalPositionVarying + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
        }
    };
    CompilerBase.prototype.compilePositionCode = function () {
        this._pSharedRegisters.positionVarying = this._pRegisterCache.getFreeVarying();
        this._pVertexCode += "mov " + this._pSharedRegisters.positionVarying + ", " + this._pSharedRegisters.animatedPosition + "\n";
    };
    CompilerBase.prototype.compileCurvesCode = function () {
        this._pSharedRegisters.curvesInput = this._pRegisterCache.getFreeVertexAttribute();
        this._pShader.curvesIndex = this._pSharedRegisters.curvesInput.index;
        this._pSharedRegisters.curvesVarying = this._pRegisterCache.getFreeVarying();
        this._pVertexCode += "mov " + this._pSharedRegisters.curvesVarying + ", " + this._pSharedRegisters.curvesInput + "\n";
        var temp = this._pRegisterCache.getFreeFragmentSingleTemp();
        this._pFragmentCode += "mul " + temp + ", " + this._pSharedRegisters.curvesVarying + ".y, " + this._pSharedRegisters.curvesVarying + ".y\n" +
            "sub " + temp + ", " + temp + ", " + this._pSharedRegisters.curvesVarying + ".z\n" +
            "mul " + temp + ", " + temp + ", " + this._pSharedRegisters.curvesVarying + ".x\n" +
            "kil " + temp + "\n";
    };
    /**
     * Calculate the (possibly animated) UV coordinates.
     */
    CompilerBase.prototype.compileUVCode = function () {
        var uvAttributeReg = this._pRegisterCache.getFreeVertexAttribute();
        this._pShader.uvIndex = uvAttributeReg.index;
        var varying = this._pSharedRegisters.uvVarying = this._pRegisterCache.getFreeVarying();
        if (this._pShader.usesUVTransform) {
            // a, b, 0, tx
            // c, d, 0, ty
            var uvTransform1 = this._pRegisterCache.getFreeVertexConstant();
            var uvTransform2 = this._pRegisterCache.getFreeVertexConstant();
            this._pShader.uvMatrixIndex = uvTransform1.index * 4;
            this._pVertexCode += "dp4 " + varying + ".x, " + uvAttributeReg + ", " + uvTransform1 + "\n" +
                "dp4 " + varying + ".y, " + uvAttributeReg + ", " + uvTransform2 + "\n" +
                "mov " + varying + ".zw, " + uvAttributeReg + ".zw \n";
        }
        else {
            this._pShader.uvMatrixIndex = -1;
            this._pSharedRegisters.uvTarget = varying;
            this._pSharedRegisters.uvSource = uvAttributeReg;
        }
    };
    /**
     * Provide the secondary UV coordinates.
     */
    CompilerBase.prototype.compileSecondaryUVCode = function () {
        var uvAttributeReg = this._pRegisterCache.getFreeVertexAttribute();
        this._pShader.secondaryUVIndex = uvAttributeReg.index;
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
            this._pVertexCode += "sub " + temp + ", " + cameraPositionReg + ", " + this._pSharedRegisters.animatedPosition + "\n" +
                "m33 " + this._pSharedRegisters.viewDirVarying + ".xyz, " + temp + ", " + this._pSharedRegisters.animatedTangent + "\n" +
                "mov " + this._pSharedRegisters.viewDirVarying + ".w, " + this._pSharedRegisters.animatedPosition + ".w\n";
        }
        else {
            this._pVertexCode += "sub " + this._pSharedRegisters.viewDirVarying + ", " + cameraPositionReg + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
            this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.globalPositionVertex);
        }
        //TODO is this required in all cases? (re: distancemappass)
        this._pFragmentCode += "nrm " + this._pSharedRegisters.viewDirFragment + ".xyz, " + this._pSharedRegisters.viewDirVarying + "\n" +
            "mov " + this._pSharedRegisters.viewDirFragment + ".w,   " + this._pSharedRegisters.viewDirVarying + ".w\n";
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
                this._pVertexCode += "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + this._pSharedRegisters.animatedNormal + "\n" +
                    "nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + this._pSharedRegisters.animatedTangent + "\n" +
                    "crs " + this._pSharedRegisters.bitangent + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n";
                this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
            }
            else {
                //Compiles the vertex shader code for tangent-space normal maps.
                this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
                this._pSharedRegisters.bitangentVarying = this._pRegisterCache.getFreeVarying();
                var temp = this._pRegisterCache.getFreeVertexVectorTemp();
                this._pVertexCode += "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" +
                    "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + temp + "\n" +
                    "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" +
                    "nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + temp + "\n" +
                    "mov " + this._pSharedRegisters.tangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".x  \n" +
                    "mov " + this._pSharedRegisters.tangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".x  \n" +
                    "mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" +
                    "mov " + this._pSharedRegisters.bitangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".y  \n" +
                    "mov " + this._pSharedRegisters.bitangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".y  \n" +
                    "mov " + this._pSharedRegisters.bitangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" +
                    "mov " + this._pSharedRegisters.normalVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".z  \n" +
                    "mov " + this._pSharedRegisters.normalVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".z  \n" +
                    "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" +
                    "crs " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n" +
                    "mov " + this._pSharedRegisters.tangentVarying + ".y, " + temp + ".x    \n" +
                    "mov " + this._pSharedRegisters.bitangentVarying + ".y, " + temp + ".y  \n" +
                    "mov " + this._pSharedRegisters.normalVarying + ".y, " + temp + ".z    \n";
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
                this._pFragmentCode += "nrm " + t + ".xyz, " + this._pSharedRegisters.tangentVarying + "\n" +
                    "mov " + t + ".w, " + this._pSharedRegisters.tangentVarying + ".w	\n" +
                    "nrm " + b + ".xyz, " + this._pSharedRegisters.bitangentVarying + "\n" +
                    "nrm " + n + ".xyz, " + this._pSharedRegisters.normalVarying + "\n";
                //compile custom fragment code for normal calcs
                this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters) +
                    "m33 " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalFragment + ", " + t + "\n" +
                    "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";
                this._pRegisterCache.removeFragmentTempUsage(b);
                this._pRegisterCache.removeFragmentTempUsage(t);
                this._pRegisterCache.removeFragmentTempUsage(n);
            }
        }
        else {
            // no output, world space is enough
            this._pVertexCode += "m33 " + this._pSharedRegisters.normalVarying + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" +
                "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.animatedNormal + ".w\n";
            this._pFragmentCode += "nrm " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalVarying + "\n" +
                "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";
            if (this._pShader.tangentDependencies > 0) {
                this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "m33 " + this._pSharedRegisters.tangentVarying + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" +
                    "mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.animatedTangent + ".w\n";
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
        this._pSharedRegisters.animatedPosition = this._pRegisterCache.getFreeVertexVectorTemp();
        this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedPosition, 1);
        this._pSharedRegisters.animatableAttributes.push(this._pRegisterCache.getFreeVertexAttribute());
        this._pSharedRegisters.animationTargetRegisters.push(this._pSharedRegisters.animatedPosition);
        this._pVertexCode = "";
        this._pFragmentCode = "";
        this._pPostAnimationFragmentCode = "";
        //create commonly shared constant registers
        if (this._pShader.usesCommonData || this._pShader.normalDependencies > 0) {
            this._pSharedRegisters.commons = this._pRegisterCache.getFreeFragmentConstant();
            this._pShader.commonsDataIndex = this._pSharedRegisters.commons.index * 4;
        }
        //Creates the registers to contain the tangent data.
        //Needs to be created FIRST and in this order (for when using tangent space)
        if (this._pShader.tangentDependencies > 0 || this._pShader.outputsNormals) {
            this._pSharedRegisters.tangentInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShader.tangentIndex = this._pSharedRegisters.tangentInput.index;
            this._pSharedRegisters.animatedTangent = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedTangent, 1);
            if (this._pShader.usesTangentSpace) {
                this._pSharedRegisters.bitangent = this._pRegisterCache.getFreeVertexVectorTemp();
                this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.bitangent, 1);
            }
            this._pSharedRegisters.animatableAttributes.push(this._pSharedRegisters.tangentInput);
            this._pSharedRegisters.animationTargetRegisters.push(this._pSharedRegisters.animatedTangent);
        }
        if (this._pShader.normalDependencies > 0) {
            this._pSharedRegisters.normalInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShader.normalIndex = this._pSharedRegisters.normalInput.index;
            this._pSharedRegisters.animatedNormal = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedNormal, 1);
            this._pSharedRegisters.animatableAttributes.push(this._pSharedRegisters.normalInput);
            this._pSharedRegisters.animationTargetRegisters.push(this._pSharedRegisters.animatedNormal);
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
         * The register containing the final shaded colour.
         */
        get: function () {
            return this._pSharedRegisters.shadedTarget;
        },
        enumerable: true,
        configurable: true
    });
    return CompilerBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompilerBase;

},{"../../shaders/ShaderRegisterCache":"awayjs-renderergl/lib/shaders/ShaderRegisterCache","../../shaders/ShaderRegisterData":"awayjs-renderergl/lib/shaders/ShaderRegisterData"}],"awayjs-renderergl/lib/shaders/compilers/LightingCompiler":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CompilerBase_1 = require("../../shaders/compilers/CompilerBase");
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
    function LightingCompiler(elementsClass, lightingPass, shaderLightingObject) {
        _super.call(this, elementsClass, lightingPass, shaderLightingObject);
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
        //compile the shading code for directional lights.
        for (var i = 0; i < this._shaderLightingObject.numDirectionalLights; ++i) {
            if (this._shaderLightingObject.usesTangentSpace) {
                lightDirReg = this._dirLightVertexConstants[vertexRegIndex++];
                var lightVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "m33 " + lightVarying + ".xyz, " + lightDirReg + ", " + this._pSharedRegisters.animatedTangent + "\n" +
                    "mov " + lightVarying + ".w, " + lightDirReg + ".w\n";
                lightDirReg = this._pRegisterCache.getFreeFragmentVectorTemp();
                this._pRegisterCache.addVertexTempUsages(lightDirReg, 1);
                this._pFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" +
                    "mov " + lightDirReg + ".w, " + lightVarying + ".w\n";
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
        //compile the shading code for point lights
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
                this._pVertexCode += "sub " + temp + ", " + lightPosReg + ", " + this._pSharedRegisters.animatedPosition + "\n" +
                    "m33 " + lightVarying + ".xyz, " + temp + ", " + this._pSharedRegisters.animatedTangent + "\n" +
                    "mov " + lightVarying + ".w, " + this._pSharedRegisters.animatedPosition + ".w\n";
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
                this._pFragmentCode +=
                    "dp3 " + lightDirReg + ".w, " + lightVarying + ", " + lightVarying + "\n" +
                        "sub " + lightDirReg + ".w, " + lightDirReg + ".w, " + diffuseColorReg + ".w\n" +
                        "mul " + lightDirReg + ".w, " + lightDirReg + ".w, " + specularColorReg + ".w\n" +
                        "sat " + lightDirReg + ".w, " + lightDirReg + ".w\n" +
                        "sub " + lightDirReg + ".w, " + this._pSharedRegisters.commons + ".w, " + lightDirReg + ".w\n" +
                        "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n";
            }
            else {
                this._pFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" +
                    "mov " + lightDirReg + ".w, " + lightVarying + ".w\n";
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
}(CompilerBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LightingCompiler;

},{"../../shaders/compilers/CompilerBase":"awayjs-renderergl/lib/shaders/compilers/CompilerBase"}],"awayjs-renderergl/lib/shaders":[function(require,module,exports){
"use strict";
var CompilerBase_1 = require("./shaders/compilers/CompilerBase");
exports.CompilerBase = CompilerBase_1.default;
var LightingCompiler_1 = require("./shaders/compilers/LightingCompiler");
exports.LightingCompiler = LightingCompiler_1.default;
var LightingShader_1 = require("./shaders/LightingShader");
exports.LightingShader = LightingShader_1.default;
var RegisterPool_1 = require("./shaders/RegisterPool");
exports.RegisterPool = RegisterPool_1.default;
var ShaderBase_1 = require("./shaders/ShaderBase");
exports.ShaderBase = ShaderBase_1.default;
var ShaderRegisterCache_1 = require("./shaders/ShaderRegisterCache");
exports.ShaderRegisterCache = ShaderRegisterCache_1.default;
var ShaderRegisterData_1 = require("./shaders/ShaderRegisterData");
exports.ShaderRegisterData = ShaderRegisterData_1.default;
var ShaderRegisterElement_1 = require("./shaders/ShaderRegisterElement");
exports.ShaderRegisterElement = ShaderRegisterElement_1.default;

},{"./shaders/LightingShader":"awayjs-renderergl/lib/shaders/LightingShader","./shaders/RegisterPool":"awayjs-renderergl/lib/shaders/RegisterPool","./shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","./shaders/ShaderRegisterCache":"awayjs-renderergl/lib/shaders/ShaderRegisterCache","./shaders/ShaderRegisterData":"awayjs-renderergl/lib/shaders/ShaderRegisterData","./shaders/ShaderRegisterElement":"awayjs-renderergl/lib/shaders/ShaderRegisterElement","./shaders/compilers/CompilerBase":"awayjs-renderergl/lib/shaders/compilers/CompilerBase","./shaders/compilers/LightingCompiler":"awayjs-renderergl/lib/shaders/compilers/LightingCompiler"}],"awayjs-renderergl/lib/sort/IEntitySorter":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/sort/RenderableMergeSort":[function(require,module,exports){
"use strict";
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
                var ma = head.surfaceID;
                var mb = headB.surfaceID;
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RenderableMergeSort;

},{}],"awayjs-renderergl/lib/sort/RenderableNullSort":[function(require,module,exports){
"use strict";
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RenderableNullSort;

},{}],"awayjs-renderergl/lib/sort":[function(require,module,exports){
"use strict";
var RenderableMergeSort_1 = require("./sort/RenderableMergeSort");
exports.RenderableMergeSort = RenderableMergeSort_1.default;
var RenderableNullSort_1 = require("./sort/RenderableNullSort");
exports.RenderableNullSort = RenderableNullSort_1.default;

},{"./sort/RenderableMergeSort":"awayjs-renderergl/lib/sort/RenderableMergeSort","./sort/RenderableNullSort":"awayjs-renderergl/lib/sort/RenderableNullSort"}],"awayjs-renderergl/lib/surfaces/GL_BasicMaterialSurface":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlendMode_1 = require("awayjs-core/lib/image/BlendMode");
var BasicMaterialPass_1 = require("../surfaces/passes/BasicMaterialPass");
var GL_SurfaceBase_1 = require("../surfaces/GL_SurfaceBase");
/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var GL_BasicMaterialSurface = (function (_super) {
    __extends(GL_BasicMaterialSurface, _super);
    function GL_BasicMaterialSurface(material, elementsClass, renderPool) {
        _super.call(this, material, elementsClass, renderPool);
        this._material = material;
        this._pAddPass(this._pass = new BasicMaterialPass_1.default(this, material, elementsClass, this._stage));
    }
    GL_BasicMaterialSurface.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._material = null;
    };
    /**
     * @inheritDoc
     */
    GL_BasicMaterialSurface.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this._pRequiresBlending = (this._material.blendMode != BlendMode_1.default.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
        this._pass.preserveAlpha = this._material.preserveAlpha; //this._pRequiresBlending;
        this._pass.shader.setBlendMode((this._surface.blendMode == BlendMode_1.default.NORMAL && this._pRequiresBlending) ? BlendMode_1.default.LAYER : this._material.blendMode);
        //this._pass.forceSeparateMVP = false;
    };
    return GL_BasicMaterialSurface;
}(GL_SurfaceBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_BasicMaterialSurface;

},{"../surfaces/GL_SurfaceBase":"awayjs-renderergl/lib/surfaces/GL_SurfaceBase","../surfaces/passes/BasicMaterialPass":"awayjs-renderergl/lib/surfaces/passes/BasicMaterialPass","awayjs-core/lib/image/BlendMode":undefined}],"awayjs-renderergl/lib/surfaces/GL_DepthSurface":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GL_SurfacePassBase_1 = require("../surfaces/GL_SurfacePassBase");
var ShaderBase_1 = require("../shaders/ShaderBase");
/**
 * GL_DepthSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var GL_DepthSurface = (function (_super) {
    __extends(GL_DepthSurface, _super);
    /**
     *
     * @param pool
     * @param surface
     * @param elementsClass
     * @param stage
     */
    function GL_DepthSurface(surface, elementsClass, renderPool) {
        _super.call(this, surface, elementsClass, renderPool);
        this._shader = new ShaderBase_1.default(elementsClass, this, this._stage);
        this._pAddPass(this);
    }
    GL_DepthSurface.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._surface.getTextureAt(0) ? this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
    };
    GL_DepthSurface.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.projectionDependencies++;
        if (shader.alphaThreshold > 0)
            shader.uvDependencies++;
    };
    GL_DepthSurface.prototype._iInitConstantData = function (shader) {
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
    GL_DepthSurface.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        var targetReg = sharedRegisters.shadedTarget;
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        code += "div " + temp1 + ", " + sharedRegisters.projectionFragment + ", " + sharedRegisters.projectionFragment + ".w\n" +
            "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
            "frc " + temp1 + ", " + temp1 + "\n" +
            "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        //codeF += "mov ft1.w, fc1.w	\n" +
        //    "mov ft0.w, fc0.x	\n";
        if (this._textureVO && shader.alphaThreshold > 0) {
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
                "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        registerCache.removeFragmentTempUsage(temp1);
        registerCache.removeFragmentTempUsage(temp2);
        return code;
    };
    /**
     * @inheritDoc
     */
    GL_DepthSurface.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        if (this._textureVO && this._shader.alphaThreshold > 0) {
            this._textureVO.activate(this);
            this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = this._shader.alphaThreshold;
        }
    };
    return GL_DepthSurface;
}(GL_SurfacePassBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_DepthSurface;

},{"../shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","../surfaces/GL_SurfacePassBase":"awayjs-renderergl/lib/surfaces/GL_SurfacePassBase"}],"awayjs-renderergl/lib/surfaces/GL_DistanceSurface":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GL_SurfacePassBase_1 = require("../surfaces/GL_SurfacePassBase");
var ShaderBase_1 = require("../shaders/ShaderBase");
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
    function DistanceRender(surface, elementsClass, renderPool) {
        _super.call(this, surface, elementsClass, renderPool);
        this._shader = new ShaderBase_1.default(elementsClass, this, this._stage);
        this._pAddPass(this);
    }
    DistanceRender.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._surface.getTextureAt(0) ? this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
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
        code = "dp3 " + temp1 + ".z, " + sharedRegisters.viewDirVarying + ".xyz, " + sharedRegisters.viewDirVarying + ".xyz\n" +
            "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
            "frc " + temp1 + ", " + temp1 + "\n" +
            "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        if (this._textureVO && shader.alphaThreshold > 0) {
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
                "kil " + albedo + ".w\n";
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
}(GL_SurfacePassBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DistanceRender;

},{"../shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","../surfaces/GL_SurfacePassBase":"awayjs-renderergl/lib/surfaces/GL_SurfacePassBase"}],"awayjs-renderergl/lib/surfaces/GL_SkyboxSurface":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var BlendMode_1 = require("awayjs-core/lib/image/BlendMode");
var ContextGLCompareMode_1 = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var GL_SurfacePassBase_1 = require("../surfaces/GL_SurfacePassBase");
var ShaderBase_1 = require("../shaders/ShaderBase");
/**
 * GL_SkyboxSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var GL_SkyboxSurface = (function (_super) {
    __extends(GL_SkyboxSurface, _super);
    function GL_SkyboxSurface(skybox, elementsClass, renderPool) {
        _super.call(this, skybox, elementsClass, renderPool);
        this._skybox = skybox;
        this._shader = new ShaderBase_1.default(elementsClass, this, this._stage);
        this._texture = this._shader.getAbstraction(this._skybox.texture);
        this._pAddPass(this);
    }
    GL_SkyboxSurface.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._texture.onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, this._skybox.texture));
        this._texture = null;
        this._skybox = null;
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxSurface.prototype._pUpdateRender = function () {
        _super.prototype._pUpdateRender.call(this);
        this._pRequiresBlending = (this._surface.blendMode != BlendMode_1.default.NORMAL);
        this.shader.setBlendMode((this._surface.blendMode == BlendMode_1.default.NORMAL && this._pRequiresBlending) ? BlendMode_1.default.LAYER : this._surface.blendMode);
    };
    GL_SkyboxSurface.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        shader.usesPositionFragment = true;
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxSurface.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return this._texture._iGetFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters, sharedRegisters.positionVarying);
    };
    GL_SkyboxSurface.prototype._setRenderState = function (renderable, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, camera, viewProjection);
        this._texture._setRenderState(renderable);
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxSurface.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        this._stage.context.setDepthTest(false, ContextGLCompareMode_1.default.LESS);
        this._texture.activate(this);
    };
    return GL_SkyboxSurface;
}(GL_SurfacePassBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_SkyboxSurface;

},{"../shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","../surfaces/GL_SurfacePassBase":"awayjs-renderergl/lib/surfaces/GL_SurfacePassBase","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/image/BlendMode":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-renderergl/lib/surfaces/GL_SurfaceBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractionBase_1 = require("awayjs-core/lib/library/AbstractionBase");
var SurfaceEvent_1 = require("awayjs-display/lib/events/SurfaceEvent");
var MaterialBase_1 = require("awayjs-display/lib/materials/MaterialBase");
var DefaultMaterialManager_1 = require("awayjs-display/lib/managers/DefaultMaterialManager");
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
        this._surface.addEventListener(SurfaceEvent_1.default.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
        this._surface.addEventListener(SurfaceEvent_1.default.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);
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
        if (this._surface instanceof MaterialBase_1.default) {
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
            this._passes[i].removeEventListener(PassEvent_1.default.INVALIDATE, this._onPassInvalidateDelegate);
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
                image = texture.getImageAt(j) || (this._surface.style ? this._surface.style.getImageAt(texture, j) : null) || DefaultMaterialManager_1.default.getDefaultImage2D();
                this.images[index] = this._stage.getAbstraction(image);
                sampler = texture.getSamplerAt(j) || (this._surface.style ? this._surface.style.getSamplerAt(texture, j) : null) || DefaultMaterialManager_1.default.getDefaultSampler();
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
        pass.removeEventListener(PassEvent_1.default.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.splice(this._passes.indexOf(pass), 1);
    };
    /**
     * Removes all passes from the surface
     */
    GL_SurfaceBase.prototype._pClearPasses = function () {
        var len = this._passes.length;
        for (var i = 0; i < len; ++i)
            this._passes[i].removeEventListener(PassEvent_1.default.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.length = 0;
    };
    /**
     * Adds a pass to the surface
     * @param pass
     */
    GL_SurfaceBase.prototype._pAddPass = function (pass) {
        this._passes.push(pass);
        pass.addEventListener(PassEvent_1.default.INVALIDATE, this._onPassInvalidateDelegate);
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
}(AbstractionBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_SurfaceBase;

},{"../events/PassEvent":"awayjs-renderergl/lib/events/PassEvent","awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-display/lib/events/SurfaceEvent":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined,"awayjs-display/lib/materials/MaterialBase":undefined}],"awayjs-renderergl/lib/surfaces/GL_SurfacePassBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PassEvent_1 = require("../events/PassEvent");
var GL_SurfaceBase_1 = require("../surfaces/GL_SurfaceBase");
/**
 * GL_SurfacePassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var GL_SurfacePassBase = (function (_super) {
    __extends(GL_SurfacePassBase, _super);
    function GL_SurfacePassBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(GL_SurfacePassBase.prototype, "shader", {
        get: function () {
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SurfacePassBase.prototype, "animationSet", {
        get: function () {
            return this._surface.animationSet;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Marks the shader program as invalid, so it will be recompiled before the next render.
     */
    GL_SurfacePassBase.prototype.invalidate = function () {
        this._shader.invalidateProgram();
        this.dispatchEvent(new PassEvent_1.default(PassEvent_1.default.INVALIDATE, this));
    };
    GL_SurfacePassBase.prototype.dispose = function () {
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
    GL_SurfacePassBase.prototype._setRenderState = function (renderable, camera, viewProjection) {
        this._shader._setRenderState(renderable, camera, viewProjection);
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    GL_SurfacePassBase.prototype._iActivate = function (camera) {
        this._shader._iActivate(camera);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    GL_SurfacePassBase.prototype._iDeactivate = function () {
        this._shader._iDeactivate();
    };
    GL_SurfacePassBase.prototype._iInitConstantData = function (shader) {
    };
    GL_SurfacePassBase.prototype._iGetPreLightingVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetPreLightingFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetNormalVertexCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SurfacePassBase.prototype._iGetNormalFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    return GL_SurfacePassBase;
}(GL_SurfaceBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_SurfacePassBase;

},{"../events/PassEvent":"awayjs-renderergl/lib/events/PassEvent","../surfaces/GL_SurfaceBase":"awayjs-renderergl/lib/surfaces/GL_SurfaceBase"}],"awayjs-renderergl/lib/surfaces/ISurfaceClassGL":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/surfaces/SurfacePool":[function(require,module,exports){
"use strict";
/**
 * @class away.pool.SurfacePool
 */
var SurfacePool = (function () {
    /**
     * //TODO
     *
     * @param surfaceClassGL
     */
    function SurfacePool(elementsClass, stage, surfaceClassGL) {
        if (surfaceClassGL === void 0) { surfaceClassGL = null; }
        this._abstractionPool = new Object();
        this._elementsClass = elementsClass;
        this._stage = stage;
        this._surfaceClassGL = surfaceClassGL;
    }
    Object.defineProperty(SurfacePool.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * //TODO
     *
     * @param elementsOwner
     * @returns IElements
     */
    SurfacePool.prototype.getAbstraction = function (surface) {
        return (this._abstractionPool[surface.id] || (this._abstractionPool[surface.id] = new (this._surfaceClassGL || SurfacePool._abstractionClassPool[surface.assetType])(surface, this._elementsClass, this)));
    };
    /**
     * //TODO
     *
     * @param elementsOwner
     */
    SurfacePool.prototype.clearAbstraction = function (surface) {
        delete this._abstractionPool[surface.id];
    };
    /**
     *
     * @param imageObjectClass
     */
    SurfacePool.registerAbstraction = function (surfaceClassGL, assetClass) {
        SurfacePool._abstractionClassPool[assetClass.assetType] = surfaceClassGL;
    };
    SurfacePool._abstractionClassPool = new Object();
    return SurfacePool;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurfacePool;

},{}],"awayjs-renderergl/lib/surfaces/passes/BasicMaterialPass":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var ShaderBase_1 = require("../../shaders/ShaderBase");
var PassBase_1 = require("../../surfaces/passes/PassBase");
/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var BasicMaterialPass = (function (_super) {
    __extends(BasicMaterialPass, _super);
    function BasicMaterialPass(render, surface, elementsClass, stage) {
        _super.call(this, render, surface, elementsClass, stage);
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._diffuseA = 1;
        this._shader = new ShaderBase_1.default(elementsClass, this, this._stage);
        this.invalidate();
    }
    BasicMaterialPass.prototype._iIncludeDependencies = function (shader) {
        _super.prototype._iIncludeDependencies.call(this, shader);
        if (this._textureVO != null)
            shader.uvDependencies++;
    };
    BasicMaterialPass.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._textureVO = this._surface.getTextureAt(0) ? this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
    };
    BasicMaterialPass.prototype.dispose = function () {
        if (this._textureVO) {
            this._textureVO.onClear(new AssetEvent_1.default(AssetEvent_1.default.CLEAR, this._surface.getTextureAt(0)));
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
    BasicMaterialPass.prototype._setRenderState = function (renderable, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, camera, viewProjection);
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
}(PassBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BasicMaterialPass;

},{"../../shaders/ShaderBase":"awayjs-renderergl/lib/shaders/ShaderBase","../../surfaces/passes/PassBase":"awayjs-renderergl/lib/surfaces/passes/PassBase","awayjs-core/lib/events/AssetEvent":undefined}],"awayjs-renderergl/lib/surfaces/passes/ILightingPass":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/surfaces/passes/IPass":[function(require,module,exports){
"use strict";

},{}],"awayjs-renderergl/lib/surfaces/passes/PassBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("awayjs-core/lib/events/EventDispatcher");
var PassEvent_1 = require("../../events/PassEvent");
/**
 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
var PassBase = (function (_super) {
    __extends(PassBase, _super);
    /**
     * Creates a new PassBase object.
     */
    function PassBase(render, surface, elementsClass, stage) {
        _super.call(this);
        this._preserveAlpha = true;
        this._forceSeparateMVP = false;
        this._render = render;
        this._surface = surface;
        this._elementsClass = elementsClass;
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
            return this._surface.animationSet;
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
        this._shader.invalidateProgram();
        this.dispatchEvent(new PassEvent_1.default(PassEvent_1.default.INVALIDATE, this));
    };
    /**
     * Cleans up any resources used by the current object.
     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
     */
    PassBase.prototype.dispose = function () {
        this._render = null;
        this._surface = null;
        this._elementsClass = null;
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
    PassBase.prototype._setRenderState = function (renderable, camera, viewProjection) {
        this._shader._setRenderState(renderable, camera, viewProjection);
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
}(EventDispatcher_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PassBase;

},{"../../events/PassEvent":"awayjs-renderergl/lib/events/PassEvent","awayjs-core/lib/events/EventDispatcher":undefined}],"awayjs-renderergl/lib/surfaces":[function(require,module,exports){
"use strict";
var BasicMaterialPass_1 = require("./surfaces/passes/BasicMaterialPass");
exports.BasicMaterialPass = BasicMaterialPass_1.default;
var PassBase_1 = require("./surfaces/passes/PassBase");
exports.PassBase = PassBase_1.default;
var GL_BasicMaterialSurface_1 = require("./surfaces/GL_BasicMaterialSurface");
exports.GL_BasicMaterialSurface = GL_BasicMaterialSurface_1.default;
var GL_DepthSurface_1 = require("./surfaces/GL_DepthSurface");
exports.GL_DepthSurface = GL_DepthSurface_1.default;
var GL_DistanceSurface_1 = require("./surfaces/GL_DistanceSurface");
exports.GL_DistanceSurface = GL_DistanceSurface_1.default;
var GL_SkyboxSurface_1 = require("./surfaces/GL_SkyboxSurface");
exports.GL_SkyboxSurface = GL_SkyboxSurface_1.default;
var GL_SurfaceBase_1 = require("./surfaces/GL_SurfaceBase");
exports.GL_SurfaceBase = GL_SurfaceBase_1.default;
var GL_SurfacePassBase_1 = require("./surfaces/GL_SurfacePassBase");
exports.GL_SurfacePassBase = GL_SurfacePassBase_1.default;
var SurfacePool_1 = require("./surfaces/SurfacePool");
exports.SurfacePool = SurfacePool_1.default;

},{"./surfaces/GL_BasicMaterialSurface":"awayjs-renderergl/lib/surfaces/GL_BasicMaterialSurface","./surfaces/GL_DepthSurface":"awayjs-renderergl/lib/surfaces/GL_DepthSurface","./surfaces/GL_DistanceSurface":"awayjs-renderergl/lib/surfaces/GL_DistanceSurface","./surfaces/GL_SkyboxSurface":"awayjs-renderergl/lib/surfaces/GL_SkyboxSurface","./surfaces/GL_SurfaceBase":"awayjs-renderergl/lib/surfaces/GL_SurfaceBase","./surfaces/GL_SurfacePassBase":"awayjs-renderergl/lib/surfaces/GL_SurfacePassBase","./surfaces/SurfacePool":"awayjs-renderergl/lib/surfaces/SurfacePool","./surfaces/passes/BasicMaterialPass":"awayjs-renderergl/lib/surfaces/passes/BasicMaterialPass","./surfaces/passes/PassBase":"awayjs-renderergl/lib/surfaces/passes/PassBase"}],"awayjs-renderergl/lib/textures/GL_Single2DTexture":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MappingMode_1 = require("awayjs-display/lib/textures/MappingMode");
var GL_TextureBase_1 = require("../textures/GL_TextureBase");
/**
 *
 * @class away.pool.GL_Single2DTexture
 */
var GL_Single2DTexture = (function (_super) {
    __extends(GL_Single2DTexture, _super);
    function GL_Single2DTexture(single2DTexture, shader) {
        _super.call(this, single2DTexture, shader);
        this._single2DTexture = single2DTexture;
    }
    GL_Single2DTexture.prototype.onClear = function (event) {
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
    GL_Single2DTexture.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        var code = "";
        var wrap = "wrap";
        var format = ""; //this.getFormatString(this._single2DTexture.image2D);
        var filter = "linear,miplinear";
        var temp;
        //modify depending on mapping mode
        if (this._single2DTexture.mappingMode == MappingMode_1.default.RADIAL_GRADIENT) {
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
    GL_Single2DTexture.prototype.activate = function (render) {
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
                data[index] = sampler._sampler.imageRect.width;
                data[index + 1] = sampler._sampler.imageRect.height;
                data[index + 2] = sampler._sampler.imageRect.x;
                data[index + 3] = sampler._sampler.imageRect.y;
            }
        }
    };
    GL_Single2DTexture.prototype._setRenderState = function (renderable) {
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
                data[index] = sampler._sampler.imageRect.width;
                data[index + 1] = sampler._sampler.imageRect.height;
                data[index + 2] = sampler._sampler.imageRect.x;
                data[index + 3] = sampler._sampler.imageRect.y;
            }
        }
    };
    return GL_Single2DTexture;
}(GL_TextureBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_Single2DTexture;

},{"../textures/GL_TextureBase":"awayjs-renderergl/lib/textures/GL_TextureBase","awayjs-display/lib/textures/MappingMode":undefined}],"awayjs-renderergl/lib/textures/GL_SingleCubeTexture":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GL_TextureBase_1 = require("../textures/GL_TextureBase");
/**
 *
 * @class away.pool.TextureDataBase
 */
var GL_SingleCubeTexture = (function (_super) {
    __extends(GL_SingleCubeTexture, _super);
    function GL_SingleCubeTexture(singleCubeTexture, shader) {
        _super.call(this, singleCubeTexture, shader);
        this._singleCubeTexture = singleCubeTexture;
    }
    GL_SingleCubeTexture.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._singleCubeTexture = null;
    };
    GL_SingleCubeTexture.prototype._iIncludeDependencies = function (includeInput) {
        if (includeInput === void 0) { includeInput = true; }
        if (includeInput)
            this._shader.usesPositionFragment = true;
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
    GL_SingleCubeTexture.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        var format = ""; //this.getFormatString(this._singleCubeTexture.imageCube);
        var filter = "linear,miplinear";
        this._imageIndex = this._shader.getImageIndex(this._singleCubeTexture, 0);
        var textureReg = this.getTextureReg(this._imageIndex, regCache, sharedReg);
        this._textureIndex = textureReg.index;
        return "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <cube," + format + filter + ">\n";
    };
    GL_SingleCubeTexture.prototype.activate = function (render) {
        var sampler = render.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        if (render.images[this._imageIndex])
            render.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
    };
    GL_SingleCubeTexture.prototype._setRenderState = function (renderable) {
        var sampler = renderable.samplers[this._imageIndex];
        if (sampler)
            sampler.activate(this._textureIndex);
        if (renderable.images[this._imageIndex] && sampler)
            renderable.images[this._imageIndex].activate(this._textureIndex, sampler._sampler.mipmap);
    };
    return GL_SingleCubeTexture;
}(GL_TextureBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_SingleCubeTexture;

},{"../textures/GL_TextureBase":"awayjs-renderergl/lib/textures/GL_TextureBase"}],"awayjs-renderergl/lib/textures/GL_TextureBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AbstractionBase_1 = require("awayjs-core/lib/library/AbstractionBase");
var ContextGLTextureFormat_1 = require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
/**
 *
 * @class away.pool.GL_TextureBaseBase
 */
var GL_TextureBase = (function (_super) {
    __extends(GL_TextureBase, _super);
    function GL_TextureBase(texture, shader) {
        _super.call(this, texture, shader);
        this._texture = texture;
        this._shader = shader;
        this._stage = shader._stage;
    }
    /**
     *
     */
    GL_TextureBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._texture = null;
        this._shader = null;
        this._stage = null;
    };
    GL_TextureBase.prototype._iGetFragmentCode = function (targetReg, regCache, sharedReg, inputReg) {
        if (inputReg === void 0) { inputReg = null; }
        throw new AbstractMethodError_1.default();
    };
    GL_TextureBase.prototype._setRenderState = function (renderable) {
        //overidden for state logic
    };
    GL_TextureBase.prototype.activate = function (render) {
        //overridden for activation logic
    };
    GL_TextureBase.prototype.getTextureReg = function (imageIndex, regCache, sharedReg) {
        var index = this._shader.imageIndices.indexOf(imageIndex); //todo: collapse the index based on duplicate image objects to save registrations
        if (index == -1) {
            var textureReg = regCache.getFreeTextureReg();
            sharedReg.textures.push(textureReg);
            this._shader.imageIndices.push(imageIndex);
            return textureReg;
        }
        return sharedReg.textures[index];
    };
    GL_TextureBase.prototype.getFormatString = function (image) {
        switch (image.format) {
            case ContextGLTextureFormat_1.default.COMPRESSED:
                return "dxt1,";
            case ContextGLTextureFormat_1.default.COMPRESSED_ALPHA:
                return "dxt5,";
            default:
                return "";
        }
    };
    return GL_TextureBase;
}(AbstractionBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GL_TextureBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AbstractionBase":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFormat":undefined}],"awayjs-renderergl/lib/textures":[function(require,module,exports){
"use strict";
var GL_Single2DTexture_1 = require("./textures/GL_Single2DTexture");
exports.GL_Single2DTexture = GL_Single2DTexture_1.default;
var GL_SingleCubeTexture_1 = require("./textures/GL_SingleCubeTexture");
exports.GL_SingleCubeTexture = GL_SingleCubeTexture_1.default;
var GL_TextureBase_1 = require("./textures/GL_TextureBase");
exports.GL_TextureBase = GL_TextureBase_1.default;

},{"./textures/GL_Single2DTexture":"awayjs-renderergl/lib/textures/GL_Single2DTexture","./textures/GL_SingleCubeTexture":"awayjs-renderergl/lib/textures/GL_SingleCubeTexture","./textures/GL_TextureBase":"awayjs-renderergl/lib/textures/GL_TextureBase"}],"awayjs-renderergl/lib/tools/commands/Merge":[function(require,module,exports){
"use strict";
var AttributesBuffer_1 = require("awayjs-core/lib/attributes/AttributesBuffer");
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var TriangleElements_1 = require("awayjs-display/lib/graphics/TriangleElements");
var Sprite_1 = require("awayjs-display/lib/display/Sprite");
/**
 *  Class Merge merges two or more static sprites into one.<code>Merge</code>
 */
var Merge = (function () {
    /**
     * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier sprite material information or keeps its source material(s). Defaults to false.
     * If false and receiver object has multiple materials, the last material found in receiver subsprites is applied to the merged subsprite(es).
     * @param    disposeSources  [optional]    Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
     * If true, only receiver geometry and resulting sprite are kept in  memory.
     * @param    objectSpace     [optional]    Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
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
         * Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
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
         * Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
         */
        set: function (b) {
            this._objectSpace = b;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Merges all the children of a container into a single Sprite. If no Sprite object is found, method returns the receiver without modification.
     *
     * @param    receiver           The Sprite to receive the merged contents of the container.
     * @param    objectContainer    The DisplayObjectContainer holding the sprites to be mergd.
     *
     * @return The merged Sprite instance.
     */
    Merge.prototype.applyToContainer = function (receiver, objectContainer) {
        this.reset();
        //collect container sprites
        this.parseContainer(receiver, objectContainer);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    /**
     * Merges all the sprites found in the Array&lt;Sprite&gt; into a single Sprite.
     *
     * @param    receiver    The Sprite to receive the merged contents of the sprites.
     * @param    sprites      A series of Spritees to be merged with the reciever sprite.
     */
    Merge.prototype.applyToSpritees = function (receiver, sprites) {
        this.reset();
        if (!sprites.length)
            return;
        //collect sprites in vector
        for (var i = 0; i < sprites.length; i++)
            if (sprites[i] != receiver)
                this.collect(sprites[i], this._disposeSources);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    /**
     *  Merges 2 sprites into one. It is recommand to use apply when 2 sprites are to be merged. If more need to be merged, use either applyToSpritees or applyToContainer methods.
     *
     * @param    receiver    The Sprite to receive the merged contents of both sprites.
     * @param    sprite        The Sprite to be merged with the receiver sprite
     */
    Merge.prototype.apply = function (receiver, sprite) {
        this.reset();
        //collect sprite
        this.collect(sprite, this._disposeSources);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    Merge.prototype.reset = function () {
        this._toDispose = new Array();
        this._graphicVOs = new Array();
    };
    Merge.prototype.merge = function (destSprite, dispose) {
        var i;
        //var oldGraphics:Graphics;
        var destGraphics;
        var useSubMaterials;
        //oldGraphics = destSprite.graphics.clone();
        destGraphics = destSprite.graphics;
        // Only apply materials directly to sub-sprites if necessary,
        // i.e. if there is more than one material available.
        useSubMaterials = (this._graphicVOs.length > 1);
        for (i = 0; i < this._graphicVOs.length; i++) {
            var elements = new TriangleElements_1.default(new AttributesBuffer_1.default());
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            var data = this._graphicVOs[i];
            elements.setIndices(data.indices);
            elements.setPositions(data.vertices);
            elements.setNormals(data.normals);
            elements.setTangents(data.tangents);
            elements.setUVs(data.uvs);
            destGraphics.addGraphic(elements);
            if (this._keepMaterial && useSubMaterials)
                destSprite.graphics[i].material = data.material;
        }
        if (this._keepMaterial && !useSubMaterials && this._graphicVOs.length)
            destSprite.material = this._graphicVOs[0].material;
        if (dispose) {
            var len = this._toDispose.length;
            for (var i; i < len; i++)
                this._toDispose[i].dispose();
            ;
        }
        this._toDispose = null;
    };
    Merge.prototype.collect = function (sprite, dispose) {
        var subIdx;
        var calc;
        for (subIdx = 0; subIdx < sprite.graphics.count; subIdx++) {
            var i;
            var len;
            var iIdx /*uint*/, vIdx /*uint*/, nIdx /*uint*/, tIdx /*uint*/, uIdx;
            var indexOffset;
            var elements;
            var vo;
            var vertices;
            var normals;
            var tangents;
            var ind, pd, nd, td, ud;
            elements = sprite.graphics.getGraphicAt(subIdx).elements;
            pd = elements.positions.get(elements.numVertices);
            nd = elements.normals.get(elements.numVertices);
            td = elements.tangents.get(elements.numVertices);
            ud = elements.uvs.get(elements.numVertices);
            // Get (or create) a VO for this material
            vo = this.getGraphicData(sprite.graphics.getGraphicAt(subIdx).material);
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
            len = elements.numVertices;
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
            len = elements.numElements;
            ind = elements.indices.get(len);
            for (i = 0; i < len; i++) {
                calc = i * 3;
                vo.indices[iIdx++] = ind[calc] + indexOffset;
                vo.indices[iIdx++] = ind[calc + 1] + indexOffset;
                vo.indices[iIdx++] = ind[calc + 2] + indexOffset;
            }
            if (!this._objectSpace) {
                sprite.sceneTransform.transformVectors(vertices, vertices);
                Matrix3DUtils_1.default.deltaTransformVectors(sprite.sceneTransform, normals, normals);
                Matrix3DUtils_1.default.deltaTransformVectors(sprite.sceneTransform, tangents, tangents);
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
            this._toDispose.push(sprite);
    };
    Merge.prototype.getGraphicData = function (material) {
        var data;
        if (this._keepMaterial) {
            var i;
            var len;
            len = this._graphicVOs.length;
            for (i = 0; i < len; i++) {
                if (this._graphicVOs[i].material == material) {
                    data = this._graphicVOs[i];
                    break;
                }
            }
        }
        else if (this._graphicVOs.length) {
            // If materials are not to be kept, all data can be
            // put into a single VO, so return that one.
            data = this._graphicVOs[0];
        }
        // No data (for this material) found, create new.
        if (!data) {
            data = new GraphicVO();
            data.vertices = new Array();
            data.normals = new Array();
            data.tangents = new Array();
            data.uvs = new Array();
            data.indices = new Array();
            data.material = material;
            this._graphicVOs.push(data);
        }
        return data;
    };
    Merge.prototype.parseContainer = function (receiver, object) {
        var child;
        var i;
        if (object instanceof Sprite_1.default && object != receiver)
            this.collect(object, this._disposeSources);
        for (i = 0; i < object.numChildren; ++i) {
            child = object.getChildAt(i);
            this.parseContainer(receiver, child);
        }
    };
    return Merge;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Merge;
var GraphicVO = (function () {
    function GraphicVO() {
    }
    return GraphicVO;
}());

},{"awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-display/lib/display/Sprite":undefined,"awayjs-display/lib/graphics/TriangleElements":undefined}],"awayjs-renderergl/lib/tools/data/ParticleGraphicsTransform":[function(require,module,exports){
"use strict";
/**
 * ...
 */
var ParticleGraphicsTransform = (function () {
    function ParticleGraphicsTransform() {
    }
    Object.defineProperty(ParticleGraphicsTransform.prototype, "vertexTransform", {
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
    Object.defineProperty(ParticleGraphicsTransform.prototype, "UVTransform", {
        get: function () {
            return this._defaultUVTransform;
        },
        set: function (value) {
            this._defaultUVTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleGraphicsTransform.prototype, "invVertexTransform", {
        get: function () {
            return this._defaultInvVertexTransform;
        },
        enumerable: true,
        configurable: true
    });
    return ParticleGraphicsTransform;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleGraphicsTransform;

},{}],"awayjs-renderergl/lib/tools":[function(require,module,exports){
"use strict";
var Merge_1 = require("./tools/commands/Merge");
exports.Merge = Merge_1.default;
var ParticleGraphicsTransform_1 = require("./tools/data/ParticleGraphicsTransform");
exports.ParticleGraphicsTransform = ParticleGraphicsTransform_1.default;

},{"./tools/commands/Merge":"awayjs-renderergl/lib/tools/commands/Merge","./tools/data/ParticleGraphicsTransform":"awayjs-renderergl/lib/tools/data/ParticleGraphicsTransform"}],"awayjs-renderergl/lib/utils/ParticleGraphicsHelper":[function(require,module,exports){
"use strict";
var AttributesBuffer_1 = require("awayjs-core/lib/attributes/AttributesBuffer");
var Point_1 = require("awayjs-core/lib/geom/Point");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ParticleData_1 = require("awayjs-display/lib/animators/data/ParticleData");
var TriangleElements_1 = require("awayjs-display/lib/graphics/TriangleElements");
/**
 * ...
 */
var ParticleGraphicsHelper = (function () {
    function ParticleGraphicsHelper() {
    }
    ParticleGraphicsHelper.generateGraphics = function (output, graphicsArray, transforms) {
        if (transforms === void 0) { transforms = null; }
        var indicesVector = new Array();
        var positionsVector = new Array();
        var normalsVector = new Array();
        var tangentsVector = new Array();
        var uvsVector = new Array();
        var vertexCounters = new Array();
        var particles = new Array();
        var elementsArray = new Array();
        var numParticles = graphicsArray.length;
        var sourceGraphics;
        var sourceElements;
        var numGraphics;
        var indices;
        var positions;
        var normals;
        var tangents;
        var uvs;
        var vertexCounter;
        var elements;
        var i;
        var j;
        var sub2SubMap = new Array();
        var tempVertex = new Vector3D_1.default;
        var tempNormal = new Vector3D_1.default;
        var tempTangents = new Vector3D_1.default;
        var tempUV = new Point_1.default;
        for (i = 0; i < numParticles; i++) {
            sourceGraphics = graphicsArray[i];
            numGraphics = sourceGraphics.count;
            for (var srcIndex = 0; srcIndex < numGraphics; srcIndex++) {
                //create a different particle subgeometry group for each source subgeometry in a particle.
                if (sub2SubMap.length <= srcIndex) {
                    sub2SubMap.push(elementsArray.length);
                    indicesVector.push(new Array() /*uint*/);
                    positionsVector.push(new Array());
                    normalsVector.push(new Array());
                    tangentsVector.push(new Array());
                    uvsVector.push(new Array());
                    elementsArray.push(new TriangleElements_1.default(new AttributesBuffer_1.default()));
                    vertexCounters.push(0);
                }
                sourceElements = sourceGraphics.getGraphicAt(srcIndex).elements;
                //add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
                if (sourceElements.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGraphicsHelper.MAX_VERTEX) {
                    //update submap and add new subgeom vectors
                    sub2SubMap[srcIndex] = elementsArray.length;
                    indicesVector.push(new Array() /*uint*/);
                    positionsVector.push(new Array());
                    normalsVector.push(new Array());
                    tangentsVector.push(new Array());
                    uvsVector.push(new Array());
                    elementsArray.push(new TriangleElements_1.default(new AttributesBuffer_1.default()));
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
                elements = elementsArray[j];
                var particleData = new ParticleData_1.default();
                particleData.numVertices = sourceElements.numVertices;
                particleData.startVertexIndex = vertexCounter;
                particleData.particleIndex = i;
                particleData.elements = elements;
                particles.push(particleData);
                vertexCounters[j] += sourceElements.numVertices;
                var k;
                var tempLen;
                var compact = sourceElements;
                var product;
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
                        var particleGraphicsTransform = transforms[i];
                        var vertexTransform = particleGraphicsTransform.vertexTransform;
                        var invVertexTransform = particleGraphicsTransform.invVertexTransform;
                        var UVTransform = particleGraphicsTransform.UVTransform;
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
                tempLen = sourceElements.numElements;
                var sourceIndices = sourceElements.indices.get(tempLen);
                for (k = 0; k < tempLen; k++) {
                    product = k * 3;
                    indices.push(sourceIndices[product] + vertexCounter, sourceIndices[product + 1] + vertexCounter, sourceIndices[product + 2] + vertexCounter);
                }
            }
        }
        output.particles = particles;
        output.numParticles = numParticles;
        numParticles = elementsArray.length;
        for (i = 0; i < numParticles; i++) {
            elements = elementsArray[i];
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            elements.setIndices(indicesVector[i]);
            elements.setPositions(positionsVector[i]);
            elements.setNormals(normalsVector[i]);
            elements.setTangents(tangentsVector[i]);
            elements.setUVs(uvsVector[i]);
            output.addGraphic(elements);
        }
    };
    ParticleGraphicsHelper.MAX_VERTEX = 65535;
    return ParticleGraphicsHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleGraphicsHelper;

},{"awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/animators/data/ParticleData":undefined,"awayjs-display/lib/graphics/TriangleElements":undefined}],"awayjs-renderergl/lib/utils/PerspectiveMatrix3D":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
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
}(Matrix3D_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PerspectiveMatrix3D;

},{"awayjs-core/lib/geom/Matrix3D":undefined}],"awayjs-renderergl/lib/utils":[function(require,module,exports){
"use strict";
var ParticleGraphicsHelper_1 = require("./utils/ParticleGraphicsHelper");
exports.ParticleGraphicsHelper = ParticleGraphicsHelper_1.default;
var PerspectiveMatrix3D_1 = require("./utils/PerspectiveMatrix3D");
exports.PerspectiveMatrix3D = PerspectiveMatrix3D_1.default;

},{"./utils/ParticleGraphicsHelper":"awayjs-renderergl/lib/utils/ParticleGraphicsHelper","./utils/PerspectiveMatrix3D":"awayjs-renderergl/lib/utils/PerspectiveMatrix3D"}]},{},[1])
//# sourceMappingURL=awayjs-renderergl.js.map
