///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 *
	 * @class away.pool.TextureDataBase
	 */
	export class TextureDataBase
	{
		public _pStageGL:away.base.StageGL;

		public _pTexture:away.gl.TextureBase;

		private _dirty:boolean;

		constructor(stageGL:away.base.StageGL)
		{
			this._pStageGL = stageGL;
		}

		/**
		 *
		 */
		public getTexture():away.gl.TextureBase
		{
			if (!this._pTexture) {
				this._pCreateTexture();
				this._dirty = true;
			}

			if (this._dirty) {
				this._dirty = false;
				this._pUpdateContent();
			}

			return this._pTexture;
		}

		/**
		 *
		 */
		public dispose()
		{
			this._pTexture.dispose();
			this._pTexture = null;
		}

		/**
		 *
		 */
		public invalidate()
		{
			this._dirty = true;
		}

		public _pCreateTexture()
		{
			throw new away.errors.AbstractMethodError();
		}

		public _pUpdateContent()
		{
			throw new away.errors.AbstractMethodError();
		}
	}
}
