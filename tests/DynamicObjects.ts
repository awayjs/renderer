///<reference path="../src/away/utils/Timer.ts" />

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
        this.oneSecondTimer.addEventListener(away.events.TimerEvent.TIMER , this.onSecTimerEvent , this );
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

