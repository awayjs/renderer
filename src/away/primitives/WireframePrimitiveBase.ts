/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../entities/SegmentSet.ts" />

module away.primitives
{
	export class WireframePrimitiveBase extends away.entities.SegmentSet
	{
		private _geomDirty:boolean = true;
		private _color:number;
		private _thickness:number;
		
		constructor( color:number = 0xffffff, thickness:number = 1 )
		{
			super();
			if( thickness <= 0 )
			{
				thickness = 1;
			}
			this._color = color;
			this._thickness = thickness;
			//mouseEnabled = mouseChildren = false;
		}
	}
}