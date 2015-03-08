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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL1JlbmRlcmVyQmFzZS50cyJdLCJuYW1lcyI6WyJSZW5kZXJlckJhc2UiLCJSZW5kZXJlckJhc2UuY29uc3RydWN0b3IiLCJSZW5kZXJlckJhc2UucmVuZGVyQmxlbmRlZCIsIlJlbmRlcmVyQmFzZS5kaXNhYmxlQ29sb3IiLCJSZW5kZXJlckJhc2UubnVtVHJpYW5nbGVzIiwiUmVuZGVyZXJCYXNlLnZpZXdQb3J0IiwiUmVuZGVyZXJCYXNlLnNjaXNzb3JSZWN0IiwiUmVuZGVyZXJCYXNlLngiLCJSZW5kZXJlckJhc2UueSIsIlJlbmRlcmVyQmFzZS53aWR0aCIsIlJlbmRlcmVyQmFzZS5oZWlnaHQiLCJSZW5kZXJlckJhc2UuYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLmRlYWN0aXZhdGVQYXNzIiwiUmVuZGVyZXJCYXNlLl9pQ3JlYXRlRW50aXR5Q29sbGVjdG9yIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZFIiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kRyIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRCIiwiUmVuZGVyZXJCYXNlLmNvbnRleHQiLCJSZW5kZXJlckJhc2Uuc3RhZ2UiLCJSZW5kZXJlckJhc2UuaVNldFN0YWdlIiwiUmVuZGVyZXJCYXNlLnNoYXJlQ29udGV4dCIsIlJlbmRlcmVyQmFzZS5kaXNwb3NlIiwiUmVuZGVyZXJCYXNlLnJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlckNhc2NhZGVzIiwiUmVuZGVyZXJCYXNlLnBDb2xsZWN0UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2UucEV4ZWN1dGVSZW5kZXIiLCJSZW5kZXJlckJhc2UucXVldWVTbmFwc2hvdCIsIlJlbmRlcmVyQmFzZS5wRHJhdyIsIlJlbmRlcmVyQmFzZS5kcmF3UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2Uub25Db250ZXh0VXBkYXRlIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZEFscGhhIiwiUmVuZGVyZXJCYXNlLm5vdGlmeVNjaXNzb3JVcGRhdGUiLCJSZW5kZXJlckJhc2Uubm90aWZ5Vmlld3BvcnRVcGRhdGUiLCJSZW5kZXJlckJhc2Uub25WaWV3cG9ydFVwZGF0ZWQiLCJSZW5kZXJlckJhc2UudXBkYXRlR2xvYmFsUG9zIiwiUmVuZGVyZXJCYXNlLmFwcGx5UmVuZGVyYWJsZSIsIlJlbmRlcmVyQmFzZS5fcEdldFJlbmRlck9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFFaEUsSUFBTyxLQUFLLFdBQWdCLDRCQUE0QixDQUFDLENBQUM7QUFDMUQsSUFBTyxTQUFTLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUVqRSxJQUFPLG1CQUFtQixXQUFhLDRDQUE0QyxDQUFDLENBQUM7QUFDckYsSUFBTyxlQUFlLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQVM5RSxJQUFPLG1CQUFtQixXQUFhLDZDQUE2QyxDQUFDLENBQUM7QUFNdEYsSUFBTyxhQUFhLFdBQWMseUNBQXlDLENBQUMsQ0FBQztBQUM3RSxJQUFPLFVBQVUsV0FBZSxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXhFLElBQU8sZUFBZSxXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHbkYsSUFBTyxzQkFBc0IsV0FBWSxvREFBb0QsQ0FBQyxDQUFDO0FBRS9GLElBQU8saUJBQWlCLFdBQWEsc0RBQXNELENBQUMsQ0FBQztBQUM3RixJQUFPLG9CQUFvQixXQUFhLDhDQUE4QyxDQUFDLENBQUM7QUFDeEYsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBR3hGLElBQU8sWUFBWSxXQUFlLDBDQUEwQyxDQUFDLENBQUM7QUFVOUUsSUFBTyxnQkFBZ0IsV0FBYyw2Q0FBNkMsQ0FBQyxDQUFDO0FBR3BGLEFBTUE7Ozs7O0dBREc7SUFDRyxZQUFZO0lBQVNBLFVBQXJCQSxZQUFZQSxVQUF3QkE7SUFvTXpDQTs7T0FFR0E7SUFDSEEsU0F2TUtBLFlBQVlBLENBdU1MQSxpQkFBMkNBLEVBQUVBLEtBQWtCQTtRQXZNNUVDLGlCQW96QkNBO1FBN21CWUEsaUNBQTJDQSxHQUEzQ0Esd0JBQTJDQTtRQUFFQSxxQkFBa0JBLEdBQWxCQSxZQUFrQkE7UUFFMUVBLGlCQUFPQSxDQUFDQTtRQXZNREEsb0JBQWVBLEdBQVVBLENBQUNBLENBQUNBO1FBQzNCQSxxQkFBZ0JBLEdBQVVBLENBQUNBLENBQUNBO1FBYTVCQSxjQUFTQSxHQUFhQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUl2Q0Esd0JBQW1CQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUNuQ0EsMEJBQXFCQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUNyQ0Esa0JBQWFBLEdBQVdBLEtBQUtBLENBQUNBO1FBQzdCQSxpQkFBWUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLGlCQUFZQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUN4QkEsaUJBQVlBLEdBQVVBLENBQUNBLENBQUNBO1FBQ3hCQSxxQkFBZ0JBLEdBQVVBLENBQUNBLENBQUNBO1FBQzdCQSxrQkFBYUEsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFNOUJBLGtCQUFhQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUN6QkEsa0JBQWFBLEdBQVVBLENBQUNBLENBQUNBO1FBS3pCQSw4QkFBeUJBLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBRW5EQSxjQUFTQSxHQUFTQSxJQUFJQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUM5QkEsZUFBVUEsR0FBU0EsSUFBSUEsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDaENBLGtCQUFhQSxHQUFhQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtRQVExQ0EsbUJBQWNBLEdBQVVBLENBQUNBLENBQUNBO1FBSTFCQSxrQkFBYUEsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFDOUJBLG1CQUFjQSxHQUFXQSxJQUFJQSxDQUFDQTtRQW1KcENBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsaUJBQWlCQSxDQUFDQTtRQUU3Q0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxHQUFHQSxVQUFDQSxLQUFnQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUE3QkEsQ0FBNkJBLENBQUFBO1FBQ3JGQSxJQUFJQSxDQUFDQSx3QkFBd0JBLEdBQUdBLFVBQUNBLEtBQVdBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLGVBQWVBLENBQUNBLEtBQUtBLENBQUNBLEVBQTNCQSxDQUEyQkEsQ0FBQ0E7UUFFN0VBLEFBQ0FBLDJCQUQyQkE7UUFDM0JBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUVsREEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxHQUFFQSxJQUFJQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFMUdBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLElBQUlBLFlBQVlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO0lBQ2pFQSxDQUFDQTtJQTNKREQsc0JBQVdBLHVDQUFhQTthQUF4QkE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDNUJBLENBQUNBO2FBRURGLFVBQXlCQSxLQUFhQTtZQUVyQ0UsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDN0JBLENBQUNBOzs7T0FMQUY7SUFRREEsc0JBQVdBLHNDQUFZQTthQUF2QkE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDM0JBLENBQUNBO2FBRURILFVBQXdCQSxLQUFhQTtZQUVwQ0csSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDNUJBLENBQUNBOzs7T0FMQUg7SUFVREEsc0JBQVdBLHNDQUFZQTtRQUh2QkE7O1dBRUdBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBQzVCQSxDQUFDQTs7O09BQUFKO0lBV0RBLHNCQUFXQSxrQ0FBUUE7UUFIbkJBOztXQUVHQTthQUNIQTtZQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUN2QkEsQ0FBQ0E7OztPQUFBTDtJQUtEQSxzQkFBV0EscUNBQVdBO1FBSHRCQTs7V0FFR0E7YUFDSEE7WUFFQ00sTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDM0JBLENBQUNBOzs7T0FBQU47SUFLREEsc0JBQVdBLDJCQUFDQTtRQUhaQTs7V0FFR0E7YUFDSEE7WUFFQ08sTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDekJBLENBQUNBO2FBRURQLFVBQWFBLEtBQVlBO1lBRXhCTyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQTtnQkFDbkJBLE1BQU1BLENBQUNBO1lBRVJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBO1lBRTdDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7OztPQVZBUDtJQWVEQSxzQkFBV0EsMkJBQUNBO1FBSFpBOztXQUVHQTthQUNIQTtZQUVDUSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7YUFFRFIsVUFBYUEsS0FBWUE7WUFFeEJRLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBO2dCQUNuQkEsTUFBTUEsQ0FBQ0E7WUFFUkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFN0NBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BVkFSO0lBZURBLHNCQUFXQSwrQkFBS0E7UUFIaEJBOztXQUVHQTthQUNIQTtZQUVDUyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7YUFFRFQsVUFBaUJBLEtBQVlBO1lBRTVCUyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQTtnQkFDeEJBLE1BQU1BLENBQUNBO1lBRVJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3BCQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUVqQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQTtnQkFDM0JBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFM0NBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDaENBLElBQUlBLENBQUNBLHFCQUFxQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFFbENBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFDNUJBLENBQUNBOzs7T0FqQkFUO0lBc0JEQSxzQkFBV0EsZ0NBQU1BO1FBSGpCQTs7V0FFR0E7YUFDSEE7WUFFQ1UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDckJBLENBQUNBO2FBRURWLFVBQWtCQSxLQUFZQTtZQUU3QlUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQ3pCQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNyQkEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFbENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0E7Z0JBQzNCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1lBRTVDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2hDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLEdBQUdBLElBQUlBLENBQUNBO1lBRWxDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBQzVCQSxDQUFDQTs7O09BakJBVjtJQXVDTUEsbUNBQVlBLEdBQW5CQSxVQUFvQkEsVUFBeUJBLEVBQUVBLElBQW1CQSxFQUFFQSxNQUFhQTtRQUdoRlcsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0EsRUFBRUE7WUFDckVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFHM0NBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0EsRUFBRUE7WUFDdkVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBRXRDQSxBQUNBQSxnQ0FEZ0NBO1lBQzVCQSxXQUFXQSxHQUFlQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUV0REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMUJBLFdBQVdBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1lBQ3JEQSxJQUFJQSxjQUFjQSxHQUFhQSxDQUFDQSxJQUFJQSxpQkFBaUJBLEVBQUVBLENBQUNBLFFBQVFBLENBQUNBLGlCQUFpQkEsR0FBR0EsV0FBV0EsQ0FBQ0EsWUFBWUEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDM0lBLElBQUlBLGdCQUFnQkEsR0FBYUEsQ0FBQ0EsSUFBSUEsaUJBQWlCQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxtQkFBbUJBLEdBQUdBLFdBQVdBLENBQUNBLGNBQWNBLEdBQUdBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO1lBQ25KQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxFQUFFQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBQzlEQSxDQUFDQTtRQUVEQSxBQUNBQSxrQkFEa0JBO1FBQ2xCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUUvQ0EsQUFDQUEsMkNBRDJDQTtRQUMzQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDckNBLENBQUNBO0lBRU1YLHFDQUFjQSxHQUFyQkEsVUFBc0JBLFVBQXlCQSxFQUFFQSxJQUFtQkE7UUFFbkVZLEFBQ0FBLDBCQUQwQkE7UUFDMUJBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBRTlCQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUNsREEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQTtJQUNyREEsQ0FBQ0E7SUFFTVosOENBQXVCQSxHQUE5QkE7UUFFQ2EsTUFBTUEsQ0FBQ0EsSUFBSUEsZUFBZUEsRUFBRUEsQ0FBQ0E7SUFDOUJBLENBQUNBO0lBT0RiLHNCQUFXQSx1Q0FBYUE7UUFMeEJBOzs7O1dBSUdBO2FBQ0hBO1lBRUNjLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBO1FBQzFCQSxDQUFDQTthQUVEZCxVQUF5QkEsS0FBWUE7WUFFcENjLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLEtBQUtBLENBQUNBO2dCQUM5QkEsTUFBTUEsQ0FBQ0E7WUFFUkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFMUJBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDakNBLENBQUNBOzs7T0FWQWQ7SUFpQkRBLHNCQUFXQSx1Q0FBYUE7UUFMeEJBOzs7O1dBSUdBO2FBQ0hBO1lBRUNlLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBO1FBQzFCQSxDQUFDQTthQUVEZixVQUF5QkEsS0FBWUE7WUFFcENlLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLEtBQUtBLENBQUNBO2dCQUM5QkEsTUFBTUEsQ0FBQ0E7WUFFUkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFMUJBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDakNBLENBQUNBOzs7T0FWQWY7SUFpQkRBLHNCQUFXQSx1Q0FBYUE7UUFMeEJBOzs7O1dBSUdBO2FBQ0hBO1lBRUNnQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7YUFFRGhCLFVBQXlCQSxLQUFZQTtZQUVwQ2dCLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLEtBQUtBLENBQUNBO2dCQUM5QkEsTUFBTUEsQ0FBQ0E7WUFFUkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFMUJBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDakNBLENBQUNBOzs7T0FWQWhCO0lBWURBLHNCQUFXQSxpQ0FBT0E7YUFBbEJBO1lBRUNpQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUN2QkEsQ0FBQ0E7OztPQUFBakI7SUFLREEsc0JBQVdBLCtCQUFLQTtRQUhoQkE7O1dBRUdBO2FBQ0hBO1lBRUNrQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7YUFFRGxCLFVBQWlCQSxLQUFXQTtZQUUzQmtCLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLElBQUlBLEtBQUtBLENBQUNBO2dCQUN6QkEsTUFBTUEsQ0FBQ0E7WUFFUkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FSQWxCO0lBVU1BLGdDQUFTQSxHQUFoQkEsVUFBaUJBLEtBQVdBO1FBRTNCbUIsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFDaEJBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1FBRWhCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUVyQkEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFFeENBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsZUFBZUEsRUFBRUEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxDQUFDQTtZQUN6RkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxVQUFVQSxDQUFDQSxpQkFBaUJBLEVBQUVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0E7WUFDM0ZBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxJQUFJQSxDQUFDQSwwQkFBMEJBLENBQUNBLENBQUNBO1lBRTVGQSxBQUlBQTs7O2VBREdBO1lBQ0hBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO2dCQUN4QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBZ0JBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO1FBQ3JEQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLENBQUNBO1FBRWhDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtJQUN4QkEsQ0FBQ0E7SUFNRG5CLHNCQUFXQSxzQ0FBWUE7UUFKdkJBOzs7V0FHR0E7YUFDSEE7WUFFQ29CLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1FBQzNCQSxDQUFDQTthQUVEcEIsVUFBd0JBLEtBQWFBO1lBRXBDb0IsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQy9CQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUUzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FWQXBCO0lBWURBOztPQUVHQTtJQUNJQSw4QkFBT0EsR0FBZEE7UUFFQ3FCLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1FBRTdCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxtQkFBbUJBLENBQUNBLFVBQVVBLENBQUNBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0E7UUFDNUZBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLG1CQUFtQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLENBQUNBO1FBQzlGQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxtQkFBbUJBLENBQUNBLFVBQVVBLENBQUNBLGdCQUFnQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxDQUFDQSxDQUFDQTtRQUUvRkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3RCQTs7Ozs7V0FLR0E7SUFDSkEsQ0FBQ0E7SUFFTXJCLDZCQUFNQSxHQUFiQSxVQUFjQSxlQUE2QkE7UUFFMUNzQixJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRUR0Qjs7Ozs7O09BTUdBO0lBQ0lBLCtCQUFRQSxHQUFmQSxVQUFnQkEsZUFBNkJBLEVBQUVBLE1BQThCQSxFQUFFQSxXQUE0QkEsRUFBRUEsZUFBMEJBO1FBQXhGdUIsc0JBQThCQSxHQUE5QkEsYUFBOEJBO1FBQUVBLDJCQUE0QkEsR0FBNUJBLGtCQUE0QkE7UUFBRUEsK0JBQTBCQSxHQUExQkEsbUJBQTBCQTtRQUV0SUEsQUFDQUEsOEVBRDhFQTtRQUM5RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDcENBLE1BQU1BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFDL0VBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFdEZBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLE1BQU1BLEVBQUVBLFdBQVdBLEVBQUVBLGVBQWVBLENBQUNBLENBQUNBO1FBTzNFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNuQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUMxQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDdENBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRU12Qix1Q0FBZ0JBLEdBQXZCQSxVQUF3QkEsZUFBcUNBLEVBQUVBLE1BQXVCQSxFQUFFQSxXQUFrQkEsRUFBRUEsWUFBNkJBLEVBQUVBLE9BQXFCQTtRQUUvSndCLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFFMUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzlDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUV2Q0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZUFBZUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxHQUFHQSxFQUFFQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3BGQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxFQUFFQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBRTdEQSxJQUFJQSxJQUFJQSxHQUFrQkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtRQUV0REEsSUFBSUEsS0FBS0EsR0FBV0EsSUFBSUEsQ0FBQ0E7UUFHekJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLFdBQVdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQ2xEQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQ0EsQUFDQUEsd0ZBRHdGQTtZQUN4RkEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDZkEsQ0FBQ0E7UUFFREEsQUFDQUEsNkhBRDZIQTtRQUM3SEEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsS0FBS0EsRUFBRUEsb0JBQW9CQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUVwRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRU14QiwwQ0FBbUJBLEdBQTFCQSxVQUEyQkEsZUFBNkJBO1FBRXZEeUIsQUFDQUEsbUJBRG1CQTtRQUNuQkEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFeEJBLEFBQ0FBLGtCQURrQkE7WUFDZEEsSUFBSUEsR0FBa0JBLGVBQWVBLENBQUNBLFVBQVVBLENBQUNBO1FBRXJEQSxBQUNBQSwyREFEMkRBO1FBQzNEQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDaERBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLGFBQWFBLENBQUNBO1FBRzdEQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUNiQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1lBQ3JEQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFFREEsQUFDQUEsZ0NBRGdDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxHQUFvQkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxxQkFBcUJBLENBQUNBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0E7UUFDeEhBLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBb0JBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLENBQUNBO0lBQzVIQSxDQUFDQTtJQUVEekI7Ozs7Ozs7T0FPR0E7SUFDSUEscUNBQWNBLEdBQXJCQSxVQUFzQkEsZUFBNkJBLEVBQUVBLE1BQThCQSxFQUFFQSxXQUE0QkEsRUFBRUEsZUFBMEJBO1FBQXhGMEIsc0JBQThCQSxHQUE5QkEsYUFBOEJBO1FBQUVBLDJCQUE0QkEsR0FBNUJBLGtCQUE0QkE7UUFBRUEsK0JBQTBCQSxHQUExQkEsbUJBQTBCQTtRQUU1SUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFFNURBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1lBQzFEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBRTVHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUV2Q0EsQUFJQUE7OztXQURHQTtRQUNIQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBRTFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxlQUFlQSxDQUFDQSxvQkFBb0JBLENBQUNBLEdBQUdBLEVBQUVBLG9CQUFvQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFcEZBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBRTVCQSxBQUdBQSw2SEFINkhBO1FBQzdIQSwrRUFBK0VBO1FBRS9FQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxJQUFJQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4REEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBO2dCQUMxREEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRUQxQjs7U0FFS0E7SUFDRUEsb0NBQWFBLEdBQXBCQSxVQUFxQkEsR0FBY0E7UUFFbEMyQixJQUFJQSxDQUFDQSxpQkFBaUJBLEdBQUdBLElBQUlBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLEdBQUdBLENBQUNBO0lBQ2hDQSxDQUFDQTtJQUVEM0I7OztPQUdHQTtJQUNJQSw0QkFBS0EsR0FBWkEsVUFBYUEsZUFBNkJBO1FBRXpDNEIsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsRUFBRUEsb0JBQW9CQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUVuRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDdEJBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFlBQVlBLENBQUNBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBRXpEQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxzQkFBc0JBLEVBQUVBLGVBQWVBLENBQUNBLENBQUNBO1FBRW5FQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUVyRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDdEJBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0lBQ3REQSxDQUFDQTtJQUVENUIscUdBQXFHQTtJQUNyR0EsR0FBR0E7SUFDSEEsa0NBQWtDQTtJQUNsQ0EscUNBQXFDQTtJQUNyQ0EsMkJBQTJCQTtJQUMzQkEsRUFBRUE7SUFDRkEsdUJBQXVCQTtJQUN2QkEsNkJBQTZCQTtJQUM3QkEsMkNBQTJDQTtJQUMzQ0EsdUVBQXVFQTtJQUN2RUEsRUFBRUE7SUFDRkEsZ0RBQWdEQTtJQUNoREEsRUFBRUE7SUFDRkEsUUFBUUE7SUFDUkEsbUVBQW1FQTtJQUNuRUEsc0NBQXNDQTtJQUN0Q0EsMEZBQTBGQTtJQUMxRkEseUVBQXlFQTtJQUN6RUEsYUFBYUE7SUFDYkEsa0NBQWtDQTtJQUNsQ0EsTUFBTUE7SUFDTkEsRUFBRUE7SUFDRkEsb0NBQW9DQTtJQUNwQ0EsRUFBRUE7SUFDRkEsK0ZBQStGQTtJQUMvRkEsRUFBRUE7SUFDRkEsMENBQTBDQTtJQUMxQ0EsRUFBRUE7SUFDRkEsNkJBQTZCQTtJQUM3QkEsSUFBSUE7SUFDSkEsR0FBR0E7SUFFSEE7Ozs7O09BS0dBO0lBQ0lBLHNDQUFlQSxHQUF0QkEsVUFBdUJBLFVBQXlCQSxFQUFFQSxlQUE2QkE7UUFFOUU2QixJQUFJQSxDQUFRQSxDQUFDQTtRQUNiQSxJQUFJQSxHQUFVQSxDQUFDQTtRQUNmQSxJQUFJQSxXQUEwQkEsQ0FBQ0E7UUFDL0JBLElBQUlBLFlBQTZCQSxDQUFDQTtRQUNsQ0EsSUFBSUEsTUFBNEJBLENBQUNBO1FBQ2pDQSxJQUFJQSxJQUFtQkEsQ0FBQ0E7UUFDeEJBLElBQUlBLE1BQU1BLEdBQVVBLGVBQWVBLENBQUNBLE1BQU1BLENBQUNBO1FBRzNDQSxPQUFPQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUNuQkEsWUFBWUEsR0FBR0EsVUFBVUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDdkNBLE1BQU1BLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBO1lBRTdCQSxBQUNBQSw4RkFEOEZBO1lBQzlGQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxZQUFZQSxDQUFDQSxrQkFBa0JBLENBQUNBLGNBQWNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvRUEsV0FBV0EsR0FBR0EsVUFBVUEsQ0FBQ0E7Z0JBRXpCQSxHQUFHQSxDQUFDQTtvQkFDSEEsV0FBV0EsR0FBR0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBRWhDQSxDQUFDQSxRQUFRQSxXQUFXQSxJQUFJQSxXQUFXQSxDQUFDQSxZQUFZQSxJQUFJQSxZQUFZQSxFQUFFQTtZQUNuRUEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLEFBQ0FBLG9DQURvQ0E7Z0JBQ3BDQSxHQUFHQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFDcEJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUMxQkEsV0FBV0EsR0FBR0EsVUFBVUEsQ0FBQ0E7b0JBQ3pCQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFakJBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLEVBQUVBLElBQUlBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO29CQUU1Q0EsR0FBR0EsQ0FBQ0E7d0JBQ0hBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLEVBQUVBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsQ0FBQ0E7d0JBRW5FQSxXQUFXQSxHQUFHQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQTtvQkFFaENBLENBQUNBLFFBQVFBLFdBQVdBLElBQUlBLFdBQVdBLENBQUNBLFlBQVlBLElBQUlBLFlBQVlBLEVBQUVBO29CQUVsRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxDQUFDQTtZQUNGQSxDQUFDQTtZQUVEQSxVQUFVQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFRDdCOztPQUVHQTtJQUNLQSxzQ0FBZUEsR0FBdkJBLFVBQXdCQSxLQUFXQTtRQUVsQzhCLElBQUlBLENBQUNBLFNBQVNBLEdBQWdCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUNwREEsQ0FBQ0E7SUFFRDlCLHNCQUFXQSwyQ0FBaUJBO2FBQTVCQTtZQUVDK0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7YUFFRC9CLFVBQTZCQSxLQUFZQTtZQUV4QytCLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsSUFBSUEsS0FBS0EsQ0FBQ0E7Z0JBQ2xDQSxNQUFNQSxDQUFDQTtZQUVSQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLEtBQUtBLENBQUNBO1lBRTlCQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pDQSxDQUFDQTs7O09BVkEvQjtJQVlEQTs7Ozs7T0FLR0E7SUFFSEE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCR0E7SUFDSEE7Ozs7O09BS0dBO0lBR0hBOztPQUVHQTtJQUNLQSwwQ0FBbUJBLEdBQTNCQTtRQUVDZ0MsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDdEJBLE1BQU1BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBO1FBRTFCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQTtZQUN6QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsYUFBYUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFFekVBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUdEaEM7O09BRUdBO0lBQ0tBLDJDQUFvQkEsR0FBNUJBO1FBRUNpQyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtZQUN2QkEsTUFBTUEsQ0FBQ0E7UUFFUkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFM0JBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7WUFDMUJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsYUFBYUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQTtRQUUzRUEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFFRGpDOztPQUVHQTtJQUNJQSx3Q0FBaUJBLEdBQXhCQSxVQUF5QkEsS0FBZ0JBO1FBRXhDa0MsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDdkNBLEFBRUFBLHFFQUZxRUE7UUFFckVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxREEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMURBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFDNUJBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBRURsQzs7T0FFR0E7SUFDSUEsc0NBQWVBLEdBQXRCQTtRQUVDbUMsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQzVEQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3REEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3pCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdENBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRURuQzs7OztPQUlHQTtJQUNJQSxzQ0FBZUEsR0FBdEJBLFVBQXVCQSxVQUF5QkE7UUFFL0NvQyxBQUNBQSx1Q0FEdUNBO1lBQ25DQSxZQUFZQSxHQUFvQkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxVQUFVQSxFQUFFQSxVQUFVQSxDQUFDQSxpQkFBaUJBLElBQUlBLHNCQUFzQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxVQUFVQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU5S0EsVUFBVUEsQ0FBQ0EsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0E7UUFDdkNBLFVBQVVBLENBQUNBLGNBQWNBLEdBQUdBLFlBQVlBLENBQUNBLGNBQWNBLENBQUNBO1FBQ3hEQSxVQUFVQSxDQUFDQSxhQUFhQSxHQUFHQSxZQUFZQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUV0REEsVUFBVUEsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLE1BQU1BLEdBQVdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO1FBQzdDQSxJQUFJQSxRQUFRQSxHQUFZQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUU3Q0EsQUFDQUEsK0JBRCtCQTtRQUMvQkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDaERBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBRS9FQSxBQUNBQSxvQ0FEb0NBO1FBQ3BDQSxVQUFVQSxDQUFDQSxvQkFBb0JBLEdBQUdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFFakdBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLFVBQVVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0E7WUFDL0NBLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDM0NBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLFVBQVVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7WUFDOUNBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDMUNBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLGNBQWNBLElBQUlBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBO1FBRS9DQSxBQUNBQSw0RUFENEVBO1FBQzVFQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7SUFDNUNBLENBQUNBO0lBRU1wQyx3Q0FBaUJBLEdBQXhCQSxVQUF5QkEsVUFBeUJBLEVBQUVBLGlCQUFvQ0E7UUFFdkZxQyxNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUNGckMsbUJBQUNBO0FBQURBLENBcHpCQSxBQW96QkNBLEVBcHpCMEIsZUFBZSxFQW96QnpDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImJhc2UvUmVuZGVyZXJCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaXRtYXBEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9kYXRhL0JpdG1hcERhdGFcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBQbGFuZTNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUGxhbmUzRFwiKTtcbmltcG9ydCBQb2ludFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1BvaW50XCIpO1xuaW1wb3J0IFJlY3RhbmdsZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9SZWN0YW5nbGVcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudERpc3BhdGNoZXJcIik7XG5pbXBvcnQgVGV4dHVyZVByb3h5QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVQcm94eUJhc2VcIik7XG5pbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBMaW5lU3ViTWVzaFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaW5lU3ViTWVzaFwiKTtcbmltcG9ydCBJUmVuZGVyT2JqZWN0T3duZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Yk1lc2hcIik7XG5pbXBvcnQgRW50aXR5TGlzdEl0ZW1cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL0VudGl0eUxpc3RJdGVtXCIpO1xuaW1wb3J0IElFbnRpdHlTb3J0ZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L0lFbnRpdHlTb3J0ZXJcIik7XG5pbXBvcnQgUmVuZGVyYWJsZU1lcmdlU29ydFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L1JlbmRlcmFibGVNZXJnZVNvcnRcIik7XG5pbXBvcnQgSVJlbmRlcmVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9yZW5kZXIvSVJlbmRlcmVyXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQmlsbGJvYXJkXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgSUVudGl0eVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9JRW50aXR5XCIpO1xuaW1wb3J0IFNreWJveFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XG5pbXBvcnQgUmVuZGVyZXJFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9SZW5kZXJlckV2ZW50XCIpO1xuaW1wb3J0IFN0YWdlRXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2V2ZW50cy9TdGFnZUV2ZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBFbnRpdHlDb2xsZWN0b3JcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9FbnRpdHlDb2xsZWN0b3JcIik7XG5pbXBvcnQgQ29sbGVjdG9yQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3RyYXZlcnNlL0NvbGxlY3RvckJhc2VcIik7XG5pbXBvcnQgU2hhZG93Q2FzdGVyQ29sbGVjdG9yXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9TaGFkb3dDYXN0ZXJDb2xsZWN0b3JcIik7XG5pbXBvcnQgRGVmYXVsdE1hdGVyaWFsTWFuYWdlclx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWFuYWdlcnMvRGVmYXVsdE1hdGVyaWFsTWFuYWdlclwiKTtcblxuaW1wb3J0IEFHQUxNaW5pQXNzZW1ibGVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FnbHNsL2Fzc2VtYmxlci9BR0FMTWluaUFzc2VtYmxlclwiKTtcbmltcG9ydCBDb250ZXh0R0xCbGVuZEZhY3Rvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTEJsZW5kRmFjdG9yXCIpO1xuaW1wb3J0IENvbnRleHRHTENvbXBhcmVNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQ29tcGFyZU1vZGVcIik7XG5pbXBvcnQgSUNvbnRleHRHTFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9JQ29udGV4dEdMXCIpO1xuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgU3RhZ2VNYW5hZ2VyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYW5hZ2Vycy9TdGFnZU1hbmFnZXJcIik7XG5pbXBvcnQgUHJvZ3JhbURhdGFcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3Bvb2wvUHJvZ3JhbURhdGFcIik7XG5cbmltcG9ydCBBbmltYXRpb25TZXRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdGlvblNldEJhc2VcIik7XG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xuaW1wb3J0IFJlbmRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9SZW5kZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBJUmVuZGVyZXJQb29sQ2xhc3NcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9JUmVuZGVyZXJQb29sQ2xhc3NcIik7XG5pbXBvcnQgUlRUQnVmZmVyTWFuYWdlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hbmFnZXJzL1JUVEJ1ZmZlck1hbmFnZXJcIik7XG5pbXBvcnQgUmVuZGVyUGFzc0Jhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvUmVuZGVyUGFzc0Jhc2VcIik7XG5pbXBvcnQgUmVuZGVyZXJQb29sQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyZXJQb29sQmFzZVwiKTtcblxuXG4vKipcbiAqIFJlbmRlcmVyQmFzZSBmb3JtcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBjbGFzc2VzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIHJlbmRlcmluZyBwaXBlbGluZSB0byByZW5kZXIgdGhlXG4gKiBjb250ZW50cyBvZiBhIHBhcnRpdGlvblxuICpcbiAqIEBjbGFzcyBhd2F5LnJlbmRlci5SZW5kZXJlckJhc2VcbiAqL1xuY2xhc3MgUmVuZGVyZXJCYXNlIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyXG57XG5cdHByaXZhdGUgX251bVVzZWRTdHJlYW1zOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX251bVVzZWRUZXh0dXJlczpudW1iZXIgPSAwO1xuXG5cdHByaXZhdGUgX3JlbmRlcmVyUG9vbDpSZW5kZXJlclBvb2xCYXNlO1xuXG5cdHB1YmxpYyBfcFJlbmRlcmVyUG9vbENsYXNzOklSZW5kZXJlclBvb2xDbGFzcztcblx0cHVibGljIF9wQ29udGV4dDpJQ29udGV4dEdMO1xuXHRwdWJsaWMgX3BTdGFnZTpTdGFnZTtcblxuXHRwdWJsaWMgX3BDYW1lcmE6Q2FtZXJhO1xuXHRwdWJsaWMgX2lFbnRyeVBvaW50OlZlY3RvcjNEO1xuXHRwdWJsaWMgX3BDYW1lcmFGb3J3YXJkOlZlY3RvcjNEO1xuXG5cdHB1YmxpYyBfcFJ0dEJ1ZmZlck1hbmFnZXI6UlRUQnVmZmVyTWFuYWdlcjtcblx0cHJpdmF0ZSBfdmlld1BvcnQ6UmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZSgpO1xuXHRwcml2YXRlIF92aWV3cG9ydERpcnR5OmJvb2xlYW47XG5cdHByaXZhdGUgX3NjaXNzb3JEaXJ0eTpib29sZWFuO1xuXG5cdHB1YmxpYyBfcEJhY2tCdWZmZXJJbnZhbGlkOmJvb2xlYW4gPSB0cnVlO1xuXHRwdWJsaWMgX3BEZXB0aFRleHR1cmVJbnZhbGlkOmJvb2xlYW4gPSB0cnVlO1xuXHRwdWJsaWMgX2RlcHRoUHJlcGFzczpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2JhY2tncm91bmRSOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX2JhY2tncm91bmRHOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX2JhY2tncm91bmRCOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX2JhY2tncm91bmRBbHBoYTpudW1iZXIgPSAxO1xuXHRwdWJsaWMgX3NoYXJlQ29udGV4dDpib29sZWFuID0gZmFsc2U7XG5cblx0Ly8gb25seSB1c2VkIGJ5IHJlbmRlcmVycyB0aGF0IG5lZWQgdG8gcmVuZGVyIGdlb21ldHJ5IHRvIHRleHR1cmVzXG5cdHB1YmxpYyBfd2lkdGg6bnVtYmVyO1xuXHRwdWJsaWMgX2hlaWdodDpudW1iZXI7XG5cblx0cHVibGljIHRleHR1cmVSYXRpb1g6bnVtYmVyID0gMTtcblx0cHVibGljIHRleHR1cmVSYXRpb1k6bnVtYmVyID0gMTtcblxuXHRwcml2YXRlIF9zbmFwc2hvdEJpdG1hcERhdGE6Qml0bWFwRGF0YTtcblx0cHJpdmF0ZSBfc25hcHNob3RSZXF1aXJlZDpib29sZWFuO1xuXG5cdHB1YmxpYyBfcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4Ok1hdHJpeDNEID0gbmV3IE1hdHJpeDNEKCk7XG5cblx0cHJpdmF0ZSBfbG9jYWxQb3M6UG9pbnQgPSBuZXcgUG9pbnQoKTtcblx0cHJpdmF0ZSBfZ2xvYmFsUG9zOlBvaW50ID0gbmV3IFBvaW50KCk7XG5cdHB1YmxpYyBfcFNjaXNzb3JSZWN0OlJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoKTtcblxuXHRwcml2YXRlIF9zY2lzc29yVXBkYXRlZDpSZW5kZXJlckV2ZW50O1xuXHRwcml2YXRlIF92aWV3UG9ydFVwZGF0ZWQ6UmVuZGVyZXJFdmVudDtcblxuXHRwcml2YXRlIF9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZTpGdW5jdGlvbjtcblx0cHJpdmF0ZSBfb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZTtcblxuXHRwdWJsaWMgX3BOdW1UcmlhbmdsZXM6bnVtYmVyID0gMDtcblxuXHRwdWJsaWMgX3BPcGFxdWVSZW5kZXJhYmxlSGVhZDpSZW5kZXJhYmxlQmFzZTtcblx0cHVibGljIF9wQmxlbmRlZFJlbmRlcmFibGVIZWFkOlJlbmRlcmFibGVCYXNlO1xuXHRwdWJsaWMgX2Rpc2FibGVDb2xvcjpib29sZWFuID0gZmFsc2U7XG5cdHB1YmxpYyBfcmVuZGVyQmxlbmRlZDpib29sZWFuID0gdHJ1ZTtcblxuXG5cdHB1YmxpYyBnZXQgcmVuZGVyQmxlbmRlZCgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9yZW5kZXJCbGVuZGVkO1xuXHR9XG5cblx0cHVibGljIHNldCByZW5kZXJCbGVuZGVkKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHR0aGlzLl9yZW5kZXJCbGVuZGVkID0gdmFsdWU7XG5cdH1cblxuXG5cdHB1YmxpYyBnZXQgZGlzYWJsZUNvbG9yKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2Rpc2FibGVDb2xvcjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgZGlzYWJsZUNvbG9yKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHR0aGlzLl9kaXNhYmxlQ29sb3IgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCBudW1UcmlhbmdsZXMoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wTnVtVHJpYW5nbGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgcmVuZGVyYWJsZVNvcnRlcjpJRW50aXR5U29ydGVyO1xuXG5cblx0LyoqXG5cdCAqIEEgdmlld1BvcnQgcmVjdGFuZ2xlIGVxdWl2YWxlbnQgb2YgdGhlIFN0YWdlIHNpemUgYW5kIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCB2aWV3UG9ydCgpOlJlY3RhbmdsZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ZpZXdQb3J0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2Npc3NvciByZWN0YW5nbGUgZXF1aXZhbGVudCBvZiB0aGUgdmlldyBzaXplIGFuZCBwb3NpdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2Npc3NvclJlY3QoKTpSZWN0YW5nbGVcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wU2Npc3NvclJlY3Q7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgeCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsUG9zLng7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMueCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2dsb2JhbFBvcy54ID0gdGhpcy5fbG9jYWxQb3MueCA9IHZhbHVlO1xuXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCB5KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxQb3MueTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgeSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy55ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZ2xvYmFsUG9zLnkgPSB0aGlzLl9sb2NhbFBvcy55ID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHdpZHRoKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fd2lkdGg7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHdpZHRoKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl93aWR0aCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3dpZHRoID0gdmFsdWU7XG5cdFx0dGhpcy5fcFNjaXNzb3JSZWN0LndpZHRoID0gdmFsdWU7XG5cblx0XHRpZiAodGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIpXG5cdFx0XHR0aGlzLl9wUnR0QnVmZmVyTWFuYWdlci52aWV3V2lkdGggPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdFx0dGhpcy5fcERlcHRoVGV4dHVyZUludmFsaWQgPSB0cnVlO1xuXG5cdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgaGVpZ2h0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xuXHR9XG5cblx0cHVibGljIHNldCBoZWlnaHQodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2hlaWdodCA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuXHRcdHRoaXMuX3BTY2lzc29yUmVjdC5oZWlnaHQgPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9wUnR0QnVmZmVyTWFuYWdlcilcblx0XHRcdHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyLnZpZXdIZWlnaHQgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdFx0dGhpcy5fcERlcHRoVGV4dHVyZUludmFsaWQgPSB0cnVlO1xuXG5cdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBSZW5kZXJlckJhc2Ugb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IocmVuZGVyZXJQb29sQ2xhc3M6SVJlbmRlcmVyUG9vbENsYXNzID0gbnVsbCwgc3RhZ2U6U3RhZ2UgPSBudWxsKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3BSZW5kZXJlclBvb2xDbGFzcyA9IHJlbmRlcmVyUG9vbENsYXNzO1xuXG5cdFx0dGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSA9IChldmVudDpTdGFnZUV2ZW50KSA9PiB0aGlzLm9uVmlld3BvcnRVcGRhdGVkKGV2ZW50KVxuXHRcdHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlID0gKGV2ZW50OkV2ZW50KSA9PiB0aGlzLm9uQ29udGV4dFVwZGF0ZShldmVudCk7XG5cblx0XHQvL2RlZmF1bHQgc29ydGluZyBhbGdvcml0aG1cblx0XHR0aGlzLnJlbmRlcmFibGVTb3J0ZXIgPSBuZXcgUmVuZGVyYWJsZU1lcmdlU29ydCgpO1xuXG5cdFx0dGhpcy5fcmVuZGVyZXJQb29sID0gKHJlbmRlcmVyUG9vbENsYXNzKT8gbmV3IHRoaXMuX3BSZW5kZXJlclBvb2xDbGFzcyh0aGlzKSA6IG5ldyBSZW5kZXJlclBvb2xCYXNlKHRoaXMpO1xuXG5cdFx0dGhpcy5zdGFnZSA9IHN0YWdlIHx8IFN0YWdlTWFuYWdlci5nZXRJbnN0YW5jZSgpLmdldEZyZWVTdGFnZSgpO1xuXHR9XG5cblx0cHVibGljIGFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBwYXNzOlJlbmRlclBhc3NCYXNlLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0Ly9jbGVhciB1bnVzZWQgdmVydGV4IHN0cmVhbXNcblx0XHRmb3IgKHZhciBpID0gcGFzcy5zaGFkZXIubnVtVXNlZFN0cmVhbXM7IGkgPCB0aGlzLl9udW1Vc2VkU3RyZWFtczsgaSsrKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoaSwgbnVsbCk7XG5cblx0XHQvL2NsZWFyIHVudXNlZCB0ZXh0dXJlIHN0cmVhbXNcblx0XHRmb3IgKHZhciBpID0gcGFzcy5zaGFkZXIubnVtVXNlZFRleHR1cmVzOyBpIDwgdGhpcy5fbnVtVXNlZFRleHR1cmVzOyBpKyspXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRUZXh0dXJlQXQoaSwgbnVsbCk7XG5cblx0XHQvL2NoZWNrIHByb2dyYW0gZGF0YSBpcyB1cGxvYWRlZFxuXHRcdHZhciBwcm9ncmFtRGF0YTpQcm9ncmFtRGF0YSA9IHBhc3Muc2hhZGVyLnByb2dyYW1EYXRhO1xuXG5cdFx0aWYgKCFwcm9ncmFtRGF0YS5wcm9ncmFtKSB7XG5cdFx0XHRwcm9ncmFtRGF0YS5wcm9ncmFtID0gdGhpcy5fcENvbnRleHQuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdFx0dmFyIHZlcnRleEJ5dGVDb2RlOkJ5dGVBcnJheSA9IChuZXcgQUdBTE1pbmlBc3NlbWJsZXIoKS5hc3NlbWJsZShcInBhcnQgdmVydGV4IDFcXG5cIiArIHByb2dyYW1EYXRhLnZlcnRleFN0cmluZyArIFwiZW5kcGFydFwiKSlbJ3ZlcnRleCddLmRhdGE7XG5cdFx0XHR2YXIgZnJhZ21lbnRCeXRlQ29kZTpCeXRlQXJyYXkgPSAobmV3IEFHQUxNaW5pQXNzZW1ibGVyKCkuYXNzZW1ibGUoXCJwYXJ0IGZyYWdtZW50IDFcXG5cIiArIHByb2dyYW1EYXRhLmZyYWdtZW50U3RyaW5nICsgXCJlbmRwYXJ0XCIpKVsnZnJhZ21lbnQnXS5kYXRhO1xuXHRcdFx0cHJvZ3JhbURhdGEucHJvZ3JhbS51cGxvYWQodmVydGV4Qnl0ZUNvZGUsIGZyYWdtZW50Qnl0ZUNvZGUpO1xuXHRcdH1cblxuXHRcdC8vc2V0IHByb2dyYW0gZGF0YVxuXHRcdHRoaXMuX3BDb250ZXh0LnNldFByb2dyYW0ocHJvZ3JhbURhdGEucHJvZ3JhbSk7XG5cblx0XHQvL2FjdGl2YXRlIHNoYWRlciBvYmplY3QgdGhyb3VnaCByZW5kZXJhYmxlXG5cdFx0cmVuZGVyYWJsZS5faUFjdGl2YXRlKHBhc3MsIGNhbWVyYSk7XG5cdH1cblxuXHRwdWJsaWMgZGVhY3RpdmF0ZVBhc3MocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgcGFzczpSZW5kZXJQYXNzQmFzZSlcblx0e1xuXHRcdC8vZGVhY3RpdmF0ZSBzaGFkZXIgb2JqZWN0XG5cdFx0cmVuZGVyYWJsZS5faURlYWN0aXZhdGUocGFzcyk7XG5cblx0XHR0aGlzLl9udW1Vc2VkU3RyZWFtcyA9IHBhc3Muc2hhZGVyLm51bVVzZWRTdHJlYW1zO1xuXHRcdHRoaXMuX251bVVzZWRUZXh0dXJlcyA9IHBhc3Muc2hhZGVyLm51bVVzZWRUZXh0dXJlcztcblx0fVxuXG5cdHB1YmxpYyBfaUNyZWF0ZUVudGl0eUNvbGxlY3RvcigpOkNvbGxlY3RvckJhc2Vcblx0e1xuXHRcdHJldHVybiBuZXcgRW50aXR5Q29sbGVjdG9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyByZWQgY29tcG9uZW50LCB1c2VkIHdoZW4gY2xlYXJpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IF9pQmFja2dyb3VuZFIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kUjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kUih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZFIgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9iYWNrZ3JvdW5kUiA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmFja2dyb3VuZCBjb2xvcidzIGdyZWVuIGNvbXBvbmVudCwgdXNlZCB3aGVuIGNsZWFyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRHKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEc7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZEcodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRHID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZEcgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyBibHVlIGNvbXBvbmVudCwgdXNlZCB3aGVuIGNsZWFyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRCKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZEIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRCID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZEIgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNvbnRleHQoKTpJQ29udGV4dEdMXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcENvbnRleHQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIFN0YWdlIHRoYXQgd2lsbCBwcm92aWRlIHRoZSBDb250ZXh0R0wgdXNlZCBmb3IgcmVuZGVyaW5nLlxuXHQgKi9cblx0cHVibGljIGdldCBzdGFnZSgpOlN0YWdlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcFN0YWdlO1xuXHR9XG5cblx0cHVibGljIHNldCBzdGFnZSh2YWx1ZTpTdGFnZSlcblx0e1xuXHRcdGlmICh0aGlzLl9wU3RhZ2UgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLmlTZXRTdGFnZSh2YWx1ZSk7XG5cdH1cblxuXHRwdWJsaWMgaVNldFN0YWdlKHZhbHVlOlN0YWdlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BTdGFnZSlcblx0XHRcdHRoaXMuZGlzcG9zZSgpO1xuXG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9wU3RhZ2UgPSB2YWx1ZTtcblxuXHRcdFx0dGhpcy5fcmVuZGVyZXJQb29sLnN0YWdlID0gdGhpcy5fcFN0YWdlO1xuXG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX1JFQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5WSUVXUE9SVF9VUERBVEVELCB0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlKTtcblxuXHRcdFx0Lypcblx0XHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxuXHRcdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5zdGFnZSA9IHZhbHVlO1xuXHRcdFx0ICovXG5cdFx0XHRpZiAodGhpcy5fcFN0YWdlLmNvbnRleHQpXG5cdFx0XHRcdHRoaXMuX3BDb250ZXh0ID0gPElDb250ZXh0R0w+IHRoaXMuX3BTdGFnZS5jb250ZXh0O1xuXHRcdH1cblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmVycyBjb250cm9sIG9mIENvbnRleHRHTCBjbGVhcigpIGFuZCBwcmVzZW50KCkgY2FsbHMgdG8gU3RhZ2UsIGVuYWJsaW5nIG11bHRpcGxlIFN0YWdlIGZyYW1ld29ya3Ncblx0ICogdG8gc2hhcmUgdGhlIHNhbWUgQ29udGV4dEdMIG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2hhcmVDb250ZXh0KCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NoYXJlQ29udGV4dDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2hhcmVDb250ZXh0KHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fc2hhcmVDb250ZXh0ID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc3Bvc2VzIHRoZSByZXNvdXJjZXMgdXNlZCBieSB0aGUgUmVuZGVyZXJCYXNlLlxuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0dGhpcy5fcmVuZGVyZXJQb29sLmRpc3Bvc2UoKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuQ09OVEVYVF9DUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX1JFQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuVklFV1BPUlRfVVBEQVRFRCwgdGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSk7XG5cblx0XHR0aGlzLl9wU3RhZ2UgPSBudWxsO1xuXHRcdHRoaXMuX3BDb250ZXh0ID0gbnVsbDtcblx0XHQvKlxuXHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKSB7XG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5kaXNwb3NlKCk7XG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciA9IG51bGw7XG5cdFx0IH1cblx0XHQgKi9cblx0fVxuXG5cdHB1YmxpYyByZW5kZXIoZW50aXR5Q29sbGVjdG9yOkNvbGxlY3RvckJhc2UpXG5cdHtcblx0XHR0aGlzLl92aWV3cG9ydERpcnR5ID0gZmFsc2U7XG5cdFx0dGhpcy5fc2Npc3NvckRpcnR5ID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeSB0byB0aGUgYmFjayBidWZmZXIgb3IgdGV4dHVyZS5cblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbiB0YXJnZXQgdGV4dHVyZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBzdXJmYWNlU2VsZWN0b3IgVGhlIGluZGV4IG9mIGEgQ3ViZVRleHR1cmUncyBmYWNlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIGFkZGl0aW9uYWxDbGVhck1hc2sgQWRkaXRpb25hbCBjbGVhciBtYXNrIGluZm9ybWF0aW9uLCBpbiBjYXNlIGV4dHJhIGNsZWFyIGNoYW5uZWxzIGFyZSB0byBiZSBvbWl0dGVkLlxuXHQgKi9cblx0cHVibGljIF9pUmVuZGVyKGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlLCB0YXJnZXQ6VGV4dHVyZVByb3h5QmFzZSA9IG51bGwsIHNjaXNzb3JSZWN0OlJlY3RhbmdsZSA9IG51bGwsIHN1cmZhY2VTZWxlY3RvcjpudW1iZXIgPSAwKVxuXHR7XG5cdFx0Ly9UT0RPIHJlZmFjdG9yIHNldFRhcmdldCBzbyB0aGF0IHJlbmRlcnRleHR1cmVzIGFyZSBjcmVhdGVkIGJlZm9yZSB0aGlzIGNoZWNrXG5cdFx0aWYgKCF0aGlzLl9wU3RhZ2UgfHwgIXRoaXMuX3BDb250ZXh0KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4LmNvcHlGcm9tKGVudGl0eUNvbGxlY3Rvci5jYW1lcmEudmlld1Byb2plY3Rpb24pO1xuXHRcdHRoaXMuX3BSdHRWaWV3UHJvamVjdGlvbk1hdHJpeC5hcHBlbmRTY2FsZSh0aGlzLnRleHR1cmVSYXRpb1gsIHRoaXMudGV4dHVyZVJhdGlvWSwgMSk7XG5cblx0XHR0aGlzLnBFeGVjdXRlUmVuZGVyKGVudGl0eUNvbGxlY3RvciwgdGFyZ2V0LCBzY2lzc29yUmVjdCwgc3VyZmFjZVNlbGVjdG9yKTtcblxuXHRcdC8vIGdlbmVyYXRlIG1pcCBtYXBzIG9uIHRhcmdldCAoaWYgdGFyZ2V0IGV4aXN0cykgLy9UT0RPXG5cdFx0Ly9pZiAodGFyZ2V0KVxuXHRcdC8vXHQoPFRleHR1cmU+dGFyZ2V0KS5nZW5lcmF0ZU1pcG1hcHMoKTtcblxuXHRcdC8vIGNsZWFyIGJ1ZmZlcnNcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCA4OyArK2kpIHtcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VGV4dHVyZUF0KGksIG51bGwpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfaVJlbmRlckNhc2NhZGVzKGVudGl0eUNvbGxlY3RvcjpTaGFkb3dDYXN0ZXJDb2xsZWN0b3IsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlLCBudW1DYXNjYWRlczpudW1iZXIsIHNjaXNzb3JSZWN0czpBcnJheTxSZWN0YW5nbGU+LCBjYW1lcmFzOkFycmF5PENhbWVyYT4pXG5cdHtcblx0XHR0aGlzLnBDb2xsZWN0UmVuZGVyYWJsZXMoZW50aXR5Q29sbGVjdG9yKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zZXRSZW5kZXJUYXJnZXQodGFyZ2V0LCB0cnVlLCAwKTtcblx0XHR0aGlzLl9wQ29udGV4dC5jbGVhcigxLCAxLCAxLCAxLCAxLCAwKTtcblxuXHRcdHRoaXMuX3BDb250ZXh0LnNldEJsZW5kRmFjdG9ycyhDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkUsIENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk8pO1xuXHRcdHRoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTKTtcblxuXHRcdHZhciBoZWFkOlJlbmRlcmFibGVCYXNlID0gdGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkO1xuXG5cdFx0dmFyIGZpcnN0OmJvb2xlYW4gPSB0cnVlO1xuXG5cdFx0Ly9UT0RPIGNhc2NhZGVzIG11c3QgaGF2ZSBzZXBhcmF0ZSBjb2xsZWN0b3JzLCByYXRoZXIgdGhhbiBzZXBhcmF0ZSBkcmF3IGNvbW1hbmRzXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSBudW1DYXNjYWRlcyAtIDE7IGkgPj0gMDsgLS1pKSB7XG5cdFx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBzY2lzc29yUmVjdHNbaV07XG5cdFx0XHQvL3RoaXMuZHJhd0Nhc2NhZGVSZW5kZXJhYmxlcyhoZWFkLCBjYW1lcmFzW2ldLCBmaXJzdD8gbnVsbCA6IGNhbWVyYXNbaV0uZnJ1c3R1bVBsYW5lcyk7XG5cdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vbGluZSByZXF1aXJlZCBmb3IgY29ycmVjdCByZW5kZXJpbmcgd2hlbiB1c2luZyBhd2F5M2Qgd2l0aCBzdGFybGluZy4gRE8gTk9UIFJFTU9WRSBVTkxFU1MgU1RBUkxJTkcgSU5URUdSQVRJT04gSVMgUkVURVNURUQhXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgcENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3I6Q29sbGVjdG9yQmFzZSlcblx0e1xuXHRcdC8vcmVzZXQgaGVhZCB2YWx1ZXNcblx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gbnVsbDtcblx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSBudWxsO1xuXHRcdHRoaXMuX3BOdW1UcmlhbmdsZXMgPSAwO1xuXG5cdFx0Ly9ncmFiIGVudGl0eSBoZWFkXG5cdFx0dmFyIGl0ZW06RW50aXR5TGlzdEl0ZW0gPSBlbnRpdHlDb2xsZWN0b3IuZW50aXR5SGVhZDtcblxuXHRcdC8vc2V0IHRlbXAgdmFsdWVzIGZvciBlbnRyeSBwb2ludCBhbmQgY2FtZXJhIGZvcndhcmQgdmVjdG9yXG5cdFx0dGhpcy5fcENhbWVyYSA9IGVudGl0eUNvbGxlY3Rvci5jYW1lcmE7XG5cdFx0dGhpcy5faUVudHJ5UG9pbnQgPSB0aGlzLl9wQ2FtZXJhLnNjZW5lUG9zaXRpb247XG5cdFx0dGhpcy5fcENhbWVyYUZvcndhcmQgPSB0aGlzLl9wQ2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkVmVjdG9yO1xuXG5cdFx0Ly9pdGVyYXRlIHRocm91Z2ggYWxsIGVudGl0aWVzXG5cdFx0d2hpbGUgKGl0ZW0pIHtcblx0XHRcdGl0ZW0uZW50aXR5Ll9pQ29sbGVjdFJlbmRlcmFibGVzKHRoaXMuX3JlbmRlcmVyUG9vbCk7XG5cdFx0XHRpdGVtID0gaXRlbS5uZXh0O1xuXHRcdH1cblxuXHRcdC8vc29ydCB0aGUgcmVzdWx0aW5nIHJlbmRlcmFibGVzXG5cdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gPFJlbmRlcmFibGVCYXNlPiB0aGlzLnJlbmRlcmFibGVTb3J0ZXIuc29ydE9wYXF1ZVJlbmRlcmFibGVzKHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCk7XG5cdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IDxSZW5kZXJhYmxlQmFzZT4gdGhpcy5yZW5kZXJhYmxlU29ydGVyLnNvcnRCbGVuZGVkUmVuZGVyYWJsZXModGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeSB0byB0aGUgYmFjayBidWZmZXIgb3IgdGV4dHVyZS4gT25seSBleGVjdXRlZCBpZiBldmVyeXRoaW5nIGlzIHNldCB1cC5cblx0ICpcblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbiB0YXJnZXQgdGV4dHVyZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBzdXJmYWNlU2VsZWN0b3IgVGhlIGluZGV4IG9mIGEgQ3ViZVRleHR1cmUncyBmYWNlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIGFkZGl0aW9uYWxDbGVhck1hc2sgQWRkaXRpb25hbCBjbGVhciBtYXNrIGluZm9ybWF0aW9uLCBpbiBjYXNlIGV4dHJhIGNsZWFyIGNoYW5uZWxzIGFyZSB0byBiZSBvbWl0dGVkLlxuXHQgKi9cblx0cHVibGljIHBFeGVjdXRlUmVuZGVyKGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlLCB0YXJnZXQ6VGV4dHVyZVByb3h5QmFzZSA9IG51bGwsIHNjaXNzb3JSZWN0OlJlY3RhbmdsZSA9IG51bGwsIHN1cmZhY2VTZWxlY3RvcjpudW1iZXIgPSAwKVxuXHR7XG5cdFx0dGhpcy5fcFN0YWdlLnNldFJlbmRlclRhcmdldCh0YXJnZXQsIHRydWUsIHN1cmZhY2VTZWxlY3Rvcik7XG5cblx0XHRpZiAoKHRhcmdldCB8fCAhdGhpcy5fc2hhcmVDb250ZXh0KSAmJiAhdGhpcy5fZGVwdGhQcmVwYXNzKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuY2xlYXIodGhpcy5fYmFja2dyb3VuZFIsIHRoaXMuX2JhY2tncm91bmRHLCB0aGlzLl9iYWNrZ3JvdW5kQiwgdGhpcy5fYmFja2dyb3VuZEFscGhhLCAxLCAwKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IHNjaXNzb3JSZWN0O1xuXG5cdFx0Lypcblx0XHQgaWYgKF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcilcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLnJlbmRlcigpO1xuXHRcdCAqL1xuXHRcdHRoaXMucENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0QmxlbmRGYWN0b3JzKENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORSwgQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTyk7XG5cblx0XHR0aGlzLnBEcmF3KGVudGl0eUNvbGxlY3Rvcik7XG5cblx0XHQvL2xpbmUgcmVxdWlyZWQgZm9yIGNvcnJlY3QgcmVuZGVyaW5nIHdoZW4gdXNpbmcgYXdheTNkIHdpdGggc3RhcmxpbmcuIERPIE5PVCBSRU1PVkUgVU5MRVNTIFNUQVJMSU5HIElOVEVHUkFUSU9OIElTIFJFVEVTVEVEIVxuXHRcdC8vdGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTsgLy9vb3BzaWVcblxuXHRcdGlmICghdGhpcy5fc2hhcmVDb250ZXh0KSB7XG5cdFx0XHRpZiAodGhpcy5fc25hcHNob3RSZXF1aXJlZCAmJiB0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEpIHtcblx0XHRcdFx0dGhpcy5fcENvbnRleHQuZHJhd1RvQml0bWFwRGF0YSh0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEpO1xuXHRcdFx0XHR0aGlzLl9zbmFwc2hvdFJlcXVpcmVkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fcFN0YWdlLnNjaXNzb3JSZWN0ID0gbnVsbDtcblx0fVxuXG5cdC8qXG5cdCAqIFdpbGwgZHJhdyB0aGUgcmVuZGVyZXIncyBvdXRwdXQgb24gbmV4dCByZW5kZXIgdG8gdGhlIHByb3ZpZGVkIGJpdG1hcCBkYXRhLlxuXHQgKiAqL1xuXHRwdWJsaWMgcXVldWVTbmFwc2hvdChibWQ6Qml0bWFwRGF0YSlcblx0e1xuXHRcdHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgPSB0cnVlO1xuXHRcdHRoaXMuX3NuYXBzaG90Qml0bWFwRGF0YSA9IGJtZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQZXJmb3JtcyB0aGUgYWN0dWFsIGRyYXdpbmcgb2YgZ2VvbWV0cnkgdG8gdGhlIHRhcmdldC5cblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKi9cblx0cHVibGljIHBEcmF3KGVudGl0eUNvbGxlY3RvcjpDb2xsZWN0b3JCYXNlKVxuXHR7XG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KHRydWUsIENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUwpO1xuXG5cdFx0aWYgKHRoaXMuX2Rpc2FibGVDb2xvcilcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldENvbG9yTWFzayhmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG5cblx0XHR0aGlzLmRyYXdSZW5kZXJhYmxlcyh0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQsIGVudGl0eUNvbGxlY3Rvcik7XG5cblx0XHRpZiAodGhpcy5fcmVuZGVyQmxlbmRlZClcblx0XHRcdHRoaXMuZHJhd1JlbmRlcmFibGVzKHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQsIGVudGl0eUNvbGxlY3Rvcik7XG5cblx0XHRpZiAodGhpcy5fZGlzYWJsZUNvbG9yKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0Q29sb3JNYXNrKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xuXHR9XG5cblx0Ly9wcml2YXRlIGRyYXdDYXNjYWRlUmVuZGVyYWJsZXMocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgY2FtZXJhOkNhbWVyYSwgY3VsbFBsYW5lczpBcnJheTxQbGFuZTNEPilcblx0Ly97XG5cdC8vXHR2YXIgcmVuZGVyYWJsZTI6UmVuZGVyYWJsZUJhc2U7XG5cdC8vXHR2YXIgcmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2U7XG5cdC8vXHR2YXIgcGFzczpSZW5kZXJQYXNzQmFzZTtcblx0Ly9cblx0Ly9cdHdoaWxlIChyZW5kZXJhYmxlKSB7XG5cdC8vXHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTtcblx0Ly9cdFx0cmVuZGVyT2JqZWN0ID0gcmVuZGVyYWJsZS5yZW5kZXJPYmplY3Q7XG5cdC8vXHRcdHBhc3MgPSByZW5kZXJPYmplY3QucGFzc2VzWzBdIC8vYXNzdW1pbmcgb25seSBvbmUgcGFzcyBwZXIgbWF0ZXJpYWxcblx0Ly9cblx0Ly9cdFx0dGhpcy5hY3RpdmF0ZVBhc3MocmVuZGVyYWJsZSwgcGFzcywgY2FtZXJhKTtcblx0Ly9cblx0Ly9cdFx0ZG8ge1xuXHQvL1x0XHRcdC8vIGlmIGNvbXBsZXRlbHkgaW4gZnJvbnQsIGl0IHdpbGwgZmFsbCBpbiBhIGRpZmZlcmVudCBjYXNjYWRlXG5cdC8vXHRcdFx0Ly8gZG8gbm90IHVzZSBuZWFyIGFuZCBmYXIgcGxhbmVzXG5cdC8vXHRcdFx0aWYgKCFjdWxsUGxhbmVzIHx8IHJlbmRlcmFibGUyLnNvdXJjZUVudGl0eS53b3JsZEJvdW5kcy5pc0luRnJ1c3R1bShjdWxsUGxhbmVzLCA0KSkge1xuXHQvL1x0XHRcdFx0cmVuZGVyYWJsZTIuX2lSZW5kZXIocGFzcywgY2FtZXJhLCB0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXgpO1xuXHQvL1x0XHRcdH0gZWxzZSB7XG5cdC8vXHRcdFx0XHRyZW5kZXJhYmxlMi5jYXNjYWRlZCA9IHRydWU7XG5cdC8vXHRcdFx0fVxuXHQvL1xuXHQvL1x0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTIubmV4dDtcblx0Ly9cblx0Ly9cdFx0fSB3aGlsZSAocmVuZGVyYWJsZTIgJiYgcmVuZGVyYWJsZTIucmVuZGVyT2JqZWN0ID09IHJlbmRlck9iamVjdCAmJiAhcmVuZGVyYWJsZTIuY2FzY2FkZWQpO1xuXHQvL1xuXHQvL1x0XHR0aGlzLmRlYWN0aXZhdGVQYXNzKHJlbmRlcmFibGUsIHBhc3MpO1xuXHQvL1xuXHQvL1x0XHRyZW5kZXJhYmxlID0gcmVuZGVyYWJsZTI7XG5cdC8vXHR9XG5cdC8vfVxuXG5cdC8qKlxuXHQgKiBEcmF3IGEgbGlzdCBvZiByZW5kZXJhYmxlcy5cblx0ICpcblx0ICogQHBhcmFtIHJlbmRlcmFibGVzIFRoZSByZW5kZXJhYmxlcyB0byBkcmF3LlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3IgY29udGFpbmluZyBhbGwgcG90ZW50aWFsbHkgdmlzaWJsZSBpbmZvcm1hdGlvbi5cblx0ICovXG5cdHB1YmxpYyBkcmF3UmVuZGVyYWJsZXMocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgZW50aXR5Q29sbGVjdG9yOkNvbGxlY3RvckJhc2UpXG5cdHtcblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIGxlbjpudW1iZXI7XG5cdFx0dmFyIHJlbmRlcmFibGUyOlJlbmRlcmFibGVCYXNlO1xuXHRcdHZhciByZW5kZXJPYmplY3Q6UmVuZGVyT2JqZWN0QmFzZTtcblx0XHR2YXIgcGFzc2VzOkFycmF5PFJlbmRlclBhc3NCYXNlPjtcblx0XHR2YXIgcGFzczpSZW5kZXJQYXNzQmFzZTtcblx0XHR2YXIgY2FtZXJhOkNhbWVyYSA9IGVudGl0eUNvbGxlY3Rvci5jYW1lcmE7XG5cblxuXHRcdHdoaWxlIChyZW5kZXJhYmxlKSB7XG5cdFx0XHRyZW5kZXJPYmplY3QgPSByZW5kZXJhYmxlLnJlbmRlck9iamVjdDtcblx0XHRcdHBhc3NlcyA9IHJlbmRlck9iamVjdC5wYXNzZXM7XG5cblx0XHRcdC8vIG90aGVyd2lzZSB0aGlzIHdvdWxkIHJlc3VsdCBpbiBkZXB0aCByZW5kZXJlZCBhbnl3YXkgYmVjYXVzZSBmcmFnbWVudCBzaGFkZXIga2lsIGlzIGlnbm9yZWRcblx0XHRcdGlmICh0aGlzLl9kaXNhYmxlQ29sb3IgJiYgcmVuZGVyT2JqZWN0Ll9yZW5kZXJPYmplY3RPd25lci5hbHBoYVRocmVzaG9sZCAhPSAwKSB7XG5cdFx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTtcblx0XHRcdFx0Ly8gZmFzdCBmb3J3YXJkXG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGUyLm5leHQ7XG5cblx0XHRcdFx0fSB3aGlsZSAocmVuZGVyYWJsZTIgJiYgcmVuZGVyYWJsZTIucmVuZGVyT2JqZWN0ID09IHJlbmRlck9iamVjdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL2l0ZXJhdGUgdGhyb3VnaCBlYWNoIHNoYWRlciBvYmplY3Rcblx0XHRcdFx0bGVuID0gcGFzc2VzLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlO1xuXHRcdFx0XHRcdHBhc3MgPSBwYXNzZXNbaV07XG5cblx0XHRcdFx0XHR0aGlzLmFjdGl2YXRlUGFzcyhyZW5kZXJhYmxlLCBwYXNzLCBjYW1lcmEpO1xuXG5cdFx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdFx0cmVuZGVyYWJsZTIuX2lSZW5kZXIocGFzcywgY2FtZXJhLCB0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXgpO1xuXG5cdFx0XHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGUyLm5leHQ7XG5cblx0XHRcdFx0XHR9IHdoaWxlIChyZW5kZXJhYmxlMiAmJiByZW5kZXJhYmxlMi5yZW5kZXJPYmplY3QgPT0gcmVuZGVyT2JqZWN0KTtcblxuXHRcdFx0XHRcdHRoaXMuZGVhY3RpdmF0ZVBhc3MocmVuZGVyYWJsZSwgcGFzcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmVuZGVyYWJsZSA9IHJlbmRlcmFibGUyO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBBc3NpZ24gdGhlIGNvbnRleHQgb25jZSByZXRyaWV2ZWRcblx0ICovXG5cdHByaXZhdGUgb25Db250ZXh0VXBkYXRlKGV2ZW50OkV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fcENvbnRleHQgPSA8SUNvbnRleHRHTD4gdGhpcy5fcFN0YWdlLmNvbnRleHQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IF9pQmFja2dyb3VuZEFscGhhKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEFscGhhO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRBbHBoYSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZEFscGhhID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZEFscGhhID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0Lypcblx0IHB1YmxpYyBnZXQgaUJhY2tncm91bmQoKTpUZXh0dXJlMkRCYXNlXG5cdCB7XG5cdCByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcblx0IH1cblx0ICovXG5cblx0Lypcblx0IHB1YmxpYyBzZXQgaUJhY2tncm91bmQodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0IHtcblx0IGlmICh0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciAmJiAhdmFsdWUpIHtcblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLmRpc3Bvc2UoKTtcblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyID0gbnVsbDtcblx0IH1cblxuXHQgaWYgKCF0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciAmJiB2YWx1ZSlcblx0IHtcblxuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgPSBuZXcgQmFja2dyb3VuZEltYWdlUmVuZGVyZXIodGhpcy5fcFN0YWdlKTtcblxuXHQgfVxuXG5cblx0IHRoaXMuX2JhY2tncm91bmQgPSB2YWx1ZTtcblxuXHQgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIudGV4dHVyZSA9IHZhbHVlO1xuXHQgfVxuXHQgKi9cblx0Lypcblx0IHB1YmxpYyBnZXQgYmFja2dyb3VuZEltYWdlUmVuZGVyZXIoKTpCYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlclxuXHQge1xuXHQgcmV0dXJuIF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcjtcblx0IH1cblx0ICovXG5cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgbm90aWZ5U2Npc3NvclVwZGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fc2Npc3NvckRpcnR5KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fc2Npc3NvckRpcnR5ID0gdHJ1ZTtcblxuXHRcdGlmICghdGhpcy5fc2Npc3NvclVwZGF0ZWQpXG5cdFx0XHR0aGlzLl9zY2lzc29yVXBkYXRlZCA9IG5ldyBSZW5kZXJlckV2ZW50KFJlbmRlcmVyRXZlbnQuU0NJU1NPUl9VUERBVEVEKTtcblxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9zY2lzc29yVXBkYXRlZCk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBub3RpZnlWaWV3cG9ydFVwZGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fdmlld3BvcnREaXJ0eSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3ZpZXdwb3J0RGlydHkgPSB0cnVlO1xuXG5cdFx0aWYgKCF0aGlzLl92aWV3UG9ydFVwZGF0ZWQpXG5cdFx0XHR0aGlzLl92aWV3UG9ydFVwZGF0ZWQgPSBuZXcgUmVuZGVyZXJFdmVudChSZW5kZXJlckV2ZW50LlZJRVdQT1JUX1VQREFURUQpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3ZpZXdQb3J0VXBkYXRlZCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBvblZpZXdwb3J0VXBkYXRlZChldmVudDpTdGFnZUV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fdmlld1BvcnQgPSB0aGlzLl9wU3RhZ2Uudmlld1BvcnQ7XG5cdFx0Ly9UT0RPIHN0b3AgZmlyaW5nIHZpZXdwb3J0IHVwZGF0ZWQgZm9yIGV2ZXJ5IHN0YWdlZ2wgdmlld3BvcnQgY2hhbmdlXG5cblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0KSB7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IHRoaXMuX2dsb2JhbFBvcy54IC0gdGhpcy5fcFN0YWdlLng7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IHRoaXMuX2dsb2JhbFBvcy55IC0gdGhpcy5fcFN0YWdlLnk7XG5cdFx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0XHR9XG5cblx0XHR0aGlzLm5vdGlmeVZpZXdwb3J0VXBkYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxQb3MoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NoYXJlQ29udGV4dCkge1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnggPSB0aGlzLl9nbG9iYWxQb3MueCAtIHRoaXMuX3ZpZXdQb3J0Lng7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IHRoaXMuX2dsb2JhbFBvcy55IC0gdGhpcy5fdmlld1BvcnQueTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnggPSAwO1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnkgPSAwO1xuXHRcdFx0dGhpcy5fdmlld1BvcnQueCA9IHRoaXMuX2dsb2JhbFBvcy54O1xuXHRcdFx0dGhpcy5fdmlld1BvcnQueSA9IHRoaXMuX2dsb2JhbFBvcy55O1xuXHRcdH1cblxuXHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHB1YmxpYyBhcHBseVJlbmRlcmFibGUocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSlcblx0e1xuXHRcdC8vc2V0IGxvY2FsIHZhcnMgZm9yIGZhc3RlciByZWZlcmVuY2luZ1xuXHRcdHZhciByZW5kZXJPYmplY3Q6UmVuZGVyT2JqZWN0QmFzZSA9IHRoaXMuX3BHZXRSZW5kZXJPYmplY3QocmVuZGVyYWJsZSwgcmVuZGVyYWJsZS5yZW5kZXJPYmplY3RPd25lciB8fCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmdldERlZmF1bHRNYXRlcmlhbChyZW5kZXJhYmxlLnJlbmRlcmFibGVPd25lcikpO1xuXG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJPYmplY3QgPSByZW5kZXJPYmplY3Q7XG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJPYmplY3RJZCA9IHJlbmRlck9iamVjdC5yZW5kZXJPYmplY3RJZDtcblx0XHRyZW5kZXJhYmxlLnJlbmRlck9yZGVySWQgPSByZW5kZXJPYmplY3QucmVuZGVyT3JkZXJJZDtcblxuXHRcdHJlbmRlcmFibGUuY2FzY2FkZWQgPSBmYWxzZTtcblxuXHRcdHZhciBlbnRpdHk6SUVudGl0eSA9IHJlbmRlcmFibGUuc291cmNlRW50aXR5O1xuXHRcdHZhciBwb3NpdGlvbjpWZWN0b3IzRCA9IGVudGl0eS5zY2VuZVBvc2l0aW9uO1xuXG5cdFx0Ly8gcHJvamVjdCBvbnRvIGNhbWVyYSdzIHotYXhpc1xuXHRcdHBvc2l0aW9uID0gdGhpcy5faUVudHJ5UG9pbnQuc3VidHJhY3QocG9zaXRpb24pO1xuXHRcdHJlbmRlcmFibGUuekluZGV4ID0gZW50aXR5LnpPZmZzZXQgKyBwb3NpdGlvbi5kb3RQcm9kdWN0KHRoaXMuX3BDYW1lcmFGb3J3YXJkKTtcblxuXHRcdC8vc3RvcmUgcmVmZXJlbmNlIHRvIHNjZW5lIHRyYW5zZm9ybVxuXHRcdHJlbmRlcmFibGUucmVuZGVyU2NlbmVUcmFuc2Zvcm0gPSByZW5kZXJhYmxlLnNvdXJjZUVudGl0eS5nZXRSZW5kZXJTY2VuZVRyYW5zZm9ybSh0aGlzLl9wQ2FtZXJhKTtcblxuXHRcdGlmIChyZW5kZXJPYmplY3QucmVxdWlyZXNCbGVuZGluZykge1xuXHRcdFx0cmVuZGVyYWJsZS5uZXh0ID0gdGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZDtcblx0XHRcdHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQgPSByZW5kZXJhYmxlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW5kZXJhYmxlLm5leHQgPSB0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ7XG5cdFx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSByZW5kZXJhYmxlO1xuXHRcdH1cblxuXHRcdHRoaXMuX3BOdW1UcmlhbmdsZXMgKz0gcmVuZGVyYWJsZS5udW1UcmlhbmdsZXM7XG5cblx0XHQvL2hhbmRsZSBhbnkgb3ZlcmZsb3cgZm9yIHJlbmRlcmFibGVzIHdpdGggZGF0YSB0aGF0IGV4Y2VlZHMgR1BVIGxpbWl0YXRpb25zXG5cdFx0aWYgKHJlbmRlcmFibGUub3ZlcmZsb3cpXG5cdFx0XHR0aGlzLmFwcGx5UmVuZGVyYWJsZShyZW5kZXJhYmxlLm92ZXJmbG93KTtcblx0fVxuXG5cdHB1YmxpYyBfcEdldFJlbmRlck9iamVjdChyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCByZW5kZXJPYmplY3RPd25lcjpJUmVuZGVyT2JqZWN0T3duZXIpOlJlbmRlck9iamVjdEJhc2Vcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cbn1cblxuZXhwb3J0ID0gUmVuZGVyZXJCYXNlOyJdfQ==