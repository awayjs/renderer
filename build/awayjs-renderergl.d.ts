declare module "awayjs-renderergl/lib/RendererGL" {
	/**
	 *
	 * static shim
	 */
	class renderergl {
	}
	export = renderergl;
	
}

declare module "awayjs-renderergl/lib/DefaultRenderer" {
	import ImageBase = require("awayjs-core/lib/image/ImageBase");
	import BitmapImage2D = require("awayjs-core/lib/image/BitmapImage2D");
	import Rectangle = require("awayjs-core/lib/geom/Rectangle");
	import Camera = require("awayjs-display/lib/display/Camera");
	import IEntity = require("awayjs-display/lib/display/IEntity");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import Filter3DRenderer = require("awayjs-renderergl/lib/Filter3DRenderer");
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	import Scene = require("awayjs-display/lib/display/Scene");
	/**
	 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
	 * materials assigned to them.
	 *
	 * @class away.render.DefaultRenderer
	 */
	class DefaultRenderer extends RendererBase {
	    _pRequireDepthRender: boolean;
	    private _pDistanceRenderer;
	    private _pDepthRenderer;
	    private _skyBoxSurfacePool;
	    private _skyboxProjection;
	    _pFilter3DRenderer: Filter3DRenderer;
	    _pDepthRender: BitmapImage2D;
	    private _antiAlias;
	    private _skybox;
	    private _directionalLights;
	    private _pointLights;
	    private _lightProbes;
	    isDebugEnabled: boolean;
	    antiAlias: number;
	    /**
	     *
	     */
	    depthPrepass: boolean;
	    /**
	     *
	     * @returns {*}
	     */
	    filters3d: Array<Filter3DBase>;
	    /**
	     * Creates a new DefaultRenderer object.
	     *
	     * @param antiAlias The amount of anti-aliasing to use.
	     * @param renderMode The render mode to use.
	     */
	    constructor(stage?: Stage, forceSoftware?: boolean, profile?: string, mode?: string);
	    render(camera: Camera, scene: Scene): void;
	    pExecuteRender(camera: Camera, target?: ImageBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
	    private updateLights(camera);
	    /**
	     * @inheritDoc
	     */
	    pDraw(camera: Camera): void;
	    /**
	     * Draw the skybox if present.
	     **/
	    private drawSkybox(camera);
	    private updateSkyboxProjection(camera);
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
	    dispose(): void;
	    /**
	     *
	     */
	    pRenderDepthPrepass(camera: Camera, scene: Scene): void;
	    /**
	     *
	     */
	    pRenderSceneDepthToTexture(camera: Camera, scene: Scene): void;
	    /**
	     * Updates the backbuffer dimensions.
	     */
	    pUpdateBackBuffer(): void;
	    /**
	     *
	     */
	    private initDepthTexture(context);
	}
	export = DefaultRenderer;
	
}

declare module "awayjs-renderergl/lib/DepthRenderer" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import INode = require("awayjs-display/lib/partition/INode");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	/**
	 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
	 *
	 * @class away.render.DepthRenderer
	 */
	class DepthRenderer extends RendererBase {
	    /**
	     * Creates a new DepthRenderer object.
	     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	     */
	    constructor(stage?: Stage);
	    /**
	     *
	     */
	    enterNode(node: INode): boolean;
	}
	export = DepthRenderer;
	
}

declare module "awayjs-renderergl/lib/DistanceRenderer" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import INode = require("awayjs-display/lib/partition/INode");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	/**
	 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
	 *
	 * @class away.render.DistanceRenderer
	 */
	class DistanceRenderer extends RendererBase {
	    /**
	     * Creates a new DistanceRenderer object.
	     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	     */
	    constructor(stage?: Stage);
	    /**
	     *
	     */
	    enterNode(node: INode): boolean;
	}
	export = DistanceRenderer;
	
}

declare module "awayjs-renderergl/lib/Filter3DRenderer" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	/**
	 * @class away.render.Filter3DRenderer
	 */
	class Filter3DRenderer {
	    private _filters;
	    private _tasks;
	    private _filterTasksInvalid;
	    private _mainInputTexture;
	    private _requireDepthRender;
	    private _rttManager;
	    private _stage;
	    private _filterSizesInvalid;
	    private _onRTTResizeDelegate;
	    constructor(stage: Stage);
	    private onRTTResize(event);
	    requireDepthRender: boolean;
	    getMainInputTexture(stage: Stage): Image2D;
	    filters: Filter3DBase[];
	    private updateFilterTasks(stage);
	    render(stage: Stage, camera: Camera, depthTexture: Image2D): void;
	    private updateFilterSizes();
	    dispose(): void;
	}
	export = Filter3DRenderer;
	
}

declare module "awayjs-renderergl/lib/RendererBase" {
	import ImageBase = require("awayjs-core/lib/image/ImageBase");
	import BitmapImage2D = require("awayjs-core/lib/image/BitmapImage2D");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Plane3D = require("awayjs-core/lib/geom/Plane3D");
	import Rectangle = require("awayjs-core/lib/geom/Rectangle");
	import EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
	import IAssetClass = require("awayjs-core/lib/library/IAssetClass");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	import IRenderable = require("awayjs-display/lib/base/IRenderable");
	import IRenderer = require("awayjs-display/lib/IRenderer");
	import INode = require("awayjs-display/lib/partition/INode");
	import DisplayObject = require("awayjs-display/lib/display/DisplayObject");
	import Camera = require("awayjs-display/lib/display/Camera");
	import IEntity = require("awayjs-display/lib/display/IEntity");
	import Scene = require("awayjs-display/lib/display/Scene");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import IContextGL = require("awayjs-stagegl/lib/base/IContextGL");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import StageEvent = require("awayjs-stagegl/lib/events/StageEvent");
	import GL_IAssetClass = require("awayjs-stagegl/lib/library/GL_IAssetClass");
	import ISurfaceClassGL = require("awayjs-renderergl/lib/surfaces/ISurfaceClassGL");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import IEntitySorter = require("awayjs-renderergl/lib/sort/IEntitySorter");
	/**
	 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
	 * contents of a partition
	 *
	 * @class away.render.RendererBase
	 */
	class RendererBase extends EventDispatcher implements IRenderer, IAbstractionPool {
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
	    private _cameraPosition;
	    private _cameraTransform;
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
	    _shareContext: boolean;
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
	    isDebugEnabled: boolean;
	    /**
	     *
	     */
	    cullPlanes: Array<Plane3D>;
	    renderBlended: boolean;
	    disableColor: boolean;
	    /**
	     *
	     */
	    numElements: number;
	    /**
	     *
	     */
	    renderableSorter: IEntitySorter;
	    /**
	     * A viewPort rectangle equivalent of the Stage size and position.
	     */
	    viewPort: Rectangle;
	    /**
	     * A scissor rectangle equivalent of the view size and position.
	     */
	    scissorRect: Rectangle;
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
	    getSurfacePool(elements: ElementsBase): SurfacePool;
	    /**
	     *
	     * @param imageObjectClass
	     */
	    static registerAbstraction(renderableClass: GL_IAssetClass, assetClass: IAssetClass): void;
	    activatePass(renderableGL: GL_RenderableBase, pass: IPass, camera: Camera): void;
	    deactivatePass(renderableGL: GL_RenderableBase, pass: IPass): void;
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
	    context: IContextGL;
	    /**
	     * The Stage that will provide the ContextGL used for rendering.
	     */
	    stage: Stage;
	    /**
	     * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
	     * to share the same ContextGL object.
	     */
	    shareContext: boolean;
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
	export = RendererBase;
	
}

declare module "awayjs-renderergl/lib/animators/AnimationSetBase" {
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import AssetBase = require("awayjs-core/lib/library/AssetBase");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	/**
	 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
	 *
	 * @see away.animators.AnimatorBase
	 */
	class AnimationSetBase extends AssetBase implements IAsset {
	    static assetType: string;
	    private _usesCPU;
	    private _animations;
	    private _animationNames;
	    private _animationDictionary;
	    constructor();
	    /**
	     * Retrieves a temporary GPU register that's still free.
	     *
	     * @param exclude An array of non-free temporary registers.
	     * @param excludeAnother An additional register that's not free.
	     * @return A temporary register that can be used.
	     */
	    _pFindTempReg(exclude: Array<string>, excludeAnother?: string): string;
	    /**
	     * Indicates whether the properties of the animation data contained within the set combined with
	     * the vertex registers already in use on shading materials allows the animation data to utilise
	     * GPU calls.
	     */
	    usesCPU: boolean;
	    /**
	     * Called by the material to reset the GPU indicator before testing whether register space in the shader
	     * is available for running GPU-based animation code.
	     *
	     * @private
	     */
	    resetGPUCompatibility(): void;
	    cancelGPUCompatibility(): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shader: ShaderBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * Returns a vector of animation state objects that make up the contents of the animation data set.
	     */
	    animations: Array<AnimationNodeBase>;
	    /**
	     * Returns a vector of animation state objects that make up the contents of the animation data set.
	     */
	    animationNames: Array<string>;
	    /**
	     * Check to determine whether a state is registered in the animation set under the given name.
	     *
	     * @param stateName The name of the animation state object to be checked.
	     */
	    hasAnimation(name: string): boolean;
	    /**
	     * Retrieves the animation state object registered in the animation data set under the given name.
	     *
	     * @param stateName The name of the animation state object to be retrieved.
	     */
	    getAnimation(name: string): AnimationNodeBase;
	    /**
	     * Adds an animation state object to the aniamtion data set under the given name.
	     *
	     * @param stateName The name under which the animation state object will be stored.
	     * @param animationState The animation state object to be staored in the set.
	     */
	    addAnimation(node: AnimationNodeBase): void;
	    /**
	     * Cleans up any resources used by the current object.
	     */
	    dispose(): void;
	}
	export = AnimationSetBase;
	
}

declare module "awayjs-renderergl/lib/animators/AnimatorBase" {
	import AssetBase = require("awayjs-core/lib/library/AssetBase");
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import IAnimator = require("awayjs-display/lib/animators/IAnimator");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Sprite = require("awayjs-display/lib/display/Sprite");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	/**
	 * Dispatched when playback of an animation inside the animator object starts.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	/**
	 * Dispatched when playback of an animation inside the animator object stops.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	/**
	 * Dispatched when playback of an animation reaches the end of an animation.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	/**
	 * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
	 *
	 * @see away.animators.AnimationSetBase
	 */
	class AnimatorBase extends AssetBase implements IAnimator {
	    static assetType: string;
	    private _broadcaster;
	    private _isPlaying;
	    private _autoUpdate;
	    private _startEvent;
	    private _stopEvent;
	    private _cycleEvent;
	    private _time;
	    private _playbackSpeed;
	    _pAnimationSet: IAnimationSet;
	    _pOwners: Array<Sprite>;
	    _pActiveNode: AnimationNodeBase;
	    _pActiveState: IAnimationState;
	    _pActiveAnimationName: string;
	    _pAbsoluteTime: number;
	    private _animationStates;
	    /**
	     * Enables translation of the animated sprite from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
	     *
	     * @see away.animators.IAnimationState#positionDelta
	     */
	    updatePosition: boolean;
	    getAnimationState(node: AnimationNodeBase): IAnimationState;
	    getAnimationStateByName(name: string): IAnimationState;
	    /**
	     * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
	     *
	     * @see #time
	     * @see #playbackSpeed
	     */
	    absoluteTime: number;
	    /**
	     * Returns the animation data set in use by the animator.
	     */
	    animationSet: IAnimationSet;
	    /**
	     * Returns the current active animation state.
	     */
	    activeState: IAnimationState;
	    /**
	     * Returns the current active animation node.
	     */
	    activeAnimation: AnimationNodeBase;
	    /**
	     * Returns the current active animation node.
	     */
	    activeAnimationName: string;
	    /**
	     * Determines whether the animators internal update mechanisms are active. Used in cases
	     * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
	     * Defaults to true.
	     *
	     * @see #time
	     * @see #update()
	     */
	    autoUpdate: boolean;
	    /**
	     * Gets and sets the internal time clock of the animator.
	     */
	    time: number;
	    /**
	     * Sets the animation phase of the current active state's animation clip(s).
	     *
	     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	     */
	    phase(value: number): void;
	    /**
	     * Creates a new <code>AnimatorBase</code> object.
	     *
	     * @param animationSet The animation data set to be used by the animator object.
	     */
	    constructor(animationSet: IAnimationSet);
	    /**
	     * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
	     */
	    playbackSpeed: number;
	    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * Resumes the automatic playback clock controling the active state of the animator.
	     */
	    start(): void;
	    /**
	     * Pauses the automatic playback clock of the animator, in case manual updates are required via the
	     * <code>time</code> property or <code>update()</code> method.
	     *
	     * @see #time
	     * @see #update()
	     */
	    stop(): void;
	    /**
	     * Provides a way to manually update the active state of the animator when automatic
	     * updates are disabled.
	     *
	     * @see #stop()
	     * @see #autoUpdate
	     */
	    update(time: number): void;
	    reset(name: string, offset?: number): void;
	    /**
	     * Used by the sprite object to which the animator is applied, registers the owner for internal use.
	     *
	     * @private
	     */
	    addOwner(sprite: Sprite): void;
	    /**
	     * Used by the sprite object from which the animator is removed, unregisters the owner for internal use.
	     *
	     * @private
	     */
	    removeOwner(sprite: Sprite): void;
	    /**
	     * Internal abstract method called when the time delta property of the animator's contents requires updating.
	     *
	     * @private
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    /**
	     * Enter frame event handler for automatically updating the active state of the animator.
	     */
	    private onEnterFrame(event?);
	    private applyPositionDelta();
	    /**
	     *  for internal use.
	     *
	     * @private
	     */
	    dispatchCycleEvent(): void;
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    getRenderableElements(renderable: GL_RenderableBase, sourceElements: ElementsBase): ElementsBase;
	}
	export = AnimatorBase;
	
}

declare module "awayjs-renderergl/lib/animators/ParticleAnimationSet" {
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import Graphic = require("awayjs-display/lib/graphics/Graphic");
	import Graphics = require("awayjs-display/lib/graphics/Graphics");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	/**
	 * The animation data set used by particle-based animators, containing particle animation data.
	 *
	 * @see away.animators.ParticleAnimator
	 */
	class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet {
	    /** @private */
	    _iAnimationRegisterCache: AnimationRegisterCache;
	    private _timeNode;
	    /**
	     * Property used by particle nodes that require compilers at the end of the shader
	     */
	    static POST_PRIORITY: number;
	    /**
	     * Property used by particle nodes that require color compilers
	     */
	    static COLOR_PRIORITY: number;
	    private _animationElements;
	    private _particleNodes;
	    private _localDynamicNodes;
	    private _localStaticNodes;
	    private _totalLenOfOneVertex;
	    hasUVNode: boolean;
	    needVelocity: boolean;
	    hasBillboard: boolean;
	    hasColorMulNode: boolean;
	    hasColorAddNode: boolean;
	    /**
	     * Initialiser function for static particle properties. Needs to reference a with the following format
	     *
	     * <code>
	     * initParticleFunc(prop:ParticleProperties)
	     * {
	     * 		//code for settings local properties
	     * }
	     * </code>
	     *
	     * Aside from setting any properties required in particle animation nodes using local static properties, the initParticleFunc function
	     * is required to time node requirements as they may be needed. These properties on the ParticleProperties object can include
	     * <code>startTime</code>, <code>duration</code> and <code>delay</code>. The use of these properties is determined by the setting
	     * arguments passed in the constructor of the particle animation set. By default, only the <code>startTime</code> property is required.
	     */
	    initParticleFunc: Function;
	    /**
	     * Initialiser function scope for static particle properties
	     */
	    initParticleScope: Object;
	    /**
	     *
	     */
	    shareAnimationGraphics: boolean;
	    /**
	     * Creates a new <code>ParticleAnimationSet</code>
	     *
	     * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
	     * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
	     * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
	     */
	    constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
	    /**
	     * Returns a vector of the particle animation nodes contained within the set.
	     */
	    particleNodes: Array<ParticleNodeBase>;
	    /**
	     * @inheritDoc
	     */
	    addAnimation(node: AnimationNodeBase): void;
	    /**
	     * @inheritDoc
	     */
	    activate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shader: ShaderBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    usesCPU: boolean;
	    /**
	     * @inheritDoc
	     */
	    cancelGPUCompatibility(): void;
	    dispose(): void;
	    getAnimationElements(graphic: Graphic): any;
	    /** @private */
	    _iGenerateAnimationElements(graphics: Graphics): void;
	}
	export = ParticleAnimationSet;
	
}

declare module "awayjs-renderergl/lib/animators/ParticleAnimator" {
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * Provides an interface for assigning paricle-based animation data sets to sprite-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 *
	 * Requires that the containing geometry of the parent sprite is particle geometry
	 *
	 * @see away.base.ParticleGraphics
	 */
	class ParticleAnimator extends AnimatorBase {
	    private _particleAnimationSet;
	    private _animationParticleStates;
	    private _animatorParticleStates;
	    private _timeParticleStates;
	    private _totalLenOfOneVertex;
	    private _animatorSubGeometries;
	    /**
	     * Creates a new <code>ParticleAnimator</code> object.
	     *
	     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
	     */
	    constructor(particleAnimationSet: ParticleAnimationSet);
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    start(): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    /**
	     * @inheritDoc
	     */
	    resetTime(offset?: number): void;
	    dispose(): void;
	    private getAnimatorElements(graphic);
	}
	export = ParticleAnimator;
	
}

declare module "awayjs-renderergl/lib/animators/SkeletonAnimationSet" {
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	/**
	 * The animation data set used by skeleton-based animators, containing skeleton animation data.
	 *
	 * @see away.animators.SkeletonAnimator
	 */
	class SkeletonAnimationSet extends AnimationSetBase implements IAnimationSet {
	    private _jointsPerVertex;
	    /**
	     * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
	     * maximum allowed value is 4.
	     */
	    jointsPerVertex: number;
	    /**
	     * Creates a new <code>SkeletonAnimationSet</code> object.
	     *
	     * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
	     */
	    constructor(jointsPerVertex?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shader: ShaderBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shader: ShaderBase): void;
	}
	export = SkeletonAnimationSet;
	
}

declare module "awayjs-renderergl/lib/animators/SkeletonAnimator" {
	import TriangleElements = require("awayjs-display/lib/graphics/TriangleElements");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonAnimationSet = require("awayjs-renderergl/lib/animators/SkeletonAnimationSet");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import GL_GraphicRenderable = require("awayjs-renderergl/lib/renderables/GL_GraphicRenderable");
	/**
	 * Provides an interface for assigning skeleton-based animation data sets to sprite-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 */
	class SkeletonAnimator extends AnimatorBase {
	    private _globalMatrices;
	    private _globalPose;
	    private _globalPropertiesDirty;
	    private _numJoints;
	    private _morphedElements;
	    private _morphedElementsDirty;
	    private _condensedMatrices;
	    private _skeleton;
	    private _forceCPU;
	    private _useCondensedIndices;
	    private _jointsPerVertex;
	    private _activeSkeletonState;
	    private _onTransitionCompleteDelegate;
	    private _onIndicesUpdateDelegate;
	    private _onVerticesUpdateDelegate;
	    /**
	     * returns the calculated global matrices of the current skeleton pose.
	     *
	     * @see #globalPose
	     */
	    globalMatrices: Float32Array;
	    /**
	     * returns the current skeleton pose output from the animator.
	     *
	     * @see away.animators.data.SkeletonPose
	     */
	    globalPose: SkeletonPose;
	    /**
	     * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
	     * skinned geoemtry to which skeleon animator is applied.
	     */
	    skeleton: Skeleton;
	    /**
	     * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
	     * Defaults to false.
	     */
	    forceCPU: boolean;
	    /**
	     * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
	     * by condensing the number of joint index values required per sprite. Only applicable to
	     * skeleton animations that utilise more than one sprite object. Defaults to false.
	     */
	    useCondensedIndices: boolean;
	    /**
	     * Creates a new <code>SkeletonAnimator</code> object.
	     *
	     * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
	     * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned sprite data.
	     * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
	     */
	    constructor(animationSet: SkeletonAnimationSet, skeleton: Skeleton, forceCPU?: boolean);
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * Plays an animation state registered with the given name in the animation data set.
	     *
	     * @param name The data set name of the animation state to be played.
	     * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
	     * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
	     */
	    play(name: string, transition?: IAnimationTransition, offset?: number): void;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shader: ShaderBase): void;
	    /**
	     * Applies the calculated time delta to the active animation state node or state transition object.
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    private updateCondensedMatrices(condensedIndexLookUp);
	    private updateGlobalProperties();
	    getRenderableElements(renderable: GL_GraphicRenderable, sourceElements: TriangleElements): TriangleElements;
	    /**
	     * If the animation can't be performed on GPU, transform vertices manually
	     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
	     * @param pass The material pass for which we need to transform the vertices
	     */
	    morphElements(renderable: GL_GraphicRenderable, sourceElements: TriangleElements): void;
	    /**
	     * Converts a local hierarchical skeleton pose to a global pose
	     * @param targetPose The SkeletonPose object that will contain the global pose.
	     * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
	     */
	    private localToGlobalPose(sourcePose, targetPose, skeleton);
	    private onTransitionComplete(event);
	    private onIndicesUpdate(event);
	    private onVerticesUpdate(event);
	}
	export = SkeletonAnimator;
	
}

