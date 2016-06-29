import * as library					from "awayjs-core/lib/library";
import * as parsers					from "awayjs-core/lib/parsers";

import {AttributesBuffer}				from "awayjs-core/lib/attributes/AttributesBuffer";
import {BitmapImage2D}				from "awayjs-core/lib/image/BitmapImage2D";
import {BitmapImageCube}				from "awayjs-core/lib/image/BitmapImageCube";
import {Image2D}						from "awayjs-core/lib/image/Image2D";
import {ImageCube}					from "awayjs-core/lib/image/ImageCube";
import {SpecularImage2D}				from "awayjs-core/lib/image/SpecularImage2D";
import {Sampler2D}					from "awayjs-core/lib/image/Sampler2D";
import {SamplerCube}					from "awayjs-core/lib/image/SamplerCube";

import {Stage}						from "awayjs-stagegl/lib/base/Stage";
import * as base					from "awayjs-stagegl/lib/base";
import * as attributes				from "awayjs-stagegl/lib/attributes";
import * as image					from "awayjs-stagegl/lib/image";

import * as partition				from "awayjs-display/lib/partition";
import * as display					from "awayjs-display/lib/display";

import {BasicMaterial}				from "awayjs-display/lib/materials/BasicMaterial";
import {Skybox}						from "awayjs-display/lib/display/Skybox";
import {Billboard}					from "awayjs-display/lib/display/Billboard";
import {LineSegment}					from "awayjs-display/lib/display/LineSegment";
import {LineElements}					from "awayjs-display/lib/graphics/LineElements";
import {TriangleElements}				from "awayjs-display/lib/graphics/TriangleElements";
import {Graphic}						from "awayjs-display/lib/graphics/Graphic";
import {Single2DTexture}				from "awayjs-display/lib/textures/Single2DTexture";
import {SingleCubeTexture}			from "awayjs-display/lib/textures/SingleCubeTexture";

import * as surfaces				from "awayjs-renderergl/lib/surfaces";
import * as elements				from "awayjs-renderergl/lib/elements";
import * as shaders					from "awayjs-renderergl/lib/shaders";
import * as textures				from "awayjs-renderergl/lib/textures";
import * as renderables				from "awayjs-renderergl/lib/renderables";
import {RendererBase}					from "awayjs-renderergl/lib/RendererBase";


library.Loader.enableParser(parsers.Image2DParser);
library.Loader.enableParser(parsers.ImageCubeParser);
library.Loader.enableParser(parsers.TextureAtlasParser);
library.Loader.enableParser(parsers.WaveAudioParser);

base.Stage.registerAbstraction(attributes.GL_AttributesBuffer, AttributesBuffer);
base.Stage.registerAbstraction(image.GL_RenderImage2D, Image2D);
base.Stage.registerAbstraction(image.GL_RenderImageCube, ImageCube);
base.Stage.registerAbstraction(image.GL_BitmapImage2D, BitmapImage2D);
base.Stage.registerAbstraction(image.GL_BitmapImageCube, BitmapImageCube);
base.Stage.registerAbstraction(image.GL_BitmapImage2D, SpecularImage2D);
base.Stage.registerAbstraction(image.GL_Sampler2D, Sampler2D);
base.Stage.registerAbstraction(image.GL_SamplerCube, SamplerCube);

partition.PartitionBase.registerAbstraction(partition.CameraNode, display.Camera);
partition.PartitionBase.registerAbstraction(partition.DirectionalLightNode, display.DirectionalLight);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Sprite);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Shape);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.MovieClip);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Billboard);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.LineSegment);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextField);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextFieldMultiRender);
partition.PartitionBase.registerAbstraction(partition.LightProbeNode, display.LightProbe);
partition.PartitionBase.registerAbstraction(partition.PointLightNode, display.PointLight);
partition.PartitionBase.registerAbstraction(partition.SkyboxNode, display.Skybox);


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

export default class TestBase
{
}