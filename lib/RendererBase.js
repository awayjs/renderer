"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var Matrix3DUtils_1 = require("@awayjs/core/lib/geom/Matrix3DUtils");
var Point_1 = require("@awayjs/core/lib/geom/Point");
var Rectangle_1 = require("@awayjs/core/lib/geom/Rectangle");
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var EventDispatcher_1 = require("@awayjs/core/lib/events/EventDispatcher");
var RendererEvent_1 = require("@awayjs/display/lib/events/RendererEvent");
var AGALMiniAssembler_1 = require("@awayjs/stage/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLBlendFactor_1 = require("@awayjs/stage/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode_1 = require("@awayjs/stage/lib/base/ContextGLCompareMode");
var StageEvent_1 = require("@awayjs/stage/lib/events/StageEvent");
var StageManager_1 = require("@awayjs/stage/lib/managers/StageManager");
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
        this._cameraForward = new Vector3D_1.Vector3D();
        this._viewPort = new Rectangle_1.Rectangle();
        this._pBackBufferInvalid = true;
        this._pDepthTextureInvalid = true;
        this._depthPrepass = false;
        this._backgroundR = 0;
        this._backgroundG = 0;
        this._backgroundB = 0;
        this._backgroundAlpha = 1;
        this.textureRatioX = 1;
        this.textureRatioY = 1;
        this._pRttViewProjectionMatrix = new Matrix3D_1.Matrix3D();
        this._localPos = new Point_1.Point();
        this._globalPos = new Point_1.Point();
        this._pScissorRect = new Rectangle_1.Rectangle();
        this._pNumElements = 0;
        this._disableColor = false;
        this._renderBlended = true;
        this._numCullPlanes = 0;
        this._onViewportUpdatedDelegate = function (event) { return _this.onViewportUpdated(event); };
        this._onContextUpdateDelegate = function (event) { return _this.onContextUpdate(event); };
        //default sorting algorithm
        this.renderableSorter = new RenderableMergeSort_1.RenderableMergeSort();
        //set stage
        this._pStage = stage || StageManager_1.StageManager.getInstance().getFreeStage(forceSoftware, profile, mode);
        this._pStage.addEventListener(StageEvent_1.StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.addEventListener(StageEvent_1.StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.addEventListener(StageEvent_1.StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
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
        return this._objectPools[elements.elementsType] || (this._objectPools[elements.elementsType] = new SurfacePool_1.SurfacePool(elements.elementsClass, this._pStage, this._surfaceClassGL));
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
            var vertexByteCode = (new AGALMiniAssembler_1.AGALMiniAssembler().assemble("part vertex 1\n" + programData.vertexString + "endpart"))['vertex'].data;
            var fragmentByteCode = (new AGALMiniAssembler_1.AGALMiniAssembler().assemble("part fragment 1\n" + programData.fragmentString + "endpart"))['fragment'].data;
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
        this._pStage.removeEventListener(StageEvent_1.StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent_1.StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent_1.StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
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
        this._cameraForward = Matrix3DUtils_1.Matrix3DUtils.getForward(camera.sceneTransform, this._cameraForward);
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
        this._pContext.setBlendFactors(ContextGLBlendFactor_1.ContextGLBlendFactor.ONE, ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO);
        this._pContext.setDepthTest(true, ContextGLCompareMode_1.ContextGLCompareMode.LESS);
        var head = this._pOpaqueRenderableHead;
        var first = true;
        //TODO cascades must have separate collectors, rather than separate draw commands
        for (var i = numCascades - 1; i >= 0; --i) {
            this._pStage.scissorRect = scissorRects[i];
            //this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
            first = false;
        }
        //line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
        this._pContext.setDepthTest(false, ContextGLCompareMode_1.ContextGLCompareMode.LESS_EQUAL);
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
        this._pContext.setBlendFactors(ContextGLBlendFactor_1.ContextGLBlendFactor.ONE, ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO);
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
        this._pContext.setDepthTest(true, ContextGLCompareMode_1.ContextGLCompareMode.LESS);
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
            this._scissorUpdated = new RendererEvent_1.RendererEvent(RendererEvent_1.RendererEvent.SCISSOR_UPDATED);
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
            this._viewPortUpdated = new RendererEvent_1.RendererEvent(RendererEvent_1.RendererEvent.VIEWPORT_UPDATED);
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
        this._pContext.setDepthTest(true, ContextGLCompareMode_1.ContextGLCompareMode.LESS);
        //this._stage.setRenderTarget(oldRenderTarget);
    };
    RendererBase.prototype._drawMask = function (camera, renderableGL) {
        var surfaceGL = renderableGL.surfaceGL;
        var passes = surfaceGL.passes;
        var len = passes.length;
        var pass = passes[len - 1];
        this.activatePass(pass, camera);
        this._pContext.setDepthTest(false, ContextGLCompareMode_1.ContextGLCompareMode.LESS); //TODO: setup so as not to override activate
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
}(EventDispatcher_1.EventDispatcher));
exports.RendererBase = RendererBase;
