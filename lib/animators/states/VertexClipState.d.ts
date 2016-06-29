import { Graphics } from "@awayjs/display/lib/graphics/Graphics";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { VertexClipNode } from "../../animators/nodes/VertexClipNode";
import { AnimationClipState } from "../../animators/states/AnimationClipState";
import { IVertexAnimationState } from "../../animators/states/IVertexAnimationState";
/**
 *
 */
export declare class VertexClipState extends AnimationClipState implements IVertexAnimationState {
    private _frames;
    private _vertexClipNode;
    private _currentGraphics;
    private _nextGraphics;
    /**
     * @inheritDoc
     */
    readonly currentGraphics: Graphics;
    /**
     * @inheritDoc
     */
    readonly nextGraphics: Graphics;
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
