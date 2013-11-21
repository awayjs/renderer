///<reference path="../../_definitions.ts"/>

module away.cameras
{
	export class FreeMatrixLens extends away.cameras.LensBase
	{
		constructor()
		{
			super();
			this._pMatrix.copyFrom(new away.cameras.PerspectiveLens().matrix);
		}

		//@override
		public set near(value:number)
		{
			this._pNear = value;
		}

		//@override
		public set far(value:number)
		{
			this._pFar = value;
		}

		//@override
		public set iAspectRatio(value:number)
		{
			this._pAspectRatio = value;
		}

		//@override
		public clone():away.cameras.LensBase
		{
			var clone:away.cameras.FreeMatrixLens = new away.cameras.FreeMatrixLens();
			clone._pMatrix.copyFrom(this._pMatrix);
			clone._pNear = this._pNear;
			clone._pFar = this._pFar;
			clone._pAspectRatio = this._pAspectRatio;
			clone.pInvalidateMatrix();
			return clone;
		}

		//@override
		public pUpdateMatrix()
		{
			this._pMatrixInvalid = false;
		}
	}
}