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
			var i:number = 0;
			var len:number = this._partitions.length;


            //console.log( 'Scene3D.traversePartitions' , len );

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

            //console.log( 'scene3D.setPartition' , value );

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
		
		public removeChild( child:away.containers.ObjectContainer3D )
		{
			this._iSceneGraphRoot.removeChild( child );
		}

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

		public iRegisterEntity( entity:away.entities.Entity )
		{


            //console.log( 'Scene3D' , 'iRegisterEntity' , entity._pImplicitPartition );

			var partition:away.partition.Partition3D = entity.iGetImplicitPartition();

            //console.log( 'scene3D.iRegisterEntity' , entity , entity.iImplicitPartition , partition );

			this.iAddPartitionUnique( partition );
			this.partition.iMarkForUpdate( entity );



		}

		public iUnregisterEntity( entity:away.entities.Entity )
		{
			entity.iGetImplicitPartition().iRemoveEntity( entity );
		}

		public iInvalidateEntityBounds( entity:away.entities.Entity )
		{
            entity.iGetImplicitPartition().iMarkForUpdate( entity );
		}

		public iRegisterPartition( entity:away.entities.Entity )
		{
			this.iAddPartitionUnique( entity.iGetImplicitPartition() );
		}

		public iUnregisterPartition( entity:away.entities.Entity )
		{
			entity.iGetImplicitPartition().iRemoveEntity( entity );
		}

		public iAddPartitionUnique( partition:away.partition.Partition3D )
		{

            //console.log( 'scene3D.iAddPartitionUnique' , partition );

			if (this._partitions.indexOf(partition) == -1)
			{
				this._partitions.push( partition );
			}

		}

	}
}