/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.cubes
{
	
	export class CubeDemo
	{
		
		private _stage			: away.display.Stage;
		
		private _scene			: away.containers.Scene3D;
		private _cam			: away.cameras.Camera3D;
		private _renderer		: away.render.DefaultRenderer;
		private _view			: away.containers.View3D;
		
		private _stageProxy		: away.managers.Stage3DProxy;
		private _stageManager	: away.managers.Stage3DManager;
		
		private _cube      		: away.primitives.CubeGeometry;
		private _torus       	: away.primitives.TorusGeometry;
		private _mesh  			: away.entities.Mesh;
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._stage = new away.display.Stage();
			
			this._cam = new away.cameras.Camera3D();
			var p: away.cameras.PerspectiveLens = new away.cameras.PerspectiveLens( 40 );
			
			this._cam.lens = p;
			
			this._renderer = new away.render.DefaultRenderer();
			this._scene = new away.containers.Scene3D();
			
			this._stageManager = away.managers.Stage3DManager.getInstance( this._stage );
			this._stageProxy = this._stageManager.getStage3DProxy( 0 );
			
			this._renderer.iStage3DProxy = this._stageProxy;
			
			this._view = new away.containers.View3D( this._scene, this._cam, this._renderer );
			this._view.stage3DProxy = this._stageProxy;
			
			this._cube = new away.primitives.CubeGeometry( 1.0, 1.0, 1.0 );
			//this._torus = new away.primitives.TorusGeometry( 1.0, 0.5 );
			this._mesh = new away.entities.Mesh( this._cube );
			
			this._scene.addChild( this._mesh );
			
			
			
			console.log( this._scene );
			
			this._view.render();
		}
	}
}