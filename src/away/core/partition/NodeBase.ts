///<reference path="../../_definitions.ts"/>


module away.partition
{
	export class NodeBase
	{

		public _iParent:NodeBase;
		public _pChildNodes:NodeBase[];
		public _pNumChildNodes:number = 0;
		public _pDebugPrimitive:away.primitives.WireframePrimitiveBase;

		public _iNumEntities:number = 0;
		public _iCollectionMark:number;// = 0;

		constructor()
		{
			this._pChildNodes = [];
		}

		public get showDebugBounds():boolean
		{
			return this._pDebugPrimitive != null;
		}

		public set showDebugBounds(value:boolean)
		{
			if (this._pDebugPrimitive && value == true) {
				return;
			}

			if (!this._pDebugPrimitive && value == false) {
				return;
			}

			if (value) {
				throw new away.errors.PartialImplementationError();
				this._pDebugPrimitive = this.pCreateDebugBounds();
			} else {
				this._pDebugPrimitive.dispose();
				this._pDebugPrimitive = null;
			}

			for (var i:number = 0; i < this._pNumChildNodes; ++i) {
				this._pChildNodes[i].showDebugBounds = value;
			}
		}

		public get parent():NodeBase
		{
			return this._iParent;
		}

		public iAddNode(node:NodeBase)
		{
			node._iParent = this;
			this._iNumEntities += node._pNumEntities;
			this._pChildNodes[ this._pNumChildNodes++ ] = node;
			node.showDebugBounds = this._pDebugPrimitive != null;

			var numEntities:number = node._pNumEntities;
			node = this;

			do {
				node._iNumEntities += numEntities;
			} while ((node = node._iParent) != null);
		}

		public iRemoveNode(node:NodeBase)
		{
			var index:number = this._pChildNodes.indexOf(node);
			this._pChildNodes[index] = this._pChildNodes[--this._pNumChildNodes];
			this._pChildNodes.pop();

			var numEntities:number = node._pNumEntities;
			node = this;

			do {
				node._pNumEntities -= numEntities;
			} while ((node = node._iParent) != null);
		}

		public isInFrustum(planes:away.math.Plane3D[], numPlanes:number):boolean
		{
			//console.log( 'NodeBase' , 'isInFrustum - should be true');

			planes = planes;
			numPlanes = numPlanes;
			return true;
		}

		public isIntersectingRay(rayPosition:away.geom.Vector3D, rayDirection:away.geom.Vector3D):boolean
		{
			rayPosition = rayPosition;
			rayDirection = rayDirection;
			return true;
		}

		public isCastingShadow():boolean
		{
			return true;
		}

		public findPartitionForEntity(entity:away.entities.Entity):NodeBase
		{
			entity = entity;
			return this;
		}

		public acceptTraverser(traverser:away.traverse.PartitionTraverser)
		{

			//console.log( 'NodeBase' , '1 - acceptTraverser' , ( this._pNumEntities == 0 && !this._pDebugPrimitive ));

			if (this._pNumEntities == 0 && !this._pDebugPrimitive) {
				return;
			}

			//console.log( 'NodeBase' , '2 - acceptTraverser' , traverser , '_pNumEntities: ' + this._pNumEntities , '_pNumChildNodes: ' + this._pNumChildNodes);
			//console.log( 'NodeBase' , '2b- acceptTraverser' , ' traverser.enterNode( this ): ' ,  traverser.enterNode( this ) );

			//console.log( 'NodeBase' , this , ' traverser.enterNode( this )  : ', traverser.enterNode( this )  )

			if (traverser.enterNode(this)) {

				// console.log ( 'NodeBase' , 'acceptTraverser (node entered) : ' , this )

				var i:number = 0;

				while (i < this._pNumChildNodes) {

					//console.log ( 'NodeBase' , 'loop through childNodes : ' , i );

					this._pChildNodes[i++].acceptTraverser(traverser);
				}

				if (this._pDebugPrimitive) {
					traverser.applyRenderable(this._pDebugPrimitive);
				}
			}
		}

		public pCreateDebugBounds():away.primitives.WireframePrimitiveBase
		{
			return null;
		}

		public get _pNumEntities():number
		{
			return this._iNumEntities;
		}

		public _pUpdateNumEntities(value:number)
		{

			var diff:number = value - this._pNumEntities;
			var node:NodeBase = this;

			do {
				node._pNumEntities += diff;
			} while ((node = node._iParent) != null);

			//console.log( 'NodeBase' , '_pUpdateNumEntities' , this._pUpdateNumEntities)

		}
	}
}