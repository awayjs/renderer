/// <reference path="../libs/ref/js.d.ts" />
/// <reference path="../libs/awayjs-core.next.d.ts" />
/// <reference path="../libs/stagegl-context.next.d.ts" />
declare module away.errors {
    class AnimationSetError extends Error {
        constructor(message: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class LightEvent extends Event {
        static CASTS_SHADOW_CHANGE: string;
        constructor(type: string);
        public clone(): Event;
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in an animation state's state.
    */
    class AnimationStateEvent extends Event {
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
        constructor(type: string, animator: animators.AnimatorBase, animationState: animators.IAnimationState, animationNode: animators.AnimationNodeBase);
        /**
        * The animator object that is the subject of this event.
        */
        public animator : animators.AnimatorBase;
        /**
        * The animation state object that is the subject of this event.
        */
        public animationState : animators.IAnimationState;
        /**
        * The animation node inside the animation state from which the event originated.
        */
        public animationNode : animators.AnimationNodeBase;
        /**
        * Clones the event.
        *
        * @return An exact duplicate of the current object.
        */
        public clone(): Event;
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in an animator's state.
    */
    class AnimatorEvent extends Event {
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
        constructor(type: string, animator: animators.AnimatorBase);
        public animator : animators.AnimatorBase;
        /**
        * Clones the event.
        *
        * @return An exact duplicate of the current event object.
        */
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class ShadingMethodEvent extends Event {
        static SHADER_INVALIDATED: string;
        constructor(type: string);
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.ParticleGeometry
    */
    class ParticleGeometry extends Geometry {
        public particles: animators.ParticleData[];
        public numParticles: number;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class RenderableBase implements IRenderable {
        private _onIndicesUpdatedDelegate;
        private _onVerticesUpdatedDelegate;
        private _subGeometry;
        private _geometryDirty;
        private _indexData;
        private _indexDataDirty;
        private _vertexData;
        public _pVertexDataDirty: Object;
        private _vertexOffset;
        private _level;
        private _indexOffset;
        private _overflow;
        private _numTriangles;
        private _concatenateArrays;
        public JOINT_INDEX_FORMAT: string;
        public JOINT_WEIGHT_FORMAT: string;
        /**
        *
        */
        public _pool: RenderablePool;
        /**
        *
        */
        public overflow : RenderableBase;
        /**
        *
        */
        public numTriangles : number;
        /**
        *
        */
        public next: RenderableBase;
        /**
        *
        */
        public materialId: number;
        /**
        *
        */
        public renderOrderId: number;
        /**
        *
        */
        public zIndex: number;
        /**
        *
        */
        public cascaded: boolean;
        /**
        *
        */
        public renderSceneTransform: geom.Matrix3D;
        /**
        *
        */
        public sourceEntity: entities.IEntity;
        /**
        *
        */
        public materialOwner: base.IMaterialOwner;
        /**
        *
        */
        public material: materials.MaterialBase;
        /**
        *
        */
        public getIndexData(): IndexData;
        /**
        *
        */
        public getVertexData(dataType: string): VertexData;
        /**
        *
        */
        public getVertexOffset(dataType: string): number;
        /**
        *
        * @param sourceEntity
        * @param materialOwner
        * @param subGeometry
        * @param animationSubGeometry
        */
        constructor(pool: RenderablePool, sourceEntity: entities.IEntity, materialOwner: base.IMaterialOwner, level?: number, indexOffset?: number);
        public dispose(): void;
        public invalidateGeometry(): void;
        /**
        *
        */
        public invalidateIndexData(): void;
        /**
        * //TODO
        *
        * @param dataType
        */
        public invalidateVertexData(dataType: string): void;
        public _pGetSubGeometry(): base.SubGeometryBase;
        /**
        * //TODO
        *
        * @param subGeometry
        * @param offset
        * @internal
        */
        public _iFillIndexData(indexOffset: number): void;
        public _pGetOverflowRenderable(pool: RenderablePool, materialOwner: base.IMaterialOwner, level: number, indexOffset: number): RenderableBase;
        /**
        * //TODO
        *
        * @private
        */
        private _updateGeometry();
        /**
        * //TODO
        *
        * @private
        */
        private _updateIndexData();
        /**
        * //TODO
        *
        * @param dataType
        * @private
        */
        private _updateVertexData(dataType);
        /**
        * //TODO
        *
        * @param event
        * @private
        */
        private _onIndicesUpdated(event);
        /**
        * //TODO
        *
        * @param event
        * @private
        */
        private _onVerticesUpdated(event);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class BillboardRenderable extends RenderableBase {
        private static _materialGeometry;
        /**
        *
        */
        static id: string;
        /**
        *
        */
        private _billboard;
        /**
        * //TODO
        *
        * @param pool
        * @param billboard
        */
        constructor(pool: RenderablePool, billboard: entities.Billboard);
        /**
        * //TODO
        *
        * @returns {away.base.TriangleSubGeometry}
        */
        public _pGetSubGeometry(): base.SubGeometryBase;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.LineSubMeshRenderable
    */
    class LineSubMeshRenderable extends RenderableBase {
        /**
        *
        */
        static id: string;
        /**
        *
        */
        public subMesh: base.LineSubMesh;
        /**
        * //TODO
        *
        * @param pool
        * @param subMesh
        * @param level
        * @param dataOffset
        */
        constructor(pool: RenderablePool, subMesh: base.LineSubMesh, level?: number, indexOffset?: number);
        /**
        * //TODO
        *
        * @returns {base.LineSubGeometry}
        * @protected
        */
        public _pGetSubGeometry(): base.LineSubGeometry;
        /**
        * //TODO
        *
        * @param pool
        * @param materialOwner
        * @param level
        * @param indexOffset
        * @returns {away.pool.LineSubMeshRenderable}
        * @private
        */
        public _pGetOverflowRenderable(pool: RenderablePool, materialOwner: base.IMaterialOwner, level: number, indexOffset: number): RenderableBase;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SkyboxRenderable
    */
    class SkyboxRenderable extends RenderableBase {
        /**
        *
        */
        static id: string;
        /**
        *
        */
        private static _geometry;
        /**
        * //TODO
        *
        * @param pool
        * @param skybox
        */
        constructor(pool: RenderablePool, skybox: entities.Skybox);
        /**
        * //TODO
        *
        * @returns {away.base.TriangleSubGeometry}
        * @private
        */
        public _pGetSubGeometry(): base.TriangleSubGeometry;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.TriangleSubMeshRenderable
    */
    class TriangleSubMeshRenderable extends RenderableBase {
        /**
        *
        */
        static id: string;
        /**
        *
        */
        public subMesh: base.TriangleSubMesh;
        /**
        * //TODO
        *
        * @param pool
        * @param subMesh
        * @param level
        * @param indexOffset
        */
        constructor(pool: RenderablePool, subMesh: base.TriangleSubMesh, level?: number, indexOffset?: number);
        /**
        *
        * @returns {away.base.SubGeometryBase}
        * @protected
        */
        public _pGetSubGeometry(): base.TriangleSubGeometry;
        /**
        * //TODO
        *
        * @param pool
        * @param materialOwner
        * @param level
        * @param indexOffset
        * @returns {away.pool.TriangleSubMeshRenderable}
        * @protected
        */
        public _pGetOverflowRenderable(pool: RenderablePool, materialOwner: base.IMaterialOwner, level: number, indexOffset: number): RenderableBase;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.EntityCollector
    */
    class EntityCollector extends CollectorBase {
        public _pSkybox: pool.RenderableBase;
        public _pLights: lights.LightBase[];
        private _directionalLights;
        private _pointLights;
        private _lightProbes;
        public _pNumLights: number;
        private _numDirectionalLights;
        private _numPointLights;
        private _numLightProbes;
        /**
        *
        */
        public directionalLights : lights.DirectionalLight[];
        /**
        *
        */
        public lightProbes : lights.LightProbe[];
        /**
        *
        */
        public lights : lights.LightBase[];
        /**
        *
        */
        public pointLights : lights.PointLight[];
        /**
        *
        */
        public skyBox : pool.RenderableBase;
        constructor();
        /**
        *
        * @param entity
        */
        public applyDirectionalLight(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyLightProbe(entity: entities.IEntity): void;
        /**
        *
        * @param entity
        */
        public applyPointLight(entity: entities.IEntity): void;
        /**
        *
        */
        public clear(): void;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.ShadowCasterCollector
    */
    class ShadowCasterCollector extends CollectorBase {
        constructor();
        /**
        *
        */
        public enterNode(node: partition.NodeBase): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.DirectionalLightNode
    */
    class DirectionalLightNode extends EntityNode {
        private _directionalLight;
        /**
        *
        * @param directionalLight
        */
        constructor(directionalLight: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.LightProbeNode
    */
    class LightProbeNode extends EntityNode {
        private _lightProbe;
        /**
        *
        * @param lightProbe
        */
        constructor(lightProbe: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.PointLightNode
    */
    class PointLightNode extends EntityNode {
        private _pointLight;
        /**
        *
        * @param pointLight
        */
        constructor(pointLight: entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: traverse.ICollector): void;
        /**
        *
        * @returns {boolean}
        */
        public isCastingShadow(): boolean;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * An abstract base class for all picking collider classes. It should not be instantiated directly.
    *
    * @class away.pick.PickingColliderBase
    */
    class PickingColliderBase {
        private _billboardRenderablePool;
        private _subMeshRenderablePool;
        public rayPosition: geom.Vector3D;
        public rayDirection: geom.Vector3D;
        constructor();
        public _pPetCollisionNormal(indexData: number[], vertexData: number[], triangleIndex: number): geom.Vector3D;
        public _pGetCollisionUV(indexData: number[], uvData: number[], triangleIndex: number, v: number, w: number, u: number, uvOffset: number, uvStride: number): geom.Point;
        /**
        * @inheritDoc
        */
        public _pTestRenderableCollision(renderable: pool.RenderableBase, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
        /**
        * @inheritDoc
        */
        public setLocalRay(localPosition: geom.Vector3D, localDirection: geom.Vector3D): void;
        /**
        * Tests a <code>Billboard</code> object for a collision with the picking ray.
        *
        * @param billboard The billboard instance to be tested.
        * @param pickingCollisionVO The collision object used to store the collision results
        * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
        * @param findClosest
        */
        public testBillboardCollision(billboard: entities.Billboard, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
        /**
        * Tests a <code>Mesh</code> object for a collision with the picking ray.
        *
        * @param mesh The mesh instance to be tested.
        * @param pickingCollisionVO The collision object used to store the collision results
        * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
        * @param findClosest
        */
        public testMeshCollision(mesh: entities.Mesh, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number, findClosest: boolean): boolean;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Pure JS picking collider for display objects. Used with the <code>RaycastPicker</code> picking object.
    *
    * @see away.base.DisplayObject#pickingCollider
    * @see away.pick.RaycastPicker
    *
    * @class away.pick.JSPickingCollider
    */
    class JSPickingCollider extends PickingColliderBase implements IPickingCollider {
        private _findClosestCollision;
        /**
        * Creates a new <code>JSPickingCollider</code> object.
        *
        * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
        */
        constructor(findClosestCollision?: boolean);
        /**
        * @inheritDoc
        */
        public _pTestRenderableCollision(renderable: pool.RenderableBase, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
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
    class ShaderPicker implements IPicker {
        private _opaqueRenderableHead;
        private _blendedRenderableHead;
        private _stageGL;
        private _context;
        private _onlyMouseEnabled;
        private _objectProgram;
        private _triangleProgram;
        private _bitmapData;
        private _viewportData;
        private _boundOffsetScale;
        private _id;
        private _interactives;
        private _interactiveId;
        private _hitColor;
        private _projX;
        private _projY;
        private _hitRenderable;
        private _hitEntity;
        private _localHitPosition;
        private _hitUV;
        private _faceIndex;
        private _subGeometryIndex;
        private _localHitNormal;
        private _rayPos;
        private _rayDir;
        private _potentialFound;
        private static MOUSE_SCISSOR_RECT;
        private _shaderPickingDetails;
        /**
        * @inheritDoc
        */
        public onlyMouseEnabled : boolean;
        /**
        * Creates a new <code>ShaderPicker</code> object.
        *
        * @param shaderPickingDetails Determines whether the picker includes a second pass to calculate extra
        * properties such as uv and normal coordinates.
        */
        constructor(shaderPickingDetails?: boolean);
        /**
        * @inheritDoc
        */
        public getViewCollision(x: number, y: number, view: containers.View): PickingCollisionVO;
        /**
        * @inheritDoc
        */
        public getSceneCollision(position: geom.Vector3D, direction: geom.Vector3D, scene: containers.Scene): PickingCollisionVO;
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: traverse.EntityCollector, target: stagegl.ITextureBase): void;
        /**
        * Draw a list of renderables.
        * @param renderables The renderables to draw.
        * @param camera The camera for which to render.
        */
        private drawRenderables(renderable, camera);
        private updateRay(camera);
        /**
        * Creates the Program that color-codes objects.
        */
        private initObjectProgram();
        /**
        * Creates the Program that renders positions.
        */
        private initTriangleProgram();
        /**
        * Gets more detailed information about the hir position, if required.
        * @param camera The camera used to view the hit object.
        */
        private getHitDetails(camera);
        /**
        * Finds a first-guess approximate position about the hit position.
        *
        * @param camera The camera used to view the hit object.
        */
        private getApproximatePosition(camera);
        /**
        * Use the approximate position info to find the face under the mouse position from which we can derive the precise
        * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
        * @param camera The camera used to view the hit object.
        */
        private getPreciseDetails(camera);
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
        private getPrecisePosition(invSceneTransform, nx, ny, nz, px, py, pz);
        public dispose(): void;
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
    * contents of a partition
    *
    * @class away.render.RendererBase
    */
    class RendererBase extends events.EventDispatcher {
        private _billboardRenderablePool;
        private _skyboxRenderablePool;
        private _triangleSubMeshRenderablePool;
        private _lineSubMeshRenderablePool;
        public _pContext: stagegl.IContext;
        public _pStageGL: base.StageGL;
        public _pCamera: entities.Camera;
        public _iEntryPoint: geom.Vector3D;
        public _pCameraForward: geom.Vector3D;
        public _pRttBufferManager: managers.RTTBufferManager;
        private _viewPort;
        private _viewportDirty;
        private _scissorDirty;
        public _pBackBufferInvalid: boolean;
        public _pDepthTextureInvalid: boolean;
        public _depthPrepass: boolean;
        private _backgroundR;
        private _backgroundG;
        private _backgroundB;
        private _backgroundAlpha;
        public _shareContext: boolean;
        public _width: number;
        public _height: number;
        public textureRatioX: number;
        public textureRatioY: number;
        private _snapshotBitmapData;
        private _snapshotRequired;
        public _pRttViewProjectionMatrix: geom.Matrix3D;
        private _localPos;
        private _globalPos;
        public _pScissorRect: geom.Rectangle;
        private _scissorUpdated;
        private _viewPortUpdated;
        private _onContextUpdateDelegate;
        private _onViewportUpdatedDelegate;
        public _pNumTriangles: number;
        public _pOpaqueRenderableHead: pool.RenderableBase;
        public _pBlendedRenderableHead: pool.RenderableBase;
        /**
        *
        */
        public numTriangles : number;
        /**
        *
        */
        public renderableSorter: sort.IEntitySorter;
        /**
        * A viewPort rectangle equivalent of the StageGL size and position.
        */
        public viewPort : geom.Rectangle;
        /**
        * A scissor rectangle equivalent of the view size and position.
        */
        public scissorRect : geom.Rectangle;
        /**
        *
        */
        public x : number;
        /**
        *
        */
        public y : number;
        /**
        *
        */
        public width : number;
        /**
        *
        */
        public height : number;
        /**
        * Creates a new RendererBase object.
        */
        constructor();
        public _iCreateEntityCollector(): traverse.ICollector;
        /**
        * The background color's red component, used when clearing.
        *
        * @private
        */
        public _iBackgroundR : number;
        /**
        * The background color's green component, used when clearing.
        *
        * @private
        */
        public _iBackgroundG : number;
        /**
        * The background color's blue component, used when clearing.
        *
        * @private
        */
        public _iBackgroundB : number;
        /**
        * The StageGL that will provide the ContextGL used for rendering.
        */
        public stageGL : base.StageGL;
        public iSetStageGL(value: base.StageGL): void;
        /**
        * Defers control of ContextGL clear() and present() calls to StageGL, enabling multiple StageGL frameworks
        * to share the same ContextGL object.
        */
        public shareContext : boolean;
        /**
        * Disposes the resources used by the RendererBase.
        */
        public dispose(): void;
        public render(entityCollector: traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param target An option target texture to render to.
        * @param surfaceSelector The index of a CubeTexture's face to render to.
        * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
        */
        public _iRender(entityCollector: traverse.ICollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        public pCollectRenderables(entityCollector: traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param target An option target texture to render to.
        * @param surfaceSelector The index of a CubeTexture's face to render to.
        * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
        */
        public pExecuteRender(entityCollector: traverse.ICollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        public queueSnapshot(bmd: base.BitmapData): void;
        /**
        * Performs the actual drawing of geometry to the target.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        */
        public pDraw(entityCollector: traverse.ICollector, target: textures.TextureProxyBase): void;
        /**
        * Assign the context once retrieved
        */
        private onContextUpdate(event);
        public _iBackgroundAlpha : number;
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
        public onViewportUpdated(event: events.StageGLEvent): void;
        /**
        *
        */
        public updateGlobalPos(): void;
        /**
        *
        * @param billboard
        * @protected
        */
        public applyBillboard(billboard: entities.Billboard): void;
        /**
        *
        * @param triangleSubMesh
        */
        public applyTriangleSubMesh(triangleSubMesh: base.TriangleSubMesh): void;
        /**
        *
        * @param lineSubMesh
        */
        public applyLineSubMesh(lineSubMesh: base.LineSubMesh): void;
        /**
        *
        * @param skybox
        */
        public applySkybox(skybox: entities.Skybox): void;
        /**
        *
        * @param renderable
        * @protected
        */
        private _applyRenderable(renderable);
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * The DepthRenderer class renders 32-bit depth information encoded as RGBA
    *
    * @class away.render.DepthRenderer
    */
    class DepthRenderer extends RendererBase {
        private _activeMaterial;
        private _renderBlended;
        private _distanceBased;
        private _disableColor;
        /**
        * Creates a new DepthRenderer object.
        * @param renderBlended Indicates whether semi-transparent objects should be rendered.
        * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
        */
        constructor(renderBlended?: boolean, distanceBased?: boolean);
        public disableColor : boolean;
        public iRenderCascades(entityCollector: traverse.ShadowCasterCollector, target: textures.TextureProxyBase, numCascades: number, scissorRects: geom.Rectangle[], cameras: entities.Camera[]): void;
        private drawCascadeRenderables(renderable, camera, cullPlanes);
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: traverse.EntityCollector, target: textures.TextureProxyBase): void;
        /**
        * Draw a list of renderables.
        * @param renderables The renderables to draw.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawRenderables(renderable, entityCollector);
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
    * materials assigned to them.
    *
    * @class away.render.DefaultRenderer
    */
    class DefaultRenderer extends RendererBase implements IRenderer {
        public _pRequireDepthRender: boolean;
        private static RTT_PASSES;
        private static SCREEN_PASSES;
        private static ALL_PASSES;
        private _activeMaterial;
        private _pDistanceRenderer;
        private _pDepthRenderer;
        private _skyboxProjection;
        public _pFilter3DRenderer: Filter3DRenderer;
        public _pDepthRender: textures.TextureProxyBase;
        private _antiAlias;
        public antiAlias : number;
        /**
        *
        */
        public depthPrepass : boolean;
        /**
        *
        * @returns {*}
        */
        public filters3d : filters.Filter3DBase[];
        /**
        * Creates a new DefaultRenderer object.
        *
        * @param antiAlias The amount of anti-aliasing to use.
        * @param renderMode The render mode to use.
        */
        constructor(forceSoftware?: boolean, profile?: string, mode?: string);
        public render(entityCollector: traverse.ICollector): void;
        public pExecuteRender(entityCollector: traverse.EntityCollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        private updateLights(entityCollector);
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: traverse.EntityCollector, target: textures.TextureProxyBase): void;
        /**
        * Draw the skybox if present.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawSkybox(entityCollector);
        private updateSkyboxProjection(camera);
        /**
        * Draw a list of renderables.
        * @param renderables The renderables to draw.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawRenderables(renderable, entityCollector, which);
        public dispose(): void;
        /**
        *
        */
        public pRenderDepthPrepass(entityCollector: traverse.EntityCollector): void;
        /**
        *
        */
        public pRenderSceneDepthToTexture(entityCollector: traverse.EntityCollector): void;
        /**
        * Updates the backbuffer dimensions.
        */
        public pUpdateBackBuffer(): void;
        public iSetStageGL(value: base.StageGL): void;
        /**
        *
        */
        private initDepthTexture(context);
    }
}
/**
* @module away.render
*/
declare module away.render {
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
        private _stageGL;
        private _filterSizesInvalid;
        private _onRTTResizeDelegate;
        constructor(stageGL: base.StageGL);
        private onRTTResize(event);
        public requireDepthRender : boolean;
        public getMainInputTexture(stageGL: base.StageGL): stagegl.ITexture;
        public filters : filters.Filter3DBase[];
        private updateFilterTasks(stageGL);
        public render(stageGL: base.StageGL, camera: entities.Camera, depthTexture: stagegl.ITexture): void;
        private updateFilterSizes();
        public dispose(): void;
    }
}
declare module away.materials {
    class DefaultMaterialManager {
        private static _defaultTextureBitmapData;
        private static _defaultTextureMaterial;
        private static _defaultSegmentMaterial;
        private static _defaultTexture;
        static getDefaultMaterial(materialOwner?: base.IMaterialOwner): MaterialBase;
        static getDefaultTexture(materialOwner?: base.IMaterialOwner): textures.BitmapTexture;
        private static createDefaultTexture();
        static createCheckeredBitmapData(): base.BitmapData;
        private static createDefaultTextureMaterial();
        private static createDefaultSegmentMaterial();
    }
}
declare module away.filters {
    class Filter3DTaskBase {
        private _mainInputTexture;
        private _scaledTextureWidth;
        private _scaledTextureHeight;
        private _textureWidth;
        private _textureHeight;
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
        public textureScale : number;
        public target : stagegl.ITexture;
        public textureWidth : number;
        public textureHeight : number;
        public getMainInputTexture(stage: base.StageGL): stagegl.ITexture;
        public dispose(): void;
        public pInvalidateProgram(): void;
        public pUpdateProgram(stage: base.StageGL): void;
        public pGetVertexCode(): string;
        public pGetFragmentCode(): string;
        public pUpdateTextures(stage: base.StageGL): void;
        public getProgram(stageGL: base.StageGL): stagegl.IProgram;
        public activate(stageGL: base.StageGL, camera: entities.Camera, depthTexture: stagegl.ITexture): void;
        public deactivate(stageGL: base.StageGL): void;
        public requireDepthRender : boolean;
    }
}
declare module away.filters {
    class Filter3DBase {
        private _tasks;
        private _requireDepthRender;
        private _textureWidth;
        private _textureHeight;
        constructor();
        public requireDepthRender : boolean;
        public pAddTask(filter: Filter3DTaskBase): void;
        public tasks : Filter3DTaskBase[];
        public getMainInputTexture(stageGL: base.StageGL): stagegl.ITexture;
        public textureWidth : number;
        public textureHeight : number;
        public setRenderTargets(mainTarget: stagegl.ITexture, stageGL: base.StageGL): void;
        public dispose(): void;
        public update(stage: base.StageGL, camera: entities.Camera): void;
    }
}
declare module away.lights {
    class LightBase extends containers.DisplayObjectContainer {
        private _color;
        private _colorR;
        private _colorG;
        private _colorB;
        private _ambientColor;
        private _ambient;
        public _iAmbientR: number;
        public _iAmbientG: number;
        public _iAmbientB: number;
        private _specular;
        public _iSpecularR: number;
        public _iSpecularG: number;
        public _iSpecularB: number;
        private _diffuse;
        public _iDiffuseR: number;
        public _iDiffuseG: number;
        public _iDiffuseB: number;
        private _castsShadows;
        private _shadowMapper;
        constructor();
        public castsShadows : boolean;
        public pCreateShadowMapper(): ShadowMapperBase;
        public specular : number;
        public diffuse : number;
        public color : number;
        public ambient : number;
        public ambientColor : number;
        private updateAmbient();
        public iGetObjectProjectionMatrix(entity: entities.IEntity, camera: entities.Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public assetType : string;
        private updateSpecular();
        private updateDiffuse();
        public shadowMapper : ShadowMapperBase;
    }
}
declare module away.lights {
    class LightProbe extends LightBase implements entities.IEntity {
        private _diffuseMap;
        private _specularMap;
        constructor(diffuseMap: textures.CubeTextureBase, specularMap?: textures.CubeTextureBase);
        public diffuseMap : textures.CubeTextureBase;
        public specularMap : textures.CubeTextureBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public pUpdateBounds(): void;
        public pGetDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(entity: entities.IEntity, camera: entities.Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
    }
}
declare module away.lights {
    class PointLight extends LightBase implements entities.IEntity {
        public _pRadius: number;
        public _pFallOff: number;
        public _pFallOffFactor: number;
        constructor();
        public pCreateShadowMapper(): ShadowMapperBase;
        public radius : number;
        public iFallOffFactor(): number;
        public fallOff : number;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public pUpdateBounds(): void;
        public pGetDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(entity: entities.IEntity, camera: entities.Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
    }
}
declare module away.lights {
    class DirectionalLight extends LightBase implements entities.IEntity {
        private _direction;
        private _tmpLookAt;
        private _sceneDirection;
        private _projAABBPoints;
        constructor(xDir?: number, yDir?: number, zDir?: number);
        public sceneDirection : geom.Vector3D;
        public direction : geom.Vector3D;
        public pGetDefaultBoundingVolume(): bounds.BoundingVolumeBase;
        public pUpdateBounds(): void;
        public pUpdateSceneTransform(): void;
        public pCreateShadowMapper(): ShadowMapperBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): partition.EntityNode;
        public iGetObjectProjectionMatrix(entity: entities.IEntity, camera: entities.Camera, target?: geom.Matrix3D): geom.Matrix3D;
        public _iCollectRenderables(renderer: render.IRenderer): void;
    }
}
declare module away.lights {
    class ShadowMapperBase {
        public _pCasterCollector: traverse.ShadowCasterCollector;
        private _depthMap;
        public _pDepthMapSize: number;
        public _pLight: LightBase;
        private _explicitDepthMap;
        private _autoUpdateShadows;
        public _iShadowsInvalid: boolean;
        constructor();
        public pCreateCasterCollector(): traverse.ShadowCasterCollector;
        public autoUpdateShadows : boolean;
        public updateShadows(): void;
        public iSetDepthMap(depthMap: textures.TextureProxyBase): void;
        public light : LightBase;
        public depthMap : textures.TextureProxyBase;
        public depthMapSize : number;
        public dispose(): void;
        public pCreateDepthTexture(): textures.TextureProxyBase;
        public iRenderDepthMap(stageGL: base.StageGL, entityCollector: traverse.EntityCollector, renderer: render.DepthRenderer): void;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        public pDrawDepthMap(target: textures.TextureProxyBase, scene: containers.Scene, renderer: render.DepthRenderer): void;
        public _pSetDepthMapSize(value: any): void;
    }
}
declare module away.lights {
    class CubeMapShadowMapper extends ShadowMapperBase {
        private _depthCameras;
        private _projections;
        private _needsRender;
        constructor();
        private initCameras();
        private addCamera(rotationX, rotationY, rotationZ);
        public pCreateDepthTexture(): textures.TextureProxyBase;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        public pDrawDepthMap(target: textures.RenderTexture, scene: containers.Scene, renderer: render.DepthRenderer): void;
    }
}
declare module away.lights {
    class DirectionalShadowMapper extends ShadowMapperBase {
        public _pOverallDepthCamera: entities.Camera;
        public _pLocalFrustum: number[];
        public _pLightOffset: number;
        public _pMatrix: geom.Matrix3D;
        public _pOverallDepthProjection: projections.FreeMatrixProjection;
        public _pSnap: number;
        public _pCullPlanes: geom.Plane3D[];
        public _pMinZ: number;
        public _pMaxZ: number;
        constructor();
        public snap : number;
        public lightOffset : number;
        public iDepthProjection : geom.Matrix3D;
        public depth : number;
        public pDrawDepthMap(target: textures.TextureProxyBase, scene: containers.Scene, renderer: render.DepthRenderer): void;
        public pUpdateCullPlanes(viewCamera: entities.Camera): void;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        public pUpdateProjectionFromFrustumCorners(viewCamera: entities.Camera, corners: number[], matrix: geom.Matrix3D): void;
    }
}
declare module away.lights {
    class CascadeShadowMapper extends DirectionalShadowMapper implements events.IEventDispatcher {
        public _pScissorRects: geom.Rectangle[];
        private _pScissorRectsInvalid;
        private _splitRatios;
        private _numCascades;
        private _depthCameras;
        private _depthLenses;
        private _texOffsetsX;
        private _texOffsetsY;
        private _changeDispatcher;
        private _nearPlaneDistances;
        constructor(numCascades?: number);
        public getSplitRatio(index: number): number;
        public setSplitRatio(index: number, value: number): void;
        public getDepthProjections(partition: number): geom.Matrix3D;
        private init();
        public _pSetDepthMapSize(value: number): void;
        private invalidateScissorRects();
        public numCascades : number;
        public pDrawDepthMap(target: textures.RenderTexture, scene: containers.Scene, renderer: render.DepthRenderer): void;
        private updateScissorRects();
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
        private updateProjectionPartition(matrix, splitRatio, texOffsetX, texOffsetY);
        public addEventListener(type: string, listener: Function): void;
        public removeEventListener(type: string, listener: Function): void;
        public dispatchEvent(event: events.Event): void;
        public hasEventListener(type: string): boolean;
        public _iNearPlaneDistances : number[];
    }
}
declare module away.lights {
    class NearDirectionalShadowMapper extends DirectionalShadowMapper {
        private _coverageRatio;
        constructor(coverageRatio?: number);
        /**
        * A value between 0 and 1 to indicate the ratio of the view frustum that needs to be covered by the shadow map.
        */
        public coverageRatio : number;
        public pUpdateDepthProjection(viewCamera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
    * a render call per required renderable.
    */
    class MaterialPassBase extends events.EventDispatcher {
        static MATERIALPASS_ID_COUNT: number;
        /**
        * An id for this material pass, used to identify material passes when using animation sets.
        *
        * @private
        */
        public _iUniqueId: number;
        public _pMaterial: MaterialBase;
        private _animationSet;
        public _iPrograms: stagegl.IProgram[];
        public _iProgramids: number[];
        private _contextGLs;
        public _pNumUsedStreams: number;
        public _pNumUsedTextures: number;
        public _pNumUsedVertexConstants: number;
        public _pNumUsedFragmentConstants: number;
        public _pNumUsedVaryings: number;
        public _pSmooth: boolean;
        public _pRepeat: boolean;
        public _pMipmap: boolean;
        private _depthCompareMode;
        private _blendFactorSource;
        private _blendFactorDest;
        public _pEnableBlending: boolean;
        public _pBothSides: boolean;
        public _pLightPicker: LightPickerBase;
        public _pAnimatableAttributes: string[];
        public _pAnimationTargetRegisters: string[];
        public _pShadedTarget: string;
        private static _previousUsedStreams;
        private static _previousUsedTexs;
        private _defaultCulling;
        private _renderToTexture;
        private _oldTarget;
        private _oldSurface;
        private _oldDepthStencil;
        private _oldRect;
        public _pAlphaPremultiplied: boolean;
        public _pNeedFragmentAnimation: boolean;
        public _pNeedUVAnimation: boolean;
        public _pUVTarget: string;
        public _pUVSource: string;
        private _writeDepth;
        private _onLightsChangeDelegate;
        public animationRegisterCache: animators.AnimationRegisterCache;
        /**
        * Creates a new MaterialPassBase object.
        *
        * @param renderToTexture Indicates whether this pass is a render-to-texture pass.
        */
        constructor(renderToTexture?: boolean);
        /**
        * The material to which this pass belongs.
        */
        public material : MaterialBase;
        /**
        * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
        */
        public writeDepth : boolean;
        /**
        * Defines whether any used textures should use mipmapping.
        */
        public mipmap : boolean;
        public setMipMap(value: boolean): void;
        /**
        * Defines whether smoothing should be applied to any used textures.
        */
        public smooth : boolean;
        /**
        * Defines whether textures should be tiled.
        */
        public repeat : boolean;
        /**
        * Defines whether or not the material should perform backface culling.
        */
        public bothSides : boolean;
        /**
        * The depth compare mode used to render the renderables using this material.
        *
        * @see flash.displayGL.ContextGLCompareMode
        */
        public depthCompareMode : string;
        /**
        * Returns the animation data set adding animations to the material.
        */
        public animationSet : animators.AnimationSetBase;
        /**
        * Specifies whether this pass renders to texture
        */
        public renderToTexture : boolean;
        /**
        * Cleans up any resources used by the current object.
        * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
        */
        public dispose(): void;
        /**
        * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
        */
        public numUsedStreams : number;
        /**
        * The amount of used vertex constants in the vertex code. Used by the animation code generation to know from which index on registers are available.
        */
        public numUsedVertexConstants : number;
        public numUsedVaryings : number;
        /**
        * The amount of used fragment constants in the fragment code. Used by the animation code generation to know from which index on registers are available.
        */
        public numUsedFragmentConstants : number;
        public needFragmentAnimation : boolean;
        /**
        * Indicates whether the pass requires any UV animatin code.
        */
        public needUVAnimation : boolean;
        /**
        * Sets up the animation state. This needs to be called before render()
        *
        * @private
        */
        public iUpdateAnimationState(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Renders an object to the current render target.
        *
        * @private
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * Returns the vertex AGAL code for the material.
        */
        public iGetVertexCode(): string;
        /**
        * Returns the fragment AGAL code for the material.
        */
        public iGetFragmentCode(fragmentAnimatorCode: string): string;
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
        public setBlendMode(value: string): void;
        /**
        * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
        * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
        * @param stageGL The StageGL object which is currently used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @private
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Clears the render state for the pass. This needs to be called before activating another pass.
        * @param stageGL The StageGL used for rendering
        *
        * @private
        */
        public iDeactivate(stageGL: base.StageGL): void;
        /**
        * Marks the shader program as invalid, so it will be recompiled before the next render.
        *
        * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
        */
        public iInvalidateShaderProgram(updateMaterial?: boolean): void;
        /**
        * Compiles the shader program.
        * @param polyOffsetReg An optional register that contains an amount by which to inflate the model (used in single object depth map rendering).
        */
        public iUpdateProgram(stageGL: base.StageGL): void;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see away.materials.LightPickerBase
        * @see away.materials.StaticLightPicker
        */
        public lightPicker : LightPickerBase;
        /**
        * Called when the light picker's configuration changes.
        */
        private onLightsChange(event);
        /**
        * Implemented by subclasses if the pass uses lights to update the shader.
        */
        public pUpdateLights(): void;
        /**
        * Indicates whether visible textures (or other pixels) used by this material have
        * already been premultiplied. Toggle this if you are seeing black halos around your
        * blended alpha edges.
        */
        public alphaPremultiplied : boolean;
    }
}
declare module away.materials {
    /**
    * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
    class CompiledPass extends MaterialPassBase {
        public _iPasses: MaterialPassBase[];
        public _iPassesDirty: boolean;
        public _pSpecularLightSources: number;
        public _pDiffuseLightSources: number;
        private _vertexCode;
        private _fragmentLightCode;
        private _framentPostLightCode;
        public _pVertexConstantData: number[];
        public _pFragmentConstantData: number[];
        private _commonsDataIndex;
        public _pProbeWeightsIndex: number;
        private _uvBufferIndex;
        private _secondaryUVBufferIndex;
        private _normalBufferIndex;
        private _tangentBufferIndex;
        private _sceneMatrixIndex;
        private _sceneNormalMatrixIndex;
        public _pLightFragmentConstantIndex: number;
        public _pCameraPositionIndex: number;
        private _uvTransformIndex;
        public _pLightProbeDiffuseIndices: number[];
        public _pLightProbeSpecularIndices: number[];
        public _pAmbientLightR: number;
        public _pAmbientLightG: number;
        public _pAmbientLightB: number;
        public _pCompiler: ShaderCompiler;
        public _pMethodSetup: ShaderMethodSetup;
        private _usingSpecularMethod;
        private _usesNormals;
        public _preserveAlpha: boolean;
        private _animateUVs;
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumLightProbes: number;
        private _enableLightFallOff;
        private _forceSeparateMVP;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new CompiledPass object.
        * @param material The material to which this pass belongs.
        */
        constructor(material: MaterialBase);
        /**
        * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
        * compatibility for constrained mode.
        */
        public enableLightFallOff : boolean;
        /**
        * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
        * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
        * projection code.
        */
        public forceSeparateMVP : boolean;
        /**
        * The amount of point lights that need to be supported.
        */
        public iNumPointLights : number;
        /**
        * The amount of directional lights that need to be supported.
        */
        public iNumDirectionalLights : number;
        /**
        * The amount of light probes that need to be supported.
        */
        public iNumLightProbes : number;
        /**
        * @inheritDoc
        */
        public iUpdateProgram(stageGL: base.StageGL): void;
        /**
        * Resets the compilation state.
        *
        * @param profile The compatibility profile used by the renderer.
        */
        private reset(profile);
        /**
        * Updates the amount of used register indices.
        */
        private updateUsedOffsets();
        /**
        * Initializes the unchanging constant data for this material.
        */
        private initConstantData();
        /**
        * Initializes the compiler for this pass.
        * @param profile The compatibility profile used by the renderer.
        */
        public iInitCompiler(profile: string): void;
        /**
        * Factory method to create a concrete compiler object for this pass.
        * @param profile The compatibility profile used by the renderer.
        */
        public pCreateCompiler(profile: string): ShaderCompiler;
        /**
        * Copies the shader's properties from the compiler.
        */
        public pUpdateShaderProperties(): void;
        /**
        * Updates the indices for various registers.
        */
        public pUpdateRegisterIndices(): void;
        /**
        * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
        */
        public preserveAlpha : boolean;
        /**
        * Indicate whether UV coordinates need to be animated using the renderable's transformUV matrix.
        */
        public animateUVs : boolean;
        /**
        * @inheritDoc
        */
        public mipmap : boolean;
        /**
        * The normal map to modulate the direction of the surface for each texel. The default normal method expects
        * tangent-space normal maps, but others could expect object-space maps.
        */
        public normalMap : textures.Texture2DBase;
        /**
        * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
        */
        public normalMethod : NormalBasicMethod;
        /**
        * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
        */
        public ambientMethod : AmbientBasicMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
        */
        public diffuseMethod : DiffuseBasicMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
        */
        public specularMethod : SpecularBasicMethod;
        /**
        * Initializes the pass.
        */
        private init();
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public iInvalidateShaderProgram(updateMaterial?: boolean): void;
        /**
        * Adds any possible passes needed by the used methods.
        */
        public pAddPassesFromMethods(): void;
        /**
        * Adds internal passes to the material.
        *
        * @param passes The passes to add.
        */
        public pAddPasses(passes: MaterialPassBase[]): void;
        /**
        * Initializes the default UV transformation matrix.
        */
        public pInitUVTransformData(): void;
        /**
        * Initializes commonly required constant values.
        */
        public pInitCommonsData(): void;
        /**
        * Cleans up the after compiling.
        */
        public pCleanUp(): void;
        /**
        * Updates method constants if they have changed.
        */
        public pUpdateMethodConstants(): void;
        /**
        * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
        */
        public pUpdateLightConstants(): void;
        /**
        * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
        */
        public pUpdateProbes(stageGL: base.StageGL): void;
        /**
        * Called when any method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
        /**
        * @inheritDoc
        */
        public iGetVertexCode(): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(animatorCode: string): string;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * Indicates whether the shader uses any light probes.
        */
        public pUsesProbes(): boolean;
        /**
        * Indicates whether the shader uses any lights.
        */
        public pUsesLights(): boolean;
        /**
        * @inheritDoc
        */
        public iDeactivate(stageGL: base.StageGL): void;
        /**
        * Define which light source types to use for specular reflections. This allows choosing between regular lights
        * and/or light probes for specular reflections.
        *
        * @see away3d.materials.LightSources
        */
        public specularLightSources : number;
        /**
        * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
        * and/or light probes for diffuse reflections.
        *
        * @see away3d.materials.LightSources
        */
        public diffuseLightSources : number;
    }
}
declare module away.materials {
    /**
    * SuperShaderPass is a shader pass that uses shader methods to compile a complete program. It includes all methods
    * associated with a material.
    *
    * @see away3d.materials.methods.ShadingMethodBase
    */
    class SuperShaderPass extends CompiledPass {
        private _includeCasters;
        private _ignoreLights;
        /**
        * Creates a new SuperShaderPass objects.
        *
        * @param material The material to which this material belongs.
        */
        constructor(material: MaterialBase);
        /**
        * @inheritDoc
        */
        public pCreateCompiler(profile: string): ShaderCompiler;
        /**
        * Indicates whether lights that cast shadows should be included in the pass.
        */
        public includeCasters : boolean;
        /**
        * The ColorTransform object to transform the colour of the material with. Defaults to null.
        */
        public colorTransform : geom.ColorTransform;
        /**
        * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
        */
        public colorTransformMethod : EffectColorTransformMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addMethod(method: EffectMethodBase): void;
        /**
        * The number of "effect" methods added to the material.
        */
        public numMethods : number;
        /**
        * Queries whether a given effect method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasMethod(method: EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addMethodAt(method: EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeMethod(method: EffectMethodBase): void;
        /**
        * @inheritDoc
        */
        public pUpdateLights(): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public pAddPassesFromMethods(): void;
        /**
        * Indicates whether any light probes are used to contribute to the specular shading.
        */
        private usesProbesForSpecular();
        /**
        * Indicates whether any light probes are used to contribute to the diffuse shading.
        */
        private usesProbesForDiffuse();
        /**
        * @inheritDoc
        */
        public pUpdateMethodConstants(): void;
        /**
        * @inheritDoc
        */
        public pUpdateLightConstants(): void;
        /**
        * @inheritDoc
        */
        public pUpdateProbes(stageGL: base.StageGL): void;
        /**
        * Indicates whether lights should be ignored in this pass. This is used when only effect methods are rendered in
        * a multipass material.
        */
        public iIgnoreLights : boolean;
    }
}
declare module away.materials {
    /**
    * DepthMapPass is a pass that writes depth values to a depth map as a 32-bit value exploded over the 4 texture channels.
    * This is used to render shadow maps, depth maps, etc.
    */
    class DepthMapPass extends MaterialPassBase {
        private _data;
        private _alphaThreshold;
        private _alphaMask;
        /**
        * Creates a new DepthMapPass object.
        */
        constructor();
        /**
        * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
        * invisible or entirely opaque, often used with textures for foliage, etc.
        * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
        */
        public alphaThreshold : number;
        /**
        * A texture providing alpha data to be able to prevent semi-transparent pixels to write to the alpha mask.
        * Usually the diffuse texture when alphaThreshold is used.
        */
        public alphaMask : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(code: string): string;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * DistanceMapPass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
    * This is used to render omnidirectional shadow maps.
    */
    class DistanceMapPass extends MaterialPassBase {
        private _fragmentData;
        private _vertexData;
        private _alphaThreshold;
        private _alphaMask;
        /**
        * Creates a new DistanceMapPass object.
        */
        constructor();
        /**
        * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
        * invisible or entirely opaque, often used with textures for foliage, etc.
        * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
        */
        public alphaThreshold : number;
        /**
        * A texture providing alpha data to be able to prevent semi-transparent pixels to write to the alpha mask.
        * Usually the diffuse texture when alphaThreshold is used.
        */
        public alphaMask : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(animationCode: string): string;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * LightingPass is a shader pass that uses shader methods to compile a complete program. It only includes the lighting
    * methods. It's used by multipass materials to accumulate lighting passes.
    *
    * @see away3d.materials.MultiPassMaterialBase
    */
    class LightingPass extends CompiledPass {
        private _includeCasters;
        private _tangentSpace;
        private _lightVertexConstantIndex;
        private _inverseSceneMatrix;
        private _directionalLightsOffset;
        private _pointLightsOffset;
        private _lightProbesOffset;
        private _maxLights;
        /**
        * Creates a new LightingPass objects.
        *
        * @param material The material to which this pass belongs.
        */
        constructor(material: MaterialBase);
        /**
        * Indicates the offset in the light picker's directional light vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        public directionalLightsOffset : number;
        /**
        * Indicates the offset in the light picker's point light vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        public pointLightsOffset : number;
        /**
        * Indicates the offset in the light picker's light probes vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        public lightProbesOffset : number;
        /**
        * @inheritDoc
        */
        public pCreateCompiler(profile: string): ShaderCompiler;
        /**
        * Indicates whether or not shadow casting lights need to be included.
        */
        public includeCasters : boolean;
        /**
        * @inheritDoc
        */
        public pUpdateLights(): void;
        /**
        * Calculates the amount of directional lights this material will support.
        * @param numDirectionalLights The maximum amount of directional lights to support.
        * @return The amount of directional lights this material will support, bounded by the amount necessary.
        */
        private calculateNumDirectionalLights(numDirectionalLights);
        /**
        * Calculates the amount of point lights this material will support.
        * @param numDirectionalLights The maximum amount of point lights to support.
        * @return The amount of point lights this material will support, bounded by the amount necessary.
        */
        private calculateNumPointLights(numPointLights);
        /**
        * Calculates the amount of light probes this material will support.
        * @param numDirectionalLights The maximum amount of light probes to support.
        * @return The amount of light probes this material will support, bounded by the amount necessary.
        */
        private calculateNumProbes(numLightProbes);
        /**
        * @inheritDoc
        */
        public pUpdateShaderProperties(): void;
        /**
        * @inheritDoc
        */
        public pUpdateRegisterIndices(): void;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Indicates whether any light probes are used to contribute to the specular shading.
        */
        private usesProbesForSpecular();
        /**
        * Indicates whether any light probes are used to contribute to the diffuse shading.
        */
        private usesProbesForDiffuse();
        /**
        * @inheritDoc
        */
        public pUpdateLightConstants(): void;
        /**
        * @inheritDoc
        */
        public pUpdateProbes(stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * ShadowCasterPass is a shader pass that uses shader methods to compile a complete program. It only draws the lighting
    * contribution for a single shadow-casting light.
    *
    * @see away3d.materials.methods.ShadingMethodBase
    */
    class ShadowCasterPass extends CompiledPass {
        private _tangentSpace;
        private _lightVertexConstantIndex;
        private _inverseSceneMatrix;
        /**
        * Creates a new ShadowCasterPass objects.
        *
        * @param material The material to which this pass belongs.
        */
        constructor(material: MaterialBase);
        /**
        * @inheritDoc
        */
        public pCreateCompiler(profile: string): ShaderCompiler;
        /**
        * @inheritDoc
        */
        public pUpdateLights(): void;
        /**
        * @inheritDoc
        */
        public pUpdateShaderProperties(): void;
        /**
        * @inheritDoc
        */
        public pUpdateRegisterIndices(): void;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public pUpdateLightConstants(): void;
        /**
        * @inheritDoc
        */
        public pUsesProbes(): boolean;
        /**
        * @inheritDoc
        */
        public pUsesLights(): boolean;
        /**
        * @inheritDoc
        */
        public pUpdateProbes(stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
    * of view from a light.
    */
    class SingleObjectDepthPass extends MaterialPassBase {
        private _textures;
        private _projections;
        private _textureSize;
        private _polyOffset;
        private _enc;
        private _projectionTexturesInvalid;
        /**
        * Creates a new SingleObjectDepthPass object.
        * @param textureSize The size of the depth map texture to render to.
        * @param polyOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
        *
        * todo: provide custom vertex code to assembler
        */
        constructor(textureSize?: number, polyOffset?: number);
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * Updates the projection textures used to contain the depth renders.
        */
        private updateProjectionTextures();
        /**
        * @inheritDoc
        */
        public iGetVertexCode(): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(animationCode: string): string;
        /**
        * Gets the depth maps rendered for this object from all lights.
        * @param renderable The renderable for which to retrieve the depth maps.
        * @param stage3DProxy The Stage3DProxy object currently used for rendering.
        * @return A list of depth map textures for all supported lights.
        */
        public _iGetDepthMap(renderable: pool.RenderableBase): textures.RenderTexture;
        /**
        * Retrieves the depth map projection maps for all lights.
        * @param renderable The renderable for which to retrieve the projection maps.
        * @return A list of projection maps for all supported lights.
        */
        public _iGetProjection(renderable: pool.RenderableBase): geom.Matrix3D;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * SegmentPass is a material pass that draws wireframe segments.
    */
    class SegmentPass extends MaterialPassBase {
        static pONE_VECTOR: number[];
        static pFRONT_VECTOR: number[];
        private _constants;
        private _calcMatrix;
        private _thickness;
        /**
        * Creates a new SegmentPass object.
        *
        * @param thickness the thickness of the segments to be drawn.
        */
        constructor(thickness: number);
        /**
        * @inheritDoc
        */
        public iGetVertexCode(): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(animationCode: string): string;
        /**
        * @inheritDoc
        * todo: keep maps in dictionary per renderable
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public pDeactivate(stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
    */
    class SkyboxPass extends MaterialPassBase {
        private _cubeTexture;
        private _vertexData;
        /**
        * Creates a new SkyboxPass object.
        */
        constructor();
        /**
        * The cube texture to use as the skybox.
        */
        public cubeTexture : textures.CubeTextureBase;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(animationCode: string): string;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: base.StageGL, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * MethodVO contains data for a given method for the use within a single material.
    * This allows methods to be shared across materials while their non-public state differs.
    */
    class MethodVO {
        public vertexData: number[];
        public fragmentData: number[];
        public texturesIndex: number;
        public secondaryTexturesIndex: number;
        public vertexConstantsIndex: number;
        public secondaryVertexConstantsIndex: number;
        public fragmentConstantsIndex: number;
        public secondaryFragmentConstantsIndex: number;
        public useMipmapping: boolean;
        public useSmoothTextures: boolean;
        public repeatTextures: boolean;
        public needsProjection: boolean;
        public needsView: boolean;
        public needsNormals: boolean;
        public needsTangents: boolean;
        public needsUV: boolean;
        public needsSecondaryUV: boolean;
        public needsGlobalVertexPos: boolean;
        public needsGlobalFragmentPos: boolean;
        public numLights: number;
        public useLightFallOff: boolean;
        /**
        * Creates a new MethodVO object.
        */
        constructor();
        /**
        * Resets the values of the value object to their "unused" state.
        */
        public reset(): void;
    }
}
declare module away.materials {
    /**
    * MethodVOSet provides a EffectMethodBase and MethodVO combination to be used by a material, allowing methods
    * to be shared across different materials while their internal state changes.
    */
    class MethodVOSet {
        /**
        * An instance of a concrete EffectMethodBase subclass.
        */
        public method: EffectMethodBase;
        /**
        * The MethodVO data for the given method containing the material-specific data for a given material/method combination.
        */
        public data: MethodVO;
        /**
        * Creates a new MethodVOSet object.
        * @param method The method for which we need to store a MethodVO object.
        */
        constructor(method: EffectMethodBase);
    }
}
declare module away.materials {
    /**
    * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
    * the final shading program.
    */
    class ShadingMethodBase extends library.NamedAssetBase {
        public _sharedRegisters: ShaderRegisterData;
        public _passes: MaterialPassBase[];
        /**
        * Create a new ShadingMethodBase object.
        */
        constructor();
        /**
        * Initializes the properties for a MethodVO, including register and texture indices.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        *
        * @internal
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * Initializes unchanging shader constants using the data from a MethodVO.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        *
        * @internal
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * The shared registers created by the compiler and possibly used by methods.
        *
        * @internal
        */
        /**
        * @internal
        */
        public iSharedRegisters : ShaderRegisterData;
        public setISharedRegisters(value: ShaderRegisterData): void;
        /**
        * Any passes required that render to a texture used by this method.
        */
        public passes : MaterialPassBase[];
        /**
        * Cleans up any resources used by the current object.
        */
        public dispose(): void;
        /**
        * Creates a data container that contains material-dependent data. Provided as a factory method so a custom subtype can be overridden when needed.
        *
        * @internal
        */
        public iCreateMethodVO(): MethodVO;
        /**
        * Resets the compilation state of the method.
        *
        * @internal
        */
        public iReset(): void;
        /**
        * Resets the method's state for compilation.
        *
        * @internal
        */
        public iCleanCompilationData(): void;
        /**
        * Get the vertex shader code for this method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        *
        * @internal
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * Sets the render state for this method.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param stageGL The StageGL object currently used for rendering.
        *
        * @internal
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * Sets the render state for a single renderable.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param renderable The renderable currently being rendered.
        * @param stageGL The StageGL object currently used for rendering.
        * @param camera The camera from which the scene is currently rendered.
        *
        * @internal
        */
        public iSetRenderState(vo: MethodVO, renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Clears the render state for this method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param stageGL The StageGL object currently used for rendering.
        *
        * @internal
        */
        public iDeactivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param targetReg The register in which to store the sampled colour.
        * @param inputReg The texture stream register.
        * @param texture The texture which will be assigned to the given slot.
        * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
        * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
        * @return The fragment code that performs the sampling.
        *
        * @protected
        */
        public pGetTex2DSampleCode(vo: MethodVO, targetReg: ShaderRegisterElement, inputReg: ShaderRegisterElement, texture: textures.TextureProxyBase, uvReg?: ShaderRegisterElement, forceWrap?: string): string;
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
        public pGetTexCubeSampleCode(vo: MethodVO, targetReg: ShaderRegisterElement, inputReg: ShaderRegisterElement, texture: textures.TextureProxyBase, uvReg: ShaderRegisterElement): string;
        /**
        * Generates a texture format string for the sample instruction.
        * @param texture The texture for which to get the format string.
        * @return
        *
        * @protected
        */
        private getFormatStringForTexture(texture);
        /**
        * Marks the shader program as invalid, so it will be recompiled before the next render.
        *
        * @internal
        */
        public iInvalidateShaderProgram(): void;
        /**
        * Copies the state from a ShadingMethodBase object into the current object.
        */
        public copyFrom(method: ShadingMethodBase): void;
    }
}
declare module away.materials {
    /**
    * LightingMethodBase provides an abstract base method for shading methods that uses lights.
    * Used for diffuse and specular shaders only.
    */
    class LightingMethodBase extends ShadingMethodBase {
        /**
        * A method that is exposed to wrappers in case the strength needs to be controlled
        */
        public _iModulateMethod: any;
        /**
        * Creates a new LightingMethodBase.
        */
        constructor();
        /**
        * Get the fragment shader code that will be needed before any per-light code is added.
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @private
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * Get the fragment shader code that will generate the code relevant to a single light.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param lightDirReg The register containing the light direction vector.
        * @param lightColReg The register containing the light colour.
        * @param regCache The register cache used during the compilation.
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * Get the fragment shader code that will generate the code relevant to a single light probe object.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param cubeMapReg The register containing the cube map for the current probe
        * @param weightRegister A string representation of the register + component containing the current weight
        * @param regCache The register cache providing any necessary registers to the shader
        */
        public iGetFragmentCodePerProbe(vo: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, regCache: ShaderRegisterCache): string;
        /**
        * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register containing the final shading output.
        * @private
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * ShadowMapMethodBase provides an abstract base method for shadow map methods.
    */
    class ShadowMapMethodBase extends ShadingMethodBase implements library.IAsset {
        public _pCastingLight: lights.LightBase;
        public _pShadowMapper: lights.ShadowMapperBase;
        public _pEpsilon: number;
        public _pAlpha: number;
        /**
        * Creates a new ShadowMapMethodBase object.
        * @param castingLight The light used to cast shadows.
        */
        constructor(castingLight: lights.LightBase);
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * The "transparency" of the shadows. This allows making shadows less strong.
        */
        public alpha : number;
        /**
        * The light casting the shadows.
        */
        public castingLight : lights.LightBase;
        /**
        * A small value to counter floating point precision errors when comparing values in the shadow map with the
        * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
        */
        public epsilon : number;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * ShaderMethodSetup contains the method configuration for an entire material.
    */
    class ShaderMethodSetup extends events.EventDispatcher {
        public _iColorTransformMethod: EffectColorTransformMethod;
        public _iColorTransformMethodVO: MethodVO;
        public _iNormalMethod: NormalBasicMethod;
        public _iNormalMethodVO: MethodVO;
        public _iAmbientMethod: AmbientBasicMethod;
        public _iAmbientMethodVO: MethodVO;
        public _iShadowMethod: ShadowMapMethodBase;
        public _iShadowMethodVO: MethodVO;
        public _iDiffuseMethod: DiffuseBasicMethod;
        public _iDiffuseMethodVO: MethodVO;
        public _iSpecularMethod: SpecularBasicMethod;
        public _iSpecularMethodVO: MethodVO;
        public _iMethods: MethodVOSet[];
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new <code>ShaderMethodSetup</code> object.
        */
        constructor();
        /**
        * Called when any method's code is invalidated.
        */
        private onShaderInvalidated(event);
        /**
        * Invalidates the material's shader code.
        */
        private iInvalidateShaderProgram();
        /**
        *  The method used to generate the per-pixel normals.
        */
        public normalMethod : NormalBasicMethod;
        /**
        * The method that provides the ambient lighting contribution.
        */
        public ambientMethod : AmbientBasicMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered.
        */
        public shadowMethod : ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution.
        */
        public diffuseMethod : DiffuseBasicMethod;
        /**
        * The method to perform specular shading.
        */
        public specularMethod : SpecularBasicMethod;
        /**
        * @private
        */
        public iColorTransformMethod : EffectColorTransformMethod;
        /**
        * Disposes the object.
        */
        public dispose(): void;
        /**
        * Removes all listeners from a method.
        */
        private clearListeners(method);
        /**
        * Adds a method to change the material after all lighting is performed.
        * @param method The method to be added.
        */
        public addMethod(method: EffectMethodBase): void;
        /**
        * Queries whether a given effect method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasMethod(method: EffectMethodBase): boolean;
        /**
        * Inserts a method to change the material after all lighting is performed at the given index.
        * @param method The method to be added.
        * @param index The index of the method's occurrence
        */
        public addMethodAt(method: EffectMethodBase, index: number): void;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): EffectMethodBase;
        /**
        * The number of "effect" methods added to the material.
        */
        public numMethods : number;
        /**
        * Removes a method from the pass.
        * @param method The method to be removed.
        */
        public removeMethod(method: EffectMethodBase): void;
        private getMethodSetForMethod(method);
    }
}
declare module away.materials {
    /**
    * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
    */
    class AmbientBasicMethod extends ShadingMethodBase {
        private _useTexture;
        private _texture;
        public _pAmbientInputRegister: ShaderRegisterElement;
        private _ambientColor;
        private _ambientR;
        private _ambientG;
        private _ambientB;
        private _ambient;
        public _iLightAmbientR: number;
        public _iLightAmbientG: number;
        public _iLightAmbientB: number;
        /**
        * Creates a new AmbientBasicMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * The strength of the ambient reflection of the surface.
        */
        public ambient : number;
        /**
        * The colour of the ambient reflection of the surface.
        */
        public ambientColor : number;
        /**
        * The bitmapData to use to define the diffuse reflection color per texel.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * Updates the ambient color data used by the render state.
        */
        private updateAmbient();
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: MethodVO, renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
    * approximate global lighting rather than lights.
    */
    class AmbientEnvMapMethod extends AmbientBasicMethod {
        private _cubeTexture;
        /**
        * Creates a new <code>AmbientEnvMapMethod</code> object.
        *
        * @param envMap The cube environment map to use for the ambient lighting.
        */
        constructor(envMap: textures.CubeTextureBase);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The cube environment map to use for the diffuse lighting.
        */
        public envMap : textures.CubeTextureBase;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
    */
    class DiffuseBasicMethod extends LightingMethodBase {
        private _useAmbientTexture;
        public _pUseTexture: boolean;
        public _pTotalLightColorReg: ShaderRegisterElement;
        public _pDiffuseInputRegister: ShaderRegisterElement;
        private _texture;
        private _diffuseColor;
        private _diffuseR;
        private _diffuseG;
        private _diffuseB;
        private _diffuseA;
        public _pShadowRegister: ShaderRegisterElement;
        private _alphaThreshold;
        public _pIsFirstLight: boolean;
        /**
        * Creates a new DiffuseBasicMethod object.
        */
        constructor();
        /**
        * Set internally if the ambient method uses a texture.
        */
        public iUseAmbientTexture : boolean;
        public iInitVO(vo: MethodVO): void;
        /**
        * Forces the creation of the texture.
        * @param stageGL The StageGL used by the renderer
        */
        public generateMip(stageGL: base.StageGL): void;
        /**
        * The alpha component of the diffuse reflection.
        */
        public diffuseAlpha : number;
        /**
        * The color of the diffuse reflection when not using a texture.
        */
        public diffuseColor : number;
        /**
        * The bitmapData to use to define the diffuse reflection color per texel.
        */
        public texture : textures.Texture2DBase;
        /**
        * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
        * invisible or entirely opaque, often used with textures for foliage, etc.
        * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
        */
        public alphaThreshold : number;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(vo: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * Generate the code that applies the calculated shadow to the diffuse light
        * @param vo The MethodVO object for which the compilation is currently happening.
        * @param regCache The register cache the compiler is currently using for the register management.
        */
        public pApplyShadow(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * Updates the diffuse color data used by the render state.
        */
        private updateDiffuse();
        /**
        * Set internally by the compiler, so the method knows the register containing the shadow calculation.
        */
        public iShadowRegister : ShaderRegisterElement;
        public setIShadowRegister(value: ShaderRegisterElement): void;
    }
}
declare module away.materials {
    /**
    * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
    * calculated diffuse reflection strength.
    */
    class DiffuseCompositeMethod extends DiffuseBasicMethod {
        public pBaseMethod: DiffuseBasicMethod;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new <code>DiffuseCompositeMethod</code> object.
        *
        * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
        * @param baseMethod The base diffuse method on which this method's shading is based.
        */
        constructor(modulateMethod: Function, baseMethod?: DiffuseBasicMethod);
        /**
        * The base diffuse method on which this method's shading is based.
        */
        public baseMethod : DiffuseBasicMethod;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public alphaThreshold : number;
        /**
        * @inheritDoc
        */
        /**
        * @inheritDoc
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        /**
        * @inheritDoc
        */
        public diffuseAlpha : number;
        /**
        * @inheritDoc
        */
        /**
        * @inheritDoc
        */
        public diffuseColor : number;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(vo: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iReset(): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iSharedRegisters : ShaderRegisterData;
        public setISharedRegisters(value: ShaderRegisterData): void;
        /**
        * @inheritDoc
        */
        public iShadowRegister : ShaderRegisterElement;
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    /**
    * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
    */
    class DiffuseCelMethod extends DiffuseCompositeMethod {
        private _levels;
        private _dataReg;
        private _smoothness;
        /**
        * Creates a new DiffuseCelMethod object.
        * @param levels The amount of shadow gradations.
        * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
        */
        constructor(levels?: number, baseMethod?: DiffuseBasicMethod);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * The amount of shadow gradations.
        */
        public levels : number;
        /**
        * The smoothness of the edge between 2 shading levels.
        */
        public smoothness : number;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * Snaps the diffuse shading of the wrapped method to one of the levels.
        * @param vo The MethodVO used to compile the current shader.
        * @param t The register containing the diffuse strength in the "w" component.
        * @param regCache The register cache used for the shader compilation.
        * @param sharedRegisters The shared register data for this shader.
        * @return The AGAL fragment code for the method.
        */
        private clampDiffuse(vo, t, regCache, sharedRegisters);
    }
}
declare module away.materials {
    /**
    * DiffuseDepthMethod provides a debug method to visualise depth maps
    */
    class DiffuseDepthMethod extends DiffuseBasicMethod {
        /**
        * Creates a new DiffuseBasicMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
    * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
    * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
    * scattered light within the skin attributing to the final colour)
    */
    class DiffuseGradientMethod extends DiffuseBasicMethod {
        private _gradientTextureRegister;
        private _gradient;
        /**
        * Creates a new DiffuseGradientMethod object.
        * @param gradient A texture that contains the light colour based on the angle. This can be used to change
        * the light colour due to subsurface scattering when the surface faces away from the light.
        */
        constructor(gradient: textures.Texture2DBase);
        /**
        * A texture that contains the light colour based on the angle. This can be used to change the light colour
        * due to subsurface scattering when the surface faces away from the light.
        */
        public gradient : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public pApplyShadow(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
    * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
    * than only the diffuse lighting value.
    */
    class DiffuseLightMapMethod extends DiffuseCompositeMethod {
        /**
        * Indicates the light map should be multiplied with the calculated shading result.
        * This can be used to add pre-calculated shadows or occlusion.
        */
        static MULTIPLY: string;
        /**
        * Indicates the light map should be added into the calculated shading result.
        * This can be used to add pre-calculated lighting or global illumination.
        */
        static ADD: string;
        private _lightMapTexture;
        private _blendMode;
        private _useSecondaryUV;
        /**
        * Creates a new DiffuseLightMapMethod method.
        *
        * @param lightMap The texture containing the light map.
        * @param blendMode The blend mode with which the light map should be applied to the lighting result.
        * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
        * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
        */
        constructor(lightMap: textures.Texture2DBase, blendMode?: string, useSecondaryUV?: boolean, baseMethod?: DiffuseBasicMethod);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The blend mode with which the light map should be applied to the lighting result.
        *
        * @see DiffuseLightMapMethod.ADD
        * @see DiffuseLightMapMethod.MULTIPLY
        */
        public blendMode : string;
        /**
        * The texture containing the light map data.
        */
        public lightMapTexture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * DiffuseSubSurfaceMethod provides a depth map-based diffuse shading method that mimics the scattering of
    * light inside translucent surfaces. It allows light to shine through an object and to soften the diffuse shading.
    * It can be used for candle wax, ice, skin, ...
    */
    class DiffuseSubSurfaceMethod extends DiffuseCompositeMethod {
        private _depthPass;
        private _lightProjVarying;
        private _propReg;
        private _scattering;
        private _translucency;
        private _lightColorReg;
        private _scatterColor;
        private _colorReg;
        private _decReg;
        private _scatterR;
        private _scatterG;
        private _scatterB;
        private _targetReg;
        /**
        * Creates a new <code>DiffuseSubSurfaceMethod</code> object.
        *
        * @param depthMapSize The size of the depth map used.
        * @param depthMapOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
        * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
        */
        constructor(depthMapSize?: number, depthMapOffset?: number, baseMethod?: DiffuseBasicMethod);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        public iCleanCompilationData(): void;
        /**
        * The amount by which the light scatters. It can be used to set the translucent surface's thickness. Use low
        * values for skin.
        */
        public scattering : number;
        /**
        * The translucency of the object.
        */
        public translucency : number;
        /**
        * The colour of the "insides" of the object, ie: the colour the light becomes after leaving the object.
        */
        public scatterColor : number;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public setRenderState(vo: MethodVO, renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Generates the code for this method
        */
        private scatterLight(vo, targetReg, regCache, sharedRegisters);
    }
}
declare module away.materials {
    /**
    * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
    * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
    */
    class DiffuseWrapMethod extends DiffuseBasicMethod {
        private _wrapDataRegister;
        private _wrapFactor;
        /**
        * Creates a new DiffuseWrapMethod object.
        * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
        */
        constructor(wrapFactor?: number);
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * A factor to indicate the amount by which the light is allowed to wrap.
        */
        public wrapFactor : number;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
    * and are in essence post-process effects on the materials.
    */
    class EffectMethodBase extends ShadingMethodBase implements library.IAsset {
        constructor();
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register that will be containing the method's output.
        * @private
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
    * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
    * etc).
    */
    class EffectAlphaMaskMethod extends EffectMethodBase {
        private _texture;
        private _useSecondaryUV;
        /**
        * Creates a new EffectAlphaMaskMethod object.
        *
        * @param texture The texture to use as the alpha mask.
        * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
        */
        constructor(texture: textures.Texture2DBase, useSecondaryUV?: boolean);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
        * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
        * transparency over a tiled water surface.
        */
        public useSecondaryUV : boolean;
        /**
        * The texture to use as the alpha mask.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
    */
    class EffectColorMatrixMethod extends EffectMethodBase {
        private _matrix;
        /**
        * Creates a new EffectColorTransformMethod.
        *
        * @param matrix An array of 20 items for 4 x 5 color transform.
        */
        constructor(matrix: number[]);
        /**
        * The 4 x 5 matrix to transform the color of the material.
        */
        public colorMatrix : number[];
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
    * ColorTransform object.
    */
    class EffectColorTransformMethod extends EffectMethodBase {
        private _colorTransform;
        /**
        * Creates a new EffectColorTransformMethod.
        */
        constructor();
        /**
        * The ColorTransform object to transform the colour of the material with.
        */
        public colorTransform : geom.ColorTransform;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
    */
    class EffectEnvMapMethod extends EffectMethodBase {
        private _cubeTexture;
        private _alpha;
        private _mask;
        /**
        * Creates an EffectEnvMapMethod object.
        * @param envMap The environment map containing the reflected scene.
        * @param alpha The reflectivity of the surface.
        */
        constructor(envMap: textures.CubeTextureBase, alpha?: number);
        /**
        * An optional texture to modulate the reflectivity of the surface.
        */
        public mask : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The cubic environment map containing the reflected scene.
        */
        public envMap : textures.CubeTextureBase;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * The reflectivity of the surface.
        */
        public alpha : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectFogMethod provides a method to add distance-based fog to a material.
    */
    class EffectFogMethod extends EffectMethodBase {
        private _minDistance;
        private _maxDistance;
        private _fogColor;
        private _fogR;
        private _fogG;
        private _fogB;
        /**
        * Creates a new EffectFogMethod object.
        * @param minDistance The distance from which the fog starts appearing.
        * @param maxDistance The distance at which the fog is densest.
        * @param fogColor The colour of the fog.
        */
        constructor(minDistance: number, maxDistance: number, fogColor?: number);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * The distance from which the fog starts appearing.
        */
        public minDistance : number;
        /**
        * The distance at which the fog is densest.
        */
        public maxDistance : number;
        /**
        * The colour of the fog.
        */
        public fogColor : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
    * stronger as the viewing angle becomes more grazing.
    */
    class EffectFresnelEnvMapMethod extends EffectMethodBase {
        private _cubeTexture;
        private _fresnelPower;
        private _normalReflectance;
        private _alpha;
        private _mask;
        /**
        * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
        *
        * @param envMap The environment map containing the reflected scene.
        * @param alpha The reflectivity of the material.
        */
        constructor(envMap: textures.CubeTextureBase, alpha?: number);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * An optional texture to modulate the reflectivity of the surface.
        */
        public mask : textures.Texture2DBase;
        /**
        * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
        */
        public fresnelPower : number;
        /**
        * The cubic environment map containing the reflected scene.
        */
        public envMap : textures.CubeTextureBase;
        /**
        * The reflectivity of the surface.
        */
        public alpha : number;
        /**
        * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
        */
        public normalReflectance : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
    * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
    * than the whole pixel colour.
    */
    class EffectLightMapMethod extends EffectMethodBase {
        /**
        * Indicates the light map should be multiplied with the calculated shading result.
        */
        static MULTIPLY: string;
        /**
        * Indicates the light map should be added into the calculated shading result.
        */
        static ADD: string;
        private _texture;
        private _blendMode;
        private _useSecondaryUV;
        /**
        * Creates a new EffectLightMapMethod object.
        *
        * @param texture The texture containing the light map.
        * @param blendMode The blend mode with which the light map should be applied to the lighting result.
        * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
        */
        constructor(texture: textures.Texture2DBase, blendMode?: string, useSecondaryUV?: boolean);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The blend mode with which the light map should be applied to the lighting result.
        *
        * @see EffectLightMapMethod.ADD
        * @see EffectLightMapMethod.MULTIPLY
        */
        public blendMode : string;
        /**
        * The texture containing the light map.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
    */
    class EffectRefractionEnvMapMethod extends EffectMethodBase {
        private _envMap;
        private _dispersionR;
        private _dispersionG;
        private _dispersionB;
        private _useDispersion;
        private _refractionIndex;
        private _alpha;
        /**
        * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
        *
        * @param envMap The environment map containing the refracted scene.
        * @param refractionIndex The refractive index of the material.
        * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
        * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
        * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
        */
        constructor(envMap: textures.CubeTextureBase, refractionIndex?: number, dispersionR?: number, dispersionG?: number, dispersionB?: number);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The cube environment map to use for the refraction.
        */
        public envMap : textures.CubeTextureBase;
        /**
        * The refractive index of the material.
        */
        public refractionIndex : number;
        /**
        * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
        */
        public dispersionR : number;
        /**
        * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
        */
        public dispersionG : number;
        /**
        * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
        */
        public dispersionB : number;
        /**
        * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
        * material. A value of 1 will make it appear fully transparent.
        */
        public alpha : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
    */
    class EffectRimLightMethod extends EffectMethodBase {
        static ADD: string;
        static MULTIPLY: string;
        static MIX: string;
        private _color;
        private _blendMode;
        private _colorR;
        private _colorG;
        private _colorB;
        private _strength;
        private _power;
        /**
        * Creates a new <code>EffectRimLightMethod</code> object.
        *
        * @param color The colour of the rim light.
        * @param strength The strength of the rim light.
        * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
        * @param blend The blend mode with which to add the light to the object.
        */
        constructor(color?: number, strength?: number, power?: number, blend?: string);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The blend mode with which to add the light to the object.
        *
        * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
        * EffectRimLightMethod.ADD adds the rim light with the material's colour.
        * EffectRimLightMethod.MIX provides normal alpha blending.
        */
        public blendMode : string;
        /**
        * The color of the rim light.
        */
        public color : number;
        /**
        * The strength of the rim light.
        */
        public strength : number;
        /**
        * The power of the rim light. Higher values will result in a higher edge fall-off.
        */
        public power : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * NormalBasicMethod is the default method for standard tangent-space normal mapping.
    */
    class NormalBasicMethod extends ShadingMethodBase {
        private _texture;
        private _useTexture;
        public _pNormalTextureRegister: ShaderRegisterElement;
        /**
        * Creates a new NormalBasicMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
        */
        public iTangentSpace : boolean;
        /**
        * Indicates if the normal method output is not based on a texture (if not, it will usually always return true)
        * Override if subclasses are different.
        */
        public iHasOutput : boolean;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * The texture containing the normals per pixel.
        */
        public normalMap : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
    */
    class NormalHeightMapMethod extends NormalBasicMethod {
        private _worldXYRatio;
        private _worldXZRatio;
        /**
        * Creates a new NormalHeightMapMethod method.
        *
        * @param heightMap The texture containing the height data. 0 means low, 1 means high.
        * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
        * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
        * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
        */
        constructor(heightMap: textures.Texture2DBase, worldWidth: number, worldHeight: number, worldDepth: number);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public tangentSpace : boolean;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
    */
    class NormalSimpleWaterMethod extends NormalBasicMethod {
        private _texture2;
        private _normalTextureRegister2;
        private _useSecondNormalMap;
        private _water1OffsetX;
        private _water1OffsetY;
        private _water2OffsetX;
        private _water2OffsetY;
        /**
        * Creates a new NormalSimpleWaterMethod object.
        * @param waveMap1 A normal map containing one layer of a wave structure.
        * @param waveMap2 A normal map containing a second layer of a wave structure.
        */
        constructor(waveMap1: textures.Texture2DBase, waveMap2: textures.Texture2DBase);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The translation of the first wave layer along the X-axis.
        */
        public water1OffsetX : number;
        /**
        * The translation of the first wave layer along the Y-axis.
        */
        public water1OffsetY : number;
        /**
        * The translation of the second wave layer along the X-axis.
        */
        public water2OffsetX : number;
        /**
        * The translation of the second wave layer along the Y-axis.
        */
        public water2OffsetY : number;
        /**
        * A second normal map that will be combined with the first to create a wave-like animation pattern.
        */
        public secondaryNormalMap : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
    */
    class ShadowMethodBase extends ShadowMapMethodBase {
        public _pDepthMapCoordReg: ShaderRegisterElement;
        public _pUsePoint: boolean;
        /**
        * Creates a new ShadowMethodBase object.
        * @param castingLight The light used to cast shadows.
        */
        constructor(castingLight: lights.LightBase);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * Wrappers that override the vertex shader need to set this explicitly
        */
        public _iDepthMapCoordReg : ShaderRegisterElement;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * Gets the vertex code for shadow mapping with a point light.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        */
        public _pGetPointVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        */
        public pGetPlanarVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * Gets the fragment code for shadow mapping with a planar shadow map.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register to contain the shadow coverage
        * @return
        */
        public _pGetPlanarFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * Gets the fragment code for shadow mapping with a point light.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register to contain the shadow coverage
        * @return
        */
        public _pGetPointFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: MethodVO, renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Gets the fragment code for combining this method with a cascaded shadow map method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param decodeRegister The register containing the data to decode the shadow map depth value.
        * @param depthTexture The texture containing the shadow map.
        * @param depthProjection The projection of the fragment relative to the light.
        * @param targetRegister The register to contain the shadow coverage
        * @return
        */
        public _iGetCascadeFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * Sets the method state for cascade shadow mapping.
        */
        public iActivateForCascade(vo: MethodVO, stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
    * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
    *
    * @see away.lights.CascadeShadowMapper
    */
    class ShadowCascadeMethod extends ShadowMapMethodBase {
        private _baseMethod;
        private _cascadeShadowMapper;
        private _depthMapCoordVaryings;
        private _cascadeProjections;
        /**
        * Creates a new ShadowCascadeMethod object.
        *
        * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
        */
        constructor(shadowMethodBase: ShadowMethodBase);
        /**
        * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
        * with a DirectionalShadowMapper.
        *
        * @see ShadowHardMethod
        * @see ShadowSoftMethod
        */
        public baseMethod : ShadowMethodBase;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iSharedRegisters : ShaderRegisterData;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * Creates the registers for the cascades' projection coordinates.
        */
        private initProjectionsRegs(regCache);
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: MethodVO, renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Called when the shadow mappers cascade configuration changes.
        */
        private onCascadeChange(event);
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    /**
    * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
    */
    class ShadowDitheredMethod extends ShadowMethodBase {
        private static _grainTexture;
        private static _grainUsages;
        private static _grainBitmapData;
        private _depthMapSize;
        private _range;
        private _numSamples;
        /**
        * Creates a new ShadowDitheredMethod object.
        * @param castingLight The light casting the shadows
        * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
        */
        constructor(castingLight: lights.DirectionalLight, numSamples?: number, range?: number);
        /**
        * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
        * complexity of the shader.
        */
        public numSamples : number;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * The range in the shadow map in which to distribute the samples.
        */
        public range : number;
        /**
        * Creates a texture containing the dithering noise texture.
        */
        private initGrainTexture();
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * Get the actual shader code for shadow mapping
        * @param regCache The register cache managing the registers.
        * @param depthMapRegister The texture register containing the depth map.
        * @param decReg The register containing the depth map decoding data.
        * @param targetReg The target register to add the shadow coverage.
        */
        private getSampleCode(regCache, customDataReg, depthMapRegister, decReg, targetReg);
        /**
        * Adds the code for another tap to the shader code.
        * @param uvReg The uv register for the tap.
        * @param depthMapRegister The texture register containing the depth map.
        * @param decReg The register containing the depth map decoding data.
        * @param targetReg The target register to add the tap comparison result.
        * @param regCache The register cache managing the registers.
        * @return
        */
        private addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
        /**
        * @inheritDoc
        */
        public iActivateForCascade(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
    * results of neighbouring pixels.
    */
    class ShadowFilteredMethod extends ShadowMethodBase {
        /**
        * Creates a new DiffuseBasicMethod object.
        *
        * @param castingLight The light casting the shadow
        */
        constructor(castingLight: lights.DirectionalLight);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivateForCascade(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
    */
    class ShadowHardMethod extends ShadowMethodBase {
        /**
        * Creates a new ShadowHardMethod object.
        */
        constructor(castingLight: lights.LightBase);
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public _pGetPointFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivateForCascade(vo: MethodVO, stageGL: base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
    * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
    *
    * @see away.lights.NearDirectionalShadowMapper
    */
    class ShadowNearMethod extends ShadowMethodBase {
        private _baseMethod;
        private _fadeRatio;
        private _nearShadowMapper;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new ShadowNearMethod object.
        * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
        * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
        */
        constructor(baseMethod: ShadowMethodBase, fadeRatio?: number);
        /**
        * The base shadow map method on which this method's shading is based.
        */
        public baseMethod : ShadowMethodBase;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public alpha : number;
        /**
        * @inheritDoc
        */
        public epsilon : number;
        /**
        * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
        */
        public fadeRatio : number;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: MethodVO, renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iReset(): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iSharedRegisters : ShaderRegisterData;
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    /**
    * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
    */
    class ShadowSoftMethod extends ShadowMethodBase {
        private _range;
        private _numSamples;
        private _offsets;
        /**
        * Creates a new DiffuseBasicMethod object.
        *
        * @param castingLight The light casting the shadows
        * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
        */
        constructor(castingLight: lights.DirectionalLight, numSamples?: number, range?: number);
        /**
        * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
        * complexity of the shader.
        */
        public numSamples : number;
        /**
        * The range in the shadow map in which to distribute the samples.
        */
        public range : number;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * Adds the code for another tap to the shader code.
        * @param uv The uv register for the tap.
        * @param texture The texture register containing the depth map.
        * @param decode The register containing the depth map decoding data.
        * @param target The target register to add the tap comparison result.
        * @param regCache The register cache managing the registers.
        * @return
        */
        private addSample(uv, texture, decode, target, regCache);
        /**
        * @inheritDoc
        */
        public iActivateForCascade(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: MethodVO, regCache: ShaderRegisterCache, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement): string;
        /**
        * Get the actual shader code for shadow mapping
        * @param regCache The register cache managing the registers.
        * @param depthTexture The texture register containing the depth map.
        * @param decodeRegister The register containing the depth map decoding data.
        * @param targetReg The target register to add the shadow coverage.
        * @param dataReg The register containing additional data.
        */
        private getSampleCode(regCache, depthTexture, decodeRegister, targetRegister, dataReg);
    }
}
declare module away.materials {
    /**
    * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
    * version of Phong specularity).
    */
    class SpecularBasicMethod extends LightingMethodBase {
        public _pUseTexture: boolean;
        public _pTotalLightColorReg: ShaderRegisterElement;
        public _pSpecularTextureRegister: ShaderRegisterElement;
        public _pSpecularTexData: ShaderRegisterElement;
        public _pSpecularDataRegister: ShaderRegisterElement;
        private _texture;
        private _gloss;
        private _specular;
        private _specularColor;
        public _iSpecularR: number;
        public _iSpecularG: number;
        public _iSpecularB: number;
        private _shadowRegister;
        public _pIsFirstLight: boolean;
        /**
        * Creates a new SpecularBasicMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * The sharpness of the specular highlight.
        */
        public gloss : number;
        /**
        * The overall strength of the specular highlights.
        */
        public specular : number;
        /**
        * The colour of the specular reflection of the surface.
        */
        public specularColor : number;
        /**
        * The bitmapData that encodes the specular highlight strength per texel in the red channel, and the sharpness
        * in the green channel. You can use SpecularBitmapTexture if you want to easily set specular and gloss maps
        * from grayscale images, but prepared images are preferred.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(vo: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * Updates the specular color data used by the render state.
        */
        private updateSpecular();
        /**
        * Set internally by the compiler, so the method knows the register containing the shadow calculation.
        */
        public iShadowRegister : ShaderRegisterElement;
        public setIShadowRegister(shadowReg: ShaderRegisterElement): void;
    }
}
declare module away.materials {
    /**
    * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
    * calculated specular reflection strength.
    */
    class SpecularCompositeMethod extends SpecularBasicMethod {
        private _baseMethod;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new <code>SpecularCompositeMethod</code> object.
        *
        * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
        * @param baseMethod The base specular method on which this method's shading is based.
        */
        constructor(modulateMethod: Function, baseMethod?: SpecularBasicMethod);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * The base specular method on which this method's shading is based.
        */
        public baseMethod : SpecularBasicMethod;
        /**
        * @inheritDoc
        */
        public gloss : number;
        /**
        * @inheritDoc
        */
        public specular : number;
        /**
        * @inheritDoc
        */
        public passes : MaterialPassBase[];
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iSharedRegisters : ShaderRegisterData;
        public setISharedRegisters(value: ShaderRegisterData): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        * @return
        */
        public iGetFragmentCodePerProbe(vo: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, regCache: ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: MethodVO, regCache: ShaderRegisterCache, targetReg: ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iReset(): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iShadowRegister : ShaderRegisterElement;
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
/**
*
*/
declare module away.materials {
    /**
    * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
    * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
    * The tangent vectors are used as the surface groove directions.
    */
    class SpecularAnisotropicMethod extends SpecularBasicMethod {
        /**
        * Creates a new SpecularAnisotropicMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
    }
}
declare module away.materials {
    /**
    * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
    */
    class SpecularCelMethod extends SpecularCompositeMethod {
        private _dataReg;
        private _smoothness;
        private _specularCutOff;
        /**
        * Creates a new SpecularCelMethod object.
        * @param specularCutOff The threshold at which the specular highlight should be shown.
        * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
        */
        constructor(specularCutOff?: number, baseMethod?: SpecularBasicMethod);
        /**
        * The smoothness of the highlight edge.
        */
        public smoothness : number;
        /**
        * The threshold at which the specular highlight should be shown.
        */
        public specularCutOff : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
        * @param vo The MethodVO used to compile the current shader.
        * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
        * @param regCache The register cache used for the shader compilation.
        * @param sharedRegisters The shared register data for this shader.
        * @return The AGAL fragment code for the method.
        */
        private clampSpecular(methodVO, target, regCache, sharedRegisters);
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
    }
}
declare module away.materials {
    /**
    * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
    */
    class SpecularFresnelMethod extends SpecularCompositeMethod {
        private _dataReg;
        private _incidentLight;
        private _fresnelPower;
        private _normalReflectance;
        /**
        * Creates a new SpecularFresnelMethod object.
        * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
        * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
        */
        constructor(basedOnSurface?: boolean, baseMethod?: SpecularBasicMethod);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: MethodVO): void;
        /**
        * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
        */
        public basedOnSurface : boolean;
        /**
        * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
        */
        public fresnelPower : number;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
        */
        public normalReflectance : number;
        /**
        * @inheritDoc
        */
        public iActivate(vo: MethodVO, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: MethodVO, regCache: ShaderRegisterCache): string;
        /**
        * Applies the fresnel effect to the specular strength.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
        * @param regCache The register cache used for the shader compilation.
        * @param sharedRegisters The shared registers created by the compiler.
        * @return The AGAL fragment code for the method.
        */
        private modulateSpecular(vo, target, regCache, sharedRegisters);
    }
}
declare module away.materials {
    /**
    * SpecularPhongMethod provides a specular method that provides Phong highlights.
    */
    class SpecularPhongMethod extends SpecularBasicMethod {
        /**
        * Creates a new SpecularPhongMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, regCache: ShaderRegisterCache): string;
    }
}
declare module away.materials {
    /**
    * LightPickerBase provides an abstract base clase for light picker classes. These classes are responsible for
    * feeding materials with relevant lights. Usually, StaticLightPicker can be used, but LightPickerBase can be
    * extended to provide more application-specific dynamic selection of lights.
    *
    * @see StaticLightPicker
    */
    class LightPickerBase extends library.NamedAssetBase implements library.IAsset {
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumCastingPointLights: number;
        public _pNumCastingDirectionalLights: number;
        public _pNumLightProbes: number;
        public _pAllPickedLights: lights.LightBase[];
        public _pPointLights: lights.PointLight[];
        public _pCastingPointLights: lights.PointLight[];
        public _pDirectionalLights: lights.DirectionalLight[];
        public _pCastingDirectionalLights: lights.DirectionalLight[];
        public _pLightProbes: lights.LightProbe[];
        public _pLightProbeWeights: number[];
        /**
        * Creates a new LightPickerBase object.
        */
        constructor();
        /**
        * Disposes resources used by the light picker.
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * The maximum amount of directional lights that will be provided.
        */
        public numDirectionalLights : number;
        /**
        * The maximum amount of point lights that will be provided.
        */
        public numPointLights : number;
        /**
        * The maximum amount of directional lights that cast shadows.
        */
        public numCastingDirectionalLights : number;
        /**
        * The amount of point lights that cast shadows.
        */
        public numCastingPointLights : number;
        /**
        * The maximum amount of light probes that will be provided.
        */
        public numLightProbes : number;
        /**
        * The collected point lights to be used for shading.
        */
        public pointLights : lights.PointLight[];
        /**
        * The collected directional lights to be used for shading.
        */
        public directionalLights : lights.DirectionalLight[];
        /**
        * The collected point lights that cast shadows to be used for shading.
        */
        public castingPointLights : lights.PointLight[];
        /**
        * The collected directional lights that cast shadows to be used for shading.
        */
        public castingDirectionalLights : lights.DirectionalLight[];
        /**
        * The collected light probes to be used for shading.
        */
        public lightProbes : lights.LightProbe[];
        /**
        * The weights for each light probe, defining their influence on the object.
        */
        public lightProbeWeights : number[];
        /**
        * A collection of all the collected lights.
        */
        public allPickedLights : lights.LightBase[];
        /**
        * Updates set of lights for a given renderable and EntityCollector. Always call super.collectLights() after custom overridden code.
        */
        public collectLights(renderable: pool.RenderableBase, entityCollector: traverse.ICollector): void;
        /**
        * Updates the weights for the light probes, based on the renderable's position relative to them.
        * @param renderable The renderble for which to calculate the light probes' influence.
        */
        private updateProbeWeights(renderable);
    }
}
declare module away.materials {
    /**
    * StaticLightPicker is a light picker that provides a static set of lights. The lights can be reassigned, but
    * if the configuration changes (number of directional lights, point lights, etc), a material recompilation may
    * occur.
    */
    class StaticLightPicker extends LightPickerBase {
        private _lights;
        private _onCastShadowChangeDelegate;
        /**
        * Creates a new StaticLightPicker object.
        * @param lights The lights to be used for shading.
        */
        constructor(lights: any);
        /**
        * The lights used for shading.
        */
        public lights : any[];
        /**
        * Remove configuration change listeners on the lights.
        */
        private clearListeners();
        /**
        * Notifies the material of a configuration change.
        */
        private onCastShadowChange(event);
        /**
        * Called when a directional light's shadow casting configuration changes.
        */
        private updateDirectionalCasting(light);
        /**
        * Called when a point light's shadow casting configuration changes.
        */
        private updatePointCasting(light);
    }
}
declare module away.materials {
    /**
    * ShaderRegister Cache provides the usage management system for all registers during shading compilation.
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
        public reset(): void;
        /**
        * Disposes all resources used.
        */
        public dispose(): void;
        /**
        * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addFragmentTempUsages(register: ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeFragmentTempUsage(register: ShaderRegisterElement): void;
        /**
        * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
        * until removeUsage has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addVertexTempUsages(register: ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeVertexTempUsage(register: ShaderRegisterElement): void;
        /**
        * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        */
        public getFreeFragmentVectorTemp(): ShaderRegisterElement;
        /**
        * Retrieve a single component from a fragment temporary register that's still available.
        */
        public getFreeFragmentSingleTemp(): ShaderRegisterElement;
        /**
        * Retrieve an available varying register
        */
        public getFreeVarying(): ShaderRegisterElement;
        /**
        * Retrieve an available fragment constant register
        */
        public getFreeFragmentConstant(): ShaderRegisterElement;
        /**
        * Retrieve an available vertex constant register
        */
        public getFreeVertexConstant(): ShaderRegisterElement;
        /**
        * Retrieve an entire vertex temporary register that's still available.
        */
        public getFreeVertexVectorTemp(): ShaderRegisterElement;
        /**
        * Retrieve a single component from a vertex temporary register that's still available.
        */
        public getFreeVertexSingleTemp(): ShaderRegisterElement;
        /**
        * Retrieve an available vertex attribute register
        */
        public getFreeVertexAttribute(): ShaderRegisterElement;
        /**
        * Retrieve an available texture register
        */
        public getFreeTextureReg(): ShaderRegisterElement;
        /**
        * Indicates the start index from which to retrieve vertex constants.
        */
        public vertexConstantOffset : number;
        /**
        * Indicates the start index from which to retrieve vertex attributes.
        */
        public vertexAttributesOffset : number;
        /**
        * Indicates the start index from which to retrieve varying registers.
        */
        public varyingsOffset : number;
        /**
        * Indicates the start index from which to retrieve fragment constants.
        */
        public fragmentConstantOffset : number;
        /**
        * The fragment output register.
        */
        public fragmentOutputRegister : ShaderRegisterElement;
        /**
        * The amount of used vertex constant registers.
        */
        public numUsedVertexConstants : number;
        /**
        * The amount of used fragment constant registers.
        */
        public numUsedFragmentConstants : number;
        /**
        * The amount of used vertex streams.
        */
        public numUsedStreams : number;
        /**
        * The amount of used texture slots.
        */
        public numUsedTextures : number;
        /**
        * The amount of used varying registers.
        */
        public numUsedVaryings : number;
    }
}
declare module away.materials {
    /**
    * A single register element (an entire register or a single register's component) used by the RegisterPool.
    */
    class ShaderRegisterElement {
        private _regName;
        private _index;
        private _toStr;
        private static COMPONENTS;
        public _component: number;
        /**
        * Creates a new ShaderRegisterElement object.
        * @param regName The name of the register.
        * @param index The index of the register.
        * @param component The register's component, if not the entire register is represented.
        */
        constructor(regName: string, index: number, component?: number);
        /**
        * Converts the register or the components AGAL string representation.
        */
        public toString(): string;
        /**
        * The register's name.
        */
        public regName : string;
        /**
        * The register's index.
        */
        public index : number;
    }
}
declare module away.materials {
    /**
    * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
    */
    class ShaderRegisterData {
        public normalVarying: ShaderRegisterElement;
        public tangentVarying: ShaderRegisterElement;
        public bitangentVarying: ShaderRegisterElement;
        public uvVarying: ShaderRegisterElement;
        public secondaryUVVarying: ShaderRegisterElement;
        public viewDirVarying: ShaderRegisterElement;
        public shadedTarget: ShaderRegisterElement;
        public globalPositionVertex: ShaderRegisterElement;
        public globalPositionVarying: ShaderRegisterElement;
        public localPosition: ShaderRegisterElement;
        public normalInput: ShaderRegisterElement;
        public tangentInput: ShaderRegisterElement;
        public animatedNormal: ShaderRegisterElement;
        public animatedTangent: ShaderRegisterElement;
        public commons: ShaderRegisterElement;
        public projectionFragment: ShaderRegisterElement;
        public normalFragment: ShaderRegisterElement;
        public viewDirFragment: ShaderRegisterElement;
        public bitangent: ShaderRegisterElement;
        constructor();
    }
}
declare module away.materials {
    /**
    * MethodDependencyCounter keeps track of the number of dependencies for "named registers" used across methods.
    * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
    * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
    * each time a method has been compiled into the shader.
    *
    * @see RegisterPool.addUsage
    */
    class MethodDependencyCounter {
        private _projectionDependencies;
        private _normalDependencies;
        private _viewDirDependencies;
        private _uvDependencies;
        private _secondaryUVDependencies;
        private _globalPosDependencies;
        private _tangentDependencies;
        private _usesGlobalPosFragment;
        private _numPointLights;
        private _lightSourceMask;
        /**
        * Creates a new MethodDependencyCounter object.
        */
        constructor();
        /**
        * Clears dependency counts for all registers. Called when recompiling a pass.
        */
        public reset(): void;
        /**
        * Sets the amount of lights that have a position associated with them.
        * @param numPointLights The amount of point lights.
        * @param lightSourceMask The light source types used by the material.
        */
        public setPositionedLights(numPointLights: number, lightSourceMask: number): void;
        /**
        * Increases dependency counters for the named registers listed as required by the given MethodVO.
        * @param methodVO the MethodVO object for which to include dependencies.
        */
        public includeMethodVO(methodVO: MethodVO): void;
        /**
        * The amount of tangent vector dependencies (fragment shader).
        */
        public tangentDependencies : number;
        /**
        * Indicates whether there are any dependencies on the world-space position vector.
        */
        public usesGlobalPosFragment : boolean;
        /**
        * The amount of dependencies on the projected position.
        */
        public projectionDependencies : number;
        /**
        * The amount of dependencies on the normal vector.
        */
        public normalDependencies : number;
        /**
        * The amount of dependencies on the view direction.
        */
        public viewDirDependencies : number;
        /**
        * The amount of dependencies on the primary UV coordinates.
        */
        public uvDependencies : number;
        /**
        * The amount of dependencies on the secondary UV coordinates.
        */
        public secondaryUVDependencies : number;
        /**
        * The amount of dependencies on the global position. This can be 0 while hasGlobalPosDependencies is true when
        * the global position is used as a temporary value (fe to calculate the view direction)
        */
        public globalPosDependencies : number;
        /**
        * Adds any external world space dependencies, used to force world space calculations.
        */
        public addWorldSpaceDependencies(fragmentLights: boolean): void;
    }
}
declare module away.materials {
    /**
    * RegisterPool is used by the shader compilation process to keep track of which registers of a certain type are
    * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
    * or single components (x, y, z, w) of a single register.
    * It is used by ShaderRegisterCache to track usages of individual register types.
    *
    * @see away3d.materials.compilation.ShaderRegisterCache
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
        public requestFreeVectorReg(): ShaderRegisterElement;
        /**
        * Retrieve a single vector component that's still available.
        */
        public requestFreeRegComponent(): ShaderRegisterElement;
        /**
        * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addUsage(register: ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeUsage(register: ShaderRegisterElement): void;
        /**
        * Disposes any resources used by the current RegisterPool object.
        */
        public dispose(): void;
        /**
        * Indicates whether or not any registers are in use.
        */
        public hasRegisteredRegs(): boolean;
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
}
declare module away.materials {
    /**
    * ShaderCompiler is an abstract base class for shader compilers that use modular shader methods to assemble a
    * material. Concrete subclasses are used by the default materials.
    *
    * @see away3d.materials.methods.ShadingMethodBase
    */
    class ShaderCompiler {
        public _pSharedRegisters: ShaderRegisterData;
        public _pRegisterCache: ShaderRegisterCache;
        public _pDependencyCounter: MethodDependencyCounter;
        public _pMethodSetup: ShaderMethodSetup;
        private _smooth;
        private _repeat;
        private _mipmap;
        public _pEnableLightFallOff: boolean;
        private _preserveAlpha;
        private _animateUVs;
        public _pAlphaPremultiplied: boolean;
        private _vertexConstantData;
        private _fragmentConstantData;
        public _pVertexCode: string;
        public _pFragmentCode: string;
        private _fragmentLightCode;
        private _fragmentPostLightCode;
        private _commonsDataIndex;
        public _pAnimatableAttributes: string[];
        public _pAnimationTargetRegisters: string[];
        public _pLightProbeDiffuseIndices: number[];
        public _pLightProbeSpecularIndices: number[];
        private _uvBufferIndex;
        private _uvTransformIndex;
        private _secondaryUVBufferIndex;
        public _pNormalBufferIndex: number;
        public _pTangentBufferIndex: number;
        public _pLightFragmentConstantIndex: number;
        private _sceneMatrixIndex;
        public _pSceneNormalMatrixIndex: number;
        public _pCameraPositionIndex: number;
        public _pProbeWeightsIndex: number;
        private _specularLightSources;
        private _diffuseLightSources;
        public _pNumLights: number;
        public _pNumLightProbes: number;
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumProbeRegisters: number;
        private _combinedLightSources;
        public _usingSpecularMethod: boolean;
        private _needUVAnimation;
        private _UVTarget;
        private _UVSource;
        public _pProfile: string;
        private _forceSeperateMVP;
        /**
        * Creates a new ShaderCompiler object.
        * @param profile The compatibility profile of the renderer.
        */
        constructor(profile: string);
        /**
        * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
        * compatibility for constrained mode.
        */
        public enableLightFallOff : boolean;
        /**
        * Indicates whether the compiled code needs UV animation.
        */
        public needUVAnimation : boolean;
        /**
        * The target register to place the animated UV coordinate.
        */
        public UVTarget : string;
        /**
        * The souce register providing the UV coordinate to animate.
        */
        public UVSource : string;
        /**
        * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
        * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
        * projection code.
        */
        public forceSeperateMVP : boolean;
        /**
        * Initialized the register cache.
        * @param profile The compatibility profile of the renderer.
        */
        private initRegisterCache(profile);
        /**
        * Indicate whether UV coordinates need to be animated using the renderable's transformUV matrix.
        */
        public animateUVs : boolean;
        /**
        * Indicates whether visible textures (or other pixels) used by this material have
        * already been premultiplied.
        */
        public alphaPremultiplied : boolean;
        /**
        * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
        */
        public preserveAlpha : boolean;
        /**
        * Sets the default texture sampling properties.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to true.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to true.
        */
        public setTextureSampling(smooth: boolean, repeat: boolean, mipmap: boolean): void;
        /**
        * Sets the constant buffers allocated by the material. This allows setting constant data during compilation.
        * @param vertexConstantData The vertex constant data buffer.
        * @param fragmentConstantData The fragment constant data buffer.
        */
        public setConstantDataBuffers(vertexConstantData: number[], fragmentConstantData: number[]): void;
        /**
        * The shader method setup object containing the method configuration and their value objects for the material being compiled.
        */
        public methodSetup : ShaderMethodSetup;
        /**
        * Compiles the code after all setup on the compiler has finished.
        */
        public compile(): void;
        /**
        * Creates the registers to contain the normal data.
        */
        public pCreateNormalRegisters(): void;
        /**
        * Compile the code for the methods.
        */
        public pCompileMethodsCode(): void;
        /**
        * Compile the lighting code.
        */
        public pCompileLightingCode(): void;
        /**
        * Calculate the view direction.
        */
        public pCompileViewDirCode(): void;
        /**
        * Calculate the normal.
        */
        public pCompileNormalCode(): void;
        /**
        * Calculate the (possibly animated) UV coordinates.
        */
        private compileUVCode();
        /**
        * Provide the secondary UV coordinates.
        */
        private compileSecondaryUVCode();
        /**
        * Compile the world-space position.
        */
        public pCompileGlobalPositionCode(): void;
        /**
        * Get the projection coordinates.
        */
        private compileProjectionCode();
        /**
        * Assign the final output colour the the output register.
        */
        private compileFragmentOutput();
        /**
        * Reset all the indices to "unused".
        */
        public pInitRegisterIndices(): void;
        /**
        * Prepares the setup for the light code.
        */
        public pInitLightData(): void;
        /**
        * Create the commonly shared constant register.
        */
        private createCommons();
        /**
        * Figure out which named registers are required, and how often.
        */
        public pCalculateDependencies(): void;
        /**
        * Counts the dependencies for a given method.
        * @param method The method to count the dependencies for.
        * @param methodVO The method's data for this material.
        */
        private setupAndCountMethodDependencies(method, methodVO);
        /**
        * Assigns all prerequisite data for the methods, so we can calculate dependencies for them.
        */
        private setupMethod(method, methodVO);
        /**
        * The index for the common data register.
        */
        public commonsDataIndex : number;
        /**
        * Assigns the shared register data to all methods.
        */
        private updateMethodRegisters();
        /**
        * The amount of vertex constants used by the material. Any animation code to be added can append its vertex
        * constant data after this.
        */
        public numUsedVertexConstants : number;
        /**
        * The amount of fragment constants used by the material. Any animation code to be added can append its vertex
        * constant data after this.
        */
        public numUsedFragmentConstants : number;
        /**
        * The amount of vertex attribute streams used by the material. Any animation code to be added can add its
        * streams after this. Also used to automatically disable attribute slots on pass deactivation.
        */
        public numUsedStreams : number;
        /**
        * The amount of textures used by the material. Used to automatically disable texture slots on pass deactivation.
        */
        public numUsedTextures : number;
        /**
        * Number of used varyings. Any animation code to be added can add its used varyings after this.
        */
        public numUsedVaryings : number;
        /**
        * Indicates whether lights are used for specular reflections.
        */
        public pUsesLightsForSpecular(): boolean;
        /**
        * Indicates whether lights are used for diffuse reflections.
        */
        public pUsesLightsForDiffuse(): boolean;
        /**
        * Disposes all resources used by the compiler.
        */
        public dispose(): void;
        /**
        * Clean up method's compilation data after compilation finished.
        */
        private cleanUpMethods();
        /**
        * Define which light source types to use for specular reflections. This allows choosing between regular lights
        * and/or light probes for specular reflections.
        *
        * @see away3d.materials.LightSources
        */
        public specularLightSources : number;
        /**
        * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
        * and/or light probes for diffuse reflections.
        *
        * @see away3d.materials.LightSources
        */
        public diffuseLightSources : number;
        /**
        * Indicates whether light probes are being used for specular reflections.
        */
        public pUsesProbesForSpecular(): boolean;
        /**
        * Indicates whether light probes are being used for diffuse reflections.
        */
        public pUsesProbesForDiffuse(): boolean;
        /**
        * Indicates whether any light probes are used.
        */
        public pUsesProbes(): boolean;
        /**
        * The index for the UV vertex attribute stream.
        */
        public uvBufferIndex : number;
        /**
        * The index for the UV transformation matrix vertex constant.
        */
        public uvTransformIndex : number;
        /**
        * The index for the secondary UV vertex attribute stream.
        */
        public secondaryUVBufferIndex : number;
        /**
        * The index for the vertex normal attribute stream.
        */
        public normalBufferIndex : number;
        /**
        * The index for the vertex tangent attribute stream.
        */
        public tangentBufferIndex : number;
        /**
        * The first index for the fragment constants containing the light data.
        */
        public lightFragmentConstantIndex : number;
        /**
        * The index of the vertex constant containing the camera position.
        */
        public cameraPositionIndex : number;
        /**
        * The index of the vertex constant containing the scene matrix.
        */
        public sceneMatrixIndex : number;
        /**
        * The index of the vertex constant containing the uniform scene matrix (the inverse transpose).
        */
        public sceneNormalMatrixIndex : number;
        /**
        * The index of the fragment constant containing the weights for the light probes.
        */
        public probeWeightsIndex : number;
        /**
        * The generated vertex code.
        */
        public vertexCode : string;
        /**
        * The generated fragment code.
        */
        public fragmentCode : string;
        /**
        * The code containing the lighting calculations.
        */
        public fragmentLightCode : string;
        /**
        * The code containing the post-lighting calculations.
        */
        public fragmentPostLightCode : string;
        /**
        * The register name containing the final shaded colour.
        */
        public shadedTarget : string;
        /**
        * The amount of point lights that need to be supported.
        */
        public numPointLights : number;
        /**
        * The amount of directional lights that need to be supported.
        */
        public numDirectionalLights : number;
        /**
        * The amount of light probes that need to be supported.
        */
        public numLightProbes : number;
        /**
        * Indicates whether the specular method is used.
        */
        public usingSpecularMethod : boolean;
        /**
        * The attributes that need to be animated by animators.
        */
        public animatableAttributes : string[];
        /**
        * The target registers for animated properties, written to by the animators.
        */
        public animationTargetRegisters : string[];
        /**
        * Indicates whether the compiled shader uses normals.
        */
        public usesNormals : boolean;
        /**
        * Indicates whether the compiled shader uses lights.
        */
        public pUsesLights(): boolean;
        /**
        * Compiles the code for the methods.
        */
        public pCompileMethods(): void;
        /**
        * Indices for the light probe diffuse textures.
        */
        public lightProbeDiffuseIndices : number[];
        /**
        * Indices for the light probe specular textures.
        */
        public lightProbeSpecularIndices : number[];
    }
}
declare module away.materials {
    /**
    * SuperShaderCompiler is a compiler that generates shaders that perform both lighting and "effects" through methods.
    * This is used by the single-pass materials.
    */
    class SuperShaderCompiler extends ShaderCompiler {
        public _pointLightRegisters: ShaderRegisterElement[];
        public _dirLightRegisters: ShaderRegisterElement[];
        /**
        * Creates a new SuperShaderCompiler object.
        * @param profile The compatibility profile used by the renderer.
        */
        constructor(profile: string);
        /**
        * @inheritDoc
        */
        public pInitLightData(): void;
        /**
        * @inheritDoc
        */
        public pCalculateDependencies(): void;
        /**
        * @inheritDoc
        */
        public pCompileNormalCode(): void;
        /**
        * @inheritDoc
        */
        public pCreateNormalRegisters(): void;
        /**
        * Compiles the vertex shader code for tangent-space normal maps.
        * @param matrix The register containing the scene transformation matrix for normals.
        */
        private compileTangentVertexCode(matrix);
        /**
        * Compiles the fragment shader code for tangent-space normal maps.
        */
        private compileTangentNormalMapFragmentCode();
        /**
        * @inheritDoc
        */
        public pCompileViewDirCode(): void;
        /**
        * @inheritDoc
        */
        public pCompileLightingCode(): void;
        /**
        * Initializes the registers containing the lighting data.
        */
        private initLightRegisters();
        private compileDirectionalLightCode();
        private compilePointLightCode();
        private compileLightProbeCode();
    }
}
declare module away.materials {
    /**
    * Enumeration class for defining which lighting types affect the specific material
    * lighting component (diffuse and specular). This can be useful if, for example, you
    * want to use light probes for diffuse global lighting, but want specular reflections from
    * traditional light sources without those affecting the diffuse light.
    *
    * @see away3d.materials.ColorMaterial.diffuseLightSources
    * @see away3d.materials.ColorMaterial.specularLightSources
    * @see away3d.materials.TextureMaterial.diffuseLightSources
    * @see away3d.materials.TextureMaterial.specularLightSources
    */
    class LightSources {
        /**
        * Defines normal lights are to be used as the source for the lighting
        * component.
        */
        static LIGHTS: number;
        /**
        * Defines that global lighting probes are to be used as the source for the
        * lighting component.
        */
        static PROBES: number;
        /**
        * Defines that both normal and global lighting probes  are to be used as the
        * source for the lighting component. This is equivalent to LightSources.LIGHTS | LightSources.PROBES.
        */
        static ALL: number;
    }
}
declare module away.materials {
    /**
    * MaterialBase forms an abstract base class for any material.
    * A material consists of several passes, each of which constitutes at least one render call. Several passes could
    * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
    * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
    * subsurface scattering, or rendering a depth map for specialized self-shadowing).
    *
    * Away3D provides default materials trough SinglePassMaterialBase and MultiPassMaterialBase, which use modular
    * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
    * shaders, or entire new material frameworks.
    */
    class MaterialBase extends library.NamedAssetBase implements library.IAsset, IMaterial {
        /**
        * An object to contain any extra data.
        */
        public extra: Object;
        /**
        * A value that can be used by materials that only work with a given type of renderer. The renderer can test the
        * classification to choose which render path to use. For example, a deferred material could set this value so
        * that the deferred renderer knows not to take the forward rendering path.
        *
        * @private
        */
        public _iClassification: string;
        /**
        * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
        *
        * @private
        */
        public _iMaterialId: number;
        /**
        * An id for this material used to sort the renderables by shader program, which reduces Program state changes.
        *
        * @private
        */
        public _iRenderOrderId: number;
        /**
        * The same as _renderOrderId, but applied to the depth shader passes.
        *
        * @private
        */
        public _iDepthPassId: number;
        private _bothSides;
        private _animationSet;
        /**
        * A list of material owners, renderables or custom Entities.
        */
        private _owners;
        private _alphaPremultiplied;
        public _pBlendMode: string;
        private _numPasses;
        private _passes;
        public _pMipmap: boolean;
        private _smooth;
        private _repeat;
        public _pDepthPass: DepthMapPass;
        public _pDistancePass: DistanceMapPass;
        public _pLightPicker: LightPickerBase;
        private _distanceBasedDepthRender;
        public _pDepthCompareMode: string;
        public _pHeight: number;
        public _pWidth: number;
        private _onPassChangeDelegate;
        private _onDepthPassChangeDelegate;
        private _onDistancePassChangeDelegate;
        /**
        * Creates a new MaterialBase object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        *
        */
        public height : number;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see LightPickerBase
        * @see StaticLightPicker
        */
        public lightPicker : LightPickerBase;
        public setLightPicker(value: LightPickerBase): void;
        /**
        * Indicates whether or not any used textures should use mipmapping. Defaults to true.
        */
        public mipmap : boolean;
        public setMipMap(value: boolean): void;
        /**
        * Indicates whether or not any used textures should use smoothing.
        */
        public smooth : boolean;
        /**
        * The depth compare mode used to render the renderables using this material.
        *
        * @see away.stagegl.ContextGLCompareMode
        */
        public depthCompareMode : string;
        public setDepthCompareMode(value: string): void;
        /**
        * Indicates whether or not any used textures should be tiled. If set to false, texture samples are clamped to
        * the texture's borders when the uv coordinates are outside the [0, 1] interval.
        */
        public repeat : boolean;
        /**
        * Cleans up resources owned by the material, including passes. Textures are not owned by the material since they
        * could be used by other materials and will not be disposed.
        */
        public dispose(): void;
        /**
        * Defines whether or not the material should cull triangles facing away from the camera.
        */
        public bothSides : boolean;
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
        public blendMode : string;
        public getBlendMode(): string;
        public setBlendMode(value: string): void;
        /**
        * Indicates whether visible textures (or other pixels) used by this material have
        * already been premultiplied. Toggle this if you are seeing black halos around your
        * blended alpha edges.
        */
        public alphaPremultiplied : boolean;
        /**
        * Indicates whether or not the material requires alpha blending during rendering.
        */
        public requiresBlending : boolean;
        /**
        *
        */
        public width : number;
        public getRequiresBlending(): boolean;
        /**
        * The amount of passes used by the material.
        *
        * @private
        */
        public _iNumPasses : number;
        /**
        * Indicates that the depth pass uses transparency testing to discard pixels.
        *
        * @private
        */
        public iHasDepthAlphaThreshold(): boolean;
        /**
        * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
        * depth or distances (fe: shadow maps, depth pre-pass).
        *
        * @param stageGL The StageGL used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
        * is required for shadow cube maps.
        *
        * @internal
        */
        public iActivateForDepth(stageGL: base.StageGL, camera: entities.Camera, distanceBased?: boolean): void;
        /**
        * Clears the render state for the depth pass.
        *
        * @param stageGL The StageGL used for rendering.
        *
        * @internal
        */
        public iDeactivateForDepth(stageGL: base.StageGL): void;
        /**
        * Renders a renderable using the depth pass.
        *
        * @param renderable The RenderableBase instance that needs to be rendered.
        * @param stageGL The StageGL used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
        * camera.viewProjection as it includes the scaling factors when rendering to textures.
        *
        * @internal
        */
        public iRenderDepth(renderable: pool.RenderableBase, stageGL: base.StageGL, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * Indicates whether or not the pass with the given index renders to texture or not.
        * @param index The index of the pass.
        * @return True if the pass renders to texture, false otherwise.
        *
        * @internal
        */
        public iPassRendersToTexture(index: number): boolean;
        /**
        * Sets the render state for a pass that is independent of the rendered object. This needs to be called before
        * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
        * @param index The index of the pass to activate.
        * @param stageGL The StageGL object which is currently used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @private
        */
        public iActivatePass(index: number, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * Clears the render state for a pass. This needs to be called before activating another pass.
        * @param index The index of the pass to deactivate.
        * @param stageGL The StageGL used for rendering
        *
        * @internal
        */
        public iDeactivatePass(index: number, stageGL: base.StageGL): void;
        /**
        * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
        * @param index The index of the pass used to render the renderable.
        * @param renderable The RenderableBase object to draw.
        * @param stageGL The StageGL object used for rendering.
        * @param entityCollector The EntityCollector object that contains the visible scene data.
        * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
        * camera.viewProjection as it includes the scaling factors when rendering to textures.
        *
        * @internal
        */
        public iRenderPass(index: number, renderable: pool.RenderableBase, stageGL: base.StageGL, entityCollector: traverse.ICollector, viewProjection: geom.Matrix3D): void;
        /**
        * Mark an IMaterialOwner as owner of this material.
        * Assures we're not using the same material across renderables with different animations, since the
        * Programs depend on animation. This method needs to be called when a material is assigned.
        *
        * @param owner The IMaterialOwner that had this material assigned
        *
        * @internal
        */
        public iAddOwner(owner: base.IMaterialOwner): void;
        /**
        * Removes an IMaterialOwner as owner.
        * @param owner
        *
        * @internal
        */
        public iRemoveOwner(owner: base.IMaterialOwner): void;
        /**
        * A list of the IMaterialOwners that use this material
        *
        * @private
        */
        public iOwners : base.IMaterialOwner[];
        /**
        * Performs any processing that needs to occur before any of its passes are used.
        *
        * @private
        */
        public iUpdateMaterial(context: stagegl.IContext): void;
        /**
        * Deactivates the last pass of the material.
        *
        * @private
        */
        public iDeactivate(stageGL: base.StageGL): void;
        /**
        * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
        * @param triggerPass The pass triggering the invalidation, if any. This is passed to prevent invalidating the
        * triggering pass, which would result in an infinite loop.
        *
        * @private
        */
        public iInvalidatePasses(triggerPass: MaterialPassBase): void;
        /**
        * Removes a pass from the material.
        * @param pass The pass to be removed.
        */
        public pRemovePass(pass: MaterialPassBase): void;
        /**
        * Removes all passes from the material
        */
        public pClearPasses(): void;
        /**
        * Adds a pass to the material
        * @param pass
        */
        public pAddPass(pass: MaterialPassBase): void;
        /**
        * Listener for when a pass's shader code changes. It recalculates the render order id.
        */
        private onPassChange(event);
        /**
        * Listener for when the distance pass's shader code changes. It recalculates the depth pass id.
        */
        private onDistancePassChange(event);
        /**
        * Listener for when the depth pass's shader code changes. It recalculates the depth pass id.
        */
        private onDepthPassChange(event);
    }
}
declare module away.materials {
    /**
    * SinglePassMaterialBase forms an abstract base class for the default single-pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
    class SinglePassMaterialBase extends MaterialBase {
        public _pScreenPass: SuperShaderPass;
        private _alphaBlending;
        /**
        * Creates a new SinglePassMaterialBase object.
        */
        constructor();
        /**
        * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
        * compatibility for constrained mode.
        */
        public enableLightFallOff : boolean;
        /**
        * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
        * invisible or entirely opaque, often used with textures for foliage, etc.
        * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
        */
        public alphaThreshold : number;
        /**
        * @inheritDoc
        */
        public blendMode : string;
        /**
        * @inheritDoc
        */
        public depthCompareMode : string;
        /**
        * @inheritDoc
        */
        public iActivateForDepth(stageGL: base.StageGL, camera: entities.Camera, distanceBased?: boolean): void;
        /**
        * Define which light source types to use for specular reflections. This allows choosing between regular lights
        * and/or light probes for specular reflections.
        *
        * @see away3d.materials.LightSources
        */
        public specularLightSources : number;
        /**
        * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
        * and/or light probes for diffuse reflections.
        *
        * @see away3d.materials.LightSources
        */
        public diffuseLightSources : number;
        /**
        * @inheritDoc
        */
        public requiresBlending : boolean;
        public getRequiresBlending(): boolean;
        /**
        * The ColorTransform object to transform the colour of the material with. Defaults to null.
        */
        public colorTransform : geom.ColorTransform;
        public setColorTransform(value: geom.ColorTransform): void;
        /**
        * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
        */
        public ambientMethod : AmbientBasicMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
        */
        public diffuseMethod : DiffuseBasicMethod;
        /**
        * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
        */
        public normalMethod : NormalBasicMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
        */
        public specularMethod : SpecularBasicMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addMethod(method: EffectMethodBase): void;
        /**
        * The number of "effect" methods added to the material.
        */
        public numMethods : number;
        /**
        * Queries whether a given effect method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasMethod(method: EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addMethodAt(method: EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeMethod(method: EffectMethodBase): void;
        /**
        * @inheritDoc
        */
        public mipmap : boolean;
        /**
        * The normal map to modulate the direction of the surface for each texel. The default normal method expects
        * tangent-space normal maps, but others could expect object-space maps.
        */
        public normalMap : textures.Texture2DBase;
        /**
        * A specular map that defines the strength of specular reflections for each texel in the red channel,
        * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
        * specular and gloss maps from grayscale images, but correctly authored images are preferred.
        */
        public specularMap : textures.Texture2DBase;
        /**
        * The glossiness of the material (sharpness of the specular highlight).
        */
        public gloss : number;
        /**
        * The strength of the ambient reflection.
        */
        public ambient : number;
        /**
        * The overall strength of the specular reflection.
        */
        public specular : number;
        /**
        * The colour of the ambient reflection.
        */
        public ambientColor : number;
        /**
        * The colour of the specular reflection.
        */
        public specularColor : number;
        /**
        * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
        * example when using textures of foliage, consider using alphaThreshold instead.
        */
        public alphaBlending : boolean;
        /**
        * @inheritDoc
        */
        public iUpdateMaterial(context: stagegl.IContext): void;
        /**
        * @inheritDoc
        */
        public lightPicker : LightPickerBase;
    }
}
declare module away.materials {
    /**
    * MultiPassMaterialBase forms an abstract base class for the default multi-pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
    class MultiPassMaterialBase extends MaterialBase {
        private _casterLightPass;
        private _nonCasterLightPasses;
        public _pEffectsPass: SuperShaderPass;
        private _alphaThreshold;
        private _specularLightSources;
        private _diffuseLightSources;
        private _ambientMethod;
        private _shadowMethod;
        private _diffuseMethod;
        private _normalMethod;
        private _specularMethod;
        private _screenPassesInvalid;
        private _enableLightFallOff;
        private _onLightChangeDelegate;
        /**
        * Creates a new MultiPassMaterialBase object.
        */
        constructor();
        /**
        * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
        * compatibility for constrained mode.
        */
        public enableLightFallOff : boolean;
        /**
        * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
        * invisible or entirely opaque, often used with textures for foliage, etc.
        * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
        */
        public alphaThreshold : number;
        /**
        * @inheritDoc
        */
        public depthCompareMode : string;
        /**
        * @inheritDoc
        */
        public blendMode : string;
        /**
        * @inheritDoc
        */
        public iActivateForDepth(stageGL: base.StageGL, camera: entities.Camera, distanceBased?: boolean): void;
        /**
        * Define which light source types to use for specular reflections. This allows choosing between regular lights
        * and/or light probes for specular reflections.
        *
        * @see away3d.materials.LightSources
        */
        public specularLightSources : number;
        /**
        * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
        * and/or light probes for diffuse reflections.
        *
        * @see away3d.materials.LightSources
        */
        public diffuseLightSources : number;
        /**
        * @inheritDoc
        */
        public lightPicker : LightPickerBase;
        /**
        * @inheritDoc
        */
        public requiresBlending : boolean;
        /**
        * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
        */
        public ambientMethod : AmbientBasicMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
        */
        public diffuseMethod : DiffuseBasicMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
        */
        public specularMethod : SpecularBasicMethod;
        /**
        * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
        */
        public normalMethod : NormalBasicMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addMethod(method: EffectMethodBase): void;
        /**
        * The number of "effect" methods added to the material.
        */
        public numMethods : number;
        /**
        * Queries whether a given effect method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasMethod(method: EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addMethodAt(method: EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeMethod(method: EffectMethodBase): void;
        /**
        * @inheritDoc
        */
        public mipmap : boolean;
        /**
        * The normal map to modulate the direction of the surface for each texel. The default normal method expects
        * tangent-space normal maps, but others could expect object-space maps.
        */
        public normalMap : textures.Texture2DBase;
        /**
        * A specular map that defines the strength of specular reflections for each texel in the red channel,
        * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
        * specular and gloss maps from grayscale images, but correctly authored images are preferred.
        */
        public specularMap : textures.Texture2DBase;
        /**
        * The glossiness of the material (sharpness of the specular highlight).
        */
        public gloss : number;
        /**
        * The strength of the ambient reflection.
        */
        public ambient : number;
        /**
        * The overall strength of the specular reflection.
        */
        public specular : number;
        /**
        * The colour of the ambient reflection.
        */
        public ambientColor : number;
        /**
        * The colour of the specular reflection.
        */
        public specularColor : number;
        /**
        * @inheritDoc
        */
        public iUpdateMaterial(context: stagegl.IContext): void;
        /**
        * Adds a compiled pass that renders to the screen.
        * @param pass The pass to be added.
        */
        private addScreenPass(pass);
        /**
        * Tests if any pass that renders to the screen is invalid. This would trigger a new setup of the multiple passes.
        * @return
        */
        private isAnyScreenPassInvalid();
        /**
        * Adds any additional passes on which the given pass is dependent.
        * @param pass The pass that my need additional passes.
        */
        private addChildPassesFor(pass);
        /**
        * @inheritDoc
        */
        public iActivatePass(index: number, stageGL: base.StageGL, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stageGL: base.StageGL): void;
        /**
        * Updates screen passes when they were found to be invalid.
        */
        public pUpdateScreenPasses(): void;
        /**
        * Initializes all the passes and their dependent passes.
        */
        private initPasses();
        /**
        * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
        */
        private setBlendAndCompareModes();
        private initCasterLightPass();
        private removeCasterLightPass();
        private initNonCasterLightPasses();
        private removeNonCasterLightPasses();
        private removeEffectsPass();
        private initEffectsPass();
        /**
        * The maximum total number of lights provided by the light picker.
        */
        private numLights;
        /**
        * The amount of lights that don't cast shadows.
        */
        private numNonCasters;
        /**
        * Flags that the screen passes have become invalid.
        */
        public pInvalidateScreenPasses(): void;
        /**
        * Called when the light picker's configuration changed.
        */
        private onLightsChange(event);
    }
}
declare module away.materials {
    /**
    * TextureMultiPassMaterial is a multi-pass material that uses a texture to define the surface's diffuse reflection colour (albedo).
    */
    class TextureMultiPassMaterial extends MultiPassMaterialBase {
        private _animateUVs;
        /**
        * Creates a new TextureMultiPassMaterial.
        * @param texture The texture used for the material's albedo color.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
        */
        constructor(texture?: textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        /**
        * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
        */
        public animateUVs : boolean;
        /**
        * The texture object to use for the albedo colour.
        */
        public texture : textures.Texture2DBase;
        /**
        * The texture object to use for the ambient colour.
        */
        public ambientTexture : textures.Texture2DBase;
        public pUpdateScreenPasses(): void;
    }
}
declare module away.materials {
    /**
    * ColorMultiPassMaterial is a multi-pass material that uses a flat color as the surface's diffuse reflection value.
    */
    class ColorMultiPassMaterial extends MultiPassMaterialBase {
        /**
        * Creates a new ColorMultiPassMaterial object.
        *
        * @param color The material's diffuse surface color.
        */
        constructor(color?: number);
        /**
        * The diffuse reflectivity color of the surface.
        */
        public color : number;
    }
}
declare module away.materials {
    /**
    * TextureMaterial is a single-pass material that uses a texture to define the surface's diffuse reflection colour (albedo).
    */
    class TextureMaterial extends SinglePassMaterialBase {
        /**
        * Creates a new TextureMaterial.
        * @param texture The texture used for the material's albedo color.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
        */
        constructor(texture?: textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        /**
        * Specifies whether or not the UV coordinates should be animated using IRenderable's uvTransform matrix.
        *
        * @see IRenderable.uvTransform
        */
        public animateUVs : boolean;
        /**
        * The alpha of the surface.
        */
        public alpha : number;
        /**
        * The texture object to use for the albedo colour.
        */
        public texture : textures.Texture2DBase;
        /**
        * The texture object to use for the ambient colour.
        */
        public ambientTexture : textures.Texture2DBase;
    }
}
declare module away.materials {
    /**
    * ColorMaterial is a single-pass material that uses a flat color as the surface's diffuse reflection value.
    */
    class ColorMaterial extends SinglePassMaterialBase {
        private _diffuseAlpha;
        /**
        * Creates a new ColorMaterial object.
        * @param color The material's diffuse surface color.
        * @param alpha The material's surface alpha.
        */
        constructor(color?: number, alpha?: number);
        /**
        * The alpha of the surface.
        */
        public alpha : number;
        /**
        * The diffuse reflectivity color of the surface.
        */
        public color : number;
        /**
        * @inheritDoc
        */
        public requiresBlending : boolean;
    }
}
declare module away.materials {
    /**
    * LightingShaderCompiler is a ShaderCompiler that generates code for passes performing shading only (no effect passes)
    */
    class LightingShaderCompiler extends ShaderCompiler {
        public _pointLightFragmentConstants: ShaderRegisterElement[];
        public _pointLightVertexConstants: ShaderRegisterElement[];
        public _dirLightFragmentConstants: ShaderRegisterElement[];
        public _dirLightVertexConstants: ShaderRegisterElement[];
        private _lightVertexConstantIndex;
        private _shadowRegister;
        /**
        * Create a new LightingShaderCompiler object.
        * @param profile The compatibility profile of the renderer.
        */
        constructor(profile: string);
        /**
        * The starting index if the vertex constant to which light data needs to be uploaded.
        */
        public lightVertexConstantIndex : number;
        /**
        * @inheritDoc
        */
        public pInitRegisterIndices(): void;
        /**
        * @inheritDoc
        */
        public pCreateNormalRegisters(): void;
        /**
        * Indicates whether or not lighting happens in tangent space. This is only the case if no world-space
        * dependencies exist.
        */
        public tangentSpace : boolean;
        /**
        * @inheritDoc
        */
        public pInitLightData(): void;
        /**
        * @inheritDoc
        */
        public pCalculateDependencies(): void;
        /**
        * @inheritDoc
        */
        public pCompileNormalCode(): void;
        /**
        * Generates code to retrieve the tangent space normal from the normal map
        */
        private compileTangentSpaceNormalMapCode();
        /**
        * @inheritDoc
        */
        public pCompileViewDirCode(): void;
        /**
        * @inheritDoc
        */
        public pCompileLightingCode(): void;
        /**
        * Provides the code to provide shadow mapping.
        */
        private compileShadowCode();
        /**
        * Initializes constant registers to contain light data.
        */
        private initLightRegisters();
        /**
        * Compiles the shading code for directional lights.
        */
        private compileDirectionalLightCode();
        /**
        * Compiles the shading code for point lights.
        */
        private compilePointLightCode();
        /**
        * Compiles shading code for light probes.
        */
        private compileLightProbeCode();
    }
}
declare module away.materials {
    /**
    * SegmentMaterial is a material exclusively used to render wireframe objects
    *
    * @see away3d.entities.Lines
    */
    class SegmentMaterial extends MaterialBase {
        private _screenPass;
        /**
        * Creates a new SegmentMaterial object.
        *
        * @param thickness The thickness of the wireframe lines.
        */
        constructor(thickness?: number);
    }
}
declare module away.materials {
    /**
    * SkyboxMaterial is a material exclusively used to render skyboxes
    *
    * @see away3d.primitives.Skybox
    */
    class SkyboxMaterial extends MaterialBase {
        private _cubeMap;
        private _skyboxPass;
        /**
        * Creates a new SkyboxMaterial object.
        * @param cubeMap The CubeMap to use as the skybox.
        */
        constructor(cubeMap: textures.CubeTextureBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        /**
        * The cube texture to use as the skybox.
        */
        public cubeMap : textures.CubeTextureBase;
    }
}
declare module away.utils {
    class PerspectiveMatrix3D extends geom.Matrix3D {
        constructor(v?: number[]);
        public perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class AnimationRegisterCache extends materials.ShaderRegisterCache {
        public positionAttribute: materials.ShaderRegisterElement;
        public uvAttribute: materials.ShaderRegisterElement;
        public positionTarget: materials.ShaderRegisterElement;
        public scaleAndRotateTarget: materials.ShaderRegisterElement;
        public velocityTarget: materials.ShaderRegisterElement;
        public vertexTime: materials.ShaderRegisterElement;
        public vertexLife: materials.ShaderRegisterElement;
        public vertexZeroConst: materials.ShaderRegisterElement;
        public vertexOneConst: materials.ShaderRegisterElement;
        public vertexTwoConst: materials.ShaderRegisterElement;
        public uvTarget: materials.ShaderRegisterElement;
        public colorAddTarget: materials.ShaderRegisterElement;
        public colorMulTarget: materials.ShaderRegisterElement;
        public colorAddVary: materials.ShaderRegisterElement;
        public colorMulVary: materials.ShaderRegisterElement;
        public uvVar: materials.ShaderRegisterElement;
        public rotationRegisters: materials.ShaderRegisterElement[];
        public needFragmentAnimation: boolean;
        public needUVAnimation: boolean;
        public sourceRegisters: string[];
        public targetRegisters: string[];
        private indexDictionary;
        public hasUVNode: boolean;
        public needVelocity: boolean;
        public hasBillboard: boolean;
        public hasColorMulNode: boolean;
        public hasColorAddNode: boolean;
        constructor(profile: string);
        public reset(): void;
        public setUVSourceAndTarget(UVAttribute: string, UVVaring: string): void;
        public setRegisterIndex(node: AnimationNodeBase, parameterIndex: number, registerIndex: number): void;
        public getRegisterIndex(node: AnimationNodeBase, parameterIndex: number): number;
        public getInitCode(): string;
        public getCombinationCode(): string;
        public initColorRegisters(): string;
        public getColorPassCode(): string;
        public getColorCombinationCode(shadedTarget: string): string;
        private getRegisterFromString(code);
        public vertexConstantData: number[];
        public fragmentConstantData: number[];
        private _numVertexConstant;
        private _numFragmentConstant;
        public numVertexConstant : number;
        public numFragmentConstant : number;
        public setDataLength(): void;
        public setVertexConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
        public setVertexConstFromArray(index: number, data: number[]): void;
        public setVertexConstFromMatrix(index: number, matrix: geom.Matrix3D): void;
        public setFragmentConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class AnimationSubGeometry {
        static SUBGEOM_ID_COUNT: number;
        public _pVertexData: number[];
        public _pVertexBuffer: stagegl.IVertexBuffer[];
        public _pBufferContext: stagegl.IContext[];
        public _pBufferDirty: boolean[];
        private _numVertices;
        private _totalLenOfOneVertex;
        public numProcessedVertices: number;
        public previousTime: number;
        public animationParticles: ParticleAnimationData[];
        /**
        * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
        *
        * @private
        */
        public _iUniqueId: number;
        constructor();
        public createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
        public activateVertexBuffer(index: number, bufferOffset: number, stageGL: base.StageGL, format: string): void;
        public dispose(): void;
        public invalidateBuffer(): void;
        public vertexData : number[];
        public numVertices : number;
        public totalLenOfOneVertex : number;
    }
}
declare module away.animators {
    class ColorSegmentPoint {
        private _color;
        private _life;
        constructor(life: number, color: geom.ColorTransform);
        public color : geom.ColorTransform;
        public life : number;
    }
}
declare module away.animators {
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
        public name: string;
        /**
        * The rotation of the pose stored as a quaternion
        */
        public orientation: geom.Quaternion;
        /**
        * The translation of the pose
        */
        public translation: geom.Vector3D;
        constructor();
        /**
        * Converts the transformation to a Matrix3D representation.
        *
        * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
        * @return The transformation matrix of the pose.
        */
        public toMatrix3D(target?: geom.Matrix3D): geom.Matrix3D;
        /**
        * Copies the transformation data from a source pose object into the existing pose object.
        *
        * @param pose The source pose to copy from.
        */
        public copyFrom(pose: JointPose): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleAnimationData {
        public index: number;
        public startTime: number;
        public totalTime: number;
        public duration: number;
        public delay: number;
        public startVertexIndex: number;
        public numVertices: number;
        constructor(index: number, startTime: number, duration: number, delay: number, particle: ParticleData);
    }
}
declare module away.animators {
    class ParticleData {
        public particleIndex: number;
        public numVertices: number;
        public startVertexIndex: number;
        public subGeometry: base.TriangleSubGeometry;
    }
}
declare module away.animators {
    /**
    * Dynamic class for holding the local properties of a particle, used for processing the static properties
    * of particles in the particle animation set before beginning upload to the GPU.
    */
    class ParticleProperties {
        /**
        * The index of the current particle being set.
        */
        public index: number;
        /**
        * The total number of particles being processed by the particle animation set.
        */
        public total: number;
        /**
        * The start time of the particle.
        */
        public startTime: number;
        /**
        * The duration of the particle, an optional value used when the particle aniamtion set settings for <code>useDuration</code> are enabled in the constructor.
        *
        * @see away.animators.ParticleAnimationSet
        */
        public duration: number;
        /**
        * The delay between cycles of the particle, an optional value used when the particle aniamtion set settings for <code>useLooping</code> and  <code>useDelay</code> are enabled in the constructor.
        *
        * @see away.animators.ParticleAnimationSet
        */
        public delay: number;
    }
}
declare module away.animators {
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
}
declare module away.animators {
    /**
    * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
    *
    * @see away.animators.SkeletonJoint
    */
    class Skeleton extends library.NamedAssetBase implements library.IAsset {
        /**
        * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
        * property that is an index into this list.
        * A child joint should always have a higher index than its parent.
        */
        public joints: SkeletonJoint[];
        /**
        * The total number of joints in the skeleton.
        */
        public numJoints : number;
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
        public jointFromName(jointName: string): SkeletonJoint;
        /**
        * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
        *
        * @param jointName The name of the joint object to be found.
        * @return The index of the joint object in the joints Array
        *
        * @see #joints
        */
        public jointIndexFromName(jointName: string): number;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
    }
}
declare module away.animators {
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
}
declare module away.animators {
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
        public parentIndex: number;
        /**
        * The name of the joint
        */
        public name: string;
        /**
        * The inverse bind pose matrix, as raw data, used to transform vertices to bind joint space in preparation for transformation using the joint matrix.
        */
        public inverseBindPose: number[];
        /**
        * Creates a new <code>SkeletonJoint</code> object
        */
        constructor();
    }
}
declare module away.animators {
    /**
    * A collection of pose objects, determining the pose for an entire skeleton.
    * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
    * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
    * clips are added to any animator with a valid skeleton)
    *
    * @see away.animators.Skeleton
    * @see away.animators.JointPose
    */
    class SkeletonPose extends library.NamedAssetBase implements library.IAsset {
        /**
        * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
        *
        * @see away.animators.Skeleton#joints
        */
        public jointPoses: JointPose[];
        /**
        * The total number of joint poses in the skeleton pose.
        */
        public numJointPoses : number;
        /**
        * Creates a new <code>SkeletonPose</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * Returns the joint pose object with the given joint name, otherwise returns a null object.
        *
        * @param jointName The name of the joint object whose pose is to be found.
        * @return The pose object with the given joint name.
        */
        public jointPoseFromName(jointName: string): JointPose;
        /**
        * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
        *
        * @param The name of the joint object whose pose is to be found.
        * @return The index of the pose object in the jointPoses Array
        *
        * @see #jointPoses
        */
        public jointPoseIndexFromName(jointName: string): number;
        /**
        * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
        *
        * @return SkeletonPose
        */
        public clone(): SkeletonPose;
        /**
        * @inheritDoc
        */
        public dispose(): void;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
    */
    class AnimationClipNodeBase extends AnimationNodeBase {
        public _pLooping: boolean;
        public _pTotalDuration: number;
        public _pLastFrame: number;
        public _pStitchDirty: boolean;
        public _pStitchFinalFrame: boolean;
        public _pNumFrames: number;
        public _pDurations: number[];
        public _pTotalDelta: geom.Vector3D;
        public fixedFrameRate: boolean;
        /**
        * Determines whether the contents of the animation node have looping characteristics enabled.
        */
        public looping : boolean;
        /**
        * Defines if looping content blends the final frame of animation data with the first (true) or works on the
        * assumption that both first and last frames are identical (false). Defaults to false.
        */
        public stitchFinalFrame : boolean;
        public totalDuration : number;
        public totalDelta : geom.Vector3D;
        public lastFrame : number;
        /**
        * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
        */
        public durations : number[];
        /**
        * Creates a new <code>AnimationClipNodeBase</code> object.
        */
        constructor();
        /**
        * Updates the node's final frame stitch state.
        *
        * @see #stitchFinalFrame
        */
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for particle animation nodes.
    */
    class ParticleNodeBase extends AnimationNodeBase {
        private _priority;
        public _pMode: number;
        public _pDataLength: number;
        public _pOneData: number[];
        public _iDataOffset: number;
        private static GLOBAL;
        private static LOCAL_STATIC;
        private static LOCAL_DYNAMIC;
        private static MODES;
        /**
        * Returns the property mode of the particle animation node. Typically set in the node constructor
        *
        * @see away.animators.ParticlePropertiesMode
        */
        public mode : number;
        /**
        * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
        *
        * @see away.animators.ParticleAnimationSet
        * @see #getAGALVertexCode
        */
        public priority : number;
        /**
        * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
        *
        * @see away.animators.ParticleAnimationSet
        * @see #getAGALVertexCode
        */
        public dataLength : number;
        /**
        * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
        *
        * @see away.animators.ParticleAnimationSet
        * @see #generatePropertyOfOneParticle
        */
        public oneData : number[];
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
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * Returns the AGAL code of the particle animation node for use in the fragment shader.
        */
        public getAGALFragmentCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
        */
        public getAGALUVCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
        *
        * @see away.animators.ParticleAnimationSet#initParticleFunc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
        /**
        * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
    */
    class ParticleAccelerationNode extends ParticleNodeBase {
        /** @private */
        static ACCELERATION_INDEX: number;
        /** @private */
        public _acceleration: geom.Vector3D;
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
        constructor(mode: number, acceleration?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public pGetAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleAccelerationState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the position of a particle over time along a bezier curve.
    */
    class ParticleBezierCurveNode extends ParticleNodeBase {
        /** @private */
        static BEZIER_CONTROL_INDEX: number;
        /** @private */
        static BEZIER_END_INDEX: number;
        /** @private */
        public _iControlPoint: geom.Vector3D;
        /** @private */
        public _iEndPoint: geom.Vector3D;
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
        constructor(mode: number, controlPoint?: geom.Vector3D, endPoint?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleBezierCurveState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node that controls the rotation of a particle to always face the camera.
    */
    class ParticleBillboardNode extends ParticleNodeBase {
        /** @private */
        static MATRIX_INDEX: number;
        /** @private */
        public _iBillboardAxis: geom.Vector3D;
        /**
        * Creates a new <code>ParticleBillboardNode</code>
        */
        constructor(billboardAxis?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleBillboardState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the color variation of a particle over time.
    */
    class ParticleColorNode extends ParticleNodeBase {
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
        /** @private */
        public _iUsesMultiplier: boolean;
        /** @private */
        public _iUsesOffset: boolean;
        /** @private */
        public _iUsesCycle: boolean;
        /** @private */
        public _iUsesPhase: boolean;
        /** @private */
        public _iStartColor: geom.ColorTransform;
        /** @private */
        public _iEndColor: geom.ColorTransform;
        /** @private */
        public _iCycleDuration: number;
        /** @private */
        public _iCyclePhase: number;
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
        constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, usesCycle?: boolean, usesPhase?: boolean, startColor?: geom.ColorTransform, endColor?: geom.ColorTransform, cycleDuration?: number, cyclePhase?: number);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleColorState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to create a follow behaviour on a particle system.
    */
    class ParticleFollowNode extends ParticleNodeBase {
        /** @private */
        static FOLLOW_POSITION_INDEX: number;
        /** @private */
        static FOLLOW_ROTATION_INDEX: number;
        /** @private */
        public _iUsesPosition: boolean;
        /** @private */
        public _iUsesRotation: boolean;
        /** @private */
        public _iSmooth: boolean;
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
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleFollowState;
    }
}
declare module away.animators {
    class ParticleInitialColorNode extends ParticleNodeBase {
        /** @private */
        static MULTIPLIER_INDEX: number;
        /** @private */
        static OFFSET_INDEX: number;
        /** @private */
        public _iUsesMultiplier: boolean;
        /** @private */
        public _iUsesOffset: boolean;
        /** @private */
        public _iInitialColor: geom.ColorTransform;
        /**
        * Reference for color node properties on a single particle (when in local property mode).
        * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
        */
        static COLOR_INITIAL_COLORTRANSFORM: string;
        constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, initialColor?: geom.ColorTransform);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the position of a particle over time around a circular orbit.
    */
    class ParticleOrbitNode extends ParticleNodeBase {
        /** @private */
        static ORBIT_INDEX: number;
        /** @private */
        static EULERS_INDEX: number;
        /** @private */
        public _iUsesEulers: boolean;
        /** @private */
        public _iUsesCycle: boolean;
        /** @private */
        public _iUsesPhase: boolean;
        /** @private */
        public _iRadius: number;
        /** @private */
        public _iCycleDuration: number;
        /** @private */
        public _iCyclePhase: number;
        /** @private */
        public _iEulers: geom.Vector3D;
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
        constructor(mode: number, usesEulers?: boolean, usesCycle?: boolean, usesPhase?: boolean, radius?: number, cycleDuration?: number, cyclePhase?: number, eulers?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleOrbitState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the position of a particle over time using simple harmonic motion.
    */
    class ParticleOscillatorNode extends ParticleNodeBase {
        /** @private */
        static OSCILLATOR_INDEX: number;
        /** @private */
        public _iOscillator: geom.Vector3D;
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
        constructor(mode: number, oscillator?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleOscillatorState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to set the starting position of a particle.
    */
    class ParticlePositionNode extends ParticleNodeBase {
        /** @private */
        static POSITION_INDEX: number;
        /** @private */
        public _iPosition: geom.Vector3D;
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
        constructor(mode: number, position?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticlePositionState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the rotation of a particle to match its heading vector.
    */
    class ParticleRotateToHeadingNode extends ParticleNodeBase {
        /** @private */
        static MATRIX_INDEX: number;
        /**
        * Creates a new <code>ParticleBillboardNode</code>
        */
        constructor();
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleRotateToHeadingState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the rotation of a particle to face to a position
    */
    class ParticleRotateToPositionNode extends ParticleNodeBase {
        /** @private */
        static MATRIX_INDEX: number;
        /** @private */
        static POSITION_INDEX: number;
        /** @private */
        public _iPosition: geom.Vector3D;
        /**
        * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
        * Expects a <code>Vector3D</code> object representing the position that the particle must face.
        */
        static POSITION_VECTOR3D: string;
        /**
        * Creates a new <code>ParticleRotateToPositionNode</code>
        */
        constructor(mode: number, position?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleRotateToPositionState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to set the starting rotational velocity of a particle.
    */
    class ParticleRotationalVelocityNode extends ParticleNodeBase {
        /** @private */
        static ROTATIONALVELOCITY_INDEX: number;
        /** @private */
        public _iRotationalVelocity: geom.Vector3D;
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
        constructor(mode: number, rotationalVelocity?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleRotationalVelocityState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the scale variation of a particle over time.
    */
    class ParticleScaleNode extends ParticleNodeBase {
        /** @private */
        static SCALE_INDEX: number;
        /** @private */
        public _iUsesCycle: boolean;
        /** @private */
        public _iUsesPhase: boolean;
        /** @private */
        public _iMinScale: number;
        /** @private */
        public _iMaxScale: number;
        /** @private */
        public _iCycleDuration: number;
        /** @private */
        public _iCyclePhase: number;
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
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleScaleState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleSegmentedColorNode extends ParticleNodeBase {
        /** @private */
        static START_MULTIPLIER_INDEX: number;
        /** @private */
        static START_OFFSET_INDEX: number;
        /** @private */
        static TIME_DATA_INDEX: number;
        /** @private */
        public _iUsesMultiplier: boolean;
        /** @private */
        public _iUsesOffset: boolean;
        /** @private */
        public _iStartColor: geom.ColorTransform;
        /** @private */
        public _iEndColor: geom.ColorTransform;
        /** @private */
        public _iNumSegmentPoint: number;
        /** @private */
        public _iSegmentPoints: ColorSegmentPoint[];
        constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: geom.ColorTransform, endColor: geom.ColorTransform, segmentPoints: ColorSegmentPoint[]);
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
    }
}
declare module away.animators {
    /**
    * A particle animation node used when a spritesheet texture is required to animate the particle.
    * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
    */
    class ParticleSpriteSheetNode extends ParticleNodeBase {
        /** @private */
        static UV_INDEX_0: number;
        /** @private */
        static UV_INDEX_1: number;
        /** @private */
        public _iUsesCycle: boolean;
        /** @private */
        public _iUsesPhase: boolean;
        /** @private */
        public _iTotalFrames: number;
        /** @private */
        public _iNumColumns: number;
        /** @private */
        public _iNumRows: number;
        /** @private */
        public _iCycleDuration: number;
        /** @private */
        public _iCyclePhase: number;
        /**
        * Reference for spritesheet node properties on a single particle (when in local property mode).
        * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
        */
        static UV_VECTOR3D: string;
        /**
        * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
        */
        public numColumns : number;
        /**
        * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
        */
        public numRows : number;
        /**
        * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
        */
        public totalFrames : number;
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
        public getAGALUVCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleSpriteSheetState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
    */
    class ParticleTimeNode extends ParticleNodeBase {
        /** @private */
        static TIME_STREAM_INDEX: number;
        /** @private */
        static TIME_CONSTANT_INDEX: number;
        /** @private */
        public _iUsesDuration: boolean;
        /** @private */
        public _iUsesDelay: boolean;
        /** @private */
        public _iUsesLooping: boolean;
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
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleTimeState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the UV offset and scale of a particle over time.
    */
    class ParticleUVNode extends ParticleNodeBase {
        /** @private */
        static UV_INDEX: number;
        /** @private */
        public _iUvData: geom.Vector3D;
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
        public cycle : number;
        /**
        *
        */
        public scale : number;
        /**
        *
        */
        public axis : string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleUVState;
        private updateUVData();
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to set the starting velocity of a particle.
    */
    class ParticleVelocityNode extends ParticleNodeBase {
        /** @private */
        static VELOCITY_INDEX: number;
        /** @private */
        public _iVelocity: geom.Vector3D;
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
        constructor(mode: number, velocity?: geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, animationRegisterCache: AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): ParticleVelocityState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
    */
    class SkeletonBinaryLERPNode extends AnimationNodeBase {
        /**
        * Defines input node A to use for the blended output.
        */
        public inputA: AnimationNodeBase;
        /**
        * Defines input node B to use for the blended output.
        */
        public inputB: AnimationNodeBase;
        /**
        * Creates a new <code>SkeletonBinaryLERPNode</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): SkeletonBinaryLERPState;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node containing time-based animation data as individual skeleton poses.
    */
    class SkeletonClipNode extends AnimationClipNodeBase {
        private _frames;
        /**
        * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
        * of the output skeleton pose. Defaults to false.
        */
        public highQuality: boolean;
        /**
        * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
        */
        public frames : SkeletonPose[];
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
        public addFrame(skeletonPose: SkeletonPose, duration: number): void;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): SkeletonClipState;
        /**
        * @inheritDoc
        */
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
    */
    class SkeletonDifferenceNode extends AnimationNodeBase {
        /**
        * Defines a base input node to use for the blended output.
        */
        public baseInput: AnimationNodeBase;
        /**
        * Defines a difference input node to use for the blended output.
        */
        public differenceInput: AnimationNodeBase;
        /**
        * Creates a new <code>SkeletonAdditiveNode</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): SkeletonDifferenceState;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
    */
    class SkeletonDirectionalNode extends AnimationNodeBase {
        /**
        * Defines the forward configured input node to use for the blended output.
        */
        public forward: AnimationNodeBase;
        /**
        * Defines the backwards configured input node to use for the blended output.
        */
        public backward: AnimationNodeBase;
        /**
        * Defines the left configured input node to use for the blended output.
        */
        public left: AnimationNodeBase;
        /**
        * Defines the right configured input node to use for the blended output.
        */
        public right: AnimationNodeBase;
        constructor();
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): SkeletonDirectionalState;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
    */
    class SkeletonNaryLERPNode extends AnimationNodeBase {
        public _iInputs: AnimationNodeBase[];
        private _numInputs;
        public numInputs : number;
        /**
        * Creates a new <code>SkeletonNaryLERPNode</code> object.
        */
        constructor();
        /**
        * Returns an integer representing the input index of the given skeleton animation node.
        *
        * @param input The skeleton animation node for with the input index is requested.
        */
        public getInputIndex(input: AnimationNodeBase): number;
        /**
        * Returns the skeleton animation node object that resides at the given input index.
        *
        * @param index The input index for which the skeleton animation node is requested.
        */
        public getInputAt(index: number): AnimationNodeBase;
        /**
        * Adds a new skeleton animation node input to the animation node.
        */
        public addInput(input: AnimationNodeBase): void;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: AnimatorBase): SkeletonNaryLERPState;
    }
}
declare module away.animators {
    /**
    * A vertex animation node containing time-based animation data as individual geometry obejcts.
    */
    class VertexClipNode extends AnimationClipNodeBase {
        private _frames;
        private _translations;
        /**
        * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
        */
        public frames : base.Geometry[];
        /**
        * Creates a new <code>VertexClipNode</code> object.
        */
        constructor();
        /**
        * Adds a geometry object to the internal timeline of the animation node.
        *
        * @param geometry The geometry object to add to the timeline of the node.
        * @param duration The specified duration of the frame in milliseconds.
        * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
        */
        public addFrame(geometry: base.Geometry, duration: number, translation?: geom.Vector3D): void;
        /**
        * @inheritDoc
        */
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    interface IAnimationState {
        positionDelta: geom.Vector3D;
        offset(startTime: number): any;
        update(time: number): any;
        /**
        * Sets the animation phase of the node.
        *
        * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
        */
        phase(value: number): any;
    }
}
declare module away.animators {
    interface ISkeletonAnimationState extends IAnimationState {
        /**
        * Returns the output skeleton pose of the animation node.
        */
        getSkeletonPose(skeleton: Skeleton): SkeletonPose;
    }
}
declare module away.animators {
    /**
    * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
    *
    * @see away.animators.VertexAnimator
    */
    interface IVertexAnimationState extends IAnimationState {
        /**
        * Returns the current geometry frame of animation in the clip based on the internal playhead position.
        */
        currentGeometry: base.Geometry;
        /**
        * Returns the current geometry frame of animation in the clip based on the internal playhead position.
        */
        nextGeometry: base.Geometry;
        /**
        * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
        * between the current geometry frame (0) and next geometry frame (1) of the animation.
        */
        blendWeight: number;
    }
}
declare module away.animators {
    /**
    *
    */
    class AnimationStateBase implements IAnimationState {
        public _pAnimationNode: AnimationNodeBase;
        public _pRootDelta: geom.Vector3D;
        public _pPositionDeltaDirty: boolean;
        public _pTime: number;
        public _pStartTime: number;
        public _pAnimator: AnimatorBase;
        /**
        * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
        */
        public positionDelta : geom.Vector3D;
        constructor(animator: AnimatorBase, animationNode: AnimationNodeBase);
        /**
        * Resets the start time of the node to a  new value.
        *
        * @param startTime The absolute start time (in milliseconds) of the node's starting time.
        */
        public offset(startTime: number): void;
        /**
        * Updates the configuration of the node to its current state.
        *
        * @param time The absolute time (in milliseconds) of the animator's play head position.
        *
        * @see away.animators.AnimatorBase#update()
        */
        public update(time: number): void;
        /**
        * Sets the animation phase of the node.
        *
        * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
        */
        public phase(value: number): void;
        /**
        * Updates the node's internal playhead position.
        *
        * @param time The local time (in milliseconds) of the node's playhead position.
        */
        public _pUpdateTime(time: number): void;
        /**
        * Updates the node's root delta position
        */
        public _pUpdatePositionDelta(): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleStateBase extends AnimationStateBase {
        private _particleNode;
        public _pDynamicProperties: geom.Vector3D[];
        public _pDynamicPropertiesDirty: Object;
        public _pNeedUpdateTime: boolean;
        constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase, needUpdateTime?: boolean);
        public needUpdateTime : boolean;
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        public _pUpdateDynamicProperties(animationSubGeometry: AnimationSubGeometry): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleAccelerationState extends ParticleStateBase {
        private _particleAccelerationNode;
        private _acceleration;
        private _halfAcceleration;
        /**
        * Defines the acceleration vector of the state, used when in global mode.
        */
        public acceleration : geom.Vector3D;
        constructor(animator: ParticleAnimator, particleAccelerationNode: ParticleAccelerationNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateAccelerationData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleBezierCurveState extends ParticleStateBase {
        private _particleBezierCurveNode;
        private _controlPoint;
        private _endPoint;
        /**
        * Defines the default control point of the node, used when in global mode.
        */
        public controlPoint : geom.Vector3D;
        /**
        * Defines the default end point of the node, used when in global mode.
        */
        public endPoint : geom.Vector3D;
        constructor(animator: ParticleAnimator, particleBezierCurveNode: ParticleBezierCurveNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleBillboardState extends ParticleStateBase {
        private _matrix;
        private _billboardAxis;
        /**
        *
        */
        constructor(animator: ParticleAnimator, particleNode: ParticleBillboardNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        /**
        * Defines the billboard axis.
        */
        public billboardAxis : geom.Vector3D;
    }
}
declare module away.animators {
    /**
    * ...
    * @author ...
    */
    class ParticleColorState extends ParticleStateBase {
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
        public startColor : geom.ColorTransform;
        /**
        * Defines the end color transform of the state, when in global mode.
        */
        public endColor : geom.ColorTransform;
        /**
        * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
        */
        public cycleDuration : number;
        /**
        * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
        */
        public cyclePhase : number;
        constructor(animator: ParticleAnimator, particleColorNode: ParticleColorNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateColorData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleFollowState extends ParticleStateBase {
        private _particleFollowNode;
        private _followTarget;
        private _targetPos;
        private _targetEuler;
        private _prePos;
        private _preEuler;
        private _smooth;
        private _temp;
        constructor(animator: ParticleAnimator, particleFollowNode: ParticleFollowNode);
        public followTarget : base.DisplayObject;
        public smooth : boolean;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private processPosition(currentTime, deltaTime, animationSubGeometry);
        private precessRotation(currentTime, deltaTime, animationSubGeometry);
        private processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);
    }
}
declare module away.animators {
    class ParticleInitialColorState extends ParticleStateBase {
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
        public initialColor : geom.ColorTransform;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateColorData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleOrbitState extends ParticleStateBase {
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
        public radius : number;
        /**
        * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
        */
        public cycleDuration : number;
        /**
        * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
        */
        public cyclePhase : number;
        /**
        * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
        */
        public eulers : geom.Vector3D;
        constructor(animator: ParticleAnimator, particleOrbitNode: ParticleOrbitNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateOrbitData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleOscillatorState extends ParticleStateBase {
        private _particleOscillatorNode;
        private _oscillator;
        private _oscillatorData;
        /**
        * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
        */
        public oscillator : geom.Vector3D;
        constructor(animator: ParticleAnimator, particleOscillatorNode: ParticleOscillatorNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateOscillatorData();
    }
}
declare module away.animators {
    /**
    * ...
    * @author ...
    */
    class ParticlePositionState extends ParticleStateBase {
        private _particlePositionNode;
        private _position;
        /**
        * Defines the position of the particle when in global mode. Defaults to 0,0,0.
        */
        public position : geom.Vector3D;
        /**
        *
        */
        public getPositions(): geom.Vector3D[];
        public setPositions(value: geom.Vector3D[]): void;
        constructor(animator: ParticleAnimator, particlePositionNode: ParticlePositionNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleRotateToHeadingState extends ParticleStateBase {
        private _matrix;
        constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleRotateToPositionState extends ParticleStateBase {
        private _particleRotateToPositionNode;
        private _position;
        private _matrix;
        private _offset;
        /**
        * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
        */
        public position : geom.Vector3D;
        constructor(animator: ParticleAnimator, particleRotateToPositionNode: ParticleRotateToPositionNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleRotationalVelocityState extends ParticleStateBase {
        private _particleRotationalVelocityNode;
        private _rotationalVelocityData;
        private _rotationalVelocity;
        /**
        * Defines the default rotationalVelocity of the state, used when in global mode.
        */
        public rotationalVelocity : geom.Vector3D;
        /**
        *
        */
        public getRotationalVelocities(): geom.Vector3D[];
        public setRotationalVelocities(value: geom.Vector3D[]): void;
        constructor(animator: ParticleAnimator, particleRotationNode: ParticleRotationalVelocityNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateRotationalVelocityData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleScaleState extends ParticleStateBase {
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
        public minScale : number;
        /**
        * Defines the end scale of the state, when in global mode. Defaults to 1.
        */
        public maxScale : number;
        /**
        * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
        */
        public cycleDuration : number;
        /**
        * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
        */
        public cyclePhase : number;
        constructor(animator: ParticleAnimator, particleScaleNode: ParticleScaleNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateScaleData();
    }
}
declare module away.animators {
    class ParticleSegmentedColorState extends ParticleStateBase {
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
        public startColor : geom.ColorTransform;
        /**
        * Defines the end color transform of the state, when in global mode.
        */
        public endColor : geom.ColorTransform;
        /**
        * Defines the number of segments.
        */
        public numSegmentPoint : number;
        /**
        * Defines the key points of color
        */
        public segmentPoints : ColorSegmentPoint[];
        public usesMultiplier : boolean;
        public usesOffset : boolean;
        constructor(animator: ParticleAnimator, particleSegmentedColorNode: ParticleSegmentedColorNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateColorData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleSpriteSheetState extends ParticleStateBase {
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
        public cyclePhase : number;
        /**
        * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
        */
        public cycleDuration : number;
        constructor(animator: ParticleAnimator, particleSpriteSheetNode: ParticleSpriteSheetNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
        private updateSpriteSheetData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleTimeState extends ParticleStateBase {
        private _particleTimeNode;
        constructor(animator: ParticleAnimator, particleTimeNode: ParticleTimeNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleUVState extends ParticleStateBase {
        private _particleUVNode;
        constructor(animator: ParticleAnimator, particleUVNode: ParticleUVNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleVelocityState extends ParticleStateBase {
        private _particleVelocityNode;
        private _velocity;
        /**
        * Defines the default velocity vector of the state, used when in global mode.
        */
        public velocity : geom.Vector3D;
        /**
        *
        */
        public getVelocities(): geom.Vector3D[];
        public setVelocities(value: geom.Vector3D[]): void;
        constructor(animator: ParticleAnimator, particleVelocityNode: ParticleVelocityNode);
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: entities.Camera): void;
    }
}
declare module away.animators {
    /**
    *
    */
    class AnimationClipState extends AnimationStateBase {
        private _animationClipNode;
        private _animationStatePlaybackComplete;
        public _pBlendWeight: number;
        public _pCurrentFrame: number;
        public _pNextFrame: number;
        public _pOldFrame: number;
        public _pTimeDir: number;
        public _pFramesDirty: boolean;
        /**
        * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
        * between the current frame (0) and next frame (1) of the animation.
        *
        * @see #currentFrame
        * @see #nextFrame
        */
        public blendWeight : number;
        /**
        * Returns the current frame of animation in the clip based on the internal playhead position.
        */
        public currentFrame : number;
        /**
        * Returns the next frame of animation in the clip based on the internal playhead position.
        */
        public nextFrame : number;
        constructor(animator: AnimatorBase, animationClipNode: AnimationClipNodeBase);
        /**
        * @inheritDoc
        */
        public update(time: number): void;
        /**
        * @inheritDoc
        */
        public phase(value: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdateTime(time: number): void;
        /**
        * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
        *
        * @see #currentFrame
        * @see #nextFrame
        * @see #blendWeight
        */
        public _pUpdateFrames(): void;
        private notifyPlaybackComplete();
    }
}
declare module away.animators {
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
        public blendWeight : number;
        constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonBinaryLERPNode);
        /**
        * @inheritDoc
        */
        public phase(value: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdateTime(time: number): void;
        /**
        * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
        */
        public getSkeletonPose(skeleton: Skeleton): SkeletonPose;
        /**
        * @inheritDoc
        */
        public _pUpdatePositionDelta(): void;
        /**
        * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
        *
        * @param skeleton The skeleton used by the animator requesting the ouput pose.
        */
        private updateSkeletonPose(skeleton);
    }
}
declare module away.animators {
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
        public currentPose : SkeletonPose;
        /**
        * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
        */
        public nextPose : SkeletonPose;
        constructor(animator: AnimatorBase, skeletonClipNode: SkeletonClipNode);
        /**
        * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
        */
        public getSkeletonPose(skeleton: Skeleton): SkeletonPose;
        /**
        * @inheritDoc
        */
        public _pUpdateTime(time: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdateFrames(): void;
        /**
        * Updates the output skeleton pose of the node based on the internal playhead position.
        *
        * @param skeleton The skeleton used by the animator requesting the ouput pose.
        */
        private updateSkeletonPose(skeleton);
        /**
        * @inheritDoc
        */
        public _pUpdatePositionDelta(): void;
    }
}
declare module away.animators {
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
        public blendWeight : number;
        constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDifferenceNode);
        /**
        * @inheritDoc
        */
        public phase(value: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdateTime(time: number): void;
        /**
        * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
        */
        public getSkeletonPose(skeleton: Skeleton): SkeletonPose;
        /**
        * @inheritDoc
        */
        public _pUpdatePositionDelta(): void;
        /**
        * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
        *
        * @param skeleton The skeleton used by the animator requesting the ouput pose.
        */
        private updateSkeletonPose(skeleton);
    }
}
declare module away.animators {
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
        public direction : number;
        constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDirectionalNode);
        /**
        * @inheritDoc
        */
        public phase(value: number): void;
        /**
        * @inheritDoc
        */
        public _pUdateTime(time: number): void;
        /**
        * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
        */
        public getSkeletonPose(skeleton: Skeleton): SkeletonPose;
        /**
        * @inheritDoc
        */
        public _pUpdatePositionDelta(): void;
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
}
declare module away.animators {
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
        public phase(value: number): void;
        /**
        * @inheritDoc
        */
        public _pUdateTime(time: number): void;
        /**
        * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
        */
        public getSkeletonPose(skeleton: Skeleton): SkeletonPose;
        /**
        * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
        *
        * @param index The input index for which the skeleton animation node blend weight is requested.
        */
        public getBlendWeightAt(index: number): number;
        /**
        * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
        *
        * @param index The input index on which the skeleton animation node blend weight is to be set.
        * @param blendWeight The blend weight value to use for the given skeleton animation node index.
        */
        public setBlendWeightAt(index: number, blendWeight: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdatePositionDelta(): void;
        /**
        * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
        *
        * @param skeleton The skeleton used by the animator requesting the ouput pose.
        */
        private updateSkeletonPose(skeleton);
    }
}
declare module away.animators {
    /**
    *
    */
    class VertexClipState extends AnimationClipState implements IVertexAnimationState {
        private _frames;
        private _vertexClipNode;
        private _currentGeometry;
        private _nextGeometry;
        /**
        * @inheritDoc
        */
        public currentGeometry : base.Geometry;
        /**
        * @inheritDoc
        */
        public nextGeometry : base.Geometry;
        constructor(animator: AnimatorBase, vertexClipNode: VertexClipNode);
        /**
        * @inheritDoc
        */
        public _pUpdateFrames(): void;
        /**
        * @inheritDoc
        */
        public _pUpdatePositionDelta(): void;
    }
}
declare module away.animators {
    interface IAnimationTransition {
        getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startTime: number): AnimationNodeBase;
    }
}
declare module away.animators {
    class CrossfadeTransition implements IAnimationTransition {
        public blendSpeed: number;
        constructor(blendSpeed: number);
        public getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startBlend: number): AnimationNodeBase;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
    */
    class CrossfadeTransitionNode extends SkeletonBinaryLERPNode {
        public blendSpeed: number;
        public startBlend: number;
        /**
        * Creates a new <code>CrossfadeTransitionNode</code> object.
        */
        constructor();
    }
}
declare module away.animators {
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
        public _pUpdateTime(time: number): void;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
    *
    * @see away.animators.AnimatorBase
    */
    class AnimationSetBase extends library.NamedAssetBase implements library.IAsset {
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
        public _pFindTempReg(exclude: string[], excludeAnother?: string): string;
        /**
        * Indicates whether the properties of the animation data contained within the set combined with
        * the vertex registers already in use on shading materials allows the animation data to utilise
        * GPU calls.
        */
        public usesCPU : boolean;
        /**
        * Called by the material to reset the GPU indicator before testing whether register space in the shader
        * is available for running GPU-based animation code.
        *
        * @private
        */
        public resetGPUCompatibility(): void;
        public cancelGPUCompatibility(): void;
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public activate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * Returns a vector of animation state objects that make up the contents of the animation data set.
        */
        public animations : AnimationNodeBase[];
        /**
        * Returns a vector of animation state objects that make up the contents of the animation data set.
        */
        public animationNames : string[];
        /**
        * Check to determine whether a state is registered in the animation set under the given name.
        *
        * @param stateName The name of the animation state object to be checked.
        */
        public hasAnimation(name: string): boolean;
        /**
        * Retrieves the animation state object registered in the animation data set under the given name.
        *
        * @param stateName The name of the animation state object to be retrieved.
        */
        public getAnimation(name: string): AnimationNodeBase;
        /**
        * Adds an animation state object to the aniamtion data set under the given name.
        *
        * @param stateName The name under which the animation state object will be stored.
        * @param animationState The animation state object to be staored in the set.
        */
        public addAnimation(node: AnimationNodeBase): void;
        /**
        * Cleans up any resources used by the current object.
        */
        public dispose(): void;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
    *
    * @see away.animators.AnimationSetBase
    */
    class AnimatorBase extends library.NamedAssetBase implements IAnimator {
        private _broadcaster;
        private _isPlaying;
        private _autoUpdate;
        private _startEvent;
        private _stopEvent;
        private _cycleEvent;
        private _time;
        private _playbackSpeed;
        public _pAnimationSet: IAnimationSet;
        public _pOwners: entities.Mesh[];
        public _pActiveNode: AnimationNodeBase;
        public _pActiveState: IAnimationState;
        public _pActiveAnimationName: string;
        public _pAbsoluteTime: number;
        private _animationStates;
        /**
        * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
        *
        * @see away.animators.IAnimationState#positionDelta
        */
        public updatePosition: boolean;
        public getAnimationState(node: AnimationNodeBase): IAnimationState;
        public getAnimationStateByName(name: string): IAnimationState;
        /**
        * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
        *
        * @see #time
        * @see #playbackSpeed
        */
        public absoluteTime : number;
        /**
        * Returns the animation data set in use by the animator.
        */
        public animationSet : IAnimationSet;
        /**
        * Returns the current active animation state.
        */
        public activeState : IAnimationState;
        /**
        * Returns the current active animation node.
        */
        public activeAnimation : AnimationNodeBase;
        /**
        * Returns the current active animation node.
        */
        public activeAnimationName : string;
        /**
        * Determines whether the animators internal update mechanisms are active. Used in cases
        * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
        * Defaults to true.
        *
        * @see #time
        * @see #update()
        */
        public autoUpdate : boolean;
        /**
        * Gets and sets the internal time clock of the animator.
        */
        public time : number;
        /**
        * Sets the animation phase of the current active state's animation clip(s).
        *
        * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
        */
        public phase(value: number): void;
        /**
        * Creates a new <code>AnimatorBase</code> object.
        *
        * @param animationSet The animation data set to be used by the animator object.
        */
        constructor(animationSet: IAnimationSet);
        /**
        * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
        */
        public playbackSpeed : number;
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: entities.Camera): void;
        /**
        * Resumes the automatic playback clock controling the active state of the animator.
        */
        public start(): void;
        /**
        * Pauses the automatic playback clock of the animator, in case manual updates are required via the
        * <code>time</code> property or <code>update()</code> method.
        *
        * @see #time
        * @see #update()
        */
        public stop(): void;
        /**
        * Provides a way to manually update the active state of the animator when automatic
        * updates are disabled.
        *
        * @see #stop()
        * @see #autoUpdate
        */
        public update(time: number): void;
        public reset(name: string, offset?: number): void;
        /**
        * Used by the mesh object to which the animator is applied, registers the owner for internal use.
        *
        * @private
        */
        public addOwner(mesh: entities.Mesh): void;
        /**
        * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
        *
        * @private
        */
        public removeOwner(mesh: entities.Mesh): void;
        /**
        * Internal abstract method called when the time delta property of the animator's contents requires updating.
        *
        * @private
        */
        public _pUpdateDeltaTime(dt: number): void;
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
        public dispatchCycleEvent(): void;
        /**
        * @inheritDoc
        */
        public clone(): AnimatorBase;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public testGPUCompatibility(pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
        public getRenderableSubGeometry(renderable: pool.TriangleSubMeshRenderable, sourceSubGeometry: base.TriangleSubGeometry): base.TriangleSubGeometry;
    }
}
declare module away.animators {
    /**
    * The animation data set used by particle-based animators, containing particle animation data.
    *
    * @see away.animators.ParticleAnimator
    */
    class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet {
        /** @private */
        public _iAnimationRegisterCache: AnimationRegisterCache;
        private _timeNode;
        /**
        * Property used by particle nodes that require compilation at the end of the shader
        */
        static POST_PRIORITY: number;
        /**
        * Property used by particle nodes that require color compilation
        */
        static COLOR_PRIORITY: number;
        private _animationSubGeometries;
        private _particleNodes;
        private _localDynamicNodes;
        private _localStaticNodes;
        private _totalLenOfOneVertex;
        public hasUVNode: boolean;
        public needVelocity: boolean;
        public hasBillboard: boolean;
        public hasColorMulNode: boolean;
        public hasColorAddNode: boolean;
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
        public initParticleFunc: Function;
        /**
        * Initialiser function scope for static particle properties
        */
        public initParticleScope: Object;
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
        public particleNodes : ParticleNodeBase[];
        /**
        * @inheritDoc
        */
        public addAnimation(node: AnimationNodeBase): void;
        /**
        * @inheritDoc
        */
        public activate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public usesCPU : boolean;
        /**
        * @inheritDoc
        */
        public cancelGPUCompatibility(): void;
        public dispose(): void;
        public getAnimationSubGeometry(subMesh: base.ISubMesh): any;
        /** @private */
        public _iGenerateAnimationSubGeometries(mesh: entities.Mesh): void;
    }
}
declare module away.animators {
    /**
    * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
    * and controlling the various available states of animation through an interative playhead that can be
    * automatically updated or manually triggered.
    *
    * Requires that the containing geometry of the parent mesh is particle geometry
    *
    * @see away.base.ParticleGeometry
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
        public clone(): AnimatorBase;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public testGPUCompatibility(pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public start(): void;
        /**
        * @inheritDoc
        */
        public _pUpdateDeltaTime(dt: number): void;
        /**
        * @inheritDoc
        */
        public resetTime(offset?: number): void;
        public dispose(): void;
        private getAnimatorSubGeometry(subMesh);
    }
}
declare module away.animators {
    /**
    * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
    * and controlling the various available states of animation through an interative playhead that can be
    * automatically updated or manually triggered.
    */
    class SkeletonAnimator extends AnimatorBase {
        private _globalMatrices;
        private _globalPose;
        private _globalPropertiesDirty;
        private _numJoints;
        private _morphedSubGeometry;
        private _morphedSubGeometryDirty;
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
        public globalMatrices : number[];
        /**
        * returns the current skeleton pose output from the animator.
        *
        * @see away.animators.data.SkeletonPose
        */
        public globalPose : SkeletonPose;
        /**
        * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
        * skinned geoemtry to which skeleon animator is applied.
        */
        public skeleton : Skeleton;
        /**
        * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
        * Defaults to false.
        */
        public forceCPU : boolean;
        /**
        * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
        * by condensing the number of joint index values required per mesh. Only applicable to
        * skeleton animations that utilise more than one mesh object. Defaults to false.
        */
        public useCondensedIndices : boolean;
        /**
        * Creates a new <code>SkeletonAnimator</code> object.
        *
        * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
        * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
        * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
        */
        constructor(animationSet: SkeletonAnimationSet, skeleton: Skeleton, forceCPU?: boolean);
        /**
        * @inheritDoc
        */
        public clone(): AnimatorBase;
        /**
        * Plays an animation state registered with the given name in the animation data set.
        *
        * @param name The data set name of the animation state to be played.
        * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
        * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
        */
        public play(name: string, transition?: IAnimationTransition, offset?: number): void;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public testGPUCompatibility(pass: materials.MaterialPassBase): void;
        /**
        * Applies the calculated time delta to the active animation state node or state transition object.
        */
        public _pUpdateDeltaTime(dt: number): void;
        private updateCondensedMatrices(condensedIndexLookUp, numJoints);
        private updateGlobalProperties();
        public getRenderableSubGeometry(renderable: pool.TriangleSubMeshRenderable, sourceSubGeometry: base.TriangleSubGeometry): base.TriangleSubGeometry;
        /**
        * If the animation can't be performed on GPU, transform vertices manually
        * @param subGeom The subgeometry containing the weights and joint index data per vertex.
        * @param pass The material pass for which we need to transform the vertices
        */
        public morphSubGeometry(renderable: pool.TriangleSubMeshRenderable, sourceSubGeometry: base.TriangleSubGeometry): void;
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
}
declare module away.animators {
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
        public jointsPerVertex : number;
        /**
        * Creates a new <code>SkeletonAnimationSet</code> object.
        *
        * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
        */
        constructor(jointsPerVertex?: number);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public activate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: materials.MaterialPassBase): void;
    }
}
declare module away.animators {
    /**
    * The animation data set used by vertex-based animators, containing vertex animation state data.
    *
    * @see away.animators.VertexAnimator
    */
    class VertexAnimationSet extends AnimationSetBase implements IAnimationSet {
        private _numPoses;
        private _blendMode;
        private _streamIndices;
        private _useNormals;
        private _useTangents;
        private _uploadNormals;
        private _uploadTangents;
        /**
        * Returns the number of poses made available at once to the GPU animation code.
        */
        public numPoses : number;
        /**
        * Returns the active blend mode of the vertex animator object.
        */
        public blendMode : string;
        /**
        * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
        */
        public useNormals : boolean;
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
        public getAGALVertexCode(pass: materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public activate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: base.StageGL, pass: materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: materials.MaterialPassBase): void;
        /**
        * Generates the vertex AGAL code for absolute blending.
        */
        private getAbsoluteAGALCode(pass, sourceRegisters, targetRegisters);
        /**
        * Generates the vertex AGAL code for additive blending.
        */
        private getAdditiveAGALCode(pass, sourceRegisters, targetRegisters);
    }
}
declare module away.animators {
    /**
    * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
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
        public clone(): AnimatorBase;
        /**
        * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
        * @param sequenceName The name of the clip to be played.
        */
        public play(name: string, transition?: IAnimationTransition, offset?: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdateDeltaTime(dt: number): void;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: base.StageGL, renderable: pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: entities.Camera): void;
        private setNullPose(stageGL, renderable, vertexConstantOffset, vertexStreamOffset);
        /**
        * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
        * Needs to be called if gpu code is potentially required.
        */
        public testGPUCompatibility(pass: materials.MaterialPassBase): void;
        public getRenderableSubGeometry(renderable: pool.TriangleSubMeshRenderable, sourceSubGeometry: base.TriangleSubGeometry): base.TriangleSubGeometry;
    }
}
declare module away.parsers {
    /**
    * OBJParser provides a parser for the OBJ data type.
    */
    class OBJParser extends ParserBase {
        private _textData;
        private _startedParsing;
        private _charIndex;
        private _oldIndex;
        private _stringLength;
        private _currentObject;
        private _currentGroup;
        private _currentMaterialGroup;
        private _objects;
        private _materialIDs;
        private _materialLoaded;
        private _materialSpecularData;
        private _meshes;
        private _lastMtlID;
        private _objectIndex;
        private _realIndices;
        private _vertexIndex;
        private _vertices;
        private _vertexNormals;
        private _uvs;
        private _scale;
        private _mtlLib;
        private _mtlLibLoaded;
        private _activeMaterialID;
        /**
        * Creates a new OBJParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        constructor(scale?: number);
        /**
        * Scaling factor applied directly to vertices data
        * @param value The scaling factor.
        */
        public scale : number;
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _iResolveDependency(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        public _pStartParsing(frameLimit: number): void;
        /**
        * Parses a single line in the OBJ file.
        */
        private parseLine(trunk);
        /**
        * Converts the parsed data into an Away3D scenegraph structure
        */
        private translate();
        /**
        * Translates an obj's material group to a subgeometry.
        * @param materialGroup The material group data to convert.
        * @param geometry The Geometry to contain the converted SubGeometry.
        */
        private translateMaterialGroup(materialGroup, geometry);
        private translateVertexData(face, vertexIndex, vertices, uvs, indices, normals);
        /**
        * Creates a new object group.
        * @param trunk The data block containing the object tag and its parameters
        */
        private createObject(trunk);
        /**
        * Creates a new group.
        * @param trunk The data block containing the group tag and its parameters
        */
        private createGroup(trunk);
        /**
        * Creates a new material group.
        * @param trunk The data block containing the material tag and its parameters
        */
        private createMaterialGroup(trunk);
        /**
        * Reads the next vertex coordinates.
        * @param trunk The data block containing the vertex tag and its parameters
        */
        private parseVertex(trunk);
        /**
        * Reads the next uv coordinates.
        * @param trunk The data block containing the uv tag and its parameters
        */
        private parseUV(trunk);
        /**
        * Reads the next vertex normal coordinates.
        * @param trunk The data block containing the vertex normal tag and its parameters
        */
        private parseVertexNormal(trunk);
        /**
        * Reads the next face's indices.
        * @param trunk The data block containing the face tag and its parameters
        */
        private parseFace(trunk);
        /**
        * This is a hack around negative face coords
        */
        private parseIndex(index, length);
        private parseMtl(data);
        private parseMapKdString(trunk);
        private loadMtl(mtlurl);
        private applyMaterial(lm);
        private applyMaterials();
    }
}
declare class ObjectGroup {
    public name: string;
    public groups: Group[];
}
declare class Group {
    public name: string;
    public materialID: string;
    public materialGroups: MaterialGroup[];
}
declare class MaterialGroup {
    public url: string;
    public faces: FaceData[];
}
declare class SpecularData {
    public materialID: string;
    public basicSpecularMethod: away.materials.SpecularBasicMethod;
    public ambientColor: number;
    public alpha: number;
}
declare class LoadedMaterial {
    public materialID: string;
    public texture: away.textures.Texture2DBase;
    public cm: away.materials.MaterialBase;
    public specularMethod: away.materials.SpecularBasicMethod;
    public ambientColor: number;
    public alpha: number;
}
declare class FaceData {
    public vertexIndices: number[];
    public uvIndices: number[];
    public normalIndices: number[];
    public indexIds: string[];
}
/**
* Texture coordinates value object.
*/
declare class UV {
    private _u;
    private _v;
    /**
    * Creates a new <code>UV</code> object.
    *
    * @param    u        [optional]    The horizontal coordinate of the texture value. Defaults to 0.
    * @param    v        [optional]    The vertical coordinate of the texture value. Defaults to 0.
    */
    constructor(u?: number, v?: number);
    /**
    * Defines the vertical coordinate of the texture value.
    */
    public v : number;
    /**
    * Defines the horizontal coordinate of the texture value.
    */
    public u : number;
    /**
    * returns a new UV value Object
    */
    public clone(): UV;
    /**
    * returns the value object as a string for trace/debug purpose
    */
    public toString(): string;
}
declare class Vertex {
    private _x;
    private _y;
    private _z;
    private _index;
    /**
    * Creates a new <code>Vertex</code> value object.
    *
    * @param    x            [optional]    The x value. Defaults to 0.
    * @param    y            [optional]    The y value. Defaults to 0.
    * @param    z            [optional]    The z value. Defaults to 0.
    * @param    index        [optional]    The index value. Defaults is NaN.
    */
    constructor(x?: number, y?: number, z?: number, index?: number);
    /**
    * To define/store the index of value object
    * @param    ind        The index
    */
    public index : number;
    /**
    * To define/store the x value of the value object
    * @param    value        The x value
    */
    public x : number;
    /**
    * To define/store the y value of the value object
    * @param    value        The y value
    */
    public y : number;
    /**
    * To define/store the z value of the value object
    * @param    value        The z value
    */
    public z : number;
    /**
    * returns a new Vertex value Object
    */
    public clone(): Vertex;
}
declare module away.parsers {
    /**
    * AWDParser provides a parser for the AWD data type.
    */
    class AWDParser extends ParserBase {
        private _debug;
        private _byteData;
        private _startedParsing;
        private _cur_block_id;
        private _blocks;
        private _newBlockBytes;
        private _version;
        private _compression;
        private _accuracyOnBlocks;
        private _accuracyMatrix;
        private _accuracyGeo;
        private _accuracyProps;
        private _matrixNrType;
        private _geoNrType;
        private _propsNrType;
        private _streaming;
        private _texture_users;
        private _parsed_header;
        private _body;
        private _defaultTexture;
        private _cubeTextures;
        private _defaultBitmapMaterial;
        private _defaultCubeTexture;
        static COMPRESSIONMODE_LZMA: string;
        static UNCOMPRESSED: number;
        static DEFLATE: number;
        static LZMA: number;
        static INT8: number;
        static INT16: number;
        static INT32: number;
        static UINT8: number;
        static UINT16: number;
        static UINT32: number;
        static FLOAT32: number;
        static FLOAT64: number;
        static BOOL: number;
        static COLOR: number;
        static BADDR: number;
        static AWDSTRING: number;
        static AWDBYTEARRAY: number;
        static VECTOR2x1: number;
        static VECTOR3x1: number;
        static VECTOR4x1: number;
        static MTX3x2: number;
        static MTX3x3: number;
        static MTX4x3: number;
        static MTX4x4: number;
        private blendModeDic;
        private _depthSizeDic;
        /**
        * Creates a new AWDParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        constructor();
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _iResolveDependency(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
        /**
        * Resolve a dependency name
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependencyName(resourceDependency: ResourceDependency, asset: library.IAsset): string;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        public _pStartParsing(frameLimit: number): void;
        private dispose();
        private parseNextBlock();
        private parseTriangleGeometrieBlock(blockID);
        private parsePrimitves(blockID);
        private parseContainer(blockID);
        private parseMeshInstance(blockID);
        private parseSkyboxInstance(blockID);
        private parseLight(blockID);
        private parseCamera(blockID);
        private parseLightPicker(blockID);
        private parseMaterial(blockID);
        private parseMaterial_v1(blockID);
        private parseTexture(blockID);
        private parseCubeTexture(blockID);
        private parseSharedMethodBlock(blockID);
        private parseShadowMethodBlock(blockID);
        private parseCommand(blockID);
        private parseMetaData(blockID);
        private parseNameSpace(blockID);
        private parseShadowMethodList(light, blockID);
        private parseSkeleton(blockID);
        private parseSkeletonPose(blockID);
        private parseSkeletonAnimation(blockID);
        private parseMeshPoseAnimation(blockID, poseOnly?);
        private parseVertexAnimationSet(blockID);
        private parseAnimatorSet(blockID);
        private parseSharedMethodList(blockID);
        private parseUserAttributes();
        private parseProperties(expected);
        private parseAttrValue(type, len);
        private parseHeader();
        private getUVForVertexAnimation(meshID);
        private parseVarStr();
        private getAssetByID(assetID, assetTypesToGet, extraTypeInfo?);
        private getDefaultAsset(assetType, extraTypeInfo);
        private getDefaultMaterial();
        private getDefaultTexture();
        private getDefaultCubeTexture();
        private readNumber(precision?);
        private parseMatrix3D();
        private parseMatrix32RawData();
        private parseMatrix43RawData();
    }
}
declare class AWDBlock {
    public id: number;
    public name: string;
    public data: any;
    public len: any;
    public geoID: number;
    public extras: Object;
    public bytes: away.utils.ByteArray;
    public errorMessages: string[];
    public uvsForVertexAnimation: number[][];
    constructor();
    public dispose(): void;
    public addError(errorMsg: string): void;
}
declare class bitFlags {
    static FLAG1: number;
    static FLAG2: number;
    static FLAG3: number;
    static FLAG4: number;
    static FLAG5: number;
    static FLAG6: number;
    static FLAG7: number;
    static FLAG8: number;
    static FLAG9: number;
    static FLAG10: number;
    static FLAG11: number;
    static FLAG12: number;
    static FLAG13: number;
    static FLAG14: number;
    static FLAG15: number;
    static FLAG16: number;
    static test(flags: number, testFlag: number): boolean;
}
declare class AWDProperties {
    public set(key: number, value: any): void;
    public get(key: number, fallback: any): any;
}
declare module away.parsers {
    /**
    * Max3DSParser provides a parser for the 3ds data type.
    */
    class Max3DSParser extends ParserBase {
        private _byteData;
        private _textures;
        private _materials;
        private _unfinalized_objects;
        private _cur_obj_end;
        private _cur_obj;
        private _cur_mat_end;
        private _cur_mat;
        private _useSmoothingGroups;
        /**
        * Creates a new <code>Max3DSParser</code> object.
        *
        * @param useSmoothingGroups Determines whether the parser looks for smoothing groups in the 3ds file or assumes uniform smoothing. Defaults to true.
        */
        constructor(useSmoothingGroups?: boolean);
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _iResolveDependency(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        public _pStartParsing(frameLimit: number): void;
        private parseMaterial();
        private parseTexture(end);
        private parseVertexList();
        private parseFaceList();
        private parseSmoothingGroups();
        private parseUVList();
        private parseFaceMaterialList();
        private parseObjectAnimation(end);
        private constructObject(obj, pivot?);
        private prepareData(vertices, faces, obj);
        private applySmoothGroups(vertices, faces);
        private finalizeCurrentMaterial();
        private readNulTermstring();
        private readTransform();
        private readColor();
    }
}
declare class TextureVO {
    public url: string;
    public texture: away.textures.Texture2DBase;
}
declare class MaterialVO {
    public name: string;
    public ambientColor: number;
    public diffuseColor: number;
    public specularColor: number;
    public twoSided: boolean;
    public colorMap: TextureVO;
    public specularMap: TextureVO;
    public material: away.materials.MaterialBase;
}
declare class ObjectVO {
    public name: string;
    public type: string;
    public pivotX: number;
    public pivotY: number;
    public pivotZ: number;
    public transform: number[];
    public verts: number[];
    public indices: number[];
    public uvs: number[];
    public materialFaces: Object;
    public materials: string[];
    public smoothingGroups: number[];
}
declare class VertexVO {
    public x: number;
    public y: number;
    public z: number;
    public u: number;
    public v: number;
    public normal: away.geom.Vector3D;
    public tangent: away.geom.Vector3D;
}
declare class FaceVO {
    public a: number;
    public b: number;
    public c: number;
    public smoothGroup: number;
}
declare module away.parsers {
    /**
    * MD2Parser provides a parser for the MD2 data type.
    */
    class MD2Parser extends ParserBase {
        static FPS: number;
        private _clipNodes;
        private _byteData;
        private _startedParsing;
        private _parsedHeader;
        private _parsedUV;
        private _parsedFaces;
        private _parsedFrames;
        private _ident;
        private _version;
        private _skinWidth;
        private _skinHeight;
        private _numSkins;
        private _numVertices;
        private _numST;
        private _numTris;
        private _numFrames;
        private _offsetSkins;
        private _offsetST;
        private _offsetTris;
        private _offsetFrames;
        private _offsetEnd;
        private _uvIndices;
        private _indices;
        private _vertIndices;
        private _animationSet;
        private _firstSubGeom;
        private _uvs;
        private _finalUV;
        private _materialNames;
        private _textureType;
        private _ignoreTexturePath;
        private _mesh;
        private _geometry;
        private materialFinal;
        private geoCreated;
        /**
        * Creates a new MD2Parser object.
        * @param textureType The extension of the texture (e.g. jpg/png/...)
        * @param ignoreTexturePath If true, the path of the texture is ignored
        */
        constructor(textureType?: string, ignoreTexturePath?: boolean);
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _iResolveDependency(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        public _pStartParsing(frameLimit: number): void;
        /**
        * Reads in all that MD2 Header data that is declared as private variables.
        * I know its a lot, and it looks ugly, but only way to do it in Flash
        */
        private parseHeader();
        /**
        * Parses the file names for the materials.
        */
        private parseMaterialNames();
        /**
        * Parses the uv data for the mesh.
        */
        private parseUV();
        /**
        * Parses unique indices for the faces.
        */
        private parseFaces();
        /**
        * Adds a face index to the list if it doesn't exist yet, based on vertexIndex and uvIndex, and adds the
        * corresponding vertex and uv data in the correct location.
        * @param vertexIndex The original index in the vertex list.
        * @param uvIndex The original index in the uv list.
        */
        private addIndex(vertexIndex, uvIndex);
        /**
        * Finds the final index corresponding to the original MD2's vertex and uv indices. Returns -1 if it wasn't added yet.
        * @param vertexIndex The original index in the vertex list.
        * @param uvIndex The original index in the uv list.
        * @return The index of the final mesh corresponding to the original vertex and uv index. -1 if it doesn't exist yet.
        */
        private findIndex(vertexIndex, uvIndex);
        /**
        * Parses all the frame geometries.
        */
        private parseFrames();
        private readFrameName();
    }
}
declare module away.parsers {
    /**
    * MD5AnimParser provides a parser for the md5anim data type, providing an animation sequence for the md5 format.
    *
    * todo: optimize
    */
    class MD5AnimParser extends ParserBase {
        private _textData;
        private _startedParsing;
        static VERSION_TOKEN: string;
        static COMMAND_LINE_TOKEN: string;
        static NUM_FRAMES_TOKEN: string;
        static NUM_JOINTS_TOKEN: string;
        static FRAME_RATE_TOKEN: string;
        static NUM_ANIMATED_COMPONENTS_TOKEN: string;
        static HIERARCHY_TOKEN: string;
        static BOUNDS_TOKEN: string;
        static BASE_FRAME_TOKEN: string;
        static FRAME_TOKEN: string;
        static COMMENT_TOKEN: string;
        private _parseIndex;
        private _reachedEOF;
        private _line;
        private _charLineIndex;
        private _version;
        private _frameRate;
        private _numFrames;
        private _numJoints;
        private _numAnimatedComponents;
        private _hierarchy;
        private _bounds;
        private _frameData;
        private _baseFrameData;
        private _rotationQuat;
        private _clip;
        /**
        * Creates a new MD5AnimParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        constructor(additionalRotationAxis?: geom.Vector3D, additionalRotationRadians?: number);
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        /**
        * Converts all key frame data to an SkinnedAnimationSequence.
        */
        private translateClip();
        /**
        * Converts a single key frame data to a SkeletonPose.
        * @param frameData The actual frame data.
        * @return A SkeletonPose containing the frame data's pose.
        */
        private translatePose(frameData);
        /**
        * Parses the skeleton's hierarchy data.
        */
        private parseHierarchy();
        /**
        * Parses frame bounds.
        */
        private parseBounds();
        /**
        * Parses the base frame.
        */
        private parseBaseFrame();
        /**
        * Parses a single frame.
        */
        private parseFrame();
        /**
        * Puts back the last read character into the data stream.
        */
        private putBack();
        /**
        * Gets the next token in the data stream.
        */
        private getNextToken();
        /**
        * Skips all whitespace in the data stream.
        */
        private skipWhiteSpace();
        /**
        * Skips to the next line.
        */
        private ignoreLine();
        /**
        * Retrieves the next single character in the data stream.
        */
        private getNextChar();
        /**
        * Retrieves the next integer in the data stream.
        */
        private getNextInt();
        /**
        * Retrieves the next floating point number in the data stream.
        */
        private getNextNumber();
        /**
        * Retrieves the next 3d vector in the data stream.
        */
        private parseVector3D();
        /**
        * Retrieves the next quaternion in the data stream.
        */
        private parseQuaternion();
        /**
        * Parses the command line data.
        */
        private parseCMD();
        /**
        * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
        * by double quotes.
        */
        private parseLiteralstring();
        /**
        * Throws an end-of-file error when a premature end of file was encountered.
        */
        private sendEOFError();
        /**
        * Throws an error when an unexpected token was encountered.
        * @param expected The token type that was actually expected.
        */
        private sendParseError(expected);
        /**
        * Throws an error when an unknown keyword was encountered.
        */
        private sendUnknownKeywordError();
    }
}
declare class HierarchyData {
    public name: string;
    public parentIndex: number;
    public flags: number;
    public startIndex: number;
    public HierarchyData(): void;
}
declare class BoundsData {
    public min: away.geom.Vector3D;
    public max: away.geom.Vector3D;
    public BoundsData(): void;
}
declare class BaseFrameData {
    public position: away.geom.Vector3D;
    public orientation: away.geom.Quaternion;
    public BaseFrameData(): void;
}
declare class FrameData {
    public index: number;
    public components: number[];
    public FrameData(): void;
}
declare module away.parsers {
    /**
    * MD5MeshParser provides a parser for the md5mesh data type, providing the geometry of the md5 format.
    *
    * todo: optimize
    */
    class MD5MeshParser extends ParserBase {
        private _textData;
        private _startedParsing;
        static VERSION_TOKEN: string;
        static COMMAND_LINE_TOKEN: string;
        static NUM_JOINTS_TOKEN: string;
        static NUM_MESHES_TOKEN: string;
        static COMMENT_TOKEN: string;
        static JOINTS_TOKEN: string;
        static MESH_TOKEN: string;
        static MESH_SHADER_TOKEN: string;
        static MESH_NUM_VERTS_TOKEN: string;
        static MESH_VERT_TOKEN: string;
        static MESH_NUM_TRIS_TOKEN: string;
        static MESH_TRI_TOKEN: string;
        static MESH_NUM_WEIGHTS_TOKEN: string;
        static MESH_WEIGHT_TOKEN: string;
        private _parseIndex;
        private _reachedEOF;
        private _line;
        private _charLineIndex;
        private _version;
        private _numJoints;
        private _numMeshes;
        private _mesh;
        private _shaders;
        private _maxJointCount;
        private _meshData;
        private _bindPoses;
        private _geometry;
        private _skeleton;
        private _animationSet;
        private _rotationQuat;
        /**
        * Creates a new MD5MeshParser object.
        */
        constructor(additionalRotationAxis?: geom.Vector3D, additionalRotationRadians?: number);
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
        public _pStartParsing(frameLimit: number): void;
        private calculateMaxJointCount();
        private countZeroWeightJoints(vertex, weights);
        /**
        * Parses the skeleton's joints.
        */
        private parseJoints();
        /**
        * Puts back the last read character into the data stream.
        */
        private putBack();
        /**
        * Parses the mesh geometry.
        */
        private parseMesh();
        /**
        * Converts the mesh data to a SkinnedSub instance.
        * @param vertexData The mesh's vertices.
        * @param weights The joint weights per vertex.
        * @param indices The indices for the faces.
        * @return A SubGeometry instance containing all geometrical data for the current mesh.
        */
        private translateGeom(vertexData, weights, indices);
        /**
        * Retrieve the next triplet of vertex indices that form a face.
        * @param indices The index list in which to store the read data.
        */
        private parseTri(indices);
        /**
        * Reads a new joint data set for a single joint.
        * @param weights the target list to contain the weight data.
        */
        private parseJoint(weights);
        /**
        * Reads the data for a single vertex.
        * @param vertexData The list to contain the vertex data.
        */
        private parseVertex(vertexData);
        /**
        * Reads the next uv coordinate.
        * @param vertexData The vertexData to contain the UV coordinates.
        */
        private parseUV(vertexData);
        /**
        * Gets the next token in the data stream.
        */
        private getNextToken();
        /**
        * Skips all whitespace in the data stream.
        */
        private skipWhiteSpace();
        /**
        * Skips to the next line.
        */
        private ignoreLine();
        /**
        * Retrieves the next single character in the data stream.
        */
        private getNextChar();
        /**
        * Retrieves the next integer in the data stream.
        */
        private getNextInt();
        /**
        * Retrieves the next floating point number in the data stream.
        */
        private getNextNumber();
        /**
        * Retrieves the next 3d vector in the data stream.
        */
        private parseVector3D();
        /**
        * Retrieves the next quaternion in the data stream.
        */
        private parseQuaternion();
        /**
        * Parses the command line data.
        */
        private parseCMD();
        /**
        * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
        * by double quotes.
        */
        private parseLiteralstring();
        /**
        * Throws an end-of-file error when a premature end of file was encountered.
        */
        private sendEOFError();
        /**
        * Throws an error when an unexpected token was encountered.
        * @param expected The token type that was actually expected.
        */
        private sendParseError(expected);
        /**
        * Throws an error when an unknown keyword was encountered.
        */
        private sendUnknownKeywordError();
    }
}
declare class VertexData {
    public index: number;
    public s: number;
    public t: number;
    public startWeight: number;
    public countWeight: number;
}
declare class JointData {
    public index: number;
    public joint: number;
    public bias: number;
    public pos: away.geom.Vector3D;
}
declare class MeshData {
    public vertexData: VertexData[];
    public weightData: JointData[];
    public indices: number[];
}
declare module away.parsers {
    class Parsers {
        /**
        * A list of all parsers that come bundled with Away3D. Use this to quickly
        * enable support for all bundled parsers to the file format auto-detection
        * feature, using any of the enableParsers() methods on loaders, e.g.:
        *
        * <code>AssetLibrary.enableParsers(Parsers.ALL_BUNDLED);</code>
        *
        * Beware however that this requires all parser classes to be included in the
        * SWF file, which will add 50-100 kb to the file. When only a limited set of
        * file formats are used, SWF file size can be saved by adding the parsers
        * individually using AssetLibrary.enableParser()
        *
        * A third way is to specify a parser for each loaded file, thereby bypassing
        * the auto-detection mechanisms altogether, while at the same time allowing
        * any properties that are unique to that parser to be set for that load.
        *
        * The bundled parsers are:
        *
        * <ul>
        * <li>AC3D (.ac)</li>
        * <li>Away Data version 1 ASCII and version 2 binary (.awd). AWD1 BSP unsupported</li>
        * <li>3DMax (.3ds)</li>
        * <li>DXF (.dxf)</li>
        * <li>Quake 2 MD2 models (.md2)</li>
        * <li>Doom 3 MD5 animation clips (.md5anim)</li>
        * <li>Doom 3 MD5 meshes (.md5mesh)</li>
        * <li>Wavefront OBJ (.obj)</li>
        * <li>Collada (.dae)</li>
        * <li>Images (.jpg, .png)</li>
        * </ul>
        *
        * @see away3d.loading.AssetLibrary.enableParser
        */
        static ALL_BUNDLED: Object[];
        /**
        * Short-hand function to enable all bundled parsers for auto-detection. In practice,
        * this is the same as invoking enableParsers(Parsers.ALL_BUNDLED) on any of the
        * loader classes SingleFileLoader, AssetLoader, AssetLibrary or Loader3D.
        *
        * See notes about file size in the documentation for the ALL_BUNDLED constant.
        *
        * @see away.parsers.parsers.Parsers.ALL_BUNDLED
        */
        static enableAllBundled(): void;
    }
}
declare module away.commands {
    /**
    *  Class Merge merges two or more static meshes into one.<code>Merge</code>
    */
    class Merge {
        private _objectSpace;
        private _keepMaterial;
        private _disposeSources;
        private _geomVOs;
        private _toDispose;
        /**
        * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier mesh material information or keeps its source material(s). Defaults to false.
        * If false and receiver object has multiple materials, the last material found in receiver submeshes is applied to the merged submesh(es).
        * @param    disposeSources  [optional]    Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
        * If true, only receiver geometry and resulting mesh are kept in  memory.
        * @param    objectSpace     [optional]    Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
        */
        constructor(keepMaterial?: boolean, disposeSources?: boolean, objectSpace?: boolean);
        /**
        * Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
        */
        public disposeSources : boolean;
        /**
        * Determines if the material source(s) used for the merging are disposed. Defaults to false.
        */
        public keepMaterial : boolean;
        /**
        * Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
        */
        public objectSpace : boolean;
        /**
        * Merges all the children of a container into a single Mesh. If no Mesh object is found, method returns the receiver without modification.
        *
        * @param    receiver           The Mesh to receive the merged contents of the container.
        * @param    objectContainer    The DisplayObjectContainer holding the meshes to be mergd.
        *
        * @return The merged Mesh instance.
        */
        public applyToContainer(receiver: entities.Mesh, objectContainer: containers.DisplayObjectContainer): void;
        /**
        * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
        *
        * @param    receiver    The Mesh to receive the merged contents of the meshes.
        * @param    meshes      A series of Meshes to be merged with the reciever mesh.
        */
        public applyToMeshes(receiver: entities.Mesh, meshes: entities.Mesh[]): void;
        /**
        *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
        *
        * @param    receiver    The Mesh to receive the merged contents of both meshes.
        * @param    mesh        The Mesh to be merged with the receiver mesh
        */
        public apply(receiver: entities.Mesh, mesh: entities.Mesh): void;
        private reset();
        private merge(destMesh, dispose);
        private collect(mesh, dispose);
        private getSubGeomData(material);
        private parseContainer(receiver, object);
    }
}
declare class GeometryVO {
    public uvs: number[];
    public vertices: number[];
    public normals: number[];
    public tangents: number[];
    public indices: number[];
    public material: away.materials.IMaterial;
}
declare module away.tools {
    /**
    * ...
    */
    class ParticleGeometryTransform {
        private _defaultVertexTransform;
        private _defaultInvVertexTransform;
        private _defaultUVTransform;
        public UVTransform : geom.Matrix;
        public vertexTransform : geom.Matrix3D;
        public invVertexTransform : geom.Matrix3D;
    }
}
declare module away.tools {
    /**
    * ...
    */
    class ParticleGeometryHelper {
        static MAX_VERTEX: number;
        static generateGeometry(geometries: base.Geometry[], transforms?: ParticleGeometryTransform[]): base.ParticleGeometry;
    }
}
declare module away {
    class StageGLRenderer extends events.EventDispatcher {
        constructor();
    }
}
