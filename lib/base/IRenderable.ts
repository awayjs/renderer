import { IAsset } from "@awayjs/core";
import { _Render_RenderableBase } from "./_Render_RenderableBase";
import { _Pick_PickableBase } from "@awayjs/view";


export interface IRenderable extends IAsset
{
	_renderObjects: Record<number, _Render_RenderableBase>;
}