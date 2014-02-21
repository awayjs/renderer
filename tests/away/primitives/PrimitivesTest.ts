///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.primitives
{

    export class PrimitivesTest//extends away.events.EventDispatcher
    {

        private view                : away.containers.View;
        private raf                 : away.utils.RequestAnimationFrame;
        private meshes              : Array<away.entities.Mesh> = new Array<away.entities.Mesh>();
        private light               : away.lights.DirectionalLight;
        private lightB              : away.lights.DirectionalLight;
        private staticLightPicker   : away.materials.StaticLightPicker;
        //private t                   : number = 0;
        private radius              : number = 400;


        constructor()
        {

            away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;

            this.view                   = new away.containers.View( new away.render.DefaultRenderer());
            this.raf                    = new away.utils.RequestAnimationFrame( this.render , this );

            this.light                  = new away.lights.DirectionalLight();
            this.light.color            = 0xFFFFFF;
            this.light.direction        = new away.geom.Vector3D( 1 , 1 ,0 );
            this.light.ambient          = 0;//0.05;//.4;
            this.light.ambientColor     = 0xFFFFFF;
            this.light.diffuse          = 1;
            this.light.specular         = 1;

            this.lightB                  = new away.lights.DirectionalLight();
            this.lightB.color            = 0xFF0000;
            this.lightB.direction        = new away.geom.Vector3D( -1 , 0 ,1 );
            this.lightB.ambient          = 0;//0.05;//.4;
            this.lightB.ambientColor     = 0xFFFFFF;
            this.lightB.diffuse          = 1;
            this.lightB.specular         = 1;

            this.staticLightPicker                              = new away.materials.StaticLightPicker( [this.light , this.lightB ] );

            this.view.scene.addChild( this.light );
            this.view.scene.addChild( this.lightB );

            this.view.backgroundColor   = 0x222222;

            window.onresize = () => this.resize();


            this.initMeshes();
            this.raf.start();
            this.resize();
        }

        private initMeshes() : void
        {

            var primitives : Array<away.primitives.PrimitiveBase> = new Array<away.primitives.PrimitiveBase>();
                primitives.push( new away.primitives.TorusGeometry() );
                primitives.push( new away.primitives.SphereGeometry() );
                primitives.push( new away.primitives.CapsuleGeometry() );
                primitives.push( new away.primitives.CylinderGeometry() );
                primitives.push( new away.primitives.PlaneGeometry() );
                primitives.push( new away.primitives.ConeGeometry() );
                primitives.push( new away.primitives.CubeGeometry() );

            var mesh : away.entities.Mesh;

            for ( var c: number = 0 ; c < primitives.length ; c ++ )
            {

                var t : number=Math.PI * 2 * c / primitives.length;

                mesh = new away.entities.Mesh( primitives[c] )
                mesh.x = Math.cos(t)*this.radius;
                mesh.y = Math.sin(t)*this.radius;
                mesh.z = 0;
                mesh.transform.scale = new away.geom.Vector3D( 2, 2, 2 );
                mesh.material.lightPicker = this.staticLightPicker;

                this.view.scene.addChild( mesh );
                this.meshes.push( mesh );
            }


        }

        private render()
        {
            if( this.meshes )
            {
                for ( var c : number = 0 ; c < this.meshes.length ; c++ )
                {
                    this.meshes[c].rotationY += 1;
                }
            }

            this.view.render();

        }

        public resize()
        {
            this.view.y         = 0;
            this.view.x         = 0;

            this.view.width     = window.innerWidth;
            this.view.height    = window.innerHeight;


        }

    }

}
