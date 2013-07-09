///<reference path="../library/assets/IAsset.ts" />
///<reference path="../library/assets/NamedAssetBase.ts" />
///<reference path="../display3D/Context3D.ts" />
///<reference path="../display3D/TextureBase.ts" />
///<reference path="../display3D/Context3DTextureFormat.ts" />
///<reference path="../errors/AbstractMethodError.ts" />


module away.textures
{

	export class TextureProxyBase extends away.library.NamedAssetBase implements away.library.IAsset
	{
		private _format         : string = away.display3D.Context3DTextureFormat.BGRA;
		private _hasMipmaps     : boolean = true;

		private _textures       : away.display3D.TextureBase[];
		private _dirty          : away.display3D.Context3D[];

		private _width          : number;
		private _height         : number;

		constructor()
		{

            super();

            this._textures = new Array<away.display3D.TextureBase>( 8 );//_textures = new Vector.<TextureBase>(8);
            this._dirty = new Array<away.display3D.Context3D>( 8 );//_dirty = new Vector.<Context3D>(8);

		}

		public get hasMipMaps() : boolean
		{
			return this._hasMipmaps;
		}

		public get format() : string
		{
			return this._format;
		}
		
		public get assetType() : string
		{
			return away.library.AssetType.TEXTURE;
		}

		public get width() : number
		{
			return this._width;
		}

		public get height() : number
		{
			return this._height;
		}

        /* TODO: implement Stage3DProxy
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
        */
		public _pUploadContent(texture : away.display3D.TextureBase) : void
		{

            throw new away.errors.AbstractMethodError();

		}

		public _pSetSize(width : number, height : number) : void
		{
			if (this._width != width || this._height != height)
                this._pInvalidateSize();

            this._width     = width;
            this._height    = height;

		}

		public invalidateContent() : void
		{

			for (var i : number = 0; i < 8; ++i)
            {

				this._dirty[i] = null;

			}

		}

		public _pInvalidateSize() : void
		{
			var tex : away.display3D.TextureBase;
			for (var i : number = 0; i < 8; ++i)
            {

				tex = this._textures[i];

				if (tex)
                {
					tex.dispose();

					this._textures[i]   = null;
					this._dirty[i]      = null;

				}

			}

		}



		public _pCreateTexture( context : away.display3D.Context3D) : away.display3D.TextureBase
		{
            throw new away.errors.AbstractMethodError();
		}

		/**
		 * @inheritDoc
		 */
		public dispose() : void
		{
			for (var i : number = 0; i < 8; ++i)
            {

                if (this._textures[i])
                {

                    this._textures[i].dispose();
                }

            }

		}

	}
}