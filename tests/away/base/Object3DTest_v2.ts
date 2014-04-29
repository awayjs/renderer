///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.base
{
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import PointLight					= away.lights.PointLight;
	import ColorMaterial				= away.materials.ColorMaterial;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import PerspectiveProjection		= away.projections.PerspectiveProjection;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class Object3DTestV2
    {

        private view        : View;
        private torus       : PrimitiveTorusPrefab;

        private light       : PointLight;
        private raf         : RequestAnimationFrame;
        private meshes      : Array<Mesh>;

        private t           : number = 0;
        private tPos        : number = 0;
        private radius      : number = 1000;
        private follow      : boolean = true;

        constructor()
        {

            away.Debug.THROW_ERRORS     = false;
            away.Debug.LOG_PI_ERRORS    = false;

            this.meshes                 = new Array<Mesh>();
            this.light                  = new PointLight();
            this.view                   = new View(new DefaultRenderer());

            var perspectiveProjection : PerspectiveProjection = <PerspectiveProjection> this.view.camera.projection;
			perspectiveProjection.fieldOfView = 75;


            this.view.camera.z = 0;
            this.view.backgroundColor = 0x000000;
            this.view.backgroundAlpha = 0;
            this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);

            var l:number = 10;
            //var radius  : number        = 1000;

            for (var c:number = 0; c < l; c++) {

                var t:number=Math.PI * 2 * c / l;

                var mesh:Mesh = <Mesh> this.torus.getNewObject();
				mesh.x = Math.cos(t)*this.radius;
				mesh.y = 0;
				mesh.z = Math.sin(t)*this.radius;

                this.view.scene.addChild(mesh);
                this.meshes.push(mesh);
            }

            this.view.scene.addChild( this.light );

            this.raf = new RequestAnimationFrame( this.tick , this );
            this.raf.start();
            this.resize( null );

            window.onresize = (e) => this.resize( null );
            document.onmousedown = ( e ) => this.followObject( e );

        }

        private tick( e )
        {
            this.tPos += .02;

            for ( var c:number = 0; c < this.meshes.length; c ++ ) {

                var objPos:number = Math.PI*2*c/this.meshes.length;

                this.t += .005;
                var s:number = 1.2 + Math.sin( this.t + objPos );

                this.meshes[c].rotationY += 2*(c/this.meshes.length);
                this.meshes[c].rotationX += 2*(c/this.meshes.length);
                this.meshes[c].rotationZ += 2*(c/this.meshes.length);
                this.meshes[c].scaleX = this.meshes[c].scaleY = this.meshes[c].scaleZ = s;
                this.meshes[c].x = Math.cos(objPos + this.tPos)*this.radius;
                this.meshes[c].y = Math.sin(this.t)*500;
                this.meshes[c].z = Math.sin(objPos + this.tPos)*this.radius;
            }


            //this.view.camera.y = Math.sin( this.tPos ) * 1500;

            if (this.follow)
                this.view.camera.lookAt(this.meshes[0].transform.position);

            this.view.camera.y = Math.sin(this.tPos) * 1500;
            this.view.render();
        }

        public resize(e)
        {
			this.view.y = 0;
			this.view.x = 0;

			this.view.width = window.innerWidth;
			this.view.height = window.innerHeight;
        }

        public followObject( e )
        {
            this.follow = !this.follow;
        }
    }
}

