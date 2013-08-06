/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>


module away.entities
{
	
	export class Entity extends away.containers.ObjectContainer3D
	{
		
		private _showBounds:boolean;
		private _partitionNode:away.partition.EntityNode;
		private _boundsIsShown:boolean;
		private _shaderPickingDetails:boolean;
		
		public _iPickingCollisionVO:away.pick.PickingCollisionVO;
		public _iPickingCollider:away.pick.IPickingCollider;
		public _iStaticNode:boolean;
		
		public _pBounds:away.bounds.BoundingVolumeBase;
		public _pBoundsInvalid:boolean = true;
		private _worldBounds:away.bounds.BoundingVolumeBase;
		private _worldBoundsInvalid:boolean = true;
		
		constructor()
		{
			super();
			this._pBounds = this.pGetDefaultBoundingVolume();

            //console.log( "Entity() - Bounds:" , this._pBounds );

			this._worldBounds = this.pGetDefaultBoundingVolume();
		}

		//@override
		public setIgnoreTransform( value:boolean )
		{
			if( this._pScene )
			{
				this._pScene.iInvalidateEntityBounds( this );
			}
			super.setIgnoreTransform( value );
		}
		
		public get shaderPickingDetails():boolean
		{
			return this._shaderPickingDetails;
		}
		
		public get staticNode():boolean
		{
			return this._iStaticNode;
		}
		
		public set staticNode( value:boolean )
		{
			this._iStaticNode = value;
		}
		
		public get pickingCollisionVO():away.pick.PickingCollisionVO
		{
			if ( !this._iPickingCollisionVO )
			{
				this._iPickingCollisionVO = new away.pick.PickingCollisionVO( this );
			}
			return this._iPickingCollisionVO;
		}
		
		public iCollidesBefore( shortestCollisionDistance:number, findClosest:boolean ):boolean
		{
			shortestCollisionDistance = shortestCollisionDistance;
			findClosest = findClosest;
			return true;
		}
		
		public get showBounds():boolean
		{
			return this._showBounds;
		}
		
		public set showBounds( value:boolean )
		{
			if (value == this._showBounds)
			{
				return;
			}
			this._showBounds = value;
			
			if (this._showBounds)
			{
				this.addBounds();
			}
			else
			{
				this.removeBounds();
			}
		}
		
		//@override
		public get minX():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._pBounds.min.x;
		}
		
