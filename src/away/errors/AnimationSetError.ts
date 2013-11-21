module away.errors
{

	export class AnimationSetError extends Error
	{
		constructor(message:string)
		{
			super(message);
		}
	}
}
