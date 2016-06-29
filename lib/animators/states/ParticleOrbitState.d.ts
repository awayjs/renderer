import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ParticleAnimator } from "../../animators/ParticleAnimator";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { AnimationElements } from "../../animators/data/AnimationElements";
import { ParticleOrbitNode } from "../../animators/nodes/ParticleOrbitNode";
import { ParticleStateBase } from "../../animators/states/ParticleStateBase";
import { GL_RenderableBase } from "../../renderables/GL_RenderableBase";
import { ShaderBase } from "../../shaders/ShaderBase";
/**
 * ...
 */
export declare class ParticleOrbitState extends ParticleStateBase {
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
    setRenderState(shader: ShaderBase, renderable: GL_RenderableBase, animationElements: AnimationElements, animationRegisterData: AnimationRegisterData, camera: Camera, stage: Stage): void;
    private updateOrbitData();
}
