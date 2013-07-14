/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../partition/EntityNode.ts" />
///<reference path="../partition/NodeBase.ts" />
///<reference path="../partition/NullNode.ts" />
///<reference path="../entities/Entity.ts" />

module away.partition
{
	
	export class Partition3D
	{
		
		public _rootNode:NodeBase;
		private _updatesMade:Boolean;
		private _updateQueue:EntityNode;
		
		constructor( rootNode:away.partition.NodeBase )
		{
			this._rootNode = rootNode || <NodeBase> new away.partition.NullNode();
		}
		
		/*
		public get showDebugBounds():boolean
		{
			return this._rootNode.showDebugBounds;
		}
		
		
		public set showDebugBounds( value:boolean )
		{
			this._rootNode.showDebugBounds = value;
		}
		
		
		public traverse( traverser:PartitionTraverser  )
		{
			if( this._updatesMade )
			{
				this.updateEntities();
			}
			++PartitionTraverser._collectionMark;
			_rootNode.acceptTraverser(traverser);
		}
		*/
		public iMarkForUpdate( entity:away.entities.Entity )
		{
			var node:EntityNode = entity.getEntityPartitionNode();
			var t:EntityNode = this._updateQueue;
			
			while( t )
			{
				if ( node == t )
				{
					return;
				}
				t = t._iUpdateQueueNext;
			}
			
			node._iUpdateQueueNext = this._updateQueue;
			
			this._updateQueue = node;
			this._updatesMade = true;
		}
		
		public iRemoveEntity( entity:away.entities.Entity )
		{
			var node:away.partition.EntityNode = entity.getEntityPartitionNode();
			var t:EntityNode;
			
			node.removeFromParent();
			
			if( node == this._updateQueue )
			{
				this._updateQueue = node._iUpdateQueueNext;
			}
			else
			{
				t = this._updateQueue;
				while( t && t._iUpdateQueueNext != node )
				{
					t = t._iUpdateQueueNext;
				}
				if( t )
				{
					t._iUpdateQueueNext = node._iUpdateQueueNext;
				}
			}
			
			node._iUpdateQueueNext = null;
			
			if ( !this._updateQueue )
			{
				this._updatesMade = false;
			}
		}
		
	}
}