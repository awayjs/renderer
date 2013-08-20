/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.cubes
{
	
	export class CubeDemo
	{
		

		private _scene			: away.containers.Scene3D;
		private _view			: away.containers.View3D;

		private _cube      		: away.primitives.CubeGeometry;
		private _torus       	: away.primitives.TorusGeometry;
		private _mesh  			: away.entities.Mesh;
		private _mesh2  		: away.entities.Mesh;
		
		private _raf			:away.utils.RequestAnimationFrame;
		private _image			:HTMLImageElement;
		private _cameraAxis		:away.geom.Vector3D;
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._view              = new away.containers.View3D( );
			
			this._view.backgroundColor = 0x776655;
			this._view.camera.x = 130;
			this._view.camera.y = 0;
			this._view.camera.z = 0;
			this._cameraAxis = new away.geom.Vector3D( 0, 0, 1 );
			
			this._view.camera.lens = new away.cameras.PerspectiveLens( 120 );
			
			this._cube              = new away.primitives.CubeGeometry( 20.0, 20.0, 20.0 );
			this._torus             = new away.primitives.TorusGeometry( 150, 80, 32, 16, true );
			
			this.loadResources();
		}
		
		private loadResources()
		{
			var urlRequest:away.net.URLRequest = new away.net.URLRequest( "130909wall_big.png" );
			var imgLoader:away.net.IMGLoader = new away.net.IMGLoader();
			imgLoader.addEventListener( away.events.Event.COMPLETE, this.imageCompleteHandler, this );
			imgLoader.load( urlRequest );
		}
		
		private imageCompleteHandler(e)
		{
			var imageLoader:away.net.IMGLoader = <away.net.IMGLoader> e.target
			this._image = imageLoader.image;
			
			var ts : away.textures.HTMLImageElementTexture = new away.textures.HTMLImageElementTexture( this._image, false );
			
			var matTx: away.materials.TextureMaterial = new away.materials.TextureMaterial( ts, true, true, false );
			matTx.bothSides = true;
			
			this._mesh              = new away.entities.Mesh( this._torus, matTx );
			this._mesh2              = new away.entities.Mesh( this._cube, matTx );
			this._mesh2.x = 130;
			this._mesh2.z = 40;
			
			this._view.scene.addChild( this._mesh );
			this._view.scene.addChild( this._mesh2 );
			
			this._raf = new away.utils.RequestAnimationFrame( this.render , this );
            this._raf.start();
		}
		
		public render( dt:number = null ):void
		{
			try
			{
				this._view.camera.rotate( this._cameraAxis, 1 ); 
				this._mesh.rotationY += 1;
				this._mesh2.rotationX += 0.4;
				this._mesh2.rotationY += 0.4;
				this._view.render();
			}
			catch(e)
			{
			}
		}
	}
}