///<reference path="../_definitions.ts"/>
/**
 * @module away.events
 */
module away.events
{
	export class ResizeEvent extends away.events.Event
	{

		public static RESIZE:string = "resize";

		private _oldHeight:number;
		private _oldWidth:number;

		constructor(type:string, oldHeight:number = NaN, oldWidth:number = NaN)
		{
			super(type);
			this._oldHeight = oldHeight;
			this._oldWidth = oldWidth;
		}

		public get oldHeight():number
		{
			return this._oldHeight;
		}

		public get oldWidth():number
		{
			return this._oldWidth;
		}
	}
}