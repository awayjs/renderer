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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9iYXNlL3JlbmRlcmVyYmFzZS50cyJdLCJuYW1lcyI6WyJSZW5kZXJlckJhc2UiLCJSZW5kZXJlckJhc2UuY29uc3RydWN0b3IiLCJSZW5kZXJlckJhc2UucmVuZGVyQmxlbmRlZCIsIlJlbmRlcmVyQmFzZS5kaXNhYmxlQ29sb3IiLCJSZW5kZXJlckJhc2UubnVtVHJpYW5nbGVzIiwiUmVuZGVyZXJCYXNlLnZpZXdQb3J0IiwiUmVuZGVyZXJCYXNlLnNjaXNzb3JSZWN0IiwiUmVuZGVyZXJCYXNlLngiLCJSZW5kZXJlckJhc2UueSIsIlJlbmRlcmVyQmFzZS53aWR0aCIsIlJlbmRlcmVyQmFzZS5oZWlnaHQiLCJSZW5kZXJlckJhc2UuYWN0aXZhdGVQcm9ncmFtIiwiUmVuZGVyZXJCYXNlLmRlYWN0aXZhdGVQcm9ncmFtIiwiUmVuZGVyZXJCYXNlLl9pQ3JlYXRlRW50aXR5Q29sbGVjdG9yIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZFIiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kRyIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRCIiwiUmVuZGVyZXJCYXNlLmNvbnRleHQiLCJSZW5kZXJlckJhc2Uuc3RhZ2UiLCJSZW5kZXJlckJhc2UuaVNldFN0YWdlIiwiUmVuZGVyZXJCYXNlLnNoYXJlQ29udGV4dCIsIlJlbmRlcmVyQmFzZS5kaXNwb3NlIiwiUmVuZGVyZXJCYXNlLnJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlciIsIlJlbmRlcmVyQmFzZS5faVJlbmRlckNhc2NhZGVzIiwiUmVuZGVyZXJCYXNlLnBDb2xsZWN0UmVuZGVyYWJsZXMiLCJSZW5kZXJlckJhc2UucEV4ZWN1dGVSZW5kZXIiLCJSZW5kZXJlckJhc2UucXVldWVTbmFwc2hvdCIsIlJlbmRlcmVyQmFzZS5wRHJhdyIsIlJlbmRlcmVyQmFzZS5kcmF3Q2FzY2FkZVJlbmRlcmFibGVzIiwiUmVuZGVyZXJCYXNlLmRyYXdSZW5kZXJhYmxlcyIsIlJlbmRlcmVyQmFzZS5vbkNvbnRleHRVcGRhdGUiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kQWxwaGEiLCJSZW5kZXJlckJhc2Uubm90aWZ5U2Npc3NvclVwZGF0ZSIsIlJlbmRlcmVyQmFzZS5ub3RpZnlWaWV3cG9ydFVwZGF0ZSIsIlJlbmRlcmVyQmFzZS5vblZpZXdwb3J0VXBkYXRlZCIsIlJlbmRlcmVyQmFzZS51cGRhdGVHbG9iYWxQb3MiLCJSZW5kZXJlckJhc2UuYXBwbHlCaWxsYm9hcmQiLCJSZW5kZXJlckJhc2UuYXBwbHlUcmlhbmdsZVN1Yk1lc2giLCJSZW5kZXJlckJhc2UuYXBwbHlMaW5lU3ViTWVzaCIsIlJlbmRlcmVyQmFzZS5fYXBwbHlSZW5kZXJhYmxlIiwiUmVuZGVyZXJCYXNlLl9wR2V0UmVuZGVyT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFPLFFBQVEsV0FBZ0IsK0JBQStCLENBQUMsQ0FBQztBQUVoRSxJQUFPLEtBQUssV0FBZ0IsNEJBQTRCLENBQUMsQ0FBQztBQUMxRCxJQUFPLFNBQVMsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRWpFLElBQU8sbUJBQW1CLFdBQWEsNENBQTRDLENBQUMsQ0FBQztBQUNyRixJQUFPLGVBQWUsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBUzlFLElBQU8sbUJBQW1CLFdBQWEsNkNBQTZDLENBQUMsQ0FBQztBQU10RixJQUFPLGFBQWEsV0FBYyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQzdFLElBQU8sVUFBVSxXQUFlLHNDQUFzQyxDQUFDLENBQUM7QUFFeEUsSUFBTyxlQUFlLFdBQWMsNkNBQTZDLENBQUMsQ0FBQztBQUduRixJQUFPLHNCQUFzQixXQUFZLG9EQUFvRCxDQUFDLENBQUM7QUFFL0YsSUFBTyxpQkFBaUIsV0FBYSxzREFBc0QsQ0FBQyxDQUFDO0FBQzdGLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENBQUMsQ0FBQztBQUN4RixJQUFPLG9CQUFvQixXQUFhLDhDQUE4QyxDQUFDLENBQUM7QUFHeEYs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ekMsbUJBQUNBO0FBQURBLENBbDFCQSxBQWsxQkNBLEVBbDFCMEIsZUFBZSxFQWsxQnpDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImJhc2UvUmVuZGVyZXJCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaXRtYXBEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9iYXNlL0JpdG1hcERhdGFcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBQbGFuZTNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUGxhbmUzRFwiKTtcbmltcG9ydCBQb2ludFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1BvaW50XCIpO1xuaW1wb3J0IFJlY3RhbmdsZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9SZWN0YW5nbGVcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudERpc3BhdGNoZXJcIik7XG5pbXBvcnQgVGV4dHVyZVByb3h5QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVQcm94eUJhc2VcIik7XG5pbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBMaW5lU3ViTWVzaFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaW5lU3ViTWVzaFwiKTtcbmltcG9ydCBJUmVuZGVyT2JqZWN0T3duZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JUmVuZGVyT2JqZWN0T3duZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Yk1lc2hcIik7XG5pbXBvcnQgRW50aXR5TGlzdEl0ZW1cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL0VudGl0eUxpc3RJdGVtXCIpO1xuaW1wb3J0IElFbnRpdHlTb3J0ZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L0lFbnRpdHlTb3J0ZXJcIik7XG5pbXBvcnQgUmVuZGVyYWJsZU1lcmdlU29ydFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L1JlbmRlcmFibGVNZXJnZVNvcnRcIik7XG5pbXBvcnQgSVJlbmRlcmVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9yZW5kZXIvSVJlbmRlcmVyXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQmlsbGJvYXJkXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgSUVudGl0eVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9JRW50aXR5XCIpO1xuaW1wb3J0IFNreWJveFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XG5pbXBvcnQgUmVuZGVyZXJFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9SZW5kZXJlckV2ZW50XCIpO1xuaW1wb3J0IFN0YWdlRXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9TdGFnZUV2ZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBFbnRpdHlDb2xsZWN0b3JcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9FbnRpdHlDb2xsZWN0b3JcIik7XG5pbXBvcnQgSUNvbGxlY3Rvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvdHJhdmVyc2UvSUNvbGxlY3RvclwiKTtcbmltcG9ydCBTaGFkb3dDYXN0ZXJDb2xsZWN0b3JcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3RyYXZlcnNlL1NoYWRvd0Nhc3RlckNvbGxlY3RvclwiKTtcbmltcG9ydCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYW5hZ2Vycy9EZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXCIpO1xuXG5pbXBvcnQgQUdBTE1pbmlBc3NlbWJsZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYWdsc2wvYXNzZW1ibGVyL0FHQUxNaW5pQXNzZW1ibGVyXCIpO1xuaW1wb3J0IENvbnRleHRHTEJsZW5kRmFjdG9yXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQmxlbmRGYWN0b3JcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcbmltcG9ydCBJQ29udGV4dEdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0R0xcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBTdGFnZU1hbmFnZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hbmFnZXJzL1N0YWdlTWFuYWdlclwiKTtcbmltcG9ydCBQcm9ncmFtRGF0YVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvcG9vbC9Qcm9ncmFtRGF0YVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZVwiKTtcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQmlsbGJvYXJkUmVuZGVyYWJsZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL0JpbGxib2FyZFJlbmRlcmFibGVcIik7XG5pbXBvcnQgTGluZVN1Yk1lc2hSZW5kZXJhYmxlXHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL0xpbmVTdWJNZXNoUmVuZGVyYWJsZVwiKTtcbmltcG9ydCBSZW5kZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vUmVuZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVwiKTtcbmltcG9ydCBSVFRCdWZmZXJNYW5hZ2VyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWFuYWdlcnMvUlRUQnVmZmVyTWFuYWdlclwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlUG9vbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZVBvb2xcIik7XG5cbi8qKlxuICogUmVuZGVyZXJCYXNlIGZvcm1zIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGNsYXNzZXMgdGhhdCBhcmUgdXNlZCBpbiB0aGUgcmVuZGVyaW5nIHBpcGVsaW5lIHRvIHJlbmRlciB0aGVcbiAqIGNvbnRlbnRzIG9mIGEgcGFydGl0aW9uXG4gKlxuICogQGNsYXNzIGF3YXkucmVuZGVyLlJlbmRlcmVyQmFzZVxuICovXG5jbGFzcyBSZW5kZXJlckJhc2UgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXJcbntcblx0cHJpdmF0ZSBfbnVtVXNlZFN0cmVhbXM6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbnVtVXNlZFRleHR1cmVzOm51bWJlciA9IDA7XG5cblx0cHJpdmF0ZSBfYmlsbGJvYXJkUmVuZGVyYWJsZVBvb2w6UmVuZGVyYWJsZVBvb2w7XG5cdHByaXZhdGUgX3RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVQb29sOlJlbmRlcmFibGVQb29sO1xuXHRwcml2YXRlIF9saW5lU3ViTWVzaFJlbmRlcmFibGVQb29sOlJlbmRlcmFibGVQb29sO1xuXG5cdHB1YmxpYyBfcENvbnRleHQ6SUNvbnRleHRHTDtcblx0cHVibGljIF9wU3RhZ2U6U3RhZ2U7XG5cblx0cHVibGljIF9wQ2FtZXJhOkNhbWVyYTtcblx0cHVibGljIF9pRW50cnlQb2ludDpWZWN0b3IzRDtcblx0cHVibGljIF9wQ2FtZXJhRm9yd2FyZDpWZWN0b3IzRDtcblxuXHRwdWJsaWMgX3BSdHRCdWZmZXJNYW5hZ2VyOlJUVEJ1ZmZlck1hbmFnZXI7XG5cdHByaXZhdGUgX3ZpZXdQb3J0OlJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoKTtcblx0cHJpdmF0ZSBfdmlld3BvcnREaXJ0eTpib29sZWFuO1xuXHRwcml2YXRlIF9zY2lzc29yRGlydHk6Ym9vbGVhbjtcblxuXHRwdWJsaWMgX3BCYWNrQnVmZmVySW52YWxpZDpib29sZWFuID0gdHJ1ZTtcblx0cHVibGljIF9wRGVwdGhUZXh0dXJlSW52YWxpZDpib29sZWFuID0gdHJ1ZTtcblx0cHVibGljIF9kZXB0aFByZXBhc3M6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kUjpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kRzpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kQjpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9iYWNrZ3JvdW5kQWxwaGE6bnVtYmVyID0gMTtcblx0cHVibGljIF9zaGFyZUNvbnRleHQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdC8vIG9ubHkgdXNlZCBieSByZW5kZXJlcnMgdGhhdCBuZWVkIHRvIHJlbmRlciBnZW9tZXRyeSB0byB0ZXh0dXJlc1xuXHRwdWJsaWMgX3dpZHRoOm51bWJlcjtcblx0cHVibGljIF9oZWlnaHQ6bnVtYmVyO1xuXG5cdHB1YmxpYyB0ZXh0dXJlUmF0aW9YOm51bWJlciA9IDE7XG5cdHB1YmxpYyB0ZXh0dXJlUmF0aW9ZOm51bWJlciA9IDE7XG5cblx0cHJpdmF0ZSBfc25hcHNob3RCaXRtYXBEYXRhOkJpdG1hcERhdGE7XG5cdHByaXZhdGUgX3NuYXBzaG90UmVxdWlyZWQ6Ym9vbGVhbjtcblxuXHRwdWJsaWMgX3BSdHRWaWV3UHJvamVjdGlvbk1hdHJpeDpNYXRyaXgzRCA9IG5ldyBNYXRyaXgzRCgpO1xuXG5cdHByaXZhdGUgX2xvY2FsUG9zOlBvaW50ID0gbmV3IFBvaW50KCk7XG5cdHByaXZhdGUgX2dsb2JhbFBvczpQb2ludCA9IG5ldyBQb2ludCgpO1xuXHRwdWJsaWMgX3BTY2lzc29yUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKCk7XG5cblx0cHJpdmF0ZSBfc2Npc3NvclVwZGF0ZWQ6UmVuZGVyZXJFdmVudDtcblx0cHJpdmF0ZSBfdmlld1BvcnRVcGRhdGVkOlJlbmRlcmVyRXZlbnQ7XG5cblx0cHJpdmF0ZSBfb25Db250ZXh0VXBkYXRlRGVsZWdhdGU6RnVuY3Rpb247XG5cdHByaXZhdGUgX29uVmlld3BvcnRVcGRhdGVkRGVsZWdhdGU7XG5cblx0cHVibGljIF9wTnVtVHJpYW5nbGVzOm51bWJlciA9IDA7XG5cblx0cHVibGljIF9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ6UmVuZGVyYWJsZUJhc2U7XG5cdHB1YmxpYyBfcEJsZW5kZWRSZW5kZXJhYmxlSGVhZDpSZW5kZXJhYmxlQmFzZTtcblx0cHVibGljIF9kaXNhYmxlQ29sb3I6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwdWJsaWMgX3JlbmRlckJsZW5kZWQ6Ym9vbGVhbiA9IHRydWU7XG5cblxuXHRwdWJsaWMgZ2V0IHJlbmRlckJsZW5kZWQoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcmVuZGVyQmxlbmRlZDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcmVuZGVyQmxlbmRlZCh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fcmVuZGVyQmxlbmRlZCA9IHZhbHVlO1xuXHR9XG5cblxuXHRwdWJsaWMgZ2V0IGRpc2FibGVDb2xvcigpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9kaXNhYmxlQ29sb3I7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGRpc2FibGVDb2xvcih2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fZGlzYWJsZUNvbG9yID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgbnVtVHJpYW5nbGVzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcE51bVRyaWFuZ2xlcztcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHJlbmRlcmFibGVTb3J0ZXI6SUVudGl0eVNvcnRlcjtcblxuXG5cdC8qKlxuXHQgKiBBIHZpZXdQb3J0IHJlY3RhbmdsZSBlcXVpdmFsZW50IG9mIHRoZSBTdGFnZSBzaXplIGFuZCBwb3NpdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXQgdmlld1BvcnQoKTpSZWN0YW5nbGVcblx0e1xuXHRcdHJldHVybiB0aGlzLl92aWV3UG9ydDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNjaXNzb3IgcmVjdGFuZ2xlIGVxdWl2YWxlbnQgb2YgdGhlIHZpZXcgc2l6ZSBhbmQgcG9zaXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNjaXNzb3JSZWN0KCk6UmVjdGFuZ2xlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcFNjaXNzb3JSZWN0O1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9sb2NhbFBvcy54O1xuXHR9XG5cblx0cHVibGljIHNldCB4KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLnggPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9nbG9iYWxQb3MueCA9IHRoaXMuX2xvY2FsUG9zLnggPSB2YWx1ZTtcblxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgeSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsUG9zLnk7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHkodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMueSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2dsb2JhbFBvcy55ID0gdGhpcy5fbG9jYWxQb3MueSA9IHZhbHVlO1xuXG5cdFx0dGhpcy51cGRhdGVHbG9iYWxQb3MoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCB3aWR0aCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xuXHR9XG5cblx0cHVibGljIHNldCB3aWR0aCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fd2lkdGggPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl93aWR0aCA9IHZhbHVlO1xuXHRcdHRoaXMuX3BTY2lzc29yUmVjdC53aWR0aCA9IHZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyKVxuXHRcdFx0dGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIudmlld1dpZHRoID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHRcdHRoaXMuX3BEZXB0aFRleHR1cmVJbnZhbGlkID0gdHJ1ZTtcblxuXHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGhlaWdodCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgaGVpZ2h0KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9oZWlnaHQgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcblx0XHR0aGlzLl9wU2Npc3NvclJlY3QuaGVpZ2h0ID0gdmFsdWU7XG5cblx0XHRpZiAodGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIpXG5cdFx0XHR0aGlzLl9wUnR0QnVmZmVyTWFuYWdlci52aWV3SGVpZ2h0ID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHRcdHRoaXMuX3BEZXB0aFRleHR1cmVJbnZhbGlkID0gdHJ1ZTtcblxuXHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgUmVuZGVyZXJCYXNlIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHN0YWdlOlN0YWdlID0gbnVsbClcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlID0gKGV2ZW50OlN0YWdlRXZlbnQpID0+IHRoaXMub25WaWV3cG9ydFVwZGF0ZWQoZXZlbnQpXG5cdFx0dGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUgPSAoZXZlbnQ6RXZlbnQpID0+IHRoaXMub25Db250ZXh0VXBkYXRlKGV2ZW50KTtcblxuXHRcdHRoaXMuc3RhZ2UgPSBzdGFnZSB8fCBTdGFnZU1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5nZXRGcmVlU3RhZ2UoKTtcblxuXHRcdC8vZGVmYXVsdCBzb3J0aW5nIGFsZ29yaXRobVxuXHRcdHRoaXMucmVuZGVyYWJsZVNvcnRlciA9IG5ldyBSZW5kZXJhYmxlTWVyZ2VTb3J0KCk7XG5cdH1cblxuXHRwdWJsaWMgYWN0aXZhdGVQcm9ncmFtKHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHNoYWRlcjpTaGFkZXJPYmplY3RCYXNlLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0Ly9jbGVhciB1bnVzZWQgdmVydGV4IHN0cmVhbXNcblx0XHRmb3IgKHZhciBpID0gc2hhZGVyLm51bVVzZWRTdHJlYW1zOyBpIDwgdGhpcy5fbnVtVXNlZFN0cmVhbXM7IGkrKylcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xuXG5cdFx0Ly9jbGVhciB1bnVzZWQgdGV4dHVyZSBzdHJlYW1zXG5cdFx0Zm9yICh2YXIgaSA9IHNoYWRlci5udW1Vc2VkVGV4dHVyZXM7IGkgPCB0aGlzLl9udW1Vc2VkVGV4dHVyZXM7IGkrKylcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFRleHR1cmVBdChpLCBudWxsKTtcblxuXHRcdC8vY2hlY2sgcHJvZ3JhbSBkYXRhIGlzIHVwbG9hZGVkXG5cdFx0dmFyIHByb2dyYW1EYXRhOlByb2dyYW1EYXRhID0gc2hhZGVyLnByb2dyYW1EYXRhO1xuXG5cdFx0aWYgKCFwcm9ncmFtRGF0YS5wcm9ncmFtKSB7XG5cdFx0XHRwcm9ncmFtRGF0YS5wcm9ncmFtID0gdGhpcy5fcENvbnRleHQuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdFx0dmFyIHZlcnRleEJ5dGVDb2RlOkJ5dGVBcnJheSA9IChuZXcgQUdBTE1pbmlBc3NlbWJsZXIoKS5hc3NlbWJsZShcInBhcnQgdmVydGV4IDFcXG5cIiArIHByb2dyYW1EYXRhLnZlcnRleFN0cmluZyArIFwiZW5kcGFydFwiKSlbJ3ZlcnRleCddLmRhdGE7XG5cdFx0XHR2YXIgZnJhZ21lbnRCeXRlQ29kZTpCeXRlQXJyYXkgPSAobmV3IEFHQUxNaW5pQXNzZW1ibGVyKCkuYXNzZW1ibGUoXCJwYXJ0IGZyYWdtZW50IDFcXG5cIiArIHByb2dyYW1EYXRhLmZyYWdtZW50U3RyaW5nICsgXCJlbmRwYXJ0XCIpKVsnZnJhZ21lbnQnXS5kYXRhO1xuXHRcdFx0cHJvZ3JhbURhdGEucHJvZ3JhbS51cGxvYWQodmVydGV4Qnl0ZUNvZGUsIGZyYWdtZW50Qnl0ZUNvZGUpO1xuXHRcdH1cblxuXHRcdC8vc2V0IHByb2dyYW0gZGF0YVxuXHRcdHRoaXMuX3BDb250ZXh0LnNldFByb2dyYW0ocHJvZ3JhbURhdGEucHJvZ3JhbSk7XG5cblx0XHQvL2FjdGl2YXRlIHNoYWRlciBvYmplY3QgdGhyb3VnaCByZW5kZXJhYmxlXG5cdFx0cmVuZGVyYWJsZS5faUFjdGl2YXRlKHNoYWRlciwgY2FtZXJhKTtcblx0fVxuXG5cdHB1YmxpYyBkZWFjdGl2YXRlUHJvZ3JhbShyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzaGFkZXI6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdC8vZGVhY3RpdmF0ZSBzaGFkZXIgb2JqZWN0XG5cdFx0cmVuZGVyYWJsZS5faURlYWN0aXZhdGUoc2hhZGVyKTtcblxuXHRcdHRoaXMuX251bVVzZWRTdHJlYW1zID0gc2hhZGVyLm51bVVzZWRTdHJlYW1zO1xuXHRcdHRoaXMuX251bVVzZWRUZXh0dXJlcyA9IHNoYWRlci5udW1Vc2VkVGV4dHVyZXM7XG5cdH1cblxuXHRwdWJsaWMgX2lDcmVhdGVFbnRpdHlDb2xsZWN0b3IoKTpJQ29sbGVjdG9yXG5cdHtcblx0XHRyZXR1cm4gbmV3IEVudGl0eUNvbGxlY3RvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBiYWNrZ3JvdW5kIGNvbG9yJ3MgcmVkIGNvbXBvbmVudCwgdXNlZCB3aGVuIGNsZWFyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRSKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZFI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZFIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRSID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZFIgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyBncmVlbiBjb21wb25lbnQsIHVzZWQgd2hlbiBjbGVhcmluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kRygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRHO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRHKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kRyA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JhY2tncm91bmRHID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBiYWNrZ3JvdW5kIGNvbG9yJ3MgYmx1ZSBjb21wb25lbnQsIHVzZWQgd2hlbiBjbGVhcmluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kQigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2JhY2tncm91bmRCO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRCKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kQiA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2JhY2tncm91bmRCID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIGdldCBjb250ZXh0KCk6SUNvbnRleHRHTFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BDb250ZXh0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBTdGFnZSB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgQ29udGV4dEdMIHVzZWQgZm9yIHJlbmRlcmluZy5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3RhZ2UoKTpTdGFnZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BTdGFnZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3RhZ2UodmFsdWU6U3RhZ2UpXG5cdHtcblx0XHRpZiAodmFsdWUgPT0gdGhpcy5fcFN0YWdlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5pU2V0U3RhZ2UodmFsdWUpO1xuXHR9XG5cblx0cHVibGljIGlTZXRTdGFnZSh2YWx1ZTpTdGFnZSlcblx0e1xuXHRcdGlmICh0aGlzLl9wU3RhZ2UpXG5cdFx0XHR0aGlzLmRpc3Bvc2UoKTtcblxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5fcFN0YWdlID0gdmFsdWU7XG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX1JFQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5WSUVXUE9SVF9VUERBVEVELCB0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlKTtcblxuXHRcdFx0dGhpcy5fYmlsbGJvYXJkUmVuZGVyYWJsZVBvb2wgPSBSZW5kZXJhYmxlUG9vbC5nZXRQb29sKEJpbGxib2FyZFJlbmRlcmFibGUsIHRoaXMuX3BTdGFnZSk7XG5cdFx0XHR0aGlzLl90cmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlUG9vbCA9IFJlbmRlcmFibGVQb29sLmdldFBvb2woVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZSwgdGhpcy5fcFN0YWdlKTtcblx0XHRcdHRoaXMuX2xpbmVTdWJNZXNoUmVuZGVyYWJsZVBvb2wgPSBSZW5kZXJhYmxlUG9vbC5nZXRQb29sKExpbmVTdWJNZXNoUmVuZGVyYWJsZSwgdGhpcy5fcFN0YWdlKTtcblxuXHRcdFx0Lypcblx0XHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxuXHRcdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5zdGFnZSA9IHZhbHVlO1xuXHRcdFx0ICovXG5cdFx0XHRpZiAodGhpcy5fcFN0YWdlLmNvbnRleHQpXG5cdFx0XHRcdHRoaXMuX3BDb250ZXh0ID0gPElDb250ZXh0R0w+IHRoaXMuX3BTdGFnZS5jb250ZXh0O1xuXHRcdH1cblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmVycyBjb250cm9sIG9mIENvbnRleHRHTCBjbGVhcigpIGFuZCBwcmVzZW50KCkgY2FsbHMgdG8gU3RhZ2UsIGVuYWJsaW5nIG11bHRpcGxlIFN0YWdlIGZyYW1ld29ya3Ncblx0ICogdG8gc2hhcmUgdGhlIHNhbWUgQ29udGV4dEdMIG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2hhcmVDb250ZXh0KCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NoYXJlQ29udGV4dDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2hhcmVDb250ZXh0KHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fc2hhcmVDb250ZXh0ID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc3Bvc2VzIHRoZSByZXNvdXJjZXMgdXNlZCBieSB0aGUgUmVuZGVyZXJCYXNlLlxuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0dGhpcy5fYmlsbGJvYXJkUmVuZGVyYWJsZVBvb2wuZGlzcG9zZSgpO1xuXHRcdHRoaXMuX3RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVQb29sLmRpc3Bvc2UoKTtcblx0XHR0aGlzLl9saW5lU3ViTWVzaFJlbmRlcmFibGVQb29sLmRpc3Bvc2UoKTtcblx0XHR0aGlzLl9iaWxsYm9hcmRSZW5kZXJhYmxlUG9vbCA9IG51bGw7XG5cdFx0dGhpcy5fdHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVBvb2wgPSBudWxsO1xuXHRcdHRoaXMuX2xpbmVTdWJNZXNoUmVuZGVyYWJsZVBvb2wgPSBudWxsO1xuXG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX0NSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHR0aGlzLl9wU3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfUkVDUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5WSUVXUE9SVF9VUERBVEVELCB0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlKTtcblxuXHRcdHRoaXMuX3BTdGFnZSA9IG51bGw7XG5cdFx0dGhpcy5fcENvbnRleHQgPSBudWxsO1xuXHRcdC8qXG5cdFx0IGlmIChfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpIHtcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLmRpc3Bvc2UoKTtcblx0XHQgX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyID0gbnVsbDtcblx0XHQgfVxuXHRcdCAqL1xuXHR9XG5cblx0cHVibGljIHJlbmRlcihlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3Rvcilcblx0e1xuXHRcdHRoaXMuX3ZpZXdwb3J0RGlydHkgPSBmYWxzZTtcblx0XHR0aGlzLl9zY2lzc29yRGlydHkgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5IHRvIHRoZSBiYWNrIGJ1ZmZlciBvciB0ZXh0dXJlLlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkuXG5cdCAqIEBwYXJhbSB0YXJnZXQgQW4gb3B0aW9uIHRhcmdldCB0ZXh0dXJlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIHN1cmZhY2VTZWxlY3RvciBUaGUgaW5kZXggb2YgYSBDdWJlVGV4dHVyZSdzIGZhY2UgdG8gcmVuZGVyIHRvLlxuXHQgKiBAcGFyYW0gYWRkaXRpb25hbENsZWFyTWFzayBBZGRpdGlvbmFsIGNsZWFyIG1hc2sgaW5mb3JtYXRpb24sIGluIGNhc2UgZXh0cmEgY2xlYXIgY2hhbm5lbHMgYXJlIHRvIGJlIG9taXR0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgX2lSZW5kZXIoZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlID0gbnVsbCwgc2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbnVsbCwgc3VyZmFjZVNlbGVjdG9yOm51bWJlciA9IDApXG5cdHtcblx0XHQvL1RPRE8gcmVmYWN0b3Igc2V0VGFyZ2V0IHNvIHRoYXQgcmVuZGVydGV4dHVyZXMgYXJlIGNyZWF0ZWQgYmVmb3JlIHRoaXMgY2hlY2tcblx0XHRpZiAoIXRoaXMuX3BTdGFnZSB8fCAhdGhpcy5fcENvbnRleHQpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXguY29weUZyb20oZW50aXR5Q29sbGVjdG9yLmNhbWVyYS52aWV3UHJvamVjdGlvbik7XG5cdFx0dGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4LmFwcGVuZFNjYWxlKHRoaXMudGV4dHVyZVJhdGlvWCwgdGhpcy50ZXh0dXJlUmF0aW9ZLCAxKTtcblxuXHRcdHRoaXMucEV4ZWN1dGVSZW5kZXIoZW50aXR5Q29sbGVjdG9yLCB0YXJnZXQsIHNjaXNzb3JSZWN0LCBzdXJmYWNlU2VsZWN0b3IpO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgbWlwIG1hcHMgb24gdGFyZ2V0IChpZiB0YXJnZXQgZXhpc3RzKSAvL1RPRE9cblx0XHQvL2lmICh0YXJnZXQpXG5cdFx0Ly9cdCg8VGV4dHVyZT50YXJnZXQpLmdlbmVyYXRlTWlwbWFwcygpO1xuXG5cdFx0Ly8gY2xlYXIgYnVmZmVyc1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IDg7ICsraSkge1xuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoaSwgbnVsbCk7XG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRUZXh0dXJlQXQoaSwgbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9pUmVuZGVyQ2FzY2FkZXMoZW50aXR5Q29sbGVjdG9yOlNoYWRvd0Nhc3RlckNvbGxlY3RvciwgdGFyZ2V0OlRleHR1cmVQcm94eUJhc2UsIG51bUNhc2NhZGVzOm51bWJlciwgc2Npc3NvclJlY3RzOkFycmF5PFJlY3RhbmdsZT4sIGNhbWVyYXM6QXJyYXk8Q2FtZXJhPilcblx0e1xuXHRcdHRoaXMucENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0dGhpcy5fcFN0YWdlLnNldFJlbmRlclRhcmdldCh0YXJnZXQsIHRydWUsIDApO1xuXHRcdHRoaXMuX3BDb250ZXh0LmNsZWFyKDEsIDEsIDEsIDEsIDEsIDApO1xuXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0QmxlbmRGYWN0b3JzKENvbnRleHRHTEJsZW5kRmFjdG9yLk9ORSwgQ29udGV4dEdMQmxlbmRGYWN0b3IuWkVSTyk7XG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KHRydWUsIENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1MpO1xuXG5cdFx0dmFyIGhlYWQ6UmVuZGVyYWJsZUJhc2UgPSB0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ7XG5cblx0XHR2YXIgZmlyc3Q6Ym9vbGVhbiA9IHRydWU7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IG51bUNhc2NhZGVzIC0gMTsgaSA+PSAwOyAtLWkpIHtcblx0XHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IHNjaXNzb3JSZWN0c1tpXTtcblx0XHRcdHRoaXMuZHJhd0Nhc2NhZGVSZW5kZXJhYmxlcyhoZWFkLCBjYW1lcmFzW2ldLCBmaXJzdD8gbnVsbCA6IGNhbWVyYXNbaV0uZnJ1c3R1bVBsYW5lcyk7XG5cdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vbGluZSByZXF1aXJlZCBmb3IgY29ycmVjdCByZW5kZXJpbmcgd2hlbiB1c2luZyBhd2F5M2Qgd2l0aCBzdGFybGluZy4gRE8gTk9UIFJFTU9WRSBVTkxFU1MgU1RBUkxJTkcgSU5URUdSQVRJT04gSVMgUkVURVNURUQhXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XG5cdH1cblxuXHRwdWJsaWMgcENvbGxlY3RSZW5kZXJhYmxlcyhlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3Rvcilcblx0e1xuXHRcdC8vcmVzZXQgaGVhZCB2YWx1ZXNcblx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gbnVsbDtcblx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSBudWxsO1xuXHRcdHRoaXMuX3BOdW1UcmlhbmdsZXMgPSAwO1xuXG5cdFx0Ly9ncmFiIGVudGl0eSBoZWFkXG5cdFx0dmFyIGl0ZW06RW50aXR5TGlzdEl0ZW0gPSBlbnRpdHlDb2xsZWN0b3IuZW50aXR5SGVhZDtcblxuXHRcdC8vc2V0IHRlbXAgdmFsdWVzIGZvciBlbnRyeSBwb2ludCBhbmQgY2FtZXJhIGZvcndhcmQgdmVjdG9yXG5cdFx0dGhpcy5fcENhbWVyYSA9IGVudGl0eUNvbGxlY3Rvci5jYW1lcmE7XG5cdFx0dGhpcy5faUVudHJ5UG9pbnQgPSB0aGlzLl9wQ2FtZXJhLnNjZW5lUG9zaXRpb247XG5cdFx0dGhpcy5fcENhbWVyYUZvcndhcmQgPSB0aGlzLl9wQ2FtZXJhLnRyYW5zZm9ybS5mb3J3YXJkVmVjdG9yO1xuXG5cdFx0Ly9pdGVyYXRlIHRocm91Z2ggYWxsIGVudGl0aWVzXG5cdFx0d2hpbGUgKGl0ZW0pIHtcblx0XHRcdGl0ZW0uZW50aXR5Ll9pQ29sbGVjdFJlbmRlcmFibGVzKHRoaXMpO1xuXHRcdFx0aXRlbSA9IGl0ZW0ubmV4dDtcblx0XHR9XG5cblx0XHQvL3NvcnQgdGhlIHJlc3VsdGluZyByZW5kZXJhYmxlc1xuXHRcdHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCA9IDxSZW5kZXJhYmxlQmFzZT4gdGhpcy5yZW5kZXJhYmxlU29ydGVyLnNvcnRPcGFxdWVSZW5kZXJhYmxlcyh0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQpO1xuXHRcdHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQgPSA8UmVuZGVyYWJsZUJhc2U+IHRoaXMucmVuZGVyYWJsZVNvcnRlci5zb3J0QmxlbmRlZFJlbmRlcmFibGVzKHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkgdG8gdGhlIGJhY2sgYnVmZmVyIG9yIHRleHR1cmUuIE9ubHkgZXhlY3V0ZWQgaWYgZXZlcnl0aGluZyBpcyBzZXQgdXAuXG5cdCAqXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBvYmplY3QgY29udGFpbmluZyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeS5cblx0ICogQHBhcmFtIHRhcmdldCBBbiBvcHRpb24gdGFyZ2V0IHRleHR1cmUgdG8gcmVuZGVyIHRvLlxuXHQgKiBAcGFyYW0gc3VyZmFjZVNlbGVjdG9yIFRoZSBpbmRleCBvZiBhIEN1YmVUZXh0dXJlJ3MgZmFjZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBhZGRpdGlvbmFsQ2xlYXJNYXNrIEFkZGl0aW9uYWwgY2xlYXIgbWFzayBpbmZvcm1hdGlvbiwgaW4gY2FzZSBleHRyYSBjbGVhciBjaGFubmVscyBhcmUgdG8gYmUgb21pdHRlZC5cblx0ICovXG5cdHB1YmxpYyBwRXhlY3V0ZVJlbmRlcihlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3RvciwgdGFyZ2V0OlRleHR1cmVQcm94eUJhc2UgPSBudWxsLCBzY2lzc29yUmVjdDpSZWN0YW5nbGUgPSBudWxsLCBzdXJmYWNlU2VsZWN0b3I6bnVtYmVyID0gMClcblx0e1xuXHRcdHRoaXMuX3BTdGFnZS5zZXRSZW5kZXJUYXJnZXQodGFyZ2V0LCB0cnVlLCBzdXJmYWNlU2VsZWN0b3IpO1xuXG5cdFx0aWYgKCh0YXJnZXQgfHwgIXRoaXMuX3NoYXJlQ29udGV4dCkgJiYgIXRoaXMuX2RlcHRoUHJlcGFzcylcblx0XHRcdHRoaXMuX3BDb250ZXh0LmNsZWFyKHRoaXMuX2JhY2tncm91bmRSLCB0aGlzLl9iYWNrZ3JvdW5kRywgdGhpcy5fYmFja2dyb3VuZEIsIHRoaXMuX2JhY2tncm91bmRBbHBoYSwgMSwgMCk7XG5cblx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBzY2lzc29yUmVjdDtcblxuXHRcdC8qXG5cdFx0IGlmIChfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpXG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5yZW5kZXIoKTtcblx0XHQgKi9cblx0XHR0aGlzLnBDb2xsZWN0UmVuZGVyYWJsZXMoZW50aXR5Q29sbGVjdG9yKTtcblxuXHRcdHRoaXMuX3BDb250ZXh0LnNldEJsZW5kRmFjdG9ycyhDb250ZXh0R0xCbGVuZEZhY3Rvci5PTkUsIENvbnRleHRHTEJsZW5kRmFjdG9yLlpFUk8pO1xuXG5cdFx0dGhpcy5wRHJhdyhlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0Ly9saW5lIHJlcXVpcmVkIGZvciBjb3JyZWN0IHJlbmRlcmluZyB3aGVuIHVzaW5nIGF3YXkzZCB3aXRoIHN0YXJsaW5nLiBETyBOT1QgUkVNT1ZFIFVOTEVTUyBTVEFSTElORyBJTlRFR1JBVElPTiBJUyBSRVRFU1RFRCFcblx0XHQvL3RoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdChmYWxzZSwgQ29udGV4dEdMQ29tcGFyZU1vZGUuTEVTU19FUVVBTCk7IC8vb29wc2llXG5cblx0XHRpZiAoIXRoaXMuX3NoYXJlQ29udGV4dCkge1xuXHRcdFx0aWYgKHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgJiYgdGhpcy5fc25hcHNob3RCaXRtYXBEYXRhKSB7XG5cdFx0XHRcdHRoaXMuX3BDb250ZXh0LmRyYXdUb0JpdG1hcERhdGEodGhpcy5fc25hcHNob3RCaXRtYXBEYXRhKTtcblx0XHRcdFx0dGhpcy5fc25hcHNob3RSZXF1aXJlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3BTdGFnZS5zY2lzc29yUmVjdCA9IG51bGw7XG5cdH1cblxuXHQvKlxuXHQgKiBXaWxsIGRyYXcgdGhlIHJlbmRlcmVyJ3Mgb3V0cHV0IG9uIG5leHQgcmVuZGVyIHRvIHRoZSBwcm92aWRlZCBiaXRtYXAgZGF0YS5cblx0ICogKi9cblx0cHVibGljIHF1ZXVlU25hcHNob3QoYm1kOkJpdG1hcERhdGEpXG5cdHtcblx0XHR0aGlzLl9zbmFwc2hvdFJlcXVpcmVkID0gdHJ1ZTtcblx0XHR0aGlzLl9zbmFwc2hvdEJpdG1hcERhdGEgPSBibWQ7XG5cdH1cblxuXHQvKipcblx0ICogUGVyZm9ybXMgdGhlIGFjdHVhbCBkcmF3aW5nIG9mIGdlb21ldHJ5IHRvIHRoZSB0YXJnZXQuXG5cdCAqIEBwYXJhbSBlbnRpdHlDb2xsZWN0b3IgVGhlIEVudGl0eUNvbGxlY3RvciBvYmplY3QgY29udGFpbmluZyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeS5cblx0ICovXG5cdHB1YmxpYyBwRHJhdyhlbnRpdHlDb2xsZWN0b3I6SUNvbGxlY3Rvcilcblx0e1xuXHRcdHRoaXMuX3BDb250ZXh0LnNldERlcHRoVGVzdCh0cnVlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5MRVNTX0VRVUFMKTtcblxuXHRcdGlmICh0aGlzLl9kaXNhYmxlQ29sb3IpXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5zZXRDb2xvck1hc2soZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuXG5cdFx0dGhpcy5kcmF3UmVuZGVyYWJsZXModGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkLCBlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0aWYgKHRoaXMuX3JlbmRlckJsZW5kZWQpXG5cdFx0XHR0aGlzLmRyYXdSZW5kZXJhYmxlcyh0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkLCBlbnRpdHlDb2xsZWN0b3IpO1xuXG5cdFx0aWYgKHRoaXMuX2Rpc2FibGVDb2xvcilcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldENvbG9yTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcblx0fVxuXG5cdHByaXZhdGUgZHJhd0Nhc2NhZGVSZW5kZXJhYmxlcyhyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBjYW1lcmE6Q2FtZXJhLCBjdWxsUGxhbmVzOkFycmF5PFBsYW5lM0Q+KVxuXHR7XG5cdFx0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xuXHRcdHZhciBzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZTtcblx0XHR2YXIgcmVuZGVyYWJsZTI6UmVuZGVyYWJsZUJhc2U7XG5cblx0XHR3aGlsZSAocmVuZGVyYWJsZSkge1xuXHRcdFx0cmVuZGVyT2JqZWN0ID0gcmVuZGVyYWJsZS5yZW5kZXJPYmplY3Q7XG5cblx0XHRcdHJlbmRlcmFibGUyID0gcmVuZGVyYWJsZTtcblxuXHRcdFx0dGhpcy5hY3RpdmF0ZVByb2dyYW0ocmVuZGVyYWJsZSwgc2hhZGVyT2JqZWN0LCBjYW1lcmEpO1xuXG5cdFx0XHRkbyB7XG5cdFx0XHRcdC8vIGlmIGNvbXBsZXRlbHkgaW4gZnJvbnQsIGl0IHdpbGwgZmFsbCBpbiBhIGRpZmZlcmVudCBjYXNjYWRlXG5cdFx0XHRcdC8vIGRvIG5vdCB1c2UgbmVhciBhbmQgZmFyIHBsYW5lc1xuXHRcdFx0XHRpZiAoIWN1bGxQbGFuZXMgfHwgcmVuZGVyYWJsZTIuc291cmNlRW50aXR5LndvcmxkQm91bmRzLmlzSW5GcnVzdHVtKGN1bGxQbGFuZXMsIDQpKSB7XG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIuX2lSZW5kZXIoc2hhZGVyT2JqZWN0LCBjYW1lcmEsIHRoaXMuX3BSdHRWaWV3UHJvamVjdGlvbk1hdHJpeCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIuY2FzY2FkZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlMi5uZXh0O1xuXG5cdFx0XHR9IHdoaWxlIChyZW5kZXJhYmxlMiAmJiByZW5kZXJhYmxlMi5yZW5kZXJPYmplY3QgPT0gcmVuZGVyT2JqZWN0ICYmICFyZW5kZXJhYmxlMi5jYXNjYWRlZCk7XG5cblx0XHRcdHRoaXMuZGVhY3RpdmF0ZVByb2dyYW0ocmVuZGVyYWJsZSwgc2hhZGVyT2JqZWN0KTtcblxuXHRcdFx0cmVuZGVyYWJsZSA9IHJlbmRlcmFibGUyO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBEcmF3IGEgbGlzdCBvZiByZW5kZXJhYmxlcy5cblx0ICpcblx0ICogQHBhcmFtIHJlbmRlcmFibGVzIFRoZSByZW5kZXJhYmxlcyB0byBkcmF3LlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3IgY29udGFpbmluZyBhbGwgcG90ZW50aWFsbHkgdmlzaWJsZSBpbmZvcm1hdGlvbi5cblx0ICovXG5cdHB1YmxpYyBkcmF3UmVuZGVyYWJsZXMocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IpXG5cdHtcblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIGxlbjpudW1iZXI7XG5cdFx0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlO1xuXHRcdHZhciBzaGFkZXJPYmplY3RzOkFycmF5PFNoYWRlck9iamVjdEJhc2U+O1xuXHRcdHZhciBzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZTtcblx0XHR2YXIgY2FtZXJhOkNhbWVyYSA9IGVudGl0eUNvbGxlY3Rvci5jYW1lcmE7XG5cdFx0dmFyIHJlbmRlcmFibGUyOlJlbmRlcmFibGVCYXNlO1xuXG5cdFx0d2hpbGUgKHJlbmRlcmFibGUpIHtcblx0XHRcdHJlbmRlck9iamVjdCA9IHJlbmRlcmFibGUucmVuZGVyT2JqZWN0O1xuXHRcdFx0c2hhZGVyT2JqZWN0cyA9IHJlbmRlck9iamVjdC5zaGFkZXJPYmplY3RzO1xuXG5cdFx0XHQvLyBvdGhlcndpc2UgdGhpcyB3b3VsZCByZXN1bHQgaW4gZGVwdGggcmVuZGVyZWQgYW55d2F5IGJlY2F1c2UgZnJhZ21lbnQgc2hhZGVyIGtpbCBpcyBpZ25vcmVkXG5cdFx0XHRpZiAodGhpcy5fZGlzYWJsZUNvbG9yICYmIHJlbmRlck9iamVjdC5fcmVuZGVyT2JqZWN0T3duZXIuYWxwaGFUaHJlc2hvbGQgIT0gMCkge1xuXHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XG5cdFx0XHRcdC8vIGZhc3QgZm9yd2FyZFxuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0cmVuZGVyYWJsZTIgPSByZW5kZXJhYmxlMi5uZXh0O1xuXG5cdFx0XHRcdH0gd2hpbGUgKHJlbmRlcmFibGUyICYmIHJlbmRlcmFibGUyLnJlbmRlck9iamVjdCA9PSByZW5kZXJPYmplY3QpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9pdGVyYXRlIHRocm91Z2ggZWFjaCBzaGFkZXIgb2JqZWN0XG5cdFx0XHRcdGxlbiA9IHNoYWRlck9iamVjdHMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGU7XG5cdFx0XHRcdFx0c2hhZGVyT2JqZWN0ID0gc2hhZGVyT2JqZWN0c1tpXTtcblxuXHRcdFx0XHRcdHRoaXMuYWN0aXZhdGVQcm9ncmFtKHJlbmRlcmFibGUsIHNoYWRlck9iamVjdCwgY2FtZXJhKTtcblxuXHRcdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRcdHJlbmRlcmFibGUyLl9pUmVuZGVyKHNoYWRlck9iamVjdCwgY2FtZXJhLCB0aGlzLl9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXgpO1xuXG5cdFx0XHRcdFx0XHRyZW5kZXJhYmxlMiA9IHJlbmRlcmFibGUyLm5leHQ7XG5cblx0XHRcdFx0XHR9IHdoaWxlIChyZW5kZXJhYmxlMiAmJiByZW5kZXJhYmxlMi5yZW5kZXJPYmplY3QgPT0gcmVuZGVyT2JqZWN0KTtcblxuXHRcdFx0XHRcdHRoaXMuZGVhY3RpdmF0ZVByb2dyYW0ocmVuZGVyYWJsZSwgc2hhZGVyT2JqZWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZW5kZXJhYmxlID0gcmVuZGVyYWJsZTI7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEFzc2lnbiB0aGUgY29udGV4dCBvbmNlIHJldHJpZXZlZFxuXHQgKi9cblx0cHJpdmF0ZSBvbkNvbnRleHRVcGRhdGUoZXZlbnQ6RXZlbnQpXG5cdHtcblx0XHR0aGlzLl9wQ29udGV4dCA9IDxJQ29udGV4dEdMPiB0aGlzLl9wU3RhZ2UuY29udGV4dDtcblx0fVxuXG5cdHB1YmxpYyBnZXQgX2lCYWNrZ3JvdW5kQWxwaGEoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQWxwaGE7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZEFscGhhKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9iYWNrZ3JvdW5kQWxwaGEgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9iYWNrZ3JvdW5kQWxwaGEgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHQvKlxuXHQgcHVibGljIGdldCBpQmFja2dyb3VuZCgpOlRleHR1cmUyREJhc2Vcblx0IHtcblx0IHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuXHQgfVxuXHQgKi9cblxuXHQvKlxuXHQgcHVibGljIHNldCBpQmFja2dyb3VuZCh2YWx1ZTpUZXh0dXJlMkRCYXNlKVxuXHQge1xuXHQgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyICYmICF2YWx1ZSkge1xuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIuZGlzcG9zZSgpO1xuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgPSBudWxsO1xuXHQgfVxuXG5cdCBpZiAoIXRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyICYmIHZhbHVlKVxuXHQge1xuXG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciA9IG5ldyBCYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcih0aGlzLl9wU3RhZ2UpO1xuXG5cdCB9XG5cblxuXHQgdGhpcy5fYmFja2dyb3VuZCA9IHZhbHVlO1xuXG5cdCBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIpXG5cdCB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci50ZXh0dXJlID0gdmFsdWU7XG5cdCB9XG5cdCAqL1xuXHQvKlxuXHQgcHVibGljIGdldCBiYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcigpOkJhY2tncm91bmRJbWFnZVJlbmRlcmVyXG5cdCB7XG5cdCByZXR1cm4gX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyO1xuXHQgfVxuXHQgKi9cblxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBub3RpZnlTY2lzc29yVXBkYXRlKClcblx0e1xuXHRcdGlmICh0aGlzLl9zY2lzc29yRGlydHkpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9zY2lzc29yRGlydHkgPSB0cnVlO1xuXG5cdFx0aWYgKCF0aGlzLl9zY2lzc29yVXBkYXRlZClcblx0XHRcdHRoaXMuX3NjaXNzb3JVcGRhdGVkID0gbmV3IFJlbmRlcmVyRXZlbnQoUmVuZGVyZXJFdmVudC5TQ0lTU09SX1VQREFURUQpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3NjaXNzb3JVcGRhdGVkKTtcblx0fVxuXG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIG5vdGlmeVZpZXdwb3J0VXBkYXRlKClcblx0e1xuXHRcdGlmICh0aGlzLl92aWV3cG9ydERpcnR5KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fdmlld3BvcnREaXJ0eSA9IHRydWU7XG5cblx0XHRpZiAoIXRoaXMuX3ZpZXdQb3J0VXBkYXRlZClcblx0XHRcdHRoaXMuX3ZpZXdQb3J0VXBkYXRlZCA9IG5ldyBSZW5kZXJlckV2ZW50KFJlbmRlcmVyRXZlbnQuVklFV1BPUlRfVVBEQVRFRCk7XG5cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fdmlld1BvcnRVcGRhdGVkKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIG9uVmlld3BvcnRVcGRhdGVkKGV2ZW50OlN0YWdlRXZlbnQpXG5cdHtcblx0XHR0aGlzLl92aWV3UG9ydCA9IHRoaXMuX3BTdGFnZS52aWV3UG9ydDtcblx0XHQvL1RPRE8gc3RvcCBmaXJpbmcgdmlld3BvcnQgdXBkYXRlZCBmb3IgZXZlcnkgc3RhZ2VnbCB2aWV3cG9ydCBjaGFuZ2VcblxuXHRcdGlmICh0aGlzLl9zaGFyZUNvbnRleHQpIHtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC54ID0gdGhpcy5fZ2xvYmFsUG9zLnggLSB0aGlzLl9wU3RhZ2UueDtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC55ID0gdGhpcy5fZ2xvYmFsUG9zLnkgLSB0aGlzLl9wU3RhZ2UueTtcblx0XHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMubm90aWZ5Vmlld3BvcnRVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHVwZGF0ZUdsb2JhbFBvcygpXG5cdHtcblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0KSB7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IHRoaXMuX2dsb2JhbFBvcy54IC0gdGhpcy5fdmlld1BvcnQueDtcblx0XHRcdHRoaXMuX3BTY2lzc29yUmVjdC55ID0gdGhpcy5fZ2xvYmFsUG9zLnkgLSB0aGlzLl92aWV3UG9ydC55O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IDA7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IDA7XG5cdFx0XHR0aGlzLl92aWV3UG9ydC54ID0gdGhpcy5fZ2xvYmFsUG9zLng7XG5cdFx0XHR0aGlzLl92aWV3UG9ydC55ID0gdGhpcy5fZ2xvYmFsUG9zLnk7XG5cdFx0fVxuXG5cdFx0dGhpcy5ub3RpZnlTY2lzc29yVXBkYXRlKCk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gYmlsbGJvYXJkXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHB1YmxpYyBhcHBseUJpbGxib2FyZChiaWxsYm9hcmQ6QmlsbGJvYXJkKVxuXHR7XG5cdFx0dGhpcy5fYXBwbHlSZW5kZXJhYmxlKHRoaXMuX2JpbGxib2FyZFJlbmRlcmFibGVQb29sLmdldEl0ZW0oYmlsbGJvYXJkKSk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHRyaWFuZ2xlU3ViTWVzaFxuXHQgKi9cblx0cHVibGljIGFwcGx5VHJpYW5nbGVTdWJNZXNoKHRyaWFuZ2xlU3ViTWVzaDpUcmlhbmdsZVN1Yk1lc2gpXG5cdHtcblx0XHR0aGlzLl9hcHBseVJlbmRlcmFibGUodGhpcy5fdHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVBvb2wuZ2V0SXRlbSh0cmlhbmdsZVN1Yk1lc2gpKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gbGluZVN1Yk1lc2hcblx0ICovXG5cdHB1YmxpYyBhcHBseUxpbmVTdWJNZXNoKGxpbmVTdWJNZXNoOkxpbmVTdWJNZXNoKVxuXHR7XG5cdFx0dGhpcy5fYXBwbHlSZW5kZXJhYmxlKHRoaXMuX2xpbmVTdWJNZXNoUmVuZGVyYWJsZVBvb2wuZ2V0SXRlbShsaW5lU3ViTWVzaCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdHByaXZhdGUgX2FwcGx5UmVuZGVyYWJsZShyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlKVxuXHR7XG5cdFx0Ly9zZXQgbG9jYWwgdmFycyBmb3IgZmFzdGVyIHJlZmVyZW5jaW5nXG5cdFx0dmFyIHJlbmRlck9iamVjdDpSZW5kZXJPYmplY3RCYXNlID0gdGhpcy5fcEdldFJlbmRlck9iamVjdChyZW5kZXJhYmxlLCByZW5kZXJhYmxlLnJlbmRlck9iamVjdE93bmVyIHx8IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuZ2V0RGVmYXVsdE1hdGVyaWFsKHJlbmRlcmFibGUucmVuZGVyYWJsZU93bmVyKSk7XG5cblx0XHRyZW5kZXJhYmxlLnJlbmRlck9iamVjdCA9IHJlbmRlck9iamVjdDtcblx0XHRyZW5kZXJhYmxlLnJlbmRlck9iamVjdElkID0gcmVuZGVyT2JqZWN0LnJlbmRlck9iamVjdElkO1xuXHRcdHJlbmRlcmFibGUucmVuZGVyT3JkZXJJZCA9IHJlbmRlck9iamVjdC5yZW5kZXJPcmRlcklkO1xuXG5cdFx0cmVuZGVyYWJsZS5jYXNjYWRlZCA9IGZhbHNlO1xuXG5cdFx0dmFyIGVudGl0eTpJRW50aXR5ID0gcmVuZGVyYWJsZS5zb3VyY2VFbnRpdHk7XG5cdFx0dmFyIHBvc2l0aW9uOlZlY3RvcjNEID0gZW50aXR5LnNjZW5lUG9zaXRpb247XG5cblx0XHQvLyBwcm9qZWN0IG9udG8gY2FtZXJhJ3Mgei1heGlzXG5cdFx0cG9zaXRpb24gPSB0aGlzLl9pRW50cnlQb2ludC5zdWJ0cmFjdChwb3NpdGlvbik7XG5cdFx0cmVuZGVyYWJsZS56SW5kZXggPSBlbnRpdHkuek9mZnNldCArIHBvc2l0aW9uLmRvdFByb2R1Y3QodGhpcy5fcENhbWVyYUZvcndhcmQpO1xuXG5cdFx0Ly9zdG9yZSByZWZlcmVuY2UgdG8gc2NlbmUgdHJhbnNmb3JtXG5cdFx0cmVuZGVyYWJsZS5yZW5kZXJTY2VuZVRyYW5zZm9ybSA9IHJlbmRlcmFibGUuc291cmNlRW50aXR5LmdldFJlbmRlclNjZW5lVHJhbnNmb3JtKHRoaXMuX3BDYW1lcmEpO1xuXG5cdFx0aWYgKHJlbmRlck9iamVjdC5yZXF1aXJlc0JsZW5kaW5nKSB7XG5cdFx0XHRyZW5kZXJhYmxlLm5leHQgPSB0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkO1xuXHRcdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IHJlbmRlcmFibGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbmRlcmFibGUubmV4dCA9IHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZDtcblx0XHRcdHRoaXMuX3BPcGFxdWVSZW5kZXJhYmxlSGVhZCA9IHJlbmRlcmFibGU7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcE51bVRyaWFuZ2xlcyArPSByZW5kZXJhYmxlLm51bVRyaWFuZ2xlcztcblxuXHRcdC8vaGFuZGxlIGFueSBvdmVyZmxvdyBmb3IgcmVuZGVyYWJsZXMgd2l0aCBkYXRhIHRoYXQgZXhjZWVkcyBHUFUgbGltaXRhdGlvbnNcblx0XHRpZiAocmVuZGVyYWJsZS5vdmVyZmxvdylcblx0XHRcdHRoaXMuX2FwcGx5UmVuZGVyYWJsZShyZW5kZXJhYmxlLm92ZXJmbG93KTtcblx0fVxuXG5cdHB1YmxpYyBfcEdldFJlbmRlck9iamVjdChyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCByZW5kZXJPYmplY3RPd25lcjpJUmVuZGVyT2JqZWN0T3duZXIpOlJlbmRlck9iamVjdEJhc2Vcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cbn1cblxuZXhwb3J0ID0gUmVuZGVyZXJCYXNlOyJdfQ==