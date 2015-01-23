import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import Camera						= require("awayjs-display/lib/entities/Camera");

import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");

/**
 * DistancePass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
class DistancePass extends RenderPassBase
{
	private _fragmentConstantsIndex:number;
	private _texturesIndex:number;

	/**
	 * Creates a new DistancePass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(renderObject:RenderObjectBase, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderObject, renderObjectOwner, renderableClass, stage);

		this._shader = new ShaderObjectBase(renderableClass, this, this._stage);
	}

	/**
	 * Initializes the unchanging constant data for this material.
	 */
	public _iInitConstantData(shaderObject:ShaderObjectBase)
	{
		super._iInitConstantData(shaderObject);

		var index:number = this._fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index + 4] = 1.0/255.0;
		data[index + 5] = 1.0/255.0;
		data[index + 6] = 1.0/255.0;
		data[index + 7] = 0.0;
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		super._iIncludeDependencies(shaderObject);

		shaderObject.projectionDependencies++;
		shaderObject.viewDirDependencies++;

		if (shaderObject.alphaThreshold > 0)
			shaderObject.uvDependencies++;

		if (shaderObject.viewDirDependencies > 0)
			shaderObject.globalPosDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string;
		var targetReg:ShaderRegisterElement = sharedRegisters.shadedTarget;
		var diffuseInputReg:ShaderRegisterElement = registerCache.getFreeTextureReg();
		var dataReg1:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		var dataReg2:ShaderRegisterElement = registerCache.getFreeFragmentConstant()

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

		if (shaderObject.alphaThreshold > 0) {
			diffuseInputReg = registerCache.getFreeTextureReg();

			this._texturesIndex = diffuseInputReg.index;

			var albedo:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			code += ShaderCompilerHelper.getTex2DSampleCode(albedo, sharedRegisters, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);

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

		var context:IContextGL = this._stage.context;

		var f:number = camera.projection.far;

		f = 1/(2*f*f);
		// sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
		var index:number = this._fragmentConstantsIndex;
		var data:Array<number> = this._shader.fragmentConstantData;
		data[index] = 1.0*f;
		data[index + 1] = 255.0*f;
		data[index + 2] = 65025.0*f;
		data[index + 3] = 16581375.0*f;

		if (this._shader.alphaThreshold > 0) {
			context.setSamplerStateAt(this._texturesIndex, this._shader.repeatTextures? ContextGLWrapMode.REPEAT:ContextGLWrapMode.CLAMP, this._shader.useSmoothTextures? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, this._shader.useMipmapping? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
			this._stage.activateTexture(this._texturesIndex, this._shader.texture);

			data[index + 8] = this._shader.alphaThreshold;
		}
	}
}

export = DistancePass;