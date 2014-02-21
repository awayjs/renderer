///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />



module tests.materials
{

    export class ColorMultiPassMatTest
    {

        private view        : away.containers.View;
        private torus       : away.primitives.TorusGeometry;
        private light       : away.lights.PointLight;
        private raf         : away.utils.RequestAnimationFrame;
        private counter     : number = 0;
        private center      : away.geom.Vector3D = new away.geom.Vector3D();

        constructor()
        {

            this.init();

        }

        private init()
        {

            away.Debug.THROW_ERRORS     = false;
            away.Debug.LOG_PI_ERRORS    = false;

            this.light                  = new away.lights.PointLight();
            this.view                   = new away.containers.View(new away.render.DefaultRenderer())
            this.view.camera.z            = -1000;
            this.view.backgroundColor   = 0x000000;
            this.torus                  = new away.primitives.TorusGeometry( 50 , 10, 32 , 32 , false );

            var l       : number        = 20;
            var radius  : number        = 500;

            var mat : away.materials.ColorMultiPassMaterial = new away.materials.ColorMultiPassMaterial(0xff0000);
                mat.lightPicker = new away.materials.StaticLightPicker([this.light])

            for (var c : number = 0; c < l ; c++)
            {
                var t   : number=Math.PI * 2 * c / l;
                var m : away.entities.Mesh = new away.entities.Mesh( this.torus , mat );
                    m.x = Math.cos(t)*radius;
                    m.y = 0;
                    m.z = Math.sin(t)*radius;

                this.view.scene.addChild( m );

            }


            this.view.scene.addChild( this.light );

            this.view.y         = this.view.x = 0;
            this.view.width     = window.innerWidth;
            this.view.height    = window.innerHeight;

            console.log( 'renderer ' , this.view.renderer );
            console.log( 'scene ' , this.view.scene );
            console.log( 'view ' , this.view );

            this.view.render();

            window.onresize = ( ) => this.resize(null );

            this.raf = new away.utils.RequestAnimationFrame( this.tick , this );
            this.raf.start();

        }


        private tick( e )
        {

            this.counter+= 0.005;
            this.view.camera.lookAt( this.center )
            this.view.camera.x = Math.cos(this.counter)*800;
            this.view.camera.z = Math.sin(this.counter)*800;

            this.view.render();

        }

        public resize( e )
        {

            this.view.y         = this.view.x = 0;
            this.view.width     = window.innerWidth ;
            this.view.height    = window.innerHeight ;
            this.view.render();

        }

    }

}