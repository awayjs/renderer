///<reference path="../../_definitions.ts"/>

/**
 * @module away.pick
 */
module away.pick
{
	/**
	 * An abstract base class for all picking collider classes. It should not be instantiated directly.
	 *
	 * @class away.pick.PickingColliderBase
	 */
	export class PickingColliderBase
	{
		public rayPosition:away.geom.Vector3D;
		public rayDirection:away.geom.Vector3D;

		constructor()
		{

		}

		public _pPetCollisionNormal(indexData:Array<number> /*uint*/, vertexData:Array<number>, triangleIndex:number):away.geom.Vector3D // PROTECTED
		{
			var normal:away.geom.Vector3D = new away.geom.Vector3D();
			var i0:number = indexData[ triangleIndex ]*3;
			var i1:number = indexData[ triangleIndex + 1 ]*3;
			var i2:number = indexData[ triangleIndex + 2 ]*3;
			var p0:away.geom.Vector3D = new away.geom.Vector3D(vertexData[ i0 ], vertexData[ i0 + 1 ], vertexData[ i0 + 2 ]);
			var p1:away.geom.Vector3D = new away.geom.Vector3D(vertexData[ i1 ], vertexData[ i1 + 1 ], vertexData[ i1 + 2 ]);
			var p2:away.geom.Vector3D = new away.geom.Vector3D(vertexData[ i2 ], vertexData[ i2 + 1 ], vertexData[ i2 + 2 ]);
			var side0:away.geom.Vector3D = p1.subtract(p0);
			var side1:away.geom.Vector3D = p2.subtract(p0);
			normal = side0.crossProduct(side1);
			normal.normalize();
			return normal;
		}

		public _pGetCollisionUV(indexData:Array<number> /*uint*/, uvData:Array<number>, triangleIndex:number, v:number, w:number, u:number, uvOffset:number, uvStride:number):away.geom.Point // PROTECTED
		{
			var uv:away.geom.Point = new away.geom.Point();
			var uIndex:number = indexData[ triangleIndex ]*uvStride + uvOffset;
			var uv0:away.geom.Vector3D = new away.geom.Vector3D(uvData[ uIndex ], uvData[ uIndex + 1 ]);
			uIndex = indexData[ triangleIndex + 1 ]*uvStride + uvOffset;
			var uv1:away.geom.Vector3D = new away.geom.Vector3D(uvData[ uIndex ], uvData[ uIndex + 1 ]);
			uIndex = indexData[ triangleIndex + 2 ]*uvStride + uvOffset;
			var uv2:away.geom.Vector3D = new away.geom.Vector3D(uvData[ uIndex ], uvData[ uIndex + 1 ]);
			uv.x = u*uv0.x + v*uv1.x + w*uv2.x;
			uv.y = u*uv0.y + v*uv1.y + w*uv2.y;
			return uv;
		}

		public testRenderableCollision(renderable:away.pool.RenderableBase, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number):boolean
		{
			throw new away.errors.AbstractMethodError();
		}

		/**
		 * @inheritDoc
		 */
		public setLocalRay(localPosition:away.geom.Vector3D, localDirection:away.geom.Vector3D)
		{
			this.rayPosition = localPosition;
			this.rayDirection = localDirection;
		}
	}
}
