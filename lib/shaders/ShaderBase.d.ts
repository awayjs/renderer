import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { IAssetClass } from "@awayjs/core/lib/library/IAssetClass";
import { IAbstractionPool } from "@awayjs/core/lib/library/IAbstractionPool";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { TextureBase } from "@awayjs/display/lib/textures/TextureBase";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ProgramData } from "@awayjs/stage/lib/image/ProgramData";
import { GL_IAssetClass } from "@awayjs/stage/lib/library/GL_IAssetClass";
import { AnimationRegisterData } from "../animators/data/AnimationRegisterData";
import { IPass } from "../surfaces/passes/IPass";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_ElementsBase } from "../elements/GL_ElementsBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { CompilerBase } from "../shaders/compilers/CompilerBase";
import { ShaderRegisterCache } from "../shaders/ShaderRegisterCache";
import { GL_TextureBase } from "../textures/GL_TextureBase";
/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
export declare class ShaderBase implements IAbstractionPool {
    static _abstractionClassPool: Object;
    private _abstractionPool;
    private _elementsClass;
    private _pass;
    _stage: Stage;
    private _programData;
    private _blendFactorSource;
    private _blendFactorDest;
    private _invalidProgram;
    private _animationVertexCode;
    private _animationFragmentCode;
    private _numUsedVertexConstants;
    private _numUsedFragmentConstants;
    private _numUsedStreams;
    private _numUsedTextures;
    private _usesAnimation;
    readonly programData: ProgramData;
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
    animationRegisterData: AnimationRegisterData;
    readonly numUsedVertexConstants: number;
    readonly numUsedFragmentConstants: number;
    /**
     * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
     */
    readonly numUsedStreams: number;
    /**
     *
     */
    readonly numUsedTextures: number;
    numLights: number;
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
     *
     */
    skyboxScaleIndex: number;
    /**
     *
     */
    scenePositionIndex: number;
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
     *
     */
    activeElements: GL_ElementsBase;
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
    initConstantData(registerCache: ShaderRegisterCache): void;
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
    _setRenderState(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    invalidateProgram(): void;
    dispose(): void;
    private _updateProgram();
    private _calcAnimationCode(registerCache, shadedTarget, sharedRegisters);
    setVertexConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
    setVertexConstFromArray(index: number, data: Float32Array): void;
    setVertexConstFromMatrix(index: number, matrix: Matrix3D): void;
    setFragmentConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
}
