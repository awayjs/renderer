///<reference path="../_definitions.ts"/>
/**
 * @module away.events
 */
module away.events
{
	export class LensEvent extends away.events.Event
	{
		public static MATRIX_CHANGED:string = "matrixChanged";

		private _lens:away.cameras.LensBase;

		constructor(type:string, lens:away.cameras.LensBase)
		{
			super(type);
			this._lens = lens;
		}

		public get lens():away.cameras.LensBase
		{
			return this._lens;
		}
	}
}