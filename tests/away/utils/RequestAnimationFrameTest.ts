///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/utils/RequestAnimationFrameTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/utils/RequestAnimationFrameTest.js
//------------------------------------------------------------------------------------------------

class RequestAnimationFrameTest
{

    private requestAnimationFrameTimer : away.utils.RequestAnimationFrame;


    constructor()
    {

        this.requestAnimationFrameTimer = new away.utils.RequestAnimationFrame( this.tick , this );
        this.requestAnimationFrameTimer.start()

        document.onmousedown = ( e ) => this.onMouseDown( e );

    }

    private onMouseDown( e )
    {

        console.log( 'mouseDown');

        if ( this.requestAnimationFrameTimer.active )
        {

            this.requestAnimationFrameTimer.stop();

        }
        else
        {

            this.requestAnimationFrameTimer.start();

        }

    }

    private tick( dt : number )
    {

        console.log( 'tick' );

    }


}



var GL = null;//: WebGLRenderingContext;

window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");
    var test = new RequestAnimationFrameTest();


}



