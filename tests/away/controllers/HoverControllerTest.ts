///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.controllers{

    export class HoverControllerTest
    {

        private _view           : away.containers.View;
        private _timer          : away.utils.RequestAnimationFrame;
        private _light          : away.lights.DirectionalLight;
        private _lightPicker    : away.materials.StaticLightPicker;
        private _hoverControl   : away.controllers.HoverController;

        private _move           : boolean = false;
        private _lastPanAngle   : number;
        private _lastTiltAngle  : number;
        private _lastMouseX     : number;
        private _lastMouseY     : number;
        private _wireframeCube  : away.primitives.WireframeCube;

        constructor()
        {

            this._view                = new away.containers.View(new away.render.DefaultRenderer());

            this._wireframeCube         = new away.primitives.WireframeCube( 400 , 400 , 400 )
            this._view.scene.addChild( this._wireframeCube );

            this._hoverControl          = new away.controllers.HoverController( this._view.camera , this._wireframeCube , 150, 10);

            window.onresize             = () => this.resize();

            document.onmousedown        = ( e ) => this.onMouseDownHandler( e );
            document.onmouseup          = ( e ) => this.onMouseUpHandler( e );
            document.onmousemove        = ( e ) => this.onMouseMove( e );


            this.resize();

            this._timer                 = new away.utils.RequestAnimationFrame( this.render , this );
            this._timer.start();

        }

        private resize( )
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }

        private render( dt : number ) //animate based on dt for firefox
        {
            this._view.render();

        }

        private onMouseUpHandler( e  )
        {
            this._move = false;
        }

        private onMouseMove( e )
        {
            if (this._move)
            {
                this._hoverControl.panAngle = 0.3 * (e.clientX - this._lastMouseX) + this._lastPanAngle;
                this._hoverControl.tiltAngle = 0.3 * (e.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        }

        private onMouseDownHandler( e  )
        {
            this._lastPanAngle      = this._hoverControl.panAngle;
            this._lastTiltAngle     = this._hoverControl.tiltAngle;
            this._lastMouseX        = e.clientX;//e.clientX;
            this._lastMouseY        = e.clientY;//e.clientX;
            this._move              = true;
        }

    }

}