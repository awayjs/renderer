import {PlaneClassification, Plane3D} from "@awayjs/core";

import {BoundingVolumeBase} from "../bounds/BoundingVolumeBase";

export class NullBounds extends BoundingVolumeBase
{

	//@override
	public isInFrustum(planes:Array<Plane3D>, numPlanes:number):boolean
	{
		return true;
	}

	public classifyToPlane(plane:Plane3D):number
	{
		return PlaneClassification.INTERSECT;
	}
}