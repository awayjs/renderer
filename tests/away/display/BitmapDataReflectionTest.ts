///<reference path="../../../build/stagegl-renderer.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.display
{
	import BitmapData					= away.base.BitmapData;
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import LoaderEvent					= away.events.LoaderEvent;
	import AssetLibrary					= away.library.AssetLibrary;
	import AssetType					= away.library.AssetType;
	import IAsset						= away.library.IAsset;
	import TriangleMaterial				= away.materials.TriangleMaterial;
	import AssetLoader					= away.net.AssetLoader;
	import AssetLoaderToken				= away.net.AssetLoaderToken;
	import PrimitivePlanePrefab			= away.prefabs.PrimitivePlanePrefab;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import BitmapTexture				= away.textures.BitmapTexture;
	import ImageTexture					= away.textures.ImageTexture;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

	export class BitmapDataReflectionTest
	{
		private view:View;
		private raf :RequestAnimationFrame;
		private reflectionMesh:Mesh;
		private fullmesh:Mesh;

		constructor()
		{
			this.view = new View(new DefaultRenderer());
			this.raf = new RequestAnimationFrame(this.render , this);

			var token:AssetLoaderToken = AssetLibrary.load( new away.net.URLRequest('assets/dots.png'));
			token.addEventListener(LoaderEvent.RESOURCE_COMPLETE , (event:LoaderEvent) => this.onResourceComplete(event));

			window.onresize = (event:UIEvent) => this.onResize(event);
		}

		private onResourceComplete( e : away.events.LoaderEvent) : void
		{
			var loader:AssetLoader   = <AssetLoader> e.target;
			var l:number = loader.baseDependency.assets.length;

			for ( var c:number = 0; c < l; c++) {

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

						/*
						bitmap.context.save();
						*/
						document.body.appendChild(bitmap.canvas);

						var bmpTX:BitmapTexture = new BitmapTexture(bitmapClone, false);// Note: MipMaps are not yet supported - so image wont apear if false is not specified...

						var material:TriangleMaterial = new TriangleMaterial(bmpTX);
							material.bothSides = true;
							material.alphaBlending = true;

						var material2:TriangleMaterial = new TriangleMaterial(tx);
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
}