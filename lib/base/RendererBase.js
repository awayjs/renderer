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
            //this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
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
    //private drawCascadeRenderables(renderable:RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
    //{
    //	var renderable2:RenderableBase;
    //	var renderObject:RenderObjectBase;
    //	var pass:RenderPassBase;
    //
    //	while (renderable) {
    //		renderable2 = renderable;
    //		renderObject = renderable.renderObject;
    //		pass = renderObject.passes[0] //assuming only one pass per material
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
    //		} while (renderable2 && renderable2.renderObject == renderObject && !renderable2.cascaded);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL1JlbmRlcmVyQmFzZS50cyJdLCJuYW1lcyI6WyJSZW5kZXJlckJhc2UiLCJSZW5kZXJlckJhc2UuY29uc3RydWN0b3IiLCJSZW5kZXJlckJhc2UucmVuZGVyQmxlbmRlZCIsIlJlbmRlcmVyQmFzZS5kaXNhYmxlQ29sb3IiLCJSZW5kZXJlckJhc2UubnVtVHJpYW5nbGVzIiwiUmVuZGVyZXJCYXNlLnZpZXdQb3J0IiwiUmVuZGVyZXJCYXNlLnNjaXNzb3JSZWN0IiwiUmVuZGVyZXJCYXNlLngiLCJSZW5kZXJlckJhc2UueSIsIlJlbmRlcmVyQmFzZS53aWR0aCIsIlJlbmRlcmVyQmFzZS5oZWlnaHQiLCJSZW5kZXJlckJhc2UuYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLmRlYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLl9pQ3JlYXRlRW50aXR5Q29sbGVjdG9yIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZFIiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kRyIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRCIiwiUmVuZGVyZXJCYXNlLmNvbnRleHQiLCJSZW5kZXJlckJhc2Uuc3RhZ2UiLCJSZW5kZXJlckJhc2UuaVNldFN0YWdlIiwiUmVuZGVyZXJCYXNlLnNoYXJlQ29udGV4dCIsIlJlbmRlcmVyQmFzZS5kaXNwb3NlIiwiUmVuZGVyZXJCYXNlLnJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlckNhc2NhZGVzIiwiUmVuZGVyZXJCYXNlLnBDb2xsZWN0UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2UucEV4ZWN1dGVSZW5kZXIiLCJSZW5kZXJlckJhc2UucXVldWVTbmFwc2hvdCIsIlJlbmRlcmVyQmFzZS5wRHJhdyIsIlJlbmRlcmVyQmFzZS5kcmF3UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2Uub25Db250ZXh0VXBkYXRlIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZEFscGhhIiwiUmVuZGVyZXJCYXNlLm5vdGlmeVNjaXNzb3JVcGRhdGUiLCJSZW5kZXJlckJhc2Uubm90aWZ5Vmlld3BvcnRVcGRhdGUiLCJSZW5kZXJlckJhc2Uub25WaWV3cG9ydFVwZGF0ZWQiLCJSZW5kZXJlckJhc2UudXBkYXRlR2xvYmFsUG9zIiwiUmVuZGVyZXJCYXNlLmFwcGx5UmVuZGVyYWJsZSIsIlJlbmRlcmVyQmFzZS5fcEdldFJlbmRlck9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFFaEUsSUFBTyxLQUFLLFdBQWdCLDRCQUE0QixDQUFDLENBQUM7QUFDMUQsSUFBTyxTQUFTLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUVqRSxJQUFPLG1CQUFtQixXQUFhLDRDQUE0QyxDQUFDLENBQUM7QUFDckYsSUFBTyxlQUFlLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQVM5RSxJQUFPLG1CQUFtQixXQUFhLDZDQUE2QyxDQUFDLENBQUM7QUFNdEYsSUFBTyxhQUFhLFdBQWMseUNBQXlDLENBQUMsQ0FBQztBQUM3RSxJQUFPLFVBQVUsV0FBZSxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXhFLElBQU8sZUFBZSxXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHbkYsSUFBTyxzQkFBc0IsV0FBWSxvREFBb0QsQ0FBQyxDQUFDO0FBRS9GLElBQU8saUJBQWlCLFdBQWEsc0RBQXNELENBQUMsQ0FBQztBQUM3RixJQUFPLG9CQUFvQixXQUFhLDhDQUE4QyxDQUFDLENBQUM7QUFDeEYsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBR3hGLElBQU8sWUFBWSxXQUFlLDBDQUEwQyxDQUFDLENBQUM7QUFVOUUsSUFBTyxnQkFBZ0IsV0FBYyw2Q0FBNkMsQ0FBQyxDQUFDO0FBR3BGLEFBTUE7Ozs7O0dBREc7SUFDRyxZQUFZO0lBQVNBLFVBQXJCQSxZQUFZQSxVQUF3QkE7SUFvTXpDQTs7T0FFR0E7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QSxVQUFVQSxDQUFDQSxhQUFhQSxHQUFHQSxZQUFZQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUV0REEsVUFBVUEsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLE1BQU1BLEdBQVdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO1FBQzdDQSxJQUFJQSxRQUFRQSxHQUFZQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUU3Q0EsQUFDQUEsK0JBRCtCQTtRQUMvQkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDaERBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBRS9FQSxBQUNBQSxvQ0FEb0NBO1FBQ3BDQSxVQUFVQSxDQUFDQSxvQkFBb0JBLEdBQUdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFFakdBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLFVBQVVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7WUFDL0NBLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDM0NBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLFVBQVVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7WUFDOUNBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDMUNBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLGNBQWNBLElBQUlBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO1FBRS9DQSxBQUNBQSw0RUFENEVBO1FBQzVFQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7SUFDNUNBLENBQUNBO0lBRU1wQyx3Q0FBaUJBLEdBQXhCQSxVQUF5QkEsVUFBeUJBLEVBQUVBLGlCQUFvQ0E7UUFFdkZxQyxNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUNGckMsbUJBQUNBO0FBQURBLENBcHpCQSxBQW96QkNBLEVBcHpCMEIsZUFBZSxFQW96QnpDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImJhc2UvUmVuZGVyZXJCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaXRtYXBEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9iYXNlL0JpdG1hcERhdGFcIik7XHJcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xyXG5pbXBvcnQgUGxhbmUzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1BsYW5lM0RcIik7XHJcbmltcG9ydCBQb2ludFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1BvaW50XCIpO1xyXG5pbXBvcnQgUmVjdGFuZ2xlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1JlY3RhbmdsZVwiKTtcclxuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XHJcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xyXG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiKTtcclxuaW1wb3J0IFRleHR1cmVQcm94eUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlUHJveHlCYXNlXCIpO1xyXG5pbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XHJcblxyXG5pbXBvcnQgTGluZVN1Yk1lc2hcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvTGluZVN1Yk1lc2hcIik7XHJcbmltcG9ydCBJUmVuZGVyT2JqZWN0T3duZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XHJcbmltcG9ydCBUcmlhbmdsZVN1Yk1lc2hcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViTWVzaFwiKTtcclxuaW1wb3J0IEVudGl0eUxpc3RJdGVtXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcG9vbC9FbnRpdHlMaXN0SXRlbVwiKTtcclxuaW1wb3J0IElFbnRpdHlTb3J0ZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L0lFbnRpdHlTb3J0ZXJcIik7XHJcbmltcG9ydCBSZW5kZXJhYmxlTWVyZ2VTb3J0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3NvcnQvUmVuZGVyYWJsZU1lcmdlU29ydFwiKTtcclxuaW1wb3J0IElSZW5kZXJlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcmVuZGVyL0lSZW5kZXJlclwiKTtcclxuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQmlsbGJvYXJkXCIpO1xyXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcclxuaW1wb3J0IElFbnRpdHlcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvSUVudGl0eVwiKTtcclxuaW1wb3J0IFNreWJveFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XHJcbmltcG9ydCBSZW5kZXJlckV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZXZlbnRzL1JlbmRlcmVyRXZlbnRcIik7XHJcbmltcG9ydCBTdGFnZUV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ldmVudHMvU3RhZ2VFdmVudFwiKTtcclxuaW1wb3J0IE1hdGVyaWFsQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcclxuaW1wb3J0IEVudGl0eUNvbGxlY3Rvclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3RyYXZlcnNlL0VudGl0eUNvbGxlY3RvclwiKTtcclxuaW1wb3J0IENvbGxlY3RvckJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9Db2xsZWN0b3JCYXNlXCIpO1xyXG5pbXBvcnQgU2hhZG93Q2FzdGVyQ29sbGVjdG9yXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9TaGFkb3dDYXN0ZXJDb2xsZWN0b3JcIik7XHJcbmltcG9ydCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYW5hZ2Vycy9EZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXCIpO1xyXG5cclxuaW1wb3J0IEFHQUxNaW5pQXNzZW1ibGVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FnbHNsL2Fzc2VtYmxlci9BR0FMTWluaUFzc2VtYmxlclwiKTtcclxuaW1wb3J0IENvbnRleHRHTEJsZW5kRmFjdG9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQmxlbmRGYWN0b3JcIik7XHJcbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xyXG5pbXBvcnQgSUNvbnRleHRHTFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9JQ29udGV4dEdMXCIpO1xyXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcclxuaW1wb3J0IFN0YWdlTWFuYWdlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWFuYWdlcnMvU3RhZ2VNYW5hZ2VyXCIpO1xyXG5pbXBvcnQgUHJvZ3JhbURhdGFcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3Bvb2wvUHJvZ3JhbURhdGFcIik7XHJcblxyXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xyXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xyXG5pbXBvcnQgUmVuZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1JlbmRlck9iamVjdEJhc2VcIik7XHJcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XHJcbmltcG9ydCBJUmVuZGVyZXJQb29sQ2xhc3NcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9JUmVuZGVyZXJQb29sQ2xhc3NcIik7XHJcbmltcG9ydCBSVFRCdWZmZXJNYW5hZ2VyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWFuYWdlcnMvUlRUQnVmZmVyTWFuYWdlclwiKTtcclxuaW1wb3J0IFJlbmRlclBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL1JlbmRlclBhc3NCYXNlXCIpO1xyXG5pbXBvcnQgUmVuZGVyZXJQb29sQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyZXJQb29sQmFzZVwiKTtcclxuXHJcblxyXG4vKipcclxuICogUmVuZGVyZXJCYXNlIGZvcm1zIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGNsYXNzZXMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgcmVuZGVyaW5nIHBpcGVsaW5lIHRvIHJlbmRlciB0aGVcclxuICogY29udGVudHMgb2YgYSBwYXJ0aXRpb25cclxuICpcclxuICogQGNsYXNzIGF3YXkucmVuZGVyLlJlbmRlcmVyQmFzZVxyXG4gKi9cclxuY2xhc3MgUmVuZGVyZXJCYXNlIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyXHJcbntcclxuXHRwcml2YXRlIF9udW1Vc2VkU3RyZWFtczpudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX251bVVzZWRUZXh0dXJlczpudW1iZXIgPSAwO1xyXG5cclxuXHRwcml2YXRlIF9yZW5kZXJlclBvb2w6UmVuZGVyZXJQb29sQmFzZTtcclxuXHJcblx0cHVibGljIF9wUmVuZGVyZXJQb29sQ2xhc3M6SVJlbmRlcmVyUG9vbENsYXNzO1xyXG5cdHB1YmxpYyBfcENvbnRleHQ6SUNvbnRleHRHTDtcclxuXHRwdWJsaWMgX3BTdGFnZTpTdGFnZTtcclxuXHJcblx0cHVibGljIF9wQ2FtZXJhOkNhbWVyYTtcclxuXHRwdWJsaWMgX2lFbnRyeVBvaW50OlZlY3RvcjNEO1xyXG5cdHB1YmxpYyBfcENhbWVyYUZvcndhcmQ6VmVjdG9yM0Q7XHJcblxyXG5cdHB1YmxpYyBfcFJ0dEJ1ZmZlck1hbmFnZXI6UlRUQnVmZmVyTWFuYWdlcjtcclxuXHRwcml2YXRlIF92aWV3UG9ydDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKCk7XHJcblx0cHJpdmF0ZSBfdmlld3BvcnREaXJ0eTpib29sZWFuO1xyXG5cdHByaXZhdGUgX3NjaXNzb3JEaXJ0eTpib29sZWFuO1xyXG5cclxuXHRwdWJsaWMgX3BCYWNrQnVmZmVySW52YWxpZDpib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgX3BEZXB0aFRleHR1cmVJbnZhbGlkOmJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyBfZGVwdGhQcmVwYXNzOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9iYWNrZ3JvdW5kUjpudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX2JhY2tncm91bmRHOm51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEI6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9iYWNrZ3JvdW5kQWxwaGE6bnVtYmVyID0gMTtcclxuXHRwdWJsaWMgX3NoYXJlQ29udGV4dDpib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8vIG9ubHkgdXNlZCBieSByZW5kZXJlcnMgdGhhdCBuZWVkIHRvIHJlbmRlciBnZW9tZXRyeSB0byB0ZXh0dXJlc1xyXG5cdHB1YmxpYyBfd2lkdGg6bnVtYmVyO1xyXG5cdHB1YmxpYyBfaGVpZ2h0Om51bWJlcjtcclxuXHJcblx0cHVibGljIHRleHR1cmVSYXRpb1g6bnVtYmVyID0gMTtcclxuXHRwdWJsaWMgdGV4dHVyZVJhdGlvWTpudW1iZXIgPSAxO1xyXG5cclxuXHRwcml2YXRlIF9zbmFwc2hvdEJpdG1hcERhdGE6Qml0bWFwRGF0YTtcclxuXHRwcml2YXRlIF9zbmFwc2hvdFJlcXVpcmVkOmJvb2xlYW47XHJcblxyXG5cdHB1YmxpYyBfcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4Ok1hdHJpeDNEID0gbmV3IE1hdHJpeDNEKCk7XHJcblxyXG5cdHByaXZhdGUgX2xvY2FsUG9zOlBvaW50ID0gbmV3IFBvaW50KCk7XHJcblx0cHJpdmF0ZSBfZ2xvYmFsUG9zOlBvaW50ID0gbmV3IFBvaW50KCk7XHJcblx0cHVibGljIF9wU2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZSgpO1xyXG5cclxuXHRwcml2YXRlIF9zY2lzc29yVXBkYXRlZDpSZW5kZXJlckV2ZW50O1xyXG5cdHByaXZhdGUgX3ZpZXdQb3J0VXBkYXRlZDpSZW5kZXJlckV2ZW50O1xyXG5cclxuXHRwcml2YXRlIF9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZTpGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlO1xyXG5cclxuXHRwdWJsaWMgX3BOdW1UcmlhbmdsZXM6bnVtYmVyID0gMDtcclxuXHJcblx0cHVibGljIF9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ6UmVuZGVyYWJsZUJhc2U7XHJcblx0cHVibGljIF9wQmxlbmRlZFJlbmRlcmFibGVIZWFkOlJlbmRlcmFibGVCYXNlO1xyXG5cdHB1YmxpYyBfZGlzYWJsZUNvbG9yOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgX3JlbmRlckJsZW5kZWQ6Ym9vbGVhbiA9IHRydWU7XHJcblxyXG5cclxuXHRwdWJsaWMgZ2V0IHJlbmRlckJsZW5kZWQoKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JlbmRlckJsZW5kZWQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHJlbmRlckJsZW5kZWQodmFsdWU6Ym9vbGVhbilcclxuXHR7XHJcblx0XHR0aGlzLl9yZW5kZXJCbGVuZGVkID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHJcblx0cHVibGljIGdldCBkaXNhYmxlQ29sb3IoKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rpc2FibGVDb2xvcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZGlzYWJsZUNvbG9yKHZhbHVlOmJvb2xlYW4pXHJcblx0e1xyXG5cdFx0dGhpcy5fZGlzYWJsZUNvbG9yID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgbnVtVHJpYW5nbGVzKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BOdW1UcmlhbmdsZXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZW5kZXJhYmxlU29ydGVyOklFbnRpdHlTb3J0ZXI7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBBIHZpZXdQb3J0IHJlY3RhbmdsZSBlcXVpdmFsZW50IG9mIHRoZSBTdGFnZSBzaXplIGFuZCBwb3NpdGlvbi5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHZpZXdQb3J0KCk6UmVjdGFuZ2xlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZpZXdQb3J0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQSBzY2lzc29yIHJlY3RhbmdsZSBlcXVpdmFsZW50IG9mIHRoZSB2aWV3IHNpemUgYW5kIHBvc2l0aW9uLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgc2Npc3NvclJlY3QoKTpSZWN0YW5nbGVcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcFNjaXNzb3JSZWN0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHgoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxQb3MueDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgeCh2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMueCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2dsb2JhbFBvcy54ID0gdGhpcy5fbG9jYWxQb3MueCA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgeSgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9sb2NhbFBvcy55O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB5KHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHRpZiAodGhpcy55ID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fZ2xvYmFsUG9zLnkgPSB0aGlzLl9sb2NhbFBvcy55ID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0cHVibGljIGdldCB3aWR0aCgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl93aWR0aDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgd2lkdGgodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl93aWR0aCA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3dpZHRoID0gdmFsdWU7XHJcblx0XHR0aGlzLl9wU2Npc3NvclJlY3Qud2lkdGggPSB2YWx1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIpXHJcblx0XHRcdHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyLnZpZXdXaWR0aCA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XHJcblx0XHR0aGlzLl9wRGVwdGhUZXh0dXJlSW52YWxpZCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgaGVpZ2h0KCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaGVpZ2h0KHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHRpZiAodGhpcy5faGVpZ2h0ID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcblx0XHR0aGlzLl9wU2Npc3NvclJlY3QuaGVpZ2h0ID0gdmFsdWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyKVxyXG5cdFx0XHR0aGlzLl9wUnR0QnVmZmVyTWFuYWdlci52aWV3SGVpZ2h0ID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcclxuXHRcdHRoaXMuX3BEZXB0aFRleHR1cmVJbnZhbGlkID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgUmVuZGVyZXJCYXNlIG9iamVjdC5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3RvcihyZW5kZXJlclBvb2xDbGFzczpJUmVuZGVyZXJQb29sQ2xhc3MgPSBudWxsLCBzdGFnZTpTdGFnZSA9IG51bGwpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9wUmVuZGVyZXJQb29sQ2xhc3MgPSByZW5kZXJlclBvb2xDbGFzcztcclxuXHJcblx0XHR0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlID0gKGV2ZW50OlN0YWdlRXZlbnQpID0+IHRoaXMub25WaWV3cG9ydFVwZGF0ZWQoZXZlbnQpXHJcblx0XHR0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSA9IChldmVudDpFdmVudCkgPT4gdGhpcy5vbkNvbnRleHRVcGRhdGUoZXZlbnQpO1xyXG5cclxuXHRcdC8vZGVmYXVsdCBzb3J0aW5nIGFsZ29yaXRobVxyXG5cdFx0dGhpcy5yZW5kZXJhYmxlU29ydGVyID0gbmV3IFJlbmRlcmFibGVNZXJnZVNvcnQoKTtcclxuXHJcblx0XHR0aGlzLl9yZW5kZXJlclBvb2wgPSAocmVuZGVyZXJQb29sQ2xhc3MpPyBuZXcgdGhpcy5fcFJlbmRlcmVyUG9vbENsYXNzKHRoaXMpIDogbmV3IFJlbmRlcmVyUG9vbEJhc2UodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5zdGFnZSA9IHN0YWdlIHx8IFN0YWdlTWFuYWdlci5nZXRJbnN0YW5jZSgpLmdldEZyZWVTdGFnZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBwYXNzOlJlbmRlclBhc3NCYXNlLCBjYW1lcmE6Q2FtZXJhKVxyXG5cdHtcclxuXHRcdC8vY2xlYXIgdW51c2VkIHZlcnRleCBzdHJlYW1zXHJcblx0XHRmb3IgKHZhciBpID0gcGFzcy5zaGFkZXIubnVtVXNlZFN0cmVhbXM7IGkgPCB0aGlzLl9udW1Vc2VkU3RyZWFtczsgaSsrKVxyXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChpLCBudWxsKTtcclxuXHJcblx0XHQvL2NsZWFyIHVudXNlZCB0ZXh0dXJlIHN0cmVhbXNcclxuXHRcdGZvciAodmFyIGkgPSBwYXNzLnNoYWRlci5udW1Vc2VkVGV4dHVyZXM7IGkgPCB0aGlzLl9udW1Vc2VkVGV4dHVyZXM7IGkrKylcclxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VGV4dHVyZUF0KGksIG51bGwpO1xyXG5cclxuXHRcdC8vY2hlY2sgcHJvZ3JhbSBkYXRhIGlzIHVwbG9hZGVkXHJcblx0XHR2YXIgcHJvZ3JhbURhdGE6UHJvZ3JhbURhdGEgPSBwYXNzLnNoYWRlci5wcm9ncmFtRGF0YTtcclxuXHJcblx0XHRpZiAoIXByb2dyYW1EYXRhLnByb2dyYW0pIHtcclxuXHRcdFx0cHJvZ3JhbURhdGEucHJvZ3JhbSA9IHRoaXMuX3BDb250ZXh0LmNyZWF0ZVByb2dyYW0oKTtcclxuXHRcdFx0dmFyIHZlcnRleEJ5dGVDb2RlOkJ5dGVBcnJheSA9IChuZXcgQUdBTE1pbmlBc3NlbWJsZXIoKS5hc3NlbWJsZShcInBhcnQgdmVydGV4IDFcXG5cIiArIHByb2dyYW1EYXRhLnZlcnRleFN0cmluZyArIFwiZW5kcGFydFwiKSlbJ3ZlcnRleCddLmRhdGE7XHJcblx0XHRcdHZhciBmcmFnbWVudEJ5dGVDb2RlOkJ5dGVBcnJheSA9IChuZXcgQUdBTE1pbmlBc3NlbWJsZXIoKS5hc3NlbWJsZShcInBhcnQgZnJhZ21lbnQgMVxcblwiICsgcHJvZ3JhbURhdGEuZnJhZ21lbnRTdHJpbmcgKyBcImVuZHBhcnRcIikpWydmcmFnbWVudCddLmRhdGE7XHJcblx0XHRcdHByb2dyYW1EYXRhLnByb2dyYW0udXBsb2FkKHZlcnRleEJ5dGVDb2RlLCBmcmFnbWVudEJ5dGVDb2RlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL3NldCBwcm9ncmFtIGRhdGFcclxuXHRcdHRoaXMuX3BDb250ZXh0LnNldFByb2dyYW0ocHJvZ3JhbURhdGEucHJvZ3JhbSk7XHJcblxyXG5cdFx0Ly9hY3RpdmF0ZSBzaGFkZXIgb2JqZWN0IHRocm91Z2ggcmVuZGVyYWJsZVxyXG5cdFx0cmVuZGVyYWJsZS5faUFjdGl2YXRlKHBhc3MsIGNhbWVyYSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGVhY3RpdmF0ZVBhc3MocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgcGFzczpSZW5kZXJQYXNzQmFzZSlcclxuXHR7XHJcblx0XHQvL2RlYWN0aXZhdGUgc2hhZGVyIG9iamVjdFxyXG5cdFx0cmVuZGVyYWJsZS5faURlYWN0aXZhdGUocGFzcyk7XHJcblxyXG5cdFx0dGhpcy5fbnVtVXNlZFN0cmVhbXMgPSBwYXNzLnNoYWRlci5udW1Vc2VkU3RyZWFtcztcclxuXHRcdHRoaXMuX251bVVzZWRUZXh0dXJlcyA9IHBhc3Muc2hhZGVyLm51bVVzZWRUZXh0dXJlcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaUNyZWF0ZUVudGl0eUNvbGxlY3RvcigpOkNvbGxlY3RvckJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gbmV3IEVudGl0eUNvbGxlY3RvcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyByZWQgY29tcG9uZW50LCB1c2VkIHdoZW4gY2xlYXJpbmcuXHJcblx0ICpcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kUigpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kUjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kUih2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRSID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fYmFja2dyb3VuZFIgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyBncmVlbiBjb21wb25lbnQsIHVzZWQgd2hlbiBjbGVhcmluZy5cclxuXHQgKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0cHVibGljIGdldCBfaUJhY2tncm91bmRHKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRHO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBfaUJhY2tncm91bmRHKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZEcgPT0gdmFsdWUpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9iYWNrZ3JvdW5kRyA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgYmFja2dyb3VuZCBjb2xvcidzIGJsdWUgY29tcG9uZW50LCB1c2VkIHdoZW4gY2xlYXJpbmcuXHJcblx0ICpcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kQigpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kQih2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRCID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fYmFja2dyb3VuZEIgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb250ZXh0KCk6SUNvbnRleHRHTFxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9wQ29udGV4dDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBTdGFnZSB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgQ29udGV4dEdMIHVzZWQgZm9yIHJlbmRlcmluZy5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHN0YWdlKCk6U3RhZ2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcFN0YWdlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzdGFnZSh2YWx1ZTpTdGFnZSlcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fcFN0YWdlID09IHZhbHVlKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5pU2V0U3RhZ2UodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGlTZXRTdGFnZSh2YWx1ZTpTdGFnZSlcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fcFN0YWdlKVxyXG5cdFx0XHR0aGlzLmRpc3Bvc2UoKTtcclxuXHJcblx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0dGhpcy5fcFN0YWdlID0gdmFsdWU7XHJcblxyXG5cdFx0XHR0aGlzLl9yZW5kZXJlclBvb2wuc3RhZ2UgPSB0aGlzLl9wU3RhZ2U7XHJcblxyXG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xyXG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfUkVDUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XHJcblx0XHRcdHRoaXMuX3BTdGFnZS5hZGRFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuVklFV1BPUlRfVVBEQVRFRCwgdGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSk7XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgaWYgKF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcilcclxuXHRcdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5zdGFnZSA9IHZhbHVlO1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0aWYgKHRoaXMuX3BTdGFnZS5jb250ZXh0KVxyXG5cdFx0XHRcdHRoaXMuX3BDb250ZXh0ID0gPElDb250ZXh0R0w+IHRoaXMuX3BTdGFnZS5jb250ZXh0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlZmVycyBjb250cm9sIG9mIENvbnRleHRHTCBjbGVhcigpIGFuZCBwcmVzZW50KCkgY2FsbHMgdG8gU3RhZ2UsIGVuYWJsaW5nIG11bHRpcGxlIFN0YWdlIGZyYW1ld29ya3NcclxuXHQgKiB0byBzaGFyZSB0aGUgc2FtZSBDb250ZXh0R0wgb2JqZWN0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgc2hhcmVDb250ZXh0KCk6Ym9vbGVhblxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9zaGFyZUNvbnRleHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNoYXJlQ29udGV4dCh2YWx1ZTpib29sZWFuKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9zaGFyZUNvbnRleHQgPT0gdmFsdWUpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9zaGFyZUNvbnRleHQgPSB2YWx1ZTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGlzcG9zZXMgdGhlIHJlc291cmNlcyB1c2VkIGJ5IHRoZSBSZW5kZXJlckJhc2UuXHJcblx0ICovXHJcblx0cHVibGljIGRpc3Bvc2UoKVxyXG5cdHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyUG9vbC5kaXNwb3NlKCk7XHJcblxyXG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX0NSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcclxuXHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuQ09OVEVYVF9SRUNSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcclxuXHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuVklFV1BPUlRfVVBEQVRFRCwgdGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSk7XHJcblxyXG5cdFx0dGhpcy5fcFN0YWdlID0gbnVsbDtcclxuXHRcdHRoaXMuX3BDb250ZXh0ID0gbnVsbDtcclxuXHRcdC8qXHJcblx0XHQgaWYgKF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcikge1xyXG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5kaXNwb3NlKCk7XHJcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyID0gbnVsbDtcclxuXHRcdCB9XHJcblx0XHQgKi9cclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW5kZXIoZW50aXR5Q29sbGVjdG9yOkNvbGxlY3RvckJhc2UpXHJcblx0e1xyXG5cdFx0dGhpcy5fdmlld3BvcnREaXJ0eSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fc2Npc3NvckRpcnR5ID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZW5kZXJzIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5IHRvIHRoZSBiYWNrIGJ1ZmZlciBvciB0ZXh0dXJlLlxyXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBvYmplY3QgY29udGFpbmluZyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeS5cclxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbiB0YXJnZXQgdGV4dHVyZSB0byByZW5kZXIgdG8uXHJcblx0ICogQHBhcmFtIHN1cmZhY2VTZWxlY3RvciBUaGUgaW5kZXggb2YgYSBDdWJlVGV4dHVyZSdzIGZhY2UgdG8gcmVuZGVyIHRvLlxyXG5cdCAqIEBwYXJhbSBhZGRpdGlvbmFsQ2xlYXJNYXNrIEFkZGl0aW9uYWwgY2xlYXIgbWFzayBpbmZvcm1hdGlvbiwgaW4gY2FzZSBleHRyYSBjbGVhciBjaGFubmVscyBhcmUgdG8gYmUgb21pdHRlZC5cclxuXHQgKi9cclxuXHRwdWJsaWMgX2lSZW5kZXIoZW50aXR5Q29sbGVjdG9yOkNvbGxlY3RvckJhc2UsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlID0gbnVsbCwgc2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbnVsbCwgc3VyZmFjZVNlbGVjdG9yOm51bWJlciA9IDApXHJcblx0e1xyXG5cdFx0Ly9UT0RPIHJlZmFjdG9yIHNldFRhcmdldCBzbyB0aGF0IHJlbmRlcnRleHR1cmVzIGFyZSBjcmVhdGVkIGJlZm9yZSB0aGlzIGNoZWNrXHJcblx0XHRpZiAoIXRoaXMuX3BTdGFnZSB8fCAhdGhpcy5fcENvbnRleHQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXguY29weUZyb20oZW50aXR5Q29sbGVjdG9yLmNhbWVyYS52aWV3UHJvamVjdGlvbik7XHJcblx0XHR0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXguYXBwZW5kU2NhbGUodGhpcy50ZXh0dXJlUmF0aW9YLCB0aGlzLnRleHR1cmVSYXRpb1ksIDEpO1xyXG5cclxuXHRcdHRoaXMucEV4ZWN1dGVSZW5kZXIoZW50aXR5Q29sbGVjdG9yLCB0YXJnZXQsIHNjaXNzb3JSZWN0LCBzdXJmYWNlU2VsZWN0b3IpO1xyXG5cclxuXHRcdC8vIGdlbmVyYXRlIG1pcCBtYXBzIG9uIHRhcmdldCAoaWYgdGFyZ2V0IGV4aXN0cykgLy9UT0RPXHJcblx0XHQvL2lmICh0YXJnZXQpXHJcblx0XHQvL1x0KDxUZXh0dXJlPnRhcmdldCkuZ2VuZXJhdGVNaXBtYXBzKCk7XHJcblxyXG5cdFx0Ly8gY2xlYXIgYnVmZmVyc1xyXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgODsgKytpKSB7XHJcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xyXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRUZXh0dXJlQXQoaSwgbnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2lSZW5kZXJDYXNjYWRlcyhlbnRpdHlDb2xsZWN0b3I6U2hhZG93Q2FzdGVyQ29sbGVjdG9yLCB0YXJnZXQ6VGV4dHVyZVByb3h5QmFzZSwgbnVtQ2FzY2FkZXM6bnVtYmVyLCBzY2lzc29yUmVjdHM6QXJyYXk8UmVjdGFuZ2xlPiwgY2FtZXJhczpBcnJheTxDYW1lcmE+KVxyXG5cdHtcclxuXHRcdHRoaXMucENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3IpO1xyXG5cclxuXHRcdHRoaXMuX3BTdGFnZS5zZXRSZW5kZXJUYXJnZXQodGFyZ2V0LCB0cnVlLCAwKTtcclxuXHRcdHRoaXMuX3BDb250ZXh0LmNsZWFyKDEsIDEsIDEsIDEsIDEsIDApO1xyXG5cclxuXHRcdHRoaXMuX3BDb250ZXh0LnNldEJsZW5kRmFjdG9ycyhDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkUsIENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk8pO1xyXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KHRydWUsIENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1MpO1xyXG5cclxuXHRcdHZhciBoZWFkOlJlbmRlcmFibGVCYXNlID0gdGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkO1xyXG5cclxuXHRcdHZhciBmaXJzdDpib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0XHQvL1RPRE8gY2FzY2FkZXMgbXVzdCBoYXZlIHNlcGFyYXRlIGNvbGxlY3RvcnMsIHJhdGhlciB0aGFuIHNlcGFyYXRlIGRyYXcgY29tbWFuZHNcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gbnVtQ2FzY2FkZXMgLSAxOyBpID49IDA7IC0taSkge1xyXG5cdFx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBzY2lzc29yUmVjdHNbaV07XHJcblx0XHRcdC8vdGhpcy5kcmF3Q2FzY2FkZVJlbmRlcmFibGVzKGhlYWQsIGNhbWVyYXNbaV0sIGZpcnN0PyBudWxsIDogY2FtZXJhc1tpXS5mcnVzdHVtUGxhbmVzKTtcclxuXHRcdFx0Zmlyc3QgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvL2xpbmUgcmVxdWlyZWQgZm9yIGNvcnJlY3QgcmVuZGVyaW5nIHdoZW4gdXNpbmcgYXdheTNkIHdpdGggc3RhcmxpbmcuIERPIE5PVCBSRU1PVkUgVU5MRVNTIFNUQVJMSU5HIElOVEVHUkFUSU9OIElTIFJFVEVTVEVEIVxyXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcclxuXHJcblx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHBDb2xsZWN0UmVuZGVyYWJsZXMoZW50aXR5Q29sbGVjdG9yOkNvbGxlY3RvckJhc2UpXHJcblx0e1xyXG5cdFx0Ly9yZXNldCBoZWFkIHZhbHVlc1xyXG5cdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IG51bGw7XHJcblx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSBudWxsO1xyXG5cdFx0dGhpcy5fcE51bVRyaWFuZ2xlcyA9IDA7XHJcblxyXG5cdFx0Ly9ncmFiIGVudGl0eSBoZWFkXHJcblx0XHR2YXIgaXRlbTpFbnRpdHlMaXN0SXRlbSA9IGVudGl0eUNvbGxlY3Rvci5lbnRpdHlIZWFkO1xyXG5cclxuXHRcdC8vc2V0IHRlbXAgdmFsdWVzIGZvciBlbnRyeSBwb2ludCBhbmQgY2FtZXJhIGZvcndhcmQgdmVjdG9yXHJcblx0XHR0aGlzLl9wQ2FtZXJhID0gZW50aXR5Q29sbGVjdG9yLmNhbWVyYTtcclxuXHRcdHRoaXMuX2lFbnRyeVBvaW50ID0gdGhpcy5fcENhbWVyYS5zY2VuZVBvc2l0aW9uO1xyXG5cdFx0dGhpcy5fcENhbWVyYUZvcndhcmQgPSB0aGlzLl9wQ2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkVmVjdG9yO1xyXG5cclxuXHRcdC8vaXRlcmF0ZSB0aHJvdWdoIGFsbCBlbnRpdGllc1xyXG5cdFx0d2hpbGUgKGl0ZW0pIHtcclxuXHRcdFx0aXRlbS5lbnRpdHkuX2lDb2xsZWN0UmVuZGVyYWJsZXModGhpcy5fcmVuZGVyZXJQb29sKTtcclxuXHRcdFx0aXRlbSA9IGl0ZW0ubmV4dDtcclxuXHRcdH1cclxuXHJcblx0XHQvL3NvcnQgdGhlIHJlc3VsdGluZyByZW5kZXJhYmxlc1xyXG5cdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gPFJlbmRlcmFibGVCYXNlPiB0aGlzLnJlbmRlcmFibGVTb3J0ZXIuc29ydE9wYXF1ZVJlbmRlcmFibGVzKHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCk7XHJcblx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gPFJlbmRlcmFibGVCYXNlPiB0aGlzLnJlbmRlcmFibGVTb3J0ZXIuc29ydEJsZW5kZWRSZW5kZXJhYmxlcyh0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlbmRlcnMgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkgdG8gdGhlIGJhY2sgYnVmZmVyIG9yIHRleHR1cmUuIE9ubHkgZXhlY3V0ZWQgaWYgZXZlcnl0aGluZyBpcyBzZXQgdXAuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkuXHJcblx0ICogQHBhcmFtIHRhcmdldCBBbiBvcHRpb24gdGFyZ2V0IHRleHR1cmUgdG8gcmVuZGVyIHRvLlxyXG5cdCAqIEBwYXJhbSBzdXJmYWNlU2VsZWN0b3IgVGhlIGluZGV4IG9mIGEgQ3ViZVRleHR1cmUncyBmYWNlIHRvIHJlbmRlciB0by5cclxuXHQgKiBAcGFyYW0gYWRkaXRpb25hbENsZWFyTWFzayBBZGRpdGlvbmFsIGNsZWFyIG1hc2sgaW5mb3JtYXRpb24sIGluIGNhc2UgZXh0cmEgY2xlYXIgY2hhbm5lbHMgYXJlIHRvIGJlIG9taXR0ZWQuXHJcblx0ICovXHJcblx0cHVibGljIHBFeGVjdXRlUmVuZGVyKGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlLCB0YXJnZXQ6VGV4dHVyZVByb3h5QmFzZSA9IG51bGwsIHNjaXNzb3JSZWN0OlJlY3RhbmdsZSA9IG51bGwsIHN1cmZhY2VTZWxlY3RvcjpudW1iZXIgPSAwKVxyXG5cdHtcclxuXHRcdHRoaXMuX3BTdGFnZS5zZXRSZW5kZXJUYXJnZXQodGFyZ2V0LCB0cnVlLCBzdXJmYWNlU2VsZWN0b3IpO1xyXG5cclxuXHRcdGlmICgodGFyZ2V0IHx8ICF0aGlzLl9zaGFyZUNvbnRleHQpICYmICF0aGlzLl9kZXB0aFByZXBhc3MpXHJcblx0XHRcdHRoaXMuX3BDb250ZXh0LmNsZWFyKHRoaXMuX2JhY2tncm91bmRSLCB0aGlzLl9iYWNrZ3JvdW5kRywgdGhpcy5fYmFja2dyb3VuZEIsIHRoaXMuX2JhY2tncm91bmRBbHBoYSwgMSwgMCk7XHJcblxyXG5cdFx0dGhpcy5fcFN0YWdlLnNjaXNzb3JSZWN0ID0gc2Npc3NvclJlY3Q7XHJcblxyXG5cdFx0LypcclxuXHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxyXG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5yZW5kZXIoKTtcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5wQ29sbGVjdFJlbmRlcmFibGVzKGVudGl0eUNvbGxlY3Rvcik7XHJcblxyXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0QmxlbmRGYWN0b3JzKENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORSwgQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTyk7XHJcblxyXG5cdFx0dGhpcy5wRHJhdyhlbnRpdHlDb2xsZWN0b3IpO1xyXG5cclxuXHRcdC8vbGluZSByZXF1aXJlZCBmb3IgY29ycmVjdCByZW5kZXJpbmcgd2hlbiB1c2luZyBhd2F5M2Qgd2l0aCBzdGFybGluZy4gRE8gTk9UIFJFTU9WRSBVTkxFU1MgU1RBUkxJTkcgSU5URUdSQVRJT04gSVMgUkVURVNURUQhXHJcblx0XHQvL3RoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdChmYWxzZSwgQ29udGV4dEdMQ29tcGFyZU1vZGUuTEVTU19FUVVBTCk7IC8vb29wc2llXHJcblxyXG5cdFx0aWYgKCF0aGlzLl9zaGFyZUNvbnRleHQpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgJiYgdGhpcy5fc25hcHNob3RCaXRtYXBEYXRhKSB7XHJcblx0XHRcdFx0dGhpcy5fcENvbnRleHQuZHJhd1RvQml0bWFwRGF0YSh0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEpO1xyXG5cdFx0XHRcdHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCAqIFdpbGwgZHJhdyB0aGUgcmVuZGVyZXIncyBvdXRwdXQgb24gbmV4dCByZW5kZXIgdG8gdGhlIHByb3ZpZGVkIGJpdG1hcCBkYXRhLlxyXG5cdCAqICovXHJcblx0cHVibGljIHF1ZXVlU25hcHNob3QoYm1kOkJpdG1hcERhdGEpXHJcblx0e1xyXG5cdFx0dGhpcy5fc25hcHNob3RSZXF1aXJlZCA9IHRydWU7XHJcblx0XHR0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEgPSBibWQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBQZXJmb3JtcyB0aGUgYWN0dWFsIGRyYXdpbmcgb2YgZ2VvbWV0cnkgdG8gdGhlIHRhcmdldC5cclxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkuXHJcblx0ICovXHJcblx0cHVibGljIHBEcmF3KGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlKVxyXG5cdHtcclxuXHRcdHRoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcclxuXHJcblx0XHRpZiAodGhpcy5fZGlzYWJsZUNvbG9yKVxyXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRDb2xvck1hc2soZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG5cclxuXHRcdHRoaXMuZHJhd1JlbmRlcmFibGVzKHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCwgZW50aXR5Q29sbGVjdG9yKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcmVuZGVyQmxlbmRlZClcclxuXHRcdFx0dGhpcy5kcmF3UmVuZGVyYWJsZXModGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCwgZW50aXR5Q29sbGVjdG9yKTtcclxuXHJcblx0XHRpZiAodGhpcy5fZGlzYWJsZUNvbG9yKVxyXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRDb2xvck1hc2sodHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHQvL3ByaXZhdGUgZHJhd0Nhc2NhZGVSZW5kZXJhYmxlcyhyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBjYW1lcmE6Q2FtZXJhLCBjdWxsUGxhbmVzOkFycmF5PFBsYW5lM0Q+KVxyXG5cdC8ve1xyXG5cdC8vXHR2YXIgcmVuZGVyYWJsZTI6UmVuZGVyYWJsZUJhc2U7XHJcblx0Ly9cdHZhciByZW5kZXJPYmplY3Q6UmVuZGVyT2JqZWN0QmFzZTtcclxuXHQvL1x0dmFyIHBhc3M6UmVuZGVyUGFzc0Jhc2U7XHJcblx0Ly9cclxuXHQvL1x0d2hpbGUgKHJlbmRlcmFibGUpIHtcclxuXHQvL1x0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XHJcblx0Ly9cdFx0cmVuZGVyT2JqZWN0ID0gcmVuZGVyYWJsZS5yZW5kZXJPYmplY3Q7XHJcblx0Ly9cdFx0cGFzcyA9IHJlbmRlck9iamVjdC5wYXNzZXNbMF0gLy9hc3N1bWluZyBvbmx5IG9uZSBwYXNzIHBlciBtYXRlcmlhbFxyXG5cdC8vXHJcblx0Ly9cdFx0dGhpcy5hY3RpdmF0ZVBhc3MocmVuZGVyYWJsZSwgcGFzcywgY2FtZXJhKTtcclxuXHQvL1xyXG5cdC8vXHRcdGRvIHtcclxuXHQvL1x0XHRcdC8vIGlmIGNvbXBsZXRlbHkgaW4gZnJvbnQsIGl0IHdpbGwgZmFsbCBpbiBhIGRpZmZlcmVudCBjYXNjYWRlXHJcblx0Ly9cdFx0XHQvLyBkbyBub3QgdXNlIG5lYXIgYW5kIGZhciBwbGFuZXNcclxuXHQvL1x0XHRcdGlmICghY3VsbFBsYW5lcyB8fCByZW5kZXJhYmxlMi5zb3VyY2VFbnRpdHkud29ybGRCb3VuZHMuaXNJbkZydXN0dW0oY3VsbFBsYW5lcywgNCkpIHtcclxuXHQvL1x0XHRcdFx0cmVuZGVyYWJsZTIuX2lSZW5kZXIocGFzcywgY2FtZXJhLCB0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXgpO1xyXG5cdC8vXHRcdFx0fSBlbHNlIHtcclxuXHQvL1x0XHRcdFx0cmVuZGVyYWJsZTIuY2FzY2FkZWQgPSB0cnVlO1xyXG5cdC8vXHRcdFx0fVxyXG5cdC8vXHJcblx0Ly9cdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGUyLm5leHQ7XHJcblx0Ly9cclxuXHQvL1x0XHR9IHdoaWxlIChyZW5kZXJhYmxlMiAmJiByZW5kZXJhYmxlMi5yZW5kZXJPYmplY3QgPT0gcmVuZGVyT2JqZWN0ICYmICFyZW5kZXJhYmxlMi5jYXNjYWRlZCk7XHJcblx0Ly9cclxuXHQvL1x0XHR0aGlzLmRlYWN0aXZhdGVQYXNzKHJlbmRlcmFibGUsIHBhc3MpO1xyXG5cdC8vXHJcblx0Ly9cdFx0cmVuZGVyYWJsZSA9IHJlbmRlcmFibGUyO1xyXG5cdC8vXHR9XHJcblx0Ly99XHJcblxyXG5cdC8qKlxyXG5cdCAqIERyYXcgYSBsaXN0IG9mIHJlbmRlcmFibGVzLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHJlbmRlcmFibGVzIFRoZSByZW5kZXJhYmxlcyB0byBkcmF3LlxyXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBjb250YWluaW5nIGFsbCBwb3RlbnRpYWxseSB2aXNpYmxlIGluZm9ybWF0aW9uLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBkcmF3UmVuZGVyYWJsZXMocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgZW50aXR5Q29sbGVjdG9yOkNvbGxlY3RvckJhc2UpXHJcblx0e1xyXG5cdFx0dmFyIGk6bnVtYmVyO1xyXG5cdFx0dmFyIGxlbjpudW1iZXI7XHJcblx0XHR2YXIgcmVuZGVyYWJsZTI6UmVuZGVyYWJsZUJhc2U7XHJcblx0XHR2YXIgcmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2U7XHJcblx0XHR2YXIgcGFzc2VzOkFycmF5PFJlbmRlclBhc3NCYXNlPjtcclxuXHRcdHZhciBwYXNzOlJlbmRlclBhc3NCYXNlO1xyXG5cdFx0dmFyIGNhbWVyYTpDYW1lcmEgPSBlbnRpdHlDb2xsZWN0b3IuY2FtZXJhO1xyXG5cclxuXHJcblx0XHR3aGlsZSAocmVuZGVyYWJsZSkge1xyXG5cdFx0XHRyZW5kZXJPYmplY3QgPSByZW5kZXJhYmxlLnJlbmRlck9iamVjdDtcclxuXHRcdFx0cGFzc2VzID0gcmVuZGVyT2JqZWN0LnBhc3NlcztcclxuXHJcblx0XHRcdC8vIG90aGVyd2lzZSB0aGlzIHdvdWxkIHJlc3VsdCBpbiBkZXB0aCByZW5kZXJlZCBhbnl3YXkgYmVjYXVzZSBmcmFnbWVudCBzaGFkZXIga2lsIGlzIGlnbm9yZWRcclxuXHRcdFx0aWYgKHRoaXMuX2Rpc2FibGVDb2xvciAmJiByZW5kZXJPYmplY3QuX3JlbmRlck9iamVjdE93bmVyLmFscGhhVGhyZXNob2xkICE9IDApIHtcclxuXHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XHJcblx0XHRcdFx0Ly8gZmFzdCBmb3J3YXJkXHJcblx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlMi5uZXh0O1xyXG5cclxuXHRcdFx0XHR9IHdoaWxlIChyZW5kZXJhYmxlMiAmJiByZW5kZXJhYmxlMi5yZW5kZXJPYmplY3QgPT0gcmVuZGVyT2JqZWN0KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvL2l0ZXJhdGUgdGhyb3VnaCBlYWNoIHNoYWRlciBvYmplY3RcclxuXHRcdFx0XHRsZW4gPSBwYXNzZXMubGVuZ3RoO1xyXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlO1xyXG5cdFx0XHRcdFx0cGFzcyA9IHBhc3Nlc1tpXTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlLCBwYXNzLCBjYW1lcmEpO1xyXG5cclxuXHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0cmVuZGVyYWJsZTIuX2lSZW5kZXIocGFzcywgY2FtZXJhLCB0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXgpO1xyXG5cclxuXHRcdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlMi5uZXh0O1xyXG5cclxuXHRcdFx0XHRcdH0gd2hpbGUgKHJlbmRlcmFibGUyICYmIHJlbmRlcmFibGUyLnJlbmRlck9iamVjdCA9PSByZW5kZXJPYmplY3QpO1xyXG5cclxuXHRcdFx0XHRcdHRoaXMuZGVhY3RpdmF0ZVBhc3MocmVuZGVyYWJsZSwgcGFzcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZW5kZXJhYmxlID0gcmVuZGVyYWJsZTI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBc3NpZ24gdGhlIGNvbnRleHQgb25jZSByZXRyaWV2ZWRcclxuXHQgKi9cclxuXHRwcml2YXRlIG9uQ29udGV4dFVwZGF0ZShldmVudDpFdmVudClcclxuXHR7XHJcblx0XHR0aGlzLl9wQ29udGV4dCA9IDxJQ29udGV4dEdMPiB0aGlzLl9wU3RhZ2UuY29udGV4dDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kQWxwaGEoKTpudW1iZXJcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEFscGhhO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBfaUJhY2tncm91bmRBbHBoYSh2YWx1ZTpudW1iZXIpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRBbHBoYSA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2JhY2tncm91bmRBbHBoYSA9IHZhbHVlO1xyXG5cclxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCBwdWJsaWMgZ2V0IGlCYWNrZ3JvdW5kKCk6VGV4dHVyZTJEQmFzZVxyXG5cdCB7XHJcblx0IHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xyXG5cdCB9XHJcblx0ICovXHJcblxyXG5cdC8qXHJcblx0IHB1YmxpYyBzZXQgaUJhY2tncm91bmQodmFsdWU6VGV4dHVyZTJEQmFzZSlcclxuXHQge1xyXG5cdCBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgJiYgIXZhbHVlKSB7XHJcblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLmRpc3Bvc2UoKTtcclxuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgPSBudWxsO1xyXG5cdCB9XHJcblxyXG5cdCBpZiAoIXRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyICYmIHZhbHVlKVxyXG5cdCB7XHJcblxyXG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciA9IG5ldyBCYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcih0aGlzLl9wU3RhZ2UpO1xyXG5cclxuXHQgfVxyXG5cclxuXHJcblx0IHRoaXMuX2JhY2tncm91bmQgPSB2YWx1ZTtcclxuXHJcblx0IGlmICh0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcilcclxuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIudGV4dHVyZSA9IHZhbHVlO1xyXG5cdCB9XHJcblx0ICovXHJcblx0LypcclxuXHQgcHVibGljIGdldCBiYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcigpOkJhY2tncm91bmRJbWFnZVJlbmRlcmVyXHJcblx0IHtcclxuXHQgcmV0dXJuIF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcjtcclxuXHQgfVxyXG5cdCAqL1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRwcml2YXRlIG5vdGlmeVNjaXNzb3JVcGRhdGUoKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLl9zY2lzc29yRGlydHkpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9zY2lzc29yRGlydHkgPSB0cnVlO1xyXG5cclxuXHRcdGlmICghdGhpcy5fc2Npc3NvclVwZGF0ZWQpXHJcblx0XHRcdHRoaXMuX3NjaXNzb3JVcGRhdGVkID0gbmV3IFJlbmRlcmVyRXZlbnQoUmVuZGVyZXJFdmVudC5TQ0lTU09SX1VQREFURUQpO1xyXG5cclxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9zY2lzc29yVXBkYXRlZCk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRwcml2YXRlIG5vdGlmeVZpZXdwb3J0VXBkYXRlKClcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fdmlld3BvcnREaXJ0eSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3ZpZXdwb3J0RGlydHkgPSB0cnVlO1xyXG5cclxuXHRcdGlmICghdGhpcy5fdmlld1BvcnRVcGRhdGVkKVxyXG5cdFx0XHR0aGlzLl92aWV3UG9ydFVwZGF0ZWQgPSBuZXcgUmVuZGVyZXJFdmVudChSZW5kZXJlckV2ZW50LlZJRVdQT1JUX1VQREFURUQpO1xyXG5cclxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl92aWV3UG9ydFVwZGF0ZWQpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKi9cclxuXHRwdWJsaWMgb25WaWV3cG9ydFVwZGF0ZWQoZXZlbnQ6U3RhZ2VFdmVudClcclxuXHR7XHJcblx0XHR0aGlzLl92aWV3UG9ydCA9IHRoaXMuX3BTdGFnZS52aWV3UG9ydDtcclxuXHRcdC8vVE9ETyBzdG9wIGZpcmluZyB2aWV3cG9ydCB1cGRhdGVkIGZvciBldmVyeSBzdGFnZWdsIHZpZXdwb3J0IGNoYW5nZVxyXG5cclxuXHRcdGlmICh0aGlzLl9zaGFyZUNvbnRleHQpIHtcclxuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnggPSB0aGlzLl9nbG9iYWxQb3MueCAtIHRoaXMuX3BTdGFnZS54O1xyXG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IHRoaXMuX2dsb2JhbFBvcy55IC0gdGhpcy5fcFN0YWdlLnk7XHJcblx0XHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubm90aWZ5Vmlld3BvcnRVcGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0cHVibGljIHVwZGF0ZUdsb2JhbFBvcygpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX3NoYXJlQ29udGV4dCkge1xyXG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IHRoaXMuX2dsb2JhbFBvcy54IC0gdGhpcy5fdmlld1BvcnQueDtcclxuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnkgPSB0aGlzLl9nbG9iYWxQb3MueSAtIHRoaXMuX3ZpZXdQb3J0Lnk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IDA7XHJcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC55ID0gMDtcclxuXHRcdFx0dGhpcy5fdmlld1BvcnQueCA9IHRoaXMuX2dsb2JhbFBvcy54O1xyXG5cdFx0XHR0aGlzLl92aWV3UG9ydC55ID0gdGhpcy5fZ2xvYmFsUG9zLnk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBhcHBseVJlbmRlcmFibGUocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSlcclxuXHR7XHJcblx0XHQvL3NldCBsb2NhbCB2YXJzIGZvciBmYXN0ZXIgcmVmZXJlbmNpbmdcclxuXHRcdHZhciByZW5kZXJPYmplY3Q6UmVuZGVyT2JqZWN0QmFzZSA9IHRoaXMuX3BHZXRSZW5kZXJPYmplY3QocmVuZGVyYWJsZSwgcmVuZGVyYWJsZS5yZW5kZXJPYmplY3RPd25lciB8fCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmdldERlZmF1bHRNYXRlcmlhbChyZW5kZXJhYmxlLnJlbmRlcmFibGVPd25lcikpO1xyXG5cclxuXHRcdHJlbmRlcmFibGUucmVuZGVyT2JqZWN0ID0gcmVuZGVyT2JqZWN0O1xyXG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJPYmplY3RJZCA9IHJlbmRlck9iamVjdC5yZW5kZXJPYmplY3RJZDtcclxuXHRcdHJlbmRlcmFibGUucmVuZGVyT3JkZXJJZCA9IHJlbmRlck9iamVjdC5yZW5kZXJPcmRlcklkO1xyXG5cclxuXHRcdHJlbmRlcmFibGUuY2FzY2FkZWQgPSBmYWxzZTtcclxuXHJcblx0XHR2YXIgZW50aXR5OklFbnRpdHkgPSByZW5kZXJhYmxlLnNvdXJjZUVudGl0eTtcclxuXHRcdHZhciBwb3NpdGlvbjpWZWN0b3IzRCA9IGVudGl0eS5zY2VuZVBvc2l0aW9uO1xyXG5cclxuXHRcdC8vIHByb2plY3Qgb250byBjYW1lcmEncyB6LWF4aXNcclxuXHRcdHBvc2l0aW9uID0gdGhpcy5faUVudHJ5UG9pbnQuc3VidHJhY3QocG9zaXRpb24pO1xyXG5cdFx0cmVuZGVyYWJsZS56SW5kZXggPSBlbnRpdHkuek9mZnNldCArIHBvc2l0aW9uLmRvdFByb2R1Y3QodGhpcy5fcENhbWVyYUZvcndhcmQpO1xyXG5cclxuXHRcdC8vc3RvcmUgcmVmZXJlbmNlIHRvIHNjZW5lIHRyYW5zZm9ybVxyXG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJTY2VuZVRyYW5zZm9ybSA9IHJlbmRlcmFibGUuc291cmNlRW50aXR5LmdldFJlbmRlclNjZW5lVHJhbnNmb3JtKHRoaXMuX3BDYW1lcmEpO1xyXG5cclxuXHRcdGlmIChyZW5kZXJPYmplY3QucmVxdWlyZXNCbGVuZGluZykge1xyXG5cdFx0XHRyZW5kZXJhYmxlLm5leHQgPSB0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkO1xyXG5cdFx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gcmVuZGVyYWJsZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlbmRlcmFibGUubmV4dCA9IHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZDtcclxuXHRcdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gcmVuZGVyYWJsZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9wTnVtVHJpYW5nbGVzICs9IHJlbmRlcmFibGUubnVtVHJpYW5nbGVzO1xyXG5cclxuXHRcdC8vaGFuZGxlIGFueSBvdmVyZmxvdyBmb3IgcmVuZGVyYWJsZXMgd2l0aCBkYXRhIHRoYXQgZXhjZWVkcyBHUFUgbGltaXRhdGlvbnNcclxuXHRcdGlmIChyZW5kZXJhYmxlLm92ZXJmbG93KVxyXG5cdFx0XHR0aGlzLmFwcGx5UmVuZGVyYWJsZShyZW5kZXJhYmxlLm92ZXJmbG93KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfcEdldFJlbmRlck9iamVjdChyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCByZW5kZXJPYmplY3RPd25lcjpJUmVuZGVyT2JqZWN0T3duZXIpOlJlbmRlck9iamVjdEJhc2VcclxuXHR7XHJcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gUmVuZGVyZXJCYXNlOyJdfQ==