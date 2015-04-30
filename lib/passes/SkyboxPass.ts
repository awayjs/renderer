import BlendMode					= require("awayjs-core/lib/data/BlendMode");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");

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

import TextureObjectBase			= require("awayjs-renderergl/lib/pool/TextureObjectBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import RenderPassBase				= require("awayjs-renderergl/lib/passes/RenderPassBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");

/**
 * SkyboxPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class SkyboxPass extends RenderPassBase
{
	public _skybox:Skybox;
	public _cubeTexture:TextureObjectBase;

	constructor(renderObject:RenderObjectBase, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super(renderObject, renderObjectOwner, renderableClass, stage);

		this._skybox = <Skybox> renderObjectOwner;

		this._shader = new ShaderObjectBase(renderableClass, this, this._stage);

		this._cubeTexture = this._shader.getTextureObject(this._skybox.cubeMap);
	}


	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		super._iIncludeDependencies(shaderObject);

		shaderObject.usesLocalPosFragment = true;
	}

	/**
	* @inheritDoc
	*/
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._cubeTexture._iInitRegisters(shaderObject, registerCache);

		return this._cubeTexture._iGetFragmentCode(shaderObject, sharedRegisters.shadedTarget, registerCache, sharedRegisters.localPositionVarying);
	}

	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		super._iActivate(camera);

		var context:IContextGL = this._stage.context;
		context.setDepthTest(false, ContextGLCompareMode.LESS);
		this._cubeTexture.activate(this._shader);
	}
}

export = SkyboxPass;