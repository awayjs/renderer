import {AbstractMethodError, AssetEvent, AbstractionBase} from "@awayjs/core";

import {Stage, ContextGLTextureFormat, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, ImageBase} from "@awayjs/stage";

import {_Render_RenderableBase} from "./_Render_RenderableBase";
import {ShaderBase} from "./ShaderBase";

import {ITexture} from "../base/ITexture";
import {ChunkVO} from "../base/ChunkVO";

/**
 *
 * @class away.pool._Shader_TextureBaseBase
 */
export class _Shader_TextureBase extends AbstractionBase
{
	protected _texture:ITexture;
    protected _shader:ShaderBase;
    protected _stage:Stage;

	constructor(texture:ITexture, shader:ShaderBase)
	{
		super(texture, shader);

		this._texture = texture;
		this._shader = shader;
		this._stage = shader._stage;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._texture = null;
		this._shader = null;
		this._stage = null;
	}


    /**
     * Initializes the properties for a MethodVO, including register and texture indices.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    public _initVO(chunkVO:ChunkVO):void
    {

    }

    /**
     * Initializes unchanging shader constants using the data from a MethodVO.
     *
     * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
     *
     * @internal
     */
    public _initConstants():void
    {

    }

	public _getFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public _setRenderState(renderState:_Render_RenderableBase):void
	{
		//overidden for state logic
	}

	public activate():void
	{
		//overridden for activation logic
	}

	public getTextureReg(imageIndex:number, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):ShaderRegisterElement
	{
		var index:number = this._shader.imageIndices.indexOf(imageIndex); //todo: collapse the index based on duplicate image objects to save registrations

		if (index == -1) {
			var textureReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			sharedReg.textures.push(textureReg);
			this._shader.imageIndices.push(imageIndex);

			return textureReg;
		}

		return sharedReg.textures[index];
	}
}