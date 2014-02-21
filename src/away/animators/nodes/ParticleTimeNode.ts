///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Vector3D						= away.geom.Vector3D;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import ShaderRegisterElement		= away.materials.ShaderRegisterElement;
	
	/**
	 * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
	 */
	export class ParticleTimeNode extends ParticleNodeBase
	{
		/** @private */
		public static TIME_STREAM_INDEX:number /*uint*/ = 0;
		
		/** @private */
		public static TIME_CONSTANT_INDEX:number /*uint*/ = 1;
		
		/** @private */
		public _iUsesDuration:boolean;
		/** @private */
		public _iUsesDelay:boolean;
		/** @private */
		public _iUsesLooping:boolean;
		
		/**
		 * Creates a new <code>ParticleTimeNode</code>
		 *
		 * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
		 * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
		 * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
		 */
		constructor(usesDuration:boolean = false, usesLooping:boolean = false, usesDelay:boolean = false)
		{
			this._pStateClass = ParticleTimeState;
			
			this._iUsesDuration = usesDuration;
			this._iUsesLooping = usesLooping;
			this._iUsesDelay = usesDelay;
			
			super("ParticleTime", ParticlePropertiesMode.LOCAL_STATIC, 4, 0);
		}
		
		/**
		 * @inheritDoc
		 */
		public getAGALVertexCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache):string
		{
			var timeStreamRegister:ShaderRegisterElement = animationRegisterCache.getFreeVertexAttribute(); //timeStreamRegister.x is start，timeStreamRegister.y is during time
			animationRegisterCache.setRegisterIndex(this, ParticleTimeNode.TIME_STREAM_INDEX, timeStreamRegister.index);
			var timeConst:ShaderRegisterElement = animationRegisterCache.getFreeVertexConstant();
			animationRegisterCache.setRegisterIndex(this, ParticleTimeNode.TIME_CONSTANT_INDEX, timeConst.index);
			
			var code:string = "";
			code += "sub " + animationRegisterCache.vertexTime + "," + timeConst + "," + timeStreamRegister + ".x\n";
			//if time=0,set the position to zero.
			var temp:ShaderRegisterElement = animationRegisterCache.getFreeVertexSingleTemp();
			code += "sge " + temp + "," + animationRegisterCache.vertexTime + "," + animationRegisterCache.vertexZeroConst + "\n";
			code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";
			if (this._iUsesDuration) {
				if (this._iUsesLooping) {
					var div:ShaderRegisterElement = animationRegisterCache.getFreeVertexSingleTemp();
					if (this._iUsesDelay) {
						code += "div " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".z\n";
						code += "frc " + div + "," + div + "\n";
						code += "mul " + animationRegisterCache.vertexTime + "," + div + "," + timeStreamRegister + ".z\n";
						code += "slt " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".y\n";
						code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + div + "\n";
					} else {
						code += "mul " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".w\n";
						code += "frc " + div + "," + div + "\n";
						code += "mul " + animationRegisterCache.vertexTime + "," + div + "," + timeStreamRegister + ".y\n";
					}
				} else {
					var sge:ShaderRegisterElement = animationRegisterCache.getFreeVertexSingleTemp();
					code += "sge " + sge + "," + timeStreamRegister + ".y," + animationRegisterCache.vertexTime + "\n";
					code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + sge + "\n";
				}
			}
			code += "mul " + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".w\n";
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public getAnimationState(animator:AnimatorBase):ParticleTimeState
		{
			return <ParticleTimeState> animator.getAnimationState(this);
		}
		
		/**
		 * @inheritDoc
		 */
		public _iGeneratePropertyOfOneParticle(param:ParticleProperties)
		{
			this._pOneData[0] = param.startTime;
			this._pOneData[1] = param.duration;
			this._pOneData[2] = param.delay + param.duration;
			this._pOneData[3] = 1/param.duration;
		
		}
	}
}
