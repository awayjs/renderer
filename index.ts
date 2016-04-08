import * as animators				from "awayjs-renderergl/lib/animators";
import * as elements				from "awayjs-renderergl/lib/elements";
import * as errors					from "awayjs-renderergl/lib/errors";
import * as events					from "awayjs-renderergl/lib/events";
import * as filters					from "awayjs-renderergl/lib/filters";
import * as managers				from "awayjs-renderergl/lib/managers";
import * as renderables				from "awayjs-renderergl/lib/renderables";
import * as shaders					from "awayjs-renderergl/lib/shaders";
import * as sort					from "awayjs-renderergl/lib/sort";
import * as surfaces				from "awayjs-renderergl/lib/surfaces";
import * as textures				from "awayjs-renderergl/lib/textures";
import * as tools					from "awayjs-renderergl/lib/tools";
import * as utils					from "awayjs-renderergl/lib/utils";
import DefaultRenderer				from "awayjs-renderergl/lib/DefaultRenderer";
import DepthRenderer				from "awayjs-renderergl/lib/DepthRenderer";
import DistanceRenderer				from "awayjs-renderergl/lib/DistanceRenderer";
import Filter3DRenderer				from "awayjs-renderergl/lib/Filter3DRenderer";
import RendererBase					from "awayjs-renderergl/lib/RendererBase";

import BasicMaterial				from "awayjs-display/lib/materials/BasicMaterial";
import Skybox						from "awayjs-display/lib/display/Skybox";
import Billboard					from "awayjs-display/lib/display/Billboard";
import LineSegment					from "awayjs-display/lib/display/LineSegment";
import LineElements					from "awayjs-display/lib/graphics/LineElements";
import TriangleElements				from "awayjs-display/lib/graphics/TriangleElements";
import Graphic						from "awayjs-display/lib/graphics/Graphic";
import Single2DTexture				from "awayjs-display/lib/textures/Single2DTexture";
import SingleCubeTexture			from "awayjs-display/lib/textures/SingleCubeTexture";


surfaces.SurfacePool.registerAbstraction(surfaces.GL_BasicMaterialSurface, BasicMaterial);
surfaces.SurfacePool.registerAbstraction(surfaces.GL_SkyboxSurface, Skybox);

elements.ElementsPool.registerAbstraction(elements.GL_LineElements, LineElements);
elements.ElementsPool.registerAbstraction(elements.GL_TriangleElements, TriangleElements);

shaders.ShaderBase.registerAbstraction(textures.GL_Single2DTexture, Single2DTexture);
shaders.ShaderBase.registerAbstraction(textures.GL_SingleCubeTexture, SingleCubeTexture);

RendererBase.registerAbstraction(renderables.GL_BillboardRenderable, Billboard);
RendererBase.registerAbstraction(renderables.GL_LineSegmentRenderable, LineSegment);
RendererBase.registerAbstraction(renderables.GL_GraphicRenderable, Graphic);
RendererBase.registerAbstraction(renderables.GL_SkyboxRenderable, Skybox);

export {
	animators,
	elements,
	errors,
	events,
	filters,
	managers,
	renderables,
	shaders,
	sort,
	surfaces,
	textures,
	tools,
	utils,
	DefaultRenderer,
	DepthRenderer,
	DistanceRenderer,
	Filter3DRenderer,
	RendererBase
}