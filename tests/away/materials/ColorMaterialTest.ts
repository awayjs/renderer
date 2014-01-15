///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />



module tests.materials
{

    export class ColorMaterialTest
    {

        private cm          : away.materials.ColorMaterial;
        private stage       : away.display.Stage;
        private sProxy      : away.managers.StageGLProxy;
        private sManager    : away.managers.StageGLManager;
        private imgLoader   : away.net.IMGLoader;
        private imgTx       : away.textures.HTMLImageElementTexture;
        private matTx       : away.materials.TextureMaterial;
        private specM       : away.materials.BasicSpecularMethod;

        constructor()
        {

            away.Debug.THROW_ERRORS = false;

            var mipUrlRequest   = new away.net.URLRequest( 'assets/1024x1024.png');

            this.imgLoader      = new away.net.IMGLoader();
            this.imgLoader.load( mipUrlRequest );
            this.imgLoader.addEventListener( away.events.Event.COMPLETE , away.utils.Delegate.create(this, this.imgLoaded) );

            this.cm             = new away.materials.ColorMaterial();
            this.stage          = new away.display.Stage( 800, 600 );
            this.sManager       = away.managers.StageGLManager.getInstance( this.stage );
            this.sProxy         = this.sManager.getStageGLProxy( 0 );

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
            this.matTx.blendMode        = away.display.BlendMode.MULTIPLY;

            console.log( '-----------------------------------------------------------------------------' );
            console.log( '- TextureMaterial' );
            console.log( '-----------------------------------------------------------------------------' );
            console.log( 'this.matTx ' , this.matTx );

            this.matTx._pScreenPass.iUpdateProgram( this.sProxy )

            console.log( 'iGetVertexCode' , this.matTx._pScreenPass.iGetVertexCode() );
            console.log( 'iGetFragmentCode' , this.matTx._pScreenPass.iGetFragmentCode(''));


        }


    }

}
