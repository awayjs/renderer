require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"awayjs-renderergl/lib/DefaultRenderer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var RenderTexture = require("awayjs-core/lib/textures/RenderTexture");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLClearMask = require("awayjs-stagegl/lib/base/ContextGLClearMask");
var DepthRenderer = require("awayjs-renderergl/lib/DepthRenderer");
var DistanceRenderer = require("awayjs-renderergl/lib/DistanceRenderer");
var Filter3DRenderer = require("awayjs-renderergl/lib/Filter3DRenderer");
var RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
var RenderablePool = require("awayjs-renderergl/lib/pool/RenderablePool");
var SkyboxRenderable = require("awayjs-renderergl/lib/pool/SkyboxRenderable");
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
    function DefaultRenderer(stage) {
        if (stage === void 0) { stage = null; }
        _super.call(this, stage);
        this._skyboxProjection = new Matrix3D();
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
        }
        else {
            if (this._shareContext)
                this._iRender(entityCollector, null, this._pScissorRect);
            else
                this._iRender(entityCollector);
        }
        _super.prototype.render.call(this, entityCollector);
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
    DefaultRenderer.prototype._pGetRenderObject = function (renderable, renderObjectOwner) {
        return renderObjectOwner.getRenderObject(renderable._pool);
    };
    /**
     * Draw the skybox if present.
     *
     * @param entityCollector The EntityCollector containing all potentially visible information.
     */
    DefaultRenderer.prototype.drawSkybox = function (entityCollector) {
        var skyBox = this._skyboxRenderablePool.getItem(entityCollector.skyBox);
        var camera = entityCollector.camera;
        this.updateSkyboxProjection(camera);
        var renderObject = skyBox.renderObject = this._pGetRenderObject(skyBox, skyBox.renderObjectOwner);
        var shaderObject = renderObject.shaderObjects[0];
        this.activateProgram(skyBox, shaderObject, camera);
        skyBox._iRender(shaderObject, camera, this._skyboxProjection);
        this.deactivateProgram(skyBox, shaderObject);
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
        this._skyboxRenderablePool.dispose();
        this._skyboxRenderablePool = null;
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
    DefaultRenderer.prototype.iSetStage = function (value) {
        _super.prototype.iSetStage.call(this, value);
        if (this._pStage) {
            this._pRttBufferManager = RTTBufferManager.getInstance(this._pStage);
            this._pDepthRenderer = new DepthRenderer(this._pStage);
            this._pDistanceRenderer = new DistanceRenderer(this._pStage);
            this._skyboxRenderablePool = RenderablePool.getPool(SkyboxRenderable, this._pStage);
        }
    };
    /**
     *
     */
    DefaultRenderer.prototype.initDepthTexture = function (context) {
        this._pDepthTextureInvalid = false;
        if (this._pDepthRender)
            this._pDepthRender.dispose();
        this._pDepthRender = new RenderTexture(this._pRttBufferManager.textureWidth, this._pRttBufferManager.textureHeight);
    };
    return DefaultRenderer;
})(RendererBase);
module.exports = DefaultRenderer;


},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-core/lib/textures/RenderTexture":undefined,"awayjs-renderergl/lib/DepthRenderer":undefined,"awayjs-renderergl/lib/DistanceRenderer":undefined,"awayjs-renderergl/lib/Filter3DRenderer":undefined,"awayjs-renderergl/lib/base/RendererBase":undefined,"awayjs-renderergl/lib/managers/RTTBufferManager":undefined,"awayjs-renderergl/lib/pool/RenderablePool":undefined,"awayjs-renderergl/lib/pool/SkyboxRenderable":undefined,"awayjs-stagegl/lib/base/ContextGLClearMask":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined}],"awayjs-renderergl/lib/DepthRenderer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
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
        _super.call(this, stage);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    DepthRenderer.prototype._pGetRenderObject = function (renderable, renderObjectOwner) {
        return renderable._pool.getDepthRenderObject(renderObjectOwner);
    };
    return DepthRenderer;
})(RendererBase);
module.exports = DepthRenderer;


},{"awayjs-renderergl/lib/base/RendererBase":undefined}],"awayjs-renderergl/lib/DistanceRenderer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
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
        _super.call(this, stage);
        this._iBackgroundR = 1;
        this._iBackgroundG = 1;
        this._iBackgroundB = 1;
    }
    DistanceRenderer.prototype._pGetRenderObject = function (renderable, renderObjectOwner) {
        return renderable._pool.getDistanceRenderObject(renderObjectOwner);
    };
    return DistanceRenderer;
})(RendererBase);
module.exports = DistanceRenderer;


},{"awayjs-renderergl/lib/base/RendererBase":undefined}],"awayjs-renderergl/lib/Filter3DRenderer":[function(require,module,exports){
var Event = require("awayjs-core/lib/events/Event");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
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
        this._rttManager.addEventListener(Event.RESIZE, this._onRTTResizeDelegate);
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
        if (this._filterTasksInvalid) {
            this.updateFilterTasks(stage);
        }
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
            if (!this._filters) {
                return;
            }
            for (var i = 0; i < this._filters.length; ++i) {
                // TODO: check logic:
                // this._requireDepthRender ||=  Boolean ( this._filters[i].requireDepthRender )
                var s = this._filters[i];
                var b = (s.requireDepthRender == null) ? false : s.requireDepthRender;
                this._requireDepthRender = this._requireDepthRender || b;
            }
            this._filterSizesInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DRenderer.prototype.updateFilterTasks = function (stage) {
        var len;
        if (this._filterSizesInvalid) {
            this.updateFilterSizes();
        }
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
            // TODO: check logic
            // filter.setRenderTargets(i == len? null : Filter3DBase(_filters[i + 1]).getMainInputTexture(stage), stage);
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
        if (!this._filters) {
            return;
        }
        if (this._filterSizesInvalid) {
            this.updateFilterSizes();
        }
        if (this._filterTasksInvalid) {
            this.updateFilterTasks(stage);
        }
        len = this._filters.length;
        for (i = 0; i < len; ++i) {
            this._filters[i].update(stage, camera);
        }
        len = this._tasks.length;
        if (len > 1) {
            context.setVertexBufferAt(0, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
            context.setVertexBufferAt(1, vertexBuffer, 2, ContextGLVertexBufferFormat.FLOAT_2);
        }
        for (i = 0; i < len; ++i) {
            task = this._tasks[i];
            //stage.setRenderTarget(task.target); //TODO
            if (!task.target) {
                stage.scissorRect = null;
                vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
                context.setVertexBufferAt(0, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
                context.setVertexBufferAt(1, vertexBuffer, 2, ContextGLVertexBufferFormat.FLOAT_2);
            }
            context.setTextureAt(0, task.getMainInputTexture(stage));
            context.setProgram(task.getProgram(stage));
            context.clear(0.0, 0.0, 0.0, 0.0);
            task.activate(stage, camera, depthTexture);
            context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
            context.drawTriangles(indexBuffer, 0, 2);
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
        this._rttManager.removeEventListener(Event.RESIZE, this._onRTTResizeDelegate);
        this._rttManager = null;
        this._stage = null;
    };
    return Filter3DRenderer;
})();
module.exports = Filter3DRenderer;


},{"awayjs-core/lib/events/Event":undefined,"awayjs-renderergl/lib/managers/RTTBufferManager":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/AnimationSetBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
    AnimationSetBase.prototype.getAGALVertexCode = function (shaderObject) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.activate = function (shaderObject, stage) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.deactivate = function (shaderObject, stage) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.getAGALUVCode = function (shaderObject) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimationSetBase.prototype.doneAGALCode = function (shaderObject) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(AnimationSetBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.ANIMATION_SET;
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
    return AnimationSetBase;
})(NamedAssetBase);
module.exports = AnimationSetBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetType":undefined,"awayjs-core/lib/library/NamedAssetBase":undefined,"awayjs-renderergl/lib/errors/AnimationSetError":undefined}],"awayjs-renderergl/lib/animators/AnimatorBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
    AnimatorBase.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
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
                this._pOwners[i].translateLocal(delta, dist);
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
    AnimatorBase.prototype.testGPUCompatibility = function (shaderObject) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(AnimatorBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.ANIMATOR;
        },
        enumerable: true,
        configurable: true
    });
    AnimatorBase.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        //nothing to do here
        return sourceSubGeometry;
    };
    return AnimatorBase;
})(NamedAssetBase);
module.exports = AnimatorBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetType":undefined,"awayjs-core/lib/library/NamedAssetBase":undefined,"awayjs-core/lib/utils/RequestAnimationFrame":undefined,"awayjs-core/lib/utils/getTimer":undefined,"awayjs-renderergl/lib/events/AnimatorEvent":undefined}],"awayjs-renderergl/lib/animators/ParticleAnimationSet":[function(require,module,exports){
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
    ParticleAnimationSet.prototype.activate = function (shaderObject, stage) {
        //			this._iAnimationRegisterCache = pass.animationRegisterCache;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.deactivate = function (shaderObject, stage) {
        //			var context:IContextGL = <IContextGL> stage.context;
        //			var offset:number /*int*/ = this._iAnimationRegisterCache.vertexAttributesOffset;
        //			var used:number /*int*/ = this._iAnimationRegisterCache.numUsedStreams;
        //			for (var i:number /*int*/ = offset; i < used; i++)
        //				context.setVertexBufferAt(i, null);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
        //grab animationRegisterCache from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterCache = shaderObject.animationRegisterCache;
        if (this._iAnimationRegisterCache == null)
            this._iAnimationRegisterCache = shaderObject.animationRegisterCache = new AnimationRegisterCache(shaderObject.profile);
        //reset animationRegisterCache
        this._iAnimationRegisterCache.vertexConstantOffset = shaderObject.numUsedVertexConstants;
        this._iAnimationRegisterCache.vertexAttributesOffset = shaderObject.numUsedStreams;
        this._iAnimationRegisterCache.varyingsOffset = shaderObject.numUsedVaryings;
        this._iAnimationRegisterCache.fragmentConstantOffset = shaderObject.numUsedFragmentConstants;
        this._iAnimationRegisterCache.hasUVNode = this.hasUVNode;
        this._iAnimationRegisterCache.needVelocity = this.needVelocity;
        this._iAnimationRegisterCache.hasBillboard = this.hasBillboard;
        this._iAnimationRegisterCache.sourceRegisters = shaderObject.animatableAttributes;
        this._iAnimationRegisterCache.targetRegisters = shaderObject.animationTargetRegisters;
        this._iAnimationRegisterCache.needFragmentAnimation = shaderObject.usesFragmentAnimation;
        this._iAnimationRegisterCache.needUVAnimation = !shaderObject.usesUVTransform;
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
                code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.getCombinationCode();
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.initColorRegisters();
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.getColorPassCode();
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
        var code = "";
        if (this.hasUVNode) {
            this._iAnimationRegisterCache.setUVSourceAndTarget(shaderObject.uvSource, shaderObject.uvTarget);
            code += "mov " + this._iAnimationRegisterCache.uvTarget + ".xy," + this._iAnimationRegisterCache.uvAttribute.toString() + "\n";
            var node;
            for (var i = 0; i < this._particleNodes.length; i++)
                node = this._particleNodes[i];
            code += node.getAGALUVCode(shaderObject, this._iAnimationRegisterCache);
            code += "mov " + this._iAnimationRegisterCache.uvVar.toString() + "," + this._iAnimationRegisterCache.uvTarget + ".xy\n";
        }
        else
            code += "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        return this._iAnimationRegisterCache.getColorCombinationCode(shadedTarget);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.doneAGALCode = function (shaderObject) {
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
     * Property used by particle nodes that require compilation at the end of the shader
     */
    ParticleAnimationSet.POST_PRIORITY = 9;
    /**
     * Property used by particle nodes that require color compilation
     */
    ParticleAnimationSet.COLOR_PRIORITY = 18;
    return ParticleAnimationSet;
})(AnimationSetBase);
module.exports = ParticleAnimationSet;


},{"awayjs-renderergl/lib/animators/AnimationSetBase":undefined,"awayjs-renderergl/lib/animators/data/AnimationRegisterCache":undefined,"awayjs-renderergl/lib/animators/data/AnimationSubGeometry":undefined,"awayjs-renderergl/lib/animators/data/ParticleAnimationData":undefined,"awayjs-renderergl/lib/animators/data/ParticleProperties":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode":undefined}],"awayjs-renderergl/lib/animators/ParticleAnimator":[function(require,module,exports){
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
    ParticleAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
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
    ParticleAnimator.prototype.testGPUCompatibility = function (shaderObject) {
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


},{"awayjs-renderergl/lib/animators/AnimatorBase":undefined,"awayjs-renderergl/lib/animators/data/AnimationSubGeometry":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/animators/SkeletonAnimationSet":[function(require,module,exports){
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
    SkeletonAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
        var len = shaderObject.animatableAttributes.length;
        var indexOffset0 = shaderObject.numUsedVertexConstants;
        var indexOffset1 = indexOffset0 + 1;
        var indexOffset2 = indexOffset0 + 2;
        var indexStream = "va" + shaderObject.numUsedStreams;
        var weightStream = "va" + (shaderObject.numUsedStreams + 1);
        var indices = [indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w"];
        var weights = [weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w"];
        var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
        var temp2 = this._pFindTempReg(shaderObject.animationTargetRegisters, temp1);
        var dot = "dp4";
        var code = "";
        for (var i = 0; i < len; ++i) {
            var src = shaderObject.animatableAttributes[i];
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
            code += "mov " + shaderObject.animationTargetRegisters[i] + ", " + temp2 + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.activate = function (shaderObject, stage) {
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.deactivate = function (shaderObject, stage) {
        //			var streamOffset:number /*uint*/ = pass.numUsedStreams;
        //			var context:IContextGL = <IContextGL> stage.context;
        //			context.setVertexBufferAt(streamOffset, null);
        //			context.setVertexBufferAt(streamOffset + 1, null);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
        return "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimationSet.prototype.doneAGALCode = function (shaderObject) {
    };
    return SkeletonAnimationSet;
})(AnimationSetBase);
module.exports = SkeletonAnimationSet;


},{"awayjs-renderergl/lib/animators/AnimationSetBase":undefined}],"awayjs-renderergl/lib/animators/SkeletonAnimator":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
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
        this._globalMatrices = new Array(this._numJoints * 12);
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
    SkeletonAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        // do on request of globalProperties
        if (this._globalPropertiesDirty)
            this.updateGlobalProperties();
        var subGeometry = renderable.subMesh.subGeometry;
        subGeometry.useCondensedIndices = this._useCondensedIndices;
        if (this._useCondensedIndices) {
            // using a condensed data set
            this.updateCondensedMatrices(subGeometry.condensedIndexLookUp, subGeometry.numCondensedJoints);
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._condensedMatrices, subGeometry.numCondensedJoints * 3);
        }
        else {
            if (this._pAnimationSet.usesCPU) {
                if (this._morphedSubGeometryDirty[subGeometry.id])
                    this.morphSubGeometry(renderable, subGeometry);
                return;
            }
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._globalMatrices, this._numJoints * 3);
        }
        stage.activateBuffer(vertexStreamOffset, renderable.getVertexData(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.JOINT_INDEX_FORMAT);
        stage.activateBuffer(vertexStreamOffset + 1, renderable.getVertexData(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.JOINT_WEIGHT_FORMAT);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.testGPUCompatibility = function (shaderObject) {
        if (!this._useCondensedIndices && (this._forceCPU || this._jointsPerVertex > 4 || shaderObject.numUsedVertexConstants + this._numJoints * 3 > 128))
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
    SkeletonAnimator.prototype.updateCondensedMatrices = function (condensedIndexLookUp /*uint*/, numJoints /*uint*/) {
        var i = 0, j = 0;
        var len /*uint*/;
        var srcIndex /*uint*/;
        this._condensedMatrices = new Array();
        do {
            srcIndex = condensedIndexLookUp[i] * 4;
            len = srcIndex + 12;
            while (srcIndex < len)
                this._condensedMatrices[j++] = this._globalMatrices[srcIndex++];
        } while (++i < numJoints);
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
            sourceSubGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdateDelegate);
            sourceSubGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdateDelegate);
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
        var sourcePositions = sourceSubGeometry.positions;
        var sourceNormals = sourceSubGeometry.vertexNormals;
        var sourceTangents = sourceSubGeometry.vertexTangents;
        var jointIndices = sourceSubGeometry.jointIndices;
        var jointWeights = sourceSubGeometry.jointWeights;
        var targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id];
        var targetPositions = targetSubGeometry.positions;
        var targetNormals = targetSubGeometry.vertexNormals;
        var targetTangents = targetSubGeometry.vertexTangents;
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
        targetSubGeometry.updatePositions(targetPositions);
        targetSubGeometry.updateVertexNormals(targetNormals);
        targetSubGeometry.updateVertexTangents(targetTangents);
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
        this._morphedSubGeometry[subGeometry.id].updateIndices(subGeometry.indices);
    };
    SkeletonAnimator.prototype.onVerticesUpdate = function (event) {
        var subGeometry = event.target;
        var morphGeometry = this._morphedSubGeometry[subGeometry.id];
        switch (event.dataType) {
            case TriangleSubGeometry.UV_DATA:
                morphGeometry.updateUVs(subGeometry.uvs);
            case TriangleSubGeometry.SECONDARY_UV_DATA:
                morphGeometry.updateUVs(subGeometry.secondaryUVs);
        }
    };
    return SkeletonAnimator;
})(AnimatorBase);
module.exports = SkeletonAnimator;


},{"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-renderergl/lib/animators/AnimatorBase":undefined,"awayjs-renderergl/lib/animators/data/JointPose":undefined,"awayjs-renderergl/lib/animators/data/SkeletonPose":undefined,"awayjs-renderergl/lib/events/AnimationStateEvent":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/animators/VertexAnimationSet":[function(require,module,exports){
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
    VertexAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
        if (this._blendMode == VertexAnimationMode.ABSOLUTE)
            return this.getAbsoluteAGALCode(shaderObject);
        else
            return this.getAdditiveAGALCode(shaderObject);
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.activate = function (shaderObject, stage) {
        //			var uID:number = pass._iUniqueId;
        //			this._uploadNormals = <boolean> this._useNormals[uID];
        //			this._uploadTangents = <boolean> this._useTangents[uID];
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.deactivate = function (shaderObject, stage) {
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
    VertexAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        return "";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
        return "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
    };
    /**
     * @inheritDoc
     */
    VertexAnimationSet.prototype.doneAGALCode = function (shaderObject) {
    };
    /**
     * Generates the vertex AGAL code for absolute blending.
     */
    VertexAnimationSet.prototype.getAbsoluteAGALCode = function (shaderObject) {
        var code = "";
        var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
        var temp2 = this._pFindTempReg(shaderObject.animationTargetRegisters, temp1);
        var regs = new Array("x", "y", "z", "w");
        var len = shaderObject.animatableAttributes.length;
        var constantReg = "vc" + shaderObject.numUsedVertexConstants;
        if (len > 2)
            len = 2;
        var streamIndex = shaderObject.numUsedStreams;
        for (var i = 0; i < len; ++i) {
            code += "mul " + temp1 + ", " + shaderObject.animatableAttributes[i] + ", " + constantReg + "." + regs[0] + "\n";
            for (var j = 1; j < this._numPoses; ++j) {
                code += "mul " + temp2 + ", va" + streamIndex + ", " + constantReg + "." + regs[j] + "\n";
                if (j < this._numPoses - 1)
                    code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";
                ++streamIndex;
            }
            code += "add " + shaderObject.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
        }
        // add code for bitangents if tangents are used
        if (shaderObject.tangentDependencies > 0 || shaderObject.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + shaderObject.animatableAttributes[2] + ", " + shaderObject.animationTargetRegisters[1] + "\n" + "mul " + temp1 + ", " + shaderObject.animationTargetRegisters[1] + ", " + temp1 + ".x\n" + "sub " + shaderObject.animationTargetRegisters[2] + ", " + shaderObject.animationTargetRegisters[2] + ", " + temp1 + "\n";
        }
        return code;
    };
    /**
     * Generates the vertex AGAL code for additive blending.
     */
    VertexAnimationSet.prototype.getAdditiveAGALCode = function (shaderObject) {
        var code = "";
        var len = shaderObject.animatableAttributes.length;
        var regs = ["x", "y", "z", "w"];
        var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
        var k /*uint*/;
        var streamIndex = shaderObject.numUsedStreams;
        if (len > 2)
            len = 2;
        code += "mov  " + shaderObject.animationTargetRegisters[0] + ", " + shaderObject.animatableAttributes[0] + "\n";
        if (shaderObject.normalDependencies > 0)
            code += "mov " + shaderObject.animationTargetRegisters[1] + ", " + shaderObject.animatableAttributes[1] + "\n";
        for (var i = 0; i < len; ++i) {
            for (var j = 0; j < this._numPoses; ++j) {
                code += "mul " + temp1 + ", va" + (streamIndex + k) + ", vc" + shaderObject.numUsedVertexConstants + "." + regs[j] + "\n" + "add " + shaderObject.animationTargetRegisters[i] + ", " + shaderObject.animationTargetRegisters[i] + ", " + temp1 + "\n";
                k++;
            }
        }
        if (shaderObject.tangentDependencies > 0 || shaderObject.outputsNormals) {
            code += "dp3 " + temp1 + ".x, " + shaderObject.animatableAttributes[2] + ", " + shaderObject.animationTargetRegisters[1] + "\n" + "mul " + temp1 + ", " + shaderObject.animationTargetRegisters[1] + ", " + temp1 + ".x\n" + "sub " + shaderObject.animationTargetRegisters[2] + ", " + shaderObject.animatableAttributes[2] + ", " + temp1 + "\n";
        }
        return code;
    };
    return VertexAnimationSet;
})(AnimationSetBase);
module.exports = VertexAnimationSet;


},{"awayjs-renderergl/lib/animators/AnimationSetBase":undefined,"awayjs-renderergl/lib/animators/data/VertexAnimationMode":undefined}],"awayjs-renderergl/lib/animators/VertexAnimator":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var VertexDataPool = require("awayjs-stagegl/lib/pool/VertexDataPool");
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
        this._weights = Array(1, 0, 0, 0);
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
    VertexAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        // todo: add code for when running on cpu
        // if no poses defined, set temp data
        if (!this._poses.length) {
            this.setNullPose(shaderObject, renderable, stage, vertexConstantOffset, vertexStreamOffset);
            return;
        }
        // this type of animation can only be SubMesh
        var subMesh = renderable.subMesh;
        var subGeom;
        var i /*uint*/;
        var len = this._numPoses;
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);
        if (this._blendMode == VertexAnimationMode.ABSOLUTE)
            i = 1;
        else
            i = 0;
        for (; i < len; ++i) {
            subGeom = this._poses[i].subGeometries[subMesh._iIndex] || subMesh.subGeometry;
            stage.activateBuffer(vertexStreamOffset++, VertexDataPool.getItem(subGeom, renderable.getIndexData(), TriangleSubGeometry.POSITION_DATA), subGeom.getOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
            if (shaderObject.normalDependencies > 0)
                stage.activateBuffer(vertexStreamOffset++, VertexDataPool.getItem(subGeom, renderable.getIndexData(), TriangleSubGeometry.NORMAL_DATA), subGeom.getOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
        }
    };
    VertexAnimator.prototype.setNullPose = function (shaderObject, renderable, stage, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);
        if (this._blendMode == VertexAnimationMode.ABSOLUTE) {
            var len = this._numPoses;
            for (var i = 1; i < len; ++i) {
                stage.activateBuffer(vertexStreamOffset++, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
                if (shaderObject.normalDependencies > 0)
                    stage.activateBuffer(vertexStreamOffset++, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
            }
        }
        // todo: set temp data for additive?
    };
    /**
     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
     * Needs to be called if gpu code is potentially required.
     */
    VertexAnimator.prototype.testGPUCompatibility = function (shaderObject) {
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


},{"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/animators/AnimatorBase":undefined,"awayjs-renderergl/lib/animators/data/VertexAnimationMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined,"awayjs-stagegl/lib/pool/VertexDataPool":undefined}],"awayjs-renderergl/lib/animators/data/AnimationRegisterCache":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
/**
 * ...
 */
var AnimationRegisterCache = (function (_super) {
    __extends(AnimationRegisterCache, _super);
    function AnimationRegisterCache(profile) {
        _super.call(this, profile);
        this.indexDictionary = new Object();
        this.vertexConstantData = new Array();
        this.fragmentConstantData = new Array();
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
        this.vertexConstantData.length = this._numVertexConstant * 4;
        this.fragmentConstantData.length = this._numFragmentConstant * 4;
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


},{"awayjs-renderergl/lib/compilation/ShaderRegisterCache":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/data/AnimationSubGeometry":[function(require,module,exports){
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
            buffer = this._pVertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, this._totalLenOfOneVertex);
            this._pBufferContext[contextIndex] = context;
            this._pBufferDirty[contextIndex] = true;
        }
        if (this._pBufferDirty[contextIndex]) {
            buffer.uploadFromArray(this._pVertexData, 0, this._numVertices);
            this._pBufferDirty[contextIndex] = false;
        }
        context.setVertexBufferAt(index, buffer, bufferOffset, format);
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
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
            return AssetType.SKELETON_POSE;
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
    return SkeletonPose;
})(NamedAssetBase);
module.exports = SkeletonPose;


},{"awayjs-core/lib/library/AssetType":undefined,"awayjs-core/lib/library/NamedAssetBase":undefined,"awayjs-renderergl/lib/animators/data/JointPose":undefined}],"awayjs-renderergl/lib/animators/data/Skeleton":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
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
            return AssetType.SKELETON;
        },
        enumerable: true,
        configurable: true
    });
    return Skeleton;
})(NamedAssetBase);
module.exports = Skeleton;


},{"awayjs-core/lib/library/AssetType":undefined,"awayjs-core/lib/library/NamedAssetBase":undefined}],"awayjs-renderergl/lib/animators/data/VertexAnimationMode":[function(require,module,exports){
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
    ParticleAccelerationNode.prototype.pGetAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleAccelerationState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleBezierCurveNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode":[function(require,module,exports){
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
    ParticleBillboardNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleBillboardState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleColorNode":[function(require,module,exports){
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
    ParticleColorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-renderergl/lib/animators/ParticleAnimationSet":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleColorState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleFollowNode":[function(require,module,exports){
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
    ParticleFollowNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/ParticleAnimationSet":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleFollowState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode":[function(require,module,exports){
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
    ParticleInitialColorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-renderergl/lib/animators/ParticleAnimationSet":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleInitialColorState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":[function(require,module,exports){
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
    ParticleNodeBase.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader.
     */
    ParticleNodeBase.prototype.getAGALFragmentCode = function (shaderObject, animationRegisterCache) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
     */
    ParticleNodeBase.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
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
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleOrbitNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleOrbitState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleOscillatorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleOscillatorState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticlePositionNode":[function(require,module,exports){
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
    ParticlePositionNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticlePositionState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleRotateToHeadingNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleRotateToPositionNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleRotationalVelocityNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleScaleNode":[function(require,module,exports){
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
    ParticleScaleNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleScaleState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleSegmentedColorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/ParticleAnimationSet":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleSpriteSheetNode.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/ParticleAnimationSet":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleTimeNode":[function(require,module,exports){
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
    ParticleTimeNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleTimeState":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleUVNode":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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
    ParticleUVNode.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/ParticleAnimationSet":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleUVState":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode":[function(require,module,exports){
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
    ParticleVelocityNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/nodes/ParticleNodeBase":undefined,"awayjs-renderergl/lib/animators/states/ParticleVelocityState":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode":[function(require,module,exports){
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


},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonClipNode":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonClipState":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode":[function(require,module,exports){
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


},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode":[function(require,module,exports){
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


},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState":undefined}],"awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode":[function(require,module,exports){
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


},{"awayjs-display/lib/animators/nodes/AnimationNodeBase":undefined,"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState":undefined}],"awayjs-renderergl/lib/animators/nodes/VertexClipNode":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase":undefined,"awayjs-renderergl/lib/animators/states/VertexClipState":undefined}],"awayjs-renderergl/lib/animators/states/AnimationClipState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/AnimationStateBase":undefined,"awayjs-renderergl/lib/events/AnimationStateEvent":undefined}],"awayjs-renderergl/lib/animators/states/AnimationStateBase":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleBezierCurveState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleBillboardState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Orientation3D":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined}],"awayjs-renderergl/lib/animators/states/ParticleColorState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleFollowState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleInitialColorState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleOrbitState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleOscillatorState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticlePositionState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleScaleState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined}],"awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleStateBase":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/AnimationStateBase":undefined}],"awayjs-renderergl/lib/animators/states/ParticleTimeState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/ParticleUVState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined}],"awayjs-renderergl/lib/animators/states/ParticleVelocityState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/ParticlePropertiesMode":undefined,"awayjs-renderergl/lib/animators/states/ParticleStateBase":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/JointPose":undefined,"awayjs-renderergl/lib/animators/data/SkeletonPose":undefined,"awayjs-renderergl/lib/animators/states/AnimationStateBase":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonClipState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/animators/data/JointPose":undefined,"awayjs-renderergl/lib/animators/data/SkeletonPose":undefined,"awayjs-renderergl/lib/animators/states/AnimationClipState":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonDifferenceState":[function(require,module,exports){
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


},{"awayjs-core/lib/geom/Quaternion":undefined,"awayjs-renderergl/lib/animators/data/JointPose":undefined,"awayjs-renderergl/lib/animators/data/SkeletonPose":undefined,"awayjs-renderergl/lib/animators/states/AnimationStateBase":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonDirectionalState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/JointPose":undefined,"awayjs-renderergl/lib/animators/data/SkeletonPose":undefined,"awayjs-renderergl/lib/animators/states/AnimationStateBase":undefined}],"awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/data/JointPose":undefined,"awayjs-renderergl/lib/animators/data/SkeletonPose":undefined,"awayjs-renderergl/lib/animators/states/AnimationStateBase":undefined}],"awayjs-renderergl/lib/animators/states/VertexClipState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/AnimationClipState":undefined}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode":undefined,"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState":undefined}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState":undefined,"awayjs-renderergl/lib/events/AnimationStateEvent":undefined}],"awayjs-renderergl/lib/animators/transitions/CrossfadeTransition":[function(require,module,exports){
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


},{"awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode":undefined}],"awayjs-renderergl/lib/animators/transitions/IAnimationTransition":[function(require,module,exports){



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


},{"awayjs-display/lib/base/Geometry":undefined}],"awayjs-renderergl/lib/base/RendererBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Point = require("awayjs-core/lib/geom/Point");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var RenderableMergeSort = require("awayjs-display/lib/sort/RenderableMergeSort");
var RendererEvent = require("awayjs-display/lib/events/RendererEvent");
var StageEvent = require("awayjs-display/lib/events/StageEvent");
var EntityCollector = require("awayjs-display/lib/traverse/EntityCollector");
var DefaultMaterialManager = require("awayjs-display/lib/managers/DefaultMaterialManager");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var StageManager = require("awayjs-stagegl/lib/managers/StageManager");
var BillboardRenderable = require("awayjs-renderergl/lib/pool/BillboardRenderable");
var LineSubMeshRenderable = require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
var TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
var RenderablePool = require("awayjs-renderergl/lib/pool/RenderablePool");
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
    function RendererBase(stage) {
        var _this = this;
        if (stage === void 0) { stage = null; }
        _super.call(this);
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
        this._shareContext = false;
        this.textureRatioX = 1;
        this.textureRatioY = 1;
        this._pRttViewProjectionMatrix = new Matrix3D();
        this._localPos = new Point();
        this._globalPos = new Point();
        this._pScissorRect = new Rectangle();
        this._pNumTriangles = 0;
        this._disableColor = false;
        this._renderBlended = true;
        this._onViewportUpdatedDelegate = function (event) { return _this.onViewportUpdated(event); };
        this._onContextUpdateDelegate = function (event) { return _this.onContextUpdate(event); };
        this.stage = stage || StageManager.getInstance().getFreeStage();
        //default sorting algorithm
        this.renderableSorter = new RenderableMergeSort();
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
    Object.defineProperty(RendererBase.prototype, "numTriangles", {
        /**
         *
         */
        get: function () {
            return this._pNumTriangles;
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
    RendererBase.prototype.activateProgram = function (renderable, shader, camera) {
        for (var i = shader.numUsedStreams; i < this._numUsedStreams; i++)
            this._pContext.setVertexBufferAt(i, null);
        for (var i = shader.numUsedTextures; i < this._numUsedTextures; i++)
            this._pContext.setTextureAt(i, null);
        //check program data is uploaded
        var programData = shader.programData;
        if (!programData.program) {
            programData.program = this._pContext.createProgram();
            var vertexByteCode = (new AGALMiniAssembler().assemble("part vertex 1\n" + programData.vertexString + "endpart"))['vertex'].data;
            var fragmentByteCode = (new AGALMiniAssembler().assemble("part fragment 1\n" + programData.fragmentString + "endpart"))['fragment'].data;
            programData.program.upload(vertexByteCode, fragmentByteCode);
        }
        //set program data
        this._pContext.setProgram(programData.program);
        //activate shader object through renderable
        renderable._iActivate(shader, camera);
    };
    RendererBase.prototype.deactivateProgram = function (renderable, shader) {
        //deactivate shader object
        renderable._iDeactivate(shader);
        this._numUsedStreams = shader.numUsedStreams;
        this._numUsedTextures = shader.numUsedTextures;
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
        set: function (value) {
            if (value == this._pStage)
                return;
            this.iSetStage(value);
        },
        enumerable: true,
        configurable: true
    });
    RendererBase.prototype.iSetStage = function (value) {
        if (this._pStage)
            this.dispose();
        if (value) {
            this._pStage = value;
            this._pStage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
            this._pStage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
            this._pStage.addEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
            this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable, this._pStage);
            this._triangleSubMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable, this._pStage);
            this._lineSubMeshRenderablePool = RenderablePool.getPool(LineSubMeshRenderable, this._pStage);
            /*
             if (_backgroundImageRenderer)
             _backgroundImageRenderer.stage = value;
             */
            if (this._pStage.context)
                this._pContext = this._pStage.context;
        }
        this._pBackBufferInvalid = true;
        this.updateGlobalPos();
    };
    Object.defineProperty(RendererBase.prototype, "shareContext", {
        /**
         * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
         * to share the same ContextGL object.
         */
        get: function () {
            return this._shareContext;
        },
        set: function (value) {
            if (this._shareContext == value)
                return;
            this._shareContext = value;
            this.updateGlobalPos();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Disposes the resources used by the RendererBase.
     */
    RendererBase.prototype.dispose = function () {
        this._billboardRenderablePool.dispose();
        this._triangleSubMeshRenderablePool.dispose();
        this._lineSubMeshRenderablePool.dispose();
        this._billboardRenderablePool = null;
        this._triangleSubMeshRenderablePool = null;
        this._lineSubMeshRenderablePool = null;
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
        this.pCollectRenderables(entityCollector);
        this._pStage.setRenderTarget(target, true, 0);
        this._pContext.clear(1, 1, 1, 1, 1, 0);
        this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
        this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);
        var head = this._pOpaqueRenderableHead;
        var first = true;
        for (var i = numCascades - 1; i >= 0; --i) {
            this._pStage.scissorRect = scissorRects[i];
            this.drawCascadeRenderables(head, cameras[i], first ? null : cameras[i].frustumPlanes);
            first = false;
        }
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);
        this._pStage.scissorRect = null;
    };
    RendererBase.prototype.pCollectRenderables = function (entityCollector) {
        //reset head values
        this._pBlendedRenderableHead = null;
        this._pOpaqueRenderableHead = null;
        this._pNumTriangles = 0;
        //grab entity head
        var item = entityCollector.entityHead;
        //set temp values for entry point and camera forward vector
        this._pCamera = entityCollector.camera;
        this._iEntryPoint = this._pCamera.scenePosition;
        this._pCameraForward = this._pCamera.transform.forwardVector;
        while (item) {
            item.entity._iCollectRenderables(this);
            item = item.next;
        }
        //sort the resulting renderables
        this._pOpaqueRenderableHead = this.renderableSorter.sortOpaqueRenderables(this._pOpaqueRenderableHead);
        this._pBlendedRenderableHead = this.renderableSorter.sortBlendedRenderables(this._pBlendedRenderableHead);
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
        this.pCollectRenderables(entityCollector);
        this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
        this.pDraw(entityCollector);
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        //this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL); //oopsie
        if (!this._shareContext) {
            if (this._snapshotRequired && this._snapshotBitmapData) {
                this._pContext.drawToBitmapData(this._snapshotBitmapData);
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
        this._snapshotBitmapData = bmd;
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
    RendererBase.prototype.drawCascadeRenderables = function (renderable, camera, cullPlanes) {
        var renderObject;
        var shaderObject;
        var renderable2;
        while (renderable) {
            renderObject = renderable.renderObject;
            renderable2 = renderable;
            this.activateProgram(renderable, shaderObject, camera);
            do {
                // if completely in front, it will fall in a different cascade
                // do not use near and far planes
                if (!cullPlanes || renderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
                    renderable2._iRender(shaderObject, camera, this._pRttViewProjectionMatrix);
                }
                else {
                    renderable2.cascaded = true;
                }
                renderable2 = renderable2.next;
            } while (renderable2 && renderable2.renderObject == renderObject && !renderable2.cascaded);
            this.deactivateProgram(renderable, shaderObject);
            renderable = renderable2;
        }
    };
    /**
     * Draw a list of renderables.
     *
     * @param renderables The renderables to draw.
     * @param entityCollector The EntityCollector containing all potentially visible information.
     */
    RendererBase.prototype.drawRenderables = function (renderable, entityCollector) {
        var i;
        var len;
        var renderObject;
        var shaderObjects;
        var shaderObject;
        var camera = entityCollector.camera;
        var renderable2;
        while (renderable) {
            renderObject = renderable.renderObject;
            shaderObjects = renderObject.shaderObjects;
            // otherwise this would result in depth rendered anyway because fragment shader kil is ignored
            if (this._disableColor && renderObject._renderObjectOwner.alphaThreshold != 0) {
                renderable2 = renderable;
                do {
                    renderable2 = renderable2.next;
                } while (renderable2 && renderable2.renderObject == renderObject);
            }
            else {
                //iterate through each shader object
                len = shaderObjects.length;
                for (i = 0; i < len; i++) {
                    renderable2 = renderable;
                    shaderObject = shaderObjects[i];
                    this.activateProgram(renderable, shaderObject, camera);
                    do {
                        renderable2._iRender(shaderObject, camera, this._pRttViewProjectionMatrix);
                        renderable2 = renderable2.next;
                    } while (renderable2 && renderable2.renderObject == renderObject);
                    this.deactivateProgram(renderable, shaderObject);
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
    /**
     *
     * @param billboard
     * @protected
     */
    RendererBase.prototype.applyBillboard = function (billboard) {
        this._applyRenderable(this._billboardRenderablePool.getItem(billboard));
    };
    /**
     *
     * @param triangleSubMesh
     */
    RendererBase.prototype.applyTriangleSubMesh = function (triangleSubMesh) {
        this._applyRenderable(this._triangleSubMeshRenderablePool.getItem(triangleSubMesh));
    };
    /**
     *
     * @param lineSubMesh
     */
    RendererBase.prototype.applyLineSubMesh = function (lineSubMesh) {
        this._applyRenderable(this._lineSubMeshRenderablePool.getItem(lineSubMesh));
    };
    /**
     *
     * @param renderable
     * @protected
     */
    RendererBase.prototype._applyRenderable = function (renderable) {
        //set local vars for faster referencing
        var renderObject = this._pGetRenderObject(renderable, renderable.renderObjectOwner || DefaultMaterialManager.getDefaultMaterial(renderable.renderableOwner));
        renderable.renderObject = renderObject;
        renderable.renderObjectId = renderObject.renderObjectId;
        renderable.renderOrderId = renderObject.renderOrderId;
        renderable.cascaded = false;
        var entity = renderable.sourceEntity;
        var position = entity.scenePosition;
        // project onto camera's z-axis
        position = this._iEntryPoint.subtract(position);
        renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);
        //store reference to scene transform
        renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);
        if (renderObject.requiresBlending) {
            renderable.next = this._pBlendedRenderableHead;
            this._pBlendedRenderableHead = renderable;
        }
        else {
            renderable.next = this._pOpaqueRenderableHead;
            this._pOpaqueRenderableHead = renderable;
        }
        this._pNumTriangles += renderable.numTriangles;
        //handle any overflow for renderables with data that exceeds GPU limitations
        if (renderable.overflow)
            this._applyRenderable(renderable.overflow);
    };
    RendererBase.prototype._pGetRenderObject = function (renderable, renderObjectOwner) {
        throw new AbstractMethodError();
    };
    return RendererBase;
})(EventDispatcher);
module.exports = RendererBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-display/lib/events/RendererEvent":undefined,"awayjs-display/lib/events/StageEvent":undefined,"awayjs-display/lib/managers/DefaultMaterialManager":undefined,"awayjs-display/lib/sort/RenderableMergeSort":undefined,"awayjs-display/lib/traverse/EntityCollector":undefined,"awayjs-renderergl/lib/pool/BillboardRenderable":undefined,"awayjs-renderergl/lib/pool/LineSubMeshRenderable":undefined,"awayjs-renderergl/lib/pool/RenderablePool":undefined,"awayjs-renderergl/lib/pool/TriangleSubMeshRenderable":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/managers/StageManager":undefined}],"awayjs-renderergl/lib/compilation/DepthRenderObject":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLMipFilter = require("awayjs-stagegl/lib/base/ContextGLMipFilter");
var ContextGLTextureFilter = require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
var ContextGLWrapMode = require("awayjs-stagegl/lib/base/ContextGLWrapMode");
var RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
/**
 * DepthRenderObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var DepthRenderObject = (function (_super) {
    __extends(DepthRenderObject, _super);
    function DepthRenderObject(pool, material, renderableClass, stage) {
        _super.call(this, pool, material, renderableClass, stage);
        this._diffuseColor = 0xffffff;
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._diffuseA = 1;
        this._pAddScreenShader(new ShaderObjectBase(material, renderableClass, this, this._stage));
    }
    DepthRenderObject.prototype._iIncludeDependencies = function (shaderObject) {
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
        shaderObject.projectionDependencies++;
        if (shaderObject.alphaThreshold > 0)
            shaderObject.uvDependencies++;
    };
    DepthRenderObject.prototype._iInitConstantData = function (shaderObject) {
        _super.prototype._iInitConstantData.call(this, shaderObject);
        var index = this._fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
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
    DepthRenderObject.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        var targetReg = sharedRegisters.shadedTarget;
        var diffuseInputReg = registerCache.getFreeTextureReg();
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
        if (shaderObject.alphaThreshold > 0) {
            diffuseInputReg = registerCache.getFreeTextureReg();
            this._texturesIndex = diffuseInputReg.index;
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += ShaderCompilerHelper.getTex2DSampleCode(albedo, sharedRegisters, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
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
    DepthRenderObject.prototype._iActivate = function (shader, camera) {
        _super.prototype._iActivate.call(this, shader, camera);
        var context = this._stage.context;
        if (shader.alphaThreshold > 0) {
            context.setSamplerStateAt(this._texturesIndex, shader.repeatTextures ? ContextGLWrapMode.REPEAT : ContextGLWrapMode.CLAMP, shader.useSmoothTextures ? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shader.useMipmapping ? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
            this._stage.activateTexture(this._texturesIndex, shader.texture);
            shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = shader.alphaThreshold;
        }
    };
    /**
     *
     */
    DepthRenderObject.id = "depth";
    return DepthRenderObject;
})(RenderObjectBase);
module.exports = DepthRenderObject;


},{"awayjs-renderergl/lib/compilation/RenderObjectBase":undefined,"awayjs-renderergl/lib/compilation/ShaderObjectBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined,"awayjs-stagegl/lib/base/ContextGLMipFilter":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFilter":undefined,"awayjs-stagegl/lib/base/ContextGLWrapMode":undefined}],"awayjs-renderergl/lib/compilation/DistanceRenderObject":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLMipFilter = require("awayjs-stagegl/lib/base/ContextGLMipFilter");
var ContextGLTextureFilter = require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
var ContextGLWrapMode = require("awayjs-stagegl/lib/base/ContextGLWrapMode");
var RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
/**
 * DistanceRenderObject is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
var DistanceRenderObject = (function (_super) {
    __extends(DistanceRenderObject, _super);
    /**
     * Creates a new DistanceRenderObject object.
     *
     * @param material The material to which this pass belongs.
     */
    function DistanceRenderObject(pool, renderObjectOwner, renderableClass, stage) {
        _super.call(this, pool, renderObjectOwner, renderableClass, stage);
        this._pAddScreenShader(new ShaderObjectBase(renderObjectOwner, renderableClass, this, this._stage));
    }
    /**
     * Initializes the unchanging constant data for this material.
     */
    DistanceRenderObject.prototype._iInitConstantData = function (shaderObject) {
        _super.prototype._iInitConstantData.call(this, shaderObject);
        var index = this._fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index + 4] = 1.0 / 255.0;
        data[index + 5] = 1.0 / 255.0;
        data[index + 6] = 1.0 / 255.0;
        data[index + 7] = 0.0;
    };
    DistanceRenderObject.prototype._iIncludeDependencies = function (shaderObject) {
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
        shaderObject.projectionDependencies++;
        shaderObject.viewDirDependencies++;
        if (shaderObject.alphaThreshold > 0)
            shaderObject.uvDependencies++;
        if (shaderObject.viewDirDependencies > 0)
            shaderObject.globalPosDependencies++;
    };
    /**
     * @inheritDoc
     */
    DistanceRenderObject.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code;
        var targetReg = sharedRegisters.shadedTarget;
        var diffuseInputReg = registerCache.getFreeTextureReg();
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // squared distance to view
        code = "dp3 " + temp1 + ".z, " + sharedRegisters.viewDirVarying + ".xyz, " + sharedRegisters.viewDirVarying + ".xyz\n" + "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" + "frc " + temp1 + ", " + temp1 + "\n" + "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        if (shaderObject.alphaThreshold > 0) {
            diffuseInputReg = registerCache.getFreeTextureReg();
            this._texturesIndex = diffuseInputReg.index;
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += ShaderCompilerHelper.getTex2DSampleCode(albedo, sharedRegisters, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" + "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    DistanceRenderObject.prototype._iActivate = function (shader, camera) {
        _super.prototype._iActivate.call(this, shader, camera);
        var context = this._stage.context;
        var f = camera.projection.far;
        f = 1 / (2 * f * f);
        // sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
        var index = this._fragmentConstantsIndex;
        var data = shader.fragmentConstantData;
        data[index] = 1.0 * f;
        data[index + 1] = 255.0 * f;
        data[index + 2] = 65025.0 * f;
        data[index + 3] = 16581375.0 * f;
        if (shader.alphaThreshold > 0) {
            context.setSamplerStateAt(this._texturesIndex, shader.repeatTextures ? ContextGLWrapMode.REPEAT : ContextGLWrapMode.CLAMP, shader.useSmoothTextures ? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shader.useMipmapping ? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
            this._stage.activateTexture(this._texturesIndex, shader.texture);
            data[index + 8] = shader.alphaThreshold;
        }
    };
    /**
     *
     */
    DistanceRenderObject.id = "distance";
    return DistanceRenderObject;
})(RenderObjectBase);
module.exports = DistanceRenderObject;


},{"awayjs-renderergl/lib/compilation/RenderObjectBase":undefined,"awayjs-renderergl/lib/compilation/ShaderObjectBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined,"awayjs-stagegl/lib/base/ContextGLMipFilter":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFilter":undefined,"awayjs-stagegl/lib/base/ContextGLWrapMode":undefined}],"awayjs-renderergl/lib/compilation/IRenderLightingObject":[function(require,module,exports){



},{}],"awayjs-renderergl/lib/compilation/IRenderObjectBase":[function(require,module,exports){



},{}],"awayjs-renderergl/lib/compilation/IRenderObjectClass":[function(require,module,exports){



},{}],"awayjs-renderergl/lib/compilation/RegisterPool":[function(require,module,exports){
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
/**
 * RegisterPool is used by the shader compilation process to keep track of which registers of a certain type are
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


},{"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/compilation/RenderBasicMaterialObject":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLMipFilter = require("awayjs-stagegl/lib/base/ContextGLMipFilter");
var ContextGLTextureFilter = require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
var ContextGLWrapMode = require("awayjs-stagegl/lib/base/ContextGLWrapMode");
var RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var RenderBasicMaterialObject = (function (_super) {
    __extends(RenderBasicMaterialObject, _super);
    function RenderBasicMaterialObject(pool, renderObjectOwner, renderableClass, stage) {
        _super.call(this, pool, renderObjectOwner, renderableClass, stage);
        this._diffuseColor = 0xffffff;
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._diffuseA = 1;
        this._alphaBlending = false;
        this._alpha = 1;
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._screenShader = new ShaderObjectBase(renderObjectOwner, renderableClass, this, this._stage);
        this._pAddScreenShader(this._screenShader);
    }
    RenderBasicMaterialObject.prototype._iIncludeDependencies = function (shaderObject) {
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
        if (shaderObject.texture != null)
            shaderObject.uvDependencies++;
    };
    /**
     * @inheritDoc
     */
    RenderBasicMaterialObject.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
        var code = "";
        var targetReg = sharedReg.shadedTarget;
        var diffuseInputReg;
        if (shaderObject.texture != null) {
            diffuseInputReg = regCache.getFreeTextureReg();
            this._texturesIndex = diffuseInputReg.index;
            code += ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedReg, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
            if (shaderObject.alphaThreshold > 0) {
                var cutOffReg = regCache.getFreeFragmentConstant();
                this._fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else if (shaderObject.colorBufferIndex != -1) {
            code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
        }
        else {
            diffuseInputReg = regCache.getFreeFragmentConstant();
            this._fragmentConstantsIndex = diffuseInputReg.index * 4;
            code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    RenderBasicMaterialObject.prototype._iActivate = function (shader, camera) {
        _super.prototype._iActivate.call(this, shader, camera);
        if (shader.texture != null) {
            this._stage.context.setSamplerStateAt(this._texturesIndex, shader.repeatTextures ? ContextGLWrapMode.REPEAT : ContextGLWrapMode.CLAMP, shader.useSmoothTextures ? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shader.useMipmapping ? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
            this._stage.activateTexture(this._texturesIndex, shader.texture);
            if (shader.alphaThreshold > 0)
                shader.fragmentConstantData[this._fragmentConstantsIndex] = shader.alphaThreshold;
        }
        else if (shader.colorBufferIndex == -1) {
            var index = this._fragmentConstantsIndex;
            var data = shader.fragmentConstantData;
            data[index] = this._diffuseR;
            data[index + 1] = this._diffuseG;
            data[index + 2] = this._diffuseB;
            data[index + 3] = this._diffuseA;
        }
    };
    /**
     * @inheritDoc
     */
    RenderBasicMaterialObject.prototype._pUpdateRenderObject = function () {
        this.setBlendAndCompareModes();
        this._pClearScreenShaders();
        this._pAddScreenShader(this._screenShader);
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    RenderBasicMaterialObject.prototype.setBlendAndCompareModes = function () {
        this._pRequiresBlending = (this._renderObjectOwner.blendMode != BlendMode.NORMAL || this._alphaBlending || this._alpha < 1);
        //this._screenShader.preserveAlpha = this._pRequiresBlending;
        this._screenShader.setBlendMode((this._renderObjectOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._renderObjectOwner.blendMode);
        //this._screenShader.forceSeparateMVP = false;
    };
    /**
     *
     */
    RenderBasicMaterialObject.id = "basic";
    return RenderBasicMaterialObject;
})(RenderObjectBase);
module.exports = RenderBasicMaterialObject;


},{"awayjs-display/lib/base/BlendMode":undefined,"awayjs-renderergl/lib/compilation/RenderObjectBase":undefined,"awayjs-renderergl/lib/compilation/ShaderObjectBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLMipFilter":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFilter":undefined,"awayjs-stagegl/lib/base/ContextGLWrapMode":undefined}],"awayjs-renderergl/lib/compilation/RenderObjectBase":[function(require,module,exports){
var Event = require("awayjs-core/lib/events/Event");
var AssetType = require("awayjs-core/lib/library/AssetType");
/**
 *
 * @class away.pool.ScreenPasses
 */
var RenderObjectBase = (function () {
    function RenderObjectBase(pool, renderObjectOwner, renderableClass, stage) {
        var _this = this;
        this._forceSeparateMVP = false;
        this._invalidAnimation = true;
        this._invalidRenderObject = true;
        this._shaderObjects = new Array();
        this._pRequiresBlending = false;
        this._pool = pool;
        this.renderObjectId = renderObjectOwner.id;
        this._renderObjectOwner = renderObjectOwner;
        this._renderableClass = renderableClass;
        this._stage = stage;
        this._onShaderChangeDelegate = function (event) { return _this.onShaderChange(event); };
    }
    Object.defineProperty(RenderObjectBase.prototype, "requiresBlending", {
        /**
         * Indicates whether or not the renderable requires alpha blending during rendering.
         */
        get: function () {
            return this._pRequiresBlending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderObjectBase.prototype, "renderOrderId", {
        get: function () {
            if (this._invalidAnimation)
                this._updateAnimation();
            return this._renderOrderId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderObjectBase.prototype, "shaderObjects", {
        get: function () {
            if (this._invalidAnimation)
                this._updateAnimation();
            return this._shaderObjects;
        },
        enumerable: true,
        configurable: true
    });
    RenderObjectBase.prototype._iIncludeDependencies = function (shaderObject) {
        if (this._renderObjectOwner.assetType = AssetType.MATERIAL) {
            var material = this._renderObjectOwner;
            shaderObject.useAlphaPremultiplied = material.alphaPremultiplied;
            shaderObject.useBothSides = material.bothSides;
            shaderObject.repeatTextures = material.repeat;
            shaderObject.usesUVTransform = material.animateUVs;
            shaderObject.texture = material.texture;
            shaderObject.color = material.color;
        }
        if (this._forceSeparateMVP)
            shaderObject.globalPosDependencies++;
        shaderObject.outputsNormals = this._pOutputsNormals(shaderObject);
        shaderObject.outputsTangentNormals = shaderObject.outputsNormals && this._pOutputsTangentNormals(shaderObject);
        shaderObject.usesTangentSpace = shaderObject.outputsTangentNormals && this._pUsesTangentSpace(shaderObject);
        if (!shaderObject.usesTangentSpace && shaderObject.viewDirDependencies > 0)
            shaderObject.globalPosDependencies++;
    };
    /**
     * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
     * @param pass The pass used to render the renderable.
     * @param renderable The IRenderable object to draw.
     * @param stage The Stage object used for rendering.
     * @param entityCollector The EntityCollector object that contains the visible scene data.
     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
     * camera.viewProjection as it includes the scaling factors when rendering to textures.
     *
     * @internal
     */
    RenderObjectBase.prototype._iRender = function (renderable, shader, camera, viewProjection) {
        if (this._renderObjectOwner.lightPicker)
            this._renderObjectOwner.lightPicker.collectLights(renderable);
        shader._iRender(renderable, camera, viewProjection);
    };
    /**
     *
     */
    RenderObjectBase.prototype.dispose = function () {
        this._pClearScreenShaders();
        var len = this._shaderObjects.length;
        for (var i = 0; i < len; i++)
            this._shaderObjects[i].dispose();
        this._shaderObjects = null;
        this._pool.disposeItem(this._renderObjectOwner);
    };
    /**
     *
     */
    RenderObjectBase.prototype.invalidateRenderObject = function () {
        this._invalidRenderObject = true;
        this._invalidAnimation = true;
    };
    /**
     *
     */
    RenderObjectBase.prototype.invalidateProperties = function () {
        var len = this._shaderObjects.length;
        for (var i = 0; i < len; i++)
            this._shaderObjects[i].invalidateShader();
        this._invalidAnimation = true;
    };
    /**
     *
     */
    RenderObjectBase.prototype.invalidateAnimation = function () {
        this._invalidAnimation = true;
    };
    /**
     *
     * @param renderObjectOwner
     */
    RenderObjectBase.prototype._updateAnimation = function () {
        if (this._invalidRenderObject)
            this._pUpdateRenderObject();
        this._invalidAnimation = false;
        var enabledGPUAnimation = this._getEnabledGPUAnimation();
        var renderOrderId = 0;
        var mult = 1;
        var shaderObject;
        var len = this._shaderObjects.length;
        for (var i = 0; i < len; i++) {
            shaderObject = this._shaderObjects[i];
            if (shaderObject.usesAnimation != enabledGPUAnimation) {
                shaderObject.usesAnimation = enabledGPUAnimation;
                shaderObject.invalidateProgram();
            }
            renderOrderId += shaderObject.programData.id * mult;
            mult *= 1000;
        }
        this._renderOrderId = renderOrderId;
    };
    /**
     * Performs any processing that needs to occur before any of its passes are used.
     *
     * @private
     */
    RenderObjectBase.prototype._pUpdateRenderObject = function () {
        this._invalidRenderObject = false;
        //overrride to update shader object properties
    };
    /**
     * Removes a pass from the renderObjectOwner.
     * @param pass The pass to be removed.
     */
    RenderObjectBase.prototype._pRemoveScreenShader = function (shader) {
        shader.removeEventListener(Event.CHANGE, this._onShaderChangeDelegate);
        this._shaderObjects.splice(this._shaderObjects.indexOf(shader), 1);
    };
    /**
     * Removes all passes from the renderObjectOwner
     */
    RenderObjectBase.prototype._pClearScreenShaders = function () {
        var len = this._shaderObjects.length;
        for (var i = 0; i < len; ++i)
            this._shaderObjects[i].removeEventListener(Event.CHANGE, this._onShaderChangeDelegate);
        this._shaderObjects.length = 0;
    };
    /**
     * Adds a pass to the renderObjectOwner
     * @param pass
     */
    RenderObjectBase.prototype._pAddScreenShader = function (shader) {
        this._shaderObjects.push(shader);
        shader.addEventListener(Event.CHANGE, this._onShaderChangeDelegate);
    };
    /**
     * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
     * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param pass The pass data to activate.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    RenderObjectBase.prototype._iActivate = function (shader, camera) {
        shader._iActivate(camera);
    };
    /**
     * Clears the render state for a pass. This needs to be called before activating another pass.
     * @param pass The pass to deactivate.
     * @param stage The Stage used for rendering
     *
     * @internal
     */
    RenderObjectBase.prototype._iDeactivate = function (shader) {
        shader._iDeactivate();
    };
    RenderObjectBase.prototype._iInitConstantData = function (shaderObject) {
    };
    RenderObjectBase.prototype._iGetPreLightingVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderObjectBase.prototype._iGetPreLightingFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderObjectBase.prototype._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderObjectBase.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderObjectBase.prototype._iGetNormalVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderObjectBase.prototype._iGetNormalFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * Indicates whether or not normals are calculated at all.
     */
    RenderObjectBase.prototype._pOutputsNormals = function (shaderObject) {
        return false;
    };
    /**
     * Indicates whether or not normals are calculated in tangent space.
     */
    RenderObjectBase.prototype._pOutputsTangentNormals = function (shaderObject) {
        return false;
    };
    /**
     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
     * dependencies exist.
     */
    RenderObjectBase.prototype._pUsesTangentSpace = function (shaderObject) {
        return false;
    };
    /**
     * Listener for when a pass's shader code changes. It recalculates the render order id.
     */
    RenderObjectBase.prototype.onShaderChange = function (event) {
        this.invalidateAnimation();
    };
    /**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
    RenderObjectBase.prototype._getEnabledGPUAnimation = function () {
        if (this._renderObjectOwner.animationSet) {
            this._renderObjectOwner.animationSet.resetGPUCompatibility();
            var owners = this._renderObjectOwner.iOwners;
            var numOwners = owners.length;
            var len = this._shaderObjects.length;
            for (var i = 0; i < len; i++)
                for (var j = 0; j < numOwners; j++)
                    if (owners[j].animator)
                        owners[j].animator.testGPUCompatibility(this._shaderObjects[i]);
            return !this._renderObjectOwner.animationSet.usesCPU;
        }
        return false;
    };
    return RenderObjectBase;
})();
module.exports = RenderObjectBase;


},{"awayjs-core/lib/events/Event":undefined,"awayjs-core/lib/library/AssetType":undefined}],"awayjs-renderergl/lib/compilation/RenderObjectPool":[function(require,module,exports){
/**
 * @class away.pool.RenderObjectPool
 */
var RenderObjectPool = (function () {
    /**
     * //TODO
     *
     * @param renderObjectClass
     */
    function RenderObjectPool(renderObjectClass, renderableClass, stage) {
        this._renderObjectPool = new Object();
        this._renderObjectClass = renderObjectClass;
        this._renderableClass = renderableClass;
        this._stage = stage;
    }
    /**
     * //TODO
     *
     * @param renderableOwner
     * @returns IRenderable
     */
    RenderObjectPool.prototype.getItem = function (renderObjectOwner) {
        return (this._renderObjectPool[renderObjectOwner.id] || (this._renderObjectPool[renderObjectOwner.id] = renderObjectOwner._iAddRenderObject(new this._renderObjectClass(this, renderObjectOwner, this._renderableClass, this._stage))));
    };
    /**
     * //TODO
     *
     * @param renderableOwner
     */
    RenderObjectPool.prototype.disposeItem = function (renderObjectOwner) {
        renderObjectOwner._iRemoveRenderObject(this._renderObjectPool[renderObjectOwner.id]);
        this._renderObjectPool[renderObjectOwner.id] = null;
    };
    return RenderObjectPool;
})();
module.exports = RenderObjectPool;


},{}],"awayjs-renderergl/lib/compilation/ShaderCompilerBase":[function(require,module,exports){
var ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
var ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
/**
 * ShaderCompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
var ShaderCompilerBase = (function () {
    /**
     * Creates a new ShaderCompilerBase object.
     * @param profile The compatibility profile of the renderer.
     */
    function ShaderCompilerBase(renderableClass, renderObject, shaderObject) {
        this._pVertexCode = ''; // Changed to emtpy string- AwayTS
        this._pFragmentCode = ''; // Changed to emtpy string - AwayTS
        this._pPostAnimationFragmentCode = ''; // Changed to emtpy string - AwayTS
        this._pRenderableClass = renderableClass;
        this._pRenderObject = renderObject;
        this._pShaderObject = shaderObject;
        this._pSharedRegisters = new ShaderRegisterData();
        this._pRegisterCache = new ShaderRegisterCache(shaderObject.profile);
        this._pRegisterCache.vertexAttributesOffset = renderableClass.vertexAttributesOffset;
        this._pRegisterCache.reset();
    }
    /**
     * Compiles the code after all setup on the compiler has finished.
     */
    ShaderCompilerBase.prototype.compile = function () {
        this._pShaderObject.reset();
        this._pShaderObject._iIncludeDependencies();
        this._pRenderObject._iIncludeDependencies(this._pShaderObject);
        this._pRenderableClass._iIncludeDependencies(this._pShaderObject);
        this.pInitRegisterIndices();
        this.pCompileDependencies();
        //compile custom vertex & fragment codes
        this._pVertexCode += this._pRenderObject._iGetVertexCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
        this._pPostAnimationFragmentCode += this._pRenderObject._iGetFragmentCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
        //assign the final output color to the output register
        this._pPostAnimationFragmentCode += "mov " + this._pRegisterCache.fragmentOutputRegister + ", " + this._pSharedRegisters.shadedTarget + "\n";
        this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.shadedTarget);
        //initialise the required shader constants
        this._pShaderObject.initConstantData(this._pRegisterCache, this._pAnimatableAttributes, this._pAnimationTargetRegisters, this._uvSource, this._uvTarget);
        this._pRenderObject._iInitConstantData(this._pShaderObject);
    };
    /**
     * Compile the code for the methods.
     */
    ShaderCompilerBase.prototype.pCompileDependencies = function () {
        this._pSharedRegisters.shadedTarget = this._pRegisterCache.getFreeFragmentVectorTemp();
        this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.shadedTarget, 1);
        //compile the world-space position if required
        if (this._pShaderObject.globalPosDependencies > 0)
            this.compileGlobalPositionCode();
        //Calculate the (possibly animated) UV coordinates.
        if (this._pShaderObject.uvDependencies > 0)
            this.compileUVCode();
        if (this._pShaderObject.secondaryUVDependencies > 0)
            this.compileSecondaryUVCode();
        if (this._pShaderObject.normalDependencies > 0)
            this.compileNormalCode();
        if (this._pShaderObject.viewDirDependencies > 0)
            this.compileViewDirCode();
        //collect code from material
        this._pVertexCode += this._pRenderableClass._iGetVertexCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._pRenderableClass._iGetFragmentCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
        //collect code from pass
        this._pVertexCode += this._pRenderObject._iGetPreLightingVertexCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._pRenderObject._iGetPreLightingFragmentCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
    };
    ShaderCompilerBase.prototype.compileGlobalPositionCode = function () {
        this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.globalPositionVertex = this._pRegisterCache.getFreeVertexVectorTemp(), this._pShaderObject.globalPosDependencies);
        var sceneMatrixReg = this._pRegisterCache.getFreeVertexConstant();
        this._pRegisterCache.getFreeVertexConstant();
        this._pRegisterCache.getFreeVertexConstant();
        this._pRegisterCache.getFreeVertexConstant();
        this._pShaderObject.sceneMatrixIndex = sceneMatrixReg.index * 4;
        this._pVertexCode += "m44 " + this._pSharedRegisters.globalPositionVertex + ", " + this._pSharedRegisters.localPosition + ", " + sceneMatrixReg + "\n";
        if (this._pShaderObject.usesGlobalPosFragment) {
            this._pSharedRegisters.globalPositionVarying = this._pRegisterCache.getFreeVarying();
            this._pVertexCode += "mov " + this._pSharedRegisters.globalPositionVarying + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
        }
    };
    /**
     * Calculate the (possibly animated) UV coordinates.
     */
    ShaderCompilerBase.prototype.compileUVCode = function () {
        var uvAttributeReg = this._pRegisterCache.getFreeVertexAttribute();
        this._pShaderObject.uvBufferIndex = uvAttributeReg.index;
        var varying = this._pRegisterCache.getFreeVarying();
        this._pSharedRegisters.uvVarying = varying;
        if (this._pShaderObject.usesUVTransform) {
            // a, b, 0, tx
            // c, d, 0, ty
            var uvTransform1 = this._pRegisterCache.getFreeVertexConstant();
            var uvTransform2 = this._pRegisterCache.getFreeVertexConstant();
            this._pShaderObject.uvTransformIndex = uvTransform1.index * 4;
            this._pVertexCode += "dp4 " + varying + ".x, " + uvAttributeReg + ", " + uvTransform1 + "\n" + "dp4 " + varying + ".y, " + uvAttributeReg + ", " + uvTransform2 + "\n" + "mov " + varying + ".zw, " + uvAttributeReg + ".zw \n";
        }
        else {
            this._pShaderObject.uvTransformIndex = -1;
            this._uvTarget = varying.toString();
            this._uvSource = uvAttributeReg.toString();
        }
    };
    /**
     * Provide the secondary UV coordinates.
     */
    ShaderCompilerBase.prototype.compileSecondaryUVCode = function () {
        var uvAttributeReg = this._pRegisterCache.getFreeVertexAttribute();
        this._pShaderObject.secondaryUVBufferIndex = uvAttributeReg.index;
        this._pSharedRegisters.secondaryUVVarying = this._pRegisterCache.getFreeVarying();
        this._pVertexCode += "mov " + this._pSharedRegisters.secondaryUVVarying + ", " + uvAttributeReg + "\n";
    };
    /**
     * Calculate the view direction.
     */
    ShaderCompilerBase.prototype.compileViewDirCode = function () {
        var cameraPositionReg = this._pRegisterCache.getFreeVertexConstant();
        this._pSharedRegisters.viewDirVarying = this._pRegisterCache.getFreeVarying();
        this._pSharedRegisters.viewDirFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
        this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.viewDirFragment, this._pShaderObject.viewDirDependencies);
        this._pShaderObject.cameraPositionIndex = cameraPositionReg.index * 4;
        if (this._pShaderObject.usesTangentSpace) {
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
    ShaderCompilerBase.prototype.compileNormalCode = function () {
        this._pSharedRegisters.normalFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
        this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.normalFragment, this._pShaderObject.normalDependencies);
        //simple normal aquisition if no tangent space is being used
        if (this._pShaderObject.outputsNormals && !this._pShaderObject.outputsTangentNormals) {
            this._pVertexCode += this._pRenderObject._iGetNormalVertexCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
            this._pFragmentCode += this._pRenderObject._iGetNormalFragmentCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
            return;
        }
        var normalMatrix;
        if (!this._pShaderObject.outputsNormals || !this._pShaderObject.usesTangentSpace) {
            normalMatrix = new Array(3);
            normalMatrix[0] = this._pRegisterCache.getFreeVertexConstant();
            normalMatrix[1] = this._pRegisterCache.getFreeVertexConstant();
            normalMatrix[2] = this._pRegisterCache.getFreeVertexConstant();
            this._pRegisterCache.getFreeVertexConstant();
            this._pShaderObject.sceneNormalMatrixIndex = normalMatrix[0].index * 4;
            this._pSharedRegisters.normalVarying = this._pRegisterCache.getFreeVarying();
        }
        if (this._pShaderObject.outputsNormals) {
            if (this._pShaderObject.usesTangentSpace) {
                // normalize normal + tangent vector and generate (approximated) bitangent used in m33 operation for view
                this._pVertexCode += "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + this._pSharedRegisters.animatedNormal + "\n" + "nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + this._pSharedRegisters.animatedTangent + "\n" + "crs " + this._pSharedRegisters.bitangent + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n";
                this._pFragmentCode += this._pRenderObject._iGetNormalFragmentCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters);
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
                this._pFragmentCode += this._pRenderObject._iGetNormalFragmentCode(this._pShaderObject, this._pRegisterCache, this._pSharedRegisters) + "m33 " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalFragment + ", " + t + "\n" + "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";
                this._pRegisterCache.removeFragmentTempUsage(b);
                this._pRegisterCache.removeFragmentTempUsage(t);
                this._pRegisterCache.removeFragmentTempUsage(n);
            }
        }
        else {
            // no output, world space is enough
            this._pVertexCode += "m33 " + this._pSharedRegisters.normalVarying + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" + "mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.animatedNormal + ".w\n";
            this._pFragmentCode += "nrm " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalVarying + "\n" + "mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";
            if (this._pShaderObject.tangentDependencies > 0) {
                this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
                this._pVertexCode += "m33 " + this._pSharedRegisters.tangentVarying + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" + "mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.animatedTangent + ".w\n";
            }
        }
        if (!this._pShaderObject.usesTangentSpace)
            this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedNormal);
    };
    /**
     * Reset all the indices to "unused".
     */
    ShaderCompilerBase.prototype.pInitRegisterIndices = function () {
        this._pShaderObject.pInitRegisterIndices();
        this._pAnimatableAttributes = new Array("va0");
        this._pAnimationTargetRegisters = new Array("vt0");
        this._pVertexCode = "";
        this._pFragmentCode = "";
        this._pPostAnimationFragmentCode = "";
        this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.localPosition = this._pRegisterCache.getFreeVertexVectorTemp(), 1);
        //create commonly shared constant registers
        this._pSharedRegisters.commons = this._pRegisterCache.getFreeFragmentConstant();
        this._pShaderObject.commonsDataIndex = this._pSharedRegisters.commons.index * 4;
        //Creates the registers to contain the tangent data.
        // need to be created FIRST and in this order (for when using tangent space)
        if (this._pShaderObject.tangentDependencies > 0 || this._pShaderObject.outputsNormals) {
            this._pSharedRegisters.tangentInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShaderObject.tangentBufferIndex = this._pSharedRegisters.tangentInput.index;
            this._pSharedRegisters.animatedTangent = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedTangent, 1);
            if (this._pShaderObject.usesTangentSpace) {
                this._pSharedRegisters.bitangent = this._pRegisterCache.getFreeVertexVectorTemp();
                this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.bitangent, 1);
            }
            this._pAnimatableAttributes.push(this._pSharedRegisters.tangentInput.toString());
            this._pAnimationTargetRegisters.push(this._pSharedRegisters.animatedTangent.toString());
        }
        if (this._pShaderObject.normalDependencies > 0) {
            this._pSharedRegisters.normalInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShaderObject.normalBufferIndex = this._pSharedRegisters.normalInput.index;
            this._pSharedRegisters.animatedNormal = this._pRegisterCache.getFreeVertexVectorTemp();
            this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedNormal, 1);
            this._pAnimatableAttributes.push(this._pSharedRegisters.normalInput.toString());
            this._pAnimationTargetRegisters.push(this._pSharedRegisters.animatedNormal.toString());
        }
        if (this._pShaderObject.colorDependencies > 0) {
            this._pSharedRegisters.colorInput = this._pRegisterCache.getFreeVertexAttribute();
            this._pShaderObject.colorBufferIndex = this._pSharedRegisters.colorInput.index;
            this._pSharedRegisters.colorVarying = this._pRegisterCache.getFreeVarying();
            this._pVertexCode += "mov " + this._pSharedRegisters.colorVarying + ", " + this._pSharedRegisters.colorInput + "\n";
        }
    };
    /**
     * Disposes all resources used by the compiler.
     */
    ShaderCompilerBase.prototype.dispose = function () {
        this._pRegisterCache.dispose();
        this._pRegisterCache = null;
        this._pSharedRegisters = null;
    };
    Object.defineProperty(ShaderCompilerBase.prototype, "vertexCode", {
        /**
         * The generated vertex code.
         */
        get: function () {
            return this._pVertexCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderCompilerBase.prototype, "fragmentCode", {
        /**
         * The generated fragment code.
         */
        get: function () {
            return this._pFragmentCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderCompilerBase.prototype, "postAnimationFragmentCode", {
        /**
         * The generated fragment code.
         */
        get: function () {
            return this._pPostAnimationFragmentCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderCompilerBase.prototype, "shadedTarget", {
        /**
         * The register name containing the final shaded colour.
         */
        get: function () {
            return this._pSharedRegisters.shadedTarget.toString();
        },
        enumerable: true,
        configurable: true
    });
    return ShaderCompilerBase;
})();
module.exports = ShaderCompilerBase;


},{"awayjs-renderergl/lib/compilation/ShaderRegisterCache":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterData":undefined}],"awayjs-renderergl/lib/compilation/ShaderLightingCompiler":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderCompilerBase = require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
/**
 * ShaderCompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
var ShaderLightingCompiler = (function (_super) {
    __extends(ShaderLightingCompiler, _super);
    /**
     * Creates a new ShaderCompilerBase object.
     * @param profile The compatibility profile of the renderer.
     */
    function ShaderLightingCompiler(renderableClass, renderObject, shaderObject) {
        _super.call(this, renderableClass, renderObject, shaderObject);
        this._shaderLightingObject = shaderObject;
        this._renderLightingObject = renderObject;
    }
    /**
     * Compile the code for the methods.
     */
    ShaderLightingCompiler.prototype.pCompileDependencies = function () {
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
        this._pVertexCode += this._renderLightingObject._iGetPostLightingVertexCode(this._shaderLightingObject, this._pRegisterCache, this._pSharedRegisters);
        this._pFragmentCode += this._renderLightingObject._iGetPostLightingFragmentCode(this._shaderLightingObject, this._pRegisterCache, this._pSharedRegisters);
    };
    /**
     * Provides the code to provide shadow mapping.
     */
    ShaderLightingCompiler.prototype.pCompileShadowCode = function () {
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
    ShaderLightingCompiler.prototype.initLightRegisters = function () {
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
    ShaderLightingCompiler.prototype.compileLightCode = function () {
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
                this._pFragmentCode += this._renderLightingObject._iGetPerLightDiffuseFragmentCode(this._shaderLightingObject, lightDirReg, diffuseColorReg, this._pRegisterCache, this._pSharedRegisters);
            if (addSpec)
                this._pFragmentCode += this._renderLightingObject._iGetPerLightSpecularFragmentCode(this._shaderLightingObject, lightDirReg, specularColorReg, this._pRegisterCache, this._pSharedRegisters);
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
                this._pFragmentCode += this._renderLightingObject._iGetPerLightDiffuseFragmentCode(this._shaderLightingObject, lightDirReg, diffuseColorReg, this._pRegisterCache, this._pSharedRegisters);
            if (addSpec)
                this._pFragmentCode += this._renderLightingObject._iGetPerLightSpecularFragmentCode(this._shaderLightingObject, lightDirReg, specularColorReg, this._pRegisterCache, this._pSharedRegisters);
            this._pRegisterCache.removeFragmentTempUsage(lightDirReg);
        }
    };
    /**
     * Compiles shading code for light probes.
     */
    ShaderLightingCompiler.prototype.compileLightProbeCode = function () {
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
                this._pFragmentCode += this._renderLightingObject._iGetPerProbeDiffuseFragmentCode(this._shaderLightingObject, texReg, weightReg, this._pRegisterCache, this._pSharedRegisters);
            }
            if (addSpec) {
                texReg = this._pRegisterCache.getFreeTextureReg();
                this._shaderLightingObject.lightProbeSpecularIndices[i] = texReg.index;
                this._pFragmentCode += this._renderLightingObject._iGetPerProbeSpecularFragmentCode(this._shaderLightingObject, texReg, weightReg, this._pRegisterCache, this._pSharedRegisters);
            }
        }
    };
    /**
     * Reset all the indices to "unused".
     */
    ShaderLightingCompiler.prototype.pInitRegisterIndices = function () {
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
    return ShaderLightingCompiler;
})(ShaderCompilerBase);
module.exports = ShaderLightingCompiler;


},{"awayjs-renderergl/lib/compilation/ShaderCompilerBase":undefined}],"awayjs-renderergl/lib/compilation/ShaderLightingObject":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var LightSources = require("awayjs-display/lib/materials/LightSources");
var ContextGLProfile = require("awayjs-stagegl/lib/base/ContextGLProfile");
var ShaderLightingCompiler = require("awayjs-renderergl/lib/compilation/ShaderLightingCompiler");
var ShaderPassMode = require("awayjs-renderergl/lib/compilation/ShaderPassMode");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
/**
 * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
var ShaderLightingObject = (function (_super) {
    __extends(ShaderLightingObject, _super);
    /**
     * Creates a new MethodCompilerVO object.
     */
    function ShaderLightingObject(renderObjectOwner, renderableClass, renderLightingObject, stage) {
        var _this = this;
        _super.call(this, renderObjectOwner, renderableClass, renderLightingObject, stage);
        this._maxLights = 3;
        this._passMode = 0x03;
        this._includeCasters = true;
        this._onLightsChangeDelegate = function (event) { return _this.onLightsChange(event); };
    }
    Object.defineProperty(ShaderLightingObject.prototype, "passMode", {
        /**
         *
         */
        get: function () {
            return this._passMode;
        },
        set: function (value) {
            if (this._passMode == value)
                return;
            this._passMode = value;
            this._updateLightPicker();
            this.invalidateShader();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderLightingObject.prototype, "includeCasters", {
        /**
         * Indicates whether or not shadow casting lights need to be included.
         */
        get: function () {
            return this._includeCasters;
        },
        set: function (value) {
            if (this._includeCasters == value)
                return;
            this._includeCasters = value;
            this.invalidateShader();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderLightingObject.prototype, "lightPicker", {
        get: function () {
            return this._lightPicker;
        },
        set: function (value) {
            if (this._lightPicker)
                this._lightPicker.removeEventListener(Event.CHANGE, this._onLightsChangeDelegate);
            this._lightPicker;
            if (this._lightPicker)
                this._lightPicker.addEventListener(Event.CHANGE, this._onLightsChangeDelegate);
            this._updateLightPicker();
        },
        enumerable: true,
        configurable: true
    });
    ShaderLightingObject.prototype._iIncludeDependencies = function () {
        _super.prototype._iIncludeDependencies.call(this);
        var numAllLights = this.numPointLights + this.numDirectionalLights;
        var numLightProbes = this.numLightProbes;
        var diffuseLightSources = this._renderLightingObject.diffuseLightSources;
        var specularLightSources = this._renderLightingObject._iUsesSpecular() ? this._renderLightingObject.specularLightSources : 0x00;
        var combinedLightSources = diffuseLightSources | specularLightSources;
        this.usesLightFallOff = this._renderLightingObject.enableLightFallOff && this.profile != ContextGLProfile.BASELINE_CONSTRAINED;
        this.numLights = numAllLights + numLightProbes;
        this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources.LIGHTS) != 0;
        this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources.PROBES) != 0;
        this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources.LIGHTS) != 0;
        this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources.PROBES) != 0;
        this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources.LIGHTS) != 0;
        this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources.PROBES) != 0;
        this.usesShadows = this._renderLightingObject._iUsesShadows();
    };
    /**
     * Factory method to create a concrete compiler object for this object
     *
     * @param materialPassVO
     * @returns {away.materials.ShaderLightingCompiler}
     */
    ShaderLightingObject.prototype.createCompiler = function (renderableClass, renderObject) {
        return new ShaderLightingCompiler(renderableClass, renderObject, this);
    };
    /**
     * Clears dependency counts for all registers. Called when recompiling a pass.
     */
    ShaderLightingObject.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.numLights = 0;
        this.usesLightFallOff = true;
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    ShaderLightingObject.prototype._iRender = function (renderable, camera, viewProjection) {
        _super.prototype._iRender.call(this, renderable, camera, viewProjection);
        if (this.usesLights)
            this.updateLights();
        if (this.usesProbes)
            this.updateProbes();
    };
    /**
     * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
     */
    ShaderLightingObject.prototype.updateLights = function () {
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
        var dirLights = this.lightPicker.directionalLights;
        offset = this.directionalLightsOffset;
        len = this.lightPicker.directionalLights.length;
        if (offset > len) {
            cast = 1;
            offset -= len;
        }
        for (; cast < numLightTypes; ++cast) {
            if (cast)
                dirLights = this.lightPicker.castingDirectionalLights;
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
        var pointLights = this.lightPicker.pointLights;
        offset = this.pointLightsOffset;
        len = this.lightPicker.pointLights.length;
        if (offset > len) {
            cast = 1;
            offset -= len;
        }
        else {
            cast = 0;
        }
        for (; cast < numLightTypes; ++cast) {
            if (cast)
                pointLights = this.lightPicker.castingPointLights;
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
    ShaderLightingObject.prototype.updateProbes = function () {
        var probe;
        var lightProbes = this.lightPicker.lightProbes;
        var weights = this.lightPicker.lightProbeWeights;
        var len = lightProbes.length - this.lightProbesOffset;
        var addDiff = this.usesProbesForDiffuse;
        var addSpec = this.usesProbesForSpecular;
        if (!(addDiff || addSpec))
            return;
        if (len > this.numLightProbes)
            len = this.numLightProbes;
        for (var i = 0; i < len; ++i) {
            probe = lightProbes[this.lightProbesOffset + i];
            if (addDiff)
                this._stage.activateCubeTexture(this.lightProbeDiffuseIndices[i], probe.diffuseMap);
            if (addSpec)
                this._stage.activateCubeTexture(this.lightProbeSpecularIndices[i], probe.specularMap);
        }
        for (i = 0; i < len; ++i)
            this.fragmentConstantData[this.probeWeightsIndex + i] = weights[this.lightProbesOffset + i];
    };
    ShaderLightingObject.prototype.onLightsChange = function (event) {
        this._updateLightPicker();
    };
    ShaderLightingObject.prototype._updateLightPicker = function () {
        var numDirectionalLightsOld = this.numDirectionalLights;
        var numPointLightsOld = this.numPointLights;
        var numLightProbesOld = this.numLightProbes;
        if (this._lightPicker && (this.passMode & ShaderPassMode.LIGHTING)) {
            this.numDirectionalLights = this.calculateNumDirectionalLights(this._lightPicker.numDirectionalLights);
            this.numPointLights = this.calculateNumPointLights(this._lightPicker.numPointLights);
            this.numLightProbes = this.calculateNumProbes(this._lightPicker.numLightProbes);
            if (this.includeCasters) {
                this.numDirectionalLights += this._lightPicker.numCastingDirectionalLights;
                this.numPointLights += this._lightPicker.numCastingPointLights;
            }
        }
        else {
            this.numDirectionalLights = 0;
            this.numPointLights = 0;
            this.numLightProbes = 0;
        }
        this.numLights = this.numDirectionalLights + this.numPointLights;
        if (numDirectionalLightsOld != this.numDirectionalLights || numPointLightsOld != this.numPointLights || numLightProbesOld != this.numLightProbes)
            this.invalidateShader();
    };
    /**
     * Calculates the amount of directional lights this material will support.
     * @param numDirectionalLights The maximum amount of directional lights to support.
     * @return The amount of directional lights this material will support, bounded by the amount necessary.
     */
    ShaderLightingObject.prototype.calculateNumDirectionalLights = function (numDirectionalLights) {
        return Math.min(numDirectionalLights - this.directionalLightsOffset, this._maxLights);
    };
    /**
     * Calculates the amount of point lights this material will support.
     * @param numDirectionalLights The maximum amount of point lights to support.
     * @return The amount of point lights this material will support, bounded by the amount necessary.
     */
    ShaderLightingObject.prototype.calculateNumPointLights = function (numPointLights) {
        var numFree = this._maxLights - this.numDirectionalLights;
        return Math.min(numPointLights - this.pointLightsOffset, numFree);
    };
    /**
     * Calculates the amount of light probes this material will support.
     * @param numDirectionalLights The maximum amount of light probes to support.
     * @return The amount of light probes this material will support, bounded by the amount necessary.
     */
    ShaderLightingObject.prototype.calculateNumProbes = function (numLightProbes) {
        var numChannels = 0;
        if ((this._renderLightingObject.specularLightSources & LightSources.PROBES) != 0)
            ++numChannels;
        if ((this._renderLightingObject.diffuseLightSources & LightSources.PROBES) != 0)
            ++numChannels;
        // 4 channels available
        return Math.min(numLightProbes - this.lightProbesOffset, (4 / numChannels) | 0);
    };
    return ShaderLightingObject;
})(ShaderObjectBase);
module.exports = ShaderLightingObject;


},{"awayjs-core/lib/events/Event":undefined,"awayjs-display/lib/materials/LightSources":undefined,"awayjs-renderergl/lib/compilation/ShaderLightingCompiler":undefined,"awayjs-renderergl/lib/compilation/ShaderObjectBase":undefined,"awayjs-renderergl/lib/compilation/ShaderPassMode":undefined,"awayjs-stagegl/lib/base/ContextGLProfile":undefined}],"awayjs-renderergl/lib/compilation/ShaderObjectBase":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var ArgumentError = require("awayjs-core/lib/errors/ArgumentError");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLTriangleFace = require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
var ContextGLBlendFactor = require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
var ShaderCompilerBase = require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
/**
 * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
var ShaderObjectBase = (function (_super) {
    __extends(ShaderObjectBase, _super);
    /**
     * Creates a new MethodCompilerVO object.
     */
    function ShaderObjectBase(renderObjectOwner, renderableClass, renderObject, stage) {
        _super.call(this);
        this.depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._invalidShader = true;
        this._invalidProgram = true;
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        this._enableBlending = false;
        this._blendFactorSource = ContextGLBlendFactor.ONE;
        this._blendFactorDest = ContextGLBlendFactor.ZERO;
        this.writeDepth = true;
        this._defaultCulling = ContextGLTriangleFace.BACK;
        this._pInverseSceneMatrix = new Array();
        //set ambient values to default
        this.ambientR = 0xFF;
        this.ambientG = 0xFF;
        this.ambientB = 0xFF;
        /**
         * Indicates whether there are any dependencies on the world-space position vector.
         */
        this.usesGlobalPosFragment = false;
        this.vertexConstantData = new Array();
        this.fragmentConstantData = new Array();
        this._renderObjectOwner = renderObjectOwner;
        this._renderableClass = renderableClass;
        this._renderObject = renderObject;
        this._stage = stage;
        this.profile = this._stage.profile;
    }
    Object.defineProperty(ShaderObjectBase.prototype, "programData", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._programData;
        },
        enumerable: true,
        configurable: true
    });
    ShaderObjectBase.prototype._iIncludeDependencies = function () {
        this.alphaThreshold = this._renderObjectOwner.alphaThreshold;
        this.useMipmapping = this._renderObjectOwner.mipmap;
        this.useSmoothTextures = this._renderObjectOwner.smooth;
    };
    /**
     * Factory method to create a concrete compiler object for this object
     *
     * @param renderableClass
     * @param renderObject
     * @param stage
     * @returns {ShaderCompilerBase}
     */
    ShaderObjectBase.prototype.createCompiler = function (renderableClass, renderObject) {
        return new ShaderCompilerBase(renderableClass, renderObject, this);
    };
    /**
     * Clears dependency counts for all registers. Called when recompiling a pass.
     */
    ShaderObjectBase.prototype.reset = function () {
        this.projectionDependencies = 0;
        this.normalDependencies = 0;
        this.colorDependencies = 0;
        this.viewDirDependencies = 0;
        this.uvDependencies = 0;
        this.secondaryUVDependencies = 0;
        this.globalPosDependencies = 0;
        this.tangentDependencies = 0;
        this.usesGlobalPosFragment = false;
        this.usesFragmentAnimation = false;
        this.usesTangentSpace = false;
        this.outputsNormals = false;
        this.outputsTangentNormals = false;
    };
    ShaderObjectBase.prototype.pInitRegisterIndices = function () {
        this.commonsDataIndex = -1;
        this.cameraPositionIndex = -1;
        this.uvBufferIndex = -1;
        this.uvTransformIndex = -1;
        this.secondaryUVBufferIndex = -1;
        this.normalBufferIndex = -1;
        this.colorBufferIndex = -1;
        this.tangentBufferIndex = -1;
        this.sceneMatrixIndex = -1;
        this.sceneNormalMatrixIndex = -1;
    };
    /**
     * Initializes the unchanging constant data for this shader object.
     */
    ShaderObjectBase.prototype.initConstantData = function (registerCache, animatableAttributes, animationTargetRegisters, uvSource, uvTarget) {
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
        this.vertexConstantData.length = this.numUsedVertexConstants * 4;
        this.fragmentConstantData.length = this.numUsedFragmentConstants * 4;
        //Initializes commonly required constant values.
        this.fragmentConstantData[this.commonsDataIndex] = .5;
        this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
        this.fragmentConstantData[this.commonsDataIndex + 2] = 1 / 255;
        this.fragmentConstantData[this.commonsDataIndex + 3] = 1;
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
        if (this.cameraPositionIndex >= 0)
            this.vertexConstantData[this.cameraPositionIndex + 3] = 1;
    };
    /**
     * @inheritDoc
     */
    ShaderObjectBase.prototype._iActivate = function (camera) {
        if (this.usesAnimation)
            this._renderObjectOwner.animationSet.activate(this, this._stage);
        this._stage.context.setDepthTest((this.writeDepth && !this._enableBlending), this.depthCompareMode);
        if (this._enableBlending)
            this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
        this._stage.context.setCulling(this.useBothSides ? ContextGLTriangleFace.NONE : this._defaultCulling, camera.projection.coordinateSystem);
        if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
            var pos = camera.scenePosition;
            this.vertexConstantData[this.cameraPositionIndex] = pos.x;
            this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
            this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
        }
    };
    /**
     * @inheritDoc
     */
    ShaderObjectBase.prototype._iDeactivate = function () {
        if (this.usesAnimation)
            this._renderObjectOwner.animationSet.deactivate(this, this._stage);
        this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL); // TODO : imeplement
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    ShaderObjectBase.prototype._iRender = function (renderable, camera, viewProjection) {
        if (renderable.renderableOwner.animator)
            renderable.renderableOwner.animator.setRenderState(this, renderable, this._stage, camera, this.numUsedVertexConstants, this.numUsedStreams);
        if (this.uvBufferIndex >= 0)
            this._stage.activateBuffer(this.uvBufferIndex, renderable.getVertexData(TriangleSubGeometry.UV_DATA), renderable.getVertexOffset(TriangleSubGeometry.UV_DATA), TriangleSubGeometry.UV_FORMAT);
        if (this.secondaryUVBufferIndex >= 0)
            this._stage.activateBuffer(this.secondaryUVBufferIndex, renderable.getVertexData(TriangleSubGeometry.SECONDARY_UV_DATA), renderable.getVertexOffset(TriangleSubGeometry.SECONDARY_UV_DATA), TriangleSubGeometry.SECONDARY_UV_FORMAT);
        if (this.normalBufferIndex >= 0)
            this._stage.activateBuffer(this.normalBufferIndex, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
        if (this.tangentBufferIndex >= 0)
            this._stage.activateBuffer(this.tangentBufferIndex, renderable.getVertexData(TriangleSubGeometry.TANGENT_DATA), renderable.getVertexOffset(TriangleSubGeometry.TANGENT_DATA), TriangleSubGeometry.TANGENT_FORMAT);
        if (this.colorBufferIndex >= 0)
            this._stage.activateBuffer(this.colorBufferIndex, renderable.getVertexData(LineSubGeometry.COLOR_DATA), renderable.getVertexOffset(LineSubGeometry.COLOR_DATA), LineSubGeometry.COLOR_FORMAT);
        if (this.usesUVTransform) {
            var uvTransform = renderable.renderableOwner.uvTransform.matrix;
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
    ShaderObjectBase.prototype.setBlendMode = function (value) {
        switch (value) {
            case BlendMode.NORMAL:
                this._blendFactorSource = ContextGLBlendFactor.ONE;
                this._blendFactorDest = ContextGLBlendFactor.ZERO;
                this._enableBlending = false;
                break;
            case BlendMode.LAYER:
                this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                this._enableBlending = true;
                break;
            case BlendMode.MULTIPLY:
                this._blendFactorSource = ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
                this._enableBlending = true;
                break;
            case BlendMode.ADD:
                this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor.ONE;
                this._enableBlending = true;
                break;
            case BlendMode.ALPHA:
                this._blendFactorSource = ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
                this._enableBlending = true;
                break;
            default:
                throw new ArgumentError("Unsupported blend mode!");
        }
    };
    ShaderObjectBase.prototype.invalidateProgram = function () {
        this._invalidProgram = true;
    };
    ShaderObjectBase.prototype.invalidateShader = function () {
        this._invalidShader = true;
        this._invalidProgram = true;
        this.dispatchEvent(new Event(Event.CHANGE));
    };
    ShaderObjectBase.prototype.dispose = function () {
        this._programData.dispose();
        this._programData = null;
    };
    ShaderObjectBase.prototype._updateProgram = function () {
        this._invalidProgram = false;
        var compiler;
        if (this._invalidShader) {
            this._invalidShader = false;
            compiler = this.createCompiler(this._renderableClass, this._renderObject);
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
    ShaderObjectBase.prototype._calcAnimationCode = function (shadedTarget) {
        //reset code
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        //check to see if GPU animation is used
        if (this.usesAnimation) {
            var animationSet = this._renderObjectOwner.animationSet;
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
    return ShaderObjectBase;
})(EventDispatcher);
module.exports = ShaderObjectBase;


},{"awayjs-core/lib/errors/ArgumentError":undefined,"awayjs-core/lib/events/Event":undefined,"awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-display/lib/base/BlendMode":undefined,"awayjs-display/lib/base/LineSubGeometry":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/compilation/ShaderCompilerBase":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLTriangleFace":undefined}],"awayjs-renderergl/lib/compilation/ShaderPassMode":[function(require,module,exports){
var ShaderPassMode = (function () {
    function ShaderPassMode() {
    }
    ShaderPassMode.EFFECTS = 0x01;
    /**
     *
     */
    ShaderPassMode.LIGHTING = 0x02;
    /**
     *
     */
    ShaderPassMode.SUPER_SHADER = 0x03;
    return ShaderPassMode;
})();
module.exports = ShaderPassMode;


},{}],"awayjs-renderergl/lib/compilation/ShaderRegisterCache":[function(require,module,exports){
var RegisterPool = require("awayjs-renderergl/lib/compilation/RegisterPool");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
/**
 * ShaderRegister Cache provides the usage management system for all registers during shading compilation.
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


},{"awayjs-renderergl/lib/compilation/RegisterPool":undefined,"awayjs-renderergl/lib/compilation/ShaderRegisterElement":undefined}],"awayjs-renderergl/lib/compilation/ShaderRegisterData":[function(require,module,exports){
/**
 * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
 */
var ShaderRegisterData = (function () {
    function ShaderRegisterData() {
    }
    return ShaderRegisterData;
})();
module.exports = ShaderRegisterData;


},{}],"awayjs-renderergl/lib/compilation/ShaderRegisterElement":[function(require,module,exports){
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


},{}],"awayjs-renderergl/lib/compilation/SkyboxRenderObject":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var ContextGLMipFilter = require("awayjs-stagegl/lib/base/ContextGLMipFilter");
var ContextGLTextureFilter = require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
var ContextGLWrapMode = require("awayjs-stagegl/lib/base/ContextGLWrapMode");
var RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
/**
 * SkyboxRenderObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var SkyboxRenderObject = (function (_super) {
    __extends(SkyboxRenderObject, _super);
    function SkyboxRenderObject(pool, renderObjectOwner, renderableClass, stage) {
        _super.call(this, pool, renderObjectOwner, renderableClass, stage);
        this._alphaBlending = false;
        this._alpha = 1;
        this._depthCompareMode = ContextGLCompareMode.LESS_EQUAL;
        this._skybox = renderObjectOwner;
        this._screenShader = new ShaderObjectBase(renderObjectOwner, renderableClass, this, this._stage);
        this._pAddScreenShader(this._screenShader);
    }
    /**
    * @inheritDoc
    */
    SkyboxRenderObject.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        //var cubeMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
        //this._texturesIndex = cubeMapReg.index;
        //ShaderCompilerHelper.getTexCubeSampleCode(sharedRegisters.shadedTarget, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping);
        var mip = ",mipnone";
        if (this._skybox.cubeMap.hasMipmaps)
            mip = ",miplinear";
        return "tex ft0, v0, fs0 <cube," + ShaderCompilerHelper.getFormatStringForTexture(this._skybox.cubeMap) + "linear,clamp" + mip + ">\n";
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderObject.prototype._iActivate = function (shader, camera) {
        _super.prototype._iActivate.call(this, shader, camera);
        var context = this._stage.context;
        context.setSamplerStateAt(0, ContextGLWrapMode.CLAMP, ContextGLTextureFilter.LINEAR, this._skybox.cubeMap.hasMipmaps ? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
        context.setDepthTest(false, ContextGLCompareMode.LESS);
        this._stage.activateCubeTexture(0, this._skybox.cubeMap);
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderObject.prototype._pUpdateRenderObject = function () {
        this.setBlendAndCompareModes();
        this._pClearScreenShaders();
        this._pAddScreenShader(this._screenShader);
    };
    /**
     * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
     */
    SkyboxRenderObject.prototype.setBlendAndCompareModes = function () {
        this._pRequiresBlending = (this._renderObjectOwner.blendMode != BlendMode.NORMAL || this._alphaBlending || this._alpha < 1);
        //this._screenShader.depthCompareMode = this._depthCompareMode;
        //this._screenShader.preserveAlpha = this._pRequiresBlending;
        this._screenShader.setBlendMode((this._renderObjectOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending) ? BlendMode.LAYER : this._renderObjectOwner.blendMode);
        //this._screenShader.forceSeparateMVP = false;
    };
    /**
     *
     */
    SkyboxRenderObject.id = "skybox";
    return SkyboxRenderObject;
})(RenderObjectBase);
module.exports = SkyboxRenderObject;


},{"awayjs-display/lib/base/BlendMode":undefined,"awayjs-renderergl/lib/compilation/RenderObjectBase":undefined,"awayjs-renderergl/lib/compilation/ShaderObjectBase":undefined,"awayjs-renderergl/lib/utils/ShaderCompilerHelper":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLMipFilter":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFilter":undefined,"awayjs-stagegl/lib/base/ContextGLWrapMode":undefined}],"awayjs-renderergl/lib/errors/AnimationSetError":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var AnimationSetError = (function (_super) {
    __extends(AnimationSetError, _super);
    function AnimationSetError(message) {
        _super.call(this, message);
    }
    return AnimationSetError;
})(Error);
module.exports = AnimationSetError;


},{"awayjs-core/lib/errors/Error":undefined}],"awayjs-renderergl/lib/events/AnimationStateEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
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
})(Event);
module.exports = AnimationStateEvent;


},{"awayjs-core/lib/events/Event":undefined}],"awayjs-renderergl/lib/events/AnimatorEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
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
    AnimatorEvent.START = "start";
    /**
     * Defines the value of the type property of a stop event object.
     */
    AnimatorEvent.STOP = "stop";
    /**
     * Defines the value of the type property of a cycle complete event object.
     */
    AnimatorEvent.CYCLE_COMPLETE = "cycle_complete";
    return AnimatorEvent;
})(Event);
module.exports = AnimatorEvent;


},{"awayjs-core/lib/events/Event":undefined}],"awayjs-renderergl/lib/events/ShadingMethodEvent":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var ShadingMethodEvent = (function (_super) {
    __extends(ShadingMethodEvent, _super);
    function ShadingMethodEvent(type) {
        _super.call(this, type);
    }
    ShadingMethodEvent.SHADER_INVALIDATED = "ShaderInvalidated";
    return ShadingMethodEvent;
})(Event);
module.exports = ShadingMethodEvent;


},{"awayjs-core/lib/events/Event":undefined}],"awayjs-renderergl/lib/filters/Filter3DBase":[function(require,module,exports){
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
    Filter3DBase.prototype.pAddTask = function (filter) {
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


},{}],"awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase":[function(require,module,exports){
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLTextureFormat = require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
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
            this.pUpdateTextures(stage);
        return this._mainInputTexture;
    };
    Filter3DTaskBase.prototype.dispose = function () {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        if (this._program3D)
            this._program3D.dispose();
    };
    Filter3DTaskBase.prototype.pInvalidateProgram = function () {
        this._program3DInvalid = true;
    };
    Filter3DTaskBase.prototype.pUpdateProgram = function (stage) {
        if (this._program3D)
            this._program3D.dispose();
        this._program3D = stage.context.createProgram();
        var vertexByteCode = (new AGALMiniAssembler().assemble("part vertex 1\n" + this.pGetVertexCode() + "endpart"))['vertex'].data;
        var fragmentByteCode = (new AGALMiniAssembler().assemble("part fragment 1\n" + this.pGetFragmentCode() + "endpart"))['fragment'].data;
        this._program3D.upload(vertexByteCode, fragmentByteCode);
        this._program3DInvalid = false;
    };
    Filter3DTaskBase.prototype.pGetVertexCode = function () {
        // TODO: imeplement AGAL <> GLSL
        return "mov op, va0\n" + "mov v0, va1\n";
    };
    Filter3DTaskBase.prototype.pGetFragmentCode = function () {
        throw new AbstractMethodError();
        return null;
    };
    Filter3DTaskBase.prototype.pUpdateTextures = function (stage) {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        this._mainInputTexture = stage.context.createTexture(this._scaledTextureWidth, this._scaledTextureHeight, ContextGLTextureFormat.BGRA, true);
        this._textureDimensionsInvalid = false;
    };
    Filter3DTaskBase.prototype.getProgram = function (stage) {
        if (this._program3DInvalid)
            this.pUpdateProgram(stage);
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


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined,"awayjs-stagegl/lib/base/ContextGLTextureFormat":undefined}],"awayjs-renderergl/lib/managers/DefaultMaterialManager":[function(require,module,exports){
var BitmapData = require("awayjs-core/lib/base/BitmapData");
var AssetType = require("awayjs-core/lib/library/AssetType");
var BitmapTexture = require("awayjs-core/lib/textures/BitmapTexture");
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var DefaultMaterialManager = (function () {
    function DefaultMaterialManager() {
    }
    DefaultMaterialManager.getDefaultMaterial = function (renderableOwner) {
        if (renderableOwner === void 0) { renderableOwner = null; }
        if (renderableOwner != null && renderableOwner.assetType == AssetType.LINE_SUB_MESH) {
            if (!DefaultMaterialManager._defaultLineMaterial)
                DefaultMaterialManager.createDefaultLineMaterial();
            return DefaultMaterialManager._defaultLineMaterial;
        }
        else {
            if (!DefaultMaterialManager._defaultTriangleMaterial)
                DefaultMaterialManager.createDefaultTriangleMaterial();
            return DefaultMaterialManager._defaultTriangleMaterial;
        }
    };
    DefaultMaterialManager.getDefaultTexture = function (renderableOwner) {
        if (renderableOwner === void 0) { renderableOwner = null; }
        if (!DefaultMaterialManager._defaultTexture)
            DefaultMaterialManager.createDefaultTexture();
        return DefaultMaterialManager._defaultTexture;
    };
    DefaultMaterialManager.createDefaultTexture = function () {
        DefaultMaterialManager._defaultBitmapData = DefaultMaterialManager.createCheckeredBitmapData();
        DefaultMaterialManager._defaultTexture = new BitmapTexture(DefaultMaterialManager._defaultBitmapData, true);
        DefaultMaterialManager._defaultTexture.name = "defaultTexture";
    };
    DefaultMaterialManager.createCheckeredBitmapData = function () {
        var b = new BitmapData(8, 8, false, 0x000000);
        //create chekerboard
        var i, j;
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                if ((j & 1) ^ (i & 1)) {
                    b.setPixel(i, j, 0XFFFFFF);
                }
            }
        }
        return b;
    };
    DefaultMaterialManager.createDefaultTriangleMaterial = function () {
        if (!DefaultMaterialManager._defaultTexture)
            DefaultMaterialManager.createDefaultTexture();
        DefaultMaterialManager._defaultTriangleMaterial = new BasicMaterial(DefaultMaterialManager._defaultTexture);
        DefaultMaterialManager._defaultTriangleMaterial.mipmap = false;
        DefaultMaterialManager._defaultTriangleMaterial.smooth = false;
        DefaultMaterialManager._defaultTriangleMaterial.name = "defaultTriangleMaterial";
    };
    DefaultMaterialManager.createDefaultLineMaterial = function () {
        DefaultMaterialManager._defaultLineMaterial = new BasicMaterial();
        DefaultMaterialManager._defaultLineMaterial.name = "defaultLineMaterial";
    };
    return DefaultMaterialManager;
})();
module.exports = DefaultMaterialManager;


},{"awayjs-core/lib/base/BitmapData":undefined,"awayjs-core/lib/library/AssetType":undefined,"awayjs-core/lib/textures/BitmapTexture":undefined,"awayjs-display/lib/materials/BasicMaterial":undefined}],"awayjs-renderergl/lib/managers/RTTBufferManager":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var Event = require("awayjs-core/lib/events/Event");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
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
            this._textureWidth = TextureUtils.getBestPowerOf2(this._viewWidth);
            if (this._textureWidth > this._viewWidth) {
                this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth) * .5);
                this._renderToTextureRect.width = this._viewWidth;
            }
            else {
                this._renderToTextureRect.x = 0;
                this._renderToTextureRect.width = this._textureWidth;
            }
            this.dispatchEvent(new Event(Event.RESIZE));
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
            this._textureHeight = TextureUtils.getBestPowerOf2(this._viewHeight);
            if (this._textureHeight > this._viewHeight) {
                this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight) * .5);
                this._renderToTextureRect.height = this._viewHeight;
            }
            else {
                this._renderToTextureRect.y = 0;
                this._renderToTextureRect.height = this._textureHeight;
            }
            this.dispatchEvent(new Event(Event.RESIZE));
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
            this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 5);
        if (this._renderToScreenVertexBuffer == null)
            this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 5);
        if (!this._indexBuffer) {
            this._indexBuffer = context.createIndexBuffer(6);
            this._indexBuffer.uploadFromArray([2, 1, 0, 3, 2, 0], 0, 6);
        }
        this._textureRatioX = x = Math.min(this._viewWidth / this._textureWidth, 1);
        this._textureRatioY = y = Math.min(this._viewHeight / this._textureHeight, 1);
        var u1 = (1 - x) * .5;
        var u2 = (x + 1) * .5;
        var v1 = (y + 1) * .5;
        var v2 = (1 - y) * .5;
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


},{"awayjs-core/lib/events/Event":undefined,"awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/utils/TextureUtils":undefined}],"awayjs-renderergl/lib/pick/JSPickingCollider":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var PickingColliderBase = require("awayjs-renderergl/lib/pick/PickingColliderBase");
/**
 * Pure JS picking collider for display objects. Used with the <code>RaycastPicker</code> picking object.
 *
 * @see away.base.DisplayObject#pickingCollider
 * @see away.pick.RaycastPicker
 *
 * @class away.pick.JSPickingCollider
 */
