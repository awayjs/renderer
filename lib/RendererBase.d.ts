import { ImageBase } from "@awayjs/core/lib/image/ImageBase";
import { BitmapImage2D } from "@awayjs/core/lib/image/BitmapImage2D";
import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Plane3D } from "@awayjs/core/lib/geom/Plane3D";
import { Rectangle } from "@awayjs/core/lib/geom/Rectangle";
import { EventDispatcher } from "@awayjs/core/lib/events/EventDispatcher";
import { IAssetClass } from "@awayjs/core/lib/library/IAssetClass";
import { IAbstractionPool } from "@awayjs/core/lib/library/IAbstractionPool";
import { IRenderable } from "@awayjs/display/lib/base/IRenderable";
import { IRenderer } from "@awayjs/display/lib/IRenderer";
import { INode } from "@awayjs/display/lib/partition/INode";
import { DisplayObject } from "@awayjs/display/lib/display/DisplayObject";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { IEntity } from "@awayjs/display/lib/display/IEntity";
import { Scene } from "@awayjs/display/lib/display/Scene";
import { IContextGL } from "@awayjs/stage/lib/base/IContextGL";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { StageEvent } from "@awayjs/stage/lib/events/StageEvent";
import { GL_IAssetClass } from "@awayjs/stage/lib/library/GL_IAssetClass";
import { GL_ElementsBase } from "./elements/GL_ElementsBase";
import { ISurfaceClassGL } from "./surfaces/ISurfaceClassGL";
import { GL_RenderableBase } from "./renderables/GL_RenderableBase";
import { RTTBufferManager } from "./managers/RTTBufferManager";
import { SurfacePool } from "./surfaces/SurfacePool";
import { IPass } from "./surfaces/passes/IPass";
import { IEntitySorter } from "./sort/IEntitySorter";
/**
 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
 * contents of a partition
 *
 * @class away.render.RendererBase
 */
