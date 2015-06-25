import BitmapImage2D				= require("awayjs-core/lib/data/BitmapImage2D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import LoaderSession				= require("awayjs-core/lib/library/LoaderSession");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PrimitivePlanePrefab			= require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

class BitmapImage2DReflectionTest
{
	private view:View;
	private raf:RequestAnimationFrame;
	private reflectionMesh:Mesh;
	private fullmesh:Mesh;

	constructor()
	{
		this.view = new View(new DefaultRenderer());
		this.raf = new RequestAnimationFrame(this.render, this);

		var session:LoaderSession = AssetLibrary.getLoaderSession();
		session.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));
		session.load(new URLRequest('assets/dots.png'));

		window.onresize = (event:UIEvent) => this.onResize(event);
	}

	private onResourceComplete(event:LoaderEvent)
	{
		var loader:LoaderSession   = <LoaderSession> event.target;
		var l:number = loader.baseDependency.assets.length;

		for (var c:number = 0; c < l; c++) {

			var asset:IAsset = loader.baseDependency.assets[c];

			switch (asset.assetType) {
				case BitmapImage2D.assetType:

					var prefab:PrimitivePlanePrefab = new PrimitivePlanePrefab(500 , 500, 1, 1, false);
					var tx:Single2DTexture = new Single2DTexture(<BitmapImage2D> asset);
					var bitmap:BitmapImage2D = new BitmapImage2D(1024, 1024, true, 0x00000000);

					var imageCanvas:HTMLCanvasElement = <HTMLCanvasElement> document.createElement("canvas");
					imageCanvas.width = 1024;
					imageCanvas.height = 1024;
					var context:CanvasRenderingContext2D = imageCanvas.getContext("2d");
					var imageData:ImageData = context.getImageData(0, 0, 1024, 1024);

					context.translate(0, 1024);
					context.scale(1, -1);
					context.drawImage((<BitmapImage2D> asset).getCanvas(), 0, 0, 1024, 1024);

					var gradient = context.createLinearGradient(0, 0, 0, 1024);
					gradient.addColorStop(0.8, "rgba(255, 255, 255, 1.0)");
					gradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

					context.fillStyle = gradient;
					context.rect(0, 0, 1024, 1024);
					context.globalCompositeOperation = "destination-out";
					context.fill();

					bitmap.draw(imageCanvas);

					var bitmapClone:BitmapImage2D = new BitmapImage2D(1024, 1024, true, 0x00000000);
					bitmapClone.copyPixels(bitmap, bitmapClone.rect, bitmapClone.rect);

					document.body.appendChild(bitmap.getCanvas());

					var bmpTX:Single2DTexture = new Single2DTexture(bitmapClone);

					var material:BasicMaterial = new BasicMaterial(bmpTX);
					material.bothSides = true;
					material.alphaBlending = true;
					material.mipmap = false;

					var material2:BasicMaterial = new BasicMaterial(tx);
					material2.bothSides = true;
					material2.alphaBlending = true;

					this.reflectionMesh = <Mesh> prefab.getNewObject();
					this.reflectionMesh.material = material;
					this.view.scene.addChild(this.reflectionMesh);

					this.fullmesh = <Mesh> prefab.getNewObject();
					this.fullmesh.material = material2;
					this.fullmesh.rotationY = 90;
					this.view.scene.addChild(this.fullmesh);

					break;
			}
		}

		this.raf.start();
		this.onResize();
	}

	private onResize(event:UIEvent = null)
	{
		this.view.x = window.innerWidth/2;
		this.view.width = window.innerWidth/2;
		this.view.height = window.innerHeight;
	}

	private render()
	{
		this.fullmesh.rotationY +=.5;
		this.reflectionMesh.rotationY +=.5;

		this.view.render();
	}
}