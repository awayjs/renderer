///<reference path="../_definitions.ts"/>

module away.primitives
{
	export class WireframePrimitiveBase extends away.entities.SegmentSet
	{
		private _geomDirty:boolean = true;
		private _color:number;
		private _thickness:number;

		constructor(color:number = 0xffffff, thickness:number = 1)
		{
			super();
			if (thickness <= 0) {
				thickness = 1;
			}
			this._color = color;
			this._thickness = thickness;
		}

		public get color():number
		{
			return this._color;
		}

		public set color(value:number)
		{
			this._color = value;

			this._pSubGeometry._iSetColor(value);
		}

		public get thickness():number
		{
			return this._thickness;
		}

		public set thickness(value:number)
		{
			this._thickness = value;

			this._pSubGeometry._iSetThickness(value);
		}

		//@override
		public removeAllSegments()
		{
			super.removeAllSegments();
		}

		public pBuildGeometry()
		{
			throw new away.errors.AbstractMethodError();
		}

		public pInvalidateGeometry():void
		{
			this.pInvalidateBounds();

			this._geomDirty = true;
		}

		private updateGeometry():void
		{
			this.pBuildGeometry();

			this._geomDirty = false;
		}

		public pUpdateBounds()
		{
			if (this._geomDirty)
				this.updateGeometry();

			super.pUpdateBounds();
		}

		public pUpdateOrAddSegment(index:number, v0:away.geom.Vector3D, v1:away.geom.Vector3D)
		{
			var segment:away.base.Segment;
			var s:away.geom.Vector3D;
			var e:away.geom.Vector3D;

			if ((segment = this.getSegment(index)) != null) {
				s = segment.start;
				e = segment.end;
				s.x = v0.x;
				s.y = v0.y;
				s.z = v0.z;
				e.x = v1.x;
				e.y = v1.y;
				e.z = v1.z;
				segment.updateSegment(s, e, null, this._color, this._color, this._thickness);
			} else {
				this.addSegment(new away.primitives.LineSegment(v0.clone(), v1.clone(), this._color, this._color, this._thickness));
			}
		}
	}
}