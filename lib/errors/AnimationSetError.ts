import ErrorBase					from "awayjs-core/lib/errors/ErrorBase";

class AnimationSetError extends ErrorBase
{
	constructor(message:string)
	{
		super(message);
	}
}

export default AnimationSetError;