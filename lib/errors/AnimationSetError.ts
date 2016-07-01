import {ErrorBase}					from "@awayjs/core/lib/errors/ErrorBase";

export class AnimationSetError extends ErrorBase
{
	constructor(message:string)
	{
		super(message);
	}
}