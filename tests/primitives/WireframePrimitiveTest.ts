import Vector3D						from "awayjs-core/lib/geom/Vector3D";
import RequestAnimationFrame		from "awayjs-core/lib/utils/RequestAnimationFrame";
import Debug						from "awayjs-core/lib/utils/Debug";

import View							from "awayjs-display/lib/View";
import Sprite						from "awayjs-display/lib/display/Sprite";
import ElementsType					from "awayjs-display/lib/graphics/ElementsType";
import PrimitivePrefabBase			from "awayjs-display/lib/prefabs/PrimitivePrefabBase";
import PrimitivePolygonPrefab		from "awayjs-display/lib/prefabs/PrimitivePolygonPrefab";
import PrimitiveConePrefab			from "awayjs-display/lib/prefabs/PrimitiveConePrefab";
import PrimitiveCubePrefab			from "awayjs-display/lib/prefabs/PrimitiveCubePrefab";
import PrimitiveCylinderPrefab		from "awayjs-display/lib/prefabs/PrimitiveCylinderPrefab";
import PrimitivePlanePrefab			from "awayjs-display/lib/prefabs/PrimitivePlanePrefab";
import PrimitiveSpherePrefab		from "awayjs-display/lib/prefabs/PrimitiveSpherePrefab";

import DefaultRenderer				from "awayjs-renderergl/lib/DefaultRenderer";

class WireframePrimitiveTest
{
	private view:View;
	private raf:RequestAnimationFrame;
	private meshes:Array<Sprite> = new Array<Sprite>();

	private radius:number = 400;

	constructor()
	{
		Debug.LOG_PI_ERRORS = false;
		Debug.THROW_ERRORS = false;

		this.view = new View(new DefaultRenderer());
		this.raf = new RequestAnimationFrame(this.render, this);

		this.view.backgroundColor = 0x222222;

		window.onresize = (event:UIEvent) => this.onResize(event);

		this.initSpritees();
		this.raf.start();
		this.onResize();
	}

	private initSpritees():void
	{

		var primitives:Array<PrimitivePrefabBase> = new Array<PrimitivePrefabBase>();
		primitives.push(new PrimitivePolygonPrefab(null, ElementsType.LINE));
		primitives.push(new PrimitiveSpherePrefab(null, ElementsType.LINE));
		primitives.push(new PrimitiveSpherePrefab(null, ElementsType.LINE));
		primitives.push(new PrimitiveCylinderPrefab(null, ElementsType.LINE));
		primitives.push(new PrimitivePlanePrefab(null, ElementsType.LINE));
		primitives.push(new PrimitiveConePrefab(null, ElementsType.LINE));
		primitives.push(new PrimitiveCubePrefab(null, ElementsType.LINE));

		var mesh:Sprite;

		for (var c:number = 0; c < primitives.length; c++) {
			var t:number = Math.PI*2*c/primitives.length;

			mesh = <Sprite> primitives[c].getNewObject();
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