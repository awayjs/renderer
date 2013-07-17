///<reference path="../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/ManagersTest.js
//------------------------------------------------------------------------------------------------

class ManagersTest
{

    private stage       : away.display.Stage;
    private sManager    : away.managers.Stage3DManager;
    private sProxy      : away.managers.Stage3DProxy;

    constructor()
    {

        away.utils.Debug.THROW_ERRORS                           = false;

        this.stage                                              = new away.display.Stage();

        var manager         : away.managers.Stage3DManager      = away.managers.Stage3DManager.getInstance( this.stage );

        var stage3DProxy    : away.managers.Stage3DProxy        = manager.getStage3DProxy( 0 );

            stage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_CREATED , this.onContextCreated , this );
            stage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextReCreated , this );
            stage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_DISPOSED, this.onContextDisposed , this );


    }

    public onContextCreated( e : away.events.Stage3DEvent ) : void
    {

        away.utils.Debug.log( 'onContextCreated' , e );

    }

    public onContextReCreated( e : away.events.Stage3DEvent ) : void
    {

        away.utils.Debug.log( 'onContextReCreated' , e );

    }

    public onContextDisposed( e : away.events.Stage3DEvent ) : void
    {

        away.utils.Debug.log( 'onContextDisposed' , e );

    }

}

var GL = null;//: WebGLRenderingContext;
var test: ManagersTest;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    test = new ManagersTest();

}


