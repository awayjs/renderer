///<reference path="../../_definitions.ts"/>

/**
 * @module away.pick
 */
module away.pick
{
	/**
	 * Picks a 3d object from a view or scene by 3D raycast calculations.
	 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
	 * then triggers an optional picking collider on individual entity objects to further determine the precise values of the picking ray collision.
	 *
	 * @class away.pick.RaycastPicker
	 */
	export class RaycastPicker implements IPicker
	{
		private _findClosestCollision:boolean;
		private _raycastCollector:away.traverse.RaycastCollector;
		private _ignoredEntities = [];
		private _onlyMouseEnabled:boolean = true;

		private _entities:Array<away.entities.IEntity>;
		private _numEntities:number = 0;
		private _hasCollisions:boolean;

		/**
		 * @inheritDoc
		 */
		public get onlyMouseEnabled():boolean
		{
			return this._onlyMouseEnabled;
		}

		public set onlyMouseEnabled(value:boolean)
		{
			this._onlyMouseEnabled = value;
		}

		/**
		 * Creates a new <code>RaycastPicker</code> object.
		 *
		 * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
		 * or simply returns the first collision encountered Defaults to false.
		 */
		constructor(findClosestCollision:boolean)
		{
			this._raycastCollector = new away.traverse.RaycastCollector();

			this._findClosestCollision = findClosestCollision;
			this._entities = new Array<away.entities.IEntity>();
		}

		/**
		 * @inheritDoc
		 */
		public getViewCollision(x:number, y:number, view:away.containers.View):PickingCollisionVO
		{

			//cast ray through the collection of entities on the view
			var collector:away.traverse.EntityCollector = <away.traverse.EntityCollector> view.iEntityCollector;
			//var i:number;

			if (collector.numInteractiveEntities == 0)
				return null;

			//update ray
			var rayPosition:away.geom.Vector3D = view.unproject(x, y, 0);
			var rayDirection:away.geom.Vector3D = view.unproject(x, y, 1);
			rayDirection = rayDirection.subtract(rayPosition);

			// Perform ray-bounds collision checks.
			this._numEntities = 0;
			var node:away.pool.EntityListItem = collector.entityHead;
			var entity:away.entities.IEntity;
			while (node) {
				entity = node.entity;

				if (this.isIgnored(entity)) {
					node = node.next;
					continue;
				}

				// If collision detected, store in new data set.
				if (entity._iIsVisible() && entity.isIntersectingRay(rayPosition, rayDirection))
					this._entities[this._numEntities++] = entity;

				node = node.next;
			}

			//early out if no collisions detected
			if (!this._numEntities)
				return null;

			return this.getPickingCollisionVO(collector);

		}

		//*/
		/**
		 * @inheritDoc
		 */

			//* TODO Implement Dependency: EntityListItem, EntityCollector, RaycastCollector
		public getSceneCollision(position:away.geom.Vector3D, direction:away.geom.Vector3D, scene:away.containers.Scene):PickingCollisionVO
		{

			//clear collector
			this._raycastCollector.clear();

			//setup ray vectors
			this._raycastCollector.rayPosition = position;
			this._raycastCollector.rayDirection = direction;

			// collect entities to test
			scene.traversePartitions(this._raycastCollector);

			this._numEntities = 0;
			var node:away.pool.EntityListItem = this._raycastCollector.entityHead;
			var entity:away.entities.IEntity;

			while (node) {
				entity = node.entity;

				if (this.isIgnored(entity)) {
					node = node.next;
					continue;
				}

				this._entities[this._numEntities++] = entity;

				node = node.next;
			}

			//early out if no collisions detected
			if (!this._numEntities)
				return null;

			return this.getPickingCollisionVO(this._raycastCollector);

		}

//		public getEntityCollision(position:away.geom.Vector3D, direction:away.geom.Vector3D, entities:Array<away.entities.IEntity>):PickingCollisionVO
//		{
//			this._numEntities = 0;
//
//			var entity:away.entities.IEntity;
//			var l:number = entities.length;
//
//			for (var c:number = 0; c < l; c++) {
//				entity = entities[c];
//
//				if (entity.isIntersectingRay(position, direction))
//					this._entities[this._numEntities++] = entity;
//			}
//
//			return this.getPickingCollisionVO(this._raycastCollector);
//		}

