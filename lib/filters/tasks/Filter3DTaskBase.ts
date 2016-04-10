import Image2D						from "awayjs-core/lib/image/Image2D";

import AbstractMethodError			from "awayjs-core/lib/errors/AbstractMethodError";
import ByteArray					from "awayjs-core/lib/utils/ByteArray";

import Camera						from "awayjs-display/lib/display/Camera";

import Stage						from "awayjs-stagegl/lib/base/Stage";
import AGALMiniAssembler			from "awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler";
import IProgram						from "awayjs-stagegl/lib/base/IProgram";

import RTTBufferManager				from "../../managers/RTTBufferManager";

class Filter3DTaskBase
{
	private _mainInputTexture:Image2D;

	public _scaledTextureWidth:number = -1;
	public _scaledTextureHeight:number = -1;
	public _rttManager:RTTBufferManager;
	public _textureWidth:number = -1;
	public _textureHeight:number = -1;
	private _textureDimensionsInvalid:boolean = true;
	private _program3DInvalid:boolean = true;
	private _program3D:IProgram;
	private _target:Image2D;
	private _requireDepthRender:boolean;
	private _textureScale:number = 0;

	constructor(requireDepthRender:boolean = false)
	{
		this._requireDepthRender = requireDepthRender;
	}

	/**
	 * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
	 */
	public get textureScale():number
	{
		return this._textureScale;
	}

	public set textureScale(value:number)
	{
		if (this._textureScale == value)
			return;

		this._textureScale = value;
		this._scaledTextureWidth = this._textureWidth >> this._textureScale;
		this._scaledTextureHeight = this._textureHeight >> this._textureScale;
		this._textureDimensionsInvalid = true;
	}

	public get target():Image2D
	{
		return this._target;
	}

	public set target(value:Image2D)
	{
		this._target = value;
	}

	public get rttManager():RTTBufferManager
	{
		return this._rttManager;
	}

	public set rttManager(value:RTTBufferManager)
	{
		if (this._rttManager == value)
			return;

		this._rttManager = value;
		this._textureDimensionsInvalid = true;
	}

	public get textureWidth():number
	{
		return this._textureWidth;
	}

	public set textureWidth(value:number)
	{
		if (this._textureWidth == value)
			return;

		this._textureWidth = value;
		this._scaledTextureWidth = this._textureWidth >> this._textureScale;
		this._textureDimensionsInvalid = true;
	}

	public get textureHeight():number
	{
		return this._textureHeight;
	}

	public set textureHeight(value:number)
	{
		if (this._textureHeight == value)
			return;

		this._textureHeight = value;
		this._scaledTextureHeight = this._textureHeight >> this._textureScale;
		this._textureDimensionsInvalid = true;
	}

	public getMainInputTexture(stage:Stage):Image2D
	{
		if (this._textureDimensionsInvalid)
			this.updateTextures(stage);

		return this._mainInputTexture;
	}

	public dispose()
	{
		if (this._mainInputTexture)
			this._mainInputTexture.dispose();

		if (this._program3D)
			this._program3D.dispose();
	}

	public invalidateProgram()
	{
		this._program3DInvalid = true;
	}

	public updateProgram(stage:Stage)
	{
		if (this._program3D)
			this._program3D.dispose();

		this._program3D = stage.context.createProgram();

		var vertexByteCode:ByteArray = (new AGALMiniAssembler().assemble("part vertex 1\n" + this.getVertexCode() + "endpart"))['vertex'].data;
		var fragmentByteCode:ByteArray = (new AGALMiniAssembler().assemble("part fragment 1\n" + this.getFragmentCode() + "endpart"))['fragment'].data;
		this._program3D.upload(vertexByteCode, fragmentByteCode);
		this._program3DInvalid = false;
	}

	public getVertexCode():string
	{
		return "mov op, va0\n" + "mov v0, va1\n";
	}

	public getFragmentCode():string
	{
		throw new AbstractMethodError();
	}

	public updateTextures(stage:Stage)
	{
		if (this._mainInputTexture)
			this._mainInputTexture.dispose();

		this._mainInputTexture = new Image2D(this._scaledTextureWidth, this._scaledTextureHeight);

		this._textureDimensionsInvalid = false;
	}

	public getProgram(stage:Stage):IProgram
	{
		if (this._program3DInvalid)
			this.updateProgram(stage);

		return this._program3D;
	}

	public activate(stage:Stage, camera:Camera, depthTexture:Image2D)
	{
	}

	public deactivate(stage:Stage)
	{
	}

	public get requireDepthRender():boolean
	{
		return this._requireDepthRender;
	}

}

export default Filter3DTaskBase;