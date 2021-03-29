import { IEventDispatcher, Matrix3D } from '@awayjs/core';
import { ContainerNode, INode } from '@awayjs/view';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { RenderGroup } from '../RenderGroup';

export interface IRenderable extends IEventDispatcher
{
	cascaded: boolean;

	materialID: number;

	renderOrderId: number;

	zIndex: number;

	next: IRenderable;

	readonly node: INode;

	renderMaterial: _Render_MaterialBase;

	stageElements: _Stage_ElementsBase;

	maskId: number;

	maskOwners: ContainerNode[];

	renderSceneTransform: Matrix3D;

	renderGroup: RenderGroup;

	executeRender(
		enableDepthAndStencil?: boolean, surfaceSelector?: number, mipmapSelector?: number, maskConfig?: number): void;
}