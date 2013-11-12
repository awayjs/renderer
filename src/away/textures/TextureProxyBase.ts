

///<reference path="../_definitions.ts"/>

module away.textures
{

	export class TextureProxyBase extends away.library.NamedAssetBase implements away.library.IAsset
	{
		private _format         : string = away.display3D.Context3DTextureFormat.BGRA;
		private _hasMipmaps     : boolean = false;

		private _textures       : away.display3D.TextureBase[];
		private _dirty          : away.display3D.Context3D[];

		public _pWidth          : number;
        public _pHeight         : number;

		constructor()
		{

            super();

            this._textures      = new Array<away.display3D.TextureBase>( 8 );//_textures = new Vector.<TextureBase>(8);
            this._dirty         = new Array<away.display3D.Context3D>( 8 );//_dirty = new Vector.<Context3D>(8);

		}

        /**
         *
         * @returns {boolean}
         */
		public get hasMipMaps() : boolean
		{
			return this._hasMipmaps;
		}

        /**
         *
         * @returns {string}
         */
		public get format() : string
		{
			return this._format;
		}

        /**
         *
         * @returns {string}
         */
		public get assetType() : string
		{
			return away.library.AssetType.TEXTURE;
		}

        /**
         *
         * @returns {number}
         */
		public get width() : number
		{
			return this._pWidth;
		}

        /**
         *
         * @returns {number}
         */
		public get height() : number
		{
			return this._pHeight;
		}

		public getTextureForStage3D(stage3DProxy : away.managers.Stage3DProxy) : away.display3D.TextureBase
		{
			var contextIndex : number = stage3DProxy._iStage3DIndex;

			var tex : away.display3D.TextureBase = this._textures[contextIndex];

			var context : away.display3D.Context3D = stage3DProxy._iContext3D;//_context3D;

			if (!tex || this._dirty[contextIndex] != context)
            {

				this._textures[contextIndex] = tex = this.pCreateTexture(context);
				this._dirty[contextIndex] = context;
				this.pUploadContent(tex);//_pUploadContent

			}

			return tex;
		}

        /**
         *
         * @param texture
         * @private
         */
		public pUploadContent(texture : away.display3D.TextureBase) : void
		{

            throw new away.errors.AbstractMethodError();

		}

        /**
         *
         * @param width
         * @param height
         * @private
         */
		public pSetSize(width : number, height : number) : void
		{

			if (this._pWidth != width || this._pHeight != height)
            {

                this.pInvalidateSize();

            }

            this._pWidth     = width;
            this._pHeight    = height;

		}

        /**
         *
         */
		public invalidateContent() : void
		{

			for (var i : number = 0; i < 8; ++i)
            {

				this._dirty[i] = null;

			}

		}

        /**
         *
         * @private
         */
		public pInvalidateSize() : void
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

        /**
         *
         * @param context
         * @private
         */
		public pCreateTexture( context : away.display3D.Context3D) : away.display3D.TextureBase
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