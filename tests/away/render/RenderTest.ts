///<reference path="../../../lib/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.render
{
    export class RenderTest
    {

        private stage           : away.display.Stage;
        private sManager        : away.managers.Stage3DManager;
        private sProxy          : away.managers.Stage3DProxy;

        private dRenderer       : away.render.DefaultRenderer;
        constructor()
        {

            away.Debug.THROW_ERRORS  = false;

            this.stage      = new away.display.Stage();
            this.sManager   = away.managers.Stage3DManager.getInstance( this.stage );
            this.sProxy     = this.sManager.getStage3DProxy( 0 );

            console.log( 'away.display.Stage' , this.stage );
            console.log( 'away.managers.Stage3DManager' , this.sManager );
            console.log( 'away.managers.Stage3DProxy' , this.sProxy );


            this.dRenderer = new away.render.DefaultRenderer();

            console.log( 'away.render.DefaultRenderer' , this.dRenderer );



        }

        public onContextCreated( e : away.events.Stage3DEvent ) : void
        {

            away.Debug.log( 'onContextCreated' , e );

        }

        public onContextReCreated( e : away.events.Stage3DEvent ) : void
        {

            away.Debug.log( 'onContextReCreated' , e );

        }

        public onContextDisposed( e : away.events.Stage3DEvent ) : void
        {

            away.Debug.log( 'onContextDisposed' , e );

        }

    }
}
