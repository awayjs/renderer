import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import AssetLoader					= require("awayjs-core/lib/library/AssetLoader");
import AssetLoaderToken				= require("awayjs-core/lib/library/AssetLoaderToken");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLLoaderDataFormat			= require("awayjs-core/lib/net/URLLoaderDataFormat");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import PerspectiveProjection		= require("awayjs-core/lib/projections/PerspectiveProjection");
import ImageTexture					= require("awayjs-core/lib/textures/ImageTexture");
import Debug						= require("awayjs-core/lib/utils/Debug");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import Scene						= require("awayjs-display/lib/containers/Scene");
import View							= require("awayjs-display/lib/containers/View");
import BlendMode					= require("awayjs-display/lib/base/BlendMode");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import PrimitiveTorusPrefab			= require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
import PrimitiveCubePrefab			= require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
import PrimitiveCapsulePrefab		= require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");
import TriangleMethodMaterial		= require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");

import OBJParser					= require("awayjs-renderergl/lib/parsers/OBJParser");

class MaterialAlphaTest
{

	private height : number = 0;

	private token:AssetLoaderToken;
	private view:View;
	private raf:RequestAnimationFrame;
	private meshes  : Array<Mesh> = new Array<Mesh>();
	private loadedMeshMaterial:TriangleMethodMaterial;
	private light:DirectionalLight;
	private lightB:DirectionalLight;
	private loadedMesh:Mesh;

	private aValues:Array<number> = Array<number>(0, .1, .5, .8, .9, .99, 1);
	private aValuesP:number = 0;

	private torusTextureMaterial:TriangleMethodMaterial;
	private cubeColorMaterial:TriangleMethodMaterial;
	private capsuleColorMaterial:TriangleMethodMaterial;
	private staticLightPicker:StaticLightPicker;

	constructor()
	{
		Debug.LOG_PI_ERRORS = false;
		Debug.THROW_ERRORS = false;

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

			var d:IAsset = loader.baseDependency.assets[c];

			console.log( d.name);

			switch (d.assetType) {
				case AssetType.MESH:
					var mesh:Mesh = <Mesh> d;

					this.loadedMesh = mesh;

					if (d.name == 'Mesh_g0') {
						this.loadedMesh = mesh;
						mesh.y = -400;
						mesh.transform.scale = new Vector3D(5, 5, 5);
					} else {
						mesh.transform.scale = new Vector3D(3.5, 3.5, 3.5);
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
					this.loadedMeshMaterial = new TriangleMethodMaterial( tx, true, true, false );
					this.loadedMeshMaterial.lightPicker = this.staticLightPicker;
					this.loadedMeshMaterial.alpha = 1;
					this.loadedMeshMaterial.bothSides = true;

					if (this.loadedMesh)
						this.loadedMesh.material = this.loadedMeshMaterial;

					// Torus
					var torus:PrimitiveTorusPrefab = new PrimitiveTorusPrefab(150 , 50 , 64 , 64);

					// Torus Texture Material
					this.torusTextureMaterial = new TriangleMethodMaterial(tx, true, true, false);
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
					this.cubeColorMaterial = new TriangleMethodMaterial(0x0090ff);
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

					this.capsuleColorMaterial = new TriangleMethodMaterial(0x00ffff);
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