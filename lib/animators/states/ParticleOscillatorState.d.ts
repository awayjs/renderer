import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleOscillatorNode } from "../../animators/nodes/ParticleOscillatorNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleOscillatorState extends ParticleStateBase {
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
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateOscillatorData();
}
