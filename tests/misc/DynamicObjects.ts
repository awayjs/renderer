///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/TimerTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/TimerTest.js
//------------------------------------------------------------------------------------------------

class TimerTest
{

    private oneSecondTimer  : away.utils.Timer;


    constructor()
    {

        var IamATimerClass : any = away.utils.Timer;

        this.oneSecondTimer = new IamATimerClass( );

        this.oneSecondTimer.delay = 1000;
        this.oneSecondTimer.addEventListener(away.events.TimerEvent.TIMER , away.utils.Delegate.create(this, this.onSecTimerEvent) );
        this.oneSecondTimer.start();


    }

    private onSecTimerEvent( e : away.events.TimerEvent ) : void
    {

        console.log('onSecTimerEvent, tick');

    }

}

window.onload = function ()
{

    var test = new TimerTest();


}

