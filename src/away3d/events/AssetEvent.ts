/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="../library/assets/IAsset.ts" />

module away3d.events
{
	//import away3d.library.assets.IAsset;

	//import flash.events.Event;

	export class AssetEvent extends away3d.events.Event
	{
		public static ASSET_COMPLETE : string = "assetComplete";
		public static ENTITY_COMPLETE : string = "entityComplete";
		public static SKYBOX_COMPLETE : string = "skyboxComplete";
		public static CAMERA_COMPLETE : string = "cameraComplete";
		public static MESH_COMPLETE : string = "meshComplete";
		public static GEOMETRY_COMPLETE : string = "geometryComplete";
		public static SKELETON_COMPLETE : string = "skeletonComplete";
		public static SKELETON_POSE_COMPLETE : string = "skeletonPoseComplete";
		public static CONTAINER_COMPLETE : string = "containerComplete";
		public static TEXTURE_COMPLETE : string = "textureComplete";
		public static TEXTURE_PROJECTOR_COMPLETE : string = "textureProjectorComplete";
		public static MATERIAL_COMPLETE : string = "materialComplete";
		public static ANIMATOR_COMPLETE : string = "animatorComplete";
		public static ANIMATION_SET_COMPLETE : string = "animationSetComplete";
		public static ANIMATION_STATE_COMPLETE : string = "animationStateComplete";
		public static ANIMATION_NODE_COMPLETE : string = "animationNodeComplete";
		public static STATE_TRANSITION_COMPLETE : string = "stateTransitionComplete";
		public static SEGMENT_SET_COMPLETE : string = "segmentSetComplete";
		public static LIGHT_COMPLETE : string = "lightComplete";
		public static LIGHTPICKER_COMPLETE : string = "lightPickerComplete";
		public static EFFECTMETHOD_COMPLETE : string = "effectMethodComplete";
		public static SHADOWMAPMETHOD_COMPLETE : string = "shadowMapMethodComplete";
		
		public static ASSET_RENAME : string = 'assetRename';
		public static ASSET_CONFLICT_RESOLVED : string = 'assetConflictResolved';
		
		public static TEXTURE_SIZE_ERROR : string = 'textureSizeError';

		private _asset : away3d.library.assets.IAsset;
		private _prevName : string;
		
		constructor(type : string, asset : away3d.library.assets.IAsset = null, prevName : string = null)
		{
			super(type);
			
			this._asset = asset;
            this._prevName = prevName || (this._asset? this._asset.name : null);
		}
		
		
		public get asset() : away3d.library.assets.IAsset
		{
			return this._asset;
		}
		
		
		public get assetPrevName() : string
		{
			return this. _prevName;
		}
		
		
		public clone() : Event
		{
			return new AssetEvent( this.type, this.asset, this.assetPrevName);
		}
	}
}