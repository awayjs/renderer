import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleUVNode } from "../../animators/nodes/ParticleUVNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleUVState extends ParticleStateBase {
    /** @private */
    static UV_INDEX: number;
    private _particleUVNode;
    constructor(animator: ParticleAnimator, particleUVNode: ParticleUVNode);
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
}
