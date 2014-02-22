/// <reference path="../libs/ref/webgl.d.ts" />
/// <reference path="../libs/ref/js.d.ts" />
/// <reference path="../libs/ame.next.d.ts" />
declare module away.errors {
    class AnimationSetError extends errors.Error {
        constructor(message: string);
    }
}
/**
* @module away.events
*/
declare module away.events {
    class LightEvent extends events.Event {
        static CASTS_SHADOW_CHANGE: string;
        constructor(type: string);
        public clone(): events.Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    /**
    * A MouseEvent3D is dispatched when a mouse event occurs over a mouseEnabled object in View.
    * todo: we don't have screenZ data, tho this should be easy to implement
    */
    class MouseEvent3D extends events.Event {
        public _iAllowedToPropagate: boolean;
        public _iParentEvent: MouseEvent3D;
        /**
        * Defines the value of the type property of a mouseOver3d event object.
        */
        static MOUSE_OVER: string;
        /**
        * Defines the value of the type property of a mouseOut3d event object.
        */
        static MOUSE_OUT: string;
        /**
        * Defines the value of the type property of a mouseUp3d event object.
        */
        static MOUSE_UP: string;
        /**
        * Defines the value of the type property of a mouseDown3d event object.
        */
        static MOUSE_DOWN: string;
        /**
        * Defines the value of the type property of a mouseMove3d event object.
        */
        static MOUSE_MOVE: string;
        /**
        * Defines the value of the type property of a click3d event object.
        */
        static CLICK: string;
        /**
        * Defines the value of the type property of a doubleClick3d event object.
        */
        static DOUBLE_CLICK: string;
        /**
        * Defines the value of the type property of a mouseWheel3d event object.
        */
        static MOUSE_WHEEL: string;
        /**
        * The horizontal coordinate at which the event occurred in view coordinates.
        */
        public screenX: number;
        /**
        * The vertical coordinate at which the event occurred in view coordinates.
        */
        public screenY: number;
        /**
        * The view object inside which the event took place.
        */
        public view: away.containers.View;
        /**
        * The 3d object inside which the event took place.
        */
        public object: away.containers.DisplayObjectContainer;
        /**
        * The material owner inside which the event took place.
        */
        public materialOwner: away.base.IMaterialOwner;
        /**
        * The material of the 3d element inside which the event took place.
        */
        public material: away.materials.MaterialBase;
        /**
        * The uv coordinate inside the draw primitive where the event took place.
        */
        public uv: away.geom.Point;
        /**
        * The index of the face where the event took place.
        */
        public index: number;
        /**
        * The index of the subGeometry where the event took place.
        */
        public subGeometryIndex: number;
        /**
        * The position in object space where the event took place
        */
        public localPosition: away.geom.Vector3D;
        /**
        * The normal in object space where the event took place
        */
        public localNormal: away.geom.Vector3D;
        /**
        * Indicates whether the Control key is active (true) or inactive (false).
        */
        public ctrlKey: boolean;
        /**
        * Indicates whether the Alt key is active (true) or inactive (false).
        */
        public altKey: boolean;
        /**
        * Indicates whether the Shift key is active (true) or inactive (false).
        */
        public shiftKey: boolean;
        /**
        * Indicates how many lines should be scrolled for each unit the user rotates the mouse wheel.
        */
        public delta: number;
        /**
        * Create a new MouseEvent3D object.
        * @param type The type of the MouseEvent3D.
        */
        constructor(type: string);
        /**
        * @inheritDoc
        */
        public bubbles : boolean;
        /**
        * @inheritDoc
        */
        public stopPropagation(): void;
        /**
        * @inheritDoc
        */
        public stopImmediatePropagation(): void;
        /**
        * Creates a copy of the MouseEvent3D object and sets the value of each property to match that of the original.
        */
        public clone(): events.Event;
        /**
        * The position in scene space where the event took place
        */
        public scenePosition : away.geom.Vector3D;
        /**
        * The normal in scene space where the event took place
        */
        public sceneNormal : away.geom.Vector3D;
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in an animation state's state.
    */
    class AnimationStateEvent extends events.Event {
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
        constructor(type: string, animator: away.animators.AnimatorBase, animationState: away.animators.IAnimationState, animationNode: away.animators.AnimationNodeBase);
        /**
        * The animator object that is the subject of this event.
        */
        public animator : away.animators.AnimatorBase;
        /**
        * The animation state object that is the subject of this event.
        */
        public animationState : away.animators.IAnimationState;
        /**
        * The animation node inside the animation state from which the event originated.
        */
        public animationNode : away.animators.AnimationNodeBase;
        /**
        * Clones the event.
        *
        * @return An exact duplicate of the current object.
        */
        public clone(): events.Event;
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in an animator's state.
    */
    class AnimatorEvent extends events.Event {
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
        constructor(type: string, animator: away.animators.AnimatorBase);
        public animator : away.animators.AnimatorBase;
        /**
        * Clones the event.
        *
        * @return An exact duplicate of the current event object.
        */
        public clone(): events.Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class ShadingMethodEvent extends events.Event {
        static SHADER_INVALIDATED: string;
        constructor(type: string);
    }
}
declare module away.events {
    /**
    * Dispatched to notify changes in a geometry object's state.
    *
    * @class away.events.GeometryEvent
    * @see away3d.core.base.Geometry
    */
    class GeometryEvent extends events.Event {
        /**
        * Dispatched when a SubGeometry was added from the dispatching Geometry.
        */
        static SUB_GEOMETRY_ADDED: string;
        /**
        * Dispatched when a SubGeometry was removed from the dispatching Geometry.
        */
        static SUB_GEOMETRY_REMOVED: string;
        static BOUNDS_INVALID: string;
        private _subGeometry;
        /**
        * Create a new GeometryEvent
        * @param type The event type.
        * @param subGeometry An optional SubGeometry object that is the subject of this event.
        */
        constructor(type: string, subGeometry?: away.base.ISubGeometry);
        /**
        * The SubGeometry object that is the subject of this event, if appropriate.
        */
        public subGeometry : away.base.ISubGeometry;
        /**
        * Clones the event.
        * @return An exact duplicate of the current object.
        */
        public clone(): events.Event;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * SubMesh wraps a SubGeometry as a scene graph instantiation. A SubMesh is owned by a Mesh object.
    *
    *
    * @see away.base.SubGeometry
    * @see away.entities.Mesh
    *
    * @class away.base.SubMesh
    */
    class SubMesh extends away.library.NamedAssetBase implements base.IMaterialOwner {
        public _iMaterial: away.materials.MaterialBase;
        private _parentMesh;
        private _subGeometry;
        private _uvTransform;
        public _iIndex: number;
        public animationSubGeometry: away.animators.AnimationSubGeometry;
        public animatorSubGeometry: away.animators.AnimationSubGeometry;
        /**
        * The animator object that provides the state for the SubMesh's animation.
        */
        public animator : away.animators.IAnimator;
        /**
        * The material used to render the current SubMesh. If set to null, its parent Mesh's material will be used instead.
        */
        public material : away.materials.MaterialBase;
        /**
        * The scene transform object that transforms from model to world space.
        */
        public sceneTransform : away.geom.Matrix3D;
        /**
        * The entity that that initially provided the IRenderable to the render pipeline (ie: the owning Mesh object).
        */
        public sourceEntity : away.entities.IEntity;
        /**
        * The SubGeometry object which provides the geometry data for this SubMesh.
        */
        public subGeometry : base.ISubGeometry;
        /**
        *
        */
        public uvTransform : away.geom.UVTransform;
        /**
        * Creates a new SubMesh object
        * @param subGeometry The SubGeometry object which provides the geometry data for this SubMesh.
        * @param parentMesh The Mesh object to which this SubMesh belongs.
        * @param material An optional material used to render this SubMesh.
        */
        constructor(subGeometry: base.ISubGeometry, parentMesh: away.entities.Mesh, material?: away.materials.MaterialBase);
        /**
        *
        */
        public dispose(): void;
        /**
        *
        * @param camera
        * @returns {away.geom.Matrix3D}
        */
        public getRenderSceneTransform(camera: away.entities.Camera): away.geom.Matrix3D;
        /**
        * @internal
        */
        public _iSetUVMatrixComponents(offsetU: number, offsetV: number, scaleU: number, scaleV: number, rotationUV: number): void;
    }
}
declare module away.base {
    class Segment {
        public _pSegmentsBase: base.SegmentSubGeometry;
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
        public iSegmentsBase : base.SegmentSubGeometry;
        private update();
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.SubGeometryBase
    */
    class SubGeometryBase extends away.library.NamedAssetBase {
        public _parentGeometry: base.Geometry;
        public _vertexData: number[];
        public _faceNormalsDirty: boolean;
        public _faceTangentsDirty: boolean;
        public _faceTangents: number[];
        public _indices: number[];
        public _indexBuffer: away.gl.IndexBuffer[];
        public _numIndices: number;
        public _indexBufferContext: away.gl.ContextGL[];
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
        constructor();
        /**
        * Defines whether a UV buffer should be automatically generated to contain dummy UV coordinates.
        * Set to true if a geometry lacks UV data but uses a material that requires it, or leave as false
        * in cases where UV data is explicitly defined or the material does not require UV data.
        */
        public autoGenerateDummyUVs : boolean;
        /**
        * True if the vertex normals should be derived from the geometry, false if the vertex normals are set
        * explicitly.
        */
        public autoDeriveVertexNormals : boolean;
        /**
        * Indicates whether or not to take the size of faces into account when auto-deriving vertex normals and tangents.
        */
        public useFaceWeights : boolean;
        /**
        * The total amount of triangles in the SubGeometry.
        */
        public numTriangles : number;
        /**
        * Retrieves the VertexBuffer object that contains triangle indices.
        * @param context The ContextGL for which we request the buffer
        * @return The VertexBuffer object that contains triangle indices.
        */
        public getIndexBuffer(stageGL: base.StageGL): away.gl.IndexBuffer;
        /**
        * Updates the tangents for each face.
        */
        public pUpdateFaceTangents(): void;
        /**
        * Updates the normals for each face.
        */
        private updateFaceNormals();
        /**
        * Updates the vertex normals based on the geometry.
        */
        public pUpdateVertexNormals(target: number[]): number[];
        /**
        * Updates the vertex tangents based on the geometry.
        */
        public pUpdateVertexTangents(target: number[]): number[];
        public dispose(): void;
        /**
        * The raw index data that define the faces.
        *
        * @private
        */
        public indexData : number[];
        /**
        * Updates the face indices of the SubGeometry.
        * @param indices The face indices to upload.
        */
        public updateIndexData(indices: number[]): void;
        /**
        * Disposes all buffers in a given vector.
        * @param buffers The vector of buffers to dispose.
        */
        public pDisposeIndexBuffers(buffers: away.gl.IndexBuffer[]): void;
        /**
        * Disposes all buffers in a given vector.
        * @param buffers The vector of buffers to dispose.
        */
        public pDisposeVertexBuffers(buffers: away.gl.VertexBuffer[]): void;
        /**
        * True if the vertex tangents should be derived from the geometry, false if the vertex normals are set
        * explicitly.
        */
        public autoDeriveVertexTangents : boolean;
        /**
        * The raw data of the face normals, in the same order as the faces are listed in the index list.
        *
        * @private
        */
        public faceNormals : number[];
        /**
        * Invalidates all buffers in a vector, causing them the update when they are first requested.
        * @param buffers The vector of buffers to invalidate.
        */
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
        /**
        * The Geometry object that 'owns' this SubGeometry object.
        *
        * @private
        */
        public parentGeometry : base.Geometry;
        /**
        * Scales the uv coordinates
        * @param scaleU The amount by which to scale on the u axis. Default is 1;
        * @param scaleV The amount by which to scale on the v axis. Default is 1;
        */
        public scaleU : number;
        public scaleV : number;
        public scaleUV(scaleU?: number, scaleV?: number): void;
        /**
        * Scales the geometry.
        * @param scale The amount by which to scale.
        */
        public scale(scale: number): void;
        public applyTransformation(transform: away.geom.Matrix3D): void;
        public pUpdateDummyUVs(target: number[]): number[];
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @interface away.base.ISubGeometry
    */
    interface ISubGeometry {
        /**
        * The total amount of vertices in the SubGeometry.
        */
        numVertices: number;
        /**
        * The amount of triangles that comprise the IRenderable geometry.
        */
        numTriangles: number;
        /**
        * The distance between two consecutive vertex, normal or tangent elements
        * This always applies to vertices, normals and tangents.
        */
        vertexStride: number;
        /**
        * The distance between two consecutive normal elements
        * This always applies to vertices, normals and tangents.
        */
        vertexNormalStride: number;
        /**
        * The distance between two consecutive tangent elements
        * This always applies to vertices, normals and tangents.
        */
        vertexTangentStride: number;
        /**
        * The distance between two consecutive UV elements
        */
        UVStride: number;
        /**
        * The distance between two secondary UV elements
        */
        secondaryUVStride: number;
        /**
        * Unique identifier for a subgeometry
        */
        id: string;
        /**
        * Assigns the attribute stream for vertex positions.
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        activateVertexBuffer(index: number, stageGL: base.StageGL);
        /**
        * Assigns the attribute stream for UV coordinates
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        activateUVBuffer(index: number, stageGL: base.StageGL);
        /**
        * Assigns the attribute stream for a secondary set of UV coordinates
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        activateSecondaryUVBuffer(index: number, stageGL: base.StageGL);
        /**
        * Assigns the attribute stream for vertex normals
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        activateVertexNormalBuffer(index: number, stageGL: base.StageGL);
        /**
        * Assigns the attribute stream for vertex tangents
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        activateVertexTangentBuffer(index: number, stageGL: base.StageGL);
        /**
        * Retrieves the IndexBuffer object that contains triangle indices.
        * @param context The ContextGL for which we request the buffer
        * @return The VertexBuffer object that contains triangle indices.
        */
        getIndexBuffer(stageGL: base.StageGL): away.gl.IndexBuffer;
        /**
        * Retrieves the object's vertices as a Number array.
        */
        vertexData: number[];
        /**
        * Retrieves the object's normals as a Number array.
        */
        vertexNormalData: number[];
        /**
        * Retrieves the object's tangents as a Number array.
        */
        vertexTangentData: number[];
        /**
        * The offset into vertexData where the vertices are placed
        */
        vertexOffset: number;
        /**
        * The offset into vertexNormalData where the normals are placed
        */
        vertexNormalOffset: number;
        /**
        * The offset into vertexTangentData where the tangents are placed
        */
        vertexTangentOffset: number;
        /**
        * The offset into UVData vector where the UVs are placed
        */
        UVOffset: number;
        /**
        * The offset into SecondaryUVData vector where the UVs are placed
        */
        secondaryUVOffset: number;
        /**
        * Retrieves the object's indices as a uint array.
        */
        indexData: number[];
        /**
        * Retrieves the object's uvs as a Number array.
        */
        UVData: number[];
        applyTransformation(transform: away.geom.Matrix3D);
        scale(scale: number);
        dispose();
        clone(): ISubGeometry;
        scaleU: number;
        scaleV: number;
        scaleUV(scaleU: number, scaleV: number);
        parentGeometry: base.Geometry;
        faceNormals: number[];
        cloneWithSeperateBuffers(): base.SubGeometry;
        autoDeriveVertexNormals: boolean;
        autoDeriveVertexTangents: boolean;
        fromVectors(vertices: number[], uvs: number[], normals: number[], tangents: number[]);
        vertexPositionData: number[];
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.CompactSubGeometry
    */
    class CompactSubGeometry extends base.SubGeometryBase implements base.ISubGeometry {
        public _pVertexDataInvalid: boolean[];
        private _vertexBuffer;
        private _bufferContext;
        public _pNumVertices: number;
        private _contextIndex;
        public _pActiveBuffer: away.gl.VertexBuffer;
        private _activeContext;
        public _pActiveDataInvalid: boolean;
        private _isolatedVertexPositionData;
        private _isolatedVertexPositionDataDirty;
        constructor();
        public numVertices : number;
        /**
        * Updates the vertex data. All vertex properties are contained in a single Vector, and the order is as follows:
        * 0 - 2: vertex position X, Y, Z
        * 3 - 5: normal X, Y, Z
        * 6 - 8: tangent X, Y, Z
        * 9 - 10: U V
        * 11 - 12: Secondary U V
        */
        public updateData(data: number[]): void;
        public activateVertexBuffer(index: number, stageGL: base.StageGL): void;
        public activateUVBuffer(index: number, stageGL: base.StageGL): void;
        public activateSecondaryUVBuffer(index: number, stageGL: base.StageGL): void;
        public pUploadData(contextIndex: number): void;
        public activateVertexNormalBuffer(index: number, stageGL: base.StageGL): void;
        public activateVertexTangentBuffer(index: number, stageGL: base.StageGL): void;
        public pCreateBuffer(contextIndex: number, context: away.gl.ContextGL): void;
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
        public pDisposeVertexBuffers(buffers: away.gl.VertexBuffer[]): void;
        public pInvalidateBuffers(invalid: boolean[]): void;
        public cloneWithSeperateBuffers(): base.SubGeometry;
        public vertexPositionData : number[];
        public strippedUVData : number[];
        /**
        * Isolate and returns a Vector.Number of a specific buffer type
        *
        * - stripBuffer(0, 3), return only the vertices
        * - stripBuffer(3, 3): return only the normals
        * - stripBuffer(6, 3): return only the tangents
        * - stripBuffer(9, 2): return only the uv's
        * - stripBuffer(11, 2): return only the secondary uv's
        */
        public stripBuffer(offset: number, numEntries: number): number[];
        public fromVectors(verts: number[], uvs: number[], normals: number[], tangents: number[]): void;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * SkinnedSubGeometry provides a SubGeometry extension that contains data needed to skin vertices. In particular,
    * it provides joint indices and weights.
    * Important! Joint indices need to be pre-multiplied by 3, since they index the matrix array (and each matrix has 3 float4 elements)
    *
    * @class away.base.SkinnedSubGeometry
    *
    */
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
        /**
        * Creates a new SkinnedSubGeometry object.
        * @param jointsPerVertex The amount of joints that can be assigned per vertex.
        */
        constructor(jointsPerVertex: number);
        /**
        * If indices have been condensed, this will contain the original index for each condensed index.
        */
        public condensedIndexLookUp : number[];
        /**
        * The amount of joints used when joint indices have been condensed.
        */
        public numCondensedJoints : number;
        /**
        * The animated vertex positions when set explicitly if the skinning transformations couldn't be performed on GPU.
        */
        public animatedData : number[];
        public updateAnimatedData(value: number[]): void;
        /**
        * Assigns the attribute stream for joint weights
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        public activateJointWeightsBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * Assigns the attribute stream for joint indices
        * @param index The attribute stream index for the vertex shader
        * @param stageGL The StageGL to assign the stream to
        */
        public activateJointIndexBuffer(index: number, stageGL: base.StageGL): void;
        public pUploadData(contextIndex: number): void;
        /**
        * Clones the current object.
        * @return An exact duplicate of the current object.
        */
        public clone(): base.ISubGeometry;
        /**
        * Cleans up any resources used by this object.
        */
        public dispose(): void;
        /**
        */
        public iCondenseIndexData(): void;
        /**
        * The raw joint weights data.
        */
        public iJointWeightsData : number[];
        public iUpdateJointWeightsData(value: number[]): void;
        /**
        * The raw joint index data.
        */
        public iJointIndexData : number[];
        public iUpdateJointIndexData(value: number[]): void;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    *
    * Geometry is a collection of SubGeometries, each of which contain the actual geometrical data such as vertices,
    * normals, uvs, etc. It also contains a reference to an animation class, which defines how the geometry moves.
    * A Geometry object is assigned to a Mesh, a scene graph occurence of the geometry, which in turn assigns
    * the SubGeometries to its respective SubMesh objects.
    *
    *
    *
    * @see away.core.base.SubGeometry
    * @see away.entities.Mesh
    *
    * @class away.base.Geometry
    */
    class Geometry extends away.library.NamedAssetBase implements away.library.IAsset {
        private _subGeometries;
        public assetType : string;
        /**
        * A collection of SubGeometry objects, each of which contain geometrical data such as vertices, normals, etc.
        */
        public subGeometries : base.ISubGeometry[];
        public getSubGeometries(): base.ISubGeometry[];
        /**
        * Creates a new Geometry object.
        */
        constructor();
        public applyTransformation(transform: away.geom.Matrix3D): void;
        /**
        * Adds a new SubGeometry object to the list.
        * @param subGeometry The SubGeometry object to be added.
        */
        public addSubGeometry(subGeometry: base.ISubGeometry): void;
        /**
        * Removes a new SubGeometry object from the list.
        * @param subGeometry The SubGeometry object to be removed.
        */
        public removeSubGeometry(subGeometry: base.ISubGeometry): void;
        /**
        * Clones the geometry.
        * @return An exact duplicate of the current Geometry object.
        */
        public clone(): Geometry;
        /**
        * Scales the geometry.
        * @param scale The amount by which to scale.
        */
        public scale(scale: number): void;
        /**
        * Clears all resources used by the Geometry object, including SubGeometries.
        */
        public dispose(): void;
        /**
        * Scales the uv coordinates (tiling)
        * @param scaleU The amount by which to scale on the u axis. Default is 1;
        * @param scaleV The amount by which to scale on the v axis. Default is 1;
        */
        public scaleUV(scaleU?: number, scaleV?: number): void;
        /**
        * Updates the SubGeometries so all vertex data is represented in different buffers.
        * Use this for compatibility with Pixel Bender and PBPickingCollider
        */
        public convertToSeparateBuffers(): void;
        public iValidate(): void;
        public iInvalidateBounds(subGeom: base.ISubGeometry): void;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * @class away.base.ParticleGeometry
    */
    class ParticleGeometry extends base.Geometry {
        public particles: away.animators.ParticleData[];
        public numParticles: number;
    }
}
/**
* @module away.base
*/
declare module away.base {
    /**
    * The SubGeometry class is a collections of geometric data that describes a triangle mesh. It is owned by a
    * Geometry instance, and wrapped by a SubMesh in the scene graph.
    * Several SubGeometries are grouped so they can be rendered with different materials, but still represent a single
    * object.
    *
    * @see away.base.Geometry
    * @see away.base.SubMesh
    *
    * @class away.base.SubGeometry
    */
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
        /**
        * Creates a new SubGeometry object.
        */
        constructor();
        /**
        * The total amount of vertices in the SubGeometry.
        */
        public numVertices : number;
        /**
        * @inheritDoc
        */
        public activateVertexBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public activateUVBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public activateSecondaryUVBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * Retrieves the VertexBuffer object that contains vertex normals.
        * @param context The ContextGL for which we request the buffer
        * @return The VertexBuffer object that contains vertex normals.
        */
        public activateVertexNormalBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * Retrieves the VertexBuffer object that contains vertex tangents.
        * @param context The ContextGL for which we request the buffer
        * @return The VertexBuffer object that contains vertex tangents.
        */
        public activateVertexTangentBuffer(index: number, stageGL: base.StageGL): void;
        public applyTransformation(transform: away.geom.Matrix3D): void;
        /**
        * Clones the current object
        * @return An exact duplicate of the current object.
        */
        public clone(): base.ISubGeometry;
        /**
        * @inheritDoc
        */
        public scale(scale: number): void;
        /**
        * @inheritDoc
        */
        public scaleUV(scaleU?: number, scaleV?: number): void;
        /**
        * Clears all resources used by the SubGeometry object.
        */
        public dispose(): void;
        public pDisposeAllVertexBuffers(): void;
        /**
        * The raw vertex position data.
        */
        public vertexData : number[];
        public vertexPositionData : number[];
        /**
        * Updates the vertex data of the SubGeometry.
        * @param vertices The new vertex data to upload.
        */
        public updateVertexData(vertices: number[]): void;
        /**
        * The raw texture coordinate data.
        */
        public UVData : number[];
        public secondaryUVData : number[];
        /**
        * Updates the uv coordinates of the SubGeometry.
        * @param uvs The uv coordinates to upload.
        */
        public updateUVData(uvs: number[]): void;
        public updateSecondaryUVData(uvs: number[]): void;
        /**
        * The raw vertex normal data.
        */
        public vertexNormalData : number[];
        /**
        * Updates the vertex normals of the SubGeometry. When updating the vertex normals like this,
        * autoDeriveVertexNormals will be set to false and vertex normals will no longer be calculated automatically.
        * @param vertexNormals The vertex normals to upload.
        */
        public updateVertexNormalData(vertexNormals: number[]): void;
        /**
        * The raw vertex tangent data.
        *
        * @private
        */
        public vertexTangentData : number[];
        /**
        * Updates the vertex tangents of the SubGeometry. When updating the vertex tangents like this,
        * autoDeriveVertexTangents will be set to false and vertex tangents will no longer be calculated automatically.
        * @param vertexTangents The vertex tangents to upload.
        */
        public updateVertexTangentData(vertexTangents: number[]): void;
        public fromVectors(vertices: number[], uvs: number[], normals: number[], tangents: number[]): void;
        public pUpdateVertexNormals(target: number[]): number[];
        public pUpdateVertexTangents(target: number[]): number[];
        public pUpdateDummyUVs(target: number[]): number[];
        public pDisposeForStageGL(stageGL: base.StageGL): void;
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
/**
* @module away.base
*/
declare module away.base {
    /**
    * The SubGeometry class is a collections of geometric data that describes a triangle mesh. It is owned by a
    * Geometry instance, and wrapped by a SubMesh in the scene graph.
    * Several SubGeometries are grouped so they can be rendered with different materials, but still represent a single
    * object.
    *
    * @see away.base.Geometry
    * @see away.base.SubMesh
    *
    * @class away.base.SubGeometry
    */
    class SegmentSubGeometry extends base.SubGeometryBase implements base.ISubGeometry {
        private _activeSubSet;
        private _verticesInvalid;
        private _vertexBuffer;
        private _vertexBufferContext;
        private _numVertices;
        private LIMIT;
        private _subSets;
        private _subSetCount;
        public _pSegments: Object;
        private _indexSegments;
        private _hasData;
        public hasData : boolean;
        public numTriangles : number;
        /**
        *
        */
        public segmentCount : number;
        /**
        *
        */
        public iSubSetCount : number;
        /**
        * Creates a new SubGeometry object.
        */
        constructor();
        /**
        * The total amount of vertices in the SubGeometry.
        */
        public numVertices : number;
        /**
        * @inheritDoc
        */
        public activateVertexBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public activateUVBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * @inheritDoc
        */
        public activateSecondaryUVBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * Retrieves the VertexBuffer object that contains vertex normals.
        * @param context The ContextGL for which we request the buffer
        * @return The VertexBuffer object that contains vertex normals.
        */
        public activateVertexNormalBuffer(index: number, stageGL: base.StageGL): void;
        /**
        * Retrieves the VertexBuffer object that contains vertex tangents.
        * @param context The ContextGL for which we request the buffer
        * @return The VertexBuffer object that contains vertex tangents.
        */
        public activateVertexTangentBuffer(index: number, stageGL: base.StageGL): void;
        public getIndexBuffer(stageGL: base.StageGL): away.gl.IndexBuffer;
        public applyTransformation(transform: away.geom.Matrix3D): void;
        /**
        * Clones the current object
        * @return An exact duplicate of the current object.
        */
        public clone(): base.ISubGeometry;
        /**
        * @inheritDoc
        */
        public scale(scale: number): void;
        /**
        * Clears all resources used by the SubGeometry object.
        */
        public dispose(): void;
        public pDisposeAllVertexBuffers(): void;
        /**
        * The raw vertex position data.
        */
        public vertexData : number[];
        public vertexPositionData : number[];
        /**
        * Updates the vertex data of the SubGeometry.
        * @param vertices The new vertex data to upload.
        */
        public updateVertexData(vertices: number[]): void;
        public fromVectors(vertices: number[], uvs: number[], normals: number[], tangents: number[]): void;
        public pDisposeForStageGL(stageGL: base.StageGL): void;
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
        public cloneWithSeperateBuffers(): base.SubGeometry;
        /**
        * //TODO
        *
        * @param segment
        */
        public addSegment(segment: base.Segment): void;
        /**
        * //TODO
        *
        * @param index
        * @returns {*}
        */
        public getSegment(index: number): base.Segment;
        /**
        * //TODO
        *
        * @param index
        * @param dispose
        */
        public removeSegmentByIndex(index: number, dispose?: boolean): void;
        /**
        * //TODO
        */
        public removeAllSegments(): void;
        /**
        * //TODO
        *
        * @param segment
        * @param dispose
        */
        public removeSegment(segment: base.Segment, dispose?: boolean): void;
        /**
        * //TODO
        *
        * @protected
        */
        public updateBounds(bounds: away.bounds.BoundingVolumeBase): void;
        public _iSetColor(color: number): void;
        public _iSetThickness(thickness: number): void;
        /**
        * //TODO
        *
        * @param segment
        *
        * @internal
        */
        public iUpdateSegment(segment: base.Segment): void;
        /**
        * //TODO
        * @returns {SubSet}
        *
        * @private
        */
        private addSubSet();
        /**
        * //TODO
        * @param subSetIndex
        * @param index
        *
        * @private
        */
        private reOrderIndices(subSetIndex, index);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class RenderableBase {
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
        public renderSceneTransform: away.geom.Matrix3D;
        /**
        *
        */
        public sourceEntity: away.entities.IEntity;
        /**
        *
        */
        public materialOwner: away.base.IMaterialOwner;
        /**
        *
        */
        public subGeometry: away.base.ISubGeometry;
        /**
        *
        */
        public animationSubGeometry: away.animators.AnimationSubGeometry;
        /**
        *
        * @param sourceEntity
        * @param materialOwner
        * @param subGeometry
        * @param animationSubGeometry
        */
        constructor(sourceEntity: away.entities.IEntity, materialOwner: away.base.IMaterialOwner, subGeometry: away.base.ISubGeometry, animationSubGeometry: away.animators.AnimationSubGeometry);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class BillboardRenderable extends pool.RenderableBase {
        private static _geometry;
        constructor(billboard: away.entities.Billboard);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.BillboardRenderablePool
    */
    class BillboardRenderablePool {
        private _pool;
        public getItem(billboard: away.entities.Billboard): pool.BillboardRenderable;
        public dispose(billboard: away.entities.Billboard): void;
        public disposeAll(): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class SegmentSetRenderable extends pool.RenderableBase {
        constructor(segmentSet: away.entities.SegmentSet);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SegmentSetRenderablePool
    */
    class SegmentSetRenderablePool {
        private _pool;
        public getItem(segmentSet: away.entities.SegmentSet): pool.SegmentSetRenderable;
        public dispose(segmentSet: away.entities.Billboard): void;
        public disposeAll(): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SubMeshRenderable
    */
    class SubMeshRenderable extends pool.RenderableBase {
        public subMesh: away.base.SubMesh;
        constructor(subMesh: away.base.SubMesh);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SubMeshRenderablePool
    */
    class SubMeshRenderablePool {
        private _pool;
        public getItem(subMesh: away.base.SubMesh): pool.SubMeshRenderable;
        public dispose(subMesh: away.base.SubMesh): void;
        public disposeAll(): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SkyboxRenderable
    */
    class SkyboxRenderable extends pool.RenderableBase {
        private static _geometry;
        constructor(skybox: away.entities.Skybox);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SkyboxRenderablePool
    */
    class SkyboxRenderablePool {
        private _pool;
        public getItem(skybox: away.entities.Skybox): pool.SkyboxRenderable;
        public dispose(skybox: away.entities.Skybox): void;
        public disposeAll(): void;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.EntityCollector
    */
    class RenderableCollectorBase implements traverse.ICollector {
        public scene: away.containers.Scene;
        public _iEntryPoint: away.geom.Vector3D;
        public _pSkybox: away.pool.RenderableBase;
        public _pEntityHead: away.pool.EntityListItem;
        public _pEntityListItemPool: away.pool.EntityListItemPool;
        public _pBillboardRenderablePool: away.pool.BillboardRenderablePool;
        public _pSegmentSetRenderablePool: away.pool.SegmentSetRenderablePool;
        public _pSkyboxRenderablePool: away.pool.SkyboxRenderablePool;
        public _pSubMeshRenderablePool: away.pool.SubMeshRenderablePool;
        public _pCamera: away.entities.Camera;
        public _pCameraForward: away.geom.Vector3D;
        private _customCullPlanes;
        private _cullPlanes;
        private _numCullPlanes;
        /**
        *
        */
        public renderableSorter: away.sort.IEntitySorter;
        constructor();
        /**
        *
        */
        public camera : away.entities.Camera;
        /**
        *
        */
        public cullPlanes : away.geom.Plane3D[];
        /**
        *
        */
        public entityHead : away.pool.EntityListItem;
        public entryPoint : away.geom.Vector3D;
        /**
        *
        */
        public clear(): void;
        /**
        *
        * @param node
        * @returns {boolean}
        */
        public enterNode(node: away.partition.NodeBase): boolean;
        /**
        *
        * @param entity
        */
        public applyEntity(entity: away.entities.IEntity): void;
        public sortRenderables(): void;
        /**
        *
        * @param billboard
        * @protected
        */
        public pApplyBillboard(billboard: away.entities.Billboard): void;
        /**
        *
        * @param mesh
        * @protected
        */
        public pApplyMesh(mesh: away.entities.Mesh): void;
        /**
        *
        * @param renderable
        * @protected
        */
        public pApplyRenderable(renderable: away.pool.RenderableBase): void;
        public pApplySkybox(skybox: away.entities.Skybox): void;
        public pApplySegmentSet(segmentSet: away.entities.SegmentSet): void;
        /**
        *
        * @param entity
        */
        public pFindRenderable(entity: away.entities.IEntity): void;
        /**
        * //TODO
        *
        * @param entity
        * @param shortestCollisionDistance
        * @param findClosest
        * @returns {boolean}
        *
        * @internal
        */
        public _iCollidesBefore(entity: away.entities.IEntity, shortestCollisionDistance: number, findClosest: boolean): boolean;
        private testBillBoard(billboard, pickingCollider, pickingCollisionVO, shortestCollisionDistance, findClosest);
        public testMesh(mesh: away.entities.Mesh, pickingCollider: away.pick.PickingColliderBase, pickingCollisionVO: away.pick.PickingCollisionVO, shortestCollisionDistance: number, findClosest: boolean): boolean;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.EntityCollector
    */
    class EntityCollector extends traverse.RenderableCollectorBase {
        public _pSkybox: away.pool.RenderableBase;
        public _pLights: away.lights.LightBase[];
        private _directionalLights;
        private _pointLights;
        private _lightProbes;
        public _pOpaqueRenderableHead: away.pool.RenderableBase;
        public _pBlendedRenderableHead: away.pool.RenderableBase;
        public _pNumLights: number;
        public _pNumTriangles: number;
        public _pNumEntities: number;
        public _pNumInteractiveEntities: number;
        private _numDirectionalLights;
        private _numPointLights;
        private _numLightProbes;
        /**
        *
        */
        public directionalLights : away.lights.DirectionalLight[];
        /**
        *
        */
        public blendedRenderableHead : away.pool.RenderableBase;
        /**
        *
        */
        public lightProbes : away.lights.LightProbe[];
        /**
        *
        */
        public lights : away.lights.LightBase[];
        /**
        *
        */
        public numEntities : number;
        /**
        *
        */
        public numInteractiveEntities : number;
        /**
        *
        */
        public numTriangles : number;
        /**
        *
        */
        public opaqueRenderableHead : away.pool.RenderableBase;
        /**
        *
        */
        public pointLights : away.lights.PointLight[];
        /**
        *
        */
        public skyBox : away.pool.RenderableBase;
        constructor();
        /**
        *
        */
        public applyEntity(entity: away.entities.IEntity): void;
        public sortRenderables(): void;
        /**
        *
        */
        public clear(): void;
        /**
        *
        * @param renderable
        * @protected
        */
        public pApplyRenderable(renderable: away.pool.RenderableBase): void;
        /**
        *
        * @param entity
        */
        public pFindRenderable(entity: away.entities.IEntity): void;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * @class away.traverse.ShadowCasterCollector
    */
    class ShadowCasterCollector extends traverse.EntityCollector {
        constructor();
        /**
        *
        */
        public enterNode(node: away.partition.NodeBase): boolean;
        public pApplyRenderable(renderable: away.pool.RenderableBase): void;
        /**
        *
        * @param entity
        */
        public pFindRenderable(entity: away.entities.IEntity): void;
    }
}
/**
* @module away.traverse
*/
declare module away.traverse {
    /**
    * The RaycastCollector class is a traverser for scene partitions that collects all scene graph entities that are
    * considered intersecting with the defined ray.
    *
    * @see away.partition.Partition
    * @see away.entities.IEntity
    *
    * @class away.traverse.RaycastCollector
    */
    class RaycastCollector extends traverse.RenderableCollectorBase implements traverse.ICollector {
        private _rayPosition;
        private _rayDirection;
        public _iCollectionMark: number;
        public _pCamera: away.entities.Camera;
        /**
        *
        */
        public camera : away.entities.Camera;
        /**
        * Provides the starting position of the ray.
        */
        public rayPosition : away.geom.Vector3D;
        /**
        * Provides the direction vector of the ray.
        */
        public rayDirection : away.geom.Vector3D;
        /**
        * Creates a new RaycastCollector object.
        */
        constructor();
        /**
        * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
        *
        * @param node The Partition3DNode object to frustum-test.
        */
        public enterNode(node: away.partition.NodeBase): boolean;
        /**
        *
        * @param entity
        */
        public pFindRenderable(entity: away.entities.IEntity): void;
    }
}
/**
* @module away.partition
*/
declare module away.partition {
    /**
    * @class away.partition.DirectionalLightNode
    */
    class DirectionalLightNode extends partition.EntityNode {
        private _directionalLight;
        /**
        *
        * @param directionalLight
        */
        constructor(directionalLight: away.entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: away.traverse.ICollector): void;
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
    class LightProbeNode extends partition.EntityNode {
        private _lightProbe;
        /**
        *
        * @param lightProbe
        */
        constructor(lightProbe: away.entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: away.traverse.ICollector): void;
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
    class PointLightNode extends partition.EntityNode {
        private _pointLight;
        /**
        *
        * @param pointLight
        */
        constructor(pointLight: away.entities.IEntity);
        /**
        * @inheritDoc
        */
        public acceptTraverser(traverser: away.traverse.ICollector): void;
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
    * SkyboxNode is a space partitioning leaf node that contains a Skybox object.
    *
    * @class away.partition.SkyboxNode
    */
    class SkyboxNode extends partition.EntityNode {
        private _skyBox;
        /**
        * Creates a new SkyboxNode object.
        * @param skyBox The Skybox to be contained in the node.
        */
        constructor(skyBox: away.entities.IEntity);
        /**
        *
        * @param planes
        * @param numPlanes
        * @returns {boolean}
        */
        public isInFrustum(planes: away.geom.Plane3D[], numPlanes: number): boolean;
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
        public rayPosition: away.geom.Vector3D;
        public rayDirection: away.geom.Vector3D;
        constructor();
        public _pPetCollisionNormal(indexData: number[], vertexData: number[], triangleIndex: number): away.geom.Vector3D;
        public _pGetCollisionUV(indexData: number[], uvData: number[], triangleIndex: number, v: number, w: number, u: number, uvOffset: number, uvStride: number): away.geom.Point;
        public testRenderableCollision(renderable: away.pool.RenderableBase, pickingCollisionVO: pick.PickingCollisionVO, shortestCollisionDistance: number): boolean;
        /**
        * @inheritDoc
        */
        public setLocalRay(localPosition: away.geom.Vector3D, localDirection: away.geom.Vector3D): void;
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
    class JSPickingCollider extends pick.PickingColliderBase implements pick.IPickingCollider {
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
        public testRenderableCollision(renderable: away.pool.RenderableBase, pickingCollisionVO: pick.PickingCollisionVO, shortestCollisionDistance: number): boolean;
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
    class ShaderPicker implements pick.IPicker {
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
        public getViewCollision(x: number, y: number, view: away.containers.View): pick.PickingCollisionVO;
        /**
        * @inheritDoc
        */
        public getSceneCollision(position: away.geom.Vector3D, direction: away.geom.Vector3D, scene: away.containers.Scene): pick.PickingCollisionVO;
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.gl.TextureBase): void;
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
* @module away.pick
*/
declare module away.pick {
    /**
    * Picks a 3d object from a view or scene by 3D raycast calculations.
    * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
    * then triggers an optional picking collider on individual entity objects to further determine the precise values of the picking ray collision.
    *
    * @class away.pick.RaycastPicker
    */
    class RaycastPicker implements pick.IPicker {
        private _findClosestCollision;
        private _raycastCollector;
        private _ignoredEntities;
        private _onlyMouseEnabled;
        private _entities;
        private _numEntities;
        private _hasCollisions;
        /**
        * @inheritDoc
        */
        public onlyMouseEnabled : boolean;
        /**
        * Creates a new <code>RaycastPicker</code> object.
        *
        * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
        * or simply returns the first collision encountered Defaults to false.
        */
        constructor(findClosestCollision: boolean);
        /**
        * @inheritDoc
        */
        public getViewCollision(x: number, y: number, view: away.containers.View): pick.PickingCollisionVO;
        public getSceneCollision(position: away.geom.Vector3D, direction: away.geom.Vector3D, scene: away.containers.Scene): pick.PickingCollisionVO;
        public setIgnoreList(entities): void;
        private isIgnored(entity);
        private sortOnNearT(entity1, entity2);
        private getPickingCollisionVO(collector);
        private updateLocalPosition(pickingCollisionVO);
        public dispose(): void;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Options for the different 3D object picking approaches available in Away3D. Can be used for automatic mouse picking on the view.
    *
    * @see away3d.containers.View#mousePicker
    *
    * @class away.pick.PickingType
    */
    class PickingType {
        /**
        * Uses a render pass to pick objects based on a key color that is read back into the engine.
        * Performance can be variable on some GPUs.
        */
        static SHADER: pick.IPicker;
        /**
        * Uses AS3 and Pixel Bender to pick objects based on ray intersection. Returns the hit on the first encountered Entity.
        */
        static RAYCAST_FIRST_ENCOUNTERED: pick.IPicker;
        /**
        * Uses AS3 and Pixel Bender to pick objects based on ray intersection. Returns the best (closest) hit on an Entity.
        */
        static RAYCAST_BEST_HIT: pick.IPicker;
    }
}
/**
* @module away.pick
*/
declare module away.pick {
    /**
    * Options for setting a picking collider for entity objects. Used with the <code>RaycastPicker</code> picking object.
    *
    * @see away.entities.Entity#pickingCollider
    * @see away.pick.RaycastPicker
    *
    * @class away.pick.PickingColliderType
    */
    class PickingColliderType {
        /**
        * Default null collider that forces picker to only use entity bounds for hit calculations on an Entity
        */
        static BOUNDS_ONLY: pick.IPickingCollider;
        /**
        * Pure AS3 picking collider that returns the first encountered hit on an Entity. Useful for low poly meshes and applying to many mesh instances.
        *
        * @see away.pick.JSPickingCollider
        */
        static AS3_FIRST_ENCOUNTERED: pick.IPickingCollider;
        /**
        * Pure AS3 picking collider that returns the best (closest) hit on an Entity. Useful for low poly meshes and applying to many mesh instances.
        *
        * @see away.pick.JSPickingCollider
        */
        static AS3_BEST_HIT: pick.IPickingCollider;
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
    class RendererBase extends away.events.EventDispatcher {
        public _pContext: away.gl.ContextGL;
        public _pStageGL: away.base.StageGL;
        public _pBackBufferInvalid: boolean;
        public _depthPrepass: boolean;
        private _backgroundR;
        private _backgroundG;
        private _backgroundB;
        private _backgroundAlpha;
        public _shareContext: boolean;
        public _pRenderTarget: away.gl.TextureBase;
        public _pRenderTargetSurface: number;
        public _width: number;
        public _height: number;
        private _renderToTexture;
        public textureRatioX: number;
        public textureRatioY: number;
        private _snapshotBitmapData;
        private _snapshotRequired;
        public _pRttViewProjectionMatrix: away.geom.Matrix3D;
        private _onContextUpdateDelegate;
        /**
        * Creates a new RendererBase object.
        */
        constructor(renderToTexture?: boolean);
        public _iCreateEntityCollector(): away.traverse.ICollector;
        public iRenderToTexture : boolean;
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
        public stageGL : away.base.StageGL;
        public iSetStageGL(value: away.base.StageGL): void;
        /**
        * Defers control of ContextGL clear() and present() calls to StageGL, enabling multiple StageGL frameworks
        * to share the same ContextGL object.
        */
        public shareContext : boolean;
        /**
        * Disposes the resources used by the RendererBase.
        */
        public dispose(): void;
        public render(entityCollector: away.traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param target An option target texture to render to.
        * @param surfaceSelector The index of a CubeTexture's face to render to.
        * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
        */
        public _iRender(entityCollector: away.traverse.ICollector, target?: away.gl.TextureBase, scissorRect?: away.geom.Rectangle, surfaceSelector?: number): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param target An option target texture to render to.
        * @param surfaceSelector The index of a CubeTexture's face to render to.
        * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
        */
        public pExecuteRender(entityCollector: away.traverse.ICollector, target?: away.gl.TextureBase, scissorRect?: away.geom.Rectangle, surfaceSelector?: number): void;
        public queueSnapshot(bmd: away.base.BitmapData): void;
        public pExecuteRenderToTexturePass(entityCollector: away.traverse.ICollector): void;
        /**
        * Performs the actual drawing of geometry to the target.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        */
        public pDraw(entityCollector: away.traverse.ICollector, target: away.gl.TextureBase): void;
        /**
        * Assign the context once retrieved
        */
        private onContextUpdate(event);
        public _iBackgroundAlpha : number;
        /**
        *
        */
        public updateGlobalPos(): void;
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
    class DepthRenderer extends render.RendererBase {
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
        public iRenderCascades(entityCollector: away.traverse.ShadowCasterCollector, target: away.gl.TextureBase, numCascades: number, scissorRects: away.geom.Rectangle[], cameras: away.entities.Camera[]): void;
        private drawCascadeRenderables(renderable, camera, cullPlanes);
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.gl.TextureBase): void;
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
    class DefaultRenderer extends render.RendererBase implements render.IRenderer {
        public _pRequireDepthRender: boolean;
        private static RTT_PASSES;
        private static SCREEN_PASSES;
        private static ALL_PASSES;
        private _activeMaterial;
        private _pDistanceRenderer;
        private _pDepthRenderer;
        private _skyboxProjection;
        public _pFilter3DRenderer: render.Filter3DRenderer;
        public _pDepthRender: away.gl.Texture;
        public _pRttBufferManager: away.managers.RTTBufferManager;
        public _depthTextureInvalid: boolean;
        private _viewPort;
        private _viewportDirty;
        private _scissorDirty;
        private _forceSoftware;
        private _profile;
        private _antiAlias;
        private _localPos;
        private _globalPos;
        public _pScissorRect: away.geom.Rectangle;
        private _scissorUpdated;
        private _viewPortUpdated;
        private _onViewportUpdatedDelegate;
        public antiAlias : number;
        /**
        *
        */
        public depthPrepass : boolean;
        /**
        *
        * @returns {*}
        */
        public filters3d : away.filters.Filter3DBase[];
        /**
        * A viewPort rectangle equivalent of the StageGL size and position.
        */
        public viewPort : away.geom.Rectangle;
        /**
        * A scissor rectangle equivalent of the view size and position.
        */
        public scissorRect : away.geom.Rectangle;
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
        * Creates a new DefaultRenderer object.
        *
        * @param antiAlias The amount of anti-aliasing to use.
        * @param renderMode The render mode to use.
        */
        constructor(forceSoftware?: boolean, profile?: string);
        public render(entityCollector: away.traverse.ICollector): void;
        public pExecuteRender(entityCollector: away.traverse.EntityCollector, target?: away.gl.TextureBase, scissorRect?: away.geom.Rectangle, surfaceSelector?: number): void;
        private updateLights(entityCollector);
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: away.traverse.EntityCollector, target: away.gl.TextureBase): void;
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
        public pRenderDepthPrepass(entityCollector: away.traverse.EntityCollector): void;
        /**
        *
        */
        public pRenderSceneDepthToTexture(entityCollector: away.traverse.EntityCollector): void;
        /**
        * Updates the backbuffer dimensions.
        */
        public pUpdateBackBuffer(): void;
        public iSetStageGL(value: away.base.StageGL): void;
        /**
        *
        */
        private initDepthTexture(context);
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
        public onViewportUpdated(event: away.events.StageGLEvent): void;
        /**
        *
        */
        public updateGlobalPos(): void;
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
        constructor(stageGL: away.base.StageGL);
        private onRTTResize(event);
        public requireDepthRender : boolean;
        public getMainInputTexture(stageGL: away.base.StageGL): away.gl.Texture;
        public filters : away.filters.Filter3DBase[];
        private updateFilterTasks(stageGL);
        public render(stageGL: away.base.StageGL, camera: away.entities.Camera, depthTexture: away.gl.Texture): void;
        private updateFilterSizes();
        public dispose(): void;
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
        static createCheckeredBitmapData(): away.base.BitmapData;
        private static createDefaultMaterial();
    }
}
declare module away.entities {
    class SegmentSet extends away.base.DisplayObject implements entities.IEntity, away.base.IMaterialOwner {
        private _uvTransform;
        private _material;
        private _animator;
        public _pSubGeometry: away.base.SegmentSubGeometry;
        /**
        *
        */
        public animator : away.animators.IAnimator;
        /**
        *
        */
        public assetType : string;
        /**
        *
        */
        public castsShadows : boolean;
        /**
        *
        */
        public material : away.materials.MaterialBase;
        /**
        *
        */
        public subGeometry : away.base.SegmentSubGeometry;
        /**
        *
        */
        public uvTransform : away.geom.UVTransform;
        /**
        *
        */
        constructor();
        /**
        * //TODO
        *
        * @param segment
        */
        public addSegment(segment: away.base.Segment): void;
        /**
        * //TODO
        *
        * @param index
        * @returns {*}
        */
        public getSegment(index: number): away.base.Segment;
        /**
        * //TODO
        *
        * @param index
        * @param dispose
        */
        public removeSegmentByIndex(index: number, dispose?: boolean): void;
        /**
        * //TODO
        */
        public removeAllSegments(): void;
        /**
        * //TODO
        *
        * @param segment
        * @param dispose
        */
        public removeSegment(segment: away.base.Segment, dispose?: boolean): void;
        /**
        * //TODO
        */
        public dispose(): void;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        /**
        * //TOOD
        *
        * @returns {away.bounds.BoundingSphere}
        *
        * @protected
        */
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        /**
        * //TODO
        *
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        * //TODO
        *
        * @internal
        */
        public _iSetUVMatrixComponents(offsetU: number, offsetV: number, scaleU: number, scaleV: number, rotationUV: number): void;
        /**
        * //TODO
        *
        * @internal
        */
        public _iIsMouseEnabled(): boolean;
    }
}
declare module away.entities {
    /**
    * Mesh is an instance of a Geometry, augmenting it with a presence in the scene graph, a material, and an animation
    * state. It consists out of SubMeshes, which in turn correspond to SubGeometries. SubMeshes allow different parts
    * of the geometry to be assigned different materials.
    */
    class Mesh extends away.containers.DisplayObjectContainer implements entities.IEntity, away.base.IMaterialOwner, away.library.IAsset {
        private _uvTransform;
        private _subMeshes;
        private _geometry;
        private _material;
        private _animator;
        private _castsShadows;
        private _shareAnimationGeometry;
        private _onGeometryBoundsInvalidDelegate;
        private _onSubGeometryAddedDelegate;
        private _onSubGeometryRemovedDelegate;
        /**
        * Defines the animator of the mesh. Act on the mesh's geometry.  Default value is <code>null</code>.
        */
        public animator : away.animators.IAnimator;
        /**
        *
        */
        public assetType : string;
        /**
        * Indicates whether or not the Mesh can cast shadows. Default value is <code>true</code>.
        */
        public castsShadows : boolean;
        /**
        * The geometry used by the mesh that provides it with its shape.
        */
        public geometry : away.base.Geometry;
        /**
        * The material with which to render the Mesh.
        */
        public material : away.materials.MaterialBase;
        /**
        * Indicates whether or not the mesh share the same animation geometry.
        */
        public shareAnimationGeometry : boolean;
        /**
        * The SubMeshes out of which the Mesh consists. Every SubMesh can be assigned a material to override the Mesh's
        * material.
        */
        public subMeshes : away.base.SubMesh[];
        /**
        *
        */
        public uvTransform : away.geom.UVTransform;
        /**
        * Create a new Mesh object.
        *
        * @param geometry                    The geometry used by the mesh that provides it with its shape.
        * @param material    [optional]        The material with which to render the Mesh.
        */
        constructor(geometry: away.base.Geometry, material?: away.materials.MaterialBase);
        /**
        *
        */
        public bakeTransformations(): void;
        /**
        * Clears the animation geometry of this mesh. It will cause animation to generate a new animation geometry. Work only when shareAnimationGeometry is false.
        */
        public clearAnimationGeometry(): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * Disposes mesh including the animator and children. This is a merely a convenience method.
        * @return
        */
        public disposeWithAnimatorAndChildren(): void;
        /**
        * Clones this Mesh instance along with all it's children, while re-using the same
        * material, geometry and animation set. The returned result will be a copy of this mesh,
        * containing copies of all of it's children.
        *
        * Properties that are re-used (i.e. not cloned) by the new copy include name,
        * geometry, and material. Properties that are cloned or created anew for the copy
        * include subMeshes, children of the mesh, and the animator.
        *
        * If you want to copy just the mesh, reusing it's geometry and material while not
        * cloning it's children, the simplest way is to create a new mesh manually:
        *
        * <code>
        * var clone : Mesh = new Mesh(original.geometry, original.material);
        * </code>
        */
        public clone(): away.base.DisplayObject;
        /**
        * //TODO
        *
        * @param subGeometry
        * @returns {SubMesh}
        */
        public getSubMeshFromSubGeometry(subGeometry: away.base.SubGeometry): away.base.SubMesh;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        /**
        * //TODO
        *
        * @protected
        */
        public pUpdateBounds(): void;
        /**
        * //TODO
        *
        * @private
        */
        private onGeometryBoundsInvalid(event);
        /**
        * Called when a SubGeometry was added to the Geometry.
        *
        * @private
        */
        private onSubGeometryAdded(event);
        /**
        * Called when a SubGeometry was removed from the Geometry.
        *
        * @private
        */
        private onSubGeometryRemoved(event);
        /**
        * Adds a SubMesh wrapping a SubGeometry.
        *
        * @param subGeometry
        */
        private addSubMesh(subGeometry);
        /**
        * @internal
        */
        public _iSetUVMatrixComponents(offsetU: number, offsetV: number, scaleU: number, scaleV: number, rotationUV: number): void;
    }
}
declare module away.entities {
    /**
    * A Skybox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
    * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
    * the sky box is always as large as possible without being clipped.
    */
    class Skybox extends away.base.DisplayObject implements entities.IEntity, away.base.IMaterialOwner {
        private _uvTransform;
        private _material;
        private _animator;
        public animator : away.animators.AnimatorBase;
        /**
        *
        */
        public uvTransform : away.geom.UVTransform;
        /**
        * Create a new Skybox object.
        * @param cubeMap The CubeMap to use for the sky box's texture.
        */
        constructor(cubeMap: away.textures.CubeTextureBase);
        /**
        * The material with which to render the object.
        */
        public material : away.materials.MaterialBase;
        public assetType : string;
        /**
        * @protected
        */
        public pInvalidateBounds(): void;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        /**
        * @protected
        */
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        /**
        * @protected
        */
        public pUpdateBounds(): void;
        public castsShadows : boolean;
        /**
        * @internal
        */
        public _iSetUVMatrixComponents(offsetU: number, offsetV: number, scaleU: number, scaleV: number, rotationUV: number): void;
    }
}
declare module away.containers {
    /**
    * Loader3D can load any file format that Away3D supports (or for which a third-party parser
    * has been plugged in) and be added directly to the scene. As assets are encountered
    * they are added to the Loader3D container. Assets that can not be displayed in the scene
    * graph (e.g. unused bitmaps/materials/skeletons etc) will be ignored.
    *
    * This provides a fast and easy way to load models (no need for event listeners) but is not
    * very versatile since many types of assets are ignored.
    *
    * Loader3D by default uses the AssetLibrary to load all assets, which means that they also
    * ends up in the library. To circumvent this, Loader3D can be configured to not use the
    * AssetLibrary in which case it will use the AssetLoader directly.
    *
    * @see away.net.AssetLoader
    * @see away.library.AssetLibrary
    */
    class Loader3D extends containers.DisplayObjectContainer {
        private _loadingSessions;
        private _useAssetLib;
        private _assetLibId;
        private _onResourceCompleteDelegate;
        private _onAssetCompleteDelegate;
        constructor(useAssetLibrary?: boolean, assetLibraryId?: string);
        /**
        * Loads a file and (optionally) all of its dependencies.
        *
        * @param req The URLRequest object containing the URL of the file to be loaded.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public load(req: away.net.URLRequest, context?: away.net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): away.net.AssetLoaderToken;
        /**
        * Loads a resource from already loaded data.
        *
        * @param data The data object containing all resource information.
        * @param context An optional context object providing additional parameters for loading
        * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
        * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
        */
        public loadData(data: any, context?: away.net.AssetLoaderContext, ns?: string, parser?: away.parsers.ParserBase): away.net.AssetLoaderToken;
        /**
        * Stop the current loading/parsing process.
        */
        public stopLoad(): void;
        /**
        * Enables a specific parser.
        * When no specific parser is set for a loading/parsing opperation,
        * loader3d can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parserClass The parser class to enable.
        * @see away.parsers.Parsers
        */
        static enableParser(parserClass: Object): void;
        /**
        * Enables a list of parsers.
        * When no specific parser is set for a loading/parsing opperation,
        * loader3d can autoselect the correct parser to use.
        * A parser must have been enabled, to be considered when autoselecting the parser.
        *
        * @param parserClasses A Vector of parser classes to enable.
        * @see away.parsers.Parsers
        */
        static enableParsers(parserClasses: Object[]): void;
        private removeListeners(dispatcher);
        private onAssetComplete(ev);
        /**
        * Called when an error occurs during loading
        */
        private onLoadError(event);
        /**
        * Called when a an error occurs during parsing
        */
        private onParseError(event);
        /**
        * Called when the resource and all of its dependencies was retrieved.
        */
        private onResourceComplete(event);
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
        public target : away.gl.Texture;
        public textureWidth : number;
        public textureHeight : number;
        public getMainInputTexture(stage: away.base.StageGL): away.gl.Texture;
        public dispose(): void;
        public pInvalidateProgram(): void;
        public pUpdateProgram(stage: away.base.StageGL): void;
        public pGetVertexCode(): string;
        public pGetFragmentCode(): string;
        public pUpdateTextures(stage: away.base.StageGL): void;
        public getProgram(stageGL: away.base.StageGL): away.gl.Program;
        public activate(stageGL: away.base.StageGL, camera: away.entities.Camera, depthTexture: away.gl.Texture): void;
        public deactivate(stageGL: away.base.StageGL): void;
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
        public getMainInputTexture(stageGL: away.base.StageGL): away.gl.Texture;
        public textureWidth : number;
        public textureHeight : number;
        public setRenderTargets(mainTarget: away.gl.Texture, stageGL: away.base.StageGL): void;
        public dispose(): void;
        public update(stage: away.base.StageGL, camera: away.entities.Camera): void;
    }
}
declare module away.lights {
    class LightBase extends away.containers.DisplayObjectContainer {
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
        public iGetObjectProjectionMatrix(entity: away.entities.IEntity, camera: away.entities.Camera, target?: away.geom.Matrix3D): away.geom.Matrix3D;
        public assetType : string;
        private updateSpecular();
        private updateDiffuse();
        public shadowMapper : lights.ShadowMapperBase;
    }
}
declare module away.lights {
    class LightProbe extends lights.LightBase implements away.entities.IEntity {
        private _diffuseMap;
        private _specularMap;
        constructor(diffuseMap: away.textures.CubeTextureBase, specularMap?: away.textures.CubeTextureBase);
        public diffuseMap : away.textures.CubeTextureBase;
        public specularMap : away.textures.CubeTextureBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public pUpdateBounds(): void;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(entity: away.entities.IEntity, camera: away.entities.Camera, target?: away.geom.Matrix3D): away.geom.Matrix3D;
    }
}
declare module away.lights {
    class PointLight extends lights.LightBase implements away.entities.IEntity {
        public _pRadius: number;
        public _pFallOff: number;
        public _pFallOffFactor: number;
        constructor();
        public pCreateShadowMapper(): lights.ShadowMapperBase;
        public radius : number;
        public iFallOffFactor(): number;
        public fallOff : number;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public pUpdateBounds(): void;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public iGetObjectProjectionMatrix(entity: away.entities.IEntity, camera: away.entities.Camera, target?: away.geom.Matrix3D): away.geom.Matrix3D;
    }
}
declare module away.lights {
    class DirectionalLight extends lights.LightBase implements away.entities.IEntity {
        private _direction;
        private _tmpLookAt;
        private _sceneDirection;
        private _projAABBPoints;
        constructor(xDir?: number, yDir?: number, zDir?: number);
        public sceneDirection : away.geom.Vector3D;
        public direction : away.geom.Vector3D;
        public pGetDefaultBoundingVolume(): away.bounds.BoundingVolumeBase;
        public pUpdateBounds(): void;
        public pUpdateSceneTransform(): void;
        public pCreateShadowMapper(): lights.ShadowMapperBase;
        /**
        * @protected
        */
        public pCreateEntityPartitionNode(): away.partition.EntityNode;
        public iGetObjectProjectionMatrix(entity: away.entities.IEntity, camera: away.entities.Camera, target?: away.geom.Matrix3D): away.geom.Matrix3D;
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
        public iRenderDepthMap(stageGL: away.base.StageGL, entityCollector: away.traverse.EntityCollector, renderer: away.render.DepthRenderer): void;
        public pUpdateDepthProjection(viewCamera: away.entities.Camera): void;
        public pDrawDepthMap(target: away.gl.TextureBase, scene: away.containers.Scene, renderer: away.render.DepthRenderer): void;
        public _pSetDepthMapSize(value): void;
    }
}
declare module away.lights {
    class CubeMapShadowMapper extends lights.ShadowMapperBase {
        private _depthCameras;
        private _projections;
        private _needsRender;
        constructor();
        private initCameras();
        private addCamera(rotationX, rotationY, rotationZ);
        public pCreateDepthTexture(): away.textures.TextureProxyBase;
        public pUpdateDepthProjection(viewCamera: away.entities.Camera): void;
        public pDrawDepthMap(target: away.gl.TextureBase, scene: away.containers.Scene, renderer: away.render.DepthRenderer): void;
    }
}
declare module away.lights {
    class DirectionalShadowMapper extends lights.ShadowMapperBase {
        public _pOverallDepthCamera: away.entities.Camera;
        public _pLocalFrustum: number[];
        public _pLightOffset: number;
        public _pMatrix: away.geom.Matrix3D;
        public _pOverallDepthProjection: away.projections.FreeMatrixProjection;
        public _pSnap: number;
        public _pCullPlanes: away.geom.Plane3D[];
        public _pMinZ: number;
        public _pMaxZ: number;
        constructor();
        public snap : number;
        public lightOffset : number;
        public iDepthProjection : away.geom.Matrix3D;
        public depth : number;
        public pDrawDepthMap(target: away.gl.TextureBase, scene: away.containers.Scene, renderer: away.render.DepthRenderer): void;
        public pUpdateCullPlanes(viewCamera: away.entities.Camera): void;
        public pUpdateDepthProjection(viewCamera: away.entities.Camera): void;
        public pUpdateProjectionFromFrustumCorners(viewCamera: away.entities.Camera, corners: number[], matrix: away.geom.Matrix3D): void;
    }
}
declare module away.lights {
    import Rectangle = away.geom.Rectangle;
    class CascadeShadowMapper extends lights.DirectionalShadowMapper implements away.events.IEventDispatcher {
        public _pScissorRects: Rectangle[];
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
        public getDepthProjections(partition: number): away.geom.Matrix3D;
        private init();
        public _pSetDepthMapSize(value: number): void;
        private invalidateScissorRects();
        public numCascades : number;
        public pDrawDepthMap(target: away.gl.TextureBase, scene: away.containers.Scene, renderer: away.render.DepthRenderer): void;
        private updateScissorRects();
        public pUpdateDepthProjection(viewCamera: away.entities.Camera): void;
        private updateProjectionPartition(matrix, splitRatio, texOffsetX, texOffsetY);
        public addEventListener(type: string, listener: Function): void;
        public removeEventListener(type: string, listener: Function): void;
        public dispatchEvent(event: away.events.Event): void;
        public hasEventListener(type: string): boolean;
        public _iNearPlaneDistances : number[];
    }
}
declare module away.lights {
    class NearDirectionalShadowMapper extends lights.DirectionalShadowMapper {
        private _coverageRatio;
        constructor(coverageRatio?: number);
        /**
        * A value between 0 and 1 to indicate the ratio of the view frustum that needs to be covered by the shadow map.
        */
        public coverageRatio : number;
        public pUpdateDepthProjection(viewCamera: away.entities.Camera): void;
    }
}
declare module away.managers {
    /**
    * Mouse3DManager enforces a singleton pattern and is not intended to be instanced.
    * it provides a manager class for detecting 3D mouse hits on View objects and sending out 3D mouse events.
    */
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
        /**
        * Creates a new <code>Mouse3DManager</code> object.
        */
        constructor();
        public updateCollider(view: away.containers.View): void;
        public fireMouseEvents(): void;
        public addViewLayer(view: away.containers.View): void;
        public enableMouseListeners(view: away.containers.View): void;
        public disableMouseListeners(view: away.containers.View): void;
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
    class AGALProgramCache {
        private static _instances;
        private _stageGL;
        private _program3Ds;
        private _ids;
        private _usages;
        private _keys;
        private _onContextGLDisposedDelegate;
        private static _currentId;
        constructor(stageGL: away.base.StageGL, agalProgramCacheSingletonEnforcer: AGALProgramCacheSingletonEnforcer);
        static getInstance(stageGL: away.base.StageGL): AGALProgramCache;
        static getInstanceFromIndex(index: number): AGALProgramCache;
        private static onContextGLDisposed(event);
        public dispose(): void;
        public setProgram(pass: away.materials.MaterialPassBase, vertexCode: string, fragmentCode: string): void;
        public freeProgram(programId: number): void;
        private destroyProgram(key);
        private getKey(vertexCode, fragmentCode);
    }
}
declare class AGALProgramCacheSingletonEnforcer {
}
declare module away.materials {
    import Program = away.gl.Program;
    /**
    * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
    * a render call per required renderable.
    */
    class MaterialPassBase extends away.events.EventDispatcher {
        static MATERIALPASS_ID_COUNT: number;
        /**
        * An id for this material pass, used to identify material passes when using animation sets.
        *
        * @private
        */
        public _iUniqueId: number;
        public _pMaterial: materials.MaterialBase;
        private _animationSet;
        public _iPrograms: Program[];
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
        private _onLightsChangeDelegate;
        public animationRegisterCache: away.animators.AnimationRegisterCache;
        /**
        * Creates a new MaterialPassBase object.
        *
        * @param renderToTexture Indicates whether this pass is a render-to-texture pass.
        */
        constructor(renderToTexture?: boolean);
        /**
        * The material to which this pass belongs.
        */
        public material : materials.MaterialBase;
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
        public animationSet : away.animators.IAnimationSet;
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
        public iUpdateAnimationState(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * Renders an object to the current render target.
        *
        * @private
        */
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
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
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * Clears the render state for the pass. This needs to be called before activating another pass.
        * @param stageGL The StageGL used for rendering
        *
        * @private
        */
        public iDeactivate(stageGL: away.base.StageGL): void;
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
        public iUpdateProgram(stageGL: away.base.StageGL): void;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see away.materials.LightPickerBase
        * @see away.materials.StaticLightPicker
        */
        public lightPicker : materials.LightPickerBase;
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
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new CompiledPass object.
        * @param material The material to which this pass belongs.
        */
        constructor(material: materials.MaterialBase);
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
        public iUpdateProgram(stageGL: away.base.StageGL): void;
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
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
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
        public normalMap : away.textures.Texture2DBase;
        /**
        * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
        */
        public normalMethod : materials.BasicNormalMethod;
        /**
        * The method that provides the ambient lighting contribution. Defaults to BasicAmbientMethod.
        */
        public ambientMethod : materials.BasicAmbientMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : materials.ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to BasicDiffuseMethod.
        */
        public diffuseMethod : materials.BasicDiffuseMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to BasicSpecularMethod.
        */
        public specularMethod : materials.BasicSpecularMethod;
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
        public pAddPasses(passes: materials.MaterialPassBase[]): void;
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
        public pUpdateProbes(stageGL: away.base.StageGL): void;
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
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
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
        public iDeactivate(stageGL: away.base.StageGL): void;
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
    class SuperShaderPass extends materials.CompiledPass {
        private _includeCasters;
        private _ignoreLights;
        /**
        * Creates a new SuperShaderPass objects.
        *
        * @param material The material to which this material belongs.
        */
        constructor(material: materials.MaterialBase);
        /**
        * @inheritDoc
        */
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
        /**
        * Indicates whether lights that cast shadows should be included in the pass.
        */
        public includeCasters : boolean;
        /**
        * The ColorTransform object to transform the colour of the material with. Defaults to null.
        */
        public colorTransform : away.geom.ColorTransform;
        /**
        * The ColorTransformMethod object to transform the colour of the material with. Defaults to null.
        */
        public colorTransformMethod : materials.ColorTransformMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addMethod(method: materials.EffectMethodBase): void;
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
        public hasMethod(method: materials.EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): materials.EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeMethod(method: materials.EffectMethodBase): void;
        /**
        * @inheritDoc
        */
        public pUpdateLights(): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stageGL: away.base.StageGL): void;
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
        public pUpdateProbes(stageGL: away.base.StageGL): void;
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
    class DepthMapPass extends materials.MaterialPassBase {
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
        public alphaMask : away.textures.Texture2DBase;
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
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * DistanceMapPass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
    * This is used to render omnidirectional shadow maps.
    */
    class DistanceMapPass extends materials.MaterialPassBase {
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
        public alphaMask : away.textures.Texture2DBase;
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
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * LightingPass is a shader pass that uses shader methods to compile a complete program. It only includes the lighting
    * methods. It's used by multipass materials to accumulate lighting passes.
    *
    * @see away3d.materials.MultiPassMaterialBase
    */
    class LightingPass extends materials.CompiledPass {
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
        constructor(material: materials.MaterialBase);
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
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
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
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
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
        public pUpdateProbes(stageGL: away.base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * ShadowCasterPass is a shader pass that uses shader methods to compile a complete program. It only draws the lighting
    * contribution for a single shadow-casting light.
    *
    * @see away3d.materials.methods.ShadingMethodBase
    */
    class ShadowCasterPass extends materials.CompiledPass {
        private _tangentSpace;
        private _lightVertexConstantIndex;
        private _inverseSceneMatrix;
        /**
        * Creates a new ShadowCasterPass objects.
        *
        * @param material The material to which this pass belongs.
        */
        constructor(material: materials.MaterialBase);
        /**
        * @inheritDoc
        */
        public pCreateCompiler(profile: string): materials.ShaderCompiler;
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
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
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
        public pUpdateProbes(stageGL: away.base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * SegmentPass is a material pass that draws wireframe segments.
    */
    class SegmentPass extends materials.MaterialPassBase {
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
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public pDeactivate(stageGL: away.base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
    */
    class SkyboxPass extends materials.MaterialPassBase {
        private _cubeTexture;
        private _vertexData;
        /**
        * Creates a new SkyboxPass object.
        */
        constructor();
        /**
        * The cube texture to use as the skybox.
        */
        public cubeTexture : away.textures.CubeTextureBase;
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
        public iRender(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(stageGL: away.base.StageGL, camera: away.entities.Camera): void;
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
    * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
    * the final shading program.
    */
    class ShadingMethodBase extends away.library.NamedAssetBase {
        public _sharedRegisters: materials.ShaderRegisterData;
        private _passes;
        /**
        * Create a new ShadingMethodBase object.
        * @param needsNormals Defines whether or not the method requires normals.
        * @param needsView Defines whether or not the method requires the view direction.
        */
        constructor();
        /**
        * Initializes the properties for a MethodVO, including register and texture indices.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * Initializes unchanging shader constants using the data from a MethodVO.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * The shared registers created by the compiler and possibly used by methods.
        */
        public iSharedRegisters : materials.ShaderRegisterData;
        public setISharedRegisters(value: materials.ShaderRegisterData): void;
        /**
        * Any passes required that render to a texture used by this method.
        */
        public passes : materials.MaterialPassBase[];
        /**
        * Cleans up any resources used by the current object.
        */
        public dispose(): void;
        /**
        * Creates a data container that contains material-dependent data. Provided as a factory method so a custom subtype can be overridden when needed.
        */
        public iCreateMethodVO(): materials.MethodVO;
        /**
        * Resets the compilation state of the method.
        */
        public iReset(): void;
        /**
        * Resets the method's state for compilation.
        * @private
        */
        public iCleanCompilationData(): void;
        /**
        * Get the vertex shader code for this method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @private
        */
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * Sets the render state for this method.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param stageGL The StageGL object currently used for rendering.
        * @private
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * Sets the render state for a single renderable.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param renderable The renderable currently being rendered.
        * @param stageGL The StageGL object currently used for rendering.
        * @param camera The camera from which the scene is currently rendered.
        */
        public iSetRenderState(vo: materials.MethodVO, renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * Clears the render state for this method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param stageGL The StageGL object currently used for rendering.
        */
        public iDeactivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param targetReg The register in which to store the sampled colour.
        * @param inputReg The texture stream register.
        * @param texture The texture which will be assigned to the given slot.
        * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
        * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
        * @return The fragment code that performs the sampling.
        */
        public pGetTex2DSampleCode(vo: materials.MethodVO, targetReg: materials.ShaderRegisterElement, inputReg: materials.ShaderRegisterElement, texture: away.textures.TextureProxyBase, uvReg?: materials.ShaderRegisterElement, forceWrap?: string): string;
        /**
        * A helper method that generates standard code for sampling from a cube texture.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param targetReg The register in which to store the sampled colour.
        * @param inputReg The texture stream register.
        * @param texture The cube map which will be assigned to the given slot.
        * @param uvReg The direction vector with which to sample the cube map.
        */
        public pGetTexCubeSampleCode(vo: materials.MethodVO, targetReg: materials.ShaderRegisterElement, inputReg: materials.ShaderRegisterElement, texture: away.textures.TextureProxyBase, uvReg: materials.ShaderRegisterElement): string;
        /**
        * Generates a texture format string for the sample instruction.
        * @param texture The texture for which to get the format string.
        * @return
        */
        private getFormatStringForTexture(texture);
        /**
        * Marks the shader program as invalid, so it will be recompiled before the next render.
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
    * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
    * and are in essence post-process effects on the materials.
    */
    class EffectMethodBase extends materials.ShadingMethodBase implements away.library.IAsset {
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
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
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
        public method: materials.EffectMethodBase;
        /**
        * The MethodVO data for the given method containing the material-specific data for a given material/method combination.
        */
        public data: materials.MethodVO;
        /**
        * Creates a new MethodVOSet object.
        * @param method The method for which we need to store a MethodVO object.
        */
        constructor(method: materials.EffectMethodBase);
    }
}
declare module away.materials {
    /**
    * ShaderMethodSetup contains the method configuration for an entire material.
    */
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
        private invalidateShaderProgram();
        /**
        *  The method used to generate the per-pixel normals.
        */
        public normalMethod : materials.BasicNormalMethod;
        /**
        * The method that provides the ambient lighting contribution.
        */
        public ambientMethod : materials.BasicAmbientMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered.
        */
        public shadowMethod : materials.ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution.
        */
        public diffuseMethod : materials.BasicDiffuseMethod;
        /**
        * The method to perform specular shading.
        */
        public specularMethod : materials.BasicSpecularMethod;
        /**
        * @private
        */
        public iColorTransformMethod : materials.ColorTransformMethod;
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
        public addMethod(method: materials.EffectMethodBase): void;
        /**
        * Queries whether a given effect method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasMethod(method: materials.EffectMethodBase): boolean;
        /**
        * Inserts a method to change the material after all lighting is performed at the given index.
        * @param method The method to be added.
        * @param index The index of the method's occurrence
        */
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): materials.EffectMethodBase;
        /**
        * The number of "effect" methods added to the material.
        */
        public numMethods : number;
        /**
        * Removes a method from the pass.
        * @param method The method to be removed.
        */
        public removeMethod(method: materials.EffectMethodBase): void;
        private getMethodSetForMethod(method);
    }
}
declare module away.materials {
    /**
    * LightingMethodBase provides an abstract base method for shading methods that uses lights.
    * Used for diffuse and specular shaders only.
    */
    class LightingMethodBase extends materials.ShadingMethodBase {
        /**
        * A method that is exposed to wrappers in case the strength needs to be controlled
        */
        public _iModulateMethod;
        public _iModulateMethodScope: Object;
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
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * Get the fragment shader code that will generate the code relevant to a single light.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param lightDirReg The register containing the light direction vector.
        * @param lightColReg The register containing the light colour.
        * @param regCache The register cache used during the compilation.
        */
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        /**
        * Get the fragment shader code that will generate the code relevant to a single light probe object.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param cubeMapReg The register containing the cube map for the current probe
        * @param weightRegister A string representation of the register + component containing the current weight
        * @param regCache The register cache providing any necessary registers to the shader
        */
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        /**
        * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
        *
        * @param vo The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register containing the final shading output.
        * @private
        */
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * ShadowMapMethodBase provides an abstract base method for shadow map methods.
    */
    class ShadowMapMethodBase extends materials.ShadingMethodBase implements away.library.IAsset {
        public _pCastingLight: away.lights.LightBase;
        public _pShadowMapper: away.lights.ShadowMapperBase;
        public _pEpsilon: number;
        public _pAlpha: number;
        /**
        * Creates a new ShadowMapMethodBase object.
        * @param castingLight The light used to cast shadows.
        */
        constructor(castingLight: away.lights.LightBase);
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
        public castingLight : away.lights.LightBase;
        /**
        * A small value to counter floating point precision errors when comparing values in the shadow map with the
        * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
        */
        public epsilon : number;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * SimpleShadowMapMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
    */
    class SimpleShadowMapMethodBase extends materials.ShadowMapMethodBase {
        public _pDepthMapCoordReg: materials.ShaderRegisterElement;
        public _pUsePoint: boolean;
        /**
        * Creates a new SimpleShadowMapMethodBase object.
        * @param castingLight The light used to cast shadows.
        */
        constructor(castingLight: away.lights.LightBase);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * Wrappers that override the vertex shader need to set this explicitly
        */
        public _iDepthMapCoordReg : materials.ShaderRegisterElement;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * Gets the vertex code for shadow mapping with a point light.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        */
        public _pGetPointVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        */
        public pGetPlanarVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * Gets the fragment code for shadow mapping with a planar shadow map.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register to contain the shadow coverage
        * @return
        */
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * Gets the fragment code for shadow mapping with a point light.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register to contain the shadow coverage
        * @return
        */
        public _pGetPointFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: materials.MethodVO, renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
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
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * Sets the method state for cascade shadow mapping.
        */
        public iActivateForCascade(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * DitheredShadowMapMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
    * results of neighbouring pixels.
    */
    class FilteredShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        /**
        * Creates a new BasicDiffuseMethod object.
        *
        * @param castingLight The light casting the shadow
        */
        constructor(castingLight: away.lights.DirectionalLight);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivateForCascade(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * FogMethod provides a method to add distance-based fog to a material.
    */
    class FogMethod extends materials.EffectMethodBase {
        private _minDistance;
        private _maxDistance;
        private _fogColor;
        private _fogR;
        private _fogG;
        private _fogB;
        /**
        * Creates a new FogMethod object.
        * @param minDistance The distance from which the fog starts appearing.
        * @param maxDistance The distance at which the fog is densest.
        * @param fogColor The colour of the fog.
        */
        constructor(minDistance: number, maxDistance: number, fogColor?: number);
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
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
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * HardShadowMapMethod provides the cheapest shadow map method by using a single tap without any filtering.
    */
    class HardShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        /**
        * Creates a new HardShadowMapMethod object.
        */
        constructor(castingLight: away.lights.LightBase);
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public _pGetPointFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivateForCascade(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * SoftShadowMapMethod provides a soft shadowing technique by randomly distributing sample points.
    */
    class SoftShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        private _range;
        private _numSamples;
        private _offsets;
        /**
        * Creates a new BasicDiffuseMethod object.
        *
        * @param castingLight The light casting the shadows
        * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
        */
        constructor(castingLight: away.lights.DirectionalLight, numSamples?: number, range?: number);
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
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
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
        public iActivateForCascade(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
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
    * DitheredShadowMapMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
    */
    class DitheredShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        private static _grainTexture;
        private static _grainUsages;
        private static _grainBitmapData;
        private _depthMapSize;
        private _range;
        private _numSamples;
        /**
        * Creates a new DitheredShadowMapMethod object.
        * @param castingLight The light casting the shadows
        * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
        */
        constructor(castingLight: away.lights.DirectionalLight, numSamples?: number, range?: number);
        /**
        * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
        * complexity of the shader.
        */
        public numSamples : number;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
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
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
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
        public iActivateForCascade(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, decodeRegister: materials.ShaderRegisterElement, depthTexture: materials.ShaderRegisterElement, depthProjection: materials.ShaderRegisterElement, targetRegister: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * NearShadowMapMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
    * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
    *
    * @see away.lights.NearDirectionalShadowMapper
    */
    class NearShadowMapMethod extends materials.SimpleShadowMapMethodBase {
        private _baseMethod;
        private _fadeRatio;
        private _nearShadowMapper;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new NearShadowMapMethod object.
        * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: HardShadowMapMethod, SoftShadowMapMethod)
        * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
        */
        constructor(baseMethod: materials.SimpleShadowMapMethodBase, fadeRatio?: number);
        /**
        * The base shadow map method on which this method's shading is based.
        */
        public baseMethod : materials.SimpleShadowMapMethodBase;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
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
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: materials.MethodVO, renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
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
        public iSharedRegisters : materials.ShaderRegisterData;
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    /**
    * BasicAmbientMethod provides the default shading method for uniform ambient lighting.
    */
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
        /**
        * Creates a new BasicAmbientMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
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
        public texture : away.textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public copyFrom(method: materials.ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * Updates the ambient color data used by the render state.
        */
        private updateAmbient();
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: materials.MethodVO, renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * BasicDiffuseMethod provides the default shading method for Lambert (dot3) diffuse lighting.
    */
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
        /**
        * Creates a new BasicDiffuseMethod object.
        */
        constructor();
        /**
        * Set internally if the ambient method uses a texture.
        */
        public iUseAmbientTexture : boolean;
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * Forces the creation of the texture.
        * @param stageGL The StageGL used by the renderer
        */
        public generateMip(stageGL: away.base.StageGL): void;
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
        public texture : away.textures.Texture2DBase;
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
        public copyFrom(method: materials.ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * Generate the code that applies the calculated shadow to the diffuse light
        * @param vo The MethodVO object for which the compilation is currently happening.
        * @param regCache The register cache the compiler is currently using for the register management.
        */
        public pApplyShadow(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * Updates the diffuse color data used by the render state.
        */
        private updateDiffuse();
        /**
        * Set internally by the compiler, so the method knows the register containing the shadow calculation.
        */
        public iShadowRegister : materials.ShaderRegisterElement;
        public setIShadowRegister(value: materials.ShaderRegisterElement): void;
    }
}
declare module away.materials {
    /**
    * BasicNormalMethod is the default method for standard tangent-space normal mapping.
    */
    class BasicNormalMethod extends materials.ShadingMethodBase {
        private _texture;
        private _useTexture;
        public _pNormalTextureRegister: materials.ShaderRegisterElement;
        /**
        * Creates a new BasicNormalMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
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
        public copyFrom(method: materials.ShadingMethodBase): void;
        /**
        * The texture containing the normals per pixel.
        */
        public normalMap : away.textures.Texture2DBase;
        public setNormalMap(value: away.textures.Texture2DBase): void;
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
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * BasicSpecularMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
    * version of Phong specularity).
    */
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
        /**
        * Creates a new BasicSpecularMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
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
        public texture : away.textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public copyFrom(method: materials.ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * Updates the specular color data used by the render state.
        */
        private updateSpecular();
        /**
        * Set internally by the compiler, so the method knows the register containing the shadow calculation.
        */
        public iShadowRegister : materials.ShaderRegisterElement;
        public setIShadowRegister(shadowReg: materials.ShaderRegisterElement): void;
    }
}
declare module away.materials {
    /**
    * CascadeShadowMapMethod is a shadow map method to apply cascade shadow mapping on materials.
    * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
    *
    * @see away.lights.CascadeShadowMapper
    */
    class CascadeShadowMapMethod extends materials.ShadowMapMethodBase {
        private _baseMethod;
        private _cascadeShadowMapper;
        private _depthMapCoordVaryings;
        private _cascadeProjections;
        /**
        * Creates a new CascadeShadowMapMethod object.
        *
        * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: HardShadowMapMethod, SoftShadowMapMethod)
        */
        constructor(shadowMethodBase: materials.SimpleShadowMapMethodBase);
        /**
        * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
        * with a DirectionalShadowMapper.
        *
        * @see HardShadowMapMethod
        * @see SoftShadowMapMethod
        */
        public baseMethod : materials.SimpleShadowMapMethodBase;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iSharedRegisters : materials.ShaderRegisterData;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * Creates the registers for the cascades' projection coordinates.
        */
        private initProjectionsRegs(regCache);
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iSetRenderState(vo: materials.MethodVO, renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
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
    * ColorTransformMethod provides a shading method that changes the colour of a material analogous to a
    * ColorTransform object.
    */
    class ColorTransformMethod extends materials.EffectMethodBase {
        private _colorTransform;
        /**
        * Creates a new ColorTransformMethod.
        */
        constructor();
        /**
        * The ColorTransform object to transform the colour of the material with.
        */
        public colorTransform : away.geom.ColorTransform;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
    }
}
declare module away.materials {
    /**
    * PhongSpecularMethod provides a specular method that provides Phong highlights.
    */
    class PhongSpecularMethod extends materials.BasicSpecularMethod {
        /**
        * Creates a new PhongSpecularMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
    }
}
declare module away.materials {
    /**
    * CompositeDiffuseMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
    * calculated diffuse reflection strength.
    */
    class CompositeDiffuseMethod extends materials.BasicDiffuseMethod {
        public pBaseMethod: materials.BasicDiffuseMethod;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new WrapDiffuseMethod object.
        * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the diffuse strength.
        * @param baseDiffuseMethod The base diffuse method on which this method's shading is based.
        */
        constructor(scope: Object, modulateMethod?: Function, baseDiffuseMethod?: materials.BasicDiffuseMethod);
        public _pInitCompositeDiffuseMethod(scope: Object, modulateMethod: Function, baseDiffuseMethod?: materials.BasicDiffuseMethod): void;
        /**
        * The base diffuse method on which this method's shading is based.
        */
        public baseMethod : materials.BasicDiffuseMethod;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
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
        public texture : away.textures.Texture2DBase;
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
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
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
        public iSharedRegisters : materials.ShaderRegisterData;
        public setISharedRegisters(value: materials.ShaderRegisterData): void;
        /**
        * @inheritDoc
        */
        public iShadowRegister : materials.ShaderRegisterElement;
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    /**
    * CompositeSpecularMethod provides a base class for specular methods that wrap a specular method to alter the
    * calculated specular reflection strength.
    */
    class CompositeSpecularMethod extends materials.BasicSpecularMethod {
        private _baseMethod;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new <code>CompositeSpecularMethod</code> object.
        * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
        * @param baseSpecularMethod The base specular method on which this method's shading is based.
        */
        constructor(scope: Object, modulateMethod: Function, baseSpecularMethod?: materials.BasicSpecularMethod);
        public _pInitCompositeSpecularMethod(scope: Object, modulateMethod: Function, baseSpecularMethod?: materials.BasicSpecularMethod): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * The base specular method on which this method's shading is based.
        */
        public baseMethod : materials.BasicSpecularMethod;
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
        public passes : materials.MaterialPassBase[];
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public texture : away.textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iSharedRegisters : materials.ShaderRegisterData;
        public setISharedRegisters(value: materials.ShaderRegisterData): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(vo: materials.MethodVO, lightDirReg: materials.ShaderRegisterElement, lightColReg: materials.ShaderRegisterElement, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        * @return
        */
        public iGetFragmentCodePerProbe(vo: materials.MethodVO, cubeMapReg: materials.ShaderRegisterElement, weightRegister: string, regCache: materials.ShaderRegisterCache): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
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
        public iShadowRegister : materials.ShaderRegisterElement;
        /**
        * Called when the base method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
    }
}
declare module away.materials {
    /**
    * EnvMapMethod provides a material method to perform reflection mapping using cube maps.
    */
    class EnvMapMethod extends materials.EffectMethodBase {
        private _cubeTexture;
        private _alpha;
        private _mask;
        /**
        * Creates an EnvMapMethod object.
        * @param envMap The environment map containing the reflected scene.
        * @param alpha The reflectivity of the surface.
        */
        constructor(envMap: away.textures.CubeTextureBase, alpha?: number);
        /**
        * An optional texture to modulate the reflectivity of the surface.
        */
        public mask : away.textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
        /**
        * The cubic environment map containing the reflected scene.
        */
        public envMap : away.textures.CubeTextureBase;
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
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
    }
}
declare module away.materials {
    /**
    * FresnelSpecularMethod provides a specular shading method that causes stronger highlights on grazing view angles.
    */
    class FresnelSpecularMethod extends materials.CompositeSpecularMethod {
        private _dataReg;
        private _incidentLight;
        private _fresnelPower;
        private _normalReflectance;
        /**
        * Creates a new FresnelSpecularMethod object.
        * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
        * @param baseSpecularMethod The specular method to which the fresnel equation. Defaults to BasicSpecularMethod.
        */
        constructor(basedOnSurface?: boolean, baseSpecularMethod?: materials.BasicSpecularMethod);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
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
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache): string;
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
    * SimpleWaterNormalMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
    */
    class SimpleWaterNormalMethod extends materials.BasicNormalMethod {
        private _texture2;
        private _normalTextureRegister2;
        private _useSecondNormalMap;
        private _water1OffsetX;
        private _water1OffsetY;
        private _water2OffsetX;
        private _water2OffsetY;
        /**
        * Creates a new SimpleWaterNormalMethod object.
        * @param waveMap1 A normal map containing one layer of a wave structure.
        * @param waveMap2 A normal map containing a second layer of a wave structure.
        */
        constructor(waveMap1: away.textures.Texture2DBase, waveMap2: away.textures.Texture2DBase);
        /**
        * @inheritDoc
        */
        public iInitConstants(vo: materials.MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitVO(vo: materials.MethodVO): void;
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
        * @inheritDoc
        */
        public normalMap : away.textures.Texture2DBase;
        /**
        * A second normal map that will be combined with the first to create a wave-like animation pattern.
        */
        public secondaryNormalMap : away.textures.Texture2DBase;
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
        public iActivate(vo: materials.MethodVO, stageGL: away.base.StageGL): void;
        /**
        * @inheritDoc
        */
        public getFragmentCode(vo: materials.MethodVO, regCache: materials.ShaderRegisterCache, targetReg: materials.ShaderRegisterElement): string;
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
        public pointLights : away.lights.PointLight[];
        /**
        * The collected directional lights to be used for shading.
        */
        public directionalLights : away.lights.DirectionalLight[];
        /**
        * The collected point lights that cast shadows to be used for shading.
        */
        public castingPointLights : away.lights.PointLight[];
        /**
        * The collected directional lights that cast shadows to be used for shading.
        */
        public castingDirectionalLights : away.lights.DirectionalLight[];
        /**
        * The collected light probes to be used for shading.
        */
        public lightProbes : away.lights.LightProbe[];
        /**
        * The weights for each light probe, defining their influence on the object.
        */
        public lightProbeWeights : number[];
        /**
        * A collection of all the collected lights.
        */
        public allPickedLights : away.lights.LightBase[];
        /**
        * Updates set of lights for a given renderable and EntityCollector. Always call super.collectLights() after custom overridden code.
        */
        public collectLights(renderable: away.pool.RenderableBase, entityCollector: away.traverse.ICollector): void;
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
    class StaticLightPicker extends materials.LightPickerBase {
        private _lights;
        private _onCastShadowChangeDelegate;
        /**
        * Creates a new StaticLightPicker object.
        * @param lights The lights to be used for shading.
        */
        constructor(lights);
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
        public addFragmentTempUsages(register: materials.ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeFragmentTempUsage(register: materials.ShaderRegisterElement): void;
        /**
        * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
        * until removeUsage has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addVertexTempUsages(register: materials.ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeVertexTempUsage(register: materials.ShaderRegisterElement): void;
        /**
        * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        */
        public getFreeFragmentVectorTemp(): materials.ShaderRegisterElement;
        /**
        * Retrieve a single component from a fragment temporary register that's still available.
        */
        public getFreeFragmentSingleTemp(): materials.ShaderRegisterElement;
        /**
        * Retrieve an available varying register
        */
        public getFreeVarying(): materials.ShaderRegisterElement;
        /**
        * Retrieve an available fragment constant register
        */
        public getFreeFragmentConstant(): materials.ShaderRegisterElement;
        /**
        * Retrieve an available vertex constant register
        */
        public getFreeVertexConstant(): materials.ShaderRegisterElement;
        /**
        * Retrieve an entire vertex temporary register that's still available.
        */
        public getFreeVertexVectorTemp(): materials.ShaderRegisterElement;
        /**
        * Retrieve a single component from a vertex temporary register that's still available.
        */
        public getFreeVertexSingleTemp(): materials.ShaderRegisterElement;
        /**
        * Retrieve an available vertex attribute register
        */
        public getFreeVertexAttribute(): materials.ShaderRegisterElement;
        /**
        * Retrieve an available texture register
        */
        public getFreeTextureReg(): materials.ShaderRegisterElement;
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
        public fragmentOutputRegister : materials.ShaderRegisterElement;
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
        public includeMethodVO(methodVO: materials.MethodVO): void;
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
        public requestFreeVectorReg(): materials.ShaderRegisterElement;
        /**
        * Retrieve a single vector component that's still available.
        */
        public requestFreeRegComponent(): materials.ShaderRegisterElement;
        /**
        * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addUsage(register: materials.ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeUsage(register: materials.ShaderRegisterElement): void;
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
        public methodSetup : materials.ShaderMethodSetup;
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
    class SuperShaderCompiler extends materials.ShaderCompiler {
        public _pointLightRegisters: materials.ShaderRegisterElement[];
        public _dirLightRegisters: materials.ShaderRegisterElement[];
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
    class MaterialBase extends away.library.NamedAssetBase implements away.library.IAsset, materials.IMaterial {
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
        public _pDepthPass: materials.DepthMapPass;
        public _pDistancePass: materials.DistanceMapPass;
        public _pLightPicker: materials.LightPickerBase;
        private _distanceBasedDepthRender;
        public _pDepthCompareMode: string;
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
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see LightPickerBase
        * @see StaticLightPicker
        */
        public lightPicker : materials.LightPickerBase;
        public setLightPicker(value: materials.LightPickerBase): void;
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
        * @see away.gl.ContextGLCompareMode
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
        public iActivateForDepth(stageGL: away.base.StageGL, camera: away.entities.Camera, distanceBased?: boolean): void;
        /**
        * Clears the render state for the depth pass.
        *
        * @param stageGL The StageGL used for rendering.
        *
        * @internal
        */
        public iDeactivateForDepth(stageGL: away.base.StageGL): void;
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
        public iRenderDepth(renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, camera: away.entities.Camera, viewProjection: away.geom.Matrix3D): void;
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
        public iActivatePass(index: number, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * Clears the render state for a pass. This needs to be called before activating another pass.
        * @param index The index of the pass to deactivate.
        * @param stageGL The StageGL used for rendering
        *
        * @internal
        */
        public iDeactivatePass(index: number, stageGL: away.base.StageGL): void;
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
        public iRenderPass(index: number, renderable: away.pool.RenderableBase, stageGL: away.base.StageGL, entityCollector: away.traverse.ICollector, viewProjection: away.geom.Matrix3D): void;
        /**
        * Mark an IMaterialOwner as owner of this material.
        * Assures we're not using the same material across renderables with different animations, since the
        * Programs depend on animation. This method needs to be called when a material is assigned.
        *
        * @param owner The IMaterialOwner that had this material assigned
        *
        * @internal
        */
        public iAddOwner(owner: away.base.IMaterialOwner): void;
        /**
        * Removes an IMaterialOwner as owner.
        * @param owner
        *
        * @internal
        */
        public iRemoveOwner(owner: away.base.IMaterialOwner): void;
        /**
        * A list of the IMaterialOwners that use this material
        *
        * @private
        */
        public iOwners : away.base.IMaterialOwner[];
        /**
        * Performs any processing that needs to occur before any of its passes are used.
        *
        * @private
        */
        public iUpdateMaterial(context: away.gl.ContextGL): void;
        /**
        * Deactivates the last pass of the material.
        *
        * @private
        */
        public iDeactivate(stageGL: away.base.StageGL): void;
        /**
        * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
        * @param triggerPass The pass triggering the invalidation, if any. This is passed to prevent invalidating the
        * triggering pass, which would result in an infinite loop.
        *
        * @private
        */
        public iInvalidatePasses(triggerPass: materials.MaterialPassBase): void;
        /**
        * Removes a pass from the material.
        * @param pass The pass to be removed.
        */
        public pRemovePass(pass: materials.MaterialPassBase): void;
        /**
        * Removes all passes from the material
        */
        public pClearPasses(): void;
        /**
        * Adds a pass to the material
        * @param pass
        */
        public pAddPass(pass: materials.MaterialPassBase): void;
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
    class SinglePassMaterialBase extends materials.MaterialBase {
        public _pScreenPass: materials.SuperShaderPass;
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
        public iActivateForDepth(stageGL: away.base.StageGL, camera: away.entities.Camera, distanceBased?: boolean): void;
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
        public colorTransform : away.geom.ColorTransform;
        public setColorTransform(value: away.geom.ColorTransform): void;
        /**
        * The method that provides the ambient lighting contribution. Defaults to BasicAmbientMethod.
        */
        public ambientMethod : materials.BasicAmbientMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : materials.ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to BasicDiffuseMethod.
        */
        public diffuseMethod : materials.BasicDiffuseMethod;
        /**
        * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
        */
        public normalMethod : materials.BasicNormalMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to BasicSpecularMethod.
        */
        public specularMethod : materials.BasicSpecularMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addMethod(method: materials.EffectMethodBase): void;
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
        public hasMethod(method: materials.EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): materials.EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeMethod(method: materials.EffectMethodBase): void;
        /**
        * @inheritDoc
        */
        public mipmap : boolean;
        /**
        * The normal map to modulate the direction of the surface for each texel. The default normal method expects
        * tangent-space normal maps, but others could expect object-space maps.
        */
        public normalMap : away.textures.Texture2DBase;
        /**
        * A specular map that defines the strength of specular reflections for each texel in the red channel,
        * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
        * specular and gloss maps from grayscale images, but correctly authored images are preferred.
        */
        public specularMap : away.textures.Texture2DBase;
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
        public iUpdateMaterial(context: away.gl.ContextGL): void;
        /**
        * @inheritDoc
        */
        public lightPicker : materials.LightPickerBase;
    }
}
declare module away.materials {
    /**
    * MultiPassMaterialBase forms an abstract base class for the default multi-pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
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
        public iActivateForDepth(stageGL: away.base.StageGL, camera: away.entities.Camera, distanceBased?: boolean): void;
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
        public lightPicker : materials.LightPickerBase;
        /**
        * @inheritDoc
        */
        public requiresBlending : boolean;
        /**
        * The method that provides the ambient lighting contribution. Defaults to BasicAmbientMethod.
        */
        public ambientMethod : materials.BasicAmbientMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : materials.ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to BasicDiffuseMethod.
        */
        public diffuseMethod : materials.BasicDiffuseMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to BasicSpecularMethod.
        */
        public specularMethod : materials.BasicSpecularMethod;
        /**
        * The method used to generate the per-pixel normals. Defaults to BasicNormalMethod.
        */
        public normalMethod : materials.BasicNormalMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addMethod(method: materials.EffectMethodBase): void;
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
        public hasMethod(method: materials.EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getMethodAt(index: number): materials.EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addMethodAt(method: materials.EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeMethod(method: materials.EffectMethodBase): void;
        /**
        * @inheritDoc
        */
        public mipmap : boolean;
        /**
        * The normal map to modulate the direction of the surface for each texel. The default normal method expects
        * tangent-space normal maps, but others could expect object-space maps.
        */
        public normalMap : away.textures.Texture2DBase;
        /**
        * A specular map that defines the strength of specular reflections for each texel in the red channel,
        * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
        * specular and gloss maps from grayscale images, but correctly authored images are preferred.
        */
        public specularMap : away.textures.Texture2DBase;
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
        public iUpdateMaterial(context: away.gl.ContextGL): void;
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
        public iActivatePass(index: number, stageGL: away.base.StageGL, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stageGL: away.base.StageGL): void;
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
    class TextureMultiPassMaterial extends materials.MultiPassMaterialBase {
        private _animateUVs;
        /**
        * Creates a new TextureMultiPassMaterial.
        * @param texture The texture used for the material's albedo color.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to true.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to true.
        */
        constructor(texture?: away.textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        /**
        * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
        */
        public animateUVs : boolean;
        /**
        * The texture object to use for the albedo colour.
        */
        public texture : away.textures.Texture2DBase;
        /**
        * The texture object to use for the ambient colour.
        */
        public ambientTexture : away.textures.Texture2DBase;
        public pUpdateScreenPasses(): void;
    }
}
declare module away.materials {
    /**
    * ColorMultiPassMaterial is a multi-pass material that uses a flat color as the surface's diffuse reflection value.
    */
    class ColorMultiPassMaterial extends materials.MultiPassMaterialBase {
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
    class TextureMaterial extends materials.SinglePassMaterialBase {
        /**
        * Creates a new TextureMaterial.
        * @param texture The texture used for the material's albedo color.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to true.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to true.
        */
        constructor(texture?: away.textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
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
        public texture : away.textures.Texture2DBase;
        /**
        * The texture object to use for the ambient colour.
        */
        public ambientTexture : away.textures.Texture2DBase;
    }
}
declare module away.materials {
    /**
    * ColorMaterial is a single-pass material that uses a flat color as the surface's diffuse reflection value.
    */
    class ColorMaterial extends materials.SinglePassMaterialBase {
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
    class LightingShaderCompiler extends materials.ShaderCompiler {
        public _pointLightFragmentConstants: materials.ShaderRegisterElement[];
        public _pointLightVertexConstants: materials.ShaderRegisterElement[];
        public _dirLightFragmentConstants: materials.ShaderRegisterElement[];
        public _dirLightVertexConstants: materials.ShaderRegisterElement[];
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
    class SegmentMaterial extends materials.MaterialBase {
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
    class SkyboxMaterial extends materials.MaterialBase {
        private _cubeMap;
        private _skyboxPass;
        /**
        * Creates a new SkyboxMaterial object.
        * @param cubeMap The CubeMap to use as the skybox.
        */
        constructor(cubeMap: away.textures.CubeTextureBase);
        /**
        * The cube texture to use as the skybox.
        */
        public cubeMap : away.textures.CubeTextureBase;
    }
}
declare module away.primitives {
    /**
    * PrimitiveBase is an abstract base class for mesh primitives, which are prebuilt simple meshes.
    */
    class PrimitiveBase extends away.base.Geometry {
        private _geomDirty;
        private _uvDirty;
        private _subGeometry;
        /**
        * Creates a new PrimitiveBase object.
        * @param material The material with which to render the object
        */
        constructor();
        /**
        * @inheritDoc
        */
        public subGeometries : away.base.ISubGeometry[];
        /**
        * @inheritDoc
        */
        public clone(): away.base.Geometry;
        /**
        * @inheritDoc
        */
        public scale(scale: number): void;
        /**
        * @inheritDoc
        */
        public scaleUV(scaleU?: number, scaleV?: number): void;
        /**
        * @inheritDoc
        */
        public applyTransformation(transform: away.geom.Matrix3D): void;
        /**
        * Builds the primitive's geometry when invalid. This method should not be called directly. The calling should
        * be triggered by the invalidateGeometry method (and in turn by updateGeometry).
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * Builds the primitive's uv coordinates when invalid. This method should not be called directly. The calling
        * should be triggered by the invalidateUVs method (and in turn by updateUVs).
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        /**
        * Invalidates the primitive's geometry, causing it to be updated when requested.
        */
        public pInvalidateGeometry(): void;
        /**
        * Invalidates the primitive's uv coordinates, causing them to be updated when requested.
        */
        public pInvalidateUVs(): void;
        /**
        * Updates the geometry when invalid.
        */
        private updateGeometry();
        /**
        * Updates the uv coordinates when invalid.
        */
        private updateUVs();
        public iValidate(): void;
    }
}
declare module away.primitives {
    class LineSegment extends away.base.Segment {
        public TYPE: string;
        constructor(v0: away.geom.Vector3D, v1: away.geom.Vector3D, color0?: number, color1?: number, thickness?: number);
    }
}
declare module away.primitives {
    /**
    * A UV Cylinder primitive mesh.
    */
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
        /**
        * @inheritDoc
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * @inheritDoc
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        /**
        * The radius of the torus.
        */
        public radius : number;
        /**
        * The radius of the inner tube of the torus.
        */
        public tubeRadius : number;
        /**
        * Defines the number of horizontal segments that make up the torus. Defaults to 16.
        */
        public segmentsR : number;
        /**
        * Defines the number of vertical segments that make up the torus. Defaults to 8.
        */
        public segmentsT : number;
        /**
        * Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
        /**
        * Creates a new <code>Torus</code> object.
        * @param radius The radius of the torus.
        * @param tuebRadius The radius of the inner tube of the torus.
        * @param segmentsR Defines the number of horizontal segments that make up the torus.
        * @param segmentsT Defines the number of vertical segments that make up the torus.
        * @param yUp Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, tubeRadius?: number, segmentsR?: number, segmentsT?: number, yUp?: boolean);
    }
}
declare module away.primitives {
    /**
    * A Cube primitive mesh.
    */
    class CubeGeometry extends primitives.PrimitiveBase {
        private _width;
        private _height;
        private _depth;
        private _tile6;
        private _segmentsW;
        private _segmentsH;
        private _segmentsD;
        /**
        * Creates a new Cube object.
        * @param width The size of the cube along its X-axis.
        * @param height The size of the cube along its Y-axis.
        * @param depth The size of the cube along its Z-axis.
        * @param segmentsW The number of segments that make up the cube along the X-axis.
        * @param segmentsH The number of segments that make up the cube along the Y-axis.
        * @param segmentsD The number of segments that make up the cube along the Z-axis.
        * @param tile6 The type of uv mapping to use. When true, a texture will be subdivided in a 2x3 grid, each used for a single face. When false, the entire image is mapped on each face.
        */
        constructor(width?: number, height?: number, depth?: number, segmentsW?: number, segmentsH?: number, segmentsD?: number, tile6?: boolean);
        /**
        * The size of the cube along its X-axis.
        */
        public width : number;
        /**
        * The size of the cube along its Y-axis.
        */
        public height : number;
        /**
        * The size of the cube along its Z-axis.
        */
        public depth : number;
        /**
        * The type of uv mapping to use. When false, the entire image is mapped on each face.
        * When true, a texture will be subdivided in a 3x2 grid, each used for a single face.
        * Reading the tiles from left to right, top to bottom they represent the faces of the
        * cube in the following order: bottom, top, back, left, front, right. This creates
        * several shared edges (between the top, front, left and right faces) which simplifies
        * texture painting.
        */
        public tile6 : boolean;
        /**
        * The number of segments that make up the cube along the X-axis. Defaults to 1.
        */
        public segmentsW : number;
        /**
        * The number of segments that make up the cube along the Y-axis. Defaults to 1.
        */
        public segmentsH : number;
        /**
        * The number of segments that make up the cube along the Z-axis. Defaults to 1.
        */
        public segmentsD : number;
        /**
        * @inheritDoc
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * @inheritDoc
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
    }
}
declare module away.primitives {
    /**
    * A Plane primitive mesh.
    */
    class PlaneGeometry extends primitives.PrimitiveBase {
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        private _width;
        private _height;
        private _doubleSided;
        /**
        * Creates a new Plane object.
        * @param width The width of the plane.
        * @param height The height of the plane.
        * @param segmentsW The number of segments that make up the plane along the X-axis.
        * @param segmentsH The number of segments that make up the plane along the Y or Z-axis.
        * @param yUp Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false).
        * @param doubleSided Defines whether the plane will be visible from both sides, with correct vertex normals.
        */
        constructor(width?: number, height?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean, doubleSided?: boolean);
        /**
        * The number of segments that make up the plane along the X-axis. Defaults to 1.
        */
        public segmentsW : number;
        /**
        * The number of segments that make up the plane along the Y or Z-axis, depending on whether yUp is true or
        * false, respectively. Defaults to 1.
        */
        public segmentsH : number;
        /**
        *  Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false). Defaults to true.
        */
        public yUp : boolean;
        /**
        * Defines whether the plane will be visible from both sides, with correct vertex normals (as opposed to bothSides on Material). Defaults to false.
        */
        public doubleSided : boolean;
        /**
        * The width of the plane.
        */
        public width : number;
        /**
        * The height of the plane.
        */
        public height : number;
        /**
        * @inheritDoc
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * @inheritDoc
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
    }
}
declare module away.primitives {
    /**
    * A Capsule primitive mesh.
    */
    class CapsuleGeometry extends primitives.PrimitiveBase {
        private _radius;
        private _height;
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        /**
        * Creates a new Capsule object.
        * @param radius The radius of the capsule.
        * @param height The height of the capsule.
        * @param segmentsW Defines the number of horizontal segments that make up the capsule. Defaults to 16.
        * @param segmentsH Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven value.
        * @param yUp Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, height?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean);
        /**
        * @inheritDoc
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * @inheritDoc
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        /**
        * The radius of the capsule.
        */
        public radius : number;
        /**
        * The height of the capsule.
        */
        public height : number;
        /**
        * Defines the number of horizontal segments that make up the capsule. Defaults to 16.
        */
        public segmentsW : number;
        /**
        * Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven.
        */
        public segmentsH : number;
        /**
        * Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
    }
}
declare module away.primitives {
    /**
    * A Cylinder primitive mesh.
    */
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
        /**
        * @inheritDoc
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * @inheritDoc
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        /**
        * The radius of the top end of the cylinder.
        */
        public topRadius : number;
        /**
        * The radius of the bottom end of the cylinder.
        */
        public bottomRadius : number;
        /**
        * The radius of the top end of the cylinder.
        */
        public height : number;
        /**
        * Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
        */
        public segmentsW : number;
        public setSegmentsW(value: number): void;
        /**
        * Defines the number of vertical segments that make up the cylinder. Defaults to 1.
        */
        public segmentsH : number;
        public setSegmentsH(value: number): void;
        /**
        * Defines whether the top end of the cylinder is closed (true) or open.
        */
        public topClosed : boolean;
        /**
        * Defines whether the bottom end of the cylinder is closed (true) or open.
        */
        public bottomClosed : boolean;
        /**
        * Defines whether the cylinder poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        public yUp : boolean;
        /**
        * Creates a new Cylinder object.
        * @param topRadius The radius of the top end of the cylinder.
        * @param bottomRadius The radius of the bottom end of the cylinder
        * @param height The radius of the bottom end of the cylinder
        * @param segmentsW Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
        * @param segmentsH Defines the number of vertical segments that make up the cylinder. Defaults to 1.
        * @param topClosed Defines whether the top end of the cylinder is closed (true) or open.
        * @param bottomClosed Defines whether the bottom end of the cylinder is closed (true) or open.
        * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(topRadius?: number, bottomRadius?: number, height?: number, segmentsW?: number, segmentsH?: number, topClosed?: boolean, bottomClosed?: boolean, surfaceClosed?: boolean, yUp?: boolean);
    }
}
declare module away.primitives {
    /**
    * A UV Cone primitive mesh.
    */
    class ConeGeometry extends primitives.CylinderGeometry {
        /**
        * The radius of the bottom end of the cone.
        */
        public radius : number;
        /**
        * Creates a new Cone object.
        * @param radius The radius of the bottom end of the cone
        * @param height The height of the cone
        * @param segmentsW Defines the number of horizontal segments that make up the cone. Defaults to 16.
        * @param segmentsH Defines the number of vertical segments that make up the cone. Defaults to 1.
        * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, height?: number, segmentsW?: number, segmentsH?: number, closed?: boolean, yUp?: boolean);
    }
}
declare module away.primitives {
    /**
    * A UV RegularPolygon primitive mesh.
    */
    class RegularPolygonGeometry extends primitives.CylinderGeometry {
        /**
        * The radius of the regular polygon.
        */
        public radius : number;
        /**
        * The number of sides of the regular polygon.
        */
        public sides : number;
        /**
        * The number of subdivisions from the edge to the center of the regular polygon.
        */
        public subdivisions : number;
        /**
        * Creates a new RegularPolygon disc object.
        * @param radius The radius of the regular polygon
        * @param sides Defines the number of sides of the regular polygon.
        * @param yUp Defines whether the regular polygon should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, sides?: number, yUp?: boolean);
    }
}
declare module away.primitives {
    /**
    * A UV Sphere primitive mesh.
    */
    class SphereGeometry extends primitives.PrimitiveBase {
        private _radius;
        private _segmentsW;
        private _segmentsH;
        private _yUp;
        /**
        * Creates a new Sphere object.
        * @param radius The radius of the sphere.
        * @param segmentsW Defines the number of horizontal segments that make up the sphere.
        * @param segmentsH Defines the number of vertical segments that make up the sphere.
        * @param yUp Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
        constructor(radius?: number, segmentsW?: number, segmentsH?: number, yUp?: boolean);
        /**
        * @inheritDoc
        */
        public pBuildGeometry(target: away.base.CompactSubGeometry): void;
        /**
        * @inheritDoc
        */
        public pBuildUVs(target: away.base.CompactSubGeometry): void;
        /**
        * The radius of the sphere.
        */
        public radius : number;
        /**
        * Defines the number of horizontal segments that make up the sphere. Defaults to 16.
        */
        public segmentsW : number;
        /**
        * Defines the number of vertical segments that make up the sphere. Defaults to 12.
        */
        public segmentsH : number;
        /**
        * Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
        */
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
        public pBuildGeometry(): void;
        public pInvalidateGeometry(): void;
        private updateGeometry();
        public pUpdateBounds(): void;
        public pUpdateOrAddSegment(index: number, v0: away.geom.Vector3D, v1: away.geom.Vector3D): void;
    }
}
declare module away.primitives {
    /**
    * A WireframeSphere primitive mesh
    */
    class WireframeSphere extends primitives.WireframePrimitiveBase {
        private _segmentsW;
        private _segmentsH;
        private _radius;
        /**
        * Creates a new WireframeSphere object.
        * @param radius The radius of the sphere.
        * @param segmentsW Defines the number of horizontal segments that make up the sphere.
        * @param segmentsH Defines the number of vertical segments that make up the sphere.
        * @param color The colour of the wireframe lines
        * @param thickness The thickness of the wireframe lines
        */
        constructor(radius?: number, segmentsW?: number, segmentsH?: number, color?: number, thickness?: number);
        /**
        * @inheritDoc
        */
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    /**
    * A WirefameCube primitive mesh.
    */
    class WireframeCube extends primitives.WireframePrimitiveBase {
        /**
        * Creates a new WireframeCube object.
        * @param width The size of the cube along its X-axis.
        * @param height The size of the cube along its Y-axis.
        * @param depth The size of the cube along its Z-axis.
        * @param color The colour of the wireframe lines
        * @param thickness The thickness of the wireframe lines
        */
        constructor(width?: number, height?: number, depth?: number, color?: number, thickness?: number);
        /**
        * @inheritDoc
        */
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    /**
    * Generates a wireframd cylinder primitive.
    */
    class WireframeCylinder extends primitives.WireframePrimitiveBase {
        private static TWO_PI;
        private _topRadius;
        private _bottomRadius;
        private _segmentsW;
        private _segmentsH;
        /**
        * Creates a new WireframeCylinder instance
        * @param topRadius Top radius of the cylinder
        * @param bottomRadius Bottom radius of the cylinder
        * @param height The height of the cylinder
        * @param segmentsW Number of radial segments
        * @param segmentsH Number of vertical segments
        * @param color The color of the wireframe lines
        * @param thickness The thickness of the wireframe lines
        */
        constructor(topRadius?: number, bottomRadius?: number, height?: number, segmentsW?: number, segmentsH?: number, color?: number, thickness?: number);
        public pBuildGeometry(): void;
        /**
        * Top radius of the cylinder
        */
        public topRadius : number;
        /**
        * Bottom radius of the cylinder
        */
        public bottomRadius : number;
    }
}
declare module away.primitives {
    /**
    * A WireframePlane primitive mesh.
    */
    class WireframePlane extends primitives.WireframePrimitiveBase {
        static ORIENTATION_YZ: string;
        static ORIENTATION_XY: string;
        static ORIENTATION_XZ: string;
        private _segmentsW;
        private _segmentsH;
        private _orientation;
        /**
        * Creates a new WireframePlane object.
        * @param width The size of the cube along its X-axis.
        * @param height The size of the cube along its Y-axis.
        * @param segmentsW The number of segments that make up the cube along the X-axis.
        * @param segmentsH The number of segments that make up the cube along the Y-axis.
        * @param color The colour of the wireframe lines
        * @param thickness The thickness of the wireframe lines
        * @param orientation The orientaion in which the plane lies.
        */
        constructor(width: number, height: number, segmentsW?: number, segmentsH?: number, color?: number, thickness?: number, orientation?: string);
        /**
        * The orientaion in which the plane lies.
        */
        public orientation : string;
        /**
        * The number of segments that make up the plane along the X-axis.
        */
        public segmentsW : number;
        /**
        * The number of segments that make up the plane along the Y-axis.
        */
        public segmentsH : number;
        /**
        * @inheritDoc
        */
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    /**
    * A WireframeRegularPolygon primitive mesh.
    */
    class WireframeRegularPolygon extends primitives.WireframePrimitiveBase {
        static ORIENTATION_YZ: string;
        static ORIENTATION_XY: string;
        static ORIENTATION_XZ: string;
        private _radius;
        private _sides;
        private _orientation;
        /**
        * Creates a new WireframeRegularPolygon object.
        * @param radius The radius of the polygon.
        * @param sides The number of sides on the polygon.
        * @param color The colour of the wireframe lines
        * @param thickness The thickness of the wireframe lines
        * @param orientation The orientaion in which the plane lies.
        */
        constructor(radius: number, sides: number, color?: number, thickness?: number, orientation?: string);
        /**
        * The orientaion in which the polygon lies.
        */
        public orientation : string;
        /**
        * The radius of the regular polygon.
        */
        public radius : number;
        /**
        * The number of sides to the regular polygon.
        */
        public sides : number;
        /**
        * @inheritDoc
        */
        public pBuildGeometry(): void;
    }
}
declare module away.primitives {
    /**
    * A WireframeTetrahedron primitive mesh
    */
    class WireframeTetrahedron extends primitives.WireframePrimitiveBase {
        static ORIENTATION_YZ: string;
        static ORIENTATION_XY: string;
        static ORIENTATION_XZ: string;
        private _orientation;
        /**
        * Creates a new WireframeTetrahedron object.
        * @param width The size of the tetrahedron buttom size.
        * @param height The size of the tetranhedron height.
        * @param color The color of the wireframe lines.
        * @param thickness The thickness of the wireframe lines.
        */
        constructor(width: number, height: number, color?: number, thickness?: number, orientation?: string);
        /**
        * The orientation in which the plane lies
        */
        public orientation : string;
        /**
        * @inheritDoc
        */
        public pBuildGeometry(): void;
    }
}
declare module away.utils {
    class GeometryUtils {
        /**
        * Build a list of sub-geometries from raw data vectors, splitting them up in
        * such a way that they won't exceed buffer length limits.
        */
        static fromVectors(verts: number[], indices: number[], uvs: number[], normals: number[], tangents: number[], weights: number[], jointIndices: number[], triangleOffset?: number): away.base.ISubGeometry[];
        /**
        * Build a sub-geometry from data vectors.
        */
        static constructSubGeometry(verts: number[], indices: number[], uvs: number[], normals: number[], tangents: number[], weights: number[], jointIndices: number[], triangleOffset: number): away.base.CompactSubGeometry;
        static interleaveBuffers(numVertices: number, vertices?: number[], normals?: number[], tangents?: number[], uvs?: number[], suvs?: number[]): number[];
        static getMeshSubGeometryIndex(subGeometry: away.base.ISubGeometry): number;
        static getMeshSubMeshIndex(subMesh: away.base.SubMesh): number;
    }
}
declare module away.utils {
    class PerspectiveMatrix3D extends away.geom.Matrix3D {
        constructor(v?: number[]);
        public perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
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
    import ContextGL = away.gl.ContextGL;
    import VertexBuffer = away.gl.VertexBuffer;
    /**
    * ...
    */
    class AnimationSubGeometry {
        static SUBGEOM_ID_COUNT: number;
        public _pVertexData: number[];
        public _pVertexBuffer: VertexBuffer[];
        public _pBufferContext: ContextGL[];
        public _pBufferDirty: boolean[];
        private _numVertices;
        private _totalLenOfOneVertex;
        public numProcessedVertices: number;
        public previousTime: number;
        public animationParticles: animators.ParticleAnimationData[];
        /**
        * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
        *
        * @private
        */
        public _iUniqueId: number;
        constructor();
        public createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
        public activateVertexBuffer(index: number, bufferOffset: number, stageGL: away.base.StageGL, format: string): void;
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
        public orientation: away.geom.Quaternion;
        /**
        * The translation of the pose
        */
        public translation: away.geom.Vector3D;
        constructor();
        /**
        * Converts the transformation to a Matrix3D representation.
        *
        * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
        * @return The transformation matrix of the pose.
        */
        public toMatrix3D(target?: away.geom.Matrix3D): away.geom.Matrix3D;
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
    class Skeleton extends away.library.NamedAssetBase implements away.library.IAsset {
        /**
        * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
        * property that is an index into this list.
        * A child joint should always have a higher index than its parent.
        */
        public joints: animators.SkeletonJoint[];
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
        public jointFromName(jointName: string): animators.SkeletonJoint;
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
    class SkeletonPose extends away.library.NamedAssetBase implements away.library.IAsset {
        /**
        * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
        *
        * @see away.animators.Skeleton#joints
        */
        public jointPoses: animators.JointPose[];
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
        public jointPoseFromName(jointName: string): animators.JointPose;
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
    * Provides an abstract base class for nodes in an animation blend tree.
    */
    class AnimationNodeBase extends away.library.NamedAssetBase implements away.library.IAsset {
        public _pStateClass: any;
        public stateClass : any;
        /**
        * Creates a new <code>AnimationNodeBase</code> object.
        */
        constructor();
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
    * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
    */
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
        public totalDelta : away.geom.Vector3D;
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
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * Returns the AGAL code of the particle animation node for use in the fragment shader.
        */
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
        */
        public getAGALUVCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
        *
        * @see away.animators.ParticleAnimationSet#initParticleFunc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
        /**
        * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
    */
    class ParticleAccelerationNode extends animators.ParticleNodeBase {
        /** @private */
        static ACCELERATION_INDEX: number;
        /** @private */
        public _acceleration: away.geom.Vector3D;
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
        constructor(mode: number, acceleration?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public pGetAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleAccelerationState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the position of a particle over time along a bezier curve.
    */
    class ParticleBezierCurveNode extends animators.ParticleNodeBase {
        /** @private */
        static BEZIER_CONTROL_INDEX: number;
        /** @private */
        static BEZIER_END_INDEX: number;
        /** @private */
        public _iControlPoint: away.geom.Vector3D;
        /** @private */
        public _iEndPoint: away.geom.Vector3D;
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
        constructor(mode: number, controlPoint?: away.geom.Vector3D, endPoint?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleBezierCurveState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node that controls the rotation of a particle to always face the camera.
    */
    class ParticleBillboardNode extends animators.ParticleNodeBase {
        /** @private */
        static MATRIX_INDEX: number;
        /** @private */
        public _iBillboardAxis: away.geom.Vector3D;
        /**
        * Creates a new <code>ParticleBillboardNode</code>
        */
        constructor(billboardAxis?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleBillboardState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the color variation of a particle over time.
    */
    class ParticleColorNode extends animators.ParticleNodeBase {
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
        public _iStartColor: away.geom.ColorTransform;
        /** @private */
        public _iEndColor: away.geom.ColorTransform;
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
        constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, usesCycle?: boolean, usesPhase?: boolean, startColor?: away.geom.ColorTransform, endColor?: away.geom.ColorTransform, cycleDuration?: number, cyclePhase?: number);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleColorState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to create a follow behaviour on a particle system.
    */
    class ParticleFollowNode extends animators.ParticleNodeBase {
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
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleFollowState;
    }
}
declare module away.animators {
    class ParticleInitialColorNode extends animators.ParticleNodeBase {
        /** @private */
        static MULTIPLIER_INDEX: number;
        /** @private */
        static OFFSET_INDEX: number;
        /** @private */
        public _iUsesMultiplier: boolean;
        /** @private */
        public _iUsesOffset: boolean;
        /** @private */
        public _iInitialColor: away.geom.ColorTransform;
        /**
        * Reference for color node properties on a single particle (when in local property mode).
        * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
        */
        static COLOR_INITIAL_COLORTRANSFORM: string;
        constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, initialColor?: away.geom.ColorTransform);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the position of a particle over time around a circular orbit.
    */
    class ParticleOrbitNode extends animators.ParticleNodeBase {
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
        public _iEulers: away.geom.Vector3D;
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
        constructor(mode: number, usesEulers?: boolean, usesCycle?: boolean, usesPhase?: boolean, radius?: number, cycleDuration?: number, cyclePhase?: number, eulers?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleOrbitState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the position of a particle over time using simple harmonic motion.
    */
    class ParticleOscillatorNode extends animators.ParticleNodeBase {
        /** @private */
        static OSCILLATOR_INDEX: number;
        /** @private */
        public _iOscillator: away.geom.Vector3D;
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
        constructor(mode: number, oscillator?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleOscillatorState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to set the starting position of a particle.
    */
    class ParticlePositionNode extends animators.ParticleNodeBase {
        /** @private */
        static POSITION_INDEX: number;
        /** @private */
        public _iPosition: away.geom.Vector3D;
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
        constructor(mode: number, position?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticlePositionState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the rotation of a particle to match its heading vector.
    */
    class ParticleRotateToHeadingNode extends animators.ParticleNodeBase {
        /** @private */
        static MATRIX_INDEX: number;
        /**
        * Creates a new <code>ParticleBillboardNode</code>
        */
        constructor();
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleRotateToHeadingState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the rotation of a particle to face to a position
    */
    class ParticleRotateToPositionNode extends animators.ParticleNodeBase {
        /** @private */
        static MATRIX_INDEX: number;
        /** @private */
        static POSITION_INDEX: number;
        /** @private */
        public _iPosition: away.geom.Vector3D;
        /**
        * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
        * Expects a <code>Vector3D</code> object representing the position that the particle must face.
        */
        static POSITION_VECTOR3D: string;
        /**
        * Creates a new <code>ParticleRotateToPositionNode</code>
        */
        constructor(mode: number, position?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleRotateToPositionState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to set the starting rotational velocity of a particle.
    */
    class ParticleRotationalVelocityNode extends animators.ParticleNodeBase {
        /** @private */
        static ROTATIONALVELOCITY_INDEX: number;
        /** @private */
        public _iRotationalVelocity: away.geom.Vector3D;
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
        constructor(mode: number, rotationalVelocity?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleRotationalVelocityState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the scale variation of a particle over time.
    */
    class ParticleScaleNode extends animators.ParticleNodeBase {
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
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleScaleState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    class ParticleSegmentedColorNode extends animators.ParticleNodeBase {
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
        public _iStartColor: away.geom.ColorTransform;
        /** @private */
        public _iEndColor: away.geom.ColorTransform;
        /** @private */
        public _iNumSegmentPoint: number;
        /** @private */
        public _iSegmentPoints: animators.ColorSegmentPoint[];
        constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: away.geom.ColorTransform, endColor: away.geom.ColorTransform, segmentPoints: animators.ColorSegmentPoint[]);
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
    }
}
declare module away.animators {
    /**
    * A particle animation node used when a spritesheet texture is required to animate the particle.
    * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
    */
    class ParticleSpriteSheetNode extends animators.ParticleNodeBase {
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
        public getAGALUVCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleSpriteSheetState;
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
    */
    class ParticleTimeNode extends animators.ParticleNodeBase {
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
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleTimeState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to control the UV offset and scale of a particle over time.
    */
    class ParticleUVNode extends animators.ParticleNodeBase {
        /** @private */
        static UV_INDEX: number;
        /** @private */
        public _iUvData: away.geom.Vector3D;
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
        public getAGALUVCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleUVState;
        private updateUVData();
        /**
        * @inheritDoc
        */
        public _iProcessAnimationSetting(particleAnimationSet: animators.ParticleAnimationSet): void;
    }
}
declare module away.animators {
    /**
    * A particle animation node used to set the starting velocity of a particle.
    */
    class ParticleVelocityNode extends animators.ParticleNodeBase {
        /** @private */
        static VELOCITY_INDEX: number;
        /** @private */
        public _iVelocity: away.geom.Vector3D;
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
        constructor(mode: number, velocity?: away.geom.Vector3D);
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, animationRegisterCache: animators.AnimationRegisterCache): string;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.ParticleVelocityState;
        /**
        * @inheritDoc
        */
        public _iGeneratePropertyOfOneParticle(param: animators.ParticleProperties): void;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
    */
    class SkeletonBinaryLERPNode extends animators.AnimationNodeBase {
        /**
        * Defines input node A to use for the blended output.
        */
        public inputA: animators.AnimationNodeBase;
        /**
        * Defines input node B to use for the blended output.
        */
        public inputB: animators.AnimationNodeBase;
        /**
        * Creates a new <code>SkeletonBinaryLERPNode</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.SkeletonBinaryLERPState;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node containing time-based animation data as individual skeleton poses.
    */
    class SkeletonClipNode extends animators.AnimationClipNodeBase {
        private _frames;
        /**
        * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
        * of the output skeleton pose. Defaults to false.
        */
        public highQuality: boolean;
        /**
        * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
        */
        public frames : animators.SkeletonPose[];
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
        public addFrame(skeletonPose: animators.SkeletonPose, duration: number): void;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.SkeletonClipState;
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
    class SkeletonDifferenceNode extends animators.AnimationNodeBase {
        /**
        * Defines a base input node to use for the blended output.
        */
        public baseInput: animators.AnimationNodeBase;
        /**
        * Defines a difference input node to use for the blended output.
        */
        public differenceInput: animators.AnimationNodeBase;
        /**
        * Creates a new <code>SkeletonAdditiveNode</code> object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.SkeletonDifferenceState;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
    */
    class SkeletonDirectionalNode extends animators.AnimationNodeBase {
        /**
        * Defines the forward configured input node to use for the blended output.
        */
        public forward: animators.AnimationNodeBase;
        /**
        * Defines the backwards configured input node to use for the blended output.
        */
        public backward: animators.AnimationNodeBase;
        /**
        * Defines the left configured input node to use for the blended output.
        */
        public left: animators.AnimationNodeBase;
        /**
        * Defines the right configured input node to use for the blended output.
        */
        public right: animators.AnimationNodeBase;
        constructor();
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.SkeletonDirectionalState;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
    */
    class SkeletonNaryLERPNode extends animators.AnimationNodeBase {
        public _iInputs: animators.AnimationNodeBase[];
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
        public getInputIndex(input: animators.AnimationNodeBase): number;
        /**
        * Returns the skeleton animation node object that resides at the given input index.
        *
        * @param index The input index for which the skeleton animation node is requested.
        */
        public getInputAt(index: number): animators.AnimationNodeBase;
        /**
        * Adds a new skeleton animation node input to the animation node.
        */
        public addInput(input: animators.AnimationNodeBase): void;
        /**
        * @inheritDoc
        */
        public getAnimationState(animator: animators.AnimatorBase): animators.SkeletonNaryLERPState;
    }
}
declare module away.animators {
    /**
    * A vertex animation node containing time-based animation data as individual geometry obejcts.
    */
    class VertexClipNode extends animators.AnimationClipNodeBase {
        private _frames;
        private _translations;
        /**
        * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
        */
        public frames : away.base.Geometry[];
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
        public addFrame(geometry: away.base.Geometry, duration: number, translation?: away.geom.Vector3D): void;
        /**
        * @inheritDoc
        */
        public _pUpdateStitch(): void;
    }
}
declare module away.animators {
    interface IAnimationState {
        positionDelta: away.geom.Vector3D;
        offset(startTime: number);
        update(time: number);
        /**
        * Sets the animation phase of the node.
        *
        * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
        */
        phase(value: number);
    }
}
declare module away.animators {
    interface ISkeletonAnimationState extends animators.IAnimationState {
        /**
        * Returns the output skeleton pose of the animation node.
        */
        getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
    }
}
declare module away.animators {
    /**
    * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
    *
    * @see away.animators.VertexAnimator
    */
    interface IVertexAnimationState extends animators.IAnimationState {
        /**
        * Returns the current geometry frame of animation in the clip based on the internal playhead position.
        */
        currentGeometry: away.base.Geometry;
        /**
        * Returns the current geometry frame of animation in the clip based on the internal playhead position.
        */
        nextGeometry: away.base.Geometry;
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
    class AnimationStateBase implements animators.IAnimationState {
        public _pAnimationNode: animators.AnimationNodeBase;
        public _pRootDelta: away.geom.Vector3D;
        public _pPositionDeltaDirty: boolean;
        public _pTime: number;
        public _pStartTime: number;
        public _pAnimator: animators.AnimatorBase;
        /**
        * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
        */
        public positionDelta : away.geom.Vector3D;
        constructor(animator: animators.AnimatorBase, animationNode: animators.AnimationNodeBase);
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
    class ParticleStateBase extends animators.AnimationStateBase {
        private _particleNode;
        public _pDynamicProperties: away.geom.Vector3D[];
        public _pDynamicPropertiesDirty: Object;
        public _pNeedUpdateTime: boolean;
        constructor(animator: animators.ParticleAnimator, particleNode: animators.ParticleNodeBase, needUpdateTime?: boolean);
        public needUpdateTime : boolean;
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        public _pUpdateDynamicProperties(animationSubGeometry: animators.AnimationSubGeometry): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleAccelerationState extends animators.ParticleStateBase {
        private _particleAccelerationNode;
        private _acceleration;
        private _halfAcceleration;
        /**
        * Defines the acceleration vector of the state, used when in global mode.
        */
        public acceleration : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleAccelerationNode: animators.ParticleAccelerationNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateAccelerationData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleBezierCurveState extends animators.ParticleStateBase {
        private _particleBezierCurveNode;
        private _controlPoint;
        private _endPoint;
        /**
        * Defines the default control point of the node, used when in global mode.
        */
        public controlPoint : away.geom.Vector3D;
        /**
        * Defines the default end point of the node, used when in global mode.
        */
        public endPoint : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleBezierCurveNode: animators.ParticleBezierCurveNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleBillboardState extends animators.ParticleStateBase {
        private _matrix;
        private _billboardAxis;
        /**
        *
        */
        constructor(animator: animators.ParticleAnimator, particleNode: animators.ParticleBillboardNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        /**
        * Defines the billboard axis.
        */
        public billboardAxis : away.geom.Vector3D;
    }
}
declare module away.animators {
    /**
    * ...
    * @author ...
    */
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
        /**
        * Defines the start color transform of the state, when in global mode.
        */
        public startColor : away.geom.ColorTransform;
        /**
        * Defines the end color transform of the state, when in global mode.
        */
        public endColor : away.geom.ColorTransform;
        /**
        * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
        */
        public cycleDuration : number;
        /**
        * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
        */
        public cyclePhase : number;
        constructor(animator: animators.ParticleAnimator, particleColorNode: animators.ParticleColorNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateColorData();
    }
}
declare module away.animators {
    /**
    * ...
    */
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
        public followTarget : away.base.DisplayObject;
        public smooth : boolean;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
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
        /**
        * Defines the initial color transform of the state, when in global mode.
        */
        public initialColor : away.geom.ColorTransform;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateColorData();
    }
}
declare module away.animators {
    /**
    * ...
    */
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
        public eulers : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleOrbitNode: animators.ParticleOrbitNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateOrbitData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleOscillatorState extends animators.ParticleStateBase {
        private _particleOscillatorNode;
        private _oscillator;
        private _oscillatorData;
        /**
        * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
        */
        public oscillator : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleOscillatorNode: animators.ParticleOscillatorNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateOscillatorData();
    }
}
declare module away.animators {
    /**
    * ...
    * @author ...
    */
    class ParticlePositionState extends animators.ParticleStateBase {
        private _particlePositionNode;
        private _position;
        /**
        * Defines the position of the particle when in global mode. Defaults to 0,0,0.
        */
        public position : away.geom.Vector3D;
        /**
        *
        */
        public getPositions(): away.geom.Vector3D[];
        public setPositions(value: away.geom.Vector3D[]): void;
        constructor(animator: animators.ParticleAnimator, particlePositionNode: animators.ParticlePositionNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleRotateToHeadingState extends animators.ParticleStateBase {
        private _matrix;
        constructor(animator: animators.ParticleAnimator, particleNode: animators.ParticleNodeBase);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleRotateToPositionState extends animators.ParticleStateBase {
        private _particleRotateToPositionNode;
        private _position;
        private _matrix;
        private _offset;
        /**
        * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
        */
        public position : away.geom.Vector3D;
        constructor(animator: animators.ParticleAnimator, particleRotateToPositionNode: animators.ParticleRotateToPositionNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleRotationalVelocityState extends animators.ParticleStateBase {
        private _particleRotationalVelocityNode;
        private _rotationalVelocityData;
        private _rotationalVelocity;
        /**
        * Defines the default rotationalVelocity of the state, used when in global mode.
        */
        public rotationalVelocity : away.geom.Vector3D;
        /**
        *
        */
        public getRotationalVelocities(): away.geom.Vector3D[];
        public setRotationalVelocities(value: away.geom.Vector3D[]): void;
        constructor(animator: animators.ParticleAnimator, particleRotationNode: animators.ParticleRotationalVelocityNode);
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateRotationalVelocityData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleScaleState extends animators.ParticleStateBase {
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
        constructor(animator: animators.ParticleAnimator, particleScaleNode: animators.ParticleScaleNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
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
        /**
        * Defines the start color transform of the state, when in global mode.
        */
        public startColor : away.geom.ColorTransform;
        /**
        * Defines the end color transform of the state, when in global mode.
        */
        public endColor : away.geom.ColorTransform;
        /**
        * Defines the number of segments.
        */
        public numSegmentPoint : number;
        /**
        * Defines the key points of color
        */
        public segmentPoints : animators.ColorSegmentPoint[];
        public usesMultiplier : boolean;
        public usesOffset : boolean;
        constructor(animator: animators.ParticleAnimator, particleSegmentedColorNode: animators.ParticleSegmentedColorNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateColorData();
    }
}
declare module away.animators {
    /**
    * ...
    */
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
        /**
        * Defines the cycle phase, when in global mode. Defaults to zero.
        */
        public cyclePhase : number;
        /**
        * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
        */
        public cycleDuration : number;
        constructor(animator: animators.ParticleAnimator, particleSpriteSheetNode: animators.ParticleSpriteSheetNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
        private updateSpriteSheetData();
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleTimeState extends animators.ParticleStateBase {
        private _particleTimeNode;
        constructor(animator: animators.ParticleAnimator, particleTimeNode: animators.ParticleTimeNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleUVState extends animators.ParticleStateBase {
        private _particleUVNode;
        constructor(animator: animators.ParticleAnimator, particleUVNode: animators.ParticleUVNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class ParticleVelocityState extends animators.ParticleStateBase {
        private _particleVelocityNode;
        private _velocity;
        /**
        * Defines the default velocity vector of the state, used when in global mode.
        */
        public velocity : away.geom.Vector3D;
        /**
        *
        */
        public getVelocities(): away.geom.Vector3D[];
        public setVelocities(value: away.geom.Vector3D[]): void;
        constructor(animator: animators.ParticleAnimator, particleVelocityNode: animators.ParticleVelocityNode);
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, animationSubGeometry: animators.AnimationSubGeometry, animationRegisterCache: animators.AnimationRegisterCache, camera: away.entities.Camera): void;
    }
}
declare module away.animators {
    /**
    *
    */
    class AnimationClipState extends animators.AnimationStateBase {
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
        constructor(animator: animators.AnimatorBase, animationClipNode: animators.AnimationClipNodeBase);
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
    class SkeletonBinaryLERPState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
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
        constructor(animator: animators.AnimatorBase, skeletonAnimationNode: animators.SkeletonBinaryLERPNode);
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
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
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
    class SkeletonClipState extends animators.AnimationClipState implements animators.ISkeletonAnimationState {
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
        public currentPose : animators.SkeletonPose;
        /**
        * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
        */
        public nextPose : animators.SkeletonPose;
        constructor(animator: animators.AnimatorBase, skeletonClipNode: animators.SkeletonClipNode);
        /**
        * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
        */
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
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
    class SkeletonDifferenceState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
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
        constructor(animator: animators.AnimatorBase, skeletonAnimationNode: animators.SkeletonDifferenceNode);
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
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
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
        /**
        * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
        * used to produce the skeleton pose output.
        */
        public direction : number;
        constructor(animator: animators.AnimatorBase, skeletonAnimationNode: animators.SkeletonDirectionalNode);
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
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
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
    class SkeletonNaryLERPState extends animators.AnimationStateBase implements animators.ISkeletonAnimationState {
        private _skeletonAnimationNode;
        private _skeletonPose;
        private _skeletonPoseDirty;
        private _blendWeights;
        private _inputs;
        constructor(animator: animators.AnimatorBase, skeletonAnimationNode: animators.SkeletonNaryLERPNode);
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
        public getSkeletonPose(skeleton: animators.Skeleton): animators.SkeletonPose;
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
    class VertexClipState extends animators.AnimationClipState implements animators.IVertexAnimationState {
        private _frames;
        private _vertexClipNode;
        private _currentGeometry;
        private _nextGeometry;
        /**
        * @inheritDoc
        */
        public currentGeometry : away.base.Geometry;
        /**
        * @inheritDoc
        */
        public nextGeometry : away.base.Geometry;
        constructor(animator: animators.AnimatorBase, vertexClipNode: animators.VertexClipNode);
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
        getAnimationNode(animator: animators.AnimatorBase, startNode: animators.AnimationNodeBase, endNode: animators.AnimationNodeBase, startTime: number): animators.AnimationNodeBase;
    }
}
declare module away.animators {
    class CrossfadeTransition implements animators.IAnimationTransition {
        public blendSpeed: number;
        constructor(blendSpeed: number);
        public getAnimationNode(animator: animators.AnimatorBase, startNode: animators.AnimationNodeBase, endNode: animators.AnimationNodeBase, startBlend: number): animators.AnimationNodeBase;
    }
}
declare module away.animators {
    /**
    * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
    */
    class CrossfadeTransitionNode extends animators.SkeletonBinaryLERPNode {
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
    class CrossfadeTransitionState extends animators.SkeletonBinaryLERPState {
        private _crossfadeTransitionNode;
        private _animationStateTransitionComplete;
        constructor(animator: animators.AnimatorBase, skeletonAnimationNode: animators.CrossfadeTransitionNode);
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
    class AnimationSetBase extends away.library.NamedAssetBase implements away.library.IAsset {
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
        * the vertex registers aslready in use on shading materials allows the animation data to utilise
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
        public assetType : string;
        /**
        * Returns a vector of animation state objects that make up the contents of the animation data set.
        */
        public animations : animators.AnimationNodeBase[];
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
        public getAnimation(name: string): animators.AnimationNodeBase;
        /**
        * Adds an animation state object to the aniamtion data set under the given name.
        *
        * @param stateName The name under which the animation state object will be stored.
        * @param animationState The animation state object to be staored in the set.
        */
        public addAnimation(node: animators.AnimationNodeBase): void;
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
    class AnimatorBase extends away.library.NamedAssetBase implements away.library.IAsset, animators.IAnimator {
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
        /**
        * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
        *
        * @see away.animators.IAnimationState#positionDelta
        */
        public updatePosition: boolean;
        public getAnimationState(node: animators.AnimationNodeBase): animators.IAnimationState;
        public getAnimationStateByName(name: string): animators.IAnimationState;
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
        public animationSet : animators.IAnimationSet;
        /**
        * Returns the current active animation state.
        */
        public activeState : animators.IAnimationState;
        /**
        * Returns the current active animation node.
        */
        public activeAnimation : animators.AnimationNodeBase;
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
        constructor(animationSet: animators.IAnimationSet);
        /**
        * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
        */
        public playbackSpeed : number;
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.entities.Camera): void;
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
        public addOwner(mesh: away.entities.Mesh): void;
        /**
        * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
        *
        * @private
        */
        public removeOwner(mesh: away.entities.Mesh): void;
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
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
    }
}
declare module away.animators {
    /**
    * Provides an interface for data set classes that hold animation data for use in animator classes.
    *
    * @see away3d.animators.AnimatorBase
    */
    interface IAnimationSet {
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
        getAnimation(name: string): animators.AnimationNodeBase;
        /**
        * Indicates whether the properties of the animation data contained within the set combined with
        * the vertex registers aslready in use on shading materials allows the animation data to utilise
        * GPU calls.
        */
        usesCPU: boolean;
        /**
        * Called by the material to reset the GPU indicator before testing whether register space in the shader
        * is available for running GPU-based animation code.
        *
        * @private
        */
        resetGPUCompatibility();
        /**
        * Called by the animator to void the GPU indicator when register space in the shader
        * is no longer available for running GPU-based animation code.
        *
        * @private
        */
        cancelGPUCompatibility();
        /**
        * Generates the AGAL Vertex code for the animation, tailored to the material pass's requirements.
        *
        * @param pass The MaterialPassBase object to whose vertex code the animation's code will be prepended.
        * @sourceRegisters The animatable attribute registers of the material pass.
        * @targetRegisters The animatable target registers of the material pass.
        * @return The AGAL Vertex code that animates the vertex data.
        *
        * @private
        */
        getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * Generates the AGAL Fragment code for the animation, tailored to the material pass's requirements.
        *
        * @param pass The MaterialPassBase object to whose vertex code the animation's code will be prepended.
        * @return The AGAL Vertex code that animates the vertex data.
        *
        * @private
        */
        getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * Generates the extra AGAL Fragment code for the animation when UVs are required, tailored to the material pass's requirements.
        *
        * @param pass The MaterialPassBase object to whose vertex code the animation's code will be prepended.
        * @param UVSource String representing the UV source register.
        * @param UVTarget String representing the UV target register.
        * @return The AGAL UV code that animates the UV data.
        *
        * @private
        */
        getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * Resets any constants used in the creation of AGAL for the vertex and fragment shaders.
        *
        * @param pass The material pass currently being used to render the geometry.
        *
        * @private
        */
        doneAGALCode(pass: away.materials.MaterialPassBase);
        /**
        * Sets the GPU render state required by the animation that is independent of the rendered mesh.
        *
        * @param stageGL The proxy currently performing the rendering.
        * @param pass The material pass currently being used to render the geometry.
        *
        * @private
        */
        activate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase);
        /**
        * Clears the GPU render state that has been set by the current animation.
        *
        * @param stageGL The proxy currently performing the rendering.
        * @param pass The material pass currently being used to render the geometry.
        *
        * @private
        */
        deactivate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase);
    }
}
declare module away.animators {
    /**
    * The animation data set used by particle-based animators, containing particle animation data.
    *
    * @see away.animators.ParticleAnimator
    */
    class ParticleAnimationSet extends animators.AnimationSetBase implements animators.IAnimationSet {
        /** @private */
        public _iAnimationRegisterCache: animators.AnimationRegisterCache;
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
        * Initialiser function for static particle properties. Needs to reference a with teh following format
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
        public particleNodes : animators.ParticleNodeBase[];
        /**
        * @inheritDoc
        */
        public addAnimation(node: animators.AnimationNodeBase): void;
        /**
        * @inheritDoc
        */
        public activate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public usesCPU : boolean;
        /**
        * @inheritDoc
        */
        public cancelGPUCompatibility(): void;
        public dispose(): void;
        /** @private */
        public _iGenerateAnimationSubGeometries(mesh: away.entities.Mesh): void;
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
    class ParticleAnimator extends animators.AnimatorBase implements animators.AnimatorBase {
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
        constructor(particleAnimationSet: animators.ParticleAnimationSet);
        /**
        * @inheritDoc
        */
        public clone(): animators.AnimatorBase;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
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
        private generateAnimatorSubGeometry(subMesh);
    }
}
declare module away.animators {
    /**
    * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
    * and controlling the various available states of animation through an interative playhead that can be
    * automatically updated or manually triggered.
    */
    class SkeletonAnimator extends animators.AnimatorBase {
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
        private _onTransitionCompleteDelegate;
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
        public globalPose : animators.SkeletonPose;
        /**
        * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
        * skinned geoemtry to which skeleon animator is applied.
        */
        public skeleton : animators.Skeleton;
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
        constructor(animationSet: animators.SkeletonAnimationSet, skeleton: animators.Skeleton, forceCPU?: boolean);
        /**
        * @inheritDoc
        */
        public clone(): animators.AnimatorBase;
        /**
        * Plays an animation state registered with the given name in the animation data set.
        *
        * @param name The data set name of the animation state to be played.
        * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
        * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
        */
        public play(name: string, transition?: animators.IAnimationTransition, offset?: number): void;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.entities.Camera): void;
        /**
        * @inheritDoc
        */
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
        /**
        * Applies the calculated time delta to the active animation state node or state transition object.
        */
        public _pUpdateDeltaTime(dt: number): void;
        private updateCondensedMatrices(condensedIndexLookUp, numJoints);
        private updateGlobalProperties();
        /**
        * If the animation can't be performed on GPU, transform vertices manually
        * @param subGeom The subgeometry containing the weights and joint index data per vertex.
        * @param pass The material pass for which we need to transform the vertices
        */
        private morphGeometry(state, subGeom);
        /**
        * Converts a local hierarchical skeleton pose to a global pose
        * @param targetPose The SkeletonPose object that will contain the global pose.
        * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
        */
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
    /**
    * The animation data set used by skeleton-based animators, containing skeleton animation data.
    *
    * @see away.animators.SkeletonAnimator
    */
    class SkeletonAnimationSet extends animators.AnimationSetBase implements animators.IAnimationSet {
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
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public activate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: away.materials.MaterialPassBase): void;
    }
}
declare module away.animators {
    /**
    * The animation data set used by vertex-based animators, containing vertex animation state data.
    *
    * @see away.animators.VertexAnimator
    */
    class VertexAnimationSet extends animators.AnimationSetBase implements animators.IAnimationSet {
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
        public getAGALVertexCode(pass: away.materials.MaterialPassBase, sourceRegisters: string[], targetRegisters: string[], profile: string): string;
        /**
        * @inheritDoc
        */
        public activate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public deactivate(stageGL: away.base.StageGL, pass: away.materials.MaterialPassBase): void;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(pass: away.materials.MaterialPassBase, shadedTarget: string, profile: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(pass: away.materials.MaterialPassBase, UVSource: string, UVTarget: string): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(pass: away.materials.MaterialPassBase): void;
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
    class VertexAnimator extends animators.AnimatorBase {
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
        constructor(vertexAnimationSet: animators.VertexAnimationSet);
        /**
        * @inheritDoc
        */
        public clone(): animators.AnimatorBase;
        /**
        * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
        * @param sequenceName The name of the clip to be played.
        */
        public play(name: string, transition?: animators.IAnimationTransition, offset?: number): void;
        /**
        * @inheritDoc
        */
        public _pUpdateDeltaTime(dt: number): void;
        /**
        * @inheritDoc
        */
        public setRenderState(stageGL: away.base.StageGL, renderable: away.pool.RenderableBase, vertexConstantOffset: number, vertexStreamOffset: number, camera: away.entities.Camera): void;
        private setNullPose(stageGL, renderable, vertexConstantOffset, vertexStreamOffset);
        /**
        * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
        * Needs to be called if gpu code is potentially required.
        */
        public testGPUCompatibility(pass: away.materials.MaterialPassBase): void;
    }
}
declare module away.parsers {
    /**
    * OBJParser provides a parser for the OBJ data type.
    */
    class OBJParser extends parsers.ParserBase {
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
        public _iResolveDependency(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
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
    public basicSpecularMethod: away.materials.BasicSpecularMethod;
    public ambientColor: number;
    public alpha: number;
}
declare class LoadedMaterial {
    public materialID: string;
    public texture: away.textures.Texture2DBase;
    public cm: away.materials.MaterialBase;
    public specularMethod: away.materials.BasicSpecularMethod;
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
    class AWDParser extends parsers.ParserBase {
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
        public _iResolveDependency(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: parsers.ResourceDependency): void;
        /**
        * Resolve a dependency name
        *
        * @param resourceDependency The dependency to be resolved.
        */
        public _iResolveDependencyName(resourceDependency: parsers.ResourceDependency, asset: away.library.IAsset): string;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
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
    class Max3DSParser extends parsers.ParserBase {
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
        public _iResolveDependency(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
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
    class MD2Parser extends parsers.ParserBase {
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
        public _iResolveDependency(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: parsers.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
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
        private createDefaultSubGeometry();
    }
}
declare module away.parsers {
    /**
    * MD5AnimParser provides a parser for the md5anim data type, providing an animation sequence for the md5 format.
    *
    * todo: optimize
    */
    class MD5AnimParser extends parsers.ParserBase {
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
        constructor(additionalRotationAxis?: away.geom.Vector3D, additionalRotationRadians?: number);
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
    class MD5MeshParser extends parsers.ParserBase {
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
        constructor(additionalRotationAxis?: away.geom.Vector3D, additionalRotationRadians?: number);
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
        * @return A SkinnedSubGeometry instance containing all geometrical data for the current mesh.
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
        public applyToContainer(receiver: away.entities.Mesh, objectContainer: away.containers.DisplayObjectContainer): void;
        /**
        * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
        *
        * @param    receiver    The Mesh to receive the merged contents of the meshes.
        * @param    meshes      A series of Meshes to be merged with the reciever mesh.
        */
        public applyToMeshes(receiver: away.entities.Mesh, meshes: away.entities.Mesh[]): void;
        /**
        *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
        *
        * @param    receiver    The Mesh to receive the merged contents of both meshes.
        * @param    mesh        The Mesh to be merged with the receiver mesh
        */
        public apply(receiver: away.entities.Mesh, mesh: away.entities.Mesh): void;
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
    public indices: number[];
    public material: away.materials.MaterialBase;
}
declare module away.tools {
    /**
    * ...
    */
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
    /**
    * ...
    */
    class ParticleGeometryHelper {
        static MAX_VERTEX: number;
        static generateGeometry(geometries: away.base.Geometry[], transforms?: tools.ParticleGeometryTransform[]): away.base.ParticleGeometry;
    }
}
declare module away {
    class Away3D extends away.events.EventDispatcher {
        constructor();
    }
}
