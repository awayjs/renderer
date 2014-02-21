///<reference path="../_definitions.ts"/>

module away.primitives
{
	export class LineSegment extends away.base.Segment
	{
		public TYPE:string = "line";

		constructor(v0:away.geom.Vector3D, v1:away.geom.Vector3D, color0:number = 0x333333, color1:number = 0x333333, thickness:number = 1)
		{
			super(v0, v1, null, color0, color1, thickness);
		}
	}
}