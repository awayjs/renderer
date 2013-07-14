/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../partition/EntityNode.ts" />
///<reference path="../containers/ObjectContainer3D.ts" />
///<reference path="../library/assets/AssetType.ts" />
///<reference path="../errors/AbstractMethodError.ts" />
///<reference path="../pick/IPickingCollider.ts" />
///<reference path="../pick/PickingCollisionVO.ts" />
///<reference path="../bounds/BoundingVolumeBase.ts" />

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
			this._worldBounds = this.pGetDefaultBoundingVolume();
		}

		//@override
		public setIgnoreTransform( value:boolean )
		{
			if( this._pScene )
			{
				//this._pScene.pInvalidateEntityBounds( this );
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
		
		// TODO again ... virtual method??
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
		/*
		//@override
		public get minX():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds.min.x;
		}
		
		//@override
		public get minY():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds.min.y;
		}
		
		//@override
		public get minZ():number
		{
			if(this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds.min.z;
		}
		
		//@override
		public get maxX():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds.max.x;
		}
		
		//@override
		public get maxY():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds.max.y;
		}
		
		//@override
		public get maxZ():number
		{
			if( this._pBoundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds.max.z;
		}
		*/
		/*
		public get bounds():BoundingVolumeBase
		{
			if ( this._boundsInvalid )
			{
				this.pUpdateBounds();
			}
			return this._bounds;
		}
		*/
		
		/*
		public set bounds( value:BoundingVolumeBase)
		{
			this.removeBounds();
			this._bounds = value;
			this._worldBounds = value.clone();
			this.invalidateBounds();
			if( this._showBounds )
			{
				this.addBounds();
			}
		}
		*/
		
		/*
		public get worldBounds():BoundingVolumeBase
		{
			if( this._worldBoundsInvalid )
			{
				this.updateWorldBounds();
			}
			return this._worldBounds;
		}
		*/
		/*
		private updateWorldBounds()
		{
			this._worldBounds.transformFrom( this.bounds, this.sceneTransform );
			this._worldBoundsInvalid = false;
		}
		
		//@override
		public set iImplicitPartition( value:Partition3D )
		{
			if( value == this._iImplicitPartition )
			{
				return;
			}
			
			if( this._iImplicitPartition )
			{
				this.notifyPartitionUnassigned();
			}
			super.implicitPartition = value;
			this.notifyPartitionAssigned();
		}
		
		//@override
		public set scene( value:Scene3D )
		{
			if(value == _scene)
			{
				return;
			}
			if( this._scene)
			{
				_scene.unregisterEntity( this );
			}
			// callback to notify object has been spawned. Casts to please FDT
			if ( value )
			{
				value.registerEntity(this);
			}
			super.scene = value;
		}
         */
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
		
		/* TODO Implementation dependency : BoundingVolumeBase
		public isIntersectingRay( rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D ):boolean
		{
			var localRayPosition:away.geom.Vector3D = this.inverseSceneTransform.transformVector( rayPosition );
			var localRayDirection:away.geom.Vector3D = this.inverseSceneTransform.deltaTransformVector( rayDirection );


			if( !this._iPickingCollisionVO.localNormal )
			{
                this._iPickingCollisionVO.localNormal = new away.geom.Vector3D()
			}


			var rayEntryDistance:number = bounds.rayIntersection(localRayPosition, localRayDirection, this._iPickingCollisionVO.localNormal );
			
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
		//*/
		
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			// point lights should be using sphere bounds
			// directional lights should be using null bounds
			
			// TODO return new AxisAlignedBoundingBox();
			return null;
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
		
		/* TODO: implement dependency super.updateMouseChildren();
		public pUpdateMouseChildren():void
		{
			// If there is a parent and this child does not have a triangle collider, use its parent's triangle collider.

			if( this._pParent && !this.pickingCollider )
			{


				if ( this.pParent instanceof away.entities.Entity ) //if( this._pParent is Entity ) { // TODO: Test / validate
                {

                    var parentEntity : away.entities.Entity =  <away.entities.Entity> this._pParent;

					var collider:away.pick.IPickingCollider = parentEntity.pickingCollider;
					if(collider)
                    {

                        this.pickingCollider = collider;

                    }

				}
			}
			
			super.updateMouseChildren();
		}
		//*/
		
		private notifySceneBoundsInvalid()
		{
			if( this._pScene )
			{
				//this._pScene.invalidateEntityBounds( this );
			}
		}
		
		private notifyPartitionAssigned()
		{
			if( this._pScene)
			{
				//this._pScene.registerPartition( this ); //_onAssignPartitionCallback(this);
			}
		}
		
		private notifyPartitionUnassigned()
		{
			if( this._pScene )
			{
				//this._pScene.unregisterPartition( this );
			}
		}
		
		private addBounds()
		{
			if ( !this._boundsIsShown )
			{
				this._boundsIsShown = true;
				//this.addChild( this._bounds.boundingRenderable );
			}
		}
		
		private removeBounds()
		{
			if( !this._boundsIsShown )
			{
				this._boundsIsShown = false;
				//this.removeChild( this._bounds.boundingRenderable );
				//this._bounds.disposeRenderable();
			}
		}
		
		public iInternalUpdate()
		{
			/*
			if( this._controller )
			{
				this._controller.update();
			}*/
		}
	}
}