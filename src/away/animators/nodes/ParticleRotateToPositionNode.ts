///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Vector3D						= away.geom.Vector3D;
	import ShaderObjectBase				= away.materials.ShaderObjectBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	/**
	 * A particle animation node used to control the rotation of a particle to face to a position
	 */
	export class ParticleRotateToPositionNode extends ParticleNodeBase
	{
		/** @private */
		public static MATRIX_INDEX:number /*int*/ = 0;
		/** @private */
		public static POSITION_INDEX:number /*int*/ = 1;
		
		/** @private */
		public _iPosition:Vector3D;
		
		/**
		 * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
		 * Expects a <code>Vector3D</code> object representing the position that the particle must face.
		 */
		public static POSITION_VECTOR3D:string = "RotateToPositionVector3D";
		
		/**
		 * Creates a new <code>ParticleRotateToPositionNode</code>
		 */
		constructor(mode:number /*uint*/, position:Vector3D = null)
		{
			super("ParticleRotateToPosition", mode, 3, 3);
			
			this._pStateClass = ParticleRotateToPositionState;
			
			this._iPosition = position || new Vector3D();
		}
		
		/**
		 * @inheritDoc
		 */
		public getAGALVertexCode(shaderObject:ShaderObjectBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var positionAttribute:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
			animationRegisterCache.setRegisterIndex(this, ParticleRotateToPositionNode.POSITION_INDEX, positionAttribute.index);
			
			var code:string = "";
			var len:number /*int*/ = animationRegisterCache.rotationRegisters.length;
			var i:number /*int*/;
			if (animationRegisterCache.hasBillboard) {
				var temp1:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(temp1, 1);
				var temp2:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(temp2, 1);
				var temp3:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				
				var rotationMatrixRegister:ShaderRegisterElement = animationRegisterCache.getFreeVertexConstant();
				animationRegisterCache.setRegisterIndex(this, ParticleRotateToPositionNode.MATRIX_INDEX, rotationMatrixRegister.index);
				animationRegisterCache.getFreeVertexConstant();
				animationRegisterCache.getFreeVertexConstant();
				animationRegisterCache.getFreeVertexConstant();
				
				animationRegisterCache.removeVertexTempUsage(temp1);
				animationRegisterCache.removeVertexTempUsage(temp2);
				
				//process the position
				code += "sub " + temp1 + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
				code += "m33 " + temp1 + ".xyz," + temp1 + ".xyz," + rotationMatrixRegister + "\n";
				
				code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
				code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";
				
				//temp3.x=cos,temp3.y=sin
				//only process z axis
				code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp2 + ".x," + temp3 + ".y\n";
				code += "mov " + temp2 + ".y," + temp3 + ".x\n";
				code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp1 + ".x," + temp3 + ".x\n";
				code += "neg " + temp1 + ".y," + temp3 + ".y\n";
				code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
				code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
				for (i = 0; i < len; i++)
					code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
			} else {
				var nrmDirection:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(nrmDirection, 1);
				
				var temp:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(temp, 1);
				var cos:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 0);
				var sin:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 1);
				var o_temp:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 2);
				var tempSingle:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, 3);
				
				var R:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
				animationRegisterCache.addVertexTempUsages(R, 1);
				
				animationRegisterCache.removeVertexTempUsage(nrmDirection);
				animationRegisterCache.removeVertexTempUsage(temp);
				animationRegisterCache.removeVertexTempUsage(R);
				
				code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
				code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
				
				code += "mov " + sin + "," + nrmDirection + ".y\n";
				code += "mul " + cos + "," + sin + "," + sin + "\n";
				code += "sub " + cos + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
				code += "sqt " + cos + "," + cos + "\n";
				
				code += "mul " + R + ".x," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".y\n";
				code += "mul " + R + ".y," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
				code += "mul " + R + ".z," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".y\n";
				code += "mul " + R + ".w," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
				
				code += "sub " + animationRegisterCache.scaleAndRotateTarget + ".y," + R + ".x," + R + ".y\n";
				code += "add " + animationRegisterCache.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";
				
				code += "abs " + R + ".y," + nrmDirection + ".y\n";
				code += "sge " + R + ".z," + R + ".y," + animationRegisterCache.vertexOneConst + "\n";
				code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
				
				//judgu if nrmDirection=(0,1,0);
				code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
				code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
				code += "sge " + tempSingle + "," + animationRegisterCache.vertexZeroConst + "," + sin + "\n";
				
				code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
				code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
				
				code += "sub " + sin + "," + animationRegisterCache.vertexOneConst + "," + tempSingle + "\n";
				code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
				
				code += "mov " + cos + "," + nrmDirection + ".z\n";
				code += "neg " + cos + "," + cos + "\n";
				code += "sub " + o_temp + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
				code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
				code += "add " + cos + "," + cos + "," + o_temp + "\n";
				
				code += "mul " + R + ".x," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".x\n";
				code += "mul " + R + ".y," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
				code += "mul " + R + ".z," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".x\n";
				code += "mul " + R + ".w," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
				
				code += "sub " + animationRegisterCache.scaleAndRotateTarget + ".x," + R + ".x," + R + ".y\n";
				code += "add " + animationRegisterCache.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";
				
				for (i = 0; i < len; i++) {
					//just repeat the calculate above
					//because of the limited registers, no need to optimise
					code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
					code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
					code += "mov " + sin + "," + nrmDirection + ".y\n";
					code += "mul " + cos + "," + sin + "," + sin + "\n";
					code += "sub " + cos + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
					code += "sqt " + cos + "," + cos + "\n";
					code += "mul " + R + ".x," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".y\n";
					code += "mul " + R + ".y," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
					code += "mul " + R + ".z," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".y\n";
					code += "mul " + R + ".w," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
					code += "sub " + animationRegisterCache.rotationRegisters[i] + ".y," + R + ".x," + R + ".y\n";
					code += "add " + animationRegisterCache.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
					code += "abs " + R + ".y," + nrmDirection + ".y\n";
					code += "sge " + R + ".z," + R + ".y," + animationRegisterCache.vertexOneConst + "\n";
					code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
					code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
					code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
					code += "sge " + tempSingle + "," + animationRegisterCache.vertexZeroConst + "," + sin + "\n";
					code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
					code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
					code += "sub " + sin + "," + animationRegisterCache.vertexOneConst + "," + tempSingle + "\n";
					code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
					code += "mov " + cos + "," + nrmDirection + ".z\n";
					code += "neg " + cos + "," + cos + "\n";
					code += "sub " + o_temp + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
					code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
					code += "add " + cos + "," + cos + "," + o_temp + "\n";
					code += "mul " + R + ".x," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".x\n";
					code += "mul " + R + ".y," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
					code += "mul " + R + ".z," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".x\n";
					code += "mul " + R + ".w," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
					code += "sub " + animationRegisterCache.rotationRegisters[i] + ".x," + R + ".x," + R + ".y\n";
					code += "add " + animationRegisterCache.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
				}
			}
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public getAnimationState(animator:AnimatorBase):ParticleRotateToPositionState
		{
			return <ParticleRotateToPositionState> animator.getAnimationState(this);
		}
		
		/**
		 * @inheritDoc
		 */
		public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
		{
			var offset:Vector3D = param[ParticleRotateToPositionNode.POSITION_VECTOR3D];
			if (!offset)
				throw(new Error("there is no " + ParticleRotateToPositionNode.POSITION_VECTOR3D + " in param!"));
			
			this._pOneData[0] = offset.x;
			this._pOneData[1] = offset.y;
			this._pOneData[2] = offset.z;
		}
	}
}
