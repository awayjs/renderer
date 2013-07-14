/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../math/Plane3D.ts" />
///<reference path="../entities/Entity.ts" />
///<reference path="../traverse/PartitionTraverser.ts" />
///<reference path="../primitives/WireframePrimitiveBase.ts" />
///<reference path="../errors/PartialImplementationError.ts" />

module away.partition
{
	export class NodeBase
	{
		
		public _iParent:NodeBase;
		public _pChildNodes:NodeBase[];
		public _pNumChildNodes:number;
		public _pDebugPrimitive:away.primitives.WireframePrimitiveBase;
		
		public _iNumEntities:number;
		public _iCollectionMark:number;
		
		constructor()
		{
			this._pChildNodes = [];
		}
		
		public get showDebugBounds():boolean
		{
			return this._pDebugPrimitive != null;
		}
		
		public set showDebugBounds( value:boolean )
		{
			if( this._pDebugPrimitive && value == true )
			{
				return;
			}
			
			if( !this._pDebugPrimitive && value == false )
			{
				return;
			}
			
			if (value)
			{
				throw new away.errors.PartialImplementationError();
				//TODO this._pDebugPrimitive = this.createDebugBounds();
			}
			else
			{
				this._pDebugPrimitive.dispose();
				this._pDebugPrimitive = null;
			}
			
			for (var i:number = 0; i < this._pNumChildNodes; ++i)
			{
				this._pChildNodes[i].showDebugBounds = value;
			}
		}
		
		public get parent():NodeBase
		{
			return this._iParent;
		}
		
		public _iAddNode( node:NodeBase )
		{
			node._iParent = this;
			this._pNumEntities += node._pNumEntities;
			this._pChildNodes[ this._pNumChildNodes++ ] = node;
			//node.showDebugBounds = _debugPrimitive != null;
			
			var numEntities:number = node._pNumEntities;
			node = this;
			
			do
			{
				node._pNumEntities += numEntities;
			}
			while ((node = node._iParent) != null);
		}
		
		public iRemoveNode( node:NodeBase )
		{
			var index:number = this._pChildNodes.indexOf(node);
			this._pChildNodes[index] = this._pChildNodes[--this._pNumChildNodes];
			this._pChildNodes.pop();
			
			var numEntities:number = node._pNumEntities;
			node = this;
			
			do
			{
				node._pNumEntities -= numEntities;
			}
			while ((node = node._iParent) != null);
		}
		
		//TODO ???? What is going on here from the original Away code?
		// Is this supposed to be a virtual method? If so enforce override
		// by thowing an error.
		public isInFrustum(planes:away.math.Plane3D[], numPlanes:number):boolean
		{
			planes = planes;
			numPlanes = numPlanes;
			return true;
		}
		
		public isIntersectingRay( rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D):boolean
		{
			rayPosition = rayPosition;
			rayDirection = rayDirection;
			return true;
		}
		
		//TODO again... investigate this? Is it virtual? throw!?
		public findPartitionForEntity( entity:away.entities.Entity ):NodeBase
		{
			entity = entity;
			return this;
		}
		
		public acceptTraverser( traverser:away.traverse.PartitionTraverser )
		{
			/*
			if( this._pNumEntities == 0 && !this._debugPrimitive)
			{
				return;
			}*/
			
			if( traverser.enterNode( this ) )
			{
				var i:number;
				while (i < this._pNumChildNodes)
				{
					this._pChildNodes[i++].acceptTraverser(traverser);
				}
				/*
				if ( this._debugPrimitive )
				{
					traverser.applyRenderable(_debugPrimitive);
				}*/
			}
		}
		
		/*
		public function _pCreateDebugBounds():WireframePrimitiveBase
		{
			return null;
		}
		*/
		
		public get _pNumEntities():number
		{
			return this._pNumEntities;
		}
		
		public _pUpdateNumEntities( value:number )
		{
			var diff:number = value - this._pNumEntities;
			var node:NodeBase = this;
			
			do
			{
				node._pNumEntities += diff;
			}
			while ( (node = node._iParent) != null );
		}
	}
}