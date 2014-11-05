import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug						= require("awayjs-core/lib/utils/Debug");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import PrimitiveTorusPrefab			= require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");
import TriangleBasicMaterial		= require("awayjs-renderergl/lib/materials/TriangleBasicMaterial");

class View3DTest
{

	private view:View;
	private torus:PrimitiveTorusPrefab;

	private light:PointLight;
	private raf:RequestAnimationFrame;
	private meshes:Array<Mesh>;

	constructor()
	{

		Debug.THROW_ERRORS = false;
		Debug.LOG_PI_ERRORS = false;

		this.meshes = new Array<Mesh>();
		this.light = new PointLight();
		this.view = new View(new DefaultRenderer())
		this.view.camera.z = 0;
		this.view.backgroundColor = 0x776655;
		this.torus = new PrimitiveTorusPrefab(150 , 50 , 32 , 32 , false);

		var l:number        = 10;
		var radius:number        = 1000;
		var matB:TriangleBasicMaterial = new TriangleBasicMaterial();

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

		this.raf = new RequestAnimationFrame(this.tick , this);
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