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
var RendererPoolBase = require("awayjs-renderergl/lib/pool/RendererPoolBase");
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
    function RendererBase(rendererPoolClass, stage) {
        var _this = this;
        if (rendererPoolClass === void 0) { rendererPoolClass = null; }
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
        this._pRendererPoolClass = rendererPoolClass;
        this._onViewportUpdatedDelegate = function (event) { return _this.onViewportUpdated(event); };
        this._onContextUpdateDelegate = function (event) { return _this.onContextUpdate(event); };
        //default sorting algorithm
        this.renderableSorter = new RenderableMergeSort();
        this._rendererPool = (rendererPoolClass) ? new this._pRendererPoolClass(this) : new RendererPoolBase(this);
        this.stage = stage || StageManager.getInstance().getFreeStage();
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
        set: function (value) {
            if (this._pStage == value)
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
            this._rendererPool.stage = this._pStage;
            this._pStage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
            this._pStage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
            this._pStage.addEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
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
        this._rendererPool.dispose();
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
            item.entity._iCollectRenderables(this._rendererPool);
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
        var renderable2;
        var renderObject;
        var pass;
        while (renderable) {
            renderable2 = renderable;
            renderObject = renderable.renderObject;
            pass = renderObject.passes[0]; //assuming only one pass per material
            this.activatePass(renderable, pass, camera);
            do {
                // if completely in front, it will fall in a different cascade
                // do not use near and far planes
                if (!cullPlanes || renderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
                    renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
                }
                else {
                    renderable2.cascaded = true;
                }
                renderable2 = renderable2.next;
            } while (renderable2 && renderable2.renderObject == renderObject && !renderable2.cascaded);
            this.deactivatePass(renderable, pass);
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
        var renderable2;
        var renderObject;
        var passes;
        var pass;
        var camera = entityCollector.camera;
        while (renderable) {
            renderObject = renderable.renderObject;
            passes = renderObject.passes;
            // otherwise this would result in depth rendered anyway because fragment shader kil is ignored
            if (this._disableColor && renderObject._renderObjectOwner.alphaThreshold != 0) {
                renderable2 = renderable;
                do {
                    renderable2 = renderable2.next;
                } while (renderable2 && renderable2.renderObject == renderObject);
            }
            else {
                //iterate through each shader object
                len = passes.length;
                for (i = 0; i < len; i++) {
                    renderable2 = renderable;
                    pass = passes[i];
                    this.activatePass(renderable, pass, camera);
                    do {
                        renderable2._iRender(pass, camera, this._pRttViewProjectionMatrix);
                        renderable2 = renderable2.next;
                    } while (renderable2 && renderable2.renderObject == renderObject);
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
    /**
     *
     * @param renderable
     * @protected
     */
    RendererBase.prototype.applyRenderable = function (renderable) {
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
            this.applyRenderable(renderable.overflow);
    };
    RendererBase.prototype._pGetRenderObject = function (renderable, renderObjectOwner) {
        throw new AbstractMethodError();
    };
    return RendererBase;
})(EventDispatcher);
module.exports = RendererBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL3JlbmRlcmVyYmFzZS50cyJdLCJuYW1lcyI6WyJSZW5kZXJlckJhc2UiLCJSZW5kZXJlckJhc2UuY29uc3RydWN0b3IiLCJSZW5kZXJlckJhc2UucmVuZGVyQmxlbmRlZCIsIlJlbmRlcmVyQmFzZS5kaXNhYmxlQ29sb3IiLCJSZW5kZXJlckJhc2UubnVtVHJpYW5nbGVzIiwiUmVuZGVyZXJCYXNlLnZpZXdQb3J0IiwiUmVuZGVyZXJCYXNlLnNjaXNzb3JSZWN0IiwiUmVuZGVyZXJCYXNlLngiLCJSZW5kZXJlckJhc2UueSIsIlJlbmRlcmVyQmFzZS53aWR0aCIsIlJlbmRlcmVyQmFzZS5oZWlnaHQiLCJSZW5kZXJlckJhc2UuYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLmRlYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLl9pQ3JlYXRlRW50aXR5Q29sbGVjdG9yIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZFIiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kRyIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRCIiwiUmVuZGVyZXJCYXNlLmNvbnRleHQiLCJSZW5kZXJlckJhc2Uuc3RhZ2UiLCJSZW5kZXJlckJhc2UuaVNldFN0YWdlIiwiUmVuZGVyZXJCYXNlLnNoYXJlQ29udGV4dCIsIlJlbmRlcmVyQmFzZS5kaXNwb3NlIiwiUmVuZGVyZXJCYXNlLnJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlckNhc2NhZGVzIiwiUmVuZGVyZXJCYXNlLnBDb2xsZWN0UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2UucEV4ZWN1dGVSZW5kZXIiLCJSZW5kZXJlckJhc2UucXVldWVTbmFwc2hvdCIsIlJlbmRlcmVyQmFzZS5wRHJhdyIsIlJlbmRlcmVyQmFzZS5kcmF3Q2FzY2FkZVJlbmRlcmFibGVzIiwiUmVuZGVyZXJCYXNlLmRyYXdSZW5kZXJhYmxlcyIsIlJlbmRlcmVyQmFzZS5vbkNvbnRleHRVcGRhdGUiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kQWxwaGEiLCJSZW5kZXJlckJhc2Uubm90aWZ5U2Npc3NvclVwZGF0ZSIsIlJlbmRlcmVyQmFzZS5ub3RpZnlWaWV3cG9ydFVwZGF0ZSIsIlJlbmRlcmVyQmFzZS5vblZpZXdwb3J0VXBkYXRlZCIsIlJlbmRlcmVyQmFzZS51cGRhdGVHbG9iYWxQb3MiLCJSZW5kZXJlckJhc2UuYXBwbHlSZW5kZXJhYmxlIiwiUmVuZGVyZXJCYXNlLl9wR2V0UmVuZGVyT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFPLFFBQVEsV0FBZ0IsK0JBQStCLENBQUMsQ0FBQztBQUVoRSxJQUFPLEtBQUssV0FBZ0IsNEJBQTRCLENBQUMsQ0FBQztBQUMxRCxJQUFPLFNBQVMsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRWpFLElBQU8sbUJBQW1CLFdBQWEsNENBQTRDLENBQUMsQ0FBQztBQUNyRixJQUFPLGVBQWUsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBUzlFLElBQU8sbUJBQW1CLFdBQWEsNkNBQTZDLENBQUMsQ0FBQztBQU10RixJQUFPLGFBQWEsV0FBYyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQzdFLElBQU8sVUFBVSxXQUFlLHNDQUFzQyxDQUFDLENBQUM7QUFFeEUsSUFBTyxlQUFlLFdBQWMsNkNBQTZDLENBQUMsQ0FBQztBQUduRixJQUFPLHNCQUFzQixXQUFZLG9EQUFvRCxDQUFDLENBQUM7QUFFL0YsSUFBTyxpQkFBaUIsV0FBYSxzREFBc0QsQ0FBQyxDQUFDO0FBQzdGLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENBQUMsQ0FBQztBQUN4RixJQUFPLG9CQUFvQixXQUFhLDhDQUE4QyxDQUFDLENBQUM7QUFHeEYsSUFBTyxZQUFZLFdBQWUsMENBQTBDLENBQUMsQ0FBQztBQVU5RSxJQUFPLGdCQUFnQixXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHcEYsQUFNQTs7Ozs7R0FERztJQUNHLFlBQVk7SUFB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LEdBQXhCQSxVQUF5QkEsVUFBeUJBLEVBQUVBLGlCQUFvQ0E7UUFFdkZzQyxNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUNGdEMsbUJBQUNBO0FBQURBLENBbnpCQSxBQW16QkNBLEVBbnpCMEIsZUFBZSxFQW16QnpDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImJhc2UvUmVuZGVyZXJCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaXRtYXBEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9iYXNlL0JpdG1hcERhdGFcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBQbGFuZTNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUGxhbmUzRFwiKTtcbmltcG9ydCBQb2ludFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1BvaW50XCIpO1xuaW1wb3J0IFJlY3RhbmdsZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9SZWN0YW5nbGVcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudERpc3BhdGNoZXJcIik7XG5pbXBvcnQgVGV4dHVyZVByb3h5QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVQcm94eUJhc2VcIik7XG5pbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBMaW5lU3ViTWVzaFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaW5lU3ViTWVzaFwiKTtcbmltcG9ydCBJUmVuZGVyT2JqZWN0T3duZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Yk1lc2hcIik7XG5pbXBvcnQgRW50aXR5TGlzdEl0ZW1cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL0VudGl0eUxpc3RJdGVtXCIpO1xuaW1wb3J0IElFbnRpdHlTb3J0ZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L0lFbnRpdHlTb3J0ZXJcIik7XG5pbXBvcnQgUmVuZGVyYWJsZU1lcmdlU29ydFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L1JlbmRlcmFibGVNZXJnZVNvcnRcIik7XG5pbXBvcnQgSVJlbmRlcmVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9yZW5kZXIvSVJlbmRlcmVyXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQmlsbGJvYXJkXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgSUVudGl0eVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9JRW50aXR5XCIpO1xuaW1wb3J0IFNreWJveFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XG5pbXBvcnQgUmVuZGVyZXJFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9SZW5kZXJlckV2ZW50XCIpO1xuaW1wb3J0IFN0YWdlRXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9TdGFnZUV2ZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBFbnRpdHlDb2xsZWN0b3JcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9FbnRpdHlDb2xsZWN0b3JcIik7XG5pbXBvcnQgSUNvbGxlY3Rvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvdHJhdmVyc2UvSUNvbGxlY3RvclwiKTtcbmltcG9ydCBTaGFkb3dDYXN0ZXJDb2xsZWN0b3JcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3RyYXZlcnNlL1NoYWRvd0Nhc3RlckNvbGxlY3RvclwiKTtcbmltcG9ydCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYW5hZ2Vycy9EZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXCIpO1xuXG5pbXBvcnQgQUdBTE1pbmlBc3NlbWJsZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYWdsc2wvYXNzZW1ibGVyL0FHQUxNaW5pQXNzZW1ibGVyXCIpO1xuaW1wb3J0IENvbnRleHRHTEJsZW5kRmFjdG9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQmxlbmRGYWN0b3JcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcbmltcG9ydCBJQ29udGV4dEdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0R0xcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBTdGFnZU1hbmFnZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hbmFnZXJzL1N0YWdlTWFuYWdlclwiKTtcbmltcG9ydCBQcm9ncmFtRGF0YVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvcG9vbC9Qcm9ncmFtRGF0YVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZVwiKTtcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgUmVuZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1JlbmRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IElSZW5kZXJlclBvb2xDbGFzc1x0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL0lSZW5kZXJlclBvb2xDbGFzc1wiKTtcbmltcG9ydCBSVFRCdWZmZXJNYW5hZ2VyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWFuYWdlcnMvUlRUQnVmZmVyTWFuYWdlclwiKTtcbmltcG9ydCBSZW5kZXJQYXNzQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bhc3Nlcy9SZW5kZXJQYXNzQmFzZVwiKTtcbmltcG9ydCBSZW5kZXJlclBvb2xCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJlclBvb2xCYXNlXCIpO1xuXG5cbi8qKlxuICogUmVuZGVyZXJCYXNlIGZvcm1zIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGNsYXNzZXMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgcmVuZGVyaW5nIHBpcGVsaW5lIHRvIHJlbmRlciB0aGVcbiAqIGNvbnRlbnRzIG9mIGEgcGFydGl0aW9uXG4gKlxuICogQGNsYXNzIGF3YXkucmVuZGVyLlJlbmRlcmVyQmFzZVxuICovXG5jbGFzcyBSZW5kZXJlckJhc2UgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXJcbntcblx0cHJpdmF0ZSBfbnVtVXNlZFN0cmVhbXM6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbnVtVXNlZFRleHR1cmVzOm51bWJlciA9IDA7XG5cblx0cHJpdmF0ZSBfcmVuZGVyZXJQb29sOlJlbmRlcmVyUG9vbEJhc2U7XG5cblx0cHVibGljIF9wUmVuZGVyZXJQb29sQ2xhc3M6SVJlbmRlcmVyUG9vbENsYXNzO1xuXHRwdWJsaWMgX3BDb250ZXh0OklDb250ZXh0R0w7XG5cdHB1YmxpYyBfcFN0YWdlOlN0YWdlO1xuXG5cdHB1YmxpYyBfcENhbWVyYTpDYW1lcmE7XG5cdHB1YmxpYyBfaUVudHJ5UG9pbnQ6VmVjdG9yM0Q7XG5cdHB1YmxpYyBfcENhbWVyYUZvcndhcmQ6VmVjdG9yM0Q7XG5cblx0cHVibGljIF9wUnR0QnVmZmVyTWFuYWdlcjpSVFRCdWZmZXJNYW5hZ2VyO1xuXHRwcml2YXRlIF92aWV3UG9ydDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKCk7XG5cdHByaXZhdGUgX3ZpZXdwb3J0RGlydHk6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfc2Npc3NvckRpcnR5OmJvb2xlYW47XG5cblx0cHVibGljIF9wQmFja0J1ZmZlckludmFsaWQ6Ym9vbGVhbiA9IHRydWU7XG5cdHB1YmxpYyBfcERlcHRoVGV4dHVyZUludmFsaWQ6Ym9vbGVhbiA9IHRydWU7XG5cdHB1YmxpYyBfZGVwdGhQcmVwYXNzOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZFI6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEc6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEI6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEFscGhhOm51bWJlciA9IDE7XG5cdHB1YmxpYyBfc2hhcmVDb250ZXh0OmJvb2xlYW4gPSBmYWxzZTtcblxuXHQvLyBvbmx5IHVzZWQgYnkgcmVuZGVyZXJzIHRoYXQgbmVlZCB0byByZW5kZXIgZ2VvbWV0cnkgdG8gdGV4dHVyZXNcblx0cHVibGljIF93aWR0aDpudW1iZXI7XG5cdHB1YmxpYyBfaGVpZ2h0Om51bWJlcjtcblxuXHRwdWJsaWMgdGV4dHVyZVJhdGlvWDpudW1iZXIgPSAxO1xuXHRwdWJsaWMgdGV4dHVyZVJhdGlvWTpudW1iZXIgPSAxO1xuXG5cdHByaXZhdGUgX3NuYXBzaG90Qml0bWFwRGF0YTpCaXRtYXBEYXRhO1xuXHRwcml2YXRlIF9zbmFwc2hvdFJlcXVpcmVkOmJvb2xlYW47XG5cblx0cHVibGljIF9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXg6TWF0cml4M0QgPSBuZXcgTWF0cml4M0QoKTtcblxuXHRwcml2YXRlIF9sb2NhbFBvczpQb2ludCA9IG5ldyBQb2ludCgpO1xuXHRwcml2YXRlIF9nbG9iYWxQb3M6UG9pbnQgPSBuZXcgUG9pbnQoKTtcblx0cHVibGljIF9wU2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZSgpO1xuXG5cdHByaXZhdGUgX3NjaXNzb3JVcGRhdGVkOlJlbmRlcmVyRXZlbnQ7XG5cdHByaXZhdGUgX3ZpZXdQb3J0VXBkYXRlZDpSZW5kZXJlckV2ZW50O1xuXG5cdHByaXZhdGUgX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlOkZ1bmN0aW9uO1xuXHRwcml2YXRlIF9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlO1xuXG5cdHB1YmxpYyBfcE51bVRyaWFuZ2xlczpudW1iZXIgPSAwO1xuXG5cdHB1YmxpYyBfcE9wYXF1ZVJlbmRlcmFibGVIZWFkOlJlbmRlcmFibGVCYXNlO1xuXHRwdWJsaWMgX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQ6UmVuZGVyYWJsZUJhc2U7XG5cdHB1YmxpYyBfZGlzYWJsZUNvbG9yOmJvb2xlYW4gPSBmYWxzZTtcblx0cHVibGljIF9yZW5kZXJCbGVuZGVkOmJvb2xlYW4gPSB0cnVlO1xuXG5cblx0cHVibGljIGdldCByZW5kZXJCbGVuZGVkKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3JlbmRlckJsZW5kZWQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHJlbmRlckJsZW5kZWQodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdHRoaXMuX3JlbmRlckJsZW5kZWQgPSB2YWx1ZTtcblx0fVxuXG5cblx0cHVibGljIGdldCBkaXNhYmxlQ29sb3IoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZGlzYWJsZUNvbG9yO1xuXHR9XG5cblx0cHVibGljIHNldCBkaXNhYmxlQ29sb3IodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdHRoaXMuX2Rpc2FibGVDb2xvciA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVRyaWFuZ2xlcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BOdW1UcmlhbmdsZXM7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyByZW5kZXJhYmxlU29ydGVyOklFbnRpdHlTb3J0ZXI7XG5cblxuXHQvKipcblx0ICogQSB2aWV3UG9ydCByZWN0YW5nbGUgZXF1aXZhbGVudCBvZiB0aGUgU3RhZ2Ugc2l6ZSBhbmQgcG9zaXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHZpZXdQb3J0KCk6UmVjdGFuZ2xlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdmlld1BvcnQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzY2lzc29yIHJlY3RhbmdsZSBlcXVpdmFsZW50IG9mIHRoZSB2aWV3IHNpemUgYW5kIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBzY2lzc29yUmVjdCgpOlJlY3RhbmdsZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BTY2lzc29yUmVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCB4KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxQb3MueDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgeCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy54ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZ2xvYmFsUG9zLnggPSB0aGlzLl9sb2NhbFBvcy54ID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9sb2NhbFBvcy55O1xuXHR9XG5cblx0cHVibGljIHNldCB5KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLnkgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9nbG9iYWxQb3MueSA9IHRoaXMuX2xvY2FsUG9zLnkgPSB2YWx1ZTtcblxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgd2lkdGgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93aWR0aDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2lkdGgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3dpZHRoID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fd2lkdGggPSB2YWx1ZTtcblx0XHR0aGlzLl9wU2Npc3NvclJlY3Qud2lkdGggPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9wUnR0QnVmZmVyTWFuYWdlcilcblx0XHRcdHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyLnZpZXdXaWR0aCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0XHR0aGlzLl9wRGVwdGhUZXh0dXJlSW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCBoZWlnaHQoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9oZWlnaHQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGhlaWdodCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5faGVpZ2h0ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5faGVpZ2h0ID0gdmFsdWU7XG5cdFx0dGhpcy5fcFNjaXNzb3JSZWN0LmhlaWdodCA9IHZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyKVxuXHRcdFx0dGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIudmlld0hlaWdodCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0XHR0aGlzLl9wRGVwdGhUZXh0dXJlSW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFJlbmRlcmVyQmFzZSBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihyZW5kZXJlclBvb2xDbGFzczpJUmVuZGVyZXJQb29sQ2xhc3MgPSBudWxsLCBzdGFnZTpTdGFnZSA9IG51bGwpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fcFJlbmRlcmVyUG9vbENsYXNzID0gcmVuZGVyZXJQb29sQ2xhc3M7XG5cblx0XHR0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlID0gKGV2ZW50OlN0YWdlRXZlbnQpID0+IHRoaXMub25WaWV3cG9ydFVwZGF0ZWQoZXZlbnQpXG5cdFx0dGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUgPSAoZXZlbnQ6RXZlbnQpID0+IHRoaXMub25Db250ZXh0VXBkYXRlKGV2ZW50KTtcblxuXHRcdC8vZGVmYXVsdCBzb3J0aW5nIGFsZ29yaXRobVxuXHRcdHRoaXMucmVuZGVyYWJsZVNvcnRlciA9IG5ldyBSZW5kZXJhYmxlTWVyZ2VTb3J0KCk7XG5cblx0XHR0aGlzLl9yZW5kZXJlclBvb2wgPSAocmVuZGVyZXJQb29sQ2xhc3MpPyBuZXcgdGhpcy5fcFJlbmRlcmVyUG9vbENsYXNzKHRoaXMpIDogbmV3IFJlbmRlcmVyUG9vbEJhc2UodGhpcyk7XG5cblx0XHR0aGlzLnN0YWdlID0gc3RhZ2UgfHwgU3RhZ2VNYW5hZ2VyLmdldEluc3RhbmNlKCkuZ2V0RnJlZVN0YWdlKCk7XG5cdH1cblxuXHRwdWJsaWMgYWN0aXZhdGVQYXNzKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHBhc3M6UmVuZGVyUGFzc0Jhc2UsIGNhbWVyYTpDYW1lcmEpXG5cdHtcblx0XHQvL2NsZWFyIHVudXNlZCB2ZXJ0ZXggc3RyZWFtc1xuXHRcdGZvciAodmFyIGkgPSBwYXNzLnNoYWRlci5udW1Vc2VkU3RyZWFtczsgaSA8IHRoaXMuX251bVVzZWRTdHJlYW1zOyBpKyspXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChpLCBudWxsKTtcblxuXHRcdC8vY2xlYXIgdW51c2VkIHRleHR1cmUgc3RyZWFtc1xuXHRcdGZvciAodmFyIGkgPSBwYXNzLnNoYWRlci5udW1Vc2VkVGV4dHVyZXM7IGkgPCB0aGlzLl9udW1Vc2VkVGV4dHVyZXM7IGkrKylcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFRleHR1cmVBdChpLCBudWxsKTtcblxuXHRcdC8vY2hlY2sgcHJvZ3JhbSBkYXRhIGlzIHVwbG9hZGVkXG5cdFx0dmFyIHByb2dyYW1EYXRhOlByb2dyYW1EYXRhID0gcGFzcy5zaGFkZXIucHJvZ3JhbURhdGE7XG5cblx0XHRpZiAoIXByb2dyYW1EYXRhLnByb2dyYW0pIHtcblx0XHRcdHByb2dyYW1EYXRhLnByb2dyYW0gPSB0aGlzLl9wQ29udGV4dC5jcmVhdGVQcm9ncmFtKCk7XG5cdFx0XHR2YXIgdmVydGV4Qnl0ZUNvZGU6Qnl0ZUFycmF5ID0gKG5ldyBBR0FMTWluaUFzc2VtYmxlcigpLmFzc2VtYmxlKFwicGFydCB2ZXJ0ZXggMVxcblwiICsgcHJvZ3JhbURhdGEudmVydGV4U3RyaW5nICsgXCJlbmRwYXJ0XCIpKVsndmVydGV4J10uZGF0YTtcblx0XHRcdHZhciBmcmFnbWVudEJ5dGVDb2RlOkJ5dGVBcnJheSA9IChuZXcgQUdBTE1pbmlBc3NlbWJsZXIoKS5hc3NlbWJsZShcInBhcnQgZnJhZ21lbnQgMVxcblwiICsgcHJvZ3JhbURhdGEuZnJhZ21lbnRTdHJpbmcgKyBcImVuZHBhcnRcIikpWydmcmFnbWVudCddLmRhdGE7XG5cdFx0XHRwcm9ncmFtRGF0YS5wcm9ncmFtLnVwbG9hZCh2ZXJ0ZXhCeXRlQ29kZSwgZnJhZ21lbnRCeXRlQ29kZSk7XG5cdFx0fVxuXG5cdFx0Ly9zZXQgcHJvZ3JhbSBkYXRhXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0UHJvZ3JhbShwcm9ncmFtRGF0YS5wcm9ncmFtKTtcblxuXHRcdC8vYWN0aXZhdGUgc2hhZGVyIG9iamVjdCB0aHJvdWdoIHJlbmRlcmFibGVcblx0XHRyZW5kZXJhYmxlLl9pQWN0aXZhdGUocGFzcywgY2FtZXJhKTtcblx0fVxuXG5cdHB1YmxpYyBkZWFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBwYXNzOlJlbmRlclBhc3NCYXNlKVxuXHR7XG5cdFx0Ly9kZWFjdGl2YXRlIHNoYWRlciBvYmplY3Rcblx0XHRyZW5kZXJhYmxlLl9pRGVhY3RpdmF0ZShwYXNzKTtcblxuXHRcdHRoaXMuX251bVVzZWRTdHJlYW1zID0gcGFzcy5zaGFkZXIubnVtVXNlZFN0cmVhbXM7XG5cdFx0dGhpcy5fbnVtVXNlZFRleHR1cmVzID0gcGFzcy5zaGFkZXIubnVtVXNlZFRleHR1cmVzO1xuXHR9XG5cblx0cHVibGljIF9pQ3JlYXRlRW50aXR5Q29sbGVjdG9yKCk6SUNvbGxlY3RvclxuXHR7XG5cdFx0cmV0dXJuIG5ldyBFbnRpdHlDb2xsZWN0b3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmFja2dyb3VuZCBjb2xvcidzIHJlZCBjb21wb25lbnQsIHVzZWQgd2hlbiBjbGVhcmluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kUigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRSO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRSKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kUiA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JhY2tncm91bmRSID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBiYWNrZ3JvdW5kIGNvbG9yJ3MgZ3JlZW4gY29tcG9uZW50LCB1c2VkIHdoZW4gY2xlYXJpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IF9pQmFja2dyb3VuZEcoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kRztcblx0fVxuXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kRyh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZEcgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9iYWNrZ3JvdW5kRyA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmFja2dyb3VuZCBjb2xvcidzIGJsdWUgY29tcG9uZW50LCB1c2VkIHdoZW4gY2xlYXJpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IF9pQmFja2dyb3VuZEIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kQih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZEIgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9iYWNrZ3JvdW5kQiA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgY29udGV4dCgpOklDb250ZXh0R0xcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQ29udGV4dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgU3RhZ2UgdGhhdCB3aWxsIHByb3ZpZGUgdGhlIENvbnRleHRHTCB1c2VkIGZvciByZW5kZXJpbmcuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHN0YWdlKCk6U3RhZ2Vcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wU3RhZ2U7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHN0YWdlKHZhbHVlOlN0YWdlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BTdGFnZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuaVNldFN0YWdlKHZhbHVlKTtcblx0fVxuXG5cdHB1YmxpYyBpU2V0U3RhZ2UodmFsdWU6U3RhZ2UpXG5cdHtcblx0XHRpZiAodGhpcy5fcFN0YWdlKVxuXHRcdFx0dGhpcy5kaXNwb3NlKCk7XG5cblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHRoaXMuX3BTdGFnZSA9IHZhbHVlO1xuXG5cdFx0XHR0aGlzLl9yZW5kZXJlclBvb2wuc3RhZ2UgPSB0aGlzLl9wU3RhZ2U7XG5cblx0XHRcdHRoaXMuX3BTdGFnZS5hZGRFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuQ09OVEVYVF9DUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfUkVDUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LlZJRVdQT1JUX1VQREFURUQsIHRoaXMuX29uVmlld3BvcnRVcGRhdGVkRGVsZWdhdGUpO1xuXG5cdFx0XHQvKlxuXHRcdFx0IGlmIChfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpXG5cdFx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLnN0YWdlID0gdmFsdWU7XG5cdFx0XHQgKi9cblx0XHRcdGlmICh0aGlzLl9wU3RhZ2UuY29udGV4dClcblx0XHRcdFx0dGhpcy5fcENvbnRleHQgPSA8SUNvbnRleHRHTD4gdGhpcy5fcFN0YWdlLmNvbnRleHQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XG5cdH1cblxuXHQvKipcblx0ICogRGVmZXJzIGNvbnRyb2wgb2YgQ29udGV4dEdMIGNsZWFyKCkgYW5kIHByZXNlbnQoKSBjYWxscyB0byBTdGFnZSwgZW5hYmxpbmcgbXVsdGlwbGUgU3RhZ2UgZnJhbWV3b3Jrc1xuXHQgKiB0byBzaGFyZSB0aGUgc2FtZSBDb250ZXh0R0wgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIGdldCBzaGFyZUNvbnRleHQoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2hhcmVDb250ZXh0O1xuXHR9XG5cblx0cHVibGljIHNldCBzaGFyZUNvbnRleHQodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9zaGFyZUNvbnRleHQgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9zaGFyZUNvbnRleHQgPSB2YWx1ZTtcblxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XG5cdH1cblxuXHQvKipcblx0ICogRGlzcG9zZXMgdGhlIHJlc291cmNlcyB1c2VkIGJ5IHRoZSBSZW5kZXJlckJhc2UuXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHR0aGlzLl9yZW5kZXJlclBvb2wuZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX0NSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHR0aGlzLl9wU3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfUkVDUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5WSUVXUE9SVF9VUERBVEVELCB0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlKTtcblxuXHRcdHRoaXMuX3BTdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5fcENvbnRleHQgPSBudWxsO1xuXHRcdC8qXG5cdFx0IGlmIChfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpIHtcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLmRpc3Bvc2UoKTtcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyID0gbnVsbDtcblx0XHQgfVxuXHRcdCAqL1xuXHR9XG5cblx0cHVibGljIHJlbmRlcihlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3Rvcilcblx0e1xuXHRcdHRoaXMuX3ZpZXdwb3J0RGlydHkgPSBmYWxzZTtcblx0XHR0aGlzLl9zY2lzc29yRGlydHkgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5IHRvIHRoZSBiYWNrIGJ1ZmZlciBvciB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkuXG5cdCAqIEBwYXJhbSB0YXJnZXQgQW4gb3B0aW9uIHRhcmdldCB0ZXh0dXJlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIHN1cmZhY2VTZWxlY3RvciBUaGUgaW5kZXggb2YgYSBDdWJlVGV4dHVyZSdzIGZhY2UgdG8gcmVuZGVyIHRvLlxuXHQgKiBAcGFyYW0gYWRkaXRpb25hbENsZWFyTWFzayBBZGRpdGlvbmFsIGNsZWFyIG1hc2sgaW5mb3JtYXRpb24sIGluIGNhc2UgZXh0cmEgY2xlYXIgY2hhbm5lbHMgYXJlIHRvIGJlIG9taXR0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgX2lSZW5kZXIoZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlID0gbnVsbCwgc2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbnVsbCwgc3VyZmFjZVNlbGVjdG9yOm51bWJlciA9IDApXG5cdHtcblx0XHQvL1RPRE8gcmVmYWN0b3Igc2V0VGFyZ2V0IHNvIHRoYXQgcmVuZGVydGV4dHVyZXMgYXJlIGNyZWF0ZWQgYmVmb3JlIHRoaXMgY2hlY2tcblx0XHRpZiAoIXRoaXMuX3BTdGFnZSB8fCAhdGhpcy5fcENvbnRleHQpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXguY29weUZyb20oZW50aXR5Q29sbGVjdG9yLmNhbWVyYS52aWV3UHJvamVjdGlvbik7XG5cdFx0dGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4LmFwcGVuZFNjYWxlKHRoaXMudGV4dHVyZVJhdGlvWCwgdGhpcy50ZXh0dXJlUmF0aW9ZLCAxKTtcblxuXHRcdHRoaXMucEV4ZWN1dGVSZW5kZXIoZW50aXR5Q29sbGVjdG9yLCB0YXJnZXQsIHNjaXNzb3JSZWN0LCBzdXJmYWNlU2VsZWN0b3IpO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgbWlwIG1hcHMgb24gdGFyZ2V0IChpZiB0YXJnZXQgZXhpc3RzKSAvL1RPRE9cblx0XHQvL2lmICh0YXJnZXQpXG5cdFx0Ly9cdCg8VGV4dHVyZT50YXJnZXQpLmdlbmVyYXRlTWlwbWFwcygpO1xuXG5cdFx0Ly8gY2xlYXIgYnVmZmVyc1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IDg7ICsraSkge1xuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoaSwgbnVsbCk7XG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRUZXh0dXJlQXQoaSwgbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9pUmVuZGVyQ2FzY2FkZXMoZW50aXR5Q29sbGVjdG9yOlNoYWRvd0Nhc3RlckNvbGxlY3RvciwgdGFyZ2V0OlRleHR1cmVQcm94eUJhc2UsIG51bUNhc2NhZGVzOm51bWJlciwgc2Npc3NvclJlY3RzOkFycmF5PFJlY3RhbmdsZT4sIGNhbWVyYXM6QXJyYXk8Q2FtZXJhPilcblx0e1xuXHRcdHRoaXMucENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0dGhpcy5fcFN0YWdlLnNldFJlbmRlclRhcmdldCh0YXJnZXQsIHRydWUsIDApO1xuXHRcdHRoaXMuX3BDb250ZXh0LmNsZWFyKDEsIDEsIDEsIDEsIDEsIDApO1xuXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0QmxlbmRGYWN0b3JzKENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORSwgQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTyk7XG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KHRydWUsIENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1MpO1xuXG5cdFx0dmFyIGhlYWQ6UmVuZGVyYWJsZUJhc2UgPSB0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ7XG5cblx0XHR2YXIgZmlyc3Q6Ym9vbGVhbiA9IHRydWU7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IG51bUNhc2NhZGVzIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0XHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IHNjaXNzb3JSZWN0c1tpXTtcblx0XHRcdHRoaXMuZHJhd0Nhc2NhZGVSZW5kZXJhYmxlcyhoZWFkLCBjYW1lcmFzW2ldLCBmaXJzdD8gbnVsbCA6IGNhbWVyYXNbaV0uZnJ1c3R1bVBsYW5lcyk7XG5cdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vbGluZSByZXF1aXJlZCBmb3IgY29ycmVjdCByZW5kZXJpbmcgd2hlbiB1c2luZyBhd2F5M2Qgd2l0aCBzdGFybGluZy4gRE8gTk9UIFJFTU9WRSBVTkxFU1MgU1RBUkxJTkcgSU5URUdSQVRJT04gSVMgUkVURVNURUQhXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgcENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3Rvcilcblx0e1xuXHRcdC8vcmVzZXQgaGVhZCB2YWx1ZXNcblx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gbnVsbDtcblx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSBudWxsO1xuXHRcdHRoaXMuX3BOdW1UcmlhbmdsZXMgPSAwO1xuXG5cdFx0Ly9ncmFiIGVudGl0eSBoZWFkXG5cdFx0dmFyIGl0ZW06RW50aXR5TGlzdEl0ZW0gPSBlbnRpdHlDb2xsZWN0b3IuZW50aXR5SGVhZDtcblxuXHRcdC8vc2V0IHRlbXAgdmFsdWVzIGZvciBlbnRyeSBwb2ludCBhbmQgY2FtZXJhIGZvcndhcmQgdmVjdG9yXG5cdFx0dGhpcy5fcENhbWVyYSA9IGVudGl0eUNvbGxlY3Rvci5jYW1lcmE7XG5cdFx0dGhpcy5faUVudHJ5UG9pbnQgPSB0aGlzLl9wQ2FtZXJhLnNjZW5lUG9zaXRpb247XG5cdFx0dGhpcy5fcENhbWVyYUZvcndhcmQgPSB0aGlzLl9wQ2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkVmVjdG9yO1xuXG5cdFx0Ly9pdGVyYXRlIHRocm91Z2ggYWxsIGVudGl0aWVzXG5cdFx0d2hpbGUgKGl0ZW0pIHtcblx0XHRcdGl0ZW0uZW50aXR5Ll9pQ29sbGVjdFJlbmRlcmFibGVzKHRoaXMuX3JlbmRlcmVyUG9vbCk7XG5cdFx0XHRpdGVtID0gaXRlbS5uZXh0O1xuXHRcdH1cblxuXHRcdC8vc29ydCB0aGUgcmVzdWx0aW5nIHJlbmRlcmFibGVzXG5cdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gPFJlbmRlcmFibGVCYXNlPiB0aGlzLnJlbmRlcmFibGVTb3J0ZXIuc29ydE9wYXF1ZVJlbmRlcmFibGVzKHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCk7XG5cdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IDxSZW5kZXJhYmxlQmFzZT4gdGhpcy5yZW5kZXJhYmxlU29ydGVyLnNvcnRCbGVuZGVkUmVuZGVyYWJsZXModGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeSB0byB0aGUgYmFjayBidWZmZXIgb3IgdGV4dHVyZS4gT25seSBleGVjdXRlZCBpZiBldmVyeXRoaW5nIGlzIHNldCB1cC5cblx0ICpcblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbiB0YXJnZXQgdGV4dHVyZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBzdXJmYWNlU2VsZWN0b3IgVGhlIGluZGV4IG9mIGEgQ3ViZVRleHR1cmUncyBmYWNlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIGFkZGl0aW9uYWxDbGVhck1hc2sgQWRkaXRpb25hbCBjbGVhciBtYXNrIGluZm9ybWF0aW9uLCBpbiBjYXNlIGV4dHJhIGNsZWFyIGNoYW5uZWxzIGFyZSB0byBiZSBvbWl0dGVkLlxuXHQgKi9cblx0cHVibGljIHBFeGVjdXRlUmVuZGVyKGVudGl0eUNvbGxlY3RvcjpJQ29sbGVjdG9yLCB0YXJnZXQ6VGV4dHVyZVByb3h5QmFzZSA9IG51bGwsIHNjaXNzb3JSZWN0OlJlY3RhbmdsZSA9IG51bGwsIHN1cmZhY2VTZWxlY3RvcjpudW1iZXIgPSAwKVxuXHR7XG5cdFx0dGhpcy5fcFN0YWdlLnNldFJlbmRlclRhcmdldCh0YXJnZXQsIHRydWUsIHN1cmZhY2VTZWxlY3Rvcik7XG5cblx0XHRpZiAoKHRhcmdldCB8fCAhdGhpcy5fc2hhcmVDb250ZXh0KSAmJiAhdGhpcy5fZGVwdGhQcmVwYXNzKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuY2xlYXIodGhpcy5fYmFja2dyb3VuZFIsIHRoaXMuX2JhY2tncm91bmRHLCB0aGlzLl9iYWNrZ3JvdW5kQiwgdGhpcy5fYmFja2dyb3VuZEFscGhhLCAxLCAwKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IHNjaXNzb3JSZWN0O1xuXG5cdFx0Lypcblx0XHQgaWYgKF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcilcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLnJlbmRlcigpO1xuXHRcdCAqL1xuXHRcdHRoaXMucENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0QmxlbmRGYWN0b3JzKENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORSwgQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTyk7XG5cblx0XHR0aGlzLnBEcmF3KGVudGl0eUNvbGxlY3Rvcik7XG5cblx0XHQvL2xpbmUgcmVxdWlyZWQgZm9yIGNvcnJlY3QgcmVuZGVyaW5nIHdoZW4gdXNpbmcgYXdheTNkIHdpdGggc3RhcmxpbmcuIERPIE5PVCBSRU1PVkUgVU5MRVNTIFNUQVJMSU5HIElOVEVHUkFUSU9OIElTIFJFVEVTVEVEIVxuXHRcdC8vdGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTsgLy9vb3BzaWVcblxuXHRcdGlmICghdGhpcy5fc2hhcmVDb250ZXh0KSB7XG5cdFx0XHRpZiAodGhpcy5fc25hcHNob3RSZXF1aXJlZCAmJiB0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEpIHtcblx0XHRcdFx0dGhpcy5fcENvbnRleHQuZHJhd1RvQml0bWFwRGF0YSh0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEpO1xuXHRcdFx0XHR0aGlzLl9zbmFwc2hvdFJlcXVpcmVkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fcFN0YWdlLnNjaXNzb3JSZWN0ID0gbnVsbDtcblx0fVxuXG5cdC8qXG5cdCAqIFdpbGwgZHJhdyB0aGUgcmVuZGVyZXIncyBvdXRwdXQgb24gbmV4dCByZW5kZXIgdG8gdGhlIHByb3ZpZGVkIGJpdG1hcCBkYXRhLlxuXHQgKiAqL1xuXHRwdWJsaWMgcXVldWVTbmFwc2hvdChibWQ6Qml0bWFwRGF0YSlcblx0e1xuXHRcdHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgPSB0cnVlO1xuXHRcdHRoaXMuX3NuYXBzaG90Qml0bWFwRGF0YSA9IGJtZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQZXJmb3JtcyB0aGUgYWN0dWFsIGRyYXdpbmcgb2YgZ2VvbWV0cnkgdG8gdGhlIHRhcmdldC5cblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKi9cblx0cHVibGljIHBEcmF3KGVudGl0eUNvbGxlY3RvcjpJQ29sbGVjdG9yKVxuXHR7XG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KHRydWUsIENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUwpO1xuXG5cdFx0aWYgKHRoaXMuX2Rpc2FibGVDb2xvcilcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldENvbG9yTWFzayhmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG5cblx0XHR0aGlzLmRyYXdSZW5kZXJhYmxlcyh0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQsIGVudGl0eUNvbGxlY3Rvcik7XG5cblx0XHRpZiAodGhpcy5fcmVuZGVyQmxlbmRlZClcblx0XHRcdHRoaXMuZHJhd1JlbmRlcmFibGVzKHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQsIGVudGl0eUNvbGxlY3Rvcik7XG5cblx0XHRpZiAodGhpcy5fZGlzYWJsZUNvbG9yKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0Q29sb3JNYXNrKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBkcmF3Q2FzY2FkZVJlbmRlcmFibGVzKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIGNhbWVyYTpDYW1lcmEsIGN1bGxQbGFuZXM6QXJyYXk8UGxhbmUzRD4pXG5cdHtcblx0XHR2YXIgcmVuZGVyYWJsZTI6UmVuZGVyYWJsZUJhc2U7XG5cdFx0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xuXHRcdHZhciBwYXNzOlJlbmRlclBhc3NCYXNlO1xuXG5cdFx0d2hpbGUgKHJlbmRlcmFibGUpIHtcblx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTtcblx0XHRcdHJlbmRlck9iamVjdCA9IHJlbmRlcmFibGUucmVuZGVyT2JqZWN0O1xuXHRcdFx0cGFzcyA9IHJlbmRlck9iamVjdC5wYXNzZXNbMF0gLy9hc3N1bWluZyBvbmx5IG9uZSBwYXNzIHBlciBtYXRlcmlhbFxuXG5cdFx0XHR0aGlzLmFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlLCBwYXNzLCBjYW1lcmEpO1xuXG5cdFx0XHRkbyB7XG5cdFx0XHRcdC8vIGlmIGNvbXBsZXRlbHkgaW4gZnJvbnQsIGl0IHdpbGwgZmFsbCBpbiBhIGRpZmZlcmVudCBjYXNjYWRlXG5cdFx0XHRcdC8vIGRvIG5vdCB1c2UgbmVhciBhbmQgZmFyIHBsYW5lc1xuXHRcdFx0XHRpZiAoIWN1bGxQbGFuZXMgfHwgcmVuZGVyYWJsZTIuc291cmNlRW50aXR5LndvcmxkQm91bmRzLmlzSW5GcnVzdHVtKGN1bGxQbGFuZXMsIDQpKSB7XG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIuX2lSZW5kZXIocGFzcywgY2FtZXJhLCB0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlbmRlcmFibGUyLmNhc2NhZGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTIubmV4dDtcblxuXHRcdFx0fSB3aGlsZSAocmVuZGVyYWJsZTIgJiYgcmVuZGVyYWJsZTIucmVuZGVyT2JqZWN0ID09IHJlbmRlck9iamVjdCAmJiAhcmVuZGVyYWJsZTIuY2FzY2FkZWQpO1xuXG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVQYXNzKHJlbmRlcmFibGUsIHBhc3MpO1xuXG5cdFx0XHRyZW5kZXJhYmxlID0gcmVuZGVyYWJsZTI7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIERyYXcgYSBsaXN0IG9mIHJlbmRlcmFibGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVuZGVyYWJsZXMgVGhlIHJlbmRlcmFibGVzIHRvIGRyYXcuXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBjb250YWluaW5nIGFsbCBwb3RlbnRpYWxseSB2aXNpYmxlIGluZm9ybWF0aW9uLlxuXHQgKi9cblx0cHVibGljIGRyYXdSZW5kZXJhYmxlcyhyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3Rvcilcblx0e1xuXHRcdHZhciBpOm51bWJlcjtcblx0XHR2YXIgbGVuOm51bWJlcjtcblx0XHR2YXIgcmVuZGVyYWJsZTI6UmVuZGVyYWJsZUJhc2U7XG5cdFx0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xuXHRcdHZhciBwYXNzZXM6QXJyYXk8UmVuZGVyUGFzc0Jhc2U+O1xuXHRcdHZhciBwYXNzOlJlbmRlclBhc3NCYXNlO1xuXHRcdHZhciBjYW1lcmE6Q2FtZXJhID0gZW50aXR5Q29sbGVjdG9yLmNhbWVyYTtcblxuXG5cdFx0d2hpbGUgKHJlbmRlcmFibGUpIHtcblx0XHRcdHJlbmRlck9iamVjdCA9IHJlbmRlcmFibGUucmVuZGVyT2JqZWN0O1xuXHRcdFx0cGFzc2VzID0gcmVuZGVyT2JqZWN0LnBhc3NlcztcblxuXHRcdFx0Ly8gb3RoZXJ3aXNlIHRoaXMgd291bGQgcmVzdWx0IGluIGRlcHRoIHJlbmRlcmVkIGFueXdheSBiZWNhdXNlIGZyYWdtZW50IHNoYWRlciBraWwgaXMgaWdub3JlZFxuXHRcdFx0aWYgKHRoaXMuX2Rpc2FibGVDb2xvciAmJiByZW5kZXJPYmplY3QuX3JlbmRlck9iamVjdE93bmVyLmFscGhhVGhyZXNob2xkICE9IDApIHtcblx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlO1xuXHRcdFx0XHQvLyBmYXN0IGZvcndhcmRcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTIubmV4dDtcblxuXHRcdFx0XHR9IHdoaWxlIChyZW5kZXJhYmxlMiAmJiByZW5kZXJhYmxlMi5yZW5kZXJPYmplY3QgPT0gcmVuZGVyT2JqZWN0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vaXRlcmF0ZSB0aHJvdWdoIGVhY2ggc2hhZGVyIG9iamVjdFxuXHRcdFx0XHRsZW4gPSBwYXNzZXMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XG5cdFx0XHRcdFx0cGFzcyA9IHBhc3Nlc1tpXTtcblxuXHRcdFx0XHRcdHRoaXMuYWN0aXZhdGVQYXNzKHJlbmRlcmFibGUsIHBhc3MsIGNhbWVyYSk7XG5cblx0XHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0XHRyZW5kZXJhYmxlMi5faVJlbmRlcihwYXNzLCBjYW1lcmEsIHRoaXMuX3BSdHRWaWV3UHJvamVjdGlvbk1hdHJpeCk7XG5cblx0XHRcdFx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTIubmV4dDtcblxuXHRcdFx0XHRcdH0gd2hpbGUgKHJlbmRlcmFibGUyICYmIHJlbmRlcmFibGUyLnJlbmRlck9iamVjdCA9PSByZW5kZXJPYmplY3QpO1xuXG5cdFx0XHRcdFx0dGhpcy5kZWFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlLCBwYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZW5kZXJhYmxlID0gcmVuZGVyYWJsZTI7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEFzc2lnbiB0aGUgY29udGV4dCBvbmNlIHJldHJpZXZlZFxuXHQgKi9cblx0cHJpdmF0ZSBvbkNvbnRleHRVcGRhdGUoZXZlbnQ6RXZlbnQpXG5cdHtcblx0XHR0aGlzLl9wQ29udGV4dCA9IDxJQ29udGV4dEdMPiB0aGlzLl9wU3RhZ2UuY29udGV4dDtcblx0fVxuXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kQWxwaGEoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZEFscGhhKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kQWxwaGEgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9iYWNrZ3JvdW5kQWxwaGEgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHQvKlxuXHQgcHVibGljIGdldCBpQmFja2dyb3VuZCgpOlRleHR1cmUyREJhc2Vcblx0IHtcblx0IHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuXHQgfVxuXHQgKi9cblxuXHQvKlxuXHQgcHVibGljIHNldCBpQmFja2dyb3VuZCh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHQge1xuXHQgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyICYmICF2YWx1ZSkge1xuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIuZGlzcG9zZSgpO1xuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgPSBudWxsO1xuXHQgfVxuXG5cdCBpZiAoIXRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyICYmIHZhbHVlKVxuXHQge1xuXG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciA9IG5ldyBCYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcih0aGlzLl9wU3RhZ2UpO1xuXG5cdCB9XG5cblxuXHQgdGhpcy5fYmFja2dyb3VuZCA9IHZhbHVlO1xuXG5cdCBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpXG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci50ZXh0dXJlID0gdmFsdWU7XG5cdCB9XG5cdCAqL1xuXHQvKlxuXHQgcHVibGljIGdldCBiYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcigpOkJhY2tncm91bmRJbWFnZVJlbmRlcmVyXG5cdCB7XG5cdCByZXR1cm4gX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyO1xuXHQgfVxuXHQgKi9cblxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBub3RpZnlTY2lzc29yVXBkYXRlKClcblx0e1xuXHRcdGlmICh0aGlzLl9zY2lzc29yRGlydHkpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9zY2lzc29yRGlydHkgPSB0cnVlO1xuXG5cdFx0aWYgKCF0aGlzLl9zY2lzc29yVXBkYXRlZClcblx0XHRcdHRoaXMuX3NjaXNzb3JVcGRhdGVkID0gbmV3IFJlbmRlcmVyRXZlbnQoUmVuZGVyZXJFdmVudC5TQ0lTU09SX1VQREFURUQpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3NjaXNzb3JVcGRhdGVkKTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIG5vdGlmeVZpZXdwb3J0VXBkYXRlKClcblx0e1xuXHRcdGlmICh0aGlzLl92aWV3cG9ydERpcnR5KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fdmlld3BvcnREaXJ0eSA9IHRydWU7XG5cblx0XHRpZiAoIXRoaXMuX3ZpZXdQb3J0VXBkYXRlZClcblx0XHRcdHRoaXMuX3ZpZXdQb3J0VXBkYXRlZCA9IG5ldyBSZW5kZXJlckV2ZW50KFJlbmRlcmVyRXZlbnQuVklFV1BPUlRfVVBEQVRFRCk7XG5cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fdmlld1BvcnRVcGRhdGVkKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIG9uVmlld3BvcnRVcGRhdGVkKGV2ZW50OlN0YWdlRXZlbnQpXG5cdHtcblx0XHR0aGlzLl92aWV3UG9ydCA9IHRoaXMuX3BTdGFnZS52aWV3UG9ydDtcblx0XHQvL1RPRE8gc3RvcCBmaXJpbmcgdmlld3BvcnQgdXBkYXRlZCBmb3IgZXZlcnkgc3RhZ2VnbCB2aWV3cG9ydCBjaGFuZ2VcblxuXHRcdGlmICh0aGlzLl9zaGFyZUNvbnRleHQpIHtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC54ID0gdGhpcy5fZ2xvYmFsUG9zLnggLSB0aGlzLl9wU3RhZ2UueDtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC55ID0gdGhpcy5fZ2xvYmFsUG9zLnkgLSB0aGlzLl9wU3RhZ2UueTtcblx0XHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMubm90aWZ5Vmlld3BvcnRVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHVwZGF0ZUdsb2JhbFBvcygpXG5cdHtcblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0KSB7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IHRoaXMuX2dsb2JhbFBvcy54IC0gdGhpcy5fdmlld1BvcnQueDtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC55ID0gdGhpcy5fZ2xvYmFsUG9zLnkgLSB0aGlzLl92aWV3UG9ydC55O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IDA7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IDA7XG5cdFx0XHR0aGlzLl92aWV3UG9ydC54ID0gdGhpcy5fZ2xvYmFsUG9zLng7XG5cdFx0XHR0aGlzLl92aWV3UG9ydC55ID0gdGhpcy5fZ2xvYmFsUG9zLnk7XG5cdFx0fVxuXG5cdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHJlbmRlcmFibGVcblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0cHVibGljIGFwcGx5UmVuZGVyYWJsZShyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlKVxuXHR7XG5cdFx0Ly9zZXQgbG9jYWwgdmFycyBmb3IgZmFzdGVyIHJlZmVyZW5jaW5nXG5cdFx0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlID0gdGhpcy5fcEdldFJlbmRlck9iamVjdChyZW5kZXJhYmxlLCByZW5kZXJhYmxlLnJlbmRlck9iamVjdE93bmVyIHx8IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuZ2V0RGVmYXVsdE1hdGVyaWFsKHJlbmRlcmFibGUucmVuZGVyYWJsZU93bmVyKSk7XG5cblx0XHRyZW5kZXJhYmxlLnJlbmRlck9iamVjdCA9IHJlbmRlck9iamVjdDtcblx0XHRyZW5kZXJhYmxlLnJlbmRlck9iamVjdElkID0gcmVuZGVyT2JqZWN0LnJlbmRlck9iamVjdElkO1xuXHRcdHJlbmRlcmFibGUucmVuZGVyT3JkZXJJZCA9IHJlbmRlck9iamVjdC5yZW5kZXJPcmRlcklkO1xuXG5cdFx0cmVuZGVyYWJsZS5jYXNjYWRlZCA9IGZhbHNlO1xuXG5cdFx0dmFyIGVudGl0eTpJRW50aXR5ID0gcmVuZGVyYWJsZS5zb3VyY2VFbnRpdHk7XG5cdFx0dmFyIHBvc2l0aW9uOlZlY3RvcjNEID0gZW50aXR5LnNjZW5lUG9zaXRpb247XG5cblx0XHQvLyBwcm9qZWN0IG9udG8gY2FtZXJhJ3Mgei1heGlzXG5cdFx0cG9zaXRpb24gPSB0aGlzLl9pRW50cnlQb2ludC5zdWJ0cmFjdChwb3NpdGlvbik7XG5cdFx0cmVuZGVyYWJsZS56SW5kZXggPSBlbnRpdHkuek9mZnNldCArIHBvc2l0aW9uLmRvdFByb2R1Y3QodGhpcy5fcENhbWVyYUZvcndhcmQpO1xuXG5cdFx0Ly9zdG9yZSByZWZlcmVuY2UgdG8gc2NlbmUgdHJhbnNmb3JtXG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJTY2VuZVRyYW5zZm9ybSA9IHJlbmRlcmFibGUuc291cmNlRW50aXR5LmdldFJlbmRlclNjZW5lVHJhbnNmb3JtKHRoaXMuX3BDYW1lcmEpO1xuXG5cdFx0aWYgKHJlbmRlck9iamVjdC5yZXF1aXJlc0JsZW5kaW5nKSB7XG5cdFx0XHRyZW5kZXJhYmxlLm5leHQgPSB0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkO1xuXHRcdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IHJlbmRlcmFibGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbmRlcmFibGUubmV4dCA9IHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZDtcblx0XHRcdHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCA9IHJlbmRlcmFibGU7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcE51bVRyaWFuZ2xlcyArPSByZW5kZXJhYmxlLm51bVRyaWFuZ2xlcztcblxuXHRcdC8vaGFuZGxlIGFueSBvdmVyZmxvdyBmb3IgcmVuZGVyYWJsZXMgd2l0aCBkYXRhIHRoYXQgZXhjZWVkcyBHUFUgbGltaXRhdGlvbnNcblx0XHRpZiAocmVuZGVyYWJsZS5vdmVyZmxvdylcblx0XHRcdHRoaXMuYXBwbHlSZW5kZXJhYmxlKHJlbmRlcmFibGUub3ZlcmZsb3cpO1xuXHR9XG5cblx0cHVibGljIF9wR2V0UmVuZGVyT2JqZWN0KHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHJlbmRlck9iamVjdE93bmVyOklSZW5kZXJPYmplY3RPd25lcik6UmVuZGVyT2JqZWN0QmFzZVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxufVxuXG5leHBvcnQgPSBSZW5kZXJlckJhc2U7Il19