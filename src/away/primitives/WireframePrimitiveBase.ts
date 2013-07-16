/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.primitives
{
	export class WireframePrimitiveBase extends away.entities.SegmentSet
	{
		private _geomDirty:boolean = true;
		private _color:number;
		private _thickness:number;
		
		constructor( color:number = 0xffffff, thickness:number = 1 )
		{
			super();
			if( thickness <= 0 )
			{
				thickness = 1;
			}
			this._color = color;
			this._thickness = thickness;
			//mouseEnabled = mouseChildren = false;
		}
		
		public get color():number
		{
			return this._color;
		}
		
		public set color( value:number )
		{
			this._color = value;
			
			for( var segRef in this._pSegments )
			{
				segRef.segment.startColor = segRef.segment.endColor = value;
			}
		}
		
		public get thickness():number
		{
			return this._thickness;
		}
		
		public set thickness( value:number )
		{
			this._thickness = value;
			
			for( var segRef in this._pSegments)
			{
				segRef.segment.thickness = segRef.segment.thickness = value;
			}
		}
		
		//@override
		public removeAllSegments()
		{
			super.removeAllSegments();
		}
		
		//@override
		public getBounds():away.bounds.BoundingVolumeBase
		{
			if( this._geomDirty )
			{
				this.updateGeometry();
			}
			return super.getBounds();
		}
		
		public pBuildGeometry()
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pInvalidateGeometry():void
		{
			this._geomDirty = true;
			this.pInvalidateBounds();
		}
		
		private updateGeometry():void
		{
			this.pBuildGeometry();
			this._geomDirty = false;
		}
		
		public pUpdateOrAddSegment( index:number, v0:away.geom.Vector3D, v1:away.geom.Vector3D )
		{
			var segment:away.primitives.Segment;
			var s:away.geom.Vector3D;
			var e:away.geom.Vector3D;
			
			if( (segment = this.getSegment(index)) != null )
			{
				s = segment.start;
				e = segment.end;
				s.x = v0.x;
				s.y = v0.y;
				s.z = v0.z;
				e.x = v1.x;
				e.y = v1.y;
				e.z = v1.z;
				segment.updateSegment(s, e, null, this._color, this._color, this._thickness );
			}
			else
			{
				throw new away.errors.PartialImplementationError();
				//TODO this.addSegment(new LineSegment( v0.clone(), v1.clone(), this._color, this._color, this._thickness) );
			}
		}
		
		//@override
		public pUpdateMouseChildren():void
		{
			throw new away.errors.PartialImplementationError();
			//TODO this._ancestorsAllowMouseEnabled = false;
		}
		
	}
}