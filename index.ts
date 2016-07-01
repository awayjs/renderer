import * as animators				from "./lib/animators";
import * as elements				from "./lib/elements";
import * as errors					from "./lib/errors";
import * as events					from "./lib/events";
import * as filters					from "./lib/filters";
import * as managers				from "./lib/managers";
import * as renderables				from "./lib/renderables";
import * as shaders					from "./lib/shaders";
import * as sort					from "./lib/sort";
import * as surfaces				from "./lib/surfaces";
import * as textures				from "./lib/textures";
import * as tools					from "./lib/tools";
import * as utils					from "./lib/utils";
import {DefaultRenderer}				from "./lib/DefaultRenderer";
import {DepthRenderer}				from "./lib/DepthRenderer";
import {DistanceRenderer}				from "./lib/DistanceRenderer";
import {Filter3DRenderer}				from "./lib/Filter3DRenderer";
import {RendererBase}					from "./lib/RendererBase";

import {BasicMaterial}				from "@awayjs/display/lib/materials/BasicMaterial";
import {Skybox}						from "@awayjs/display/lib/display/Skybox";
import {Billboard}					from "@awayjs/display/lib/display/Billboard";
import {LineSegment}					from "@awayjs/display/lib/display/LineSegment";
import {LineElements}					from "@awayjs/display/lib/graphics/LineElements";
import {TriangleElements}				from "@awayjs/display/lib/graphics/TriangleElements";
import {Graphic}						from "@awayjs/display/lib/graphics/Graphic";
import {Single2DTexture}				from "@awayjs/display/lib/textures/Single2DTexture";
import {SingleCubeTexture}			from "@awayjs/display/lib/textures/SingleCubeTexture";

import {Stage}						from "@awayjs/stage/lib/base/Stage";

surfaces.SurfacePool.registerAbstraction(surfaces.GL_BasicMaterialSurface, BasicMaterial);
surfaces.SurfacePool.registerAbstraction(surfaces.GL_SkyboxSurface, Skybox);

Stage.registerAbstraction(elements.GL_LineElements, LineElements);
Stage.registerAbstraction(elements.GL_TriangleElements, TriangleElements);

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