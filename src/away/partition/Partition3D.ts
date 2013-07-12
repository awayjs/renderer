/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../partition/NodeBase.ts" />
///<reference path="../partition/NullNode.ts" />

module away.partition
{
	
	export class Partition3D
	{
		
		public var _rootNode:NodeBase;
		private var _updatesMade:Boolean;
		private var _updateQueue:EntityNode;
		
		constructor( rootNode:away.partition.NodeBase )
		{
			_rootNode = rootNode || new away.partition.NullNode();
		}
		
		public get showDebugBounds():boolean
		{
			return this._rootNode.showDebugBounds;
		}
		
		public set showDebugBounds( value:boolean )
		{
			this._rootNode.showDebugBounds = value;
		}
		
		public function traverse( traverser:PartitionTraverser  ):void
		{
			if( this._updatesMade )
			{
				updateEntities();
			}
			++PartitionTraverser._collectionMark;
			_rootNode.acceptTraverser(traverser);
		}
		
		public _iMarkForUpdate( entity:Entity )
		{
			var node:EntityNode = entity.getEntityPartitionNode();
			var t:EntityNode = _updateQueue;
			
			while( t )
			{
				if ( node == t )
				{
					return;
				}
				t = t._updateQueueNext;
			}
			
			node._updateQueueNext = _updateQueue;
			
			this._updateQueue = node;
			this._updatesMade = true;
		}
		
		arcane function removeEntity(entity:Entity):void
		{
			var node:EntityNode = entity.getEntityPartitionNode();
			var t:EntityNode;
			
			node.removeFromParent();
			
			if (node == _updateQueue)
				_updateQueue = node._updateQueueNext;
			else {
				t = _updateQueue;
				while (t && t._updateQueueNext != node)
					t = t._updateQueueNext;
				if (t)
					t._updateQueueNext = node._updateQueueNext;
			}
			
			node._updateQueueNext = null;
			
			// any updates have been made undone
			if (!_updateQueue)
				_updatesMade = false;
		}
		
	}
}