///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/managers/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/managers/ManagersTest.js
//------------------------------------------------------------------------------------------------

class ManagersTest
{

    private stage       : away.display.Stage;
    private sManager    : away.managers.Stage3DManager;
    private sProxy      : away.managers.Stage3DProxy;

    private geomBase    : away.base.SubGeometryBase = new away.base.SubGeometryBase();
    private geom        : away.base.Geometry = new away.base.Geometry();
    private rttBfrA     : away.managers.RTTBufferManager;
    private rttBfrB     : away.managers.RTTBufferManager;

    constructor()
    {

        away.Debug.THROW_ERRORS = false;

        this.stage = new away.display.Stage();

        var manager : away.managers.Stage3DManager = away.managers.Stage3DManager.getInstance( this.stage );

        this.sProxy = manager.getStage3DProxy( 0 );
        this.sProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_CREATED , this.onContextCreated , this );
        this.sProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextReCreated , this );
        this.sProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_DISPOSED, this.onContextDisposed , this );

        this.rttBfrA = away.managers.RTTBufferManager.getInstance( this.sProxy )
        this.rttBfrB = away.managers.RTTBufferManager.getInstance( this.sProxy )

        console.log( 'this.rttBfrA' , this.rttBfrA );
        console.log( 'this.rttBfrB' , this.rttBfrB );

        this.rttBfrB.dispose();

        console.log( 'this.rttBfrA' , this.rttBfrA );
        console.log( 'this.rttBfrB' , this.rttBfrB );



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

var GL = null;//: WebGLRenderingContext;
var test: ManagersTest;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    test = new ManagersTest();

}
