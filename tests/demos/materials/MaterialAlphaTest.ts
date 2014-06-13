///<reference path="../../../build/stagegl-renderer.next.d.ts" />

module demos.materials
{
	import BlendMode					= away.base.BlendMode;
	import Scene						= away.containers.Scene;
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import LoaderEvent					= away.events.LoaderEvent;
	import Vector3D						= away.geom.Vector3D;
	import AssetLibrary					= away.library.AssetLibrary;
	import AssetLoader					= away.library.AssetLoader;
	import AssetLoaderToken				= away.library.AssetLoaderToken;
	import AssetType					= away.library.AssetType;
	import DirectionalLight				= away.lights.DirectionalLight;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import TriangleMaterial				= away.materials.TriangleMaterial;
	import URLLoader					= away.net.URLLoader;
	import URLLoaderDataFormat			= away.net.URLLoaderDataFormat;
	import URLRequest					= away.net.URLRequest;
	import OBJParser					= away.parsers.OBJParser;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import PrimitiveCubePrefab			= away.prefabs.PrimitiveCubePrefab;
	import PrimitiveCapsulePrefab		= away.prefabs.PrimitiveCapsulePrefab;
	import PerspectiveProjection		= away.projections.PerspectiveProjection;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ImageTexture					= away.textures.ImageTexture;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class MaterialAlphaTest
    {

        private height : number = 0;

        private token:AssetLoaderToken;
        private view:View;
        private raf:RequestAnimationFrame;
        private meshes  : Array<Mesh> = new Array<Mesh>();
        private loadedMeshMaterial:TriangleMaterial;
        private light:DirectionalLight;
        private lightB:DirectionalLight;
        private loadedMesh:Mesh;

        private aValues:Array<number> = Array<number>(0, .1, .5, .8, .9, .99, 1);
        private aValuesP:number = 0;

		private torusTextureMaterial:TriangleMaterial;
		private cubeColorMaterial:TriangleMaterial;
		private capsuleColorMaterial:TriangleMaterial;
		private staticLightPicker:StaticLightPicker;

        constructor()
        {
            away.Debug.LOG_PI_ERRORS = false;
            away.Debug.THROW_ERRORS = false;

            this.view = new View(new DefaultRenderer());
            this.raf = new RequestAnimationFrame(this.render, this);
			this.onResize();

            this.light = new DirectionalLight();
            this.light.color = 0xFFFFFF;
            this.light.direction = new Vector3D(1, 1, 0);
            this.light.ambient = 0;
            this.light.ambientColor = 0xFFFFFF;
            this.light.diffuse = 1;
            this.light.specular = 1;

            this.lightB = new DirectionalLight();
            this.lightB.color= 0xFF0000;
            this.lightB.direction = new Vector3D(-1, 0, 1);
            this.lightB.ambient = 0;
            this.lightB.ambientColor = 0xFFFFFF;
            this.lightB.diffuse = 1;
            this.lightB.specular = 1;

            this.view.scene.addChild(this.light);
            this.view.scene.addChild(this.lightB);

            this.view.backgroundColor = 0x222222;

            AssetLibrary.enableParser(OBJParser);

            this.token = AssetLibrary.load(new URLRequest('assets/platonic.obj'));
            this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE , (event:LoaderEvent) => this.onResourceComplete(event));

            this.token = AssetLibrary.load(new URLRequest('assets/dots.png') );
            this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

            window.onresize = (event:UIEvent) => this.onResize(event);
            document.onmousedown = (event:MouseEvent) => this.onMouseDown(event);
        }

        private onMouseDown(event:MouseEvent)
        {
            this.cubeColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = this.aValues[this.aValuesP];

            alert( 'Alpha: ' + this.aValues[this.aValuesP]);

            this.aValuesP++;

            if (this.aValuesP > this.aValues.length -1)
                this.aValuesP  = 0;
        }

