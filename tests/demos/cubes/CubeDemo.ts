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
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._view              = new away.containers.View3D( );
			this._view.backgroundColor = 0x776655;
			
			//var lens:away.cameras.PerspectiveLens = new away.cameras.PerspectiveLens( 40 );
			//this._view.camera.lens = lens;
			
			this._cube              = new away.primitives.CubeGeometry( 100.0, 100.0, 100.0 );
			this._torus              = new away.primitives.TorusGeometry(  100, 50, 32, 16, false );
			
			this._mesh              = new away.entities.Mesh( this._torus );
			this._view.scene.addChild( this._mesh );
			
			this._view.render();
			
            document.onmousedown = ( e ) => this.onMouseDowm( e );

		}

        private onMouseDowm( e )
        {
			this._mesh.z -= 10;
            this._view.render();

        }

	}
}