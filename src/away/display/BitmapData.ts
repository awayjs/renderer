///<reference path="../_definitions.ts" />

module away.display {

    /**
     *
     */
    export class BitmapData
    {

        private _imageCanvas        : HTMLCanvasElement;
        private _context            : CanvasRenderingContext2D;
        private _imageData          : ImageData;
        private _rect               : away.geom.Rectangle;
        private _transparent        : boolean;
        private _alpha              : number = 1;
        private _locked             : boolean = false;


        /**
         *
         * @param width
         * @param height
         * @param transparent
         * @param fillColor
         */
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

                if( this._transparent)
                {

                    this._alpha = away.utils.ColorUtils.float32ColorToARGB( fillColor )[0] / 255;
                    //this._context.globalAlpha = this._alpha;

                }
                else
                {

                    this._alpha = 1;

                }


                this.fillRect( this._rect , fillColor );

            }

        }

        // Public
        /*
        public draw ( source : BitmapData, matrix : away.geom.Matrix = null ) //, colorTransform, blendMode, clipRect, smoothing) {
        {

            var sourceMatrix : away.geom.Matrix     = ( matrix === null ) ? matrix : new  away.geom.Matrix();
            var sourceRect : away.geom.Rectangle    = new away.geom.Rectangle(0, 0, source.width, source.height);

            this._imageCanvas.width     = source.width;
            this._imageCanvas.height    = source.height;

            this._context.transform(
                sourceMatrix.a,
                sourceMatrix.b,
                sourceMatrix.c,
                sourceMatrix.d,
                sourceMatrix.tx,
                sourceMatrix.ty);

            this.copyPixels(source , source.rect , source.rect );
        }
        */

        /**
         *
         */
        public dispose():void
        {

            this._context = null;
            this._imageCanvas = null
            this._imageData = null;
            this._rect = null;
            this._transparent = null;
            this._locked = null;

        }
        /**
         *
         */
        public lock():void
        {

            this._locked    = true;
            this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

        }

        /**
         *
         */
        public unlock():void
        {

            this._locked = false;

            if ( this._imageData )
            {

                this._context.putImageData( this._imageData, 0, 0); // at coords 0,0
                this._imageData = null;

            }

        }

        /**
         *
         * @param x
         * @param y
         * @param color
         */
        public setPixel(x, y, color : number ):void
        {

            var argb : Array = away.utils.ColorUtils.float32ColorToARGB( color );

            if ( ! this._locked )
            {

                this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

            }

            if ( this._imageData )
            {

                var index : number = (x + y * this._imageCanvas.width) * 4;

                this._imageData.data[index+0] = argb[1];
                this._imageData.data[index+1] = argb[2];
                this._imageData.data[index+2] = argb[3];
                this._imageData.data[index+3] = 255;

            }

            if ( ! this._locked )
            {

                this._context.putImageData( this._imageData, 0, 0);
                //this._context.globalAlpha = this._alpha;
                this._imageData = null;

            }

        }

        /**
         *
         * @param x
         * @param y
         * @param color
         */
        public setPixel32(x, y, color : number ):void
        {

            var argb : Array = away.utils.ColorUtils.float32ColorToARGB( color );

            if ( ! this._locked )
            {

                this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

            }

            if ( this._imageData )
            {

                var index : number = (x + y * this._imageCanvas.width) * 4;

                this._imageData.data[index+0] = argb[1];
                this._imageData.data[index+1] = argb[2];
                this._imageData.data[index+2] = argb[3];
                this._imageData.data[index+3] = argb[0];

            }

            if ( ! this._locked )
            {

                this._context.putImageData( this._imageData, 0, 0);
                //this._context.globalAlpha = this._alpha;
                this._imageData = null;

            }

        }

        /**
         *
         * @param img
         * @param sourceRect
         * @param destRect
         */
        public copyImage( img : HTMLImageElement , sourceRect : away.geom.Rectangle , destRect:away.geom.Rectangle ):void
        {

            //this._context.globalAlpha = this._alpha;

            if ( this._locked )
            {

                // If canvas is locked:
                //
                //      1) copy image data back to canvas
                //      2) draw object
                //      3) read _imageData back out



                if (  this._imageData )
                {

                    this._context.putImageData( this._imageData, 0, 0); // at coords 0,0

                }

                this._context.drawImage(img , sourceRect.x ,sourceRect.y,sourceRect.width,sourceRect.height,destRect.x,destRect.y,destRect.width,destRect.height );

                if ( this._imageData )
                {


                    this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

                }

            }
            else
            {

                this._context.drawImage(img , sourceRect.x ,sourceRect.y,sourceRect.width,sourceRect.height,destRect.x,destRect.y,destRect.width,destRect.height );

            }

        }

        /**
         *
         * @param bmpd
         * @param sourceRect
         * @param destRect
         */
        public copyPixels( bmpd : BitmapData, sourceRect : away.geom.Rectangle , destRect:away.geom.Rectangle ):void
        {

            //this._context.globalAlpha = this._alpha;

            if ( this._locked )
            {

                // If canvas is locked:
                //
                //      1) copy image data back to canvas
                //      2) draw object
                //      3) read _imageData back out

                if (  this._imageData )
                {

                    this._context.putImageData( this._imageData, 0, 0); // at coords 0,0

                }

                this._context.drawImage( bmpd.canvas , sourceRect.x , sourceRect.y , sourceRect.width , sourceRect.height , destRect.x , destRect.y , destRect.width , destRect.height );

                if ( this._imageData )
                {


                    this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

                }

            }
            else
            {

                this._context.drawImage( bmpd.canvas , sourceRect.x , sourceRect.y , sourceRect.width , sourceRect.height , destRect.x , destRect.y , destRect.width , destRect.height );

            }

        }

        /**
         *
         * @param rect
         * @param color
         */
        public fillRect( rect : away.geom.Rectangle , color : number ) : void
        {

            if ( this._locked )
            {

                // If canvas is locked:
                //
                //      1) copy image data back to canvas
                //      2) apply fill
                //      3) read _imageData back out

                if (  this._imageData )
                {

                    this._context.putImageData( this._imageData, 0, 0); // at coords 0,0

                }

                this._context.fillStyle = this.decimalToHex( color );
                this._context.fillRect( rect.x , rect.y , rect.width , rect.height );

                if ( this._imageData )
                {


                    this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

                }

            }
            else
            {

                this._context.fillStyle = this.decimalToHex( color );
                this._context.fillRect( rect.x , rect.y , rect.width , rect.height );


            }


        }

        // Get / Set

        /**
         *
         * @param {ImageData}
         */
        public set imageData( value : ImageData )
        {

            this._context.putImageData( value , 0 , 0 );

        }

        /**
         *
         * @returns {ImageData}
         */
        public get imageData() : ImageData
        {

            return this._context.getImageData(0,0,this._rect.width,this._rect.height)

        }

        /**
         *
         * @returns {number}
         */
        public get width() : number
        {

            return <number> this._imageCanvas.width;

        }

        /**
         *
         * @param {number}
         */
        public set width( value : number )
        {

            this._rect.width = value;
            this._imageCanvas.width = value;

        }

        /**
         *
         * @returns {number}
         */
        public get height() : number
        {

            return <number> this._imageCanvas.height;

        }

        /**
         *
         * @param {number}
         */
        public set height( value : number )
        {

            this._rect.height = value;
            this._imageCanvas.height = value;

        }

        /**
         *
         * @param {away.geom.Rectangle}
         */
        public get rect() : away.geom.Rectangle
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
         *
         * @returns {HTMLCanvasElement}
         */
        public get context() : CanvasRenderingContext2D
        {

            return this._context;

        }

        // Private

        /**
         * convert decimal value to Hex
         */
        private decimalToHex(d : number ) : string
        {

            var argb : Array = away.utils.ColorUtils.float32ColorToARGB( d );

            if ( ! this._transparent )
            {

                argb[0] = 255;

                return 'rgb(' + argb[1] + ',' + argb[2]+ ',' + argb[3] + ')';

            }

            return 'rgba(' + argb[1] + ',' + argb[2]+ ',' + argb[3]+ ',' + argb[0] /255 + ')';

        }
    }


}