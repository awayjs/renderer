///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/managers/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/managers/ManagersTest.js
//------------------------------------------------------------------------------------------------

class MaterialsTest
{

    private cm          : away.materials.ColorMaterial;

    private stage       : away.display.Stage;
    private sProxy      : away.managers.Stage3DProxy;
    private sManager    : away.managers.Stage3DManager;
    private imgLoader   : away.net.IMGLoader;
    private imgTx       : away.textures.HTMLImageElementTexture;
    private matTx       : away.materials.TextureMaterial;

    constructor()
    {

        away.Debug.THROW_ERRORS = false;

        var mipUrlRequest   = new away.net.URLRequest( '../../assets/1024x1024.png');

        this.imgLoader      = new away.net.IMGLoader();
        this.imgLoader.load( mipUrlRequest );
        this.imgLoader.addEventListener( away.events.Event.COMPLETE , this.imgLoaded , this );

        this.cm             = new away.materials.ColorMaterial();
        this.stage          = new away.display.Stage( 800, 600 );
        this.sManager       = away.managers.Stage3DManager.getInstance( this.stage );
        this.sProxy         = this.sManager.getStage3DProxy( 0 );

        this.cm.iInvalidatePasses( null );

        console.log( '-----------------------------------------------------------------------------' );
        console.log( '- ColorMaterial' );
        console.log( '-----------------------------------------------------------------------------' );
        console.log( 'this.cm ' , this.cm );
        console.log( 'iUpdateProgram' , this.cm._pScreenPass.iUpdateProgram( this.sProxy ) );
        console.log( 'iGetVertexCode' , this.cm._pScreenPass.iGetVertexCode() );
        console.log( 'iGetFragmentCode' , this.cm._pScreenPass.iGetFragmentCode(''));


    }

    private imgLoaded( e : away.events.Event )
    {

        this.imgTx = new away.textures.HTMLImageElementTexture( this.imgLoader.image )
        this.matTx = new away.materials.TextureMaterial( this.imgTx  );

        console.log( '-----------------------------------------------------------------------------' );
        console.log( '- TextureMaterial' );
        console.log( '-----------------------------------------------------------------------------' );
        console.log( 'this.matTx ' , this.matTx );
        console.log( 'iUpdateProgram' , this.matTx._pScreenPass.iUpdateProgram( this.sProxy ) );
        console.log( 'iGetVertexCode' , this.matTx._pScreenPass.iGetVertexCode() );
        console.log( 'iGetFragmentCode' , this.matTx._pScreenPass.iGetFragmentCode(''));

    }


}

window.onload = function ()
{

    var test : MaterialsTest = new MaterialsTest();

}
