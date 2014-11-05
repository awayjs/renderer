import Plane3D						= require("awayjs-core/lib/geom/Plane3D");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import TextureProxyBase				= require("awayjs-core/lib/textures/TextureProxyBase");

import Camera						= require("awayjs-display/lib/entities/Camera");
import IEntity						= require("awayjs-display/lib/entities/IEntity");
import EntityCollector				= require("awayjs-display/lib/traverse/EntityCollector");
import ShadowCasterCollector		= require("awayjs-display/lib/traverse/ShadowCasterCollector");

import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");

import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");
import MaterialData					= require("awayjs-renderergl/lib/pool/MaterialData");
import MaterialPassData				= require("awayjs-renderergl/lib/pool/MaterialPassData");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import MaterialPassGLBase			= require("awayjs-renderergl/lib/passes/MaterialPassGLBase");


/**
 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
 *
 * @class away.render.DepthRenderer
 */
class DepthRenderer extends RendererBase
{
	private _pass:MaterialPassGLBase;
	private _renderBlended:boolean;
	private _disableColor:boolean;

	/**
	 * Creates a new DepthRenderer object.
	 * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	 * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	 */
	constructor(pass:MaterialPassGLBase, renderBlended:boolean = false)
	{
		super();

		this._pass = pass;

		this._renderBlended = renderBlended;
		this._iBackgroundR = 1;
		this._iBackgroundG = 1;
		this._iBackgroundB = 1;

	}

	public get disableColor():boolean
	{
		return this._disableColor;
	}

	public set disableColor(value:boolean)
	{
		this._disableColor = value;
	}

	public _iRenderCascades(entityCollector:ShadowCasterCollector, target:TextureProxyBase, numCascades:number, scissorRects:Array<Rectangle>, cameras:Array<Camera>)
	{
		this.pCollectRenderables(entityCollector);

		this._pStage.setRenderTarget(target, true, 0);
		this._pContext.clear(1, 1, 1, 1, 1, 0);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

		var head:RenderableBase = this._pOpaqueRenderableHead;

		var first:boolean = true;

		for (var i:number = numCascades - 1; i >= 0; --i) {
			this._pStage.scissorRect = scissorRects[i];
			this.drawCascadeRenderables(head, cameras[i], first? null : cameras[i].frustumPlanes);
			first = false;
		}

		//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
		this._pContext.setDepthTest(false, ContextGLCompareMode.LESS_EQUAL);

		this._pStage.scissorRect = null;

	}

	private drawCascadeRenderables(renderable:RenderableBase, camera:Camera, cullPlanes:Array<Plane3D>)
	{
		var activePass:MaterialPassData;
		var activeMaterial:MaterialData;
		var context:IContextGL = this._pStage.context;
		var renderable2:RenderableBase;

		while (renderable) {
			activeMaterial = this.getMaterial(renderable.material, this._pStage.profile);

			renderable2 = renderable;

			activePass = activeMaterial.getMaterialPass(this._pass, this._pStage.profile);

			//TODO: generalise this test
			if (activePass.key == "")
				this.calcAnimationCode(renderable.material, activePass);

			renderable.material._iActivatePass(activePass, this, camera);

			do {
				// if completely in front, it will fall in a different cascade
				// do not use near and far planes
				if (!cullPlanes || renderable2.sourceEntity.worldBounds.isInFrustum(cullPlanes, 4)) {
					renderable2.material._iRenderPass(activePass, renderable2, this._pStage, camera, this._pRttViewProjectionMatrix);
				} else {
					renderable2.cascaded = true;
				}

				renderable2 = renderable2.next;

			} while (renderable2 && renderable2.material == renderable.material && !renderable2.cascaded);

			renderable.material._iDeactivatePass(activePass, this);

			renderable = renderable2;
		}
	}

	/**
	 * @inheritDoc
	 */
	public pDraw(entityCollector:EntityCollector, target:TextureProxyBase)
	{
		this.pCollectRenderables(entityCollector);

		this._pContext.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);

		this._pContext.setDepthTest(true, ContextGLCompareMode.LESS);

		this.drawRenderables(this._pOpaqueRenderableHead, entityCollector);

		if (this._disableColor)
			this._pContext.setColorMask(false, false, false, false);

		if (this._renderBlended)
			this.drawRenderables(this._pBlendedRenderableHead, entityCollector);

		if (this._disableColor)
			this._pContext.setColorMask(true, true, true, true);
	}

	/**
	 * Draw a list of renderables.
	 * @param renderables The renderables to draw.
	 * @param entityCollector The EntityCollector containing all potentially visible information.
	 */
	private drawRenderables(renderable:RenderableBase, entityCollector:EntityCollector)
	{
		var activePass:MaterialPassData;
		var activeMaterial:MaterialData;
		var context:IContextGL = this._pStage.context;
		var camera:Camera = entityCollector.camera;
		var renderable2:RenderableBase;

		while (renderable) {
			activeMaterial = this.getMaterial(renderable.material, this._pStage.profile);

			// otherwise this would result in depth rendered anyway because fragment shader kil is ignored
			if (this._disableColor && renderable.material.alphaThreshold != 0) {
				renderable2 = renderable;
				// fast forward
				do {
					renderable2 = renderable2.next;

				} while (renderable2 && renderable2.material == renderable.material);
			} else {
				renderable2 = renderable;

				activePass = activeMaterial.getMaterialPass(this._pass, this._pStage.profile);

				//TODO: generalise this test
				if (activePass.key == "")
					this.calcAnimationCode(renderable.material, activePass);

				renderable.material._iActivatePass(activePass, this, camera);

				do {
					renderable2.material._iRenderPass(activePass, renderable2, this._pStage, camera, this._pRttViewProjectionMatrix);

					renderable2 = renderable2.next;

				} while (renderable2 && renderable2.material == renderable.material);

				renderable.material._iDeactivatePass(activePass, this);
			}

			renderable = renderable2;
		}
	}
}

export = DepthRenderer;