		//@override
		public get minY():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._pBounds.min.y;
		}
		
		//@override
		public get minZ():number
		{
			if(this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._pBounds.min.z;
		}
		
		//@override
		public get maxX():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._pBounds.max.x;
		}
		
		//@override
		public get maxY():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._pBounds.max.y;
		}
		
		//@override
		public get maxZ():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._pBounds.max.z;
		}

        public getBounds():away.bounds.BoundingVolumeBase
        {
            if ( this._pBoundsInvalid )
            {
                this.pUpdateBounds();
            }
            return this._pBounds;
        }

        public get bounds():away.bounds.BoundingVolumeBase
        {

            return this.getBounds();
        }
		
		public set bounds( value:away.bounds.BoundingVolumeBase )
		{
			this.removeBounds();
			this._pBounds = value;
			this._worldBounds = value.clone();
			this.pInvalidateBounds();
			if( this._showBounds )
			{
				this.addBounds();
			}
		}
		
		public get worldBounds():away.bounds.BoundingVolumeBase
		{
			if( this._worldBoundsInvalid )
			{
				this.updateWorldBounds();
			}
			return this._worldBounds;
		}
		
		private updateWorldBounds()
		{
			this._worldBounds.transformFrom( this.getBounds() , this.sceneTransform );
			this._worldBoundsInvalid = false;
		}
		
		//@override
		public set iImplicitPartition( value:away.partition.Partition3D )
		{
			if( value == this._pImplicitPartition )
			{
				return;
			}
			
			if( this._pImplicitPartition )
			{
				this.notifyPartitionUnassigned();
			}

			super.iSetImplicitPartition( value );
			this.notifyPartitionAssigned();

		}

		//@override
		public set scene( value:away.containers.Scene3D )
		{
			if(value == this._pScene)
			{
				return;
			}
			if( this._pScene)
			{
				this._pScene.iUnregisterEntity( this );
			}
			// callback to notify object has been spawned. Casts to please FDT
			if ( value )
			{
				value.iRegisterEntity(this);
			}

			super.setScene ( value ) ;
		}

		 
		//@override 
		public get assetType():string
		{
			return away.library.AssetType.ENTITY;
		}
		
		public get pickingCollider():away.pick.IPickingCollider
		{
			return this._iPickingCollider;
		}

        public set pickingCollider(value:away.pick.IPickingCollider)
        {
            this.setPickingCollider( value );
        }

        public setPickingCollider(value:away.pick.IPickingCollider)
        {
            this._iPickingCollider = value;
        }


		
		public getEntityPartitionNode():away.partition.EntityNode
		{
			if( !this._partitionNode )
			{
				this._partitionNode = this.pCreateEntityPartitionNode()
			}
			return this._partitionNode;
		}
		
		public isIntersectingRay( rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D ):boolean
		{
			var localRayPosition:away.geom.Vector3D = this.inverseSceneTransform.transformVector( rayPosition );
			var localRayDirection:away.geom.Vector3D = this.inverseSceneTransform.deltaTransformVector( rayDirection );


			if( !this._iPickingCollisionVO.localNormal )
			{
                this._iPickingCollisionVO.localNormal = new away.geom.Vector3D()
			}


			var rayEntryDistance:number = this._pBounds.rayIntersection(localRayPosition, localRayDirection, this._iPickingCollisionVO.localNormal );
			
			if( rayEntryDistance < 0 )
			{
				return false;
			}

            this._iPickingCollisionVO.rayEntryDistance = rayEntryDistance;
            this._iPickingCollisionVO.localRayPosition = localRayPosition;
            this._iPickingCollisionVO.localRayDirection = localRayDirection;
            this._iPickingCollisionVO.rayPosition = rayPosition;
            this._iPickingCollisionVO.rayDirection = rayDirection;
            this._iPickingCollisionVO.rayOriginIsInsideBounds = rayEntryDistance == 0;
			
			return true;
		}

		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			// point lights should be using sphere bounds
			// directional lights should be using null bounds
			return new away.bounds.AxisAlignedBoundingBox();

		}
		
		public pUpdateBounds()
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pInvalidateSceneTransform()
		{
			if( !this._pIgnoreTransform )
			{
				super.pInvalidateSceneTransform();
				this._worldBoundsInvalid = true;
				this.notifySceneBoundsInvalid();
			}
		}
		
		public pInvalidateBounds()
		{
			this._pBoundsInvalid = true;
			this._worldBoundsInvalid = true;
			this.notifySceneBoundsInvalid();
		}
		
		public pUpdateMouseChildren():void
		{
			// If there is a parent and this child does not have a triangle collider, use its parent's triangle collider.

			if( this._pParent && !this.pickingCollider )
			{

				if ( this._pParent instanceof away.entities.Entity ) //if( this._pParent is Entity ) { // TODO: Test / validate
                {

                    var parentEntity : away.entities.Entity =  <away.entities.Entity> this._pParent;

					var collider:away.pick.IPickingCollider = parentEntity.pickingCollider;
					if(collider)
                    {

                        this.pickingCollider = collider;

                    }

				}
			}
			
			super.pUpdateMouseChildren();
		}

		private notifySceneBoundsInvalid()
		{
			if( this._pScene )
			{
				this._pScene.iInvalidateEntityBounds( this );
			}
		}
		
		private notifyPartitionAssigned()
		{
			if( this._pScene)
			{
				this._pScene.iRegisterPartition( this ); //_onAssignPartitionCallback(this);
			}
		}
		
		private notifyPartitionUnassigned()
		{
			if( this._pScene )
			{
				this._pScene.iUnregisterPartition( this );
			}
		}
		
		private addBounds()
		{
			if ( !this._boundsIsShown )
			{
				this._boundsIsShown = true;
				this.addChild( this._pBounds.boundingRenderable );
			}
		}
		
		private removeBounds()
		{
			if( !this._boundsIsShown )
			{
				this._boundsIsShown = false;
				this.removeChild( this._pBounds.boundingRenderable );
				this._pBounds.disposeRenderable();
			}
		}
		
		public iInternalUpdate()
		{

			if( this._iController )
			{
				this._iController.update();
			}

		}
	}
}