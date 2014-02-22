///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.SkyboxRenderable
	 */
	export class SkyboxRenderable extends RenderableBase
	{
		// TODO: Replace with CompactSubGeometry
		private static _geometry:away.base.SubGeometry;

		constructor(skybox:away.entities.Skybox)
		{
			super(skybox, skybox, null, null);

			if (!SkyboxRenderable._geometry) {
				SkyboxRenderable._geometry = new away.base.SubGeometry();
				SkyboxRenderable._geometry.updateVertexData(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
				SkyboxRenderable._geometry.updateIndexData(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			}

			this.subGeometry = SkyboxRenderable._geometry;
		}
	}
}