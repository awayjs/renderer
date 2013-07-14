/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="../geom/Vector3D.ts" />
///<reference path="../errors/AbstractMethodError.ts" />
///<reference path="../primitives/WireframePrimitiveBase.ts" />

module away.bounds
{
	export class BoundingVolumeBase
	{
		
		public _pMin:away.geom.Vector3D;
		public _pMax:away.geom.Vector3D;
		public _pAabbPoints:number[] = [];
		public _pAabbPointsDirty:boolean = true;
		public _pBoundingRenderable:away.primitives.WireframePrimitiveBase;
		
		constructor()
		{
			this._pMin = new away.geom.Vector3D();
			this._pMax = new away.geom.Vector3D();
		}
		
		public get max():away.geom.Vector3D
		{
			return this._pMax;
		}
		
		public get min():away.geom.Vector3D
		{
			return this._pMin;
		}
		
		public get aabbPoints():number[]
		{
			if( this._pAabbPointsDirty )
			{
				this.pUpdateAABBPoints();
			}
			return this._pAabbPoints;
		}
		
		public get boundingRenderable():away.primitives.WireframePrimitiveBase
		{
			if( !this._pBoundingRenderable )
			{
				this._pBoundingRenderable = this.pCreateBoundingRenderable();
				this.pUpdateBoundingRenderable();
			}
			return this._pBoundingRenderable;
		}
		
		public nullify()
		{
			this._pMin.x = this._pMin.y = this._pMin.z = 0;
			this._pMax.x = this._pMax.y = this._pMax.z = 0;
			this._pAabbPointsDirty = true;
			
			if( this._pBoundingRenderable )
			{
				this.pUpdateBoundingRenderable();
			}
		}
		
		public disposeRenderable()
		{
			if( this._pBoundingRenderable )
			{
				this._pBoundingRenderable.dispose();
			}
			this._pBoundingRenderable = null;
		}
		
		public fromVertices( vertices:number[] )
		{
			var i:number;
			var len:number = vertices.length;
			var minX:number, minY:number, minZ:number;
			var maxX:number, maxY:number, maxZ:number;
			
			if( len == 0 )
			{
				this.nullify();
				return;
			}
			
			var v:number;
			
			minX = maxX = vertices[i++];
			minY = maxY = vertices[i++];
			minZ = maxZ = vertices[i++];
			
			while( i < len )
			{
				v = vertices[i++];
				if (v < minX)
					minX = v;
				else if (v > maxX)
					maxX = v;
				v = vertices[i++];
				if (v < minY)
					minY = v;
				else if (v > maxY)
					maxY = v;
				v = vertices[i++];
				if (v < minZ)
					minZ = v;
				else if (v > maxZ)
					maxZ = v;
			}
			
			this.fromExtremes( minX, minY, minZ, maxX, maxY, maxZ );
		}
		
		/* TODO
		public fromGeometry(geometry:Geometry):void
		{
			var subGeoms:Vector.<ISubGeometry> = geometry.subGeometries;
			var numSubGeoms:uint = subGeoms.length;
			var minX:Number, minY:Number, minZ:Number;
			var maxX:Number, maxY:Number, maxZ:Number;
			
			if (numSubGeoms > 0) {
				var j:uint = 0;
				minX = minY = minZ = Number.POSITIVE_INFINITY;
				maxX = maxY = maxZ = Number.NEGATIVE_INFINITY;
				
				while (j < numSubGeoms) {
					var subGeom:ISubGeometry = subGeoms[j++];
					var vertices:Vector.<Number> = subGeom.vertexData;
					var vertexDataLen:uint = vertices.length;
					var i:uint = subGeom.vertexOffset;
					var stride:uint = subGeom.vertexStride;
					
					while (i < vertexDataLen) {
						var v:Number = vertices[i];
						if (v < minX)
							minX = v;
						else if (v > maxX)
							maxX = v;
						v = vertices[i + 1];
						if (v < minY)
							minY = v;
						else if (v > maxY)
							maxY = v;
						v = vertices[i + 2];
						if (v < minZ)
							minZ = v;
						else if (v > maxZ)
							maxZ = v;
						i += stride;
					}
				}
				
				fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
			} else
				fromExtremes(0, 0, 0, 0, 0, 0);
		}
		*/
		
