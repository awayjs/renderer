import Geometry							= require("awayjs-display/lib/base/Geometry");

import ParticleData						= require("awayjs-renderergl/lib/animators/data/ParticleData");

/**
 * @class away.base.ParticleGeometry
 */
class ParticleGeometry extends Geometry
{
	public particles:Array<ParticleData>;

	public numParticles:number /*uint*/;

}

export = ParticleGeometry;