///<reference path="../../_definitions.ts" />

module away.cameras
{
	export class ObliqueNearPlaneLens extends away.cameras.LensBase
	{

		private _baseLens:away.cameras.LensBase;
		private _plane:away.geom.Plane3D;

		constructor(baseLens:away.cameras.LensBase, plane:away.geom.Plane3D)
		{
			super();
			this.baseLens = baseLens;
			this.plane = plane;
		}

		//@override
		public get frustumCorners():number[]
		{
			return this._baseLens.frustumCorners;
		}

		//@override
		public get near():number
		{
			return this._baseLens.near;
		}

		//@override
		public set near(value:number)
		{
			this._baseLens.near = value;
		}

		//@override
		public get far():number
		{
			return this._baseLens.far;
		}

		//@override
		public set far(value:number)
		{
			this._baseLens.far = value;
		}

		//@override
		public get iAspectRatio():number
		{
			return this._baseLens.iAspectRatio;
		}

		//@override
		public set iAspectRatio(value:number)
		{
			this._baseLens.iAspectRatio = value;
		}

		public get plane():away.geom.Plane3D
		{
			return this._plane;
		}

		public set plane(value:away.geom.Plane3D)
		{
			this._plane = value;
			this.pInvalidateMatrix();
		}

		public set baseLens(value:away.cameras.LensBase)
		{
			if (this._baseLens) {
				this._baseLens.removeEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);
			}
			this._baseLens = value;

			if (this._baseLens) {
				this._baseLens.addEventListener(away.events.LensEvent.MATRIX_CHANGED, this.onLensMatrixChanged, this);
			}
			this.pInvalidateMatrix();
		}

		private onLensMatrixChanged(event:away.events.LensEvent)
		{
			this.pInvalidateMatrix();
		}

		//@override
		public pUpdateMatrix()
		{
			this._pMatrix.copyFrom(this._baseLens.matrix);

			var cx:number = this._plane.a;
			var cy:number = this._plane.b;
			var cz:number = this._plane.c;
			var cw:number = -this._plane.d + .05;
			var signX:number = cx >= 0? 1 : -1;
			var signY:number = cy >= 0? 1 : -1;
			var p:away.geom.Vector3D = new away.geom.Vector3D(signX, signY, 1, 1);
			var inverse:away.geom.Matrix3D = this._pMatrix.clone();
			inverse.invert();
			var q:away.geom.Vector3D = inverse.transformVector(p);
			this._pMatrix.copyRowTo(3, p);
			var a:number = (q.x*p.x + q.y*p.y + q.z*p.z + q.w*p.w)/(cx*q.x + cy*q.y + cz*q.z + cw*q.w);
			this._pMatrix.copyRowFrom(2, new away.geom.Vector3D(cx*a, cy*a, cz*a, cw*a));
		}
	}
}