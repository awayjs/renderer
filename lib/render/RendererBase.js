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
var RenderablePool = require("awayjs-display/lib/pool/RenderablePool");
var RenderableMergeSort = require("awayjs-display/lib/sort/RenderableMergeSort");
var RendererEvent = require("awayjs-display/lib/events/RendererEvent");
var StageEvent = require("awayjs-display/lib/events/StageEvent");
var EntityCollector = require("awayjs-display/lib/traverse/EntityCollector");
var AGALMiniAssembler = require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
var ContextGLCompareMode = require("awayjs-stagegl/lib/base/ContextGLCompareMode");
var BillboardRenderable = require("awayjs-renderergl/lib/pool/BillboardRenderable");
var LineSubMeshRenderable = require("awayjs-renderergl/lib/pool/LineSubMeshRenderable");
var MaterialDataPool = require("awayjs-renderergl/lib/pool/MaterialDataPool");
var TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
var DefaultMaterialManager = require("awayjs-renderergl/lib/managers/DefaultMaterialManager");
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
    function RendererBase() {
        var _this = this;
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
        this._onViewportUpdatedDelegate = function (event) { return _this.onViewportUpdated(event); };
        this._materialDataPool = new MaterialDataPool();
        this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable);
        this._triangleSubMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable);
        this._lineSubMeshRenderablePool = RenderablePool.getPool(LineSubMeshRenderable);
        this._onContextUpdateDelegate = function (event) { return _this.onContextUpdate(event); };
        //default sorting algorithm
        this.renderableSorter = new RenderableMergeSort();
    }
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
    RendererBase.prototype.getProgram = function (materialPassData) {
        //check key doesn't need re-concatenating
        if (!materialPassData.key.length) {
            materialPassData.key = materialPassData.animationVertexCode + materialPassData.vertexCode + "---" + materialPassData.fragmentCode + materialPassData.animationFragmentCode + materialPassData.postAnimationFragmentCode;
        }
        else {
            return materialPassData.programData;
        }
        var programData = this._pStage.getProgramData(materialPassData.key);
        //check program data hasn't changed, keep count of program usages
        if (materialPassData.programData != programData) {
            if (materialPassData.programData)
                materialPassData.programData.dispose();
            materialPassData.programData = programData;
            programData.usages++;
        }
        return programData;
    };
    /**
     *
     * @param material
     */
    RendererBase.prototype.getMaterial = function (material, profile) {
        var materialData = this._materialDataPool.getItem(material);
        if (materialData.invalidAnimation) {
            materialData.invalidAnimation = false;
            var materialDataPasses = materialData.getMaterialPasses(profile);
            var enabledGPUAnimation = this.getEnabledGPUAnimation(material, materialDataPasses);
            var renderOrderId = 0;
            var mult = 1;
            var materialPassData;
            var len = materialDataPasses.length;
            for (var i = 0; i < len; i++) {
                materialPassData = materialDataPasses[i];
                if (materialPassData.usesAnimation != enabledGPUAnimation) {
                    materialPassData.usesAnimation = enabledGPUAnimation;
                    materialPassData.key == "";
                }
                if (materialPassData.key == "")
                    this.calcAnimationCode(material, materialPassData);
                renderOrderId += this.getProgram(materialPassData).id * mult;
                mult *= 1000;
            }
            materialData.renderOrderId = renderOrderId;
        }
        return materialData;
    };
    RendererBase.prototype.activateMaterialPass = function (materialPassData, camera) {
        var shaderObject = materialPassData.shaderObject;
        for (var i = shaderObject.numUsedStreams; i < this._numUsedStreams; i++)
            this._pContext.setVertexBufferAt(i, null);
        for (var i = shaderObject.numUsedTextures; i < this._numUsedTextures; i++)
            this._pContext.setTextureAt(i, null);
        if (materialPassData.usesAnimation)
            materialPassData.material.animationSet.activate(shaderObject, this._pStage);
        //activate shader object
        shaderObject.iActivate(this._pStage, camera);
        //check program data is uploaded
        var programData = this.getProgram(materialPassData);
        if (!programData.program) {
            programData.program = this._pContext.createProgram();
            var vertexByteCode = (new AGALMiniAssembler().assemble("part vertex 1\n" + materialPassData.animationVertexCode + materialPassData.vertexCode + "endpart"))['vertex'].data;
            var fragmentByteCode = (new AGALMiniAssembler().assemble("part fragment 1\n" + materialPassData.fragmentCode + materialPassData.animationFragmentCode + materialPassData.postAnimationFragmentCode + "endpart"))['fragment'].data;
            programData.program.upload(vertexByteCode, fragmentByteCode);
        }
        //set program data
        this._pContext.setProgram(programData.program);
    };
    RendererBase.prototype.deactivateMaterialPass = function (materialPassData) {
        var shaderObject = materialPassData.shaderObject;
        if (materialPassData.usesAnimation)
            materialPassData.material.animationSet.deactivate(shaderObject, this._pStage);
        materialPassData.shaderObject.iDeactivate(this._pStage);
        this._numUsedStreams = shaderObject.numUsedStreams;
        this._numUsedTextures = shaderObject.numUsedTextures;
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
        if (this._pStage) {
            this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
            this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
            this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
        }
        if (!value) {
            this._pStage = null;
            this._pContext = null;
        }
        else {
            this._pStage = value;
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
        if (this._pRttBufferManager)
            this._pRttBufferManager.dispose();
        this._pRttBufferManager = null;
        this._pStage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
        this._pStage.removeEventListener(StageEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
        this._pStage = null;
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
        this._pContext.setDepthTest(false, ContextGLCompareMode.ALWAYS);
        this._pStage.scissorRect = scissorRect;
        /*
         if (_backgroundImageRenderer)
         _backgroundImageRenderer.render();
         */
        this.pDraw(entityCollector, target);
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
    RendererBase.prototype.pDraw = function (entityCollector, target) {
        throw new AbstractMethodError();
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
        var material = renderable.materialOwner.material;
        var entity = renderable.sourceEntity;
        var position = entity.scenePosition;
        if (!material)
            material = DefaultMaterialManager.getDefaultMaterial(renderable.materialOwner);
        //update material if invalidated
        material._iUpdateMaterial();
        //set ids for faster referencing
        renderable.material = material;
        renderable.materialId = material._iMaterialId;
        renderable.renderOrderId = this.getMaterial(material, this._pStage.profile).renderOrderId;
        renderable.cascaded = false;
        // project onto camera's z-axis
        position = this._iEntryPoint.subtract(position);
        renderable.zIndex = entity.zOffset + position.dotProduct(this._pCameraForward);
        //store reference to scene transform
        renderable.renderSceneTransform = renderable.sourceEntity.getRenderSceneTransform(this._pCamera);
        if (material.requiresBlending) {
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
    /**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
    RendererBase.prototype.getEnabledGPUAnimation = function (material, materialDataPasses) {
        if (material.animationSet) {
            material.animationSet.resetGPUCompatibility();
            var owners = material.iOwners;
            var numOwners = owners.length;
            var len = materialDataPasses.length;
            for (var i = 0; i < len; i++)
                for (var j = 0; j < numOwners; j++)
                    if (owners[j].animator)
                        owners[j].animator.testGPUCompatibility(materialDataPasses[i].shaderObject);
            return !material.animationSet.usesCPU;
        }
        return false;
    };
    RendererBase.prototype.calcAnimationCode = function (material, materialPassData) {
        //reset key so that the program is re-calculated
        materialPassData.key = "";
        materialPassData.animationVertexCode = "";
        materialPassData.animationFragmentCode = "";
        var shaderObject = materialPassData.shaderObject;
        //check to see if GPU animation is used
        if (materialPassData.usesAnimation) {
            var animationSet = material.animationSet;
            materialPassData.animationVertexCode += animationSet.getAGALVertexCode(shaderObject);
            if (shaderObject.uvDependencies > 0 && !shaderObject.usesUVTransform)
                materialPassData.animationVertexCode += animationSet.getAGALUVCode(shaderObject);
            if (shaderObject.usesFragmentAnimation)
                materialPassData.animationFragmentCode += animationSet.getAGALFragmentCode(shaderObject, materialPassData.shadedTarget);
            animationSet.doneAGALCode(shaderObject);
        }
        else {
            // simply write attributes to targets, do not animate them
            // projection will pick up on targets[0] to do the projection
            var len = shaderObject.animatableAttributes.length;
            for (var i = 0; i < len; ++i)
                materialPassData.animationVertexCode += "mov " + shaderObject.animationTargetRegisters[i] + ", " + shaderObject.animatableAttributes[i] + "\n";
            if (shaderObject.uvDependencies > 0 && !shaderObject.usesUVTransform)
                materialPassData.animationVertexCode += "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
        }
    };
    return RendererBase;
})(EventDispatcher);
module.exports = RendererBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9yZW5kZXIvcmVuZGVyZXJiYXNlLnRzIl0sIm5hbWVzIjpbIlJlbmRlcmVyQmFzZSIsIlJlbmRlcmVyQmFzZS5jb25zdHJ1Y3RvciIsIlJlbmRlcmVyQmFzZS5udW1UcmlhbmdsZXMiLCJSZW5kZXJlckJhc2Uudmlld1BvcnQiLCJSZW5kZXJlckJhc2Uuc2Npc3NvclJlY3QiLCJSZW5kZXJlckJhc2UueCIsIlJlbmRlcmVyQmFzZS55IiwiUmVuZGVyZXJCYXNlLndpZHRoIiwiUmVuZGVyZXJCYXNlLmhlaWdodCIsIlJlbmRlcmVyQmFzZS5nZXRQcm9ncmFtIiwiUmVuZGVyZXJCYXNlLmdldE1hdGVyaWFsIiwiUmVuZGVyZXJCYXNlLmFjdGl2YXRlTWF0ZXJpYWxQYXNzIiwiUmVuZGVyZXJCYXNlLmRlYWN0aXZhdGVNYXRlcmlhbFBhc3MiLCJSZW5kZXJlckJhc2UuX2lDcmVhdGVFbnRpdHlDb2xsZWN0b3IiLCJSZW5kZXJlckJhc2UuX2lCYWNrZ3JvdW5kUiIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRHIiwiUmVuZGVyZXJCYXNlLl9pQmFja2dyb3VuZEIiLCJSZW5kZXJlckJhc2UuY29udGV4dCIsIlJlbmRlcmVyQmFzZS5zdGFnZSIsIlJlbmRlcmVyQmFzZS5pU2V0U3RhZ2UiLCJSZW5kZXJlckJhc2Uuc2hhcmVDb250ZXh0IiwiUmVuZGVyZXJCYXNlLmRpc3Bvc2UiLCJSZW5kZXJlckJhc2UucmVuZGVyIiwiUmVuZGVyZXJCYXNlLl9pUmVuZGVyIiwiUmVuZGVyZXJCYXNlLl9pUmVuZGVyQ2FzY2FkZXMiLCJSZW5kZXJlckJhc2UucENvbGxlY3RSZW5kZXJhYmxlcyIsIlJlbmRlcmVyQmFzZS5wRXhlY3V0ZVJlbmRlciIsIlJlbmRlcmVyQmFzZS5xdWV1ZVNuYXBzaG90IiwiUmVuZGVyZXJCYXNlLnBEcmF3IiwiUmVuZGVyZXJCYXNlLm9uQ29udGV4dFVwZGF0ZSIsIlJlbmRlcmVyQmFzZS5faUJhY2tncm91bmRBbHBoYSIsIlJlbmRlcmVyQmFzZS5ub3RpZnlTY2lzc29yVXBkYXRlIiwiUmVuZGVyZXJCYXNlLm5vdGlmeVZpZXdwb3J0VXBkYXRlIiwiUmVuZGVyZXJCYXNlLm9uVmlld3BvcnRVcGRhdGVkIiwiUmVuZGVyZXJCYXNlLnVwZGF0ZUdsb2JhbFBvcyIsIlJlbmRlcmVyQmFzZS5hcHBseUJpbGxib2FyZCIsIlJlbmRlcmVyQmFzZS5hcHBseVRyaWFuZ2xlU3ViTWVzaCIsIlJlbmRlcmVyQmFzZS5hcHBseUxpbmVTdWJNZXNoIiwiUmVuZGVyZXJCYXNlLl9hcHBseVJlbmRlcmFibGUiLCJSZW5kZXJlckJhc2UuZ2V0RW5hYmxlZEdQVUFuaW1hdGlvbiIsIlJlbmRlcmVyQmFzZS5jYWxjQW5pbWF0aW9uQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBTyxLQUFLLFdBQWdCLDRCQUE0QixDQUFDLENBQUM7QUFDMUQsSUFBTyxTQUFTLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUVqRSxJQUFPLG1CQUFtQixXQUFhLDRDQUE0QyxDQUFDLENBQUM7QUFDckYsSUFBTyxlQUFlLFdBQWMsd0NBQXdDLENBQUMsQ0FBQztBQVE5RSxJQUFPLGNBQWMsV0FBYyx3Q0FBd0MsQ0FBQyxDQUFDO0FBRTdFLElBQU8sbUJBQW1CLFdBQWEsNkNBQTZDLENBQUMsQ0FBQztBQU10RixJQUFPLGFBQWEsV0FBYyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQzdFLElBQU8sVUFBVSxXQUFlLHNDQUFzQyxDQUFDLENBQUM7QUFFeEUsSUFBTyxlQUFlLFdBQWMsNkNBQTZDLENBQUMsQ0FBQztBQUluRixJQUFPLGlCQUFpQixXQUFhLHNEQUFzRCxDQUFDLENBQUM7QUFDN0YsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBT3hGLElBQU8sbUJBQW1CLFdBQWEsZ0RBQWdELENBQUMsQ0FBQztBQUN6RixJQUFPLHFCQUFxQixXQUFZLGtEQUFrRCxD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LENBQUNBO1lBQ1BBLEFBRUFBLDBEQUYwREE7WUFDMURBLDZEQUE2REE7Z0JBQ3pEQSxHQUFHQSxHQUFVQSxZQUFZQSxDQUFDQSxvQkFBb0JBLENBQUNBLE1BQU1BLENBQUNBO1lBQzFEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDbENBLGdCQUFnQkEsQ0FBQ0EsbUJBQW1CQSxJQUFJQSxNQUFNQSxHQUFHQSxZQUFZQSxDQUFDQSx3QkFBd0JBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLEdBQUdBLFlBQVlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFFaEpBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLGNBQWNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLGVBQWVBLENBQUNBO2dCQUNwRUEsZ0JBQWdCQSxDQUFDQSxtQkFBbUJBLElBQUlBLE1BQU1BLEdBQUdBLFlBQVlBLENBQUNBLFFBQVFBLEdBQUdBLEdBQUdBLEdBQUdBLFlBQVlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBO1FBQzlHQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUNGeEMsbUJBQUNBO0FBQURBLENBeDFCQSxBQXcxQkNBLEVBeDFCMEIsZUFBZSxFQXcxQnpDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6InJlbmRlci9SZW5kZXJlckJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpdG1hcERhdGFcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Jhc2UvQml0bWFwRGF0YVwiKTtcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IFBvaW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUG9pbnRcIik7XG5pbXBvcnQgUmVjdGFuZ2xlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1JlY3RhbmdsZVwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IEFic3RyYWN0TWV0aG9kRXJyb3JcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbmltcG9ydCBUZXh0dXJlUHJveHlCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZVByb3h5QmFzZVwiKTtcbmltcG9ydCBCeXRlQXJyYXlcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0J5dGVBcnJheVwiKTtcblxuaW1wb3J0IExpbmVTdWJNZXNoXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0xpbmVTdWJNZXNoXCIpO1xuaW1wb3J0IElNYXRlcmlhbE93bmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JTWF0ZXJpYWxPd25lclwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Yk1lc2hcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViTWVzaFwiKTtcbmltcG9ydCBFbnRpdHlMaXN0SXRlbVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3Bvb2wvRW50aXR5TGlzdEl0ZW1cIik7XG5pbXBvcnQgUmVuZGVyYWJsZVBvb2xcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wb29sL1JlbmRlcmFibGVQb29sXCIpO1xuaW1wb3J0IElFbnRpdHlTb3J0ZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L0lFbnRpdHlTb3J0ZXJcIik7XG5pbXBvcnQgUmVuZGVyYWJsZU1lcmdlU29ydFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9zb3J0L1JlbmRlcmFibGVNZXJnZVNvcnRcIik7XG5pbXBvcnQgSVJlbmRlcmVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9yZW5kZXIvSVJlbmRlcmVyXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQmlsbGJvYXJkXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgSUVudGl0eVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9JRW50aXR5XCIpO1xuaW1wb3J0IFNreWJveFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XG5pbXBvcnQgUmVuZGVyZXJFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9SZW5kZXJlckV2ZW50XCIpO1xuaW1wb3J0IFN0YWdlRXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9TdGFnZUV2ZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBFbnRpdHlDb2xsZWN0b3JcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90cmF2ZXJzZS9FbnRpdHlDb2xsZWN0b3JcIik7XG5pbXBvcnQgSUNvbGxlY3Rvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvdHJhdmVyc2UvSUNvbGxlY3RvclwiKTtcbmltcG9ydCBTaGFkb3dDYXN0ZXJDb2xsZWN0b3JcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3RyYXZlcnNlL1NoYWRvd0Nhc3RlckNvbGxlY3RvclwiKTtcblxuaW1wb3J0IEFHQUxNaW5pQXNzZW1ibGVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FnbHNsL2Fzc2VtYmxlci9BR0FMTWluaUFzc2VtYmxlclwiKTtcbmltcG9ydCBDb250ZXh0R0xDb21wYXJlTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTENvbXBhcmVNb2RlXCIpO1xuaW1wb3J0IElDb250ZXh0R0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvSUNvbnRleHRHTFwiKTtcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IFByb2dyYW1EYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9wb29sL1Byb2dyYW1EYXRhXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBCaWxsYm9hcmRSZW5kZXJhYmxlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvQmlsbGJvYXJkUmVuZGVyYWJsZVwiKTtcbmltcG9ydCBMaW5lU3ViTWVzaFJlbmRlcmFibGVcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvTGluZVN1Yk1lc2hSZW5kZXJhYmxlXCIpO1xuaW1wb3J0IE1hdGVyaWFsRGF0YVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9NYXRlcmlhbERhdGFcIik7XG5pbXBvcnQgTWF0ZXJpYWxEYXRhUG9vbFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvTWF0ZXJpYWxEYXRhUG9vbFwiKTtcbmltcG9ydCBNYXRlcmlhbFBhc3NEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9NYXRlcmlhbFBhc3NEYXRhXCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc0RhdGFQb29sXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvTWF0ZXJpYWxQYXNzRGF0YVBvb2xcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcIik7XG5pbXBvcnQgUlRUQnVmZmVyTWFuYWdlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hbmFnZXJzL1JUVEJ1ZmZlck1hbmFnZXJcIik7XG5pbXBvcnQgTWF0ZXJpYWxHTEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvTWF0ZXJpYWxHTEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgRGVmYXVsdE1hdGVyaWFsTWFuYWdlclx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWFuYWdlcnMvRGVmYXVsdE1hdGVyaWFsTWFuYWdlclwiKTtcblxuLyoqXG4gKiBSZW5kZXJlckJhc2UgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgY2xhc3NlcyB0aGF0IGFyZSB1c2VkIGluIHRoZSByZW5kZXJpbmcgcGlwZWxpbmUgdG8gcmVuZGVyIHRoZVxuICogY29udGVudHMgb2YgYSBwYXJ0aXRpb25cbiAqXG4gKiBAY2xhc3MgYXdheS5yZW5kZXIuUmVuZGVyZXJCYXNlXG4gKi9cbmNsYXNzIFJlbmRlcmVyQmFzZSBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlclxue1xuXHRwcml2YXRlIF9udW1Vc2VkU3RyZWFtczpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9udW1Vc2VkVGV4dHVyZXM6bnVtYmVyID0gMDtcblxuXHRwcml2YXRlIF9tYXRlcmlhbERhdGFQb29sOk1hdGVyaWFsRGF0YVBvb2w7XG5cdHByaXZhdGUgX2JpbGxib2FyZFJlbmRlcmFibGVQb29sOlJlbmRlcmFibGVQb29sO1xuXHRwcml2YXRlIF90cmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlUG9vbDpSZW5kZXJhYmxlUG9vbDtcblx0cHJpdmF0ZSBfbGluZVN1Yk1lc2hSZW5kZXJhYmxlUG9vbDpSZW5kZXJhYmxlUG9vbDtcblxuXHRwdWJsaWMgX3BDb250ZXh0OklDb250ZXh0R0w7XG5cdHB1YmxpYyBfcFN0YWdlOlN0YWdlO1xuXG5cdHB1YmxpYyBfcENhbWVyYTpDYW1lcmE7XG5cdHB1YmxpYyBfaUVudHJ5UG9pbnQ6VmVjdG9yM0Q7XG5cdHB1YmxpYyBfcENhbWVyYUZvcndhcmQ6VmVjdG9yM0Q7XG5cblx0cHVibGljIF9wUnR0QnVmZmVyTWFuYWdlcjpSVFRCdWZmZXJNYW5hZ2VyO1xuXHRwcml2YXRlIF92aWV3UG9ydDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKCk7XG5cdHByaXZhdGUgX3ZpZXdwb3J0RGlydHk6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfc2Npc3NvckRpcnR5OmJvb2xlYW47XG5cblx0cHVibGljIF9wQmFja0J1ZmZlckludmFsaWQ6Ym9vbGVhbiA9IHRydWU7XG5cdHB1YmxpYyBfcERlcHRoVGV4dHVyZUludmFsaWQ6Ym9vbGVhbiA9IHRydWU7XG5cdHB1YmxpYyBfZGVwdGhQcmVwYXNzOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZFI6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEc6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEI6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfYmFja2dyb3VuZEFscGhhOm51bWJlciA9IDE7XG5cdHB1YmxpYyBfc2hhcmVDb250ZXh0OmJvb2xlYW4gPSBmYWxzZTtcblxuXHQvLyBvbmx5IHVzZWQgYnkgcmVuZGVyZXJzIHRoYXQgbmVlZCB0byByZW5kZXIgZ2VvbWV0cnkgdG8gdGV4dHVyZXNcblx0cHVibGljIF93aWR0aDpudW1iZXI7XG5cdHB1YmxpYyBfaGVpZ2h0Om51bWJlcjtcblxuXHRwdWJsaWMgdGV4dHVyZVJhdGlvWDpudW1iZXIgPSAxO1xuXHRwdWJsaWMgdGV4dHVyZVJhdGlvWTpudW1iZXIgPSAxO1xuXG5cdHByaXZhdGUgX3NuYXBzaG90Qml0bWFwRGF0YTpCaXRtYXBEYXRhO1xuXHRwcml2YXRlIF9zbmFwc2hvdFJlcXVpcmVkOmJvb2xlYW47XG5cblx0cHVibGljIF9wUnR0Vmlld1Byb2plY3Rpb25NYXRyaXg6TWF0cml4M0QgPSBuZXcgTWF0cml4M0QoKTtcblxuXHRwcml2YXRlIF9sb2NhbFBvczpQb2ludCA9IG5ldyBQb2ludCgpO1xuXHRwcml2YXRlIF9nbG9iYWxQb3M6UG9pbnQgPSBuZXcgUG9pbnQoKTtcblx0cHVibGljIF9wU2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZSgpO1xuXG5cdHByaXZhdGUgX3NjaXNzb3JVcGRhdGVkOlJlbmRlcmVyRXZlbnQ7XG5cdHByaXZhdGUgX3ZpZXdQb3J0VXBkYXRlZDpSZW5kZXJlckV2ZW50O1xuXG5cdHByaXZhdGUgX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlOkZ1bmN0aW9uO1xuXHRwcml2YXRlIF9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlO1xuXG5cdHB1YmxpYyBfcE51bVRyaWFuZ2xlczpudW1iZXIgPSAwO1xuXG5cdHB1YmxpYyBfcE9wYXF1ZVJlbmRlcmFibGVIZWFkOlJlbmRlcmFibGVCYXNlO1xuXHRwdWJsaWMgX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQ6UmVuZGVyYWJsZUJhc2U7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG51bVRyaWFuZ2xlcygpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BOdW1UcmlhbmdsZXM7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyByZW5kZXJhYmxlU29ydGVyOklFbnRpdHlTb3J0ZXI7XG5cblxuXHQvKipcblx0ICogQSB2aWV3UG9ydCByZWN0YW5nbGUgZXF1aXZhbGVudCBvZiB0aGUgU3RhZ2Ugc2l6ZSBhbmQgcG9zaXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHZpZXdQb3J0KCk6UmVjdGFuZ2xlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdmlld1BvcnQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzY2lzc29yIHJlY3RhbmdsZSBlcXVpdmFsZW50IG9mIHRoZSB2aWV3IHNpemUgYW5kIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBzY2lzc29yUmVjdCgpOlJlY3RhbmdsZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BTY2lzc29yUmVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCB4KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxQb3MueDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgeCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy54ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fZ2xvYmFsUG9zLnggPSB0aGlzLl9sb2NhbFBvcy54ID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9sb2NhbFBvcy55O1xuXHR9XG5cblx0cHVibGljIHNldCB5KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLnkgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9nbG9iYWxQb3MueSA9IHRoaXMuX2xvY2FsUG9zLnkgPSB2YWx1ZTtcblxuXHRcdHRoaXMudXBkYXRlR2xvYmFsUG9zKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBnZXQgd2lkdGgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl93aWR0aDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgd2lkdGgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3dpZHRoID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fd2lkdGggPSB2YWx1ZTtcblx0XHR0aGlzLl9wU2Npc3NvclJlY3Qud2lkdGggPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9wUnR0QnVmZmVyTWFuYWdlcilcblx0XHRcdHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyLnZpZXdXaWR0aCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0XHR0aGlzLl9wRGVwdGhUZXh0dXJlSW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCBoZWlnaHQoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9oZWlnaHQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGhlaWdodCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5faGVpZ2h0ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5faGVpZ2h0ID0gdmFsdWU7XG5cdFx0dGhpcy5fcFNjaXNzb3JSZWN0LmhlaWdodCA9IHZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyKVxuXHRcdFx0dGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIudmlld0hlaWdodCA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0XHR0aGlzLl9wRGVwdGhUZXh0dXJlSW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFJlbmRlcmVyQmFzZSBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSA9IChldmVudDpTdGFnZUV2ZW50KSA9PiB0aGlzLm9uVmlld3BvcnRVcGRhdGVkKGV2ZW50KTtcblxuXHRcdHRoaXMuX21hdGVyaWFsRGF0YVBvb2wgPSBuZXcgTWF0ZXJpYWxEYXRhUG9vbCgpO1xuXG5cdFx0dGhpcy5fYmlsbGJvYXJkUmVuZGVyYWJsZVBvb2wgPSBSZW5kZXJhYmxlUG9vbC5nZXRQb29sKEJpbGxib2FyZFJlbmRlcmFibGUpO1xuXHRcdHRoaXMuX3RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVQb29sID0gUmVuZGVyYWJsZVBvb2wuZ2V0UG9vbChUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlKTtcblx0XHR0aGlzLl9saW5lU3ViTWVzaFJlbmRlcmFibGVQb29sID0gUmVuZGVyYWJsZVBvb2wuZ2V0UG9vbChMaW5lU3ViTWVzaFJlbmRlcmFibGUpO1xuXG5cdFx0dGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUgPSAoZXZlbnQ6RXZlbnQpID0+IHRoaXMub25Db250ZXh0VXBkYXRlKGV2ZW50KTtcblxuXHRcdC8vZGVmYXVsdCBzb3J0aW5nIGFsZ29yaXRobVxuXHRcdHRoaXMucmVuZGVyYWJsZVNvcnRlciA9IG5ldyBSZW5kZXJhYmxlTWVyZ2VTb3J0KCk7XG5cdH1cblxuXG5cdHB1YmxpYyBnZXRQcm9ncmFtKG1hdGVyaWFsUGFzc0RhdGE6TWF0ZXJpYWxQYXNzRGF0YSk6UHJvZ3JhbURhdGFcblx0e1xuXHRcdC8vY2hlY2sga2V5IGRvZXNuJ3QgbmVlZCByZS1jb25jYXRlbmF0aW5nXG5cdFx0aWYgKCFtYXRlcmlhbFBhc3NEYXRhLmtleS5sZW5ndGgpIHtcblx0XHRcdG1hdGVyaWFsUGFzc0RhdGEua2V5ID0gbWF0ZXJpYWxQYXNzRGF0YS5hbmltYXRpb25WZXJ0ZXhDb2RlICtcblx0XHRcdG1hdGVyaWFsUGFzc0RhdGEudmVydGV4Q29kZSArXG5cdFx0XHRcIi0tLVwiICtcblx0XHRcdG1hdGVyaWFsUGFzc0RhdGEuZnJhZ21lbnRDb2RlICtcblx0XHRcdG1hdGVyaWFsUGFzc0RhdGEuYW5pbWF0aW9uRnJhZ21lbnRDb2RlICtcblx0XHRcdG1hdGVyaWFsUGFzc0RhdGEucG9zdEFuaW1hdGlvbkZyYWdtZW50Q29kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG1hdGVyaWFsUGFzc0RhdGEucHJvZ3JhbURhdGE7XG5cdFx0fVxuXG5cdFx0dmFyIHByb2dyYW1EYXRhOlByb2dyYW1EYXRhID0gdGhpcy5fcFN0YWdlLmdldFByb2dyYW1EYXRhKG1hdGVyaWFsUGFzc0RhdGEua2V5KTtcblxuXHRcdC8vY2hlY2sgcHJvZ3JhbSBkYXRhIGhhc24ndCBjaGFuZ2VkLCBrZWVwIGNvdW50IG9mIHByb2dyYW0gdXNhZ2VzXG5cdFx0aWYgKG1hdGVyaWFsUGFzc0RhdGEucHJvZ3JhbURhdGEgIT0gcHJvZ3JhbURhdGEpIHtcblx0XHRcdGlmIChtYXRlcmlhbFBhc3NEYXRhLnByb2dyYW1EYXRhKVxuXHRcdFx0XHRtYXRlcmlhbFBhc3NEYXRhLnByb2dyYW1EYXRhLmRpc3Bvc2UoKTtcblxuXHRcdFx0bWF0ZXJpYWxQYXNzRGF0YS5wcm9ncmFtRGF0YSA9IHByb2dyYW1EYXRhO1xuXG5cdFx0XHRwcm9ncmFtRGF0YS51c2FnZXMrKztcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvZ3JhbURhdGE7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsXG5cdCAqL1xuXHRwdWJsaWMgZ2V0TWF0ZXJpYWwobWF0ZXJpYWw6TWF0ZXJpYWxHTEJhc2UsIHByb2ZpbGU6c3RyaW5nKTpNYXRlcmlhbERhdGFcblx0e1xuXHRcdHZhciBtYXRlcmlhbERhdGE6TWF0ZXJpYWxEYXRhID0gdGhpcy5fbWF0ZXJpYWxEYXRhUG9vbC5nZXRJdGVtKG1hdGVyaWFsKTtcblxuXHRcdGlmIChtYXRlcmlhbERhdGEuaW52YWxpZEFuaW1hdGlvbikge1xuXHRcdFx0bWF0ZXJpYWxEYXRhLmludmFsaWRBbmltYXRpb24gPSBmYWxzZTtcblxuXHRcdFx0dmFyIG1hdGVyaWFsRGF0YVBhc3NlczpBcnJheTxNYXRlcmlhbFBhc3NEYXRhPiA9IG1hdGVyaWFsRGF0YS5nZXRNYXRlcmlhbFBhc3Nlcyhwcm9maWxlKTtcblxuXHRcdFx0dmFyIGVuYWJsZWRHUFVBbmltYXRpb246Ym9vbGVhbiA9IHRoaXMuZ2V0RW5hYmxlZEdQVUFuaW1hdGlvbihtYXRlcmlhbCwgbWF0ZXJpYWxEYXRhUGFzc2VzKTtcblxuXHRcdFx0dmFyIHJlbmRlck9yZGVySWQgPSAwO1xuXHRcdFx0dmFyIG11bHQ6bnVtYmVyID0gMTtcblx0XHRcdHZhciBtYXRlcmlhbFBhc3NEYXRhOk1hdGVyaWFsUGFzc0RhdGE7XG5cdFx0XHR2YXIgbGVuOm51bWJlciA9IG1hdGVyaWFsRGF0YVBhc3Nlcy5sZW5ndGg7XG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRtYXRlcmlhbFBhc3NEYXRhID0gbWF0ZXJpYWxEYXRhUGFzc2VzW2ldO1xuXG5cdFx0XHRcdGlmIChtYXRlcmlhbFBhc3NEYXRhLnVzZXNBbmltYXRpb24gIT0gZW5hYmxlZEdQVUFuaW1hdGlvbikge1xuXHRcdFx0XHRcdG1hdGVyaWFsUGFzc0RhdGEudXNlc0FuaW1hdGlvbiA9IGVuYWJsZWRHUFVBbmltYXRpb247XG5cdFx0XHRcdFx0bWF0ZXJpYWxQYXNzRGF0YS5rZXkgPT0gXCJcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChtYXRlcmlhbFBhc3NEYXRhLmtleSA9PSBcIlwiKVxuXHRcdFx0XHRcdHRoaXMuY2FsY0FuaW1hdGlvbkNvZGUobWF0ZXJpYWwsIG1hdGVyaWFsUGFzc0RhdGEpO1xuXG5cdFx0XHRcdHJlbmRlck9yZGVySWQgKz0gdGhpcy5nZXRQcm9ncmFtKG1hdGVyaWFsUGFzc0RhdGEpLmlkKm11bHQ7XG5cdFx0XHRcdG11bHQgKj0gMTAwMDtcblx0XHRcdH1cblxuXHRcdFx0bWF0ZXJpYWxEYXRhLnJlbmRlck9yZGVySWQgPSByZW5kZXJPcmRlcklkO1xuXHRcdH1cblxuXHRcdHJldHVybiBtYXRlcmlhbERhdGE7XG5cdH1cblxuXHRwdWJsaWMgYWN0aXZhdGVNYXRlcmlhbFBhc3MobWF0ZXJpYWxQYXNzRGF0YTpNYXRlcmlhbFBhc3NEYXRhLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0dmFyIHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlID0gbWF0ZXJpYWxQYXNzRGF0YS5zaGFkZXJPYmplY3Q7XG5cblx0XHQvL2NsZWFyIHVudXNlZCB2ZXJ0ZXggc3RyZWFtc1xuXHRcdGZvciAodmFyIGkgPSBzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXM7IGkgPCB0aGlzLl9udW1Vc2VkU3RyZWFtczsgaSsrKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoaSwgbnVsbCk7XG5cblx0XHQvL2NsZWFyIHVudXNlZCB0ZXh0dXJlIHN0cmVhbXNcblx0XHRmb3IgKHZhciBpID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRUZXh0dXJlczsgaSA8IHRoaXMuX251bVVzZWRUZXh0dXJlczsgaSsrKVxuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VGV4dHVyZUF0KGksIG51bGwpO1xuXG5cdFx0aWYgKG1hdGVyaWFsUGFzc0RhdGEudXNlc0FuaW1hdGlvbilcblx0XHRcdCg8QW5pbWF0aW9uU2V0QmFzZT4gbWF0ZXJpYWxQYXNzRGF0YS5tYXRlcmlhbC5hbmltYXRpb25TZXQpLmFjdGl2YXRlKHNoYWRlck9iamVjdCwgdGhpcy5fcFN0YWdlKTtcblxuXHRcdC8vYWN0aXZhdGUgc2hhZGVyIG9iamVjdFxuXHRcdHNoYWRlck9iamVjdC5pQWN0aXZhdGUodGhpcy5fcFN0YWdlLCBjYW1lcmEpO1xuXG5cdFx0Ly9jaGVjayBwcm9ncmFtIGRhdGEgaXMgdXBsb2FkZWRcblx0XHR2YXIgcHJvZ3JhbURhdGE6UHJvZ3JhbURhdGEgPSB0aGlzLmdldFByb2dyYW0obWF0ZXJpYWxQYXNzRGF0YSk7XG5cblx0XHRpZiAoIXByb2dyYW1EYXRhLnByb2dyYW0pIHtcblx0XHRcdHByb2dyYW1EYXRhLnByb2dyYW0gPSB0aGlzLl9wQ29udGV4dC5jcmVhdGVQcm9ncmFtKCk7XG5cdFx0XHR2YXIgdmVydGV4Qnl0ZUNvZGU6Qnl0ZUFycmF5ID0gKG5ldyBBR0FMTWluaUFzc2VtYmxlcigpLmFzc2VtYmxlKFwicGFydCB2ZXJ0ZXggMVxcblwiICsgbWF0ZXJpYWxQYXNzRGF0YS5hbmltYXRpb25WZXJ0ZXhDb2RlICsgbWF0ZXJpYWxQYXNzRGF0YS52ZXJ0ZXhDb2RlICsgXCJlbmRwYXJ0XCIpKVsndmVydGV4J10uZGF0YTtcblx0XHRcdHZhciBmcmFnbWVudEJ5dGVDb2RlOkJ5dGVBcnJheSA9IChuZXcgQUdBTE1pbmlBc3NlbWJsZXIoKS5hc3NlbWJsZShcInBhcnQgZnJhZ21lbnQgMVxcblwiICsgbWF0ZXJpYWxQYXNzRGF0YS5mcmFnbWVudENvZGUgKyBtYXRlcmlhbFBhc3NEYXRhLmFuaW1hdGlvbkZyYWdtZW50Q29kZSArIG1hdGVyaWFsUGFzc0RhdGEucG9zdEFuaW1hdGlvbkZyYWdtZW50Q29kZSArIFwiZW5kcGFydFwiKSlbJ2ZyYWdtZW50J10uZGF0YTtcblx0XHRcdHByb2dyYW1EYXRhLnByb2dyYW0udXBsb2FkKHZlcnRleEJ5dGVDb2RlLCBmcmFnbWVudEJ5dGVDb2RlKTtcblx0XHR9XG5cblx0XHQvL3NldCBwcm9ncmFtIGRhdGFcblx0XHR0aGlzLl9wQ29udGV4dC5zZXRQcm9ncmFtKHByb2dyYW1EYXRhLnByb2dyYW0pO1xuXHR9XG5cblx0cHVibGljIGRlYWN0aXZhdGVNYXRlcmlhbFBhc3MobWF0ZXJpYWxQYXNzRGF0YTpNYXRlcmlhbFBhc3NEYXRhKVxuXHR7XG5cdFx0dmFyIHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlID0gbWF0ZXJpYWxQYXNzRGF0YS5zaGFkZXJPYmplY3Q7XG5cblx0XHRpZiAobWF0ZXJpYWxQYXNzRGF0YS51c2VzQW5pbWF0aW9uKVxuXHRcdFx0KDxBbmltYXRpb25TZXRCYXNlPiBtYXRlcmlhbFBhc3NEYXRhLm1hdGVyaWFsLmFuaW1hdGlvblNldCkuZGVhY3RpdmF0ZShzaGFkZXJPYmplY3QsIHRoaXMuX3BTdGFnZSk7XG5cblx0XHRtYXRlcmlhbFBhc3NEYXRhLnNoYWRlck9iamVjdC5pRGVhY3RpdmF0ZSh0aGlzLl9wU3RhZ2UpO1xuXG5cdFx0dGhpcy5fbnVtVXNlZFN0cmVhbXMgPSBzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXM7XG5cdFx0dGhpcy5fbnVtVXNlZFRleHR1cmVzID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRUZXh0dXJlcztcblx0fVxuXG5cdHB1YmxpYyBfaUNyZWF0ZUVudGl0eUNvbGxlY3RvcigpOklDb2xsZWN0b3Jcblx0e1xuXHRcdHJldHVybiBuZXcgRW50aXR5Q29sbGVjdG9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyByZWQgY29tcG9uZW50LCB1c2VkIHdoZW4gY2xlYXJpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IF9pQmFja2dyb3VuZFIoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kUjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgX2lCYWNrZ3JvdW5kUih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZFIgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9iYWNrZ3JvdW5kUiA9IHZhbHVlO1xuXG5cdFx0dGhpcy5fcEJhY2tCdWZmZXJJbnZhbGlkID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYmFja2dyb3VuZCBjb2xvcidzIGdyZWVuIGNvbXBvbmVudCwgdXNlZCB3aGVuIGNsZWFyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRHKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEc7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZEcodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRHID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZEcgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGJhY2tncm91bmQgY29sb3IncyBibHVlIGNvbXBvbmVudCwgdXNlZCB3aGVuIGNsZWFyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGdldCBfaUJhY2tncm91bmRCKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEI7XG5cdH1cblxuXHRwdWJsaWMgc2V0IF9pQmFja2dyb3VuZEIodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JhY2tncm91bmRCID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZEIgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IGNvbnRleHQoKTpJQ29udGV4dEdMXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcENvbnRleHQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIFN0YWdlIHRoYXQgd2lsbCBwcm92aWRlIHRoZSBDb250ZXh0R0wgdXNlZCBmb3IgcmVuZGVyaW5nLlxuXHQgKi9cblx0cHVibGljIGdldCBzdGFnZSgpOlN0YWdlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcFN0YWdlO1xuXHR9XG5cblx0cHVibGljIHNldCBzdGFnZSh2YWx1ZTpTdGFnZSlcblx0e1xuXHRcdGlmICh2YWx1ZSA9PSB0aGlzLl9wU3RhZ2UpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLmlTZXRTdGFnZSh2YWx1ZSk7XG5cdH1cblxuXHRwdWJsaWMgaVNldFN0YWdlKHZhbHVlOlN0YWdlKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BTdGFnZSkge1xuXHRcdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX0NSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuQ09OVEVYVF9SRUNSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHRcdHRoaXMuX3BTdGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFN0YWdlRXZlbnQuVklFV1BPUlRfVVBEQVRFRCwgdGhpcy5fb25WaWV3cG9ydFVwZGF0ZWREZWxlZ2F0ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKCF2YWx1ZSkge1xuXHRcdFx0dGhpcy5fcFN0YWdlID0gbnVsbDtcblx0XHRcdHRoaXMuX3BDb250ZXh0ID0gbnVsbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcFN0YWdlID0gdmFsdWU7XG5cdFx0XHR0aGlzLl9wU3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX1JFQ1JFQVRFRCwgdGhpcy5fb25Db250ZXh0VXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0dGhpcy5fcFN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5WSUVXUE9SVF9VUERBVEVELCB0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlKTtcblxuXHRcdFx0Lypcblx0XHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxuXHRcdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5zdGFnZSA9IHZhbHVlO1xuXHRcdFx0ICovXG5cdFx0XHRpZiAodGhpcy5fcFN0YWdlLmNvbnRleHQpXG5cdFx0XHRcdHRoaXMuX3BDb250ZXh0ID0gPElDb250ZXh0R0w+IHRoaXMuX3BTdGFnZS5jb250ZXh0O1xuXHRcdH1cblxuXHRcdHRoaXMuX3BCYWNrQnVmZmVySW52YWxpZCA9IHRydWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmVycyBjb250cm9sIG9mIENvbnRleHRHTCBjbGVhcigpIGFuZCBwcmVzZW50KCkgY2FsbHMgdG8gU3RhZ2UsIGVuYWJsaW5nIG11bHRpcGxlIFN0YWdlIGZyYW1ld29ya3Ncblx0ICogdG8gc2hhcmUgdGhlIHNhbWUgQ29udGV4dEdMIG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2hhcmVDb250ZXh0KCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NoYXJlQ29udGV4dDtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc2hhcmVDb250ZXh0KHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0ID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fc2hhcmVDb250ZXh0ID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFBvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc3Bvc2VzIHRoZSByZXNvdXJjZXMgdXNlZCBieSB0aGUgUmVuZGVyZXJCYXNlLlxuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BSdHRCdWZmZXJNYW5hZ2VyKVxuXHRcdFx0dGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIuZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5fcFJ0dEJ1ZmZlck1hbmFnZXIgPSBudWxsO1xuXG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5DT05URVhUX0NSRUFURUQsIHRoaXMuX29uQ29udGV4dFVwZGF0ZURlbGVnYXRlKTtcblx0XHR0aGlzLl9wU3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihTdGFnZUV2ZW50LkNPTlRFWFRfUkVDUkVBVEVELCB0aGlzLl9vbkNvbnRleHRVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0dGhpcy5fcFN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoU3RhZ2VFdmVudC5WSUVXUE9SVF9VUERBVEVELCB0aGlzLl9vblZpZXdwb3J0VXBkYXRlZERlbGVnYXRlKTtcblxuXHRcdHRoaXMuX3BTdGFnZSA9IG51bGw7XG5cblx0XHQvKlxuXHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKSB7XG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlci5kaXNwb3NlKCk7XG5cdFx0IF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciA9IG51bGw7XG5cdFx0IH1cblx0XHQgKi9cblx0fVxuXG5cdHB1YmxpYyByZW5kZXIoZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IpXG5cdHtcblx0XHR0aGlzLl92aWV3cG9ydERpcnR5ID0gZmFsc2U7XG5cdFx0dGhpcy5fc2Npc3NvckRpcnR5ID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgcG90ZW50aWFsbHkgdmlzaWJsZSBnZW9tZXRyeSB0byB0aGUgYmFjayBidWZmZXIgb3IgdGV4dHVyZS5cblx0ICogQHBhcmFtIGVudGl0eUNvbGxlY3RvciBUaGUgRW50aXR5Q29sbGVjdG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5LlxuXHQgKiBAcGFyYW0gdGFyZ2V0IEFuIG9wdGlvbiB0YXJnZXQgdGV4dHVyZSB0byByZW5kZXIgdG8uXG5cdCAqIEBwYXJhbSBzdXJmYWNlU2VsZWN0b3IgVGhlIGluZGV4IG9mIGEgQ3ViZVRleHR1cmUncyBmYWNlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIGFkZGl0aW9uYWxDbGVhck1hc2sgQWRkaXRpb25hbCBjbGVhciBtYXNrIGluZm9ybWF0aW9uLCBpbiBjYXNlIGV4dHJhIGNsZWFyIGNoYW5uZWxzIGFyZSB0byBiZSBvbWl0dGVkLlxuXHQgKi9cblx0cHVibGljIF9pUmVuZGVyKGVudGl0eUNvbGxlY3RvcjpJQ29sbGVjdG9yLCB0YXJnZXQ6VGV4dHVyZVByb3h5QmFzZSA9IG51bGwsIHNjaXNzb3JSZWN0OlJlY3RhbmdsZSA9IG51bGwsIHN1cmZhY2VTZWxlY3RvcjpudW1iZXIgPSAwKVxuXHR7XG5cdFx0Ly9UT0RPIHJlZmFjdG9yIHNldFRhcmdldCBzbyB0aGF0IHJlbmRlcnRleHR1cmVzIGFyZSBjcmVhdGVkIGJlZm9yZSB0aGlzIGNoZWNrXG5cdFx0aWYgKCF0aGlzLl9wU3RhZ2UgfHwgIXRoaXMuX3BDb250ZXh0KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcFJ0dFZpZXdQcm9qZWN0aW9uTWF0cml4LmNvcHlGcm9tKGVudGl0eUNvbGxlY3Rvci5jYW1lcmEudmlld1Byb2plY3Rpb24pO1xuXHRcdHRoaXMuX3BSdHRWaWV3UHJvamVjdGlvbk1hdHJpeC5hcHBlbmRTY2FsZSh0aGlzLnRleHR1cmVSYXRpb1gsIHRoaXMudGV4dHVyZVJhdGlvWSwgMSk7XG5cblx0XHR0aGlzLnBFeGVjdXRlUmVuZGVyKGVudGl0eUNvbGxlY3RvciwgdGFyZ2V0LCBzY2lzc29yUmVjdCwgc3VyZmFjZVNlbGVjdG9yKTtcblxuXHRcdC8vIGdlbmVyYXRlIG1pcCBtYXBzIG9uIHRhcmdldCAoaWYgdGFyZ2V0IGV4aXN0cykgLy9UT0RPXG5cdFx0Ly9pZiAodGFyZ2V0KVxuXHRcdC8vXHQoPFRleHR1cmU+dGFyZ2V0KS5nZW5lcmF0ZU1pcG1hcHMoKTtcblxuXHRcdC8vIGNsZWFyIGJ1ZmZlcnNcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCA4OyArK2kpIHtcblx0XHRcdHRoaXMuX3BDb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xuXHRcdFx0dGhpcy5fcENvbnRleHQuc2V0VGV4dHVyZUF0KGksIG51bGwpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBfaVJlbmRlckNhc2NhZGVzKGVudGl0eUNvbGxlY3RvcjpTaGFkb3dDYXN0ZXJDb2xsZWN0b3IsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlLCBudW1DYXNjYWRlczpudW1iZXIsIHNjaXNzb3JSZWN0czpBcnJheTxSZWN0YW5nbGU+LCBjYW1lcmFzOkFycmF5PENhbWVyYT4pXG5cdHtcblxuXHR9XG5cblx0cHVibGljIHBDb2xsZWN0UmVuZGVyYWJsZXMoZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IpXG5cdHtcblx0XHQvL3Jlc2V0IGhlYWQgdmFsdWVzXG5cdFx0dGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZCA9IG51bGw7XG5cdFx0dGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkID0gbnVsbDtcblx0XHR0aGlzLl9wTnVtVHJpYW5nbGVzID0gMDtcblxuXHRcdC8vZ3JhYiBlbnRpdHkgaGVhZFxuXHRcdHZhciBpdGVtOkVudGl0eUxpc3RJdGVtID0gZW50aXR5Q29sbGVjdG9yLmVudGl0eUhlYWQ7XG5cblx0XHQvL3NldCB0ZW1wIHZhbHVlcyBmb3IgZW50cnkgcG9pbnQgYW5kIGNhbWVyYSBmb3J3YXJkIHZlY3RvclxuXHRcdHRoaXMuX3BDYW1lcmEgPSBlbnRpdHlDb2xsZWN0b3IuY2FtZXJhO1xuXHRcdHRoaXMuX2lFbnRyeVBvaW50ID0gdGhpcy5fcENhbWVyYS5zY2VuZVBvc2l0aW9uO1xuXHRcdHRoaXMuX3BDYW1lcmFGb3J3YXJkID0gdGhpcy5fcENhbWVyYS50cmFuc2Zvcm0uZm9yd2FyZFZlY3RvcjtcblxuXHRcdC8vaXRlcmF0ZSB0aHJvdWdoIGFsbCBlbnRpdGllc1xuXHRcdHdoaWxlIChpdGVtKSB7XG5cdFx0XHRpdGVtLmVudGl0eS5faUNvbGxlY3RSZW5kZXJhYmxlcyh0aGlzKTtcblx0XHRcdGl0ZW0gPSBpdGVtLm5leHQ7XG5cdFx0fVxuXG5cdFx0Ly9zb3J0IHRoZSByZXN1bHRpbmcgcmVuZGVyYWJsZXNcblx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSA8UmVuZGVyYWJsZUJhc2U+IHRoaXMucmVuZGVyYWJsZVNvcnRlci5zb3J0T3BhcXVlUmVuZGVyYWJsZXModGhpcy5fcE9wYXF1ZVJlbmRlcmFibGVIZWFkKTtcblx0XHR0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkID0gPFJlbmRlcmFibGVCYXNlPiB0aGlzLnJlbmRlcmFibGVTb3J0ZXIuc29ydEJsZW5kZWRSZW5kZXJhYmxlcyh0aGlzLl9wQmxlbmRlZFJlbmRlcmFibGVIZWFkKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIHRoZSBwb3RlbnRpYWxseSB2aXNpYmxlIGdlb21ldHJ5IHRvIHRoZSBiYWNrIGJ1ZmZlciBvciB0ZXh0dXJlLiBPbmx5IGV4ZWN1dGVkIGlmIGV2ZXJ5dGhpbmcgaXMgc2V0IHVwLlxuXHQgKlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkuXG5cdCAqIEBwYXJhbSB0YXJnZXQgQW4gb3B0aW9uIHRhcmdldCB0ZXh0dXJlIHRvIHJlbmRlciB0by5cblx0ICogQHBhcmFtIHN1cmZhY2VTZWxlY3RvciBUaGUgaW5kZXggb2YgYSBDdWJlVGV4dHVyZSdzIGZhY2UgdG8gcmVuZGVyIHRvLlxuXHQgKiBAcGFyYW0gYWRkaXRpb25hbENsZWFyTWFzayBBZGRpdGlvbmFsIGNsZWFyIG1hc2sgaW5mb3JtYXRpb24sIGluIGNhc2UgZXh0cmEgY2xlYXIgY2hhbm5lbHMgYXJlIHRvIGJlIG9taXR0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgcEV4ZWN1dGVSZW5kZXIoZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlID0gbnVsbCwgc2Npc3NvclJlY3Q6UmVjdGFuZ2xlID0gbnVsbCwgc3VyZmFjZVNlbGVjdG9yOm51bWJlciA9IDApXG5cdHtcblx0XHR0aGlzLl9wU3RhZ2Uuc2V0UmVuZGVyVGFyZ2V0KHRhcmdldCwgdHJ1ZSwgc3VyZmFjZVNlbGVjdG9yKTtcblxuXHRcdGlmICgodGFyZ2V0IHx8ICF0aGlzLl9zaGFyZUNvbnRleHQpICYmICF0aGlzLl9kZXB0aFByZXBhc3MpXG5cdFx0XHR0aGlzLl9wQ29udGV4dC5jbGVhcih0aGlzLl9iYWNrZ3JvdW5kUiwgdGhpcy5fYmFja2dyb3VuZEcsIHRoaXMuX2JhY2tncm91bmRCLCB0aGlzLl9iYWNrZ3JvdW5kQWxwaGEsIDEsIDApO1xuXG5cdFx0dGhpcy5fcENvbnRleHQuc2V0RGVwdGhUZXN0KGZhbHNlLCBDb250ZXh0R0xDb21wYXJlTW9kZS5BTFdBWVMpO1xuXG5cdFx0dGhpcy5fcFN0YWdlLnNjaXNzb3JSZWN0ID0gc2Npc3NvclJlY3Q7XG5cblx0XHQvKlxuXHRcdCBpZiAoX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxuXHRcdCBfYmFja2dyb3VuZEltYWdlUmVuZGVyZXIucmVuZGVyKCk7XG5cdFx0ICovXG5cblx0XHR0aGlzLnBEcmF3KGVudGl0eUNvbGxlY3RvciwgdGFyZ2V0KTtcblxuXHRcdC8vbGluZSByZXF1aXJlZCBmb3IgY29ycmVjdCByZW5kZXJpbmcgd2hlbiB1c2luZyBhd2F5M2Qgd2l0aCBzdGFybGluZy4gRE8gTk9UIFJFTU9WRSBVTkxFU1MgU1RBUkxJTkcgSU5URUdSQVRJT04gSVMgUkVURVNURUQhXG5cdFx0Ly90aGlzLl9wQ29udGV4dC5zZXREZXB0aFRlc3QoZmFsc2UsIENvbnRleHRHTENvbXBhcmVNb2RlLkxFU1NfRVFVQUwpOyAvL29vcHNpZVxuXG5cdFx0aWYgKCF0aGlzLl9zaGFyZUNvbnRleHQpIHtcblx0XHRcdGlmICh0aGlzLl9zbmFwc2hvdFJlcXVpcmVkICYmIHRoaXMuX3NuYXBzaG90Qml0bWFwRGF0YSkge1xuXHRcdFx0XHR0aGlzLl9wQ29udGV4dC5kcmF3VG9CaXRtYXBEYXRhKHRoaXMuX3NuYXBzaG90Qml0bWFwRGF0YSk7XG5cdFx0XHRcdHRoaXMuX3NuYXBzaG90UmVxdWlyZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9wU3RhZ2Uuc2Npc3NvclJlY3QgPSBudWxsO1xuXHR9XG5cblx0Lypcblx0ICogV2lsbCBkcmF3IHRoZSByZW5kZXJlcidzIG91dHB1dCBvbiBuZXh0IHJlbmRlciB0byB0aGUgcHJvdmlkZWQgYml0bWFwIGRhdGEuXG5cdCAqICovXG5cdHB1YmxpYyBxdWV1ZVNuYXBzaG90KGJtZDpCaXRtYXBEYXRhKVxuXHR7XG5cdFx0dGhpcy5fc25hcHNob3RSZXF1aXJlZCA9IHRydWU7XG5cdFx0dGhpcy5fc25hcHNob3RCaXRtYXBEYXRhID0gYm1kO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBlcmZvcm1zIHRoZSBhY3R1YWwgZHJhd2luZyBvZiBnZW9tZXRyeSB0byB0aGUgdGFyZ2V0LlxuXHQgKiBAcGFyYW0gZW50aXR5Q29sbGVjdG9yIFRoZSBFbnRpdHlDb2xsZWN0b3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBvdGVudGlhbGx5IHZpc2libGUgZ2VvbWV0cnkuXG5cdCAqL1xuXHRwdWJsaWMgcERyYXcoZW50aXR5Q29sbGVjdG9yOklDb2xsZWN0b3IsIHRhcmdldDpUZXh0dXJlUHJveHlCYXNlKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBc3NpZ24gdGhlIGNvbnRleHQgb25jZSByZXRyaWV2ZWRcblx0ICovXG5cdHByaXZhdGUgb25Db250ZXh0VXBkYXRlKGV2ZW50OkV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fcENvbnRleHQgPSA8SUNvbnRleHRHTD4gdGhpcy5fcFN0YWdlLmNvbnRleHQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IF9pQmFja2dyb3VuZEFscGhhKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmFja2dyb3VuZEFscGhhO1xuXHR9XG5cblx0cHVibGljIHNldCBfaUJhY2tncm91bmRBbHBoYSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHRpZiAodGhpcy5fYmFja2dyb3VuZEFscGhhID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYmFja2dyb3VuZEFscGhhID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wQmFja0J1ZmZlckludmFsaWQgPSB0cnVlO1xuXHR9XG5cblx0Lypcblx0IHB1YmxpYyBnZXQgaUJhY2tncm91bmQoKTpUZXh0dXJlMkRCYXNlXG5cdCB7XG5cdCByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcblx0IH1cblx0ICovXG5cblx0Lypcblx0IHB1YmxpYyBzZXQgaUJhY2tncm91bmQodmFsdWU6VGV4dHVyZTJEQmFzZSlcblx0IHtcblx0IGlmICh0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciAmJiAhdmFsdWUpIHtcblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyLmRpc3Bvc2UoKTtcblx0IHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyID0gbnVsbDtcblx0IH1cblxuXHQgaWYgKCF0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlciAmJiB2YWx1ZSlcblx0IHtcblxuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIgPSBuZXcgQmFja2dyb3VuZEltYWdlUmVuZGVyZXIodGhpcy5fcFN0YWdlKTtcblxuXHQgfVxuXG5cblx0IHRoaXMuX2JhY2tncm91bmQgPSB2YWx1ZTtcblxuXHQgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZVJlbmRlcmVyKVxuXHQgdGhpcy5fYmFja2dyb3VuZEltYWdlUmVuZGVyZXIudGV4dHVyZSA9IHZhbHVlO1xuXHQgfVxuXHQgKi9cblx0Lypcblx0IHB1YmxpYyBnZXQgYmFja2dyb3VuZEltYWdlUmVuZGVyZXIoKTpCYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlclxuXHQge1xuXHQgcmV0dXJuIF9iYWNrZ3JvdW5kSW1hZ2VSZW5kZXJlcjtcblx0IH1cblx0ICovXG5cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgbm90aWZ5U2Npc3NvclVwZGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fc2Npc3NvckRpcnR5KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fc2Npc3NvckRpcnR5ID0gdHJ1ZTtcblxuXHRcdGlmICghdGhpcy5fc2Npc3NvclVwZGF0ZWQpXG5cdFx0XHR0aGlzLl9zY2lzc29yVXBkYXRlZCA9IG5ldyBSZW5kZXJlckV2ZW50KFJlbmRlcmVyRXZlbnQuU0NJU1NPUl9VUERBVEVEKTtcblxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9zY2lzc29yVXBkYXRlZCk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBub3RpZnlWaWV3cG9ydFVwZGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fdmlld3BvcnREaXJ0eSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3ZpZXdwb3J0RGlydHkgPSB0cnVlO1xuXG5cdFx0aWYgKCF0aGlzLl92aWV3UG9ydFVwZGF0ZWQpXG5cdFx0XHR0aGlzLl92aWV3UG9ydFVwZGF0ZWQgPSBuZXcgUmVuZGVyZXJFdmVudChSZW5kZXJlckV2ZW50LlZJRVdQT1JUX1VQREFURUQpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3ZpZXdQb3J0VXBkYXRlZCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBvblZpZXdwb3J0VXBkYXRlZChldmVudDpTdGFnZUV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fdmlld1BvcnQgPSB0aGlzLl9wU3RhZ2Uudmlld1BvcnQ7XG5cdFx0Ly9UT0RPIHN0b3AgZmlyaW5nIHZpZXdwb3J0IHVwZGF0ZWQgZm9yIGV2ZXJ5IHN0YWdlZ2wgdmlld3BvcnQgY2hhbmdlXG5cblx0XHRpZiAodGhpcy5fc2hhcmVDb250ZXh0KSB7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueCA9IHRoaXMuX2dsb2JhbFBvcy54IC0gdGhpcy5fcFN0YWdlLng7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IHRoaXMuX2dsb2JhbFBvcy55IC0gdGhpcy5fcFN0YWdlLnk7XG5cdFx0XHR0aGlzLm5vdGlmeVNjaXNzb3JVcGRhdGUoKTtcblx0XHR9XG5cblx0XHR0aGlzLm5vdGlmeVZpZXdwb3J0VXBkYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxQb3MoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NoYXJlQ29udGV4dCkge1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnggPSB0aGlzLl9nbG9iYWxQb3MueCAtIHRoaXMuX3ZpZXdQb3J0Lng7XG5cdFx0XHR0aGlzLl9wU2Npc3NvclJlY3QueSA9IHRoaXMuX2dsb2JhbFBvcy55IC0gdGhpcy5fdmlld1BvcnQueTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnggPSAwO1xuXHRcdFx0dGhpcy5fcFNjaXNzb3JSZWN0LnkgPSAwO1xuXHRcdFx0dGhpcy5fdmlld1BvcnQueCA9IHRoaXMuX2dsb2JhbFBvcy54O1xuXHRcdFx0dGhpcy5fdmlld1BvcnQueSA9IHRoaXMuX2dsb2JhbFBvcy55O1xuXHRcdH1cblxuXHRcdHRoaXMubm90aWZ5U2Npc3NvclVwZGF0ZSgpO1xuXHR9XG5cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIGJpbGxib2FyZFxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwdWJsaWMgYXBwbHlCaWxsYm9hcmQoYmlsbGJvYXJkOkJpbGxib2FyZClcblx0e1xuXHRcdHRoaXMuX2FwcGx5UmVuZGVyYWJsZSg8UmVuZGVyYWJsZUJhc2U+IHRoaXMuX2JpbGxib2FyZFJlbmRlcmFibGVQb29sLmdldEl0ZW0oYmlsbGJvYXJkKSk7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHRyaWFuZ2xlU3ViTWVzaFxuXHQgKi9cblx0cHVibGljIGFwcGx5VHJpYW5nbGVTdWJNZXNoKHRyaWFuZ2xlU3ViTWVzaDpUcmlhbmdsZVN1Yk1lc2gpXG5cdHtcblx0XHR0aGlzLl9hcHBseVJlbmRlcmFibGUoPFJlbmRlcmFibGVCYXNlPiB0aGlzLl90cmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlUG9vbC5nZXRJdGVtKHRyaWFuZ2xlU3ViTWVzaCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBsaW5lU3ViTWVzaFxuXHQgKi9cblx0cHVibGljIGFwcGx5TGluZVN1Yk1lc2gobGluZVN1Yk1lc2g6TGluZVN1Yk1lc2gpXG5cdHtcblx0XHR0aGlzLl9hcHBseVJlbmRlcmFibGUoPFJlbmRlcmFibGVCYXNlPiB0aGlzLl9saW5lU3ViTWVzaFJlbmRlcmFibGVQb29sLmdldEl0ZW0obGluZVN1Yk1lc2gpKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gcmVuZGVyYWJsZVxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRwcml2YXRlIF9hcHBseVJlbmRlcmFibGUocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSlcblx0e1xuXHRcdHZhciBtYXRlcmlhbDpNYXRlcmlhbEdMQmFzZSA9IDxNYXRlcmlhbEdMQmFzZT4gcmVuZGVyYWJsZS5tYXRlcmlhbE93bmVyLm1hdGVyaWFsO1xuXHRcdHZhciBlbnRpdHk6SUVudGl0eSA9IHJlbmRlcmFibGUuc291cmNlRW50aXR5O1xuXHRcdHZhciBwb3NpdGlvbjpWZWN0b3IzRCA9IGVudGl0eS5zY2VuZVBvc2l0aW9uO1xuXG5cdFx0aWYgKCFtYXRlcmlhbClcblx0XHRcdG1hdGVyaWFsID0gRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0TWF0ZXJpYWwocmVuZGVyYWJsZS5tYXRlcmlhbE93bmVyKTtcblxuXHRcdC8vdXBkYXRlIG1hdGVyaWFsIGlmIGludmFsaWRhdGVkXG5cdFx0bWF0ZXJpYWwuX2lVcGRhdGVNYXRlcmlhbCgpO1xuXG5cdFx0Ly9zZXQgaWRzIGZvciBmYXN0ZXIgcmVmZXJlbmNpbmdcblx0XHRyZW5kZXJhYmxlLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG5cdFx0cmVuZGVyYWJsZS5tYXRlcmlhbElkID0gbWF0ZXJpYWwuX2lNYXRlcmlhbElkO1xuXHRcdHJlbmRlcmFibGUucmVuZGVyT3JkZXJJZCA9IHRoaXMuZ2V0TWF0ZXJpYWwobWF0ZXJpYWwsIHRoaXMuX3BTdGFnZS5wcm9maWxlKS5yZW5kZXJPcmRlcklkO1xuXHRcdHJlbmRlcmFibGUuY2FzY2FkZWQgPSBmYWxzZTtcblxuXHRcdC8vIHByb2plY3Qgb250byBjYW1lcmEncyB6LWF4aXNcblx0XHRwb3NpdGlvbiA9IHRoaXMuX2lFbnRyeVBvaW50LnN1YnRyYWN0KHBvc2l0aW9uKTtcblx0XHRyZW5kZXJhYmxlLnpJbmRleCA9IGVudGl0eS56T2Zmc2V0ICsgcG9zaXRpb24uZG90UHJvZHVjdCh0aGlzLl9wQ2FtZXJhRm9yd2FyZCk7XG5cblx0XHQvL3N0b3JlIHJlZmVyZW5jZSB0byBzY2VuZSB0cmFuc2Zvcm1cblx0XHRyZW5kZXJhYmxlLnJlbmRlclNjZW5lVHJhbnNmb3JtID0gcmVuZGVyYWJsZS5zb3VyY2VFbnRpdHkuZ2V0UmVuZGVyU2NlbmVUcmFuc2Zvcm0odGhpcy5fcENhbWVyYSk7XG5cblx0XHRpZiAobWF0ZXJpYWwucmVxdWlyZXNCbGVuZGluZykge1xuXHRcdFx0cmVuZGVyYWJsZS5uZXh0ID0gdGhpcy5fcEJsZW5kZWRSZW5kZXJhYmxlSGVhZDtcblx0XHRcdHRoaXMuX3BCbGVuZGVkUmVuZGVyYWJsZUhlYWQgPSByZW5kZXJhYmxlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW5kZXJhYmxlLm5leHQgPSB0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQ7XG5cdFx0XHR0aGlzLl9wT3BhcXVlUmVuZGVyYWJsZUhlYWQgPSByZW5kZXJhYmxlO1xuXHRcdH1cblxuXHRcdHRoaXMuX3BOdW1UcmlhbmdsZXMgKz0gcmVuZGVyYWJsZS5udW1UcmlhbmdsZXM7XG5cblx0XHQvL2hhbmRsZSBhbnkgb3ZlcmZsb3cgZm9yIHJlbmRlcmFibGVzIHdpdGggZGF0YSB0aGF0IGV4Y2VlZHMgR1BVIGxpbWl0YXRpb25zXG5cdFx0aWYgKHJlbmRlcmFibGUub3ZlcmZsb3cpXG5cdFx0XHR0aGlzLl9hcHBseVJlbmRlcmFibGUocmVuZGVyYWJsZS5vdmVyZmxvdyk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiB0ZXN0IGlmIGFuaW1hdGlvbiB3aWxsIGJlIGFibGUgdG8gcnVuIG9uIGdwdSBCRUZPUkUgY29tcGlsaW5nIG1hdGVyaWFsc1xuXHQgKiB0ZXN0IGlmIHRoZSBzaGFkZXIgb2JqZWN0cyBzdXBwb3J0cyBhbmltYXRpbmcgdGhlIGFuaW1hdGlvbiBzZXQgaW4gdGhlIHZlcnRleCBzaGFkZXJcblx0ICogaWYgYW55IG9iamVjdCB1c2luZyB0aGlzIG1hdGVyaWFsIGZhaWxzIHRvIHN1cHBvcnQgYWNjZWxlcmF0ZWQgYW5pbWF0aW9ucyBmb3IgYW55IG9mIHRoZSBzaGFkZXIgb2JqZWN0cyxcblx0ICogd2Ugc2hvdWxkIGRvIGV2ZXJ5dGhpbmcgb24gY3B1IChvdGhlcndpc2Ugd2UgaGF2ZSB0aGUgY29zdCBvZiBib3RoIGdwdSArIGNwdSBhbmltYXRpb25zKVxuXHQgKi9cblx0cHJpdmF0ZSBnZXRFbmFibGVkR1BVQW5pbWF0aW9uKG1hdGVyaWFsOk1hdGVyaWFsQmFzZSwgbWF0ZXJpYWxEYXRhUGFzc2VzOkFycmF5PE1hdGVyaWFsUGFzc0RhdGE+KTpib29sZWFuXG5cdHtcblx0XHRpZiAobWF0ZXJpYWwuYW5pbWF0aW9uU2V0KSB7XG5cdFx0XHRtYXRlcmlhbC5hbmltYXRpb25TZXQucmVzZXRHUFVDb21wYXRpYmlsaXR5KCk7XG5cblx0XHRcdHZhciBvd25lcnM6QXJyYXk8SU1hdGVyaWFsT3duZXI+ID0gbWF0ZXJpYWwuaU93bmVycztcblx0XHRcdHZhciBudW1Pd25lcnM6bnVtYmVyID0gb3duZXJzLmxlbmd0aDtcblxuXHRcdFx0dmFyIGxlbjpudW1iZXIgPSBtYXRlcmlhbERhdGFQYXNzZXMubGVuZ3RoO1xuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyBpKyspXG5cdFx0XHRcdGZvciAodmFyIGo6bnVtYmVyID0gMDsgaiA8IG51bU93bmVyczsgaisrKVxuXHRcdFx0XHRcdGlmIChvd25lcnNbal0uYW5pbWF0b3IpXG5cdFx0XHRcdFx0XHQoPEFuaW1hdG9yQmFzZT4gb3duZXJzW2pdLmFuaW1hdG9yKS50ZXN0R1BVQ29tcGF0aWJpbGl0eShtYXRlcmlhbERhdGFQYXNzZXNbaV0uc2hhZGVyT2JqZWN0KTtcblxuXHRcdFx0cmV0dXJuICFtYXRlcmlhbC5hbmltYXRpb25TZXQudXNlc0NQVTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgY2FsY0FuaW1hdGlvbkNvZGUobWF0ZXJpYWw6TWF0ZXJpYWxCYXNlLCBtYXRlcmlhbFBhc3NEYXRhOk1hdGVyaWFsUGFzc0RhdGEpXG5cdHtcblx0XHQvL3Jlc2V0IGtleSBzbyB0aGF0IHRoZSBwcm9ncmFtIGlzIHJlLWNhbGN1bGF0ZWRcblx0XHRtYXRlcmlhbFBhc3NEYXRhLmtleSA9IFwiXCI7XG5cdFx0bWF0ZXJpYWxQYXNzRGF0YS5hbmltYXRpb25WZXJ0ZXhDb2RlID0gXCJcIjtcblx0XHRtYXRlcmlhbFBhc3NEYXRhLmFuaW1hdGlvbkZyYWdtZW50Q29kZSA9IFwiXCI7XG5cblx0XHR2YXIgc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UgPSBtYXRlcmlhbFBhc3NEYXRhLnNoYWRlck9iamVjdDtcblxuXHRcdC8vY2hlY2sgdG8gc2VlIGlmIEdQVSBhbmltYXRpb24gaXMgdXNlZFxuXHRcdGlmIChtYXRlcmlhbFBhc3NEYXRhLnVzZXNBbmltYXRpb24pIHtcblxuXHRcdFx0dmFyIGFuaW1hdGlvblNldDpBbmltYXRpb25TZXRCYXNlID0gPEFuaW1hdGlvblNldEJhc2U+IG1hdGVyaWFsLmFuaW1hdGlvblNldDtcblxuXHRcdFx0bWF0ZXJpYWxQYXNzRGF0YS5hbmltYXRpb25WZXJ0ZXhDb2RlICs9IGFuaW1hdGlvblNldC5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QpO1xuXG5cdFx0XHRpZiAoc2hhZGVyT2JqZWN0LnV2RGVwZW5kZW5jaWVzID4gMCAmJiAhc2hhZGVyT2JqZWN0LnVzZXNVVlRyYW5zZm9ybSlcblx0XHRcdFx0bWF0ZXJpYWxQYXNzRGF0YS5hbmltYXRpb25WZXJ0ZXhDb2RlICs9IGFuaW1hdGlvblNldC5nZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdCk7XG5cblx0XHRcdGlmIChzaGFkZXJPYmplY3QudXNlc0ZyYWdtZW50QW5pbWF0aW9uKVxuXHRcdFx0XHRtYXRlcmlhbFBhc3NEYXRhLmFuaW1hdGlvbkZyYWdtZW50Q29kZSArPSBhbmltYXRpb25TZXQuZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3QsIG1hdGVyaWFsUGFzc0RhdGEuc2hhZGVkVGFyZ2V0KTtcblxuXHRcdFx0YW5pbWF0aW9uU2V0LmRvbmVBR0FMQ29kZShzaGFkZXJPYmplY3QpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHNpbXBseSB3cml0ZSBhdHRyaWJ1dGVzIHRvIHRhcmdldHMsIGRvIG5vdCBhbmltYXRlIHRoZW1cblx0XHRcdC8vIHByb2plY3Rpb24gd2lsbCBwaWNrIHVwIG9uIHRhcmdldHNbMF0gdG8gZG8gdGhlIHByb2plY3Rpb25cblx0XHRcdHZhciBsZW46bnVtYmVyID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzLmxlbmd0aDtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0XHRtYXRlcmlhbFBhc3NEYXRhLmFuaW1hdGlvblZlcnRleENvZGUgKz0gXCJtb3YgXCIgKyBzaGFkZXJPYmplY3QuYW5pbWF0aW9uVGFyZ2V0UmVnaXN0ZXJzW2ldICsgXCIsIFwiICsgc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzW2ldICsgXCJcXG5cIjtcblxuXHRcdFx0aWYgKHNoYWRlck9iamVjdC51dkRlcGVuZGVuY2llcyA+IDAgJiYgIXNoYWRlck9iamVjdC51c2VzVVZUcmFuc2Zvcm0pXG5cdFx0XHRcdG1hdGVyaWFsUGFzc0RhdGEuYW5pbWF0aW9uVmVydGV4Q29kZSArPSBcIm1vdiBcIiArIHNoYWRlck9iamVjdC51dlRhcmdldCArIFwiLFwiICsgc2hhZGVyT2JqZWN0LnV2U291cmNlICsgXCJcXG5cIjtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gUmVuZGVyZXJCYXNlOyJdfQ==