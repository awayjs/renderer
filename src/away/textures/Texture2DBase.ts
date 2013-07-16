

///<reference path="../_definitions.ts"/>

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
