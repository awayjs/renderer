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
		
		private _raf			:away.utils.RequestAnimationFrame;
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._view              = new away.containers.View3D( );
			this._view.backgroundColor = 0x776655;
			
			this._cube              = new away.primitives.CubeGeometry( 100.0, 100.0, 100.0 );
			this._torus              = new away.primitives.TorusGeometry(  150, 80, 32, 16, false );
			
			this._mesh              = new away.entities.Mesh( this._torus );
			this._view.scene.addChild( this._mesh );
			
			
			
            document.onmousedown = ( e ) => this.onMouseDowm( e );

			this._raf = new away.utils.RequestAnimationFrame( this.render , this );
            this._raf.start();
			
		}
		
		public render( dt:number = null ):void
		{
			try
			{
				this._mesh.rotationY += 1;
				this._view.render();
			}
			catch(e)
			{
			}
		}

        private onMouseDowm( e )
        {
			
            this._view.render();

        }

	}
}