        private render(dt:number)
        {
            if (this.meshes)
                for (var c:number = 0; c < this.meshes.length; c++)
                    this.meshes[c].rotationY += .35;

            this.view.render();
        }

        public onResourceComplete(event:LoaderEvent)
        {
            var loader:AssetLoader = <AssetLoader> event.target;
            var l:number = loader.baseDependency.assets.length

            for (var c:number = 0; c < l; c ++) {

                var d : away.library.IAsset = loader.baseDependency.assets[c];

                console.log( d.name);

                switch (d.assetType) {
                    case AssetType.MESH:
                        var mesh:Mesh = <Mesh> d;

                        this.loadedMesh = mesh;

                        if (d.name == 'Mesh_g0') {
                            this.loadedMesh = mesh;
                            mesh.y = -400;
                            mesh.transform.scale = new away.geom.Vector3D(5, 5, 5);
                        } else {
                            mesh.transform.scale = new away.geom.Vector3D(3.5, 3.5, 3.5);
                        }

                        if (this.loadedMeshMaterial)
							mesh.material = this.loadedMeshMaterial;

                        this.view.scene.addChild(mesh);
                        this.meshes.push(mesh);

                        this.raf.start();
                        break;
                    case AssetType.TEXTURE:
                        // Loaded Texture
                        var tx:ImageTexture = <ImageTexture> d;

                        // Light Picker
                        this.staticLightPicker = new StaticLightPicker( [this.light , this.lightB ] );

                        // Material for loaded mesh
                        this.loadedMeshMaterial = new TriangleMaterial( tx, true, true, false );
                        this.loadedMeshMaterial.lightPicker = this.staticLightPicker;
                        this.loadedMeshMaterial.alpha = 1;
						this.loadedMeshMaterial.bothSides = true;

                        if (this.loadedMesh)
                            this.loadedMesh.material = this.loadedMeshMaterial;

                        // Torus
                        var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(150 , 50 , 64 , 64);

                        // Torus Texture Material
                        this.torusTextureMaterial = new TriangleMaterial(tx, true, true, false);
                        this.torusTextureMaterial.lightPicker = this.staticLightPicker ;
						this.torusTextureMaterial.bothSides = true;
                        this.torusTextureMaterial.alpha = .8;

						torus.material = this.torusTextureMaterial;
						
                        // Torus Mesh ( left )
                        var torusMesh:Mesh = <Mesh> torus.getNewObject();
                        torusMesh.rotationX = 90;
                        torusMesh.x = 600;
                        this.meshes.push(torusMesh);
                        this.view.scene.addChild(torusMesh);

						var cube:PrimitiveCubePrefab = new PrimitiveCubePrefab(300, 300, 300, 20, 20, 20);
						
                        // Torus Color Material
                        this.cubeColorMaterial = new TriangleMaterial(0x0090ff);
                        this.cubeColorMaterial.lightPicker = this.staticLightPicker ;
                        this.cubeColorMaterial.alpha = .8;
						this.cubeColorMaterial.bothSides = true;

						cube.material = this.cubeColorMaterial;
						
                        // Torus Mesh ( right )
                        var cubeMesh:Mesh = <Mesh> cube.getNewObject();
						cubeMesh.rotationX = 90;
						cubeMesh.x = -600;
                        this.meshes.push(cubeMesh);
                        this.view.scene.addChild(cubeMesh);

                        this.capsuleColorMaterial = new TriangleMaterial(0x00ffff);
                        this.capsuleColorMaterial.lightPicker = this.staticLightPicker;

                        var capsule:PrimitiveCapsulePrefab = new PrimitiveCapsulePrefab(100, 200);

						capsule.material = this.capsuleColorMaterial;

                        // Torus Mesh ( right )
						var capsuleMesh:Mesh = <Mesh> capsule.getNewObject();
                        this.meshes.push(capsuleMesh);
                        this.view.scene.addChild(capsuleMesh);

                        this.cubeColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = 1;

                        break;
                }
            }
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