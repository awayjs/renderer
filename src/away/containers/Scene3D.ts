/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts" />

module away.containers
{
	export class Scene3D extends away.events.EventDispatcher
	{
		
		public _iSceneGraphRoot:away.containers.ObjectContainer3D;
		private _partitions:away.partition.Partition3D[];
		
		constructor()
		{
			super();
			this._partitions = [];
			this._iSceneGraphRoot = new away.containers.ObjectContainer3D();
			
			this._iSceneGraphRoot.scene = this;
			this._iSceneGraphRoot._iIsRoot = true;
			this._iSceneGraphRoot.partition = new away.partition.Partition3D( new away.partition.NodeBase() );
		}
		
		public traversePartitions( traverser:away.traverse.PartitionTraverser )
		{
			var i:number;
			var len:number = this._partitions.length;
			
			traverser.scene = this;
			
			while (i < len)
			{
				this._partitions[i++].traverse( traverser );
			}
		}
		
		public get partition():away.partition.Partition3D
		{
			return this._iSceneGraphRoot.partition;
		}
		
		public set partition( value:away.partition.Partition3D )
		{
			this._iSceneGraphRoot.partition = value;
			this.dispatchEvent( new away.events.Scene3DEvent( away.events.Scene3DEvent.PARTITION_CHANGED, this._iSceneGraphRoot ) );
		}
		
		public contains( child:away.containers.ObjectContainer3D ):boolean
		{
			return this._iSceneGraphRoot.contains( child );
		}
		
		public addChild( child:away.containers.ObjectContainer3D ):away.containers.ObjectContainer3D
		{
			return this._iSceneGraphRoot.addChild( child );
		}
		
		/*
		public removeChild( child:away.containers.ObjectContainer3D )
		{
			this._iSceneGraphRoot.removeChild( child );
		}
		*/
		
		/*
		public removeChildAt( index:number )
		{
			this._iSceneGraphRoot.removeChildAt( index );
		}
		
		
		public getChildAt( index:number ):away.containers.ObjectContainer3D
		{
			return this._iSceneGraphRoot.getChildAt( index );
		}
		
		public get numChildren():number
		{
			return this._iSceneGraphRoot.numChildren;
		}
		
		public iRegisterEntity( entity:away.enity.Entity )
		{
			var partition:away.partition.Partition3D = entity.implicitPartition;
			this.addPartitionUnique( partition );
			this.partition.markForUpdate( entity );
		}
		
		public iUnregisterEntity( entity:away.enity.Entity )
		{
			entity.implicitPartition.removeEntity( entity );
		}
		*/
		public iInvalidateEntityBounds( entity:away.entities.Entity )
		{
            entity.iImplicitPartition.iMarkForUpdate( entity );
		}
		/*
		public iRegisterPartition( entity:away.entities.Entity )
		{
			this.addPartitionUnique( entity.implicitPartition );
		}
		
		public iUnregisterPartition( entity:away.entities.Entity )
		{
			entity.implicitPartition.removeEntity( entity );
		}
		
		public iAddPartitionUnique( partition:away.partitions.Partition3D )
		{
			if (this._partitions.indexOf(partition) == -1)
			{
				_partitions.push( partition );
			}
		}
		*/
	}
}