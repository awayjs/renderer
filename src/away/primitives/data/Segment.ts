///<reference path="../../_definitions.ts"/>

module away.primitives
{
	export class Segment
	{
		public _pSegmentsBase:away.entities.SegmentSet;
		public _pThickness:number;
		public _pStart:away.geom.Vector3D;
		public _pEnd:away.geom.Vector3D;
		public _pStartR:number;
		public _pStartG:number;
		public _pStartB:number;
		public _pEndR:number;
		public _pEndG:number;
		public _pEndB:number;
		
		private _index:number = -1;
		private _subSetIndex:number = -1;
		private _startColor:number;
		private _endColor:number;
		
		constructor( start:away.geom.Vector3D, end:away.geom.Vector3D, anchor:away.geom.Vector3D, colorStart:number = 0x333333, colorEnd:number = 0x333333, thickness:number = 1 )
		{
			// TODO: not yet used: for CurveSegment support
			anchor = null;
			
			this._pThickness = thickness * 0.5;
			// TODO: add support for curve using anchor v1
			// Prefer removing v1 from this, and make Curve a separate class extending Segment? (- David)
			this._pStart = start;
			this._pEnd = end;
			this.startColor = colorStart;
			this.endColor = colorEnd;
		}
		
		public updateSegment( start:away.geom.Vector3D, end:away.geom.Vector3D, anchor:away.geom.Vector3D, colorStart:number = 0x333333, colorEnd:number = 0x333333, thickness:number = 1 )
		{
			// TODO: not yet used: for CurveSegment support
			anchor = null;
			this._pStart = start;
			this._pEnd = end;
			
			if( this._startColor != colorStart )
			{
				this.startColor = colorStart;
			}
			if( this._endColor != colorEnd )
			{
				this.endColor = colorEnd;
			}
			this._pThickness = thickness * 0.5;
			this.update();
		}
		
		public get start():away.geom.Vector3D
		{
			return this._pStart;
		}
		
		
		public set start( value:away.geom.Vector3D )
		{
			this._pStart = value;
			this.update();
		}
		
		public get end():away.geom.Vector3D
		{
			return this._pEnd;
		}
		
		public set end( value:away.geom.Vector3D )
		{
			this._pEnd = value;
			this.update();
		}
		
		public get thickness():number
		{
			return this._pThickness * 2;
		}
		
		public set thickness( value:number )
		{
			this._pThickness = value * 0.5;
			this.update();
		}
		
		public get startColor():number
		{
			return this._startColor;
		}
		
		public set startColor( color:number )
		{
			this._pStartR = ( ( color >> 16 ) & 0xff )/255;
			this._pStartG = ( ( color >> 8 ) & 0xff )/255;
			this._pStartB = ( color & 0xff )/255;
			
			this._startColor = color;
			
			this.update();
		}
		
		public get endColor():number
		{
			return this._endColor;
		}
		
		public set endColor( color:number )
		{
			this._pEndR = ( ( color >> 16 ) & 0xff )/255;
			this._pEndG = ( ( color >> 8 ) & 0xff )/255;
			this._pEndB = ( color & 0xff )/255;
			
			this._endColor = color;
			
			this.update();
		}
		
		public dispose()
		{
			this._pStart = null;
			this._pEnd = null;
		}
		
		public get iIndex():number
		{
			return this._index;
		}
		
		public set iIndex( ind:number )
		{
			this._index = ind;
		}
		
		public get iSubSetIndex():number
		{
			return this._subSetIndex;
		}
		
		public set iSubSetIndex( ind:number )
		{
			this._subSetIndex = ind;
		}
		
		public set iSegmentsBase( segBase:away.entities.SegmentSet )
		{
			this._pSegmentsBase = segBase;
		}
		
		private update()
		{
			if( !this._pSegmentsBase )
			{
				return;
			}
			this._pSegmentsBase.iUpdateSegment( this );
		}
	}
}