declare module "awayjs-renderergl/lib/animators/VertexAnimationSet" {
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	/**
	 * The animation data set used by vertex-based animators, containing vertex animation state data.
	 *
	 * @see VertexAnimator
	 */
	class VertexAnimationSet extends AnimationSetBase implements IAnimationSet {
	    private _numPoses;
	    private _blendMode;
	    /**
	     * Returns the number of poses made available at once to the GPU animation code.
	     */
	    numPoses: number;
	    /**
	     * Returns the active blend mode of the vertex animator object.
	     */
	    blendMode: string;
	    /**
	     * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
	     */
	    /**
	     * Creates a new <code>VertexAnimationSet</code> object.
	     *
	     * @param numPoses The number of poses made available at once to the GPU animation code.
	     * @param blendMode Optional value for setting the animation mode of the vertex animator object.
	     *
	     * @see away3d.animators.data.VertexAnimationMode
	     */
	    constructor(numPoses?: number, blendMode?: string);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shader: ShaderBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shader: ShaderBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shader: ShaderBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shader: ShaderBase): void;
	    /**
	     * Generates the vertex AGAL code for absolute blending.
	     */
	    private getAbsoluteAGALCode(shader);
	    /**
	     * Generates the vertex AGAL code for additive blending.
	     */
	    private getAdditiveAGALCode(shader);
	}
	export = VertexAnimationSet;
	
}

declare module "awayjs-renderergl/lib/animators/VertexAnimator" {
	import TriangleElements = require("awayjs-display/lib/graphics/TriangleElements");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import VertexAnimationSet = require("awayjs-renderergl/lib/animators/VertexAnimationSet");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
	import GL_GraphicRenderable = require("awayjs-renderergl/lib/renderables/GL_GraphicRenderable");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	/**
	 * Provides an interface for assigning vertex-based animation data sets to sprite-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 */
	class VertexAnimator extends AnimatorBase {
	    private _vertexAnimationSet;
	    private _poses;
	    private _weights;
	    private _numPoses;
	    private _blendMode;
	    private _activeVertexState;
	    /**
	     * Creates a new <code>VertexAnimator</code> object.
	     *
	     * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
	     */
	    constructor(vertexAnimationSet: VertexAnimationSet);
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
	     * @param sequenceName The name of the clip to be played.
	     */
	    play(name: string, transition?: IAnimationTransition, offset?: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    private setNullPose(shader, elements, stage, vertexConstantOffset, vertexStreamOffset);
	    /**
	     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
	     * Needs to be called if gpu code is potentially required.
	     */
	    testGPUCompatibility(shader: ShaderBase): void;
	    getRenderableElements(renderable: GL_GraphicRenderable, sourceElements: TriangleElements): TriangleElements;
	}
	export = VertexAnimator;
	
}

declare module "awayjs-renderergl/lib/animators/data/AnimationElements" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IContextGL = require("awayjs-stagegl/lib/base/IContextGL");
	import IVertexBuffer = require("awayjs-stagegl/lib/base/IVertexBuffer");
	import ParticleAnimationData = require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
	/**
	 * ...
	 */
	class AnimationElements {
	    static SUBGEOM_ID_COUNT: number;
	    _pVertexData: Array<number>;
	    _pVertexBuffer: Array<IVertexBuffer>;
	    _pBufferContext: Array<IContextGL>;
	    _pBufferDirty: Array<boolean>;
	    private _numVertices;
	    private _totalLenOfOneVertex;
	    numProcessedVertices: number;
	    previousTime: number;
	    animationParticles: Array<ParticleAnimationData>;
	    /**
	     * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
	     *
	     * @private
	     */
	    _iUniqueId: number;
	    constructor();
	    createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
	    activateVertexBuffer(index: number, bufferOffset: number, stage: Stage, format: number): void;
	    dispose(): void;
	    invalidateBuffer(): void;
	    vertexData: Array<number>;
	    numVertices: number;
	    totalLenOfOneVertex: number;
	}
	export = AnimationElements;
	
}

declare module "awayjs-renderergl/lib/animators/data/AnimationRegisterCache" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	/**
	 * ...
	 */
	class AnimationRegisterCache extends ShaderRegisterCache {
	    positionAttribute: ShaderRegisterElement;
	    uvAttribute: ShaderRegisterElement;
	    positionTarget: ShaderRegisterElement;
	    scaleAndRotateTarget: ShaderRegisterElement;
	    velocityTarget: ShaderRegisterElement;
	    vertexTime: ShaderRegisterElement;
	    vertexLife: ShaderRegisterElement;
	    vertexZeroConst: ShaderRegisterElement;
	    vertexOneConst: ShaderRegisterElement;
	    vertexTwoConst: ShaderRegisterElement;
	    uvTarget: ShaderRegisterElement;
	    colorAddTarget: ShaderRegisterElement;
	    colorMulTarget: ShaderRegisterElement;
	    colorAddVary: ShaderRegisterElement;
	    colorMulVary: ShaderRegisterElement;
	    uvVar: ShaderRegisterElement;
	    rotationRegisters: Array<ShaderRegisterElement>;
	    needFragmentAnimation: boolean;
	    needUVAnimation: boolean;
	    sourceRegisters: Array<string>;
	    targetRegisters: Array<string>;
	    private indexDictionary;
	    hasUVNode: boolean;
	    needVelocity: boolean;
	    hasBillboard: boolean;
	    hasColorMulNode: boolean;
	    hasColorAddNode: boolean;
	    constructor(profile: string);
	    reset(): void;
	    setUVSourceAndTarget(UVAttribute: string, UVVaring: string): void;
	    setRegisterIndex(node: AnimationNodeBase, parameterIndex: number, registerIndex: number): void;
	    getRegisterIndex(node: AnimationNodeBase, parameterIndex: number): number;
	    getInitCode(): string;
	    getCombinationCode(): string;
	    initColorRegisters(): string;
	    getColorPassCode(): string;
	    getColorCombinationCode(shadedTarget: string): string;
	    private getRegisterFromString(code);
	    vertexConstantData: Float32Array;
	    fragmentConstantData: Float32Array;
	    private _numVertexConstant;
	    private _numFragmentConstant;
	    numVertexConstant: number;
	    numFragmentConstant: number;
	    setDataLength(): void;
	    setVertexConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
	    setVertexConstFromArray(index: number, data: Array<number>): void;
	    setVertexConstFromMatrix(index: number, matrix: Matrix3D): void;
	    setFragmentConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
	}
	export = AnimationRegisterCache;
	
}

declare module "awayjs-renderergl/lib/animators/data/ColorSegmentPoint" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	class ColorSegmentPoint {
	    private _color;
	    private _life;
	    constructor(life: number, color: ColorTransform);
	    color: ColorTransform;
	    life: number;
	}
	export = ColorSegmentPoint;
	
}

declare module "awayjs-renderergl/lib/animators/data/JointPose" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Quaternion = require("awayjs-core/lib/geom/Quaternion");
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	/**
	 * Contains transformation data for a skeleton joint, used for skeleton animation.
	 *
	 * @see away.animation.Skeleton
	 * @see away.animation.SkeletonJoint
	 *
	 * todo: support (uniform) scale
	 */
	class JointPose {
	    /**
	     * The name of the joint to which the pose is associated
	     */
	    name: string;
	    /**
	     * The rotation of the pose stored as a quaternion
	     */
	    orientation: Quaternion;
	    /**
	     * The translation of the pose
	     */
	    translation: Vector3D;
	    constructor();
	    /**
	     * Converts the transformation to a Matrix3D representation.
	     *
	     * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
	     * @return The transformation matrix of the pose.
	     */
	    toMatrix3D(target?: Matrix3D): Matrix3D;
	    /**
	     * Copies the transformation data from a source pose object into the existing pose object.
	     *
	     * @param pose The source pose to copy from.
	     */
	    copyFrom(pose: JointPose): void;
	}
	export = JointPose;
	
}

declare module "awayjs-renderergl/lib/animators/data/ParticleAnimationData" {
	import ParticleData = require("awayjs-display/lib/animators/data/ParticleData");
	/**
	 * ...
	 */
	class ParticleAnimationData {
	    index: number;
	    startTime: number;
	    totalTime: number;
	    duration: number;
	    delay: number;
	    startVertexIndex: number;
	    numVertices: number;
	    constructor(index: number, startTime: number, duration: number, delay: number, particle: ParticleData);
	}
	export = ParticleAnimationData;
	
}

declare module "awayjs-renderergl/lib/animators/data/ParticleProperties" {
	/**
	 * Dynamic class for holding the local properties of a particle, used for processing the static properties
	 * of particles in the particle animation set before beginning upload to the GPU.
	 */
	class ParticleProperties {
	    /**
	     * The index of the current particle being set.
	     */
	    index: number;
	    /**
	     * The total number of particles being processed by the particle animation set.
	     */
	    total: number;
	    /**
	     * The start time of the particle.
	     */
	    startTime: number;
	    /**
	     * The duration of the particle, an optional value used when the particle aniamtion set settings for <code>useDuration</code> are enabled in the constructor.
	     *
	     * @see away.animators.ParticleAnimationSet
	     */
	    duration: number;
	    /**
	     * The delay between cycles of the particle, an optional value used when the particle aniamtion set settings for <code>useLooping</code> and  <code>useDelay</code> are enabled in the constructor.
	     *
	     * @see away.animators.ParticleAnimationSet
	     */
	    delay: number;
	}
	export = ParticleProperties;
	
}

declare module "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode" {
	/**
	 * Options for setting the properties mode of a particle animation node.
	 */
	class ParticlePropertiesMode {
	    /**
	     * Mode that defines the particle node as acting on global properties (ie. the properties set in the node constructor or the corresponding animation state).
	     */
	    static GLOBAL: number;
	    /**
	     * Mode that defines the particle node as acting on local static properties (ie. the properties of particles set in the initialising on the animation set).
	     */
	    static LOCAL_STATIC: number;
	    /**
	     * Mode that defines the particle node as acting on local dynamic properties (ie. the properties of the particles set in the corresponding animation state).
	     */
	    static LOCAL_DYNAMIC: number;
	}
	export = ParticlePropertiesMode;
	
}

declare module "awayjs-renderergl/lib/animators/data/Skeleton" {
	import SkeletonJoint = require("awayjs-renderergl/lib/animators/data/SkeletonJoint");
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import AssetBase = require("awayjs-core/lib/library/AssetBase");
	/**
	 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
	 *
	 * @see away.animators.SkeletonJoint
	 */
	class Skeleton extends AssetBase implements IAsset {
	    static assetType: string;
	    /**
	     * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
	     * property that is an index into this list.
	     * A child joint should always have a higher index than its parent.
	     */
	    joints: Array<SkeletonJoint>;
	    /**
	     * The total number of joints in the skeleton.
	     */
	    numJoints: number;
	    /**
	     * Creates a new <code>Skeleton</code> object
	     */
	    constructor();
	    /**
	     * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
	     *
	     * @param jointName The name of the joint object to be found.
	     * @return The joint object with the given name.
	     *
	     * @see #joints
	     */
	    jointFromName(jointName: string): SkeletonJoint;
	    /**
	     * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
	     *
	     * @param jointName The name of the joint object to be found.
	     * @return The index of the joint object in the joints Array
	     *
	     * @see #joints
	     */
	    jointIndexFromName(jointName: string): number;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	}
	export = Skeleton;
	
}

declare module "awayjs-renderergl/lib/animators/data/SkeletonJoint" {
	/**
	 * A value obect representing a single joint in a skeleton object.
	 *
	 * @see away.animators.Skeleton
	 */
	class SkeletonJoint {
	    /**
	     * The index of the parent joint in the skeleton's joints vector.
	     *
	     * @see away.animators.Skeleton#joints
	     */
	    parentIndex: number;
	    /**
	     * The name of the joint
	     */
	    name: string;
	    /**
	     * The inverse bind pose matrix, as raw data, used to transform vertices to bind joint space in preparation for transformation using the joint matrix.
	     */
	    inverseBindPose: Float32Array;
	    /**
	     * Creates a new <code>SkeletonJoint</code> object
	     */
	    constructor();
	}
	export = SkeletonJoint;
	
}

declare module "awayjs-renderergl/lib/animators/data/SkeletonPose" {
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import AssetBase = require("awayjs-core/lib/library/AssetBase");
	import JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
	/**
	 * A collection of pose objects, determining the pose for an entire skeleton.
	 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
	 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
	 * clips are added to any animator with a valid skeleton)
	 *
	 * @see away.animators.Skeleton
	 * @see away.animators.JointPose
	 */
	class SkeletonPose extends AssetBase implements IAsset {
	    static assetType: string;
	    /**
	     * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
	     *
	     * @see away.animators.Skeleton#joints
	     */
	    jointPoses: Array<JointPose>;
	    /**
	     * The total number of joint poses in the skeleton pose.
	     */
	    numJointPoses: number;
	    /**
	     * Creates a new <code>SkeletonPose</code> object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * Returns the joint pose object with the given joint name, otherwise returns a null object.
	     *
	     * @param jointName The name of the joint object whose pose is to be found.
	     * @return The pose object with the given joint name.
	     */
	    jointPoseFromName(jointName: string): JointPose;
	    /**
	     * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
	     *
	     * @param The name of the joint object whose pose is to be found.
	     * @return The index of the pose object in the jointPoses Array
	     *
	     * @see #jointPoses
	     */
	    jointPoseIndexFromName(jointName: string): number;
	    /**
	     * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
	     *
	     * @return SkeletonPose
	     */
	    clone(): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	}
	export = SkeletonPose;
	
}

