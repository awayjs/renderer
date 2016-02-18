import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/entities/Skybox");
import Billboard					= require("awayjs-display/lib/entities/Billboard");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import LineElements					= require("awayjs-display/lib/graphics/LineElements");
import TriangleElements				= require("awayjs-display/lib/graphics/TriangleElements");
import Graphic						= require("awayjs-display/lib/graphics/Graphic");

import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");
import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import Stage						= require("awayjs-stagegl/lib/base/Stage");


import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import BasicMaterialRender			= require("awayjs-renderergl/lib/render/BasicMaterialRender");
import SkyboxRender					= require("awayjs-renderergl/lib/render/SkyboxRender");
import BillboardRenderable			= require("awayjs-renderergl/lib/renderables/BillboardRenderable");
import LineSegmentRenderable		= require("awayjs-renderergl/lib/renderables/LineSegmentRenderable");
import GraphicRenderable			= require("awayjs-renderergl/lib/renderables/GraphicRenderable");
import SkyboxRenderable				= require("awayjs-renderergl/lib/renderables/SkyboxRenderable");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ElementsPool					= require("awayjs-renderergl/lib/elements/ElementsPool");
import GL_LineElements				= require("awayjs-renderergl/lib/elements/GL_LineElements");
import GL_TriangleElements			= require("awayjs-renderergl/lib/elements/GL_TriangleElements");
import GL_Single2DTexture			= require("awayjs-renderergl/lib/textures/GL_Single2DTexture");
import GL_SingleCubeTexture			= require("awayjs-renderergl/lib/textures/GL_SingleCubeTexture");



RenderPool.registerAbstraction(BasicMaterialRender, BasicMaterial);
RenderPool.registerAbstraction(SkyboxRender, Skybox);

ElementsPool.registerAbstraction(GL_LineElements, LineElements);
ElementsPool.registerAbstraction(GL_TriangleElements, TriangleElements);

ShaderBase.registerAbstraction(GL_Single2DTexture, Single2DTexture);
ShaderBase.registerAbstraction(GL_SingleCubeTexture, SingleCubeTexture);

RendererBase.registerAbstraction(BillboardRenderable, Billboard);
RendererBase.registerAbstraction(LineSegmentRenderable, LineSegment);
RendererBase.registerAbstraction(GraphicRenderable, Graphic);
RendererBase.registerAbstraction(SkyboxRenderable, Skybox);

/**
 *
 * static shim
 */
class renderergl
{
}

export = renderergl;