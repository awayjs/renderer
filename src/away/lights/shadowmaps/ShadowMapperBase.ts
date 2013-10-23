///<reference path="../../_definitions.ts"/>

module away.lights
{
	export class ShadowMapperBase
	{
		
		public _pCasterCollector:away.traverse.ShadowCasterCollector;
		
		private _depthMap:away.textures.TextureProxyBase;
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
			return new away.traverse.ShadowCasterCollector();
		}
		
		public get autoUpdateShadows():boolean
		{
			return this._autoUpdateShadows;
		}
		
		public set autoUpdateShadows( value:boolean )
		{
			this._autoUpdateShadows = value;
		}
		
		public updateShadows()
		{
			this._iShadowsInvalid = true;
		}
		
		public iSetDepthMap( depthMap:away.textures.TextureProxyBase )
		{
			if( this._depthMap == depthMap )
			{
				return;
			}
			if( this._depthMap && !this._explicitDepthMap )
			{
				this._depthMap.dispose();
			}
			this._depthMap = depthMap;
			if( this._depthMap )
			{
				this._explicitDepthMap = true;
				this._pDepthMapSize = this._depthMap.width;
			}
			else
			{
				this._explicitDepthMap = false;
			}
		}
		
		public get light():away.lights.LightBase
		{
			return this._pLight;
		}
		
		public set light( value:away.lights.LightBase )
		{
			this._pLight = value;
		}
		
		public get depthMap():away.textures.TextureProxyBase
		{
			if ( !this._depthMap )
			{
				this._depthMap = this.pCreateDepthTexture()
			}
			return this._depthMap;
		}
		
		public get depthMapSize():number
		{
			return this._pDepthMapSize;
		}
		
		public set depthMapSize( value:number )
		{
			if( value == this._pDepthMapSize )
			{
				return;
			}
			this._pDepthMapSize = value;
			
			if( this._explicitDepthMap )
			{
				throw Error("Cannot set depth map size for the current renderer.");
			}
			else if( this._depthMap )
			{
				this._depthMap.dispose();
				this._depthMap = null;
			}
		}
		
		public dispose()
		{
			this._pCasterCollector = null;
			if ( this._depthMap && !this._explicitDepthMap )
			{
				this._depthMap.dispose();
			}
			this._depthMap = null;
		}

        public pCreateDepthTexture():away.textures.TextureProxyBase
        {
            return new away.textures.RenderTexture( this._pDepthMapSize, this._pDepthMapSize);
        }

		public iRenderDepthMap(stage3DProxy:away.managers.Stage3DProxy, entityCollector:away.traverse.EntityCollector, renderer:away.render.DepthRenderer )
		{
			this._iShadowsInvalid = false;

			this.pUpdateDepthProjection( entityCollector.camera );

			if( !this._depthMap )
			{
				this._depthMap = this.pCreateDepthTexture();
			}
			this.pDrawDepthMap( this._depthMap.getTextureForStage3D(stage3DProxy), entityCollector.scene, renderer);
		}
		
		public pUpdateDepthProjection( viewCamera:away.cameras.Camera3D )
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pDrawDepthMap( target:away.display3D.TextureBase, scene:away.containers.Scene3D, renderer:away.render.DepthRenderer )
		{
			throw new away.errors.AbstractMethodError();
		}
	}
}