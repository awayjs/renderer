import Error						= require("awayjs-core/lib/errors/Error");

class AnimationSetError extends Error
{
	constructor(message:string)
	{
		super(message);
	}
}

export = AnimationSetError;