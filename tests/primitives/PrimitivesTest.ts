import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import Event						= require("awayjs-core/lib/events/Event");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug						= require("awayjs-core/lib/utils/Debug");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import PrimitivePrefabBase			= require("awayjs-display/lib/prefabs/PrimitivePrefabBase");
import PrimitiveCapsulePrefab		= require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
import PrimitiveConePrefab			= require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
import PrimitiveCubePrefab			= require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
import PrimitiveCylinderPrefab		= require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
import PrimitivePlanePrefab			= require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
import PrimitiveSpherePrefab		= require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
import PrimitiveTorusPrefab			= require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");


import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");
import TriangleMethodMaterial		= require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");
import DefaultMaterialManager		= require("awayjs-renderergl/lib/materials/utils/DefaultMaterialManager");

class PrimitivesTest
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

		Debug.LOG_PI_ERRORS    = false;
		Debug.THROW_ERRORS     = false;

		this.view = new View(new DefaultRenderer());
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
		this.lightB.direction = new Vector3D( -1 , 0 ,1 );
		this.lightB.ambient = 0;
		this.lightB.ambientColor = 0xFFFFFF;
		this.lightB.diffuse = 1;
		this.lightB.specular = 1;

		this.staticLightPicker = new StaticLightPicker([this.light , this.lightB]);

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
		var material:TriangleMethodMaterial = new TriangleMethodMaterial(DefaultMaterialManager.getDefaultTexture());
		material.lightPicker = this.staticLightPicker;
		material.smooth = false;

		primitives.push(new PrimitiveTorusPrefab());
		primitives.push(new PrimitiveSpherePrefab());
		primitives.push(new PrimitiveCapsulePrefab());
		primitives.push(new PrimitiveCylinderPrefab());
		primitives.push(new PrimitivePlanePrefab());
		primitives.push(new PrimitiveConePrefab());
		primitives.push(new PrimitiveCubePrefab());

		var mesh:Mesh;

		for (var c:number = 0; c < primitives.length; c ++) {
			primitives[c].material = material;

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
		if (this.meshes)
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