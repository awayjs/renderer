import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");
import Camera						= require("awayjs-display/lib/entities/Camera");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");

/**
 * @class away.pool.RenderableListItem
 */
class BillboardRenderable extends RenderableBase
{

	private static _samplerGeometry:Object = new Object();

	public static vertexAttributesOffset:number = 1;

	/**
	 *
	 */
	private _billboard:Billboard;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param billboard
	 */
	constructor(billboard:Billboard, renderer:RendererBase)
	{
		super(billboard, billboard, billboard.material, renderer);

		this._billboard = billboard;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._billboard = null;
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleSubGeometry}
	 */
	public _pGetSubGeometry():SubGeometryBase
	{
		var texture:TextureBase = this._billboard.material.getTextureAt(0);

		var id:number = -1;

		if (texture)
			id = ((this.renderableOwner.style? this.renderableOwner.style.getSamplerAt(texture) || texture.getSamplerAt(0) : texture.getSamplerAt(0)) || DefaultMaterialManager.getDefaultSampler()).id;

		var geometry:TriangleSubGeometry = BillboardRenderable._samplerGeometry[id];

		var width:number = this._billboard.billboardWidth;
		var height:number = this._billboard.billboardHeight;
		var billboardRect:Rectangle = this._billboard.billboardRect;

		if (!geometry) {
			geometry = BillboardRenderable._samplerGeometry[id] = new TriangleSubGeometry(new AttributesBuffer(11, 4));
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.setIndices(Array<number>(0, 1, 2, 0, 2, 3));
			geometry.setPositions(Array<number>(-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
			geometry.setNormals(Array<number>(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0));
			geometry.setTangents(Array<number>(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1));
			geometry.setUVs(Array<number>(0, 0, 1, 0, 1, 1, 0, 1));
		} else {
			geometry.setPositions(Array<number>(-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, height-billboardRect.y, 0, width-billboardRect.x, -billboardRect.y, 0, -billboardRect.x, -billboardRect.y, 0));
		}

		return geometry;
	}

	public _pGetRenderOwner():IRenderOwner
	{
		return this._billboard.material;
	}

	public static _iIncludeDependencies(shader:ShaderBase)
	{

	}

	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		//get the projection coordinates
		var position:ShaderRegisterElement = (shader.globalPosDependencies > 0)? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;

		//reserving vertex constants for projection matrix
		var viewMatrixReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shader.viewMatrixIndex = viewMatrixReg.index*4;

		if (shader.projectionDependencies > 0) {
			sharedRegisters.projectionFragment = registerCache.getFreeVarying();
			var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" +
			"mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
			"mov op, " + temp + "\n";
		} else {
			code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
		}

		return code;
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(pass:PassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._setRenderState(pass, camera, viewProjection);

		var shader:ShaderBase = pass.shader;

		if (shader.sceneMatrixIndex >= 0) {
			this.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
			viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		} else {
			var matrix3D:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;

			matrix3D.copyFrom(this.sourceEntity.getRenderSceneTransform(camera));
			matrix3D.append(viewProjection);

			matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		}

		var context:IContextGL = this._stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shader.vertexConstantData, shader.numUsedVertexConstants);
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shader.fragmentConstantData, shader.numUsedFragmentConstants);
	}
}

export = BillboardRenderable;