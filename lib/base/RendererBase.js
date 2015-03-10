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
var StageEvent = require("awayjs-stagegl/lib/events/StageEvent");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL1JlbmRlcmVyQmFzZS50cyJdLCJuYW1lcyI6WyJSZW5kZXJlckJhc2UiLCJSZW5kZXJlckJhc2UuY29uc3RydWN0b3IiLCJSZW5kZXJlckJhc2UucmVuZGVyQmxlbmRlZCIsIlJlbmRlcmVyQmFzZS5kaXNhYmxlQ29sb3IiLCJSZW5kZXJlckJhc2UubnVtVHJpYW5nbGVzIiwiUmVuZGVyZXJCYXNlLnZpZXdQb3J0IiwiUmVuZGVyZXJCYXNlLnNjaXNzb3JSZWN0IiwiUmVuZGVyZXJCYXNlLngiLCJSZW5kZXJlckJhc2UueSIsIlJlbmRlcmVyQmFzZS53aWR0aCIsIlJlbmRlcmVyQmFzZS5oZWlnaHQiLCJSZW5kZXJlckJhc2UuYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLmRlYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLl9pQ3JlYXRlRW50aXR5Q29sbGVjdG9yIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZFIiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kRyIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRCIiwiUmVuZGVyZXJCYXNlLmNvbnRleHQiLCJSZW5kZXJlckJhc2Uuc3RhZ2UiLCJSZW5kZXJlckJhc2UuaVNldFN0YWdlIiwiUmVuZGVyZXJCYXNlLnNoYXJlQ29udGV4dCIsIlJlbmRlcmVyQmFzZS5kaXNwb3NlIiwiUmVuZGVyZXJCYXNlLnJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlckNhc2NhZGVzIiwiUmVuZGVyZXJCYXNlLnBDb2xsZWN0UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2UucEV4ZWN1dGVSZW5kZXIiLCJSZW5kZXJlckJhc2UucXVldWVTbmFwc2hvdCIsIlJlbmRlcmVyQmFzZS5wRHJhdyIsIlJlbmRlcmVyQmFzZS5kcmF3UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2Uub25Db250ZXh0VXBkYXRlIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZEFscGhhIiwiUmVuZGVyZXJCYXNlLm5vdGlmeVNjaXNzb3JVcGRhdGUiLCJSZW5kZXJlckJhc2Uubm90aWZ5Vmlld3BvcnRVcGRhdGUiLCJSZW5kZXJlckJhc2Uub25WaWV3cG9ydFVwZGF0ZWQiLCJSZW5kZXJlckJhc2UudXBkYXRlR2xvYmFsUG9zIiwiUmVuZGVyZXJCYXNlLmFwcGx5UmVuZGVyYWJsZSIsIlJlbmRlcmVyQmFzZS5fcEdldFJlbmRlck9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFFaEUsSUFBTyxLQUFLLFdBQWdCLDRCQUE0QixDQUFDLENBQUM7QUFDMUQsSUFBTyxTQUFTLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUVqRSxJQUFPLG1CQUFtQixXQUFhLDRDQUE0QyxDQUFDLENBQUM7QUFDckYsSUFBTyxlQUFlLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQVM5RSxJQUFPLG1CQUFtQixXQUFhLDZDQUE2QyxDQUFDLENBQUM7QUFNdEYsSUFBTyxhQUFhLFdBQWMseUNBQXlDLENBQUMsQ0FBQztBQUM3RSxJQUFPLFVBQVUsV0FBZSxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXhFLElBQU8sZUFBZSxXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHbkYsSUFBTyxzQkFBc0IsV0FBWSxvREFBb0QsQ0FBQyxDQUFDO0FBRS9GLElBQU8saUJBQWlCLFdBQWEsc0RBQXNELENBQUMsQ0FBQztBQUM3RixJQUFPLG9CQUFvQixXQUFhLDhDQUE4QyxDQUFDLENBQUM7QUFDeEYsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBR3hGLElBQU8sWUFBWSxXQUFlLDBDQUEwQyxDQUFDLENBQUM7QUFVOUUsSUFBTyxnQkFBZ0IsV0FBYyw2Q0FBNkMsQ0FBQyxDQUFDO0FBR3BGLEFBTUE7Ozs7O0dBREc7SUFDRyxZQUFZO0lBQVNBLFVBQXJCQSxZQUFZQSxVQUF3QkE7SUFvTXpDQTs7T0FFR0E7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QSxVQUFVQSxDQUFDQSxhQUFhQSxHQUFHQSxZQUFZQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUV0REEsVUFBVUEsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLE1BQU1BLEdBQVdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO1FBQzdDQSxJQUFJQSxRQUFRQSxHQUFZQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUU3Q0EsQUFDQUEsK0JBRCtCQTtRQUMvQkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDaERBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBRS9FQSxBQUNBQSxvQ0FEb0NBO1FBQ3BDQSxVQUFVQSxDQUFDQSxvQkFBb0JBLEdBQUdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFFakdBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLFVBQVVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7WUFDL0NBLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDM0NBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLFVBQVVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7WUFDOUNBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDMUNBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLGNBQWNBLElBQUlBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO1FBRS9DQSxBQUNBQSw0RUFENEVBO1FBQzVFQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7SUFDNUNBLENBQUNBO0lBRU1wQyx3Q0FBaUJBLEdBQXhCQSxVQUF5QkEsVUFBeUJBLEVBQUVBLGlCQUFvQ0E7UUFFdkZxQyxNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUNGckMsbUJBQUNBO0FBQURBLENBcHpCQSxBQW96QkNBLEVBcHpCMEIsZUFBZSxFQW96QnpDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImJhc2UvUmVuZGVyZXJCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaXRtYXBEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9kYXRhL0JpdG1hcERhdGFcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBQbGFuZTNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUGxhbmUzRFwiKTtcbmltcG9ydCBQb2ludFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1BvaW50XCIpO1xuaW1wb3J0IFJlY3RhbmdsZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9SZWN0YW5nbGVcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudERpc3BhdGNoZXJcIik7XG5pbXBvcnQgVGV4dHVyZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVCYXNlXCIpO1xuaW1wb3J0IEJ5dGVBcnJheVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvQnl0ZUFycmF5XCIpO1xuXG5pbXBvcnQgTGluZVN1Yk1lc2hcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvTGluZVN1Yk1lc2hcIik7XG5pbXBvcnQgSVJlbmRlck9iamVjdE93bmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVJlbmRlck9iamVjdE93bmVyXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJNZXNoXCIpO1xuaW1wb3J0IEVudGl0eUxpc3RJdGVtXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcG9vbC9FbnRpdHlMaXN0SXRlbVwiKTtcbmltcG9ydCBJRW50aXR5U29ydGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvc29ydC9JRW50aXR5U29ydGVyXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVNZXJnZVNvcnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvc29ydC9SZW5kZXJhYmxlTWVyZ2VTb3J0XCIpO1xuaW1wb3J0IElSZW5kZXJlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcmVuZGVyL0lSZW5kZXJlclwiKTtcbmltcG9ydCBCaWxsYm9hcmRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0JpbGxib2FyZFwiKTtcbmltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuaW1wb3J0IElFbnRpdHlcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvSUVudGl0eVwiKTtcbmltcG9ydCBTa3lib3hcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvU2t5Ym94XCIpO1xuaW1wb3J0IFJlbmRlcmVyRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ldmVudHMvUmVuZGVyZXJFdmVudFwiKTtcbmltcG9ydCBTdGFnZUV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9ldmVudHMvU3RhZ2VFdmVudFwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgRW50aXR5Q29sbGVjdG9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvdHJhdmVyc2UvRW50aXR5Q29sbGVjdG9yXCIpO1xuaW1wb3J0IENvbGxlY3RvckJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9Db2xsZWN0b3JCYXNlXCIpO1xuaW1wb3J0IFNoYWRvd0Nhc3RlckNvbGxlY3Rvclx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvdHJhdmVyc2UvU2hhZG93Q2FzdGVyQ29sbGVjdG9yXCIpO1xuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXJcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hbmFnZXJzL0RlZmF1bHRNYXRlcmlhbE1hbmFnZXJcIik7XG5cbmltcG9ydCBBR0FMTWluaUFzc2VtYmxlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hZ2xzbC9hc3NlbWJsZXIvQUdBTE1pbmlBc3NlbWJsZXJcIik7XG5pbXBvcnQgQ29udGV4dEdMQmxlbmRGYWN0b3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xCbGVuZEZhY3RvclwiKTtcbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xuaW1wb3J0IElDb250ZXh0R0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvSUNvbnRleHRHTFwiKTtcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IFN0YWdlTWFuYWdlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWFuYWdlcnMvU3RhZ2VNYW5hZ2VyXCIpO1xuaW1wb3J0IFByb2dyYW1EYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9wb29sL1Byb2dyYW1EYXRhXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBSZW5kZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vUmVuZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgSVJlbmRlcmVyUG9vbENsYXNzXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvSVJlbmRlcmVyUG9vbENsYXNzXCIpO1xuaW1wb3J0IFJUVEJ1ZmZlck1hbmFnZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYW5hZ2Vycy9SVFRCdWZmZXJNYW5hZ2VyXCIpO1xuaW1wb3J0IFJlbmRlclBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL1JlbmRlclBhc3NCYXNlXCIpO1xuaW1wb3J0IFJlbmRlcmVyUG9vbEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmVyUG9vbEJhc2VcIik7XG5cblxuLyoqXG4gKiBSZW5kZXJlckJhc2UgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgY2xhc3NlcyB0aGF0IGFyZSB1c2VkIGluIHRoZSByZW5kZXJpbmcgcGlwZWxpbmUgdG8gcmVuZGVyIHRoZVxuICogY29udGVudHMgb2YgYSBwYXJ0aXRpb25cbiAqXG4gKiBAY2xhc3MgYXdheS5yZW5kZXIuUmVuZGVyZXJCYXNlXG4gKi9cbmNsYXNzIFJlbmRlcmVyQmFzZSBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlclxue1xuXHRwcml2YXRlIF9udW1Vc2VkU3RyZWFtczpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9udW1Vc2VkVGV4dHVyZXM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9yZW5kZXJlclBvb2w6UmVuZGVyZXJQb29sQmFzZTtcblxuXHRwdWJsaWMgX3BSZW5kZXJlclBvb2xDbGFzczpJUmVuZGVyZXJQb29sQ2xhc3M7XG5cdHB1YmxpYyBfcENvbnRleHQ6SUNvbnRleHRHTDtcblx0cHVibGljIF9wU3RhZ2U6U3RhZ2U7XG5cblx0cHVibGljIF9wQ2FtZXJhOkNhbWVyYTtcblx0cHVibGljIF9pRW50cnlQb2ludDpWZWN0b3IzRDtcblx0cHVibGljIF9wQ2FtZXJhRm9yd2FyZDpWZWN0b3IzRDtcblxuXHRwdWJsaWMgX3BSdHRCdWZmZXJNYW5hZ2VyOlJUVEJ1ZmZlck1hbmFnZXI7XG5cdHByaXZhdGUgX3ZpZXdQb3J0OlJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoKTtcblx0cHJpdmF0ZSBfdmlld3BvcnREaXJ0eTpib29sZWFuO1xuXHRwcml2YXRlIF9zY2lzc29yRGlydHk6Ym9vbGVhbjtcblxuXHRwdWJsaWMgX3BCYWNrQnVmZmVySW52YWxpZDpib29sZWFuID0gdHJ1ZTtcblx0cHVibGljIF9wRGVwdGhUZXh0dXJlSW52YWxpZDpib29sZWFuID0gdHJ1ZTtcblx0cHVibGljIF9kZXB0aFByZXBhc3M6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kUjpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kRzpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kQjpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kQWxwaGE6bnVtYmVyID0gMTtcblx0cHVibGljIF9zaGFyZUNvbnRleHQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdC8vIG9ubHkgdXNlZCBieSByZW5kZXJlcnMgdGhhdCBuZWVkIHRvIHJlbmRlciBnZW9tZXRyeSB0byB0ZXh0dXJlc1xuXHRwdWJsaWMgX3dpZHRoOm51bWJlcjtcblx0cHVibGljIF9oZWlnaHQ6bnVtYmVyO1xuXG5cdHB1YmxpYyB0ZXh0dXJlUmF0aW9YOm51bWJlciA9IDE7XG5cdHB1YmxpYyB0ZXh0dXJlUmF0aW9ZOm51bWJlciA9IDE7XG5cblx0cHJpdmF0ZSBfc25hcHNob3RCaXRtYXBEYXRhOkJpdG1hcERhdGE7XG5cdHByaXZhdGUgX3NuYXBzaG90UmVxdWlyZWQ6Ym9vbGVhbjtcblxuXHRwdWJsaWMgX3BSdHRWaWV3UHJvamVjdGlvbk1hdHJpeDpNYXRyaXgzRCA9IG5ldyBNYXRyaXgzRCgpO1xuXG5cdHByaXZhdGUgX2xvY2FsUG9zOlBvaW50ID0gbmV3IFBvaW50KCk7XG5cdHByaXZhdGUgX2dsb2JhbFBvczpQb2ludCA9IG5ldyBQb2ludCgpO1xuXHRwdWJsaWMgX3BTY2lzc29yUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKCk7XG5cblx0cHJpdmF0ZSBfc2Npc3NvclVwZGF0ZWQ6UmVuZGVyZXJFdmVudDtcblx0cHJpdmF0ZSBfdmlld1BvcnRVcGRhdGVkOlJlbmRlcmVyRXZlbnQ7XG5cblx0cHJpdmF0ZSBfb25Db250ZXh0VXBkYXRlRGVsZWdhdGU6RnVuY3Rpb247XG5cdHByaXZhdGUgX29uVmlld3BvcnRVcGRhdGVkRGVsZWdhdGU7XG5cblx0cHVibGljIF9wTnVtVHJpYW5nbGVzOm51bWJlciA9IDA7XG5cblx0cHVibGljIF9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ6UmVuZGVyYWJsZUJhc2U7XG5cdHB1YmxpYyBfcEJsZW5kZWRSZW5kZXJhYmxlSGVhZDpSZW5kZXJhYmxlQmFzZTtcblx0cHVibGljIF9kaXNhYmxlQ29sb3I6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwdWJsaWMgX3JlbmRlckJsZW5kZWQ6Ym9vbGVhbiA9IHRydWU7XG5cblxuXHRwdWJsaWMgZ2V0IHJlbmRlckJsZW5kZWQoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcmVuZGVyQmxlbmRlZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcmVuZGVyQmxlbmRlZCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fcmVuZGVyQmxlbmRlZCA9IHZhbHVlO1xuXHR9XG5cblxuXHRwdWJsaWMgZ2V0IGRpc2FibGVDb2xvcigpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9kaXNhYmxlQ29sb3I7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpc2FibGVDb2xvcih2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fZGlzYWJsZUNvbG9yID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVHJpYW5nbGVzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcE51bVRyaWFuZ2xlcztcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHJlbmRlcmFibGVTb3J0ZXI6SUVudGl0eVNvcnRlcjtcblxuXG5cdC8qKlxuXHQgKiBBIHZpZXdQb3J0IHJlY3RhbmdsZSBlcXVpdmFsZW50IG9mIHRoZSBTdGFnZSBzaXplIGFuZCBwb3NpdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgdmlld1BvcnQoKTpSZWN0YW5nbGVcblx0e1xuXHRcdHJldHVybiB0aGlzLl92aWV3UG9ydDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNjaXNzb3IgcmVjdGFuZ2xlIGVxdWl2YWxlbnQgb2YgdGhlIHZpZXcgc2l6ZSBhbmQgcG9zaXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNjaXNzb3JSZWN0KCk6UmVjdGFuZ2xlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcFNjaXNzb3JSZWN0O1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9sb2NhbFBvcy54O1xuXHR9XG5cblx0cHVibGljIHNldCB4KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLnggPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9nbG9iYWxQb3MueCA9IHRoaXMuX2xvY2FsUG9zLnggPSB2YWx1ZTtcblxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgeSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsUG9zLnk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHkodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMueSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2dsb2JhbFBvcy55ID0gdGhpcy5fbG9jYWxQb3MueSA9IHZhbHVlO1xuXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCB3aWR0aCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xuXHR9XG5cblx0cHVibGljIHNldCB3aWR0aCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fd2lkdGggPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl93aWR0aCA9IHZhbHVlO1xuXHRcdHRoaXMuX3BTY2lzc29yUmVjdC53aWR0aCA9IHZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyKVxuXHRcdFx0dGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIudmlld1dpZHRoID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHRcdHRoaXMuX3BEZXB0aFRleHR1cmVJbnZhbGlkID0gdHJ1ZTtcblxuXHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGhlaWdodCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgaGVpZ2h0KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9oZWlnaHQgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcblx0XHR0aGlzLl9wU2Npc3NvclJlY3QuaGVpZ2h0ID0gdmFsdWU7XG5cblx0XHRpZiAodGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIpXG5cdFx0XHR0aGlzLl9wUnR0QnVmZmVyTWFuYWdlci52aWV3SGVpZ2h0ID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHRcdHRoaXMuX3BEZXB0aFRleHR1cmVJbnZhbGlkID0gdHJ1ZTtcblxuXHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgUmVuZGVyZXJCYXNlIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHJlbmRlcmVyUG9vbENsYXNzOklSZW5kZXJlclBvb2xDbGFzcyA9IG51bGwsIHN0YWdlOlN0YWdlID0gbnVsbClcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9wUmVuZGVyZXJQb29sQ2xhc3MgPSByZW5kZXJlclBvb2xDbGFzcztcblxuXHRcdHRoaXMuX29uVmlld3BvcnRVcGRhdGVkRGVsZWdhdGUgPSAoZXZlbnQ6U3RhZ2VFdmVudCkgPT4gdGhpcy5vblZpZXdwb3J0VXBkYXRlZChldmVudClcblx0XHR0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSA9IChldmVudDpFdmVudCkgPT4gdGhpcy5vbkNvbnRleHRVcGRhdGUoZXZlbnQpO1xuXG5cdFx0Ly9kZWZhdWx0IHNvcnRpbmcgYWxnb3JpdGhtXG5cdFx0dGhpcy5yZW5kZXJhYmxlU29ydGVyID0gbmV3IFJlbmRlcmFibGVNZXJnZVNvcnQoKTtcblxuXHRcdHRoaXMuX3JlbmRlcmVyUG9vbCA9IChyZW5kZXJlclBvb2xDbGFzcyk/IG5ldyB0aGlzLl9wUmVuZGVyZXJQb29sQ2xhc3ModGhpcykgOiBuZXcgUmVuZGVyZXJQb29sQmFzZSh0aGlzKTtcblxuXHRcdHRoaXMuc3RhZ2UgPSBzdGFnZSB8fCBTdGFnZU1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5nZXRGcmVlU3RhZ2UoKTtcblx0fVxuXG5cdHB1YmxpYyBhY3RpdmF0ZVBhc3MocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgcGFzczpSZW5kZXJQYXNzQmFzZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdC8vY2xlYXIgdW51c2VkIHZlcnRleCBzdHJlYW1zXG5cdFx0Zm9yICh2YXIgaSA9IHBhc3Muc2hhZGVyLm51bVVzZWRTdHJlYW1zOyBpIDwgdGhpcy5fbnVtVXNlZFN0cmVhbXM7IGkrKylcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xuXG5cdFx0Ly9jbGVhciB1bnVzZWQgdGV4dHVyZSBzdHJlYW1zXG5cdFx0Zm9yICh2YXIgaSA9IHBhc3Muc2hhZGVyLm51bVVzZWRUZXh0dXJlczsgaSA8IHRoaXMuX251bVVzZWRUZXh0dXJlczsgaSsrKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VGV4dHVyZUF0KGksIG51bGwpO1xuXG5cdFx0Ly9jaGVjayBwcm9ncmFtIGRhdGEgaXMgdXBsb2FkZWRcblx0XHR2YXIgcHJvZ3JhbURhdGE6UHJvZ3JhbURhdGEgPSBwYXNzLnNoYWRlci5wcm9ncmFtRGF0YTtcblxuXHRcdGlmICghcHJvZ3JhbURhdGEucHJvZ3JhbSkge1xuXHRcdFx0cHJvZ3JhbURhdGEucHJvZ3JhbSA9IHRoaXMuX3BDb250ZXh0LmNyZWF0ZVByb2dyYW0oKTtcblx0XHRcdHZhciB2ZXJ0ZXhCeXRlQ29kZTpCeXRlQXJyYXkgPSAobmV3IEFHQUxNaW5pQXNzZW1ibGVyKCkuYXNzZW1ibGUoXCJwYXJ0IHZlcnRleCAxXFxuXCIgKyBwcm9ncmFtRGF0YS52ZXJ0ZXhTdHJpbmcgKyBcImVuZHBhcnRcIikpWyd2ZXJ0ZXgnXS5kYXRhO1xuXHRcdFx0dmFyIGZyYWdtZW50Qnl0ZUNvZGU6Qnl0ZUFycmF5ID0gKG5ldyBBR0FMTWluaUFzc2VtYmxlcigpLmFzc2VtYmxlKFwicGFydCBmcmFnbWVudCAxXFxuXCIgKyBwcm9ncmFtRGF0YS5mcmFnbWVudFN0cmluZyArIFwiZW5kcGFydFwiKSlbJ2ZyYWdtZW50J10uZGF0YTtcblx0XHRcdHByb2dyYW1EYXRhLnByb2dyYW0udXBsb2FkKHZlcnRleEJ5dGVDb2RlLCBmcmFnbWVudEJ5dGVDb2RlKTtcblx0XHR9XG5cblx0XHQvL3NldCBwcm9ncmFtIGRhdGFcblx0XHR0aGlzLl9wQ29udGV4dC5zZXRQcm9ncmFtKHByb2dyYW1EYXRhLnByb2dyYW0pO1xuXG5cdFx0Ly9hY3RpdmF0ZSBzaGFkZXIgb2JqZWN0IHRocm91Z2ggcmVuZGVyYWJsZVxuXHRcdHJlbmRlcmFibGUuX2lBY3RpdmF0ZShwYXNzLCBjYW1lcmEpO1xuXHR9XG5cblx0cHVibGljIGRlYWN0aXZhdGVQYXNzKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHBhc3M6UmVuZGVyUGFzc0Jhc2UpXG5cdHtcblx0XHQvL2RlYWN0aXZhdGUgc2hhZGVyIG9iamVjdFxuXHRcdHJlbmRlcmFibGUuX2lEZWFjdGl2YXRlKHBhc3MpO1xuXG5cdFx0dGhpcy5fbnVtVXNlZFN0cmVhbXMgPSBwYXNzLnNoYWRlci5udW1Vc2VkU3RyZWFtcztcblx0XHR0aGlzLl9udW1Vc2VkVGV4dHVyZXMgPSBwYXNzLnNoYWRlci5udW1Vc2VkVGV4dHVyZXM7XG5cdH1cblxuXHRwdWJsaWMgX2lDcmVhdGVFbnRpdHlDb2xsZWN0b3IoKTpDb2xsZWN0b3JCYXNlXG5cdHtcblx0XHRyZXR1cm4gbmV3IEVudGl0eUNvbGxlY3RvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBiYWNrZ3JvdW5kIGNvbG9yJ3MgcmVkIGNvbXBvbmVudCwgdXNlZCB3aGVuIGNsZWFyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRSKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZFI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZFIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRSID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZFIgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyBncmVlbiBjb21wb25lbnQsIHVzZWQgd2hlbiBjbGVhcmluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kRygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRHO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRHKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kRyA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JhY2tncm91bmRHID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBiYWNrZ3JvdW5kIGNvbG9yJ3MgYmx1ZSBjb21wb25lbnQsIHVzZWQgd2hlbiBjbGVhcmluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kQigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRCO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRCKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kQiA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JhY2tncm91bmRCID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIGdldCBjb250ZXh0KCk6SUNvbnRleHRHTFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BDb250ZXh0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBTdGFnZSB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgQ29udGV4dEdMIHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3RhZ2UoKTpTdGFnZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BTdGFnZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3RhZ2UodmFsdWU6U3RhZ2UpXG5cdHtcblx0XHRpZiAodGhpcy5fcFN0YWdlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5pU2V0U3RhZ2UodmFsdWUpO1xuXHR9XG5cblx0cHVibGljIGlTZXRTdGFnZSh2YWx1ZTpTdGFnZSlcblx0e1xuXHRcdGlmICh0aGlzLl9wU3RhZ2UpXG5cdFx0XHR0aGlzLmRpc3Bvc2UoKTtcblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5fcFN0YWdlID0gdmFsdWU7XG5cblx0XHRcdHRoaXMuX3JlbmRlcmVyUG9vbC5zdGFnZSA9IHRoaXMuX3BTdGFnZTtcblxuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX0NSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHRcdHRoaXMuX3BTdGFnZS5hZGRFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuQ09OVEVYVF9SRUNSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHRcdHRoaXMuX3BTdGFnZS5hZGRFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuVklFV1BPUlRfVVBEQVRFRCwgdGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSk7XG5cblx0XHRcdC8qXG5cdFx0XHQgaWYgKF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcilcblx0XHRcdCBfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIuc3RhZ2UgPSB2YWx1ZTtcblx0XHRcdCAqL1xuXHRcdFx0aWYgKHRoaXMuX3BTdGFnZS5jb250ZXh0KVxuXHRcdFx0XHR0aGlzLl9wQ29udGV4dCA9IDxJQ29udGV4dEdMPiB0aGlzLl9wU3RhZ2UuY29udGV4dDtcblx0XHR9XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWZlcnMgY29udHJvbCBvZiBDb250ZXh0R0wgY2xlYXIoKSBhbmQgcHJlc2VudCgpIGNhbGxzIHRvIFN0YWdlLCBlbmFibGluZyBtdWx0aXBsZSBTdGFnZSBmcmFtZXdvcmtzXG5cdCAqIHRvIHNoYXJlIHRoZSBzYW1lIENvbnRleHRHTCBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNoYXJlQ29udGV4dCgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9zaGFyZUNvbnRleHQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNoYXJlQ29udGV4dCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NoYXJlQ29udGV4dCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3NoYXJlQ29udGV4dCA9IHZhbHVlO1xuXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNwb3NlcyB0aGUgcmVzb3VyY2VzIHVzZWQgYnkgdGhlIFJlbmRlcmVyQmFzZS5cblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdHRoaXMuX3JlbmRlcmVyUG9vbC5kaXNwb3NlKCk7XG5cblx0XHR0aGlzLl9wU3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuQ09OVEVYVF9SRUNSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHR0aGlzLl9wU3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LlZJRVdQT1JUX1VQREFURUQsIHRoaXMuX29uVmlld3BvcnRVcGRhdGVkRGVsZWdhdGUpO1xuXG5cdFx0dGhpcy5fcFN0YWdlID0gbnVsbDtcblx0XHR0aGlzLl9wQ29udGV4dCA9IG51bGw7XG5cdFx0Lypcblx0XHQgaWYgKF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcikge1xuXHRcdCBfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIuZGlzcG9zZSgpO1xuXHRcdCBfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgPSBudWxsO1xuXHRcdCB9XG5cdFx0ICovXG5cdH1cblxuXHRwdWJsaWMgcmVuZGVyKGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlKVxuXHR7XG5cdFx0dGhpcy5fdmlld3BvcnREaXJ0eSA9IGZhbHNlO1xuXHRcdHRoaXMuX3NjaXNzb3JEaXJ0eSA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkgdG8gdGhlIGJhY2sgYnVmZmVyIG9yIHRleHR1cmUuXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBvYmplY3QgY29udGFpbmluZyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeS5cblx0ICogQHBhcmFtIHRhcmdldCBBbiBvcHRpb24gdGFyZ2V0IHRleHR1cmUgdG8gcmVuZGVyIHRvLlxuXHQgKiBAcGFyYW0gc3VyZmFjZVNlbGVjdG9yIFRoZSBpbmRleCBvZiBhIEN1YmVUZXh0dXJlJ3MgZmFjZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBhZGRpdGlvbmFsQ2xlYXJNYXNrIEFkZGl0aW9uYWwgY2xlYXIgbWFzayBpbmZvcm1hdGlvbiwgaW4gY2FzZSBleHRyYSBjbGVhciBjaGFubmVscyBhcmUgdG8gYmUgb21pdHRlZC5cblx0ICovXG5cdHB1YmxpYyBfaVJlbmRlcihlbnRpdHlDb2xsZWN0b3I6Q29sbGVjdG9yQmFzZSwgdGFyZ2V0OlRleHR1cmVCYXNlID0gbnVsbCwgc2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbnVsbCwgc3VyZmFjZVNlbGVjdG9yOm51bWJlciA9IDApXG5cdHtcblx0XHQvL1RPRE8gcmVmYWN0b3Igc2V0VGFyZ2V0IHNvIHRoYXQgcmVuZGVydGV4dHVyZXMgYXJlIGNyZWF0ZWQgYmVmb3JlIHRoaXMgY2hlY2tcblx0XHRpZiAoIXRoaXMuX3BTdGFnZSB8fCAhdGhpcy5fcENvbnRleHQpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXguY29weUZyb20oZW50aXR5Q29sbGVjdG9yLmNhbWVyYS52aWV3UHJvamVjdGlvbik7XG5cdFx0dGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4LmFwcGVuZFNjYWxlKHRoaXMudGV4dHVyZVJhdGlvWCwgdGhpcy50ZXh0dXJlUmF0aW9ZLCAxKTtcblxuXHRcdHRoaXMucEV4ZWN1dGVSZW5kZXIoZW50aXR5Q29sbGVjdG9yLCB0YXJnZXQsIHNjaXNzb3JSZWN0LCBzdXJmYWNlU2VsZWN0b3IpO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgbWlwIG1hcHMgb24gdGFyZ2V0IChpZiB0YXJnZXQgZXhpc3RzKSAvL1RPRE9cblx0XHQvL2lmICh0YXJnZXQpXG5cdFx0Ly9cdCg8VGV4dHVyZT50YXJnZXQpLmdlbmVyYXRlTWlwbWFwcygpO1xuXG5cdFx0Ly8gY2xlYXIgYnVmZmVyc1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IDg7ICsraSkge1xuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoaSwgbnVsbCk7XG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRUZXh0dXJlQXQoaSwgbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9pUmVuZGVyQ2FzY2FkZXMoZW50aXR5Q29sbGVjdG9yOlNoYWRvd0Nhc3RlckNvbGxlY3RvciwgdGFyZ2V0OlRleHR1cmVCYXNlLCBudW1DYXNjYWRlczpudW1iZXIsIHNjaXNzb3JSZWN0czpBcnJheTxSZWN0YW5nbGU+LCBjYW1lcmFzOkFycmF5PENhbWVyYT4pXG5cdHtcblx0XHR0aGlzLnBDb2xsZWN0UmVuZGVyYWJsZXMoZW50aXR5Q29sbGVjdG9yKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zZXRSZW5kZXJUYXJnZXQodGFyZ2V0LCB0cnVlLCAwKTtcblx0XHR0aGlzLl9wQ29udGV4dC5jbGVhcigxLCAxLCAxLCAxLCAxLCAwKTtcblxuXHRcdHRoaXMuX3BDb250ZXh0LnNldEJsZW5kRmFjdG9ycyhDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkUsIENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk8pO1xuXHRcdHRoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTKTtcblxuXHRcdHZhciBoZWFkOlJlbmRlcmFibGVCYXNlID0gdGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkO1xuXG5cdFx0dmFyIGZpcnN0OmJvb2xlYW4gPSB0cnVlO1xuXG5cdFx0Ly9UT0RPIGNhc2NhZGVzIG11c3QgaGF2ZSBzZXBhcmF0ZSBjb2xsZWN0b3JzLCByYXRoZXIgdGhhbiBzZXBhcmF0ZSBkcmF3IGNvbW1hbmRzXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSBudW1DYXNjYWRlcyAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdFx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBzY2lzc29yUmVjdHNbaV07XG5cdFx0XHQvL3RoaXMuZHJhd0Nhc2NhZGVSZW5kZXJhYmxlcyhoZWFkLCBjYW1lcmFzW2ldLCBmaXJzdD8gbnVsbCA6IGNhbWVyYXNbaV0uZnJ1c3R1bVBsYW5lcyk7XG5cdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vbGluZSByZXF1aXJlZCBmb3IgY29ycmVjdCByZW5kZXJpbmcgd2hlbiB1c2luZyBhd2F5M2Qgd2l0aCBzdGFybGluZy4gRE8gTk9UIFJFTU9WRSBVTkxFU1MgU1RBUkxJTkcgSU5URUdSQVRJT04gSVMgUkVURVNURUQhXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgcENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3I6Q29sbGVjdG9yQmFzZSlcblx0e1xuXHRcdC8vcmVzZXQgaGVhZCB2YWx1ZXNcblx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gbnVsbDtcblx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSBudWxsO1xuXHRcdHRoaXMuX3BOdW1UcmlhbmdsZXMgPSAwO1xuXG5cdFx0Ly9ncmFiIGVudGl0eSBoZWFkXG5cdFx0dmFyIGl0ZW06RW50aXR5TGlzdEl0ZW0gPSBlbnRpdHlDb2xsZWN0b3IuZW50aXR5SGVhZDtcblxuXHRcdC8vc2V0IHRlbXAgdmFsdWVzIGZvciBlbnRyeSBwb2ludCBhbmQgY2FtZXJhIGZvcndhcmQgdmVjdG9yXG5cdFx0dGhpcy5fcENhbWVyYSA9IGVudGl0eUNvbGxlY3Rvci5jYW1lcmE7XG5cdFx0dGhpcy5faUVudHJ5UG9pbnQgPSB0aGlzLl9wQ2FtZXJhLnNjZW5lUG9zaXRpb247XG5cdFx0dGhpcy5fcENhbWVyYUZvcndhcmQgPSB0aGlzLl9wQ2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkVmVjdG9yO1xuXG5cdFx0Ly9pdGVyYXRlIHRocm91Z2ggYWxsIGVudGl0aWVzXG5cdFx0d2hpbGUgKGl0ZW0pIHtcblx0XHRcdGl0ZW0uZW50aXR5Ll9pQ29sbGVjdFJlbmRlcmFibGVzKHRoaXMuX3JlbmRlcmVyUG9vbCk7XG5cdFx0XHRpdGVtID0gaXRlbS5uZXh0O1xuXHRcdH1cblxuXHRcdC8vc29ydCB0aGUgcmVzdWx0aW5nIHJlbmRlcmFibGVzXG5cdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gPFJlbmRlcmFibGVCYXNlPiB0aGlzLnJlbmRlcmFibGVTb3J0ZXIuc29ydE9wYXF1ZVJlbmRlcmFibGVzKHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCk7XG5cdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IDxSZW5kZXJhYmxlQmFzZT4gdGhpcy5yZW5kZXJhYmxlU29ydGVyLnNvcnRCbGVuZGVkUmVuZGVyYWJsZXModGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeSB0byB0aGUgYmFjayBidWZmZXIgb3IgdGV4dHVyZS4gT25seSBleGVjdXRlZCBpZiBldmVyeXRoaW5nIGlzIHNldCB1cC5cblx0ICpcblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbiB0YXJnZXQgdGV4dHVyZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBzdXJmYWNlU2VsZWN0b3IgVGhlIGluZGV4IG9mIGEgQ3ViZVRleHR1cmUncyBmYWNlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIGFkZGl0aW9uYWxDbGVhck1hc2sgQWRkaXRpb25hbCBjbGVhciBtYXNrIGluZm9ybWF0aW9uLCBpbiBjYXNlIGV4dHJhIGNsZWFyIGNoYW5uZWxzIGFyZSB0byBiZSBvbWl0dGVkLlxuXHQgKi9cblx0cHVibGljIHBFeGVjdXRlUmVuZGVyKGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlLCB0YXJnZXQ6VGV4dHVyZUJhc2UgPSBudWxsLCBzY2lzc29yUmVjdDpSZWN0YW5nbGUgPSBudWxsLCBzdXJmYWNlU2VsZWN0b3I6bnVtYmVyID0gMClcblx0e1xuXHRcdHRoaXMuX3BTdGFnZS5zZXRSZW5kZXJUYXJnZXQodGFyZ2V0LCB0cnVlLCBzdXJmYWNlU2VsZWN0b3IpO1xuXG5cdFx0aWYgKCh0YXJnZXQgfHwgIXRoaXMuX3NoYXJlQ29udGV4dCkgJiYgIXRoaXMuX2RlcHRoUHJlcGFzcylcblx0XHRcdHRoaXMuX3BDb250ZXh0LmNsZWFyKHRoaXMuX2JhY2tncm91bmRSLCB0aGlzLl9iYWNrZ3JvdW5kRywgdGhpcy5fYmFja2dyb3VuZEIsIHRoaXMuX2JhY2tncm91bmRBbHBoYSwgMSwgMCk7XG5cblx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBzY2lzc29yUmVjdDtcblxuXHRcdC8qXG5cdFx0IGlmIChfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpXG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5yZW5kZXIoKTtcblx0XHQgKi9cblx0XHR0aGlzLnBDb2xsZWN0UmVuZGVyYWJsZXMoZW50aXR5Q29sbGVjdG9yKTtcblxuXHRcdHRoaXMuX3BDb250ZXh0LnNldEJsZW5kRmFjdG9ycyhDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkUsIENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk8pO1xuXG5cdFx0dGhpcy5wRHJhdyhlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0Ly9saW5lIHJlcXVpcmVkIGZvciBjb3JyZWN0IHJlbmRlcmluZyB3aGVuIHVzaW5nIGF3YXkzZCB3aXRoIHN0YXJsaW5nLiBETyBOT1QgUkVNT1ZFIFVOTEVTUyBTVEFSTElORyBJTlRFR1JBVElPTiBJUyBSRVRFU1RFRCFcblx0XHQvL3RoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdChmYWxzZSwgQ29udGV4dEdMQ29tcGFyZU1vZGUuTEVTU19FUVVBTCk7IC8vb29wc2llXG5cblx0XHRpZiAoIXRoaXMuX3NoYXJlQ29udGV4dCkge1xuXHRcdFx0aWYgKHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgJiYgdGhpcy5fc25hcHNob3RCaXRtYXBEYXRhKSB7XG5cdFx0XHRcdHRoaXMuX3BDb250ZXh0LmRyYXdUb0JpdG1hcERhdGEodGhpcy5fc25hcHNob3RCaXRtYXBEYXRhKTtcblx0XHRcdFx0dGhpcy5fc25hcHNob3RSZXF1aXJlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XG5cdH1cblxuXHQvKlxuXHQgKiBXaWxsIGRyYXcgdGhlIHJlbmRlcmVyJ3Mgb3V0cHV0IG9uIG5leHQgcmVuZGVyIHRvIHRoZSBwcm92aWRlZCBiaXRtYXAgZGF0YS5cblx0ICogKi9cblx0cHVibGljIHF1ZXVlU25hcHNob3QoYm1kOkJpdG1hcERhdGEpXG5cdHtcblx0XHR0aGlzLl9zbmFwc2hvdFJlcXVpcmVkID0gdHJ1ZTtcblx0XHR0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEgPSBibWQ7XG5cdH1cblxuXHQvKipcblx0ICogUGVyZm9ybXMgdGhlIGFjdHVhbCBkcmF3aW5nIG9mIGdlb21ldHJ5IHRvIHRoZSB0YXJnZXQuXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBvYmplY3QgY29udGFpbmluZyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeS5cblx0ICovXG5cdHB1YmxpYyBwRHJhdyhlbnRpdHlDb2xsZWN0b3I6Q29sbGVjdG9yQmFzZSlcblx0e1xuXHRcdHRoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblxuXHRcdGlmICh0aGlzLl9kaXNhYmxlQ29sb3IpXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRDb2xvck1hc2soZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuXG5cdFx0dGhpcy5kcmF3UmVuZGVyYWJsZXModGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkLCBlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0aWYgKHRoaXMuX3JlbmRlckJsZW5kZWQpXG5cdFx0XHR0aGlzLmRyYXdSZW5kZXJhYmxlcyh0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkLCBlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0aWYgKHRoaXMuX2Rpc2FibGVDb2xvcilcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldENvbG9yTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcblx0fVxuXG5cdC8vcHJpdmF0ZSBkcmF3Q2FzY2FkZVJlbmRlcmFibGVzKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIGNhbWVyYTpDYW1lcmEsIGN1bGxQbGFuZXM6QXJyYXk8UGxhbmUzRD4pXG5cdC8ve1xuXHQvL1x0dmFyIHJlbmRlcmFibGUyOlJlbmRlcmFibGVCYXNlO1xuXHQvL1x0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xuXHQvL1x0dmFyIHBhc3M6UmVuZGVyUGFzc0Jhc2U7XG5cdC8vXG5cdC8vXHR3aGlsZSAocmVuZGVyYWJsZSkge1xuXHQvL1x0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XG5cdC8vXHRcdHJlbmRlck9iamVjdCA9IHJlbmRlcmFibGUucmVuZGVyT2JqZWN0O1xuXHQvL1x0XHRwYXNzID0gcmVuZGVyT2JqZWN0LnBhc3Nlc1swXSAvL2Fzc3VtaW5nIG9ubHkgb25lIHBhc3MgcGVyIG1hdGVyaWFsXG5cdC8vXG5cdC8vXHRcdHRoaXMuYWN0aXZhdGVQYXNzKHJlbmRlcmFibGUsIHBhc3MsIGNhbWVyYSk7XG5cdC8vXG5cdC8vXHRcdGRvIHtcblx0Ly9cdFx0XHQvLyBpZiBjb21wbGV0ZWx5IGluIGZyb250LCBpdCB3aWxsIGZhbGwgaW4gYSBkaWZmZXJlbnQgY2FzY2FkZVxuXHQvL1x0XHRcdC8vIGRvIG5vdCB1c2UgbmVhciBhbmQgZmFyIHBsYW5lc1xuXHQvL1x0XHRcdGlmICghY3VsbFBsYW5lcyB8fCByZW5kZXJhYmxlMi5zb3VyY2VFbnRpdHkud29ybGRCb3VuZHMuaXNJbkZydXN0dW0oY3VsbFBsYW5lcywgNCkpIHtcblx0Ly9cdFx0XHRcdHJlbmRlcmFibGUyLl9pUmVuZGVyKHBhc3MsIGNhbWVyYSwgdGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4KTtcblx0Ly9cdFx0XHR9IGVsc2Uge1xuXHQvL1x0XHRcdFx0cmVuZGVyYWJsZTIuY2FzY2FkZWQgPSB0cnVlO1xuXHQvL1x0XHRcdH1cblx0Ly9cblx0Ly9cdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGUyLm5leHQ7XG5cdC8vXG5cdC8vXHRcdH0gd2hpbGUgKHJlbmRlcmFibGUyICYmIHJlbmRlcmFibGUyLnJlbmRlck9iamVjdCA9PSByZW5kZXJPYmplY3QgJiYgIXJlbmRlcmFibGUyLmNhc2NhZGVkKTtcblx0Ly9cblx0Ly9cdFx0dGhpcy5kZWFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlLCBwYXNzKTtcblx0Ly9cblx0Ly9cdFx0cmVuZGVyYWJsZSA9IHJlbmRlcmFibGUyO1xuXHQvL1x0fVxuXHQvL31cblxuXHQvKipcblx0ICogRHJhdyBhIGxpc3Qgb2YgcmVuZGVyYWJsZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlcyBUaGUgcmVuZGVyYWJsZXMgdG8gZHJhdy5cblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIGNvbnRhaW5pbmcgYWxsIHBvdGVudGlhbGx5IHZpc2libGUgaW5mb3JtYXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZHJhd1JlbmRlcmFibGVzKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlKVxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyO1xuXHRcdHZhciBsZW46bnVtYmVyO1xuXHRcdHZhciByZW5kZXJhYmxlMjpSZW5kZXJhYmxlQmFzZTtcblx0XHR2YXIgcmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2U7XG5cdFx0dmFyIHBhc3NlczpBcnJheTxSZW5kZXJQYXNzQmFzZT47XG5cdFx0dmFyIHBhc3M6UmVuZGVyUGFzc0Jhc2U7XG5cdFx0dmFyIGNhbWVyYTpDYW1lcmEgPSBlbnRpdHlDb2xsZWN0b3IuY2FtZXJhO1xuXG5cblx0XHR3aGlsZSAocmVuZGVyYWJsZSkge1xuXHRcdFx0cmVuZGVyT2JqZWN0ID0gcmVuZGVyYWJsZS5yZW5kZXJPYmplY3Q7XG5cdFx0XHRwYXNzZXMgPSByZW5kZXJPYmplY3QucGFzc2VzO1xuXG5cdFx0XHQvLyBvdGhlcndpc2UgdGhpcyB3b3VsZCByZXN1bHQgaW4gZGVwdGggcmVuZGVyZWQgYW55d2F5IGJlY2F1c2UgZnJhZ21lbnQgc2hhZGVyIGtpbCBpcyBpZ25vcmVkXG5cdFx0XHRpZiAodGhpcy5fZGlzYWJsZUNvbG9yICYmIHJlbmRlck9iamVjdC5fcmVuZGVyT2JqZWN0T3duZXIuYWxwaGFUaHJlc2hvbGQgIT0gMCkge1xuXHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XG5cdFx0XHRcdC8vIGZhc3QgZm9yd2FyZFxuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlMi5uZXh0O1xuXG5cdFx0XHRcdH0gd2hpbGUgKHJlbmRlcmFibGUyICYmIHJlbmRlcmFibGUyLnJlbmRlck9iamVjdCA9PSByZW5kZXJPYmplY3QpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9pdGVyYXRlIHRocm91Z2ggZWFjaCBzaGFkZXIgb2JqZWN0XG5cdFx0XHRcdGxlbiA9IHBhc3Nlcy5sZW5ndGg7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTtcblx0XHRcdFx0XHRwYXNzID0gcGFzc2VzW2ldO1xuXG5cdFx0XHRcdFx0dGhpcy5hY3RpdmF0ZVBhc3MocmVuZGVyYWJsZSwgcGFzcywgY2FtZXJhKTtcblxuXHRcdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRcdHJlbmRlcmFibGUyLl9pUmVuZGVyKHBhc3MsIGNhbWVyYSwgdGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4KTtcblxuXHRcdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlMi5uZXh0O1xuXG5cdFx0XHRcdFx0fSB3aGlsZSAocmVuZGVyYWJsZTIgJiYgcmVuZGVyYWJsZTIucmVuZGVyT2JqZWN0ID09IHJlbmRlck9iamVjdCk7XG5cblx0XHRcdFx0XHR0aGlzLmRlYWN0aXZhdGVQYXNzKHJlbmRlcmFibGUsIHBhc3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJlbmRlcmFibGUgPSByZW5kZXJhYmxlMjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQXNzaWduIHRoZSBjb250ZXh0IG9uY2UgcmV0cmlldmVkXG5cdCAqL1xuXHRwcml2YXRlIG9uQ29udGV4dFVwZGF0ZShldmVudDpFdmVudClcblx0e1xuXHRcdHRoaXMuX3BDb250ZXh0ID0gPElDb250ZXh0R0w+IHRoaXMuX3BTdGFnZS5jb250ZXh0O1xuXHR9XG5cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRBbHBoYSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRBbHBoYTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kQWxwaGEodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRBbHBoYSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JhY2tncm91bmRBbHBoYSA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0fVxuXG5cdC8qXG5cdCBwdWJsaWMgZ2V0IGlCYWNrZ3JvdW5kKCk6VGV4dHVyZTJEQmFzZVxuXHQge1xuXHQgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG5cdCB9XG5cdCAqL1xuXG5cdC8qXG5cdCBwdWJsaWMgc2V0IGlCYWNrZ3JvdW5kKHZhbHVlOlRleHR1cmUyREJhc2UpXG5cdCB7XG5cdCBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgJiYgIXZhbHVlKSB7XG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5kaXNwb3NlKCk7XG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciA9IG51bGw7XG5cdCB9XG5cblx0IGlmICghdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgJiYgdmFsdWUpXG5cdCB7XG5cblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyID0gbmV3IEJhY2tncm91bmRJbWFnZVJlbmRlcmVyKHRoaXMuX3BTdGFnZSk7XG5cblx0IH1cblxuXG5cdCB0aGlzLl9iYWNrZ3JvdW5kID0gdmFsdWU7XG5cblx0IGlmICh0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcilcblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLnRleHR1cmUgPSB2YWx1ZTtcblx0IH1cblx0ICovXG5cdC8qXG5cdCBwdWJsaWMgZ2V0IGJhY2tncm91bmRJbWFnZVJlbmRlcmVyKCk6QmFja2dyb3VuZEltYWdlUmVuZGVyZXJcblx0IHtcblx0IHJldHVybiBfYmFja2dyb3VuZEltYWdlUmVuZGVyZXI7XG5cdCB9XG5cdCAqL1xuXG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIG5vdGlmeVNjaXNzb3JVcGRhdGUoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NjaXNzb3JEaXJ0eSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3NjaXNzb3JEaXJ0eSA9IHRydWU7XG5cblx0XHRpZiAoIXRoaXMuX3NjaXNzb3JVcGRhdGVkKVxuXHRcdFx0dGhpcy5fc2Npc3NvclVwZGF0ZWQgPSBuZXcgUmVuZGVyZXJFdmVudChSZW5kZXJlckV2ZW50LlNDSVNTT1JfVVBEQVRFRCk7XG5cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fc2Npc3NvclVwZGF0ZWQpO1xuXHR9XG5cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgbm90aWZ5Vmlld3BvcnRVcGRhdGUoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3ZpZXdwb3J0RGlydHkpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl92aWV3cG9ydERpcnR5ID0gdHJ1ZTtcblxuXHRcdGlmICghdGhpcy5fdmlld1BvcnRVcGRhdGVkKVxuXHRcdFx0dGhpcy5fdmlld1BvcnRVcGRhdGVkID0gbmV3IFJlbmRlcmVyRXZlbnQoUmVuZGVyZXJFdmVudC5WSUVXUE9SVF9VUERBVEVEKTtcblxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl92aWV3UG9ydFVwZGF0ZWQpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgb25WaWV3cG9ydFVwZGF0ZWQoZXZlbnQ6U3RhZ2VFdmVudClcblx0e1xuXHRcdHRoaXMuX3ZpZXdQb3J0ID0gdGhpcy5fcFN0YWdlLnZpZXdQb3J0O1xuXHRcdC8vVE9ETyBzdG9wIGZpcmluZyB2aWV3cG9ydCB1cGRhdGVkIGZvciBldmVyeSBzdGFnZWdsIHZpZXdwb3J0IGNoYW5nZVxuXG5cdFx0aWYgKHRoaXMuX3NoYXJlQ29udGV4dCkge1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnggPSB0aGlzLl9nbG9iYWxQb3MueCAtIHRoaXMuX3BTdGFnZS54O1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnkgPSB0aGlzLl9nbG9iYWxQb3MueSAtIHRoaXMuX3BTdGFnZS55O1xuXHRcdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5ub3RpZnlWaWV3cG9ydFVwZGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgdXBkYXRlR2xvYmFsUG9zKClcblx0e1xuXHRcdGlmICh0aGlzLl9zaGFyZUNvbnRleHQpIHtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC54ID0gdGhpcy5fZ2xvYmFsUG9zLnggLSB0aGlzLl92aWV3UG9ydC54O1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnkgPSB0aGlzLl9nbG9iYWxQb3MueSAtIHRoaXMuX3ZpZXdQb3J0Lnk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC54ID0gMDtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC55ID0gMDtcblx0XHRcdHRoaXMuX3ZpZXdQb3J0LnggPSB0aGlzLl9nbG9iYWxQb3MueDtcblx0XHRcdHRoaXMuX3ZpZXdQb3J0LnkgPSB0aGlzLl9nbG9iYWxQb3MueTtcblx0XHR9XG5cblx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVuZGVyYWJsZVxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgYXBwbHlSZW5kZXJhYmxlKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UpXG5cdHtcblx0XHQvL3NldCBsb2NhbCB2YXJzIGZvciBmYXN0ZXIgcmVmZXJlbmNpbmdcblx0XHR2YXIgcmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2UgPSB0aGlzLl9wR2V0UmVuZGVyT2JqZWN0KHJlbmRlcmFibGUsIHJlbmRlcmFibGUucmVuZGVyT2JqZWN0T3duZXIgfHwgRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0TWF0ZXJpYWwocmVuZGVyYWJsZS5yZW5kZXJhYmxlT3duZXIpKTtcblxuXHRcdHJlbmRlcmFibGUucmVuZGVyT2JqZWN0ID0gcmVuZGVyT2JqZWN0O1xuXHRcdHJlbmRlcmFibGUucmVuZGVyT2JqZWN0SWQgPSByZW5kZXJPYmplY3QucmVuZGVyT2JqZWN0SWQ7XG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJPcmRlcklkID0gcmVuZGVyT2JqZWN0LnJlbmRlck9yZGVySWQ7XG5cblx0XHRyZW5kZXJhYmxlLmNhc2NhZGVkID0gZmFsc2U7XG5cblx0XHR2YXIgZW50aXR5OklFbnRpdHkgPSByZW5kZXJhYmxlLnNvdXJjZUVudGl0eTtcblx0XHR2YXIgcG9zaXRpb246VmVjdG9yM0QgPSBlbnRpdHkuc2NlbmVQb3NpdGlvbjtcblxuXHRcdC8vIHByb2plY3Qgb250byBjYW1lcmEncyB6LWF4aXNcblx0XHRwb3NpdGlvbiA9IHRoaXMuX2lFbnRyeVBvaW50LnN1YnRyYWN0KHBvc2l0aW9uKTtcblx0XHRyZW5kZXJhYmxlLnpJbmRleCA9IGVudGl0eS56T2Zmc2V0ICsgcG9zaXRpb24uZG90UHJvZHVjdCh0aGlzLl9wQ2FtZXJhRm9yd2FyZCk7XG5cblx0XHQvL3N0b3JlIHJlZmVyZW5jZSB0byBzY2VuZSB0cmFuc2Zvcm1cblx0XHRyZW5kZXJhYmxlLnJlbmRlclNjZW5lVHJhbnNmb3JtID0gcmVuZGVyYWJsZS5zb3VyY2VFbnRpdHkuZ2V0UmVuZGVyU2NlbmVUcmFuc2Zvcm0odGhpcy5fcENhbWVyYSk7XG5cblx0XHRpZiAocmVuZGVyT2JqZWN0LnJlcXVpcmVzQmxlbmRpbmcpIHtcblx0XHRcdHJlbmRlcmFibGUubmV4dCA9IHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQ7XG5cdFx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gcmVuZGVyYWJsZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVuZGVyYWJsZS5uZXh0ID0gdGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkO1xuXHRcdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gcmVuZGVyYWJsZTtcblx0XHR9XG5cblx0XHR0aGlzLl9wTnVtVHJpYW5nbGVzICs9IHJlbmRlcmFibGUubnVtVHJpYW5nbGVzO1xuXG5cdFx0Ly9oYW5kbGUgYW55IG92ZXJmbG93IGZvciByZW5kZXJhYmxlcyB3aXRoIGRhdGEgdGhhdCBleGNlZWRzIEdQVSBsaW1pdGF0aW9uc1xuXHRcdGlmIChyZW5kZXJhYmxlLm92ZXJmbG93KVxuXHRcdFx0dGhpcy5hcHBseVJlbmRlcmFibGUocmVuZGVyYWJsZS5vdmVyZmxvdyk7XG5cdH1cblxuXHRwdWJsaWMgX3BHZXRSZW5kZXJPYmplY3QocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgcmVuZGVyT2JqZWN0T3duZXI6SVJlbmRlck9iamVjdE93bmVyKTpSZW5kZXJPYmplY3RCYXNlXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG59XG5cbmV4cG9ydCA9IFJlbmRlcmVyQmFzZTsiXX0=