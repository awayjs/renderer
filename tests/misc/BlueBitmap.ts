///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/HTMLImageElementTextureTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/HTMLImageElementTextureTest.js
//------------------------------------------------------------------------------------------------

// $ProjectFileDir$/away/AppHarness.ts --target ES5 --comments --out $ProjectFileDir$/bin/AppHarness.js

class BlueTest
{


    private bitmapD         : away.display.BitmapData;

    constructor()
    {

        var array = [ 1,2,3,4];
        for (var v in array) // for acts as a foreach
        {
            console.log (array[v]);
        }


        //var i : away.library.AssetLibraryIterator = new away.library.AssetLibraryIterator();

        console.log ( 'hello' );
        this.bitmapD = new away.display.BitmapData( 800 , 600 , false , 0x0000ff );

        document.body.appendChild( this.bitmapD.canvas );

        var uiGTest : Uint8ClampedArray =new Uint8ClampedArray( 3 );


        this.float32ColorToRGB( 0xff000000 , '0xff000000');
        this.float32ColorToRGB( 0x00ff0000 , '0x00ff0000');
        this.float32ColorToRGB( 0x00ff0000 , '0x00ff0000');
        this.float32ColorToRGB( 0x000000ff , '0x000000ff' );

        this.float32ColorToRGB( 0xff000000 , '0xff000000');
        this.float32ColorToRGB( 0xffff0000 , '0xffff0000');
        this.float32ColorToRGB( 0xff00ff00 , '0xff00ff00');
        this.float32ColorToRGB( 0xff0000ff , '0xff0000ff' );
        this.float32ColorToRGB( 0x00000000 , '0x00000000' );
        this.float32ColorToRGB( 0xffffffff , '0xffffffff' );


        this.float32ColorToRGB( 0xff000000 , '0xff000000');
        this.float32ColorToRGB( 0xffff0000 , '0xffff0000');
        this.float32ColorToRGB( 0xfA00ff00 , '0xfa00ff00');
        this.float32ColorToRGB( 0xCA0000ff , '0xCA0000ff' );
        this.float32ColorToRGB( 0xBC000000 , '0xBC000000' );
        this.float32ColorToRGB( 0xADFFFFFF , '0xADFFFFFF' );
        this.float32ColorToRGB( 0x11FFFFFF , '0x11FFFFFF' );
        this.float32ColorToRGB( 0x01FFFFFF , '0x01FFFFFF' );

        console.log( '------------------------------------------------------------')

        this.float32ColorToRGB( 0xff0000 , '0xff0000' );
        this.float32ColorToRGB( 0xffff00 , '0xffff00' );
        this.float32ColorToRGB( 0xff00ff , '0xff00ff');
        this.float32ColorToRGB( 0xffffff , '0xffffff');
        this.float32ColorToRGB( 0x000000 , '0x000000');
        this.float32ColorToRGB( 0x000000 , '0x0000ff');
        this.float32ColorToRGB( 0x000000 , '0x00ff00');

        /*
            console.log( this.binToRGB( 0xff00ff ));

            // 32-bit


            var hex = 0xffff0000;

            console.log( hex );

            var r = ( hex & 0xff000000 ) >> 24;
            var g = ( hex & 0x00ff0000 ) >> 16;
            var b = ( hex & 0x0000ff00 ) >> 8;
            var a = hex & 0xff;

            var hex = 0xffff0000;

            var r = ( hex & 0xff000000 ) >> 24;
            var g = ( hex & 0x00ff0000 ) >> 16;
            var b = ( hex & 0x0000ff00 ) >> 8;
            var a = hex & 0xff;

            console.log( '-----------------------------A');
            console.log( 'r: ' + r , 'g: ' + g , 'b: ' + b , 'a: ' + a );
            console.log( '-----------------------------');


            // 32-bit
            var hex = a << 24 | r << 16 | g << 8 | b;
            console.log( 'hex: ' + hex );

            console.log( this.binToRGB ( 0xff00ff ));

            var hex = 0xffffffff;
            alert( ((hex & 0xff000000) >>> 24) );
            alert( (hex & 0xff0000) >>> 16 );
            alert( (hex & 0xff00) >>> 8 );
            alert( hex & 0xff );
    */
    }

    public float32ColorToRGB( float32Color : number , str : string )
    {

        console.log('-------------------------------------------------');

        var r : number = ( float32Color & 0xff000000 ) >>> 24
        var g : number = ( float32Color & 0xff0000 ) >>> 16;
        var b : number = ( float32Color & 0xff00 ) >>> 8;
        var a : number = float32Color & 0xff;

        var result : Array = [r, g , b , a ];
        console.log( str , result )
        return result;

        //----------------------------------------
        //
        //----------------------------------------


    }
    /**
     * convert decimal value to Hex
     */
    private f32ToHex(d : number , padding : number ) : string
    {

        // TODO - bitwise replacement would be better / Extract alpha component of 0xffffffff ( currently no support for alpha )

        var hex = d.toString(16).toUpperCase();

        while (hex.length < padding)
        {

            hex = "0" + hex;

        }

        return hex;

    }


}

var test: BlueTest;
window.onload = function ()
{

    test = new BlueTest();


}
