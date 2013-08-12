///<reference path="../_definitions.ts" />

module away.controllers
{

	/**
	 * Controller used to follow behind an object on the XZ plane, with an optional
	 * elevation (tiltAngle).
	 *
	 * @see    away3d.containers.View3D
	 */
	export class FollowController extends away.controllers.HoverController
	{
		constructor(targetObject:away.entities.Entity = null, lookAtObject:away.containers.ObjectContainer3D = null, tiltAngle:number = 45, distance:number = 700)
		{
			super(targetObject, lookAtObject, 0, tiltAngle, distance);
		}
		
		public update(interpolate:boolean = true)
		{
			interpolate = interpolate; // unused: prevents warning
			
			if (!this.lookAtObject)
				return;

            this.panAngle = this._pLookAtObject.rotationY - 180;
			super.update();
		}
	}
}
