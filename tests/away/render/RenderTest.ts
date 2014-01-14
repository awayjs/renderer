///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.render
{
    export class RenderTest
    {

        private stage           : away.display.Stage;
        private sManager        : away.managers.StageGLManager;
        private sProxy          : away.managers.StageGLProxy;

        private dRenderer       : away.render.DefaultRenderer;
        constructor()
        {

            away.Debug.THROW_ERRORS  = false;

            this.stage      = new away.display.Stage();
            this.sManager   = away.managers.StageGLManager.getInstance( this.stage );
            this.sProxy     = this.sManager.getStageGLProxy( 0 );

            console.log( 'away.display.Stage' , this.stage );
            console.log( 'away.managers.StageGLManager' , this.sManager );
            console.log( 'away.managers.StageGLProxy' , this.sProxy );


            this.dRenderer = new away.render.DefaultRenderer();

            console.log( 'away.render.DefaultRenderer' , this.dRenderer );



        }

        public onContextCreated( e : away.events.StageGLEvent ) : void
        {

            away.Debug.log( 'onContextCreated' , e );

        }

        public onContextReCreated( e : away.events.StageGLEvent ) : void
        {

            away.Debug.log( 'onContextReCreated' , e );

        }

        public onContextDisposed( e : away.events.StageGLEvent ) : void
        {

            away.Debug.log( 'onContextDisposed' , e );

        }

    }
}
