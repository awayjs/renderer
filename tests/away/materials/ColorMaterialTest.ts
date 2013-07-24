///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/managers/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/managers/ManagersTest.js
//------------------------------------------------------------------------------------------------

class MaterialsTest
{

    private cm          : away.materials.ColorMaterial;

    private _stage      : away.display.Stage;
    private _context3D  : away.display3D.Context3D;
    private sProxy      : away.managers.Stage3DProxy;

    constructor()
    {

        //this._stageProxy = new away.managers.Stage3DProxy();

        away.Debug.THROW_ERRORS = false;

        this.cm = new away.materials.ColorMaterial();

        this._stage = new away.display.Stage( 800, 600 );
        //this._stage.stage3Ds[0].addEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
        //this._stage.stage3Ds[0].requestContext();


        var manager : away.managers.Stage3DManager = away.managers.Stage3DManager.getInstance( this._stage );

        this.sProxy = manager.getStage3DProxy( 0 );

        this.sProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_CREATED , this.onContextCreated , this );
        //stage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextReCreated , this );
        //stage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_DISPOSED, this.onContextDisposed , this );

    }

    private onContextCreated( e )
    {

        console.log( 'onContextCreated' );
        //this._stage.stage3Ds[0].removeEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );

        //var stage3D: away.display.Stage3D = <away.display.Stage3D> e.target;
        //this._context3D = stage3D.context3D;

        //this.cm.specularMethod = new away.materials.BasicSpecularMethod();
        this.cm.iUpdateMaterial( this._context3D );

        //

        this.cm.iInvalidatePasses( null );

        //this.cm.iRenderPass( 0 , )

        console.log( this.cm );
        console.log( this.cm._pScreenPass.iUpdateProgram( this.sProxy ) );
        console.log( this.cm._pScreenPass.iGetVertexCode() );
        console.log( this.cm._pScreenPass.iGetFragmentCode(''));

    }

}

window.onload = function ()
{

    var test : MaterialsTest = new MaterialsTest();

}
