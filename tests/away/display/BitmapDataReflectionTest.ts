///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.display {


	export class BitmapDataReflectionTest
	{
		private view : away.containers.View;
		private raf  : away.utils.RequestAnimationFrame;
		private reflectionMesh : away.entities.Mesh;
		private fullmesh : away.entities.Mesh;

		constructor()
		{
			this.view   = new away.containers.View(new away.render.DefaultRenderer());
			this.raf    = new away.utils.RequestAnimationFrame( this.render , this );

			away.library.AssetLibrary.enableParser( away.parsers.BitmapParser );

			var token : away.net.AssetLoaderToken = away.library.AssetLibrary.load( new away.net.URLRequest('assets/dots.png'));
				token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );

			window.onresize = () => this.resize();


		}

		private onResourceComplete( e : away.events.LoaderEvent) : void
		{
			//var loader : AssetLoader = e.target as AssetLoader;
			var loader : away.net.AssetLoader   = <away.net.AssetLoader> e.target;
			var l       : number                    = loader.baseDependency.assets.length;

			for ( var c : number = 0 ; c < l ; c ++ )
			{

				var asset : away.library.IAsset = loader.baseDependency.assets[c];

				switch (asset.assetType)
				{


					case away.library.AssetType.TEXTURE:

						var geom    : away.primitives.PlaneGeometry = new away.primitives.PlaneGeometry(500  , 500 , 1 , 1 , false );
						var tx      : away.textures.ImageTexture = <away.textures.ImageTexture> asset;
						var bitmap  : away.base.BitmapData = new away.base.BitmapData(  1024, 1024 , true , 0x00000000 )

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

						var bitmapClone  : away.base.BitmapData = new away.base.BitmapData(  1024, 1024 , true , 0x00000000 );
							bitmapClone.copyPixels( bitmap , bitmapClone.rect , bitmapClone.rect )
						/*
						bitmap.context.save();
						*/
						document.body.appendChild(bitmap.canvas );

						var bmpTX : away.textures.BitmapTexture = new away.textures.BitmapTexture( bitmapClone , false  );// Note: MipMaps are not yet supported - so image wont apear if false is not specified...

						var material : away.materials.TextureMaterial = new away.materials.TextureMaterial( bmpTX );
							material.bothSides = true;
							material.alphaBlending = true;

						var material2 : away.materials.TextureMaterial = new away.materials.TextureMaterial( tx );
							material2.bothSides = true;
							material2.alphaBlending = true;

						this.fullmesh  = new away.entities.Mesh( geom , material2 );
						this.fullmesh.rotationY = 90;
						this.reflectionMesh = new away.entities.Mesh( geom , material );
						this.view.scene.addChild(this.reflectionMesh);
						this.view.scene.addChild(this.fullmesh);

						break;



				}



			}

			this.raf.start();
			this.resize();

		}

		private resize()
		{
			this.view.x = window.innerWidth / 2;
			this.view.width = window.innerWidth / 2;
			this.view.height= window.innerHeight;
		}

		private render()
		{
			this.fullmesh.rotationY +=.5;
			this.reflectionMesh.rotationY +=.5;

			this.view.render();
		}

	}

}