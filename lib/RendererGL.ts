import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import CurveSubMesh					= require("awayjs-display/lib/base/CurveSubMesh");
import CurveSubGeometry				= require("awayjs-display/lib/base/CurveSubGeometry");
import LineSubMesh					= require("awayjs-display/lib/base/LineSubMesh");
import LineSubGeometry				= require("awayjs-display/lib/base/LineSubGeometry");
import TriangleSubMesh				= require("awayjs-display/lib/base/TriangleSubMesh");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");
import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import Stage						= require("awayjs-stagegl/lib/base/Stage");


import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import BasicMaterialRender			= require("awayjs-renderergl/lib/render/BasicMaterialRender");
import SkyboxRender					= require("awayjs-renderergl/lib/render/SkyboxRender");
import BillboardRenderable			= require("awayjs-renderergl/lib/renderables/BillboardRenderable");
import LineSegmentRenderable		= require("awayjs-renderergl/lib/renderables/LineSegmentRenderable");
import LineSubMeshRenderable		= require("awayjs-renderergl/lib/renderables/LineSubMeshRenderable");
import TriangleSubMeshRenderable	= require("awayjs-renderergl/lib/renderables/TriangleSubMeshRenderable");
import CurveSubMeshRenderable		= require("awayjs-renderergl/lib/renderables/CurveSubMeshRenderable");
import SkyboxRenderable				= require("awayjs-renderergl/lib/renderables/SkyboxRenderable");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import CurveSubGeometryVO			= require("awayjs-renderergl/lib/vos/CurveSubGeometryVO");
import LineSubGeometryVO			= require("awayjs-renderergl/lib/vos/LineSubGeometryVO");
import TriangleSubGeometryVO		= require("awayjs-renderergl/lib/vos/TriangleSubGeometryVO");
import Single2DTextureVO			= require("awayjs-renderergl/lib/vos/Single2DTextureVO");
import SingleCubeTextureVO			= require("awayjs-renderergl/lib/vos/SingleCubeTextureVO");

Stage.registerAbstraction(CurveSubGeometryVO, CurveSubGeometry);
Stage.registerAbstraction(LineSubGeometryVO, LineSubGeometry);
Stage.registerAbstraction(TriangleSubGeometryVO, TriangleSubGeometry);

RenderPool.registerAbstraction(BasicMaterialRender, BasicMaterial);
RenderPool.registerAbstraction(SkyboxRender, Skybox);

ShaderBase.registerAbstraction(Single2DTextureVO, Single2DTexture);
ShaderBase.registerAbstraction(SingleCubeTextureVO, SingleCubeTexture);

RendererBase.registerAbstraction(BillboardRenderable, Billboard);
RendererBase.registerAbstraction(LineSegmentRenderable, LineSegment);
RendererBase.registerAbstraction(TriangleSubMeshRenderable, TriangleSubMesh);
RendererBase.registerAbstraction(LineSubMeshRenderable, LineSubMesh);
RendererBase.registerAbstraction(CurveSubMeshRenderable, CurveSubMesh);
RendererBase.registerAbstraction(SkyboxRenderable, Skybox);

/**
 *
 * static shim
 */
class renderergl
{
	public static test:number = 0;

	private static main = renderergl.addDefaults();

	private static addDefaults()
	{
		RenderPool.registerAbstraction(BasicMaterialRender, BasicMaterial);
		RenderPool.registerAbstraction(SkyboxRender, Skybox);

	}
}

export = renderergl;