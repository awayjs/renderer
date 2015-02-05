import BlendMode					= require("awayjs-core/lib/base/BlendMode");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import Camera						= require("awayjs-display/lib/entities/Camera");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");


/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class BasicMaterialPass extends RenderPassBase
{
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _diffuseA:number = 1;

	private _fragmentConstantsIndex:number;
	private _texturesIndex:number;

	constructor(renderObject:RenderObjectBase, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderObject, renderObjectOwner, renderableClass, stage);

		this._shader = new ShaderObjectBase(renderableClass, this, this._stage);
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		super._iIncludeDependencies(shaderObject);

		if (shaderObject.texture != null)
			shaderObject.uvDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var targetReg:ShaderRegisterElement = sharedReg.shadedTarget;
		var diffuseInputReg:ShaderRegisterElement;

		if (shaderObject.texture != null) {
			diffuseInputReg = regCache.getFreeTextureReg();

			this._texturesIndex = diffuseInputReg.index;

			code += ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedReg, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);

			if (shaderObject.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
				this._fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}
		} else if (shaderObject.colorBufferIndex != -1) {

			code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
		} else {
			diffuseInputReg = regCache.getFreeFragmentConstant();

			this._fragmentConstantsIndex = diffuseInputReg.index*4;

			code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		if (this._shader.texture != null) {
			this._stage.activateTexture(this._texturesIndex, this._shader.texture, this._shader.repeatTextures, this._shader.useSmoothTextures, this._shader.useMipmapping);

			if (this._shader.alphaThreshold > 0)
				this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
		} else if (this._shader.colorBufferIndex == -1) {
			var index:number = this._fragmentConstantsIndex;
			var data:Array<number> = this._shader.fragmentConstantData;
			data[index] = this._diffuseR;
			data[index + 1] = this._diffuseG;
			data[index + 2] = this._diffuseB;
			data[index + 3] = this._diffuseA;
		}
	}
}

export = BasicMaterialPass;