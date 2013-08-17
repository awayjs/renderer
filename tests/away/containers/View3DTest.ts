///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

class View3DTest
{

    private view        : away.containers.View3D;
    private torus       : away.primitives.TorusGeometry;

    private light       : away.lights.PointLight;
    private raf         : away.utils.RequestAnimationFrame;
    private meshes      : away.entities.Mesh[];

    constructor()
    {

        away.Debug.THROW_ERRORS     = false;
        away.Debug.LOG_PI_ERRORS    = false;

        this.meshes                 = new Array<away.entities.Mesh>();

        this.light                  = new away.lights.PointLight();
        this.view                   = new away.containers.View3D( )
        this.view.camera.z          = 0;
        this.view.backgroundColor   = 0x776655;
        this.torus                  = new away.primitives.TorusGeometry(150 , 50 , 32 , 32 , false );



        var l       : number        = 10;
        var radius  : number        = 1000;

        var matB : away.materials.ColorMaterial = new away.materials.ColorMaterial();

        var f : boolean = true;
        for (var c : number = 0; c < l ; c++)
        {


            var t   : number=Math.PI * 2 * c / l;

            var m : away.entities.Mesh = new away.entities.Mesh( this.torus , matB);
                m.x = Math.cos(t)*radius;
                m.y = 0;
                m.z = Math.sin(t)*radius;

            this.view.scene.addChild( m );

            this.meshes.push( m );

            f = !f;
        }

        /*
        var bitmapMat : away.materials.TextureMaterial = <away.materials.TextureMaterial> m.material;
            bitmapMat.blendMode
        console.log( 'Torus.bitmapMat.texture: ' , bitmapMat.texture.width , bitmapMat.texture.height ) ;
        */

        this.view.scene.addChild( this.light );

        console.log( 'renderer ' , this.view.renderer );
        console.log( 'scene ' , this.view.scene );
        console.log( 'view ' , this.view );

        this.view.render();

        document.onmousedown = ( e ) => this.onMouseDowm( e );

        this.raf = new away.utils.RequestAnimationFrame( this.tick , this );
        this.raf.start();

        this.resize( null );

    }

    private onMouseDowm( e )
    {

        if ( this.raf)
        {

            if ( this.raf.active )
            {
                this.raf.stop();
            }
            else
            {
                this.raf.start();
            }

        }

        this.tick ( e );

    }

    private tick( e )
    {


        //try{

            for ( var c : number = 0 ; c < this.meshes.length ; c ++ )
            {

                this.meshes[c].rotationY += 2;

            }

            this.view.camera.rotationY += .5;
            this.view.render();

        /*
        } catch ( error ){

            console.log( 'error' , error )

        }
        */
    }

    public resize( e )
    {

        this.view.y         = ( window.innerHeight - this.view.height ) / 2;
        this.view.x         = ( window.innerWidth - this.view.width) / 2;

        this.view.render();

    }

}


var test: View3DTest;
window.onload = function ()
{
    test = new View3DTest();
}

window.onresize = function ( e )
{
    if ( test )
    {
        test.resize( e );
    }
}

