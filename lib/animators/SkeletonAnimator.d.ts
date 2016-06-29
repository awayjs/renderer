import { TriangleElements } from "@awayjs/display/lib/graphics/TriangleElements";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { AnimatorBase } from "../animators/AnimatorBase";
import { SkeletonAnimationSet } from "../animators/SkeletonAnimationSet";
import { Skeleton } from "../animators/data/Skeleton";
import { SkeletonPose } from "../animators/data/SkeletonPose";
import { IAnimationTransition } from "../animators/transitions/IAnimationTransition";
import { ShaderBase } from "../shaders/ShaderBase";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { GL_GraphicRenderable } from "../renderables/GL_GraphicRenderable";
/**
 * Provides an interface for assigning skeleton-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
export declare class SkeletonAnimator extends AnimatorBase {
    private _globalMatrices;
    private _globalPose;
    private _globalPropertiesDirty;
    private _numJoints;
    private _morphedElements;
    private _morphedElementsDirty;
    private _condensedMatrices;
    private _skeletonAnimationSet;
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
    readonly globalMatrices: Float32Array;
    /**
     * returns the current skeleton pose output from the animator.
     *
     * @see away.animators.data.SkeletonPose
     */
    readonly globalPose: SkeletonPose;
    /**
     * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
     * skinned geoemtry to which skeleon animator is applied.
     */
    readonly skeleton: Skeleton;
    /**
     * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
     * Defaults to false.
     */
    readonly forceCPU: boolean;
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
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
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
