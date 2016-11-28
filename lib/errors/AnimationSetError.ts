import {ErrorBase} from "@awayjs/core";

export class AnimationSetError extends ErrorBase
{
	constructor(message:string)
	{
		super(message);
	}
}