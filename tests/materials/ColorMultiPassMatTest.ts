import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import URLLoader					= require("awayjs-core/lib/net/URLLoader");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import Event						= require("awayjs-core/lib/events/Event")
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");
import Debug						= require("awayjs-core/lib/utils/Debug");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import StaticLightPicker			= require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
import PrimitiveTorusPrefab			= require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");
import TriangleMethodMaterial		= require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");

class ColorMultiPassMatTest
{
	private view:View;
	private torus:PrimitiveTorusPrefab;
	private light:PointLight;
	private raf:RequestAnimationFrame;
	private counter:number = 0;
	private center:Vector3D = new Vector3D();

	constructor()
	{
		Debug.THROW_ERRORS = false;
		Debug.LOG_PI_ERRORS = false;

		this.light = new PointLight();
		this.view = new View(new DefaultRenderer());
		this.view.camera.z = -1000;
		this.view.backgroundColor = 0x000000;
		this.torus = new PrimitiveTorusPrefab(50 , 10, 32 , 32 , false);

		var l:number = 20;
		var radius:number = 500;

		var mat:TriangleMethodMaterial = new TriangleMethodMaterial(0xff0000);

		mat.lightPicker = new StaticLightPicker([this.light]);

		this.torus.material = mat;

		for (var c:number = 0; c < l ; c++) {
			var t:number = Math.PI*2*c/l;
			var m:Mesh = <Mesh> this.torus.getNewObject();

			m.x = Math.cos(t)*radius;
			m.y = 0;
			m.z = Math.sin(t)*radius;

			this.view.scene.addChild(m);
		}

		this.view.scene.addChild(this.light);

		this.view.y = this.view.x = 0;
		this.view.width = window.innerWidth;
		this.view.height = window.innerHeight;

		console.log("renderer ", this.view.renderer);
		console.log("scene ", this.view.scene);
		console.log("view ", this.view);

		this.view.render();

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.raf = new RequestAnimationFrame(this.tick, this);
		this.raf.start();
	}


	private tick(dt:number)
	{
		this.counter += 0.005;
		this.view.camera.lookAt(this.center);
		this.view.camera.x = Math.cos(this.counter)*800;
		this.view.camera.z = Math.sin(this.counter)*800;

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