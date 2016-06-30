import {ISurface}						from "@awayjs/display/lib/base/ISurface";
import {Camera}						from "@awayjs/display/lib/display/Camera";

import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_SurfacePassBase}			from "../surfaces/GL_SurfacePassBase";
import {SurfacePool}					from "../surfaces/SurfacePool";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";
import {GL_TextureBase}				from "../textures/GL_TextureBase";

/**
 * GL_DepthSurface forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class GL_DepthSurface extends GL_SurfacePassBase
{
	private _fragmentConstantsIndex:number;
	private _textureVO:GL_TextureBase;

	/**
	 *
	 * @param pool
	 * @param surface
	 * @param elementsClass
	 * @param stage
	 */
	constructor(surface:ISurface, elementsClass:IElementsClassGL, renderPool:SurfacePool)
	{
		super(surface, elementsClass, renderPool);

		this._shader = new ShaderBase(elementsClass, this, this._stage);

		this._pAddPass(this);
	}

	public invalidate():void
	{
		super.invalidate();

		this._textureVO = this._surface.getTextureAt(0)? <GL_TextureBase> this._shader.getAbstraction(this._surface.getTextureAt(0)) : null;
	}

	public _iIncludeDependencies(shader:ShaderBase):void
	{
		super._iIncludeDependencies(shader);

		shader.projectionDependencies++;

		if (shader.alphaThreshold > 0)
			shader.uvDependencies++;
	}


	public _iInitConstantData(shader:ShaderBase):void
	{
		super._iInitConstantData(shader);

		var index:number = this._fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index] = 1.0;
		data[index + 1] = 255.0;
		data[index + 2] = 65025.0;
		data[index + 3] = 16581375.0;
		data[index + 4] = 1.0/255.0;
		data[index + 5] = 1.0/255.0;
		data[index + 6] = 1.0/255.0;
		data[index + 7] = 0.0;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var targetReg:ShaderRegisterElement = sharedRegisters.shadedTarget;
		var dataReg1:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = dataReg1.index*4;

		var temp1:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp1, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		code += "div " + temp1 + ", " + sharedRegisters.projectionFragment + ", " + sharedRegisters.projectionFragment + ".w\n" + //"sub ft2.z, fc0.x, ft2.z\n" +    //invert
			"mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
			"frc " + temp1 + ", " + temp1 + "\n" +
			"mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";

		//codeF += "mov ft1.w, fc1.w	\n" +
		//    "mov ft0.w, fc0.x	\n";

		if (this._textureVO && shader.alphaThreshold > 0) {

			var albedo:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
				"kil " + albedo + ".w\n";
		}

		code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";

		registerCache.removeFragmentTempUsage(temp1);
		registerCache.removeFragmentTempUsage(temp2);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera):void
	{
		super._iActivate(camera);

		if (this._textureVO && this._shader.alphaThreshold > 0) {
			this._textureVO.activate(this);

			this._shader.fragmentConstantData[this._fragmentConstantsIndex + 8] = this._shader.alphaThreshold;
		}
	}
}