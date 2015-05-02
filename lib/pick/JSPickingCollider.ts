import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import TriangleSubGeometry				= require("awayjs-core/lib/data/TriangleSubGeometry");
import PickingCollisionVO				= require("awayjs-display/lib/pick/PickingCollisionVO");
import IPickingCollider					= require("awayjs-display/lib/pick/IPickingCollider");
import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");

import PickingColliderBase				= require("awayjs-renderergl/lib/pick/PickingColliderBase");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderablePool					= require("awayjs-renderergl/lib/pool/RenderablePool");


/**
 * Pure JS picking collider for display objects. Used with the <code>RaycastPicker</code> picking object.
 *
 * @see away.base.DisplayObject#pickingCollider
 * @see away.pick.RaycastPicker
 *
 * @class away.pick.JSPickingCollider
 */
class JSPickingCollider extends PickingColliderBase implements IPickingCollider
{
	private _findClosestCollision:boolean;

	/**
	 * Creates a new <code>JSPickingCollider</code> object.
	 *
	 * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
	 */
	constructor(renderablePool:RenderablePool, findClosestCollision:boolean = false)
	{
		super(renderablePool);

		this._findClosestCollision = findClosestCollision;
	}

	/**
	 * @inheritDoc
	 */
	public _pTestRenderableCollision(renderable:RenderableBase, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number):boolean
	{
		var t:number;
		var i0:number, i1:number, i2:number;
		var rx:number, ry:number, rz:number;
		var nx:number, ny:number, nz:number;
		var cx:number, cy:number, cz:number;
		var coeff:number, u:number, v:number, w:number;
		var p0x:number, p0y:number, p0z:number;
		var p1x:number, p1y:number, p1z:number;
		var p2x:number, p2y:number, p2z:number;
		var s0x:number, s0y:number, s0z:number;
		var s1x:number, s1y:number, s1z:number;
		var nl:number, nDotV:number, D:number, disToPlane:number;
		var Q1Q2:number, Q1Q1:number, Q2Q2:number, RQ1:number, RQ2:number;
		var indexData:Array<number> = renderable.getIndexData().data;
		var collisionTriangleIndex:number = -1;
		var bothSides:boolean = (<MaterialBase> renderable.renderObjectOwner).bothSides;

		var positionData:Array<number> = renderable.getVertexData(TriangleSubGeometry.POSITION_DATA).data;
		var positionStride:number = renderable.getVertexData(TriangleSubGeometry.POSITION_DATA).dataPerVertex;
		var positionOffset:number = renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA);
		var uvData:Array<number> = renderable.getVertexData(TriangleSubGeometry.UV_DATA).data;
		var uvStride:number = renderable.getVertexData(TriangleSubGeometry.UV_DATA).dataPerVertex;
		var uvOffset:number = renderable.getVertexOffset(TriangleSubGeometry.UV_DATA);
		var numIndices:number = indexData.length;

		for (var index:number = 0; index < numIndices; index += 3) { // sweep all triangles
			// evaluate triangle indices
			i0 = positionOffset + indexData[ index ]*positionStride;
			i1 = positionOffset + indexData[ (index + 1) ]*positionStride;
			i2 = positionOffset + indexData[ (index + 2) ]*positionStride;

			// evaluate triangle positions
			p0x = positionData[ i0 ];
			p0y = positionData[ (i0 + 1) ];
			p0z = positionData[ (i0 + 2) ];
			p1x = positionData[ i1 ];
			p1y = positionData[ (i1 + 1) ];
			p1z = positionData[ (i1 + 2) ];
			p2x = positionData[ i2 ];
			p2y = positionData[ (i2 + 1) ];
			p2z = positionData[ (i2 + 2) ];

			// evaluate sides and triangle normal
			s0x = p1x - p0x; // s0 = p1 - p0
			s0y = p1y - p0y;
			s0z = p1z - p0z;
			s1x = p2x - p0x; // s1 = p2 - p0
			s1y = p2y - p0y;
			s1z = p2z - p0z;
			nx = s0y*s1z - s0z*s1y; // n = s0 x s1
			ny = s0z*s1x - s0x*s1z;
			nz = s0x*s1y - s0y*s1x;
			nl = 1/Math.sqrt(nx*nx + ny*ny + nz*nz); // normalize n
			nx *= nl;
			ny *= nl;
			nz *= nl;

			// -- plane intersection test --
			nDotV = nx*this.rayDirection.x + ny* +this.rayDirection.y + nz*this.rayDirection.z; // rayDirection . normal
			if (( !bothSides && nDotV < 0.0 ) || ( bothSides && nDotV != 0.0 )) { // an intersection must exist
				// find collision t
				D = -( nx*p0x + ny*p0y + nz*p0z );
				disToPlane = -( nx*this.rayPosition.x + ny*this.rayPosition.y + nz*this.rayPosition.z + D );
				t = disToPlane/nDotV;
				// find collision point
				cx = this.rayPosition.x + t*this.rayDirection.x;
				cy = this.rayPosition.y + t*this.rayDirection.y;
				cz = this.rayPosition.z + t*this.rayDirection.z;
				// collision point inside triangle? ( using barycentric coordinates )
				Q1Q2 = s0x*s1x + s0y*s1y + s0z*s1z;
				Q1Q1 = s0x*s0x + s0y*s0y + s0z*s0z;
				Q2Q2 = s1x*s1x + s1y*s1y + s1z*s1z;
				rx = cx - p0x;
				ry = cy - p0y;
				rz = cz - p0z;
				RQ1 = rx*s0x + ry*s0y + rz*s0z;
				RQ2 = rx*s1x + ry*s1y + rz*s1z;
				coeff = 1/( Q1Q1*Q2Q2 - Q1Q2*Q1Q2 );
				v = coeff*( Q2Q2*RQ1 - Q1Q2*RQ2 );
				w = coeff*( -Q1Q2*RQ1 + Q1Q1*RQ2 );
				if (v < 0)
					continue;
				if (w < 0)
					continue;
				u = 1 - v - w;
				if (!( u < 0 ) && t > 0 && t < shortestCollisionDistance) { // all tests passed
					shortestCollisionDistance = t;
					collisionTriangleIndex = index/3;
					pickingCollisionVO.rayEntryDistance = t;
					pickingCollisionVO.localPosition = new Vector3D(cx, cy, cz);
					pickingCollisionVO.localNormal = new Vector3D(nx, ny, nz);
					pickingCollisionVO.uv = this._pGetCollisionUV(indexData, uvData, index, v, w, u, uvOffset, uvStride);
					pickingCollisionVO.index = index;
//						pickingCollisionVO.subGeometryIndex = this.pGetMeshSubMeshIndex(renderable);

					// if not looking for best hit, first found will do...
					if (!this._findClosestCollision)
						return true;
				}
			}
		}


		if (collisionTriangleIndex >= 0)
			return true;

		return false;
	}
}

export = JSPickingCollider;