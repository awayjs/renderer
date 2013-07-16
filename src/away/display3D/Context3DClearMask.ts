/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.display3D
{
	export class Context3DClearMask
	{
		static COLOR: number = 8 << 11;
		static DEPTH: number = 8 << 5;
		static STENCIL: number = 8 << 7;
		static ALL: number = Context3DClearMask.COLOR | Context3DClearMask.DEPTH | Context3DClearMask.STENCIL;
	}
}