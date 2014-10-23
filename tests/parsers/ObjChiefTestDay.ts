import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import AssetLoader					= require("awayjs-core/lib/library/AssetLoader");
import AssetLoaderToken				= require("awayjs-core/lib/library/AssetLoaderToken");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import ImageTexture					= require("awayjs-core/lib/textures/ImageTexture");
import Debug						= require("awayjs-core/lib/utils/Debug");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import DisplayObjectContainer		= require("awayjs-display/lib/containers/DisplayObjectContainer");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");

import DefaultRenderer				= require("awayjs-stagegl/lib/render/DefaultRenderer");
import TriangleMethodMaterial		= require("awayjs-stagegl/lib/materials/TriangleMethodMaterial");

import OBJParser					= require("awayjs-renderergl/lib/parsers/OBJParser");

/**
 * 
 */
class ObjChiefTestDay
{
	private token:AssetLoaderToken;
	private view:View;
	private raf:RequestAnimationFrame;
	private meshes:Array<Mesh> = new Array<Mesh>();
	private mat:TriangleMethodMaterial;

	private terrainMaterial:TriangleMethodMaterial;

	private light:DirectionalLight;

	private spartan:DisplayObjectContainer = new DisplayObjectContainer();
	private terrain:Mesh;

	private spartanFlag:boolean = false;
	private terrainObjFlag:boolean = false;

	constructor()
	{
		Debug.LOG_PI_ERRORS = false;
		Debug.THROW_ERRORS = false;

		this.view = new View(new DefaultRenderer());
		this.view.camera.z = -50;
		this.view.camera.y = 20;
		this.view.camera.projection.near = 0.1;
		this.view.backgroundColor = 0xCEC8C6;

		this.raf = new RequestAnimationFrame(this.render, this);

		this.light = new DirectionalLight();
		this.light.color = 0xc1582d;
		this.light.direction = new Vector3D(1, 0, 0);
		this.light.ambient = 0.4;
		this.light.ambientColor = 0x85b2cd;
		this.light.diffuse = 2.8;
		this.light.specular = 1.8;

		this.spartan.transform.scale = new Vector3D(.25, .25, .25);
		this.spartan.y = 0;

		this.view.scene.addChild(this.light);

		AssetLibrary.enableParser(OBJParser);

		this.token = AssetLibrary.load(new URLRequest('assets/Halo_3_SPARTAN4.obj'));
		this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

		this.token = AssetLibrary.load(new URLRequest('assets/terrain.obj'));
		this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

		this.token = AssetLibrary.load(new URLRequest('assets/masterchief_base.png'));
		this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

		this.token = AssetLibrary.load(new URLRequest('assets/stone_tx.jpg'));
		this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

		window.onresize = (event:UIEvent) => this.onResize();

		this.raf.start();
	}

	private render()
	{
		if ( this.terrain)
			this.terrain.rotationY += 0.4;

		this.spartan.rotationY += 0.4;
		this.view.render();
	}

	public onResourceComplete (event:LoaderEvent)
	{
		var loader:AssetLoader = <AssetLoader> event.target;
		var l:number = loader.baseDependency.assets.length;

		console.log('------------------------------------------------------------------------------');
		console.log('events.LoaderEvent.RESOURCE_COMPLETE', event, l, loader);
		console.log('------------------------------------------------------------------------------');

		var loader:AssetLoader = <AssetLoader> event.target;
		var l:number = loader.baseDependency.assets.length;

		for (var c:number = 0; c < l; c++) {

			var d:IAsset = loader.baseDependency.assets[c];

			console.log( d.name , event.url);

			switch (d.assetType) {
				case AssetType.MESH:
					if (event.url =='assets/Halo_3_SPARTAN4.obj') {
						var mesh:Mesh = <Mesh> d;

						this.spartan.addChild(mesh);
						this.spartanFlag = true;
						this.meshes.push(mesh);
					} else if (event.url =='assets/terrain.obj') {
						this.terrainObjFlag = true;
						this.terrain = <Mesh> d;
						this.terrain.y = 98;
						this.view.scene.addChild(this.terrain);
					}

					break;
				case AssetType.TEXTURE :
					if (event.url == 'assets/masterchief_base.png' ) {
						this.mat = new TriangleMethodMaterial( <ImageTexture> d, true, true, false );
						this.mat.lightPicker = new StaticLightPicker([this.light]);
					} else if (event.url == 'assets/stone_tx.jpg') {
						this.terrainMaterial = new TriangleMethodMaterial(<ImageTexture> d, true, true, false);
						this.terrainMaterial.lightPicker = new StaticLightPicker([this.light]);
					}

					break;
			}
		}

		if (this.terrainObjFlag && this.terrainMaterial) {
			this.terrain.material = this.terrainMaterial;
			this.terrain.geometry.scaleUV(20, 20);
		}

		if (this.mat && this.spartanFlag)
			for (var c:number = 0; c < this.meshes.length; c++)
				this.meshes[c].material = this.mat;

		this.view.scene.addChild(this.spartan);
		this.onResize();
	}

	public onResize(event:UIEvent = null)
	{
		this.view.y = 0;
		this.view.x = 0;

		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;
	}
}