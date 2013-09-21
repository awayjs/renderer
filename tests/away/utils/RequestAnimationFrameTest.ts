///<reference path="../../../lib/Away3D.next.d.ts" />
module tests.away.utils{

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

}