var JSPickingCollider = (function (_super) {
    __extends(JSPickingCollider, _super);
    /**
     * Creates a new <code>JSPickingCollider</code> object.
     *
     * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
     */
    function JSPickingCollider(stage, findClosestCollision) {
        if (findClosestCollision === void 0) { findClosestCollision = false; }
        _super.call(this, stage);
        this._findClosestCollision = findClosestCollision;
    }
    /**
     * @inheritDoc
     */
    JSPickingCollider.prototype._pTestRenderableCollision = function (renderable, pickingCollisionVO, shortestCollisionDistance) {
        var t;
        var i0, i1, i2;
        var rx, ry, rz;
        var nx, ny, nz;
        var cx, cy, cz;
        var coeff, u, v, w;
        var p0x, p0y, p0z;
        var p1x, p1y, p1z;
        var p2x, p2y, p2z;
        var s0x, s0y, s0z;
        var s1x, s1y, s1z;
        var nl, nDotV, D, disToPlane;
        var Q1Q2, Q1Q1, Q2Q2, RQ1, RQ2;
        var indexData = renderable.getIndexData().data;
        var collisionTriangleIndex = -1;
        var bothSides = renderable.renderObjectOwner.bothSides;
        var positionData = renderable.getVertexData(TriangleSubGeometry.POSITION_DATA).data;
        var positionStride = renderable.getVertexData(TriangleSubGeometry.POSITION_DATA).dataPerVertex;
        var positionOffset = renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA);
        var uvData = renderable.getVertexData(TriangleSubGeometry.UV_DATA).data;
        var uvStride = renderable.getVertexData(TriangleSubGeometry.UV_DATA).dataPerVertex;
        var uvOffset = renderable.getVertexOffset(TriangleSubGeometry.UV_DATA);
        var numIndices = indexData.length;
        for (var index = 0; index < numIndices; index += 3) {
            // evaluate triangle indices
            i0 = positionOffset + indexData[index] * positionStride;
            i1 = positionOffset + indexData[(index + 1)] * positionStride;
            i2 = positionOffset + indexData[(index + 2)] * positionStride;
            // evaluate triangle positions
            p0x = positionData[i0];
            p0y = positionData[(i0 + 1)];
            p0z = positionData[(i0 + 2)];
            p1x = positionData[i1];
            p1y = positionData[(i1 + 1)];
            p1z = positionData[(i1 + 2)];
            p2x = positionData[i2];
            p2y = positionData[(i2 + 1)];
            p2z = positionData[(i2 + 2)];
            // evaluate sides and triangle normal
            s0x = p1x - p0x; // s0 = p1 - p0
            s0y = p1y - p0y;
            s0z = p1z - p0z;
            s1x = p2x - p0x; // s1 = p2 - p0
            s1y = p2y - p0y;
            s1z = p2z - p0z;
            nx = s0y * s1z - s0z * s1y; // n = s0 x s1
            ny = s0z * s1x - s0x * s1z;
            nz = s0x * s1y - s0y * s1x;
            nl = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz); // normalize n
            nx *= nl;
            ny *= nl;
            nz *= nl;
            // -- plane intersection test --
            nDotV = nx * this.rayDirection.x + ny * +this.rayDirection.y + nz * this.rayDirection.z; // rayDirection . normal
            if ((!bothSides && nDotV < 0.0) || (bothSides && nDotV != 0.0)) {
                // find collision t
                D = -(nx * p0x + ny * p0y + nz * p0z);
                disToPlane = -(nx * this.rayPosition.x + ny * this.rayPosition.y + nz * this.rayPosition.z + D);
                t = disToPlane / nDotV;
                // find collision point
                cx = this.rayPosition.x + t * this.rayDirection.x;
                cy = this.rayPosition.y + t * this.rayDirection.y;
                cz = this.rayPosition.z + t * this.rayDirection.z;
                // collision point inside triangle? ( using barycentric coordinates )
                Q1Q2 = s0x * s1x + s0y * s1y + s0z * s1z;
                Q1Q1 = s0x * s0x + s0y * s0y + s0z * s0z;
                Q2Q2 = s1x * s1x + s1y * s1y + s1z * s1z;
                rx = cx - p0x;
                ry = cy - p0y;
                rz = cz - p0z;
                RQ1 = rx * s0x + ry * s0y + rz * s0z;
                RQ2 = rx * s1x + ry * s1y + rz * s1z;
                coeff = 1 / (Q1Q1 * Q2Q2 - Q1Q2 * Q1Q2);
                v = coeff * (Q2Q2 * RQ1 - Q1Q2 * RQ2);
                w = coeff * (-Q1Q2 * RQ1 + Q1Q1 * RQ2);
                if (v < 0)
                    continue;
                if (w < 0)
                    continue;
                u = 1 - v - w;
                if (!(u < 0) && t > 0 && t < shortestCollisionDistance) {
                    shortestCollisionDistance = t;
                    collisionTriangleIndex = index / 3;
                    pickingCollisionVO.rayEntryDistance = t;
                    pickingCollisionVO.localPosition = new Vector3D(cx, cy, cz);
                    pickingCollisionVO.localNormal = new Vector3D(nx, ny, nz);
                    pickingCollisionVO.uv = this._pGetCollisionUV(indexData, uvData, index, v, w, u, uvOffset, uvStride);
                    pickingCollisionVO.index = index;
                    //						pickingCollisionVO.subGeometryIndex = this.pGetMeshSubMeshIndex(renderable);
                    // if not looking for best hit, first found will do...
                    if (!this._findClosestCollision)
                        return true;
                }
            }
        }
        if (collisionTriangleIndex >= 0)
            return true;
        return false;
    };
    return JSPickingCollider;
})(PickingColliderBase);
module.exports = JSPickingCollider;


},{"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/pick/PickingColliderBase":undefined}],"awayjs-renderergl/lib/pick/PickingColliderBase":[function(require,module,exports){
var Point = require("awayjs-core/lib/geom/Point");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var BillboardRenderable = require("awayjs-renderergl/lib/pool/BillboardRenderable");
var TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
var RenderablePool = require("awayjs-renderergl/lib/pool/RenderablePool");
/**
 * An abstract base class for all picking collider classes. It should not be instantiated directly.
 *
 * @class away.pick.PickingColliderBase
 */
var PickingColliderBase = (function () {
    function PickingColliderBase(stage) {
        this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable, stage);
        this._subMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable, stage);
    }
    PickingColliderBase.prototype._pPetCollisionNormal = function (indexData /*uint*/, vertexData, triangleIndex) {
        var normal = new Vector3D();
        var i0 = indexData[triangleIndex] * 3;
        var i1 = indexData[triangleIndex + 1] * 3;
        var i2 = indexData[triangleIndex + 2] * 3;
        var p0 = new Vector3D(vertexData[i0], vertexData[i0 + 1], vertexData[i0 + 2]);
        var p1 = new Vector3D(vertexData[i1], vertexData[i1 + 1], vertexData[i1 + 2]);
        var p2 = new Vector3D(vertexData[i2], vertexData[i2 + 1], vertexData[i2 + 2]);
        var side0 = p1.subtract(p0);
        var side1 = p2.subtract(p0);
        normal = side0.crossProduct(side1);
        normal.normalize();
        return normal;
    };
    PickingColliderBase.prototype._pGetCollisionUV = function (indexData /*uint*/, uvData, triangleIndex, v, w, u, uvOffset, uvStride) {
        var uv = new Point();
        var uIndex = indexData[triangleIndex] * uvStride + uvOffset;
        var uv0 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uIndex = indexData[triangleIndex + 1] * uvStride + uvOffset;
        var uv1 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uIndex = indexData[triangleIndex + 2] * uvStride + uvOffset;
        var uv2 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uv.x = u * uv0.x + v * uv1.x + w * uv2.x;
        uv.y = u * uv0.y + v * uv1.y + w * uv2.y;
        return uv;
    };
    /**
     * @inheritDoc
     */
    PickingColliderBase.prototype._pTestRenderableCollision = function (renderable, pickingCollisionVO, shortestCollisionDistance) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    PickingColliderBase.prototype.setLocalRay = function (localPosition, localDirection) {
        this.rayPosition = localPosition;
        this.rayDirection = localDirection;
    };
    /**
     * Tests a <code>Billboard</code> object for a collision with the picking ray.
     *
     * @param billboard The billboard instance to be tested.
     * @param pickingCollisionVO The collision object used to store the collision results
     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
     * @param findClosest
     */
    PickingColliderBase.prototype.testBillboardCollision = function (billboard, pickingCollisionVO, shortestCollisionDistance) {
        this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
        pickingCollisionVO.renderableOwner = null;
        if (this._pTestRenderableCollision(this._billboardRenderablePool.getItem(billboard), pickingCollisionVO, shortestCollisionDistance)) {
            shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
            pickingCollisionVO.renderableOwner = billboard;
            return true;
        }
        return false;
    };
    /**
     * Tests a <code>Mesh</code> object for a collision with the picking ray.
     *
     * @param mesh The mesh instance to be tested.
     * @param pickingCollisionVO The collision object used to store the collision results
     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
     * @param findClosest
     */
    PickingColliderBase.prototype.testMeshCollision = function (mesh, pickingCollisionVO, shortestCollisionDistance, findClosest) {
        this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
        pickingCollisionVO.renderableOwner = null;
        var subMesh;
        var len = mesh.subMeshes.length;
        for (var i = 0; i < len; ++i) {
            subMesh = mesh.subMeshes[i];
            if (this._pTestRenderableCollision(this._subMeshRenderablePool.getItem(subMesh), pickingCollisionVO, shortestCollisionDistance)) {
                shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
                pickingCollisionVO.renderableOwner = subMesh;
                if (!findClosest)
                    return true;
            }
        }
        return pickingCollisionVO.renderableOwner != null;
    };
    return PickingColliderBase;
})();
module.exports = PickingColliderBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-renderergl/lib/pool/BillboardRenderable":undefined,"awayjs-renderergl/lib/pool/RenderablePool":undefined,"awayjs-renderergl/lib/pool/TriangleSubMeshRenderable":undefined}],"awayjs-renderergl/lib/pick/ShaderPicker":[function(require,module,exports){
var Debug = require("awayjs-core/lib/utils/Debug");
var BitmapData = require("awayjs-core/lib/base/BitmapData");
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var Point = require("awayjs-core/lib/geom/Point");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
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
        this._id = new Array(4);
        this._viewportData = new Array(4); // first 2 contain scale, last 2 translation
        this._boundOffsetScale = new Array(8); // first 2 contain scale, last 2 translation
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
        if (!this._bitmapData)
            this._bitmapData = new BitmapData(1, 1, false, 0);
        this._context.drawToBitmapData(this._bitmapData);
        this._hitColor = this._bitmapData.getPixel(0, 0);
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
            this._context.setCulling(renderable.renderObjectOwner.bothSides ? ContextGLTriangleFace.NONE : ContextGLTriangleFace.BACK, camera.projection.coordinateSystem);
            this._interactives[this._interactiveId++] = renderable;
            // color code so that reading from bitmapdata will contain the correct value
            this._id[1] = (this._interactiveId >> 8) / 255; // on green channel
            this._id[2] = (this._interactiveId & 0xff) / 255; // on blue channel
            matrix.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
            matrix.append(viewProjection);
            this._context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
            this._context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._id, 1);
            this._stage.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
            this._context.drawTriangles(this._stage.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
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
        var bounds = this._hitRenderable.sourceEntity.bounds.aabb;
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
        this._stage.activateBuffer(0, this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA), this._hitRenderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        this._context.drawTriangles(this._stage.getIndexBuffer(this._hitRenderable.getIndexData()), 0, this._hitRenderable.numTriangles);
        this._context.drawToBitmapData(this._bitmapData);
        col = this._bitmapData.getPixel(0, 0);
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
        var indices = this._hitRenderable.getIndexData().data;
        var positions = this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA).data;
        var positionStride = this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA).dataPerVertex;
        var positionOffset = this._hitRenderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA);
        var uvs = this._hitRenderable.getVertexData(TriangleSubGeometry.UV_DATA).data;
        var uvStride = this._hitRenderable.getVertexData(TriangleSubGeometry.UV_DATA).dataPerVertex;
        var uvOffset = this._hitRenderable.getVertexOffset(TriangleSubGeometry.UV_DATA);
        var normals = this._hitRenderable.getVertexData(TriangleSubGeometry.NORMAL_DATA).data;
        var normalStride = this._hitRenderable.getVertexData(TriangleSubGeometry.NORMAL_DATA).dataPerVertex;
        var normalOffset = this._hitRenderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA);
        this.updateRay(camera);
        while (i < len) {
            t1 = positionOffset + indices[i] * positionStride;
            t2 = positionOffset + indices[j] * positionStride;
            t3 = positionOffset + indices[k] * positionStride;
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
                    ni1 = normalOffset + indices[i] * normalStride;
                    ni2 = normalOffset + indices[j] * normalStride;
                    ni3 = normalOffset + indices[k] * normalStride;
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
                    ui1 = uvOffset + indices[i] * uvStride;
                    ui2 = uvOffset + indices[j] * uvStride;
                    ui3 = uvOffset + indices[k] * uvStride;
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
        this._bitmapData.dispose();
        if (this._triangleProgram)
            this._triangleProgram.dispose();
        if (this._objectProgram)
            this._objectProgram.dispose();
        this._triangleProgram = null;
        this._objectProgram = null;
        this._bitmapData = null;
        this._hitRenderable = null;
        this._hitEntity = null;
    };
    ShaderPicker.MOUSE_SCISSOR_RECT = new Rectangle(0, 0, 1, 1);
    return ShaderPicker;
})();
module.exports = ShaderPicker;


},{"awayjs-core/lib/base/BitmapData":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-core/lib/utils/Debug":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler":undefined,"awayjs-stagegl/lib/base/ContextGLBlendFactor":undefined,"awayjs-stagegl/lib/base/ContextGLClearMask":undefined,"awayjs-stagegl/lib/base/ContextGLCompareMode":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined,"awayjs-stagegl/lib/base/ContextGLTriangleFace":undefined}],"awayjs-renderergl/lib/pool/BillboardRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
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
    function BillboardRenderable(pool, billboard, stage) {
        _super.call(this, pool, billboard, billboard, billboard.material, stage);
        this._billboard = billboard;
    }
    /**
     * //TODO
     *
     * @returns {away.base.TriangleSubGeometry}
     */
    BillboardRenderable.prototype._pGetSubGeometry = function () {
        var material = this._billboard.material;
        var geometry = BillboardRenderable._materialGeometry[material.id];
        if (!geometry) {
            geometry = BillboardRenderable._materialGeometry[material.id] = new TriangleSubGeometry(true);
            geometry.autoDeriveNormals = false;
            geometry.autoDeriveTangents = false;
            geometry.updateIndices(Array(0, 1, 2, 0, 2, 3));
            geometry.updatePositions(Array(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
            geometry.updateVertexNormals(Array(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
            geometry.updateVertexTangents(Array(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
            geometry.updateUVs(Array(0, 0, 1, 0, 1, 1, 0, 1));
        }
        else {
            geometry.updatePositions(Array(0, material.height, 0, material.width, material.height, 0, material.width, 0, 0, 0, 0, 0));
        }
        this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;
        this._pVertexDataDirty[TriangleSubGeometry.NORMAL_DATA] = true;
        this._pVertexDataDirty[TriangleSubGeometry.TANGENT_DATA] = true;
        this._pVertexDataDirty[TriangleSubGeometry.UV_DATA] = true;
        return geometry;
    };
    BillboardRenderable._iIncludeDependencies = function (shaderObject) {
    };
    BillboardRenderable._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shaderObject.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shaderObject.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shaderObject.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    BillboardRenderable.prototype._iRender = function (shader, camera, viewProjection) {
        _super.prototype._iRender.call(this, shader, camera, viewProjection);
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
        this._stage.activateBuffer(0, this.getVertexData(TriangleSubGeometry.POSITION_DATA), this.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        this._stage.context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
    };
    BillboardRenderable._materialGeometry = new Object();
    /**
     *
     */
    BillboardRenderable.id = "billboard";
    BillboardRenderable.vertexAttributesOffset = 1;
    return BillboardRenderable;
})(RenderableBase);
module.exports = BillboardRenderable;


},{"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/pool/RenderableBase":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/pool/IRenderableClass":[function(require,module,exports){



},{}],"awayjs-renderergl/lib/pool/LineSubMeshRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
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
    function LineSubMeshRenderable(pool, subMesh, stage, level, indexOffset) {
        if (level === void 0) { level = 0; }
        if (indexOffset === void 0) { indexOffset = 0; }
        _super.call(this, pool, subMesh.parentMesh, subMesh, subMesh.material, stage, level, indexOffset);
        this._constants = new Array(0, 0, 0, 0);
        this._thickness = 1.25;
        this.subMesh = subMesh;
        this._calcMatrix = new Matrix3D();
        this._constants[1] = 1 / 255;
    }
    /**
     * //TODO
     *
     * @returns {base.LineSubGeometry}
     * @protected
     */
    LineSubMeshRenderable.prototype._pGetSubGeometry = function () {
        var subGeometry = this.subMesh.subGeometry;
        this._pVertexDataDirty[LineSubGeometry.START_POSITION_DATA] = true;
        this._pVertexDataDirty[LineSubGeometry.END_POSITION_DATA] = true;
        if (subGeometry.thickness)
            this._pVertexDataDirty[LineSubGeometry.THICKNESS_DATA] = true;
        if (subGeometry.startColors)
            this._pVertexDataDirty[LineSubGeometry.COLOR_DATA] = true;
        return subGeometry;
    };
    LineSubMeshRenderable._iIncludeDependencies = function (shaderObject) {
        shaderObject.colorDependencies++;
    };
    /**
     * @inheritDoc
     */
    LineSubMeshRenderable._iGetVertexCode = function (shader, regCache, sharedReg) {
        return "m44 vt0, va0, vc8			\n" + "m44 vt1, va1, vc8			\n" + "sub vt2, vt1, vt0 			\n" + "slt vt5.x, vt0.z, vc7.z			\n" + "sub vt5.y, vc5.x, vt5.x			\n" + "add vt4.x, vt0.z, vc7.z			\n" + "sub vt4.y, vt0.z, vt1.z			\n" + "seq vt4.z, vt4.y vc6.x			\n" + "add vt4.y, vt4.y, vt4.z			\n" + "div vt4.z, vt4.x, vt4.y			\n" + "mul vt4.xyz, vt4.zzz, vt2.xyz	\n" + "add vt3.xyz, vt0.xyz, vt4.xyz	\n" + "mov vt3.w, vc5.x			\n" + "mul vt0, vt0, vt5.yyyy			\n" + "mul vt3, vt3, vt5.xxxx			\n" + "add vt0, vt0, vt3				\n" + "sub vt2, vt1, vt0 			\n" + "nrm vt2.xyz, vt2.xyz			\n" + "nrm vt5.xyz, vt0.xyz			\n" + "mov vt5.w, vc5.x				\n" + "crs vt3.xyz, vt2, vt5			\n" + "nrm vt3.xyz, vt3.xyz			\n" + "mul vt3.xyz, vt3.xyz, va2.xxx	\n" + "mov vt3.w, vc5.x			\n" + "dp3 vt4.x, vt0, vc6			\n" + "mul vt4.x, vt4.x, vc7.x			\n" + "mul vt3.xyz, vt3.xyz, vt4.xxx	\n" + "add vt0.xyz, vt0.xyz, vt3.xyz	\n" + "m44 op, vt0, vc0			\n"; // transform Q0 to clip space
    };
    /**
     * @inheritDoc
     */
    LineSubMeshRenderable.prototype._iActivate = function (shader, camera) {
        _super.prototype._iActivate.call(this, shader, camera);
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
    LineSubMeshRenderable.prototype._iRender = function (shader, camera, viewProjection) {
        _super.prototype._iRender.call(this, shader, camera, viewProjection);
        var context = this._stage.context;
        this._calcMatrix.copyFrom(this.sourceEntity.sceneTransform);
        this._calcMatrix.append(camera.inverseSceneTransform);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 8, this._calcMatrix, true);
        this._stage.activateBuffer(0, this.getVertexData(LineSubGeometry.START_POSITION_DATA), this.getVertexOffset(LineSubGeometry.START_POSITION_DATA), LineSubGeometry.POSITION_FORMAT);
        this._stage.activateBuffer(1, this.getVertexData(LineSubGeometry.END_POSITION_DATA), this.getVertexOffset(LineSubGeometry.END_POSITION_DATA), LineSubGeometry.POSITION_FORMAT);
        this._stage.activateBuffer(2, this.getVertexData(LineSubGeometry.THICKNESS_DATA), this.getVertexOffset(LineSubGeometry.THICKNESS_DATA), LineSubGeometry.THICKNESS_FORMAT);
        context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
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
    LineSubMeshRenderable.prototype._pGetOverflowRenderable = function (indexOffset) {
        return new LineSubMeshRenderable(this._pool, this.renderableOwner, this._stage, this._level + 1, indexOffset);
    };
    LineSubMeshRenderable.pONE_VECTOR = Array(1, 1, 1, 1);
    LineSubMeshRenderable.pFRONT_VECTOR = Array(0, 0, -1, 0);
    /**
     *
     */
    LineSubMeshRenderable.id = "linesubmesh";
    LineSubMeshRenderable.vertexAttributesOffset = 3;
    return LineSubMeshRenderable;
})(RenderableBase);
module.exports = LineSubMeshRenderable;


},{"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-display/lib/base/LineSubGeometry":undefined,"awayjs-renderergl/lib/pool/RenderableBase":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/pool/RenderableBase":[function(require,module,exports){
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var SubGeometryBase = require("awayjs-display/lib/base/SubGeometryBase");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var IndexDataPool = require("awayjs-stagegl/lib/pool/IndexDataPool");
var VertexDataPool = require("awayjs-stagegl/lib/pool/VertexDataPool");
/**
 * @class RenderableListItem
 */
var RenderableBase = (function () {
    /**
     *
     * @param sourceEntity
     * @param renderableOwner
     * @param subGeometry
     * @param animationSubGeometry
     */
    function RenderableBase(pool, sourceEntity, renderableOwner, renderObjectOwner, stage, level, indexOffset) {
        var _this = this;
        if (level === void 0) { level = 0; }
        if (indexOffset === void 0) { indexOffset = 0; }
        this._geometryDirty = true;
        this._indexDataDirty = true;
        this._vertexData = new Object();
        this._pVertexDataDirty = new Object();
        this._vertexOffset = new Object();
        this._onIndicesUpdatedDelegate = function (event) { return _this._onIndicesUpdated(event); };
        this._onVerticesUpdatedDelegate = function (event) { return _this._onVerticesUpdated(event); };
        //store a reference to the pool for later disposal
        this._pool = pool;
        this._stage = stage;
        //reference to level of overflow
        this._level = level;
        //reference to the offset on indices (if this is an overflow renderable)
        this._indexOffset = indexOffset;
        this.sourceEntity = sourceEntity;
        this.renderableOwner = renderableOwner;
        this.renderObjectOwner = renderObjectOwner;
    }
    Object.defineProperty(RenderableBase.prototype, "overflow", {
        /**
         *
         */
        get: function () {
            if (this._indexDataDirty)
                this._updateIndexData();
            return this._overflow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderableBase.prototype, "numTriangles", {
        /**
         *
         */
        get: function () {
            return this._numTriangles;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    RenderableBase.prototype.getIndexData = function () {
        if (this._indexDataDirty)
            this._updateIndexData();
        return this._indexData;
    };
    /**
     *
     */
    RenderableBase.prototype.getVertexData = function (dataType) {
        if (this._indexDataDirty)
            this._updateIndexData();
        if (this._pVertexDataDirty[dataType])
            this._updateVertexData(dataType);
        return this._vertexData[this._concatenateArrays ? TriangleSubGeometry.VERTEX_DATA : dataType];
    };
    /**
     *
     */
    RenderableBase.prototype.getVertexOffset = function (dataType) {
        if (this._indexDataDirty)
            this._updateIndexData();
        if (this._pVertexDataDirty[dataType])
            this._updateVertexData(dataType);
        return this._vertexOffset[dataType];
    };
    RenderableBase.prototype.dispose = function () {
        this._pool.disposeItem(this.renderableOwner);
        this._indexData.dispose();
        this._indexData = null;
        for (var dataType in this._vertexData) {
            this._vertexData[dataType].dispose();
            this._vertexData[dataType] = null;
        }
        if (this._overflow) {
            this._overflow.dispose();
            this._overflow = null;
        }
    };
    RenderableBase.prototype.invalidateGeometry = function () {
        this._geometryDirty = true;
        //invalidate indices
        if (this._level == 0)
            this._indexDataDirty = true;
        if (this._overflow)
            this._overflow.invalidateGeometry();
    };
    /**
     *
     */
    RenderableBase.prototype.invalidateIndexData = function () {
        this._indexDataDirty = true;
    };
    /**
     * //TODO
     *
     * @param dataType
     */
    RenderableBase.prototype.invalidateVertexData = function (dataType) {
        this._pVertexDataDirty[dataType] = true;
    };
    RenderableBase.prototype._pGetSubGeometry = function () {
        throw new AbstractMethodError();
    };
    RenderableBase._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    RenderableBase._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    /**
     * //TODO
     *
     * @param subGeometry
     * @param offset
     * @internal
     */
    RenderableBase.prototype._iFillIndexData = function (indexOffset) {
        if (this._geometryDirty)
            this._updateGeometry();
        this._indexData = IndexDataPool.getItem(this._subGeometry, this._level, indexOffset);
        this._numTriangles = this._indexData.data.length / 3;
        indexOffset = this._indexData.offset;
        //check if there is more to split
        if (indexOffset < this._subGeometry.indices.length) {
            if (!this._overflow)
                this._overflow = this._pGetOverflowRenderable(indexOffset);
            this._overflow._iFillIndexData(indexOffset);
        }
        else if (this._overflow) {
            this._overflow.dispose();
            this._overflow = null;
        }
    };
    RenderableBase.prototype._pGetOverflowRenderable = function (indexOffset) {
        throw new AbstractMethodError();
    };
    /**
     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
     * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
     * @param stage The Stage object which is currently used for rendering.
     * @param camera The camera from which the scene is viewed.
     * @private
     */
    RenderableBase.prototype._iActivate = function (shader, camera) {
        this.renderObject._iActivate(shader, camera);
    };
    /**
     * Renders an object to the current render target.
     *
     * @private
     */
    RenderableBase.prototype._iRender = function (shader, camera, viewProjection) {
        this.renderObject._iRender(this, shader, camera, viewProjection);
    };
    /**
     * Clears the render state for the pass. This needs to be called before activating another pass.
     * @param stage The Stage used for rendering
     *
     * @private
     */
    RenderableBase.prototype._iDeactivate = function (shader) {
        this.renderObject._iDeactivate(shader);
    };
    /**
     * //TODO
     *
     * @private
     */
    RenderableBase.prototype._updateGeometry = function () {
        if (this._subGeometry) {
            if (this._level == 0)
                this._subGeometry.removeEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
            this._subGeometry.removeEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
        }
        this._subGeometry = this._pGetSubGeometry();
        this._concatenateArrays = this._subGeometry.concatenateArrays;
        if (this._subGeometry) {
            if (this._level == 0)
                this._subGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdatedDelegate);
            this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
        }
        //dispose
        //			if (this._indexData) {
        //				this._indexData.dispose(); //TODO where is a good place to dispose?
        //				this._indexData = null;
        //			}
        //			for (var dataType in this._vertexData) {
        //				(<VertexData> this._vertexData[dataType]).dispose(); //TODO where is a good place to dispose?
        //				this._vertexData[dataType] = null;
        //			}
        this._geometryDirty = false;
        //specific vertex data types have to be invalidated in the specific renderable
    };
    /**
     * //TODO
     *
     * @private
     */
    RenderableBase.prototype._updateIndexData = function () {
        this._iFillIndexData(this._indexOffset);
        this._indexDataDirty = false;
    };
    /**
     * //TODO
     *
     * @param dataType
     * @private
     */
    RenderableBase.prototype._updateVertexData = function (dataType) {
        this._vertexOffset[dataType] = this._subGeometry.getOffset(dataType);
        if (this._subGeometry.concatenateArrays)
            dataType = SubGeometryBase.VERTEX_DATA;
        this._vertexData[dataType] = VertexDataPool.getItem(this._subGeometry, this.getIndexData(), dataType);
        this._pVertexDataDirty[dataType] = false;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    RenderableBase.prototype._onIndicesUpdated = function (event) {
        this.invalidateIndexData();
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    RenderableBase.prototype._onVerticesUpdated = function (event) {
        this._concatenateArrays = event.target.concatenateArrays;
        this.invalidateVertexData(event.dataType);
    };
    return RenderableBase;
})();
module.exports = RenderableBase;


},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-display/lib/base/SubGeometryBase":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-display/lib/events/SubGeometryEvent":undefined,"awayjs-stagegl/lib/pool/IndexDataPool":undefined,"awayjs-stagegl/lib/pool/VertexDataPool":undefined}],"awayjs-renderergl/lib/pool/RenderablePool":[function(require,module,exports){
var RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
var RenderBasicMaterialObject = require("awayjs-renderergl/lib/compilation/RenderBasicMaterialObject");
var SkyboxRenderObject = require("awayjs-renderergl/lib/compilation/SkyboxRenderObject");
var DepthRenderObject = require("awayjs-renderergl/lib/compilation/DepthRenderObject");
var DistanceRenderObject = require("awayjs-renderergl/lib/compilation/DistanceRenderObject");
/**
 * @class away.pool.RenderablePool
 */
var RenderablePool = (function () {
    /**
     * //TODO
     *
     * @param renderableClass
     */
    function RenderablePool(renderableClass, stage) {
        this._renderablePool = new Object();
        this._renderableClass = renderableClass;
        this._stage = stage;
        this._materialRenderObjectPool = new RenderObjectPool(RenderBasicMaterialObject, this._renderableClass, this._stage);
        this._skyboxRenderObjectPool = new RenderObjectPool(SkyboxRenderObject, this._renderableClass, this._stage);
        this._depthRenderObjectPool = new RenderObjectPool(DepthRenderObject, this._renderableClass, this._stage);
        this._distanceRenderObjectPool = new RenderObjectPool(DistanceRenderObject, this._renderableClass, this._stage);
    }
    /**
     * //TODO
     *
     * @param renderableOwner
     * @returns IRenderable
     */
    RenderablePool.prototype.getItem = function (renderableOwner) {
        return (this._renderablePool[renderableOwner.id] || (this._renderablePool[renderableOwner.id] = renderableOwner._iAddRenderable(new this._renderableClass(this, renderableOwner, this._stage))));
    };
    /**
     *
     * @param material
     * @param renderable
     */
    RenderablePool.prototype.getMaterialRenderObject = function (renderObjectOwner) {
        return this._materialRenderObjectPool.getItem(renderObjectOwner);
    };
    /**
     *
     * @param material
     * @param renderable
     */
    RenderablePool.prototype.getSkyboxRenderObject = function (renderObjectOwner) {
        return this._skyboxRenderObjectPool.getItem(renderObjectOwner);
    };
    /**
     *
     * @param material
     * @param renderable
     */
    RenderablePool.prototype.getDepthRenderObject = function (renderObjectOwner) {
        return this._depthRenderObjectPool.getItem(renderObjectOwner);
    };
    /**
     *
     * @param material
     * @param renderable
     */
    RenderablePool.prototype.getDistanceRenderObject = function (renderObjectOwner) {
        return this._distanceRenderObjectPool.getItem(renderObjectOwner);
    };
    /**
     * //TODO
     *
     * @param renderableOwner
     */
    RenderablePool.prototype.disposeItem = function (renderableOwner) {
        renderableOwner._iRemoveRenderable(this._renderablePool[renderableOwner.id]);
        this._renderablePool[renderableOwner.id] = null;
    };
    RenderablePool.prototype.dispose = function () {
        for (var id in this._renderablePool)
            this._renderablePool[id].dispose();
        RenderablePool.disposePool(this._renderableClass, this._stage);
    };
    /**
     * //TODO
     *
     * @param renderableClass
     * @returns RenderablePool
     */
    RenderablePool.getPool = function (renderableClass, stage) {
        var pools = (RenderablePool._pools[stage.stageIndex] || (RenderablePool._pools[stage.stageIndex] = new Object()));
        return (pools[renderableClass.id] || (pools[renderableClass.id] = new RenderablePool(renderableClass, stage)));
    };
    /**
     * //TODO
     *
     * @param renderableClass
     */
    RenderablePool.disposePool = function (renderableClass, stage) {
        var pools = RenderablePool._pools[stage.stageIndex];
        if (pools == undefined)
            return;
        if (pools[renderableClass.id])
            pools[renderableClass.id] = undefined;
    };
    RenderablePool._pools = new Object();
    return RenderablePool;
})();
module.exports = RenderablePool;


},{"awayjs-renderergl/lib/compilation/DepthRenderObject":undefined,"awayjs-renderergl/lib/compilation/DistanceRenderObject":undefined,"awayjs-renderergl/lib/compilation/RenderBasicMaterialObject":undefined,"awayjs-renderergl/lib/compilation/RenderObjectPool":undefined,"awayjs-renderergl/lib/compilation/SkyboxRenderObject":undefined}],"awayjs-renderergl/lib/pool/SkyboxRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
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
    function SkyboxRenderable(pool, skybox, stage) {
        _super.call(this, pool, skybox, skybox, skybox, stage);
        this._vertexArray = new Array(0, 0, 0, 0, 1, 1, 1, 1);
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
            geometry = SkyboxRenderable._geometry = new TriangleSubGeometry(true);
            geometry.autoDeriveNormals = false;
            geometry.autoDeriveTangents = false;
            geometry.updateIndices(Array(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
            geometry.updatePositions(Array(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
        }
        this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;
        return geometry;
    };
    SkyboxRenderable._iIncludeDependencies = function (shaderObject) {
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderable._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "mul vt0, va0, vc5\n" + "add vt0, vt0, vc4\n" + "m44 op, vt0, vc0\n" + "mov v0, va0\n";
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderable.prototype._iActivate = function (shader, camera) {
        _super.prototype._iActivate.call(this, shader, camera);
        var context = this._stage.context;
        //context.setSamplerStateAt(0, ContextGLWrapMode.CLAMP, ContextGLTextureFilter.LINEAR, this._cubeMap.hasMipmaps? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
        //context.setDepthTest(false, ContextGLCompareMode.LESS);
        //this._stage.activateCubeTexture(0, this._cubeMap);
    };
    /**
     * @inheritDoc
     */
    SkyboxRenderable.prototype._iRender = function (shader, camera, viewProjection) {
        _super.prototype._iRender.call(this, shader, camera, viewProjection);
        var context = this._stage.context;
        var pos = camera.scenePosition;
        this._vertexArray[0] = pos.x;
        this._vertexArray[1] = pos.y;
        this._vertexArray[2] = pos.z;
        this._vertexArray[4] = this._vertexArray[5] = this._vertexArray[6] = camera.projection.far / Math.sqrt(3);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexArray, 2);
        this._stage.activateBuffer(0, this.getVertexData(TriangleSubGeometry.POSITION_DATA), this.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
    };
    /**
     *
     */
    SkyboxRenderable.id = "skybox";
    SkyboxRenderable.vertexAttributesOffset = 1;
    return SkyboxRenderable;
})(RenderableBase);
module.exports = SkyboxRenderable;


},{"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/pool/RenderableBase":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined}],"awayjs-renderergl/lib/pool/TriangleSubMeshRenderable":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
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
    function TriangleSubMeshRenderable(pool, subMesh, stage, level, indexOffset) {
        if (level === void 0) { level = 0; }
        if (indexOffset === void 0) { indexOffset = 0; }
        _super.call(this, pool, subMesh.parentMesh, subMesh, subMesh.material, stage, level, indexOffset);
        this.subMesh = subMesh;
    }
    /**
     *
     * @returns {SubGeometryBase}
     * @protected
     */
    TriangleSubMeshRenderable.prototype._pGetSubGeometry = function () {
        var subGeometry;
        if (this.subMesh.animator)
            subGeometry = this.subMesh.animator.getRenderableSubGeometry(this, this.subMesh.subGeometry);
        else
            subGeometry = this.subMesh.subGeometry;
        this._pVertexDataDirty[TriangleSubGeometry.POSITION_DATA] = true;
        if (subGeometry.vertexNormals)
            this._pVertexDataDirty[TriangleSubGeometry.NORMAL_DATA] = true;
        if (subGeometry.vertexTangents)
            this._pVertexDataDirty[TriangleSubGeometry.TANGENT_DATA] = true;
        if (subGeometry.uvs)
            this._pVertexDataDirty[TriangleSubGeometry.UV_DATA] = true;
        if (subGeometry.secondaryUVs)
            this._pVertexDataDirty[TriangleSubGeometry.SECONDARY_UV_DATA] = true;
        if (subGeometry.jointIndices)
            this._pVertexDataDirty[TriangleSubGeometry.JOINT_INDEX_DATA] = true;
        if (subGeometry.jointWeights)
            this._pVertexDataDirty[TriangleSubGeometry.JOINT_WEIGHT_DATA] = true;
        switch (subGeometry.jointsPerVertex) {
            case 1:
                this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_1;
                break;
            case 2:
                this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_2;
                break;
            case 3:
                this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_3;
                break;
            case 4:
                this.JOINT_INDEX_FORMAT = this.JOINT_WEIGHT_FORMAT = ContextGLVertexBufferFormat.FLOAT_4;
                break;
            default:
        }
        return subGeometry;
    };
    TriangleSubMeshRenderable._iIncludeDependencies = function (shaderObject) {
    };
    TriangleSubMeshRenderable._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shaderObject.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shaderObject.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shaderObject.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    TriangleSubMeshRenderable.prototype._iRender = function (shader, camera, viewProjection) {
        _super.prototype._iRender.call(this, shader, camera, viewProjection);
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
        this._stage.activateBuffer(0, this.getVertexData(TriangleSubGeometry.POSITION_DATA), this.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        this._stage.context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
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
    TriangleSubMeshRenderable.prototype._pGetOverflowRenderable = function (indexOffset) {
        return new TriangleSubMeshRenderable(this._pool, this.renderableOwner, this._stage, this._level + 1, indexOffset);
    };
    /**
     *
     */
    TriangleSubMeshRenderable.id = "trianglesubmesh";
    TriangleSubMeshRenderable.vertexAttributesOffset = 1;
    return TriangleSubMeshRenderable;
})(RenderableBase);
module.exports = TriangleSubMeshRenderable;


},{"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/pool/RenderableBase":undefined,"awayjs-stagegl/lib/base/ContextGLProgramType":undefined,"awayjs-stagegl/lib/base/ContextGLVertexBufferFormat":undefined}],"awayjs-renderergl/lib/tools/commands/Merge":[function(require,module,exports){
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
            var sub = new TriangleSubGeometry(true);
            sub.autoDeriveNormals = false;
            sub.autoDeriveTangents = false;
            data = this._geomVOs[i];
            sub.updateIndices(data.indices);
            sub.updatePositions(data.vertices);
            sub.updateVertexNormals(data.normals);
            sub.updateVertexTangents(data.tangents);
            sub.updateUVs(data.uvs);
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
                var pd, nd, td, ud;
                subGeom = subGeometries[subIdx];
                pd = subGeom.positions;
                nd = subGeom.vertexNormals;
                td = subGeom.vertexTangents;
                ud = subGeom.uvs;
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
                len = subGeom.numTriangles;
                for (i = 0; i < len; i++) {
                    calc = i * 3;
                    vo.indices[iIdx++] = subGeom.indices[calc] + indexOffset;
                    vo.indices[iIdx++] = subGeom.indices[calc + 1] + indexOffset;
                    vo.indices[iIdx++] = subGeom.indices[calc + 2] + indexOffset;
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


},{"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-display/lib/base/Geometry":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-display/lib/entities/Mesh":undefined}],"awayjs-renderergl/lib/tools/data/ParticleGeometryTransform":[function(require,module,exports){
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
                    subGeometries.push(new TriangleSubGeometry(true));
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
                    subGeometries.push(new TriangleSubGeometry(true));
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
                    compact.numTriangles;
                    sourcePositions = compact.positions;
                    sourceNormals = compact.vertexNormals;
                    sourceTangents = compact.vertexTangents;
                    sourceUVs = compact.uvs;
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
                            sourcePositions.push(tempVertex.x, tempVertex.y, tempVertex.z);
                            sourceNormals.push(tempNormal.x, tempNormal.y, tempNormal.z);
                            sourceTangents.push(tempTangents.x, tempTangents.y, tempTangents.z);
                            sourceUVs.push(tempUV.x, tempUV.y);
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
                var sourceIndices = sourceSubGeometry.indices;
                tempLen = sourceSubGeometry.numTriangles;
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
            subGeometry.updateIndices(indicesVector[i]);
            subGeometry.updatePositions(positionsVector[i]);
            subGeometry.updateVertexNormals(normalsVector[i]);
            subGeometry.updateVertexTangents(tangentsVector[i]);
            subGeometry.updateUVs(uvsVector[i]);
            particleGeometry.addSubGeometry(subGeometry);
        }
        return particleGeometry;
    };
    ParticleGeometryHelper.MAX_VERTEX = 65535;
    return ParticleGeometryHelper;
})();
module.exports = ParticleGeometryHelper;


},{"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-display/lib/base/TriangleSubGeometry":undefined,"awayjs-renderergl/lib/animators/data/ParticleData":undefined,"awayjs-renderergl/lib/base/ParticleGeometry":undefined}],"awayjs-renderergl/lib/utils/PerspectiveMatrix3D":[function(require,module,exports){
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
        this.copyRawDataFrom([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zFar / (zFar - zNear), 1.0, 0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0]);
    };
    return PerspectiveMatrix3D;
})(Matrix3D);
module.exports = PerspectiveMatrix3D;


},{"awayjs-core/lib/geom/Matrix3D":undefined}],"awayjs-renderergl/lib/utils/ShaderCompilerHelper":[function(require,module,exports){
var ContextGLTextureFormat = require("awayjs-stagegl/lib/base/ContextGLTextureFormat");
var ShaderCompilerHelper = (function () {
    function ShaderCompilerHelper() {
    }
    /**
     * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param sharedReg The shared register object for the shader.
     * @param inputReg The texture stream register.
     * @param texture The texture which will be assigned to the given slot.
     * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
     * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
     * @return The fragment code that performs the sampling.
     *
     * @protected
     */
    ShaderCompilerHelper.getTex2DSampleCode = function (targetReg, sharedReg, inputReg, texture, smooth, repeat, mipmaps, uvReg, forceWrap) {
        if (uvReg === void 0) { uvReg = null; }
        if (forceWrap === void 0) { forceWrap = null; }
        var wrap = forceWrap || (repeat ? "wrap" : "clamp");
        var format = ShaderCompilerHelper.getFormatStringForTexture(texture);
        var enableMipMaps = mipmaps && texture.hasMipmaps;
        var filter = (smooth) ? (enableMipMaps ? "linear,miplinear" : "linear") : (enableMipMaps ? "nearest,mipnearest" : "nearest");
        if (uvReg == null)
            uvReg = sharedReg.uvVarying;
        return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <2d," + filter + "," + format + wrap + ">\n";
    };
    /**
     * A helper method that generates standard code for sampling from a cube texture.
     * @param vo The MethodVO object linking this method with the pass currently being compiled.
     * @param targetReg The register in which to store the sampled colour.
     * @param inputReg The texture stream register.
     * @param texture The cube map which will be assigned to the given slot.
     * @param uvReg The direction vector with which to sample the cube map.
     *
     * @protected
     */
    ShaderCompilerHelper.getTexCubeSampleCode = function (targetReg, inputReg, texture, smooth, mipmaps, uvReg) {
        var filter;
        var format = ShaderCompilerHelper.getFormatStringForTexture(texture);
        var enableMipMaps = mipmaps && texture.hasMipmaps;
        var filter = (smooth) ? (enableMipMaps ? "linear,miplinear" : "linear") : (enableMipMaps ? "nearest,mipnearest" : "nearest");
        return "tex " + targetReg + ", " + uvReg + ", " + inputReg + " <cube," + format + filter + ">\n";
    };
    /**
     * Generates a texture format string for the sample instruction.
     * @param texture The texture for which to get the format string.
     * @return
     *
     * @protected
     */
    ShaderCompilerHelper.getFormatStringForTexture = function (texture) {
        switch (texture.format) {
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
    return ShaderCompilerHelper;
})();
module.exports = ShaderCompilerHelper;


},{"awayjs-stagegl/lib/base/ContextGLTextureFormat":undefined}]},{},[])


//# sourceMappingURL=awayjs-renderergl.js.map