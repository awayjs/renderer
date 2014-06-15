///<reference path="../../_definitions.ts"/>

module away.lights
{
	import StageGL					= away.base.StageGL;
	import Scene					= away.containers.Scene;
	import Camera					= away.entities.Camera;
	import AbstractMethodError		= away.errors.AbstractMethodError;
	import DepthRenderer			= away.render.DepthRenderer;
	import EntityCollector			= away.traverse.EntityCollector;
	import ShadowCasterCollector	= away.traverse.ShadowCasterCollector;
	import RenderTexture			= away.textures.RenderTexture;
	import TextureProxyBase			= away.textures.TextureProxyBase;
	
	export class ShadowMapperBase
	{

		public _pCasterCollector:ShadowCasterCollector;

		private _depthMap:TextureProxyBase;
		public _pDepthMapSize:number = 2048;
		public _pLight:LightBase;
		private _explicitDepthMap:boolean;
		private _autoUpdateShadows:boolean = true;
		public _iShadowsInvalid:boolean;

		constructor()
		{
			this._pCasterCollector = this.pCreateCasterCollector();
		}

		public pCreateCasterCollector()
		{
			return new ShadowCasterCollector();
		}

		public get autoUpdateShadows():boolean
		{
			return this._autoUpdateShadows;
		}

		public set autoUpdateShadows(value:boolean)
		{
			this._autoUpdateShadows = value;
		}

		public updateShadows()
		{
			this._iShadowsInvalid = true;
		}

		public iSetDepthMap(depthMap:TextureProxyBase)
		{
			if (this._depthMap == depthMap)
				return;

			if (this._depthMap && !this._explicitDepthMap)
				this._depthMap.dispose();

			this._depthMap = depthMap;

			if (this._depthMap) {
				this._explicitDepthMap = true;
				this._pDepthMapSize = this._depthMap.size;
			} else {
				this._explicitDepthMap = false;
			}
		}

		public get light():LightBase
		{
			return this._pLight;
		}

		public set light(value:LightBase)
		{
			this._pLight = value;
		}

		public get depthMap():TextureProxyBase
		{
			if (!this._depthMap)
				this._depthMap = this.pCreateDepthTexture();

			return this._depthMap;
		}

		public get depthMapSize():number
		{
			return this._pDepthMapSize;
		}

		public set depthMapSize(value:number)
		{
			if (value == this._pDepthMapSize)
				return;

			this._pSetDepthMapSize(value);
		}

		public dispose()
		{
			this._pCasterCollector = null;

			if (this._depthMap && !this._explicitDepthMap)
				this._depthMap.dispose();

			this._depthMap = null;
		}

		public pCreateDepthTexture():TextureProxyBase
		{
			return new RenderTexture(this._pDepthMapSize, this._pDepthMapSize);
		}

		public iRenderDepthMap(stageGL:StageGL, entityCollector:EntityCollector, renderer:DepthRenderer)
		{
			this._iShadowsInvalid = false;

			this.pUpdateDepthProjection(entityCollector.camera);

			if (!this._depthMap)
				this._depthMap = this.pCreateDepthTexture();

			this.pDrawDepthMap(this._depthMap, entityCollector.scene, renderer);
		}

		public pUpdateDepthProjection(viewCamera:Camera)
		{
			throw new AbstractMethodError();
		}

		public pDrawDepthMap(target:TextureProxyBase, scene:Scene, renderer:DepthRenderer)
		{
			throw new AbstractMethodError();
		}

		public _pSetDepthMapSize(value)
		{
			this._pDepthMapSize = value;

			if (this._explicitDepthMap) {
				throw Error("Cannot set depth map size for the current renderer.");
			} else if (this._depthMap) {
				this._depthMap.dispose();
				this._depthMap = null;
			}
		}
	}
}