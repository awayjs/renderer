import BasicMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import Skybox						= require("awayjs-display/lib/display/Skybox");
import Billboard					= require("awayjs-display/lib/display/Billboard");
import LineSegment					= require("awayjs-display/lib/display/LineSegment");
import LineElements					= require("awayjs-display/lib/graphics/LineElements");
import TriangleElements				= require("awayjs-display/lib/graphics/TriangleElements");
import Graphic						= require("awayjs-display/lib/graphics/Graphic");

import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");
import SingleCubeTexture			= require("awayjs-display/lib/textures/SingleCubeTexture");

import Stage						= require("awayjs-stagegl/lib/base/Stage");


import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import SurfacePool					= require("awayjs-renderergl/lib/surfaces/SurfacePool");
import GL_BasicMaterialSurface		= require("awayjs-renderergl/lib/surfaces/GL_BasicMaterialSurface");
import GL_SkyboxSurface				= require("awayjs-renderergl/lib/surfaces/GL_SkyboxSurface");
import GL_BillboardRenderable		= require("awayjs-renderergl/lib/renderables/GL_BillboardRenderable");
import GL_LineSegmentRenderable		= require("awayjs-renderergl/lib/renderables/GL_LineSegmentRenderable");
import GL_GraphicRenderable			= require("awayjs-renderergl/lib/renderables/GL_GraphicRenderable");
import GL_SkyboxRenderable			= require("awayjs-renderergl/lib/renderables/GL_SkyboxRenderable");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ElementsPool					= require("awayjs-renderergl/lib/elements/ElementsPool");
import GL_LineElements				= require("awayjs-renderergl/lib/elements/GL_LineElements");
import GL_TriangleElements			= require("awayjs-renderergl/lib/elements/GL_TriangleElements");
import GL_Single2DTexture			= require("awayjs-renderergl/lib/textures/GL_Single2DTexture");
import GL_SingleCubeTexture			= require("awayjs-renderergl/lib/textures/GL_SingleCubeTexture");



SurfacePool.registerAbstraction(GL_BasicMaterialSurface, BasicMaterial);
SurfacePool.registerAbstraction(GL_SkyboxSurface, Skybox);

ElementsPool.registerAbstraction(GL_LineElements, LineElements);
ElementsPool.registerAbstraction(GL_TriangleElements, TriangleElements);

ShaderBase.registerAbstraction(GL_Single2DTexture, Single2DTexture);
ShaderBase.registerAbstraction(GL_SingleCubeTexture, SingleCubeTexture);

RendererBase.registerAbstraction(GL_BillboardRenderable, Billboard);
RendererBase.registerAbstraction(GL_LineSegmentRenderable, LineSegment);
RendererBase.registerAbstraction(GL_GraphicRenderable, Graphic);
RendererBase.registerAbstraction(GL_SkyboxRenderable, Skybox);

/**
 *
 * static shim
 */
class renderergl
{
}

export = renderergl;