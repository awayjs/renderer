///<reference path="../../_definitions.ts"/>
module away.pick
{

	/**
	 * An abstract base class for all picking collider classes. It should not be instantiated directly.
	 */
	export class PickingColliderBase
	{
		public rayPosition:away.geom.Vector3D;
		public rayDirection:away.geom.Vector3D;

		constructor()
		{

		}

		public _pPetCollisionNormal(indexData:number[] /*uint*/, vertexData:number[], triangleIndex:number):away.geom.Vector3D // PROTECTED
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

		public _pGetCollisionUV(indexData:number[] /*uint*/, uvData:number[], triangleIndex:number, v:number, w:number, u:number, uvOffset:number, uvStride:number):away.geom.Point // PROTECTED
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

		//* TODO: implement & integrate GeometryUtils, SubGeometry, SubMesh
		public pGetMeshSubgeometryIndex(subGeometry:away.base.SubGeometry):number
		{

			away.Debug.throwPIR('away.pick.PickingColliderBase', 'pGetMeshSubMeshIndex', 'GeometryUtils.getMeshSubMeshIndex');
			return 0;
			//return GeometryUtils.getMeshSubgeometryIndex(subGeometry);
		}

		//*/

		//* TODO: implement & integrate
		public pGetMeshSubMeshIndex(subMesh:away.base.SubMesh):number
		{

			away.Debug.throwPIR('away.pick.PickingColliderBase', 'pGetMeshSubMeshIndex', 'GeometryUtils.getMeshSubMeshIndex');

			return 0;
			//return GeometryUtils.getMeshSubMeshIndex(subMesh);
		}

		//*/

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
