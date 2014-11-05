import Camera						= require("awayjs-display/lib/entities/Camera");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");

import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");
import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import ShadingMethodEvent			= require("awayjs-renderergl/lib/events/ShadingMethodEvent");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
class TriangleBasicPass extends MaterialPassGLBase
{
	private _diffuseColor:number = 0xffffff;
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _diffuseA:number = 1;

	private _fragmentConstantsIndex:number;
	private _texturesIndex:number;

	/**
	 * The alpha component of the diffuse reflection.
	 */
	public get diffuseAlpha():number
	{
		return this._diffuseA;
	}

	public set diffuseAlpha(value:number)
	{
		this._diffuseA = value;
	}

	/**
	 * The color of the diffuse reflection when not using a texture.
	 */
	public get diffuseColor():number
	{
		return this._diffuseColor;
	}

	public set diffuseColor(diffuseColor:number)
	{
		this._diffuseColor = diffuseColor;

		this._diffuseR = ((this._diffuseColor >> 16) & 0xff)/0xff;
		this._diffuseG = ((this._diffuseColor >> 8) & 0xff)/0xff;
		this._diffuseB = (this._diffuseColor & 0xff)/0xff;
	}

	/**
	 * Creates a new CompiledPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor()
	{
		super();
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

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" +
					"kil " + targetReg + ".w\n" +
					"add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}

		} else {
			diffuseInputReg = regCache.getFreeFragmentConstant();

			this._fragmentConstantsIndex = diffuseInputReg.index*4;

			code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
		}

		return code;
	}

	public _iIncludeDependencies(dependencyCounter:ShaderObjectBase)
	{
		if (dependencyCounter.texture != null)
			dependencyCounter.uvDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(pass:MaterialPassData, renderer:RendererBase, camera:Camera)
	{
		super._iActivate(pass, renderer, camera);

		var shaderObject:ShaderObjectBase = pass.shaderObject;

		if (shaderObject.texture != null) {
			renderer.context.setSamplerStateAt(this._texturesIndex, shaderObject.repeatTextures? ContextGLWrapMode.REPEAT:ContextGLWrapMode.CLAMP, shaderObject.useSmoothTextures? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shaderObject.useMipmapping? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
			renderer.stage.activateTexture(this._texturesIndex, shaderObject.texture);

			if (shaderObject.alphaThreshold > 0)
				shaderObject.fragmentConstantData[this._fragmentConstantsIndex] = shaderObject.alphaThreshold;
		} else {
			var index:number = this._fragmentConstantsIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index] = this._diffuseR;
			data[index + 1] = this._diffuseG;
			data[index + 2] = this._diffuseB;
			data[index + 3] = this._diffuseA;
		}
	}
}

export = TriangleBasicPass;