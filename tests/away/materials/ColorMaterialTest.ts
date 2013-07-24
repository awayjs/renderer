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

    constructor()
    {

        away.Debug.THROW_ERRORS = false;

        this.cm = new away.materials.ColorMaterial();

        this._stage = new away.display.Stage( 800, 600 );
        this._stage.stage3Ds[0].addEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
        this._stage.stage3Ds[0].requestContext();

    }

    private onContext3DCreateHandler( e )
    {
        this._stage.stage3Ds[0].removeEventListener( away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );

        var stage3D: away.display.Stage3D = <away.display.Stage3D> e.target;
        this._context3D = stage3D.context3D;

        //this.cm.specularMethod = new away.materials.BasicSpecularMethod();
        this.cm.iUpdateMaterial( this._context3D );

        //
        this.cm.iInvalidatePasses( null );

        //this.cm.iRenderPass( 0 , )

        console.log( this.cm );
        console.log( this.cm._pScreenPass );

    }

}

window.onload = function ()
{

    var test : MaterialsTest = new MaterialsTest();

}
