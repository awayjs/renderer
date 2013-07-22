/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
module away.bounds
{
	export class BoundingSphere extends away.bounds.BoundingVolumeBase
	{
		
		private _radius:number = 0;
		private _centerX:number = 0;
		private _centerY:number = 0;
		private _centerZ:number = 0;
		
		constructor()
		{
			super();
		}
		
		public get radius():number
		{
			return this._radius;
		}
		
		public nullify()
		{
			super.nullify();
			this._centerX = this._centerY = this._centerZ = 0;
			this._radius = 0;
		}
		
		public isInFrustum( planes:away.math.Plane3D[], numPlanes:number ):boolean
		{
			for( var i:number = 0; i < numPlanes; ++i )
			{
				var plane:away.math.Plane3D = planes[i];
				var flippedExtentX:number = plane.a < 0? -this._radius : this._radius;
				var flippedExtentY:number = plane.b < 0? -this._radius : this._radius;
				var flippedExtentZ:number = plane.c < 0? -this._radius : this._radius;
				var projDist:number = plane.a*( this._centerX + flippedExtentX ) + plane.b*( this._centerY + flippedExtentY) + plane.c*( this._centerZ + flippedExtentZ ) - plane.d;
				if( projDist < 0 )
				{
					return false;
				}
			}
			return true;
		}
		
		public fromSphere(center:away.geom.Vector3D, radius:number )
		{
			this._centerX = center.x;
			this._centerY = center.y;
			this._centerZ = center.z;
			this._radius = radius;
			this._pMax.x = this._centerX + radius;
			this._pMax.y = this._centerY + radius;
			this._pMax.z = this._centerZ + radius;
			this._pMin.x = this._centerX - radius;
			this._pMin.y = this._centerY - radius;
			this._pMin.z = this._centerZ - radius;
			this._pAabbPointsDirty = true;
			if( this._pBoundingRenderable )
			{
				this.pUpdateBoundingRenderable();
			}
		}
		
		public fromExtremes( minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number )
		{
			this._centerX = (maxX + minX)*.5;
			this._centerY = (maxY + minY)*.5;
			this._centerZ = (maxZ + minZ)*.5;
			
			var d:number = maxX - minX;
			var y:number = maxY - minY;
			var z:number = maxZ - minZ;
			if( y > d )
			{
				d = y;
			}
			if (z > d)
			{
				d = z;
			}
			this._radius = d*Math.sqrt(.5);
			super.fromExtremes( minX, minY, minZ, maxX, maxY, maxZ );
		}
		
		public clone():away.bounds.BoundingVolumeBase
		{
			var clone:BoundingSphere = new BoundingSphere();
			clone.fromSphere( new away.geom.Vector3D( this._centerX, this._centerY, this._centerZ), this._radius );
			return clone;
		}
		
		public rayIntersection( position:away.geom.Vector3D, direction:away.geom.Vector3D, targetNormal:away.geom.Vector3D):number
		{
			if ( this.containsPoint(position) )
			{
				return 0;
			}
			
			var px:number = position.x - this._centerX, py:number = position.y - this._centerY, pz:number = position.z - this._centerZ;
			var vx:number = direction.x, vy:number = direction.y, vz:number = direction.z;
			var rayEntryDistance:number;
			
			var a:number = vx*vx + vy*vy + vz*vz;
			var b:number = 2*( px*vx + py*vy + pz*vz );
			var c:number = px*px + py*py + pz*pz - this._radius * this._radius;
			var det:number = b*b - 4*a*c;
			
			if (det >= 0)
			{ // ray goes through sphere
				var sqrtDet:number = Math.sqrt(det);
				rayEntryDistance = ( -b - sqrtDet )/( 2*a );
				if( rayEntryDistance >= 0 )
				{
					targetNormal.x = px + rayEntryDistance*vx;
					targetNormal.y = py + rayEntryDistance*vy;
					targetNormal.z = pz + rayEntryDistance*vz;
					targetNormal.normalize();
					
					return rayEntryDistance;
				}
			}
			// ray misses sphere
			return -1;
		}
		
