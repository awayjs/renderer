///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.render
{
    export class RenderTest
    {

        private scene           : away.containers.Scene;
        private sManager        : away.managers.StageGLManager;
        private stageGL          : away.base.StageGL;

        private dRenderer       : away.render.DefaultRenderer;
        constructor()
        {

            away.Debug.THROW_ERRORS  = false;

            this.scene      = new away.containers.Scene();
            this.sManager   = away.managers.StageGLManager.getInstance();
            this.stageGL     = this.sManager.getFreeStageGL();

            console.log( 'away.display.Stage' , this.scene );
            console.log( 'away.managers.StageGLManager' , this.sManager );
            console.log( 'away.managers.StageGLProxy' , this.stageGL );


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
