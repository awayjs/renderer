import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleBezierCurveState}			from "../../animators/states/ParticleBezierCurveState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";
/**
 * A particle animation node used to control the position of a particle over time along a bezier curve.
 */
export class ParticleBezierCurveNode extends ParticleNodeBase
{
	/** @private */
	public _iControlPoint:Vector3D;
	/** @private */
	public _iEndPoint:Vector3D;

	/**
	 * Reference for bezier curve node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the control point position (0, 1, 2) of the curve.
	 */
	public static BEZIER_CONTROL_VECTOR3D:string = "BezierControlVector3D";

	/**
	 * Reference for bezier curve node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the end point position (0, 1, 2) of the curve.
	 */
	public static BEZIER_END_VECTOR3D:string = "BezierEndVector3D";

	/**
	 * Creates a new <code>ParticleBezierCurveNode</code>
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
	 * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
	 */
	constructor(mode:number, controlPoint:Vector3D = null, endPoint:Vector3D = null)
	{
		super("ParticleBezierCurve", mode, 6);

		this._pStateClass = ParticleBezierCurveState;

		this._iControlPoint = controlPoint || new Vector3D();
		this._iEndPoint = endPoint || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var controlValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleBezierCurveState.BEZIER_CONTROL_INDEX, controlValue.index);

		var endValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleBezierCurveState.BEZIER_END_INDEX, endValue.index);

		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var rev_time:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
		var time_2:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);
		var time_temp:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 2);
		registerCache.addVertexTempUsages(temp, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var distance:ShaderRegisterElement = new ShaderRegisterElement(temp2.regName, temp2.index);
		registerCache.removeVertexTempUsage(temp);

		var code:string = "";
		code += "sub " + rev_time + "," + animationRegisterData.vertexOneConst + "," + animationRegisterData.vertexLife + "\n";
		code += "mul " + time_2 + "," + animationRegisterData.vertexLife + "," + animationRegisterData.vertexLife + "\n";

		code += "mul " + time_temp + "," + animationRegisterData.vertexLife + "," + rev_time + "\n";
		code += "mul " + time_temp + "," + time_temp + "," + animationRegisterData.vertexTwoConst + "\n";
		code += "mul " + distance + ".xyz," + time_temp + "," + controlValue + "\n";
		code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";
		code += "mul " + distance + ".xyz," + time_2 + "," + endValue + "\n";
		code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";

		if (animationSet.needVelocity) {
			code += "mul " + time_2 + "," + animationRegisterData.vertexLife + "," + animationRegisterData.vertexTwoConst + "\n";
			code += "sub " + time_temp + "," + animationRegisterData.vertexOneConst + "," + time_2 + "\n";
			code += "mul " + time_temp + "," + animationRegisterData.vertexTwoConst + "," + time_temp + "\n";
			code += "mul " + distance + ".xyz," + controlValue + "," + time_temp + "\n";
			code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
			code += "mul " + distance + ".xyz," + endValue + "," + time_2 + "\n";
			code += "add " + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleBezierCurveState
	{
		return <ParticleBezierCurveState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		var bezierControl:Vector3D = param[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D];
		if (!bezierControl)
			throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D + " in param!");

		var bezierEnd:Vector3D = param[ParticleBezierCurveNode.BEZIER_END_VECTOR3D];
		if (!bezierEnd)
			throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_END_VECTOR3D + " in param!");

		this._pOneData[0] = bezierControl.x;
		this._pOneData[1] = bezierControl.y;
		this._pOneData[2] = bezierControl.z;
		this._pOneData[3] = bezierEnd.x;
		this._pOneData[4] = bezierEnd.y;
		this._pOneData[5] = bezierEnd.z;
	}
}