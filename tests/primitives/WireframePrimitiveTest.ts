import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug						= require("awayjs-core/lib/utils/Debug");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PrimitivePrefabBase			= require("awayjs-display/lib/prefabs/PrimitivePrefabBase");
import PrimitivePolygonPrefab		= require("awayjs-display/lib/prefabs/PrimitivePolygonPrefab");
import PrimitiveConePrefab			= require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
import PrimitiveCubePrefab			= require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
import PrimitiveCylinderPrefab		= require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
import PrimitivePlanePrefab			= require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
import PrimitiveSpherePrefab		= require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

class WireframePrimitiveTest
{
	private view:View;
	private raf:RequestAnimationFrame;
	private meshes:Array<Mesh> = new Array<Mesh>();

	private radius:number = 400;

	constructor()
	{
		Debug.LOG_PI_ERRORS = false;
		Debug.THROW_ERRORS = false;

		this.view = new View(new DefaultRenderer());
		this.raf = new RequestAnimationFrame(this.render, this);

		this.view.backgroundColor = 0x222222;

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.initMeshes();
		this.raf.start();
		this.onResize();
	}

	private initMeshes():void
	{

		var primitives:Array<PrimitivePrefabBase> = new Array<PrimitivePrefabBase>();
		primitives.push(new PrimitivePolygonPrefab());
		primitives.push(new PrimitiveSpherePrefab());
		primitives.push(new PrimitiveSpherePrefab());
		primitives.push(new PrimitiveCylinderPrefab());
		primitives.push(new PrimitivePlanePrefab());
		primitives.push(new PrimitiveConePrefab());
		primitives.push(new PrimitiveCubePrefab());

		var mesh:Mesh;

		for (var c:number = 0; c < primitives.length; c++) {
			primitives[c].geometryType = "lineSubGeometry";

			var t:number = Math.PI*2*c/primitives.length;

			mesh = <Mesh> primitives[c].getNewObject();
			mesh.x = Math.cos(t)*this.radius;
			mesh.y = Math.sin(t)*this.radius;
			mesh.z = 0;
			mesh.transform.scaleTo(2, 2, 2);

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