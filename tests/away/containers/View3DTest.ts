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
    private sProxy      : away.managers.Stage3DProxy;
    private sManager    : away.managers.Stage3DManager;
    private stage       : away.display.Stage;
    private light       : away.lights.PointLight;
    private raf         : away.utils.RequestAnimationFrame

    constructor()
    {

        away.Debug.THROW_ERRORS = false;

        this.stage = new away.display.Stage();

        this.cam = new away.cameras.Camera3D();
        this.cam.z = -1000;
        this.cam.lookAt( new away.geom.Vector3D( 0 , 0 ,0 ));

        this.renderer = new away.render.DefaultRenderer();
        this.scene = new away.containers.Scene3D();

        this.light = new away.lights.PointLight();

        this.view = new away.containers.BasicView3D( this.scene , this.cam , this.renderer );
        this.view.backgroundColor = 0xff0000;

        this.torus = new away.primitives.TorusGeometry();

        var l       : number = 20;
        var radius  : number = 500;

        for (var c : number = 0; c < l ; c++)
        {

            var t   : number=Math.PI * 2 * c / l;

            var m : away.entities.Mesh = new away.entities.Mesh( this.torus );
                m.x = Math.cos(t)*radius;
                m.y = 0;
                m.z = Math.sin(t)*radius;
            console.log( 'mesh' , m.transform, m.position , m.x , m.y , m.z );

            this.scene.addChild( m );

        }

        this.scene.addChild( this.light );

        console.log('------------------------------------------------------------------------------------------');
        console.log('-Log');

        console.log( 'renderer ' , this.renderer );
        console.log( 'scene ' , this.scene );
        console.log( 'view ' , this.view );
        console.log( 'scene ' , this.scene );

        console.log('------------------------------------------------------------------------------------------');
        console.log('-Render');
        this.view.render();

        this.raf = new away.utils.RequestAnimationFrame( this.tick , this );
        //this.raf.start();


        document.onmousedown = ( e ) => this.tick( e );


    }

    private tick( e )
    {

        this.view.render();

    }

}


var test: View3DTest;
window.onload = function ()
{


    test = new View3DTest();

}
