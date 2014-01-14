///<reference path="../../_definitions.ts"/>

module away.partition
{

	/**
	 * RenderableNode is a space partitioning leaf node that contains any Entity that is itself a IRenderable
	 * object. This excludes Mesh (since the renderable objects are its SubMesh children).
	 */
	export class RenderableNode extends EntityNode
	{
		private _renderable:away.base.IRenderable;

		/**
		 * Creates a new RenderableNode object.
		 * @param mesh The mesh to be contained in the node.
		 */
		constructor(renderable:away.base.IRenderable)
		{

			var e:any = renderable;

			super(<away.entities.Entity> e);

			this._renderable = renderable; // also keep a stronger typed reference
		}

		/**
		 * @inheritDoc
		 */
		public acceptTraverser(traverser:away.traverse.PartitionTraverser)
		{
			if (traverser.enterNode(this)) {

				super.acceptTraverser(traverser);

				traverser.applyRenderable(this._renderable);

			}
		}

		public isCastingShadow():boolean
		{
			return this._renderable.castsShadows;
		}

	}
}
