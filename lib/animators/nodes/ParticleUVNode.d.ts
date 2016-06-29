import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleUVState } from "../../animators/states/ParticleUVState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the UV offset and scale of a particle over time.
 */
export declare class ParticleUVNode extends ParticleNodeBase {
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
    getAGALUVCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
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
