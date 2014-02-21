///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.containers{

    export class View3DTest
    {

        private view        : away.containers.View;
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
            this.view                   = new away.containers.View(new away.render.DefaultRenderer())
            this.view.camera.z          = 0;
            this.view.backgroundColor   = 0x776655;
            this.torus                  = new away.primitives.TorusGeometry(150 , 50 , 32 , 32 , false );

            var l       : number        = 10;
            var radius  : number        = 1000;
            var matB    : away.materials.ColorMaterial = new away.materials.ColorMaterial();

            for (var c : number = 0; c < l ; c++)
            {

                var t   : number=Math.PI * 2 * c / l;

                var m : away.entities.Mesh = new away.entities.Mesh( this.torus , matB);
                    m.x = Math.cos(t)*radius;
                    m.y = 0;
                    m.z = Math.sin(t)*radius;

                this.view.scene.addChild( m );
                this.meshes.push( m );

            }

            this.view.scene.addChild( this.light );

            this.raf = new away.utils.RequestAnimationFrame( this.tick , this );
            this.raf.start();
            this.resize( null );

            window.onresize = (e) => this.resize(null);

        }

        private tick( e )
        {

            for ( var c : number = 0 ; c < this.meshes.length ; c ++ )
            {
                this.meshes[c].rotationY += 2;
            }

            this.view.camera.rotationY += .5;
            this.view.render();

        }

        public resize( e )
        {
			this.view.y = 0;
			this.view.x = 0;

			this.view.width = window.innerWidth;
			this.view.height = window.innerHeight;
        }

    }

}