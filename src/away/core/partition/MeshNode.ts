///<reference path="../../_definitions.ts"/>
module away.partition
{
	//import away3d.core.base.SubMesh;
	//import away3d.core.traverse.PartitionTraverser;
	//import away3d.entities.Mesh;

	/**
	 * MeshNode is a space partitioning leaf node that contains a Mesh object.
	 */
	export class MeshNode extends away.partition.EntityNode
	{
		private _mesh:away.entities.Mesh;

		/**
		 * Creates a new MeshNode object.
		 * @param mesh The mesh to be contained in the node.
		 */
			constructor(mesh:away.entities.Mesh)
		{
			super(mesh);
			this._mesh = mesh; // also keep a stronger typed reference
		}

		/**
		 * The mesh object contained in the partition node.
		 */
		public get mesh():away.entities.Mesh
		{
			return this._mesh;
		}

		/**
		 * @inheritDoc
		 */
		public acceptTraverser(traverser:away.traverse.PartitionTraverser)
		{

			if (traverser.enterNode(this)) {

				super.acceptTraverser(traverser);

				var subs:away.base.SubMesh[] = this._mesh.subMeshes;
				var i:number = 0;
				var len:number = subs.length;
				while (i < len) {

					traverser.applyRenderable(subs[i++]);

				}

			}

		}

		public isCastingShadow():boolean
		{
			return this._mesh.castsShadows;
		}

	}
}

