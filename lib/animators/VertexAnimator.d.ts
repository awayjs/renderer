import { TriangleElements } from "@awayjs/display/lib/graphics/TriangleElements";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { AnimatorBase } from "../animators/AnimatorBase";
import { VertexAnimationSet } from "../animators/VertexAnimationSet";
import { IAnimationTransition } from "../animators/transitions/IAnimationTransition";
import { GL_GraphicRenderable } from "../renderables/GL_GraphicRenderable";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
import { ShaderBase } from "../shaders/ShaderBase";
/**
 * Provides an interface for assigning vertex-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
export declare class VertexAnimator extends AnimatorBase {
    private _vertexAnimationSet;
    private _poses;
    private _weights;
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
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, stage: Stage, camera: Camera): void;
    private setNullPose(shader, elements, stage);
    /**
     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
     * Needs to be called if gpu code is potentially required.
     */
    testGPUCompatibility(shader: ShaderBase): void;
    getRenderableElements(renderable: GL_GraphicRenderable, sourceElements: TriangleElements): TriangleElements;
}
