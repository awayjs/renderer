///<reference path="../_definitions.ts"/>

module away.errors
{

	export class CastError extends Error
	{
		constructor(message:string)
		{
			super(message);
		}
	}
}
