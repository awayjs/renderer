import BlendMode					= require("awayjs-core/lib/data/BlendMode");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");

import Camera						= require("awayjs-display/lib/entities/Camera");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");


/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class BasicMaterialPass extends PassBase
{
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _diffuseA:number = 1;

	private _fragmentConstantsIndex:number;

	constructor(render:RenderBase, renderOwner:IRenderOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(render, renderOwner, renderableClass, stage);

		this._shader = new ShaderBase(renderableClass, this, this._stage);
	}

	public _iIncludeDependencies(shader:ShaderBase)
	{
		super._iIncludeDependencies(shader);

		if (shader.texture != null)
			shader.uvDependencies++;
    }

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";

        var alphaReg:ShaderRegisterElement;

        if (this.preserveAlpha) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }

		var targetReg:ShaderRegisterElement = sharedReg.shadedTarget;

		if (shader.texture != null) {

			code += shader.texture._iGetFragmentCode(shader, targetReg, regCache, sharedReg, sharedReg.uvVarying);

			if (shader.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
				this._fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}
		} else if (shader.colorBufferIndex != -1) {

			code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
		} else {
			var diffuseInputReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

			this._fragmentConstantsIndex = diffuseInputReg.index*4;

			code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
		}

        if (this.preserveAlpha) {
            code += "mul " + sharedReg.shadedTarget + ".w, " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }

		return code;
	}

	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(renderable, camera, viewProjection);

		if (this._shader.texture != null)
			this._shader.texture._setRenderState(renderable, this._shader);
	}
	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		if (this._shader.texture != null) {
			this._shader.texture.activate(this._shader);

			if (this._shader.alphaThreshold > 0)
				this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
		} else if (this._shader.colorBufferIndex == -1) {
			var index:number = this._fragmentConstantsIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			data[index] = this._diffuseR;
			data[index + 1] = this._diffuseG;
			data[index + 2] = this._diffuseB;
			data[index + 3] = this._diffuseA;
		}
	}
}

export = BasicMaterialPass;