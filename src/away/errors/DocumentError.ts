///<reference path="../_definitions.ts"/>

module away.errors
{

	export class DocumentError extends Error
	{
		public static DOCUMENT_DOES_NOT_EXIST:string = "documentDoesNotExist";

		constructor(message:string = "DocumentError", id:number = 0)
		{
			super(message, id);
		}
	}
}