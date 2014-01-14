///<reference path="../../_definitions.ts"/>

/**
 * @module away.traverse
 */
module away.traverse
{

	/**
	 * The RaycastCollector class is a traverser for scene partitions that collects all scene graph entities that are
	 * considered intersecting with the defined ray.
	 *
	 * @see away.partition.Partition3D
	 * @see away.partition.Entity
	 *
	 * @class away.traverse.RaycastCollector
	 */
	export class RaycastCollector extends EntityCollector
	{
		private _rayPosition:away.geom.Vector3D = new away.geom.Vector3D();
		private _rayDirection:away.geom.Vector3D = new away.geom.Vector3D();

		/**
		 * Creates a new RaycastCollector object.
		 */
		constructor()
		{

			super();

		}

		/**
		 * Provides the starting position of the ray.
		 */
		public get rayPosition():away.geom.Vector3D
		{
			return this._rayPosition;
		}

		public set rayPosition(value:away.geom.Vector3D)
		{
			this._rayPosition = value;
		}

		/**
		 * Provides the direction vector of the ray.
		 */
		public get rayDirection():away.geom.Vector3D
		{
			return this._rayDirection;
		}

		public set rayDirection(value:away.geom.Vector3D)
		{
			this._rayDirection = value;
		}

		/**
		 * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
		 *
		 * @param node The Partition3DNode object to frustum-test.
		 */
		public enterNode(node:away.partition.NodeBase):boolean
		{
			return node.isIntersectingRay(this._rayPosition, this._rayDirection);
		}

		/**
		 * @inheritDoc
		 */
		public applySkyBox(renderable:away.base.IRenderable)
		{
		}

		/**
		 * Adds an IRenderable object to the potentially visible objects.
		 * @param renderable The IRenderable object to add.
		 */
		public applyRenderable(renderable:away.base.IRenderable)
		{
		}

		/**
		 * @inheritDoc
		 */
		public applyUnknownLight(light:away.lights.LightBase)
		{
		}
	}
}
