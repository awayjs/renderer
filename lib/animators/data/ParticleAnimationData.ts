import ParticleData						= require("awayjs-renderergl/lib/animators/data/ParticleData");

/**
 * ...
 */
class ParticleAnimationData
{
	public index:number /*uint*/;
	public startTime:number;
	public totalTime:number;
	public duration:number;
	public delay:number;
	public startVertexIndex:number /*uint*/;
	public numVertices:number /*uint*/;

	constructor(index:number /*uint*/, startTime:number, duration:number, delay:number, particle:ParticleData)
	{
		this.index = index;
		this.startTime = startTime;
		this.totalTime = duration + delay;
		this.duration = duration;
		this.delay = delay;
		this.startVertexIndex = particle.startVertexIndex;
		this.numVertices = particle.numVertices;
	}
}

export = ParticleAnimationData;