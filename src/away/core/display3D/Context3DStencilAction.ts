///<reference path="../../_definitions.ts"/>
module away.display3D
{
	export class Context3DStencilAction
	{
		public static DECREMENT_SATURATE:string = "decrementSaturate";
		public static DECREMENT_WRAP:string = "decrementWrap";
		public static INCREMENT_SATURATE:string = "incrementSaturate";
		public static INCREMENT_WRAP:string = "incrementWrap";
		public static INVERT:string = "invert";
		public static KEEP:string = "keep";
		public static SET:string = "set";
		public static ZERO:string = "zero";
	}
}