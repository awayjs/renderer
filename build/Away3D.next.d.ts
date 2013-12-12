/// <reference path="ref/webgl.d.ts" />
/// <reference path="ref/js.d.ts" />
declare module away.errors {
    class Error {
        private _errorID;
        private _messsage;
        private _name;
        constructor(message?: string, id?: number, _name?: string);
        public message : string;
        public name : string;
        public errorID : number;
    }
}
declare module away.errors {
    class ArgumentError extends errors.Error {
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    class PartialImplementationError extends errors.Error {
        constructor(dependency?: string, id?: number);
    }
}
declare module away.errors {
    class AbstractMethodError extends errors.Error {
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    class DocumentError extends errors.Error {
        static DOCUMENT_DOES_NOT_EXIST: string;
        constructor(message?: string, id?: number);
    }
}
declare module away.errors {
    class CastError extends errors.Error {
        constructor(message: string);
    }
}
declare module away.errors {
    class AnimationSetError extends errors.Error {
        constructor(message: string);
    }
}
declare module away.events {
    class Event {
        static COMPLETE: string;
        static OPEN: string;
        static ENTER_FRAME: string;
        static EXIT_FRAME: string;
        static RESIZE: string;
        static CONTEXT3D_CREATE: string;
        static ERROR: string;
        static CHANGE: string;
        public type: string;
        public target: Object;
        constructor(type: string);
        public clone(): Event;
    }
}
declare module away.events {
    class EventDispatcher {
        private listeners;
        private lFncLength;
        public addEventListener(type: string, listener: Function, target: Object): void;
        public removeEventListener(type: string, listener: Function, target: Object): void;
        public dispatchEvent(event: events.Event): void;
        private getEventListenerIndex(type, listener, target);
        public hasEventListener(type: string, listener?: Function, target?: Object): boolean;
    }
}
declare module away.events {
    interface IEventDispatcher {
        addEventListener(type: string, listener: Function, target: Object): any;
        removeEventListener(type: string, listener: Function, target: Object): any;
        dispatchEvent(event: events.Event): any;
        hasEventListener(type: string, listener?: Function, target?: Object): boolean;
    }
}
declare module away.events {
    class LightEvent extends events.Event {
        static CASTS_SHADOW_CHANGE: string;
        constructor(type: string);
        public clone(): events.Event;
    }
}
declare module away.events {
    class IOErrorEvent extends events.Event {
        static IO_ERROR: string;
        constructor(type: string);
    }
}
declare module away.events {
    class HTTPStatusEvent extends events.Event {
        static HTTP_STATUS: string;
        public status: number;
        constructor(type: string, status?: number);
    }
}
declare module away.events {
    class ProgressEvent extends events.Event {
        static PROGRESS: string;
        public bytesLoaded: number;
        public bytesTotal: number;
        constructor(type: string);
    }
}
declare module away.events {
    class LoaderEvent extends events.Event {
        static LOAD_ERROR: string;
        static RESOURCE_COMPLETE: string;
        static DEPENDENCY_COMPLETE: string;
        private _url;
        private _assets;
        private _message;
        private _isDependency;
        private _isDefaultPrevented;
        constructor(type: string, url?: string, assets?: away.library.IAsset[], isDependency?: boolean, errmsg?: string);
        public url : string;
        public assets : away.library.IAsset[];
        public message : string;
        public isDependency : boolean;
        public clone(): events.Event;
    }
}
declare module away.events {
    class CameraEvent extends events.Event {
        static LENS_CHANGED: string;
        private _camera;
        constructor(type: string, camera: away.cameras.Camera3D);
        public camera : away.cameras.Camera3D;
    }
}
declare module away.events {
    class AssetEvent extends events.Event {
        static ASSET_COMPLETE: string;
        static ENTITY_COMPLETE: string;
        static SKYBOX_COMPLETE: string;
        static CAMERA_COMPLETE: string;
        static MESH_COMPLETE: string;
        static GEOMETRY_COMPLETE: string;
        static SKELETON_COMPLETE: string;
        static SKELETON_POSE_COMPLETE: string;
        static CONTAINER_COMPLETE: string;
        static TEXTURE_COMPLETE: string;
        static TEXTURE_PROJECTOR_COMPLETE: string;
        static MATERIAL_COMPLETE: string;
        static ANIMATOR_COMPLETE: string;
        static ANIMATION_SET_COMPLETE: string;
        static ANIMATION_STATE_COMPLETE: string;
        static ANIMATION_NODE_COMPLETE: string;
        static STATE_TRANSITION_COMPLETE: string;
        static SEGMENT_SET_COMPLETE: string;
        static LIGHT_COMPLETE: string;
        static LIGHTPICKER_COMPLETE: string;
        static EFFECTMETHOD_COMPLETE: string;
        static SHADOWMAPMETHOD_COMPLETE: string;
        static ASSET_RENAME: string;
        static ASSET_CONFLICT_RESOLVED: string;
        static TEXTURE_SIZE_ERROR: string;
        private _asset;
        private _prevName;
        constructor(type: string, asset?: away.library.IAsset, prevName?: string);
        public asset : away.library.IAsset;
        public assetPrevName : string;
        public clone(): events.Event;
    }
}
declare module away.events {
    class TimerEvent extends events.Event {
        static TIMER: string;
        static TIMER_COMPLETE: string;
        constructor(type: string);
    }
}
declare module away.events {
    class ParserEvent extends events.Event {
        private _message;
        static PARSE_COMPLETE: string;
        static PARSE_ERROR: string;
        static READY_FOR_DEPENDENCIES: string;
        constructor(type: string, message?: string);
        public message : string;
        public clone(): events.Event;
    }
}
declare module away.events {
    class Scene3DEvent extends events.Event {
        static ADDED_TO_SCENE: string;
        static REMOVED_FROM_SCENE: string;
        static PARTITION_CHANGED: string;
        public objectContainer3D: away.containers.ObjectContainer3D;
        constructor(type: string, objectContainer: away.containers.ObjectContainer3D);
        public target : Object;
    }
}
declare module away.events {
    class Object3DEvent extends events.Event {
        static VISIBLITY_UPDATED: string;
        static SCENETRANSFORM_CHANGED: string;
        static SCENE_CHANGED: string;
        static POSITION_CHANGED: string;
        static ROTATION_CHANGED: string;
        static SCALE_CHANGED: string;
        public object: away.base.Object3D;
        constructor(type: string, object: away.base.Object3D);
    }
}
declare module away.events {
    class MouseEvent3D extends events.Event {
        public _iAllowedToPropagate: boolean;
        public _iParentEvent: MouseEvent3D;
        static MOUSE_OVER: string;
        static MOUSE_OUT: string;
        static MOUSE_UP: string;
        static MOUSE_DOWN: string;
        static MOUSE_MOVE: string;
        static CLICK: string;
        static DOUBLE_CLICK: string;
        static MOUSE_WHEEL: string;
        public screenX: number;
        public screenY: number;
        public view: away.containers.View3D;
        public object: away.containers.ObjectContainer3D;
        public renderable: away.base.IRenderable;
        public material: away.materials.MaterialBase;
        public uv: away.geom.Point;
        public index: number;
        public subGeometryIndex: number;
        public localPosition: away.geom.Vector3D;
        public localNormal: away.geom.Vector3D;
        public ctrlKey: boolean;
        public altKey: boolean;
        public shiftKey: boolean;
        public delta: number;
        constructor(type: string);
        public bubbles : boolean;
        public stopPropagation(): void;
        public stopImmediatePropagation(): void;
        public clone(): events.Event;
        public scenePosition : away.geom.Vector3D;
        public sceneNormal : away.geom.Vector3D;
    }
}
declare module away.events {
    class LensEvent extends events.Event {
        static MATRIX_CHANGED: string;
        private _lens;
        constructor(type: string, lens: away.cameras.LensBase);
        public lens : away.cameras.LensBase;
    }
}
declare module away.events {
    class AnimationStateEvent extends events.Event {
        static PLAYBACK_COMPLETE: string;
        static TRANSITION_COMPLETE: string;
        private _animator;
        private _animationState;
        private _animationNode;
        constructor(type: string, animator: away.animators.IAnimator, animationState: away.animators.IAnimationState, animationNode: away.animators.AnimationNodeBase);
        public animator : away.animators.IAnimator;
        public animationState : away.animators.IAnimationState;
        public animationNode : away.animators.AnimationNodeBase;
        public clone(): events.Event;
    }
}
declare module away.events {
    class AnimatorEvent extends events.Event {
        static START: string;
        static STOP: string;
        static CYCLE_COMPLETE: string;
        private _animator;
        constructor(type: string, animator: away.animators.AnimatorBase);
        public animator : away.animators.AnimatorBase;
        public clone(): events.Event;
    }
}
declare module away.events {
    class ShadingMethodEvent extends events.Event {
        static SHADER_INVALIDATED: string;
        constructor(type: string);
    }
}
declare module away.events {
    class Stage3DEvent extends events.Event {
        static CONTEXT3D_CREATED: string;
        static CONTEXT3D_DISPOSED: string;
        static CONTEXT3D_RECREATED: string;
        static VIEWPORT_UPDATED: string;
        constructor(type: string);
    }
}
declare module away.events {
    class GeometryEvent extends events.Event {
        static SUB_GEOMETRY_ADDED: string;
        static SUB_GEOMETRY_REMOVED: string;
        static BOUNDS_INVALID: string;
        private _subGeometry;
        constructor(type: string, subGeometry?: away.base.ISubGeometry);
        public subGeometry : away.base.ISubGeometry;
        public clone(): events.Event;
    }
}
declare module away.library {
    interface IAsset extends away.events.IEventDispatcher {
        name: string;
        id: string;
        assetNamespace: string;
        assetType: string;
        assetFullPath: string[];
        assetPathEquals(name: string, ns: string): boolean;
        resetAssetPath(name: string, ns: string, overrideOriginal?: boolean): void;
        dispose(): any;
    }
}
declare module away.library {
    class NamedAssetBase extends away.events.EventDispatcher implements library.IAsset {
        private _originalName;
        private _namespace;
        private _name;
        private _id;
        private _full_path;
        private _assetType;
        static DEFAULT_NAMESPACE: string;
        constructor(name?: string);
        public originalName : string;
        public id : string;
        public assetType : string;
        public name : string;
        public dispose(): void;
        public assetNamespace : string;
        public assetFullPath : string[];
        public assetPathEquals(name: string, ns: string): boolean;
        public resetAssetPath(name: string, ns?: string, overrideOriginal?: boolean): void;
        private updateFullPath();
    }
}
declare module away.library {
    class AssetType {
        static ENTITY: string;
        static SKYBOX: string;
        static CAMERA: string;
        static SEGMENT_SET: string;
        static MESH: string;
        static GEOMETRY: string;
        static SKELETON: string;
        static SKELETON_POSE: string;
        static CONTAINER: string;
        static TEXTURE: string;
        static TEXTURE_PROJECTOR: string;
        static MATERIAL: string;
        static ANIMATION_SET: string;
        static ANIMATION_STATE: string;
        static ANIMATION_NODE: string;
        static ANIMATOR: string;
        static STATE_TRANSITION: string;
        static LIGHT: string;
        static LIGHT_PICKER: string;
        static SHADOW_MAP_METHOD: string;
        static EFFECTS_METHOD: string;
    }
}
declare module away.library {
    class ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): ConflictStrategyBase;
        public _pUpdateNames(ns: string, nonConflictingName: string, oldAsset: library.IAsset, newAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
    }
}
declare module away.library {
    class NumSuffixConflictStrategy extends library.ConflictStrategyBase {
        private _separator;
        private _next_suffix;
        constructor(separator?: string);
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): library.ConflictStrategyBase;
    }
}
declare module away.library {
    class IgnoreConflictStrategy extends library.ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): library.ConflictStrategyBase;
    }
}
declare module away.library {
    class ErrorConflictStrategy extends library.ConflictStrategyBase {
        constructor();
        public resolveConflict(changedAsset: library.IAsset, oldAsset: library.IAsset, assetsDictionary: Object, precedence: string): void;
        public create(): library.ConflictStrategyBase;
    }
}
declare module away.library {
    class ConflictPrecedence {
        static FAVOR_OLD: string;
        static FAVOR_NEW: string;
    }
}
declare module away.library {
    class ConflictStrategy {
        static APPEND_NUM_SUFFIX: library.ConflictStrategyBase;
        static IGNORE: library.ConflictStrategyBase;
        static THROW_ERROR: library.ConflictStrategyBase;
    }
}
declare module away.library {
    class AssetLibraryIterator {
        private _assets;
        private _filtered;
        private _idx;
        constructor(assets: library.IAsset[], assetTypeFilter: string, namespaceFilter: string, filterFunc: any);
        public currentAsset : library.IAsset;
        public numAssets : number;
        public next(): library.IAsset;
        public reset(): void;
        public setIndex(index: number): void;
        private filter(assetTypeFilter, namespaceFilter, filterFunc);
    }
}
declare module away.library {
    class IDUtil {
        private static ALPHA_CHAR_CODES;
        static createUID(): string;
    }
}
declare module away.library {
    class AssetLibraryBundle extends away.events.EventDispatcher {
        private _loadingSessions;
        private _strategy;
        private _strategyPreference;
        private _assets;
        private _assetDictionary;
        private _assetDictDirty;
        private _loadingSessionsGarbage;
        private _gcTimeoutIID;
        constructor(me: AssetLibraryBundleSingletonEnforcer);
        static getInstance(key?: string): AssetLibraryBundle;
        public enableParser(parserClass: Object): void;
        public enableParsers(parserClasses: Object[]): void;
        public conflictStrategy : library.ConflictStrategyBase;
        public conflictPrecedence : string;
        public createIterator(assetTypeFilter?: string, namespaceFilter?: string, filterFunc?: any): library.AssetLibraryIterator;
        public load(req: away.net.URLRequest, context?: away.loaders.AssetLoaderContext, ns?: string, parser?: away.loaders.ParserBase): away.loaders.AssetLoaderToken;
        public loadData(data: any, context?: away.loaders.AssetLoaderContext, ns?: string, parser?: away.loaders.ParserBase): away.loaders.AssetLoaderToken;
        public getAsset(name: string, ns?: string): library.IAsset;
        public addAsset(asset: library.IAsset): void;
        public removeAsset(asset: library.IAsset, dispose?: boolean): void;
        public removeAssetByName(name: string, ns?: string, dispose?: boolean): library.IAsset;
        public removeAllAssets(dispose?: boolean): void;
        public removeNamespaceAssets(ns?: string, dispose?: boolean): void;
        private removeAssetFromDict(asset, autoRemoveEmptyNamespace?);
        private loadResource(req, context?, ns?, parser?);
        public stopAllLoadingSessions(): void;
        private parseResource(data, context?, ns?, parser?);
        private rehashAssetDict();
        private onDependencyRetrieved(event);
        private onDependencyRetrievingError(event);
        private onDependencyRetrievingParseError(event);
        private onAssetComplete(event);
        private onTextureSizeError(event);
        private onResourceRetrieved(event);
        private loadingSessionGC();
        private killLoadingSession(loader);
        private onAssetRename(ev);
        private onAssetConflictResolved(ev);
    }
}
declare class AssetLibraryBundleSingletonEnforcer {
}
declare module away.library {
    class AssetLibrary {
        static _iInstances: Object;
        constructor(se: AssetLibrarySingletonEnforcer);
        static getBundle(key?: string): library.AssetLibraryBundle;
        static enableParser(parserClass: any): void;
        static enableParsers(parserClasses: Object[]): void;
        static conflictStrategy : library.ConflictStrategyBase;
        static conflictPrecedence : string;
        static createIterator(assetTypeFilter?: string, namespaceFilter?: string, filterFunc?: any): library.AssetLibraryIterator;
        static load(req: away.net.URLRequest, context?: away.loaders.AssetLoaderContext, ns?: string, parser?: away.loaders.ParserBase): away.loaders.AssetLoaderToken;
        static loadData(data: any, context?: away.loaders.AssetLoaderContext, ns?: string, parser?: away.loaders.ParserBase): away.loaders.AssetLoaderToken;
        static stopLoad(): void;
        static getAsset(name: string, ns?: string): library.IAsset;
        static addEventListener(type: string, listener: Function, target: Object): void;
        static removeEventListener(type: string, listener: Function, target: Object): void;
        static addAsset(asset: library.IAsset): void;
        static removeAsset(asset: library.IAsset, dispose?: boolean): void;
        static removeAssetByName(name: string, ns?: string, dispose?: boolean): library.IAsset;
        static removeAllAssets(dispose?: boolean): void;
        static removeNamespaceAssets(ns?: string, dispose?: boolean): void;
    }
}
declare class AssetLibrarySingletonEnforcer {
}
declare module away.base {
    class Object3D extends away.library.NamedAssetBase {
        public _iController: away.controllers.ControllerBase;
        private _smallestNumber;
        private _transformDirty;
        private _positionDirty;
        private _rotationDirty;
        private _scaleDirty;
        private _positionChanged;
        private _rotationChanged;
        private _scaleChanged;
        private _rotationX;
        private _rotationY;
        private _rotationZ;
        private _eulers;
        private _flipY;
        private _listenToPositionChanged;
        private _listenToRotationChanged;
        private _listenToScaleChanged;
        private _zOffset;
        private invalidatePivot();
        private invalidatePosition();
        private notifyPositionChanged();
        public addEventListener(type: string, listener: Function, target: Object): void;
        public removeEventListener(type: string, listener: Function, target: Object): void;
        private invalidateRotation();
        private notifyRotationChanged();
        private invalidateScale();
        private notifyScaleChanged();
        public _pTransform: away.geom.Matrix3D;
        public _pScaleX: number;
        public _pScaleY: number;
        public _pScaleZ: number;
        private _x;
        private _y;
        private _z;
        private _pivotPoint;
        private _pivotZero;
        public _pPos: away.geom.Vector3D;
        private _rot;
        private _sca;
        private _transformComponents;
        public extra: Object;
        public x : number;
        public y : number;
        public z : number;
        public rotationX : number;
        public rotationY : number;
        public rotationZ : number;
        public scaleX : number;
        public scaleY : number;
        public scaleZ : number;
        public eulers : away.geom.Vector3D;
        public transform : away.geom.Matrix3D;
        public pivotPoint : away.geom.Vector3D;
        public position : away.geom.Vector3D;
        public forwardVector : away.geom.Vector3D;
        public rightVector : away.geom.Vector3D;
        public upVector : away.geom.Vector3D;
        public backVector : away.geom.Vector3D;
        public leftVector : away.geom.Vector3D;
        public downVector : away.geom.Vector3D;
        constructor();
        public scale(value: number): void;
        public moveForward(distance: number): void;
        public moveBackward(distance: number): void;
        public moveLeft(distance: number): void;
        public moveRight(distance: number): void;
        public moveUp(distance: number): void;
        public moveDown(distance: number): void;
        public moveTo(dx: number, dy: number, dz: number): void;
        public movePivot(dx: number, dy: number, dz: number): void;
        public translate(axis: away.geom.Vector3D, distance: number): void;
        public translateLocal(axis: away.geom.Vector3D, distance: number): void;
        public pitch(angle: number): void;
        public yaw(angle: number): void;
        public roll(angle: number): void;
        public clone(): Object3D;
        public rotateTo(ax: number, ay: number, az: number): void;
        public rotate(axis: away.geom.Vector3D, angle: number): void;
        public lookAt(target: away.geom.Vector3D, upAxis?: away.geom.Vector3D): void;
        public dispose(): void;
        public disposeAsset(): void;
        public iInvalidateTransform(): void;
        public pUpdateTransform(): void;
        public zOffset : number;
    }
}
declare module away.base {
    class SubMesh implements base.IRenderable {
        public _iMaterial: away.materials.MaterialBase;
        private _parentMesh;
        private _subGeometry;
        public _iIndex: number;
        private _uvTransform;
        private _uvTransformDirty;
        private _uvRotation;
        private _scaleU;
        private _scaleV;
        private _offsetU;
        private _offsetV;
        public animationSubGeometry: away.animators.AnimationSubGeometry;
        public animatorSubGeometry: away.animators.AnimationSubGeometry;
        constructor(subGeometry: base.ISubGeometry, parentMesh: away.entities.Mesh, material?: away.materials.MaterialBase);
        public shaderPickingDetails : boolean;
        public offsetU : number;
        public offsetV : number;
        public scaleU : number;
        public scaleV : number;
        public uvRotation : number;
        public sourceEntity : away.entities.Entity;
        public subGeometry : base.ISubGeometry;
        public material : away.materials.MaterialBase;
        public sceneTransform : away.geom.Matrix3D;
        public inverseSceneTransform : away.geom.Matrix3D;
        public activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        public numTriangles : number;
        public animator : away.animators.IAnimator;
        public mouseEnabled : boolean;
        public castsShadows : boolean;
        public iParentMesh : away.entities.Mesh;
        public uvTransform : away.geom.Matrix;
        private updateUVTransform();
        public dispose(): void;
        public vertexData : number[];
        public indexData : number[];
        public UVData : number[];
        public bounds : away.bounds.BoundingVolumeBase;
        public visible : boolean;
        public numVertices : number;
        public vertexStride : number;
        public UVStride : number;
        public vertexNormalData : number[];
        public vertexTangentData : number[];
        public UVOffset : number;
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public getRenderSceneTransform(camera: away.cameras.Camera3D): away.geom.Matrix3D;
    }
}
declare module away.base {
    interface IRenderable extends base.IMaterialOwner {
        sceneTransform: away.geom.Matrix3D;
        getRenderSceneTransform(camera: away.cameras.Camera3D): away.geom.Matrix3D;
        inverseSceneTransform: away.geom.Matrix3D;
        mouseEnabled: boolean;
        sourceEntity: away.entities.Entity;
        castsShadows: boolean;
        uvTransform: away.geom.Matrix;
        shaderPickingDetails: boolean;
        numVertices: number;
        numTriangles: number;
        vertexStride: number;
        activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        vertexData: number[];
        vertexNormalData: number[];
        vertexTangentData: number[];
        indexData: number[];
        UVData: number[];
    }
}
declare module away.base {
    interface IMaterialOwner {
        material: away.materials.MaterialBase;
        animator: away.animators.IAnimator;
    }
}
declare module away.base {
    class SubGeometryBase {
        static SUBGEOM_ID_COUNT: number;
        public _parentGeometry: base.Geometry;
        public _vertexData: number[];
        public _faceNormalsDirty: boolean;
        public _faceTangentsDirty: boolean;
        public _faceTangents: number[];
        public _indices: number[];
        public _indexBuffer: away.display3D.IndexBuffer3D[];
        public _numIndices: number;
        public _indexBufferContext: away.display3D.Context3D[];
        public _indicesInvalid: boolean[];
        public _numTriangles: number;
        public _autoDeriveVertexNormals: boolean;
        public _autoDeriveVertexTangents: boolean;
        public _autoGenerateUVs: boolean;
        public _useFaceWeights: boolean;
        public _vertexNormalsDirty: boolean;
        public _vertexTangentsDirty: boolean;
        public _faceNormals: number[];
        public _faceWeights: number[];
        public _scaleU: number;
        public _scaleV: number;
        public _uvsDirty: boolean;
        public _iUniqueId: number;
        constructor();
        public autoGenerateDummyUVs : boolean;
        public autoDeriveVertexNormals : boolean;
        public useFaceWeights : boolean;
        public numTriangles : number;
        public uniqueId : number;
        public getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        public pUpdateFaceTangents(): void;
        private updateFaceNormals();
        public pUpdateVertexNormals(target: number[]): number[];
        public pUpdateVertexTangents(target: number[]): number[];
        public dispose(): void;
        public indexData : number[];
        public updateIndexData(indices: number[]): void;
        public pDisposeIndexBuffers(buffers: away.display3D.IndexBuffer3D[]): void;
        public pDisposeVertexBuffers(buffers: away.display3D.VertexBuffer3D[]): void;
        public autoDeriveVertexTangents : boolean;
        public faceNormals : number[];
        public pInvalidateBuffers(invalid: boolean[]): void;
        public UVStride : number;
        public vertexData : number[];
        public vertexPositionData : number[];
        public vertexNormalData : number[];
        public vertexTangentData : number[];
        public UVData : number[];
        public vertexStride : number;
        public vertexNormalStride : number;
        public vertexTangentStride : number;
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public UVOffset : number;
        public pInvalidateBounds(): void;
        public parentGeometry : base.Geometry;
        public scaleU : number;
        public scaleV : number;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public scale(scale: number): void;
        public applyTransformation(transform: away.geom.Matrix3D): void;
        public pUpdateDummyUVs(target: number[]): number[];
    }
}
declare module away.base {
    interface ISubGeometry {
        numVertices: number;
        numTriangles: number;
        vertexStride: number;
        vertexNormalStride: number;
        vertexTangentStride: number;
        UVStride: number;
        secondaryUVStride: number;
        uniqueId: number;
        activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): any;
        getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        vertexData: number[];
        vertexNormalData: number[];
        vertexTangentData: number[];
        vertexOffset: number;
        vertexNormalOffset: number;
        vertexTangentOffset: number;
        UVOffset: number;
        secondaryUVOffset: number;
        indexData: number[];
        UVData: number[];
        applyTransformation(transform: away.geom.Matrix3D): any;
        scale(scale: number): any;
        dispose(): any;
        clone(): ISubGeometry;
        scaleU: number;
        scaleV: number;
        scaleUV(scaleU: number, scaleV: number): any;
        parentGeometry: base.Geometry;
        faceNormals: number[];
        cloneWithSeperateBuffers(): base.SubGeometry;
        autoDeriveVertexNormals: boolean;
        autoDeriveVertexTangents: boolean;
        fromVectors(vertices: number[], uvs: number[], normals: number[], tangents: number[]): any;
        vertexPositionData: number[];
    }
}
declare module away.base {
    class CompactSubGeometry extends base.SubGeometryBase implements base.ISubGeometry {
        public _pVertexDataInvalid: boolean[];
        private _vertexBuffer;
        private _bufferContext;
        public _pNumVertices: number;
        private _contextIndex;
        public _pActiveBuffer: away.display3D.VertexBuffer3D;
        private _activeContext;
        public _pActiveDataInvalid: boolean;
        private _isolatedVertexPositionData;
        private _isolatedVertexPositionDataDirty;
        constructor();
        public numVertices : number;
        public updateData(data: number[]): void;
        public activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public pUploadData(contextIndex: number): void;
        public activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public pCreateBuffer(contextIndex: number, context: away.display3D.Context3D): void;
        public pUpdateActiveBuffer(contextIndex: number): void;
        public vertexData : number[];
        public pUpdateVertexNormals(target: number[]): number[];
        public pUpdateVertexTangents(target: number[]): number[];
        public vertexNormalData : number[];
        public vertexTangentData : number[];
        public UVData : number[];
        public applyTransformation(transform: away.geom.Matrix3D): void;
        public scale(scale: number): void;
        public clone(): base.ISubGeometry;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public vertexStride : number;
        public vertexNormalStride : number;
        public vertexTangentStride : number;
        public UVStride : number;
        public secondaryUVStride : number;
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public UVOffset : number;
        public secondaryUVOffset : number;
        public dispose(): void;
        public pDisposeVertexBuffers(buffers: away.display3D.VertexBuffer3D[]): void;
        public pInvalidateBuffers(invalid: boolean[]): void;
        public cloneWithSeperateBuffers(): base.SubGeometry;
        public vertexPositionData : number[];
        public strippedUVData : number[];
        public stripBuffer(offset: number, numEntries: number): number[];
        public fromVectors(verts: number[], uvs: number[], normals: number[], tangents: number[]): void;
    }
}
declare module away.base {
    class SkinnedSubGeometry extends base.CompactSubGeometry {
        private _bufferFormat;
        private _jointWeightsData;
        private _jointIndexData;
        private _animatedData;
        private _jointWeightsBuffer;
        private _jointIndexBuffer;
        private _jointWeightsInvalid;
        private _jointIndicesInvalid;
        private _jointWeightContext;
        private _jointIndexContext;
        private _jointsPerVertex;
        private _condensedJointIndexData;
        private _condensedIndexLookUp;
        private _numCondensedJoints;
        constructor(jointsPerVertex: number);
        public condensedIndexLookUp : number[];
        public numCondensedJoints : number;
        public animatedData : number[];
        public updateAnimatedData(value: number[]): void;
        public activateJointWeightsBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateJointIndexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public pUploadData(contextIndex: number): void;
        public clone(): base.ISubGeometry;
        public dispose(): void;
        public iCondenseIndexData(): void;
        public iJointWeightsData : number[];
        public iUpdateJointWeightsData(value: number[]): void;
        public iJointIndexData : number[];
        public iUpdateJointIndexData(value: number[]): void;
    }
}
declare module away.base {
    class Geometry extends away.library.NamedAssetBase implements away.library.IAsset {
        private _subGeometries;
        public assetType : string;
        public subGeometries : base.ISubGeometry[];
        public getSubGeometries(): base.ISubGeometry[];
        constructor();
        public applyTransformation(transform: away.geom.Matrix3D): void;
        public addSubGeometry(subGeometry: base.ISubGeometry): void;
        public removeSubGeometry(subGeometry: base.ISubGeometry): void;
        public clone(): Geometry;
        public scale(scale: number): void;
        public dispose(): void;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public convertToSeparateBuffers(): void;
        public iValidate(): void;
        public iInvalidateBounds(subGeom: base.ISubGeometry): void;
    }
}
declare module away.base {
    class ParticleGeometry extends base.Geometry {
        public particles: away.animators.ParticleData[];
        public numParticles: number;
    }
}
declare module away.base {
    class SubGeometry extends base.SubGeometryBase implements base.ISubGeometry {
        private _uvs;
        private _secondaryUvs;
        private _vertexNormals;
        private _vertexTangents;
        private _verticesInvalid;
        private _uvsInvalid;
        private _secondaryUvsInvalid;
        private _normalsInvalid;
        private _tangentsInvalid;
        private _vertexBuffer;
        private _uvBuffer;
        private _secondaryUvBuffer;
        private _vertexNormalBuffer;
        private _vertexTangentBuffer;
        private _vertexBufferContext;
        private _uvBufferContext;
        private _secondaryUvBufferContext;
        private _vertexNormalBufferContext;
        private _vertexTangentBufferContext;
        private _numVertices;
        constructor();
        public numVertices : number;
        public activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public applyTransformation(transform: away.geom.Matrix3D): void;
        public clone(): base.ISubGeometry;
        public scale(scale: number): void;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public dispose(): void;
        public pDisposeAllVertexBuffers(): void;
        public vertexData : number[];
        public vertexPositionData : number[];
        public updateVertexData(vertices: number[]): void;
        public UVData : number[];
        public secondaryUVData : number[];
        public updateUVData(uvs: number[]): void;
        public updateSecondaryUVData(uvs: number[]): void;
        public vertexNormalData : number[];
        public updateVertexNormalData(vertexNormals: number[]): void;
        public vertexTangentData : number[];
        public updateVertexTangentData(vertexTangents: number[]): void;
        public fromVectors(vertices: number[], uvs: number[], normals: number[], tangents: number[]): void;
        public pUpdateVertexNormals(target: number[]): number[];
        public pUpdateVertexTangents(target: number[]): number[];
        public pUpdateDummyUVs(target: number[]): number[];
        public pDisposeForStage3D(stage3DProxy: away.managers.Stage3DProxy): void;
        public vertexStride : number;
        public vertexTangentStride : number;
        public vertexNormalStride : number;
        public UVStride : number;
        public secondaryUVStride : number;
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public UVOffset : number;
        public secondaryUVOffset : number;
        public cloneWithSeperateBuffers(): SubGeometry;
    }
}
declare module away.data {
    class RenderableListItem {
        public next: RenderableListItem;
        public renderable: away.base.IRenderable;
        public materialId: number;
        public renderOrderId: number;
        public zIndex: number;
        public renderSceneTransform: away.geom.Matrix3D;
        public cascaded: boolean;
        constructor();
    }
}
declare module away.data {
    class EntityListItem {
        public entity: away.entities.Entity;
        public next: EntityListItem;
        constructor();
    }
}
declare module away.data {
    class EntityListItemPool {
        private _pool;
        private _index;
        private _poolSize;
        constructor();
        public getItem(): data.EntityListItem;
        public freeAll(): void;
        public dispose(): void;
    }
}
declare module away.data {
    class RenderableListItemPool {
        private _pool;
        private _index;
        private _poolSize;
        constructor();
        public getItem(): data.RenderableListItem;
        public freeAll(): void;
        public dispose(): void;
    }
}
declare module away.traverse {
    class PartitionTraverser {
        public scene: away.containers.Scene3D;
        public _iEntryPoint: away.geom.Vector3D;
        static _iCollectionMark: number;
        constructor();
        public enterNode(node: away.partition.NodeBase): boolean;
        public applySkyBox(renderable: away.base.IRenderable): void;
        public applyRenderable(renderable: away.base.IRenderable): void;
        public applyUnknownLight(light: away.lights.LightBase): void;
        public applyDirectionalLight(light: away.lights.DirectionalLight): void;
        public applyPointLight(light: away.lights.PointLight): void;
        public applyLightProbe(light: away.lights.LightProbe): void;
        public applyEntity(entity: away.entities.Entity): void;
        public entryPoint : away.geom.Vector3D;
    }
}
declare module away.traverse {
    class EntityCollector extends traverse.PartitionTraverser {
        public _pSkyBox: away.base.IRenderable;
        public _pOpaqueRenderableHead: away.data.RenderableListItem;
        public _pBlendedRenderableHead: away.data.RenderableListItem;
        private _entityHead;
        public _pRenderableListItemPool: away.data.RenderableListItemPool;
        public _pEntityListItemPool: away.data.EntityListItemPool;
        public _pLights: away.lights.LightBase[];
        private _directionalLights;
        private _pointLights;
        private _lightProbes;
        public _pNumEntities: number;
        public _pNumLights: number;
        public _pNumTriangles: number;
        public _pNumMouseEnableds: number;
        public _pCamera: away.cameras.Camera3D;
        private _numDirectionalLights;
        private _numPointLights;
        private _numLightProbes;
        public _pCameraForward: away.geom.Vector3D;
        private _customCullPlanes;
        private _cullPlanes;
        private _numCullPlanes;
        constructor();
        private init();
        public camera : away.cameras.Camera3D;
        public cullPlanes : away.math.Plane3D[];
        public numMouseEnableds : number;
        public skyBox : away.base.IRenderable;
        public opaqueRenderableHead : away.data.RenderableListItem;
        public blendedRenderableHead : away.data.RenderableListItem;
        public entityHead : away.data.EntityListItem;
        public lights : away.lights.LightBase[];
        public directionalLights : away.lights.DirectionalLight[];
        public pointLights : away.lights.PointLight[];
        public lightProbes : away.lights.LightProbe[];
        public clear(): void;
        public enterNode(node: away.partition.NodeBase): boolean;
        public applySkyBox(renderable: away.base.IRenderable): void;
        public applyRenderable(renderable: away.base.IRenderable): void;
        public applyEntity(entity: away.entities.Entity): void;
        public applyUnknownLight(light: away.lights.LightBase): void;
        public applyDirectionalLight(light: away.lights.DirectionalLight): void;
        public applyPointLight(light: away.lights.PointLight): void;
        public applyLightProbe(light: away.lights.LightProbe): void;
        public cleanUp(): void;
    }
}
declare module away.traverse {
    class ShadowCasterCollector extends traverse.EntityCollector {
        constructor();
        public applyRenderable(renderable: away.base.IRenderable): void;
        public applyUnknownLight(light: away.lights.LightBase): void;
        public applyDirectionalLight(light: away.lights.DirectionalLight): void;
        public applyPointLight(light: away.lights.PointLight): void;
        public applyLightProbe(light: away.lights.LightProbe): void;
        public applySkyBox(renderable: away.base.IRenderable): void;
        public enterNode(node: away.partition.NodeBase): boolean;
    }
}
declare module away.traverse {
    class RaycastCollector extends traverse.EntityCollector {
        private _rayPosition;
        private _rayDirection;
        constructor();
        public rayPosition : away.geom.Vector3D;
        public rayDirection : away.geom.Vector3D;
        public enterNode(node: away.partition.NodeBase): boolean;
        public applySkyBox(renderable: away.base.IRenderable): void;
        public applyRenderable(renderable: away.base.IRenderable): void;
        public applyUnknownLight(light: away.lights.LightBase): void;
    }
}
declare module away.display {
    class BitmapData {
        private _imageCanvas;
        private _context;
        private _imageData;
        private _rect;
        private _transparent;
        private _alpha;
        private _locked;
        constructor(width: number, height: number, transparent?: boolean, fillColor?: number);
        public dispose(): void;
        public lock(): void;
        public unlock(): void;
        public getPixel(x: any, y: any): number;
        public setPixel(x: any, y: any, color: number): void;
        public setPixel32(x: any, y: any, color: number): void;
        public setVector(rect: away.geom.Rectangle, inputVector: number[]): void;
        public drawImage(img: BitmapData, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        public drawImage(img: HTMLImageElement, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        private _drawImage(img, sourceRect, destRect);
        public copyPixels(bmpd: BitmapData, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        public copyPixels(bmpd: HTMLImageElement, sourceRect: away.geom.Rectangle, destRect: away.geom.Rectangle): any;
        private _copyPixels(bmpd, sourceRect, destRect);
        public fillRect(rect: away.geom.Rectangle, color: number): void;
        public draw(source: BitmapData, matrix?: away.geom.Matrix): any;
        public draw(source: HTMLImageElement, matrix?: away.geom.Matrix): any;
        private _draw(source, matrix);
        public copyChannel(sourceBitmap: BitmapData, sourceRect: away.geom.Rectangle, destPoint: away.geom.Point, sourceChannel: number, destChannel: number): void;
        public colorTransform(rect: away.geom.Rectangle, colorTransform: away.geom.ColorTransform): void;
        public imageData : ImageData;
        public width : number;
        public height : number;
        public rect : away.geom.Rectangle;
        public canvas : HTMLCanvasElement;
        public context : CanvasRenderingContext2D;
        private hexToRGBACSS(d);
    }
}
declare module away.display {
    class BitmapDataChannel {
        static ALPHA: number;
        static BLUE: number;
        static GREEN: number;
        static RED: number;
    }
}
declare module away.display {
    class BlendMode {
        static ADD: string;
        static ALPHA: string;
        static DARKEN: string;
        static DIFFERENCE: string;
        static ERASE: string;
        static HARDLIGHT: string;
        static INVERT: string;
        static LAYER: string;
        static LIGHTEN: string;
        static MULTIPLY: string;
        static NORMAL: string;
        static OVERLAY: string;
        static SCREEN: string;
        static SHADER: string;
        static SUBTRACT: string;
    }
}
declare module away.display {
    class Stage3D extends away.events.EventDispatcher {
        private _context3D;
        private _canvas;
        private _width;
        private _height;
        private _x;
        private _y;
        constructor(canvas: HTMLCanvasElement);
        public requestContext(aglslContext?: boolean): void;
        public width : number;
        public height : number;
        public x : number;
        public y : number;
        public visible : boolean;
        public canvas : HTMLCanvasElement;
        public context3D : away.display3D.Context3D;
    }
}
declare module away.display {
    class Stage extends away.events.EventDispatcher {
        private static STAGE3D_MAX_QUANTITY;
        public stage3Ds: display.Stage3D[];
        private _stageHeight;
        private _stageWidth;
        constructor(width?: number, height?: number);
        public resize(width: number, height: number): void;
        public getStage3DAt(index: number): display.Stage3D;
        public initStage3DObjects(): void;
        private onContextCreated(e);
        private createHTMLCanvasElement();
        private addChildHTMLElement(canvas);
        public stageWidth : number;
        public stageHeight : number;
        public rect : away.geom.Rectangle;
    }
}
declare module away.display3D {
    class Context3DClearMask {
        static COLOR: number;
        static DEPTH: number;
        static STENCIL: number;
        static ALL: number;
    }
}
declare module away.display3D {
    class VertexBuffer3D {
        private _gl;
        private _numVertices;
        private _data32PerVertex;
        private _buffer;
        constructor(gl: WebGLRenderingContext, numVertices: number, data32PerVertex: number);
        public uploadFromArray(vertices: number[], startVertex: number, numVertices: number): void;
        public numVertices : number;
        public data32PerVertex : number;
        public glBuffer : WebGLBuffer;
        public dispose(): void;
    }
}
declare module away.display3D {
    class IndexBuffer3D {
        private _gl;
        private _numIndices;
        private _buffer;
        constructor(gl: WebGLRenderingContext, numIndices: number);
        public uploadFromArray(data: number[], startOffset: number, count: number): void;
        public dispose(): void;
        public numIndices : number;
        public glBuffer : WebGLBuffer;
    }
}
declare module away.display3D {
    class Program3D {
        private _gl;
        private _program;
        private _vertexShader;
        private _fragmentShader;
        constructor(gl: WebGLRenderingContext);
        public upload(vertexProgram: string, fragmentProgram: string): any;
        public dispose(): void;
        public focusProgram(): void;
        public glProgram : WebGLProgram;
    }
}
declare module away.display3D {
    class SamplerState {
        public wrap: number;
        public filter: number;
        public mipfilter: number;
    }
}
declare module away.display3D {
    class Context3DTextureFormat {
        static BGRA: string;
        static BGRA_PACKED: string;
        static BGR_PACKED: string;
        static COMPRESSED: string;
        static COMPRESSED_ALPHA: string;
    }
}
declare module away.display3D {
    class TextureBase {
        public textureType: string;
        public _gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext);
        public dispose(): void;
    }
}
declare module away.display3D {
    class Texture extends display3D.TextureBase {
        public textureType: string;
        private _width;
        private _height;
        private _frameBuffer;
        private _glTexture;
        constructor(gl: WebGLRenderingContext, width: number, height: number);
        public dispose(): void;
        public width : number;
        public height : number;
        public frameBuffer : WebGLFramebuffer;
        public uploadFromHTMLImageElement(image: HTMLImageElement, miplevel?: number): void;
        public uploadFromBitmapData(data: away.display.BitmapData, miplevel?: number): void;
        public glTexture : WebGLTexture;
        public generateFromRenderBuffer(data: away.display.BitmapData): void;
        public generateMipmaps(): void;
    }
}
declare module away.display3D {
    class CubeTexture extends display3D.TextureBase {
        public textureType: string;
        private _texture;
        private _size;
        constructor(gl: WebGLRenderingContext, size: number);
        public dispose(): void;
        public uploadFromHTMLImageElement(image: HTMLImageElement, side: number, miplevel?: number): void;
        public uploadFromBitmapData(data: away.display.BitmapData, side: number, miplevel?: number): void;
        public size : number;
        public glTexture : WebGLTexture;
    }
}
declare module away.display3D {
    class Context3DTriangleFace {
        static BACK: string;
        static FRONT: string;
        static FRONT_AND_BACK: string;
        static NONE: string;
    }
}
declare module away.display3D {
    class Context3DVertexBufferFormat {
        static BYTES_4: string;
        static FLOAT_1: string;
        static FLOAT_2: string;
        static FLOAT_3: string;
        static FLOAT_4: string;
    }
}
declare module away.display3D {
    class Context3DProgramType {
        static FRAGMENT: string;
        static VERTEX: string;
    }
}
declare module away.display3D {
    class Context3DBlendFactor {
        static DESTINATION_ALPHA: string;
        static DESTINATION_COLOR: string;
        static ONE: string;
        static ONE_MINUS_DESTINATION_ALPHA: string;
        static ONE_MINUS_DESTINATION_COLOR: string;
        static ONE_MINUS_SOURCE_ALPHA: string;
        static ONE_MINUS_SOURCE_COLOR: string;
        static SOURCE_ALPHA: string;
        static SOURCE_COLOR: string;
        static ZERO: string;
    }
}
declare module away.display3D {
    class Context3DCompareMode {
        static ALWAYS: string;
        static EQUAL: string;
        static GREATER: string;
        static GREATER_EQUAL: string;
        static LESS: string;
        static LESS_EQUAL: string;
        static NEVER: string;
        static NOT_EQUAL: string;
    }
}
declare module away.display3D {
    class Context3DMipFilter {
        static MIPLINEAR: string;
        static MIPNEAREST: string;
        static MIPNONE: string;
    }
}
declare module away.display3D {
    class Context3DProfile {
        static BASELINE: string;
        static BASELINE_CONSTRAINED: string;
        static BASELINE_EXTENDED: string;
    }
}
declare module away.display3D {
    class Context3DStencilAction {
        static DECREMENT_SATURATE: string;
        static DECREMENT_WRAP: string;
        static INCREMENT_SATURATE: string;
        static INCREMENT_WRAP: string;
        static INVERT: string;
        static KEEP: string;
        static SET: string;
        static ZERO: string;
    }
}
declare module away.display3D {
    class Context3DTextureFilter {
        static LINEAR: string;
        static NEAREST: string;
    }
}
declare module away.display3D {
    class Context3DWrapMode {
        static CLAMP: string;
        static REPEAT: string;
    }
}
declare module away.display3D {
    class Context3D {
        private _drawing;
        private _blendEnabled;
        private _blendSourceFactor;
        private _blendDestinationFactor;
        private _currentWrap;
        private _currentFilter;
        private _currentMipFilter;
        private _indexBufferList;
        private _vertexBufferList;
        private _textureList;
        private _programList;
        private _samplerStates;
        static MAX_SAMPLERS: number;
        public _gl: WebGLRenderingContext;
        public _currentProgram: display3D.Program3D;
        constructor(canvas: HTMLCanvasElement);
        public gl(): WebGLRenderingContext;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createCubeTexture(size: number, format: display3D.Context3DTextureFormat, optimizeForRenderToTexture: boolean, streamingLevels?: number): display3D.CubeTexture;
        public createIndexBuffer(numIndices: number): display3D.IndexBuffer3D;
        public createProgram(): display3D.Program3D;
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): display3D.Texture;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): display3D.VertexBuffer3D;
        public dispose(): void;
        public drawToBitmapData(destination: away.display.BitmapData): void;
        public drawTriangles(indexBuffer: display3D.IndexBuffer3D, firstIndex?: number, numTriangles?: number): void;
        public present(): void;
        public setBlendFactors(sourceFactor: string, destinationFactor: string): void;
        public setColorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
        public setCulling(triangleFaceToCull: string): void;
        public setDepthTest(depthMask: boolean, passCompareMode: string): void;
        public setProgram(program3D: display3D.Program3D): void;
        private getUniformLocationNameFromAgalRegisterIndex(programType, firstRegister);
        public setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: away.geom.Matrix3D, transposedMatrix?: boolean): void;
        static modulo: number;
        public setProgramConstantsFromArray(programType: string, firstRegister: number, data: number[], numRegisters?: number): void;
        public setGLSLProgramConstantsFromMatrix(locationName: string, matrix: away.geom.Matrix3D, transposedMatrix?: boolean): void;
        public setGLSLProgramConstantsFromArray(locationName: string, data: number[], startIndex?: number): void;
        public setScissorRectangle(rectangle: away.geom.Rectangle): void;
        public setTextureAt(sampler: number, texture: display3D.TextureBase): void;
        public setGLSLTextureAt(locationName: string, texture: display3D.TextureBase, textureIndex: number): void;
        public setSamplerStateAt(sampler: number, wrap: string, filter: string, mipfilter: string): void;
        public setVertexBufferAt(index: number, buffer: display3D.VertexBuffer3D, bufferOffset?: number, format?: string): void;
        public setGLSLVertexBufferAt(locationName: any, buffer: display3D.VertexBuffer3D, bufferOffset?: number, format?: string): void;
        public setRenderToTexture(target: display3D.TextureBase, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number): void;
        public setRenderToBackBuffer(): void;
        private updateBlendStatus();
    }
}
declare module away.display3D {
    class AGLSLContext3D extends display3D.Context3D {
        private _yFlip;
        constructor(canvas: HTMLCanvasElement);
        public setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: away.geom.Matrix3D, transposedMatrix?: boolean): void;
        public drawTriangles(indexBuffer: display3D.IndexBuffer3D, firstIndex?: number, numTriangles?: number): void;
        public setCulling(triangleFaceToCull: string): void;
    }
}
declare module away.geom {
    class ColorTransform {
        public alphaMultiplier: number;
        public alphaOffset: number;
        public blueMultiplier: number;
        public blueOffset: number;
        public greenMultiplier: number;
        public greenOffset: number;
        public redMultiplier: number;
        public redOffset: number;
        constructor(inRedMultiplier?: number, inGreenMultiplier?: number, inBlueMultiplier?: number, inAlphaMultiplier?: number, inRedOffset?: number, inGreenOffset?: number, inBlueOffset?: number, inAlphaOffset?: number);
        public concat(second: ColorTransform): void;
        public color : number;
    }
}
declare module away.geom {
    class Matrix {
        public a: number;
        public b: number;
        public c: number;
        public d: number;
        public tx: number;
        public ty: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        public clone(): Matrix;
        public concat(m: Matrix): void;
        public copyColumnFrom(column: number, vector3D: geom.Vector3D): void;
        public copyColumnTo(column: number, vector3D: geom.Vector3D): void;
        public copyFrom(other: Matrix): void;
        public copyRowFrom(row: number, vector3D: geom.Vector3D): void;
        public copyRowTo(row: number, vector3D: geom.Vector3D): void;
        public createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        public createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        public deltaTransformPoint(point: geom.Point): geom.Point;
        public identity(): void;
        public invert(): Matrix;
        public mult(m: Matrix): Matrix;
        public rotate(angle: number): void;
        public scale(x: number, y: number): void;
        public setRotation(angle: number, scale?: number): void;
        public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        public toString(): string;
        public transformPoint(point: geom.Point): geom.Point;
        public translate(x: number, y: number): void;
    }
}
declare module away.geom {
    class Matrix3D {
        public rawData: number[];
        constructor(v?: number[]);
        public append(lhs: Matrix3D): void;
        public appendRotation(degrees: number, axis: geom.Vector3D): void;
        public appendScale(xScale: number, yScale: number, zScale: number): void;
        public appendTranslation(x: number, y: number, z: number): void;
        public clone(): Matrix3D;
        public copyColumnFrom(column: number, vector3D: geom.Vector3D): void;
        public copyColumnTo(column: number, vector3D: geom.Vector3D): void;
        public copyFrom(sourceMatrix3D: Matrix3D): void;
        public copyRawDataFrom(vector: number[], index?: number, transpose?: boolean): void;
        public copyRawDataTo(vector: number[], index?: number, transpose?: boolean): void;
        public copyRowFrom(row: number, vector3D: geom.Vector3D): void;
        public copyRowTo(row: number, vector3D: geom.Vector3D): void;
        public copyToMatrix3D(dest: Matrix3D): void;
        public decompose(orientationStyle?: string): geom.Vector3D[];
        public deltaTransformVector(v: geom.Vector3D): geom.Vector3D;
        public identity(): void;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        public interpolateTo(toMat: Matrix3D, percent: number): void;
        public invert(): boolean;
        public prepend(rhs: Matrix3D): void;
        public prependRotation(degrees: number, axis: geom.Vector3D): void;
        public prependScale(xScale: number, yScale: number, zScale: number): void;
        public prependTranslation(x: number, y: number, z: number): void;
        public recompose(components: geom.Vector3D[]): boolean;
        public transformVector(v: geom.Vector3D): geom.Vector3D;
        public transformVectors(vin: number[], vout: number[]): void;
        public transpose(): void;
        static getAxisRotation(x: number, y: number, z: number, degrees: number): Matrix3D;
        public determinant : number;
        public position : geom.Vector3D;
    }
}
declare module away.geom {
    class Orientation3D {
        static AXIS_ANGLE: string;
        static EULER_ANGLES: string;
        static QUATERNION: string;
    }
}
declare module away.geom {
    class Point {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
    }
}
declare module away.geom {
    class Rectangle {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        public left : number;
        public right : number;
        public top : number;
        public bottom : number;
        public topLeft : geom.Point;
        public bottomRight : geom.Point;
        public clone(): Rectangle;
    }
}
declare module away.geom {
    class Vector3D {
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        public length : number;
        public lengthSquared : number;
        public add(a: Vector3D): Vector3D;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        public clone(): Vector3D;
        public copyFrom(src: Vector3D): void;
        public crossProduct(a: Vector3D): Vector3D;
        public decrementBy(a: Vector3D): void;
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        public dotProduct(a: Vector3D): number;
        public equals(cmp: Vector3D, allFour?: boolean): boolean;
        public incrementBy(a: Vector3D): void;
        public nearEquals(cmp: Vector3D, epsilon: number, allFour?: boolean): boolean;
        public negate(): void;
        public normalize(): void;
        public project(): void;
        public scaleBy(s: number): void;
        public setTo(xa: number, ya: number, za: number): void;
        public subtract(a: Vector3D): Vector3D;
        public toString(): string;
    }
}
declare module away.math {
    class MathConsts {
        static RADIANS_TO_DEGREES: number;
        static DEGREES_TO_RADIANS: number;
    }
}
declare module away.math {
    class Quaternion {
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        public magnitude : number;
        public multiply(qa: Quaternion, qb: Quaternion): void;
        public multiplyVector(vector: away.geom.Vector3D, target?: Quaternion): Quaternion;
        public fromAxisAngle(axis: away.geom.Vector3D, angle: number): void;
        public slerp(qa: Quaternion, qb: Quaternion, t: number): void;
        public lerp(qa: Quaternion, qb: Quaternion, t: number): void;
        public fromEulerAngles(ax: number, ay: number, az: number): void;
        public toEulerAngles(target?: away.geom.Vector3D): away.geom.Vector3D;
        public normalize(val?: number): void;
        public toString(): string;
        public toMatrix3D(target?: away.geom.Matrix3D): away.geom.Matrix3D;
        public fromMatrix(matrix: away.geom.Matrix3D): void;
        public toRawData(target: number[], exclude4thRow?: boolean): void;
        public clone(): Quaternion;
        public rotatePoint(vector: away.geom.Vector3D, target?: away.geom.Vector3D): away.geom.Vector3D;
        public copyFrom(q: Quaternion): void;
    }
}
declare module away.math {
    class PlaneClassification {
        static BACK: number;
        static FRONT: number;
        static IN: number;
        static OUT: number;
        static INTERSECT: number;
    }
}
declare module away.math {
    class Plane3D {
        public a: number;
        public b: number;
        public c: number;
        public d: number;
        public _iAlignment: number;
        static ALIGN_ANY: number;
        static ALIGN_XY_AXIS: number;
        static ALIGN_YZ_AXIS: number;
        static ALIGN_XZ_AXIS: number;
        constructor(a?: number, b?: number, c?: number, d?: number);
        public fromPoints(p0: away.geom.Vector3D, p1: away.geom.Vector3D, p2: away.geom.Vector3D): void;
        public fromNormalAndPoint(normal: away.geom.Vector3D, point: away.geom.Vector3D): void;
        public normalize(): Plane3D;
        public distance(p: away.geom.Vector3D): number;
        public classifyPoint(p: away.geom.Vector3D, epsilon?: number): number;
        public toString(): string;
    }
}
declare module away.math {
    class Matrix3DUtils {
        static RAW_DATA_CONTAINER: number[];
        static CALCULATION_MATRIX: away.geom.Matrix3D;
        static quaternion2matrix(quarternion: math.Quaternion, m?: away.geom.Matrix3D): away.geom.Matrix3D;
        static getForward(m: away.geom.Matrix3D, v?: away.geom.Vector3D): away.geom.Vector3D;
        static getUp(m: away.geom.Matrix3D, v?: away.geom.Vector3D): away.geom.Vector3D;
        static getRight(m: away.geom.Matrix3D, v?: away.geom.Vector3D): away.geom.Vector3D;
        static compare(m1: away.geom.Matrix3D, m2: away.geom.Matrix3D): boolean;
        static lookAt(matrix: away.geom.Matrix3D, pos: away.geom.Vector3D, dir: away.geom.Vector3D, up: away.geom.Vector3D): void;
        static reflection(plane: math.Plane3D, target?: away.geom.Matrix3D): away.geom.Matrix3D;
    }
}
declare module away.math {
    class PoissonLookup {
        static _distributions: number[][];
        static initDistributions(): void;
        static getDistribution(n: number): number[];
    }
}
declare module away.net {
    class URLRequest {
        public data: any;
        public method: string;
        public async: boolean;
        private _url;
        constructor(url?: string);
        public url : string;
        public dispose(): void;
    }
}
declare module away.net {
    class IMGLoader extends away.events.EventDispatcher {
        private _image;
        private _request;
        private _name;
        private _loaded;
        private _crossOrigin;
        constructor(imageName?: string);
        public load(request: net.URLRequest): void;
        public dispose(): void;
        public image : HTMLImageElement;
        public loaded : boolean;
        public crossOrigin : string;
        public width : number;
        public height : number;
        public request : net.URLRequest;
        public name : string;
        private initImage();
        private onAbort(event);
        private onError(event);
        private onLoadComplete(event);
    }
}
declare module away.net {
    class URLLoaderDataFormat {
        static TEXT: string;
        static VARIABLES: string;
        static BLOB: string;
        static ARRAY_BUFFER: string;
        static BINARY: string;
    }
}
declare module away.net {
    class URLRequestMethod {
        static POST: string;
        static GET: string;
    }
}
declare module away.net {
    class URLLoader extends away.events.EventDispatcher {
        private _XHR;
        private _bytesLoaded;
        private _bytesTotal;
        private _data;
        private _dataFormat;
        private _request;
        private _loadError;
        constructor();
        public load(request: net.URLRequest): void;
        public close(): void;
        public dispose(): void;
        public dataFormat : string;
        public data : any;
        public bytesLoaded : number;
        public bytesTotal : number;
        public request : net.URLRequest;
        private setResponseType(xhr, responseType);
        private getRequest(request);
        private postRequest(request);
        private handleXmlHttpRequestException(error);
        private initXHR();
        private disposeXHR();
        public decodeURLVariables(source: string): Object;
        private onReadyStateChange(event);
        private onLoadEnd(event);
        private onTimeOut(event);
        private onAbort(event);
        private onProgress(event);
        private onLoadStart(event);
        private onLoadComplete(event);
        private onLoadError(event);
    }
}
declare module away.net {
    class URLVariables {
        private _variables;
        constructor(source?: string);
        public decode(source: string): void;
        public toString(): string;
        public variables : Object;
        public formData : FormData;
    }
}
declare module away.partition {
    class NodeBase {
        public _iParent: NodeBase;
        public _pChildNodes: NodeBase[];
        public _pNumChildNodes: number;
        public _pDebugPrimitive: away.primitives.WireframePrimitiveBase;
        public _iNumEntities: number;
        public _iCollectionMark: number;
        constructor();
        public showDebugBounds : boolean;
        public parent : NodeBase;
        public iAddNode(node: NodeBase): void;
        public iRemoveNode(node: NodeBase): void;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
        public isIntersectingRay(rayPosition: away.geom.Vector3D, rayDirection: away.geom.Vector3D): boolean;
        public isCastingShadow(): boolean;
        public findPartitionForEntity(entity: away.entities.Entity): NodeBase;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public pCreateDebugBounds(): away.primitives.WireframePrimitiveBase;
        public _pNumEntities : number;
        public _pUpdateNumEntities(value: number): void;
    }
}
declare module away.partition {
    class NullNode {
        constructor();
    }
}
declare module away.partition {
    class Partition3D {
        public _rootNode: partition.NodeBase;
        private _updatesMade;
        private _updateQueue;
        constructor(rootNode: partition.NodeBase);
        public showDebugBounds : boolean;
        public traverse(traverser: away.traverse.PartitionTraverser): void;
        public iMarkForUpdate(entity: away.entities.Entity): void;
        public iRemoveEntity(entity: away.entities.Entity): void;
        private updateEntities();
    }
}
declare module away.partition {
    class EntityNode extends partition.NodeBase {
        private _entity;
        public _iUpdateQueueNext: EntityNode;
        constructor(entity: away.entities.Entity);
        public entity : away.entities.Entity;
        public removeFromParent(): void;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public isIntersectingRay(rayPosition: away.geom.Vector3D, rayDirection: away.geom.Vector3D): boolean;
    }
}
declare module away.partition {
    class CameraNode extends partition.EntityNode {
        constructor(camera: away.cameras.Camera3D);
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
    }
}
declare module away.partition {
    class LightNode extends partition.EntityNode {
        private _light;
        constructor(light: away.lights.LightBase);
        public light : away.lights.LightBase;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
    }
}
declare module away.partition {
    class DirectionalLightNode extends partition.EntityNode {
        private _light;
        constructor(light: away.lights.DirectionalLight);
        public light : away.lights.DirectionalLight;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public isCastingShadow(): boolean;
    }
}
declare module away.partition {
    class PointLightNode extends partition.EntityNode {
        private _light;
        constructor(light: away.lights.PointLight);
        public light : away.lights.PointLight;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public isCastingShadow(): boolean;
    }
}
declare module away.partition {
    class LightProbeNode extends partition.EntityNode {
        private _light;
        constructor(light: away.lights.LightProbe);
        public light : away.lights.LightProbe;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
    }
}
declare module away.partition {
    class MeshNode extends partition.EntityNode {
        private _mesh;
        constructor(mesh: away.entities.Mesh);
        public mesh : away.entities.Mesh;
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public isCastingShadow(): boolean;
    }
}
declare module away.partition {
    class SkyBoxNode extends partition.EntityNode {
        private _skyBox;
        constructor(skyBox: away.entities.SkyBox);
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
    }
}
declare module away.partition {
    class RenderableNode extends partition.EntityNode {
        private _renderable;
        constructor(renderable: away.base.IRenderable);
        public acceptTraverser(traverser: away.traverse.PartitionTraverser): void;
        public isCastingShadow(): boolean;
    }
}
declare module away.pick {
    interface IPickingCollider {
        setLocalRay(localPosition: away.geom.Vector3D, localDirection: away.geom.Vector3D): any;
        testSubMeshCollision(subMesh: away.base.SubMesh, pickingCollisionVO: pick.PickingCollisionVO, shortestCollisionDistance: number): boolean;
    }
}
declare module away.pick {
    class PickingColliderBase {
        public rayPosition: away.geom.Vector3D;
        public rayDirection: away.geom.Vector3D;
        constructor();
        public _pPetCollisionNormal(indexData: number[], vertexData: number[], triangleIndex: number): away.geom.Vector3D;
        public _pGetCollisionUV(indexData: number[], uvData: number[], triangleIndex: number, v: number, w: number, u: number, uvOffset: number, uvStride: number): away.geom.Point;
        public pGetMeshSubgeometryIndex(subGeometry: away.base.SubGeometry): number;
        public pGetMeshSubMeshIndex(subMesh: away.base.SubMesh): number;
        public setLocalRay(localPosition: away.geom.Vector3D, localDirection: away.geom.Vector3D): void;
    }
}
declare module away.pick {
    class PickingCollisionVO {
        public entity: away.entities.Entity;
        public localPosition: away.geom.Vector3D;
        public localNormal: away.geom.Vector3D;
        public uv: away.geom.Point;
        public index: number;
        public subGeometryIndex: number;
        public localRayPosition: away.geom.Vector3D;
        public localRayDirection: away.geom.Vector3D;
        public rayPosition: away.geom.Vector3D;
        public rayDirection: away.geom.Vector3D;
        public rayOriginIsInsideBounds: boolean;
        public rayEntryDistance: number;
        public renderable: away.base.IRenderable;
        constructor(entity: away.entities.Entity);
    }
}
declare module away.pick {
    class AS3PickingCollider extends pick.PickingColliderBase implements pick.IPickingCollider {
        private _findClosestCollision;
        constructor(findClosestCollision?: boolean);
        public testSubMeshCollision(subMesh: away.base.SubMesh, pickingCollisionVO: pick.PickingCollisionVO, shortestCollisionDistance: number): boolean;
    }
}
declare module away.pick {
    class PickingColliderType {
        static BOUNDS_ONLY: pick.IPickingCollider;
        static AS3_FIRST_ENCOUNTERED: pick.IPickingCollider;
        static AS3_BEST_HIT: pick.IPickingCollider;
    }
}
declare module away.pick {
    interface IPicker {
        getViewCollision(x: number, y: number, view: away.containers.View3D): pick.PickingCollisionVO;
        getSceneCollision(position: away.geom.Vector3D, direction: away.geom.Vector3D, scene: away.containers.Scene3D): pick.PickingCollisionVO;
        onlyMouseEnabled: boolean;
        dispose(): any;
    }
}
declare module away.pick {
    class ShaderPicker implements pick.IPicker {
        private _stage3DProxy;
        private _context;
        private _onlyMouseEnabled;
        private _objectProgram3D;
        private _triangleProgram3D;
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
        public onlyMouseEnabled : boolean;
        constructor();
        public getViewCollision(x: number, y: number, view: away.containers.View3D): pick.PickingCollisionVO;
        public getSceneCollision(position: away.geom.Vector3D, direction: away.geom.Vector3D, scene: away.containers.Scene3D): pick.PickingCollisionVO;
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.display3D.TextureBase): void;
        private drawRenderables(item, camera);
        private updateRay(camera);
        private initObjectProgram3D();
        private initTriangleProgram3D();
        private getHitDetails(camera);
        private getApproximatePosition(camera);
        private getPreciseDetails(camera);
        private getPrecisePosition(invSceneTransform, nx, ny, nz, px, py, pz);
        public dispose(): void;
    }
}
declare module away.pick {
    class RaycastPicker implements pick.IPicker {
        private _findClosestCollision;
        private _raycastCollector;
        private _ignoredEntities;
        private _onlyMouseEnabled;
        private _entities;
        private _numEntities;
        private _hasCollisions;
        public onlyMouseEnabled : boolean;
        constructor(findClosestCollision: boolean);
        public getViewCollision(x: number, y: number, view: away.containers.View3D): pick.PickingCollisionVO;
        public getSceneCollision(position: away.geom.Vector3D, direction: away.geom.Vector3D, scene: away.containers.Scene3D): pick.PickingCollisionVO;
        public getEntityCollision(position: away.geom.Vector3D, direction: away.geom.Vector3D, entities: away.entities.Entity[]): pick.PickingCollisionVO;
        public setIgnoreList(entities: any): void;
        private isIgnored(entity);
        private sortOnNearT(entity1, entity2);
        private getPickingCollisionVO();
        private updateLocalPosition(pickingCollisionVO);
        public dispose(): void;
    }
}
declare module away.pick {
    class PickingType {
        static SHADER: pick.IPicker;
        static RAYCAST_FIRST_ENCOUNTERED: pick.IPicker;
        static RAYCAST_BEST_HIT: pick.IPicker;
    }
}
declare module away.render {
    class RendererBase {
        public _pContext: away.display3D.Context3D;
        public _pStage3DProxy: away.managers.Stage3DProxy;
        private _backgroundR;
        private _backgroundG;
        private _backgroundB;
        private _backgroundAlpha;
        private _shareContext;
        public _pRenderTarget: away.display3D.TextureBase;
        public _pRenderTargetSurface: number;
        private _viewWidth;
        private _viewHeight;
        public _pRenderableSorter: away.sort.IEntitySorter;
        private _renderToTexture;
        private _antiAlias;
        private _textureRatioX;
        private _textureRatioY;
        private _snapshotBitmapData;
        private _snapshotRequired;
        private _clearOnRender;
        public _pRttViewProjectionMatrix: away.geom.Matrix3D;
        constructor(renderToTexture?: boolean);
        public iCreateEntityCollector(): away.traverse.EntityCollector;
        public iViewWidth : number;
        public iViewHeight : number;
        public iRenderToTexture : boolean;
        public renderableSorter : away.sort.IEntitySorter;
        public iClearOnRender : boolean;
        public iBackgroundR : number;
        public iBackgroundG : number;
        public iBackgroundB : number;
        public iStage3DProxy : away.managers.Stage3DProxy;
        public iSetStage3DProxy(value: away.managers.Stage3DProxy): void;
        public iShareContext : boolean;
        public iDispose(): void;
        public iRender(entityCollector: away.traverse.EntityCollector, target?: away.display3D.TextureBase, scissorRect?: away.geom.Rectangle, surfaceSelector?: number): void;
        public pExecuteRender(entityCollector: away.traverse.EntityCollector, target?: away.display3D.TextureBase, scissorRect?: away.geom.Rectangle, surfaceSelector?: number): void;
        public queueSnapshot(bmd: away.display.BitmapData): void;
        public pExecuteRenderToTexturePass(entityCollector: away.traverse.EntityCollector): void;
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.display3D.TextureBase): void;
        private onContextUpdate(event);
        public iBackgroundAlpha : number;
        public antiAlias : number;
        public iTextureRatioX : number;
        public iTextureRatioY : number;
    }
}
declare module away.render {
    class DepthRenderer extends render.RendererBase {
        private _activeMaterial;
        private _renderBlended;
        private _distanceBased;
        private _disableColor;
        constructor(renderBlended?: boolean, distanceBased?: boolean);
        public disableColor : boolean;
        public iRenderCascades(entityCollector: away.traverse.EntityCollector, target: away.display3D.TextureBase, numCascades: number, scissorRects: away.geom.Rectangle[], cameras: away.cameras.Camera3D[]): void;
        private drawCascadeRenderables(item, camera, cullPlanes);
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.display3D.TextureBase): void;
        private drawRenderables(item, entityCollector);
    }
}
declare module away.render {
    class DefaultRenderer extends render.RendererBase {
        private static RTT_PASSES;
        private static SCREEN_PASSES;
        private static ALL_PASSES;
        private _activeMaterial;
        private _pDistanceRenderer;
        private _pDepthRenderer;
        private _skyboxProjection;
        constructor();
        public iStage3DProxy : away.managers.Stage3DProxy;
        public pExecuteRender(entityCollector: away.traverse.EntityCollector, target?: away.display3D.TextureBase, scissorRect?: away.geom.Rectangle, surfaceSelector?: number): void;
        private updateLights(entityCollector);
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.display3D.TextureBase): void;
        private drawSkyBox(entityCollector);
        private updateSkyBoxProjection(camera);
        private drawRenderables(item, entityCollector, which);
        public iDispose(): void;
    }
}
declare module away.render {
    class Filter3DRenderer {
        private _filters;
        private _tasks;
        private _filterTasksInvalid;
        private _mainInputTexture;
        private _requireDepthRender;
        private _rttManager;
        private _stage3DProxy;
        private _filterSizesInvalid;
        constructor(stage3DProxy: away.managers.Stage3DProxy);
        private onRTTResize(event);
        public requireDepthRender : boolean;
        public getMainInputTexture(stage3DProxy: away.managers.Stage3DProxy): away.display3D.Texture;
        public filters : away.filters.Filter3DBase[];
        private updateFilterTasks(stage3DProxy);
        public render(stage3DProxy: away.managers.Stage3DProxy, camera3D: away.cameras.Camera3D, depthTexture: away.display3D.Texture): void;
        private updateFilterSizes();
        public dispose(): void;
    }
}
declare module away.sort {
    interface IEntitySorter {
        sort(collector: away.traverse.EntityCollector): any;
    }
}
declare module away.sort {
    class RenderableMergeSort implements sort.IEntitySorter {
        constructor();
        public sort(collector: away.traverse.EntityCollector): void;
        private mergeSortByDepth(head);
        private mergeSortByMaterial(head);
    }
}
declare module away.ui {
    class Keyboard {
        static A: number;
        static ALTERNATE: number;
        static AUDIO: number;
        static B: number;
        static BACK: number;
        static BACKQUOTE: number;
        static BACKSLASH: number;
        static BACKSPACE: number;
        static BLUE: number;
        static C: number;
        static CAPS_LOCK: number;
        static CHANNEL_DOWN: number;
        static CHANNEL_UP: number;
        static COMMA: number;
        static COMMAND: number;
        static CONTROL: number;
        static CharCodeStrings: any[];
        static D: number;
        static DELETE: number;
        static DOWN: number;
        static DVR: number;
        static E: number;
        static END: number;
        static ENTER: number;
        static EQUAL: number;
        static ESCAPE: number;
        static EXIT: number;
        static F: number;
        static F1: number;
        static F10: number;
        static F11: number;
        static F12: number;
        static F13: number;
        static F14: number;
        static F15: number;
        static F2: number;
        static F3: number;
        static F4: number;
        static F5: number;
        static F6: number;
        static F7: number;
        static F8: number;
        static F9: number;
        static FAST_FORWARD: number;
        static G: number;
        static GREEN: number;
        static GUIDE: number;
        static H: number;
        static HELP: number;
        static HOME: number;
        static I: number;
        static INFO: number;
        static INPUT: number;
        static INSERT: number;
        static J: number;
        static K: number;
        static KEYNAME_BEGIN: string;
        static KEYNAME_BREAK: string;
        static KEYNAME_CLEARDISPLAY: string;
        static KEYNAME_CLEARLINE: string;
        static KEYNAME_DELETE: string;
        static KEYNAME_DELETECHAR: string;
        static KEYNAME_DELETELINE: string;
        static KEYNAME_DOWNARROW: string;
        static KEYNAME_END: string;
        static KEYNAME_EXECUTE: string;
        static KEYNAME_F1: string;
        static KEYNAME_F10: string;
        static KEYNAME_F11: string;
        static KEYNAME_F12: string;
        static KEYNAME_F13: string;
        static KEYNAME_F14: string;
        static KEYNAME_F15: string;
        static KEYNAME_F16: string;
        static KEYNAME_F17: string;
        static KEYNAME_F18: string;
        static KEYNAME_F19: string;
        static KEYNAME_F2: string;
        static KEYNAME_F20: string;
        static KEYNAME_F21: string;
        static KEYNAME_F22: string;
        static KEYNAME_F23: string;
        static KEYNAME_F24: string;
        static KEYNAME_F25: string;
        static KEYNAME_F26: string;
        static KEYNAME_F27: string;
        static KEYNAME_F28: string;
        static KEYNAME_F29: string;
        static KEYNAME_F3: string;
        static KEYNAME_F30: string;
        static KEYNAME_F31: string;
        static KEYNAME_F32: string;
        static KEYNAME_F33: string;
        static KEYNAME_F34: string;
        static KEYNAME_F35: string;
        static KEYNAME_F4: string;
        static KEYNAME_F5: string;
        static KEYNAME_F6: string;
        static KEYNAME_F7: string;
        static KEYNAME_F8: string;
        static KEYNAME_F9: string;
        static KEYNAME_FIND: string;
        static KEYNAME_HELP: string;
        static KEYNAME_HOME: string;
        static KEYNAME_INSERT: string;
        static KEYNAME_INSERTCHAR: string;
        static KEYNAME_INSERTLINE: string;
        static KEYNAME_LEFTARROW: string;
        static KEYNAME_MENU: string;
        static KEYNAME_MODESWITCH: string;
        static KEYNAME_NEXT: string;
        static KEYNAME_PAGEDOWN: string;
        static KEYNAME_PAGEUP: string;
        static KEYNAME_PAUSE: string;
        static KEYNAME_PREV: string;
        static KEYNAME_PRINT: string;
        static KEYNAME_PRINTSCREEN: string;
        static KEYNAME_REDO: string;
        static KEYNAME_RESET: string;
        static KEYNAME_RIGHTARROW: string;
        static KEYNAME_SCROLLLOCK: string;
        static KEYNAME_SELECT: string;
        static KEYNAME_STOP: string;
        static KEYNAME_SYSREQ: string;
        static KEYNAME_SYSTEM: string;
        static KEYNAME_UNDO: string;
        static KEYNAME_UPARROW: string;
        static KEYNAME_USER: string;
        static L: number;
        static LAST: number;
        static LEFT: number;
        static LEFTBRACKET: number;
        static LIVE: number;
        static M: number;
        static MASTER_SHELL: number;
        static MENU: number;
        static MINUS: number;
        static N: number;
        static NEXT: number;
        static NUMBER_0: number;
        static NUMBER_1: number;
        static NUMBER_2: number;
        static NUMBER_3: number;
        static NUMBER_4: number;
        static NUMBER_5: number;
        static NUMBER_6: number;
        static NUMBER_7: number;
        static NUMBER_8: number;
        static NUMBER_9: number;
        static NUMPAD: number;
        static NUMPAD_0: number;
        static NUMPAD_1: number;
        static NUMPAD_2: number;
        static NUMPAD_3: number;
        static NUMPAD_4: number;
        static NUMPAD_5: number;
        static NUMPAD_6: number;
        static NUMPAD_7: number;
        static NUMPAD_8: number;
        static NUMPAD_9: number;
        static NUMPAD_ADD: number;
        static NUMPAD_DECIMAL: number;
        static NUMPAD_DIVIDE: number;
        static NUMPAD_ENTER: number;
        static NUMPAD_MULTIPLY: number;
        static NUMPAD_SUBTRACT: number;
        static O: number;
        static P: number;
        static PAGE_DOWN: number;
        static PAGE_UP: number;
        static PAUSE: number;
        static PERIOD: number;
        static PLAY: number;
        static PREVIOUS: number;
        static Q: number;
        static QUOTE: number;
        static R: number;
        static RECORD: number;
        static RED: number;
        static REWIND: number;
        static RIGHT: number;
        static RIGHTBRACKET: number;
        static S: number;
        static SEARCH: number;
        static SEMICOLON: number;
        static SETUP: number;
        static SHIFT: number;
        static SKIP_BACKWARD: number;
        static SKIP_FORWARD: number;
        static SLASH: number;
        static SPACE: number;
        static STOP: number;
        static SUBTITLE: number;
        static T: number;
        static TAB: number;
        static U: number;
        static UP: number;
        static V: number;
        static VOD: number;
        static W: number;
        static X: number;
        static Y: number;
        static YELLOW: number;
        static Z: number;
    }
}
declare module away.containers {
    class ObjectContainer3D extends away.base.Object3D {
        public _iAncestorsAllowMouseEnabled: boolean;
        public _iIsRoot: boolean;
        public _pScene: containers.Scene3D;
        public _pParent: ObjectContainer3D;
        public _pSceneTransform: away.geom.Matrix3D;
        public _pSceneTransformDirty: boolean;
        public _pExplicitPartition: away.partition.Partition3D;
        public _pImplicitPartition: away.partition.Partition3D;
        public _pMouseEnabled: boolean;
        private _sceneTransformChanged;
        private _scenechanged;
        private _children;
        private _mouseChildren;
        private _oldScene;
        private _inverseSceneTransform;
        private _inverseSceneTransformDirty;
        private _scenePosition;
        private _scenePositionDirty;
        private _explicitVisibility;
        private _implicitVisibility;
        private _listenToSceneTransformChanged;
        private _listenToSceneChanged;
        public _pIgnoreTransform: boolean;
        constructor();
        public getIgnoreTransform(): boolean;
        public setIgnoreTransform(value: boolean): void;
        public iGetImplicitPartition(): away.partition.Partition3D;
        public iSetImplicitPartition(value: away.partition.Partition3D): void;
        public _iIsVisible : boolean;
        public iSetParent(value: ObjectContainer3D): void;
        private notifySceneTransformChange();
        private notifySceneChange();
        public pUpdateMouseChildren(): void;
        public mouseEnabled : boolean;
        public iInvalidateTransform(): void;
        public pInvalidateSceneTransform(): void;
        public pUpdateSceneTransform(): void;
        public mouseChildren : boolean;
        public visible : boolean;
        public assetType : string;
        public scenePosition : away.geom.Vector3D;
        public minX : number;
        public minY : number;
        public minZ : number;
        public maxX : number;
        public maxY : number;
        public maxZ : number;
        public partition : away.partition.Partition3D;
        public sceneTransform : away.geom.Matrix3D;
        public scene : containers.Scene3D;
        public setScene(value: containers.Scene3D): void;
        public inverseSceneTransform : away.geom.Matrix3D;
        public parent : ObjectContainer3D;
        public contains(child: ObjectContainer3D): boolean;
        public addChild(child: ObjectContainer3D): ObjectContainer3D;
        public addChildren(...childarray: ObjectContainer3D[]): void;
        public removeChild(child: ObjectContainer3D): void;
        public removeChildAt(index: number): void;
        private removeChildInternal(childIndex, child);
        public getChildAt(index: number): ObjectContainer3D;
        public numChildren : number;
        public lookAt(target: away.geom.Vector3D, upAxis?: away.geom.Vector3D): void;
        public translateLocal(axis: away.geom.Vector3D, distance: number): void;
        public dispose(): void;
        public disposeWithChildren(): void;
        public clone(): away.base.Object3D;
        public rotate(axis: away.geom.Vector3D, angle: number): void;
        public updateImplicitVisibility(): void;
    }
}
declare module away.containers {
    class Scene3D extends away.events.EventDispatcher {
        public _iSceneGraphRoot: containers.ObjectContainer3D;
        private _partitions;
        constructor();
        public traversePartitions(traverser: away.traverse.PartitionTraverser): void;
        public partition : away.partition.Partition3D;
        public contains(child: containers.ObjectContainer3D): boolean;
        public addChild(child: containers.ObjectContainer3D): containers.ObjectContainer3D;
        public removeChild(child: containers.ObjectContainer3D): void;
        public removeChildAt(index: number): void;
        public getChildAt(index: number): containers.ObjectContainer3D;
        public numChildren : number;
        public iRegisterEntity(entity: away.entities.Entity): void;
        public iUnregisterEntity(entity: away.entities.Entity): void;
        public iInvalidateEntityBounds(entity: away.entities.Entity): void;
        public iRegisterPartition(entity: away.entities.Entity): void;
        public iUnregisterPartition(entity: away.entities.Entity): void;
        public iAddPartitionUnique(partition: away.partition.Partition3D): void;
    }
}
declare module away.containers {
    class View3D {
        private static sStage;
        public stage: away.display.Stage;
        public _pScene: containers.Scene3D;
        public _pCamera: away.cameras.Camera3D;
        public _pEntityCollector: away.traverse.EntityCollector;
        public _pFilter3DRenderer: away.render.Filter3DRenderer;
        public _pRequireDepthRender: boolean;
        public _pDepthRender: away.display3D.Texture;
        public _pStage3DProxy: away.managers.Stage3DProxy;
        public _pBackBufferInvalid: boolean;
        public _pRttBufferManager: away.managers.RTTBufferManager;
        public _pShareContext: boolean;
        public _pScissorRect: away.geom.Rectangle;
        public _pRenderer: away.render.RendererBase;
        private _aspectRatio;
        private _width;
        private _height;
        private _localPos;
        private _globalPos;
        private _globalPosDirty;
        private _time;
        private _deltaTime;
        private _backgroundColor;
        private _backgroundAlpha;
        private _depthRenderer;
        private _addedToStage;
        private _forceSoftware;
        private _depthTextureInvalid;
        private _antiAlias;
        private _scissorRectDirty;
        private _viewportDirty;
        private _depthPrepass;
        private _profile;
        private _layeredView;
        constructor(scene?: containers.Scene3D, camera?: away.cameras.Camera3D, renderer?: away.render.RendererBase, forceSoftware?: boolean, profile?: string);
        private onScenePartitionChanged(e);
        public stage3DProxy : away.managers.Stage3DProxy;
        public layeredView : boolean;
        public filters3d : away.filters.Filter3DBase[];
        public renderer : away.render.RendererBase;
        public backgroundColor : number;
        public backgroundAlpha : number;
        public camera : away.cameras.Camera3D;
        public scene : containers.Scene3D;
        public deltaTime : number;
        public width : number;
        public height : number;
        public x : number;
        public y : number;
        public visible : boolean;
        public canvas : HTMLCanvasElement;
        public antiAlias : number;
        public renderedFacesCount : number;
        public shareContext : boolean;
        public pUpdateBackBuffer(): void;
        public render(): void;
        public pUpdateGlobalPos(): void;
        public pUpdateTime(): void;
        public pUpdateViewSizeData(): void;
        public pRenderDepthPrepass(entityCollector: away.traverse.EntityCollector): void;
        public pRenderSceneDepthToTexture(entityCollector: away.traverse.EntityCollector): void;
        private initDepthTexture(context);
        public dispose(): void;
        public iEntityCollector : away.traverse.EntityCollector;
        private onLensChanged(event);
        private onViewportUpdated(event);
        public depthPrepass : boolean;
        private onAddedToStage();
        public project(point3d: away.geom.Vector3D): away.geom.Vector3D;
        public unproject(sX: number, sY: number, sZ: number): away.geom.Vector3D;
        public getRay(sX: number, sY: number, sZ: number): away.geom.Vector3D;
    }
}
declare module away.entities {
    class Entity extends away.containers.ObjectContainer3D {
        private _showBounds;
        private _partitionNode;
        private _boundsIsShown;
        private _shaderPickingDetails;
        public _iPickingCollisionVO: away.pick.PickingCollisionVO;
        public _iPickingCollider: away.pick.IPickingCollider;
        public _iStaticNode: boolean;
        public _pBounds: away.bounds.BoundingVolumeBase;
        public _pBoundsInvalid: boolean;
        private _worldBounds;
        private _worldBoundsInvalid;
        constructor();
        public setIgnoreTransform(value: boolean): void;
        public shaderPickingDetails : boolean;
        public staticNode : boolean;
        public pickingCollisionVO : away.pick.PickingCollisionVO;
        public iCollidesBefore(shortestCollisionDistance: number, findClosest: boolean): boolean;
        public showBounds : boolean;
        public minX : number;
        public minY : number;
        public minZ : number;
        public maxX : number;
        public maxY : number;
        public maxZ : number;
        public getBounds(): away.bounds.BoundingVolumeBase;
        public bounds : away.bounds.BoundingVolumeBase;
        public worldBounds : away.bounds.BoundingVolumeBase;
        private updateWorldBounds();
        public iSetImplicitPartition(value: away.partition.Partition3D): void;
        public scene : away.containers.Scene3D;
        public assetType : string;
        public pickingCollider : away.pick.IPickingCollider;
        public setPickingCollider(value: away.pick.IPickingCollider): void;
        public getEntityPartitionNode(): away.partition.EntityNode;
        public isIntersectingRay(rayPosition: away.geom.Vector3D, rayDirection: away.geom.Vector3D): boolean;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public pUpdateBounds(): void;
        public pInvalidateSceneTransform(): void;
        public pInvalidateBounds(): void;
        public pUpdateMouseChildren(): void;
        private notifySceneBoundsInvalid();
        private notifyPartitionAssigned();
        private notifyPartitionUnassigned();
        private addBounds();
        private removeBounds();
        public iInternalUpdate(): void;
    }
}
declare module away.entities {
    class SegmentSet extends entities.Entity implements away.base.IRenderable {
        private LIMIT;
        private _activeSubSet;
        private _subSets;
        private _subSetCount;
        private _numIndices;
        private _material;
        private _animator;
        private _hasData;
        public _pSegments: Object;
        private _indexSegments;
        constructor();
        public addSegment(segment: away.primitives.Segment): void;
        public removeSegmentByIndex(index: number, dispose?: boolean): void;
        public removeSegment(segment: away.primitives.Segment, dispose?: boolean): void;
        public removeAllSegments(): void;
        public getSegment(index: number): away.primitives.Segment;
        public segmentCount : number;
        public iSubSetCount : number;
        public iUpdateSegment(segment: away.primitives.Segment): void;
        public hasData : boolean;
        public getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        public activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        private reOrderIndices(subSetIndex, index);
        private addSubSet();
        public dispose(): void;
        public mouseEnabled : boolean;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public pUpdateBounds(): void;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public numTriangles : number;
        public sourceEntity : entities.Entity;
        public castsShadows : boolean;
        public material : away.materials.MaterialBase;
        public animator : away.animators.IAnimator;
        public uvTransform : away.geom.Matrix;
        public vertexData : number[];
        public indexData : number[];
        public UVData : number[];
        public numVertices : number;
        public vertexStride : number;
        public vertexNormalData : number[];
        public vertexTangentData : number[];
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public assetType : string;
        public getRenderSceneTransform(camera: away.cameras.Camera3D): away.geom.Matrix3D;
    }
}
declare module away.entities {
    class Mesh extends entities.Entity implements away.base.IMaterialOwner, away.library.IAsset {
        private _subMeshes;
        private _geometry;
        private _material;
        private _animator;
        private _castsShadows;
        private _shareAnimationGeometry;
        constructor(geometry: away.base.Geometry, material?: away.materials.MaterialBase);
        public bakeTransformations(): void;
        public assetType : string;
        private onGeometryBoundsInvalid(event);
        public castsShadows : boolean;
        public animator : away.animators.IAnimator;
        public geometry : away.base.Geometry;
        public material : away.materials.MaterialBase;
        public subMeshes : away.base.SubMesh[];
        public shareAnimationGeometry : boolean;
        public clearAnimationGeometry(): void;
        public dispose(): void;
        public disposeWithAnimatorAndChildren(): void;
        public clone(): Mesh;
        public pUpdateBounds(): void;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        private onSubGeometryAdded(event);
        private onSubGeometryRemoved(event);
        private addSubMesh(subGeometry);
        public getSubMeshForSubGeometry(subGeometry: away.base.SubGeometry): away.base.SubMesh;
        public iCollidesBefore(shortestCollisionDistance: number, findClosest: boolean): boolean;
    }
}
declare module away.entities {
    class SkyBox extends entities.Entity implements away.base.IRenderable {
        private _geometry;
        private _material;
        private _uvTransform;
        private _animator;
        public animator : away.animators.IAnimator;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        constructor(cubeMap: away.textures.CubeTextureBase);
        public activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        public numTriangles : number;
        public sourceEntity : entities.Entity;
        public material : away.materials.MaterialBase;
        public assetType : string;
        public pInvalidateBounds(): void;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public pUpdateBounds(): void;
        private buildGeometry(target);
        public castsShadows : boolean;
        public uvTransform : away.geom.Matrix;
        public vertexData : number[];
        public indexData : number[];
        public UVData : number[];
        public numVertices : number;
        public vertexStride : number;
        public vertexNormalData : number[];
        public vertexTangentData : number[];
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public getRenderSceneTransform(camera: away.cameras.Camera3D): away.geom.Matrix3D;
    }
}
declare module away.entities {
    class Sprite3D extends entities.Entity implements away.base.IRenderable {
        private static _geometry;
        private _material;
        private _spriteMatrix;
        private _animator;
        private _pickingSubMesh;
        private _pickingTransform;
        private _camera;
        private _width;
        private _height;
        private _castsShadows;
        constructor(material: away.materials.MaterialBase, width: number, height: number);
        public pickingCollider : away.pick.IPickingCollider;
        public width : number;
        public height : number;
        public activateVertexBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateSecondaryUVBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexNormalBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public activateVertexTangentBuffer(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public getIndexBuffer(stage3DProxy: away.managers.Stage3DProxy): away.display3D.IndexBuffer3D;
        public numTriangles : number;
        public sourceEntity : entities.Entity;
        public material : away.materials.MaterialBase;
        public animator : away.animators.IAnimator;
        public castsShadows : boolean;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public pUpdateBounds(): void;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public pUpdateTransform(): void;
        public uvTransform : away.geom.Matrix;
        public vertexData : number[];
        public indexData : number[];
        public UVData : number[];
        public numVertices : number;
        public vertexStride : number;
        public vertexNormalData : number[];
        public vertexTangentData : number[];
        public vertexOffset : number;
        public vertexNormalOffset : number;
        public vertexTangentOffset : number;
        public iCollidesBefore(shortestCollisionDistance: number, findClosest: boolean): boolean;
        public getRenderSceneTransform(camera: away.cameras.Camera3D): away.geom.Matrix3D;
    }
}
declare module away.bounds {
    class BoundingVolumeBase {
        public _pMin: away.geom.Vector3D;
        public _pMax: away.geom.Vector3D;
        public _pAabbPoints: number[];
        public _pAabbPointsDirty: boolean;
        public _pBoundingRenderable: away.primitives.WireframePrimitiveBase;
        constructor();
        public max : away.geom.Vector3D;
        public min : away.geom.Vector3D;
        public aabbPoints : number[];
        public boundingRenderable : away.primitives.WireframePrimitiveBase;
        public nullify(): void;
        public disposeRenderable(): void;
        public fromVertices(vertices: number[]): void;
        public fromGeometry(geometry: away.base.Geometry): void;
        public fromSphere(center: away.geom.Vector3D, radius: number): void;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
        public overlaps(bounds: BoundingVolumeBase): boolean;
        public clone(): BoundingVolumeBase;
        public rayIntersection(position: away.geom.Vector3D, direction: away.geom.Vector3D, targetNormal: away.geom.Vector3D): number;
        public containsPoint(position: away.geom.Vector3D): boolean;
        public pUpdateAABBPoints(): void;
        public pUpdateBoundingRenderable(): void;
        public pCreateBoundingRenderable(): away.primitives.WireframePrimitiveBase;
        public classifyToPlane(plane: away.math.Plane3D): number;
        public transformFrom(bounds: BoundingVolumeBase, matrix: away.geom.Matrix3D): void;
    }
}
declare module away.bounds {
    class NullBounds extends bounds.BoundingVolumeBase {
        private _alwaysIn;
        private _renderable;
        constructor(alwaysIn?: boolean, renderable?: away.primitives.WireframePrimitiveBase);
        public clone(): bounds.BoundingVolumeBase;
        public pCreateBoundingRenderable(): away.primitives.WireframePrimitiveBase;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
        public fromGeometry(geometry: away.base.Geometry): void;
        public fromSphere(center: away.geom.Vector3D, radius: number): void;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public classifyToPlane(plane: away.math.Plane3D): number;
        public transformFrom(bounds: bounds.BoundingVolumeBase, matrix: away.geom.Matrix3D): void;
    }
}
declare module away.bounds {
    class BoundingSphere extends bounds.BoundingVolumeBase {
        private _radius;
        private _centerX;
        private _centerY;
        private _centerZ;
        constructor();
        public radius : number;
        public nullify(): void;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
        public fromSphere(center: away.geom.Vector3D, radius: number): void;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public clone(): bounds.BoundingVolumeBase;
        public rayIntersection(position: away.geom.Vector3D, direction: away.geom.Vector3D, targetNormal: away.geom.Vector3D): number;
        public containsPoint(position: away.geom.Vector3D): boolean;
        public pUpdateBoundingRenderable(): void;
        public pCreateBoundingRenderable(): away.primitives.WireframePrimitiveBase;
        public classifyToPlane(plane: away.math.Plane3D): number;
        public transformFrom(bounds: bounds.BoundingVolumeBase, matrix: away.geom.Matrix3D): void;
    }
}
declare module away.bounds {
    class AxisAlignedBoundingBox extends bounds.BoundingVolumeBase {
        private _centerX;
        private _centerY;
        private _centerZ;
        private _halfExtentsX;
        private _halfExtentsY;
        private _halfExtentsZ;
        constructor();
        public nullify(): void;
        public isInFrustum(planes: away.math.Plane3D[], numPlanes: number): boolean;
        public rayIntersection(position: away.geom.Vector3D, direction: away.geom.Vector3D, targetNormal: away.geom.Vector3D): number;
        public containsPoint(position: away.geom.Vector3D): boolean;
        public fromExtremes(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
        public clone(): bounds.BoundingVolumeBase;
        public halfExtentsX : number;
        public halfExtentsY : number;
        public halfExtentsZ : number;
        public closestPointToPoint(point: away.geom.Vector3D, target?: away.geom.Vector3D): away.geom.Vector3D;
        public pUpdateBoundingRenderable(): void;
        public pCreateBoundingRenderable(): away.primitives.WireframePrimitiveBase;
        public classifyToPlane(plane: away.math.Plane3D): number;
        public transformFrom(bounds: bounds.BoundingVolumeBase, matrix: away.geom.Matrix3D): void;
    }
}
declare module away.cameras {
    class LensBase extends away.events.EventDispatcher {
        public _pMatrix: away.geom.Matrix3D;
        public _pScissorRect: away.geom.Rectangle;
        public _pViewPort: away.geom.Rectangle;
        public _pNear: number;
        public _pFar: number;
        public _pAspectRatio: number;
        public _pMatrixInvalid: boolean;
        public _pFrustumCorners: number[];
        private _unprojection;
        private _unprojectionInvalid;
        constructor();
        public frustumCorners : number[];
        public matrix : away.geom.Matrix3D;
        public near : number;
        public far : number;
        public project(point3d: away.geom.Vector3D): away.geom.Vector3D;
        public unprojectionMatrix : away.geom.Matrix3D;
        public unproject(nX: number, nY: number, sZ: number): away.geom.Vector3D;
        public clone(): LensBase;
        public iAspectRatio : number;
        public pInvalidateMatrix(): void;
        public pUpdateMatrix(): void;
        public iUpdateScissorRect(x: number, y: number, width: number, height: number): void;
        public iUpdateViewport(x: number, y: number, width: number, height: number): void;
    }
}
declare module away.cameras {
    class PerspectiveLens extends cameras.LensBase {
        private _fieldOfView;
        private _focalLength;
        private _focalLengthInv;
        private _yMax;
        private _xMax;
        constructor(fieldOfView?: number);
        public fieldOfView : number;
        public focalLength : number;
        public unproject(nX: number, nY: number, sZ: number): away.geom.Vector3D;
        public clone(): cameras.LensBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.cameras {
    class FreeMatrixLens extends cameras.LensBase {
        constructor();
        public near : number;
        public far : number;
        public iAspectRatio : number;
        public clone(): cameras.LensBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.cameras {
    class OrthographicLens extends cameras.LensBase {
        private _projectionHeight;
        private _xMax;
        private _yMax;
        constructor(projectionHeight?: number);
        public projectionHeight : number;
        public unproject(nX: number, nY: number, sZ: number): away.geom.Vector3D;
        public clone(): cameras.LensBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.cameras {
    class OrthographicOffCenterLens extends cameras.LensBase {
        private _minX;
        private _maxX;
        private _minY;
        private _maxY;
        constructor(minX: number, maxX: number, minY: number, maxY: number);
        public minX : number;
        public maxX : number;
        public minY : number;
        public maxY : number;
        public unproject(nX: number, nY: number, sZ: number): away.geom.Vector3D;
        public clone(): cameras.LensBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.cameras {
    class PerspectiveOffCenterLens extends cameras.LensBase {
        private _minAngleX;
        private _minLengthX;
        private _tanMinX;
        private _maxAngleX;
        private _maxLengthX;
        private _tanMaxX;
        private _minAngleY;
        private _minLengthY;
        private _tanMinY;
        private _maxAngleY;
        private _maxLengthY;
        private _tanMaxY;
        constructor(minAngleX?: number, maxAngleX?: number, minAngleY?: number, maxAngleY?: number);
        public minAngleX : number;
        public maxAngleX : number;
        public minAngleY : number;
        public maxAngleY : number;
        public unproject(nX: number, nY: number, sZ: number): away.geom.Vector3D;
        public clone(): cameras.LensBase;
        public pUpdateMatrix(): void;
    }
}
declare module away.cameras {
    class ObliqueNearPlaneLens extends cameras.LensBase {
        private _baseLens;
        private _plane;
        constructor(baseLens: cameras.LensBase, plane: away.math.Plane3D);
        public frustumCorners : number[];
        public near : number;
        public far : number;
        public iAspectRatio : number;
        public plane : away.math.Plane3D;
        public baseLens : cameras.LensBase;
        private onLensMatrixChanged(event);
        public pUpdateMatrix(): void;
    }
}
declare module away.cameras {
    class Camera3D extends away.entities.Entity {
        private _viewProjection;
        private _viewProjectionDirty;
        private _lens;
        private _frustumPlanes;
        private _frustumPlanesDirty;
        constructor(lens?: cameras.LensBase);
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public assetType : string;
        private onLensMatrixChanged(event);
        public frustumPlanes : away.math.Plane3D[];
        private updateFrustum();
        public pInvalidateSceneTransform(): void;
        public pUpdateBounds(): void;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public lens : cameras.LensBase;
        public viewProjection : away.geom.Matrix3D;
        public getRay(nX: number, nY: number, sZ: number): away.geom.Vector3D;
        public project(point3d: away.geom.Vector3D): away.geom.Vector3D;
        public unproject(nX: number, nY: number, sZ: number): away.geom.Vector3D;
    }
}
declare module away.controllers {
    class ControllerBase {
        public _pAutoUpdate: boolean;
        public _pTargetObject: away.entities.Entity;
        constructor(targetObject?: away.entities.Entity);
        public pNotifyUpdate(): void;
        public targetObject : away.entities.Entity;
        public autoUpdate : boolean;
        public update(interpolate?: boolean): void;
    }
}
declare module away.controllers {
    class LookAtController extends controllers.ControllerBase {
        public _pLookAtPosition: away.geom.Vector3D;
        public _pLookAtObject: away.containers.ObjectContainer3D;
        public _pOrigin: away.geom.Vector3D;
        constructor(targetObject?: away.entities.Entity, lookAtObject?: away.containers.ObjectContainer3D);
        public lookAtPosition : away.geom.Vector3D;
        public lookAtObject : away.containers.ObjectContainer3D;
        public update(interpolate?: boolean): void;
        private onLookAtObjectChanged(event);
    }
}
declare module away.controllers {
    class HoverController extends controllers.LookAtController {
        public _iCurrentPanAngle: number;
        public _iCurrentTiltAngle: number;
        private _panAngle;
        private _tiltAngle;
        private _distance;
        private _minPanAngle;
        private _maxPanAngle;
        private _minTiltAngle;
        private _maxTiltAngle;
        private _steps;
        private _yFactor;
        private _wrapPanAngle;
        public steps : number;
        public panAngle : number;
        public tiltAngle : number;
        public distance : number;
        public minPanAngle : number;
        public maxPanAngle : number;
        public minTiltAngle : number;
        public maxTiltAngle : number;
        public yFactor : number;
        public wrapPanAngle : boolean;
        constructor(targetObject?: away.entities.Entity, lookAtObject?: away.containers.ObjectContainer3D, panAngle?: number, tiltAngle?: number, distance?: number, minTiltAngle?: number, maxTiltAngle?: number, minPanAngle?: number, maxPanAngle?: number, steps?: number, yFactor?: number, wrapPanAngle?: boolean);
        public update(interpolate?: boolean): void;
    }
}
declare module away.controllers {
    class FirstPersonController extends controllers.ControllerBase {
        public _iCurrentPanAngle: number;
        public _iCurrentTiltAngle: number;
        private _panAngle;
        private _tiltAngle;
        private _minTiltAngle;
        private _maxTiltAngle;
        private _steps;
        private _walkIncrement;
        private _strafeIncrement;
        private _wrapPanAngle;
        public fly: boolean;
        public steps : number;
        public panAngle : number;
        public tiltAngle : number;
        public minTiltAngle : number;
        public maxTiltAngle : number;
        public wrapPanAngle : boolean;
        constructor(targetObject?: away.entities.Entity, panAngle?: number, tiltAngle?: number, minTiltAngle?: number, maxTiltAngle?: number, steps?: number, wrapPanAngle?: boolean);
        public update(interpolate?: boolean): void;
        public incrementWalk(val: number): void;
        public incrementStrafe(val: number): void;
    }
}
declare module away.controllers {
    class FollowController extends controllers.HoverController {
        constructor(targetObject?: away.entities.Entity, lookAtObject?: away.containers.ObjectContainer3D, tiltAngle?: number, distance?: number);
        public update(interpolate?: boolean): void;
    }
}
declare module away.controllers {
    class SpringController extends controllers.LookAtController {
        private _velocity;
        private _dv;
        private _stretch;
        private _force;
        private _acceleration;
        private _desiredPosition;
        public stiffness: number;
        public damping: number;
        public mass: number;
        public positionOffset: away.geom.Vector3D;
        constructor(targetObject?: away.entities.Entity, lookAtObject?: away.containers.ObjectContainer3D, stiffness?: number, mass?: number, damping?: number);
        public update(interpolate?: boolean): void;
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
        public textureScale : number;
        public target : away.display3D.Texture;
        public textureWidth : number;
        public textureHeight : number;
        public getMainInputTexture(stage: away.managers.Stage3DProxy): away.display3D.Texture;
        public dispose(): void;
        public pInvalidateProgram3D(): void;
        public pUpdateProgram3D(stage: away.managers.Stage3DProxy): void;
        public pGetVertexCode(): string;
        public pGetFragmentCode(): string;
        public pUpdateTextures(stage: away.managers.Stage3DProxy): void;
        public getProgram3D(stage3DProxy: away.managers.Stage3DProxy): away.display3D.Program3D;
        public activate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, depthTexture: away.display3D.Texture): void;
        public deactivate(stage3DProxy: away.managers.Stage3DProxy): void;
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
        public pAddTask(filter: filters.Filter3DTaskBase): void;
        public tasks : filters.Filter3DTaskBase[];
        public getMainInputTexture(stage3DProxy: away.managers.Stage3DProxy): away.display3D.Texture;
        public textureWidth : number;
        public textureHeight : number;
        public setRenderTargets(mainTarget: away.display3D.Texture, stage3DProxy: away.managers.Stage3DProxy): void;
        public dispose(): void;
        public update(stage: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
    }
}
declare module away.lights {
    class ShadowMapperBase {
        public _pCasterCollector: away.traverse.ShadowCasterCollector;
        private _depthMap;
        public _pDepthMapSize: number;
        public _pLight: lights.LightBase;
        private _explicitDepthMap;
        private _autoUpdateShadows;
        public _iShadowsInvalid: boolean;
        constructor();
        public pCreateCasterCollector(): away.traverse.ShadowCasterCollector;
        public autoUpdateShadows : boolean;
        public updateShadows(): void;
        public iSetDepthMap(depthMap: away.textures.TextureProxyBase): void;
        public light : lights.LightBase;
        public depthMap : away.textures.TextureProxyBase;
        public depthMapSize : number;
        public dispose(): void;
        public pCreateDepthTexture(): away.textures.TextureProxyBase;
        public iRenderDepthMap(stage3DProxy: away.managers.Stage3DProxy, entityCollector: away.traverse.EntityCollector, renderer: away.render.DepthRenderer): void;
        public pUpdateDepthProjection(viewCamera: away.cameras.Camera3D): void;
        public pDrawDepthMap(target: away.display3D.TextureBase, scene: away.containers.Scene3D, renderer: away.render.DepthRenderer): void;
    }
}
declare module away.lights {
    class CubeMapShadowMapper extends lights.ShadowMapperBase {
        private _depthCameras;
        private _lenses;
        private _needsRender;
        constructor();
        private initCameras();
        private addCamera(rotationX, rotationY, rotationZ);
        public pCreateDepthTexture(): away.textures.TextureProxyBase;
        public pUpdateDepthProjection(viewCamera: away.cameras.Camera3D): void;
        public pDrawDepthMap(target: away.display3D.TextureBase, scene: away.containers.Scene3D, renderer: away.render.DepthRenderer): void;
    }
}
declare module away.lights {
    class DirectionalShadowMapper extends lights.ShadowMapperBase {
        public _pOverallDepthCamera: away.cameras.Camera3D;
        public _pLocalFrustum: number[];
        public _pLightOffset: number;
        public _pMatrix: away.geom.Matrix3D;
        public _pOverallDepthLens: away.cameras.FreeMatrixLens;
        public _pSnap: number;
        public _pCullPlanes: away.math.Plane3D[];
        public _pMinZ: number;
        public _pMaxZ: number;
        constructor();
        public snap : number;
        public lightOffset : number;
        public iDepthProjection : away.geom.Matrix3D;
        public depth : number;
        public pDrawDepthMap(target: away.display3D.TextureBase, scene: away.containers.Scene3D, renderer: away.render.DepthRenderer): void;
        public pUpdateCullPlanes(viewCamera: away.cameras.Camera3D): void;
        public pUpdateDepthProjection(viewCamera: away.cameras.Camera3D): void;
        public pUpdateProjectionFromFrustumCorners(viewCamera: away.cameras.Camera3D, corners: number[], matrix: away.geom.Matrix3D): void;
    }
}
declare module away.lights {
    class LightBase extends away.entities.Entity {
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
        public pCreateShadowMapper(): lights.ShadowMapperBase;
        public specular : number;
        public diffuse : number;
        public color : number;
        public ambient : number;
        public ambientColor : number;
        private updateAmbient();
        public iGetObjectProjectionMatrix(renderable: away.base.IRenderable, target?: away.geom.Matrix3D): away.geom.Matrix3D;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public assetType : string;
        private updateSpecular();
        private updateDiffuse();
        public shadowMapper : lights.ShadowMapperBase;
    }
}
declare module away.lights {
    class PointLight extends lights.LightBase {
        public _pRadius: number;
        public _pFallOff: number;
        public _pFallOffFactor: number;
        constructor();
        public pCreateShadowMapper(): lights.ShadowMapperBase;
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public radius : number;
        public iFallOffFactor(): number;
        public fallOff : number;
        public pUpdateBounds(): void;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(renderable: away.base.IRenderable, target?: away.geom.Matrix3D): away.geom.Matrix3D;
    }
}
declare module away.lights {
    class DirectionalLight extends lights.LightBase {
        private _direction;
        private _tmpLookAt;
        private _sceneDirection;
        private _projAABBPoints;
        constructor(xDir?: number, yDir?: number, zDir?: number);
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public sceneDirection : away.geom.Vector3D;
        public direction : away.geom.Vector3D;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public pUpdateBounds(): void;
        public pUpdateSceneTransform(): void;
        public pCreateShadowMapper(): lights.ShadowMapperBase;
        public iGetObjectProjectionMatrix(renderable: away.base.IRenderable, target?: away.geom.Matrix3D): away.geom.Matrix3D;
    }
}
declare module away.lights {
    class LightProbe extends lights.LightBase {
        private _diffuseMap;
        private _specularMap;
        constructor(diffuseMap: away.textures.CubeTextureBase, specularMap?: away.textures.CubeTextureBase);
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public diffuseMap : away.textures.CubeTextureBase;
        public specularMap : away.textures.CubeTextureBase;
        public pUpdateBounds(): void;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(renderable: away.base.IRenderable, target?: away.geom.Matrix3D): away.geom.Matrix3D;
    }
}
declare module away.lights {
    class NearDirectionalShadowMapper extends lights.DirectionalShadowMapper {
        private _coverageRatio;
        constructor(coverageRatio?: number);
        public coverageRatio : number;
        public pUpdateDepthProjection(viewCamera: away.cameras.Camera3D): void;
    }
}
declare module away.managers {
    class RTTBufferManager extends away.events.EventDispatcher {
        private static _instances;
        private _renderToTextureVertexBuffer;
        private _renderToScreenVertexBuffer;
        private _indexBuffer;
        private _stage3DProxy;
        private _viewWidth;
        private _viewHeight;
        private _textureWidth;
        private _textureHeight;
        private _renderToTextureRect;
        private _buffersInvalid;
        private _textureRatioX;
        private _textureRatioY;
        constructor(se: SingletonEnforcer, stage3DProxy: managers.Stage3DProxy);
        static getInstance(stage3DProxy: managers.Stage3DProxy): RTTBufferManager;
        private static getRTTBufferManagerFromStage3DProxy(stage3DProxy);
        private static deleteRTTBufferManager(stage3DProxy);
        public textureRatioX : number;
        public textureRatioY : number;
        public viewWidth : number;
        public viewHeight : number;
        public renderToTextureVertexBuffer : away.display3D.VertexBuffer3D;
        public renderToScreenVertexBuffer : away.display3D.VertexBuffer3D;
        public indexBuffer : away.display3D.IndexBuffer3D;
        public renderToTextureRect : away.geom.Rectangle;
        public textureWidth : number;
        public textureHeight : number;
        public dispose(): void;
        private updateRTTBuffers();
    }
}
declare class RTTBufferManagerVO {
    constructor();
    public stage3dProxy: away.managers.Stage3DProxy;
    public rttbfm: away.managers.RTTBufferManager;
}
declare class SingletonEnforcer {
}
declare module away.managers {
    class Stage3DProxy extends away.events.EventDispatcher {
        public _iContext3D: away.display3D.Context3D;
        public _iStage3DIndex: number;
        private _usesSoftwareRendering;
        private _profile;
        private _stage3D;
        private _activeProgram3D;
        private _stage3DManager;
        private _backBufferWidth;
        private _backBufferHeight;
        private _antiAlias;
        private _enableDepthAndStencil;
        private _contextRequested;
        private _renderTarget;
        private _renderSurfaceSelector;
        private _scissorRect;
        private _color;
        private _backBufferDirty;
        private _viewPort;
        private _enterFrame;
        private _exitFrame;
        private _viewportUpdated;
        private _viewportDirty;
        private _bufferClear;
        private _mouse3DManager;
        private notifyViewportUpdated();
        private notifyEnterFrame();
        private notifyExitFrame();
        constructor(stage3DIndex: number, stage3D: away.display.Stage3D, stage3DManager: managers.Stage3DManager, forceSoftware?: boolean, profile?: string);
        public profile : string;
        public dispose(): void;
        public configureBackBuffer(backBufferWidth: number, backBufferHeight: number, antiAlias: number, enableDepthAndStencil: boolean): void;
        public enableDepthAndStencil : boolean;
        public renderTarget : away.display3D.TextureBase;
        public renderSurfaceSelector : number;
        public setRenderTarget(target: away.display3D.TextureBase, enableDepthAndStencil?: boolean, surfaceSelector?: number): void;
        public clear(): void;
        public present(): void;
        public addEventListener(type: string, listener: Function, target: Object): void;
        public removeEventListener(type: string, listener: Function, target: Object): void;
        public scissorRect : away.geom.Rectangle;
        public stage3DIndex : number;
        public stage3D : away.display.Stage3D;
        public context3D : away.display3D.Context3D;
        public usesSoftwareRendering : boolean;
        public x : number;
        public y : number;
        public canvas : HTMLCanvasElement;
        public width : number;
        public height : number;
        public antiAlias : number;
        public viewPort : away.geom.Rectangle;
        public color : number;
        public visible : boolean;
        public bufferClear : boolean;
        public mouse3DManager : managers.Mouse3DManager;
        private freeContext3D();
        private onContext3DUpdate(event);
        private requestContext(forceSoftware?, profile?);
        private onEnterFrame(event);
        public recoverFromDisposal(): boolean;
        public clearDepthBuffer(): void;
    }
}
declare module away.managers {
    class Mouse3DManager {
        private static _view3Ds;
        private static _view3DLookup;
        private static _viewCount;
        private _activeView;
        private _updateDirty;
        private _nullVector;
        static _pCollidingObject: away.pick.PickingCollisionVO;
        private static _previousCollidingObject;
        private static _collidingViewObjects;
        private static _queuedEvents;
        private static _mouseUp;
        private static _mouseClick;
        private static _mouseOut;
        private static _mouseDown;
        private static _mouseMove;
        private static _mouseOver;
        private static _mouseWheel;
        private static _mouseDoubleClick;
        private _forceMouseMove;
        private _mousePicker;
        private _childDepth;
        private static _previousCollidingView;
        private static _collidingView;
        private _collidingDownObject;
        private _collidingUpObject;
        constructor();
        public updateCollider(view: away.containers.View3D): void;
        public fireMouseEvents(): void;
        public addViewLayer(view: away.containers.View3D): void;
        public enableMouseListeners(view: away.containers.View3D): void;
        public disableMouseListeners(view: away.containers.View3D): void;
        public dispose(): void;
        private queueDispatch(event, sourceEvent, collider?);
        private reThrowEvent(event);
        private hasKey(view);
        private traverseDisplayObjects(container);
        private onMouseMove(event);
        private onMouseOut(event);
        private onMouseOver(event);
        private onClick(event);
        private onDoubleClick(event);
        private onMouseDown(event);
        private onMouseUp(event);
        private onMouseWheel(event);
        public forceMouseMove : boolean;
        public mousePicker : away.pick.IPicker;
    }
}
declare module away.managers {
    class Stage3DManager {
        private static _instances;
        private static _stageProxies;
        private static _numStageProxies;
        private _stage;
        constructor(stage: away.display.Stage, Stage3DManagerSingletonEnforcer: Stage3DManagerSingletonEnforcer);
        static getInstance(stage: away.display.Stage): Stage3DManager;
        private static getStage3DManagerByStageRef(stage);
        public getStage3DProxy(index: number, forceSoftware?: boolean, profile?: string): managers.Stage3DProxy;
        public iRemoveStage3DProxy(stage3DProxy: managers.Stage3DProxy): void;
        public getFreeStage3DProxy(forceSoftware?: boolean, profile?: string): managers.Stage3DProxy;
        public hasFreeStage3DProxy : boolean;
        public numProxySlotsFree : number;
        public numProxySlotsUsed : number;
        public numProxySlotsTotal : number;
    }
}
declare class Stage3DManagerInstanceData {
    public stage: away.display.Stage;
    public stage3DManager: away.managers.Stage3DManager;
}
declare class Stage3DManagerSingletonEnforcer {
}
declare module away.managers {
    class AGALProgram3DCache {
        private static _instances;
        private _stage3DProxy;
        private _program3Ds;
        private _ids;
        private _usages;
        private _keys;
        private static _currentId;
        constructor(stage3DProxy: managers.Stage3DProxy, agalProgram3DCacheSingletonEnforcer: AGALProgram3DCacheSingletonEnforcer);
        static getInstance(stage3DProxy: managers.Stage3DProxy): AGALProgram3DCache;
        static getInstanceFromIndex(index: number): AGALProgram3DCache;
        private static onContext3DDisposed(event);
        public dispose(): void;
        public setProgram3D(pass: away.materials.MaterialPassBase, vertexCode: string, fragmentCode: string): void;
        public freeProgram3D(programId: number): void;
        private destroyProgram(key);
        private getKey(vertexCode, fragmentCode);
    }
}
declare class AGALProgram3DCacheSingletonEnforcer {
}
declare module away.materials {
    class MipmapGenerator {
        private static _matrix;
        private static _rect;
        private static _source;
        static generateHTMLImageElementMipMaps(source: HTMLImageElement, target: away.display3D.TextureBase, mipmap?: away.display.BitmapData, alpha?: boolean, side?: number): void;
        static generateMipMaps(source: away.display.BitmapData, target: away.display3D.TextureBase, mipmap?: away.display.BitmapData, alpha?: boolean, side?: number): void;
    }
}
declare module away.materials {
    class MaterialPassBase extends away.events.EventDispatcher {
        static MATERIALPASS_ID_COUNT: number;
        public _iUniqueId: number;
        public _pMaterial: materials.MaterialBase;
        private _animationSet;
        public _iProgram3Ds: away.display3D.Program3D[];
        public _iProgram3Dids: number[];
        private _context3Ds;
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
        public _pLightPicker: materials.LightPickerBase;
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
        public animationRegisterCache: away.animators.AnimationRegisterCache;
        constructor(renderToTexture?: boolean);
        public material : materials.MaterialBase;
        public writeDepth : boolean;
        public mipmap : boolean;
        public setMipMap(value: boolean): void;
        public smooth : boolean;
        public repeat : boolean;
        public bothSides : boolean;
        public depthCompareMode : string;
        public animationSet : away.animators.IAnimationSet;
        public renderToTexture : boolean;
        public dispose(): void;
        public numUsedStreams : number;
        public numUsedVertexConstants : number;
        public numUsedVaryings : number;
        public numUsedFragmentConstants : number;
        public needFragmentAnimation : boolean;
        public needUVAnimation : boolean;
        public iUpdateAnimationState(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iGetVertexCode(): string;
        public iGetFragmentCode(fragmentAnimatorCode: string): string;
        public setBlendMode(value: string): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iDeactivate(stage3DProxy: away.managers.Stage3DProxy): void;
        public iInvalidateShaderProgram(updateMaterial?: boolean): void;
        public iUpdateProgram(stage3DProxy: away.managers.Stage3DProxy): void;
        public lightPicker : materials.LightPickerBase;
        private onLightsChange(event);
        public pUpdateLights(): void;
        public alphaPremultiplied : boolean;
    }
}
declare module away.materials {
    class CompiledPass extends materials.MaterialPassBase {
        public _iPasses: materials.MaterialPassBase[];
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
        public _pCompiler: materials.ShaderCompiler;
        public _pMethodSetup: materials.ShaderMethodSetup;
        private _usingSpecularMethod;
        private _usesNormals;
        public _preserveAlpha: boolean;
        private _animateUVs;
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumLightProbes: number;
        private _enableLightFallOff;
        private _forceSeparateMVP;
        constructor(material: materials.MaterialBase);
        public enableLightFallOff : boolean;
        public forceSeparateMVP : boolean;
        public iNumPointLights : number;
        public iNumDirectionalLights : number;
        public iNumLightProbes : number;
        public iUpdateProgram(stage3DProxy: away.managers.Stage3DProxy): void;
        private reset(profile);
        private updateUsedOffsets();
        private initConstantData();
        public iInitCompiler(profile: string): void;
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
        public pUpdateShaderProperties(): void;
        public pUpdateRegisterIndices(): void;
        public preserveAlpha : boolean;
        public animateUVs : boolean;
        public mipmap : boolean;
        public normalMap : away.textures.Texture2DBase;
        public normalMethod : materials.BasicNormalMethod;
        public ambientMethod : materials.BasicAmbientMethod;
        public shadowMethod : materials.ShadowMapMethodBase;
        public diffuseMethod : materials.BasicDiffuseMethod;
        public specularMethod : materials.BasicSpecularMethod;
        private init();
        public dispose(): void;
        public iInvalidateShaderProgram(updateMaterial?: boolean): void;
        public pAddPassesFromMethods(): void;
        public pAddPasses(passes: materials.MaterialPassBase[]): void;
        public pInitUVTransformData(): void;
        public pInitCommonsData(): void;
        public pCleanUp(): void;
        public pUpdateMethodConstants(): void;
        public pUpdateLightConstants(): void;
        public pUpdateProbes(stage3DProxy: away.managers.Stage3DProxy): void;
        private onShaderInvalidated(event);
        public iGetVertexCode(): string;
        public iGetFragmentCode(animatorCode: string): string;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public pUsesProbes(): boolean;
        public pUsesLights(): boolean;
        public iDeactivate(stage3DProxy: away.managers.Stage3DProxy): void;
        public specularLightSources : number;
        public diffuseLightSources : number;
    }
}
declare module away.materials {
    class SuperShaderPass extends materials.CompiledPass {
        private _includeCasters;
        private _ignoreLights;
        constructor(material: materials.MaterialBase);
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
        public includeCasters : boolean;
        public colorTransform : away.geom.ColorTransform;
        public colorTransformMethod : materials.ColorTransformMethod;
        public addMethod(method: materials.EffectMethodBase): void;
        public numMethods : number;
        public hasMethod(method: materials.EffectMethodBase): boolean;
        public getMethodAt(index: number): materials.EffectMethodBase;
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        public removeMethod(method: materials.EffectMethodBase): void;
        public pUpdateLights(): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iDeactivate(stage3DProxy: away.managers.Stage3DProxy): void;
        public pAddPassesFromMethods(): void;
        private usesProbesForSpecular();
        private usesProbesForDiffuse();
        public pUpdateMethodConstants(): void;
        public pUpdateLightConstants(): void;
        public pUpdateProbes(stage3DProxy: away.managers.Stage3DProxy): void;
        public iIgnoreLights : boolean;
    }
}
declare module away.materials {
    class DepthMapPass extends materials.MaterialPassBase {
        private _data;
        private _alphaThreshold;
        private _alphaMask;
        constructor();
        public alphaThreshold : number;
        public alphaMask : away.textures.Texture2DBase;
        public iGetVertexCode(): string;
        public iGetFragmentCode(code: string): string;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
    }
}
declare module away.materials {
    class DistanceMapPass extends materials.MaterialPassBase {
        private _fragmentData;
        private _vertexData;
        private _alphaThreshold;
        private _alphaMask;
        constructor();
        public alphaThreshold : number;
        public alphaMask : away.textures.Texture2DBase;
        public iGetVertexCode(): string;
        public iGetFragmentCode(animationCode: string): string;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
    }
}
declare module away.materials {
    class LightingPass extends materials.CompiledPass {
        private _includeCasters;
        private _tangentSpace;
        private _lightVertexConstantIndex;
        private _inverseSceneMatrix;
        private _directionalLightsOffset;
        private _pointLightsOffset;
        private _lightProbesOffset;
        private _maxLights;
        constructor(material: materials.MaterialBase);
        public directionalLightsOffset : number;
        public pointLightsOffset : number;
        public lightProbesOffset : number;
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
        public includeCasters : boolean;
        public pUpdateLights(): void;
        private calculateNumDirectionalLights(numDirectionalLights);
        private calculateNumPointLights(numPointLights);
        private calculateNumProbes(numLightProbes);
        public pUpdateShaderProperties(): void;
        public pUpdateRegisterIndices(): void;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        private usesProbesForSpecular();
        private usesProbesForDiffuse();
        public pUpdateLightConstants(): void;
        public pUpdateProbes(stage3DProxy: away.managers.Stage3DProxy): void;
    }
}
declare module away.materials {
    class ShadowCasterPass extends materials.CompiledPass {
        private _tangentSpace;
        private _lightVertexConstantIndex;
        private _inverseSceneMatrix;
        constructor(material: materials.MaterialBase);
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
        public pUpdateLights(): void;
        public pUpdateShaderProperties(): void;
        public pUpdateRegisterIndices(): void;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public pUpdateLightConstants(): void;
        public pUsesProbes(): boolean;
        public pUsesLights(): boolean;
        public pUpdateProbes(stage3DProxy: away.managers.Stage3DProxy): void;
    }
}
declare module away.materials {
    class SegmentPass extends materials.MaterialPassBase {
        static pONE_VECTOR: number[];
        static pFRONT_VECTOR: number[];
        private _constants;
        private _calcMatrix;
        private _thickness;
        constructor(thickness: number);
        public iGetVertexCode(): string;
        public iGetFragmentCode(animationCode: string): string;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public pDeactivate(stage3DProxy: away.managers.Stage3DProxy): void;
    }
}
declare module away.materials {
    class SkyBoxPass extends materials.MaterialPassBase {
        private _cubeTexture;
        private _vertexData;
        constructor();
        public cubeTexture : away.textures.CubeTextureBase;
        public iGetVertexCode(): string;
        public iGetFragmentCode(animationCode: string): string;
        public iRender(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iActivate(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
    }
}
declare module away.materials {
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
        constructor();
        public reset(): void;
    }
}
declare module away.materials {
    class ShadingMethodBase extends away.library.NamedAssetBase {
        public _sharedRegisters: materials.ShaderRegisterData;
        private _passes;
        constructor();
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public iSharedRegisters : materials.ShaderRegisterData;
        public setISharedRegisters(value: materials.ShaderRegisterData): void;
        public passes : materials.MaterialPassBase[];
        public dispose(): void;
        public iCreateMethodVO(): materials.MethodVO;
        public iReset(): void;
        public iCleanCompilationData(): void;
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iSetRenderState(vo: materials.MethodVO, renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iDeactivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public pGetTex2DSampleCode(vo: materials.MethodVO, targetReg: materials.ShaderRegisterElement, inputReg: materials.ShaderRegisterElement, texture: away.textures.TextureProxyBase, uvReg?: materials.ShaderRegisterElement, forceWrap?: string): string;
        public pGetTexCubeSampleCode(vo: materials.MethodVO, targetReg: materials.ShaderRegisterElement, inputReg: materials.ShaderRegisterElement, texture: away.textures.TextureProxyBase, uvReg: materials.ShaderRegisterElement): string;
        private getFormatStringForTexture(texture);
        public iInvalidateShaderProgram(): void;
        public copyFrom(method: ShadingMethodBase): void;
    }
}
declare module away.materials {
    class EffectMethodBase extends materials.ShadingMethodBase implements away.library.IAsset {
        constructor();
        public assetType : string;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class MethodVOSet {
        public method: materials.EffectMethodBase;
        public data: materials.MethodVO;
        constructor(method: materials.EffectMethodBase);
    }
}
declare module away.materials {
    class ShaderMethodSetup extends away.events.EventDispatcher {
        public _iColorTransformMethod: materials.ColorTransformMethod;
        public _iColorTransformMethodVO: materials.MethodVO;
        public _iNormalMethod: materials.BasicNormalMethod;
        public _iNormalMethodVO: materials.MethodVO;
        public _iAmbientMethod: materials.BasicAmbientMethod;
        public _iAmbientMethodVO: materials.MethodVO;
        public _iShadowMethod: materials.ShadowMapMethodBase;
        public _iShadowMethodVO: materials.MethodVO;
        public _iDiffuseMethod: materials.BasicDiffuseMethod;
        public _iDiffuseMethodVO: materials.MethodVO;
        public _iSpecularMethod: materials.BasicSpecularMethod;
        public _iSpecularMethodVO: materials.MethodVO;
        public _iMethods: materials.MethodVOSet[];
        constructor();
        private onShaderInvalidated(event);
        private invalidateShaderProgram();
        public normalMethod : materials.BasicNormalMethod;
        public ambientMethod : materials.BasicAmbientMethod;
        public shadowMethod : materials.ShadowMapMethodBase;
        public diffuseMethod : materials.BasicDiffuseMethod;
        public specularMethod : materials.BasicSpecularMethod;
        public iColorTransformMethod : materials.ColorTransformMethod;
        public dispose(): void;
        private clearListeners(method);
        public addMethod(method: materials.EffectMethodBase): void;
        public hasMethod(method: materials.EffectMethodBase): boolean;
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        public getMethodAt(index: number): materials.EffectMethodBase;
        public numMethods : number;
        public removeMethod(method: materials.EffectMethodBase): void;
        private getMethodSetForMethod(method);
    }
}
declare module away.materials {
    class LightingMethodBase extends materials.ShadingMethodBase {
        public _iModulateMethod: any;
        public _iModulateMethodScope: Object;
        constructor();
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class ShadowMapMethodBase extends materials.ShadingMethodBase implements away.library.IAsset {
        public _pCastingLight: away.lights.LightBase;
        public _pShadowMapper: away.lights.ShadowMapperBase;
        public _pEpsilon: number;
        public _pAlpha: number;
        constructor(castingLight: away.lights.LightBase);
        public assetType : string;
        public alpha : number;
        public castingLight : away.lights.LightBase;
        public epsilon : number;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class SimpleShadowMapMethodBase extends materials.ShadowMapMethodBase {
        public _pDepthMapCoordReg: materials.ShaderRegisterElement;
        public _pUsePoint: boolean;
        constructor(castingLight: away.lights.LightBase);
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public _iDepthMapCoordReg : materials.ShaderRegisterElement;
        public iCleanCompilationData(): void;
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public _pGetPointVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public pGetPlanarVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public _pGetPointFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iSetRenderState(vo: materials.MethodVO, renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iActivateForCascade(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
    }
}
declare module away.materials {
    class FilteredShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        constructor(castingLight: away.lights.DirectionalLight);
        public iInitConstants(vo: materials.MethodVO): void;
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iActivateForCascade(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class FogMethod extends materials.EffectMethodBase {
        private _minDistance;
        private _maxDistance;
        private _fogColor;
        private _fogR;
        private _fogG;
        private _fogB;
        constructor(minDistance: number, maxDistance: number, fogColor?: number);
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public minDistance : number;
        public maxDistance : number;
        public fogColor : number;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class HardShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        constructor(castingLight: away.lights.LightBase);
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public _pGetPointFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
        public iActivateForCascade(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
    }
}
declare module away.materials {
    class SoftShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        private _range;
        private _numSamples;
        private _offsets;
        constructor(castingLight: away.lights.DirectionalLight, numSamples?: number, range?: number);
        public numSamples : number;
        public range : number;
        public iInitConstants(vo: materials.MethodVO): void;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        private addSample(uv, texture, decode, target, regCache);
        public iActivateForCascade(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
        private getSampleCode(regCache, depthTexture, decodeRegister, targetRegister, dataReg);
    }
}
declare module away.materials {
    class DitheredShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        private static _grainTexture;
        private static _grainUsages;
        private static _grainBitmapData;
        private _depthMapSize;
        private _range;
        private _numSamples;
        constructor(castingLight: away.lights.DirectionalLight, numSamples?: number, range?: number);
        public numSamples : number;
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public range : number;
        private initGrainTexture();
        public dispose(): void;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        private getSampleCode(regCache, customDataReg, depthMapRegister, decReg, targetReg);
        private addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
        public iActivateForCascade(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class NearShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        private _baseMethod;
        private _fadeRatio;
        private _nearShadowMapper;
        constructor(baseMethod: materials.SimpleShadowMapMethodBase, fadeRatio?: number);
        public baseMethod : materials.SimpleShadowMapMethodBase;
        public iInitConstants(vo: materials.MethodVO): void;
        public iInitVO(vo: materials.MethodVO): void;
        public dispose(): void;
        public alpha : number;
        public epsilon : number;
        public fadeRatio : number;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iDeactivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iSetRenderState(vo: materials.MethodVO, renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iReset(): void;
        public iCleanCompilationData(): void;
        public iSharedRegisters : materials.ShaderRegisterData;
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    class BasicAmbientMethod extends materials.ShadingMethodBase {
        private _useTexture;
        private _texture;
        private _ambientInputRegister;
        private _ambientColor;
        private _ambientR;
        private _ambientG;
        private _ambientB;
        private _ambient;
        public _iLightAmbientR: number;
        public _iLightAmbientG: number;
        public _iLightAmbientB: number;
        constructor();
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public ambient : number;
        public ambientColor : number;
        public texture : away.textures.Texture2DBase;
        public copyFrom(method: materials.ShadingMethodBase): void;
        public iCleanCompilationData(): void;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        private updateAmbient();
        public iSetRenderState(vo: materials.MethodVO, renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
    }
}
declare module away.materials {
    class BasicDiffuseMethod extends materials.LightingMethodBase {
        private _useAmbientTexture;
        private _useTexture;
        public pTotalLightColorReg: materials.ShaderRegisterElement;
        private _diffuseInputRegister;
        private _texture;
        private _diffuseColor;
        private _diffuseR;
        private _diffuseG;
        private _diffuseB;
        private _diffuseA;
        private _shadowRegister;
        private _alphaThreshold;
        private _isFirstLight;
        constructor();
        public iUseAmbientTexture : boolean;
        public iInitVO(vo: materials.MethodVO): void;
        public generateMip(stage3DProxy: away.managers.Stage3DProxy): void;
        public diffuseAlpha : number;
        public diffuseColor : number;
        public texture : away.textures.Texture2DBase;
        public alphaThreshold : number;
        public dispose(): void;
        public copyFrom(method: materials.ShadingMethodBase): void;
        public iCleanCompilationData(): void;
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public pApplyShadow(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        private updateDiffuse();
        public iShadowRegister : materials.ShaderRegisterElement;
        public setIShadowRegister(value: materials.ShaderRegisterElement): void;
    }
}
declare module away.materials {
    class BasicNormalMethod extends materials.ShadingMethodBase {
        private _texture;
        private _useTexture;
        public _pNormalTextureRegister: materials.ShaderRegisterElement;
        constructor();
        public iInitVO(vo: materials.MethodVO): void;
        public iTangentSpace : boolean;
        public iHasOutput : boolean;
        public copyFrom(method: materials.ShadingMethodBase): void;
        public normalMap : away.textures.Texture2DBase;
        public setNormalMap(value: away.textures.Texture2DBase): void;
        public iCleanCompilationData(): void;
        public dispose(): void;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class BasicSpecularMethod extends materials.LightingMethodBase {
        public _pUseTexture: boolean;
        public _pTotalLightColorReg: materials.ShaderRegisterElement;
        public _pSpecularTextureRegister: materials.ShaderRegisterElement;
        public _pSpecularTexData: materials.ShaderRegisterElement;
        public _pSpecularDataRegister: materials.ShaderRegisterElement;
        private _texture;
        private _gloss;
        private _specular;
        private _specularColor;
        public _iSpecularR: number;
        public _iSpecularG: number;
        public _iSpecularB: number;
        private _shadowRegister;
        public _pIsFirstLight: boolean;
        constructor();
        public iInitVO(vo: materials.MethodVO): void;
        public gloss : number;
        public specular : number;
        public specularColor : number;
        public texture : away.textures.Texture2DBase;
        public copyFrom(method: materials.ShadingMethodBase): void;
        public iCleanCompilationData(): void;
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        private updateSpecular();
        public iShadowRegister : materials.ShaderRegisterElement;
        public setIShadowRegister(shadowReg: materials.ShaderRegisterElement): void;
    }
}
declare module away.materials {
    class ColorTransformMethod extends materials.EffectMethodBase {
        private _colorTransform;
        constructor();
        public colorTransform : away.geom.ColorTransform;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
    }
}
declare module away.materials {
    class PhongSpecularMethod extends materials.BasicSpecularMethod {
        constructor();
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
    }
}
declare module away.materials {
    class CompositeDiffuseMethod extends materials.BasicDiffuseMethod {
        public pBaseMethod: materials.BasicDiffuseMethod;
        constructor(scope: Object, modulateMethod?: Function, baseDiffuseMethod?: materials.BasicDiffuseMethod);
        public _pInitCompositeDiffuseMethod(scope: Object, modulateMethod: Function, baseDiffuseMethod?: materials.BasicDiffuseMethod): void;
        public baseMethod : materials.BasicDiffuseMethod;
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public dispose(): void;
        public alphaThreshold : number;
        public texture : away.textures.Texture2DBase;
        public diffuseAlpha : number;
        public diffuseColor : number;
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iDeactivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iReset(): void;
        public iCleanCompilationData(): void;
        public iSharedRegisters : materials.ShaderRegisterData;
        public setISharedRegisters(value: materials.ShaderRegisterData): void;
        public iShadowRegister : materials.ShaderRegisterElement;
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    class CompositeSpecularMethod extends materials.BasicSpecularMethod {
        private _baseMethod;
        constructor(scope: Object, modulateMethod: Function, baseSpecularMethod?: materials.BasicSpecularMethod);
        public _pInitCompositeSpecularMethod(scope: Object, modulateMethod: Function, baseSpecularMethod?: materials.BasicSpecularMethod): void;
        public iInitVO(vo: materials.MethodVO): void;
        public iInitConstants(vo: materials.MethodVO): void;
        public baseMethod : materials.BasicSpecularMethod;
        public gloss : number;
        public specular : number;
        public passes : materials.MaterialPassBase[];
        public dispose(): void;
        public texture : away.textures.Texture2DBase;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iDeactivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iSharedRegisters : materials.ShaderRegisterData;
        public setISharedRegisters(value: materials.ShaderRegisterData): void;
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        public iReset(): void;
        public iCleanCompilationData(): void;
        public iShadowRegister : materials.ShaderRegisterElement;
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    class EnvMapMethod extends materials.EffectMethodBase {
        private _cubeTexture;
        private _alpha;
        private _mask;
        constructor(envMap: away.textures.CubeTextureBase, alpha?: number);
        public mask : away.textures.Texture2DBase;
        public iInitVO(vo: materials.MethodVO): void;
        public envMap : away.textures.CubeTextureBase;
        public dispose(): void;
        public alpha : number;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class FresnelSpecularMethod extends materials.CompositeSpecularMethod {
        private _dataReg;
        private _incidentLight;
        private _fresnelPower;
        private _normalReflectance;
        constructor(basedOnSurface?: boolean, baseSpecularMethod?: materials.BasicSpecularMethod);
        public iInitConstants(vo: materials.MethodVO): void;
        public basedOnSurface : boolean;
        public fresnelPower : number;
        public iCleanCompilationData(): void;
        public normalReflectance : number;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        private modulateSpecular(vo, target, regCache, sharedRegisters);
    }
}
declare module away.materials {
    class SimpleWaterNormalMethod extends materials.BasicNormalMethod {
        private _texture2;
        private _normalTextureRegister2;
        private _useSecondNormalMap;
        private _water1OffsetX;
        private _water1OffsetY;
        private _water2OffsetX;
        private _water2OffsetY;
        constructor(waveMap1: away.textures.Texture2DBase, waveMap2: away.textures.Texture2DBase);
        public iInitConstants(vo: materials.MethodVO): void;
        public iInitVO(vo: materials.MethodVO): void;
        public water1OffsetX : number;
        public water1OffsetY : number;
        public water2OffsetX : number;
        public water2OffsetY : number;
        public normalMap : away.textures.Texture2DBase;
        public secondaryNormalMap : away.textures.Texture2DBase;
        public iCleanCompilationData(): void;
        public dispose(): void;
        public iActivate(vo: materials.MethodVO, stage3DProxy: away.managers.Stage3DProxy): void;
        public getFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    class LightPickerBase extends away.library.NamedAssetBase implements away.library.IAsset {
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumCastingPointLights: number;
        public _pNumCastingDirectionalLights: number;
        public _pNumLightProbes: number;
        public _pAllPickedLights: away.lights.LightBase[];
        public _pPointLights: away.lights.PointLight[];
        public _pCastingPointLights: away.lights.PointLight[];
        public _pDirectionalLights: away.lights.DirectionalLight[];
        public _pCastingDirectionalLights: away.lights.DirectionalLight[];
        public _pLightProbes: away.lights.LightProbe[];
        public _pLightProbeWeights: number[];
        constructor();
        public dispose(): void;
        public assetType : string;
        public numDirectionalLights : number;
        public numPointLights : number;
        public numCastingDirectionalLights : number;
        public numCastingPointLights : number;
        public numLightProbes : number;
        public pointLights : away.lights.PointLight[];
        public directionalLights : away.lights.DirectionalLight[];
        public castingPointLights : away.lights.PointLight[];
        public castingDirectionalLights : away.lights.DirectionalLight[];
        public lightProbes : away.lights.LightProbe[];
        public lightProbeWeights : number[];
        public allPickedLights : away.lights.LightBase[];
        public collectLights(renderable: away.base.IRenderable, entityCollector: away.traverse.EntityCollector): void;
        private updateProbeWeights(renderable);
    }
}
declare module away.materials {
    class StaticLightPicker extends materials.LightPickerBase {
        private _lights;
        constructor(lights: any);
        public lights : any[];
        private clearListeners();
        private onCastShadowChange(event);
        private updateDirectionalCasting(light);
        private updatePointCasting(light);
    }
}
declare module away.materials {
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
        constructor(profile: string);
        public reset(): void;
        public dispose(): void;
        public addFragmentTempUsages(register: materials.ShaderRegisterElement, usageCount: number): void;
        public removeFragmentTempUsage(register: materials.ShaderRegisterElement): void;
        public addVertexTempUsages(register: materials.ShaderRegisterElement, usageCount: number): void;
        public removeVertexTempUsage(register: materials.ShaderRegisterElement): void;
        public getFreeFragmentVectorTemp(): materials.ShaderRegisterElement;
        public getFreeFragmentSingleTemp(): materials.ShaderRegisterElement;
        public getFreeVarying(): materials.ShaderRegisterElement;
        public getFreeFragmentConstant(): materials.ShaderRegisterElement;
        public getFreeVertexConstant(): materials.ShaderRegisterElement;
        public getFreeVertexVectorTemp(): materials.ShaderRegisterElement;
        public getFreeVertexSingleTemp(): materials.ShaderRegisterElement;
        public getFreeVertexAttribute(): materials.ShaderRegisterElement;
        public getFreeTextureReg(): materials.ShaderRegisterElement;
        public vertexConstantOffset : number;
        public vertexAttributesOffset : number;
        public varyingsOffset : number;
        public fragmentConstantOffset : number;
        public fragmentOutputRegister : materials.ShaderRegisterElement;
        public numUsedVertexConstants : number;
        public numUsedFragmentConstants : number;
        public numUsedStreams : number;
        public numUsedTextures : number;
        public numUsedVaryings : number;
    }
}
declare module away.materials {
    class ShaderRegisterElement {
        private _regName;
        private _index;
        private _toStr;
        private static COMPONENTS;
        public _component: number;
        constructor(regName: string, index: number, component?: number);
        public toString(): string;
        public regName : string;
        public index : number;
    }
}
declare module away.materials {
    class ShaderRegisterData {
        public normalVarying: materials.ShaderRegisterElement;
        public tangentVarying: materials.ShaderRegisterElement;
        public bitangentVarying: materials.ShaderRegisterElement;
        public uvVarying: materials.ShaderRegisterElement;
        public secondaryUVVarying: materials.ShaderRegisterElement;
        public viewDirVarying: materials.ShaderRegisterElement;
        public shadedTarget: materials.ShaderRegisterElement;
        public globalPositionVertex: materials.ShaderRegisterElement;
        public globalPositionVarying: materials.ShaderRegisterElement;
        public localPosition: materials.ShaderRegisterElement;
        public normalInput: materials.ShaderRegisterElement;
        public tangentInput: materials.ShaderRegisterElement;
        public animatedNormal: materials.ShaderRegisterElement;
        public animatedTangent: materials.ShaderRegisterElement;
        public commons: materials.ShaderRegisterElement;
        public projectionFragment: materials.ShaderRegisterElement;
        public normalFragment: materials.ShaderRegisterElement;
        public viewDirFragment: materials.ShaderRegisterElement;
        public bitangent: materials.ShaderRegisterElement;
        constructor();
    }
}
declare module away.materials {
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
        constructor();
        public reset(): void;
        public setPositionedLights(numPointLights: number, lightSourceMask: number): void;
        public includeMethodVO(methodVO: materials.MethodVO): void;
        public tangentDependencies : number;
        public usesGlobalPosFragment : boolean;
        public projectionDependencies : number;
        public normalDependencies : number;
        public viewDirDependencies : number;
        public uvDependencies : number;
        public secondaryUVDependencies : number;
        public globalPosDependencies : number;
        public addWorldSpaceDependencies(fragmentLights: boolean): void;
    }
}
declare module away.materials {
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
        constructor(regName: string, regCount: number, persistent?: boolean);
        public requestFreeVectorReg(): materials.ShaderRegisterElement;
        public requestFreeRegComponent(): materials.ShaderRegisterElement;
        public addUsage(register: materials.ShaderRegisterElement, usageCount: number): void;
        public removeUsage(register: materials.ShaderRegisterElement): void;
        public dispose(): void;
        public hasRegisteredRegs(): boolean;
        private initRegisters(regName, regCount);
        private static _initPool(regName, regCount);
        private isRegisterUsed(index);
        private _initArray(a, val);
    }
}
declare module away.materials {
    class ShaderCompiler {
        public _pSharedRegisters: materials.ShaderRegisterData;
        public _pRegisterCache: materials.ShaderRegisterCache;
        public _pDependencyCounter: materials.MethodDependencyCounter;
        public _pMethodSetup: materials.ShaderMethodSetup;
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
        constructor(profile: string);
        public enableLightFallOff : boolean;
        public needUVAnimation : boolean;
        public UVTarget : string;
        public UVSource : string;
        public forceSeperateMVP : boolean;
        private initRegisterCache(profile);
        public animateUVs : boolean;
        public alphaPremultiplied : boolean;
        public preserveAlpha : boolean;
        public setTextureSampling(smooth: boolean, repeat: boolean, mipmap: boolean): void;
        public setConstantDataBuffers(vertexConstantData: number[], fragmentConstantData: number[]): void;
        public methodSetup : materials.ShaderMethodSetup;
        public compile(): void;
        public pCreateNormalRegisters(): void;
        public pCompileMethodsCode(): void;
        public pCompileLightingCode(): void;
        public pCompileViewDirCode(): void;
        public pCompileNormalCode(): void;
        private compileUVCode();
        private compileSecondaryUVCode();
        public pCompileGlobalPositionCode(): void;
        private compileProjectionCode();
        private compileFragmentOutput();
        public pInitRegisterIndices(): void;
        public pInitLightData(): void;
        private createCommons();
        public pCalculateDependencies(): void;
        private setupAndCountMethodDependencies(method, methodVO);
        private setupMethod(method, methodVO);
        public commonsDataIndex : number;
        private updateMethodRegisters();
        public numUsedVertexConstants : number;
        public numUsedFragmentConstants : number;
        public numUsedStreams : number;
        public numUsedTextures : number;
        public numUsedVaryings : number;
        public pUsesLightsForSpecular(): boolean;
        public pUsesLightsForDiffuse(): boolean;
        public dispose(): void;
        private cleanUpMethods();
        public specularLightSources : number;
        public diffuseLightSources : number;
        public pUsesProbesForSpecular(): boolean;
        public pUsesProbesForDiffuse(): boolean;
        public pUsesProbes(): boolean;
        public uvBufferIndex : number;
        public uvTransformIndex : number;
        public secondaryUVBufferIndex : number;
        public normalBufferIndex : number;
        public tangentBufferIndex : number;
        public lightFragmentConstantIndex : number;
        public cameraPositionIndex : number;
        public sceneMatrixIndex : number;
        public sceneNormalMatrixIndex : number;
        public probeWeightsIndex : number;
        public vertexCode : string;
        public fragmentCode : string;
        public fragmentLightCode : string;
        public fragmentPostLightCode : string;
        public shadedTarget : string;
        public numPointLights : number;
        public numDirectionalLights : number;
        public numLightProbes : number;
        public usingSpecularMethod : boolean;
        public animatableAttributes : string[];
        public animationTargetRegisters : string[];
        public usesNormals : boolean;
        public pUsesLights(): boolean;
        public pCompileMethods(): void;
        public lightProbeDiffuseIndices : number[];
        public lightProbeSpecularIndices : number[];
    }
}
declare module away.materials {
    class SuperShaderCompiler extends materials.ShaderCompiler {
        public _pointLightRegisters: materials.ShaderRegisterElement[];
        public _dirLightRegisters: materials.ShaderRegisterElement[];
        constructor(profile: string);
        public pInitLightData(): void;
        public pCalculateDependencies(): void;
        public pCompileNormalCode(): void;
        public pCreateNormalRegisters(): void;
        private compileTangentVertexCode(matrix);
        private compileTangentNormalMapFragmentCode();
        public pCompileViewDirCode(): void;
        public pCompileLightingCode(): void;
        private initLightRegisters();
        private compileDirectionalLightCode();
        private compilePointLightCode();
        private compileLightProbeCode();
    }
}
declare module away.materials {
    class LightSources {
        static LIGHTS: number;
        static PROBES: number;
        static ALL: number;
    }
}
declare module away.materials {
    class MaterialBase extends away.library.NamedAssetBase implements away.library.IAsset {
        private static MATERIAL_ID_COUNT;
        public extra: Object;
        public _iClassification: string;
        public _iUniqueId: number;
        public _iRenderOrderId: number;
        public _iDepthPassId: number;
        private _bothSides;
        private _animationSet;
        private _owners;
        private _alphaPremultiplied;
        public _pBlendMode: string;
        private _numPasses;
        private _passes;
        public _pMipmap: boolean;
        private _smooth;
        private _repeat;
        public _pDepthPass: materials.DepthMapPass;
        public _pDistancePass: materials.DistanceMapPass;
        public _pLightPicker: materials.LightPickerBase;
        private _distanceBasedDepthRender;
        public _pDepthCompareMode: string;
        constructor();
        public assetType : string;
        public lightPicker : materials.LightPickerBase;
        public setLightPicker(value: materials.LightPickerBase): void;
        public mipmap : boolean;
        public setMipMap(value: boolean): void;
        public smooth : boolean;
        public depthCompareMode : string;
        public setDepthCompareMode(value: string): void;
        public repeat : boolean;
        public dispose(): void;
        public bothSides : boolean;
        public blendMode : string;
        public getBlendMode(): string;
        public setBlendMode(value: string): void;
        public alphaPremultiplied : boolean;
        public requiresBlending : boolean;
        public getRequiresBlending(): boolean;
        public uniqueId : number;
        public _iNumPasses : number;
        public iHasDepthAlphaThreshold(): boolean;
        public iActivateForDepth(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, distanceBased?: boolean): void;
        public iDeactivateForDepth(stage3DProxy: away.managers.Stage3DProxy): void;
        public iRenderDepth(renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, viewProjection: away.geom.Matrix3D): void;
        public iPassRendersToTexture(index: number): boolean;
        public iActivatePass(index: number, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iDeactivatePass(index: number, stage3DProxy: away.managers.Stage3DProxy): void;
        public iRenderPass(index: number, renderable: away.base.IRenderable, stage3DProxy: away.managers.Stage3DProxy, entityCollector: away.traverse.EntityCollector, viewProjection: away.geom.Matrix3D): void;
        public iAddOwner(owner: away.base.IMaterialOwner): void;
        public iRemoveOwner(owner: away.base.IMaterialOwner): void;
        public iOwners : away.base.IMaterialOwner[];
        public iUpdateMaterial(context: away.display3D.Context3D): void;
        public iDeactivate(stage3DProxy: away.managers.Stage3DProxy): void;
        public iInvalidatePasses(triggerPass: materials.MaterialPassBase): void;
        public pRemovePass(pass: materials.MaterialPassBase): void;
        public pClearPasses(): void;
        public pAddPass(pass: materials.MaterialPassBase): void;
        private onPassChange(event);
        private onDistancePassChange(event);
        private onDepthPassChange(event);
    }
}
declare module away.materials {
    class SinglePassMaterialBase extends materials.MaterialBase {
        public _pScreenPass: materials.SuperShaderPass;
        private _alphaBlending;
        constructor();
        public enableLightFallOff : boolean;
        public alphaThreshold : number;
        public blendMode : string;
        public depthCompareMode : string;
        public iActivateForDepth(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, distanceBased?: boolean): void;
        public specularLightSources : number;
        public diffuseLightSources : number;
        public requiresBlending : boolean;
        public getRequiresBlending(): boolean;
        public colorTransform : away.geom.ColorTransform;
        public setColorTransform(value: away.geom.ColorTransform): void;
        public ambientMethod : materials.BasicAmbientMethod;
        public shadowMethod : materials.ShadowMapMethodBase;
        public diffuseMethod : materials.BasicDiffuseMethod;
        public normalMethod : materials.BasicNormalMethod;
        public specularMethod : materials.BasicSpecularMethod;
        public addMethod(method: materials.EffectMethodBase): void;
        public numMethods : number;
        public hasMethod(method: materials.EffectMethodBase): boolean;
        public getMethodAt(index: number): materials.EffectMethodBase;
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        public removeMethod(method: materials.EffectMethodBase): void;
        public mipmap : boolean;
        public normalMap : away.textures.Texture2DBase;
        public specularMap : away.textures.Texture2DBase;
        public gloss : number;
        public ambient : number;
        public specular : number;
        public ambientColor : number;
        public specularColor : number;
        public alphaBlending : boolean;
        public iUpdateMaterial(context: away.display3D.Context3D): void;
        public lightPicker : materials.LightPickerBase;
    }
}
declare module away.materials {
    class MultiPassMaterialBase extends materials.MaterialBase {
        private _casterLightPass;
        private _nonCasterLightPasses;
        public _pEffectsPass: materials.SuperShaderPass;
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
        constructor();
        public enableLightFallOff : boolean;
        public alphaThreshold : number;
        public depthCompareMode : string;
        public blendMode : string;
        public iActivateForDepth(stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D, distanceBased?: boolean): void;
        public specularLightSources : number;
        public diffuseLightSources : number;
        public lightPicker : materials.LightPickerBase;
        public requiresBlending : boolean;
        public ambientMethod : materials.BasicAmbientMethod;
        public shadowMethod : materials.ShadowMapMethodBase;
        public diffuseMethod : materials.BasicDiffuseMethod;
        public specularMethod : materials.BasicSpecularMethod;
        public normalMethod : materials.BasicNormalMethod;
        public addMethod(method: materials.EffectMethodBase): void;
        public numMethods : number;
        public hasMethod(method: materials.EffectMethodBase): boolean;
        public getMethodAt(index: number): materials.EffectMethodBase;
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        public removeMethod(method: materials.EffectMethodBase): void;
        public mipmap : boolean;
        public normalMap : away.textures.Texture2DBase;
        public specularMap : away.textures.Texture2DBase;
        public gloss : number;
        public ambient : number;
        public specular : number;
        public ambientColor : number;
        public specularColor : number;
        public iUpdateMaterial(context: away.display3D.Context3D): void;
        private addScreenPass(pass);
        private isAnyScreenPassInvalid();
        private addChildPassesFor(pass);
        public iActivatePass(index: number, stage3DProxy: away.managers.Stage3DProxy, camera: away.cameras.Camera3D): void;
        public iDeactivate(stage3DProxy: away.managers.Stage3DProxy): void;
        public pUpdateScreenPasses(): void;
        private initPasses();
        private setBlendAndCompareModes();
        private initCasterLightPass();
        private removeCasterLightPass();
        private initNonCasterLightPasses();
        private removeNonCasterLightPasses();
        private removeEffectsPass();
        private initEffectsPass();
        private numLights;
        private numNonCasters;
        public pInvalidateScreenPasses(): void;
        private onLightsChange(event);
    }
}
declare module away.materials {
    class TextureMultiPassMaterial extends materials.MultiPassMaterialBase {
        private _animateUVs;
        constructor(texture?: away.textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        public animateUVs : boolean;
        public texture : away.textures.Texture2DBase;
        public ambientTexture : away.textures.Texture2DBase;
        public pUpdateScreenPasses(): void;
    }
}
declare module away.materials {
    class ColorMultiPassMaterial extends materials.MultiPassMaterialBase {
        constructor(color?: number);
        public color : number;
    }
}
declare module away.materials {
    class TextureMaterial extends materials.SinglePassMaterialBase {
        constructor(texture?: away.textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        public animateUVs : boolean;
        public alpha : number;
        public texture : away.textures.Texture2DBase;
        public ambientTexture : away.textures.Texture2DBase;
    }
}
declare module away.materials {
    class ColorMaterial extends materials.SinglePassMaterialBase {
        private _diffuseAlpha;
        constructor(color?: number, alpha?: number);
        public alpha : number;
        public color : number;
        public requiresBlending : boolean;
    }
}
declare module away.materials {
    class DefaultMaterialManager {
        private static _defaultTextureBitmapData;
        private static _defaultMaterial;
        private static _defaultTexture;
        static getDefaultMaterial(renderable?: away.base.IMaterialOwner): materials.TextureMaterial;
        static getDefaultTexture(renderable?: away.base.IMaterialOwner): away.textures.BitmapTexture;
        private static createDefaultTexture();
        static createCheckeredBitmapData(): away.display.BitmapData;
        private static createDefaultMaterial();
    }
}
declare module away.materials {
    class LightingShaderCompiler extends materials.ShaderCompiler {
        public _pointLightFragmentConstants: materials.ShaderRegisterElement[];
        public _pointLightVertexConstants: materials.ShaderRegisterElement[];
        public _dirLightFragmentConstants: materials.ShaderRegisterElement[];
        public _dirLightVertexConstants: materials.ShaderRegisterElement[];
        private _lightVertexConstantIndex;
        private _shadowRegister;
        constructor(profile: string);
        public lightVertexConstantIndex : number;
        public pInitRegisterIndices(): void;
        public pCreateNormalRegisters(): void;
        public tangentSpace : boolean;
        public pInitLightData(): void;
        public pCalculateDependencies(): void;
        public pCompileNormalCode(): void;
        private compileTangentSpaceNormalMapCode();
        public pCompileViewDirCode(): void;
        public pCompileLightingCode(): void;
        private compileShadowCode();
        private initLightRegisters();
        private compileDirectionalLightCode();
        private compilePointLightCode();
        private compileLightProbeCode();
    }
}
declare module away.materials {
    class SegmentMaterial extends materials.MaterialBase {
        private _screenPass;
        constructor(thickness?: number);
    }
}
declare module away.materials {
    class SkyBoxMaterial extends materials.MaterialBase {
        private _cubeMap;
        private _skyboxPass;
        constructor(cubeMap: away.textures.CubeTextureBase);
        public cubeMap : away.textures.CubeTextureBase;
    }
}
declare module away.primitives {
    class Segment {
        public _pSegmentsBase: away.entities.SegmentSet;
        public _pThickness: number;
        public _pStart: away.geom.Vector3D;
        public _pEnd: away.geom.Vector3D;
        public _pStartR: number;
        public _pStartG: number;
        public _pStartB: number;
        public _pEndR: number;
        public _pEndG: number;
        public _pEndB: number;
        private _index;
        private _subSetIndex;
        private _startColor;
        private _endColor;
        constructor(start: away.geom.Vector3D, end: away.geom.Vector3D, anchor: away.geom.Vector3D, colorStart?: number, colorEnd?: number, thickness?: number);
        public updateSegment(start: away.geom.Vector3D, end: away.geom.Vector3D, anchor: away.geom.Vector3D, colorStart?: number, colorEnd?: number, thickness?: number): void;
        public start : away.geom.Vector3D;
        public end : away.geom.Vector3D;
        public thickness : number;
        public startColor : number;
        public endColor : number;
        public dispose(): void;
        public iIndex : number;
        public iSubSetIndex : number;
        public iSegmentsBase : away.entities.SegmentSet;
        private update();
    }
}
declare module away.primitives {
    class PrimitiveBase extends away.base.Geometry {
        private _geomDirty;
        private _uvDirty;
        private _subGeometry;
        constructor();
        public subGeometries : away.base.ISubGeometry[];
        public clone(): away.base.Geometry;
        public scale(scale: number): void;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        public applyTransformation(transform: away.geom.Matrix3D): void;
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        public pInvalidateGeometry(): void;
        public pInvalidateUVs(): void;
        private updateGeometry();
        private updateUVs();
        public iValidate(): void;
    }
}
declare module away.primitives {
    class LineSegment extends primitives.Segment {
        public TYPE: string;
        constructor(v0: away.geom.Vector3D, v1: away.geom.Vector3D, color0?: number, color1?: number, thickness?: number);
    }
}
declare module away.primitives {
    class TorusGeometry extends primitives.PrimitiveBase {
        private _radius;
        private _tubeRadius;
        private _segmentsR;
        private _segmentsT;
        private _yUp;
        private _rawVertexData;
        private _rawIndices;
        private _nextVertexIndex;
        private _currentIndex;
        private _currentTriangleIndex;
        private _numVertices;
        private _vertexStride;
        private _vertexOffset;
        private addVertex(px, py, pz, nx, ny, nz, tx, ty, tz);
        private addTriangleClockWise(cwVertexIndex0, cwVertexIndex1, cwVertexIndex2);
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        public radius : number;
        public tubeRadius : number;
        public segmentsR : number;
        public segmentsT : number;
        public yUp : boolean;
        constructor(radius?: number, tubeRadius?: number, segmentsR?: number, segmentsT?: number, yUp?: boolean);
    }
}
declare module away.primitives {
    class CubeGeometry extends primitives.PrimitiveBase {
        private _width;
        private _height;
        private _depth;
        private _tile6;
        private _segmentsW;
        private _segmentsH;
        private _segmentsD;
        constructor(width?: number, height?: number, depth?: number, segmentsW?: number, segmentsH?: number, segmentsD?: number, tile6?: boolean);
        public width : number;
        public height : number;
        public depth : number;
        public tile6 : boolean;
        public segmentsW : number;
        public segmentsH : number;
        public segmentsD : number;
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
    }
}
declare module away.primitives {
    class PlaneGeometry extends primitives.PrimitiveBase {
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        private _width;
        private _height;
        private _doubleSided;
        constructor(width?: number, height?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean, doubleSided?: boolean);
        public segmentsW : number;
        public segmentsH : number;
        public yUp : boolean;
        public doubleSided : boolean;
        public width : number;
        public height : number;
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
    }
}
declare module away.primitives {
    class CapsuleGeometry extends primitives.PrimitiveBase {
        private _radius;
        private _height;
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        constructor(radius?: number, height?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean);
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        public radius : number;
        public height : number;
        public segmentsW : number;
        public segmentsH : number;
        public yUp : boolean;
    }
}
declare module away.primitives {
    class CylinderGeometry extends primitives.PrimitiveBase {
        public _pBottomRadius: number;
        public _pSegmentsW: number;
        public _pSegmentsH: number;
        private _topRadius;
        private _height;
        private _topClosed;
        private _bottomClosed;
        private _surfaceClosed;
        private _yUp;
        private _rawData;
        private _rawIndices;
        private _nextVertexIndex;
        private _currentIndex;
        private _currentTriangleIndex;
        private _numVertices;
        private _stride;
        private _vertexOffset;
        private addVertex(px, py, pz, nx, ny, nz, tx, ty, tz);
        private addTriangleClockWise(cwVertexIndex0, cwVertexIndex1, cwVertexIndex2);
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        public topRadius : number;
        public bottomRadius : number;
        public height : number;
        public segmentsW : number;
        public setSegmentsW(value: number): void;
        public segmentsH : number;
        public setSegmentsH(value: number): void;
        public topClosed : boolean;
        public bottomClosed : boolean;
        public yUp : boolean;
        constructor(topRadius?: number, bottomRadius?: number, height?: number, segmentsW?: number, segmentsH?: number, topClosed?: boolean, bottomClosed?: boolean, surfaceClosed?: boolean, yUp?: boolean);
    }
}
declare module away.primitives {
    class ConeGeometry extends primitives.CylinderGeometry {
        public radius : number;
        constructor(radius?: number, height?: number, segmentsW?: number, segmentsH?: number, closed?: boolean, yUp?: boolean);
    }
}
declare module away.primitives {
    class RegularPolygonGeometry extends primitives.CylinderGeometry {
        public radius : number;
        public sides : number;
        public subdivisions : number;
        constructor(radius?: number, sides?: number, yUp?: boolean);
    }
}
declare module away.primitives {
    class SphereGeometry extends primitives.PrimitiveBase {
        private _radius;
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        constructor(radius?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean);
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        public radius : number;
        public segmentsW : number;
        public segmentsH : number;
        public yUp : boolean;
    }
}
declare module away.primitives {
    class WireframePrimitiveBase extends away.entities.SegmentSet {
        private _geomDirty;
        private _color;
        private _thickness;
        constructor(color?: number, thickness?: number);
        public color : number;
        public thickness : number;
        public removeAllSegments(): void;
        public getBounds(): away.bounds.BoundingVolumeBase;
        public pBuildGeometry(): void;
        public pInvalidateGeometry(): void;
        private updateGeometry();
        public pUpdateOrAddSegment(index: number, v0: away.geom.Vector3D, v1: away.geom.Vector3D): void;
        public pUpdateMouseChildren(): void;
    }
}
declare module away.primitives {
    class WireframeSphere extends primitives.WireframePrimitiveBase {
        private _segmentsW;
        private _segmentsH;
        private _radius;
        constructor(radius?: number, segmentsW?: number, segmentsH?: number, color?: number, thickness?: number);
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    class WireframeCube extends primitives.WireframePrimitiveBase {
        private _width;
        private _height;
        private _depth;
        constructor(width?: number, height?: number, depth?: number, color?: number, thickness?: number);
        public width : number;
        public height : number;
        public depth : number;
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    class WireframeCylinder extends primitives.WireframePrimitiveBase {
        private static TWO_PI;
        private _topRadius;
        private _bottomRadius;
        private _height;
        private _segmentsW;
        private _segmentsH;
        constructor(topRadius?: number, bottomRadius?: number, height?: number, segmentsW?: number, segmentsH?: number, color?: number, thickness?: number);
        public pBuildGeometry(): void;
        public topRadius : number;
        public bottomRadius : number;
        public height : number;
    }
}
declare module away.primitives {
    class WireframePlane extends primitives.WireframePrimitiveBase {
        static ORIENTATION_YZ: string;
        static ORIENTATION_XY: string;
        static ORIENTATION_XZ: string;
        private _width;
        private _height;
        private _segmentsW;
        private _segmentsH;
        private _orientation;
        constructor(width: number, height: number, segmentsW?: number, segmentsH?: number, color?: number, thickness?: number, orientation?: string);
        public orientation : string;
        public width : number;
        public height : number;
        public segmentsW : number;
        public segmentsH : number;
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    class WireframeRegularPolygon extends primitives.WireframePrimitiveBase {
        static ORIENTATION_YZ: string;
        static ORIENTATION_XY: string;
        static ORIENTATION_XZ: string;
        private _radius;
        private _sides;
        private _orientation;
        constructor(radius: number, sides: number, color?: number, thickness?: number, orientation?: string);
        public orientation : string;
        public radius : number;
        public sides : number;
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    class WireframeTetrahedron extends primitives.WireframePrimitiveBase {
        static ORIENTATION_YZ: string;
        static ORIENTATION_XY: string;
        static ORIENTATION_XZ: string;
        private _width;
        private _height;
        private _orientation;
        constructor(width: number, height: number, color?: number, thickness?: number, orientation?: string);
        public orientation : string;
        public width : number;
        public height : number;
        public pBuildGeometry(): void;
    }
}
declare module away.textures {
    class TextureProxyBase extends away.library.NamedAssetBase implements away.library.IAsset {
        private _format;
        private _hasMipmaps;
        private _textures;
        private _dirty;
        public _pWidth: number;
        public _pHeight: number;
        constructor();
        public hasMipMaps : boolean;
        public format : string;
        public assetType : string;
        public width : number;
        public height : number;
        public getTextureForStage3D(stage3DProxy: away.managers.Stage3DProxy): away.display3D.TextureBase;
        public pUploadContent(texture: away.display3D.TextureBase): void;
        public pSetSize(width: number, height: number): void;
        public invalidateContent(): void;
        public pInvalidateSize(): void;
        public pCreateTexture(context: away.display3D.Context3D): away.display3D.TextureBase;
        public dispose(): void;
    }
}
declare module away.textures {
    class Texture2DBase extends textures.TextureProxyBase {
        constructor();
        public pCreateTexture(context: away.display3D.Context3D): away.display3D.TextureBase;
    }
}
declare module away.textures {
    class HTMLImageElementTexture extends textures.Texture2DBase {
        private static _mipMaps;
        private static _mipMapUses;
        private _htmlImageElement;
        private _generateMipmaps;
        private _mipMapHolder;
        constructor(htmlImageElement: HTMLImageElement, generateMipmaps?: boolean);
        public htmlImageElement : HTMLImageElement;
        public pUploadContent(texture: away.display3D.TextureBase): void;
        private getMipMapHolder();
        private freeMipMapHolder();
        public dispose(): void;
    }
}
declare module away.textures {
    class BitmapTexture extends textures.Texture2DBase {
        private static _mipMaps;
        private static _mipMapUses;
        private _bitmapData;
        private _mipMapHolder;
        private _generateMipmaps;
        constructor(bitmapData: away.display.BitmapData, generateMipmaps?: boolean);
        public bitmapData : away.display.BitmapData;
        public pUploadContent(texture: away.display3D.TextureBase): void;
        private getMipMapHolder();
        private freeMipMapHolder();
        public dispose(): void;
    }
}
declare module away.textures {
    class CubeTextureBase extends textures.TextureProxyBase {
        constructor();
        public size : number;
        public pCreateTexture(context: away.display3D.Context3D): away.display3D.TextureBase;
    }
}
declare module away.textures {
    class RenderTexture extends textures.Texture2DBase {
        constructor(width: number, height: number);
        public width : number;
        public height : number;
        public pUploadContent(texture: away.display3D.TextureBase): void;
        public pCreateTexture(context: away.display3D.Context3D): away.display3D.TextureBase;
    }
}
declare module away.textures {
    class HTMLImageElementCubeTexture extends textures.CubeTextureBase {
        private _bitmapDatas;
        private _useMipMaps;
        constructor(posX: HTMLImageElement, negX: HTMLImageElement, posY: HTMLImageElement, negY: HTMLImageElement, posZ: HTMLImageElement, negZ: HTMLImageElement);
        public positiveX : HTMLImageElement;
        public negativeX : HTMLImageElement;
        public positiveY : HTMLImageElement;
        public negativeY : HTMLImageElement;
        public positiveZ : HTMLImageElement;
        public negativeZ : HTMLImageElement;
        private testSize(value);
        public pUploadContent(texture: away.display3D.TextureBase): void;
    }
}
declare module away.textures {
    class BitmapCubeTexture extends textures.CubeTextureBase {
        private _bitmapDatas;
        private _useMipMaps;
        constructor(posX: away.display.BitmapData, negX: away.display.BitmapData, posY: away.display.BitmapData, negY: away.display.BitmapData, posZ: away.display.BitmapData, negZ: away.display.BitmapData);
        public positiveX : away.display.BitmapData;
        public negativeX : away.display.BitmapData;
        public positiveY : away.display.BitmapData;
        public negativeY : away.display.BitmapData;
        public positiveZ : away.display.BitmapData;
        public negativeZ : away.display.BitmapData;
        private testSize(value);
        public pUploadContent(texture: away.display3D.TextureBase): void;
    }
}
declare module away.utils {
    class ByteArrayBase {
        public position: number;
        public length: number;
        public _mode: string;
        public Base64Key: string;
        constructor();
        public writeByte(b: number): void;
        public readByte(): number;
        public writeUnsignedByte(b: number): void;
        public readUnsignedByte(): number;
        public writeUnsignedShort(b: number): void;
        public readUnsignedShort(): number;
        public writeUnsignedInt(b: number): void;
        public readUnsignedInt(): number;
        public writeFloat(b: number): void;
        public toFloatBits(x: number): void;
        public readFloat(b: number): void;
        public fromFloatBits(x: number): void;
        public getBytesAvailable(): number;
        public toString(): string;
        public compareEqual(other: any, count: any): boolean;
        public writeBase64String(s: string): void;
        public dumpToConsole(): void;
        public internalGetBase64String(count: any, getUnsignedByteFunc: any, self: any): string;
    }
}
declare module away.utils {
    class ByteArray extends utils.ByteArrayBase {
        public maxlength: number;
        public arraybytes: any;
        public unalignedarraybytestemp: any;
        constructor();
        public ensureWriteableSpace(n: number): void;
        public setArrayBuffer(aBuffer: ArrayBuffer): void;
        public getBytesAvailable(): number;
        public ensureSpace(n: number): void;
        public writeByte(b: number): void;
        public readByte(): number;
        public readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        public writeUnsignedByte(b: number): void;
        public readUnsignedByte(): number;
        public writeUnsignedShort(b: number): void;
        public readUTFBytes(len: number): string;
        public readInt(): number;
        public readShort(): number;
        public readDouble(): number;
        public readUnsignedShort(): number;
        public writeUnsignedInt(b: number): void;
        public readUnsignedInt(): number;
        public writeFloat(b: number): void;
        public readFloat(): number;
    }
}
declare module away.utils {
    class ByteArrayBuffer extends utils.ByteArrayBase {
        public _bytes: number[];
        constructor();
        public writeByte(b: number): void;
        public readByte(): number;
        public writeUnsignedByte(b: number): void;
        public readUnsignedByte(): number;
        public writeUnsignedShort(b: number): void;
        public readUnsignedShort(): number;
        public writeUnsignedInt(b: number): void;
        public readUnsignedInt(): number;
        public writeFloat(b: number): void;
        public toFloatBits(x: number): number;
        public readFloat(b: number): number;
        public fromFloatBits(x: number): number;
    }
}
declare module away.utils {
    class Cast {
        private static _colorNames;
        private static _hexChars;
        private static _notClasses;
        private static _classes;
        static string(data: any): string;
        static byteArray(data: any): utils.ByteArray;
        private static isHex(str);
        static tryColor(data: any): number;
        static color(data: any): number;
        static tryClass(name: string): any;
        static bitmapData(data: any): away.display.BitmapData;
        static bitmapTexture(data: any): away.textures.BitmapTexture;
    }
}
declare module away.utils {
    class ColorUtils {
        static float32ColorToARGB(float32Color: number): number[];
        private static componentToHex(c);
        static RGBToHexString(argb: number[]): string;
        static ARGBToHexString(argb: number[]): string;
    }
}
declare module away.utils {
    class CSS {
        static setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number): void;
        static setCanvasWidth(canvas: HTMLCanvasElement, width: number): void;
        static setCanvasHeight(canvas: HTMLCanvasElement, height: number): void;
        static setCanvasX(canvas: HTMLCanvasElement, x: number): void;
        static setCanvasY(canvas: HTMLCanvasElement, y: number): void;
        static getCanvasVisibility(canvas: HTMLCanvasElement): boolean;
        static setCanvasVisibility(canvas: HTMLCanvasElement, visible: boolean): void;
        static setCanvasAlpha(canvas: HTMLCanvasElement, alpha: number): void;
        static setCanvasPosition(canvas: HTMLCanvasElement, x: number, y: number, absolute?: boolean): void;
    }
}
declare module away {
    class Debug {
        static THROW_ERRORS: boolean;
        static ENABLE_LOG: boolean;
        static LOG_PI_ERRORS: boolean;
        private static keyword;
        static breakpoint(): void;
        static throwPIROnKeyWordOnly(str: string, enable?: boolean): void;
        static throwPIR(clss: string, fnc: string, msg: string): void;
        private static logPIR(clss, fnc, msg?);
        static log(...args: any[]): void;
    }
}
declare module away.utils {
    class GeometryUtils {
        static fromVectors(verts: number[], indices: number[], uvs: number[], normals: number[], tangents: number[], weights: number[], jointIndices: number[], triangleOffset?: number): away.base.ISubGeometry[];
        static constructSubGeometry(verts: number[], indices: number[], uvs: number[], normals: number[], tangents: number[], weights: number[], jointIndices: number[], triangleOffset: number): away.base.CompactSubGeometry;
        static interleaveBuffers(numVertices: number, vertices?: number[], normals?: number[], tangents?: number[], uvs?: number[], suvs?: number[]): number[];
        static getMeshSubgeometryIndex(subGeometry: away.base.ISubGeometry): number;
        static getMeshSubMeshIndex(subMesh: away.base.SubMesh): number;
    }
}
declare module away.utils {
    function getTimer(): number;
}
declare module away.utils {
    class PerspectiveMatrix3D extends away.geom.Matrix3D {
        constructor(v?: number[]);
        public perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
    }
}
declare module away.utils {
    class RequestAnimationFrame {
        private _callback;
        private _callbackContext;
        private _active;
        private _rafUpdateFunction;
        private _prevTime;
        private _dt;
        private _currentTime;
        private _argsArray;
        private _getTimer;
        constructor(callback: Function, callbackContext: Object);
        public setCallback(callback: Function, callbackContext: Object): void;
        public start(): void;
        public stop(): void;
        public active : boolean;
        private _tick();
    }
}
declare module away.utils {
    class TextureUtils {
        private static MAX_SIZE;
        static isBitmapDataValid(bitmapData: away.display.BitmapData): boolean;
        static isHTMLImageElementValid(image: HTMLImageElement): boolean;
        static isDimensionValid(d: number): boolean;
        static isPowerOfTwo(value: number): boolean;
        static getBestPowerOf2(value: number): number;
    }
}
declare module away.utils {
    class Timer extends away.events.EventDispatcher {
        private _delay;
        private _repeatCount;
        private _currentCount;
        private _iid;
        private _running;
        constructor(delay: number, repeatCount?: number);
        public currentCount : number;
        public delay : number;
        public repeatCount : number;
        public reset(): void;
        public running : boolean;
        public start(): void;
        public stop(): void;
        private tick();
    }
}
declare module away.animators {
    class AnimationRegisterCache extends away.materials.ShaderRegisterCache {
        public positionAttribute: away.materials.ShaderRegisterElement;
        public uvAttribute: away.materials.ShaderRegisterElement;
        public positionTarget: away.materials.ShaderRegisterElement;
        public scaleAndRotateTarget: away.materials.ShaderRegisterElement;
        public velocityTarget: away.materials.ShaderRegisterElement;
        public vertexTime: away.materials.ShaderRegisterElement;
        public vertexLife: away.materials.ShaderRegisterElement;
        public vertexZeroConst: away.materials.ShaderRegisterElement;
        public vertexOneConst: away.materials.ShaderRegisterElement;
        public vertexTwoConst: away.materials.ShaderRegisterElement;
        public uvTarget: away.materials.ShaderRegisterElement;
        public colorAddTarget: away.materials.ShaderRegisterElement;
        public colorMulTarget: away.materials.ShaderRegisterElement;
        public colorAddVary: away.materials.ShaderRegisterElement;
        public colorMulVary: away.materials.ShaderRegisterElement;
        public uvVar: away.materials.ShaderRegisterElement;
        public rotationRegisters: away.materials.ShaderRegisterElement[];
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
        public setRegisterIndex(node: animators.AnimationNodeBase, parameterIndex: number, registerIndex: number): void;
        public getRegisterIndex(node: animators.AnimationNodeBase, parameterIndex: number): number;
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
        public setVertexConstFromMatrix(index: number, matrix: away.geom.Matrix3D): void;
        public setFragmentConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
    }
}
declare module away.animators {
    class AnimationSubGeometry {
        static SUBGEOM_ID_COUNT: number;
        public _pVertexData: number[];
        public _pVertexBuffer: away.display3D.VertexBuffer3D[];
        public _pBufferContext: away.display3D.Context3D[];
        public _pBufferDirty: Boolean[];
        private _numVertices;
        private _totalLenOfOneVertex;
        public numProcessedVertices: number;
        public previousTime: number;
        public animationParticles: animators.ParticleAnimationData[];
        public _iUniqueId: number;
        constructor();
        public createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
        public activateVertexBuffer(index: number, bufferOffset: number, stage3DProxy: away.managers.Stage3DProxy, format: string): void;
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
        constructor(life: number, color: away.geom.ColorTransform);
        public color : away.geom.ColorTransform;
        public life : number;
    }
}
declare module away.animators {
    class JointPose {
        public name: string;
        public orientation: away.math.Quaternion;
        public translation: away.geom.Vector3D;
        constructor();
        public toMatrix3D(target?: away.geom.Matrix3D): away.geom.Matrix3D;
        public copyFrom(pose: JointPose): void;
    }
}
declare module away.animators {
    class ParticleAnimationData {
        public index: number;
        public startTime: number;
        public totalTime: number;
        public duration: number;
        public delay: number;
        public startVertexIndex: number;
        public numVertices: number;
        constructor(index: number, startTime: number, duration: number, delay: number, particle: animators.ParticleData);
    }
}
declare module away.animators {
    class ParticleData {
        public particleIndex: number;
        public numVertices: number;
        public startVertexIndex: number;
        public subGeometry: away.base.CompactSubGeometry;
    }
}
declare module away.animators {
    class ParticleProperties {
        public index: number;
        public total: number;
        public startTime: number;
        public duration: number;
        public delay: number;
    }
}
declare module away.animators {
    class ParticlePropertiesMode {
        static GLOBAL: number;
        static LOCAL_STATIC: number;
        static LOCAL_DYNAMIC: number;
    }
}
declare module away.animators {
    class Skeleton extends away.library.NamedAssetBase implements away.library.IAsset {
        public joints: animators.SkeletonJoint[];
        public numJoints : number;
        constructor();
        public jointFromName(jointName: string): animators.SkeletonJoint;
        public jointIndexFromName(jointName: string): number;
        public dispose(): void;
        public assetType : string;
    }
}
declare module away.animators {
    class VertexAnimationMode {
        static ADDITIVE: string;
        static ABSOLUTE: string;
    }
}
declare module away.animators {
    class SkeletonJoint {
        public parentIndex: number;
        public name: string;
        public inverseBindPose: number[];
        constructor();
    }
}
declare module away.animators {
    class SkeletonPose extends away.library.NamedAssetBase implements away.library.IAsset {
        public jointPoses: animators.JointPose[];
        public numJointPoses : number;
        constructor();
        public assetType : string;
        public jointPoseFromName(jointName: string): animators.JointPose;
        public jointPoseIndexFromName(jointName: string): number;
        public clone(): SkeletonPose;
        public dispose(): void;
    }
}
declare module away.animators {
    class AnimationNodeBase extends away.library.NamedAssetBase implements away.library.IAsset {
        static ANIMATIONNODE_ID_COUNT: number;
        public _iUniqueId: number;
        public _pStateClass: any;
        public stateClass : any;
        constructor();
        public dispose(): void;
        public assetType : string;
    }
}
declare module away.animators {
    class AnimationClipNodeBase extends animators.AnimationNodeBase {
        public _pLooping: boolean;
        public _pTotalDuration: number;
        public _pLastFrame: number;
        public _pStitchDirty: boolean;
        public _pStitchFinalFrame: boolean;
        public _pNumFrames: number;
        public _pDurations: number[];
        public _pTotalDelta: away.geom.Vector3D;
        public fixedFrameRate: boolean;
        public looping : boolean;
        public stitchFinalFrame : boolean;
        public totalDuration : number;
        public totalDelta : away.geom.Vector3D;
        public lastFrame : number;
        public durations : number[];
        constructor();
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    class ParticleNodeBase extends animators.AnimationNodeBase {
        private _priority;
        public _pMode: number;
        public _pDataLength: number;
        public _pOneData: number[];
        public _iDataOffset: number;
        private static GLOBAL;
        private static LOCAL_STATIC;
        private static LOCAL_DYNAMIC;
        private static MODES;
        public mode : number;
        public priority : number;
        public dataLength : number;
        public oneData : number[];
        constructor(name: string, mode: number, dataLength: number, priority?: number);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAGALUVCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    class ParticleAccelerationNode extends animators.ParticleNodeBase {
        static ACCELERATION_INDEX: number;
        public _acceleration: away.geom.Vector3D;
        static ACCELERATION_VECTOR3D: string;
        constructor(mode: number, acceleration?: away.geom.Vector3D);
        public pGetAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleAccelerationState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleBezierCurveNode extends animators.ParticleNodeBase {
        static BEZIER_CONTROL_INDEX: number;
        static BEZIER_END_INDEX: number;
        public _iControlPoint: away.geom.Vector3D;
        public _iEndPoint: away.geom.Vector3D;
        static BEZIER_CONTROL_VECTOR3D: string;
        static BEZIER_END_VECTOR3D: string;
        constructor(mode: number, controlPoint?: away.geom.Vector3D, endPoint?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleBezierCurveState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleBillboardNode extends animators.ParticleNodeBase {
        static MATRIX_INDEX: number;
        public _iBillboardAxis: away.geom.Vector3D;
        constructor(billboardAxis?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleBillboardState;
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    class ParticleColorNode extends animators.ParticleNodeBase {
        static START_MULTIPLIER_INDEX: number;
        static DELTA_MULTIPLIER_INDEX: number;
        static START_OFFSET_INDEX: number;
        static DELTA_OFFSET_INDEX: number;
        static CYCLE_INDEX: number;
        public _iUsesMultiplier: boolean;
        public _iUsesOffset: boolean;
        public _iUsesCycle: boolean;
        public _iUsesPhase: boolean;
        public _iStartColor: away.geom.ColorTransform;
        public _iEndColor: away.geom.ColorTransform;
        public _iCycleDuration: number;
        public _iCyclePhase: number;
        static COLOR_START_COLORTRANSFORM: string;
        static COLOR_END_COLORTRANSFORM: string;
        constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, usesCycle?: boolean, usesPhase?: boolean, startColor?: away.geom.ColorTransform, endColor?: away.geom.ColorTransform, cycleDuration?: number, cyclePhase?: number);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleColorState;
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleFollowNode extends animators.ParticleNodeBase {
        static FOLLOW_POSITION_INDEX: number;
        static FOLLOW_ROTATION_INDEX: number;
        public _iUsesPosition: boolean;
        public _iUsesRotation: boolean;
        public _iSmooth: boolean;
        constructor(usesPosition?: boolean, usesRotation?: boolean, smooth?: boolean);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleFollowState;
    }
}
declare module away.animators {
    class ParticleInitialColorNode extends animators.ParticleNodeBase {
        static MULTIPLIER_INDEX: number;
        static OFFSET_INDEX: number;
        public _iUsesMultiplier: boolean;
        public _iUsesOffset: boolean;
        public _iInitialColor: away.geom.ColorTransform;
        static COLOR_INITIAL_COLORTRANSFORM: string;
        constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, initialColor?: away.geom.ColorTransform);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleOrbitNode extends animators.ParticleNodeBase {
        static ORBIT_INDEX: number;
        static EULERS_INDEX: number;
        public _iUsesEulers: boolean;
        public _iUsesCycle: boolean;
        public _iUsesPhase: boolean;
        public _iRadius: number;
        public _iCycleDuration: number;
        public _iCyclePhase: number;
        public _iEulers: away.geom.Vector3D;
        static ORBIT_VECTOR3D: string;
        constructor(mode: number, usesEulers?: boolean, usesCycle?: boolean, usesPhase?: boolean, radius?: number, cycleDuration?: number, cyclePhase?: number, eulers?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleOrbitState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleOscillatorNode extends animators.ParticleNodeBase {
        static OSCILLATOR_INDEX: number;
        public _iOscillator: away.geom.Vector3D;
        static OSCILLATOR_VECTOR3D: string;
        constructor(mode: number, oscillator?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleOscillatorState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticlePositionNode extends animators.ParticleNodeBase {
        static POSITION_INDEX: number;
        public _iPosition: away.geom.Vector3D;
        static POSITION_VECTOR3D: string;
        constructor(mode: number, position?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticlePositionState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleRotateToHeadingNode extends animators.ParticleNodeBase {
        static MATRIX_INDEX: number;
        constructor();
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleRotateToHeadingState;
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    class ParticleRotateToPositionNode extends animators.ParticleNodeBase {
        static MATRIX_INDEX: number;
        static POSITION_INDEX: number;
        public _iPosition: away.geom.Vector3D;
        static POSITION_VECTOR3D: string;
        constructor(mode: number, position?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleRotateToPositionState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleRotationalVelocityNode extends animators.ParticleNodeBase {
        static ROTATIONALVELOCITY_INDEX: number;
        public _iRotationalVelocity: away.geom.Vector3D;
        static ROTATIONALVELOCITY_VECTOR3D: string;
        constructor(mode: number, rotationalVelocity?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleRotationalVelocityState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleScaleNode extends animators.ParticleNodeBase {
        static SCALE_INDEX: number;
        public _iUsesCycle: boolean;
        public _iUsesPhase: boolean;
        public _iMinScale: number;
        public _iMaxScale: number;
        public _iCycleDuration: number;
        public _iCyclePhase: number;
        static SCALE_VECTOR3D: string;
        constructor(mode: number, usesCycle: boolean, usesPhase: boolean, minScale?: number, maxScale?: number, cycleDuration?: number, cyclePhase?: number);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleScaleState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleSegmentedColorNode extends animators.ParticleNodeBase {
        static START_MULTIPLIER_INDEX: number;
        static START_OFFSET_INDEX: number;
        static TIME_DATA_INDEX: number;
        public _iUsesMultiplier: boolean;
        public _iUsesOffset: boolean;
        public _iStartColor: away.geom.ColorTransform;
        public _iEndColor: away.geom.ColorTransform;
        public _iNumSegmentPoint: number;
        public _iSegmentPoints: animators.ColorSegmentPoint[];
        constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: away.geom.ColorTransform, endColor: away.geom.ColorTransform, segmentPoints: animators.ColorSegmentPoint[]);
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
    }
}
declare module away.animators {
    class ParticleSpriteSheetNode extends animators.ParticleNodeBase {
        static UV_INDEX_0: number;
        static UV_INDEX_1: number;
        public _iUsesCycle: boolean;
        public _iUsesPhase: boolean;
        public _iTotalFrames: number;
        public _iNumColumns: number;
        public _iNumRows: number;
        public _iCycleDuration: number;
        public _iCyclePhase: number;
        static UV_VECTOR3D: string;
        public numColumns : number;
        public numRows : number;
        public totalFrames : number;
        constructor(mode: number, usesCycle: boolean, usesPhase: boolean, numColumns?: number, numRows?: number, cycleDuration?: number, cyclePhase?: number, totalFrames?: number);
        public getAGALUVCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleSpriteSheetState;
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleTimeNode extends animators.ParticleNodeBase {
        static TIME_STREAM_INDEX: number;
        static TIME_CONSTANT_INDEX: number;
        public _iUsesDuration: boolean;
        public _iUsesDelay: boolean;
        public _iUsesLooping: boolean;
        constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleTimeState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleUVNode extends animators.ParticleNodeBase {
        static UV_INDEX: number;
        public _iUvData: away.geom.Vector3D;
        static U_AXIS: string;
        static V_AXIS: string;
        private _cycle;
        private _scale;
        private _axis;
        constructor(mode: number, cycle?: number, scale?: number, axis?: string);
        public cycle : number;
        public scale : number;
        public axis : string;
        public getAGALUVCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleUVState;
        private updateUVData();
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    class ParticleVelocityNode extends animators.ParticleNodeBase {
        static VELOCITY_INDEX: number;
        public _iVelocity: away.geom.Vector3D;
        static VELOCITY_VECTOR3D: string;
        constructor(mode: number, velocity?: away.geom.Vector3D);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        public getAnimationState(animator: animators.IAnimator): animators.ParticleVelocityState;
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class SkeletonBinaryLERPNode extends animators.AnimationNodeBase {
        public inputA: animators.AnimationNodeBase;
        public inputB: animators.AnimationNodeBase;
        constructor();
        public getAnimationState(animator: animators.IAnimator): animators.SkeletonBinaryLERPState;
    }
}
declare module away.animators {
    class SkeletonClipNode extends animators.AnimationClipNodeBase {
        private _frames;
        public highQuality: boolean;
        public frames : animators.SkeletonPose[];
        constructor();
        public addFrame(skeletonPose: animators.SkeletonPose, duration: number): void;
        public getAnimationState(animator: animators.IAnimator): animators.SkeletonClipState;
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    class SkeletonDifferenceNode extends animators.AnimationNodeBase {
        public baseInput: animators.AnimationNodeBase;
        public differenceInput: animators.AnimationNodeBase;
        constructor();
        public getAnimationState(animator: animators.IAnimator): animators.SkeletonDifferenceState;
    }
}
declare module away.animators {
    class SkeletonDirectionalNode extends animators.AnimationNodeBase {
        public forward: animators.AnimationNodeBase;
        public backward: animators.AnimationNodeBase;
        public left: animators.AnimationNodeBase;
        public right: animators.AnimationNodeBase;
        constructor();
        public getAnimationState(animator: animators.IAnimator): animators.SkeletonDirectionalState;
    }
}
declare module away.animators {
    class SkeletonNaryLERPNode extends animators.AnimationNodeBase {
        public _iInputs: animators.AnimationNodeBase[];
        private _numInputs;
        public numInputs : number;
        constructor();
        public getInputIndex(input: animators.AnimationNodeBase): number;
        public getInputAt(index: number): animators.AnimationNodeBase;
        public addInput(input: animators.AnimationNodeBase): void;
        public getAnimationState(animator: animators.IAnimator): animators.SkeletonNaryLERPState;
    }
}
declare module away.animators {
    class VertexClipNode extends animators.AnimationClipNodeBase {
        private _frames;
        private _translations;
        public frames : away.base.Geometry[];
        constructor();
        public addFrame(geometry: away.base.Geometry, duration: number, translation?: away.geom.Vector3D): void;
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    interface IAnimationState {
        positionDelta: away.geom.Vector3D;
        offset(startTime: number): any;
        update(time: number): any;
        phase(value: number): any;
    }
}
declare module away.animators {
    interface ISkeletonAnimationState extends animators.IAnimationState {
        getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
    }
}
declare module away.animators {
    interface IVertexAnimationState extends animators.IAnimationState {
        currentGeometry: away.base.Geometry;
        nextGeometry: away.base.Geometry;
        blendWeight: number;
    }
}
declare module away.animators {
    class AnimationStateBase implements animators.IAnimationState {
        public _pAnimationNode: animators.AnimationNodeBase;
        public _pRootDelta: away.geom.Vector3D;
        public _pPositionDeltaDirty: boolean;
        public _pTime: number;
        public _pStartTime: number;
        public _pAnimator: animators.IAnimator;
        public positionDelta : away.geom.Vector3D;
        constructor(animator: animators.IAnimator, animationNode: animators.AnimationNodeBase);
        public offset(startTime: number): void;
        public update(time: number): void;
        public phase(value: number): void;
        public _pUpdateTime(time: number): void;
        public _pUpdatePositionDelta(): void;
    }
}
declare module away.animators {
    class ParticleStateBase extends animators.AnimationStateBase {
        private _particleNode;
        public _pDynamicProperties: away.geom.Vector3D[];
        public _pDynamicPropertiesDirty: Object;
        public _pNeedUpdateTime: boolean;
        constructor(animator: animators.ParticleAnimator, particleNode: animators.ParticleNodeBase, needUpdateTime?: boolean);
        public needUpdateTime : boolean;
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        public _pUpdateDynamicProperties(animationSubGeometry: animators.AnimationSubGeometry): void;
    }
}
declare module away.animators {
    class ParticleAccelerationState extends animators.ParticleStateBase {
        private _particleAccelerationNode;
        private _acceleration;
        private _halfAcceleration;
        public acceleration : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleAccelerationNode: animators.ParticleAccelerationNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateAccelerationData();
    }
}
declare module away.animators {
    class ParticleBezierCurveState extends animators.ParticleStateBase {
        private _particleBezierCurveNode;
        private _controlPoint;
        private _endPoint;
        public controlPoint : away.geom.Vector3D;
        public endPoint : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleBezierCurveNode: animators.ParticleBezierCurveNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class ParticleBillboardState extends animators.ParticleStateBase {
        private _matrix;
        private _billboardAxis;
        constructor(animator: animators.ParticleAnimator, particleNode: animators.ParticleBillboardNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        public billboardAxis : away.geom.Vector3D;
    }
}
declare module away.animators {
    class ParticleColorState extends animators.ParticleStateBase {
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
        public startColor : away.geom.ColorTransform;
        public endColor : away.geom.ColorTransform;
        public cycleDuration : number;
        public cyclePhase : number;
        constructor(animator: animators.ParticleAnimator, particleColorNode: animators.ParticleColorNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateColorData();
    }
}
declare module away.animators {
    class ParticleFollowState extends animators.ParticleStateBase {
        private _particleFollowNode;
        private _followTarget;
        private _targetPos;
        private _targetEuler;
        private _prePos;
        private _preEuler;
        private _smooth;
        private _temp;
        constructor(animator: animators.ParticleAnimator, particleFollowNode: animators.ParticleFollowNode);
        public followTarget : away.base.Object3D;
        public smooth : boolean;
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private processPosition(currentTime, deltaTime, animationSubGeometry);
        private precessRotation(currentTime, deltaTime, animationSubGeometry);
        private processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);
    }
}
declare module away.animators {
    class ParticleInitialColorState extends animators.ParticleStateBase {
        private _particleInitialColorNode;
        private _usesMultiplier;
        private _usesOffset;
        private _initialColor;
        private _multiplierData;
        private _offsetData;
        constructor(animator: animators.ParticleAnimator, particleInitialColorNode: animators.ParticleInitialColorNode);
        public initialColor : away.geom.ColorTransform;
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateColorData();
    }
}
declare module away.animators {
    class ParticleOrbitState extends animators.ParticleStateBase {
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
        public radius : number;
        public cycleDuration : number;
        public cyclePhase : number;
        public eulers : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleOrbitNode: animators.ParticleOrbitNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateOrbitData();
    }
}
declare module away.animators {
    class ParticleOscillatorState extends animators.ParticleStateBase {
        private _particleOscillatorNode;
        private _oscillator;
        private _oscillatorData;
        public oscillator : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleOscillatorNode: animators.ParticleOscillatorNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateOscillatorData();
    }
}
declare module away.animators {
    class ParticlePositionState extends animators.ParticleStateBase {
        private _particlePositionNode;
        private _position;
        public position : away.geom.Vector3D;
        public getPositions(): away.geom.Vector3D[];
        public setPositions(value: away.geom.Vector3D[]): void;
        constructor(animator: animators.ParticleAnimator, particlePositionNode: animators.ParticlePositionNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class ParticleRotateToHeadingState extends animators.ParticleStateBase {
        private _matrix;
        constructor(animator: animators.ParticleAnimator, particleNode: animators.ParticleNodeBase);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class ParticleRotateToPositionState extends animators.ParticleStateBase {
        private _particleRotateToPositionNode;
        private _position;
        private _matrix;
        private _offset;
        public position : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleRotateToPositionNode: animators.ParticleRotateToPositionNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class ParticleRotationalVelocityState extends animators.ParticleStateBase {
        private _particleRotationalVelocityNode;
        private _rotationalVelocityData;
        private _rotationalVelocity;
        public rotationalVelocity : away.geom.Vector3D;
        public getRotationalVelocities(): away.geom.Vector3D[];
        public setRotationalVelocities(value: away.geom.Vector3D[]): void;
        constructor(animator: animators.ParticleAnimator, particleRotationNode: animators.ParticleRotationalVelocityNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateRotationalVelocityData();
    }
}
declare module away.animators {
    class ParticleScaleState extends animators.ParticleStateBase {
        private _particleScaleNode;
        private _usesCycle;
        private _usesPhase;
        private _minScale;
        private _maxScale;
        private _cycleDuration;
        private _cyclePhase;
        private _scaleData;
        public minScale : number;
        public maxScale : number;
        public cycleDuration : number;
        public cyclePhase : number;
        constructor(animator: animators.ParticleAnimator, particleScaleNode: animators.ParticleScaleNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateScaleData();
    }
}
declare module away.animators {
    class ParticleSegmentedColorState extends animators.ParticleStateBase {
        private _usesMultiplier;
        private _usesOffset;
        private _startColor;
        private _endColor;
        private _segmentPoints;
        private _numSegmentPoint;
        private _timeLifeData;
        private _multiplierData;
        private _offsetData;
        public startColor : away.geom.ColorTransform;
        public endColor : away.geom.ColorTransform;
        public numSegmentPoint : number;
        public segmentPoints : animators.ColorSegmentPoint[];
        public usesMultiplier : boolean;
        public usesOffset : boolean;
        constructor(animator: animators.ParticleAnimator, particleSegmentedColorNode: animators.ParticleSegmentedColorNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateColorData();
    }
}
declare module away.animators {
    class ParticleSpriteSheetState extends animators.ParticleStateBase {
        private _particleSpriteSheetNode;
        private _usesCycle;
        private _usesPhase;
        private _totalFrames;
        private _numColumns;
        private _numRows;
        private _cycleDuration;
        private _cyclePhase;
        private _spriteSheetData;
        public cyclePhase : number;
        public cycleDuration : number;
        constructor(animator: animators.ParticleAnimator, particleSpriteSheetNode: animators.ParticleSpriteSheetNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
        private updateSpriteSheetData();
    }
}
declare module away.animators {
    class ParticleTimeState extends animators.ParticleStateBase {
        private _particleTimeNode;
        constructor(animator: animators.ParticleAnimator, particleTimeNode: animators.ParticleTimeNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class ParticleUVState extends animators.ParticleStateBase {
        private _particleUVNode;
        constructor(animator: animators.ParticleAnimator, particleUVNode: animators.ParticleUVNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class ParticleVelocityState extends animators.ParticleStateBase {
        private _particleVelocityNode;
        private _velocity;
        public velocity : away.geom.Vector3D;
        public getVelocities(): away.geom.Vector3D[];
        public setVelocities(value: away.geom.Vector3D[]): void;
        constructor(animator: animators.ParticleAnimator, particleVelocityNode: animators.ParticleVelocityNode);
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.cameras.Camera3D): void;
    }
}
declare module away.animators {
    class AnimationClipState extends animators.AnimationStateBase {
        private _animationClipNode;
        private _animationStatePlaybackComplete;
        public _pBlendWeight: number;
        public _pCurrentFrame: number;
        public _pNextFrame: number;
        public _pOldFrame: number;
        public _pTimeDir: number;
        public _pFramesDirty: boolean;
        public blendWeight : number;
        public currentFrame : number;
        public nextFrame : number;
        constructor(animator: animators.IAnimator, animationClipNode: animators.AnimationClipNodeBase);
        public update(time: number): void;
        public phase(value: number): void;
        public _pUpdateTime(time: number): void;
        public _pUpdateFrames(): void;
        private notifyPlaybackComplete();
    }
}
declare module away.animators {
    class SkeletonBinaryLERPState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
        private _blendWeight;
        private _skeletonAnimationNode;
        private _skeletonPose;
        private _skeletonPoseDirty;
        private _inputA;
        private _inputB;
        public blendWeight : number;
        constructor(animator: animators.IAnimator, skeletonAnimationNode: animators.SkeletonBinaryLERPNode);
        public phase(value: number): void;
        public _pUpdateTime(time: number): void;
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
        public _pUpdatePositionDelta(): void;
        private updateSkeletonPose(skeleton);
    }
}
declare module away.animators {
    class SkeletonClipState extends animators.AnimationClipState implements animators.ISkeletonAnimationState {
        private _rootPos;
        private _frames;
        private _skeletonClipNode;
        private _skeletonPose;
        private _skeletonPoseDirty;
        private _currentPose;
        private _nextPose;
        public currentPose : animators.SkeletonPose;
        public nextPose : animators.SkeletonPose;
        constructor(animator: animators.IAnimator, skeletonClipNode: animators.SkeletonClipNode);
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
        public _pUpdateTime(time: number): void;
        public _pUpdateFrames(): void;
        private updateSkeletonPose(skeleton);
        public _pUpdatePositionDelta(): void;
    }
}
declare module away.animators {
    class SkeletonDifferenceState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
        private _blendWeight;
        private static _tempQuat;
        private _skeletonAnimationNode;
        private _skeletonPose;
        private _skeletonPoseDirty;
        private _baseInput;
        private _differenceInput;
        public blendWeight : number;
        constructor(animator: animators.IAnimator, skeletonAnimationNode: animators.SkeletonDifferenceNode);
        public phase(value: number): void;
        public _pUpdateTime(time: number): void;
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
        public _pUpdatePositionDelta(): void;
        private updateSkeletonPose(skeleton);
    }
}
declare module away.animators {
    class SkeletonDirectionalState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
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
        public direction : number;
        constructor(animator: animators.IAnimator, skeletonAnimationNode: animators.SkeletonDirectionalNode);
        public phase(value: number): void;
        public _pUdateTime(time: number): void;
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
        public _pUpdatePositionDelta(): void;
        private updateSkeletonPose(skeleton);
        private updateBlend();
    }
}
declare module away.animators {
    class SkeletonNaryLERPState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
        private _skeletonAnimationNode;
        private _skeletonPose;
        private _skeletonPoseDirty;
        private _blendWeights;
        private _inputs;
        constructor(animator: animators.IAnimator, skeletonAnimationNode: animators.SkeletonNaryLERPNode);
        public phase(value: number): void;
        public _pUdateTime(time: number): void;
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
        public getBlendWeightAt(index: number): number;
        public setBlendWeightAt(index: number, blendWeight: number): void;
        public _pUpdatePositionDelta(): void;
        private updateSkeletonPose(skeleton);
    }
}
declare module away.animators {
    class VertexClipState extends animators.AnimationClipState implements animators.IVertexAnimationState {
        private _frames;
        private _vertexClipNode;
        private _currentGeometry;
        private _nextGeometry;
        public currentGeometry : away.base.Geometry;
        public nextGeometry : away.base.Geometry;
        constructor(animator: animators.IAnimator, vertexClipNode: animators.VertexClipNode);
        public _pUpdateFrames(): void;
        public _pUpdatePositionDelta(): void;
    }
}
declare module away.animators {
    interface IAnimationTransition {
        getAnimationNode(animator: animators.IAnimator, startNode: animators.AnimationNodeBase, endNode: animators.AnimationNodeBase, startTime: number): animators.AnimationNodeBase;
    }
}
declare module away.animators {
    class CrossfadeTransition implements animators.IAnimationTransition {
        public blendSpeed: number;
        constructor(blendSpeed: number);
        public getAnimationNode(animator: animators.IAnimator, startNode: animators.AnimationNodeBase, endNode: animators.AnimationNodeBase, startBlend: number): animators.AnimationNodeBase;
    }
}
declare module away.animators {
    class CrossfadeTransitionNode extends animators.SkeletonBinaryLERPNode {
        public blendSpeed: number;
        public startBlend: number;
        constructor();
    }
}
declare module away.animators {
    class CrossfadeTransitionState extends animators.SkeletonBinaryLERPState {
        private _crossfadeTransitionNode;
        private _animationStateTransitionComplete;
        constructor(animator: animators.IAnimator, skeletonAnimationNode: animators.CrossfadeTransitionNode);
        public _pUpdateTime(time: number): void;
    }
}
declare module away.animators {
    class AnimationSetBase extends away.library.NamedAssetBase implements away.library.IAsset {
        private _usesCPU;
        private _animations;
        private _animationNames;
        private _animationDictionary;
        constructor();
        public _pFindTempReg(exclude: string[], excludeAnother?: string): string;
        public usesCPU : boolean;
        public resetGPUCompatibility(): void;
        public cancelGPUCompatibility(): void;
        public assetType : string;
        public animations : animators.AnimationNodeBase[];
        public animationNames : string[];
        public hasAnimation(name: string): boolean;
        public getAnimation(name: string): animators.AnimationNodeBase;
        public addAnimation(node: animators.AnimationNodeBase): void;
        public dispose(): void;
    }
}
declare module away.animators {
    class AnimatorBase extends away.library.NamedAssetBase implements away.library.IAsset {
        private _broadcaster;
        private _isPlaying;
        private _autoUpdate;
        private _startEvent;
        private _stopEvent;
        private _cycleEvent;
        private _time;
        private _playbackSpeed;
        public _pAnimationSet: animators.IAnimationSet;
        public _pOwners: away.entities.Mesh[];
        public _pActiveNode: animators.AnimationNodeBase;
        public _pActiveState: animators.IAnimationState;
        public _pActiveAnimationName: string;
        public _pAbsoluteTime: number;
        private _animationStates;
        public updatePosition: boolean;
        public getAnimationState(node: animators.AnimationNodeBase): animators.AnimationStateBase;
        public getAnimationStateByName(name: string): animators.AnimationStateBase;
        public absoluteTime : number;
        public animationSet : animators.IAnimationSet;
        public activeState : animators.IAnimationState;
        public activeAnimation : animators.AnimationNodeBase;
        public activeAnimationName : string;
        public autoUpdate : boolean;
        public time : number;
        public phase(value: number): void;
        constructor(animationSet: animators.IAnimationSet);
        public playbackSpeed : number;
        public start(): void;
        public stop(): void;
        public update(time: number): void;
        public reset(name: string, offset?: number): void;
        public addOwner(mesh: away.entities.Mesh): void;
        public removeOwner(mesh: away.entities.Mesh): void;
        public _pUpdateDeltaTime(dt: number): void;
        private onEnterFrame(event?);
        private applyPositionDelta();
        public dispatchCycleEvent(): void;
        public dispose(): void;
        public assetType : string;
    }
}
declare module away.animators {
    interface IAnimationSet {
        hasAnimation(name: string): boolean;
        getAnimation(name: string): animators.AnimationNodeBase;
        usesCPU: boolean;
        resetGPUCompatibility(): any;
        cancelGPUCompatibility(): any;
        getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        doneAGALCode(pass: away.materials.MaterialPassBase): any;
        activate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): any;
        deactivate(tage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): any;
    }
}
declare module away.animators {
    interface IAnimator {
        animationSet: animators.IAnimationSet;
        setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.cameras.Camera3D): any;
        testGPUCompatibility(pass: away.materials.MaterialPassBase): any;
        addOwner(mesh: away.entities.Mesh): any;
        removeOwner(mesh: away.entities.Mesh): any;
        getAnimationState(node: animators.AnimationNodeBase): animators.IAnimationState;
        getAnimationStateByName(name: string): animators.IAnimationState;
        clone(): IAnimator;
        dispose(): any;
    }
}
declare module away.animators {
    class ParticleAnimationSet extends animators.AnimationSetBase implements animators.IAnimationSet {
        public _iAnimationRegisterCache: animators.AnimationRegisterCache;
        private _timeNode;
        static POST_PRIORITY: number;
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
        public initParticleFunc: Function;
        public initParticleScope: Object;
        constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
        public particleNodes : animators.ParticleNodeBase[];
        public addAnimation(node: animators.AnimationNodeBase): void;
        public activate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): void;
        public deactivate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): void;
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        public getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        public doneAGALCode(pass: away.materials.MaterialPassBase): void;
        public usesCPU : boolean;
        public cancelGPUCompatibility(): void;
        public dispose(): void;
        public _iGenerateAnimationSubGeometries(mesh: away.entities.Mesh): void;
    }
}
declare module away.animators {
    class ParticleAnimator extends animators.AnimatorBase implements animators.IAnimator {
        private _particleAnimationSet;
        private _animationParticleStates;
        private _animatorParticleStates;
        private _timeParticleStates;
        private _totalLenOfOneVertex;
        private _animatorSubGeometries;
        constructor(particleAnimationSet: animators.ParticleAnimationSet);
        public clone(): animators.IAnimator;
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.cameras.Camera3D): void;
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
        public start(): void;
        public _pUpdateDeltaTime(dt: number): void;
        public resetTime(offset?: number): void;
        public dispose(): void;
        private generateAnimatorSubGeometry(subMesh);
    }
}
declare module away.animators {
    class SkeletonAnimator extends animators.AnimatorBase implements animators.IAnimator {
        private _globalMatrices;
        private _globalPose;
        private _globalPropertiesDirty;
        private _numJoints;
        private _subGeomAnimationStates;
        private _condensedMatrices;
        private _skeleton;
        private _forceCPU;
        private _useCondensedIndices;
        private _jointsPerVertex;
        private _activeSkeletonState;
        public globalMatrices : number[];
        public globalPose : animators.SkeletonPose;
        public skeleton : animators.Skeleton;
        public forceCPU : boolean;
        public useCondensedIndices : boolean;
        constructor(animationSet: animators.SkeletonAnimationSet, skeleton: animators.Skeleton, forceCPU?: boolean);
        public clone(): animators.IAnimator;
        public play(name: string, transition?: animators.IAnimationTransition, offset?: number): void;
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.cameras.Camera3D): void;
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
        public _pUpdateDeltaTime(dt: number): void;
        private updateCondensedMatrices(condensedIndexLookUp, numJoints);
        private updateGlobalProperties();
        private morphGeometry(state, subGeom);
        private localToGlobalPose(sourcePose, targetPose, skeleton);
        private onTransitionComplete(event);
    }
}
declare class SubGeomAnimationState {
    public animatedVertexData: number[];
    public dirty: boolean;
    constructor(subGeom: away.base.CompactSubGeometry);
}
declare module away.animators {
    class SkeletonAnimationSet extends animators.AnimationSetBase implements animators.IAnimationSet {
        private _jointsPerVertex;
        public jointsPerVertex : number;
        constructor(jointsPerVertex?: number);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        public activate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): void;
        public deactivate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): void;
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        public getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        public doneAGALCode(pass: away.materials.MaterialPassBase): void;
    }
}
declare module away.animators {
    class VertexAnimationSet extends animators.AnimationSetBase implements animators.IAnimationSet {
        private _numPoses;
        private _blendMode;
        private _streamIndices;
        private _useNormals;
        private _useTangents;
        private _uploadNormals;
        private _uploadTangents;
        public numPoses : number;
        public blendMode : string;
        public useNormals : boolean;
        constructor(numPoses?: number, blendMode?: string);
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        public activate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): void;
        public deactivate(stage3DProxy: away.managers.Stage3DProxy, pass: away.materials.MaterialPassBase): void;
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        public getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        public doneAGALCode(pass: away.materials.MaterialPassBase): void;
        private getAbsoluteAGALCode(pass, sourceRegisters, targetRegisters);
        private getAdditiveAGALCode(pass, sourceRegisters, targetRegisters);
    }
}
declare module away.animators {
    class VertexAnimator extends animators.AnimatorBase implements animators.IAnimator {
        private _vertexAnimationSet;
        private _poses;
        private _weights;
        private _numPoses;
        private _blendMode;
        private _activeVertexState;
        constructor(vertexAnimationSet: animators.VertexAnimationSet);
        public clone(): animators.IAnimator;
        public play(name: string, transition?: animators.IAnimationTransition, offset?: number): void;
        public _pUpdateDeltaTime(dt: number): void;
        public setRenderState(stage3DProxy: away.managers.Stage3DProxy, renderable: away.base.IRenderable, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.cameras.Camera3D): void;
        private setNullPose(stage3DProxy, renderable, vertexConstantOffset, vertexStreamOffset);
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
    }
}
declare module away.loaders {
    class AssetLoaderContext {
        static UNDEFINED: number;
        static SINGLEPASS_MATERIALS: number;
        static MULTIPASS_MATERIALS: number;
        private _includeDependencies;
        private _dependencyBaseUrl;
        private _embeddedDataByUrl;
        private _remappedUrls;
        private _materialMode;
        private _overrideAbsPath;
        private _overrideFullUrls;
        constructor(includeDependencies?: boolean, dependencyBaseUrl?: string);
        public includeDependencies : boolean;
        public materialMode : number;
        public dependencyBaseUrl : string;
        public overrideAbsolutePaths : boolean;
        public overrideFullURLs : boolean;
        public mapUrl(originalUrl: string, newUrl: string): void;
        public mapUrlToData(originalUrl: string, data: any): void;
        public _iHasDataForUrl(url: string): boolean;
        public _iGetDataForUrl(url: string): any;
        public _iHasMappingForUrl(url: string): boolean;
        public _iGetRemappedUrl(originalUrl: string): string;
    }
}
declare module away.loaders {
    class AssetLoader extends away.events.EventDispatcher {
        private _context;
        private _token;
        private _uri;
        private _errorHandlers;
        private _parseErrorHandlers;
        private _stack;
        private _baseDependency;
        private _loadingDependency;
        private _namespace;
        public baseDependency : loaders.ResourceDependency;
        constructor();
        static enableParser(parserClass: any): void;
        static enableParsers(parserClasses: Object[]): void;
        public load(req: away.net.URLRequest, context?: loaders.AssetLoaderContext, ns?: string, parser?: loaders.ParserBase): loaders.AssetLoaderToken;
        public loadData(data: any, id: string, context?: loaders.AssetLoaderContext, ns?: string, parser?: loaders.ParserBase): loaders.AssetLoaderToken;
        private retrieveNext(parser?);
        private retrieveDependency(dependency, parser?);
        private joinUrl(base, end);
        private resolveDependencyUrl(dependency);
        private retrieveLoaderDependencies(loader);
        private onRetrievalFailed(event);
        private onParserError(event);
        private onAssetComplete(event);
        private onReadyForDependencies(event);
        private onRetrievalComplete(event);
        private onTextureSizeError(event);
        private addEventListeners(loader);
        private removeEventListeners(loader);
        public stop(): void;
        private dispose();
        public _iAddParseErrorHandler(handler: any): void;
        public _iAddErrorHandler(handler: any): void;
    }
}
declare module away.loaders {
    class AssetLoaderToken extends away.events.EventDispatcher {
        public _iLoader: loaders.AssetLoader;
        constructor(loader: loaders.AssetLoader);
        public addEventListener(type: string, listener: Function, target: Object): void;
        public removeEventListener(type: string, listener: Function, target: Object): void;
        public hasEventListener(type: string, listener?: Function, target?: Object): boolean;
    }
}
declare module away.loaders {
    class ParserBase extends away.events.EventDispatcher {
        public _iFileName: string;
        private _dataFormat;
        private _data;
        private _frameLimit;
        private _lastFrameTime;
        static supportsType(extension: string): boolean;
        private _dependencies;
        private _loaderType;
        private _parsingPaused;
        private _parsingComplete;
        private _parsingFailure;
        private _timer;
        private _materialMode;
        static PARSING_DONE: boolean;
        static MORE_TO_PARSE: boolean;
        constructor(format: string, loaderType?: string);
        public isBitmapDataValid(bitmapData: away.display.BitmapData): boolean;
        public parsingFailure : boolean;
        public parsingPaused : boolean;
        public parsingComplete : boolean;
        public materialMode : number;
        public loaderType : string;
        public data : any;
        public dataFormat : string;
        public parseAsync(data: any, frameLimit?: number): void;
        public dependencies : loaders.ResourceDependency[];
        public _iResolveDependency(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyFailure(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyName(resourceDependency: loaders.ResourceDependency, asset: away.library.IAsset): string;
        public _iResumeParsingAfterDependencies(): void;
        public _pFinalizeAsset(asset: away.library.IAsset, name?: string): void;
        public _pProceedParsing(): boolean;
        public _pDieWithError(message?: string): void;
        public _pAddDependency(id: string, req: away.net.URLRequest, retrieveAsRawData?: boolean, data?: any, suppressErrorEvents?: boolean): loaders.ResourceDependency;
        public _pPauseAndRetrieveDependencies(): void;
        public _pHasTime(): boolean;
        public _pOnInterval(event?: away.events.TimerEvent): void;
        private startParsing(frameLimit);
        public _pFinishParsing(): void;
        public _pGetTextData(): string;
        public _pGetByteData(): away.utils.ByteArray;
    }
}
declare module away.loaders {
    class Loader3D extends away.containers.ObjectContainer3D {
        private _loadingSessions;
        private _useAssetLib;
        private _assetLibId;
        constructor(useAssetLibrary?: boolean, assetLibraryId?: string);
        public load(req: away.net.URLRequest, context?: loaders.AssetLoaderContext, ns?: string, parser?: loaders.ParserBase): loaders.AssetLoaderToken;
        public loadData(data: any, context?: loaders.AssetLoaderContext, ns?: string, parser?: loaders.ParserBase): loaders.AssetLoaderToken;
        public stopLoad(): void;
        static enableParser(parserClass: Object): void;
        static enableParsers(parserClasses: Object[]): void;
        private removeListeners(dispatcher);
        private onAssetComplete(ev);
        private onDependencyRetrievingError(event);
        private onDependencyRetrievingParseError(event);
        private onResourceRetrieved(event);
    }
}
declare module away.loaders {
    interface ISingleFileTSLoader extends away.events.EventDispatcher {
        data: any;
        dataFormat: string;
        load(rep: away.net.URLRequest): void;
        dispose(): void;
    }
}
declare module away.loaders {
    class ParserDataFormat {
        static BINARY: string;
        static PLAIN_TEXT: string;
        static IMAGE: string;
    }
}
declare module away.loaders {
    class ImageParser extends loaders.ParserBase {
        private _startedParsing;
        private _doneParsing;
        constructor();
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _pProceedParsing(): boolean;
    }
}
declare module away.loaders {
    class CubeTextureParser extends loaders.ParserBase {
        private static posX;
        private static negX;
        private static posY;
        private static negY;
        private static posZ;
        private static negZ;
        private _imgDependencyDictionary;
        constructor();
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _iResolveDependency(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyFailure(resourceDependency: loaders.ResourceDependency): void;
        public _pProceedParsing(): boolean;
        private _validateCubeData();
        private _getHTMLImageElement(name);
    }
}
declare module away.loaders {
    class SingleFileLoader extends away.events.EventDispatcher {
        private _parser;
        private _assets;
        private _req;
        private _fileExtension;
        private _fileName;
        private _loadAsRawData;
        private _materialMode;
        private _data;
        private static _parsers;
        static enableParser(parser: Object): void;
        static enableParsers(parsers: Object[]): void;
        constructor(materialMode?: number);
        public url : string;
        public data : any;
        public loadAsRawData : boolean;
        public load(urlRequest: away.net.URLRequest, parser?: loaders.ParserBase, loadAsRawData?: boolean): void;
        public parseData(data: any, parser?: loaders.ParserBase, req?: away.net.URLRequest): void;
        public parser : loaders.ParserBase;
        public dependencies : loaders.ResourceDependency[];
        private getLoader(loaderType);
        private decomposeFilename(url);
        private getParserFromSuffix();
        private getParserFromData(data);
        private removeListeners(urlLoader);
        private handleUrlLoaderError(event);
        private handleUrlLoaderComplete(event);
        private parse(data);
        private onParseError(event);
        private onReadyForDependencies(event);
        private onAssetComplete(event);
        private onTextureSizeError(event);
        private onParseComplete(event);
    }
}
declare module away.loaders {
    class SingleFileImageLoader extends away.events.EventDispatcher implements loaders.ISingleFileTSLoader {
        private _loader;
        private _data;
        private _dataFormat;
        constructor();
        public load(req: away.net.URLRequest): void;
        public dispose(): void;
        public data : HTMLImageElement;
        public dataFormat : string;
        private initLoader();
        private disposeLoader();
        private onLoadComplete(event);
        private onLoadError(event);
    }
}
declare module away.loaders {
    class SingleFileURLLoader extends away.events.EventDispatcher implements loaders.ISingleFileTSLoader {
        private _loader;
        private _data;
        constructor();
        public load(req: away.net.URLRequest): void;
        public dispose(): void;
        public data : HTMLImageElement;
        public dataFormat : string;
        private initLoader();
        private disposeLoader();
        private onLoadComplete(event);
        private onLoadError(event);
    }
}
declare module away.loaders {
    class ResourceDependency {
        private _id;
        private _req;
        private _assets;
        private _parentParser;
        private _data;
        private _retrieveAsRawData;
        private _suppressAssetEvents;
        private _dependencies;
        public _iLoader: loaders.SingleFileLoader;
        public _iSuccess: boolean;
        constructor(id: string, req: away.net.URLRequest, data: any, parentParser: loaders.ParserBase, retrieveAsRawData?: boolean, suppressAssetEvents?: boolean);
        public id : string;
        public assets : away.library.IAsset[];
        public dependencies : ResourceDependency[];
        public request : away.net.URLRequest;
        public retrieveAsRawData : boolean;
        public suppresAssetEvents : boolean;
        public data : any;
        public _iSetData(data: any): void;
        public parentParser : loaders.ParserBase;
        public resolve(): void;
        public resolveFailure(): void;
        public resolveName(asset: away.library.IAsset): string;
    }
}
declare module away.loaders {
    class ParserLoaderType {
        static URL_LOADER: string;
        static IMG_LOADER: string;
    }
}
declare module away.loaders {
    class ParserUtil {
        static byteArrayToImage(data: away.utils.ByteArray): HTMLImageElement;
        static toByteArray(data: any): away.utils.ByteArray;
        static toString(data: any, length?: number): string;
    }
}
declare module away.loaders {
    class OBJParser extends loaders.ParserBase {
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
        constructor(scale?: number);
        public scale : number;
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _iResolveDependency(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyFailure(resourceDependency: loaders.ResourceDependency): void;
        public _pProceedParsing(): boolean;
        private parseLine(trunk);
        private translate();
        private translateMaterialGroup(materialGroup, geometry);
        private translateVertexData(face, vertexIndex, vertices, uvs, indices, normals);
        private createObject(trunk);
        private createGroup(trunk);
        private createMaterialGroup(trunk);
        private parseVertex(trunk);
        private parseUV(trunk);
        private parseVertexNormal(trunk);
        private parseFace(trunk);
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
    constructor();
}
declare class Group {
    public name: string;
    public materialID: string;
    public materialGroups: MaterialGroup[];
    constructor();
}
declare class MaterialGroup {
    public url: string;
    public faces: FaceData[];
    constructor();
}
declare class SpecularData {
    public materialID: string;
    public basicSpecularMethod: away.materials.BasicSpecularMethod;
    public ambientColor: number;
    public alpha: number;
    constructor();
}
declare class LoadedMaterial {
    public materialID: string;
    public texture: away.textures.Texture2DBase;
    public cm: away.materials.MaterialBase;
    public specularMethod: away.materials.BasicSpecularMethod;
    public ambientColor: number;
    public alpha: number;
    constructor();
}
declare class FaceData {
    public vertexIndices: number[];
    public uvIndices: number[];
    public normalIndices: number[];
    public indexIds: string[];
    constructor();
}
declare class UV {
    private _u;
    private _v;
    constructor(u?: number, v?: number);
    public v : number;
    public u : number;
    public clone(): UV;
    public toString(): string;
}
declare class Vertex {
    private _x;
    private _y;
    private _z;
    private _index;
    constructor(x?: number, y?: number, z?: number, index?: number);
    public index : number;
    public x : number;
    public y : number;
    public z : number;
    public clone(): Vertex;
    public FaceData(): void;
}
declare module away.loaders {
    class AWDParser extends loaders.ParserBase {
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
        constructor();
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _iResolveDependency(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyFailure(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyName(resourceDependency: loaders.ResourceDependency, asset: away.library.IAsset): string;
        public _pProceedParsing(): boolean;
        private dispose();
        private parseNextBlock();
        private parseTriangleGeometrieBlock(blockID);
        private parsePrimitves(blockID);
        private parseContainer(blockID);
        private parseMeshInstance(blockID);
        private parseSkyBoxInstance(blockID);
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
declare module away.loaders {
    class Max3DSParser extends loaders.ParserBase {
        private _byteData;
        private _textures;
        private _materials;
        private _unfinalized_objects;
        private _cur_obj_end;
        private _cur_obj;
        private _cur_mat_end;
        private _cur_mat;
        constructor();
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _iResolveDependency(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyFailure(resourceDependency: loaders.ResourceDependency): void;
        public _pProceedParsing(): boolean;
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
    public TextureVO(): void;
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
    public MaterialVO(): void;
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
    public ObjectVO(): void;
}
declare class VertexVO {
    public x: number;
    public y: number;
    public z: number;
    public u: number;
    public v: number;
    public normal: away.geom.Vector3D;
    public tangent: away.geom.Vector3D;
    public VertexVO(): void;
}
declare class FaceVO {
    public a: number;
    public b: number;
    public c: number;
    public smoothGroup: number;
    public FaceVO(): void;
}
declare module away.loaders {
    class MD2Parser extends loaders.ParserBase {
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
        constructor(textureType?: string, ignoreTexturePath?: boolean);
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _iResolveDependency(resourceDependency: loaders.ResourceDependency): void;
        public _iResolveDependencyFailure(resourceDependency: loaders.ResourceDependency): void;
        public _pProceedParsing(): boolean;
        private parseHeader();
        private parseMaterialNames();
        private parseUV();
        private parseFaces();
        private addIndex(vertexIndex, uvIndex);
        private findIndex(vertexIndex, uvIndex);
        private parseFrames();
        private readFrameName();
        private createDefaultSubGeometry();
    }
}
declare module away.loaders {
    class MD5AnimParser extends loaders.ParserBase {
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
        constructor(additionalRotationAxis?: away.geom.Vector3D, additionalRotationRadians?: number);
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _pProceedParsing(): boolean;
        private translateClip();
        private translatePose(frameData);
        private parseHierarchy();
        private parseBounds();
        private parseBaseFrame();
        private parseFrame();
        private putBack();
        private getNextToken();
        private skipWhiteSpace();
        private ignoreLine();
        private getNextChar();
        private getNextInt();
        private getNextNumber();
        private parseVector3D();
        private parseQuaternion();
        private parseCMD();
        private parseLiteralstring();
        private sendEOFError();
        private sendParseError(expected);
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
    public orientation: away.math.Quaternion;
    public BaseFrameData(): void;
}
declare class FrameData {
    public index: number;
    public components: number[];
    public FrameData(): void;
}
declare module away.loaders {
    class MD5MeshParser extends loaders.ParserBase {
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
        constructor(additionalRotationAxis?: away.geom.Vector3D, additionalRotationRadians?: number);
        static supportsType(extension: string): boolean;
        static supportsData(data: any): boolean;
        public _pProceedParsing(): boolean;
        private calculateMaxJointCount();
        private countZeroWeightJoints(vertex, weights);
        private parseJoints();
        private putBack();
        private parseMesh();
        private translateGeom(vertexData, weights, indices);
        private parseTri(indices);
        private parseJoint(weights);
        private parseVertex(vertexData);
        private parseUV(vertexData);
        private getNextToken();
        private skipWhiteSpace();
        private ignoreLine();
        private getNextChar();
        private getNextInt();
        private getNextNumber();
        private parseVector3D();
        private parseQuaternion();
        private parseCMD();
        private parseLiteralstring();
        private sendEOFError();
        private sendParseError(expected);
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
declare module away.loaders {
    class Parsers {
        static ALL_BUNDLED: Object[];
        static enableAllBundled(): void;
    }
}
declare module away.tools {
    class ParticleGeometryTransform {
        private _defaultVertexTransform;
        private _defaultInvVertexTransform;
        private _defaultUVTransform;
        public UVTransform : away.geom.Matrix;
        public vertexTransform : away.geom.Matrix3D;
        public invVertexTransform : away.geom.Matrix3D;
    }
}
declare module away.tools {
    class ParticleGeometryHelper {
        static MAX_VERTEX: number;
        static generateGeometry(geometries: away.base.Geometry[], transforms?: tools.ParticleGeometryTransform[]): away.base.ParticleGeometry;
    }
}
declare module aglsl {
    class Sampler {
        public lodbias: number;
        public dim: number;
        public readmode: number;
        public special: number;
        public wrap: number;
        public mipmap: number;
        public filter: number;
        constructor();
    }
}
declare module aglsl {
    class Token {
        public dest: aglsl.Destination;
        public opcode: number;
        public a: aglsl.Destination;
        public b: aglsl.Destination;
        constructor();
    }
}
declare module aglsl {
    class Header {
        public progid: number;
        public version: number;
        public type: string;
        constructor();
    }
}
declare module aglsl {
    class OpLUT {
        public s: string;
        public flags: number;
        public dest: boolean;
        public a: boolean;
        public b: boolean;
        public matrixwidth: number;
        public matrixheight: number;
        public ndwm: boolean;
        public scalar: boolean;
        public dm: boolean;
        public lod: boolean;
        constructor(s: string, flags: number, dest: boolean, a: boolean, b: boolean, matrixwidth: number, matrixheight: number, ndwm: boolean, scaler: boolean, dm: boolean, lod: boolean);
    }
}
declare module aglsl {
    class Description {
        public regread: any[];
        public regwrite: any[];
        public hasindirect: boolean;
        public writedepth: boolean;
        public hasmatrix: boolean;
        public samplers: any[];
        public tokens: aglsl.Token[];
        public header: aglsl.Header;
        constructor();
    }
}
declare module aglsl {
    class Destination {
        public mask: number;
        public regnum: number;
        public regtype: number;
        public dim: number;
        constructor();
    }
}
declare module aglsl {
    class Context3D {
        public enableErrorChecking: boolean;
        public resources: any[];
        public driverInfo: string;
        static maxvertexconstants: number;
        static maxfragconstants: number;
        static maxtemp: number;
        static maxstreams: number;
        static maxtextures: number;
        static defaultsampler: aglsl.Sampler;
        constructor();
    }
}
declare module aglsl {
    class Mapping {
        static agal2glsllut: aglsl.OpLUT[];
    }
}
declare module aglsl.assembler {
    class Opcode {
        public dest: string;
        public a: FS;
        public b: FS;
        public opcode: number;
        public flags: Flags;
        constructor(dest: string, aformat: string, asize: number, bformat: string, bsize: number, opcode: number, simple: boolean, horizontal: boolean, fragonly: boolean, matrix: boolean);
    }
    class FS {
        public format: string;
        public size: number;
    }
    class Flags {
        public simple: boolean;
        public horizontal: boolean;
        public fragonly: boolean;
        public matrix: boolean;
    }
}
declare module aglsl.assembler {
    class OpcodeMap {
        private static _map;
        static map : Object[];
        constructor();
    }
}
declare module aglsl.assembler {
    class Part {
        public name: string;
        public version: number;
        public data: away.utils.ByteArray;
        constructor(name?: string, version?: number);
    }
}
declare module aglsl.assembler {
    class Reg {
        public code: number;
        public desc: string;
        constructor(code: number, desc: string);
    }
    class RegMap {
        private static _map;
        static map : any[];
        constructor();
    }
}
declare module aglsl.assembler {
    class Sampler {
        public shift: number;
        public mask: number;
        public value: number;
        constructor(shift: number, mask: number, value: number);
    }
    class SamplerMap {
        private static _map;
        static map : Object[];
        constructor();
    }
}
declare module aglsl.assembler {
    class AGALMiniAssembler {
        public r: Object;
        public cur: assembler.Part;
        constructor();
        public assemble(source: string, ext_part?: any, ext_version?: any): Object;
        private processLine(line, linenr);
        public emitHeader(pr: assembler.Part): void;
        public emitOpcode(pr: assembler.Part, opcode: any): void;
        public emitZeroDword(pr: assembler.Part): void;
        public emitZeroQword(pr: any): void;
        public emitDest(pr: any, token: any, opdest: any): boolean;
        public stringToMask(s: string): number;
        public stringToSwizzle(s: any): number;
        public emitSampler(pr: assembler.Part, token: any, opsrc: any, opts: any): boolean;
        public emitSource(pr: any, token: any, opsrc: any): boolean;
        public addHeader(partname: any, version: any): void;
    }
}
declare module aglsl {
    class AGALTokenizer {
        constructor();
        public decribeAGALByteArray(bytes: away.utils.ByteArray): aglsl.Description;
        public readReg(s: any, mh: any, desc: any, bytes: any): void;
    }
}
declare module aglsl {
    class AGLSLParser {
        public parse(desc: aglsl.Description): string;
        public regtostring(regtype: number, regnum: number, desc: aglsl.Description, tag: any): string;
        public sourcetostring(s: any, subline: any, dwm: any, isscalar: any, desc: any, tag: any): string;
    }
}
declare module aglsl {
    class AGLSLCompiler {
        public glsl: string;
        public compile(programType: string, source: string): string;
    }
}
declare module away {
    class Away3D extends away.events.EventDispatcher {
        constructor();
    }
}
