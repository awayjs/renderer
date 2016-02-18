import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import Camera						= require("awayjs-display/lib/entities/Camera");
import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");

import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import RenderPassBase				= require("awayjs-renderergl/lib/render/RenderPassBase");
import IElementsClassGL				= require("awayjs-renderergl/lib/elements/IElementsClassGL");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import GL_TextureBase				= require("awayjs-renderergl/lib/textures/GL_TextureBase");

/**
 * DistanceRender is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
class DistanceRender extends RenderPassBase
{
	private _textureVO:GL_TextureBase;
	private _fragmentConstantsIndex:number;

	/**
	 * Creates a new DistanceRender object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(renderOwner:IRenderOwner, elementsClass:IElementsClassGL, renderPool:RenderPool)
	{
		super(renderOwner, elementsClass, renderPool);

		this._shader = new ShaderBase(elementsClass, this, this._stage);

		this._pAddPass(this);
	}

	public invalidate()
	{
		super.invalidate();

		this._textureVO = this._renderOwner.getTextureAt(0)? <GL_TextureBase> this._shader.getAbstraction(this._renderOwner.getTextureAt(0)) : null;
	}

	/**
	 * Initializes the unchanging constant data for this material.
	 */
	public _iInitConstantData(shader:ShaderBase)
	{
		super._iInitConstantData(shader);

		var index:number = this._fragmentConstantsIndex;
		var data:Float32Array = shader.fragmentConstantData;
		data[index + 4] = 1.0/255.0;
		data[index + 5] = 1.0/255.0;
		data[index + 6] = 1.0/255.0;
		data[index + 7] = 0.0;
	}

	public _iIncludeDependencies(shader:ShaderBase)
	{
		super._iIncludeDependencies(shader);

		shader.projectionDependencies++;
		shader.viewDirDependencies++;

		if (shader.alphaThreshold > 0)
			shader.uvDependencies++;

		if (shader.viewDirDependencies > 0)
			shader.globalPosDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var targetReg:ShaderRegisterElement = sharedRegisters.shadedTarget;
		var dataReg1:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

		this._fragmentConstantsIndex = dataReg1.index*4;

		var temp1:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp1, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(temp2, 1);

		// squared distance to view
		code = "dp3 " + temp1 + ".z, " + sharedRegisters.viewDirVarying + ".xyz, " + sharedRegisters.viewDirVarying + ".xyz\n" +
			"mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" +
			"frc " + temp1 + ", " + temp1 + "\n" +
			"mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";

		if (this._textureVO && shader.alphaThreshold > 0) {

			var albedo:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			code += this._textureVO._iGetFragmentCode(albedo, registerCache, sharedRegisters, sharedRegisters.uvVarying);

			var cutOffReg:ShaderRegisterElement = registerCache.getFreeFragmentConstant();

			code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" +
				"kil " + albedo + ".w\n";
		}

		code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		var f:number = camera.projection.far;

		f = 1/(2*f*f);
		// sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
		var index:number = this._fragmentConstantsIndex;
		var data:Float32Array = this._shader.fragmentConstantData;
		data[index] = 1.0*f;
		data[index + 1] = 255.0*f;
		data[index + 2] = 65025.0*f;
		data[index + 3] = 16581375.0*f;

		if (this._textureVO && this._shader.alphaThreshold > 0) {
			this._textureVO.activate(this);

			data[index + 8] = this._shader.alphaThreshold;
		}
	}
}

export = DistanceRender;