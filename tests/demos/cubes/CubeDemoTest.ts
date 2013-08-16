/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.cubes
{
	
	export class CubeDemoTest
	{
		
		private _view			: away.containers.View3D;
        private _cube      		: away.primitives.CubeGeometry;
        private _torus          : away.primitives.TorusGeometry;
		private _mesh  			: away.entities.Mesh;
        private raf             : away.utils.RequestAnimationFrame;
		
		constructor()
		{
			
			away.Debug.THROW_ERRORS = false;
			
			this._view              = new away.containers.View3D( );
			this._cube              = new away.primitives.CubeGeometry( 100.0, 100.0, 100.0 );
            this._torus             = new away.primitives.TorusGeometry(100, 50, 32, 16, false);
			this._mesh              = new away.entities.Mesh( this._torus );

			this._view.scene.addChild( this._mesh );

            document.onmousedown = ( e ) => this.onMouseDowm( e );

            //this.raf = new away.utils.RequestAnimationFrame( this.render , this );
            //this.raf.start();

            //setInterval( ( ) => this.render , 100 );

            //this.raf.start();

		}

        private render( dt : number = null )
        {

            try
            {

                this._mesh.rotationY -= 2;
                //this._mesh.z -= 2;
                this._view.render();

            } catch(e)
            {

            }


        }

        private onMouseDowm( e )
        {

            this.render();//.render();




        }

	}
}

var test: demos.cubes.CubeDemoTest;
window.onload = function ()
{
    test = new demos.cubes.CubeDemoTest();
}

