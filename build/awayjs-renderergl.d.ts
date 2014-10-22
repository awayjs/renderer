declare module "awayjs-renderergl/lib/animators/data/ParticleData" {
	import TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
	class ParticleData {
	    particleIndex: number;
	    numVertices: number;
	    startVertexIndex: number;
	    subGeometry: TriangleSubGeometry;
	}
	export = ParticleData;
	
}
declare module "awayjs-renderergl/lib/animators/data/ParticleAnimationData" {
	import ParticleData = require("awayjs-renderergl/lib/animators/data/ParticleData");
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
declare module "awayjs-renderergl/lib/animators/data/AnimationSubGeometry" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import IContextStageGL = require("awayjs-stagegl/lib/core/stagegl/IContextStageGL");
	import IVertexBuffer = require("awayjs-stagegl/lib/core/stagegl/IVertexBuffer");
	import ParticleAnimationData = require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
	/**
	 * ...
	 */
	class AnimationSubGeometry {
	    static SUBGEOM_ID_COUNT: number;
	    _pVertexData: number[];
	    _pVertexBuffer: IVertexBuffer[];
	    _pBufferContext: IContextStageGL[];
	    _pBufferDirty: boolean[];
	    private _numVertices;
	    private _totalLenOfOneVertex;
	    numProcessedVertices: number;
	    previousTime: number;
	    animationParticles: ParticleAnimationData[];
	    /**
	     * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
	     *
	     * @private
	     */
	    _iUniqueId: number;
	    constructor();
	    createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
	    activateVertexBuffer(index: number, bufferOffset: number, stage: Stage, format: string): void;
	    dispose(): void;
	    invalidateBuffer(): void;
	    vertexData: number[];
	    numVertices: number;
	    totalLenOfOneVertex: number;
	}
	export = AnimationSubGeometry;
	
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
declare module "awayjs-renderergl/lib/animators/nodes/ParticleNodeBase" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	/**
	 * Provides an abstract base class for particle animation nodes.
	 */
	class ParticleNodeBase extends AnimationNodeBase {
	    private _priority;
	    _pMode: number;
	    _pDataLength: number;
	    _pOneData: number[];
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
	    oneData: number[];
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Returns the AGAL code of the particle animation node for use in the fragment shader.
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/events/AnimationStateEvent" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import Event = require("awayjs-core/lib/events/Event");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import IAnimationState = require("awayjs-stagegl/lib/animators/states/IAnimationState");
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
	    clone(): Event;
	}
	export = AnimationStateEvent;
	
}
declare module "awayjs-renderergl/lib/animators/states/AnimationStateBase" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import IAnimationState = require("awayjs-stagegl/lib/animators/states/IAnimationState");
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
declare module "awayjs-renderergl/lib/animators/states/ParticleStateBase" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	/**
	 * ...
	 */
	class ParticleStateBase extends AnimationStateBase {
	    private _particleNode;
	    _pDynamicProperties: Vector3D[];
	    _pDynamicPropertiesDirty: Object;
	    _pNeedUpdateTime: boolean;
	    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase, needUpdateTime?: boolean);
	    needUpdateTime: boolean;
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    _pUpdateDynamicProperties(animationSubGeometry: AnimationSubGeometry): void;
	}
	export = ParticleStateBase;
	
}
declare module "awayjs-renderergl/lib/animators/ParticleAnimator" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
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
	    clone(): AnimatorBase;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
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
	    private getAnimatorSubGeometry(subMesh);
	}
	export = ParticleAnimator;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleTimeState" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleTimeNode = require("awayjs-renderergl/lib/animators/nodes/ParticleTimeNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleTimeState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleTimeNode" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/core/base/ParticleGeometry" {
	import Geometry = require("awayjs-core/lib/core/base/Geometry");
	import ParticleData = require("awayjs-renderergl/lib/animators/data/ParticleData");
	/**
	 * @class away.base.ParticleGeometry
	 */
	class ParticleGeometry extends Geometry {
	    particles: ParticleData[];
	    numParticles: number;
	}
	export = ParticleGeometry;
	
}
declare module "awayjs-renderergl/lib/animators/ParticleAnimationSet" {
	import IAnimationSet = require("awayjs-core/lib/animators/IAnimationSet");
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import ISubMesh = require("awayjs-core/lib/core/base/ISubMesh");
	import Mesh = require("awayjs-core/lib/entities/Mesh");
	import AnimationSetBase = require("awayjs-stagegl/lib/animators/AnimationSetBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
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
	    particleNodes: ParticleNodeBase[];
	    /**
	     * @inheritDoc
	     */
	    addAnimation(node: AnimationNodeBase): void;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    usesCPU: boolean;
	    /**
	     * @inheritDoc
	     */
	    cancelGPUCompatibility(): void;
	    dispose(): void;
	    getAnimationSubGeometry(subMesh: ISubMesh): any;
	    /** @private */
	    _iGenerateAnimationSubGeometries(mesh: Mesh): void;
	}
	export = ParticleAnimationSet;
	
}
declare module "awayjs-renderergl/lib/animators/SkeletonAnimationSet" {
	import IAnimationSet = require("awayjs-core/lib/animators/IAnimationSet");
	import AnimationSetBase = require("awayjs-stagegl/lib/animators/AnimationSetBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	}
	export = SkeletonAnimationSet;
	
}
declare module "awayjs-renderergl/lib/animators/data/JointPose" {
	import Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
	import Quaternion = require("awayjs-core/lib/core/geom/Quaternion");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
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
	    inverseBindPose: number[];
	    /**
	     * Creates a new <code>SkeletonJoint</code> object
	     */
	    constructor();
	}
	export = SkeletonJoint;
	
}
declare module "awayjs-renderergl/lib/animators/data/Skeleton" {
	import SkeletonJoint = require("awayjs-renderergl/lib/animators/data/SkeletonJoint");
	import IAsset = require("awayjs-core/lib/core/library/IAsset");
	import NamedAssetBase = require("awayjs-core/lib/core/library/NamedAssetBase");
	/**
	 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
	 *
	 * @see away.animators.SkeletonJoint
	 */
	class Skeleton extends NamedAssetBase implements IAsset {
	    /**
	     * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
	     * property that is an index into this list.
	     * A child joint should always have a higher index than its parent.
	     */
	    joints: SkeletonJoint[];
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
declare module "awayjs-renderergl/lib/animators/data/SkeletonPose" {
	import JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
	import IAsset = require("awayjs-core/lib/core/library/IAsset");
	import NamedAssetBase = require("awayjs-core/lib/core/library/NamedAssetBase");
	/**
	 * A collection of pose objects, determining the pose for an entire skeleton.
	 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
	 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
	 * clips are added to any animator with a valid skeleton)
	 *
	 * @see away.animators.Skeleton
	 * @see away.animators.JointPose
	 */
	class SkeletonPose extends NamedAssetBase implements IAsset {
	    /**
	     * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
	     *
	     * @see away.animators.Skeleton#joints
	     */
	    jointPoses: JointPose[];
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
declare module "awayjs-renderergl/lib/animators/states/ISkeletonAnimationState" {
	import IAnimationState = require("awayjs-stagegl/lib/animators/states/IAnimationState");
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
declare module "awayjs-renderergl/lib/animators/transitions/IAnimationTransition" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	/**
	 *
	 */
	interface IAnimationTransition {
	    getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startTime: number): AnimationNodeBase;
	}
	export = IAnimationTransition;
	
}
declare module "awayjs-renderergl/lib/animators/SkeletonAnimator" {
	import TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import TriangleSubMeshRenderable = require("awayjs-stagegl/lib/core/pool/TriangleSubMeshRenderable");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import SkeletonAnimationSet = require("awayjs-renderergl/lib/animators/SkeletonAnimationSet");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
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
	    globalMatrices: number[];
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
	     * by condensing the number of joint index values required per mesh. Only applicable to
	     * skeleton animations that utilise more than one mesh object. Defaults to false.
	     */
	    useCondensedIndices: boolean;
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
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
	    /**
	     * Applies the calculated time delta to the active animation state node or state transition object.
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    private updateCondensedMatrices(condensedIndexLookUp, numJoints);
	    private updateGlobalProperties();
	    getRenderableSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): TriangleSubGeometry;
	    /**
	     * If the animation can't be performed on GPU, transform vertices manually
	     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
	     * @param pass The material pass for which we need to transform the vertices
	     */
	    morphSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): void;
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
declare module "awayjs-renderergl/lib/animators/VertexAnimationSet" {
	import IAnimationSet = require("awayjs-core/lib/animators/IAnimationSet");
	import AnimationSetBase = require("awayjs-stagegl/lib/animators/AnimationSetBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	    /**
	     * Generates the vertex AGAL code for absolute blending.
	     */
	    private getAbsoluteAGALCode(shaderObject);
	    /**
	     * Generates the vertex AGAL code for additive blending.
	     */
	    private getAdditiveAGALCode(shaderObject);
	}
	export = VertexAnimationSet;
	
}
declare module "awayjs-renderergl/lib/animators/states/IVertexAnimationState" {
	import Geometry = require("awayjs-core/lib/core/base/Geometry");
	import IAnimationState = require("awayjs-stagegl/lib/animators/states/IAnimationState");
	/**
	 * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
	 *
	 * @see away.animators.VertexAnimator
	 */
	interface IVertexAnimationState extends IAnimationState {
	    /**
	     * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	     */
	    currentGeometry: Geometry;
	    /**
	     * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	     */
	    nextGeometry: Geometry;
	    /**
	     * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	     * between the current geometry frame (0) and next geometry frame (1) of the animation.
	     */
	    blendWeight: number;
	}
	export = IVertexAnimationState;
	
}
declare module "awayjs-renderergl/lib/animators/VertexAnimator" {
	import TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import TriangleSubMeshRenderable = require("awayjs-stagegl/lib/core/pool/TriangleSubMeshRenderable");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import VertexAnimationSet = require("awayjs-renderergl/lib/animators/VertexAnimationSet");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
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
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    private setNullPose(shaderObject, renderable, stage, vertexConstantOffset, vertexStreamOffset);
	    /**
	     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
	     * Needs to be called if gpu code is potentially required.
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
	    getRenderableSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): TriangleSubGeometry;
	}
	export = VertexAnimator;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
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
	    _pDurations: number[];
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
	    durations: number[];
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
declare module "awayjs-renderergl/lib/animators/states/AnimationClipState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/states/SkeletonClipState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonClipNode" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
	    frames: SkeletonPose[];
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
declare module "awayjs-renderergl/lib/animators/states/VertexClipState" {
	import Geometry = require("awayjs-core/lib/core/base/Geometry");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import VertexClipNode = require("awayjs-renderergl/lib/animators/nodes/VertexClipNode");
	import AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
	import IVertexAnimationState = require("awayjs-renderergl/lib/animators/states/IVertexAnimationState");
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
	    currentGeometry: Geometry;
	    /**
	     * @inheritDoc
	     */
	    nextGeometry: Geometry;
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
declare module "awayjs-renderergl/lib/animators/nodes/VertexClipNode" {
	import Geometry = require("awayjs-core/lib/core/base/Geometry");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
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
	    frames: Geometry[];
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
	    addFrame(geometry: Geometry, duration: number, translation?: Vector3D): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateStitch(): void;
	}
	export = VertexClipNode;
	
}
declare module "awayjs-renderergl/lib/materials/methods/AmbientEnvMapMethod" {
	import CubeTextureBase = require("awayjs-core/lib/textures/CubeTextureBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import AmbientBasicMethod = require("awayjs-stagegl/lib/materials/methods/AmbientBasicMethod");
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
	    constructor(envMap: CubeTextureBase);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The cube environment map to use for the diffuse lighting.
	     */
	    envMap: CubeTextureBase;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = AmbientEnvMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseDepthMethod" {
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
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
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = DiffuseDepthMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
	/**
	 * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
	 * calculated diffuse reflection strength.
	 */
	class DiffuseCompositeMethod extends DiffuseBasicMethod {
	    pBaseMethod: DiffuseBasicMethod;
	    private _onShaderInvalidatedDelegate;
	    /**
	     * Creates a new <code>DiffuseCompositeMethod</code> object.
	     *
	     * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
	     * @param baseMethod The base diffuse method on which this method's shading is based.
	     */
	    constructor(modulateMethod: (shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string, baseMethod?: DiffuseBasicMethod);
	    /**
	     * The base diffuse method on which this method's shading is based.
	     */
	    baseMethod: DiffuseBasicMethod;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    /**
	     * @inheritDoc
	     */
	    texture: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    /**
	     * @inheritDoc
	     */
	    diffuseColor: number;
	    /**
	     * @inheritDoc
	     */
	    /**
	     * @inheritDoc
	     */
	    ambientColor: number;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderLightingObject, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    iDeactivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iReset(): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * Called when the base method's shader code is invalidated.
	     */
	    private onShaderInvalidated(event);
	}
	export = DiffuseCompositeMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseCelMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
	import DiffuseCompositeMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod");
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
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * The amount of shadow gradations.
	     */
	    levels: number;
	    /**
	     * The smoothness of the edge between 2 shading levels.
	     */
	    smoothness: number;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * Snaps the diffuse shading of the wrapped method to one of the levels.
	     * @param vo The MethodVO used to compile the current shader.
	     * @param t The register containing the diffuse strength in the "w" component.
	     * @param regCache The register cache used for the shader compilation.
	     * @param sharedRegisters The shared register data for this shader.
	     * @return The AGAL fragment code for the method.
	     */
	    private clampDiffuse(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}
	export = DiffuseCelMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseGradientMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
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
	    constructor(gradient: Texture2DBase);
	    /**
	     * A texture that contains the light colour based on the angle. This can be used to change the light colour
	     * due to subsurface scattering when the surface faces away from the light.
	     */
	    gradient: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    pApplyShadow(shaderObject: ShaderLightingObject, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	}
	export = DiffuseGradientMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseLightMapMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
	import DiffuseCompositeMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod");
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
	    constructor(lightMap: Texture2DBase, blendMode?: string, useSecondaryUV?: boolean, baseMethod?: DiffuseBasicMethod);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * The blend mode with which the light map should be applied to the lighting result.
	     *
	     * @see DiffuseLightMapMethod.ADD
	     * @see DiffuseLightMapMethod.MULTIPLY
	     */
	    blendMode: string;
	    /**
	     * The texture containing the light map data.
	     */
	    lightMapTexture: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = DiffuseLightMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseWrapMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
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
	    iCleanCompilationData(): void;
	    /**
	     * A factor to indicate the amount by which the light is allowed to wrap.
	     */
	    wrapFactor: number;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	}
	export = DiffuseWrapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectAlphaMaskMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    constructor(texture: Texture2DBase, useSecondaryUV?: boolean);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
	     * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
	     * transparency over a tiled water surface.
	     */
	    useSecondaryUV: boolean;
	    /**
	     * The texture to use as the alpha mask.
	     */
	    texture: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectAlphaMaskMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectColorMatrixMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    colorMatrix: number[];
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	}
	export = EffectColorMatrixMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectEnvMapMethod" {
	import CubeTextureBase = require("awayjs-core/lib/textures/CubeTextureBase");
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    constructor(envMap: CubeTextureBase, alpha?: number);
	    /**
	     * An optional texture to modulate the reflectivity of the surface.
	     */
	    mask: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The cubic environment map containing the reflected scene.
	     */
	    envMap: CubeTextureBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * The reflectivity of the surface.
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectEnvMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectFogMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The distance from which the fog starts appearing.
	     */
	    minDistance: number;
	    /**
	     * The distance at which the fog is densest.
	     */
	    maxDistance: number;
	    /**
	     * The colour of the fog.
	     */
	    fogColor: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectFogMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectFresnelEnvMapMethod" {
	import CubeTextureBase = require("awayjs-core/lib/textures/CubeTextureBase");
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    constructor(envMap: CubeTextureBase, alpha?: number);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * An optional texture to modulate the reflectivity of the surface.
	     */
	    mask: Texture2DBase;
	    /**
	     * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	     */
	    fresnelPower: number;
	    /**
	     * The cubic environment map containing the reflected scene.
	     */
	    envMap: CubeTextureBase;
	    /**
	     * The reflectivity of the surface.
	     */
	    alpha: number;
	    /**
	     * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	     */
	    normalReflectance: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectFresnelEnvMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectLightMapMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    constructor(texture: Texture2DBase, blendMode?: string, useSecondaryUV?: boolean);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The blend mode with which the light map should be applied to the lighting result.
	     *
	     * @see EffectLightMapMethod.ADD
	     * @see EffectLightMapMethod.MULTIPLY
	     */
	    blendMode: string;
	    /**
	     * The texture containing the light map.
	     */
	    texture: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectLightMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectRimLightMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The blend mode with which to add the light to the object.
	     *
	     * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
	     * EffectRimLightMethod.ADD adds the rim light with the material's colour.
	     * EffectRimLightMethod.MIX provides normal alpha blending.
	     */
	    blendMode: string;
	    /**
	     * The color of the rim light.
	     */
	    color: number;
	    /**
	     * The strength of the rim light.
	     */
	    strength: number;
	    /**
	     * The power of the rim light. Higher values will result in a higher edge fall-off.
	     */
	    power: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectRimLightMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/NormalSimpleWaterMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import NormalBasicMethod = require("awayjs-stagegl/lib/materials/methods/NormalBasicMethod");
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
	    constructor(waveMap1: Texture2DBase, waveMap2: Texture2DBase);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The translation of the first wave layer along the X-axis.
	     */
	    water1OffsetX: number;
	    /**
	     * The translation of the first wave layer along the Y-axis.
	     */
	    water1OffsetY: number;
	    /**
	     * The translation of the second wave layer along the X-axis.
	     */
	    water2OffsetX: number;
	    /**
	     * The translation of the second wave layer along the Y-axis.
	     */
	    water2OffsetY: number;
	    /**
	     * A second normal map that will be combined with the first to create a wave-like animation pattern.
	     */
	    secondaryNormalMap: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = NormalSimpleWaterMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/ShadowDitheredMethod" {
	import DirectionalLight = require("awayjs-core/lib/entities/DirectionalLight");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import ShadowMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
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
	    constructor(castingLight: DirectionalLight, numSamples?: number, range?: number);
	    /**
	     * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
	     * complexity of the shader.
	     */
	    numSamples: number;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The range in the shadow map in which to distribute the samples.
	     */
	    range: number;
	    /**
	     * Creates a texture containing the dithering noise texture.
	     */
	    private initGrainTexture();
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Get the actual shader code for shadow mapping
	     * @param regCache The register cache managing the registers.
	     * @param depthMapRegister The texture register containing the depth map.
	     * @param decReg The register containing the depth map decoding data.
	     * @param targetReg The target register to add the shadow coverage.
	     */
	    private getSampleCode(customDataReg, depthMapRegister, decReg, targetReg, regCache, sharedRegisters);
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
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = ShadowDitheredMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/ShadowFilteredMethod" {
	import DirectionalLight = require("awayjs-core/lib/entities/DirectionalLight");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import ShadowMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
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
	    constructor(castingLight: DirectionalLight);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = ShadowFilteredMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import SpecularBasicMethod = require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");
	import MaterialPassBase = require("awayjs-stagegl/lib/materials/passes/MaterialPassBase");
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
	    constructor(modulateMethod: (shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string, baseMethod?: SpecularBasicMethod);
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The base specular method on which this method's shading is based.
	     */
	    baseMethod: SpecularBasicMethod;
	    /**
	     * @inheritDoc
	     */
	    gloss: number;
	    /**
	     * @inheritDoc
	     */
	    specular: number;
	    /**
	     * @inheritDoc
	     */
	    passes: MaterialPassBase[];
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    texture: Texture2DBase;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderLightingObject, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    iDeactivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     * @return
	     */
	    iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iReset(): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * Called when the base method's shader code is invalidated.
	     */
	    private onShaderInvalidated(event);
	}
	export = SpecularCompositeMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/SpecularFresnelMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import SpecularBasicMethod = require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");
	import SpecularCompositeMethod = require("awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod");
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
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
	     */
	    basedOnSurface: boolean;
	    /**
	     * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
	     */
	    fresnelPower: number;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
	     */
	    normalReflectance: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Applies the fresnel effect to the specular strength.
	     *
	     * @param vo The MethodVO object containing the method data for the currently compiled material pass.
	     * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
	     * @param regCache The register cache used for the shader compilation.
	     * @param sharedRegisters The shared registers created by the compiler.
	     * @return The AGAL fragment code for the method.
	     */
	    private modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}
	export = SpecularFresnelMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/SpecularAnisotropicMethod" {
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import SpecularBasicMethod = require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");
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
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = SpecularAnisotropicMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/SpecularCelMethod" {
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import SpecularBasicMethod = require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");
	import SpecularCompositeMethod = require("awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod");
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
	    smoothness: number;
	    /**
	     * The threshold at which the specular highlight should be shown.
	     */
	    specularCutOff: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
	     * @param vo The MethodVO used to compile the current shader.
	     * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
	     * @param regCache The register cache used for the shader compilation.
	     * @param sharedRegisters The shared register data for this shader.
	     * @return The AGAL fragment code for the method.
	     */
	    private clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = SpecularCelMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/SpecularPhongMethod" {
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import SpecularBasicMethod = require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");
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
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = SpecularPhongMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/ShadowNearMethod" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import ShadowMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
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
	    baseMethod: ShadowMethodBase;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    epsilon: number;
	    /**
	     * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
	     */
	    fadeRatio: number;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iDeactivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iReset(): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * Called when the base method's shader code is invalidated.
	     */
	    private onShaderInvalidated(event);
	}
	export = ShadowNearMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/ShadowSoftMethod" {
	import DirectionalLight = require("awayjs-core/lib/entities/DirectionalLight");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import ShadowMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
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
	    constructor(castingLight: DirectionalLight, numSamples?: number, range?: number);
	    /**
	     * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
	     * complexity of the shader.
	     */
	    numSamples: number;
	    /**
	     * The range in the shadow map in which to distribute the samples.
	     */
	    range: number;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _pGetPlanarFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
	    iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
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
	export = ShadowSoftMethod;
	
}
declare module "awayjs-renderergl/lib/parsers/data/AWDBlock" {
	import ByteArray = require("awayjs-core/lib/utils/ByteArray");
	/**
	 *
	 */
	class AWDBlock {
	    id: number;
	    name: string;
	    data: any;
	    len: any;
	    geoID: number;
	    extras: Object;
	    bytes: ByteArray;
	    errorMessages: string[];
	    uvsForVertexAnimation: number[][];
	    constructor();
	    dispose(): void;
	    addError(errorMsg: string): void;
	}
	export = AWDBlock;
	
}
declare module "awayjs-renderergl/lib/parsers/data/AWDProperties" {
	class AWDProperties {
	    set(key: number, value: any): void;
	    get(key: number, fallback: any): any;
	}
	export = AWDProperties;
	
}
declare module "awayjs-renderergl/lib/parsers/data/BitFlags" {
	/**
	 *
	 */
	class BitFlags {
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
	export = BitFlags;
	
}
declare module "awayjs-renderergl/lib/parsers/AWDParser" {
	import IAsset = require("awayjs-core/lib/core/library/IAsset");
	import ParserBase = require("awayjs-core/lib/parsers/ParserBase");
	import ResourceDependency = require("awayjs-core/lib/parsers/ResourceDependency");
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
	    _iResolveDependency(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
	    /**
	     * Resolve a dependency name
	     *
	     * @param resourceDependency The dependency to be resolved.
	     */
	    _iResolveDependencyName(resourceDependency: ResourceDependency, asset: IAsset): string;
	    /**
	     * @inheritDoc
	     */
	    _pProceedParsing(): boolean;
	    _pStartParsing(frameLimit: number): void;
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
	export = AWDParser;
	
}
declare module "awayjs-renderergl/lib/parsers/MD2Parser" {
	import ParserBase = require("awayjs-core/lib/parsers/ParserBase");
	import ResourceDependency = require("awayjs-core/lib/parsers/ResourceDependency");
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
	    _iResolveDependency(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _pProceedParsing(): boolean;
	    _pStartParsing(frameLimit: number): void;
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
	export = MD2Parser;
	
}
declare module "awayjs-renderergl/lib/parsers/data/BaseFrameData" {
	import Quaternion = require("awayjs-core/lib/core/geom/Quaternion");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	/**
	 *
	 */
	class BaseFrameData {
	    /**
	     *
	     */
	    position: Vector3D;
	    /**
	     *
	     */
	    orientation: Quaternion;
	}
	export = BaseFrameData;
	
}
declare module "awayjs-renderergl/lib/parsers/data/BoundsData" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	/**
	 *
	 */
	class BoundsData {
	    /**
	     *
	     */
	    min: Vector3D;
	    /**
	     *
	     */
	    max: Vector3D;
	}
	export = BoundsData;
	
}
declare module "awayjs-renderergl/lib/parsers/data/FrameData" {
	/**
	 *
	 */
	class FrameData {
	    /**
	     *
	     */
	    index: number;
	    /**
	     *
	     */
	    components: number[];
	}
	export = FrameData;
	
}
declare module "awayjs-renderergl/lib/parsers/data/HierarchyData" {
	/**
	 *
	 */
	class HierarchyData {
	    /**
	     *
	     */
	    name: string;
	    /**
	     *
	     */
	    parentIndex: number;
	    /**
	     *
	     */
	    flags: number;
	    /**
	     *
	     */
	    startIndex: number;
	}
	export = HierarchyData;
	
}
declare module "awayjs-renderergl/lib/parsers/MD5AnimParser" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import ParserBase = require("awayjs-core/lib/parsers/ParserBase");
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
	    constructor(additionalRotationAxis?: Vector3D, additionalRotationRadians?: number);
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
	    _pProceedParsing(): boolean;
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
	export = MD5AnimParser;
	
}
declare module "awayjs-renderergl/lib/parsers/MD5MeshParser" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import ParserBase = require("awayjs-core/lib/parsers/ParserBase");
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
	    constructor(additionalRotationAxis?: Vector3D, additionalRotationRadians?: number);
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
	    _pProceedParsing(): boolean;
	    _pStartParsing(frameLimit: number): void;
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
	export = MD5MeshParser;
	
}
declare module "awayjs-renderergl/lib/parsers/data/FaceVO" {
	/**
	 *
	 */
	class FaceVO {
	    a: number;
	    b: number;
	    c: number;
	    smoothGroup: number;
	}
	export = FaceVO;
	
}
declare module "awayjs-renderergl/lib/parsers/data/TextureVO" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	/**
	 *
	 */
	class TextureVO {
	    url: string;
	    texture: Texture2DBase;
	}
	export = TextureVO;
	
}
declare module "awayjs-renderergl/lib/parsers/data/MaterialVO" {
	import MaterialBase = require("awayjs-core/lib/materials/MaterialBase");
	import TextureVO = require("awayjs-renderergl/lib/parsers/data/TextureVO");
	/**
	 *
	 */
	class MaterialVO {
	    name: string;
	    ambientColor: number;
	    diffuseColor: number;
	    specularColor: number;
	    twoSided: boolean;
	    colorMap: TextureVO;
	    specularMap: TextureVO;
	    material: MaterialBase;
	}
	export = MaterialVO;
	
}
declare module "awayjs-renderergl/lib/parsers/data/ObjectVO" {
	class ObjectVO {
	    name: string;
	    type: string;
	    pivotX: number;
	    pivotY: number;
	    pivotZ: number;
	    transform: number[];
	    verts: number[];
	    indices: number[];
	    uvs: number[];
	    materialFaces: Object;
	    materials: string[];
	    smoothingGroups: number[];
	}
	export = ObjectVO;
	
}
declare module "awayjs-renderergl/lib/parsers/data/VertexVO" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	class VertexVO {
	    x: number;
	    y: number;
	    z: number;
	    u: number;
	    v: number;
	    normal: Vector3D;
	    tangent: Vector3D;
	}
	export = VertexVO;
	
}
declare module "awayjs-renderergl/lib/parsers/Max3DSParser" {
	import ParserBase = require("awayjs-core/lib/parsers/ParserBase");
	import ResourceDependency = require("awayjs-core/lib/parsers/ResourceDependency");
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
	    _iResolveDependency(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _pProceedParsing(): boolean;
	    _pStartParsing(frameLimit: number): void;
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
	export = Max3DSParser;
	
}
declare module "awayjs-renderergl/lib/parsers/OBJParser" {
	import ParserBase = require("awayjs-core/lib/parsers/ParserBase");
	import ResourceDependency = require("awayjs-core/lib/parsers/ResourceDependency");
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
	    scale: number;
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
	    _iResolveDependency(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _iResolveDependencyFailure(resourceDependency: ResourceDependency): void;
	    /**
	     * @inheritDoc
	     */
	    _pProceedParsing(): boolean;
	    _pStartParsing(frameLimit: number): void;
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
	export = OBJParser;
	
}
declare module "awayjs-renderergl/lib/parsers/Parsers" {
	/**
	 *
	 */
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
	     * @see away.library.AssetLibrary.enableParser
	     */
	    static ALL_BUNDLED: Object[];
	    /**
	     * Short-hand function to enable all bundled parsers for auto-detection. In practice,
	     * this is the same as invoking enableParsers(Parsers.ALL_BUNDLED) on any of the
	     * loader classes SingleFileLoader, AssetLoader, AssetLibrary or Loader3D.
	     *
	     * See notes about file size in the documentation for the ALL_BUNDLED constant.
	     *
	     * @see away.parsers.Parsers.ALL_BUNDLED
	     */
	    static enableAllBundled(): void;
	}
	export = Parsers;
	
}
declare module "awayjs-renderergl/lib/utils/PerspectiveMatrix3D" {
	import Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
	/**
	 *
	 */
	class PerspectiveMatrix3D extends Matrix3D {
	    constructor(v?: number[]);
	    perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
	}
	export = PerspectiveMatrix3D;
	
}
declare module "awayjs-renderergl/lib/animators/data/ColorSegmentPoint" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	class ColorSegmentPoint {
	    private _color;
	    private _life;
	    constructor(life: number, color: ColorTransform);
	    color: ColorTransform;
	    life: number;
	}
	export = ColorSegmentPoint;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleAccelerationState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleAccelerationNode = require("awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateAccelerationData();
	}
	export = ParticleAccelerationState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    pGetAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleBezierCurveState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleBezierCurveNode = require("awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleBezierCurveState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleBillboardState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleBillboardNode = require("awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    /**
	     * Defines the billboard axis.
	     */
	    billboardAxis: Vector3D;
	}
	export = ParticleBillboardState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleColorState" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleColorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleColorNode" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleFollowState" {
	import DisplayObject = require("awayjs-core/lib/core/base/DisplayObject");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleFollowNode = require("awayjs-renderergl/lib/animators/nodes/ParticleFollowNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private processPosition(currentTime, deltaTime, animationSubGeometry);
	    private precessRotation(currentTime, deltaTime, animationSubGeometry);
	    private processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);
	}
	export = ParticleFollowState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleFollowNode" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleFollowState;
	}
	export = ParticleFollowNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleInitialColorState" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleInitialColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleInitialColorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleOrbitState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleOrbitNode = require("awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateOrbitData();
	}
	export = ParticleOrbitState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleOscillatorState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleOscillatorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateOscillatorData();
	}
	export = ParticleOscillatorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticlePositionState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticlePositionNode = require("awayjs-renderergl/lib/animators/nodes/ParticlePositionNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    getPositions(): Vector3D[];
	    setPositions(value: Vector3D[]): void;
	    constructor(animator: ParticleAnimator, particlePositionNode: ParticlePositionNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticlePositionState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticlePositionNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	/**
	 * ...
	 */
	class ParticleRotateToHeadingState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    private _matrix;
	    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleRotateToHeadingState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleRotateToPositionNode = require("awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleRotateToPositionState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleRotationalVelocityNode = require("awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    getRotationalVelocities(): Vector3D[];
	    setRotationalVelocities(value: Vector3D[]): void;
	    constructor(animator: ParticleAnimator, particleRotationNode: ParticleRotationalVelocityNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateRotationalVelocityData();
	}
	export = ParticleRotationalVelocityState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleScaleState" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleScaleNode = require("awayjs-renderergl/lib/animators/nodes/ParticleScaleNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateScaleData();
	}
	export = ParticleScaleState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleScaleNode" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ColorSegmentPoint = require("awayjs-renderergl/lib/animators/data/ColorSegmentPoint");
	import ParticleSegmentedColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    segmentPoints: ColorSegmentPoint[];
	    usesMultiplier: boolean;
	    usesOffset: boolean;
	    constructor(animator: ParticleAnimator, particleSegmentedColorNode: ParticleSegmentedColorNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleSegmentedColorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode" {
	import ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    _iSegmentPoints: ColorSegmentPoint[];
	    constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: ColorTransform, endColor: ColorTransform, segmentPoints: ColorSegmentPoint[]);
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	}
	export = ParticleSegmentedColorNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleSpriteSheetNode = require("awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateSpriteSheetData();
	}
	export = ParticleSpriteSheetState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALUVCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleUVState" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleUVNode = require("awayjs-renderergl/lib/animators/nodes/ParticleUVNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	/**
	 * ...
	 */
	class ParticleUVState extends ParticleStateBase {
	    /** @private */
	    static UV_INDEX: number;
	    private _particleUVNode;
	    constructor(animator: ParticleAnimator, particleUVNode: ParticleUVNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleUVState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleUVNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALUVCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/ParticleVelocityState" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleVelocityNode = require("awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
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
	    getVelocities(): Vector3D[];
	    setVelocities(value: Vector3D[]): void;
	    constructor(animator: ParticleAnimator, particleVelocityNode: ParticleVelocityNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleVelocityState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode" {
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
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
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
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
declare module "awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/states/SkeletonDifferenceState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/states/SkeletonDirectionalState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
	import SkeletonNaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState");
	/**
	 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class SkeletonNaryLERPNode extends AnimationNodeBase {
	    _iInputs: AnimationNodeBase[];
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
declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState" {
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransition" {
	import AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
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
declare module "awayjs-renderergl/lib/core/pick/PickingColliderBase" {
	import PickingCollisionVO = require("awayjs-core/lib/core/pick/PickingCollisionVO");
	import Point = require("awayjs-core/lib/core/geom/Point");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import Billboard = require("awayjs-core/lib/entities/Billboard");
	import Mesh = require("awayjs-core/lib/entities/Mesh");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	/**
	 * An abstract base class for all picking collider classes. It should not be instantiated directly.
	 *
	 * @class away.pick.PickingColliderBase
	 */
	class PickingColliderBase {
	    private _billboardRenderablePool;
	    private _subMeshRenderablePool;
	    rayPosition: Vector3D;
	    rayDirection: Vector3D;
	    constructor();
	    _pPetCollisionNormal(indexData: number[], vertexData: number[], triangleIndex: number): Vector3D;
	    _pGetCollisionUV(indexData: number[], uvData: number[], triangleIndex: number, v: number, w: number, u: number, uvOffset: number, uvStride: number): Point;
	    /**
	     * @inheritDoc
	     */
	    _pTestRenderableCollision(renderable: RenderableBase, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
	    /**
	     * @inheritDoc
	     */
	    setLocalRay(localPosition: Vector3D, localDirection: Vector3D): void;
	    /**
	     * Tests a <code>Billboard</code> object for a collision with the picking ray.
	     *
	     * @param billboard The billboard instance to be tested.
	     * @param pickingCollisionVO The collision object used to store the collision results
	     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
	     * @param findClosest
	     */
	    testBillboardCollision(billboard: Billboard, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
	    /**
	     * Tests a <code>Mesh</code> object for a collision with the picking ray.
	     *
	     * @param mesh The mesh instance to be tested.
	     * @param pickingCollisionVO The collision object used to store the collision results
	     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
	     * @param findClosest
	     */
	    testMeshCollision(mesh: Mesh, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number, findClosest: boolean): boolean;
	}
	export = PickingColliderBase;
	
}
declare module "awayjs-renderergl/lib/core/pick/JSPickingCollider" {
	import PickingCollisionVO = require("awayjs-core/lib/core/pick/PickingCollisionVO");
	import IPickingCollider = require("awayjs-core/lib/core/pick/IPickingCollider");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import PickingColliderBase = require("awayjs-renderergl/lib/core/pick/PickingColliderBase");
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
	    _pTestRenderableCollision(renderable: RenderableBase, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
	}
	export = JSPickingCollider;
	
}
declare module "awayjs-renderergl/lib/core/pick/ShaderPicker" {
	import Scene = require("awayjs-core/lib/containers/Scene");
	import View = require("awayjs-core/lib/containers/View");
	import Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
	import IPicker = require("awayjs-core/lib/core/pick/IPicker");
	import PickingCollisionVO = require("awayjs-core/lib/core/pick/PickingCollisionVO");
	import EntityCollector = require("awayjs-core/lib/core/traverse/EntityCollector");
	import ITextureBase = require("awayjs-stagegl/lib/core/stagegl/ITextureBase");
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
	    private _stage;
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
	    onlyMouseEnabled: boolean;
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
	    getViewCollision(x: number, y: number, view: View): PickingCollisionVO;
	    /**
	     * @inheritDoc
	     */
	    getSceneCollision(position: Vector3D, direction: Vector3D, scene: Scene): PickingCollisionVO;
	    /**
	     * @inheritDoc
	     */
	    pDraw(entityCollector: EntityCollector, target: ITextureBase): void;
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
	    dispose(): void;
	}
	export = ShaderPicker;
	
}
declare module "awayjs-renderergl/lib/materials/passes/SingleObjectDepthPass" {
	import Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
	import Camera = require("awayjs-core/lib/entities/Camera");
	import RenderTexture = require("awayjs-core/lib/textures/RenderTexture");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MaterialPassData = require("awayjs-stagegl/lib/core/pool/MaterialPassData");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import MaterialPassBase = require("awayjs-stagegl/lib/materials/passes/MaterialPassBase");
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
	     * The size of the depth map texture to render to.
	     */
	    textureSize: number;
	    /**
	     * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
	     */
	    polyOffset: number;
	    /**
	     * Creates a new SingleObjectDepthPass object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * Updates the projection textures used to contain the depth renders.
	     */
	    private updateProjectionTextures();
	    /**
	     * @inheritDoc
	     */
	    _iGetVertexCode(): string;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Gets the depth maps rendered for this object from all lights.
	     * @param renderable The renderable for which to retrieve the depth maps.
	     * @param stage3DProxy The Stage3DProxy object currently used for rendering.
	     * @return A list of depth map textures for all supported lights.
	     */
	    _iGetDepthMap(renderable: RenderableBase): RenderTexture;
	    /**
	     * Retrieves the depth map projection maps for all lights.
	     * @param renderable The renderable for which to retrieve the projection maps.
	     * @return A list of projection maps for all supported lights.
	     */
	    _iGetProjection(renderable: RenderableBase): Matrix3D;
	    /**
	     * @inheritDoc
	     */
	    _iRender(pass: MaterialPassData, renderable: RenderableBase, stage: Stage, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(pass: MaterialPassData, stage: Stage, camera: Camera): void;
	}
	export = SingleObjectDepthPass;
	
}
declare module "awayjs-renderergl/lib/materials/methods/DiffuseSubSurfaceMethod" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import DiffuseBasicMethod = require("awayjs-stagegl/lib/materials/methods/DiffuseBasicMethod");
	import DiffuseCompositeMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCompositeMethod");
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
	    iInitConstants(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    iCleanCompilationData(): void;
	    /**
	     * The amount by which the light scatters. It can be used to set the translucent surface's thickness. Use low
	     * values for skin.
	     */
	    scattering: number;
	    /**
	     * The translucency of the object.
	     */
	    translucency: number;
	    /**
	     * The colour of the "insides" of the object, ie: the colour the light becomes after leaving the object.
	     */
	    scatterColor: number;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * Generates the code for this method
	     */
	    private scatterLight(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
	}
	export = DiffuseSubSurfaceMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/EffectRefractionEnvMapMethod" {
	import CubeTextureBase = require("awayjs-core/lib/textures/CubeTextureBase");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import EffectMethodBase = require("awayjs-stagegl/lib/materials/methods/EffectMethodBase");
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
	    constructor(envMap: CubeTextureBase, refractionIndex?: number, dispersionR?: number, dispersionG?: number, dispersionB?: number);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * The cube environment map to use for the refraction.
	     */
	    envMap: CubeTextureBase;
	    /**
	     * The refractive index of the material.
	     */
	    refractionIndex: number;
	    /**
	     * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
	     */
	    dispersionR: number;
	    /**
	     * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
	     */
	    dispersionG: number;
	    /**
	     * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
	     */
	    dispersionB: number;
	    /**
	     * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
	     * material. A value of 1 will make it appear fully transparent.
	     */
	    alpha: number;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = EffectRefractionEnvMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/NormalHeightMapMethod" {
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import NormalBasicMethod = require("awayjs-stagegl/lib/materials/methods/NormalBasicMethod");
	import ShadingMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadingMethodBase");
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
	    constructor(heightMap: Texture2DBase, worldWidth: number, worldHeight: number, worldDepth: number);
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    tangentSpace: boolean;
	    /**
	     * @inheritDoc
	     */
	    copyFrom(method: ShadingMethodBase): void;
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = NormalHeightMapMethod;
	
}
declare module "awayjs-renderergl/lib/materials/methods/ShadowCascadeMethod" {
	import Camera = require("awayjs-core/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/core/base/Stage");
	import RenderableBase = require("awayjs-stagegl/lib/core/pool/RenderableBase");
	import MethodVO = require("awayjs-stagegl/lib/materials/compilation/MethodVO");
	import ShaderLightingObject = require("awayjs-stagegl/lib/materials/compilation/ShaderLightingObject");
	import ShaderObjectBase = require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
	import ShadowMapMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMapMethodBase");
	import ShadowMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
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
	    baseMethod: ShadowMethodBase;
	    /**
	     * @inheritDoc
	     */
	    iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
	    /**
	     * @inheritDoc
	     */
	    iCleanCompilationData(): void;
	    /**
	     * @inheritDoc
	     */
	    iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Creates the registers for the cascades' projection coordinates.
	     */
	    private initProjectionsRegs(registerCache);
	    /**
	     * @inheritDoc
	     */
	    iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: RenderableBase, stage: Stage, camera: Camera): void;
	    /**
	     * Called when the shadow mappers cascade configuration changes.
	     */
	    private onCascadeChange(event);
	    /**
	     * Called when the base method's shader code is invalidated.
	     */
	    private onShaderInvalidated(event);
	}
	export = ShadowCascadeMethod;
	
}
declare module "awayjs-renderergl/lib/tools/commands/Merge" {
	import DisplayObjectContainer = require("awayjs-core/lib/containers/DisplayObjectContainer");
	import Mesh = require("awayjs-core/lib/entities/Mesh");
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
	    disposeSources: boolean;
	    /**
	     * Determines if the material source(s) used for the merging are disposed. Defaults to false.
	     */
	    keepMaterial: boolean;
	    /**
	     * Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
	     */
	    objectSpace: boolean;
	    /**
	     * Merges all the children of a container into a single Mesh. If no Mesh object is found, method returns the receiver without modification.
	     *
	     * @param    receiver           The Mesh to receive the merged contents of the container.
	     * @param    objectContainer    The DisplayObjectContainer holding the meshes to be mergd.
	     *
	     * @return The merged Mesh instance.
	     */
	    applyToContainer(receiver: Mesh, objectContainer: DisplayObjectContainer): void;
	    /**
	     * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
	     *
	     * @param    receiver    The Mesh to receive the merged contents of the meshes.
	     * @param    meshes      A series of Meshes to be merged with the reciever mesh.
	     */
	    applyToMeshes(receiver: Mesh, meshes: Mesh[]): void;
	    /**
	     *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
	     *
	     * @param    receiver    The Mesh to receive the merged contents of both meshes.
	     * @param    mesh        The Mesh to be merged with the receiver mesh
	     */
	    apply(receiver: Mesh, mesh: Mesh): void;
	    private reset();
	    private merge(destMesh, dispose);
	    private collect(mesh, dispose);
	    private getSubGeomData(material);
	    private parseContainer(receiver, object);
	}
	export = Merge;
	
}
declare module "awayjs-renderergl/lib/tools/data/ParticleGeometryTransform" {
	import Matrix = require("awayjs-core/lib/core/geom/Matrix");
	import Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
	/**
	 * ...
	 */
	class ParticleGeometryTransform {
	    private _defaultVertexTransform;
	    private _defaultInvVertexTransform;
	    private _defaultUVTransform;
	    vertexTransform: Matrix3D;
	    UVTransform: Matrix;
	    invVertexTransform: Matrix3D;
	}
	export = ParticleGeometryTransform;
	
}
declare module "awayjs-renderergl/lib/tools/helpers/ParticleGeometryHelper" {
	import Geometry = require("awayjs-core/lib/core/base/Geometry");
	import ParticleGeometry = require("awayjs-renderergl/lib/core/base/ParticleGeometry");
	import ParticleGeometryTransform = require("awayjs-renderergl/lib/tools/data/ParticleGeometryTransform");
	/**
	 * ...
	 */
	class ParticleGeometryHelper {
	    static MAX_VERTEX: number;
	    static generateGeometry(geometries: Geometry[], transforms?: ParticleGeometryTransform[]): ParticleGeometry;
	}
	export = ParticleGeometryHelper;
	
}