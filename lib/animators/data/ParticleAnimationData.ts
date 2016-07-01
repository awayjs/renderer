import {ParticleData}						from "@awayjs/display/lib/animators/data/ParticleData";

/**
 * ...
 */
export class ParticleAnimationData
{
	public index:number;
	public startTime:number;
	public totalTime:number;
	public duration:number;
	public delay:number;
	public startVertexIndex:number;
	public numVertices:number;

	constructor(index:number, startTime:number, duration:number, delay:number, particle:ParticleData)
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