///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

class View3DTest
{

    private view        : away.containers.BasicView3D;
    private cam         : away.cameras.Camera3D;
    private renderer    : away.render.DefaultRenderer;
    private scene       : away.containers.Scene3D;
    private torus       : away.primitives.TorusGeometry;

    private objCont     : away.containers.ObjectContainer3D;
    private mesh        : away.entities.Mesh;

    constructor()
    {

        away.Debug.THROW_ERRORS = false;

        this.cam = new away.cameras.Camera3D();
        this.renderer = new away.render.DefaultRenderer();
        this.scene = new away.containers.Scene3D();

        this.view = new away.containers.BasicView3D( this.scene , this.cam , this.renderer );



        this.objCont = new away.containers.ObjectContainer3D();
        this.torus = new away.primitives.TorusGeometry();

        this.mesh = new away.entities.Mesh( this.torus );


        this.scene.addChild( this.mesh );

        console.log( 'cam ' , this.cam );
        console.log( 'renderer ' , this.renderer );
        console.log( 'scene ' , this.scene );
        console.log( 'view ' , this.view );
        console.log( 'scene ' , this.scene );
        console.log( 'mesh ' , this.mesh );
        console.log( 'torus ' , this.torus );
        console.log( 'objCont ' , this.objCont );


        /*
         constructor( scene:Scene3D,
         camera:away.cameras.Camera3D,
         renderer:away.render.RendererBase,
         forceSoftware:boolean = false,
         profile: string = "basline" )
         */
    }

}


var test: View3DTest;
window.onload = function ()
{


    test = new View3DTest();

}
