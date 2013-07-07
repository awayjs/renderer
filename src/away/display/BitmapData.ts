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
        private _imageData          : ImageData;
        private _rect               : away.geom.Rectangle;
        private _transparent        : boolean;
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

                this.fillRect( this._rect , fillColor );

            }

        }

        // Public

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
         * @param r
         * @param g
         * @param b
         * @param a
         */
        public setPixel(x, y, r, g, b, a):void
        {

            if ( ! this._locked )
            {

                this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

            }

            if ( this._imageData )
            {

                var index : number = (x + y * this._imageCanvas.width) * 4;

                this._imageData.data[index+0] = r;
                this._imageData.data[index+1] = g;
                this._imageData.data[index+2] = b;
                this._imageData.data[index+3] = a;

            }

            if ( ! this._locked )
            {

                this._context.putImageData( this._imageData, 0, 0);
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

                this._context.fillStyle = '#' + this.decimalToHex( color , 6 );
                this._context.fillRect( rect.x , rect.y , rect.width , rect.height );

                if ( this._imageData )
                {


                    this._imageData = this._context.getImageData(0,0,this._rect.width,this._rect.height);

                }

            }
            else
            {

                this._context.fillStyle = '#' + this.decimalToHex( color , 6 );
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

        // Private

        /**
         * convert decimal value to Hex
         */
        private decimalToHex(d : number , padding : number ) : string
        {

            // TODO - bitwise replacement would be better / Extract alpha component of 0xffffffff ( currently no support for alpha )

            var hex = d.toString(16).toUpperCase();
            padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

            while (hex.length < padding)
            {

                hex = "0" + hex;

            }

            return hex;

        }
    }


}