		public fromSphere( center:away.geom.Vector3D, radius:number)
		{
			this.fromExtremes( center.x - radius, center.y - radius, center.z - radius, center.x + radius, center.y + radius, center.z + radius );
		}
		
		public fromExtremes( minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number )
		{
			this._pMin.x = minX;
			this._pMin.y = minY;
			this._pMin.z = minZ;
			this._pMax.x = maxX;
			this._pMax.y = maxY;
			this._pMax.z = maxZ;
			this._pAabbPointsDirty = true;
			
			if( this._pBoundingRenderable )
			{
				this.pUpdateBoundingRenderable();
			}
		}
		
		public isInFrustum( planes:away.math.Plane3D[], numPlanes:number ):boolean
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public overlaps( bounds:away.bounds.BoundingVolumeBase ):boolean
		{
			var min:away.geom.Vector3D = bounds._pMin;
			var max:away.geom.Vector3D = bounds._pMax;
			return this._pMax.x > min.x &&
				this._pMin.x < max.x &&
				this._pMax.y > min.y &&
				this._pMin.y < max.y &&
				this._pMax.z > min.z &&
				this._pMin.z < max.z;
		}
		
		public clone():away.bounds.BoundingVolumeBase
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public rayIntersection( position:away.geom.Vector3D, direction:away.geom.Vector3D, targetNormal:away.geom.Vector3D ):number
		{
			position = position;
			direction = direction;
			targetNormal = targetNormal;
			return -1;
		}
		
		public containsPoint( position:away.geom.Vector3D ):boolean
		{
			position = position;
			return false;
		}
		
		public pUpdateAABBPoints()
		{
			var maxX:number = this._pMax.x;
			var maxY:number = this._pMax.y;
			var maxZ:number = this._pMax.z;
			var minX:number = this._pMin.x;
			var minY:number = this._pMin.y;
			var minZ:number = this._pMin.z;
			
			this._pAabbPoints[0] = minX;
			this._pAabbPoints[1] = minY;
			this._pAabbPoints[2] = minZ;
			this._pAabbPoints[3] = maxX;
			this._pAabbPoints[4] = minY;
			this._pAabbPoints[5] = minZ;
			this._pAabbPoints[6] = minX;
			this._pAabbPoints[7] = maxY;
			this._pAabbPoints[8] = minZ;
			this._pAabbPoints[9] = maxX;
			this._pAabbPoints[10] = maxY;
			this._pAabbPoints[11] = minZ;
			this._pAabbPoints[12] = minX;
			this._pAabbPoints[13] = minY;
			this._pAabbPoints[14] = maxZ;
			this._pAabbPoints[15] = maxX;
			this._pAabbPoints[16] = minY;
			this._pAabbPoints[17] = maxZ;
			this._pAabbPoints[18] = minX;
			this._pAabbPoints[19] = maxY;
			this._pAabbPoints[20] = maxZ;
			this._pAabbPoints[21] = maxX;
			this._pAabbPoints[22] = maxY;
			this._pAabbPoints[23] = maxZ;
			this._pAabbPointsDirty = false;
		}
		
		public pUpdateBoundingRenderable()
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pCreateBoundingRenderable():away.primitives.WireframePrimitiveBase
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public classifyToPlane(plane:away.math.Plane3D):number
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public transformFrom( bounds:away.bounds.BoundingVolumeBase, matrix:away.geom.Matrix3D )
		{
			throw new away.errors.AbstractMethodError();
		}
	}
}