///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.events {

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
