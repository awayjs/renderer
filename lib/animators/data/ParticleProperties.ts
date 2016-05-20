/**
 * Dynamic class for holding the local properties of a particle, used for processing the static properties
 * of particles in the particle animation set before beginning upload to the GPU.
 */
export class ParticleProperties
{
	/**
	 * The index of the current particle being set.
	 */
	public index:number;

	/**
	 * The total number of particles being processed by the particle animation set.
	 */
	public total:number;

	/**
	 * The start time of the particle.
	 */
	public startTime:number;

	/**
	 * The duration of the particle, an optional value used when the particle aniamtion set settings for <code>useDuration</code> are enabled in the constructor.
	 *
	 * @see away.animators.ParticleAnimationSet
	 */
	public duration:number;

	/**
	 * The delay between cycles of the particle, an optional value used when the particle aniamtion set settings for <code>useLooping</code> and  <code>useDelay</code> are enabled in the constructor.
	 *
	 * @see away.animators.ParticleAnimationSet
	 */
	public delay:number;
}