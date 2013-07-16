

///<reference path="../../_definitions.ts"/>

module away.materials
{
	//import flash.display.*;
	//import flash.display3D.textures.CubeTexture;
	//import flash.display3D.textures.Texture;
	//import flash.display3D.textures.TextureBase;
	//import flash.geom.*;

	/**
	 * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
	 */
	export class MipmapGenerator
	{
		private static _matrix  : away.geom.Matrix          = new away.geom.Matrix();
        private static _rect    : away.geom.Rectangle       = new away.geom.Rectangle();
        private static _source  : away.display.BitmapData;//= new away.display.BitmapData();

        /**
         * Uploads a BitmapData with mip maps to a target Texture object.
         * @param source
         * @param target The target Texture to upload to.
         * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
         * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
         */
        public static generateHTMLImageElementMipMaps( source : HTMLImageElement , target : away.display3D.TextureBase , mipmap : away.display.BitmapData = null, alpha:boolean = false, side:number = -1)
        {

            MipmapGenerator._rect.width     = source.width;
            MipmapGenerator._rect.height    = source.height;

            MipmapGenerator._source = new away.display.BitmapData( source.width , source.height , alpha );
            MipmapGenerator._source.copyImage( source , MipmapGenerator._rect , MipmapGenerator._rect );

            MipmapGenerator.generateMipMaps( MipmapGenerator._source , target , mipmap );

            MipmapGenerator._source.dispose();
            MipmapGenerator._source = null;



        }
		/**
		 * Uploads a BitmapData with mip maps to a target Texture object.
		 * @param source The source BitmapData to upload.
		 * @param target The target Texture to upload to.
		 * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
		 * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
		 */
		public static generateMipMaps( source : away.display.BitmapData , target : away.display3D.TextureBase , mipmap : away.display.BitmapData = null, alpha:boolean = false, side:number = -1)
		{
			var w       : number    = source.width;
		    var h       : number    = source.height;
            var regen   : boolean   = mipmap != null;
			var i       : number;

            if ( ! mipmap )
            {

                mipmap = new away.display.BitmapData(w, h, alpha);


            }

            MipmapGenerator._rect.width = w;
            MipmapGenerator._rect.height = h;

            var tx : away.display3D.Texture;
			
			while (w >= 1 || h >= 1) {

				if (alpha){

					mipmap.fillRect(MipmapGenerator._rect, 0);

                }

                MipmapGenerator._matrix.a   = MipmapGenerator._rect.width / source.width;
                MipmapGenerator._matrix.d   = MipmapGenerator._rect.height / source.height;

                mipmap.width                = MipmapGenerator._rect.width;
                mipmap.height               = MipmapGenerator._rect.height;
                mipmap.copyPixels( source , source.rect , MipmapGenerator._rect );

                //console.log( target instanceof away.display3D.Texture , mipmap.width , mipmap.height );

                if ( target instanceof away.display3D.Texture)
                {

                    tx = <away.display3D.Texture> target;

                    mipmap.imageData;// TODO: upload to texture from imageData;
                    //tx.uploadFromHTMLImageElement()
                    //Texture(target).uploadFromBitmapData(mipmap, i++);


                }
                else
                {

                    // TODO: implement cube texture upload;
                    //CubeTexture(target).uploadFromBitmapData(mipmap, side, i++);

                }

				w >>= 1;
				h >>= 1;

                MipmapGenerator._rect.width = w > 1? w : 1;
                MipmapGenerator._rect.height = h > 1? h : 1;
			}
			
			if ( ! regen )
            {

                mipmap.dispose();

            }

		}
	}
}