		public containsPoint( position:away.geom.Vector3D ):boolean
		{
			var px:number = position.x - this._centerX;
			var py:number = position.y - this._centerY;
			var pz:number = position.z - this._centerZ;
			var distance:number = Math.sqrt( px*px + py*py + pz*pz );
			return distance <= this._radius;
		}
		
		public pUpdateBoundingRenderable()
		{
			var sc:number = this._radius;
			if (sc == 0)
			{
				sc = 0.001;
			}
			this._pBoundingRenderable.scaleX = sc;
			this._pBoundingRenderable.scaleY = sc;
			this._pBoundingRenderable.scaleZ = sc;
			this._pBoundingRenderable.x = this._centerX;
			this._pBoundingRenderable.y = this._centerY;
			this._pBoundingRenderable.z = this._centerZ;
		}
		
		// TODO pCreateBoundingRenderable():WireframePrimitiveBase
		/**
		public function pCreateBoundingRenderable():WireframePrimitiveBase
		{
			return new WireframeSphere(1, 16, 12, 0xffffff, 0.5);
		}
		*/
		
		//@override
		public classifyToPlane( plane:away.math.Plane3D ):number
		{
			var a:number = plane.a;
			var b:number = plane.b;
			var c:number = plane.c;
			var dd:number = a*this._centerX + b*this._centerY + c*this._centerZ - plane.d;
			if( a < 0 )
			{
				a = -a;
			}
			if( b < 0 )
			{
				b = -b;
			}
			if( c < 0 )
			{
				c = -c;
			}
			var rr:Number = (a + b + c)*this._radius;
			
			return dd > rr? away.math.PlaneClassification.FRONT :
				dd < -rr? away.math.PlaneClassification.BACK :
				away.math.PlaneClassification.INTERSECT;
		}
		
		public transformFrom( bounds:away.bounds.BoundingVolumeBase, matrix:away.geom.Matrix3D)
		{
			var sphere:away.bounds.BoundingSphere = <away.bounds.BoundingSphere> bounds;
			var cx:number = sphere._centerX;
			var cy:number = sphere._centerY;
			var cz:number = sphere._centerZ;
			var raw:number[] = [];
			matrix.copyRawDataTo(raw);
			var m11:number = raw[0], m12:number = raw[4], m13:number = raw[8], m14:number = raw[12];
			var m21:number = raw[1], m22:number = raw[5], m23:number = raw[9], m24:number = raw[13];
			var m31:number = raw[2], m32:number = raw[6], m33:number = raw[10], m34:number = raw[14];
			
			this._centerX = cx*m11 + cy*m12 + cz*m13 + m14;
			this._centerY = cx*m21 + cy*m22 + cz*m23 + m24;
			this._centerZ = cx*m31 + cy*m32 + cz*m33 + m34;
			
			if (m11 < 0)
				m11 = -m11;
			if (m12 < 0)
				m12 = -m12;
			if (m13 < 0)
				m13 = -m13;
			if (m21 < 0)
				m21 = -m21;
			if (m22 < 0)
				m22 = -m22;
			if (m23 < 0)
				m23 = -m23;
			if (m31 < 0)
				m31 = -m31;
			if (m32 < 0)
				m32 = -m32;
			if (m33 < 0)
				m33 = -m33;
			var r:number = sphere._radius;
			var rx:number = m11 + m12 + m13;
			var ry:number = m21 + m22 + m23;
			var rz:number = m31 + m32 + m33;
			this._radius = r*Math.sqrt(rx*rx + ry*ry + rz*rz);
			
			this._pMin.x = this._centerX - this._radius;
			this._pMin.y = this._centerY - this._radius;
			this._pMin.z = this._centerZ - this._radius;
			
			this._pMax.x = this._centerX + this._radius;
			this._pMax.y = this._centerY + this._radius;
			this._pMax.z = this._centerZ + this._radius;
		}
	}
}