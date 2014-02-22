///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.RenderableListItem
	 */
	export class RenderableBase
	{
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
		constructor(sourceEntity:away.entities.IEntity, materialOwner:away.base.IMaterialOwner, subGeometry:away.base.ISubGeometry, animationSubGeometry:away.animators.AnimationSubGeometry)
		{
			this.sourceEntity = sourceEntity;
			this.materialOwner = materialOwner;
			this.subGeometry = subGeometry;
			this.animationSubGeometry = animationSubGeometry;
		}
	}
}