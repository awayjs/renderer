//<reference path="../src/away/utils/Timer.ts" />
//<reference path="../src/away/utils/getTimer.ts" />
///<reference path="../../../src/away/utils/RequestAnimationFrame.ts" />
//<reference path="../src/away/events/TimerEvent.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/RequestAnimationFrameTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/RequestAnimationFrameTest.js
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

window.onload = function ()
{

    var test = new RequestAnimationFrameTest();


}



