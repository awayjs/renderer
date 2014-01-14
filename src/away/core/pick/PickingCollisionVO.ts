///<reference path="../../_definitions.ts"/>
/**
 * @module away.pick
 */
module away.pick
{

	/**
	 * Value object for a picking collision returned by a picking collider. Created as unique objects on entities
	 *
	 * @see away3d.entities.Entity#pickingCollisionVO
	 * @see away3d.core.pick.IPickingCollider
	 *
	 * @class away.pick.PickingCollisionVO
	 */
	export class PickingCollisionVO
	{
		/**
		 * The entity to which this collision object belongs.
		 */
		public entity:away.entities.Entity;

		/**
		 * The local position of the collision on the entity's surface.
		 */
		public localPosition:away.geom.Vector3D;

		/**
		 * The local normal vector at the position of the collision.
		 */
		public localNormal:away.geom.Vector3D;

		/**
		 * The uv coordinate at the position of the collision.
		 */
		public uv:away.geom.Point;

		/**
		 * The index of the face where the event took pl ace.
		 */
		public index:number;

		/**
		 * The index of the subGeometry where the event took place.
		 */
		public subGeometryIndex:number;

		/**
		 * The starting position of the colliding ray in local coordinates.
		 */
		public localRayPosition:away.geom.Vector3D;

		/**
		 * The direction of the colliding ray in local coordinates.
		 */
		public localRayDirection:away.geom.Vector3D;

		/**
		 * The starting position of the colliding ray in scene coordinates.
		 */
		public rayPosition:away.geom.Vector3D;

		/**
		 * The direction of the colliding ray in scene coordinates.
		 */
		public rayDirection:away.geom.Vector3D;

		/**
		 * Determines if the ray position is contained within the entity bounds.
		 *
		 * @see away3d.entities.Entity#bounds
		 */
		public rayOriginIsInsideBounds:boolean;

		/**
		 * The distance along the ray from the starting position to the calculated intersection entry point with the entity.
		 */
		public rayEntryDistance:number;

		/**
		 * The IRenderable associated with a collision.
		 */
		public renderable:away.base.IRenderable;

		/**
		 * Creates a new <code>PickingCollisionVO</code> object.
		 *
		 * @param entity The entity to which this collision object belongs.
		 */
		constructor(entity:away.entities.Entity)
		{
			this.entity = entity;
		}

	}
}
