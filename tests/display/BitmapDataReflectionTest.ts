import BitmapData					= require("awayjs-core/lib/base/BitmapData");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import AssetLoader					= require("awayjs-core/lib/library/AssetLoader");
import AssetLoaderToken				= require("awayjs-core/lib/library/AssetLoaderToken");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import BitmapTexture				= require("awayjs-core/lib/textures/BitmapTexture");
import ImageTexture					= require("awayjs-core/lib/textures/ImageTexture");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import PrimitivePlanePrefab			= require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/render/DefaultRenderer");
import TriangleBasicMaterial		= require("awayjs-renderergl/lib/materials/TriangleBasicMaterial");

class BitmapDataReflectionTest
{
	private view:View;
	private raf:RequestAnimationFrame;
	private reflectionMesh:Mesh;
	private fullmesh:Mesh;

	constructor()
	{
		this.view = new View(new DefaultRenderer());
		this.raf = new RequestAnimationFrame(this.render, this);

		var token:AssetLoaderToken = AssetLibrary.load( new URLRequest('assets/dots.png'));
		token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

		window.onresize = (event:UIEvent) => this.onResize(event);
	}

	private onResourceComplete(event:LoaderEvent)
	{
		var loader:AssetLoader   = <AssetLoader> event.target;
		var l:number = loader.baseDependency.assets.length;

		for (var c:number = 0; c < l; c++) {

			var asset:IAsset = loader.baseDependency.assets[c];

			switch (asset.assetType) {
				case AssetType.TEXTURE:

					var prefab:PrimitivePlanePrefab = new PrimitivePlanePrefab(500 , 500, 1, 1, false);
					var tx:ImageTexture = <ImageTexture> asset;
					var bitmap:BitmapData = new BitmapData(1024, 1024, true, 0x00000000);

					bitmap.context.translate(0, 1024);
					bitmap.context.scale(1, -1);
					bitmap.context.drawImage(tx.htmlImageElement, 0, 0, 1024, 1024);

					var gradient = bitmap.context.createLinearGradient(0, 0, 0, 1024);
					gradient.addColorStop(0.8, "rgba(255, 255, 255, 1.0)");
					gradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

					bitmap.context.fillStyle = gradient;
					bitmap.context.rect(0, 0, 1024, 1024);
					bitmap.context.globalCompositeOperation = "destination-out";
					bitmap.context.fill();

					var bitmapClone:BitmapData = new BitmapData(1024, 1024, true, 0x00000000);
					bitmapClone.copyPixels(bitmap, bitmapClone.rect, bitmapClone.rect);

					document.body.appendChild(bitmap.canvas);

					var bmpTX:BitmapTexture = new BitmapTexture(bitmapClone, false);

					var material:TriangleBasicMaterial = new TriangleBasicMaterial(bmpTX);
					material.bothSides = true;
					material.alphaBlending = true;

					var material2:TriangleBasicMaterial = new TriangleBasicMaterial(tx);
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