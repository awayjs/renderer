///<reference path="../_definitions.ts"/>

module away.primitives
{
	//TODO - convert to geometry primitive

	/**
	 * A WirefameCube primitive mesh.
	 */
	export class WireframeCube extends away.primitives.WireframePrimitiveBase
	{
		private _cubeDepth:number;
		private _cubeHeight:number;
		private _cubeWidth:number;

		/**
		 * The size of the cube along its Z-axis. Defaults to 100.
		 */
		public get cubeDepth():number
		{
			return this._cubeDepth;
		}

		public set cubeDepth(value:number)
		{
			if (this._cubeDepth == value)
				return;

			this._cubeDepth == value

			this.pInvalidateGeometry();
		}

		/**
		 * The size of the cube along its Y-axis. Defaults to 100.
		 */
		public get cubeHeight():number
		{
			return this._cubeHeight;
		}

		public set cubeHeight(value:number)
		{
			if (this._cubeHeight == value)
				return;

			this._cubeHeight == value

			this.pInvalidateGeometry();
		}

		/**
		 * The size of the cube along its X-axis. Defaults to 100.
		 */
		public get cubeWidth():number
		{
			return this._cubeWidth;
		}

		public set cubeWidth(value:number)
		{
			if (this._cubeWidth == value)
				return;

			this._cubeWidth == value

			this.pInvalidateGeometry();
		}

		/**
		 * Creates a new WireframeCube object.
		 *
		 * @param cubeWidth The size of the cube along its X-axis. Defaults to 100.
		 * @param cubeHeight The size of the cube along its Y-axis. Defaults to 100.
		 * @param cubeDepth The size of the cube along its Z-axis. Defaults to 100.
		 * @param color The colour of the wireframe lines. Defaults to <code>0xFFFFFF</code>.
		 * @param thickness The thickness of the wireframe lines. Defaults to 1.
		 */
		constructor(cubeWidth:number = 100, cubeHeight:number = 100, cubeDepth:number = 100, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);

			this._cubeWidth = cubeWidth;
			this._cubeHeight = cubeHeight;
			this._cubeDepth = cubeDepth;
		}

		/**
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{
			var v0:away.geom.Vector3D = new away.geom.Vector3D();
			var v1:away.geom.Vector3D = new away.geom.Vector3D();
			var hw:number = this._cubeWidth/2;
			var hh:number = this._cubeHeight/2;
			var hd:number = this._cubeDepth/2;

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
