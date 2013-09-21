///<reference path="../../../lib/Away3D.next.d.ts" />

module demos.cubes
{
	
	export class CubeDemoTest
	{
		
		private _view			: away.containers.View3D;
        private _cube      		: away.primitives.CubeGeometry;
		private _mesh  			: away.entities.Mesh;
        private raf             : away.utils.RequestAnimationFrame;
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._view              = new away.containers.View3D( );
			this._cube              = new away.primitives.CubeGeometry( 400.0, 400.0, 400.0 );
			this._mesh              = new away.entities.Mesh( this._cube );

			this._view.scene.addChild( this._mesh );

            this.raf = new away.utils.RequestAnimationFrame( this.render , this );
            this.raf.start();

            window.onresize = () => this.resize( null );

            this.resize(null);
		}

        private render( dt : number = null )
        {
            this._mesh.rotationY -= 2;
            this._view.render();
        }

        public resize( e )
        {
            this._view.y         = 0;
            this._view.x         = 0;

            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }

	}
}
