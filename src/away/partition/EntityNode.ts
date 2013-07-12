/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../entities/Entity.ts" />
///<reference path="NodeBase.ts" />
///<reference path="../math/Plane3D.ts" />

module away.partition
{
	export class EntityNode extends NodeBase
	{
		
		private _entity:away.entities.Entity;
		public _iUpdateQueueNext:EntityNode;
		
		constructor( entity:away.entities.Entity )
		{
			super();
			this._entity = entity;
			this._iNumEntities = 1;
		}
		
		public get entity():Entity
		{
			return this._entity;
		}
		
		public removeFromParent():void
		{
			if( this._iParent)
			{
				this._iParent.iRemoveNode( this );
			}
			this._iParent = null;
		}
		
		//@override
		/*
		public isInFrustum( planes:away.math.Plane3D[], numPlanes:number ):boolean
		{
			if( !this._entity.isVisible )
			{
				return false;
			}
			return this._entity.worldBounds.isInFrustum( planes, numPlanes );
		}
		*/
		//@override
		/*
		public isIntersectingRay( rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D ):boolean
		{
			if( !this._entity.isVisible )
			{
				return false;
			}
			return this._entity.isIntersectingRay(rayPosition, rayDirection);
		}
		*/
	}
}