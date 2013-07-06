///<reference path="../net/IMGLoader.ts" />
///<reference path="../geom/Rectangle.ts" />
///<reference path="../geom/Point.ts" />

module away.display {

    /**
     *
     */
    export class BitmapData
    {

        private _imageCanvas        : HTMLCanvasElement;
        private _context            : CanvasRenderingContext2D;
        private _rect               : away.geom.Rectangle;
        private _transparent        : boolean;

        //private _imageImageLoader   : away.net.IMGLoader;

        constructor( width : number, height : number , transparent : boolean = true, fillColor : number = null )
        {

            this._transparent           = transparent;
            this._imageCanvas           = <HTMLCanvasElement> document.createElement( "canvas" );
            this._imageCanvas.width     = width;
            this._imageCanvas.height    = height;
            this._context               = this._imageCanvas.getContext( "2d" );
            this._rect                  = new away.geom.Rectangle( 0 , 0 , width , height );

            if ( fillColor )
            {

                this.fillRect( this._rect , fillColor );

            }


        }


        public copyImage( img : HTMLImageElement , sourceRect : away.geom.Rectangle , destRect:away.geom.Rectangle ):void
        {

            this._context.drawImage(img , sourceRect.x ,sourceRect.y,sourceRect.width,sourceRect.height,destRect.x,destRect.y,destRect.width,destRect.height );

        }

        public copyPixels( bmpd : BitmapData, sourceRect : away.geom.Rectangle , destRect:away.geom.Rectangle ):void
        {

            this._context.drawImage( bmpd.canvas , sourceRect.x , sourceRect.y , sourceRect.width , sourceRect.height , destRect.x , destRect.y , destRect.width , destRect.height );

        }

        /* http://www.w3schools.com/tags/canvas_drawimage.asp
        public copyPixels( img : HTMLImageElement ,sx : number ,sy : number ,swidth,sheight,x,y,width,height);
        {

            this._context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

        }
        */

        /**
         *
         * @param rect
         * @param color
         */
        public fillRect( rect : away.geom.Rectangle , color : number ) : void
        {

            this._context.fillStyle = '#' + this.decimalToHex( color , 6 );
            this._context.fillRect( rect.x , rect.y , rect.width , rect.height );

        }

        /**
         *
         * @returns {HTMLCanvasElement}
         */
        public get width()
        {

            return <number> this._imageCanvas.width;

        }
        public set width( value : number )
        {

            this._rect.width = value;
            this._imageCanvas.width = value;

        }

        public get height()
        {

            return <number> this._imageCanvas.height;

        }
        public set height( value : number )
        {

            this._rect.height = value;
            this._imageCanvas.height = value;

        }

        public get rect()
        {

            return this._rect;

        }

        /**
         *
         * @returns {HTMLCanvasElement}
         */
        public get canvas()
        {

            return this._imageCanvas;

        }

        /**
         * convert decimal value to Hex
         */
        private decimalToHex(d : number , padding : number )
        {

            var hex = d.toString(16).toUpperCase(); // Bit hackey - bitwise replacement would be better;
            padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

            while (hex.length < padding)
            {
                hex = "0" + hex;
            }

            return hex;

        }
    }


}