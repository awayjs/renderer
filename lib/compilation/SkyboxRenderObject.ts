import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import BlendMode					= require("awayjs-display/lib/base/BlendMode");
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
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import RenderObjectPool				= require("awayjs-renderergl/lib/compilation/RenderObjectPool");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 * SkyboxRenderObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class SkyboxRenderObject extends RenderObjectBase
{
	/**
	 *
	 */
	public static id:string = "skybox";

	public _skybox:Skybox;

	private _fragmentConstantsIndex:number;
	private _texturesIndex:number;

	private _screenShader:ShaderObjectBase;

	private _alphaBlending:boolean = false;
	private _alpha:number = 1;

	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	constructor(pool:RenderObjectPool, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(pool, renderObjectOwner, renderableClass, stage);

		this._skybox = <Skybox> renderObjectOwner;
		this._screenShader = new ShaderObjectBase(renderObjectOwner, renderableClass, this, this._stage);

		this._pAddScreenShader(this._screenShader);
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

		if (this._skybox.cubeMap.hasMipmaps)
			mip = ",miplinear";

		return "tex ft0, v0, fs0 <cube," + ShaderCompilerHelper.getFormatStringForTexture(this._skybox.cubeMap) + "linear,clamp" + mip + ">\n";
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(shader:ShaderObjectBase, camera:Camera)
	{
		super._iActivate(shader, camera);

		var context:IContextGL = this._stage.context;
		context.setSamplerStateAt(0, ContextGLWrapMode.CLAMP, ContextGLTextureFilter.LINEAR, this._skybox.cubeMap.hasMipmaps? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
		context.setDepthTest(false, ContextGLCompareMode.LESS);
		this._stage.activateCubeTexture(0, this._skybox.cubeMap);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRenderObject()
	{
		this.setBlendAndCompareModes();

		this._pClearScreenShaders();

		this._pAddScreenShader(this._screenShader);
	}

	/**
	 * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
	 */
	private setBlendAndCompareModes()
	{
		this._pRequiresBlending = (this._renderObjectOwner.blendMode != BlendMode.NORMAL || this._alphaBlending || this._alpha < 1);
		//this._screenShader.depthCompareMode = this._depthCompareMode;
		//this._screenShader.preserveAlpha = this._pRequiresBlending;
		this._screenShader.setBlendMode((this._renderObjectOwner.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._renderObjectOwner.blendMode);
		//this._screenShader.forceSeparateMVP = false;
	}
}

export = SkyboxRenderObject;