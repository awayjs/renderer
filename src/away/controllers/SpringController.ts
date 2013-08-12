///<reference path="../_definitions.ts" />

module away.controllers
{

	/**
	 * Uses spring physics to animate the target object towards a position that is
	 * defined as the lookAtTarget object's position plus the vector defined by the
	 * positionOffset property.
	 */
	export class SpringController extends LookAtController
	{
		private _velocity:away.geom.Vector3D;
		private _dv:away.geom.Vector3D;
		private _stretch:away.geom.Vector3D;
		private _force:away.geom.Vector3D;
		private _acceleration:away.geom.Vector3D;
		private _desiredPosition:away.geom.Vector3D;
		
		/**
		 * Stiffness of the spring, how hard is it to extend. The higher it is, the more "fixed" the cam will be.
		 * A number between 1 and 20 is recommended.
		 */
		public stiffness:number;
		
		/**
		 * Damping is the spring internal friction, or how much it resists the "boinggggg" effect. Too high and you'll lose it!
		 * A number between 1 and 20 is recommended.
		 */
		public damping:number;
		
		/**
		 * Mass of the camera, if over 120 and it'll be very heavy to move.
		 */
		public mass:number;
		
		/**
		 * Offset of spring center from target in target object space, ie: Where the camera should ideally be in the target object space.
		 */
		public positionOffset:away.geom.Vector3D = new away.geom.Vector3D(0, 500, -1000);
		
		constructor(targetObject:away.entities.Entity = null, lookAtObject:away.containers.ObjectContainer3D = null, stiffness:number = 1, mass:number = 40, damping:number = 4)
		{
			super(targetObject, lookAtObject);
			
			this.stiffness = stiffness;
			this.damping = damping;
			this.mass = mass;
			
			this._velocity = new away.geom.Vector3D();
            this._dv = new away.geom.Vector3D();
            this._stretch = new away.geom.Vector3D();
            this._force = new away.geom.Vector3D();
            this._acceleration = new away.geom.Vector3D();
            this._desiredPosition = new away.geom.Vector3D();
		
		}
		
		public update(interpolate:boolean = true)
		{
			interpolate = interpolate; // prevents unused warning
			
			var offs:away.geom.Vector3D;
			
			if (!this._pLookAtObject || !this._pTargetObject)
				return;
			
			offs = this._pLookAtObject.transform.deltaTransformVector(this.positionOffset);
            this._desiredPosition.x = this._pLookAtObject.x + offs.x;
            this._desiredPosition.y = this._pLookAtObject.y + offs.y;
            this._desiredPosition.z = this._pLookAtObject.z + offs.z;

            this._stretch.x = this._pTargetObject.x - this._desiredPosition.x;
            this._stretch.y = this._pTargetObject.y - this._desiredPosition.y;
            this._stretch.z = this._pTargetObject.z - this._desiredPosition.z;
            this._stretch.scaleBy(-this.stiffness);

            this._dv.copyFrom(this._velocity);
            this._dv.scaleBy(this.damping);

            this._force.x = this._stretch.x - this._dv.x;
            this._force.y = this._stretch.y - this._dv.y;
            this._force.z = this._stretch.z - this._dv.z;

            this._acceleration.copyFrom(this._force);
            this._acceleration.scaleBy(1/this.mass);

            this._velocity.x += this._acceleration.x;
            this._velocity.y += this._acceleration.y;
            this._velocity.z += this._acceleration.z;

            this._pTargetObject.x += this._velocity.x;
            this._pTargetObject.y += this._velocity.y;
            this._pTargetObject.z += this._velocity.z;
			
			super.update();
		}
	}
}
