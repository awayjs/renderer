import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleOrbitState}				from "../../animators/states/ParticleOrbitState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to control the position of a particle over time around a circular orbit.
 */
export class ParticleOrbitNode extends ParticleNodeBase
{
	/** @private */
	public _iUsesEulers:boolean;

	/** @private */
	public _iUsesCycle:boolean;

	/** @private */
	public _iUsesPhase:boolean;

	/** @private */
	public _iRadius:number;
	/** @private */
	public _iCycleDuration:number;
	/** @private */
	public _iCyclePhase:number;
	/** @private */
	public _iEulers:Vector3D;

	/**
	 * Reference for orbit node properties on a single particle (when in local property mode).
	 * Expects a <code>Vector3D</code> object representing the radius (x), cycle speed (y) and cycle phase (z) of the motion on the particle.
	 */
	public static ORBIT_VECTOR3D:string = "OrbitVector3D";

	/**
	 * Creates a new <code>ParticleOrbitNode</code> object.
	 *
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param    [optional] usesEulers      Defines whether the node uses the <code>eulers</code> property in the shader to calculate a rotation on the orbit. Defaults to true.
	 * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the orbit independent of particle duration. Defaults to false.
	 * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
	 * @param    [optional] radius          Defines the radius of the orbit when in global mode. Defaults to 100.
	 * @param    [optional] cycleDuration   Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	 * @param    [optional] cyclePhase      Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	 * @param    [optional] eulers          Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
	 */
	constructor(mode:number, usesEulers:boolean = true, usesCycle:boolean = false, usesPhase:boolean = false, radius:number = 100, cycleDuration:number = 1, cyclePhase:number = 0, eulers:Vector3D = null)
	{
		var len:number = 3;
		if (usesPhase)
			len++;
		super("ParticleOrbit", mode, len);

		this._pStateClass = ParticleOrbitState;

		this._iUsesEulers = usesEulers;
		this._iUsesCycle = usesCycle;
		this._iUsesPhase = usesPhase;

		this._iRadius = radius;
		this._iCycleDuration = cycleDuration;
		this._iCyclePhase = cyclePhase;
		this._iEulers = eulers || new Vector3D();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var orbitRegister:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? registerCache.getFreeVertexConstant() : registerCache.getFreeVertexAttribute();
		animationRegisterData.setRegisterIndex(this, ParticleOrbitState.ORBIT_INDEX, orbitRegister.index);

		var eulersMatrixRegister:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		animationRegisterData.setRegisterIndex(this, ParticleOrbitState.EULERS_INDEX, eulersMatrixRegister.index);
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();

		var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(temp1, 1);
		var distance:ShaderRegisterElement = new ShaderRegisterElement(temp1.regName, temp1.index);

		var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var cos:ShaderRegisterElement = new ShaderRegisterElement(temp2.regName, temp2.index, 0);
		var sin:ShaderRegisterElement = new ShaderRegisterElement(temp2.regName, temp2.index, 1);
		var degree:ShaderRegisterElement = new ShaderRegisterElement(temp2.regName, temp2.index, 2);
		registerCache.removeVertexTempUsage(temp1);

		var code:string = "";

		if (this._iUsesCycle) {
			code += "mul " + degree + "," + animationRegisterData.vertexTime + "," + orbitRegister + ".y\n";

			if (this._iUsesPhase)
				code += "add " + degree + "," + degree + "," + orbitRegister + ".w\n";
		} else
			code += "mul " + degree + "," + animationRegisterData.vertexLife + "," + orbitRegister + ".y\n";

		code += "cos " + cos + "," + degree + "\n";
		code += "sin " + sin + "," + degree + "\n";
		code += "mul " + distance + ".x," + cos + "," + orbitRegister + ".x\n";
		code += "mul " + distance + ".y," + sin + "," + orbitRegister + ".x\n";
		code += "mov " + distance + ".wz" + animationRegisterData.vertexZeroConst + "\n";
		if (this._iUsesEulers)
			code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
		code += "add " + animationRegisterData.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterData.positionTarget + ".xyz\n";

		if (animationSet.needVelocity) {
			code += "neg " + distance + ".x," + sin + "\n";
			code += "mov " + distance + ".y," + cos + "\n";
			code += "mov " + distance + ".zw," + animationRegisterData.vertexZeroConst + "\n";
			if (this._iUsesEulers)
				code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
			code += "mul " + distance + "," + distance + "," + orbitRegister + ".z\n";
			code += "div " + distance + "," + distance + "," + orbitRegister + ".y\n";
			if (!this._iUsesCycle)
				code += "div " + distance + "," + distance + "," + animationRegisterData.vertexLife + "\n";
			code += "add " + animationRegisterData.velocityTarget + ".xyz," + animationRegisterData.velocityTarget + ".xyz," + distance + ".xyz\n";
		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleOrbitState
	{
		return <ParticleOrbitState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{
		//Vector3D.x is radius, Vector3D.y is cycle duration, Vector3D.z is phase
		var orbit:Vector3D = param[ParticleOrbitNode.ORBIT_VECTOR3D];
		if (!orbit)
			throw new Error("there is no " + ParticleOrbitNode.ORBIT_VECTOR3D + " in param!");

		this._pOneData[0] = orbit.x;
		if (this._iUsesCycle && orbit.y <= 0)
			throw(new Error("the cycle duration must be greater than zero"));
		this._pOneData[1] = Math.PI*2/(!this._iUsesCycle? 1 : orbit.y);
		this._pOneData[2] = orbit.x*Math.PI*2;
		if (this._iUsesPhase)
			this._pOneData[3] = orbit.z*Math.PI/180;
	}
}