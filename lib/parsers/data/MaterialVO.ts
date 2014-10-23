import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");

import TextureVO						= require("awayjs-renderergl/lib/parsers/data/TextureVO");

/**
 *
 */
class MaterialVO
{
	public name:string;
	public ambientColor:number /*int*/;
	public diffuseColor:number /*int*/;
	public specularColor:number /*int*/;
	public twoSided:boolean;
	public colorMap:TextureVO;
	public specularMap:TextureVO;
	public material:MaterialBase;
}

export = MaterialVO;