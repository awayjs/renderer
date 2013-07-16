/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>


module away.events
{
	export class CameraEvent extends away.events.Event
	{
		public static LENS_CHANGED:string = "lensChanged";
		
		private _camera:away.cameras.Camera3D;
		
		constructor( type:string, camera:away.cameras.Camera3D )
		{
			super( type );
			this._camera = camera;
		}
		
		public get camera():away.cameras.Camera3D
		{
			return this._camera;
		}
	}
}