import BlendMode					= require("awayjs-core/lib/data/BlendMode");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import AssetBase					= require("awayjs-core/lib/library/AssetBase");
import ArgumentError				= require("awayjs-core/lib/errors/ArgumentError");
import Event						= require("awayjs-core/lib/events/Event");
import EventDispatcher				= require("awayjs-core/lib/events/EventDispatcher");

import Camera						= require("awayjs-display/lib/entities/Camera");
import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
import IRenderObjectOwner			= require("awayjs-display/lib/base/IRenderObjectOwner");

import Stage						= require("awayjs-stagegl/lib/base/Stage")
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");

import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShaderObjectBase				= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import IRenderPassBase				= require("awayjs-renderergl/lib/passes/IRenderPassBase");
import RenderObjectBase				= require("awayjs-renderergl/lib/compilation/RenderObjectBase");

/**
 * RenderPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
class RenderPassBase extends EventDispatcher implements IRenderPassBase
{
	private _renderObject:RenderObjectBase;
	public _renderObjectOwner:IRenderObjectOwner;
	public _renderableClass:IRenderableClass;
	public _stage:Stage;
	
	public _shader:ShaderObjectBase;

	private _preserveAlpha:boolean = true;
	private _forceSeparateMVP:boolean = false;

	private _depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;

	private _blendFactorSource:string = ContextGLBlendFactor.ONE;
	private _blendFactorDest:string = ContextGLBlendFactor.ZERO;

	public _pEnableBlending:boolean = false;

	private _writeDepth:boolean = true;

	public get shader():ShaderObjectBase
	{
		return this._shader;
	}

	public get animationSet():AnimationSetBase
	{
		return <AnimationSetBase> this._renderObjectOwner.animationSet;
	}

	/**
	 * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
	 */
	public get preserveAlpha():boolean
	{
		return this._preserveAlpha;
	}

	public set preserveAlpha(value:boolean)
	{
		if (this._preserveAlpha == value)
			return;

		this._preserveAlpha = value;

		this.invalidatePass();
	}

	/**
	 * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
	 * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
	 * projection code.
	 */
	public get forceSeparateMVP():boolean
	{
		return this._forceSeparateMVP;
	}

	public set forceSeparateMVP(value:boolean)
	{
		if (this._forceSeparateMVP == value)
			return;

		this._forceSeparateMVP = value;

		this.invalidatePass();
	}

	/**
	 * Creates a new RenderPassBase object.
	 */
	constructor(renderObject:RenderObjectBase, renderObjectOwner:IRenderObjectOwner, renderableClass:IRenderableClass, stage:Stage)
	{
		super();

		this._renderObject = renderObject;
		this._renderObjectOwner = renderObjectOwner;
		this._renderableClass = renderableClass;
		this._stage = stage;
	}
	

	/**
	 * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
	 */
	public get writeDepth():boolean
	{
		return this._writeDepth;
	}

	public set writeDepth(value:boolean)
	{
		this._writeDepth = value;
	}

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */
	public get depthCompareMode():string
	{
		return this._depthCompareMode;
	}

	public set depthCompareMode(value:string)
	{
		this._depthCompareMode = value;
	}

	/**
	 * Cleans up any resources used by the current object.
	 * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	 */
	public dispose()
	{
		this._shader.dispose();

		this._shader = null;
	}

	/**
	 * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
	 * @param pass The pass used to render the renderable.
	 * @param renderable The IRenderable object to draw.
	 * @param stage The Stage object used for rendering.
	 * @param entityCollector The EntityCollector object that contains the visible scene data.
	 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	 * camera.viewProjection as it includes the scaling factors when rendering to textures.
	 *
	 * @internal
	 */
	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		this._shader._iRender(renderable, camera, viewProjection);
	}
	/**
	 * The blend mode to use when drawing this renderable. The following blend modes are supported:
	 * <ul>
	 * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
	 * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
	 * <li>BlendMode.MULTIPLY</li>
	 * <li>BlendMode.ADD</li>
	 * <li>BlendMode.ALPHA</li>
	 * </ul>
	 */
	public setBlendMode(value:string)
	{
		switch (value) {
			case BlendMode.NORMAL:
				this._blendFactorSource = ContextGLBlendFactor.ONE;
				this._blendFactorDest = ContextGLBlendFactor.ZERO;
				this._pEnableBlending = false;
				break;

			case BlendMode.LAYER:
				this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
				this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
				this._pEnableBlending = true;
				break;

			case BlendMode.MULTIPLY:
				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
				this._pEnableBlending = true;
				break;

			case BlendMode.ADD:
				this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
				this._blendFactorDest = ContextGLBlendFactor.ONE;
				this._pEnableBlending = true;
				break;

			case BlendMode.ALPHA:
				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
				this._pEnableBlending = true;
				break;

			default:
				throw new ArgumentError("Unsupported blend mode!");
		}
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(camera:Camera)
	{
		this._stage.context.setDepthTest(( this._writeDepth && !this._pEnableBlending ), this._depthCompareMode);

		if (this._pEnableBlending)
			this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);

		this._shader._iActivate(camera);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate()
	{
		this._shader._iDeactivate();

		//For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
		this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 *
	 * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
	 */
	public invalidatePass()
	{
		this._shader.invalidateShader();

		this.dispatchEvent(new Event(Event.CHANGE));
	}

	public _iIncludeDependencies(shaderObject:ShaderObjectBase)
	{
		this._renderObject._iIncludeDependencies(shaderObject);
		
		if (this._forceSeparateMVP)
			shaderObject.globalPosDependencies++;
	}


	public _iInitConstantData(shaderObject:ShaderObjectBase)
	{

	}

	public _iGetPreLightingVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetPreLightingFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * Indicates whether or not normals are calculated at all.
	 */
	public _pOutputsNormals(shaderObject:ShaderObjectBase):boolean
	{
		return false;
	}

	/**
	 * Indicates whether or not normals are calculated in tangent space.
	 */
	public _pOutputsTangentNormals(shaderObject:ShaderObjectBase):boolean
	{
		return false;
	}

	/**
	 * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
	 * dependencies exist.
	 */
	public _pUsesTangentSpace(shaderObject:ShaderObjectBase):boolean
	{
		return false;
	}
}

export = RenderPassBase;