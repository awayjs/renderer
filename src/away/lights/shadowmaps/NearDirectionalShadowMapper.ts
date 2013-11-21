///<reference path="../../_definitions.ts" />

module away.lights
{
	import Camera3D = away.cameras.Camera3D;

	export class NearDirectionalShadowMapper extends DirectionalShadowMapper
	{
		private _coverageRatio:number;

		constructor(coverageRatio:number = .5)
		{
			super();
			this.coverageRatio = coverageRatio;
		}

		/**
		 * A value between 0 and 1 to indicate the ratio of the view frustum that needs to be covered by the shadow map.
		 */
		public get coverageRatio():number
		{
			return this._coverageRatio;
		}

		public set coverageRatio(value:number)
		{
			if (value > 1)
				value = 1; else if (value < 0)
				value = 0;

			this._coverageRatio = value;
		}

		public pUpdateDepthProjection(viewCamera:Camera3D)
		{
			var corners:Array<number> = viewCamera.lens.frustumCorners;

			for (var i:number /*int*/ = 0; i < 12; ++i) {
				var v:number = corners[i];
				this._pLocalFrustum[i] = v;
				this._pLocalFrustum[i + 12] = v + (corners[i + 12] - v)*this._coverageRatio;
			}

			this.pUpdateProjectionFromFrustumCorners(viewCamera, this._pLocalFrustum, this._pMatrix);
			this._pOverallDepthLens.matrix = this._pMatrix;
		}
	}
}