export declare class RendererBase extends EventDispatcher implements IRenderer, IAbstractionPool {
    static _iCollectionMark: number;
    static _abstractionClassPool: Object;
    private _objectPools;
    private _abstractionPool;
    private _maskConfig;
    private _activeMasksDirty;
    private _activeMasksConfig;
    private _registeredMasks;
    private _numUsedStreams;
    private _numUsedTextures;
    _pContext: IContextGL;
    _pStage: Stage;
    private _surfaceClassGL;
    private _cameraPosition;
    _cameraTransform: Matrix3D;
    private _cameraForward;
    _pRttBufferManager: RTTBufferManager;
    private _viewPort;
    private _viewportDirty;
    private _scissorDirty;
    _pBackBufferInvalid: boolean;
    _pDepthTextureInvalid: boolean;
    _depthPrepass: boolean;
    private _backgroundR;
    private _backgroundG;
    private _backgroundB;
    private _backgroundAlpha;
    _width: number;
    _height: number;
    textureRatioX: number;
    textureRatioY: number;
    private _snapshotBitmapImage2D;
    private _snapshotRequired;
    _pRttViewProjectionMatrix: Matrix3D;
    private _localPos;
    private _globalPos;
    _pScissorRect: Rectangle;
    private _scissorUpdated;
    private _viewPortUpdated;
    private _onContextUpdateDelegate;
    private _onViewportUpdatedDelegate;
    _pNumElements: number;
    _pOpaqueRenderableHead: GL_RenderableBase;
    _pBlendedRenderableHead: GL_RenderableBase;
    _disableColor: boolean;
    _renderBlended: boolean;
    private _cullPlanes;
    private _customCullPlanes;
    private _numCullPlanes;
    private _sourceEntity;
    private _zIndex;
    private _renderSceneTransform;
    /**
     * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
     * to share the same ContextGL object.
     */
    shareContext: boolean;
    /**
     *
     */
    cullPlanes: Array<Plane3D>;
    renderBlended: boolean;
    disableColor: boolean;
    /**
     *
     */
    readonly numElements: number;
    /**
     *
     */
    renderableSorter: IEntitySorter;
    /**
     * A viewPort rectangle equivalent of the Stage size and position.
     */
    readonly viewPort: Rectangle;
    /**
     * A scissor rectangle equivalent of the view size and position.
     */
    readonly scissorRect: Rectangle;
    /**
     *
     */
    x: number;
    /**
     *
     */
    y: number;
    /**
     *
     */
    width: number;
    /**
     *
     */
    height: number;
    /**
     * Creates a new RendererBase object.
     */
    constructor(stage?: Stage, surfaceClassGL?: ISurfaceClassGL, forceSoftware?: boolean, profile?: string, mode?: string);
    getAbstraction(renderable: IRenderable): GL_RenderableBase;
    /**
     *
     * @param image
     */
    clearAbstraction(renderable: IRenderable): void;
    /**
     * //TODO
     *
     * @param elementsClass
     * @returns SurfacePool
     */
    getSurfacePool(elements: GL_ElementsBase): SurfacePool;
    /**
     *
     * @param imageObjectClass
     */
    static registerAbstraction(renderableClass: GL_IAssetClass, assetClass: IAssetClass): void;
    activatePass(pass: IPass, camera: Camera): void;
    deactivatePass(pass: IPass): void;
    /**
     * The background color's red component, used when clearing.
     *
     * @private
     */
    _iBackgroundR: number;
    /**
     * The background color's green component, used when clearing.
     *
     * @private
     */
    _iBackgroundG: number;
    /**
     * The background color's blue component, used when clearing.
     *
     * @private
     */
    _iBackgroundB: number;
    readonly context: IContextGL;
    /**
     * The Stage that will provide the ContextGL used for rendering.
     */
    readonly stage: Stage;
    /**
     * Disposes the resources used by the RendererBase.
     */
    dispose(): void;
    render(camera: Camera, scene: Scene): void;
    /**
     * Renders the potentially visible geometry to the back buffer or texture.
     * @param target An option target texture to render to.
     * @param surfaceSelector The index of a CubeTexture's face to render to.
     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
     */
    _iRender(camera: Camera, scene: Scene, target?: ImageBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
    _iRenderCascades(camera: Camera, scene: Scene, target: ImageBase, numCascades: number, scissorRects: Array<Rectangle>, cameras: Array<Camera>): void;
    /**
     * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
     *
     * @param target An option target texture to render to.
     * @param surfaceSelector The index of a CubeTexture's face to render to.
     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
     */
    pExecuteRender(camera: Camera, target?: ImageBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
    queueSnapshot(bmd: BitmapImage2D): void;
    /**
     * Performs the actual drawing of geometry to the target.
     */
    pDraw(camera: Camera): void;
    /**
     * Draw a list of renderables.
     *
     * @param renderables The renderables to draw.
     */
    drawRenderables(camera: Camera, renderableGL: GL_RenderableBase): void;
    /**
     * Assign the context once retrieved
     */
    private onContextUpdate(event);
    _iBackgroundAlpha: number;
    /**
     * @private
     */
    private notifyScissorUpdate();
    /**
     * @private
     */
    private notifyViewportUpdate();
    /**
     *
     */
    onViewportUpdated(event: StageEvent): void;
    /**
     *
     */
    updateGlobalPos(): void;
    /**
     *
     * @param node
     * @returns {boolean}
     */
    enterNode(node: INode): boolean;
    applyEntity(entity: IEntity): void;
    applyRenderable(renderable: IRenderable): void;
    /**
     *
     * @param entity
     */
    applyDirectionalLight(entity: IEntity): void;
    /**
     *
     * @param entity
     */
    applyLightProbe(entity: IEntity): void;
    /**
     *
     * @param entity
     */
    applyPointLight(entity: IEntity): void;
    /**
     *
     * @param entity
     */
    applySkybox(entity: IEntity): void;
    private _registerMask(obj);
    _renderMasks(camera: Camera, masks: DisplayObject[][]): void;
    private _drawMask(camera, renderableGL);
    private _checkMasksConfig(masksConfig);
}