		public setIgnoreList(entities)
		{
			this._ignoredEntities = entities;
		}

		private isIgnored(entity:away.entities.IEntity):boolean
		{
			if (this._onlyMouseEnabled && entity._iIsMouseEnabled)
				return true;

			var ignoredEntity:away.entities.IEntity;

			var l:number = this._ignoredEntities.length;

			for (var c:number = 0; c < l; c++) {

				ignoredEntity = this._ignoredEntities[ c ];

				if (ignoredEntity == entity)
					return true;
			}

			return false;
		}

		private sortOnNearT(entity1:away.entities.IEntity, entity2:away.entities.IEntity):number
		{
			return entity1._iPickingCollisionVO.rayEntryDistance > entity2._iPickingCollisionVO.rayEntryDistance? 1 : -1;
		}

		private getPickingCollisionVO(collector:away.traverse.ICollector):PickingCollisionVO
		{
			// trim before sorting
			this._entities.length = this._numEntities;

			// Sort entities from closest to furthest.
			this._entities = this._entities.sort(this.sortOnNearT); // TODO - test sort filter in JS

			// ---------------------------------------------------------------------
			// Evaluate triangle collisions when needed.
			// Replaces collision data provided by bounds collider with more precise data.
			// ---------------------------------------------------------------------

			var shortestCollisionDistance:number = Number.MAX_VALUE;
			var bestCollisionVO:PickingCollisionVO;
			var pickingCollisionVO:PickingCollisionVO;
			var entity:away.entities.IEntity;
			var i:number;

			for (i = 0; i < this._numEntities; ++i) {
				entity = this._entities[i];
				pickingCollisionVO = entity._iPickingCollisionVO;
				if (entity.pickingCollider) {
					// If a collision exists, update the collision data and stop all checks.
					if ((bestCollisionVO == null || pickingCollisionVO.rayEntryDistance < bestCollisionVO.rayEntryDistance) && away.render.RendererBase._iCollidesBefore(entity, shortestCollisionDistance, this._findClosestCollision)) {
						shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
						bestCollisionVO = pickingCollisionVO;
						if (!this._findClosestCollision) {
							this.updateLocalPosition(pickingCollisionVO);
							return pickingCollisionVO;
						}
					}
				} else if (bestCollisionVO == null || pickingCollisionVO.rayEntryDistance < bestCollisionVO.rayEntryDistance) { // A bounds collision with no triangle collider stops all checks.
					// Note: a bounds collision with a ray origin inside its bounds is ONLY ever used
					// to enable the detection of a corresponsding triangle collision.
					// Therefore, bounds collisions with a ray origin inside its bounds can be ignored
					// if it has been established that there is NO triangle collider to test
					if (!pickingCollisionVO.rayOriginIsInsideBounds) {
						this.updateLocalPosition(pickingCollisionVO);
						return pickingCollisionVO;
					}
				}
			}

			return bestCollisionVO;
		}

		private updateLocalPosition(pickingCollisionVO:PickingCollisionVO)
		{

			var collisionPos:away.geom.Vector3D = ( pickingCollisionVO.localPosition == null )? new away.geom.Vector3D() : pickingCollisionVO.localPosition;
			//var collisionPos:away.geom.Vector3D = pickingCollisionVO.localPosition ||= new away.geom.Vector3D();

			var rayDir:away.geom.Vector3D = pickingCollisionVO.localRayDirection;
			var rayPos:away.geom.Vector3D = pickingCollisionVO.localRayPosition;
			var t:number = pickingCollisionVO.rayEntryDistance;
			collisionPos.x = rayPos.x + t*rayDir.x;
			collisionPos.y = rayPos.y + t*rayDir.y;
			collisionPos.z = rayPos.z + t*rayDir.z;
		}

		public dispose()
		{
		}
	}
}
