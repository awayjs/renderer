///<reference path="../../_definitions.ts"/>

/**
 * @module away.partition
 */
module away.partition
{
	/**
	 * @class away.partition.Partition3D
	 */
	export class Partition3D
	{

		public _rootNode:NodeBase;
		private _updatesMade:Boolean = false;
		private _updateQueue:EntityNode;

		constructor(rootNode:NodeBase)
		{
			this._rootNode = rootNode || <NodeBase> new NullNode();
		}

		public get showDebugBounds():boolean
		{
			return this._rootNode.showDebugBounds;
		}

		public set showDebugBounds(value:boolean)
		{
			this._rootNode.showDebugBounds = value;
		}

		public traverse(traverser:away.traverse.PartitionTraverser)
		{

			if (this._updatesMade) {
				this.updateEntities();
			}
			++away.traverse.PartitionTraverser._iCollectionMark;
			this._rootNode.acceptTraverser(traverser);
		}

		public iMarkForUpdate(entity:away.entities.Entity)
		{
			var node:EntityNode = entity.getEntityPartitionNode();
			var t:EntityNode = this._updateQueue;

			while (t) {
				if (node == t) {
					return;
				}
				t = t._iUpdateQueueNext;
			}

			node._iUpdateQueueNext = this._updateQueue;

			this._updateQueue = node;
			this._updatesMade = true;
		}

		public iRemoveEntity(entity:away.entities.Entity)
		{
			var node:EntityNode = entity.getEntityPartitionNode();
			var t:EntityNode;

			node.removeFromParent();

			if (node == this._updateQueue) {
				this._updateQueue = node._iUpdateQueueNext;
			} else {
				t = this._updateQueue;
				while (t && t._iUpdateQueueNext != node) {
					t = t._iUpdateQueueNext;
				}
				if (t) {
					t._iUpdateQueueNext = node._iUpdateQueueNext;
				}
			}

			node._iUpdateQueueNext = null;

			if (!this._updateQueue) {
				this._updatesMade = false;
			}
		}

		private updateEntities()
		{


			var node:EntityNode = this._updateQueue;
			var targetNode:NodeBase;
			var t:EntityNode;
			this._updateQueue = null;
			this._updatesMade = false;

			//console.log( 'Partition3D' , 'updateEntities')

			do {

				targetNode = this._rootNode.findPartitionForEntity(node.entity);

				//console.log( 'Partition3D' , 'updateEntities' , 'targetNode: ' , targetNode );

				if (node.parent != targetNode) {
					if (node) {
						node.removeFromParent();
					}
					targetNode.iAddNode(node);
				}

				t = node._iUpdateQueueNext;
				node._iUpdateQueueNext = null;
				node.entity.iInternalUpdate();

			} while ((node = t) != null);
		}

	}
}