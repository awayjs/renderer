///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.primitives
{
	import View							= away.containers.View;
	import ContextMode					= away.display.ContextMode;
	import Mesh							= away.entities.Mesh;
	import Vector3D						= away.geom.Vector3D;
	import DirectionalLight				= away.entities.DirectionalLight;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import DefaultMaterialManager		= away.materials.DefaultMaterialManager;
	import PrimitivePrefabBase			= away.prefabs.PrimitivePrefabBase;
	import PrimitivePolygonPrefab		= away.prefabs.PrimitivePolygonPrefab;
	import PrimitiveSpherePrefab		= away.prefabs.PrimitiveSpherePrefab;
	import PrimitiveCapsulePrefab		= away.prefabs.PrimitiveCapsulePrefab;
	import PrimitiveCylinderPrefab		= away.prefabs.PrimitiveCylinderPrefab;
	import PrimitivePlanePrefab			= away.prefabs.PrimitivePlanePrefab;
	import PrimitiveConePrefab			= away.prefabs.PrimitiveConePrefab;
	import PrimitiveCubePrefab			= away.prefabs.PrimitiveCubePrefab;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ContextGLProfile				= away.stagegl.ContextGLProfile;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class WireframePrimitiveTest
    {
        private view:View;
        private raf:RequestAnimationFrame;
        private meshes:Array<Mesh> = new Array<Mesh>();
        private light:DirectionalLight;
        private lightB:DirectionalLight;
        private staticLightPicker:StaticLightPicker;

        private radius:number = 400;

        constructor()
        {
            away.Debug.LOG_PI_ERRORS = false;
            away.Debug.THROW_ERRORS = false;

            this.view = new View(new DefaultRenderer(false, ContextGLProfile.BASELINE, ContextMode.FLASH));
            this.raf = new RequestAnimationFrame(this.render, this);

            this.light = new DirectionalLight();
            this.light.color = 0xFFFFFF;
            this.light.direction = new Vector3D(1, 1, 0);
            this.light.ambient = 0;
            this.light.ambientColor = 0xFFFFFF;
            this.light.diffuse = 1;
            this.light.specular = 1;

            this.lightB = new DirectionalLight();
            this.lightB.color = 0xFF0000;
            this.lightB.direction = new Vector3D(-1, 0, 1);
            this.lightB.ambient = 0;
            this.lightB.ambientColor = 0xFFFFFF;
            this.lightB.diffuse = 1;
            this.lightB.specular = 1;

            this.staticLightPicker = new StaticLightPicker([this.light, this.lightB]);

            this.view.scene.addChild(this.light);
            this.view.scene.addChild(this.lightB);

            this.view.backgroundColor = 0x222222;

            window.onresize = (event:UIEvent) => this.onResize(event);

            this.initMeshes();
            this.raf.start();
            this.onResize();
        }

        private initMeshes():void
        {

            var primitives:Array<PrimitivePrefabBase> = new Array<PrimitivePrefabBase>();
			primitives.push( new PrimitivePolygonPrefab());
			primitives.push( new PrimitiveSpherePrefab());
			primitives.push( new PrimitiveSpherePrefab());
			primitives.push( new PrimitiveCylinderPrefab());
			primitives.push( new PrimitivePlanePrefab());
			primitives.push( new PrimitiveConePrefab());
			primitives.push( new PrimitiveCubePrefab());

            var mesh:Mesh;

            for (var c:number = 0; c < primitives.length; c++) {
				primitives[c].geometryType = "lineSubGeometry";

                var t:number = Math.PI*2*c/primitives.length;

				mesh = <Mesh> primitives[c].getNewObject();
				mesh.x = Math.cos(t)*this.radius;
				mesh.y = Math.sin(t)*this.radius;
				mesh.z = 0;
				mesh.transform.scale = new Vector3D(2, 2, 2);

                this.view.scene.addChild(mesh);
                this.meshes.push(mesh);
            }


        }

        private render()
        {
            if(this.meshes)
                for (var c:number = 0; c < this.meshes.length; c++)
                    this.meshes[c].rotationY += 1;

            this.view.render();
        }

        public onResize(event:UIEvent = null)
        {
            this.view.y = 0;
            this.view.x = 0;

            this.view.width = window.innerWidth;
            this.view.height = window.innerHeight;
        }
    }
}

