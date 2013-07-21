///<reference path="../../../src/away/_definitions.ts" />


//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/EventsTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/EventsTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class EDTest extends away.events.EventDispatcher
    {

        constructor()
        {

            super();

            console.log( 'Before addEventListener: ' , this.hasEventListener( away.events.Event.COMPLETE  ) ) ;
            this.addEventListener( away.events.Event.COMPLETE , this.onComplete , this );
            console.log( 'After addEventListener: ' , this.hasEventListener( away.events.Event.COMPLETE  ) ) ;
            this.removeEventListener( away.events.Event.COMPLETE , this.onComplete , this );
            console.log( 'After removeEventListener: ' , this.hasEventListener( away.events.Event.COMPLETE  ) )  ;

        }

        public onComplete( e )
        {


        }

    }


}

window.onload = function ()
{

    var test = new tests.EDTest();

}

