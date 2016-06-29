import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleSpriteSheetNode } from "../../animators/nodes/ParticleSpriteSheetNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleSpriteSheetState extends ParticleStateBase {
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
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateSpriteSheetData();
}