declare module "awayjs-renderergl/lib/animators/data/VertexAnimationMode" {
	/**
	 * Options for setting the animation mode of a vertex animator object.
	 *
	 * @see away.animators.VertexAnimator
	 */
	class VertexAnimationMode {
	    /**
	     * Animation mode that adds all outputs from active vertex animation state to form the current vertex animation pose.
	     */
	    static ADDITIVE: string;
	    /**
	     * Animation mode that picks the output from a single vertex animation state to form the current vertex animation pose.
	     */
	    static ABSOLUTE: string;
	}
	export = VertexAnimationMode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	/**
	 * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
	 */
	class AnimationClipNodeBase extends AnimationNodeBase {
	    _pLooping: boolean;
	    _pTotalDuration: number;
	    _pLastFrame: number;
	    _pStitchDirty: boolean;
	    _pStitchFinalFrame: boolean;
	    _pNumFrames: number;
	    _pDurations: Array<number>;
	    _pTotalDelta: Vector3D;
	    fixedFrameRate: boolean;
	    /**
	     * Determines whether the contents of the animation node have looping characteristics enabled.
	     */
	    looping: boolean;
	    /**
	     * Defines if looping content blends the final frame of animation data with the first (true) or works on the
	     * assumption that both first and last frames are identical (false). Defaults to false.
	     */
	    stitchFinalFrame: boolean;
	    totalDuration: number;
	    totalDelta: Vector3D;
	    lastFrame: number;
	    /**
	     * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
	     */
	    durations: Array<number>;
	    /**
	     * Creates a new <code>AnimationClipNodeBase</code> object.
	     */
	    constructor();
	    /**
	     * Updates the node's final frame stitch state.
	     *
	     * @see #stitchFinalFrame
	     */
	    _pUpdateStitch(): void;
	}
	export = AnimationClipNodeBase;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleAccelerationState = require("awayjs-renderergl/lib/animators/states/ParticleAccelerationState");
	/**
	 * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
	 */
	class ParticleAccelerationNode extends ParticleNodeBase {
	    /** @private */
	    _acceleration: Vector3D;
	    /**
	     * Reference for acceleration node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the direction of acceleration on the particle.
	     */
	    static ACCELERATION_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleAccelerationNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
	     */
	    constructor(mode: number, acceleration?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    pGetAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleAccelerationState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleAccelerationNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleBezierCurveState = require("awayjs-renderergl/lib/animators/states/ParticleBezierCurveState");
	/**
	 * A particle animation node used to control the position of a particle over time along a bezier curve.
	 */
	class ParticleBezierCurveNode extends ParticleNodeBase {
	    /** @private */
	    _iControlPoint: Vector3D;
	    /** @private */
	    _iEndPoint: Vector3D;
	    /**
	     * Reference for bezier curve node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the control point position (0, 1, 2) of the curve.
	     */
	    static BEZIER_CONTROL_VECTOR3D: string;
	    /**
	     * Reference for bezier curve node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the end point position (0, 1, 2) of the curve.
	     */
	    static BEZIER_END_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleBezierCurveNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
	     * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
	     */
	    constructor(mode: number, controlPoint?: Vector3D, endPoint?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleBezierCurveState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleBezierCurveNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleBillboardState = require("awayjs-renderergl/lib/animators/states/ParticleBillboardState");
	/**
	 * A particle animation node that controls the rotation of a particle to always face the camera.
	 */
	class ParticleBillboardNode extends ParticleNodeBase {
	    /** @private */
	    _iBillboardAxis: Vector3D;
	    /**
	     * Creates a new <code>ParticleBillboardNode</code>
	     */
	    constructor(billboardAxis?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleBillboardState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleBillboardNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleColorNode" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleColorState = require("awayjs-renderergl/lib/animators/states/ParticleColorState");
	/**
	 * A particle animation node used to control the color variation of a particle over time.
	 */
	class ParticleColorNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesMultiplier: boolean;
	    /** @private */
	    _iUsesOffset: boolean;
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iStartColor: ColorTransform;
	    /** @private */
	    _iEndColor: ColorTransform;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /**
	     * Reference for color node properties on a single particle (when in local property mode).
	     * Expects a <code>ColorTransform</code> object representing the start color transform applied to the particle.
	     */
	    static COLOR_START_COLORTRANSFORM: string;
	    /**
	     * Reference for color node properties on a single particle (when in local property mode).
	     * Expects a <code>ColorTransform</code> object representing the end color transform applied to the particle.
	     */
	    static COLOR_END_COLORTRANSFORM: string;
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
	    constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, usesCycle?: boolean, usesPhase?: boolean, startColor?: ColorTransform, endColor?: ColorTransform, cycleDuration?: number, cyclePhase?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleColorState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleColorNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleFollowNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleFollowState = require("awayjs-renderergl/lib/animators/states/ParticleFollowState");
	/**
	 * A particle animation node used to create a follow behaviour on a particle system.
	 */
	class ParticleFollowNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesPosition: boolean;
	    /** @private */
	    _iUsesRotation: boolean;
	    /** @private */
	    _iSmooth: boolean;
	    /**
	     * Creates a new <code>ParticleFollowNode</code>
	     *
	     * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
	     * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
	     * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
	     */
	    constructor(usesPosition?: boolean, usesRotation?: boolean, smooth?: boolean);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleFollowState;
	}
	export = ParticleFollowNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	/**
	 *
	 */
	class ParticleInitialColorNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesMultiplier: boolean;
	    /** @private */
	    _iUsesOffset: boolean;
	    /** @private */
	    _iInitialColor: ColorTransform;
	    /**
	     * Reference for color node properties on a single particle (when in local property mode).
	     * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
	     */
	    static COLOR_INITIAL_COLORTRANSFORM: string;
	    constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, initialColor?: ColorTransform);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleInitialColorNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleNodeBase" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	/**
	 * Provides an abstract base class for particle animation nodes.
	 */
	class ParticleNodeBase extends AnimationNodeBase {
	    private _priority;
	    _pMode: number;
	    _pDataLength: number;
	    _pOneData: Array<number>;
	    _iDataOffset: number;
	    private static GLOBAL;
	    private static LOCAL_STATIC;
	    private static LOCAL_DYNAMIC;
	    private static MODES;
	    /**
	     * Returns the property mode of the particle animation node. Typically set in the node constructor
	     *
	     * @see away.animators.ParticlePropertiesMode
	     */
	    mode: number;
	    /**
	     * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
	     *
	     * @see away.animators.ParticleAnimationSet
	     * @see #getAGALVertexCode
	     */
	    priority: number;
	    /**
	     * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
	     *
	     * @see away.animators.ParticleAnimationSet
	     * @see #getAGALVertexCode
	     */
	    dataLength: number;
	    /**
	     * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
	     *
	     * @see away.animators.ParticleAnimationSet
	     * @see #generatePropertyOfOneParticle
	     */
	    oneData: Array<number>;
	    /**
	     * Creates a new <code>ParticleNodeBase</code> object.
	     *
	     * @param               name            Defines the generic name of the particle animation node.
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
	     * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
	     */
	    constructor(name: string, mode: number, dataLength: number, priority?: number);
	    /**
	     * Returns the AGAL code of the particle animation node for use in the vertex shader.
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Returns the AGAL code of the particle animation node for use in the fragment shader.
	     */
	    getAGALFragmentCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
	     */
	    getAGALUVCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
	     *
	     * @see away.animators.ParticleAnimationSet#initParticleFunc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	    /**
	     * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleNodeBase;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleOrbitState = require("awayjs-renderergl/lib/animators/states/ParticleOrbitState");
	/**
	 * A particle animation node used to control the position of a particle over time around a circular orbit.
	 */
	class ParticleOrbitNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesEulers: boolean;
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iRadius: number;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /** @private */
	    _iEulers: Vector3D;
	    /**
	     * Reference for orbit node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the radius (x), cycle speed (y) and cycle phase (z) of the motion on the particle.
	     */
	    static ORBIT_VECTOR3D: string;
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
	    constructor(mode: number, usesEulers?: boolean, usesCycle?: boolean, usesPhase?: boolean, radius?: number, cycleDuration?: number, cyclePhase?: number, eulers?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleOrbitState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleOrbitNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleOscillatorState = require("awayjs-renderergl/lib/animators/states/ParticleOscillatorState");
	/**
	 * A particle animation node used to control the position of a particle over time using simple harmonic motion.
	 */
	class ParticleOscillatorNode extends ParticleNodeBase {
	    /** @private */
	    _iOscillator: Vector3D;
	    /**
	     * Reference for ocsillator node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the axis (x,y,z) and cycle speed (w) of the motion on the particle.
	     */
	    static OSCILLATOR_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleOscillatorNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
	     */
	    constructor(mode: number, oscillator?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleOscillatorState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleOscillatorNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticlePositionNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticlePositionState = require("awayjs-renderergl/lib/animators/states/ParticlePositionState");
	/**
	 * A particle animation node used to set the starting position of a particle.
	 */
	class ParticlePositionNode extends ParticleNodeBase {
	    /** @private */
	    _iPosition: Vector3D;
	    /**
	     * Reference for position node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing position of the particle.
	     */
	    static POSITION_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticlePositionNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
	     */
	    constructor(mode: number, position?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticlePositionState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticlePositionNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleRotateToHeadingState = require("awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState");
	/**
	 * A particle animation node used to control the rotation of a particle to match its heading vector.
	 */
	class ParticleRotateToHeadingNode extends ParticleNodeBase {
	    /**
	     * Creates a new <code>ParticleBillboardNode</code>
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleRotateToHeadingState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleRotateToHeadingNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleRotateToPositionState = require("awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState");
	/**
	 * A particle animation node used to control the rotation of a particle to face to a position
	 */
	class ParticleRotateToPositionNode extends ParticleNodeBase {
	    /** @private */
	    _iPosition: Vector3D;
	    /**
	     * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the position that the particle must face.
	     */
	    static POSITION_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleRotateToPositionNode</code>
	     */
	    constructor(mode: number, position?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleRotateToPositionState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleRotateToPositionNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleRotationalVelocityState = require("awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState");
	/**
	 * A particle animation node used to set the starting rotational velocity of a particle.
	 */
	class ParticleRotationalVelocityNode extends ParticleNodeBase {
	    /** @private */
	    _iRotationalVelocity: Vector3D;
	    /**
	     * Reference for rotational velocity node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
	     */
	    static ROTATIONALVELOCITY_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleRotationalVelocityNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     */
	    constructor(mode: number, rotationalVelocity?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleRotationalVelocityState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleRotationalVelocityNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleScaleNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleScaleState = require("awayjs-renderergl/lib/animators/states/ParticleScaleState");
	/**
	 * A particle animation node used to control the scale variation of a particle over time.
	 */
	class ParticleScaleNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iMinScale: number;
	    /** @private */
	    _iMaxScale: number;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /**
	     * Reference for scale node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> representing the min scale (x), max scale(y), optional cycle speed (z) and phase offset (w) applied to the particle.
	     */
	    static SCALE_VECTOR3D: string;
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
	    constructor(mode: number, usesCycle: boolean, usesPhase: boolean, minScale?: number, maxScale?: number, cycleDuration?: number, cyclePhase?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleScaleState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleScaleNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ColorSegmentPoint = require("awayjs-renderergl/lib/animators/data/ColorSegmentPoint");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	/**
	 *
	 */
	class ParticleSegmentedColorNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesMultiplier: boolean;
	    /** @private */
	    _iUsesOffset: boolean;
	    /** @private */
	    _iStartColor: ColorTransform;
	    /** @private */
	    _iEndColor: ColorTransform;
	    /** @private */
	    _iNumSegmentPoint: number;
	    /** @private */
	    _iSegmentPoints: Array<ColorSegmentPoint>;
	    constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: ColorTransform, endColor: ColorTransform, segmentPoints: Array<ColorSegmentPoint>);
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	}
	export = ParticleSegmentedColorNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleSpriteSheetState = require("awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState");
	/**
	 * A particle animation node used when a spritesheet texture is required to animate the particle.
	 * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
	 */
	class ParticleSpriteSheetNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iTotalFrames: number;
	    /** @private */
	    _iNumColumns: number;
	    /** @private */
	    _iNumRows: number;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /**
	     * Reference for spritesheet node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
	     */
	    static UV_VECTOR3D: string;
	    /**
	     * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
	     */
	    numColumns: number;
	    /**
	     * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
	     */
	    numRows: number;
	    /**
	     * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
	     */
	    totalFrames: number;
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
	    constructor(mode: number, usesCycle: boolean, usesPhase: boolean, numColumns?: number, numRows?: number, cycleDuration?: number, cyclePhase?: number, totalFrames?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleSpriteSheetState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleSpriteSheetNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleTimeNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleTimeState = require("awayjs-renderergl/lib/animators/states/ParticleTimeState");
	/**
	 * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
	 */
	class ParticleTimeNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesDuration: boolean;
	    /** @private */
	    _iUsesDelay: boolean;
	    /** @private */
	    _iUsesLooping: boolean;
	    /**
	     * Creates a new <code>ParticleTimeNode</code>
	     *
	     * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
	     * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
	     * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
	     */
	    constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleTimeState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleTimeNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleUVNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleUVState = require("awayjs-renderergl/lib/animators/states/ParticleUVState");
	/**
	 * A particle animation node used to control the UV offset and scale of a particle over time.
	 */
	class ParticleUVNode extends ParticleNodeBase {
	    /** @private */
	    _iUvData: Vector3D;
	    /**
	     *
	     */
	    static U_AXIS: string;
	    /**
	     *
	     */
	    static V_AXIS: string;
	    private _cycle;
	    private _scale;
	    private _axis;
	    /**
	     * Creates a new <code>ParticleTimeNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] cycle           Defines whether the time track is in loop mode. Defaults to false.
	     * @param    [optional] scale           Defines whether the time track is in loop mode. Defaults to false.
	     * @param    [optional] axis            Defines whether the time track is in loop mode. Defaults to false.
	     */
	    constructor(mode: number, cycle?: number, scale?: number, axis?: string);
	    /**
	     *
	     */
	    cycle: number;
	    /**
	     *
	     */
	    scale: number;
	    /**
	     *
	     */
	    axis: string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleUVState;
	    private updateUVData();
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleUVNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleVelocityState = require("awayjs-renderergl/lib/animators/states/ParticleVelocityState");
	/**
	 * A particle animation node used to set the starting velocity of a particle.
	 */
	class ParticleVelocityNode extends ParticleNodeBase {
	    /** @private */
	    _iVelocity: Vector3D;
	    /**
	     * Reference for velocity node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
	     */
	    static VELOCITY_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleVelocityNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
	     */
	    constructor(mode: number, velocity?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shader: ShaderBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleVelocityState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleVelocityNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonBinaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
	/**
	 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class SkeletonBinaryLERPNode extends AnimationNodeBase {
	    /**
	     * Defines input node A to use for the blended output.
	     */
	    inputA: AnimationNodeBase;
	    /**
	     * Defines input node B to use for the blended output.
	     */
	    inputB: AnimationNodeBase;
	    /**
	     * Creates a new <code>SkeletonBinaryLERPNode</code> object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonBinaryLERPState;
	}
	export = SkeletonBinaryLERPNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/SkeletonClipNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
	import SkeletonClipState = require("awayjs-renderergl/lib/animators/states/SkeletonClipState");
	/**
	 * A skeleton animation node containing time-based animation data as individual skeleton poses.
	 */
	class SkeletonClipNode extends AnimationClipNodeBase {
	    private _frames;
	    /**
	     * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
	     * of the output skeleton pose. Defaults to false.
	     */
	    highQuality: boolean;
	    /**
	     * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
	     */
	    frames: Array<SkeletonPose>;
	    /**
	     * Creates a new <code>SkeletonClipNode</code> object.
	     */
	    constructor();
	    /**
	     * Adds a skeleton pose frame to the internal timeline of the animation node.
	     *
	     * @param skeletonPose The skeleton pose object to add to the timeline of the node.
	     * @param duration The specified duration of the frame in milliseconds.
	     */
	    addFrame(skeletonPose: SkeletonPose, duration: number): void;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonClipState;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateStitch(): void;
	}
	export = SkeletonClipNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonDifferenceState = require("awayjs-renderergl/lib/animators/states/SkeletonDifferenceState");
	/**
	 * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
	 */
	class SkeletonDifferenceNode extends AnimationNodeBase {
	    /**
	     * Defines a base input node to use for the blended output.
	     */
	    baseInput: AnimationNodeBase;
	    /**
	     * Defines a difference input node to use for the blended output.
	     */
	    differenceInput: AnimationNodeBase;
	    /**
	     * Creates a new <code>SkeletonAdditiveNode</code> object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonDifferenceState;
	}
	export = SkeletonDifferenceNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonDirectionalState = require("awayjs-renderergl/lib/animators/states/SkeletonDirectionalState");
	/**
	 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
	 */
	class SkeletonDirectionalNode extends AnimationNodeBase {
	    /**
	     * Defines the forward configured input node to use for the blended output.
	     */
	    forward: AnimationNodeBase;
	    /**
	     * Defines the backwards configured input node to use for the blended output.
	     */
	    backward: AnimationNodeBase;
	    /**
	     * Defines the left configured input node to use for the blended output.
	     */
	    left: AnimationNodeBase;
	    /**
	     * Defines the right configured input node to use for the blended output.
	     */
	    right: AnimationNodeBase;
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonDirectionalState;
	}
	export = SkeletonDirectionalNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonNaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState");
	/**
	 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class SkeletonNaryLERPNode extends AnimationNodeBase {
	    _iInputs: Array<AnimationNodeBase>;
	    private _numInputs;
	    numInputs: number;
	    /**
	     * Creates a new <code>SkeletonNaryLERPNode</code> object.
	     */
	    constructor();
	    /**
	     * Returns an integer representing the input index of the given skeleton animation node.
	     *
	     * @param input The skeleton animation node for with the input index is requested.
	     */
	    getInputIndex(input: AnimationNodeBase): number;
	    /**
	     * Returns the skeleton animation node object that resides at the given input index.
	     *
	     * @param index The input index for which the skeleton animation node is requested.
	     */
	    getInputAt(index: number): AnimationNodeBase;
	    /**
	     * Adds a new skeleton animation node input to the animation node.
	     */
	    addInput(input: AnimationNodeBase): void;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonNaryLERPState;
	}
	export = SkeletonNaryLERPNode;
	
}

declare module "awayjs-renderergl/lib/animators/nodes/VertexClipNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Graphics = require("awayjs-display/lib/graphics/Graphics");
	import AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
	/**
	 * A vertex animation node containing time-based animation data as individual geometry obejcts.
	 */
	class VertexClipNode extends AnimationClipNodeBase {
	    private _frames;
	    private _translations;
	    /**
	     * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
	     */
	    frames: Array<Graphics>;
	    /**
	     * Creates a new <code>VertexClipNode</code> object.
	     */
	    constructor();
	    /**
	     * Adds a geometry object to the internal timeline of the animation node.
	     *
	     * @param geometry The geometry object to add to the timeline of the node.
	     * @param duration The specified duration of the frame in milliseconds.
	     * @param translation The absolute translation of the frame, used in root delta calculations for sprite movement.
	     */
	    addFrame(geometry: Graphics, duration: number, translation?: Vector3D): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateStitch(): void;
	}
	export = VertexClipNode;
	
}

declare module "awayjs-renderergl/lib/animators/states/AnimationClipState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	/**
	 *
	 */
	class AnimationClipState extends AnimationStateBase {
	    private _animationClipNode;
	    private _animationStatePlaybackComplete;
	    _pBlendWeight: number;
	    _pCurrentFrame: number;
	    _pNextFrame: number;
	    _pOldFrame: number;
	    _pTimeDir: number;
	    _pFramesDirty: boolean;
	    /**
	     * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	     * between the current frame (0) and next frame (1) of the animation.
	     *
	     * @see #currentFrame
	     * @see #nextFrame
	     */
	    blendWeight: number;
	    /**
	     * Returns the current frame of animation in the clip based on the internal playhead position.
	     */
	    currentFrame: number;
	    /**
	     * Returns the next frame of animation in the clip based on the internal playhead position.
	     */
	    nextFrame: number;
	    constructor(animator: AnimatorBase, animationClipNode: AnimationClipNodeBase);
	    /**
	     * @inheritDoc
	     */
	    update(time: number): void;
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
	     *
	     * @see #currentFrame
	     * @see #nextFrame
	     * @see #blendWeight
	     */
	    _pUpdateFrames(): void;
	    private notifyPlaybackComplete();
	}
	export = AnimationClipState;
	
}

declare module "awayjs-renderergl/lib/animators/states/AnimationStateBase" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	/**
	 *
	 */
	class AnimationStateBase implements IAnimationState {
	    _pAnimationNode: AnimationNodeBase;
	    _pRootDelta: Vector3D;
	    _pPositionDeltaDirty: boolean;
	    _pTime: number;
	    _pStartTime: number;
	    _pAnimator: AnimatorBase;
	    /**
	     * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
	     */
	    positionDelta: Vector3D;
	    constructor(animator: AnimatorBase, animationNode: AnimationNodeBase);
	    /**
	     * Resets the start time of the node to a  new value.
	     *
	     * @param startTime The absolute start time (in milliseconds) of the node's starting time.
	     */
	    offset(startTime: number): void;
	    /**
	     * Updates the configuration of the node to its current state.
	     *
	     * @param time The absolute time (in milliseconds) of the animator's play head position.
	     *
	     * @see AnimatorBase#update()
	     */
	    update(time: number): void;
	    /**
	     * Sets the animation phase of the node.
	     *
	     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	     */
	    phase(value: number): void;
	    /**
	     * Updates the node's internal playhead position.
	     *
	     * @param time The local time (in milliseconds) of the node's playhead position.
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Updates the node's root delta position
	     */
	    _pUpdatePositionDelta(): void;
	}
	export = AnimationStateBase;
	
}

declare module "awayjs-renderergl/lib/animators/states/IAnimationState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	interface IAnimationState {
	    positionDelta: Vector3D;
	    offset(startTime: number): any;
	    update(time: number): any;
	    /**
	     * Sets the animation phase of the node.
	     *
	     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	     */
	    phase(value: number): any;
	}
	export = IAnimationState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ISkeletonAnimationState" {
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	interface ISkeletonAnimationState extends IAnimationState {
	    /**
	     * Returns the output skeleton pose of the animation node.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	}
	export = ISkeletonAnimationState;
	
}

declare module "awayjs-renderergl/lib/animators/states/IVertexAnimationState" {
	import Graphics = require("awayjs-display/lib/graphics/Graphics");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	/**
	 * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
	 *
	 * @see away.animators.VertexAnimator
	 */
	interface IVertexAnimationState extends IAnimationState {
	    /**
	     * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	     */
	    currentGraphics: Graphics;
	    /**
	     * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	     */
	    nextGraphics: Graphics;
	    /**
	     * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	     * between the current geometry frame (0) and next geometry frame (1) of the animation.
	     */
	    blendWeight: number;
	}
	export = IVertexAnimationState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleAccelerationState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleAccelerationNode = require("awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleAccelerationState extends ParticleStateBase {
	    /** @private */
	    static ACCELERATION_INDEX: number;
	    private _particleAccelerationNode;
	    private _acceleration;
	    private _halfAcceleration;
	    /**
	     * Defines the acceleration vector of the state, used when in global mode.
	     */
	    acceleration: Vector3D;
	    constructor(animator: ParticleAnimator, particleAccelerationNode: ParticleAccelerationNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateAccelerationData();
	}
	export = ParticleAccelerationState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleBezierCurveState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleBezierCurveNode = require("awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleBezierCurveState extends ParticleStateBase {
	    /** @private */
	    static BEZIER_CONTROL_INDEX: number;
	    /** @private */
	    static BEZIER_END_INDEX: number;
	    private _particleBezierCurveNode;
	    private _controlPoint;
	    private _endPoint;
	    /**
	     * Defines the default control point of the node, used when in global mode.
	     */
	    controlPoint: Vector3D;
	    /**
	     * Defines the default end point of the node, used when in global mode.
	     */
	    endPoint: Vector3D;
	    constructor(animator: ParticleAnimator, particleBezierCurveNode: ParticleBezierCurveNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleBezierCurveState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleBillboardState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleBillboardNode = require("awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleBillboardState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    private _matrix;
	    private _billboardAxis;
	    /**
	     *
	     */
	    constructor(animator: ParticleAnimator, particleNode: ParticleBillboardNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    /**
	     * Defines the billboard axis.
	     */
	    billboardAxis: Vector3D;
	}
	export = ParticleBillboardState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleColorState" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 * @author ...
	 */
	class ParticleColorState extends ParticleStateBase {
	    /** @private */
	    static START_MULTIPLIER_INDEX: number;
	    /** @private */
	    static DELTA_MULTIPLIER_INDEX: number;
	    /** @private */
	    static START_OFFSET_INDEX: number;
	    /** @private */
	    static DELTA_OFFSET_INDEX: number;
	    /** @private */
	    static CYCLE_INDEX: number;
	    private _particleColorNode;
	    private _usesMultiplier;
	    private _usesOffset;
	    private _usesCycle;
	    private _usesPhase;
	    private _startColor;
	    private _endColor;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _cycleData;
	    private _startMultiplierData;
	    private _deltaMultiplierData;
	    private _startOffsetData;
	    private _deltaOffsetData;
	    /**
	     * Defines the start color transform of the state, when in global mode.
	     */
	    startColor: ColorTransform;
	    /**
	     * Defines the end color transform of the state, when in global mode.
	     */
	    endColor: ColorTransform;
	    /**
	     * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    /**
	     * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    cyclePhase: number;
	    constructor(animator: ParticleAnimator, particleColorNode: ParticleColorNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleColorState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleFollowState" {
	import DisplayObject = require("awayjs-display/lib/display/DisplayObject");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleFollowNode = require("awayjs-renderergl/lib/animators/nodes/ParticleFollowNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleFollowState extends ParticleStateBase {
	    /** @private */
	    static FOLLOW_POSITION_INDEX: number;
	    /** @private */
	    static FOLLOW_ROTATION_INDEX: number;
	    private _particleFollowNode;
	    private _followTarget;
	    private _targetPos;
	    private _targetEuler;
	    private _prePos;
	    private _preEuler;
	    private _smooth;
	    private _temp;
	    constructor(animator: ParticleAnimator, particleFollowNode: ParticleFollowNode);
	    followTarget: DisplayObject;
	    smooth: boolean;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private processPosition(currentTime, deltaTime, animationElements);
	    private precessRotation(currentTime, deltaTime, animationElements);
	    private processPositionAndRotation(currentTime, deltaTime, animationElements);
	}
	export = ParticleFollowState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleInitialColorState" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleInitialColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	*
	*/
	class ParticleInitialColorState extends ParticleStateBase {
	    /** @private */
	    static MULTIPLIER_INDEX: number;
	    /** @private */
	    static OFFSET_INDEX: number;
	    private _particleInitialColorNode;
	    private _usesMultiplier;
	    private _usesOffset;
	    private _initialColor;
	    private _multiplierData;
	    private _offsetData;
	    constructor(animator: ParticleAnimator, particleInitialColorNode: ParticleInitialColorNode);
	    /**
	     * Defines the initial color transform of the state, when in global mode.
	     */
	    initialColor: ColorTransform;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleInitialColorState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleOrbitState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleOrbitNode = require("awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleOrbitState extends ParticleStateBase {
	    /** @private */
	    static ORBIT_INDEX: number;
	    /** @private */
	    static EULERS_INDEX: number;
	    private _particleOrbitNode;
	    private _usesEulers;
	    private _usesCycle;
	    private _usesPhase;
	    private _radius;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _eulers;
	    private _orbitData;
	    private _eulersMatrix;
	    /**
	     * Defines the radius of the orbit when in global mode. Defaults to 100.
	     */
	    radius: number;
	    /**
	     * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    /**
	     * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    cyclePhase: number;
	    /**
	     * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
	     */
	    eulers: Vector3D;
	    constructor(animator: ParticleAnimator, particleOrbitNode: ParticleOrbitNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateOrbitData();
	}
	export = ParticleOrbitState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleOscillatorState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleOscillatorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleOscillatorState extends ParticleStateBase {
	    /** @private */
	    static OSCILLATOR_INDEX: number;
	    private _particleOscillatorNode;
	    private _oscillator;
	    private _oscillatorData;
	    /**
	     * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
	     */
	    oscillator: Vector3D;
	    constructor(animator: ParticleAnimator, particleOscillatorNode: ParticleOscillatorNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateOscillatorData();
	}
	export = ParticleOscillatorState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticlePositionState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticlePositionNode = require("awayjs-renderergl/lib/animators/nodes/ParticlePositionNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 * @author ...
	 */
	class ParticlePositionState extends ParticleStateBase {
	    /** @private */
	    static POSITION_INDEX: number;
	    private _particlePositionNode;
	    private _position;
	    /**
	     * Defines the position of the particle when in global mode. Defaults to 0,0,0.
	     */
	    position: Vector3D;
	    /**
	     *
	     */
	    getPositions(): Array<Vector3D>;
	    setPositions(value: Array<Vector3D>): void;
	    constructor(animator: ParticleAnimator, particlePositionNode: ParticlePositionNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticlePositionState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState" {
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleRotateToHeadingState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    private _matrix;
	    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleRotateToHeadingState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleRotateToPositionNode = require("awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleRotateToPositionState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    /** @private */
	    static POSITION_INDEX: number;
	    private _particleRotateToPositionNode;
	    private _position;
	    private _matrix;
	    private _offset;
	    /**
	     * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
	     */
	    position: Vector3D;
	    constructor(animator: ParticleAnimator, particleRotateToPositionNode: ParticleRotateToPositionNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleRotateToPositionState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleRotationalVelocityNode = require("awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleRotationalVelocityState extends ParticleStateBase {
	    /** @private */
	    static ROTATIONALVELOCITY_INDEX: number;
	    private _particleRotationalVelocityNode;
	    private _rotationalVelocityData;
	    private _rotationalVelocity;
	    /**
	     * Defines the default rotationalVelocity of the state, used when in global mode.
	     */
	    rotationalVelocity: Vector3D;
	    /**
	     *
	     */
	    getRotationalVelocities(): Array<Vector3D>;
	    setRotationalVelocities(value: Array<Vector3D>): void;
	    constructor(animator: ParticleAnimator, particleRotationNode: ParticleRotationalVelocityNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateRotationalVelocityData();
	}
	export = ParticleRotationalVelocityState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleScaleState" {
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleScaleNode = require("awayjs-renderergl/lib/animators/nodes/ParticleScaleNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleScaleState extends ParticleStateBase {
	    /** @private */
	    static SCALE_INDEX: number;
	    private _particleScaleNode;
	    private _usesCycle;
	    private _usesPhase;
	    private _minScale;
	    private _maxScale;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _scaleData;
	    /**
	     * Defines the end scale of the state, when in global mode. Defaults to 1.
	     */
	    minScale: number;
	    /**
	     * Defines the end scale of the state, when in global mode. Defaults to 1.
	     */
	    maxScale: number;
	    /**
	     * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    /**
	     * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    cyclePhase: number;
	    constructor(animator: ParticleAnimator, particleScaleNode: ParticleScaleNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateScaleData();
	}
	export = ParticleScaleState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ColorSegmentPoint = require("awayjs-renderergl/lib/animators/data/ColorSegmentPoint");
	import ParticleSegmentedColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 *
	 */
	class ParticleSegmentedColorState extends ParticleStateBase {
	    /** @private */
	    static START_MULTIPLIER_INDEX: number;
	    /** @private */
	    static START_OFFSET_INDEX: number;
	    /** @private */
	    static TIME_DATA_INDEX: number;
	    private _usesMultiplier;
	    private _usesOffset;
	    private _startColor;
	    private _endColor;
	    private _segmentPoints;
	    private _numSegmentPoint;
	    private _timeLifeData;
	    private _multiplierData;
	    private _offsetData;
	    /**
	     * Defines the start color transform of the state, when in global mode.
	     */
	    startColor: ColorTransform;
	    /**
	     * Defines the end color transform of the state, when in global mode.
	     */
	    endColor: ColorTransform;
	    /**
	     * Defines the number of segments.
	     */
	    numSegmentPoint: number;
	    /**
	     * Defines the key points of color
	     */
	    segmentPoints: Array<ColorSegmentPoint>;
	    usesMultiplier: boolean;
	    usesOffset: boolean;
	    constructor(animator: ParticleAnimator, particleSegmentedColorNode: ParticleSegmentedColorNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleSegmentedColorState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState" {
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleSpriteSheetNode = require("awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleSpriteSheetState extends ParticleStateBase {
	    /** @private */
	    static UV_INDEX_0: number;
	    /** @private */
	    static UV_INDEX_1: number;
	    private _particleSpriteSheetNode;
	    private _usesCycle;
	    private _usesPhase;
	    private _totalFrames;
	    private _numColumns;
	    private _numRows;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _spriteSheetData;
	    /**
	     * Defines the cycle phase, when in global mode. Defaults to zero.
	     */
	    cyclePhase: number;
	    /**
	     * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    constructor(animator: ParticleAnimator, particleSpriteSheetNode: ParticleSpriteSheetNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateSpriteSheetData();
	}
	export = ParticleSpriteSheetState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleStateBase" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleStateBase extends AnimationStateBase {
	    private _particleNode;
	    _pDynamicProperties: Array<Vector3D>;
	    _pDynamicPropertiesDirty: Object;
	    _pNeedUpdateTime: boolean;
	    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase, needUpdateTime?: boolean);
	    needUpdateTime: boolean;
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    _pUpdateDynamicProperties(animationElements: AnimationElements): void;
	}
	export = ParticleStateBase;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleTimeState" {
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleTimeNode = require("awayjs-renderergl/lib/animators/nodes/ParticleTimeNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleTimeState extends ParticleStateBase {
	    /** @private */
	    static TIME_STREAM_INDEX: number;
	    /** @private */
	    static TIME_CONSTANT_INDEX: number;
	    private _particleTimeNode;
	    constructor(animator: ParticleAnimator, particleTimeNode: ParticleTimeNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleTimeState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleUVState" {
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleUVNode = require("awayjs-renderergl/lib/animators/nodes/ParticleUVNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleUVState extends ParticleStateBase {
	    /** @private */
	    static UV_INDEX: number;
	    private _particleUVNode;
	    constructor(animator: ParticleAnimator, particleUVNode: ParticleUVNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleUVState;
	
}

declare module "awayjs-renderergl/lib/animators/states/ParticleVelocityState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationElements = require("awayjs-renderergl/lib/animators/data/AnimationElements");
	import ParticleVelocityNode = require("awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ...
	 */
	class ParticleVelocityState extends ParticleStateBase {
	    /** @private */
	    static VELOCITY_INDEX: number;
	    private _particleVelocityNode;
	    private _velocity;
	    /**
	     * Defines the default velocity vector of the state, used when in global mode.
	     */
	    velocity: Vector3D;
	    /**
	     *
	     */
	    getVelocities(): Array<Vector3D>;
	    setVelocities(value: Array<Vector3D>): void;
	    constructor(animator: ParticleAnimator, particleVelocityNode: ParticleVelocityNode);
	    setRenderState(stage: Stage, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleVelocityState;
	
}

declare module "awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonBinaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonBinaryLERPState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _blendWeight;
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _inputA;
	    private _inputB;
	    /**
	     * Defines a fractional value between 0 and 1 representing the blending ratio between inputA (0) and inputB (1),
	     * used to produce the skeleton pose output.
	     *
	     * @see inputA
	     * @see inputB
	     */
	    blendWeight: number;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonBinaryLERPNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	}
	export = SkeletonBinaryLERPState;
	
}

declare module "awayjs-renderergl/lib/animators/states/SkeletonClipState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonClipNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonClipNode");
	import AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonClipState extends AnimationClipState implements ISkeletonAnimationState {
	    private _rootPos;
	    private _frames;
	    private _skeletonClipNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _currentPose;
	    private _nextPose;
	    /**
	     * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
	     */
	    currentPose: SkeletonPose;
	    /**
	     * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
	     */
	    nextPose: SkeletonPose;
	    constructor(animator: AnimatorBase, skeletonClipNode: SkeletonClipNode);
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateFrames(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the internal playhead position.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	}
	export = SkeletonClipState;
	
}

declare module "awayjs-renderergl/lib/animators/states/SkeletonDifferenceState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonDifferenceNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonDifferenceState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _blendWeight;
	    private static _tempQuat;
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _baseInput;
	    private _differenceInput;
	    /**
	     * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
	     * used to produce the skeleton pose output.
	     *
	     * @see #baseInput
	     * @see #differenceInput
	     */
	    blendWeight: number;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDifferenceNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	}
	export = SkeletonDifferenceState;
	
}

declare module "awayjs-renderergl/lib/animators/states/SkeletonDirectionalState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonDirectionalNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonDirectionalState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _inputA;
	    private _inputB;
	    private _blendWeight;
	    private _direction;
	    private _blendDirty;
	    private _forward;
	    private _backward;
	    private _left;
	    private _right;
	    /**
	     * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
	     * used to produce the skeleton pose output.
	     */
	    direction: number;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDirectionalNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	    /**
	     * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
	     *
	     * @private
	     */
	    private updateBlend();
	}
	export = SkeletonDirectionalState;
	
}

declare module "awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonNaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonNaryLERPState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _blendWeights;
	    private _inputs;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonNaryLERPNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
	     *
	     * @param index The input index for which the skeleton animation node blend weight is requested.
	     */
	    getBlendWeightAt(index: number): number;
	    /**
	     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
	     *
	     * @param index The input index on which the skeleton animation node blend weight is to be set.
	     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
	     */
	    setBlendWeightAt(index: number, blendWeight: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	}
	export = SkeletonNaryLERPState;
	
}

declare module "awayjs-renderergl/lib/animators/states/VertexClipState" {
	import Graphics = require("awayjs-display/lib/graphics/Graphics");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import VertexClipNode = require("awayjs-renderergl/lib/animators/nodes/VertexClipNode");
	import AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
	import IVertexAnimationState = require("awayjs-renderergl/lib/animators/states/IVertexAnimationState");
	/**
	 *
	 */
	class VertexClipState extends AnimationClipState implements IVertexAnimationState {
	    private _frames;
	    private _vertexClipNode;
	    private _currentGraphics;
	    private _nextGraphics;
	    /**
	     * @inheritDoc
	     */
	    currentGraphics: Graphics;
	    /**
	     * @inheritDoc
	     */
	    nextGraphics: Graphics;
	    constructor(animator: AnimatorBase, vertexClipNode: VertexClipNode);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateFrames(): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	}
	export = VertexClipState;
	
}

declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransition" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
	/**
	 *
	 */
	class CrossfadeTransition implements IAnimationTransition {
	    blendSpeed: number;
	    constructor(blendSpeed: number);
	    getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startBlend: number): AnimationNodeBase;
	}
	export = CrossfadeTransition;
	
}

declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode" {
	import SkeletonBinaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
	/**
	 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class CrossfadeTransitionNode extends SkeletonBinaryLERPNode {
	    blendSpeed: number;
	    startBlend: number;
	    /**
	     * Creates a new <code>CrossfadeTransitionNode</code> object.
	     */
	    constructor();
	}
	export = CrossfadeTransitionNode;
	
}

declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonBinaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
	import CrossfadeTransitionNode = require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode");
	/**
	 *
	 */
	class CrossfadeTransitionState extends SkeletonBinaryLERPState {
	    private _crossfadeTransitionNode;
	    private _animationStateTransitionComplete;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: CrossfadeTransitionNode);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	}
	export = CrossfadeTransitionState;
	
}

declare module "awayjs-renderergl/lib/animators/transitions/IAnimationTransition" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	/**
	 *
	 */
	interface IAnimationTransition {
	    getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startTime: number): AnimationNodeBase;
	}
	export = IAnimationTransition;
	
}

declare module "awayjs-renderergl/lib/elements/ElementsPool" {
	import IAssetClass = require("awayjs-core/lib/library/IAssetClass");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_ElementsBase = require("awayjs-renderergl/lib/elements/GL_ElementsBase");
	/**
	 * @class away.pool.SurfacePool
	 */
	class ElementsPool implements IAbstractionPool {
	    static _abstractionClassPool: Object;
	    private _abstractionPool;
	    private _shader;
	    private _elementsClass;
	    /**
	     * //TODO
	     *
	     * @param surfaceClassGL
	     */
	    constructor(shader: ShaderBase, elementsClass: IElementsClassGL);
	    /**
	     * //TODO
	     *
	     * @param renderable
	     * @returns IRenderable
	     */
	    getAbstraction(elements: ElementsBase): GL_ElementsBase;
	    /**
	     * //TODO
	     *
	     * @param renderable
	     */
	    clearAbstraction(elements: ElementsBase): void;
	    /**
	     *
	     * @param imageObjectClass
	     */
	    static registerAbstraction(elementsClass: IElementsClassGL, assetClass: IAssetClass): void;
	}
	export = ElementsPool;
	
}

declare module "awayjs-renderergl/lib/elements/GL_ElementsBase" {
	import AttributesView = require("awayjs-core/lib/attributes/AttributesView");
	import AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import GL_AttributesBuffer = require("awayjs-stagegl/lib/attributes/GL_AttributesBuffer");
	import Camera = require("awayjs-display/lib/display/Camera");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import ElementsEvent = require("awayjs-display/lib/events/ElementsEvent");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	import IEntity = require("awayjs-display/lib/display/IEntity");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	/**
	 *
	 * @class away.pool.GL_ElementsBaseBase
	 */
	class GL_ElementsBase extends AbstractionBase {
	    usages: number;
	    private _elements;
	    _shader: ShaderBase;
	    _stage: Stage;
	    private _onInvalidateIndicesDelegate;
	    private _onClearIndicesDelegate;
	    private _onInvalidateVerticesDelegate;
	    private _onClearVerticesDelegate;
	    private _overflow;
	    private _indices;
	    private _indicesUpdated;
	    private _vertices;
	    private _verticesUpdated;
	    _indexMappings: Array<number>;
	    private _numIndices;
	    private _numVertices;
	    elements: ElementsBase;
	    /**
	     *
	     */
	    numIndices: number;
	    constructor(elements: ElementsBase, shader: ShaderBase, pool: IAbstractionPool);
	    /**
	     *
	     */
	    getIndexMappings(): Array<number>;
	    /**
	     *
	     */
	    getIndexBufferVO(): GL_AttributesBuffer;
	    /**
	     *
	     */
	    getVertexBufferVO(attributesView: AttributesView): GL_AttributesBuffer;
	    /**
	     *
	     */
	    activateVertexBufferVO(index: number, attributesView: AttributesView, dimensions?: number, offset?: number): void;
	    /**
	     *
	     */
	    onClear(event: AssetEvent): void;
	    _iRender(sourceEntity: IEntity, camera: Camera, viewProjection: Matrix3D): void;
	    _render(sourceEntity: IEntity, camera: Camera, viewProjection: Matrix3D): void;
	    _drawElements(firstIndex: number, numIndices: number): void;
	    _drawArrays(firstVertex: number, numVertices: number): void;
	    /**
	     * //TODO
	     *
	     * @private
	     */
	    _updateIndices(indexOffset?: number): void;
	    /**
	     * //TODO
	     *
	     * @param attributesView
	     * @private
	     */
	    private _updateVertices(attributesView);
	    /**
	     * //TODO
	     *
	     * @param event
	     * @private
	     */
	    _onInvalidateIndices(event: ElementsEvent): void;
	    /**
	     * //TODO
	     *
	     * @param event
	     * @private
	     */
	    _onClearIndices(event: ElementsEvent): void;
	    /**
	     * //TODO
	     *
	     * @param event
	     * @private
	     */
	    _onInvalidateVertices(event: ElementsEvent): void;
	    /**
	     * //TODO
	     *
	     * @param event
	     * @private
	     */
	    _onClearVertices(event: ElementsEvent): void;
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
	    _pGetOverflowElements(): GL_ElementsBase;
	}
	export = GL_ElementsBase;
	
}

declare module "awayjs-renderergl/lib/elements/GL_LineElements" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import LineElements = require("awayjs-display/lib/graphics/LineElements");
	import Camera = require("awayjs-display/lib/display/Camera");
	import GL_ElementsBase = require("awayjs-renderergl/lib/elements/GL_ElementsBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import IEntity = require("awayjs-display/lib/display/IEntity");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	/**
	 *
	 * @class away.pool.GL_LineElements
	 */
	class GL_LineElements extends GL_ElementsBase {
	    static pONE_VECTOR: Float32Array;
	    static pFRONT_VECTOR: Float32Array;
	    static vertexAttributesOffset: number;
	    static _iIncludeDependencies(shader: ShaderBase): void;
	    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    private _constants;
	    private _calcMatrix;
	    private _thickness;
	    private _lineElements;
	    constructor(lineElements: LineElements, shader: ShaderBase, pool: IAbstractionPool);
	    onClear(event: AssetEvent): void;
	    _render(sourceEntity: IEntity, camera: Camera, viewProjection: Matrix3D): void;
	    _drawElements(firstIndex: number, numIndices: number): void;
	    _drawArrays(firstVertex: number, numVertices: number): void;
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
	    _pGetOverflowElements(): GL_ElementsBase;
	}
	export = GL_LineElements;
	
}

declare module "awayjs-renderergl/lib/elements/GL_SkyboxElements" {
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import GL_TriangleElements = require("awayjs-renderergl/lib/elements/GL_TriangleElements");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	/**
	 *
	 * @class away.pool.GL_SkyboxElements
	 */
	class GL_SkyboxElements extends GL_TriangleElements {
	    static vertexAttributesOffset: number;
	    static _iIncludeDependencies(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = GL_SkyboxElements;
	
}

declare module "awayjs-renderergl/lib/elements/GL_TriangleElements" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import TriangleElements = require("awayjs-display/lib/graphics/TriangleElements");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import GL_ElementsBase = require("awayjs-renderergl/lib/elements/GL_ElementsBase");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	import IEntity = require("awayjs-display/lib/display/IEntity");
	/**
	 *
	 * @class away.pool.GL_TriangleElements
	 */
	class GL_TriangleElements extends GL_ElementsBase {
	    static vertexAttributesOffset: number;
	    static _iIncludeDependencies(shader: ShaderBase): void;
	    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    private _triangleElements;
	    constructor(triangleElements: TriangleElements, shader: ShaderBase, pool: IAbstractionPool);
	    onClear(event: AssetEvent): void;
	    _render(sourceEntity: IEntity, camera: Camera, viewProjection: Matrix3D): void;
	    _drawElements(firstIndex: number, numIndices: number): void;
	    _drawArrays(firstVertex: number, numVertices: number): void;
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
	    _pGetOverflowElements(): GL_ElementsBase;
	}
	export = GL_TriangleElements;
	
}

declare module "awayjs-renderergl/lib/elements/IElementsClassGL" {
	import ElementsPool = require("awayjs-renderergl/lib/elements/ElementsPool");
	import GL_ElementsBase = require("awayjs-renderergl/lib/elements/GL_ElementsBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	/**
	 * IElementsClassGL is an interface for the constructable class definition IRenderable that is used to
	 * create renderable objects in the rendering pipeline to render the contents of a partition
	 *
	 * @class away.render.IElementsClassGL
	 */
	interface IElementsClassGL {
	    vertexAttributesOffset: number;
	    /**
	     *
	     */
	    new (elements: ElementsBase, shader: ShaderBase, pool: ElementsPool): GL_ElementsBase;
	    _iIncludeDependencies(shader: ShaderBase): any;
	    _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = IElementsClassGL;
	
}

declare module "awayjs-renderergl/lib/errors/AnimationSetError" {
	import ErrorBase = require("awayjs-core/lib/errors/ErrorBase");
	class AnimationSetError extends ErrorBase {
	    constructor(message: string);
	}
	export = AnimationSetError;
	
}

declare module "awayjs-renderergl/lib/events/AnimationStateEvent" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import EventBase = require("awayjs-core/lib/events/EventBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	/**
	 * Dispatched to notify changes in an animation state's state.
	 */
	class AnimationStateEvent extends EventBase {
	    /**
	     * Dispatched when a non-looping clip node inside an animation state reaches the end of its timeline.
	     */
	    static PLAYBACK_COMPLETE: string;
	    static TRANSITION_COMPLETE: string;
	    private _animator;
	    private _animationState;
	    private _animationNode;
	    /**
	     * Create a new <code>AnimatonStateEvent</code>
	     *
	     * @param type The event type.
	     * @param animator The animation state object that is the subject of this event.
	     * @param animationNode The animation node inside the animation state from which the event originated.
	     */
	    constructor(type: string, animator: AnimatorBase, animationState: IAnimationState, animationNode: AnimationNodeBase);
	    /**
	     * The animator object that is the subject of this event.
	     */
	    animator: AnimatorBase;
	    /**
	     * The animation state object that is the subject of this event.
	     */
	    animationState: IAnimationState;
	    /**
	     * The animation node inside the animation state from which the event originated.
	     */
	    animationNode: AnimationNodeBase;
	    /**
	     * Clones the event.
	     *
	     * @return An exact duplicate of the current object.
	     */
	    clone(): AnimationStateEvent;
	}
	export = AnimationStateEvent;
	
}

declare module "awayjs-renderergl/lib/events/AnimatorEvent" {
	import EventBase = require("awayjs-core/lib/events/EventBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	/**
	 * Dispatched to notify changes in an animator's state.
	 */
	class AnimatorEvent extends EventBase {
	    /**
	     * Defines the value of the type property of a start event object.
	     */
	    static START: string;
	    /**
	     * Defines the value of the type property of a stop event object.
	     */
	    static STOP: string;
	    /**
	     * Defines the value of the type property of a cycle complete event object.
	     */
	    static CYCLE_COMPLETE: string;
	    private _animator;
	    /**
	     * Create a new <code>AnimatorEvent</code> object.
	     *
	     * @param type The event type.
	     * @param animator The animator object that is the subject of this event.
	     */
	    constructor(type: string, animator: AnimatorBase);
	    animator: AnimatorBase;
	    /**
	     * Clones the event.
	     *
	     * @return An exact duplicate of the current event object.
	     */
	    clone(): AnimatorEvent;
	}
	export = AnimatorEvent;
	
}

declare module "awayjs-renderergl/lib/events/PassEvent" {
	import EventBase = require("awayjs-core/lib/events/EventBase");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	class PassEvent extends EventBase {
	    /**
	     *
	     */
	    static INVALIDATE: string;
	    private _pass;
	    /**
	     *
	     */
	    pass: IPass;
	    constructor(type: string, pass: IPass);
	    /**
	     *
	     */
	    clone(): PassEvent;
	}
	export = PassEvent;
	
}

declare module "awayjs-renderergl/lib/events/RTTEvent" {
	import EventBase = require("awayjs-core/lib/events/EventBase");
	import RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
	class RTTEvent extends EventBase {
	    /**
	     *
	     */
	    static RESIZE: string;
	    private _rttManager;
	    /**
	     *
	     */
	    rttManager: RTTBufferManager;
	    constructor(type: string, rttManager: RTTBufferManager);
	    /**
	     *
	     */
	    clone(): RTTEvent;
	}
	export = RTTEvent;
	
}

declare module "awayjs-renderergl/lib/events/ShadingMethodEvent" {
	import EventBase = require("awayjs-core/lib/events/EventBase");
	class ShadingMethodEvent extends EventBase {
	    static SHADER_INVALIDATED: string;
	    constructor(type: string);
	}
	export = ShadingMethodEvent;
	
}

declare module "awayjs-renderergl/lib/filters/BlurFilter3D" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	class BlurFilter3D extends Filter3DBase {
	    private _hBlurTask;
	    private _vBlurTask;
	    /**
	     * Creates a new BlurFilter3D object
	     * @param blurX The amount of horizontal blur to apply
	     * @param blurY The amount of vertical blur to apply
	     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	     */
	    constructor(blurX?: number, blurY?: number, stepSize?: number);
	    blurX: number;
	    blurY: number;
	    /**
	     * The distance between two blur samples. Set to -1 to autodetect with acceptable quality (default value).
	     * Higher values provide better performance at the cost of reduces quality.
	     */
	    stepSize: number;
	    setRenderTargets(mainTarget: Image2D, stage: Stage): void;
	}
	export = BlurFilter3D;
	
}

declare module "awayjs-renderergl/lib/filters/CompositeFilter3D" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	class CompositeFilter3D extends Filter3DBase {
	    private _compositeTask;
	    /**
	     * Creates a new CompositeFilter3D object
	     * @param blurX The amount of horizontal blur to apply
	     * @param blurY The amount of vertical blur to apply
	     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	     */
	    constructor(blendMode: string, exposure?: number);
	    exposure: number;
	    overlayTexture: Image2D;
	}
	export = CompositeFilter3D;
	
}

declare module "awayjs-renderergl/lib/filters/FXAAFilter3D" {
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	class FXAAFilter3D extends Filter3DBase {
	    private _fxaaTask;
	    /**
	     * Creates a new FXAAFilter3D object
	     * @param amount
	     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	     */
	    constructor(amount: number, stepSize?: number);
	    amount: number;
	    stepSize: number;
	}
	export = FXAAFilter3D;
	
}

declare module "awayjs-renderergl/lib/filters/Filter3DBase" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
	import RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
	class Filter3DBase {
	    private _tasks;
	    private _requireDepthRender;
	    private _rttManager;
	    private _textureWidth;
	    private _textureHeight;
	    constructor();
	    requireDepthRender: boolean;
	    addTask(filter: Filter3DTaskBase): void;
	    tasks: Filter3DTaskBase[];
	    getMainInputTexture(stage: Stage): Image2D;
	    textureWidth: number;
	    rttManager: RTTBufferManager;
	    textureHeight: number;
	    setRenderTargets(mainTarget: Image2D, stage: Stage): void;
	    dispose(): void;
	    update(stage: Stage, camera: Camera): void;
	}
	export = Filter3DBase;
	
}

declare module "awayjs-renderergl/lib/filters/tasks/Filter3DCompositeTask" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
	class Filter3DCompositeTask extends Filter3DTaskBase {
	    private _data;
	    private _overlayTexture;
	    private _overlayWidth;
	    private _overlayHeight;
	    private _blendMode;
	    constructor(blendMode: string, exposure?: number);
	    overlayTexture: Image2D;
	    exposure: number;
	    getFragmentCode(): string;
	    activate(stage: Stage, camera3D: Camera, depthTexture: Image2D): void;
	    deactivate(stage: Stage): void;
	}
	export = Filter3DCompositeTask;
	
}

declare module "awayjs-renderergl/lib/filters/tasks/Filter3DFXAATask" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
	class Filter3DFXAATask extends Filter3DTaskBase {
	    private _data;
	    private static MAX_AUTO_SAMPLES;
	    private _amount;
	    private _stepSize;
	    private _realStepSize;
	    /**
	     *
	     * @param amount
	     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	     */
	    constructor(amount?: number, stepSize?: number);
	    amount: number;
	    stepSize: number;
	    getFragmentCode(): string;
	    activate(stage: Stage, camera3D: Camera, depthTexture: Image2D): void;
	    updateTextures(stage: Stage): void;
	    private updateBlurData();
	    private calculateStepSize();
	}
	export = Filter3DFXAATask;
	
}

declare module "awayjs-renderergl/lib/filters/tasks/Filter3DHBlurTask" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
	class Filter3DHBlurTask extends Filter3DTaskBase {
	    private static MAX_AUTO_SAMPLES;
	    private _amount;
	    private _data;
	    private _stepSize;
	    private _realStepSize;
	    /**
	     * Creates a new Filter3DHDepthOfFFieldTask
	     * @param amount The maximum amount of blur to apply in pixels at the most out-of-focus areas
	     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	     */
	    constructor(amount: number, stepSize?: number);
	    amount: number;
	    stepSize: number;
	    getFragmentCode(): string;
	    activate(stage: Stage, camera3D: Camera, depthTexture: Image2D): void;
	    updateTextures(stage: Stage): void;
	    private updateBlurData();
	    private calculateStepSize();
	}
	export = Filter3DHBlurTask;
	
}

declare module "awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IProgram = require("awayjs-stagegl/lib/base/IProgram");
	import RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
	class Filter3DTaskBase {
	    private _mainInputTexture;
	    _scaledTextureWidth: number;
	    _scaledTextureHeight: number;
	    _rttManager: RTTBufferManager;
	    _textureWidth: number;
	    _textureHeight: number;
	    private _textureDimensionsInvalid;
	    private _program3DInvalid;
	    private _program3D;
	    private _target;
	    private _requireDepthRender;
	    private _textureScale;
	    constructor(requireDepthRender?: boolean);
	    /**
	     * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
	     */
	    textureScale: number;
	    target: Image2D;
	    rttManager: RTTBufferManager;
	    textureWidth: number;
	    textureHeight: number;
	    getMainInputTexture(stage: Stage): Image2D;
	    dispose(): void;
	    invalidateProgram(): void;
	    updateProgram(stage: Stage): void;
	    getVertexCode(): string;
	    getFragmentCode(): string;
	    updateTextures(stage: Stage): void;
	    getProgram(stage: Stage): IProgram;
	    activate(stage: Stage, camera: Camera, depthTexture: Image2D): void;
	    deactivate(stage: Stage): void;
	    requireDepthRender: boolean;
	}
	export = Filter3DTaskBase;
	
}

declare module "awayjs-renderergl/lib/filters/tasks/Filter3DVBlurTask" {
	import Image2D = require("awayjs-core/lib/image/Image2D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
	class Filter3DVBlurTask extends Filter3DTaskBase {
	    private static MAX_AUTO_SAMPLES;
	    private _amount;
	    private _data;
	    private _stepSize;
	    private _realStepSize;
	    /**
	     *
	     * @param amount
	     * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	     */
	    constructor(amount: number, stepSize?: number);
	    amount: number;
	    stepSize: number;
	    getFragmentCode(): string;
	    activate(stage: Stage, camera3D: Camera, depthTexture: Image2D): void;
	    updateTextures(stage: Stage): void;
	    private updateBlurData();
	    private calculateStepSize();
	}
	export = Filter3DVBlurTask;
	
}

declare module "awayjs-renderergl/lib/managers/RTTBufferManager" {
	import Rectangle = require("awayjs-core/lib/geom/Rectangle");
	import EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IIndexBuffer = require("awayjs-stagegl/lib/base/IIndexBuffer");
	import IVertexBuffer = require("awayjs-stagegl/lib/base/IVertexBuffer");
	class RTTBufferManager extends EventDispatcher {
	    private static _instances;
	    private _renderToTextureVertexBuffer;
	    private _renderToScreenVertexBuffer;
	    private _indexBuffer;
	    private _stage;
	    private _viewWidth;
	    private _viewHeight;
	    private _textureWidth;
	    private _textureHeight;
	    private _renderToTextureRect;
	    private _buffersInvalid;
	    private _textureRatioX;
	    private _textureRatioY;
	    constructor(stage: Stage);
	    static getInstance(stage: Stage): RTTBufferManager;
	    private static getRTTBufferManagerFromStage(stage);
	    private static deleteRTTBufferManager(stage);
	    textureRatioX: number;
	    textureRatioY: number;
	    viewWidth: number;
	    viewHeight: number;
	    renderToTextureVertexBuffer: IVertexBuffer;
	    renderToScreenVertexBuffer: IVertexBuffer;
	    indexBuffer: IIndexBuffer;
	    renderToTextureRect: Rectangle;
	    textureWidth: number;
	    textureHeight: number;
	    dispose(): void;
	    private updateRTTBuffers();
	}
	export = RTTBufferManager;
	
}

declare module "awayjs-renderergl/lib/renderables/GL_BillboardRenderable" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import Billboard = require("awayjs-display/lib/display/Billboard");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * @class away.pool.RenderableListItem
	 */
	class GL_Billboard extends GL_RenderableBase {
	    private static _samplerElements;
	    /**
	     *
	     */
	    private _billboard;
	    _id: number;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param billboard
	     */
	    constructor(billboard: Billboard, renderer: RendererBase);
	    onClear(event: AssetEvent): void;
	    /**
	     * //TODO
	     *
	     * @returns {away.base.TriangleElements}
	     */
	    _pGetElements(): ElementsBase;
	    _pGetSurface(): ISurface;
	}
	export = GL_Billboard;
	
}

declare module "awayjs-renderergl/lib/renderables/GL_GraphicRenderable" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import Graphic = require("awayjs-display/lib/graphics/Graphic");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * @class away.pool.GL_GraphicRenderable
	 */
	class GL_GraphicRenderable extends GL_RenderableBase {
	    /**
	     *
	     */
	    graphic: Graphic;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param graphic
	     * @param level
	     * @param indexOffset
	     */
	    constructor(graphic: Graphic, renderer: RendererBase);
	    onClear(event: AssetEvent): void;
	    /**
	     *
	     * @returns {ElementsBase}
	     * @protected
	     */
	    _pGetElements(): ElementsBase;
	    _pGetSurface(): ISurface;
	}
	export = GL_GraphicRenderable;
	
}

declare module "awayjs-renderergl/lib/renderables/GL_LineSegmentRenderable" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import LineSegment = require("awayjs-display/lib/display/LineSegment");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * @class away.pool.GL_LineSegmentRenderable
	 */
	class GL_LineSegmentRenderable extends GL_RenderableBase {
	    private static _lineGraphics;
	    /**
	     *
	     */
	    private _lineSegment;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param graphic
	     * @param level
	     * @param dataOffset
	     */
	    constructor(lineSegment: LineSegment, renderer: RendererBase);
	    onClear(event: AssetEvent): void;
	    /**
	     * //TODO
	     *
	     * @returns {base.LineElements}
	     * @protected
	     */
	    _pGetElements(): ElementsBase;
	    _pGetSurface(): ISurface;
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
	    _pGetOverflowRenderable(indexOffset: number): GL_RenderableBase;
	}
	export = GL_LineSegmentRenderable;
	
}

declare module "awayjs-renderergl/lib/renderables/GL_RenderableBase" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import Matrix = require("awayjs-core/lib/geom/Matrix");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
	import IRenderable = require("awayjs-display/lib/base/IRenderable");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import IEntity = require("awayjs-display/lib/display/IEntity");
	import Camera = require("awayjs-display/lib/display/Camera");
	import RenderableEvent = require("awayjs-display/lib/events/RenderableEvent");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import GL_ImageBase = require("awayjs-stagegl/lib/image/GL_ImageBase");
	import GL_SamplerBase = require("awayjs-stagegl/lib/image/GL_SamplerBase");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	/**
	 * @class RenderableListItem
	 */
	class GL_RenderableBase extends AbstractionBase {
	    private _onSurfaceUpdatedDelegate;
	    private _onInvalidateElementsDelegate;
	    _elements: ElementsBase;
	    _surfaceGL: GL_SurfaceBase;
	    private _elementsDirty;
	    private _surfaceDirty;
	    JOINT_INDEX_FORMAT: string;
	    JOINT_WEIGHT_FORMAT: string;
	    /**
	     *
	     */
	    _renderer: RendererBase;
	    _stage: Stage;
	    /**
	     *
	     */
	    next: GL_RenderableBase;
	    id: number;
	    /**
	     *
	     */
	    surfaceID: number;
	    /**
	     *
	     */
	    renderOrderId: number;
	    /**
	     *
	     */
	    zIndex: number;
	    /**
	     *
	     */
	    maskId: number;
	    /**
	     *
	     */
	    masksConfig: Array<Array<number>>;
	    /**
	     *
	     */
	    cascaded: boolean;
	    /**
	     *
	     */
	    renderSceneTransform: Matrix3D;
	    /**
	     *
	     */
	    sourceEntity: IEntity;
	    /**
	     *
	     */
	    renderable: IRenderable;
	    uvMatrix: Matrix;
	    images: Array<GL_ImageBase>;
	    samplers: Array<GL_SamplerBase>;
	    elements: ElementsBase;
	    surfaceGL: GL_SurfaceBase;
	    /**
	     *
	     * @param renderable
	     * @param sourceEntity
	     * @param surface
	     * @param renderer
	     */
	    constructor(renderable: IRenderable, sourceEntity: IEntity, renderer: RendererBase);
	    onClear(event: AssetEvent): void;
	    onInvalidateElements(event: RenderableEvent): void;
	    private _onSurfaceUpdated(event);
	    _pGetElements(): ElementsBase;
	    _pGetSurface(): ISurface;
	    /**
	     * Sets the surface state for the pass that is independent of the rendered object. This needs to be called before
	     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	     * @param stage The Stage object which is currently used for rendering.
	     * @param camera The camera from which the scene is viewed.
	     * @private
	     */
	    _iActivate(pass: IPass, camera: Camera): void;
	    /**
	     * Renders an object to the current render target.
	     *
	     * @private
	     */
	    _iRender(pass: IPass, camera: Camera, viewProjection: Matrix3D): void;
	    _setRenderState(pass: IPass, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * Clears the surface state for the pass. This needs to be called before activating another pass.
	     * @param stage The Stage used for rendering
	     *
	     * @private
	     */
	    _iDeactivate(pass: IPass): void;
	    /**
	     * //TODO
	     *
	     * @private
	     */
	    private _updateElements();
	    private _updateSurface();
	}
	export = GL_RenderableBase;
	
}

declare module "awayjs-renderergl/lib/renderables/GL_SkyboxRenderable" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import ElementsBase = require("awayjs-display/lib/graphics/ElementsBase");
	import Skybox = require("awayjs-display/lib/display/Skybox");
	import Camera = require("awayjs-display/lib/display/Camera");
	import RendererBase = require("awayjs-renderergl/lib/RendererBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import PassBase = require("awayjs-renderergl/lib/surfaces/passes/PassBase");
	/**
	 * @class away.pool.GL_SkyboxRenderable
	 */
	class GL_SkyboxRenderable extends GL_RenderableBase {
	    static vertexAttributesOffset: number;
	    /**
	     *
	     */
	    private static _geometry;
	    private _vertexArray;
	    /**
	     *
	     */
	    private _skybox;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param skybox
	     */
	    constructor(skybox: Skybox, renderer: RendererBase);
	    /**
	     * //TODO
	     *
	     * @returns {away.base.TriangleElements}
	     * @private
	     */
	    _pGetElements(): ElementsBase;
	    _pGetSurface(): ISurface;
	    static _iIncludeDependencies(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    static _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    static _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _setRenderState(pass: PassBase, camera: Camera, viewProjection: Matrix3D): void;
	}
	export = GL_SkyboxRenderable;
	
}

declare module "awayjs-renderergl/lib/shaders/LightingShader" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ILightingPass = require("awayjs-renderergl/lib/surfaces/passes/ILightingPass");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import CompilerBase = require("awayjs-renderergl/lib/shaders/compilers/CompilerBase");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
	 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
	 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
	 * each time a method has been compiled into the shader.
	 *
	 * @see RegisterPool.addUsage
	 */
	class LightingShader extends ShaderBase {
	    _lightingPass: ILightingPass;
	    private _includeCasters;
	    /**
	     * The first index for the fragment constants containing the light data.
	     */
	    lightFragmentConstantIndex: number;
	    /**
	     * The starting index if the vertex constant to which light data needs to be uploaded.
	     */
	    lightVertexConstantIndex: number;
	    /**
	     * Indices for the light probe diffuse textures.
	     */
	    lightProbeDiffuseIndices: Array<number>;
	    /**
	     * Indices for the light probe specular textures.
	     */
	    lightProbeSpecularIndices: Array<number>;
	    /**
	     * The index of the fragment constant containing the weights for the light probes.
	     */
	    probeWeightsIndex: number;
	    numDirectionalLights: number;
	    numPointLights: number;
	    numLightProbes: number;
	    usesLightFallOff: boolean;
	    usesShadows: boolean;
	    /**
	     * Indicates whether the shader uses any lights.
	     */
	    usesLights: boolean;
	    /**
	     * Indicates whether the shader uses any light probes.
	     */
	    usesProbes: boolean;
	    /**
	     * Indicates whether the lights uses any specular components.
	     */
	    usesLightsForSpecular: boolean;
	    /**
	     * Indicates whether the probes uses any specular components.
	     */
	    usesProbesForSpecular: boolean;
	    /**
	     * Indicates whether the lights uses any diffuse components.
	     */
	    usesLightsForDiffuse: boolean;
	    /**
	     * Indicates whether the probes uses any diffuse components.
	     */
	    usesProbesForDiffuse: boolean;
	    /**
	     * Creates a new MethodCompilerVO object.
	     */
	    constructor(elementsClass: IElementsClassGL, lightingPass: ILightingPass, stage: Stage);
	    _iIncludeDependencies(): void;
	    /**
	     * Factory method to create a concrete compiler object for this object
	     *
	     * @param materialPassVO
	     * @returns {away.materials.LightingCompiler}
	     */
	    createCompiler(elementsClass: IElementsClassGL, pass: ILightingPass): CompilerBase;
	    /**
	     *
	     *
	     * @param renderable
	     * @param stage
	     * @param camera
	     */
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
	     */
	    private updateLights();
	    /**
	     * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
	     */
	    private updateProbes();
	}
	export = LightingShader;
	
}

declare module "awayjs-renderergl/lib/shaders/RegisterPool" {
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	/**
	 * RegisterPool is used by the shader compilers process to keep track of which registers of a certain type are
	 * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
	 * or single components (x, y, z, w) of a single register.
	 * It is used by ShaderRegisterCache to track usages of individual register types.
	 *
	 * @see away.materials.ShaderRegisterCache
	 */
	class RegisterPool {
	    private static _regPool;
	    private static _regCompsPool;
	    private _vectorRegisters;
	    private _registerComponents;
	    private _regName;
	    private _usedSingleCount;
	    private _usedVectorCount;
	    private _regCount;
	    private _persistent;
	    /**
	     * Creates a new RegisterPool object.
	     * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
	     * @param regCount The amount of available registers of this type.
	     * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
	     */
	    constructor(regName: string, regCount: number, persistent?: boolean);
	    /**
	     * Retrieve an entire vector register that's still available.
	     */
	    requestFreeVectorReg(): ShaderRegisterElement;
	    /**
	     * Retrieve a single vector component that's still available.
	     */
	    requestFreeRegComponent(): ShaderRegisterElement;
	    /**
	     * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
	     * has been called usageCount times again.
	     * @param register The register to mark as used.
	     * @param usageCount The amount of usages to add.
	     */
	    addUsage(register: ShaderRegisterElement, usageCount: number): void;
	    /**
	     * Removes a usage from a register. When usages reach 0, the register is freed again.
	     * @param register The register for which to remove a usage.
	     */
	    removeUsage(register: ShaderRegisterElement): void;
	    /**
	     * Disposes any resources used by the current RegisterPool object.
	     */
	    dispose(): void;
	    /**
	     * Indicates whether or not any registers are in use.
	     */
	    hasRegisteredRegs(): boolean;
	    /**
	     * Initializes all registers.
	     */
	    private initRegisters(regName, regCount);
	    private static _initPool(regName, regCount);
	    /**
	     * Check if the temp register is either used for single or vector use
	     */
	    private isRegisterUsed(index);
	    private _initArray(a, val);
	}
	export = RegisterPool;
	
}

declare module "awayjs-renderergl/lib/shaders/ShaderBase" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import IAssetClass = require("awayjs-core/lib/library/IAssetClass");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	import Camera = require("awayjs-display/lib/display/Camera");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ProgramData = require("awayjs-stagegl/lib/image/ProgramData");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import ElementsPool = require("awayjs-renderergl/lib/elements/ElementsPool");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import CompilerBase = require("awayjs-renderergl/lib/shaders/compilers/CompilerBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import GL_TextureBase = require("awayjs-renderergl/lib/textures/GL_TextureBase");
	import GL_IAssetClass = require("awayjs-stagegl/lib/library/GL_IAssetClass");
	/**
	 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
	 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
	 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
	 * each time a method has been compiled into the shader.
	 *
	 * @see RegisterPool.addUsage
	 */
	class ShaderBase implements IAbstractionPool {
	    static _abstractionClassPool: Object;
	    private _abstractionPool;
	    _elementsPool: ElementsPool;
	    private _elementsClass;
	    private _pass;
	    _stage: Stage;
	    private _programData;
	    private _blendFactorSource;
	    private _blendFactorDest;
	    private _invalidShader;
	    private _invalidProgram;
	    private _animationVertexCode;
	    private _animationFragmentCode;
	    programData: ProgramData;
	    usesBlending: boolean;
	    useImageRect: boolean;
	    usesCurves: boolean;
	    /**
	     * The depth compare mode used to render the renderables using this material.
	     *
	     * @see away.stagegl.ContextGLCompareMode
	     */
	    depthCompareMode: string;
	    /**
	     * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
	     */
	    writeDepth: boolean;
	    profile: string;
	    usesAnimation: boolean;
	    private _defaultCulling;
	    _pInverseSceneMatrix: Float32Array;
	    animationRegisterCache: AnimationRegisterCache;
	    /**
	     * The amount of used vertex constants in the vertex code. Used by the animation code generation to know from which index on registers are available.
	     */
	    numUsedVertexConstants: number;
	    /**
	     * The amount of used fragment constants in the fragment code. Used by the animation code generation to know from which index on registers are available.
	     */
	    numUsedFragmentConstants: number;
	    /**
	     * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
	     */
	    numUsedStreams: number;
	    /**
	     *
	     */
	    numUsedTextures: number;
	    /**
	     *
	     */
	    numUsedVaryings: number;
	    numLights: number;
	    animatableAttributes: Array<string>;
	    animationTargetRegisters: Array<string>;
	    uvSource: string;
	    uvTarget: string;
	    useAlphaPremultiplied: boolean;
	    useBothSides: boolean;
	    usesUVTransform: boolean;
	    usesColorTransform: boolean;
	    alphaThreshold: number;
	    ambientR: number;
	    ambientG: number;
	    ambientB: number;
	    /**
	     *
	     */
	    usesCommonData: boolean;
	    /**
	     * Indicates whether the pass requires any fragment animation code.
	     */
	    usesFragmentAnimation: boolean;
	    /**
	     * The amount of dependencies on the projected position.
	     */
	    projectionDependencies: number;
	    /**
	     * The amount of dependencies on the normal vector.
	     */
	    normalDependencies: number;
	    /**
	     * The amount of dependencies on the vertex color.
	     */
	    colorDependencies: number;
	    /**
	     * The amount of dependencies on the view direction.
	     */
	    viewDirDependencies: number;
	    /**
	     * The amount of dependencies on the primary UV coordinates.
	     */
	    uvDependencies: number;
	    /**
	     * The amount of dependencies on the secondary UV coordinates.
	     */
	    secondaryUVDependencies: number;
	    /**
	     * The amount of dependencies on the global position. This can be 0 while hasGlobalPosDependencies is true when
	     * the global position is used as a temporary value (fe to calculate the view direction)
	     */
	    globalPosDependencies: number;
	    /**
	     * The amount of tangent vector dependencies (fragment shader).
	     */
	    tangentDependencies: number;
	    /**
	     *
	     */
	    outputsColors: boolean;
	    /**
	     * Indicates whether or not normals are output.
	     */
	    outputsNormals: boolean;
	    /**
	     * Indicates whether or not normal calculations are output in tangent space.
	     */
	    outputsTangentNormals: boolean;
	    /**
	     * Indicates whether or not normal calculations are expected in tangent space. This is only the case if no world-space
	     * dependencies exist and normals are being output.
	     */
	    usesTangentSpace: boolean;
	    /**
	     * Indicates whether there are any dependencies on the world-space position vector.
	     */
	    usesGlobalPosFragment: boolean;
	    /**
	     * Indicates whether there are any dependencies on the local position vector.
	     */
	    usesPositionFragment: boolean;
	    vertexConstantData: Float32Array;
	    fragmentConstantData: Float32Array;
	    /**
	     * The index for the common data register.
	     */
	    commonsDataIndex: number;
	    /**
	     * The index for the curve vertex attribute stream.
	     */
	    curvesIndex: number;
	    /**
	     * The index for the UV vertex attribute stream.
	     */
	    uvIndex: number;
	    /**
	     * The index for the secondary UV vertex attribute stream.
	     */
	    secondaryUVIndex: number;
	    /**
	     * The index for the vertex normal attribute stream.
	     */
	    normalIndex: number;
	    /**
	     * The index for the color attribute stream.
	     */
	    colorBufferIndex: number;
	    /**
	     * The index for the vertex tangent attribute stream.
	     */
	    tangentIndex: number;
	    /**
	     * The index of the vertex constant containing the view matrix.
	     */
	    viewMatrixIndex: number;
	    /**
	     * The index of the vertex constant containing the scene matrix.
	     */
	    sceneMatrixIndex: number;
	    /**
	     * The index of the vertex constant containing the uniform scene matrix (the inverse transpose).
	     */
	    sceneNormalMatrixIndex: number;
	    /**
	     * The index of the vertex constant containing the camera position.
	     */
	    cameraPositionIndex: number;
	    /**
	     * The index for the UV transformation matrix vertex constant.
	     */
	    uvMatrixIndex: number;
	    /**
	     * The index for the color transform fragment constant.
	     */
	    colorTransformIndex: number;
	    /**
	     *
	     */
	    jointIndexIndex: number;
	    /**
	     *
	     */
	    jointWeightIndex: number;
	    /**
	     *
	     */
	    imageIndices: Array<number>;
	    /**
	     * Creates a new MethodCompilerVO object.
	     */
	    constructor(elementsClass: IElementsClassGL, pass: IPass, stage: Stage);
	    getAbstraction(texture: TextureBase): GL_TextureBase;
	    /**
	     *
	     * @param image
	     */
	    clearAbstraction(texture: TextureBase): void;
	    /**
	     *
	     * @param imageObjectClass
	     */
	    static registerAbstraction(gl_assetClass: GL_IAssetClass, assetClass: IAssetClass): void;
	    getImageIndex(texture: TextureBase, index?: number): number;
	    _iIncludeDependencies(): void;
	    /**
	     * Factory method to create a concrete compiler object for this object
	     *
	     * @param elementsClass
	     * @param pass
	     * @param stage
	     * @returns {CompilerBase}
	     */
	    createCompiler(elementsClass: IElementsClassGL, pass: IPass): CompilerBase;
	    /**
	     * Clears dependency counts for all registers. Called when recompiling a pass.
	     */
	    reset(): void;
	    pInitRegisterIndices(): void;
	    /**
	     * Initializes the unchanging constant data for this shader object.
	     */
	    initConstantData(registerCache: ShaderRegisterCache, animatableAttributes: Array<string>, animationTargetRegisters: Array<string>, uvSource: string, uvTarget: string): void;
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
	    setBlendMode(value: string): void;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    _iDeactivate(): void;
	    /**
	     *
	     *
	     * @param renderable
	     * @param stage
	     * @param camera
	     */
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    invalidateProgram(): void;
	    invalidateShader(): void;
	    dispose(): void;
	    private _updateProgram();
	    private _calcAnimationCode(shadedTarget);
	}
	export = ShaderBase;
	
}

declare module "awayjs-renderergl/lib/shaders/ShaderRegisterCache" {
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	/**
	 * ShaderRegister Cache provides the usage management system for all registers during shading compilers.
	 */
	class ShaderRegisterCache {
	    private _fragmentTempCache;
	    private _vertexTempCache;
	    private _varyingCache;
	    private _fragmentConstantsCache;
	    private _vertexConstantsCache;
	    private _textureCache;
	    private _vertexAttributesCache;
	    private _vertexConstantOffset;
	    private _vertexAttributesOffset;
	    private _varyingsOffset;
	    private _fragmentConstantOffset;
	    private _fragmentOutputRegister;
	    private _vertexOutputRegister;
	    private _numUsedVertexConstants;
	    private _numUsedFragmentConstants;
	    private _numUsedStreams;
	    private _numUsedTextures;
	    private _numUsedVaryings;
	    private _profile;
	    /**
	     * Create a new ShaderRegisterCache object.
	     *
	     * @param profile The compatibility profile used by the renderer.
	     */
	    constructor(profile: string);
	    /**
	     * Resets all registers.
	     */
	    reset(): void;
	    /**
	     * Disposes all resources used.
	     */
	    dispose(): void;
	    /**
	     * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
	     * has been called usageCount times again.
	     * @param register The register to mark as used.
	     * @param usageCount The amount of usages to add.
	     */
	    addFragmentTempUsages(register: ShaderRegisterElement, usageCount: number): void;
	    /**
	     * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
	     * @param register The register for which to remove a usage.
	     */
	    removeFragmentTempUsage(register: ShaderRegisterElement): void;
	    /**
	     * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
	     * until removeUsage has been called usageCount times again.
	     * @param register The register to mark as used.
	     * @param usageCount The amount of usages to add.
	     */
	    addVertexTempUsages(register: ShaderRegisterElement, usageCount: number): void;
	    /**
	     * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
	     * @param register The register for which to remove a usage.
	     */
	    removeVertexTempUsage(register: ShaderRegisterElement): void;
	    /**
	     * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
	     * has been called usageCount times again.
	     */
	    getFreeFragmentVectorTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve a single component from a fragment temporary register that's still available.
	     */
	    getFreeFragmentSingleTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve an available varying register
	     */
	    getFreeVarying(): ShaderRegisterElement;
	    /**
	     * Retrieve an available fragment constant register
	     */
	    getFreeFragmentConstant(): ShaderRegisterElement;
	    /**
	     * Retrieve an available vertex constant register
	     */
	    getFreeVertexConstant(): ShaderRegisterElement;
	    /**
	     * Retrieve an entire vertex temporary register that's still available.
	     */
	    getFreeVertexVectorTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve a single component from a vertex temporary register that's still available.
	     */
	    getFreeVertexSingleTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve an available vertex attribute register
	     */
	    getFreeVertexAttribute(): ShaderRegisterElement;
	    /**
	     * Retrieve an available texture register
	     */
	    getFreeTextureReg(): ShaderRegisterElement;
	    /**
	     * Indicates the start index from which to retrieve vertex constants.
	     */
	    vertexConstantOffset: number;
	    /**
	     * Indicates the start index from which to retrieve vertex attributes.
	     */
	    vertexAttributesOffset: number;
	    /**
	     * Indicates the start index from which to retrieve varying registers.
	     */
	    varyingsOffset: number;
	    /**
	     * Indicates the start index from which to retrieve fragment constants.
	     */
	    fragmentConstantOffset: number;
	    /**
	     * The fragment output register.
	     */
	    fragmentOutputRegister: ShaderRegisterElement;
	    /**
	     * The amount of used vertex constant registers.
	     */
	    numUsedVertexConstants: number;
	    /**
	     * The amount of used fragment constant registers.
	     */
	    numUsedFragmentConstants: number;
	    /**
	     * The amount of used vertex streams.
	     */
	    numUsedStreams: number;
	    /**
	     * The amount of used texture slots.
	     */
	    numUsedTextures: number;
	    /**
	     * The amount of used varying registers.
	     */
	    numUsedVaryings: number;
	}
	export = ShaderRegisterCache;
	
}

declare module "awayjs-renderergl/lib/shaders/ShaderRegisterData" {
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	/**
	 * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
	 */
	class ShaderRegisterData {
	    uvVarying: ShaderRegisterElement;
	    secondaryUVVarying: ShaderRegisterElement;
	    shadowTarget: ShaderRegisterElement;
	    shadedTarget: ShaderRegisterElement;
	    globalPositionVertex: ShaderRegisterElement;
	    globalPositionVarying: ShaderRegisterElement;
	    animatedPosition: ShaderRegisterElement;
	    positionVarying: ShaderRegisterElement;
	    curvesInput: ShaderRegisterElement;
	    curvesVarying: ShaderRegisterElement;
	    normalInput: ShaderRegisterElement;
	    animatedNormal: ShaderRegisterElement;
	    normalVarying: ShaderRegisterElement;
	    normalFragment: ShaderRegisterElement;
	    tangentInput: ShaderRegisterElement;
	    animatedTangent: ShaderRegisterElement;
	    tangentVarying: ShaderRegisterElement;
	    bitangentVarying: ShaderRegisterElement;
	    colorInput: ShaderRegisterElement;
	    colorVarying: ShaderRegisterElement;
	    commons: ShaderRegisterElement;
	    projectionFragment: ShaderRegisterElement;
	    viewDirVarying: ShaderRegisterElement;
	    viewDirFragment: ShaderRegisterElement;
	    bitangent: ShaderRegisterElement;
	    textures: Array<ShaderRegisterElement>;
	    constructor();
	}
	export = ShaderRegisterData;
	
}

declare module "awayjs-renderergl/lib/shaders/ShaderRegisterElement" {
	/**
	 * A single register element (an entire register or a single register's component) used by the RegisterPool.
	 */
	class ShaderRegisterElement {
	    private _regName;
	    private _index;
	    private _toStr;
	    private static COMPONENTS;
	    _component: number;
	    /**
	     * Creates a new ShaderRegisterElement object.
	     *
	     * @param regName The name of the register.
	     * @param index The index of the register.
	     * @param component The register's component, if not the entire register is represented.
	     */
	    constructor(regName: string, index: number, component?: number);
	    /**
	     * Converts the register or the components AGAL string representation.
	     */
	    toString(): string;
	    /**
	     * The register's name.
	     */
	    regName: string;
	    /**
	     * The register's index.
	     */
	    index: number;
	}
	export = ShaderRegisterElement;
	
}

declare module "awayjs-renderergl/lib/shaders/compilers/CompilerBase" {
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	/**
	 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
	 * material. Concrete subclasses are used by the default materials.
	 *
	 * @see away.materials.ShadingMethodBase
	 */
	class CompilerBase {
	    _pShader: ShaderBase;
	    _pSharedRegisters: ShaderRegisterData;
	    _pRegisterCache: ShaderRegisterCache;
	    _pElementsClass: IElementsClassGL;
	    _pRenderPass: IPass;
	    _pVertexCode: string;
	    _pFragmentCode: string;
	    _pPostAnimationFragmentCode: string;
	    _pAnimatableAttributes: Array<string>;
	    _pAnimationTargetRegisters: Array<string>;
	    private _uvTarget;
	    private _uvSource;
	    /**
	     * Creates a new CompilerBase object.
	     * @param profile The compatibility profile of the renderer.
	     */
	    constructor(elementsClass: IElementsClassGL, pass: IPass, shader: ShaderBase);
	    /**
	     * Compiles the code after all setup on the compiler has finished.
	     */
	    compile(): void;
	    /**
	     * Calculate the transformed colours
	     */
	    private compileColorTransformCode();
	    /**
	     * Compile the code for the methods.
	     */
	    pCompileDependencies(): void;
	    private compileGlobalPositionCode();
	    private compilePositionCode();
	    private compileCurvesCode();
	    /**
	     * Calculate the (possibly animated) UV coordinates.
	     */
	    private compileUVCode();
	    /**
	     * Provide the secondary UV coordinates.
	     */
	    private compileSecondaryUVCode();
	    /**
	     * Calculate the view direction.
	     */
	    compileViewDirCode(): void;
	    /**
	     * Calculate the normal.
	     */
	    compileNormalCode(): void;
	    /**
	     * Reset all the indices to "unused".
	     */
	    pInitRegisterIndices(): void;
	    /**
	     * Disposes all resources used by the compiler.
	     */
	    dispose(): void;
	    /**
	     * The generated vertex code.
	     */
	    vertexCode: string;
	    /**
	     * The generated fragment code.
	     */
	    fragmentCode: string;
	    /**
	     * The generated fragment code.
	     */
	    postAnimationFragmentCode: string;
	    /**
	     * The register name containing the final shaded colour.
	     */
	    shadedTarget: string;
	}
	export = CompilerBase;
	
}

declare module "awayjs-renderergl/lib/shaders/compilers/LightingCompiler" {
	import LightingShader = require("awayjs-renderergl/lib/shaders/LightingShader");
	import CompilerBase = require("awayjs-renderergl/lib/shaders/compilers/CompilerBase");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	import ILightingPass = require("awayjs-renderergl/lib/surfaces/passes/ILightingPass");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	/**
	 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
	 * material. Concrete subclasses are used by the default materials.
	 *
	 * @see away.materials.ShadingMethodBase
	 */
	class LightingCompiler extends CompilerBase {
	    private _shaderLightingObject;
	    private _lightingPass;
	    _pointLightFragmentConstants: Array<ShaderRegisterElement>;
	    _pointLightVertexConstants: Array<ShaderRegisterElement>;
	    _dirLightFragmentConstants: Array<ShaderRegisterElement>;
	    _dirLightVertexConstants: Array<ShaderRegisterElement>;
	    _pNumProbeRegisters: number;
	    /**
	     * Creates a new CompilerBase object.
	     * @param profile The compatibility profile of the renderer.
	     */
	    constructor(elementsClass: IElementsClassGL, lightingPass: ILightingPass, shaderLightingObject: LightingShader);
	    /**
	     * Compile the code for the methods.
	     */
	    pCompileDependencies(): void;
	    /**
	     * Provides the code to provide shadow mapping.
	     */
	    pCompileShadowCode(): void;
	    /**
	     * Initializes constant registers to contain light data.
	     */
	    private initLightRegisters();
	    /**
	     * Compiles the shading code for directional and point lights.
	     */
	    private compileLightCode();
	    /**
	     * Compiles shading code for light probes.
	     */
	    private compileLightProbeCode();
	    /**
	     * Reset all the indices to "unused".
	     */
	    pInitRegisterIndices(): void;
	}
	export = LightingCompiler;
	
}

declare module "awayjs-renderergl/lib/sort/IEntitySorter" {
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * @interface away.sort.IEntitySorter
	 */
	interface IEntitySorter {
	    sortBlendedRenderables(head: GL_RenderableBase): GL_RenderableBase;
	    sortOpaqueRenderables(head: GL_RenderableBase): GL_RenderableBase;
	}
	export = IEntitySorter;
	
}

declare module "awayjs-renderergl/lib/sort/RenderableMergeSort" {
	import IEntitySorter = require("awayjs-renderergl/lib/sort/IEntitySorter");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * @class away.sort.RenderableMergeSort
	 */
	class RenderableMergeSort implements IEntitySorter {
	    sortBlendedRenderables(head: GL_RenderableBase): GL_RenderableBase;
	    sortOpaqueRenderables(head: GL_RenderableBase): GL_RenderableBase;
	}
	export = RenderableMergeSort;
	
}

declare module "awayjs-renderergl/lib/sort/RenderableNullSort" {
	import IEntitySorter = require("awayjs-renderergl/lib/sort/IEntitySorter");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	/**
	 * @class away.sort.NullSort
	 */
	class RenderableNullSort implements IEntitySorter {
	    sortBlendedRenderables(head: GL_RenderableBase): GL_RenderableBase;
	    sortOpaqueRenderables(head: GL_RenderableBase): GL_RenderableBase;
	}
	export = RenderableNullSort;
	
}

declare module "awayjs-renderergl/lib/surfaces/GL_BasicMaterialSurface" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	/**
	 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class GL_BasicMaterialSurface extends GL_SurfaceBase {
	    private _material;
	    private _pass;
	    constructor(material: BasicMaterial, elementsClass: IElementsClassGL, renderPool: SurfacePool);
	    onClear(event: AssetEvent): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateRender(): void;
	}
	export = GL_BasicMaterialSurface;
	
}

declare module "awayjs-renderergl/lib/surfaces/GL_DepthSurface" {
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import Camera = require("awayjs-display/lib/display/Camera");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_SurfacePassBase = require("awayjs-renderergl/lib/surfaces/GL_SurfacePassBase");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	/**
	 * GL_DepthSurface forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class GL_DepthSurface extends GL_SurfacePassBase {
	    private _fragmentConstantsIndex;
	    private _textureVO;
	    /**
	     *
	     * @param pool
	     * @param surface
	     * @param elementsClass
	     * @param stage
	     */
	    constructor(surface: ISurface, elementsClass: IElementsClassGL, renderPool: SurfacePool);
	    invalidate(): void;
	    _iIncludeDependencies(shader: ShaderBase): void;
	    _iInitConstantData(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = GL_DepthSurface;
	
}

declare module "awayjs-renderergl/lib/surfaces/GL_DistanceSurface" {
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import Camera = require("awayjs-display/lib/display/Camera");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	import GL_SurfacePassBase = require("awayjs-renderergl/lib/surfaces/GL_SurfacePassBase");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	/**
	 * DistanceRender is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
	 * This is used to render omnidirectional shadow maps.
	 */
	class DistanceRender extends GL_SurfacePassBase {
	    private _textureVO;
	    private _fragmentConstantsIndex;
	    /**
	     * Creates a new DistanceRender object.
	     *
	     * @param material The material to which this pass belongs.
	     */
	    constructor(surface: ISurface, elementsClass: IElementsClassGL, renderPool: SurfacePool);
	    invalidate(): void;
	    /**
	     * Initializes the unchanging constant data for this material.
	     */
	    _iInitConstantData(shader: ShaderBase): void;
	    _iIncludeDependencies(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = DistanceRender;
	
}

declare module "awayjs-renderergl/lib/surfaces/GL_SkyboxSurface" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import Skybox = require("awayjs-display/lib/display/Skybox");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_SurfacePassBase = require("awayjs-renderergl/lib/surfaces/GL_SurfacePassBase");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import GL_TextureBase = require("awayjs-renderergl/lib/textures/GL_TextureBase");
	/**
	 * GL_SkyboxSurface forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class GL_SkyboxSurface extends GL_SurfacePassBase {
	    _skybox: Skybox;
	    _texture: GL_TextureBase;
	    constructor(skybox: Skybox, elementsClass: IElementsClassGL, renderPool: SurfacePool);
	    onClear(event: AssetEvent): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateRender(): void;
	    _iIncludeDependencies(shader: ShaderBase): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = GL_SkyboxSurface;
	
}

declare module "awayjs-renderergl/lib/surfaces/GL_SurfaceBase" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import SurfaceEvent = require("awayjs-display/lib/events/SurfaceEvent");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import GL_ImageBase = require("awayjs-stagegl/lib/image/GL_ImageBase");
	import GL_SamplerBase = require("awayjs-stagegl/lib/image/GL_SamplerBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	/**
	 *
	 * @class away.pool.Passes
	 */
	class GL_SurfaceBase extends AbstractionBase {
	    private _onInvalidateAnimationDelegate;
	    private _onInvalidatePassesDelegate;
	    usages: number;
	    _forceSeparateMVP: boolean;
	    _surface: ISurface;
	    _elementsClass: IElementsClassGL;
	    _stage: Stage;
	    private _renderOrderId;
	    private _invalidAnimation;
	    private _invalidRender;
	    private _invalidImages;
	    private _passes;
	    private _imageIndices;
	    private _numImages;
	    _pRequiresBlending: boolean;
	    private _onPassInvalidateDelegate;
	    surfaceID: number;
	    images: Array<GL_ImageBase>;
	    samplers: Array<GL_SamplerBase>;
	    /**
	     * Indicates whether or not the renderable requires alpha blending during rendering.
	     */
	    requiresBlending: boolean;
	    renderOrderId: number;
	    passes: Array<IPass>;
	    surface: ISurface;
	    numImages: number;
	    constructor(surface: ISurface, elementsClass: IElementsClassGL, renderPool: SurfacePool);
	    _iIncludeDependencies(shader: ShaderBase): void;
	    getImageIndex(texture: TextureBase, index?: number): number;
	    /**
	     *
	     */
	    onClear(event: AssetEvent): void;
	    /**
	     *
	     */
	    onInvalidate(event: AssetEvent): void;
	    /**
	     *
	     */
	    onInvalidatePasses(event: SurfaceEvent): void;
	    /**
	     *
	     */
	    onInvalidateAnimation(event: SurfaceEvent): void;
	    /**
	     *
	     * @param surface
	     */
	    private _updateAnimation();
	    private _updateImages();
	    /**
	     * Performs any processing that needs to occur before any of its passes are used.
	     *
	     * @private
	     */
	    _pUpdateRender(): void;
	    /**
	     * Removes a pass from the surface.
	     * @param pass The pass to be removed.
	     */
	    _pRemovePass(pass: IPass): void;
	    /**
	     * Removes all passes from the surface
	     */
	    _pClearPasses(): void;
	    /**
	     * Adds a pass to the surface
	     * @param pass
	     */
	    _pAddPass(pass: IPass): void;
	    /**
	     * Listener for when a pass's shader code changes. It recalculates the render order id.
	     */
	    private onPassInvalidate(event);
	    /**
	     * test if animation will be able to run on gpu BEFORE compiling materials
	     * test if the shader objects supports animating the animation set in the vertex shader
	     * if any object using this material fails to support accelerated animations for any of the shader objects,
	     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	     */
	    private _getEnabledGPUAnimation();
	}
	export = GL_SurfaceBase;
	
}

declare module "awayjs-renderergl/lib/surfaces/GL_SurfacePassBase" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	/**
	 * GL_SurfacePassBase provides an abstract base class for material shader passes. A material pass constitutes at least
	 * a render call per required renderable.
	 */
	class GL_SurfacePassBase extends GL_SurfaceBase implements IPass {
	    _shader: ShaderBase;
	    shader: ShaderBase;
	    animationSet: AnimationSetBase;
	    /**
	     * Marks the shader program as invalid, so it will be recompiled before the next render.
	     */
	    invalidate(): void;
	    dispose(): void;
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
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	     * @param stage The Stage object which is currently used for rendering.
	     * @param camera The camera from which the scene is viewed.
	     * @private
	     */
	    _iActivate(camera: Camera): void;
	    /**
	     * Clears the render state for the pass. This needs to be called before activating another pass.
	     * @param stage The Stage used for rendering
	     *
	     * @private
	     */
	    _iDeactivate(): void;
	    _iInitConstantData(shader: ShaderBase): void;
	    _iGetPreLightingVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPreLightingFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = GL_SurfacePassBase;
	
}

declare module "awayjs-renderergl/lib/surfaces/ISurfaceClassGL" {
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import SurfacePool = require("awayjs-renderergl/lib/surfaces/SurfacePool");
	/**
	 * ISurfaceClassGL is an interface for the constructable class definition GL_SurfaceBase that is used to
	 * create render objects in the rendering pipeline to render the contents of a partition
	 *
	 * @class away.render.GL_SurfaceBase
	 */
	interface ISurfaceClassGL {
	    /**
	     *
	     */
	    new (surface: ISurface, elementsClass: IElementsClassGL, pool: SurfacePool): GL_SurfaceBase;
	}
	export = ISurfaceClassGL;
	
}

declare module "awayjs-renderergl/lib/surfaces/SurfacePool" {
	import IAssetClass = require("awayjs-core/lib/library/IAssetClass");
	import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import ISurfaceClassGL = require("awayjs-renderergl/lib/surfaces/ISurfaceClassGL");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	/**
	 * @class away.pool.SurfacePool
	 */
	class SurfacePool implements IAbstractionPool {
	    private static _abstractionClassPool;
	    private _abstractionPool;
	    private _elementsClass;
	    private _stage;
	    private _surfaceClassGL;
	    stage: Stage;
	    /**
	     * //TODO
	     *
	     * @param surfaceClassGL
	     */
	    constructor(elementsClass: IElementsClassGL, stage: Stage, surfaceClassGL?: ISurfaceClassGL);
	    /**
	     * //TODO
	     *
	     * @param elementsOwner
	     * @returns IElements
	     */
	    getAbstraction(surface: ISurface): GL_SurfaceBase;
	    /**
	     * //TODO
	     *
	     * @param elementsOwner
	     */
	    clearAbstraction(surface: ISurface): void;
	    /**
	     *
	     * @param imageObjectClass
	     */
	    static registerAbstraction(surfaceClassGL: ISurfaceClassGL, assetClass: IAssetClass): void;
	}
	export = SurfacePool;
	
}

declare module "awayjs-renderergl/lib/surfaces/passes/BasicMaterialPass" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import PassBase = require("awayjs-renderergl/lib/surfaces/passes/PassBase");
	/**
	 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class BasicMaterialPass extends PassBase {
	    private _textureVO;
	    private _diffuseR;
	    private _diffuseG;
	    private _diffuseB;
	    private _diffuseA;
	    private _fragmentConstantsIndex;
	    constructor(render: GL_SurfaceBase, surface: ISurface, elementsClass: IElementsClassGL, stage: Stage);
	    _iIncludeDependencies(shader: ShaderBase): void;
	    invalidate(): void;
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shader: ShaderBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = BasicMaterialPass;
	
}

declare module "awayjs-renderergl/lib/surfaces/passes/ILightingPass" {
	import LightPickerBase = require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import LightingShader = require("awayjs-renderergl/lib/shaders/LightingShader");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	/**
	 *
	 * @class away.pool.Passes
	 */
	interface ILightingPass extends IPass {
	    enableLightFallOff: boolean;
	    diffuseLightSources: number;
	    specularLightSources: number;
	    numDirectionalLights: number;
	    numPointLights: number;
	    numLightProbes: number;
	    pointLightsOffset: number;
	    directionalLightsOffset: number;
	    lightProbesOffset: number;
	    lightPicker: LightPickerBase;
	    _iGetPerLightDiffuseFragmentCode(shader: LightingShader, lightDirReg: ShaderRegisterElement, diffuseColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerLightSpecularFragmentCode(shader: LightingShader, lightDirReg: ShaderRegisterElement, specularColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerProbeDiffuseFragmentCode(shader: LightingShader, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerProbeSpecularFragmentCode(shader: LightingShader, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPostLightingVertexCode(shader: LightingShader, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPostLightingFragmentCode(shader: LightingShader, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Indicates whether the shader uses any shadows.
	     */
	    _iUsesShadows(shader: LightingShader): boolean;
	    /**
	     * Indicates whether the shader uses any specular component.
	     */
	    _iUsesSpecular(shader: LightingShader): boolean;
	    /**
	     * Indicates whether the shader uses any diffuse component.
	     */
	    _iUsesDiffuse(shader: LightingShader): boolean;
	}
	export = ILightingPass;
	
}

declare module "awayjs-renderergl/lib/surfaces/passes/IPass" {
	import IEventDispatcher = require("awayjs-core/lib/events/IEventDispatcher");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/display/Camera");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	/**
	 *
	 * @class away.pool.Passes
	 */
	interface IPass extends IEventDispatcher {
	    shader: ShaderBase;
	    animationSet: AnimationSetBase;
	    _iIncludeDependencies(shader: ShaderBase): any;
	    _iInitConstantData(shader: ShaderBase): any;
	    _iGetPreLightingVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPreLightingFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iActivate(camera: Camera): any;
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): any;
	    _iDeactivate(): any;
	    invalidate(): any;
	    dispose(): any;
	    getImageIndex(texture: TextureBase, index?: number): number;
	}
	export = IPass;
	
}

declare module "awayjs-renderergl/lib/surfaces/passes/PassBase" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
	import Camera = require("awayjs-display/lib/display/Camera");
	import ISurface = require("awayjs-display/lib/base/ISurface");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import IPass = require("awayjs-renderergl/lib/surfaces/passes/IPass");
	import IElementsClassGL = require("awayjs-renderergl/lib/elements/IElementsClassGL");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	/**
	 * PassBase provides an abstract base class for material shader passes. A material pass constitutes at least
	 * a render call per required renderable.
	 */
	class PassBase extends EventDispatcher implements IPass {
	    _render: GL_SurfaceBase;
	    _surface: ISurface;
	    _elementsClass: IElementsClassGL;
	    _stage: Stage;
	    _shader: ShaderBase;
	    private _preserveAlpha;
	    private _forceSeparateMVP;
	    shader: ShaderBase;
	    animationSet: AnimationSetBase;
	    /**
	     * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
	     */
	    preserveAlpha: boolean;
	    /**
	     * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
	     * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
	     * projection code.
	     */
	    forceSeparateMVP: boolean;
	    /**
	     * Creates a new PassBase object.
	     */
	    constructor(render: GL_SurfaceBase, surface: ISurface, elementsClass: IElementsClassGL, stage: Stage);
	    getImageIndex(texture: TextureBase, index?: number): number;
	    /**
	     * Marks the shader program as invalid, so it will be recompiled before the next render.
	     */
	    invalidate(): void;
	    /**
	     * Cleans up any resources used by the current object.
	     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	     */
	    dispose(): void;
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
	    _iRender(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	     * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	     * @param stage The Stage object which is currently used for rendering.
	     * @param camera The camera from which the scene is viewed.
	     * @private
	     */
	    _iActivate(camera: Camera): void;
	    /**
	     * Clears the render state for the pass. This needs to be called before activating another pass.
	     * @param stage The Stage used for rendering
	     *
	     * @private
	     */
	    _iDeactivate(): void;
	    _iIncludeDependencies(shader: ShaderBase): void;
	    _iInitConstantData(shader: ShaderBase): void;
	    _iGetPreLightingVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPreLightingFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalVertexCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalFragmentCode(shader: ShaderBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = PassBase;
	
}

declare module "awayjs-renderergl/lib/textures/GL_Single2DTexture" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import Single2DTexture = require("awayjs-display/lib/textures/Single2DTexture");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	import GL_TextureBase = require("awayjs-renderergl/lib/textures/GL_TextureBase");
	/**
	 *
	 * @class away.pool.GL_Single2DTexture
	 */
	class GL_Single2DTexture extends GL_TextureBase {
	    private _single2DTexture;
	    private _textureIndex;
	    private _imageIndex;
	    private _samplerIndex;
	    constructor(single2DTexture: Single2DTexture, shader: ShaderBase);
	    onClear(event: AssetEvent): void;
	    /**
	     *
	     * @param shader
	     * @param regCache
	     * @param targetReg The register in which to store the sampled colour.
	     * @param uvReg The uv coordinate vector with which to sample the texture map.
	     * @returns {string}
	     * @private
	     */
	    _iGetFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement): string;
	    activate(render: GL_SurfaceBase): void;
	    _setRenderState(renderable: GL_RenderableBase): void;
	}
	export = GL_Single2DTexture;
	
}

declare module "awayjs-renderergl/lib/textures/GL_SingleCubeTexture" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import SingleCubeTexture = require("awayjs-display/lib/textures/SingleCubeTexture");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	import GL_TextureBase = require("awayjs-renderergl/lib/textures/GL_TextureBase");
	/**
	 *
	 * @class away.pool.TextureDataBase
	 */
	class GL_SingleCubeTexture extends GL_TextureBase {
	    private _singleCubeTexture;
	    private _textureIndex;
	    private _imageIndex;
	    constructor(singleCubeTexture: SingleCubeTexture, shader: ShaderBase);
	    onClear(event: AssetEvent): void;
	    _iIncludeDependencies(includeInput?: boolean): void;
	    /**
	     *
	     * @param shader
	     * @param regCache
	     * @param targetReg The register in which to store the sampled colour.
	     * @param uvReg The direction vector with which to sample the cube map.
	     * @returns {string}
	     * @private
	     */
	    _iGetFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement): string;
	    activate(render: GL_SurfaceBase): void;
	    _setRenderState(renderable: GL_RenderableBase): void;
	}
	export = GL_SingleCubeTexture;
	
}

declare module "awayjs-renderergl/lib/textures/GL_TextureBase" {
	import AssetEvent = require("awayjs-core/lib/events/AssetEvent");
	import ImageBase = require("awayjs-core/lib/image/ImageBase");
	import AbstractionBase = require("awayjs-core/lib/library/AbstractionBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import TextureBase = require("awayjs-display/lib/textures/TextureBase");
	import GL_SurfaceBase = require("awayjs-renderergl/lib/surfaces/GL_SurfaceBase");
	import GL_RenderableBase = require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
	import ShaderBase = require("awayjs-renderergl/lib/shaders/ShaderBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
	/**
	 *
	 * @class away.pool.GL_TextureBaseBase
	 */
	class GL_TextureBase extends AbstractionBase {
	    private _texture;
	    _shader: ShaderBase;
	    _stage: Stage;
	    constructor(texture: TextureBase, shader: ShaderBase);
	    /**
	     *
	     */
	    onClear(event: AssetEvent): void;
	    _iGetFragmentCode(targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData, inputReg?: ShaderRegisterElement): string;
	    _setRenderState(renderable: GL_RenderableBase): void;
	    activate(render: GL_SurfaceBase): void;
	    getTextureReg(imageIndex: number, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): ShaderRegisterElement;
	    getFormatString(image: ImageBase): string;
	}
	export = GL_TextureBase;
	
}

declare module "awayjs-renderergl/lib/tools/commands/Merge" {
	import DisplayObjectContainer = require("awayjs-display/lib/display/DisplayObjectContainer");
	import Sprite = require("awayjs-display/lib/display/Sprite");
	/**
	 *  Class Merge merges two or more static sprites into one.<code>Merge</code>
	 */
	class Merge {
	    private _objectSpace;
	    private _keepMaterial;
	    private _disposeSources;
	    private _graphicVOs;
	    private _toDispose;
	    /**
	     * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier sprite material information or keeps its source material(s). Defaults to false.
	     * If false and receiver object has multiple materials, the last material found in receiver subsprites is applied to the merged subsprite(es).
	     * @param    disposeSources  [optional]    Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
	     * If true, only receiver geometry and resulting sprite are kept in  memory.
	     * @param    objectSpace     [optional]    Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
	     */
	    constructor(keepMaterial?: boolean, disposeSources?: boolean, objectSpace?: boolean);
	    /**
	     * Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
	     */
	    disposeSources: boolean;
	    /**
	     * Determines if the material source(s) used for the merging are disposed. Defaults to false.
	     */
	    keepMaterial: boolean;
	    /**
	     * Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
	     */
	    objectSpace: boolean;
	    /**
	     * Merges all the children of a container into a single Sprite. If no Sprite object is found, method returns the receiver without modification.
	     *
	     * @param    receiver           The Sprite to receive the merged contents of the container.
	     * @param    objectContainer    The DisplayObjectContainer holding the sprites to be mergd.
	     *
	     * @return The merged Sprite instance.
	     */
	    applyToContainer(receiver: Sprite, objectContainer: DisplayObjectContainer): void;
	    /**
	     * Merges all the sprites found in the Array&lt;Sprite&gt; into a single Sprite.
	     *
	     * @param    receiver    The Sprite to receive the merged contents of the sprites.
	     * @param    sprites      A series of Spritees to be merged with the reciever sprite.
	     */
	    applyToSpritees(receiver: Sprite, sprites: Array<Sprite>): void;
	    /**
	     *  Merges 2 sprites into one. It is recommand to use apply when 2 sprites are to be merged. If more need to be merged, use either applyToSpritees or applyToContainer methods.
	     *
	     * @param    receiver    The Sprite to receive the merged contents of both sprites.
	     * @param    sprite        The Sprite to be merged with the receiver sprite
	     */
	    apply(receiver: Sprite, sprite: Sprite): void;
	    private reset();
	    private merge(destSprite, dispose);
	    private collect(sprite, dispose);
	    private getGraphicData(material);
	    private parseContainer(receiver, object);
	}
	export = Merge;
	
}

declare module "awayjs-renderergl/lib/tools/data/ParticleGraphicsTransform" {
	import Matrix = require("awayjs-core/lib/geom/Matrix");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	/**
	 * ...
	 */
	class ParticleGraphicsTransform {
	    private _defaultVertexTransform;
	    private _defaultInvVertexTransform;
	    private _defaultUVTransform;
	    vertexTransform: Matrix3D;
	    UVTransform: Matrix;
	    invVertexTransform: Matrix3D;
	}
	export = ParticleGraphicsTransform;
	
}

declare module "awayjs-renderergl/lib/utils/ParticleGraphicsHelper" {
	import Graphics = require("awayjs-display/lib/graphics/Graphics");
	import ParticleGraphicsTransform = require("awayjs-renderergl/lib/tools/data/ParticleGraphicsTransform");
	/**
	 * ...
	 */
	class ParticleGraphicsHelper {
	    static MAX_VERTEX: number;
	    static generateGraphics(output: Graphics, graphicsArray: Array<Graphics>, transforms?: Array<ParticleGraphicsTransform>): void;
	}
	export = ParticleGraphicsHelper;
	
}

declare module "awayjs-renderergl/lib/utils/PerspectiveMatrix3D" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	/**
	 *
	 */
	class PerspectiveMatrix3D extends Matrix3D {
	    constructor(v?: Float32Array);
	    perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
	}
	export = PerspectiveMatrix3D;
	
}

