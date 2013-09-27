///<reference path="../_definitions.ts" />

module away.bounds
{
	export class NullBounds extends away.bounds.BoundingVolumeBase
	{
		
		private _alwaysIn:boolean;
		private _renderable:away.primitives.WireframePrimitiveBase;
		
		constructor( alwaysIn:boolean = true, renderable:away.primitives.WireframePrimitiveBase = null )
		{
			super();
			this._alwaysIn = alwaysIn;
			this._renderable = renderable;
			this._pMax.x = this._pMax.y = this._pMax.z = Number.POSITIVE_INFINITY;
			this._pMin.x = this._pMin.y = this._pMin.z = this._alwaysIn ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
		}
		
		//@override
		public clone():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.NullBounds( this._alwaysIn );
		}
		
		//@override
		public pCreateBoundingRenderable():away.primitives.WireframePrimitiveBase
		{
			//return this._renderable || new away.primitives.WireframeSphere( 100, 16, 12, 0xffffff, 0.5 );
			return null;
		}
		
		//@override
		public isInFrustum(planes:away.math.Plane3D[], numPlanes:number ):boolean
		{
			planes = planes;
			numPlanes = numPlanes;
			return this._alwaysIn;
		}
		
		//@override
		public fromGeometry( geometry:away.base.Geometry )
		{
		}

		//@override
		public fromSphere( center:away.geom.Vector3D, radius:number )
		{
		}
		
		//@override
		public fromExtremes( minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number )
		{
		}
		
		public classifyToPlane( plane:away.math.Plane3D ):number
		{
			plane = plane;
			return away.math.PlaneClassification.INTERSECT;
		}
		
		//@override
		public transformFrom( bounds:away.bounds.BoundingVolumeBase, matrix:away.geom.Matrix3D )
		{
			matrix = matrix;
			var nullBounds:away.bounds.NullBounds = <away.bounds.NullBounds> bounds;
			this._alwaysIn = nullBounds._alwaysIn;
		}
	}
}