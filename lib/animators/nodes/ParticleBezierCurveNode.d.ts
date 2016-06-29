import { Vector3D } from "@awayjs/core/lib/geom/Vector3D";
import { AnimatorBase } from "../../animators/AnimatorBase";
import { ParticleAnimationSet } from "../../animators/ParticleAnimationSet";
import { AnimationRegisterData } from "../../animators/data/AnimationRegisterData";
import { ParticleProperties } from "../../animators/data/ParticleProperties";
import { ParticleNodeBase } from "../../animators/nodes/ParticleNodeBase";
import { ParticleBezierCurveState } from "../../animators/states/ParticleBezierCurveState";
import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
/**
 * A particle animation node used to control the position of a particle over time along a bezier curve.
 */
export declare class ParticleBezierCurveNode extends ParticleNodeBase {
    /** @private */
    _iControlPoint: Vector3D;
    /** @private */
    _iEndPoint: Vector3D;
    /**
     * Reference for bezier curve node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the control point position (0, 1, 2) of the curve.
     */
    static BEZIER_CONTROL_VECTOR3D: string;
    /**
     * Reference for bezier curve node properties on a single particle (when in local property mode).
     * Expects a <code>Vector3D</code> object representing the end point position (0, 1, 2) of the curve.
     */
    static BEZIER_END_VECTOR3D: string;
    /**
     * Creates a new <code>ParticleBezierCurveNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
     * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
     */
    constructor(mode: number, controlPoint?: Vector3D, endPoint?: Vector3D);
    /**
     * @inheritDoc
     */
    getAGALVertexCode(shader: ShaderBase, animationSet: ParticleAnimationSet, registerCache: ShaderRegisterCache, animationRegisterData: AnimationRegisterData): string;
    /**
     * @inheritDoc
     */
    getAnimationState(animator: AnimatorBase): ParticleBezierCurveState;
    /**
     * @inheritDoc
     */
    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
}
