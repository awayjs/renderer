///<reference path="../../../src/away/_definitions.ts" />

module tests.primitives
{

	export class WireframePrimitiveTest
	{

		private _view			: away.containers.View3D;
        private _cubePrim       : away.primitives.WireframeCube;
        private _spherePrim     : away.primitives.WireframeSphere
        private _raf            : away.utils.RequestAnimationFrame;

		constructor()
		{

			this._view                  = new away.containers.View3D( );
			this._view.backgroundColor  = 0x000000;
			this._view.camera.lens      = new away.cameras.PerspectiveLens( 60 );
			this._cubePrim              = new away.primitives.WireframeCube( 400 , 400 , 400 );

            this._spherePrim            = new away.primitives.WireframeSphere( 500 , 16 , 16 , 0x999999,.5);

            this._view.scene.addChild( this._cubePrim );
            //this._view.scene.addChild( this._spherePrim );

            this._raf = new away.utils.RequestAnimationFrame( this.render , this );
            this._raf.start();

            window.onmousedown = () => this.render();
            window.onresize = () => this.resize();

            this.resize();

		}

		public render( dt:number = null ):void
		{
            this._view.render();
            this._cubePrim.rotationY ++;
           // this._spherePrim.rotationY --;
		}

        public resize()
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }

	}

}
