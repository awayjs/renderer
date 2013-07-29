///<reference path="../_definitions.ts"/>

module away.primitives
{
	//import flash.geom.Vector3D;
	
	/**
	 * A WirefameCube primitive mesh.
	 */
	export class WireframeCube extends away.primitives.WireframePrimitiveBase
	{
		private _width:number;
		private _height:number;
		private _depth:number;
		
		/**
		 * Creates a new WireframeCube object.
		 * @param width The size of the cube along its X-axis.
		 * @param height The size of the cube along its Y-axis.
		 * @param depth The size of the cube along its Z-axis.
		 * @param color The colour of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 */
		constructor(width:number = 100, height:number = 100, depth:number = 100, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);
			
			this._width = width;
            this._height = height;
            this._depth = depth;
		}
		
		/**
		 * The size of the cube along its X-axis.
		 */
		public get width():number
		{
			return this._width;
		}
		
		public set width(value:number)
		{
            this._width = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * The size of the cube along its Y-axis.
		 */
		public get height():number
		{
			return this._height;
		}
		
		public set height(value:number)
		{
			if (value <= 0)
				throw new Error("Value needs to be greater than 0");
            this._height = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * The size of the cube along its Z-axis.
		 */
		public get depth():number
		{
			return this._depth;
		}
		
		public set depth(value:number)
		{
            this._depth = value;
            this.pInvalidateGeometry();
		}
		
		/**
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{
			var v0:away.geom.Vector3D = new away.geom.Vector3D();
			var v1:away.geom.Vector3D = new away.geom.Vector3D();
			var hw:number = this._width*.5;
			var hh:number = this._height*.5;
			var hd:number = this._depth*.5;
			
			v0.x = -hw;
			v0.y = hh;
			v0.z = -hd;
			v1.x = -hw;
			v1.y = -hh;
			v1.z = -hd;
			
			this.pUpdateOrAddSegment(0, v0, v1);
			v0.z = hd;
			v1.z = hd;
            this.pUpdateOrAddSegment(1, v0, v1);
			v0.x = hw;
			v1.x = hw;
            this.pUpdateOrAddSegment(2, v0, v1);
			v0.z = -hd;
			v1.z = -hd;
            this.pUpdateOrAddSegment(3, v0, v1);
			
			v0.x = -hw;
			v0.y = -hh;
			v0.z = -hd;
			v1.x = hw;
			v1.y = -hh;
			v1.z = -hd;
            this.pUpdateOrAddSegment(4, v0, v1);
			v0.y = hh;
			v1.y = hh;
            this.pUpdateOrAddSegment(5, v0, v1);
			v0.z = hd;
			v1.z = hd;
            this.pUpdateOrAddSegment(6, v0, v1);
			v0.y = -hh;
			v1.y = -hh;
            this.pUpdateOrAddSegment(7, v0, v1);
			
			v0.x = -hw;
			v0.y = -hh;
			v0.z = -hd;
			v1.x = -hw;
			v1.y = -hh;
			v1.z = hd;
            this.pUpdateOrAddSegment(8, v0, v1);
			v0.y = hh;
			v1.y = hh;
            this.pUpdateOrAddSegment(9, v0, v1);
			v0.x = hw;
			v1.x = hw;
            this.pUpdateOrAddSegment(10, v0, v1);
			v0.y = -hh;
			v1.y = -hh;
            this.pUpdateOrAddSegment(11, v0, v1);
		}
	}
}
