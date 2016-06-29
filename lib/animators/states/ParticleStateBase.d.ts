import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { AnimationStateBase } from "../../animators/states/AnimationStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleStateBase extends AnimationStateBase {
    private _particleNode;
    _pParticleAnimator: ParticleAnimator;
    _pDynamicProperties: Array<Vector3D>;
    _pDynamicPropertiesDirty: Object;
    _pNeedUpdateTime: boolean;
    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase, needUpdateTime?: boolean);
    readonly needUpdateTime: boolean;
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    _pUpdateDynamicProperties(animationElements: AnimationElements): void;
}
