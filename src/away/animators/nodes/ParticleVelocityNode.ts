///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Vector3D						= away.geom.Vector3D;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	/**
	 * A particle animation node used to set the starting velocity of a particle.
	 */
	export class ParticleVelocityNode extends ParticleNodeBase
	{
		/** @private */
		public static VELOCITY_INDEX:number /*int*/ = 0;
		
		/** @private */
		public _iVelocity:Vector3D;
		
		/**
		 * Reference for velocity node properties on a single particle (when in local property mode).
		 * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
		 */
		public static VELOCITY_VECTOR3D:string = "VelocityVector3D";
		
		/**
		 * Creates a new <code>ParticleVelocityNode</code>
		 *
		 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
		 * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
		 */
		constructor(mode:number /*uint*/, velocity:Vector3D = null)
		{
			super("ParticleVelocity", mode, 3);
			
			this._pStateClass = ParticleVelocityState;
			
			this._iVelocity = velocity || new Vector3D();
		}
		
		/**
		 * @inheritDoc
		 */
		public getAGALVertexCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var velocityValue:ShaderRegisterElement = (this._pMode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
			animationRegisterCache.setRegisterIndex(this, ParticleVelocityNode.VELOCITY_INDEX, velocityValue.index);
			
			var distance:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
			var code:string = "";
			code += "mul " + distance + "," + animationRegisterCache.vertexTime + "," + velocityValue + "\n";
			code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + "," + animationRegisterCache.positionTarget + ".xyz\n";
			
			if (animationRegisterCache.needVelocity)
				code += "add " + animationRegisterCache.velocityTarget + ".xyz," + velocityValue + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public getAnimationState(animator:AnimatorBase):ParticleVelocityState
		{
			return <ParticleVelocityState> animator.getAnimationState(this);
		}
		
		/**
		 * @inheritDoc
		 */
		public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
		{
			var _tempVelocity:Vector3D = param[ParticleVelocityNode.VELOCITY_VECTOR3D];
			if (!_tempVelocity)
				throw new Error("there is no " + ParticleVelocityNode.VELOCITY_VECTOR3D + " in param!");
			
			this._pOneData[0] = _tempVelocity.x;
			this._pOneData[1] = _tempVelocity.y;
			this._pOneData[2] = _tempVelocity.z;
		}
	}
}
