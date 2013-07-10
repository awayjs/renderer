///<reference path="../library/assets/IAsset.ts" />
///<reference path="../library/assets/NamedAssetBase.ts" />
///<reference path="../display3D/Context3D.ts" />
///<reference path="../display3D/TextureBase.ts" />
///<reference path="../display3D/Context3DTextureFormat.ts" />
///<reference path="../errors/AbstractMethodError.ts" />
///<reference path="TextureProxyBase.ts" />

module away.textures
{

	
	//use namespace arcane;
	
	export class Texture2DBase extends away.textures.TextureProxyBase
	{
		constructor()
		{
			super();
		}
		
		public _pCreateTexture(context:away.display3D.Context3D):away.display3D.TextureBase
		{
			return context.createTexture(this.width, this.height, away.display3D.Context3DTextureFormat.BGRA, false);
		}
	}
}
