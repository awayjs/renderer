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
    private specM       : away.materials.BasicSpecularMethod;

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

        this.imgTx                  = new away.textures.HTMLImageElementTexture( this.imgLoader.image )
        this.matTx                  = new away.materials.TextureMaterial( this.imgTx  );
        this.matTx.colorTransform   = new away.geom.ColorTransform( 1 , 1 , 1 , 1 );

        this.specM                  = new away.materials.BasicSpecularMethod();
        this.specM.texture          = this.imgTx;
        this.specM.gloss            = 3;
        this.specM.specularColor    = 0xff0000;

        this.matTx.specularMethod   =  this.specM;
        this.matTx.ambientTexture   =  this.imgTx;
        this.matTx.alpha            = .5;
        //this.matTx.blendMode        = away.display.BlendMode.MULTIPLY;

        console.log( '-----------------------------------------------------------------------------' );
        console.log( '- TextureMaterial' );
        console.log( '-----------------------------------------------------------------------------' );
        console.log( 'this.matTx ' , this.matTx );
        console.log( 'iUpdateProgram' , this.matTx._pScreenPass.iUpdateProgram( this.sProxy ) );
        console.log( 'iGetVertexCode' , this.matTx._pScreenPass.iGetVertexCode() );
        console.log( 'iGetFragmentCode' , this.matTx._pScreenPass.iGetFragmentCode(''));

        /*

         -----------------------------------------------------------------------------
         - cm:
         -----------------------------------------------------------------------------

             iGetVertexCode

                m44 op, vt0, vc0

             iGetFragmentCode mov ft0, fc1

                 mov ft0, fc2
                 mov oc, ft0

         -----------------------------------------------------------------------------
         - matTx:
         -----------------------------------------------------------------------------

             iGetVertexCode

                 m44 op, vt0, vc0

             iGetFragmentCode

                 tex ft0, v0, fs0 <2d,linear,miplinear,clamp>
                 div ft0.xyz, ft0.xyz, ft0.w
                 tex ft0, v0, fs1 <2d,linear,miplinear,clamp>
                 add ft0.w, ft0.w, fc0.z
                 div ft0.xyz, ft0, ft0.w
                 sub ft0.w, ft0.w, fc0.z
                 sat ft0.xyz, ft0
                 mov ft1.x, ft0.w
                 mov ft0.w, ft1.x
                 mul ft0, ft0, fc1
                 add ft0, ft0, fc2
                 mov oc, ft0

         */

    }


}

window.onload = function ()
{

    var test : MaterialsTest = new MaterialsTest();

}
