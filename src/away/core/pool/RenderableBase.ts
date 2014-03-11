///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.RenderableListItem
	 */
	export class RenderableBase implements IRenderable
	{
		/**
		 *
		 */
		private _pool:RenderablePool;

		/**
		 *
		 */
		public next:RenderableBase;

		/**
		 *
		 */
		public materialId:number;

		/**
		 *
		 */
		public renderOrderId:number;

		/**
		 *
		 */
		public zIndex:number;

		/**
		 *
		 */
		public cascaded:boolean;

		/**
		 *
		 */
		public renderSceneTransform:away.geom.Matrix3D;

		/**
		 *
		 */
		public sourceEntity:away.entities.IEntity;

		/**
		 *
		 */
		public materialOwner:away.base.IMaterialOwner;

		/**
		 *
		 */
		public subGeometry:away.base.ISubGeometry;

		/**
		 *
		 */
		public animationSubGeometry:away.animators.AnimationSubGeometry;

		/**
		 *
		 * @param sourceEntity
		 * @param materialOwner
		 * @param subGeometry
		 * @param animationSubGeometry
		 */
		constructor(pool:RenderablePool, sourceEntity:away.entities.IEntity, materialOwner:away.base.IMaterialOwner, subGeometry:away.base.ISubGeometry, animationSubGeometry:away.animators.AnimationSubGeometry)
		{
			//store a reference to the pool for later disposal
			this._pool = pool;

			this.sourceEntity = sourceEntity;
			this.materialOwner = materialOwner;
			this.subGeometry = subGeometry;
			this.animationSubGeometry = animationSubGeometry;
		}

		public dispose()
		{
			this._pool.disposeItem(this.materialOwner);
		}

		/**
		 *
		 */
		public _iUpdate()
		{
			//nothing to do here
		}
	}
}