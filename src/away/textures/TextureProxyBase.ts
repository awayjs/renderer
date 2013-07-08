///<reference path="../library/assets/IAsset.ts" />


module away3d.textures
{

	export class TextureProxyBase extends NamedAssetBase implements IAsset
	{
		private _format : string = Context3DTextureFormat.BGRA;
		private _hasMipmaps : boolean = true;

		private _textures : Vector.<TextureBase>;
		private _dirty : Vector.<Context3D>;

		private _width : number;
		private _height : number;

		constructor()
		{
			_textures = new Vector.<TextureBase>(8);
			_dirty = new Vector.<Context3D>(8);
		}

		public get hasMipMaps() : boolean
		{
			return _hasMipmaps;
		}

		public get format() : string
		{
			return _format;
		}
		
		public get assetType() : string
		{
			return AssetType.TEXTURE;
		}

		public get width() : number
		{
			return _width;
		}

		public get height() : number
		{
			return _height;
		}

		public getTextureForStage3D(stage3DProxy : Stage3DProxy) : TextureBase
		{
			var contextIndex : number = stage3DProxy._stage3DIndex;
			var tex : TextureBase = _textures[contextIndex];
			var context : Context3D = stage3DProxy._context3D;

			if (!tex || _dirty[contextIndex] != context) {
				_textures[contextIndex] = tex = createTexture(context);
				_dirty[contextIndex] = context;
				uploadContent(tex);
			}

			return tex;
		}

		protected function uploadContent(texture : TextureBase) : void
		{
			throw new AbstractMethodError();
		}

		protected function setSize(width : number, height : number) : void
		{
			if (_width != width || _height != height)
				invalidateSize();

			_width = width;
			_height = height;
		}

		public invalidateContent() : void
		{
			for (var i : number = 0; i < 8; ++i) {
				_dirty[i] = null;
			}
		}

		protected function invalidateSize() : void
		{
			var tex : TextureBase;
			for (var i : number = 0; i < 8; ++i) {
				tex = _textures[i];
				if (tex) {
					tex.dispose();
					_textures[i] = null;
					_dirty[i] = null;
				}
			}
		}



		protected function createTexture(context : Context3D) : TextureBase
		{
			throw new AbstractMethodError();
		}

		/**
		 * @inheritDoc
		 */
		public dispose() : void
		{
			for (var i : number = 0; i < 8; ++i)
				if (_textures[i]) _textures[i].dispose();
		}
	}
}