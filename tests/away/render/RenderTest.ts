///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/managers/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/managers/ManagersTest.js
//------------------------------------------------------------------------------------------------

class RenderTest
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

        this.dRenderer = new away.render.DefaultRenderer();
        console.log( this.dRenderer );


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

var test: RenderTest;
window.onload = function ()
{


    test = new RenderTest();

}
