import {AnimatorBase}						from "../../animators/AnimatorBase";
import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticlePropertiesMode}			from "../../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../../animators/nodes/ParticleNodeBase";
import {ParticleRotateToHeadingState}		from "../../animators/states/ParticleRotateToHeadingState";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}			from "../../shaders/ShaderRegisterElement";

/**
 * A particle animation node used to control the rotation of a particle to match its heading vector.
 */
export class ParticleRotateToHeadingNode extends ParticleNodeBase
{
	/**
	 * Creates a new <code>ParticleBillboardNode</code>
	 */
	constructor()
	{
		super("ParticleRotateToHeading", ParticlePropertiesMode.GLOBAL, 0, 3);

		this._pStateClass = ParticleRotateToHeadingState;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		var code:string = "";
		var len:number = animationRegisterData.rotationRegisters.length;
		var i:number;
		if (animationSet.hasBillboard) {
			var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp1, 1);
			var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(temp2, 1);
			var temp3:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

			var rotationMatrixRegister:ShaderRegisterElement = registerCache.getFreeVertexConstant();
			animationRegisterData.setRegisterIndex(this, ParticleRotateToHeadingState.MATRIX_INDEX, rotationMatrixRegister.index);
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();

			registerCache.removeVertexTempUsage(temp1);
			registerCache.removeVertexTempUsage(temp2);

			//process the velocity
			code += "m33 " + temp1 + ".xyz," + animationRegisterData.velocityTarget + ".xyz," + rotationMatrixRegister + "\n";

			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
			code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";

			//temp3.x=cos,temp3.y=sin
			//only process z axis
			code += "mov " + temp2 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp2 + ".x," + temp3 + ".y\n";
			code += "mov " + temp2 + ".y," + temp3 + ".x\n";
			code += "mov " + temp1 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp1 + ".x," + temp3 + ".x\n";
			code += "neg " + temp1 + ".y," + temp3 + ".y\n";
			code += "mov " + temp3 + "," + animationRegisterData.vertexZeroConst + "\n";
			code += "mov " + temp3 + ".z," + animationRegisterData.vertexOneConst + "\n";
			code += "m33 " + animationRegisterData.scaleAndRotateTarget + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
			for (i = 0; i < len; i++)
				code += "m33 " + animationRegisterData.rotationRegisters[i] + ".xyz," + animationRegisterData.rotationRegisters[i] + "," + temp1 + "\n";
		} else {
			var nrmVel:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(nrmVel, 1);

			var xAxis:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(xAxis, 1);

			var R:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(R, 1);
			var R_rev:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			var cos:ShaderRegisterElement = new ShaderRegisterElement(R.regName, R.index, 3);
			var sin:ShaderRegisterElement = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);
			var cos2:ShaderRegisterElement = new ShaderRegisterElement(nrmVel.regName, nrmVel.index, 3);
			var tempSingle:ShaderRegisterElement = sin;

			registerCache.removeVertexTempUsage(nrmVel);
			registerCache.removeVertexTempUsage(xAxis);
			registerCache.removeVertexTempUsage(R);

			code += "mov " + xAxis + ".x," + animationRegisterData.vertexOneConst + "\n";
			code += "mov " + xAxis + ".yz," + animationRegisterData.vertexZeroConst + "\n";

			code += "nrm " + nrmVel + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
			code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
			code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
			code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
			//use R as temp to judge if nrm is (0,0,0).
			//if nrm is (0,0,0) ,change it to (0,0,1).
			code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
			code += "sge " + R + ".x," + animationRegisterData.vertexZeroConst + "," + R + ".x\n";
			code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";

			code += "add " + tempSingle + "," + cos2 + "," + animationRegisterData.vertexOneConst + "\n";
			code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
			code += "sqt " + cos + "," + tempSingle + "\n";

			code += "sub " + tempSingle + "," + animationRegisterData.vertexOneConst + "," + cos2 + "\n";
			code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
			code += "sqt " + sin + "," + tempSingle + "\n";

			code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";

			//use cos as R.w

			code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
			code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";

			//use cos as R_rev.w

			//nrmVel and xAxis are used as temp register
			code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";

			//use cos as R.w
			code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
			code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
			code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterData.scaleAndRotateTarget + ".xyz\n";
			code += "neg " + nrmVel + ".w," + xAxis + ".w\n";

			code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
			//code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," +R_rev + ".w\n";
			code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
			code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
			code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";

			code += "add " + animationRegisterData.scaleAndRotateTarget + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";

			for (i = 0; i < len; i++) {
				//just repeat the calculate above
				//because of the limited registers, no need to optimise
				code += "mov " + xAxis + ".x," + animationRegisterData.vertexOneConst + "\n";
				code += "mov " + xAxis + ".yz," + animationRegisterData.vertexZeroConst + "\n";
				code += "nrm " + nrmVel + ".xyz," + animationRegisterData.velocityTarget + ".xyz\n";
				code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
				code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
				code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
				code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
				code += "sge " + R + ".x," + animationRegisterData.vertexZeroConst + "," + R + ".x\n";
				code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";
				code += "add " + tempSingle + "," + cos2 + "," + animationRegisterData.vertexOneConst + "\n";
				code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
				code += "sqt " + cos + "," + tempSingle + "\n";
				code += "sub " + tempSingle + "," + animationRegisterData.vertexOneConst + "," + cos2 + "\n";
				code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterData.vertexTwoConst + "\n";
				code += "sqt " + sin + "," + tempSingle + "\n";
				code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";
				code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
				code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
				code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
				code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
				code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
				code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterData.rotationRegisters[i] + ".xyz\n";
				code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
				code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
				code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
				code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
				code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
				code += "add " + animationRegisterData.rotationRegisters[i] + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
			}

		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAnimationState(animator:AnimatorBase):ParticleRotateToHeadingState
	{
		return <ParticleRotateToHeadingState> animator.getAnimationState(this);
	}

	/**
	 * @inheritDoc
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet):void
	{
		particleAnimationSet.needVelocity = true;
	}
}