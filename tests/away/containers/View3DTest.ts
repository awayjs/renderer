///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.containers
{
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import PointLight					= away.lights.PointLight;
	import ColorMaterial				= away.materials.ColorMaterial;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class View3DTest
    {

        private view:View;
        private torus:PrimitiveTorusPrefab;

        private light:PointLight;
        private raf:RequestAnimationFrame;
        private meshes:Array<Mesh>;

        constructor()
        {

            away.Debug.THROW_ERRORS = false;
            away.Debug.LOG_PI_ERRORS = false;

            this.meshes = new Array<Mesh>();
            this.light = new PointLight();
            this.view = new View(new DefaultRenderer())
            this.view.camera.z = 0;
            this.view.backgroundColor = 0x776655;
            this.torus = new PrimitiveTorusPrefab(150 , 50 , 32 , 32 , false);

            var l:number        = 10;
            var radius:number        = 1000;
            var matB:ColorMaterial = new ColorMaterial();

			this.torus.material = matB;

            for (var c:number = 0; c < l; c++) {

                var t:number=Math.PI * 2 * c / l;

                var mesh:Mesh = <Mesh> this.torus.getNewObject();
				mesh.x = Math.cos(t)*radius;
				mesh.y = 0;
				mesh.z = Math.sin(t)*radius;

                this.view.scene.addChild(mesh);
                this.meshes.push(mesh);

            }

            this.view.scene.addChild(this.light);

            this.raf = new away.utils.RequestAnimationFrame(this.tick , this);
            this.raf.start();
            this.resize( null );

            window.onresize = (e) => this.resize(null);

        }

        private tick(e)
        {

            for (var c:number = 0; c < this.meshes.length; c++)
                this.meshes[c].rotationY += 2;

            this.view.camera.rotationY += .5;
            this.view.render();
        }

        public resize(e)
        {
			this.view.y = 0;
			this.view.x = 0;

			this.view.width = window.innerWidth;
			this.view.height = window.innerHeight;
        }
    }
}