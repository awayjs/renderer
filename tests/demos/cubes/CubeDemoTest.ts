/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../../src/away/_definitions.ts" />

module demos.cubes
{
	
	export class CubeDemoTest
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
			this._cube              = new away.primitives.CubeGeometry( 100.0, 100.0, 100.0 );
			this._mesh              = new away.entities.Mesh( this._cube );
			this._view.scene.addChild( this._mesh );

            document.onmousedown = ( e ) => this.onMouseDowm( e );

		}

        private onMouseDowm( e )
        {

            this._view.render();

        }

	}
}

var test: demos.cubes.CubeDemoTest;
window.onload = function ()
{
    test = new demos.cubes.CubeDemoTest();
}

