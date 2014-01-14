///<reference path="../../_definitions.ts"/>

/**
 * @module away.base
 */
module away.base
{
	/**
	 * @class away.base.ParticleGeometry
	 */
	export class ParticleGeometry extends Geometry
	{
		public particles:Array<away.animators.ParticleData>;
		
		public numParticles:number /*uint*/;
	
	}

}
