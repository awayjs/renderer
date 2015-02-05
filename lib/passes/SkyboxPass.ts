import BlendMode					= require("awayjs-core/lib/base/BlendMode");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import Camera						= require("awayjs-display/lib/entities/Camera");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 * SkyboxPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class SkyboxPass extends RenderPassBase
{
	public _skybox:Skybox;

	constructor(renderObject:RenderObjectBase, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderObject, renderObjectOwner, renderableClass, stage);

		this._skybox = <Skybox> renderObjectOwner;

		this._shader = new ShaderObjectBase(renderableClass, this, this._stage);
	}


	/**
	* @inheritDoc
	*/
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		//var cubeMapReg:ShaderRegisterElement = registerCache.getFreeTextureReg();

		//this._texturesIndex = cubeMapReg.index;

		//ShaderCompilerHelper.getTexCubeSampleCode(sharedRegisters.shadedTarget, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping);

		var mip:string = ",mipnone";

		if (shaderObject.useMipmapping)
			mip = ",miplinear";

		return "tex ft0, v0, fs0 <cube," + ShaderCompilerHelper.getFormatStringForTexture(this._skybox.cubeMap) + "linear,clamp" + mip + ">\n";
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		var context:IContextGL = this._stage.context;
		context.setDepthTest(false, ContextGLCompareMode.LESS);
		this._stage.activateCubeTexture(0, this._skybox.cubeMap, this._shader.useSmoothTextures, this._shader.useMipmapping);
	}
}

export = SkyboxPass;