///<reference path="../../../src/Away3D.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

class Object3DTestV2
{

    private view        : away.containers.View3D;
    private torus       : away.primitives.TorusGeometry;

    private light       : away.lights.PointLight;
    private raf         : away.utils.RequestAnimationFrame;
    private meshes      : away.entities.Mesh[];

    private t           : number = 0;
    private tPos        : number = 0;
    private radius      : number = 1000;
    private follow      : boolean = true;

    private pointLight : away.lights.PointLight;
    private lightPicker : away.materials.StaticLightPicker;

    private _image		:HTMLImageElement;

    constructor()
    {

        away.Debug.THROW_ERRORS     = false;
        away.Debug.LOG_PI_ERRORS    = false;

        this.meshes                 = new Array<away.entities.Mesh>();
        this.light                  = new away.lights.PointLight();
        this.view                   = new away.containers.View3D();

        this.pointLight             = new away.lights.PointLight();
        this.lightPicker            = new away.materials.StaticLightPicker( [this.pointLight])

        this.view.scene.addChild( this.pointLight );

        var perspectiveLens : away.cameras.PerspectiveLens = <away.cameras.PerspectiveLens> this.view.camera.lens;
        perspectiveLens.fieldOfView = 75;


        this.view.camera.z          = 0;
        this.view.backgroundColor   = 0x000000;
        this.view.backgroundAlpha   = 0;
        this.torus                  = new away.primitives.TorusGeometry(150 , 50 , 32 , 32 , false );

        var l       : number        = 10;
        //var radius  : number        = 1000;

        for (var c : number = 0; c < l ; c++)
        {

            var t : number=Math.PI * 2 * c / l;

            var m : away.entities.Mesh = new away.entities.Mesh( this.torus );
                m.x = Math.cos(t)*this.radius;
                m.y = 0;
                m.z = Math.sin(t)*this.radius;

            this.view.scene.addChild( m );
            this.meshes.push( m );

        }

        this.view.scene.addChild( this.light );

        this.raf = new away.utils.RequestAnimationFrame( this.tick , this );
        this.raf.start();
        this.resize( null );

        document.onmousedown = ( e ) => this.followObject( e );

        this.loadResources();
    }

    private loadResources()
    {
        var urlRequest:away.net.URLRequest = new away.net.URLRequest( "assets/custom_uv_horizontal.png" );
        var imgLoader:away.net.IMGLoader = new away.net.IMGLoader();
        imgLoader.addEventListener( away.events.Event.COMPLETE, this.imageCompleteHandler, this );
        imgLoader.load( urlRequest );
    }

    private imageCompleteHandler(e)
    {
        var imageLoader:away.net.IMGLoader = <away.net.IMGLoader> e.target
        this._image = imageLoader.image;

        var ts : away.textures.HTMLImageElementTexture = new away.textures.HTMLImageElementTexture( this._image, false );

        var matTx: away.materials.TextureMaterial = new away.materials.TextureMaterial( ts, true, true, false );
            matTx.lightPicker =  this.lightPicker;

        for ( var c : number = 0 ; c < this.meshes.length ; c ++ )
        {
            this.meshes[c].material = matTx;


        }

    }


    private tick( e )
    {

        this.tPos += .02;

        for ( var c : number = 0 ; c < this.meshes.length ; c ++ )
        {

            var objPos : number=Math.PI * 2 * c / this.meshes.length;

            this.t += .005;
            var s : number = 1.2 + Math.sin( this.t + objPos );


            this.meshes[c].rotationY    += 2 * ( c / this.meshes.length );
            this.meshes[c].rotationX    += 2* ( c / this.meshes.length );
            this.meshes[c].rotationZ    += 2* ( c / this.meshes.length );
            this.meshes[c].scaleX       = this.meshes[c].scaleY = this.meshes[c].scaleZ = s
            this.meshes[c].x            = Math.cos(objPos + this.tPos)*this.radius;
            this.meshes[c].y            = Math.sin( this.t ) * 500;
            this.meshes[c].z            = Math.sin(objPos + this.tPos)*this.radius;

        }


        //this.view.camera.y = Math.sin( this.tPos ) * 1500;

        if ( this.follow )
        {
            this.view.camera.lookAt( this.meshes[0].position );
        }

        this.view.camera.y = Math.sin( this.tPos ) * 1500;

        this.view.render();

    }

    public resize( e )
    {
        this.view.y         = ( window.innerHeight - this.view.height ) / 2;
        this.view.x         = ( window.innerWidth - this.view.width) / 2;
        this.view.render();
    }

    public followObject( e )
    {

        this.follow = !this.follow;

    }

}

var test: Object3DTestV2;
window.onload = function ()
{
    test = new Object3DTestV2();
}

window.onresize = function ( e )
{
    if ( test )
    {
        test.resize( e );
    }
}

