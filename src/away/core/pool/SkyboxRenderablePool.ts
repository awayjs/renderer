///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 * @class away.pool.SkyboxRenderablePool
	 */
	export class SkyboxRenderablePool
	{
		private _pool:Object = new Object();

		public getItem(skybox:away.entities.Skybox):SkyboxRenderable
		{
			return <SkyboxRenderable> (this._pool[skybox.id] || (this._pool[skybox.id] = new SkyboxRenderable(skybox)))
		}

		public dispose(skybox:away.entities.Skybox)
		{
			this._pool[skybox.id] = null;
		}

		public disposeAll()
		{
			this._pool = new Object();
		}
	}
}